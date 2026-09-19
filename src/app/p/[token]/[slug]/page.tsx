import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortal, formatDate, portals, type Seo } from "@/content/portals";
import { Viewer } from "@/components/portal/Viewer";
import { NoteForm } from "@/components/portal/NoteForm";

export const dynamicParams = false;

export function generateStaticParams() {
  return portals.flatMap((p) =>
    p.deliverables.map((d) => ({ token: p.token, slug: d.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string; slug: string }>;
}): Promise<Metadata> {
  const { token, slug } = await params;
  const d = getPortal(token)?.deliverables.find((x) => x.slug === slug);
  return { title: d ? `${d.title} — review` : "Review" };
}

export default async function DeliverablePage({
  params,
}: {
  params: Promise<{ token: string; slug: string }>;
}) {
  const { token, slug } = await params;
  const portal = getPortal(token);
  const deliverable = portal?.deliverables.find((d) => d.slug === slug);
  if (!portal || !deliverable) notFound();

  const index = portal.deliverables.indexOf(deliverable);

  return (
    <>
      <div className="mx-auto max-w-[1340px] px-6 pb-8 pt-10">
        <Link
          href={`/p/${portal.token}`}
          className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--dim)] transition-colors hover:text-[var(--text)]"
        >
          ← {portal.client} · {portal.round}
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div>
            <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.03em]">
              {deliverable.title}
            </h1>
            <p className="mt-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--dim)]">
              {String(index + 1).padStart(2, "0")} · {deliverable.kind}
            </p>
          </div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--dim)] tnum">
            Delivered {formatDate(portal.deliveredOn)}
          </p>
        </div>
      </div>

      {/* The work itself, full bleed and live. */}
      <div className="border-y border-[var(--line)]">
        <Viewer src={deliverable.href} title={deliverable.title} />
      </div>

      <div className="mx-auto grid max-w-[1340px] gap-x-16 gap-y-12 px-6 py-16 lg:grid-cols-[minmax(0,var(--measure))_minmax(0,1fr)]">
        <div>
          <h2 className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--dim)]">
            Why it is built this way
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-[var(--muted)]">
            {deliverable.rationale}
          </p>

          <h2 className="mt-10 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--dim)]">
            What to look at
          </h2>
          <ul className="mt-4 space-y-3">
            {deliverable.look.map((l) => (
              <li
                key={l}
                className="flex gap-3 text-[14px] leading-[1.6] text-[var(--muted)]"
              >
                <span
                  className="mt-[9px] h-px w-3 shrink-0 bg-[var(--accent)]"
                  aria-hidden="true"
                />
                <span>{l}</span>
              </li>
            ))}
          </ul>

          {deliverable.caveats && (
            <>
              <h2 className="mt-10 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--dim)]">
                Read this before you judge the numbers
              </h2>
              <ul className="mt-4 space-y-2.5">
                {deliverable.caveats.map((c) => (
                  <li key={c} className="text-[13px] leading-[1.6] text-[var(--muted)]">
                    {c}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div>
          {deliverable.seo && <SeoPanel seo={deliverable.seo} domain={portal.clientDomain} />}
          <NoteForm
            token={portal.token}
            client={portal.client}
            defaultSlug={deliverable.slug}
            deliverables={portal.deliverables.map((d) => ({
              slug: d.slug,
              title: d.title,
            }))}
          />
        </div>
      </div>
    </>
  );
}

/* Search visibility. Every number carries its source and its bound — a position
   we could not see is reported as "not in the top N we could read", never as
   "not ranking", because the two are different claims. */
function SeoPanel({ seo, domain }: { seo: Seo; domain?: string }) {
  const score = (n: number) =>
    n >= 90 ? "var(--good)" : n >= 50 ? "var(--accent)" : "var(--accent)";
  return (
    <section className="mb-12 border border-[var(--line-bright)] p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-[22px] font-medium tracking-[-0.01em]">Search visibility</h2>
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--dim)]">
          Measured {formatDate(seo.measuredOn)}
        </span>
      </div>

      <div className="mt-7 grid grid-cols-3 gap-px bg-[var(--line)]">
        {([
          ["Performance", seo.performance],
          ["SEO", seo.seoScore],
          ["Accessibility", seo.accessibility],
        ] as const).map(([label, n]) => (
          <div key={label} className="bg-[var(--ground)] px-4 py-5">
            <div className="tnum text-[34px] leading-none" style={{ color: score(n) }}>
              {n}
            </div>
            <div className="mt-2 text-[13px] text-[var(--muted)]">{label}</div>
            <div className="mt-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--dim)]">
              Lighthouse, mobile
            </div>
          </div>
        ))}
      </div>

      <p className="mt-7 text-[15px] leading-[1.7] text-[var(--muted)]">{seo.verdict}</p>

      <h3 className="mt-9 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--dim)]">
        Where {domain ?? "the site"} ranks on Google today
      </h3>
      <ul className="mt-4 space-y-4">
        {seo.queries.map((q) => (
          <li key={q.query} className="border-t border-[var(--line)] pt-4">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[14px] text-[var(--text)]">&ldquo;{q.query}&rdquo;</span>
              <span
                className="tnum shrink-0 font-[family-name:var(--font-mono)] text-[13px]"
                style={{ color: q.position ? "var(--good)" : "var(--accent)" }}
              >
                {q.position ? `#${q.position}` : `not in top ${q.scanned}`}
              </span>
            </div>
            {q.winners.length > 0 && (
              <div className="mt-2 text-[13px] text-[var(--dim)]">
                Ranking instead: {q.winners.join(" · ")}
              </div>
            )}
          </li>
        ))}
      </ul>

      <h3 className="mt-9 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--dim)]">
        How this was measured
      </h3>
      <ul className="mt-4 space-y-2.5">
        {seo.notes.map((n) => (
          <li key={n} className="text-[13px] leading-[1.6] text-[var(--muted)]">
            {n}
          </li>
        ))}
      </ul>
      {!seo.crux && (
        <p className="mt-6 border-t border-[var(--line)] pt-5 text-[13px] leading-[1.6] text-[var(--muted)]">
          Google holds no Chrome UX Report field data for this domain, which means
          too few real visitors for it to report on. That is a traffic finding
          rather than a ranking one.
        </p>
      )}
    </section>
  );
}
