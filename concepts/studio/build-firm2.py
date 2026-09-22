#!/usr/bin/env python3
"""Eight concepts, each one traceable to a named reference.

    python3 concepts/studio/build-firm2.py -> concepts/studio/firm2/index.html

Daniel: "you were supposed to give me new concepts to review with new photos and
layout like major brands you were to find examples from dribble and bring me
back more concepts."

The first five firm concepts were argued from two references held in my head
(Apple, Bloomberg) and were deliberately photography-free, which answered a
different question than the one asked. These are built the other way round:
reference first, named in the page next to the concept it produced, so the
argument for each layout is checkable rather than asserted.

Reference pulled 2026-09-21. Dribbble, architecture-firm search:
  · Parovina Arq / ELAEN  — full-bleed photograph, wordmark set INTO the image
  · Orix Creative         — numeric rail overlaid on a dark photograph
  · OnPoint Studio        — magazine split, hairline rule, caption-scale type
  · Rylic Studio          — dark page, asymmetric photo tiles, off-white serif
  · Orea Studio           — warm cream editorial, tall portrait, stat row
Mobbin, live enterprise sites:
  · Sana AI               — centered high-contrast serif, product cards under
  · Hex                   — oversized left display, body in a right column
  · Railway / Neon        — atmospheric full-bleed behind one restrained line

Every figure is read from the ontology by store.py, never typed -- the same rule
the rest of the site now follows. A concept that lies about the numbers cannot
be evaluated as a concept.
"""

from pathlib import Path

import store as _F

HERE = Path(__file__).parent
OUT = HERE / "firm2"
OUT.mkdir(exist_ok=True)
_D = _F.read_store()

# Photography lives here once generated. A concept that references a frame which
# is not on disk renders an honest empty plate rather than a broken image, and
# says so on the page -- see plate().
PHOTO = "../../../public/studio/firm/"
FRAMES = {
    "atrium":    "atrium.jpg",
    "colonnade": "colonnade.jpg",
    "facade":    "facade.jpg",
    "stair":     "stair.jpg",
    "threshold": "threshold.jpg",
}

N = {
    "obj":   f"{_D['objects']:,}",
    "obs":   f"{_D['props']:,}",
    "live":  f"{_D['live']:,}",
    "src":   str(_D['sources']),
    "nolin": str(_D['nolin']),
    "watch": str(_D['watches']),
    "fired": str(_D['fired']),
    "sites": _F.SITES_MEASURED,
    "rbd":   _F.REBUILDS,
}

CSS = """
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
:root{
  --ink:#241109;--deep:#1C0904;--bone:#FBF6EE;--paper:#FFFFFF;--mu:#63523F;
  --dim:#6F5B49;--line:#E4D9C9;--hot:#B4470F;--edge:rgba(251,246,238,.16);
  --sans:'Inter Tight',system-ui,-apple-system,sans-serif;
  --ser:'Instrument Serif',Georgia,serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,monospace}
body{margin:0;background:#141414;color:var(--bone);
  font:400 17px/1.6 var(--sans);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.w{width:min(1240px,100%);margin:0 auto;padding:0 clamp(18px,4vw,54px)}

/* ── review chrome (not part of any concept) ─────────────────────────────── */
.top{padding:46px 0 30px;border-bottom:1px solid rgba(251,246,238,.14)}
.top h1{margin:0;font:400 clamp(2rem,4vw,3.3rem)/1.02 var(--ser);letter-spacing:-.02em}
.top h1 em{font-style:italic;color:#E8A24A}
.top p{margin:14px 0 0;max-width:80ch;color:rgba(251,246,238,.7);font-size:15px}
.case{border-top:1px solid rgba(251,246,238,.14);padding-top:clamp(26px,4vw,46px);
  margin-top:clamp(30px,5vw,58px)}
.caseh .n{font:500 12px/1 var(--mono);color:#E8A24A;letter-spacing:.14em}
.caseh h3{margin:10px 0 0;font:300 clamp(1.4rem,2.5vw,2.05rem)/1.1 var(--sans);
  letter-spacing:-.03em}
.caseh .ref{margin-top:8px;font:500 11.5px/1.5 var(--mono);letter-spacing:.06em;
  color:#E8A24A;text-transform:uppercase}
.caseh p{margin-top:12px;max-width:78ch;color:rgba(251,246,238,.66);font-size:15px;
  line-height:1.62}
.fr{margin-top:clamp(20px,3vw,34px);overflow:hidden;border:1px solid rgba(251,246,238,.14)}

/* ── shared page furniture inside every concept ──────────────────────────── */
.bar{display:flex;align-items:center;gap:26px;padding:20px clamp(18px,4vw,54px)}
.bd{font:500 15px/1 var(--sans);letter-spacing:.14em}
.nl{display:flex;gap:24px;margin-left:8px}
.nl a{font:400 14px/1 var(--sans);opacity:.78}
.cta{margin-left:auto}
.btn{display:inline-block;padding:10px 18px;font:500 13.5px/1 var(--sans);
  border:1px solid currentColor}
.btn.solid{background:var(--bone);color:var(--ink);border-color:var(--bone)}
.lab{font:500 11px/1 var(--mono);letter-spacing:.17em;text-transform:uppercase}
.plate{position:relative;background:#241109;overflow:hidden}
.plate img{display:block;width:100%;height:100%;object-fit:cover}
.miss{position:absolute;inset:0;display:grid;place-items:center;text-align:center;
  font:500 11px/1.7 var(--mono);letter-spacing:.12em;color:rgba(251,246,238,.5);
  background:repeating-linear-gradient(45deg,#2A1610 0 12px,#241109 12px 24px)}
"""

CSS += """
/* 01 monolith — wordmark set INTO the photograph */
.c1{position:relative;background:#241109;color:var(--bone)}
.c1 .plate{height:clamp(420px,58vw,720px)}
.c1 .scrim{position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(20,8,4,.55) 0%,rgba(20,8,4,.12) 42%,rgba(20,8,4,.86) 100%)}
.c1 .over{position:absolute;inset:0;display:flex;flex-direction:column;
  justify-content:space-between;padding-bottom:clamp(26px,4vw,52px)}
.c1 .mark{font:400 clamp(2.4rem,8.2vw,7.4rem)/1 var(--sans);font-weight:200;
  letter-spacing:.26em;text-indent:.26em;text-align:center;margin-top:auto}
.c1 .line{margin-top:20px;font:400 clamp(1rem,1.7vw,1.35rem)/1.4 var(--ser);
  font-style:italic;text-align:center;color:rgba(251,246,238,.9)}
.c1 .foot{display:flex;gap:34px;flex-wrap:wrap;margin-top:clamp(22px,3vw,40px);
  border-top:1px solid var(--edge);padding-top:16px}
.c1 .foot div{font:500 11px/1.5 var(--mono);letter-spacing:.1em;color:rgba(251,246,238,.62)}
.c1 .foot b{display:block;font:400 1.5rem/1 var(--sans);color:var(--bone);margin-bottom:5px;
  letter-spacing:-.02em;font-variant-numeric:tabular-nums}

/* 02 rail — the figures live ON the photograph */
.c2{position:relative;background:#1C0904}
.c2 .plate{position:absolute;inset:0}
.c2 .bar{position:relative;z-index:2}
.c2 .scrim{position:absolute;inset:0;
  background:linear-gradient(90deg,rgba(20,8,4,.88) 0%,rgba(20,8,4,.46) 52%,rgba(20,8,4,.10) 100%)}
.c2 .grid{position:relative;display:grid;grid-template-columns:1fr;gap:34px;
  padding:clamp(40px,6vw,86px) 0 clamp(34px,5vw,68px)}
@media(min-width:900px){.c2 .grid{grid-template-columns:1.15fr .85fr;align-items:end}}
.c2 h1{margin:0;font:400 clamp(2rem,4.4vw,3.7rem)/1.04 var(--ser);letter-spacing:-.022em}
.c2 h1 em{font-style:italic;color:#E8A24A}
.c2 p{margin-top:16px;max-width:44ch;color:rgba(251,246,238,.76);font-size:15.5px}
.c2 .rail{border-top:1px solid var(--edge)}
.c2 .rr{display:flex;align-items:baseline;justify-content:space-between;gap:16px;
  padding:11px 0;border-bottom:1px solid var(--edge)}
.c2 .rr span{font:500 10.5px/1.3 var(--mono);letter-spacing:.13em;
  color:rgba(251,246,238,.62);text-transform:uppercase}
.c2 .rr b{font:400 1.32rem/1 var(--sans);letter-spacing:-.02em;font-variant-numeric:tabular-nums}

/* 03 spread — magazine split with a hairline rule */
.c3{background:var(--bone);color:var(--ink)}
.c3 .bar{border-bottom:1px solid var(--line)}
.c3 .bar .btn.solid{background:var(--ink);color:var(--bone);border-color:var(--ink)}
.c3 .sp{display:grid;grid-template-columns:1fr;gap:0;
  padding:clamp(34px,5vw,74px) 0 clamp(30px,4vw,60px)}
@media(min-width:960px){.c3 .sp{grid-template-columns:1fr 1px 1fr;gap:clamp(30px,4vw,58px)}}
.c3 .rule{background:var(--line)}
.c3 h1{margin:0;font:400 clamp(2.1rem,4.6vw,3.9rem)/1.02 var(--ser);letter-spacing:-.022em}
.c3 h1 em{font-style:italic;color:var(--hot)}
.c3 .cap{margin-top:18px;font:500 10.5px/1.7 var(--mono);letter-spacing:.12em;
  text-transform:uppercase;color:var(--mu)}
.c3 .body{margin-top:14px;color:var(--mu);font-size:15.5px;max-width:42ch}
.c3 .plate{height:clamp(300px,36vw,470px);background:var(--line)}
.c3 .cl{margin-top:10px;font:500 10.5px/1.5 var(--mono);letter-spacing:.1em;color:var(--mu)}

/* 04 tiles — dark page, broken photo grid */
.c4{background:#141014;color:var(--bone)}
.c4 h1{margin:0;font:400 clamp(2rem,4.2vw,3.5rem)/1.05 var(--ser);letter-spacing:-.022em;
  max-width:18ch}
.c4 h1 em{font-style:italic;color:#E8A24A}
.c4 .top2{padding:clamp(34px,5vw,70px) 0 clamp(22px,3vw,40px)}
.c4 .tg{display:grid;grid-template-columns:repeat(6,1fr);gap:12px 12px;
  align-items:start;padding-bottom:clamp(30px,4vw,60px)}
.c4 .tg > div{display:flex;flex-direction:column}
.c4 .t1{grid-column:span 6}
@media(min-width:860px){.c4 .t1{grid-column:span 4}.c4 .t2{grid-column:span 2}
  .c4 .t3{grid-column:span 2}.c4 .t4{grid-column:span 4}}
.c4 .plate{height:clamp(150px,19vw,260px)}
.c4 .t1 .plate{height:clamp(220px,27vw,380px)}
.c4 .cap{margin-top:8px;font:500 10px/1.5 var(--mono);letter-spacing:.11em;
  color:rgba(251,246,238,.56);text-transform:uppercase}

/* 05 statement — centered high-contrast serif, cards under */
.c5{background:var(--bone);color:var(--ink);text-align:center}
.c5 .bar{border-bottom:1px solid var(--line);text-align:left}
.c5 .bar .btn.solid{background:var(--ink);color:var(--bone);border-color:var(--ink)}
.c5 h1{margin:clamp(46px,7vw,104px) auto 0;max-width:15ch;
  font:400 clamp(2.4rem,5.6vw,5rem)/1 var(--ser);letter-spacing:-.028em}
.c5 h1 em{font-style:italic;color:var(--hot)}
.c5 .sub{margin:20px auto 0;max-width:52ch;color:var(--mu);font-size:16px}
.c5 .cards{display:grid;grid-template-columns:1fr;gap:14px;text-align:left;
  margin-top:clamp(34px,5vw,64px);padding-bottom:clamp(30px,4vw,60px)}
@media(min-width:840px){.c5 .cards{grid-template-columns:1fr 1fr}}
.c5 .cd{background:var(--ink);color:var(--bone);overflow:hidden}
.c5 .cd .plate{height:clamp(170px,21vw,280px)}
.c5 .cd .in{padding:20px 22px 24px}
.c5 .cd h4{margin:0;font:400 1.3rem/1.2 var(--sans);letter-spacing:-.02em}
.c5 .cd p{margin:8px 0 0;color:rgba(251,246,238,.7);font-size:14.5px}

/* 06 ledger — oversized left display, body right */
.c6{background:var(--bone);color:var(--ink)}
.c6 .bar{border-bottom:1px solid var(--line)}
.c6 .bar .btn.solid{background:var(--ink);color:var(--bone);border-color:var(--ink)}
.c6 .hz{display:grid;grid-template-columns:1fr;gap:26px;
  padding:clamp(38px,5vw,84px) 0 clamp(26px,3vw,44px)}
@media(min-width:960px){.c6 .hz{grid-template-columns:1.25fr .75fr;gap:clamp(34px,5vw,70px);
  align-items:end}}
.c6 h1{margin:0;font:200 clamp(2.6rem,6.6vw,5.8rem)/.98 var(--sans);letter-spacing:-.045em}
.c6 h1 em{font-family:var(--ser);font-style:italic;font-weight:400;color:var(--hot)}
.c6 .body{color:var(--mu);font-size:16px;max-width:40ch}
.c6 .plate{height:clamp(240px,30vw,400px);background:var(--line)}
.c6 .strip{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--line);
  border-top:1px solid var(--line);border-bottom:1px solid var(--line);
  margin-bottom:clamp(30px,4vw,58px)}
@media(min-width:760px){.c6 .strip{grid-template-columns:repeat(4,1fr)}}
.c6 .st{background:var(--bone);padding:18px 20px}
.c6 .st b{display:block;font:300 clamp(1.6rem,2.7vw,2.3rem)/1 var(--sans);
  letter-spacing:-.04em;font-variant-numeric:tabular-nums}
.c6 .st span{display:block;margin-top:7px;font:500 10px/1.4 var(--mono);
  letter-spacing:.11em;color:var(--mu);text-transform:uppercase}

/* 07 portrait — warm editorial, tall frame, stat row */
.c7{background:#F3EDE3;color:var(--ink)}
.c7 .bar{border-bottom:1px solid var(--line)}
.c7 .bar .btn.solid{background:var(--ink);color:var(--bone);border-color:var(--ink)}
.c7 .ed{display:grid;grid-template-columns:1fr;gap:28px;
  padding:clamp(34px,5vw,70px) 0 clamp(28px,4vw,54px)}
@media(min-width:900px){.c7 .ed{grid-template-columns:.86fr 1.14fr;gap:clamp(30px,4vw,62px);
  align-items:center}}
.c7 .plate{height:clamp(320px,46vw,560px)}
.c7 h1{margin:0;font:400 clamp(2.1rem,4.4vw,3.6rem)/1.03 var(--ser);letter-spacing:-.022em}
.c7 h1 em{font-style:italic;color:var(--hot)}
.c7 p{margin-top:16px;color:var(--mu);font-size:16px;max-width:44ch}
.c7 .sr{display:flex;gap:clamp(24px,4vw,56px);flex-wrap:wrap;margin-top:28px;
  border-top:1px solid var(--line);padding-top:18px}
.c7 .sr div b{display:block;font:300 clamp(1.7rem,3vw,2.5rem)/1 var(--sans);
  letter-spacing:-.04em;font-variant-numeric:tabular-nums}
.c7 .sr div span{display:block;margin-top:6px;font:500 10px/1.4 var(--mono);
  letter-spacing:.11em;color:var(--mu);text-transform:uppercase}

/* 08 quiet — atmospheric full bleed, one line, panel under */
.c8{position:relative;background:#140804;color:var(--bone)}
.c8 .plate{height:clamp(400px,54vw,680px)}
.c8 .scrim{position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(20,8,4,.66) 0%,rgba(20,8,4,.22) 40%,rgba(20,8,4,.92) 100%)}
.c8 .over{position:absolute;inset:0;display:flex;flex-direction:column;
  justify-content:center}
.c8 .over .bar{position:absolute;top:0;left:0;right:0}
.c8 h1{margin:0;max-width:17ch;font:400 clamp(2.2rem,5vw,4.3rem)/1.04 var(--ser);
  letter-spacing:-.024em}
.c8 h1 em{font-style:italic;color:#E8A24A}
.c8 .sub{margin-top:18px;max-width:46ch;color:rgba(251,246,238,.82);font-size:16px}
.c8 .panel{position:relative;margin:-64px auto clamp(34px,5vw,64px);
  width:min(1090px,calc(100% - 2*clamp(18px,4vw,54px)));background:#0E0704;
  border:1px solid var(--edge)}
.c8 .ph{display:flex;align-items:center;gap:14px;padding:12px 18px;
  border-bottom:1px solid var(--edge);font:500 10.5px/1 var(--mono);letter-spacing:.12em;
  color:rgba(251,246,238,.6);text-transform:uppercase}
.c8 .pr{display:grid;grid-template-columns:1fr auto;gap:14px;padding:13px 18px;
  border-bottom:1px solid var(--edge);font-size:14.5px}
.c8 .pr:last-child{border-bottom:0}
.c8 .pr i{font-style:normal;font:500 11.5px/1.5 var(--mono);color:#E8A24A;letter-spacing:.04em}
"""


def plate(frame, extra=""):
    """A photograph, or an honest empty plate that names what is missing.

    A concept shown with a stock frame it will never ship with is a concept
    reviewed on the wrong evidence, and a broken image icon is worse. When the
    frame is not on disk the plate says which one it is waiting for."""
    f = OUT.parent.parent.parent / "public/studio/firm" / FRAMES[frame]
    if f.exists():
        return (f'<div class="plate" {extra}>'
                f'<img src="{PHOTO}{FRAMES[frame]}" alt=""></div>')
    return (f'<div class="plate" {extra}><div class=miss>'
            f'{frame.upper()}<br>frame not generated yet</div></div>')


def bar(dark=True):
    return ('<div class=bar><span class=bd>LOVELEEDAY</span>'
            '<div class=nl><a href="#">Platform</a><a href="#">Work</a>'
            '<a href="#">Company</a></div>'
            '<div class=cta><a class="btn solid" href="#">Start a project</a></div></div>')


def c1():
    return f"""<div class=c1>{plate('atrium')}<div class=scrim></div>
  <div class=over>{bar()}
    <div class=mark>LOVELEEDAY</div>
    <div class=line>Intelligence you can trace.</div>
    <div class=w><div class=foot>
      <div><b>{N['obj']}</b>objects resolved</div>
      <div><b>{N['obs']}</b>observations</div>
      <div><b>{N['src']}</b>live sources</div>
      <div><b>{N['nolin']}</b>without lineage</div>
    </div></div>
  </div></div>"""


def c2():
    rows = "".join(
        f'<div class=rr><span>{l}</span><b>{v}</b></div>' for l, v in [
            ("Objects resolved", N['obj']), ("Observations", N['obs']),
            ("In force", N['live']), ("Live sources", N['src']),
            ("Without lineage", N['nolin']), ("Standing conditions", N['watch']),
            ("Conditions fired", N['fired']), ("Sites measured", N['sites'])])
    return f"""<div class=c2>{plate('colonnade')}<div class=scrim></div>
  {bar()}
  <div class=w><div class=grid>
    <div><h1>Every value carries <em>where it came from.</em></h1>
      <p>Records scattered across a payment ledger, a mailbox, a satellite and the
      weather resolve onto single objects &mdash; each with the date it was true, the
      date we learned it, and a trail back to the system it came from.</p></div>
    <div class=rail>{rows}</div>
  </div></div></div>"""


def c3():
    return f"""<div class=c3>{bar()}
  <div class=w><div class=sp>
    <div><span class="lab" style="color:var(--hot)">The practice</span>
      <h1 style="margin-top:14px">Business judgment,<br><em>built as software.</em></h1>
      <div class=cap>Est. Kalamazoo &middot; {N['src']} systems connected &middot; {N['rbd']} rebuilds</div>
      <p class=body>We start at the business problem, not the ticket. The engagement
      is scoped in writing, quoted flat, and every figure we hand back names the
      system it came from.</p></div>
    <div class=rule></div>
    <div>{plate('facade')}<div class=cl>Fig. 01 &mdash; the object layer, at rest</div></div>
  </div></div></div>"""


def c4():
    return f"""<div class=c4>{bar()}
  <div class=w><div class=top2>
    <h1>Four records, one customer, <em>every figure traced.</em></h1></div>
    <div class=tg>
      <div class=t1>{plate('atrium')}<div class=cap>01 &mdash; the hall</div></div>
      <div class=t2>{plate('stair')}<div class=cap>02 &mdash; ascent</div></div>
      <div class=t3>{plate('threshold')}<div class=cap>03 &mdash; threshold</div></div>
      <div class=t4>{plate('colonnade')}<div class=cap>04 &mdash; the arcade</div></div>
    </div></div></div>"""


def c5():
    return f"""<div class=c5>{bar()}
  <h1>Intelligence <em>that knows what you need.</em></h1>
  <p class=sub>Point it at what you already keep. It answers the question you asked,
  and then the one you did not.</p>
  <div class=w><div class=cards>
    <div class=cd>{plate('facade')}<div class=in><h4>The object layer</h4>
      <p>{N['obj']} objects, {N['obs']} observations, {N['src']} live sources. Every value
      dated twice and sourced once.</p></div></div>
    <div class=cd>{plate('threshold')}<div class=in><h4>The studio</h4>
      <p>{N['sites']} sites measured, {N['rbd']} rebuilt. Nobody commissioned those either.</p></div></div>
  </div></div></div>"""


def c6():
    strip = "".join(
        f'<div class=st><b>{v}</b><span>{l}</span></div>' for v, l in [
            (N['obj'], "objects resolved"), (N['obs'], "observations"),
            (N['src'], "live sources"), (N['nolin'], "without lineage")])
    return f"""<div class=c6>{bar()}
  <div class=w><div class=hz>
    <h1>Nothing here is <em>unaccounted for.</em></h1>
    <div><div class=body>A write without a source system and a source reference is
    refused at the path &mdash; not flagged, not defaulted, refused.</div></div>
  </div></div>
  <div class=w>{plate('stair')}</div>
  <div class=w><div class=strip style="margin-top:clamp(22px,3vw,40px)">{strip}</div></div></div>"""


def c7():
    return f"""<div class=c7>{bar()}
  <div class=w><div class=ed>
    <div>{plate('threshold')}</div>
    <div><span class="lab" style="color:var(--hot)">Why this exists</span>
      <h1 style="margin-top:14px">People love what <em>they understand.</em></h1>
      <p>Most of what someone runs is partly hidden from them, and the hidden part is
      where the dread lives. When the thing in front of you stops hiding things from
      you, it becomes possible to love it again &mdash; the work, the numbers, the day.</p>
      <div class=sr>
        <div><b>{N['obs']}</b><span>observations</span></div>
        <div><b>{N['src']}</b><span>live sources</span></div>
        <div><b>{N['nolin']}</b><span>unsourced</span></div>
      </div></div>
  </div></div></div>"""


def c8():
    rows = "".join(
        f'<div class=pr><span>{k}</span><i>{v}</i></div>' for k, v in [
            ("billing_address", "registry osm:way/887807677"),
            ("credit_terms &mdash; Net 30", "ledger contact:4XRH rev 12"),
            ("open_balance &mdash; $48,210.55", "payments inv_1Qd7&hellip;"),
            ("price_tier &mdash; T2 reinstated", "catalogue tier-roll 2026-09-21")])
    return f"""<div class=c8>{plate('stair')}<div class=scrim></div>
  <div class=over>{bar()}<div class=w>
    <h1>It answers the question <em>you did not think to ask.</em></h1>
    <p class=sub>Give it a question and it decomposes into the questions it has to
    answer first &mdash; then resolves them, with the evidence attached.</p>
  </div></div>
  </div>
  <div class=panel><div class=ph>resolved object &middot; northwind materials</div>{rows}</div>"""


CONCEPTS = [
    ("01", "Monolith", "DRIBBBLE &middot; Parovina Arq, ELA&Eacute;N",
     "The wordmark set INTO the photograph at enormous letterspacing, the building "
     "carrying the whole frame, and the proof reduced to four figures on a rule at the "
     "foot. This is what an architecture practice does and almost no software company "
     "does: it spends the entire hero on one image and trusts it.", c1),
    ("02", "Rail", "DRIBBBLE &middot; Orix Creative &nbsp;+&nbsp; MOBBIN &middot; Hex",
     "Orix overlays a numeric rail on a dark photograph rather than putting numbers in "
     "a card grid. That is the Bloomberg instinct with a photograph underneath it, and "
     "it is the only layout here where the picture and the evidence occupy the same "
     "space instead of taking turns.", c2),
    ("03", "Spread", "DRIBBBLE &middot; OnPoint Studio",
     "A magazine spread: statement left, hairline rule, plate right, with a mono "
     "caption doing the work a subheading usually does badly. The most restrained of "
     "the eight and the one that reads oldest &mdash; in the sense he asked for.", c3),
    ("04", "Tiles", "DRIBBBLE &middot; Rylic Studio",
     "Dark page, off-white serif, and an asymmetric plate grid that refuses to be four "
     "equal cards. Shows the most photography of any concept, so it lives or dies on "
     "the frames being good.", c4),
    ("05", "Statement", "MOBBIN &middot; Sana AI",
     "Sana centers one high-contrast serif line and puts two large product cards "
     "underneath &mdash; no hero image at all above the fold. The most confident opening "
     "and the easiest to get wrong, because the line has to carry it alone.", c5),
    ("06", "Ledger", "MOBBIN &middot; Hex &nbsp;+&nbsp; DRIBBBLE &middot; Or&eacute;a Studio",
     "Oversized light display type on the left, body text in a narrow right column, "
     "then the plate full width and the figures as a rule beneath it. The layout that "
     "handles long headlines best.", c6),
    ("07", "Portrait", "DRIBBBLE &middot; Or&eacute;a Studio",
     "Warm cream, a tall portrait plate, and a stat row under the paragraph. The only "
     "concept here that leads with the mission rather than the mechanism, and the "
     "warmest of the eight.", c7),
    ("08", "Quiet", "MOBBIN &middot; Railway, Neon",
     "Atmospheric full bleed, one restrained line, and the evidence panel floating up "
     "over the fold below it. Railway and Neon both do this; it is the closest thing "
     "to a consensus among the live sites, which is both its strength and its risk.", c8),
]


def build():
    cases = ""
    for n, name, ref, why, fn in CONCEPTS:
        cases += (f'<section class=case><div class="w caseh"><span class=n>{n}</span>'
                  f'<h3>{name}</h3><div class=ref>{ref}</div><p>{why}</p></div>'
                  f'<div class=fr>{fn()}</div></section>\n')
    missing = [k for k, v in FRAMES.items()
               if not (OUT.parent.parent.parent / "public/studio/firm" / v).exists()]
    note = ("" if not missing else
            f'<p style="margin-top:14px;padding:11px 14px;border-left:3px solid var(--hot);'
            f'background:rgba(180,71,15,.14);max-width:84ch;font-size:14px">'
            f'<b>{len(missing)} of {len(FRAMES)} frames not generated yet</b> '
            f'({", ".join(missing)}) &mdash; those plates render as marked placeholders '
            f'rather than borrowed stock, so what you are judging is the layout.</p>')
    html = f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>Eight concepts &mdash; referenced</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@200;300;400;500&display=swap" rel=stylesheet>
<style>{CSS}</style></head><body>
<div class=w><div class=top>
  <h1>Eight concepts, <em>each one traceable.</em></h1>
  <p>Every layout below is taken from a named reference &mdash; five from Dribbble's
  architecture-firm work, three from live enterprise sites on Mobbin &mdash; and the
  reference is printed next to the concept so the argument for it can be checked
  rather than taken on trust. Type and colour are the site's real tokens, and every
  figure is read from the ontology at build time: {N['obj']} objects, {N['obs']}
  observations, {N['src']} live sources.</p>
  {note}
</div></div>
{cases}
</body></html>"""
    (OUT / "index.html").write_text(html)
    print(f"wrote {OUT/'index.html'}  ({len(html):,} bytes, {len(CONCEPTS)} concepts, "
          f"{len(FRAMES)-len(missing)}/{len(FRAMES)} frames present)")


if __name__ == "__main__":
    build()
