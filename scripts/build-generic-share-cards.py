#!/usr/bin/env python3
"""Rebuild the two generic share cards (public/site/assets/share-home.jpg and share.jpg) from clean photographs.

The old pair had the headline baked into the photograph and clipped mid-word. These are composed fresh:
1200x630, 80 px margins, a navy scrim on the left, the line set in Sentient and the wordmark in Switzer (the
site's own fonts, read from public/site/assets/fonts), copy taken from the home page's og:title.
Photos are cropped, never enlarged: both sources are 1880 px wide and are used at 0.8x or smaller.

Needs Pillow and fontTools+brotli (woff2 -> ttf, cached next to this run in --cache, default /tmp).
Usage: python3 scripts/build-generic-share-cards.py [--cache DIR]
"""
import pathlib, re, sys
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
A = ROOT / "public/site/assets"
cache = pathlib.Path(sys.argv[sys.argv.index("--cache") + 1]) if "--cache" in sys.argv else pathlib.Path("/tmp")
W, H, M = 1200, 630, 80
NAVY = (22, 36, 58)
TAN = (213, 177, 133)


def ttf(name):
    out = cache / (name + ".ttf")
    if not out.exists():
        f = TTFont(A / "fonts" / (name + ".woff2")); f.flavor = None; f.save(out)
    return str(out)


def title():
    s = (ROOT / "public/site/index.html").read_text()
    t = re.search(r'property="og:title" content="([^"]*)"', s) or re.search(r'name="og:title" content="([^"]*)"', s)
    t = t.group(1).split("—", 1)[-1].strip()
    return t


def spaced(d, xy, text, font, fill, track):
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill)
        x += d.textlength(ch, font=font) + track
    return x


def card(photo, out, focus_x):
    im = Image.open(A / photo).convert("RGB")
    s = 0.8
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x0 = round((im.width - W) * focus_x); y0 = round((im.height - H) * 0.3)
    bg = im.crop((x0, y0, x0 + W, y0 + H)).convert("RGBA")
    scrim = Image.new("RGBA", (W, H), NAVY + (0,))
    px = scrim.load()
    for x in range(W):
        a = 0.94 if x < 220 else max(0.0, 0.94 * (1 - (x - 220) / 760))
        for y in range(H):
            px[x, y] = NAVY + (int(255 * min(1, a + (0.28 * max(0, (y - 300) / 330)))),)
    bg = Image.alpha_composite(bg, scrim)
    d = ImageDraw.Draw(bg)

    mark = Image.open(A / "notes/mark-white.png").convert("RGBA").resize((28, 28), Image.LANCZOS)
    bg.alpha_composite(mark, (M, 58))
    spaced(d, (M + 40, 61), "LOVELEEDAY", ImageFont.truetype(ttf("switzer-600"), 19), (255, 255, 255), 3.4)

    line = title()
    words = line.split()
    # two lines, balanced on the word boundary nearest the middle
    best = min(range(1, len(words)), key=lambda i: abs(len(" ".join(words[:i])) - len(" ".join(words[i:]))))
    l1, l2 = " ".join(words[:best]), " ".join(words[best:])
    size = 68
    f = ImageFont.truetype(ttf("sentient-500"), size)
    while max(d.textlength(l1, font=f), d.textlength(l2, font=f)) > W - 2 * M - 360 and size > 40:
        size -= 2; f = ImageFont.truetype(ttf("sentient-500"), size)
    lh = round(size * 1.08)
    y = H - M - 2 * lh + 6
    d.text((M, y), l1, font=f, fill=(255, 255, 255))
    d.text((M, y + lh), l2, font=f, fill=TAN)
    bg.convert("RGB").save(A / out, quality=90, optimize=True)
    print(out, size, repr(l1), repr(l2))


card("industry-nonprofit-2.jpg", "share-home.jpg", 1.0)
card("industry-professional-services-2.jpg", "share.jpg", 1.0)
