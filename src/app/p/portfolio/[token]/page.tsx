import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { portfolio } from "@/content/portfolio";
import { formatDate } from "@/content/portals";
import { BeforeAfter } from "@/components/portal/BeforeAfter";
import { NoteForm } from "@/components/portal/NoteForm";

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ token: portfolio.token }];
}
export const metadata: Metadata = { title: "Collab Capital — portfolio study" };

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (token !== portfolio.token) notFound();
  const p = portfolio;

  return (
    <>
      {/* Header */}
      <section className="mx-auto max-w-[1340px] px-6 pb-16 pt-16 sm:pt-24">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
          Portfolio study
          <span className="text-[var(--dim)]"> · prepared for {p.preparedFor}</span>
        </p>
        <h1 className="mt-5 text-[clamp(2.5rem,6.5vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.035em]">
          Three of your companies,
          <br />
          rebuilt.
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-[var(--muted)]">
          <span>{p.fund}</span>
          <span className="hidden h-3 w-px bg-[var(--line-bright)] sm:block" aria-hidden="true" />
          <span className="tnum">Delivered {formatDate(p.deliveredOn)}</span>
          <span className="hidden h-3 w-px bg-[var(--line-bright)] sm:block" aria-hidden="true" />
          <span className="tnum">38 sites audited</span>
        </div>
        <p className="rule-left mt-10 max-w-[var(--measure)] text-[16px] leading-[1.7] text-[var(--muted)]">
          {p.intro}
        </p>
      </section>

      {/* Portfolio-wide numbers */}
      <section className="border-y border-[var(--line)] bg-[var(--sunk)]">
        <div className="mx-auto grid max-w-[1340px] grid-cols-2 gap-px bg-[var(--line)] px-6 lg:grid-cols-4">
          {p.stats.map((s) => (
            <div key={s.label} className="bg-[var(--sunk)] px-1 py-10 lg:px-6">
              <div className="tnum text-[clamp(2.2rem,4vw,3.2rem)] leading-none text-[var(--accent)]">
                {s.k}
              </div>
              <div className="mt-3 text-[14px] text-[var(--text)]">{s.label}</div>
              <div className="mt-1.5 text-[12.5px] leading-[1.5] text-[var(--dim)]">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What the fund cannot see from its own page */}
      <section className="mx-auto max-w-[1340px] px-6 py-20">
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
          Before the redesigns
        </span>
        <h2 className="mt-4 max-w-[20ch] text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium leading-[1.06] tracking-[-0.025em]">
          Three things we found on {p.fundDomain} itself.
        </h2>
        <div className="mt-12 grid gap-px bg-[var(--line)] md:grid-cols-3">
          {p.fundFindings.map((f, i) => (
            <div key={f.title} className="bg-[var(--ground)] p-7">
              <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.18em] text-[var(--dim)] tnum">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-[17px] font-medium leading-[1.3]">{f.title}</h3>
              <p className="mt-3 text-[14px] leading-[1.65] text-[var(--muted)]">{f.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The three cases */}
      <section className="border-t border-[var(--line)]">
        {p.cases.map((c, i) => (
          <article key={c.slug} className="border-b border-[var(--line)]">
            <div className="mx-auto max-w-[1340px] px-6 py-16 lg:py-24">
              <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
                <div>
                  <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.18em] text-[var(--dim)] tnum">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium leading-[1.04] tracking-[-0.025em]">
                    {c.company}
                  </h2>
                  <p className="mt-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--dim)]">
                    {c.sector}
                  </p>
                </div>
                <Link
                  href={`/p/${c.portalToken}/marketing-site`}
                  className="inline-flex min-h-[44px] items-center bg-[var(--accent)] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[var(--accent-dim)]"
                >
                  Open the full package
                </Link>
              </div>

              <div className="mt-10">
                <BeforeAfter before={c.before} after={c.after} label={c.company} />
              </div>

              <div className="mt-12 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,var(--measure))_minmax(0,1fr)]">
                <div>
                  <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--dim)]">
                    Why we rebuilt it
                  </h3>
                  <p className="mt-4 text-[15px] leading-[1.7] text-[var(--muted)]">{c.thesis}</p>
                  <div className="mt-7 border-t border-[var(--line)] pt-5">
                    <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--dim)]">
                      Search today
                    </h3>
                    <p className="mt-3 text-[14px] leading-[1.65] text-[var(--muted)]">{c.search}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--dim)]">
                    What we found
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {c.findings.map((f) => (
                      <li key={f} className="flex gap-3 text-[14.5px] leading-[1.65] text-[var(--muted)]">
                        <span className="mt-[10px] h-px w-3 shrink-0 bg-[var(--accent)]" aria-hidden="true" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Method + note */}
      <section className="bg-[var(--sunk)]">
        <div className="mx-auto grid max-w-[1340px] gap-x-16 gap-y-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <h2 className="text-[26px] font-medium leading-[1.2] tracking-[-0.02em]">
              How this was measured
            </h2>
            <ul className="mt-8 space-y-4">
              {p.method.map((m) => (
                <li key={m} className="text-[14px] leading-[1.7] text-[var(--muted)]">
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <NoteForm
            token={portfolio.token}
            client={portfolio.fund}
            deliverables={p.cases.map((c) => ({ slug: c.slug, title: c.company }))}
          />
        </div>
      </section>
    </>
  );
}
