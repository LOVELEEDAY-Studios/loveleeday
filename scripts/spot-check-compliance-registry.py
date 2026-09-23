"""Spot-checks verified registry items: fetches each source_url and confirms the
page actually contains the item's citation (section number). A verified item
whose source page does not mention its own citation is reported, not trusted.

  python3 scripts/spot-check-compliance-registry.py [N=12] [seed]
"""
import json
import random
import re
import subprocess
import sys
from pathlib import Path

REG = Path(__file__).resolve().parent.parent / "data/compliance/registry/registry.json"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 Chrome/126 Safari/537.36"


def tokens(citation: str):
    # Section-like tokens: "445.72", "1798.82", "38-831.01", "164.308", "899-bb"
    return [t for t in re.findall(r"\d+[\d.\-A-Za-z]*\d|\d+-[a-z]{2}", citation or "") if len(t) >= 3]


def fetch(url: str) -> str:
    r = subprocess.run(["curl", "-sL", "--max-time", "25", "-A", UA, url], capture_output=True)
    raw = r.stdout
    if raw[:4] == b"%PDF":
        p = subprocess.run(["pdftotext", "-q", "-", "-"], input=raw, capture_output=True)
        return p.stdout.decode("utf-8", "ignore")
    return raw.decode("utf-8", "ignore")


def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 12
    seed = int(sys.argv[2]) if len(sys.argv) > 2 else 23
    items = [i for i in json.loads(REG.read_text())["items"] if i.get("verified") and i.get("exists", True)]
    random.Random(seed).shuffle(items)
    ok = bad = unreadable = 0
    for it in items[:n]:
        text = fetch(it["source_url"])
        toks = tokens(it.get("citation", ""))
        if len(text) < 500:
            unreadable += 1
            print(f"UNREADABLE {it['id']}  ({len(text)} bytes)  {it['source_url']}")
            continue
        hit = [t for t in toks if t in text]
        if hit or not toks:
            ok += 1
            print(f"OK         {it['id']}  found {hit or '(no numeric citation)'}")
        else:
            bad += 1
            print(f"MISMATCH   {it['id']}  citation {it.get('citation')!r} not on {it['source_url']}")
    print(f"\n{ok} ok · {bad} mismatch · {unreadable} unreadable (of {min(n, len(items))} sampled)")


if __name__ == "__main__":
    main()
