import { TOKENS } from "@/content/tokens";

/* Internal growth plan for Daniel, synthesized from the company review of 2026-10-05.
   Source of record: ~/arthur/briefs/growth-plan-review-2026-10-05/SYNTHESIS.md and the eight memos
   beside it. Every number here is either sourced to a named memo or labelled an assumption.
   Internal page: it may name prices and status, so it is token-gated and never listed anywhere. */

export const growthPlanClients = [{ token: TOKENS.growthPlan ?? "", preparedFor: "Daniel May", role: "Founder" }].filter(
  (c) => c.token,
);
export const getGrowthPlan = (token: string) => growthPlanClients.find((c) => c.token === token);

export const facts = [
  { k: "$0", label: "revenue today", src: "Stripe is in test mode: pearx-application, lines 24 and 143" },
  { k: "0", label: "connectors live at a customer", src: "BRIEF, verified 2026-10-05" },
  { k: "7 days", label: "to a concierge snapshot", src: "CPO build order, an assumption" },
  { k: "18 days", label: "to a self-serve snapshot", src: "CPO build order, an assumption" },
];

export const agreed = [
  "Revenue is $0 and Stripe cannot take a live charge yet, so nothing can be sold until that is fixed.",
  "The first paid product is a fixed-price service that runs on the platform, not self-serve software.",
  "Employer data is never used. The 20,417-record, $1.4M example is illustrative and gets rebuilt on synthetic or consented data, labelled as such.",
  "$25-75K MRR in 90 days is not credible for one operator, and $1B is not a planning number. The CFO puts the reachable figure at $1-3M ARR in 36 months (assumption).",
  "One public name: LOVELEEDAY sells, Arthur is the engine, and the badge reads Connected with Arthur.",
  "The free snapshot is the right door, but version one takes a file and no live connections.",
  "The connector factory, marketplace, portfolio, forecast, advisor, write-back actions and advertising extension wait.",
  "The fast route to reach is people who already hold the exports and the trust: accountants, bookkeepers, fractional CFOs. Vendor marketplaces come later.",
];

export const disputes: { topic: string; split: string; call: string; why: string }[] = [
  {
    topic: "Price",
    split: "CEO $2,500-5,000. CRO $1,500 check, $4,500-9,500 audit. CFO $2,500-7,500 with a floor. CMO $3,000-5,000. CTO $5,000-15,000. Partnerships $1,500-3,000.",
    call: "One ladder on the CFO's floor: Review $2,500-7,500 fixed, Watch $500-1,500 a month, and the CRO's $1,500 check only as a founding rate for three named case studies.",
    why: "Under about $2,500 setup plus $500 a month, Daniel's hours make the work lose money (CFO). The founding rate buys the case studies every seat said we lack. All assumptions: no LOVELEEDAY price is on file.",
  },
  {
    topic: "Day-30 cash",
    split: "CMO and Partnerships $3-10K. CRO $7K. CEO $7.5-20K. CTO $15-60K.",
    call: "Plan on $3,000-12,000, base $7,000-10,000.",
    why: "That is the CRO's funnel arithmetic: 150 touches, 30 conversations, 12 calls, 3 deals. The CTO's figure needs 3-5 audits at $5-15K closing in 30-60 days, which no conversion math here supports. It is upside, not plan.",
  },
  {
    topic: "Month-3 MRR",
    split: "CFO $3K base. CRO $4-6K. CEO $5-10K. CMO $5-15K as a stretch.",
    call: "The CFO's curve is the model of record.",
    why: "It states its assumptions: 15 percent of studies become a sprint, half add a retainer, 3 percent monthly churn, capacity-capped. It also lands near the application's own milestone of $10K MRR by 3/31/2027.",
  },
  {
    topic: "First industry",
    split: "CEO: distribution or professional services. CMO: manufacturing and property. CPO: distribution fits the engine. CRO: Daniel's network. Council: top 50 distributors.",
    call: "Build the engine on a distribution-shaped synthetic file. Sell first to West Michigan owner-operators with a price list, through their accountants.",
    why: "The CRO's warning about employer IP and a non-compete outranks convenience. A distribution or manufacturing quote waits for the Essex check, and wire and cable never.",
  },
  {
    topic: "Snapshot timing",
    split: "CMO: a page in days 1-7. CPO: engine 7 days to concierge, 18 to self-serve.",
    call: "A request page and sample in week one. Daniel runs each snapshot by hand from about day 8. Anonymous upload around days 45-60.",
    why: "The page can ship before the engine; the anonymous path is the long pole because the trust page admits no pen test. Capped at five a week (CFO assumption).",
  },
  {
    topic: "Security spend",
    split: "CTO: merge, move off the Mac, start SOC 2 readiness in 30 days. CFO: spend only when a prospect asks.",
    call: "Do the engineering now, get a SOC 2 quote in days 21-30, commit money only on a prospect's request.",
    why: "The engineering costs time, not cash. The first reviews run in the portal's database, so the Mac move gates connectors and the graph, not the first sale.",
  },
  {
    topic: "Upwork",
    split: "CFO and CRO count it. The CRO also found it marked not in active use, and a $125 hourly rate against the fixed-price rule.",
    call: "Re-probe it. Count $0 in the base case.",
    why: "A channel that may be dormant should not carry a forecast.",
  },
  {
    topic: "Partner terms",
    split: "CRO: 20 percent of the first invoice. Partnerships: 20 percent of first-year fees, or a $500-1,500 white-label snapshot.",
    call: "Test 20 percent of the first invoice with two partners, and the white-label snapshot second. Legal review first.",
    why: "Cheaper to be wrong about. Both are assumptions.",
  },
  {
    topic: "Launch gate",
    split: "CEO: after three case studies. CRO: two. CMO: one, plus ten connector pages.",
    call: "Not before the self-serve snapshot is live and two permissioned case studies exist, and not before day 90.",
    why: "A launch on a promise the product cannot yet keep is the one move the CMO would veto.",
  },
  {
    topic: "The council",
    split: "Five titan traces; the text breaks off partway through its first synthesis move.",
    call: "Used Thiel (small first market), Gerber (a playbook a partner can run) and Jobs (prune connectors). Dropped Ford.",
    why: "Ford's move overpays early adopters in cash we do not have and stores their data in an exclusive pool, which breaks the tenant-isolation promise. Dropped too: the top 50 distributors, for the Essex check.",
  },
];

export const fit: { piece: string; exists: string; gap: string; when: string }[] = [
  {
    piece: "Connect: files, SFTP, email-in, API",
    exists: "CSV and Excel upload, mapping, row errors, 25 MB and 200k-row limits. arthur-launch: lib/connectors/upload/, UploadView.tsx",
    gap: "Behind login only. Mapping is exact-header match. No price schema.",
    when: "Concierge day 8-10. Anonymous upload days 45-60.",
  },
  {
    piece: "Connect: 60 OAuth connectors",
    exists: "61 definitions, OAuth flow, scheduler, runner. Sign-in credentials for 11 vendors. arthur-launch: lib/connectors/",
    gap: "None live at a customer. Hourly sync caps at 20 connections, serially, on one machine.",
    when: "First live pilot month 3-4. Nothing promised before it runs on real data.",
  },
  {
    piece: "Integration Factory",
    exists: "Thin adapters: adapters/rest-systems.ts, planned-http.ts",
    gap: "Drafting adapters is plausible. Autonomous repair is not.",
    when: "After the first 10 paying organizations.",
  },
  {
    piece: "Graph",
    exists: "~/arthur/lib/ontology/index.mjs, a SQLite file on the Mac. Tenant scoping sits on the unmerged feat/tenant-scoped-engine. Status Partial (CAPABILITY_SPEC).",
    gap: "Not tenant-safe in production. Depends on a laptop.",
    when: "Merge days 1-14. Off the Mac by day 30-45. Before any customer data enters it.",
  },
  {
    piece: "Integrity, the wedge",
    exists: "Connector health only: lib/connectors/runner/health.ts",
    gap: "No data-quality engine, price schema, rules or money-at-stake math.",
    when: "Engine days 1-10. Self-serve about 18 working days.",
  },
  {
    piece: "The free snapshot and score",
    exists: "A hand-typed coverage page in the portal. No free offer on the site.",
    gap: "Score, request page, analytics unverified.",
    when: "Request page week 1. Concierge day 8-10.",
  },
  {
    piece: "Signals: CPI, energy, freight",
    exists: "A news digest only: agentic/news-ingest.js. BLS and EIA are free with registration; FRED needs a key and its terms are unread.",
    gap: "No feed. Mapping to a customer's exposure needs their cost data.",
    when: "3-5 days once a customer asks. Month 4 at the earliest.",
  },
  {
    piece: "Brief",
    exists: "None",
    gap: "One page, figures injected by the engine, one written paragraph.",
    when: "Days 8-14, about 1.5 days.",
  },
  {
    piece: "Forecast, Advisor, Actions, Portfolio, Exchange, ads",
    exists: "Kronos is internal forecasting, not a product.",
    gap: "Nothing behind them.",
    when: "Not before month 12. Portfolio and enterprise forecast at $0.",
  },
  {
    piece: "Site funnel",
    exists: "/talk sells four scoped engagements and says it does not publish prices. /integrations is one page of 60 cards.",
    gap: "No /snapshot. Every call to action points at /studio#project-brief. No per-connector pages.",
    when: "Page and links days 4-7. First connector pages days 15-30.",
  },
  {
    piece: "Proposal template",
    exists: "/p/hub, /p/studio, /p/civic, /p/compliance",
    gap: "No Review or Watch proposal.",
    when: "Days 1-3, from the live template.",
  },
  {
    piece: "Partner channel",
    exists: "36 developer apps registered. Applications submitted to eleven vendors.",
    gap: "No partner page, white-label sample or terms.",
    when: "Weeks 1-2.",
  },
  {
    piece: "Payments",
    exists: "LOVELEEDAY Stripe is in test mode.",
    gap: "Identity and bank verification, a payment-link template.",
    when: "Days 1-3.",
  },
  {
    piece: "Trust",
    exists: "An honest page: one operator, no SOC 2, no pen test, SSO planned.",
    gap: "Backup responder, pen test, SOC 2.",
    when: "Responder by day 30. SOC 2 on a prospect's request.",
  },
  {
    piece: "Public pricing",
    exists: "Prices live in proposals only.",
    gap: "The pasted plan's $49-2,500 tiers conflict with it.",
    when: "Resolved: no public prices.",
  },
];

export const ladder = [
  { n: "Rung 0", name: "Free snapshot", price: "Free, five a week", d: "One file in. A score, five findings with the rows behind them, and a conversation at the end. Daniel reviews each one by hand until the engine is trusted." },
  { n: "Rung 1", name: "Price Integrity Review", price: "$2,500-7,500 fixed", d: "Five to ten business days, file-based. Stale, dead, duplicate, below-cost and outlier prices, dollar exposure and a ranked fix list. The CRO's $1,500 founding rate is offered to the first three clients who agree to a named case study." },
  { n: "Rung 2", name: "Watch", price: "$500-1,500 a month", d: "The same rules re-run on fresh files, or on one authorized connection once a connector has run at a customer. This is what becomes MRR." },
  { n: "Rung 3", name: "Self-serve tier", price: "Priced later", d: "Month 4 at the earliest, only after a connector runs at a paying customer. The only tier whose price may ever be public. Enterprise and portfolio lines are forecast at $0 for 12 months because they wait on SOC 2." },
];

export const buildOrder = [
  ["Canonical price schema and synthetic file generators", "1 day"],
  ["Rules engine as a pure module: stale, dead, duplicate, below cost, outlier", "3 days"],
  ["LLM-assisted column mapper, confidence shown, the user confirms", "2 days"],
  ["Snapshot page with drill-down to rows and CSV export", "3 days"],
  ["Score and coverage score from which columns are present", "1.5 days"],
  ["Executive brief: one page, figures injected by the engine", "1.5 days"],
  ["Anonymous snapshot: 7-day delete, rate limit, security review", "4 days"],
  ["Run the rules in Postgres or a Fly worker, off the Mac", "2 days"],
];

export const channels = [
  ["Daniel's network", "60 contacts: ex-colleagues and vendors outside Essex's competitive set, Dabney's vendors and event clients."],
  ["LinkedIn", "60 targets, plus the existing comment queue and three posts a week drawn from the /notes essays."],
  ["Local owners", "30 through the chamber and the SBTDC southwest office, with a workshop on stale price records."],
  ["Accountants and fractional CFOs", "Referrers first, because they already hold the exports. Twenty percent of the first invoice is the test."],
  ["Fixed-price Upwork", "Only after a re-probe, and counted at $0 in the base case."],
  ["Product Hunt and press", "Last, behind the gate in the disputes above."],
];

export const days: { d: string; t: string }[] = [
  { d: "Day 1", t: "Daniel starts Stripe live-mode identity and bank verification; only he can. Decide the prices and the public name." },
  { d: "Day 2", t: "Open the Essex conflict check with the CLO. Build the synthetic distribution-shaped price file and the canonical schema." },
  { d: "Day 3", t: "Run the synthetic file through portal upload and data health, and confirm the lineage output. Draft the Review as a /p proposal from the live template." },
  { d: "Day 4", t: "Build the 60 / 60 / 30 contact lists: network, LinkedIn, local." },
  { d: "Day 5", t: "Draft the first 20 messages, warm and compassionate. Nothing is sent." },
  { d: "Day 6", t: "Start the rules engine. Ship the /snapshot request page with a labelled synthetic sample, and point the main call to action on home, /integrations and /talk at it. Confirm analytics." },
  { d: "Day 7", t: "Daniel approves the first 20 messages. Submit the drafted Intuit assessment and the Google verification if approved." },
  { d: "Day 8", t: "First 10 approved sends. Test the engine on a 200,000-row synthetic file." },
  { d: "Day 9", t: "10 sends. Build the column mapper." },
  { d: "Day 10", t: "10 sends. The concierge snapshot works end to end. Run it on Dabney, the proof case, and time it." },
  { d: "Day 11", t: "Queue two LinkedIn comments. Run the snapshot for one friendly outside organization, with written permission." },
  { d: "Day 12", t: "First discovery calls. Every proposal goes out within 24 hours of its call." },
  { d: "Day 13", t: "10 sends. Merge the tenant-scoped engine branch once its tests pass." },
  { d: "Day 14", t: "Two-tenant RLS probe on the portal. Draft the partner page and ten partner messages." },
  { d: "Days 15-16", t: "Calls continue toward 12 in the window. Offer the founding rate to the first interested clients." },
  { d: "Day 17", t: "Partner messages approved and sent; Kalamazoo bookkeepers first." },
  { d: "Day 18", t: "Free snapshots for warm contacts, five this week, which is the cap." },
  { d: "Day 19", t: "The first review starts for a founding or paying client." },
  { d: "Day 20", t: "Stand up a per-tenant cost tracker for tokens, Fly and Supabase." },
  { d: "Days 21-22", t: "Move the customer-facing graph off the Mac, or set a nightly sync with a restore test. Name the backup responder." },
  { d: "Day 23", t: "Deliver the first review end to end and record the real before-and-after dollars." },
  { d: "Day 24", t: "Turn the result into a case-study page, with permission. Pitch Watch to each completed client." },
  { d: "Day 25", t: "Brief five accountants on the referral. Get the SOC 2 readiness quote." },
  { d: "Days 26-28", t: "Build the first six connector pages, only for vendors whose sign-in works, saying only what a customer can do today. Close the second and third deals." },
  { d: "Day 29", t: "Compare the funnel with the CRO's assumptions: 20 percent reply, 40 percent of those book, 25 percent close." },
  { d: "Day 30", t: "Checkpoint on cash, deals, partner conversations and hours actually spent. Set the targets for days 31-90. The PearX answer is due about now." },
];

export const ninety = [
  ["Month 2", "Three or more reviews delivered and two to three Watch retainers. The anonymous snapshot goes live behind a written security review, around days 45-60. The brief ships. First accountant-sourced client. Second case study."],
  ["Month 3", "Ten connector pages. First live connector pilot at a paying customer on a read-only scope. Marketplace listings prepared but not required. Signals only if a customer asks. CFO model: $1,000, $3,000 or $6,000 MRR."],
];

export const twelve = [
  ["Months 4-9", "First live connector at a customer. Partner-sourced pilots. Marketplace listings that need installs: HubSpot wants three active unaffiliated installs in 30 days, and Xero reportedly about ten, unverified. A second industry only after the first repeats."],
  ["Month 6", "The hiring decision. The CFO's aggressive case needs one hire here plus a channel partner."],
  ["Months 7-12", "SOC 2 Type I if a prospect requires it. A self-serve price is published only if a connector has run at a paying customer. Target from the application: 15 paying organizations and about $10,000 MRR by 3/31/2027."],
];

export const cash = [
  { c: "Conservative", m3: "$1,000", m6: "$3,000", m12: "$6,000", cash: "about $45,000" },
  { c: "Base", m3: "$3,000", m6: "$9,000", m12: "$22,000", cash: "about $150,000" },
  { c: "Aggressive", m3: "$6,000", m6: "$20,000", m12: "$55,000", cash: "about $380,000" },
];

export const coverage = [
  { t: "Partners", d: "Accountants, bookkeepers, fractional CFOs, the chamber and the SBTDC reach five to twenty clients each. Names need research; none are invented. After the third delivery, write the review as a one-page playbook a partner can run, so delivery stops depending on one person." },
  { t: "The free snapshot", d: "Five a week while it is concierge. It is the only self-serve door, and it ends in a conversation, never a price. Anonymous upload follows the security review." },
  { t: "Integration pages", d: "One page per connector that works, starting with the 11 vendors with working sign-in: what it reads, a sample question answered, a lineage example. The rest stay on the grid. A page claims only what a customer can do today." },
  { t: "Marketplaces", d: "A 90-180 day parallel track riding on partner-sourced pilots. Submit the drafted Intuit assessment now. Google needs read-only scopes to avoid an annual assessment. HubSpot waits for three installs. Microsoft AppSource waits until day 90 or later." },
  { t: "Sequencing", d: "Concierge snapshot, paid review, case studies, partners, connector pages, self-serve, then Product Hunt and press, then marketplaces." },
  { t: "Delivery guardrails", d: "Five free snapshots a week. No more than four to six reviews a month before a second person exists. No sale promised on a connector that has not run on real data." },
];

export const risks = [
  { t: "Essex conflict", d: "Daniel is Director of Pricing at Superior Essex. A pricing audit sold to distributors or manufacturers can touch employer IP, a competitor or a non-compete clause. No seat reviewed his agreement. The CLO owns the check. QAD, Salesforce and employer data never enter a demo, a connector or a partner pitch. Until it clears, sell outside distribution." },
  { t: "Founder capacity", d: "One person selling, delivering and supporting caps the plan at roughly four to six reviews a month (CRO) and 8-12 onboarded accounts a quarter (CFO), both assumptions. Daniel sets the weekly hours; the snapshot cap and the playbook protect delivery." },
  { t: "The Mac dependency", d: "The customer-facing graph is a SQLite file on an 8 GB laptop. If it sleeps, every organization's findings stop. The first reviews run in the portal's database, the graph moves off the Mac by day 30-45, and the tenant-scoped branch merges before customer data enters it." },
  { t: "Stripe live mode", d: "No charge can be taken until identity and bank verification are done, and only Daniel can finish it. A delay here delays every dollar in this plan. It is day 1." },
  { t: "SOC 2", d: "No SOC 2, no pen test, no backup responder. Mid-market buyers will ask. File-based reviews with deletion after delivery, read-only scopes, a named responder and a readiness quote carry us until then. Year-one spend is assumed at $15,000-30,000 and is committed only on a prospect's request." },
];

export const decisions: { q: string; rec: string }[] = [
  { q: "Complete Stripe live-mode identity and bank verification this week.", rec: "Yes, day 1." },
  { q: "Clear the Essex conflict, or name the off-limit segments, and authorize the CLO to review your agreement before any quote to a distributor or manufacturer.", rec: "Yes. Sell elsewhere until it clears." },
  { q: "Approve the ladder: Review $2,500-7,500 fixed, founding rate $1,500 for the first three, Watch $500-1,500 a month, no $49 tier at launch, no public prices.", rec: "Approve." },
  { q: "Public naming: LOVELEEDAY sells, Arthur is the engine, the badge reads Connected with Arthur.", rec: "Yes." },
  { q: "First market: West Michigan owner-operators with a price list, reached through accountants, the engine built on a distribution-shaped synthetic file.", rec: "Yes." },
  { q: "How many hours a week can you give to selling for 30 days, outside the day job?", rec: "Set it now. The plan assumes about 10 and every curve scales to it." },
  { q: "File upload first, connectors later, with concierge snapshots for the first 10 prospects at five a week.", rec: "Yes." },
  { q: "Merge the tenant-scoped engine branch before any customer data enters the graph, move the graph off the Mac, and name a backup responder.", rec: "Yes." },
  { q: "Set a SOC 2 spend ceiling, triggered only when a prospect requires it, and get the readiness quote in days 21-30.", rec: "Yes." },
  { q: "Partner terms: test 20 percent of the first invoice with two partners and a $500-1,500 white-label snapshot, legal review first.", rec: "Yes." },
  { q: "Submit the drafted Intuit assessment and the Google OAuth verification on read-only scopes.", rec: "Yes." },
  { q: "Approve the network list and the first 20 drafted messages when ready, and name ten warm contacts plus any accountants, bookkeepers and MSPs you know in Kalamazoo.", rec: "Yes. Nothing is sent without your go." },
  { q: "Confirm every figure in the demo and the sample report is synthetic or consented, never employer data, and says so.", rec: "Yes." },
  { q: "Hold Product Hunt and press until the self-serve snapshot is live and two permissioned case studies exist, and not before day 90.", rec: "Yes." },
];

export const sources = [
  "Synthesis: ~/arthur/briefs/growth-plan-review-2026-10-05/SYNTHESIS.md, from BRIEF, ceo, cro, cfo, cmo, cpo, cto, partnerships and council in the same folder.",
  "What exists was verified by each seat on 2026-10-05 against the repositories and files named in its memo. Re-probe any figure before it drives a decision.",
  "Every price, conversion rate, duration and cost marked an assumption in the memos is an assumption here. No LOVELEEDAY price is on file.",
  "Market facts cited in the memos: Product Hunt launch rules, BLS and EIA access, and HubSpot's listing requirements were fetched by the seat that cites them. Xero's certification threshold and Google's assessment cost are unverified.",
  "The council text breaks off partway through its first synthesis move; only the parts present were used.",
];
