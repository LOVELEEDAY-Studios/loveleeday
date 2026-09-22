#!/usr/bin/env python3
"""
measure-portfolio — Lighthouse + CrUX numbers for every site in a fund's portfolio.

The Collab Capital study quotes median mobile performance, median SEO and how many
companies have no CrUX field data. Those figures are what make a portfolio page an
argument rather than an opinion, and the script that produced them did not survive
into the repo. This is that script, rebuilt.

Uses the public PageSpeed Insights API, which serves Lighthouse AND the CrUX field
record in one call and needs no key at low volume. PSI is slow (20-40s per URL) and
rate-limits, so calls run few-at-a-time with backoff rather than all at once.

  python3 scripts/measure-portfolio.py lightship
  python3 scripts/measure-portfolio.py lightship --out data/lightship-measured.json

Absence of a CrUX record is itself a finding: it means the site has too few real
visitors for Google to report on. Record it as null, never as a zero.
"""
import json, sys, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PSI = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"

PORTFOLIOS = {
    "lightship": [
        ("Visuwall", "https://visuwall.com/"),
        ("Proov", "https://proovtest.com/"),
        ("Allergy Amulet", "https://allergyamulet.com/"),
        ("Healthy Roots Dolls", "https://healthyrootsdolls.com/"),
        ("Boddle", "https://boddlelearning.com/"),
        ("Undock", "https://undock.com/"),
        ("Haute Hijab", "https://hautehijab.com/"),
        ("Femi Secrets", "https://femisecrets.com/"),
        ("Vyrill", "https://vyrill.com/"),
        ("Fresh Fry", "https://freshfry.me/"),
        ("Kare Mobile", "https://karemobile.com/"),
        ("Enable Injections", "https://enableinjections.com/"),
        ("Arbit", "https://getarbit.com/"),
        ("CurlMix", "https://curlmix.com/"),
        ("Brevity", "https://brevitypitch.com/"),
        ("CModel", "https://cmodel.io/"),
        # Bootup and Semiosis AI are excluded on purpose: joinbootup.com is a lapsed
        # domain serving unrelated content and semiosis-ai.com 404s. Measuring them
        # would put a performance score on a site the company no longer controls.
    ],
    "venturehue": [
        ("VentureHue", "https://venturehue.com/"),
        ("Career Karma", "https://careerkarma.com/"),
        ("Upright Oats", "https://uprightoats.com/"),
        ("Small Business Brain", "https://smallbusinessbrain.com/"),
        ("Link to Any", "https://linktoany.com/"),
        ("Paladin", "https://joinpaladin.com/"),
    ],
    "hundredkm": [
        ("Novarna", "https://novarna.ai/"),
        ("Femly", "https://femly.com/"),
        ("iCardio.ai", "https://icardio.ai/"),
        ("Dopl Technologies", "https://dopltechnologies.com/"),
        ("Scout Space", "https://scout.space/"),
        ("Opine", "https://tryopine.com/"),
        ("Beam Dynamics", "https://beamdynamics.io/"),
        ("Bump", "https://usebump.com/"),
        ("Health In Her HUE", "https://healthinherhue.com/"),
        ("Axal", "https://axal.ai/"),
    ],
}


def measure(name_url, attempt=0):
    name, url = name_url
    q = urllib.parse.urlencode(
        [("url", url), ("strategy", "mobile")]
        + [("category", c) for c in ("performance", "seo", "accessibility", "best-practices")]
    )
    try:
        with urllib.request.urlopen(f"{PSI}?{q}", timeout=120) as r:
            d = json.loads(r.read())
    except Exception as e:
        if attempt < 2:
            time.sleep(8 * (attempt + 1))
            return measure(name_url, attempt + 1)
        return {"company": name, "url": url, "error": str(e)[:120]}

    cats = d.get("lighthouseResult", {}).get("categories", {})
    def score(k):
        s = cats.get(k, {}).get("score")
        return round(s * 100) if isinstance(s, (int, float)) else None

    # No CrUX record means too little real traffic for Google to report. null, not 0.
    loading = d.get("loadingExperience", {}).get("metrics")
    crux = None
    if loading:
        lcp = loading.get("LARGEST_CONTENTFUL_PAINT_MS", {}).get("percentile")
        cls = loading.get("CUMULATIVE_LAYOUT_SHIFT_SCORE", {}).get("percentile")
        crux = {"lcp_ms": lcp, "cls": (cls / 100 if cls is not None else None)}

    return {
        "company": name,
        "url": url,
        "performance": score("performance"),
        "seo": score("seo"),
        "accessibility": score("accessibility"),
        "best_practices": score("best-practices"),
        "crux": crux,
        "final_url": d.get("lighthouseResult", {}).get("finalUrl") or url,
    }


def median(xs):
    xs = sorted(x for x in xs if x is not None)
    if not xs:
        return None
    m = len(xs) // 2
    return xs[m] if len(xs) % 2 else (xs[m - 1] + xs[m]) // 2


if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else ""
    if which not in PORTFOLIOS:
        print(__doc__)
        print("portfolios:", ", ".join(PORTFOLIOS))
        sys.exit(1)

    targets = PORTFOLIOS[which]
    print(f"measuring {len(targets)} sites for {which} — PSI is slow, expect a few minutes")
    with ThreadPoolExecutor(max_workers=1) as pool:
        rows = list(pool.map(measure, targets))

    ok = [r for r in rows if "error" not in r]
    print(f"\n{'company':<22} {'perf':>5} {'seo':>5} {'a11y':>5} {'crux'}")
    for r in sorted(rows, key=lambda x: (x.get("performance") is None, x.get("performance") or 0)):
        if "error" in r:
            print(f"{r['company']:<22} {'—':>5} {'—':>5} {'—':>5}  ERROR {r['error'][:50]}")
            continue
        c = r["crux"]
        cs = f"LCP {c['lcp_ms']}ms" if c and c.get("lcp_ms") else "no field data"
        print(f"{r['company']:<22} {str(r['performance']):>5} {str(r['seo']):>5} {str(r['accessibility']):>5}  {cs}")

    no_crux = sum(1 for r in ok if not r.get("crux"))
    print(f"\nmedian performance {median([r['performance'] for r in ok])} · "
          f"median seo {median([r['seo'] for r in ok])} · "
          f"{no_crux} of {len(ok)} with no CrUX field data · "
          f"{len(rows) - len(ok)} failed")

    out = ROOT / "data" / f"{which}-measured.json"
    out.parent.mkdir(exist_ok=True)
    out.write_text(json.dumps(rows, indent=2))
    print("wrote", out)
