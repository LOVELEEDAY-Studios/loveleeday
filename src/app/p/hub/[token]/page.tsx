import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findings, getHub, hubClients, layers, nextQuestions, proof, strengths, themes, type Theme } from "@/content/hub/startupzoo";
import { CivicAsk } from "@/components/civic/CivicAsk";
import { BeforeAfter } from "@/components/portal/BeforeAfter";
import { NoteForm } from "@/components/portal/NoteForm";

export const dynamicParams = false;

export function generateStaticParams() {
  return hubClients.map((c) => ({ token: c.token }));
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const c = getHub(token);
  return { title: c ? `${c.short}: what Arthur found, and what comes next` : "A proposal" };
}

/* Same register as the County and Elemental pages. This one is written by a member of the Zoo,
   so it leads with what works and speaks as "we". */

function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`block text-[10px] font-semibold uppercase tracking-[0.16em] ${dark ? "text-[#9ea3ad]" : "text-[#777980]"}`}>
      {children}
    </span>
  );
}

function Two({ a, b, dark, size = "h2" }: { a: string; b: string; dark?: boolean; size?: "h1" | "h2" }) {
  const cls =
    size === "h1"
      ? "text-[clamp(2.6rem,6.4vw,4.6rem)] leading-[1.02] tracking-[-0.05em]"
      : "text-[clamp(2rem,4.2vw,3rem)] leading-[1.08] tracking-[-0.045em]";
  const Tag = size;
  return (
    <Tag className={`mt-4 font-medium ${cls} ${dark ? "text-white" : "text-[#1d1d1f]"}`}>
      {a}
      <br />
      <span className={dark ? "text-[#8e8d99]" : "text-[#8c8e95]"}>{b}</span>
    </Tag>
  );
}

const ORDER: Theme[] = ["front", "impact", "programs", "records"];

const security = [
  { t: "Founders' information stays the Zoo's", d: "Applications, pitch decks, resident metrics and investor notes sit in a separate environment for Startup Zoo alone. You can export everything and have it deleted." },
  { t: "Founders choose what they share", d: "A resident's own numbers are read only with that founder's permission, and they can see what Arthur holds about them." },
  { t: "No sale, no training", d: "Nothing is sold, used for marketing, or used to train a model. We choose AI providers under contracts that say the same." },
  { t: "People approve, Arthur prepares", d: "Arthur drafts the report, the post and the introduction. A person on your team approves anything that leaves, and every action is logged." },
];

export default async function HubPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const c = getHub(token);
  if (!c) notFound();

  const verified = findings.filter((f) => f.status === "verified").length;
  const asks = findings.length - verified;
  // The homepage rebuild appears the moment its files exist in public/.
  const pub = (p: string) => fs.existsSync(path.join(process.cwd(), "public", p));
  const hasRebuild = !!c.studyToken && pub("portal/startupzoo/index.html") && pub("portal/startupzoo/img/after-top.jpg");
  const rebuild = `/portal/startupzoo/index.html?k=${c.studyToken ?? ""}`;

  return (
    <div className="ll-os bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-[1180px] px-6 pb-20 pt-16 sm:pt-24">
        <Eyebrow>
          {c.short} · prepared for {c.preparedFor}, {c.role}
        </Eyebrow>
        <Two size="h1" a="From inside the Zoo." b="What Arthur found." />
        <p className="mt-8 max-w-[40rem] text-[17px] leading-[1.7] text-[#6c7481]">
          Dabney & Co is one of your residents, and Dabney runs on Arthur. So we pointed Arthur at the Zoo: every page of
          startupzoo.org, the Summit, the pitch listings and the public record. These are first findings from the outside,
          read on September 23, 2026, the day after the Summit. The more useful work starts once Arthur works from the
          inside.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-[14px]">
          <a href="#findings" className="rounded-full bg-[#1d1d1f] px-5 py-2.5 font-medium text-white">
            See the {findings.length} findings
          </a>
          {hasRebuild && (
            <a href="#rebuild" className="rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[#1d1d1f] hover:border-[#3778bc]">
              See the new homepage
            </a>
          )}
          <a href="#ask" className="rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[#1d1d1f] hover:border-[#3778bc]">
            Ask Arthur
          </a>
        </div>
      </section>

      {/* What already works */}
      <section className="border-y border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-14">
          <Eyebrow>Start with what works</Eyebrow>
          <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-6">
            {strengths.map((s) => (
              <div key={s.k}>
                <div className="text-[clamp(1.8rem,3.4vw,2.4rem)] font-medium tracking-[-0.04em] text-[#1d1d1f]">{s.k}</div>
                <div className="mt-1 text-[14px] leading-[1.55] text-[#4a4d55]">{s.label}</div>
                <div className="mt-1 text-[12px] text-[#8c8e95]">{s.src}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[44rem] text-[14px] leading-[1.7] text-[#6c7481]">
            The Zoo does the hard part: it puts founders in front of capital, in person, every other month. What it does not
            yet do is show it. The findings below are almost all about the proof, not the work.
          </p>
        </div>
      </section>

      {/* Findings */}
      <section id="findings" className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow>What we found</Eyebrow>
            <Two a={`${findings.length} findings.`} b="Every one with its source." />
          </div>
          <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
            {verified} were read directly from the source. {asks} are questions only the Zoo can answer. Each names the part
            of Arthur that would keep it from happening again.
          </p>
        </div>

        {ORDER.map((t) => {
          const list = findings.filter((f) => f.theme === t);
          if (!list.length) return null;
          return (
            <div key={t} className="mt-16">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#e4e5e9] pb-3">
                <h3 className="text-[20px] font-medium tracking-[-0.02em] text-[#1d1d1f]">
                  {themes[t].name} <span className="text-[#8c8e95]">· {list.length}</span>
                </h3>
                <span className="text-[13px] text-[#8c8e95]">{themes[t].line}</span>
              </div>
              <ol className="grid gap-x-10 md:grid-cols-2">
                {list.map((f) => (
                  <li key={f.title} className="border-b border-[#eef0f3] py-7">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        f.status === "verified" ? "bg-[#eaf2fb] text-[#2d6aa8]" : "bg-[#f4efe6] text-[#8a6420]"
                      }`}
                    >
                      {f.status === "verified" ? "Verified" : "Worth confirming"}
                    </span>
                    <h4 className="mt-3 text-[17px] font-medium leading-[1.4] tracking-[-0.015em] text-[#1d1d1f]">{f.title}</h4>
                    <p className="mt-2 text-[14px] leading-[1.7] text-[#5b606a]">{f.detail}</p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px]">
                      <a className="text-[#3778bc] underline decoration-[#cfe0f2] underline-offset-2" href={f.src.url} target="_blank" rel="noreferrer">
                        {f.src.label}
                      </a>
                      <span className="text-[#8c8e95]">Arthur: {f.catches}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </section>

      {/* The rebuild: shown once it exists */}
      {hasRebuild && (
        <section id="rebuild" className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
          <div className="mx-auto max-w-[1180px] px-6 py-24">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
              <div>
                <Eyebrow>The front door</Eyebrow>
                <Two a="Your homepage, rebuilt." b="Drag to compare." />
              </div>
              <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
                The same Zoo, told with its proof: the Summit, Pitch Night and the residents up front, the results where a
                funder looks for them, and a page that loads in a second. Both screens at 1440 by 900.
              </p>
            </div>
            <div className="mt-10 overflow-hidden rounded-2xl border border-[#e4e5e9] bg-white">
              <BeforeAfter
                before="/portal/startupzoo/img/before-top.jpg"
                after="/portal/startupzoo/img/after-top.jpg"
                label="Startup Zoo homepage today and rebuilt"
                beforeCaption="Today"
                afterCaption="Rebuilt"
              />
            </div>
            <a href={rebuild} className="mt-8 inline-block rounded-full bg-[#1d1d1f] px-5 py-2.5 text-[14px] font-medium text-white">
              Open the new homepage
            </a>
          </div>
        </section>
      )}

      {/* Proof from a resident */}
      <section className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow>Already running in the building</Eyebrow>
            <Two a="One of your residents" b="runs on Arthur today." />
          </div>
          <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
            Dabney & Co, 2024–2025 cohort, uses Arthur every day. The same layer could sit under every resident as a member
            benefit, and under the Zoo itself.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {proof.map((p) => (
            <div key={p.k} className="rounded-2xl border border-[#e4e5e9] p-6">
              <h3 className="text-[17px] font-medium text-[#1d1d1f]">{p.k}</h3>
              <p className="mt-2 text-[14px] leading-[1.65] text-[#5b606a]">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The intelligence layer */}
      <section className="border-t border-[#e4e5e9]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>Arthur for the Zoo</Eyebrow>
              <Two a="An intelligence layer" b="for an entrepreneurship hub." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
              It reads the tools the Zoo already runs, keeps founders, funders and dollars in one record, and answers in plain
              words with the source attached.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {layers.map((l, i) => (
              <div key={l.name} className="rounded-2xl border border-[#e4e5e9] p-6">
                <span className="text-[12px] tabular-nums text-[#3778bc]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-[18px] font-medium tracking-[-0.015em] text-[#1d1d1f]">{l.name}</h3>
                <p className="mt-2 text-[14px] leading-[1.65] text-[#5b606a]">{l.does}</p>
                <p className="mt-4 border-t border-[#eef0f3] pt-3 text-[13px] leading-[1.6] text-[#7d8088]">
                  <span className="text-[#1d1d1f]">Would have caught:</span> {l.would}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Eyebrow>Questions nobody has time to ask</Eyebrow>
              <p className="mt-4 max-w-[26rem] text-[15px] leading-[1.7] text-[#6c7481]">
                Connected to the Zoo&apos;s own tools, Arthur answers these with the numbers behind them.
              </p>
            </div>
            <ol className="grid gap-0">
              {nextQuestions.map((x, i) => (
                <li key={x.q} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-[#e4e5e9] py-4">
                  <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                  <span>
                    <span className="block text-[16px] leading-[1.5] text-[#1d1d1f]">{x.q}</span>
                    <span className="mt-1 block text-[13px] text-[#8c8e95]">Joins: {x.joins}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Ask Arthur */}
      <section id="ask" className="bg-[#f5f5f7]">
        <div className="mx-auto grid max-w-[1180px] items-start gap-12 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Ask Arthur</Eyebrow>
            <Two a="Ask it anything." b="It answers with the source." />
            <p className="mt-6 max-w-[28rem] text-[15px] leading-[1.7] text-[#6c7481]">
              This preview knows what is on this page. Connected to the Zoo&apos;s tools, the same question gets the inside
              answer, with the same rule: no source, no answer.
            </p>
          </div>
          <CivicAsk
            token={c.token}
            endpoint="/api/hub/ask"
            source="Startup Zoo proposal"
            presets={[
              "What would Arthur do in the first 30 days?",
              "How would we show funders our impact?",
              "How would Arthur help residents raise?",
              "What should we fix on the site first?",
              "Who owns founders' data?",
            ]}
            placeholder="Ask anything about the proposal"
            inputLabel="Ask Arthur a question about the Startup Zoo proposal"
            reading="Arthur is working on"
          />
        </div>
      </section>

      {/* Trust */}
      <section className="bg-[#111217] text-white">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow dark>Founders&apos; trust</Eyebrow>
              <Two dark a="Founders trust the Zoo." b="Arthur keeps it that way." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#a3a8b2]">
              Decks, numbers and investor conversations are the most sensitive things a founder shares. Here is how they are
              handled.
            </p>
          </div>
          <div className="mt-14 grid gap-x-10 md:grid-cols-2">
            {security.map((x, i) => (
              <div key={x.t} className="border-t border-[#2a2c33] py-8">
                <span className="text-[11px] tabular-nums text-[#6f7480]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[18px] font-medium leading-[1.35] tracking-[-0.015em]">{x.t}</h3>
                <p className="mt-3 text-[14px] leading-[1.75] text-[#a3a8b2]">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we would begin */}
      <section id="next" className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow>How we would begin</Eyebrow>
            <Two a="Before Pitch Night." b="Then the new space." />
            <ol className="mt-10 grid gap-6">
              {[
                ["Fix the front door this week", "The title, the heavy images, the old dates and the broken summit link. Then the Summit recap, while it is still news."],
                ["One record for every founder", "Every applicant, pitch, vote, resident and alumnus pulled from the forms, Eventbrite, Luma and HubSpot, before the November 13 Pitch Night."],
                ["The first impact report", "What the Zoo has awarded and what its founders did next, with a source for every figure, ready for sponsors and funders."],
                ["Open the new space on Arthur", "Bookings, memberships, the grant database and resident metrics, live on day one."],
              ].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                  <span>
                    <span className="block text-[16px] text-[#1d1d1f]">{t}</span>
                    <span className="mt-1 block text-[14px] leading-[1.65] text-[#7d8088]">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <NoteForm
            token={c.token}
            client={c.short}
            deliverables={[{ slug: "analysis", title: "Startup Zoo proposal" }]}
            intent="start"
            heading="Reply to us"
            blurb="Tell us what to fix first, or when to walk the team through it."
          />
        </div>
      </section>

      {/* Sources */}
      <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-12">
          <details>
            <summary className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777980] hover:text-[#3778bc]">
              Sources and method
            </summary>
            <ul className="mt-5 grid max-w-[72ch] gap-2 text-[13px] leading-[1.6] text-[#6c7481]">
              <li>Every page of startupzoo.org was read in Chromium on September 23, 2026, with each network response counted.</li>
              <li>Tax-exempt status and address from the IRS exempt organizations data, via ProPublica&apos;s Nonprofit Explorer (EIN 46-4930151).</li>
              <li>Event details from the Zoo&apos;s own Summit and Pitch pages and its Eventbrite listing.</li>
              <li>Residency numbers in the Braintrust update come from Carl Brown&apos;s June 22, 2026 email to the Braintrust, which Daniel received as a member.</li>
              <li>A finding marked &ldquo;Worth confirming&rdquo; is one the public record cannot settle. It is not a claim that something was missed.</li>
            </ul>
          </details>
        </div>
      </section>
    </div>
  );
}
