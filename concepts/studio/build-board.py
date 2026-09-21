#!/usr/bin/env python3
"""The system board: how this company talks about its intelligence model, and
   how that connects to hiring it.

     python3 concepts/studio/build-board.py   ->  concepts/studio/board.html

   Daniel, 2026-09-21: "figure out how to organize things in a way of talking
   about our intelligence model which is what you do currently on loveleeday
   and how we then connect it to clients that might be best, think through this
   with a few employees and come up with a board design of component and layout
   and messaging."

   So this is not a mood board. It is a decision surface with four panels --
   THE SPINE (what the argument is), THE ORDER (what a visitor meets and when),
   THE COMPONENTS (what has to be built), THE EVIDENCE (what is checkable) --
   plus what NOT to claim, because the whole argument is that claims here are
   verifiable and an overstatement anywhere costs the rest.

   Everything on it is sourced. Where a claim points at a file and line, it was
   read, not recalled.
"""
from pathlib import Path

HERE = Path(__file__).parent
ROOT = HERE.parents[1]

CREAM, PAPER, SUNK, DEEP = "#FBF8F2", "#FFFFFF", "#F2EDE3", "#16243A"
INK, MID, DIM, LINE = "#16243A", "#45536A", "#616D7C", "#E6E0D6"
TEAL, COPPER = "#0E7877", "#9B5C3E"

CSS = f"""
*,*::before,*::after{{box-sizing:border-box}}
body{{margin:0;background:{CREAM};color:{INK};
  font:400 15px/1.66 'Mulish',ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}}
a{{color:inherit;text-decoration:none}}
.w{{max-width:1360px;margin:0 auto;padding:0 clamp(20px,3vw,44px)}}
.lab{{font:500 10px/1 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.18em;
  text-transform:uppercase;color:{DIM}}}
header{{background:{DEEP};color:#F6F3EC;padding:clamp(44px,6vw,80px) 0 clamp(36px,4.4vw,58px)}}
header .lab{{color:#96A3B6}}
header h1{{font:800 clamp(2.1rem,4.4vw,3.3rem)/1.03 'Manrope',system-ui,sans-serif;
  letter-spacing:-.04em;margin:16px 0 0;max-width:24ch}}
header p{{margin:20px 0 0;max-width:74ch;color:#C6CEDB;font-size:16px}}
header .who{{margin-top:26px;display:flex;gap:10px;flex-wrap:wrap}}
header .who span{{border:1px solid #33435C;border-radius:3px;padding:6px 11px;
  font:500 10.5px/1 'IBM Plex Mono',monospace;letter-spacing:.1em;
  text-transform:uppercase;color:#A9B7C9}}
section{{border-bottom:1px solid {LINE};padding:clamp(44px,5.4vw,76px) 0}}
h2{{font:800 clamp(1.5rem,2.8vw,2.2rem)/1.08 'Manrope',system-ui,sans-serif;
  letter-spacing:-.035em;margin:14px 0 0}}
section > .w > p.intro{{margin:18px 0 0;max-width:76ch;color:{MID};font-size:15.5px}}
.panel{{background:{PAPER};border:1px solid {LINE};padding:clamp(22px,2.4vw,32px);
  margin-top:26px}}
.panel h3{{font:700 15px/1.3 'Manrope',sans-serif;letter-spacing:-.02em;margin:0 0 4px}}
.spine{{background:{PAPER};border:1px solid {INK};border-left:5px solid {TEAL};
  padding:clamp(24px,2.8vw,36px);margin-top:28px}}
.spine .q{{font:800 clamp(1.25rem,2.3vw,1.75rem)/1.28 'Manrope',sans-serif;
  letter-spacing:-.025em;margin:12px 0 0}}
.spine .body{{margin:18px 0 0;max-width:80ch;color:{MID}}}
.cols{{display:grid;gap:16px;margin-top:26px}}
@media(min-width:900px){{.cols.c3{{grid-template-columns:repeat(3,1fr)}}
  .cols.c2{{grid-template-columns:1fr 1fr}}}}
.card{{background:{PAPER};border:1px solid {LINE};padding:22px 22px 24px}}
.card .k{{font:500 10px/1 'IBM Plex Mono',monospace;letter-spacing:.14em;
  text-transform:uppercase;color:{COPPER}}}
.card h4{{font:700 16px/1.25 'Manrope',sans-serif;letter-spacing:-.02em;margin:11px 0 0}}
.card p{{margin:9px 0 0;font-size:13.8px;line-height:1.6;color:{MID}}}
.card .why{{margin-top:12px;font-size:12.5px;color:{DIM};border-top:1px solid {LINE};
  padding-top:10px}}
.ladder{{margin-top:26px;border-top:1px solid {INK}}}
.rung{{display:grid;gap:16px;padding:18px 0;border-bottom:1px solid {LINE};align-items:start}}
@media(min-width:860px){{.rung{{grid-template-columns:46px 1.15fr 1.5fr 190px}}}}
.rung .n{{font:800 20px/1 'Manrope',sans-serif;color:{TEAL};letter-spacing:-.03em}}
.rung b{{font:700 15px/1.35 'Manrope',sans-serif;letter-spacing:-.02em;display:block}}
.rung p{{margin:6px 0 0;font-size:13.5px;line-height:1.58;color:{MID}}}
.rung .src{{font:400 11.5px/1.55 'IBM Plex Mono',monospace;color:{DIM}}}
.order{{display:grid;gap:16px;margin-top:26px}}
@media(min-width:900px){{.order{{grid-template-columns:1fr 1fr}}}}
.ocol{{background:{PAPER};border:1px solid {LINE}}}
.ocol .hd{{padding:14px 20px;border-bottom:1px solid {LINE};
  font:500 10.5px/1 'IBM Plex Mono',monospace;letter-spacing:.13em;text-transform:uppercase}}
.ocol.now .hd{{color:{COPPER}}} .ocol.next .hd{{color:{TEAL}}}
.step{{display:grid;grid-template-columns:30px 1fr;gap:12px;padding:13px 20px;
  border-bottom:1px solid {LINE}}}
.step:last-child{{border-bottom:0}}
.step .i{{font:500 11px/1.5 'IBM Plex Mono',monospace;color:{DIM}}}
.step b{{font:700 14px/1.35 'Manrope',sans-serif;letter-spacing:-.015em;display:block}}
.step span{{display:block;margin-top:4px;font-size:12.6px;color:{MID};line-height:1.55}}
.step em{{font-style:normal;color:{TEAL};font-family:'IBM Plex Mono',monospace;font-size:11.5px}}
table{{width:100%;border-collapse:collapse;margin-top:24px;font-size:13.5px}}
th{{text-align:left;font:500 10px/1 'IBM Plex Mono',monospace;letter-spacing:.13em;
  text-transform:uppercase;color:{DIM};padding:0 14px 10px 0;border-bottom:1.5px solid {INK}}}
td{{padding:12px 14px 12px 0;border-bottom:1px solid {LINE};vertical-align:top;color:{MID}}}
td.n{{color:{INK};font-weight:600;white-space:nowrap}}
td.t{{font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:{DIM}}}
.pill{{display:inline-block;font:500 9.5px/1 'IBM Plex Mono',monospace;letter-spacing:.1em;
  text-transform:uppercase;border:1px solid currentColor;border-radius:3px;padding:4px 7px}}
.pill.new{{color:{TEAL}}} .pill.keep{{color:{DIM}}} .pill.cut{{color:{COPPER}}}
.warn{{background:{PAPER};border:1px solid {COPPER};border-left:5px solid {COPPER};
  padding:22px 24px;margin-top:16px}}
.warn b{{display:block;font:700 15px/1.3 'Manrope',sans-serif;letter-spacing:-.02em}}
.warn p{{margin:8px 0 0;font-size:13.8px;color:{MID};line-height:1.6}}
.warn .ev{{margin-top:10px;font:400 11.5px/1.5 'IBM Plex Mono',monospace;color:{DIM}}}
footer{{padding:36px 0 70px;color:{DIM};font:400 12px/1.7 'IBM Plex Mono',monospace}}
.mocks{{display:grid;gap:18px;margin-top:28px}}
@media(min-width:900px){{.mocks{{grid-template-columns:1fr 1fr}}}}
.mock{{display:block;background:{PAPER};border:1px solid {LINE};overflow:hidden;
  transition:border-color .16s,box-shadow .16s}}
.mock:hover{{border-color:{INK};box-shadow:0 18px 38px -26px rgba(22,36,58,.45)}}
.mock .shot{{border-bottom:1px solid {LINE};background:{SUNK};max-height:390px;overflow:hidden}}
.mock .shot img{{width:100%;display:block}}
.mock .mb{{padding:18px 20px 22px}}
.mock .mb b{{font:800 18px/1.2 'Manrope',sans-serif;letter-spacing:-.03em}}
.mock .mb p{{margin:9px 0 0;font-size:13.5px;line-height:1.58;color:{MID}}}
.mock .open{{display:inline-block;margin-top:14px;background:{INK};color:{CREAM};
  font:600 12px/1 'Manrope',sans-serif;padding:9px 15px;border-radius:4px}}
"""


def card(k, h, p, why=None):
    w = f'<div class=why>{why}</div>' if why else ''
    return f'<div class=card><div class=k>{k}</div><h4>{h}</h4><p>{p}</p>{w}</div>'


def rung(n, title, body, src):
    return (f'<div class=rung><div class=n>{n}</div>'
            f'<div><b>{title}</b></div><div><p>{body}</p></div>'
            f'<div class=src>{src}</div></div>')


def step(i, title, body, obj=None):
    o = f'<em>{obj}</em>' if obj else ''
    return (f'<div class=step><div class=i>{i}</div><div><b>{title}</b>'
            f'<span>{body}</span>{o}</div></div>')


MOCKUPS = [
    ("home", "Home", "Eight stages. Hero object, component rail, three mechanism stages, the hand-off into photography, the work grid, the close."),
    ("system", "Design system", "Tokens with live contrast ratios, the type scale, four stage types, the evidence components and eight motion objects &mdash; rendered from the same code the pages use."),
    ("arthur", "/arthur", "The deep technical page. Five components as a spec table, bitemporality as its own stage, and a connector strip that distinguishes live from configured from dormant."),
    ("work", "/work", "Two registers on one page: client rebuilds as a card grid, owned companies as a ledger. Never the same grid."),
    ("about", "/about", "How engagements run, and the one sentence that names the private review portal without linking it."),
    ("contact", "/contact", "The funnel destination."),
    ("privacy", "/privacy", "Exists because the footer links to it."),
    ("terms", "/terms", "Exists because the footer links to it."),
]


def mock_grid():
    out = []
    for slug, name, note in MOCKUPS:
        out.append(
            f'<a class=mock href="site/{slug}.html" target=_blank>'
            f'<div class=shot><img src="site-thumbs/{slug}.png" alt="{name}"></div>'
            f'<div class=mb><b>{name}</b><p>{note}</p>'
            f'<span class=open>Open {name} &nbsp;&rarr;</span></div></a>')
    return f'<div class=mocks>{"".join(out)}</div>'


def page(spine, ladder, now, nxt, comps, evidence, analogues, warnings, team):
    mocks = mock_grid()
    return f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>LOVELEEDAY &mdash; the system board</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Mulish:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel=stylesheet>
<style>{CSS}</style></head><body>

<header><div class=w>
  <div class=lab>System board &middot; 2026-09-21 &middot; four desks</div>
  <h1>How we talk about the intelligence model, and how that becomes a reason to hire us.</h1>
  <p>The duality has never been resolved on the site: Arthur is an intelligence
  model we built for ourselves, and the business is people paying us to build
  software. Lead with the product and we read as a SaaS company moonlighting.
  Bury it and we read as any studio. This board is the argument that joins them,
  the order a visitor meets it in, and the components it takes to build.</p>
  <div class=who>{team}</div>
</div></header>

<section><div class=w>
  <div class=lab>00 &middot; The mockups</div>
  <h2>Every page, built.</h2>
  <p class=intro>Not descriptions. Each one renders in the Keynote register, wearing the
  production tokens, using the real content from <code>src/content/work.ts</code>. The design
  system sheet imports the same functions the pages import, so the specimen cannot drift from
  what ships. Click any card to open it full size.</p>
  {mocks}
</div></section>

<section><div class=w>
  <div class=lab>01 &middot; The spine</div>
  <h2>One sentence the whole site hangs from.</h2>
  {spine}
</div></section>

<section><div class=w>
  <div class=lab>02 &middot; The proof ladder</div>
  <h2>The order a sceptical buyer will accept it in.</h2>
  <p class=intro>A buyer stops reading at the first claim they cannot check. The
  present homepage opens with the least checkable rung &mdash; the architecture
  &mdash; and reaches concrete evidence fourth. This is the inversion.</p>
  <div class=ladder>{ladder}</div>
</div></section>

<section><div class=w>
  <div class=lab>03 &middot; The order</div>
  <h2>What the page does now, and what it should do.</h2>
  <div class=order>
    <div class="ocol now"><div class=hd>Now &mdash; live at loveleedaystudios.com</div>{now}</div>
    <div class="ocol next"><div class=hd>Proposed &mdash; Keynote register</div>{nxt}</div>
  </div>
</div></section>

<section><div class=w>
  <div class=lab>04 &middot; Components</div>
  <h2>What has to exist for the argument to be buildable.</h2>
  {comps}
</div></section>

<section><div class=w>
  <div class=lab>05 &middot; Evidence</div>
  <h2>The components that carry proof.</h2>
  <p class=intro>The whole spine depends on claims being checkable, so the parts
  that display evidence are load-bearing rather than decorative. Each needs real
  data or it should not render at all.</p>
  {evidence}
</div></section>

<section><div class=w>
  <div class=lab>06 &middot; Analogues</div>
  <h2>How companies with the same duality solve it.</h2>
  {analogues}
</div></section>

<section><div class=w>
  <div class=lab>07 &middot; Do not say</div>
  <h2>The claims that would cost us the rest of the page.</h2>
  <p class=intro>Every one of these is contradicted by something already written
  in this repo. A buyer who catches one stops believing the checkable ones too.</p>
  {warnings}
</div></section>

<footer><div class=w>
  Generated by <code>concepts/studio/build-board.py</code>. Every file-and-line
  citation on this board was read, not recalled.
</div></footer>
</body></html>"""


# ---------------------------------------------------------------------------
# CONTENT. Four desks contributed; every claim that points at a file was read.
# ---------------------------------------------------------------------------

TEAM = "".join(f"<span>{t}</span>" for t in
               ["Positioning", "Information architecture", "Component system",
                "Competitive analogues", "Verified in-session"])

SPINE = """
<div class=spine>
  <div class=lab>The chosen spine</div>
  <p class=q>We hold client work to the four checks we built into Arthur for our
  own businesses &mdash; who a record is actually about, when it was true, where
  it came from, and proof that it happened. Hiring us buys the discipline, not
  just the code.</p>
  <div class=body><p>A studio&rsquo;s credibility problem is that &ldquo;we write
  good code&rdquo; cannot be falsified until the invoice is paid. This company has
  a falsifiable version of that claim sitting in its own repository. Arthur is
  four enforced disciplines built for ourselves rather than for a pitch, and the
  same posture shows up independently inside shipped systems &mdash; idempotent
  webhooks, OAuth refresh handled unasked, per-module health checks. Nobody
  commissioned that care, which is exactly why it is evidence. The offer is not
  &ldquo;run on Arthur&rdquo;. It is that the person who will not ship an edge
  function without idempotency will not ship your migration without a rollback
  path either.</p></div>
</div>
<div class="cols c2">
""" + card("Rejected &middot; A",
           "Product-first: &ldquo;Arthur is our platform, hire us to deploy it&rdquo;",
           "The repository will not support it under questioning. Arthur&rsquo;s own FAQ "
           "says an adapter in the architecture does not mean a live connection to your "
           "systems exists, and there is no case anywhere of Arthur running inside a "
           "client stack.",
           "Collapses into the &ldquo;SaaS company moonlighting&rdquo; distrust, and worse "
           "&mdash; the product claim itself is unverified.") + card(
           "Rejected &middot; B",
           "Bury it: &ldquo;fixed price, production code, done in days&rdquo;",
           "Close to what COPY.md argues today, down to a $200 bug-fix tier. It throws away "
           "the one differentiated asset a hundred other studios do not have: a documented "
           "internal standard for correctness.",
           "Generic against six-figure competitors, and underselling against $500 ones.") + """
</div>"""

LADDER = (
  rung("01", "This is a company that ships",
       "A live URL and a dated measurement, needing no interpretation. Thirty-eight sites "
       "measured on page weight, Lighthouse mobile, live organic position and "
       "accessibility. Exists today, and is currently the fourth thing a visitor meets.",
       "work.ts &middot; figures[] &middot; olldae.com live")
+ rung("02", "We do this cold, for companies we have never spoken to",
       "The six uncommissioned rebuilds. The closest analogue to what a buyer is about to "
       "experience: someone looking at an unfamiliar business and producing sourced "
       "criticism plus a working alternative, unpaid. It answers &ldquo;would they do this "
       "for me&rdquo;.",
       "work.ts &middot; studies[] &middot; stays unnamed")
+ rung("03", "The standard is a habit we are not paid to have",
       "The five companies we own and run. Highest-trust rung precisely because there was "
       "no client to blame for a corner cut, so a corner not cut is real evidence. Lives on "
       "/work, correctly labelled and correctly off the homepage &mdash; it needs one "
       "linking sentence, not promotion.",
       "work.ts &middot; operated[] &middot; &ldquo;we were our own customer&rdquo;")
+ rung("04", "Here is the architecture, if you want to check it yourself",
       "Arthur&rsquo;s components, with the FAQ hedges intact. Confirmation for a reader "
       "already convinced, not an opening argument. The live homepage leads here, which "
       "asks an unconvinced visitor to evaluate an abstraction before seeing one concrete "
       "thing.",
       "arthur/page.tsx &middot; currently homepage H1")
+ rung("05", "Contact", "The existing close already carries the argument.",
       "page.tsx:295 &middot; &ldquo;See the question. Build the answer.&rdquo;"))

NOW = (step("01", "Arthur / Ontology", "The abstract product claim, first. Least checkable rung in the strongest position.")
     + step("02", "Metric band", "Figures, before the reader has been given a reason to care.")
     + step("03", "Five properties. Enforced, not promised.", "Architecture.")
     + step("04", "Four names. One company.", "The resolution demonstration.")
     + step("05", "Thirty-eight sites. Six rebuilds.", "The strongest evidence, fifth.")
     + step("06", "Confidence comes from the evidence.", "A full dark stage &mdash; the register rejected on 2026-09-21.")
     + step("07", "See the question. Build the answer.", "Close."))

WARNINGS = "".join(f"""<div class=warn><b>{b}</b><p>{p}</p><div class=ev>{e}</div></div>"""
  for b, p, e in [
    ("&ldquo;Arthur connects to your systems&rdquo;",
     "There is no case anywhere in the repository of Arthur running against an external "
     "company&rsquo;s data. A buyer who asks for one reference integration gets nothing, and "
     "the site would be caught contradicting itself on the same page.",
     "Contradicted by arthur/page.tsx &mdash; &ldquo;an adapter in the architecture does not "
     "mean a live connection to your systems already exists&rdquo;"),
    ("&ldquo;Arthur learns and improves on its own&rdquo;",
     "Any self-improving or continuously-learning framing. This is one of the few places the "
     "site is already more honest than typical AI marketing. A future hero line must not "
     "undo it.",
     "Contradicted by arthur/page.tsx &mdash; &ldquo;we do not claim unrestricted "
     "self-improvement or automatic quality gains&rdquo;"),
    ("&ldquo;Five companies, five principles, one standard&rdquo;",
     "It sounds like a headline and is actually a false-customer claim. The figures array "
     "carries &ldquo;5 &mdash; architectural components in Arthur&rdquo;, and there are also "
     "exactly five owned companies. Totalling or rhyming the two implies five customers "
     "chose us. They did not; we chose ourselves.",
     "Verified in-session: work.ts figures[] k=&ldquo;5&rdquo; beside operated[] length 5"),
    ("Two different lists both called &ldquo;the five&rdquo;",
     "The homepage promises identity resolution, bitemporality, lineage, bounded autonomy and "
     "observed completion. The Arthur page lists persistent memory, identity resolution, "
     "bitemporal record, lineage and tools/routing/verification. Three overlap, four do not. "
     "A buyer reading both pages notices, and the proof ladder depends on not having that "
     "kind of inconsistency.",
     "Verified in-session: page.tsx GUARANTEES vs arthur/page.tsx COMPONENTS"),
  ])

ANALOGUES = """
<div class="cols c3">
""" + card("Steal &middot; Stripe",
           "Services are demoted to a mid-page accelerant",
           "The homepage is entirely product. &ldquo;Realize value faster with dedicated "
           "experts&rdquo; appears after the product showcase and before the deep customer "
           "stories. Services read as an accelerant to the product, never a second business.",
           "Verified: stripe.com fetched") + card(
           "Steal &middot; QuantumBlack",
           "Nest the intelligence under a stated parent",
           "McKinsey &rarr; QuantumBlack &rarr; Labs. Separate URL paths and distinct page "
           "templates for the capability, its own products and client outcomes &mdash; an "
           "ownership hierarchy legible at every level.",
           "Homepage treatment unverified &mdash; the fetch returned no body content") + card(
           "Steal &middot; Thoughtworks",
           "Give the intelligence its own dateable artefact",
           "The Technology Radar is a versioned, dated snapshot with its own URL that gets "
           "re-cited for years. It is deliberately NOT on the homepage &mdash; which is also "
           "the cost: most visitors never find it.",
           "Verified in-session: hero is &ldquo;We don&rsquo;t just do AI / We do AI that "
           "works&rdquo; with AI/works&trade;; Radar absent from the homepage") + """
</div>
<div class=warn><b>The failure mode most likely to bite us &mdash; and it is not hypothetical</b>
<p>A single &ldquo;companies we have built&rdquo; grid where five owned companies and six
client rebuilds sit in visually identical cards separated only by a small badge. High Alpha
ships exactly this: every portfolio card is tagged Studio, Co-Invest, Anchor or Acquired.
Pioneer Square Labs splits Studio from Ventures cleanly at the top and then re-blurs it in the
portfolio grid. A label in the corner of a card is not a structural distinction. A different
page template and a stated sentence is.</p>
<div class=ev>Verified in-session by fetching highalpha.com: the four tags are present and
the meaning of each is defined nowhere on the page. A visitor cannot tell which companies
were founded and which were merely invested in.</div></div>"""


NEXT = (step("01", "Arthur.", "The object layer, as one rendered object. A drawn object reads as a product shot; there is no photograph of an architecture.", "motion: lattice")
      + step("02", "Lineup rail", "Arthur&rsquo;s five architectural components as small drawn marks &mdash; NOT the five owned companies. It does the same &ldquo;there is more than one thing here&rdquo; job without breaking the content rule on the first scroll-stop.", "drawn marks &times;5")
      + step("03", "Four names. One company.", "Identity resolution. The motion library&rsquo;s own note on this object calls it the best explanation of identity resolution that fits in one frame.", "motion: bundle")
      + step("04", "Every figure, back to its source.", "Lineage. A progressive path with a crosshair reading out value, index, source reference and delta.", "motion: series")
      + step("05", "Built to prove it ran.", "Verified execution &mdash; a stage that does not exist today at all, though it is one of the four disciplines the spine rests on.", "motion: flow")
      + step("&mdash;", "THE HAND-OFF", "The medium changes register before the copy does: five drawn stages, then the first photograph. A visitor feels the shift from &ldquo;how the system works&rdquo; to &ldquo;who we do this for&rdquo; before reading a word. It is also the structural midpoint, so neither half reads as bolted on.")
      + step("06", "Built. Shipped. Running.", "The first photograph on the page, because it is the first claim about the world rather than about the system. Numbers read from work.ts figures &mdash; one canonical source.", "photograph + metric band")
      + step("07", "Thirty-eight sites. Six rebuilds.", "The client rebuild grid, using the real frames. The separate four-photo rail above it is cut: it showed the same four sectors a second time with no new information.", "photographs + contour texture")
      + step("08", "See the question. Build the answer.", "The one stage where the object is signature rather than argument.", "motion: prism"))

COMPONENTS = """
<p class=intro>Five components do most of the work. The rest are extractions of
markup that is currently written twice.</p>
<table><thead><tr><th>Component</th><th>What it does</th><th>Maps to</th><th></th></tr></thead><tbody>
""" + "".join(f"<tr><td class=n>{n}</td><td>{d}</td><td class=t>{m}</td><td>{p}</td></tr>" for n,d,m,p in [
  ("Stage &starf;", "One polymorphic full-viewport section every other stage is built from. Get its API wrong and every section pays.", "NEW &middot; components/Stage.tsx", '<span class="pill new">new</span>'),
  ("Figure &starf;", "The canvas engine. It is the entire visual argument &mdash; the thing that makes the register read as a product rather than a template.", "components/graphics/Figure.tsx", '<span class="pill keep">extend</span>'),
  ("ConsolePanel &starf;", "The most persuasive proof object on the site, currently locked to one hard-coded dataset. Generalising it lets resolution, lineage, bitemporality and connectors reuse one component instead of four.", "home/ArthurConsole.tsx", '<span class="pill keep">promote</span>'),
  ("Evidence primitives &starf;", "Six parts that carry proof. If these are not consistent, nothing else on the page is credible.", "NEW &middot; components/evidence/*", '<span class="pill new">new</span>'),
  ("ConnectorGrid &starf;", "The only component that shows the CLIENT&rsquo;s systems rather than Arthur&rsquo;s. It does the second half of the brief.", "NEW &middot; from Figure&rsquo;s schematic data", '<span class="pill new">new</span>'),
  ("Hero / ProductRail / WorkCard / CloseCTA", "Currently inlined twice each &mdash; once in the concept, once as raw JSX on the live homepage. Extract.", "NEW extractions", '<span class="pill new">new</span>'),
  ("ui/badge, button, card, separator", "shadcn scaffolding styled against tokens that do not exist in this system. Nothing imports them.", "src/components/ui/*", '<span class="pill cut">delete</span>'),
]) + """</tbody></table>
<div class="cols c2">
""" + card("Stage type 01", "Object stage &mdash; always light",
           "One mechanism, one drawn object, never two mechanics in one stage. Alternating cream and sunk grounds so two never repeat.",
           "Never uses the dark ground. That budget is spent once, elsewhere.") + card(
           "Stage type 02", "Photographic stage &mdash; dark on photo",
           "Full-bleed image with a navy scrim, metric band under the heading. The studio&rsquo;s own photography only.",
           "At most once per page. Scrim opacity must be checked against the actual image, not assumed.") + card(
           "Stage type 03", "Data stage &mdash; the one dark stage",
           "Navy ground, no photo. The numbers themselves are the object. Every value carries a source.",
           "Used exactly once, or &ldquo;dark is a stage, not a theme&rdquo; collapses.") + card(
           "Stage type 04", "Quote stage &mdash; new, light only",
           "Narrower shell so it does not compete with the display stages. Deliberately set smaller than a headline, because a quote is not the company&rsquo;s own claim.",
           "If there is no real sourced quote, omit the stage. Do not fabricate one.") + """
</div>"""

EVIDENCE = """<table><thead><tr><th>Component</th><th>Required data</th><th>The rule it enforces</th></tr></thead><tbody>
""" + "".join(f"<tr><td class=n>{n}</td><td class=t>{d}</td><td>{r}</td></tr>" for n,d,r in [
  ("LineageRow", "property · value · sourceSystem · sourceRef · observedAt", "Missing source or timestamp renders a visible <b>unsourced</b> state &mdash; never silently drops the column."),
  ("MetricBand", "value · caption · sourceRef", "The caption carries the source inline. A number with no trail is not reportable."),
  ("SpecTable", "label · value · detail · status", "Status vocabulary is Confirmed / Partial / Dormant / Not found &mdash; never upgraded without evidence."),
  ("StatusStrip", "label · state · detail · <b>checkedAt</b>", "checkedAt is required, not optional. A status strip with no timestamp is decoration, and must never show a live dot without one."),
  ("ChangelogEntry", "date · change · evidenceHref", "Empty renders one dim row, not a vanished section &mdash; a section that disappears reflows the page unpredictably."),
  ("ProvenanceChip", "ref · kind · href", "Always prints the literal reference string, never a paraphrase. Being exactly checkable is its whole job."),
]) + """</tbody></table>
<div class=warn><b>Four defects this board found in my own c1 page</b>
<p>The footer links to /privacy and /terms and neither route exists &mdash; dead trust
links on a site whose pitch is that every value carries a trail. The product rail tiles
the five owned companies on the homepage, which contradicts work.ts&rsquo;s explicit rule
that they stay off it. The stat block reads 5/6/38/11 while work.ts figures reads 6/38/5/2,
so the same page and its data file disagree. And the footer asserts &ldquo;an Aspen &amp;
May company&rdquo;, which appears nowhere in src, COPY.md or BRAND.md &mdash; I took it
from conversation, not from ground truth.</p>
<div class=ev>All four verified in-session. One further criticism was raised and is WRONG:
&ldquo;Arthur 4.0&rdquo; is not unsourced &mdash; it is live in Nav.tsx:73. It stays.</div></div>"""


if __name__ == "__main__":
    out = page(SPINE, LADDER, NOW, NEXT, COMPONENTS, EVIDENCE, ANALOGUES, WARNINGS, TEAM)
    (HERE / "board.html").write_text(out)
    print("wrote", HERE / "board.html", len(out), "bytes")
