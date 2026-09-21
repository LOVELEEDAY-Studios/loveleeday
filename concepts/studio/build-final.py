import pathlib

import store
#!/usr/bin/env python3
"""THE BUILD. One site, five pages, every decision from this session in it.

    python3 concepts/studio/build-final.py  ->  concepts/studio/final/*.html

Daniel, 2026-09-21: "i need you to do a full rebuild of the mockup, we have so
many screens and things that happened that i think you got lost as you never
finished the true build."

He is right, and the evidence was countable: sixty HTML files, twelve build
scripts and FOUR separate attempts at "the site" -- site/, solstice-site/,
solstice-full/ and concepts/ -- each holding a different subset of the
decisions. No single artefact had all of them. That is what "never finished the
true build" means, and it is a consolidation problem rather than a design one.

This file supersedes all four. Everything below was decided, corrected or
measured earlier in the session, and every one of those decisions is carried:

  HERO        full-bleed photograph, warm grade, a 96-degree scrim dark at the
              left so the headline reads and the picture still shows, with the
              navigation transparent ON it. Daniel picked this off about.html.
  NAVIGATION  a real dropdown: contained card, lifted fill, border, shadow,
              per-item glyphs, a footer with a next step, 120ms open intent and
              280ms close intent, and a burger sheet under 960px from the same
              data so the two cannot drift.
  BRAIN       brain3d.js, Lobes colouring, with a legend. Real cortical surface
              from an MRI, not an authored shape.
  PRICING     the ASKED / FOUND exhibit, general figures, no vendor named.
  REBUILDS    six uncommissioned rebuilds, framed as the question nobody asked.
  EVIDENCE    real `arthur-ontology` output, printed rather than described.
  OMITTED     no founder name in page copy; no "five companies we own and run";
              no client, site or item identifiable anywhere.
"""
import json, re
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / "final"
OUT.mkdir(exist_ok=True)
LIVE = json.loads((HERE / "live-content.json").read_text())
CH = LIVE["chrome"]
BRAIN_JS = (HERE / "brain3d.js").read_text()
_brain = store.read_store()
BRAIN_JS = BRAIN_JS.replace("__OBS__", f"{_brain['props']:,}").replace("__SRC__", str(_brain["sources"]))
STUDIES = [dict(s, frame=f) for s, f in zip(LIVE["studies"], LIVE["study_frames"])]
P = "../../../public/studio/"
PW = "../../../public/portal/collab/"

FONTS = ("https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600"
         "&family=Instrument+Serif:ital@1&display=swap")

# Only people-at-work frames survived the photography review; the grade and the
# directional scrim are what make them one family.
HEROES = {
    "server": ("solstice/own-itlead.jpg", "64% 48%"),
    "bench":  ("solstice/bench-lamp.jpg", "70% 46%"),
    "lab":    ("solstice/own-bench.jpg",  "56% 44%"),
}
GRADE = ("linear-gradient(168deg,rgba(255,182,72,.16) 0%,rgba(226,100,32,.26) 48%,"
         "rgba(102,26,10,.46) 100%)")
SCRIM = ("linear-gradient(96deg,rgba(28,9,4,.90) 0%,rgba(28,9,4,.62) 46%,"
         "rgba(28,9,4,.14) 100%)")

MENUS = {
    # The caption under this menu said "Five components" while four items
    # rendered -- a counting error in the navigation of a site whose thesis is
    # "measured, not asserted". The menu now lists the five components the
    # Arthur page actually documents, so the caption is true and the header
    # and the page agree.
    "Platform": [("Persistent memory", "Context that outlasts a conversation", "arthur.html#architecture"),
                 ("Identity resolution", "Four names, one company", "arthur.html#architecture"),
                 ("Bitemporal record", "What was true, and what we knew", "arthur.html#architecture"),
                 ("Lineage", "A number with no trail is not reportable", "arthur.html#architecture"),
                 ("Verified execution", "Work closes on observed proof", "arthur.html#architecture")],
    "Work": [("Client rebuilds", "Six, uncommissioned", "work.html#studies"),
             ("Catalogue pricing", "Priced below cost, found and corrected", "work.html#pricing"),
             ("How we measure", "Weight, Lighthouse, live position", "about.html#measure")],
    "Company": [("About", "Business judgment, built as software", "about.html"),
                ("How we scope", "Fixed quote, written scope", "about.html#method"),
                ("Contact", "A reply from a person", "contact.html")],
}
GLYPH = {"Arthur": "◉", "The ontology": "◧", "Lineage": "⥁",
         "Verified execution": "✓", "Client rebuilds": "◱",
         "Catalogue pricing": "▣", "How we measure": "≡",
         "About": "○", "How we scope": "△", "Contact": "→"}
PFOOT = {"Platform": ("Five components, each a rule in the write path", "Read the architecture"),
         "Work": ("Thirty-eight sites measured, six rebuilt, one catalogue corrected", "See all the work"),
         "Company": ("Fixed quote, written scope, a reply from a person", "Start a project")}

from store import live_ticker, live_stats

TICKER = live_ticker()

STATS = live_stats()

ASKED_FOUND = [("Asked", "Migrate the price lists into the new ERP."),
               ("Found", "Hundreds of items were selling below their own cost.")]

PRICING_STATS = [("FND", "Hundreds", "Items below cost",
                  "Price floors sitting beneath the item's own cost to buy."),
                 ("AUD", "Per line", "Correction carried",
                  "Each delta computed item by item, not as a lump adjustment."),
                 ("OUT", "Thousands", "Rows written back",
                  "Returned as import files the system accepts, generated not typed."),
                 ("DAY", "One", "Working day",
                  "Found, quantified and handed back inside a single day.")]

PRICING = [
    ("01", "The floor was under the cost",
     "Across several price lists and product lines, the minimum a salesperson could "
     "quote sat beneath what the item actually cost to buy. Nobody had asked the "
     "question, because nothing in the system asks it.", "hundreds of items"),
    ("02", "The gap was quantifiable per line",
     "Every floor raised to actual cost, with the delta carried item by item rather "
     "than estimated in aggregate, so the correction is auditable line by line.",
     "per item"),
    ("03", "Expired agreements were still governing",
     "Minimums inherited from special pricing agreements that had already lapsed were "
     "still setting the floor. Removed, so the list price governs again.",
     "hundreds cleared"),
    ("04", "Items had fallen out of their own tier",
     "Tier pricing the migration had silently dropped, reinstated against the lists "
     "the items belong to.", "thousands of rows"),
    ("05", "The cost side was resolving to stale data",
     "Expired supplier lists reopened, so cost resolves to a live figure instead of "
     "falling through to whatever tier answered last.", "thousands of rows"),
]

LOBES_LEGEND = [("Frontal", "#E8A24A"), ("Parietal", "#4FB6D6"),
                ("Temporal", "#B478E0"), ("Occipital", "#5FC98A")]

CSS = """
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
:root{
  --ink:#241109; --bone:#FBF6EE; --paper:#FFFFFF; --mu:#63523F; --dim:#6F5B49;
  --line:#E4D9C9; --hot:#B4470F; --deep:#1C0904; --on-deep:#F6E9DB;
  --on-deep-mu:#C9AE9A; --on-deep-dim:#9A8371; --deep-line:#48210F;
  --sans:'Inter Tight',system-ui,-apple-system,sans-serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,monospace}
body{margin:0;background:var(--bone);color:var(--ink);
  font:400 17px/1.62 var(--sans);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
.w{max-width:1320px;margin:0 auto;padding:0 clamp(20px,3.2vw,46px)}
h1,h2,h3{margin:0;font-weight:300;letter-spacing:-.042em;line-height:1.05}
h2{font-size:clamp(1.9rem,3.8vw,3rem);max-width:22ch;text-wrap:balance}
h3{font-size:clamp(1.2rem,1.9vw,1.6rem);font-weight:400;letter-spacing:-.03em}
p{margin:0}
.ser{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400;
  letter-spacing:-.02em}
.lab{display:block;font:500 10.5px/1 var(--mono);letter-spacing:.17em;
  text-transform:uppercase;color:var(--hot)}
.lede{margin-top:18px;max-width:62ch;color:var(--mu);font-size:clamp(15.5px,1.5vw,17.5px)}
.note{margin-top:22px;max-width:70ch;color:var(--dim);font-size:14px;line-height:1.62}
.sec{padding:clamp(56px,7.5vw,112px) 0}
.wash{background:var(--paper);border-top:1px solid var(--line);
  border-bottom:1px solid var(--line)}

/* ---------- ticker ---------- */
.tick{background:var(--deep);overflow:hidden;height:30px;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent)}
.tickrow{display:flex;gap:34px;padding:9px 0;white-space:nowrap;width:max-content;
  animation:sl 66s linear infinite}
@keyframes sl{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.tk{font:400 11px/1 var(--mono);letter-spacing:.07em;color:var(--on-deep-mu)}
.tk b{color:var(--on-deep);font-weight:400;margin-left:8px}
.tk i{font-style:normal;margin-left:6px;color:#7FD0A0}
@media(prefers-reduced-motion:reduce){.tickrow{animation:none}}

/* ---------- hero ---------- */
.herowrap{position:relative;isolation:isolate}
.hsky{position:absolute;inset:0;overflow:hidden;z-index:0;background:#180802}
.hsky img{width:100%;height:100%;object-fit:cover;filter:saturate(.8) contrast(1.06)}
.hgrade,.hscrim,.htop{position:absolute;inset:0}
/* The 96-degree scrim is dark at the LEFT and clears to the right, which is
   exactly where the nav buttons sit -- "Contact sales" measured 3.31:1 over the
   bright side of one photograph. A top-edge scrim across the full width makes
   the nav band safe whatever the picture is doing underneath it. */
.htop{background:linear-gradient(180deg,rgba(18,6,2,.62) 0%,rgba(18,6,2,.34) 44%,
  rgba(18,6,2,0) 100%);height:168px;bottom:auto}
.hbody{position:relative;z-index:5;padding:clamp(86px,10vw,150px) 0 clamp(58px,7vw,112px)}
.hbody h1{font-size:clamp(2.6rem,6vw,4.9rem);color:#FFF8EE;max-width:17ch;
  text-wrap:balance}
.hbody p{margin:22px 0 0;max-width:52ch;color:#FBEFE1;font-size:clamp(16px,1.6vw,18px)}
.hbody p+p{margin-top:14px;color:#EFD9C4;font-size:16.5px}
.hacts{display:flex;gap:26px;flex-wrap:wrap;margin-top:32px}
.hacts a{font:500 15px/1 var(--sans);color:#FFF8EE;padding-bottom:6px;
  border-bottom:1px solid rgba(255,248,238,.45)}
.hacts a:hover{border-bottom-color:#FFF8EE}

/* ---------- navigation ---------- */
nav.bar{position:relative;z-index:40}
nav.bar>.w{display:flex;align-items:center;gap:clamp(10px,1.8vw,22px);height:64px}
.bd{font:600 14px/1 var(--sans);letter-spacing:.055em;text-transform:uppercase;
  white-space:nowrap;color:#FFF6EA}
.tabs{display:none;gap:4px;margin-left:16px}
@media(min-width:960px){.tabs{display:flex}}
.tab{font:400 14px/1 var(--sans);color:rgba(255,246,234,.82);background:none;border:0;
  padding:9px 12px;cursor:pointer;display:flex;align-items:center;gap:6px;
  border-radius:6px;transition:background .15s,color .15s}
.tab i{font-style:normal;font-size:11px;line-height:1;transition:transform .15s}
.tab:hover{background:rgba(255,255,255,.12);color:#FFF6EA}
.tab[aria-expanded="true"]{background:rgba(255,255,255,.17);color:#FFF6EA}
.tab[aria-expanded="true"] i{transform:rotate(180deg)}
.rt{margin-left:auto;display:none;align-items:center;gap:12px}
@media(min-width:960px){.rt{display:flex}}
.btn{display:inline-block;font:500 13.5px/1 var(--sans);padding:10px 17px;
  border:1px solid rgba(255,255,255,.38);border-radius:6px;white-space:nowrap;
  color:#FFF6EA}
.btn.solid{background:#FFF8EE;border-color:#FFF8EE;color:#5A1607;font-weight:600}
.panel{display:none;position:absolute;left:clamp(14px,2.6vw,40px);
  right:clamp(14px,2.6vw,40px);top:calc(100% + 8px);max-width:1120px;margin:0 auto;
  background:#1B0D06;border:1px solid rgba(255,255,255,.14);border-radius:12px;
  box-shadow:0 26px 54px -14px rgba(0,0,0,.66);overflow:hidden;text-align:left}
nav.bar[data-open="Platform"] .panel[data-p="Platform"],
nav.bar[data-open="Work"] .panel[data-p="Work"],
nav.bar[data-open="Company"] .panel[data-p="Company"]{display:block}
.pin{padding:24px 26px 0}
.pgrid{display:grid;gap:4px 18px;margin-top:14px}
@media(min-width:760px){.pgrid{grid-template-columns:repeat(auto-fit,minmax(196px,1fr))}}
.mi{display:block;padding:12px;border-radius:8px;transition:background .15s}
.mi:hover,.mi:focus-visible{background:rgba(255,255,255,.06)}
.mi .ic{display:block;width:20px;height:20px;margin-bottom:10px;color:#E8A24A;
  font:400 15px/20px var(--mono)}
.mi b{display:block;font:600 15px/1.3 var(--sans);letter-spacing:-.01em;color:#FFF3E6;
  transition:color .15s}
.mi:hover b{color:#E8A24A}
.mi span{display:block;margin-top:4px;font-size:13px;line-height:1.5;color:#B79C87}
.pfoot{margin-top:16px;padding:15px 26px;border-top:1px solid rgba(255,255,255,.12);
  font:400 13px/1.4 var(--sans);color:#B79C87;display:flex;
  justify-content:space-between;gap:14px;flex-wrap:wrap}
.pfoot a{color:#E8A24A}
.burger{display:flex;margin-left:auto;width:40px;height:40px;padding:0;cursor:pointer;
  background:none;color:#FFF6EA;border:1px solid rgba(255,255,255,.38);border-radius:6px;
  flex-direction:column;align-items:center;justify-content:center;gap:5px}
@media(min-width:960px){.burger{display:none}}
.burger span{display:block;width:15px;height:1.5px;background:currentColor}
.sheet{display:none;position:absolute;left:0;right:0;top:100%;background:#1B0D06;
  border-top:1px solid rgba(255,255,255,.14);max-height:calc(100dvh - 64px);overflow-y:auto;z-index:41;
  overscroll-behavior:contain}
nav.bar[data-sheet="1"] .sheet{display:block}
.sg{padding:14px 0;border-bottom:1px solid rgba(255,255,255,.12)}
.sg .lab{color:#E8A24A;margin-bottom:6px}
.sacts{display:flex;gap:10px;flex-wrap:wrap;padding:18px 0 22px}
"""

CSS += """
/* ---------- components ---------- */
.srcs{margin-top:30px;border-top:1px solid var(--line)}
.src{display:grid;grid-template-columns:1fr;gap:4px;padding:15px 0;
  border-bottom:1px solid var(--line)}
@media(min-width:720px){.src{grid-template-columns:230px 1fr;gap:28px;align-items:baseline}}
.src .sys{font:500 12px/1.4 var(--mono);letter-spacing:.09em;color:var(--hot)}
.src .was{font:400 clamp(1rem,1.5vw,1.15rem)/1.45 var(--sans);letter-spacing:-.012em}
.panels{display:grid;gap:1px;background:var(--line);border:1px solid var(--line);
  margin-top:28px}
@media(min-width:720px){.panels{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1060px){.panels{grid-template-columns:repeat(4,1fr)}}
.pnl{background:var(--paper);padding:20px}
.pnl .code{font:500 10.5px/1 var(--mono);letter-spacing:.15em;color:var(--hot)}
.pnl b{display:block;margin-top:12px;font:300 clamp(1.8rem,3vw,2.5rem)/1 var(--sans);
  letter-spacing:-.045em;font-variant-numeric:tabular-nums}
.pnl span{display:block;margin-top:8px;font:500 11px/1.4 var(--mono);letter-spacing:.07em;
  text-transform:uppercase;color:var(--dim)}
.pnl p{margin-top:9px;font-size:13.5px;line-height:1.55;color:var(--mu)}

.af{display:grid;gap:1px;background:var(--line);border:1px solid var(--line);margin-top:28px}
@media(min-width:760px){.af{grid-template-columns:1fr 1.3fr}}
.afr{background:var(--paper);padding:22px 24px}
.afr p{margin-top:10px;font:400 clamp(15.5px,1.6vw,19px)/1.42 var(--sans);
  letter-spacing:-.018em}
.afr:last-child p{color:var(--hot)}

.rows{border-top:1px solid var(--ink);margin-top:28px}
.row{display:grid;gap:6px 26px;padding:20px 0;border-bottom:1px solid var(--line);
  align-items:baseline}
@media(min-width:880px){.row{grid-template-columns:44px 230px minmax(0,1fr) 150px}}
.row .c{font:400 11.5px/1.7 var(--mono);color:var(--hot)}
.row b{font:500 17.5px/1.3 var(--sans);letter-spacing:-.022em}
.row p{font-size:14.5px;line-height:1.6;color:var(--mu)}
.row .n{font:400 11.5px/1.7 var(--mono);color:var(--dim)}
@media(min-width:880px){.row .n{text-align:right}}

.spec{margin-top:30px;border-top:1px solid var(--ink)}
.spec .r{display:grid;gap:12px;padding:24px 0;border-bottom:1px solid var(--line)}
@media(min-width:880px){.spec .r{grid-template-columns:50px minmax(0,254px) minmax(0,1fr);
  gap:0 32px;align-items:start}}
.spec .n{font:400 12px/1.6 var(--mono);color:var(--dim)}
.spec b{display:block;font:500 19px/1.28 var(--sans);letter-spacing:-.03em}
.olead{display:block;margin-top:7px;font-size:14.5px;color:var(--mu);line-height:1.5}
.spec p{margin:0;font-size:15.5px;color:var(--mu);line-height:1.62}
.chain{display:flex;align-items:center;gap:10px;margin-top:14px;flex-wrap:wrap}
.chain span{font:500 11px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;
  color:var(--ink);background:rgba(180,71,15,.07);border:1px solid rgba(180,71,15,.22);
  border-radius:100px;padding:7px 12px;white-space:nowrap}
.chain i{width:14px;height:1px;background:var(--line);flex:none}
.why{margin-top:14px !important;padding-top:12px;border-top:1px solid var(--line);
  font-size:14.5px !important}
.why .lab{display:inline;margin-right:8px}

.grid{display:grid;gap:14px;margin-top:26px}
@media(min-width:680px){.grid{grid-template-columns:1fr 1fr}}
@media(min-width:1060px){.grid{grid-template-columns:repeat(3,1fr)}}
.card{border:1px solid var(--line);background:var(--paper);overflow:hidden;
  display:flex;flex-direction:column}
.card .sh{aspect-ratio:16/10;overflow:hidden;background:#EDE6DA}
.card .sh img{width:100%;height:100%;object-fit:cover;object-position:top center}
.card .cb{padding:16px 17px 20px}
.card p{margin-top:9px;font-size:14px;line-height:1.55;color:var(--mu)}

.brainbox{position:relative;width:100%;height:clamp(460px,50vw,620px)}
.brainbox canvas{width:100%;height:100%;display:block}
.legend{display:flex;flex-wrap:wrap;align-items:center;gap:10px 22px;
  padding:16px 0 2px;justify-content:center}
.lg{display:inline-flex;align-items:center;gap:7px;font:500 11px/1 var(--mono);
  letter-spacing:.13em;text-transform:uppercase;color:var(--on-deep-mu)}
.lg i{width:8px;height:8px;border-radius:50%;display:block}
.lgsrc{flex-basis:100%;text-align:center;font:400 10.5px/1.6 var(--mono);
  letter-spacing:.06em;color:var(--on-deep-dim)}

.dark{background:var(--deep);color:var(--on-deep)}
.dark .lab{color:#E8A24A}
.dark .lede{color:var(--on-deep-mu)}
.dark .note{color:var(--on-deep-dim)}

.consw{display:grid;gap:18px;margin-top:30px}
@media(min-width:980px){.consw{grid-template-columns:1fr 1fr;gap:20px}}
.cpanel{background:#120803;border:1px solid #3A1D0E;border-radius:3px;overflow:hidden}
.cbar{font:400 11.5px/1 var(--mono);color:#E0A57C;padding:12px 16px;
  border-bottom:1px solid #3A1D0E;background:#0C0502;white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis}
.cbody{padding:16px;font:400 12.5px/1.75 var(--mono);color:#F0E2D4}
.ch b{color:#fff;font-weight:600}
.cid{margin-left:10px;color:#9C8271}
.ca{color:#9C8271;margin:2px 0 12px}
.cp,.tr{display:grid;gap:2px 12px;padding:5px 0;border-top:1px solid rgba(255,255,255,.055)}
@media(min-width:520px){.cp{grid-template-columns:148px minmax(0,1fr);align-items:baseline}
  .tr{grid-template-columns:56px minmax(0,1fr);align-items:baseline}}
.ck{color:#B99C86}
.cv,.tv{color:#5FD3C4;font-variant-numeric:tabular-nums}
.tt{color:#F0E2D4}
.to{color:#9C8271;grid-column:1/-1}
.cs{color:#9C8271;grid-column:1/-1;word-break:break-all}
.cs i{color:#E56E3E;font-style:normal}
.cnote{margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,.09);
  color:#B99C86;font-size:11.5px;line-height:1.65}
.cnote span{color:#E56E3E}

.clauses{display:grid;gap:22px;margin-top:34px;padding-top:28px;
  border-top:1px solid var(--deep-line)}
@media(min-width:820px){.clauses{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1120px){.clauses{grid-template-columns:repeat(4,1fr);gap:26px}}
.clauses b{display:block;font:500 18px/1.25 var(--sans);letter-spacing:-.03em}
.clauses p{margin:9px 0 0;font-size:14.5px;line-height:1.6;color:var(--on-deep-mu)}

.form{max-width:640px;margin-top:30px;display:grid;gap:20px}
.pair{display:grid;gap:20px;grid-template-columns:1fr}
@media(min-width:640px){.pair{grid-template-columns:1fr 1fr}}
.fld{display:block}
.fld .lab{margin-bottom:9px}
.fld option{color:var(--ink)}
.fld input,.fld select,.fld textarea{width:100%;font:400 15.5px/1.5 var(--sans);
  padding:13px 14px;border:1px solid var(--line);background:var(--paper);
  color:var(--ink);border-radius:3px;opacity:1;-webkit-text-fill-color:var(--ink)}
.send{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:4px}
.hint{font:400 13.5px/1.4 var(--sans);color:var(--mu)}
.btn.ink{background:var(--ink);border-color:var(--ink);color:var(--bone)}
.btn.line{border-color:var(--ink);color:var(--ink)}
.faq details{border-bottom:1px solid var(--line);padding:18px 0}
.faq summary{cursor:pointer;list-style:none;font:400 19px/1.35 var(--sans);
  letter-spacing:-.028em;display:flex;justify-content:space-between;gap:18px}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";color:var(--hot)}
.faq details[open] summary::after{content:"\\2013"}
.faq p{margin-top:12px;max-width:74ch;color:var(--mu);font-size:15.5px;line-height:1.66}
.app{background:var(--paper);border:1px solid var(--line);border-radius:14px;
  padding:30px;margin-top:28px}
.app .k{font:500 11px/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;
  color:var(--hot)}
.app .q{margin:14px 0 0;font:300 clamp(1.3rem,2.4vw,1.8rem)/1.3 var(--sans);
  letter-spacing:-.03em}
.app .appbd{margin:12px 0 0;color:var(--mu);font-size:15.5px;line-height:1.62}
.app ul{margin:16px 0 0;padding:0;list-style:none;display:grid;gap:10px}
@media(min-width:680px){.app ul{grid-template-columns:1fr 1fr}}
.app li{font-size:14.5px;color:var(--mu);padding-left:18px;position:relative}
.app li::before{content:"";position:absolute;left:0;top:9px;width:7px;height:7px;
  background:var(--hot)}

.close{text-align:center;padding:clamp(70px,9vw,130px) 0;border-top:1px solid var(--line)}
.close h2{margin:16px auto 0}
.close .lede{margin-left:auto;margin-right:auto}
.cacts{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:32px}
footer{background:var(--deep);color:var(--on-deep-mu);padding:56px 0 46px;font-size:13.5px}
.fg{display:grid;gap:30px}
@media(min-width:760px){.fg{grid-template-columns:1.4fr 1fr 1fr 1fr}}
.fg .lab{color:var(--on-deep-dim);margin-bottom:12px}
.fg a{display:block;padding:5px 0;color:var(--on-deep-mu)}
.fg a:hover{color:var(--on-deep)}
.fbase{margin-top:44px;padding-top:22px;border-top:1px solid var(--deep-line);
  display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
  font:400 11.5px/1.7 var(--mono);color:var(--on-deep-dim)}
"""


NAV_JS = """<script>
(function(){
  document.querySelectorAll('nav.bar').forEach(function(bar){
    var closeT=null, openT=null;
    function open(n){ clearTimeout(closeT); clearTimeout(openT); bar.dataset.open=n||'';
      bar.querySelectorAll('.tab').forEach(function(t){
        t.setAttribute('aria-expanded', t.dataset.menu===n?'true':'false'); }); }
    bar.querySelectorAll('.tab').forEach(function(t){
      t.addEventListener('mouseenter',function(){ clearTimeout(closeT);
        if(bar.dataset.open){ open(t.dataset.menu); }
        else { openT=setTimeout(function(){ open(t.dataset.menu); },120); } });
      t.addEventListener('mouseleave',function(){ clearTimeout(openT); });
      t.addEventListener('focus',function(){ open(t.dataset.menu); });
      t.addEventListener('click',function(e){ e.preventDefault();
        open(bar.dataset.open===t.dataset.menu?'':t.dataset.menu); }); });
    bar.addEventListener('mouseleave',function(){
      closeT=setTimeout(function(){ open(''); },280); });
    bar.addEventListener('mouseenter',function(){ clearTimeout(closeT); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') open(''); });
    var b=bar.querySelector('.burger');
    if(b) b.addEventListener('click',function(){
      bar.dataset.sheet = bar.dataset.sheet==='1' ? '' : '1';
      b.setAttribute('aria-expanded', bar.dataset.sheet==='1'?'true':'false'); });
  });
})();
</script>"""


def ticker():
    one = "".join(f'<span class=tk>{k}<b>{v}</b>' + (f'<i>({d})</i>' if d else '') +
                  '</span>' for k, v, d in TICKER)
    return f'<div class=tick><div class=tickrow>{one}{one}</div></div>'


def nav():
    tabs = "".join(f'<button class=tab data-menu="{k}" aria-expanded=false>{k}'
                   f'<i aria-hidden=true>&#9662;</i></button>' for k in MENUS)
    panels = "".join(
        f'<div class=panel data-p="{k}"><div class=pin><span class=lab>{k}</span>'
        f'<div class=pgrid>' +
        "".join(f'<a class=mi href="{h}"><span class=ic>{GLYPH.get(t,"○")}</span>'
                f'<b>{t}</b><span>{d}</span></a>' for t, d, h in rows) +
        f'</div></div><div class=pfoot><span>{PFOOT[k][0]}</span>'
        f'<a href="{rows[0][2]}">{PFOOT[k][1]} &rarr;</a></div></div>'
        for k, rows in MENUS.items())
    sheet = "".join(
        f'<div class=sg><span class=lab>{k}</span>' +
        "".join(f'<a class=mi href="{h}"><b>{t}</b><span>{d}</span></a>'
                for t, d, h in rows) + '</div>' for k, rows in MENUS.items())
    return (f'<nav class=bar data-open=""><div class=w>'
            f'<a class=bd href="home.html">LOVELEEDAY</a><div class=tabs>{tabs}</div>'
            f'<div class=rt>'
            f'<a class="btn solid" href="contact.html">Start a project</a></div>'
            f'<button class=burger aria-label=Menu aria-expanded=false>'
            f'<span></span><span></span></button></div>'
            f'{panels}<div class=sheet><div class=w>{sheet}'
            f'<div class=sacts>'
            f'<a class="btn solid" href="contact.html">Start a project</a>'
            f'</div></div></div></nav>')


def hero(which, h1, paras, acts=None):
    """Full-bleed photograph, warm grade, and a 96-degree scrim that is dark at
       the left so the headline reads and the picture still shows on the right.
       The navigation sits transparently on top of it."""
    photo, anchor = HEROES[which]
    ps = "".join(f"<p>{t}</p>" for t in paras)
    a = ""
    if acts:
        a = '<div class=hacts>' + "".join(
            f'<a href="{h}">{t} &rarr;</a>' for t, h in acts) + '</div>'
    return (f'<div class=herowrap>'
            f'<div class=hsky aria-hidden=true>'
            f'<img style="object-position:{anchor}" src="{P}{photo}" alt="">'
            f'<div class=hgrade style="background:{GRADE}"></div>'
            f'<div class=hscrim style="background:{SCRIM}"></div>'
            f'<div class=htop></div></div>'
            f'{ticker()}{nav()}'
            f'<div class=hbody><div class=w><h1>{h1}</h1>{ps}{a}</div></div></div>')


# What each connected system actually is, in the words a reader already has.
# Keyed by the source_system string the store writes, so a source that is
# connected without being described here still appears -- under its own name,
# visibly undescribed -- rather than silently dropping out of the count and
# quietly making the claim smaller than the truth.
WORD = {1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six",
        7: "seven", 8: "eight", 9: "nine", 10: "ten", 11: "eleven", 12: "twelve"}

SOURCE_WORDS = {
    "stripe":      "A payment ledger. Charges, customers, the money as it moved.",
    "nylas":       "A live mailbox. What is being agreed in prose, not in a form.",
    "email-corpus": "An archive of mail already sent, read once and kept.",
    "fly.io":      "The running infrastructure. Machines, regions, what is deployed.",
    "nominatim":   "A public gazetteer. An address turned into a place on the earth.",
    "sentinel-2":  "A satellite. Ten-metre optical imagery of the ground itself.",
    "weather.gov": "The weather. Forecast and observation, by station and hour.",
}


def sources():
    """The list is generated, which is the only honest way to make this claim.

    'We can read anything' is an adjective. Seven named systems, printed from
    the store that holds them, is a fact -- and it gets longer on its own the
    next time one is connected, without anyone rewriting a sentence."""
    d = store.read_store()
    out = '<div class=srcs>'
    for s in d['srcs']:
        out += (f'<div class=src><span class=sys>{s}</span>'
                f'<span class=was>{SOURCE_WORDS.get(s, "Connected. Not yet described here.")}'
                f'</span></div>')
    return out + '</div>'


def panels(items):
    return '<div class=panels>' + "".join(
        f'<div class=pnl><span class=code>{c}</span><b>{v}</b><span>{l}</span>'
        f'<p>{d}</p></div>' for c, v, l, d in items) + '</div>'


def asked_found():
    return '<div class=af>' + "".join(
        f'<div class=afr><span class=lab>{k}</span><p>{v}</p></div>'
        for k, v in ASKED_FOUND) + '</div>'


def pricing_rows():
    return '<div class=rows>' + "".join(
        f'<div class=row><span class=c>{i}</span><b>{t}</b><p>{d}</p>'
        f'<span class=n>{n}</span></div>' for i, t, d, n in PRICING) + '</div>'


def spec(rows):
    return '<div class=spec>' + "".join(
        f'<div class=r><div class=n>{n}</div><div><b>{t}</b></div>'
        f'<div><p>{d}</p></div></div>' for n, t, d in rows) + '</div>'


def work_cards(n=6, teaser=False):
    """On Home these are a teaser, so the card carries the sector and a single
       clause rather than the whole thesis Work prints in full."""
    def body(s):
        if not teaser:
            return f'<p>{s["thesis"]}</p>'
        first = s["thesis"].split(". ")[0]
        return f'<p>{first}.</p>'
    return '<div class=grid>' + "".join(
        f'<a class=card href="work.html#studies"><div class=sh>'
        f'<img src="../../../public{s["frame"]}" alt="" loading=lazy></div>'
        f'<div class=cb><span class=lab>{s["id"]} &middot; {s["sector"]}</span>'
        f'{body(s)}</div></a>' for s in STUDIES[:n]) + '</div>'


def brain():
    legend = "".join(f'<span class=lg><i style="background:{c}"></i>{n}</span>'
                     for n, c in LOBES_LEGEND)
    return (f'<div class=brainbox><canvas data-brain></canvas></div>'
            f'<script>Brain3D.mount(document.currentScript.previousElementSibling'
            f'.querySelector("canvas"),{{style:"lobe"}});</script>'
            f'<div class=legend>{legend}<span class=lgsrc>Cortical surface from an '
            f'MRI &middot; 1,722 points &middot; NIH 3D 3DPX-000757, public domain'
            f'</span></div>')


def console():
    card = [("h", "Dabney &amp; Co.", "venue:dabney-co"),
            ("a", "also known as", "344 N Rose · Dabney · Dabney and Co"),
            ("p", "address", "344 N Rose Street, Kalamazoo, MI", "nominatim", "osm:way/887807677"),
            ("p", "temp_f", "61", "weather.gov", "api.weather.gov/gridpoints/GRR/46,16"),
            ("p", "sat_cloud_pct", "43.3", "sentinel-2", "S2C_16TFM_20260918_0_L2A"),
            ("p", "sat_last_pass_at", "2026-09-18T16:41:51Z", "sentinel-2", "S2C_16TFM_20260918_0_L2A")]
    trail = [("94.64", "2026-09-14 → 2026-09-15", "2026-09-14", "S2B_16TFM_20260913_0_L2A"),
             ("94.64", "2026-09-18 → 2026-09-19", "2026-09-18", "S2B_16TFM_20260913_0_L2A"),
             ("43.3", "2026-09-19 → 2026-09-20", "2026-09-19", "S2C_16TFM_20260918_0_L2A"),
             ("43.3", "2026-09-20 → open", "2026-09-20", "S2C_16TFM_20260918_0_L2A")]
    rows = ""
    for r in card:
        if r[0] == "h":
            rows += f'<div class=ch><b>{r[1]}</b><span class=cid>[{r[2]}]</span></div>'
        elif r[0] == "a":
            rows += f'<div class=ca>{r[1]}: {r[2]}</div>'
        else:
            _, k, v, sy, rf = r
            rows += (f'<div class=cp><span class=ck>{k}</span><span class=cv>{v}</span>'
                     f'<span class=cs>&larr; {sy}: <i>{rf}</i></span></div>')
    tr = "".join(f'<div class=tr><span class=tv>{v}</span><span class=tt>true {va}</span>'
                 f'<span class=to>observed {ob}</span>'
                 f'<span class=cs>&larr; sentinel-2: <i>{rf}</i></span></div>'
                 for v, va, ob, rf in trail)
    return (f'<div class=consw>'
            f'<div class=cpanel><div class=cbar>arthur-ontology "dabney"</div>'
            f'<div class=cbody>{rows}</div></div>'
            f'<div class=cpanel><div class=cbar>arthur-ontology lineage "dabney" '
            f'sat_cloud_pct</div><div class=cbody>{tr}'
            f'<div class=cnote>arthur-ontology "dabney" --as-of 2026-09-01 '
            f'--as-known-at 2026-09-01<br><span>(no properties were true and known '
            f'at that point)</span></div></div></div></div>')


def close(head, sub, second=None, eyebrow="Start"):
    extra = (f'<a class="btn line" href="{second[1]}">{second[0]}</a>' if second else '')
    return (f'<section class=close><div class=w><span class=lab>{eyebrow}</span>'
            f'<h2>{head}</h2><p class=lede>{sub}</p>'
            f'<div class=cacts><a class="btn ink" href="contact.html">Start a project</a>'
            f'{extra}</div></div></section>')


def footer():
    """The footer was read from the live site's Footer.tsx and listed a
       different, non-overlapping set of children under the same top-level
       labels as the header dropdown -- two sitemaps contradicting each other on
       every page. It mirrors the header now; there is one structure."""
    cols = "".join(
        f'<div><span class=lab>{k}</span>' +
        "".join(f'<a href="{h}">{t}</a>' for t, _, h in rows) + '</div>'
        for k, rows in MENUS.items())
    return (f'<footer><div class=w><div class=fg>'
            f'<div><div class=bd style="color:var(--on-deep)">LOVELEEDAY</div>'
            f'<p style="margin-top:12px;max-width:32ch">{CH["tagline"]}</p></div>{cols}</div>'
            f'<div class=fbase><span>&copy; 2026 LOVELEEDAY STUDIOS LLC</span>'
            f'<span>{CH["city"].upper()}</span></div></div></footer>')


def shell(title, body, desc=""):
    return f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>{title}</title><meta name=description content="{desc}">
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="{FONTS}" rel=stylesheet>
<style>{CSS}</style>
<script>{BRAIN_JS}</script>
</head><body>
{body}
{NAV_JS}
</body></html>"""


def home():
    """Both reviewers found the same thing independently: Home carried the FULL
       pricing case study, the FULL six-card rebuild grid and the FULL terminal
       evidence, verbatim, so Work and Arthur were reruns with a new hero. The
       five-page structure was not giving five reasons to keep browsing.

       Home teases now and the interior pages hold the detail: one stat, the
       headline, and a link. A visitor should never arrive somewhere and find
       they have already read it."""
    g = LIVE["guarantees"]
    nsrc = WORD.get(store.read_store()["sources"], store.read_store()["sources"])
    srcs = sources()
    body = hero("server",
                'Intelligence <span class=ser>you can trace.</span>',
                ["The object layer for the business you already run.",
                 "Records scattered across payments, ledgers and documents are resolved "
                 "into single objects &mdash; each carrying the date it was true, the date "
                 "we learned it, and a trail back to the system it came from."],
                [("Start a project", "contact.html"), ("Read the architecture", "arthur.html")])
    body += f"""
<section class=sec><div class=w>
  <span class=lab>In production</span>
  <h2>Measured, <span class=ser>not asserted.</span></h2>
  {panels(STATS)}
</div></section>

<section class=sec><div class=w>
  <span class=lab>What it reads</span>
  <h2>A payment ledger, a satellite, <span class=ser>and the weather.</span></h2>
  <p class=lede>Three of the {nsrc} systems resolved into the store right now, answerable in
  the same sentence as each other. Not because a business needs satellite imagery &mdash;
  because nothing underneath knows the difference between one feed and the next. A source is
  an adapter that returns readings with the system they came from and the record they came
  out of. What it can answer is bounded by what it can read, never by the department the
  question belongs to.</p>
  {srcs}
  <p class=lede style="margin-top:32px">The engagements have gone the same way. A
  catalogue's pricing, a company's marketing site, the automation sitting underneath both
  &mdash; different rooms of a business, and the same work each time: read everything it
  already keeps, resolve it onto the things it actually has, then say what nobody thought to
  ask.</p>
  <p style="margin-top:18px;font-size:clamp(1.25rem,2.2vw,1.7rem);line-height:1.3;
    letter-spacing:-.022em"><span class=ser>The discipline changes. The method does not.</span></p>
  <p class=note>The list above is generated from the store when this page is built. Connect a
  source and it appears on the next build, with no sentence rewritten and nobody's word taken
  for it &mdash; which is the only version of &ldquo;any source&rdquo; we are willing to
  print.</p>
</div></section>

<section class="sec dark"><div class=w>
  <span class=lab>Arthur &middot; cognition</span>
  <h2>Ask it something.<br><span class=ser>Watch what it asks back.</span></h2>
  <p class=lede>Give it a question and it decomposes into the questions it has to
  answer first &mdash; which objects the words resolve to, what was known on the date,
  whether every input carries a source, and whether the action is reversible.</p>
</div>{brain()}</section>

<section class=sec><div class=w>
  <span class=lab>The question nobody asked</span>
  <h2>We were hired to move <span class=ser>the price lists.</span></h2>
  {asked_found()}
  <p class=lede>The engagement was a migration. The finding was that the floor had
  drifted under the cost on hundreds of items &mdash; quantified line by line and
  written back as files the system would accept, inside a working day.</p>
  <p style="margin-top:28px"><a class="btn line" href="work.html#pricing">Read what
  was found &rarr;</a></p>
</div></section>

<section class="sec wash" id=studies><div class=w>
  <span class=lab>The question nobody asked</span>
  <h2>Thirty-eight measured. <span class=ser>Six rebuilt.</span></h2>
  <p class=lede>Nobody commissioned those either. The argument was easier to make in
  working HTML than in a deck.</p>
  {work_cards(3, teaser=True)}
  <p style="margin-top:26px"><a class="btn line" href="work.html#studies">See all six
  rebuilds &rarr;</a></p>
</div></section>

<section class="sec wash"><div class=w>
  <span class=lab>What the ontology guarantees</span>
  <h2>Five properties. <span class=ser>Enforced,</span> not promised.</h2>
  <p class=lede>Each of these lives in the write path rather than in a deck. That is
  the difference between a system you can report from and a system you have to check.</p>
  {spec([(r[0], r[1], r[2]) for r in g[:3]])}
  <p style="margin-top:26px"><a class="btn line" href="arthur.html#architecture">All five,
  and the output that proves them &rarr;</a></p>
</div></section>
""" + close('See the question. <span class=ser>Build the answer.</span>',
            "Tell us what is slowing you down. We reply the same week, with a plan or "
            "with a reason it is not a fit.",
            second=("Read the architecture", "arthur.html"),
            eyebrow="Bring us the question") + footer()
    return shell("LOVELEEDAY Studios", body,
                 "Intelligence architecture and the production software that runs on top of it.")


def arthur():
    comp = LIVE["components"]
    chains = LIVE.get("component_chains", [])
    rows = ""
    for i, c in enumerate(comp):
        steps = chains[i] if i < len(chains) else []
        trail = ("<div class=chain>" + "<i></i>".join(f"<span>{x}</span>" for x in steps)
                 + "</div>") if steps else ""
        rows += (f'<div class=r><div class=n>{c.get("n","0%d" % (i+1))}</div>'
                 f'<div><b>{c.get("title","")}</b>'
                 f'<span class=olead>{c.get("lead","")}</span></div>'
                 f'<div><p>{c.get("body","")}</p>{trail}'
                 f'<p class=why><span class=lab>Why it matters</span>'
                 f'{c.get("why","")}</p></div></div>')
    apps = ""
    for i, a in enumerate(LIVE["applications"]):
        pr = LIVE["app_produces"][i] if i < len(LIVE["app_produces"]) else []
        apps += (f'<div class=app><span class=k>{a.get("tag","")}</span>'
                 f'<span class=lab style="margin-top:14px">The business question</span>'
                 f'<p class=q>{a.get("question","")}</p>'
                 f'<p class=appbd>{a.get("body","")}</p>'
                 f'<span class=lab style="margin-top:20px">A scoped engagement can produce</span>'
                 f'<ul>{"".join(f"<li>{x}</li>" for x in pr)}</ul></div>')
    faq = "".join(
        f'<details{" open" if i == 0 else ""}><summary>{q["q"]}</summary><p>{q["a"]}</p></details>'
        for i, q in enumerate(LIVE["faq"]))
    body = hero("bench",
                'Built to connect. <span class=ser>Designed to act.</span>',
                ["Arthur&rsquo;s codebase brings together the foundations for remembering "
                 "context, resolving who and what a record refers to, coordinating work, "
                 "selecting models and acting through tools.",
                 "These are implemented architectural components, not a claim that every "
                 "component runs in every workflow. We scope and validate the configuration "
                 "for each engagement."])
    body += f"""
<section class=sec id=architecture><div class=w>
  <span class=lab>The architecture</span>
  <h2>What Arthur is <span class=ser>made of.</span></h2>
  {rows and '<div class=spec>' + rows + '</div>'}
</div></section>

<section class="sec dark" id=ontology><div class=w>
  <span class=lab>Arthur &middot; cognition</span>
  <h2>Ask it something.<br><span class=ser>Watch what it asks back.</span></h2>
  <p class=lede>The four beats are the model: a question lands, the signal propagates
  along real edges, the sub-questions surface at the nodes they fired from, and they
  resolve into one answer with its evidence.</p>
</div>{brain()}</section>

<section class="sec dark" id=lineage style="padding-top:0"><div class=w>
  <span class=lab>The actual output</span>
  <h2>Every value, <span class=ser>with its receipt.</span></h2>
  {console()}
  <p class=note>{_brain['objects']:,} objects, {_brain['props']:,} property observations, {_brain['sources']} source systems. The last
  command asks what was known on a date, and the store declines to answer with anything
  it had not yet seen.</p>
</div></section>

<section class="sec wash" id=proof><div class=w>
  <span class=lab>What this opens up</span>
  <h2>The applications <span class=ser>are the point.</span></h2>
  <p class=lede>Start with the business problem. Define the evidence, the deliverable,
  and what success should look like.</p>
  {apps}
  <p class=note>Integrations require approved access, compatible APIs, and implementation.</p>
</div></section>

<section class=sec><div class=w>
  <span class=lab>FAQ</span>
  <h2>Good questions <span class=ser>are welcome.</span></h2>
  <div class=faq>{faq}</div>
</div></section>
""" + close('Bring us <span class=ser>the question.</span>',
            "Scoped engagements open this quarter. The problem comes first; Arthur is how "
            "we get to a defensible answer, not the thing we are selling you.",
            second=("See what we’ve shipped", "work.html")) + footer()
    return shell("Arthur &mdash; LOVELEEDAY Studios", body,
                 "The intelligence architecture: memory, identity resolution, bitemporality, "
                 "lineage and verified execution.")


def work():
    body = hero("lab", 'Shipped, <span class=ser>not proposed.</span>',
                ["Two bodies of work, kept separate on purpose. Uncommissioned rebuilds of "
                 "sites nobody asked us to touch, and a catalogue correction nobody asked "
                 "us to look for."])
    body += f"""
<section class=sec id=pricing><div class=w>
  <span class=lab>The question nobody asked</span>
  <h2>We were hired to move <span class=ser>the price lists.</span></h2>
  {asked_found()}
  <p class=lede>The engagement was a migration. The finding was that the floor had
  drifted under the cost on hundreds of items. Quantified line by line and written
  back as files the system would accept, inside a working day.</p>
  {panels(PRICING_STATS)}
  {pricing_rows()}
</div></section>

<section class="sec wash" id=studies><div class=w>
  <span class=lab>The question nobody asked</span>
  <h2>Thirty-eight measured. <span class=ser>Six rebuilt.</span></h2>
  <p class=lede>One venture portfolio, measured end to end on page weight, Lighthouse,
  live search position and accessibility. Six of them rebuilt as running pages.</p>
  {work_cards()}
  <p class=note>The companies are not named here. Each rebuild carries measured
  criticism of the site it replaces, and that belongs in a private review addressed
  to the company rather than on a marketing page.</p>
</div></section>
""" + close('Bring us <span class=ser>the question.</span>',
            "Tell us what is slowing you down. We reply the same week.") + footer()
    return shell("Work &mdash; LOVELEEDAY Studios", body,
                 "Uncommissioned rebuilds and a catalogue correction nobody asked for.")


def about():
    pr = [(r.get("n", ""), r.get("t", ""), r.get("d", "")) for r in LIVE["principles"]]
    facts = [("Founded", "2026"), ("Entity", "LOVELEEDAY Studios LLC, Delaware"),
             ("Software we own and run", "5")]
    rows = "".join(f'<div class=row style="grid-template-columns:1fr auto">'
                   f'<b style="font-size:14px;font-weight:400;color:var(--on-deep-mu)">{k}</b>'
                   f'<span class=n style="color:var(--on-deep)">{v}</span></div>'
                   for k, v in facts)
    body = hero("bench", 'Business judgment. <span class=ser>Built as software.</span>',
                ["LOVELEEDAY Studios is a software development company. Our perspective "
                 "comes from pricing, operations and running businesses, not only from "
                 "writing code.",
                 "Arthur is the software foundation. LOVELEEDAY Studios is the team "
                 "responsible for defining the problem, developing the solution, and "
                 "reviewing the result with you."])
    body += f"""
<section class="sec dark"><div class=w>
  <div style="display:grid;gap:clamp(30px,5vw,64px)">
    <div style="max-width:52ch">
      <span class=lab>The company</span>
      <p style="margin-top:20px;font-size:clamp(1.3rem,2.4vw,1.85rem);line-height:1.35;
        font-weight:400;letter-spacing:-.024em;color:var(--on-deep)">&ldquo;A website
        request can reveal a customer acquisition problem. A data question can reveal an
        entirely new way to work.&rdquo;</p>
      <p class=lede>We look beyond the requested deliverable. What is slowing the business
      down? What information is disconnected? Which decision needs better evidence?</p>
    </div>
    <div class=rows style="border-top-color:var(--deep-line);margin-top:0">{rows}</div>
  </div>
</div></section>

<section class=sec><div class=w>
  <span class=lab>Why this exists</span>
  <h2>People love what <span class=ser>they understand.</span></h2>
  <p class=lede>Most of what someone runs is partly hidden from them. The books, the pipeline,
  the catalogue, the month that went wrong for a reason nobody can name. The hidden part is
  where the dread lives, and it is why running a business so often feels like bracing for it
  rather than building it.</p>
  <p class=lede>LOVELEEDAY exists to close that distance. Intelligence that knows what you
  need is not a convenience: it is the difference between operating a company and flinching
  at one. When the thing in front of you stops hiding things from you, it becomes possible to
  like it again &mdash; the work, the numbers, the day.</p>
  <p class=note>That is the ambition, and everything else on this site is the evidence that we
  build it rather than say it. A figure here names the system it came from or it does not get
  printed.</p>
</div></section>

<section class=sec id=method><div class=w>
  <span class=lab>How we work</span>
  <h2>Five rules <span class=ser>we do not bend.</span></h2>
  <p class=lede>We do not do retainers and we do not do vague discovery phases. You
  describe what you need, we quote it flat, and most engagements close in weeks rather
  than quarters.</p>
  {spec(pr)}
  <p class=note>Every engagement also ships through a private, token-gated review page
  &mdash; you watch the build, not just the invoice. No login and no index: the
  unguessable URL is the credential, which is why it is named here and never linked.</p>
</div></section>

<section class="sec wash" id=measure><div class=w>
  <span class=lab>How we measure</span>
  <h2>The numbers, <span class=ser>and where they come from.</span></h2>
  <p class=lede>Page weight, Lighthouse on mobile, live organic search position and
  accessibility, measured per site on a stated date rather than asserted in a deck.
  Where a figure has not been measured, the page says so instead of rounding a guess
  into a claim &mdash; and that rule applies to our own site first.</p>
  <p style="margin-top:26px"><a class="btn line" href="home.html">See the current
  figures &rarr;</a></p>
</div></section>
""" + close('Tell us what is <span class=ser>slowing you down.</span>',
            "We reply the same week.") + footer()
    return shell("Company &mdash; LOVELEEDAY Studios", body,
                 "A software development company whose perspective comes from running businesses.")


def contact():
    def fld(label, opts=None, area=False):
        if opts:
            ctl = '<select disabled>' + "".join(f'<option>{o}</option>' for o in opts) + '</select>'
        elif area:
            ctl = '<textarea rows=5 readonly></textarea>'
        else:
            ctl = '<input readonly>'
        return f'<label class=fld><span class=lab>{label}</span>{ctl}</label>'
    steps = [("A reply, from a person",
              "Usually the same day, with the questions we need answered to quote it."),
             ("A fixed quote with a scope",
              "One number and a written scope. No retainer, no discovery phase you pay for."),
             ("A build you can watch",
              "You see it deployed as it is built, not at the end.")]
    nxt = "".join(f'<div class=row><span class=c>0{i+1}</span><b>{t}</b><p>{d}</p>'
                  f'<span class=n></span></div>' for i, (t, d) in enumerate(steps))
    body = hero("lab", 'Bring us <span class=ser>the question.</span>',
                ["Describe the problem in your own words. You will get a reply from a "
                 "person, not a sequence, and a fixed quote with a scope attached rather "
                 "than a discovery call."])
    body += f"""
<section class=sec><div class=w>
  <form class=form>
    <div class=pair>{fld("Your name")}{fld("Email")}</div>
    <div class=pair>{fld("Kind of work", opts=LIVE["project_types"])}
      {fld("Budget range", opts=LIVE["budgets"])}</div>
    {fld("What is the problem?", area=True)}
    <div class=send><span class="btn ink">Send the brief</span>
      <span class=hint>Usually answered the same day.</span></div>
  </form>
  <p class=note>Prefer email? hello@loveleedaystudios.com &middot; Already have a portal
  link from us? Open it directly &mdash; it does not need an account.</p>
</div></section>

<section class="sec wash"><div class=w>
  <span class=lab>After you send it</span>
  <h2>What happens <span class=ser>next.</span></h2>
  <div class=rows>{nxt}</div>
  <p style="margin-top:30px"><a class="btn line" href="work.html">See what we&rsquo;ve
  shipped &rarr;</a></p>
</div></section>
""" + footer()
    return shell("Contact &mdash; LOVELEEDAY Studios", body,
                 "Describe the problem. A reply from a person and a fixed quote with a scope.")


PAGES = {"home.html": home, "arthur.html": arthur, "work.html": work,
         "about.html": about, "contact.html": contact}


def check_tokens():
    root = CSS[CSS.index(":root{"):]
    root = root[:root.index("}")]
    missing = set(re.findall(r"var\((--[\w-]+)", CSS)) - set(re.findall(r"(--[\w-]+)\s*:", root))
    if missing:
        raise SystemExit("undefined CSS tokens: " + ", ".join(sorted(missing)))


if __name__ == "__main__":
    check_tokens()
    for name, fn in PAGES.items():
        (OUT / name).write_text(fn())
        print("wrote final/" + name)
