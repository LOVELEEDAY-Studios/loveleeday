import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewControl, ReviewSubmit } from "@/components/portal/ReviewControl";
import {
  clients,
  getClient,
  reviewers,
  concepts,
  panel,
  glance,
  weightTable,
  ranking,
  recommendation,
  findings,
  fixes,
  notes,
} from "@/content/hub/holly-jolly-designs";

export const dynamicParams = false;

export function generateStaticParams() {
  return clients.map((c) => ({ token: c.token }));
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const c = getClient(token);
  return { title: c ? `${c.short}: four landing directions` : "A proposal" };
}

/* INTERNAL design review, local only (dev server :3007), not deployed, nothing sent. Same template as
   /p/dabney-ordering-concepts-v2. Approvals save to ~/.arthur/data/holly-jolly-designs-review/review.json. */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777980]">{children}</span>;
}
function Two({ a, b, size = "h2" }: { a: string; b: string; size?: "h1" | "h2" }) {
  const cls =
    size === "h1"
      ? "text-[clamp(2.6rem,6.4vw,4.6rem)] leading-[1.02] tracking-[-0.05em]"
      : "text-[clamp(2rem,4.2vw,3rem)] leading-[1.08] tracking-[-0.045em]";
  const Tag = size;
  return (
    <Tag className={`mt-4 font-medium ${cls} text-[#1d1d1f]`}>
      {a}
      <br />
      <span className="text-[#8c8e95]">{b}</span>
    </Tag>
  );
}
const EP = "/api/holly-jolly-designs-review";
const sevCls = { fix: "bg-[#fde8e8] text-[#9b1c1c]", watch: "bg-[#fff4e0] text-[#8a5a00]", good: "bg-[#e6f4ea] text-[#1e6b3a]" } as const;
const tagCls = { done: "bg-[#e6f4ea] text-[#1e6b3a]", free: "bg-[#e8f0fb] text-[#2a5a9b]", needs: "bg-[#fff4e0] text-[#8a5a00]", money: "bg-[#fde8e8] text-[#9b1c1c]" } as const;
const gradeCls = (g: string) => (g.startsWith("A") ? "text-[#1e6b3a]" : g.startsWith("B") ? "text-[#3778bc]" : g.startsWith("C") ? "text-[#8a5a00]" : "text-[#9b1c1c]");

export default async function HollyJollyDesignsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const c = getClient(token);
  if (!c) notFound();

  return (
    <div className="ll-os bg-white">
      <section className="mx-auto max-w-[1180px] px-6 pb-16 pt-16 sm:pt-24">
        <Eyebrow>
          {c.short} · prepared for {c.preparedFor}, {c.role} · design review, not deployed
        </Eyebrow>
        <Two size="h1" a={panel.hero.a} b={panel.hero.b} />
        <p className="mt-8 max-w-[46rem] text-[17px] leading-[1.7] text-[#6c7481]">{panel.hero.intro}</p>
        <div className="mt-10 flex flex-wrap gap-3 text-[14px]">
          <a href="#directions" className="rounded-full bg-[#1d1d1f] px-5 py-2.5 font-medium text-white">See the four directions</a>
          <a href="#ranking" className="rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[#1d1d1f] hover:border-[#3778bc]">Ranking and recommendation</a>
          <a href="#fixes" className="rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[#1d1d1f] hover:border-[#3778bc]">What it takes to launch</a>
        </div>
      </section>

      <section className="border-y border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-14">
          <Eyebrow>Measured, Oct 3, 2026</Eyebrow>
          <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-x-8 gap-y-8">
            {glance.map((g) => (
              <div key={g.label}>
                <div className="text-[34px] font-medium tracking-[-0.03em] text-[#1d1d1f]">{g.k}</div>
                <div className="mt-1 text-[13.5px] leading-[1.55] text-[#3f434b]">{g.label}</div>
                <div className="mt-1 text-[11px] text-[#8c8e95]">{g.src}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#dcdfe6] text-[11px] uppercase tracking-[0.08em] text-[#777980]">
                  {weightTable.columns.map((h) => (<th key={h} className="py-2 pr-4 font-semibold">{h}</th>))}
                </tr>
              </thead>
              <tbody>
                {weightTable.rows.map((r) => (
                  <tr key={r[0]} className="border-b border-[#e4e5e9] align-top text-[#3f434b]">
                    {r.map((cell, i) => (<td key={i} className={`py-2.5 pr-4 ${i === 0 ? "font-medium text-[#1d1d1f]" : ""}`}>{cell}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-14">
        <Eyebrow>The panel</Eyebrow>
        <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-6">
          {reviewers.map((r) => (
            <div key={r.id} className="rounded-2xl border border-[#e4e5e9] bg-[#fafafa] p-4">
              <div className="text-[14px] font-semibold text-[#1d1d1f]">{r.name}</div>
              <div className="mt-1 text-[12.5px] leading-[1.6] text-[#6c7481]">{r.lens}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-[60ch] text-[12.5px] leading-[1.6] text-[#8c8e95]">
          Four lenses applied by one reviewer, written independently before converging. Grades are judgment, not user research.
        </p>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-[#dcdfe6] text-[11px] uppercase tracking-[0.08em] text-[#777980]">
                <th className="py-2 pr-4 font-semibold">Direction</th>
                {reviewers.map((r) => (<th key={r.id} className="py-2 pr-4 font-semibold">{r.name}</th>))}
                <th className="py-2 pr-4 font-semibold">Converged</th>
              </tr>
            </thead>
            <tbody>
              {concepts.map((d) => (
                <tr key={d.id} className="border-b border-[#e4e5e9]">
                  <td className="py-3 pr-4 font-medium text-[#1d1d1f]">{d.n}. {d.name}</td>
                  {d.grades.map((g) => (<td key={g.who} className={`py-3 pr-4 text-[20px] font-medium ${gradeCls(g.g)}`}>{g.g}</td>))}
                  <td className={`py-3 pr-4 text-[24px] font-semibold ${gradeCls(d.overall)}`}>{d.overall}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="directions" className="mx-auto max-w-[1180px] px-6 py-8">
        {concepts.map((d, i) => (
          <article key={d.id} id={`direction-${d.n}`} className={`py-20 ${i > 0 ? "border-t border-[#e4e5e9]" : ""}`}>
            <Eyebrow>Direction {d.n} of 4 · {d.title} · converged grade {d.overall}</Eyebrow>
            <Two a={d.name} b={d.tagline} />
            <p className="mt-6 max-w-[62ch] text-[15px] leading-[1.7] text-[#5b606a]">{d.idea}</p>

            <figure className="mt-8 overflow-hidden rounded-2xl border border-[#e4e5e9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.hero} alt={`${d.name} hero, desktop 1440px`} className="w-full" />
              <figcaption className="border-t border-[#e4e5e9] bg-[#fafafa] px-4 py-2 text-[12px] text-[#8c8e95]">Hero, 1440 x 900</figcaption>
            </figure>

            <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
              <figure className="overflow-hidden rounded-2xl border border-[#e4e5e9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.desktop} alt={`${d.name} desktop, first sections`} className="w-full" />
                <figcaption className="border-t border-[#e4e5e9] bg-[#fafafa] px-4 py-2 text-[12px] text-[#8c8e95]">Desktop, top of the full page</figcaption>
              </figure>
              <figure className="mx-auto w-full max-w-[300px] self-start overflow-hidden rounded-[24px] border border-[#e4e5e9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.mobile} alt={`${d.name} phone, first sections`} className="w-full" />
                <figcaption className="border-t border-[#e4e5e9] bg-[#fafafa] px-4 py-2 text-center text-[12px] text-[#8c8e95]">Phone, 390px</figcaption>
              </figure>
            </div>

            <a href={d.live} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[14px] text-[#1d1d1f] hover:border-[#3778bc]">
              Open live design ↗
            </a>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {d.grades.map((g) => (
                <div key={g.who} className="rounded-2xl border border-[#e4e5e9] bg-[#fafafa] p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#777980]">{g.who}</span>
                    <span className={`text-[26px] font-semibold ${gradeCls(g.g)}`}>{g.g}</span>
                  </div>
                  <p className="mt-2 text-[12.5px] leading-[1.6] text-[#5b606a]">{g.why}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <p className="text-[15px] font-medium text-[#1d1d1f]">Strengths</p>
                <ul className="mt-2 grid gap-2 text-[13.5px] leading-[1.65] text-[#5b606a]">
                  {d.strengths.map((s) => (<li key={s} className="flex gap-2"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1e6b3a]" />{s}</li>))}
                </ul>
              </div>
              <div>
                <p className="text-[15px] font-medium text-[#1d1d1f]">Weaknesses</p>
                <ul className="mt-2 grid gap-2 text-[13.5px] leading-[1.65] text-[#5b606a]">
                  {d.weaknesses.map((s) => (<li key={s} className="flex gap-2"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#9b1c1c]" />{s}</li>))}
                </ul>
              </div>
            </div>
            <p className="mt-6 text-[12.5px] text-[#8c8e95]">Weight: {d.weight}</p>

            <div className="max-w-[640px]">
              <ReviewControl id={"direction-" + d.id} label={`${d.name}: ${d.title}`} endpoint={EP} submitOnEnter />
            </div>
          </article>
        ))}
      </section>

      <section id="ranking" className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-16">
          <Eyebrow>Converged ranking</Eyebrow>
          <Two a="Pop converts, Editorial impresses," b="Storybook has the idea." />
          <div className="mt-8 grid gap-3">
            {ranking.map((r) => (
              <div key={r.n} className="flex items-start gap-4 rounded-2xl border border-[#e4e5e9] bg-white p-4">
                <div className="text-[28px] font-medium text-[#8c8e95]">{r.n}</div>
                <div className="flex-1">
                  <div className="text-[15px] font-medium text-[#1d1d1f]">{r.name}</div>
                  <p className="mt-1 text-[13.5px] leading-[1.6] text-[#5b606a]">{r.why}</p>
                </div>
                <div className={`text-[26px] font-semibold ${gradeCls(r.overall)}`}>{r.overall}</div>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-2xl border border-[#3778bc] bg-white p-6">
            <Eyebrow>Recommended direction</Eyebrow>
            <h3 className="mt-3 text-[clamp(1.5rem,3vw,2.1rem)] font-medium leading-[1.15] tracking-[-0.03em] text-[#1d1d1f]">{recommendation.headline}</h3>
            <div className="mt-5 grid max-w-[70ch] gap-4">
              {recommendation.body.map((p) => (<p key={p} className="text-[14.5px] leading-[1.75] text-[#3f434b]">{p}</p>))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-16">
        <Eyebrow>Findings</Eyebrow>
        <Two a="What the evidence shows," b="per design." />
        <div className="mt-8 grid gap-3">
          {findings.map((f) => (
            <div key={f.area + f.t} className="rounded-2xl border border-[#e4e5e9] bg-[#fafafa] p-4">
              <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-medium text-[#1d1d1f]">
                <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase ${sevCls[f.sev]}`}>{f.sev}</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#777980]">{f.area}</span>
                {f.t}
              </div>
              <p className="mt-1.5 text-[13px] leading-[1.6] text-[#6c7481]">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="fixes" className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-16">
          <Eyebrow>Top fixes to reach launch quality</Eyebrow>
          <Two a="Honest answer: none is launch-ready." b="Art and photography are what is missing." />
          <p className="mt-6 max-w-[62ch] text-[14.5px] leading-[1.7] text-[#6c7481]">
            Tags: done, free (design or code only), needs (a decision or a policy from Daniel, or a build step), money (credits, commissions or samples).
          </p>
          <div className="mt-8 grid gap-3">
            {fixes.map((f) => (
              <div key={f.t} className="rounded-2xl border border-[#e4e5e9] bg-white p-4">
                <div className="flex flex-wrap items-center gap-2 text-[13.5px] font-medium text-[#1d1d1f]">
                  <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase ${tagCls[f.tag]}`}>{f.tag}</span>
                  {f.t}
                </div>
                <p className="mt-1.5 text-[13px] leading-[1.6] text-[#6c7481]">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#e4e5e9]">
        <div className="mx-auto max-w-[1180px] px-6 py-16">
          <Eyebrow>Next</Eyebrow>
          <Two a="Approve the directions worth building," b="or leave a note on any of them." />
          <p className="mt-6 max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
            Nothing here is live or spending money. Approving a direction starts the real build; it does not ship it.
          </p>
          <div className="mt-8"><ReviewSubmit endpoint={EP} /></div>
        </div>
      </section>

      <section className="border-t border-[#e4e5e9]">
        <div className="mx-auto max-w-[1180px] px-6 py-12">
          <details>
            <summary className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777980] hover:text-[#3778bc]">
              Method, sources and what could not be seen
            </summary>
            <ul className="mt-5 grid max-w-[76ch] gap-3 text-[13px] leading-[1.65] text-[#6c7481]">
              {notes.map((m) => (<li key={m}>{m}</li>))}
            </ul>
          </details>
        </div>
      </section>
    </div>
  );
}
