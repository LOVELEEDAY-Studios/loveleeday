#!/usr/bin/env python3
"""page-strip.py <shotsdir> <outdir> [--dw=1440-slice-height] : cut each full-page shot into columns so one page fits one image.
Desktop shots (*-1440.png): slices of 1500px, each scaled to 560 wide, laid side by side.
Phone shots (*-390.png): slices of 1700px at native 390 wide, laid side by side."""
import sys, os, glob
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
src, out = sys.argv[1], sys.argv[2]
TW = next((int(a.split('=')[1]) for a in sys.argv[3:] if a.startswith('--tw=')), 640)
os.makedirs(out, exist_ok=True)
for f in sorted(glob.glob(os.path.join(src, '*.png'))):
    base = os.path.basename(f)[:-4]
    im = Image.open(f).convert('RGB')
    w, h = im.size
    if base.endswith('-1440'):
        sh, tw = 1500, TW
    else:
        sh, tw = 1700, 390
    tiles = []
    for y in range(0, h, sh):
        t = im.crop((0, y, w, min(h, y + sh)))
        if w != tw:
            t = t.resize((tw, round(t.height * tw / w)), Image.LANCZOS)
        tiles.append(t)
    gap = 8
    th = max(t.height for t in tiles)
    per = next((int(a.split('=')[1]) for a in sys.argv[3:] if a.startswith('--per=')), 3 if base.endswith('-1440') else 4)
    for p in range(0, len(tiles), per):
        grp = tiles[p:p + per]
        sheet = Image.new('RGB', (len(grp) * (tw + gap), max(t.height for t in grp)), (60, 60, 60))
        for i, t in enumerate(grp):
            sheet.paste(t, (i * (tw + gap), 0))
        sheet.save(os.path.join(out, base.replace('site_', '') + '-p%d.png' % (p // per + 1)))
    print(base, w, h, len(tiles))
