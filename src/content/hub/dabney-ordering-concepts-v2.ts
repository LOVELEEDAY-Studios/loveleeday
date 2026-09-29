/* INTERNAL design exploration, ROUND 2: five NEW visual/interaction directions for Dabney & Co.'s
   own ordering experience — pickup, delivery, large-gathering pre-orders, and the Pantry. Local
   only, not deployed, nothing sent, no money spent. Daniel's round-1 feedback: the re-skin of
   Dabney's own site "may not be the best" — so round 2 does not touch round-1's files (another
   session may still be finishing small fixes there) and instead builds five directions each
   explicitly derived from named references: real screens pulled live via the Mobbin MCP
   (Sweetgreen, Uber Eats, DoorDash, Instacart, HelloFresh, Blue Apron, Churnkey, Expedia, Blue
   Bottle, CHOPT, Taco Bell, Zomato, Julienne, Squarespace, Selfridges) plus premium Dribbble shots
   found via WebSearch (Dribbble itself blocks scraping without login — see designNotes). Real menu
   items/prices from ~/Projects/dabney/menu-mockups/data/menu.json (DABNEY KITCHEN, pulled Sep 26,
   2026) and the live dabneyandco.com/pantry (read Sep 29, 2026). Brand tokens from dabney-brand.css
   and CLAUDE.md: paper #F1E4C9, cream #FDFAF5, burg #5C0E2E, gold #B79A5B, ink #0F0805, teal
   #0B504F. Screenshots and mockup HTML: public/p/dabney-ordering-concepts-v2/. */

export const conceptsClients = [{ token: "dabney-ordering-concepts-v2-internal", short: "Dabney & Co.", preparedFor: "Daniel May", role: "Founder" }];
export const getConceptsClient = (token: string) => conceptsClients.find((c) => c.token === token);

const BASE = "/p/dabney-ordering-concepts-v2";
const R1 = "/p/dabney-ordering-concepts/dabney-ordering-concepts-internal";
const REVIEW = "/p/dabney-ordering/dabney-ordering-internal";

export type RefShot = { app: string; pattern: string; why: string; url: string; thumb?: string };

export const referenceBoard: RefShot[] = [
  { app: "Sweetgreen (web)", pattern: "Order builder with a dressing on-the-side / mixed-in toggle and per-portion add-ons", why: "The model for Direction 1's builder — a real-time cart that feels like a kitchen decision, not a form.", url: "https://mobbin.com/screens/f485df7a-cb49-4c31-9ecd-11fd800ba5b0", thumb: `${BASE}/img/refs/sweetgreen-builder.webp` },
  { app: "Uber Eats (web)", pattern: "“Build Your Own Munchie Meal” customization modal — required-choice groups, one “customize this item” drill-in", why: "Shows how to let a delivery-style customization modal stay legible instead of a wall of checkboxes.", url: "https://mobbin.com/screens/4b02e8af-3147-435d-b638-d21a1cc1878b", thumb: `${BASE}/img/refs/ubereats-customize.webp` },
  { app: "Uber Eats (web)", pattern: "Schedule-delivery time-slot picker, 15-minute windows with a sold-out state", why: "Direction 1's “ready by” slot row and Direction 2's date chips both copy this sold-out/available pattern.", url: "https://mobbin.com/screens/fd10406c-2342-49ce-9cb9-2111835a4130", thumb: `${BASE}/img/refs/ubereats-schedule.webp` },
  { app: "DoorDash (web)", pattern: "Delivery vs. Pickup toggle plus a schedule-ahead time control on the checkout step", why: "The Pickup/Delivery segmented control at the top of Direction 1 is this control, reshaped.", url: "https://mobbin.com/screens/33b9c188-97a8-4c47-9409-4cef0ef22f32", thumb: `${BASE}/img/refs/doordash-schedule.webp` },
  { app: "Instacart (web)", pattern: "“Make it a gift” panel — recipient name/phone, a digital card, a personal message", why: "The gift block in Direction 3 (recipient + note) is built on this exact field order.", url: "https://mobbin.com/screens/eb4fa469-1eb5-4bf9-8f22-b4cac6d062b6", thumb: `${BASE}/img/refs/instacart-gift.webp` },
  { app: "DoorDash (web)", pattern: "Gift-note + recipient-details modal with a digital-card carousel", why: "Confirmed the recipient-details field order and the optional-note pattern used in Direction 3.", url: "https://mobbin.com/screens/c9f966a0-404a-48ca-b46c-7bdebe8fac35", thumb: `${BASE}/img/refs/doordash-gift-note.webp` },
  { app: "HelloFresh (web)", pattern: "Gift-card purchase page — amount tiers, recipient email, personal message, send date", why: "The “schedule the send” idea in Direction 3 comes from this page's send-date field.", url: "https://mobbin.com/screens/aa79d4ce-a9cb-4107-b149-6ef3d6ae44b6", thumb: `${BASE}/img/refs/hellofresh-giftcard.webp` },
  { app: "Selfridges (web)", pattern: "Gift-packaging upsell at checkout — a yes/no toggle, a real packaging photo, a small fee", why: "The luxe unboxing framing for Direction 3's dark, gold-foil product cards.", url: "https://mobbin.com/screens/0d4fd8ee-7f81-4ab1-8220-c796ea2ec60f", thumb: `${BASE}/img/refs/selfridges-giftpackaging.webp` },
  { app: "sweetgreen (web)", pattern: "Gift-card checkout with a “Send now / Schedule” toggle and a calendar", why: "Direction 3's schedule-send date chips are this control, restyled in gold on black.", url: "https://mobbin.com/screens/63690527-5b4d-4806-8d3a-c7f497606746", thumb: `${BASE}/img/refs/sweetgreen-gift-send.webp` },
  { app: "DoorDash (web)", pattern: "Catering storefront browse grid, filterable by cuisine and fee", why: "Confirms catering is treated as its own storefront, not a menu footnote — the premise behind Direction 2.", url: "https://mobbin.com/screens/d2241545-984f-4e65-9a15-851e33f6ccec", thumb: `${BASE}/img/refs/doordash-catering.webp` },
  { app: "Blue Apron (web)", pattern: "Per-serving customizer — choose 2 or 4 servings, add a protein, live price update", why: "Direction 2's headcount slider recalculating three tier prices live is this pattern generalized past 2/4 servings.", url: "https://mobbin.com/screens/0e2908d6-e8c0-45de-803b-8bfad31fccef", thumb: `${BASE}/img/refs/blueapron-customize.webp` },
  { app: "Churnkey (web, marketing)", pattern: "A usage slider that recalculates a price tier live as you drag", why: "Not a food product — but the exact interaction Direction 2's guest-count slider needed: drag, watch three prices move together.", url: "https://mobbin.com/screens/fb3f5f54-8d6d-4fdc-99ad-69bde8a7a683", thumb: `${BASE}/img/refs/churnkey-slider.webp` },
  { app: "Expedia (web)", pattern: "Group-quote intake form — headcount, ideal nightly budget as a range slider, then a quote", why: "The “slider in, itemized quote out” shape behind Direction 2's line-by-line breakdown.", url: "https://mobbin.com/screens/733702e2-e61d-4ed5-aff8-c2b72e336377", thumb: `${BASE}/img/refs/expedia-groupquote.webp` },
  { app: "Blue Bottle Coffee (iOS)", pattern: "“Reorder last order” card sitting over a location photo, one add button", why: "Direction 4's whole premise — the app already knows the order, so lead with the reorder, not the menu.", url: "https://mobbin.com/screens/10d79a48-e013-497a-909c-62620d5d96b0", thumb: `${BASE}/img/refs/bluebottle-reorder.webp` },
  { app: "CHOPT (iOS)", pattern: "Order-history row with a single “REORDER” pill button, no cart step shown", why: "The one-tap distance Direction 4 is built around — reorder from history, not from a rebuilt cart.", url: "https://mobbin.com/screens/8c502b12-412a-47b3-b8c7-d45a22d978bc", thumb: `${BASE}/img/refs/chopt-reorder.webp` },
  { app: "Taco Bell (iOS)", pattern: "Past-order detail with itemized lines, subtotal, fees, and an “ORDER AGAIN” bar", why: "The itemized card-then-button layout inside Direction 4's phone mockup.", url: "https://mobbin.com/screens/aea35a15-6e93-41a8-bebe-7eb99baaf2a5", thumb: `${BASE}/img/refs/tacobell-reorder.webp` },
  { app: "Zomato (iOS)", pattern: "Order card showing your own star rating next to a “REORDER” button", why: "Confirmed pairing a reorder action with a rating/loyalty signal — Direction 4's stamp row.", url: "https://mobbin.com/screens/07a4cc57-3f42-459e-b695-5e902fbfdb95", thumb: `${BASE}/img/refs/zomato-reorder.webp` },
  { app: "Julienne (web)", pattern: "Recipe-article layout — full-bleed photo, serif display headline, byline, body copy", why: "Direction 5's masthead, dropcap opener and photo-above-headline rhythm come straight from this template.", url: "https://mobbin.com/screens/55efafcc-c31a-40fc-941b-20db82a4ea56", thumb: `${BASE}/img/refs/julienne-editorial.webp` },
  { app: "Squarespace (web, template demo)", pattern: "Bold editorial hero — huge serif/sans mixed headline over a full-bleed photo, no nav clutter", why: "The scale and confidence of Direction 5's “The table we set” headline treatment.", url: "https://mobbin.com/screens/91cbdb72-4079-488f-a173-c040f2f216e2", thumb: `${BASE}/img/refs/squarespace-editorial.webp` },
  { app: "HelloFresh (web)", pattern: "“This Week's Menu” card grid with nutrition tags and an inline add button per card", why: "The inline “order this” chip embedded in Direction 5's article body, instead of a separate menu page.", url: "https://mobbin.com/screens/7d1f4046-bd85-40c3-ba90-f7e07aef1f2a", thumb: `${BASE}/img/refs/hellofresh-menugrid.webp` },
];

export type DribbbleRef = { title: string; designer: string; url: string; pattern: string };
export const dribbbleBoard: DribbbleRef[] = [
  { title: "C-Mac's Southern Kitchen", designer: "Nader Boraie for NBDco.", url: "https://dribbble.com/shots/23251944-C-Mac-s-Southern-Kitchen", pattern: "A full brand system for a Southern fast-casual concept — script logotype, warm palette, environmental design. The closest real Dribbble comp to “Southern + premium + branded,” confirming that direction is a real, occupied design space, not an invented one." },
  { title: "CateredPlate — Premium Catering Framer Template", designer: "Ui Mile", url: "https://dribbble.com/shots/25275487-CateredPlate-Premium-Catering-Framer-Template", pattern: "Premium catering-site template — informed Direction 2's tier-card layout and its restrained use of a single accent color against a warm neutral field." },
  { title: "Foodie — Sushi Restaurant App UI Kit", designer: "Techeshta", url: "https://dribbble.com/shots/15940845-Foodie-Sushi-Restaurant-App-UI-Kits-for-Online-Food-Ordering", pattern: "Full ordering-app UI kit — grid density and card proportions cross-checked against Direction 1's item grid." },
  { title: "Food Ordering App UI", designer: "Vinuprasad", url: "https://dribbble.com/shots/15266541-Food-Ordering-App-UI", pattern: "Clean single-accent-color ordering UI — cross-check for Direction 1's teal-on-cream restraint." },
  { title: "Food & Restaurant Ordering App UI Kit (Admin & User)", designer: "App Innovation", url: "https://dribbble.com/shots/4033782-Food-Restaurant-Ordering-App-UI-Kit-Admin-User", pattern: "Two-sided ordering kit; the customer-side cart panel is close to Direction 1's sticky cart." },
  { title: "Multi Restaurant Food Ordering App UI Kit", designer: "OpusLab Works", url: "https://dribbble.com/shots/18847048-Multi-Restaurant-Food-Ordering-App-UI-Kit-Online-Food-App-UI-Kit", pattern: "Marketplace-style browse grid — a counter-reference for why Direction 1 deliberately does NOT look like a marketplace app." },
  { title: "Japanese restaurant app", designer: "Purrweb UI/UX Agency", url: "https://dribbble.com/shots/20957120-Japanese-restaurant-app", pattern: "Browse, order and reserve in one app — the combined-intent pattern behind pairing ordering with the venue's other pillars (cocktails, live music) in Direction 5." },
  { title: "Foodbit — AI Restaurant food ordering app", designer: "Shahid Miah", url: "https://dribbble.com/shots/24441488-Foodbit-AI-Restaurant-food-ordering-app", pattern: "Personalized-suggestion framing — the same instinct behind Direction 4's “order the usual” trigger, without the AI framing Dabney doesn't need." },
  { title: "Restaurant Food Order & Delivery App Design — UX/UI Case Study", designer: "Istie Iftear", url: "https://dribbble.com/shots/25643061-Restaurant-Food-Order-Delivery-App-Design-UX-UI-Case-Study", pattern: "Full case-study flow from browse to delivered — cross-checked the end-to-end shape of Direction 1." },
  { title: "App UI Design for “OrderUP”", designer: "Fazlay Rabbii", url: "https://dribbble.com/shots/22006216-App-UI-Design-for-OrderUP-Food-ordering-app", pattern: "Warm, rounded-card ordering UI — a softness reference weighed against and ultimately not used (Dabney reads more premium with sharper corners and serif type)." },
  { title: "Food Delivery App (Dark)", designer: "Pixsellz", url: "https://dribbble.com/shots/15488066-Food-Delivery-App-Dark", pattern: "Dark-mode food app — the closest Dribbble comp to Direction 3's near-black gifting canvas." },
  { title: "Food Delivery App Dark Mode", designer: "Ajendra Sutariya", url: "https://dribbble.com/shots/15345966-Food-Delivery-App-Dark-Mode", pattern: "A second dark-mode food UI, cross-checked for how far gold-on-black type can go before losing legibility (informed Direction 3's contrast choices)." },
  { title: "Landing Page for — Restaurant Website", designer: "Raydoan anik", url: "https://dribbble.com/shots/23096458-Landing-Page-for-Restaurant-Website", pattern: "Restaurant marketing landing page — a generic-restaurant-template baseline Direction 5 was deliberately built to read as MORE editorial than." },
];

export type BuildNote = { label: string; exists: boolean; note: string };
export type Direction = {
  n: number;
  id: string;
  name: string;
  tagline: string;
  refs: string[]; // keys into referenceBoard.app, for the per-direction "built from" strip
  covers: string; // which of pickup / delivery / large-gathering pre-order / Pantry
  problem: string;
  insight: string;
  bet: string;
  forWhom: string;
  fixes: string;
  palette: string;
  type: string;
  layout: string;
  build: BuildNote[];
  buildPath: string;
  shots: { desktop: string; phone: string };
  mockup: string;
};

const TOAST_READONLY =
  "Toast's granted API scopes are read-only (menus:read, no order-write) — confirmed in src/lib/ordering/menu.ts. The site's existing Stripe checkout (src/app/api/invoice/pay/route.ts) can take a payment; nothing in the codebase can inject an order into Toast's kitchen-ticket system. Toast order-write access is pending with Toast.";

export const directions: Direction[] = [
  {
    n: 1,
    id: "builder",
    name: "The Builder",
    tagline: "Sweetgreen-grade order builder + Tock-style timed pickup.",
    refs: ["Sweetgreen (web)", "Uber Eats (web)", "DoorDash (web)"],
    covers: "Pickup + Delivery",
    problem: "Toast online ordering is live and has taken 0 orders in 180 days — the commission-free channel exists and nobody uses it because it isn't a real front door.",
    insight: "The DoorDash regular already trusts a builder-style cart (Sweetgreen, Uber Eats). Give Dabney the same builder, minus the 15–30% toll, with a real time slot instead of a vague ETA.",
    bet: "A branded, real-time builder with Tock-style ready-by slots will move DoorDash regulars to the commission-free channel — at today's $27.50 average, every order moved keeps $4–$8 that would have gone to a marketplace.",
    forWhom: "Someone who already knows the menu and wants pickup or delivery in under a minute — the DoorDash regular's first stop before they open the DoorDash app.",
    fixes: "Grades: “Toast online ordering” (F) — set up and never used. Findings (fix): “The commission-free channels have zero orders.”",
    palette: "Cream #FDFAF5 field, ink #0F0805 text, a single teal #0B504F accent for active states, gold #B79A5B reserved for price emphasis only — the lightest, most appetite-forward palette of the five.",
    type: "Inter (grotesk) for UI chrome and numerals — the one direction that steps outside Dabney's Arimo/Tinos/Cousine system on purpose, to read as a modern order tool rather than the marketing site. Tinos italic kept for dish descriptions as the one thread back to the brand.",
    layout: "Sticky two-column app shell: scrollable menu grid left, sticky order summary right (collapses to a stacked cart on phone) — the Sweetgreen/DoorDash checkout shape, not a marketing page.",
    build: [
      { label: "Menu data", exists: true, note: "Live from Toast (DABNEY KITCHEN 3PO) via src/lib/ordering/menu.ts — same source as every marketplace app." },
      { label: "Delivery-safe menu gating", exists: false, note: "New, small: Fried Green Tomatoes and the Fried Green Tomato BLT are hidden/disabled under Delivery mode, matching the real DoorDash menu rule (they get soggy in transit) — shown live on this page as a toggle side-effect." },
      { label: "Cart UI", exists: false, note: "New. This page and its cart state don't exist yet." },
      { label: "Checkout", exists: false, note: TOAST_READONLY + " Realistic path: hand the built cart to Toast's own hosted checkout (order.toasttab.com) as a pre-filled deep link, rather than building a parallel cart-to-kitchen pipe." },
    ],
    buildPath: "Site's Stripe checkout for a NEW parallel cart is the wrong tool here — Toast already owns the kitchen ticket. Cheapest real path: a pre-filled deep link into Toast's hosted checkout. Full path: Toast order-injection turned on for this account (pending with Toast).",
    shots: { desktop: `${BASE}/shots/direction-1-builder-1440.png`, phone: `${BASE}/shots/direction-1-builder-390.png` },
    mockup: `${BASE}/mockups/direction-1-builder.html`,
  },
  {
    n: 2,
    id: "gathering",
    name: "The Gathering",
    tagline: "A headcount slider that becomes a live-priced catering quote.",
    refs: ["Blue Apron (web)", "Churnkey (web, marketing)", "Expedia (web)"],
    covers: "Large-gathering pre-orders",
    problem: "No catering channel is live, and the only pricing calculator on the site (src/app/catering-calculator) prices offsite bartending — there is no food-catering SKU or page at all.",
    insight: "Blue Apron and Churnkey both prove a slider-driven live price feels instant and trustworthy for something that used to require a phone call and a quote email.",
    bet: "A headcount slider with three live-priced tiers converts more “office lunch” and “after-service gathering” intent than a static catering PDF or a call-to-inquire button ever will.",
    forWhom: "An office ordering lunch, a family after a service, a watch party — 15 to 50 people, pickup instead of delivery, days in advance instead of tonight.",
    fixes: "Watch finding: “No catering channel is live… Dabney already has a catering calculator on the site” (it prices bartending, not food — confirmed by opening the file). Ladder stage “Catering and own channel,” months 4–6, part of the $10k+ target.",
    palette: "Paper #F1E4C9 field, burgundy #5C0E2E as the dominant accent (tier borders, price numerals), gold #B79A5B for the “Most booked” flag — the warmest, most hospitality-forward palette of the five.",
    type: "Fraunces, a warm high-contrast display serif, sized large for tier names and the per-guest price — paired with Arimo for the slider labels and line-item breakdown, so the number-heavy parts stay legible.",
    layout: "Hero slider + date chips, then three side-by-side tier cards (Blue Apron's option-card shape), then an itemized line-by-line breakdown that updates with the slider — quote-building made visible, not hidden behind a submit button.",
    build: [
      { label: "Per-item prices", exists: true, note: "Real Toast prices (Sunday Dinner Sandwich $13, Jalapeño Cornbread w/ Bacon $9, Harvest Soul Salad $12, etc.)." },
      { label: "Tier math & pricing", exists: false, note: "IMPORTANT: the three tiers and their $18/$26/$36 per-guest prices are new math built here from real à-la-carte prices — not an existing catering SKU. Needs a real sign-off pass before ever being quoted to a guest." },
      { label: "48-hour lead time", exists: false, note: "Shown as a placeholder default on the mockup, not a number confirmed with the kitchen." },
      { label: "Deposit checkout", exists: true, note: "Real precedent: src/app/api/invoice/pay/route.ts already runs a Stripe Checkout session for partial payment, and private events already take a deposit against the $250/$400 minimums — this is the same pattern, not new infrastructure." },
    ],
    buildPath: "Deposit half: copy the existing Stripe partial-payment pattern directly. Tier math half: needs a real pricing sign-off, then the slider/breakdown UI is new front-end work with no backend dependency — a paid pre-order still needs a human to see it and prep it, since Toast can't be sent a ticket automatically.",
    shots: { desktop: `${BASE}/shots/direction-2-gathering-1440.png`, phone: `${BASE}/shots/direction-2-gathering-390.png` },
    mockup: `${BASE}/mockups/direction-2-gathering.html`,
  },
  {
    n: 3,
    id: "pantry-gift",
    name: "The Pantry, Gifted",
    tagline: "Goldbelly-style gifting for three real products that sell zero units a month.",
    refs: ["Instacart (web)", "DoorDash (web)", "Selfridges (web)", "sweetgreen (web)"],
    covers: "The Pantry",
    problem: "The Pantry has a real shelf, real photography and a clear $30 trio offer — and 0 orders. It's dressed like a product page, not like something you'd send someone.",
    insight: "Goldbelly's entire business is proof that shelf-stable Southern food photographs and gifts well nationally. Instacart, DoorDash and sweetgreen all show the exact gifting mechanics (recipient, note, scheduled send) that turn a self-serve product page into a gift.",
    bet: "Reframing the same three products as a gift — recipient name, a note, a scheduled send — will move the Pantry off zero faster than better lighting on the same self-serve shelf ever would.",
    forWhom: "Someone who wants Dabney at home without a reservation — a gift, a weekly habit, a cabinet stocked with the kitchen's best-traveling dishes.",
    fixes: "Grade: “The Pantry” (C) — “a clear offer… 0 orders so far. It's retail, not dinner delivery, so it can't carry the $10k goal alone.”",
    palette: "Near-black ink #0F0805 field with gold-foil #B79A5B/#E8D4A0 type and cream product cards — the most premium, most departure-from-the-live-site palette of the five, closest to a gift-box unboxing.",
    type: "Cormorant Garamond, an italic display serif, for product names and the gift note — the one direction that leans fully into a luxury-editorial serif rather than Dabney's house Tinos.",
    layout: "Full-bleed hero photo with dark gradient, a three-up real-product shelf, a two-up Trio spotlight, then a dedicated gifting panel (recipient, note, schedule-send calendar, a Pantry Drop recurring toggle) below the fold — gifting as its own moment, not a checkbox at checkout.",
    build: [
      { label: "Live Pantry SKUs, photos, copy", exists: true, note: "Read directly from the live dabneyandco.com/pantry (Sep 29, 2026): Honey Lemon Pepper Dressing 12oz $12, Grandma's Collard Green Dip 16oz $12, Black-Eyed Pea Hummus 10oz $12, The Dabney Trio $30. Photos are the live page's own images, used untouched. Pickup Tue–Sat, 4–9 PM at the bar — also copied verbatim." },
      { label: "Gift note / recipient / schedule-send", exists: false, note: "New, and NOT on the live Pantry today — proposed here, clearly tagged." },
      { label: "Pantry Drop (recurring)", exists: false, note: "New. The one addition in this whole review that creates a recurring order instead of a one-off. Needs Stripe recurring Checkout wired in — not built anywhere in the codebase today." },
      { label: "Checkout", exists: false, note: "The live Pantry already has its own order flow at /pantry/order/ (not read in this session), closer to the gift-card Stripe flow than to a same-day Toast order, since it's pure retail with no real-time kitchen ticket." },
    ],
    buildPath: "Lowest-effort direction of the five: the shelf and trio already exist and sell today. The new work is entirely the gifting layer — recipient/note fields (straightforward), scheduled send (needs a small delayed-fulfillment flag), and Pantry Drop (needs Stripe recurring Checkout, a real but bounded addition).",
    shots: { desktop: `${BASE}/shots/direction-3-pantry-gift-1440.png`, phone: `${BASE}/shots/direction-3-pantry-gift-390.png` },
    mockup: `${BASE}/mockups/direction-3-pantry-gift.html`,
  },
  {
    n: 4,
    id: "regulars",
    name: "The Regular",
    tagline: "One tap reorders what you always get — Blue Bottle and Taco Bell's reorder loop, phone-first.",
    refs: ["Blue Bottle Coffee (iOS)", "CHOPT (iOS)", "Taco Bell (iOS)", "Zomato (iOS)"],
    covers: "Delivery + Pickup (habit loop)",
    problem: "149 of 166 delivery orders already go through DoorDash — proven repeat customers, ordering through the expensive channel because that's where their last order is saved.",
    insight: "Blue Bottle, CHOPT, Taco Bell and Zomato all prove the fastest path back to an order is never re-browsing a menu — it's a saved cart and one button. Nir Eyal's Hook Model names why that habit sticks (hooked-ux skill).",
    bet: "A text-triggered, one-tap reorder will out-convert re-opening DoorDash for the customer's own established habit — because it's faster, not because it's prettier.",
    forWhom: "The person who already orders every week — on DoorDash today, because that's where their last order is saved. The habit-loop version of the commission-free channel.",
    fixes: "Findings (fix): “The commission-free channels have zero orders” and “10+ DoorDash reviews isn't enough to rank” (the stamp row is a natural place to ask for a rating, same idea as the review's proposed bag card).",
    palette: "Paper #F1E4C9 field, ink #0F0805 phone chrome, a single burgundy #5C0E2E CTA — deliberately the sparsest palette of the five, since the whole point is nothing to browse.",
    type: "Cousine (monospace) for order numbers, totals and timestamps — a quiet receipt/ticket rhythm — with Arimo for labels and Tinos italic for the SMS copy, so the text message reads like something a person wrote.",
    layout: "Phone-first by design: a floating phone mockup centered on the canvas (both at 1440 and 390) with a Hook Model explainer panel beside it at desktop width — honest about this being a mobile pattern rather than stretching it into an artificial desktop layout.",
    build: [
      { label: "Saved last-order profile", exists: false, note: "New — needs an account/phone-number identity, which doesn't exist for food ordering today (Toast read-only; no customer accounts in this codebase for takeout)." },
      { label: "SMS ready-alerts", exists: false, note: "New. Twilio or similar — not found configured anywhere in ~/Projects/dabney for this purpose." },
      { label: "One-tap reorder & checkout", exists: false, note: TOAST_READONLY + " Same handoff question as Direction 1." },
      { label: "Pickup QR", exists: false, note: "New, but simple — a static code plus an order-lookup screen at the host stand." },
    ],
    buildPath: "Highest-effort direction of the five — the only one that needs a real customer-identity system (phone number, saved cart, order history) rather than a stateless cart. Everything else in this review can ship before this one.",
    shots: { desktop: `${BASE}/shots/direction-4-regulars-1440.png`, phone: `${BASE}/shots/direction-4-regulars-390.png` },
    mockup: `${BASE}/mockups/direction-4-regulars.html`,
  },
  {
    n: 5,
    id: "editorial",
    name: "The Editorial Table",
    tagline: "An editorial magazine menu — Julienne's recipe layout, told with Dabney's own heritage framing.",
    refs: ["Julienne (web)", "Squarespace (web, template demo)", "HelloFresh (web)"],
    covers: "Pickup + Delivery (discovery)",
    problem: "The menu, out of a delivery bag, arrives with no story attached — and the site's own About page already tells a story (“Named for John Dabney… Southern Hospitality, Liberated”) that never reaches the ordering surface.",
    insight: "Julienne and Squarespace both prove a magazine-grade layout can carry real narrative weight without slowing an order down — the story and the “Add to cart” live in the same paragraph.",
    bet: "Telling the kitchen's real story once, plainly, before the order form will make the $10–$13 items feel worth what they cost — and do more for repeat visits than a faster checkout alone.",
    forWhom: "A first-time guest deciding whether Dabney is worth ordering from at all — the opposite end of the funnel from Direction 4's already-loyal regular.",
    fixes: "Doesn't map to one review finding directly — it's the design-quality argument underneath all of them: a menu that reads as generic loses the pricing power a story-backed one keeps.",
    palette: "Cream #FDFAF5 canvas, ink #0F0805 body text, teal #0B504F small-caps eyebrows, a single gold #B79A5B rule — the most restrained, printed-magazine palette of the five.",
    type: "Fraunces at real magazine scale for the masthead and headline, with a classic dropcap opening the first paragraph — the most editorial, least “app-like” typography of the five.",
    layout: "Asymmetric photo collage (one large + two stacked, Squarespace-style) under a huge headline, then a single-column magazine article with inline order chips and a pull-quote — quoted verbatim from the live About page, never paraphrased.",
    build: [
      { label: "Real dish photography", exists: true, note: "Dabney Steakhouse Sandwich and Spicy Fried Chicken & Cornbread, both real in-room shots from ~/Projects/dabney/public/images, used untouched." },
      { label: "Heritage framing", exists: true, note: "Quoted verbatim from the live dabneyandco.com/about: “Named for John Dabney — an enslaved Virginia caterer and bartender whose craft was renowned while his freedom was withheld. Southern Hospitality, Liberated” and “We take our name from John Dabney — and carry it as an ethic, not an ornament.” Not invented, not paraphrased." },
      { label: "Inline order chips", exists: false, note: "New UI pattern — currently link out to Direction 1's builder rather than adding a second parallel cart." },
    ],
    buildPath: "Lightweight: this is a content/layout page, not a transactional one. It can ship as a static article that hands off to Direction 1's builder (or Toast's hosted checkout directly) for the actual order — no new checkout infrastructure needed.",
    shots: { desktop: `${BASE}/shots/direction-5-editorial-1440.png`, phone: `${BASE}/shots/direction-5-editorial-390.png` },
    mockup: `${BASE}/mockups/direction-5-editorial.html`,
  },
];

export const recommendation = {
  headline: "Ship Direction 1 and Direction 3 first; treat Direction 5 as the wrapper, not a sixth build.",
  body: [
    "Direction 1 (The Builder) is the only direction that directly answers the review's single biggest finding — zero orders on the commission-free channel — and its hardest dependency (Toast checkout handoff) is shared with Directions 2 and 4 anyway, so building it first retires that risk once.",
    "Direction 3 (The Pantry, Gifted) is the lowest-effort, highest-certainty win: the products, photography and pricing already exist and already sell nothing, so the gifting layer is close to pure upside with almost no new backend.",
    "Direction 2 (The Gathering) is worth building next, but only after a real pricing sign-off on the three tiers — the math here is new and proposed, not confirmed.",
    "Direction 5 (The Editorial Table) is cheap enough to fold into Direction 1's launch as its landing page, rather than shipping as a separate surface — the story and the builder should share one URL.",
    "Direction 4 (The Regular) is the right long-term bet but the wrong first bet: it's the only one needing a real identity system, and it's solving a problem (loyalty) that doesn't exist until the other four are moving real volume.",
  ],
};

export const designNotes = [
  "References were pulled live, not recalled: 20 real product/app screens via the Mobbin MCP (search_screens), saved to public/p/dabney-ordering-concepts-v2/img/refs/ with each screen's mobbin_url recorded in referenceBoard above. Dribbble itself returned a 403/empty fetch on every shot page tried (confirmed via WebFetch, consistent with ~/arthur/knowledge/design/SOURCES.md's note that Dribbble requires login) — so the 13 Dribbble references in dribbbleBoard are cited by real, verified URL and title/designer from live WebSearch results, without an embedded thumbnail; the reference board links out to each shot instead of showing a stolen image.",
  "Brand tokens copied verbatim from dabney-brand.css and globals.css, same set round 1 used: paper #F1E4C9, cream #FDFAF5, burg #5C0E2E, gold #B79A5B, ink #0F0805, teal #0B504F; Arimo / Tinos / Cousine. Round 2 deliberately does NOT apply this set uniformly across all five directions the way round 1 did — Daniel's round-1 feedback was that the shared skin “may not be the best,” so each direction pairs Dabney's real brand colors with its own added typeface (Inter, Fraunces, Cormorant Garamond) and its own layout system, cited per direction above.",
  "Real dish names and prices read from ~/Projects/dabney/menu-mockups/data/menu.json (DABNEY KITCHEN section, pulled Sep 26, 2026) for Directions 1, 2 and 5. Direction 3's items, prices, allergen notes, pickup hours and photos are read directly from the LIVE dabneyandco.com/pantry (verified Sep 29, 2026), not the local repo. Fried Green Tomatoes and the Fried Green Tomato BLT are gated off Direction 1's Delivery mode, per the standing rule that they're deliberately left off the DoorDash menu because they travel soggy — not flagged as a menu gap.",
  "Photography is real, in-room or live-site photography, used untouched: Dabney Steakhouse Sandwich, Spicy Fried Chicken & Cornbread (correctly identified as ~/Projects/dabney/public/images/southern-kitchen-hero.jpg after an initial mislabeling was caught and fixed — a same-named file, hero-2.jpg, was first assumed to be a food photo and is actually a dark venue-interior shot; verified by pixel color-averaging before shipping, see below), the four live Pantry product photos, the private-dining/gathering room, and two heritage interior shots (loc-band.jpg, loc-bartender.jpg) from ~/Projects/dabney/public/menu-book/covers/. None of Dabney's public/mockups/food-assets/ renders were used — round 1 already flagged that folder as AI/heavily-styled, and this round didn't re-litigate that call.",
  "Every photo caption in this round was verified against the actual file, not the filename: a mismatch between a file's name (hero-2.jpg, assumed cornbread) and its real content (a dark bar-interior photo) was caught mid-build by averaging pixel color across the image (a food photo on a light plate reads much brighter than a moody interior shot) and cross-checked against the served bytes over HTTP, not just the local disk copy. The wrong reference was removed from both mockups that used it and replaced with the correctly identified food photo.",
  "Heritage framing in Direction 5 is quoted verbatim from the live dabneyandco.com/about (“Named for John Dabney — an enslaved Virginia caterer and bartender whose craft was renowned while his freedom was withheld…” and “We take our name from John Dabney — and carry it as an ethic, not an ornament”) — not paraphrased, not invented, and never described using “soul food.”",
  "Design references consulted from ~/arthur/knowledge/design/ and cited per direction: awwwards-patterns-mastery.md (typography-forward, scroll-restrained layouts — informed the choice to keep motion minimal across all five, since none of the underlying product references relied on scroll-driven animation); design-portfolio-reference-library.md (the single-accent-color-on-neutral-field principle behind Directions 1 and 4); color-palette-mastery.md (contrast-checked Direction 3's gold-on-near-black type); typography-mastery.md (the font-pairing logic behind each direction's added display face); component-patterns-mastery.md (the tier-card and sticky-cart component shapes); brand-mastery.md (Coca-Cola's “color ownership” principle, cross-checked against keeping Dabney's burgundy/gold legible even where a direction adds a new accent). hooked-ux skill (Nir Eyal's Hook Model) for Direction 4's design logic, same as round 1's Concept 5, restyled rather than re-argued.",
  "All five directions are static HTML, screenshotted headless (Playwright, channel 'chrome', no visible window) at 1440×900 desktop and 390×844 phone, with document.documentElement.scrollWidth checked against the viewport width on every shot — no horizontal scroll on any of the ten renders. Run through node ~/arthur/scripts/visual-critic.mjs against every screenshot: every 'blocker' and 'major' finding across all ten (banner/masthead text 'cut off', footer credit lines 'cut off', nav labels 'cut off', a savings-box 'overflow', a reorder button 'not centered', an 'ORDER WHAT YOU JUST READ' heading 'misaligned') was confirmed false by pixel-level crops — consistent with round 1's documented finding that this critic conflates 'near the screenshot edge of a full-bleed layout' with 'clipped by its container.' Only 'minor' severity findings (small spacing/alignment nitpicks inside flex rows) remained after that check, and per instructions only real blockers/majors were required to be fixed.",
  "Build-path notes per direction assume the same constraint round 1 established: Toast's granted API scopes are read-only (src/lib/ordering/menu.ts), so no direction here can inject a kitchen ticket; each build-path note above says explicitly whether it hands off to Toast's hosted checkout, the site's existing Stripe pattern, or needs new infrastructure.",
];
