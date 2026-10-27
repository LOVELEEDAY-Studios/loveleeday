#!/usr/bin/env python3
"""hero-photo-pool.py [file.jpg...] : which photos can sit behind a Photo hero (1440 x 680, cover, object-position 50% 40%) without the
right-hand answer card (x >= 780) covering a face. With no files, checks every asset jpg referenced by no page. Prints each photo,
its pixel size, faces mapped to hero x ranges, and SAFE / SAFE-IF-MIRRORED / NO. Faces come from ~/arthur/scripts/faces.swift."""
import sys, os, re, json, glob, subprocess
SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'site')
W, H, PY, CARD = 1440, 680, .4, 780
BANNED = {'hero-decision.jpg', 'hero-team-desktop.jpg', 'hero-team-phone.jpg', 'dinner.jpg', 'industries.jpg'}
files = sys.argv[1:]
if not files:
    text = ''.join(open(f).read() for f in glob.glob(SITE + '/**/*.html', recursive=True) + glob.glob(SITE + '/assets/**/*.css', recursive=True))
    files = [os.path.basename(f) for f in sorted(glob.glob(SITE + '/assets/*.jpg'))
             if os.path.basename(f) not in text and os.path.basename(f) not in BANNED and 'hospitality' not in f and '-w700' not in f]
out = subprocess.run(['swift', os.path.expanduser('~/arthur/scripts/faces.swift')] + [f'{SITE}/assets/{f}' for f in files], capture_output=True, text=True).stdout
for line in out.strip().splitlines():
    j = json.loads(line)
    if 'error' in j:
        continue
    s = max(W / j['w'], H / j['h']); sw, sh = j['w'] * s, j['h'] * s; ox, oy = (sw - W) / 2, (sh - H) * PY
    fx = [(int(x * sw - ox), int((x + w) * sw - ox)) for x, y, w, h in j['faces'] if 0 <= (y + h / 2) * sh - oy <= H]
    ok = all(b < CARD for a, b in fx)
    okm = all(W - a < CARD for a, b in fx)
    v = 'SAFE' if ok else 'SAFE-IF-MIRRORED' if okm else 'NO'
    print(f"{os.path.basename(j['file']):34s} {j['w']}x{j['h']:<5} faces_x={fx} {v}")
