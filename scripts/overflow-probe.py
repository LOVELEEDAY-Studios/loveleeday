#!/usr/bin/env python3
"""
overflow-probe — find every element on a study that scrolls, and say what is in it.

A nested scrollbar is almost never intended on a marketing page. It appears when
a fixed-height container gets more content than it was sized for, and it reads to
a visitor as a broken widget: a little grey bar inside the page, usually holding
text that was never meant to be read in a 3-line window.

Run over HTTP, never file://. A CSS mask does not load across file:// origins,
so a study captured that way renders with its logo missing and saves clean.

  python3 scripts/overflow-probe.py novarna
  python3 scripts/overflow-probe.py novarna --shot /tmp/x.jpg
"""
import io, re, sys
from pathlib import Path
from patchright.sync_api import sync_playwright
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BASE = "http://localhost:3111"

SCROLL = """async () => {
  const step = Math.floor(window.innerHeight * 0.7);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 180));
  }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600));
}"""

# Kept in a file precisely so the regex survives. Passing this through a shell
# and a -c string mangled `/[\n\t ]+/` into an unterminated literal.
PROBE = """() => {
  const out = [];
  for (const el of document.querySelectorAll('*')) {
    const dx = el.scrollWidth - el.clientWidth;
    const dy = el.scrollHeight - el.clientHeight;
    if (dx <= 4 && dy <= 4) continue;
    if (el === document.documentElement || el === document.body) continue;
    const s = getComputedStyle(el);
    const ov = s.overflowX + '/' + s.overflowY;
    // A scrollBAR only appears when overflow is auto or scroll. hidden clips
    // silently and is usually deliberate, so it is reported separately.
    const bars = /auto|scroll/.test(ov);
    out.push({
      bar: bars,
      tag: el.tagName,
      cls: String(el.className || '').slice(0, 44),
      ov: ov,
      box: el.clientWidth + 'x' + el.clientHeight,
      content: el.scrollWidth + 'x' + el.scrollHeight,
      text: (el.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 110)
    });
  }
  return out;
}"""


def token_for(slug):
    tokens_src = (ROOT / "src" / "content" / "tokens.ts").read_text()
    env_for_key = dict(re.findall(r'(\w+):\s*tokO?p?t?i?o?n?a?l?\("([A-Z0-9_]+)"\)', tokens_src))
    proxy_src = (ROOT / "src" / "proxy.ts").read_text()
    dir_to_key = dict(re.findall(r"(\w+):\s*TOKENS\.(\w+)", proxy_src))
    var = env_for_key.get(dir_to_key.get(slug, ""), "")
    m = re.search(rf"^{var}=(\S+)", (ROOT / ".env.local").read_text(), re.M) if var else None
    return m.group(1) if m else None


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    slug = sys.argv[1]
    url = f"{BASE}/portal/{slug}/index.html"
    t = token_for(slug)
    if t:
        url += f"?k={t}"

    with sync_playwright() as pw:
        b = pw.chromium.launch(channel="chrome", headless=True)
        pg = b.new_page(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
        pg.goto(url, wait_until="load", timeout=45000)
        pg.wait_for_timeout(1400)
        pg.evaluate(SCROLL)
        rows = pg.evaluate(PROBE)

        bars = [r for r in rows if r["bar"]]
        clipped = [r for r in rows if not r["bar"]]
        print(f"{slug}: {len(bars)} element(s) showing a SCROLLBAR, {len(clipped)} clipping silently\n")
        for r in bars:
            print(f"  SCROLLBAR  <{r['tag'].lower()} class=\"{r['cls']}\">  overflow {r['ov']}")
            print(f"             box {r['box']} but content {r['content']}")
            print(f"             {r['text']}\n")
        for r in clipped[:6]:
            print(f"  clipped    <{r['tag'].lower()} class=\"{r['cls']}\">  {r['box']} -> {r['content']}  {r['text'][:60]}")

        if "--shot" in sys.argv:
            out = Path(sys.argv[sys.argv.index("--shot") + 1])
            im = Image.open(io.BytesIO(pg.screenshot(full_page=True))).convert("RGB")
            im.resize((im.width // 2, im.height // 2)).save(out, quality=85)
            print(f"\nwrote {out}  (full page {im.size})")
        b.close()
    sys.exit(2 if bars else 0)
