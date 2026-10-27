# LOVELEEDAY site: brand, copy and excitement pass (2026-10-27)

Daniel's words: "update the copy on all the pages to get codex to sign off along with color and typography consistency along with making every page a 10" and "the home page also looks extremely boring, several of the pages look extremely boring and lack excitement and branding and consistency."

Worktree: /Users/danielmay/wt/ll-review-1026 (branch review/full-site-2026-10-26). Static site in public/site/. NOT the Next.js app; do not touch anything outside public/site/ and review/. Do not commit, push or deploy; the lead session commits. Never run bare `git stash` or `git checkout -- <file>`.

## The reference: the new home page
Open public/site/index.html and public/site/assets/brand.css, and look at the render review/out/score-h2/shots/site_index-1440.png (Read it in bands with `img band <png> 0-1100 1100-2200 ...`). That is the bar and the system. What changed it from boring to branded:
- Proof in the hero: a white answer card (question, Sentient-serif answer, sources line) overlapping the hero photo.
- One editorial statement: big Switzer headline left, Sentient 28px paragraph right with a highlighted key sentence.
- The signature: the 3D particle brain (assets/brain.js + assets/brain-mount.js) on a night radial ground.
- The real product, large: portal screenshot in a soft blue-to-cream frame, with a readable zoom card of the answer and its source.
- A photo mosaic: one dominant photo plus smaller ones, each captioned with a different plain question.
- Section grounds alternate white / cream / night, never two of the same ground in a row, never a grey that is not mist.
- A closing scene on a full-bleed photograph with the CTA over it.

## Fixed brand (do not change)
- Palette in fixed roles, nothing else: ink #1d1d1f text, night #0b0b10 the ONLY dark ground, cream #f5f1eb the ONLY warm ground, mist #f5f5f7 the ONLY cool grey ground, white, action blue #0066cc. Replace any other dark (#14161a, #101114, #14151b, #13131a, #17130f, #231a11) or grey (#fafbfd, #f7f7f9, #fafafb, #f2f3f5) ground on your pages with these via your page CSS. Tokens: var(--b-night) var(--b-cream) var(--b-mist) var(--b-blue) var(--b-ink) var(--b-mute) var(--b-line).
- Type: Switzer for everything; Sentient serif ONLY where Arthur or a person speaks (answers, quotes, statements). Desktop scale is already set by brand.css (--t1 80, --t2 52, --t3 30, --t4 21, --t5 18). Nothing under 14px at desktop. No tracked caps, no 01/02/03 markers, no "STEP 1" eyebrows, no icon pills, no three identical cards in a row.
- Buttons: one blue pill primary, text links secondary. brand.css already does this.
- Photography: licensed stock in public/site/assets/*.jpg (look at them with Read before choosing). Never AI-generated images, never mention Midjourney. Never use hero-decision.jpg, hero-team-desktop.jpg, hero-team-phone.jpg.

## Copy rules (Daniel's standing rules)
- Plain language a busy owner understands. Questions the way a person would ask them; answers say what it means and what to do. No data jargon (ontology, lineage, bitemporal, canonical object, ingestion, pipeline, schema, SECURITY DEFINER...). If a page is about architecture, explain it in plain words.
- Examples span industries: schools and charters, cities, retailers, manufacturers, property managers, nonprofits, hospitality. Never anchor to bars or restaurants, never mention Kalamazoo or Michigan.
- Never repeat an example question that another page uses. Grep the site before you use one: `grep -rl "<phrase>" public/site --include=*.html`.
- "LOVELEEDAY", never "LOVELEEDAY Studios" (legal name only in the footer/legal pages).
- No public prices. Customer-facing benefits only; no internal process, infrastructure or gaps.
- No AI-made tells: no two-part "X. Y." headlines, no "unlock", "seamless", "empower", "leverage", "in today's world", no em-dash flourishes in headings.
- Do not invent facts, customers, numbers or testimonials. Example data is labeled as example data.
- Do not write the word "Arthur" more than the page needs; it is the product name, keep it.

## Phone layouts
The 390px phone layouts were approved. Put layout changes inside `@media (min-width:1021px)`. Copy changes will show on phones too; that is expected. After your changes, render 390 once per page and Read it to confirm nothing broke (no overflow, no overlap, no blank sections).

## How to work
1. Create ONE CSS file per page: public/site/assets/pages/<page>.css (use the page name with / replaced by _, e.g. industries_schools.css). Link it in that page's <head> immediately after the brand.css link: `<link rel="stylesheet" href="/site/assets/pages/<page>.css?v=b1">`. Scope every rule with the page's body class (e.g. `.pg-talk`). Do NOT edit brand.css, site.css, desktop.css, type.css, chrome.css, fx.css or any file another worker owns. If you believe the shared system needs a change, say so in your final report.
2. Edit only the HTML files you were assigned (copy and markup). Keep every link, nav, footer and SEO meta intact; update meta description/og text if the page's message changes.
3. Look before and after: render with `review/shot-pages.sh <outdir> 1440 <page>` (it queues behind other workers; never call cloud-shot.sh directly, never run local Chromium). Read the PNG in bands.
4. Score with `review/score-page.sh <round-name> <page> [<page>...]` (use a round name unique to you, e.g. A1, A2). It renders, strips and gets an independent Codex score with COPY notes. Read the full Codex text in review/out/score-<round>/<page>.txt and fix the specific defects. Codex varies about one point between runs, so read its defects, not just its number; diagnose the cause in the markup/CSS, do not swap things blindly.
5. Iterate until every page you own scores 9 or 10 with "COPY: ok" or only nits, or until you have done 4 scoring rounds per page. Stop there.
6. Final report (short): per page, the last score and Codex's remaining defects, the files you changed, any shared-system change you recommend. No recap of the brief.
