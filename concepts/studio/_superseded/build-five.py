#!/usr/bin/env python3
"""Concepts 11-15. Five registers for a company that wants to read very large.

     python3 concepts/studio/build-five.py

   Daniel, 2026-09-21: "generate 5 more concepts that will feel like an
   unstoppable mega brand company with billions of development ... do not
   maintain the same colors or typefaces."

   So nothing here uses cream, navy, teal, copper, Manrope, Mulish or IBM Plex
   Mono. Each concept carries its own palette and its own two typefaces, and
   they are deliberately far apart from each other -- five different answers,
   not one answer in five colourways.

   WHERE THESE COME FROM. Dribbble was fetched and returned nothing usable: the
   search results are client-rendered, so a fetch gets an empty shell. Rather
   than describe shots I could not see, the references are fourteen live product
   sites pulled through Mobbin and read as images:

     Mistral AI   full-bleed saturated landscape, huge light-weight type on it,
                  logo wall on bone underneath          -> 12 SOLSTICE
     Modal        near-black, acid green, one rendered glowing object, and a
                  two-tone headline that colours the subject word  -> 11 VOLT
     Fey          near-black with a single product shot lit like a photograph
     Basedash     a live dashboard AS the background, text floating over it
     Weavy        silver ground, enormous thin grotesk, one acid CTA block,
                  a node canvas of media                -> 13 CHROME
     WRITER       black, a radiating halo behind a portrait, one giant stat
     Magnific     deep wine photographic hero, a vertical list of capabilities
                  with the active one in accent          -> 14 ATRIUM
     Clay         soft card, huge black type, playful rendered objects, and a
                  logo grid large enough to be the argument -> 15 CARGO
     GitBook      white, a saturated rendered object bleeding in from the edge
     Stripe       the gradient mesh, cut on a hard diagonal
     Hex, Notion, Midday, Monarch

   Awwwards' technology category confirms the same thing from the other side:
   its dominant tags are animation, scrolling, WebGL and microinteractions.
   Large now reads as MOVING and RENDERED, not as more columns.
"""
import json
from pathlib import Path

HERE = Path(__file__).parent
LIVE = json.loads((HERE / "live-content.json").read_text()) if (HERE / "live-content.json").exists() else {}
STUDIES = json.loads(Path("/private/tmp/claude-501/studies.json").read_text()) \
    if Path("/private/tmp/claude-501/studies.json").exists() else []

FONTS = ("https://fonts.googleapis.com/css2?"
         "family=Space+Grotesk:wght@400;500;600;700&"
         "family=JetBrains+Mono:wght@400;500&"
         "family=Instrument+Serif:ital@0;1&"
         "family=Inter+Tight:wght@300;400;500;600;700;800&"
         "family=Archivo:wght@100;200;300;400;500;600;700;800;900&"
         "family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&"
         "family=Figtree:wght@300;400;500;600;700;800&"
         "family=Bricolage+Grotesque:opsz,wght@12..96,400..800&display=swap")


def shell(n, name, looks, at, css, body, script=""):
    return f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>Concept {n} &mdash; {name}</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="{FONTS}" rel=stylesheet>
<style>
*,*::before,*::after{{box-sizing:border-box}}
html{{-webkit-text-size-adjust:100%}}
a{{color:inherit;text-decoration:none}}
img{{display:block;max-width:100%}}
.ribbon{{position:sticky;top:0;z-index:99;background:#101012;color:#E9E9EC;
  font:500 11px/1 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.14em;
  text-transform:uppercase;padding:9px 18px}}
{css}
</style></head><body>
<div class=ribbon>Concept {n} of 15 &mdash; &ldquo;{name}&rdquo; &middot; {at} &middot; ref: {looks}</div>
{body}
{script}</body></html>"""


LOGOS = ["olldae", "KRONOS", "Duezy", "Dabney &amp; Co.", "Ops Layer", "Arthur"]
SECTORS = [s["sector"] for s in STUDIES] or ["RNA therapeutics", "Utility-scale solar",
                                             "AI service desk", "Advanced materials",
                                             "Retirement income", "Lending software"]


# ===========================================================================
# 11 — VOLT.  Near-black, acid lime, one rendered object.  ref: Modal / Fey
# ===========================================================================

C11 = """
:root{--bg:#08090B;--bg2:#0E1014;--line:#1D2026;--tx:#F2F4F3;--mu:#9AA0A6;
  --acid:#C8FF4D;--acid2:#8FE000}
body{margin:0;background:var(--bg);color:var(--tx);
  font:400 16px/1.6 'Space Grotesk',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.w{max-width:1200px;margin:0 auto;padding:0 clamp(20px,3vw,40px)}
.mono{font-family:'JetBrains Mono',monospace}
.strip{background:var(--acid);color:#0A0C07;font:500 12px/1 'JetBrains Mono',monospace;
  letter-spacing:.06em}
.strip .w{height:36px;display:flex;align-items:center;justify-content:center;gap:12px}
nav{position:sticky;top:29px;z-index:40;background:rgba(8,9,11,.82);backdrop-filter:blur(14px);
  border-bottom:1px solid var(--line)}
nav .w{display:flex;align-items:center;height:62px;gap:30px}
nav .bd{display:flex;align-items:center;gap:9px;font:700 16px/1 'Space Grotesk';letter-spacing:-.03em}
nav .bd i{width:18px;height:18px;border-radius:5px;background:var(--acid);display:block}
nav .lk{display:flex;gap:24px;font:500 13.5px/1 'Space Grotesk';color:var(--mu)}
nav .rt{margin-left:auto;display:flex;gap:10px;align-items:center}
.btn{border-radius:99px;padding:9px 17px;font:600 13px/1 'Space Grotesk'}
.btn.a{background:var(--acid);color:#0A0C07}
.btn.g{border:1px solid var(--line);color:var(--tx)}
.hero{text-align:center;padding:clamp(56px,8vw,110px) 0 0;position:relative;overflow:hidden}
.hero h1{font:700 clamp(2.6rem,6.4vw,5.1rem)/1.02 'Space Grotesk';letter-spacing:-.045em;
  margin:0 auto;max-width:15ch}
.hero h1 em{font-style:normal;color:var(--acid)}
.hero p{margin:22px auto 0;max-width:52ch;color:var(--mu);font-size:17px}
.acts{margin-top:28px;display:flex;gap:11px;justify-content:center}
.orb{margin:clamp(34px,5vw,64px) auto 0;width:min(520px,80vw);height:min(360px,56vw);
  position:relative}
.orb .core{position:absolute;inset:14% 18%;border-radius:22px;
  background:radial-gradient(60% 55% at 50% 42%,#E8FF7A 0%,#9BE81E 34%,#2E6B0A 72%,#0B1A04 100%);
  box-shadow:0 0 120px 24px rgba(155,232,30,.22),inset 0 -20px 60px rgba(0,0,0,.5)}
.orb .glow{position:absolute;inset:-18%;border-radius:50%;
  background:radial-gradient(closest-side,rgba(155,232,30,.20),transparent);filter:blur(12px)}
.rail{border-top:1px solid var(--line);border-bottom:1px solid var(--line);
  background:var(--bg2);margin-top:clamp(40px,5vw,70px)}
.rail .w{display:flex;gap:clamp(18px,3vw,48px);align-items:center;height:76px;
  overflow-x:auto;justify-content:space-between}
.rail span{font:600 15px/1 'Space Grotesk';color:#6E757C;white-space:nowrap;letter-spacing:-.02em}
section{padding:clamp(54px,7vw,100px) 0;border-bottom:1px solid var(--line)}
.eyebrow{font:500 11px/1 'JetBrains Mono',monospace;letter-spacing:.18em;text-transform:uppercase;
  color:var(--acid)}
h2{font:700 clamp(1.8rem,3.4vw,2.8rem)/1.06 'Space Grotesk';letter-spacing:-.04em;margin:14px 0 0}
.grid{display:grid;gap:1px;background:var(--line);border:1px solid var(--line);margin-top:34px}
@media(min-width:820px){.grid{grid-template-columns:repeat(3,1fr)}}
.cell{background:var(--bg);padding:26px 24px 30px}
.cell .n{font:500 11px/1 'JetBrains Mono',monospace;color:var(--acid)}
.cell b{display:block;margin:12px 0 0;font:600 17px/1.25 'Space Grotesk';letter-spacing:-.025em}
.cell p{margin:9px 0 0;font-size:14px;line-height:1.6;color:var(--mu)}
.stat{display:grid;gap:1px;background:var(--line);border:1px solid var(--line);margin-top:34px}
@media(min-width:760px){.stat{grid-template-columns:repeat(4,1fr)}}
.stat div{background:var(--bg2);padding:28px 22px}
.stat b{display:block;font:700 clamp(2rem,3.6vw,3rem)/1 'Space Grotesk';letter-spacing:-.04em;
  color:var(--acid);font-variant-numeric:tabular-nums}
.stat span{display:block;margin-top:9px;font:400 12.5px/1.45 'JetBrains Mono',monospace;color:var(--mu)}
footer{padding:44px 0 66px;color:#6E757C;font:400 12px/1.7 'JetBrains Mono',monospace}
"""


def c11():
    cells = "".join(
        f'<div class=cell><div class=n>{g[0]}</div><b>{g[1]}</b><p>{g[2][:150]}</p></div>'
        for g in LIVE.get("guarantees", [])[:6])
    stats = "".join(f'<div><b>{k}</b><span>{v}</span></div>' for k, v in
                    [("6", "Sites rebuilt"), ("38", "Sites measured"),
                     ("5", "Companies operated"), ("11d", "To first production")])
    logos = "".join(f'<span>{l}</span>' for l in LOGOS)
    body = f"""
<div class=strip><div class=w><span>ARTHUR 4.0 &mdash; SCOPED ENGAGEMENTS OPEN FOR Q4</span></div></div>
<nav><div class=w><span class=bd><i></i>LOVELEEDAY</span>
  <span class=lk><a href="#">Platform</a><a href="#">Products</a><a href="#">Work</a>
    <a href="#">Docs</a><a href="#">Company</a></span>
  <span class=rt><a class="btn g" href="#">Sign in</a><a class="btn a" href="#">Start a project</a></span>
</div></nav>
<header class=hero><div class=w>
  <h1>The <em>object layer</em> for the business you already run.</h1>
  <p>Resolve every record into one object. Carry the date it was true and the date you learned it. Then let the work prove it ran.</p>
  <div class=acts><a class="btn a" href="#">Start a project</a><a class="btn g" href="#">Read the brief</a></div>
  <div class=orb><div class=glow></div><div class=core></div></div>
</div></header>
<div class=rail><div class=w>{logos}</div></div>
<section><div class=w><p class=eyebrow>The guarantees</p>
  <h2>Five properties. Enforced, not promised.</h2>
  <div class=grid>{cells}</div>
  <div class=stat>{stats}</div>
</div></section>
<footer><div class=w>LOVELEEDAY STUDIOS &middot; KALAMAZOO, MICHIGAN</div></footer>"""
    return shell("11", "Volt", "Modal &middot; Fey &middot; Basedash",
                 "near-black, one acid accent, a rendered object", C11, body)


# ===========================================================================
# 12 — SOLSTICE.  Full-bleed saturated landscape.  ref: Mistral AI
# ===========================================================================

C12 = """
:root{--ink:#241109;--bone:#FBF6EE;--mu:#6B5A4E;--line:#E4D9C9;--hot:#E24B14}
body{margin:0;background:var(--bone);color:var(--ink);
  font:400 17px/1.6 'Inter Tight',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.w{max-width:1240px;margin:0 auto;padding:0 clamp(20px,3vw,44px)}
.sky{position:relative;min-height:clamp(520px,62vw,700px);display:flex;align-items:center;
  background:
    radial-gradient(120% 80% at 18% 8%, #FFD36B 0%, rgba(255,211,107,0) 55%),
    radial-gradient(110% 90% at 82% 18%, #FF8A2B 0%, rgba(255,138,43,0) 60%),
    radial-gradient(130% 100% at 50% 100%, #B2210E 0%, rgba(178,33,14,0) 62%),
    linear-gradient(170deg,#FFB13B 0%,#F0651C 44%,#8E1B0E 100%);
  overflow:hidden}
.ridge{position:absolute;left:0;right:0;bottom:0;height:62%;opacity:.5}
.ridge svg{width:100%;height:100%;display:block}
nav{position:relative;z-index:3}
.navbar{position:absolute;top:0;left:0;right:0;z-index:5}
.navbar .w{display:flex;align-items:center;height:70px;gap:30px;color:#FFF4E2}
.navbar .bd{font:600 17px/1 'Inter Tight';letter-spacing:-.03em}
.navbar .lk{display:flex;gap:24px;font:500 13.5px/1 'Inter Tight';color:rgba(255,244,226,.86)}
.navbar .rt{margin-left:auto;display:flex;gap:10px}
.navbar .btn{border:1px solid rgba(255,244,226,.45);border-radius:6px;padding:8px 15px;
  font:600 13px/1 'Inter Tight'}
.navbar .btn.solid{background:#FFF4E2;color:#8E1B0E;border-color:#FFF4E2}
.sky .w{position:relative;z-index:4;padding-top:60px}
.sky h1{font:300 clamp(2.9rem,6.6vw,5.4rem)/1.03 'Inter Tight';letter-spacing:-.045em;
  color:#FFF6E9;margin:0;max-width:16ch;text-shadow:0 2px 40px rgba(90,20,6,.28)}
.sky h1 em{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400}
.sky p{margin:24px 0 0;max-width:46ch;color:rgba(255,246,233,.92);font-size:18px}
.sky .acts{margin-top:30px;display:flex;gap:20px;align-items:center;
  font:500 15px/1 'Inter Tight';color:#FFF6E9}
.sky .acts a{border-bottom:1px solid rgba(255,246,233,.5);padding-bottom:5px}
.logos{background:var(--bone);border-bottom:1px solid var(--line)}
.logos .w{display:flex;align-items:center;justify-content:space-between;gap:26px;
  height:104px;overflow-x:auto}
.logos span{font:600 17px/1 'Inter Tight';color:#9C8B7C;white-space:nowrap;letter-spacing:-.02em}
section{padding:clamp(56px,7vw,104px) 0}
.eyebrow{font:500 12px/1 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;color:var(--hot)}
h2{font:300 clamp(2rem,4vw,3.2rem)/1.08 'Inter Tight';letter-spacing:-.04em;margin:16px 0 0;
  max-width:20ch}
h2 em{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400}
.cards{display:grid;gap:20px;margin-top:40px}
@media(min-width:840px){.cards{grid-template-columns:repeat(3,1fr)}}
.card{border:1px solid var(--line);background:#fff;padding:28px 26px 32px;border-radius:14px}
.card .n{font:500 12px/1 'Inter Tight';letter-spacing:.16em;color:var(--hot)}
.card b{display:block;margin:14px 0 0;font:500 20px/1.2 'Inter Tight';letter-spacing:-.03em}
.card p{margin:10px 0 0;font-size:15px;line-height:1.6;color:var(--mu)}
footer{border-top:1px solid var(--line);padding:40px 0 64px;color:#9C8B7C;font-size:13px}
"""


def _ridge():
    import math
    def layer(seed, amp, y0, fill):
        pts = []
        for i in range(0, 101):
            x = i / 100
            y = y0 + amp * (math.sin(x * 6.1 + seed) * .5 + math.sin(x * 13.7 + seed * 2) * .28
                            + math.sin(x * 2.3 + seed * .5) * .6)
            pts.append(f"{x*1200:.0f},{y:.0f}")
        return f'<polygon points="0,400 {" ".join(pts)} 1200,400" fill="{fill}"/>'
    return ('<svg viewBox="0 0 1200 400" preserveAspectRatio="none">'
            + layer(0.4, 26, 250, "#8E1B0E")
            + layer(2.1, 20, 296, "#6E1109")
            + layer(4.3, 15, 340, "#4A0A06") + '</svg>')


def c12():
    cards = "".join(
        f'<div class=card><div class=n>{g[0]}</div><b>{g[1]}</b><p>{g[2][:140]}</p></div>'
        for g in LIVE.get("guarantees", [])[:3])
    logos = "".join(f'<span>{l}</span>' for l in LOGOS)
    body = f"""
<header class=sky>
  <div class=ridge>{_ridge()}</div>
  <div class=navbar><div class=w><span class=bd>LOVELEEDAY</span>
    <span class=lk><a href="#">Platform</a><a href="#">Products</a><a href="#">Work</a>
      <a href="#">Research</a><a href="#">Company</a></span>
    <span class=rt><a class=btn href="#">Contact sales</a>
      <a class="btn solid" href="#">Start a project</a></span></div></div>
  <div class=w>
    <h1>Intelligence <em>you can trace.</em></h1>
    <p>We build the systems other people describe &mdash; and every figure they produce names the place it came from.</p>
    <div class=acts><a href="#">Get in touch &rarr;</a><a href="#">Start building &rarr;</a></div>
  </div>
</header>
<div class=logos><div class=w>{logos}</div></div>
<section><div class=w><p class=eyebrow>The guarantees</p>
  <h2>Five properties. <em>Enforced,</em> not promised.</h2>
  <div class=cards>{cards}</div>
</div></section>
<footer><div class=w>LOVELEEDAY Studios &middot; Kalamazoo, Michigan</div></footer>"""
    return shell("12", "Solstice", "Mistral AI",
                 "a saturated landscape, light display type over it", C12, body)


# ===========================================================================
# 13 — CHROME.  Aluminium, ultra-thin grotesk, one acid block.  ref: Weavy
# ===========================================================================

C13 = """
:root{--sil:#E9EBED;--sil2:#DDE0E3;--pap:#FFFFFF;--ink:#0C0D0F;--mu:#5C6167;
  --line:#C9CED3;--acid:#EAFF3C}
body{margin:0;background:var(--sil);color:var(--ink);
  font:400 15px/1.6 'Archivo',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.w{max-width:1340px;margin:0 auto;padding:0 clamp(18px,2.4vw,34px)}
.top{background:var(--ink);color:#E9EBED;font:500 11.5px/1 'Archivo';letter-spacing:.04em}
.top .w{height:34px;display:flex;align-items:center;justify-content:center;gap:10px}
nav{border-bottom:1px solid var(--line);background:var(--sil)}
nav .w{display:flex;align-items:stretch;height:56px}
nav .bd{display:flex;align-items:center;gap:10px;padding-right:22px;border-right:1px solid var(--line);
  font:800 15px/1 'Archivo';letter-spacing:-.04em}
nav .lk{display:flex;align-items:center;gap:22px;padding-left:22px;
  font:500 12px/1 'Archivo';letter-spacing:.08em;text-transform:uppercase;color:var(--mu)}
nav .rt{margin-left:auto;display:flex;align-items:stretch}
nav .rt a{display:flex;align-items:center;padding:0 20px;font:600 12px/1 'Archivo';
  letter-spacing:.08em;text-transform:uppercase}
nav .rt a.acid{background:var(--acid);color:var(--ink);font-size:15px;letter-spacing:-.02em;
  text-transform:none;padding:0 26px}
.hero{padding:clamp(40px,5vw,72px) 0 clamp(30px,3.4vw,48px)}
.hero .row{display:flex;gap:clamp(20px,4vw,70px);align-items:baseline;flex-wrap:wrap}
.hero h1{font:200 clamp(2.6rem,7vw,5.6rem)/0.98 'Archivo';letter-spacing:-.05em;margin:0}
.hero h1 b{font-weight:700}
.hero p{margin:22px 0 0;max-width:46ch;color:var(--mu);font-size:15.5px;line-height:1.55}
.canvas{margin-top:clamp(26px,3.4vw,44px);border-top:1px solid var(--line);
  border-bottom:1px solid var(--line);background:
   linear-gradient(var(--sil2),var(--sil));padding:clamp(24px,3vw,44px) 0}
.nodes{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(178px,1fr))}
.node{background:var(--pap);border:1px solid var(--line);overflow:hidden}
.node .cap{padding:9px 12px;font:500 10.5px/1.3 'Archivo';letter-spacing:.12em;
  text-transform:uppercase;color:var(--mu);border-bottom:1px solid var(--line)}
.node img{width:100%;height:118px;object-fit:cover;display:block}
.node .body{padding:11px 12px;font-size:12.5px;color:var(--mu);line-height:1.5}
section{padding:clamp(46px,6vw,88px) 0}
.eyebrow{font:600 11px/1 'Archivo';letter-spacing:.2em;text-transform:uppercase;color:var(--mu)}
h2{font:200 clamp(1.9rem,4vw,3.2rem)/1.04 'Archivo';letter-spacing:-.045em;margin:14px 0 0}
h2 b{font-weight:700}
.list{margin-top:34px;border-top:1px solid var(--line)}
.list .r{display:grid;gap:18px;padding:20px 0;border-bottom:1px solid var(--line);align-items:baseline}
@media(min-width:860px){.list .r{grid-template-columns:70px 1fr 1.5fr}}
.list .n{font:500 12px/1 'Archivo';letter-spacing:.1em;color:var(--mu)}
.list b{font:600 19px/1.2 'Archivo';letter-spacing:-.03em}
.list p{margin:0;font-size:14.5px;color:var(--mu);line-height:1.6}
footer{border-top:1px solid var(--line);padding:34px 0 60px;color:var(--mu);
  font:500 11.5px/1.7 'Archivo';letter-spacing:.06em;text-transform:uppercase}
"""


def c13():
    nodes = "".join(
        f'<div class=node><div class=cap>{s["sector"]}</div>'
        f'<img src="../../public{s["frame"].split("?")[0]}" alt="">'
        f'<div class=body>{s["thesis"][:88]}&hellip;</div></div>' for s in STUDIES[:5])
    rows = "".join(
        f'<div class=r><div class=n>{g[0]}</div><div><b>{g[1]}</b></div>'
        f'<div><p>{g[2][:180]}</p></div></div>' for g in LIVE.get("guarantees", []))
    body = f"""
<div class=top><div class=w><span>LOVELEEDAY IS BUILDING ARTHUR 4.0 &mdash; SCOPED ENGAGEMENTS OPEN FOR Q4</span></div></div>
<nav><div class=w><span class=bd>LOVELEEDAY</span>
  <span class=lk><a href="#">Platform</a><a href="#">Products</a><a href="#">Work</a>
    <a href="#">Enterprise</a><a href="#">Docs</a></span>
  <span class=rt><a href="#">Sign in</a><a class=acid href="#">Start Now</a></span></div></nav>
<header class=hero><div class=w><div class=row>
  <h1>LOVELEEDAY</h1><h1><b>Object Intelligence</b></h1>
</div>
<p>Turn scattered records into one object per company. Every value carries where it came from and when it was true.</p>
</div>
<div class=canvas><div class=w><div class=nodes>{nodes}</div></div></div>
</header>
<section><div class=w><p class=eyebrow>The guarantees</p>
  <h2>Five properties. <b>Enforced,</b> not promised.</h2>
  <div class=list>{rows}</div>
</div></section>
<footer><div class=w>LOVELEEDAY Studios &middot; Kalamazoo, Michigan</div></footer>"""
    return shell("13", "Chrome", "Weavy",
                 "aluminium ground, ultra-thin grotesk, one acid block", C13, body)


# ===========================================================================
# 14 — ATRIUM.  Aubergine, a luminous halo, one enormous stat.  ref: WRITER
# ===========================================================================

C14 = """
:root{--bg:#140A12;--bg2:#1E0F1A;--tx:#F7EFF3;--mu:#B9A3B0;--line:#33202E;
  --gold:#E9C46A;--rose:#C86B7E}
body{margin:0;background:var(--bg);color:var(--tx);
  font:400 16px/1.62 'Figtree',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.w{max-width:1160px;margin:0 auto;padding:0 clamp(20px,3vw,40px)}
nav{position:sticky;top:29px;z-index:40;background:rgba(20,10,18,.8);backdrop-filter:blur(14px);
  border-bottom:1px solid var(--line)}
nav .w{display:flex;align-items:center;height:64px;gap:28px}
nav .bd{font:800 18px/1 'Fraunces';letter-spacing:-.02em}
nav .lk{display:flex;gap:24px;font:500 13.5px/1 'Figtree';color:var(--mu)}
nav .rt{margin-left:auto;display:flex;gap:10px}
.btn{border-radius:99px;padding:9px 18px;font:600 13px/1 'Figtree'}
.btn.g{background:var(--gold);color:#2A1508}
.btn.o{border:1px solid var(--line);color:var(--tx)}
.hero{position:relative;text-align:center;padding:clamp(60px,9vw,128px) 0 clamp(40px,6vw,88px);
  overflow:hidden}
.halo{position:absolute;left:50%;top:38%;width:min(1000px,120vw);height:min(1000px,120vw);
  transform:translate(-50%,-50%);pointer-events:none;
  background:radial-gradient(closest-side,rgba(233,196,106,.20),rgba(200,107,126,.10) 46%,transparent 70%)}
.rays{position:absolute;left:50%;top:38%;width:min(900px,110vw);height:min(900px,110vw);
  transform:translate(-50%,-50%);opacity:.42}
.hero .w{position:relative;z-index:3}
.hero h1{font:300 clamp(2.5rem,5.6vw,4.4rem)/1.06 'Fraunces';letter-spacing:-.025em;margin:0 auto;
  max-width:17ch}
.hero h1 em{font-style:italic;color:var(--gold)}
.hero p{margin:24px auto 0;max-width:50ch;color:var(--mu);font-size:17px}
.acts{margin-top:30px;display:flex;gap:12px;justify-content:center}
.proof{position:relative;z-index:3;margin-top:clamp(40px,5vw,78px);display:grid;gap:26px;
  align-items:center}
@media(min-width:840px){.proof{grid-template-columns:1fr 1.1fr 1fr}}
.proof .big{font:300 clamp(3.4rem,7vw,5.6rem)/1 'Fraunces';letter-spacing:-.04em;color:var(--gold);
  font-variant-numeric:tabular-nums}
.proof .cap{margin-top:10px;font-size:13.5px;color:var(--mu);line-height:1.5}
.proof figure{margin:0;border-radius:999px;overflow:hidden;width:min(260px,60vw);
  aspect-ratio:1;margin-inline:auto;border:1px solid var(--line)}
.proof img{width:100%;height:100%;object-fit:cover}
.proof .who b{display:block;font:600 16px/1.3 'Figtree'}
.proof .who span{display:block;margin-top:5px;font-size:13.5px;color:var(--mu)}
section{padding:clamp(52px,7vw,96px) 0;border-top:1px solid var(--line)}
.eyebrow{font:600 11px/1 'Figtree';letter-spacing:.2em;text-transform:uppercase;color:var(--rose)}
h2{font:300 clamp(1.9rem,3.8vw,3rem)/1.08 'Fraunces';letter-spacing:-.03em;margin:14px 0 0}
h2 em{font-style:italic;color:var(--gold)}
.rows{margin-top:32px;border-top:1px solid var(--line)}
.rows .r{display:grid;gap:18px;padding:19px 0;border-bottom:1px solid var(--line);align-items:baseline}
@media(min-width:820px){.rows .r{grid-template-columns:56px 1fr 1.4fr}}
.rows .n{font:500 12.5px/1 'Figtree';color:var(--gold)}
.rows b{font:600 17px/1.25 'Figtree'}
.rows p{margin:0;font-size:14.5px;color:var(--mu);line-height:1.6}
footer{padding:40px 0 66px;color:var(--mu);font-size:12.5px;border-top:1px solid var(--line)}
"""


def c14():
    import math
    rays = "".join(
        f'<line x1="300" y1="300" x2="{300+math.cos(i*math.pi/36)*292:.1f}" '
        f'y2="{300+math.sin(i*math.pi/36)*292:.1f}" stroke="#E9C46A" stroke-width="1" '
        f'opacity="{0.10+0.5*abs(math.sin(i*0.7))%0.5:.2f}"/>' for i in range(72))
    rows = "".join(
        f'<div class=r><div class=n>{g[0]}</div><div><b>{g[1]}</b></div>'
        f'<div><p>{g[2][:190]}</p></div></div>' for g in LIVE.get("guarantees", []))
    body = f"""
<nav><div class=w><span class=bd>LOVELEEDAY</span>
  <span class=lk><a href="#">Platform</a><a href="#">Products</a><a href="#">Work</a>
    <a href="#">Research</a><a href="#">Company</a></span>
  <span class=rt><a class="btn o" href="#">Sign in</a><a class="btn g" href="#">Request a demo</a></span>
</div></nav>
<header class=hero>
  <div class=halo></div>
  <svg class=rays viewBox="0 0 600 600">{rays}</svg>
  <div class=w>
    <h1>The intelligence layer for the business you <em>already run.</em></h1>
    <p>Five companies run on it before any client saw it. Every figure it produces names the system it came from.</p>
    <div class=acts><a class="btn g" href="#">Request a demo</a><a class="btn o" href="#">Try it free</a></div>
    <div class=proof>
      <div><div class=big>11d</div><div class=cap>from first commit to the first paying venue, on olldae</div></div>
      <!-- NO NAMED ATTRIBUTION ON A PHOTOGRAPH OF SOMEBODY ELSE. The first
           version captioned this frame "LOVELEEDAY Studios, Founder", which is a
           stock-register photograph of two people who are not him. The WRITER
           layout this borrows puts a real named customer in that circle; until
           there is a real one, the frame stays unattributed. -->
      <figure><img src="../micruity/x_office.jpg" alt=""></figure>
      <div class=who><b>Five companies, owned and run</b>
        <span>olldae &middot; Kronos &middot; Duezy &middot; Ops Layer &middot; Dabney &amp; Co.</span>
        <div class=cap style="margin-top:14px">Six client rebuilds shipped this year, none of them named.</div></div>
    </div>
  </div>
</header>
<section><div class=w><p class=eyebrow>The guarantees</p>
  <h2>Five properties. <em>Enforced,</em> not promised.</h2>
  <div class=rows>{rows}</div>
</div></section>
<footer><div class=w>LOVELEEDAY Studios &middot; Kalamazoo, Michigan</div></footer>"""
    return shell("14", "Atrium", "WRITER &middot; Magnific",
                 "aubergine, a luminous halo, one enormous figure", C14, body)


# ===========================================================================
# 15 — CARGO.  Warm card on saturated ground, objects, a huge logo grid.
#              ref: Clay / GitBook
# ===========================================================================

C15 = """
:root{--ground:#F1EDE6;--card:#FFFFFF;--ink:#16141F;--mu:#565166;--line:#E2DCD2;
  --blue:#2B4BFF;--tang:#FF6B2C;--mint:#0FB57A}
body{margin:0;background:var(--ground);color:var(--ink);
  font:400 16px/1.6 'Figtree',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.w{max-width:1220px;margin:0 auto;padding:0 clamp(20px,3vw,40px)}
nav .w{display:flex;align-items:center;height:64px;gap:28px}
nav .bd{display:flex;align-items:center;gap:9px;
  font:800 17px/1 'Bricolage Grotesque';letter-spacing:-.04em}
nav .bd i{width:20px;height:20px;border-radius:7px;
  background:linear-gradient(135deg,var(--blue),var(--mint));display:block}
nav .lk{display:flex;gap:22px;font:500 13.5px/1 'Figtree';color:var(--mu)}
nav .rt{margin-left:auto;display:flex;gap:10px;align-items:center}
.btn{border-radius:10px;padding:10px 17px;font:600 13.5px/1 'Figtree'}
.btn.p{background:var(--ink);color:#fff}
.btn.q{color:var(--mu)}
.card{margin:0 auto;max-width:1160px;background:var(--card);border-radius:26px;
  padding:clamp(48px,7vw,104px) clamp(22px,4vw,64px) clamp(40px,5vw,72px);
  text-align:center;position:relative;overflow:hidden;
  box-shadow:0 44px 90px -60px rgba(22,20,31,.42)}
.card h1{font:800 clamp(2.4rem,5.6vw,4.4rem)/1.03 'Bricolage Grotesque';letter-spacing:-.045em;
  margin:0 auto;max-width:17ch}
.card h1 span{background:linear-gradient(96deg,var(--blue),var(--mint) 58%,var(--tang));
  -webkit-background-clip:text;background-clip:text;color:transparent}
.card p{margin:22px auto 0;max-width:50ch;color:var(--mu);font-size:17.5px}
.card .acts{margin-top:28px}
.blob{position:absolute;border-radius:34% 66% 58% 42%/48% 38% 62% 52%;filter:blur(.4px)}
.b1{width:120px;height:120px;left:-26px;top:38%;background:linear-gradient(140deg,#FFB020,#FF6B2C)}
.b2{width:92px;height:92px;right:24px;top:22%;background:linear-gradient(140deg,#2B4BFF,#7FA0FF)}
.b3{width:74px;height:74px;right:-18px;bottom:16%;background:linear-gradient(140deg,#0FB57A,#8CE8C6)}
.b4{width:64px;height:64px;left:44px;bottom:12%;background:linear-gradient(140deg,#C86BFF,#FF9AD5)}
.logos{padding:clamp(34px,4vw,58px) 0 clamp(40px,5vw,70px)}
.logos .lead{text-align:center;font:500 12px/1.6 'Figtree';letter-spacing:.14em;
  text-transform:uppercase;color:var(--mu)}
.lgrid{display:grid;gap:22px 30px;margin-top:28px;
  grid-template-columns:repeat(auto-fit,minmax(118px,1fr));align-items:center}
.lgrid span{text-align:center;font:700 16px/1 'Bricolage Grotesque';color:#8B8598;
  letter-spacing:-.03em}
section{padding:clamp(48px,6vw,88px) 0}
.eyebrow{font:600 11.5px/1 'Figtree';letter-spacing:.18em;text-transform:uppercase;color:var(--tang)}
h2{font:800 clamp(1.9rem,3.8vw,3rem)/1.06 'Bricolage Grotesque';letter-spacing:-.042em;margin:14px 0 0}
.tiles{display:grid;gap:16px;margin-top:34px}
@media(min-width:820px){.tiles{grid-template-columns:repeat(3,1fr)}}
.tile{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:26px 24px 30px}
.tile .dot{width:34px;height:34px;border-radius:11px;display:block;
  background:linear-gradient(140deg,var(--blue),var(--mint))}
.tile:nth-child(2) .dot{background:linear-gradient(140deg,var(--tang),#FFB020)}
.tile:nth-child(3) .dot{background:linear-gradient(140deg,#C86BFF,#7FA0FF)}
.tile b{display:block;margin:16px 0 0;font:700 18px/1.22 'Bricolage Grotesque';letter-spacing:-.03em}
.tile p{margin:9px 0 0;font-size:14.5px;line-height:1.6;color:var(--mu)}
footer{border-top:1px solid var(--line);padding:36px 0 62px;color:var(--mu);font-size:13px}
"""


def c15():
    tiles = "".join(
        f'<div class=tile><span class=dot></span><b>{g[1]}</b><p>{g[2][:150]}</p></div>'
        for g in LIVE.get("guarantees", [])[:3])
    logos = "".join(f'<span>{l}</span>' for l in
                    LOGOS + [s["sector"] for s in STUDIES[:6]])
    body = f"""
<nav><div class=w><span class=bd><i></i>loveleeday</span>
  <span class=lk><a href="#">Product</a><a href="#">Use cases</a><a href="#">Solutions</a>
    <a href="#">Work</a><a href="#">Company</a></span>
  <span class=rt><a class="btn q" href="#">Log in</a><a class="btn p" href="#">Start a project</a></span>
</div></nav>
<div class=w><div class=card>
  <span class="blob b1"></span><span class="blob b2"></span>
  <span class="blob b3"></span><span class="blob b4"></span>
  <h1>Go to market with <span>unique data</span> &mdash; and the systems to act on it</h1>
  <p>One object per company, the date it was true, the trail back to the source, and proof the work ran.</p>
  <div class=acts><a class="btn p" href="#">Start a project &rarr;</a></div>
</div></div>
<div class=logos><div class=w>
  <p class=lead>Five companies we own and run &middot; six rebuilds shipped this year</p>
  <div class=lgrid>{logos}</div>
</div></div>
<section><div class=w><p class=eyebrow>The guarantees</p>
  <h2>Five properties. Enforced, not promised.</h2>
  <div class=tiles>{tiles}</div>
</div></section>
<footer><div class=w>LOVELEEDAY Studios &middot; Kalamazoo, Michigan</div></footer>"""
    return shell("15", "Cargo", "Clay &middot; GitBook",
                 "warm card on a soft ground, objects, a logo grid as argument", C15, body)


BUILDERS = [("c11-volt.html", c11), ("c12-solstice.html", c12), ("c13-chrome.html", c13),
            ("c14-atrium.html", c14), ("c15-cargo.html", c15)]

if __name__ == "__main__":
    for name, fn in BUILDERS:
        (HERE / name).write_text(fn())
        print("wrote", name)
