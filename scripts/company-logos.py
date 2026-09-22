#!/usr/bin/env python3
"""
company-logos — fetch the real logo of each company in a track record.

A portfolio list of names in bold type asserts a relationship. The companies'
own marks are what a reader recognises before they read anything, and every one
of these is public on the company's own site. Typing "Brex" is a claim; the Brex
logo is evidence.

Every mark comes from the COMPANY'S OWN SITE, read in a real browser:
  1. the <img> their header actually renders, picked as the widest image in the
     top 140px whose src or alt says logo/brand/wordmark;
  2. failing that, their apple-touch-icon, which is the square app mark;
  3. failing that, the largest <link rel=icon>.

Clearbit's logo API used to be the shortcut and it is GONE — logo.clearbit.com
no longer resolves in DNS at all, so a lookup through it fails at the network
layer and returns nothing for every company. A dead third party is exactly why
the company's own page is the canonical source here.

Anything that cannot be resolved is REPORTED, never substituted — a placeholder
box in a track record is worse than an honest omission.

  python3 scripts/company-logos.py venturehue
"""
import json, re, subprocess, sys
from pathlib import Path
from PIL import Image
import io

ROOT = Path(__file__).resolve().parent.parent
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36")

PORTFOLIOS = {
    "venturehue": [
        ("brex", "Brex", "brex.com"),
        ("noyo", "Noyo", "noyo.com"),
        ("careerkarma", "Career Karma", "careerkarma.com"),
        ("xphealth", "XP Health", "xphealth.co"),
        ("paladin", "Paladin", "joinpaladin.com"),
        ("bump", "Bump Capital", "usebump.com"),
        ("backstage", "Backstage Capital", "backstagecapital.com"),
        ("sbb", "Small Business Brain", "smallbusinessbrain.com"),
        ("bomalink", "BomaLink", "bomalink.com"),
    ],
}


def curl(url, binary=True, timeout=25):
    r = subprocess.run(
        ["curl", "-fsSL", "--max-time", str(timeout), "-A", UA, url],
        capture_output=True,
    )
    return r.stdout if r.returncode == 0 else None


FIND_LOGO = """() => {
  const abs = (u) => { try { return new URL(u, location.href).href; } catch { return null; } };
  const out = [];
  // 1. The SQUARE app mark, preferred. Nine companies displayed in one column
  //    have to meet at a consistent silhouette; one horizontal wordmark sitting
  //    among eight square icons reads as a mistake regardless of which is the
  //    "better" asset. apple-touch-icon is the mark the company itself chose to
  //    represent it at small size.
  for (const l of document.querySelectorAll('link[rel*="apple-touch-icon"]')) {
    const u = abs(l.getAttribute('href'));
    if (u) out.push({ u, score: 2000 + parseInt((l.getAttribute('sizes') || '0').split('x')[0] || 0, 10) });
  }
  // 2. Any declared icon, largest first. A 512px PWA icon is a real mark.
  for (const l of document.querySelectorAll('link[rel~="icon"]')) {
    const u = abs(l.getAttribute('href'));
    const sz = parseInt((l.getAttribute('sizes') || '0').split('x')[0] || 0, 10);
    if (u) out.push({ u, score: 1000 + sz });
  }
  // 3. Last resort: what their header renders. This is the path that returned a
  //    PRODUCT PHOTOGRAPH for Brex — a card and a phone, matched because the
  //    file path contained "header". Kept, but ranked below the declared marks
  //    and still checked by eye.
  for (const img of document.querySelectorAll('img')) {
    const r = img.getBoundingClientRect();
    if (r.top > 160 || r.width < 40) continue;
    const hay = ((img.getAttribute('src') || '') + ' ' + (img.getAttribute('alt') || '') +
                 ' ' + (img.className || '')).toLowerCase();
    if (!/logo|brand|wordmark/.test(hay)) continue;
    const u = abs(img.currentSrc || img.getAttribute('src'));
    if (u) out.push({ u, score: r.width });
  }
  // 4. The conventional path, which many sites serve without declaring.
  out.push({ u: abs('/apple-touch-icon.png'), score: 10 });
  out.push({ u: abs('/favicon.ico'), score: 5 });
  return out.filter(o => o.u).sort((a, b) => b.score - a.score).map(o => o.u).slice(0, 8);
}"""


def candidates(pg, domain):
    for scheme in ("https://", "https://www."):
        try:
            pg.goto(scheme + domain, wait_until="load", timeout=30000)
            pg.wait_for_timeout(1400)
            urls = pg.evaluate(FIND_LOGO)
            if urls:
                return urls
        except Exception:
            continue
    return []


def usable(raw):
    """A real mark, not a 1px tracker or an HTML error page."""
    if not raw or len(raw) < 900:
        return None
    try:
        im = Image.open(io.BytesIO(raw))
        im.load()
    except Exception:
        return None
    if min(im.size) < 48:
        return None
    return im


if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else ""
    if which not in PORTFOLIOS:
        print(__doc__); print("portfolios:", ", ".join(PORTFOLIOS)); sys.exit(1)

    out_dir = ROOT / "public" / "portal" / which / "logos"
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest, failed = [], []

    from patchright.sync_api import sync_playwright
    pw = sync_playwright().start()
    browser = pw.chromium.launch(channel="chrome", headless=True)
    pg = browser.new_page(viewport={"width": 1440, "height": 900})

    for key, name, domain in PORTFOLIOS[which]:
        im, source = None, None
        for url in candidates(pg, domain):
            raw = curl(url)
            # An SVG is the best possible source but Pillow cannot open one, so
            # it is rasterized through the browser rather than skipped.
            if url.lower().endswith(".svg") and raw:
                try:
                    pg.set_content(
                        f'<body style="margin:0;background:#fff">'
                        f'<img src="{url}" style="width:512px">')
                    pg.wait_for_timeout(700)
                    el = pg.query_selector("img")
                    raw = el.screenshot() if el else raw
                except Exception:
                    pass
            im = usable(raw)
            if im is not None:
                source = url
                break
        if im is None:
            failed.append((name, domain))
            print(f"  {name:<22} NOT RESOLVED — reporting rather than substituting")
            continue
        im = im.convert("RGBA")
        # Trim the transparent margin so every mark meets at the same optical
        # weight instead of at whatever padding its source happened to carry.
        bbox = im.getchannel("A").getbbox()
        if bbox:
            im = im.crop(bbox)
        dest = out_dir / f"{key}.png"
        im.save(dest)
        manifest.append({"key": key, "company": name, "domain": domain,
                         "file": f"logos/{dest.name}", "source": source,
                         "w": im.width, "h": im.height})
        print(f"  {name:<22} {im.width}x{im.height}  {dest.relative_to(ROOT)}")

    browser.close(); pw.stop()
    (out_dir / "sources.json").write_text(json.dumps(manifest, indent=2))
    print(f"\n{len(manifest)} of {len(PORTFOLIOS[which])} resolved -> {out_dir.relative_to(ROOT)}")
    if failed:
        print("unresolved (these stay as type on the page, never as a placeholder box):")
        for n, d in failed:
            print(f"  {n} ({d})")
