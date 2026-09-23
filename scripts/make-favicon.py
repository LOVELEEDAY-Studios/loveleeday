"""Builds the favicon set: a black square with the white LOVELEEDAY heart.

The heart is the alpha of the brand mark (assets/mark-ink-512.png), recoloured
white and centred on its own bounding box, not the canvas, so it sits optically
centred at every size. Each size is rendered from the 512 source (never scaled
down from a smaller icon) so the 16px tab icon stays crisp.

  python3 scripts/make-favicon.py
Writes concepts/studio/site/assets/{favicon-16,favicon-32,apple-icon}.png,
icon.svg, and src/app/favicon.ico (16/32/48).
"""
import base64
import io
import pathlib
from PIL import Image, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSETS = ROOT / "concepts/studio/site/assets"
SRC = ASSETS / "mark-ink-512.png"
BLACK = (0, 0, 0, 255)
HEART_SHARE = 0.64  # heart width as a share of the square: bold at 16px, not cramped


def heart_mask(solid: bool = False) -> Image.Image:
    alpha = Image.open(SRC).convert("RGBA").getchannel("A")
    if solid:
        # The mark is hand-drawn strokes; at tab sizes the strokes average to
        # grey. Blur and threshold into a solid silhouette of the same outline.
        alpha = alpha.filter(ImageFilter.GaussianBlur(10)).point(lambda v: 255 if v > 70 else 0)
        alpha = alpha.filter(ImageFilter.GaussianBlur(2))
    return alpha.crop(alpha.getbbox())


def render(size: int, mask: Image.Image) -> Image.Image:
    scale = 4  # draw large, then downsample for clean edges
    big = size * scale
    canvas = Image.new("RGBA", (big, big), BLACK)
    w = round(big * HEART_SHARE)
    h = round(mask.height * w / mask.width)
    m = mask.resize((w, h), Image.LANCZOS)
    white = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    canvas.paste(white, ((big - w) // 2, (big - h) // 2 + round(big * 0.01)), m)
    return canvas.resize((size, size), Image.LANCZOS)


def main():
    textured, solid = heart_mask(), heart_mask(solid=True)
    # Tab sizes get the solid silhouette; the home-screen icon keeps the drawn texture.
    outputs = {"favicon-16.png": (16, solid), "favicon-32.png": (32, solid), "apple-icon.png": (180, textured)}
    for name, (size, mask) in outputs.items():
        render(size, mask).save(ASSETS / name, optimize=True)
    mask = solid

    buf = io.BytesIO()
    render(256, mask).save(buf, "PNG", optimize=True)
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 256 256">'
           '<image width="256" height="256" href="data:image/png;base64,'
           + base64.b64encode(buf.getvalue()).decode() + '"/></svg>')
    (ASSETS / "icon.svg").write_text(svg)

    ico = render(48, mask)
    ico.save(ROOT / "src/app/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print("wrote", ", ".join(outputs), "icon.svg, src/app/favicon.ico")


if __name__ == "__main__":
    main()
