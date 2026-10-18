#!/usr/bin/env python3
"""Point site pages at the graded photos in public/site/assets/photos (one-off swap, idempotent)."""
import re, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = f"{R}/public/site"
P = "/site/assets/photos/"

def tag(old_src, new_src, alt, width, height, srcset=None, sizes=None, pos=None):
    return dict(old=old_src, src=new_src, alt=alt, w=width, h=height, srcset=srcset, sizes=sizes, pos=pos)

def swap(path, items):
    html = open(path).read(); orig = html
    for it in items:
        pat = re.compile(r'<img\b[^>]*src="' + re.escape(it["old"]) + r'"[^>]*>')
        m = pat.search(html)
        assert m, (path, it["old"])
        t = m.group(0)
        keep = []
        for a in re.findall(r'\s(loading|decoding|fetchpriority)="[^"]*"', t):
            pass
        loading = re.search(r'loading="([^"]*)"', t)
        style = re.search(r'style="([^"]*)"', t)
        st = style.group(1) if style else ""
        if it["pos"]:
            st = re.sub(r'object-position:[^;]*;?', '', st) + f"object-position:{it['pos']}"
        new = f'<img src="{it["src"]}"'
        if it["srcset"]:
            new += f' srcset="{it["srcset"]}"'
        if it["sizes"]:
            new += f' sizes="{it["sizes"]}"'
        new += f' alt="{it["alt"]}" width="{it["w"]}" height="{it["h"]}"'
        if loading:
            new += f' loading="{loading.group(1)}"'
        if st:
            new += f' style="{st}"'
        new += ">"
        html = html.replace(t, new, 1)
    if html != orig:
        open(path, "w").write(html)

# home: life band
swap(f"{S}/index.html", [tag("/site/assets/outdoors.jpg", P + "life-parent-child-7879510-1880.jpg",
    "A mother in a pale linen outfit holding a small child's hand as they walk along a leafy garden path.", 1880, 1253,
    srcset=f"{P}life-parent-child-7879510-1200.jpg 1200w, {P}life-parent-child-7879510-1880.jpg 1880w", sizes="(max-width:900px) 100vw, 50vw")])

# industries
swap(f"{S}/industries/manufacturing.html", [
    tag("/site/assets/cards/industry-retail-3.webp", P + "retail-packing-7857532-1200.webp",
        "Two people packing an online order at a wooden table, one taping a labeled box beside a laptop.", 1200, 800),
    tag("/site/assets/cards/industry-professional-services.webp", P + "professional-services-7477723-1200.webp",
        "An older couple filling in a form on a clipboard at a table.", 1200, 800)])
swap(f"{S}/industries/property.html", [
    tag("/site/assets/notes/note-07.jpg", P + "property-unit-8961343-2400.jpg",
        "Two people looking at a tablet in a half-finished room with timber walls and tall windows.", 2400, 1600,
        srcset=f"{P}property-unit-8961343-1200.jpg 1200w, {P}property-unit-8961343-2400.jpg 2400w", sizes="100vw", pos="center 22%"),
    tag("/site/assets/cards/note-08.webp", P + "portfolios-window-8927465-1200.webp",
        "A woman sitting by a plant-filled window reading printed forms.", 1200, 800),
    tag("/site/assets/cards/industry-government.webp", P + "gov-counter-7821676-1200.webp",
        "Hands passing a paper across a table covered in forms, a calculator and a pen.", 1200, 800)])
swap(f"{S}/industries/schools.html", [
    tag("/site/assets/industry-schools.jpg", P + "portrait-school-3867839-2400.jpg",
        "A woman leaning on a classroom wall, smiling, with desks and a bulletin board behind her.", 2400, 1600,
        srcset=f"{P}portrait-school-3867839-1200.jpg 1200w, {P}portrait-school-3867839-2400.jpg 2400w", sizes="100vw", pos="center 20%"),
    tag("/site/assets/cards/industry-nonprofit-2.webp", "/site/assets/cards/industry-nonprofit.webp",
        "Volunteers loading boxes of donated goods beside a van.", 960, 640),
    tag("/site/assets/talk-government.jpg", P + "gov-counter-3770194-1200.webp",
        "A clerk in a red sweater taking a slip of paper across her desk, shelves of binders behind her.", 1200, 800)])

# talk
swap(f"{S}/talk.html", [
    tag("/site/assets/talk-manufacturing.jpg", P + "ops-stock-count-6169027-1200.webp",
        "A worker in a cap checking boxes on a warehouse shelf with a clipboard.", 1200, 800),
    tag("/site/assets/industry-schools.jpg", P + "schools-office-7681227-1200.webp",
        "Hands turning pages in an open attendance binder on a desk beside a coffee cup.", 1200, 800),
    tag("/site/assets/cards/industry-government.webp", P + "gov-counter-8815837-1200.webp",
        "A resident and a clerk signing paperwork together at a service desk.", 1200, 800),
    tag("/site/assets/cards/note-07.webp", P + "property-leasing-7937684-1200.webp",
        "A property manager holding a black folder with a house-shaped key ring.", 1200, 800)])

# contact: side photo must not repeat the talk page photo
html = open(f"{S}/contact.html").read()
m = re.search(r'<img src="/site/assets/talk-hero.jpg" alt="" loading="lazy">', html)
if m:
    html = html.replace(m.group(0), f'<img src="{P}home-hero-3861077-1200.webp" alt="" width="1200" height="800" loading="lazy">')
    open(f"{S}/contact.html", "w").write(html)
print("ok")
