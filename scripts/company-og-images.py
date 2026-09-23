#!/usr/bin/env python3
"""
company-og-images — download each company's OWN share image (og:image) for a portfolio grid.

  python3 scripts/company-og-images.py data/lightship-companies.json lightshipcapital

Why: lightship.capital stores its portfolio photos pre-faded (they colour in on hover), so
scraping the fund's page gives washed-out tiles. The company's own og:image is full colour and
is the picture the company itself chose to represent it. Falls back to the fund-page image in
public/portal/<slug>/portfolio/ (auto-contrasted) when a company has none. Prints what it used.
"""
import io, json, re, subprocess, sys, urllib.parse
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
rows = json.load(open(sys.argv[1]))
out = ROOT / "public" / "portal" / sys.argv[2] / "portfolio"
out.mkdir(parents=True, exist_ok=True)


def fetch(u):
    return subprocess.run(["curl", "-sL", "-m", "25", "-A", "Mozilla/5.0", u], capture_output=True).stdout


def slugify(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


result = []
for r in rows:
    name = r["company"]; s = slugify(name)
    src = r.get("og_image_url")
    how, im = None, None
    if src and r.get("og_image_reachable") is not False:
        try:
            im = Image.open(io.BytesIO(fetch(urllib.parse.urljoin(r.get("final_url") or r["requested_url"], src)))).convert("RGB")
            how = "company og:image"
        except Exception:
            im = None
    if im is None:
        host = urllib.parse.urlparse(r.get("fund_outbound_link") or r["requested_url"]).hostname or ""
        cand = out / f"{host.replace('www.', '').split('.')[0]}.jpg"
        if cand.exists():
            im = ImageOps.autocontrast(Image.open(cand).convert("RGB"), cutoff=2)
            how = "fund page (contrast restored)"
    if im is None:
        result.append((name, None, "none")); continue
    im.thumbnail((1000, 750), Image.LANCZOS)  # keep the whole image; the page decides crop vs. contain
    p = out / f"og-{s}.jpg"
    im.save(p, "JPEG", quality=82, progressive=True, optimize=True)
    result.append((name, f"portfolio/{p.name}", how))
for x in result:
    print(" | ".join(str(y) for y in x))
