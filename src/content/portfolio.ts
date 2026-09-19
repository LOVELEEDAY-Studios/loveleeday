/**
 * The fund-level portfolio page. One token, one link, three rebuilds side by
 * side with what each site looks like today.
 *
 * This is a different object to a client Portal: a Portal is addressed to one
 * company about its own work, this is addressed to the investor about several.
 * Keeping them separate stops the client-facing copy drifting into pitch copy.
 */

import { TOKENS } from "./tokens";

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
  token: string;
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

export const portfolio: Portfolio = {
  token: TOKENS.collab,
  fund: "Collab Capital",
  fundDomain: "collab.capital",
  preparedFor: "Collab Capital",
  deliveredOn: "2026-09-18",
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
      before: "/portal/collab/novarna-before.jpg",
      after: "/portal/collab/novarna-after.jpg",
      thesis:
        "Their site is already good, so we kept their design system and changed what the header says. Their best line is buried as a section heading halfway down, and their best proof — the University of Michigan DiFeo Lab testing their candidates in its own facility, where the designs outperformed a commercially available treatment — is a paragraph near the bottom.",
      findings: [
        "Third-party validation is the rarest thing in AI-for-biology and it was below the fold. It now sits directly under the headline.",
        "Their loop diagram is the best idea on their site. In the rebuild it is the hero object and it turns, rather than being replaced by a card.",
        "Their assets already serve from novarna.ai while the domain still resolves as circnova.com — two names splitting whatever authority the domain has earned. Collab Capital still lists them as CircNova.",
      ],
      search:
        "Not in the top 9 for the phrase describing their platform. The results are journals and catalogue sites, not companies — a category with no commercial competition in it yet.",
    },
    {
      slug: "soarce",
      company: "Soarce",
      domain: "soarceusa.com",
      portalToken: TOKENS.soarce,
      sector: "Industrial nanofiber materials · Orlando, FL",
      before: "/portal/collab/soarce-before.jpg",
      after: "/portal/collab/soarce-after.jpg",
      thesis:
        "Their homepage is 5,009 KB — thirty-four times the portfolio median and the heaviest of all thirty-eight sites we measured. A materials company whose entire pitch is stronger, lighter, cheaper should not be shipping the heaviest page in its investor's portfolio.",
      findings: [
        "The rebuild is 416 KB and makes the same claims. A ninety-two percent reduction.",
        "Their own figures carry the page — 8x stronger than steel, 22 GPa tensile strength, 200x water retention — rather than being buried under the weight.",
        "Page weight and search are the same problem here: a page that heavy is slow to crawl and slow to load for the buyer who does find it.",
      ],
      search:
        "Not in the top 10 for the phrase describing what they sell. matregenix.com ranks first.",
    },
    {
      slug: "loanwell",
      company: "LoanWell",
      domain: "loanwell.com",
      portalToken: TOKENS.loanwell,
      sector: "Lending technology for CDFIs · Durham, NC",
      before: "/portal/collab/loanwell-before.jpg",
      after: "/portal/collab/loanwell-after.jpg",
      thesis:
        "Affordable capital reaches nobody if the lender looking for the tool to deploy it cannot find you. Their product copy and mission are strong; the page argues about software features rather than about deploying capital.",
      findings: [
        "Absent from the top 9 for the single phrase a CDFI would type when looking for exactly what they build, while three general-purpose lending platforms rank instead — none of which serves mission-driven lenders specifically.",
        "The rebuild closes on the line you publish from their own CEO on your portfolio page.",
        "One correction regardless of the study: the product screenshot served on their site contains a rendering seam, with amortisation rows 11 to 14 duplicated over row 17.",
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
      before: "/portal/collab/janta-before.jpg",
      after: "/portal/collab/janta-after.jpg",
      thesis:
        "Their best number is buried in a slider widget. At 50 MW Janta saves 222 acres — about 168 football fields — and still produces 30,617 MWh a year more. That is the whole company in one line, and today you have to drag a control to find it.",
      findings: [
        "The rebuild makes the land argument the page's single bold move: their own two aerial photographs, scroll-scrubbed, traditional array giving way to towers while the acreage counts 333 down to 111.",
        "A consent modal covers 23% of their first screen, including part of the value proposition. Invisible to every crawler metric; obvious the moment you load the page.",
        "The partner logo served at /marketing/partners/pv-magazine-white.png, with alt text “PV Magazine”, is actually the Third Derivative logo. A screen reader announces one organization while sighted visitors see another.",
      ],
      search:
        "Not in the top 8 for either query describing what they sell. reddit.com ranks first for both.",
    },
    {
      slug: "fyxit",
      company: "Fyxit AI",
      domain: "hubbleiq.com",
      portalToken: TOKENS.fyxit,
      sector: "AI tech support for school districts · San Francisco, CA",
      before: "/portal/collab/fyxit-before.jpg",
      after: "/portal/collab/fyxit-after.jpg",
      thesis:
        "Their whole claim is “does the work, not just the talking”, and the site talks. The rebuild opens on the product working: a teacher reports Wi-Fi dropping in room 214, Fyxit reads the access point, finds channel overlap, moves it and closes the issue in 2m 40s without a ticket ever being opened.",
      findings: [
        "The six problems on their live demo — slow Wi-Fi, a laggy computer, a jammed printer, an app that will not load, a cracked screen, a phishing email — are the most concrete thing on the site and are currently buttons. In the rebuild they are the page's spine.",
        "The six problems their live demo already names are currently buttons. In the rebuild they are the page's spine, and the 60% figure is shown as a Monday-morning queue with outcomes rather than asserted as a stat.",
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
      before: "/portal/collab/micruity-before.jpg",
      after: "/portal/collab/micruity-after.jpg",
      thesis:
        "A category-defining product explained in the visual language of a template. The rebuild keeps their structure and their four products, and changes only how much the page is willing to say about the person on the other end of an annuity.",
      findings: [
        "Ten <h1> elements on the homepage. One page should have one.",
        "Lighthouse flags insufficient colour contrast between foreground and background — a defect that affects real readers, not just a score.",
        "Of the three, this is the site search is already working for. The rebuild is an argument about clarity, not about traffic.",
      ],
      search:
        "Ranks #1 for “retirement income infrastructure recordkeeper insurer” and #6 for “plan participant portability annuity”.",
    },
  ],

  method: [
    "Company list taken from collab.capital's own per-company detail pages, not guessed. An earlier pass using guessed domains resolved five companies to unrelated businesses, and collabcapital.com is a parked domain that is not the fund.",
    "Lighthouse scores are Google PageSpeed Insights, mobile strategy, run 2026-09-18. Four companies failed to return a result and are excluded rather than scored zero.",
    "Search positions come from live Google SERPs via SerpApi. We could see 8 to 10 organic results per query, so “not in the top 8” is the strongest claim available — it says nothing about position 9 or beyond.",
    "Every figure on the three rebuilt pages belongs to the company it describes and is quoted from their own site. We have not independently verified any of their claims.",
    "Photography across these studies is real licensed stock from Pexels, credited in each page. An earlier version of the Micruity study used AI-generated people and it was replaced. The Fyxit conversation and queue are illustrative values built to show the layout, not data from their system.",
  ],
};
