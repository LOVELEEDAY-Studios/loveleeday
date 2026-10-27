#!/usr/bin/env python3
"""hero-survey.py : for every page in public/site, print the first section inside <main> (the hero): its classes,
the images it contains, and every background url its page CSS + brand.css give to that section or its children."""
import re, glob, os

ROOT = '/Users/danielmay/wt/ll-review-1026/public/site'
os.chdir(ROOT)
pages = sorted(p[:-5] for p in glob.glob('*.html') + glob.glob('*/*.html') if not os.path.basename(p).startswith('_'))
for p in pages:
    h = open(p + '.html').read()
    m = re.search(r'<main[^>]*>(.*?)</section>', h, re.S)
    if not m:
        print(f'{p:34} NO HERO'); continue
    sec = m.group(1)
    cls = re.findall(r'<(?:section|div|header)[^>]*class="([^"]+)"', sec)[:3]
    imgs = [os.path.basename(s.split('?')[0]) for s in re.findall(r'<(?:img|source)[^>]*(?:src|srcset)="([^" ]+)', sec)]
    inline_bg = re.findall(r'url\(([^)]+)\)', sec)
    css = ''
    for c in ('assets/pages/' + p.replace('/', '_') + '.css',):
        if os.path.exists(c):
            css = open(c).read()
    first = cls[0].split()[0] if cls else ''
    css_bg = sorted(set(os.path.basename(u.strip('\'"').split('?')[0]) for sel, body in re.findall(r'([^{}]*)\{([^}]*)\}', css)
                        if first and first in sel for u in re.findall(r'url\(([^)]+)\)', body)))
    print(f'{p:34} {" | ".join(cls)[:60]:60} img:{len(set(imgs))} {",".join(sorted(set(imgs)))[:70]} bg:{",".join(css_bg + inline_bg)[:60]}')
