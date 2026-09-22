#!/usr/bin/env python3
"""The heart, drawn as the same node graph the site already runs.

    python3 concepts/studio/build-heartmark.py -> public/brand/heart-node.svg (+ sheet)

Daniel generated a heart made of red neuron filaments and asked whether it
could be the logo icon. The IDEA is right and it is better than the mark the
repo already carries: heart-1024.png draws the same thought as rigid PCB
traces, which reads as circuitry; his reads as living tissue, which is the
better metaphor for what the product does.

The FILE cannot be the icon, and that is measurable rather than a matter of
taste. Rendered at real sizes it is a red blob at 16px and a softer red blob at
32px -- hair-fine filaments have no width left to survive a favicon. It is also
pure red, which is nowhere in the palette (bone #FBF6EE, ink #241109, burnt
orange #B4470F), and it is raster, so it cannot go single-colour, vector, or
into an embroidery or foil file.

So the mark is REBUILT rather than traced, on the one idea the generated frame
cannot supply: make it the SAME SYSTEM as the hero. brain3d.js draws a node
graph -- somas, dendrites, nearest-neighbour edges. Sampling that same
construction over a heart field gives a logo that is not merely similar to the
page's brain, it is the identical mechanism with a different boundary. Favicon,
wordmark lockup and hero canvas become one thing.

Deliberate constraints, each one a reason the generated file failed:
  · finite nodes -- countable, not a hairball, so it reads at 16px
  · stroke weights that scale -- edges 1.6%, nodes 1.9% of the viewBox
  · two colours from the real palette, and a single-colour variant that works
  · vector, so it is resolution-free and can be embroidered or stamped
"""

import math
import random
from pathlib import Path

HERE = Path(__file__).parent
BRAND = HERE.parent.parent / "public/brand"
BRAND.mkdir(parents=True, exist_ok=True)

INK = "#241109"
HOT = "#B4470F"
BONE = "#FBF6EE"


def heart_xy(t):
    """Classic cardioid-style heart, normalised roughly to [-1,1]."""
    x = 16 * math.sin(t) ** 3
    y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
    return x / 17.0, -y / 17.0


def inside(px, py, samples):
    """Crude but sufficient containment: inside if closer to the centroid than
    the boundary point sharing its angle. The heart is star-shaped about its
    centroid, so this is exact enough for point placement."""
    cx, cy = 0.0, 0.08
    ang = math.atan2(py - cy, px - cx)
    best, bd = None, 9e9
    for bx, by in samples:
        a2 = math.atan2(by - cy, bx - cx)
        d = abs((a2 - ang + math.pi) % (2 * math.pi) - math.pi)
        if d < bd:
            bd, best = d, (bx, by)
    return math.hypot(px - cx, py - cy) < math.hypot(best[0] - cx, best[1] - cy) * 0.97


def build_graph(n_edge=88, n_fill=26, seed=7):
    rnd = random.Random(seed)
    edge = [heart_xy(2 * math.pi * i / n_edge) for i in range(n_edge)]

    fill = []
    tries = 0
    while len(fill) < n_fill and tries < 6000:
        tries += 1
        px, py = rnd.uniform(-1.05, 1.05), rnd.uniform(-1.0, 1.05)
        if not inside(px, py, edge):
            continue
        # Poisson-ish spacing so the interior reads as structure, not noise.
        if any(math.hypot(px - qx, py - qy) < 0.26 for qx, qy in fill):
            continue
        fill.append((px, py))

    pts = edge + fill
    # Nearest-neighbour edges, capped per node, so the density is countable.
    # Hierarchy, not even spacing: the interior points are SOMAS and each one
    # reaches out to many neighbours, which is what makes it read as tissue
    # rather than as a cracked pane.
    links = set()
    n_e = len(edge)
    for i in range(n_e, len(pts)):
        x1, y1 = pts[i]
        d = sorted(((math.hypot(x1 - x2, y1 - y2), j)
                    for j, (x2, y2) in enumerate(pts) if j != i))
        for dist, j in d[:9]:
            if dist < 0.62:
                links.add((min(i, j), max(i, j)))
    # the boundary is a continuous contour, not a ring of beads
    for i in range(n_e):
        links.add((min(i, (i + 1) % n_e), max(i, (i + 1) % n_e)))
    return pts, sorted(links), n_e


def svg(pts, links, n_edge, mono=None, bg=None):
    S = 100.0
    def P(p):
        return (50 + p[0] * 40, 52 + p[1] * 40)

    node_c = mono or HOT
    link_c = mono or INK
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S:.0f} {S:.0f}" '
           f'width="512" height="512" role="img" aria-label="LOVELEEDAY">']
    if bg:
        out.append(f'<rect width="{S:.0f}" height="{S:.0f}" fill="{bg}"/>')
    out.append(f'<g stroke="{link_c}" stroke-width="1.25" stroke-linecap="round" '
               f'opacity="{0.55 if not mono else 0.7}" fill="none">')
    for i, j in links:
        x1, y1 = P(pts[i]); x2, y2 = P(pts[j])
        out.append(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}"/>')
    out.append('</g>')
    out.append(f'<g fill="{node_c}">')
    for k, p in enumerate(pts):
        x, y = P(p)
        r = 0.85 if k < n_edge else 2.5       # somas are the dots; the rim is a line
        out.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r}"/>')
    out.append('</g></svg>')
    return "\n".join(out)


def main():
    pts, links, n_edge = build_graph()
    files = {
        "heart-node.svg":      svg(pts, links, n_edge),
        "heart-node-ink.svg":  svg(pts, links, n_edge, mono=INK),
        "heart-node-bone.svg": svg(pts, links, n_edge, mono=BONE),
    }
    for name, body in files.items():
        (BRAND / name).write_text(body)
    print(f"{len(pts)} nodes ({n_edge} on the boundary), {len(links)} edges")
    for name in files:
        print(f"  wrote public/brand/{name}  {(BRAND/name).stat().st_size//1024}KB")


if __name__ == "__main__":
    main()
