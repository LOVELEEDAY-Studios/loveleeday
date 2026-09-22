#!/usr/bin/env python3
"""Monolith, body rebuilt at firm scale.

    python3 concepts/studio/build-mono2.py -> concepts/studio/mono2/index.html

Daniel: "i love the hero section and the brain i hate everything else looks
like a claude ai site not a site produced for companies like apple or palantir."

He is right, and the diagnosis is specific. What made the body read as an AI
product page was not the content, it was six habits, every one of which the
firms he named refuse:

  1. BORDERED BOXES. A 3-up card strip, a bordered console, ruled finding rows.
     Cards are the SaaS tell. Apple has none. Information is separated by SPACE.
  2. AN EYEBROW ON EVERY SECTION. amber mono label -> serif heading -> lede,
     five times down the page. That triplet IS the template.
  3. TIMID DISPLAY TYPE. Section heads at ~2rem. Apple sets them at 5-9vw.
     At firm scale the type is the layout; at 2rem it is just a paragraph.
  4. UNIFORM RHYTHM. Every section the same height and shape, so nothing lands.
  5. MUDDY ALTERNATION. Brown tint bands alternating to fake structure.
  6. A CENTERED TWO-BUTTON CTA. The most generic object on the web.

So the body is rebuilt on the opposite rules, which are simply what Apple and
Palantir actually do: ONE IDEA PER SCREEN, type large enough to be the design,
photography full bleed and uninterrupted, numbers at display scale rather than
in a stat rail, and hairlines instead of boxes on the one dense block that
earns density.

Unchanged, because he said so: the hero and the brain. Same markup, same
mount, same figures.
"""

from pathlib import Path

import store as _F

HERE = Path(__file__).parent
OUT = HERE / "mono2"
OUT.mkdir(exist_ok=True)
_D = _F.read_store()

PHOTO = "../../../public/studio/firm/"
FRAMES = {"atrium": "atrium.jpg", "colonnade": "colonnade.jpg",
          "people-window": "people-window.jpg"}

BRAIN = (HERE / "brain3d.js").read_text() \
    .replace("__OBS__", f"{_D['props']:,}").replace("__SRC__", str(_D['sources']))

N = {"obj": f"{_D['objects']:,}", "obs": f"{_D['props']:,}", "src": str(_D['sources']),
     "nolin": str(_D['nolin']), "sites": _F.SITES_MEASURED, "rbd": _F.REBUILDS}

CSS = """
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
:root{--void:#140804;--ink:#241109;--bone:#FBF6EE;--amber:#E8A24A;
  --edge:rgba(251,246,238,.14);
  --sans:'Inter Tight',system-ui,sans-serif;--ser:'Instrument Serif',Georgia,serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,monospace}
body{margin:0;background:var(--void);color:var(--bone);
  font:400 17px/1.6 var(--sans);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.w{width:min(1320px,100%);margin:0 auto;padding:0 clamp(20px,5vw,72px)}

/* ── hero: UNCHANGED, he approved it ─────────────────────────────────────── */
.bar{display:flex;align-items:center;gap:26px;padding:22px clamp(20px,5vw,72px);
  position:relative;z-index:3}
.bd{font:500 15px/1 var(--sans);letter-spacing:.14em}
.nl{display:flex;gap:23px;margin-left:8px}
.nl a{font:400 14px/1 var(--sans);opacity:.8}
.cta{margin-left:auto}
.btn{display:inline-block;padding:10px 18px;font:500 13.5px/1 var(--sans);
  border:1px solid currentColor}
.btn.solid{background:var(--bone);color:var(--ink);border-color:var(--bone)}
.plate{position:relative;background:#241109;overflow:hidden}
.plate img{display:block;width:100%;height:100%;object-fit:cover}
.miss{position:absolute;inset:0;display:grid;place-items:center;text-align:center;
  font:500 11px/1.7 var(--mono);letter-spacing:.12em;color:rgba(251,246,238,.5);
  background:repeating-linear-gradient(45deg,#2A1610 0 12px,#241109 12px 24px)}
.hero{position:relative}
.hero .plate{height:clamp(430px,58vw,720px)}
.hero .scrim{position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(20,8,4,.58) 0%,rgba(20,8,4,.10) 40%,rgba(20,8,4,.88) 100%)}
.hero .over{position:absolute;inset:0;display:flex;flex-direction:column;
  padding-bottom:clamp(24px,4vw,48px)}
.hero .mark{margin-top:auto;font:200 clamp(2.2rem,8vw,7rem)/1 var(--sans);
  letter-spacing:.26em;text-indent:.26em;text-align:center}
.hero .line{margin-top:18px;text-align:center;
  font:400 clamp(1rem,1.7vw,1.32rem)/1.4 var(--ser);font-style:italic;
  color:rgba(251,246,238,.92)}
.rule{display:flex;gap:clamp(20px,3.4vw,40px);flex-wrap:wrap;
  border-top:1px solid var(--edge);padding-top:15px;margin-top:clamp(20px,3vw,36px)}
.rule div{font:500 10.5px/1.5 var(--mono);letter-spacing:.1em;
  color:rgba(251,246,238,.62);text-transform:uppercase}
.rule b{display:block;margin-bottom:5px;font:400 1.45rem/1 var(--sans);color:var(--bone);
  letter-spacing:-.02em;font-variant-numeric:tabular-nums}

/* ── the body, rebuilt ───────────────────────────────────────────────────── */

/* One idea per screen. The section is mostly air; the type IS the layout. */
.stmt{min-height:88vh;display:flex;align-items:center;
  padding:clamp(60px,12vh,150px) 0}
.stmt h2{margin:0;max-width:18ch;
  font:300 clamp(2.6rem,7.2vw,6.6rem)/.98 var(--sans);letter-spacing:-.045em}
.stmt h2 em{font-family:var(--ser);font-style:italic;font-weight:400;
  letter-spacing:-.02em;color:var(--amber)}
.stmt .under{margin-top:clamp(26px,4vh,52px);max-width:46ch;
  font:300 clamp(1.25rem,2vw,1.75rem)/1.42 var(--sans);letter-spacing:-.018em;
  color:rgba(251,246,238,.72)}

/* A number IS a section. Not a stat card. */
.fig{min-height:80vh;display:flex;flex-direction:column;justify-content:center;
  padding:clamp(50px,10vh,130px) 0}
.fig b{display:block;font:200 clamp(5rem,20vw,17rem)/.82 var(--sans);
  letter-spacing:-.06em;font-variant-numeric:tabular-nums}
.fig span{display:block;margin-top:clamp(20px,3vh,38px);max-width:44ch;
  font:300 clamp(1.25rem,2vw,1.75rem)/1.42 var(--sans);letter-spacing:-.018em;
  color:rgba(251,246,238,.72)}

/* Photography runs edge to edge and is never captioned or cropped into a card. */
.bleed{position:relative;height:clamp(340px,64vh,760px);background:#241109}
.bleed .plate{position:absolute;inset:0}

/* The one dense block. Hairlines, flush left, no box around it. */
.trace{padding:clamp(70px,13vh,170px) 0;background:var(--bone);color:var(--ink)}
.trace .lead{margin:0 0 clamp(34px,5vh,64px);max-width:20ch;
  font:300 clamp(2rem,4.6vw,3.9rem)/1.02 var(--sans);letter-spacing:-.042em}
.trace .lead em{font-family:var(--ser);font-style:italic;font-weight:400;color:#B4470F}
.trace .t{display:grid;grid-template-columns:1fr;gap:6px;padding:22px 0;
  border-bottom:1px solid rgba(36,17,9,.18)}
@media(min-width:900px){.trace .t{grid-template-columns:1fr 1fr;gap:34px;align-items:baseline}}
.trace .t:first-child{border-top:1px solid rgba(36,17,9,.18)}
.trace .k{font:400 clamp(1.15rem,1.9vw,1.6rem)/1.3 var(--sans);letter-spacing:-.024em}
.trace .v{font:500 12px/1.6 var(--mono);letter-spacing:.05em;color:#B4470F}

/* Close: one line, left, no button pair. */
.end{min-height:74vh;display:flex;align-items:center;padding:clamp(50px,10vh,130px) 0}
.end h2{margin:0;max-width:16ch;font:300 clamp(2.6rem,7.6vw,7rem)/.98 var(--sans);
  letter-spacing:-.048em}
.end h2 em{font-family:var(--ser);font-style:italic;font-weight:400;color:var(--amber)}
.end a{display:inline-block;margin-top:clamp(28px,4vh,52px);
  font:400 clamp(1.05rem,1.5vw,1.3rem)/1 var(--sans);
  border-bottom:1px solid rgba(251,246,238,.45);padding-bottom:8px}
.end a:hover{border-bottom-color:var(--bone)}

/* brain — unchanged */
.brain{position:relative;background:#0B0608;overflow:hidden;
  height:clamp(430px,70vh,760px)}
.brain canvas{display:block;width:100%;height:100%}
"""


def plate(frame):
    f = HERE.parent.parent / "public/studio/firm" / FRAMES[frame]
    inner = (f'<img src="{PHOTO}{FRAMES[frame]}" alt="">' if f.exists()
             else f'<div class=miss>{frame.upper()}<br>frame not generated yet</div>')
    return f'<div class=plate>{inner}</div>'


TRACE = [("Northwind Materials resolves from four records",
          "registry · ledger · payments · catalogue"),
         ("Net 30, true from 2026-06-30, observed 2026-06-30",
          "ledger contact:4XRH rev 12"),
         ("$48,210.55 open, as of the last settlement",
          "payments inv_1Qd7&hellip; +6 more"),
         ("Price tier T2, reinstated 2026-09-21",
          "catalogue tier-roll 2026-09-21")]


def build():
    trace = "".join(
        f'<div class=t><div class=k>{k}</div><div class=v>&larr; {v}</div></div>'
        for k, v in TRACE)

    body = f"""<div class=hero>{plate('atrium')}<div class=scrim></div><div class=over>
  <div class=bar><span class=bd>LOVELEEDAY</span>
    <div class=nl><a href="#">Platform</a><a href="#">Work</a><a href="#">Company</a></div>
    <div class=cta><a class="btn solid" href="#">Start a project</a></div></div>
  <div class=mark>LOVELEEDAY</div>
  <div class=line>It answers the question you did not think to ask.</div>
  <div class=w><div class=rule>
    <div><b>{N['obj']}</b>objects resolved</div><div><b>{N['obs']}</b>observations</div>
    <div><b>{N['src']}</b>live sources</div><div><b>{N['nolin']}</b>without lineage</div>
  </div></div></div></div>

<section class=stmt><div class=w>
  <h2>We were hired to move <em>the price lists.</em></h2>
  <p class=under>Hundreds of items had a floor beneath what they cost to buy.
  Nobody had asked, because nothing in the system asks it.</p>
</div></section>

<div class=bleed>{plate('colonnade')}</div>

<div class=brain><canvas data-brain></canvas></div>

<section class=fig><div class=w>
  <b>{N['obs']}</b>
  <span>observations in the store, and not one of them may be written without
  naming the system it came from.</span>
</div></section>

<section class=trace><div class=w>
  <h2 class=lead>Every value, <em>with its receipt.</em></h2>
  {trace}</div></section>

<div class=bleed>{plate('people-window')}</div>

<section class=stmt><div class=w>
  <h2>{N['sites']} sites measured. <em>{N['rbd']} rebuilt.</em></h2>
  <p class=under>Nobody commissioned those either.</p>
</div></section>

<section class=end><div class=w>
  <h2>See the question. <em>Build the answer.</em></h2>
  <a href="#">Start a project &rarr;</a>
</div></section>"""

    html = f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>LOVELEEDAY &mdash; Monolith</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@200;300;400;500&display=swap" rel=stylesheet>
<style>{CSS}</style></head><body>
{body}
<script>{BRAIN}</script>
<script>
document.querySelectorAll('canvas[data-brain]').forEach(function (c, i) {{
  window.Brain3D.mount(c, {{ style: 'lobe', seed: 5 + i }});
}});
</script>
</body></html>"""
    (OUT / "index.html").write_text(html)
    missing = [k for k, v in FRAMES.items()
               if not (HERE.parent.parent / "public/studio/firm" / v).exists()]
    print(f"wrote {OUT/'index.html'} ({len(html):,} bytes, "
          f"{len(FRAMES)-len(missing)}/{len(FRAMES)} frames)")


if __name__ == "__main__":
    build()
