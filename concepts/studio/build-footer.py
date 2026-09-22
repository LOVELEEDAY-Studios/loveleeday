"""Rebuild the footer on all twelve pages.

WHY. The shipped footer had two grids stacked on different column tracks -- a
three-column capability block over a four-column nav block -- so nothing lined
up, the right third of the top block was empty, and every capability item was
dead text styled to look exactly like the live links beneath it. It ended in
nine-point grey. The page did not finish; it ran out.

EVIDENCE. Eight footers captured and read on 2026-09-22: stripe.com,
linear.app, vercel.com, palantir.com, anthropic.com, figma.com, ramp.com,
mercury.com. Four things every one of them does that ours did not:

  1. ONE grid. Every column on the same track, every item a real link.
  2. No prose. Not one of the eight puts marketing sentences in a footer.
  3. The mark opens the footer at size (Palantir, Figma), rather than sitting
     small in the middle of it.
  4. Vercel and Stripe close with a live status line. Vercel's reads
     "ALL SYSTEMS NORMAL" beside a green dot.

And the two that read most like the company Daniel wants to be next to --
Vercel and Palantir -- put the footer on a DARK surface, so a white page has an
ending rather than a fade.

WHAT THIS DOES DIFFERENTLY FROM THEM. The status line. Every other footer's
proof is "we are up". This site's entire argument is that a figure without
lineage is not reportable, so its footer prints the store behind the site:
objects, observations, sources, lineage cover -- read from the ontology at
build time through store.py, never typed, and stamped with the date it was
read, because a static page cannot honestly claim to be reading live.

VOCABULARY. The old capability block invented six names for the intelligence
layers ("Identity resolution", "Bitemporal record", "Standing conditions").
The architecture page calls them Identity, Lineage, Memory, Verification and
Awareness, and each has a real anchor. The footer now uses the site's own five
words and every one of them goes somewhere.

The six build services stay -- Daniel asked for the capabilities listed -- but
as a services line in the signature band, which is what they are, rather than
as a fake nav column pointing nowhere.
"""

import datetime
import pathlib
import re

import store

SITE = pathlib.Path("site")

d = store.read_store()
read_on = datetime.date.today().strftime("%-d %B %Y")

SERVICES = ["Custom applications", "Workflow automation", "Data migration and cleanup",
            "Research and decision support", "Websites and digital experiences",
            "Brand, content and creative"]

COLUMNS = [
    ("The system", [("Operating system", "operating-system.html"),
                    ("Arthur", "arthur.html"),
                    ("Architecture", "architecture.html"),
                    ("All use cases", "use-cases.html")]),
    ("In practice", [("Industries", "industries.html"),
                     ("Municipal review", "municipal-review.html"),
                     ("Customer data", "customer-data.html"),
                     ("Pricing &amp; margins", "pricing-margins.html"),
                     ("Operational intelligence", "operational-intelligence.html")]),
    # Every one of these is a real anchor on architecture.html, checked.
    ("The intelligence", [("Identity", "architecture.html#identity"),
                          ("Lineage", "architecture.html#lineage"),
                          ("Memory", "architecture.html#memory"),
                          ("Verification", "architecture.html#verification"),
                          ("Awareness", "architecture.html#awareness")]),
    ("The studio", [("Principles", "principles.html"),
                    ("LOVELEEDAY", "studio.html"),
                    ("Start a project", "studio.html#project-brief")]),
]

# Refuse to publish an anchor that does not exist. A footer full of links to
# nothing is the same defect as dead text, one click later.
for _, items in COLUMNS:
    for label, href in items:
        page, _, frag = href.partition("#")
        src = (SITE / page).read_text()
        if not (SITE / page).exists():
            raise SystemExit(f"BUILD STOPPED: {href} -> no such page")
        if frag and f'id="{frag}"' not in src:
            raise SystemExit(f"BUILD STOPPED: {href} -> #{frag} does not exist on {page}")

cols_html = "".join(
    f'<div class="footer-col"><strong>{title}</strong>'
    + "".join(f'<a href="{href}">{label}</a>' for label, href in items)
    + "</div>"
    for title, items in COLUMNS)

# The one thing no other footer can print. Read, not asserted -- and dated,
# because this page is static and "live" would be a lie.
live = (
    '<div class="footer-live">'
    '<span class="footer-live-dot" aria-hidden="true"></span>'
    '<span class="footer-live-label">The store behind this site</span>'
    '<span class="footer-live-figs">'
    f"<b>{d['objects']:,}</b> objects"
    f"<i>·</i><b>{d['props']:,}</b> observations"
    f"<i>·</i><b>{d['sources']}</b> source systems"
    f"<i>·</i><b>{d['cover']}</b> carry lineage"
    f"<i>·</i><b>{d['nolin']}</b> without"
    "</span>"
    f'<span class="footer-live-read">read {read_on}</span>'
    "</div>")

FOOTER = (
    '<footer class="site-footer"><div class="wrap">'

    '<div class="footer-top">'
    '<div class="footer-sign">'
    '<a class="footer-mark" href="index.html">'
    '<svg aria-hidden="true"><use href="#mark"/></svg><span>LOVELEEDAY</span></a>'
    '<p class="footer-line">Pure intelligence.<br>For a fuller life.</p>'
    '</div>'
    '<a class="footer-cta" href="studio.html#project-brief">Start a project '
    '<span aria-hidden="true">&#8599;</span></a>'
    '</div>'

    '<div class="footer-services">'
    '<span class="footer-services-label">What we build</span>'
    '<div class="footer-services-grid">'
    + "".join(f"<span>{x}</span>" for x in SERVICES) +
    '</div></div>'

    f'<div class="footer-grid">{cols_html}</div>'

    + live +

    '<div class="footer-legal">'
    '<span>&copy; 2026 LOVELEEDAY Studios</span>'
    '<span>Design concept · Interactive examples use demonstration data · '
    'Lifestyle photography is licensed stock</span>'
    '</div>'

    '</div></footer>')

pat = re.compile(r'<footer class="site-footer">.*?</footer>', re.S)
n = 0
for page in sorted(SITE.glob("*.html")):
    t = page.read_text()
    if not pat.search(t):
        raise SystemExit(f"BUILD STOPPED: {page.name} has no site-footer to replace")
    page.write_text(pat.sub(lambda _: FOOTER, t, count=1))
    n += 1
print(f"footer rebuilt on {n} page(s)")
print(f"  live strip: {d['objects']:,} objects · {d['props']:,} observations · "
      f"{d['sources']} sources · {d['cover']} lineage · read {read_on}")
