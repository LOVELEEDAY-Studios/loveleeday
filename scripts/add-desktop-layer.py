#!/usr/bin/env python3
"""add-desktop-layer.py : give every public page a pg-<slug> body class and the desktop.css link (after refresh.css). Idempotent.
Phone layouts are untouched: desktop.css is wrapped in min-width:1021px and a body class alone changes nothing."""
import re, glob, os
os.chdir('/Users/danielmay/wt/ll-review-1026/public/site')
LINK = '<link rel="stylesheet" href="/site/assets/desktop.css?v=0">'
n = 0
for f in sorted(glob.glob('*.html')) + sorted(glob.glob('industries/*.html')) + sorted(glob.glob('notes/*.html')):
    s = open(f).read()
    slug = os.path.basename(f)[:-5]
    cls = 'pg-' + slug if '/' not in f else ('pg-ind-' + slug if f.startswith('industries') else 'pg-note')
    if cls not in s:
        s = re.sub(r'<body class="([^"]*)"', lambda m: '<body class="%s"' % ((m.group(1) + ' ' + cls).strip()), s, count=1)
    if 'assets/desktop.css' not in s:
        s = re.sub(r'(<link rel="stylesheet" href="/site/assets/refresh\.css[^"]*">)', r'\1' + LINK, s, count=1)
    open(f, 'w').write(s)
    n += 1
print(n, 'pages')
