#!/usr/bin/env python3
"""The launch page, in the register Daniel asked for: Palantir and Apple.

    python3 concepts/studio/build-launch.py  ->  solstice-full/launch.html

WHY THIS IS A SEPARATE FILE rather than an edit to build-solstice-full.py.
Solstice is approved and Daniel has been burned once already by a homepage
that changed under him. This builds alongside it; home.html is untouched.

WHAT WAS MEASURED, not remembered. palantir.com rendered on 2026-09-21:
  h1            80px, weight 400, custom sans, #EFEFEF on near-black
  section label 10px, weight 400, uppercase, #B9B9B9
  card h3       34px, weight 400
  ratio         8:1 between the largest and smallest type on the page
  colour        none. black, greys, white. 31 images, 6 videos.
  hero          one sentence, centred in a black void. No photo, no subhead,
                no button -- just a scroll arrow.
  cards         tiny label -> 34px headline with an arrow -> technical line
                art -> a metadata strip in 10px uppercase -> an ENORMOUS
                wordmark bleeding off both edges of the card.
apple.com the same day: one product per tile, six to fourteen words of copy,
  the product photograph IS the section, two CTAs ("Learn more" / "Buy").

So the rules for this page, each traceable to something above:
  1. One typeface. No italic serif. The old page used the same
     sans-then-italic-serif construction on 24 of 24 headlines.
  2. Weight 400 at every size. Scale carries the hierarchy, not weight.
  3. A 10.5px uppercase label against a ~100px headline -- keep the ratio.
  4. Near-monochrome. One accent, and it appears on almost nothing.
  5. Copy is cut to Apple length. A section gets a line, not a paragraph.
  6. Every section looks different from its neighbours. The complaint that
     started this was that the page read as interchangeable slides.
"""
import json
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / "solstice-full"
LIVE = json.loads((HERE / "live-content.json").read_text())
CH = LIVE["chrome"]
STUDIES = [dict(s, frame=f) for s, f in zip(LIVE["studies"], LIVE["study_frames"])]

FONTS = ("https://fonts.googleapis.com/css2?"
         "family=Inter+Tight:wght@300;400;500&display=swap")

CSS = """
*{box-sizing:border-box}
:root{
  --void:#070709; --ink:#0E0E11; --panel:#15151A; --edge:rgba(255,255,255,.13);
  --fg:#F4F4F2; --mu:#A9A9A6; --dim:#B9B9B9;
  --paper:#F4F4F2; --paper-ink:#0E0E11; --paper-mu:#55554F; --paper-edge:rgba(0,0,0,.14);
  --accent:#E56E3E;
  --sans:'Inter Tight',system-ui,-apple-system,sans-serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,monospace}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--void);color:var(--fg);
  font:400 17px/1.6 var(--sans);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
.w{max-width:1360px;margin:0 auto;padding:0 clamp(20px,3.4vw,48px)}

/* Every label on this page is 10.5px. Every headline is enormous. That gap is
   the single most copyable thing about the Palantir page. */
.lab{display:block;font:400 10.5px/1 var(--mono);letter-spacing:.17em;
  text-transform:uppercase;color:var(--dim)}
h1,h2,h3{margin:0;font-weight:400;letter-spacing:-.035em;line-height:1.02}
h1{font-size:clamp(2.7rem,7.6vw,6.4rem)}
h2{font-size:clamp(2rem,4.6vw,3.9rem);line-height:1.04}
h3{font-size:clamp(1.35rem,2.4vw,2.1rem);line-height:1.1}
p{margin:0}

/* ---- chrome ---- */
.bar{position:sticky;top:0;z-index:60;background:rgba(7,7,9,.82);
  backdrop-filter:saturate(160%) blur(14px);border-bottom:1px solid var(--edge)}
.bar .w{display:flex;align-items:center;gap:clamp(16px,3vw,40px);height:62px}
.bd{font:500 15px/1 var(--sans);letter-spacing:.01em;white-space:nowrap}
.nl{display:none;gap:clamp(14px,2.2vw,30px);margin-left:14px}
@media(min-width:900px){.nl{display:flex}}
.nl a{font-size:14px;color:var(--mu)}
.nl a:hover{color:var(--fg)}
.rt{margin-left:auto;display:flex;align-items:center;gap:10px}
.btn{display:inline-block;font:400 13.5px/1 var(--sans);padding:11px 17px;
  border:1px solid var(--edge);border-radius:2px;white-space:nowrap}
.btn.solid{background:var(--fg);color:var(--ink);border-color:var(--fg)}
.btn.lite{border-color:var(--paper-edge);color:var(--paper-ink)}

/* mobile nav */
.burger{display:none;margin-left:auto;width:40px;height:40px;padding:0;cursor:pointer;
  background:none;color:var(--fg);border:1px solid var(--edge);border-radius:2px;
  flex-direction:column;align-items:center;justify-content:center;gap:5px}
.burger span{display:block;width:16px;height:1.5px;background:currentColor;transition:.18s}
nav.bar[data-sheet="1"] .burger span:first-child{transform:translateY(3.25px) rotate(45deg)}
nav.bar[data-sheet="1"] .burger span:last-child{transform:translateY(-3.25px) rotate(-45deg)}
.sheet{display:none;border-top:1px solid var(--edge);background:var(--ink)}
nav.bar[data-sheet="1"] .sheet{display:block}
.sheetin{padding:10px clamp(20px,3.4vw,48px) 24px}
.sheetin > a{display:block;padding:14px 0;border-bottom:1px solid var(--edge)}
.sheetin > a b{display:block;font:400 18px/1.3 var(--sans);letter-spacing:-.02em}
.sheetin > a span{display:block;margin-top:3px;font-size:13.5px;color:var(--mu)}
.sacts{display:flex;gap:10px;flex-wrap:wrap;padding-top:18px}
@media(max-width:899px){.bar .rt{display:none}.burger{display:flex}}

/* ---- hero: one sentence in a void ---- */
.hero{min-height:clamp(560px,86vh,860px);display:flex;flex-direction:column;
  align-items:center;justify-content:center;text-align:center;
  padding:clamp(70px,11vh,140px) 0 clamp(50px,7vh,90px);position:relative}
.hero h1{max-width:16ch}
.hero .sub{margin-top:26px;max-width:46ch;color:var(--mu);font-size:clamp(15px,1.5vw,18px)}
.arrow{position:absolute;bottom:26px;color:var(--dim);font-size:19px}

/* ---- the product tile, built on Palantir's Warp Speed card ---- */
.tile{background:var(--panel);border:1px solid var(--edge);border-radius:4px;
  overflow:hidden;margin-top:clamp(28px,4vw,56px)}
.tilehead{padding:clamp(24px,3vw,40px) clamp(24px,3vw,40px) 0}
.tilehead h3{margin-top:14px;max-width:24ch}
.tileshot{padding:clamp(20px,2.6vw,34px) clamp(24px,3vw,40px) 0}
.tileshot img{width:100%;border:1px solid var(--edge);border-radius:3px}
.meta{display:grid;gap:18px 30px;padding:clamp(22px,2.8vw,34px) clamp(24px,3vw,40px);
  border-top:1px solid var(--edge);margin-top:clamp(22px,2.8vw,34px)}
@media(min-width:760px){.meta{grid-template-columns:repeat(3,1fr)}}
.meta div p{margin-top:9px;font:400 12.5px/1.55 var(--mono);color:var(--mu)}
/* the giant wordmark that runs off both edges of the card */
.bleed{font:500 clamp(3.6rem,17.5vw,14rem)/.8 var(--sans);letter-spacing:-.055em;
  color:var(--fg);white-space:nowrap;padding:0 0 clamp(14px,2vw,26px);
  margin-left:clamp(-14px,-1.2vw,-8px);opacity:.96}
.bleed span{color:var(--dim)}

/* ---- data band ---- */
.band{border-top:1px solid var(--edge);display:grid;gap:0}
@media(min-width:720px){.band{grid-template-columns:repeat(4,1fr)}}
.band div{padding:clamp(26px,3vw,40px) clamp(18px,2vw,30px);
  border-bottom:1px solid var(--edge)}
@media(min-width:720px){.band div+div{border-left:1px solid var(--edge)}}
.band b{display:block;font:300 clamp(2.4rem,4.4vw,3.6rem)/1 var(--sans);
  letter-spacing:-.045em;font-variant-numeric:tabular-nums}
.band .lab{margin-top:12px}
.band p{margin-top:10px;font-size:13.5px;line-height:1.55;color:var(--mu);max-width:26ch}

/* ---- the evidence panel, sitting under the claim it evidences ---- */
.proof{margin-top:clamp(26px,3vw,40px);border:1px solid var(--edge);border-radius:3px;
  background:var(--ink);overflow:hidden}
.phead{padding:13px 18px;border-bottom:1px solid var(--edge);background:#0A0A0C}
.pbody{padding:16px 18px;font:400 12.5px/1.75 var(--mono);color:var(--fg)}
.pr{display:grid;gap:1px 14px;padding:7px 0;border-top:1px solid rgba(255,255,255,.055)}
.pr:first-child{border-top:0}
@media(min-width:780px){.pr{grid-template-columns:62px 230px 180px minmax(0,1fr);
  align-items:baseline;gap:0 16px}}
.pv{color:#5FD3C4;font-variant-numeric:tabular-nums}
.po{color:var(--dim)}
.ps{color:var(--dim);word-break:break-all}
.ps i{color:var(--accent);font-style:normal}
.pn{margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,.09);
  color:var(--mu);font-size:11.5px;line-height:1.65}
.pn span{color:var(--accent)}

/* ---- light relief section (Apple's alternation) ---- */
.light{background:var(--paper);color:var(--paper-ink)}
.light .lab{color:#6A6A66}
.light .lede{color:var(--paper-mu)}
.sec{padding:clamp(64px,9vw,132px) 0}
.lede{margin-top:20px;max-width:56ch;color:var(--mu);font-size:clamp(15.5px,1.5vw,18px)}

/* ---- work grid ---- */
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:30px}
.chip{font:400 12px/1 var(--mono);letter-spacing:.09em;text-transform:uppercase;
  padding:9px 13px;border:1px solid var(--paper-edge);border-radius:2px;color:#4A4A48}
.chip.on{background:var(--paper-ink);color:var(--paper);border-color:var(--paper-ink)}
.grid{display:grid;gap:14px;margin-top:26px}
@media(min-width:680px){.grid{grid-template-columns:1fr 1fr}}
@media(min-width:1100px){.grid{grid-template-columns:repeat(3,1fr)}}
.card{border:1px solid var(--paper-edge);border-radius:3px;overflow:hidden;
  background:#fff;display:flex;flex-direction:column}
.card .shot{aspect-ratio:16/10;overflow:hidden;background:#E8E8E6}
.card .shot img{width:100%;height:100%;object-fit:cover;object-position:top center}
.card .cb{padding:18px 18px 22px;display:flex;flex-direction:column;gap:9px;flex:1}
.card .lab{color:#6A6A66}
.card p{font-size:14px;line-height:1.55;color:var(--paper-mu)}

/* ---- operated ---- */
.ops{border-top:1px solid var(--edge);margin-top:34px}
.op{display:grid;gap:8px 30px;padding:26px 0;border-bottom:1px solid var(--edge);
  align-items:baseline}
@media(min-width:860px){.op{grid-template-columns:44px 210px minmax(0,1fr) 150px}}
.op .n{font:400 12px/1.6 var(--mono);color:var(--dim)}
.op b{font:400 20px/1.25 var(--sans);letter-spacing:-.025em}
.op p{font-size:14.5px;line-height:1.6;color:var(--mu)}
.op .when{font:400 12px/1.6 var(--mono);color:var(--dim)}

/* ---- close ---- */
.close{text-align:center;padding:clamp(66px,8vw,116px) 0;border-top:1px solid var(--edge)}
.close .acts{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:34px}
footer{border-top:1px solid var(--edge);padding:56px 0 46px;color:var(--mu);font-size:13.5px}
.fg{display:grid;gap:30px}
@media(min-width:760px){.fg{grid-template-columns:1.4fr 1fr 1fr 1fr}}
.fg h4{margin:0 0 14px;font:400 10.5px/1 var(--mono);letter-spacing:.17em;
  text-transform:uppercase;color:var(--dim)}
.fg a{display:block;padding:5px 0;color:var(--mu)}
.fg a:hover{color:var(--fg)}
.fbase{margin-top:44px;padding-top:22px;border-top:1px solid var(--edge);
  display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
  font:400 12px/1.6 var(--mono);color:var(--dim)}
"""


NAV_LINKS = [("Arthur", "The intelligence system", "arthur.html"),
             ("Work", "Rebuilds and operated companies", "work.html"),
             ("Company", "How we scope and measure", "about.html")]


NAV_JS = """<script>
(function(){
  var bar = document.querySelector('nav.bar');
  var b = bar && bar.querySelector('.burger');
  if (!b) return;
  b.addEventListener('click', function(){
    var on = bar.dataset.sheet === '1';
    bar.dataset.sheet = on ? '' : '1';
    b.setAttribute('aria-expanded', on ? 'false' : 'true');
  });
})();
</script>"""


def nav():
    links = "".join(f'<a href="{h}">{t}</a>' for t, _, h in NAV_LINKS)
    sheet = "".join(f'<a href="{h}"><b>{t}</b><span>{d}</span></a>'
                    for t, d, h in NAV_LINKS)
    return (f'<nav class=bar><div class=w><a class=bd href="launch.html">LOVELEEDAY</a>'
            f'<div class=nl>{links}</div>'
            f'<div class=rt><a class=btn href="contact.html">Contact</a>'
            f'<a class="btn solid" href="contact.html">Start a project</a></div>'
            f'<button class=burger aria-label=Menu aria-expanded=false>'
            f'<span></span><span></span></button>'
            f'</div><div class=sheet><div class=sheetin>{sheet}'
            f'<div class=sacts><a class="btn solid" href="contact.html">Start a project</a>'
            f'<a class=btn href="contact.html">Contact</a></div></div></div></nav>')


def footer():
    cols = "".join(
        f'<div><h4>{c["title"]}</h4>' +
        "".join(f'<a href="{h}">{t}</a>' for t, h in c["links"]) + '</div>'
        for c in CH["footer"])
    return (f'<footer><div class=w><div class=fg>'
            f'<div><div class=bd>LOVELEEDAY</div>'
            f'<p style="margin-top:12px;max-width:30ch">{CH["tagline"]}</p></div>'
            f'{cols}</div>'
            f'<div class=fbase><span>&copy; 2026 LOVELEEDAY Studios LLC</span>'
            f'<span>{CH["city"]}</span></div></div></footer>')


def page():
    studies = "".join(
        f'<a class=card href="work.html"><div class=shot>'
        f'<img src="../../../public{s["frame"]}" alt="" loading=lazy></div>'
        f'<div class=cb><span class=lab>{s["id"]} &middot; {s["sector"]}</span>'
        f'<p>{s["thesis"]}</p></div></a>' for s in STUDIES)
    chips = "".join(
        f'<span class="chip{" on" if i == 0 else ""}">{s["sector"]}</span>'
        for i, s in enumerate(STUDIES))
    ops = "".join(
        f'<div class=op><span class=n>{o["index"]}</span><b>{o["title"]}</b>'
        f'<p>{o["outcome"]}</p><span class=when>{o["shipped"]}</span></div>'
        for o in LIVE["operated"])

    body = f"""
{nav()}

<header class=hero><div class=w>
  <h1>Intelligence<br>you can trace.</h1>
  <p class=sub>The object layer for the business you already run.</p>
</div><div class=arrow>&darr;</div></header>

<section class=sec style="padding-top:0"><div class=w>
  <div class=tile>
    <div class=tilehead>
      <span class=lab>The interface</span>
      <h3>Four companies, one screen, every action timestamped.</h3>
    </div>
    <div class=tileshot>
      <img src="../../../public/studio/console-demo.jpg" alt="The ARTHUR//OS console">
    </div>
    <div class=meta>
      <div><span class=lab>Built on</span>
        <p>&rarr; Ontology<br>&rarr; Bitemporal store<br>&rarr; Lineage enforcement</p></div>
      <div><span class=lab>Runs</span>
        <p>Cash, spend and alerts across four<br>operating entities, continuously.</p></div>
      <div><span class=lab>Shown</span>
        <p>The shipped interface. Figures and<br>names replaced with demo values.</p></div>
    </div>
    <div class=bleed>ARTHUR<span>//OS</span></div>
  </div>
</div></section>

<section class=sec style="padding-top:0"><div class=w>
  <span class=lab>Enforced, not promised</span>
  <h2>Four rules the<br>write path keeps.</h2>
  <div class=band>
    <div><b>1</b><span class=lab>Object</span>
      <p>Four records from four systems resolve to one company.</p></div>
    <div><b>2</b><span class=lab>Timelines</span>
      <p>When it was true, and separately when we learned it.</p></div>
    <div><b>3</b><span class=lab>Lineage</span>
      <p>A write without a source system and reference is refused.</p></div>
    <div><b>4</b><span class=lab>Proof</span>
      <p>Work closes on a value read back out of the system.</p></div>
  </div>
  <div class=proof>
    <div class=phead><span class=lab>arthur-ontology lineage "dabney" sat_cloud_pct</span></div>
    <div class=pbody>
      <div class=pr><span class=pv>94.64</span><span>true 2026-09-14 &rarr; 2026-09-15</span>
        <span class=po>observed 2026-09-14</span><span class=ps>&larr; sentinel-2:
        <i>S2B_16TFM_20260913_0_L2A</i></span></div>
      <div class=pr><span class=pv>94.64</span><span>true 2026-09-18 &rarr; 2026-09-19</span>
        <span class=po>observed 2026-09-18</span><span class=ps>&larr; sentinel-2:
        <i>S2B_16TFM_20260913_0_L2A</i></span></div>
      <div class=pr><span class=pv>43.3</span><span>true 2026-09-19 &rarr; 2026-09-20</span>
        <span class=po>observed 2026-09-19</span><span class=ps>&larr; sentinel-2:
        <i>S2C_16TFM_20260918_0_L2A</i></span></div>
      <div class=pr><span class=pv>43.3</span><span>true 2026-09-20 &rarr; open</span>
        <span class=po>observed 2026-09-20</span><span class=ps>&larr; sentinel-2:
        <i>S2C_16TFM_20260918_0_L2A</i></span></div>
      <div class=pn>arthur-ontology "dabney" --as-of 2026-09-01 --as-known-at 2026-09-01<br>
        <span>(no properties were true and known at that point)</span></div>
    </div>
  </div>
  <p class=lede>Run against the live store on 2026-09-21 &mdash; 41 objects, 538
  property observations, four source systems. The last command asks what was known
  on a date, and the store declines to answer with anything it had not yet seen.</p>
</div></section>

<section class="sec light"><div class=w>
  <span class=lab>Uncommissioned</span>
  <h2>Thirty-eight sites measured.<br>Six rebuilt.</h2>
  <p class=lede>Nobody asked. The argument was easier to make in working HTML
  than in a deck.</p>
  <div class=chips>{chips}</div>
  <div class=grid>{studies}</div>
  <p class=lede style="margin-top:28px">The companies are not named here. Each
  rebuild carries measured criticism of the site it replaces, and that belongs in
  a private review rather than on a marketing page.</p>
</div></section>

<section class=sec><div class=w>
  <span class=lab>Software we own and operate</span>
  <h2>Five companies.<br>We are our own customer.</h2>
  <div class=ops>{ops}</div>
</div></section>

<section class=close><div class=w>
  <span class=lab>Start</span>
  <h2 style="margin-top:18px">Bring us the question.</h2>
  <p class=lede style="margin:20px auto 0">Tell us what is slowing you down. We reply
  the same week, with a plan or with a reason it is not a fit.</p>
  <div class=acts>
    <a class="btn solid" href="contact.html">Start a project</a>
    <a class=btn href="arthur.html">Read the architecture</a>
  </div>
</div></section>

{footer()}
"""
    return f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>LOVELEEDAY Studios</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="{FONTS}" rel=stylesheet>
<style>{CSS}</style></head><body>{body}{NAV_JS}</body></html>"""


def check_tokens():
    import re
    root = CSS[CSS.index(":root{"):]
    root = root[:root.index("}")]
    missing = set(re.findall(r"var\((--[\w-]+)", CSS)) - set(re.findall(r"(--[\w-]+)\s*:", root))
    if missing:
        raise SystemExit("undefined CSS tokens: " + ", ".join(sorted(missing)))


if __name__ == "__main__":
    check_tokens()
    (OUT / "launch.html").write_text(page())
    print("wrote solstice-full/launch.html")
