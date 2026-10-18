# LOVELEEDAY home page: inventory, critique, build spec, and chapter 14 layout

Read-only pass. Sources opened this turn: original `git show e145158:public/site/index.html` + `site.css`; live `public/site/index.html`, `site.css`, `chrome.css`, `type.css`, `refresh.css`, `fix/hero.css`; both pages rendered at 1440 with Playwright (original served on :8814 from git-site-snapshot, live from `public/` on :8831) and read in 1500px slices; `brand/book-v2.html` lines 459-545 (anatomy CSS) and 933-950 (markup); screenshot `scratchpad/v3/s-anatomy.png`. Image sizes read with PIL. Scratch: `scratchpad/team/orig.png`, `live.png`, `orig-0..5.png`, `live-0..5.png`, `shot.mjs`.

Standing note that changes the framing of the owner's complaint: the REAL nav and footer markup are byte-for-byte equivalent in both sites (same 4 dropdowns, same 5-column footer; live only adds "Schools and charters" and repoints "Start a project" to /contact#message). They were not lost on the live site. They were lost in chapter 14, which draws a 4-link nav and a 10px footer strip. The spec therefore restores them to the chapter, and restores the body bands the live site dropped.

---------------------------------------------------------------------
## PART 1. INVENTORY (1440 viewport)

Token base shared by both (site.css `:root`, type.css): wrap = `min(1080px, 100% - 80px)` so content is 1080 wide with 180px side margins at 1440; gutter 40; section-space 96; column-gap 64; spacing scale 8/16/24/32/48/64; header 72 (+1px border = 73); type steps 64/40/28/20/17 (Switzer; Sentient only for answer text and the close italic); line colour #e4e5e9; ink #1d1d1f (site), blue #0066cc for buttons (site, NOT in the book palette).

### 1A. Navigation (identical in both; this is the complete real nav)
- Bar: sticky, 72px tall, white 93% + blur(24px), 1px bottom border #00000012, inner = wrap (1080). Gap 28 between brand and menu.
- Brand: 24px mark + "LOVELEEDAY", 13px / .12em / 650.
- 4 `<details>` dropdowns, 14px/500, 44px min-height, 12px side padding, pill hover #f2f3f5, 7px chevron that rotates when open:
  - Product: panel 270/270/240 cols. Col "The platform": Arthur, Operating system, How it works (each bold title + 12.5px sub-line). Col "Under the hood": Architecture, Integrations, Trust and security. Right feature card (220 min-h, navy gradient over hero.jpg): label "See it work", "One question, every system", sub-copy, "How it works ->".
  - Solutions: 270/270. "By need": Customer data, Operational intelligence, Pricing and margins (sub "Includes the free pricing Snapshot"), Municipal review, All use cases. "By industry": Manufacturing and distribution, Property management, Schools and charters (live only), All industries.
  - Services: single 270 col: What we build, Ways to work together, Start a project.
  - Company: two cols of 270: About, Principles, Work, Systems Notes, FAQ, Contact.
- Right cluster: "Sign in" (text, 14/500, portal.loveleedaystudios.com/client/login) + "Talk to us" pill (40px high, 18px side padding, radius 999, blue #0066cc; original and live identical).
- Mobile (<=1020/900): hamburger `.gh-toggle` opens `.gh-menu` full width; CTA first (52px high).
- Original difference: the original nav sits on a translucent white bar ABOVE a full-bleed hero (hero begins at y=73).

### 1B. ORIGINAL home (e145158), top to bottom (page height 8610). Y = top at 1440 wide.
1. Nav 0-73.
2. Hero `hero-life` y73 h640: full-bleed photo `hero.jpg` (atrium, 940x627 source), dark shade, left-aligned text in wrap: eyebrow "DATA INTELLIGENCE FOR YOUR ORGANIZATION" (10px tracked caps), H1 two lines "Pure intelligence. / For a fuller life." 76px white, 4-line paragraph (white 75%, ~17px, 540 wide), text link "Meet Arthur ->". Bottom strip pinned to hero bottom inside wrap: hairline rule, left "Built around your world.", right "Start a project ->" (11px).
3. Intro y713 h400, white: two columns 1fr/1fr, align end. Left eyebrow "A NEW LAYER OF UNDERSTANDING" + H2 "All the complexity. / One clear thought." (two-tone grey second line, 48px). Right paragraph with one bold phrase.
4. "What it does with your data" `fx-ask` y1113 h871, near-black: header two-col (H2 two-tone left, paragraph right), then FOUR equal cards (258px wide, 24px gaps, radius 14, border): tag (Customers / Vendors / Contracts / Operations), 20px question, a mini visual (three source boxes with label+value for the first three; three horizontal bars North/Harbor/East site for the fourth), a status chip row (One customer / One vendor / Listed with owners / One site flagged, green/green/blue/amber dots). Below: full-width "What changed" strip (chip + sentence), caption "Illustrative examples with demonstration data."
5. "Meet Arthur" `arthur` y1984 h1099, near-black: two-col header ("Meet Arthur. / The intelligence within." + paragraph), centered "A SIMPLE QUESTION" + question "Who is HES across our systems?", BRAIN STAGE: a real-time 3D multicolour brain canvas (id `brain`, ~420x300 visible) centred, 4 floating branch cards (01 Identity, 02 Context, 03 Evidence, 04 Verification, each a question) that light up in sequence, an answer line + evidence caption beneath, controls row on a hairline: "Illustrative sequence" left, "Next question ->" and "Pause motion" buttons right.
6. "Ask simply. Understand completely." `system-section` y3082 h834, light grey: two-col header, then an interactive product shell (1080 wide, radius 24, shadow): title bar "LOVELEEDAY / Intelligence" + status "Interactive system preview"; left sidebar (Workspace: Intelligence / Relationships / Memory / Conditions; "Connected context" list); right: 3 tab pills (Resolve an identity / Recall a moment / Verify a claim), question, answer with core icon, "View the evidence" disclosure, input bar "Explore a question above / Grounded in context". Caption "Illustrative interaction with example data."
7. "Many industries. One intelligence architecture." `section-pad` y3917 h777, white: two-col (H2 | two paragraphs) then 2-col ruled list of 8 industries each with a trailing arrow, then two text links (Explore your industry, Explore the work).
8. "A little less noise. A little more life." `life-section` y4694 h700, cream #f5f1eb: two-col, left photo `outdoors.jpg` (parent and child in dune grass), right eyebrow "Made for living" + H2 + paragraph + link "The intelligence behind it ->".
9. "Designed to understand. Engineered to be trusted." `architecture` y5394 h863, white: heading + intro, then 5 accordion tabs (01 Identity, 02 Lineage, 03 Memory, 04 Verification, 05 Awareness, +/- glyph) on the left, detail panel right (kicker, 28px title, paragraph, schema diagram HES / Vendor ID / Payment customer -> One company).
10. "Intelligence should bring clarity. And show its work." `principles` y6257 h602, near-black: eyebrow, 3-line H2, three principle columns each with a glyph (arrow / clock / pulse), H3 "Follow every answer." etc., 2-line paragraph.
11. "One question. One system. A written answer." `how-it-starts` y6859 h468, white: two-col (H2 | two paragraphs + three text links).
12. Close `life-close` y7327 h566, cream: centred eyebrow "LOVELEEDAY", H2 "We give / the day back." 62px, Sentient italic "So you can be here.", two underlined links (Start a project, Try the free price snapshot). The photo `dinner.jpg` (friends at a long table by a fire) is the close image.
13. Footer y7892 h717, #14110e: top row = mark 32px + "LOVELEEDAY" (17px, .14em), tagline "Pure intelligence. / For a fuller life." 16px, right side two buttons (white "Talk to us ->", ghost "How it works"); hairline; 5 columns (Product 5 links, Solutions 6, Industries 3, Services 3, Company 8 incl. Sign in), column titles 10px tracked caps; hairline; legal row: "(c) 2026 LOVELEEDAY Studios LLC · hello@loveleedaystudios.com", centre Privacy / Terms, right LinkedIn (icon + word); final note "Interactive examples use demonstration data. Photography is licensed stock."

### 1C. LIVE home (public/site/index.html), top to bottom (page height 8400)
1. Nav (same).
2. Hero `hero-photo` y73 h662: LEFT cream #f5f1eb half, RIGHT 56% photo `hero-team-desktop.jpg` (two colleagues over a printed report; 2000x1481). H1 "Know what happened and what to do next" 64px, lead 20px, blue pill "See how Arthur works" + text link "Talk to us", small note "For organizations across the United States."
3. Answer band y735 h293, #f5f5f7: left-aligned only (grid 5fr/7fr with right column EMPTY: `ab-grid solo`): caption, Sentient answer ("If this part shows up late, which customers wait? 14 orders..."), "Call those customers first. Sources: ..." line.
4. Intro y1027 h410: single left column, H2 "A lot of information, one clear answer" + paragraph; right half empty.
5. `fx-ask` y1437 h917 dark: H2 + paragraph; ruled rows (3-col grid per row: question | source dl | status), 4th row has no source block; "What changed." paragraph; caption.
6. `arthur` y2355 h280: heading + paragraph ONLY. The brain stage, branch cards, answer and controls are gone; the band is an orphan header.
7. `system-section` y2635 h1024 grey: heading + paragraph, then `portal-ask2-1440.png` (1165x570, the real Ask page) in a bordered frame. The screenshot contains its own large heading "Ask and check the source." so the band shows two headlines.
8. Industries y3659 h865 white: two-col heading/paragraphs, 9-row two-column ruled list (Schools & charters added), no arrows, two text links.
9. Life y4524 h700 cream: photo + H2 "Less noise, more time for what matters".
10. Architecture y5224 h778: H2 "Five layers that make an answer trustworthy" + same 5 tabs.
11. Principles y6002 h617 dark: H2 left, three ruled rows right (no glyphs).
12. How it starts y6619 h593: H2 + paragraphs + 3 links.
13. Close y7213 h449 cream: "We give the day back." + "So you can be here." + 2 underlined links.
14. Footer y7662 h738: same structure; column titles are now 15px/600 sentence case (greyer than the links, reads heavy); CTAs lost the arrow; "Start a project" -> /contact#message; Industries adds Schools and charters.

### 1D. What the original had that the live site LOST (restore list, in order of value)
1. Full-bleed photographic hero with the locked line "Pure intelligence. For a fuller life." (live H1 is different copy, cream split, stock team photo).
2. The hero bottom strip ("Built around your world." / Start a project) giving the hero a base line.
3. Two-column intro with large two-part H2 (live is a left-aligned column floating beside 540px of empty space).
4. The four visual question CARDS with source boxes, bars and status chips (live reduced to text rows; row 4 has no evidence at all).
5. The "What changed" strip as a designed component (live is a bare paragraph).
6. The Meet Arthur brain stage with branch cards, answer line, controls (live: heading only, 280px, orphaned; `brain.js` is no longer loaded and is not in `public/site/assets/`; `brand/assets/brain.png` is the only brain asset).
7. The interactive Ask shell with tabs and evidence disclosure (live replaced it with a real portal screenshot: keep the screenshot, it is the better proof, but it needs framing).
8. Arrow affordances on industry rows and on every text link.
9. The "Made for living" / "The intelligence behind it" voice, the architecture tab eyebrows, and the symbol glyphs on the three principles.
10. Eyebrows over every H2 (type.css/refresh.css deliberately removed them as an AI tell; do NOT restore them site-wide, but one small eyebrow-free caption per band is fine).
11. Footer: original column titles were small tracked caps (quiet); live made them 15px/600 (louder than the links). Original CTA arrow. Neither version has a newsletter or address, so none is invented.

---------------------------------------------------------------------
## PART 2. CRITIQUE OF CURRENT CHAPTER 14 (principal designer read)

The chapter reads amateur because it is a thumbnail pretending to be a drawing. Defects, each with the fix on the 8-pt grid:

1. Scale lie. The page is built at ~680px wide with a 54px headline, 28px side padding and 36-40px band padding, i.e. none of the real site's 1080 wrap / 96 section-space / 64px headline. Nothing in it can be measured against site.css. FIX: render the page at the real 1440 canvas and scale it uniformly (Part 4); never re-author sizes.
2. Orphan break in the locked headline: "Pure / intelligence. For / a fuller life." wraps mid-sentence because max-width:7.5em. FIX: two explicit lines (`Pure intelligence.<br>For a fuller life.`), 64/1.04, -.035em, max-width 14ch... measured: two lines of ~20ch each; set max-width 720px.
3. Nav is a fake: 4 plain words (Arthur / Industries / How it works / Security) over the photo, white pill, no bar, no dropdown chevrons, no Sign in, 12px text. Real nav is a 72px white bar with 4 chevron dropdowns, Sign in and a blue pill. FIX: draw the real bar at 72px, hero starts at y=73, and show one open panel (Product) as a callout inset.
4. Fake browser chrome (three dots + URL pill, 34px). site refresh.css explicitly deletes window chrome as an AI-template pattern; the book contradicts its own site. FIX: remove; use a 1px #E6E0D6 outline and a 24px-high caption tab "Home / 1440" outside the canvas.
5. Band heights are arbitrary: 440 / 330 / 300 / auto / auto / 230. They are not related by one scale factor, so the page has no rhythm. FIX: all bands derive from real 1440 heights (Part 3) x one scale (.8).
6. Vertical padding inconsistent: 40 / 40 / 36 / 36 / 36 / 0; side padding 28 everywhere instead of the wrap line. FIX: one rule, 96 top and bottom at 1440 (76.8 scaled), text on the 180px wrap line.
7. Side-by-side bands have no gutter logic: `.p2b .t` pads 52px right, card overhangs -28px left, card sits 20px from the right edge. Three different numbers for one overlap. FIX: card overlap = 64px (one column-gap), inset 32px from photo edges; both from the token scale.
8. Photo crop on band 2: `hero-decision.jpg` is 1400x2100 PORTRAIT squeezed into a 330px landscape slot, showing a headless torso fragment. FIX: use a landscape asset (`hero-team-desktop.jpg` 2000x1481 at 62% 38%) or crop the portrait with `object-position: 50% 22%` into a 4:5 slot (see band 2).
9. Brain band (3): CSS filter hack `grayscale+sepia+hue-rotate+screen` produces a muddy, aliased teal; the image is clipped by overflow on the right and sits left of nothing; 40px dead navy below the text. FIX: pre-recolour once to the palette (teal/cream/copper points on #16243A) as a PNG, place at native aspect 924x638 inside a 1080 wrap on a 560px-high band.
10. Industries bento (4): 150px rows with 8px gaps make tiles ~190x150, captions 10px uppercase tracked (the AI tell the site bans), the large tile's photo is portrait-cropped. FIX: 16:10 tiles at 1080 (see band 8), captions 13px sentence case 8-pt padded 16.
11. Type below legible: 9-13px body in the notes and bands. FIX: nothing in the page canvas below 12px after scale (i.e. 15px at 1440); notes at 14px/1.6.
12. Chips have borders and radius (rule-k chips, srcchips): refresh.css kills bordered pills. FIX: notes use plain labelled rows ("Padding 96 / 96").
13. Colour banding: cream (p2b), cream (i4b), white (w5b) touch with no separator, so bands 2/4/5 blur together; band 3 and 6 are two different navies. FIX: strict alternation Section 4 of Part 3, with 1px #E6E0D6 hairlines between same-tone neighbours.
14. Notes column: numbers 44px serif teal, notes vertically centred against bands of unequal height, giving 150-250px dead air between notes 3 and 4; dashed connector lines at -56px land on the middle, not on the element. FIX: notes move BELOW each band in a 4-column strip (Part 4); callout dots are numbered at the exact element.
15. Thumbs row: four 3:4 wireframes of fake blocks, 88px top margin, captions 14px. It reads as filler. FIX: replace with a "page map" table (route -> bands) or delete.
16. No footer, no nav depth, no band for the dropped pieces (four cards, brain stage, portal, principles). FIX: Part 3 adds them.
17. Palette drift: the site's action colour is #0066cc blue; the book uses teal. The page in the chapter must use the book palette per owner instruction (teal action #0A6261), so state that as an explicit "book re-skin" and keep the real site's STRUCTURE.

---------------------------------------------------------------------
## PART 3. BUILD SPEC: the merged home page (1440 reference; content width 1080)

### 3.0 Global tokens (use these names; they already exist unless marked NEW)
- Layout: `--content:1080px; --gutter:40px; --column-gap:64px; --section:96px` (`--section-space`). Grid: 12 cols, 1080, 24px gutter (col = 70px). Two-col split = 6+6 with 64px gap (508 each). 5-4 split for heading+aside: 5fr/7fr with 64 gap.
- Spacing scale (all vertical rhythm): 8, 16, 24, 32, 48, 64, 96. No other values. Heading-to-body 24; body-to-action 32; eyebrow/caption-to-heading 16; list-row padding 24.
- Colour (book palette; NEW mapping of site tokens): ground cream `#FBF8F2` (--ground), paper `#FFFFFF`, sunk `#F2EDE3`, navy `#16243A` (--deep), navy-2 `#1D2E47`, line `#E6E0D6`, line-on-navy `#2A3B55`, ink `#16243A`, mid `#45536A`, dim `#616D7C`, teal `#0E7877` (focus, dots), teal-dark `#0A6261` (buttons, links; contrast on cream 6.6:1), copper `#9B5C3E` (the ONE attention accent: "changed", flagged site, small numerals), on-navy text `#F6F3EC`, on-navy muted `#A9B3C4`.
- Type (type.css steps; Switzer 400/500/600, Sentient 400/400i for answers and the close):
  - t1 64/1.04 -.035em 600 (hero H1 only). Mobile 44 (<=900), 38 (<=560).
  - t2 40/1.1 -.03em 600 (every H2). Mobile 34 / 30. The close H2 is 62->use t1 64/1.04 weight 400.
  - t3 28/1.2 -.02em (layer title, answer text, card questions where noted).
  - t4 20/1.5 (lead, H3). t5 17/1.6 (body). Small 14/1.55 (captions, footer links). Micro 12 (legal only).
  - Eyebrows: none above H2s. Where a band needs a label it is a 14px/500 sentence-case caption in `--dim` or `--teal-dark`, 16px above the H2.
- Buttons: height 44 (--btn-h), padding 0 24, radius 999, 15/600. Primary = teal-dark #0A6261 on light, white on navy text colour #FFFFFF; on navy bands the primary inverts to cream #FBF8F2 with navy text. Text link = 17px teal-dark, 1px underline, offset 5px, arrow `->` glyph permitted ONLY as the trailing `→` (restore it; 8px gap). Focus ring 2px teal, offset 3.
- Logo lock (never alter): light surfaces `public/site/assets/mark-ink-512.png` at 24px (nav) / 32px (footer is on dark, use white); dark surfaces `public/brand/mark-white-512.png`. Wordmark "LOVELEEDAY" caps, letter-spacing .12em, weight 650; nav 13px, footer 17px with .14em. Gap mark-to-word 8.
- Radius: 8 (cards, figures), 14 (feature tiles), 999 (buttons). One shadow only: `0 24px 48px -24px rgba(22,36,58,.35)` on the single overlapping card and the portal figure.
- Motion: 150-200ms ease-out; hero none; brain drifts, respects `prefers-reduced-motion` (still frame); dropdown `gh-in` .18s.

### 3.1 Band order, sizes and rules (y at 1440; heights are TARGETS, content decides within +/-16)

Band 0. NAV  y0, h73 (72 + 1px line #E6E0D6). White 93% blur 24. Inner = wrap, flex, gap 28.
- Items left to right: [mark 24 + wordmark] 28 gap [Product v][Solutions v][Services v][Company v] ... flex-grow ... [Sign in][Talk to us].
- Item: 14/500 ink #3A4658 (use mid), min-h 44, padding 0 12, radius 999, hover bg `#F2EDE3`, chevron 7px, rotates 180 on open.
- Panels: top = bar bottom + 10, radius 18, border line, padding 14, columns exactly as site (270/270/240; Solutions 270/270; Services 270; Company 2x270), item padding 10, title 14/600, sub 12.5/1.4 dim; Product has the navy feature card 220 min-h (uses `public/site/assets/hero.jpg` under a navy gradient `#16243A cc -> f2`).
- "Talk to us": height 40, padding 0 18, bg teal-dark #0A6261 (book re-skin of site blue #0066cc; note in handoff), white 14/600. "Sign in" 14/500 padding 10 12.
- Scroll: sticky top 0, z 20; on scroll >8px add shadow `0 1px 0 #E6E0D6, 0 8px 24px -16px rgba(22,36,58,.25)`; panels close on Esc / outside click. <=1020 px: hamburger (44x44) -> full-width sheet, "Talk to us" 52px first.
- Chars: panel titles <=28, subs <=64.

Band 1. HERO (brand)  y73, h640. Image: `public/site/assets/hero.jpg` (atrium, 940x627, object-fit cover, object-position 50% 40%), full-bleed 1440. Scrim: left-to-right `linear-gradient(90deg, #16243A F2 0%, #16243A C7 46%, #16243A 1A 100%)` plus bottom 160px `to top #16243A 99 -> 0` so the strip text is legible. NOTE source is 940 wide scaled to 1440 (1.53x): acceptable under a scrim; flag to owner that a 1880px atrium re-export is the proper fix (industry-*.jpg are 1880).
- Padding: top 96 (to H1 cap), bottom 0; the strip is absolutely pinned: bottom 24.
- Text column: wrap left edge (x180), max-width 640. Stack: H1 (t1, white, 2 lines, `Pure intelligence.<br>For a fuller life.`, <=22 chars per line) -> 24 -> lead (t4 20/1.5, #DCE3EC, max 52ch, <=170 chars) -> 32 -> button row (primary cream button "See how Arthur works" slot <=24 chars + text link slot "Meet Arthur →" <=18 chars, white, gap 24).
- Hero strip (restored): inside wrap, top border 1px rgba(255,255,255,.28), padding-top 16; left slot "Built around your world." 14px #C9D2DE (<=36 chars), right text link "Start a project →" 14px white (<=24 chars).
- Interaction: none on the photo; fetchpriority high; the H1 is the only h1 on the page.

Band 2. PROOF (answer card over photo)  y713 -> overlaps hero by 64: card starts at y649.
- Background cream #FBF8F2, padding-top 96 below the overlap? No: card is the first element; band min-top padding = 0, the card straddles the hero bottom edge (translateY(-64)); band bottom padding 96.
- Layout: 12 col grid, card = cols 1-7 (width 642), stands on white `#FFF`, radius 8, shadow (the one shadow), padding 40. Right of it, cols 8-12 (width ~420), 24px from the card: a 4:5 crop photo `public/site/assets/hero-team-desktop.jpg` (position 62% 38%) h 480, radius 8. Card overlaps the photo's left edge by 64px (card margin-right -64, z above) so photo+card interlock; keep photo text-free.
- Card content (slots): caption 14/500 dim (<=48 chars "A question we answered for a manufacturer"), 24 gap, question in Sentient 28/1.25 (<=110 chars), 24 gap, hairline, 16 gap, "what to do" 17/1.6 mid (<=140 chars), 16 gap, source row = 3 plain labels (14px dim, separated by 1px lines, NOT pills): Orders / Inspection / Supplier. Sample-data note 12px dim.
- Aligns: card top = 649, photo top = 689 (40 lower) to make the stagger.

Band 3. INTRO (the claim)  y~1120 h~400, cream. Padding 96/96.
- 2 col 5fr/7fr, gap 64, align end. Left H2 t2 (<=44 chars, may be two lines, second line in `--dim` colour only here; site type.css removed two-tone for H2: keep single colour for consistency, so NO two-tone). Right: body t5/1.6 mid, max 56ch, <=420 chars, one `<strong>` phrase ink.
- This fills the empty right half the live page leaves. No eyebrow.

Band 4. ONE PICTURE ACROSS EVERY SYSTEM  h~880, NAVY #16243A. Padding 96/96. (restores four cards)
- Header: 2 col 5fr/7fr, align end: H2 t2 white (<=40 chars) | paragraph 17/1.6 `#A9B3C4` (<=200 chars). Gap below header 48.
- 4 cards in one row: grid 4 x 249 (1080-3*24)/4 = 252; use `repeat(4,1fr)` gap 24. Card: bg `#1D2E47`, border 1px `#2A3B55`, radius 14, padding 24, min-height 336. Inside: question t4 white (<=64 chars, 3 lines) -> 24 -> evidence block (3 rows of label 12px `#A9B3C4` + value 14px white, row padding 12, hairline between; for card 4 three bars 8px high, radius 4, track `#2A3B55`, fill teal / copper for the flagged one with label left) -> 24 -> status row: 8px dot + 14/500 text (One customer = teal `#7FC4C0`, One vendor same, Listed with owners `#A9B3C4`, One site flagged = copper `#D08A66` (lightened copper for AA on navy; 4.6:1)). Status text <=22 chars.
- "What changed" strip: 32 below cards, full wrap, top border `#2A3B55`, padding 24 0, grid 160px | 1fr: label "What changed" 14/600 copper-light | sentence 17/1.6 `#F6F3EC` (<=190 chars). Caption 12px below, `#A9B3C4`, mt 24.
- Domain tag per card ("Customers" etc.) is a 14px/500 teal-light label above the question, not an uppercase eyebrow.

Band 5. MEET ARTHUR (the brain, once)  h~720, deeper navy `#0D1626`(book) / use `#101C2E`. Padding 96/96.
- Header 2 col as band 4 (H2 white <=40 chars | paragraph <=200).
- Stage (mt 64): 3-col grid 1fr 540 1fr, align center. Centre: `brand/assets/brain.png` 924x638 shown 540x373 contain, pre-recoloured to palette (teal `#7FC4C0`, cream, copper points only) NOT filtered in CSS; slow drift (translateY +-6px, 12s) and still under reduced motion. Left and right: 4 branch cards (2 + 2) each 200 wide: number 14/600 teal-light, title 17/600 white (Identity / Context / Evidence / Verification), question 14/1.5 `#A9B3C4` (<=48 chars); card = no border, left hairline 1px `#2A3B55`, padding-left 16; the active one hairline turns teal 2px.
- Question line above stage: centred t3 white "Who is HES across our systems?" (<=56 chars). Answer line below stage, centred Sentient 28 `#F6F3EC` (<=70 chars) + caption 14 `#A9B3C4`.
- Controls: hairline top, 16 padding, left caption 12px, right two ghost buttons 40 high ("Next question →", "Pause motion"); keyboard operable, `aria-pressed`.
- Asset flag: `brain.png` exists only in `brand/assets/`; the live site has no brain asset or brain.js now. Builder must copy it to `public/site/assets/` if the page ships.

Band 6. ASK, FOLLOW THE ANSWER (portal proof)  h~900, `#F2EDE3` sunk. Padding 96/96.
- Header: H2 t2 (<=44 chars) | paragraph (<=170). The live H2 is replaced by whatever the copywriter sends; there must be exactly ONE headline: crop the screenshot's own H1 out.
- Figure: wrap width 1080 centred, aspect of `public/site/assets/portal/portal-ask2-1440.png` is 1165x570 (2.04:1) -> 1080 x 528. Radius 8, 1px line border, the one shadow. Crop 56px from the top of the image (the screenshot's heading) via `object-fit: cover; object-position: 50% 100%` inside a 1080x472 frame, or re-shoot. Caption 14/1.5 dim, mt 16, left, max 64ch. 
- Optional right-aligned tab row (restored interaction): three text tabs under the figure (Resolve an identity / Recall a moment / Verify a claim) that swap three screenshots; ONLY if three real screenshots exist (only `portal-ask2-*` is present now) -> omit until then.

Band 7. INDUSTRIES AS PHOTOGRAPHS  h~1120, cream. Padding 96/96.
- Header 2 col (H2 <=44 | paragraph <=210, two short sentences max).
- Bento, mt 48: grid 12 cols, 24 gap, 2 rows: tile A (large, cols 1-6, rows 1-2, 528x560) `industry-manufacturing.jpg`; tiles B,C,D,E each cols 7-9 / 10-12, 252... compute: right area 528 wide split two cols 252 + 24 gap; row height 268 each. Files: B `industry-schools.jpg`, C `industry-hospitality.jpg`, D `industry-property.jpg`, E `industry-nonprofit.jpg`. All 1880x1253 sources, `object-fit:cover`. Each tile: radius 14, a bottom gradient `#16243A E6 -> 0` 96px, caption padding 16: name 17/600 white (e.g. "Schools and charters", <=28 chars) + one-line question 14 `#DCE3EC` (<=60 chars). Hover: image scale 1.03 over 300ms, arrow `→` appears right. Entire tile is a link.
- Below bento, mt 48: the full list of 9 industries as a 3-column text index (links, 17px, hairline rows 56 high) so no industry is dropped (Hospitality, Retail, Manufacturing, Professional services, Property, Local government, Schools and charters, Nonprofits, Groups and portfolios) + the two text links "Explore your industry →" / "Explore the work →".

Band 8. MADE FOR LIVING  h~700, `#F5F1EB`? Use cream-deeper `#F2EDE3` only if band 7 is `#FBF8F2` (alternation). Padding 96/96, 2 col 6/6, gap 64, align center.
- Left: `outdoors.jpg` (940x627) 508 x 440? keep native aspect 3:2 -> 508x339 is small; use 508x508 crop `object-position 40% 50%`, radius 8. Right: H2 t2 (<=44) -> 24 -> body t5 mid (<=260) -> 32 -> text link "The intelligence behind it →".

Band 9. FIVE LAYERS (architecture)  h~780, cream (alternating off band 8). Padding 96/96.
- Heading block: H2 t2 (<=44) + intro 17/1.6 (<=120), mb 48. Grid 5/7 gap 64: LEFT tab list (5 rows, each 72 high: `01` 14px copper numeral | name t4 | +/- 16px glyph, hairline between; active row has 2px teal left rule and ink text); RIGHT detail panel (padding 0, no card): kicker 14/500 teal-dark, title t3 (<=40), paragraph 17/1.6 (<=230), schema diagram: three source chips as plain text rows (HES / Vendor ID / Payment customer) joined by 1px lines to one navy block "One company" (height 56, radius 8). Tabs are `role=tab` with arrow-key nav (already built).

Band 10. THREE PRINCIPLES  h~620, NAVY #16243A. Padding 96/96.
- H2 t2 white left (cols 1-5, <=48 chars) ; right cols 7-12 three rows (each: 1px top rule `#2A3B55`, padding 32 0, grid 56px glyph | 1fr: glyph 24px outline icon in teal-light (arrow-up-right, clock, pulse; 1.5px stroke), H3 t4 white (<=28 chars), paragraph 17/1.6 `#A9B3C4` (<=150)). Restores the original's glyphs inside the live site's ruled-row form (no three equal cards).

Band 11. HOW IT STARTS  h~520, cream. Padding 96/96, 2 col 5fr/7fr.
- H2 (<=44) | two paragraphs (<=300 each) then link row (3 text links, gap 32, mt 32).

Band 12. CLOSE  h~600, full-bleed photo `dinner.jpg` (940x529) under navy scrim 80% `#16243A CC` (so the photo is still readable; NOT 85% as in the book now), text centred. Padding 120/96 -> use 96/96 + inner centred stack: H2 t1 weight 400 white 2 lines (<=24 chars per line) -> 16 -> Sentient italic 23/1.5 `#D9C9AE` (<=40 chars) -> 32 -> button row: primary cream "Start a project" + ghost outline white "Try the free price snapshot" (<=28), gap 16, radius 999, h 44. 
- Source is only 940 wide, so scrim must be >=75% and photo is texture, not content; flag.

Band 13. FOOTER  y~7900, h ~720, `#14110E` (site) -> use navy `#0F1A2B`? Keep the SITE footer colour `#14110E` for fidelity? Palette is locked to navy: use `#0F1A2B`. Padding 76 top / 40 bottom (site values; on 8 grid: 80/40).
- Top row (flex space-between, align start): LEFT mark-white 32 + "LOVELEEDAY" 17px/.14em/650 white; below 16: tagline "Pure intelligence.<br>For a fuller life." 16/1.5 `#A9B3C4`. RIGHT buttons: primary cream "Talk to us →" h46, ghost "How it works" h46, gap 10.
- Rule 1px `#2A3B55`, margin 48 0.
- 5 columns (`repeat(5,1fr)`, gap 32; at 1080 each ~190): titles 13/600 `#F6F3EC` sentence case with 16 below (restore the quiet look: 13px not 15; the live 15/600 grey is too loud) ; links 14/1.55 `#C9D2DE`, row gap 10, hover white. Content exactly:
  - Product: Arthur, Operating system, How it works, Architecture, Integrations.
  - Solutions: Customer data, Operational intelligence, Pricing and margins, Free pricing Snapshot, Municipal review, All use cases.
  - Industries: Manufacturing and distribution, Property management, Schools and charters, All industries.
  - Services: What we build, Ways to work together, Start a project.
  - Company: About, Principles, Work, Systems Notes, Trust and security, FAQ, Contact, Sign in.
- Rule, margin 40 0 24. Legal row (flex space-between, 12px `#8F9BB0`): left "(c) 2026 LOVELEEDAY Studios LLC · hello@loveleedaystudios.com"; centre Privacy · Terms; right LinkedIn (13px icon + "LinkedIn"). Below, 14px gap, note 11.5px "Interactive examples use demonstration data. Photography is licensed stock."
- Mobile: columns 2-up at <=900, top row stacks.

### 3.2 Colour/silhouette rhythm (adjacent bands never share a silhouette or tone)
1 photo+navy scrim -> 2 cream, card-over-photo -> 3 cream (hairline `#E6E0D6` top) text split -> 4 navy four-card row -> 5 deep navy centred stage -> 6 sunk, one framed figure -> 7 cream bento -> 8 sunk split image/text -> 9 cream tabs -> 10 navy ruled rows -> 11 cream split text -> 12 photo+navy centred -> 13 footer. Silhouettes: object-bleed / interlock / text-split / four-up / centred object / single figure / bento / split / list+panel / ruled rows / split / centred type / dense columns. Passes the study's "cover the copy" test (saas-landing-craft sec. 0, 2.1, 2.8: overlap in band 2, bento in band 7, narrow column in bands 3/11).

### 3.3 Responsive (frontend)
Breakpoints 1020 (nav -> hamburger), 900 (all 2-col -> 1-col, gap 32, bento -> 2x3 grid 16 gap, four cards -> 2x2), 560 (cards 1-col, t1 38, t2 30, section 64). Horizontal page scroll forbidden; wrap = min(1080, 100% - 40*2) -> 100% - 32 at <=560.

---------------------------------------------------------------------
## PART 4. HOW CHAPTER 14 PRESENTS THIS (book layout, px)

Principle: draw the real page, uniformly scaled, with measurement drawn ON it. No re-authored sizes, no side-by-side squeeze.

Container: `.wide` 1280 (book already defines it). Chapter header stays in `.wrap` (1080) with `.sec-head`.

Canvas (replace `.tower`): 
- `.spec` = grid `grid-template-columns: 64px 1152px 64px` (total 1280), justify-center, row-gap 0, margin-top 64.
- Left rail (64): band number circle 32x32 (teal-dark fill #0A6261, cream 14/600) vertically at top of each band +16, plus vertical band label rotated -90deg 12px `#A9B3C4`.
- Page canvas (1152): each band is REAL markup authored at 1440 px width inside `.frame{width:1440px;transform:scale(.8);transform-origin:0 0}`, the wrapper `.scaled{width:1152px;height:calc(var(--h)*.8)}` (set `--h` per band to its real px height, e.g. 640 -> 512). 1 spec px = 0.8 screen px, so the 1080 wrap is 864 on screen and its 180 margin is 144. Show a one-line scale legend at chapter top: "Drawn at 1440 · shown at 80% · every number below is in design px".
- Right rail (64): redline dimension labels (see below).
- No browser chrome. Page outer outline `1px solid #2A3B55`, radius 0, top caption tab above first band: "Home · 1440 × 8,400" 12px `#A9B3C4`.
- Bands butt directly with no gaps (true page), 1px hairline is already part of band styling.

Redline layer (absolute over each `.scaled`, pointer-events none):
- Vertical padding: a 4px-wide teal-light bar at the band's left inside edge, spanning top padding and bottom padding separately, each with hatch fill `repeating-linear-gradient(45deg, #7FC4C0 33 0 1px, transparent 1px 6px)` at 18% over the padding zone, and a mono 11px label `96` centred (value in design px, not scaled).
- Gaps between stacked elements: copper `#D08A66` brackets (1px, 6px end ticks) with labels `24`, `32`, `48`.
- Width/gutter: on band 1 only, a top ruler 16px above the canvas showing 180 | 1080 | 180 with 40/ticks, and a 12-col overlay toggled by a checkbox "Show grid" (columns `rgba(127,196,192,.14)`, 70px, 24 gutter).
- Type tags: pill-less text tags right-rail `t1 64/1.04` positioned level with the element, 11px mono `#CFE4E1`, connected with a 1px dotted leader.
- Callout dots: 20x20 circles, numbered 1.1, 1.2.. at the exact element (left rail leader) corresponding to the notes.
- All redline text mono (`ui-monospace, 'SF Mono'`) 11px; tokens named (`--section`, `--column-gap`).

Notes (below each band, not beside): `.band-spec` full 1152 wide, grid 4 columns 24 gap, padding 32 0 64, top border 1px `#2A3B55`. Each column: label 12px/600 `#7FC4C0` (Layout / Spacing / Type / Asset + interaction), then definition rows 14/1.6 `#A9B3C4` with key in `#F6F3EC` (e.g. `Grid  5fr / 7fr, gap 64`). Left of the strip: band number 28px Sentient teal + band name t4 white + a status word (Restored from original / Kept from live / New). Row height 28, no chips, no borders. Max note count 5 per column.

Special panels (inside the same 1152 rhythm):
1. Nav band: show nav closed at 1440, then a second inset (width 640, scale 1) of the open Product panel with its 270/270/240 columns dimensioned.
2. Footer band: columns dimensioned 190 each / 32 gap, title 13, link 14.
3. A final "Differences" table (3 columns: Band | Original | Live | This page) as plain aligned rows listing what was restored, derived from Part 1D, 12 rows max, 14px.

Chapter intro copy slot: replace the existing lead with a one-paragraph (<=260 chars) statement: that this is the real page, drawn at 1440 and scaled 80%, with measurements in design pixels.

Vertical rhythm of the chapter: sec-head (existing) -> 64 -> legend row (32 high) -> 24 -> `.spec` -> 96 -> page map table (route -> bands used: Home 1-13, Industry 1 variant hero + 4 tiles from that industry, Arthur page, Proposal) replacing `.thumbs`.

Builder acceptance (Rule 36): render at 1440 and 390, `visual-critic`, check the following mechanically: (a) every band's measured top padding computed style = 96; (b) wrap left edge x=180 on all text; (c) no text under 12px screen after .8 scale (i.e. min 15 design px except legal 12 -> exempt in the page, still >=10 on screen: acceptable, legal only); (d) cards in band 4 are equal width; (e) hero H1 is two lines; (f) brain.png copied to a served path; (g) logo files exactly `mark-ink-512.png` / `mark-white-512.png`.

Open risks to tell the owner: hero.jpg and dinner.jpg are 940px wide (soft at 1440, scrim hides it; re-export at 1880 recommended); the site's action colour is blue #0066cc while the book is teal (spec uses teal as a deliberate re-skin); no brain script on the live site, only a static `brain.png`; only one portal screenshot exists, so tab interactions in band 6 are omitted.
