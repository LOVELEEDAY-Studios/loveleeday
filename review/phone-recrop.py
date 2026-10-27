#!/usr/bin/env python3
"""phone-recrop.py <capdir> <name>... : crop each fresh 390 full-page portal capture (<capdir>/<name>-390.png) to the same framing as
the old clipped 375 crop in public/site/assets/portal/portal-<name>-390.png, found by matching the old crop's top band against the new
capture's left 375px. Overwrites the site file with a true 390-wide crop of the same height. Prints the match offset and error."""
import sys, os
import numpy as np
from PIL import Image
SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'site', 'assets', 'portal')
cap = sys.argv[1]
for n in sys.argv[2:]:
    old = np.asarray(Image.open(f'{SITE}/portal-{n}-390.png').convert('L'), dtype=np.int16)
    new_im = Image.open(f'{cap}/{n}-390.png').convert('RGB')
    new = np.asarray(new_im.convert('L'), dtype=np.int16)
    h, w = old.shape
    band = old[:120, :w]
    best = min(((np.abs(new[y:y + 120, :w] - band).mean(), y) for y in range(0, new.shape[0] - 120)), key=lambda t: t[0])
    err, y = best
    hh = min(h, new.shape[0] - y)
    new_im.crop((0, y, 390, y + hh)).save(f'{SITE}/portal-{n}-390.png', optimize=True)
    print(f'{n}: y={y} err={err:.2f} -> 390x{hh}')
