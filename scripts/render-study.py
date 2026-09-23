#!/usr/bin/env python3
"""
render-study — screenshot a study page at desktop and phone width, sliced for review.

  python3 scripts/render-study.py blacktechweek [--out DIR]

Scrolls the page first so lazy images and reveals load, reports horizontal overflow at each
width (anything >0 is a bug), and writes <out>/<slug>-d<N>.png (desktop, 1/3 scale) and
<out>/<slug>-m<N>.png (390px, full scale) in 1600px slices small enough to read.
"""
import argparse
from pathlib import Path
from patchright.sync_api import sync_playwright
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ap = argparse.ArgumentParser()
ap.add_argument("slug")
ap.add_argument("--out", default="/tmp")
a = ap.parse_args()
url = f"file://{ROOT}/public/portal/{a.slug}/index.html"
out = Path(a.out)

with sync_playwright() as pw:
    b = pw.chromium.launch(channel="chrome", headless=True)
    for tag, w, scale in (("d", 1440, 3), ("m", 390, 1)):
        p = b.new_page(viewport={"width": w, "height": 900})
        p.goto(url, wait_until="load")
        p.wait_for_timeout(1500)
        h = p.evaluate("document.body.scrollHeight")
        for y in range(0, h, 600):
            p.evaluate(f"scrollTo(0,{y})")
            p.wait_for_timeout(40)
        p.evaluate("scrollTo(0,0)")
        p.wait_for_timeout(500)
        ov = p.evaluate("document.documentElement.scrollWidth - innerWidth")
        full = out / f"{a.slug}-{tag}-full.png"
        p.screenshot(path=str(full), full_page=True)
        p.close()
        im = Image.open(full)
        sm = im.resize((im.size[0] // scale, im.size[1] // scale))
        n = 0
        for y in range(0, sm.size[1], 1600):
            sm.crop((0, y, sm.size[0], min(y + 1600, sm.size[1]))).save(out / f"{a.slug}-{tag}{n}.png")
            n += 1
        print(f"{tag} width={w} height={im.size[1]} overflow={ov} slices={n}")
    b.close()
