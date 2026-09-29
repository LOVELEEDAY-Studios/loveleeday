/* INTERNAL design exploration: five ordering-experience concepts for Dabney & Co.'s own site —
   pickup, delivery, large-gathering pre-order, and the Pantry. Local only, not deployed, nothing
   sent, no money spent. Built against the findings in dabney-ordering.ts (the Toast/storefront
   channel review, Sep 26, 2026) and real content read from ~/Projects/dabney: dabney-brand.css
   (tokens), menu-mockups/data/menu.json (real dish names/prices), catering-calculator/
   CateringCalculatorClient.tsx (the real offsite-bartending quote tool — the only large-gathering
   pricing logic that exists today), private-events/page.tsx ($250/$400 food-and-drink minimums),
   src/lib/ordering/{drive,menu}.ts (Toast read-only menu, DoorDash Drive), and
   src/app/api/invoice/pay/route.ts (the Stripe Checkout partial-payment pattern already live).
   Screenshots and mockup HTML: public/p/dabney-ordering-concepts/. */

export const conceptsClients = [{ token: "dabney-ordering-concepts-internal", short: "Dabney & Co.", preparedFor: "Daniel May", role: "Founder" }];
export const getConceptsClient = (token: string) => conceptsClients.find((c) => c.token === token);

const BASE = "/p/dabney-ordering-concepts";

export type BuildNote = { label: string; exists: boolean; note: string };
export type Concept = {
  n: number;
  id: string;
  name: string;
  tagline: string;
  forWhom: string;
  steps: string[];
  fixes: string; // which review finding this addresses
  effect: string; // expected effect, grounded in the review's numbers
  build: BuildNote[];
  effort: string;
  risks: string[];
  shots: { desktop: string; phone: string };
  mockup: string;
};

// Structural note that applies to concepts 1, 2 and 5: Toast's granted scopes here are
// "...config:read menus:read orders:read restaurants:read..." — READ ONLY (see
// src/lib/ordering/menu.ts). Nothing in the current codebase can push an order INTO Toast's
// kitchen-ticket system. So a same-day, ready-in-15-minutes cart has two honest paths: skin the
// existing order.toasttab.com checkout (fast, but still a Toast-hosted screen at the end), or get
// Toast's order-injection API turned on for this account (a real ask to Toast, not a build task).
// Concepts 3 and 4 don't have this problem — a pre-order with a pickup window days out can be
// fulfilled by staff reading a paid Stripe order, the same way private-event deposits work today.
const TOAST_READONLY =
  "Toast's granted API scopes today are read-only (menus:read, no order-write) — confirmed in src/lib/ordering/menu.ts. Nothing in the codebase can inject an order into Toast's kitchen-ticket system yet.";

export const concepts: Concept[] = [
  {
    n: 1,
    id: "counter",
    name: "The Counter",
    tagline: "One page. A toggle. A cart. The commission-free front door.",
    forWhom: "Someone who already knows the menu and wants to order pickup or delivery in under a minute — the DoorDash regular's first stop before they open the DoorDash app.",
    steps: [
      "Pick Pickup or Delivery",
      "Pick a ready-by time slot (today's real open hours)",
      "Browse the same DABNEY KITCHEN (3PO) menu already on every marketplace app, add items",
      "Review the cart in a sticky panel — no delivery commission called out",
      "Continue to checkout",
    ],
    fixes:
      "Grades: \"Toast online ordering\" (F) — \"set up and never used: 0 orders in 180 days.\" Findings: \"The commission-free channels have zero orders\" (fix), and the fixes-queue item \"Print bag cards… QR to order.toasttab.com.\"",
    effect:
      "Every order that moves from DoorDash (15–30% commission, 149 of 166 delivery orders) to this channel keeps the full $27.50 average instead of losing $4–8 of it. It doesn't create new demand by itself — it's the destination the QR code and the rest of the ordering-review fixes point to.",
    build: [
      { label: "Menu data", exists: true, note: "Already read live from Toast (DABNEY KITCHEN 3PO) via src/lib/ordering/menu.ts — same source as every marketplace app." },
      { label: "Cart UI", exists: false, note: "New. This page and its cart state don't exist yet." },
      { label: "Checkout / kitchen ticket", exists: false, note: TOAST_READONLY + " Realistic path: this page is a branded front door that hands the built cart to Toast's own hosted checkout (order.toasttab.com) rather than a parallel Stripe cart — building a second cart-to-kitchen pipe would duplicate Toast's ticket routing and inventory sync for no reason." },
    ],
    effort: "Medium. The page and cart are a real build; the checkout handoff is the open question — cheap if Toast supports a pre-filled deep link, a heavier lift if it needs Toast's order-injection API turned on for this account.",
    risks: [
      "If the handoff still lands on an unbranded Toast screen, most of the trust benefit of \"skip the app fees\" is lost at the last step.",
      "Toast online ordering already exists and gets zero orders today — a prettier front door doesn't fix that on its own without the QR/bag-card push from the original review.",
    ],
    shots: { desktop: `${BASE}/shots/concept-1-counter-1440.png`, phone: `${BASE}/shots/concept-1-counter-390.png` },
    mockup: `${BASE}/mockups/concept-1-counter.html`,
  },
  {
    n: 2,
    id: "bundles",
    name: "Who's Eating, and When",
    tagline: "A 3-question wizard that assembles the bundle instead of a menu grid.",
    forWhom: "A table of two or three deciding what to order — replaces \"scroll a menu, pick one sandwich\" with \"tell us who's eating, we'll build it.\"",
    steps: [
      "Set headcount (stepper)",
      "Pick an occasion (Dinner for two / Family meal / Watching the game / Just me)",
      "Pick a ready-by time",
      "See the recommended bundle, priced from real per-item prices, with the à-la-carte total shown alongside it",
      "Add it, or swap to one of two alternate bundles",
    ],
    fixes:
      "Grades: \"Menu for delivery\" (B) — \"the menu is built for one person… no bundles, no family meal.\" Finding (fix): \"There are no bundles, so the average order is $27.50\" — names the exact three bundles this concept builds: Supper for Two, Flatbread Night, Dip Board.",
    effect:
      "The review's own estimate: raising the average from $27.50 toward $38 is +38% revenue on the same order count — worth roughly $500–700/month at today's ~68 orders. This concept is the wizard that gets a guest to actually choose the bundle instead of a static menu tile easy to scroll past.",
    build: [
      { label: "Bundle contents & pricing", exists: false, note: "New, but built entirely from real per-item Toast prices (Steakhouse Sandwich $13, Collard Green Dip $10, Peach Cobbler Cornbread $8, etc.) divided out transparently — not a new SKU in Toast yet." },
      { label: "Wizard UI", exists: false, note: "New." },
      { label: "Checkout / kitchen ticket", exists: false, note: TOAST_READONLY + " Same handoff question as Concept 1 — a bundle is still 3–4 individual Toast menu items at checkout, not a single new item, unless someone creates real bundle SKUs in Toast first." },
    ],
    effort: "Medium — mostly UI and the bundle math; no new backend if bundles stay a client-side grouping of existing items.",
    risks: [
      "If bundle SKUs are never created in Toast, the kitchen ticket shows 4 separate line items instead of \"Supper for Two,\" which is fine operationally but weakens the \"this is a real thing\" feeling.",
      "Bundle math is a planning estimate (like the review's own $10k ladder) — the $42/$34/$20 prices should be confirmed against current menu prices before they're ever shown to a guest.",
    ],
    shots: { desktop: `${BASE}/shots/concept-2-bundles-1440.png`, phone: `${BASE}/shots/concept-2-bundles-390.png` },
    mockup: `${BASE}/mockups/concept-2-bundles.html`,
  },
  {
    n: 3,
    id: "gathering",
    name: "The Large-Gathering Builder",
    tagline: "A headcount slider becomes package tiers with a live per-guest price and a deposit.",
    forWhom: "An office ordering lunch, a family after a service, a watch party — 15 to 50 people, pickup instead of delivery, days in advance instead of tonight.",
    steps: [
      "Set headcount with a slider",
      "Pick a pickup date and time (at least N hours ahead so the kitchen can prep)",
      "Compare three tiers — Essentials / Signature / Full Spread — each showing a live total and per-guest price",
      "See exactly how the price is built, line by line, from real menu items",
      "Pay a deposit to hold the date; balance due at pickup",
    ],
    fixes:
      "Watch finding: \"No catering channel is live… Dabney already has a catering calculator on the site.\" Fixes-queue item: \"List on DoorDash catering and ezCater… priced from the site's catering calculator.\" Ladder stage \"Catering and own channel\" (months 4–6, part of the $10k+ target).",
    effect:
      "The review's own ladder puts catering at $1,000–2,000/month from 4–6 orders. This concept is the owned-channel version of that stage (alongside, not instead of, DoorDash catering/ezCater listings) — no commission, and the deposit removes no-show risk on a large order.",
    build: [
      { label: "Package tiers & pricing", exists: false, note: "IMPORTANT GAP: the site's actual \"catering calculator\" (src/app/catering-calculator) prices offsite BARTENDING — bartender-hours, alcohol, a $95/hr rate, $800 minimum — not food trays. There is no existing food-catering menu or SKU to reuse. The three tiers shown here are new math built from real à-la-carte kitchen prices (sandwiches $13, flatbreads $11, dip boards ~$10, cornbread $8) divided across the headcount, not a copy of the bartending calculator's numbers." },
      { label: "Pickup lead-time rule", exists: false, note: "The 48-hour minimum shown is a placeholder default, not a number read from anywhere — confirm the kitchen's real lead time before this ships." },
      { label: "Deposit checkout", exists: true, note: "Real precedent: src/app/api/invoice/pay/route.ts already runs a Stripe Checkout session for a full-or-partial payment, and private events already take a deposit against a $250/$400 food-and-drink minimum (src/app/private-events/page.tsx). This concept's deposit button is the same pattern, not new infrastructure." },
    ],
    effort: "Medium-low for the deposit/checkout half (real Stripe pattern to copy); medium for the tier math and admin-side fulfillment (someone has to see the paid order and prep it — no Toast ticket is created automatically).",
    risks: [
      "No live food-catering SKU exists — the per-guest prices here need a real sign-off pass before they're quoted to a customer.",
      "A paid pre-order doesn't create a Toast kitchen ticket (Toast is read-only), so fulfillment depends on a human checking a dashboard — fine at a handful of orders a month, not at volume.",
    ],
    shots: { desktop: `${BASE}/shots/concept-3-gathering-1440.png`, phone: `${BASE}/shots/concept-3-gathering-390.png` },
    mockup: `${BASE}/mockups/concept-3-gathering.html`,
  },
  {
    n: 4,
    id: "pantry",
    name: "The Pantry Shelf",
    tagline: "Packaged retail, a $30 trio, a recurring pickup, and a gift option.",
    forWhom: "Someone who wants Dabney at home without a reservation — a gift, a weekly habit, a cabinet stocked with the kitchen's best-travelling dishes.",
    steps: [
      "Browse three packaged items (typographic cards, matching the real /shop page's pattern for items without dedicated photography yet)",
      "See the trio price called out against the à-la-carte total",
      "Optionally turn on \"Pantry Drop\" — the same order, repeating on a chosen weekday, Tue–Sat",
      "Optionally mark it as a gift, with a note",
      "Add to cart",
    ],
    fixes:
      "Grade: \"The Pantry\" (C) — \"a clear offer… 0 orders so far. It's retail, not dinner delivery, so it can't carry the $10k goal alone.\"",
    effect:
      "Doesn't move the $10k delivery goal by itself (the review says so directly) — it's a second, small, commission-free revenue line with near-zero marginal kitchen labor, and \"Pantry Drop\" is the one piece of this whole review that creates a recurring order instead of a one-off.",
    build: [
      { label: "Live Pantry SKUs/photos", exists: false, note: "GAP: dabneyandco.com/pantry is referenced in the ordering review as a live page with 3 SKUs at $12 each / $30 for the trio, but no /pantry route exists in this local checkout of ~/Projects/dabney, and no dedicated packaged-retail photography was found in public/. The three items and photos shown here are placeholders — real menu dishes at the review's real prices, not the live page's actual copy." },
      { label: "Recurring \"Pantry Drop\"", exists: false, note: "New. Would need a subscription/recurring-order object — Stripe supports recurring Checkout, but nothing in this codebase wires a recurring food pre-order today." },
      { label: "Checkout", exists: true, note: "Same Stripe Checkout pattern as invoice/membership payments — this is closer to the gift-card flow (src/app/api/giftcard/checkout) than to a same-day Toast order, since it's pure retail with no real-time kitchen ticket." },
    ],
    effort: "Low for a one-time trio purchase (closest to the existing gift-card Stripe flow); medium for true recurring \"Pantry Drop\" billing and fulfillment reminders.",
    risks: [
      "The live Pantry page's real photography and exact SKU copy weren't available to read in this session — don't ship the placeholder dish names without checking the real page first.",
      "Recurring orders need someone to actually prep and hold three items every week without a reservation system prompting it — an operational commitment, not just a checkout feature.",
    ],
    shots: { desktop: `${BASE}/shots/concept-4-pantry-1440.png`, phone: `${BASE}/shots/concept-4-pantry-390.png` },
    mockup: `${BASE}/mockups/concept-4-pantry.html`,
  },
  {
    n: 5,
    id: "regulars",
    name: "Regulars & Reorder",
    tagline: "Phone-first. One tap reorders the last cart. A text says when it's ready.",
    forWhom: "The person who already orders every week — on DoorDash today, because that's where their last order is saved. This is the habit-loop version of the commission-free channel.",
    steps: [
      "Get a text: \"Order the usual? Ready by 6.\"",
      "Open the page — last order is already shown, no menu to re-browse",
      "One tap to reorder (or tap to change it)",
      "Pay, get a ready-in-15 text",
      "Show a QR code at the bar to pick up — no line, no app, no delivery fee",
    ],
    fixes:
      "Findings (fix): \"The commission-free channels have zero orders\" and \"10+ DoorDash reviews isn't enough to rank\" (the stamp-row/reward step is a natural place to ask for a rating, the same idea as the review's proposed bag card). Fixes-queue item: \"Print bag cards: rate us, and order pickup to skip app fees.\"",
    effect:
      "149 of 166 delivery orders already go through DoorDash — those are proven repeat customers, just ordering through the expensive channel. Built using Nir Eyal's Hook Model (trigger → action → variable reward → investment; hooked-ux skill): the SMS is the external trigger, one-tap reorder is the action, an occasional kitchen surprise is the variable reward, and the stamp row is the investment that makes the next trigger land better. This is the retention mechanism the other four concepts don't have.",
    build: [
      { label: "Saved last-order profile", exists: false, note: "New — needs an account/phone-number identity, which doesn't exist for food ordering today (Toast read-only; no customer accounts in this codebase for takeout)." },
      { label: "SMS ready-alerts", exists: false, note: "New. Twilio or similar — not found configured anywhere in ~/Projects/dabney for this purpose." },
      { label: "One-tap reorder & checkout", exists: false, note: TOAST_READONLY + " Same handoff question as Concepts 1 and 2." },
      { label: "Pickup QR", exists: false, note: "New, but simple — a static code plus an order-lookup screen at the host stand." },
    ],
    effort: "High — this is the only concept that needs a real customer-identity system (phone number, saved cart, order history) rather than a stateless cart.",
    risks: [
      "Depends on the same Toast read-only limitation as Concepts 1 and 2 for the actual checkout step.",
      "A weekly SMS habit-loop is the one piece here closest to marketing automation — needs opt-in consent handling, not just a nice UI.",
    ],
    shots: { desktop: `${BASE}/shots/concept-5-regulars-1440.png`, phone: `${BASE}/shots/concept-5-regulars-390.png` },
    mockup: `${BASE}/mockups/concept-5-regulars.html`,
  },
];

export const designNotes = [
  "Brand tokens copied verbatim from dabney-brand.css and globals.css: paper #F1E4C9, cream #FDFAF5, burg #5C0E2E, gold #B79A5B, ink #0F0805, teal #0B504F; Arimo / Tinos / Cousine.",
  "Real dish names and prices read from ~/Projects/dabney/menu-mockups/data/menu.json (the DABNEY KITCHEN section). Real photography from public/images and public/menu-book/covers/assets — the in-room shots (steakhouse sandwich, flatbread, southern-kitchen-hero, private-events-hero), not the white-background product renders in mockups/food-assets, which read as AI/heavily-styled and were left out of these five concepts.",
  "Design references consulted and named per concept: refactoring-ui (hierarchy, spacing, one accent color) for the counter and bundle wizard layouts; hooked-ux (Nir Eyal's Hook Model) explicitly for Concept 5's trigger/action/reward/investment structure; component-patterns-mastery.md for the stepper and cart-panel patterns. No knowledge-design file was found specific to restaurant ordering — general commerce/UX patterns were used instead, noted here rather than cited to a file that doesn't exist.",
  "All five are static HTML, screenshotted headless (Playwright, channel 'chrome', no visible window) at 1440×900 desktop and 390×844 phone. Run through node ~/arthur/scripts/visual-critic.mjs against every screenshot; the tool flagged \"cut off\" on full-bleed banner/footer text near the image edge on several renders — verified false by pixel-level crops (the text has full padding inside its own band; the critic appears to conflate \"near the screenshot edge\" with \"clipped by its container\" on this full-bleed layout style). Genuine issues it caught were fixed: a duplicate/mismatched stock photo on two different Pantry items (replaced with typographic cards matching the real /shop page's own convention for un-photographed items), a background-color bleed below the page footer on two mockups, and cart line-items wrapping badly on the 390px view.",
];
