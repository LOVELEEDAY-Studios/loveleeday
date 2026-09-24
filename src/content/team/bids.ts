import { TOKENS } from "@/content/tokens";

/* Every proposal (bid) LOVELEEDAY has built for a client. `emails` ties a bid to its tracked sends,
   `pages` to its page views (path prefixes, token included). Stage past "sent" is derived from the
   tracking data; `outcome` is the one thing a person sets by hand. No prices here, ever. */

export type Bid = {
  slug: string;
  client: string;
  contact: string;
  role: string;
  kind: string;
  emails: string[];
  pages: { label: string; path: string }[];
  outcome?: "meeting" | "won" | "lost";
  /** When it went out, for a send that was not tracked (ISO). Tracked sends are found automatically. */
  sentOn?: string;
  note?: string;
};

const p = (label: string, path: string, token: string | undefined) => (token ? [{ label, path: path.replace("{t}", token) }] : []);

export const bids: Bid[] = [
  {
    slug: "kalamazoo-county",
    client: "Kalamazoo County",
    contact: "Terrell Cole",
    role: "Interim County Administrator/Controller",
    kind: "Public-record analysis · Arthur for government",
    emails: ["terrell.cole@kalcounty.gov"],
    pages: p("County analysis", "/p/civic/{t}", TOKENS.kalcounty),
  },
  {
    slug: "global-citizens",
    client: "Global Citizens PCS",
    contact: "Lanette Dailey-Reese",
    role: "Director of Operations and Compliance",
    kind: "Compliance calendar",
    emails: ["ldaileyreese@globalcitizensschool.org"],
    pages: p("Compliance calendar", "/p/compliance/{t}", TOKENS.globalCitizens),
  },
  {
    slug: "lightship",
    client: "Lightship Capital",
    contact: "Brian Brackeen",
    role: "Lightship Capital",
    kind: "Three site rebuilds · portfolio study",
    emails: ["brian@lightship.capital", "bb@lightship.capital"],
    pages: [
      ...p("Portfolio page", "/p/portfolio/{t}", TOKENS.lightship),
      ...p("Lightship Capital study", "/portal/lightshipcapital/index.html?k={t}", TOKENS.lightshipCapital),
      ...p("Lightship Foundation study", "/portal/lightshipfoundation/index.html?k={t}", TOKENS.lightshipFoundation),
      ...p("Black Tech Week study", "/portal/blacktechweek/index.html?k={t}", TOKENS.blacktechweek),
    ],
  },
  {
    slug: "meknology",
    client: "Meknology",
    contact: "Daniel Hodges",
    role: "Meknology",
    kind: "Site rebuild · Arthur",
    emails: ["dhodges@meknology.com"],
    sentOn: "2026-09-22T00:00:00-04:00",
    pages: [
      ...p("Pitch page", "/p/portfolio/{t}", TOKENS.meknologyPortfolio),
      ...p("Site study", "/p/{t}", TOKENS.meknology),
    ],
  },
  {
    slug: "elemental",
    client: "Elemental Media",
    contact: "Nick Turske",
    role: "Managing Director",
    kind: "Spec spots · Elemental 2.0 · Arthur for production",
    emails: ["contact@inyourelement.media"],
    pages: [
      ...p("Proposal", "/p/studio/{t}", TOKENS.elementalPitch),
      ...p("Elemental 2.0", "/portal/elemental/concepts/c1-periodic.html?k={t}", TOKENS.elemental),
    ],
  },
  {
    slug: "startup-zoo",
    client: "Startup Zoo",
    contact: "Carl Brown",
    role: "Executive Director",
    kind: "Findings · homepage rebuild · Arthur for a hub",
    emails: ["carl.browniii@gmail.com", "info@startupzoo.org"],
    pages: [
      ...p("Proposal", "/p/hub/{t}", TOKENS.startupzoo),
      ...p("Homepage rebuild", "/portal/startupzoo/index.html?k={t}", TOKENS.startupzooStudy),
    ],
  },
  {
    slug: "collab-capital",
    client: "Collab Capital",
    contact: "Jewel Burks Solomon",
    role: "Managing Partner",
    kind: "Portfolio study",
    emails: [],
    pages: p("Portfolio page", "/p/portfolio/{t}", TOKENS.collab),
  },
  {
    slug: "100km",
    client: "100KM VC",
    contact: "Shalanda Armstrong",
    role: "100KM VC",
    kind: "Portfolio study",
    emails: [],
    pages: p("Portfolio page", "/p/portfolio/{t}", TOKENS.hundredkm),
  },
  {
    slug: "venturehue",
    client: "VentureHue",
    contact: "Brittni Abiolu",
    role: "VentureHue",
    kind: "Portfolio study · site rebuild",
    emails: [],
    pages: [
      ...p("Portfolio page", "/p/portfolio/{t}", TOKENS.venturehue),
      ...p("Site study", "/p/{t}", TOKENS.venturehueStudy),
    ],
  },
];

export const getBid = (slug: string) => bids.find((b) => b.slug === slug);
