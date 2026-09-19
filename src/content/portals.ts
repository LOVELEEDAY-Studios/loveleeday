/**
 * Client review portals.
 *
 * Each portal is one unguessable URL handed to one client. There is no index of
 * portals, no login, and /p is disallowed in robots.txt and sent as noindex —
 * the token IS the credential. That is the right level for design review: a
 * password is friction that costs you responses, and nothing here is
 * confidential beyond the work itself. Anything that needs a real account
 * boundary does not belong in this file.
 *
 * To add a client: generate a token with
 *   node -e "console.log(require('crypto').randomBytes(9).toString('hex'))"
 * drop the assets in public/portal/<dir>/, and append an object below.
 */

import { TOKENS } from "./tokens";

export interface Deliverable {
  slug: string;
  title: string;
  kind: string;
  /** One line. Why this exists, in the client's language, not ours. */
  rationale: string;
  /** What we actually want them to look at. Review prompts beat "thoughts?". */
  look: string[];
  /** Served from /public. index.html of the real page. */
  href: string;
  /** Card crop and the full-page strip. */
  card: string;
  preview: string;
  /** Notes we owe them — open questions, placeholders, known gaps. */
  caveats?: string[];
  /** Measured search visibility. Every figure here comes from a named source. */
  seo?: Seo;
}

export interface SeoQuery {
  query: string;
  /** Organic position, or null when absent from the results we could see. */
  position: number | null;
  /** How many organic results we actually scanned — bounds the claim. */
  scanned: number;
  /** Who is winning it instead. */
  winners: string[];
}

export interface Seo {
  measuredOn: string;
  /** Google Lighthouse, mobile, 0-100. null when the run did not complete —
      unmeasured is not the same as a score of zero and must never render as one. */
  performance: number | null;
  seoScore: number | null;
  accessibility: number | null;
  /** Does the domain appear in Chrome UX Report field data at all? */
  crux: boolean;
  queries: SeoQuery[];
  /** The diagnosis, in plain language. */
  verdict: string;
  notes: string[];
}

export interface Portal {
  token: string;
  client: string;
  clientDomain?: string;
  project: string;
  round: string;
  deliveredOn: string;
  /** ISO date. After this the page still renders but says it has expired. */
  expiresOn?: string;
  /** Two or three sentences, addressed to them. */
  intro: string;
  /** What happens next, so the link is a step in a process and not a dead end. */
  next: string[];
  deliverables: Deliverable[];
}

export const portals: Portal[] = [
  {
    token: TOKENS.novarna,
    client: "Novarna",
    clientDomain: "circnova.com",
    project: "Marketing site — direction study",
    round: "Round 01",
    deliveredOn: "2026-09-19",
    expiresOn: "2026-12-18",
    intro:
      "This is an unsolicited direction study. Your site is already good — Fraunces over Work Sans with your crimson, and a loop diagram that earns its place — so we kept your design system rather than imposing ours. What changed is what the header says, and where your best proof sits.",
    next: [
      "Open the page and scroll it the way your buyer would.",
      "Leave notes anywhere on this page — they reach us by email immediately.",
      "If the direction is right, we scope the build against your full site map.",
    ],
    deliverables: [
      {
        slug: "marketing-site",
        title: "Novarna — marketing site",
        kind: "Full landing page · desktop and mobile",
        rationale:
          "Your headline is a twelve-word category description. Your best line is buried as a section heading halfway down: \"RNA drug discovery is still largely a guessing game.\" And your strongest proof — the University of Michigan DiFeo Lab testing your candidates in their own facility, where the designs outperformed a commercially available treatment — is a paragraph near the bottom. Third-party validation is the rarest thing in AI-for-biology. It belongs above the fold.",
        look: [
          "The header is your own line, answered: the guessing game, and the loop that closed it.",
          "The Michigan result sits directly under the headline rather than in a case study near the bottom.",
          "Your loop diagram is the hero object and it turns — a 12s arc travels the ring and each node lights as it passes, with NovaEngine and NovaLab tagged onto the circle.",
          "Your typefaces and your crimson, unchanged. A redesign study should not make you look like the studio that made it.",
        ],
        href: "/portal/novarna/index.html",
        card: "/portal/novarna/card.jpg",
        preview: "/portal/novarna/preview.jpg",
        caveats: [
          "Every figure is yours, quoted from circnova.com on 2026-09-19: 7x faster development cycles, 100% proprietary training data, and the DiFeo Lab result.",
          "We did not draw a comparison chart of the Michigan result. The magnitude of the outperformance is not disclosed anywhere, and two bars would imply one.",
          "Your assets already serve from novarna.ai while the domain still resolves as circnova.com. Two names split whatever authority the domain has earned, and Collab Capital's portfolio page still lists you as CircNova.",
        ],
        seo: {
          measuredOn: "2026-09-18",
          performance: 68,
          seoScore: 100,
          accessibility: 94,
          crux: false,
          queries: [
            { query: "AI RNA therapeutics design platform", position: null, scanned: 9,
              winners: ["sciencedirect.com", "bocsci.com", "journals.asm.org"] },
          ],
          verdict:
            "Lighthouse scores your SEO 100/100, so the markup is not the problem. You do not appear in the top 9 for the phrase describing your platform — the results are journals and catalogue sites, not companies. A category with no commercial competition in it is winnable cheaply, and also one nobody is searching yet. Your traffic will come from the target, not the technology name.",
          notes: [
            "Lighthouse mobile, run 2026-09-18. Flagged: multiple page redirects, unused JavaScript.",
            "Position from a live Google SERP via SerpApi, 9 organic results visible.",
            "Measured against circnova.com. Anything served from novarna.ai is unmeasured here.",
          ],
        },
      },
    ],
  },
  {
    token: TOKENS.soarce,
    client: "Soarce",
    clientDomain: "soarceusa.com",
    project: "Marketing site — direction study",
    round: "Round 01",
    deliveredOn: "2026-09-19",
    expiresOn: "2026-12-18",
    intro:
      "This is an unsolicited direction study. Your material is genuinely remarkable and your site is the heaviest of the thirty-eight we audited across this portfolio. That gap is the whole argument.",
    next: [
      "Open the page and scroll it the way your buyer would.",
      "Leave notes anywhere on this page — they reach us by email immediately.",
      "If the direction is right, we scope the build against your full site map.",
    ],
    deliverables: [
      {
        slug: "marketing-site",
        title: "Soarce — marketing site",
        kind: "Full landing page · desktop and mobile",
        rationale:
          "Your homepage is 5,009 KB — thirty-four times the portfolio median of 146 KB, and the heaviest of all thirty-eight companies we measured. A materials company whose pitch is stronger, lighter, cheaper should not ship the heaviest page in its investor's portfolio. This rebuild is 416 KB and says the same things.",
        look: [
          "The hero is the material itself, full bleed, rather than a card describing it.",
          "Your own figures carry the page: 8x stronger than steel, 22 GPa tensile strength, 200x water retention.",
          "Weight. 416 KB against 5,009 KB — same claims, a ninety-two percent reduction.",
          "Space Grotesk over Epilogue, chosen so this page shares no typeface with any other study in this portfolio.",
        ],
        href: "/portal/soarce/index.html",
        card: "/portal/soarce/card.jpg",
        preview: "/portal/soarce/preview.jpg",
        caveats: [
          "Every claim and figure is yours, scraped from soarceusa.com on 2026-09-19, including the CAGE code and UEI.",
          "The circular fiber diagram is an illustrative rendering and is labelled as such on the page. It is not a captured micrograph.",
          "Your FAQ answers render inside a collapsed accordion we could not extract, so the page shows your questions and points to your site rather than inventing answers.",
          "Photography is licensed stock, credited on the page.",
        ],
        seo: {
          measuredOn: "2026-09-18",
          performance: 63,
          seoScore: 92,
          accessibility: 91,
          crux: false,
          queries: [
            { query: "nanofiber material for manufacturers", position: null, scanned: 10,
              winners: ["matregenix.com", "mono.ipros.com", "sciencedirect.com"] },
          ],
          verdict:
            "Your markup scores 92 and is not the problem. Performance at 63 is, and the 5,009 KB page is why. You do not appear in the top 10 for the phrase describing what you sell — matregenix.com does. Page weight and search are the same problem here: a page that heavy is slow to crawl and slow to load for the buyer who does find it.",
          notes: [
            "Lighthouse mobile, run 2026-09-18. Browser errors were logged to the console.",
            "Position from a live Google SERP via SerpApi, 10 organic results visible.",
          ],
        },
      },
    ],
  },
  {
    token: TOKENS.loanwell,
    client: "LoanWell",
    clientDomain: "loanwell.com",
    project: "Marketing site — direction study",
    round: "Round 01",
    deliveredOn: "2026-09-19",
    expiresOn: "2026-12-18",
    intro:
      "This is an unsolicited direction study. Your product copy and your mission are genuinely strong. The problem is that the lenders who most need you are not finding you, and the page argues about software rather than about capital.",
    next: [
      "Open the page and scroll it the way your buyer would.",
      "Leave notes anywhere on this page — they reach us by email immediately.",
      "If the direction is right, we scope the build against your full site map.",
    ],
    deliverables: [
      {
        slug: "marketing-site",
        title: "LoanWell — marketing site",
        kind: "Full landing page · desktop and mobile",
        rationale:
          "Affordable capital reaches nobody if the lender looking for the tool to deploy it cannot find you. Measured on 2026-09-18, you do not appear in the top 9 results for \"loan origination software for CDFI\". This rebuild leads with deployment rather than features, and closes on the line Collab Capital publishes from your own CEO.",
        look: [
          "The page argues about deploying capital, not about workflow features.",
          "Your own product screenshots — the servicing calculator and the underwriting workbook — bleeding off the right edge rather than centred in a card.",
          "The six partner organisations you already name, treated as the proof they are.",
          "Spectral over Libre Franklin, chosen so this page shares no typeface with any other study in this portfolio.",
        ],
        href: "/portal/loanwell/index.html",
        card: "/portal/loanwell/card.jpg",
        preview: "/portal/loanwell/preview.jpg",
        caveats: [
          "Every figure and line of product copy is yours, pulled from loanwell.com on 2026-09-19, including the SOC-2 Type 2 paragraph verbatim.",
          "The CEO quote is reproduced from Collab Capital's own portfolio page, not from an interview with us.",
          "One correction regardless of this study: the product screenshot served on your site contained a rendering seam, with amortisation rows 11 to 14 duplicated over row 17. We cropped above it here.",
        ],
        seo: {
          measuredOn: "2026-09-18",
          performance: 61,
          seoScore: 92,
          accessibility: 85,
          crux: false,
          queries: [
            { query: "loan origination software for CDFI", position: null, scanned: 9,
              winners: ["nortridge.com", "themortgageoffice.com", "builderspatch.com"] },
          ],
          verdict:
            "Your markup scores 92 and is not the problem. You are absent from the top 9 for the single phrase a CDFI would type when looking for exactly what you build, and three general-purpose lending platforms rank instead. None of them serves mission-driven lenders specifically — which is your whole differentiator, and the reason the gap is winnable.",
          notes: [
            "Lighthouse mobile, run 2026-09-18. Flagged: JavaScript execution time.",
            "Position from a live Google SERP via SerpApi, 9 organic results visible, so 'not found' means not in the top 9.",
          ],
        },
      },
    ],
  },
  {
    token: TOKENS.fyxit,
    client: "Fyxit AI",
    clientDomain: "hubbleiq.com",
    project: "Marketing site — direction study",
    round: "Round 01",
    deliveredOn: "2026-09-18",
    expiresOn: "2026-12-17",
    intro:
      "This is an unsolicited direction study. Your strongest asset is the product doing the work, and today the site describes it instead of showing it. So the hero is a real conversation resolving a real fault, with the live diagnostic Fyxit runs mid-thread — the thing that makes your claim \"does the work, not just the talking\" self-evident rather than asserted.",
    next: [
      "Open the page and scroll it the way a district IT director would.",
      "Leave notes anywhere on this page — they reach us by email immediately.",
      "If the direction is right, we scope the build and commission the full character set.",
    ],
    deliverables: [
      {
        slug: "marketing-site",
        title: "Fyxit AI — marketing site",
        kind: "Full landing page · illustrated character system",
        rationale:
          "The six problems on your live demo are the most concrete thing on your site and they are currently buttons. The page now opens on one of them being solved: a teacher reports Wi-Fi dropping in room 214, Fyxit reads the access point, finds channel overlap with AP-212, moves it and closes the issue in 2m 40s with no ticket opened. That is your product argument, rendered rather than claimed.",
        look: [
          "The hero conversation. Real interface, not a screenshot and not an illustration — it bleeds off the right edge so it reads as \"this continues\" rather than \"here is a picture of it\".",
          "The Monday-morning queue. Seven real tickets with their outcomes, five closing themselves and two escalating — your 60% figure shown as a list rather than stated as a stat.",
          "The trust rail names the districts you already list: Oakland Unified, Achievement First, La'Salle, Venus ISD, MSD Steuben County, Splendora ISD.",
          "The numbers band. 60% handled automatically, one line to deploy, zero workflow changes — all yours.",
          "Typography is Bricolage Grotesque over Figtree, deliberately different from the other studies in this portfolio so they do not read as one template.",
        ],
        href: "/portal/fyxit/index.html",
        card: "/portal/fyxit/card.jpg",
        preview: "/portal/fyxit/preview.jpg",
        caveats: [
          "Every figure and product claim is yours, quoted from hubbleiq.com on 2026-09-18: 60% of routine issues handled automatically, one line of code to deploy, no workflow changes, and the Incident IQ, Zendesk, Freshdesk, SMTP and Chrome integrations.",
          "The conversation, the diagnostic readings and the queue are illustrative — plausible values built to show the layout, not data from your system. A real build wires them to live telemetry or replaces them with a recorded session.",
          "Photography is real licensed stock from Pexels — Thirdman, Christina Morillo and Greece-China News — not generated. We used real photography deliberately here: the subject is schools, and generated imagery of children has no place on a page a district will read.",
          "District names are reproduced from your own Trusted By rail. We have not contacted any of them.",
          "The escalation figure on the page infers that what is not automated is escalated. Your site states the 60% but not the remainder, so treat that line as ours until you confirm it.",
        ],
        seo: {
          measuredOn: "2026-09-18",
          performance: null,
          seoScore: null,
          accessibility: null,
          crux: false,
          queries: [
            { query: "AI IT helpdesk for school districts", position: null, scanned: 9,
              winners: ["incidentiq.com", "aesa.us", "magicschool.ai"] },
          ],
          verdict:
            "You do not appear in the top 9 for the phrase that describes exactly what you sell. The site that ranks first is incidentiq.com — which you list on your own homepage as an integration partner. Your partner is winning your category search while you are absent from it, and a district director looking for what you do will find them instead.",
          notes: [
            "Position from a live Google SERP via SerpApi on 2026-09-18. We could see 9 organic results, so 'not found' means not in the top 9 — we cannot claim anything about position 10 or beyond.",
            "PageSpeed Insights could not complete a run against hubbleiq.com, so the three Lighthouse scores are unmeasured rather than zero. We will not print a number we did not get.",
            "The domain still resolves as hubbleiq.com while the product is branded Fyxit AI. Two names split whatever authority the domain has earned, and Collab Capital's own portfolio page still lists you as Hubble IQ.",
          ],
        },
      },
    ],
  },
  {
    token: TOKENS.janta,
    client: "Janta Power",
    clientDomain: "jantaus.com",
    project: "Marketing site — direction study",
    round: "Round 01",
    deliveredOn: "2026-09-18",
    expiresOn: "2026-12-17",
    intro:
      "This is an unsolicited direction study. We did not write a word of new copy or invent a single figure — every photograph, number and product line on the page is yours, taken from jantaus.com. The argument we are making is that the numbers you already publish are extraordinary and the page currently whispers them.",
    next: [
      "Open the page and scroll it the way a site owner with 400 acres would.",
      "Leave notes anywhere on this page — they reach us by email immediately.",
      "If the direction is right, we scope the build against your full site map.",
    ],
    deliverables: [
      {
        slug: "marketing-site",
        title: "Janta Power — marketing site",
        kind: "Full landing page · desktop and mobile",
        rationale:
          "Your best asset is buried in a slider widget: at 50 MW you save 222 acres, about 168 football fields, and still produce 30,617 MWh a year more. That is the whole company in one line, and today a visitor has to drag a control to find it. Here it is the largest thing on the page.",
        look: [
          "The land comparison. Your own two aerials, side by side at full bleed — traditional solar consuming the entire site next to towers on ground that stays open. The argument makes itself before anyone reads a number.",
          "The hero. Your headline, your photograph, and nothing covering it — no consent modal over the value proposition.",
          "The colour. #EFA21E is sampled from the amber in your own tower dashboard, not chosen by us.",
          "All six verticals are on the page at once as a dense row. Nothing scrolls out of view.",
          "Mobile. Resize the frame to phone width; the comparison stacks rather than shrinking.",
          "Scroll slowly through the land comparison. It is the page's one piece of motion and scroll is its timeline — the traditional array gives way to towers while the acreage counts 333 down to 111.",
        ],
        href: "/portal/janta/index.html",
        card: "/portal/janta/card.jpg",
        preview: "/portal/janta/preview.jpg",
        caveats: [
          "Every figure is yours, quoted from jantaus.com on 2026-09-18: 50% more energy, 3x power per unit area, up to 34% capacity factor, and the 50 MW comparison of 333 acres / 87,476 MWh against 111 acres / 118,093 MWh. We have not independently verified any of them.",
          "One correction you may want regardless of this study: the partner logo your site serves at /marketing/partners/pv-magazine-white.png, with alt text \"PV Magazine\", is actually the Third Derivative logo. A screen reader announces one organization while sighted visitors see another. We have labelled it correctly here.",
          "Munich Airport and Aena appear as text rather than logos because your site does not serve logo files for them.",
          "Photography, renders and partner logos are yours, used here only to show the layout. Nothing on this page is hosted for you or live.",
          "The motion is one 3 KB inline script and no animation library, animating only transform, opacity and clip-path so it stays off the main thread. It is disabled entirely under prefers-reduced-motion, which shows the comparison as a static split instead.",
        ],
        seo: {
          measuredOn: "2026-09-18",
          performance: 62,
          seoScore: 100,
          accessibility: 100,
          crux: false,
          queries: [
            { query: "vertical solar towers for commercial sites", position: null, scanned: 8,
              winners: ["reddit.com", "archanatura.com", "lumiton.solar"] },
            { query: "solar towers more energy less land", position: null, scanned: 8,
              winners: ["reddit.com", "facebook.com", "seia.org"] },
          ],
          verdict:
            "Your markup is not the problem — Google's own Lighthouse audit scores your SEO 100/100 and your accessibility 100/100, which is better than most of the portfolio. The problem is that you do not appear at all for the two queries that describe what you sell, and a Reddit thread ranks first for both. You are being out-ranked on your own category by a forum post.",
          notes: [
            "Lighthouse mobile, run 2026-09-18. Performance 62 is the weak number: legacy JavaScript, unused JavaScript and CSS, render-blocking requests and console errors are all flagged.",
            "Positions come from a live Google SERP via SerpApi. We could see 8 organic results per query, so 'not found' means not in the top 8 — we cannot claim anything about position 9 or beyond.",
            "A category this new has almost no competing pages, which cuts both ways: ranking is winnable cheaply, and nobody is searching the term yet. The traffic will come from the problem your buyers already search for — land constraints, megawatts per acre — not from the technology name.",
          ],
        },
      },
    ],
  },
  {
    token: TOKENS.micruity,
    client: "Micruity",
    clientDomain: "micruity.com",
    project: "Marketing site — direction study",
    round: "Round 01",
    deliveredOn: "2026-09-18",
    expiresOn: "2026-12-17",
    intro:
      "This is an unsolicited direction study. We rebuilt your marketing site as we would build it, using your own Solutions structure and your own four products, so the comparison is like for like rather than a redesign of something you did not write. Nothing here is live and nothing is a proposal yet — it is an argument made in HTML rather than in a deck.",
    next: [
      "Open the page and scroll it the way a plan sponsor would.",
      "Leave notes anywhere on this page — they reach us by email immediately.",
      "If the direction is right, we scope the build against your real copy and figures.",
    ],
    deliverables: [
      {
        slug: "marketing-site",
        title: "Micruity — marketing site",
        kind: "Full landing page · desktop and mobile",
        rationale:
          "Your site explains a category-defining product in the visual language of a template. This rebuild keeps your structure and your words, and changes only how much the page is willing to say about the people on the other end of an annuity.",
        look: [
          "The hero. It leads with a person rather than an abstraction, because the product is a retirement income, not a data pipe.",
          "The Solutions block. Same four products, same order, same names as your current Solutions page.",
          "The trust bar and the security section — the two places an institutional buyer stops.",
          "Mobile. Resize the frame to phone width; the whole page was built narrow-first.",
        ],
        href: "/portal/micruity/index.html",
        card: "/portal/micruity/card.jpg",
        preview: "/portal/micruity/preview.jpg",
        caveats: [
          "Every figure on the page is a placeholder. Latency, counterparty count, settlement window and onboarding time are ours, not yours, and would be replaced with your real numbers or removed.",
          "Photography is generated, licensed for this study only. A build would use a commissioned or stock-licensed set.",
          "Logos in the trust bar are indicative placement, not claimed relationships.",
        ],
        seo: {
          measuredOn: "2026-09-18",
          performance: 67,
          seoScore: 100,
          accessibility: 88,
          crux: false,
          queries: [
            { query: "retirement income infrastructure recordkeeper insurer", position: 1, scanned: 9, winners: [] },
            { query: "plan participant portability annuity", position: 6, scanned: 9, winners: [] },
          ],
          verdict:
            "You rank first for the phrase that describes your category and sixth for one of your products, so search is working better for you than for most of this portfolio. Lighthouse scores your SEO 100/100. The gap is accessibility at 88 and performance at 67 — and a colour-contrast failure that affects real readers, not just a score.",
          notes: [
            "Lighthouse mobile, run 2026-09-18. Flagged: insufficient contrast between background and foreground colours, links without discernible names, heading elements not in sequential order, render-blocking requests and legacy JavaScript.",
            "Ten <h1> elements on the homepage. One page should have one. It is not why you rank where you do, but it is the kind of thing that makes a page harder for assistive technology and for crawlers to read.",
            "Positions from a live Google SERP via SerpApi, 9 organic results visible per query.",
          ],
        },
      },
    ],
  },
];

export function getPortal(token: string): Portal | undefined {
  return portals.find((p) => p.token === token);
}

export function isExpired(portal: Portal): boolean {
  if (!portal.expiresOn) return false;
  return new Date(portal.expiresOn + "T23:59:59Z").getTime() < Date.now();
}

export function formatDate(iso: string): string {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
