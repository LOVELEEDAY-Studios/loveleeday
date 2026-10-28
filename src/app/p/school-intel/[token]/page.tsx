import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewControl, ReviewSubmit } from "@/components/portal/ReviewControl";
import { copy, eagle, findings, fixes, getSysClient, glance, grades, hero, method, model, savings, pattern, projection, sysClients, type Sev } from "@/content/hub/school-intel";

export const dynamicParams = false;

export function generateStaticParams() {
  return sysClients.map((c) => ({ token: c.token }));
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const c = getSysClient(token);
  return { title: c ? `${c.short}: program review` : "A proposal" };
}

/* INTERNAL review on the hub template (local only, not deployed). */

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

const SEV: Record<Sev, { label: string; cls: string }> = {
  fix: { label: "Fix", cls: "bg-[#fdecea] text-[#a1291f]" },
  watch: { label: "Watch", cls: "bg-[#fff4e0] text-[#8a5a00]" },
  good: { label: "Working", cls: "bg-[#e6f4ea] text-[#1e6b3a]" },
};
const TAG = {
  done: { label: "Done", cls: "bg-[#1d1d1f] text-white" },
  free: { label: "Free", cls: "bg-[#e6f4ea] text-[#1e6b3a]" },
  needs: { label: "Needs your call", cls: "bg-[#eaf2fb] text-[#2d6aa8]" },
  money: { label: "Spend", cls: "bg-[#fff4e0] text-[#8a5a00]" },
} as const;
const EP = "/api/school-intel-review";
const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);
const GRADE_CLS = (g: string) => (g.startsWith("D") || g.startsWith("F") ? "text-[#a1291f]" : g.startsWith("C") ? "text-[#8a5a00]" : "text-[#1e6b3a]");

export default async function SchoolIntelPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const c = getSysClient(token);
  if (!c) notFound();

  return (
    <div className="ll-os bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-[1180px] px-6 pb-20 pt-16 sm:pt-24">
        <Eyebrow>
          {c.short} · prepared for {c.preparedFor}, {c.role}
        </Eyebrow>
        <Two size="h1" a={hero.a} b={hero.b} />
        <p className="mt-8 max-w-[40rem] text-[17px] leading-[1.7] text-[#6c7481]">
          {hero.lead}
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-[14px]">
          <a href="#findings" className="rounded-full bg-[#1d1d1f] px-5 py-2.5 font-medium text-white">
            See what Arthur would have flagged
          </a>
          <a href="#model" className="rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[#1d1d1f] hover:border-[#3778bc]">
            How Arthur works in a school
          </a>
        </div>
      </section>

      {/* At a glance */}
      <section className="border-y border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-14">
          <Eyebrow>At a glance · {copy.glanceDate}</Eyebrow>
          <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {glance.map((s) => (
              <div key={s.k + s.label}>
                <div className="text-[clamp(1.8rem,3.4vw,2.4rem)] font-medium tracking-[-0.04em] text-[#1d1d1f]">{s.k}</div>
                <div className="mt-1 text-[14px] leading-[1.55] text-[#4a4d55]">{s.label}</div>
                <div className="mt-1 text-[12px] text-[#8c8e95]">{s.src}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grades */}
      <section className="mx-auto max-w-[1180px] px-6 py-20">
        <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-end">
          <div>
            <Eyebrow>Area by area</Eyebrow>
            <Two a={copy.gradesHead[0]} b={copy.gradesHead[1]} />
          </div>
          <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
            {copy.gradesLead}
          </p>
        </div>
        <div className="mt-10 divide-y divide-[#eef0f3] border-y border-[#e4e5e9]">
          {grades.map((g) => (
            <div key={g.area} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 py-5 md:grid-cols-[16rem_4rem_1fr]">
              <span className="text-[17px] font-medium text-[#1d1d1f]">{g.area}</span>
              <b className={`text-[20px] font-semibold tabular-nums ${GRADE_CLS(g.grade)}`}>{g.grade}</b>
              <span className="col-span-2 text-[14px] leading-[1.65] text-[#5b606a] md:col-span-1">{g.why}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Findings */}
      <section id="findings" className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>The training case</Eyebrow>
              <Two a={copy.findingsHead[0]} b={copy.findingsHead[1]} />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
              {copy.findingsLead}
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {findings.map((f) => (
              <article key={f.t} className="rounded-2xl border border-[#e4e5e9] bg-white p-6">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className={`rounded-full px-2.5 py-0.5 font-medium ${SEV[f.sev].cls}`}>{SEV[f.sev].label}</span>
                  <span className="uppercase tracking-[0.12em] text-[#8c8e95]">{f.area}</span>
                </div>
                <h3 className="mt-3 text-[17px] font-medium leading-[1.4] text-[#1d1d1f]">{f.t}</h3>
                <p className="mt-2 text-[14px] leading-[1.65] text-[#5b606a]">{f.d}</p>
                {f.sev !== "good" && <ReviewControl id={"f-" + slug(f.t)} label={f.t} endpoint={EP} submitOnEnter />}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-24">
        <Eyebrow>The training case</Eyebrow>
        <Two a="What Arthur could" b="have saved them." />
        <p className="mt-6 max-w-[48rem] text-[15px] leading-[1.7] text-[#6c7481]">These plan-year estimates keep revenue, yearly cost reductions and a one-time overspend separate.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {savings.groups.map((group) => <article key={group.title} className="rounded-2xl border border-[#e4e5e9] p-6">
            <h3 className="text-[17px] font-medium text-[#1d1d1f]">{group.title}</h3>
            <p className="mt-3 text-[24px] font-medium text-[#1d1d1f]">{group.range}</p>
            <p className="mt-3 text-[14px] leading-[1.65] text-[#5b606a]">{group.detail}</p>
          </article>)}
        </div>
        <p className="mt-8 text-[17px] font-medium text-[#1d1d1f]">Combined plan-year swing: {savings.total}</p>
        <p className="mt-3 max-w-[70ch] text-[14px] leading-[1.7] text-[#5b606a]">{savings.note}</p>
        <p className="mt-3 max-w-[70ch] text-[14px] leading-[1.7] text-[#5b606a]">{savings.tax}</p>
      </section>

      <section className="border-y border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Eyebrow>Public record</Eyebrow>
          <Two a="The pattern" b="across DC." />
          <p className="mt-6 max-w-[70ch] text-[15px] leading-[1.7] text-[#5b606a]">Some schools ran short of cash and students first. Others, like the training school, closed on academics with healthy books. Arthur watches both.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {pattern.map((item) => <article key={item.text} className="rounded-2xl border border-[#e4e5e9] bg-white p-6">
              <p className="text-[15px] leading-[1.65] text-[#1d1d1f]">{item.text}</p>
              <p className="mt-3 text-[12px] text-[#8c8e95]">{item.source}</p>
            </article>)}
          </div>
          <p className="mt-8 max-w-[70ch] text-[14px] leading-[1.7] text-[#5b606a]">These cases do not prove that early warnings would have prevented closure, or that small schools fail more often. The public records show different routes to closure.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-24">
        <Eyebrow>Academic renewal</Eyebrow>
        <Two a="How Arthur would" b="have called the closure." />
        <p className="mt-6 max-w-[70ch] text-[15px] leading-[1.7] text-[#5b606a]">{projection.intro}</p>
        <div className="mt-10 divide-y divide-[#eef0f3] border-y border-[#e4e5e9]">
          {projection.rows.map((row) => <div key={row.year} className="grid grid-cols-3 gap-4 py-4 text-[14px] text-[#1d1d1f]">
            <span>{row.year}</span><span>Score: {row.score}</span><span>Needed next: {row.needed}</span>
          </div>)}
        </div>
        <p className="mt-6 max-w-[70ch] text-[14px] leading-[1.7] text-[#5b606a]">{projection.end}</p>
      </section>

      <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Eyebrow>A second case</Eyebrow>
          <Two a="The school that ran out of money," b="and when Arthur would have said so." />
          <p className="mt-6 max-w-[70ch] text-[15px] leading-[1.7] text-[#5b606a]">{eagle.intro}</p>
          <div className="mt-10 divide-y divide-[#eef0f3] border-y border-[#e4e5e9]">
            {eagle.rows.map((r) => (
              <div key={r.fy} className="grid gap-1 py-4 md:grid-cols-[8rem_10rem_1fr] md:gap-4">
                <span className="text-[14px] font-medium text-[#1d1d1f]">{r.fy}</span>
                <span className="text-[14px] text-[#1d1d1f]">{r.students}</span>
                <span className="text-[14px] text-[#5b606a]">{r.line}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {eagle.flags.map((f) => (
              <article key={f.when} className="rounded-2xl border border-[#e4e5e9] bg-white p-6">
                <span className="text-[11px] uppercase tracking-[0.12em] text-[#8c8e95]">{f.when}</span>
                <p className="mt-2 text-[15px] leading-[1.65] text-[#1d1d1f]">{f.t}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-[70ch] text-[14px] leading-[1.7] text-[#5b606a]">{eagle.end}</p>
        </div>
      </section>

      {/* Model */}
      <section id="model" className="bg-[#111217] text-white">
        <div className="mx-auto grid max-w-[1180px] gap-12 px-6 py-24 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Eyebrow dark>{copy.pathsEyebrow}</Eyebrow>
            <Two dark a={copy.pathsHead[0]} b={copy.pathsHead[1]} />
            <p className="mt-6 max-w-[30rem] text-[15px] leading-[1.75] text-[#a3a8b2]">
              {copy.pathsLead}
            </p>
          </div>
          <ol className="grid gap-7">
            {model.map((m, i) => (
              <li key={m.t} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="text-[13px] tabular-nums text-[#8fb6de]">{i + 1}</span>
                <span>
                  <span className="block text-[17px] text-white">{m.t}</span>
                  <span className="mt-1 block text-[14px] leading-[1.7] text-[#a3a8b2]">{m.d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Fixes */}
      <section id="next" className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto grid max-w-[1180px] items-start gap-12 px-6 py-24 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow>What we would do</Eyebrow>
            <Two a={copy.nextHead[0]} b={copy.nextHead[1]} />
            <p className="mt-6 max-w-[30rem] text-[15px] leading-[1.7] text-[#6c7481]">
              {copy.nextLead}
            </p>
          </div>
          <ol className="grid gap-6">
            {[...fixes].sort((a, b) => Number(a.tag === "done") - Number(b.tag === "done")).map((f, i) => (
              <li key={f.t} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                <span>
                  <span className="block text-[16px] text-[#1d1d1f]">
                    {f.t}
                    <span className={`ml-2 inline-block rounded-full px-2.5 py-0.5 align-[2px] text-[11px] font-medium ${TAG[f.tag].cls}`}>{TAG[f.tag].label}</span>
                  </span>
                  <span className="mt-1 block text-[14px] leading-[1.65] text-[#7d8088]">{f.d}</span>
                  {f.tag !== "done" && <ReviewControl id={"x-" + slug(f.t)} label={f.t} endpoint={EP} submitOnEnter />}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mx-auto max-w-[1180px] px-6 pb-20">
          <ReviewSubmit endpoint={EP} />
        </div>
      </section>

      {/* Sources */}
      <section className="border-t border-[#e4e5e9]">
        <div className="mx-auto max-w-[1180px] px-6 py-12">
          <details>
            <summary className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777980] hover:text-[#3778bc]">
              Sources and method
            </summary>
            <ul className="mt-5 grid max-w-[72ch] gap-2 text-[13px] leading-[1.6] text-[#6c7481]">
              {method.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </details>
        </div>
      </section>
    </div>
  );
}
