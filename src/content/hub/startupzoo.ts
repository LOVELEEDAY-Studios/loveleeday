import { TOKENS } from "@/content/tokens";

/* Startup Zoo (Kalamazoo entrepreneurship hub, 501(c)(3)). Daniel is inside this one: Dabney & Co is
   a 2024–2025 resident, he sits on Carl Brown's "Braintrust" for the new space, and he was at the
   2026 Summit on September 21–22. So the page speaks as a member, not a vendor.
   Every finding was read on September 23, 2026 and says where from. */

export type Theme = "front" | "impact" | "programs" | "records";

export type Finding = {
  theme: Theme;
  title: string;
  detail: string;
  status: "verified" | "ask";
  src: { label: string; url: string };
  catches: string;
};

export const themes: Record<Theme, { name: string; line: string }> = {
  front: { name: "The front door", line: "What a founder, a funder or a sponsor sees first." },
  impact: { name: "Proof of impact", line: "The numbers a funder asks for, and where they live today." },
  programs: { name: "Programs and pipeline", line: "How a founder gets in, and what happens after." },
  records: { name: "Records and details", line: "Small things that are cheap to fix and costly to leave." },
};

const SZ = (p = "") => `https://startupzoo.org/${p}`;

export const findings: Finding[] = [
  {
    theme: "front",
    title: "The homepage downloads 11.2 MB and takes 8.7 seconds to finish loading.",
    detail: "One image, 1.png, is 6.43 MB on its own, and the membership graphic is another 3.06 MB. Images are 10.9 of the 11.2 MB. Compressed, the whole page would fit in under 1.5 MB.",
    status: "verified",
    src: { label: "Chromium at 1440×900, every response counted", url: SZ() },
    catches: "Site watch",
  },
  {
    theme: "front",
    title: "The homepage's title is “Startup Zoo |”, with nothing after the bar, and there is no meta description.",
    detail: "That title is what shows in a Google result and a browser tab. It is also how search engines and link previews describe the Zoo, so today they make up their own summary.",
    status: "verified",
    src: { label: "startupzoo.org, page head", url: SZ() },
    catches: "Site watch",
  },
  {
    theme: "front",
    title: "The homepage has three top-level headings, and three of its five images have no description.",
    detail: "“A Hub of Opportunity”, “News” and “Founder Spotlight” are all marked as the page's main heading. Screen readers and search engines use that heading to understand the page.",
    status: "verified",
    src: { label: "Page structure read in Chromium", url: SZ() },
    catches: "Site watch",
  },
  {
    theme: "front",
    title: "The old summit address, startupzoo.org/summit, returns “page not found” and still shows up in search.",
    detail: "The menu now points to /2026-summit, which works. Anyone arriving from a search result or an old post lands on an error page instead.",
    status: "verified",
    src: { label: "startupzoo.org/summit, HTTP 404", url: SZ("summit/") },
    catches: "Site watch",
  },
  {
    theme: "front",
    title: "The keynote's name is spelled two ways on the Summit page.",
    detail: "The bio reads “Jewel Burks Solomon” and the speaker line under it reads “Jewel Burks Soloman”. A small thing, but she is the headline name, and the page will be shared after the event.",
    status: "verified",
    src: { label: "2026 Summit page", url: SZ("2026-summit/") },
    catches: "Site watch",
  },
  {
    theme: "impact",
    title: "The Programs page still shows “Our 2023 Goals”: 50 founders funded, 12 companies housed, $100,000 equity-free, 500 supported.",
    detail: "They are goals, and the page does not say how 2023, 2024 or 2025 turned out. Funders read a goal with no result next to it as a missed target, even when the Zoo beat it.",
    status: "verified",
    src: { label: "Programs page, number counters", url: SZ("programs/") },
    catches: "Impact on demand",
  },
  {
    theme: "impact",
    title: "Nowhere on the site says how many companies the Zoo has served, how much it has awarded, or what those founders went on to raise.",
    detail: "Pitch Night alone has awarded $10,000 at a time, every other month, and an alumnus (Coordinista) has announced a pre-seed round. Those totals exist somewhere; they are not in one place a funder can see.",
    status: "ask",
    src: { label: "About, Programs and News pages", url: SZ("about/") },
    catches: "Impact on demand",
  },
  {
    theme: "impact",
    title: "The newest news post is from November 19, 2025, ten months ago, and the Summit two days ago has no recap yet.",
    detail: "Six of the seven posts carry the same date, February 20, 2025, which reads as a one-day import. The Summit, with Jewel Burks Solomon and the PitchMI semifinal for $250,000, is the strongest story the Zoo has had this year.",
    status: "verified",
    src: { label: "startupzoo.org/news", url: SZ("news/") },
    catches: "Story engine",
  },
  {
    theme: "programs",
    title: "The Residency section still gives the program dates as March 13, 2023 to February 28, 2024.",
    detail: "Below it, the page lists the 2024–2025 residents. A founder reading it cannot tell when the next cohort starts, and the button says to join a waitlist while the text says applications are closed.",
    status: "verified",
    src: { label: "Programs page, Program Timeframe", url: SZ("programs/") },
    catches: "Founder pipeline",
  },
  {
    theme: "programs",
    title: "The site says the Residency houses six companies. Carl's June 22 update to the Braintrust says eight are still operating from the space.",
    detail: "Both can be true, since cohorts overlap, but the public number undersells the Zoo by a third.",
    status: "ask",
    src: { label: "Programs page; Braintrust update, June 22, 2026", url: SZ("programs/") },
    catches: "Impact on demand",
  },
  {
    theme: "programs",
    title: "A founder's path runs through five tools that do not talk to each other.",
    detail: "Pitch applications are a Google Form, tickets are on Eventbrite, the Summit registers on Luma, space requests are a web form, and HubSpot tracks visitors. Nobody can see one founder's whole history with the Zoo without opening all five.",
    status: "verified",
    src: { label: "Link targets on the Pitch, Space and Summit pages", url: SZ("pitch/") },
    catches: "Founder pipeline",
  },
  {
    theme: "programs",
    title: "The homepage lists member benefits, including a Business Grant Database. The Join page is an email sign-up, with no tiers, no price and no database.",
    detail: "Membership is open to Kalamazoo County residents only, per the FAQ. A founder who clicks Join to get the grant database gets a newsletter.",
    status: "verified",
    src: { label: "Homepage member benefits; Join page", url: SZ("membership-join/") },
    catches: "Live grant database",
  },
  {
    theme: "programs",
    title: "Space rents at $150 an hour through a request form, with no calendar of what is free.",
    detail: "Every booking is an email back and forth. With the new space opening, that load grows with every room.",
    status: "verified",
    src: { label: "startupzoo.org/space", url: SZ("space/") },
    catches: "Space and membership",
  },
  {
    theme: "records",
    title: "The IRS lists Startup Zoo Inc at 112 W South St. The site and the Pitch page use 229 E Michigan Ave, Suite 335.",
    detail: "The IRS record also shows the 501(c)(3) ruling as October 2024, so no Form 990 is public yet. Worth confirming the address the IRS and funders have on file before the first 990 is filed.",
    status: "ask",
    src: { label: "IRS exempt organizations data via ProPublica, EIN 46-4930151", url: "https://projects.propublica.org/nonprofits/organizations/464930151" },
    catches: "Records and deadlines",
  },
  {
    theme: "records",
    title: "The November 13 Pitch Night is listed on Eventbrite at 314 S Park St; the Pitch page gives 229 E Michigan Ave.",
    detail: "If the venue moved, the Pitch page and the application form should say so before tickets go out.",
    status: "ask",
    src: { label: "Eventbrite listing, Pitch Night, Nov 13, 6:00 PM", url: "https://www.eventbrite.com/d/mi--kalamazoo/startup-zoo/" },
    catches: "Founder pipeline",
  },
];

export const strengths = [
  { k: "100+", label: "Founders and funders at the 2026 Summit, with Collab Capital's Jewel Burks Solomon as keynote", src: "2026 Summit page" },
  { k: "$250,000", label: "PitchMI AI & Software semifinal hosted alongside, with MSU Research Foundation and MEDC", src: "2026 Summit page" },
  { k: "$10,000", label: "Equity-free, to one founder every other month at Pitch Night", src: "Pitch and Programs pages" },
  { k: "9", label: "Residency companies named across two cohorts, one with a pre-seed round announced", src: "Programs and News pages" },
];

export const layers = [
  {
    name: "Founder pipeline",
    does: "Every applicant, pitch, community vote, resident and alumnus in one record, read from the Google Forms, Eventbrite, Luma and HubSpot the Zoo already runs. One founder, one history.",
    would: "The out-of-date Residency dates and the five disconnected sign-up tools.",
  },
  {
    name: "Impact on demand",
    does: "Dollars awarded, companies served, jobs, and what alumni raised afterwards, kept current from the pipeline and from founders' own updates. A funder report in a minute, with every figure sourced.",
    would: "The 2023 goals with no results beside them, and the six-versus-eight residency count.",
  },
  {
    name: "Investor matching",
    does: "The Residency promises introductions to at least 50 investors. Arthur keeps each fund's thesis, check size and recent deals, and matches them to each resident's stage and sector, starting with the funds from this week's panels.",
    would: "Introductions made from memory instead of from who is actually writing checks.",
  },
  {
    name: "Live grant database",
    does: "The member benefit, made real: Michigan and federal grants, MEDC programs and deadlines, read continuously and matched to each member's business, with the next deadline on top.",
    would: "A Join button that promises a grant database and delivers a newsletter.",
  },
  {
    name: "Space and membership",
    does: "For the new space: rooms, bookings, member billing, sponsored memberships and the event calendar in one place, with members booking what is free instead of emailing.",
    would: "Every $150-an-hour booking starting as an email thread.",
  },
  {
    name: "Story engine",
    does: "Each Pitch Night, Summit and funding announcement drafted into a news post, a sponsor update and social posts the same week, for a person to approve.",
    would: "Ten months without a post, and no Summit recap two days after the Summit.",
  },
];

export const nextQuestions = [
  { q: "Which Pitch Night finalists raised money afterwards, from whom, and how long after?", joins: "Pitch records, alumni updates and public funding announcements" },
  { q: "What has every equity-free dollar returned in revenue and jobs, by cohort?", joins: "Awards, residency metrics and founder reports" },
  { q: "Which funds are writing checks right now that fit each resident's stage and sector?", joins: "Resident profiles and fund activity" },
  { q: "Which open Michigan grants fit which members this month, and when are they due?", joins: "Grant programs and member profiles" },
  { q: "Which sponsors renew this quarter, and what did their sponsorship deliver?", joins: "Sponsor agreements, event attendance and press" },
  { q: "Which members have not booked, attended or opened anything in 60 days?", joins: "Bookings, Eventbrite, Luma and HubSpot" },
  { q: "Which Summit attendees asked for a follow-up, and did anyone send it?", joins: "Luma registrations and the Zoo's inbox" },
  { q: "Which residents are close to the milestones the Residency sets, and which are stuck?", joins: "Residency metrics reviews" },
];

/* Proof from inside the building: Dabney is a 2024–2025 resident and runs on Arthur today. */
export const proof = [
  { k: "Books", d: "Every bank line categorised and reconciled, with the evidence for each." },
  { k: "Events", d: "Inquiries answered, quotes built, deposits and follow-ups tracked for every private event." },
  { k: "Marketing", d: "Event covers, ads and scheduled posts, made and published with approval." },
  { k: "Compliance", d: "Licences, renewals and filings on one calendar, with the deadline and the source." },
];

export const hubClients = [
  {
    token: TOKENS.startupzoo ?? "",
    short: "Startup Zoo",
    preparedFor: "Carl Brown",
    role: "Executive Director",
    studyToken: TOKENS.startupzooStudy,
  },
].filter((c) => c.token);

export const getHub = (token: string) => hubClients.find((c) => c.token === token);
