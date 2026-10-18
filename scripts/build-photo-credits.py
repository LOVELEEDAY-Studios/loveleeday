#!/usr/bin/env python3
"""Build public/site/photo-credits.html from scripts/photo-slots.json + each original's credits.json.
Uses terms.html as the page template (same chrome, hero and document styles)."""
import glob, html, json, os, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAND = os.environ.get("PHOTO_CANDIDATES", "/Users/danielmay/Projects/loveleeday/brand/photo-candidates")
WHERE = {
    "home-hero": "Home page, top photograph", "home-hero-phone": "Home page, top photograph on phones",
    "home-life": "Home page, the life band", "mfg-tile": "Ways to work together, manufacturing",
    "schools-hero": "Schools and charters, top photograph (mirrored)", "schools-tile": "Ways to work together, schools",
    "property-hero": "Property management, top photograph", "property-tile": "Ways to work together, property",
    "gov-tile": "Ways to work together, local government", "schools-gov-card": "Schools and charters, related industry",
    "property-gov-card": "Property management, related industry", "property-portfolio-card": "Property management, related industry",
    "mfg-retail-card": "Manufacturing, related industry", "mfg-prof-card": "Manufacturing, related industry",
    "contact-side": "Start a project, side photograph",
}
slots = json.load(open(f"{R}/scripts/photo-slots.json"))
by = {}
for k, c in slots.items():
    by.setdefault(c["id"], []).append(WHERE[k])
rows = []
for pid, places in by.items():
    cj = json.load(open(glob.glob(f"{CAND}/*/credits.json")[0])) if False else None
    meta = None
    for f in glob.glob(f"{CAND}/*/credits.json"):
        for e in json.load(open(f)):
            if str(e["pexels_id"]) == pid:
                meta = e
    assert meta, pid
    name = meta["photographer"]
    if name.startswith("http"):
        name = "Kaboompics"
    rows.append((name, meta["photographer_url"], meta["photo_url"], places))
rows.sort(key=lambda r: r[0].lower())

items = ""
for name, purl, url, places in rows:
    items += (f'<li><a href="{html.escape(purl)}" rel="noopener">{html.escape(name)}</a>, '
              f'<a href="{html.escape(url)}" rel="noopener">photograph on Pexels</a>. '
              f'Used on: {html.escape("; ".join(sorted(set(places))))}.</li>')

t = open(f"{R}/public/site/terms.html").read()
desc = "Who took the photographs on the LOVELEEDAY site, with a link to each one on Pexels."
t = t.replace("Terms of use — LOVELEEDAY", "Photo credits — LOVELEEDAY")
t = t.replace("The plain terms for using the LOVELEEDAY website and for the first conversation about a project.", desc)
t = t.replace("https://loveleedaystudios.com/terms", "https://loveleedaystudios.com/photo-credits")
t = t.replace("/site/assets/share/terms.jpg", "/site/assets/share/photo-credits.jpg")
t = re.sub(r'<meta property="og:image:alt" content="[^"]*">', '<meta property="og:image:alt" content="LOVELEEDAY — Photo credits">', t)
t = re.sub(r'<meta name="card:[^>]*>', '', t)
main = ('<main id="main"><section class="tm-hero"><div class="wrap"><h1>Photo credits</h1>'
        '<p class="lead">The photographs on this site were taken by working photographers. Thank you to each of them.</p></div></section>'
        '<div class="wrap tm-shell" style="display:block"><article class="tm-doc" style="max-width:720px"><section class="tm-sec" id="credits"><h2>The photographs</h2>'
        '<div class="body-copy"><p>Every photograph below is used under the free Pexels license, which does not require credit. We credit anyway.</p>'
        f'<ul>{items}</ul></div></section></article></div></main>')
t = re.sub(r'<main id="main">.*?</main>', lambda m: main, t, flags=re.S)
t = re.sub(r'<script>\(function\(\)\{var links=\[\]\.slice\.call\(document\.querySelectorAll\(\'\.tm-toc a\'\).*?</script>', '', t, flags=re.S)
open(f"{R}/public/site/photo-credits.html", "w").write(t)
md = "## Graded site photographs\n\nPexels originals, one grade applied (scripts/grade-photos.py), downscaled only. Public page: /photo-credits.\n\n"
for name, purl, url, places in rows:
    md += f"- {name} ({purl}): {url}. Used on: {'; '.join(sorted(set(places)))}.\n"
p = f"{R}/PHOTO-CREDITS.md"
cur = open(p).read()
cur = re.sub(r"## Graded site photographs.*?(?=\n## |\Z)", "", cur, flags=re.S).rstrip() + "\n\n" + md
open(p, "w").write(cur)
print("wrote", len(rows), "credits")
