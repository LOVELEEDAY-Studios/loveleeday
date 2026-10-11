# Design direction (proposed, awaiting Daniel)

The checker can find defaults. It cannot supply a direction, and banning one default produces the next one (EXPERTISE.md, finding 1). This file is the direction the "after" mockups are built in.

## Decision 1: the type system (Daniel must choose)

Three options on the table. The mockups use option A.

- A. Switzer (headlines, text) and Sentient (the answer voice: quoted answers, figures, pull lines). Both are from Fontshare and are the type in the brand book. Self-hosted as woff2 in `fonts/` (Fontshare's license allows it; confirm before shipping). Headlines Switzer 600 at -0.028em tracking, no heavier.
- B. Manrope, as the original brief asked. Manrope is on the banned AI-font list in `~/arthur/scripts/type-audit.mjs`, and an earlier Manrope and Next design was judged to match nothing. The live site's HTML still carries Manrope and Mulish class names, so this decision also decides whether those stay.
- C. Keep the current system stack. Not viable: it is the single largest tell (100 percent of 182,485 characters) and reads as Apple's identity.

Recommendation: A. It is the only option already in the approved brand book, it is not on any tell list, and the serif-for-answers split gives the product a recognizable voice. One risk is recorded in EXPERTISE.md: cream plus a serif is the "second wave" default, so the serif is limited to answers and figures, never to every headline, and the page keeps real photography and a navy ground.

Gotcha found on 2026-10-11: requesting `sentient@400,500` together with Switzer from the Fontshare CSS endpoint silently returns a different font. Request each family in its own call. `fonts.css` in this folder was built that way.

## Decision 2: color

Tokens, all from the brand book:

- Navy `#0B1F3A`: ink, dark grounds, primary buttons on cream.
- Cream `#F6F1E7`: page ground. Paper `#FFFBF4` for raised surfaces, `#EDE5D4` for a second band.
- Deep teal `#0A6F68`: links, kicker text, buttons on cream (5.35:1 on cream, 6.0:1 with white text). The brand book's `#0C857C` is 4.0:1 against cream and is kept for fills and large text only.
- Bright teal `#22D3C5`: buttons and accents on navy only.
- Muted blue-gray `#3B4D63` for secondary text on cream, `#A9B6C8` on navy. Rule `#DDD3BF`.
- Retired: `#1d1d1f`, `#f5f5f7`, `#0066cc`, `#0071e3`, and the multicolor (green, blue, orange, purple) brain palette.
- Amber `#F2B84B` and coral `#E5675B` stay for state only (needs attention, problem), never as decoration.

## Decision 3: type scale and rules

- Five steps: 64, 40, 28, 20, 17 px. Two weights (400 and 600; 500 for small labels). No other heading size anywhere. Today: 13 distinct h2 sizes and 98 percent at one weight.
- No two-tone or two-sentence headlines. One sentence that says the thing.
- No tracked all-caps labels. If a label is needed it is sentence case, 14px, 600, deep teal. Better: delete it and let the heading do the work.
- No arrows on rows; one text link per section, underlined, no glyph.
- No pill chips unless they carry real state (a status the system actually holds).
- Cards only when the content is a record. Rows, tables and photographs replace card grids. Radius 4 to 6 px.
- Sections vary: statement, working table, photo band. Three different paddings.

## Decision 4: imagery

- Real photography across every industry, schools and charters included, from the licensed set already in `assets/`. A photograph must match the words beside it; no card laid across a face or hands.
- The particle brain is replaced by a diagram that shows the mechanism: three records with three names resolving to one company, in cream and teal on navy.
- No browser-window frames around mock interfaces. A real answer is shown as an answer (a table with sources), not a screenshot of a pretend app.

## Copy

- Plain questions and plain answers; say what to do. No filler verbs (unlock, elevate, streamline, seamless). No "not X, it is Y" frames: 18 on the live site today.
- Example data is labeled once, in the caption, not in a pill.
- No prices on any public page.
