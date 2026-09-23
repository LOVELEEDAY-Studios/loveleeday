#!/usr/bin/env python3
"""
capture-before — screenshot a LIVE prospect site to become the "before" frame.

The 2026-09-19 before/after frames were captured by hand in one batch and no
script survived, so the next fund's studies had nothing to start from. This is
that script. It uses patchright rather than plain playwright because several
targets sit behind Cloudflare, and a challenge page captured as a "before" is a
lie about the prospect's site.

  python3 scripts/capture-before.py enable https://enableinjections.com/
  python3 scripts/capture-before.py --all            re-capture everything in TARGETS

Writes public/portal/<slug>/<slug>-before.jpg at the portal's frame size, and a
full-page PNG beside it so the design work has the whole page to read.
"""
import sys, io, os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
W, H = 1440, 900
JPG_Q = 88

# slug -> live url. Additive: a fund's targets land here as they are chosen.
TARGETS = {
    "enable": "https://enableinjections.com/",
    "undock": "https://undock.com/",
    "cmodel": "https://cmodel.io/",
    "venturehue": "https://venturehue.com/",
    "meknology": "https://www.meknology.com/",
}


def shot(slug: str, url: str) -> int:
    from patchright.sync_api import sync_playwright
    from PIL import Image

    out_dir = ROOT / "public" / "portal" / slug
    out_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as pw:
        b = pw.chromium.launch(channel="chrome", headless=True)
        pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        try:
            pg.goto(url, wait_until="networkidle", timeout=45000)
        except Exception:
            # networkidle never settles on sites with polling widgets; a load is enough.
            try:
                pg.goto(url, wait_until="load", timeout=45000)
            except Exception as e:
                print(f"{slug}: FAILED to load {url} — {e}")
                b.close()
                return 1
        pg.wait_for_timeout(2500)

        # Scroll the whole page before the full-page shot, or lazy-loaded images
        # never fire and the capture invents a blank site.
        #
        # 2026-09-22: enableinjections.com carries 60 `data-lazy` attributes with
        # inline SVG placeholders in `src`. A straight full_page screenshot showed
        # ~5,000px of white and read as a catastrophically broken homepage. It is
        # not broken — the capture was. A "before" frame that libels the prospect
        # is worse than no frame at all, because it is the one thing we show them.
        pg.evaluate(
            """async () => {
                const step = Math.floor(window.innerHeight * 0.8);
                for (let y = 0; y < document.body.scrollHeight; y += step) {
                    window.scrollTo(0, y);
                    await new Promise(r => setTimeout(r, 320));
                }
                window.scrollTo(0, 0);
                await new Promise(r => setTimeout(r, 600));
            }"""
        )
        try:
            pg.wait_for_load_state("networkidle", timeout=12000)
        except Exception:
            pass

        title = (pg.title() or "").strip()
        # A Cloudflare interstitial captured as a "before" would misrepresent the
        # prospect's own site. Refuse rather than ship a frame that is not theirs.
        if "just a moment" in title.lower() or "attention required" in title.lower():
            print(f"{slug}: BLOCKED by bot challenge (title={title!r}) — refusing to save a false before")
            b.close()
            return 2

        fold = Image.open(io.BytesIO(pg.screenshot(full_page=False))).convert("RGB")
        fold.save(out_dir / f"{slug}-before.jpg", quality=JPG_Q)
        full = Image.open(io.BytesIO(pg.screenshot(full_page=True))).convert("RGB")
        full.save(out_dir / f"{slug}-before-full.png")
        print(f"{slug}: {title[:60]!r} -> {fold.size} fold, {full.size} full")
        b.close()
    return 0


if __name__ == "__main__":
    args = sys.argv[1:]
    if args[:1] == ["--all"]:
        rc = max(shot(s, u) for s, u in TARGETS.items())
    elif len(args) == 2:
        rc = shot(args[0], args[1])
    elif len(args) == 1 and args[0] in TARGETS:
        rc = shot(args[0], TARGETS[args[0]])
    else:
        print(__doc__)
        rc = 1
    sys.exit(rc)
