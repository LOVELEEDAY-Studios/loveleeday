import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { operated, studies } from "@/content/work";

/* /work.
   ==========================================================================

   Three things were wrong with this page and only one of them was visual.

   It imported Nav and Footer itself while the route-group layout also rendered
   them, so it shipped two headers and two footers. It kept its own copy of the
   project data, as did /work/[slug] -- two copies, free to drift. And it was
   styled against var(--bone), var(--pewter) and var(--font-display-var), none
   of which exist in globals.css, so its rules and its type colour were falling
   back to whatever they inherited. Dead tokens are invisible until you go
   looking, which is how they survived a redesign.

   It now renders from src/content/work.ts, on the site's real tokens, and shows
   both bodies of work: the products that shipped and the rebuilds nobody asked
   for.
   ========================================================================== */

export const metadata: Metadata = {
  title: "Work",
  description:
    "Production software from LOVELEEDAY Studios — restaurant operations, multi-entity finance, invoice automation and internal tooling — plus six uncommissioned rebuilds of a venture portfolio.",
  alternates: { canonical: "https://loveleedaystudios.com/work" },
};

export default function WorkPage() {
  return (
    <>
      {/* ── masthead ─────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--line)] bg-[var(--paper)] pt-[clamp(56px,7vw,104px)] pb-[clamp(44px,5vw,76px)]">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="eyebrow flex items-center gap-2.5 text-[var(--dim)]">
              <span className="inline-block h-[7px] w-[7px]" style={{ background: "var(--teal)" }} />
              Selected work
            </p>
            <h1 className="display display-lg mt-7">
              Shipped, not
              <br />
              <span style={{ color: "var(--dim)" }}>proposed.</span>
            </h1>
          </div>
          <p className="max-w-[var(--measure)] self-end text-[1.05rem] leading-[1.6] text-[var(--mid)]">
            Two different things, kept separate on purpose. First, work for companies that are not
            ours — six sites we rebuilt without being asked, because the argument was easier to make
            in working HTML than in a deck. Then the five software companies LOVELEEDAY owns and
            runs, which prove we ship but do not prove anyone hired us.
          </p>
        </div>
      </section>

      {/* ── the rebuilds ─────────────────────────────────────────────── */}
      <section id="studies" className="bg-[var(--deep)] py-[clamp(64px,8vw,116px)] text-[var(--on-deep)]">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div data-rise>
              <p className="eyebrow flex items-center gap-2.5 text-[var(--on-deep-dim)]">
                <span className="inline-block h-[7px] w-[7px]" style={{ background: "var(--teal)" }} />
                Uncommissioned
              </p>
              <h2 className="display display-lg mt-6">
                Thirty-eight sites.
                <br />
                <span style={{ color: "var(--on-deep-mu)" }}>Six rebuilds.</span>
              </h2>
            </div>
            <p className="max-w-[var(--measure)] self-end text-[1.02rem] leading-[1.6] text-[var(--on-deep-mu)]" data-rise>
              One venture portfolio, measured end to end on page weight, Lighthouse, live search
              position and accessibility. Six of the companies were then rebuilt as running pages.
              None of it was commissioned, and every measurement names its source.
            </p>
          </div>

          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {studies.map((s) => (
              <figure
                key={s.id}
                className="group overflow-hidden rounded-[5px] border border-[var(--deep-line)] bg-[var(--deep-2)]"
                data-rise
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--deep-line)]">
                  <Image
                    src={s.frame}
                    alt={"Rebuilt " + s.sector.toLowerCase() + " site, top of page"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="eyebrow text-[var(--on-deep-dim)]">{s.id}</span>
                    <span className="eyebrow text-[var(--on-deep-mu)]">{s.sector}</span>
                  </div>
                  <p className="mt-3.5 text-[14px] leading-[1.55] text-[var(--on-deep-mu)]">
                    {s.thesis}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-8 max-w-[76ch] text-[13px] leading-[1.55] text-[var(--on-deep-dim)]">
            The companies are not named here. Each rebuild carries measured criticism of the site it
            replaces, and that belongs in a private review addressed to the company rather than on a
            marketing page. Full packages are available on request.
          </p>
        </div>
      </section>

      {/* ── products ─────────────────────────────────────────────────── */}
      <section className="bg-[var(--paper)] py-[clamp(56px,7vw,96px)]">
        <div className="shell">
          <h2 className="text-[1.4rem] font-semibold tracking-[-0.026em]">Companies we own and operate</h2>
          <p className="mt-3 max-w-[64ch] text-[14.5px] leading-[1.6] text-[var(--mid)]">
            These are LOVELEEDAY-owned businesses, built in-house and running in production. They
            are listed as evidence that the studio ships, not as client engagements — we were our
            own customer on every one of them.
          </p>
          <div className="mt-8 border-t border-[var(--line-2)]">
            {operated.map((p) => (
              <article
                key={p.slug}
                className="grid gap-x-10 gap-y-5 border-b border-[var(--line-2)] py-10 md:grid-cols-[minmax(0,290px)_minmax(0,1fr)]"
                data-rise
              >
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="eyebrow tnum text-[var(--dim)]">{p.index}</span>
                    <h3 className="text-[1.6rem] font-semibold tracking-[-0.03em]">{p.title}</h3>
                  </div>
                  <p className="eyebrow mt-3.5 text-[var(--dim)]">{p.category}</p>
                  <p className="mt-4 text-[13.5px] text-[var(--mid)]">{p.shipped}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <li
                        key={t}
                        className="rounded-[2px] border border-[var(--line-2)] px-2 py-1 text-[11px] text-[var(--mid)]"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="max-w-[64ch] space-y-4">
                  <div>
                    <p className="eyebrow text-[var(--dim)]">The problem</p>
                    <p className="mt-2.5 text-[15px] leading-[1.62] text-[var(--mid)]">{p.problem}</p>
                  </div>
                  <div>
                    <p className="eyebrow text-[var(--dim)]">What we built</p>
                    <p className="mt-2.5 text-[15px] leading-[1.62] text-[var(--mid)]">{p.built}</p>
                  </div>
                  <p className="border-l-2 border-[var(--teal)] pl-4 text-[15px] leading-[1.62] text-[var(--ink)]">
                    {p.outcome}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
                    <Link
                      href={"/work/" + p.slug}
                      className="text-[13.5px] font-semibold underline decoration-[var(--line-2)] underline-offset-4 transition-colors hover:decoration-[var(--teal)]"
                    >
                      Read the build &rarr;
                    </Link>
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13.5px] font-semibold text-[var(--mid)] underline decoration-[var(--line-2)] underline-offset-4 transition-colors hover:text-[var(--ink)]"
                      >
                        Visit the live site ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-[var(--ground)] py-[clamp(72px,9vw,128px)]">
        <div className="shell">
          <h2 className="display text-[clamp(2.2rem,5.4vw,4rem)]" data-rise>
            Ready to start?
            <br />
            <span style={{ color: "var(--dim)" }}>Request a fixed quote.</span>
          </h2>
          <Link
            href="/contact"
            className="mt-9 inline-flex h-12 items-center rounded-[3px] bg-[var(--ink)] px-6 text-[14.5px] font-semibold text-[var(--paper)] transition-opacity hover:opacity-90"
            data-rise
          >
            Start a project
          </Link>
        </div>
      </section>
    </>
  );
}
