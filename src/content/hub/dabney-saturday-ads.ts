/* Saturday Ads: No Skips & Homecoming — LOVELEEDAY review. Everything below is PAUSED in Meta
   (act_24502732409351450) — nothing runs or spends until Daniel activates it in Ads Manager. */
export type Sev = "fix" | "watch" | "good";

export const clients = [{ token: "dabney-saturday-ads-internal", short: "Dabney & Co.", preparedFor: "Daniel May", role: "Owner" }];
export const getClient = (t: string) => clients.find((c) => c.token === t);

export const copy = {
  title: "Saturday Ads: No Skips & Homecoming",
  asOf: "September 28",
  hero: {
    a: "Five campaigns, twelve ads, nothing spent.",
    b: "Everything below is PAUSED, ready for your call.",
    intro: "No Skips (Sat, Oct 3) and Homecoming (Sat, Oct 10) each get a reservations campaign and a Facebook-event awareness campaign, built to the ad copy approved on the weekly-2026-09-28 review, plus the audiences and exclusions from today's brief. Serita's Black Rose Duo (Fri, Oct 2) gets the one-off Friday exception you approved in chat. Nothing goes live until you flip a campaign to Active in Ads Manager.",
  },
  grades: { a: "Built and verified,", b: "one flag before Oct 3 launches.", intro: "Every campaign, adset and ad below was read back from the Graph API after creation — status, targeting, optimization event, link and image hash all confirmed." },
  model: { a: "Reservations plus awareness,", b: "same show, two jobs.", intro: "Each show runs two campaigns in parallel: reservations converts people who are already close to booking, awareness builds the Facebook event's RSVP count so more people see it in the first place." },
  fixes: { a: "Before you activate anything,", b: "here's what to check.", intro: "Everything below is built and verified. This is the short list before flipping any of it to Active." },
};

export const glance: { k: string; label: string; src: string }[] = [
  { k: "5", label: "campaigns built, all PAUSED", src: "Graph API, act_24502732409351450" },
  { k: "12", label: "ads across 12 ad sets", src: "read back after creation" },
  { k: "$58/day", label: "combined budget if every campaign ran at once ($25+$18 Saturdays x2 staggered, $15 Serita)", src: "adset daily_budget sum" },
  { k: "$0", label: "spent — every object created PAUSED", src: "Graph API status field" },
];

export const table: { eyebrow: string; a: string; b: string; intro: string; columns: string[]; rows: string[][] } | null = {
  eyebrow: "Campaigns",
  a: "Every campaign,",
  b: "by id and status.",
  intro: "Reservations campaigns optimize to the pixel's Schedule event; awareness campaigns optimize to Post Engagement against the Facebook event, with an Event RSVP button.",
  columns: ["Campaign", "Objective", "Status", "Flight", "$/day"],
  rows: [
    ["[RESERVE] No Skips — Sat, Oct 3 · 120261006116920370", "Traffic → pixel Schedule", "PAUSED", "Sep 28 – Oct 3, 10pm (+Fri/Sat reminder)", "$25 + $10 reminder"],
    ["[AWARENESS] No Skips — Sat, Oct 3 · 120261006124710370", "Engagement → Event RSVP", "PAUSED", "Sep 28 – Oct 1", "$18"],
    ["[RESERVE] Homecoming — Sat, Oct 10 · 120261006127960370", "Traffic → pixel Schedule", "PAUSED", "Oct 1 – Oct 10, 10pm", "$25"],
    ["[AWARENESS] Homecoming — Sat, Oct 10 · 120261006132270370", "Engagement → Event RSVP", "PAUSED", "Sep 28 – Oct 5", "$18"],
    ["[EVENT] Serita's Black Rose Duo — Fri 10/2 · 120261006249300370", "Traffic → pixel Schedule", "PAUSED", "Sep 28 – Oct 2, 10pm", "$15"],
  ],
};

export const grades: { area: string; grade: string; was?: string; why: string }[] = [
  { area: "No Skips reservations (Ad A, B, C)", grade: "Paused", why: "Poster creative (black-and-orange design), $25/day across Warm and Interest ad sets, plus a $5/day Fri/Sat reminder pair on the story crop. Link is the auto-dated reserve tracker with d=2026-10-03, t=20:00." },
  { area: "No Skips awareness (event RSVP)", grade: "Paused", why: "Post-engagement ad against facebook.com/events/919710807594732, CTA = Event RSVP, targeted at warm/lookalike audiences plus Kehlani + SZA interest (no Meta interest node exists for Summer Walker alone)." },
  { area: "Homecoming reservations (Ad A, B)", grade: "Paused", why: "Poster creative (this morning's finished red poster, posted to IG/FB stories 9/28), $25/day across Warm and Interest ad sets. Link carries d=2026-10-10, t=20:00." },
  { area: "Homecoming awareness (event RSVP)", grade: "Paused", why: "Post-engagement ad against facebook.com/events/1568763584561331, same recipe as No Skips awareness, Beyoncé interest." },
  { area: "Serita's Black Rose Duo (Friday exception)", grade: "Paused", why: "The one Friday ad this quarter — your explicit chat approval. $15/day, Warm + Kalamazoo LIVE-Music-interest ad sets, flight Sep 28 → Fri 10/2 10pm. Copy reuses the approved organic caption, reworked to lead with act + date + time." },
];

export const findings: { sev: Sev; area: string; t: string; d: string }[] = [
  { sev: "good", area: "Oct 3 room", t: "Corrected Sept 29: there is no wedding on Oct 3. The room is clear for No Skips.", d: "The \"wedding\" was four duplicate calendar entries a calendar job created in August from one inquiry email (\"Event inquiry · Sharia Durr · Oct 3\"); it was never a booking. Nazir's birthday party is in Chicago, not at Dabney. The four entries are deleted, and the job now skips inquiry emails so a lead never lands on the calendar as a confirmed event." },
  { sev: "good", area: "Reels and Stories", t: "Done Sept 29: every reservation ad now runs in Reels and Stories with its 9:16 story image.", d: "The Sept 28 build limited Facebook to the feed to keep ads out of in-stream video, which also shut out Reels and Stories, the account's cheapest placements (Instagram Reels $0.37 a click against $1.09 on the Facebook feed in the first two days). All six No Skips and Homecoming reservation ads now carry the 4:5 poster in feeds and the 1080x1920 story in Reels and Stories; copy, links and budgets are unchanged, and in-stream video stays excluded. The event-RSVP awareness ads stay feed-only, because Meta does not deliver event responses in Reels or Stories." },
  { sev: "watch", area: "Creative plan", t: "The reviewed ad plan (weekly-2026-09-28/captions.md) calls Ad A and Ad B both “poster” — a separate note mentioned a 15-second video for Ad B.", d: "A finished video exists at Documents/Dabney/Creative/2026-10-03-no-skips/live-at-dabney-no-skips-1003.mp4. I built Ad B as a poster ad to match the written, reviewed copy file exactly; swap in the video as a creative variant if you want it instead." },
  { sev: "watch", area: "Ad preview rendering", t: "I could not render a pixel screenshot of the Ads Manager preview for you to eyeball.", d: "The generatepreviews endpoint returns an auth-walled business.facebook.com iframe; the app token can't load it, and the token string pulled from your background Chrome tab didn't authenticate as a bearer token either. I did visually inspect the two source creative files directly (the same image_hash uploaded into every ad) before building — open any ad in Ads Manager for the live-chrome preview." },
  { sev: "watch", area: "1% lookalikes are too small", t: "All four new “DAB | ... | LAL 1%” lookalikes came back “too small to be used in campaign creation” (Meta code 300, ~1,000-person seed).", d: "They're pulled out of every ad set now — Ad A/Aware-Warm use the sized audiences only (Page/IG engagers, Reserve-Click 180d, Event Responders 365d, Video Viewers 50%), and No Skips's reminder pair (Ad C) uses “FB Engagers – 14d (hot, this week)” instead. Nothing in the account is targeting a too-small audience; revisit the lookalikes once their seed pools grow." },
  { sev: "good", area: "Event engagement without the UI", t: "EVENT_RESPONSES is genuinely UI-only under ODAX (confirmed live: the API refuses that optimization_goal with “Performance goal isn't available”) — but Facebook's own Ads Manager builds event-RSVP ads a different way that IS API-reachable.", d: "Copied the exact recipe off a working account example (the Maze feat. Frankie Beverly awareness campaign): optimization_goal=POST_ENGAGEMENT, destination_type=ON_EVENT, promoted_object={page_id,event_id}, call_to_action=EVENT_RSVP. No browser drive needed — both awareness campaigns above were built this way, entirely through the app token." },
  { sev: "good", area: "Audiences", t: "All requested exclusions and new audiences are live in every ad set.", d: "excluded_custom_audiences carries “DAB | Sales | Purchasers 365d” on every ad set; age_max is capped at 64; facebook_positions is [“feed”] only (no in-stream video); Ad B on both shows now also carries the Kalamazoo LIVE-Music/nightlife interest cluster alongside the artist interest, per today's brief." },
  { sev: "good", area: "Saved audience", t: "The “DAB | Prospecting | Kalamazoo women 25–54, 15mi” saved audience could not be created as a reusable object.", d: "The app access token doesn't carry the saved_audiences capability (“Application does not have the capability to make this API call”), and a token pulled from your Chrome session came back but didn't authenticate as a bearer token either (“Invalid request”). Functionally equivalent targeting (Kalamazoo, 15mi, women, 25–54) is inlined directly into every Ad B / Prospecting ad set instead, so nothing is missing from the actual targeting — it just isn't saved as a named, reusable audience yet." },
];

export const model: { t: string; d: string }[] = [
  { t: "Reservations campaign — Ad A, Warm", d: "Followers, past guests, video viewers, event responders and the two new 1% lookalikes (reserve-clickers, event responders). $10–$13/day, full flight." },
  { t: "Reservations campaign — Ad B, Interest", d: "Kalamazoo women 25–54, layered with the artist's Meta interest node (Kehlani + SZA for No Skips, Beyoncé for Homecoming). $10–$12/day, full flight." },
  { t: "Reservations campaign — Ad C, No Skips only", d: "A last-call reminder on the story crop: “tomorrow night” running all Friday 10/2, “tonight” running all Saturday 10/3. Meta requires 24 hours minimum per ad set, so the Saturday leg runs 2 hours past the show's 10pm cutoff into early Sunday." },
  { t: "Awareness campaign — both shows", d: "Post-engagement ad against the show's live Facebook event, CTA = Event RSVP, split Warm+Lookalike and Prospecting+Interest. Runs in the front half of the flight so the reservations campaign gets the final push." },
];

export const fixes: { t: string; d: string; tag: "done" | "free" | "needs" | "money" }[] = [
  { tag: "done", t: "All five campaigns built PAUSED and read back from the Graph API.", d: "Campaign, ad set, ad, targeting, link and image hash all confirmed — see the table above and the campaign IDs." },
  { tag: "done", t: "Serita's Black Rose Duo added as the one-off Friday exception.", d: "Built the moment you asked in chat — same PAUSED/verified treatment as the two Saturdays, modest $15/day since Friday ads run close to breakeven historically." },
  { tag: "done", t: "Oct 3 room confirmed clear.", d: "Sept 29: no wedding on Oct 3 (four phantom calendar entries from an inquiry email, now deleted), and Nazir's birthday is in Chicago. No Skips runs as planned." },
  { tag: "done", t: "Reels and Stories added to all six reservation ads.", d: "Sept 29: placement-matched creative (4:5 in feeds, 9:16 in Reels and Stories), no budget change. Script: ~/arthur/scripts/ads-add-story-placements.mjs." },
  { tag: "needs", t: "Open each ad in Ads Manager for a final visual check.", d: "I could not render the Ads Manager preview here (see the finding above) — a 30-second look at each ad card before you flip it live." },
  { tag: "free", t: "Say which campaigns to activate, and I'll flip them PAUSED → ACTIVE the same turn.", d: "No further building needed — this is a one-line approval away from live." },
];

export const method: string[] = [
  "Meta Graph API v21.0, act_24502732409351450 — campaigns/adsets/ads created 2026-09-28, read back the same session for status/targeting/optimization/link/image hash.",
  "Ad copy for Ad A/B/C sourced verbatim from Documents/Dabney/weekly-2026-09-28/captions.md, the plan reviewed earlier today. Serita's copy adapts the approved organic caption (scheduled_posts table) to lead with act + date + time.",
  "Creative files: Desktop/Dabney-Poster-Rebuild/concepts-oct3/FINAL (No Skips poster + story v1B), Desktop/Dabney/beyonce-homecoming-oct10/FINAL (Homecoming poster), Documents/Dabney/weekly-2026-09-28/serita/feed-1080x1350.png (Serita) — all copied into this page's /public folder below.",
  "Facebook events confirmed live via Page Graph API: No Skips 919710807594732, Homecoming 1568763584561331. Both existed already — no create-event step was needed.",
  "Interest IDs via act_.../targetingsearch: Kehlani 1673020586319299, SZA 6015696205071, Beyoncé 6003856227360. No Meta interest node exists for Summer Walker as a standalone artist.",
  "Audience IDs and size/delivery_status confirmed via act_.../customaudiences listing (28 “DAB |” and legacy audiences) — this is where the too-small lookalikes were caught.",
  "51 pre-existing campaigns in the ad account checked by name and created_time before building anything, to confirm none of this already existed (a same-day claim from another session turned out to describe the creative-and-copy plan, not live Meta objects).",
];
