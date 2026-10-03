/* Holly Jolly — four landing directions, LOVELEEDAY design review. INTERNAL, local only (dev server :3007), not
   deployed, nothing sent. Designs live at public/p/holly-jolly-designs/<name>/index.html with the shared gpt-image
   set at public/p/holly-jolly-designs/imagery/. Sources: briefs in ~/arthur/briefs/holly-jolly (DESIGN.md, 00-launch-plan.md,
   landing/r3-NAME/NOTES.md). Measured Oct 3, 2026 with scripts/hj-audit.mjs + hj-interact.mjs (Playwright, system Chrome). */

export const clients = [{ token: "holly-jolly-designs-internal", short: "Holly Jolly Gift Company", preparedFor: "Daniel May", role: "Founder" }];
export const getClient = (t: string) => clients.find((c) => c.token === t);

const BASE = "/p/holly-jolly-designs";
export type Sev = "fix" | "watch" | "good";
export type Tag = "done" | "free" | "needs" | "money";
export type Grade = { who: string; g: string; why: string };

export const reviewers = [
  { id: "ad", name: "Brand / Art Director", lens: "Concept, imagery consistency, type, fit to DESIGN.md" },
  { id: "ux", name: "Senior Web / UX Designer", lens: "Layout, hierarchy, mobile, accessibility, motion" },
  { id: "dtc", name: "DTC E-commerce Operator", lens: "Offer clarity, CTA, $64.99 Family Set, $59 free ship, Dec 7, trust, checkout path" },
  { id: "pm", name: "Performance Marketer", lens: "Meta/TikTok message match, load weight, creative-to-page continuity" },
];

export type Concept = {
  id: string; n: number; name: string; title: string; tagline: string; idea: string;
  hero: string; desktop: string; mobile: string; live: string;
  grades: Grade[]; overall: string;
  strengths: string[]; weaknesses: string[];
  weight: string;
};

export const concepts: Concept[] = [
  {
    id: "editorial", n: 1, name: "Editorial Luxe", title: "The Long Table Issue", tagline: "A holiday issue of a design magazine.",
    idea: "Masthead-scale Fraunces over a cover photo, an editor's letter, a dark contents list where the four products are articles, a full-bleed plate, an artists feature, the Family Set as a still life with hotspots, and a giant italic colophon.",
    hero: `${BASE}/img/editorial-hero.jpg`, desktop: `${BASE}/img/editorial-desktop.jpg`, mobile: `${BASE}/img/editorial-mobile.jpg`, live: `${BASE}/r3-editorial/index.html`,
    grades: [
      { who: "Brand / AD", g: "A-", why: "The most expensive-feeling page: real type scale, restrained palette, the gift tag used as a device." },
      { who: "Web / UX", g: "B+", why: "Strong hierarchy and a working bag drawer; hero CTA is 'Read the contents', and the page is long." },
      { who: "DTC operator", g: "C+", why: "The Family Set price is a small tag on the cover and the first add-to-bag is about 2,300px down; the lead CTA does not sell." },
      { who: "Performance", g: "C", why: "Tone matches a premium gifting audience, not a scroll-stopping Meta ad; 18.7 MB of uncompressed PNG." },
    ],
    overall: "B",
    strengths: [
      "Type and spacing are the best of the four: oversize Fraunces masthead overlapping the cover plate reads as a designed object, not a template.",
      "Contents list turns the four products into a price menu ($64.99, $21.99, $34.99, $59.99) with a one-tap add; the bag drawer shows 'Free shipping unlocked' and a Checkout button.",
      "Cleanest accessibility basics of the set: one h1, a main landmark, alt on all 10 images, visible 2px focus outlines, reduced motion honored.",
    ],
    weaknesses: [
      "Primary hero CTA is 'READ THE CONTENTS'. Nothing above the fold on mobile shows the offer except a small tag over the photo.",
      "Four photographic looks in one page (dark red studio cover, candlelit hands, daylight flatlay, cutout box); cohesion comes from palette only, and hands-wrapping is soft at full bleed.",
      "Copy claims 'drawn by named artists, painted by hand, gouache' while the art is AI-generated placeholder; fine in a prototype, a legal and brand problem live.",
    ],
    weight: "18.7 MB, 13 requests (10 images, none lazy; five PNGs of 2.4 to 3.4 MB)",
  },
  {
    id: "pop", n: 2, name: "Bold Pop", title: "Wrap the Whole Table", tagline: "Saturated colour blocks, hard-offset stickers, a squeezed grotesque.",
    idea: "Every section is a colour block (pomegranate, marigold, teal, periwinkle, plum) with scalloped seams, a marquee, a drag carousel of six patterns, a stop-motion pile grid, the Family Set bundle with three price cards, a feed section and a live Dec 7 countdown.",
    hero: `${BASE}/img/pop-hero.jpg`, desktop: `${BASE}/img/pop-desktop.jpg`, mobile: `${BASE}/img/pop-mobile.jpg`, live: `${BASE}/r3-pop/index.html`,
    grades: [
      { who: "Brand / AD", g: "B-", why: "Loud and ownable, but it leans toward a candy brand; the periwinkle block breaks the 'sparing' rule and the wordmark loses the gift-tag warmth." },
      { who: "Web / UX", g: "B", why: "Clear rhythm and big targets (only 4 undersized on mobile), stepped animation fully off under reduced motion; no main landmark." },
      { who: "DTC operator", g: "A-", why: "Only design with the offer above the fold on desktop and mobile: 'Shop the Family Set', '1 roll + 5 cards + printable tags, $64.99, ships free', then the bundle, three add-ons and the deadline." },
      { who: "Performance", g: "A-", why: "Hook, offer and deadline in one screen match a 'whole table' ad; but it is the heaviest page at 21.1 MB." },
    ],
    overall: "B+",
    strengths: [
      "Conversion spine is correct: hero CTA to Family Set, bundle card with contents list, three supporting price cards, free-ship line, honest deadline countdown, and a cart that shows 'Free shipping unlocked'.",
      "Reads instantly at feed speed on a phone; the Family Set CTA and price are in the first 844px.",
      "Sticker, marquee and scallop system is consistent and fun, and the countdown uses the real deadline with honest no-scarcity copy.",
    ],
    weaknesses: [
      "The gift pile, carousel and 'six patterns' are repeats: 3 source patterns cropped into 6 cards, one gift hue-rotated (which also shifts drawn skin tones).",
      "UGC section is four dashed placeholder frames; the phone is a still. Ship with it empty and it reads unfinished.",
      "On mobile the 'ARTISTS ANNOUNCED NOV 1' starburst overlaps the end of the price line ('printable tags.'). Checkout button shows a 'not wired' toast (prototype).",
      "21.1 MB across 13 requests, 30 img elements, none lazy.",
    ],
    weight: "21.1 MB, 13 requests (30 img elements, none lazy)",
  },
  {
    id: "storybook", n: 3, name: "Illustrated World", title: "One dusk street", tagline: "A pinned horizontal walk past six lit windows, each unrolling a paper.",
    idea: "The whole site is one snowy street at dusk. Scroll walks past six houses; the centred window lights up and unrolls its wrapping paper with Add roll. Then the rolls, a six-arch print library, the offer as a big gift tag, named artists and a footer.",
    hero: `${BASE}/img/storybook-hero.jpg`, desktop: `${BASE}/img/storybook-desktop.jpg`, mobile: `${BASE}/img/storybook-mobile.jpg`, live: `${BASE}/r3-storybook/index.html`,
    grades: [
      { who: "Brand / AD", g: "B+", why: "The strongest concept: it shows families in windows and makes the paper the payoff. Execution seam: simple vector houses sit beside textured raster patterns." },
      { who: "Web / UX", g: "C+", why: "Clever pinned scroll, but it is a 600vh runway, hides 'Add roll' until a panel is lit, and mobile shows only a peek of the first house." },
      { who: "DTC operator", g: "B-", why: "Family Set CTA with price is above the fold, tag-shaped offer is clear; but single rolls lead the narrative and the buy path is buried behind the walk." },
      { who: "Performance", g: "C+", why: "Message match for 'every family' ads is excellent, but the page asks for patience cold traffic does not have; 10.1 MB and 123 running animations." },
    ],
    overall: "B-",
    strengths: [
      "Best story: 'Every window is a different family's holiday' says the brand promise in one line, and each window includes a wheelchair, two dads, a menorah or a grandmother's table.",
      "Offer section is the clearest: a big gift tag with $64.99, four bullets, 'Ships free', and Roll, Card 10-pack and 3-roll bundle priced beside it.",
      "Verified live: the street pins and walks through all six houses, the progress label updates (No. 2 of 6 ... No. 6 of 6), the window nearest centre lights and shows its paper. Reduced motion stops the animation.",
    ],
    weaknesses: [
      "Imagery is two systems: hand-built SVG houses and scenes (flat, dot faces) versus the gpt-image raster patterns. The brief asked for cut-paper gouache with a shared grain.",
      "Pinned horizontal scroll over 600vh on mobile: the hero shows a cropped house and the lit window sheet can be hidden on house 1. Last print swatch scrolls off-screen on desktop.",
      "Footer contact is a placeholder (hello@hollyjolly.example); checkout is a front-end stub; the artists section shows six small illustrations labelled 'Artist announced Nov 1'.",
    ],
    weight: "10.1 MB, 10 requests (4 PNGs of 2.2 to 2.5 MB; the rest is inline SVG)",
  },
  {
    id: "night", n: 4, name: "Cinematic Night", title: "Christmas Eve", tagline: "The last hour of Christmas Eve, a live 11:47 PM clock, Bodoni on near-black.",
    idea: "Hero is a candlelit table through a window with a live clock, a scroll-lit statement, three chapters (Table, Lights, Snow) each ending in a paper-pattern chip, the Family Set as a product launch, artists on tag cards and a Dec 7 real countdown.",
    hero: `${BASE}/img/night-hero.jpg`, desktop: `${BASE}/img/night-desktop.jpg`, mobile: `${BASE}/img/night-mobile.jpg`, live: `${BASE}/r3-night/index.html`,
    grades: [
      { who: "Brand / AD", g: "C", why: "Moody and well typeset, but it breaks DESIGN.md: photoreal AI people at the hero, Bodoni instead of Fraunces, black instead of Plum Night, no warm host." },
      { who: "Web / UX", g: "C+", why: "Elegant layout; low-contrast small grey type on near-black, 11 declarations at 9 to 11px, and a hero with no product in it." },
      { who: "DTC operator", g: "C", why: "The Family Set CTA is there, but price and product are not seen until a long scroll, and the dark product shot hides the paper." },
      { who: "Performance", g: "D+", why: "Lightest page (3.2 MB, best asset discipline), but a dark, blurred, people-first hero is the opposite of the bright paper close-ups that win in a feed." },
    ],
    overall: "C",
    strengths: [
      "Best asset discipline: images exported as JPEG, 3.2 MB total versus 10 to 21 MB for the others, 8 images lazy-loaded.",
      "Typography and the live 11:47 PM clock are polished; the Dec 7 closer with a real countdown is the most dramatic deadline treatment.",
      "Cart drawer works (Family Set $64.99, free shipping unlocked, checkout) and the artists-as-tags section is a good device.",
    ],
    weaknesses: [
      "Hero and chapter I use AI-generated photoreal diners (blurred faces, still readable in profile). DESIGN.md: never AI-generated people, show real families drawn by named artists.",
      "The page is about the room, not the product. The paper first appears as small chips; the Family Set photo is dark enough that the pattern is lost.",
      "Reused or stand-in imagery (round-1 hands, product, macro) plus 1024x768 table and snow plates that are soft at full bleed; pattern names stand in for artists.",
      "11 declarations at 9 to 11px, and small grey body copy on near-black is hard to read on a phone.",
    ],
    weight: "3.2 MB, 14 requests (JPEG exports, 8 lazy)",
  },
];

export const panel = {
  hero: {
    a: "None of the four is launch-ready.",
    b: "Pop converts best, Editorial looks best, and the art is the gap in all of them.",
    intro: "Four reviewers wrote their grades independently from the same screenshots and live-page probes, then converged. The recommendation is a hybrid: Editorial's type and restraint on Pop's conversion spine, with Storybook's street kept for the story page. Image generation ran out of credit mid-round, so every design reuses one 8-image gpt-image set. That set is placeholder, not final art.",
  },
};

export const glance = [
  { k: "0", label: "404s or console errors across 4 designs x 2 viewports", src: "Playwright, system Chrome, Oct 3, 2026" },
  { k: "3.2 to 21.1 MB", label: "page weight, Night lightest, Pop heaviest", src: "response bodies, hj-audit.mjs" },
  { k: "2 of 4", label: "show the $64.99 Family Set price above the fold on mobile (Pop and Storybook; Editorial and Night do not)", src: "mobile hero shots, Oct 3" },
  { k: "0 of 4", label: "show returns, guarantee, reviews or payment-trust content", src: "text search and full-page review" },
];

export const weightTable = {
  columns: ["Design", "Page weight", "Requests", "Biggest asset", "Lazy images", "Cart + checkout"],
  rows: [
    ["Editorial Luxe", "18.7 MB", "13", "flatlay-cards.png 3.4 MB", "0 of 10", "Drawer works; Checkout is a button with no destination"],
    ["Bold Pop", "21.1 MB", "13", "flatlay-cards.png 3.4 MB", "0 of 30", "Drawer works; Checkout toast says 'not wired'"],
    ["Illustrated World", "10.1 MB", "10", "pattern-light-up.png 2.5 MB", "0 of 1", "Drawer works; Checkout is a button with no destination"],
    ["Cinematic Night", "3.2 MB", "14", "pattern-long-table.jpg 541 KB", "8 of 13", "Drawer works; Checkout is a button with no destination"],
  ],
};

export const ranking = [
  { n: 1, name: "Bold Pop", overall: "B+", why: "Highest conversion architecture and best ad match. Lowest taste ceiling; needs art direction pulled toward the brand." },
  { n: 2, name: "Editorial Luxe", overall: "B", why: "Best craft and most premium. Loses on the first screen: no offer in the hero, CTA is 'Read the contents'." },
  { n: 3, name: "Illustrated World", overall: "B-", why: "Best idea, weakest fit for cold traffic. Strongest candidate for the story/about page and organic." },
  { n: 4, name: "Cinematic Night", overall: "C", why: "Beautiful type on a hero that violates the no-AI-people rule and does not show the product." },
];

export const recommendation = {
  headline: "Build the hybrid: Editorial type on Pop's conversion spine.",
  body: [
    "Take Pop's page order, which is the only one a Meta or TikTok click can use in five seconds: hero with 'Shop the Family Set, $64.99, ships free', then the bundle contents, the three supporting prices, the deadline, and a feed section once real creator content exists.",
    "Replace Pop's candy palette and squeezed grotesque with Editorial's Fraunces display, Frost Cream ground and Plum Night ink, keeping pomegranate to one action per view and marigold as a fill only, as DESIGN.md says. Keep the gift tag device and Pop's sticker for the Dec 7 stamp. This also gives the brand a premium feel that Pop alone does not.",
    "Keep Storybook's street as the destination for 'Meet the families', for organic and TikTok profile traffic, and for the email hero. It is the strongest idea and the weakest cold-traffic page, so it earns a different job rather than the homepage.",
    "Retire Night as a landing page. Its type and the Dec 7 closer are worth borrowing for the last-week deadline push (Dec 1 to 7), in a Plum Night section.",
    "Honest status: this is a design direction, not a launch page. The imagery is an 8-image gpt-image placeholder set, there are no named artists, no photography of physical samples, no trust content and no live checkout. The page is ready for a Shopify build only once the fixes below tagged needs and money are in hand.",
  ],
};

export const findings: { sev: Sev; area: string; t: string; d: string }[] = [
  { sev: "fix", area: "All four", t: "Imagery is AI-generated placeholder, which DESIGN.md forbids for shipped art.", d: "Every design uses the shared gpt-image set (and Night adds AI diners). The plan says no generative AI in shipped art and 'every illustration credited to a named artist'. The pages say 'drawn by named artists' and 'painted by hand' today." },
  { sev: "fix", area: "All four", t: "Images are uncompressed PNG: 10.1 to 21.1 MB per page.", d: "Measured response bodies: flatlay-cards.png 3.4 MB, roll-cutout 2.8 MB, hands-wrapping 2.7 MB. Night's JPEG export got to 3.2 MB, so 3 to 4 MB is achievable. A paid mobile click on 4G will wait and bounce." },
  { sev: "fix", area: "Editorial", t: "The hero does not sell.", d: "Lead CTA is 'READ THE CONTENTS'; the offer appears as a small tag; the first add-to-bag is about 2,300px down. Mobile fold shows no price." },
  { sev: "fix", area: "Night", t: "Hero and chapter I use photoreal AI people.", d: "Blurred faces still read as people in profile. Rule: 'AI-generated people' never, and the art is the product." },
  { sev: "fix", area: "Night", t: "No product above the fold and small dim type.", d: "The first paper appears as a chip. 11 CSS declarations set 9 to 11px; grey body copy on near-black." },
  { sev: "fix", area: "Pop", t: "Starburst overlaps the offer line on mobile.", d: "At 390px the 'ARTISTS ANNOUNCED NOV 1' sticker covers the end of '1 roll + 5 cards + printable tags.'. Visible in the mobile hero shot." },
  { sev: "fix", area: "Storybook", t: "Mobile hero shows a cropped house and the buy path is behind a 600vh walk.", d: "On a 390px viewport only a peek of house 1 is visible; the lit window's Add roll is reachable only after a panel is lit." },
  { sev: "fix", area: "All four", t: "No trust or reassurance content.", d: "No returns, no quality guarantee, no print-on-demand shipping expectation (9 to 13 days per the plan), no reviews, no payment icons. These carry a first purchase from cold traffic." },
  { sev: "watch", area: "All four", t: "Checkout is a front-end stub and there is no tracking or share metadata.", d: "Drawer works and says 'Free shipping unlocked' at $64.99 in all four, but Checkout goes nowhere (Pop shows a 'not wired' toast). No og:image on any page. Shopify, Meta Pixel and TikTok pixel are the real work." },
  { sev: "watch", area: "Pop", t: "Repetition: 3 patterns become 6 cards and one gift is hue-rotated.", d: "Hue-shifting also shifts drawn skin tones. Needs real colourways." },
  { sev: "watch", area: "Pop", t: "No main landmark.", d: "No main element; focus outlines are present (3px). Stepped animations run only when reduced motion is off (0 running when reduced)." },
  { sev: "watch", area: "Storybook", t: "Two art systems on one page.", d: "Vector houses are flat shapes and dot faces; the paper patterns are textured raster. They sit acceptably together but do not read as one commissioned set." },
  { sev: "watch", area: "Editorial", t: "Four photographic looks.", d: "Dark red cover, candlelit hands, daylight flatlay, cream cutout. Palette ties them but they are not one shoot." },
  { sev: "good", area: "All four", t: "Zero broken assets after the copy.", d: "Zero 404s and zero console errors at 1440 and 390 for all four designs once ../../imagery paths were repointed to ../imagery." },
  { sev: "good", area: "All four", t: "Offer facts are consistent with the launch plan.", d: "Family Set $64.99 with free shipping, free shipping from $59, Dec 7 deadline, $21.99 roll, $34.99 card 10-pack, $59.99 3-roll bundle appear correctly on every page, with no fake scarcity." },
  { sev: "good", area: "All four", t: "Every page has a working bag with a free-shipping state.", d: "Probed: add Family Set opens a drawer with $64.99 and 'Free shipping unlocked' on all four." },
  { sev: "good", area: "Pop", t: "Best offer placement.", d: "Offer, price and CTA in the first screen on desktop and phone, then bundle, three prices, deadline." },
  { sev: "good", area: "Editorial", t: "Highest craft and cleanest accessibility basics.", d: "Single h1, main landmark, alt text on all 10 images, visible focus." },
];

export const fixes: { tag: Tag; t: string; d: string }[] = [
  { tag: "money", t: "Commission the 8 hero designs from named artists, or at least a real, consistent illustrated set.", d: "Recraft/OpenAI/Gemini credit is out; but credit is not the fix, since DESIGN.md forbids AI-only art. Plan estimates about $5.5 to 6K for the 8 hero designs (the plan's own figure). Until then every page is a placeholder." },
  { tag: "money", t: "Order the physical samples and photograph them in one setup.", d: "Plan already needs them for margin and speed checks. One light setup of real rolls, cards and the box replaces the four-look photo set and fixes the weakest part of every page." },
  { tag: "free", t: "Compress every image to JPEG or WebP at display size and lazy-load below the fold.", d: "Target 3 to 4 MB per page (Night proves it). No credit needed. Do it before any build." },
  { tag: "free", t: "Reorder to the hybrid: Pop's page order, Editorial's type and palette, Storybook's street on its own page.", d: "Design work, not money. Start with the hero: 'Shop the Family Set, $64.99, ships free' with the paper in view." },
  { tag: "free", t: "Fix the hero and mobile issues: Pop sticker overlap, Storybook mobile hero, Editorial CTA, Night type size.", d: "Each is a CSS or copy change visible in the shots above." },
  { tag: "free", t: "Write trust content: returns, print-on-demand timing, quality note.", d: "Needs the policies from Daniel, then a small block under the offer and in the cart." },
  { tag: "needs", t: "Real checkout and tracking on Shopify (Dawn).", d: "Wire the cart to Shopify Bundles, Meta Pixel and TikTok pixel, add og:image and a per-ad collection landing, as the launch plan already scopes." },
  { tag: "needs", t: "Name the first artists and swap the copy to match.", d: "Remove 'drawn by named artists' wording until names exist, or put real names on the tags." },
  { tag: "done", t: "Local review copy of all four designs with image paths verified.", d: "All four load from /p/holly-jolly-designs/ with 0 broken requests." },
];

export const notes = [
  "Method. Four reviewer roles wrote grades independently from the same evidence, then converged. They are lenses applied by one reviewer (Claude), not four people; the grades are a judgment, not user research or A/B data.",
  "Sources. Four design folders in ~/arthur/briefs/holly-jolly/landing/r3-* (index.html, hero, desktop and mobile PNGs, NOTES.md), the shared imagery set, DESIGN.md and 00-launch-plan.md (prepared Oct 2, 2026).",
  "What was looked at. Each hero.png, the full desktop.png in sliced sections, the full mobile.png in bands, plus live pages in Playwright (system Chrome) at 1440 and 390: request log, console, scroll through, add-to-bag, keyboard Tab order, reduced-motion animation counts, Storybook's pinned street at four scroll positions.",
  "Measured Oct 3, 2026 with scripts/hj-audit.mjs and scripts/hj-interact.mjs. Page weight is the sum of response bodies on a local server (no CDN compression; Google Fonts included), so real-world transfer will be somewhat smaller but order unchanged.",
  "What could not be seen. Safari and Firefox (Chromium only), real devices, real network speed or Core Web Vitals, actual ad traffic, screen-reader behaviour beyond markup checks, and any checkout (all four are front-end demos). Colour contrast was judged by eye plus font sizes, not measured with a tool.",
  "Path change. The design files originally referenced ../../imagery/; in this location the copy references ../imagery/. Originals in ~/arthur/briefs/holly-jolly are untouched.",
  "Countdowns read 66 days on Oct 3 because they count to Dec 7, 2026, 11:59 PM ET.",
];
