"""Put Daniel's heart in as the mark, on all twelve pages.

He rejected the node-graph interpretation -- "i dont like what u gave use my
heart" -- and the original Midjourney render is the better mark anyway.

The site draws the mark twice per page as <svg><use href="#mark"/></svg> and
tints it by context: ink in the nav, white in the dark footer. A plain <image>
would lose that, so the symbol is a rect filled with currentColor and the
heart is applied over it as a CSS mask in site.css. An SVG <mask> was tried
first and does not work here: instanced through <use> out of a display:none
sprite, Chrome resolves the reference and still paints the rect unmasked --
a solid black square in the nav. The CSS mask keeps the soft filament tips
as partial alpha, and the 24px nav size, 34px footer size and colour
inheritance all keep working untouched.

Replacing the symbol once per page updates both appearances on that page.
"""
import pathlib
import re

SITE = pathlib.Path("site")

SYMBOL = ('<symbol id="mark" viewBox="0 0 24 24">'
          '<rect x="0" y="0" width="24" height="24" fill="currentColor"/>'
          '</symbol>')

pat = re.compile(r'<symbol[^>]*id="mark"[^>]*>.*?</symbol>', re.S)
n = 0
for page in sorted(SITE.glob("*.html")):
    t = page.read_text()
    if not pat.search(t):
        raise SystemExit(f"BUILD STOPPED: {page.name} has no #mark symbol")
    page.write_text(pat.sub(lambda _: SYMBOL, t, count=1))
    n += 1

if not (SITE/"assets"/"heart-mask.png").exists():
    raise SystemExit("BUILD STOPPED: assets/heart-mask.png is missing")
print(f"mark swapped on {n} page(s)")
