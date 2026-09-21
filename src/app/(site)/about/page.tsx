import type { Metadata } from "next";
import Link from "next/link";

/* /about.
   ==========================================================================

   The copy here was the clearest single reason the site read small. It opened
   "LOVELEEDAY Studios is a boutique development practice" -- and a company that
   calls itself boutique has told you its size before it has told you what it
   does. What it actually is, is a software company that built an intelligence
   architecture and ships production systems on top of it, run by someone whose
   background is pricing and finance rather than agency creative.

   None of the facts changed. The framing did, and the self-deprecation went.
   ========================================================================== */

export const metadata: Metadata = {
  title: "Company",
  description:
    "LOVELEEDAY Studios is a software company founded by Daniel J. May, MBA. We build Arthur, an intelligence architecture, and the production systems that run on it.",
  alternates: { canonical: "https://loveleedaystudios.com/about" },
};

const PRINCIPLES = [
  {
    n: "01",
    t: "Scope tightly, quote honestly",
    d: "We would rather push back on scope before an engagement starts than ask for more money mid-build. The number we quote is the number you pay.",
  },
  {
    n: "02",
    t: "Ship, then iterate",
    d: "A working system in front of real users answers questions a specification cannot. First deploy early, then change it with evidence in hand.",
  },
  {
    n: "03",
    t: "Own the stack you run",
    d: "We build on infrastructure you can keep — TypeScript, Postgres, standard platforms. No proprietary runtime that makes us hard to leave.",
  },
  {
    n: "04",
    t: "Say what is unmeasured",
    d: "Where a figure has not been measured, the page says so rather than rounding a guess into a claim. That rule applies to our own site first.",
  },
  {
    n: "05",
    t: "Nothing closes without proof",
    d: "Work is reported complete on a value read back out of the system that was supposed to change — not on a deploy that returned a 200.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── masthead ─────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--line)] bg-[var(--paper)] pt-[clamp(56px,7vw,104px)] pb-[clamp(44px,5vw,76px)]">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="eyebrow flex items-center gap-2.5 text-[var(--dim)]">
              <span className="inline-block h-[7px] w-[7px]" style={{ background: "var(--teal)" }} />
              The company
            </p>
            <h1 className="display display-lg mt-7">
              Business judgment.
              <br />
              <span style={{ color: "var(--dim)" }}>Built as software.</span>
            </h1>
          </div>
          <div className="max-w-[var(--measure)] self-end">
            <p className="text-[1.05rem] leading-[1.6] text-[var(--mid)]">
              LOVELEEDAY Studios is a software development company founded by Daniel J. May, MBA.
              Our perspective comes from pricing, finance and operating a business: technology
              earns its place when it helps someone make a better decision or get meaningful work
              done.
            </p>
            <p className="mt-4 text-[1.05rem] leading-[1.6] text-[var(--mid)]">
              Arthur is the software foundation. LOVELEEDAY Studios is the team responsible for
              defining the problem, developing the solution, and reviewing the result with you.
            </p>
          </div>
        </div>
      </section>

      {/* ── the founder ──────────────────────────────────────────────── */}
      <section className="bg-[var(--deep)] py-[clamp(56px,7vw,100px)] text-[var(--on-deep)]">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div data-rise>
            <p className="eyebrow text-[var(--on-deep-dim)]">Founder</p>
            <p className="mt-5 text-[1.5rem] font-semibold tracking-[-0.028em]">Daniel J. May, MBA</p>
            <p className="mt-2 text-[14px] text-[var(--on-deep-mu)]">Kalamazoo, Michigan</p>
            <dl className="mt-8 divide-y divide-[var(--deep-line)] border-y border-[var(--deep-line)]">
              {[
                ["Founded", "2026"],
                ["Entity", "LOVELEEDAY Studios LLC, Delaware"],
                ["Software we own and run", "5"],
              ].map(([k, val]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 py-3.5">
                  <dt className="eyebrow text-[var(--on-deep-dim)]">{k}</dt>
                  <dd className="tnum text-[14px] text-[var(--on-deep)]">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="self-center" data-rise>
            <p className="text-[clamp(1.3rem,2.4vw,1.85rem)] leading-[1.35] font-medium tracking-[-0.024em]">
              &ldquo;A website request can reveal a customer acquisition problem. A data question
              can reveal an entirely new way to work.&rdquo;
            </p>
            <p className="mt-6 max-w-[58ch] text-[15px] leading-[1.62] text-[var(--on-deep-mu)]">
              We look beyond the requested deliverable. What is slowing the business down? What
              information is disconnected? Which decision needs better evidence? Arthur supports the
              investigation; the studio turns what we learn into something people can use.
            </p>
          </div>
        </div>
      </section>

      {/* ── principles ───────────────────────────────────────────────── */}
      <section id="method" className="bg-[var(--paper)] py-[clamp(56px,7vw,100px)]">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div data-rise>
              <p className="eyebrow text-[var(--dim)]">How we work</p>
              <h2 className="display display-lg mt-6">
                Five rules we
                <br />
                <span style={{ color: "var(--dim)" }}>do not bend.</span>
              </h2>
            </div>
            <p className="max-w-[var(--measure)] self-end text-[1.02rem] leading-[1.6] text-[var(--mid)]" data-rise>
              We do not do retainers and we do not do vague discovery phases. You describe what you
              need, we quote it flat, and most engagements close in weeks rather than quarters.
            </p>
          </div>

          <ol className="mt-14 border-t border-[var(--line)]">
            {PRINCIPLES.map((p) => (
              <li
                key={p.n}
                className="grid gap-x-8 gap-y-2 border-b border-[var(--line)] py-7 md:grid-cols-[64px_minmax(0,300px)_minmax(0,1fr)]"
                data-rise
              >
                <span className="eyebrow tnum pt-1.5 text-[var(--dim)]">{p.n}</span>
                <h3 className="text-[1.2rem] font-semibold tracking-[-0.022em]">{p.t}</h3>
                <p className="max-w-[56ch] text-[15px] leading-[1.6] text-[var(--mid)]">{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-[var(--ground)] py-[clamp(72px,9vw,128px)]">
        <div className="shell">
          <h2 className="display text-[clamp(2.2rem,5.4vw,4rem)]" data-rise>
            Tell us what is
            <br />
            <span style={{ color: "var(--teal)" }}>slowing you down.</span>
          </h2>
          <div className="mt-9 flex flex-wrap gap-3" data-rise>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-[3px] bg-[var(--ink)] px-6 text-[14.5px] font-semibold text-[var(--paper)] transition-opacity hover:opacity-90"
            >
              Start a project
            </Link>
            <Link
              href="/arthur"
              className="inline-flex h-12 items-center rounded-[3px] border border-[var(--line-2)] px-6 text-[14.5px] font-semibold transition-colors hover:border-[var(--ink)]"
            >
              Read the architecture
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
