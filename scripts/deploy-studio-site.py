"""Mount the approved twelve-page site as the live site.

The live app is a Next 16 project on Vercel at loveleedaystudios.com, and the
approved pages were static HTML in a concepts folder that Next does not serve,
so "deploy" here is a cutover rather than a push.

The app is kept rather than replaced, because it owns things the static site
needs or must not lose: /api/contact, which the project-brief form posts to;
the client portal under /p and /portal, which is noindex and handed out one
link at a time; and /work plus /work/[slug], which are real portfolio pages
with their own content. Only the OLD marketing routes are superseded.

Mechanism: the site is copied to public/site/ and mounted at clean URLs by
`beforeFiles` rewrites, which run ahead of app routing, so /  and /arthur
serve the new pages while the app keeps everything else. Nothing is deleted,
so the cutover reverses by removing the rewrites.

Two path rewrites are required by that move and are easy to get wrong:
 * assets are referenced relatively, and at a clean URL like /architecture a
   relative assets/x.jpg resolves to /assets/x.jpg, which does not exist. They
   become absolute /site/assets/.
 * internal links point at foo.html. They become the clean paths, and the
   canonical and og:url tags follow, so the indexed URL and the linked URL are
   the same string.

robots.txt and sitemap.xml are NOT copied: the app serves both from route
handlers, which win over public files. Shipping shadowed duplicates is how a
sitemap silently goes stale. Those handlers are updated instead.
"""

import pathlib
import re
import shutil

ROOT = pathlib.Path(".")
SRC = ROOT / "concepts" / "studio" / "site"
DEST = ROOT / "public" / "site"
ORIGIN = "https://loveleedaystudios.com"

PAGES = ["index", "operating-system", "arthur", "architecture", "use-cases",
         "industries", "municipal-review", "customer-data", "pricing-margins",
         "operational-intelligence", "principles", "studio", "privacy"]

def clean(name):
    return "/" if name == "index" else "/" + name

# ── copy, excluding what the app owns or what is review-only ─────────────────
if DEST.exists():
    shutil.rmtree(DEST)
shutil.copytree(SRC, DEST, ignore=shutil.ignore_patterns(
    "robots.txt", "sitemap.xml", "board.html", "board-shots", "test-site.mjs"))
print(f"copied {len(list(DEST.rglob('*')))} files to public/site/")

# ── rewrite paths for the mount point ────────────────────────────────────────
for name in PAGES:
    p = DEST / f"{name}.html"
    if not p.exists():
        raise SystemExit(f"BUILD STOPPED: {name}.html missing from the copy")
    t = p.read_text()

    t = t.replace('src="assets/', 'src="/site/assets/')
    t = t.replace('href="assets/', 'href="/site/assets/')
    t = t.replace("url(assets/", "url(/site/assets/")

    # Internal links and the tags that must agree with them.
    for other in PAGES:
        t = t.replace(f'href="{other}.html"', f'href="{clean(other)}"')
        t = t.replace(f'href="{other}.html#', f'href="{clean(other)}#')
        t = t.replace(f'href="{other}.html?', f'href="{clean(other)}?')
    t = t.replace(f'href="{ORIGIN}/index.html"', f'href="{ORIGIN}/"')
    for other in PAGES:
        t = t.replace(f'"{ORIGIN}/{other}.html"', f'"{ORIGIN}{clean(other)}"')

    # og:image, twitter:image and the JSON-LD logo are ABSOLUTE urls, so the
    # relative-path rewrite above does not touch them. Left alone they pointed
    # at /assets/, which does not exist at this mount point -- every social
    # share would have rendered a broken preview, and nothing on the page
    # itself would have looked wrong. Caught by resolving them against the
    # running server rather than by reading the markup.
    t = t.replace(f'{ORIGIN}/assets/', f'{ORIGIN}/site/assets/')

    left = re.findall(r'href="([a-z-]+\.html[^"]*)"', t)
    if left:
        raise SystemExit(f"BUILD STOPPED: {name}.html still links to {left[:3]}")
    stray = re.findall(r'(?:content|href|src)="' + re.escape(ORIGIN) + r'/assets/[^"]*"', t)
    if stray:
        raise SystemExit(f"BUILD STOPPED: {name}.html points at /assets/ which does "
                         f"not exist at the mount point: {stray[:2]}")
    p.write_text(t)
print("paths rewritten: assets absolute, links and canonicals on clean URLs")

# ── the stylesheet carries its own asset references ──────────────────────────
css = DEST / "assets" / "site.css"
c = css.read_text()
c2 = re.sub(r'url\((?!data:|/site/|https?:|["\']?#)(["\']?)([^)"\']+)\1\)',
            r'url(/site/assets/\2)', c)
if c2 != c:
    css.write_text(c2)
print(f"site.css: {len(re.findall(r'url\(/site/assets/', c2))} asset url(s) made absolute")

rules = "".join(
    f'      {{ source: "{clean(n)}", destination: "/site/{n}.html" }},\n' for n in PAGES)

cfg = ROOT / "next.config.ts"
s = cfg.read_text()
if "beforeFiles" in s:
    print("next.config.ts: rewrites already present, left alone")
    raise SystemExit(0)

REWRITES = f'''
  async rewrites() {{
    /* The approved marketing site is static HTML under public/site, mounted at
       clean URLs. beforeFiles runs ahead of app routing, so these win over the
       old (site) routes while /work, /p, /portal and /api keep working. The
       cutover reverses by deleting this block. */
    return {{
      beforeFiles: [
{rules}      ],
    }};
  }},

  async redirects() {{
    /* The old marketing routes the new site supersedes. 308 so the move is
       permanent and the link equity follows; /work stays because those are
       real portfolio pages the new site does not replace. */
    return [
      {{ source: "/about", destination: "/studio", permanent: true }},
      {{ source: "/contact", destination: "/studio", permanent: true }},
    ];
  }},
'''
anchor = "  async headers() {"
if anchor not in s:
    raise SystemExit("BUILD STOPPED: could not find headers() to anchor the rewrites")
cfg.write_text(s.replace(anchor, REWRITES.lstrip("\n") + "\n" + anchor, 1))
print(f"next.config.ts: {len(PAGES)} rewrites + 2 redirects")
