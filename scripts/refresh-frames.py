#!/usr/bin/env python3
"""
refresh-frames — re-shoot every portfolio AFTER frame that is older than the
study it claims to show.

This exists because of a real failure on 2026-09-22. Enable's study was edited at
14:52 to carry the client's real device photograph and their Roche and Sobi
partner marks. The portfolio page kept showing enable-after.jpg, captured at
14:20. Daniel looked at the page and said "nothing about enable injections has
changed" — and he was right, because a portfolio page never shows the live study.
It shows a JPG of it. Editing the study changes nothing a client can see until
the frame is re-shot.

A screenshot is a CACHE with no invalidation. So the invalidation lives here: any
AFTER frame whose mtime predates its study's index.html is stale by definition,
and this re-shoots it. Run it after touching any study, and before any commit a
client will see.

  python3 scripts/refresh-frames.py            # re-shoot only what is stale
  python3 scripts/refresh-frames.py --check    # exit 2 if anything is stale, shoot nothing
  python3 scripts/refresh-frames.py --all      # re-shoot everything
"""
import io, sys
from pathlib import Path
from patchright.sync_api import sync_playwright
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PORTAL = ROOT / "public" / "portal"
W, H = 1440, 900

SCROLL = """async () => {
  const step = Math.floor(window.innerHeight * 0.7);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 200));
  }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 500));
}"""


def pairs():
    """Every AFTER frame, matched to the study it is a picture of."""
    for f in sorted(PORTAL.glob("*/*-after.jpg")):
        slug = f.name[: -len("-after.jpg")]
        study = PORTAL / slug / "index.html"
        if study.exists():
            yield f, study


if __name__ == "__main__":
    check_only = "--check" in sys.argv
    do_all = "--all" in sys.argv

    work = []
    for frame, study in pairs():
        age = study.stat().st_mtime - frame.stat().st_mtime
        if do_all or age > 0:
            work.append((frame, study, age))

    if not work:
        print(f"all {sum(1 for _ in pairs())} frames current")
        sys.exit(0)

    for frame, study, age in work:
        print(f"STALE  {frame.relative_to(ROOT)}  ({age / 60:.0f} min behind its study)")
    if check_only:
        print(f"\n{len(work)} stale frame(s) — a client would see the old build. Run without --check.")
        sys.exit(2)

    with sync_playwright() as pw:
        b = pw.chromium.launch(channel="chrome", headless=True)
        pg = b.new_page(viewport={"width": W, "height": H}, reduced_motion="reduce", device_scale_factor=1)
        for frame, study, _ in work:
            pg.goto(f"file://{study}", wait_until="load", timeout=45000)
            pg.wait_for_timeout(1200)
            pg.evaluate(SCROLL)
            # A study that renders near-blank is a capture bug, not a design. Saving
            # it would overwrite a good frame with a worse one — refuse instead.
            im = Image.open(io.BytesIO(pg.screenshot(full_page=False))).convert("RGB")
            if len(im.convert("L").getcolors(maxcolors=256) or [(0, 0)]) < 4:
                print(f"  REFUSED {frame.name} — captured near-blank, not saving over a good frame")
                continue
            im.save(frame, quality=90)
            print(f"  wrote   {frame.relative_to(ROOT)}")
        b.close()
