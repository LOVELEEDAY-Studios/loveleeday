#!/usr/bin/env python3
"""Five landing-page concepts, each updating the page in a different way.

    python3 concepts/studio/build-concepts.py -> concepts/studio/concepts/*.html

Daniel, 2026-09-21, four instructions in one message:
  1. the hero background constantly updates -- photographs moving and changing
  2. the navigation bar is a dropdown menu
  3. other parts of the page take after Bloomberg's technology register
  4. the ARTHUR//OS dashboard comes OFF the page: "that is internal to us not
     customer focused". In its place, a brain that pings with thought, neurons
     flashing, showing what happens when you hand Arthur a question -- and the
     questions it generates back.

(4) is brain.js and it is the centrepiece of all five.

PROVENANCE, because it differs per reference and that matters. Palantir and
Apple were MEASURED from their live pages on 2026-09-21 (80px/weight-400
headlines against 10px labels, one idea per tile, six to fourteen words).
Bloomberg could not be: the site returns a bot wall to a scripted browser, and
the stealth browser is failing on a malformed session id. So the Bloomberg
register here is drawn from the Terminal's well-established conventions --
black ground, amber key colour, monospace numerals, four-letter function codes,
panel grids, red/green deltas, a running ticker -- and NOT from a measurement I
took. Treat it as the weaker-sourced of the three.

The five differ in what they do with all that, not in their paint:
  TERMINAL  Bloomberg at full strength. Amber on black, ticker, function
            codes, dense panels. Photography confined to one thin rail.
  DISPATCH  Photography leads full-bleed and cycling; the data rail sits on
            top of it; the brain gets its own black band.
  SPLIT     The fold is divided -- photograph one side, live brain the other.
  EXCHANGE  Bloomberg in daylight: white ground, amber accents, dense tables.
  SIGNAL    A mosaic of photographs that re-tiles itself, brain as the single
            centrepiece, almost no other furniture.
"""
import json, re
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / "concepts"
OUT.mkdir(exist_ok=True)
LIVE = json.loads((HERE / "live-content.json").read_text())
CH = LIVE["chrome"]
STUDIES = [dict(s, frame=f) for s, f in zip(LIVE["studies"], LIVE["study_frames"])]
BRAIN_JS = (HERE / "brain3d.js").read_text()

# PHOTOGRAPHY, after the art-direction review. Of fifteen images in the library
# exactly one survived: own-itlead (two people, server room, blue light, a
# tablet showing a trail) -- infrastructure and human judgment in one frame.
#
# Cut, and why:
#   hero/atrium-a,b,c + desk-a,b + ops-a  384x216 thumbnails being stretched
#     across a 1440px hero, a 3.75x upscale. This IS "the images are not clear".
#   desert-rust, dunes-aerial, ridge-blaze, ridge-haze, own-solar
#     Landscape at golden hour is the visual grammar of travel and outdoor
#     brands. A dune has no lineage; sand does not resolve to an object id.
#     The site's whole claim is that nothing is unaccounted for, and the
#     photograph said "vast and unowned". Four of them were the same idea.
#   room-golden, pair-sunset  backlit silhouettes with the faces erased --
#     could advertise insurance or a dating app.
#   bench-lamp, own-bench  warm light and white coats read biotech, not this.
#
# And the cycling hero is GONE as a device. Apple's product heroes are static,
# Palantir's are typography over one restrained frame, Bloomberg's homepage is
# data. A rotating hero says "we have several images and none is the right
# one", which was true and is the honest reading of Daniel's "not sure I am
# sold on the photos".
HERO_PHOTO = "solstice/own-itlead.jpg"
# The mosaic is filled with REAL WORK instead: twelve full-resolution captures
# of sites this studio rebuilt. A wall of what we shipped argues for us; a wall
# of stock landscapes argued for nobody.
WALL = ["novarna-after", "janta-after", "fyxit-after", "soarce-after",
        "micruity-after", "loanwell-after", "novarna-before", "janta-before",
        "fyxit-before", "soarce-before", "micruity-before", "loanwell-before"]
P = "../../../public/studio/"
PW = "../../../public/portal/collab/"

GLYPH = {"Arthur": "\u25C9", "The ontology": "\u25E7", "Lineage": "\u2941",
         "Verified execution": "\u2713", "Client rebuilds": "\u25F1",
         "Companies we operate": "\u25A3", "How we measure": "\u2261",
         "About": "\u25CB", "How we scope": "\u25B3", "Contact": "\u2192"}

MENUS = {
    "Platform": [("Arthur", "The intelligence system", "#"),
                 ("The ontology", "How records become objects", "#"),
                 ("Lineage", "Every value carries its source", "#"),
                 ("Verified execution", "Work closes on observed proof", "#")],
    "Work": [("Client rebuilds", "Six, uncommissioned", "#"),
             ("Companies we operate", "Five we own and run", "#"),
             ("How we measure", "Weight, Lighthouse, position", "#")],
    "Company": [("About", "Business judgment, built as software", "#"),
                ("How we scope", "Fixed quote, written scope", "#"),
                ("Contact", "A reply from a person", "#")],
}

# ONE vocabulary for all five. The review's component table was the strongest
# evidence for Daniel's "a lot of issues": five concepts carried five eyebrow
# grammars, three different stat taxonomies (OBJECTS/OBSERVATIONS vs OBJ/OBS/
# SRC/UNV vs OBJ/TIME/LIN/PRF, the last with figures that appear nowhere else),
# and the brain section headline was silently truncated on one of them. They
# were not five treatments of one system; they were five systems. Only the
# hero treatment is allowed to vary now.
EYEBROW_HERO = "LOVELEEDAY STUDIOS"
EYEBROW_BRAIN = "Arthur &middot; cognition"
BRAIN_H2 = "Ask it something.<br>Watch what it asks back."
STATS = [("OBJ", "41", "Objects resolved",
          "Records from four systems collapsed onto single objects."),
         ("OBS", "538", "Property observations",
          "Each carrying its source system and source reference."),
         ("SRC", "4", "Live source systems",
          "Coverage is exactly as wide as what is connected."),
         ("UNV", "0", "Unverified values",
          "A write without lineage is refused at the path.")]

TICKER = [("OBJECTS", "41", "+3"), ("OBSERVATIONS", "538", "+52"), ("SOURCES", "4", ""),
          ("LINEAGE COVER", "100%", ""), ("SITES MEASURED", "38", ""),
          ("REBUILDS", "6", "+1"), ("UNVERIFIED", "0", ""),
          ("OLDEST OBSERVATION", "2026-09-13", ""), ("LAST WRITE", "2026-09-21", ""),
          ("REFUSED WRITES", "0", ""), ("SOURCE SYSTEMS", "weather.gov \u00b7 stripe "
           "\u00b7 sentinel-2 \u00b7 nominatim", "")]

FONTS = ("https://fonts.googleapis.com/css2?"
         "family=Inter+Tight:wght@300;400;500;600&display=swap")

BASE = """
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;font:400 16px/1.6 var(--sans);-webkit-font-smoothing:antialiased;
  background:var(--bg);color:var(--fg)}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
.w{max-width:1440px;margin:0 auto;padding:0 clamp(16px,2.6vw,40px)}
h1,h2,h3{margin:0;font-weight:400;letter-spacing:-.032em;line-height:1.04}
h1{font-size:clamp(2.3rem,6.2vw,5.2rem);text-wrap:balance}
h2{font-size:clamp(1.7rem,3.6vw,3rem);text-wrap:balance}
h3{font-size:clamp(1.1rem,1.7vw,1.5rem)}
p{margin:0}
.lab{display:block;font:400 10.5px/1 var(--mono);letter-spacing:.17em;
  text-transform:uppercase;color:var(--key)}
.mu{color:var(--mu)}
.sec{padding:clamp(48px,6.5vw,104px) 0}
.lede{margin-top:16px;max-width:60ch;color:var(--mu);font-size:clamp(14.5px,1.35vw,17px)}

/* ---------- ticker (Bloomberg) ---------- */
/* The ticker shared a background plane with the nav, so two distinct regions
   fused into one dense strip. Bloomberg always boxes a dense region. */
.tick{border-bottom:1px solid var(--edge);background:var(--tickbg);overflow:hidden;height:30px}
.tickrow{display:flex;gap:34px;padding:8px 0;white-space:nowrap;
  animation:sl 42s linear infinite;width:max-content}
@keyframes sl{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.tk{font:400 11.5px/1 var(--mono);letter-spacing:.06em;color:var(--mu)}
.tk b{color:var(--fg);font-weight:400;margin-left:8px}
.tick{-webkit-mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)}
.tk i{font-style:normal;margin-left:6px;color:var(--up)}
@media(prefers-reduced-motion:reduce){.tickrow{animation:none}}

/* ---------- navigation ----------
   Rebuilt after review. The panel was full-bleed at #0D0D11 against a #08080A
   page -- a five-value delta on 0-255, so nothing read as "a menu opened", it
   read as "the page changed". Worse, its bottom edge landed inside the hero's
   line-height and sliced the word "Intelligence" in half, which reads as a
   broken site before it reads as anything else.

   Now: an inset card with a real fill lift, a border doing the contrast work
   the colour cannot, and a shadow. A contained card also structurally CANNOT
   collide with the hero the way a full-bleed slab did. */
nav.bar{position:sticky;top:0;z-index:70;background:var(--navbg);
  border-bottom:1px solid var(--edge);backdrop-filter:saturate(150%) blur(12px)}
nav.bar > .w{display:flex;align-items:center;gap:clamp(10px,1.8vw,22px);height:64px}
.bd{font:600 14px/1 var(--sans);letter-spacing:.055em;white-space:nowrap;
  text-transform:uppercase}
.tabs{display:none;gap:4px;margin-left:18px}
@media(min-width:960px){.tabs{display:flex}}
.tab{font:400 14px/1 var(--sans);color:var(--tabfg);background:none;border:0;
  padding:9px 12px;cursor:pointer;display:flex;align-items:center;gap:6px;
  border-radius:6px;transition:background .15s ease,color .15s ease}
.tab i{font-style:normal;font-size:11px;line-height:1;opacity:.85;
  transition:transform .15s ease}
.tab:hover{background:var(--hov);color:var(--fg)}
.tab[aria-expanded="true"]{background:var(--hovOn);color:var(--fg)}
.tab[aria-expanded="true"] i{transform:rotate(180deg)}
.rt{margin-left:auto;display:none;align-items:center;gap:12px}
@media(min-width:960px){.rt{display:flex}}
.btn{display:inline-block;font:500 14px/1 var(--sans);padding:10px 18px;
  border:1px solid var(--btnedge);border-radius:6px;white-space:nowrap}
.btn.solid{background:var(--key);border-color:var(--key);color:var(--keyfg);font-weight:600}

.panel{display:none;position:absolute;left:clamp(14px,2.6vw,32px);
  right:clamp(14px,2.6vw,32px);top:calc(100% + 8px);
  max-width:1120px;margin:0 auto;background:var(--panelUp);
  border:1px solid var(--panelEdge);border-radius:12px;
  box-shadow:0 24px 48px -12px rgba(0,0,0,.62),0 0 0 1px rgba(0,0,0,.3);
  overflow:hidden}
nav.bar[data-open="Platform"] .panel[data-p="Platform"],
nav.bar[data-open="Work"] .panel[data-p="Work"],
nav.bar[data-open="Company"] .panel[data-p="Company"]{display:block}
.pin{padding:26px 26px 0}
.pgrid{display:grid;gap:4px 18px;margin-top:16px}
@media(min-width:760px){.pgrid{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}}
.mi{display:block;padding:12px;margin:-2px;border-radius:8px;
  transition:background .15s ease}
.mi:hover,.mi:focus-visible{background:var(--miHov)}
.mi .ic{display:block;width:20px;height:20px;margin-bottom:11px;color:var(--key);
  font:400 15px/20px var(--mono)}
.mi b{display:block;font:600 15px/1.3 var(--sans);letter-spacing:-.01em;
  color:var(--fg);transition:color .15s ease}
.mi:hover b{color:var(--key)}
.mi span{display:block;margin-top:4px;font-size:13px;line-height:1.5;color:var(--mu)}
.pfoot{margin-top:18px;padding:15px 26px;border-top:1px solid var(--panelEdge);
  font:400 13px/1 var(--sans);color:var(--mu);display:flex;
  justify-content:space-between;gap:14px;flex-wrap:wrap}
.pfoot a{color:var(--key)}
.burger{display:flex;margin-left:auto;width:40px;height:40px;padding:0;cursor:pointer;
  background:none;color:inherit;border:1px solid var(--btnedge);border-radius:6px;
  flex-direction:column;align-items:center;justify-content:center;gap:5px}
@media(min-width:960px){.burger{display:none}}
.burger span{display:block;width:15px;height:1.5px;background:currentColor}
.sheet{display:none;border-top:1px solid var(--edge);background:var(--panelUp);
  max-height:76vh;overflow-y:auto}
nav.bar[data-sheet="1"] .sheet{display:block}
.sg{padding:14px 0;border-bottom:1px solid var(--edge)}
.sg .lab{margin-bottom:8px}

/* ---------- cycling photo hero ---------- */
.stage{position:absolute;inset:0;overflow:hidden;background:#000}
/* The library was three different shoots pretending to be one family. The
   grade is what makes the survivor sit with the rest of the site: desaturated,
   cooled, blacks held down, contrast kept. */
.stage img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  filter:saturate(.62) contrast(1.12) brightness(.9)}
.grade{position:absolute;inset:0}

/* ---------- brain ---------- */
.brainbox{position:relative;width:100%;height:clamp(360px,48vw,600px)}
.brainbox canvas{width:100%;height:100%;display:block}
.legend{display:flex;flex-wrap:wrap;align-items:center;gap:10px 22px;
  padding:14px 0 4px;justify-content:center}
.lg{display:inline-flex;align-items:center;gap:7px;font:400 11px/1 var(--mono);
  letter-spacing:.13em;text-transform:uppercase;color:var(--mu)}
.lg i{width:8px;height:8px;border-radius:50%;display:block}
.lgsrc{flex-basis:100%;text-align:center;font:400 10.5px/1.6 var(--mono);
  letter-spacing:.06em;color:var(--dim)}

/* ---------- bloomberg panels ---------- */
.panels{display:grid;gap:1px;background:var(--edge);border:1px solid var(--edge);margin-top:26px}
@media(min-width:720px){.panels{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1080px){.panels{grid-template-columns:repeat(4,1fr)}}
.pnl{background:var(--panel);padding:18px}
.pnl .code{font:400 10.5px/1 var(--mono);letter-spacing:.14em;color:var(--key)}
.pnl b{display:block;margin-top:12px;font:300 clamp(1.8rem,3vw,2.6rem)/1 var(--sans);
  letter-spacing:-.04em;font-variant-numeric:tabular-nums}
.pnl span{display:block;margin-top:8px;font:400 11px/1.5 var(--mono);
  letter-spacing:.06em;text-transform:uppercase;color:var(--mu)}
.pnl p{margin-top:9px;font-size:13px;line-height:1.55;color:var(--mu)}
.rows{border-top:1px solid var(--edge);margin-top:24px}
.row{display:grid;gap:4px 20px;padding:15px 0;border-bottom:1px solid var(--edge);
  align-items:baseline}
@media(min-width:860px){.row{grid-template-columns:52px 190px minmax(0,1fr) 120px}}
.row .c{font:400 11.5px/1.6 var(--mono);color:var(--key)}
.row b{font:400 17px/1.3 var(--sans);letter-spacing:-.02em}
.row p{font-size:14px;line-height:1.55;color:var(--mu)}
.row .n{font:400 11.5px/1.6 var(--mono);color:var(--mu);text-align:right}

/* ---------- work cards ---------- */
.grid{display:grid;gap:12px;margin-top:24px}
@media(min-width:680px){.grid{grid-template-columns:1fr 1fr}}
@media(min-width:1080px){.grid{grid-template-columns:repeat(3,1fr)}}
.card{border:1px solid var(--edge);background:var(--panel);overflow:hidden;
  display:flex;flex-direction:column}
.card .sh{aspect-ratio:16/10;overflow:hidden;background:#1a1a1a}
.card .sh img{width:100%;height:100%;object-fit:cover;object-position:top center}
.card .cb{padding:15px 16px 18px}
.card p{margin-top:8px;font-size:13.5px;line-height:1.55;color:var(--mu)}
footer{border-top:1px solid var(--edge);padding:44px 0 38px;color:var(--mu);font-size:13px}
.fg{display:grid;gap:26px}
@media(min-width:760px){.fg{grid-template-columns:1.4fr 1fr 1fr 1fr}}
.fg a{display:block;padding:4px 0;color:var(--mu)}
.fbase{margin-top:36px;padding-top:18px;border-top:1px solid var(--edge);
  display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;
  font:400 11.5px/1.6 var(--mono)}
"""

NAV_JS = """<script>
(function(){
  var bar=document.querySelector('nav.bar'); if(!bar) return;
  var timer=null, openT=null;
  function open(n){ clearTimeout(timer); clearTimeout(openT); bar.dataset.open=n||'';
    bar.querySelectorAll('.tab').forEach(function(t){
      t.classList.toggle('on', t.dataset.menu===n);
      t.setAttribute('aria-expanded', t.dataset.menu===n?'true':'false'); }); }
  bar.querySelectorAll('.tab').forEach(function(t){
    t.addEventListener('mouseenter',function(){
      clearTimeout(timer);
      if (bar.dataset.open) { open(t.dataset.menu); }   /* cross-fade, no reopen */
      else { openT=setTimeout(function(){ open(t.dataset.menu); }, 120); } });
    t.addEventListener('mouseleave',function(){ clearTimeout(openT); });
    t.addEventListener('focus',function(){ open(t.dataset.menu); });
    t.addEventListener('click',function(e){ e.preventDefault();
      open(bar.dataset.open===t.dataset.menu?'':t.dataset.menu); }); });
  bar.addEventListener('mouseleave',function(){ timer=setTimeout(function(){open('');},280); });
  bar.addEventListener('mouseenter',function(){ clearTimeout(timer); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') open(''); });
  var b=bar.querySelector('.burger');
  if(b) b.addEventListener('click',function(){
    bar.dataset.sheet = bar.dataset.sheet==='1' ? '' : '1'; });
})();
(function(){
  document.querySelectorAll('.stage').forEach(function(st){
    var im=st.querySelectorAll('img'); if(im.length<2) return;
    var i=0; im[0].classList.add('on');
    setInterval(function(){ im[i].classList.remove('on');
      i=(i+1)%im.length; im[i].classList.add('on'); }, 4200);
  });
})();
</script>"""


def nav():
    tabs = "".join(f'<button class=tab data-menu="{k}" aria-expanded=false>{k}'
                   f'<i aria-hidden=true>&#9662;</i></button>' for k in MENUS)
    foot = {"Platform": ("The whole architecture, in five components",
                         "Read the technical brief"),
            "Work": ("Thirty-eight sites measured, six rebuilt, five operated",
                     "See all the work"),
            "Company": ("Fixed quote, written scope, a reply from a person",
                        "Start a project")}
    panels = "".join(
        f'<div class=panel data-p="{k}"><div class=pin><span class=lab>{k}</span>'
        f'<div class=pgrid>' +
        "".join(f'<a class=mi href="{h}"><span class=ic>{GLYPH.get(t, "\u25CB")}</span>'
                f'<b>{t}</b><span>{d}</span></a>' for t, d, h in rows) +
        f'</div></div>'
        f'<div class=pfoot><span>{foot[k][0]}</span>'
        f'<a href="#">{foot[k][1]} &rarr;</a></div></div>'
        for k, rows in MENUS.items())
    sheet = "".join(
        f'<div class=sg><span class=lab>{k}</span>' +
        "".join(f'<a class=mi href="{h}"><b>{t}</b><span>{d}</span></a>' for t, d, h in rows) +
        '</div>' for k, rows in MENUS.items())
    # caret glyph, weighted rather than the hairline default
    return (f'<nav class=bar data-open=""><div class=w>'
            f'<a class=bd href="#">LOVELEEDAY</a><div class=tabs>{tabs}</div>'
            f'<div class=rt><a class=btn href="#">Contact</a>'
            f'<a class="btn solid" href="#">Start a project</a></div>'
            f'<button class=burger aria-label=Menu><span></span><span></span></button>'
            f'</div>{panels}<div class=sheet><div class=w>{sheet}</div></div></nav>')


def ticker():
    """A ticker that never shows the same item twice on one screen.

    The old set was 1050px wide against a 1440px viewport, so the duplicate
    used for the seamless loop was visible on load and the leading item was
    cropped mid-word with no mask. The set is longer now, and the rail is
    masked at both edges so items enter and leave instead of being sliced.

    Deltas: "SOURCES 4 0" ran together as "SOURCES40" -- a reader cannot tell
    whether 0 is a second metric or a zero change. Flat metrics now carry no
    delta at all, and a real move is parenthesised."""
    one = "".join(
        f'<span class=tk>{k}<b>{v}</b>'
        + (f'<i>({d})</i>' if d else '')
        + '</span>' for k, v, d in TICKER)
    return f'<div class=tick><div class=tickrow>{one}{one}</div></div>'


def frame(grade, src=None):
    """One fixed, graded frame -- was a crossfading stack of twelve.

       Apple's product heroes are static, Palantir's are typography over one
       restrained image, Bloomberg's homepage is data. A rotating hero says
       "we have several images and none of them is the right one", which was
       exactly true of the old library."""
    return (f'<div class=stage><img src="{P}{src or HERO_PHOTO}" alt="Two engineers '
            f'in a server room reviewing a data trail on a tablet">'
            f'<div class=grade style="background:{grade}"></div></div>')


LOBES_LEGEND = [("Frontal", "#E8A24A"), ("Parietal", "#4FB6D6"),
                ("Temporal", "#B478E0"), ("Occipital", "#5FC98A")]


def brain(opts='{style:"lobe"}'):
    """The real cortical surface, coloured by lobe.

    Daniel picked Lobes from the five colour treatments. It is the one that
    does explanatory work rather than decoration: the four regions are assigned
    from actual position in an MRI-derived surface, so the legend underneath is
    describing the picture rather than labelling it."""
    legend = "".join(
        f'<span class=lg><i style="background:{c}"></i>{n}</span>'
        for n, c in LOBES_LEGEND)
    return (f'<div class=brainbox><canvas data-brain></canvas></div>'
            f'<script>Brain3D.mount(document.currentScript.previousElementSibling'
            f'.querySelector("canvas"),{opts});</script>'
            f'<div class=legend>{legend}'
            f'<span class=lgsrc>Cortical surface from an MRI &middot; '
            f'1,722 points &middot; NIH 3D 3DPX-000757, public domain</span></div>')


def panels(items):
    return '<div class=panels>' + "".join(
        f'<div class=pnl><span class=code>{c}</span><b>{v}</b><span>{l}</span>'
        f'<p>{d}</p></div>' for c, v, l, d in items) + '</div>'


def work_cards(n=3):
    return '<div class=grid>' + "".join(
        f'<a class=card href="#"><div class=sh><img src="../../../public{s["frame"]}" '
        f'alt="" loading=lazy></div><div class=cb><span class=lab>{s["id"]} &middot; '
        f'{s["sector"]}</span><p>{s["thesis"][:118]}&hellip;</p></div></a>'
        for s in STUDIES[:n]) + '</div>'


def operated_rows():
    return '<div class=rows>' + "".join(
        f'<div class=row><span class=c>{o["index"]}</span><b>{o["title"]}</b>'
        f'<p>{o["outcome"]}</p><span class=n>{o["shipped"]}</span></div>'
        for o in LIVE["operated"]) + '</div>'


def footer():
    cols = "".join(
        f'<div><span class=lab>{c["title"]}</span>' +
        "".join(f'<a href="#">{t}</a>' for t, _ in c["links"]) + '</div>'
        for c in CH["footer"])
    return (f'<footer><div class=w><div class=fg>'
            f'<div><div class=bd>LOVELEEDAY</div>'
            f'<p style="margin-top:10px;max-width:32ch">{CH["tagline"]}</p></div>{cols}</div>'
            f'<div class=fbase><span>&copy; 2026 LOVELEEDAY STUDIOS LLC</span>'
            f'<span>{CH["city"].upper()}</span></div></div></footer>')


def shell(name, tokens, extra_css, body):
    return f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>{name} &mdash; LOVELEEDAY concept</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="{FONTS}" rel=stylesheet>
<style>:root{{{tokens}
  --sans:'Inter Tight',system-ui,-apple-system,sans-serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,monospace}}
{BASE}
{extra_css}</style>
<!-- brain.js must load BEFORE the body: each brain section mounts itself with an
     inline script beside its own canvas, which runs at parse time. Loading the
     library at the end of the body threw "Brain is not defined" five times. -->
<script>{BRAIN_JS}</script>
</head><body>
{body}
{NAV_JS}
</body></html>"""


DARK = """--bg:#08080A; --fg:#F2F2EF; --mu:#A6A6A2; --edge:rgba(255,255,255,.14);
  --panel:#101014; --navbg:rgba(10,10,12,.92); --tickbg:#060607;
  --panelUp:#17171C; --panelEdge:rgba(255,255,255,.12); --miHov:rgba(255,255,255,.055);
  --tabfg:rgba(255,255,255,.74); --hov:rgba(255,255,255,.06); --dim:#8C8C89;
  --hovOn:rgba(255,255,255,.10); --btnedge:rgba(255,255,255,.20);
  --key:#FF9E3D; --keyfg:#120A02; --up:#4FD08A;"""
LIGHT = """--bg:#FFFFFF; --fg:#111114; --mu:#5A5A56; --edge:rgba(0,0,0,.15);
  --panel:#F7F7F4; --navbg:rgba(255,255,255,.93); --tickbg:#F1F1EC;
  --panelUp:#FFFFFF; --panelEdge:rgba(0,0,0,.13); --miHov:rgba(0,0,0,.045);
  --tabfg:#3E3E3A; --hov:rgba(0,0,0,.05); --hovOn:rgba(0,0,0,.08); --dim:#6A6A66;
  --btnedge:rgba(0,0,0,.20); --key:#B4560F; --keyfg:#FFFFFF; --up:#127A46;"""

ASK = ("Give it a question. It decomposes into the questions it has to answer "
       "first &mdash; which objects the words resolve to, what was known on the "
       "date, whether every input carries a source, and whether the action is "
       "reversible.")


def c_terminal():
    """Bloomberg at full strength."""
    css = """
.hero{border-bottom:1px solid var(--edge)}
.hgrid{display:grid;gap:0}
@media(min-width:1000px){.hgrid{grid-template-columns:minmax(0,1fr) 300px}}
.hmain{padding:clamp(34px,5vw,74px) 0 clamp(26px,3vw,44px)}
.hmain h1{max-width:16ch}
.rail{border-left:1px solid var(--edge);padding:22px 0 22px 22px;display:grid;
  gap:16px;align-content:start}
@media(max-width:999px){.rail{border-left:0;border-top:1px solid var(--edge);padding-left:0}}
.rl{display:flex;justify-content:space-between;gap:12px;align-items:baseline;
  padding-bottom:14px;border-bottom:1px solid var(--edge)}
.rl span{font:400 10.5px/1.4 var(--mono);letter-spacing:.11em;text-transform:uppercase;color:var(--mu)}
.rl b{font:400 15px/1 var(--mono);font-variant-numeric:tabular-nums}
.railshot{margin-top:6px;border:1px solid var(--edge);height:112px;overflow:hidden;position:relative}
.cmd{display:flex;gap:8px;flex-wrap:wrap;margin-top:26px}
.cmd span{font:400 11px/1 var(--mono);letter-spacing:.12em;padding:8px 11px;
  border:1px solid var(--edge);color:var(--key)}
.brainwrap{border-top:1px solid var(--edge);border-bottom:1px solid var(--edge);
  background:#0A0A0D}
"""
    rails = "".join(f'<div class=rl><span>{l}</span><b>{v}</b></div>'
                    for _, v, l, _ in STATS)
    body = f"""{ticker()}{nav()}
<header class=hero><div class=w><div class=hgrid>
  <div class=hmain>
    <span class=lab>{EYEBROW_HERO}</span>
    <h1 style="margin-top:18px">Intelligence<br>you can trace.</h1>
    <p class=lede>The object layer for the business you already run. Every value
    carries the date it was true, the date you learned it, and the trail back.</p>
    <div class=cmd><span>ONTO &lt;GO&gt;</span><span>LINE &lt;GO&gt;</span>
      <span>ASOF &lt;GO&gt;</span><span>PROOF &lt;GO&gt;</span></div>
  </div>
  <div class=rail>{rails}
    <div class=railshot>{frame('linear-gradient(90deg,rgba(8,8,10,.62),rgba(8,8,10,.18))')}</div>
  </div>
</div></div></header>

<section class=brainwrap><div class=w style="padding-top:clamp(36px,4vw,60px)">
  <span class=lab>{EYEBROW_BRAIN}</span>
  <h2 style="margin-top:14px">{BRAIN_H2}</h2>
  <p class=lede>{ASK}</p>
</div>{brain()}</section>

<section class=sec><div class=w>
  <span class=lab>The book</span>
  <h2 style="margin-top:14px">The book.</h2>
  {panels(STATS)}
  {operated_rows()}
</div></section>

<section class=sec style="padding-top:0"><div class=w>
  <span class=lab>Uncommissioned</span>
  <h2 style="margin-top:14px">Thirty-eight measured. Six rebuilt.</h2>
  {work_cards()}
</div></section>
{footer()}"""
    return shell("Terminal", DARK, css, body)


def c_dispatch():
    """Photography leads, full-bleed and cycling, with the data rail over it."""
    css = """
.hero{position:relative;min-height:clamp(520px,82vh,820px);display:flex;
  flex-direction:column;justify-content:flex-end;overflow:hidden}
.hero .w{position:relative;z-index:3;padding-bottom:clamp(30px,4vw,56px)}
.hero h1{max-width:15ch;text-shadow:0 2px 40px rgba(0,0,0,.5)}
.hero .lede{color:#EDEDEA;max-width:52ch}
.overrail{position:relative;z-index:3;border-top:1px solid rgba(255,255,255,.2);
  background:rgba(8,8,10,.55);backdrop-filter:blur(8px)}
.orow{display:grid;gap:0}
@media(min-width:760px){.orow{grid-template-columns:repeat(4,1fr)}}
.orow div{padding:16px clamp(16px,2.6vw,40px);border-bottom:1px solid rgba(255,255,255,.14)}
@media(min-width:760px){.orow div+div{border-left:1px solid rgba(255,255,255,.14);
  border-bottom:0}}
.orow b{display:block;font:400 22px/1 var(--mono);font-variant-numeric:tabular-nums}
.orow span{display:block;margin-top:7px;font:400 10.5px/1.4 var(--mono);
  letter-spacing:.13em;text-transform:uppercase;color:#C9C9C5}
.brainwrap{background:#050507;border-top:1px solid var(--edge);border-bottom:1px solid var(--edge)}
"""
    orow = "".join(f'<div><b>{v}</b><span>{l}</span></div>'
                    for _, v, l, _ in STATS)
    body = f"""{ticker()}{nav()}
<header class=hero>
  {frame('linear-gradient(180deg,rgba(8,8,10,.30) 0%,rgba(8,8,10,.34) 42%,rgba(8,8,10,.94) 100%)')}
  <div class=w>
    <span class=lab>{EYEBROW_HERO}</span>
    <h1 style="margin-top:16px">Intelligence<br>you can trace.</h1>
    <p class=lede>The object layer for the business you already run.</p>
  </div>
  <div class=overrail><div class=orow>{orow}</div></div>
</header>

<section class=brainwrap><div class=w style="padding-top:clamp(40px,5vw,72px)">
  <span class=lab>{EYEBROW_BRAIN}</span>
  <h2 style="margin-top:14px">{BRAIN_H2}</h2>
  <p class=lede>{ASK}</p>
</div>{brain()}</section>

<section class=sec><div class=w>
  <span class=lab>In production</span>
  <h2>Five companies. We are our own customer.</h2>
  {operated_rows()}
</div></section>

<section class=sec style="padding-top:0"><div class=w>
  <span class=lab>Uncommissioned</span>
  <h2>Thirty-eight measured. Six rebuilt.</h2>
  {work_cards()}
</div></section>
{footer()}"""
    return shell("Dispatch", DARK, css, body)


def c_split():
    """The fold is divided: photograph one side, live brain the other."""
    css = """
.hero{border-bottom:1px solid var(--edge)}
.sp{display:grid;gap:0;min-height:clamp(480px,72vh,760px)}
@media(min-width:1000px){.sp{grid-template-columns:44% 56%}}
.spL{position:relative;overflow:hidden;min-height:300px}
.spL .inner{position:relative;z-index:3;padding:clamp(28px,3.4vw,54px);
  height:100%;display:flex;flex-direction:column;justify-content:flex-end}
.spL h1{font-size:clamp(2rem,3.6vw,3.4rem);max-width:14ch}
.spR{border-left:1px solid var(--edge);display:flex;flex-direction:column;
  background:#0A0A0D}
@media(max-width:999px){.spR{border-left:0;border-top:1px solid var(--edge)}}
.spR .head{padding:clamp(20px,2.4vw,32px) clamp(20px,2.4vw,32px) 0}
.spR .brainbox{flex:1;height:auto;min-height:300px}
"""
    body = f"""{ticker()}{nav()}
<header class=hero><div class=sp>
  <div class=spL>
    {frame('linear-gradient(180deg,rgba(8,8,10,.34),rgba(8,8,10,.92))')}
    <div class=inner>
      <span class=lab>{EYEBROW_HERO}</span>
      <h1 style="margin-top:14px">Intelligence<br>you can trace.</h1>
      <p class=lede style="color:#E8E8E4">The object layer for the business you
      already run.</p>
    </div>
  </div>
  <div class=spR>
    <div class=head><span class=lab>{EYEBROW_BRAIN}</span>
      <h3 style="margin-top:10px">{BRAIN_H2}</h3></div>
    {brain()}
  </div>
</div></header>

<section class=sec><div class=w>
  <span class=lab>What is enforced</span>
  <h2>Four rules the write path keeps.</h2>
  {panels(STATS)}
</div></section>

<section class=sec style="padding-top:0"><div class=w>
  <span class=lab>In production</span>
  <h2>Five companies we own and run.</h2>
  {operated_rows()}
</div></section>

<section class=sec style="padding-top:0"><div class=w>
  <span class=lab>Uncommissioned</span>
  <h2>Thirty-eight measured. Six rebuilt.</h2>
  {work_cards()}
</div></section>
{footer()}"""
    return shell("Split", DARK, css, body)


def c_exchange():
    """Bloomberg in daylight."""
    css = """
.hero{border-bottom:1px solid var(--edge);padding:clamp(34px,4.6vw,76px) 0}
.hgrid{display:grid;gap:clamp(24px,3vw,46px)}
@media(min-width:1000px){.hgrid{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);
  align-items:center}}
.hero h1{max-width:15ch}
.shotbox{position:relative;height:clamp(240px,26vw,380px);overflow:hidden;
  border:1px solid var(--edge)}
.capline{margin-top:10px;font:400 10.5px/1.5 var(--mono);letter-spacing:.11em;
  text-transform:uppercase;color:var(--mu)}
.brainwrap{background:#0A0A0D;color:#F2F2EF;border-top:1px solid var(--edge)}
.brainwrap .lab{color:#FF9E3D}
.brainwrap .lede{color:#A6A6A2}
.brainwrap .lg{color:#A6A6A2}
.brainwrap .lgsrc{color:#8C8C89}
"""
    body = f"""{ticker()}{nav()}
<header class=hero><div class="w hgrid">
  <div>
    <span class=lab>{EYEBROW_HERO}</span>
    <h1 style="margin-top:16px">Intelligence<br>you can trace.</h1>
    <p class=lede>Every value carries the date it was true, the date you learned
    it, and the trail back to the system it came from.</p>
    <div style="margin-top:26px;display:flex;gap:10px;flex-wrap:wrap">
      <a class="btn solid" href="#">Start a project</a>
      <a class=btn href="#">Read the architecture</a></div>
  </div>
  <div>
    <div class=shotbox>{frame('linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.30))')}</div>
    <p class=capline>Kalamazoo, Michigan &middot; the studio and the companies it runs</p>
  </div>
</div></header>

<section class=sec><div class=w>
  <span class=lab>The book</span>
  <h2>Measured, not asserted.</h2>
  {panels(STATS)}
  {operated_rows()}
</div></section>

<section class=brainwrap><div class=w style="padding-top:clamp(40px,5vw,72px)">
  <span class=lab>{EYEBROW_BRAIN}</span>
  <h2 style="margin-top:14px">{BRAIN_H2}</h2>
  <p class=lede>{ASK}</p>
</div>{brain()}</section>

<section class=sec><div class=w>
  <span class=lab>Uncommissioned</span>
  <h2>Thirty-eight measured. Six rebuilt.</h2>
  {work_cards()}
</div></section>
{footer()}"""
    return shell("Exchange", LIGHT, css, body)


def c_signal():
    """A mosaic that re-tiles itself; the brain is the one centrepiece."""
    css = """
.hero{position:relative;min-height:clamp(520px,84vh,840px);display:grid;
  place-items:center;overflow:hidden;border-bottom:1px solid var(--edge)}
.mosaic{position:absolute;inset:0;display:grid;grid-template-columns:repeat(4,1fr);
  grid-template-rows:repeat(3,1fr);gap:2px}
@media(max-width:760px){.mosaic{grid-template-columns:repeat(2,1fr);
  grid-template-rows:repeat(4,1fr)}}
.cell{position:relative;overflow:hidden;background:#0C0C0F}
.cell img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  object-position:top center;opacity:.5;filter:saturate(.35) contrast(1.06)}
.hero .veil{position:absolute;inset:0;
  background:radial-gradient(ellipse at center,rgba(8,8,10,.94) 22%,rgba(8,8,10,.62) 70%,rgba(8,8,10,.86) 100%)}
.hero .w{position:relative;z-index:4;text-align:center}
.hero h1{max-width:14ch;margin:0 auto}
.hero .lede{margin:18px auto 0;text-align:center}
.brainwrap{background:#050507;border-bottom:1px solid var(--edge)}
.brainwrap .w{text-align:center}
.brainwrap .lede{margin-left:auto;margin-right:auto}
"""
    # Twelve real captures of sites this studio rebuilt, held still. A wall of
    # our own work argues for us; a wall of stock landscapes argued for nobody.
    cells = "".join(
        f'<div class=cell><img src="{PW}{n}.jpg" alt="" loading=lazy></div>'
        for n in WALL)
    body = f"""{ticker()}{nav()}
<header class=hero>
  <div class=mosaic>{cells}</div><div class=veil></div>
  <div class=w>
    <span class=lab>{EYEBROW_HERO}</span>
    <h1 style="margin-top:18px">Intelligence<br>you can trace.</h1>
    <p class=lede>The object layer for the business you already run.</p>
  </div>
</header>

<section class=brainwrap><div class=w style="padding-top:clamp(44px,5.5vw,80px)">
  <span class=lab>{EYEBROW_BRAIN}</span>
  <h2 style="margin-top:14px">{BRAIN_H2}</h2>
  <p class=lede>{ASK}</p>
</div>{brain()}</section>

<section class=sec><div class=w>
  <span class=lab>The book</span>
  <h2>Measured, not asserted.</h2>
  {panels(STATS)}
  {operated_rows()}
</div></section>

<section class=sec style="padding-top:0"><div class=w>
  <span class=lab>Uncommissioned</span>
  <h2>Thirty-eight measured. Six rebuilt.</h2>
  {work_cards()}
</div></section>
{footer()}"""
    page = shell("Signal", DARK, css, body)
    # each mosaic cell cycles on its own offset, so the wall never re-tiles in step
    return page


CONCEPTS = [("terminal", "Terminal", c_terminal), ("dispatch", "Dispatch", c_dispatch),
            ("split", "Split", c_split), ("exchange", "Exchange", c_exchange),
            ("signal", "Signal", c_signal)]

BLURB = {
    "terminal": "Bloomberg at full strength. Amber on black, a running ticker, "
                "four-letter function codes, dense panels. Photography is confined "
                "to one small rail, because the Terminal is not a photo medium.",
    "dispatch": "Photography leads: full-bleed, cycling, Ken Burns. The data rail "
                "sits ON the image rather than under it, and the brain gets its own "
                "black band below the fold.",
    "split":    "The fold is divided. Photograph on the left, the brain running LIVE "
                "on the right, so the first thing on the page is the product thinking.",
    "exchange": "Bloomberg in daylight. White ground, amber accents, dense tables, "
                "the photograph reduced to one framed panel. The brain band is the "
                "only dark moment and it lands harder for it.",
    "signal":   "A twelve-cell mosaic where every cell changes photograph on its own "
                "offset, so the wall never re-tiles in step. Almost no furniture: the "
                "brain is the single centrepiece.",
}


def index():
    cards = "".join(
        f'<a class=ic href="{slug}.html"><span class=lab>0{i+1}</span>'
        f'<h3>{name}</h3><p>{BLURB[slug]}</p></a>'
        for i, (slug, name, _) in enumerate(CONCEPTS))
    css = """.ig{display:grid;gap:14px;margin-top:30px}
@media(min-width:760px){.ig{grid-template-columns:1fr 1fr}}
.ic{border:1px solid var(--edge);background:var(--panel);padding:24px;display:block}
.ic:hover{border-color:var(--key)}
.ic h3{margin-top:10px}
.ic p{margin-top:10px;font-size:14px;line-height:1.6;color:var(--mu)}"""
    body = f"""<section class=sec><div class=w>
  <span class=lab>LOVELEEDAY &middot; landing page concepts</span>
  <h1 style="margin-top:16px;font-size:clamp(2rem,4vw,3.2rem)">Five ways to update it.</h1>
  <p class=lede>Every one has the cycling photographic hero, the dropdown navigation,
  Bloomberg-register furniture, and the brain in place of the internal dashboard.
  They differ in which of those leads.</p>
  <div class=ig>{cards}</div>
</div></section>"""
    return shell("Concepts", DARK, css, body)


def check_tokens(css, tokens):
    """Every var(--x) must be defined. An undefined token in a `font:` shorthand
       silently drops the whole declaration -- this repo has been bitten by that
       twice (--sans/--mono, then --ln for --line)."""
    defined = set(re.findall(r"(--[\w-]+)\s*:", tokens))
    missing = set(re.findall(r"var\((--[\w-]+)", css)) - defined
    if missing:
        raise SystemExit("undefined CSS tokens: " + ", ".join(sorted(missing)))


if __name__ == "__main__":
    # shell() appends --sans and --mono to every :root, so the guard has to see
    # the same set the browser will.
    SHARED = "--sans:x; --mono:x;"
    for tok in (DARK, LIGHT):
        check_tokens(BASE, tok + SHARED)
    for slug, name, fn in CONCEPTS:
        (OUT / f"{slug}.html").write_text(fn())
        print(f"wrote concepts/{slug}.html  ({name})")
    (OUT / "index.html").write_text(index())
    print("wrote concepts/index.html")
