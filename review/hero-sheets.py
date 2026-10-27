#!/usr/bin/env python3
"""hero-sheets.py <shots dir> <out dir> [height] : contact sheets of the top of every 1440 page render, 3 per row, labelled, 9 per sheet."""
import sys, glob, os
from PIL import Image, ImageDraw
Image.MAX_IMAGE_PIXELS = None
src, out = sys.argv[1], sys.argv[2]
H = int(sys.argv[3]) if len(sys.argv) > 3 else 900
os.makedirs(out, exist_ok=True)
files = sorted(glob.glob(src + '/*-1440.png'))
W = 640
th = round(H * W / 1440)
for si in range(0, len(files), 9):
    grp = files[si:si + 9]
    sheet = Image.new('RGB', (3 * (W + 8), 3 * (th + 26)), (40, 40, 40))
    d = ImageDraw.Draw(sheet)
    for i, f in enumerate(grp):
        im = Image.open(f).convert('RGB').crop((0, 0, 1440, H)).resize((W, th), Image.LANCZOS)
        x, y = (i % 3) * (W + 8), (i // 3) * (th + 26)
        sheet.paste(im, (x, y + 22))
        d.text((x + 4, y + 5), os.path.basename(f).replace('site_', '').replace('-1440.png', ''), fill=(255, 255, 255))
    p = os.path.join(out, 'heroes-%d.png' % (si // 9 + 1))
    sheet.save(p)
    print(p)
