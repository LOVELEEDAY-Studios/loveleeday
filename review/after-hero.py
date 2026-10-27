#!/usr/bin/env python3
"""after-hero.py <page>... : print the hero section and the section after it, with long text shortened, to see where a hero's answer card lives."""
import re, sys, os
os.chdir('/Users/danielmay/wt/ll-review-1026/public/site')
for p in sys.argv[1:]:
    h = open(p + '.html').read()
    i = h.find('<main'); j = h.find('</section>', i); k = h.find('</section>', j + 10)
    s = re.sub(r'>[^<]{40,}<', lambda m: '>' + m.group(0)[1:30] + '…<', h[i:k])
    s = re.sub(r'<svg.*?</svg>', '<svg/>', s, flags=re.S)
    print('=====', p, '\n', s[:1800])
