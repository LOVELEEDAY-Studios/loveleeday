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
import { v } from "./assetVersion";
import { lightshipPortals } from "./lightship-studies";

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
  /** Commercials cut from the client's own footage. */
  videos?: Video[];
}

export interface Video {
  title: string;
  /** One line: what it is for and where it runs. */
  caption: string;
  src: string;
  poster: string;
  /** "16/9" or "9/16". */
  aspect: string;
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
      "This is an unsolicited direction study. We kept Fraunces and your crimson and changed the rest — the reasoning is on the page and in the notes below — so we kept your design system rather than imposing ours. What changed is what the header says, and where your best proof sits.",
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
          "The hero object is the molecule, not a diagram of a process — an A-form RNA duplex built to real geometry and rendered in the browser: 32.7° of twist per base pair, 2.8 Å rise, and the narrow major groove that tells RNA apart from DNA. It is lit, depth-sorted and turning, and the four bases NovaEngine designed arrive last and in red. No 3D library, and the whole page is 48 KB.",
          "The Michigan result has its own section and reads as a result — four rows that print one at a time — rather than sitting in a paragraph near the bottom.",
          "Your loop is four numbered rows on rules, and a red line draws down them under your own scroll rather than on a timer you are not driving.",
          "Your crimson is untouched and Fraunces still sets every heading. We did change the other two faces, and you should push back if you disagree: Work Sans and JetBrains Mono came from different families, so your body copy and your labels were assembled rather than designed together. IBM Plex Sans and IBM Plex Mono are one superfamily drawn for technical and scientific work, and they share skeletons, so the instrument-grade labels and the running text finally agree.",
          "Every moving thing on the page stops under prefers-reduced-motion — the molecule paints its resolved state once, the counters print their final values, the assay shows every row.",
        ],
        href: "/portal/novarna/index.html",
        card: v("/portal/novarna/card.jpg"),
        preview: v("/portal/novarna/preview.jpg"),
        caveats: [
          "Every figure is yours, quoted from circnova.com on 2026-09-19: 7x faster development cycles, 100% proprietary training data, and the DiFeo Lab result.",
          "We did not draw a comparison chart of the Michigan result. The magnitude of the outperformance is not disclosed anywhere, and two bars would imply one.",
          "The molecule is a correct A-form duplex but it is not YOUR molecule — the sequence shown is illustrative, and the region marked in red stands for a designed region rather than depicting one of your candidates.",
          "Photography is licensed stock, credited at the foot of the page. It shows laboratory work in general, not Novarna's staff or facilities.",
          "Your assets already serve from novarna.ai while the domain still resolves as circnova.com. Two names split whatever authority the domain has earned, and Collab Capital's portfolio page still lists you as CircNova.",
        ],
        seo: {
          measuredOn: "2026-09-18",
          performance: 68,
          seoScore: 100,
          accessibility: 94,
          crux: false,
          queries: [
            { query: "AI RNA therapeutics design platform", position: 9, scanned: 9,
              winners: ["sciencedirect.com", "bocsci.com", "journals.asm.org"] },
          ],
          verdict:
            "Lighthouse scores your SEO 100/100, so the markup is not the problem. You sit ninth — last of the nine results we can see — for the phrase describing your platform, and the eight above you are journals and catalog sites, not companies. There is no commercial competitor to displace, only reference material. That is a category winnable cheaply, and also one nobody is searching yet. Your traffic will come from the target, not the technology name.",
          notes: [
            "Lighthouse mobile, run 2026-09-18. Flagged: multiple page redirects, unused JavaScript.",
            "Position from a live Google SERP via SerpApi, re-measured 2026-09-19. 9 organic results visible.",
            "Measured against circnova.com and novarna.ai together, since your assets already serve from the second.",
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
        card: v("/portal/soarce/card.jpg"),
        preview: v("/portal/soarce/preview.jpg"),
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
            { query: "nanofiber material for manufacturers", position: null, scanned: 9,
              winners: ["matregenix.com", "mono.ipros.com", "sciencedirect.com"] },
          ],
          verdict:
            "Your markup scores 92 and is not the problem. Performance at 63 is, and the 5,009 KB page is why. You do not appear in the top 9 for the phrase describing what you sell — matregenix.com does. Page weight and search are the same problem here: a page that heavy is slow to crawl and slow to load for the buyer who does find it.",
          notes: [
            "Lighthouse mobile, run 2026-09-18. Browser errors were logged to the console.",
            "Position from a live Google SERP via SerpApi, re-measured 2026-09-19. 9 organic results visible, so 'not found' means not in the top 9.",
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
          "Affordable capital reaches nobody if the lender looking for the tool to deploy it cannot find you. Re-measured on 2026-09-19, you do not appear in any of the 9 Google results we can see for \"loan origination software for CDFI\". This rebuild leads with deployment rather than features, and closes on the line Collab Capital publishes from your own CEO.",
        look: [
          "The page argues about deploying capital, not about workflow features.",
          "Your own product screenshots — the servicing calculator and the two-sided task list — bleeding off the right edge rather than centered in a card.",
          "The six partner organizations you already name, treated as the proof they are.",
          "Spectral over Libre Franklin, chosen so this page shares no typeface with any other study in this portfolio.",
        ],
        href: "/portal/loanwell/index.html",
        card: v("/portal/loanwell/card.jpg"),
        preview: v("/portal/loanwell/preview.jpg"),
        caveats: [
          "Every figure and line of product copy is yours, pulled from loanwell.com on 2026-09-19, including the SOC-2 Type 2 paragraph verbatim.",
          "The CEO quote is reproduced from Collab Capital's own portfolio page, not from an interview with us.",
          "Two corrections regardless of this study. The servicing screenshot on your site contains a rendering seam, with amortization rows 11 to 14 duplicated over row 17. And every logged-in screenshot on loanwell.com shows a real work address in the header bar — bernard@loanwell.com and bernard+tc@loanwell.com are legible at full size on six of the seven. We cropped both out here; your own site still serves them.",
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
            "Position from a live Google SERP via SerpApi, re-measured 2026-09-19. 9 organic results visible, so 'not found' means not in the top 9 — and nothing about Bing, where you do appear.",
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
        card: v("/portal/fyxit/card.jpg"),
        preview: v("/portal/fyxit/preview.jpg"),
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
          "Your best asset is a footnote. Your own worked example — 500 kW in Dallas — is 3.3 acres of fixed-tilt panels making 876,000 kWh a year against one acre of towers making 1,182,600. Multiplied out at that ratio, a 50 MW build saves 230 acres, about 174 football fields, and still produces 30,660 MWh a year more. That is the whole company in one line, and here it is the largest thing on the page.",
        look: [
          "The land comparison. Your own two aerials, side by side at full bleed — traditional solar consuming the entire site next to towers on ground that stays open. The argument makes itself before anyone reads a number.",
          "The hero. Your headline, your photograph, and nothing covering it — no consent modal over the value proposition.",
          "The color. #EFA21E is sampled from the amber in your own tower dashboard, not chosen by us.",
          "All six verticals are on the page at once as a dense row. Nothing scrolls out of view.",
          "Mobile. Resize the frame to phone width; the comparison stacks rather than shrinking.",
          "Scroll slowly through the land comparison. It is the page's one piece of motion and scroll is its timeline — the traditional array gives way to towers while the acreage counts 330 down to 100.",
        ],
        href: "/portal/janta/index.html",
        card: v("/portal/janta/card.jpg"),
        preview: v("/portal/janta/preview.jpg"),
        caveats: [
          "Every input is yours, read from jantaus.com on 2026-09-18: 50% more energy, 3x power per unit area, up to 34% capacity factor, and the 500 kW Dallas comparison of 3.3 acres / 876,000 kWh against 1 acre / 1,182,600 kWh — the 35% more yield you publish. The 50 MW figures on the page are that comparison multiplied by 100 at your own ratio; the page says so in the same breath. We have not independently verified any of your underlying claims.",
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
            { query: "solar towers more energy less land", position: null, scanned: 9,
              winners: ["sciencedirect.com", "youtube.com", "youtube.com"] },
          ],
          verdict:
            "Your markup is not the problem — Google's own Lighthouse audit scores your SEO 100/100 and your accessibility 100/100, which is better than most of the portfolio. The problem is that you do not appear at all for either query that describes what you sell. A Reddit thread asking whether solar towers are even a real thing ranks first for one; a journal index and two YouTube videos take the other. You are being out-ranked on your own category by a forum post and a playlist.",
          notes: [
            "Lighthouse mobile, run 2026-09-18. Performance 62 is the weak number: legacy JavaScript, unused JavaScript and CSS, render-blocking requests and console errors are all flagged.",
            "Positions come from a live Google SERP via SerpApi, re-measured 2026-09-19. We could see 8 and 9 organic results, so 'not found' means not in the top 8 — we cannot claim anything beyond that.",
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
        card: v("/portal/micruity/card.jpg"),
        preview: v("/portal/micruity/preview.jpg"),
        caveats: [
          "Every figure on the page is a placeholder. Latency, counterparty count, settlement window and onboarding time are ours, not yours, and would be replaced with your real numbers or removed.",
          "Photography is real licensed stock from Pexels — Askar Abayev, Baraa Obied, Yan Krukau and Mikhail Nilov — credited in the page source. An earlier version of this study used AI-generated people; it was replaced, because a page about someone's retirement should not be illustrated with someone who does not exist.",
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
            { query: "plan participant portability annuity", position: 5, scanned: 9, winners: [] },
          ],
          verdict:
            "You rank first for the phrase that describes your category — and ninth as well, with two results on the same page — and fifth for one of your products, so search is working better for you than for most of this portfolio. Lighthouse scores your SEO 100/100. The gap is accessibility at 88 and performance at 67, and a color-contrast failure that affects real readers rather than just a score.",
          notes: [
            "Lighthouse mobile, run 2026-09-18. Flagged: insufficient contrast between background and foreground colors, links without discernible names, heading elements not in sequential order, render-blocking requests and legacy JavaScript.",
            "Ten <h1> elements on the homepage. One page should have one. It is not why you rank where you do, but it is the kind of thing that makes a page harder for assistive technology and for crawlers to read.",
            "Positions from a live Google SERP via SerpApi, 9 organic results visible per query.",
          ],
        },
      },
    ],
  },
  {
    token: TOKENS.enable as string,
    client: "Enable Injections",
    clientDomain: "enableinjections.com",
    project: "Marketing site — direction study",
    round: "Round 01",
    deliveredOn: "2026-09-22",
    expiresOn: "2026-12-21",
    intro:
      "This is an unsolicited direction study and nothing here is a proposal. Your site is technically healthy — we measured it before we touched anything, and it scores better than most of the portfolio it sits in. The argument is about order, not speed: the things that make you credible are at the bottom of the page.",
    next: [
      "Open the page and scroll it the way a pharma partner would.",
      "Leave notes anywhere on this page — they reach us by email immediately.",
      "If the direction is right, we scope the build against your full site map.",
    ],
    deliverables: [
      {
        slug: "marketing-site",
        title: "Enable Injections — marketing site",
        kind: "Full landing page · desktop and mobile",
        rationale:
          "You have FDA clearance and named programs with Sanofi, Roche and Sobi. On the live site those sit under a heading called Current Partnerships, several scrolls below the fold, after the product explanation. This rebuild changes the order and almost nothing else — clearance and partners ride in the hero, and your own patient quotes do the closing.",
        look: [
          "The hero leads with the device, the clearance and the three partner names, in that order.",
          "The device is your own photograph, not an illustration we drew.",
          "Your product description is used verbatim. We did not rewrite what you say enFuse does.",
          "Montserrat and your own magenta and navy, sampled from your rendered page rather than guessed.",
        ],
        href: "/portal/enable/index.html",
        card: v("/portal/enable/card.jpg"),
        preview: v("/portal/enable/preview.jpg"),
        caveats: [
          "Every claim, figure, partner name and patient quote belongs to you and was read from enableinjections.com on 2026-09-22. We have not independently verified any clinical claim.",
          "The device image is your own photograph, downloaded from your site. An earlier version of this study drew the device as a diagram instead; it was replaced because it did not look like your product.",
          "Your site defers sixty images with data-lazy. That is working in your favor and we kept the approach — it is why your page is fast.",
          "No search positions are claimed anywhere in this study. The tooling that measured search for other studies in this portfolio is not configured on this project, so rather than estimate we say nothing.",
        ],
        seo: {
          measuredOn: "2026-09-22",
          performance: 88,
          seoScore: 100,
          accessibility: 99,
          crux: false,
          queries: [],
          verdict:
            "Healthy, and better than most of the portfolio around it. Largest contentful paint 2.1 seconds, best practices 100. There is no performance problem here to solve and this study does not pretend otherwise.",
          notes: [
            "Lighthouse mobile, run locally 2026-09-22. The PageSpeed Insights API returned HTTP 429 across this portfolio, so every score in this study is from a local run of the same engine.",
            "No CrUX field data is quoted. A local Lighthouse run cannot see it, and an absent field record needs its own explanation rather than a blank.",
            "Total transfer 4.49 MB. Heavy in absolute terms, but the deferral means it does not cost the user the way the raw number suggests.",
          ],
        },
      },
    ],
  },
  {
    token: TOKENS.venturehueStudy as string,
    client: "VentureHue",
    clientDomain: "venturehue.com",
    project: "Marketing site — direction study",
    round: "Round 01",
    deliveredOn: "2026-09-22",
    expiresOn: "2026-12-21",
    intro:
      "This is an unsolicited direction study and nothing here is a proposal. You coach founders on being ready for capital, and the $2,192,470 your network has raised is the proof of it. This is what your own storefront could look like carrying that.",
    next: [
      "Open the page and scroll it the way a pre-seed founder deciding whether to trust you would.",
      "Leave notes anywhere on this page — they reach us by email immediately.",
      "If the direction is right, we scope the build against your full site map.",
    ],
    deliverables: [
      {
        slug: "marketing-site",
        title: "VentureHue — marketing site",
        kind: "Full landing page · desktop and mobile",
        rationale:
          "Everything on this page is yours: the ACCESS Lab programme, the four stages, the $2,192,470 raised across your network, your sixteen years in capital access, the Michigan Founders Fund pre-accelerator with gener8tor, and your own testimonials. None of it is currently reachable on venturehue.com. The rebuild is that material, arranged.",
        look: [
          "The track record leads. $2,192,470 is the first number a founder sees, not a footnote.",
          "ACCESS Lab is an indexed sequence rather than three equal cards, so the programme reads as a path.",
          "Your own blue and purple, sampled from your stylesheet, and Poppins and Open Sans, which your site already loads.",
          "Testimonials from Eric Williamson, Sharon Porter and Akindele Akinyemi, recovered from your own pages.",
        ],
        href: "/portal/venturehue/index.html",
        card: v("/portal/venturehue/card.jpg"),
        preview: v("/portal/venturehue/preview.jpg"),
        caveats: [
          "Your live homepage and /project/ both render “Nothing Found”, and the individual project pages return 404. The copy here was recovered from a June 2026 archive of your own site, not written for you.",
          "The page carries no photography. That is a real gap and the honest reason is that we found none of yours to use. Novarna's study in this portfolio is carried by four photographs; this one is carried by type alone.",
          "Brand colors were sampled from venturehue.com's stylesheet rather than guessed, but you have no published brand guide we could check them against.",
          "No search positions are claimed. The tooling that measured search for other studies is not configured on this project, so rather than estimate we say nothing.",
        ],
      },
    ],
  },
  {
    token: TOKENS.meknology as string,
    client: "Meknology",
    clientDomain: "meknology.com",
    project: "Marketing site — direction study",
    round: "Round 01",
    deliveredOn: "2026-09-22",
    expiresOn: "2026-12-21",
    intro:
      "Thank you for the time today. Your system turns a brewery's weekly disposal bill into three things it can sell, and a brewer understands that in one sentence. Your current site takes seven sections to get there. This is a first direction for the same material, told in the order a brewery owner would ask for it. Tell us what is wrong with it; that is what the note box below is for.",
    next: [
      "Open the page and scroll it the way a brewery owner paying for hauling every week would.",
      "Leave notes anywhere on this page — they reach us by email immediately.",
      "If the direction is right, we scope the build against your full site map.",
    ],
    deliverables: [
      {
        slug: "marketing-site",
        title: "Meknology — marketing site",
        kind: "Full landing page · desktop and mobile",
        rationale:
          "Your best material isn't on your homepage. The planned deployments at Mammoth Distilling, Roar Brewing and HOMES Brewpub, the $50,000 state grant, Techstars and Kalamazoo Forward Ventures behind you, and a founder who designed products at Ford and Whirlpool. A brewery owner deciding whether to trust new equipment in their plant looks for exactly those things, and today they find a stock water splash and an unfinished FAQ answer. The rebuild puts that proof on the page.",
        look: [
          "The headline is the decision the buyer is actually making: stop paying to haul it away, start selling what's in it.",
          "One diagram shows the whole idea: three waste streams go in, and feed, biochar and clean water come out.",
          "Color means something. Your own blue, sampled from your logo, now stands only for water. Amber is grain and charcoal is biochar, so a color anywhere on the page tells you which product you are reading about.",
          "The seven problem cards became one table, with how things are today next to how they'd be with Meknology, so each problem sits beside its answer.",
          "Your four contact forms became four doors with a label on each, so a farmer buying feed and an investor never land in the same form.",
          "Your first sites, your backers and Daniel Hodges' engineering background each get their own section. None of them is on your current homepage.",
        ],
        href: "/portal/meknology/index.html",
        card: v("/portal/meknology/card.jpg"),
        preview: v("/portal/meknology/preview.jpg"),
        caveats: [
          "Every product claim and the 12–24 month payback are yours, taken from meknology.com on 2026-09-22. The first sites, the grant, the backers and Daniel's background come from Second Wave Media (October 2025), Michigan EGLE and CB Insights, not from your site.",
          "Mammoth, Roar and HOMES are labeled as planned deployments because that is how the press reported them. If any is now running, it should say so and carry a number.",
          "We left out the product images on your current site. They look computer-generated, and a buyer judging physical equipment will notice. Photography here is licensed stock of breweries, grain and soil, credited in the footer, and none of it shows your system. A real photo of the prototype would beat every image on the page.",
          "One FAQ answer on your live site still contains a placeholder: \"(word for taking biological ingredients to make plastic)\". We filled it in as \"bioplastics\"; your live site is worth fixing today regardless.",
          "Your site lists Southfield as your location, while Second Wave reported a move to Kalamazoo. We wrote \"Built in Michigan\" rather than pick one.",
          "Your homepage has no search description, no share image, and all 31 of its images have empty alt text. This page has the description and the alt text; the share image comes with the build.",
        ],
      },
    ],
  },
  ...lightshipPortals,
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
