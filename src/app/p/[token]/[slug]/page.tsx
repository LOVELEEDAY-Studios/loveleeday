import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortal, formatDate, portals } from "@/content/portals";
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
    </>
  );
}
