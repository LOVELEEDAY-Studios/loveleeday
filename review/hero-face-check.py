#!/usr/bin/env python3
"""hero-face-check.py <render-dir> [page...] : flag hero answer cards that sit over a face.
For each desktop render (site_<page>-1440.png) it finds the hero (dark band under the 72px header), the white answer card in it,
the hero photo (first asset <img> in <main>, or the page's --hero image), where that photo sits (cover-fit, object-position found
by matching against the render), and the faces in the photo (macOS Vision via ~/arthur/scripts/faces.swift). Exit 2 if any face
is under a card. --photo=<page>:<file.jpg> tests a candidate photo for a page without editing it (assumes the same card box)."""
import sys, os, re, json, subprocess, glob
import numpy as np
from PIL import Image
SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'site')
args = [a for a in sys.argv[1:] if not a.startswith('--')]
over = dict(a[8:].split(':', 1) for a in sys.argv[1:] if a.startswith('--photo='))
rdir = args[0]
pages = args[1:] or sorted(os.path.basename(f)[5:-9] for f in glob.glob(rdir + '/site_*-1440.png'))
desk = open(SITE + '/assets/desktop.css').read()

def hero_src(p):
    if p in over:
        return over[p]
    t = open(f"{SITE}/{p.replace('_', '/')}.html").read()
    m = re.search(r'<main.*?<img[^>]*src="/site/assets/([^"/]+\.jpg)"', t, re.S)
    if m:
        return m.group(1)
    m = re.search(r'\.pg-%s\{--hero:url\(/site/assets/([^)]+)\)' % re.escape(p.split('_')[-1]), desk)
    return m.group(1) if m else None

faces_cache = {}
def faces(f):
    if f not in faces_cache:
        out = subprocess.run(['swift', os.path.expanduser('~/arthur/scripts/faces.swift'), f'{SITE}/assets/{f}'], capture_output=True, text=True).stdout
        faces_cache[f] = json.loads(out.strip().splitlines()[-1])
    return faces_cache[f]

bad = 0
for p in pages:
    r = np.asarray(Image.open(f'{rdir}/site_{p}-1440.png').convert('L'), dtype=np.float32)
    W = r.shape[1]
    col = r[72:1400, 4:40].mean(axis=1)
    light = np.where(col[300:] > 232)[0]
    H = int(300 + light[0]) if len(light) else 640
    hero = r[72:72 + H]
    m = hero[:, 640:] >= 248
    rows = np.where(m.sum(axis=1) > 200)[0]
    card = None
    if len(rows) > 80:
        cols = np.where(m[rows].sum(axis=0) > len(rows) * .6)[0]
        if len(cols):
            card = (640 + cols[0], rows[0], 640 + cols[-1], rows[-1])
    src = hero_src(p)
    if not src or not card:
        print(f'{p:28s} card={"yes" if card else "none"} photo={src or "none"}  (nothing to check)')
        continue
    fj = faces(src)
    im = Image.open(f'{SITE}/assets/{src}').convert('L')
    iw, ih = im.size
    s = max(W / iw, H / ih)
    sw, sh = iw * s, ih * s
    if p in over:
        px, py = .5, .4
    else:
        k = 8
        small = np.asarray(im.resize((max(1, int(sw / k)), max(1, int(sh / k)))), dtype=np.float32)
        tgt = hero[::k, :card[0]:k][: int(H / k), : int(card[0] / k)]
        best = (-2, .5, .5)
        for px in np.linspace(0, 1, 21):
            for py in np.linspace(0, 1, 21):
                ox, oy = int((sw - W) * px / k), int((sh - H) * py / k)
                c = small[oy:oy + tgt.shape[0], ox:ox + tgt.shape[1]]
                if c.shape != tgt.shape:
                    continue
                a, b = c - c.mean(), tgt - tgt.mean()
                cc = (a * b).sum() / (np.sqrt((a * a).sum() * (b * b).sum()) + 1e-6)
                if cc > best[0]:
                    best = (cc, px, py)
        _, px, py = best
    ox, oy = (sw - W) * px, (sh - H) * py
    hits = []
    for fx, fy, fw, fh in fj['faces']:
        x0, y0, x1, y1 = fx * sw - ox, fy * sh - oy, (fx + fw) * sw - ox, (fy + fh) * sh - oy
        if x1 < 0 or x0 > W or y1 < 0 or y0 > H:
            continue
        if y0 < -(y1 - y0) * .1 or y1 > H + (y1 - y0) * .1:
            print(f"{p:28s} FACE CUT BY HERO EDGE at x={int(x0)}-{int(x1)} y={int(y0)}-{int(y1)}"); bad += 1
        ix = max(0, min(x1, card[2]) - max(x0, card[0])) * max(0, min(y1, card[3]) - max(y0, card[1]))
        cov = ix / ((x1 - x0) * (y1 - y0))
        hits.append((round(cov, 2), int(x0), int(y0), int(x1), int(y1)))
    under = [h for h in hits if h[0] > .15]
    bad += bool(under)
    print(f'{p:28s} {"FACE UNDER CARD" if under else "ok":16s} photo={src} pos={px:.2f},{py:.2f} card={card} faces={hits}')
sys.exit(2 if bad else 0)
