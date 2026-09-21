import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Figure } from "@/components/graphics/Figure";
import { figures, studies } from "@/content/work";

/* The homepage — layout 02 "Ontology", palette A "Cream & Navy".
   ==========================================================================

   The structure is Palantir Foundry's, from the capture on 2026-09-21: an
   enormous display set LEFT with the statement set right, a great deal of air
   around both, and then a huge labelled SCHEMATIC bleeding off both edges. The
   diagram is the argument. A company that can draw its own architecture is
   making a claim a paragraph cannot.

   The palette is not Palantir's, deliberately. Foundry is white and
   near-monochrome; this is cream, navy and a teal action colour, which is what
   keeps an Ontology layout from reading as an imitation — the one risk that
   direction carried when it was proposed.

   No owned company appears anywhere on this page. olldae, Kronos, Duezy, the
   operations layer and Dabney & Co. are LOVELEEDAY's own; presenting them here
   would imply five customers chose us.
   ========================================================================== */

export const metadata: Metadata = {
  title: "LOVELEEDAY Studios — the object layer for the business you already run",
  description:
    "Arthur resolves records scattered across payments, ledgers and documents into single objects, each carrying the date it was true, the date we learned it, and a trail back to its source.",
  alternates: { canonical: "https://loveleedaystudios.com" },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow flex items-center gap-2.5 text-[var(--dim)]">
      <span className="inline-block h-[7px] w-[7px]" style={{ background: "var(--teal)" }} />
      {children}
    </p>
  );
}

const GUARANTEES = [
  ["01", "Identity resolution",
   "A payments customer, a vendor id in the ledger and a string in an email signature are three records and one company. Questions are asked about the object, never about whichever string a source happened to use."],
  ["02", "Bitemporality",
   "Every property knows when it was valid in the world and when it was observed. Judging an August decision with September knowledge is look-ahead bias, and the two timelines are kept apart so it cannot happen quietly."],
  ["03", "Lineage",
   "Writing a value requires its source system and source reference. The trail prints for any figure. A number with no trail is not reportable — mechanically, not as a matter of care."],
  ["04", "Bounded autonomy",
   "Actions are classified by blast radius. Only the reversible class runs unattended; anything touching money, outbound communication or a legal document waits for a person."],
  ["05", "Observed completion",
   "Work closes on a value read back out of the system that was supposed to change. An HTTP 200 is not evidence that anything happened."],
];

export default function Home() {
  return (
    <>
      {/* ═══ 1 · MASTHEAD ══════════════════════════════════════════════ */}
      <section className="bg-[var(--ground)] pt-[clamp(46px,7vw,104px)] pb-[clamp(30px,4vw,56px)]">
        <div className="shell grid gap-[clamp(22px,4vw,64px)] lg:grid-cols-[1.22fr_0.88fr] lg:items-start">
          <h1 className="display text-[clamp(2.7rem,7.2vw,6rem)] leading-[0.94]">
            Arthur
            <br />
            Ontology
          </h1>
          <div>
            <p className="font-[family-name:var(--font-sans-var)] text-[clamp(1.15rem,2vw,1.6rem)] font-semibold leading-[1.22] tracking-[-0.022em] max-w-[22ch]">
              The object layer for the business you already run.
            </p>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.68] text-[var(--mid)]">
              Records scattered across payments, ledgers and documents are resolved into single
              objects — each carrying the date it was true, the date we learned it, and a trail back
              to the system it came from. Every workflow above it operates on the object, not the
              spreadsheet.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Link href="/arthur"
                    className="inline-flex h-11 items-center rounded-[2px] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--teal-d)]"
                    style={{ background: "var(--teal)" }}>
                How Arthur works
              </Link>
              <Link href="/work"
                    className="inline-flex h-11 items-center rounded-[2px] border border-[var(--line-2)] px-5 text-[14px] font-semibold transition-colors hover:border-[var(--ink)]">
                See the work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2 · THE SCHEMATIC — bleeds both edges ═════════════════════ */}
      <section className="border-y border-[var(--line-3)] bg-[var(--paper)]">
        <div className="relative">
          {/* The vertical rail is the detail that makes a diagram read as a
              plate in a document rather than as an illustration. */}
          <div className="absolute inset-y-0 left-0 hidden w-[30px] place-items-center border-r border-[var(--line-2)] bg-[var(--ground)] sm:grid">
            <span className="eyebrow whitespace-nowrap text-[var(--dim)]"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
              Arthur · powered by the Ontology
            </span>
          </div>
          <div className="sm:ml-[30px]">
            <Figure scene="schematic" className="block h-[clamp(320px,42vw,540px)] w-full" />
            <div className="flex flex-wrap justify-between gap-x-8 gap-y-1 border-t border-[var(--line-2)] px-4 py-2.5 sm:px-6">
              <span className="eyebrow text-[var(--dim)]">
                Fig. 01 — sources resolve to objects; workflows and analytics read the object
              </span>
              <span className="eyebrow text-[var(--dim)]">Schematic, not a screenshot</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3 · FIGURES ══════════════════════════════════════════════ */}
      <section className="bg-[var(--ground)]">
        <div className="shell grid divide-y divide-[var(--line)] md:grid-cols-4 md:divide-x md:divide-y-0">
          {figures.map((f) => (
            <div key={f.label} className="py-8 md:px-7 md:first:pl-0 md:last:pr-0" data-rise>
              <div className="tnum font-[family-name:var(--font-sans-var)] text-[clamp(2.3rem,3.8vw,3.2rem)] font-bold leading-none tracking-[-0.045em]">
                {f.k}
              </div>
              <div className="mt-3 text-[14px] font-semibold text-[var(--ink)]">{f.label}</div>
              <div className="mt-2 max-w-[32ch] text-[12.5px] leading-[1.55] text-[var(--dim)]">
                {f.source}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 4 · WHAT THE ONTOLOGY GUARANTEES ═════════════════════════ */}
      <section id="ontology" className="border-t border-[var(--line)] bg-[var(--paper)] py-[clamp(56px,7.5vw,116px)]">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-end">
            <div data-rise>
              <Eyebrow>What the ontology guarantees</Eyebrow>
              {/* Sized down from the section default: "Enforced, not promised."
                  is 23 characters and was taking a third line in this column. */}
              <h2 className="display mt-6 text-[clamp(1.9rem,3.7vw,2.95rem)]">
                Five properties.
                <br />
                <span style={{ color: "var(--dim)" }}>Enforced, not promised.</span>
              </h2>
            </div>
            <p className="max-w-[var(--measure)] text-[15.5px] leading-[1.66] text-[var(--mid)]" data-rise>
              Each of these lives in the write path rather than in a deck. That is the difference
              between a system you can report from and a system you have to check.
            </p>
          </div>

          <ol className="mt-14 border-t border-[var(--line-3)]">
            {GUARANTEES.map(([n, title, body]) => (
              <li key={n}
                  className="grid gap-x-8 gap-y-2 border-b border-[var(--line)] py-7 md:grid-cols-[56px_300px_1fr]"
                  data-rise>
                <span className="eyebrow tnum pt-1.5 text-[var(--dim)]">{n}</span>
                <h3 className="font-[family-name:var(--font-sans-var)] text-[1.2rem] font-semibold tracking-[-0.02em]">
                  {title}
                </h3>
                <p className="max-w-[58ch] text-[15px] leading-[1.65] text-[var(--mid)]">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ 5 · RESOLUTION, shown ════════════════════════════════════ */}
      <section className="border-t border-[var(--line)] bg-[var(--ground)] py-[clamp(48px,6vw,96px)]">
        <div className="shell grid items-center gap-[clamp(26px,4vw,64px)] lg:grid-cols-[0.9fr_1.1fr]">
          <div data-rise>
            <Eyebrow>Identity resolution</Eyebrow>
            <h2 className="display mt-6 text-[clamp(1.9rem,3.6vw,2.9rem)]">
              Four names.
              <br />
              <span style={{ color: "var(--dim)" }}>One company.</span>
            </h2>
            <p className="mt-6 max-w-[42ch] text-[15px] leading-[1.68] text-[var(--mid)]">
              Fourteen records arriving from four systems, collapsing onto five objects. Until this
              step exists, every figure that aggregates across systems is wrong — and coverage is
              exactly as wide as the sources connected, never wider.
            </p>
          </div>
          <div className="overflow-hidden rounded-[3px] border border-[var(--line-2)] bg-[var(--paper)]" data-rise>
            <Figure scene="bundle" className="block h-[clamp(240px,26vw,340px)] w-full" />
            <p className="eyebrow border-t border-[var(--line)] px-4 py-2.5 text-[var(--dim)]">
              Fig. 02 — 14 records · 4 source systems · 5 resolved objects
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 6 · THE REBUILDS — work for companies that are not ours ══ */}
      <section id="studies" className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--ground)] py-[clamp(56px,7.5vw,116px)]">
        <Figure scene="contour"
                className="pointer-events-none absolute inset-0 h-full w-full"
                style={{ opacity: 0.30 }} />
        <div className="shell relative">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-end">
            <div data-rise>
              <Eyebrow>Uncommissioned</Eyebrow>
              <h2 className="display mt-6 text-[clamp(2rem,4.4vw,3.5rem)]">
                Thirty-eight sites.
                <br />
                <span style={{ color: "var(--dim)" }}>Six rebuilds.</span>
              </h2>
            </div>
            <p className="max-w-[var(--measure)] text-[15.5px] leading-[1.66] text-[var(--mid)]" data-rise>
              One venture portfolio, measured end to end on page weight, Lighthouse, live search
              position and accessibility. Six of the companies were then rebuilt as running pages
              rather than described in a deck. None of it was commissioned, and every measurement
              names its source.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studies.map((s) => (
              <figure key={s.id}
                      className="group overflow-hidden rounded-[3px] border border-[var(--line-2)] bg-[var(--paper)]"
                      data-rise>
                <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--line)]">
                  <Image src={s.frame} alt={`Rebuilt ${s.sector.toLowerCase()} site, top of page`} fill
                         sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                         className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <figcaption className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="eyebrow text-[var(--dim)]">{s.id}</span>
                    <span className="eyebrow text-[var(--mid)]">{s.sector}</span>
                  </div>
                  <p className="mt-3.5 text-[13.5px] leading-[1.58] text-[var(--mid)]">{s.thesis}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-8 max-w-[78ch] text-[13px] leading-[1.6] text-[var(--dim)]">
            The companies are not named here. Each rebuild carries measured criticism of the site it
            replaces, and that belongs in a private review addressed to the company rather than on a
            marketing page. Full packages are available on request.
          </p>
        </div>
      </section>

      {/* ═══ 7 · THE ONE DARK STAGE ═══════════════════════════════════ */}
      <section className="bg-[var(--deep)] py-[clamp(56px,7.5vw,116px)] text-[var(--on-deep)]">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div data-rise>
            <p className="eyebrow flex items-center gap-2.5 text-[var(--on-deep-dim)]">
              <span className="inline-block h-[7px] w-[7px]" style={{ background: "var(--teal)" }} />
              The standard
            </p>
            <h2 className="display mt-6 text-[clamp(2rem,4.4vw,3.5rem)]">
              Confidence comes
              <br />
              <span style={{ color: "var(--on-deep-mu)" }}>from the evidence.</span>
            </h2>
            <p className="mt-7 max-w-[var(--measure)] text-[15.5px] leading-[1.66] text-[var(--on-deep-mu)]">
              This is the only dark section on the site, and it is here because this is the part
              that has to be read as a contract rather than as a pitch.
            </p>
          </div>
          <dl className="divide-y divide-[var(--deep-line)] border-y border-[var(--deep-line)]">
            {[
              ["Claims tied to sources", "Separate what the evidence shows from what still needs testing."],
              ["Completion tied to the task", "A generated answer and a working implementation are different deliverables."],
              ["Authority stays explicit", "Access, integrations and production changes follow the agreed scope and human approval."],
              ["Economics worth measuring", "Elapsed time, human effort, quality and cost per completed task, in the actual engagement."],
            ].map(([t, d], i) => (
              <div key={t} className="grid gap-x-6 gap-y-1 py-6 md:grid-cols-[44px_1fr]" data-rise>
                <span className="eyebrow tnum pt-1.5 text-[var(--on-deep-dim)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <dt className="font-[family-name:var(--font-sans-var)] text-[1.06rem] font-semibold tracking-[-0.018em]">
                    {t}
                  </dt>
                  <dd className="mt-1.5 max-w-[56ch] text-[14.5px] leading-[1.62] text-[var(--on-deep-mu)]">{d}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══ 8 · CLOSING — the prism ══════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[var(--paper)]">
        <Figure scene="prism" className="pointer-events-none absolute inset-0 h-full w-full" />
        {/* The spectrum was passing straight under the headline. A left-to-right
            veil returns the first 46% of the stage to clean paper, so the type
            sits on white and the light stays where there is nothing to read. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
             style={{ background: "linear-gradient(90deg, var(--paper) 0 34%, color-mix(in srgb, var(--paper) 55%, transparent) 46%, transparent 62%)" }} />
        <div className="shell relative py-[clamp(80px,10vw,170px)]">
          <Eyebrow>Bring us the question</Eyebrow>
          <h2 className="display mt-7 text-[clamp(2.4rem,6.4vw,5rem)]" data-rise>
            See the question.
            <br />
            <span style={{ color: "var(--teal)" }}>Build the answer.</span>
          </h2>
          <div className="mt-10 flex flex-wrap gap-2.5" data-rise>
            <Link href="/contact"
                  className="inline-flex h-12 items-center rounded-[2px] bg-[var(--ink)] px-6 text-[14.5px] font-semibold text-[var(--paper)] transition-opacity hover:opacity-90">
              Start a project
            </Link>
            <Link href="/arthur"
                  className="inline-flex h-12 items-center rounded-[2px] border border-[var(--line-2)] bg-[var(--paper)] px-6 text-[14.5px] font-semibold transition-colors hover:border-[var(--ink)]">
              Read the architecture
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
