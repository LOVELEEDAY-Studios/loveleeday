import { Playfair_Display, JetBrains_Mono } from "next/font/google";

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

const guarantees = [
  {
    index: "01",
    label: "Velocity",
    title: "3\u20137 Day delivery.",
    description:
      "We scope projects tightly and execute rapidly. No drawn-out agile sprints or endless planning phases, just meticulously shipped code.",
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
    title: "$0 Until you\u2019re happy.",
    description:
      "We don\u2019t consider the engagement complete until the deliverable meets your exact specifications and quality standards.",
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
      "Complete dashboards, custom admin panels, and internal tools. Utilizing React, Node, and Postgres for production-ready scale.",
  },
  {
    price: "$800+",
    title: "Data Dashboards",
    description:
      "Connect disparate data sources, visualize key performance indicators, and automate reporting flows via Supabase and external APIs.",
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
      "Deep technical SEO, Core Web Vitals optimization, schema markup, and content strategy. Actionable implementation, not theoretical PDFs.",
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
        <nav className="flex gap-8 mt-6 text-[0.8rem] font-medium uppercase tracking-[0.05em]">
          <a href="#services" className="text-[#111] no-underline hover:opacity-60 transition-opacity">
            Services
          </a>
          <a href="#approach" className="text-[#111] no-underline hover:opacity-60 transition-opacity">
            Approach
          </a>
          <a href="/work" className="text-[#111] no-underline hover:opacity-60 transition-opacity">
            Work
          </a>
          <a href="/contact" className="text-[#111] no-underline hover:opacity-60 transition-opacity">
            Contact
          </a>
        </nav>
      </header>

      {/* Main */}
      <main className="w-full max-w-[1400px]">
        {/* Hero statement */}
        <h1
          className="mb-[4vw]"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 4.8rem)",
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            maxWidth: "98%",
            textWrap: "balance" as never,
          }}
        >
          Loveleeday Studios&trade; is a boutique development practice. We build
          what you need, fast. From high-converting landing pages and data
          dashboards to complex Stripe integrations and technical SEO audits. We
          operate with a small team and zero overhead. No hourly billing. You get
          a fixed quote, and we deliver production-ready code in days.
        </h1>

        <hr className="border-none border-t border-[#D4D2C9] my-[2vw] w-full" style={{ borderTop: "1px solid #D4D2C9" }} />

        {/* Guarantees */}
        <div id="approach" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[2vw] gap-y-[4vw] py-4">
          {guarantees.map((g) => (
            <div key={g.index} className="flex flex-col gap-2">
              <span
                className="block mb-2"
                style={{
                  fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
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
                  fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[2vw] gap-y-[3vw]">
            {[
              {
                index: "01",
                title: "olldae",
                category: "SaaS / Restaurant Technology",
                summary:
                  "Bar and restaurant operating system. Inventory, recipe costing, catering quoting, and Stripe billing — consolidated into one platform.",
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
                  "Multi-entity financial dashboard. Stripe Financial Connections, Xero sync, and role-scoped auth across 22 routes.",
              },
              {
                index: "04",
                title: "Duezy",
                category: "SaaS / Invoice Automation",
                summary:
                  "Invoice processing SaaS with automated payment reminders and Stripe checkout embedded in outbound emails. Clients pay without creating an account.",
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
                      fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
                      fontSize: "0.72rem",
                      color: "#5A5A55",
                      letterSpacing: "0.05em",
                    }}
                  >
                    [{w.index}]
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', var(--font-mono), monospace",
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
              className="inline-block no-underline text-[0.8rem] font-medium uppercase tracking-[0.05em] transition-opacity hover:opacity-60"
              style={{ color: "#111", borderBottom: "1px solid #111", paddingBottom: "2px" }}
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
      <footer className="w-full max-w-[1400px] mt-[6vw] pt-[2vw] flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderTop: "1px solid #D4D2C9" }}>
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
