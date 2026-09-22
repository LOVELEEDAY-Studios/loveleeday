#!/usr/bin/env python3
"""
portal-frames — the card and preview images a client portal entry needs.

A Deliverable carries `card` (the gallery crop) and `preview` (the full-page
strip). Both are derived from the study page and had no producer for any study
built after the original six, so a new portal entry pointed at files that did
not exist and rendered a broken image with nothing failing.

  python3 scripts/portal-frames.py enable

card.jpg    1200x750, the fold — what the gallery shows
preview.jpg 1200 wide, the whole page scaled — the strip down the side
"""
import io, sys
from pathlib import Path
from patchright.sync_api import sync_playwright
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent

SCROLL = """async () => {
  const step = Math.floor(window.innerHeight * 0.7);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 200));
  }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 500));
}"""

if len(sys.argv) != 2:
    print(__doc__); sys.exit(1)

slug = sys.argv[1]
d = ROOT / "public" / "portal" / slug
study = d / "index.html"
if not study.exists():
    print(f"no study at {study}"); sys.exit(2)

with sync_playwright() as pw:
    b = pw.chromium.launch(channel="chrome", headless=True)
    pg = b.new_page(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
    pg.goto(f"file://{study}", wait_until="load", timeout=45000)
    pg.wait_for_timeout(1200)
    pg.evaluate(SCROLL)

    fold = Image.open(io.BytesIO(pg.screenshot(full_page=False))).convert("RGB")
    fold.resize((1200, 750), Image.LANCZOS).save(d / "card.jpg", quality=88)

    full = Image.open(io.BytesIO(pg.screenshot(full_page=True))).convert("RGB")
    w, h = full.size
    full.resize((1200, round(h * 1200 / w)), Image.LANCZOS).save(d / "preview.jpg", quality=84)
    print(f"card.jpg    1200x750  (from {fold.size})")
    print(f"preview.jpg 1200x{round(h * 1200 / w)}  (from {full.size})")
    b.close()
