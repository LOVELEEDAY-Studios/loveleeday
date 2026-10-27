#!/usr/bin/env python3
"""mobile-lock.py <approved dir> <new dir> : pixel-diff every 390 render against the approved one. Exit 2 if any page changed.
Reports size mismatch, number of differing pixels and the first differing row."""
import sys, glob, os
from PIL import Image, ImageChops
Image.MAX_IMAGE_PIXELS = None
a, b = sys.argv[1], sys.argv[2]
bad = 0
rows = []
for f in sorted(glob.glob(a + '/*-390.png')):
    n = os.path.basename(f)
    g = b + '/' + n
    if not os.path.exists(g):
        rows.append((n, 'MISSING')); bad += 1; continue
    x, y = Image.open(f).convert('RGB'), Image.open(g).convert('RGB')
    if x.size != y.size:
        rows.append((n, 'SIZE %s -> %s' % (x.size, y.size))); bad += 1; continue
    d = ImageChops.difference(x, y).convert('L').point(lambda v: 255 if v > 8 else 0)
    box = d.getbbox()
    if box:
        cnt = sum(1 for v in d.getdata() if v)
        rows.append((n, 'DIFF %d px, first row %d' % (cnt, box[1]))); bad += 1
    else:
        rows.append((n, 'identical'))
for n, r in rows:
    print(n.replace('site_', '').ljust(60), r)
print('pages changed:', bad, 'of', len(rows))
sys.exit(2 if bad else 0)
