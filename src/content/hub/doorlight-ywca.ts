import { TOKENS } from "@/content/tokens";
/* Doorlight, prepared for a private review with YWCA Kalamazoo. LOCAL ONLY, not deployed, no token.
   Sources: ~/Projects/loveleeday-inkind/BRIEF-YWCA.md (two public YWCA sources), Carl Brown's voice note (Oct 10),
   and the earlier opportunity review in src/content/hub/inkind-opportunity.ts. Nothing here is a YWCA statement
   unless it is quoted and named. No price appears: see `pricing`. */

export const IMG = "https://doorlight.loveleedaystudios.com";

/* The live, clickable mockup (published 2026-10-10, noindex, sample data only). */
export const tryIt = {
  url: "https://doorlight.loveleedaystudios.com",
  urlLabel: "doorlight.loveleedaystudios.com",
  eyebrow: "Try it yourself",
  a: "Tap it, don't just read it.",
  b: "The mockup works.",
  lead: "Everything on this page also runs as a working mockup on a phone or a laptop. Search the map, tap a category, and try a staff member's side: add an item, change a status, send the update text.",
  doors: [
    { k: "For neighbors", title: "Find where to give", body: "Search, category filters, use your location, and the live map of sample places.", href: "https://doorlight.loveleedaystudios.com/concepts/c5-coalition/index.html" },
    { k: "For YWCA Kalamazoo staff", title: "The member view", body: "Setup, your listing with add and edit, the text update, who is heading your way, and the month.", href: "https://doorlight.loveleedaystudios.com/concepts/ywca/setup.html" },
  ],
  note: "Sample data throughout. Nothing you type is saved or sent, and no real shelter location appears.",
};
export const SHOT = (f: string) => `${IMG}/ywca-board-shots/${f}`;
export const PSHOT = (f: string) => `${IMG}/proposal-shots/${f}`;

export const meta = {
  short: "Doorlight",
  token: TOKENS.doorlight ?? "",
  preparedFor: "YWCA Kalamazoo",
  role: "private review",
};

export const hero = {
  a: "Know what is wanted",
  b: "before you drive over.",
  lead: "Doorlight is a live board of which local nonprofits are accepting which donations right now. A staff member changes a status with one text message, and neighbors see it on a map before they leave the house. This page shows what YWCA Kalamazoo would see as the first partner, what we would do in a pilot, and what we do not yet know.",
};

export const numbers = [
  { k: "1 in 5", label: "donation drop-offs turned away, in Carl Brown's words \"at least 20% of the time\"", src: "Carl Brown's idea, Oct 10, 2026. His estimate, not measured, unverified" },
  { k: "0", label: "dates or hours on the YWCA's shelter wish list: \"Contact coordinator for times\"", src: "United Way GiveGab listing, undated" },
  { k: "12", label: "categories on the mockups, grouped from the items named in the YWCA's two public notices", src: "GiveGab wish list and Kalamazoo College HR, May 2022" },
  { k: "$11.3B", label: "of donated clothing claimed on US tax returns in one year, plus $5.5B of household goods", src: "IRS SOI noncash contributions, tax year 2015 (itemizers only)" },
];

export type Src = { label: string; url: string };
export type Finding = { tag: "quote" | "estimate" | "read" | "research"; title: string; detail: string; src: Src };

export const groups: { name: string; line: string; items: Finding[] }[] = [
  {
    name: "What the YWCA's public notices show",
    line: "Two public sources, quoted exactly.",
    items: [
      {
        tag: "quote",
        title: "The shelter's current needs live on a page run by someone else, with no date.",
        detail: "United Way of the Battle Creek and Kalamazoo Region lists the YWCA Domestic Violence Shelter's wish list on GiveGab: \"Rain gear - umbrellas, raincoats/ponchos\", \"Traveling file storage - binders, waterproof folders, etc.\", \"Backpacks - kids and adults\", \"Socks\", \"Cleaning supplies for homes\", \"Travel size hand sanitizer\", \"Strollers - Must be new\", \"Silverware\", \"Plates and Bowls\", \"Pots and Pans\". The reason given: \"Clients are putting important documents in plastic bags\". The time reads \"Contact coordinator for times.\"",
        src: { label: "United Way GiveGab listing: WISH LIST/DONATIONS NEEDED - YWCA Domestic Violence Shelter", url: "https://www.givegab.com/nonprofits/united-way-of-the-battle-creek-and-kalamazoo-region-ec84b52c-f75c-4fc1-8428-ca597a77c69f/opportunities/wish-list-donations-needed-ywca-domestic-violence-shelter" },
      },
      {
        tag: "quote",
        title: "An older public notice had to say \"accepting only.\"",
        detail: "Kalamazoo College's HR office posted in May 2022 that the YWCA, at 353 E. Michigan Avenue, takes drop-offs Tuesdays and Thursdays, 9 am to 5 PM, \"Accepting only: Linens (twin sheets, blankets, towels), diapers (sizes 3, 4, 5, 6)\", with \"baby wipes, personal care items, gift cards\" also named.",
        src: { label: "Kalamazoo College HR, \"Help the Kalamazoo area community,\" May 10, 2022", url: "https://hr.kzoo.edu/2022/05/10/help-the-kalamazoo-area-community/" },
      },
      {
        tag: "read",
        title: "Our reading, not their words: donors cannot tell what is wanted today.",
        detail: "One list has no date and no hours, and the other is from 2022. A neighbor with a bag of towels has no way to know whether the answer today is the same. Staff are the ones who meet that mismatch at the door.",
        src: { label: "LOVELEEDAY reading of the two sources above", url: "" },
      },
    ],
  },
  {
    name: "What the wider research shows",
    line: "From the earlier opportunity review of this idea.",
    items: [
      {
        tag: "estimate",
        title: "The turn-away rate is an estimate. Nobody has counted it.",
        detail: "Carl Brown described donors being turned away \"at least 20% of the time\" and no central place to see who accepts what. No source confirms the 20%. Counting offered, accepted and turned away at a few doors would replace it with a real number.",
        src: { label: "Carl Brown voice note, Oct 10, 2026 (his estimate, unverified)", url: "" },
      },
      {
        tag: "research",
        title: "The old tools kept static wish lists, and the biggest one closed.",
        detail: "Amazon closed Charity Lists in February 2023 and nonprofit lists could not be moved. SHARE, the closest live example, keeps static wish items. Nobody shows \"accepting now\" or \"full\" by item and by place for clothing and household goods.",
        src: { label: "sharegoodiowa.org/wishlistupdate; sharegoodusa.org (SHARE Cape Fear)", url: "https://sharegoodiowa.org/wishlistupdate" },
      },
      {
        tag: "research",
        title: "A stale board is worse than no board.",
        detail: "If the board says \"accepting coats\" and the door says no, the donor is sent away twice. So every status in Doorlight expires on its own, shows how old it is, and can be changed by text in seconds.",
        src: { label: "LOVELEEDAY opportunity review, Oct 10, 2026", url: "" },
      },
      {
        tag: "research",
        title: "Being turned away makes people less likely to come back.",
        detail: "A 2021 Washington University study found blood donors who were turned away were 29% less likely to give again. It is a different kind of giving, so we use it only as an analogy.",
        src: { label: "Washington University Olin research, 2021 (analogy)", url: "" },
      },
    ],
  },
];

/* Where this started (Daniel, 2026-10-10): a conversation Carl Brown had with Daniel that morning. */
export const slot = {
  label: "Where this started",
  body: "A conversation with Carl Brown",
  note: "On the morning of October 10, 2026, Carl Brown talked with Daniel May about YWCA Kalamazoo wanting something better: a new program to help them. This review is our first answer to that conversation.",
};

export const neighbor = {
  lead: "A neighbor starts with what they have in the trunk. Doorlight shows nearby places that can take it, with hours and a fresh answer, before anyone gets in the car.",
  shots: [
    { f: PSHOT("d4-photo-nohaze-1440.png"), t: "The home page", d: "\"Full on coats? Say so in one reply.\" The promise on one screen, with a real text exchange beside it.", alt: "Doorlight home page with a phone showing a text update", crop: { y: 0, h: 910 } },
    { f: PSHOT("give-1440.png"), t: "Find where to give", d: "The neighbor picks what they have, sees a real map of Kalamazoo and a card for each place with hours and how recently it was confirmed. Every pin on this screen is a sample location.", alt: "Doorlight give page with a map of Kalamazoo and a list of sample places", crop: { y: 850, h: 1620 } },
  ],
};

export const member = {
  lead: "These are the screens YWCA Kalamazoo staff would use. The categories come from the YWCA's own two public notices. Statuses, hours and counts are samples, labelled as such.",
  shots: [
    { f: SHOT("profile.png"), t: "Setup", d: "One page, seven short steps: about the organization, the public drop-off, donation rules, why each item helps, other ways to help, who can text, and privacy. The page shown here is the top of it.", alt: "Doorlight member setup page", crop: { y: 0, h: 1400 } },
    { f: SHOT("dashboard.png"), t: "The dashboard", d: "Each category is Accepting, Low or Full, with when it was last confirmed and when it expires. One tap changes it, and an item can be added or edited.", alt: "Doorlight member dashboard", crop: { y: 0, h: 1500 } },
    { f: SHOT("text-update.png"), t: "Update by text", d: "\"FULL LINENS\" changes the board. A reminder text asks for one reply before a status goes stale. No login.", alt: "Doorlight text update screen" },
    { f: SHOT("incoming.png"), t: "Heading your way", d: "Counts and categories only: \"3 neighbors plan to bring socks today.\" Never a name. Staff can pause a category.", alt: "Doorlight incoming donations screen" },
    { f: SHOT("monthly.png"), t: "The monthly report", d: "Received and turned away by category, and which categories were Full most often. Sample figures, labelled Sample. It can be shared with a coalition.", alt: "Doorlight monthly needs report" },
    { f: SHOT("public-listing.png"), t: "What a neighbor sees", d: "The YWCA's card beside the map. The only place shown is the public office drop-off at 353 E. Michigan Avenue. Other pins are sample locations.", alt: "Doorlight public listing for YWCA Kalamazoo on the map", crop: { y: 0, h: 1290 } },
  ],
};

export const proof = [
  { k: "Inquiries", d: "Every private-event inquiry at Dabney & Co. gets a drafted reply and a logged follow-up, approved by a person before it goes." },
  { k: "Deadlines", d: "Renewals, notices and past-due balances sit on one calendar with the date each switches something off." },
  { k: "Posts and email", d: "The weekly email, event covers and scheduled posts are made and published with approval." },
  { k: "Books", d: "Every bank line is categorised and reconciled, with the evidence kept for each." },
];
export const proofNote = "The same LOVELEEDAY system has run a real small business, Dabney & Co., every day. Doorlight itself is not live anywhere yet: everything on the screens above is a mockup with sample data.";

export const layers = [
  { name: "A live board", does: "Accepting, Low or Full for each kind of item, at each partner, with a plain card and a map.", ask: "Is anyone taking diapers in sizes 3 to 6 today?" },
  { name: "Update by text", does: "Staff change a status with two words. No login, no app. A reminder text asks for one reply before it expires.", ask: "Which statuses will go stale before Friday?" },
  { name: "Statuses that expire", does: "Every status carries its age and drops off the public board by itself if no one confirms it.", ask: "What is the board showing that nobody has confirmed this week?" },
  { name: "Heading your way", does: "Neighbors say they are bringing something. Staff see counts and categories, never names.", ask: "How many people are bringing socks today?" },
  { name: "The monthly needs report", does: "What was received and what was turned away, by category, with the categories that ran Full most often.", ask: "Which items did we turn away most in October?" },
  { name: "A coalition view", does: "One sponsor sees the whole region: where gaps are, which partners keep their board fresh, what the community is short of.", ask: "What is the region short of right now?" },
];

export const questions = [
  { q: "Which items did we turn away most last month?", joins: "Monthly report" },
  { q: "Which of our statuses are about to expire?", joins: "Dashboard and text reminders" },
  { q: "How many neighbors are bringing something today?", joins: "Heading your way" },
  { q: "Did our hours change since the last public notice?", joins: "Setup and the public listing" },
  { q: "Which partners keep their board current?", joins: "Update freshness" },
  { q: "What does the region need that no one is collecting?", joins: "Coalition view" },
];

export const trust = [
  { t: "The shelter is never shown", d: "The only place a neighbor sees for YWCA Kalamazoo is the public office drop-off at 353 E. Michigan Avenue. The shelter's location is never entered, shown or mapped, and there is no setting to turn that on." },
  { t: "Donor names are never shown to nonprofits", d: "The \"Heading your way\" screen shows counts and categories only. Staff never see a name or contact detail for a neighbor." },
  { t: "Client information is never collected", d: "Doorlight has no field for clients. Texts to the board carry categories only, never names of the people you serve." },
  { t: "Sample data is labelled", d: "Every status, hour and figure on the mockups is marked Sample unless a source is named. The pins on the map are sample locations, not real partners." },
  { t: "Nothing is live yet", d: "Doorlight is a mockup. Nothing has been sent to the YWCA, no text number exists, and no donor has used it." },
  { t: "Your data stays yours", d: "A board and its history belong to the coalition and its partners, can be exported, and are never sold, used for marketing, or used to train a model." },
  { t: "People approve changes", d: "Only people named by the organization can change its statuses. Every change is logged with who and when." },
  { t: "Each partner keeps control", d: "A partner can pause a category, change its hours, or leave the board at any time." },
];

export const pilot = {
  lead: "One region, one sponsor, a small group of partners. The question the pilot answers is whether a board can stay true, and whether it saves doors from turning neighbors away.",
  weeks: [
    { w: "Week 1", t: "Sit down with the YWCA", d: "Confirm what the YWCA wants listed, its real hours and who would send the texts. Replace the 2022 hours and the sample statuses with theirs." },
    { w: "Weeks 2 to 3", t: "Recruit a small group of partners", d: "Five to eight Kalamazoo nonprofits, including the YWCA, with a United Way or community foundation as sponsor. This is a recommendation from the earlier review, not an agreement." },
    { w: "Weeks 3 to 4", t: "Count turn-aways at a few doors", d: "Offered, accepted and turned away, by category, at two or three intake doors, for two weekends. This replaces the 20% estimate with a measured number." },
    { w: "Weeks 4 to 8", t: "Run the board", d: "Text updates, expiring statuses and the public map, live for the partners in the group." },
    { w: "Week 8", t: "First monthly needs report", d: "What was received, what was turned away, and which categories ran Full, shared with the sponsor." },
  ],
  measures: [
    { k: "Turn-aways", d: "The measured share of drop-offs turned away at the counting doors, against Carl's unverified 20%." },
    { k: "Freshness", d: "The share of statuses confirmed within seven days, and the median age of a status on the public board." },
    { k: "Participation", d: "How many partners keep their board current, and how many texts they send in a month." },
  ],
};

/* Rule: a price appears only if the same price is already in a live proposal for the same offer type.
   No existing civic or nonprofit proposal content carries a price for this offer, so none is shown. */
export const pricing = {
  label: "Pilot terms",
  body: "Set together after YWCA Kalamazoo has tried the mockup and we know the first partners.",
};

export const begin = [
  ["Talk with YWCA Kalamazoo", "Thirty minutes on what is on this page, what is wrong in it, and what the YWCA would want listed. Their answers shape the listing and the pilot."],
  ["Set up the YWCA's listing", "The real categories, the real hours and the public office drop-off, in their words, with the text line set to the people they choose."],
  ["Count before we build", "Two weekends of counting turn-aways at a few doors, so the pilot starts from a number and not a guess."],
  ["Bring in a sponsor and a few partners", "A regional sponsor and five to eight partners, then the board goes live for that group only."],
] as const;

export const method = [
  "YWCA needs list: United Way of the Battle Creek and Kalamazoo Region, GiveGab listing \"WISH LIST/DONATIONS NEEDED - YWCA Domestic Violence Shelter,\" ongoing and undated. Location shown as \"Virtual Opportunity.\" Time shown as \"Contact coordinator for times.\"",
  "YWCA public drop-off and hours: Kalamazoo College HR, \"Help the Kalamazoo area community,\" May 10, 2022. These hours are four years old and are shown on the mockups as sample hours until the YWCA confirms them.",
  "The 20% turn-away figure is Carl Brown's own estimate from his Oct 10, 2026 note, not measured and not confirmed by any source.",
  "Market and risk findings reuse the LOVELEEDAY opportunity review of Oct 10, 2026: SHARE (sharegoodusa.org), Amazon Charity Lists closure Feb 2023 (sharegoodiowa.org), IRS SOI noncash contributions for tax year 2015 (read from a search summary, itemizers only), Washington University Olin research 2021 (analogy).",
  "What YWCA Kalamazoo told Daniel directly is not on file and is not used anywhere on this page.",
  "Every status, hour, count and pin on the mockups is a sample. The map is OpenStreetMap data.",
];

/* Share link: /p/doorlight/<PORTAL_TOKEN_DOORLIGHT>. Unset token = unpublished (no params, 404). */
export const doorlightClients = [meta].filter((m) => m.token);
export const getDoorlight = (token: string) => doorlightClients.find((m) => m.token === token);
