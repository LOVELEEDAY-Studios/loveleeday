"""Adds the "What we build" dropdown to the header of every static page.

The header is copied verbatim into each page (there is no include step), so the
dropdown is inserted before the Studio dropdown in every file that has one. The
six services were the footer's "What we build" list, word for word (that
footer block was removed once this dropdown replaced it). None has a
page of its own yet, so each one opens the project brief, which is where the
footer CTA already sends people.

  python3 scripts/add-build-nav.py      (idempotent: skips pages that already have it)
"""
import pathlib

SITE = pathlib.Path(__file__).resolve().parent.parent / "concepts/studio/site"
SERVICES = [
    "Custom applications",
    "Workflow automation",
    "Data migration and cleanup",
    "Research and decision support",
    "Websites and digital experiences",
    "Brand, content and creative",
]
ANCHOR = '<details class="nav-dropdown"><summary>Studio '
MARK = "build-nav"

links = "".join(f'<a href="studio.html#project-brief">{s}</a>' for s in SERVICES)
DROPDOWN = (
    f'<details class="nav-dropdown {MARK}"><summary><b class="nav-long">What we build</b>'
    '<b class="nav-short">Build</b> <span aria-hidden="true">⌄</span></summary>'
    f'<div class="dropdown-panel compact"><span class="dropdown-label">What we build</span>{links}'
    '<a class="dropdown-more" href="studio.html#project-brief">Start with a question ↗</a></div></details>'
)

CSS = """
/* "What we build" nav dropdown -- scripts/add-build-nav.py. The label shortens
   to "Build" at phone width so four menus fit beside the brand. */
.build-nav summary b{font-weight:inherit}
.build-nav .nav-short{display:none}
.dropdown-panel a.dropdown-more{color:var(--blue);margin-top:var(--s1);border-top:1px solid var(--line);padding-top:var(--s2)}
@media(max-width:700px){.build-nav .nav-long{display:none}.build-nav .nav-short{display:inline}}
"""

changed = 0
for page in sorted(SITE.glob("*.html")):
    t = page.read_text()
    if MARK in t or ANCHOR not in t:
        continue
    page.write_text(t.replace(ANCHOR, DROPDOWN + ANCHOR, 1))
    changed += 1

css = SITE / "assets/site.css"
if ".build-nav" not in css.read_text():
    css.write_text(css.read_text().rstrip("\n") + "\n" + CSS)

print(f"added to {changed} pages")
