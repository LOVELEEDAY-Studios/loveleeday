import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewControl, ReviewSubmit } from "@/components/portal/ReviewControl";
import { CONCEPTS_URL, findings, fixes, getOrderingClient, glance, grades, ladder, method, orderingClients, type Sev } from "@/content/hub/dabney-ordering";

export const dynamicParams = false;

export function generateStaticParams() {
  return orderingClients.map((c) => ({ token: c.token }));
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const c = getOrderingClient(token);
  return { title: c ? `${c.short}: ordering platforms review` : "A proposal" };
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
function ConceptTags({ concepts }: { concepts?: number[] }) {
  if (!concepts?.length) return null;
  return (
    <span className="ml-2 inline-flex flex-wrap gap-1 align-middle">
      {concepts.map((n) => (
        <a
          key={n}
          href={`${CONCEPTS_URL}#concept-${n}`}
          className="inline-block rounded-full bg-[#eaf2fb] px-2 py-0.5 text-[10.5px] font-medium text-[#2d6aa8] hover:bg-[#dbe9f8]"
        >
          → Concept {n}
        </a>
      ))}
    </span>
  );
}
const EP = "/api/dabney-ordering-review";
const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);
const GRADE_CLS = (g: string) => (/^[DF]/.test(g) ? "text-[#a1291f]" : g.startsWith("C") ? "text-[#8a5a00]" : "text-[#1e6b3a]");

export default async function OrderingReviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const c = getOrderingClient(token);
  if (!c) notFound();
  const counts = { fix: 0, watch: 0, good: 0 } as Record<Sev, number>;
  findings.forEach((f) => counts[f.sev]++);

  return (
    <div className="ll-os bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-[1180px] px-6 pb-20 pt-16 sm:pt-24">
        <Eyebrow>
          {c.short} · prepared for {c.preparedFor}, {c.role}
        </Eyebrow>
        <Two size="h1" a="Every place Dabney takes an order." b="And the road to $10k a month." />
        <p className="mt-8 max-w-[40rem] text-[17px] leading-[1.7] text-[#6c7481]">
          We read six months of Toast orders by channel, the delivery menu settings, and every storefront the way a customer sees it on
          September 26, 2026. Delivery started in June and is worth about $1,500 a month, nearly all of it DoorDash. The food travels
          well. What&apos;s missing is reach, order size and hours.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-[14px]">
          <a href="#findings" className="rounded-full bg-[#1d1d1f] px-5 py-2.5 font-medium text-white">
            See the {counts.fix} fixes
          </a>
          <a href="#faster" className="rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[#1d1d1f] hover:border-[#3778bc]">
            See the path to $10k
          </a>
          <a href={CONCEPTS_URL} className="rounded-full border border-[#3778bc] px-5 py-2.5 text-[#3778bc] hover:bg-[#eaf2fb]">
            See five ordering concepts that would fix this →
          </a>
        </div>
      </section>

      {/* At a glance */}
      <section className="border-y border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-14">
          <Eyebrow>At a glance · Mar 30 to Sep 26</Eyebrow>
          <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-x-8 gap-y-8">
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
            <Eyebrow>Every channel, graded</Eyebrow>
            <Two a="Graded the way" b="a hungry customer sees it." />
          </div>
          <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
            Each grade is what a customer meets today, plus what the channel earned in Toast&apos;s own order data.
          </p>
        </div>
        <div className="mt-10 divide-y divide-[#eef0f3] border-y border-[#e4e5e9]">
          {grades.map((g) => (
            <div key={g.area} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 py-5 md:grid-cols-[16rem_4rem_1fr]">
              <span className="text-[17px] font-medium text-[#1d1d1f]">{g.area}</span>
              <b className={`text-[20px] font-semibold tabular-nums ${GRADE_CLS(g.grade)}`}>{g.grade}</b>
              <span className="col-span-2 text-[14px] leading-[1.65] text-[#5b606a] md:col-span-1">
                {g.why}
                <ConceptTags concepts={g.concepts} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Findings */}
      <section id="findings" className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>What we found</Eyebrow>
              <Two a={`${counts.fix} to fix, ${counts.watch} to watch,`} b={`${counts.good} already working.`} />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
              Order numbers come from Toast. Storefront notes are what a logged-out customer saw. Ranked by revenue impact.
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
                <p className="mt-2 text-[14px] leading-[1.65] text-[#5b606a]">
                  {f.d}
                  <ConceptTags concepts={f.concepts} />
                </p>
                {f.sev !== "good" && <ReviewControl id={"f-" + slug(f.t)} label={f.t} endpoint={EP} submitOnEnter />}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Faster */}
      <section id="faster" className="bg-[#111217] text-white">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Eyebrow dark>The path to $10k a month</Eyebrow>
          <Two dark a="From 3 orders a night" b="to a real second business." />
          <p className="mt-6 max-w-[40rem] text-[15px] leading-[1.75] text-[#a3a8b2]">
            $10k a month is about 17 delivery orders a night at today&apos;s order size, or 12 at $35 with bundles. Fixing the apps and
            getting seen roughly triples today. The rest needs more hours and catering.
          </p>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-[#2a2d35] md:grid-cols-5">
            {ladder.map((l, i) => (
              <li key={l.stage} className="bg-[#16181d] p-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8fb6de]">
                  {String(i + 1).padStart(2, "0")} · {l.when}
                </span>
                <span className="mt-3 block text-[18px] font-medium text-white">{l.stage}</span>
                <span className="mt-2 block text-[22px] font-medium tracking-[-0.02em] text-[#bfe3c9]">{l.monthly}</span>
                <span className="mt-3 block text-[13.5px] leading-[1.65] text-[#a3a8b2]">{l.what}</span>
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
            <Two a="Most of it this week," b="and most of it free." />
            <p className="mt-6 max-w-[30rem] text-[15px] leading-[1.7] text-[#6c7481]">
              Three need your decision and two cost money. The rest is setup work I can start on.
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
                  <span className="mt-1 block text-[14px] leading-[1.65] text-[#7d8088]">
                    {f.d}
                    <ConceptTags concepts={f.concepts} />
                  </span>
                  <ReviewControl id={"x-" + slug(f.t)} label={f.t} endpoint={EP} submitOnEnter />
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
