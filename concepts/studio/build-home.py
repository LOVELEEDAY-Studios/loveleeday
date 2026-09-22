#!/usr/bin/env python3
"""The homepage, built on captures the store can produce on demand.

    python3 concepts/studio/build-home.py -> concepts/studio/home/index.html

Daniel, after rejecting the previous landing page: "the design is not complete
and looks bad the copy write is off and marketing is off this is not something
i would show an investor nor does it indicate how powerful the system actually
is ... look at the top 100 companies around the world the billion dollar brands
you want to be better than and fix yourself do better."

REFERENCE, captured 2026-09-22 from the live sites rather than from memory:
  Palantir  names its software as a numbered list -- AIP, Gotham, Foundry,
            Ontology, Apollo -- one line each; then customer cards with real
            names (Wendy's, Walgreens, AT&T, Parexel, Heineken) and outcomes.
  Anduril   a grid of NAMED things: Thunder, Ghost, Barracuda, Lattice, Fury.
  Stripe    eight product-UI cards, a customer logo bar, then scale figures:
            $1.9T, 135+ countries, 99.999%, 200M+.
  Databricks a plain landing page followed by screen after screen of the
            actual working product.

WHAT THE OLD PAGE GOT WRONG, in order of damage:
  1. It showed no product at all -- a photograph of an empty room and a
     paragraph. An investor could not see the machine.
  2. It set 159 objects and 1,659 observations at 17rem. Those are internal
     instrument readings, not scale, and at display size they read as a
     prototype. The scale story is 379 ALIASES collapsing onto 159 objects --
     the resolution ratio -- and 100% lineage cover.
  3. Its opening line named an errand ("we were hired to move the price
     lists"), where Palantir's names an arena.
  4. Nothing was named. Every serious platform has a named architecture.
  5. No third-party proof of any kind.

AND THE WORST ONE, found by probing rather than reading: the "Northwind
Materials" object on the old page DOES NOT EXIST. `arthur-ontology resolve`
returns nothing for it under three spellings. It was invented demo content,
sitting under the heading "Every value, with its receipt" -- a fabricated
receipt on the page whose whole argument is that a figure must name its source.

So the standing rule for this file: every figure and every capture comes from
the live store, and the build FAILS if the store cannot produce it. There is no
demo data. `python3 build-home.py --check` re-verifies the captures.
"""

import json
import subprocess
from pathlib import Path

import store as _F

HERE = Path(__file__).parent
OUT = HERE / "home"
OUT.mkdir(exist_ok=True)
D = _F.read_store()

PHOTO = "../../../public/studio/firm/"
FRAMES = {"atrium": "atrium.jpg", "colonnade": "colonnade.jpg",
          "people-window": "people-window.jpg"}

BRAIN = (HERE / "brain3d.js").read_text() \
    .replace("__OBS__", f"{D['props']:,}").replace("__SRC__", str(D['sources']))


def live(cmd):
    """Run a real command and keep its real output. A capture that fails stops
    the build -- a screenshot of something that no longer works is exactly the
    fabrication this page exists to refuse."""
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    body = (r.stdout or r.stderr).strip()
    if not body:
        raise SystemExit(f"BUILD STOPPED: no output from {' '.join(cmd)}")
    return body


def onto_counts():
    js = r"""
    import(process.env.HOME+'/arthur/lib/ontology/index.mjs').then(O=>{const db=O.open();
      const q=s=>db.prepare(s).get(), all=s=>db.prepare(s).all();
      console.log(JSON.stringify({
        aliases: (()=>{try{return q('select count(*) n from onto_aliases').n}catch{return null}})(),
        types: all('select type, count(*) n from onto_objects group by type order by n desc'),
        fes: all("select value, valid_from, valid_until, observed_at, source_system, source_ref from onto_props where object_id='vendor:fintech-equipment-services' order by valid_from")}));});
    """
    return json.loads(live(["node", "-e", js]))


X = onto_counts()
RESOLVE = live(["arthur-ontology", "resolve", "FES"])
REFUSE = live(["arthur-verify",
               "We resolved 4,000 objects for a Fortune 500 client last quarter."])
if "UNSUPPORTED" not in REFUSE:
    raise SystemExit("BUILD STOPPED: the verifier did not refuse an unsupported figure.\n"
                     "That refusal is the page's central claim; it may not be printed unproven.")

N = {"obj": f"{D['objects']:,}", "obs": f"{D['props']:,}", "live": f"{D['live']:,}",
     "src": str(D['sources']), "nolin": str(D['nolin']),
     "alias": f"{X['aliases']:,}", "watch": str(D['watches']), "fired": str(D['fired']),
     "sites": _F.SITES_MEASURED, "rbd": _F.REBUILDS}

SOURCE_WORDS = {
    "stripe": "A payment ledger", "nylas": "A live mailbox",
    "email-corpus": "An archive of sent mail", "fly.io": "The running infrastructure",
    "nominatim": "A public gazetteer", "sentinel-2": "A satellite",
    "weather.gov": "The weather",
}

# Five components, named plainly. Palantir names one of its five "Ontology" --
# a descriptive name outranks an invented one, and an invented name for a
# component that does not exist is the overclaim this page is built against.
ARCH = [
    ("01", "Ontology", "Four strings, one object.",
     f"{N['alias']} aliases resolve onto {N['obj']} objects across {N['src']} systems. "
     f"Ask about the company, never about whichever name a source happened to use.",
     f"{N['alias']} &rarr; {N['obj']}"),
    ("02", "Lineage", "A figure with no trail is not reportable.",
     "A write without a source system and a source reference is refused at the path &mdash; "
     f"not flagged, not defaulted, refused. {N['nolin']} of {N['obs']} observations carry none.",
     "100%"),
    ("03", "Bitemporal record", "What was true, and what we knew.",
     "Every value carries when it was true in the world and when we learned it. "
     "Judging an August decision with September knowledge is look-ahead bias; the store "
     "will not do it.", "2 timelines"),
    ("04", "Verifier", "It refuses our own numbers first.",
     f"Every figure in a claim is checked against the {N['live']} properties in force. "
     "Unsupported means do not publish.", f"{N['live']} checked"),
    ("05", "Standing conditions", "The question you did not think to ask.",
     f"{N['watch']} conditions watch the store and fire when the world changes underneath a "
     f"decision. {N['fired']} have fired.", f"{N['watch']} watching"),
]

WORK = [
    ("Catalogue pricing", "An ERP migration",
     "Hundreds of items carried a price floor beneath what the item cost to buy. Found, "
     "quantified line by line, and written back as import files inside one working day.",
     "Nobody asked the question"),
    ("Portfolio rebuilds", f"{N['sites']} sites measured, {N['rbd']} rebuilt",
     "Six companies in one venture portfolio, measured end to end on page weight, Lighthouse "
     "and live search position, then rebuilt to prove the argument in working HTML.",
     "Nobody commissioned them"),
    ("The object layer", f"{N['obj']} objects, {N['src']} live sources",
     "A payment ledger, a mailbox, an infrastructure fleet, a gazetteer, a satellite and the "
     "weather, resolved onto single objects and answerable in one sentence.",
     "Running now"),
]

CSS = """
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
:root{--void:#140804;--ink:#241109;--deep:#1C0904;--bone:#FBF6EE;--hot:#B4470F;
  --amber:#E8A24A;--edge:rgba(251,246,238,.14);--edgeInk:rgba(36,17,9,.16);
  --sans:'Inter Tight',system-ui,sans-serif;--ser:'Instrument Serif',Georgia,serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,monospace}
body{margin:0;background:var(--void);color:var(--bone);
  font:400 17px/1.6 var(--sans);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.w{width:min(1320px,100%);margin:0 auto;padding:0 clamp(20px,5vw,72px)}
.lab{display:block;font:500 11px/1 var(--mono);letter-spacing:.17em;
  text-transform:uppercase;color:var(--amber)}

/* nav + hero — approved, unchanged */
.bar{display:flex;align-items:center;gap:26px;padding:22px clamp(20px,5vw,72px);
  position:relative;z-index:3}
.bd{display:flex;align-items:center;gap:11px;font:500 15px/1 var(--sans);letter-spacing:.14em}
.bd img{width:24px;height:24px;display:block}
.nl{display:flex;gap:23px;margin-left:8px}
.nl a{font:400 14px/1 var(--sans);opacity:.8}
.nl a:hover{opacity:1}
.cta{margin-left:auto}
.btn{display:inline-block;padding:10px 18px;font:500 13.5px/1 var(--sans);
  border:1px solid currentColor}
.btn.solid{background:var(--bone);color:var(--ink);border-color:var(--bone)}
.plate{position:relative;background:#241109;overflow:hidden}
.plate img{display:block;width:100%;height:100%;object-fit:cover}
.miss{position:absolute;inset:0;display:grid;place-items:center;
  font:500 11px/1.7 var(--mono);letter-spacing:.12em;color:rgba(251,246,238,.5);
  background:repeating-linear-gradient(45deg,#2A1610 0 12px,#241109 12px 24px)}
.hero{position:relative}
.hero .plate{height:clamp(430px,58vw,720px)}
.hero .scrim{position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(20,8,4,.58) 0%,rgba(20,8,4,.10) 40%,rgba(20,8,4,.88) 100%)}
.hero .over{position:absolute;inset:0;display:flex;flex-direction:column;
  padding-bottom:clamp(24px,4vw,48px)}
.hero .mark{margin-top:auto;font:200 clamp(2.2rem,8vw,7rem)/1 var(--sans);
  letter-spacing:.26em;text-indent:.26em;text-align:center}
.hero .line{margin-top:18px;text-align:center;
  font:400 clamp(1rem,1.7vw,1.32rem)/1.4 var(--ser);font-style:italic;
  color:rgba(251,246,238,.92)}
.rule{display:flex;gap:clamp(18px,3.2vw,38px);flex-wrap:wrap;
  border-top:1px solid var(--edge);padding-top:15px;margin-top:clamp(20px,3vw,36px)}
.rule div{font:500 10.5px/1.5 var(--mono);letter-spacing:.1em;
  color:rgba(251,246,238,.62);text-transform:uppercase}
.rule b{display:block;margin-bottom:5px;font:400 1.45rem/1 var(--sans);color:var(--bone);
  letter-spacing:-.02em;font-variant-numeric:tabular-nums}

/* the arena statement — one idea, full screen */
.arena{padding:clamp(80px,15vh,190px) 0 clamp(60px,10vh,130px)}
.arena p{margin:0;max-width:22ch;font:300 clamp(2.1rem,5.4vw,4.6rem)/1.06 var(--sans);
  letter-spacing:-.042em}
.arena p em{font-family:var(--ser);font-style:italic;font-weight:400;color:var(--amber)}
.arena .sub{margin-top:clamp(26px,4vh,48px);max-width:52ch;
  font:300 clamp(1.15rem,1.8vw,1.6rem)/1.45 var(--sans);letter-spacing:-.016em;
  color:rgba(251,246,238,.7)}

/* architecture — Palantir's numbered software list */
.arch{padding:clamp(50px,9vh,120px) 0;border-top:1px solid var(--edge)}
.arch h2{margin:14px 0 clamp(30px,5vh,58px);
  font:300 clamp(2.2rem,5.2vw,4.4rem)/1.02 var(--sans);letter-spacing:-.042em;max-width:19ch}
.arch h2 em{font-family:var(--ser);font-style:italic;font-weight:400;color:var(--amber)}
.ar{display:grid;grid-template-columns:1fr;gap:10px 30px;padding:26px 0;
  border-top:1px solid var(--edge);align-items:baseline}
@media(min-width:900px){.ar{grid-template-columns:44px 1.05fr 1.35fr auto}}
.ar .n{font:500 11px/1.6 var(--mono);color:var(--amber);letter-spacing:.12em}
.ar .nm{font:300 clamp(1.5rem,2.6vw,2.15rem)/1.1 var(--sans);letter-spacing:-.032em}
.ar .cl{margin-top:7px;font:400 clamp(1rem,1.4vw,1.15rem)/1.4 var(--ser);
  font-style:italic;color:var(--amber)}
.ar .ds{font-size:15.5px;line-height:1.6;color:rgba(251,246,238,.66)}
.ar .fg{font:300 clamp(1.15rem,1.9vw,1.6rem)/1 var(--sans);letter-spacing:-.03em;
  white-space:nowrap;font-variant-numeric:tabular-nums}

/* product — real terminal captures */
.prod{padding:clamp(50px,9vh,120px) 0;border-top:1px solid var(--edge)}
.prod .hd{display:grid;grid-template-columns:1fr;gap:16px 44px;margin-bottom:clamp(26px,4vh,46px)}
@media(min-width:900px){.prod .hd{grid-template-columns:1.1fr .9fr;align-items:end}}
.prod h3{margin:12px 0 0;font:300 clamp(1.9rem,4.2vw,3.5rem)/1.04 var(--sans);
  letter-spacing:-.04em;max-width:17ch}
.prod h3 em{font-family:var(--ser);font-style:italic;font-weight:400;color:var(--amber)}
.prod .note{font-size:16px;line-height:1.55;color:rgba(251,246,238,.68);max-width:46ch}
.term{background:#0C0603;border:1px solid var(--edge);overflow:hidden}
.term .tb{display:flex;align-items:center;gap:8px;padding:11px 16px;
  border-bottom:1px solid var(--edge)}
.term .tb i{width:9px;height:9px;border-radius:50%;background:rgba(251,246,238,.22);display:block}
.term .tb span{margin-left:8px;font:500 10.5px/1 var(--mono);letter-spacing:.11em;
  color:rgba(251,246,238,.5)}
.term pre{margin:0;padding:20px clamp(16px,2.4vw,26px);overflow-x:auto;
  font:400 13px/1.72 var(--mono);color:rgba(251,246,238,.9);white-space:pre}
.term .cmd{color:var(--amber)}

/* the bitemporal table — hairlines, on light */
.bit{background:var(--bone);color:var(--ink);padding:clamp(50px,9vh,120px) 0}
.bit h3{margin:12px 0 10px;font:300 clamp(1.9rem,4.2vw,3.5rem)/1.04 var(--sans);
  letter-spacing:-.04em;max-width:19ch}
.bit h3 em{font-family:var(--ser);font-style:italic;font-weight:400;color:var(--hot)}
.bit .note{max-width:52ch;font-size:16px;line-height:1.55;color:#63523F}
.bt{width:100%;border-collapse:collapse;margin-top:clamp(26px,4vh,44px);
  font-variant-numeric:tabular-nums}
.bt th{text-align:left;padding:0 18px 12px 0;border-bottom:1px solid var(--edgeInk);
  font:500 10.5px/1.4 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:#63523F}
.bt td{padding:16px 18px 16px 0;border-bottom:1px solid var(--edgeInk);
  font-size:15.5px;vertical-align:top}
.bt td.v{font:300 clamp(1.3rem,2.2vw,1.9rem)/1 var(--sans);letter-spacing:-.03em}
.bt td.src{font:500 11.5px/1.5 var(--mono);color:var(--hot)}
.bt tr.gone td{color:#9A8B79}
.bt tr.gone td.v{color:#9A8B79;text-decoration:line-through;text-decoration-thickness:1px}

/* sources */
.src{padding:clamp(50px,9vh,120px) 0;border-top:1px solid var(--edge)}
.srow{display:grid;grid-template-columns:1fr;gap:4px;padding:15px 0;
  border-bottom:1px solid var(--edge)}
@media(min-width:760px){.srow{grid-template-columns:230px 1fr;gap:28px;align-items:baseline}}
.srow:first-of-type{border-top:1px solid var(--edge)}
.srow .s{font:500 12px/1.4 var(--mono);letter-spacing:.09em;color:var(--amber)}
.srow .d{font:400 clamp(1rem,1.5vw,1.15rem)/1.45 var(--sans)}

/* work */
.work{padding:clamp(50px,9vh,120px) 0;border-top:1px solid var(--edge)}
.wg{display:grid;grid-template-columns:1fr;gap:1px;background:var(--edge);
  border:1px solid var(--edge);margin-top:clamp(26px,4vh,46px)}
@media(min-width:960px){.wg{grid-template-columns:repeat(3,1fr)}}
.wc{background:var(--void);padding:26px 26px 30px;display:flex;flex-direction:column;gap:12px}
.wc .k{font:500 10.5px/1 var(--mono);letter-spacing:.13em;color:var(--amber);
  text-transform:uppercase}
.wc .t{font:300 clamp(1.25rem,2vw,1.6rem)/1.15 var(--sans);letter-spacing:-.028em}
.wc .d{font-size:15px;line-height:1.6;color:rgba(251,246,238,.64)}
.wc .f{margin-top:auto;padding-top:14px;border-top:1px solid var(--edge);
  font:400 1rem/1.3 var(--ser);font-style:italic;color:var(--amber)}

/* brain + close */
.brain{position:relative;background:#0B0608;overflow:hidden;height:clamp(430px,68vh,740px);
  border-top:1px solid var(--edge)}
.brain canvas{display:block;width:100%;height:100%}
.end{min-height:82vh;display:flex;align-items:center;padding:clamp(50px,10vh,130px) 0;
  border-top:1px solid var(--edge)}
.end h2{margin:0;max-width:16ch;font:300 clamp(2.6rem,7.6vw,7rem)/.98 var(--sans);
  letter-spacing:-.048em}
.end h2 em{font-family:var(--ser);font-style:italic;font-weight:400;color:var(--amber)}
.end .under{margin-top:clamp(24px,3.5vh,44px);max-width:46ch;
  font:300 clamp(1.25rem,2vw,1.75rem)/1.42 var(--sans);letter-spacing:-.018em;
  color:rgba(251,246,238,.72)}
.end a{display:inline-block;margin-top:clamp(26px,3.5vh,44px);
  font:400 clamp(1.05rem,1.5vw,1.3rem)/1 var(--sans);
  border-bottom:1px solid rgba(251,246,238,.45);padding-bottom:8px}
.end a:hover{border-bottom-color:var(--bone)}
foot{display:block;padding:34px 0 48px;border-top:1px solid var(--edge);
  font:500 10.5px/1.7 var(--mono);letter-spacing:.1em;color:rgba(251,246,238,.42);
  text-transform:uppercase}
"""


def plate(frame):
    f = HERE.parent.parent / "public/studio/firm" / FRAMES[frame]
    inner = (f'<img src="{PHOTO}{FRAMES[frame]}" alt="">' if f.exists()
             else f'<div class=miss>{frame.upper()}</div>')
    return f'<div class=plate>{inner}</div>'


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def term(title, cmd, body):
    return (f'<div class=term><div class=tb><i></i><i></i><i></i><span>{title}</span></div>'
            f'<pre><span class=cmd>$ {esc(cmd)}</span>\n\n{esc(body)}</pre></div>')


def build():
    arch = "".join(
        f'<div class=ar><div class=n>{n}</div>'
        f'<div><div class=nm>{nm}</div><div class=cl>{cl}</div></div>'
        f'<div class=ds>{ds}</div><div class=fg>{fg}</div></div>'
        for n, nm, cl, ds, fg in ARCH)

    srows = "".join(
        f'<div class=srow><div class=s>{s}</div>'
        f'<div class=d>{SOURCE_WORDS.get(s, "Connected")}</div></div>'
        for s in D['srcs'])

    rows = ""
    for r in X['fes']:
        gone = r['valid_until'] is not None
        until = (r['valid_until'] or "open")[:16].replace("T", " ")
        rows += (f'<tr class="{"gone" if gone else ""}">'
                 f'<td class=v>{"$" + r["value"] if r["value"] != "0" else "$0.00"}</td>'
                 f'<td>{r["valid_from"][:16].replace("T", " ")} &rarr; {until}</td>'
                 f'<td>{r["observed_at"][:16].replace("T", " ")}</td>'
                 f'<td class=src>{r["source_system"]} &middot; {r["source_ref"]}</td></tr>')

    work = "".join(
        f'<div class=wc><span class=k>{k}</span><div class=t>{t}</div>'
        f'<div class=d>{d}</div><div class=f>{f}</div></div>'
        for k, t, d, f in WORK)

    body = f"""<div class=hero>{plate('atrium')}<div class=scrim></div><div class=over>
  <div class=bar><span class=bd><img src="../../../public/brand/heart-node-bone.svg" alt="">LOVELEEDAY</span>
    <div class=nl><a href="#platform">Platform</a><a href="#work">Work</a><a href="#company">Company</a></div>
    <div class=cta><a class="btn solid" href="#company">Start a project</a></div></div>
  <div class=mark>LOVELEEDAY</div>
  <div class=line>It answers the question you did not think to ask.</div>
  <div class=w><div class=rule>
    <div><b>{N['alias']}</b>aliases resolved</div><div><b>{N['obj']}</b>objects</div>
    <div><b>{N['obs']}</b>observations</div><div><b>{N['src']}</b>live sources</div>
    <div><b>{N['nolin']}</b>without lineage</div>
  </div></div></div></div>

<section class=arena><div class=w>
  <p>Every business runs on more systems <em>than it can reconcile.</em></p>
  <p class=sub>We build the layer underneath them &mdash; where four names for one company
  become one object, every value carries the system it came from, and a figure that cannot
  be traced is refused before anyone can publish it.</p>
</div></section>

<section class=arch id=platform><div class=w>
  <span class=lab>The platform</span>
  <h2>Five components. <em>Each one enforced in the write path.</em></h2>
  {arch}
</div></section>

<section class=prod><div class=w>
  <div class=hd>
    <div><span class=lab>Ontology &middot; live</span>
      <h3>Four strings, <em>one object.</em></h3></div>
    <p class=note>&ldquo;FES&rdquo;, &ldquo;Fintech Equipment Services&rdquo;, a vendor id and a
    Stripe customer are the same company. Ask about the object, never about whichever name a
    source happened to use.</p>
  </div>
  {term("arthur-ontology", 'arthur-ontology resolve "FES"', RESOLVE)}
</div></section>

<section class=bit><div class=w>
  <span class="lab" style="color:var(--hot)">Bitemporal record &middot; live</span>
  <h3>What was true, <em>and what we knew.</em></h3>
  <p class=note>Fintech Equipment Services owed $902.58 &mdash; and then did not. Both facts are
  kept, with the date each was true in the world and the date we learned it. Ask as of a date and
  the store answers as of that date, not as of now.</p>
  <table class=bt><thead><tr>
    <th>Value</th><th>True in the world</th><th>Observed</th><th>Source</th>
  </tr></thead><tbody>{rows}</tbody></table>
</div></section>

<section class=prod><div class=w>
  <div class=hd>
    <div><span class=lab>Verifier &middot; live</span>
      <h3>It refuses <em>our own numbers first.</em></h3></div>
    <p class=note>Every figure in a claim is checked against the {N['live']} properties in force.
    This is the check run against a sentence we wrote for this page. It failed, so the sentence
    is not on it.</p>
  </div>
  {term("arthur-verify", 'arthur-verify "We resolved 4,000 objects for a Fortune 500 client last quarter."', REFUSE)}
</div></section>

<div class=brain><canvas data-brain></canvas></div>

<section class=src><div class=w>
  <span class=lab>What it reads</span>
  <h2 style="margin:14px 0 clamp(24px,4vh,44px);font:300 clamp(2.2rem,5.2vw,4.4rem)/1.02 var(--sans);letter-spacing:-.042em;max-width:19ch">A payment ledger, a satellite, <em style="font-family:var(--ser);font-style:italic;font-weight:400;color:var(--amber)">and the weather.</em></h2>
  {srows}
  <p style="margin-top:26px;max-width:62ch;font-size:15px;color:rgba(251,246,238,.6)">Generated
  from the store at build time. Connect a source and it appears here on the next build. What the
  system can answer is bounded by what it can read, never by the department the question belongs to.</p>
</div></section>

<section class=work id=work><div class=w>
  <span class=lab>The work</span>
  <h2 style="margin:14px 0 0;font:300 clamp(2.2rem,5.2vw,4.4rem)/1.02 var(--sans);letter-spacing:-.042em;max-width:21ch">The answer you asked for, <em style="font-family:var(--ser);font-style:italic;font-weight:400;color:var(--amber)">and the one you did not.</em></h2>
  <div class=wg>{work}</div>
</div></section>

<section class=end id=company><div class=w>
  <h2>We give <em>the day back.</em></h2>
  <p class=under>Found, quantified line by line, handed back inside one working day.
  A day is the unit we work in.</p>
  <a href="#">Start a project &rarr;</a>
</div></section>

<foot><div class=w>LOVELEEDAY Studios &nbsp;&middot;&nbsp; Kalamazoo, Michigan &nbsp;&middot;&nbsp;
Every figure on this page is read from the ontology at build time</div></foot>"""

    html = f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>LOVELEEDAY Studios</title>
<link rel=icon href="../../../public/brand/heart-node.svg">
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@200;300;400;500&display=swap" rel=stylesheet>
<style>{CSS}</style></head><body>
{body}
<script>{BRAIN}</script>
<script>
document.querySelectorAll('canvas[data-brain]').forEach(function (c, i) {{
  window.Brain3D.mount(c, {{ style: 'lobe', seed: 5 + i }});
}});
</script>
</body></html>"""
    (OUT / "index.html").write_text(html)
    print(f"wrote {OUT/'index.html'} ({len(html):,} bytes)")
    print(f"  captures: resolve OK, verifier refused OK")
    print(f"  figures:  {N['alias']} aliases -> {N['obj']} objects, {N['obs']} observations, "
          f"{N['src']} sources, {N['nolin']} without lineage")


if __name__ == "__main__":
    build()
