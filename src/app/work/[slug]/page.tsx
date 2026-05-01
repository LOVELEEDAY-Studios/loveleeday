import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const caseStudies = [
  {
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
    metaDescription:
      "How LOVELEEDAY Studios built a bar and restaurant operating system in 11 days — Next.js, Supabase, Stripe, 12 Edge Functions.",
  },
  {
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
    metaDescription:
      "Brand and site rebuild for Dabney & Co., a craft cocktail bar in Kalamazoo, MI — typographic redesign, OpenTable integration, 3-week delivery.",
  },
  {
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
    metaDescription:
      "Custom internal ops layer for a hospitality holding company — 800+ emails/week automated, calendar deduplication, government-form filing.",
  },
];

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) return {};
  return {
    title: `${cs.title} — LOVELEEDAY Studios`,
    description: cs.metaDescription,
    alternates: {
      canonical: `https://loveleedaystudios.com/work/${slug}`,
    },
  };
}

const monoLabel: React.CSSProperties = {
  fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
  fontSize: "0.68rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--pewter)",
  display: "block",
  marginBottom: "0.5rem",
};

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Nav activeHref="/work" />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Breadcrumb */}
        <div className="pt-8 pb-4">
          <Link
            href="/work"
            className="text-sm no-underline transition-opacity hover:opacity-60 inline-flex items-center gap-2"
            style={{
              fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "var(--pewter)",
            }}
          >
            ← Work
          </Link>
        </div>

        {/* Case study header */}
        <section className="pt-8 pb-16">
          <div className="flex flex-col gap-3 mb-10">
            <span
              style={{
                fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--vermilion)",
              }}
            >
              {cs.category}
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display-var), 'DM Serif Display', serif",
                fontSize: "clamp(2.5rem, 5vw, 5.5rem)",
                fontWeight: 400,
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
              }}
            >
              {cs.title}
            </h1>
          </div>

          {/* Meta row */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6"
            style={{ borderTop: "1px solid var(--bone)", borderBottom: "1px solid var(--bone)" }}
          >
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
                      fontSize: "0.63rem",
                      padding: "0.15rem 0.4rem",
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
                  className="text-[0.9rem] no-underline hover:opacity-60 transition-opacity"
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
        </section>

        {/* Narrative */}
        <section className="pb-16 md:pb-20 max-w-[720px] flex flex-col gap-10">
          <div>
            <span style={monoLabel}>The problem</span>
            <p className="text-[1rem] leading-[1.7]">{cs.problem}</p>
          </div>
          <div>
            <span style={monoLabel}>What we built</span>
            <p className="text-[1rem] leading-[1.7]">{cs.built}</p>
          </div>
          <div>
            <span style={monoLabel}>Outcome</span>
            <p className="text-[1rem] leading-[1.7]">{cs.outcome}</p>
          </div>
        </section>

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
