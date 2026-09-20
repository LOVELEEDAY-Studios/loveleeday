#!/usr/bin/env python3
"""
rna-duplex — bake the Novarna hero molecule from a real crystal structure.

The hero on concepts/novarna/index.html used to draw an idealised A-form helix:
three beads per nucleotide on a perfect mathematical spiral. It was geometrically
defensible and it still read as a textbook ladder, because the things that make a
molecular render look like chemistry are exactly the things an idealisation throws
away -- the flat fused rings of the bases stacked face to face, the zig-zag of the
phosphodiester backbone, two hydrogen bonds across an A-U pair and three across
G-C, and the small irregularities of a structure that was measured rather than
computed.

So this stops generating a helix and starts using one. Source:

  PDB 1QC0 -- "Crystal structure of a 19 base pair copy control related RNA
  duplex", 1.55 A. Chains C and D are the full 19-mer A-form duplex.
  https://www.rcsb.org/structure/1QC0

Output is public/portal/novarna/duplex.json: heavy atoms with their element,
covalent bonds found by distance, and the base-pair hydrogen bonds, with the
helix axis rotated onto +Y and the whole thing centred on the origin. The page
ships the coordinates and does its own shading -- no structure viewer, no
three.js, ~40 KB of JSON that gzips to a few.

  python3 scripts/rna-duplex.py [--bp 13] [--pdb 1QC0]
"""
import json, math, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PDB_ID = "1QC0"
CHAINS = ("C", "D")
BP = 13          # base pairs kept, centred -- the hero crops the rest anyway

# Covalent bonds in a refined nucleic acid structure are 1.3-1.65 A (P-O is the
# longest at ~1.60). The next shortest non-bonded heavy-atom contact inside a
# residue is ~2.2 A, so a 1.95 cut separates them with room to spare.
COVALENT = 1.95
# A Watson-Crick pair is not a distance, it is a named set of contacts. Finding
# pairs by proximity alone and a 3.3 A window also returns the next-nearest
# atoms across the same interface and the stacking neighbour above it -- which
# renders as five rungs on a G-C and rungs between residues that are not paired
# at all. So proximity only IDENTIFIES the partner (purine N1 to pyrimidine N3),
# and the bonds drawn are the canonical ones. A G-C then has exactly three and
# an A-U exactly two, which is the difference a reader actually recognises.
PAIR_N1N3 = 3.30
WC = {
    ("G", "C"): [("N1", "N3"), ("N2", "O2"), ("O6", "N4")],
    ("A", "U"): [("N1", "N3"), ("N6", "O4")],
}
PURINE = ("A", "G")


def fetch(pdb_id):
    cache = Path(f"/tmp/{pdb_id}.pdb")
    if not cache.exists():
        url = f"https://files.rcsb.org/download/{pdb_id}.pdb"
        cache.write_bytes(urllib.request.urlopen(url, timeout=30).read())
    return cache.read_text().splitlines()


def parse(lines):
    atoms = []
    for l in lines:
        if not l.startswith("ATOM") or l[21] not in CHAINS:
            continue
        if l[16] not in " A":                       # single conformer only
            continue
        name = l[12:16].strip()
        if name.startswith("H") or l[76:78].strip() == "H":
            continue                                 # heavy atoms only
        atoms.append({
            "name": name,
            "res": l[17:20].strip(),
            "chain": l[21],
            "seq": int(l[22:26]),
            "el": (l[76:78].strip() or name[0]).upper(),
            "xyz": [float(l[30:38]), float(l[38:46]), float(l[46:54])],
        })
    return atoms


def principal_axis(pts):
    """Helix axis of a straight duplex = first principal component of its
       phosphorus positions. Power iteration on the covariance matrix; three
       lines of numpy that aren't worth a numpy dependency."""
    n = len(pts)
    c = [sum(p[i] for p in pts) / n for i in range(3)]
    cov = [[sum((p[i] - c[i]) * (p[j] - c[j]) for p in pts) / n
            for j in range(3)] for i in range(3)]
    v = [1.0, 1.0, 1.0]
    for _ in range(200):
        v = [sum(cov[i][j] * v[j] for j in range(3)) for i in range(3)]
        m = math.sqrt(sum(x * x for x in v)) or 1.0
        v = [x / m for x in v]
    return c, v


def basis_from(axis):
    """An orthonormal frame whose +Y is the helix axis."""
    up = axis
    seed = [1.0, 0.0, 0.0] if abs(up[0]) < 0.9 else [0.0, 0.0, 1.0]
    x = cross(seed, up); x = norm(x)
    z = norm(cross(x, up))
    return x, up, z


def cross(a, b):
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]


def norm(v):
    m = math.sqrt(sum(x * x for x in v)) or 1.0
    return [x / m for x in v]


def main():
    argv = sys.argv[1:]
    bp = int(argv[argv.index("--bp") + 1]) if "--bp" in argv else BP
    pdb_id = argv[argv.index("--pdb") + 1] if "--pdb" in argv else PDB_ID

    atoms = parse(fetch(pdb_id))
    phos = [a["xyz"] for a in atoms if a["name"] == "P"]
    centre, axis = principal_axis(phos)
    ex, ey, ez = basis_from(axis)

    for a in atoms:
        d = [a["xyz"][i] - centre[i] for i in range(3)]
        a["xyz"] = [sum(d[i] * ex[i] for i in range(3)),
                    sum(d[i] * ey[i] for i in range(3)),
                    sum(d[i] * ez[i] for i in range(3))]

    # Pair the strands first, then crop, so the crop is a whole number of base
    # pairs with two intact ends. Cropping residues by height and pairing
    # afterwards leaves unpaired terminal nucleotides sticking off the top, and
    # a frayed end reads as a bug rather than as a crystal.
    res = {}
    for a in atoms:
        res.setdefault((a["chain"], a["seq"]), []).append(a)
    height = {k: sum(a["xyz"][1] for a in v) / len(v) for k, v in res.items()}
    named = {k: {a["name"]: a for a in v} for k, v in res.items()}

    def resname(k):
        return res[k][0]["res"]

    pairs = []
    for k in res:
        if k[0] != CHAINS[0]:
            continue
        for j in res:
            if j[0] != CHAINS[1]:
                continue
            pu, py = (k, j) if resname(k) in PURINE else (j, k)
            if resname(pu) not in PURINE or resname(py) in PURINE:
                continue
            a, b = named[pu].get("N1"), named[py].get("N3")
            if a and b and math.dist(a["xyz"], b["xyz"]) < PAIR_N1N3:
                pairs.append((k, j, pu, py))
    pairs.sort(key=lambda p: (height[p[0]] + height[p[1]]) / 2)
    if len(pairs) > bp:                       # keep the middle, drop the ends
        off = (len(pairs) - bp) // 2
        pairs = pairs[off:off + bp]
    keep = {p[0] for p in pairs} | {p[1] for p in pairs}
    atoms = [a for a in atoms if (a["chain"], a["seq"]) in keep]

    # Re-centre on what survived, so the crop is centred and not the original.
    mid = [sum(a["xyz"][i] for a in atoms) / len(atoms) for i in range(3)]
    for a in atoms:
        a["xyz"] = [a["xyz"][i] - mid[i] for i in range(3)]

    # Residue index per atom, and the pair list in axial order. The hero
    # resolves the molecule one nucleotide at a time and tints a run of pairs as
    # the designed region, and both need to know which atoms belong together.
    order = [p[0] for p in pairs] + [p[1] for p in pairs]
    rank = {k: n for n, k in enumerate(order)}
    for a in atoms:
        a["ri"] = rank[(a["chain"], a["seq"])]
    pair_ix = [[rank[p[0]], rank[p[1]]] for p in pairs]

    idx = {(a["chain"], a["seq"], a["name"]): i for i, a in enumerate(atoms)}
    bonds = []
    for i, a in enumerate(atoms):
        for j in range(i + 1, len(atoms)):
            b = atoms[j]
            if a["chain"] != b["chain"] or abs(a["seq"] - b["seq"]) > 1:
                continue
            if math.dist(a["xyz"], b["xyz"]) < COVALENT:
                bonds.append([i, j])

    hbonds = []
    for k, j, pu, py in pairs:
        for na, nb in WC[(resname(pu), resname(py))]:
            ia = idx.get((pu[0], pu[1], na))
            ib = idx.get((py[0], py[1], nb))
            if ia is not None and ib is not None:
                hbonds.append([ia, ib])

    # Base ring atoms get flagged so the renderer can draw the stacked slabs that
    # are the whole reason a duplex looks like a duplex and not like a rope.
    def kind(a):
        n = a["name"]
        if n == "P" or n.startswith("OP") or n in ("O1P", "O2P"):
            return "p"                                # phosphate
        if n.endswith("'"):
            return "s"                                # ribose
        return "b"                                    # base

    out = {
        "source": {
            "pdb": pdb_id,
            "chains": list(CHAINS),
            "title": "19 base pair copy control related RNA duplex, 1.55 A",
            "url": f"https://www.rcsb.org/structure/{pdb_id}",
        },
        "bp": bp,
        "seq": ["".join(res[k][0]["res"] for k in
                sorted((r for r in keep if r[0] == c), key=lambda k: height[k]))
                for c in CHAINS],
        "pairs": len(pairs),
        "atoms": [[round(a["xyz"][0], 2), round(a["xyz"][1], 2), round(a["xyz"][2], 2),
                   a["el"], kind(a), a["ri"]] for a in atoms],
        "residues": len(order),
        "pairIndex": pair_ix,
        "base": [res[k][0]["res"] for k in order],
        "bonds": bonds,
        "hbonds": hbonds,
    }
    dest = ROOT / "public/portal/novarna/duplex.json"
    dest.write_text(json.dumps(out, separators=(",", ":")))
    span = max(a["xyz"][1] for a in atoms) - min(a["xyz"][1] for a in atoms)
    rad = max(math.hypot(a["xyz"][0], a["xyz"][2]) for a in atoms)
    print(f"{dest.relative_to(ROOT)}  {dest.stat().st_size/1024:.1f} KB")
    print(f"  {len(atoms)} atoms · {len(bonds)} bonds · {len(hbonds)} H-bonds · {bp} bp")
    print(f"  axial span {span:.1f} A · max radius {rad:.1f} A")
    print(f"  seq {out['seq'][0]} / {out['seq'][1]}")


if __name__ == "__main__":
    main()
