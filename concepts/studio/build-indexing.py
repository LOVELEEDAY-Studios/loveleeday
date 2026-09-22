"""Make every page indexable and shareable.

The pages already had unique titles and descriptions. Everything else was
missing on all twelve: no canonical, no Open Graph, no Twitter card, no
structured data, no sitemap, no robots.txt. A link pasted into Slack, iMessage
or LinkedIn rendered as a bare URL.

Decisions worth stating:

* CANONICAL AND OG URLS need a real origin, which is asserted once here rather
  than guessed per page. If the site ships somewhere else, this constant is
  the only edit.
* THE SHARE IMAGE is per-page by intent: the homepage gets the card that shows
  what the product does, every other page gets the brand card, which stays
  legible at the size a link preview actually renders.
* STRUCTURED DATA is Organization on the homepage and WebPage elsewhere, with
  a BreadcrumbList so a section page is not presented as a top-level entity.
  Nothing is claimed in it that the page does not already say -- no ratings,
  no counts, no invented founding date.
* ROBOTS allows everything and points at the sitemap. There is nothing here to
  hide, and a needlessly restrictive robots file is how pages quietly vanish.
"""

import datetime
import pathlib
import re

SITE = pathlib.Path("site")
ORIGIN = "https://loveleedaystudios.com"
BRAND = "LOVELEEDAY"
TODAY = datetime.date.today().isoformat()

# page -> (priority, changefreq, breadcrumb section or None)
PAGES = {
    "index.html":                    (1.0, "weekly", None),
    "operating-system.html":         (0.9, "monthly", "The system"),
    "arthur.html":                   (0.9, "monthly", "The system"),
    "architecture.html":             (0.8, "monthly", "The system"),
    "use-cases.html":                (0.8, "monthly", "In practice"),
    "industries.html":               (0.8, "monthly", "In practice"),
    "municipal-review.html":         (0.7, "monthly", "In practice"),
    "customer-data.html":            (0.7, "monthly", "In practice"),
    "pricing-margins.html":          (0.7, "monthly", "In practice"),
    "operational-intelligence.html": (0.7, "monthly", "In practice"),
    "principles.html":               (0.6, "monthly", "The studio"),
    "studio.html":                   (0.9, "monthly", "The studio"),
}

missing = sorted({p.name for p in SITE.glob("*.html")} - set(PAGES))
if missing:
    raise SystemExit(f"BUILD STOPPED: pages with no indexing entry: {missing}")


def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
             .replace('"', "&quot;"))


for name, (prio, freq, section) in PAGES.items():
    page = SITE / name
    t = page.read_text()

    title = re.search(r"<title>(.*?)</title>", t, re.S)
    desc = re.search(r'<meta name="description" content="(.*?)"', t, re.S)
    if not title or not desc:
        raise SystemExit(f"BUILD STOPPED: {name} has no title or description to build on")
    title, desc = title.group(1).strip(), desc.group(1).strip()

    url = ORIGIN + ("/" if name == "index.html" else "/" + name)
    # The homepage card demonstrates; the rest carry the brand card, which is
    # the one that survives being rendered two inches wide.
    img = f"{ORIGIN}/assets/share-home.jpg" if name == "index.html" \
          else f"{ORIGIN}/assets/share.jpg"

    if name == "index.html":
        ld = ('{"@context":"https://schema.org","@type":"Organization",'
              f'"name":"{BRAND}","url":"{ORIGIN}/",'
              f'"logo":"{ORIGIN}/assets/mark-ink-512.png",'
              f'"description":"{esc(desc)}",'
              '"slogan":"Pure intelligence. For a fuller life."}')
    else:
        crumbs = ('{"@type":"ListItem","position":1,"name":"Home","item":"%s/"}' % ORIGIN)
        if section:
            crumbs += (',{"@type":"ListItem","position":2,"name":"%s"}' % esc(section))
        crumbs += (',{"@type":"ListItem","position":%d,"name":"%s","item":"%s"}'
                   % (3 if section else 2, esc(title.split(" — ")[0]), url))
        ld = ('{"@context":"https://schema.org","@graph":['
              f'{{"@type":"WebPage","url":"{url}","name":"{esc(title)}",'
              f'"description":"{esc(desc)}",'
              f'"isPartOf":{{"@type":"WebSite","name":"{BRAND}","url":"{ORIGIN}/"}}}},'
              f'{{"@type":"BreadcrumbList","itemListElement":[{crumbs}]}}]}}')

    head = (
        f'<link rel="canonical" href="{url}">'
        f'<meta property="og:type" content="{"website" if name == "index.html" else "article"}">'
        f'<meta property="og:site_name" content="{BRAND}">'
        f'<meta property="og:title" content="{esc(title)}">'
        f'<meta property="og:description" content="{esc(desc)}">'
        f'<meta property="og:url" content="{url}">'
        f'<meta property="og:image" content="{img}">'
        f'<meta property="og:image:width" content="1200">'
        f'<meta property="og:image:height" content="630">'
        f'<meta property="og:image:alt" content="{esc(title)}">'
        f'<meta property="og:locale" content="en_US">'
        f'<meta name="twitter:card" content="summary_large_image">'
        f'<meta name="twitter:title" content="{esc(title)}">'
        f'<meta name="twitter:description" content="{esc(desc)}">'
        f'<meta name="twitter:image" content="{img}">'
        f'<meta name="robots" content="index,follow,max-image-preview:large">'
        f'<meta name="author" content="{BRAND} Studios">'
        f'<script type="application/ld+json">{ld}</script>'
    )

    # Strip any previous pass so re-running cannot stack duplicate tags.
    t = re.sub(r'<link rel="canonical".*?</script>', "", t, flags=re.S)
    anchor = '<link rel="stylesheet" href="assets/site.css">'
    if anchor not in t:
        raise SystemExit(f"BUILD STOPPED: {name} has no stylesheet link to anchor to")
    t = t.replace(anchor, head + anchor, 1)
    page.write_text(t)

print(f"head metadata written to {len(PAGES)} page(s)")

urls = "".join(
    f"<url><loc>{ORIGIN}/{'' if n == 'index.html' else n}</loc>"
    f"<lastmod>{TODAY}</lastmod><changefreq>{f}</changefreq>"
    f"<priority>{p}</priority></url>"
    for n, (p, f, _) in sorted(PAGES.items(), key=lambda kv: -kv[1][0]))
(SITE / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    + urls + "</urlset>\n")

(SITE / "robots.txt").write_text(
    "User-agent: *\nAllow: /\n\n"
    f"Sitemap: {ORIGIN}/sitemap.xml\n")
print(f"sitemap.xml ({len(PAGES)} urls) and robots.txt written")
