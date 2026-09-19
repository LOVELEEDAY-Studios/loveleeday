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
    token: "fyx-d50eadd57473b505ca",
    client: "Fyxit AI",
    clientDomain: "hubbleiq.com",
    project: "Marketing site — direction study",
    round: "Round 01",
    deliveredOn: "2026-09-18",
    expiresOn: "2026-12-17",
    intro:
      "This is an unsolicited direction study. Your product is a character — the site says \"Meet Rosie\" and describes her as a technician who does the work rather than talks about it — and she has never been drawn. So we drew her, doing the six jobs your own demo chips already name, and built the page around her.",
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
          "You named your product after a person and then showed nobody. The six problems on your live demo — slow Wi-Fi, a laggy computer, a jammed printer, an app that will not load, a cracked screen, a phishing email — are the most concrete thing on your site, and they are currently buttons. Here they are the spine of the page, with one consistent Rosie doing each of them.",
        look: [
          "Rosie herself. One character across six frames — same face, same shirt, same badge — which is what makes a character system rather than six stock illustrations.",
          "The six jobs. Your own demo chips, promoted from buttons to the page's structure.",
          "The trust rail names the districts you already list: Oakland Unified, Achievement First, La'Salle, Venus ISD, MSD Steuben County, Splendora ISD.",
          "The numbers band. 60% handled automatically, one line to deploy, zero workflow changes — all yours.",
          "Typography is Bricolage Grotesque over Figtree, deliberately different from the other studies in this portfolio so they do not read as one template.",
        ],
        href: "/portal/fyxit/index.html",
        card: "/portal/fyxit/card.jpg",
        preview: "/portal/fyxit/preview.jpg",
        caveats: [
          "Every figure and product claim is yours, quoted from hubbleiq.com on 2026-09-18: 60% of routine issues handled automatically, one line of code to deploy, no workflow changes, and the Incident IQ, Zendesk, Freshdesk, SMTP and Chrome integrations.",
          "Rosie is AI-generated for this study and is not a licensed character. A real build would commission her properly from an illustrator so you own her outright — which matters, because a character you cannot legally defend is not a brand asset.",
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
    token: "jnt-2a727d076b273e9059",
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
    token: "mcr-2d78a1f2ecb70e52e3",
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
