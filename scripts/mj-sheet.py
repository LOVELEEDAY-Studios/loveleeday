#!/usr/bin/env python3
"""
mj-sheet — download a Midjourney job's images and tile them into one numbered contact sheet.

  python3 scripts/mj-sheet.py <job-id> OUT.jpg [--n 24] [--cols 6]

Draft jobs return 24 images at 0_0..0_23; standard jobs return 4 at 0_0..0_3. Tiles are labelled
with their index so a pick can be referred to exactly ("job 3c44… image 7").
"""
import argparse, io, subprocess
from PIL import Image, ImageDraw

ap = argparse.ArgumentParser()
ap.add_argument("job"); ap.add_argument("out")
ap.add_argument("--n", type=int, default=24); ap.add_argument("--cols", type=int, default=6)
a = ap.parse_args()
tiles = []
for i in range(a.n):
    url = f"https://cdn.midjourney.com/{a.job}/0_{i}_640_N.webp?method=shortest"
    data = subprocess.run(["curl", "-sL", "-m", "30", "-A", "Mozilla/5.0", url], capture_output=True).stdout
    try:
        im = Image.open(io.BytesIO(data)).convert("RGB")
    except Exception:
        continue
    im.thumbnail((320, 320))
    ImageDraw.Draw(im).rectangle((0, 0, 26, 18), fill=(0, 0, 0))
    ImageDraw.Draw(im).text((4, 3), str(i), fill=(255, 255, 0))
    tiles.append(im)
if not tiles:
    raise SystemExit("no images downloaded")
w = max(t.size[0] for t in tiles); h = max(t.size[1] for t in tiles)
rows = (len(tiles) + a.cols - 1) // a.cols
sheet = Image.new("RGB", (w * a.cols, h * rows), "black")
for k, t in enumerate(tiles):
    sheet.paste(t, ((k % a.cols) * w, (k // a.cols) * h))
sheet.save(a.out, quality=82)
print(a.out, len(tiles), "images")
