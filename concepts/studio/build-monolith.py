#!/usr/bin/env python3
"""Monolith, five ways — the whole page, not five heroes.

    python3 concepts/studio/build-monolith.py -> concepts/studio/monolith/index.html

Daniel picked Monolith and asked for five layouts of what the PAGE looks like,
with photographs of people, with the brain, and with "answering the question no
one asked" as the thing the page is actually about.

The earlier direction said no people. That was wrong as stated. The failure in
the old photography was never people -- it was people AT SCREENS IN A SERVER
ROOM, which is how a small software shop photographs itself. A single figure
inside monumental architecture is how a firm does it: the room dominates, the
person gives it scale, and nobody reads it as a startup. So the people frames
here are architecture photographs that happen to contain someone.

What stays fixed across all five, because it is what makes it Monolith:
  · the wordmark set INTO a full-bleed photograph at full letterspacing
  · warm stone against brown-black, one raking shaft, never a flat scrim
  · proof as a rule of figures, never as a row of cards
  · the site's real tokens -- Instrument Serif, Inter Tight, bone/ink/hot

What changes is the ORDER OF THE ARGUMENT, which is the actual decision:
  A Descent    hero -> asked/found narrative -> brain full bleed -> rail -> close
  B Ledger     hero -> evidence console first -> quote over a person -> brain inline
  C Portrait   hero -> person at the window beside the story -> brain as the break
  D Cognition  hero -> brain immediately, full bleed -> three findings -> figures
  E Spread     hero -> magazine split -> brain in a dark band -> numbered findings

Every figure is read from the ontology by store.py. A concept that misstates the
numbers cannot be judged as a concept.
"""

from pathlib import Path

import store as _F

HERE = Path(__file__).parent
OUT = HERE / "monolith"
OUT.mkdir(exist_ok=True)
_D = _F.read_store()

PHOTO = "../../../public/studio/firm/"
FRAMES = {
    "atrium":        "atrium.jpg",
    "colonnade":     "colonnade.jpg",
    "people-hall":   "people-hall.jpg",
    "people-desk":   "people-desk.jpg",
    "people-window": "people-window.jpg",
}

BRAIN = (HERE / "brain3d.js").read_text() \
    .replace("__OBS__", f"{_D['props']:,}").replace("__SRC__", str(_D['sources']))

N = {"obj": f"{_D['objects']:,}", "obs": f"{_D['props']:,}", "live": f"{_D['live']:,}",
     "src": str(_D['sources']), "nolin": str(_D['nolin']), "watch": str(_D['watches']),
     "fired": str(_D['fired']), "sites": _F.SITES_MEASURED, "rbd": _F.REBUILDS}

CSS = """
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
:root{--ink:#241109;--deep:#1C0904;--void:#140804;--bone:#FBF6EE;--mu:#63523F;
  --line:#E4D9C9;--hot:#B4470F;--amber:#E8A24A;--edge:rgba(251,246,238,.16);
  --sans:'Inter Tight',system-ui,sans-serif;--ser:'Instrument Serif',Georgia,serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,monospace}
body{margin:0;background:#141414;color:var(--bone);
  font:400 17px/1.6 var(--sans);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.w{width:min(1240px,100%);margin:0 auto;padding:0 clamp(18px,4vw,54px)}

/* review chrome */
.top{padding:44px 0 28px;border-bottom:1px solid var(--edge)}
.top h1{margin:0;font:400 clamp(2rem,4vw,3.2rem)/1.02 var(--ser);letter-spacing:-.02em}
.top h1 em{font-style:italic;color:var(--amber)}
.top p{margin:13px 0 0;max-width:80ch;color:rgba(251,246,238,.7);font-size:15px}
.case{border-top:1px solid var(--edge);padding-top:clamp(24px,4vw,42px);
  margin-top:clamp(28px,5vw,54px)}
.caseh .n{font:500 12px/1 var(--mono);color:var(--amber);letter-spacing:.14em}
.caseh h3{margin:9px 0 0;font:300 clamp(1.4rem,2.5vw,2rem)/1.1 var(--sans);letter-spacing:-.03em}
.caseh .ord{margin-top:7px;font:500 11px/1.6 var(--mono);letter-spacing:.07em;color:var(--amber);
  text-transform:uppercase}
.caseh p{margin-top:11px;max-width:78ch;color:rgba(251,246,238,.66);font-size:15px;line-height:1.62}
.fr{margin-top:clamp(18px,3vw,30px);overflow:hidden;border:1px solid var(--edge)}

/* ---- page furniture shared by all five ---- */
.pg{background:var(--void);color:var(--bone)}
.bar{display:flex;align-items:center;gap:26px;padding:20px clamp(18px,4vw,54px);
  position:relative;z-index:3}
.bd{font:500 15px/1 var(--sans);letter-spacing:.14em}
.nl{display:flex;gap:23px;margin-left:8px}
.nl a{font:400 14px/1 var(--sans);opacity:.8}
.cta{margin-left:auto}
.btn{display:inline-block;padding:10px 18px;font:500 13.5px/1 var(--sans);border:1px solid currentColor}
.btn.solid{background:var(--bone);color:var(--ink);border-color:var(--bone)}
.lab{display:block;font:500 11px/1 var(--mono);letter-spacing:.17em;text-transform:uppercase;
  color:var(--amber)}
.plate{position:relative;background:#241109;overflow:hidden}
.plate img{display:block;width:100%;height:100%;object-fit:cover}
.miss{position:absolute;inset:0;display:grid;place-items:center;text-align:center;
  font:500 11px/1.7 var(--mono);letter-spacing:.12em;color:rgba(251,246,238,.5);
  background:repeating-linear-gradient(45deg,#2A1610 0 12px,#241109 12px 24px)}

/* the monolith hero — fixed across all five */
.hero{position:relative}
.hero .plate{height:clamp(420px,56vw,700px)}
.hero .scrim{position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(20,8,4,.58) 0%,rgba(20,8,4,.10) 40%,rgba(20,8,4,.88) 100%)}
.hero .over{position:absolute;inset:0;display:flex;flex-direction:column;
  padding-bottom:clamp(24px,4vw,48px)}
.hero .mark{margin-top:auto;font:200 clamp(2.2rem,8vw,7rem)/1 var(--sans);
  letter-spacing:.26em;text-indent:.26em;text-align:center}
.hero .line{margin-top:18px;text-align:center;font:400 clamp(1rem,1.7vw,1.32rem)/1.4 var(--ser);
  font-style:italic;color:rgba(251,246,238,.92)}
.rule{display:flex;gap:clamp(20px,3.4vw,40px);flex-wrap:wrap;border-top:1px solid var(--edge);
  padding-top:15px;margin-top:clamp(20px,3vw,36px)}
.rule div{font:500 10.5px/1.5 var(--mono);letter-spacing:.1em;color:rgba(251,246,238,.62);
  text-transform:uppercase}
.rule b{display:block;margin-bottom:5px;font:400 1.45rem/1 var(--sans);color:var(--bone);
  letter-spacing:-.02em;font-variant-numeric:tabular-nums}

/* sections */
.sec{padding:clamp(40px,6vw,86px) 0}
.sec.tint{background:var(--deep)}
.sec h2{margin:12px 0 0;font:400 clamp(1.8rem,3.6vw,3rem)/1.05 var(--ser);letter-spacing:-.022em}
.sec h2 em{font-style:italic;color:var(--amber)}
.sec .lede{margin-top:16px;max-width:60ch;color:rgba(251,246,238,.74);font-size:16px}

/* asked / found */
.af{display:grid;grid-template-columns:1fr;gap:1px;background:var(--edge);
  border:1px solid var(--edge);margin-top:clamp(22px,3vw,38px)}
@media(min-width:820px){.af{grid-template-columns:repeat(3,1fr)}}
.af>div{background:var(--void);padding:22px 24px 26px}
.af .k{font:500 10.5px/1 var(--mono);letter-spacing:.14em;color:var(--amber);text-transform:uppercase}
.af .v{margin-top:12px;font:400 clamp(1.05rem,1.6vw,1.25rem)/1.4 var(--sans);letter-spacing:-.014em}
.af .s{margin-top:10px;font-size:14px;color:rgba(251,246,238,.6);line-height:1.55}

/* brain */
.brain{position:relative;background:#0B0608;overflow:hidden}
.brain canvas{display:block;width:100%;height:100%}
.brain.full{height:clamp(430px,55vw,700px)}
.brain.band{height:clamp(310px,37vw,450px)}
.brain.inline{height:clamp(300px,34vw,420px);border:1px solid var(--edge)}
.brain .ovl{position:absolute;inset:0;display:flex;align-items:center;pointer-events:none}
.brain .ovl h2{max-width:17ch}

/* people frame + text */
.duo{display:grid;grid-template-columns:1fr;gap:clamp(22px,3.4vw,50px);align-items:center}
@media(min-width:900px){.duo{grid-template-columns:1.02fr .98fr}}
.duo.flip>div:first-child{order:2}
.duo .plate{height:clamp(280px,38vw,460px)}
.pull{font:400 clamp(1.3rem,2.5vw,2rem)/1.3 var(--ser);letter-spacing:-.018em;max-width:26ch}
.pull em{font-style:italic;color:var(--amber)}

/* findings */
.find{border-top:1px solid var(--edge);margin-top:clamp(22px,3vw,38px)}
.find .row{display:grid;grid-template-columns:auto 1fr;gap:18px;padding:20px 0;
  border-bottom:1px solid var(--edge);align-items:baseline}
@media(min-width:840px){.find .row{grid-template-columns:52px 1fr 1fr;gap:28px}}
.find .num{font:500 11px/1 var(--mono);color:var(--amber);letter-spacing:.12em}
.find .t{font:400 clamp(1.05rem,1.7vw,1.3rem)/1.3 var(--sans);letter-spacing:-.016em}
.find .d{font-size:14.5px;color:rgba(251,246,238,.62);line-height:1.6}

/* console */
.cons{border:1px solid var(--edge);background:#0E0704;margin-top:clamp(22px,3vw,36px)}
.cons .hd{padding:11px 18px;border-bottom:1px solid var(--edge);
  font:500 10.5px/1 var(--mono);letter-spacing:.12em;color:rgba(251,246,238,.6);text-transform:uppercase}
.cons .r{display:grid;grid-template-columns:1fr auto;gap:14px;padding:12px 18px;
  border-bottom:1px solid var(--edge);font-size:14.5px}
.cons .r:last-child{border-bottom:0}
.cons .r i{font-style:normal;font:500 11.5px/1.5 var(--mono);color:var(--amber)}

/* close */
.close{padding:clamp(40px,6vw,84px) 0;border-top:1px solid var(--edge);text-align:center}
.close h2{max-width:20ch;margin-left:auto;margin-right:auto}
.close .acts{display:flex;gap:22px;justify-content:center;margin-top:26px;flex-wrap:wrap}
"""


def plate(frame, cls=""):
    f = HERE.parent.parent / "public/studio/firm" / FRAMES[frame]
    inner = (f'<img src="{PHOTO}{FRAMES[frame]}" alt="">' if f.exists()
             else f'<div class=miss>{frame.upper()}<br>frame not generated yet</div>')
    return f'<div class="plate {cls}">{inner}</div>'


def bar():
    return ('<div class=bar><span class=bd>LOVELEEDAY</span>'
            '<div class=nl><a href="#">Platform</a><a href="#">Work</a><a href="#">Company</a></div>'
            '<div class=cta><a class="btn solid" href="#">Start a project</a></div></div>')


def hero(frame="atrium"):
    return f"""<div class=hero>{plate(frame)}<div class=scrim></div><div class=over>{bar()}
  <div class=mark>LOVELEEDAY</div>
  <div class=line>It answers the question you did not think to ask.</div>
  <div class=w><div class=rule>
    <div><b>{N['obj']}</b>objects resolved</div><div><b>{N['obs']}</b>observations</div>
    <div><b>{N['src']}</b>live sources</div><div><b>{N['nolin']}</b>without lineage</div>
  </div></div></div></div>"""


def brain(kind="full", overlay=""):
    """No caption. The canvas labels itself -- the ask across the top, the four
    decomposed questions at the corners, the answer and its evidence at the foot.
    A caption bar printed straight through that answer line, so three text runs
    collided in one strip and the caption was a worse restatement of the graphic."""
    o = f'<div class=ovl><div class=w>{overlay}</div></div>' if overlay else ""
    return f'<div class="brain {kind}"><canvas data-brain></canvas>{o}</div>'


ASKED = [("Asked", "Migrate the price lists into the new ERP.",
          "A migration. Scoped, quoted, delivered on time."),
         ("Found", "Hundreds of items had a floor beneath their own cost.",
          "Nobody had asked, because nothing in the system asks it."),
         ("Returned", "Every delta computed line by line, inside a working day.",
          "Written back as files the system accepts, generated not typed.")]

FINDINGS = [("01", "The floor was under the cost",
             "Across several price lists the minimum a salesperson could quote sat beneath what "
             "the item cost to buy."),
            ("02", f"{N['sites']} sites measured, {N['rbd']} rebuilt",
             "Nobody commissioned those either. The argument was easier to make in working HTML "
             "than in a deck."),
            ("03", "A figure with no lineage is not reportable",
             f"A write without a source system and a source reference is refused at the path. "
             f"{N['nolin']} values in the store carry none.")]


def af():
    return '<div class=af>' + "".join(
        f'<div><span class=k>{k}</span><div class=v>{v}</div><div class=s>{s}</div></div>'
        for k, v, s in ASKED) + '</div>'


def findings():
    return '<div class=find>' + "".join(
        f'<div class=row><span class=num>{n}</span><div class=t>{t}</div><div class=d>{d}</div></div>'
        for n, t, d in FINDINGS) + '</div>'


def console():
    rows = "".join(f'<div class=r><span>{k}</span><i>{v}</i></div>' for k, v in [
        ("billing_address &mdash; 1400 W Industrial Ave", "registry osm:way/887807677"),
        ("credit_terms &mdash; Net 30", "ledger contact:4XRH rev 12"),
        ("open_balance &mdash; $48,210.55", "payments inv_1Qd7&hellip;"),
        ("price_tier &mdash; T2 reinstated", "catalogue tier-roll 2026-09-21")])
    return f'<div class=cons><div class=hd>resolved object &middot; northwind materials</div>{rows}</div>'


def close():
    return f"""<div class=w><div class=close>
  <span class=lab>Bring us the question</span>
  <h2>See the question. <em>Build the answer.</em></h2>
  <div class=acts><a class="btn solid" href="#">Start a project</a>
  <a class=btn href="#">Read the architecture</a></div>
</div></div>"""


# ── the five orders of argument ───────────────────────────────────────────────

def a_descent():
    return f"""<div class=pg>{hero('atrium')}
<div class="sec"><div class=w><span class=lab>The question nobody asked</span>
  <h2>We were hired to move <em>the price lists.</em></h2>
  <p class=lede>The engagement was a migration. The finding was not.</p>
  {af()}</div></div>
{brain('full')}
<div class="sec tint"><div class=w><span class=lab>What it reads</span>
  <h2>A payment ledger, a satellite, <em>and the weather.</em></h2>
  <p class=lede>Three of the {N['src']} systems resolved into the store, answerable in the same
  sentence. What it can answer is bounded by what it can read, never by the department the
  question belongs to.</p>{console()}</div></div>
{close()}</div>"""


def b_ledger():
    return f"""<div class=pg>{hero('atrium')}
<div class="sec"><div class=w><span class=lab>Every value, with its receipt</span>
  <h2>Nothing here is <em>unaccounted for.</em></h2>{console()}</div></div>
<div class="sec tint"><div class=w><div class="duo">
  <div>{plate('people-desk')}</div>
  <div><span class=lab>The question nobody asked</span>
    <p class=pull style="margin-top:14px">&ldquo;A website request can reveal a customer
    acquisition problem. <em>A data question can reveal an entirely new way to work.</em>&rdquo;</p>
    <p class=lede>We were hired to move the price lists. Hundreds of items had a floor beneath
    their own cost.</p></div>
</div></div></div>
<div class="sec"><div class=w>{brain('inline')}</div></div>
{close()}</div>"""


def c_portrait():
    return f"""<div class=pg>{hero('atrium')}
<div class="sec"><div class=w><div class="duo flip">
  <div><span class=lab>The question nobody asked</span>
    <h2>We were hired to move <em>the price lists.</em></h2>
    <p class=lede>The engagement was a migration, delivered on time. The finding was that the
    floor had drifted under the cost on hundreds of items &mdash; quantified line by line and
    written back inside a working day.</p></div>
  <div>{plate('people-window')}</div>
</div></div></div>
{brain('band', '<h2>Ask it something. <em>Watch what it asks back.</em></h2>')}
<div class="sec tint"><div class=w><span class=lab>What we found that nobody asked for</span>
  {findings()}</div></div>
{close()}</div>"""


def d_cognition():
    return f"""<div class=pg>{hero('atrium')}
{brain('full', '<h2>It answers the question <em>you did not think to ask.</em></h2>')}
<div class="sec"><div class=w><span class=lab>Three times it did</span>
  <h2>Nobody commissioned <em>any of these.</em></h2>{findings()}</div></div>
<div class="sec tint"><div class=w><div class="duo">
  <div>{plate('people-hall')}</div>
  <div><span class=lab>How we work</span>
    <p class=pull style="margin-top:14px">We look beyond the requested deliverable. <em>What is
    slowing the business down?</em></p>
    <p class=lede>{N['obj']} objects, {N['obs']} observations, {N['src']} live sources. Every
    value dated twice and sourced once.</p></div>
</div></div></div>
{close()}</div>"""


def e_spread():
    return f"""<div class=pg>{hero('atrium')}
<div class="sec"><div class=w><div class="duo">
  <div>{plate('people-hall')}</div>
  <div><span class=lab>The question nobody asked</span>
    <h2>The answer you asked for, <em>and the one you did not.</em></h2>
    <p class=lede>The engagement was to migrate price lists. That was delivered. The finding was
    that hundreds of items carried a price floor beneath what the item cost to buy.</p></div>
</div>{af()}</div></div>
{brain('band')}
<div class="sec tint"><div class=w><span class=lab>Measured, not asserted</span>
  <h2>Every figure names <em>where it came from.</em></h2>{findings()}</div></div>
{close()}</div>"""


LAYOUTS = [
    ("A", "Descent", "hero &rarr; asked/found &rarr; brain full bleed &rarr; sources &rarr; close",
     "The argument in the order it actually happened: you hired us for one thing, here is the "
     "thing we found, here is the machine that found it, here is what it reads. The brain lands "
     "as the explanation of the finding rather than as decoration.", a_descent),
    ("B", "Ledger", "hero &rarr; evidence first &rarr; quote over a person &rarr; brain inline",
     "Proof before story. The console is the second thing on the page, so a sceptical reader hits "
     "the receipts before any claim. The brain is demoted to an inline panel &mdash; the least "
     "decorative use of it, and the most confident.", b_ledger),
    ("C", "Portrait", "hero &rarr; person beside the story &rarr; brain as the break &rarr; findings",
     "The most human of the five. A figure at the window carries the section where the story is "
     "told, and the brain becomes the band that separates story from evidence. Warmest, and the "
     "one that reads least like infrastructure.", c_portrait),
    ("D", "Cognition", "hero &rarr; brain immediately &rarr; three findings &rarr; people",
     "The brain is the second screen, full bleed, with the thesis set over it. Most striking "
     "opening and the biggest risk: a reader who does not already know what they are looking at "
     "sees an abstract graphic before a single fact.", d_cognition),
    ("E", "Spread", "hero &rarr; magazine split &rarr; brain band &rarr; numbered findings",
     "Editorial. People photograph left, the unasked question right, then the three-beat strip "
     "under it. The brain is a quiet band rather than an event. The steadiest of the five and the "
     "easiest to extend to five pages.", e_spread),
]


def build():
    cases = ""
    for k, name, order, why, fn in LAYOUTS:
        cases += (f'<section class=case><div class="w caseh"><span class=n>{k}</span>'
                  f'<h3>{name}</h3><div class=ord>{order}</div><p>{why}</p></div>'
                  f'<div class=fr>{fn()}</div></section>\n')
    missing = [k for k, v in FRAMES.items()
               if not (HERE.parent.parent / "public/studio/firm" / v).exists()]
    note = "" if not missing else (
        f'<p style="margin-top:13px;padding:11px 14px;border-left:3px solid var(--hot);'
        f'background:rgba(180,71,15,.14);max-width:84ch;font-size:14px">'
        f'<b>{len(missing)} of {len(FRAMES)} frames still rendering</b> ({", ".join(missing)}) '
        f'&mdash; marked placeholders rather than borrowed stock, so what you are judging is the '
        f'order of the argument.</p>')
    html = f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>Monolith &mdash; five layouts</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@200;300;400;500&display=swap" rel=stylesheet>
<style>{CSS}</style></head><body>
<div class=w><div class=top>
  <h1>Monolith, <em>five ways.</em></h1>
  <p>The hero is identical in all five &mdash; that is what makes it Monolith. What changes is the
  ORDER OF THE ARGUMENT, which is the real decision: when the brain appears, whether proof comes
  before story, and where the people sit. Every figure is read from the ontology at build time:
  {N['obj']} objects, {N['obs']} observations, {N['src']} live sources.</p>
  {note}
</div></div>
{cases}
<script>{BRAIN}</script>
<script>
// brain3d.js exposes Brain3D.mount(canvas, opts) and does NOT auto-bind [data-brain].
// Rendering the five layouts without this left five 300x150 unstyled canvases -- the
// default size, which is what an uninitialised canvas reports. The CSS made them the
// right size on screen while the drawing buffer stayed empty, so the page looked
// plausible and the brain was simply absent. Mount every canvas explicitly.
document.querySelectorAll('canvas[data-brain]').forEach(function (c, i) {{
  window.Brain3D.mount(c, {{ style: 'lobe', seed: 5 + i }});
}});
</script>
</body></html>"""
    (OUT / "index.html").write_text(html)
    print(f"wrote {OUT/'index.html'} ({len(html):,} bytes, {len(LAYOUTS)} layouts, "
          f"{len(FRAMES)-len(missing)}/{len(FRAMES)} frames)")


if __name__ == "__main__":
    build()
