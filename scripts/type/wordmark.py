#!/usr/bin/env python3
"""Build the LOVELEEDAY wordmark from real letterform outlines.

   Marks drawn from primitives in code look like they came out of a logo
   generator, because they did. A wordmark is made the other way round: you take
   a typeface a type designer already drew, you space it by eye at display size,
   and you redraw only the one letter that has to carry the idea. Everything
   here is that process, with the eye replaced by a measurement wherever a
   measurement is actually available.

   THE IDEA. The O keeps the typeface's own OUTER contour, so the word still
   reads as the word. Only its COUNTER -- the hole -- is replaced, with a heart.
   The meaning sits inside the letter instead of being bolted onto the side of
   it, which is the whole difference between a wordmark and a font with a piece
   of clipart next to it.

   THREE THINGS THE PREVIOUS DRAFT GOT WRONG, all visible the moment it was
   rendered and looked at rather than described:

     1. The heart was not symmetric. Its control points were written out by
        hand and the left lobe's were not the mirror of the right's, so it
        leaned. A heart that leans reads as a mistake at every size. It is now
        defined once on a unit box and mirrored about x=0.5 by construction, so
        it CANNOT lean -- see HEART below and assert_symmetric().

     2. The tracking was a table of numbers per pair, applied blind. At the
        widths those numbers produced, Sora and Manrope ran their letters into
        each other -- AY overlapped outright. Hand tables are how this is done
        when you have a designer's eye on a proof; with no eye in the loop they
        are just unchecked constants. Spacing is now MEASURED: the facing ink
        profiles of each adjacent pair are sampled across their shared height,
        and the advance is solved so the average gap is constant, with a hard
        floor on the minimum gap that makes a collision impossible.

     3. The O was filled in the accent colour, which turned the letter into a
        badge and made the wordmark impossible to judge. The mark is one colour.
        A two-colour lockup is a separate variant, not the default.
"""
import json, math, sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform

HERE = Path(__file__).parent
WORD = "LOVELEEDAY"

# Spacing targets, as a fraction of cap height. MEAN is the optical colour of
# the word -- how much air it carries; MIN is the safety floor that stops a
# bulging round form touching its neighbour. Display wordmarks are set far
# tighter than the metric spacing a face ships with, because metric spacing is
# built for running text at 16px and is always too loose at 200px.
GAP_MEAN = 0.070
GAP_MIN  = 0.030
SAMPLES  = 220           # scanlines used to measure each facing profile

# The heart, on a unit box: x 0..1 left to right, y 0..1 TOP to BOTTOM, so the
# lobes sit at v=0 and the point at v=1 and the form is written the way it is
# read. The first version was authored y-up and then flipped by the same
# transform that flips the glyphs, which stood it on its head -- a detail that
# is invisible in the path data and obvious the second it is rendered at 250px.
#
# Every x is written as a pair that mirrors about 0.5, which is what makes the
# form symmetric by construction rather than by luck. Plump lobes and a blunt
# point: a narrow heart with a needle tip collapses into a notch the moment it
# is a counter at 16px.
HEART = [
    ("M", (0.500, 1.000)),
    ("C", (0.300, 0.840), (0.000, 0.630), (0.000, 0.365)),
    ("C", (0.000, 0.135), (0.175, 0.000), (0.325, 0.000)),
    ("C", (0.425, 0.000), (0.480, 0.075), (0.500, 0.165)),
    ("C", (0.520, 0.075), (0.575, 0.000), (0.675, 0.000)),
    ("C", (0.825, 0.000), (1.000, 0.135), (1.000, 0.365)),
    ("C", (1.000, 0.630), (0.700, 0.840), (0.500, 1.000)),
    ("Z", ),
]

# The heart's own proportion, width over height. It is FIXED: the heart is the
# same shape in every face and at every size, and only its scale changes.
# Deriving width and height separately from the O's counter, as the first
# version did, quietly drew a different heart in each typeface -- squat in
# Archivo's wide O, stretched into a leaf in Space Grotesk's narrow one.
HEART_ASPECT = 1.06

# Optical breathing room between the heart and the wall of the counter, as a
# fraction of the stem. The ring is already the stem by construction, because
# the heart is fitted to the COUNTER rather than to the letter's outer box;
# this is the bit of air on top of it that stops the two curves reading as
# though they are about to touch.
HEART_INSET = 0.26

def assert_symmetric():
    """The whole point of writing the heart on a unit box is that this can be
       checked. If a future edit breaks the mirror, the build stops here rather
       than shipping a heart that leans."""
    pts = [p for op in HEART if op[0] != "Z" for p in op[1:]]
    for x, y in pts:
        if not any(abs((1 - x) - mx) < 1e-6 and abs(y - my) < 1e-6 for mx, my in pts):
            raise AssertionError(f"heart is not symmetric: ({x}, {y}) has no mirror")


def heart_path(cx, cy, w, h, flip_y=True):
    """Place the unit heart, whose v runs top to bottom.

       Two callers, two coordinate systems, and getting this wrong is invisible
       in the path data: the wordmark draws in font space (y-up) and is then
       negated by the same transform that flips the glyphs, while the emblem
       draws straight into SVG space (y-down). The first version reused one
       branch for both, which stood the emblem's heart on its head -- and a
       heart with its point at the top still looks deliberate enough at a glance
       to survive a description and fail a look."""
    def P(u, v):
        x = cx - w / 2 + u * w
        if flip_y:                       # font space, y-up, negated on the way out
            return f"{x:.2f} {-(cy + h / 2 - v * h):.2f}"
        return f"{x:.2f} {(cy - h / 2 + v * h):.2f}"       # SVG space, y-down
    out = []
    for op in HEART:
        if op[0] == "Z":
            out.append("Z")
        elif op[0] == "M":
            out.append("M" + P(*op[1]))
        else:
            out.append("C" + " ".join(P(*p) for p in op[1:]))
    return " ".join(out)


# ---------------------------------------------------------------------------
# Measured spacing
# ---------------------------------------------------------------------------

def flatten(glyphset, name, steps=16):
    """Glyph outline as a list of closed polylines, in font units, y-up.
       Beziers are flattened because the profile measurement below is a
       scanline intersection and only needs straight segments."""
    rp = RecordingPen()
    glyphset[name].draw(rp)
    polys, cur, pos, start = [], [], (0.0, 0.0), (0.0, 0.0)

    def bez(p0, ctrls, p1, deg):
        for i in range(1, steps + 1):
            t = i / steps
            if deg == 2:
                c = ctrls[0]
                x = (1-t)**2*p0[0] + 2*(1-t)*t*c[0] + t*t*p1[0]
                y = (1-t)**2*p0[1] + 2*(1-t)*t*c[1] + t*t*p1[1]
            else:
                a, b = ctrls
                x = ((1-t)**3*p0[0] + 3*(1-t)**2*t*a[0] + 3*(1-t)*t*t*b[0] + t**3*p1[0])
                y = ((1-t)**3*p0[1] + 3*(1-t)**2*t*a[1] + 3*(1-t)*t*t*b[1] + t**3*p1[1])
            cur.append((x, y))

    for op, args in rp.value:
        if op == "moveTo":
            if len(cur) > 2:
                polys.append(cur)
            cur = [args[0]]
            pos = start = args[0]
        elif op == "lineTo":
            cur.append(args[0]); pos = args[0]
        elif op == "qCurveTo":
            pts = list(args)
            # TrueType implied on-curve points: each consecutive pair of control
            # points has an implied midpoint between them.
            if pts[-1] is None:                      # fully implied contour
                pts = pts[:-1] + [((pts[0][0] + pts[-2][0]) / 2,
                                   (pts[0][1] + pts[-2][1]) / 2)]
            ctrls, end = pts[:-1], pts[-1]
            for i, c in enumerate(ctrls):
                nxt = end if i == len(ctrls) - 1 else ((c[0] + ctrls[i+1][0]) / 2,
                                                      (c[1] + ctrls[i+1][1]) / 2)
                bez(pos, [c], nxt, 2); pos = nxt
        elif op == "curveTo":
            pts = list(args)
            for i in range(0, len(pts) - 1, 2):
                end = pts[i+2] if i + 2 < len(pts) else pts[-1]
                bez(pos, [pts[i], pts[i+1]], end, 3); pos = end
        elif op in ("closePath", "endPath"):
            if len(cur) > 2:
                polys.append(cur)
            cur = []; pos = start
    if len(cur) > 2:
        polys.append(cur)
    return polys


def profile(polys, ys):
    """For each scanline y, the leftmost and rightmost ink. None where the glyph
       has no ink at that height -- which is exactly the information that makes
       L+O and L+T space differently."""
    left, right = [], []
    for y in ys:
        xs = []
        for poly in polys:
            for i in range(len(poly)):
                (x0, y0), (x1, y1) = poly[i], poly[(i + 1) % len(poly)]
                if (y0 <= y < y1) or (y1 <= y < y0):
                    xs.append(x0 + (y - y0) * (x1 - x0) / (y1 - y0))
        left.append(min(xs) if xs else None)
        right.append(max(xs) if xs else None)
    return left, right


def solve_gap(rightL, leftR, mean_target, min_target):
    """Distance to place the right glyph's origin from the left glyph's, so that
       the AVERAGE facing gap hits the target and the MINIMUM never drops below
       the floor. Average sets the colour of the word; the floor is what makes a
       collision impossible rather than unlikely."""
    pairs = [(r, l) for r, l in zip(rightL, leftR) if r is not None and l is not None]
    if not pairs:
        return None                                   # no shared height: fall back to metrics
    raw = [l - r for r, l in pairs]                   # gap at zero offset
    by_mean = mean_target - sum(raw) / len(raw)
    by_min  = min_target - min(raw)
    return max(by_mean, by_min)


def load(face, wght):
    f = TTFont(HERE / (face + ".ttf"))
    if "fvar" in f:
        f = instancer.instantiateVariableFont(f, {"wght": wght}, inplace=False)
    return f


def stem_width(f, gs, cap):
    """The vertical stem of the H, measured off the outline rather than guessed.
       It is the unit the heart counter's ring is sized against, so that the O
       does not read lighter than the letters beside it.

       Sampled at 0.86 of cap, NOT at mid-height: at mid-height the crossbar is
       in the way and the scanline returns the H's full width. That is how the
       first version came back with a "stem" of 1163 units on a 1440 cap, which
       would have sized the heart counter down to nothing."""
    y = cap * 0.86
    xs = []
    for poly in flatten(gs, f.getBestCmap()[ord("H")]):
        for i in range(len(poly)):
            (x0, y0), (x1, y1) = poly[i], poly[(i + 1) % len(poly)]
            if (y0 <= y < y1) or (y1 <= y < y0):
                xs.append(x0 + (y - y0) * (x1 - x0) / (y1 - y0))
    xs.sort()
    if len(xs) < 2:
        raise AssertionError("stem: no ink found on the H scanline")
    w = xs[1] - xs[0]
    if not 0.10 * cap < w < 0.35 * cap:
        raise AssertionError(f"stem {w:.0f} is not a plausible stem on a {cap} cap")
    return w


# LOVELEEDAY has a doubled E in the middle -- an accident of the name, and the
# only thing in the word that is structurally its own. Tying the pair together
# makes the wordmark name-specific rather than a typeface set in caps: the two
# E's share one stem, so their arms run through into a ladder. It is the same
# sentence as the emblem -- separate parts, joined -- said in letterforms.
def build(face, wght=800, heart=True, heart_index=1, ligature=False, word=None):
    f = load(face, wght)
    gs, cmap = f.getGlyphSet(), f.getBestCmap()
    upm = f["head"].unitsPerEm
    cap = getattr(f["OS/2"], "sCapHeight", None) or int(upm * 0.7)
    stem = stem_width(f, gs, cap)
    word = WORD if word is None else word
    # Lowercase is spaced against the x-height, not the cap: the same gap that
    # is right between two capitals is visibly too much air between two round
    # lowercase letters, because there is less letter either side of it.
    lower = word == word.lower()
    ref = (getattr(f["OS/2"], "sxHeight", None) or int(cap * 0.72)) if lower else cap
    ys = [ref * i / (SAMPLES - 1) for i in range(SAMPLES)]

    names = [cmap[ord(c)] for c in word]
    prof = {}
    for n in set(names):
        prof[n] = profile(flatten(gs, n), ys)

    # Place each glyph by the measured gap to its predecessor.
    xs, x = [], 0.0
    for i, n in enumerate(names):
        if i:
            prev = names[i - 1]
            d = solve_gap(prof[prev][1], prof[n][0], GAP_MEAN * ref, GAP_MIN * ref)
            x = xs[-1] + (d if d is not None else f["hmtx"][prev][0])
        xs.append(x)

    if ligature and "EE" in word:
        # The second E's stem lands exactly on the first E's arm terminals, so
        # the two share one vertical and the arms read as rungs between them.
        # Everything downstream shifts by the same amount, which keeps the
        # measured spacing of every OTHER pair untouched.
        a, b = word.index("EE"), word.index("EE") + 1
        bp = BoundsPen(gs); gs[names[a]].draw(bp)
        ex0, ex1 = bp.bounds[0], bp.bounds[2]
        bp2 = BoundsPen(gs); gs[names[b]].draw(bp2)
        target = xs[a] + (ex1 - ex0) - stem - (bp2.bounds[0] - ex0)
        shift = target - xs[b]
        for i in range(b, len(xs)):
            xs[i] += shift

    parts, lsb_first = [], None
    for i, (ch, n) in enumerate(zip(word, names)):
        bp = BoundsPen(gs); gs[n].draw(bp)
        x0, y0, x1, y1 = bp.bounds
        if lsb_first is None:
            lsb_first = x0
        pen = SVGPathPen(gs)
        gs[n].draw(TransformPen(pen, Transform(1, 0, 0, -1, xs[i], 0)))
        d = pen.getCommands()

        if heart and i == heart_index and ch == "O":
            # Keep contour 0 (the outer O); drop the face's own counter; put the
            # heart in its place. fill-rule="evenodd" is what turns the heart
            # into a hole rather than a blob sitting on top of the letter.
            rp = RecordingPen(); gs[n].draw(rp)
            contours, cur = [], []
            for op, args in rp.value:
                cur.append((op, args))
                if op in ("closePath", "endPath"):
                    contours.append(cur); cur = []
            pen = SVGPathPen(gs)
            tp = TransformPen(pen, Transform(1, 0, 0, -1, xs[i], 0))
            for op, args in contours[0]:
                getattr(tp, op)(*args)
            d = pen.getCommands()

            # The box the heart has to live in is the COUNTER, not the letter.
            # Measuring it off the outer contour and subtracting a stem is an
            # approximation that leaves the heart's point almost touching the
            # bottom of a round counter, because a round counter curves away
            # from its own bounding box exactly where the point arrives.
            cpts = [pt for c in contours[1:] for op, args in c
                    for pt in args if isinstance(pt, tuple)]
            if not cpts:
                raise AssertionError(f"{face}: the O has no counter to replace")
            cx0, cx1 = min(q[0] for q in cpts), max(q[0] for q in cpts)
            cy0, cy1 = min(q[1] for q in cpts), max(q[1] for q in cpts)

            # Ring thickness equals the stem, so solve the heart's box from the
            # O's box rather than picking a size that looks about right. The
            # heart is then nudged up by its own overshoot allowance: a pointed
            # form centred by its bounding box always sits low to the eye.
            inset = stem * HEART_INSET
            avail_w, avail_h = (cx1 - cx0) - 2 * inset, (cy1 - cy0) - 2 * inset
            hh = min(avail_h, avail_w / HEART_ASPECT)
            hw = hh * HEART_ASPECT
            ccx = xs[i] + (cx0 + cx1) / 2
            ccy = (cy0 + cy1) / 2 + hh * 0.05
            d += " " + heart_path(ccx, ccy, hw, hh)
            parts.append({"ch": ch, "d": d, "custom": True,
                          "box": [xs[i] + x0, -y1, x1 - x0, y1 - y0]})
        else:
            parts.append({"ch": ch, "d": d, "custom": False,
                          "box": [xs[i] + x0, -y1, x1 - x0, y1 - y0]})

    # Trim to the ink, so the SVG's own box is the wordmark's box and callers
    # can set it flush against a rule without eyeballing a padding value.
    last = names[-1]
    bp = BoundsPen(gs); gs[last].draw(bp)
    width = xs[-1] + bp.bounds[2] - lsb_first
    # The drawn box, which for a lowercase word with an ascender and a descender
    # is NOT the cap box. Emitting a cap-height viewBox clipped the y.
    tops, bots = [], []
    for i, n in enumerate(names):
        b = BoundsPen(gs); gs[n].draw(b)
        tops.append(-b.bounds[3]); bots.append(-b.bounds[1])
    ink_top, ink_bot = min(tops), max(bots)
    for p in parts:
        p["d"] = p["d"]

    return {"face": face, "wght": wght, "upm": upm, "cap": cap, "ref": ref,
            "word": word, "stem": round(stem, 1),
            "x0": lsb_first, "width": width, "parts": parts,
            "ink_top": ink_top, "ink_bot": ink_bot,
            "gaps": [round(xs[i] - xs[i - 1], 1) for i in range(1, len(xs))]}


def svg(wm, fill="#16243A", heart_fill=None, height=120, pad=0.0):
    """One <svg> for the whole wordmark. The viewBox is the ink box, in font
       units, y-flipped -- so the caller only ever sets a height."""
    cap, x0, w = wm["cap"], wm["x0"], wm["width"]
    top, bot = wm["ink_top"], wm["ink_bot"]
    vb = f"{x0 - pad:.1f} {top - pad:.1f} {w + 2 * pad:.1f} {bot - top + 2 * pad:.1f}"
    body = []
    for p in wm["parts"]:
        c = heart_fill if (p["custom"] and heart_fill) else fill
        body.append(f'<path d="{p["d"]}" fill="{c}" fill-rule="evenodd"/>')
    return (f'<svg viewBox="{vb}" height="{height}" xmlns="http://www.w3.org/2000/svg" '
            f'role="img" aria-label="LOVELEEDAY">{"".join(body)}</svg>')


if __name__ == "__main__":
    assert_symmetric()
    out = {}
    for face in ["Manrope", "Archivo", "SpaceGrotesk"]:
        for wght in (700, 800):
            wm = build(face, wght)
            out[f"{face}-{wght}"] = wm
            print(f"{face}-{wght:<5} cap={wm['cap']:<5} stem={wm['stem']:<6} "
                  f"width={wm['width']:.0f}  gaps={wm['gaps']}")
    (HERE / "wordmarks.json").write_text(json.dumps(out))
