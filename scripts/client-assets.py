#!/usr/bin/env python3
"""
client-assets — download a prospect's OWN imagery for their rebuild study.

Why this exists: the Enable study was built under an instruction to hand-draw
the device as inline SVG and use no photography. That rule was meant to keep
generic stock imagery out. Applied to a client's own product photography it was
exactly backwards — it produced a flat concentric-circle diagram that reads as a
battery gauge, while Enable publishes a real photograph of the device on skin.

A rebuild of someone's site should use their own pictures. They own them, they
are already on the page we are rebuilding, and nothing else looks like the real
product.

  python3 scripts/client-assets.py enable https://enableinjections.com/ --min 500
"""
import argparse, mimetypes, re, sys
from pathlib import Path
from urllib.parse import urlparse
from patchright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent

SCROLL = """async () => {
  const step = Math.floor(window.innerHeight * 0.7);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 220));
  }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 500));
}"""


def slugify(url, alt):
    base = alt.strip().lower() if alt.strip() else Path(urlparse(url).path).stem
    base = re.sub(r"[^a-z0-9]+", "-", base).strip("-")[:48]
    return base or "asset"


ap = argparse.ArgumentParser()
ap.add_argument("slug")
ap.add_argument("url")
ap.add_argument("--min", type=int, default=500, help="minimum natural width")
a = ap.parse_args()

out = ROOT / "public" / "portal" / a.slug / "assets"
out.mkdir(parents=True, exist_ok=True)

with sync_playwright() as pw:
    b = pw.chromium.launch(channel="chrome", headless=True)
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.goto(a.url, wait_until="load", timeout=45000)
    pg.wait_for_timeout(1500)
    pg.evaluate(SCROLL)
    imgs = pg.evaluate(
        "(min) => [...document.querySelectorAll('img')]"
        ".filter(i => i.naturalWidth >= min)"
        ".map(i => ({src: i.currentSrc, w: i.naturalWidth, h: i.naturalHeight, alt: i.alt || ''}))",
        a.min,
    )
    seen, saved = set(), []
    for im in imgs:
        if im["src"] in seen:
            continue
        seen.add(im["src"])
        name = slugify(im["src"], im["alt"])
        ext = Path(urlparse(im["src"]).path).suffix or ".jpg"
        dest = out / f"{name}{ext}"
        if dest.exists():
            continue
        try:
            r = pg.request.get(im["src"], timeout=30000)
            if not r.ok:
                print(f"  skip {r.status} {im['src'][:70]}")
                continue
            dest.write_bytes(r.body())
            saved.append((dest.name, im["w"], im["h"], im["alt"][:44]))
        except Exception as e:
            print(f"  skip {str(e)[:60]}")
    b.close()

for n, w, h, alt in saved:
    print(f"{w:>5}x{h:<5} {n:<52} {alt}")
print(f"\n{len(saved)} saved to public/portal/{a.slug}/assets/")
print("These are the CLIENT's own images. Credit stays with them; they are used")
print("only inside their own rebuild study, never on a LOVELEEDAY-facing page.")
