import { TOKENS } from "@/content/tokens";
/* Bogan Developments, Kalamazoo. Prepared for Jamauri Bogan.
   capability here is proposed, not running. No price appears: terms are set after the walkthrough. */

export const meta = {
  token: TOKENS.bogan ?? "",
  short: "Bogan Developments",
  preparedFor: "Jamauri Bogan",
  role: "CEO and Founder",
  proofLine: "Everything proposed here is one discipline pointed at housing: a sourced answer, and a person who approves anything that leaves the building.",
};

export const hero = {
  a: "You are building at institutional scale.",
  b: "The record should show it.",
  lead: "Bogan Developments is delivering or partnering on 187 homes, with Bronson Healthcare, MSHDA, Kalamazoo County and the Pokagon Band's investment arm at the table. A lender, an employer or a city searching for you today finds very little of that. This page shows what we found in your public record, how you place when someone is looking, a complete new website, and where an intelligence layer would carry weight as you build past your first city.",
};

export const numbers = [
  { k: "187", label: "homes delivered or planned across two counties: 135 led by Bogan, 52 as development partner", src: "12 + 38 + 85 + 52, Bogan site and Second Wave" },
  { k: "0 of 6", label: "category searches where you reach page one of Google, including \"affordable housing developer Kalamazoo\"", src: "Google, Kalamazoo location, Nov 5, 2026" },
  { k: "0", label: "unit counts, dollar figures or awards on your homepage", src: "bogandevelopments.com, read Nov 5, 2026" },
  { k: "$42M", label: "a year in Michigan's new state housing tax credit, first application windows tentatively December 4, 2026 and January 4, 2027", src: "Thomson Reuters, July 28, 2026; Plante Moran" },
];

type Src = { label: string; url: string };

const S = {
  site: { label: "bogandevelopments.com", url: "https://bogandevelopments.com" },
  lead: { label: "Our Leadership page", url: "https://bogandevelopments.com/our-leadership" },
  blog: { label: "Bogan blog", url: "https://bogandevelopments.com/blog" },
  sw0204: { label: "Second Wave, Feb 4, 2026", url: "https://secondwavemedia.com/new-complex-at-burdick-and-vine-will-mark-the-intersection-of-needed-housing-and-healthy-living/" },
  sw0612: { label: "Second Wave, June 12, 2026", url: "https://secondwavemedia.com/phase-ii-of-a-northside-kalamazoo-housing-project-gets-2-million-investment/" },
  sw0911: { label: "Second Wave, Sept 11, 2026", url: "https://secondwavemedia.com/10-6-million-expansion-of-northside-housing-project-will-add-38-more-apartments/" },
  wwmt23: { label: "WWMT, March 28, 2023", url: "https://www.wwmt.com/news/local/jamauri-bogan-development-northside-neighborhood-kalamazoo-housing-child-care-park-street-brownfield-development" },
  kzcf: { label: "Kalamazoo Community Foundation", url: "https://kzcf.org/news-resources/impact-investments/breaking-barriers/" },
  bridge: { label: "Bridge Michigan, Jan 8, 2026", url: "https://bridgemi.com/michigan-government/michigan-helps-employers-build-housing-in-detroit-kalamazoo-as-fund-runs-dry/" },
  rej: { label: "REjournals, Sept 11, 2026", url: "https://rejournals.com/?p=187912" },
  indian: { label: "Indian Gaming, July 22, 2025", url: "https://www.indiangaming.com/pokagon-band-partners-on-affordable-housing-project/" },
  wmu: { label: "WMU Haworth College of Business", url: "https://wmich.edu/business/bogan2023" },
  holl: { label: "hollanderdevelopment.com", url: "https://hollanderdevelopment.com" },
  brin: { label: "brinshore.com", url: "https://www.brinshore.com" },
  tr: { label: "Thomson Reuters, July 28, 2026", url: "https://tax.thomsonreuters.com/news/michigan-enacts-housing-opportunity-tax-credit-program/" },
  pm: { label: "Plante Moran, Sept 8, 2026", url: "https://plantemoran.com/explore-our-thinking/insight/2026/plante-moran-realpoint/michigan-expands-real-estate-incentives" },
  mill: { label: "Second Wave, Jan 19, 2023", url: "https://secondwavemedia.com/kzoo-housing-grants-23/" },
  pali: { label: "Yahoo News, July 29, 2025", url: "https://www.yahoo.com/news/articles/retired-nuclear-plant-michigan-restart-211300363.html" },
  kal: { label: "WWMT, Dec 31, 2025", url: "https://www.wwmt.com/news/local/kalamazoo-housing-expansion-projects-substance-recovery-kalrecovery-vine-nez-tax-incentives-2026-wwmt" },
  port: { label: "WMUK, March 18, 2026", url: "https://www.wmuk.org/wmuk-news/2026-03-18/portage-considers-changing-its-zoning-rules-to-make-room-for-more-housing" },
  sh: { label: "Wilcox Newspapers, Sept 10, 2025", url: "https://wilcoxnewspapers.com/south-haven-city-council-discusses-housing" },
} satisfies Record<string, Src>;

export const strengths: { t: string; d: string; src: Src }[] = [
  { t: "A brownfield turned into homes and child care", d: "Zone 32 took a 1.4-acre former brownfield on the Northside and delivered 12 mixed-income homes and an early learning center operated by the YMCA, a $4.7 million project.", src: S.site },
  { t: "A hospital as a housing partner", d: "Bronson Healthcare owns the parcels at Burdick and Vine and will lease 20 units for its employees, inside an 85-home, five-story, $40 million plan. ", src: S.sw0204 },
  { t: "Agencies that keep coming back", d: "Three separate Kalamazoo County millage awards, $400,000 and then $2 million twice in 2026, plus MSHDA funding on all four projects.", src: S.sw0612 },
  { t: "A first tax-credit deal, beyond Kalamazoo", d: "Lighthouse Ridge, 52 homes in South Haven Township with Wallick and Mno-Bmadsen, the Pokagon Band's non-gaming investment arm. Berkadia closed $12.4 million in LIHTC equity.", src: S.rej },
];

export type Theme = "front" | "proof" | "capital" | "ops";
export const ORDER: Theme[] = ["front", "proof", "capital", "ops"];
export const themes: Record<Theme, { name: string; line: string }> = {
  front: { name: "The front door", line: "What a lender, an employer or a city sees in the first minute." },
  proof: { name: "One version of the numbers", line: "What happens when the record lives in several places." },
  capital: { name: "Capital and public money", line: "Where the next deal's stack comes from, and which sources have a clock on them." },
  ops: { name: "Growing past two names", line: "The commitments that have to be kept as the portfolio grows." },
};

export type Finding = { theme: Theme; title: string; detail: string; src: Src; catches: string };
export const findings: Finding[] = [
  { theme: "front", title: "The homepage opens with \"Not just buildings\" and gives no sense of scale.", detail: "No unit count, dollar figure, pipeline or award appears on it. Your nearest local peer leads with \"over 4,000 homes\", and Brinshore leads with 12,000 units and $4.8 billion. Mission is your strength, but the reader who decides a deal looks for scale first.", src: S.holl, catches: "one project record that feeds the site" },
  { theme: "front", title: "Every path ends at one general contact form.", detail: "A lender, a hospital system, a city planner and a resident all get the same button. The homepage carries no phone, email or address, and nothing says what working with you looks like or where to start.", src: { label: "Contact page", url: "https://bogandevelopments.com/contact" }, catches: "partner intake, routed to the right person" },
  { theme: "front", title: "The B on Burdick page gives no unit count, cost or date.", detail: "It is your largest project and the page runs about 229 words, menu included. The public record already holds 85 homes, five stories, about 101,000 square feet and $40 million. Zone 32 Phase II shows what the better version looks like, with milestones and progress photos.", src: S.sw0204, catches: "project pages that stay current" },
  { theme: "proof", title: "Your own pages tell the tax-credit story two ways.", detail: "The leadership page says Jamauri has secured multiple LIHTC awards. The blog calls Lighthouse Ridge the company's first. Both can be true, one for a career and one for the firm, but a syndicator reading both will ask.", src: S.lead, catches: "a claims register, each line with its source" },
  { theme: "proof", title: "The public record disagrees on Phase II affordability.", detail: "Second Wave reported 10 units at 60% of area median income in June and 10 units at no more than 40% in September. The same outlet has also named the YWCA, not the YMCA, as the child care operator. Reporters copy what is easiest to find.", src: S.sw0911, catches: "a press-ready fact sheet per project" },
  { theme: "proof", title: "The pipeline number in circulation is about three years old.", detail: "WMU's page still carries a pipeline figure from about 2023. The published costs of your projects, each with its own source, no longer reconcile to it. If the real number is higher, you should be the one publishing it.", src: S.wmu, catches: "a live pipeline figure you control" },
  { theme: "capital", title: "Zone 32 Phase I, 12 homes, took at least six capital sources.", detail: "MSHDA, the Michigan Strategic Fund, a brownfield capture, the City of Kalamazoo, the County and a 20-year $1.95 million Kalamazoo Community Foundation loan. No page anywhere shows that stack whole. It is the best evidence of how you work, and it isn't on your site.", src: S.wwmt23, catches: "a capital stack ledger per project" },
  { theme: "capital", title: "Two sources you have relied on now have a clock on them.", detail: "The state's Employer-Assisted Housing fund is spent, and the October 2025 budget added nothing. The county millage is scheduled through 2028. The next deal's stack should be drawn before those answers arrive, not after.", src: S.bridge, catches: "a funding calendar with renewal watch" },
  { theme: "capital", title: "You have said where the risk sits. It is before the money.", detail: "Your February post describes months or years of decisions before capital commits, and why access to early capital matters so much. Every week saved in predevelopment paperwork is risk taken off that part of the deal.", src: { label: "What Does It Take to Fund a Development Project?", url: "https://bogandevelopments.com/blog/what-does-it-take-to-fund-a-development-project" }, catches: "application drafts built from what you've already written" },
  { theme: "ops", title: "Two people are named on the leadership page, with three projects in motion and one delivered.", detail: "That is 175 homes still to deliver across three deals and two counties, each with its own lenders, agencies, architect and builder. There may be more of you than the page shows, which is its own front-door point.", src: S.lead, catches: "one place to ask what's due and who owes it" },
  { theme: "ops", title: "B on Burdick carries commitments that have to be tracked for years.", detail: "33% of construction work earmarked for minority- and women-owned firms, 20 units leased to Bronson, and income bands from 60 to 120% of area median. Each one becomes a report someone asks for.", src: S.sw0204, catches: "commitment tracking and funder reports" },
  { theme: "ops", title: "The blog has been quiet since May, in your busiest year.", detail: "Thirteen strong posts from August 2025 to May 11, 2026, then a groundbreaking, a $2 million county award and a Crain's feature with nothing new in your own voice. The news page is kept up. The thinking has paused.", src: S.blog, catches: "drafts from your milestones, for you to approve" },
];

export const placement = {
  note: "We ran the searches a capital partner, a city staffer or a resident would run. You own your name. You do not yet own what you do.",
  scope: "Google, searched from Kalamazoo on November 5, 2026, through a search results service. First page of results only (6 to 9 organic results each), so \"not on page one\" is the finding, not a position. You appear in none of the map results on these 11 searches. We did not verify whether a Google Business Profile exists. PageSpeed was not measured: the API's daily quota was used up.",
  rows: [
    { q: "Bogan Developments", pos: "1", onPage: true, top: "bogandevelopments.com" },
    { q: "Jamauri Bogan", pos: "1", onPage: true, top: "bogandevelopments.com" },
    { q: "Zone 32 Kalamazoo apartments", pos: "2", onPage: true, top: "instagram.com" },
    { q: "B on Burdick Kalamazoo", pos: "Not on page one", onPage: false, top: "kalamazoovillageapartments.com" },
    { q: "Lighthouse Ridge South Haven apartments", pos: "Not on page one", onPage: false, top: "apartments.com" },
    { q: "affordable housing developer Kalamazoo", pos: "Not on page one", onPage: false, top: "michigan.gov; Google's side panel shows Hollander Development" },
    { q: "workforce housing developer Michigan", pos: "Not on page one", onPage: false, top: "michiganworkforcehousing.org" },
    { q: "affordable housing developers West Michigan", pos: "Not on page one", onPage: false, top: "michigan.gov" },
    { q: "real estate developer Kalamazoo MI", pos: "Not on page one", onPage: false, top: "yelp.com" },
    { q: "mixed income housing Kalamazoo", pos: "Not on page one", onPage: false, top: "huduser.gov" },
    { q: "minority owned real estate developer Michigan", pos: "Not on page one", onPage: false, top: "michigandevelopers.org" },
  ],
};

export const siteAudit = [
  { t: "The homepage title is only your name", d: "\"Bogan Developments\" tells Google nothing about housing, Kalamazoo or Michigan. It is the single most valuable line on the site." },
  { t: "Nine H1 headings on the homepage", d: "A page should have one. The blog index has 13, and the press releases have none, so search engines can't tell what each page is about." },
  { t: "The description runs 365 characters", d: "Google shows about 155. The rest is cut." },
  { t: "11 of 15 homepage images have no alt text", d: "Your best proof is photographic and search engines can't read any of it. The same gap appears on the project pages." },
  { t: "The same pages live at two addresses", d: "/home repeats /, /about-1 repeats /who-we-are, /our-projects repeats /projects. Each pair splits what little ranking strength the page has. The news page is titled \"Our Projects\"." },
  { t: "Press releases read like file names", d: "Addresses and titles lead with dates such as 06032026, and one is published as \"01212026 Bogan Developments Press Release (Copy)\"." },
  { t: "Structured data calls you a local shop", d: "The template marks the firm as a LocalBusiness with opening hours. Nothing tells Google these are apartment communities, projects or a real estate developer." },
  { t: "A shopping cart sits in the header", d: "A store icon left on by the template, on a site with nothing to buy. It is small, and it is the kind of detail an institutional reader notices." },
];

export type Concept = { slug: string; name: string; line: string; idea: string; refs: string; best: string };
export const concepts: Concept[] = [
  { slug: "c2", name: "The Standard", line: "Belonging, to a standard.", idea: "A long-form editorial feature about a firm with a point of view. ELITE is set as a printed standard, and each letter is answered by a fact on the public record. This is the direction we took furthest: it includes a find-a-home page with a floor plan and 3D model for each layout, an income check and an inquiry form.", refs: "BGRE, the former Brookfield Properties.", best: "reputation, press, residents and the founder's story." },
];

export const needs: { t: string; d: string }[] = [
  { t: "Your original photographs", d: "The website host limits the files we can read to 2,500 pixels wide, and your portraits are smaller still. Your library holds larger originals, and we would use those instead of shrinking the pictures to fit." },
  { t: "Photographs from other organizations", d: "Your portrait, the working photographs and the Zone 32 Phase I interiors came from public pages of the Kalamazoo Community Foundation, the Michigan Small Business Development Center and AVB. None states a license. Tell us who took them and whether we may use them, or send us your own files." },
  { t: "Rights to the ribbon-cutting photograph", d: "It is the best picture of Jamauri we found, from an April 2024 news gallery, and it carries no credit. We need to know who owns it before it goes on a live site." },
  { t: "Permission for partner and press logos", d: "Each logo on these pages is the organization's real mark. Each one needs that organization's approval before launch. MLive and Pinnacle Construction Group are named in text only, until you can supply their files." },
  { t: "Where each inquiry should go", d: "The inquiry and contact forms are previews and do not send yet. Tell us who should receive leasing, partner and press inquiries, and we will connect them before launch." },
  { t: "Your architect's floor plans", d: "We did not find published floor plans for any of the four communities. The layouts on the find-a-home page are our illustrations, sized from the reported unit mix, and they are labelled that way. Your architect's plans would replace them." },
  { t: "The unit mix and income rules", d: "Your site describes Lighthouse Ridge as one-, two- and three-bedroom homes, while REjournals reports 40 two-bedrooms and 12 three-bedrooms, so we show only those two. Income rules for Zone 32 Phase II are still unannounced, and the income check covers Kalamazoo County only. Please correct all of this." },
  { t: "Renderings and sample data checked by you", d: "Renderings are labelled as renderings. They are our illustrations, and the final buildings may differ. The find-a-home pages use sample data. Your team should correct all of it before anything is published." },
];
export const recommended = { name: "The Standard", after: "/proposals/bogan/compare-after.jpg", why: "The Standard opens with what makes the firm different, a published standard answered by facts on the record, and then gives each reader what they came for. Lenders and cities get project status and a funding table with its sources. Residents get a find-a-home page with layouts across all four communities, a floor plan and 3D model of each, an income check against the Kalamazoo County table, and an inquiry form." };

export const radar = {
  note: "A taste of what a weekly brief would look like, built from public sources in one day. Each item is dated and sourced. MSHDA, county and most agenda portals refused automated reading in this pass, so funding rounds and meeting items are thin here. That gap is what the running version closes.",
  items: [
    { when: "Tentative, from December 4, 2026", t: "Michigan's new state housing tax credit: $42 million a year, six-year credits", why: "A new equity source for B on Burdick or a next phase, with set-asides for 4% deals and for places under 35,000 people, which fits lakeshore sites. The exact first deadline still needs confirming with MSHDA.", src: S.tr },
    { when: "Through 2028", t: "The county housing millage is scheduled to end in 2028", why: "You have drawn three awards from it. Whether it renews shapes every future Kalamazoo stack, and we found no ballot date.", src: S.mill },
    { when: "As of January 2026", t: "The Employer-Assisted Housing fund is spent", why: "The last $3.2 million went out in December 2025, including the Bronson-linked award. The next employer partner won't come with a state match unless the Legislature refills it.", src: S.bridge },
    { when: "Reported September 2026", t: "The Transformational Brownfield Program grew, with a 20% affordable threshold", why: "Sunset moved to 2032. A 20% affordable share unlocks full income tax capture, which matters at B on Burdick's scale, not Zone 32's.", src: S.pm },
    { when: "Our inference", t: "Palisades in Covert is the strongest candidate for a next employer partner", why: "About 600 workers as of July 2025, near Lighthouse Ridge. Restart status is unknown and nobody has announced a housing need. This is a lead, not a fact.", src: S.pali },
    { when: "December 2025", t: "Hollander and Edison won a 50-year PILOT for KalRecovery", why: "48 units and $22.3 million through the same City Commission, which shows the tools the commission is willing to use.", src: S.kal },
    { when: "2026", t: "Portage is rewriting its zoning, with mixed-use still to come", why: "Smaller lots and cluster incentives passed through planning in the spring. A mixed-use phase would open infill sites next door.", src: S.port },
    { when: "2025 to 2026", t: "South Haven's council has been working with Dwelling Place", why: "An MSHDA application was targeted for April 2026 near Lighthouse Ridge. That makes them a competitor or a partner, and it's worth knowing which.", src: S.sh },
  ],
};

export const shifts: [string, string, string][] = [
  ["What's due on Burdick", "Whoever remembers", "Ask Arthur: every open item across lenders, agencies and partners, with the document it came from"],
  ["The next funding round", "Heard from a peer or a program officer", "A dated calendar of every program that fits your deals, with fit notes"],
  ["A funder wants an update", "A week pulling numbers from four folders", "A first draft from the project record, every figure sourced, for you to approve"],
  ["A new parcel comes up", "Heard about at a meeting", "Flagged from public agendas the week it's posted, where the portal allows it, otherwise read by a person"],
  ["A reporter wants the numbers", "Whatever is easiest to find online", "One fact sheet per project, always current"],
  ["Which employer is next", "Relationships and instinct", "Employers, jobs and wages mapped against housing need, county by county"],
];

export const layers = [
  { name: "Funding calendar", does: "Every program that fits your deals, from MSHDA rounds and the new state credit to millage cycles, EGLE, MEDC and AHP, with dates, fit and what each would need from you.", would: "Rounds noticed late, or from a peer." },
  { name: "Capital stack ledger", does: "Each project's sources, amounts, conditions and deadlines read once from the award letters and kept in one place. Ask what is committed, what is conditional and what is left to raise.", would: "A stack that lives in spreadsheets and memory." },
  { name: "Public meeting watch", does: "City, county, brownfield authority and planning agendas read across your market every week, with anything touching housing sites, land sales or incentives pulled out, where the portal allows it, otherwise read by a person.", would: "Finding out at the meeting." },
  { name: "Site and demand finder", does: "Public parcels, zoning changes, employers adding jobs and income data joined, so the next site and the next Bronson come from evidence.", would: "Pipeline limited to who you already know." },
  { name: "Funder and impact reporting", does: "Homes delivered, income bands, minority- and women-owned contracting, children served. Reports drafted from the same record for each funder, in that funder's format.", would: "The same numbers rebuilt by hand for every ask." },
  { name: "A website that stays true", does: "Project pages, milestones and a press fact sheet fed from one record, with a person approving each update.", would: "The site falling behind the work again." },
];

export const questions = [
  { q: "Which conditions on the Phase II awards are still open, and who owes them?", joins: "Award letters, closing checklist, email" },
  { q: "Which state and county programs could fill a gap on Burdick, and by when?", joins: "Funding calendar and capital stack" },
  { q: "What share of Burdick's contracted work is with minority- and women-owned firms today?", joins: "Contracts, pay applications, vendor records" },
  { q: "What changed on any agenda this week within a mile of Zone 32?", joins: "City and county agendas" },
  { q: "Which employers in Van Buren County added 100 or more jobs, and what do those jobs pay?", joins: "State and public employer records" },
  { q: "Draft the update to the Community Foundation from what happened this quarter.", joins: "Project record, photos, past reports" },
];

export const proof = [
  { k: "Books", d: "Bank lines categorised and reconciled, with the evidence for each." },
  { k: "Events", d: "Inquiries answered, quotes built, deposits and follow-ups tracked for every private event." },
  { k: "Documents", d: "Licenses, leases and compliance files read once and searchable, with the source page for every answer." },
  { k: "Guardrails", d: "Nothing sends, spends or signs without a person approving it." },
];

export const trust: [string, string][] = [
  ["Your data stays yours", "Your deal files are kept separate from every other client's. We will put the data-handling terms in writing before any file is connected."],
  ["People approve, Arthur prepares", "Drafts, answers and alerts come with their source. Anything that goes to a funder, spends money or makes a commitment waits for a person."],
  ["Every figure is traceable", "A number without a source isn't shown. Each answer links back to the document and page it came from."],
  ["Nothing is connected yet", "Everything on this page came from public sources. Connecting your own files is your decision, one source at a time."],
];

export const steps: [string, string][] = [
  ["Walk through this together", "Your team, this page and the working site. Tell us what's wrong: you know these deals, and some of what's public is out of date."],
  ["Mark up the site", "What should change, and the audience that matters most in the next 12 months."],
  ["Build the site and one project record", "The new site on your facts, starting with B on Burdick or Phase II, with the placement fixes built in."],
  ["Run the weekly brief for thirty days", "Funding, meetings and sites across your market. Keep what earned its place and drop what didn't. Terms are set together after the walkthrough."],
];

export const method = "Read November 5 and 6, 2026 from public sources only. The income check uses the Kalamazoo County table effective May 1, 2026, read from kalcounty.gov. We could not open MLive, Crain's, MSHDA, the county annual report, LARA or most agenda portals, so nothing here relies on them, and Crain's figures are cited only from headlines on your own news page. Where sources disagree we say so. Lighthouse Ridge is Wallick-led, and the current status of B on Burdick after February 2026 is unconfirmed. Arthur is not connected to any Bogan system.";

export const sources: Src[] = Object.values(S);

/* Share link: /p/bogan/<PORTAL_TOKEN_BOGAN>. Unset token = unpublished (no params, 404). */
export const boganClients = [meta].filter((m) => m.token);
export const getBogan = (token: string) => boganClients.find((m) => m.token === token);
