#!/usr/bin/env python3
"""
case-frames — the 1440x900 before/after pair a portfolio case needs.

BeforeAfter renders both images at a fixed 1440x900, so a frame captured at any
other size is silently squashed by the browser rather than failing. Both sides
are captured at exactly that viewport, not resized afterwards.

BEFORE is the prospect's live site; AFTER is our rebuilt study. Both are scrolled
before capture — the live sites lazy-load and our studies gate sections behind an
IntersectionObserver, and either one un-scrolled captures as a blank page.

  python3 scripts/case-frames.py lightship enable https://enableinjections.com/
"""
import io, sys
from pathlib import Path
from patchright.sync_api import sync_playwright
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
W, H = 1440, 900

SCROLL = """async () => {
  const step = Math.floor(window.innerHeight * 0.7);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 200));
  }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 500));
}"""


def shot(pg, url, out):
    pg.goto(url, wait_until="load", timeout=45000)
    pg.wait_for_timeout(1200)
    pg.evaluate(SCROLL)
    title = (pg.title() or "").strip()
    if "just a moment" in title.lower():
        print(f"  BLOCKED by bot challenge — refusing to save a false frame ({title[:40]})")
        return None
    im = Image.open(io.BytesIO(pg.screenshot(full_page=False))).convert("RGB")
    im.save(out, quality=90)
    return title, im.size


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(__doc__); sys.exit(1)
    fund, slug, live_url = sys.argv[1], sys.argv[2], sys.argv[3]
    out_dir = ROOT / "public" / "portal" / fund
    out_dir.mkdir(parents=True, exist_ok=True)
    study = ROOT / "public" / "portal" / slug / "index.html"
    if not study.exists():
        print(f"no study at {study}"); sys.exit(2)

    with sync_playwright() as pw:
        b = pw.chromium.launch(channel="chrome", headless=True)
        pg = b.new_page(viewport={"width": W, "height": H}, reduced_motion="reduce", device_scale_factor=1)
        print(f"before  {live_url}")
        r1 = shot(pg, live_url, out_dir / f"{slug}-before.jpg")
        print(f"        {r1}")
        print(f"after   {study}")
        r2 = shot(pg, f"file://{study}", out_dir / f"{slug}-after.jpg")
        print(f"        {r2}")
        b.close()
    print(f"wrote {out_dir}/{slug}-before.jpg and -after.jpg")
