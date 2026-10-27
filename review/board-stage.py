#!/usr/bin/env python3
"""board-stage.py <board dir> <stage dir> : copy the board with every shot downscaled to 400px wide, small enough to ship to arthur-server for a screenshot."""
import os, sys, shutil, glob
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst + '/shots')
for d in ('photos', 'refs', 'share'):
    shutil.copytree(src + '/' + d, dst + '/' + d)
shutil.copy(src + '/index.html', dst + '/index.html')
for f in glob.glob(src + '/shots/*.png'):
    im = Image.open(f).convert('RGB')
    h = min(im.height * 400 // im.width, 6000)
    im.resize((400, h)).save(dst + '/shots/' + os.path.basename(f), optimize=True)
