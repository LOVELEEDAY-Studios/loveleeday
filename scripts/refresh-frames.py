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
import io, re, sys, urllib.request
from pathlib import Path
from patchright.sync_api import sync_playwright
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PORTAL = ROOT / "public" / "portal"
W, H = 1440, 900
BASE = "http://localhost:3111"


def gate_tokens():
    """dir -> its ?k= token, read from tokens.ts + .env.local.

    The gate param is `k`. Deriving env var names by upper-casing the TOKENS key
    does not work — venturehueStudy reads PORTAL_TOKEN_VENTUREHUE — so the real
    name comes out of tokens.ts.
    """
    tokens_src = (ROOT / "src" / "content" / "tokens.ts").read_text()
    env_for_key = dict(re.findall(r'(\w+):\s*tokO?p?t?i?o?n?a?l?\("([A-Z0-9_]+)"\)', tokens_src))
    env = (ROOT / ".env.local").read_text()
    proxy_src = (ROOT / "src" / "proxy.ts").read_text()
    out = {}
    # FOR_DIR maps a portal DIRECTORY to a TOKENS key; read it rather than guess.
    for dir_name, key in re.findall(r"(\w+):\s*TOKENS\.(\w+)", proxy_src):
        var = env_for_key.get(key)
        if not var:
            continue
        m = re.search(rf"^{var}=(\S+)", env, re.M)
        if m:
            out[dir_name] = m.group(1)
    return out


def http_up():
    try:
        urllib.request.urlopen(BASE, timeout=2)
        return True
    except Exception:
        return False

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

    # Capture over HTTP, not file://. Chromium refuses to load a CSS
    # mask-image across file:// origins, so a study whose logo is rendered as a
    # tintable mask captures with NO LOGO and saves clean — the frame a client
    # sees on the portfolio page would simply be missing the brand. Nothing
    # about that failure is loud: every computed style is correct, the file is
    # valid, and only looking at the pixels catches it. VentureHue hit this on
    # 2026-09-22. The dev server is therefore a REQUIREMENT for a re-shoot, not
    # a convenience; without it we refuse rather than write a degraded frame.
    tokens = gate_tokens()
    if not http_up():
        print(f"\n{BASE} is not responding — start the dev server (npm run dev) first.")
        print("Refusing to capture over file://: CSS masks do not load there and the")
        print("frames would save successfully with the logo missing.")
        sys.exit(3)

    with sync_playwright() as pw:
        b = pw.chromium.launch(channel="chrome", headless=True)
        pg = b.new_page(viewport={"width": W, "height": H}, reduced_motion="reduce", device_scale_factor=1)
        for frame, study, _ in work:
            slug = study.parent.name
            url = f"{BASE}/portal/{slug}/index.html"
            if slug in tokens:
                url += f"?k={tokens[slug]}"
            pg.goto(url, wait_until="load", timeout=45000)
            if pg.title().strip().lower().startswith(("404", "page not found")):
                print(f"  REFUSED {frame.name} — {url.split('?')[0]} returned a 404 page")
                continue
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
