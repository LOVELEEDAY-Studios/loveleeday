#!/usr/bin/env python3
"""Render the wordmark proof. A proof is not a mockup: it is the mark at the
   sizes and on the grounds it actually has to survive, with nothing else on the
   page to flatter it. Everything shown here is one colour, because a wordmark
   that needs two to work does not work."""
import json, sys
from pathlib import Path
import wordmark as W

HERE = Path(__file__).parent
GROUND, PAPER, INK, TEAL, LINE, DIM = "#FBF8F2", "#FFFFFF", "#16243A", "#0E7C7B", "#E6E0D6", "#667383"

CSS = f"""
body{{margin:0;background:{GROUND};color:{INK};padding:44px 40px 64px;
  font-family:ui-sans-serif,system-ui,sans-serif}}
h1{{font-size:20px;margin:0 0 8px;letter-spacing:-.01em}}
p.lede{{color:#45536A;font-size:13.5px;max-width:78ch;line-height:1.65;margin:0 0 34px}}
.row{{border-top:1px solid {LINE};padding:30px 0 26px}}
.meta{{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:20px;
  font-family:ui-monospace,monospace;font-size:10.5px;letter-spacing:.1em;
  text-transform:uppercase;color:{DIM}}}
.meta b{{font-size:13px;color:{INK};letter-spacing:.02em}}
.big svg{{display:block;height:84px;width:auto}}
.sizes{{display:flex;gap:40px;align-items:flex-end;margin-top:26px}}
.sizes svg{{display:block;width:auto}}
.cap{{font-family:ui-monospace,monospace;font-size:9px;color:{DIM};margin-top:8px}}
.on-dark{{background:{INK};padding:22px 26px;margin-top:24px;display:inline-block}}
.on-dark svg{{display:block;height:34px;width:auto}}
"""


def page(faces):
    rows = []
    for key in faces:
        wm = W.build(*key.rsplit("-", 1)[0:1], wght=int(key.rsplit("-", 1)[1]))
        big = W.svg(wm, fill=INK, height=84)
        s30 = W.svg(wm, fill=INK, height=30)
        s18 = W.svg(wm, fill=INK, height=18)
        s11 = W.svg(wm, fill=INK, height=11)
        dark = W.svg(wm, fill="#F6F3EC", height=34)
        ratio = wm["width"] / wm["cap"]
        rows.append(f"""
  <div class="row">
    <div class="meta"><b>{wm['face']} {wm['wght']}</b>
      <span>cap {wm['cap']} &middot; stem {wm['stem']} &middot; ring = stem &middot;
      measured spacing &middot; aspect {ratio:.2f}:1</span></div>
    <div class="big">{big}</div>
    <div class="sizes">
      <div>{s30}<div class="cap">30px</div></div>
      <div>{s18}<div class="cap">18px</div></div>
      <div>{s11}<div class="cap">11px &mdash; favicon row</div></div>
    </div>
    <div class="on-dark">{dark}</div>
  </div>""")
    return (f"<!DOCTYPE html><html><head><meta charset=utf-8>"
            f"<title>LOVELEEDAY wordmark &mdash; proof</title><style>{CSS}</style></head><body>"
            f"<h1>One colour, real outlines, measured spacing.</h1>"
            f"<p class=lede>The O keeps the typeface&rsquo;s own outer contour; only its counter is "
            f"replaced. The heart is sized so the ring left around it equals that face&rsquo;s "
            f"measured stem width, so the letter does not read lighter than its neighbours. "
            f"Spacing is not a table of guessed numbers: the facing ink profiles of every "
            f"adjacent pair are sampled across their shared height and the advance is solved for "
            f"a constant average gap, with a floor that makes a collision impossible. "
            f"Each mark is shown at display size, then at 30/18/11px, then reversed.</p>"
            + "".join(rows) + "</body></html>")


if __name__ == "__main__":
    W.assert_symmetric()
    faces = sys.argv[1:] or ["Manrope-800", "Manrope-700", "Archivo-800", "SpaceGrotesk-700"]
    (HERE / "proof.html").write_text(page(faces))
    print("wrote", HERE / "proof.html")
