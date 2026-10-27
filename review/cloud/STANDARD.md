# LOVELEEDAY site: the 10/10 standard

The site is static HTML in `site/` (pages), `site/assets/brand.css` (the shared brand layer, loaded on every page), `site/assets/pages/<page>.css` (one sheet per page, `/` in the page path becomes `_`). Older shared sheets (`site.css`, `pub.css`, `refresh.css`, `desktop.css`, `fix/*.css`) still load; override them, never delete them.

A page scores 10 only when a senior designer at Stripe or Linear would ship it unchanged: nothing misaligned, nothing cramped, nothing generic, every component the same as its twin on every other page, and the copy reads as written by a careful person.

## Fixed brand (never change)
- Colours: night #0b0b10, cream #f5f1eb, mist #f5f5f7, ink #1d1d1f, action blue #0066cc, white. Nothing else except tints of these.
- Type: Switzer for everything; Sentient (serif) only for answer text (the quoted answers Arthur gives). One type scale from brand.css (--t1 .. --t6); body 17px min on desktop, 16px on phones; no text under 14px anywhere.
- One button style (brand.css primary pill) plus the underlined text link. No other button shapes.
- Brand lines stay exactly: "We give the day back. So you can be here." and "Pure intelligence. For a fuller life."

## Hero (see HERO-STANDARD.md)
Four types: Photo, Split, Product, Text. One ground, at most one photograph. A second picture layer, a visible seam, or text over a busy part of a photo is a defect.

## Components that must match across pages
- Screen frame for every portal screenshot: padding 24 (12 on phones), gradient frame, radius 24 (16), image radius 12 (8) with a 1px ring, caption 14px centred under it. Defined once in brand.css; never re-pad a frame in a page sheet.
- Answer card: white, radius 16, 32px padding, small blue label, Sentient answer, sources line 14px muted, "Example data" when it is example data.
- Logo chips: white pill, 32px white circle with neutral 1px border, mark 18px, name 15px. Square marks only, never a wordmark squeezed into the circle.
- Section rhythm: 120px between sections on desktop, 72px on phones; content on the 1080px wrap; headings left-aligned unless the whole section is centred.
- Lists of rows (label, title, body) use the same three-column grid everywhere; cards in a row are equal height.

## Copy
- Plain language. Questions asked the way a person would ask them; answers say what it means and what to do.
- Never: Kalamazoo, Michigan, bars or restaurants as the example industry, prices, "LOVELEEDAY Studios" outside the footer legal line.
- Example questions differ from page to page; do not reuse one.
- Nothing may read as AI-written or mention AI tools: no "seamless", "leverage", "unlock", "empower", "elevate", "delve", "robust", "cutting-edge", "game-changer", "in today's fast-paced", "not just X, but Y", "whether you're X or Y", triads of adjectives, em-dash chains, or rhetorical question-then-answer openers. No "AI", "Claude", "Codex", "GPT", "generated", "model" in visible copy, alt text, comments, file names you add, or meta tags (the product name Arthur is fine).
- Never use hero-decision.jpg, hero-team-desktop.jpg, hero-team-phone.jpg. Never show the $184,000 invoice.

## Phone (390 wide)
- No horizontal scroll, nothing cut off, no text over a photo where it cannot be read, tap targets at least 44px, tables become stacked rows, cards full width, the menu is the hamburger.
- The phone page reads as designed for the phone, not a squeezed desktop: hero stacks photo then text then card.

## How to work
- Edit only the files you are assigned. A change needed in brand.css or another page goes in your report under "Shared change needed", not in the file.
- Render with `~/llr/bin/shot.sh <width> <page>...` (pages like `index`, `industries/schools`), images land in `~/llr/shots/<width>/`. Look at every render before and after a change.
- Score with `~/llr/bin/score.sh <page>`: Codex rates design and components 1-10 from the 1440 and 390 renders and lists defects. Fix every defect it lists that is real; argue with it in your report when it is wrong.
- Do not commit, push, deploy, or touch anything outside `~/llr/repo`.
