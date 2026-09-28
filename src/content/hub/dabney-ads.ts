/* INTERNAL Dabney ads & performance analysis on the hub template (local only, not deployed: it carries revenue).
   Numbers: ~/arthur/scripts/meta-ads-history.mjs + dabney-ads-analysis.mjs, built September 25, 2026. */

export const adsClients = [
  { token: "dabney-ads-internal", short: "Dabney & Co.", preparedFor: "Daniel May", role: "Founder" },
];
export const getAdsClient = (token: string) => adsClients.find((c) => c.token === token);

export const headline = [
  { k: "+$2,080", label: "A named, themed Saturday over a plain one: $3,869 against $1,789 net, on about $271 of ads.", src: "15 themed vs 40 no-paid-ads Saturdays, Toast" },
  { k: "$4,770", label: "The average Dabney After Dark Saturday, across eight of them, $3,587 to $5,616.", src: "Toast net, Sept 2025 – Aug 2026" },
  { k: "+$294", label: "What ads add to a Friday, where 42% of all spend went. Friday fills on its own.", src: "50 promoted vs 15 plain Fridays" },
  { k: "0", label: "Ad dollars that can be traced to an OpenTable booking or a sale today.", src: "Meta results vs OpenTable reporting" },
];

export type Theme = "saturday" | "spend" | "audience" | "creative" | "opentable" | "tracking";
export const themes: Record<Theme, { name: string; line: string }> = {
  saturday: { name: "Saturdays", line: "Where the year's gap sits" },
  spend: { name: "Where the money went", line: "$18,704, 124 campaigns" },
  audience: { name: "Who answers", line: "Age, gender and placement" },
  creative: { name: "What the ads say", line: "169 ads, their copy and cost" },
  opentable: { name: "OpenTable", line: "What an ad can send people to" },
  tracking: { name: "Pixel and Conversions API", line: "What Meta accepts vs. what it counts" },
};
export const ORDER: Theme[] = ["saturday", "spend", "audience", "creative", "opentable", "tracking"];

type Src = { label: string; url: string };
export type Finding = { theme: Theme; title: string; detail: string; src: Src };
const META: Src = { label: "Meta Marketing API, act_24502732409351450, Aug 25 2025 – Sep 24 2026", url: "" };
const TOAST: Src = { label: "Toast Orders API, net sales by business date, 302 open nights", url: "" };
const OT: Src = { label: "OpenTable Guest Center, restaurant 1393000, read Sept 24–25", url: "" };
const TRACK: Src = { label: "Meta Marketing API, act_24502732409351450, Aug 29 – Sep 28 2026; dabney-track (Fly) logs, Sept 28", url: "" };

export const findings: Finding[] = [
  { theme: "saturday", title: "Every big Saturday had a name on it. Themed Saturdays average $3,869 net; the 40 with no paid ads average $1,789, and that includes Valentine's Day and last summer's cover parties.", detail: "Eight After Dark Saturdays averaged $4,770. Tribute nights without the After Dark name (T-Pain $3,700, Bad Bunny $3,296, Michael Jackson $3,069, Drake $3,065, Nicki vs Cardi $2,589) sit a tier below. The last three plain Saturdays did $925, $695 and $1,139.", src: TOAST },
  { theme: "saturday", title: "This summer's Saturdays did $20,333 against $34,917 last summer, and Friday stayed flat.", detail: "The event nights carry most of the gap: last summer had four $10-cover Saturdays averaging $4,207 plus a $5,467 themed party. Plain Saturdays also slipped, from $2,010 to $1,349. The weeks the Kalamazoo Avenue work closed the Rose crossings may be part of that; the data cannot prove it either way.", src: { label: "Dabney internal review, Saturday finding (Toast, June 26 – Sept 24, both years)", url: "" } },
  { theme: "spend", title: "Theme-party ads returned about $6 of added sales per ad dollar; live-music ads about $4; seasonal and reserve-a-table ads $0.27.", detail: "32 theme campaigns ($6,402) sat on nights averaging $2,045 over their baseline. 65 live-music campaigns ($7,673) added $581 a night. Seven seasonal campaigns ($1,723, Pumpkin Spice, holiday, Christmas) added $153. Lift is each night against the same weekday's un-promoted nights within six weeks, so it is a correlation, not a controlled test.", src: META },
  { theme: "spend", title: "Fridays took $7,819, 42% of all spend, and moved the night by about $294.", detail: "A plain Friday still draws a median of 107 guests on the strength of the stage. About $156 of ads a Friday bought roughly $294 of sales, close to breakeven once the drinks are paid for.", src: TOAST },
  { theme: "spend", title: "Weeknight ads cost about what they brought: $159 to $362 added a night on $95 to $250 of ads.", detail: "Tuesday through Thursday carried $3,382 of ads across 19 promoted nights. OpenTable Boost at $4 a cover produced 2 covers in all of August. The best Tuesday in two months, Off the Clock on 9/22, drew 25 guests on $22.", src: META },
  { theme: "audience", title: "Women 25–54 answer at 0.55 RSVPs per ad dollar; the 21% of spend that reached people 65 and over answered at 0.37.", detail: "Women 25–54: $7,077 and 3,902 RSVPs. Everyone 65+: $3,908 and 1,438. Men 25–54: $3,672 and 1,396. Everyone 55–64: $3,321 and 1,378.", src: { label: "Meta age × gender breakdown, same window", url: "" } },
  { theme: "audience", title: "Facebook in-stream video cost $5.97 a click on $519 of spend, eight times the feed.", detail: "The Facebook feed took $10,762 at $0.73. Instagram Reels ($0.55) and Stories ($0.56) were the cheapest real placements and together got under 8% of spend.", src: { label: "Meta placement breakdown, same window", url: "" } },
  { theme: "creative", title: "The cheapest RSVPs, $0.60 to $0.93, open with a named act, a date and a time.", detail: "The T-Pain Show ($0.60): \"The T-Pain Show — A Night of T-Pain's Greatest Hits. Saturday, March 7 | 8:00 PM – 12:00 AM.\" SaxFifth ($0.68), Blues Fest ($0.72) and Let It Snow ($0.73) follow the same shape.", src: META },
  { theme: "creative", title: "The most expensive, $3.55 to $7.14, lead with a mood line and bury the what and when.", detail: "The Maze awareness ad ($4.87 an RSVP) opened \"Some songs don't play in the background — they run the room.\" The Sunday brunch burst ran $7.14, the After Dark Friday retarget $3.55.", src: META },
  { theme: "creative", title: "Only one campaign in thirteen months sold anything: Blues Fest, 13 tickets on $816.", detail: "Everything else asked for an RSVP or a click, which counts interest, not seats. At about $63 a ticket it is also the one ad whose return can be counted.", src: META },
  { theme: "opentable", title: "OpenTable has nothing an ad can send someone to buy: one $20 Experience, no Offers, every Boost ended.", detail: "Over 30 days, 92 covers came from the OpenTable network, 146 from Dabney's own site and Google, 142 walked in. Guests spend $23.06 a cover against $38.01 for 109 Grand Rapids and West Michigan restaurants.", src: OT },
  { theme: "opentable", title: "No-shows run 18.2% on OpenTable's own platform and 4% through partners like Google.", detail: "Prepaid Experiences fix both halves: the night is sold ahead, and a paid table rarely no-shows. OpenTable reports Experiences lift spend 36% and cut no-shows by up to 44%.", src: { label: "OpenTable Cover Trends; opentable.com/restaurant-solutions Experiences guide", url: "https://www.opentable.com/restaurant-solutions/resources/experiences-on-opentable-for-restaurants/" } },
  { theme: "tracking", title: "The reservation link works and IS counted — it was being read from the wrong field.", detail: "Every current reservation ad, including Ashlie Marie ($158.31, Sept 25), calls go.drinkswithdabney.com/reserve with the right date, time, covers and UTM tags, and the September 14 fix to that redirect is live: Schedule events hit Meta's Conversions API continuously, every one accepted and fbc-matched. Corrected Sept 28: the account's `actions` breakdown has no `fb_pixel_schedule` key for this event (Meta only gives its original ~9 standard events their own key there; Schedule, added later, reports under the generic \"custom\" bucket instead — 915 events over 30 days). The `results` field the ad sets actually optimize on shows the true count: `conversions:schedule_website` matches the custom-bucket total exactly on every Schedule-optimizing ad set checked (21, 68, 222…). Nothing was lost; the earlier read of this account was.", src: TRACK },
  { theme: "tracking", title: "Purchases and Leads still don't reach Meta from most of these campaigns.", detail: "Across 12 campaigns and 1,741 link clicks in the last 30 days, the pixel logged 12 InitiateCheckouts and 8 ViewContents, and (still, as of Sept 28) zero Purchases. A script that closes most of that gap, capi-purchases.mjs, already exists — it pulls paid Stripe checkouts and Toast dine-in checks with an email on file and sends them to Meta as deduplicated Purchase events — and is now scheduled 4x/day on the arthur-dabney-cron Fly app; a manual run today sent 0 (no paid Stripe checkouts in the trailing 7 days) with no errors. Its Toast-dine-in half still only works from Daniel's Mac (a local nightly SFTP mirror this Fly machine doesn't have) — moving that pull to the cloud too is separate, undone work.", src: { label: "Meta Marketing API act_24502732409351450, Aug 29 – Sep 28; ~/Projects/dabney/scripts/capi-purchases.mjs; arthur-dabney-cron (Fly) scheduler + logs, read Sept 28", url: "" } },
  { theme: "tracking", title: "Fixed Sept 28: the two client-pixel-only funnel steps this account still had now carry a server-side backup.", detail: "Blues Fest Purchase, its InitiateCheckout, and the private-event Lead already had a server-side Conversions API call (lib/meta-capi.ts) alongside window.fbq, sharing an event_id so Meta dedups the two — that part of the read on this account was already wrong. The two that were genuinely pixel-only: the Schedule fired from inside the on-site reserve picker, and the gift-card InitiateCheckout. Both now POST to Meta server-side (new /api/track/schedule; api/giftcard/checkout) with the same event_id the browser pixel uses, live on dabneyandco.com and verified with a real test call returning events_received:1.", src: { label: "dabneyandco.com production bundle + live test call, Sept 28 2026", url: "" } },
  { theme: "tracking", title: "Corrected Sept 28: the pixel IS shared with this ad account — re-checked with a fresh token.", detail: "An earlier read this session found the pixel object and act_24502732409351450's own pixel list returning \"does not exist or you don't have permission\" and read that as an unshared pixel. Re-run directly against the Graph API: `GET act_24502732409351450/adspixels` lists pixel 32226134143696687 among the account's three pixels, and `GET 32226134143696687?fields=owner_business` resolves cleanly to the Dabney & Co. business. Every ad set's `promoted_object.pixel_id` also correctly points at it. The earlier failure was the token used in that check, not the sharing — nothing to fix in Business Manager.", src: { label: "Meta Graph API v21.0, act_24502732409351450 and pixel 32226134143696687, Sept 28 2026", url: "" } },
];

export const categories = [
  { type: "Theme party / DJ", campaigns: 32, spend: "$6,402", nights: 19, avg: "$3,520", base: "$1,475", lift: "+$2,045", per: "$6.07", tone: "good" },
  { type: "Live music", campaigns: 65, spend: "$7,673", nights: 53, avg: "$1,996", base: "$1,415", lift: "+$581", per: "$4.01", tone: "" },
  { type: "Seasonal / reservations", campaigns: 7, spend: "$1,723", nights: 3, avg: "$1,513", base: "$1,360", lift: "+$153", per: "$0.27", tone: "bad" },
  { type: "Brunch / holiday day", campaigns: 4, spend: "$882", nights: 0, avg: "—", base: "—", lift: "Sundays, no baseline", per: "—", tone: "" },
  { type: "Blues Fest tickets", campaigns: 1, spend: "$816", nights: 1, avg: "$904", base: "$449", lift: "+$455", per: "13 tickets", tone: "" },
  { type: "Private events leads", campaigns: 1, spend: "$282", nights: 0, avg: "—", base: "—", lift: "16 leads, 0 booked", per: "—", tone: "bad" },
] as const;

export const weekdays = [
  { day: "Tuesday", promoted: 8, spend: "$1,248", withAds: "$413", plain: "$254", diff: "+$159", guests: 10, tone: "" },
  { day: "Wednesday", promoted: 4, spend: "$380", withAds: "$651", plain: "$365", diff: "+$286", guests: 14, tone: "" },
  { day: "Thursday", promoted: 7, spend: "$1,754", withAds: "$791", plain: "$429", diff: "+$362", guests: 16, tone: "" },
  { day: "Friday", promoted: 50, spend: "$7,819", withAds: "$2,620", plain: "$2,326", diff: "+$294", guests: 107, tone: "bad" },
  { day: "Saturday", promoted: 18, spend: "$4,653", withAds: "$3,593", plain: "$1,789", diff: "+$1,804", guests: 76, tone: "good" },
] as const;

export const plan: { t: string; d: string; tag: "free" | "money" | "needs" | "done" }[] = [
  { t: "Two named Saturdays a month, every month", d: "October's two are on the calendar: No Skips (the music of Kehlani and Summer Walker) on Oct 3, Homecoming — an all-Beyoncé night — on Oct 10. Both now get 10–14 days of selling instead of the 30 hours September's did. Was: booked week of.", tag: "done" },
  { t: "Build each as a prepaid OpenTable Experience", d: "A table for two and a table for four with the cover and a first round or a bottle included, plus general admission. Deposits already run through Stripe on the account.", tag: "needs" },
  { t: "Meta sells the Experience, not an RSVP", d: "Book Now goes to the Experience link. Women 25–54 within 15 miles plus people who engaged with Dabney events; 65+ and in-stream video left out; Reels and Stories given a real share. Copy leads with the name, the date and the time. About $270 a Saturday.", tag: "money" },
  { t: "Friday's ad budget now goes to Saturdays", d: "Done Sept 25: the campaign builder refuses Friday shows, and the roughly $156 a Friday (about $600 a month) goes to the two named Saturdays. Friday keeps its free Instagram post and story. Was: paid ads every Friday.", tag: "done" },
  { t: "Seasonal ads stopped", d: "Done Sept 25: Pumpkin Spiced paused ($0.27 of lift per dollar). Seasonal drinks now ride in the Friday and Saturday creative. Was: seasonal drinks running as their own campaigns.", tag: "done" },
  { t: "Weeknights: one anchor, sold ahead, almost no ads", d: "The Mint Julep class as a ticketed Wednesday Experience and Off the Clock as a standing Tuesday, with a free happy-hour Offer and Bonus Points on those nights. Boost at $7.50 only on anchor nights, once there is something to book.", tag: "needs" },
  { t: "Count it every Monday", d: "UTM tags on every ad link, the OpenTable Experiences report, and each named Saturday against the $1,789 plain-Saturday baseline in Toast. Ads are judged on seats sold, not RSVPs.", tag: "free" },
  { t: "Confirm the Reservations pixel is shared with this ad account", d: "Done Sept 28: re-checked directly against the Graph API — pixel 32226134143696687 is in act_24502732409351450's own adspixels list, resolves to the Dabney & Co. business, and every ad set's promoted_object points at it. It was never unshared; an earlier session's read used a token that couldn't see it. The real gap this surfaced — Schedule conversions reporting under a generic \"custom\" bucket instead of their own key — is a Meta Insights quirk, not a tracking problem: the `results` field the ad sets actually optimize on counts them correctly.", tag: "done" },
  { t: "Put the Purchase-sync script on a schedule", d: "Done Sept 28: capi-purchases.mjs is now on the arthur-dabney-cron Fly app, running 4x/day (dabney.ads.capi-purchases). A manual run sent 0 events today — correctly, there were no paid Stripe checkouts in the trailing 7 days — with no errors. Its Toast dine-in half still needs Daniel's Mac (a local nightly SFTP mirror this Fly machine doesn't have yet), so in-store purchases without a Stripe trail still won't reach Meta until that pull also moves to the cloud.", tag: "done" },
  { t: "Build the audiences behind Women 25–54 within 15 miles, plus event engagers", d: "Done Sept 28: full audience review at /p/dabney-audiences — 9 new audiences built (Purchasers, Reserve-Click, Reserve-not-Purchased, Event Responders, Video Viewers, and 4 lookalikes), organized by Engagement/Reservations/Sales. The women 25–54, 15mi saved audience itself is blocked at the API level (Meta error #3) and needs a 30-second manual build in Ads Manager; 3 broken lookalikes and 4 duplicate audience pairs are flagged there too.", tag: "done" },
];

export const thisSaturday = "September 26 got about 30 hours of selling; October doesn't have to. Both of its named Saturdays are already on the calendar: No Skips — the music of Kehlani and Summer Walker — on Oct 3, and Homecoming, an all-Beyoncé night, on Oct 10. Each now gets the full 10–14 days a themed Saturday needs to clear the $3,869 average instead of settling for a plain one's $1,789. Friday's ad budget, stopped cold on Sept 25, funds both. What still isn't fixed is measurement: the tracking findings above show none of the clicks these ads buy landing as a counted reservation or sale on the Meta side, so right now the only proof either Saturday worked will be Toast's number the next morning.";

export const method = [
  "All $18,704 of Meta spend since August 25, 2025 was pulled at campaign, ad and day level from the Marketing API; the three totals reconcile to the dollar. Archived and deleted campaigns are included.",
  "Each campaign is matched to the night it sold: the date in its name when there is one, otherwise its last day of spend.",
  "Toast net sales (before tax and tip) were pulled for every open night from August 2025. A night's lift is its net minus the median of the same weekday's un-promoted nights within six weeks.",
  "Lift is a correlation. A promoted night also has talent, a cover and word of mouth, so read the ranking between campaign types, not the decimals.",
  "OpenTable figures were read in Guest Center on September 24 and 25; the August invoice supplies the Boost result.",
  "Tracking findings were measured live on September 28, 2026: Meta Marketing API insights for act_24502732409351450 (Aug 29 – Sep 28, pixel-action breakdown), dabney-track's Fly logs for the same day, the dabneyandco.com production bundle, and a direct Graph API check of the pixel and ad-account pixel list with this session's own Meta token.",
];
