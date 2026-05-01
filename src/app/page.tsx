import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TrustPillar } from "@/components/TrustPillar";
import { ServiceTier } from "@/components/ServiceTier";
import { CaseStudyCard } from "@/components/CaseStudyCard";

export const metadata: Metadata = {
  title: "LOVELEEDAY Studios — Fixed Price. Production Code. Done in Days.",
  description:
    "Boutique development studio. Landing pages, full-stack apps, Stripe integrations, and internal tools — fixed price, shipped in days, not months.",
  alternates: {
    canonical: "https://loveleedaystudios.com",
  },
};

const pillars = [
  {
    index: "01",
    label: "Velocity",
    title: "3–7 day delivery.",
    description:
      "We scope projects small enough to ship fast. No sprint planning ceremonies, no two-week retainers before a line is written. You get working code.",
  },
  {
    index: "02",
    label: "Clarity",
    title: "Fixed price. Always.",
    description:
      "The price in your quote is the price on your invoice. No hourly tracking, no scope creep invoices, no surprises. If we misjudge scope, that's our problem.",
  },
  {
    index: "03",
    label: "Assurance",
    title: "Done means done.",
    description:
      "We don't close the engagement until the deliverable matches your spec. If it's broken, we fix it. No additional charge, no debate.",
  },
];

const services = [
  {
    price: "$500+",
    title: "Landing Pages",
    description:
      "High-conversion pages built with Next.js and Tailwind, deployed to Vercel the same week. LCP under 2s, schema markup, OG images included.",
  },
  {
    price: "$1,500+",
    title: "Full-Stack Apps",
    description:
      "Dashboards, admin panels, and internal tools. React front end, Supabase or Postgres backend, Stripe billing if needed. Auth and role-based access included.",
  },
  {
    price: "$800+",
    title: "Data Dashboards",
    description:
      "Connect your data sources and visualize what matters. Supabase, external APIs, scheduled syncs. Built to run unattended.",
  },
  {
    price: "$400+",
    title: "Stripe Integration",
    description:
      "Subscriptions, one-time payments, custom invoicing, webhook handlers. We know where the edge cases hide.",
  },
  {
    price: "$300+",
    title: "SEO Audits",
    description:
      "Technical SEO, Core Web Vitals, schema markup, and content gap analysis. Specific fixes with implementation notes — not a PDF of observations.",
  },
  {
    price: "$200+",
    title: "Bug Fixes & Rescue",
    description:
      "Broken CI pipeline? Authentication edge case? Slow query? We diagnose and fix without a retainer. You describe the symptom, we find the cause.",
  },
];

const workPreview = [
  {
    index: "01",
    slug: "olldae",
    title: "olldae",
    category: "SaaS / Restaurant Technology",
    summary:
      "Bar and restaurant operating system — inventory, recipes, catering quoting, and Stripe billing in one platform. MVP in 11 days.",
    tech: ["Next.js", "Supabase", "Stripe", "Edge Functions"],
  },
  {
    index: "02",
    slug: "dabney",
    title: "Dabney & Co.",
    category: "Brand / Hospitality Website",
    summary:
      "Full brand rebuild for a craft cocktail bar. Custom typographic system, OpenTable integration, nine responsive pages.",
    tech: ["Next.js", "Tailwind CSS", "OpenTable"],
  },
  {
    index: "03",
    slug: "hospitality-ops",
    title: "Hospitality Ops Layer",
    category: "Internal Systems / Automation",
    summary:
      "Custom ops layer for a hospitality holding company — 800+ emails/week triaged, calendar deduplication, automated communications routing.",
    tech: ["Node.js", "Supabase", "Fly.io", "TypeScript"],
  },
];

const Divider = () => (
  <hr
    className="w-full"
    style={{ border: "none", borderTop: "1px solid var(--bone)", margin: 0 }}
  />
);

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav activeHref="/" />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Hero */}
        <section className="pt-12 pb-16 md:pt-20 md:pb-24">
          <h1
            style={{
              fontFamily: "var(--font-display-var), 'DM Serif Display', serif",
              fontSize: "clamp(3rem, 7vw, 7.5rem)",
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              maxWidth: "16ch",
            }}
          >
            Fixed price.
            <br />
            Production code.
            <br />
            Done in days.
          </h1>

          <p
            className="mt-8 text-[1.1rem] leading-[1.6] max-w-[52ch]"
            style={{ color: "var(--pewter)" }}
          >
            We scope it tight, quote it flat, and ship it. Most projects close in a week.
          </p>

          {/* Proof strip */}
          <div
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2"
            style={{
              fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              color: "var(--pewter)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <span>11-day MVP (olldae)</span>
            <span style={{ color: "var(--bone)" }}>·</span>
            <span>5-day auth build</span>
            <span style={{ color: "var(--bone)" }}>·</span>
            <span>7-day billing flow</span>
            <span style={{ color: "var(--bone)" }}>·</span>
            <span>5 projects in production</span>
          </div>
        </section>

        <Divider />

        {/* Trust pillars */}
        <section id="approach" className="py-16 md:py-20">
          <div className="mb-10">
            <span
              style={{
                fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--pewter)",
              }}
            >
              How we work
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {pillars.map((p) => (
              <TrustPillar key={p.index} {...p} />
            ))}
          </div>
        </section>

        <Divider />

        {/* Services */}
        <section id="services" className="py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 mb-12 items-start">
            <h2
              style={{
                fontFamily: "var(--font-display-var), 'DM Serif Display', serif",
                fontSize: "clamp(1.8rem, 2.8vw, 3rem)",
                fontWeight: 400,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              What we build
            </h2>
            <p className="text-[1rem] leading-[1.6] max-w-[54ch]" style={{ color: "var(--pewter)" }}>
              Fixed-price engineering across the stack. We rescue broken deploys, build greenfield apps, and wire
              third-party integrations that are more complex than the docs suggest.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
            {services.map((s) => (
              <ServiceTier key={s.title} {...s} />
            ))}
          </div>
        </section>

        <Divider />

        {/* Recent work */}
        <section id="work" className="py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 mb-12 items-start">
            <h2
              style={{
                fontFamily: "var(--font-display-var), 'DM Serif Display', serif",
                fontSize: "clamp(1.8rem, 2.8vw, 3rem)",
                fontWeight: 400,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              Recent Work
            </h2>
            <p className="text-[1rem] leading-[1.6] max-w-[54ch]" style={{ color: "var(--pewter)" }}>
              Production projects shipped for real businesses. These are not demos.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {workPreview.map((w) => (
              <CaseStudyCard key={w.index} {...w} />
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/work"
              className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.06em] no-underline transition-opacity hover:opacity-60 min-h-[44px]"
              style={{
                fontFamily: "var(--font-sans-var), 'Instrument Sans', sans-serif",
                color: "var(--ink)",
                borderBottom: "1px solid var(--ink)",
                paddingBottom: "2px",
              }}
            >
              View all case studies
            </Link>
          </div>
        </section>

        <Divider />

        {/* CTA */}
        <section
          id="contact"
          className="py-16 md:py-20"
          style={{ backgroundColor: "var(--paper)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display-var), 'DM Serif Display', serif",
                  fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                }}
              >
                Ready to start?
                <br />
                Request a fixed quote.
              </h2>
              <p
                className="mt-4"
                style={{
                  fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--pewter)",
                }}
              >
                We reply within 4 hours during business hours.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center text-sm font-semibold uppercase tracking-[0.06em] no-underline transition-opacity hover:opacity-80 min-h-[44px]"
                style={{
                  fontFamily: "var(--font-sans-var), 'Instrument Sans', sans-serif",
                  backgroundColor: "var(--vermilion)",
                  color: "var(--paper)",
                  padding: "1rem 2.25rem",
                }}
                aria-label="Start a project — contact LOVELEEDAY Studios"
              >
                Start a Project
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
