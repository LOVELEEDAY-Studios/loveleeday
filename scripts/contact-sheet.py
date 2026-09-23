#!/usr/bin/env python3
"""
contact-sheet — one image of a video's frames every N seconds, each stamped with its timecode.

  python3 scripts/contact-sheet.py VIDEO.mp4 OUT.jpg [--every 3] [--cols 6]

Used to pick shots for a cut by LOOKING at the footage rather than guessing from a title.
"""
import argparse, subprocess, tempfile
from pathlib import Path
from PIL import Image, ImageDraw

ap = argparse.ArgumentParser()
ap.add_argument("video"); ap.add_argument("out")
ap.add_argument("--every", type=float, default=3.0)
ap.add_argument("--cols", type=int, default=6)
a = ap.parse_args()

dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                      "-of", "csv=p=0", a.video]).strip())
tiles = []
with tempfile.TemporaryDirectory() as d:
    t = 0.5
    while t < dur:
        f = Path(d) / f"{t:08.2f}.jpg"
        subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t}", "-i", a.video, "-frames:v", "1",
                        "-vf", "scale=320:-2", str(f)], check=False)
        if f.exists():
            im = Image.open(f).convert("RGB")
            ImageDraw.Draw(im).rectangle((0, 0, 58, 18), fill=(0, 0, 0))
            ImageDraw.Draw(im).text((4, 3), f"{t:5.1f}s", fill=(255, 255, 0))
            tiles.append(im)
        t += a.every
if not tiles:
    raise SystemExit("no frames")
w, h = tiles[0].size
rows = (len(tiles) + a.cols - 1) // a.cols
sheet = Image.new("RGB", (w * a.cols, h * rows), "black")
for i, im in enumerate(tiles):
    sheet.paste(im.resize((w, h)), ((i % a.cols) * w, (i // a.cols) * h))
sheet.save(a.out, quality=80)
print(a.out, sheet.size, f"{len(tiles)} frames over {dur:.1f}s")
