#!/usr/bin/env python3
"""Six treatments of the 3D brain, for approval.

    python3 concepts/studio/build-brains.py -> concepts/brains.html

Daniel: "redesign the brain, it is off centered and looks weird and it is not
doing what i asked you to do, which was i wanted a 3d brain that could spin and
sparked with questions and answered model. then generate 5 concepts."

All six are the same volume, the same rotation and the same four-beat model
(ASK -> SPARK -> QUESTION -> ANSWER). What differs is the material: whether the
structure is carried by edges or by nodes, how far the fog reaches, how much
the sparks bloom, and the key colour. That is the decision being asked for --
not five different brains, five ways of rendering one.
"""
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / "concepts"
BRAIN = (HERE / "brain3d.js").read_text()

TREATMENTS = [
    ("filament", "Filament",
     "Structure carried by the edges. Fine lines, a cool cast, low bloom. The "
     "brain reads as wiring — closest to a schematic, furthest from an organism."),
    ("synapse", "Synapse",
     "Structure carried by the nodes. Edges nearly vanish, points are bright and "
     "large, sparks bloom hard. The most biological of the five."),
    ("core", "Core",
     "Warm, dense, heavy fog. The far hemisphere sinks into the ground and the "
     "near one holds the light. Amber rather than teal, so it sits inside the "
     "Bloomberg palette rather than beside it."),
    ("lattice", "Lattice",
     "High edge contrast, small hard nodes, almost no bloom, shallow fog. An "
     "engineered object under even light. The Palantir end of the range."),
    ("profile", "Profile",
     "The one that stays a brain. Instead of turning through a full circle it "
     "rocks 35 degrees either side of the side view, so the anatomical outline "
     "\u2014 frontal lobe, occipital, cerebellum, stem \u2014 never leaves the frame. "
     "A full rotation is more impressive for two seconds and less legible for "
     "the other six."),
    ("signal", "Signal",
     "Almost everything held back. The resting brain is barely present; only the "
     "path the question actually travels is lit. The most restrained and the "
     "most dramatic when it fires."),
]

CSS = """
*{box-sizing:border-box}
body{margin:0;background:#070709;color:#F2F2EF;
  font:400 16px/1.6 'Inter Tight',system-ui,-apple-system,sans-serif;
  -webkit-font-smoothing:antialiased}
.w{max-width:1280px;margin:0 auto;padding:0 clamp(18px,3vw,40px)}
.lab{display:block;font:400 10.5px/1 ui-monospace,SFMono-Regular,Menlo,monospace;
  letter-spacing:.17em;text-transform:uppercase;color:#B9B9B9}
h1{margin:14px 0 0;font:400 clamp(1.9rem,4vw,3rem)/1.05 inherit;letter-spacing:-.035em}
h2{margin:0;font:400 clamp(1.3rem,2.2vw,1.9rem)/1.1 inherit;letter-spacing:-.03em}
p{margin:0}
.intro{padding:clamp(40px,6vw,86px) 0 clamp(20px,3vw,36px)}
.intro p{margin-top:18px;max-width:64ch;color:#A9A9A6;font-size:16.5px}
.item{border-top:1px solid rgba(255,255,255,.13);padding:clamp(28px,4vw,52px) 0}
.head{display:flex;gap:18px;align-items:baseline;flex-wrap:wrap}
.head .n{font:400 12px/1 ui-monospace,monospace;color:#B9B9B9}
.desc{margin-top:12px;max-width:72ch;color:#A9A9A6;font-size:15px;line-height:1.62}
.stage{margin-top:22px;border:1px solid rgba(255,255,255,.13);border-radius:4px;
  background:#050507;height:clamp(380px,50vw,600px);overflow:hidden}
.stage canvas{width:100%;height:100%;display:block}
.core .stage{background:#0B0704}
.signal .stage{background:#030304}
.lattice .stage{background:#08080B}
.meta{margin-top:12px;display:flex;gap:22px;flex-wrap:wrap;
  font:400 11px/1.6 ui-monospace,monospace;color:#8C8C89}
footer{border-top:1px solid rgba(255,255,255,.13);padding:34px 0 60px;
  color:#8C8C89;font:400 12px/1.7 ui-monospace,monospace}
"""


def page():
    items = ""
    for i, (slug, name, desc) in enumerate(TREATMENTS):
        items += f"""
<section class="item {slug}"><div class=w>
  <div class=head><span class=n>0{i+1}</span><h2>{name}</h2></div>
  <p class=desc>{desc}</p>
  <div class=stage><canvas data-style="{slug}"></canvas></div>
  <div class=meta><span>460 nodes · 3 nearest neighbours</span>
    <span>rotation 0.17 rad/s \u00b7 Profile rocks \u00b135\u00b0</span><span>depth-sorted every frame</span>
    <span>ask → spark → question → answer, 8.4s</span></div>
</div></section>"""
    return f"""<!DOCTYPE html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>Brain &mdash; five treatments</title>
<link rel=preconnect href="https://fonts.googleapis.com">
<link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500&display=swap"
  rel=stylesheet>
<style>{CSS}</style>
<script>{BRAIN}</script>
</head><body>
<header class=intro><div class=w>
  <span class=lab>Arthur &middot; cognition</span>
  <h1>Six ways to render one brain.</h1>
  <p>A volume of 460 nodes in three dimensions, turning on its vertical axis,
  depth-sorted every frame so the near hemisphere occludes the far one. All six
  run the same four beats &mdash; a question lands on the frontal lobe, the signal
  propagates breadth-first along real edges with sparks riding them, the
  sub-questions it must answer first surface at the nodes they fired from, and
  they resolve into one answer with its evidence. What differs is the material.</p>
</div></header>
{items}
<footer><div class=w>Seven ellipsoids summed as a metaball field, sampled by
rejection and relaxed apart. The longitudinal fissure is carved by rejecting
material on the midline above the temporal lobes. No 3D library.</div></footer>
<script>
document.querySelectorAll('canvas[data-style]').forEach(function(c){{
  Brain3D.mount(c, {{ style: c.dataset.style }});
}});
</script>
</body></html>"""


if __name__ == "__main__":
    (OUT / "brains.html").write_text(page())
    print("wrote concepts/brains.html")
