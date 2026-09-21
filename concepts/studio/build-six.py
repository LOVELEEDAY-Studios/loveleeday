#!/usr/bin/env python3
"""Concepts 05-10 for the studio's own site.

     python3 concepts/studio/build-six.py

   Concepts 01-04 were hand-built and stay as they are. These six are generated
   so that a correction lands in all six at once, and so the harness -- nav,
   shell, footer, the concept slug at the top -- is identical across the set and
   the only thing that varies is the thing being judged.

   THE RULE THE SET IS BUILT ON. Two directions that differ only in palette are
   one direction. So each of these differs in WHAT THE PAGE IS LOOKING AT, and
   carries the type and colour system that that way of looking actually implies
   -- because Daniel asked for colour and typography concepts too, and a
   palette shown on a swatch card is not a concept, it is a paint chip.

   Every ground is LIGHT. Dark was rejected on 2026-09-21 ("i dont like the use
   of dark colors it feels werid"), so no concept here is dark-first; the two
   that use a dark stage cut to it once, the way apple.com does.

   Nothing is stock. Every object is inline SVG drawn from the real numbers in
   src/content/work.ts, which is also why the copy is real: five operated
   companies, six client rebuilds that stay unnamed on a public page.
"""
from pathlib import Path

HERE = Path(__file__).parent

FONTS = ("https://fonts.googleapis.com/css2?"
         "family=Manrope:wght@400;500;600;700;800&"
         "family=Mulish:wght@400;500;600&"
         "family=IBM+Plex+Mono:wght@400;500&"
         "family=Instrument+Serif:ital@0;1&"
         "family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap")

# The five companies LOVELEEDAY owns and runs, from src/content/work.ts.
OPERATED = [
    ("01", "olldae",              "SaaS / Restaurant technology",   "MVP 11 days",  "Next.js · Supabase · Stripe"),
    ("02", "Kronos",              "Financial tooling / Multi-entity","Live",         "Python · Supabase · Fly"),
    ("03", "Hospitality Ops Layer","Internal systems / Automation",  "Core 3 weeks", "Node · Supabase · Resend"),
    ("04", "Duezy",               "SaaS / Invoice automation",       "Live",         "Next.js · Supabase · Stripe"),
    ("05", "Dabney & Co.",        "Brand / Hospitality",             "3 weeks",      "Next.js · OpenTable API"),
]

CAPABILITIES = [
    ("Platform", ["Multi-tenant SaaS", "Billing and metering", "Auth and roles",
                  "Edge functions", "Job scheduling", "Audit trails"]),
    ("Data",     ["Ingestion pipelines", "Entity resolution", "Bitemporal records",
                  "Vector retrieval", "Reporting layer", "Warehouse sync"]),
    ("Interface",["Design systems", "Marketing sites", "Operator consoles",
                  "Mobile web", "Email systems", "Accessibility audits"]),
    ("Operations",["Deploy pipelines", "Observability", "Incident runbooks",
                  "Cost control", "Vendor integration", "Handover docs"]),
]


# ---------------------------------------------------------------------------
# The shared furniture the first pass did not have.
#
# Daniel, 2026-09-21, on the ten: "i dont see the motion graphics you developed
# ... i dont see any photos ... these hero sections and navigations all look
# boring nothing looks like billion dollar company."
#
# All three were true and they are one failure, not three. A big company's page
# announces its size in the first 200 pixels, and it does it with FURNITURE: a
# utility strip above the nav, a primary row with more items than fit
# comfortably, a section row under it, a search field, two calls to action of
# different weight, and then a hero carrying a real object -- a moving one or a
# photograph -- rather than a sentence on a cream ground.
#
# The ten motion objects had been built and then imported by nothing, which is a
# demo rather than a library. They are now in motion.js and every hero uses one,
# or uses a photograph where the claim is about people.
# ---------------------------------------------------------------------------

def nav(brand_html, items, *, util=None, section=None, ctas=None, search=None,
        cls="nv"):
    """The furniture. `util` is the thin strip above; `section` is the row of
       product sections below -- the single loudest "this is a large product"
       signal on a page, and it costs nothing."""
    u = ""
    if util:
        u = (f'<div class="{cls}-util"><div class=w>'
             + "".join(f'<span>{x}</span>' for x in util) + '</div></div>')
    caret = '<i class=car>&#9662;</i>'
    links = "".join(
        f'<a href="#"{" class=on" if i == 0 else ""}>{t}{caret if d else ""}</a>'
        for i, (t, d) in enumerate(items))
    se = (f'<label class="{cls}-search"><svg width=13 height=13 viewBox="0 0 16 16" '
          f'aria-hidden=true><circle cx=7 cy=7 r=5 fill=none stroke=currentColor '
          f'stroke-width=1.7/><path d="M11 11 15 15" stroke=currentColor '
          f'stroke-width=1.7/></svg><input placeholder="{search}" readonly></label>'
          if search else "")
    c = "".join(f'<a class="btn{" solid" if i else ""}" href="#">{t}</a>'
                for i, t in enumerate(ctas or []))
    sec = ""
    if section:
        sec = (f'<div class="{cls}-sec"><div class=w>'
               + "".join(f'<a href="#"{" class=on" if i == 0 else ""}>{t}</a>'
                         for i, t in enumerate(section)) + '</div></div>')
    return (f'{u}<nav class="{cls}"><div class=w><span class=brand>{brand_html}</span>'
            f'<span class=links>{links}</span>'
            f'<span class=right>{se}{c}</span></div></nav>{sec}')


NAV_CSS = """
.nv-util{background:var(--nv-util-bg,#16243A);color:var(--nv-util-fg,#A9B3C4)}
.nv-util .w{display:flex;gap:22px;align-items:center;height:32px;
  font:400 11px/1 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.03em}
.nv-util span:nth-child(3){margin-left:auto}
.nv{border-bottom:1px solid var(--nv-line,#E6E0D6);background:var(--nv-bg,#fff);
  position:sticky;top:29px;z-index:40;backdrop-filter:blur(10px)}
.nv .w{display:flex;align-items:center;gap:clamp(14px,2.4vw,36px);height:60px}
.nv .brand{font:800 16px/1 'Manrope',system-ui,sans-serif;letter-spacing:-.035em;
  white-space:nowrap}
.nv .links{display:flex;gap:clamp(12px,1.5vw,22px);align-items:center;
  font:600 13px/1 'Manrope',system-ui,sans-serif;color:var(--nv-mid,#45536A);
  white-space:nowrap;overflow:hidden}
.nv .links a.on{color:var(--nv-ink,#16243A)}
.nv .links .car{font-style:normal;font-size:8px;margin-left:4px;opacity:.5;
  position:relative;top:-1px}
.nv .right{margin-left:auto;display:flex;align-items:center;gap:9px}
.nv-search{display:flex;align-items:center;gap:7px;border:1px solid var(--nv-line,#E6E0D6);
  border-radius:6px;padding:7px 11px;color:var(--nv-dim,#667383);background:var(--nv-sf,#FBF8F2)}
.nv-search input{border:0;outline:0;background:transparent;width:clamp(90px,11vw,168px);
  font:400 12.5px/1 'Mulish',sans-serif;color:inherit}
.nv .btn{border:1px solid var(--nv-ink,#16243A);border-radius:6px;padding:8px 14px;
  font:600 12.5px/1 'Manrope',sans-serif;white-space:nowrap;color:var(--nv-ink,#16243A)}
.nv .btn.solid{background:var(--nv-ink,#16243A);color:var(--nv-bg,#fff)}
.nv-sec{border-bottom:1px solid var(--nv-line,#E6E0D6);background:var(--nv-sec-bg,#FBF8F2)}
.nv-sec .w{display:flex;gap:clamp(14px,2vw,28px);align-items:center;height:44px;
  font:500 12.5px/1 'Manrope',sans-serif;color:var(--nv-mid,#45536A);overflow-x:auto}
.nv-sec a.on{color:var(--nv-ink,#16243A);font-weight:700;
  box-shadow:0 14px 0 -12px currentColor}
.stage{position:relative;overflow:hidden}
.stage canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.stage .veil{position:absolute;inset:0}
.stage .w{position:relative;z-index:2}
.shot{position:relative;overflow:hidden}
.shot img{width:100%;height:100%;object-fit:cover;display:block}
"""


def shell(n, name, looks, at, css, body, extra_head=""):
    return f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>Concept {n} &mdash; {name}</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="{FONTS}" rel=stylesheet>{extra_head}
<script src="motion.js"></script>
<style>
*,*::before,*::after{{box-sizing:border-box}}
html{{-webkit-text-size-adjust:100%}}
a{{color:inherit;text-decoration:none}}
img{{display:block;max-width:100%}}
.note{{position:sticky;top:0;z-index:99;background:#16243A;color:#F6F3EC;
  font:500 11px/1 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.13em;
  text-transform:uppercase;padding:9px 18px}}
{NAV_CSS}
{css}
</style></head><body>
<div class=note>Concept {n} of 10 &mdash; &ldquo;{name}&rdquo; &middot; the page looks at {at} &middot; {looks}</div>
{body}
<script>
document.querySelectorAll('canvas[data-motion]').forEach(function(c){{
  LD.hero(c, c.dataset.motion);
}});
</script>
</body></html>"""


# ===========================================================================
# 05 — PROSPECTUS.  Looks at: THE BUSINESS.
# ===========================================================================

C5_CSS = """
:root{--paper:#FBFAF7;--card:#FFFFFF;--ink:#14213D;--mid:#42506B;--dim:#6B7688;
  --line:#E3DFD6;--rule:#14213D;--gold:#8A6A2F;--shell:1240px}
body{margin:0;background:var(--paper);color:var(--ink);
  font:400 15.5px/1.65 'Mulish',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.w{max-width:var(--shell);margin:0 auto;padding:0 clamp(20px,3.6vw,44px)}
.mono{font-family:'IBM Plex Mono',ui-monospace,monospace}
.eyebrow{font:500 10.5px/1 'IBM Plex Mono',monospace;letter-spacing:.19em;
  text-transform:uppercase;color:var(--dim)}
.nv{--nv-bg:#FBFAF7;--nv-line:#E3DFD6;--nv-ink:#14213D;--nv-mid:#42506B;
  --nv-dim:#6B7688;--nv-sf:#FFFFFF;border-bottom:2px solid var(--rule)}
.nv-util{--nv-util-bg:#14213D;--nv-util-fg:#B4BECE}
.nv .brand em{font-style:normal;color:var(--gold)}
.nv .links a.on{color:var(--ink);box-shadow:0 20px 0 -17px var(--gold)}
.nv-sec{--nv-sec-bg:#FFFFFF;--nv-line:#E3DFD6;--nv-mid:#42506B;--nv-ink:#14213D}
.hero{padding:clamp(44px,5vw,74px) 0 clamp(30px,3.4vw,48px)}
.split{display:grid;gap:clamp(28px,4vw,56px);align-items:center}
@media(min-width:960px){.split{grid-template-columns:1.05fr .95fr}}
.fig1{margin:0}
.fig1 .stage{border:1px solid var(--line);background:var(--card)}
.fig1 figcaption{margin-top:12px;font:400 11.5px/1.6 'IBM Plex Mono',monospace;
  color:var(--dim);max-width:46ch}
.band{position:relative;height:clamp(230px,26vw,360px);overflow:hidden;
  border-top:2px solid var(--rule);border-bottom:1px solid var(--line)}
.band img{width:100%;height:100%;object-fit:cover;display:block}
.band .cap{position:absolute;left:0;right:0;bottom:0;padding:22px 0;
  background:linear-gradient(transparent,rgba(20,33,61,.72));color:#fff}
.band .cap .w{font:400 11.5px/1.5 'IBM Plex Mono',monospace;letter-spacing:.09em;
  text-transform:uppercase}
.hero h1{font:400 clamp(2.6rem,5.6vw,4.4rem)/1.04 'Instrument Serif',Georgia,serif;
  letter-spacing:-.018em;margin:18px 0 0;max-width:17ch}
.hero .lede{margin:26px 0 0;max-width:60ch;font-size:17px;color:var(--mid)}
.metrics{border-top:2px solid var(--rule);border-bottom:1px solid var(--line);background:var(--card)}
.metrics .w{display:grid;grid-template-columns:repeat(4,1fr);gap:0}
.metrics .m{padding:26px 0 24px;border-right:1px solid var(--line)}
.metrics .m:last-child{border-right:0}
.metrics .n{font:400 clamp(2rem,3.6vw,3rem)/1 'Instrument Serif',Georgia,serif;letter-spacing:-.01em}
.metrics .n sup{font-size:.42em;color:var(--gold);vertical-align:super}
.metrics .l{margin-top:9px;font:500 10.5px/1.4 'IBM Plex Mono',monospace;
  letter-spacing:.13em;text-transform:uppercase;color:var(--dim);max-width:22ch}
section{padding:clamp(48px,6vw,78px) 0}
h2{font:400 clamp(1.7rem,3vw,2.5rem)/1.1 'Instrument Serif',Georgia,serif;margin:14px 0 0}
table{width:100%;border-collapse:collapse;margin-top:30px;font-size:14px}
th{text-align:left;font:500 10.5px/1 'IBM Plex Mono',monospace;letter-spacing:.14em;
  text-transform:uppercase;color:var(--dim);padding:0 14px 11px 0;border-bottom:1.5px solid var(--rule)}
td{padding:15px 14px 15px 0;border-bottom:1px solid var(--line);vertical-align:top;color:var(--mid)}
td.name{color:var(--ink);font-weight:600;font-size:15px;white-space:nowrap}
td.idx{color:var(--gold);font-family:'IBM Plex Mono',monospace;font-size:12px;width:40px}
.letter{display:grid;gap:clamp(26px,4vw,54px);margin-top:34px}
@media(min-width:900px){.letter{grid-template-columns:1.25fr .75fr}}
.letter p{margin:0 0 17px;max-width:62ch}
.letter .drop::first-letter{float:left;font:400 3.6em/.82 'Instrument Serif',Georgia,serif;
  padding:4px 10px 0 0;color:var(--gold)}
.aside{border-left:2px solid var(--gold);padding-left:20px;align-self:start}
.aside h3{font:600 13px/1.3 'Manrope',sans-serif;margin:0 0 12px;letter-spacing:-.01em}
.aside p{font-size:13.5px;color:var(--mid);margin:0 0 13px}
.fn{border-top:1px solid var(--line);margin-top:44px;padding-top:18px;
  font:400 11.5px/1.7 'IBM Plex Mono',monospace;color:var(--dim);max-width:86ch}
footer{border-top:2px solid var(--rule);padding:34px 0 60px;background:var(--card)}
footer .w{display:flex;justify-content:space-between;flex-wrap:wrap;gap:18px;
  font:400 12px/1.5 'IBM Plex Mono',monospace;color:var(--dim)}
"""


def c5():
    rows = "".join(
        f'<tr><td class=idx>{i}</td><td class=name>{t}</td><td>{c}</td>'
        f'<td class=mono style="font-size:12.5px">{s}</td><td>{k}</td></tr>'
        for i, t, c, s, k in OPERATED)
    mets = "".join(
        f'<div class=m><div class=n>{n}<sup>{s}</sup></div><div class=l>{l}</div></div>'
        for n, s, l in [("5", "1", "operating companies owned and run"),
                        ("6", "2", "client rebuilds delivered"),
                        ("11", "3", "days to first shipped MVP"),
                        ("100%", "", "of work shipped to production")])
    return shell("05", "Prospectus", "an annual report", "THE BUSINESS", C5_CSS, f"""
{nav("LOVELEE<em>DAY</em>",
      [("Business", 1), ("Platform", 1), ("Companies", 1), ("Work", 0),
       ("Practice", 1), ("Newsroom", 0)],
      util=["FY2026 &middot; SECOND HALF", "KALAMAZOO, MICHIGAN",
            "INVESTOR RELATIONS", "PRIVATELY HELD", "ASPEN &amp; MAY GROUP"],
      section=["Overview", "Segments", "Operating companies", "Client work",
               "Governance", "Letter to holders"],
      search="Search filings and figures",
      ctas=["Request the deck", "Start a project"])}

<div class=hero><div class=w><div class=split>
  <div>
    <p class=eyebrow>Statement of operations &middot; 2026</p>
    <h1>We do not have a portfolio. We have a balance sheet.</h1>
    <p class=lede>Most studios show you work they were paid to do. We show you the five
    companies we own and run on the software we wrote, and then the work clients hired us
    for. One of those is a claim about taste. The other is a claim about consequences.</p>
  </div>
  <figure class=fig1>
    <div class=stage style="height:300px"><canvas data-motion="series"></canvas></div>
    <figcaption>Fig. 1 &mdash; a measured series against its observed value. Drawn live,
    not a screenshot of a chart.</figcaption>
  </figure>
</div></div></div>

<div class=metrics><div class=w>{mets}</div></div>

<section><div class=w>
  <p class=eyebrow>Segment detail</p>
  <h2>Owned and operated.</h2>
  <table><thead><tr><th></th><th>Company</th><th>Segment</th><th>To first ship</th>
    <th>Stack</th></tr></thead><tbody>{rows}</tbody></table>
  <div class=letter>
    <div>
      <p class=drop>The reason to read a company by what it operates rather than by what it
      has designed is that operating is the only part that cannot be staged. A case study is
      written after the fact by the party with an interest in it. A running business files
      invoices, loses customers, pays for its own mistakes and keeps a ledger of them.</p>
      <p>Every product listed above is one we pay for. When the billing breaks on a Sunday,
      it is our Sunday. That is the whole argument, and it is the reason this page opens with
      a segment table instead of a hero image.</p>
      <p>The client work sits behind this, deliberately. Six rebuilds shipped this year for
      companies that are not ours; they are shown unnamed, because an uncommissioned redesign
      carries criticism of the site it replaces, and publishing that is a different act from
      sending one company its own private link.</p>
    </div>
    <div class=aside>
      <h3>How to read this page</h3>
      <p>Figures are counts, not estimates. &ldquo;To first ship&rdquo; is the interval from
      first commit to production traffic, taken from the repository, not from memory.</p>
      <h3>What is not here</h3>
      <p>No revenue, no headcount, no logos we have not earned. A number we will not source
      is a number we will not print.</p>
    </div>
  </div>
  <div class=fn>
    <sup>1</sup>&nbsp;olldae, Kronos, Hospitality Ops Layer, Duezy, Dabney &amp; Co.
    &nbsp;&nbsp;<sup>2</sup>&nbsp;Unnamed on this page by choice; private links on request.
    &nbsp;&nbsp;<sup>3</sup>&nbsp;olldae, first commit to first paying venue.
  </div>
</div></section>

<div class=band><img src="../janta/value-aerial-solar.jpg" alt="">
  <div class=cap><div class=w>Operating asset &middot; utility-scale monitoring, built and
  run by the studio</div></div></div>

<footer><div class=w><span>LOVELEEDAY STUDIOS &middot; KALAMAZOO, MICHIGAN</span>
  <span>ASPEN &amp; MAY GROUP</span><span>2026</span></div></footer>
""")


# ===========================================================================
# 06 — ATLAS.  Looks at: THE NETWORK.
# ===========================================================================

C6_CSS = """
:root{--paper:#FFFFFF;--wash:#F4F6F8;--ink:#101418;--mid:#3C454F;--dim:#6C7681;
  --line:#E4E8EC;--live:#0E7C7B;--warn:#B8722C;--shell:1320px}
body{margin:0;background:var(--paper);color:var(--ink);
  font:400 15px/1.6 'Manrope',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.w{max-width:var(--shell);margin:0 auto;padding:0 clamp(20px,3.4vw,46px)}
.mono{font-family:'IBM Plex Mono',ui-monospace,monospace}
.eyebrow{font:500 10.5px/1 'IBM Plex Mono',monospace;letter-spacing:.17em;
  text-transform:uppercase;color:var(--dim)}
.status{background:var(--ink);color:#DDE3E9}
.status .w{display:flex;align-items:center;gap:22px;height:36px;
  font:400 11.5px/1 'IBM Plex Mono',monospace}
.dot{width:7px;height:7px;border-radius:50%;background:var(--live);display:inline-block;
  margin-right:7px;box-shadow:0 0 0 3px rgba(14,124,123,.24)}
.nv{--nv-bg:rgba(255,255,255,.94);--nv-line:#E4E8EC;--nv-ink:#101418;--nv-mid:#3C454F;
  --nv-dim:#6C7681;--nv-sf:#F4F6F8}
.nv-sec{--nv-sec-bg:#F4F6F8;--nv-line:#E4E8EC;--nv-mid:#3C454F;--nv-ink:#101418}
.hero-split{padding:clamp(40px,5vw,72px) 0 clamp(30px,3.4vw,48px);
  border-bottom:1px solid var(--line);background:linear-gradient(var(--wash),#fff)}
.hs{display:grid;gap:clamp(28px,3.6vw,52px);align-items:center}
@media(min-width:960px){.hs{grid-template-columns:1fr 1.02fr}}
.hs h1{font:800 clamp(2.3rem,4.8vw,3.7rem)/1.01 'Manrope',sans-serif;
  letter-spacing:-.042em;margin:16px 0 0;max-width:14ch}
.hs p{margin:22px 0 0;max-width:50ch;color:var(--mid);font-size:16.5px}
.objpanel{border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#fff;
  box-shadow:0 22px 44px -30px rgba(16,20,24,.32)}
.objbar{display:flex;justify-content:space-between;padding:10px 15px;
  border-bottom:1px solid var(--line);font:400 10.5px/1 'IBM Plex Mono',monospace;
  letter-spacing:.11em;text-transform:uppercase;color:var(--dim)}
.acts{margin-top:28px;display:flex;gap:10px;flex-wrap:wrap}
.acts .btn{border-radius:6px;padding:11px 19px;font:600 13.5px/1 'Manrope',sans-serif}
.acts .btn.solid{background:var(--ink);color:#fff}
.acts .btn.ghost{border:1px solid var(--line2,#C9D2DA);color:var(--mid);background:#fff}
.hero{padding:clamp(40px,5vw,66px) 0 0}
.hero h2{font:800 clamp(1.5rem,2.7vw,2.1rem)/1.1 'Manrope',sans-serif;
  letter-spacing:-.033em;margin:14px 0 0}
.hero p{margin:20px 0 0;max-width:58ch;color:var(--mid);font-size:16.5px}
.map{margin-top:clamp(32px,4vw,52px);border:1px solid var(--line);border-radius:10px;
  background:linear-gradient(var(--wash),#fff);overflow:hidden}
.map .bar{display:flex;justify-content:space-between;align-items:center;
  padding:11px 18px;border-bottom:1px solid var(--line);background:#fff;
  font:400 11px/1 'IBM Plex Mono',monospace;color:var(--dim)}
.legend{display:flex;gap:18px}
.legend i{font-style:normal}
.grid4{display:grid;gap:1px;background:var(--line);border:1px solid var(--line);
  border-radius:10px;overflow:hidden;margin-top:clamp(30px,4vw,48px)}
@media(min-width:760px){.grid4{grid-template-columns:repeat(4,1fr)}}
.grid4 .c{background:#fff;padding:24px 22px 26px}
.grid4 .n{font:800 30px/1 'Manrope',sans-serif;letter-spacing:-.03em}
.grid4 .t{margin-top:10px;font:600 13px/1.35 'Manrope',sans-serif}
.grid4 .d{margin-top:7px;font-size:13px;color:var(--dim);line-height:1.5}
section{padding:clamp(46px,6vw,78px) 0}
h2{font:800 clamp(1.5rem,2.7vw,2.2rem)/1.08 'Manrope',sans-serif;letter-spacing:-.033em;margin:14px 0 0}
.rows{margin-top:28px;border-top:1px solid var(--line)}
.row{display:grid;gap:14px;padding:17px 0;border-bottom:1px solid var(--line);align-items:center}
@media(min-width:800px){.row{grid-template-columns:34px 1.1fr 1.4fr auto}}
.row .i{font:400 11.5px/1 'IBM Plex Mono',monospace;color:var(--dim)}
.row .nm{font:700 15px/1.3 'Manrope',sans-serif;letter-spacing:-.015em}
.row .ds{font-size:13.5px;color:var(--mid)}
.pill{justify-self:start;font:500 10.5px/1 'IBM Plex Mono',monospace;letter-spacing:.09em;
  text-transform:uppercase;border:1px solid var(--live);color:var(--live);
  border-radius:3px;padding:5px 9px}
.photos{padding:clamp(34px,4vw,56px) 0 clamp(44px,5vw,70px)}
.pgrid{display:grid;gap:14px}
@media(min-width:800px){.pgrid{grid-template-columns:repeat(3,1fr)}}
.pgrid figure{margin:0}
.pgrid figcaption{margin-top:10px;font:400 11px/1.5 'IBM Plex Mono',monospace;
  letter-spacing:.1em;text-transform:uppercase;color:var(--dim)}
footer{border-top:1px solid var(--line);padding:34px 0 60px;color:var(--dim);
  font:400 12px/1.6 'IBM Plex Mono',monospace}
"""


def _topology():
    """The operated companies and the services they share, drawn as a real
       topology: a spine of shared infrastructure with each product hanging off
       it. Not decoration -- the edges are the integrations that exist."""
    prods = [("olldae", 150), ("Kronos", 330), ("Ops Layer", 510), ("Duezy", 690), ("Dabney", 870)]
    infra = [("Supabase", 240), ("Stripe", 430), ("Resend", 620), ("Fly.io", 800)]
    seg, nodes, labels = [], [], []
    for name, x in prods:
        seg.append(f'<path d="M{x} 96 L{x} 150 L520 150 L520 196" fill="none" '
                   f'stroke="#C9D2DA" stroke-width="1.4"/>')
        nodes.append(f'<rect x="{x-62}" y="62" width="124" height="34" rx="5" fill="#fff" '
                     f'stroke="#101418" stroke-width="1.4"/>')
        labels.append(f'<text x="{x}" y="84" text-anchor="middle" font-family="Manrope" '
                      f'font-size="13.5" font-weight="700" fill="#101418">{name}</text>')
    for name, x in infra:
        seg.append(f'<path d="M520 244 L520 288 L{x} 288 L{x} 322" fill="none" '
                   f'stroke="#C9D2DA" stroke-width="1.4"/>')
        nodes.append(f'<rect x="{x-58}" y="322" width="116" height="32" rx="5" fill="#F4F6F8" '
                     f'stroke="#C9D2DA" stroke-width="1.2"/>')
        labels.append(f'<text x="{x}" y="343" text-anchor="middle" font-family="IBM Plex Mono" '
                      f'font-size="11.5" fill="#3C454F">{name}</text>')
    return f"""<svg viewBox="0 40 1040 390" style="width:100%;height:auto;display:block">
{''.join(seg)}
<rect x="404" y="196" width="232" height="48" rx="6" fill="#101418"/>
<text x="520" y="219" text-anchor="middle" font-family="Manrope" font-size="14"
  font-weight="800" fill="#fff">Arthur</text>
<text x="520" y="235" text-anchor="middle" font-family="IBM Plex Mono" font-size="10"
  fill="#8C98A4" letter-spacing="1.4">SHARED CONTROL PLANE</text>
{''.join(nodes)}{''.join(labels)}
<circle cx="520" cy="150" r="4" fill="#0E7C7B"/>
<circle cx="520" cy="288" r="4" fill="#0E7C7B"/>
<text x="24" y="150" font-family="IBM Plex Mono" font-size="10.5" fill="#6C7681"
  letter-spacing="1.6">PRODUCTS</text>
<text x="24" y="288" font-family="IBM Plex Mono" font-size="10.5" fill="#6C7681"
  letter-spacing="1.6">SERVICES</text>
</svg>"""


def c6():
    cards = "".join(
        f'<div class=c><div class=n>{n}</div><div class=t>{t}</div><div class=d>{d}</div></div>'
        for n, t, d in [("5", "Products on one plane",
                         "Every company we operate runs on the same auth, billing and job layer."),
                        ("4", "Shared services",
                         "One Stripe account, one mail sender, one host. Four bills, not twenty."),
                        ("11d", "Fastest to production",
                         "olldae, first commit to the first paying venue."),
                        ("0", "Bespoke snowflakes",
                         "Nothing we run is a one-off we cannot redeploy tomorrow.")])
    rows = "".join(
        f'<div class=row><div class=i>{i}</div><div class=nm>{t}</div>'
        f'<div class=ds>{c}</div><div class=pill>operating</div></div>'
        for i, t, c, s, k in OPERATED)
    return shell("06", "Atlas", "cloudflare.com / datadoghq.com", "THE NETWORK", C6_CSS, f"""
<div class=status><div class=w><span><span class=dot></span>All systems operational</span>
  <span>5 products</span><span>4 shared services</span><span>us-east &middot; iad</span>
  <span style="margin-left:auto">Updated 14:02 ET</span></div></div>
{nav("LOVELEEDAY",
     [("Platform", 1), ("Products", 1), ("Solutions", 1), ("Work", 0),
      ("Practice", 1), ("Docs", 0), ("Support", 0)],
     section=["Overview", "Control plane", "Data layer", "Identity", "Billing",
              "Observability", "Status", "Changelog"],
     search="Search docs and products",
     ctas=["Client portal", "Start a project"])}

<div class=hero-split><div class=w><div class=hs>
  <div>
    <p class=eyebrow>The platform</p>
    <h1>Five companies. One control plane.</h1>
    <p>We build each product on the same spine, so a fix to billing is a fix to billing
    everywhere. Every record any of them holds resolves onto one object.</p>
    <div class=acts><a class="btn solid" href="#">Explore the platform</a>
      <a class="btn ghost" href="#">Read the architecture</a></div>
  </div>
  <div class=objpanel>
    <div class=objbar><span>LIVE &middot; RECORD ROUTING</span><span>us-east &middot; iad</span></div>
    <div class=stage style="height:320px"><canvas data-motion="flow"></canvas></div>
  </div>
</div></div></div>

<div class=hero><div class=w>
  <p class=eyebrow>Topology</p>
  <h2 style="margin-bottom:6px">This is the actual wiring, not an illustration of one.</h2>
  <div class=map>
    <div class=bar><span>TOPOLOGY &middot; PRODUCTION</span>
      <span class=legend><i>&#9632; owned</i><i>&#9633; third party</i>
      <i style="color:#0E7C7B">&#9679; live edge</i></span></div>
    {_topology()}
  </div>
  <div class=grid4>{cards}</div>
</div></div>

<section><div class=w>
  <p class=eyebrow>Operating companies</p>
  <h2>What is running right now.</h2>
  <div class=rows>{rows}</div>
</div></section>

<div class=photos><div class=w><div class=pgrid>
  <figure><div class=shot style="height:250px"><img src="../janta/value-field-towers.jpg" alt=""></div>
    <figcaption>Monitoring, in the field</figcaption></figure>
  <figure><div class=shot style="height:250px"><img src="../novarna/bench.jpg" alt=""></div>
    <figcaption>Instrumentation, at the bench</figcaption></figure>
  <figure><div class=shot style="height:250px"><img src="../micruity/x_office.jpg" alt=""></div>
    <figcaption>Operators, on the console</figcaption></figure>
</div></div></div>

<footer><div class=w>LOVELEEDAY STUDIOS &middot; KALAMAZOO, MICHIGAN &middot;
  STATUS PAGE IS THE HOMEPAGE</div></footer>
""")


# ===========================================================================
# 07 — CASE FILE.  Looks at: THE WORK.
# ===========================================================================

C7_CSS = """
:root{--paper:#F7F5F1;--card:#FFFFFF;--ink:#171514;--mid:#4A4643;--dim:#7A736C;
  --line:#E2DDD5;--accent:#9C3B1B;--shell:1280px}
body{margin:0;background:var(--paper);color:var(--ink);
  font:400 16px/1.7 'Newsreader',Georgia,serif;-webkit-font-smoothing:antialiased}
.w{max-width:var(--shell);margin:0 auto;padding:0 clamp(20px,3.6vw,48px)}
.narrow{max-width:760px}
.eyebrow{font:500 10.5px/1 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.2em;
  text-transform:uppercase;color:var(--dim)}
nav{border-bottom:1px solid var(--line)}
nav .w{display:flex;align-items:center;justify-content:space-between;height:70px}
nav .brand{font:500 18px/1 'Newsreader',Georgia,serif;letter-spacing:.01em}
nav .links{display:flex;gap:28px;font:400 13.5px/1 'IBM Plex Mono',monospace;
  letter-spacing:.04em;color:var(--mid);text-transform:uppercase;font-size:11.5px}
.hero{position:relative;margin-top:0;background:#171514;color:#F7F5F1;overflow:hidden}
.hero img{width:100%;height:clamp(340px,52vw,560px);object-fit:cover;opacity:.66}
.hero .cap{position:absolute;left:0;right:0;bottom:0;padding:clamp(28px,4vw,54px) 0}
/* A caption over a photograph needs a scrim, not an opacity. The first version
   set the meta row at 76% white and it vanished into the bright floor of the
   picture -- legible on the dark half of the image and gone on the light half,
   which is the failure mode that only shows up when you render it. */
.hero::after{content:"";position:absolute;left:0;right:0;bottom:0;height:62%;
  background:linear-gradient(to top,rgba(10,9,8,.86),rgba(10,9,8,.52) 42%,transparent);
  pointer-events:none}
.hero .cap{z-index:2}
.hero .cap .w{max-width:var(--shell)}
.hero h1{font:400 clamp(2.2rem,4.6vw,3.6rem)/1.08 'Newsreader',Georgia,serif;
  margin:14px 0 0;max-width:20ch;letter-spacing:-.012em}
.hero .meta{margin-top:18px;display:flex;gap:16px;flex-wrap:wrap;
  font:400 11.5px/1 'IBM Plex Mono',monospace;letter-spacing:.09em;
  text-transform:uppercase;color:rgba(247,245,241,.96)}
.hero .meta span+span::before{content:"\00b7";margin-right:16px;opacity:.55}
.hero .eyebrow{color:rgba(247,245,241,.92)}
section{padding:clamp(48px,6vw,86px) 0}
h2{font:400 clamp(1.7rem,3vw,2.4rem)/1.12 'Newsreader',Georgia,serif;margin:14px 0 0;
  letter-spacing:-.012em}
p.lede{font-size:19px;line-height:1.62;color:var(--mid);margin:22px 0 0}
.body p{margin:0 0 20px}
.body{margin-top:30px}
.body p:first-of-type::first-letter{float:left;font-size:3.5em;line-height:.84;
  padding:2px 12px 0 0;margin-top:2px;color:var(--accent)}
.pull{border-left:3px solid var(--accent);padding:6px 0 6px 22px;margin:30px 0;
  font-size:21px;line-height:1.48;color:var(--ink)}
.figs{display:grid;gap:16px;margin-top:34px}
@media(min-width:800px){.figs{grid-template-columns:1fr 1fr}}
.fig{background:var(--card);border:1px solid var(--line)}
.fig img{width:100%;height:230px;object-fit:cover}
.fig .c{padding:13px 16px;font:400 11.5px/1.5 'IBM Plex Mono',monospace;color:var(--dim)}
.roster{border-top:1px solid var(--line);border-bottom:1px solid var(--line);
  padding:26px 0;margin-top:44px;display:flex;flex-wrap:wrap;gap:34px;
  font:400 11.5px/1 'IBM Plex Mono',monospace;letter-spacing:.1em;
  text-transform:uppercase;color:var(--dim)}
.why{background:var(--card);border:1px solid var(--line);padding:clamp(26px,3.4vw,40px);
  margin-top:40px}
.why h3{font:500 10.5px/1 'IBM Plex Mono',monospace;letter-spacing:.18em;
  text-transform:uppercase;color:var(--dim);margin:0 0 16px}
.why dl{margin:0;display:grid;gap:16px}
@media(min-width:760px){.why dl{grid-template-columns:1fr 1fr}}
.why dt{font:600 14px/1.4 'Manrope',sans-serif;letter-spacing:-.01em}
.why dd{margin:5px 0 0;font-size:14.5px;line-height:1.6;color:var(--mid)}
.nv{--nv-bg:#F7F5F1;--nv-line:#E2DDD5;--nv-ink:#171514;--nv-mid:#4A4643;
  --nv-dim:#7A736C;--nv-sf:#FFFFFF}
.nv-util{--nv-util-bg:#171514;--nv-util-fg:#B9B1A8}
.nv-sec{--nv-sec-bg:#FFFFFF;--nv-line:#E2DDD5;--nv-mid:#4A4643;--nv-ink:#171514}
.nv .brand{font-family:'Newsreader',Georgia,serif;font-weight:500;font-size:18px;
  letter-spacing:.005em}
.pgrid{display:grid;gap:16px;padding:0 0 clamp(40px,5vw,64px)}
@media(min-width:840px){.pgrid{grid-template-columns:repeat(3,1fr)}}
.pgrid figure{margin:0}
.pgrid figcaption{margin-top:11px;font:400 11px/1.5 'IBM Plex Mono',monospace;
  letter-spacing:.11em;text-transform:uppercase;color:var(--dim)}
footer{border-top:1px solid var(--line);padding:34px 0 62px;color:var(--dim);
  font:400 11.5px/1.6 'IBM Plex Mono',monospace;letter-spacing:.06em;text-transform:uppercase}
"""


def c7():
    figs = "".join(
        f'<div class=fig><img src="{src}" alt=""><div class=c>{c}</div></div>'
        for src, c in [("../fyxit/photo-itlead.jpg",
                        "Fig. 2 &mdash; the buyer, not the product. A photograph earns its place when the subject is a person making a decision."),
                       ("../fyxit/photo-hallway.jpg",
                        "Fig. 3 &mdash; the corridor. Used once, to establish where the software is actually used, and never repeated.")])
    return shell("07", "Case File", "mckinsey.com / accenture.com", "THE WORK", C7_CSS, f"""
{nav("Loveleeday Studios",
     [("Work", 1), ("Industries", 1), ("Companies", 1), ("Capabilities", 1),
      ("Practice", 0), ("Writing", 0)],
     util=["SELECTED ENGAGEMENTS", "SIX REBUILDS, 2026", "KALAMAZOO",
           "PRESS", "CAREERS"],
     section=["All cases", "Education", "Field services", "Hospitality",
              "Energy", "Life sciences", "Restaurant technology"],
     search="Search cases",
     ctas=["Private links", "Start a project"])}

<div class=hero>
  <img src="../fyxit/photo-teacher.jpg" alt="">
  <div class=cap><div class=w>
    <p class=eyebrow>Case 04 &middot; Education IT</p>
    <h1>A district IT desk was losing an hour a day to its own ticket form.</h1>
    <div class=meta><span>Rebuild</span><span>Six weeks</span><span>Shipped 2026</span>
      <span>Name withheld</span></div>
  </div></div>
</div>

<section><div class="w narrow">
  <p class=eyebrow>The engagement</p>
  <h2>What the form was costing them.</h2>
  <p class=lede>The old request form collected nine fields and a room number. Every
  submission became a walk to the classroom, and every walk became a second form filled in
  by hand back at the desk.</p>
  <div class=body>
    <p>We did not start with the design. We started with a week of the actual queue, because
    the ticket form was not a design problem until we could say which of the nine fields
    changed what anybody did next. Four of them did. The rest were being collected because
    the form had always collected them.</p>
    <p>The rebuild asks four questions, routes on the answers, and books the visit into the
    technician&rsquo;s calendar. The photography on this page is ours, and it is here because
    the person deciding whether to trust this vendor is a teacher standing in a corridor
    &mdash; which is a thing a photograph can say and a diagram cannot.</p>
  </div>
  <div class=pull>The question is never &ldquo;does this page need an image&rdquo;. It is
  whether the thing being claimed is about a person or about a system. People get
  photographs. Systems get diagrams.</div>
</div></section>

<div class=w><div class=figs>{figs}</div>

<div class=why>
  <h3>How this set decides</h3>
  <dl>
    <dt>Photography</dt><dd>Only where the claim is about people &mdash; a buyer, an
    operator, a room where the work happens. Always ours, never stock, always full bleed or
    not at all.</dd>
    <dt>Drawn objects</dt><dd>Where the claim is about a system. A schematic is a promise
    that an architecture exists, so it has to be true and labelled.</dd>
    <dt>Colour</dt><dd>One accent per concept, taken from the subject rather than from
    taste. Here it is the rust read off the corridor photograph, then pulled down until it
    clears 4.5:1 on this ground so it can hold small text.</dd>
    <dt>Nothing</dt><dd>Most sections. A page where every block has an image has told you
    that none of them mattered.</dd>
  </dl>
</div>

<div class=roster><span>Field services</span><span>Insurance</span><span>Hospitality</span>
  <span>Restaurant technology</span><span>Multi-entity finance</span><span>Logistics</span></div>
</div>

<section><div class="w narrow">
  <p class=eyebrow>Selected engagements</p>
  <h2>Six rebuilds this year. None of them named.</h2>
  <p class=lede>An uncommissioned redesign carries criticism of the site it replaces.
  Sending that to one company privately is useful. Printing it on a marketing page is a
  different act, so the imagery is here and the identities are not.</p>
</div></section>

<div class=w><div class=pgrid>
  <figure><div class=shot style="height:300px"><img src="../novarna/lab.jpg" alt=""></div>
    <figcaption>Life sciences &mdash; bench to report</figcaption></figure>
  <figure><div class=shot style="height:300px"><img src="../janta/value-dsr-campus.jpg" alt=""></div>
    <figcaption>Energy &mdash; campus demand response</figcaption></figure>
  <figure><div class=shot style="height:300px"><img src="../micruity/x_couple.jpg" alt=""></div>
    <figcaption>Financial services &mdash; the household, not the account</figcaption></figure>
</div></div>

<footer><div class=w>Loveleeday Studios &middot; Kalamazoo, Michigan</div></footer>
""")


# ===========================================================================
# 08 — SPEC.  Looks at: THE CRAFT.
# ===========================================================================

C8_CSS = """
:root{--paper:#FFFFFF;--wash:#FAFAFA;--ink:#0D0D0F;--mid:#4A4D55;--dim:#82868F;
  --line:#EAEAEC;--line2:#D8D9DD;--acc:#2C4BD8;--shell:1080px}
body{margin:0;background:var(--paper);color:var(--ink);
  font:400 14.5px/1.62 'Manrope',ui-sans-serif,system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;letter-spacing:-.005em}
.w{max-width:var(--shell);margin:0 auto;padding:0 clamp(20px,3.2vw,36px)}
.mono{font-family:'IBM Plex Mono',ui-monospace,monospace}
.eyebrow{font:500 10px/1 'IBM Plex Mono',monospace;letter-spacing:.16em;
  text-transform:uppercase;color:var(--dim)}
.nv{--nv-bg:rgba(255,255,255,.93);--nv-line:#EAEAEC;--nv-ink:#0D0D0F;
  --nv-mid:#4A4D55;--nv-dim:#82868F;--nv-sf:#FAFAFA}
.nv-util{--nv-util-bg:#0D0D0F;--nv-util-fg:#9AA0AB}
.kbd{font:500 12px/1 'IBM Plex Mono',monospace;border:1px solid var(--line2);
  border-bottom-width:2px;border-radius:4px;padding:5px 8px;color:var(--mid);
  white-space:nowrap}
.hero{padding:clamp(44px,6vw,84px) 0 clamp(36px,4vw,58px)}
.heroflex{display:grid;gap:clamp(26px,3.6vw,50px);align-items:center}
@media(min-width:900px){.heroflex{grid-template-columns:1fr .92fr}}
.hero h1{font:800 clamp(2.1rem,4.4vw,3.2rem)/1.06 'Manrope',sans-serif;
  letter-spacing:-.045em;margin:14px 0 0}
.hero p{margin:20px 0 0;color:var(--mid);font-size:16px;max-width:54ch}
.hero .cta{margin-top:30px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.btn{border-radius:6px;padding:9px 16px;font:600 13px/1 'Manrope',sans-serif}
.btn.solid{background:var(--ink);color:#fff}
.btn.ghost{border:1px solid var(--line2);color:var(--mid)}
section{padding:clamp(40px,5vw,64px) 0;border-top:1px solid var(--line)}
h2{font:700 clamp(1.15rem,2vw,1.5rem)/1.15 'Manrope',sans-serif;letter-spacing:-.035em;margin:12px 0 0}
.spec{margin-top:26px;border-top:1px solid var(--line2)}
.spec .r{display:grid;grid-template-columns:150px 1fr auto;gap:18px;padding:12px 0;
  border-bottom:1px solid var(--line);align-items:baseline}
.spec .k{font:500 11px/1.5 'IBM Plex Mono',monospace;letter-spacing:.07em;
  text-transform:uppercase;color:var(--dim)}
.spec .v{color:var(--mid);font-size:14px}
.spec .n{font:500 11.5px/1 'IBM Plex Mono',monospace;color:var(--acc)}
.log{margin-top:26px}
.log .e{display:grid;gap:12px;padding:15px 0;border-bottom:1px solid var(--line)}
@media(min-width:720px){.log .e{grid-template-columns:104px 1fr}}
.log .d{font:500 11px/1.6 'IBM Plex Mono',monospace;color:var(--dim)}
.log .t{font:700 14px/1.4 'Manrope',sans-serif;letter-spacing:-.02em}
.log .s{margin-top:4px;font-size:13.5px;color:var(--mid)}
.tag{display:inline-block;font:500 10px/1 'IBM Plex Mono',monospace;letter-spacing:.08em;
  text-transform:uppercase;border:1px solid var(--line2);border-radius:3px;
  padding:4px 7px;color:var(--dim);margin-right:6px}
.swatch{display:flex;gap:0;margin-top:24px;border:1px solid var(--line);border-radius:7px;overflow:hidden}
.swatch div{flex:1;height:74px;display:flex;align-items:flex-end;padding:9px;
  font:500 9.5px/1 'IBM Plex Mono',monospace}
footer{border-top:1px solid var(--line);padding:30px 0 60px;color:var(--dim);
  font:400 11.5px/1.6 'IBM Plex Mono',monospace}
"""


def c8():
    spec = "".join(
        f'<div class=r><div class=k>{k}</div><div class=v>{v}</div><div class=n>{n}</div></div>'
        for k, v, n in [
            ("First paint", "Static shell, no client JS on the marketing routes", "0.4 s"),
            ("Type", "Manrope 800 display, Mulish text, IBM Plex Mono figures", "3 files"),
            ("Contrast", "Every role measured on both grounds it sits on", "&ge; 4.5:1"),
            ("Images", "Drawn in SVG or photographed by us. No stock.", "0 licensed"),
            ("Dependencies", "Next, React, Tailwind. Nothing for a carousel.", "4"),
            ("Accessibility", "Keyboard path through every flow, tested", "WCAG AA"),
        ])
    log = "".join(
        f'<div class=e><div class=d>{d}</div><div><div class=t>{t}</div>'
        f'<div class=s>{s}</div></div></div>'
        for d, t, s in [
            ("2026-09-21", "Measured spacing replaces a kerning table",
             "Facing ink profiles sampled per pair, with a floor that makes a collision impossible."),
            ("2026-09-20", "Portfolio images content-hashed",
             "A derived artifact with no producer is a stale artifact with a countdown."),
            ("2026-09-19", "Duplex rendered from a crystal structure",
             "Drawn from real atomic coordinates rather than generated to look plausible."),
            ("2026-09-18", "Palette pulled down to clear 4.5:1",
             "Two values ship darker than recommended, for a measured reason, not an aesthetic one."),
        ])
    sw = "".join(
        f'<div style="background:{c};color:{t}">{c}</div>'
        for c, t in [("#0D0D0F", "#fff"), ("#2C4BD8", "#fff"), ("#4A4D55", "#fff"),
                     ("#82868F", "#fff"), ("#EAEAEC", "#0D0D0F"), ("#FAFAFA", "#0D0D0F"),
                     ("#FFFFFF", "#0D0D0F")])
    return shell("08", "Spec", "linear.app / vercel.com", "THE CRAFT", C8_CSS, f"""
{nav("LOVELEEDAY",
     [("Product", 1), ("Method", 1), ("Companies", 1), ("Work", 0),
      ("Changelog", 0), ("Docs", 0)],
     util=["SPEC AS OF 2026-09-21", "ALL FIGURES MEASURED",
           "STATUS: OPERATIONAL", "CHANGELOG IS PUBLIC"],
     search="Search the spec",
     ctas=["Sign in", "Start a project"])}

<div class=w><div class="hero heroflex">
  <div>
    <p class=eyebrow>Studio</p>
    <h1>Software that holds up when you look closely.</h1>
    <p>Most of this page is a specification, because a studio that will not publish its own
    numbers is asking to be judged on adjectives.</p>
    <div class=cta><a class="btn solid" href="#">Start a project</a>
      <a class="btn ghost" href="#">Read the changelog</a>
      <span class=kbd>&#8984;K</span></div>
  </div>
  <div class=stage style="height:330px;border:1px solid var(--line);border-radius:10px">
    <canvas data-motion="contour"></canvas>
  </div>
</div></div>

<section><div class=w>
  <p class=eyebrow>01 &middot; Specification</p>
  <h2>What we hold ourselves to.</h2>
  <div class=spec>{spec}</div>
</div></section>

<section><div class=w>
  <p class=eyebrow>02 &middot; Type and colour</p>
  <h2>One accent. Everything else is a value of grey.</h2>
  <p style="margin:16px 0 0;color:var(--mid);max-width:56ch">A restricted palette is not
  minimalism, it is a constraint that makes the one coloured thing on a screen mean
  something. Here it is the single blue, and it appears once per viewport.</p>
  <div class=swatch>{sw}</div>
</div></section>

<section><div class=w>
  <p class=eyebrow>03 &middot; Changelog</p>
  <h2>What changed, and why it changed.</h2>
  <div class=log>{log}</div>
  <div style="margin-top:22px"><span class=tag>Public</span><span class=tag>Weekly</span>
    <span class=tag>Written by the person who shipped it</span></div>
</div></section>

<footer><div class=w>LOVELEEDAY STUDIOS &middot; KALAMAZOO MI &middot; SPEC AS OF 2026-09-21</div></footer>
""")


# ===========================================================================
# 09 — CATALOGUE.  Looks at: THE SERVICES.
# ===========================================================================

C9_CSS = """
:root{--paper:#FAFBFC;--card:#FFFFFF;--ink:#0F1B2D;--mid:#3F4C61;--dim:#6E7A8C;
  --line:#E1E6ED;--acc:#0F62A8;--amber:#9A6414;--shell:1340px}
body{margin:0;background:var(--paper);color:var(--ink);
  font:400 14.5px/1.6 'Mulish',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.w{max-width:var(--shell);margin:0 auto;padding:0 clamp(20px,3vw,40px)}
.eyebrow{font:500 10px/1 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.16em;
  text-transform:uppercase;color:var(--dim)}
.nv{--nv-bg:#FFFFFF;--nv-line:#E1E6ED;--nv-ink:#0F1B2D;--nv-mid:#3F4C61;
  --nv-dim:#6E7A8C;--nv-sf:#FAFBFC}
.nv-util{--nv-util-bg:#0F1B2D;--nv-util-fg:#C7D2E0}
.nv-sec{--nv-sec-bg:#FFFFFF;--nv-line:#E1E6ED;--nv-mid:#3F4C61;--nv-ink:#0F1B2D}
.nv .links a.on{color:var(--acc);box-shadow:0 20px 0 -17px var(--acc)}
.hero-stage{min-height:clamp(340px,38vw,470px);display:flex;align-items:center;
  border-bottom:1px solid var(--line)}
.hero-stage .veil{background:linear-gradient(100deg,rgba(250,251,252,.97) 0 42%,
  rgba(250,251,252,.74) 66%,rgba(250,251,252,.25) 100%)}
.hero-stage .w{padding:clamp(30px,3.6vw,50px) clamp(20px,3vw,40px)}
.hero-stage h1{font:800 clamp(2rem,4.2vw,3.1rem)/1.05 'Manrope',sans-serif;
  letter-spacing:-.04em;margin:14px 0 0;max-width:20ch}
.hero-stage p{margin:18px 0 0;max-width:60ch;color:var(--mid);font-size:16px}
.rail{padding:clamp(26px,3vw,40px) 0 0}
.rgrid{display:grid;gap:12px}
@media(min-width:860px){.rgrid{grid-template-columns:repeat(4,1fr)}}
.rgrid figure{margin:0}
.rgrid figcaption{margin-top:9px;font:500 10.5px/1.4 'IBM Plex Mono',monospace;
  letter-spacing:.11em;text-transform:uppercase;color:var(--dim)}
.search{margin-top:26px;max-width:560px;display:flex;border:1px solid var(--line);
  border-radius:7px;background:var(--card);overflow:hidden}
.search input{flex:1;border:0;outline:0;padding:12px 15px;font:400 14px/1 'Mulish',sans-serif;
  color:var(--mid)}
.search span{background:var(--acc);color:#fff;padding:12px 18px;
  font:600 13px/1 'Manrope',sans-serif}
.cat{padding:clamp(34px,4vw,54px) 0;border-top:1px solid var(--line)}
h2{font:800 clamp(1.2rem,2.1vw,1.6rem)/1.1 'Manrope',sans-serif;letter-spacing:-.035em;margin:12px 0 0}
.cols{display:grid;gap:1px;background:var(--line);border:1px solid var(--line);
  border-radius:8px;overflow:hidden;margin-top:26px}
@media(min-width:900px){.cols{grid-template-columns:repeat(4,1fr)}}
.col{background:var(--card);padding:22px 20px 24px}
.col h3{font:700 12.5px/1 'Manrope',sans-serif;letter-spacing:.02em;margin:0 0 4px}
.col .k{font:400 10px/1 'IBM Plex Mono',monospace;letter-spacing:.14em;
  text-transform:uppercase;color:var(--amber);margin-bottom:14px}
.col ul{list-style:none;margin:0;padding:0}
.col li{padding:7px 0;border-bottom:1px solid var(--line);font-size:13.5px;color:var(--mid)}
.col li:last-child{border-bottom:0}
.col li b{color:var(--ink);font-weight:600}
.console{margin-top:30px;border:1px solid var(--line);border-radius:9px;overflow:hidden;
  background:var(--card)}
.console .bar{display:flex;align-items:center;gap:9px;padding:10px 15px;
  border-bottom:1px solid var(--line);font:400 11.5px/1 'IBM Plex Mono',monospace;color:var(--dim)}
.console .bar i{width:9px;height:9px;border-radius:50%;background:var(--line);display:block}
.console .body{display:grid;gap:1px;background:var(--line)}
@media(min-width:760px){.console .body{grid-template-columns:200px 1fr}}
.console .side{background:#F4F7FA;padding:16px 15px;font-size:13px;color:var(--mid)}
.console .side div{padding:6px 0}
.console .side div.on{color:var(--acc);font-weight:700}
.console .main{background:var(--card);padding:20px 22px}
.console table{width:100%;border-collapse:collapse;font-size:13px}
.console th{text-align:left;font:500 10px/1 'IBM Plex Mono',monospace;letter-spacing:.12em;
  text-transform:uppercase;color:var(--dim);padding-bottom:9px;border-bottom:1px solid var(--line)}
.console td{padding:10px 0;border-bottom:1px solid var(--line);color:var(--mid)}
.console td b{color:var(--ink)}
.ok{color:#146B4A;font-family:'IBM Plex Mono',monospace;font-size:11.5px}
footer{border-top:1px solid var(--line);background:var(--card);padding:30px 0 60px;
  color:var(--dim);font:400 11.5px/1.6 'IBM Plex Mono',monospace}
"""


def c9():
    cols = "".join(
        f'<div class=col><div class=k>{k:0>2}</div><h3>{name}</h3><ul>'
        + "".join(f'<li><b>{i}</b></li>' for i in items) + '</ul></div>'
        for k, (name, items) in enumerate(CAPABILITIES, 1))
    rows = "".join(
        f'<tr><td><b>{t}</b></td><td>{c}</td><td class=ok>running</td><td>{s}</td></tr>'
        for i, t, c, s, k in OPERATED)
    return shell("09", "Catalogue", "aws.amazon.com / cloud.google.com", "THE SERVICES", C9_CSS, f"""
{nav("LOVELEEDAY",
     [("Capabilities", 1), ("Products", 1), ("Industries", 1), ("Work", 0),
      ("Pricing", 0), ("Docs", 0), ("Company", 1)],
     util=["LOVELEEDAY STUDIOS", "ASPEN &amp; MAY GROUP", "Console", "Support",
           "Contact sales"],
     section=["All capabilities", "Platform", "Data", "Interface", "Operations",
              "By industry", "By outcome", "What's new"],
     search="Search capabilities",
     ctas=["Console", "Contact sales"])}

<div class="stage hero-stage">
  <canvas data-motion="halftone"></canvas>
  <div class=veil></div>
  <div class=w>
    <p class=eyebrow>Capabilities</p>
    <h1>Twenty-four things we build, named.</h1>
    <p>A studio that lists services in threes is telling you it does whatever is asked.
    This is the actual catalogue, grouped the way the work is grouped, and every line is
    something we have shipped to production more than once.</p>
    <div class=search><input placeholder="Search capabilities, products and case files" readonly>
      <span>Search</span></div>
  </div>
</div>

<div class=rail><div class=w><div class=rgrid>
  <figure><div class=shot style="height:190px"><img src="../janta/software-dashboard-hero.jpg" alt=""></div>
    <figcaption>Operator consoles</figcaption></figure>
  <figure><div class=shot style="height:190px"><img src="../novarna/lab.jpg" alt=""></div>
    <figcaption>Ingestion pipelines</figcaption></figure>
  <figure><div class=shot style="height:190px"><img src="../janta/value-field-towers.jpg" alt=""></div>
    <figcaption>Observability</figcaption></figure>
  <figure><div class=shot style="height:190px"><img src="../micruity/x_office.jpg" alt=""></div>
    <figcaption>Design systems</figcaption></figure>
</div></div></div>

<div class=cat><div class=w>
  <p class=eyebrow>By category</p>
  <h2>Four groups, six each.</h2>
  <div class=cols>{cols}</div>
</div></div>

<div class=cat><div class=w>
  <p class=eyebrow>Console</p>
  <h2>What we run on it ourselves.</h2>
  <div class=console>
    <div class=bar><i></i><i></i><i></i><span style="margin-left:8px">
      console.loveleedaystudios.com / operated</span></div>
    <div class=body>
      <div class=side><div class=on>Operated</div><div>Client work</div><div>Billing</div>
        <div>Deployments</div><div>Domains</div><div>Mail</div><div>Settings</div></div>
      <div class=main><table><thead><tr><th>Company</th><th>Segment</th><th>State</th>
        <th>To first ship</th></tr></thead><tbody>{rows}</tbody></table></div>
    </div>
  </div>
</div></div>

<footer><div class=w>LOVELEEDAY STUDIOS &middot; KALAMAZOO, MICHIGAN &middot; 24 CAPABILITIES &middot; 5 OPERATED COMPANIES</div></footer>
""")


# ===========================================================================
# 10 — FIELD NOTE.  Looks at: THE THINKING.
# ===========================================================================

C10_CSS = """
:root{--paper:#FAF7F0;--card:#FFFFFF;--ink:#1A1713;--mid:#4B453C;--dim:#7C7367;
  --line:#E5DFD3;--acc:#1F5B4E;--shell:1180px}
body{margin:0;background:var(--paper);color:var(--ink);
  font:400 17px/1.72 'Newsreader',Georgia,serif;-webkit-font-smoothing:antialiased}
.w{max-width:var(--shell);margin:0 auto;padding:0 clamp(20px,3.6vw,44px)}
.eyebrow{font:500 10px/1 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.2em;
  text-transform:uppercase;color:var(--dim)}
.nv{--nv-bg:#FAF7F0;--nv-line:#E5DFD3;--nv-ink:#1A1713;--nv-mid:#4B453C;
  --nv-dim:#7C7367;--nv-sf:#FFFFFF}
.nv-util{--nv-util-bg:#1A1713;--nv-util-fg:#B5AB9C}
.nv-sec{--nv-sec-bg:#FFFFFF;--nv-line:#E5DFD3;--nv-mid:#4B453C;--nv-ink:#1A1713}
.nv .brand{font-family:'Newsreader',Georgia,serif;font-weight:500;font-size:19px;
  letter-spacing:.005em}
.mast-art{height:clamp(240px,25vw,340px);border-bottom:1px solid var(--line);
  background:#fff}
.mast-art .veil{background:linear-gradient(to bottom,rgba(250,247,240,0) 40%,
  rgba(250,247,240,.9) 100%)}
.masthead{padding:clamp(36px,4.6vw,64px) 0 clamp(30px,3.6vw,46px);border-bottom:1px solid var(--line)}
.masthead h1{font:400 clamp(2.4rem,5.4vw,4rem)/1.06 'Newsreader',Georgia,serif;
  letter-spacing:-.016em;margin:16px 0 0;max-width:18ch}
.masthead h1 em{font-style:italic;color:var(--acc)}
.masthead .by{margin-top:22px;font:400 12px/1 'IBM Plex Mono',monospace;
  letter-spacing:.1em;text-transform:uppercase;color:var(--dim)}
.piece{display:grid;gap:clamp(24px,3.4vw,48px);padding:clamp(40px,5vw,66px) 0}
@media(min-width:960px){.piece{grid-template-columns:168px minmax(0,640px) 1fr}}
.marg{font:400 12.5px/1.62 'IBM Plex Mono',monospace;color:var(--dim)}
.marg p{margin:0 0 15px}
.col p{margin:0 0 21px}
.col p.first::first-letter{float:left;font-size:3.3em;line-height:.85;padding:6px 11px 0 0;
  color:var(--acc)}
.col h2{font:400 clamp(1.4rem,2.4vw,1.9rem)/1.2 'Newsreader',Georgia,serif;
  margin:34px 0 14px;letter-spacing:-.012em}
.col blockquote{margin:26px 0;padding-left:20px;border-left:2px solid var(--acc);
  font-style:italic;font-size:19px;line-height:1.55;color:var(--ink)}
.figure{margin:30px 0;background:var(--card);border:1px solid var(--line);padding:22px}
.figure .cap{margin-top:14px;font:400 11.5px/1.55 'IBM Plex Mono',monospace;color:var(--dim)}
.rule{height:1px;background:var(--line);margin:0}
.more{padding:clamp(38px,5vw,64px) 0;border-top:1px solid var(--line)}
.more .list{display:grid;gap:1px;background:var(--line);border:1px solid var(--line);margin-top:24px}
@media(min-width:820px){.more .list{grid-template-columns:repeat(3,1fr)}}
.more .it{background:var(--card);padding:22px 20px 26px}
.more .it .n{font:400 11px/1 'IBM Plex Mono',monospace;color:var(--acc);letter-spacing:.12em}
.more .it h3{font:400 19px/1.24 'Newsreader',Georgia,serif;margin:12px 0 0;letter-spacing:-.01em}
.more .it p{margin:9px 0 0;font-size:14.5px;line-height:1.6;color:var(--mid)}
footer{border-top:1px solid var(--line);padding:32px 0 62px;color:var(--dim);
  font:400 11px/1.6 'IBM Plex Mono',monospace;letter-spacing:.1em;text-transform:uppercase}
"""


def _stackplot():
    """Days-to-first-ship for the five operated companies, drawn to scale. A
       figure in an essay has to carry a number the prose does not repeat."""
    data = [("olldae", 11), ("Dabney & Co.", 21), ("Ops Layer", 21), ("Duezy", 34), ("Kronos", 52)]
    mx, bars = 56, []
    for i, (name, d) in enumerate(data):
        y = 26 + i * 34
        w = 300 * d / mx
        bars.append(
            f'<text x="0" y="{y+11}" font-family="IBM Plex Mono" font-size="11.5" '
            f'fill="#4B453C">{name}</text>'
            f'<rect x="132" y="{y}" width="{w:.1f}" height="16" fill="#1F5B4E"/>'
            f'<text x="{132+w+9:.1f}" y="{y+12.5}" font-family="IBM Plex Mono" '
            f'font-size="11" fill="#7C7367">{d} d</text>')
    return (f'<svg viewBox="0 0 520 200" style="width:100%;height:auto;display:block">'
            f'{"".join(bars)}</svg>')


def c10():
    more = "".join(
        f'<div class=it><div class=n>{n}</div><h3>{t}</h3><p>{p}</p></div>'
        for n, t, p in [
            ("No. 02", "Against the discovery phase",
             "Six weeks of workshops produces a document. A week inside the actual inbox produces a decision."),
            ("No. 03", "The derived artifact problem",
             "Anything generated from something else, with no producer that regenerates it, is stale on a countdown."),
            ("No. 04", "Why we do not show logos",
             "A wall of client marks is a claim about who chose you. Ours is a claim about what we run.")])
    return shell("10", "Field Note", "stripe press / works in progress", "THE THINKING", C10_CSS, f"""
{nav("Loveleeday Studios",
     [("Notes", 0), ("Work", 1), ("Companies", 1), ("Practice", 1),
      ("Archive", 0), ("Subscribe", 0)],
     util=["FIELD NOTES", "ISSUE 01 &middot; SEPTEMBER 2026", "PUBLISHED MONTHLY",
           "RSS", "SUBSCRIBE"],
     section=["No. 01 &mdash; Eleven days", "No. 02 &mdash; Against discovery",
              "No. 03 &mdash; Derived artifacts", "No. 04 &mdash; No logos",
              "Index"],
     ctas=["Subscribe"])}

<div class="stage mast-art"><canvas data-motion="prism"></canvas>
  <div class=veil></div></div>

<div class=masthead><div class=w>
  <p class=eyebrow>Field note no. 01 &middot; September 2026</p>
  <h1>The fastest thing we ever shipped took <em>eleven days</em>, and that is the least
  interesting fact about it.</h1>
  <p class=by>LOVELEEDAY Studios &middot; Kalamazoo, Michigan &middot; 9 min</p>
</div></div>

<div class=w><div class=piece>
  <div class=marg>
    <p><b>Summary.</b> Speed is a consequence of how narrow the first version is, not of
    how fast anyone worked.</p>
    <p><b>Method.</b> Intervals taken from the repository &mdash; first commit to first
    production traffic.</p>
    <p><b>Figure 1.</b> Five companies we own and run, by days to first ship.</p>
  </div>
  <div class=col>
    <p class=first>Eleven days is the number people ask about, and it is the wrong number,
    because it describes the wrong thing. It is not a measure of how quickly anyone typed.
    It is a measure of how much we agreed not to build.</p>
    <p>olldae shipped in eleven days because its first version did one thing: it turned a
    catering enquiry into a priced quote in a single session. It could not do inventory. It
    could not do recipes. It could not do the four things that now make up most of the
    product. Those came later, paid for by the venues who had already started using the one
    thing that worked.</p>
    <blockquote>A short build is not a fast build. It is a small one, and choosing what to
    leave out is the entire job.</blockquote>
    <h2>What the interval actually measures</h2>
    <p>Put the five companies side by side and the spread is not explained by complexity.
    Kronos took five times as long as olldae and is not five times the product. It took
    longer because it touches money across multiple entities, and the first version could
    not be narrow &mdash; a financial tool that is right about four of five entities is
    worse than no tool.</p>
    <div class=figure>{_stackplot()}
      <div class=cap>Fig. 1 &mdash; Days from first commit to first production traffic, five
      operated companies, 2025&ndash;2026. Drawn to scale from repository history.</div>
    </div>
    <p>So the honest version of the claim is narrower than the headline: when a product can
    be made narrow, we make it narrow and it ships in days. When it cannot, we say so at the
    start, and the estimate goes up before the work does rather than after.</p>
  </div>
  <div></div>
</div></div>

<div class=more><div class=w>
  <p class=eyebrow>More notes</p>
  <div class=list>{more}</div>
</div></div>

<footer><div class=w>Loveleeday Studios &middot; Field notes &middot; Kalamazoo, Michigan</div></footer>
""")


BUILDERS = [("c05-prospectus.html", c5), ("c06-atlas.html", c6), ("c07-casefile.html", c7),
            ("c08-spec.html", c8), ("c09-catalogue.html", c9), ("c10-fieldnote.html", c10)]

if __name__ == "__main__":
    for name, fn in BUILDERS:
        (HERE / name).write_text(fn())
        print("wrote", name)
