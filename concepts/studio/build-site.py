#!/usr/bin/env python3
"""The site, mocked page by page, and the design system that makes it one site.

     python3 concepts/studio/build-site.py   ->  concepts/studio/site/*.html

   Daniel, 2026-09-21: "the board i want it to show me the mockup of the pages
   and design system for each thing we are doing."

   So this is not a description of a plan. Every page below renders, in the
   Keynote register he picked, wearing the real production tokens, using the
   real content out of src/content/work.ts. The design system is not a document
   about the components -- it is system.html, which imports the same functions
   these pages import, so the specimen sheet cannot drift from the pages. If a
   component changes here, it changes on every page and on the sheet at once.

   THE FIXES THE BOARD FOUND ARE APPLIED, not noted:
     - the product rail tiles ARTHUR'S FIVE COMPONENTS, not the five companies
       we own. work.ts is explicit that owned work stays off the homepage, and a
       rail on the first scroll-stop was the loudest possible violation of it.
     - every figure comes from work.ts FIGURES. The concept page had hand-typed
       numbers that disagreed with the data file on the same claim.
     - /privacy and /terms are real files, because the footer links to them and
       a dead trust link on a site whose pitch is lineage is self-refuting.
     - no holding-company line. "an Aspen & May company" appears nowhere in the
       repo; it came out of a conversation, and this site prints what it can
       source.
"""
import json
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / "site"
OUT.mkdir(exist_ok=True)

# ---------------------------------------------------------------------------
# TOKENS. Read from src/app/globals.css on 2026-09-21, including the three
# values corrected that day so every role clears 4.5:1 on all THREE grounds
# rather than on the two it had been measured against.
# ---------------------------------------------------------------------------
T = dict(
    ground="#FBF8F2", paper="#FFFFFF", sunk="#F2EDE3", deep="#16243A",
    ink="#16243A", mid="#45536A", dim="#616D7C",
    line="#E6E0D6", line2="#D3CABA", line3="#16243A",
    on_deep="#F6F3EC", on_deep_mu="#A9B3C4", deep_line="#2A3B55",
    teal="#0E7877", teal_wash="#E8F2F1", copper="#9B5C3E", copper_wash="#F6EDE7",
    good="#0F7B4F",
)

FIGURES = [("6", "Sites rebuilt in working HTML"),
           ("38", "Sites measured in that audit"),
           ("5", "Architectural components in Arthur"),
           ("2", "Timelines carried on every value")]

COMPONENTS5 = [
    ("Persistent memory", "Context that outlasts a conversation."),
    ("Identity resolution", "Four names, one company."),
    ("Bitemporal record", "What was true, and what we knew."),
    ("Lineage on every value", "A number with no trail is not reportable."),
    ("Verified execution", "An HTTP 200 is not evidence."),
]

STUDIES = json.loads((Path("/private/tmp/claude-501/studies.json")).read_text()) \
    if Path("/private/tmp/claude-501/studies.json").exists() else []

NAV_ITEMS = [("Arthur", "arthur.html"), ("Work", "work.html"),
             ("Company", "about.html"), ("Contact", "contact.html")]


def css():
    t = T
    return f"""
*,*::before,*::after{{box-sizing:border-box}}
html{{-webkit-text-size-adjust:100%;scroll-behavior:smooth}}
body{{margin:0;background:{t['ground']};color:{t['ink']};
  font:400 16px/1.62 'Mulish',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}}
a{{color:inherit;text-decoration:none}}
img{{display:block;max-width:100%}}
.w{{max-width:1024px;margin:0 auto;padding:0 22px}}
.wide{{max-width:1200px;margin:0 auto;padding:0 22px}}
.display{{font-family:'Manrope',system-ui,sans-serif;font-weight:800;letter-spacing:-.042em;
  line-height:.98}}
.eyebrow{{font:500 11px/1 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.17em;
  text-transform:uppercase;color:{t['dim']};display:inline-flex;align-items:center;gap:9px}}
.eyebrow::before{{content:"";width:7px;height:7px;background:{t['teal']};display:block}}
.sub{{color:{t['mid']};font-size:17px;line-height:1.5;margin:18px auto 0;max-width:34ch}}

/* ── announcement + nav ─────────────────────────────────────────────────── */
.announce{{background:{t['deep']};color:{t['on_deep']};font-size:12.5px}}
.announce .wide{{height:38px;display:flex;align-items:center;justify-content:center;gap:14px}}
.announce a{{color:#7FD4D2}}
.nav{{position:sticky;top:0;z-index:50;background:rgba(251,248,242,.86);
  backdrop-filter:saturate(180%) blur(18px);border-bottom:1px solid {t['line']}}}
.nav .wide{{display:flex;align-items:center;height:52px;gap:26px}}
.nav .mk{{font:800 15px/1 'Manrope',sans-serif;letter-spacing:-.045em}}
.nav .lk{{display:flex;gap:26px;margin:0 auto;font:500 13px/1 'Mulish',sans-serif;
  color:{t['mid']}}}
.nav .lk a.on{{color:{t['ink']}}}
.nav .cta{{background:{t['ink']};color:{t['ground']};border-radius:980px;padding:7px 15px;
  font:600 12.5px/1 'Manrope',sans-serif}}

/* ── stages ─────────────────────────────────────────────────────────────── */
.stage{{padding:clamp(64px,9vw,132px) 0;text-align:center;position:relative;overflow:hidden}}
.stage.ground{{background:{t['ground']}}}
.stage.sunkbg{{background:{t['sunk']}}}
.stage.paperbg{{background:{t['paper']};border-block:1px solid {t['line']}}}
.stage.deepbg{{background:{t['deep']};color:{t['on_deep']}}}
.stage.deepbg .sub{{color:{t['on_deep_mu']}}}
.stage.deepbg .eyebrow{{color:{t['on_deep_mu']}}}
.stage h2{{margin:16px 0 0}}
/* .obj is NOT scoped to .stage: the hero's object sits outside a stage, so a
   descendant selector gave it no dimensions at all and the canvas collapsed to
   a thumbnail in the middle of the page. */
.obj{{margin:clamp(30px,4vw,52px) auto 0;width:min(1040px,92vw);
  height:clamp(210px,28vw,340px)}}
.obj canvas{{width:100%;height:100%;display:block}}
.hero .obj{{margin-top:clamp(24px,3.4vw,44px);height:clamp(240px,32vw,400px)}}

/* photographic stage */
.stage.photo{{color:#fff}}
.stage.photo .bleed{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.stage.photo .scrim{{position:absolute;inset:0;
  background:linear-gradient(103deg,rgba(22,36,58,.92) 0 38%,rgba(22,36,58,.74) 66%,
  rgba(22,36,58,.46) 100%)}}
.stage.photo .w{{position:relative;z-index:2}}
.stage.photo .eyebrow{{color:rgba(255,255,255,.82)}}
.stage.photo .sub{{color:rgba(255,255,255,.86)}}

/* ── hero + rail ────────────────────────────────────────────────────────── */
.hero{{padding:clamp(54px,7vw,96px) 0 0;text-align:center;background:{t['ground']}}}
.hero h1{{font-size:clamp(3.4rem,10vw,7.4rem);margin:0}}
.hero .acts{{margin-top:24px;display:flex;gap:22px;justify-content:center;
  font:500 15px/1 'Mulish',sans-serif;color:{t['teal']}}}
.rail{{background:{t['paper']};border-block:1px solid {t['line']};
  padding:26px 0}}
.rail .row{{display:flex;gap:clamp(14px,3vw,44px);justify-content:center;flex-wrap:wrap}}
.tile{{display:grid;justify-items:center;gap:9px;width:132px;text-align:center}}
.tile b{{font:700 12.5px/1.25 'Manrope',sans-serif;letter-spacing:-.015em}}
.tile span{{font-size:11px;color:{t['dim']};line-height:1.4}}

/* ── evidence primitives ────────────────────────────────────────────────── */
.metrics{{display:grid;grid-template-columns:repeat(4,1fr);margin:clamp(26px,3.4vw,44px) auto 0;
  max-width:1000px;border-top:1px solid rgba(255,255,255,.18)}}
.metrics.onlight{{border-top-color:{t['line']}}}
.metrics .m{{padding:22px 10px;border-right:1px solid rgba(255,255,255,.18)}}
.metrics.onlight .m{{border-right-color:{t['line']}}}
.metrics .m:last-child{{border-right:0}}
.metrics b{{display:block;font:800 clamp(1.9rem,3.4vw,3rem)/1 'Manrope',sans-serif;
  letter-spacing:-.04em;font-variant-numeric:tabular-nums}}
.metrics span{{display:block;margin-top:8px;font-size:12.5px;line-height:1.4;
  color:rgba(255,255,255,.72)}}
.metrics.onlight span{{color:{t['dim']}}}
@media(max-width:700px){{.metrics{{grid-template-columns:repeat(2,1fr)}}}}

.lin{{max-width:860px;margin:26px auto 0;text-align:left;border-top:1px solid {t['line']}}}
.lin .r{{display:grid;grid-template-columns:150px 1fr 190px 104px;gap:14px;
  align-items:baseline;padding:12px 0;border-bottom:1px solid {t['line']};min-height:44px}}
.lin .p{{font:400 11.5px/1.4 'IBM Plex Mono',monospace;text-transform:uppercase;
  letter-spacing:.09em;color:{t['dim']}}}
.lin .v{{font:600 15px/1.3 'Manrope',sans-serif;font-variant-numeric:tabular-nums}}
.lin .s{{font:400 11.5px/1.4 'IBM Plex Mono',monospace;color:{t['copper']}}}
.lin .o{{font:400 11.5px/1.4 'IBM Plex Mono',monospace;color:{t['dim']};text-align:right;
  font-variant-numeric:tabular-nums}}
.lin .r.unsourced .s{{border:1px dashed {t['copper']};padding:3px 6px;color:{t['copper']}}}
@media(max-width:520px){{.lin .r{{grid-template-columns:1fr 1fr}}.lin .o{{text-align:left}}}}

.chip{{display:inline-block;font:500 11px/1 'IBM Plex Mono',monospace;
  color:{t['copper']};background:{t['copper_wash']};border-radius:3px;padding:5px 8px}}
.strip{{display:flex;align-items:center;gap:10px;padding:11px 0;
  border-bottom:1px solid {t['line']};font-size:13.5px;text-align:left}}
.strip i{{width:6px;height:6px;border-radius:50%;display:block;flex:none}}
.strip b{{font:600 13.5px/1 'Manrope',sans-serif}}
.strip em{{font-style:normal;color:{t['mid']}}}
.strip time{{margin-left:auto;font:400 11.5px/1 'IBM Plex Mono',monospace;color:{t['dim']};
  font-variant-numeric:tabular-nums}}

.spec{{max-width:900px;margin:26px auto 0;text-align:left;border-top:1px solid {t['line3']}}}
.spec .r{{display:grid;grid-template-columns:42px 1fr 1.4fr;gap:16px;padding:15px 0;
  border-bottom:1px solid {t['line']};align-items:baseline}}
.spec .i{{font:500 11.5px/1 'IBM Plex Mono',monospace;color:{t['teal']}}}
.spec b{{font:700 15px/1.3 'Manrope',sans-serif;letter-spacing:-.02em}}
.spec p{{margin:0;font-size:14px;color:{t['mid']};line-height:1.55}}

/* ── work grid ──────────────────────────────────────────────────────────── */
.grid{{display:grid;gap:18px;margin-top:clamp(28px,3.4vw,46px)}}
@media(min-width:780px){{.grid{{grid-template-columns:1fr 1fr}}}}
.wcard{{background:{t['paper']};border:1px solid {t['line']};overflow:hidden;text-align:left}}
.wcard .shot{{height:clamp(178px,16vw,224px);overflow:hidden;background:{t['sunk']}}}
.wcard .shot img{{width:100%;height:100%;object-fit:cover;object-position:top}}
.wcard .b{{padding:20px 22px 24px}}
.wcard .k{{font:500 10.5px/1 'IBM Plex Mono',monospace;letter-spacing:.14em;
  text-transform:uppercase;color:{t['copper']}}}
.wcard p{{margin:11px 0 0;font-size:14px;line-height:1.6;color:{t['mid']}}}

/* the OPERATED ledger is deliberately a different register from the work grid.
   A card next to a card reads as the same kind of thing, and these are not. */
.ledger{{margin-top:clamp(26px,3vw,40px);border-top:1px solid {t['line3']};text-align:left}}
.ledger .r{{display:grid;gap:14px;padding:18px 0;border-bottom:1px solid {t['line']}}}
@media(min-width:820px){{.ledger .r{{grid-template-columns:44px 190px 1fr 150px}}}}
.ledger .i{{font:500 11.5px/1 'IBM Plex Mono',monospace;color:{t['copper']}}}
.ledger b{{font:700 16px/1.25 'Manrope',sans-serif;letter-spacing:-.02em}}
.ledger p{{margin:0;font-size:14px;color:{t['mid']};line-height:1.55}}
.ledger .t{{font:400 11.5px/1.5 'IBM Plex Mono',monospace;color:{t['dim']}}}
.owned{{max-width:70ch;margin:14px auto 0;color:{t['mid']};font-size:15px}}

/* ── close + footer ─────────────────────────────────────────────────────── */
.close{{padding:clamp(66px,9vw,128px) 0;text-align:center;background:{t['sunk']}}}
.close h2{{font-size:clamp(2.2rem,5.4vw,4rem);margin:16px 0 0}}
.btn{{display:inline-block;background:{t['ink']};color:{t['ground']};border-radius:980px;
  padding:13px 28px;font:600 15px/1 'Manrope',sans-serif;margin-top:26px}}
.btn.ghost{{background:transparent;color:{t['teal']};padding-left:12px}}
.foot{{background:{t['paper']};border-top:1px solid {t['line']};padding:44px 0 62px}}
.fcols{{display:grid;gap:26px}}
@media(min-width:720px){{.fcols{{grid-template-columns:repeat(5,1fr)}}}}
.fcols div{{display:flex;flex-direction:column;gap:9px}}
.fcols b{{font:700 12px/1 'Manrope',sans-serif;margin-bottom:3px}}
.fcols a{{font-size:12.5px;color:{t['mid']}}}
.frule{{height:1px;background:{t['line']};margin:30px 0 16px}}
.flegal{{display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;
  font-size:12px;color:{t['dim']}}}
.fnote{{margin:16px 0 0;font:400 11.5px/1.6 'IBM Plex Mono',monospace;color:{t['dim']}}}
.ribbon{{position:sticky;top:0;z-index:99;background:{t['deep']};color:{t['on_deep']};
  font:500 11px/1 'IBM Plex Mono',monospace;letter-spacing:.13em;text-transform:uppercase;
  padding:9px 18px}}
"""


# ---------------------------------------------------------------------------
# Components. Every page imports these, and so does the specimen sheet, which
# is what stops the sheet describing a component the pages do not have.
# ---------------------------------------------------------------------------

def shell(title, body, ribbon, motion=True):
    m = '<script src="../motion.js"></script>' if motion else ''
    mount = ("<script>document.querySelectorAll('canvas[data-motion]')"
             ".forEach(function(c){LD.hero(c,c.dataset.motion)});</script>") if motion else ''
    return f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>{title}</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Mulish:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel=stylesheet>
{m}<style>{css()}</style></head><body>
<div class=ribbon>{ribbon}</div>
{body}
{mount}</body></html>"""


def nav(active=""):
    links = "".join(f'<a href="{h}"{" class=on" if n==active else ""}>{n}</a>'
                    for n, h in NAV_ITEMS)
    return (f'<div class=announce><div class=wide>'
            f'<span>Arthur 4.0 &mdash; scoped engagements open for Q4</span>'
            f'<a href="arthur.html">Read the technical brief &rsaquo;</a></div></div>'
            f'<nav class=nav><div class=wide><a class=mk href="home.html">LOVELEEDAY</a>'
            f'<span class=lk>{links}</span>'
            f'<a class=cta href="contact.html">Start a project</a></div></nav>')


def foot():
    plat = "".join(f'<a href="arthur.html">{n}</a>' for n, _ in COMPONENTS5)
    return f"""<footer class=foot><div class=wide>
  <div class=fcols>
    <div><b>Platform</b>{plat}</div>
    <div><b>Products</b><a href="work.html#operated">Companies we operate</a></div>
    <div><b>Work</b><a href="work.html#studies">Selected work</a></div>
    <div><b>Company</b><a href="about.html">About</a><a href="contact.html">Contact</a></div>
    <div><b>Support</b><a href="arthur.html">Technical brief</a>
      <a href="privacy.html">Privacy</a><a href="terms.html">Terms</a></div>
  </div>
  <div class=frule></div>
  <div class=flegal><span>LOVELEEDAY Studios &middot; Kalamazoo, Michigan</span>
    <span>&copy; 2026</span></div>
  <p class=fnote>Concept mockup. Figures on this site name their source.
  Photography is the studio&rsquo;s own; rendered objects are drawn in canvas.</p>
</div></footer>"""


def stage(eyebrow, head, sub="", obj=None, ground="ground", extra="", head_size=None):
    o = (f'<div class=obj><canvas data-motion="{obj}"></canvas></div>') if obj else ""
    s = f'<p class=sub>{sub}</p>' if sub else ""
    hs = f' style="font-size:{head_size}"' if head_size else ""
    return (f'<section class="stage {ground}"><div class=w>'
            f'<p class=eyebrow>{eyebrow}</p>'
            f'<h2 class=display{hs}>{head}</h2>{s}</div>{o}{extra}</section>')


def photo_stage(eyebrow, head, img, metrics=None):
    m = ""
    if metrics:
        m = '<div class=metrics>' + "".join(
            f'<div class=m><b>{k}</b><span>{v}</span></div>' for k, v in metrics) + '</div>'
    return (f'<section class="stage photo"><img class=bleed src="{img}" alt="">'
            f'<div class=scrim></div><div class=w>'
            f'<p class=eyebrow>{eyebrow}</p><h2 class=display>{head}</h2>{m}</div></section>')


def metric_band(items, onlight=True):
    cls = "metrics onlight" if onlight else "metrics"
    return (f'<div class="{cls}">' + "".join(
        f'<div class=m><b>{k}</b><span>{v}</span></div>' for k, v in items) + '</div>')


def lineage(rows):
    out = []
    for p, v, s, o in rows:
        un = " unsourced" if not s else ""
        out.append(f'<div class="r{un}"><div class=p>{p}</div><div class=v>{v}</div>'
                   f'<div class=s>{s or "no source recorded"}</div><div class=o>{o}</div></div>')
    return f'<div class=lin>{"".join(out)}</div>'


def strips(items):
    dots = {"live": T['good'], "degraded": T['copper'], "configured": T['dim'],
            "dormant": T['dim'], "unverified": T['copper']}
    return "".join(
        f'<div class=strip><i style="background:{dots.get(s,T["dim"])}"></i>'
        f'<b>{n}</b><em>{d}</em><time>checked {c}</time></div>'
        for n, s, d, c in items)


def spec(rows):
    return ('<div class=spec>' + "".join(
        f'<div class=r><div class=i>{i}</div><div><b>{t}</b></div><div><p>{d}</p></div></div>'
        for i, t, d in rows) + '</div>')


def close(eyebrow, head, sub, primary="Start a project", ghost="See what we have shipped"):
    return (f'<section class=close><div class=w><p class=eyebrow>{eyebrow}</p>'
            f'<h2 class=display>{head}</h2><p class=sub>{sub}</p>'
            f'<div><a class=btn href="contact.html">{primary}</a>'
            f'<a class="btn ghost" href="work.html">{ghost} &rsaquo;</a></div></div></section>')


# Five marks, one per architectural component. Unambiguous placeholders -- the
# concept page built these by replacing the bare letters C and A, and SVG path
# data uses C for a cubic and A for an arc, so the substitution ate the geometry.
MARKS = [
    '<path d="M31 12 49 22v20L31 52 13 42V22Z" fill="none" stroke="{ink}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="31" cy="32" r="4" fill="{acc}"/>',
    '<circle cx="18" cy="20" r="5" fill="none" stroke="{ink}" stroke-width="2.1"/><circle cx="44" cy="20" r="5" fill="none" stroke="{ink}" stroke-width="2.1"/><circle cx="31" cy="46" r="5" fill="none" stroke="{ink}" stroke-width="2.1"/><path d="M22 23 27 42M40 23 35 42M23 20h16" stroke="{acc}" stroke-width="2"/>',
    '<path d="M10 24h44M10 40h44" stroke="{ink}" stroke-width="2.1"/><circle cx="24" cy="24" r="3.6" fill="{acc}"/><circle cx="40" cy="40" r="3.6" fill="{ink}"/>',
    '<path d="M14 48 26 30 38 38 50 16" fill="none" stroke="{ink}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="50" cy="16" r="4" fill="{acc}"/>',
    '<rect x="13" y="16" width="36" height="30" rx="3" fill="none" stroke="{ink}" stroke-width="2.1"/><path d="M22 32l6 6 12-14" fill="none" stroke="{acc}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>',
]


def rail():
    tiles = []
    for i, (name, note) in enumerate(COMPONENTS5):
        svg = MARKS[i].replace("{ink}", T['ink']).replace("{acc}", T['copper'])
        tiles.append(f'<a class=tile href="arthur.html">'
                     f'<svg width="62" height="62" viewBox="0 0 62 62" aria-hidden="true">{svg}</svg>'
                     f'<b>{name}</b><span>{note}</span></a>')
    return (f'<section class=rail><div class=wide><div class=row>{"".join(tiles)}</div>'
            f'</div></section>')


def home():
    figs = [(k, v) for k, v in FIGURES][:4]
    body = nav("") + f"""
<header class=hero><div class=w>
  <h1 class=display>Arthur.</h1>
  <p class=sub>The intelligence system that can show you where every answer came from.</p>
  <div class=acts><a href="arthur.html">Learn more &rsaquo;</a>
    <a href="work.html">See it work &rsaquo;</a></div>
</div><div class=obj><canvas data-motion="lattice"></canvas></div></header>
{rail()}
{stage("Identity resolution", "Four names.<br>One company.",
       "A payments customer, a vendor id and a line in a PDF. Three records, one object.",
       obj="bundle", ground="sunkbg")}
{stage("Lineage", "Every figure,<br>back to its source.",
       "A number without a trail is not reportable. That rule is in the write path, not in a promise.",
       obj="series", ground="ground",
       extra='<div class=w>' + lineage([
           ("net_terms", "45 days", "erp:vendor/4412", "2026-09-18"),
           ("spend_ytd", "$412,880", "stripe:bal_tx", "2026-09-20"),
           ("contact", "ap@fintecheq.com", "doc:invoice_8841.pdf", "2026-08-02"),
           ("risk_tier", "B", "", "2026-09-21"),
       ]) + '</div>')}
{stage("Verified execution", "Built to prove it ran.",
       "An HTTP 200 is not evidence that the thing you asked for happened. Work closes on a value read back out of the system that was supposed to change.",
       obj="flow", ground="sunkbg")}

<!-- THE HAND-OFF. Five drawn stages, then the first photograph. The medium
     changes register before the copy does: a visitor feels the shift from how
     the system works to who we do this for before reading a word. -->
{photo_stage("In production", "Built. Shipped. Running.",
             "../../janta/roi-hero.jpg", metrics=figs)}

<section class="stage paperbg"><div class=wide>
  <p class=eyebrow>Selected work</p>
  <h2 class=display style="font-size:clamp(2rem,4.4vw,3.2rem)">Thirty-eight sites.<br>Six rebuilds.</h2>
  <p class=sub>Rebuilt as running pages rather than described in a deck. Companies that are not ours, and not named here.</p>
  <div class=grid>""" + "".join(
      f'<a class=wcard href="work.html"><div class=shot>'
      f'<img src="../../../public{s["frame"].split("?")[0]}" alt=""></div>'
      f'<div class=b><span class=k>{s["sector"]}</span>'
      f'<p>{s["thesis"]}</p></div></a>' for s in STUDIES[:4]) + """
  </div>
</div></section>
""" + close("Start", "See the question.<br>Build the answer.",
            "Tell us what is costing you an hour a day. We reply the same week, with a plan or with a reason it is not a fit.") + foot()
    return shell("LOVELEEDAY Studios",
                 body, "Mockup &middot; Home &middot; Keynote register &middot; 8 stages")


def arthur():
    body = nav("Arthur") + f"""
<header class=hero><div class=w>
  <h1 class=display style="font-size:clamp(2.6rem,7vw,5.2rem)">The object layer.</h1>
  <p class=sub>Five components. Each one is a rule enforced in the write path, not a promise in a deck.</p>
</div><div class=obj><canvas data-motion="lattice"></canvas></div></header>
{rail()}
<section class="stage ground"><div class=w>
  <p class=eyebrow>Architecture</p>
  <h2 class=display style="font-size:clamp(1.9rem,3.6vw,2.8rem)">What Arthur is made of.</h2>
  {spec([(f"0{i+1}", n, d) for i, (n, d) in enumerate(COMPONENTS5)])}
</div></section>
{stage("Bitemporality", "What was true,<br>and what we knew.",
       "Two timelines on every value, which is what makes it possible to ask what was known on a given day rather than what we know now.",
       obj="orbit", ground="sunkbg")}
<section class="stage paperbg"><div class=wide>
  <p class=eyebrow>Connected sources</p>
  <h2 class=display style="font-size:clamp(1.8rem,3.4vw,2.6rem)">Coverage is exactly as wide<br>as the connected sources.</h2>
  <p class=sub>And no wider. A connector that is configured is not a connector that is live.</p>
  <div style="max-width:760px;margin:26px auto 0">{strips([
      ("Stripe &middot; payments", "live", "Financial Connections, balance and customers", "2026-09-21"),
      ("Xero &middot; ledger", "live", "Invoices, contacts, account codes", "2026-09-21"),
      ("Nylas &middot; mail", "live", "Three grants, one stale since 2026-05-28", "2026-09-21"),
      ("ERP &middot; system of record", "configured", "Adapter present, no tenant connected", "2026-09-21"),
      ("Toast &middot; POS", "dormant", "Implemented, not connected", "2026-09-21"),
  ])}</div>
</div></section>
{close("Engagements", "Bring us the question.",
       "Scoped engagements open this quarter. The problem comes first; Arthur is how we get to a defensible answer, not the thing we are selling you.")}
{foot()}"""
    return shell("Arthur &mdash; LOVELEEDAY Studios", body,
                 "Mockup &middot; /arthur &middot; the deep technical page")


def work():
    ops = [("01", "olldae", "SaaS / Restaurant technology", "MVP in 11 days"),
           ("02", "Kronos", "Financial tooling / Multi-entity", "22 routes"),
           ("03", "Hospitality Ops Layer", "Internal systems / Automation", "Core in 3 weeks"),
           ("04", "Duezy", "SaaS / Invoice automation", "7 days to billing"),
           ("05", "Dabney &amp; Co.", "Brand / Hospitality", "3 weeks to production")]
    body = nav("Work") + f"""
<header class=hero style="padding-bottom:clamp(36px,4vw,60px)"><div class=w>
  <h1 class=display style="font-size:clamp(2.6rem,7vw,5rem)">Work.</h1>
  <p class=sub>Two bodies of work, and they are not the same claim.</p>
</div></header>

<section class="stage paperbg" id=studies><div class=wide>
  <p class=eyebrow>Client work</p>
  <h2 class=display style="font-size:clamp(2rem,4.2vw,3rem)">Six rebuilds. None named.</h2>
  <p class=sub>Uncommissioned direction studies of real companies. Each carries measured criticism of the site it replaces, so the identities stay behind the work.</p>
  <div class=grid>""" + "".join(
      f'<div class=wcard><div class=shot>'
      f'<img src="../../../public{s["frame"].split("?")[0]}" alt=""></div>'
      f'<div class=b><span class=k>{s["id"]} &middot; {s["sector"]}</span>'
      f'<p>{s["thesis"]}</p></div></div>' for s in STUDIES) + f"""
  </div>
</div></section>

<!-- A DIFFERENT REGISTER, DELIBERATELY. A card beside a card reads as the same
     kind of thing. These are companies we own; the ones above are companies
     that are not ours. The distinction is a page template and a stated
     sentence, not a badge in the corner of a card. -->
<section class="stage ground" id=operated><div class=wide>
  <p class=eyebrow>Owned and operated</p>
  <h2 class=display style="font-size:clamp(2rem,4.2vw,3rem)">We were the first customer.</h2>
  <p class=owned>These five are companies LOVELEEDAY owns and runs. They are listed as
  evidence that the studio ships &mdash; not as client engagements. We were our own
  customer on every one of them.</p>
  <div class=ledger>""" + "".join(
      f'<div class=r><div class=i>{i}</div><div><b>{n}</b></div>'
      f'<div><p>{c}</p></div><div class=t>{s}</div></div>' for i, n, c, s in ops) + """
  </div>
</div></section>
""" + close("Start", "Bring us the question.",
            "We reply the same week, with a plan or with a reason it is not a fit.") + foot()
    return shell("Work &mdash; LOVELEEDAY Studios", body,
                 "Mockup &middot; /work &middot; two registers, never one grid")


def about():
    body = nav("Company") + f"""
<header class=hero style="padding-bottom:clamp(30px,3.4vw,50px)"><div class=w>
  <h1 class=display style="font-size:clamp(2.4rem,6vw,4.4rem)">A practice, not an agency.</h1>
  <p class=sub>Founded by Daniel J. May. Five companies owned and run, six rebuilds shipped, one standard applied to all of it.</p>
</div></header>
{metric_band(FIGURES)}
<section class="stage ground"><div class=w>
  <p class=eyebrow>How engagements run</p>
  <h2 class=display style="font-size:clamp(1.8rem,3.4vw,2.6rem)">You watch the build,<br>not just the invoice.</h2>
  {spec([
    ("01", "The question first", "We start in the actual queue or inbox, not in a workshop. A form is not a design problem until we can say which fields change what anybody does next."),
    ("02", "Ship, then iterate", "A narrow first version that does one thing, in production, paid for by the people already using it."),
    ("03", "A private review page", "Every engagement ships through a token-gated page where you see the work as it lands. No login, no index, and the URL is the credential."),
    ("04", "Figures name their source", "Any number we give you can be traced to the system it came from, or we do not print it."),
  ])}
</div></section>
{photo_stage("The studio", "Kalamazoo, Michigan.", "../../micruity/x_office.jpg")}
{close("Contact", "Tell us what is costing<br>you an hour a day.", "We reply the same week.")}
{foot()}"""
    return shell("Company &mdash; LOVELEEDAY Studios", body,
                 "Mockup &middot; /about &middot; the portal named, never linked")


def contact():
    body = nav("Contact") + f"""
<header class=hero style="padding-bottom:clamp(40px,5vw,70px)"><div class=w>
  <h1 class=display style="font-size:clamp(2.4rem,6vw,4.4rem)">Start a project.</h1>
  <p class=sub>Tell us the question. We reply the same week, with a plan or with a reason it is not a fit.</p>
</div></header>
<section class="stage ground" style="padding-top:0"><div class=w style="max-width:680px">
  <form style="text-align:left;display:grid;gap:18px">
    {"".join(f'''<label style="display:grid;gap:7px">
      <span class=eyebrow>{l}</span>
      <input style="border:0;border-bottom:1px solid {T['line2']};background:transparent;
        padding:11px 2px;font:400 16px/1 'Mulish',sans-serif;color:{T['ink']}" readonly></label>'''
      for l in ["Your name", "Email", "Company", "Budget range"])}
    <label style="display:grid;gap:7px"><span class=eyebrow>What is costing you an hour a day</span>
      <textarea rows=5 style="border:1px solid {T['line2']};background:{T['paper']};
        padding:13px;font:400 15px/1.6 'Mulish',sans-serif;color:{T['ink']}" readonly></textarea></label>
    <div><span class=btn>Send project brief</span></div>
  </form>
</div></section>
{foot()}"""
    return shell("Contact &mdash; LOVELEEDAY Studios", body,
                 "Mockup &middot; /contact &middot; the funnel destination", motion=False)


def legal(kind):
    body = nav("") + f"""
<header class=hero style="padding-bottom:clamp(30px,3.4vw,48px)"><div class=w>
  <h1 class=display style="font-size:clamp(2rem,5vw,3.4rem)">{kind}.</h1>
  <p class=sub>A real page, because the footer links to it. A dead trust link on a site whose
  argument is that every value carries a trail is self-refuting.</p>
</div></header>
<section class="stage ground" style="padding-top:0"><div class=w style="max-width:70ch;text-align:left">
  <p style="color:{T['mid']}">Placeholder body. This route exists in the mockup so the footer is
  honest; the copy is a legal question, not a design one.</p>
</div></section>
{foot()}"""
    return shell(f"{kind} &mdash; LOVELEEDAY Studios", body,
                 f"Mockup &middot; /{kind.lower()} &middot; exists because the footer links to it",
                 motion=False)


def _ratio(a, b):
    def lin(c):
        c = c / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    def L(h):
        h = h.lstrip('#'); r, g, bl = (int(h[i:i+2], 16) for i in (0, 2, 4))
        return .2126*lin(r) + .7152*lin(g) + .0722*lin(bl)
    la, lb = L(a), L(b); hi, lo = max(la, lb), min(la, lb)
    return (hi + .05) / (lo + .05)


def system():
    """The specimen sheet. It imports the same functions the pages import, so a
       component cannot be documented here and be different there."""
    grounds = [("ground", T['ground']), ("paper", T['paper']), ("sunk", T['sunk'])]
    roles = [("ink", T['ink']), ("mid", T['mid']), ("dim", T['dim']),
             ("teal", T['teal']), ("copper", T['copper'])]
    head = "".join(f"<th>{n}<br><span style='font-weight:400'>{v}</span></th>"
                   for n, v in grounds)
    rows = ""
    for rn, rv in roles:
        cells = ""
        for _, gv in grounds:
            r = _ratio(rv, gv)
            ok = "" if r >= 4.5 else f";color:{T['copper']};font-weight:700"
            cells += (f"<td style='background:{gv};color:{rv};text-align:center'>"
                      f"<span style='font:600 15px Manrope'>Aa</span><br>"
                      f"<span style='font:400 11px \"IBM Plex Mono\",monospace{ok}'>"
                      f"{r:.2f}:1</span></td>")
        rows += (f"<tr><td style='font:600 13px Manrope'>--{rn}<br>"
                 f"<span style='font:400 11px \"IBM Plex Mono\",monospace;color:{T['dim']}'>"
                 f"{rv}</span></td>{cells}</tr>")

    scale = "".join(
        f'<div style="border-bottom:1px solid {T["line"]};padding:16px 0;display:grid;'
        f'grid-template-columns:150px 1fr;gap:18px;align-items:baseline">'
        f'<div style="font:400 11px \'IBM Plex Mono\',monospace;color:{T["dim"]}">{n}</div>'
        f'<div style="{s}">{t}</div></div>'
        for n, s, t in [
          ("display / hero", "font:800 clamp(2.6rem,6vw,4.6rem)/.98 Manrope;letter-spacing:-.042em", "Arthur."),
          ("display / stage", "font:800 clamp(1.9rem,3.6vw,2.8rem)/1.02 Manrope;letter-spacing:-.04em", "Four names. One company."),
          ("sub", f"font:400 17px/1.5 Mulish;color:{T['mid']}", "A number without a trail is not reportable."),
          ("body", f"font:400 15px/1.6 Mulish;color:{T['mid']}", "Mulish, for anything you actually read."),
          ("eyebrow", f"font:500 11px/1 'IBM Plex Mono',monospace;letter-spacing:.17em;text-transform:uppercase;color:{T['dim']}", "Identity resolution"),
          ("figure", "font:800 2.4rem/1 Manrope;letter-spacing:-.04em;font-variant-numeric:tabular-nums", "38"),
          ("provenance", f"font:500 11px 'IBM Plex Mono',monospace;color:{T['copper']}", "erp:vendor/4412"),
        ])

    motion_tiles = "".join(
        f'<div style="border:1px solid {T["line"]};background:{T["paper"]}">'
        f'<div style="height:126px"><canvas data-motion="{m}" style="width:100%;height:100%"></canvas></div>'
        f'<div style="padding:9px 12px;font:400 11px \'IBM Plex Mono\',monospace;'
        f'color:{T["dim"]};border-top:1px solid {T["line"]}">{m}{u}</div></div>'
        for m, u in [("lattice", " &middot; hero"), ("bundle", " &middot; identity"),
                     ("series", " &middot; lineage"), ("flow", " &middot; execution"),
                     ("orbit", " &middot; bitemporal"), ("contour", " &middot; measurement"),
                     ("halftone", " &middot; field"), ("prism", " &middot; brand moment")])

    body = f"""
<div class=announce><div class=wide><span>Design system &mdash; the specimen sheet imports the
same functions the pages do</span></div></div>
<header class=hero style="padding-bottom:clamp(30px,3.4vw,50px)"><div class=w>
  <h1 class=display style="font-size:clamp(2.2rem,5.4vw,3.8rem)">The design system.</h1>
  <p class=sub>Not a document about the components. The same code the five pages render from.</p>
</div></header>

<section class="stage paperbg" style="padding:clamp(40px,5vw,66px) 0"><div class=wide>
  <p class=eyebrow>01 &middot; Colour, measured</p>
  <h2 class=display style="font-size:clamp(1.6rem,3vw,2.2rem)">Every role on every ground.</h2>
  <p class=sub style="max-width:66ch">Each cell is the live contrast ratio, computed at build
  time rather than asserted. The third column is why three tokens moved on 2026-09-21: the
  palette had been measured on cream and paper and never on sunk.</p>
  <table style="width:100%;border-collapse:collapse;margin-top:24px;text-align:left;
    font:400 12px 'IBM Plex Mono',monospace">
    <thead><tr><th></th>{head}</tr></thead><tbody>{rows}</tbody></table>
</div></section>

<section class="stage ground" style="padding:clamp(40px,5vw,66px) 0"><div class=wide>
  <p class=eyebrow>02 &middot; Type</p>
  <h2 class=display style="font-size:clamp(1.6rem,3vw,2.2rem)">Three faces, seven roles.</h2>
  <div style="text-align:left;margin-top:22px">{scale}</div>
</div></section>

<section class="stage paperbg" style="padding:clamp(40px,5vw,66px) 0"><div class=wide>
  <p class=eyebrow>03 &middot; Stage types</p>
  <h2 class=display style="font-size:clamp(1.6rem,3vw,2.2rem)">Four, and the rule for each.</h2>
  <div class=grid style="margin-top:24px">
    <div style="border:1px solid {T['line']}">{stage("Object stage", "One mechanism.", "Always light. Never two mechanics in one stage.", obj="bundle", ground="sunkbg")}</div>
    <div style="border:1px solid {T['line']}">{photo_stage("Photographic stage", "One claim about the world.", "../../janta/value-dsr-campus.jpg")}</div>
    <div style="border:1px solid {T['line']}"><section class="stage deepbg" style="padding:44px 0">
      <div class=w><p class=eyebrow>Data stage</p><h2 class=display style="font-size:1.7rem">The numbers are the object.</h2>
      {metric_band(FIGURES[:2], onlight=False)}</div></section></div>
    <div style="border:1px solid {T['line']}"><section class="stage paperbg" style="padding:44px 0">
      <div class=w style="max-width:720px"><p class=eyebrow>Quote stage</p>
      <p style="font:600 clamp(1.2rem,2.4vw,1.6rem)/1.24 Manrope;letter-spacing:-.02em;margin:14px 0 0">
      If there is no real sourced quote, the stage is omitted rather than filled.</p>
      <div style="margin-top:14px"><span class=chip>rule:no-fabrication</span></div></div></section></div>
  </div>
</div></section>

<section class="stage ground" style="padding:clamp(40px,5vw,66px) 0"><div class=wide>
  <p class=eyebrow>04 &middot; Evidence components</p>
  <h2 class=display style="font-size:clamp(1.6rem,3vw,2.2rem)">The parts that carry proof.</h2>
  <div style="text-align:left;max-width:900px;margin:24px auto 0">
    <p class=eyebrow style="margin-bottom:6px">LineageRow &mdash; last row shows the required unsourced state</p>
    {lineage([("net_terms","45 days","erp:vendor/4412","2026-09-18"),
              ("spend_ytd","$412,880","stripe:bal_tx","2026-09-20"),
              ("risk_tier","B","","2026-09-21")])}
    <p class=eyebrow style="margin:28px 0 6px">StatusStrip &mdash; checkedAt is required, not optional</p>
    {strips([("Stripe","live","Financial Connections","2026-09-21"),
             ("ERP","configured","Adapter present, no tenant","2026-09-21"),
             ("Toast","dormant","Implemented, not connected","2026-09-21")])}
    <p class=eyebrow style="margin:28px 0 6px">MetricBand &mdash; every caption names its source</p>
    {metric_band(FIGURES)}
    <p class=eyebrow style="margin:28px 0 10px">ProvenanceChip &mdash; always the literal reference</p>
    <div style="display:flex;gap:9px;flex-wrap:wrap">
      <span class=chip>erp:vendor/4412</span><span class=chip>doc:invoice_8841.pdf</span>
      <span class=chip>stripe:bal_tx</span><span class=chip>model:vendor_risk/v4</span></div>
  </div>
</div></section>

<section class="stage paperbg" style="padding:clamp(40px,5vw,66px) 0"><div class=wide>
  <p class=eyebrow>05 &middot; Motion objects</p>
  <h2 class=display style="font-size:clamp(1.6rem,3vw,2.2rem)">Eight of the ten, in use.</h2>
  <div style="display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
    margin-top:24px">{motion_tiles}</div>
</div></section>

<section class="stage ground" style="padding:clamp(40px,5vw,66px) 0"><div class=wide>
  <p class=eyebrow>06 &middot; Product marks</p>
  <h2 class=display style="font-size:clamp(1.6rem,3vw,2.2rem)">One per component.</h2>
</div>{rail()}</section>
{foot()}"""
    return shell("Design system &mdash; LOVELEEDAY", body,
                 "Design system &middot; rendered from the same code as the pages")


PAGES = {
    "home.html": home, "arthur.html": arthur, "work.html": work,
    "about.html": about, "contact.html": contact,
    "privacy.html": lambda: legal("Privacy"), "terms.html": lambda: legal("Terms"),
    "system.html": system,
}

if __name__ == "__main__":
    for name, fn in PAGES.items():
        (OUT / name).write_text(fn())
        print("wrote site/" + name)
