#!/usr/bin/env python3
"""The emblem: the heart, as connected systems.

   Daniel's brief for the mark is one sentence and it is a good one -- "the
   heart is systems connected". The trap in it is that a heart is read from its
   SILHOUETTE, two lobes and a point, and every node, channel and gap you add to
   say "systems" is an attack on that silhouette. Twenty-four Midjourney
   renderings of a heart drawn as a network graph, looked at on 2026-09-21,
   all failed in exactly that way: they read as a tangle at 200px and as a
   smudge at 16px, because the connections were drawn ON TOP OF the shape
   instead of being cut OUT OF it.

   So the construction here is the other way round. The silhouette comes first
   and is never negotiable: it is the SAME heart as the one inside the O of the
   wordmark, imported from wordmark.py, so the emblem and the wordmark are one
   drawing rather than two things that happen to both be hearts. The systems are
   then subtracted from it -- channels between modules, so the shape is
   ASSEMBLED from parts and still solid at the edge.

   Two constructions are built, and both are rendered at 16px by the same code
   that renders them at 512px, because that is the only test that matters:

     MODULE  the heart divided by a square grid into cells with hairline
             channels -- the silhouette is untouched, the systems are the joins
     LATTICE nodes on a triangular lattice with edges between neighbours,
             clipped to the heart -- more literal, and the one that has to prove
             it survives being shrunk
"""
import math
from pathlib import Path

import wordmark as W

HERE = Path(__file__).parent
INK, GROUND, PAPER, TEAL = "#16243A", "#FBF8F2", "#FFFFFF", "#0E7C7B"


def heart_d(size=100.0, pad=0.0):
    """The wordmark's heart, as an SVG path on a `size` box. One geometry, two
       uses -- change it in wordmark.py and the emblem changes with it."""
    w = h = size - 2 * pad
    return W.heart_path(pad + w / 2, pad + h / 2, w, h, flip_y=False)


def heart_polygon(size=100.0, pad=0.0, steps=48):
    """The same heart, flattened to a polygon, for the point-in-shape tests the
       lattice needs."""
    pts, cur = [], None
    for op in W.HEART:
        if op[0] == "M":
            cur = (pad + op[1][0] * (size - 2 * pad), pad + op[1][1] * (size - 2 * pad))
            pts.append(cur)
        elif op[0] == "C":
            a, b, e = [(pad + p[0] * (size - 2 * pad), pad + p[1] * (size - 2 * pad)) for p in op[1:]]
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


def depth(poly, x, y):
    """Distance from (x, y) to the nearest edge of the heart. The lattice uses
       it to drop nodes that sit so close to the silhouette that their circle
       would bite a notch out of it."""
    best = 1e9
    for i in range(len(poly)):
        (x0, y0), (x1, y1) = poly[i], poly[(i - 1) % len(poly)]
        dx, dy = x1 - x0, y1 - y0
        t = 0 if dx == dy == 0 else max(0, min(1, ((x-x0)*dx + (y-y0)*dy) / (dx*dx + dy*dy)))
        best = min(best, math.hypot(x - (x0 + t*dx), y - (y0 + t*dy)))
    return best


# ---------------------------------------------------------------------------

def module(size=100.0, n=7, channel=0.085, radius=0.22, fill=INK, uid="m"):
    """The heart, divided into a grid of `n` cells across, with channels cut
       between them. The channels are drawn as a clip, so the OUTER edge of the
       heart is the heart's own curve -- untouched, at every size."""
    step = size / n
    gap = step * channel
    cells = []
    for r in range(n):
        for c in range(n):
            x, y = c * step, r * step
            cells.append(f'<rect x="{x + gap/2:.2f}" y="{y + gap/2:.2f}" '
                         f'width="{step - gap:.2f}" height="{step - gap:.2f}" '
                         f'rx="{step * radius:.2f}"/>')
    return (f'<defs><clipPath id="{uid}"><path d="{heart_d(size)}"/></clipPath></defs>'
            f'<g clip-path="url(#{uid})" fill="{fill}">{"".join(cells)}</g>')


def lattice(size=100.0, rows=7, node=0.052, edge=0.040, fill=INK):
    """Nodes on a triangular lattice inside the heart, joined to their
       neighbours. Nothing is clipped: every node is placed far enough inside
       the silhouette that the union of nodes and edges IS a heart. Clipping
       would have been easier and would have sheared half the nodes in half at
       the edge, which is what makes generated network-logos look chewed."""
    poly = heart_polygon(size)
    step = size / rows
    r_node, w_edge = size * node, size * edge
    margin = r_node * 1.25

    pts = []
    for j in range(-1, rows + 2):
        y = j * step * 0.866
        for i in range(-1, rows + 2):
            x = i * step + (step / 2 if j % 2 else 0)
            if inside(poly, x, y) and depth(poly, x, y) > margin:
                pts.append((x, y))

    edges, lim = [], step * 1.08
    for i, a in enumerate(pts):
        for b in pts[i+1:]:
            if math.dist(a, b) <= lim:
                edges.append(f'<line x1="{a[0]:.2f}" y1="{a[1]:.2f}" '
                             f'x2="{b[0]:.2f}" y2="{b[1]:.2f}"/>')
    nodes = [f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r_node:.2f}"/>' for x, y in pts]
    return (f'<g stroke="{fill}" stroke-width="{w_edge:.2f}" stroke-linecap="round">'
            f'{"".join(edges)}</g><g fill="{fill}">{"".join(nodes)}</g>'), len(pts)


def solid(size=100.0, fill=INK):
    return f'<path d="{heart_d(size)}" fill="{fill}"/>'


def wrap(body, size=100.0, px=None, bg=None):
    h = f' height="{px}"' if px else ""
    b = f'<rect width="{size}" height="{size}" fill="{bg}"/>' if bg else ""
    return (f'<svg viewBox="0 0 {size} {size}"{h} xmlns="http://www.w3.org/2000/svg" '
            f'role="img" aria-label="LOVELEEDAY">{b}{body}</svg>')
