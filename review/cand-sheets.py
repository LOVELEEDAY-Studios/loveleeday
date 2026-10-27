#!/usr/bin/env python3
"""cand-sheets.py <candidates dir> <outdir> : one labelled contact sheet per shot-NN folder group (thumbnails only, originals untouched)."""
import sys, os, glob
from PIL import Image, ImageDraw
Image.MAX_IMAGE_PIXELS = None
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
dirs = sorted(d for d in glob.glob(os.path.join(src, 'shot-*')) if os.path.isdir(d))
TW, TH = 380, 260
for gi in range(0, len(dirs), 4):
    grp = dirs[gi:gi + 4]
    rows = []
    for d in grp:
        files = sorted(glob.glob(os.path.join(d, '*.jpg')))
        rows.append((os.path.basename(d), files))
    cols = max(len(f) for _, f in rows)
    sheet = Image.new('RGB', (cols * (TW + 6), len(rows) * (TH + 30)), (30, 30, 30))
    dr = ImageDraw.Draw(sheet)
    for ri, (name, files) in enumerate(rows):
        for ci, f in enumerate(files):
            im = Image.open(f)
            im.draft('RGB', (TW * 2, TH * 2))
            im = im.convert('RGB')
            im.thumbnail((TW, TH))
            x, y = ci * (TW + 6), ri * (TH + 30)
            sheet.paste(im, (x, y + 24))
            dr.text((x + 2, y + 6), name[:14] + ' ' + os.path.basename(f).split('-')[0], fill=(255, 255, 255))
    p = os.path.join(out, 'cand-%02d.png' % (gi // 4 + 1))
    sheet.save(p)
    print(p)
