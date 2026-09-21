import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { operated } from "@/content/work";

/* The per-project page. It used to carry its own copy of the project data,
   duplicating /work's copy; both now read src/content/work.ts. */

export async function generateStaticParams() {
  return operated.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = operated.find((c) => c.slug === slug);
  if (!p) return { title: "Not found" };
  return {
    title: p.title,
    description: p.meta,
    alternates: { canonical: "https://loveleedaystudios.com/work/" + p.slug },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = operated.find((c) => c.slug === slug);
  if (!p) notFound();

  const i = operated.indexOf(p);
  const next = operated[(i + 1) % operated.length];

  return (
    <>
      <section className="border-b border-[var(--line)] bg-[var(--paper)] pt-[clamp(48px,6vw,88px)] pb-[clamp(40px,5vw,72px)]">
        <div className="shell">
          <Link
            href="/work"
            className="eyebrow inline-block text-[var(--dim)] transition-colors hover:text-[var(--text)]"
          >
            &larr; All work
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <p className="eyebrow text-[var(--dim)]">{p.category}</p>
              <h1 className="display display-lg mt-5">{p.title}</h1>
            </div>
            <div className="max-w-[var(--measure)] self-end">
              <p className="text-[1.05rem] leading-[1.6] text-[var(--muted)]">{p.shipped}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-[2px] border border-[var(--line-2)] px-2.5 py-1 text-[11.5px] text-[var(--muted)]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-11 items-center rounded-[3px] bg-[var(--text)] px-5 text-[14px] font-semibold text-[var(--paper)] transition-opacity hover:opacity-90"
                >
                  Visit the live site ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper)] py-[clamp(56px,7vw,100px)]">
        <div className="shell max-w-[--shell]">
          {[
            ["The problem", p.problem],
            ["What we built", p.built],
          ].map(([h, body]) => (
            <div
              key={h}
              className="grid gap-x-10 gap-y-3 border-t border-[var(--line)] py-9 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)]"
              data-rise
            >
              <h2 className="eyebrow pt-1.5 text-[var(--dim)]">{h}</h2>
              <p className="max-w-[66ch] text-[1.02rem] leading-[1.65] text-[var(--muted)]">{body}</p>
            </div>
          ))}
          <div
            className="grid gap-x-10 gap-y-3 border-y border-[var(--line)] py-9 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)]"
            data-rise
          >
            <h2 className="eyebrow pt-1.5 text-[var(--dim)]">Outcome</h2>
            <p className="max-w-[66ch] border-l-2 border-[var(--signal)] pl-5 text-[1.02rem] leading-[1.65] text-[var(--text)]">
              {p.outcome}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper-2)] py-[clamp(56px,7vw,100px)]">
        <div className="shell flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow text-[var(--dim)]">Next project</p>
            <Link href={"/work/" + next.slug} className="group mt-4 block">
              <h2 className="display text-[clamp(2rem,4.6vw,3.2rem)] transition-colors group-hover:text-[var(--signal)]">
                {next.title} &rarr;
              </h2>
            </Link>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center rounded-[3px] bg-[var(--text)] px-6 text-[14.5px] font-semibold text-[var(--paper)] transition-opacity hover:opacity-90"
          >
            Start a project
          </Link>
        </div>
      </section>
    </>
  );
}
