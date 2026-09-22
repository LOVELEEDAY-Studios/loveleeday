#!/usr/bin/env python3
"""
study-photos — licensed photography for a portal study, with its credit.

Every study that carries people uses real licensed stock from Pexels, credited
on the page. An earlier version of the Micruity study used AI-generated people
and Daniel replaced it, so the rule is: real photographs of real people, or no
people at all. This fetches them and writes the credit alongside, because a photo
downloaded without its photographer's name cannot be published and will quietly
become a photo nobody can prove we are allowed to use.

Landscape only, large enough for a full-bleed band, and written as progressive
JPEG at a width the page actually renders.

  python3 scripts/study-photos.py venturehue \
      founders:"black founders meeting startup" \
      workshop:"business workshop presentation audience"
"""
import json, subprocess, sys, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VAULT = Path.home() / ".arthur" / "vault" / "pexels.env"
W = 1600


def key():
    for line in VAULT.read_text().splitlines():
        if line.startswith("PEXELS_API_KEY="):
            return line.split("=", 1)[1].strip().strip("\"'")
    raise SystemExit(f"no PEXELS_API_KEY in {VAULT}")


def search(k, q):
    """Both Pexels hosts fingerprint the CLIENT, not the User-Agent — curl is
    served and urllib is refused with 403 even holding a valid key. So every
    request here goes through curl."""
    url = "https://api.pexels.com/v1/search?" + urllib.parse.urlencode(
        {"query": q, "orientation": "landscape", "size": "large", "per_page": 12}
    )
    r = subprocess.run(
        ["curl", "-fsS", "--max-time", "30", "-H", f"Authorization: {k}", url],
        capture_output=True, text=True,
    )
    if r.returncode != 0:
        raise SystemExit(f"search failed for {q!r}: {r.stderr.strip()[:120]}")
    return json.loads(r.stdout)["photos"]


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(1)
    slug, specs = sys.argv[1], sys.argv[2:]
    out = ROOT / "public" / "portal" / slug
    if not out.exists():
        print(f"no study at {out}"); sys.exit(2)

    k = key()
    credits = []
    for spec in specs:
        name, _, query = spec.partition(":")
        # An index suffix picks a later result when the first is wrong for the page.
        pick = 0
        if "#" in query:
            query, _, n = query.partition("#")
            pick = int(n)
        photos = search(k, query)
        if len(photos) <= pick:
            print(f"  {name}: only {len(photos)} results for {query!r} — skipped")
            continue
        p = photos[pick]
        # The API key authenticates the SEARCH only. images.pexels.com sits
        # behind a CDN that fingerprints the CLIENT, not the User-Agent: curl
        # gets 200, urllib gets 403 with a browser UA set, because the TLS and
        # HTTP/2 signature gives it away. Shelling out to curl is the fix, not a
        # workaround — measured both ways on 2026-09-22.
        src = f"{p['src']['original']}?auto=compress&cs=tinysrgb&w={W}"
        dest = out / f"{name}.jpg"
        r = subprocess.run(
            ["curl", "-fsS", "--max-time", "60", "-o", str(dest), src],
            capture_output=True, text=True,
        )
        if r.returncode != 0:
            print(f"  {name}: download failed — {r.stderr.strip()[:80]}")
            continue
        credits.append({"file": dest.name, "photographer": p["photographer"], "url": p["url"], "query": query})
        print(f"  {dest.name:<16} {p['photographer']:<24} {dest.stat().st_size // 1024} KB")

    if credits:
        # MERGE, never overwrite. Re-running for one bad photo used to drop the
        # credits for the three good ones already on the page, which would ship
        # uncredited licensed work — the one thing this manifest exists to stop.
        man = out / "photo-credits.json"
        existing = json.loads(man.read_text()) if man.exists() else []
        by_file = {c["file"]: c for c in existing}
        by_file.update({c["file"]: c for c in credits})
        # A credit for a file that is no longer on disk is noise; drop it.
        merged = [c for c in by_file.values() if (out / c["file"]).exists()]
        man.write_text(json.dumps(sorted(merged, key=lambda c: c["file"]), indent=2))
        print(f"\ncredits -> {man.relative_to(ROOT)}  ({len(merged)} photos)")
        print("Credit line for the page footer:")
        print("Photography: " + ", ".join(sorted({c["photographer"] for c in merged})) + " (Pexels)")
