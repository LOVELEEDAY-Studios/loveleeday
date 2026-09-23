#!/usr/bin/env python3
"""
gemini-review — an independent design review of a study page by Google Gemini.

  python3 scripts/gemini-review.py lightshipcapital [--model gemini-3.1-pro-preview] [--shots DIR]

Sends Gemini the page's visible text plus desktop and phone screenshots (from
scripts/render-study.py, default /tmp) and asks for a severity-ranked review with a
SHIP / DON'T SHIP verdict. A second model family catches what one family misses.
Key: GEMINI_API_KEY in ~/.arthur/vault/google-ai.env.
"""
import argparse, base64, html, io, json, re, subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ap = argparse.ArgumentParser()
ap.add_argument("slug")
ap.add_argument("--model", default="gemini-3.1-pro-preview")
ap.add_argument("--shots", default="/tmp")
ap.add_argument("--brief", default="")
a = ap.parse_args()

key = next(l.split("=", 1)[1].strip().strip("'\"") for l in open(Path.home() / ".arthur/vault/google-ai.env") if l.startswith("GEMINI_API_KEY="))
src = (ROOT / "public/portal" / a.slug / "index.html").read_text()
body = re.sub(r"<(script|style|svg)[^>]*>.*?</\1>", " ", src, flags=re.S)
text = " ".join(html.unescape(re.sub(r"<[^>]+>", " ", body)).split())[:12000]


def part(path, width):
    im = Image.open(path).convert("RGB")
    if im.size[0] > width:
        im = im.resize((width, int(im.size[1] * width / im.size[0])))
    # Gemini accepts tall images, but keep each under ~8000px high by splitting
    parts = []
    for y in range(0, im.size[1], 3000):
        b = io.BytesIO(); im.crop((0, y, im.size[0], min(y + 3000, im.size[1]))).save(b, "JPEG", quality=80)
        parts.append({"inline_data": {"mime_type": "image/jpeg", "data": base64.b64encode(b.getvalue()).decode()}})
    return parts

shots = Path(a.shots)
imgs = part(shots / f"{a.slug}-d-full.png", 1000) + part(shots / f"{a.slug}-m-full.png", 390)
prompt = f"""You are the final sign-off reviewer at a top design studio. Review this homepage redesign
(desktop screenshots first, then phone screenshots at 390px). {a.brief}
Visible page text: {text}

Judge it as a demanding creative director and a conversion lead would: visual hierarchy, typography,
spacing and alignment, image quality and consistency, color, mobile layout, accessibility, copy clarity
and credibility, and anything that looks broken, generic or AI-made. Only flag real, visible problems.
Return: 1) a numbered list, most severe first, each tagged [blocker]/[major]/[minor] with where and the
exact fix; 2) a one-line verdict: SHIP or DON'T SHIP, and why."""
req = {"contents": [{"parts": [{"text": prompt}] + imgs}], "generationConfig": {"temperature": 0.2}}
out = subprocess.run(["curl", "-s", "-X", "POST", "-H", "Content-Type: application/json",
                      f"https://generativelanguage.googleapis.com/v1beta/models/{a.model}:generateContent?key={key}",
                      "--data-binary", "@-"], input=json.dumps(req), capture_output=True, text=True).stdout
d = json.loads(out)
if "candidates" not in d:
    raise SystemExit(json.dumps(d)[:800])
print("".join(p.get("text", "") for p in d["candidates"][0]["content"]["parts"]))
