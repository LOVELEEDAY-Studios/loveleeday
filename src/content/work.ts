import { v } from "./assetVersion";

/* One source of truth for what this company has built.

   Before this file there were two disconnected bodies of work: /work listed
   five shipped products in inline data, and six client direction studies lived
   only behind portal tokens with no route on the public site pointing at them.
   A visitor could not see that they were the same company's output.

   NAMING, deliberately asymmetric. The shipped products are named, because they
   are Daniel's own companies or were commissioned. The six rebuilds are NOT
   named on the public site: they are uncommissioned direction studies of real
   companies, each carrying measured criticism of the site it replaces, and
   publishing that criticism on a marketing page is a different act from sending
   one company its own private link. The imagery is the studio's own work and
   shows; the identities stay behind the tokens. One line in `studies` reverses
   this if that call changes. */

export interface Product {
  index: string;
  slug: string;
  title: string;
  category: string;
  tech: string[];
  shipped: string;
  problem: string;
  built: string;
  outcome: string;
  link: string | null;
  /** Used as the <meta name="description"> on /work/<slug>. */
  meta: string;
}

export const products: Product[] = [
  {
    index: "01",
    slug: "olldae",
    meta: "How LOVELEEDAY Studios built a bar and restaurant operating system in 11 days — Next.js, Supabase, Stripe, twelve Edge Functions.",
    title: "olldae",
    category: "SaaS / Restaurant technology",
    tech: ["Next.js", "Supabase", "Stripe", "Vercel", "Edge Functions"],
    shipped: "MVP in 11 days. Full v1 in 6 weeks.",
    problem:
      "Independent bars and restaurants ran inventory, recipes, and catering quotes across spreadsheets, text threads, and single-purpose tools. No unified view of stock levels, no costing engine, no way to produce a catering quote without a back-and-forth email chain.",
    built:
      "A full-stack restaurant operating system — live inventory tracking, recipe costing, multi-step catering quoting, and Stripe monthly billing with a self-serve portal. Twelve Supabase Edge Functions handle background sync, webhook idempotency, and rate limiting. Staff access the platform from both desktop and mobile.",
    outcome:
      "Venue operators reduced catering quote turnaround from a multi-day email chain to a same-session workflow. Inventory, recipes, and billing consolidated into a single platform.",
    link: "https://olldae.com",
  },
  {
    index: "02",
    slug: "kronos",
    meta: "A 22-route multi-entity financial platform connecting Stripe Financial Connections, Xero and Supabase behind role-scoped auth.",
    title: "Kronos",
    category: "Financial tooling / Multi-entity",
    tech: ["Next.js", "Supabase", "Stripe Financial Connections", "Xero API"],
    shipped: "Auth and core routing in 5 days. Full integration in 3 weeks.",
    problem:
      "A holding company with multiple operating businesses needed a unified view of financial data across accounts — without manually exporting CSVs from Stripe, Xero, and bank portals every week.",
    built:
      "A 22-route internal platform connecting Stripe Financial Connections for live transaction feeds, Xero for accounting sync, and Supabase for persistent state and auth. Authentication is role-scoped so team members see only the data relevant to their entity. The Xero OAuth flow refreshes tokens in the background.",
    outcome:
      "Cross-entity financial data pulled into a single authenticated dashboard, replacing weekly manual reconciliation across three separate vendor portals.",
    link: null,
  },
  {
    index: "03",
    slug: "hospitality-ops",
    meta: "A custom operations layer handling 800+ emails a week through automated triage, routing and calendar deduplication on Fly.io.",
    title: "Hospitality Ops Layer",
    category: "Internal systems / Automation",
    tech: ["Node.js", "Supabase", "Resend", "Fly.io", "TypeScript"],
    shipped: "Core pipeline in 3 weeks.",
    problem:
      "A hospitality holding company was managing email across five accounts, calendar events across four integrations, and communications across a patchwork of manual processes — consuming hours of overhead each week.",
    built:
      "A custom ops layer handling 800+ emails per week through automated triage and routing, calendar deduplication across four grant sources, real-time communications routing, and automated government-form filing. Each module runs as a standalone daemon on Fly.io with health checks and error recovery.",
    outcome:
      "Inbox-to-action cycle moved from manual review to automated routing with human-in-the-loop confirmation, across every communication channel.",
    link: null,
  },
  {
    index: "04",
    slug: "duezy",
    meta: "An invoice automation SaaS with line-item billing, automated reminders via Resend and an embedded Stripe checkout link.",
    title: "Duezy",
    category: "SaaS / Invoice automation",
    tech: ["Next.js", "Supabase", "Stripe", "Resend", "Vercel"],
    shipped: "Functional billing flow in 7 days.",
    problem:
      "Small service businesses were spending hours each week manually generating invoices, chasing late payments, and reconciling what had and hadn't been paid. Existing tools were either too bloated or required accounting expertise to configure.",
    built:
      "An invoice platform with client management, line-item billing, automated payment reminders via Resend, and a Stripe checkout link embedded directly in outbound email. Clients pay without creating an account. Operators see real-time payment status across all outstanding invoices in one view.",
    outcome:
      "Invoice-to-payment moved from multi-day manual follow-up to an automated collect-on-send flow, with outstanding invoice tracking consolidated into a single view.",
    link: null,
  },
  {
    index: "05",
    slug: "dabney",
    meta: "Brand and site rebuild for Dabney & Co., a craft cocktail bar in Kalamazoo, MI — typographic redesign, OpenTable integration, three weeks.",
    title: "Dabney & Co.",
    category: "Brand / Hospitality",
    tech: ["Next.js", "Tailwind CSS", "OpenTable API", "Vercel"],
    shipped: "Design to production in 3 weeks.",
    problem:
      "A craft cocktail bar in Kalamazoo, MI had a web presence that hadn't kept pace with the brand. No reservation flow, slow load times, and a design that worked against the guest experience before they walked in the door.",
    built:
      "A full redesign on a custom typographic system — paired display and monospace type, a restrained palette of cream, black and deep red. OpenTable reservations embedded directly in the page. Nine responsive pages including menu, events and catering inquiry.",
    outcome:
      "A web presence that matches the bar's physical aesthetic. Guests move from discovery to reservation without leaving the site.",
    link: "https://dabneyandco.com",
  },
];

/** The six uncommissioned rebuilds. `frame` is the studio's own render. */
export interface Study {
  id: string;
  sector: string;
  /** What the rebuild argued, without naming the company. */
  thesis: string;
  frame: string;
}

export const studies: Study[] = [
  {
    id: "S-01",
    sector: "RNA therapeutics",
    thesis:
      "A platform in the middle of a rename, with the old name still on its investor's portfolio page. The rebuild leads with the science rendered from a crystal structure rather than stock lab photography.",
    frame: v("/portal/collab/novarna-after.jpg"),
  },
  {
    id: "S-02",
    sector: "Utility-scale solar",
    thesis:
      "A hardware company whose site read as a brochure. The rebuild puts the economics in the hero and takes its palette from the amber in the company's own tower dashboard.",
    frame: v("/portal/collab/janta-after.jpg"),
  },
  {
    id: "S-03",
    sector: "AI service desk",
    thesis:
      "A product whose whole claim is speed, sold behind an illustrated mascot. The rebuild makes the hero the conversation that resolves a ticket, in real interface.",
    frame: v("/portal/collab/fyxit-after.jpg"),
  },
  {
    id: "S-04",
    sector: "Advanced materials",
    thesis:
      "A 5,009 KB homepage for a company selling a material you can hold. The rebuild leads with the material at macro and ships a fraction of the weight.",
    frame: v("/portal/collab/soarce-after.jpg"),
  },
  {
    id: "S-05",
    sector: "Retirement income",
    thesis:
      "An infrastructure business presenting itself in the language of a startup. The rebuild sets it in the register of the institutions it sells to.",
    frame: v("/portal/collab/micruity-after.jpg"),
  },
  {
    id: "S-06",
    sector: "Lending software",
    thesis:
      "A workflow product with no workflow on the page. The rebuild shows the loan moving through it, stage by stage.",
    frame: v("/portal/collab/loanwell-after.jpg"),
  },
];

/* Figures. Every one of these carries where it came from, because the rule this
   site holds its client work to is the rule it has to hold itself to. Nothing
   here is a projection and nothing is rounded up. */
export const figures: { k: string; label: string; source: string }[] = [
  {
    k: "5",
    label: "Products in production",
    source: "olldae, Kronos, Duezy, the ops layer and Dabney & Co. — all live, all listed below.",
  },
  {
    k: "6",
    label: "Sites rebuilt in working HTML",
    source:
      "One venture portfolio, audited end to end, then rebuilt as running pages rather than described in a deck.",
  },
  {
    k: "38",
    label: "Sites measured in that audit",
    source:
      "Page weight, Lighthouse, live search position and accessibility, measured per site on 2026-09-19.",
  },
  {
    k: "11",
    label: "Days to first production MVP",
    source: "olldae, from empty repository to a deployed v1 taking real payments.",
  },
];
