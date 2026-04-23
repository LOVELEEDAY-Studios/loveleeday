import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-playfair",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Recent Work — LOVELEEDAY Studios",
  description:
    "A selection of production projects built by LOVELEEDAY Studios — SaaS platforms, branded websites, internal tools, and invoice automation.",
};

const caseStudies = [
  {
    index: "01",
    title: "olldae",
    category: "SaaS / Restaurant Technology",
    tech: ["Next.js", "Supabase", "Stripe", "Vercel", "Edge Functions"],
    problem:
      "Independent bars and restaurants were managing inventory, recipes, and event catering across a patchwork of spreadsheets, text threads, and single-purpose apps. There was no unified view of what was in stock, what was selling, or what a catering quote should cost.",
    built:
      "A full-stack bar and restaurant operating system with live inventory tracking, recipe costing, and a multi-step catering quoting flow. Stripe billing handles monthly subscriptions with a self-serve portal. Twelve Supabase Edge Functions power background sync, webhook idempotency, and rate limiting. Staff access the same platform from both a desktop dashboard and mobile-optimized views.",
    shipped: "MVP in 11 days, full v1 in 6 weeks",
    outcome:
      "Consolidated inventory management, recipe costing, and catering quoting into a single staff-facing platform. Venue operators reduced quote turnaround from a multi-day back-and-forth to a same-session workflow.",
  },
  {
    index: "02",
    title: "Dabney & Co.",
    category: "Brand / Hospitality Website",
    tech: ["Next.js", "Tailwind CSS", "OpenTable API", "Vercel"],
    problem:
      "A craft cocktail bar with a strong local following had an outdated web presence that didn't reflect its brand. The existing site had no reservation flow, slow load times, and a design that undercut the guest experience before they walked in the door.",
    built:
      "A full redesign using a custom brutalist typographic system — Outfit for display, Space Mono for detail — paired with a restrained palette of cream, black, and deep red. OpenTable reservation integration is embedded directly into the page, eliminating redirect friction. Nine fully responsive pages were built from scratch, including an interactive menu, events listings, and a catering inquiry flow.",
    shipped: "Design to production in 3 weeks",
    outcome:
      "A cohesive branded web presence aligned with the bar's physical aesthetic. Guests can move from discovery to reservation without leaving the site.",
  },
  {
    index: "03",
    title: "Kronos",
    category: "Internal Product / Financial Tooling",
    tech: ["Next.js", "Supabase", "Stripe Financial Connections", "Xero API", "Vercel"],
    problem:
      "A holding company with multiple operating businesses needed a unified view of financial data across accounts — without manually exporting CSVs from Stripe, Xero, and bank portals every week.",
    built:
      "A 22-route internal platform that connects Stripe Financial Connections for live transaction feeds, Xero for accounting sync, and Supabase for persistent state and auth. Authentication is role-scoped so different team members see only the data relevant to their entity. The Xero OAuth flow handles token refresh automatically in the background.",
    shipped: "Auth and core routing in 5 days, full integration in 3 weeks",
    outcome:
      "Cross-entity financial data pulled into a single authenticated dashboard. Eliminated weekly manual reconciliation cycles across three separate vendor portals.",
  },
  {
    index: "04",
    title: "Duezy",
    category: "SaaS / Invoice Automation",
    tech: ["Next.js", "Supabase", "Stripe", "Resend", "Vercel"],
    problem:
      "Small service businesses were spending hours each week manually generating invoices, chasing late payments, and reconciling what had and hadn't been paid. Existing tools were either too bloated or required accounting expertise to configure.",
    built:
      "An invoice processing SaaS with client management, line-item billing, automated payment reminders via Resend, and a Stripe-powered checkout link embedded directly in outbound emails. Clients pay without creating an account. Operators see real-time payment status across all outstanding invoices in a single dashboard view.",
    shipped: "Functional billing flow in 7 days",
    outcome:
      "Invoice-to-payment cycle reduced from multi-day manual follow-up to an automated collect-on-send flow. Outstanding invoice tracking consolidated into one view.",
  },
];

function LogoMark() {
  return (
    <svg
      className="w-12 h-12 mb-3"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="20" y="20" width="25" height="25" stroke="#111" strokeWidth="2" />
      <rect x="55" y="20" width="25" height="25" fill="#111" />
      <rect x="20" y="55" width="25" height="25" fill="#111" />
      <path d="M55 55H80V80H55V55Z" stroke="#111" strokeWidth="2" />
      <circle cx="67.5" cy="67.5" r="4" fill="#111" />
    </svg>
  );
}

export default function WorkPage() {
  return (
    <div
      className={`${playfair.variable} ${jetbrains.variable} min-h-screen flex flex-col items-center selection:bg-[#111] selection:text-[#F3F2EE]`}
      style={{
        backgroundColor: "#F3F2EE",
        color: "#111111",
        fontFamily: "'Inter', -apple-system, sans-serif",
        padding: "4vw",
      }}
    >
      {/* Header */}
      <header className="w-full max-w-[1400px] flex flex-col items-center mb-[6vw]">
        <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <LogoMark />
          <div
            className="text-center leading-none"
            style={{
              fontFamily: "'Playfair Display', var(--font-playfair), serif",
              fontSize: "2rem",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            LOVELEEDAY
            <br />
            <span
              className="block mt-1.5"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 500,
                fontStyle: "normal",
              }}
            >
              Studios&trade;
            </span>
          </div>
        </a>
        <nav className="flex gap-8 mt-6 text-[0.8rem] font-medium uppercase tracking-[0.05em]">
          <a href="/#services" className="text-[#111] no-underline hover:opacity-60 transition-opacity">
            Services
          </a>
          <a href="/#approach" className="text-[#111] no-underline hover:opacity-60 transition-opacity">
            Approach
          </a>
          <a href="/work" className="text-[#111] no-underline hover:opacity-60 transition-opacity" style={{ borderBottom: "1px solid #111", paddingBottom: "1px" }}>
            Work
          </a>
          <a href="/contact" className="text-[#111] no-underline hover:opacity-60 transition-opacity">
            Contact
          </a>
        </nav>
      </header>

      <main className="w-full max-w-[1400px]">
        {/* Page intro */}
        <div className="mb-[4vw]">
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 4rem)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              maxWidth: "80%",
            }}
          >
            Recent Work.
          </h1>
          <p
            className="mt-4 text-[1.05rem] leading-[1.5] max-w-[52ch]"
            style={{ color: "#5A5A55" }}
          >
            A selection of production projects. These are real, shipped products —
            not demos.
          </p>
        </div>

        <hr style={{ borderTop: "1px solid #D4D2C9", border: "none", borderTopStyle: "solid" }} className="mb-[4vw]" />

        {/* Case studies */}
        <div className="flex flex-col gap-[6vw]">
          {caseStudies.map((cs) => (
            <article key={cs.index}>
              {/* Article header row */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 mb-6">
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
                    fontSize: "0.75rem",
                    color: "#5A5A55",
                    letterSpacing: "0.05em",
                    flexShrink: 0,
                  }}
                >
                  [{cs.index}]
                </span>
                <h2
                  style={{
                    fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
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
                    fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
                    fontSize: "0.72rem",
                    color: "#5A5A55",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    flexShrink: 0,
                  }}
                >
                  {cs.category}
                </span>
              </div>

              {/* Content grid */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-x-[4vw] gap-y-6" style={{ borderTop: "1px solid #D4D2C9", paddingTop: "1.5rem" }}>
                {/* Left column — meta */}
                <div className="flex flex-col gap-5">
                  <div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "#5A5A55",
                        display: "block",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Time to ship
                    </span>
                    <p className="text-[0.95rem]">{cs.shipped}</p>
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "#5A5A55",
                        display: "block",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cs.tech.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
                            fontSize: "0.7rem",
                            padding: "0.2rem 0.5rem",
                            border: "1px solid #D4D2C9",
                            color: "#5A5A55",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right column — narrative */}
                <div className="flex flex-col gap-5">
                  <div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "#5A5A55",
                        display: "block",
                        marginBottom: "0.5rem",
                      }}
                    >
                      The problem
                    </span>
                    <p className="text-[0.95rem] leading-[1.55]" style={{ color: "#333" }}>
                      {cs.problem}
                    </p>
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "#5A5A55",
                        display: "block",
                        marginBottom: "0.5rem",
                      }}
                    >
                      What we built
                    </span>
                    <p className="text-[0.95rem] leading-[1.55]" style={{ color: "#333" }}>
                      {cs.built}
                    </p>
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "#5A5A55",
                        display: "block",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Outcome
                    </span>
                    <p className="text-[0.95rem] leading-[1.55]" style={{ color: "#333" }}>
                      {cs.outcome}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-[6vw] pt-[4vw] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8"
          style={{ borderTop: "1px solid #D4D2C9" }}
        >
          <div
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Ready to commence?
            <br />
            Request a fixed quote.
          </div>
          <a
            href="/contact"
            className="inline-block no-underline text-[0.9rem] font-medium uppercase tracking-[0.05em] transition-colors hover:bg-[#333]"
            style={{
              backgroundColor: "#111111",
              color: "#F3F2EE",
              padding: "1rem 2rem",
            }}
          >
            Initiate Project
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="w-full max-w-[1400px] mt-[6vw] pt-[2vw] flex flex-col sm:flex-row justify-between items-center gap-4"
        style={{ borderTop: "1px solid #D4D2C9" }}
      >
        <span className="text-xs" style={{ color: "#5A5A55" }}>
          &copy; 2026 LOVELEEDAY Studios LLC. A Delaware company.
        </span>
        <span className="text-xs" style={{ color: "#5A5A55" }}>
          hello@loveleedaystudios.com
        </span>
      </footer>
    </div>
  );
}
