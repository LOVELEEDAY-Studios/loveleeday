import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "About — LOVELEEDAY Studios",
  description:
    "LOVELEEDAY Studios is a boutique development practice based in Kalamazoo, MI. Fixed-price projects, direct communication, production-grade code.",
  alternates: {
    canonical: "https://loveleedaystudios.com/about",
  },
};

const principles = [
  {
    index: "01",
    label: "Scope tightly, quote honestly.",
    description:
      "We would rather push back on scope before the engagement starts than ask for more money mid-build.",
  },
  {
    index: "02",
    label: "Ship working code.",
    description:
      "Every deliverable is production-ready. No 'you'll need to wire this up yourself' handoffs. If it's in the spec, it works.",
  },
  {
    index: "03",
    label: "Speed is a feature.",
    description:
      "A landing page you can test in 5 days is worth more than one you test in 5 weeks. We design to ship fast without cutting corners.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav activeHref="/about" />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Hero */}
        <section className="pt-12 pb-16 md:pt-20 md:pb-24">
          <h1
            style={{
              fontFamily: "var(--font-display-var), 'DM Serif Display', serif",
              fontSize: "clamp(2.5rem, 5vw, 5.5rem)",
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
            }}
          >
            About the studio.
          </h1>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid var(--bone)" }} />

        {/* About body */}
        <section className="py-16 max-w-[640px]">
          <p
            className="text-[1.1rem] leading-[1.7] mb-6"
            style={{ color: "var(--ink)" }}
          >
            LOVELEEDAY Studios is a boutique development practice. We build landing pages,
            full-stack apps, Stripe integrations, and internal tools — fixed price, with a
            defined scope and a defined timeline before any code is written.
          </p>
          <p
            className="text-[1.1rem] leading-[1.7]"
            style={{ color: "var(--pewter)" }}
          >
            We don&rsquo;t do retainers. We don&rsquo;t do vague discovery phases. You describe
            what you need, we quote it flat, and we ship it. Most engagements close in a week.
          </p>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid var(--bone)" }} />

        {/* Principles */}
        <section className="py-16 md:py-20">
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
              Studio principles
            </span>
          </div>
          <div className="flex flex-col gap-0 divide-y" style={{ borderColor: "var(--bone)" }}>
            {principles.map((p) => (
              <div key={p.index} className="py-8 grid grid-cols-1 md:grid-cols-[80px_1fr] gap-4 md:gap-10 items-start">
                <span
                  style={{
                    fontFamily: "var(--font-mono-var), 'JetBrains Mono', monospace",
                    fontSize: "0.7rem",
                    color: "var(--vermilion)",
                    letterSpacing: "0.07em",
                    paddingTop: "3px",
                  }}
                >
                  [{p.index}]
                </span>
                <div>
                  <p
                    className="mb-2 font-semibold text-[1rem] leading-[1.4]"
                    style={{ fontFamily: "var(--font-sans-var), 'Instrument Sans', sans-serif" }}
                  >
                    {p.label}
                  </p>
                  <p
                    className="text-[0.95rem] leading-[1.65]"
                    style={{ color: "var(--pewter)" }}
                  >
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid var(--bone)" }} />

        {/* CTA */}
        <section className="py-16 md:py-20 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8">
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
