#!/usr/bin/env python3
"""
board-shots — full-page PNG of every portal study, for the review board.

Static snapshots rather than live iframes on purpose: a board of 8+ real pages
in iframes never reaches network idle and tiles sit blank, which reads as a
broken board rather than a slow one.

Two things these pages do that break a naive capture, both learned 2026-09-22:
  - scroll-reveal sections sit at opacity:0 until an IntersectionObserver fires,
    so a straight screenshot shows empty bands. Reduced-motion emulation kills
    the transition; scrolling covers the rest.
  - lazy-loaded images never request unless the page is scrolled.

  python3 scripts/board-shots.py
"""
import json, os
from pathlib import Path
from patchright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
PORTAL = ROOT / "public" / "portal"
OUT = ROOT / "public" / "board-shots"

SCROLL = """async () => {
  const step = Math.floor(window.innerHeight * 0.7);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 190));
  }
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 450));
}"""

studies = sorted(d.name for d in PORTAL.iterdir() if (d / "index.html").exists())
OUT.mkdir(parents=True, exist_ok=True)
rows = []

with sync_playwright() as pw:
    b = pw.chromium.launch(channel="chrome", headless=True)
    for slug in studies:
        pg = b.new_page(viewport={"width": 1440, "height": 1000}, reduced_motion="reduce")
        try:
            pg.goto(f"file://{PORTAL / slug / 'index.html'}", wait_until="load", timeout=45000)
            pg.wait_for_timeout(900)
            pg.evaluate(SCROLL)
            title = (pg.title() or slug).strip()
            pg.screenshot(path=str(OUT / f"{slug}.png"), full_page=True)
            h = pg.evaluate("() => document.body.scrollHeight")
            rows.append({"slug": slug, "title": title, "height": h})
            print(f"{slug:<12} {h:>5}px  {title[:54]}")
        except Exception as e:
            rows.append({"slug": slug, "title": slug, "error": str(e)[:90]})
            print(f"{slug:<12} FAILED {str(e)[:60]}")
        pg.close()
    b.close()

(OUT / "index.json").write_text(json.dumps(rows, indent=2))
ok = [r for r in rows if "error" not in r]
print(f"\n{len(ok)} of {len(rows)} captured -> public/board-shots/")
