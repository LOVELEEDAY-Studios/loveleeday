/**
 * The fund-level portfolio page. One token, one link, three rebuilds side by
 * side with what each site looks like today.
 *
 * This is a different object to a client Portal: a Portal is addressed to one
 * company about its own work, this is addressed to the investor about several.
 * Keeping them separate stops the client-facing copy drifting into pitch copy.
 */

import { TOKENS } from "./tokens";
import { v } from "./assetVersion";

export interface Case {
  slug: string;
  company: string;
  domain: string;
  /** Which client portal holds the full package. */
  portalToken: string;
  sector: string;
  before: string;
  after: string;
  /** The single sentence that justifies the rebuild. */
  thesis: string;
  /** Measured, with its source. */
  findings: string[];
  /** The search line, already bounded. */
  search: string;
}

export interface Portfolio {
  /** Undefined until the fund's token is set: written, not yet reachable. */
  token?: string;
  fund: string;
  fundDomain: string;
  preparedFor: string;
  deliveredOn: string;
  intro: string;
  /** Things true of the fund itself, not any one company. */
  fundFindings: { title: string; detail: string }[];
  /** Portfolio-wide measurements. */
  stats: { k: string; label: string; sub: string }[];
  cases: Case[];
  method: string[];
}

const collab: Portfolio = {
  token: TOKENS.collab,
  fund: "Collab Capital",
  fundDomain: "collab.capital",
  preparedFor: "Collab Capital",
  deliveredOn: "2026-09-19",
  intro:
    "Your next advantage may begin with a question no one has asked. We asked one about your portfolio — what do all 38 of these sites actually look like to the buyer trying to find them — then answered it in working HTML rather than in a deck. Nothing here was commissioned and nothing is a proposal. Every figure belongs to the company it describes, and every measurement names its source.",

  fundFindings: [
    {
      title: "Two portfolio companies have rebranded and the portfolio page still lists the old names",
      detail:
        "CircNova now trades as Novarna — circnova.com serves a page titled “Novarna — The AI Design Engine for RNA Medicines” and carries a banner reading “CircNova is now Novarna.” Hubble IQ now trades as Fyxit AI, with an assistant branded Rosie. Both appear under their former names on collab.capital/portfolio.",
    },
    {
      title: "The portfolio page links to none of its 40 companies",
      detail:
        "Checked directly: zero href values on collab.capital/portfolio point at a company page, and the element wrapping a company name has no anchor ancestor, no click handler and cursor: auto. The per-company detail pages exist and carry the outbound links — nothing on the index reaches them. Anyone wanting to look at a portfolio company has to leave and search for it.",
    },
    {
      title: "71% of the portfolio runs on a no-code builder",
      detail:
        "Eleven WordPress, nine Webflow, two Wix, two Squarespace, two Shopify, one Framer. Eleven are custom or could not be fingerprinted. That is not a criticism of the tool — it is an observation that the median portfolio company's site is doing less work than the company behind it.",
    },
  ],

  stats: [
    { k: "38", label: "Sites audited", sub: "Every live company in the portfolio, 2026-09-18" },
    { k: "57", label: "Median mobile performance", sub: "Google Lighthouse. 11 of 33 score under 50" },
    { k: "92", label: "Median Lighthouse SEO", sub: "Their markup is mostly fine. This is not the problem" },
    { k: "19", label: "With no CrUX field data", sub: "Of 33 measured — too few real visitors for Google to report on" },
  ],

  cases: [
    {
      slug: "novarna",
      company: "Novarna",
      domain: "circnova.com",
      portalToken: TOKENS.novarna,
      sector: "AI-designed RNA therapeutics · Detroit, MI",
      before: v("/portal/collab/novarna-before.jpg"),
      after: v("/portal/collab/novarna-after.jpg"),
      thesis:
        "Of the six, this is the only company whose product is an object rather than an interface — so the page is built around the molecule, rendered rather than illustrated. Their best proof, the University of Michigan DiFeo Lab testing their candidates in its own facility where the designs outperformed a commercially available treatment, was a paragraph near the bottom of their site. Almost nobody in AI-for-biology has third-party validation.",
      findings: [
        "The hero is an A-form RNA duplex built to real geometry — 32.7° of twist per base pair, 2.8 Å rise, and the narrow major groove that distinguishes RNA from DNA — lit and depth-sorted in the browser, with the four bases NovaEngine designed arriving last and in red. No 3D library; the whole page is 48 KB.",
        "Third-party validation now has its own section instead of a footnote, with the DiFeo result set as a readout rather than a paragraph.",
        "Their assets already serve from novarna.ai while the domain still resolves as circnova.com — two names splitting whatever authority the domain has earned. Collab Capital still lists them as CircNova.",
      ],
      search:
        "Ninth of nine for the phrase describing their platform. The eight above them are journals and catalog sites, not companies — a category with no commercial competition in it yet.",
    },
    {
      slug: "soarce",
      company: "Soarce",
      domain: "soarceusa.com",
      portalToken: TOKENS.soarce,
      sector: "Industrial nanofiber materials · Orlando, FL",
      before: v("/portal/collab/soarce-before.jpg"),
      after: v("/portal/collab/soarce-after.jpg"),
      thesis:
        "Their homepage document alone is 5,009 KB — the heaviest of all thirty-eight sites we measured. Loading the whole page moves about 30 MB, most of it one Wix bundle fetched three separate times at 5.9 MB each. A materials company whose entire pitch is stronger, lighter, cheaper should not be shipping the heaviest page in its investor's portfolio.",
      findings: [
        "The rebuild makes the same claims in 37 KB of document and 191 KB fully loaded — under one percent of what their page moves. Re-measured 2026-09-20.",
        "Their own figures carry the page — 8x stronger than steel, 22 GPa tensile strength, 200x water retention — rather than being buried under the weight.",
        "Page weight and search are the same problem here: a page that heavy is slow to crawl and slow to load for the buyer who does find it.",
      ],
      search:
        "Not in the top 9 for the phrase describing what they sell. matregenix.com ranks first.",
    },
    {
      slug: "loanwell",
      company: "LoanWell",
      domain: "loanwell.com",
      portalToken: TOKENS.loanwell,
      sector: "Lending technology for CDFIs · Durham, NC",
      before: v("/portal/collab/loanwell-before.jpg"),
      after: v("/portal/collab/loanwell-after.jpg"),
      thesis:
        "Affordable capital reaches nobody if the lender looking for the tool to deploy it cannot find you. Their product copy and mission are strong; the page argues about software features rather than about deploying capital.",
      findings: [
        "Absent from the top 9 for the single phrase a CDFI would type when looking for exactly what they build, while three general-purpose lending platforms rank instead — none of which serves mission-driven lenders specifically.",
        "The rebuild closes on the line you publish from their own CEO on your portfolio page, and puts a borrower where their page had three abstract cards — the section is titled \"We take lending personally\" and had nobody in it.",
        "Two corrections regardless of the study: their servicing screenshot contains a rendering seam with amortization rows 11 to 14 duplicated over row 17, and six of the seven product screenshots on loanwell.com show a real work address in the header bar, legible at full size.",
      ],
      search:
        "Not in the top 9 for “loan origination software for CDFI”. nortridge.com, themortgageoffice.com and builderspatch.com rank instead.",
    },
    {
      slug: "janta",
      company: "Janta Power",
      domain: "jantaus.com",
      portalToken: TOKENS.janta,
      sector: "3D solar towers · Dallas, TX",
      before: v("/portal/collab/janta-before.jpg"),
      after: v("/portal/collab/janta-after.jpg"),
      thesis:
        "Their best number is buried three screens down in a small comparison card. Their own worked example — 500 kW in Dallas — is 3.3 acres of fixed-tilt panels making 876,000 kWh a year against one acre of towers making 1,182,600. Multiply that out at their ratio and a 50 MW build saves 230 acres, about 174 football fields, while producing 30,660 MWh a year more. That is the whole company in one line, and today it is a footnote.",
      findings: [
        "The rebuild makes the land argument the page's single bold move: their own two aerial photographs, scroll-scrubbed, traditional array giving way to towers while the acreage counts 330 down to 100. The page says plainly that the 50 MW figures are their 500 kW comparison multiplied out, so the arithmetic is ours and the inputs are theirs.",
        "A consent modal covers 23% of their first screen, including part of the value proposition. Invisible to every crawler metric; obvious the moment you load the page.",
        "The partner logo served at /marketing/partners/pv-magazine-white.png, with alt text “PV Magazine”, is pixel-for-pixel the Third Derivative logo. A screen reader announces one organization while sighted visitors see another — and Third Derivative is an accelerator whose portfolio they are in, which their own footer lists correctly under “In the Press”.",
      ],
      search:
        "Not in the top 8 for either query describing what they sell. A Reddit thread asking whether solar towers are even a real thing ranks first for one; a journal index takes the other.",
    },
    {
      slug: "fyxit",
      company: "Fyxit AI",
      domain: "hubbleiq.com",
      portalToken: TOKENS.fyxit,
      sector: "AI tech support for school districts · San Francisco, CA",
      before: v("/portal/collab/fyxit-before.jpg"),
      after: v("/portal/collab/fyxit-after.jpg"),
      thesis:
        "Their whole claim is “does the work, not just the talking”, and the site talks. The rebuild opens on the product working: a teacher reports Wi-Fi dropping in room 214, Fyxit reads the access point, finds channel overlap, moves it and closes the issue in 2m 40s without a ticket ever being opened.",
      findings: [
        "The six problems on their live demo — slow Wi-Fi, a laggy computer, a jammed printer, an app that will not load, a cracked screen, a phishing email — are the most concrete thing on the site and are currently buttons. In the rebuild they are the page's spine, and the 60% figure is shown as a Monday-morning queue with outcomes rather than asserted as a stat.",
        "Rosie is their own AI technician — she appears 810 times in their application bundle and never once on the marketing page. She answers the teacher in the rebuild, by name.",
        "The domain still resolves as hubbleiq.com while the product is branded Fyxit AI. Two names split whatever authority the domain has earned.",
      ],
      search:
        "Not in the top 9 for “AI IT helpdesk for school districts”. The site ranking first is incidentiq.com — which Fyxit lists on its own homepage as an integration partner.",
    },
    {
      slug: "micruity",
      company: "Micruity",
      domain: "micruity.com",
      portalToken: TOKENS.micruity,
      sector: "Retirement income infrastructure · Sacramento, CA",
      before: v("/portal/collab/micruity-before.jpg"),
      after: v("/portal/collab/micruity-after.jpg"),
      thesis:
        "A category-defining product explained in the visual language of a template. The rebuild keeps their structure and their four products, and changes only how much the page is willing to say about the person on the other end of an annuity.",
      findings: [
        "Ten <h1> elements on the homepage. One page should have one.",
        "Lighthouse flags insufficient color contrast between foreground and background — a defect that affects real readers, not just a score.",
        "Of the six, this is the site search is already working for. The rebuild is an argument about clarity, not about traffic.",
      ],
      search:
        "Ranks #1 — and #9 as well, two results on one page — for “retirement income infrastructure recordkeeper insurer”, and #5 for “plan participant portability annuity”.",
    },
  ],

  method: [
    "Company list taken from collab.capital's own per-company detail pages, not guessed. An earlier pass using guessed domains resolved five companies to unrelated businesses, and collabcapital.com is a parked domain that is not the fund.",
    "Lighthouse scores are Google PageSpeed Insights, mobile strategy, run 2026-09-18. Four companies failed to return a result and are excluded rather than scored zero.",
    "Search positions come from live Google SERPs via SerpApi, re-measured on 2026-09-19 rather than quoted from the first pass. We could see 8 to 9 organic results per query, so “not in the top 8” is the strongest claim available — it says nothing about position 9 or beyond, and nothing about Bing or any other engine.",
    "Every figure on the six rebuilt pages belongs to the company it describes and is read from their own site. Where we have done arithmetic on their numbers — the Janta land comparison is their published 500 kW example multiplied out to 50 MW — the page says so on the page itself. We have not independently verified any of their underlying claims.",
    "Photography across these studies is real licensed stock from Pexels, credited in each page. An earlier version of the Micruity study used AI-generated people and it was replaced. The Fyxit conversation and queue are illustrative values built to show the layout, not data from their system.",
  ],
};

/** Every fund study that exists. One publishes only once it has a token. */
/**
 * Lightship Capital — Brian Brackeen, Funder's Panel, 2026-09-22.
 *
 * Every figure below was checked directly with curl or local Lighthouse on
 * 2026-09-22, not taken from a research summary. Where the coverage is partial
 * the denominator is stated on the page rather than rounded away — 7 of 18
 * measured is a finding; "median performance 56" on its own would be a claim.
 */
const lightship: Portfolio = {
  token: TOKENS.lightship,
  fund: "Lightship Capital",
  fundDomain: "lightship.capital",
  preparedFor: "Lightship Capital",
  deliveredOn: "2026-09-22",
  intro:
    "Nothing here was commissioned and nothing is a proposal. We read your portfolio page, opened every company on it, and measured what a buyer actually receives — then rebuilt one of them in working HTML rather than describing it in a deck. Two findings are about domains rather than design, and those matter most, because a link that leaves your own portfolio page is the first thing anyone doing diligence will click.",

  fundFindings: [
    {
      title: "Two portfolio companies are linked to domains they no longer control",
      detail:
        "joinbootup.com returns HTTP 200 and serves a page titled “SLOT DANA | Panduan Lengkap Slot Deposit Via DANA Terbaru 100% Aman” — an Indonesian gambling site that acquired the lapsed domain. semiosis-ai.com returns HTTP 404 with the title “ConnectYourDomain Error | Wix.com”. Both are still linked from lightship.capital/portfolio. This is a registrar and legal problem before it is a design one.",
    },
    {
      title: "A live site is shipping its CMS's own instruction text",
      detail:
        "enableinjections.com contains the literal string “Delete this tip before you publish” in its served HTML, and undock.com's navigation resolves to URLs containing “features/undefined”. Both were read from the raw response, not from a rendering. Enable has FDA clearance and partnerships with Sanofi, Roche and Sobi; the gap between that credibility and a page carrying editor scaffolding is the widest in the portfolio.",
    },
    {
      title: "Page weight, not page design, is what most of these are losing to",
      detail:
        "Of the seven companies measured so far, allergyamulet.com transfers 50.3 MB and reaches largest contentful paint at 25.2 seconds on a mobile connection. hautehijab.com is 13.2 seconds, undock.com 18.7, freshfry.me 8.8. These are not judgements about taste — they are the numbers Google records, and they decide whether anyone sees the design at all.",
    },
  ],

  stats: [
    { k: "18", label: "Companies in the portfolio", sub: "Read from lightship.capital/portfolio, 2026-09-22" },
    { k: "2", label: "Linked to domains they have lost", sub: "Bootup and Semiosis AI — confirmed by direct request" },
    { k: "56", label: "Median mobile performance", sub: "Lighthouse, mobile, 7 of 18 measured so far — not the whole portfolio" },
    { k: "50.3", label: "MB on the heaviest page", sub: "allergyamulet.com. LCP 25.2s. Measured locally, not estimated" },
  ],

  cases: [
    {
      slug: "enable",
      company: "Enable Injections",
      domain: "enableinjections.com",
      portalToken: TOKENS.enable as string,
      sector: "Wearable large-volume drug delivery · Cincinnati, OH",
      before: v("/portal/lightship/enable-before.jpg"),
      after: v("/portal/lightship/enable-after.jpg"),
      thesis:
        "This company has the rarest thing in medtech marketing and does not lead with it. enFuse is FDA-cleared and carries named partnerships with Sanofi, Roche and Sobi — and on the live site those partners sit under a heading called “Current Partnerships” several scrolls below the fold, after the product explanation. The rebuild changes the order and nothing else: clearance and partners ride in the hero, the mechanism is drawn rather than described, and the patient quotes they already publish do the closing.",
      findings: [
        "Their site is technically healthy and this study does not claim otherwise: Lighthouse mobile on 2026-09-22 returns performance 88, SEO 100, accessibility 99, best practices 100, with largest contentful paint at 2.1 seconds. Nothing here is a speed argument.",
        "The served HTML is 255,331 bytes for one page before a single stylesheet, script or image loads, and sixty data-lazy attributes defer the imagery. That deferral is working in their favour — it is why the page is fast — and the only cost is that the middle of the page is empty until a visitor scrolls.",
        "The string “Delete this tip before you publish” is live in the page — the CMS's own instruction to the author, published.",
        "The rebuild uses their own magenta and navy, sampled from the rendered page's computed styles rather than guessed, and their own Montserrat. The device is hand-built inline SVG; no stock photography.",
      ],
      search:
        "Not measured. The Collab study quoted live search positions from SerpApi; that key is not in this project's environment, so no position is claimed here rather than estimated from a search we did not run.",
    },
  ],

  method: [
    "Company list read from lightship.capital/portfolio directly on 2026-09-22 — 18 companies, no pagination detected.",
    "Every domain was requested with a real browser user agent and its status and page title recorded. A 403 from a Cloudflare challenge is reported as blocked, never as broken: visuwall.com returns 403 and is excluded from every count here rather than scored as a defect.",
    "Lighthouse was run locally, mobile profile, because the PageSpeed Insights API returned HTTP 429 on the first sixteen requests and did not recover at one request at a time. Seven of eighteen companies are measured so far; the median above says so. Two more — healthyrootsdolls.com and vyrill.com — failed to return a result and are excluded rather than scored zero.",
    "No CrUX field data is quoted anywhere on this page. Local Lighthouse cannot see it, and an absent field record would need its own explanation rather than a blank.",
    "Bootup and Semiosis AI are excluded from all performance figures. Measuring a domain the company no longer controls would attach a score to someone else's site.",
    "Every figure on the Enable rebuild belongs to Enable and is read from their own site or their own published material. We have not independently verified their clinical claims.",
  ],
};

export const portfolios: Portfolio[] = [collab, lightship];

/** Studies reachable right now -- the ones whose token is set. */
export const publishedPortfolios = portfolios.filter((p) => Boolean(p.token));

export function getPortfolio(token: string): Portfolio | undefined {
  return publishedPortfolios.find((p) => p.token === token);
}

/** Kept so existing imports do not break; prefer getPortfolio(token). */
export const portfolio = collab;
