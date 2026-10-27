#!/usr/bin/env python3
"""first-section-html.py <page...> : print the opening markup (tags only, text shortened) of each page's first section."""
import re, sys, os
os.chdir('/Users/danielmay/wt/ll-review-1026/public/site')
for p in sys.argv[1:]:
    s = open(p + '.html').read()
    i = s.find('<main')
    j = s.find('</section>', i)
    h = s[i:j + 10]
    h = re.sub(r'<svg.*?</svg>', '<svg/>', h, flags=re.S)
    h = re.sub(r'>([^<]{40})[^<]*<', r'>\1...<', h)
    print('==', p, len(h))
    print(h[:1400])
