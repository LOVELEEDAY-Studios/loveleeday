import { TOKENS } from "@/content/tokens";

/* Internal growth plan for Daniel, synthesized from the company review of 2026-10-05 and revised
   for his decisions the same day. Source of record:
   ~/arthur/briefs/growth-plan-review-2026-10-05/SYNTHESIS.md and the memos beside it.
   Every number is either sourced to a named memo or labelled an assumption. Internal page: it may
   name prices and status, so it is token-gated and never listed anywhere. */

export const growthPlanClients = [{ token: TOKENS.growthPlan ?? "", preparedFor: "Daniel May", role: "Founder" }].filter(
  (c) => c.token,
);
export const getGrowthPlan = (token: string) => growthPlanClients.find((c) => c.token === token);

export const facts = [
  { k: "$0", label: "revenue today", src: "Stripe takes test charges only: pearx-application, lines 24 and 143" },
  { k: "0", label: "connectors live at a customer", src: "BRIEF, verified 2026-10-05" },
  { k: "11", label: "vendors with working sign-in", src: "BRIEF, verified 2026-10-05" },
  { k: "3", label: "free market-data feeds to build: FRED, BLS, EIA", src: "CTO memo, free with registration" },
];

export const calls: { t: string; d: string }[] = [
  { t: "Tenant safety first", d: "The engine's graph is a SQLite file on the Mac with app-level filtering only. We merge the tenant-scoped branch, probe two tenants against the live portal and move the graph to Postgres, now. Nothing customer-facing reads the Mac." },
  { t: "Market data now", d: "FRED, BLS and EIA feeds are built now, not when a customer asks. BLS and EIA are free with registration; FRED needs a key and its redistribution terms get read before we resell a series." },
  { t: "No capacity ceiling", d: "Delivery is automated. The Snapshot and the audit are produced and delivered with no person in the loop, the same day, and outreach runs at hundreds of messages a day. The memos' four-to-six-audits-a-month and eight-to-twelve-accounts-a-quarter caps are retired." },
  { t: "Any organization", d: "Small, medium and large, in every industry. No single first market. The pricing-leakage and data-integrity result stays the flagship proof." },
  { t: "Build off the original plan", d: "The pasted plan is the foundation. We keep what is sound, change what the memos show will not work, and say why. Challenges the company raised are risks we manage in motion, not reasons to wait." },
  { t: "We act", d: "We do not wait for PearX, a marketplace, a funder or a certification. Each gap the company found is turned into a same-week action." },
];

export const kept = [
  "Connect many systems into one organizational record, and find money.",
  "The free Snapshot as the top of the funnel.",
  "Data quality plus pricing and margin intelligence as the wedge and the flagship proof.",
  "The modules Connect, Graph, Integrity, Signals, Brief and Watch.",
  "The ladder from Starter to Mid-market, Enterprise and Portfolio, with usage add-ons.",
  "The integration hierarchy: native API, database, warehouse, files, email-in, SFTP, universal ingest API, SDK.",
  "The partner channel, vertical packages as a later layer, and Product Hunt and press.",
];

export const changed: { what: string; why: string }[] = [
  { what: "The entry tier. $49 is gone. Starter opens at $99, with the free Snapshot ahead of it. Growth starts at $399, not $299.", why: "The CFO puts cost to serve at $15-80 a customer-month plus onboarding and support (assumptions), which leaves nothing at $49. $99 is the top of the original band. $299 was marginal in the CFO's model." },
  { what: "Cost to serve is attacked, not only priced around.", why: "The CFO's cost was mostly Daniel's hours. Automated onboarding and support take most of them out, so a per-tenant cost tracker for tokens, Fly and Supabase ships with the first paying customer." },
  { what: "Enterprise and Portfolio are listed now and forecast at $0 for 12 months.", why: "They are gated on SOC 2, a pen test and a backup responder (CFO, CTO). We start SOC 2 readiness now so the gate opens sooner." },
  { what: "Integration work starts with files, email-in and SFTP. Native APIs follow one vendor at a time, after a real-data run.", why: "Zero connectors run at a customer, vendor approvals pace the rest, and files cover the most ground cheapest (CTO, Partnerships)." },
  { what: "The Integration Factory drafts adapters with sandbox tests, and a person reviews each connector before it ships. Autonomous repair is a later goal.", why: "Adapters are thin enough to generate; repair is unproven (CTO). The review is of a connector, never of a customer's delivery." },
  { what: "The Score funnel takes a file or a URL with no live connection. The website scan is cut from v1. The per-domain coverage score becomes a month-2 loop.", why: "The trust page cannot yet answer a security questionnaire; a file and a deterministic rules engine produce the money moment with no OAuth (CPO); the coverage loop needs an organization to exist (CMO)." },
  { what: "Forecast, Advisor, Actions write-back, Exchange and the advertising extension come after the Snapshot, the audit and the first live connectors.", why: "Nothing stands behind them today. Signals moves forward because the feeds are free and Daniel has called for them now." },
  { what: "The flagship demo is rebuilt on synthetic data and labelled so.", why: "Employer data is never usable (BRIEF)." },
  { what: "One public name: LOVELEEDAY sells, Arthur is the engine, the badge reads Connected with Arthur.", why: "The live site already says LOVELEEDAY installs Arthur (CEO, CMO)." },
  { what: "Product Hunt and press follow a working public Snapshot and real case studies.", why: "Launching on a promise the product cannot yet keep is the one move the CMO would veto." },
  { what: "The $1B and $25-75K MRR in 90 days targets are replaced by funnel arithmetic.", why: "The CFO's math puts $1B at 75 percent of the PearX-sized segment." },
];

export const fit: { piece: string; exists: string; gap: string; action: string }[] = [
  {
    piece: "Tenant safety",
    exists: "Tenant tables with RLS and an MFA policy in the portal. Tenant-scoped engine on the unmerged feat/tenant-scoped-engine (17 files, tests included).",
    gap: "The engine graph is a SQLite file on the Mac with a default tenant. App-level filtering only.",
    action: "Pass the tests and merge. Run the two-tenant RLS probe on the live portal. Start the Postgres move.",
  },
  {
    piece: "Market data (Signals)",
    exists: "A news digest only: agentic/news-ingest.js. BLS and EIA are free with registration.",
    gap: "No feed. Mapping to a customer's exposure needs their cost data.",
    action: "Register the three keys, build the ingest and series catalog, read FRED's terms before redistributing.",
  },
  {
    piece: "Free Snapshot",
    exists: "Upload and mapping behind login. No free offer on the site; every call to action points at /studio#project-brief.",
    gap: "No anonymous upload, rules engine, smart mapping or score.",
    action: "Build the price schema, five rules, mapper and score. Ship the public page and put it on every call to action.",
  },
  {
    piece: "Automated audit",
    exists: "Lineage explorer, approvals, audit trail and data health in the portal.",
    gap: "No audit engine or report generator.",
    action: "Generate the audit and brief from the engine with figures injected, never written. Wire it to checkout.",
  },
  {
    piece: "Integration hierarchy",
    exists: "61 connector definitions, OAuth flow, scheduler, runner. Sign-in for 11 vendors. CSV, Excel, SFTP, Snowflake, BigQuery and S3 offered.",
    gap: "None live at a customer. The sync caps at 20 connections a tick, serially, on one machine.",
    action: "Turn on the 11 vendors against our own accounts and publish only what runs. Replace the tick with a queue and per-tenant fairness.",
  },
  {
    piece: "Integration Factory",
    exists: "Thin adapters. About 30 developer apps registered; applications to eleven vendors.",
    gap: "Autonomous repair is unproven.",
    action: "Start with drafted adapters and sandbox contract tests, run internally.",
  },
  {
    piece: "Pricing page",
    exists: "/talk says it does not publish prices.",
    gap: "The ladder is not on the site.",
    action: "Build the pricing page and Stripe products once Daniel confirms the figures.",
  },
  {
    piece: "Payments",
    exists: "Stripe in test mode.",
    gap: "Live mode.",
    action: "Daniel completes verification. Everything else is built to switch on the moment it clears.",
  },
  {
    piece: "Outreach engine",
    exists: "A LinkedIn comment queue, drafts and sales templates.",
    gap: "No automated sequences, warm-up or unsubscribe handling at hundreds a day.",
    action: "Build the sequencer with a dedicated sending domain, warm-up, a suppression list and one-click unsubscribe.",
  },
  {
    piece: "Partner channel",
    exists: "36 developer apps registered; applications submitted to eleven vendors.",
    gap: "No partner page or referral terms.",
    action: "Publish a partner page with the free Snapshot as the hand-off. Automate referral attribution.",
  },
  {
    piece: "Trust",
    exists: "An honest page: no SOC 2, no pen test, SSO planned.",
    gap: "A responder, a pen test, SOC 2.",
    action: "Name a backup responder, commission a pen test, begin SOC 2 readiness.",
  },
  {
    piece: "Forecast, Advisor, Actions, Portfolio, Exchange, ads",
    exists: "Kronos is internal; nothing customer-facing.",
    gap: "Nothing behind them.",
    action: "Sequence after the Snapshot, audit and first live connectors. Portfolio and Enterprise are priced and listed.",
  },
];

export const ladder = [
  { n: "Door", name: "Free Snapshot", price: "Free", d: "A file or a URL in. A score, five findings with the rows behind them and a path to unlock more. Delivered the same day, with no one in the loop.", note: "Kept from the original plan; v1 takes no live connection." },
  { n: "Tier 1", name: "Starter", price: "$99 a month", d: "The recurring re-run of the rules on fresh files, with alerts.", note: "Changed: the original $49-99 band, floor removed." },
  { n: "Tier 2", name: "Growth", price: "$399-799 a month", d: "Connected sources, the organizational record and the executive brief.", note: "Changed: floor raised from $299." },
  { n: "Tier 3", name: "Business", price: "$800-2,500 a month", d: "More sources, market-data exposure mapping, approvals and the audit trail.", note: "Kept: up to $2,500." },
  { n: "Tier 4", name: "Mid-market", price: "$3,000-10,000 a month", d: "Warehouse and ERP-export paths, roles and review workflows.", note: "Kept. A conversation, not a checkout." },
  { n: "Tier 5", name: "Enterprise", price: "$100,000-2M a year", d: "Everything above under a contract.", note: "Kept and listed. Forecast at $0 until SOC 2." },
  { n: "Tier 6", name: "Portfolio", price: "$250,000-5M a year", d: "Many organizations under one holding, fund or franchise.", note: "Kept and listed. Forecast at $0 until SOC 2." },
  { n: "Add-on", name: "Usage", price: "Metered", d: "Rows, sources, feed series and brief volume beyond a tier.", note: "Kept." },
];

export const hierarchy = [
  ["Files and email-in", "First customers. No vendor approval, no OAuth."],
  ["SFTP", "Scheduled drops from systems that cannot call out."],
  ["Native API", "One vendor at a time, each after a real-data run."],
  ["Database and warehouse", "Read-only scopes by default."],
  ["Universal ingest API", "Developer keys and webhooks exist; idempotency and quotas get verified."],
  ["SDK", "After the ingest API proves out."],
  ["Integration Factory", "Drafted adapters, sandbox tests, a person reviews each connector."],
];

export const funnel = [
  ["Outreach", "Approved templates from a warmed, dedicated domain. Hundreds a day. Every message links to the free Snapshot."],
  ["Snapshot", "The prospect uploads a file or gives a URL. The engine maps columns, runs the rules, scores and writes the findings. Same day, no person."],
  ["Audit", "One click turns the Snapshot into the full audit and executive brief, every figure linked to its rows."],
  ["Checkout", "Starter, Growth or Business through Stripe. Annual prepay pulls cash forward."],
  ["Connect", "The customer adds a source through the hierarchy. Watch re-runs the rules and the value keeps arriving."],
  ["Expand", "A coverage score by domain shows what to connect next. Large exposure routes to a Mid-market conversation."],
];

export const buildOrder = [
  ["Canonical price schema and synthetic generators", "1 day"],
  ["Rules engine: stale, dead, duplicate, below cost, outlier", "3 days"],
  ["LLM-assisted column mapper, confidence shown", "2 days"],
  ["Snapshot page with drill-down and CSV export", "3 days"],
  ["Score computed from which columns are present", "1.5 days"],
  ["Executive brief with injected figures", "1.5 days"],
  ["Anonymous upload: 7-day delete, rate limit, abuse controls", "4 days"],
  ["Rules run in Postgres or a Fly worker, off the Mac", "2 days"],
];

export const phases: { d: string; t: string }[] = [
  { d: "Days 1-7", t: "Stripe live-mode verification (Daniel). Merge the tenant branch and run the two-tenant probe. Register the FRED, BLS and EIA keys and start the ingest. Build the schema, rules, mapper and score on synthetic files shaped like distribution, retail and services. Ship the public Snapshot with a labelled sample and put it on home, /integrations and /talk. Stand up the sending domain, warm-up, suppression list and unsubscribe. Draft the template set and sequences. Start the pricing page." },
  { d: "Days 8-14", t: "The Snapshot works end to end on any file. The audit and brief generate on their own. Checkout is wired. Outreach starts at warm-up volume and climbs to hundreds a day. Integration pages go up for connectors that have run on real data. Pen test commissioned, responder named, SOC 2 readiness begun." },
  { d: "Days 15-30", t: "A queue replaces the 20-per-tick sync. First connectors go live for paying customers on read-only scopes. Exposure mapping from the market feeds ships. Partner page and referral attribution go live. First case studies from permissioned Snapshots. Intuit assessment and Google verification submitted on read-only scopes. Day 30: review sends, replies, Snapshots, conversions and cash. The PearX answer is due about now." },
  { d: "Ninety days", t: "All self-serve tiers live and selling. Mid-market conversations opened from Snapshots that show large exposure. Marketplace listings submitted as installs arrive (HubSpot wants three active unaffiliated installs in 30 days). Product Hunt launches with the Snapshot live and case studies in hand. The Integration Factory ships its first generated connectors under sandbox tests." },
  { d: "Twelve months", t: "SOC 2 Type I, if started now, assumed 3-4 months (CTO). Enterprise and Portfolio lines open. Exchange opens once connectors are numerous enough to list. Vertical packages follow the data, not a guess." },
];

export const model = [
  { c: "Conservative", req: "0.5%", snaps: "90", conv: "5%", cust: "about 4.5", plan: "$150", mrr: "about $700" },
  { c: "Base", req: "1%", snaps: "180", conv: "8%", cust: "about 14", plan: "$250", mrr: "about $3,600" },
  { c: "Aggressive", req: "2%", snaps: "360", conv: "10%", cust: "about 36", plan: "$400", mrr: "about $14,400" },
];

export const coverage = [
  { t: "Outbound", d: "Hundreds of organizations a day get a free Snapshot. Volume scales the numbers linearly; deliverability is the limit, not anyone's hours." },
  { t: "Partners", d: "An accountant, bookkeeper, fractional CFO, consultant or chamber hands a client the Snapshot link. Every Snapshot returns a path to unlock more." },
  { t: "Inside an organization", d: "A coverage score by domain (finance, sales, operations, people, customer, supply chain) shows what to connect next. It needs an organization to exist, so it is a month-2 loop." },
  { t: "Integration pages", d: "A page for every connector that works: what it reads, a sample answer, a lineage example. Pages claim only what a customer can do today." },
  { t: "Marketplaces", d: "Listings follow installs. Submit Intuit's assessment now; use read-only Google scopes; HubSpot waits for three installs; Microsoft AppSource is real build work for day 90 or later." },
  { t: "Launch", d: "Product Hunt and press once there is a Snapshot to try and a case study to point at." },
];

export const risks = [
  { t: "Essex conflict", d: "Daniel is Director of Pricing at Superior Essex. A pricing audit aimed at wire, cable or electrical-supply companies can touch employer IP, a competitor or a non-compete. No seat reviewed his agreement. Action: Daniel checks it this week, and until then those segments are suppressed from outreach. QAD, Salesforce and employer data never enter a demo, a connector or a pitch." },
  { t: "Stripe live mode", d: "No dollar arrives without it and only Daniel can finish it. Action: day 1." },
  { t: "Tenant safety and the Mac", d: "The graph is a SQLite file on an 8 GB laptop. Action: merge, probe and move to Postgres this week. Nothing customer-facing runs on the Mac." },
  { t: "Delivery with no human", d: "The risk is a wrong figure reaching a customer. Action: the engine says which columns it found, shows the rows behind every figure, separates exposure from loss, refuses a figure it cannot source and logs every output." },
  { t: "Outreach at hundreds a day", d: "Deliverability, unsubscribe law and domain reputation. Action: a dedicated sending domain, warm-up, a suppression list, one-click unsubscribe and a postal address. Sending from approved templates without per-message approval changes the standing rule that no email goes out without Daniel's approval; this plan records his decision, and the rule's text still needs his update." },
  { t: "Trust and SOC 2", d: "Mid-market and above will ask. Action: pen test, responder and SOC 2 readiness start now. Until then, file-based work, read-only scopes and deletion after delivery are the answer. Year-one spend is assumed at $15,000-30,000." },
  { t: "Connectors and the Factory", d: "Zero connectors run at a customer and autonomous repair is unproven. Action: a connector goes on the site only after a real-data run." },
  { t: "Naming and pricing consistency", d: "The site still says it does not publish prices and brands the engine under LOVELEEDAY. Action: update the site and proposals together with the pricing page." },
  { t: "Inference cost and terms", d: "The free tier's commercial multi-tenant terms are unverified. Action: confirm them, track cost per tenant and budget a paid tier." },
];

export const decisions: { q: string; rec: string }[] = [
  { q: "Complete Stripe live-mode identity and bank verification.", rec: "Today. Everything else is built to switch on the moment it clears." },
  { q: "Check your Essex agreement and settle the conflict question.", rec: "This week. Until then pricing outreach to wire, cable and electrical-supply companies is suppressed and no employer system or data is touched." },
  { q: "Confirm the self-serve prices shown publicly: Starter $99, Growth $399-799, Business $800-2,500 a month.", rec: "Publish them with a start-free button on the Snapshot. Keep Mid-market, Enterprise and Portfolio as conversations." },
];

export const sources = [
  "Synthesis: ~/arthur/briefs/growth-plan-review-2026-10-05/SYNTHESIS.md, from BRIEF, ceo, cro, cfo, cmo, cpo, cto, partnerships and council in the same folder, revised for Daniel's decisions of 2026-10-05, which override the memos.",
  "What exists was verified by each seat on 2026-10-05 against the repositories and files named in its memo. Re-probe any figure before it drives a decision.",
  "The original tiers and ranges are the pasted plan's figures, not LOVELEEDAY-sourced. The changes to them are judgment. Costs to serve, conversion rates, durations and the SOC 2 spend are assumptions.",
  "The revenue model is funnel arithmetic on 200 sends a day for 90 days (18,000 messages); every rate in it is an assumption. The CFO's capacity-capped month-3 figures were $1,000, $3,000 and $6,000, and month-12 MRR of $6,000, $22,000 and $55,000 with about $45,000, $150,000 and $380,000 cumulative cash; those are the only sourced anchors and are treated as a floor.",
  "Market facts cited in the memos (Product Hunt launch rules, BLS and EIA access, HubSpot listing requirements) were fetched by the seat that cites them. Xero's certification threshold and Google's assessment cost are unverified.",
  "The council text breaks off partway through its first synthesis move; only the parts present were used.",
];
