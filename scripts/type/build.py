#!/usr/bin/env python3
"""Produce the identity: the SVG assets the site uses, and the page that proves
   them. Both come out of this one script, so the page can never advertise a
   mark that the site is not actually serving -- which is the failure this repo
   already had once, when the portfolio kept showing a Novarna design that had
   been replaced.

     python3 scripts/type/build.py

   Writes  public/brand/*.svg        the production assets
           concepts/studio/identity.html   the proof
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import wordmark as W
import emblem as E

ROOT = Path(__file__).resolve().parents[2]
# NOT public/brand. Daniel picked the circuit heart on 2026-09-21, so
# public/brand holds exactly one identity and this direction keeps its own
# folder as the record of the round. Two identities in the folder the site
# serves from is how the wrong logo ships.
BRAND = ROOT / "concepts" / "studio" / "assets-modular"

FACE, WGHT = "Manrope", 800          # the face the site already ships
N, CHANNEL, RADIUS = 7, 0.095, 0.14  # the emblem grid, chosen against a rendered proof
ACCENT_CELL = (2, 3)

GROUND, PAPER, SUNK, DEEP = "#FBF8F2", "#FFFFFF", "#F2EDE3", "#16243A"
INK, MID, DIM, LINE = "#16243A", "#45536A", "#667383", "#E6E0D6"
ON_DEEP, TEAL = "#F6F3EC", "#0E7C7B"


def emblem_svg(fill=INK, accent=None, uid="e", size=100.0):
    step, gap = size / N, (size / N) * CHANNEL
    cells = []
    for r in range(N):
        for c in range(N):
            f = TEAL if accent and (r, c) == accent else fill
            cells.append(f'<rect x="{c*step+gap/2:.2f}" y="{r*step+gap/2:.2f}" '
                         f'width="{step-gap:.2f}" height="{step-gap:.2f}" '
                         f'rx="{step*RADIUS:.2f}" fill="{f}"/>')
    return (f'<defs><clipPath id="{uid}"><path d="{E.heart_d(size)}"/></clipPath></defs>'
            f'<g clip-path="url(#{uid})">{"".join(cells)}</g>')


def emblem(px=None, fill=INK, accent=None, uid="e"):
    return E.wrap(emblem_svg(fill, accent, uid), px=px)


# The lockup's only two numbers, and the only two that ever go wrong.
LOCKUP_GAP   = 0.56   # emblem-to-wordmark, as a fraction of cap
LOCKUP_SCALE = 0.93   # emblem height, as a fraction of cap


def lockup(wm, px=40, fill=INK, uid="l"):
    """Emblem and wordmark on one optical line.

       The emblem is set BELOW the cap height, not to it. A solid heart carries
       more ink than a letter of the same height and reads heavier beside one;
       at a true 1:1 the mark looked like it had been pasted in from a larger
       lockup. It is then centred on the cap rather than sat on the baseline,
       because the heart's mass is in its lobes and its point is empty."""
    cap, x0, w = wm["cap"], wm["x0"], wm["width"]
    size = cap * LOCKUP_SCALE
    gap = cap * LOCKUP_GAP
    top = (cap - size) / 2
    body = [f'<g transform="translate(0,{top:.1f}) scale({size/100:.5f})">'
            f'{emblem_svg(fill, None, uid)}</g>']
    for p in wm["parts"]:
        body.append(f'<path transform="translate({size+gap-x0:.1f},{cap:.1f})" '
                    f'd="{p["d"]}" fill="{fill}" fill-rule="evenodd"/>')
    total = size + gap + w
    return (f'<svg viewBox="0 0 {total:.1f} {cap}" height="{px}" '
            f'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LOVELEEDAY">'
            f'{"".join(body)}</svg>')


def main():
    W.assert_symmetric()
    # Two cuts of the same wordmark, which is how a display face and a text face
    # have always related to each other. DISPLAY joins the doubled E -- the one
    # thing in this name that is structurally its own -- and TEXT separates it,
    # because at a nav bar's 11px the shared stem closes up into a blot.
    wm = W.build(FACE, wght=WGHT, ligature=True)
    wt = W.build(FACE, wght=WGHT, ligature=False)
    BRAND.mkdir(parents=True, exist_ok=True)

    assets = {
        "emblem.svg":          emblem(fill=INK, uid="e"),
        "emblem-reversed.svg": emblem(fill=ON_DEEP, uid="er"),
        "emblem-accent.svg":   emblem(fill=INK, accent=ACCENT_CELL, uid="ea"),
        "wordmark.svg":          W.svg(wm, fill=INK),
        "wordmark-reversed.svg":  W.svg(wm, fill=ON_DEEP),
        "wordmark-text.svg":      W.svg(wt, fill=INK),
        "wordmark-text-reversed.svg": W.svg(wt, fill=ON_DEEP),
        "lockup.svg":             lockup(wm, fill=INK, uid="lk"),
        "lockup-reversed.svg":    lockup(wm, fill=ON_DEEP, uid="lkr"),
        "lockup-text.svg":        lockup(wt, fill=INK, uid="lkt"),
    }
    for name, svg in assets.items():
        (BRAND / name).write_text(svg + "\n")

    page(wm, wt)
    print(f"{len(assets)} assets -> {BRAND.relative_to(ROOT)}")
    print(f"proof         -> {(ROOT/'concepts/studio/identity.html').relative_to(ROOT)}")
    print(f"wordmark      {FACE} {WGHT} · cap {wm['cap']} · stem {wm['stem']} · "
          f"aspect {wm['width']/wm['cap']:.2f}:1")


# ---------------------------------------------------------------------------

CSS = f"""
*,*::before,*::after{{box-sizing:border-box}}
body{{margin:0;background:{GROUND};color:{INK};
  font:400 15px/1.65 'Mulish',ui-sans-serif,system-ui,sans-serif;
  -webkit-font-smoothing:antialiased}}
.w{{max-width:1120px;margin:0 auto;padding:0 clamp(20px,4vw,48px)}}
svg{{display:block}}
.lab{{font:500 10px/1 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.17em;
  text-transform:uppercase;color:{DIM}}}
header{{padding:clamp(56px,8vw,104px) 0 clamp(34px,4vw,56px);border-bottom:1px solid {LINE}}}
header h1{{font:800 clamp(2.1rem,5vw,3.4rem)/1.02 'Manrope',system-ui,sans-serif;
  letter-spacing:-.035em;margin:16px 0 0;max-width:20ch}}
header p{{margin:22px 0 0;max-width:70ch;color:{MID};font-size:16px}}
section{{border-bottom:1px solid {LINE};padding:clamp(44px,6vw,80px) 0}}
h2{{font:800 clamp(1.3rem,2.4vw,1.85rem)/1.1 'Manrope',system-ui,sans-serif;
  letter-spacing:-.025em;margin:14px 0 0}}
section > .w > p{{margin:18px 0 0;max-width:68ch;color:{MID}}}
.stage{{margin-top:clamp(34px,4vw,54px);background:{PAPER};border:1px solid {LINE};
  display:grid;place-items:center;padding:clamp(40px,6vw,86px) 24px}}
.stage.deep{{background:{DEEP};border-color:{DEEP}}}
.scale{{display:flex;gap:clamp(26px,4vw,54px);align-items:flex-end;flex-wrap:wrap;
  margin-top:30px;background:{PAPER};border:1px solid {LINE};padding:30px 32px}}
.scale.deep{{background:{DEEP};border-color:{DEEP}}}
.scale .i{{display:grid;justify-items:center;gap:11px}}
.scale .i span{{font:400 9px/1 'IBM Plex Mono',monospace;color:{DIM}}}
.scale.deep .i span{{color:#808CA0}}
.two{{display:grid;gap:clamp(16px,2vw,22px);margin-top:30px}}
@media(min-width:840px){{.two{{grid-template-columns:1fr 1fr}}}}
.panel{{background:{PAPER};border:1px solid {LINE};padding:28px 30px 30px}}
.panel.deep{{background:{DEEP};border-color:{DEEP}}}
.panel .lab{{margin-bottom:22px}}
.panel.deep .lab{{color:#808CA0}}
.facts{{margin-top:30px;border-top:1px solid {LINE}}}
.facts div{{display:flex;justify-content:space-between;gap:24px;padding:11px 0;
  border-bottom:1px solid {LINE};font:400 12.5px/1.5 'IBM Plex Mono',monospace}}
.facts b{{font-weight:500;color:{INK}}} .facts span{{color:{DIM};text-align:right}}
.nav{{background:{PAPER};border:1px solid {LINE};margin-top:30px}}
.nav .bar{{display:flex;align-items:center;justify-content:space-between;
  padding:17px 26px;border-bottom:1px solid {LINE}}}
.nav .links{{display:flex;gap:26px;font:500 12.5px/1 'Mulish',sans-serif;color:{MID}}}
.nav .body{{padding:44px 26px 54px;background:{GROUND}}}
.nav .body h3{{font:800 clamp(1.6rem,3.4vw,2.6rem)/1.05 'Manrope',sans-serif;
  letter-spacing:-.035em;margin:0;max-width:16ch}}
.tab{{display:flex;align-items:center;gap:9px;background:{SUNK};
  border:1px solid {LINE};border-bottom:0;border-radius:7px 7px 0 0;
  padding:8px 14px 8px 11px;width:max-content;
  font:400 11.5px/1 'Mulish',sans-serif;color:{MID}}}
footer{{padding:44px 0 74px;color:{DIM};font-size:12.5px}}
"""


def page(wm, wt):
    E32 = emblem(32, uid="p1"); E22 = emblem(22, uid="p2"); E16 = emblem(16, uid="p3")
    body = f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>LOVELEEDAY &mdash; identity</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;800&family=Mulish:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel=stylesheet>
<style>{CSS}</style></head><body>

<header><div class=w>
  <div class=lab>Identity &middot; one mark, one wordmark, one lockup</div>
  <h1>The heart is the system.</h1>
  <p>Not a heart with a network drawn on top of it &mdash; that was tried, twenty-four times,
  and it reads as a tangle at full size and a smudge at sixteen pixels. The heart is
  <em>assembled</em>. It is a single silhouette divided into modules by channels, so the parts
  are visible and the outline never breaks. The same heart, at a fifth of the size, is the
  counter inside the O.</p>
</div></header>

<section><div class=w>
  <div class=lab>01 &middot; The mark</div>
  <h2>Forty-nine modules on one grid, cut to one silhouette.</h2>
  <div class=stage>{emblem(260, uid="hero")}</div>
  <div class=scale>
    <div class=i>{emblem(64, uid="s1")}<span>64</span></div>
    <div class=i>{E32}<span>32</span></div>
    <div class=i>{E22}<span>22</span></div>
    <div class=i>{E16}<span>16 &mdash; favicon</span></div>
  </div>
  <div class="scale deep">
    <div class=i>{emblem(64, fill=ON_DEEP, uid="r1")}<span>64</span></div>
    <div class=i>{emblem(32, fill=ON_DEEP, uid="r2")}<span>32</span></div>
    <div class=i>{emblem(22, fill=ON_DEEP, uid="r3")}<span>22</span></div>
    <div class=i>{emblem(16, fill=ON_DEEP, uid="r4")}<span>16</span></div>
  </div>
  <div class=two>
    <div class=panel><div class=lab>Accent &mdash; one module live</div>
      <div style="display:grid;place-items:center;padding:20px 0">
        {emblem(150, accent=ACCENT_CELL, uid="ac")}</div></div>
    <div class="panel deep"><div class=lab>Reversed</div>
      <div style="display:grid;place-items:center;padding:20px 0">
        {emblem(150, fill=ON_DEEP, uid="rv")}</div></div>
  </div>
</div></section>

<section><div class=w>
  <div class=lab>02 &middot; The wordmark</div>
  <h2>Real outlines, measured spacing, one letter redrawn.</h2>
  <p>{FACE} {WGHT} &mdash; the face the site already sets its headlines in. The O keeps the
  typeface&rsquo;s own outer contour; only its counter is replaced. Spacing is not a table of
  guessed numbers: the facing ink profiles of every adjacent pair are sampled across their
  shared height and the advance solved for a constant average gap, with a floor that makes a
  collision impossible.</p>
  <div class=stage>{W.svg(wm, fill=INK, height=76)}</div>
  <div class=scale>
    <div class=i>{W.svg(wt, fill=INK, height=30)}<span>30 &mdash; text cut</span></div>
    <div class=i>{W.svg(wt, fill=INK, height=18)}<span>18 &mdash; text cut</span></div>
    <div class=i>{W.svg(wt, fill=INK, height=11)}<span>11 &mdash; text cut</span></div>
  </div>
  <div class=two>
    <div class=panel><div class=lab>Display cut &mdash; the doubled E joined</div>
      {W.svg(wm, fill=INK, height=40)}
      <p style="margin:20px 0 0;font-size:13.5px;color:{MID}">The two E&rsquo;s share one
      stem, so their arms read as rungs between two verticals. It is the only place in this
      name that is structurally its own, and it says the same thing the emblem says &mdash;
      separate parts, joined. {wm['width']/wm['cap']:.2f}&thinsp;:&thinsp;1.</p></div>
    <div class=panel><div class=lab>Text cut &mdash; separated</div>
      {W.svg(wt, fill=INK, height=40)}
      <p style="margin:20px 0 0;font-size:13.5px;color:{MID}">Below about 16&thinsp;px the
      shared stem closes into a blot and the word loses a letter. The text cut is what goes
      in a nav bar, a favicon row and body copy. {wt['width']/wt['cap']:.2f}&thinsp;:&thinsp;1.</p></div>
  </div>
  <div class="stage deep">{W.svg(wm, fill=ON_DEEP, height=44)}</div>
  <div class=facts>
    <div><b>Typeface</b><span>{FACE} {WGHT} &middot; cap {wm['cap']} units</span></div>
    <div><b>Stem, measured off the H</b><span>{wm['stem']} units &middot;
      {wm['stem']/wm['cap']*100:.1f}% of cap</span></div>
    <div><b>Spacing</b><span>mean gap {W.GAP_MEAN:.3f} of cap &middot;
      floor {W.GAP_MIN:.3f} &middot; {W.SAMPLES} scanlines per pair</span></div>
    <div><b>Counter</b><span>heart fitted to the O&rsquo;s counter, inset
      {W.HEART_INSET:.2f} of the stem</span></div>
    <div><b>Proportion</b><span>{wm['width']/wm['cap']:.2f} : 1</span></div>
    <div><b>Lockup</b><span>emblem {LOCKUP_SCALE:.2f} of cap &middot;
      gap {LOCKUP_GAP:.2f} of cap</span></div>
  </div>
</div></section>

<section><div class=w>
  <div class=lab>03 &middot; The lockup</div>
  <h2>The emblem is set to the cap, not to the line.</h2>
  <div class=stage>{lockup(wm, px=58, uid="lk1")}</div>
  <div class="stage deep">{lockup(wm, px=40, fill=ON_DEEP, uid="lk2")}</div>
</div></section>

<section><div class=w>
  <div class=lab>04 &middot; Applied</div>
  <h2>Where it actually has to work.</h2>
  <div class=nav>
    <div class=bar>{lockup(wt, px=21, uid="nv")}
      <div class=links><span>Work</span><span>Companies</span><span>Practice</span>
        <span>Contact</span></div></div>
    <div class=body><h3>We build the systems other people describe.</h3></div>
  </div>
  <div style="margin-top:22px">
    <div class=tab>{E16}<span>LOVELEEDAY Studios</span></div>
  </div>
</div></section>

<footer><div class=w>
  Generated by <code>scripts/type/build.py</code> from the vendored outlines in
  <code>scripts/type/</code>. Nothing on this page is drawn by hand; change the
  geometry and re-run.
</div></footer>
</body></html>"""
    (ROOT / "concepts" / "studio" / "identity.html").write_text(body)


if __name__ == "__main__":
    main()
