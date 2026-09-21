#!/usr/bin/env python3
"""Pull the live site's real content out of the TSX, so the mockups cannot drift.

     python3 concepts/studio/extract-live.py  ->  concepts/studio/live-content.json

   Daniel, 2026-09-21: "you should go page by page, and align with our current
   sites components, there is alot of things missing."

   He is right, and the cause is that the mockups were written as a fresh
   interpretation instead of a re-dress of what exists. Whole blocks that are
   already written and already live -- the five guarantees, the five principles,
   the applications list, the FAQ, the project types and budget bands on the
   contact form -- were replaced with paraphrases I wrote. A mockup that invents
   its own copy is not a mockup of this site.

   So the content is EXTRACTED rather than retyped. If a heading changes in the
   app, re-running this changes it in the mockups too.
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / "src" / "app" / "(site)"


def read(p):
    return (SITE / p).read_text()


def array_block(src, name):
    """The literal text of `const NAME = [ ... ]`, bracket-matched."""
    m = re.search(r"const\s+" + name + r"\s*(?::[^=]+?)?=\s*\[", src)
    if not m:
        return None
    i = m.end() - 1
    depth, buf = 0, []
    for ch in src[i:]:
        buf.append(ch)
        if ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                break
    return "".join(buf)


def tuples(block, arity):
    """Rows written as ["01", "Title", "Body"] — the guarantees shape."""
    rows, depth, buf = [], 0, []
    for ch in block[1:-1]:
        if ch == "[":
            depth += 1
            if depth == 1:
                buf = []
                continue
        elif ch == "]":
            depth -= 1
            if depth == 0:
                rows.append("".join(buf))
                continue
        if depth >= 1:
            buf.append(ch)
    out = []
    for r in rows:
        parts = re.findall(r'"((?:[^"\\]|\\.)*)"', r)
        if len(parts) >= arity:
            out.append([p.replace('\\"', '"').replace("\\'", "'") for p in parts[:arity]])
    return out


def objects(block, keys):
    """Rows written as { n: "..", t: "..", d: ".." } — the principles shape."""
    rows, depth, buf = [], 0, []
    for ch in block[1:-1]:
        if ch == "{":
            depth += 1
            if depth == 1:
                buf = []
                continue
        elif ch == "}":
            depth -= 1
            if depth == 0:
                rows.append("".join(buf))
                continue
        if depth >= 1:
            buf.append(ch)
    out = []
    for r in rows:
        rec = {}
        for k in keys:
            m = re.search(k + r'\s*:\s*\n?\s*"((?:[^"\\]|\\.)*)"', r)
            if m:
                rec[k] = m.group(1).replace('\\"', '"').replace("\\'", "'")
        if rec:
            out.append(rec)
    return out


def strings(block):
    return [s.replace('\\"', '"') for s in re.findall(r'"((?:[^"\\]|\\.)*)"', block)]


def chrome():
    """Nav and footer come out of the components, not out of my memory of them.
       The first build of these mockups invented a five-column footer; the real
       one is three columns with specific anchors that other pages rely on."""
    root = ROOT / "src" / "components"
    nav = (root / "Nav.tsx").read_text()
    foot = (root / "Footer.tsx").read_text()
    items = re.findall(r'label:\s*"([^"]+)",\s*href:\s*"([^"]+)"', nav)
    m = re.search(r"const COLUMNS[^=]*=\s*\[", foot)
    blk, d, buf = "", 0, []
    if m:
        for ch in foot[m.end() - 1:]:
            buf.append(ch)
            if ch == "[":
                d += 1
            elif ch == "]":
                d -= 1
                if d == 0:
                    break
        blk = "".join(buf)
    cols, cur = [], None
    for tok in re.finditer(r'title:\s*"([^"]+)"|label:\s*"([^"]+)",\s*href:\s*"([^"]+)"', blk):
        if tok.group(1):
            cur = {"title": tok.group(1), "links": []}
            cols.append(cur)
        elif cur is not None:
            cur["links"].append([tok.group(2), tok.group(3)])
    tag = re.search(r'>\s*(Intelligence architecture[^<]+)<', foot)
    return {"nav": [list(i) for i in items], "footer": cols,
            "tagline": tag.group(1).strip() if tag else "",
            "city": "Kalamazoo, Michigan"}


def main():
    home, arthur = read("page.tsx"), read("arthur/page.tsx")
    about, contact = read("about/page.tsx"), read("contact/page.tsx")

    data = {
        "guarantees": tuples(array_block(home, "GUARANTEES"), 3),
        "components": objects(array_block(arthur, "COMPONENTS"), ["title", "body", "note", "scene"]),
        # APPLICATIONS rows carry a nested `produces` array, so the object
        # scanner has to be told the real keys; FAQ is a list of [q, a] pairs,
        # not objects. Guessing the shape returned 1 and 0 items respectively.
        "applications": objects(array_block(arthur, "APPLICATIONS") or "[]",
                                ["tag", "question", "body"]),
        "app_produces": [strings(b) for b in
                         re.findall(r"produces:\s*(\[[^\]]*\])",
                                    array_block(arthur, "APPLICATIONS") or "")],
        "faq": [{"q": a, "a": b} for a, b in
                tuples(array_block(arthur, "FAQ") or "[]", 2)],
        "principles": objects(array_block(about, "PRINCIPLES"), ["n", "t", "d"]),
        "project_types": strings(array_block(contact, "PROJECT_TYPES") or "[]"),
        "budgets": strings(array_block(contact, "BUDGETS") or "[]"),
        "chrome": chrome(),
    }
    out = Path(__file__).parent / "live-content.json"
    out.write_text(json.dumps(data, indent=1))
    for k, v in data.items():
        n = len(v) if not isinstance(v, dict) else len(v.get("nav", [])) + len(v.get("footer", []))
        print(f"  {k:14} {n} items")
    print("wrote", out.relative_to(ROOT))


if __name__ == "__main__":
    main()
