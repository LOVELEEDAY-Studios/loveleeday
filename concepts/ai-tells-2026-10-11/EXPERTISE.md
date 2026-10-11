# What makes a website read as AI-made or template-made (2025-2026), and how it maps to loveleedaystudios.com

Researched 2026-10-11. Every external claim carries its source in brackets; the source list is at the end. Where the sources are opinion rather than measurement, that is stated. Counts about our own site come from the headless cloud-browser crawl of 35 public pages (`crawl/all.json`, produced by `~/arthur/scripts/ai-tell-check.mjs`).

## The one idea underneath all of it

The sources agree on a single mechanism. A model asked for "a modern, clean website" returns the statistical middle of its training data, and the middle of web training data is Tailwind demos, Apple-style marketing pages and SaaS templates [S4, S6, S8]. Anthropic's own frontend guidance says it directly: safe design choices dominate web training data, so without explicit steering the output converges on them [S6, S8]. The tell is therefore not any one pattern. It is the absence of a decision. One writer puts it as "Conventional is fine. Visibly undecided is not." [S8] A second writer gives the human test: would the founder actually say this line out loud, and would anyone miss the page if it were removed [S3].

Two further findings shape how we fix things:

1. Banning one default produces the next default. Avoid purple and the output becomes cream paper, a high-contrast serif and a terracotta accent; avoid that and it becomes near-black with one acid-green accent, then hairline-ruled "broadsheet" layouts [S2]. So the fix is a written design direction, not a longer ban list.
2. A scanner cannot invent direction. A filter can only find defaults; if the result is sterile it is because the direction was never written down [S2, S8].

## Tells by family

### 1. Typography

- The default font stack. Inter is the most-cited tell, followed by Roboto, Arial, Open Sans, Lato, Geist, Plus Jakarta Sans and the bare system stack [S1, S3, S4, S6, S7]. Anthropic's steering prompt tells the model "Never use: Inter, Roboto, Open Sans, Lato, default system fonts" [S6]. Fixing only this "clears the most common tell in a single move" [S8]. Our local typography notes list Inter, Geist and SF Pro as recommended pairings [typography-mastery.md lines 186-231, 761]; those lines are the model's own bias and are corrected in the banked version of this file.
- The Apple clone. A page set entirely in `-apple-system` / SF Pro with Apple's grays reads as "Apple-inspired template". The SF license also restricts use outside Apple platforms, and other projects swapped to Inter for that reason [S14]. Note that this tells twice: it is a default, and it is a borrowed identity.
- No typographic contrast. AI layouts apply type "from a list": arbitrary sizes, a uniform line-height, one weight, so everything has the same importance and users do not know where to look first [S12, S13]. Practitioner checklists add: semibold body copy, 48px-plus headings with no negative tracking, hero lines over 45 characters, body lines of 70-80 characters [S7].
- Decorative tracked uppercase. Wide letter-spacing applied automatically to uppercase labels and eyebrows, even where it hurts legibility, is a named tell [S5]. "Tracked all-caps eyebrows over every heading", `A · B · C` meta strings, monospace micro-labels and 01/02/03 markers on content that is not a sequence are the second-wave version [S2]. Refactoring UI's own rule is the counter: tracking is intentional per context, and ALL CAPS always gets tracking (so tracking is not the sin; ubiquity is) [refactoring-ui skill].
- Accenting one headline word in italic, bold or colour [S2]. The gray second line of a headline is the same move applied to a whole line.
- Gradient text on headlines [S1, S2, S4].

### 2. Spacing and rhythm

- Uniform everything. "Same padding, same corner radius, same card height across the screen. Everything shouts at the same volume." [S3] Practitioner lists: every section the same height, padding and heading size; no asymmetry; no density changes [S7]. The fix named in the sources is intentional variation: the primary element bigger, closer and heavier, the rest receding [S3]. Refactoring UI says the same: you do not have to fill the grid, give primary content more space, 2/3 + 1/3 beats 1/2 + 1/2 [refactoring-ui skill].
- Oversized radius on cards, buttons, inputs, badges and images at once, which flattens hierarchy [S5, S7].
- Stacked card styling: shadow, border and background tint all applied at once, and cards nested inside cards [S2, S7].
- A thick coloured border on one side of a rounded card is called out by designers as a signature of AI-generated UI [S3, S5]. This is a designer's assertion, not a measurement.

### 3. Colour

- Purple or indigo, purple-to-blue gradients, glow behind cards [S1, S4, S8]. The usual origin story is that Tailwind UI's demos used `bg-indigo-500` and the model learned it; the account of Adam Wathan apologising for that is secondhand and unverified here [S4].
- Stock class tokens as palette: indigo-600, slate-900, rounded-2xl, shadow-lg [S8]. Renaming `indigo` to `primary` changes the label, not the palette [S8].
- Palette is out of scope. The LOVELEEDAY palette (#1d1d1f ink, #f5f5f7 surface, #f5f1eb cream, #0066cc blue, the dark sections) is the owner's brand, set by Daniel, and is out of scope for this review. See concepts/BRAND-COLORS.md. Color is never counted as a tell. Only the font stack and structural patterns are reviewed.
- Second-wave defaults (for new work; LOVELEEDAY's own cream #f5f1eb is the owner's brand and exempt): cream `#F4F1EA`, a serif display face, terracotta `#D97757` (which is Anthropic's own interaction accent) [S2]. Dark near-black with one acid accent [S2].
- Dark mode by simple inversion [S7]. Glassmorphism and blurred glow with no reason [S2]. Brand colour on nav, buttons, links, borders, badges and focus rings at once [S7].

### 4. Layout

- The page order: centred hero, pill badge, two buttons, logo row, three feature cards, pricing, closing call to action [S2, S8, S9]. Same section order of hero, features, social proof, pricing, FAQ, footer [S8].
- Three equal feature cards, each with an icon, title and two lines of copy; the icon-in-a-coloured-circle variant [S1, S4, S7].
- Everything centred, with no directional alignment for narrative [S7]. (Our site is the opposite: 1 percent of sections are centred. Not a tell here.)
- Bento grids are now ubiquitous (a May 2026 trend piece says they have become a defining pattern across landing pages [S15]); I found no source calling them a tell, so I treat them as "overused, not damning".
- Visibly undecided: every section reads as a different dialect of the site because each page was art-directed separately [S8, S9 snippet].

### 5. Components and detail

- Pill badges with a pulsing dot saying "Live" or "New" on things that are neither: "decoration cosplaying as information" [S5]. Status chips that carry no real state belong here.
- Default icon sets (Lucide, Heroicons) at default size and weight, and an arrow on every link ("Get started →") [S7].
- Fake browser chrome with three traffic-light dots around a mock UI. I found no source naming it; it belongs to the template-screenshot genre and is flagged here as my own judgment.
- Missing unhappy paths: no empty, error, loading or zero-data state; hover-only actions; no focus rings [S3, S7].
- Accessibility defaults that fail: text under AA contrast, targets under 44px, colour-only signals, no reduced-motion handling [S7]. Tiny 10px labels are in this group.

### 6. Motion

- The same fade-and-slide-up on every section, bounce easing, count-up stats, drifting hero blobs, shimmer on hover, the same `hover:scale-105` everywhere [S2, S7]. The fix: one orchestrated moment (a staggered page load), and motion only in response to a user action [S2, S6, S3]. Emil Kowalski's rules point the same way: animate only what the user caused, specify exact properties rather than `transition: all`, use ease-out for entrances [emil-design-eng skill].

### 7. Imagery

- The glowing neural-network brain, nodes-and-lines on a dark ground, is the stock vocabulary of AI marketing: stock libraries sell exactly this as "glowing brain / neural network" art and generators advertise it as a replacement for stock search [S16]. No design critic in my search argues it is a cliche in so many words, so "it reads as stock AI imagery" is my inference, supported by how many stock listings share it.
- Generic AI illustrations and stock photos, instead of real product screenshots, real data and custom visuals [S5]. Anthropic's guidance asks for atmosphere and depth rather than flat backgrounds [S6].
- Photos that do not match the sentence beside them (our own standing lesson: Doorlight, 2026-10-10).

### 8. Copy

- Generic two-part slogans: "Build faster. Ship smarter." [S1] Generic aspirational lines: "Build the future of work", "Scale without limits", "Your all-in-one platform" [S3].
- Filler verbs: unlock, empower, elevate, streamline, supercharge, leverage, transform, seamless [S7, S10, S11]. Feature names built from two nouns ("Seamless Integration") [S8].
- The frames. "It's not X, it's Y" and "It's not just X, it's Y"; two short fragments glued together; always three things (the tricolon); "say goodbye to X" [S11]. The em dash is the most-cited tell but the evidence for it is weak and contested; one professional writer says punctuation is "the least of your problems" and the real tell is predictable, unsurprising rhythm [S10]. We therefore count em dashes at low weight and rhythm patterns at high weight.
- Invented or too-round numbers: "Increase efficiency by 47%", "10,000+ teams", "99.9% uptime", a 10,000 percent ROI stat [S2, S7]. Placeholder names and fake brands: John Doe, Acme, Globex [S7]. Rule from the sources: name what the button does, and delete any number you cannot source [S2].
- Removing tells does not remove slop: "either it was slop before, then after removing the AI tells, you still have slop" [S10].

## Findings on this site (35 public pages, 1440px, cloud browser, 2026-10-11)

Baseline from `ai-tell-check` (full output in `crawl/baseline.txt`): 9 of 18 measured tells over threshold.

| Tell | Measured | Where |
| --- | --- | --- |
| Default system stack on every character | 100 percent of 182,485 characters set in `-apple-system` (the cloud browser renders it as Arial/Liberation because it is Linux; on a Mac it is SF Pro) | all pages |
| Two-part headline | 54 of 185 h1/h2 (29 percent) are "Short sentence. Short sentence." or "X, not Y" | 29 pages; home alone has 8 |
| Two-tone headline (second line gray) | 46 percent of h1/h2 | home, architecture, arthur, customer-data, how-it-works, operating-system, pricing-margins and more |
| Tracked uppercase labels | 562 across 35 pages, mean 16 per page, 42 on the home page; 85 percent are 10px | every page including the portal sign-in |
| One heading weight, one tracking value | 98 percent of h2 are weight 500; 44 of 150 h2 use exactly -2.16px tracking | all pages |
| No type scale | 13 distinct h2 font sizes (26, 30, 34, 36, 38, 40, 44, 48, 50, 52, 60, 62px plus a 10px outlier) | all pages |
| Pill chips | 351 pill-shaped chips and status dots, many carrying no state ("Talk to us", "Illustrative example", "One customer") | home, architecture, customer-data |
| Same-radius cards | 255 rounded surfaces, 132 of them in rows of 3+ identical siblings (52 percent) | home, industries, faq, customer-data |
| Left-accent card | 1 (the `tv3-a` card) | /talk |
| "Not X, it's Y" frames | 18 | the notes essays and home |
| Arrows on links | 27 arrow glyphs plus the diagonal-arrow glyph on every row | home, industries |

What is NOT a tell here, stated so the fix list stays honest: no purple or indigo anywhere, no gradient text, no centred-everything layout (1 percent of sections), no three-icon card row built from Lucide (the icons are single glyph characters), banned filler verbs are nearly absent (3 hits in 35 pages), and section padding is not uniform (40 percent share, under the 60 percent limit). Section structure, however, is a repeating pattern the counters do not capture: eyebrow label, two-tone headline on the left, one paragraph on the right, repeated section after section, alternating dark, white, gray and cream bands.

The brand itself is partly the tell in two places (the stack and the rendering of the brain; not the palette). The system stack is a default, not a chosen face. The palette is the owner's brand and is not a finding. The glowing multicolour particle brain on the home page is the stock "neural network" image; the idea (a map of how records connect) is the brand's, the rendering is the default.

## Sources

- S1 925 Studios, AI Slop Fonts and Gradients: https://www.925studios.co/blog/ai-slop-design-tells
- S2 Capital and Compute, How to Fix AI Slop in Web Design, Tell by Tell: https://capitalandcompute.net/blog/fix-ai-slop-design/
- S3 Kosta Canatselis, Spot the Slop: https://world.hey.com/kostac/spot-the-slop-a-ui-designer-s-guide-to-fixing-ai-defaults-4c448c9c
- S4 prg.sh, Why Your AI Keeps Building the Same Purple Gradient Website: https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website
- S5 Noqta, AI design slop and overused UI patterns, 2026: https://noqta.tn/en/blog/ai-design-slop-overused-ui-patterns-fix-2026
- S6 Anthropic, Improving frontend design through Skills: https://claude.com/resources/articles/improving-frontend-design-through-skills
- S7 Laith0003 ux-skill wiki, How to detect AI slop in your design: https://github.com/Laith0003/ux-skill/wiki/How-to-detect-AI-slop-in-your-design
- S8 CodeMySpec, How to Keep Your Website From Looking Like Every Other Vibe Coded Website: https://codemyspec.com/blog/vibe-coded-websites-look-the-same
- S9 UX Planet, How to spot AI-generated design (search snippet only, paywalled): https://uxplanet.org/how-to-spot-ai-generated-design-697aaabe76c8
- S10 Nebo Agency, AI Can Pry the EM Dash Out of My Cold, Dead Hands: https://www.neboagency.com/blog/ai-can-pry-the-em-dash-out-of-my-cold-dead-hands/
- S11 Pillitteri, The New Em-Dash: 9 Signs of AI Writing (search snippet; page fetch failed): https://pasqualepillitteri.it/en/news/11195/new-em-dash-9-ai-writing-tells
- S12 UX Studio, Typography and AI: https://www.uxstudioteam.com/ux-blog/typography-ai
- S13 Vibecoder, Typography in web apps and AI defaults: https://blog.vibecoder.me/typography-web-apps-ai-defaults-override
- S14 Apple/SF Pro licensing discussion via search results (third-party quotes; check Apple's license directly): https://design.hagicode.com/designs/apple/
- S15 Pixso, Bento grids (May 2026): https://pixso.net/articles/bento-grids/
- S16 Adobe Stock and Pixa neural-network listings (evidence of stock ubiquity, not a critique): https://stock.adobe.com/images/a-glowing-neural-brain-design-representing-artificial-intelligence-neural-networks-and-data-processing/1417231107
- Local: ~/arthur/knowledge/design/typography-mastery.md; ~/.claude/skills/refactoring-ui/SKILL.md; ~/.claude/skills/emil-design-eng/SKILL.md; memory note learned_lovelleeday-ai-design-patterns (prior flags, confirmed by the crawl above).

## Limits of this research

Most sources are design blogs and skill-marketplace pages, not studies; none measures how often a given tell appears in AI output. The em-dash and bento claims are contested or unsupported. Two sources (S9, S11) were read only through search snippets. Thresholds in `ai-tell-check` are judgment calls grounded in these sources, not published standards.
