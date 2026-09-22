"""The favicon set, from the heart.

There WAS a favicon -- the previous brand's four-square mark -- so this is a
replacement, not a first. Two separate gaps went with it: there was no
apple-touch icon at all (/apple-icon.png 404), and the twelve marketing pages
are static files served by a rewrite, so they bypass Next's metadata system
and emitted no icon tags whatsoever. They worked only because browsers fall
back to /favicon.ico at the root, which is luck rather than design.

WHICH HEART. The filament mark is right in the nav and wrong at 16px, where
the strands collapse into a smudge. A plain silhouette reads at every size and
throws away the thing that makes the mark yours. The favicon is therefore a
hybrid: the silhouette as the body with the filament structure knocked back
into it, so the eye resolves clean mass at 16px and still finds texture at 64
and on the touch icon. The outline is the mark's own outline throughout -- it
is the same heart, not a heart redrawn.

DARK TABS. A favicon is drawn on browser chrome that may be light or dark, and
an ink heart on a dark tab is nearly invisible. icon.svg therefore carries
both an ink and a white rendering and switches on prefers-color-scheme, which
the .ico format cannot express. Browsers that take the SVG get the right one;
the .ico remains as the universal fallback.
"""
import base64, io, pathlib
from PIL import Image, ImageFilter
import numpy as np

ROOT = pathlib.Path(".")
m = np.asarray(Image.open("public/brand/heart-mask-512.png").split()[3]).astype(np.float32) / 255.0
blur = np.asarray(Image.fromarray((m * 255).astype(np.uint8), "L")
                  .filter(ImageFilter.GaussianBlur(9))).astype(np.float32) / 255.0
sil = np.clip((blur - 0.16) * 6.0, 0, 1)
hybrid = np.clip(sil * 0.82 + m * 0.45, 0, 1)
H = Image.fromarray((hybrid * 255).astype(np.uint8), "L")
(ROOT / "public/brand/heart-favicon-512.png").write_bytes(b"")
H.resize((512, 512), Image.LANCZOS).save("public/brand/heart-favicon-512.png")

def tinted(size, rgb, bg=None):
    a = H.resize((size, size), Image.LANCZOS)
    im = Image.new("RGBA", (size, size), rgb + (255,))
    im.putalpha(a)
    if bg:
        plate = Image.new("RGBA", (size, size), bg + (255,))
        plate.alpha_composite(im)
        return plate.convert("RGB")
    return im

INK, WHITE = (29, 29, 31), (255, 255, 255)

# favicon.ico — multi-resolution so the browser picks per context.
ico = tinted(256, INK)
ico.save("src/app/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (256, 256)])
print(f"  src/app/favicon.ico            {pathlib.Path('src/app/favicon.ico').stat().st_size//1024} KB, 5 sizes")

def b64(img):
    buf = io.BytesIO(); img.save(buf, format="PNG", optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

svg = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">'
    '<style>.d{display:none}'
    '@media(prefers-color-scheme:dark){.l{display:none}.d{display:inline}}</style>'
    f'<image class="l" width="96" height="96" href="data:image/png;base64,{b64(tinted(96, INK))}"/>'
    f'<image class="d" width="96" height="96" href="data:image/png;base64,{b64(tinted(96, WHITE))}"/>'
    '</svg>')
pathlib.Path("src/app/icon.svg").write_text(svg)
print(f"  src/app/icon.svg               {len(svg)//1024} KB, light + dark")

# Apple composites the touch icon on an opaque tile and ignores transparency,
# so it is given the brand dark rather than left to render black-on-black.
tinted(180, WHITE, bg=(20, 17, 14)).save("src/app/apple-icon.png", optimize=True)
print(f"  src/app/apple-icon.png         {pathlib.Path('src/app/apple-icon.png').stat().st_size//1024} KB, white on #14110e")

# The static pages need real tags: they bypass Next's metadata entirely.
for name, img in [("favicon-32.png", tinted(32, INK)), ("favicon-16.png", tinted(16, INK))]:
    img.save(f"public/site/assets/{name}", optimize=True)
pathlib.Path("public/site/assets/icon.svg").write_text(svg)
tinted(180, WHITE, bg=(20, 17, 14)).save("public/site/assets/apple-icon.png", optimize=True)

V = "2"   # bump when an icon file changes; browsers cache favicons hard
TAGS = (f'<link rel="icon" href="/site/assets/icon.svg?v={V}" type="image/svg+xml">'
        f'<link rel="icon" href="/site/assets/favicon-32.png?v={V}" sizes="32x32" type="image/png">'
        f'<link rel="icon" href="/site/assets/favicon-16.png?v={V}" sizes="16x16" type="image/png">'
        f'<link rel="apple-touch-icon" href="/site/assets/apple-icon.png?v={V}">'
        f'<link rel="shortcut icon" href="/favicon.ico?v={V}">')

n = 0
for page in sorted(pathlib.Path("public/site").glob("*.html")):
    t = page.read_text()
    if 'rel="apple-touch-icon"' in t:
        continue
    anchor = '<link rel="stylesheet" href="/site/assets/site.css">'
    if anchor not in t:
        anchor = '<link rel="stylesheet" href="assets/site.css">'
    if anchor not in t:
        raise SystemExit(f"BUILD STOPPED: no stylesheet link to anchor to in {page.name}")
    page.write_text(t.replace(anchor, TAGS + anchor, 1))
    n += 1
print(f"  icon tags added to {n} static page(s)")

# The concept source must match, or the next deploy copy silently reverts this.
src = pathlib.Path("concepts/studio/site")
for f in ("favicon-32.png", "favicon-16.png", "icon.svg", "apple-icon.png"):
    (src / "assets" / f).write_bytes((ROOT / "public/site/assets" / f).read_bytes())
for page in sorted(src.glob("*.html")):
    t = page.read_text()
    if 'rel="apple-touch-icon"' in t:
        continue
    a = '<link rel="stylesheet" href="assets/site.css">'
    if a in t:
        page.write_text(t.replace(a, TAGS + a, 1))
print("  concept source updated to match, so a redeploy cannot revert it")
