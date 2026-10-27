#!/usr/bin/env python3
"""hero-swap.py page=new.jpg|alt text ... : replace the hero photo (first asset <img> inside <main>) on each page, its alt text, its
intrinsic size, and the matching --hero background in desktop.css. Run hero-face-check.py on a fresh render afterwards."""
import sys, os, re
from PIL import Image
SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'site')
desk_p = SITE + '/assets/desktop.css'
desk = open(desk_p).read()
for a in sys.argv[1:]:
    page, rest = a.split('=', 1)
    new, alt = rest.split('|', 1)
    w, h = Image.open(f'{SITE}/assets/{new}').size
    p = f"{SITE}/{page.replace('_', '/')}.html"
    t = open(p).read()
    m = re.search(r'(<main.*?)(<img[^>]*src="/site/assets/)([^"/]+\.jpg)("[^>]*>)', t, re.S)
    old = m.group(3)
    tag = m.group(2) + new + m.group(4)
    tag = re.sub(r'alt="[^"]*"', f'alt="{alt}"', tag)
    tag = re.sub(r'width="\d+"', f'width="{w}"', tag)
    tag = re.sub(r'height="\d+"', f'height="{h}"', tag)
    t = t[:m.start(2)] + tag + t[m.end(4):]
    open(p, 'w').write(t)
    desk = re.sub(r'(\.pg-%s\{--hero:url\(/site/assets/)[^)]+\)' % re.escape(page.split('_')[-1]), r'\g<1>%s)' % new, desk)
    print(f'{page}: {old} -> {new}')
open(desk_p, 'w').write(desk)
