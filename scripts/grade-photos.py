#!/usr/bin/env python3
"""Apply the brand book's one grade to photo-candidates originals and export web sizes.

Usage: python3 scripts/grade-photos.py [slot-key ...]   (no args = every slot)
Reads originals from brand/photo-candidates (never modified), writes
public/site/assets/photos/<shot-slug>-<pexels-id>-<size>.jpg|webp.
Grade: neutral-warm white balance, gentle S-curve, blacks lifted to 6%, highlights to 96%,
saturation -8% (reds/oranges, yellow-greens, neon vests and blue crates pulled down more,
skin protected by a saturation mask), shadows nudged toward navy #16243A, cream/copper in
highlights. No sharpening, no grain, no upscaling (sizes above the source crop are skipped).
"""
import glob, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAND = os.environ.get("PHOTO_CANDIDATES", "/Users/danielmay/Projects/loveleeday/brand/photo-candidates")
OUT = os.path.join(ROOT, "public/site/assets/photos")

# Slots live in scripts/photo-slots.json: id, x0/y0 (fractions of the source), w (fraction of
# source width), optional flip, sizes [[label, ratio w/h, px width]].


def find(pid):
    return glob.glob(f"{CAND}/*/{pid}-*.jpg")[0]


def smooth(a, lo, hi):
    t = np.clip((a - lo) / (hi - lo), 0, 1)
    return t * t * (3 - 2 * t)


def rgb2hsv(rgb):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx = rgb.max(-1); mn = rgb.min(-1); d = mx - mn
    h = np.zeros_like(mx)
    m = d > 1e-6
    rc = m & (mx == r); gc = m & (mx == g) & ~rc; bc = m & ~rc & ~gc
    h[rc] = ((g - b)[rc] / d[rc]) % 6
    h[gc] = (b - r)[gc] / d[gc] + 2
    h[bc] = (r - g)[bc] / d[bc] + 4
    h = h / 6.0
    s = np.where(mx > 1e-6, d / np.maximum(mx, 1e-6), 0)
    return h, s, mx


def hsv2rgb(h, s, v):
    i = np.floor(h * 6).astype(int) % 6
    f = h * 6 - np.floor(h * 6)
    p = v * (1 - s); q = v * (1 - f * s); t = v * (1 - (1 - f) * s)
    out = np.zeros(h.shape + (3,))
    for k, (a, b, c) in enumerate([(v, t, p), (q, v, p), (p, v, t), (p, q, v), (t, p, v), (v, p, q)]):
        m = i == k
        out[..., 0][m] = a[m]; out[..., 1][m] = b[m]; out[..., 2][m] = c[m]
    return out


def grade(im):
    x = np.asarray(im.convert("RGB"), dtype=np.float32) / 255.0
    lum = x @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    mid = (lum > 0.2) & (lum < 0.85)
    mean = x[mid].mean(0) if mid.any() else x.reshape(-1, 3).mean(0)
    g = mean.mean()
    target = np.array([1.02, 1.0, 0.965]) * g           # neutral-warm
    gain = np.clip(target / np.maximum(mean, 1e-4), 0.93, 1.07)
    x = np.clip(x * (1 + 0.4 * (gain - 1)), 0, 1)          # 40% correction, never overcooked
    x = np.clip(x + 0.28 * (smooth(x, 0, 1) - x), 0, 1)     # gentle S-curve
    x = 0.06 + x * (0.96 - 0.06)                           # lifted blacks, highlights to 96%
    h, s, v = rgb2hsv(x)
    sat = np.full_like(s, 0.92)                            # global -8%
    red = (np.minimum(h, 1 - h) < 0.07) | ((h > 0.05) & (h < 0.11))
    sat = sat * (1 - 0.10 * smooth(s, 0.45, 0.85) * red)   # reds/oranges, skin (low s) protected
    sat = sat * (1 - 0.07 * ((h > 0.11) & (h < 0.22)))     # yellow-greens
    vest = ((h > 0.12) & (h < 0.25) & (s > 0.7)) | ((h > 0.52) & (h < 0.68) & (s > 0.6))
    sat = sat * (1 - 0.22 * smooth(s, 0.6, 0.9) * vest)    # neon vests, blue crates
    x = hsv2rgb(h, np.clip(s * sat, 0, 1), v)
    lum = x @ np.array([0.2126, 0.7152, 0.0722])
    navy = np.array([0x16, 0x24, 0x3A]) / 255.0
    cream = np.array([0xF4, 0xEA, 0xDA]) / 255.0
    ws = (1 - lum) ** 2 * 0.07
    wh = lum ** 3 * 0.04
    x = x * (1 - ws[..., None]) + navy * ws[..., None]
    x = x * (1 - wh[..., None]) + cream * wh[..., None]
    return Image.fromarray((np.clip(x, 0, 1) * 255 + 0.5).astype(np.uint8))


def export(key, pid, spec, sizes):
    f = find(pid)
    slug = os.path.basename(os.path.dirname(f)).split("-", 2)[2]
    src = Image.open(f).convert("RGB")
    W, H = src.size
    for label, ratio, width in sizes:
        w = int(W * spec["w"]); h = int(w / ratio)
        if h > H:
            h = H; w = int(h * ratio)
        x0 = int(W * spec["x0"]); y0 = int(H * spec["y0"])
        x0 = min(x0, W - w); y0 = min(y0, H - h)
        crop = src.crop((x0, y0, x0 + w, y0 + h))
        if spec.get("flip"):
            crop = crop.transpose(Image.FLIP_LEFT_RIGHT)
        if w < width:
            print(f"skip {key} {label}: crop {w}px < {width}px"); continue
        crop = crop.resize((width, round(width / ratio)), Image.LANCZOS)
        out = grade(crop)
        base = f"{OUT}/{slug}-{pid}-{label}"
        out.save(base + ".jpg", quality=82, optimize=True, progressive=True)
        out.save(base + ".webp", quality=80, method=6)
        print(f"{key}: {base}.jpg {out.size}")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    import json
    cfg = json.load(open(os.path.join(ROOT, "scripts/photo-slots.json")))
    want = sys.argv[1:]
    for key, c in cfg.items():
        if want and key not in want:
            continue
        sizes = [(s[0], s[1], s[2]) for s in c["sizes"]]
        export(key, c["id"], c, sizes)
