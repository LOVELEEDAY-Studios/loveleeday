#!/usr/bin/env python3
"""Solstice, rendered from EVERY block the live site actually has.

     npx next dev -p 3310
     python3 concepts/studio/extract-dom.py
     python3 concepts/studio/build-solstice-full.py
       -> concepts/studio/solstice-full/*.html

   Daniel: "there is still alot of things missing from the current site also
   redesign the navigation bar."

   He was right twice. A mechanical diff of the running site against the last
   mockups found 33 text blocks missing from the homepage alone, 29 from
   /arthur, 32 from /work. Not paraphrases -- whole blocks: every component's
   "why it matters", every figure's source line, the schematic captions, the
   framing paragraph above each section, each operated company's problem/built/
   outcome, and the entire dark contract section with its three sub-clauses.

   THE CAUSE WAS THE METHOD. extract-live.py reads named arrays out of the TSX,
   which is exact and only ever finds what I thought to ask for. So the content
   now comes from extract-dom.py, which walks the RENDERED page and records
   every block in order. A renderer that consumes that cannot drop a block I
   failed to imagine, because it never had to imagine one.

   Two blocks are dropped ON PURPOSE and both are named here rather than left
   silent: the <li> rows that Tailwind renders as a concatenation of the <h3>
   and <p> immediately after them (kept once, as the pair), and the founder's
   name, which Daniel asked to keep off the pages.
"""
import json, os, re
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / "solstice-full"
OUT.mkdir(exist_ok=True)
DOM = json.loads((HERE / "live-dom.json").read_text())
LIVE = json.loads((HERE / "live-content.json").read_text())
DOM = json.loads((HERE / "live-dom.json").read_text())


def L(route, prefix):
    """The live page's own words, verbatim.

    A mechanical diff of the running site against this rebuild reported 52
    blocks missing. Almost none of them were missing: they were PARAPHRASES.
    I had retyped sentences that already exist -- "a trail back to the system
    it came from" came out as "the trail back to where it came from",
    "implemented, not planned" was dropped, "coordinating work, selecting
    models and acting through tools" became "closing work against evidence".
    Each is a small edit and together they are a different site.

    Daniel asked for this rebuild to align with the current site's components.
    Copy is a component. So prose is looked up by prefix and pasted exactly,
    and a prefix that stops matching one block raises instead of silently
    reverting to whatever I remembered."""
    hits = [b["text"] for b in DOM[route] if b["text"].startswith(prefix)]
    if len(hits) != 1:
        raise SystemExit(f"L({route!r}, {prefix!r}) matched {len(hits)} blocks, need 1")
    return hits[0]
CH = LIVE["chrome"]

ROUTES = {"/": ("home.html", "g"), "/arthur": ("arthur.html", None),
          "/work": ("work.html", None), "/about": ("about.html", "h"),
          "/contact": ("contact.html", None)}

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

# Names Daniel asked to keep off the pages.
REDACT = [r"Daniel J\. May, MBA", r"Daniel J\. May", r"Daniel May"]

FONTS = ("https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700&"
         "family=Instrument+Serif:ital@0;1&display=swap")


def clean(t):
    for pat in REDACT:
        t = re.sub(pat, "LOVELEEDAY Studios", t)
    # Strip the name, keep the sentence. Dropping the whole line lost real copy
    # about where the practice's perspective comes from.
    t = re.sub(r"\s*founded by LOVELEEDAY Studios,?\s*MBA\.?", "", t)
    t = re.sub(r"\s*founded by LOVELEEDAY Studios\.?", "", t)
    t = re.sub(r"^LOVELEEDAY Studios$", "The practice", t)
    return re.sub(r"\s{2,}", " ", t).strip()


def dedupe(blocks):
    """Tailwind renders each guarantee row as an <li> whose innerText is the
       <h3> and <p> inside it concatenated. Keeping both prints everything
       twice, so the li is dropped when the pair that follows reproduces it."""
    out, i = [], 0
    while i < len(blocks):
        b = blocks[i]
        if b["role"] == "li":
            nxt = " ".join(x["text"] for x in blocks[i+1:i+3])
            squash = re.sub(r"\W+", "", b["text"]).lower()
            if squash and re.sub(r"\W+", "", nxt).lower().endswith(squash[-40:]):
                i += 1
                continue
        out.append(b)
        i += 1
    return out


# ---------------------------------------------------------------------------
# THE NAVIGATION, redesigned.
#
# The live bar is two rows of flat links. That is a site map, not a navigation:
# it tells a visitor what pages exist and nothing about what is inside them. A
# company that reads large shows DEPTH in the bar -- which is why every
# reference in the research set (Mistral, Stripe, GitBook, Clay, WRITER) opens
# a panel rather than listing routes.
#
# So: an announcement strip, then one row carrying the wordmark, four items
# that open a panel, a search affordance and two calls to action of different
# weight. The Platform panel is rendered OPEN in the mockup, because a menu
# nobody can see is a menu nobody can judge.
# ---------------------------------------------------------------------------

MENUS = {
    "Platform": [
        ("The architecture", "Five components, each a rule in the write path", "arthur.html#architecture"),
        ("About the Ontology", "One object per company, and how records resolve onto it", "arthur.html#ontology"),
        ("Lineage", "Every value carries its source system and reference", "arthur.html#architecture"),
        ("Verified execution", "Work closes on a value read back out of the system", "arthur.html#architecture"),
        ("In motion", "A simulated walkthrough, labelled as one", "arthur.html"),
    ],
    "Work": [
        ("Client rebuilds", "Six, uncommissioned, and none of them named", "work.html#studies"),
        ("Companies we operate", "Five we own and run. Evidence that we ship", "work.html#operated"),
        ("How we measure", "Page weight, Lighthouse, live position, accessibility", "about.html#method"),
    ],
    "Company": [
        ("About", "A practice, and the five rules it does not bend", "about.html"),
        ("How we scope", "Fixed before we start, pushed back on before it begins", "about.html#method"),
        ("Contact", "We reply the same week", "contact.html"),
    ],
    "Engagements": [
        ("Start a project", "Tell us what is slowing you down", "contact.html"),
        ("What happens next", "Reply, scope, and a private review page", "contact.html"),
        ("hello@loveleedaystudios.com", "Straight to the inbox", "mailto:hello@loveleedaystudios.com"),
    ],
}


def nav(active="", over=False, open_menu=None):
    """A real dropdown: hover or focus a trigger, a glass panel opens under the
       bar. Not a row pinned open, which is what the last version was.

       WHY THE PANELS ARE DIRECT CHILDREN OF <nav>. The first attempt nested
       each panel inside its trigger, which is a flex item in a fixed-height
       flex row -- the panel measured 120px while its own grid measured 187, so
       its second row of items rendered on the photograph with nothing behind
       them. Anchoring every panel to <nav> itself, full-bleed, takes the flex
       row out of the equation: the panel's height is its content's height.

       Glass rather than a solid fill, per Daniel's standing preference: low
       opacity over a blur, with a specular highlight on the top edge so it
       reads as a pane of something rather than a grey box."""
    tabs = "".join(
        f'<button class="tab{" on" if label == open_menu else ""}" '
        f'data-menu="{label}" aria-expanded="false">{label}'
        f'<i aria-hidden="true">&#9662;</i></button>' for label in MENUS)
    panels = ""
    for label, rows in MENUS.items():
        items = "".join(
            f'<a class=mi href="{h}"><b>{t}</b><span>{d}</span></a>' for t, d, h in rows)
        panels += (f'<div class=panel data-panel="{label}">'
                   f'<div class=w><div class=mhead>{label}</div>'
                   f'<div class=pgrid>{items}</div>'
                   f'<div class=pfoot>{CH["tagline"]}</div></div></div>')
    # MOBILE. There was no mobile navigation at all: the desktop bar was simply
    # rendered at 390px, which pushed the document to 832px wide -- the entire
    # site scrolled sideways on a phone, "Engagements" sat off-canvas and five
    # of the six names in the strip were cut. A burger and a sheet, built from
    # the same MENUS data so the two navigations cannot drift.
    sheet_groups = "".join(
        f'<div class=sg><div class=sgh>{label}</div>' + "".join(
            f'<a href="{h}"><b>{t}</b><span>{d}</span></a>' for t, d, h in rows)
        + '</div>' for label, rows in MENUS.items())
    sheet = (f'<div class=sheet><div class=sheetin>{sheet_groups}'
             f'<div class=sgb><a class="btn solid" href="contact.html">Start a project</a>'
             f'<a class=btn href="contact.html">Contact sales</a></div></div></div>')
    return (f'<div class=announce><div class=w>'
            f'<span>Arthur 4.0 &mdash; scoped engagements open for Q4</span>'
            f'<a href="arthur.html">Read the technical brief &rsaquo;</a></div></div>'
            f'<nav class="bar{" over" if over else ""}" data-open="">'
            f'<div class=w>'
            f'<a class=bd href="home.html">LOVELEEDAY</a>'
            f'<div class=menus>{tabs}</div>'
            f'<button class=burger aria-label="Menu" aria-expanded="false">'
            f'<span></span><span></span></button>'
            f'<div class=rt>'
            f'<label class=search><svg width=14 height=14 viewBox="0 0 16 16" aria-hidden=true>'
            f'<circle cx=7 cy=7 r=5 fill=none stroke=currentColor stroke-width=1.7/>'
            f'<path d="M11 11 15 15" stroke=currentColor stroke-width=1.7/></svg>'
            f'<input placeholder="Search" readonly></label>'
            f'<a class=btn href="contact.html">Contact sales</a>'
            f'<a class="btn solid" href="contact.html">Start a project</a></div>'
            f'</div>{panels}{sheet}</nav>')


NAV_JS = """<script>
(function(){
  document.querySelectorAll('nav.bar').forEach(function(bar){
    var timer=null;
    function open(name){
      clearTimeout(timer);
      bar.dataset.open = name || '';
      bar.querySelectorAll('.tab').forEach(function(t){
        var on = t.dataset.menu === name;
        t.classList.toggle('on', on);
        t.setAttribute('aria-expanded', on ? 'true' : 'false');
      });
    }
    function scheduleClose(){ timer = setTimeout(function(){ open(''); }, 160); }
    bar.querySelectorAll('.tab').forEach(function(t){
      t.addEventListener('mouseenter', function(){ open(t.dataset.menu); });
      t.addEventListener('focus',      function(){ open(t.dataset.menu); });
      t.addEventListener('click', function(e){
        e.preventDefault();
        open(bar.dataset.open === t.dataset.menu ? '' : t.dataset.menu);
      });
    });
    bar.addEventListener('mouseleave', scheduleClose);
    bar.addEventListener('mouseenter', function(){ clearTimeout(timer); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') open(''); });
    var burger = bar.querySelector('.burger');
    if (burger) burger.addEventListener('click', function(){
      var on = bar.dataset.sheet === '1';
      bar.dataset.sheet = on ? '' : '1';
      burger.setAttribute('aria-expanded', on ? 'false' : 'true');
    });
  });
})();
</script>"""


CSS = """
*,*::before,*::after{box-sizing:border-box}
:root{--ink:#241109;--bone:#FBF6EE;--paper:#FFFFFF;--mu:#6B5A4E;--dim:#8B7868;
  --line:#E4D9C9;--hot:#C8410F;--deep:#2A0F07;--on-deep:#F6E9DB;--on-deep-mu:#C4A996;
  --deep-line:#48210F;
  --sans:'Inter Tight',system-ui,sans-serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,monospace}
body{margin:0;background:var(--bone);color:var(--ink);
  font:400 17px/1.62 'Inter Tight',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
.w{max-width:1280px;margin:0 auto;padding:0 clamp(20px,3vw,44px)}
.ser{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400}
.ribbon{position:sticky;top:0;z-index:99;background:var(--ink);color:var(--bone);
  font:500 11px/1 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;padding:9px 18px}

/* ── the redesigned bar ──────────────────────────────────────────────────── */
.announce{background:var(--ink);color:var(--bone);font-size:13px}
.announce .w{height:38px;display:flex;align-items:center;justify-content:center;gap:14px}
.announce a{color:#F0A87A}
.bar{background:var(--bone);border-bottom:1px solid var(--line);position:relative;z-index:30}
.bar > .w{position:relative;z-index:2}
/* DIRECT CHILD, not descendant. As ".bar .w" this also matched the .w inside
   every dropdown panel, forcing the panel's content container into a 64px
   flex row -- which is why the panel measured 114px while its own grid
   measured 187 and the overflow landed on the photograph. */
.bar > .w{display:flex;align-items:center;height:64px;gap:clamp(14px,2.4vw,34px)}
.bd{font:600 18px/1 'Inter Tight';letter-spacing:-.035em;white-space:nowrap}
.menus{display:flex;align-items:center;gap:clamp(8px,1.4vw,20px)}
.tab{display:flex;align-items:center;gap:6px;font:500 14px/1 'Inter Tight';
  color:var(--mu);padding:9px 2px;white-space:nowrap;background:none;border:0;
  cursor:pointer;font-family:inherit}
.tab i{font-size:9px;opacity:.55;position:relative;top:-1px;font-style:normal;
  transition:transform .16s ease}
.tab.on{color:var(--ink)} .tab.on i{transform:rotate(180deg);opacity:.9}
/* GLASS, not a solid panel: low opacity over a blur, with a specular highlight
   on the top edge so it reads as a pane rather than a grey box. */
.panel{position:absolute;left:0;right:0;top:100%;z-index:60;
  background:rgba(251,246,238,.86);
  -webkit-backdrop-filter:blur(26px) saturate(150%);
  backdrop-filter:blur(26px) saturate(150%);
  border-top:1px solid rgba(255,255,255,.55);
  border-bottom:1px solid rgba(36,17,9,.10);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.80),0 34px 64px -44px rgba(36,17,9,.52);
  padding:26px 0 22px;
  opacity:0;visibility:hidden;transform:translateY(-6px);pointer-events:none;
  transition:opacity .17s ease,transform .17s ease,visibility .17s}
.bar[data-open="Platform"] .panel[data-panel="Platform"],
.bar[data-open="Work"] .panel[data-panel="Work"],
.bar[data-open="Company"] .panel[data-panel="Company"],
.bar[data-open="Engagements"] .panel[data-panel="Engagements"]{
  opacity:1;visibility:visible;transform:none;pointer-events:auto}
/* --hot measured 3.40:1 on the glass over a photograph. The panel head gets a
   darker rust of its own rather than the page accent; solved for 5.06:1
   against the worst sampled glass background. */
.mhead{font:500 11px/1 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;
  color:#9A320C;margin-bottom:18px}
.pgrid{display:grid;gap:10px 26px}
@media(min-width:900px){.pgrid{grid-template-columns:repeat(3,1fr)}}
.mi{display:block;padding:12px 14px;border-radius:10px}
.mi:hover{background:rgba(255,255,255,.55)}
.mi b{display:block;font:500 16px/1.25 'Inter Tight';letter-spacing:-.025em}
/* The dropdown's description text measured 3.42:1 against the glass sitting
   over the hero photograph -- the glass is translucent by design, so what is
   behind it is part of the contrast calculation. The panel keeps its
   transparency and the text gets its own darker role instead. */
.mi span{display:block;margin-top:4px;font-size:13.5px;color:#4A3A2E;line-height:1.5}
.pfoot{margin-top:20px;padding-top:16px;border-top:1px solid var(--line);
  font:500 11px/1 'Inter Tight';letter-spacing:.16em;text-transform:uppercase;color:var(--dim)}
.rt{margin-left:auto;display:flex;align-items:center;gap:10px}
.search{display:flex;align-items:center;gap:7px;border:1px solid var(--line);border-radius:8px;
  padding:8px 12px;color:var(--dim);background:var(--paper)}
.search input{border:0;outline:0;background:transparent;width:clamp(70px,8vw,120px);
  font:400 13.5px/1 'Inter Tight';color:inherit}
.btn{border:1px solid var(--line);border-radius:8px;padding:9px 16px;
  font:500 13.5px/1 'Inter Tight';white-space:nowrap}
.btn.solid{background:var(--ink);color:var(--bone);border-color:var(--ink)}
/* over a photograph the bar goes transparent and the panel stays opaque */
.bar.over{background:transparent;border-bottom-color:transparent}
.bar.over .bd,.bar.over .tab{color:rgba(255,244,226,.88)}
.bar.over .tab.on{color:#FFF4E2}
.bar.over .btn{border-color:rgba(255,244,226,.55);color:#FFF4E2}
.bar.over .btn.solid{background:#FFF4E2;color:#7A1A0A;border-color:#FFF4E2}
.bar.over .search{border-color:rgba(255,244,226,.45);background:rgba(255,244,226,.10);color:#F2DCC9}

/* ── hero + heads ───────────────────────────────────────────────────────── */
.herowrap{position:relative;isolation:isolate}
.sky{position:absolute;inset:0;overflow:hidden;z-index:0}
.sky .shot{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.sky .grade{position:absolute;inset:0;mix-blend-mode:multiply}
.sky .scrim{position:absolute;inset:0}
.herowrap .bar{position:relative;z-index:40}
.herowrap .body{position:relative;z-index:5;padding:clamp(58px,8vw,118px) 0 clamp(56px,7vw,110px)}
.herowrap h1{font:300 clamp(2.7rem,6.2vw,5rem)/1.04 'Inter Tight';letter-spacing:-.045em;
  color:#FFF8EE;margin:0;max-width:17ch;text-wrap:balance}
.herowrap .body p{margin:22px 0 0;max-width:52ch;color:#FBEFE1;font-size:18px}
.herowrap .body p+p{margin-top:14px;font-size:16.5px;color:#F2DCC9}
.head{padding:clamp(48px,6.5vw,90px) 0 clamp(22px,2.6vw,38px)}
.head h1{font:300 clamp(2.3rem,5.2vw,4rem)/1.05 'Inter Tight';letter-spacing:-.045em;margin:0;max-width:19ch;text-wrap:balance}
.head p{margin:20px 0 0;max-width:62ch;color:var(--mu);font-size:17.5px}

section{padding:clamp(48px,6vw,88px) 0;border-top:1px solid var(--line)}
section.wash{background:var(--paper)}
.eyebrow{font:500 11.5px/1.5 'Inter Tight';letter-spacing:.19em;text-transform:uppercase;
  color:var(--hot);display:block}
h2{font:300 clamp(1.9rem,3.8vw,3rem)/1.08 'Inter Tight';letter-spacing:-.04em;margin:14px 0 0;max-width:21ch;text-wrap:balance}
.lede{margin:18px 0 0;max-width:68ch;color:var(--mu);font-size:16.5px}
.rows{margin-top:30px;border-top:1px solid var(--ink)}
.row{display:grid;gap:16px;padding:19px 0;border-bottom:1px solid var(--line);align-items:baseline}
@media(min-width:880px){.row{grid-template-columns:280px 1fr}}
.row h3{margin:0;font:500 19px/1.25 'Inter Tight';letter-spacing:-.03em}
.row p{margin:0;font-size:15.5px;color:var(--mu);line-height:1.62}
.row p+p{margin-top:10px}
/* spec() emitted .spec/.r/.n and the stylesheet only ever defined .rows/.row,
   so every guarantee, component and principle rendered as unstyled stacked
   divs on three pages -- the same shape as the .bar .w bug: a selector that
   matches nothing is invisible in the source and obvious on screen. */
.spec{margin-top:32px;border-top:1px solid var(--ink)}
.spec .r{display:grid;gap:12px;padding:24px 0;border-bottom:1px solid var(--line)}
@media(min-width:880px){.spec .r{grid-template-columns:52px minmax(0,258px) minmax(0,1fr);
  gap:0 32px;align-items:start}}
.spec .n{font:400 12px/1.5 ui-monospace,monospace;letter-spacing:.08em;color:var(--dim)}
.spec b{display:block;font:500 19px/1.28 'Inter Tight';letter-spacing:-.03em}
.spec p{margin:0;font-size:15.5px;color:var(--mu);line-height:1.62}
.qwrap{max-width:64ch}
.cap{display:block;margin-top:22px;font:500 11px/1.5 ui-monospace,monospace;letter-spacing:.13em;
  text-transform:uppercase;color:var(--dim)}
.plain{margin:16px 0 0;max-width:72ch;color:var(--mu);font-size:15.5px;line-height:1.66}
.src{margin:8px 0 0;font:400 12.5px/1.6 ui-monospace,monospace;color:var(--dim);max-width:76ch}
/* additions for the approved composition */
/* Only the `em` rule was ever written, so the band had no grid, no figure and
   no label: it rendered as "6Sites rebuilt in working HTML" stacked in one
   narrow column. */
.metrics{display:grid;gap:clamp(22px,3vw,38px);margin-top:30px;padding-top:28px;
  border-top:1px solid var(--ink);grid-template-columns:repeat(auto-fit,minmax(210px,1fr))}
.metrics div b{display:block;font:300 clamp(2.3rem,4.2vw,3.2rem)/1 var(--sans);
  letter-spacing:-.045em;font-variant-numeric:tabular-nums}
.metrics div span{display:block;margin-top:12px;max-width:24ch;
  font:500 14.5px/1.4 var(--sans);letter-spacing:-.01em}
.metrics div em{display:block;margin-top:10px;font:400 12px/1.55 var(--mono);
  color:var(--dim);font-style:normal;max-width:30ch}
.fig{margin-top:clamp(26px,3.4vw,44px);max-width:1000px;border:1px solid var(--line);background:var(--paper)}
/* 1201x330 is 3.6:1, and at that aspect s01's beziers flatten into the "flat
   comb" its own notes warn about -- the vertical delta between a source and
   its object is a tenth of the horizontal run, so nothing reads as routing.
   A taller, narrower frame is what makes the bundle legible. */
.figbody{height:clamp(260px,32vw,440px)}
.figbody canvas{width:100%;height:100%;display:block}
.figcap{padding:13px 18px;border-top:1px solid var(--line);
  font:500 11px/1.5 ui-monospace,monospace;letter-spacing:.11em;text-transform:uppercase;
  color:var(--dim)}
.caveat{margin-top:16px;max-width:64ch;font-size:15px;color:var(--dim)}
section.dark{background:var(--deep);color:var(--on-deep);border-top:0}
section.dark h2{color:var(--on-deep)}
section.dark .lede{color:var(--on-deep-mu)}
section.dark .eyebrow{color:#F0A87A}
.clauses{display:grid;gap:22px;margin-top:34px;padding-top:28px;
  border-top:1px solid var(--deep-line)}
/* Four clauses in a three-column grid orphans the fourth on its own row. */
@media(min-width:820px){.clauses{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1120px){.clauses{grid-template-columns:repeat(4,1fr);gap:26px}}
.clauses b{display:block;font:500 18px/1.25 'Inter Tight';letter-spacing:-.03em}
.clauses p{margin:9px 0 0;font-size:14.5px;line-height:1.6;color:var(--on-deep-mu)}
.send{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
.hint{font:400 13.5px/1.4 var(--sans);color:var(--mu)}
.idg{display:grid;gap:clamp(30px,5vw,68px);grid-template-columns:1fr}
@media(min-width:900px){.idg{grid-template-columns:minmax(0,1fr) minmax(0,1.25fr);align-items:center}}
.facts{margin-top:22px;border-top:1px solid rgba(255,255,255,.14)}
.fr{display:flex;align-items:baseline;justify-content:space-between;gap:24px;
  padding:13px 0;border-bottom:1px solid rgba(255,255,255,.14)}
.fr dt{font:500 11.5px/1 var(--mono);letter-spacing:.09em;text-transform:uppercase;
  color:rgba(255,255,255,.58)}
.fr dd{font:400 14px/1 var(--mono);color:#fff;font-variant-numeric:tabular-nums}
.pull{font-size:clamp(1.3rem,2.4vw,1.85rem);line-height:1.35;font-weight:500;
  letter-spacing:-.024em;color:#fff}
.qsub{margin-top:22px;max-width:58ch;font-size:15px;line-height:1.62;color:rgba(255,255,255,.7)}
.btn.ghost{border-color:rgba(255,255,255,.3);color:#fff;background:transparent}
.chain{display:flex;align-items:center;gap:10px;margin-top:14px;flex-wrap:wrap}
.chain span{font:500 11.5px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;
  color:var(--ink);background:rgba(14,120,119,.07);border:1px solid rgba(14,120,119,.2);
  border-radius:100px;padding:7px 12px;white-space:nowrap}
.chain i{width:14px;height:1px;background:var(--line);flex:none}
.olead{display:block;margin-top:7px;font-size:14.5px;color:var(--mu);line-height:1.5}
.why{margin-top:12px !important;padding-top:12px;border-top:1px solid var(--line);
  font-size:14.5px;color:var(--dim)}
.why .eyebrow{display:inline;margin-right:8px;color:var(--dim)}
.ops{margin-top:32px;display:grid;gap:18px}
.op{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:26px 26px 22px}
.ohead{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;
  padding-bottom:18px;border-bottom:1px solid var(--line)}
.oi{font:500 12px/1 'Inter Tight';color:var(--hot)}
.ohead b{font:500 22px/1.15 'Inter Tight';letter-spacing:-.035em}
.ocat{font-size:14px;color:var(--mu)}
.oship{margin-left:auto;font:400 12.5px/1.5 ui-monospace,monospace;color:var(--dim)}
.ogrid{display:grid;gap:22px;padding:22px 0 0}
@media(min-width:820px){.ogrid{grid-template-columns:repeat(3,1fr)}}
.ogrid p{margin:9px 0 0;font-size:14.5px;line-height:1.6;color:var(--mu)}
.otech{margin-top:20px;padding-top:16px;border-top:1px solid var(--line);
  font:400 12.5px/1.5 ui-monospace,monospace;color:var(--dim)}
.otech a{color:var(--hot)}
.btn.solid{background:var(--ink);color:var(--bone);border-color:var(--ink)}
.close{padding:clamp(58px,7.5vw,106px) 0;background:var(--paper);border-top:1px solid var(--line)}
.close h2{max-width:none}
.form{display:grid;gap:20px;max-width:720px;margin-top:30px}
/* Two fixed columns at any width: the form ran 46px past a 390px viewport. */
.pair{display:grid;gap:20px;grid-template-columns:1fr}
@media(min-width:640px){.pair{grid-template-columns:1fr 1fr}}
.fld{display:grid;gap:7px}
.fld input,.fld select,.fld textarea{border:1px solid var(--line);background:var(--paper);
  padding:13px 14px;font:400 16px/1.5 'Inter Tight';color:var(--ink);border-radius:8px;
  -webkit-appearance:none;appearance:none}
.next{margin-top:30px;border-top:1px solid var(--ink)}
.next .r{display:grid;grid-template-columns:48px 1fr;gap:16px;padding:17px 0;
  border-bottom:1px solid var(--line)}
.next .i{font:500 12.5px/1.6 'Inter Tight';color:var(--hot)}
.next b{display:block;font:500 17px/1.25 'Inter Tight';letter-spacing:-.025em}
.next p{margin:5px 0 0;font-size:14.5px;color:var(--mu)}
.note{max-width:70ch;margin:20px 0 0;color:var(--mu);font-size:15.5px}
.wgrid{display:grid;gap:20px;margin-top:34px}
@media(min-width:800px){.wgrid{grid-template-columns:1fr 1fr}}
.wcard{background:var(--paper);border:1px solid var(--line);border-radius:14px;overflow:hidden}
.wcard .shot{height:clamp(180px,16vw,226px);overflow:hidden;background:var(--line)}
.wcard .shot img{width:100%;height:100%;object-fit:cover;object-position:top}
.wcard .b{padding:20px 22px 24px}
.wcard .k{font:500 11px/1 'Inter Tight';letter-spacing:.16em;text-transform:uppercase;color:var(--hot)}
.wcard p{margin:11px 0 0;font-size:14.5px;line-height:1.6;color:var(--mu)}
.app{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:30px;margin-top:30px}
.app .k{font:500 11px/1 'Inter Tight';letter-spacing:.16em;text-transform:uppercase;color:var(--hot)}
.app .q{margin:14px 0 0;font:400 clamp(1.3rem,2.4vw,1.8rem)/1.28 'Inter Tight';letter-spacing:-.03em}
.app .appbd{margin:12px 0 0;color:var(--mu);font-size:15.5px;line-height:1.62}
.app ul{margin:14px 0 0;padding:0;list-style:none;display:grid;gap:10px}
@media(min-width:680px){.app ul{grid-template-columns:1fr 1fr}}
.app li{font-size:14.5px;color:var(--mu);padding-left:18px;position:relative}
.app li::before{content:"";position:absolute;left:0;top:9px;width:7px;height:7px;background:var(--hot)}
.faq{margin-top:30px;border-top:1px solid var(--ink)}
.faq details{border-bottom:1px solid var(--line)}
.faq summary{cursor:pointer;list-style:none;padding:18px 0;font:500 19px/1.3 'Inter Tight';
  letter-spacing:-.025em;display:flex;justify-content:space-between;gap:18px}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";color:var(--hot)}
.faq details[open] summary::after{content:"\2013"}
.faq p{margin:0 0 20px;color:var(--mu);font-size:15.5px;line-height:1.65;max-width:74ch}
.logos{background:var(--bone);border-bottom:1px solid var(--line)}
/* the real-output console */
.consw{display:grid;gap:18px;margin-top:32px}
@media(min-width:960px){.consw{grid-template-columns:1fr 1fr;gap:20px}}
.cpanel{background:#180B05;border:1px solid #3A1D0E;border-radius:3px;overflow:hidden}
.cbar{font:400 11.5px/1 var(--mono);letter-spacing:.02em;color:#E0A57C;
  padding:12px 16px;border-bottom:1px solid #3A1D0E;background:#120803;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cbody{padding:16px;font:400 12.5px/1.75 var(--mono);color:#F0E2D4}
.ch b{color:#fff;font-weight:600}
.cid{margin-left:10px;color:#8C7263}
.ca{color:#8C7263;margin:2px 0 12px}
.cp,.tr{display:grid;gap:2px 12px;padding:5px 0;border-top:1px solid rgba(255,255,255,.055)}
/* A fixed 92px value column broke "344 N Rose Street, Kalamazoo, MI 49007"
   into four lines and split the ISO timestamp mid-token. The key is the only
   column with a predictable width; the value gets the rest. */
@media(min-width:520px){.cp{grid-template-columns:148px minmax(0,1fr);align-items:baseline}
  .tr{grid-template-columns:56px minmax(0,1fr);align-items:baseline}}
.ck{color:#B99C86}
.cv{color:#5FD3C4;font-variant-numeric:tabular-nums;white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis}
.tv{color:#5FD3C4;font-variant-numeric:tabular-nums}
.tt{color:#F0E2D4}
.to{color:#8C7263;grid-column:1/-1}
@media(min-width:520px){.to{grid-column:2}}
.cs{color:#8C7263;grid-column:1/-1;word-break:break-all}
@media(min-width:520px){.cs{grid-column:1/-1}}
.cs i{color:#D2764A;font-style:normal}
.cnote{margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,.08);
  color:#B99C86;font-size:11.5px;line-height:1.6}
.cnote span{color:#D2764A}
/* --- mobile navigation ------------------------------------------------ */
.burger{display:none;margin-left:auto;width:42px;height:42px;padding:0;background:none;
  border:1px solid var(--line);border-radius:3px;cursor:pointer;
  flex-direction:column;align-items:center;justify-content:center;gap:5px}
.burger span{display:block;width:17px;height:1.5px;background:currentColor;transition:.18s}
.bar.over .burger{border-color:rgba(255,255,255,.34);color:#fff}
nav.bar[data-sheet="1"] .burger span:first-child{transform:translateY(3.25px) rotate(45deg)}
nav.bar[data-sheet="1"] .burger span:last-child{transform:translateY(-3.25px) rotate(-45deg)}
.sheet{display:none;position:absolute;left:0;right:0;top:100%;background:var(--bone);
  border-top:1px solid var(--line);border-bottom:1px solid var(--line);
  max-height:78vh;overflow-y:auto;-webkit-overflow-scrolling:touch}
nav.bar[data-sheet="1"] .sheet{display:block}
.sheetin{padding:8px clamp(20px,5vw,28px) 26px}
.sg{padding:16px 0;border-bottom:1px solid var(--line)}
.sgh{font:500 11px/1 var(--mono);letter-spacing:.13em;text-transform:uppercase;
  color:var(--dim);margin-bottom:12px}
.sg a{display:block;padding:9px 0}
.sg a b{display:block;font:500 16px/1.3 var(--sans);letter-spacing:-.02em;color:var(--ink)}
.sg a span{display:block;margin-top:2px;font-size:13.5px;line-height:1.5;color:var(--mu)}
.sgb{display:flex;gap:10px;flex-wrap:wrap;padding-top:20px}
@media(max-width:900px){
  .menus,.bar .rt{display:none}
  .burger{display:flex}
  .bar > .w{height:58px}
  .panel{display:none !important}
  /* the strip ran off-canvas; wrap it and drop the horizontal spread */
  .logos .w{flex-wrap:wrap;justify-content:flex-start;gap:12px 22px;
    padding-top:20px;padding-bottom:20px}
  .lcap{width:100%;margin-right:0;margin-bottom:2px}
  .announce .w{height:auto;padding-top:9px;padding-bottom:9px;
    flex-wrap:wrap;justify-content:center;gap:4px 12px;text-align:center}
}
.lcap{font:500 11px/1.5 var(--mono);letter-spacing:.13em;text-transform:uppercase;
  color:var(--dim);margin-right:auto}
.logos .w{display:flex;align-items:center;justify-content:space-between;gap:26px;
  height:100px;overflow-x:auto}
.logos span{font:600 17px/1 'Inter Tight';color:#9C8B7C;white-space:nowrap;letter-spacing:-.02em}
footer{background:var(--deep);color:var(--on-deep);padding:clamp(46px,6vw,78px) 0 42px;border:0}
.fgrid{display:grid;gap:40px;padding-bottom:38px;border-bottom:1px solid var(--deep-line)}
@media(min-width:800px){.fgrid{grid-template-columns:1.4fr repeat(3,1fr)}}
.fbrand b{font:600 15px/1 'Inter Tight'} .fbrand b span{color:var(--on-deep-mu)}
.fbrand p{margin:16px 0 0;max-width:30ch;font-size:14.5px;line-height:1.55;color:var(--on-deep-mu)}
.fbrand .city{margin-top:22px;font:500 11px/1 'Inter Tight';letter-spacing:.2em;
  text-transform:uppercase;color:#9C8474}
.fcol h3{font:500 11px/1 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;color:#9C8474;margin:0}
.fcol ul{list-style:none;margin:18px 0 0;padding:0;display:grid;gap:12px}
.fcol a{font-size:14.5px;color:var(--on-deep-mu)}
.fbase{padding-top:24px;display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;
  font-size:13px;color:#9C8474}
.fnote{margin-top:14px;font:400 12px/1.65 ui-monospace,monospace;color:#8A7060;max-width:82ch}
"""


def href(h):
    if h.startswith(("mailto:", "http")):
        return h
    base, _, frag = h.partition("#")
    f = ROUTES.get(base or "/", ("home.html", None))[0]
    return f + ("#" + frag if frag else "")


def footer():
    cols = ""
    for col in CH["footer"]:
        links = "".join(f'<li><a href="{href(h)}">{l}</a></li>' for l, h in col["links"])
        cols += f'<div class=fcol><h3>{col["title"]}</h3><ul>{links}</ul></div>'
    return (f'<footer><div class=w><div class=fgrid>'
            f'<div class=fbrand><b>LOVELEEDAY<span> Studios</span></b>'
            f'<p>{CH["tagline"]}</p><div class=city>{CH["city"]}</div></div>{cols}</div>'
            f'<div class=fbase><span>&copy; 2026 LOVELEEDAY Studios LLC &mdash; a Delaware '
            f'company.</span><span>{CH["city"]}</span></div>'
            f'<p class=fnote>Figures on this site name their source. Where one is '
            f'unmeasured it says so.</p>'
            f'<p class=fnote>Concept mockup. Every block on this page is present on the live '
            f'site &mdash; the content is extracted from the rendered DOM rather than retyped. '
            f'The two photographs carrying this brand are stock and are placeholders for a '
            f'real shoot.</p></div></footer>')




# ===========================================================================
# THE APPROVED COMPOSITION, with the missing content folded INTO it.
#
# Daniel: "did you redesign the homepage ... we asked you to work on things to
# make better not to change the hero section."
#
# He is right and this is the correction. The previous build walked the live
# DOM and rendered whatever it found, in order -- which reached zero missing
# blocks and threw away the design to get there: the hero headline reverted to
# the live site's raw "Arthur Ontology", the logo strip vanished, and four
# designed sections collapsed into two generic ones.
#
# Completeness was never supposed to be the renderer. It is a CHECK. So the
# approved Solstice composition is the page, and the blocks the diff found
# missing are placed into it by hand, in the section each one belongs to.
# ===========================================================================

STUDIES = [dict(s, frame=f) for s, f in
           zip(LIVE["studies"], LIVE["study_frames"])]

FIGURES = [("6", "Sites rebuilt in working HTML",
            "One venture portfolio, rebuilt as running pages rather than described in a deck. "
            "Companies that are not ours."),
           ("38", "Sites measured in that audit",
            "Page weight, Lighthouse mobile, live organic search position and accessibility, "
            "measured per site on 2026-09-19."),
           ("5", "Architectural components in Arthur",
            L("/", "Persistent memory, identity resolution")),
           ("2", "Timelines carried on every value",
            L("/", "When it was true in the world"))]

# Both tables below were hand-retyped copies of data the app already owns, and
# both had drifted -- every one of the five operated companies differed from
# src/content/work.ts in at least one field. They are derived now.
OPERATED = [(o["index"], o["title"], o["category"], o["shipped"],
             " &middot; ".join(tech), o["problem"], o["built"], o["outcome"])
            for o, tech in zip(LIVE["operated"], LIVE["operated_tech"])]


def spec(rows):
    return ('<div class=spec>' + "".join(
        f'<div class=r><div class=n>{n}</div><div><b>{t}</b></div><div><p>{d}</p></div></div>'
        for n, t, d in rows) + '</div>')


def metrics(items):
    """Every figure names its source underneath it, which is the live site's own
       rule and was dropped when the metric band was first rebuilt."""
    return ('<div class=metrics>' + "".join(
        f'<div><b>{k}</b><span>{l}</span><em>{s}</em></div>' for k, l, s in items) + '</div>')


# ---------------------------------------------------------------------------
# REAL OUTPUT, NOT A SCHEMATIC.
#
# All three reviewers landed on the same finding independently: the only two
# product visuals on the site are captioned "the schematic, not a screenshot"
# and "simulated demonstration -- fictional companies". So a site whose whole
# argument is "we show evidence, not claims" had no evidence of its own
# product, and that absence is most of what reads as unfinished.
#
# This is the real thing: `arthur-ontology` run against the live store on
# 2026-09-21. 41 objects, 538 property observations, four source systems. The
# address is a public business address (Daniel's own bar); nothing here is
# private. The ARTHUR//OS console is the better visual and is NOT used, because
# the live screenshot carries net cash, a bank account tail and an EIN -- that
# one needs a demo tenant first.
# ---------------------------------------------------------------------------
ONTOLOGY_CARD = [
    ("h", "Dabney &amp; Co.", "venue:dabney-co"),
    ("a", "also known as", "344 N Rose · Dabney · Dabney and Co"),
    ("p", "address", "344 N Rose Street, Kalamazoo, MI 49007", "nominatim", "osm:way/887807677"),
    ("p", "temp_f", "61", "weather.gov", "api.weather.gov/gridpoints/GRR/46,16"),
    ("p", "precip_pct", "4", "weather.gov", "api.weather.gov/gridpoints/GRR/46,16"),
    ("p", "sat_cloud_pct", "43.3", "sentinel-2", "S2C_16TFM_20260918_0_L2A"),
    ("p", "sat_last_pass_at", "2026-09-18T16:41:51Z", "sentinel-2", "S2C_16TFM_20260918_0_L2A"),
]
ONTOLOGY_TRAIL = [
    ("94.64", "2026-09-14 → 2026-09-15", "2026-09-14", "S2B_16TFM_20260913_0_L2A"),
    ("94.64", "2026-09-18 → 2026-09-19", "2026-09-18", "S2B_16TFM_20260913_0_L2A"),
    ("43.3", "2026-09-19 → 2026-09-20", "2026-09-19", "S2C_16TFM_20260918_0_L2A"),
    ("43.3", "2026-09-20 → open", "2026-09-20", "S2C_16TFM_20260918_0_L2A"),
]


def console():
    """The object card and one value's full provenance trail, side by side."""
    rows = ""
    for r in ONTOLOGY_CARD:
        if r[0] == "h":
            rows += (f'<div class=ch><b>{r[1]}</b><span class=cid>[{r[2]}]</span></div>')
        elif r[0] == "a":
            rows += f'<div class=ca>{r[1]}: {r[2]}</div>'
        else:
            _, k, v, sys_, ref = r
            rows += (f'<div class=cp><span class=ck>{k}</span><span class=cv>{v}</span>'
                     f'<span class=cs>&larr; {sys_}: <i>{ref}</i></span></div>')
    trail = "".join(
        f'<div class=tr><span class=tv>{v}</span>'
        f'<span class=tt>true {valid}</span>'
        f'<span class=to>observed {obs}</span>'
        f'<span class=cs>&larr; sentinel-2: <i>{ref}</i></span></div>'
        for v, valid, obs, ref in ONTOLOGY_TRAIL)
    return (f'<div class=consw>'
            f'<div class=cpanel><div class=cbar>arthur-ontology "dabney"</div>'
            f'<div class=cbody>{rows}</div></div>'
            f'<div class=cpanel><div class=cbar>arthur-ontology lineage "dabney" '
            f'sat_cloud_pct</div><div class=cbody>{trail}'
            f'<div class=cnote>arthur-ontology "dabney" --as-of 2026-09-01 '
            f'--as-known-at 2026-09-01<br><span>(no properties were true and known '
            f'at that point)</span></div></div></div></div>')


def logos():
    """Six names in the slot a customer-logo wall occupies, with no caption.

    Both reviewers independently read them as customers, then found out two
    clicks later that all six are Daniel's own companies -- and an investor
    who works that out discounts everything else on the page. The names are
    real evidence that the studio ships; they are just not evidence that
    anyone hired it, so the strip says which one it is."""
    return ('<div class=logos><div class=w>'
            '<span class=lcap>Software we own and operate</span>' + "".join(
        f'<span>{n}</span>' for n in
        ["olldae", "Kronos", "Duezy", "Dabney &amp; Co.", "Ops Layer", "Arthur"]) +
        '</div></div>')


def close(head_html, sub, second=None, eyebrow="Start"):
    extra = (f'<a class=btn href="{second[1]}" style="margin-left:10px">{second[0]}</a>'
             if second else '')
    return (f'<section class=close><div class=w><span class=eyebrow>{eyebrow}</span>'
            f'<h2>{head_html}</h2><p class=lede>{sub}</p>'
            f'<p style="margin-top:26px"><a class="btn solid" href="contact.html">'
            f'Start a project</a>{extra}</p></div></section>')


def footer():
    cols = ""
    for col in CH["footer"]:
        links = "".join(f'<li><a href="{href(h)}">{l}</a></li>' for l, h in col["links"])
        cols += f'<div class=fcol><h3>{col["title"]}</h3><ul>{links}</ul></div>'
    return (f'<footer><div class=w><div class=fgrid>'
            f'<div class=fbrand><b>LOVELEEDAY<span> Studios</span></b>'
            f'<p>{CH["tagline"]}</p><div class=city>{CH["city"]}</div></div>{cols}</div>'
            f'<div class=fbase><span>&copy; 2026 LOVELEEDAY Studios LLC &mdash; a Delaware '
            f'company.</span><span>{CH["city"]}</span></div>'
            # The footer used to end "Concept mockup: the two photographs
            # carrying this brand are stock and are placeholders for a real
            # shoot." A site that tells the reader it is unfinished IS
            # unfinished. The photo-sourcing note belongs in the handoff, not
            # in the product.
            f'<p class=fnote>Figures on this site name their source. Where one is unmeasured '
            f'it says so.</p></div></footer>')


def hero(which, h1_html, paras):
    photo, grade, scrim, anchor = HEROES[which]
    ps = "".join(f"<p>{t}</p>" for t in paras)
    return (f'<div class=herowrap>'
            f'<div class=sky aria-hidden=true>'
            f'<img class=shot style="object-position:{anchor}" '
            f'src="../../../public/studio/solstice/{photo}" alt="">'
            f'<div class=grade style="background:{grade}"></div>'
            f'<div class=scrim style="background:{scrim}"></div></div>'
            f'{nav(over=True)}'
            f'<div class=body><div class=w><h1>{h1_html}</h1>{ps}</div></div></div>')


# The pages emitted <canvas data-motion="..."> on every figure and never
# shipped the library that paints them, so all four figures rendered as empty
# boxes with a caption underneath. Daniel had already caught this once ("i
# dont see the motion graphics you delevoepd that you ahd planened to run").
# motion.js is inlined, and each canvas is mounted through LD.hero, which
# throws on an unknown name rather than leaving a blank frame.
MOTION_JS = "<script>" + (HERE / "motion.js").read_text() + """
(function(){
  var cvs = document.querySelectorAll('canvas[data-motion]');
  for (var i = 0; i < cvs.length; i++) {
    window.LD.hero(cvs[i], cvs[i].dataset.motion);
  }
})();
</script>"""


# A build tag on every page ("SOLSTICE - HOME - APPROVED COMPOSITION, ALL
# CONTENT") sat above the nav in the first 20px of all five pages. It was my
# own diffing aid and I stopped seeing it; to a reader it is an environment
# watermark, and the first thing the eye hits says "draft". Off unless asked.
REVIEW_CHROME = os.environ.get("SOLSTICE_REVIEW") == "1"


def shell(title, body, ribbon):
    return f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>{title}</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="{FONTS}" rel=stylesheet>
<style>{CSS}</style></head><body>
{f'<div class=ribbon>{ribbon}</div>' if REVIEW_CHROME else ''}
{body}
{NAV_JS}
{MOTION_JS}
</body></html>"""


def home():
    g = LIVE["guarantees"]
    # Section prose, in the live site's own words (see L). Bound here rather
    # than inline so the f-string below stays readable.
    sub = L("/", "Records scattered across payments")
    props = L("/", "Each of these lives in the write path")
    ident = L("/", "Fourteen records arriving")
    folio = L("/", "One venture portfolio, measured")
    unnamed = L("/", "The companies are not named here")
    # The live sentence opens "This is the only dark section on the site" --
    # true of the live page, false of this one now that the real-output console
    # sits on a dark ground above it. A page that can be disproved by scrolling
    # is worse than a page with one less flourish, so the clause goes and the
    # point it was making stays.
    dark = ("It is set apart because this is the part that has to be read as a "
            "contract rather than as a claim.")
    con = console()
    studies = "".join(
        f'<a class=wcard href="work.html"><div class=shot>'
        f'<img src="../../../public{s["frame"].split("?")[0]}" alt=""></div>'
        f'<div class=b><span class=k>{s["id"]} &middot; {s["sector"]}</span>'
        f'<p>{s["thesis"]}</p></div></a>' for s in STUDIES)
    body = hero("g", 'Intelligence <span class=ser>you can trace.</span>',
                [L("/", "The object layer for the business"), sub]) + logos() + f"""
<section><div class=w>
  <span class=eyebrow>Arthur &middot; powered by the ontology</span>
  <h2>The schematic, <span class=ser>not a screenshot.</span></h2>
  <p class=lede>Sources resolve to objects; workflows and analytics read the object rather
  than the spreadsheet it arrived in.</p>
  <div class=fig><div class=figbody><canvas data-motion="flow"></canvas></div>
    <div class=figcap>Fig. 01 &mdash; sources resolve to objects; workflows and analytics
    read the object &middot; schematic, not a screenshot</div></div>
</div></section>

<section class=wash><div class=w>
  <span class=eyebrow>What the ontology guarantees</span>
  <h2>Five properties. <span class=ser>Enforced,</span> not promised.</h2>
  <p class=lede>{props}</p>
  {spec([(r[0], r[1], r[2]) for r in g])}
</div></section>

<section class=dark id=output><div class=w>
  <span class=eyebrow>The actual output</span>
  <h2>Every value, <span class=ser>with its receipt.</span></h2>
  <p class=lede>The page above makes four claims. This is the system making good on
  them &mdash; one object, its properties, and the full provenance of a single value,
  printed by the tool that stores it.</p>
  {con}
  <p class=note style="color:rgba(255,255,255,.55)">Run against the live store on
  2026-09-21 &mdash; 41 objects, 538 property observations, four source systems.
  Not a mockup of an interface: this is what the command prints.</p>
</div></section>

<section><div class=w>
  <span class=eyebrow>Identity resolution</span>
  <h2>Four names. <span class=ser>One company.</span></h2>
  <p class=lede>{ident}</p>
  <div class=fig><div class=figbody><canvas data-motion="bundle"></canvas></div>
    <div class=figcap>Fig. 02 &mdash; 14 records &middot; 4 source systems &middot;
    5 resolved objects</div></div>
</div></section>

<section class=wash><div class=w>
  <span class=eyebrow>In production</span>
  <h2>Built. Shipped. <span class=ser>Running.</span></h2>
  {metrics(FIGURES)}
</div></section>

<section id=studies><div class=w>
  <span class=eyebrow>Uncommissioned</span>
  <h2>Thirty-eight sites. <span class=ser>Six rebuilds.</span></h2>
  <p class=lede>{folio}</p>
  <div class=wgrid>{studies}</div>
  <p class=note>{unnamed}</p>
</div></section>

<section class=dark><div class=w>
  <span class=eyebrow>The standard</span>
  <h2>Confidence comes <span class=ser>from the evidence.</span></h2>
  <p class=lede>{dark}</p>
  <div class=clauses>
    <div><b>Claims tied to sources</b><p>Separate what the evidence shows from what still
      needs testing.</p></div>
    <div><b>Completion tied to the task</b><p>A generated answer and a working implementation
      are different deliverables.</p></div>
    <div><b>Authority stays explicit</b><p>Access, integrations and production changes follow
      the agreed scope and human approval.</p></div>
    <div><b>Economics worth measuring</b><p>Elapsed time, human effort, quality and cost per
      completed task, in the actual engagement.</p></div>
  </div>
</div></section>
""" + close('See the question. <span class=ser>Build the answer.</span>',
            "Tell us what is slowing you down. We reply the same week, with a plan or with a "
            "reason it is not a fit.", second=("Read the architecture", "arthur.html"),
            eyebrow="Bring us the question") + footer()
    return shell("LOVELEEDAY Studios &mdash; the object layer for the business you already run",
                 body, "Solstice &middot; home &middot; approved composition, all content")


def arthur():
    comp = LIVE["components"]
    intro = L("/arthur", "Arthur’s codebase brings together")
    caveat = L("/arthur", "These are implemented architectural")
    simcap = L("/arthur", "Fictional companies")
    rows = ""
    for i, c in enumerate(comp):
        chain = LIVE.get("component_chains", [])
        steps = chain[i] if i < len(chain) else []
        trail = ("<div class=chain>" +
                 "<i></i>".join(f"<span>{x}</span>" for x in steps) +
                 "</div>") if steps else ""
        rows += (f'<div class=r><div class=n>{c.get("n", "0%d" % (i+1))}</div>'
                 f'<div><b>{c.get("title","")}</b>'
                 f'<span class=olead>{c.get("lead","")}</span></div>'
                 f'<div><p>{c.get("body","")}</p>'
                 f'{trail}'
                 f'<p class=why><span class=eyebrow>Why it matters</span> '
                 f'{c.get("why","")}</p></div></div>')
    apps = ""
    for i, a in enumerate(LIVE["applications"]):
        pr = LIVE["app_produces"][i] if i < len(LIVE["app_produces"]) else []
        apps += (f'<div class=app><span class=k>{a.get("tag","")}</span>'
                 f'<span class=eyebrow>The business question</span>'
                 f'<p class=q>{a.get("question","")}</p><p class=appbd>{a.get("body","")}</p>'
                 f'<span class=eyebrow style="margin-top:20px">A scoped engagement can produce</span>'
                 f'<ul>{"".join(f"<li>{x}</li>" for x in pr)}</ul></div>')
    faq = "".join(
        f'<details{" open" if i == 0 else ""}><summary>{q["q"]}</summary><p>{q["a"]}</p></details>'
        for i, q in enumerate(LIVE["faq"]))
    body = nav() + f"""
<header class=head><div class=w>
  <span class=eyebrow>Arthur &middot; intelligence architecture</span>
  <h1>Built to connect. <span class=ser>Designed to act.</span></h1>
  <p>{intro}</p>
  <p class=caveat>{caveat}</p>
</div></header>

<section id=architecture><div class=w>
  <span class=eyebrow>The architecture</span>
  <h2>What Arthur is <span class=ser>made of.</span></h2>
  <div class=spec>{rows}</div>
  <div class=fig style="margin-top:34px"><div class=figbody><canvas data-motion="lattice"></canvas></div>
    <div class=figcap>Fig. 03 &mdash; a 5&times;5&times;5 lattice, lit and depth-sorted in the
    browser. No 3D library.</div></div>
</div></section>

<section class=wash id=ontology><div class=w>
  <span class=eyebrow>Watch the work unfold</span>
  <h2>Arthur, <span class=ser>in motion.</span></h2>
  <p class=lede>Follow a portfolio review through parallel research, proposed changes, a
  website preview, and a verification step.</p>
  <div class=fig><div class=figbody><canvas data-motion="series"></canvas></div>
    <span class=eyebrow>Simulated demonstration</span>
    <div class=figcap>{simcap}</div></div>
</div></section>

<section><div class=w>
  <span class=eyebrow>What this opens up</span>
  <h2>The applications <span class=ser>are the point.</span></h2>
  <p class=lede>Start with the business problem. Define the evidence, the deliverable, and
  what success should look like.</p>
  {apps}
  <p class=note>Integrations require approved access, compatible APIs, and implementation.</p>
</div></section>

<section class=wash><div class=w>
  <span class=eyebrow>FAQ</span>
  <h2>Good questions <span class=ser>are welcome.</span></h2>
  <div class=faq>{faq}</div>
</div></section>
""" + close('Bring us <span class=ser>the question.</span>',
            "Scoped engagements open this quarter. The problem comes first; Arthur is how we "
            "get to a defensible answer, not the thing we are selling you.",
            second=("See what we’ve shipped →", "work.html")) + footer()
    return shell("Arthur &mdash; LOVELEEDAY Studios", body,
                 "Solstice &middot; /arthur &middot; components, why-it-matters, applications, FAQ")


def work():
    # Shared with /, and identical on both pages in the live site.
    unnamed = L("/work", "The companies are not named here")
    intro = L("/work", "Two different things")
    folio = L("/work", "One venture portfolio, measured")
    cards = "".join(
        f'<div class=wcard><div class=shot>'
        f'<img src="../../../public{s["frame"].split("?")[0]}" alt=""></div>'
        f'<div class=b><span class=k>{s["id"]} &middot; {s["sector"]}</span>'
        f'<p>{s["thesis"]}</p></div></div>' for s in STUDIES)
    led = ""
    for row, url in zip(OPERATED, LIVE["operated_link"]):
        i, n, cat, shipped, tech, problem, built, outcome = row
        visit = (f' &middot; <a href="{url}">Visit the live site &#8599;</a>'
                 if url else '')
        led += (f'<div class=op><div class=ohead><span class=oi>{i}</span>'
                f'<b>{n}</b><span class=ocat>{cat}</span>'
                f'<span class=oship>{shipped}</span></div>'
                f'<div class=ogrid>'
                f'<div><span class=eyebrow>The problem</span><p>{problem}</p></div>'
                f'<div><span class=eyebrow>What we built</span><p>{built}</p></div>'
                f'<div><span class=eyebrow>Outcome</span><p>{outcome}</p></div></div>'
                f'<div class=otech>{tech}{visit}</div>'
                f'</div>')
    body = nav() + f"""
<header class=head><div class=w>
  <span class=eyebrow>Work</span>
  <h1>Shipped, <span class=ser>not proposed.</span></h1>
  <p>{intro}</p>
</div></header>

<section id=studies><div class=w>
  <span class=eyebrow>Uncommissioned</span>
  <h2>Thirty-eight sites. <span class=ser>Six rebuilds.</span></h2>
  <p class=lede>{folio}</p>
  <div class=wgrid>{cards}</div>
  <p class=note>{unnamed}</p>
</div></section>

<section class=wash id=operated><div class=w>
  <span class=eyebrow>Owned and operated</span>
  <h2>Companies we own <span class=ser>and operate.</span></h2>
  <p class=note>These are LOVELEEDAY-owned businesses, built in-house and running in
  production. They are listed as evidence that the studio ships &mdash; not as client
  engagements. We were our own customer on every one of them.</p>
  <div class=ops>{led}</div>
</div></section>
""" + close('Ready to start? <span class=ser>Request a fixed quote.</span>',
            "We reply the same week, with a plan or with a reason it is not a fit.") + footer()
    return shell("Work &mdash; LOVELEEDAY Studios", body,
                 "Solstice &middot; /work &middot; two registers, full case detail")


def about():
    pr = [(r.get("n", ""), r.get("t", ""), r.get("d", "")) for r in LIVE["principles"]]
    # The live page opens "founded by Daniel J. May, MBA" and carries a Founder
    # panel under his name. Daniel, 2026-09-21: "do not include my name as
    # dabney may or anything in the landing pages." So the sentence is taken
    # from the live copy with the founding clause removed, and the panel keeps
    # the facts about the COMPANY -- entity, year, how much software it runs --
    # and drops the person. The quote stays; it reads as the studio's position
    # rather than a personal one, which is what it always argued anyway.
    stack = L("/about", "Arthur is the software foundation")
    quote = L("/about", "“A website request can reveal")
    beyond = L("/about", "We look beyond the requested deliverable")
    howwe = L("/about", "We do not do retainers")
    facts = [("Founded", "2026"), ("Entity", "LOVELEEDAY Studios LLC, Delaware"),
             ("Software we own and run", "5")]
    rows = "".join(f'<div class=fr><dt>{k}</dt><dd>{v}</dd></div>' for k, v in facts)
    body = hero("h", 'Business judgment. <span class=ser>Built as software.</span>',
                ["LOVELEEDAY Studios is a software development company. Our perspective comes "
                 "from pricing, operations and running businesses, not only from writing code.",
                 stack]) + f"""
<section class=dark><div class=w>
  <div class=idg>
    <div>
      <span class=eyebrow>The company</span>
      <dl class=facts>{rows}</dl>
      <p style="margin-top:26px"><a class=btn ghost href="arthur.html">Read the architecture</a></p>
    </div>
    <div class=qwrap>
      <p class=pull>{quote}</p>
      <p class=qsub>{beyond}</p>
    </div>
  </div>
</div></section>

<section id=method><div class=w>
  <span class=eyebrow>How we work</span>
  <h2>Five rules <span class=ser>we do not bend.</span></h2>
  <p class=lede>{howwe}</p>
  {spec(pr)}
  <p class=note>Every engagement also ships through a private, token-gated review page
  &mdash; you watch the build, not just the invoice. No login and no index: the unguessable
  URL is the credential, which is why it is named here and never linked.</p>
</div></section>

<section class=wash><div class=w>
  <span class=eyebrow>How we measure</span>
  <h2>The numbers, <span class=ser>and where they come from.</span></h2>
  {metrics(FIGURES)}
</div></section>
""" + close('Tell us what is <span class=ser>slowing you down.</span>',
            "We reply the same week.") + footer()
    return shell("Company &mdash; LOVELEEDAY Studios", body,
                 "Solstice &middot; /about &middot; hero H, company facts, five principles")


def contact():
    def fld(label, opts=None, area=False):
        if opts:
            ctl = '<select disabled>' + "".join(f'<option>{o}</option>' for o in opts) + '</select>'
        elif area:
            ctl = '<textarea rows=5 readonly></textarea>'
        else:
            ctl = '<input readonly>'
        return f'<label class=fld><span class=eyebrow>{label}</span>{ctl}</label>'
    # The live lede reads "a reply from Daniel, not a sequence". Same promise,
    # without the name (Daniel, 2026-09-21): the point of the sentence is that a
    # person answers, not which person.
    steps = [("A reply, from a person",
              L("/contact", "Usually the same day")),
             ("A fixed quote with a scope",
              L("/contact", "One number and a written scope")),
             ("A build you can watch",
              L("/contact", "You see it deployed"))]
    nxt = "".join(f'<div class=r><div class=i>0{i+1}</div><div><b>{t}</b>'
                  f'<p>{d}</p></div></div>' for i, (t, d) in enumerate(steps))
    body = nav() + f"""
<header class=head><div class=w>
  <span class=eyebrow>Bring us the question</span>
  <h1>Bring us <span class=ser>the question.</span></h1>
  <p>Describe the problem in your own words. You will get a reply from a person, not a
  sequence, and a fixed quote with a scope attached rather than a discovery call.</p>
</div></header>

<section style="padding-top:0;border-top:0"><div class=w>
  <form class=form>
    <div class=pair>{fld("Your name")}{fld("Email")}</div>
    <div class=pair>{fld("Kind of work", opts=LIVE["project_types"])}
      {fld("Budget range", opts=LIVE["budgets"])}</div>
    {fld("What is the problem?", area=True)}
    <div class=send><span class="btn solid">Send the brief</span>
      <span class=hint>{L("/contact", "Usually answered the same day")}</span></div>
  </form>
  <p class=note>Prefer email? hello@loveleedaystudios.com &middot;
    {L("/contact", "Already have a portal link")}</p>
</div></section>

<section class=wash><div class=w>
  <span class=eyebrow>After you send it</span>
  <h2>What happens <span class=ser>next.</span></h2>
  <div class=next>{nxt}</div>
  <p style="margin-top:30px"><a class=btn href="work.html">See what we’ve shipped
    &rarr;</a></p>
</div></section>
""" + footer()
    return shell("Contact &mdash; LOVELEEDAY Studios", body,
                 "Solstice &middot; /contact &middot; real project types and budget bands")


PAGES = {"home.html": home, "arthur.html": arthur, "work.html": work,
         "about.html": about, "contact.html": contact}

def check_tokens():
    """Every var(--x) in the stylesheet must be defined in :root.

    --sans and --mono were used by five rules and defined by none, so each of
    those rules had an invalid `font:` shorthand and the browser dropped the
    WHOLE declaration -- silently. That is the third variant of one bug found
    on this page today (a nav selector that matched nothing, a .spec class with
    no rules, two undefined tokens): something that resolves to nothing is
    invisible in the source and obvious on screen. Cheap to assert, so assert."""
    root = CSS[CSS.index(":root{"):]
    root = root[:root.index("}")]
    defined = set(re.findall(r"(--[\w-]+)\s*:", root))
    used = set(re.findall(r"var\((--[\w-]+)", CSS))
    missing = used - defined
    if missing:
        raise SystemExit("CSS uses undefined tokens: " + ", ".join(sorted(missing)))


if __name__ == "__main__":
    check_tokens()
    for name, fn in PAGES.items():
        (OUT / name).write_text(fn())
        print("wrote solstice-full/" + name)
