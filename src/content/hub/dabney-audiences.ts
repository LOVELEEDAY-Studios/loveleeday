/* Dabney Audience Review — LOVELEEDAY review. Local only, not deployed (it carries Meta account IDs).
   All figures read live from the Meta Marketing API, act_24502732409351450, September 28, 2026,
   via `arthur-cred run --use meta -- node …` against Graph API v21.0. Cross-referenced against
   the ads performance findings in src/content/hub/dabney-ads.ts and the interest list in
   ~/arthur/scripts/build-live-event-campaign.mjs. No campaigns, ads, spend, or live ad-set changes
   were made — every write below is a customaudiences POST (audience creation only). */
export type Sev = "fix" | "watch" | "good";

export const clients = [{ token: "dabney-audiences-internal", short: "Dabney & Co.", preparedFor: "Daniel May", role: "Founder" }];
export const getClient = (t: string) => clients.find((c) => c.token === t);

export const copy = {
  title: "Dabney Audience Review",
  asOf: "September 28",
  hero: {
    a: "21 audiences existed. None matched what actually sells.",
    b: "Nine built, one blocked, three broken, and a map for the rest.",
    intro:
      "Every custom audience, lookalike, saved audience and the targeting on all 69 ad sets touched in the last 90 days, read live from the Meta Marketing API on act_24502732409351450. The account already has real audiences — engagers, a Brevo list, one working lookalike — but nothing built for a Purchase, nothing for a reservation click, and no audience organized around the three things ads actually need to do here: get someone engaged, get them to reserve, get them to buy.",
  },
  grades: { a: "Where each audience type stood,", b: "and where it stands now.", intro: "Struck-through grade is before this session; the bold one is after today's builds. Saved audiences and event-response audiences are graded on what the API allows, not what would be ideal." },
  model: { a: "One audience set per goal,", b: "matched to the event the ad set optimizes on.", intro: "Four rules for how the account's audiences should fit together, given what's already built and what still needs a human." },
  fixes: { a: "Nine built today,", b: "four still need a decision.", intro: "Every build below has an id read back from the Meta API. What's left needs either Ads Manager (the saved audience) or a delete you'd have to approve (the three broken lookalikes)." },
};

export const glance: { k: string; label: string; src: string }[] = [
  { k: "21 → 30", label: "Custom + lookalike audiences before and after this session.", src: "Meta Marketing API, customaudiences, Sept 28" },
  { k: "9", label: "New audiences created this session — 5 rule-based, 4 lookalikes.", src: "This session's customaudiences POSTs" },
  { k: "3", label: "Existing lookalikes permanently broken (“too small,” Meta says delete and recreate).", src: "delivery_status on 3 LOOKALIKE audiences" },
  { k: "4", label: "Duplicate audience pairs already in the account (Page engagers, IG engagers, two Brevo-sourced lists).", src: "Name/subtype match across the 21 pre-existing audiences" },
  { k: "1", label: "Saved audience blocked outright: the app has no permission to create one via the API.", src: "POST act_.../saved_audiences → (#3)" },
  { k: "0", label: "Ad sets optimizing on Purchase, in 87 total / 69 touched in 90 days.", src: "adsets, optimization_goal breakdown" },
];

export const table: { eyebrow: string; a: string; b: string; intro: string; columns: string[]; rows: string[][] } | null = {
  eyebrow: "The three goals",
  a: "Engagement, reservations, sales.",
  b: "One row for each.",
  intro:
    "Every ad on this account is really trying to do one of three things. Each row is the audience set for that goal: who to prospect, who to warm up, whose lookalike to build from, who to leave out, and the event the ad set should optimize on. Bold names were created this session; the rest already existed and work.",
  columns: ["Goal", "Prospecting", "Warm / retargeting", "Lookalike seed", "Exclusions", "Ad-set optimization event"],
  rows: [
    [
      "Engagement",
      "Kalamazoo, 30mi, interest sets: LIVE Music, DJ/Music Showcase, Dabney After Dark Hip-Hop/R&B (saved audiences, exist)",
      "FB Page Engagers 365d + IG Engagers 365d (exist, duplicated — see findings) · FB Engagers 14d hot-week (exists)",
      "DAB | Engagement | LAL 1% Page Engagers (US) — new, replaces a broken legacy LAL off the same source",
      "Recent Purchasers 365d, Reserve-Click 180d (both new — don't show an engagement ad to someone already booked)",
      "Post engagement / Event Responses (EVENT_RESPONSES is UI-only under ODAX — build the ad set in Ads Manager, not the API)",
    ],
    [
      "Reservations",
      "DAB | Kalamazoo Core — Women 25–54, 15mi — blocked, see findings (women 25–54 answer at 0.55 RSVP/$ vs 0.37 for 65+)",
      "DAB | Reservations | Reserve-Click 180d — new (Schedule pixel event) · Site Visitors 30d (exists, thin)",
      "DAB | Reservations | LAL 1% Reserve-Clickers (US) — new, seeded off the audience built this session",
      "DAB | Sales | Purchasers 365d (new — exclude people who already bought a ticket/Experience/gift card)",
      "Schedule (OFFSITE_CONVERSIONS on schedule_website) — already how 29 of 69 recent ad sets optimize",
    ],
    [
      "Sales",
      "LAL 1% Purchasers (attempted, seed too small today — see findings) or the Reservations lookalike as a stand-in until it fills",
      "DAB | Sales | Reserve-not-Purchased 180d — new (scheduled a reservation, hasn't purchased in the window)",
      "DAB | Sales | LAL 1% Purchasers (US) — new, created but will read “too small” until real Purchase volume exists",
      "DAB | Sales | Purchasers 365d (new — self-exclude repeat buyers from prospecting/warm)",
      "Purchase (OFFSITE_CONVERSIONS on Purchase) — zero of 87 ad sets use this today; capi-purchases.mjs is the fix in flight",
    ],
  ],
};

export const audienceTable: { eyebrow: string; a: string; b: string; intro: string; columns: string[]; rows: string[][] } = {
  eyebrow: "Every audience",
  a: "30 custom and lookalike audiences,",
  b: "what each one is for and whether it's used.",
  intro: "Size is Meta's approximate range at read time. “Used” counts ad sets touched in the last 90 days that include the audience; “Excluded by” counts ad sets that exclude it. New audiences show 20–20 or 1,000–1,000 — Meta's floor while it backfills; real size follows over the next day or two.",
  columns: ["Audience", "Type", "Size (approx.)", "Status", "Used by", "Excluded by"],
  rows: [
    ["DAB | Sales | Purchasers 365d", "Website · Purchase", "20–20 (populating)", "New, ready", "0", "0"],
    ["DAB | Reservations | Reserve-Click 180d", "Website · Schedule", "20–20 (populating)", "New, ready", "0", "0"],
    ["DAB | Sales | Reserve-not-Purchased 180d", "Website · Schedule minus Purchase", "20–20 (populating)", "New, ready", "0", "0"],
    ["DAB | Engagement | Event Responders 365d", "Page engagement · event RSVP", "1,000–1,000 (populating)", "New, too small for now", "0", "0"],
    ["DAB | Engagement | Video Viewers 50pct 365d", "Page engagement · video", "1,000–1,000 (populating)", "New, too small for now", "0", "0"],
    ["DAB | Engagement | LAL 1% Page Engagers (US)", "Lookalike 1%", "1,000–1,000 (building)", "New, updating", "0", "0"],
    ["DAB | Reservations | LAL 1% Reserve-Clickers (US)", "Lookalike 1%", "1,000–1,000 (building)", "New, updating", "0", "0"],
    ["DAB | Sales | LAL 1% Purchasers (US)", "Lookalike 1%", "1,000–1,000 (building)", "New, likely stays too small", "0", "0"],
    ["DAB | Engagement | LAL 1% Event Responders (US)", "Lookalike 1%", "1,000–1,000 (building)", "New, updating", "0", "0"],
    ["BF · Lookalike 1% (email)", "Lookalike 1%", "2.1M–2.5M", "Ready, working", "2", "0"],
    ["BF · FB Page Engagers 365d", "Page engagement", "3,700–4,400", "Ready, working — duplicate of “FB Page Engagers – 365d (warm)”", "2", "1"],
    ["FB Page Engagers – 365d (warm)", "Page engagement", "3,600–4,300", "Ready, working — duplicate of “BF · FB Page Engagers 365d”", "20", "0"],
    ["BF · IG Engagers 365d", "Instagram engagement", "2,100–2,500", "Ready, working — duplicate of “Instagram Engagers – 365d”", "2", "1"],
    ["Instagram Engagers – 365d (Dabney)", "Instagram engagement", "3,500–4,100", "Ready, working — duplicate of “BF · IG Engagers 365d”", "20", "0"],
    ["BF · Email List (Brevo master)", "Customer list", "2,000–2,300", "Ready, working — overlaps Subscribers/Customers below", "2", "1"],
    ["Dabney — Customers (Brevo, synced)", "Customer list", "2,300–2,700", "Ready, working, syncing (updated most recently of all)", "20", "0"],
    ["Dabney — Subscribers (clean)", "Customer list", "2,000–2,400", "Ready, working", "20", "0"],
    ["Dabney — Regulars/VIP", "Customer list", "1,000–1,000", "Ready, unused", "0", "0"],
    ["Dabney — Lookalike 1% (Subscribers clean)", "Lookalike 1%", "2.2M–2.6M", "Ready, working — heaviest-used audience in the account", "19", "0"],
    ["FB Engagers – 14d (hot, this week)", "Page engagement, 14d", "1,000–1,000", "Ready, working — doubles as the event-night retargeting set", "1", "0"],
    ["BF · Site Visitors 30d", "Website · PageView", "20–20", "Ready, thin", "1", "1"],
    ["BF · Cart Abandoners 14d", "Website · InitiateCheckout minus Purchase", "20–20", "Ready, thin", "1", "0"],
    ["BF · Bluesfest Page 14d", "Website · page view", "20–20", "Ready, unused outside its own flight", "1", "0"],
    ["Shop Page Visitors – 90d", "Website", "20–20", "Stale — unused 30+ days / never used", "0", "0"],
    ["Event Page Visitors – 90d", "Website", "20–20", "Stale — unused 30+ days / never used", "0", "0"],
    ["Gift Card Page Visitors – 90d", "Website", "20–20", "Stale — unused 30+ days / never used", "0", "0"],
    ["Website Visitors – 180d", "Website", "20–20", "Stale — unused 30+ days / never used", "0", "0"],
    ["LAL 1% – Dabney — Regulars/VIP (US)", "Lookalike 1%", "— (broken)", "Broken — Meta: delete and recreate", "0", "0"],
    ["LAL 1% – Dabney — Customers (Brevo, synced) (US)", "Lookalike 1%", "— (broken)", "Broken — Meta: delete and recreate", "0", "0"],
    ["LAL 1% – Page Engagers (US)", "Lookalike 1%", "— (broken)", "Broken — Meta: delete and recreate", "0", "0"],
  ],
};

export const grades: { area: string; grade: string; was?: string; why: string }[] = [
  { area: "Purchase / sales seed", was: "F", grade: "C+", why: "Purchasers 365d and its lookalike now exist. Grade caps at C+ because real Purchase volume is still near zero (dabney-ads.ts: 0 Purchases across 12 campaigns) — the audience has almost nothing to learn from until capi-purchases.mjs has real Stripe/Toast volume to send." },
  { area: "Reservations seed and retargeting", was: "D", grade: "B", why: "Reserve-Click 180d and its lookalike now exist, matched to the Schedule event 29 of 69 recent ad sets already optimize on. Real volume is there — dabney-ads.ts counted 915 Schedule events in 30 days — so this should fill fast." },
  { area: "Engagement retargeting", was: "B−", grade: "B", why: "Page and IG engagers already worked; added Event Responders and Video Viewers 50%+ as the two missing engagement sources, plus a working lookalike replacing the broken legacy one. Both new sources start too-small and need a few days to populate." },
  { area: "Geo/demo targeting", was: "C", grade: "C", why: "No saved audience matches the account's own best-performing segment (women 25–54, 15mi — 0.55 RSVP/$ vs 0.37 for 65+). Building one is blocked at the API level this session; grade holds until it's built in Ads Manager." },
  { area: "Customer lists", was: "B", grade: "B", why: "Already covered — Regulars/VIP, Subscribers (clean), and two Brevo-sourced lists exist with consented, first-party data. Nothing new needed; the gap is dedup, not coverage." },
  { area: "Housekeeping", was: "D", grade: "D", why: "3 permanently broken lookalikes and 4 duplicate pairs sat in the account before this session and still do — creating audiences was authorized, deleting or renaming existing ones was not, so they're flagged, not touched." },
];

export const findings: { sev: Sev; area: string; t: string; d: string }[] = [
  {
    sev: "good",
    area: "Created",
    t: "Five rule-based audiences went live: Purchasers 365d, Reserve-Click 180d, Reserve-not-Purchased 180d, Event Responders 365d, Video Viewers 50%+ 365d.",
    d: "Each read back with an id and a delivery_status right after creation. The three Website ones show Meta's populate-floor of 20–20; the two Page-engagement ones already show 1,000–1,000 and are flagged “too small” until they fill — normal for audiences built minutes old.",
  },
  {
    sev: "good",
    area: "Created",
    t: "Four 1% US lookalikes went live, seeded from the new audiences and a working replacement for engagement.",
    d: "LAL 1% Page Engagers replaces the account's broken legacy Page-Engagers lookalike, seeded from the healthy “BF · FB Page Engagers 365d” source instead. LAL 1% Reserve-Clickers, LAL 1% Event Responders and LAL 1% Purchasers are new seeds with no prior lookalike.",
  },
  {
    sev: "fix",
    area: "Saved audience",
    t: "“Kalamazoo core — women 25–54, 15mi” could not be created: the API refused the call outright.",
    d: "POST act_24502732409351450/saved_audiences returned (#3) “Application does not have the capability to make this API call.” This is an app-level capability gate, not a token or targeting problem — the same request with corrected targeting JSON gets the identical error. None of the account's 6 existing saved audiences target this segment (all use 18–65 with no gender split, mostly a 30mi radius). Needs your call: build it once in Ads Manager (a 30-second click) and note it here, since the API path is closed.",
  },
  {
    sev: "fix",
    area: "Lookalikes",
    t: "Three existing lookalikes are permanently broken, not just small.",
    d: "“LAL 1% – Dabney — Regulars/VIP (US),” “LAL 1% – Dabney — Customers (Brevo, synced) (US)” and “LAL 1% – Page Engagers (US)” all report approximate_count −1 and operation_status “We couldn't create your lookalike audience. Please delete this audience and try creating it again.” None have recovered since creation. Not deleted this session (deletion wasn't authorized) — delete-and-recreate is the fix Meta itself names.",
  },
  {
    sev: "watch",
    area: "Duplicates",
    t: "Four audience pairs do the same job twice: Page engagers, IG engagers, and two Brevo-sourced customer lists.",
    d: "“BF · FB Page Engagers 365d” and “FB Page Engagers – 365d (warm)” are both a 365-day page_engaged rule at nearly identical size (3.7–4.4k vs 3.6–4.3k). Same pattern for the two IG-engager audiences and “BF · Email List (Brevo master)” against “Dabney — Subscribers (clean).” Splits reach and reporting across two audiences that should be one; not touched this session since consolidating means deleting one of each pair.",
  },
  {
    sev: "watch",
    area: "Stale",
    t: "Four Website audiences have sat unused for 30+ days or were never used, and all sit at Meta's 20-count floor.",
    d: "Shop Page Visitors –90d, Event Page Visitors –90d, Gift Card Page Visitors –90d and Website Visitors –180d all carry the “audience is out of date” delivery flag and 0 ad sets using them in the last 90 days. Low counts suggest thin traffic on those specific pages rather than a broken rule.",
  },
  {
    sev: "watch",
    area: "Sales event",
    t: "Zero of 87 ad sets optimize on Purchase, and this session's Purchasers audience has almost nothing to seed from yet.",
    d: "Matches the existing finding in dabney-ads.ts: 12 InitiateCheckouts and 8 ViewContents but 0 Purchases across 12 campaigns in 30 days. capi-purchases.mjs (scheduled 4x/day on arthur-dabney-cron) is the fix already in flight for Stripe; its Toast dine-in half still needs Daniel's Mac migrated to the cloud pull before in-store purchases without a Stripe trail reach Meta.",
  },
  {
    sev: "good",
    area: "Pixel",
    t: "Pixel 32226134143696687 (“Reservations”) is confirmed live and shared with this account, last fired Sept 27, 2026.",
    d: "Re-checked directly this session: GET 32226134143696687 resolves cleanly and owner_business matches Dabney & Co. Every new Website audience built off it targets real, currently-firing events (PageView, Schedule, InitiateCheckout, Purchase all already appear elsewhere in the account's rules).",
  },
];

export const model: { t: string; d: string }[] = [
  { t: "Every ad set picks one of three goals before it picks a placement.", d: "Engagement, Reservations, or Sales — the goal decides the optimization event, and the optimization event decides which audience row above applies. Mixing goals inside one ad set is how an account ends up with 23 ad sets on LANDING_PAGE_VIEWS and none on Purchase." },
  { t: "Prospecting and retargeting are always separate audiences, never the same one with a longer window.", d: "A 365-day engagement audience is not a substitute for a fresh interest-based prospecting audience — it just means the same 4,000 people see every ad. Reservations and Sales both need the Kalamazoo-core saved audience (once built) as their cold-prospecting layer." },
  { t: "Lookalikes only earn a grade once their seed has real volume, not once they exist.", d: "An LAL 1% created off 20 Purchasers is a coin flip Meta will call “too small” until Purchase volume is real. The Reservations lookalike, seeded off 915 Schedule events/30d worth of history, should clear that bar in days; the Sales one probably won't until capi-purchases.mjs has real Stripe checkouts to forward." },
  { t: "Exclusions run in the ad set, not baked into a fifth audience, except where Meta's own rule engine already supports it.", d: "Reserve-not-Purchased is the one case worth building as its own audience (Schedule minus Purchase, the same shape as the account's existing Cart Abandoners rule) because “scheduled but hasn't bought” is itself a sales-ready segment, not just an exclusion." },
];

export const fixes: { t: string; d: string; tag: "done" | "free" | "needs" | "money" }[] = [
  { tag: "done", t: "Built Purchasers 365d, Reserve-Click 180d, and Reserve-not-Purchased 180d.", d: "All three read back “ready for use” immediately after creation (ids 120261005211140370, …211220370, …211320370). Sizes show Meta's 20-count populate floor and will grow with real traffic over the next day or two." },
  { tag: "done", t: "Built Event Responders 365d and Video Viewers 50%+ 365d for the Engagement goal.", d: "Both accepted by the API (ids …211370370, …211820370) and already report a real starting count of 1,000, flagged too-small — expected for brand-new page-engagement audiences." },
  { tag: "done", t: "Built four 1% US lookalikes: Page Engagers (replacement), Reserve-Clickers, Purchasers, and Event Responders.", d: "All four created and “Updating” (ids …219570370, …219820370, …220400370, …220720370). The Purchasers one will most likely stay too-small until the seed does — tracked as an open item, not reported as working." },
  { tag: "needs", t: "Build the “Kalamazoo core — women 25–54, 15mi” saved audience in Ads Manager.", d: "The API refused it with (#3), an app-capability error, not a targeting or token problem. A 30-second manual build in Ads Manager is the only path; nothing here can do it for you." },
  { tag: "needs", t: "Delete and recreate the three permanently broken lookalikes.", d: "Meta's own message on all three: “We couldn't create your lookalike audience. Please delete this audience and try creating it again.” Deleting existing audiences wasn't authorized this session, so they're flagged, not removed." },
  { tag: "needs", t: "Decide whether to consolidate the four duplicate audience pairs.", d: "Page engagers, IG engagers, and two Brevo-sourced lists each exist twice at near-identical size. Keeping both halves reach and reporting; merging means picking one of each pair to delete." },
  { tag: "free", t: "Point new Reservations and Sales ad sets at the audiences built today once they clear the too-small flag.", d: "No spend needed — swapping an ad set's targeting to an existing lookalike or exclusion list is a targeting edit, which this session didn't make and didn't need to; it's the natural next step once sizes fill in." },
];

export const method: string[] = [
  "Meta Marketing API v21.0, act_24502732409351450 (Dabney & Co.), Sept 28, 2026: GET customaudiences (fields subtype, rule, retention_days, approximate_count_lower/upper_bound, delivery_status, operation_status, time_updated) — 21 returned before this session, 30 after.",
  "GET adsets (fields targeting, optimization_goal, promoted_object, updated_time) across all 87 ad sets on the account; 69 had updated_time within the last 90 days and are the ones scored for usage above.",
  "GET saved_audiences — 6 returned, none matching a women 25–54 / 15mi Kalamazoo segment.",
  "GET 32226134143696687 (pixel “Reservations”) — confirmed shared with the Dabney & Co. business, last_fired_time Sept 27, 2026.",
  "POST customaudiences × 5 (rule-based) and × 4 (origin_audience_id lookalikes); every response's id and delivery_status quoted above came from a follow-up GET on that id, not from the creation response alone.",
  "POST saved_audiences × 1 — refused with error code 3, quoted verbatim above.",
  "Cross-referenced against src/content/hub/dabney-ads.ts (women 25–54 vs 65+ RSVP/$, FB in-stream waste, Schedule/Purchase tracking findings) and the interest-id list and audience ids in ~/arthur/scripts/build-live-event-campaign.mjs.",
  "No campaign, ad set, ad, or budget was created, activated, or changed. Every write in this session was an audience-creation POST.",
];
