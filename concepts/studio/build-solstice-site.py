#!/usr/bin/env python3
"""The whole site in Solstice, built on the live site's own content.

     python3 concepts/studio/build-solstice-site.py
       -> concepts/studio/solstice-site/*.html

   Daniel picked concept 12 with hero G on the homepage and H on /about, and
   said to piggyback off the current landing page "which has all the needed
   details for everything that should be included". So nothing here is written
   fresh: the guarantees, the five components, the applications block, the FAQ,
   the five principles, the project types, the budget bands, the navigation
   labels, the footer columns and the tagline all come out of
   live-content.json, which extract-live.py reads straight from src/.

   TWO HEROES, TWO CLAIMS. G is two backlit figures -- people present, no face
   competing with the headline -- and it opens the homepage because the first
   impression has to read as scale. H is one maker under a lamp, and it opens
   /about because that is where the discipline argument lives and a single
   person at a bench is the right picture for it. A single maker as the FIRST
   thing a visitor sees would undercut the size the homepage is claiming.

   BOTH ARE STOCK, AND THAT IS THE WEAK LINK. On a site whose whole argument is
   that its claims are checkable, the two photographs carrying the brand are the
   two things on it nobody can check. F and J are the only people frames that
   are actually the studio's. G and H are placeholders for a real shoot and the
   footer of every page says so rather than letting it pass quietly.

   The anchors matter: the live footer links to /arthur#ontology,
   /arthur#architecture, /about#method and /work#studies, so those ids exist
   here. A rebuild that drops an anchor breaks a link that already shipped.
"""
import json
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / "solstice-site"
OUT.mkdir(exist_ok=True)
LIVE = json.loads((HERE / "live-content.json").read_text())
CH = LIVE["chrome"]
STUDIES = json.loads(Path("/private/tmp/claude-501/studies.json").read_text()) \
    if Path("/private/tmp/claude-501/studies.json").exists() else []

FIGURES = [("6", "Sites rebuilt in working HTML"), ("38", "Sites measured in that audit"),
           ("5", "Architectural components in Arthur"), ("2", "Timelines carried on every value")]

OPERATED = [
    ("01", "olldae", "SaaS / Restaurant technology", "MVP in 11 days",
     "Next.js &middot; Supabase &middot; Stripe"),
    ("02", "Kronos", "Financial tooling / Multi-entity", "22 routes",
     "Python &middot; Supabase &middot; Fly"),
    ("03", "Hospitality Ops Layer", "Internal systems / Automation", "Core in 3 weeks",
     "Node &middot; Supabase &middot; Resend"),
    ("04", "Duezy", "SaaS / Invoice automation", "7 days to billing",
     "Next.js &middot; Supabase &middot; Stripe"),
    ("05", "Dabney &amp; Co.", "Brand / Hospitality", "3 weeks to production",
     "Next.js &middot; OpenTable API"),
]

FONTS = ("https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700&"
         "family=Instrument+Serif:ital@0;1&display=swap")

# The two heroes, with the grades and scrims that were measured on the rendered
# pixels in the variation set -- G cleared 5.64:1 and H 7.79:1 on the headline.
HEROES = {
    "g": ("pair-sunset.jpg",
          "linear-gradient(168deg,rgba(255,176,64,.24) 0%,rgba(230,96,28,.34) 48%,rgba(104,24,8,.52) 100%)",
          "linear-gradient(96deg,rgba(34,10,4,.84) 0%,rgba(34,10,4,.52) 48%,rgba(34,10,4,.12) 100%)",
          "62% 50%"),
    "h": ("bench-lamp.jpg",
          "linear-gradient(168deg,rgba(255,182,72,.18) 0%,rgba(226,100,32,.28) 48%,rgba(102,26,10,.46) 100%)",
          "linear-gradient(96deg,rgba(32,10,4,.88) 0%,rgba(32,10,4,.58) 48%,rgba(32,10,4,.16) 100%)",
          "70% 46%"),
}

ROUTES = {"/": "home.html", "/work": "work.html", "/about": "about.html",
          "/arthur": "arthur.html", "/contact": "contact.html"}


def href(h):
    """Turn a live route into a mockup filename, keeping any anchor."""
    if h.startswith("mailto:") or h.startswith("http"):
        return h
    base, _, frag = h.partition("#")
    f = ROUTES.get(base or "/", "home.html")
    return f + ("#" + frag if frag else "")


CSS = """
*,*::before,*::after{box-sizing:border-box}
:root{--ink:#241109;--bone:#FBF6EE;--paper:#FFFFFF;--mu:#6B5A4E;--dim:#8B7868;
  --line:#E4D9C9;--hot:#C8410F;--deep:#2A0F07;--on-deep:#F6E9DB;--on-deep-mu:#C4A996;
  --deep-line:#48210F}
body{margin:0;background:var(--bone);color:var(--ink);
  font:400 17px/1.62 'Inter Tight',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
.w{max-width:1240px;margin:0 auto;padding:0 clamp(20px,3vw,44px)}
.ser{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400}
.eyebrow{font:500 12px/1 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;color:var(--hot)}
.ribbon{position:sticky;top:0;z-index:99;background:var(--ink);color:var(--bone);
  font:500 11px/1 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;
  padding:9px 18px}

/* ── navigation: two rows, because the live site has two ─────────────────── */
.nav1{background:var(--bone);border-bottom:1px solid var(--line)}
.nav1 .w{display:flex;align-items:center;height:62px;gap:28px}
.nav1 .bd{font:600 17px/1 'Inter Tight';letter-spacing:-.03em}
.nav1 .lk{display:flex;gap:24px;font:500 13.5px/1 'Inter Tight';color:var(--mu)}
.nav1 .lk a.on{color:var(--ink)}
.nav1 .rt{margin-left:auto;display:flex;gap:10px}
.nav1 .btn{border:1px solid var(--line);border-radius:6px;padding:8px 15px;
  font:600 13px/1 'Inter Tight'}
.nav1 .btn.solid{background:var(--ink);color:var(--bone);border-color:var(--ink)}
.nav2{background:var(--paper);border-bottom:1px solid var(--line)}
.nav2 .w{display:flex;gap:26px;align-items:center;height:44px;overflow-x:auto;
  font:500 12.5px/1 'Inter Tight';color:var(--mu)}
.nav2 a.on{color:var(--ink);font-weight:600}
/* on a photographic hero the bars float over the picture */
.over .nav1,.over .nav2{background:transparent;border-bottom-color:transparent;
  position:relative;z-index:6}
.over .nav1 .bd,.over .nav1 .lk,.over .nav1 .lk a.on,.over .nav2 .w,.over .nav2 a.on{color:#FFF4E2}
.over .nav1 .btn{border-color:rgba(255,244,226,.6);color:#FFF4E2}
.over .nav1 .btn.solid{background:#FFF4E2;color:#7A1A0A;border-color:#FFF4E2}

/* ── photographic hero ──────────────────────────────────────────────────── */
.sky{position:relative;overflow:hidden;isolation:isolate}
.sky .shot{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-3}
.sky .grade{position:absolute;inset:0;z-index:-2;mix-blend-mode:multiply}
.sky .scrim{position:absolute;inset:0;z-index:-1}
.sky .body{position:relative;z-index:4;padding:clamp(72px,10vw,150px) 0 clamp(60px,8vw,120px)}
.sky h1{font:300 clamp(2.7rem,6.2vw,5.1rem)/1.04 'Inter Tight';letter-spacing:-.045em;
  color:#FFF8EE;margin:0;max-width:16ch}
.sky p{margin:24px 0 0;max-width:46ch;color:#FBEFE1;font-size:18px}
.sky .acts{margin-top:30px;display:flex;gap:20px;align-items:center;
  font:500 15px/1 'Inter Tight';color:#FFF8EE}
.sky .acts a{border-bottom:1px solid rgba(255,248,238,.6);padding-bottom:5px}

/* ── plain page head, for routes with no photograph ─────────────────────── */
.head{padding:clamp(52px,7vw,96px) 0 clamp(26px,3vw,44px)}
.head h1{font:300 clamp(2.4rem,5.4vw,4.2rem)/1.05 'Inter Tight';letter-spacing:-.045em;margin:0;
  max-width:18ch}
.head p{margin:22px 0 0;max-width:52ch;color:var(--mu);font-size:18px}

.logos{background:var(--bone);border-bottom:1px solid var(--line)}
.logos .w{display:flex;align-items:center;justify-content:space-between;gap:26px;
  height:100px;overflow-x:auto}
.logos span{font:600 17px/1 'Inter Tight';color:#9C8B7C;white-space:nowrap;letter-spacing:-.02em}

section{padding:clamp(52px,6.5vw,96px) 0}
section.wash{background:var(--paper);border-block:1px solid var(--line)}
h2{font:300 clamp(2rem,4vw,3.1rem)/1.08 'Inter Tight';letter-spacing:-.04em;margin:16px 0 0;
  max-width:20ch}
.lede{margin:20px 0 0;max-width:62ch;color:var(--mu)}

/* ── numbered spec list, the register the live site already uses ─────────── */
.spec{margin-top:34px;border-top:1px solid var(--ink)}
.spec .r{display:grid;gap:18px;padding:19px 0;border-bottom:1px solid var(--line);align-items:baseline}
@media(min-width:840px){.spec .r{grid-template-columns:58px 1fr 1.5fr}}
.spec .n{font:500 12.5px/1 'Inter Tight';letter-spacing:.14em;color:var(--hot)}
.spec b{font:500 20px/1.22 'Inter Tight';letter-spacing:-.03em}
.spec p{margin:0;font-size:15px;color:var(--mu);line-height:1.6}

.cards{display:grid;gap:20px;margin-top:38px}
@media(min-width:840px){.cards{grid-template-columns:repeat(3,1fr)}}
.card{border:1px solid var(--line);background:var(--paper);border-radius:14px;
  padding:26px 24px 30px}
.card .n{font:500 12px/1 'Inter Tight';letter-spacing:.16em;color:var(--hot)}
.card b{display:block;margin:13px 0 0;font:500 19px/1.2 'Inter Tight';letter-spacing:-.03em}
.card p{margin:10px 0 0;font-size:15px;line-height:1.6;color:var(--mu)}

.metrics{display:grid;grid-template-columns:repeat(4,1fr);margin-top:36px;
  border-top:1px solid var(--line)}
.metrics div{padding:24px 12px;border-right:1px solid var(--line)}
.metrics div:last-child{border-right:0}
.metrics b{display:block;font:300 clamp(2.1rem,3.8vw,3.2rem)/1 'Inter Tight';
  letter-spacing:-.04em;font-variant-numeric:tabular-nums}
.metrics span{display:block;margin-top:9px;font-size:13px;color:var(--dim);line-height:1.45}
@media(max-width:700px){.metrics{grid-template-columns:repeat(2,1fr)}}

/* work: two registers, never one grid */
.wgrid{display:grid;gap:20px;margin-top:36px}
@media(min-width:800px){.wgrid{grid-template-columns:1fr 1fr}}
.wcard{background:var(--paper);border:1px solid var(--line);border-radius:14px;overflow:hidden}
.wcard .shot{height:clamp(180px,16vw,226px);overflow:hidden;background:var(--line)}
.wcard .shot img{width:100%;height:100%;object-fit:cover;object-position:top}
.wcard .b{padding:20px 22px 24px}
.wcard .k{font:500 11px/1 'Inter Tight';letter-spacing:.16em;text-transform:uppercase;color:var(--hot)}
.wcard p{margin:11px 0 0;font-size:14.5px;line-height:1.6;color:var(--mu)}
.ledger{margin-top:32px;border-top:1px solid var(--ink)}
.ledger .r{display:grid;gap:14px;padding:18px 0;border-bottom:1px solid var(--line)}
@media(min-width:840px){.ledger .r{grid-template-columns:48px 200px 1fr 160px}}
.ledger .i{font:500 12px/1 'Inter Tight';color:var(--hot)}
.ledger b{font:500 18px/1.2 'Inter Tight';letter-spacing:-.03em}
.ledger p{margin:0;font-size:14.5px;color:var(--mu)}
.ledger .t{font:400 12.5px/1.5 ui-monospace,monospace;color:var(--dim)}
.note{max-width:66ch;margin:16px 0 0;color:var(--mu);font-size:15.5px}

/* faq + applications + form, ported from the live pages */
.faq{margin-top:32px;border-top:1px solid var(--ink)}
.faq details{border-bottom:1px solid var(--line)}
.faq summary{cursor:pointer;list-style:none;padding:18px 0;font:500 19px/1.3 'Inter Tight';
  letter-spacing:-.025em;display:flex;justify-content:space-between;gap:18px}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";color:var(--hot)}
.faq details[open] summary::after{content:"–"}
.faq p{margin:0 0 20px;color:var(--mu);font-size:15.5px;line-height:1.65;max-width:74ch}
.app{background:var(--paper);border:1px solid var(--line);border-radius:14px;
  padding:30px 30px 34px;margin-top:34px}
.app .k{font:500 11px/1 'Inter Tight';letter-spacing:.16em;text-transform:uppercase;color:var(--hot)}
.app .q{margin:14px 0 0;font:400 clamp(1.3rem,2.4vw,1.8rem)/1.28 'Inter Tight';letter-spacing:-.03em}
.app .bd{margin:12px 0 0;color:var(--mu)}
.app ul{margin:20px 0 0;padding:0;list-style:none;display:grid;gap:10px}
@media(min-width:680px){.app ul{grid-template-columns:1fr 1fr}}
.app li{font-size:14.5px;color:var(--mu);padding-left:18px;position:relative}
.app li::before{content:"";position:absolute;left:0;top:9px;width:7px;height:7px;background:var(--hot)}
.form{display:grid;gap:20px;max-width:720px;margin-top:34px}
.pair{display:grid;gap:20px;grid-template-columns:1fr 1fr}
.fld{display:grid;gap:7px}
.fld input,.fld select,.fld textarea{border:1px solid var(--line);background:var(--paper);
  padding:13px 14px;font:400 16px/1.5 'Inter Tight';color:var(--ink);border-radius:8px;
  -webkit-appearance:none;appearance:none}
.next{margin-top:32px;border-top:1px solid var(--ink)}
.next .r{display:grid;grid-template-columns:48px 1fr;gap:16px;padding:17px 0;
  border-bottom:1px solid var(--line)}
.next .i{font:500 12.5px/1.6 'Inter Tight';color:var(--hot)}
.next b{display:block;font:500 17px/1.25 'Inter Tight';letter-spacing:-.025em}
.next p{margin:5px 0 0;font-size:14.5px;color:var(--mu)}

.btn{display:inline-block;background:var(--ink);color:var(--bone);border-radius:999px;
  padding:13px 28px;font:500 15px/1 'Inter Tight'}
.close{padding:clamp(60px,8vw,116px) 0;background:var(--paper);border-top:1px solid var(--line)}
.close h2{max-width:none}

/* ── footer: the live three columns, on a deep ground ────────────────────── */
footer{background:var(--deep);color:var(--on-deep);padding:clamp(48px,6vw,80px) 0 44px}
.fgrid{display:grid;gap:40px;padding-bottom:40px;border-bottom:1px solid var(--deep-line)}
@media(min-width:800px){.fgrid{grid-template-columns:1.4fr repeat(3,1fr)}}
.fbrand b{font:600 15px/1 'Inter Tight'}
.fbrand b span{color:var(--on-deep-mu)}
.fbrand p{margin:16px 0 0;max-width:30ch;font-size:14.5px;line-height:1.55;color:var(--on-deep-mu)}
.fbrand .city{margin-top:22px;font:500 11px/1 'Inter Tight';letter-spacing:.2em;
  text-transform:uppercase;color:#9C8474}
.fcol h3{font:500 11px/1 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;
  color:#9C8474;margin:0}
.fcol ul{list-style:none;margin:18px 0 0;padding:0;display:grid;gap:12px}
.fcol a{font-size:14.5px;color:var(--on-deep-mu)}
.fbase{padding-top:26px;display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;
  font-size:13px;color:#9C8474}
.fnote{margin-top:16px;font:400 12px/1.65 ui-monospace,monospace;color:#8A7060;max-width:80ch}
"""


def nav(active, over=False):
    prim = [i for i in CH["nav"] if i[1] in ("/work", "/about")]
    sec = [i for i in CH["nav"] if i not in prim]
    p = "".join(f'<a href="{href(h)}"{" class=on" if l == active else ""}>{l}</a>' for l, h in prim)
    s = "".join(f'<a href="{href(h)}"{" class=on" if l == active else ""}>{l}</a>' for l, h in sec)
    return (f'<nav class=nav1><div class=w><a class=bd href="home.html">LOVELEEDAY</a>'
            f'<span class=lk>{p}</span>'
            f'<span class=rt><a class=btn href="contact.html">Contact sales</a>'
            f'<a class="btn solid" href="contact.html">Start a project</a></span></div></nav>'
            f'<nav class=nav2><div class=w>{s}</div></nav>')


def footer(photo_note=True):
    cols = ""
    for col in CH["footer"]:
        links = "".join(f'<li><a href="{href(h)}">{l}</a></li>' for l, h in col["links"])
        cols += f'<div class=fcol><h3>{col["title"]}</h3><ul>{links}</ul></div>'
    note = ("<p class=fnote>Concept mockup. The two photographs carrying this brand are "
            "stock and are placeholders for a real shoot &mdash; on a site whose argument is "
            "that its claims are checkable, they are the two things on it nobody can check. "
            "Every figure names its source.</p>") if photo_note else ""
    return (f'<footer><div class=w><div class=fgrid>'
            f'<div class=fbrand><b>LOVELEEDAY<span> Studios</span></b>'
            f'<p>{CH["tagline"]}</p><div class=city>{CH["city"]}</div></div>{cols}</div>'
            f'<div class=fbase><span>&copy; 2026 LOVELEEDAY Studios</span>'
            f'<span>{CH["city"]}</span></div>{note}</div></footer>')


def hero(which, h1, sub, acts, active):
    photo, grade, scrim, anchor = HEROES[which]
    a = "".join(f'<a href="{href(h)}">{t} &rarr;</a>' for t, h in acts)
    return (f'<div class="sky over">'
            f'<img class=shot style="object-position:{anchor}" '
            f'src="../../../public/studio/solstice/{photo}" alt="">'
            f'<div class=grade style="background:{grade}"></div>'
            f'<div class=scrim style="background:{scrim}"></div>'
            f'{nav(active, over=True)}'
            f'<div class=body><div class=w><h1>{h1}</h1><p>{sub}</p>'
            f'<div class=acts>{a}</div></div></div></div>')


def shell(title, body, ribbon):
    return f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>{title}</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="{FONTS}" rel=stylesheet>
<style>{CSS}</style></head><body>
<div class=ribbon>{ribbon}</div>
{body}
</body></html>"""


def spec(rows):
    return ('<div class=spec>' + "".join(
        f'<div class=r><div class=n>{n}</div><div><b>{t}</b></div><div><p>{d}</p></div></div>'
        for n, t, d in rows) + '</div>')


def metrics(items):
    return ('<div class=metrics>' + "".join(
        f'<div><b>{k}</b><span>{v}</span></div>' for k, v in items) + '</div>')


def logos():
    names = ["olldae", "Kronos", "Duezy", "Dabney &amp; Co.", "Ops Layer", "Arthur"]
    return ('<div class=logos><div class=w>' +
            "".join(f'<span>{n}</span>' for n in names) + '</div></div>')


def close(head, sub):
    return (f'<section class=close><div class=w><p class=eyebrow>Start</p>'
            f'<h2>{head}</h2><p class=lede>{sub}</p>'
            f'<p style="margin-top:26px"><a class=btn href="contact.html">Start a project</a></p>'
            f'</div></section>')


# ===========================================================================
# The five routes
# ===========================================================================

def home():
    g = LIVE["guarantees"]
    cards = "".join(
        f'<a class=wcard href="work.html"><div class=shot>'
        f'<img src="../../../public{s["frame"].split("?")[0]}" alt=""></div>'
        f'<div class=b><span class=k>{s["sector"]}</span><p>{s["thesis"]}</p></div></a>'
        for s in STUDIES[:4])
    body = hero("g",
                'Intelligence <span class=ser>you can trace.</span>',
                "We build the systems other people describe &mdash; and every figure they "
                "produce names the place it came from.",
                [("Get in touch", "/contact"), ("See the platform", "/arthur")],
                "") + logos() + f"""
<section><div class=w>
  <p class=eyebrow>The guarantees</p>
  <h2>Five properties. <span class=ser>Enforced,</span> not promised.</h2>
  <p class=lede>Each one is a rule in the write path rather than a promise in a deck.</p>
  {spec([(r[0], r[1], r[2]) for r in g])}
</div></section>

<section class=wash><div class=w>
  <p class=eyebrow>In production</p>
  <h2>Built. Shipped. <span class=ser>Running.</span></h2>
  {metrics(FIGURES)}
</div></section>

<section id=studies><div class=w>
  <p class=eyebrow>Selected work</p>
  <h2>Thirty-eight sites. <span class=ser>Six rebuilds.</span></h2>
  <p class=lede>Rebuilt as running pages rather than described in a deck. Companies that are
  not ours, and not named here.</p>
  <div class=wgrid>{cards}</div>
</div></section>
""" + close('See the question. <span class=ser>Build the answer.</span>',
            "Tell us what is slowing you down. We reply the same week, with a plan or with a "
            "reason it is not a fit.") + footer()
    return shell("LOVELEEDAY Studios &mdash; the object layer for the business you already run",
                 body, "Solstice &middot; home &middot; hero G, two against the light")


def arthur():
    comp = [(f"0{i+1}", c.get("title", ""), c.get("body", ""))
            for i, c in enumerate(LIVE["components"])]
    apps = ""
    for i, a in enumerate(LIVE["applications"]):
        pr = LIVE["app_produces"][i] if i < len(LIVE["app_produces"]) else []
        apps += (f'<div class=app><span class=k>{a.get("tag","")}</span>'
                 f'<p class=q>{a.get("question","")}</p>'
                 f'<p class=bd>{a.get("body","")}</p>'
                 f'<ul>{"".join(f"<li>{x}</li>" for x in pr)}</ul></div>')
    faq = "".join(
        f'<details{" open" if i == 0 else ""}><summary>{q["q"]}</summary><p>{q["a"]}</p></details>'
        for i, q in enumerate(LIVE["faq"]))
    body = nav("Arthur Platform") + f"""
<header class=head><div class=w>
  <p class=eyebrow>Arthur</p>
  <h1>Built to connect. <span class=ser>Designed to act.</span></h1>
  <p>Five components. Each one is a rule enforced in the write path, not a promise in a deck.</p>
</div></header>

<section id=architecture><div class=w>
  <p class=eyebrow>Architecture</p>
  <h2>What Arthur is <span class=ser>made of.</span></h2>
  {spec(comp)}
</div></section>

<section class=wash id=ontology><div class=w>
  <p class=eyebrow>The ontology</p>
  <h2>Four names. <span class=ser>One company.</span></h2>
  <p class=lede>A payments customer, a vendor id in the ledger and a string in an email
  signature are three records and one company. Coverage is exactly as wide as the connected
  sources, and no wider.</p>
  {metrics([("2", "Timelines on every value"), ("5", "Architectural components"),
            ("0", "Values written without a source"), ("100%", "Work closed on observed proof")])}
</div></section>

<section><div class=w>
  <p class=eyebrow>Applications</p>
  <h2>The applications <span class=ser>are the point.</span></h2>
  {apps}
</div></section>

<section class=wash><div class=w>
  <p class=eyebrow>FAQ</p>
  <h2>Good questions <span class=ser>are welcome.</span></h2>
  <div class=faq>{faq}</div>
</div></section>
""" + close('Bring us <span class=ser>the question.</span>',
            "Scoped engagements open this quarter. The problem comes first; Arthur is how we "
            "get to a defensible answer, not the thing we are selling you.") + footer()
    return shell("Arthur &mdash; LOVELEEDAY Studios", body,
                 "Solstice &middot; /arthur &middot; components, ontology, applications, FAQ")


def work():
    cards = "".join(
        f'<div class=wcard><div class=shot>'
        f'<img src="../../../public{s["frame"].split("?")[0]}" alt=""></div>'
        f'<div class=b><span class=k>{s["id"]} &middot; {s["sector"]}</span>'
        f'<p>{s["thesis"]}</p></div></div>' for s in STUDIES)
    led = "".join(
        f'<div class=r><div class=i>{i}</div><div><b>{n}</b></div>'
        f'<div><p>{c}</p></div><div class=t>{s}<br>{k}</div></div>'
        for i, n, c, s, k in OPERATED)
    body = nav("Work") + f"""
<header class=head><div class=w>
  <p class=eyebrow>Work</p>
  <h1>Shipped, <span class=ser>not proposed.</span></h1>
  <p>Two bodies of work, and they are not the same claim.</p>
</div></header>

<section id=studies><div class=w>
  <p class=eyebrow>Client work</p>
  <h2>Six rebuilds. <span class=ser>None named.</span></h2>
  <p class=lede>Uncommissioned direction studies of real companies. Each carries measured
  criticism of the site it replaces, so the identities stay behind the work.</p>
  <div class=wgrid>{cards}</div>
</div></section>

<section class=wash id=operated><div class=w>
  <p class=eyebrow>Owned and operated</p>
  <h2>Companies we own <span class=ser>and operate.</span></h2>
  <p class=note>These five are companies LOVELEEDAY owns and runs. They are listed as
  evidence that the studio ships &mdash; not as client engagements. We were our own customer
  on every one of them.</p>
  <div class=ledger>{led}</div>
</div></section>
""" + close('Ready to start? <span class=ser>Request a fixed quote.</span>',
            "We reply the same week, with a plan or with a reason it is not a fit.") + footer()
    return shell("Work &mdash; LOVELEEDAY Studios", body,
                 "Solstice &middot; /work &middot; two registers, never one grid")


def about():
    pr = [(r.get("n", ""), r.get("t", ""), r.get("d", "")) for r in LIVE["principles"]]
    body = hero("h",
                'Business judgment. <span class=ser>Built as software.</span>',
                " Five companies owned and run, six rebuilds "
                "shipped, one standard applied to all of it.",
                [("How we scope", "/about#method"), ("See the work", "/work")],
                "Company") + f"""
<section id=method><div class=w>
  <p class=eyebrow>Method</p>
  <h2>Five rules <span class=ser>we do not bend.</span></h2>
  {spec(pr)}
  <p class=note style="margin-top:28px">Every engagement also ships through a private,
  token-gated review page &mdash; you watch the build, not just the invoice. No login and no
  index: the unguessable URL is the credential, which is why it is named here and never
  linked.</p>
</div></section>

<section class=wash><div class=w>
  <p class=eyebrow>How we measure</p>
  <h2>The numbers, <span class=ser>and where they come from.</span></h2>
  {metrics(FIGURES)}
</div></section>
""" + close('Tell us what is <span class=ser>slowing you down.</span>',
            "We reply the same week.") + footer()
    return shell("Company &mdash; LOVELEEDAY Studios", body,
                 "Solstice &middot; /about &middot; hero H, one at the bench")


def contact():
    def fld(label, opts=None, area=False):
        if opts:
            ctl = '<select disabled>' + "".join(f'<option>{o}</option>' for o in opts) + '</select>'
        elif area:
            ctl = '<textarea rows=5 readonly></textarea>'
        else:
            ctl = '<input readonly>'
        return f'<label class=fld><span class=eyebrow>{label}</span>{ctl}</label>'
    body = nav("Start building") + f"""
<header class=head><div class=w>
  <p class=eyebrow>Contact</p>
  <h1>Bring us <span class=ser>the question.</span></h1>
  <p>Tell us what is slowing you down. We reply the same week, with a plan or with a reason
  it is not a fit.</p>
</div></header>

<section style="padding-top:0"><div class=w>
  <form class=form>
    <div class=pair>{fld("Your name")}{fld("Email")}</div>
    <div class=pair>{fld("Company")}{fld("Budget", opts=LIVE["budgets"])}</div>
    {fld("What kind of project", opts=LIVE["project_types"])}
    {fld("What is slowing you down", area=True)}
    <div><span class=btn>Send project brief</span></div>
  </form>
</div></section>

<section class=wash><div class=w>
  <p class=eyebrow>After you send it</p>
  <h2>What happens <span class=ser>next.</span></h2>
  <div class=next>
    <div class=r><div class=i>01</div><div><b>We read it and reply the same week</b>
      <p>With a plan, or with a reason it is not a fit. A studio that only ever says yes is
      telling you something about its pipeline, not about your problem.</p></div></div>
    <div class=r><div class=i>02</div><div><b>A scoped quote, fixed before we start</b>
      <p>We would rather push back on scope before an engagement begins than ask for more
      money mid-build.</p></div></div>
    <div class=r><div class=i>03</div><div><b>A private review page from day one</b>
      <p>Token-gated, no login, not indexed. You watch the build as it lands.</p></div></div>
  </div>
</div></section>
""" + footer()
    return shell("Contact &mdash; LOVELEEDAY Studios", body,
                 "Solstice &middot; /contact &middot; real project types and budget bands")


PAGES = {"home.html": home, "arthur.html": arthur, "work.html": work,
         "about.html": about, "contact.html": contact}

if __name__ == "__main__":
    for name, fn in PAGES.items():
        (OUT / name).write_text(fn())
        print("wrote solstice-site/" + name)
