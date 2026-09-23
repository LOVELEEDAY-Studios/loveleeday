"""Adds a quiet "Client login" link to the footer's "The studio" column on every
static page (not the header: the header sells to prospects; clients reach the
portal from their invite email or bookmark, and this is the fallback).
Idempotent.

  python3 scripts/add-client-login-link.py
"""
import pathlib
import re

SITE = pathlib.Path(__file__).resolve().parent.parent / "concepts/studio/site"
LINK = '<a href="https://portal.loveleedaystudios.com/client/login">Client login</a>'
COL = re.compile(r'(<div class="footer-col"><strong>The studio</strong>.*?)(</div>)', re.S)

changed = 0
for page in sorted(SITE.glob("*.html")):
    t = page.read_text()
    if LINK in t:
        continue
    t2, n = COL.subn(lambda m: m.group(1) + LINK + m.group(2), t, count=1)
    if n:
        page.write_text(t2)
        changed += 1
print(f"added Client login to {changed} pages")
