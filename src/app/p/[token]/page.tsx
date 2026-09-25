import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortal, isExpired, formatDate, portals } from "@/content/portals";
import { NoteForm } from "@/components/portal/NoteForm";
import { BeforeAfter } from "@/components/portal/BeforeAfter";
import { Videos } from "@/components/portal/Videos";
import { portfolios } from "@/content/portfolio";

export const dynamicParams = false;

export function generateStaticParams() {
  // A portal whose token is unset is written but deliberately unreachable, so it must not reach
  // the param list at all: Next rejects `{ token: undefined }` with "A required parameter (token)
  // was not provided as a string" and fails the whole build while collecting page data. That took
  // production down for every deploy on 2026-09-22 — the site kept serving an older build, so
  // nothing looked broken until a newly-tokened study 404'd. Mirrors publishedPortfolios in
  // /p/portfolio/[token].
  return portals.flatMap((p) => (p.token ? [{ token: p.token }] : []));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const portal = getPortal(token);
  return { title: portal ? `${portal.client} — review` : "Review" };
}

export default async function PortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const portal = getPortal(token);
  if (!portal) notFound();

  const expired = isExpired(portal);

  return (
    <>
      <span hidden data-portal-col="1340" />
      {/* Header. The client's name is the largest thing on the page; ours is a
          26px mark in the bar above it. That ordering is the whole posture. */}
      <section className="mx-auto max-w-[1340px] px-6 pb-14 pt-16 sm:pt-24">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
          {portal.round}
          <span className="text-[var(--dim)]"> · prepared for {portal.client}</span>
        </p>

        <h1 className="mt-5 text-[clamp(2.75rem,7vw,5.25rem)] font-medium leading-[0.95] tracking-[-0.035em]">
          {portal.client}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-[var(--mid)]">
          <span>{portal.project}</span>
          <span className="hidden h-3 w-px bg-[var(--line-bright)] sm:block" aria-hidden="true" />
          <span className="tnum">Delivered {formatDate(portal.deliveredOn)}</span>
          <span className="hidden h-3 w-px bg-[var(--line-bright)] sm:block" aria-hidden="true" />
          <span className="tnum">
            {portal.deliverables.length}{" "}
            {portal.deliverables.length === 1 ? "page" : "pages"}
          </span>
        </div>

        <p className="mt-10 max-w-[var(--measure)] text-[16px] leading-[1.7] text-[var(--mid)] rule-left">
          {portal.intro}
        </p>

        {expired && (
          <p className="mt-8 inline-block border border-[var(--accent-dim)] px-4 py-2 text-[13px] text-[var(--accent)]">
            This link expired on {formatDate(portal.expiresOn!)}. The pages still
            open — ask us for a current link before sharing it on.
          </p>
        )}
      </section>

      {/* Deliverables. Alternating sides so no two rows share a silhouette, and
          the screenshot always bleeds past the text column. */}
      <section className="border-t border-[var(--line)]">
        {portal.deliverables.map((d, i) => {
          // Match on the client, not the deliverable: a portal may carry several
          // pages while the comparison is of the site as a whole.
          //
          // Search EVERY portfolio, not `portfolio` — that export is an alias
          // for Collab kept so old imports would not break, so this lookup only
          // ever saw Collab's six companies. Enable Injections belongs to
          // Lightship and VentureHue to its own study, so both found nothing,
          // `cmp` came back undefined, and the `{cmp && ...}` guard removed the
          // comparison with no error and no empty box — the two clients whose
          // portals most needed a before/after were the two that silently had
          // none. Daniel, 2026-09-22: "for enable injector you dont have the
          // scroll of before and after." A conditional render is the quietest
          // possible failure; there is nothing on the page to notice.
          const cmp = portfolios
            .flatMap((p) => p.cases)
            .find((c) => c.company.toLowerCase() === portal.client.toLowerCase());
          const flip = i % 2 === 1;
          return (
            <article
              key={d.slug}
              className="border-b border-[var(--line)] last:border-b-0"
            >
              <div className="mx-auto grid max-w-[1340px] items-start gap-x-16 gap-y-10 px-6 py-16 lg:grid-cols-[minmax(0,var(--measure))_minmax(0,1fr)] lg:py-24">
                <div className={flip ? "lg:order-2" : ""}>
                  <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.18em] text-[var(--dim)] tnum">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-3 text-[28px] font-medium leading-[1.15] tracking-[-0.02em]">
                    {d.title}
                  </h2>
                  <p className="mt-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--dim)]">
                    {d.kind}
                  </p>

                  <p className="mt-6 text-[15px] leading-[1.7] text-[var(--mid)]">
                    {d.rationale}
                  </p>

                  <h3 className="mt-9 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--dim)]">
                    What to look at
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {d.look.map((l) => (
                      <li
                        key={l}
                        className="flex gap-3 text-[14px] leading-[1.6] text-[var(--mid)]"
                      >
                        <span
                          className="mt-[9px] h-px w-3 shrink-0 bg-[var(--accent)]"
                          aria-hidden="true"
                        />
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>

                  {/* ONE button. There were two here plus a third on the
                      screenshot ("Open and review", "Full screen", "Open and
                      review →") and they led to two different places. Daniel,
                      2026-09-22: "dont do the open and preview and full screen
                      buttons that is confusing for clients one button." A
                      client wants to see their site, so the button opens it,
                      full size, as a real page they can scroll. */}
                  <div className="mt-9">
                    <a
                      href={`${d.href}?k=${portal.token}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[44px] items-center bg-[var(--accent)] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[var(--accent-dim)]"
                    >
                      View the redesign
                    </a>
                  </div>

                  {d.caveats && (
                    <div className="mt-10 border-t border-[var(--line)] pt-6">
                      <h3 className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--dim)]">
                        Read this before you judge the numbers
                      </h3>
                      <ul className="mt-4 space-y-2.5">
                        {d.caveats.map((c) => (
                          <li
                            key={c}
                            className="text-[13px] leading-[1.6] text-[var(--mid)]"
                          >
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Before and after.
                    The captures already existed and only the fund's page used
                    them, so the client -- the person whose site it IS -- was
                    shown the rebuild with nothing to read it against. The pair
                    is looked up from the portfolio data rather than copied into
                    the portal, so the two pages cannot drift apart and show a
                    client one comparison while the fund sees another. */}
                <div className={flip ? "lg:order-1" : ""}>
                  {cmp && (
                    <div className="mb-8">
                      <p className="mb-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--dim)]">
                        Today, and the direction — drag to compare
                      </p>
                      <BeforeAfter
                        before={cmp.before}
                        after={cmp.after}
                        label={portal.client}
                        beforeCaption={portal.clientDomain ?? "Today"}
                        afterCaption="Our direction"
                      />
                    </div>
                  )}

                {/* The screenshot is the object on the page, not a card around
                    one: no padding, no radius, hairline only. */}
                <a
                  href={`${d.href}?k=${portal.token}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group block"
                >
                  <div className="overflow-hidden border border-[var(--line-bright)] bg-[var(--raised)] transition-colors group-hover:border-[var(--accent)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={d.card}
                      alt={`${d.title} — top of page`}
                      width={1400}
                      height={1780}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="block w-full"
                    />
                  </div>
                  <span className="mt-3 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--dim)]">
                    Top of page
                  </span>
                </a>
                {d.videos && (
                  <div className="mt-12">
                    <Videos videos={d.videos} />
                  </div>
                )}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* What happens next + the note box. A review link that ends in a
          screenshot is a dead end; this is the part that makes it a step. */}
      <section className="border-t border-[var(--line)] bg-[var(--sunk)]">
        <div className="mx-auto grid max-w-[1340px] gap-x-16 gap-y-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <h2 className="text-[26px] font-medium leading-[1.2] tracking-[-0.02em]">
              What happens next
            </h2>
            <ol className="mt-8 space-y-6">
              {portal.next.map((n, i) => (
                <li key={n} className="flex gap-5">
                  <span className="font-[family-name:var(--font-mono)] text-[11px] leading-[1.7] text-[var(--accent)] tnum">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="max-w-[var(--measure)] text-[15px] leading-[1.7] text-[var(--mid)]">
                    {n}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <NoteForm
            token={portal.token}
            client={portal.client}
            deliverables={portal.deliverables.map((d) => ({
              slug: d.slug,
              title: d.title,
            }))}
          />
        </div>
      </section>
    </>
  );
}
