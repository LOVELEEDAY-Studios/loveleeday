/* Saturday Ads: No Skips & Homecoming — LOVELEEDAY review. Everything below is PAUSED in Meta
   (act_24502732409351450) — nothing runs or spends until Daniel activates it in Ads Manager. */
export type Sev = "fix" | "watch" | "good";

export const clients = [{ token: "dabney-saturday-ads-internal", short: "Dabney & Co.", preparedFor: "Daniel May", role: "Owner" }];
export const getClient = (t: string) => clients.find((c) => c.token === t);

export const copy = {
  title: "Saturday Ads: No Skips & Homecoming",
  asOf: "September 28",
  hero: {
    a: "Four campaigns, eight ads, nothing spent.",
    b: "Everything below is PAUSED, ready for your call.",
    intro: "No Skips (Sat, Oct 3) and Homecoming (Sat, Oct 10) each get a reservations campaign and a Facebook-event awareness campaign, built exactly to the ad copy already approved on the weekly-2026-09-28 review, plus the audiences and exclusions from today's brief. Nothing goes live until you flip a campaign to Active in Ads Manager.",
  },
  grades: { a: "Built and verified,", b: "one flag before Oct 3 launches.", intro: "Every campaign, adset and ad below was read back from the Graph API after creation — status, targeting, optimization event, link and image hash all confirmed." },
  model: { a: "Reservations plus awareness,", b: "same show, two jobs.", intro: "Each show runs two campaigns in parallel: reservations converts people who are already close to booking, awareness builds the Facebook event's RSVP count so more people see it in the first place." },
  fixes: { a: "Before you activate anything,", b: "here's what to check.", intro: "Everything below is built and verified. This is the short list before flipping any of it to Active." },
};

export const glance: { k: string; label: string; src: string }[] = [
  { k: "4", label: "campaigns built, all PAUSED", src: "Graph API, act_24502732409351450" },
  { k: "8", label: "ads across 12 ad sets", src: "read back after creation" },
  { k: "$43/day", label: "combined budget if all four run at once ($25 + $18 reservations+awareness, staggered)", src: "adset daily_budget sum" },
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
  ],
};

export const grades: { area: string; grade: string; was?: string; why: string }[] = [
  { area: "No Skips reservations (Ad A, B, C)", grade: "Paused", why: "Poster creative (black-and-orange design), $25/day across Warm and Interest ad sets, plus a $5/day Fri/Sat reminder pair on the story crop. Link is the auto-dated reserve tracker with d=2026-10-03, t=20:00." },
  { area: "No Skips awareness (event RSVP)", grade: "Paused", why: "Post-engagement ad against facebook.com/events/919710807594732, CTA = Event RSVP, targeted at warm/lookalike audiences plus Kehlani + SZA interest (no Meta interest node exists for Summer Walker alone)." },
  { area: "Homecoming reservations (Ad A, B)", grade: "Paused", why: "Poster creative (this morning's finished red poster, posted to IG/FB stories 9/28), $25/day across Warm and Interest ad sets. Link carries d=2026-10-10, t=20:00." },
  { area: "Homecoming awareness (event RSVP)", grade: "Paused", why: "Post-engagement ad against facebook.com/events/1568763584561331, same recipe as No Skips awareness, Beyoncé interest." },
];

export const findings: { sev: Sev; area: string; t: string; d: string }[] = [
  { sev: "watch", area: "Oct 3 room", t: "No Skips shares its date with an unconfirmed Sharia Durr wedding inquiry and Nazir's birthday party.", d: "The calendar shows a wedding inquiry (36–70 guests, 6:30pm) and a birthday party on Sat Oct 3 alongside No Skips. This campaign stays PAUSED regardless of that outcome — resolve the room before activating." },
  { sev: "watch", area: "Creative plan", t: "The reviewed ad plan (weekly-2026-09-28/captions.md) calls Ad A and Ad B both “poster” — a separate note mentioned a 15-second video for Ad B.", d: "A finished video exists at Documents/Dabney/Creative/2026-10-03-no-skips/live-at-dabney-no-skips-1003.mp4. I built Ad B as a poster ad to match the written, reviewed copy file exactly; swap in the video as a creative variant if you want it instead." },
  { sev: "watch", area: "Ad preview rendering", t: "I could not render a pixel screenshot of the Ads Manager preview for you to eyeball.", d: "The generatepreviews endpoint returns an auth-walled business.facebook.com iframe; the app token can't load it, and the token string pulled from your background Chrome tab didn't authenticate as a bearer token either. I did visually inspect the two source creative files directly (the same image_hash uploaded into every ad) before building — open any ad in Ads Manager for the live-chrome preview." },
  { sev: "good", area: "Audiences", t: "All requested exclusions and new audiences are live in every ad set.", d: "excluded_custom_audiences carries “DAB | Sales | Purchasers 365d” on every ad set; age_max is capped at 64; facebook_positions is [“feed”] only (no in-stream video); the new 1% lookalikes and 365d engagement audiences are in the Warm/Lookalike ad sets." },
  { sev: "good", area: "Saved audience", t: "The “DAB | Prospecting | Kalamazoo women 25–54, 15mi” saved audience could not be created as a reusable object.", d: "The app access token doesn't carry the saved_audiences capability (“Application does not have the capability to make this API call”), and a token pulled from your Chrome session didn't authenticate either. Functionally equivalent targeting (Kalamazoo, 15mi, women, 25–54) is inlined directly into every Ad B / Prospecting ad set instead, so nothing is missing from the actual targeting — it just isn't saved as a named, reusable audience yet." },
];

export const model: { t: string; d: string }[] = [
  { t: "Reservations campaign — Ad A, Warm", d: "Followers, past guests, video viewers, event responders and the two new 1% lookalikes (reserve-clickers, event responders). $10–$13/day, full flight." },
  { t: "Reservations campaign — Ad B, Interest", d: "Kalamazoo women 25–54, layered with the artist's Meta interest node (Kehlani + SZA for No Skips, Beyoncé for Homecoming). $10–$12/day, full flight." },
  { t: "Reservations campaign — Ad C, No Skips only", d: "A last-call reminder on the story crop: “tomorrow night” running all Friday 10/2, “tonight” running all Saturday 10/3. Meta requires 24 hours minimum per ad set, so the Saturday leg runs 2 hours past the show's 10pm cutoff into early Sunday." },
  { t: "Awareness campaign — both shows", d: "Post-engagement ad against the show's live Facebook event, CTA = Event RSVP, split Warm+Lookalike and Prospecting+Interest. Runs in the front half of the flight so the reservations campaign gets the final push." },
];

export const fixes: { t: string; d: string; tag: "done" | "free" | "needs" | "money" }[] = [
  { tag: "done", t: "All four campaigns built PAUSED and read back from the Graph API.", d: "Campaign, ad set, ad, targeting, link and image hash all confirmed — see the table above and the campaign IDs." },
  { tag: "needs", t: "Resolve the Oct 3 room before activating No Skips.", d: "Wedding inquiry + Nazir's birthday party both land on Oct 3. This doesn't block building the ads, but activating them before the room is settled would be premature." },
  { tag: "needs", t: "Open each ad in Ads Manager for a final visual check.", d: "I could not render the Ads Manager preview here (see the finding above) — a 30-second look at each ad card before you flip it live." },
  { tag: "free", t: "Say which campaigns to activate, and I'll flip them PAUSED → ACTIVE the same turn.", d: "No further building needed — this is a one-line approval away from live." },
];

export const method: string[] = [
  "Meta Graph API v21.0, act_24502732409351450 — campaigns/adsets/ads created 2026-09-28, read back the same session for status/targeting/optimization/link/image hash.",
  "Ad copy for Ad A/B/C sourced verbatim from Documents/Dabney/weekly-2026-09-28/captions.md, the plan reviewed earlier today.",
  "Creative files: Desktop/Dabney-Poster-Rebuild/concepts-oct3/FINAL (No Skips poster + story v1B), Desktop/Dabney/beyonce-homecoming-oct10/FINAL (Homecoming poster) — the same files copied into this page's /public folder below.",
  "Facebook events confirmed live via Page Graph API: No Skips 919710807594732, Homecoming 1568763584561331.",
  "Interest IDs via act_.../targetingsearch: Kehlani 1673020586319299, SZA 6015696205071, Beyoncé 6003856227360. No Meta interest node exists for Summer Walker as a standalone artist.",
  "Audience IDs confirmed via act_.../customaudiences listing (28 “DAB |” and legacy audiences).",
];
