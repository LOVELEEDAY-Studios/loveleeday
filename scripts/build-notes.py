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
            '<link rel="stylesheet" href="/site/assets/notes.css?v=2"></head>')

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
first, rest = notes[0], notes[1:]
index = (
    '<section class="notes-hero"><div class="wrap"><span class="eyebrow">Systems Notes</span>'
    "<h1>How organizations actually work.<br><span>And why their systems don't.</span></h1>"
    '<p class="lead">Short notes on identity, evidence, memory and the quiet ways information gets lost between systems. A new note every Wednesday.</p>'
    '<nav class="notes-topics" aria-label="Filter notes by topic"><button type="button" class="on" data-topic="">All notes</button>'
    + "".join(f'<button type="button" data-topic="{e(tp)}">{e(tp)}</button>' for tp in topics) + "</nav></div></section>"
    f'<section class="feature" data-topic="{e(first["topic"])}"><div class="wrap"><a href="/notes/{first["slug"]}">'
    f'<figure><img src="{img(first)}" alt="{e(first["alt"])}"></figure><div>{meta_line(first)}'
    f'<h2>{e(first["title"])}</h2><p>{e(first["summary"])}</p><span class="read">Read the note ↗</span></div></a></div></section>'
    '<section class="note-list"><div class="wrap"><h2 class="list-head">All notes</h2>'
    + "".join(
        f'<a class="row" href="/notes/{n["slug"]}" data-topic="{e(n["topic"])}"><span class="n">{n["n"]}</span><div><h3>{e(n["title"])}</h3>'
        f'<p>{e(n["summary"])}</p>{meta_line(n, False)}</div><figure><img src="{img(n)}" alt="{e(n["alt"])}" loading="lazy"></figure></a>'
        for n in rest)
    + '<p class="none" hidden>No notes on this topic yet.</p></div></section>'
    '<section class="notes-follow"><div class="wrap"><div><h2>A new note every Wednesday.</h2>'
    "<p>Follow LOVELEEDAY on LinkedIn to get each one as it's published.</p></div>"
    '<a class="btn-dark" href="https://www.linkedin.com/company/loveleeday-studios/" target="_blank" rel="noopener">Follow on LinkedIn ↗</a></div></section>'
)
filter_js = ("<script>(()=>{const bs=[...document.querySelectorAll('.notes-topics button')],items=[...document.querySelectorAll('[data-topic]')].filter(x=>x.tagName!=='BUTTON'),none=document.querySelector('.note-list .none');"
             "bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.classList.toggle('on',x===b));const t=b.dataset.topic;let shown=0;"
             "items.forEach(i=>{const ok=!t||i.dataset.topic===t;i.hidden=!ok;if(ok&&i.classList.contains('row'))shown++});none.hidden=shown>0||!t||items.some(i=>!i.hidden&&i.classList.contains('feature'))}))})()</script>")
ld_index = {"@context": "https://schema.org", "@graph": [
    {"@type": "CollectionPage", "url": BASE + "/notes", "name": "Systems Notes — LOVELEEDAY",
     "isPartOf": {"@type": "WebSite", "name": "LOVELEEDAY", "url": BASE + "/"}}, crumbs([])]}
index_page = (head("Systems Notes — LOVELEEDAY", "Notes on how organizations actually work, and why their systems don't. Identity, evidence, memory and integration, in plain language.",
                   "/notes", share(first), ld_index, "website")
              + "<body class=\"\">" + nav_t[nav_t.find("<a class=\"skip\""):] + '<main id="main">' + index + "</main>" + foot_t.replace("</body>", filter_js + "</body>"))
(SITE / "notes.html").write_text(index_page)

# ---------- articles ----------
(SITE / "notes").mkdir(exist_ok=True)
for i, n in enumerate(notes):
    nxt = notes[(i + 1) % len(notes)]
    url = f"{BASE}/notes/{n['slug']}"
    share_href = "https://www.linkedin.com/sharing/share-offsite/?url=" + url
    body = (
        f'<section class="art-hero"><div class="wrap"><a class="back" href="/notes">← Systems Notes</a>{meta_line(n)}'
        f'<h1>{e(n["title"])}</h1><p class="dek">{e(n["dek"])}</p></div></section>'
        f'<figure class="art-photo"><img src="{img(n)}" alt="{e(n["alt"])}"><figcaption>{e(n["caption"])}</figcaption></figure>'
        f'<article class="art-body">{n["body"]}<div class="art-foot"><span class="meta"><b>{e(n["topic"])}</b><span>Systems Notes · LOVELEEDAY</span></span>'
        f'<a class="share" href="{share_href}" target="_blank" rel="noopener">Share on LinkedIn ↗</a></div></article>'
        f'<section class="next"><div class="wrap"><a href="/notes/{nxt["slug"]}"><div><span class="eyebrow">Next note</span><h2>{e(nxt["title"])}</h2></div>'
        f'<img src="{img(nxt)}" alt="{e(nxt["alt"])}" loading="lazy"></a></div></section>'
    )
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Article", "headline": n["title"].rstrip("."), "description": n["dek"], "image": BASE + share(n),
         "datePublished": n["date"], "dateModified": n["date"], "url": url, "mainEntityOfPage": url,
         "author": {"@type": "Organization", "name": "LOVELEEDAY Studios", "url": BASE + "/"},
         "publisher": {"@type": "Organization", "name": "LOVELEEDAY Studios", "url": BASE + "/"}},
        crumbs([{"@type": "ListItem", "position": 3, "name": n["title"].rstrip("."), "item": url}])]}
    page = (head(f"{n['title'].rstrip('.')} — Systems Notes — LOVELEEDAY", n["dek"], f"/notes/{n['slug']}", share(n), ld)
            + '<body class="">' + nav_t[nav_t.find('<a class="skip"'):] + '<main id="main">' + body + "</main>" + foot_t)
    (SITE / "notes" / f"{n['slug']}.html").write_text(page)

# ---------- css, sitemap data, share cards ----------
(SITE / "assets/notes.css").write_text((NOTES / "notes.css").read_text())
(ROOT / "src/content/notes.json").write_text(json.dumps([{"slug": n["slug"], "date": n["date"]} for n in notes], indent=2) + "\n")
cards = "".join(
    f'<div class="card" id="share-{n["n"]}"><img src="../../../public/site/assets/notes/{n["photo"]}" alt="">'
    f'<div class="txt"><span class="k">Systems Notes · {n["n"]}</span><h1>{e(n["title"])}</h1><span class="brand">LOVELEEDAY</span></div></div>'
    for n in notes)
(NOTES / "_share.html").write_text(
    "<!doctype html><meta charset=utf-8><style>body{margin:0;background:#fff;font-family:-apple-system,Helvetica,Arial,sans-serif}"
    ".card{width:1200px;height:630px;display:grid;grid-template-columns:560px 1fr;background:#f5f5f7;color:#1d1d1f}"
    ".card img{width:560px;height:630px;object-fit:cover}.txt{padding:64px 60px;display:flex;flex-direction:column}"
    ".k{font-size:15px;letter-spacing:.2em;text-transform:uppercase;color:#777980;font-weight:600}"
    "h1{font-size:58px;line-height:1.04;letter-spacing:-.045em;font-weight:500;margin:28px 0 0;text-wrap:balance}"
    ".brand{margin-top:auto;font-size:17px;letter-spacing:.2em;font-weight:600}</style>" + cards)

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
