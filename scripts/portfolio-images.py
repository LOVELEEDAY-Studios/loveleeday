#!/usr/bin/env python3
"""
portfolio-images — one image per portfolio company, from the fund's own portfolio page.

  python3 scripts/portfolio-images.py lightshipcapital https://www.lightship.capital/portfolio

Renders the page in a real browser (Wix and similar builders draw images with JavaScript),
pairs each outbound company link with the largest image in the same card, downloads it to
public/portal/<slug>/portfolio/<company-slug>.jpg (resized, progressive JPEG) and prints a
JSON manifest. A company whose card has no usable image falls back to its own site's
share image (og:image). Anything still missing is reported, never silently skipped.
"""
import io, json, re, subprocess, sys, urllib.parse
from pathlib import Path
from patchright.sync_api import sync_playwright
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
slug, url = sys.argv[1], sys.argv[2]
out = ROOT / "public" / "portal" / slug / "portfolio"
out.mkdir(parents=True, exist_ok=True)

PAIR = """() => {
  const host = location.hostname.replace(/^www\\./, '');
  const res = [];
  for (const a of document.querySelectorAll('a[href^="http"]')) {
    let h; try { h = new URL(a.href).hostname.replace(/^www\\./, ''); } catch { continue; }
    if (h.includes(host) || /wix|facebook|twitter|linkedin|instagram|x\\.com|youtube|google/.test(h)) continue;
    // walk up until the container holds an image
    let el = a, img = null;
    for (let i = 0; i < 6 && el && !img; i++) {
      el = el.parentElement;
      if (!el) break;
      const imgs = [...el.querySelectorAll('img')].filter(i => i.naturalWidth > 150);
      imgs.sort((x, y) => y.naturalWidth * y.naturalHeight - x.naturalWidth * x.naturalHeight);
      img = imgs[0] || null;
    }
    const text = (el ? el.innerText : a.innerText).trim().split('\\n').filter(Boolean);
    res.push({href: a.href, img: img ? (img.currentSrc || img.src) : null, text: text.slice(0, 3)});
  }
  return res;
}"""


def fetch(u):
    return subprocess.run(["curl", "-sL", "-m", "25", "-A", "Mozilla/5.0", u], capture_output=True).stdout


def save(data, name):
    im = Image.open(io.BytesIO(data)).convert("RGB")
    im.thumbnail((900, 900))
    p = out / f"{name}.jpg"
    im.save(p, "JPEG", quality=82, progressive=True, optimize=True)
    return p, im.size


with sync_playwright() as pw:
    b = pw.chromium.launch(channel="chrome", headless=True)
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.goto(url, wait_until="load", timeout=60000)
    for y in range(0, 20000, 700):
        pg.evaluate(f"scrollTo(0,{y})"); pg.wait_for_timeout(120)
    pg.wait_for_timeout(1500)
    pairs = pg.evaluate(PAIR)
    b.close()

seen, manifest, missing = set(), [], []
for p in pairs:
    host = urllib.parse.urlparse(p["href"]).hostname.replace("www.", "")
    if host in seen:
        continue
    seen.add(host)
    name = re.sub(r"[^a-z0-9]+", "-", host.split(".")[0].lower())
    src, how = p["img"], "fund page"
    if not src:
        html = fetch(p["href"]).decode("utf-8", "ignore")
        m = re.search(r'property=["\']og:image["\'][^>]*content=["\']([^"\']+)', html) or \
            re.search(r'content=["\']([^"\']+)["\'][^>]*property=["\']og:image', html)
        src, how = (urllib.parse.urljoin(p["href"], m.group(1)), "company og:image") if m else (None, None)
    if not src:
        missing.append(host); continue
    try:
        path, size = save(fetch(src), name)
        manifest.append({"host": host, "href": p["href"], "text": p["text"], "file": f"portfolio/{path.name}", "size": size, "from": how})
    except Exception as e:
        missing.append(f"{host} ({e.__class__.__name__})")

(out / "manifest.json").write_text(json.dumps(manifest, indent=1))
print(json.dumps([{k: m[k] for k in ("host", "file", "size", "from")} for m in manifest], indent=0))
print("missing:", missing)
