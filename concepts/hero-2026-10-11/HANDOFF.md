# LOVELEEDAY hero concepts - handoff (2026-10-11)

Dir: ~/arthur/data/loveleeday-hero-concepts-2026-10-11/  (standalone mockups; live site and ~/wt/ll-sitefix NOT touched, nothing deployed)

## Why the live hero fails (rendered at 1440 and 390: shots/live/hero1440.png, hero390.png, full page shots/live/loveleedaystudios.com_-*.png)
- Told: "Know what happened. Know what to do next." Abstract, could be any analytics tool. Grey second line is the flagged two-part headline tell.
- Shown: a stock photo of a woman reading papers at a window, with a card about orders and a failed inspection laid over her. The photo does not match the card (words and picture disagree), and the card covers the photo. The only example is manufacturing, on a site that serves every industry.
- Asked: two competing buttons ("See how Arthur works" arrow, "Talk to us") plus a blue Apple-style primary. The product is called "Arthur" while the brand is LOVELEEDAY, so a first-time visitor meets two names and neither is explained.
- Other tells: Apple palette (#1d1d1f/#f5f5f7/#0066cc), system font, all-caps tracked eyebrow, "Illustrative example" disclaimers instead of a real product answer.
- On mobile, the photo and card stack into a long scroll before the answer card is readable.

## Brand lock decisions (conflict to flag to Daniel)
- Palette from brand book (~/Projects/loveleeday-inkind/brand/book.html): navy #0B1F3A, cream #F6F1E7, paper #FFFBF4, teal #22D3C5, teal-deep #0C857C, amber, coral.
- Type: Switzer (body/display) + Sentient (serif accents), both Fontshare. The task brief said Manrope, but Manrope is on the banned AI-font list in ~/arthur/scripts/type-audit.mjs and memory says the Manrope/Next app design "matched nothing". Live site actually uses the system font. I used Switzer + Sentient.
- Gotcha: Fontshare slug "sentient@400,500" combined with switzer silently returns Gambetta. Load it alone as `f[]=sentient` (base.css already fixed). The brand book's own Sentient link likely has the same problem.
- Copy avoids the word "Arthur" (standing rule); product named LOVELEEDAY only.

## References (real heroes, headless cloud shots, 1440 wide)
Raw full-page: refs/raw/*.png. Top 1440x900 crops: refs/top/*.png. Contact sheet: refs/sheet-refs.png (just generated; NOT yet viewed or annotated).
Captured: palantir.com, snowflake.com/en, hex.tech, databricks.com, glean.com, linear.app, vanta.com, perplexity.ai, datadoghq.com, godly.website, land-book.com, dribbble.com/search/data-platform-hero.
Missing: ramp.com. The Godly/Land-book/Dribbble pages are gallery listings, not yet mined for individual hero shots.
LEFT TO DO: view the sheet, write one "what it does well" line per reference (needs 8-12), add to board.
Note: cloud-shot.sh takes ONE url group per call poorly if more than ~4 URLs (timeout); pass urls as separate args, not a quoted string.

## Concepts (all share base.css; assets/ holds only the used real photos + mark)
1. c1-ask.html - "Ask a plain question. Get an answer you can check." Cream, left copy, right product window with 4 industry tabs (charter school, manufacturer, city government, property), answer + do-next + numbered sources. Status: built, rendered once at 1440/390 and looked good; Sentient fix applied but NOT re-rendered/viewed. 390 not yet viewed.
2. c2-footnotes.html - "Every number comes with its source." Navy, Sentient headline, memo card answering "Why did our margin drop in September?" with footnotes 1-3 (math checked). Status: built; first render showed Sentient falling back to Times (fixed in base.css, needs re-render); 390 not viewed.
3. c3-monday.html - "Start Monday already knowing what changed." Navy text panel + full-height nonprofit warehouse photo (talk-nonprofit.jpg) with a real-phone-style morning brief overlapping the seam. Status: built; first render had the phone clipped by overflow:hidden, fixed with .clip wrapper, needs re-render and check; 390 layout (phone at top:300px over a 420px photo) unverified.
4. c4-world.html - "Whatever you run, ask it a plain question." Paper, 6 expanding photo panels (schools, government, manufacturing, property, nonprofits, retail) each with a sample question/answer/source. Status: built; first render showed only one panel (others zero width), fixed by giving closed panels flex:0 0 104px, needs re-render; mobile accordion unverified.
5. c5-which.html - "Which number is right?" Paper, three disagreeing systems (412 / 405 / 398) resolved into one navy answer card with reason and sources. Status: built, rendered at 1440, looked good; 390 not viewed.

A re-render was launched in the background (`~/arthur/scripts/hero-concepts-render.sh . shots c1..c5`, log shots/render.log); its result is unchecked.

## Scripts written
- ~/arthur/scripts/hero-concepts-render.sh <dir> <outdir> <pages...>: mirrors the folder to a scratch git repo (/private/tmp/claude-501/hero-concepts-site) and renders 1440 + 390 in the cloud. Output shots/<name>-1440.png / -390.png.

## Left to do
1. View shots after re-render (both widths) for all 5; fix defects.
2. Run `node ~/arthur/scripts/visual-critic.mjs <img> "<spec>"` on each concept at both widths until pass (not started).
3. Read role files (~/arthur/employees/marketing-team/brand-strategist, product-team/ux-researcher, product-team/product-designer, design-team/brand-designer) and write marketing/UX/UI scores per concept (not started).
4. Annotate references (8-12 lines).
5. Build board: `python3 ~/arthur/scripts/make-board.py ~/Projects/loveleeday-inkind/moodboard.html hero-board.html "<title>" "<sub>" "path|label|name|story|refs" ...` with tile 0 = live hero ("Today", use a static page or the live screenshot), then the 5 concepts with scores. Serve locally on a free port (verify page title with curl, not just status), screenshot the board. Never publish to claude.ai.
6. Report: board URL + file path, board screenshot path, one line per concept, pick and why. Tentative pick: c5 or c1 (both show the actual product answering with a source in plain language); c3 is the strongest emotional/photo story but its photo only loosely supports "Monday brief".
