"""Systems Notes: the editorial section, built from one source folder.

Each note is two files in concepts/studio/notes: NN.html (the article body only)
and NN.json (title, dek, topic, photo, caption and its LinkedIn drafts). This
script wraps them in the live site's own header and footer, taken from
principles.html exactly as build-privacy.py does, so a note can never drift
from the rest of the site's chrome.

What it writes, and why each exists:

* public/site/notes.html and public/site/notes/<slug>.html -- the pages, mounted
  at /notes and /notes/<slug> by the rewrites in next.config.ts.
* public/site/assets/notes.css -- the few styles the notes need. Kept out of
  site.css so the shared stylesheet (and its cache-busting hash) is untouched.
* src/content/notes.json -- slugs and dates for sitemap.ts, so a note can never
  be live and missing from the sitemap.
* concepts/studio/notes/_share.html -- the 1200x630 link-preview cards, one per
  note. Render each #share-NN element at 1200x630 (e.g. ~/arthur/scripts/element-shot.mjs)
  to public/site/assets/notes/share-NN.jpg.
* A "Systems Notes" link in the Studio menu and the footer of every page, in
  both the deployed pages and the concept source. Idempotent.

Reading time is computed from the body, never typed, so it cannot disagree
with the article.
"""
import html, json, math, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE, SRC, NOTES = ROOT / "public/site", ROOT / "concepts/studio/site", ROOT / "concepts/studio/notes"
BASE = "https://loveleedaystudios.com"
PUBLISHED = "2026-09-24"
BUILT = __import__("datetime").date.today().isoformat()

notes = []
for meta_path in sorted(NOTES.glob("[0-9][0-9].json")):
    m = json.loads(meta_path.read_text())
    m["body"] = (NOTES / f"{m['n']}.html").read_text()
    words = len(re.sub(r"<svg.*?</svg>|<[^>]+>", " ", m["body"], flags=re.S).split())
    m["read"] = max(1, math.ceil(words / 200))
    m["date"] = m.get("date", PUBLISHED)
    notes.append(m)

def pretty(d):
    y, mo, da = map(int, d.split("-"))
    return f"{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][mo-1]} {da}, {y}"

e = lambda s: html.escape(s, quote=True)

# ---------- chrome from the live template ----------
t = (SITE / "principles.html").read_text()
head_t = t[: t.find("</head>")]
body_t = t[t.find("<body"):]
nav_t = body_t[: body_t.find("</header>") + 9]
foot_t = body_t[body_t.find("<footer"):]
head_t = re.sub(r'<script type="application/ld\+json">.*?</script>', "", head_t, flags=re.S)

NAV_LINK = '<a href="/notes">Systems Notes<small>How organizations actually work</small></a>'
FOOT_LINK = '<a href="/notes">Systems Notes</a>'

def add_links(page, notes_href):
    if f'href="{notes_href}"' in page:
        return page
    prin = 'href="/principles">Our principles' if notes_href == "/notes" else 'href="principles.html">Our principles'
    nav = NAV_LINK.replace('"/notes"', f'"{notes_href}"')
    page = page.replace(f"<a {prin}", nav + f"<a {prin}", 1)
    return page.replace("<strong>The studio</strong>", "<strong>The studio</strong>" + FOOT_LINK.replace('"/notes"', f'"{notes_href}"'), 1)

nav_t, foot_t = add_links(nav_t + foot_t, "/notes").split("<footer", 1)
foot_t = "<footer" + foot_t
TOP = "<!--ob:top--><!--/ob:top-->"
BOTTOM = "<!--ob:bottom--><!--/ob:bottom-->"
head_t = re.sub(r'<meta name="card:[^>]*>', "", head_t)
OBJS = '<script src="/site/assets/ob/ob.js?v=HASH" defer></script>'

def ntitle(n):
    # "Page | LOVELEEDAY"; a headline too long for the search result keeps the headline and drops the brand
    t = n["title"].rstrip(".")
    return t if len(t) + 13 > 60 else f"{t} | LOVELEEDAY"


def head(title, desc, path, image, ld, og_type="article"):
    h = head_t
    url = BASE + path
    for pat, val in [(r"<title>.*?</title>", f"<title>{e(title)}</title>"),
                     (r'<meta name="description" content="[^"]*"', f'<meta name="description" content="{e(desc)}"'),
                     (r'<link rel="canonical" href="[^"]*"', f'<link rel="canonical" href="{url}"'),
                     (r'<meta property="og:type" content="[^"]*"', f'<meta property="og:type" content="{og_type}"'),
                     (r'<meta property="og:title" content="[^"]*"', f'<meta property="og:title" content="{e(title)}"'),
                     (r'<meta property="og:description" content="[^"]*"', f'<meta property="og:description" content="{e(desc)}"'),
                     (r'<meta property="og:url" content="[^"]*"', f'<meta property="og:url" content="{url}"'),
                     (r'<meta property="og:image" content="[^"]*"', f'<meta property="og:image" content="{BASE}{image}"'),
                     (r'<meta property="og:image:alt" content="[^"]*"', f'<meta property="og:image:alt" content="{e(title)}"'),
                     (r'<meta name="twitter:title" content="[^"]*"', f'<meta name="twitter:title" content="{e(title)}"'),
                     (r'<meta name="twitter:description" content="[^"]*"', f'<meta name="twitter:description" content="{e(desc)}"'),
                     (r'<meta name="twitter:image" content="[^"]*"', f'<meta name="twitter:image" content="{BASE}{image}"')]:
        h = re.sub(pat, val, h, flags=re.S)
    return (h + f'<script type="application/ld+json">{json.dumps(ld)}</script>'
            '<link rel="stylesheet" href="/site/assets/ob/notes.css?v=HASH"></head>')

def meta_line(n, with_n=True):
    bits = [f"<b>{e(n['topic'])}</b>"] + ([f"<span>Note {n['n']}</span>", "<span>·</span>"] if with_n else [])
    return '<div class="meta">' + "".join(bits) + f"<span>{pretty(n['date'])}</span><span>·</span><span>{n['read']} min read</span></div>"

img = lambda n: f"/site/assets/notes/{n['photo']}"
share = lambda n: f"/site/assets/notes/share-{n['n']}.jpg"
crumbs = lambda extra: {"@type": "BreadcrumbList", "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": BASE + "/"},
    {"@type": "ListItem", "position": 2, "name": "Systems Notes", "item": BASE + "/notes"}] + extra}

# ---------- index ----------
topics = []
for n in notes:
    if n["topic"] not in topics:
        topics.append(n["topic"])
by_date = sorted(notes, key=lambda n: n["date"], reverse=True)
first, rest = by_date[0], by_date[1:]
WIDTHS = ["w7", "w4", "w4", "w4", "w7", "w5", "w5", "w7"]

def tile(n, w, lazy=True):
    load = ' loading="lazy"' if lazy else ""
    return (f'<article class="mt {w}" data-topic="{e(n["topic"])}"><a class="ph" href="/notes/{n["slug"]}"><img src="{img(n)}" alt="{e(n["alt"])}"{load}><b>{e(n["title"])}</b></a>'
            f'<small>{e(n["topic"])}</small><p>{e(n["summary"])}</p>{meta_line(n, False)}</article>')

index = (
    '<section class="mos"><div class="mos-h"><h1>Notes on how organizations really work.</h1>'
    '<p class="sc-lede">Short, plain-language notes on identity, evidence, memory and the ways information gets lost between systems.</p>'
    '<nav class="notes-topics" aria-label="Filter notes by topic"><button type="button" class="on" data-topic="">All notes</button>'
    + "".join(f'<button type="button" data-topic="{e(tp)}">{e(tp)}</button>' for tp in topics) + "</nav></div>"
    + "".join(tile(n, WIDTHS[i], i > 0) for i, n in enumerate(by_date))
    + "</section>"
    '<section class="ob-close"><div class="ob-wrap"><p class="ob-close-l">Follow LOVELEEDAY on LinkedIn.<em>We post each new note there when it is published.</em></p>'
    '<p class="ob-btns"><a class="ob-btn ob-btn--blue" href="https://www.linkedin.com/company/loveleeday-studios/" target="_blank" rel="noopener">Follow on LinkedIn ↗</a></p></div></section>'
)
filter_js = ("<script>(()=>{const bs=[...document.querySelectorAll('.notes-topics button')],items=[...document.querySelectorAll('.mt')],m=document.querySelector('.mos');"
             "bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.classList.toggle('on',x===b));const t=b.dataset.topic;m.classList.toggle('f',!!t);"
             "items.forEach(i=>{i.hidden=!!t&&i.dataset.topic!==t})}))})()</script>")
ld_index = {"@context": "https://schema.org", "@graph": [
    {"@type": "CollectionPage", "url": BASE + "/notes", "name": "Systems Notes | LOVELEEDAY",
     "isPartOf": {"@type": "WebSite", "name": "LOVELEEDAY", "url": BASE + "/"}}, crumbs([])]}
index_page = (head("Systems Notes | LOVELEEDAY", "Plain-language notes on identity, evidence, memory and the ways information gets lost between systems.",
                   "/notes", "/site/assets/notes/share-index.jpg", ld_index, "website")
              + '<body class="sc ob">' + TOP + '<main id="main">' + index + "</main>" + BOTTOM + filter_js + OBJS + "</body></html>")
(SITE / "notes.html").write_text(index_page)

# ---------- articles ----------
(SITE / "notes").mkdir(exist_ok=True)
for i, n in enumerate(notes):
    nxt = notes[(i + 1) % len(notes)]
    url = f"{BASE}/notes/{n['slug']}"
    share_href = "https://www.linkedin.com/sharing/share-offsite/?url=" + url
    body = (
        f'<section class="sc-split sc-lead"><img src="{img(n)}" alt="{e(n["alt"])}" width="1600" height="1067" fetchpriority="high"><div><a class="back" href="/notes">← Systems Notes</a>'
        f'<h1>{e(n["title"])}</h1><p>{e(n["dek"])}</p>{meta_line(n)}</div></section>'
        f'<article class="art-body"><div class="ob-prose">{n["body"]}<div class="art-foot"><span class="meta"><b>{e(n["topic"])}</b><span>Systems Notes · LOVELEEDAY</span></span>'
        f'<a class="share ob-btn ob-btn--ink" href="{share_href}" target="_blank" rel="noopener">Share on LinkedIn ↗</a></div></div></article>'
        f'<a class="nx" href="/notes/{nxt["slug"]}"><img src="{img(nxt)}" alt="{e(nxt["alt"])}" loading="lazy"><div><small>Next note</small><h2>{e(nxt["title"])}</h2></div></a>'
    )
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Article", "headline": n["title"].rstrip("."), "description": n["dek"], "image": BASE + share(n),
         "datePublished": n["date"], "dateModified": BUILT, "url": url, "mainEntityOfPage": url,
         "author": {"@type": "Organization", "name": "LOVELEEDAY", "url": BASE + "/"},
         "publisher": {"@type": "Organization", "name": "LOVELEEDAY", "url": BASE + "/"}},
        crumbs([{"@type": "ListItem", "position": 3, "name": n["title"].rstrip("."), "item": url}])]}
    page = (head(ntitle(n), n["dek"], f"/notes/{n['slug']}", share(n), ld)
            + '<body class="sc ob">' + TOP + '<main id="main">' + body + "</main>" + BOTTOM + OBJS + "</body></html>")
    (SITE / "notes" / f"{n['slug']}.html").write_text(page)

# ---------- css, sitemap data, share cards ----------
(ROOT / "src/content/notes.json").write_text(json.dumps([{"slug": n["slug"], "date": n["date"]} for n in notes], indent=2) + "\n")
# Same pattern as the site's own cards (share.jpg, share-home.jpg): full-bleed photo under a dark
# wash, the white heart and wordmark top left, a white first line and a warm tan second line.
A = "../../../public/site/assets/notes/"
def card(cid, photo, l1, l2, sub):
    return (f'<div class="card" id="{cid}"><img class="ph" src="{A}{photo}" alt="">'
            f'<div class="brand"><img src="{A}mark-white.png" alt="">LOVELEEDAY</div>'
            f'<div class="txt"><h1>{e(l1)}<br><span>{e(l2)}</span></h1><p>{e(sub)}</p></div></div>')
cards = card("share-index", "notes-index.jpg", "Notes on how organizations", "really work.",
             "Systems Notes") + "".join(
    card(f"share-{n['n']}", n["photo"], n["card"][0], n["card"][1], f"Systems Notes · Note {n['n']}") for n in notes)
(NOTES / "_share.html").write_text(
    "<!doctype html><meta charset=utf-8><style>body{margin:0;background:#000;font-family:-apple-system,Helvetica,Arial,sans-serif}"
    ".card{width:1200px;height:630px;position:relative;overflow:hidden;color:#fff}"
    ".ph{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}"
    ".card::after{content:'';position:absolute;inset:0;background:linear-gradient(0deg,rgba(12,11,10,.86) 0%,rgba(12,11,10,.55) 50%,rgba(12,11,10,.5) 100%)}"
    ".brand{position:absolute;z-index:1;left:80px;top:60px;display:flex;align-items:center;gap:12px;font-size:17px;letter-spacing:.2em;font-weight:600}"
    ".brand img{width:24px;height:24px}"
    ".txt{position:absolute;z-index:1;left:80px;right:80px;bottom:64px}"
    "h1{font-size:66px;line-height:1.04;letter-spacing:-.045em;font-weight:600;margin:0}h1 span{color:#d5b185}"
    "p{font-size:21px;color:rgba(255,255,255,.78);margin:24px 0 0}</style>" + cards)

# ---------- menu + footer link on every page ----------
changed = 0
for d, href in [(SITE, "/notes"), (SRC, "notes.html")]:
    for p in d.glob("*.html"):
        s = p.read_text()
        s2 = add_links(s, href)
        if s2 != s:
            p.write_text(s2); changed += 1
print(f"  {len(notes)} notes built · index + {len(notes)} articles · nav/footer link added to {changed} pages")
for n in notes:
    print(f"   {n['n']} /notes/{n['slug']}  {n['read']} min")

import subprocess
subprocess.run(["node", "scripts/one-brand-chrome.mjs", str(SITE / "notes.html")] + [str(p) for p in sorted((SITE / "notes").glob("*.html"))], cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
