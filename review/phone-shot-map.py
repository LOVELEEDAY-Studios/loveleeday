#!/usr/bin/env python3
"""phone-shot-map.py : list every portal-*-390.png phone capture used on the site, the pages using it, its alt text and pixel size."""
import glob, re, os
from PIL import Image
SITE = os.path.join(os.path.dirname(__file__), '..', 'public', 'site')
uses = {}
for f in glob.glob(SITE + '/**/*.html', recursive=True):
    t = open(f).read()
    for m in re.finditer(r'portal-([a-z0-9-]+)-390\.png', t):
        alt = re.search(r'alt="([^"]*)"', t[m.end():m.end() + 600])
        uses.setdefault(m.group(1), []).append((os.path.relpath(f, SITE), alt.group(1) if alt else ''))
for n, u in sorted(uses.items()):
    im = Image.open(f'{SITE}/assets/portal/portal-{n}-390.png')
    print(f'== {n} {im.size}')
    for p, a in u:
        print(f'   {p}: {a[:200]}')
