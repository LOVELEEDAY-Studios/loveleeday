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
    b: "Nine built, two deleted, one saved audience still stuck.",
    intro:
      "Every custom audience, lookalike, saved audience and the targeting on all 87 ad sets (any status), read live from the Meta Marketing API on act_24502732409351450. The account already has real audiences — engagers, a Brevo list, one working lookalike — but nothing built for a Purchase, nothing for a reservation click, and no audience organized around the three things ads actually need to do here: get someone engaged, get them to reserve, get them to buy. A follow-up pass deleted the two audiences that were both broken and unused everywhere, and left alone everything a live or reactivatable ad set still depends on.",
  },
  grades: { a: "Where each audience type stood,", b: "and where it stands now.", intro: "Struck-through grade is before this session; the bold one is after today's builds. Saved audiences and event-response audiences are graded on what the API allows, not what would be ideal." },
  model: { a: "One audience set per goal,", b: "matched to the event the ad set optimizes on.", intro: "Four rules for how the account's audiences should fit together, given what's already built and what still needs a human." },
  fixes: { a: "Eleven done,", b: "five still need a decision.", intro: "Every build and delete below has an id read back from the Meta API before and after. What's left needs either Ads Manager (the saved audience), a live ad set repointed first (the two duplicate pairs), or a straight answer on which Brevo list is really which." },
};

export const glance: { k: string; label: string; src: string }[] = [
  { k: "21 → 28", label: "Custom + lookalike audiences: 30 after Monday's builds, 28 after deleting 2 confirmed-dead lookalikes.", src: "Meta Marketing API, customaudiences, Sept 28" },
  { k: "9", label: "New audiences created this session — 5 rule-based, 4 lookalikes.", src: "This session's customaudiences POSTs" },
  { k: "2 of 3", label: "Broken lookalikes deleted (zero ad sets referenced them, any status). The third stays: 5 paused ad sets still reference it.", src: "DELETE customaudiences × 2 + full 87-ad-set reference check" },
  { k: "0 of 4", label: "Duplicate pairs consolidated — one live ad set depends on both “older” copies flagged for deletion; a third pair turned out to be 3 lists, not 2. All skipped, none touched.", src: "87-ad-set targeting scan, any status" },
  { k: "1", label: "Saved audience still blocked: the app has no API permission, and the UI build wasn't driven this round — see findings.", src: "POST act_.../saved_audiences → (#3)" },
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
    ["FB Page Engagers – 365d (warm)", "Page engagement", "3,600–4,300", "Kept — 1 ACTIVE + 25 paused ad sets depend on it, incl. the ad set this is duplicated against", "26", "0"],
    ["BF · IG Engagers 365d", "Instagram engagement", "2,100–2,500", "Ready, working — duplicate of “Instagram Engagers – 365d”", "2", "1"],
    ["Instagram Engagers – 365d (Dabney)", "Instagram engagement", "3,500–4,100", "Kept — 1 ACTIVE + 19 paused ad sets depend on it, incl. the ad set this is duplicated against", "20", "0"],
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
    ["LAL 1% – Dabney — Regulars/VIP (US)", "Lookalike 1%", "— (deleted)", "Deleted Sept 28 — zero references, confirmed gone", "0", "0"],
    ["LAL 1% – Dabney — Customers (Brevo, synced) (US)", "Lookalike 1%", "— (deleted)", "Deleted Sept 28 — zero references, confirmed gone", "0", "0"],
    ["LAL 1% – Page Engagers (US)", "Lookalike 1%", "— (broken)", "Broken, kept — 5 paused ad sets still reference it", "5", "0"],
  ],
};

export const grades: { area: string; grade: string; was?: string; why: string }[] = [
  { area: "Purchase / sales seed", was: "F", grade: "C+", why: "Purchasers 365d and its lookalike now exist. Grade caps at C+ because real Purchase volume is still near zero (dabney-ads.ts: 0 Purchases across 12 campaigns) — the audience has almost nothing to learn from until capi-purchases.mjs has real Stripe/Toast volume to send." },
  { area: "Reservations seed and retargeting", was: "D", grade: "B", why: "Reserve-Click 180d and its lookalike now exist, matched to the Schedule event 29 of 69 recent ad sets already optimize on. Real volume is there — dabney-ads.ts counted 915 Schedule events in 30 days — so this should fill fast." },
  { area: "Engagement retargeting", was: "B−", grade: "B", why: "Page and IG engagers already worked; added Event Responders and Video Viewers 50%+ as the two missing engagement sources, plus a working lookalike replacing the broken legacy one. Both new sources start too-small and need a few days to populate." },
  { area: "Geo/demo targeting", was: "C", grade: "C", why: "No saved audience matches the account's own best-performing segment (women 25–54, 15mi — 0.55 RSVP/$ vs 0.37 for 65+). Building one is blocked at the API level this session; grade holds until it's built in Ads Manager." },
  { area: "Customer lists", was: "B", grade: "B", why: "Already covered — Regulars/VIP, Subscribers (clean), and two Brevo-sourced lists exist with consented, first-party data. Nothing new needed; the gap is dedup, not coverage." },
  { area: "Housekeeping", was: "D", grade: "C−", why: "2 of 3 broken lookalikes are gone — deleted and confirmed after checking they had zero references anywhere on the account. The third stays live (5 paused ad sets reference it) and none of the 3 duplicate candidates were consolidated: an ACTIVE ad set depends on both flagged Page/IG-engager copies, and the Brevo “pair” turned out to be three lists with no confirmed duplicate among them." },
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
    t: "“DAB | Prospecting | Kalamazoo women 25–54, 15mi” still doesn't exist — the API refuses it, and it wasn't driven through the UI this round either.",
    d: "POST act_24502732409351450/saved_audiences returned (#3) “Application does not have the capability to make this API call” — an app-level capability gate, not a token or targeting problem. Building it instead through Ads Manager's UI would mean driving either a headless authenticated Meta browser session (none exists yet — no stored session was found) or Daniel's own signed-in Chrome via OS-level keystrokes on his live desktop. Both are real actions on a live production ad account; this session did the read-only legwork (confirmed no saved audience covers this segment; researched the Audiences UI path) but held off on actually driving either browser without Daniel confirming directly in this thread that now is a good time — a relayed “approved” note isn't the same as him being at the keyboard. Fastest path: a 30-second manual build in Ads Manager, or say go-ahead here and it'll be driven headless.",
  },
  {
    sev: "good",
    area: "Lookalikes",
    t: "Two of the three permanently broken lookalikes are deleted. The third stays — live ad sets still reference it.",
    d: "“LAL 1% – Dabney — Regulars/VIP (US)” (120257408917880370) and “LAL 1% – Dabney — Customers (Brevo, synced) (US)” (120257402644970370) were referenced by zero ad sets of any status, so both were deleted and confirmed gone by a follow-up GET (“does not exist”) and a fresh customaudiences list (30 → 28). “LAL 1% – Page Engagers (US)” (120256126580060370) is still referenced by 5 paused ad sets (Cocktail Classes, Private Events, Takeout retargeting, Memberships warm, Reservations) — paused can be reactivated, so per the standing rule (skip if any ad set references it) this one was left alone, not deleted.",
  },
  {
    sev: "watch",
    area: "Duplicates",
    t: "Zero of the flagged duplicate pairs were consolidated — checking references changed the picture on two of them, and a third wasn't a clean pair.",
    d: "The “older” Page-Engagers audience (“FB Page Engagers – 365d (warm),” 120256126579250370) and the “older” IG-Engagers audience (“Instagram Engagers – 365d (Dabney),” 120243349890970370) are both still used by one currently ACTIVE ad set (“Warm — Page+IG engagers, Subscribers, Customers,” 120260990445470370) plus 19–25 paused/campaign-paused ones each — deleting either would pull an audience out from under a live ad set, so neither was touched. The Brevo-list “pair” turned out to be three lists (BF · Email List (Brevo master), Dabney — Customers (Brevo, synced), Dabney — Subscribers (clean)), each a plausibly distinct segment, not two copies of one — there's no clearly-older duplicate to delete without risking a real customer list. All three duplicate candidates are still flagged in the table below; none were deleted this round.",
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
  { tag: "done", t: "Deleted the 2 broken lookalikes nothing referenced.", d: "“LAL 1% – Dabney — Regulars/VIP (US)” (120257408917880370) and “LAL 1% – Dabney — Customers (Brevo, synced) (US)” (120257402644970370) — both zero-use across all 87 ad sets, both DELETE'd, both confirmed gone by a follow-up GET and a fresh customaudiences count (30 → 28)." },
  { tag: "needs", t: "The third broken lookalike is still live — it's used by 5 paused ad sets.", d: "“LAL 1% – Page Engagers (US)” (120256126580060370) can't be deleted without your call: those 5 ad sets (Cocktail Classes, Private Events, Takeout retargeting, Memberships warm, Reservations) are paused, not archived, and could be turned back on. Say the word if they're truly dead and it'll go." },
  { tag: "needs", t: "The Page-Engagers and IG-Engagers duplicate pairs can't be consolidated as asked — one currently ACTIVE ad set depends on both “older” copies.", d: "“Warm — Page+IG engagers, Subscribers, Customers” (120260990445470370) is live right now and targets both 120256126579250370 and 120243349890970370 — the two audiences flagged for deletion. Deleting either breaks that ad set's targeting today. Consolidating means either pointing that ad set at the newer duplicates first (a targeting edit, out of scope this session) or leaving both copies as-is." },
  { tag: "needs", t: "The Brevo “duplicate” is really three lists, not two — needs you to say which are actually the same people.", d: "BF · Email List (Brevo master), Dabney — Customers (Brevo, synced), and Dabney — Subscribers (clean) are all Brevo-sourced and similarly sized (2.0k–2.7k), but nothing here confirms which, if any, are exact duplicates versus genuinely different segments (e.g. a cleaned subset). Deleting the wrong one destroys a real customer list — flagged, not guessed at." },
  { tag: "needs", t: "Build “DAB | Prospecting | Kalamazoo women 25–54, 15mi” in Ads Manager.", d: "The API still refuses it with (#3), an app-capability error. Driving it through the UI needs either a headless authenticated Meta session (none exists) or your live Chrome — held off on both without you confirming directly that now's the time; a 30-second manual build is the fastest path if you'd rather just do it." },
  { tag: "free", t: "Point new Reservations and Sales ad sets at the audiences built today once they clear the too-small flag.", d: "No spend needed — swapping an ad set's targeting to an existing lookalike or exclusion list is a targeting edit, which this session didn't make and didn't need to; it's the natural next step once sizes fill in." },
];

export const method: string[] = [
  "Meta Marketing API v21.0, act_24502732409351450 (Dabney & Co.), Sept 28, 2026: GET customaudiences (fields subtype, rule, retention_days, approximate_count_lower/upper_bound, delivery_status, operation_status, time_updated) — 21 returned before this session, 30 after.",
  "GET adsets (fields targeting, optimization_goal, promoted_object, updated_time) across all 87 ad sets on the account; 69 had updated_time within the last 90 days and are the ones scored for usage above.",
  "GET saved_audiences — 6 returned, none matching a women 25–54 / 15mi Kalamazoo segment.",
  "GET 32226134143696687 (pixel “Reservations”) — confirmed shared with the Dabney & Co. business, last_fired_time Sept 27, 2026.",
  "POST customaudiences × 5 (rule-based) and × 4 (origin_audience_id lookalikes); every response's id and delivery_status quoted above came from a follow-up GET on that id, not from the creation response alone.",
  "POST saved_audiences × 1 — refused with error code 3, quoted verbatim above; not retried through Ads Manager's UI this round (see findings).",
  "GET adsets a second time, unfiltered by date and including every effective_status, specifically to check the 3 broken lookalikes and the 3 duplicate-candidate audiences for live references before deleting anything.",
  "DELETE customaudiences × 2 (the two confirmed zero-reference broken lookalikes), each followed by a GET on the same id (returned “does not exist”) and a fresh customaudiences list (30 → 28) as proof.",
  "Cross-referenced against src/content/hub/dabney-ads.ts (women 25–54 vs 65+ RSVP/$, FB in-stream waste, Schedule/Purchase tracking findings) and the interest-id list and audience ids in ~/arthur/scripts/build-live-event-campaign.mjs.",
  "No campaign, ad set, ad, or budget was created, activated, or changed, and no live ad set's targeting was edited. The only writes this session: 9 audience-creation POSTs and 2 audience DELETEs, both confirmed unused by any ad set of any status before deleting.",
];
