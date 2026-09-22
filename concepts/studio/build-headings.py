"""Close the three heading-level gaps.

The full suite found h1 -> h3 jumps on arthur, principles and use-cases. In
each case a run of h3 cards sits in a section that has no heading of its own,
so a screen-reader user navigating by heading level lands in a hole: the
cards announce as third-level items under nothing.

The cards should not be promoted to h2. On principles and use-cases they are
peers of the section, not sections themselves, and on arthur the h3 is the
brain's live question, which is rewritten on every beat -- making the page's
only second-level landmark a string that changes every few seconds would be
worse than the gap.

So each section gets the h2 it was always missing, carried for assistive
technology only. Nothing moves on screen, and the outline becomes h1 -> h2 ->
h3 as it reads.
"""
import pathlib

SITE = pathlib.Path("site")

TARGETS = [
    ("principles.html",
     '<section class="section-pad"><div class="wrap"><article class="principle-long">',
     "The principles"),
    ("use-cases.html",
     '<section class="section-pad"><div class="wrap"><a class="link-row" href="municipal-review.html">',
     "Where the work begins"),
    ("arthur.html",
     '<section class="arthur" id="arthur"><div class="wrap"><div class="scenario-picks"',
     "Arthur, working through a question"),
]

for name, anchor, label in TARGETS:
    p = SITE / name
    t = p.read_text()
    if anchor not in t:
        raise SystemExit(f"BUILD STOPPED: anchor not found verbatim in {name}")
    head = f'<h2 class="sr-only">{label}</h2>'
    if head in t:
        continue
    open_wrap = anchor.index('<div class="wrap">') + len('<div class="wrap">')
    t = t.replace(anchor, anchor[:open_wrap] + head + anchor[open_wrap:], 1)
    p.write_text(t)
    print(f"  {name}: added a section heading for assistive technology")

css = SITE / "assets" / "site.css"
c = css.read_text()
if ".sr-only" not in c:
    # The sheet had no visually-hidden utility -- only .skip, which is a
    # different thing (it reveals itself on focus). This one never appears.
    c += ("\n.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;"
          "overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;"
          "border:0}\n")
    css.write_text(c)
    print("  site.css: .sr-only utility added")
