import Link from "next/link";
import type { Metadata } from "next";
import { Figure } from "@/components/graphics/Figure";

/* The product page.
   ==========================================================================

   The nav previously had no product in it -- "Products / How we build /
   Contact", where "Products" went to a list of client projects. A company whose
   whole claim is a system it built needs a page about that system, and every
   one of the reference companies captured on 2026-09-21 has one within a single
   click of the logo.

   All of the copy here is carried over from the delivered build rather than
   rewritten, because it was already careful in the way that matters: it says
   "an adapter in the architecture does not mean a live connection to your
   systems already exists", and it says the demo video is simulated. Those
   sentences are the reason the page is credible, and rewriting them in a more
   confident register would have been the single easiest way to make this site
   look bigger and be worth less.
   ========================================================================== */

export const metadata: Metadata = {
  title: "Arthur",
  description:
    "Arthur is an intelligence software architecture: persistent memory, identity resolution, a bitemporal record, lineage on every value, and tool execution with verification.",
  alternates: { canonical: "https://loveleedaystudios.com/arthur" },
};

const COMPONENTS = [
  {
    n: "01",
    title: "Persistent memory",
    lead: "Context that can outlast a conversation.",
    body: "Journals, events and objects are stored and indexed. Retrieval makes what was stored available to the execution paths that use it, so a project carries its own history rather than being re-briefed each time.",
    chain: ["Project history", "Memory fabric", "Retrieved context"],
    why: "Projects need continuity. Prior decisions and constraints should inform the next piece of work. Recall coverage and integration vary by execution path.",
  },
  {
    n: "02",
    title: "Identity resolution",
    lead: "Four names, one company.",
    body: "A payments customer, a vendor id in the ledger, a string in an email signature and a line in a PDF are four records and one object. Resolution collapses them, so a question is asked about the object rather than about whichever string a source happened to use.",
    chain: ["Source records", "Resolver", "One object"],
    why: "Every figure that aggregates across systems is wrong until this step exists. Coverage is exactly as wide as the connected sources, and no wider.",
  },
  {
    n: "03",
    title: "Bitemporal record",
    lead: "What was true, and what we knew.",
    body: "Each property carries when it was valid in the world and when it was observed. You can ask what was true on a date, or what was known on a date — two different questions that most systems collapse into one.",
    chain: ["Valid from", "Observed at", "As known at"],
    why: "Judging an August decision with September knowledge is look-ahead bias, and it is the default mistake. Making the two timelines separate is what stops it happening quietly.",
  },
  {
    n: "04",
    title: "Lineage on every value",
    lead: "A number with no trail is not reportable.",
    body: "Writing a property requires the source system and the source reference. The trail can be printed for any value, back to the record it came from.",
    chain: ["Source system", "Source reference", "Full trail"],
    why: "This is mechanical claim verification rather than a promise to be careful. The refusal is in the write path, so it cannot be forgotten under time pressure.",
  },
  {
    n: "05",
    title: "Tools, routing and verification",
    lead: "Execution that has to prove it ran.",
    body: "Models route to the work, tools execute against real systems, and results are checked against an observed proof string before anything is reported as done.",
    chain: ["Route", "Execute", "Observe proof"],
    why: "An HTTP 200 is not evidence that the thing you asked for happened. Work closes on a value read back out of the system that was supposed to change.",
  },
];

const APPLICATIONS = [
  {
    tag: "Software & operations",
    question: "“Why does this process still depend on five spreadsheets and a manual handoff?”",
    body: "Examine the workflow, identify the decisions and dependencies, and turn the right part of the process into software.",
    produces: [
      "Workflow and requirements map",
      "Internal tool or customer-facing application",
      "Automation and integration plan",
      "Tested changes and rollout documentation",
    ],
  },
];

const FAQ = [
  [
    "Is Arthur a model, an agent, or a software platform?",
    "Arthur is an intelligence software architecture. Its components surround model reasoning with persistent memory, task scheduling, tools, routing, and evaluation. Models are part of the system; the configuration determines which capabilities a workflow can use.",
  ],
  [
    "Can Arthur work with our existing systems?",
    "We assess your data, APIs, permissions, and requirements before committing to an integration. An adapter in the architecture does not mean a live connection to your systems already exists.",
  ],
  [
    "What can we ask LOVELEEDAY Studios to build?",
    "Custom applications, workflow tools, research and decision support, digital experiences, and connected creative deliverables. We agree on a specific scope and acceptance criteria around the business problem.",
  ],
  [
    "Does Arthur improve itself automatically?",
    "Arthur includes evaluation and training-governance components. These support candidate assessment and human promotion decisions. We do not claim unrestricted self-improvement or automatic quality gains.",
  ],
  [
    "Is the demonstration video actual execution footage?",
    "No. It is a simulated product walkthrough using fictional companies. An engagement needs its own real evidence, timing, costs, and acceptance checks.",
  ],
];

export default function ArthurPage() {
  return (
    <>
      {/* ── masthead ─────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--line)] bg-[var(--ground)] pt-[clamp(48px,6vw,88px)] pb-0">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="eyebrow flex items-center gap-2.5 text-[var(--dim)]">
              <span className="inline-block h-[7px] w-[7px]" style={{ background: "var(--teal)" }} />
              Arthur — intelligence architecture
            </p>
            <h1 className="display display-lg mt-7">
              Built to connect.
              <br />
              <span style={{ color: "var(--dim)" }}>Designed to act.</span>
            </h1>
          </div>
          <div className="max-w-[var(--measure)] self-end">
            <p className="text-[1.05rem] leading-[1.6] text-[var(--mid)]">
              Arthur&rsquo;s codebase brings together the foundations for remembering context,
              resolving who and what a record refers to, coordinating work, selecting models, and
              acting through tools.
            </p>
            <p className="mt-4 text-[15px] leading-[1.6] text-[var(--dim)]">
              These are implemented architectural components, not a claim that every component runs
              in every workflow. We scope and validate the configuration for each engagement.
            </p>
          </div>
        </div>
        {/* The lattice, not a stock photograph. A product page for a system with
            no physical form still needs an object, and a structure with a hard
            silhouette is the closest honest equivalent. */}
        <div className="shell mt-[clamp(24px,3vw,44px)]">
          <Figure scene="lattice" className="block h-[clamp(220px,26vw,360px)] w-full" />
          <p className="eyebrow border-t border-[var(--line)] py-2.5 text-[var(--dim)]">
            Fig. 03 — a 5&times;5&times;5 lattice, lit and depth-sorted in the browser. No 3D library.
          </p>
        </div>
      </section>

      {/* ── the five components ──────────────────────────────────────── */}
      <section id="architecture" className="bg-[var(--paper)] py-[clamp(64px,8vw,116px)]">
        <div className="shell space-y-px">
          {COMPONENTS.map((c) => (
            <article
              key={c.n}
              className="grid gap-x-10 gap-y-6 border-t border-[var(--line)] py-11 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]"
              data-rise
            >
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="eyebrow tnum text-[var(--dim)]">{c.n}</span>
                  <h2 className="text-[1.3rem] font-semibold tracking-[-0.025em]">{c.title}</h2>
                </div>
                <p className="mt-4 text-[1.22rem] leading-[1.28] font-medium tracking-[-0.022em] text-[var(--ink)]">
                  {c.lead}
                </p>
              </div>

              <div className="max-w-[62ch]">
                <p className="text-[15.5px] leading-[1.62] text-[var(--mid)]">{c.body}</p>

                {/* The chain. Three cells and two arrows -- it is the shape of
                    the mechanism, and it does more work than a diagram would. */}
                <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-[var(--line)] py-3.5">
                  {c.chain.map((step, i) => (
                    <span key={step} className="flex items-center gap-4">
                      <span className="eyebrow text-[var(--mid)]">{step}</span>
                      {i < c.chain.length - 1 && (
                        <span aria-hidden="true" className="text-[var(--line-2)]">
                          &rarr;
                        </span>
                      )}
                    </span>
                  ))}
                </div>

                <p className="mt-5 max-w-[60ch] text-[13.5px] leading-[1.6] text-[var(--dim)]">
                  <span className="eyebrow mr-2 text-[var(--dim)]">Why it matters</span>
                  {c.why}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── the demo, on the dark stage ──────────────────────────────── */}
      <section id="demo" className="bg-[var(--deep)] py-[clamp(64px,8vw,116px)] text-[var(--on-deep)]">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div data-rise>
              <p className="eyebrow flex items-center gap-2.5 text-[var(--on-deep-dim)]">
                <span className="inline-block h-[7px] w-[7px]" style={{ background: "var(--teal)" }} />
                Watch the work unfold
              </p>
              <h2 className="display display-lg mt-6">Arthur, in motion.</h2>
            </div>
            <p className="max-w-[var(--measure)] self-end text-[1.02rem] leading-[1.6] text-[var(--on-deep-mu)]" data-rise>
              Follow a portfolio review through parallel research, proposed changes, a website
              preview, and a verification step.
            </p>
          </div>

          <figure
            className="mt-12 overflow-hidden rounded-[6px] border border-[var(--deep-line)] bg-[var(--deep-2)]"
            data-rise
          >
            <video
              controls
              preload="none"
              poster="/studio/arthur-poster.jpg"
              className="block aspect-video w-full bg-black"
            >
              <source src="/studio/arthur-demo.mp4" type="video/mp4" />
              <track kind="captions" src="/studio/captions.vtt" srcLang="en" label="English" default />
            </video>
            <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-[var(--deep-line)] px-5 py-3.5">
              <span className="eyebrow text-[var(--teal)]">Simulated demonstration</span>
              <span className="text-[12.5px] text-[var(--on-deep-mu)]">
                Fictional companies. Simulated interface and outcomes. Silent video with on-screen
                text — a workflow illustration, not a measured execution claim.
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── applications ─────────────────────────────────────────────── */}
      <section className="bg-[var(--ground)] py-[clamp(64px,8vw,116px)]">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div data-rise>
              <p className="eyebrow flex items-center gap-2.5 text-[var(--dim)]">
                <span className="inline-block h-[7px] w-[7px]" style={{ background: "var(--teal)" }} />
                What this opens up
              </p>
              <h2 className="display display-lg mt-6">
                The applications
                <br />
                <span style={{ color: "var(--dim)" }}>are the point.</span>
              </h2>
            </div>
            <p className="max-w-[var(--measure)] self-end text-[1.02rem] leading-[1.6] text-[var(--mid)]" data-rise>
              Start with the business problem. Define the evidence, the deliverable, and what
              success should look like.
            </p>
          </div>

          {APPLICATIONS.map((a) => (
            <div
              key={a.tag}
              className="mt-12 grid gap-x-12 gap-y-8 border-t border-[var(--line-2)] pt-10 lg:grid-cols-2"
              data-rise
            >
              <div>
                <p className="eyebrow text-[var(--dim)]">The business question</p>
                <p className="mt-4 text-[1.35rem] leading-[1.32] font-medium tracking-[-0.022em]">
                  {a.question}
                </p>
                <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.62] text-[var(--mid)]">
                  {a.body}
                </p>
              </div>
              <div>
                <p className="eyebrow text-[var(--dim)]">A scoped engagement can produce</p>
                <ul className="mt-4 border-t border-[var(--line)]">
                  {a.produces.map((p) => (
                    <li
                      key={p}
                      className="border-b border-[var(--line)] py-3.5 text-[15px] text-[var(--ink)]"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[12.5px] text-[var(--dim)]">
                  Integrations require approved access, compatible APIs, and implementation.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-[var(--paper)] py-[clamp(64px,8vw,116px)]">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <div data-rise>
            <p className="eyebrow text-[var(--dim)]">Looking closer</p>
            <h2 className="display display-md mt-5">
              Good questions
              <br />
              are welcome.
            </h2>
          </div>
          <div className="border-t border-[var(--line)]">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group border-b border-[var(--line)] py-5">
                <summary className="flex cursor-pointer list-none items-start gap-4 text-[1.02rem] font-medium tracking-[-0.015em]">
                  <span
                    aria-hidden="true"
                    className="mt-[7px] inline-block shrink-0 text-[10px] text-[var(--teal)] transition-transform duration-300 group-open:rotate-90"
                  >
                    &#9654;
                  </span>
                  {q}
                </summary>
                <p className="mt-3 max-w-[66ch] pl-8 text-[15px] leading-[1.62] text-[var(--mid)]">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-[var(--ground)] py-[clamp(72px,9vw,128px)]">
        <div className="shell">
          <h2 className="display text-[clamp(2.2rem,5.4vw,4.2rem)]" data-rise>
            Bring us the question.
          </h2>
          <div className="mt-9 flex flex-wrap gap-3" data-rise>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-[3px] bg-[var(--ink)] px-6 text-[14.5px] font-semibold text-[var(--paper)] transition-opacity hover:opacity-90"
            >
              Start a project
            </Link>
            <Link
              href="/work"
              className="inline-flex h-12 items-center rounded-[3px] border border-[var(--line-2)] px-6 text-[14.5px] font-semibold transition-colors hover:border-[var(--ink)]"
            >
              See what we&rsquo;ve shipped
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
