import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  begin,
  findings,
  getNow,
  hero,
  layers,
  nextQuestions,
  nowClients,
  proof,
  security,
  sources,
  strengths,
  strengthsNote,
  themeOrder,
  themes,
} from "@/content/hub/nowkalamazoo";
import { CivicAsk } from "@/components/civic/CivicAsk";
import { NoteForm } from "@/components/portal/NoteForm";

/* built-from-reference: /p/hub/[token] (Startup Zoo). Same sections in the same order: headline,
   strengths band, sourced findings, proof already running, the intelligence layer and its questions,
   Ask Arthur, trust (dark), how we would begin with the reply form, sources. Local only until Daniel
   sets PORTAL_TOKEN_NOWKALAMAZOO on the host. */

export const dynamicParams = false;

export function generateStaticParams() {
  return nowClients.map((c) => ({ token: c.token }));
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const c = getNow(token);
  return { title: c ? `${c.short}: what Arthur found, and what comes next` : "A proposal", robots: { index: false } };
}

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

export default async function NowKalamazooPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const c = getNow(token);
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
        <Two size="h1" a={hero.a} b={hero.b} />
        <p className="mt-8 max-w-[40rem] text-[17px] leading-[1.7] text-[#6c7481]">{hero.lede}</p>
        <div className="mt-10 flex flex-wrap gap-3 text-[14px]">
          <a href="#findings" className="rounded-full bg-[#1d1d1f] px-5 py-2.5 font-medium text-white">
            See the {findings.length} findings
          </a>
          <a href={`/p/nowkalamazoo/${c.token}/dashboard`} className="rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[#1d1d1f] hover:border-[#3778bc]">
            See this morning, with Arthur
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
              <div key={s.k + s.label}>
                <div className="text-[clamp(1.8rem,3.4vw,2.4rem)] font-medium tracking-[-0.04em] text-[#1d1d1f]">{s.k}</div>
                <div className="mt-1 text-[14px] leading-[1.55] text-[#4a4d55]">{s.label}</div>
                <div className="mt-1 text-[12px] text-[#8c8e95]">{s.src}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[44rem] text-[14px] leading-[1.7] text-[#6c7481]">{strengthsNote}</p>
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
            {verified} were read directly from the source. {asks} are questions only the newsroom can answer. Each names the
            part of Arthur that would keep it from happening again.
          </p>
        </div>

        {themeOrder.map((t) => {
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

      {/* Proof already running */}
      <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>{proof.eyebrow}</Eyebrow>
              <Two a={proof.a} b={proof.b} />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">{proof.line}</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {proof.items.map((p) => (
              <div key={p.k} className="rounded-2xl border border-[#e4e5e9] bg-white p-6">
                <h3 className="text-[17px] font-medium text-[#1d1d1f]">{p.k}</h3>
                <p className="mt-2 text-[14px] leading-[1.65] text-[#5b606a]">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The intelligence layer */}
      <section className="border-t border-[#e4e5e9]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>Arthur for the newsroom</Eyebrow>
              <Two a="An intelligence layer" b="for a local newsroom." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
              It reads what the newsroom already watches and already runs, keeps sources, meetings, readers and funders in one
              record, and answers in plain words with the source attached. Reporters still report. Arthur does the watching.
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
                Connected to the newsroom&apos;s own tools and the public record, Arthur answers these with the documents behind them.
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
              This preview knows what is on this page. Connected to the newsroom&apos;s tools, the same question gets the inside
              answer, with the same rule a good editor has: no source, no answer.
            </p>
          </div>
          <CivicAsk
            token={c.token}
            endpoint="/api/nowkalamazoo/ask"
            source="NowKalamazoo proposal"
            presets={[
              "What would Arthur do in the first 30 days?",
              "How would Arthur help us cover more meetings?",
              "How would this help with funders and sponsors?",
              "Does Arthur write our stories?",
              "Who owns our sources and reader data?",
            ]}
            placeholder="Ask anything about the proposal"
            inputLabel="Ask Arthur a question about the NowKalamazoo proposal"
            reading="Arthur is working on"
          />
        </div>
      </section>

      {/* Trust */}
      <section className="bg-[#111217] text-white">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow dark>Independence and sources</Eyebrow>
              <Two dark a="Readers trust the newsroom." b="Arthur keeps it that way." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#a3a8b2]">
              A newsroom&apos;s sources, drafts and donors are the most sensitive things it holds, and its independence is the whole
              product. Here is how both are handled.
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
            <Two a={begin.a} b={begin.b} />
            <ol className="mt-10 grid gap-6">
              {begin.steps.map(([t, d], i) => (
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
            deliverables={[{ slug: "analysis", title: "NowKalamazoo proposal" }]}
            intent="start"
            heading="Reply to us"
            blurb="Tell us which beat to start with, or when to walk the newsroom through it."
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
              {sources.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </details>
        </div>
      </section>
    </div>
  );
}
