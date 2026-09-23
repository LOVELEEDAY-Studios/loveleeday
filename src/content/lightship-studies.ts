/**
 * Brian Brackeen / Lightship — met 2026-09-22 at PitchMI in Kalamazoo, where he judged.
 *
 * Three rebuilds (Black Tech Week, Lightship Capital, Lightship Foundation), two commercials
 * cut from Black Tech Week's footage and one from the Foundation's, and market intelligence.
 * The reasoning for each design is written to be SAID to the client: Daniel, 2026-09-22,
 * "why did you decide on this design, we have to be able to tell the client."
 *
 * Every figure is sourced: the fund and portfolio measurements are in data/lightship-*.json
 * (22 September 2026); the rest are cited in `sources` or quoted from the client's own site.
 */
import type { Research, Case } from "./portfolio";
import type { Portal, Video } from "./portals";
import { TOKENS } from "./tokens";
import { v } from "./assetVersion";

export const btwVideos: Video[] = [
  {
    title: "Sponsor Columbus 2027 — 28-second spot",
    caption: "For sponsor decks, outreach emails and LinkedIn. Cut from Black Tech Week's own 2024–2025 footage, set to a licensed track: “Basketball Training” by Arulo (Mixkit).",
    src: v("/portal/blacktechweek/video/btw-sponsor-16x9.mp4"),
    poster: v("/portal/blacktechweek/video/btw-sponsor-16x9.jpg"),
    aspect: "16/9",
  },
  {
    title: "Waitlist reel — 15 seconds, vertical",
    caption: "For Instagram, TikTok and Stories: the room, the number, the city, one action.",
    src: v("/portal/blacktechweek/video/btw-reel-9x16.mp4"),
    poster: v("/portal/blacktechweek/video/btw-reel-9x16.jpg"),
    aspect: "9/16",
  },
];

export const foundationVideos: Video[] = [
  {
    title: "Lightship Foundation — 25-second story",
    caption: "Bootcamp, the Startup Train and Black Tech Week in one cut, for donors and corporate partners. Your footage, set to a licensed track: “Lord Knows” by Arulo (Mixkit).",
    src: v("/portal/lightshipfoundation/video/lightship-foundation-16x9.mp4"),
    poster: v("/portal/lightshipfoundation/video/lightship-foundation-16x9.jpg"),
    aspect: "16/9",
  },
];

export const lightshipResearch: Research = {
  kicker: "Market intelligence",
  title: "What we would put in front of you before Columbus.",
  intro:
    "Websites are the part you can see, so they are where we start. But the more useful work is what sits behind them: where Black Tech Week stands against the events it competes with, what the Columbus move needs from sponsors, and what your portfolio looks like to someone doing diligence today. Here is a first pass at each.",
  points: [
    {
      title: "Black Tech Week is between cities, and its website shows it",
      detail:
        "The old ticket address, blacktechweek.com/registration, still appears in Google and now returns an error page. The top photo on the homepage shows stage screens in Portuguese (“O novo significado do Trabalho”), so it almost certainly comes from another event. The “Watch the 2026 recap” button opens the YouTube channel rather than a video. And link previews on LinkedIn and in texts break, because the preview-image address is malformed. Each of these is a small fix, and each lands in front of the Columbus sponsors you are about to pitch.",
    },
    {
      title: "Columbus is a sponsor market you have to win from scratch",
      detail:
        "Experience Columbus projects about 10,000 attendees and $5.4 million in visitor spending for the 2027 edition. JobsOhio already presents Black Tech Week, so the statewide partner carries over. The city-level partners do not. That is a list of companies to research, rank and approach, and the 28-second sponsor spot below is the first thing we would put in the outreach.",
    },
    {
      title: "Where Black Tech Week sits against the events it competes with",
      detail:
        "AfroTech runs about 40,000 attendees, with tickets from $450 to $2,250. Black Is Tech runs about 5,000. a16z's Tech Week is free and spread across a city. Black Tech Week publishes 12,000+ attendees, and your Foundation's own counter shows 19,000 registrations. A new host city is the one moment you can reset ticket tiers and sponsor packages without anyone noticing a price change. We would build that comparison properly before the Columbus packages are set.",
    },
    {
      title: "The fund's front door hasn't changed since 2022",
      detail:
        "lightship.capital's footer reads “© 2022 Lightship Capital”, and the office-hours booking link opens a calendar on March 2022. The portfolio page shows three companies and hides the other fifteen behind a button. None of the partners appears on the homepage. An LP or founder doing diligence reads all of that as a fund that is no longer active.",
    },
    {
      title: "Your portfolio's health is invisible, including the good news",
      detail:
        "CurlMix said publicly in November 2025 that it was close to shutting down, then survived on 20,000 community pre-orders. Nothing on lightship.capital reflects either the risk or the recovery. Arbit's footer still says 2022. A short quarterly portfolio brief would turn that silence into a reporting habit LPs notice: status, milestones and site health for each company, drawn from checks like the ones on this page.",
    },
    {
      title: "Two links on your portfolio page send people somewhere else",
      detail:
        "joinbootup.com lapsed and now serves an Indonesian gambling site. The company carries on as Bootup Studios. semiosis-ai.com no longer loads at all. Both are still linked from lightship.capital/portfolio. It is a same-day fix, and it should happen before anything else on this page.",
    },
  ],
  verdict:
    "Three steps, in order. This week: fix the two portfolio links, redirect Black Tech Week's old ticket address and repair its share image, all small, quick jobs. Before Columbus sponsorship opens: the rebuilt Black Tech Week site, the sponsor spot and a researched, ranked list of Columbus sponsor prospects, delivered as one package. Then, every quarter: a portfolio intelligence brief for your LPs, covering where each company stands and what has changed since the last one.",
  sources: [
    { label: "FOX19 — Black Tech Week leaves Cincinnati for Columbus (7 Sep 2026)", url: "https://www.fox19.com/2026/09/07/black-tech-week-leaves-queen-city-columbus/" },
    { label: "Experience Columbus — Black Tech Week selects Columbus as 2027 host city", url: "https://www.experiencecolumbus.com/articles/post/black-tech-week-selects-columbus-as-2027-host-city/" },
    { label: "Black Tech Week on YouTube — “BTW 2025, Powered by Lightship Foundation & JobsOhio”", url: "https://www.youtube.com/watch?v=eUUZZg_9Ltk" },
    { label: "AfroTech Conference 2026", url: "https://afrotech.com/afrotech-conference-2026-houston" },
    { label: "Black Is Tech Conference 2026", url: "https://blackistechconference.com/" },
    { label: "IBTimes — a16z Tech Week Boston 2026", url: "https://www.ibtimes.com/boston-tech-week-2026-opens-tomorrow-a16z-brings-572-events-kendall-square-3803298" },
    { label: "Lightship Foundation — Impact page (19,000 Black Tech Week registrations)", url: "https://www.lightship.foundation/impact/" },
    { label: "Yahoo Finance — CurlMix on the verge of closing", url: "https://finance.yahoo.com/news/curlmix-verge-closing-down-co-220032926.html" },
    { label: "Essence — CurlMix survives closure", url: "https://www.essence.com/news/money-career/curlmix-survives-closure/" },
    { label: "lightship.capital — homepage and portfolio, read 22 September 2026", url: "https://www.lightship.capital/portfolio" },
    { label: "blacktechweek.com — homepage and /registration, read 22 September 2026", url: "https://www.blacktechweek.com/" },
  ],
};

export const lightshipCases: Case[] = [
  {
    slug: "blacktechweek",
    company: "Black Tech Week",
    domain: "blacktechweek.com",
    portalToken: TOKENS.blacktechweek as string,
    sector: "Lightship Foundation's conference · Columbus, July 2027",
    before: v("/portal/blacktechweek/blacktechweek-before.jpg"),
    after: v("/portal/blacktechweek/blacktechweek-after.jpg"),
    thesis:
      "The live site is already bold and on-brand, built this year, so making it darker or louder would not be a redesign. Its real problem is that it never says what happens at Black Tech Week. There is no program and no reason to spend three days there, just seven buttons of equal weight. So the rebuild answers that first. We took two references whole: Eventbrite's Reconvene summit, where the crowd is the hero and the event's name runs across it, and Stripe Sessions, which puts a plain what, when and where strip before any ask. Then we inverted the brand's silhouette. It runs on Black Tech Week's own paper color instead of black, with a wide typeface where theirs is condensed. It is the same brand, reading as a new chapter, which is the Columbus story.",
    findings: [
      "It opens on your packed theatre with Columbus written across it, then a strip that answers what, when, where and who before it asks for an email.",
      "“Three days, three reasons to be in the room”: sessions, investor office hours and the career fair, each with a real next step. The live site never explains the event.",
      "Sponsor and Speak become the two main doors, and the five other ways in sit in a list. Columbus sponsor revenue is what the move needs, so sponsors get a front door.",
      "Your own numbers, labeled as your figures, set as a record rather than a grid of colored tiles.",
      "Your photography throughout. We replaced the homepage's top photo, whose stage screens are in Portuguese.",
    ],
    search:
      "Not measured. We did not run search-position tooling for this study. What we can say is that the old ticket address still ranks in Google and returns an error page.",
    videos: btwVideos,
  },
  {
    slug: "lightshipcapital",
    company: "Lightship Capital",
    domain: "lightship.capital",
    portalToken: TOKENS.lightshipCapital as string,
    sector: "Venture fund · Cincinnati, OH",
    before: v("/portal/lightshipcapital/lightshipcapital-before.jpg"),
    after: v("/portal/lightshipcapital/lightshipcapital-after.jpg"),
    thesis:
      "The live site is a brochure built for browsing: an ocean photograph, three portfolio highlights, a slideshow. But two of the fund's three audiences are reading a document. An LP doing diligence and a co-investor sizing up the roster want the thesis, the whole portfolio and the team in one place they can scan. So the rebuild is laid out like a fund document, not a marketing page. The references are Titan's quiet, dark financial register and Vercel's hairline-ruled investor lists. A fixed index down the side shows where you are, criteria sit in a table, and all eighteen companies are on one page.",
    findings: [
      "All eighteen companies on one page, each linked to the company. Bootup and Semiosis AI are listed but deliberately not linked, with a plain note on why.",
      "“How we invest” becomes a criteria table: who you back, where, and at what stage. A founder can tell whether they fit in ten seconds.",
      "Founders and LPs get separate first buttons, and the real contact routes on your own site each get a labeled door.",
      "Your navy and yellow, read from your own site, and your wordmark. The type is a serif with a monospaced companion, which reads like a report rather than an advertisement.",
    ],
    search:
      "Not measured. The findings above come from reading the pages, not from search tools.",
  },
  {
    slug: "lightshipfoundation",
    company: "Lightship Foundation",
    domain: "lightship.foundation",
    portalToken: TOKENS.lightshipFoundation as string,
    sector: "Nonprofit accelerator · owner of Black Tech Week",
    before: v("/portal/lightshipfoundation/lightshipfoundation-before.jpg"),
    after: v("/portal/lightshipfoundation/lightshipfoundation-after.jpg"),
    thesis:
      "Three different people arrive at the Foundation's site with three different questions. A founder wants to know which program to apply to, a donor or corporate partner wants to know whether the money worked, and the community wants to know what is on. The live site answers all three with the same colored tiles. The rebuild asks who you are at the top and then answers each question directly, in the form of a well-made annual report. Your impact numbers become a permanent ledger instead of counters that start at zero, the programs sit side by side in a comparison, and Black Tech Week is shown as what it is: the Foundation's own program at its largest scale.",
    findings: [
      "Three paths at the top: I'm a founder, I'm a partner or donor, I'm here for the community.",
      "Bootcamp, Founder Gym and Black Tech Week in one comparison of format, cost, length and outcome, where the live site uses three marketing tiles.",
      "An impact ledger with all eight of your published figures, readable without JavaScript. The live counters show 0 to anyone whose browser doesn't run them.",
      "A proper supporters list and one clear Donate and Partner box, so the donate button no longer drops people onto a bare payment page with no context.",
      "Your photography and your gold, teal and blue, used as accents on a warm paper ground.",
    ],
    search:
      "Not measured. The findings above come from reading the pages, not from search tools.",
    videos: foundationVideos,
  },
];

const common = {
  round: "Round 01",
  deliveredOn: "2026-09-22",
  expiresOn: "2026-12-21",
  next: [
    "Open the page and scroll it the way your audience would.",
    "Leave notes anywhere on this page — they reach us by email immediately.",
    "If the direction is right, we scope the build against your full site map.",
  ],
};

export const lightshipPortals: Portal[] = [
  {
    ...common,
    token: TOKENS.blacktechweek as string,
    client: "Black Tech Week",
    clientDomain: "blacktechweek.com",
    project: "Columbus 2027 — site direction and sponsor video",
    intro:
      "Thank you for the time at PitchMI tonight. Columbus is the moment Black Tech Week gets a new first impression, so here is a first direction for it: a homepage that explains the event before it asks for an email, and two short videos cut from your own footage, one for sponsors and one for the waitlist.",
    deliverables: [
      {
        slug: "marketing-site",
        title: "Black Tech Week — Columbus 2027 homepage",
        kind: "Full landing page · desktop and mobile · plus two videos",
        rationale: lightshipCases[0].thesis,
        look: lightshipCases[0].findings,
        href: "/portal/blacktechweek/index.html",
        card: v("/portal/blacktechweek/card.jpg"),
        preview: v("/portal/blacktechweek/preview.jpg"),
        caveats: [
          "Every number is Black Tech Week's own, as published on blacktechweek.com on 22 September 2026: 12,000+ attendees, 25+ sessions, 145+ speakers, $120M+ raised by attendees and $1.13B+ in attendee revenue.",
          "All photography and footage is Black Tech Week's own, from your site and your YouTube channel; nothing is stock. The music is licensed (Mixkit's free commercial license, cleared for web and social, not for TV or radio broadcast).",
          "The waitlist forms on this page are a direction, not wired to your email list.",
          "Found on the live site: /registration returns an error page but still appears in Google, the share-image address is malformed so link previews break, and the homepage's top photo shows Portuguese stage screens.",
        ],
        videos: btwVideos,
      },
    ],
  },
  {
    ...common,
    token: TOKENS.lightshipCapital as string,
    client: "Lightship Capital",
    clientDomain: "lightship.capital",
    project: "Fund site — direction study",
    intro:
      "Thank you for the time at PitchMI tonight. lightship.capital still reads “© 2022”, and it shows three of your eighteen companies. Here is what it looks like when an LP or a founder can read the whole fund in one scroll.",
    deliverables: [
      {
        slug: "marketing-site",
        title: "Lightship Capital — fund site",
        kind: "Full landing page · desktop and mobile",
        rationale: lightshipCases[1].thesis,
        look: lightshipCases[1].findings,
        href: "/portal/lightshipcapital/index.html",
        card: v("/portal/lightshipcapital/card.jpg"),
        preview: v("/portal/lightshipcapital/preview.jpg"),
        caveats: [
          "Company descriptions, criteria, team bios and contact routes are quoted from lightship.capital and its /about and /contact pages as of 22 September 2026.",
          "The team section is text only by design. We could confidently match only one published photo to a name, and a wrong face on a partner's name is not a risk worth taking.",
          "Found on the live site: “© 2022” in the footer, a booking link that opens on March 2022, and two portfolio links that go somewhere else (joinbootup.com now serves a gambling site; semiosis-ai.com no longer loads).",
        ],
      },
    ],
  },
  {
    ...common,
    token: TOKENS.lightshipFoundation as string,
    client: "Lightship Foundation",
    clientDomain: "lightship.foundation",
    project: "Foundation site — direction study and video",
    intro:
      "Thank you for the time at PitchMI tonight. The Foundation's work is bigger than its site lets it look: 17,000 innovators served, Bootcamp, Founder Gym, and Black Tech Week itself. Here is a direction that answers a founder, a donor and a partner each in their own terms, plus a short film cut from your footage.",
    deliverables: [
      {
        slug: "marketing-site",
        title: "Lightship Foundation — site",
        kind: "Full landing page · desktop and mobile · plus a video",
        rationale: lightshipCases[2].thesis,
        look: lightshipCases[2].findings,
        href: "/portal/lightshipfoundation/index.html",
        card: v("/portal/lightshipfoundation/card.jpg"),
        preview: v("/portal/lightshipfoundation/preview.jpg"),
        caveats: [
          "Every impact figure is the Foundation's own, read from lightship.foundation/impact on 22 September 2026. Program dates and cities are current as of that day and change as cohorts open.",
          "Bootcamp testimonials appear unattributed because they are unattributed on your site. We did not add names.",
          "The video uses your Bootcamp and Startup Train footage, set to licensed music (Mixkit's free commercial license, cleared for web and social, not for TV or radio broadcast).",
        ],
        videos: foundationVideos,
      },
    ],
  },
];
