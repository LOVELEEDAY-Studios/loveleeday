import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { civicClients, findings, getCivic, layers, mandate, nextQuestions, strengths, themes, type Theme } from "@/content/civic/kalamazoo";
import { CivicAsk } from "@/components/civic/CivicAsk";
import { NoteForm } from "@/components/portal/NoteForm";

export const dynamicParams = false;

export function generateStaticParams() {
  return civicClients.map((c) => ({ token: c.token }));
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const c = getCivic(token);
  return { title: c ? `${c.short}: what the record shows` : "An analysis" };
}

/* Same register as the homepage and the Global Citizens analysis: system type,
   white and #f5f5f7 stages, one dark stage for trust, two-tone headlines. */

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

const ORDER: Theme[] = ["duties", "money", "records", "services", "access"];

const security = [
  { t: "Public data first", d: "The first phase uses only what the County already publishes. Nothing internal is connected until the County decides to, one system at a time." },
  { t: "The County's records stay the County's", d: "A separate, access-controlled environment for Kalamazoo County alone. No other client's data shares it, and the County can export everything and have it deleted." },
  { t: "No sale, no marketing, no AI training", d: "County data is never sold, never used to market anything, and never used to train a model. We choose AI providers under contracts that say the same." },
  { t: "Records law, respected", d: "What Arthur produces for the County can be a public record. It is kept, retrievable and retained under Michigan's records schedules, and it is FOIA-ready by design." },
  { t: "People approve, Arthur prepares", d: "Arthur drafts, flags and reminds. Anything that leaves the building, from a filing to a reply, is approved by a named person, and every action is logged with who and when." },
  { t: "Criminal justice data only on the right footing", d: "Sheriff, court and 911 systems are not touched until a deployment meets CJIS Security Policy requirements and the agencies that own the data agree." },
  { t: "Two-factor sign-in and roles", d: "Staff sign in with two-factor authentication. Roles decide who sees what, department by department." },
  { t: "Every answer shows its source", d: "Arthur links each answer to the document, vote or statute it came from, and says so when the record cannot answer. It does not guess." },
];

export default async function CivicPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const c = getCivic(token);
  if (!c) notFound();

  const verified = findings.filter((f) => f.status === "verified").length;
  const asks = findings.length - verified;

  return (
    <div className="ll-os bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-[1180px] px-6 pb-20 pt-16 sm:pt-24">
        <Eyebrow>
          {c.short} · prepared for {c.preparedFor}, {c.role}
        </Eyebrow>
        <Two size="h1" a="We read the County's public record." b="All of it." />
        <p className="mt-8 max-w-[40rem] text-[17px] leading-[1.7] text-[#6c7481]">
          Every ordinance and policy in the Document Center, the statutes that set the County&apos;s deadlines, the budget,
          the audit, the relief-fund reports, the Board&apos;s votes and each department&apos;s published results. Arthur
          read 4,383 documents and tested each against a clock set by someone else. These are first findings, made from
          the outside with public records only. They are a starting point for what Arthur can answer once it works from
          the inside.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-[14px]">
          <a href="#findings" className="rounded-full bg-[#1d1d1f] px-5 py-2.5 font-medium text-white">
            See the {findings.length} findings
          </a>
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
            The County&apos;s core financial machinery is sound. The gaps below sit around it: in publishing, in documents
            that outlived their dates, and in duties with no visible owner. That is where an intelligence layer earns its
            keep.
          </p>
        </div>
      </section>

      {/* Findings */}
      <section id="findings" className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow>What the record shows</Eyebrow>
            <Two a={`${findings.length} findings.`} b="Every one with its source." />
          </div>
          <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
            {verified} were read directly from the source. {asks} are questions only the County can answer, because the
            public record stops short. Each names the part of Arthur that would have caught it.
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
                      {f.status === "verified" ? "Verified" : "A question for the County"}
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

      {/* The questions nobody has asked */}
      <section className="border-t border-[#e4e5e9]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>This is the outside view</Eyebrow>
              <Two a="Public records answered these." b="Your own records answer the rest." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
              Every finding above came from what the County publishes. The more useful questions sit across systems that
              have never been read together, so nobody has had the time to ask them. Connected to the County&apos;s own
              records, Arthur answers them with sources, and keeps the answers current.
            </p>
          </div>
          <ol className="mt-14 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
            {nextQuestions.map((x, i) => (
              <li key={x.q} className="border-t border-[#e4e5e9] py-6">
                <span className="text-[12px] tabular-nums text-[#3778bc]">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 text-[16px] font-medium leading-[1.45] tracking-[-0.01em] text-[#1d1d1f]">{x.q}</p>
                <p className="mt-2 text-[13px] leading-[1.6] text-[#8c8e95]">Joins: {x.joins}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The Board already asked */}
      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-20">
          <Eyebrow>The Board already asked for this</Eyebrow>
          <blockquote className="mt-5 max-w-[48rem] text-[clamp(1.6rem,3.4vw,2.4rem)] font-medium leading-[1.2] tracking-[-0.035em] text-[#1d1d1f]">
            &ldquo;{mandate.quote}.&rdquo;
          </blockquote>
          <p className="mt-4 text-[14px] text-[#6c7481]">
            <a className="underline decoration-[#d5d8de] underline-offset-2 hover:text-[#3778bc]" href={mandate.url} target="_blank" rel="noreferrer">
              {mandate.source}
            </a>
            , adopted by the Board of Commissioners. What follows is one way to deliver it.
          </p>
        </div>
      </section>

      {/* The intelligence layer */}
      <section className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow>Moving forward</Eyebrow>
            <Two a="Findings are a snapshot." b="Arthur keeps watching." />
          </div>
          <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
            An intelligence layer over the systems the County already runs. It reads what is published and, when the County
            chooses, what is internal. It keeps the duties, the dollars and the documents current, and it answers in plain
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
      </section>

      {/* Ask Arthur */}
      <section id="ask" className="bg-[#f5f5f7]">
        <div className="mx-auto grid max-w-[1180px] items-start gap-12 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Ask Arthur</Eyebrow>
            <Two a="Ask it anything." b="It answers with the source." />
            <p className="mt-6 max-w-[28rem] text-[15px] leading-[1.7] text-[#6c7481]">
              This preview reads only the public record behind this page. Connected to the County&apos;s own systems, the
              same question gets the internal answer too, with the same rule: no source, no answer.
            </p>
          </div>
          <CivicAsk token={c.token} />
        </div>
      </section>

      {/* Security */}
      <section className="bg-[#111217] text-white">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow dark>Security and public trust</Eyebrow>
              <Two dark a="Built for a government." b="Accountable by design." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#a3a8b2]">
              A county holds residents&apos; records and answers to all of them. Here is how that is protected, in plain
              terms, before anything internal is shared.
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
            <Two a="Start with the public record." b="Grow from there." />
            <ol className="mt-10 grid gap-6">
              {[
                ["Walk the leadership team through it", "Forty-five minutes on the findings, with the department heads who own them. The questions for the County get answered in the room."],
                ["The statutory calendar, first", "Built from the public record alone, so it needs no internal access. The relief-fund deadline and the master plan review are on it the first week."],
                ["Clean up the record", "Current versions titled and dated, superseded ones retired, scans made searchable, broken links fixed, ahead of the April 2027 accessibility date."],
                ["Connect systems when the County is ready", "Finance, the Board's meeting system, then departments, one at a time and only with each owner's agreement."],
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
            <p className="mt-8 max-w-[34rem] text-[13px] leading-[1.65] text-[#8c8e95]">
              The County&apos;s Purchasing Manual already provides for this kind of engagement: negotiated professional services
              under section 5.07, within the Administrator&apos;s contracting authority under section 9.01.
            </p>
          </div>
          <NoteForm
            token={c.token}
            client={c.short}
            deliverables={[{ slug: "analysis", title: "County analysis" }]}
            intent="start"
            heading="Reply to us"
            blurb="Tell us when to walk the team through it, or what to look at next."
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
              <li>All sources are public. Each finding links to the document, statute, report or record it came from.</li>
              <li>The Document Center was indexed by its sequential ids (7,600 probed, 4,383 resolved, 4,084 real documents) on September 13, 2026, and re-read on September 23, 2026. Scanned PDFs were read by optical character recognition.</li>
              <li>Statutes were read from legislature.mi.gov; the Board&apos;s votes from the County&apos;s CivicClerk public data interface; population figures from the US Census Bureau (FIPS 26077).</li>
              <li>A finding marked &ldquo;A question for the County&rdquo; is one the public record cannot settle. It is not a claim that something was missed.</li>
              <li>Where the research changed its mind, the page says so: one pass took the Apportionment Commission&apos;s rules for the Board&apos;s until the scan was read.</li>
            </ul>
          </details>
        </div>
      </section>
    </div>
  );
}
