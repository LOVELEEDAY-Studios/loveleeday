#!/usr/bin/env python3
"""
check-portal-comparisons — every client portal must resolve a before/after pair.

The portal page renders its comparison behind `{cmp && ...}`. When the lookup
returns nothing the guard removes the slider and the page renders perfectly:
no error, no empty frame, no gap. The client simply never sees their rebuild
measured against their live site, which is the one thing the portal exists to
show them.

That is exactly what happened. The lookup searched `portfolio`, an alias kept
for Collab, so it only ever saw Collab's six companies. Enable Injections is in
Lightship's study and VentureHue is in its own, so both portals shipped with no
comparison at all and nothing said so. Daniel found it by looking.

This resolves the same join the page does and fails loudly when a portal cannot
find its pair, or when the frames it points at are not on disk.

  python3 scripts/check-portal-comparisons.py
"""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def cases():
    """company name -> (fund key, before path, after path), across ALL funds."""
    src = (ROOT / "src" / "content" / "portfolio.ts").read_text()
    starts = [(m.group(1), m.start()) for m in re.finditer(r"^const (\w+): Portfolio", src, re.M)]
    out = {}
    for i, (fund, pos) in enumerate(starts):
        end = starts[i + 1][1] if i + 1 < len(starts) else len(src)
        block = src[pos:end]
        for m in re.finditer(
            r'company:\s*"([^"]+)".*?before:\s*v\("([^"]+)"\).*?after:\s*v\("([^"]+)"\)',
            block, re.S):
            # setdefault, not assignment: the page uses .find(), which takes the
            # FIRST match, and Novarna is in two studies. Assigning would make
            # the checker name a different study than the page actually renders
            # — a checker that reports a different reality than the code is
            # worse than no checker.
            out.setdefault(m.group(1).lower(), (fund, m.group(2), m.group(3)))
    return out


def portal_clients():
    src = (ROOT / "src" / "content" / "portals.ts").read_text()
    return re.findall(r'client:\s*"([^"]+)"', src)


if __name__ == "__main__":
    by_company = cases()
    clients = portal_clients()
    missing, broken = [], []

    for client in clients:
        hit = by_company.get(client.lower())
        if not hit:
            missing.append(client)
            continue
        fund, before, after = hit
        for p in (before, after):
            f = ROOT / "public" / p.lstrip("/")
            if not f.exists():
                broken.append((client, p))

    print(f"{len(clients)} client portals · {len(by_company)} companies with a before/after pair\n")
    for client in clients:
        hit = by_company.get(client.lower())
        mark = "ok  " if hit and not any(c == client for c, _ in broken) else "FAIL"
        where = f"from the {hit[0]} study" if hit else "NO PAIR FOUND IN ANY STUDY"
        print(f"  {mark}  {client:<22} {where}")

    if missing or broken:
        print()
        for c in missing:
            print(f"  {c} resolves no before/after — its portal renders with NO comparison, silently.")
        for c, p in broken:
            print(f"  {c} points at {p}, which is not on disk.")
        sys.exit(2)
    print("\nevery portal resolves a pair and both frames exist")
