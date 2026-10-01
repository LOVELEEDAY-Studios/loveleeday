import { TOKENS } from "@/content/tokens";

/* NowKalamazoo, Kalamazoo County's nonprofit newsroom, a program of The Local Journalism Foundation, Inc.
   (EIN 93-2232138). Prepared for Ben Lando, Publisher. Kristie May, the Managing Editor, is Daniel's wife,
   so the page speaks as a neighbor who knows the newsroom, and it leaves staff pay and anything on the
   990 about related parties alone. Every finding was read on September 30, 2026 and says where from. */

export type Theme = "beat" | "desk" | "revenue" | "front";

export type Finding = {
  theme: Theme;
  title: string;
  detail: string;
  status: "verified" | "ask";
  src: { label: string; url: string };
  catches: string;
};

export const themeOrder: Theme[] = ["beat", "desk", "revenue", "front"];

export const themes: Record<Theme, { name: string; line: string }> = {
  beat: { name: "The civic beat", line: "Forty-four public bodies, and the meetings readers never see." },
  desk: { name: "The daily desk", line: "A 6 a.m. newsletter, five days a week, and the calendar behind it." },
  revenue: { name: "Readers, sponsors and funders", line: "The numbers a funder or a sponsor asks for, and where they live." },
  front: { name: "The front door", line: "Small things on the site that are cheap to fix." },
};

const NK = (p = "") => `https://nowkalamazoo.org/${p}`;
const KIT = NK("wp-content/uploads/2025/07/NK-Media-Kit-July-2025.pdf");
const DIRECTORY = NK("kalamazoo-county-local-government-meeting-directory/");

export const hero = {
  a: "Kalamazoo's newsroom,",
  b: "with a second set of eyes.",
  lede:
    "We pointed Arthur at NowKalamazoo the way a new reporter would spend a first week: every page of nowkalamazoo.org, the meeting directory, the events calendar, the media kit, the Foundation's filings and the public record around them. Then it kept going, the way it would every morning: it read the agendas already posted across the county, drafted the records requests they suggest, and matched what you publish against the funders who fund it. These are first findings from the outside, read on September 30, 2026. They are almost all about the machinery around the journalism, not the journalism, which is the part nobody should touch.",
};

export const strengths = [
  { k: "$124,902", label: "Raised in CommunityMatch 2025 from 603 supporters, against a $110,000 goal", src: "Givebutter campaign page" },
  { k: "$719,567", label: "Foundation revenue in fiscal 2025, up from $165,023 two years earlier, 91% of it contributions", src: "Form 990, via ProPublica" },
  { k: "27", label: "Stories published September 1 to 28, including the five-part Resisting & Obstructing investigation", src: "nowkalamazoo.org posts" },
  { k: "6 a.m.", label: "The Daily News, every weekday: 23 issues in September alone", src: "nowkalamazoo.org/newsletter" },
];

export const strengthsNote =
  "Three years from fiscal sponsorship to a newsroom of ten with 27 freelancers, a funded investigative desk and a donor base that beat its match. The findings below are not about the reporting. They are about the hours the reporting costs: the meetings someone has to watch, the newsletter someone has to assemble, and the reports funders and sponsors ask for.";

export const findings: Finding[] = [
  {
    theme: "beat",
    title: "The meeting directory covers 44 public bodies and 96 meetings. It is a snapshot from a Google Sheet, generated July 10.",
    detail:
      "Five county and city bodies, 15 townships, three villages, seven school districts and 14 neighborhood associations, published from the Foundation's own GitHub repository. It holds schedules and contacts, not agendas, packets or minutes, and nothing tells a reporter when an agenda posts.",
    status: "verified",
    src: { label: "Meeting directory and its data file", url: DIRECTORY },
    catches: "Meeting watch",
  },
  {
    theme: "beat",
    title: "Policies and power is the biggest beat on the site, with 251 stories. The September news ran on City Commission votes.",
    detail:
      "The Flock camera policy on September 22, the data-center pause, the boil-water advisory. Since July 1 the site mentions the County Board 12 times and school boards 10. Each of those started with someone reading an agenda.",
    status: "verified",
    src: { label: "Category archive and September newsletters", url: NK("newsletter/") },
    catches: "Meeting watch",
  },
  {
    theme: "beat",
    title: "Three dates in the directory are wrong this month: the County Board meets October 6, not October 1; Portage City Council October 6, not October 13; the KPS board October 8, not October 1.",
    detail:
      "The directory's written schedules point one way and each body's own posted calendar points another. A reporter planning the week from the directory would be at the wrong meeting, or miss the right one.",
    status: "verified",
    src: { label: "Kalamazoo County's posted meeting calendar", url: "https://kalamazoocomi.civicclerk.com/" },
    catches: "Meeting watch",
  },
  {
    theme: "beat",
    title: "Agendas posted today hold stories nobody has written yet: a proposed 4.74% county millage increase worth $4.49 million, with a public hearing October 6.",
    detail:
      "The same week, the County's health-plan packet weighs dropping or rationing GLP-1 weight-loss drug coverage after $1.5 million in 2025 spending, and the City Planning Commission hears a recovery-house permit at 1500 Fraternity Village Drive. We found no NowKalamazoo story on any of the three.",
    status: "verified",
    src: { label: "County and City agenda packets, posted for October 1 to 7", url: "https://kalamazoocomi.civicclerk.com/" },
    catches: "Story and records desk",
  },
  {
    theme: "beat",
    title: "59 of the 96 public bodies in the directory have not been mentioned since July 1, Oshtemo Township among them, with packets posted regularly.",
    detail:
      "Coverage concentrates, reasonably, on the City and the County. The townships, villages and school boards are where the next data-center, battery or zoning fight starts. Comstock's 400 MW battery plant came through its Planning Commission before it became news.",
    status: "verified",
    src: { label: "NowKalamazoo archive search against the directory", url: DIRECTORY },
    catches: "Meeting watch",
  },
  {
    theme: "beat",
    title: "The Resisting & Obstructing series was built from charge records, by race and residence, and the newsroom runs Sunshine Week events every year.",
    detail:
      "Records work like that runs on requests, deadlines and follow-ups. We could not see from outside how requests are tracked today, or whether the five-business-day clock under Michigan's FOIA is kept anywhere but a reporter's head.",
    status: "ask",
    src: { label: "Resisting & Obstructing, September 27 to 28", url: NK() },
    catches: "Story and records desk",
  },
  {
    theme: "desk",
    title: "The Daily News goes out at 6 a.m. every weekday, compiled by hand: a lead, two “Also” items and the day's events.",
    detail:
      "Ben Jones has built it since 2020. Each issue is a post on the site, published through Newsletter Glue, so every piece it draws on (the morning's stories, meeting items, the calendar) is already in WordPress.",
    status: "verified",
    src: { label: "Newsletter archive, 23 issues in September", url: NK("newsletter/") },
    catches: "Morning desk",
  },
  {
    theme: "desk",
    title: "The events calendar holds 15,782 events, fed by a public submission form and an aggregator.",
    detail:
      "The Events Calendar's import tool and its Zapier and Power Automate connections are already switched on. At that volume, duplicates, missing descriptions and past events left in feeds become an editor's afternoon.",
    status: "verified",
    src: { label: "Events calendar and its public API", url: NK("events/") },
    catches: "Calendar keeper",
  },
  {
    theme: "desk",
    title: "Publishing is uneven: 6 stories in all of August, then 15 in the week of September 21.",
    detail:
      "Some of that is the series landing at once, and some is summer. Either way, the weeks between investigations are the weeks a desk needs leads handed to it.",
    status: "verified",
    src: { label: "Posts by week, read from the site", url: NK() },
    catches: "Meeting watch",
  },
  {
    theme: "revenue",
    title: "The site and the media kit give different audience numbers: 8,000 subscribers on one, 11,000 on the other.",
    detail:
      "The sponsorship page says “more than 8,000 unique subscribers” and about 15,000 monthly visitors. The media kit, updated May 2025, says 11,000+ and about 20,000 sessions a month. A sponsor who reads both will ask which is true.",
    status: "verified",
    src: { label: "Sponsorship page and media kit", url: NK("sponsorship/") },
    catches: "Readers and sponsors",
  },
  {
    theme: "revenue",
    title: "The sponsor impact report is assembled by hand, and the public template still carries placeholder text and an old address.",
    detail:
      "Sends, opens and impressions are typed into a table for each day of a run. With 11 sponsorship products, from a $50 event highlight to a 12-month coverage underwriter, every sponsor is owed one of these.",
    status: "verified",
    src: { label: "Sponsorship impact summary PDF", url: NK("wp-content/uploads/2024/05/NowKalamazoo-Sponsorship-Impact-Summary.pdf") },
    catches: "Readers and sponsors",
  },
  {
    theme: "revenue",
    title: "Donations, recurring billing, site analytics and the email list sit in four separate systems.",
    detail:
      "Givebutter, Stripe, Google Analytics and the newsletter platform each hold part of the reader. Nobody can see, without exporting all four, which of the 603 CommunityMatch donors read the newsletter every day, or which daily readers have never given.",
    status: "verified",
    src: { label: "Support Us page and site tags", url: NK("support-us/") },
    catches: "Readers and sponsors",
  },
  {
    theme: "revenue",
    title: "Ten funders gave $5,000 or more, the County added $24,706 for 2026, and a Grants and Impact Coordinator keeps it all straight.",
    detail:
      "Carroll J Haas, Joyce, the Kalamazoo Community Foundation, the Michigan Justice Fund, Parish, INN and others, plus NewsMatch and LocalMatch cycles that end January 1. Each has its own report and its own date. We could not see how those dates are tracked today.",
    status: "ask",
    src: { label: "Foundation donor list; County grant announcement", url: "https://www.kalcounty.gov/m/newsflash/Home/Detail/159" },
    catches: "Grant radar",
  },
  {
    theme: "revenue",
    title: "Twelve funders whose programs match what NowKalamazoo already publishes have never funded it. Two of them close this month.",
    detail:
      "ProPublica's Local Reporting Network (letters due October 15, a reporter's salary up to $80,000) fits the Resisting & Obstructing investigation almost word for word. Report for America (due October 19, half a reporter's salary in year one) fits Policies & Power and a housing beat that fell to one story this year.",
    status: "verified",
    src: { label: "ProPublica Local Reporting Network page", url: "https://www.propublica.org/how-to-apply/local-reporting-network" },
    catches: "Grant radar",
  },
  {
    theme: "front",
    title: "The donation page loads 160 files and takes 21 seconds to settle.",
    detail:
      "The Google Maps, Stripe and Givebutter scripts load up front, and reCAPTCHA loads more than once. Most other pages finish in about two seconds. The page that asks for money is the slowest one on the site.",
    status: "verified",
    src: { label: "Chromium at 1366×900, every request counted", url: NK("support-us/") },
    catches: "Site watch",
  },
  {
    theme: "front",
    title: "The homepage has no main heading, and the events page has two and an empty description.",
    detail:
      "The events page title also reads “NowKalamazoo – NowKalamazoo”, and the sponsorship description says “We offers advertising”. Small, but they are what Google and link previews show.",
    status: "verified",
    src: { label: "Page structure read in Chromium", url: NK("events/") },
    catches: "Site watch",
  },
  {
    theme: "front",
    title: "The history timeline stops in early 2025, and the team page says the first full-time hires came in 2025 while the history says 2022.",
    detail:
      "The About page was last updated in October 2024. The time since includes the CommunityMatch result and a newsroom of ten, and the story of the newsroom does not tell it yet.",
    status: "verified",
    src: { label: "History and Team pages", url: NK("history/") },
    catches: "Site watch",
  },
];

export const layers = [
  {
    name: "Meeting watch",
    does:
      "Every agenda, packet and set of minutes from the 44 bodies in your directory, read as it posts. Arthur flags what matches your beats (Flock, data centers, contracts, zoning, budgets) to the right reporter, with the page and the item number.",
    would: "A directory that was last refreshed in July and a beat that depends on someone remembering to check.",
  },
  {
    name: "Story and records desk",
    does:
      "Every morning, the leads in the public record that nobody has written yet: budget lines, contracts, permits, federal awards, campaign filings. Each one comes with its source and a drafted Michigan FOIA request, and every request filed is tracked against its five-business-day clock.",
    would: "A $4.49 million millage increase and a GLP-1 coverage fight sitting in posted agendas with no story.",
  },
  {
    name: "Grant radar",
    does:
      "Reads what the newsroom publishes, measures its beats, and matches them against what funders say they fund, before anyone asks. Every match comes with the deadline, the eligibility test and the program contact, and every existing grant's report dates sit on one calendar for Samad.",
    would: "ProPublica and Report for America closing this month, both fitting work the newsroom has already published.",
  },
  {
    name: "Morning desk",
    does:
      "A draft of the 6 a.m. newsletter waiting at 5: the day's stories, the meeting items worth a line and the events worth a mention, laid out in the issue's usual shape for Ben to edit. Nothing goes out without a person.",
    would: "Five early mornings a week spent assembling instead of editing.",
  },
  {
    name: "Calendar keeper",
    does:
      "Reads venue and nonprofit calendars, removes duplicates, fills in missing details, clears out past events and flags the ones a Premier Event or Event Highlight could be sold to.",
    would: "A calendar of 15,782 events kept clean by hand.",
  },
  {
    name: "Readers and sponsors",
    does:
      "Givebutter, Stripe, Google Analytics and the email list joined into one reader record with one audience figure everyone can quote. Each sponsor's run gets its impact report the day it ends, and a renewal note goes to Gabrielle 30 days before a slot lapses.",
    would: "8,000 subscribers on one page, 11,000 in the media kit, and a hand-typed impact report.",
  },
];

export const nextQuestions = [
  { q: "What is on every public agenda in the county this week that touches a story we are already following?", joins: "Agendas and packets from the 44 bodies, and the newsroom's own archive" },
  { q: "Which votes did we not cover this month, and did any of them matter?", joins: "Minutes, the archive and the newsletter" },
  { q: "Which daily readers have never given, and which donors have stopped opening?", joins: "Email list, Givebutter and Stripe" },
  { q: "What did each sponsor's run actually deliver, and who is up for renewal next month?", joins: "Sponsor bookings, sends and opens" },
  { q: "Which funders fit what we published this month, and who do we talk to there?", joins: "The archive and every funder's published program" },
  { q: "Which grant reports are due before January 1, and what numbers does each one need?", joins: "Grant agreements and the reader record" },
  { q: "Which stories brought in new subscribers, and which brought in donors?", joins: "Google Analytics, the email list and Givebutter" },
  { q: "Which records requests are past their deadline, and with which agency?", joins: "The records log" },
  { q: "Which neighborhoods and townships have we not written about this year?", joins: "The archive and the meeting directory" },
];

export const proof = {
  eyebrow: "Already running in town",
  a: "A Kalamazoo business",
  b: "runs on Arthur today.",
  line:
    "Dabney & Co runs on Arthur every day, and Arthur has already built an analysis of Kalamazoo County government from its public records. The habits are the ones a newsroom already keeps: read everything, cite the source, let a person decide.",
  items: [
    { k: "Books", d: "Every bank line categorized and reconciled, with the evidence for each." },
    { k: "Events", d: "Inquiries answered, quotes built, deposits and follow-ups tracked for every private event." },
    { k: "Marketing", d: "Event covers, ads and scheduled posts, made and published only with approval." },
    { k: "Compliance", d: "Licenses, renewals and filings on one calendar, with the deadline and the source." },
  ],
};

export const security = [
  {
    t: "Arthur never writes the journalism",
    d: "It watches, gathers, sorts and drafts the operational work: agenda flags, newsletter layouts, reports. Reporting, writing and every editorial decision stay with the newsroom, and nothing is published without an editor.",
  },
  {
    t: "Sources stay protected",
    d: "Notes, drafts, records requests and anything that could identify a source sit in a separate environment for NowKalamazoo alone. Nothing about a source is read unless the newsroom puts it there, and you can export everything and have it deleted.",
  },
  {
    t: "Donors and readers are yours",
    d: "Reader and donor data is never sold, shared, used for marketing or used to train a model, which keeps faith with your own promise of no ad trackers that sell reader data. We choose AI providers under contracts that say the same.",
  },
  {
    t: "Independence by design",
    d: "Arthur has no say in what gets covered, and every action it takes is logged where the newsroom can read it. A sponsor or funder relationship never touches the editorial queue.",
  },
];

export const begin = {
  a: "Before the election.",
  b: "Then every morning after.",
  steps: [
    [
      "Watch the meetings that matter for November",
      "The County, the cities and the school boards in your directory, read as agendas post, with flags to the reporter on each beat, through Election Day on November 3.",
    ],
    [
      "Two grant letters before October 19",
      "The ProPublica Local Reporting Network letter (due October 15) built on the Resisting & Obstructing series, and the Report for America host application (due October 19), drafted from your own published work for Samad and Ben to finish.",
    ],
    [
      "A draft of the Daily News at 5 a.m.",
      "Built in the issue's own shape from the night's stories, meetings and calendar, for Ben to edit. Two weeks side by side with the hand-built issue before it changes anything.",
    ],
    [
      "One set of audience numbers",
      "Givebutter, Stripe, the email list and Google Analytics joined, so the next sponsor report and the next grant report quote the same figure.",
    ],
    [
      "Sponsor and funder reports on autopilot",
      "Impact reports at the end of every run, and every funder's dates on one calendar, before the January 1 match deadline.",
    ],
  ] as [string, string][],
};

export const sources = [
  "Every public page of nowkalamazoo.org was read on September 30, 2026, including the site's public WordPress, newsletter and events APIs, which give the post, issue and event counts.",
  "Page weight and load times were measured in Chromium at 1366 by 900 with an empty cache. Sizes are decoded response bodies, so they are best read against each other rather than as exact downloads.",
  "The meeting directory figures come from the Foundation's public GitHub repository (Local-Journalism-Foundation/public-meeting-directory) and its data file, generated July 10, 2026.",
  "Revenue figures come from The Local Journalism Foundation's Forms 990 and 990-EZ (EIN 93-2232138), via ProPublica's Nonprofit Explorer.",
  "The rate card, audience figures and impact report template come from the NowKalamazoo media kit (updated May 2025) and the sponsorship pages.",
  "Funders come from the Foundation's donor list, the CommunityMatch 2025 Givebutter page and Kalamazoo County's November 18, 2025 grant announcement.",
  "Agendas and packets were read on September 30, 2026 from each body's own posting site (CivicClerk for the City and County), and coverage was checked against the NowKalamazoo archive since July 1, 2026.",
  "Grant programs, deadlines, eligibility and contacts come from each funder's own page, read September 30, 2026. Where a funder publishes no program officer, none is named.",
  "A finding marked “Worth confirming” is one the public record cannot settle. It is not a claim that something was missed.",
];

/* What Ask Arthur may say about the reader and the relationship. Facts only, all from the sources above. */
export const askFacts = [
  "READER: Ben Lando, Publisher of NowKalamazoo and President of the board of The Local Journalism Foundation, Inc., the 501(c)(3) (EIN 93-2232138) that owns and operates NowKalamazoo, at 162 E. Michigan Ave., Kalamazoo. Day-to-day operations are run by Ben Lando, Reid Williams (Civic and Audience Engagement) and Kristie May (Managing Editor). Ben Jones runs tech and the newsletter, Samad Nadeem is Grants and Impact Coordinator, Gabrielle Contesti runs sponsorship and partnerships, Elizabeth Clark is Events and Nonprofit Outreach Editor.",
  "NEWSROOM: founded 2019 by Ben Lando, daily newsletter since 2020, independent nonprofit since 2023. Ten staff and 27 freelancers. Member of INN, LION Publishers and the Michigan Press Association. The 6 a.m. Daily News every weekday and the monthly Northside News. Site runs on WordPress with Newsletter Glue, The Events Calendar and Gravity Forms. Donations through Givebutter and Stripe.",
  "RELATIONSHIP: Daniel May of LOVELEEDAY owns Dabney & Co in Kalamazoo, which runs on Arthur. Kristie May, NowKalamazoo's Managing Editor, is Daniel's wife. Say so plainly if asked; do not discuss pay or the Foundation's related-party disclosures.",
  "ALREADY FOUND FROM PUBLIC DATA: 12 story leads from agendas posted for October 1 to 14 (including a proposed 4.74% county millage increase worth $4.49 million with a hearing October 6, and County health-plan GLP-1 coverage after $1.5 million in 2025 spending), 5 drafted Michigan FOIA requests, 59 of 96 directory bodies with no mention since July 1, and three wrong dates in the directory. Grants: 12 funders matched to NowKalamazoo's published beats that have not funded it, led by ProPublica's Local Reporting Network (letters due October 15, reporter salary up to $80,000, fits Resisting & Obstructing) and Report for America (due October 19, 50% of a reporter's salary in year one, fits Policies & Power and housing), plus Pulitzer Center local reporting grants (rolling) and a new Joyce Foundation project (due December 1).",
  "FIRST 30 DAYS: meeting watch on the County, cities and school boards in the directory through the November 3 election; the ProPublica and Report for America applications drafted before their deadlines; a 5 a.m. draft of the Daily News run side by side with the hand-built issue for two weeks; one joined set of audience numbers; automatic sponsor impact reports and a funder deadline calendar before the January 1 match deadline.",
  "NOT CONNECTED YET: NowKalamazoo's WordPress admin, email platform, Givebutter, Stripe, Google Analytics, grant agreements, sponsor bookings and any records log. Arthur has read only public pages and public filings.",
];

export const nowClients = [
  {
    token: TOKENS.nowkalamazoo ?? "",
    short: "NowKalamazoo",
    preparedFor: "Ben Lando",
    role: "Publisher",
  },
].filter((c) => c.token);

export const getNow = (token: string) => nowClients.find((c) => c.token === token);
