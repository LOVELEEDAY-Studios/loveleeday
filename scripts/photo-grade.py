#!/usr/bin/env python3
"""photo-grade.py <src> <out> [--w=2400] [--crop=x0,y0,x1,y1 as fractions] [--warm=K] [--sat=0.92] [--webp]
The one LOVELEEDAY grade (brand book chapter 07): neutral-warm white balance, gentle S-curve with blacks lifted to ~6% and
highlights rolled to ~96%, shadows split-toned toward navy, highlights toward cream, global saturation -8% with reds/oranges
and yellow-greens pulled further back. Originals are only ever scaled DOWN (LANCZOS); nothing is sharpened or given grain."""
import sys, argparse
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--w', type=int, default=2400)
ap.add_argument('--crop', default='')
ap.add_argument('--warm', type=float, default=0.0, help='-1..1, positive warms')
ap.add_argument('--sat', type=float, default=0.92)
ap.add_argument('--quality', type=int, default=84)
a = ap.parse_args()

im = Image.open(a.src).convert('RGB')
if a.crop:
    x0, y0, x1, y1 = [float(v) for v in a.crop.split(',')]
    W, H = im.size
    im = im.crop((round(x0 * W), round(y0 * H), round(x1 * W), round(y1 * H)))
if im.width > a.w:
    im = im.resize((a.w, round(im.height * a.w / im.width)), Image.LANCZOS)
x = np.asarray(im).astype(np.float32) / 255.0

# white balance: nudge red up and blue down for cool frames, the reverse for amber
r, g, b = x[..., 0], x[..., 1], x[..., 2]
x = np.stack([r * (1 + 0.05 * a.warm), g, b * (1 - 0.06 * a.warm)], -1).clip(0, 1)

# S-curve, lifted blacks, rolled highlights
t = x
s = t * t * (3 - 2 * t)
x = 0.55 * t + 0.45 * s
x = 0.06 + x * (0.96 - 0.06)

# split tone: shadows toward navy, highlights toward cream
lum = (0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2])[..., None]
navy = np.array([0.086, 0.141, 0.227], np.float32)
cream = np.array([0.984, 0.973, 0.949], np.float32)
sh = (1 - lum) ** 2
hi = lum ** 2
x = x * (1 - 0.07 * sh - 0.04 * hi) + navy * 0.07 * sh + cream * 0.04 * hi

# saturation: global, then reds/oranges and yellow-greens pulled back
mx, mn = x.max(-1), x.min(-1)
d = mx - mn + 1e-6
rr, gg, bb = x[..., 0], x[..., 1], x[..., 2]
h = np.where(mx == rr, ((gg - bb) / d) % 6, np.where(mx == gg, (bb - rr) / d + 2, (rr - gg) / d + 4)) * 60
k = np.full(h.shape, a.sat, np.float32)
k = np.where((h < 40) | (h >= 345), k * (0.82 / 0.92), k)
k = np.where((h >= 60) & (h < 110), k * (0.85 / 0.92), k)
lum = (0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2])[..., None]
x = (lum + (x - lum) * k[..., None]).clip(0, 1)

out = Image.fromarray((x * 255 + 0.5).astype(np.uint8))
out.save(a.out, quality=a.quality, optimize=True, progressive=True)
print(a.out, out.size)
