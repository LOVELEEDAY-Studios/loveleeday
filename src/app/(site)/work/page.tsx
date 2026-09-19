import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Recent Work — LOVELEEDAY Studios",
  description:
    "Production projects built by LOVELEEDAY Studios — SaaS platforms, branded hospitality sites, internal tools, and billing automation.",
  alternates: {
    canonical: "https://loveleedaystudios.com/work",
  },
};

const caseStudies = [
  {
    index: "01",
    slug: "olldae",
    title: "olldae",
    category: "SaaS / Restaurant Technology",
    tech: ["Next.js", "Supabase", "Stripe", "Vercel", "Edge Functions"],
    shipped: "MVP in 11 days. Full v1 in 6 weeks.",
    problem:
      "Independent bars and restaurants ran inventory, recipes, and catering quotes across spreadsheets, text threads, and single-purpose tools. No unified view of stock levels, no costing engine, no way to produce a catering quote without a back-and-forth email chain.",
    built:
      "A full-stack restaurant operating system — live inventory tracking, recipe costing, multi-step catering quoting, and Stripe monthly billing with a self-serve portal. Twelve Supabase Edge Functions handle background sync, webhook idempotency, and rate limiting. Staff access the platform from both desktop and mobile. $49/mo flat pricing.",
    outcome:
      "Venue operators reduced catering quote turnaround from a multi-day email chain to a same-session workflow. Inventory, recipes, and billing consolidated into a single platform.",
    link: null,
  },
  {
    index: "02",
    slug: "dabney",
    title: "Dabney & Co.",
    category: "Brand / Hospitality Website",
    tech: ["Next.js", "Tailwind CSS", "OpenTable API", "Vercel"],
    shipped: "Design to production in 3 weeks.",
    problem:
      "A craft cocktail bar in Kalamazoo, MI had a web presence that hadn't kept pace with the brand. No reservation flow, slow load times, and a design that worked against the guest experience before they walked in the door.",
    built:
      "A full redesign using a custom typographic system — paired display and monospace type, a restrained palette of cream, black, and deep red. OpenTable reservations are embedded directly into the page. Nine fully responsive pages including menu, events, and catering inquiry. Single-file SPA for deploy simplicity; brutalist grid for visual character.",
    outcome:
      "A web presence that reflects the bar's physical aesthetic. Guests move from discovery to reservation without leaving the site.",
    link: "https://dabney-v4-4252zudrh-may12803s-projects.vercel.app",
  },
  {
    index: "03",
    slug: "hospitality-ops",
    title: "Hospitality Ops Layer",
    category: "Internal Systems / Automation",
    tech: ["Node.js", "Supabase", "Resend", "Fly.io", "TypeScript"],
    shipped: "Core pipeline in 3 weeks.",
    problem:
      "A hospitality holding company was managing email across five accounts, calendar events across four integrations, and communications across a patchwork of manual processes — consuming hours of overhead each week.",
    built:
      "A custom ops layer handling 800+ emails per week through automated triage and routing, calendar deduplication across four grant sources, real-time communications routing, and automated government-form filing via fax. Each module runs as a standalone daemon on Fly.io with health checks and error recovery.",
    outcome:
      "Inbox-to-action cycle reduced from manual review to automated routing with human-in-the-loop confirmation. Week-over-week overhead cut substantially across every communication channel.",
    link: null,
  },
  {
    index: "04",
    slug: "kronos",
    title: "Kronos",
    category: "Internal Product / Financial Tooling",
    tech: ["Next.js", "Supabase", "Stripe Financial Connections", "Xero API", "Vercel"],
    shipped: "Auth and core routing in 5 days, full integration in 3 weeks.",
    problem:
      "A holding company with multiple operating businesses needed a unified view of financial data across accounts — without manually exporting CSVs from Stripe, Xero, and bank portals every week.",
    built:
      "A 22-route internal platform that connects Stripe Financial Connections for live transaction feeds, Xero for accounting sync, and Supabase for persistent state and auth. Authentication is role-scoped so different team members see only the data relevant to their entity. The Xero OAuth flow handles token refresh automatically in the background.",
    outcome:
      "Cross-entity financial data pulled into a single authenticated dashboard. Eliminated weekly manual reconciliation cycles across three separate vendor portals.",
    link: null,
  },
  {
    index: "05",
    slug: "duezy",
    title: "Duezy",
    category: "SaaS / Invoice Automation",
    tech: ["Next.js", "Supabase", "Stripe", "Resend", "Vercel"],
    shipped: "Functional billing flow in 7 days.",
    problem:
      "Small service businesses were spending hours each week manually generating invoices, chasing late payments, and reconciling what had and hadn't been paid. Existing tools were either too bloated or required accounting expertise to configure.",
    built:
      "An invoice processing SaaS with client management, line-item billing, automated payment reminders via Resend, and a Stripe-powered checkout link embedded directly in outbound emails. Clients pay without creating an account. Operators see real-time payment status across all outstanding invoices in a single view.",
    outcome:
      "Invoice-to-payment cycle reduced from multi-day manual follow-up to an automated collect-on-send flow. Outstanding invoice tracking consolidated into one view.",
    link: null,
  },
];

const monoLabel: React.CSSProperties = {
  fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
  fontSize: "0.68rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--pewter)",
  display: "block",
  marginBottom: "0.5rem",
};

export default function WorkPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav activeHref="/work" />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Page header */}
        <section className="pt-12 pb-16 md:pt-16 md:pb-20">
          <h1
            style={{
              fontFamily: "var(--font-display-var), 'DM Serif Display', serif",
              fontSize: "clamp(2.5rem, 5vw, 5.5rem)",
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
            }}
          >
            Recent Work.
          </h1>
          <p
            className="mt-6 text-[1rem] leading-[1.6] max-w-[48ch]"
            style={{ color: "var(--pewter)" }}
          >
            A selection of production projects. These are shipped, live products — not mockups.
          </p>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid var(--bone)" }} />

        {/* Case studies */}
        <div className="flex flex-col divide-y" style={{ borderColor: "var(--bone)" }}>
          {caseStudies.map((cs) => (
            <article key={cs.index} className="py-12 md:py-16" id={cs.slug}>
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 mb-8">
                <span
                  style={{
                    fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    color: "var(--vermilion)",
                    letterSpacing: "0.05em",
                    flexShrink: 0,
                  }}
                >
                  [{cs.index}]
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-display-var), 'DM Serif Display', serif",
                    fontSize: "clamp(1.6rem, 2.8vw, 2.5rem)",
                    fontWeight: 400,
                    letterSpacing: "-0.025em",
                    lineHeight: 1,
                  }}
                >
                  {cs.title}
                </h2>
                <span
                  className="sm:ml-auto"
                  style={{
                    fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
                    fontSize: "0.68rem",
                    color: "var(--pewter)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    flexShrink: 0,
                  }}
                >
                  {cs.category}
                </span>
              </div>

              {/* Content grid */}
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-x-12 gap-y-8">
                {/* Left — meta */}
                <div className="flex flex-col gap-6">
                  <div>
                    <span style={monoLabel}>Time to ship</span>
                    <p className="text-[0.95rem] leading-[1.5]">{cs.shipped}</p>
                  </div>
                  <div>
                    <span style={monoLabel}>Stack</span>
                    <div className="flex flex-wrap gap-1.5">
                      {cs.tech.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
                            fontSize: "0.65rem",
                            padding: "0.2rem 0.45rem",
                            border: "1px solid var(--bone)",
                            color: "var(--pewter)",
                            borderRadius: "2px",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  {cs.link && (
                    <div>
                      <span style={monoLabel}>Live site</span>
                      <a
                        href={cs.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.85rem] no-underline hover:opacity-60 transition-opacity"
                        style={{
                          color: "var(--vermilion)",
                          borderBottom: "1px solid var(--vermilion)",
                          paddingBottom: "1px",
                        }}
                      >
                        View site →
                      </a>
                    </div>
                  )}
                </div>

                {/* Right — narrative */}
                <div className="flex flex-col gap-7">
                  <div>
                    <span style={monoLabel}>The problem</span>
                    <p className="text-[0.95rem] leading-[1.65]" style={{ color: "var(--ink)" }}>
                      {cs.problem}
                    </p>
                  </div>
                  <div>
                    <span style={monoLabel}>What we built</span>
                    <p className="text-[0.95rem] leading-[1.65]" style={{ color: "var(--ink)" }}>
                      {cs.built}
                    </p>
                  </div>
                  <div>
                    <span style={monoLabel}>Outcome</span>
                    <p className="text-[0.95rem] leading-[1.65]" style={{ color: "var(--ink)" }}>
                      {cs.outcome}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <section
          className="py-16 md:py-20 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8"
          style={{ borderTop: "1px solid var(--bone)" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display-var), 'DM Serif Display', serif",
              fontSize: "clamp(1.8rem, 3vw, 3rem)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Ready to start?
            <br />
            Request a fixed quote.
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center text-sm font-semibold uppercase tracking-[0.06em] no-underline transition-opacity hover:opacity-80 min-h-[44px]"
            style={{
              fontFamily: "var(--font-sans-var), 'Instrument Sans', sans-serif",
              backgroundColor: "var(--vermilion)",
              color: "var(--paper)",
              padding: "1rem 2.25rem",
            }}
          >
            Start a Project
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
