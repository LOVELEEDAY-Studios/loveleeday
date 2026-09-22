#!/usr/bin/env python3
"""
check-cross-client — no client's page may name another client.

Daniel, 2026-09-22, on the 100KM page: "why would we tell and say in your
portfolio and in collab capitals thats irrelevant to them they dont care about
that."

Four lines on the 100KM VC study named Collab Capital. Each one was factually
true and each one was the wrong thing to say. Two separate harms:

  1. It tells the reader they are getting a hand-me-down. "This rebuild already
     existed, it was built for that study and is shown here unchanged" is a
     sentence that makes a bespoke piece of work read as a template.
  2. It tells the reader we discuss our other clients' portfolios with third
     parties. Whatever we say about Collab to 100KM, 100KM assumes we say about
     them to somebody else. That is the whole trust of the artifact, spent on a
     sourcing footnote nobody asked for.

A shared portfolio company is a real situation — Novarna is in both — and the
honest handling is to write each study as if the other does not exist, because
from the reader's side it does not. Provenance belongs in git, not on the page.

Naming a client on THEIR OWN page is correct and expected, so the check is
scoped per fund object and per portal: a page may say its own name and no other
client's.

  python3 scripts/check-cross-client.py          # exit 2 if any page names another client
"""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Every client name that must not appear on another client's page, plus the
# aliases each one is actually written as in prose.
CLIENTS = {
    "collab": ["Collab Capital", "Collab study", "Collab's", "collab.capital"],
    "lightship": ["Lightship Capital", "Lightship", "lightship.capital"],
    "hundredkm": ["100KM VC", "100KM", "100kmvc.com"],
    "venturehue": ["VentureHue", "venturehue.com"],
}


def fund_blocks(src):
    """(key, text) for each `const <key>: Portfolio = {...}` block."""
    starts = [(m.group(1), m.start()) for m in re.finditer(r"^const (\w+): Portfolio", src, re.M)]
    for i, (key, pos) in enumerate(starts):
        end = starts[i + 1][1] if i + 1 < len(starts) else len(src)
        yield key, src[pos:end], pos


def quoted_strings(block):
    """Only the CLIENT-FACING strings. A code comment naming another client is
    fine and is how the reasoning gets recorded; a rendered string is not."""
    for m in re.finditer(r'"((?:[^"\\]|\\.)*)"', block):
        # Skip anything inside a /* */ or // comment by checking the line start.
        line_start = block.rfind("\n", 0, m.start()) + 1
        before = block[line_start:m.start()]
        if before.lstrip().startswith(("*", "//", "/*")):
            continue
        yield m.group(1), block[:m.start()].count("\n")


if __name__ == "__main__":
    src = (ROOT / "src" / "content" / "portfolio.ts").read_text()
    base_line = 0
    problems = []

    for key, block, pos in fund_blocks(src):
        block_line = src[:pos].count("\n")
        others = {k: v for k, v in CLIENTS.items() if k != key}
        for text, rel_line in quoted_strings(block):
            for other_key, aliases in others.items():
                for alias in aliases:
                    if alias in text:
                        problems.append((block_line + rel_line + 1, key, other_key, alias, text))

    if not problems:
        n = sum(1 for _ in fund_blocks(src))
        print(f"{n} fund studies checked — no page names another client")
        sys.exit(0)

    print(f"{len(problems)} cross-client reference(s) — a client's page naming another client:\n")
    for line, page, other, alias, text in problems:
        print(f"  portfolio.ts:{line}")
        print(f"    on the {page} page, naming {other} as \"{alias}\"")
        print(f"    {text[:140]}")
        print()
    print("Write each study as if the others do not exist. Provenance belongs in git.")
    sys.exit(2)
