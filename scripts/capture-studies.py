#!/usr/bin/env python3
"""
capture-studies — regenerate every DERIVED image the portfolio depends on.

Why this exists: the before/after slider frames, the gallery cards and the
preview strips are all derived from the study pages, and nothing regenerated
them when a study changed. On 2026-09-20 that bit three times in one day — the
portfolio kept advertising a Novarna design that had already been replaced, and
each time the only thing that caught it was Daniel looking at the page. A
derived artifact with no producer is a stale artifact with a countdown.

  python3 scripts/capture-studies.py            regenerate everything
  python3 scripts/capture-studies.py --check    render and compare; exit 2 on drift
  python3 scripts/capture-studies.py --only novarna

--check is the point. It turns "did I remember to recapture?" into a question
the machine answers, and it is what belongs in front of a deploy.
"""
import sys, io, os, json, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STUDIES = ["micruity", "janta", "fyxit", "novarna", "soarce", "loanwell"]
BASE = os.environ.get("CAPTURE_BASE", "http://localhost:3111")
DRIFT_PCT = 2.0          # % of pixels that may differ before a frame is stale

def tokens():
    env = {}
    for line in (ROOT / ".env.local").read_text().splitlines():
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"\'')
    return {k.split("_")[-1].lower(): v for k, v in env.items()
            if k.startswith(("PORTAL_TOKEN", "PORTFOLIO_TOKEN"))}

def main():
    from patchright.sync_api import sync_playwright
    from PIL import Image, ImageChops

    check = "--check" in sys.argv
    only = None
    if "--only" in sys.argv:
        only = sys.argv[sys.argv.index("--only") + 1]
    tok = tokens()
    targets = [s for s in STUDIES if not only or s == only]
    drift, wrote = [], []

    with sync_playwright() as pw:
        b = pw.chromium.launch()
        for slug in targets:
            url = f"{BASE}/portal/{slug}/index.html?k={tok[slug]}"
            outs = [
                # (path, viewport, full_page)
                (ROOT / f"public/portal/collab/{slug}-after.jpg", (1440, 900), False),
                (ROOT / f"public/portal/{slug}/card.jpg",         (1400, 1780), False),
                (ROOT / f"public/portal/{slug}/preview.jpg",      (1440, 1200), True),
            ]
            for path, vp, full in outs:
                # Capture with reduced motion. Five of the six studies animate,
                # and Fyxit's chat loops -- so without this the page never looks
                # the same twice and --check reports drift on a file nobody
                # touched. A guard that cries wolf is a guard that gets ignored.
                # Every study honours prefers-reduced-motion, which is what makes
                # this deterministic rather than merely slower.
                ctx = b.new_context(viewport={"width": vp[0], "height": vp[1]},
                                    reduced_motion="reduce")
                pg = ctx.new_page()
                pg.goto(url, wait_until="domcontentloaded")
                pg.wait_for_timeout(3200)
                if full:
                    h = pg.evaluate("document.body.scrollHeight")
                    for y in range(0, h, 800):
                        pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(200)
                    pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(1400)
                fresh = Image.open(io.BytesIO(pg.screenshot(full_page=full))).convert("RGB")
                ctx.close()

                if check:
                    if not path.exists():
                        drift.append((path.name, "MISSING")); continue
                    stored = Image.open(path).convert("RGB")
                    if stored.size != fresh.size:
                        drift.append((path.name, f"size {stored.size} -> {fresh.size}")); continue
                    diff = ImageChops.difference(stored, fresh).convert("L")
                    px = list(diff.getdata())  # noqa: Pillow 14 renames this to get_flattened_data
                    pct = sum(1 for v in px if v > 18) / len(px) * 100
                    if pct > DRIFT_PCT:
                        drift.append((path.name, f"{pct:.1f}% of pixels changed"))
                else:
                    fresh.save(path, quality=84, optimize=True)
                    wrote.append(f"{path.name} {fresh.size[0]}x{fresh.size[1]}")
        b.close()

    if check:
        if drift:
            print("STALE — these derived frames no longer match their page:")
            for n, why in drift:
                print(f"  {n:<26} {why}")
            print("\nrun: python3 scripts/capture-studies.py")
            sys.exit(2)
        print(f"all derived frames current ({len(targets)*3} checked)")
    else:
        for w in wrote:
            print("wrote", w)
        print(f"{len(wrote)} frames regenerated")

if __name__ == "__main__":
    main()
