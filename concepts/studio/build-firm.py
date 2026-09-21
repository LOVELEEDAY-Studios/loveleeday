#!/usr/bin/env python3
"""Five concepts for what this looks like as a major firm, not a small studio.

    python3 concepts/studio/build-firm.py -> concepts/studio/firm/index.html

Daniel: "i am not sold on the photos used, it still feels like a small tech
company not a major firm. can you show me concepts of what an apple and
bloomberg technology site could look like."

The diagnosis is specific and it is not about which photograph. APPLE AND
BLOOMBERG DO NOT PUT PEOPLE IN THE HERO. Apple's hero is the product on
seamless, lit hard, with six to fourteen words over it -- measured off
apple.com on 2026-09-21. Bloomberg's is data: dense panels, monospace
numerals, tickers, no photography at all. A photograph of people at a desk is
the visual grammar of an agency pitching for work, which is exactly the read
Daniel is describing.

So every concept here leads with the PRODUCT or the DATA, and none of them
contains a photograph of a person. What differs is which of the two references
dominates:

  01 PRODUCT     Apple. The console floating on seamless, lit from beneath,
                 one enormous line above it and almost no other copy.
  02 TERMINAL    Bloomberg. The hero IS an instrument panel -- live figures,
                 function codes, a ticker. No image anywhere above the fold.
  03 SYSTEM      The intelligence itself as the hero image: the cortical
                 surface at full bleed with the statement set over it.
  04 STATEMENT   Apple's restraint taken to its end. One line on seamless,
                 nothing else, then an abrupt drop into dense data.
  05 INSTRUMENT  The two references held in tension: a Bloomberg readout rail
                 down one side, an Apple product still on the other.
"""
import json
from pathlib import Path

import store as _F

HERE = Path(__file__).parent
OUT = HERE / "firm"
OUT.mkdir(exist_ok=True)
LIVE = json.loads((HERE / "live-content.json").read_text())
BRAIN = (HERE / "brain3d.js").read_text()
_brain = _F.read_store()
BRAIN = BRAIN.replace("__OBS__", f"{_brain['props']:,}").replace("__SRC__", str(_brain["sources"]))
STUDIES = [dict(s, frame=f) for s, f in zip(LIVE["studies"], LIVE["study_frames"])]
# NOT the ARTHUR//OS console. Daniel, twice: "that is internal to us not
# customer focused" -- it shows HIS cash, HIS entities, HIS alerts, on a screen
# a customer never sees. I removed it once and then made it the hero of three
# of these five because it was the only asset that looked like a product. It
# was the wrong product.
#
# What a customer actually receives is two things: their records resolved into
# one object with every value traced back to where it came from, and the work
# itself shipped. Both are below; neither is Daniel's dashboard.
SITES = ["novarna-after", "janta-after", "fyxit-after",
         "soarce-after", "micruity-after", "loanwell-after"]
PW = "../../../public/portal/collab/"

# The object card IS the product: four records from four systems, one object,
# and a source on every line. Rendered as a surface rather than dumped as text.
OBJECT = {
    "name": "Northwind Materials",
    "id": "customer:northwind-materials",
    "aka": ["Northwind Mat. Co", "NORTHWIND MATERIALS LLC", "vendor 4XRH", "cus_QpV2n"],
    "props": [
        ("billing_address", "1400 W Industrial Ave, Kalamazoo MI", "registry", "osm:way/887807677"),
        ("credit_terms", "Net 30", "ledger", "contact:4XRH \u00b7 rev 12"),
        ("open_balance", "$48,210.55", "payments", "inv_1Qd7\u2026 +6 more"),
        ("last_paid_at", "2026-09-14", "payments", "pi_3Qa81\u2026"),
        ("price_tier", "T2 \u2014 reinstated", "catalogue", "tier-roll 2026-09-21"),
    ],
    "trail": [
        ("Net 45", "2025-11-02 \u2192 2026-06-30", "2025-11-02", "contact:4XRH rev 9"),
        ("Net 30", "2026-06-30 \u2192 open", "2026-06-30", "contact:4XRH rev 12"),
    ],
}

FONTS = ("https://fonts.googleapis.com/css2?family=Inter+Tight:wght@200;300;400;500;600"
         "&display=swap")

# "REFUSED WRITES 0" was the weakest number on the page. Zero reads as "the
# constraint never fires", when the point is that it has teeth -- and a refusal
# COUNT would be better still, except the store does not keep one: setProp
# throws on a missing source and nothing records it. Publishing a refusal count
# would mean inventing a figure on a page whose whole argument is that figures
# name their source.
#
# So the metric is the one that IS measured and says the same thing: every
# observation in the store carries a source, all of them, counted at build.
_D = _F.read_store()

TICK = [(k, v) for k, v, _ in _F.live_ticker()
        if k not in ("LINEAGE COVER", "SOURCE SYSTEMS", "IN FORCE")]

# The concepts were built with these typed in, and by the time anyone looked
# they said 41 objects against a real 159 and 538 observations against 1,655 --
# a quarter and a third of the truth, on the one page whose entire argument is
# that a figure names where it came from. Concept 02 puts the numbers IN the
# hero. It cannot be judged, let alone shown, on numbers that are four months
# of ingestion out of date.
GRID = [("OBJ", f"{_D['objects']:,}", "objects resolved"),
        ("OBS", f"{_D['props']:,}", "observations"),
        ("SRC", str(_D['sources']), "live sources"),
        ("LIN", f"{_D['props']:,}/{_D['props']:,}", "carry a source"),
        ("UNV", str(_D['nolin']), "unverified values"),
        ("RUL", "refused", "writes with no source"),
        ("MSD", _F.SITES_MEASURED, "sites measured"),
        ("RBD", _F.REBUILDS, "rebuilds")]

CSS = """
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
:root{--void:#050507;--ink:#0B0B0E;--panel:#121216;--edge:rgba(255,255,255,.12);
  --fg:#F5F5F3;--mu:#A8A8A5;--dim:#BDBDBA;--key:#FF9E3D;--up:#4FD08A;
  --sans:'Inter Tight',system-ui,-apple-system,sans-serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,monospace}
body{margin:0;background:var(--void);color:var(--fg);
  font:400 17px/1.6 var(--sans);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
.w{max-width:1480px;margin:0 auto;padding:0 clamp(20px,3.4vw,56px)}
h1,h2{margin:0;font-weight:200;letter-spacing:-.045em;line-height:1.0;text-wrap:balance}
h1{font-size:clamp(2.8rem,8.4vw,7.6rem)}
h2{font-size:clamp(1.9rem,4vw,3.4rem);font-weight:300}
p{margin:0}
.lab{display:block;font:500 10.5px/1 var(--mono);letter-spacing:.2em;
  text-transform:uppercase;color:var(--dim)}
.sub{margin-top:24px;max-width:46ch;color:var(--mu);font-size:clamp(16px,1.6vw,19px)}

/* the concept rail */
.case{border-top:1px solid var(--edge)}
/* `padding: X 0 0` on an element that also carries .w zeroed the
   horizontal padding .w supplies, so every concept label sat flush
   against the viewport edge. Set only the axis being changed. */
.caseh{padding-top:clamp(30px,4vw,54px)}
.caseh .n{font:400 12px/1 var(--mono);color:var(--key);letter-spacing:.14em}
.caseh h3{margin:12px 0 0;font:300 clamp(1.5rem,2.6vw,2.2rem)/1.1 var(--sans);
  letter-spacing:-.035em}
.caseh p{margin-top:12px;max-width:76ch;color:var(--mu);font-size:15px;line-height:1.62}

/* chrome shared by the concepts */
.bar{display:flex;align-items:center;gap:26px;height:62px;position:relative;z-index:9}
.bd{font:600 14px/1 var(--sans);letter-spacing:.06em;text-transform:uppercase}
.nl{display:none;gap:22px;margin-left:12px}
@media(min-width:900px){.nl{display:flex}}
.nl a{font-size:14px;color:var(--mu)}
.cta{margin-left:auto;display:flex;gap:10px}
.btn{font:500 13px/1 var(--sans);padding:10px 16px;border:1px solid var(--edge);
  border-radius:4px;white-space:nowrap}
.btn.solid{background:var(--fg);border-color:var(--fg);color:var(--ink)}
.tape{display:flex;gap:30px;overflow:hidden;padding:9px 0;border-bottom:1px solid var(--edge);
  white-space:nowrap}
.tape span{font:400 11px/1 var(--mono);letter-spacing:.08em;color:var(--mu)}
.tape b{color:var(--fg);font-weight:400;margin-left:7px}
"""

CSS += """
/* ---- 01 PRODUCT: Apple. The thing itself, lit, on seamless. ---- */
.f1{background:radial-gradient(120% 70% at 50% -8%,#1A1A20 0%,#050507 62%);
  padding-bottom:clamp(50px,7vw,110px);overflow:hidden}
.f1 .mid{text-align:center;padding-top:clamp(48px,7vw,104px)}
.f1 h1{max-width:15ch;margin:0 auto}
.f1 .sub{margin:24px auto 0;text-align:center}
.f1 .stage{position:relative;margin-top:clamp(40px,5vw,72px)}
.f1 .stage::after{content:"";position:absolute;left:50%;transform:translateX(-50%);
  bottom:-30px;width:70%;height:90px;
  background:radial-gradient(60% 100% at 50% 0,rgba(255,158,61,.24),transparent 72%);
  filter:blur(22px);pointer-events:none}
.f1 .stage img{width:min(1240px,100%);margin:0 auto;border-radius:8px;
  border:1px solid rgba(255,255,255,.14);
  box-shadow:0 60px 120px -30px rgba(0,0,0,.9),0 0 0 1px rgba(0,0,0,.4)}
.f1 .cap{margin-top:34px;text-align:center}

/* ---- the resolved object: the product a customer actually buys ---- */
.obj{width:min(1180px,100%);margin:0 auto;text-align:left;background:#0E0E12;
  border:1px solid rgba(255,255,255,.14);border-radius:10px;overflow:hidden;
  box-shadow:0 60px 120px -34px rgba(0,0,0,.9)}
.objh{display:grid;gap:20px;padding:clamp(22px,2.4vw,32px);
  border-bottom:1px solid var(--edge);background:#121218}
@media(min-width:820px){.objh{grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);
  align-items:start}}
.objh b{display:block;margin-top:12px;font:300 clamp(1.5rem,2.4vw,2.1rem)/1.1 var(--sans);
  letter-spacing:-.035em}
.oid{display:block;margin-top:7px;font:400 12px/1 var(--mono);color:var(--mu)}
.aka{display:flex;flex-wrap:wrap;gap:8px;align-content:start}
.aka .lab{flex-basis:100%;margin-bottom:2px}
.aka .a{font:400 11.5px/1 var(--mono);padding:8px 10px;border:1px solid var(--edge);
  border-radius:100px;color:var(--mu);white-space:nowrap}
.objb{padding:6px clamp(22px,2.4vw,32px) 14px}
.pr{display:grid;gap:3px 18px;padding:15px 0;border-bottom:1px solid rgba(255,255,255,.07)}
@media(min-width:820px){.pr{grid-template-columns:190px minmax(0,1fr) 300px;
  align-items:baseline}}
.pr .k{font:400 12.5px/1.5 var(--mono);color:var(--mu)}
.pr .v{font:400 clamp(15px,1.5vw,17px)/1.4 var(--sans);letter-spacing:-.015em}
.pr .s,.tl .s{font:400 11.5px/1.5 var(--mono);color:var(--dim)}
.pr .s i,.tl .s i{font-style:normal;color:var(--key);margin-right:9px}
.objt{padding:18px clamp(22px,2.4vw,32px) clamp(20px,2.2vw,28px);
  border-top:1px solid var(--edge);background:#0B0B0F}
.tl{display:grid;gap:3px 16px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.06)}
@media(min-width:820px){.tl{grid-template-columns:120px 230px 180px minmax(0,1fr);
  align-items:baseline}}
.tl .v{font:400 14px/1.4 var(--mono);color:#7FD0C4}
.tl .t{font:400 12.5px/1.4 var(--mono)}
.tl .o{font:400 12.5px/1.4 var(--mono);color:var(--mu)}
.f5 .shot{padding:0;border:0;border-radius:0;overflow:visible}
.f5 .shot .obj{border-radius:8px 0 0 0;border-right:0;border-bottom:0}

/* ---- 02 TERMINAL: Bloomberg. The hero is an instrument. ---- */
.f2{background:var(--void)}
.f2 .top{display:grid;gap:0;border-bottom:1px solid var(--edge)}
@media(min-width:1000px){.f2 .top{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)}}
.f2 .say{padding:clamp(40px,5vw,80px) clamp(20px,3vw,48px) clamp(40px,5vw,80px) 0}
.f2 h1{font-size:clamp(2.4rem,5.6vw,4.6rem);max-width:13ch}
.f2 .rail{border-left:1px solid var(--edge);display:grid;
  grid-template-columns:repeat(2,1fr);gap:0}
@media(max-width:999px){.f2 .rail{border-left:0;border-top:1px solid var(--edge)}}
.f2 .cell{padding:20px 22px;border-bottom:1px solid var(--edge)}
.f2 .cell:nth-child(odd){border-right:1px solid var(--edge)}
.f2 .cell .k{font:500 10px/1 var(--mono);letter-spacing:.18em;color:var(--key)}
.f2 .cell b{display:block;margin-top:10px;font:300 clamp(1.6rem,2.6vw,2.3rem)/1 var(--sans);
  letter-spacing:-.04em;font-variant-numeric:tabular-nums}
.f2 .cell span{display:block;margin-top:6px;font:400 11px/1.4 var(--mono);
  letter-spacing:.07em;text-transform:uppercase;color:var(--mu)}
.f2 .codes{display:flex;gap:8px;flex-wrap:wrap;margin-top:28px}
.f2 .codes span{font:400 11px/1 var(--mono);letter-spacing:.12em;padding:9px 12px;
  border:1px solid var(--edge);color:var(--key)}

/* ---- 03 SYSTEM: the intelligence is the image. ---- */
.f3{position:relative;background:#040406;overflow:hidden}
.f3 .canvaswrap{position:absolute;inset:0;z-index:0;opacity:.92}
.f3 .canvaswrap canvas{width:100%;height:100%;display:block}
.f3 .veil{position:absolute;inset:0;z-index:1;
  background:linear-gradient(92deg,rgba(4,4,6,.93) 0%,rgba(4,4,6,.72) 42%,rgba(4,4,6,.2) 100%)}
.f3 .inner{position:relative;z-index:3;padding:clamp(70px,10vw,150px) 0 clamp(60px,8vw,120px)}
.f3 h1{max-width:14ch}

/* ---- 04 STATEMENT: one line, then the drop. ---- */
.f4{background:#08080A}
.f4 .say{min-height:clamp(420px,58vh,620px);display:flex;align-items:center;
  padding-block:clamp(40px,6vw,90px)}
.f4 h1{font-size:clamp(3rem,10.5vw,10rem);font-weight:200;max-width:12ch;line-height:.94}
.f4 .drop{border-top:1px solid var(--edge);display:grid;gap:1px;background:var(--edge)}
@media(min-width:700px){.f4 .drop{grid-template-columns:repeat(4,1fr)}}
/* full-bleed by design, but the outer cells were letting their numbers touch
   the viewport edge -- inset those two to the container gutter */
.f4 .d{background:#08080A;padding:26px 24px}
.f4 .d:first-child{padding-left:clamp(20px,3.4vw,56px)}
.f4 .d:last-child{padding-right:clamp(20px,3.4vw,56px)}
.f4 .d b{display:block;font:300 clamp(1.7rem,2.8vw,2.4rem)/1 var(--sans);
  letter-spacing:-.045em;font-variant-numeric:tabular-nums}
.f4 .d span{display:block;margin-top:9px;font:400 10.5px/1.4 var(--mono);
  letter-spacing:.16em;text-transform:uppercase;color:var(--mu)}

/* ---- 05 INSTRUMENT: both references, held together. ---- */
.f5{background:var(--void)}
.f5 .grid{display:grid;gap:0;border-bottom:1px solid var(--edge)}
@media(min-width:1040px){.f5 .grid{grid-template-columns:270px minmax(0,1fr)}}
.f5 .side{border-right:1px solid var(--edge);padding:clamp(26px,3vw,40px) 0}
@media(max-width:1039px){.f5 .side{border-right:0;border-bottom:1px solid var(--edge)}}
.f5 .sr{display:flex;justify-content:space-between;align-items:baseline;gap:14px;
  padding:13px clamp(20px,3vw,34px);border-bottom:1px solid var(--edge)}
.f5 .sr span{font:400 10.5px/1.3 var(--mono);letter-spacing:.13em;
  text-transform:uppercase;color:var(--mu)}
.f5 .sr b{font:400 15px/1 var(--mono);font-variant-numeric:tabular-nums}
.f5 .main{padding:clamp(34px,4vw,64px) 0 0 clamp(26px,3vw,52px)}
@media(max-width:1039px){.f5 .main{padding-left:0}}
.f5 h1{font-size:clamp(2.3rem,5vw,4.2rem);max-width:15ch}
.f5 .shot{margin-top:clamp(30px,3.6vw,52px);border:1px solid var(--edge);
  border-radius:6px 0 0 0;overflow:hidden;border-right:0;border-bottom:0}
.f5 .shot img{width:100%}
"""


def bar(light=False):
    links = "".join(f'<a href="#">{t}</a>' for t in ("Platform", "Work", "Company"))
    return (f'<div class="w"><div class=bar><span class=bd>LOVELEEDAY</span>'
            f'<div class=nl>{links}</div>'
            f'<div class=cta><a class="btn solid" href="#">Start a project</a></div>'
            f'</div></div>')


def tape():
    one = "".join(f'<span>{k}<b>{v}</b></span>' for k, v in TICK)
    return f'<div class="w"><div class=tape>{one}</div></div>'


def case(n, name, desc, block):
    return (f'<section class=case><div class="w caseh"><span class=n>{n}</span>'
            f'<h3>{name}</h3><p>{desc}</p></div>{block}</section>')


def objectcard(compact=False):
    """One object, four source systems, a citation on every line. This is the
       thing a customer is buying -- their own records, resolved and traceable."""
    aka = "".join(f'<span class=a>{x}</span>' for x in OBJECT["aka"])
    props = "".join(
        f'<div class=pr><span class=k>{k}</span><span class=v>{v}</span>'
        f'<span class=s><i>{sy}</i>{rf}</span></div>'
        for k, v, sy, rf in OBJECT["props"])
    trail = "".join(
        f'<div class=tl><span class=v>{v}</span><span class=t>true {va}</span>'
        f'<span class=o>observed {ob}</span><span class=s><i>ledger</i>{rf}</span></div>'
        for v, va, ob, rf in OBJECT["trail"])
    return (f'<div class=obj>'
            f'<div class=objh><div><span class=lab>Resolved object</span>'
            f'<b>{OBJECT["name"]}</b><span class=oid>{OBJECT["id"]}</span></div>'
            f'<div class=aka><span class=lab>Also arrived as</span>{aka}</div></div>'
            f'<div class=objb>{props}</div>'
            f'<div class=objt><span class=lab>Credit terms &middot; full history</span>'
            f'{trail}</div></div>')


def f1():
    return f"""<div class=f1>{bar()}
  <div class="w mid">
    <span class=lab>Arthur</span>
    <h1>Four records. One customer. Every figure traced.</h1>
    <p class=sub>Your data, resolved into objects that carry their own evidence.</p>
    <div class=stage>{objectcard()}</div>
    <p class="lab cap">Live output &middot; names and figures are demo values</p>
  </div>
</div>"""


def f2():
    cells = "".join(
        f'<div class=cell><span class=k>{c}</span><b>{v}</b><span>{l}</span></div>'
        for c, v, l in GRID)
    return f"""<div class=f2>{tape()}{bar()}
  <div class="w"><div class=top>
    <div class=say>
      <span class=lab>LDAY &lt;GO&gt;</span>
      <h1>Intelligence you can trace.</h1>
      <p class=sub>Every value carries the date it was true, the date you learned it,
      and the trail back to the system it came from.</p>
      <div class=codes><span>ONTO &lt;GO&gt;</span><span>LINE &lt;GO&gt;</span>
        <span>ASOF &lt;GO&gt;</span><span>PROOF &lt;GO&gt;</span></div>
    </div>
    <div class=rail>{cells}</div>
  </div></div>
</div>"""


def f3():
    return f"""<div class=f3>
  <div class=canvaswrap><canvas data-brain></canvas></div>
  <div class=veil></div>
  <div class=inner>{bar()}
    <div class=w style="padding-top:clamp(40px,6vw,90px)">
      <span class=lab>Arthur &middot; cognition</span>
      <h1>It answers the question you did not think to ask.</h1>
      <p class=sub>Give it a question and it decomposes into the questions it has to
      answer first &mdash; then resolves them, with the evidence attached.</p>
    </div>
  </div>
</div>
<script>Brain3D.mount(document.querySelector('.f3 canvas'),
  {{style:'lobe', labels:false}});</script>"""


def f4():
    d = "".join(f'<div class=d><b>{v}</b><span>{l}</span></div>' for _, v, l in GRID[:4])
    return f"""<div class=f4>{bar()}
  <div class="w say"><h1>Nothing here is unaccounted for.</h1></div>
  <div class=w style="padding-bottom:clamp(26px,3vw,44px)">
    <p class=sub style="max-width:58ch">A write without a source system and a source
    reference is refused at the path &mdash; not flagged, not defaulted, refused. That
    is why the number beside every claim on this page can name where it came from.</p>
  </div>
  <div class=drop>{d}</div>
</div>"""


def f5():
    rows = "".join(f'<div class=sr><span>{l}</span><b>{v}</b></div>' for _, v, l in GRID)
    return f"""<div class=f5>{bar()}
  <div class=w><div class=grid>
    <div class=side>{rows}</div>
    <div class=main>
      <span class=lab>Arthur &middot; the object layer</span>
      <h1>The system of record, and the record of the system.</h1>
      <p class=sub>Resolved objects, two timelines on every value, and a refusal to
      write anything without its source.</p>
      <div class=shot>{objectcard(True)}</div>
    </div>
  </div></div>
</div>"""


CONCEPTS = [
    ("01", "Product", "Apple's move, exactly: the thing itself on seamless, lit from "
     "beneath, one enormous line above it and almost nothing else. The product is the "
     "argument. Works only because there IS a product to show — which is the point "
     "a photograph of people can never make.", f1),
    ("02", "Terminal", "Bloomberg's move: the hero IS the instrument. A ticker, a live "
     "figure rail, function codes, and no image at all above the fold. The densest of "
     "the five and the one that reads most like infrastructure rather than marketing.", f2),
    ("03", "System", "The intelligence itself as the hero image — the cortical "
     "surface at full bleed, the statement set over it. No photograph, no product "
     "still: the thing the company sells, rendered live in the browser.", f3),
    ("04", "Statement", "Apple's restraint taken to its end. One line at ten rem on "
     "seamless, nothing else above the fold, then an abrupt drop into hard numbers. "
     "The largest scale contrast of the five, and the most confident.", f4),
    ("05", "Instrument", "Both references held in tension: a Bloomberg readout rail "
     "down the left, an Apple product still bleeding off the right. Reads as a "
     "terminal that happens to be beautifully made.", f5),
]


def page():
    body = "".join(case(n, nm, d, fn()) for n, nm, d, fn in CONCEPTS)
    return f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>Five concepts &mdash; Apple &times; Bloomberg</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="{FONTS}" rel=stylesheet>
<style>{CSS}</style>
<script>{BRAIN}</script>
</head><body>
<header class=w style="padding-top:clamp(44px,6vw,86px);padding-bottom:clamp(26px,3vw,44px)">
  <span class=lab>LOVELEEDAY &middot; five directions</span>
  <h2 style="margin-top:16px">What it looks like as a firm,<br>not a studio.</h2>
  <p class=sub style="max-width:66ch">Not one of these contains a photograph of a
  person, and that is the whole proposal. Apple's hero is the product on seamless.
  Bloomberg's is data. A photograph of people at a desk is the visual grammar of an
  agency pitching for work &mdash; which is exactly why the current site reads small.
  Every concept below leads with the product or the numbers instead.</p>
</header>
{body}
<footer class=w style="border-top:1px solid var(--edge);padding:40px 0 70px;
  font:400 11.5px/1.7 var(--mono);color:var(--mu)">
  Measured from apple.com and the Bloomberg Terminal's conventions on 2026-09-21.
  Console figures are demo values on the shipped interface.
</footer>
</body></html>"""


if __name__ == "__main__":
    (OUT / "index.html").write_text(page())
    print("wrote firm/index.html")
