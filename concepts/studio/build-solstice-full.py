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
import json, re
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / "solstice-full"
OUT.mkdir(exist_ok=True)
DOM = json.loads((HERE / "live-dom.json").read_text())
LIVE = json.loads((HERE / "live-content.json").read_text())
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


def nav(active="", over=False, open_menu="Platform"):
    """The bar, plus the open menu rendered as a ROW IN NORMAL FLOW beneath it.

       The panel was absolutely positioned at first and measured 120px tall
       while its own grid measured 187 -- the content was overflowing a box
       whose height I did not control, so the second row of menu items landed
       on the photograph with nothing behind them. An in-flow row cannot do
       that: it is as tall as what is in it. A hover implementation would use
       the absolute panel; a static mockup wants the row, because a menu nobody
       can see is a menu nobody can judge."""
    tabs = "".join(
        f'<span class="tab{" on" if label == open_menu else ""}">{label}'
        f'<i aria-hidden="true">&#9662;</i></span>' for label in MENUS)
    rows = MENUS.get(open_menu, [])
    panel = "".join(
        f'<a class=mi href="{h}"><b>{t}</b><span>{d}</span></a>' for t, d, h in rows)
    mega = (f'<div class=mega><div class=w>'
            f'<div class=mhead>{open_menu}</div>'
            f'<div class=pgrid>{panel}</div>'
            f'<div class=pfoot>{CH["tagline"]}</div></div></div>')
    return (f'<div class=announce><div class=w>'
            f'<span>Arthur 4.0 &mdash; scoped engagements open for Q4</span>'
            f'<a href="arthur.html">Read the technical brief &rsaquo;</a></div></div>'
            f'<nav class="bar{" over" if over else ""}"><div class=w>'
            f'<a class=bd href="home.html">LOVELEEDAY</a>'
            f'<div class=menus>{tabs}</div>'
            f'<div class=rt>'
            f'<label class=search><svg width=14 height=14 viewBox="0 0 16 16" aria-hidden=true>'
            f'<circle cx=7 cy=7 r=5 fill=none stroke=currentColor stroke-width=1.7/>'
            f'<path d="M11 11 15 15" stroke=currentColor stroke-width=1.7/></svg>'
            f'<input placeholder="Search" readonly></label>'
            f'<a class=btn href="contact.html">Contact sales</a>'
            f'<a class="btn solid" href="contact.html">Start a project</a></div>'
            f'</div></nav>{mega}')


CSS = """
*,*::before,*::after{box-sizing:border-box}
:root{--ink:#241109;--bone:#FBF6EE;--paper:#FFFFFF;--mu:#6B5A4E;--dim:#8B7868;
  --line:#E4D9C9;--hot:#C8410F;--deep:#2A0F07;--on-deep:#F6E9DB;--on-deep-mu:#C4A996;
  --deep-line:#48210F}
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
.bar .w{display:flex;align-items:center;height:64px;gap:clamp(14px,2.4vw,34px)}
.bd{font:600 18px/1 'Inter Tight';letter-spacing:-.035em;white-space:nowrap}
.menus{display:flex;align-items:center;gap:clamp(8px,1.4vw,20px)}
.tab{display:flex;align-items:center;gap:6px;font:500 14px/1 'Inter Tight';
  color:var(--mu);padding:8px 2px;cursor:default;white-space:nowrap}
.tab i{font-size:9px;opacity:.55;position:relative;top:-1px;font-style:normal}
.tab.on{color:var(--ink)}
.mega{background:var(--paper);border-bottom:1px solid var(--line);
  box-shadow:0 26px 52px -46px rgba(36,17,9,.5);padding:26px 0 22px;position:relative;z-index:50}
.mhead{font:500 11px/1 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;
  color:var(--hot);margin-bottom:18px}
.pgrid{display:grid;gap:10px 26px}
@media(min-width:900px){.pgrid{grid-template-columns:repeat(3,1fr)}}
.mi{display:block;padding:12px 14px;border-radius:10px}
.mi:hover{background:var(--bone)}
.mi b{display:block;font:500 16px/1.25 'Inter Tight';letter-spacing:-.025em}
.mi span{display:block;margin-top:4px;font-size:13.5px;color:var(--mu);line-height:1.5}
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
.bar.over .bd,.bar.over .tab{color:rgba(255,244,226,.86)}
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
  color:#FFF8EE;margin:0;max-width:17ch}
.herowrap .body p{margin:22px 0 0;max-width:52ch;color:#FBEFE1;font-size:18px}
.herowrap .body p+p{margin-top:14px;font-size:16.5px;color:#F2DCC9}
.head{padding:clamp(48px,6.5vw,90px) 0 clamp(22px,2.6vw,38px)}
.head h1{font:300 clamp(2.3rem,5.2vw,4rem)/1.05 'Inter Tight';letter-spacing:-.045em;margin:0;max-width:19ch}
.head p{margin:20px 0 0;max-width:62ch;color:var(--mu);font-size:17.5px}

section{padding:clamp(48px,6vw,88px) 0;border-top:1px solid var(--line)}
section.wash{background:var(--paper)}
.eyebrow{font:500 11.5px/1.5 'Inter Tight';letter-spacing:.19em;text-transform:uppercase;
  color:var(--hot);display:block}
h2{font:300 clamp(1.9rem,3.8vw,3rem)/1.08 'Inter Tight';letter-spacing:-.04em;margin:14px 0 0;max-width:21ch}
.lede{margin:18px 0 0;max-width:68ch;color:var(--mu);font-size:16.5px}
.rows{margin-top:30px;border-top:1px solid var(--ink)}
.row{display:grid;gap:16px;padding:19px 0;border-bottom:1px solid var(--line);align-items:baseline}
@media(min-width:880px){.row{grid-template-columns:280px 1fr}}
.row h3{margin:0;font:500 19px/1.25 'Inter Tight';letter-spacing:-.03em}
.row p{margin:0;font-size:15.5px;color:var(--mu);line-height:1.62}
.row p+p{margin-top:10px}
.cap{display:block;margin-top:22px;font:500 11px/1.5 ui-monospace,monospace;letter-spacing:.13em;
  text-transform:uppercase;color:var(--dim)}
.plain{margin:16px 0 0;max-width:72ch;color:var(--mu);font-size:15.5px;line-height:1.66}
.src{margin:8px 0 0;font:400 12.5px/1.6 ui-monospace,monospace;color:var(--dim);max-width:76ch}
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


def render(route):
    """Walk the ordered blocks and emit Solstice. Sections start at an eyebrow
       or an h2; everything between is kept, in order, in its own role."""
    blocks = dedupe([b for b in DOM[route] if b["section"] not in ("nav", "footer")])
    hero_key = ROUTES[route][1]

    # the hero: h1 plus the paragraphs immediately after it
    h1, lead = "", []
    i = 0
    for n, b in enumerate(blocks):
        if b["role"] == "h1":
            h1 = clean(b["text"])
            i = n + 1
            while i < len(blocks) and blocks[i]["role"] == "p" and not lead[2:]:
                lead.append(clean(blocks[i]["text"]))
                i += 1
            break
    rest = blocks[i:]

    if hero_key:
        photo, grade, scrim, anchor = HEROES[hero_key]
        ps = "".join(f"<p>{t}</p>" for t in lead)
        # The bar sits OUTSIDE .sky. It used to be nested inside it, and .sky
        # carries overflow:hidden and isolation:isolate -- so the open menu
        # panel was clipped to 120px and its second row of items rendered on
        # the photograph with no background behind them.
        head = (f'<div class=herowrap>'
                f'<div class=sky aria-hidden=true>'
                f'<img class=shot style="object-position:{anchor}" '
                f'src="../../../public/studio/solstice/{photo}" alt="">'
                f'<div class=grade style="background:{grade}"></div>'
                f'<div class=scrim style="background:{scrim}"></div></div>'
                f'{nav(over=True)}'
                f'<div class=body><div class=w><h1>{h1}</h1>{ps}</div></div></div>')
    else:
        ps = "".join(f"<p>{t}</p>" for t in lead)
        head = nav() + f'<header class=head><div class=w><h1>{h1}</h1>{ps}</div></header>'

    # sections
    out, cur, wash = [], [], False

    def flush():
        nonlocal cur, wash
        if not cur:
            return
        out.append(f'<section{" class=wash" if wash else ""}><div class=w>'
                   + "".join(cur) + '</div></section>')
        cur = []
        wash = not wash

    pending_h3 = None
    for b in rest:
        t = clean(b["text"])
        if not t:
            continue
        r = b["role"]
        if r == "eyebrow" and cur and any(x.startswith("<h2") for x in cur):
            flush()
        if r == "eyebrow":
            cur.append(f'<span class=eyebrow>{t}</span>')
        elif r in ("h2",):
            cur.append(f'<h2>{t}</h2>')
        elif r in ("h3", "h4"):
            if pending_h3:
                cur.append(f'<div class=row><h3>{pending_h3}</h3><div></div></div>')
            pending_h3 = t
        elif r == "caption":
            cur.append(f'<span class=cap>{t}</span>')
        elif r == "li":
            cur.append(f'<p class=plain>{t}</p>')
        else:
            if pending_h3:
                cur.append(f'<div class=row><h3>{pending_h3}</h3><div><p>{t}</p></div></div>')
                pending_h3 = None
            elif cur and cur[-1].startswith("<h2"):
                cur.append(f'<p class=lede>{t}</p>')
            elif cur and cur[-1].startswith("<div class=row"):
                cur[-1] = cur[-1].replace("</div></div>", f"<p>{t}</p></div></div>")
            else:
                cur.append(f'<p class=plain>{t}</p>')
    if pending_h3:
        cur.append(f'<div class=row><h3>{pending_h3}</h3><div></div></div>')
    flush()

    body = head + "".join(out) + footer()
    title = {"/": "LOVELEEDAY Studios", "/arthur": "Arthur", "/work": "Work",
             "/about": "Company", "/contact": "Contact"}[route]
    ribbon = (f"Solstice &middot; {route} &middot; every block from the live page, "
              f"redesigned navigation")
    return f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>{title} &mdash; LOVELEEDAY Studios</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="{FONTS}" rel=stylesheet>
<style>{CSS}</style></head><body>
<div class=ribbon>{ribbon}</div>
{body}
</body></html>"""


if __name__ == "__main__":
    for route, (fname, _) in ROUTES.items():
        (OUT / fname).write_text(render(route))
        print(f"wrote solstice-full/{fname}  ({len(DOM[route])} source blocks)")
