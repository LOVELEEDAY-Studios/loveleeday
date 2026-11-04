# LOVELEEDAY landing page: five concepts (November 2026)

Owner's words: "this needs to look like billion dollar multinational company ... on par with apple and google ... i want to be wowed with how you can improve what we have to be dynamic ... there is a lot of things i think we have that are great and then a bunch of things that are broken and look like ai slop and horrible and standard, no unique or mastery."

Previous rounds were rejected as "basic", "boring, no character, no photos", and "AI slop". A clean, rule-following page fails. Every concept needs one big idea, one hero object, and motion that carries meaning. If the idea can be described as "sections with nice animation", it has failed.

## Output
One folder per concept: `public/concepts/<slug>/index.html`, plus any `.js`/`.css` beside it. Static files, no build step. Work ONLY in your own folder. Never edit `public/site/`.

Paths from a concept page: `../../site/assets/<file>` for photos and fonts, `../vendor/<file>` for gsap.min.js, ScrollTrigger.min.js, SplitText.min.js, Flip.min.js, lenis.min.js. No CDN links: everything is local.

## Locked brand (never change)
Read `public/site/assets/site.css` for the tokens. Colors are the brand and may not change: ink #1d1d1f, near-black #14161a, muted #62656c, line #e4e5e9, blue #0066cc (actions), warm cream #f5f1eb, white. Footer dark #14110e. No new accent colors. A photograph or the brain may carry its own color.

Type: Switzer (400/500/600/700) for everything, Sentient (400, 400 italic, 500) only for Arthur's answers and the close line. Fonts are in `../../site/assets/fonts/`, declare them with @font-face. Vary size, weight and layout, never the families.

Logo: `../../site/assets/icon.svg` plus the word LOVELEEDAY in 13px, .12em tracking, weight 650.

## Keep (the good parts)
- The 3D brain: `../../site/assets/brain.js` with `brain-mount.js`. Read both before use. It needs a #brain canvas and its expected elements.
- Plain questions and three-part answers (found, why it matters, next step). Eight real demo sets are in brain-mount.js.
- Same thing filed under three names resolved to one (CRM "Northline Studio", Billing "Northline Studio Ltd.", Support "Northline"; Ledger "Vendor 44127", Mailbox "HES", Contracts "Harbor Equipment Services").
- "Every figure shows where it came from" and following an answer back to its line.
- Real product proof: `../../site/assets/portal/` (use portal-ask3-2x.png, portal-ask4-2x.png, portal-workstreams-2x.png, portal-signals-1440.png; open each to check it first. Never show one with real school data or names).
- Photography: `dinner.jpg`, `outdoors.jpg`, the manufacturing hero `industry-manufacturing-3.jpg` which is the hero the owner approved, `hero-how.jpg`, `hero-work.jpg`, `ph-schools.jpg`, `industry-hospitality-2.jpg`, `industry-retail-3.jpg`, `industry-nonprofit-2.jpg`, `ph-government-2.jpg`, `hero-customer.jpg`.
- The ending: "We give the day back." / "So you can be here."
- Real navigation: sticky bar, Product, Solutions, Services, Company, Sign in, "Talk to us" pill. Real footer columns. Copy both from `public/site/index.html`; links may point to `/site/...` placeholders.

## Kill (the broken parts)
- Rectangle stack: eyebrow, headline, paragraph, bordered card, repeated. No two adjacent sections share a silhouette.
- Centered 1080 column for everything. Use the full 1440+ viewport; let things bleed and overlap.
- A photo with a dark gradient and white text on the left, on every page.
- Stock line icons, icon tiles, pills with icons, "STEP 1" labels, gray uppercase eyebrows, fake browser chrome with three dots, glassmorphism, purple gradients, generic glowing orbs.
- Fade-up-on-scroll as the only motion.
- Rejected photos, never use: hero-decision.jpg, hero-team-desktop.jpg, hero-team-phone.jpg. Also no hero-home.jpg or ph-home.jpg: reads as staged stock.
- Never upscale a photo. Hero-size use only for files 1800px or wider.
- No answer card covering a face.

## Copy rules
Read `VOICE.md`. Questions sound like a person in a hallway. Answers say what it means and what to do. No "entity resolution", "pipeline", "ontology", "leverage", "unlock", "seamless", "transform". No public prices. Never mention Kalamazoo, Michigan, bars or restaurants as the frame; span schools, manufacturing, property, government, nonprofits, retail, professional services. No claims of customer counts, logos, awards, security certifications, or integrations not on the existing page. Never invent a customer quote. Example data is labeled "Example data." discreetly. No em dashes. No emojis. Nothing on the page may indicate how it was made.
Use "Pure intelligence. For a fuller life." only if it fits your idea.

## Motion standard
GSAP ScrollTrigger plus Lenis, or native scroll with requestAnimationFrame. Motion must explain something. Scrubbed sections stay pinned only as long as they have something to say. 60fps on a laptop: animate transform and opacity, cap canvas particle counts, pause offscreen. `prefers-reduced-motion` gets a complete static version with no missing content. The page must also read correctly with JS disabled for the first screen at least.
Every key moment must exist at rest: a screenshot taken without scrolling input, or a full-page capture, must not show blank pinned sections. Add `?static=1` support: when present, disable pins and show every section in its finished state, so full-page captures work.

## Responsive
Design at 1440 first, must hold at 1920 and 1280, and be excellent at 390 (no horizontal overflow, nothing clipped, tap targets 44px, a simplified but still striking version of the idea). Do not just stack the desktop.

## Self-check before finishing
1. Render with `~/arthur/scripts/concept-shot.sh <slug> <your-outdir> 1440,390 10`. It runs on the cloud server and writes small JPEGs: <slug>-<width>-first.jpg (as loaded), -settled.jpg, -f01..f10.jpg (real scroll frames, so you see pins mid-flight), -static.jpg (the ?static=1 full page), and prints a JSON line per width with page errors, horizontal overflow, failed requests and bad images. Errors and overflow must be empty. LOOK at the frames with Read. Never run local Chromium: this Mac has 8 GB. The server has no GPU, so WebGL runs slowly there; judge composition, not frame rate.
2. Cover the copy: are section silhouettes all different? Would this sit next to apple.com and stripe.com without embarrassment?
3. Fix what you see, render again. Report only what you actually saw in renders.
Report back: path, the one idea in one sentence, what moves, and anything unfinished. Under 120 words.
