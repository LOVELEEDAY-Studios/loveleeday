#!/usr/bin/env python3
"""hero-unify.py : put build, principles, talk, contact and FAQ on the same full-bleed photo hero (.hx) as the other pages.
build/principles: their split .hs becomes .hx (their CSS already has .hx). talk/contact/faq: the bespoke split hero is rebuilt
as .hx markup, and the .hx/.ac rules from build.css are appended to each page's CSS with the page's body class. Idempotent."""
import re, os
SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'site')
rd = lambda p: open(os.path.join(SITE, p)).read()
def wr(p, t): open(os.path.join(SITE, p), 'w').write(t)

for p in ('build', 'principles'):
    t = rd(p + '.html')
    t = t.replace('<section class="hs">', '<section class="hx">').replace('<div class="hs-t">', '<div>')
    t = re.sub(r'(<section class="hx"><picture><img class="hx-img"[^>]*style=")object-position:[^"]*"', r'\1object-position:50% 40%"', t)
    wr(p + '.html', t)

css = rd('assets/pages/build.css').split('\n')
base = [l for l in css[:70] if re.search(r'\.(hx|ac|acts)\b', l) and '.hs' not in l and '.dk' not in l]
desk = [l for l in css[76:110] if re.search(r'\.(hx|ac)\b', l) and '.hs' not in l]
extra = ['body.pg-build main .hx .text-link{color:#fff;border-color:#ffffff99}', 'body.pg-build .hx .hx-note{display:block;margin-top:16px;font-size:15px;color:#e6e7ec}']

for p, pre in (('talk', 'tv3'), ('contact', 'cv3'), ('faq', 'f')):
    t = rd(p + '.html')
    m = re.search(r'<section class="%s-hero">.*?</section>' % pre, t, re.S)
    if not m:
        continue
    s = m.group(0)
    g = lambda r: re.search(r, s, re.S).group(1)
    h1, lead = g(r'<h1>(.*?)</h1>'), g(r'<p class="lead">(.*?)</p>')
    acts = g(r'<div class="%s-actions">(.*?)</div>' % pre)
    acts = re.sub(r'class="%s-textlink"' % pre, 'class="text-link"', acts)
    note = re.search(r'<span class="cv3-reply">(.*?)</span>', acts)
    acts = re.sub(r'<span class="cv3-reply">.*?</span>', '', acts)
    img = re.search(r'<img src="([^"]+)" alt="" width="(\d+)" height="(\d+)">', s)
    lab, q, a, sm = g(r'<aside[^>]*><span>(.*?)</span>'), g(r'<p class="q">(.*?)</p>'), g(r'<p class="a">(.*?)</p>'), g(r'<small>(.*?)</small>')
    new = (f'<section class="hx"><picture><img class="hx-img" src="{img.group(1)}" alt="" width="{img.group(2)}" height="{img.group(3)}" style="object-position:50% 40%"></picture>'
           f'<div class="wrap k"><div><h1>{h1}</h1><p class="lead">{lead}</p><div class="acts">{acts}</div>'
           + (f'<span class="hx-note">{note.group(1)}</span>' if note else '') +
           f'</div><aside class="ac" aria-label="{lab}"><span class="ac-l">{lab}</span><p class="ac-q">{q}</p><p class="ac-a">{a}</p><p class="ac-s">{sm}</p></aside></div></section>')
    wr(p + '.html', t.replace(s, new))
    c = rd(f'assets/pages/{p}.css')
    if '/* hx hero */' not in c:
        sub = lambda ls: '\n'.join(l.replace('pg-build', 'pg-' + p) for l in ls)
        c += f'\n/* hx hero */\n{sub(base + extra)}\n@media (min-width:1021px){{\n{sub(desk)}\n}}\n'
        wr(f'assets/pages/{p}.css', c)
    print(p, 'rebuilt')
print('done')
