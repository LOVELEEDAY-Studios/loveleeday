#!/usr/bin/env python3
"""The circuit heart, drawn as a circuit rather than traced from a picture of one.

   Daniel picked the Midjourney render on 2026-09-21: a heart made of printed
   circuit traces, with the wordmark laid across its middle, on vermilion. That
   is the design. This is that design, built.

   WHY IT IS REBUILT AND NOT TRACED. The source is 2048px of raster, and looking
   at its ink mask rather than at the thumbnail shows three things that are
   artifacts of the generator, not decisions:

     - the silhouette is not a heart. The left lobe is a clean circle, the right
       lobe is a blob with a bite out of its edge, and the point is a ragged
       triangle. There is no consistent outline to trace.
     - the two halves are OPPOSITE POLARITY. The left is dark traces on a light
       field; the right is light traces on a dark field. The bottom does it
       again. Whatever that is, it is not a decision anyone would defend.
     - the middle band does not exist. The wordmark sits on top of it, so there
       is no heart underneath to extract -- a faithful trace produces a heart
       with a hole through it.

   So the silhouette comes from wordmark.HEART, which is symmetric by
   construction and is already the counter inside the O, and the traces are
   ROUTED inside it the way a real board is routed: segments on 45 degree
   angles only, one track width throughout, round joins, pads at every endpoint
   and via rings at some junctions, and a clearance rule that no two tracks may
   violate. That is what makes it read as a circuit instead of as scribble.

   Density is a parameter because the mark has to survive being a favicon. At
   16px the traces close up into a solid; the small cut routes far fewer, far
   fatter tracks, which is the same thing a type designer does with a text cut.
"""
import math, random
from pathlib import Path

import wordmark as W

# 45-degree routing: the eight directions a track may leave a node on.
DIRS = [(1, 0), (1, 1), (0, 1), (-1, 1), (-1, 0), (-1, -1), (0, -1), (1, -1)]


def heart_polygon(size=100.0, steps=64):
    pts, cur = [], None
    for op in W.HEART:
        if op[0] == "M":
            cur = (op[1][0] * size, op[1][1] * size); pts.append(cur)
        elif op[0] == "C":
            a, b, e = [(p[0] * size, p[1] * size) for p in op[1:]]
            for i in range(1, steps + 1):
                t = i / steps
                pts.append((
                    (1-t)**3*cur[0] + 3*(1-t)**2*t*a[0] + 3*(1-t)*t*t*b[0] + t**3*e[0],
                    (1-t)**3*cur[1] + 3*(1-t)**2*t*a[1] + 3*(1-t)*t*t*b[1] + t**3*e[1]))
            cur = e
    return pts


def inside(poly, x, y):
    c = False
    for i in range(len(poly)):
        (x0, y0), (x1, y1) = poly[i], poly[(i - 1) % len(poly)]
        if ((y0 > y) != (y1 > y)) and x < (x1 - x0) * (y - y0) / (y1 - y0) + x0:
            c = not c
    return c


def edge_distance(poly, x, y):
    best = 1e9
    for i in range(len(poly)):
        (x0, y0), (x1, y1) = poly[i], poly[(i - 1) % len(poly)]
        dx, dy = x1 - x0, y1 - y0
        t = 0 if dx == dy == 0 else max(0, min(1, ((x-x0)*dx + (y-y0)*dy) / (dx*dx + dy*dy)))
        best = min(best, math.hypot(x - (x0 + t*dx), y - (y0 + t*dy)))
    return best


def route(size=100.0, pitch=3.1, track=0.95, seed=7, tracks=64,
          min_len=6, max_len=22, via_rate=0.16, margin=1.15,
          turn=0.11, bundle=(1, 3)):
    """Route tracks on a 45-degree lattice inside the heart.

       Two rules do all the work, and the first draft had neither:

       STRAIGHT RUNS. A track holds its heading and turns rarely. The first
       version turned on a third of all steps, which is a random walk, and it
       looked like one -- worms, not traces. Boards are routed in long runs with
       occasional 45 degree corners because that is what minimises length and
       crosstalk, and the eye knows it even when the viewer could not say why.

       BUNDLES. Tracks leave a pad in groups that run parallel one pitch apart
       and corner together. Parallel bundles are the single most recognisable
       thing about a printed board, and a mark made of lone wandering lines
       reads as decoration instead.

       The occupancy set is the clearance rule: a node a track has used, and its
       immediate neighbours, are closed to everything else. Without it the
       tracks merge and the mark turns to porridge below the size it was drawn
       at."""
    poly = heart_polygon(size)
    rng = random.Random(seed)
    cols = int(size / pitch) + 3
    rows = int(size / (pitch * 0.5)) + 3

    def xy(i, j):
        return (i * pitch + (pitch / 2 if j % 2 else 0), j * pitch * 0.5)

    def ok(i, j):
        x, y = xy(i, j)
        return inside(poly, x, y) and edge_distance(poly, x, y) > track * margin

    free = {(i, j) for i in range(-2, cols) for j in range(-2, rows) if ok(i, j)}
    if not free:
        raise AssertionError("no routable area inside the heart")
    used, paths, pads, vias = set(), [], [], []

    def close(n):
        i, j = n
        used.add(n)
        for d in DIRS:
            used.add((i + d[0], j + d[1]))

    def run(start, d, length):
        """One track: hold the heading, corner at 45 degrees, stop at an
           obstruction rather than pushing through it."""
        node, path = start, [start]
        for _ in range(length):
            if rng.random() < turn:
                d = DIRS[(DIRS.index(d) + rng.choice((-1, 1))) % 8]
            nxt = (node[0] + d[0], node[1] + d[1])
            if nxt not in free or nxt in used:
                for alt in (DIRS[(DIRS.index(d) + k) % 8] for k in (1, -1)):
                    cand = (node[0] + alt[0], node[1] + alt[1])
                    if cand in free and cand not in used:
                        d, nxt = alt, cand
                        break
                else:
                    break
            path.append(nxt); node = nxt
        return path

    seeds = sorted(free, key=lambda n: rng.random())
    for start in seeds:
        if len(paths) >= tracks:
            break
        if start in used:
            continue
        d = rng.choice(DIRS)
        length = rng.randint(min_len, max_len)
        # The bundle runs parallel to the lead track, one lattice step to its
        # side, which on this lattice is the heading rotated by two.
        side = DIRS[(DIRS.index(d) + 2) % 8]
        for k in range(rng.randint(*bundle)):
            s0 = (start[0] + side[0] * k, start[1] + side[1] * k)
            if s0 not in free or s0 in used:
                break
            path = run(s0, d, length)
            if len(path) < 4:
                continue
            for n in path:
                close(n)
            paths.append([xy(*n) for n in path])
            pads.append(xy(*path[0])); pads.append(xy(*path[-1]))
            if rng.random() < via_rate and len(path) > 7:
                vias.append(xy(*path[len(path) // 2]))
            if len(paths) >= tracks:
                break
    return {"paths": paths, "pads": pads, "vias": vias, "track": track, "poly": poly}


def svg_body(r, fill, size=100.0, pad_r=None, via_r=None, via_hole=None,
             outline=0.0):
    """Tracks, pads, vias -- and optionally the board edge.

       The board edge is not in the source image and it is the single change
       that makes this survive being a favicon: without it the silhouette is
       whatever the outermost tracks happen to reach, which is ragged at any
       size and gone at 16px. With it the heart is a heart first and a circuit
       second, which is the correct order for a mark."""
    t = r["track"]
    pad_r = t * 1.05 if pad_r is None else pad_r
    via_r = t * 1.45 if via_r is None else via_r
    via_hole = t * 0.60 if via_hole is None else via_hole
    d = " ".join("M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in p) for p in r["paths"])
    out = [f'<path d="{d}" fill="none" stroke="{fill}" stroke-width="{t:.2f}" '
           f'stroke-linecap="round" stroke-linejoin="round"/>']
    out += [f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{pad_r:.2f}" fill="{fill}"/>'
            for x, y in r["pads"]]
    # A via is a ring, not a dot -- it is the one piece of board vocabulary that
    # tells the eye this is a circuit and not a decorative node graph.
    out += [f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{(via_r+via_hole)/2:.2f}" fill="none" '
            f'stroke="{fill}" stroke-width="{via_r-via_hole:.2f}"/>' for x, y in r["vias"]]
    if outline:
        out.insert(0, f'<path d="{W.heart_path(size/2, size/2, size-outline, size-outline, flip_y=False)}" '
                      f'fill="none" stroke="{fill}" stroke-width="{outline:.2f}" '
                      f'stroke-linejoin="round"/>')
    return "".join(out)


def outline_body(fill, size=100.0, width=0.0):
    d = W.heart_path(size / 2, size / 2, size, size, flip_y=False)
    if width:
        return f'<path d="{d}" fill="none" stroke="{fill}" stroke-width="{width:.2f}"/>'
    return f'<path d="{d}" fill="{fill}"/>'
