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
