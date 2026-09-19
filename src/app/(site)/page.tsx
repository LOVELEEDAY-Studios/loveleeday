import Link from "next/link";
import { ProductPanels } from "@/components/home/ProductPanels";

export const metadata = {
  title: "LOVELEEDAY Studios — We build software, then we run the business on it",
  description:
    "A software company that builds and operates its own products. olldae, a restaurant operating system live in production. Arthur, an agentic operating system with 40 probe-verified capabilities.",
};

export default function Home() {
  return (
    <main>
      {/* ── 1. HERO ──────────────────────────────────────────────────────────
          Asymmetric split. Text column held to --measure (420px) with a hairline
          rule; the product runs off the right edge of the viewport. */}
      <section className="relative overflow-hidden border-b border-[var(--line)]">
        {/* One diagonal plane cutting the section edge. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            background:
              "radial-gradient(60rem 40rem at 78% 18%, rgba(255,71,19,0.10), transparent 62%)",
          }}
        />
        <div className="relative mx-auto grid max-w-[1340px] grid-cols-1 gap-16 px-6 pt-16 pb-20 lg:grid-cols-[var(--measure)_1fr] lg:gap-16 lg:pt-20 lg:pb-24">
          <div className="rule-left">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
              Software company
            </p>
            <h1 className="mt-5 text-[2.6rem] font-medium leading-[1.05] tracking-[-0.03em] text-[var(--text)] sm:text-[3.1rem]">
              We build the software,
              <br />
              then we run the
              <br />
              business on it.
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-[var(--muted)]">
              Most software for restaurants is written by people who have never
              worked a Friday service. We own a bar. We built the system that
              runs it, and we sell that system.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/work"
                className="rounded-md bg-[var(--accent)] px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[var(--accent-dim)]"
              >
                See what we run
              </Link>
              <Link
                href="/contact"
                className="rounded-md border border-[var(--line-bright)] px-4 py-2.5 text-[14px] font-medium text-[var(--text)] transition-colors hover:border-[var(--muted)]"
              >
                Talk to us
              </Link>
            </div>
          </div>

          {/* Bleeds off the right. Decoration only — every figure that carries an
              argument lives in the text column or the rail below. */}
          <div className="relative lg:-mr-[10vw]">
            <ProductPanels />
          </div>
        </div>
      </section>

      {/* ── 2. PROOF RAIL ────────────────────────────────────────────────────
          Thin horizontal rail. Deliberately a different silhouette from the
          section above and the one below. */}
      <section className="border-b border-[var(--line)] bg-[var(--sunk)]">
        <div className="mx-auto max-w-[1340px] px-6">
          <dl className="grid grid-cols-2 divide-x divide-[var(--line)] md:grid-cols-4">
            {[
              { v: "2", k: "products in production" },
              { v: "$49", k: "per month, olldae" },
              { v: "40", k: "capabilities, probe-verified" },
              { v: "7 yrs", k: "operating the business we build for" },
            ].map((s) => (
              <div key={s.k} className="px-5 py-7 first:pl-0">
                <dt className="tnum text-2xl font-medium tracking-tight text-[var(--text)]">
                  {s.v}
                </dt>
                <dd className="mt-1 text-[12px] leading-snug text-[var(--dim)]">{s.k}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 3. THE ARGUMENT ──────────────────────────────────────────────────
          Type as the composition. No card, no image, no grid — the headline is
          the layout. */}
      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-[1340px] px-6 py-28 lg:py-36">
          <p className="max-w-[24ch] text-[2rem] font-medium leading-[1.18] tracking-[-0.02em] text-[var(--text)] sm:text-[2.6rem]">
            Anyone can ship you a dashboard. We are the only ones who have to
            use it at{" "}
            <span className="text-[var(--accent)]">eleven on a Friday</span>.
          </p>
          <p className="mt-8 max-w-[var(--measure)] text-[15px] leading-relaxed text-[var(--muted)]">
            Every feature in olldae exists because a shift went badly without it.
            Recipe costing came from a pour-cost problem we were losing money to.
            Catering quoting came from quoting a 300-person event on paper. That
            is a different way to decide what to build.
          </p>
        </div>
      </section>
    </main>
  );
}
