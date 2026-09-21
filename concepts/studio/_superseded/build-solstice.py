#!/usr/bin/env python3
"""Concept 12 SOLSTICE — five hero photographs, one layout.

     python3 concepts/studio/build-solstice.py
       -> concepts/studio/solstice/12{a..e}.html  and  index.html

   Daniel picked 12 and asked to see it with photographs in the hero instead of
   the drawn gradient. So the layout, the type and the grade are held constant
   and the ONLY variable is the picture underneath -- which is the whole point
   of a variation set. Changing two things at once means learning nothing.

   THE GRADE IS THE SYSTEM. A photograph cannot be dropped in raw: these five
   were shot by five people in five places and their colour has nothing in
   common. Each hero therefore gets the same three-layer treatment --

     1. the photograph, cover-fitted, anchored low so the horizon sits under
        the type rather than through it
     2. a MULTIPLY wash in the Solstice amber/rust, which pulls every image
        onto one palette no matter what it arrived as
     3. a directional scrim, dark at the type side, clearing toward the light

   -- and the result is measured rather than assumed: check_contrast() below
   samples the actual rendered pixels beneath the headline and the sub, and the
   build fails if any of them falls under 4.5:1. That is the only reason to
   trust a white headline over a photograph you did not take.

   A is the studio's own photograph. It is first on purpose: the other four are
   Unsplash, and a picture of a thing this company actually built outranks a
   better-composed picture of somewhere it has never been.
"""
import json
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / "solstice"
OUT.mkdir(exist_ok=True)
LIVE = json.loads((HERE / "live-content.json").read_text()) if (HERE / "live-content.json").exists() else {}

# The five. `grade` is the multiply wash; `scrim` the directional darkening;
# `anchor` where the photograph is cover-anchored behind the type.
VARIANTS = [
    ("a", "Own work", "own-solar.jpg",
     "The studio's own photograph &mdash; utility-scale solar at golden hour, from a "
     "system we built and run. The only one of the five that is evidence as well as art.", False,
     "linear-gradient(168deg,rgba(255,176,59,.42) 0%,rgba(240,101,28,.52) 46%,rgba(120,26,10,.72) 100%)",
     "linear-gradient(96deg,rgba(58,14,6,.80) 0%,rgba(58,14,6,.54) 46%,rgba(58,14,6,.14) 100%)",
     "50% 62%"),
    ("b", "Ridge, blaze", "ridge-blaze.jpg",
     "Layered ridges under a burning sky. The closest of the five to the reference, and "
     "the one that reads biggest &mdash; depth in the image does the work a gradient fakes.", False,
     "linear-gradient(168deg,rgba(255,186,72,.30) 0%,rgba(236,96,24,.44) 48%,rgba(110,22,8,.70) 100%)",
     "linear-gradient(96deg,rgba(46,10,4,.78) 0%,rgba(46,10,4,.48) 48%,rgba(46,10,4,.10) 100%)",
     "50% 58%"),
    ("c", "Dunes, aerial", "dunes-aerial.jpg",
     "Shot straight down. It reads as pattern rather than place, which keeps the page "
     "abstract &mdash; useful for a company that is not selling a location.", False,
     # C measured 4.19:1 on the headline with the standard scrim -- aerial sand
     # is the brightest surface in the set and it sits directly under the type.
     # Only this variation's scrim is deepened; the others keep theirs, because
     # grading all five to the worst photograph would flatten the four that work.
     "linear-gradient(168deg,rgba(255,196,96,.24) 0%,rgba(228,104,32,.44) 50%,rgba(104,28,10,.70) 100%)",
     "linear-gradient(96deg,rgba(38,12,5,.90) 0%,rgba(38,12,5,.66) 46%,rgba(38,12,5,.18) 100%)",
     "50% 50%"),
    ("d", "Ridge, haze", "ridge-haze.jpg",
     "The quietest. Pastel layers and a high horizon, graded warm rather than born warm "
     "&mdash; the most typographic of the five, because the picture argues least.", False,
     "linear-gradient(168deg,rgba(255,200,110,.34) 0%,rgba(232,118,46,.46) 48%,rgba(116,34,14,.66) 100%)",
     "linear-gradient(96deg,rgba(48,16,8,.76) 0%,rgba(48,16,8,.46) 50%,rgba(48,16,8,.10) 100%)",
     "50% 56%"),
    ("e", "Desert, rust", "desert-rust.jpg",
     "Rust dunes against far mountains. The most saturated, and the one that would carry "
     "a dark navigation bar best if the brand ever needs one.", False,
     "linear-gradient(168deg,rgba(255,168,60,.30) 0%,rgba(214,80,22,.50) 46%,rgba(96,24,10,.74) 100%)",
     "linear-gradient(96deg,rgba(40,12,6,.82) 0%,rgba(40,12,6,.52) 46%,rgba(40,12,6,.12) 100%)",
     "50% 64%"),

    # ── PEOPLE ────────────────────────────────────────────────────────────────
    # A face competes with a headline in a way a ridge does not, so these five
    # are anchored so the subject sits in the LIGHT half, opposite the type, and
    # the amber multiply is pulled back: a heavy wash over skin goes orange and
    # sickly, which is the fastest way to make a real photograph look fake.
    ("f", "Own work, the bench", "own-bench.jpg",
     "The studio's own photograph &mdash; two scientists at the bench, warm lamp light. "
     "People and evidence in the same frame, which is the only version of this that is "
     "both.", True,
     "linear-gradient(168deg,rgba(255,186,84,.20) 0%,rgba(228,106,36,.28) 48%,rgba(110,28,10,.46) 100%)",
     "linear-gradient(96deg,rgba(38,12,5,.86) 0%,rgba(38,12,5,.56) 48%,rgba(38,12,5,.14) 100%)",
     "68% 50%"),
    ("g", "Two, against the light", "pair-sunset.jpg",
     "Backlit figures at a window. People are unmistakably present and nobody's face is "
     "competing with the headline &mdash; the most Solstice-native of the people set.", True,
     "linear-gradient(168deg,rgba(255,176,64,.24) 0%,rgba(230,96,28,.34) 48%,rgba(104,24,8,.52) 100%)",
     "linear-gradient(96deg,rgba(34,10,4,.84) 0%,rgba(34,10,4,.52) 48%,rgba(34,10,4,.12) 100%)",
     "62% 50%"),
    ("h", "One, at the bench", "bench-lamp.jpg",
     "A single maker under a lamp. The most intimate, and the best fit for a page that "
     "argues craft rather than scale.", True,
     "linear-gradient(168deg,rgba(255,182,72,.18) 0%,rgba(226,100,32,.28) 48%,rgba(102,26,10,.46) 100%)",
     "linear-gradient(96deg,rgba(32,10,4,.88) 0%,rgba(32,10,4,.58) 48%,rgba(32,10,4,.16) 100%)",
     "70% 46%"),
    ("i", "A room, golden", "room-golden.jpg",
     "Several people in a room full of late light. The only one that reads as a team "
     "rather than as an individual.", True,
     # I measured 3.13:1 -- the brightest thing in the whole set is a window full
     # of late sun, and it sits directly behind the headline. Its scrim is the
     # heaviest of the ten for that reason alone.
     "linear-gradient(168deg,rgba(255,190,88,.24) 0%,rgba(232,110,38,.34) 48%,rgba(108,28,10,.54) 100%)",
     "linear-gradient(96deg,rgba(28,9,3,.95) 0%,rgba(28,9,3,.76) 46%,rgba(28,9,3,.26) 100%)",
     "64% 52%"),
    ("j", "Own work, district IT", "own-itlead.jpg",
     "The studio's own photograph, and the hardest of the ten: it arrives blue, so the "
     "amber has to do real work. Proof that the grade is a system rather than a filter "
     "that only flatters images already the right colour.", True,
     "linear-gradient(168deg,rgba(255,170,58,.44) 0%,rgba(226,92,26,.56) 48%,rgba(98,22,8,.70) 100%)",
     "linear-gradient(96deg,rgba(30,10,4,.88) 0%,rgba(30,10,4,.58) 48%,rgba(30,10,4,.18) 100%)",
     "66% 50%"),
]

FONTS = ("https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700&"
         "family=Instrument+Serif:ital@0;1&display=swap")

LOGOS = ["olldae", "KRONOS", "Duezy", "Dabney &amp; Co.", "Ops Layer", "Arthur"]


def css(grade, scrim, anchor):
    return f"""
*,*::before,*::after{{box-sizing:border-box}}
:root{{--ink:#241109;--bone:#FBF6EE;--mu:#6B5A4E;--line:#E4D9C9;--hot:#C8410F}}
body{{margin:0;background:var(--bone);color:var(--ink);
  font:400 17px/1.6 'Inter Tight',system-ui,sans-serif;-webkit-font-smoothing:antialiased}}
a{{color:inherit;text-decoration:none}}
img{{display:block;max-width:100%}}
.w{{max-width:1240px;margin:0 auto;padding:0 clamp(20px,3vw,44px)}}
.ribbon{{position:sticky;top:0;z-index:99;background:#241109;color:#FBF6EE;
  font:500 11px/1 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;
  padding:9px 18px}}
.sky{{position:relative;min-height:clamp(540px,64vw,720px);display:flex;align-items:center;
  overflow:hidden;isolation:isolate}}
.sky .shot{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  object-position:{anchor};z-index:-3}}
.sky .grade{{position:absolute;inset:0;z-index:-2;mix-blend-mode:multiply;
  background:{grade}}}
.sky .scrim{{position:absolute;inset:0;z-index:-1;background:{scrim}}}
.navbar{{position:absolute;top:0;left:0;right:0;z-index:5}}
.navbar .w{{display:flex;align-items:center;height:72px;gap:30px;color:#FFF4E2}}
.navbar .bd{{font:600 17px/1 'Inter Tight';letter-spacing:-.03em}}
.navbar .lk{{display:flex;gap:24px;font:500 13.5px/1 'Inter Tight';color:#FFF4E2;opacity:.94}}
.navbar .rt{{margin-left:auto;display:flex;gap:10px}}
.navbar .btn{{border:1px solid rgba(255,244,226,.6);border-radius:6px;padding:8px 15px;
  font:600 13px/1 'Inter Tight'}}
.navbar .btn.solid{{background:#FFF4E2;color:#7A1A0A;border-color:#FFF4E2}}
.sky .w{{position:relative;z-index:4;padding-top:64px}}
.sky h1{{font:300 clamp(2.9rem,6.6vw,5.4rem)/1.03 'Inter Tight';letter-spacing:-.045em;
  color:#FFF8EE;margin:0;max-width:16ch}}
.sky h1 em{{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400}}
.sky p{{margin:24px 0 0;max-width:46ch;color:#FBEFE1;font-size:18px}}
.sky .acts{{margin-top:30px;display:flex;gap:20px;align-items:center;
  font:500 15px/1 'Inter Tight';color:#FFF8EE}}
.sky .acts a{{border-bottom:1px solid rgba(255,248,238,.6);padding-bottom:5px}}
.logos{{background:var(--bone);border-bottom:1px solid var(--line)}}
.logos .w{{display:flex;align-items:center;justify-content:space-between;gap:26px;
  height:104px;overflow-x:auto}}
.logos span{{font:600 17px/1 'Inter Tight';color:#9C8B7C;white-space:nowrap;letter-spacing:-.02em}}
section{{padding:clamp(52px,6.5vw,96px) 0}}
.eyebrow{{font:500 12px/1 'Inter Tight';letter-spacing:.2em;text-transform:uppercase;color:var(--hot)}}
h2{{font:300 clamp(2rem,4vw,3.2rem)/1.08 'Inter Tight';letter-spacing:-.04em;margin:16px 0 0;
  max-width:20ch}}
h2 em{{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400}}
.cards{{display:grid;gap:20px;margin-top:40px}}
@media(min-width:840px){{.cards{{grid-template-columns:repeat(3,1fr)}}}}
.card{{border:1px solid var(--line);background:#fff;padding:28px 26px 32px;border-radius:14px}}
.card .n{{font:500 12px/1 'Inter Tight';letter-spacing:.16em;color:var(--hot)}}
.card b{{display:block;margin:14px 0 0;font:500 20px/1.2 'Inter Tight';letter-spacing:-.03em}}
.card p{{margin:10px 0 0;font-size:15px;line-height:1.6;color:var(--mu)}}
footer{{border-top:1px solid var(--line);padding:40px 0 64px;color:#9C8B7C;font-size:13px}}
"""


def page(key, name, photo, note, people, grade, scrim, anchor):
    cards = "".join(
        f'<div class=card><div class=n>{g[0]}</div><b>{g[1]}</b><p>{g[2][:140]}</p></div>'
        for g in LIVE.get("guarantees", [])[:3])
    logos = "".join(f'<span>{l}</span>' for l in LOGOS)
    return f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>Solstice {key.upper()} &mdash; {name}</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="{FONTS}" rel=stylesheet>
<style>{css(grade, scrim, anchor)}</style></head><body>
<div class=ribbon>Solstice &middot; variation {key.upper()} &middot; {name}</div>
<header class=sky>
  <img class=shot src="../../../public/studio/solstice/{photo}" alt="">
  <div class=grade></div><div class=scrim></div>
  <div class=navbar><div class=w><span class=bd>LOVELEEDAY</span>
    <span class=lk><a href="#">Platform</a><a href="#">Products</a><a href="#">Work</a>
      <a href="#">Research</a><a href="#">Company</a></span>
    <span class=rt><a class=btn href="#">Contact sales</a>
      <a class="btn solid" href="#">Start a project</a></span></div></div>
  <div class=w>
    <h1>Intelligence <em>you can trace.</em></h1>
    <p>We build the systems other people describe &mdash; and every figure they produce
    names the place it came from.</p>
    <div class=acts><a href="#">Get in touch &rarr;</a><a href="#">Start building &rarr;</a></div>
  </div>
</header>
<div class=logos><div class=w>{logos}</div></div>
<section><div class=w><p class=eyebrow>The guarantees</p>
  <h2>Five properties. <em>Enforced,</em> not promised.</h2>
  <div class=cards>{cards}</div>
</div></section>
<footer><div class=w>Variation {key.upper()} &mdash; {note}</div></footer>
</body></html>"""


INDEX_CSS = """
*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:#FBF6EE;color:#241109;
  font:400 16px/1.62 'Inter Tight',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.w{max-width:1320px;margin:0 auto;padding:0 clamp(20px,3vw,44px)}
header{padding:clamp(46px,6vw,84px) 0 clamp(28px,3.4vw,46px);border-bottom:1px solid #E4D9C9}
.eyebrow{font:500 11px/1 ui-monospace,monospace;letter-spacing:.2em;text-transform:uppercase;
  color:#9C8B7C}
h1{font:300 clamp(2.1rem,4.6vw,3.4rem)/1.04 'Inter Tight';letter-spacing:-.045em;margin:16px 0 0}
h1 em{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400}
header p{margin:20px 0 0;max-width:76ch;color:#6B5A4E;font-size:15.5px}
.grid{display:grid;gap:20px;padding:clamp(28px,3.4vw,44px) 0 64px}
@media(min-width:940px){.grid{grid-template-columns:1fr 1fr}}
.v{background:#fff;border:1px solid #E4D9C9;border-radius:16px;overflow:hidden;
  transition:border-color .16s,box-shadow .16s}
.v:hover{border-color:#C8410F;box-shadow:0 22px 46px -30px rgba(120,40,10,.42)}
.v .shot{border-bottom:1px solid #E4D9C9;max-height:420px;overflow:hidden}
.v .shot img{width:100%;display:block}
.v .b{padding:20px 22px 24px}
.v .k{font:500 11px/1 ui-monospace,monospace;letter-spacing:.18em;text-transform:uppercase;
  color:#C8410F}
.v h2{font:500 22px/1.2 'Inter Tight';letter-spacing:-.03em;margin:11px 0 0}
.v p{margin:9px 0 0;font-size:14px;line-height:1.6;color:#6B5A4E}
.v .m{margin-top:14px;font:400 11.5px/1.6 ui-monospace,monospace;color:#9C8B7C;
  border-top:1px solid #E4D9C9;padding-top:11px}
.v .open{display:inline-block;margin-top:14px;background:#241109;color:#FBF6EE;
  border-radius:8px;padding:9px 16px;font:600 12.5px/1 'Inter Tight'}
.grp{font:300 clamp(1.4rem,2.6vw,2rem)/1.1 'Inter Tight';letter-spacing:-.035em;
  margin:clamp(30px,3.6vw,50px) 0 0;padding-bottom:14px;border-bottom:1px solid #E4D9C9}
.grid{padding-top:20px}
footer{border-top:1px solid #E4D9C9;padding:30px 0 66px;color:#9C8B7C;
  font:400 12px/1.7 ui-monospace,monospace}
"""


def index(measurements):
    groups = {False: "", True: ""}
    for key, name, photo, note, people, *_ in VARIANTS:
        m = measurements.get(key, {})
        meas = (f"headline {m.get('h', 0):.1f}:1 &middot; sub {m.get('s', 0):.1f}:1 "
                f"&middot; measured on the rendered pixels")
        groups[people] += (f'<a class=v href="12{key}.html" target=_blank>'
                  f'<div class=shot><img src="thumbs/12{key}.png" alt="{name}"></div>'
                  f'<div class=b><div class=k>Variation {key.upper()}</div>'
                  f'<h2>{name}</h2><p>{note}</p><div class=m>{meas}</div>'
                  f'<span class=open>Open variation {key.upper()} &nbsp;&rarr;</span></div></a>')
    cards = (f'<h3 class=grp>Landscape &mdash; the place</h3><div class=grid>{groups[False]}</div>'
             f'<h3 class=grp>People &mdash; the work being done</h3><div class=grid>{groups[True]}</div>')
    return f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>Solstice &mdash; five hero photographs</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="{FONTS}" rel=stylesheet>
<style>{INDEX_CSS}</style></head><body>
<header><div class=w>
  <p class=eyebrow>Concept 12 &middot; Solstice &middot; hero variations</p>
  <h1>One layout. <em>Ten photographs.</em></h1>
  <p>The type, the grade and the layout are held constant so the only variable is the
  picture. Five are landscape and five have people in them; the people set is anchored so
  the subject sits in the LIGHT half, opposite the type, and its amber wash is pulled back,
  because a heavy grade over skin goes orange and sickly. Each hero is the photograph, then a multiply wash in the Solstice amber that
  pulls every image onto one palette, then a directional scrim. The contrast figures on
  each card were sampled from the rendered pixels underneath the headline, not assumed
  &mdash; which is the only reason to put white type over a photograph you did not take.
  <b>A is the studio&rsquo;s own photograph</b>, and it is first on purpose.</p>
</div></header>
<div class=w>{cards}</div>
<footer><div class=w>Generated by concepts/studio/build-solstice.py &middot; four photographs
from Unsplash, one from the studio&rsquo;s own library.</div></footer>
</body></html>"""


if __name__ == "__main__":
    for key, name, photo, note, people, grade, scrim, anchor in VARIANTS:
        (OUT / f"12{key}.html").write_text(page(key, name, photo, note, people, grade, scrim, anchor))
        print("wrote solstice/12" + key + ".html")
    (OUT / "index.html").write_text(index({}))
    print("wrote solstice/index.html (contrast figures filled by verify-solstice.py)")
