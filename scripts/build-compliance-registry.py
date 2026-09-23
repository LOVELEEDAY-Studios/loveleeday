"""Merges data/compliance/registry/raw/*.json into data/compliance/registry/registry.json.

Same rule as build-compliance-data.py (the DC calendars): nothing typed by hand,
every item traceable to an official source. This script enforces it:

  - an item whose source_url is not an official government / standards-body
    domain is demoted to verified=false and flagged, never silently kept
  - an item with exists=true but no citation or no source_url is flagged
  - duplicate ids fail the build

  python3 scripts/build-compliance-registry.py [--strict]   (--strict exits 1 on any flag)
"""
import json
import sys
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data/compliance/registry/raw"
OUT = ROOT / "data/compliance/registry/registry.json"

OFFICIAL_SUFFIXES = (".gov", ".us", ".mil")
OFFICIAL_HOSTS = {
    "pcisecuritystandards.org", "privacy.a4l.org", "govramp.org", "stateramp.org",
    "aicpa-cima.com", "us.aicpa.org", "www.aicpa-cima.com", "americanbar.org", "www.americanbar.org",
    "iso.org", "www.iso.org", "legislature.mi.gov", "codes.ohio.gov", "law.lis.virginia.gov",
    "leginfo.legislature.ca.gov", "malegislature.gov", "www.malegislature.gov",
}

# Official state code publishers that sit outside .gov/.us: the Maine and North
# Carolina legislatures, Oklahoma's court network (the state's public code
# host), and New Mexico's Compilation Commission.
OFFICIAL_HOSTS |= {"mainelegislature.org", "ncleg.net", "oscn.net", "nmonesource.com"}
# Georgia and Mississippi designate LexisNexis as the public-access host for
# their official codes, but only these paths, never lexisnexis.com generally.
OFFICIAL_PATHS = {"lexisnexis.com": ("/hottopics/gacode", "/hottopics/mscode")}


def official(url: str) -> bool:
    parsed = urlparse(url or "")
    host = (parsed.hostname or "").lower().removeprefix("www.")
    if not host:
        return False
    if any(host == h.removeprefix("www.") or host.endswith("." + h.removeprefix("www.")) for h in OFFICIAL_HOSTS):
        return True
    if host in OFFICIAL_PATHS:
        return parsed.path.lower().startswith(OFFICIAL_PATHS[host])
    return host.endswith(OFFICIAL_SUFFIXES)


def main(strict: bool) -> int:
    items, flags = [], []
    for f in sorted(RAW.glob("*.json")):
        try:
            data = json.loads(f.read_text())
        except json.JSONDecodeError as e:
            flags.append(f"{f.name}: invalid JSON ({e})")
            continue
        for it in data.get("items", []):
            it["_file"] = f.name
            if it.get("exists", True):
                if not it.get("citation"):
                    flags.append(f"{it.get('id')}: exists but no citation")
                if not it.get("source_url"):
                    flags.append(f"{it.get('id')}: exists but no source_url")
                    it["verified"] = False
                elif not official(it["source_url"]):
                    flags.append(f"{it.get('id')}: non-official source {urlparse(it['source_url']).hostname}")
                    it["verified"] = False
                    it["uncertainty"] = ((it.get("uncertainty") or "") + " [build: source is not an official domain]").strip()
                for step in it.get("how_to_comply") or []:
                    if isinstance(step, dict) and step.get("source_url") and not official(step["source_url"]):
                        flags.append(f"{it.get('id')}: how_to_comply step cites non-official {urlparse(step['source_url']).hostname}")
            items.append(it)

    # Second-pass rechecks (rendered official pages). An upgrade applies only
    # after its new source passes the same official-domain test.
    by_id = {i.get("id"): i for i in items}
    for rf in sorted(RAW.parent.glob("rechecks-*.json")):
        rc = json.loads(rf.read_text())
        for iid, up in rc.get("upgrades", {}).items():
            it = by_id.get(iid)
            if not it:
                flags.append(f"{rf.name}: recheck for unknown id {iid}")
                continue
            if not official(up["source_url"]):
                flags.append(f"{iid}: recheck source not official")
                continue
            it["source_url"] = up["source_url"]
            it["verified"] = True
            it["verification"] = {"method": "rendered official page", "checked": rc.get("checked"), "note": up["note"], "log": rf.name}

    dupes = [k for k, n in Counter(i.get("id") for i in items).items() if n > 1]
    if dupes:
        print("duplicate ids:", dupes)
        return 1

    items.sort(key=lambda i: (i.get("level") != "federal", i.get("jurisdiction", ""), i.get("domain", "")))
    for i in items:
        i.pop("_file", None)
    states = sorted({i["jurisdiction"] for i in items if i.get("level") == "state"})
    summary = {
        "items": len(items),
        "verified": sum(1 for i in items if i.get("verified")),
        "exists_false": sum(1 for i in items if i.get("exists") is False),
        "jurisdictions": len(states),
        "flags": len(flags),
    }
    OUT.write_text(json.dumps({"generated": "2026-09-23", "summary": summary, "flags": flags, "items": items}, indent=1))
    print(json.dumps(summary))
    for fl in flags:
        print("FLAG", fl)
    return 1 if (strict and flags) else 0


if __name__ == "__main__":
    sys.exit(main("--strict" in sys.argv))
