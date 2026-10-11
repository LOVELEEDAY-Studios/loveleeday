# HANDOFF: LOVELEEDAY AI-tells review (paused 2026-10-11)

Working dir: ~/arthur/data/loveleeday-ai-tells-2026-10-11/. Neither live repo (~/Projects/loveleeday, ~/Projects/arthur-launch) was edited or deployed. No local Chromium or visible windows were used; all browsing ran through the cloud browser (~/arthur/lib/arthur-browser/client.js).

## Done

1. Research and expertise (step 1 complete).
   - EXPERTISE.md (this dir) holds the sourced write-up: 16 external sources (S1-S16) plus local notes (typography-mastery.md, refactoring-ui, emil-design-eng, memory note learned_lovelleeday-ai-design-patterns). Sources are blogs and skill pages, not studies. S9 and S11 were read via search snippets only. The em-dash and bento claims are contested or unsupported.
   - Banked as ~/arthur/knowledge/design/ai-made-website-tells-mastery.md, with a correction note that typography-mastery.md recommends Inter, Geist and SF Pro (the defaults listed as tells). A pointer line was added to ~/arthur/knowledge/design/README.md.

2. Crawl and audit (step 2 complete).
   - crawl/all.json holds the computed-style crawl of 35 public pages (urls-live.txt, from the shots facts files) at 1440. crawl/baseline.txt holds the checker output. analyze.mjs prints the counted tells from the JSON.
   - Portal authenticated pages were NOT crawled. They are covered by the existing screenshots only (~/arthur/data/loveleeday-review-2026-10-11/shots/qa_client_*.png and qa_login_1440.png).
   - Per-instance selectors and rects are stored in all.json. Per-instance screenshot crops were NOT made yet.
   - Home page slices for viewing are in slices/ (pub_chunk_aa_home_1440-s1..s10.png).
   - Caveat: the cloud browser is Linux, so `-apple-system` renders as Arial. On a Mac it is SF Pro. The tell is the same.

3. Counts so far (35 pages):
   - Default system stack: 100 percent of 182,485 characters.
   - Apple hexes: #1d1d1f on 34 of 35 pages, #0066cc on 28, #f5f5f7 on 26.
   - Two-part headlines: 54 of 185 h1/h2 (29 percent); home alone has 8.
   - Two-tone headlines: 46 percent of h1/h2.
   - Tracked uppercase labels: 562 total, mean 16 per page, 42 on home, 85 percent at 10px.
   - Type scale: 13 distinct h2 sizes; 98 percent of h2 at weight 500; 44 of 150 h2 at -2.16px tracking.
   - Pill chips: 351.
   - Rounded surfaces: 255, with 132 (52 percent) in rows of 3+ identical siblings.
   - Left-accent card: 1 (/talk, div.tv3-a).
   - "Not X, it's Y" frames: 18.
   - Arrow glyphs: 27 in copy, plus one per list row.
   - Not tells here: no purple or gradient text, centered sections 1 percent, filler verbs near zero, section padding variety is fine (40 percent same-padding share).
   - Brand-as-tell: Apple palette and stack are borrowed identity; the multicolor particle brain is the stock "AI brain" look.

4. ai-tell-check.mjs (step 4 mostly done): ~/arthur/scripts/ai-tell-check.mjs.
   - Modes: URLs or `--urls-file` (cloud browser, computed styles), `--dir` (static CSS/HTML), `--from-json` (re-evaluate a saved dump), `--json out`, `--config`.
   - Measures 18 tells with thresholds in DEFAULTS and exits 2 when over.
   - Baseline against the live site (35 pages), run from crawl/all.json: exit 2, 9 tells over threshold: twoToneHeadlineShare 0.46 (limit 0.10), h2SizeVariety 13 (6), singleWeightShare 0.98 (0.90), tinyLabelShare 1.00 (0.40), defaultStackShare 1.00 (0.15), defaultHexHits 3 (0), twoPartHeadlineShare 0.29 (0.15), allCapsLabelsPerPage 16.06 (4), leftAccentCards 1 (0). Full text is in crawl/baseline.txt.
   - Thresholds are judgment calls grounded in the sources. The twoPart limit was lowered from 0.30 to 0.15 after seeing the data.
   - Known gaps: the card-uniformity and icon metrics only work in computed mode, not `--dir` mode; no portal run yet.

5. Mockups (step 3, generated but NOT rendered).
   - mockups/build-mockups.mjs defines 14 before/after pairs and writes `<id>-before.html` / `<id>-after.html` plus mockups/index.json. The last `node build-mockups.mjs` run was moved to a background task (bra1bu13y) when it timed out. Check whether the 28 html files and index.json exist; if not, re-run it (it should take under a second, so the timeout is suspicious, so check the sed edit that preceded it).
   - Pairs: 01 two-tone headline, 02 eyebrow labels, 03 Apple palette and stack, 04 type scale, 05 hero card on photo, 06 three-feature row, 07 four identical cards, 08 status pills, 09 particle brain vs resolution diagram, 10 fake browser frame, 11 copy frames, 12 repeating section pattern, 13 arrow list, 14 portal dashboard.
   - Proposed direction used in the "after" files: navy #0f2233, paper #f6f1e7, deep teal #0e6a6a, Newsreader headlines and Public Sans text, five-step type scale, no eyebrows or two-tone headlines. Second-wave risk (cream plus serif) is noted in EXPERTISE.md; the direction must be written into a design-direction file.
   - Product name was replaced in the "before" copy with LOVELEEDAY to keep the rule against that name; quoted live headings in baseline output and EXPERTISE.md still contain it as evidence.

## Left to do

1. Confirm build-mockups output, then write render-mockups.mjs: cloud browser, page.setContent per html, wait for fonts, screenshot `#stage` at 1440 and 390 into mockups/img/. Images load from https://loveleedaystudios.com/assets/ (hero-decision.jpg, brain.png).
2. Look at every render, fix defects, then run ~/arthur/scripts/visual-critic.mjs on each after image (exit 2 = fix and rerun).
3. Optional: element crops of the live instances (page, selector, crop) for the board.
4. Write WIRING.md in this dir: hook points once Daniel approves (npm run check:site in ~/Projects/loveleeday, loveleeday-render-check-deploy skill, an action-guard rule, design-gate skill), plus the written design-direction file the checker presupposes. Do not wire into the live repos yet.
5. Build the board (mockups/board is not created; use board/ in this dir): each pair side by side at 1440 and 390, tell name, count, source. Serve on a free port, verify the page title with curl (not just a 200), screenshot it and look at it. Never publish to claude.ai.
6. Final report: top tells with counts, board URL, file paths, screenshot path, baseline output, knowledge file path.

## Notes

- Rule 45 hook blocks Bash heredoc file writes; use the Write or Edit tools.
- `img slice` writes next to its input; run it on copies.
