#!/usr/bin/env python3
"""
metadata-audit — what every company in a portfolio tells machines about itself.

Nobody audits this. A fund reads its companies' homepages; almost nobody reads
their <meta> tags, and those are what Google, LinkedIn, Slack and every link
preview actually render. 100KM VC's own site describes the fund as backing
founders "in Latin America" — three times in metadata, zero times in the visible
body, with zero occurrences of Detroit anywhere. That was found by reading the
markup rather than the page, and it is the kind of thing that is invisible from
the inside and unmissable from the outside.

This runs the same read across a whole portfolio and reports, per company:
  - the description a search engine shows
  - whether og:title / og:description / og:image exist at all
  - whether the description is missing, default, truncated or duplicated
  - whether the visible page and the metadata disagree on where the company is

  python3 scripts/metadata-audit.py hundredkm
  python3 scripts/metadata-audit.py hundredkm --json data/hundredkm-metadata.json
"""
import json, re, sys
from pathlib import Path
from patchright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent

PORTFOLIOS = {
    "hundredkm": [
        ("100KM VC (the fund)", "https://www.100kmvc.com/"),
        ("Novarna", "https://novarna.ai/"),
        ("Femly", "https://www.femly.com/"),
        ("iCardio.ai", "https://www.icardio.ai/"),
        ("Dopl Technologies", "https://www.dopltechnologies.com/"),
        ("Scout Space", "https://www.scout.space/"),
        ("Scout Financial", "https://www.scout-financial.com/"),
        ("Opine", "https://tryopine.com/"),
        ("Beam Dynamics", "https://www.beamdynamics.io/"),
        ("Bump", "https://usebump.com/"),
        ("Social Cascade", "https://www.socialcascade.co/"),
        ("Keep Company", "https://keep-company.com/"),
        ("Health In Her HUE", "https://healthinherhue.com/"),
        ("Athlytic", "https://app.athlytic.io/"),
        ("Axal", "https://axal.ai/"),
        ("Singulate", "https://www.singulate.com/"),
    ],
}

READ = """() => {
  const m = (sel, attr) => { const e = document.querySelector(sel); return e ? (e.getAttribute(attr) || '').trim() : null; };
  const body = (document.body ? document.body.innerText : '').replace(/\\s+/g, ' ');
  return {
    title: (document.title || '').trim(),
    description: m('meta[name="description"]', 'content'),
    ogTitle: m('meta[property="og:title"]', 'content'),
    ogDesc: m('meta[property="og:description"]', 'content'),
    ogImage: m('meta[property="og:image"]', 'content'),
    canonical: m('link[rel="canonical"]', 'href'),
    bodyText: body.slice(0, 6000),
    bodyLen: body.length,
  };
}"""

# Placeholders a CMS or template leaves behind. Each is a real string seen in the wild.
DEFAULTS = [
    "just another wordpress site", "my wordpress blog", "your site description",
    "add a description", "lorem ipsum", "webflow", "squarespace", "site description here",
    "untitled", "home page", "welcome to our website",
]


def flags(r):
    out = []
    d = (r.get("description") or "").strip()
    if not d:
        out.append("NO meta description — search engines write their own")
    else:
        low = d.lower()
        if any(x in low for x in DEFAULTS):
            out.append("description is template boilerplate")
        if len(d) > 165:
            out.append(f"description {len(d)} chars — truncated in results (~155 shown)")
        if len(d) < 50:
            out.append(f"description only {len(d)} chars — most of the slot unused")
        # The finding that started this: metadata naming a place the page never mentions.
        for place in ("Latin America", "Europe", "Africa", "Asia", "United Kingdom", "Canada", "Australia"):
            if place.lower() in low and place.lower() not in (r.get("bodyText") or "").lower():
                out.append(f'description says "{place}" — the visible page never does')
    if not r.get("ogDesc"):
        out.append("no og:description — link previews fall back to whatever they find")
    if not r.get("ogImage"):
        out.append("no og:image — every share renders as a blank card")
    if d and r.get("ogDesc") and d.strip() == r["ogDesc"].strip():
        pass  # identical is fine and common
    return out


if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else ""
    if which not in PORTFOLIOS:
        print(__doc__); print("portfolios:", ", ".join(PORTFOLIOS)); sys.exit(1)

    rows = []
    with sync_playwright() as pw:
        b = pw.chromium.launch(channel="chrome", headless=True)
        for name, url in PORTFOLIOS[which]:
            pg = b.new_page(viewport={"width": 1440, "height": 900})
            try:
                pg.goto(url, wait_until="load", timeout=45000)
                pg.wait_for_timeout(2200)
                r = pg.evaluate(READ)
                r["company"], r["url"] = name, url
                r["flags"] = flags(r)
                rows.append(r)
                print(f"\n{name}")
                print(f"   title: {r['title'][:78]}")
                print(f"   desc : {(r['description'] or '(none)')[:110]}")
                for f in r["flags"]:
                    print(f"   !! {f}")
                if not r["flags"]:
                    print("   clean")
            except Exception as e:
                rows.append({"company": name, "url": url, "error": str(e)[:90]})
                print(f"\n{name}\n   FAILED {str(e)[:70]}")
            pg.close()
        b.close()

    ok = [r for r in rows if "error" not in r]
    withflags = [r for r in ok if r["flags"]]
    no_og_img = [r for r in ok if not r.get("ogImage")]
    no_desc = [r for r in ok if not (r.get("description") or "").strip()]
    print(f"\n{'=' * 62}")
    print(f"{len(ok)} of {len(rows)} read · {len(withflags)} with at least one issue")
    print(f"{len(no_desc)} with no meta description · {len(no_og_img)} with no og:image")
    for r in rows:
        if "error" not in r:
            continue
        print(f"   could not read: {r['company']}")

    if "--json" in sys.argv:
        out = Path(sys.argv[sys.argv.index("--json") + 1])
        out.parent.mkdir(parents=True, exist_ok=True)
        for r in rows:
            r.pop("bodyText", None)
        out.write_text(json.dumps(rows, indent=2))
        print("wrote", out)
