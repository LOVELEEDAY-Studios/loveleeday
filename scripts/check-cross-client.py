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


# A company study may name ITS OWN investor — LoanWell quoting its CEO on Collab,
# Soarce's footer saying "Collab Capital portfolio company" — because that is the
# company's own relationship. It may not name a fund it has nothing to do with.
# Novarna is deliberately in two lists: it is in both portfolios, so both are its
# own. Derived from portfolio.ts rather than typed, so adding a case updates it.
def studies_by_fund(portfolio_src):
    """company NAME -> the funds that hold it.

    Keyed on `company:`, not on `slug:`. The first cut used slug and every
    portal came back owned by nobody, because portals.ts gives EVERY portal
    slug "marketing-site" — identity lives in its `client:` field. The guard
    then reported 9 violations that were all a company naming its own investor,
    which is the behavior it exists to permit. A guard that fails by crying
    wolf gets switched off, so it is as broken as one that fails by permitting.
    """
    owners = {}
    for key, block, _ in fund_blocks(portfolio_src):
        for company in re.findall(r'company:\s*"([^"]+)"', block):
            owners.setdefault(company, set()).add(key)
    return owners


if __name__ == "__main__":
    src = (ROOT / "src" / "content" / "portfolio.ts").read_text()
    problems = []
    checked_strings = 0
    checked_files = []

    # --- 1. The fund pages. A fund page may name only itself. ---
    for key, block, pos in fund_blocks(src):
        block_line = src[:pos].count("\n")
        others = {k: v for k, v in CLIENTS.items() if k != key}
        for text, rel_line in quoted_strings(block):
            checked_strings += 1
            for other_key, aliases in others.items():
                for alias in aliases:
                    if alias in text:
                        problems.append(("portfolio.ts", block_line + rel_line + 1,
                                         f"the {key} fund page", other_key, alias, text))
    checked_files.append("src/content/portfolio.ts")

    # --- 2. portals.ts. Each portal's copy is keyed by its own slug. ---
    owners = studies_by_fund(src)
    portals = (ROOT / "src" / "content" / "portals.ts").read_text()
    # Portal blocks are delimited the same way the studies are: by their slug.
    slug_pos = [(m.group(1), m.start()) for m in re.finditer(r'client:\s*"([^"]+)"', portals)]
    for i, (slug, pos) in enumerate(slug_pos):
        end = slug_pos[i + 1][1] if i + 1 < len(slug_pos) else len(portals)
        block = portals[pos:end]
        block_line = portals[:pos].count("\n")
        allowed = owners.get(slug, set())
        for text, rel_line in quoted_strings(block):
            checked_strings += 1
            for other_key, aliases in CLIENTS.items():
                if other_key in allowed:
                    continue
                for alias in aliases:
                    if alias in text:
                        problems.append(("portals.ts", block_line + rel_line + 1,
                                         f"the {slug} portal", other_key, alias, text))
    checked_files.append("src/content/portals.ts")

    # --- 3. The rendered study pages. Same rule, read as raw text. ---
    # The study folders are named by slug (enable, novarna); owners is keyed by
    # company name. Map one to the other off portfolio.ts rather than guessing.
    slug_to_company = dict(re.findall(r'slug:\s*"([^"]+)",\s*\n\s*company:\s*"([^"]+)"', src))
    for page in sorted((ROOT / "public" / "portal").glob("*/index.html")):
        slug = page.parent.name
        allowed = owners.get(slug_to_company.get(slug, slug), set())
        body = page.read_text()
        # Strip <style> and HTML comments: the reasoning lives there on purpose.
        body = re.sub(r"<style.*?</style>|<!--.*?-->", "", body, flags=re.S)
        for other_key, aliases in CLIENTS.items():
            if other_key in allowed:
                continue
            for alias in aliases:
                if alias in body:
                    line = body[:body.index(alias)].count("\n") + 1
                    ctx = body[max(0, body.index(alias) - 60):body.index(alias) + 80]
                    problems.append((f"portal/{slug}/index.html", line,
                                     f"the {slug} study", other_key, alias,
                                     " ".join(ctx.split())))
        checked_files.append(str(page.relative_to(ROOT)))

    scope = (f"{len(checked_files)} files · {checked_strings} client-facing strings "
             f"· {len(list((ROOT / 'public' / 'portal').glob('*/index.html')))} rendered study pages")

    if not problems:
        print(f"no page names a client it does not belong to")
        print(f"  scope: {scope}")
        print(f"  NOT covered: template literals, copy built at runtime, and text "
              f"inside <style> or HTML comments (intentional — the reasoning lives there)")
        sys.exit(0)

    print(f"{len(problems)} cross-client reference(s) — a page naming a client it does not belong to:\n")
    for f, line, page, other, alias, text in problems:
        print(f"  {f}:{line}")
        print(f"    on {page}, naming {other} as \"{alias}\"")
        print(f"    {text[:140]}")
        print()
    print(f"scope: {scope}")
    print("Write each study as if the others do not exist. Provenance belongs in git.")
    sys.exit(2)
