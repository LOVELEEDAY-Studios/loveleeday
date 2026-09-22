"""Give every architecture layer a figure that shows its own mechanic.

The page carried the site's whole technical argument in five identical
text-only blocks, each with an empty left column under the heading. The
HOMEPAGE had a better version of it -- an interactive five-layer panel -- so
the deep page said less than the summary did.

Stock photography would not fix that. Identity resolution, bitemporality and
lineage are mechanics, and a mechanic is shown by demonstrating it, which is
what a technical page at this level is for. So each layer gets a purpose-built
figure rather than five copies of one generic in-arrow-out box:

  01 Identity      three aliases converge on one object, connectors drawing
  02 Lineage       a value, then the trail down to source system and record
  03 Memory        two time axes with a scrubber; the readout changes with it
  04 Verification  a claim at a gate, alternating between passed and refused
  05 Awareness     a value crossing a threshold and the condition firing

All five are inline SVG in the design's own panel idiom -- #fafbfd on
#e5e9ef, 12px radius, the existing blue, and the green and amber the forms
already use -- so nothing new enters the palette. Motion is CSS keyframes
paused until the figure is scrolled into view, and switched off entirely
under prefers-reduced-motion, where each figure holds its resolved final
state so the diagram still reads.
"""

import pathlib
import re

SITE = pathlib.Path("site")

W, H = 480, 200

def wrap(fid, title, body, h=H):
    return (f'<figure class="layer-fig" data-fig="{fid}">'
            f'<svg viewBox="0 0 {W} {h}" role="img" aria-labelledby="fig-{fid}-t">'
            f'<title id="fig-{fid}-t">{title}</title>{body}</svg></figure>')


def chip(x, y, w, h, text, cls="", rx=7, tcls="fig-t"):
    return (f'<g class="{cls}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}"/>'
            f'<text class="{tcls}" x="{x + w/2}" y="{y + h/2 + 3.5}">{text}</text></g>')


# ── 01 Identity ──────────────────────────────────────────────────────────────
# Three aliases on the left, one object on the right, connectors that draw.
ids = [("FES", 22), ("Vendor 44127", 80), ("cus_QxP7m", 138)]
body = ""
for i, (label, y) in enumerate(ids):
    body += chip(8, y, 140, 40, label, cls=f"fig-in d{i}")
    body += (f'<path class="fig-link d{i}" d="M152 {y+20} C 210 {y+20}, 240 100, 294 100"/>')
body += chip(298, 78, 174, 44, "One company object", cls="fig-out", rx=9)
body += '<circle class="fig-pulse" cx="385" cy="100" r="26"/>'
IDENTITY = wrap("identity", "Three different names resolving to one company object", body)

# ── 02 Lineage ───────────────────────────────────────────────────────────────
# The value first, then the trail underneath it, drawn top to bottom.
body = chip(150, 8, 180, 40, "$4,820.00", cls="fig-out d0", rx=9)
rows = [("stripe", "source system"), ("ch_3Q7fK2mB", "source record")]
y = 74
for i, (val, lab) in enumerate(rows):
    body += f'<path class="fig-link vert d{i+1}" d="M240 {y-26} L240 {y-4}"/>'
    body += chip(150, y, 180, 38, val, cls=f"fig-in d{i+1}")
    body += f'<text class="fig-lab d{i+1}" x="338" y="{y+23}" text-anchor="start">{lab}</text>'
    y += 62
body += f'<text class="fig-lab d0" x="142" y="33" text-anchor="end">observation</text>'
LINEAGE = wrap("lineage", "A value traced down to its source system and source record", body, 200)

# ── 03 Memory ────────────────────────────────────────────────────────────────
# Two axes and a sweeping scrubber. The readout swaps as it crosses the change,
# which is the only way to show bitemporality without a paragraph about it.
body = (
    '<text class="fig-axis" x="8" y="42">TRUE IN THE WORLD</text>'
    '<line class="fig-track" x1="8" y1="58" x2="472" y2="58"/>'
    '<rect class="fig-seg a" x="8" y="52" width="216" height="12" rx="6"/>'
    '<rect class="fig-seg b" x="228" y="52" width="244" height="12" rx="6"/>'
    '<text class="fig-lab" x="60" y="82" text-anchor="start">$60.00</text>'
    '<text class="fig-lab" x="280" y="82" text-anchor="start">$72.00</text>'

    '<text class="fig-axis" x="8" y="126">KNOWN TO THE SYSTEM</text>'
    '<line class="fig-track" x1="8" y1="142" x2="472" y2="142"/>'
    '<rect class="fig-seg a" x="8" y="136" width="300" height="12" rx="6"/>'
    '<rect class="fig-seg b" x="312" y="136" width="160" height="12" rx="6"/>'

    '<g class="fig-scrub">'
    '<line x1="0" y1="46" x2="0" y2="70"/>'
    '<line x1="0" y1="130" x2="0" y2="154"/>'
    '<circle cx="0" cy="168" r="4"/></g>'

    '<g class="fig-read"><text class="fig-readout r1" x="8" y="188">'
    'as known at 12 Aug &#183; $60.00</text>'
    '<text class="fig-readout r2" x="8" y="188">as known at 03 Sep &#183; $72.00</text></g>'
)
MEMORY = wrap("memory", "Two time axes: what was true, and when it became known", body, 200)

# ── 04 Verification ──────────────────────────────────────────────────────────
# The gate alternates so both outcomes are visible without interaction.
body = (
    chip(96, 8, 288, 40, "Margin was 41% in August", cls="fig-in d0", rx=9)
    + '<path class="fig-link vert d0" d="M240 52 L240 74"/>'
    + '<g class="fig-gate"><rect x="176" y="78" width="128" height="38" rx="19"/>'
      '<text class="fig-t" x="240" y="101.5">evidence?</text></g>'
    + '<path class="fig-branch pass" d="M212 118 C 196 140, 160 142, 132 150"/>'
    + '<path class="fig-branch fail" d="M268 118 C 284 140, 320 142, 348 150"/>'
    + '<g class="fig-res pass"><rect x="10" y="148" width="180" height="40" rx="9"/>'
      '<text class="fig-t" x="100" y="172.5">Passed &#183; 2 sources</text></g>'
    + '<g class="fig-res fail"><rect x="290" y="148" width="180" height="40" rx="9"/>'
      '<text class="fig-t" x="380" y="172.5">Refused &#183; no lineage</text></g>'
)
VERIFICATION = wrap("verification", "A claim at the evidence gate, passed or refused", body, 200)

# ── 05 Awareness ─────────────────────────────────────────────────────────────
body = (
    '<text class="fig-axis" x="8" y="26">SUPPLIER PRICE &#183; WATCHED</text>'
    '<line class="fig-thresh" x1="8" y1="74" x2="472" y2="74"/>'
    '<text class="fig-lab thr" x="8" y="66" text-anchor="start">threshold</text>'
    '<path class="fig-curve" d="M14 140 C 90 138, 150 128, 208 112 S 320 72, 396 52"/>'
    '<circle class="fig-dot" r="5"/>'
    '<g class="fig-fire"><circle class="ring" cx="396" cy="52" r="10"/>'
    '<rect x="150" y="158" width="180" height="34" rx="17"/>'
    '<text class="fig-t" x="240" y="180">Condition fired</text></g>'
)
AWARENESS = wrap("awareness", "A watched value crossing its threshold and firing a condition", body, 200)

FIGS = {"identity": IDENTITY, "lineage": LINEAGE, "memory": MEMORY,
        "verification": VERIFICATION, "awareness": AWARENESS}

# ── insert, into the empty left column under each heading ────────────────────
page = SITE / "architecture.html"
t = page.read_text()
n = 0
for sid, fig in FIGS.items():
    m = re.search(r'(<section class="detail-section" id="%s"><div class="wrap split"><div>'
                  r'<span class="eyebrow">[^<]*</span><h2>.*?</h2>)(</div>)' % sid, t, re.S)
    if not m:
        raise SystemExit(f"BUILD STOPPED: could not find the heading column of #{sid}")
    if f'data-fig="{sid}"' in t:
        continue
    t = t[:m.end(1)] + fig + t[m.end(1):]
    n += 1
page.write_text(t)
print(f"figures inserted into {n} layer section(s)")
