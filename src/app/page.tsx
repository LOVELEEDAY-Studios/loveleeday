import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LOVELEEDAY Studios — Fixed Price. Production Code. Done in Days.",
  description:
    "Boutique development studio specializing in landing pages, dashboards, Stripe integrations, SEO audits, and full-stack web applications. Fixed-price, fast delivery.",
  alternates: {
    canonical: "https://loveleedaystudios.com",
  },
};

const guarantees = [
  {
    index: "01",
    label: "Velocity",
    title: "3–7 Day delivery.",
    description:
      "We scope projects tightly and execute rapidly. No drawn-out planning phases, just shipped code.",
  },
  {
    index: "02",
    label: "Clarity",
    title: "100% Fixed-price.",
    description:
      "The price we quote on day one is the exact price you pay. No hourly tracking, no hidden retainers, no scope creep surprises.",
  },
  {
    index: "03",
    label: "Assurance",
    title: "$0 Until you’re happy.",
    description:
      "We don’t consider the engagement complete until the deliverable meets your exact specifications and quality standards.",
  },
];

const services = [
  {
    price: "$500+",
    title: "Landing Pages",
    description:
      "High-converting pages structured to turn visitors into customers. Built with Next.js and Tailwind, deployed the same week.",
  },
  {
    price: "$1,500+",
    title: "Full-Stack Apps",
    description:
      "Complete dashboards, custom admin panels, and internal tools. React, Node, and Postgres for production-ready scale.",
  },
  {
    price: "$800+",
    title: "Data Dashboards",
    description:
      "Connect multiple data sources, visualize key metrics, and automate reporting flows via Supabase and external APIs.",
  },
  {
    price: "$400+",
    title: "Stripe Integration",
    description:
      "Complex subscriptions, one-time payments, invoicing, and webhooks. We have wired dozens of custom financial setups.",
  },
  {
    price: "$300+",
    title: "SEO Audits",
    description:
      "Deep technical SEO, Core Web Vitals optimization, schema markup, and content strategy. Specific fixes, not theoretical PDFs.",
  },
  {
    price: "$200+",
    title: "Bug Fixes & Rescue",
    description:
      "Broken deploy pipelines? Authentication state issues? Severe performance bottlenecks? We diagnose and fix what others built.",
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

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center selection:bg-[#111] selection:text-[#F3F2EE] px-4 py-[4vw] sm:px-[4vw]"
      style={{
        backgroundColor: "#F3F2EE",
        color: "#111111",
      }}
    >
      {/* Header */}
      <header className="w-full max-w-[1400px] flex flex-col items-center mb-8 sm:mb-[6vw]">
        <LogoMark />
        <div
          className="text-center leading-none"
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
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
              fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 400,
              fontStyle: "normal",
            }}
          >
            Studios&trade;
          </span>
        </div>
        <nav className="flex gap-6 mt-4 text-[0.8rem] font-medium uppercase tracking-[0.05em]">
          <a href="#services" className="text-[#111] no-underline hover:opacity-60 transition-opacity py-[13px] px-1">
            Services
          </a>
          <a href="#approach" className="text-[#111] no-underline hover:opacity-60 transition-opacity py-[13px] px-1">
            Approach
          </a>
          <a href="/work" className="text-[#111] no-underline hover:opacity-60 transition-opacity py-[13px] px-1">
            Work
          </a>
          <a href="/contact" className="text-[#111] no-underline hover:opacity-60 transition-opacity py-[13px] px-1">
            Contact
          </a>
        </nav>
      </header>

      {/* Main */}
      <main className="w-full max-w-[1400px]">
        {/* Hero statement */}
        <h1
          className="mb-[2vw]"
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: "clamp(2rem, 4.5vw, 4.8rem)",
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            maxWidth: "98%",
            textWrap: "balance" as never,
          }}
        >
          Fixed price. Production code. Done in days.
        </h1>

        <p
          className="mb-[4vw] text-[1.1rem] leading-[1.5] max-w-[64ch]"
          style={{ color: "#5A5A55" }}
        >
          Loveleeday Studios is a boutique development practice. From high-converting
          landing pages and data dashboards to complex Stripe integrations and full-stack
          apps — we deliver production-ready code on a fixed quote, with no hourly billing
          and no scope creep.
        </p>

        {/* Proof strip */}
        <div
          className="mb-[4vw] flex flex-wrap gap-x-[3vw] gap-y-2"
          style={{
            fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
            fontSize: "0.78rem",
            color: "#5A5A55",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <span>11-day MVP (olldae)</span>
          <span style={{ color: "#D4D2C9" }}>·</span>
          <span>5-day auth build (Kronos)</span>
          <span style={{ color: "#D4D2C9" }}>·</span>
          <span>7-day billing flow (Duezy)</span>
          <span style={{ color: "#D4D2C9" }}>·</span>
          <span>5 production projects in market</span>
        </div>

        {/* Pull-quote / proof */}
        <blockquote
          className="mb-[3vw] py-5 px-0"
          style={{ borderTop: "1px solid #D4D2C9", borderBottom: "1px solid #D4D2C9" }}
        >
          <p
            style={{
              fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
              fontWeight: 400,
              lineHeight: 1.4,
              letterSpacing: "-0.015em",
              maxWidth: "72ch",
              fontStyle: "italic",
            }}
          >
            &ldquo;A full restaurant operating system — inventory, recipes, catering, billing — shipped in 11 days. In production, serving live venues.&rdquo;
          </p>
          <cite
            className="block mt-3 not-italic"
            style={{
              fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#5A5A55",
            }}
          >
            olldae — Restaurant OS, 2026
          </cite>
        </blockquote>

        {/* Tech stack row */}
        <div
          className="mb-[3vw] flex flex-wrap items-center gap-x-[2.5vw] gap-y-3"
          style={{
            fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: "#5A5A55",
          }}
        >
          <span
            className="block mr-2"
            style={{ color: "#9A9890" }}
          >
            Built with
          </span>
          {["Next.js", "React", "Supabase", "Stripe", "Vercel", "TypeScript", "Tailwind CSS"].map((tool, i, arr) => (
            <span key={tool} className="flex items-center gap-[2.5vw]">
              <span style={{ color: "#111" }}>{tool}</span>
              {i < arr.length - 1 && <span style={{ color: "#D4D2C9", marginLeft: "2.5vw" }}>·</span>}
            </span>
          ))}
        </div>

        <hr className="border-none border-t border-[#D4D2C9] my-[2vw] w-full" style={{ borderTop: "1px solid #D4D2C9" }} />

        {/* Guarantees */}
        <div id="approach" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[2vw] gap-y-[4vw] py-4">
          {guarantees.map((g) => (
            <div key={g.index} className="flex flex-col gap-2">
              <span
                className="block mb-2"
                style={{
                  fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  color: "#5A5A55",
                  letterSpacing: "0.05em",
                }}
              >
                [{g.index}] {g.label}
              </span>
              <h2 className="text-xl font-medium" style={{ letterSpacing: "-0.01em" }}>
                {g.title}
              </h2>
              <p className="text-[0.95rem] leading-[1.45]" style={{ color: "#5A5A55" }}>
                {g.description}
              </p>
            </div>
          ))}
        </div>

        <hr className="border-none my-[2vw] w-full" style={{ borderTop: "1px solid #D4D2C9" }} />

        {/* Services header */}
        <div id="services" className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-[2vw] mb-[2vw] items-start">
          <h2 className="text-2xl font-normal" style={{ letterSpacing: "-0.02em" }}>
            Capabilities
          </h2>
          <p className="text-[1.1rem] leading-[1.4] max-w-[60ch]">
            Fixed-price engineering, delivered in days. No scope creep, no
            meetings that should have been emails. We fix what others built, or
            architect it right the first time.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[2vw] gap-y-[4vw] py-4">
          {services.map((s) => (
            <div key={s.title} className="flex flex-col">
              <div
                className="flex justify-between pb-2 mb-4"
                style={{
                  fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                  fontSize: "0.8rem",
                  borderBottom: "1px solid #D4D2C9",
                }}
              >
                <span>Base Engagement</span>
                <span>{s.price}</span>
              </div>
              <h3 className="text-[1.2rem] font-medium mb-2" style={{ letterSpacing: "-0.01em" }}>
                {s.title}
              </h3>
              <p className="text-[0.95rem] leading-[1.45]" style={{ color: "#5A5A55" }}>
                {s.description}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Work */}
        <div
          id="work"
          className="mt-[6vw] pt-[4vw]"
          style={{ borderTop: "1px solid #D4D2C9" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-[2vw] mb-[3vw] items-start">
            <h2 className="text-2xl font-normal" style={{ letterSpacing: "-0.02em" }}>
              Recent Work
            </h2>
            <p className="text-[1.1rem] leading-[1.4] max-w-[60ch]">
              Production projects shipped for real businesses — SaaS platforms,
              hospitality brands, financial tools, and internal systems.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[2vw] gap-y-[3vw]">
            {[
              {
                index: "01",
                title: "olldae",
                category: "SaaS / Restaurant Technology",
                summary:
                  "Bar and restaurant operating system. Inventory, recipe costing, catering quoting, and Stripe billing — consolidated into one platform. MVP shipped in 11 days.",
              },
              {
                index: "02",
                title: "Dabney & Co.",
                category: "Brand / Hospitality Website",
                summary:
                  "Full brand and site redesign for a craft cocktail bar. Custom typographic system, OpenTable reservation integration, nine responsive pages.",
              },
              {
                index: "03",
                title: "Kronos",
                category: "Internal Product / Financial Tooling",
                summary:
                  "Multi-entity financial dashboard. Stripe Financial Connections, Xero sync, and role-scoped auth across 22 routes. Core auth built in 5 days.",
              },
              {
                index: "04",
                title: "Duezy",
                category: "SaaS / Invoice Automation",
                summary:
                  "Invoice processing SaaS with automated payment reminders and Stripe checkout embedded in outbound emails. Functional billing flow in 7 days.",
              },
              {
                index: "05",
                title: "Hospitality Ops Layer",
                category: "Internal Systems / AI Automation",
                summary:
                  "Custom ops layer for a hospitality holding company. Email triage, calendar dedup across four grants, automated communications routing. In production.",
              },
            ].map((w) => (
              <a
                key={w.index}
                href="/work"
                style={{ textDecoration: "none", color: "inherit" }}
                className="group flex flex-col gap-3 py-5"
              >
                <div
                  className="flex justify-between items-baseline pb-3"
                  style={{ borderBottom: "1px solid #D4D2C9" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                      fontSize: "0.72rem",
                      color: "#5A5A55",
                      letterSpacing: "0.05em",
                    }}
                  >
                    [{w.index}]
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                      fontSize: "0.7rem",
                      color: "#5A5A55",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    {w.category}
                  </span>
                </div>
                <h3
                  className="text-[1.15rem] font-medium group-hover:opacity-60 transition-opacity"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {w.title}
                </h3>
                <p className="text-[0.9rem] leading-[1.5]" style={{ color: "#5A5A55" }}>
                  {w.summary}
                </p>
              </a>
            ))}
          </div>

          <div className="mt-[2vw]">
            <a
              href="/work"
              className="inline-flex items-end no-underline text-[0.8rem] font-medium uppercase tracking-[0.05em] transition-opacity hover:opacity-60 py-[13px] pr-1 min-h-[44px]"
              style={{ color: "#111", borderBottom: "1px solid #111" }}
            >
              View all case studies
            </a>
          </div>
        </div>

        {/* CTA */}
        <div
          id="contact"
          className="mt-[6vw] pt-[4vw] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8"
          style={{ borderTop: "1px solid #D4D2C9" }}
        >
          <div>
            <div
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Ready to start?
              <br />
              Request a fixed quote.
            </div>
            <p
              className="mt-3"
              style={{
                fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#5A5A55",
              }}
            >
              We reply within 4 hours during business hours.
            </p>
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
            Start a Project
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-[1400px] mt-[6vw] pt-[2vw] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ borderTop: "1px solid #D4D2C9" }}>
        <div className="flex flex-col gap-1">
          <span className="text-xs" style={{ color: "#5A5A55" }}>
            &copy; 2026 LOVELEEDAY Studios LLC. A Delaware company.
          </span>
          <span className="text-xs" style={{ color: "#9A9890" }}>
            Based in Kalamazoo, MI &mdash; serving clients globally.
          </span>
        </div>
        <a
          href="mailto:hello@loveleedaystudios.com"
          className="text-xs no-underline hover:opacity-60 transition-opacity"
          style={{ color: "#5A5A55" }}
        >
          hello@loveleedaystudios.com
        </a>
      </footer>
    </div>
  );
}
