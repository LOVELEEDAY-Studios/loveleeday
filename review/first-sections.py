#!/usr/bin/env python3
"""first-sections.py : for every public page print the <main> tag, the first section/div tag after it and the h1 tag."""
import re, glob, os
os.chdir('/Users/danielmay/wt/ll-review-1026')
for f in sorted(glob.glob('public/site/*.html')) + sorted(glob.glob('public/site/industries/*.html')) + sorted(glob.glob('public/site/notes/*.html'))[:1]:
    s = open(f).read()
    i = s.find('<main')
    m = s[i:]
    tag = re.match(r'<main[^>]*>', m).group(0)
    sec = re.search(r'<(section|div|header)[^>]*>', m[len(tag):]).group(0)
    h1 = re.search(r'<h1[^>]*>', m)
    body = re.search(r'<body[^>]*>', s).group(0)
    print(os.path.basename(f)[:-5].ljust(24), body[:30].ljust(22), tag[:44].ljust(36), sec[:64].ljust(58), (h1.group(0) if h1 else '')[:36])
