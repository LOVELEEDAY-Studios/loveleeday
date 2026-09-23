"""Links security.html from every static page: the Studio dropdown (after
Our principles) and the footer's "The studio" column (after Principles).
Idempotent: skips any spot that already links security.html.

  python3 scripts/add-security-nav.py
"""
import pathlib

SITE = pathlib.Path(__file__).resolve().parent.parent / "concepts/studio/site"
EDITS = [
    ('<a href="principles.html">Our principles<small>Clarity, context, and trust</small></a>',
     '<a href="security.html">Security &amp; trust<small>How client data is protected</small></a>'),
    ('<strong>The studio</strong><a href="principles.html">Principles</a>',
     '<a href="security.html">Security</a>'),
]

changed = 0
for page in sorted(SITE.glob("*.html")):
    t = orig = page.read_text()
    for anchor, link in EDITS:
        if anchor in t and anchor + link not in t:
            t = t.replace(anchor, anchor + link, 1)
    if t != orig:
        page.write_text(t)
        changed += 1
print(f"linked security.html from {changed} pages")
