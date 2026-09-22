#!/usr/bin/env python3
"""
check-portal-links — request every portal and fund URL the site claims to serve.

Why: on 2026-09-22 the Lightship fund page shipped with an "Open the full
package" button pointing at a route that 404'd, because the study had a token
and a built page but no entry in the file the client route reads. Nothing
failed at build time. The only thing that found it was loading the URL.

A grep of the content file is not this check. A route can 404 for reasons a
grep cannot see, and a grep can match a string that never becomes a path.

  python3 scripts/check-portal-links.py                 # against localhost:3111
  BASE=https://loveleedaystudios.com python3 scripts/check-portal-links.py
"""
import os, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = os.environ.get("BASE", "http://localhost:3111")

env = {}
for line in (ROOT / ".env.local").read_text().splitlines():
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip()


def tok(name):
    return env.get(name)


# Client portals: token var -> the deliverable slugs its entry declares.
portals_src = (ROOT / "src" / "content" / "portals.ts").read_text()
entries = re.findall(r'token:\s*TOKENS\.(\w+)[^}]*?client:\s*"([^"]+)"', portals_src, re.S)
slugs_by_client = {}
for block in portals_src.split("token: TOKENS.")[1:]:
    name = re.match(r"(\w+)", block).group(1)
    slugs_by_client[name] = re.findall(r'slug:\s*"([^"]+)"', block)

# TOKENS keys do not map onto env var names by upper-casing: venturehueStudy
# reads PORTAL_TOKEN_VENTUREHUE, because VentureHue needs both a study token and
# a fund token. Deriving the name gave a false miss on a route that actually
# returns 200 — read the real name out of tokens.ts instead. A checker that
# reports a miss that isn't there teaches you to ignore it.
tokens_src = (ROOT / "src" / "content" / "tokens.ts").read_text()
ENV_FOR_KEY = dict(re.findall(r'(\w+):\s*tokO?p?t?i?o?n?a?l?\("([A-Z0-9_]+)"\)', tokens_src))

targets = []
for key, client in entries:
    varname = ENV_FOR_KEY.get(key, f"PORTAL_TOKEN_{key.upper()}")
    t = tok(varname)
    if not t:
        targets.append((f"{client} (no {varname})", None))
        continue
    for slug in slugs_by_client.get(key, []):
        targets.append((f"{client} / {slug}", f"{BASE}/p/{t}/{slug}"))

# Fund studies.
portfolio_src = (ROOT / "src" / "content" / "portfolio.ts").read_text()
for key, fund in re.findall(r'token:\s*TOKENS\.(\w+),\s*\n\s*fund:\s*"([^"]+)"', portfolio_src):
    t = tok(f"PORTFOLIO_TOKEN_{key.upper()}")
    targets.append((f"{fund} (fund page)", f"{BASE}/p/portfolio/{t}" if t else None))

bad = 0
print(f"{len(targets)} URLs declared by the content files\n")
for label, url in targets:
    if not url:
        print(f"  {'SKIP':<6} {label} — no token in .env.local")
        bad += 1
        continue
    code = subprocess.run(
        ["curl", "-s", "-o", "/dev/null", "-m", "30", "-w", "%{http_code}", url],
        capture_output=True, text=True,
    ).stdout.strip()
    ok = code == "200"
    if not ok:
        bad += 1
    print(f"  {code:<6} {label}")

print(f"\n{len(targets) - bad} of {len(targets)} return 200")
sys.exit(1 if bad else 0)
