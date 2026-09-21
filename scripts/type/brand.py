#!/usr/bin/env python3
"""Every brand asset, from one source of geometry.

     python3 scripts/type/brand.py            SVGs + the proof page
     python3 scripts/type/brand.py --png      also rasterise the PNG set

   The mark is the circuit heart Daniel chose on 2026-09-21, rebuilt as vector
   (see circuit.py for why it is rebuilt and not traced). The wordmark is real
   Manrope outlines with measured spacing (see wordmark.py).

   THREE CUTS, not one file scaled. A mark with sixty-eight tracks in it is a
   different drawing at 16px than at 400px -- at favicon size the tracks close
   up and the heart fills in solid. So the heart is routed three times at three
   densities and the right one is used at the right size, which is the same
   thing a type family does with display, text and caption cuts.

     DISPLAY  >= 96px   68 tracks   the full board
     MEDIUM   32-95px   34 tracks   half the density, fatter track
     SMALL    20-31px   11 tracks   the board edge and a few fat runs
     TINY     <= 19px    7 tracks   INVERTED -- a solid heart with the tracks
                                    knocked out of it, because below 20px an
                                    outline has no mass left to read

   THE KEEP-OUT. Where the wordmark crosses the heart, the tracks are cleared
   behind the letters rather than running under them. That is how silkscreen
   sits on a real board, and it is the difference between type ON the mark and
   type LOST IN it.
"""
import subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import wordmark as W
import circuit as C

ROOT = Path(__file__).resolve().parents[2]
BRAND = ROOT / "public" / "brand"

# Daniel's pick is on vermilion, so vermilion is the brand colour and the
# cream/navy the site already ships becomes the secondary system. Both are
# generated; the conflict is a decision, not something to paper over.
VERM, VERM_D = "#E74F32", "#C63D22"
CREAM, WHITE, NAVY, ON_NAVY = "#FBF8F2", "#FFFFFF", "#16243A", "#F6F3EC"
MID, DIM, LINE = "#45536A", "#667383", "#E6E0D6"

FACE, WGHT = "Manrope", 800
SEED = 7

CUTS = {
    "display": dict(pitch=3.4, track=0.90, tracks=68, seed=SEED, outline=1.6),
    "medium":  dict(pitch=5.4, track=1.50, tracks=34, seed=SEED, outline=2.6),
    "small":   dict(pitch=8.6, track=3.40, tracks=11, seed=SEED, outline=5.2, max_len=11),
    # TINY inverts the drawing. Below about 20px an outlined heart with tracks
    # inside it has no mass left -- the strokes fall under a pixel and the mark
    # dissolves, which is exactly what the 16px favicon did. So the heart goes
    # SOLID and the tracks are knocked OUT of it. Mass first, circuit second.
    # margin is the one that matters here: the knocked-out tracks are held well
    # clear of the silhouette so a solid rim always survives. At the default the
    # tracks reached the edge and bit notches out of the lobes at 16px.
    "tiny":    dict(pitch=10.5, track=4.2, tracks=6, seed=3, max_len=7,
                    bundle=(1, 2), margin=3.2),
}

# Clearance around the silkscreen, as a fraction of cap. At 0.055 the tracks ran
# up to the letters and the word camouflaged itself in its own mark -- the type
# and the traces are the same colour and the same weight, so anything short of a
# generous clearance loses the word entirely.
KEEPOUT = 0.17


def heart_body(cut, fill, mask=None, uid="t"):
    kw = dict(CUTS[cut])
    if cut == "tiny":
        r = C.route(**kw)
        cut_out = C.svg_body(r, "#000")
        return (f'<mask id="ko-{uid}">'
                f'<path d="{C.W.heart_path(50, 50, 100, 100, flip_y=False)}" fill="#fff"/>'
                f'{cut_out}</mask>'
                f'<path d="{C.W.heart_path(50, 50, 100, 100, flip_y=False)}" '
                f'fill="{fill}" mask="url(#ko-{uid})"/>')
    outline = kw.pop("outline")
    r = C.route(**kw)
    body = C.svg_body(r, fill, outline=outline)
    if mask:
        return f'<g mask="url(#{mask})">{body}</g>'
    return body


def heart(cut="display", fill=NAVY, px=None, bg=None, pad=3.0, uid=None):
    h = f' height="{px}"' if px else ""
    rect = (f'<rect x="{-pad}" y="{-pad}" width="{100+2*pad}" height="{100+2*pad}" '
            f'fill="{bg}"/>') if bg else ""
    return (f'<svg viewBox="{-pad} {-pad} {100+2*pad} {100+2*pad}"{h} '
            f'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LOVELEEDAY">'
            f'{rect}{heart_body(cut, fill, uid=uid or f"{cut}{px or 0}")}</svg>')


def word_paths(wm, dx, dy, scale, fill, stroke=None, sw=0.0):
    extra = (f' stroke="{stroke}" stroke-width="{sw:.3f}" stroke-linejoin="round"'
             if stroke else "")
    return "".join(
        f'<path transform="translate({dx:.4f},{dy:.4f}) scale({scale:.6f})" '
        f'd="{p["d"]}" fill="{fill}"{extra}/>' for p in wm["parts"])


def lockup_overlay(wm, cut="display", px=None, ink=WHITE, bg=VERM, pad=7.0,
                   word_w=1.22, uid="ov"):
    """Daniel's composition: the wordmark laid across the middle of the heart,
       set wider than the heart so it overhangs on both sides.

       The word has to DOMINATE. In the source it runs well past both lobes and
       is the first thing read; set at the heart's own width it becomes one more
       piece of texture inside the mark and the company's name disappears.

       The viewBox is therefore the UNION of the heart's box and the word's box,
       not the heart's box with the word set loose inside it. Sizing the word
       past the heart and leaving the box alone silently amputated the first l
       and the last y -- an error that is invisible in the numbers and obvious
       the moment the thing is rendered."""
    w = 100.0 * word_w
    s = w / wm["width"]
    wx0 = (100 - w) / 2
    dx = wx0 - wm["x0"] * s
    dy = 50 - (wm["ink_top"] + wm["ink_bot"]) / 2 * s
    vx = min(0.0, wx0) - pad
    vw = max(100.0, wx0 + w) - vx + pad
    vy, vh = -pad, 100.0 + 2 * pad
    ko = (f'<mask id="{uid}"><rect x="{vx:.1f}" y="{vy:.1f}" width="{vw:.1f}" '
          f'height="{vh:.1f}" fill="#fff"/>'
          f'{word_paths(wm, dx, dy, s, "#000", "#000", KEEPOUT * wm["cap"] * s)}</mask>')
    h = f' height="{px}"' if px else ""
    rect = (f'<rect x="{vx:.1f}" y="{vy:.1f}" width="{vw:.1f}" height="{vh:.1f}" '
            f'fill="{bg}"/>') if bg else ""
    return (f'<svg viewBox="{vx:.1f} {vy:.1f} {vw:.1f} {vh:.1f}"{h} '
            f'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LOVELEEDAY">'
            f'{ko}{rect}{heart_body(cut, ink, mask=uid)}'
            f'{word_paths(wm, dx, dy, s, ink)}</svg>')


def lockup_h(wm, cut="medium", px=None, ink=NAVY, bg=None, gap=0.30):
    """Heart left, wordmark right, on one optical line -- the nav-bar lockup.
       The heart is set to the wordmark's ink height and centred on it, because
       a heart and a lowercase word do not share a baseline."""
    ih = wm["ink_bot"] - wm["ink_top"]
    s = 1.0
    size = ih * 0.96
    g = ih * gap
    dx = size + g - wm["x0"]
    total = size + g + wm["width"]
    body = (f'<g transform="translate(0,{wm["ink_top"] + (ih - size)/2:.1f}) '
            f'scale({size/100:.6f})">{heart_body(cut, ink)}</g>'
            + word_paths(wm, dx, 0, s, ink))
    h = f' height="{px}"' if px else ""
    rect = f'<rect x="0" y="{wm["ink_top"]}" width="{total}" height="{ih}" fill="{bg}"/>' if bg else ""
    return (f'<svg viewBox="0 {wm["ink_top"]:.1f} {total:.1f} {ih:.1f}"{h} '
            f'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LOVELEEDAY">'
            f'{rect}{body}</svg>')


# ---------------------------------------------------------------------------

def main():
    W.assert_symmetric()
    low = W.build(FACE, wght=WGHT, heart=False, word="loveleeday")
    caps = W.build(FACE, wght=WGHT, heart=True, ligature=False)
    BRAND.mkdir(parents=True, exist_ok=True)

    assets = {
        # the heart alone, all three cuts, in each colourway it has to appear in
        "heart.svg":                 heart("display", VERM),
        "heart-white.svg":           heart("display", WHITE),
        "heart-navy.svg":            heart("display", NAVY),
        "heart-md.svg":              heart("medium", VERM),
        "heart-md-white.svg":        heart("medium", WHITE),
        "heart-sm.svg":              heart("small", VERM),
        "heart-sm-white.svg":        heart("small", WHITE),
        "heart-tiny.svg":            heart("tiny", VERM, uid="ty1"),
        "heart-tiny-white.svg":      heart("tiny", WHITE, uid="ty2"),
        # on their grounds, for anywhere that cannot composite
        "heart-on-vermilion.svg":    heart("display", WHITE, bg=VERM),
        "heart-on-cream.svg":        heart("display", VERM, bg=CREAM),
        "heart-on-navy.svg":         heart("display", ON_NAVY, bg=NAVY),
        # the mark as chosen: wordmark across the heart
        "logo.svg":                  lockup_overlay(low, ink=WHITE, bg=VERM, uid="k1"),
        "logo-cream.svg":            lockup_overlay(low, ink=VERM, bg=CREAM, uid="k2"),
        "logo-navy.svg":             lockup_overlay(low, ink=ON_NAVY, bg=NAVY, uid="k3"),
        "logo-mono.svg":             lockup_overlay(low, ink=NAVY, bg=None, uid="k4"),
        # horizontal, for a nav bar and an email signature
        "lockup-h.svg":              lockup_h(low, ink=NAVY),
        "lockup-h-vermilion.svg":    lockup_h(low, ink=VERM),
        "lockup-h-white.svg":        lockup_h(low, ink=WHITE),
        # the word on its own
        "wordmark-lower.svg":        W.svg(low, fill=NAVY),
        "wordmark-lower-vermilion.svg": W.svg(low, fill=VERM),
        "wordmark-caps.svg":         W.svg(caps, fill=NAVY),
        # favicon / app icon: the small cut, on its ground, no transparency
        "icon.svg":                  heart("tiny", WHITE, bg=VERM, pad=9.0, uid="ic1"),
        "icon-sm.svg":               heart("small", WHITE, bg=VERM, pad=9.0, uid="ic2"),
        "icon-md.svg":               heart("medium", WHITE, bg=VERM, pad=9.0, uid="ic3"),
    }
    for name, svg in assets.items():
        (BRAND / name).write_text(svg + "\n")

    page(low, caps)
    print(f"{len(assets)} assets -> {BRAND.relative_to(ROOT)}")
    if "--png" in sys.argv:
        raster()


PNGS = [
    ("icon-16.png",    "icon.svg",     16),
    ("icon-32.png",    "icon-sm.svg",  32),
    ("icon-180.png",   "icon-md.svg",  180),
    ("icon-512.png",   "heart-on-vermilion.svg", 512),
    ("logo-1024.png",  "logo.svg",     1024),
    ("logo-cream-1024.png", "logo-cream.svg", 1024),
    ("heart-1024.png", "heart-on-vermilion.svg", 1024),
    ("lockup-h-512.png", "lockup-h.svg", 512),
]


def raster():
    """PNG from the same SVG the site serves, rendered by a real browser. Any
       other rasteriser is a second implementation of the mark."""
    script = BRAND.parent.parent / "scripts" / "type" / "_raster.py"
    script.write_text('''import asyncio, sys, pathlib
from playwright.async_api import async_playwright
BRAND = pathlib.Path(sys.argv[1])
JOBS = eval(sys.argv[2])
async def go():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for out, src, px in JOBS:
            svg = BRAND.joinpath(src).read_text()
            # Height only for anything whose viewBox is not square -- forcing a
            # square width letterboxes the logo inside transparent bars.
            svg = svg.replace("<svg ", f'<svg height="{px}" ', 1)
            pg = await b.new_page(viewport={"width": max(px, 16), "height": max(px, 16)})
            await pg.set_content(f'<body style="margin:0">{svg}</body>')
            el = await pg.query_selector("svg")
            await el.screenshot(path=str(BRAND / out), omit_background=True)
            await pg.close()
            print("  ", out, px)
        await b.close()
asyncio.run(go())
''')
    subprocess.run([sys.executable, str(script), str(BRAND), repr(PNGS)], check=True)
    script.unlink()


# ---------------------------------------------------------------------------

CSS = f"""
*,*::before,*::after{{box-sizing:border-box}}
body{{margin:0;background:{CREAM};color:{NAVY};
  font:400 15px/1.65 'Mulish',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}}
.w{{max-width:1120px;margin:0 auto;padding:0 clamp(20px,4vw,48px)}}
svg{{display:block}}
.lab{{font:500 10px/1 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.17em;
  text-transform:uppercase;color:{DIM}}}
header{{background:{VERM};color:#fff;padding:clamp(48px,7vw,86px) 0}}
header .lab{{color:rgba(255,255,255,.72)}}
header h1{{font:800 clamp(2rem,4.6vw,3.2rem)/1.03 'Manrope',system-ui,sans-serif;
  letter-spacing:-.035em;margin:16px 0 0;max-width:20ch}}
header p{{margin:20px 0 0;max-width:68ch;color:rgba(255,255,255,.88);font-size:16px}}
section{{border-bottom:1px solid {LINE};padding:clamp(44px,6vw,76px) 0}}
h2{{font:800 clamp(1.25rem,2.3vw,1.8rem)/1.1 'Manrope',system-ui,sans-serif;
  letter-spacing:-.025em;margin:14px 0 0}}
section > .w > p{{margin:18px 0 0;max-width:68ch;color:{MID}}}
.grid{{display:grid;gap:16px;margin-top:32px;grid-template-columns:repeat(auto-fit,minmax(230px,1fr))}}
.card{{border:1px solid {LINE};background:{WHITE};padding:0;overflow:hidden}}
.card .im{{display:grid;place-items:center;padding:30px 24px}}
.card .cap{{border-top:1px solid {LINE};padding:11px 14px;
  font:400 10px/1.4 'IBM Plex Mono',monospace;color:{DIM}}}
.scale{{display:flex;gap:clamp(22px,4vw,46px);align-items:flex-end;flex-wrap:wrap;
  margin-top:28px;background:{WHITE};border:1px solid {LINE};padding:28px 30px}}
.scale .i{{display:grid;justify-items:center;gap:10px}}
.scale .i span{{font:400 9px/1 'IBM Plex Mono',monospace;color:{DIM}}}
.nav{{background:{WHITE};border:1px solid {LINE};margin-top:28px}}
.nav .bar{{display:flex;align-items:center;justify-content:space-between;
  padding:16px 24px;border-bottom:1px solid {LINE}}}
.nav .links{{display:flex;gap:24px;font:500 12.5px/1 'Mulish',sans-serif;color:{MID}}}
.nav .body{{padding:40px 24px 50px;background:{CREAM}}}
.nav .body h3{{font:800 clamp(1.5rem,3.2vw,2.4rem)/1.05 'Manrope',sans-serif;
  letter-spacing:-.035em;margin:0;max-width:17ch}}
.note{{margin-top:28px;border-left:3px solid {VERM};padding:4px 0 4px 18px;
  color:{MID};max-width:66ch}}
.files{{margin-top:28px;border-top:1px solid {LINE}}}
.files div{{display:flex;justify-content:space-between;gap:20px;padding:9px 0;
  border-bottom:1px solid {LINE};font:400 12px/1.4 'IBM Plex Mono',monospace}}
.files b{{font-weight:500}} .files span{{color:{DIM};text-align:right}}
footer{{padding:40px 0 70px;color:{DIM};font-size:12.5px}}
"""


def page(low, caps):
    def card(inner, cap, bg=WHITE):
        return (f'<div class=card><div class="im" style="background:{bg}">{inner}</div>'
                f'<div class=cap>{cap}</div></div>')

    cuts = "".join(
        card(heart(c, VERM, px=150), f"{c} &middot; {CUTS[c]['tracks']} tracks &middot; "
             f"track {CUTS[c]['track']} &middot; pitch {CUTS[c]['pitch']}"
             + (" &middot; knocked out of a solid" if c == "tiny" else ""))
        for c in ("display", "medium", "small", "tiny"))

    ways = (card(heart("display", WHITE, px=150), "white on vermilion", VERM)
            + card(heart("display", VERM, px=150), "vermilion on cream", CREAM)
            + card(heart("display", ON_NAVY, px=150), "cream on navy", NAVY)
            + card(heart("display", NAVY, px=150), "navy on white", WHITE))

    logos = (card(lockup_overlay(low, px=190, ink=WHITE, bg=VERM, uid="q1"), "logo.svg", VERM)
             + card(lockup_overlay(low, px=190, ink=VERM, bg=CREAM, uid="q2"), "logo-cream.svg", CREAM)
             + card(lockup_overlay(low, px=190, ink=ON_NAVY, bg=NAVY, uid="q3"), "logo-navy.svg", NAVY))

    sizes = "".join(
        f'<div class=i>{heart(c, VERM, px=p)}<span>{p}px &middot; {c}</span></div>'
        for c, p in (("display", 128), ("display", 64), ("medium", 64),
                     ("medium", 32), ("small", 32), ("small", 22),
                     ("tiny", 22), ("tiny", 16)))

    files = "".join(
        f'<div><b>{f.name}</b><span>{f.stat().st_size:,} bytes</span></div>'
        for f in sorted(BRAND.glob("*.svg")))

    body = f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>LOVELEEDAY &mdash; brand assets</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;800&family=Mulish:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel=stylesheet>
<style>{CSS}</style></head><body>

<header><div class=w>
  <div class=lab>Brand assets &middot; the circuit heart</div>
  <h1>The mark you picked, built.</h1>
  <p>Rebuilt as vector rather than traced, because the source had three things
  in it that were the generator&rsquo;s, not yours: the silhouette was a circle, a
  blob and a ragged triangle rather than a heart; the two halves ran at opposite
  polarity; and the middle band had no heart under the wordmark to extract. What
  is kept is the design &mdash; a heart routed as a printed board, the word laid
  across it, on vermilion.</p>
</div></header>

<section><div class=w>
  <div class=lab>01 &middot; The heart, on its own</div>
  <h2>Three cuts, not one file scaled.</h2>
  <p>Sixty-eight tracks is a different drawing at 16&thinsp;px than at 400. At
  favicon size the tracks close up and the heart fills in solid, so the heart is
  routed three times at three densities, and the right one is used at the right
  size &mdash; the same thing a type family does with display, text and caption.</p>
  <div class=grid>{cuts}</div>
  <div class=scale>{sizes}</div>
</div></section>

<section><div class=w>
  <div class=lab>02 &middot; Colourways</div>
  <h2>One drawing, four grounds.</h2>
  <div class=grid>{ways}</div>
  <div class=note>Your pick is on vermilion <b>#E74F32</b>. The site currently
  ships cream, navy and teal, and both are generated here. That is a decision
  worth making on purpose rather than by which file gets used first: vermilion
  as the brand colour with cream and navy as the system, or vermilion kept for
  the mark alone.</div>
</div></section>

<section><div class=w>
  <div class=lab>03 &middot; The logo</div>
  <h2>The word across the heart, with the tracks cleared behind it.</h2>
  <p>Where the wordmark crosses, the tracks stop short of the letters instead of
  running under them. That is how silkscreen sits on a real board, and it is the
  difference between type <em>on</em> the mark and type lost in it.</p>
  <div class=grid>{logos}</div>
</div></section>

<section><div class=w>
  <div class=lab>04 &middot; Horizontal lockup</div>
  <h2>For a nav bar, a signature, a favicon row.</h2>
  <div class=nav>
    <div class=bar>{lockup_h(low, px=26, ink=NAVY)}
      <div class=links><span>Work</span><span>Companies</span><span>Practice</span>
        <span>Contact</span></div></div>
    <div class=body><h3>We build the systems other people describe.</h3></div>
  </div>
  <div class=grid style="margin-top:16px">
    {card(lockup_h(low, px=34, ink=VERM), "lockup-h-vermilion.svg")}
    {card(lockup_h(low, px=34, ink=WHITE), "lockup-h-white.svg", NAVY)}
    {card(W.svg(low, fill=NAVY, height=30), "wordmark-lower.svg")}
  </div>
</div></section>

<section><div class=w>
  <div class=lab>05 &middot; Files</div>
  <h2>What is in <code>public/brand/</code>.</h2>
  <div class=files>{files}</div>
</div></section>

<footer><div class=w>
  Generated by <code>scripts/type/brand.py</code>. Geometry lives in
  <code>circuit.py</code> and <code>wordmark.py</code>; change it there and re-run.
  Re-run with <code>--png</code> to rasterise the PNG set from the same SVGs the
  site serves.
</div></footer>
</body></html>"""
    (ROOT / "concepts" / "studio" / "brand.html").write_text(body)


if __name__ == "__main__":
    main()
