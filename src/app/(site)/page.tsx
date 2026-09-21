import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArthurConsole } from "@/components/home/ArthurConsole";
import { figures, products, studies } from "@/content/work";

/* The homepage.
   ==========================================================================

   What this replaces: 16 KB of delivered HTML injected with
   dangerouslySetInnerHTML, carrying its own stylesheet, its own script, its own
   header and its own footer, and loading Inter from Google over the top of the
   site's own type stack. It sat outside the (site) route group specifically so
   its chrome would not collide with the site's chrome -- which is a workaround
   for having two of everything, not a fix.

   It is now an ordinary page inside the group, using the site's nav, the site's
   footer and the site's tokens. The argument and most of the copy survive; the
   register does not.

   The section rhythm is Apple's: alternating stages, dark where the product is
   and light where the argument is, each one full-bleed and each one ending on a
   rule rather than on a gap.
   ========================================================================== */

export const metadata: Metadata = {
  title: "LOVELEEDAY Studios — Every figure, back to its source",
  description:
    "Arthur is an intelligence system that holds context across the tools you already run, resolves the same company under four names into one object, and carries a date and a source on every value it reports.",
  alternates: { canonical: "https://loveleedaystudios.com" },
};

/* ------------------------------------------------------------------ pieces */

function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className="eyebrow flex items-center gap-2.5" style={{ color: dark ? "var(--on-dark-dim)" : "var(--dim)" }}>
      <span className="inline-block h-[7px] w-[7px]" style={{ background: "var(--signal)" }} />
      {children}
    </p>
  );
}

const ARCHITECTURE = [
  {
    n: "01",
    title: "Persistent memory",
    body: "Journals, events and objects are stored and indexed, so a decision made in March is available to the work happening in September rather than re-explained to it.",
  },
  {
    n: "02",
    title: "Identity resolution",
    body: "A Stripe customer, a vendor id in the ledger and a string in an email signature are three records and one company. Ask about the object, never about whichever string a source happened to use.",
  },
  {
    n: "03",
    title: "Bitemporal record",
    body: "Every property knows when it was true in the world and when we learned it. Judging an August decision with September knowledge is look-ahead bias, and the system refuses to do it silently.",
  },
  {
    n: "04",
    title: "Lineage on every value",
    body: "A figure will not be written without the system and the reference it came from. A number with no trail is not reportable — that is mechanical, not a promise to be careful.",
  },
  {
    n: "05",
    title: "Tools and verification",
    body: "Models route to the work, tools execute against real systems, and nothing closes without an observed proof string. HTTP 200 is not evidence that anything happened.",
  },
];

/* ------------------------------------------------------------------- page */

export default function Home() {
  return (
    <>
      {/* ═══ 1 · HERO — the dark stage ═══════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[var(--ink)] text-[var(--on-dark)]">
        {/* A single soft field behind the object. Not a gradient mesh: one
            radial, off the right edge, at low opacity, so the console has
            something to sit in and the headline still owns the left half. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(760px 520px at 78% 34%, rgba(255,71,19,.13), transparent 62%), radial-gradient(900px 600px at 96% 78%, rgba(91,141,239,.10), transparent 60%)",
          }}
        />
        {/* Hairline grid. Stripe and Palantir both lay one in; at 3% it is not
            a pattern you notice, it is the reason the space reads as measured. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,.045) 1px, transparent 1px)",
            backgroundSize: "clamp(80px, 8vw, 132px) 100%",
          }}
        />

        <div className="shell relative grid min-h-[max(620px,86svh)] items-center gap-14 pt-[100px] pb-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] lg:gap-12 lg:pb-20">
          <div className="max-w-[34rem]">
            <Eyebrow dark>Arthur — intelligence architecture</Eyebrow>

            {/* Two lines, both short. The first draft read "Every figure, back
                to its source." and wrapped to three ragged lines at 1440 --
                a display face at this size gets about fourteen characters to a
                line inside a half-width column, and a headline that has to be
                re-flowed by the browser is a headline that was not measured. */}
            <h1 className="display display-xl mt-7">
              One object.
              <br />
              <span style={{ color: "var(--on-dark-mu)" }}>Every source.</span>
            </h1>

            <p className="mt-7 max-w-[33rem] text-[clamp(1.02rem,1.3vw,1.14rem)] leading-[1.55] text-[var(--on-dark-mu)]">
              Arthur resolves the same company under four different names into a single object,
              holds the context around it, and carries a date and a source on every value it
              reports. We build the production software that runs on top of it.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/arthur"
                className="inline-flex h-11 items-center rounded-[3px] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--signal-dd)]"
                style={{ background: "var(--signal-d)" }}
              >
                See how Arthur works
              </Link>
              <Link
                href="/work"
                className="inline-flex h-11 items-center rounded-[3px] border border-[var(--ink-4)] px-5 text-[14px] font-semibold text-[var(--on-dark)] transition-colors hover:border-[var(--on-dark-dim)]"
              >
                What we&rsquo;ve shipped
              </Link>
            </div>
          </div>

          {/* The object, cropped by the right edge of the viewport. On a narrow
              screen it stops running off and simply stacks. */}
          {/* The panel is cropped by the right edge so it reads as "this
              continues" -- but the first pass ran it out by up to 180px and the
              viewport ate the resolved entity names, which are the entire
              payoff of the object. It now bleeds by a gutter's worth: enough to
              be a crop, not enough to cost content. */}
          <div className="relative lg:-mr-[clamp(0px,3.4vw,48px)]" data-rise>
            <ArthurConsole />
            <p className="eyebrow mt-4 text-[var(--on-dark-dim)]">
              Illustrative resolution pass — sixteen records, five objects
            </p>
          </div>
        </div>

        {/* ═══ 2 · FIGURES — proof directly under the hero ═════════════════ */}
        <div className="shell relative border-t border-[var(--ink-3)]">
          <div className="grid divide-y divide-[var(--ink-3)] md:grid-cols-4 md:divide-x md:divide-y-0">
            {figures.map((f) => (
              <div key={f.label} className="py-8 md:px-7 md:first:pl-0 md:last:pr-0" data-rise>
                <div className="tnum text-[clamp(2.4rem,4vw,3.3rem)] font-semibold leading-none tracking-[-0.04em]">
                  {f.k}
                </div>
                <div className="mt-3 text-[14px] font-medium text-[var(--on-dark)]">{f.label}</div>
                <div className="mt-2 max-w-[30ch] text-[12.5px] leading-[1.5] text-[var(--on-dark-dim)]">
                  {f.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3 · THE SYSTEM — light stage ═══════════════════════════════ */}
      <section id="system" className="bg-[var(--paper)] py-[clamp(72px,9vw,132px)]">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div data-rise>
              <Eyebrow>Inside Arthur</Eyebrow>
              <h2 className="display display-lg mt-6">
                Built to connect.
                <br />
                <span style={{ color: "var(--dim)" }}>Designed to act.</span>
              </h2>
            </div>
            <p className="max-w-[var(--measure)] self-end text-[1.02rem] leading-[1.6] text-[var(--muted)]" data-rise>
              Five architectural components, not five features. Each one exists because a system
              that answers from a model alone cannot be trusted with work that has consequences —
              it has no memory of what you decided, no idea that two records are the same company,
              and no way to tell you where a number came from.
            </p>
          </div>

          <ol className="mt-14 border-t border-[var(--line)]">
            {ARCHITECTURE.map((a) => (
              <li
                key={a.n}
                className="grid gap-x-8 gap-y-2 border-b border-[var(--line)] py-7 md:grid-cols-[64px_minmax(0,300px)_minmax(0,1fr)]"
                data-rise
              >
                <span className="eyebrow tnum pt-1.5 text-[var(--dim)]">{a.n}</span>
                <h3 className="text-[1.22rem] font-semibold tracking-[-0.02em]">{a.title}</h3>
                <p className="max-w-[54ch] text-[15px] leading-[1.6] text-[var(--muted)]">{a.body}</p>
              </li>
            ))}
          </ol>

          <p className="mt-6 max-w-[70ch] text-[13px] leading-[1.55] text-[var(--dim)]">
            These are implemented architectural components, not a claim that every component runs in
            every workflow. The configuration is scoped and validated per engagement.
          </p>
        </div>
      </section>

      {/* ═══ 4 · THE WORK — products ════════════════════════════════════ */}
      <section id="work" className="bg-[var(--paper-2)] py-[clamp(72px,9vw,132px)]">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div data-rise>
              <Eyebrow>In production</Eyebrow>
              <h2 className="display display-lg mt-6">
                Shipped, not
                <br />
                <span style={{ color: "var(--dim)" }}>proposed.</span>
              </h2>
            </div>
            <p className="max-w-[var(--measure)] self-end text-[1.02rem] leading-[1.6] text-[var(--muted)]" data-rise>
              Five products running in production, each with a stack, a time to ship and an outcome
              stated in the language of the operator who uses it. Nothing on this page is a mockup.
            </p>
          </div>

          <div className="mt-14 border-t border-[var(--line-2)]">
            {products.map((p) => (
              <article
                key={p.slug}
                className="grid gap-x-10 gap-y-4 border-b border-[var(--line-2)] py-9 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]"
                data-rise
              >
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="eyebrow tnum text-[var(--dim)]">{p.index}</span>
                    <h3 className="text-[1.5rem] font-semibold tracking-[-0.028em]">{p.title}</h3>
                  </div>
                  <p className="eyebrow mt-3 text-[var(--dim)]">{p.category}</p>
                  <p className="mt-4 text-[13.5px] text-[var(--muted)]">{p.shipped}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <li
                        key={t}
                        className="rounded-[2px] border border-[var(--line-2)] bg-[var(--paper)] px-2 py-1 text-[11px] text-[var(--muted)]"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="max-w-[62ch] space-y-4">
                  <p className="text-[15px] leading-[1.62] text-[var(--muted)]">{p.built}</p>
                  <p className="border-l-2 border-[var(--signal)] pl-4 text-[15px] leading-[1.62] text-[var(--text)]">
                    {p.outcome}
                  </p>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[13.5px] font-semibold underline decoration-[var(--line-2)] underline-offset-4 transition-colors hover:decoration-[var(--signal)]"
                    >
                      Visit the live site ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5 · THE REBUILDS — dark stage, imagery is the studio's own ══ */}
      <section id="studies" className="bg-[var(--ink)] py-[clamp(72px,9vw,132px)] text-[var(--on-dark)]">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div data-rise>
              <Eyebrow dark>Uncommissioned</Eyebrow>
              {/* Numbers, not a sentence. "We audited a whole portfolio. Then
                  rebuilt it." broke to three ragged lines and buried the only
                  two facts in it. */}
              <h2 className="display display-lg mt-6">
                Thirty-eight sites.
                <br />
                <span style={{ color: "var(--on-dark-mu)" }}>Six rebuilds.</span>
              </h2>
            </div>
            <p className="max-w-[var(--measure)] self-end text-[1.02rem] leading-[1.6] text-[var(--on-dark-mu)]" data-rise>
              Thirty-eight companies in one venture portfolio, measured on page weight, Lighthouse,
              live search position and accessibility. Six of them were then rebuilt as working
              pages rather than described in a deck. None of it was commissioned, and every
              measurement names its source.
            </p>
          </div>

          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {studies.map((s) => (
              <figure
                key={s.id}
                className="group overflow-hidden rounded-[5px] border border-[var(--ink-3)] bg-[var(--ink-2)]"
                data-rise
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--ink-3)]">
                  <Image
                    src={s.frame}
                    alt={`Rebuilt ${s.sector.toLowerCase()} site, top of page`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="eyebrow text-[var(--on-dark-dim)]">{s.id}</span>
                    <span className="eyebrow text-[var(--on-dark-mu)]">{s.sector}</span>
                  </div>
                  <p className="mt-3.5 text-[14px] leading-[1.55] text-[var(--on-dark-mu)]">
                    {s.thesis}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-8 max-w-[76ch] text-[13px] leading-[1.55] text-[var(--on-dark-dim)]">
            The companies are not named here. Each rebuild carries measured criticism of the site it
            replaces, and that belongs in a private review addressed to the company rather than on a
            marketing page. Full packages are available on request.
          </p>
        </div>
      </section>

      {/* ═══ 6 · STANDARD ══════════════════════════════════════════════ */}
      <section className="bg-[var(--paper)] py-[clamp(72px,9vw,132px)]">
        <div className="shell grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div data-rise>
            <Eyebrow>The standard</Eyebrow>
            <h2 className="display display-lg mt-6">
              Confidence comes
              <br />
              <span style={{ color: "var(--dim)" }}>from the evidence.</span>
            </h2>
            <p className="mt-7 max-w-[var(--measure)] text-[1.02rem] leading-[1.6] text-[var(--muted)]">
              Speed matters when the work holds up. We define the outcome, inspect what changed, and
              make the remaining decisions visible — including the ones we got wrong.
            </p>
          </div>

          <dl className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {[
              ["Claims tied to sources", "Separate what the evidence shows from what still needs testing."],
              ["Completion tied to the task", "A generated answer and a working implementation are different deliverables."],
              ["Authority stays explicit", "Access, integrations and production changes follow the agreed scope and human approval."],
              ["Economics worth measuring", "Elapsed time, human effort, quality and cost per completed task, in the actual engagement."],
            ].map(([t, d], i) => (
              <div key={t} className="grid gap-x-6 gap-y-1 py-6 md:grid-cols-[44px_1fr]" data-rise>
                <span className="eyebrow tnum pt-1.5 text-[var(--dim)]">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <dt className="text-[1.08rem] font-semibold tracking-[-0.018em]">{t}</dt>
                  <dd className="mt-1.5 max-w-[56ch] text-[14.5px] leading-[1.6] text-[var(--muted)]">{d}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══ 7 · CLOSING ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[var(--paper-2)] py-[clamp(88px,11vw,164px)]">
        <div className="shell relative">
          <Eyebrow>Your business has more questions worth asking</Eyebrow>
          <h2 className="display mt-7 text-[clamp(2.6rem,7vw,5.6rem)]" data-rise>
            See the question.
            <br />
            <span style={{ color: "var(--signal)" }}>Build the answer.</span>
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-3" data-rise>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-[3px] bg-[var(--text)] px-6 text-[14.5px] font-semibold text-[var(--paper)] transition-opacity hover:opacity-90"
            >
              Start a project
            </Link>
            <Link
              href="/arthur"
              className="inline-flex h-12 items-center rounded-[3px] border border-[var(--line-2)] px-6 text-[14.5px] font-semibold transition-colors hover:border-[var(--text)]"
            >
              Read the architecture
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
