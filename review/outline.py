#!/usr/bin/env python3
"""outline.py [page-substring] : list the <section>s of each public page's <main> (class, heading, child classes)."""
import re, glob, sys, os
os.chdir('/Users/danielmay/wt/ll-review-1026/public/site')
flt = sys.argv[1] if len(sys.argv) > 1 else ''
for f in sorted(glob.glob('*.html') + glob.glob('industries/*.html')):
    if flt not in f: continue
    t = open(f).read()
    m = re.search(r'<main.*?</main>', t, re.S)
    if not m: print(f, 'NOMAIN'); continue
    m = m.group(0)
    b = re.search(r'<body[^>]*class="([^"]*)"', t)
    print('==', f, len(m), b.group(1) if b else '')
    for a, body in re.findall(r'<section([^>]*)>(.*?)(?=<section|</main>)', m, re.S):
        h = re.search(r'<h[12][^>]*>(.*?)</h', body, re.S)
        print('  ', a.strip()[:60], '|', re.sub('<[^>]+>', '', h.group(1))[:50] if h else '', '|', re.findall(r'class="([^" ]+)', body)[:7])
