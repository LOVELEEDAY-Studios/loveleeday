#!/usr/bin/env python3
"""
type-audit — every heading on a study, with the face, size and weight it renders.

A page reads as "a mess" long before anyone can name why, and the usual cause is
a type system that was changed in one section and not the others. One serif
headline among eleven geometric-sans headlines is not a highlight, it is an
orphan, and it makes the whole page look unfinished rather than making that one
section look considered.

This prints the ladder as it actually renders, so the inconsistency is a list
rather than a feeling.

  python3 scripts/type-audit.py venturehue
"""
import re, sys
from pathlib import Path
from patchright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
BASE = "http://localhost:3111"

# In a file, not a -c string: passing /\n/ through a shell mangles it into an
# unterminated regex literal. Second time this exact trap has cost a run.
PROBE = """() => {
  const out = [];
  for (const s of document.querySelectorAll('section, footer')) {
    const h = s.querySelector('h1, h2');
    if (!h) continue;
    const cs = getComputedStyle(h);
    out.push({
      sec: String(s.className || s.tagName).split(' ')[0],
      font: cs.fontFamily.split(',')[0].replace(/["']/g, ''),
      size: Math.round(parseFloat(cs.fontSize)),
      weight: cs.fontWeight,
      ls: cs.letterSpacing,
      text: h.innerText.replace(/\\s+/g, ' ').slice(0, 44)
    });
  }
  return out;
}"""


def token_for(slug):
    tokens_src = (ROOT / "src" / "content" / "tokens.ts").read_text()
    env_for_key = dict(re.findall(r'(\w+):\s*tokO?p?t?i?o?n?a?l?\("([A-Z0-9_]+)"\)', tokens_src))
    dir_to_key = dict(re.findall(r"(\w+):\s*TOKENS\.(\w+)", (ROOT / "src" / "proxy.ts").read_text()))
    var = env_for_key.get(dir_to_key.get(slug, ""), "")
    m = re.search(rf"^{var}=(\S+)", (ROOT / ".env.local").read_text(), re.M) if var else None
    return m.group(1) if m else None


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    slug = sys.argv[1]
    url = f"{BASE}/portal/{slug}/index.html"
    t = token_for(slug)
    if t:
        url += f"?k={t}"

    with sync_playwright() as pw:
        b = pw.chromium.launch(channel="chrome", headless=True)
        pg = b.new_page(viewport={"width": 1440, "height": 900})
        pg.goto(url, wait_until="load", timeout=45000)
        pg.wait_for_timeout(1600)
        rows = pg.evaluate(PROBE)
        b.close()

    faces = {}
    for r in rows:
        faces.setdefault(r["font"], []).append(r["sec"])

    print(f"{slug}: {len(rows)} section headings\n")
    for r in rows:
        print(f"  {r['sec']:<14} {r['font']:<18} {r['size']:>3}px  w{r['weight']:<4} {r['ls']:>8}  {r['text']}")

    print(f"\n{len(faces)} display face(s) in use:")
    for f, secs in sorted(faces.items(), key=lambda kv: -len(kv[1])):
        print(f"  {f:<18} {len(secs):>2} section(s)  {', '.join(secs)}")
    # A face used in exactly one section, when another covers the rest, is an
    # orphan by definition — either commit to it or take it out.
    orphans = [f for f, s in faces.items() if len(s) == 1 and len(faces) > 1]
    if orphans:
        print(f"\nORPHAN FACE: {', '.join(orphans)} appears in a single section while another")
        print("carries the rest. Commit to it across the page or remove it.")
        sys.exit(2)
