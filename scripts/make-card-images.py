#!/usr/bin/env python3
"""Resize the photographs shown as cards (industries index, industry pages, notes index, /build) to the size they
are displayed at, as WebP, into public/site/assets/cards/<stem>.webp. The full-size originals stay for hero use.
Usage: python3 scripts/make-card-images.py   (idempotent; skips an output newer than its source)"""
import os, glob
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")
OUT = os.path.join(ROOT, "site", "assets", "cards")
os.makedirs(OUT, exist_ok=True)
SOURCES = (
    glob.glob(os.path.join(ROOT, "site", "assets", "industry-*.jpg"))
    + glob.glob(os.path.join(ROOT, "site", "assets", "notes", "note-0*.jpg"))
    + glob.glob(os.path.join(ROOT, "portal", "collab", "*-after.jpg"))
)
W = 960
for src in sorted(SOURCES):
    stem = os.path.splitext(os.path.basename(src))[0]
    dst = os.path.join(OUT, stem + ".webp")
    if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
        continue
    im = Image.open(src).convert("RGB")
    h = round(im.height * W / im.width)
    im.resize((W, h), Image.LANCZOS).save(dst, "WEBP", quality=74, method=6)
    print(f"{stem}.webp {W}x{h} {os.path.getsize(dst)//1024} KB (was {os.path.getsize(src)//1024} KB)")
