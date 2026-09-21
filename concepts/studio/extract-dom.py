#!/usr/bin/env python3
"""Walk the LIVE pages and record every content block, in order.

     npx next dev -p 3310   (then)
     python3 concepts/studio/extract-dom.py  ->  concepts/studio/live-dom.json

   Why this exists. extract-live.py reads named arrays out of the TSX, which is
   exact but only finds what I thought to ask for -- and a mechanical diff
   against the running site showed 33 text blocks on the homepage alone that
   the mockups had simply dropped: every component's "why it matters", every
   figure's source line, the schematic captions, the framing paragraph above
   each section, and the whole of the dark contract section. Asking the DOM
   what is on the page cannot miss a block I failed to imagine.
"""
import asyncio, json, re, pathlib
from playwright.async_api import async_playwright

ROUTES = ["/", "/arthur", "/work", "/about", "/contact"]
OUT = pathlib.Path(__file__).parent / "live-dom.json"

JS = r"""(() => {
  const out = [];
  const seen = new Set();
  const roleOf = (el) => {
    const t = el.tagName.toLowerCase();
    if (/^h[1-6]$/.test(t)) return t;
    if (t === 'summary') return 'summary';
    if (t === 'li') return 'li';
    if (t === 'figcaption') return 'caption';
    const cls = (el.className && el.className.baseVal !== undefined
                 ? el.className.baseVal : el.className) || '';
    if (typeof cls === 'string' && /eyebrow/.test(cls)) return 'eyebrow';
    return 'p';
  };
  const push = (el, txt) => {
    txt = (txt || '').replace(/\s+/g, ' ').trim();
    if (!txt || txt.length < 3 || txt.length > 900) return;
    // Dedupe LONG blocks only. Keying on text alone dropped every repeat of a
    // short label -- "WHY IT MATTERS" appears five times on /arthur, once per
    // component, and only the first survived, so the eyebrow vanished from the
    // rebuild while its five bodies stayed.
    if (txt.length > 40) { if (seen.has(txt)) return; seen.add(txt); }
    const sec = el.closest('section,header,footer,nav');
    out.push({ role: roleOf(el), text: txt,
               section: sec ? (sec.id || sec.tagName.toLowerCase()) : '' });
  };
  // Headings, summaries and captions are ALWAYS taken whole, however they are
  // marked up inside. A previous version skipped any element containing a
  // <span>, which is how every FAQ question and half the eyebrows vanished:
  // this site wraps heading fragments in spans for line control.
  document.querySelectorAll('h1,h2,h3,h4,h5,summary,figcaption,dt,blockquote')
    .forEach((el) => push(el, el.innerText));
  // Everything else is read from its OWN direct text nodes, so a parent never
  // swallows its children and a child is never lost inside its parent.
  document.querySelectorAll('p,li,div,span,a,button,label,dd,td,th,time,strong,em,option')
    .forEach((el) => {
      let own = '';
      el.childNodes.forEach((n) => { if (n.nodeType === 3) own += n.nodeValue; });
      if (own.replace(/\s+/g, ' ').trim().length >= 3) push(el, own);
    });
  return out;
})()"""

async def go():
    data = {}
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1280, "height": 900})
        for r in ROUTES:
            await pg.goto("http://localhost:3310" + r, wait_until="networkidle")
            await pg.wait_for_timeout(1200)
            blocks = await pg.evaluate(JS)
            data[r] = blocks
            print(f"  {r:10} {len(blocks)} blocks")
        await b.close()
    OUT.write_text(json.dumps(data, indent=1))
    print("wrote", OUT.name)

asyncio.run(go())
