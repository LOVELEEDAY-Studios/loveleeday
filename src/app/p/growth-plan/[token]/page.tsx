import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  agreed, buildOrder, cash, channels, coverage, days, decisions, disputes, facts, fit, getGrowthPlan,
  growthPlanClients, ladder, ninety, risks, sources, twelve,
} from "@/content/growth-plan";

export const dynamicParams = false;

export function generateStaticParams() {
  return growthPlanClients.map((c) => ({ token: c.token }));
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  return { title: getGrowthPlan(token) ? "Growth plan: one plan, with or without PearX" : "A proposal" };
}

/* Same register as the Hub, County and Elemental pages: white .ll-os ground, 1180px column, the
   Eyebrow and two-tone headline, hairline lists, a dark section for the one place that argues. */

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

function Head({ eyebrow, a, b, children, dark }: { eyebrow: string; a: string; b: string; children?: React.ReactNode; dark?: boolean }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
      <div>
        <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        <Two a={a} b={b} dark={dark} />
      </div>
      {children && (
        <p className={`max-w-[34rem] text-[15px] leading-[1.7] ${dark ? "text-[#a3a8b2]" : "text-[#6c7481]"}`}>{children}</p>
      )}
    </div>
  );
}

export default async function GrowthPlanPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const c = getGrowthPlan(token);
  if (!c) notFound();

  return (
    <div className="ll-os bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-[1180px] px-6 pb-20 pt-16 sm:pt-24">
        <Eyebrow>
          Internal plan · prepared for {c.preparedFor}, {c.role} · October 5, 2026
        </Eyebrow>
        <Two size="h1" a="Right direction." b="A different order." />
        <p className="mt-8 max-w-[44rem] text-[17px] leading-[1.7] text-[#6c7481]">
          The company read the plan and every seat said change it. Connect many systems, keep one record, give a free first
          look and expand inside the organization: that is right. Twelve modules and a $1B path for one operator with no
          connector live at a customer is not. So we sell the wedge first, as a fixed-price review that runs on file uploads
          through the portal we already have, and we reach the most organizations by putting accountants, bookkeepers and
          fractional CFOs in front of their own clients. Subscriptions come after that. None of it waits for PearX.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-[14px]">
          <a href="#thirty" className="rounded-full bg-[#1d1d1f] px-5 py-2.5 font-medium text-white">
            The first 30 days
          </a>
          <a href="#decisions" className="rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[#1d1d1f] hover:border-[#3778bc]">
            {decisions.length} decisions for you
          </a>
        </div>
      </section>

      {/* Where we start */}
      <section className="border-y border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-14">
          <Eyebrow>Where we start</Eyebrow>
          <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-6">
            {facts.map((s) => (
              <div key={s.k}>
                <div className="text-[clamp(1.8rem,3.4vw,2.4rem)] font-medium tracking-[-0.04em] text-[#1d1d1f]">{s.k}</div>
                <div className="mt-1 text-[14px] leading-[1.55] text-[#4a4d55]">{s.label}</div>
                <div className="mt-1 text-[12px] text-[#8c8e95]">{s.src}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[44rem] text-[14px] leading-[1.7] text-[#6c7481]">
            Every number below is either sourced to a named memo in the review or labelled an assumption. No LOVELEEDAY
            price is on file, so every price on this page is a recommendation.
          </p>
        </div>
      </section>

      {/* Agreed and disputed */}
      <section id="agreed" className="mx-auto max-w-[1180px] px-6 py-24">
        <Head eyebrow="The review" a="Where the company agreed," b="and where it did not.">
          Eight points had every seat that touched them in agreement. Ten did not, and each is settled below with the
          reasoning.
        </Head>
        <ol className="mt-12 grid gap-x-10 md:grid-cols-2">
          {agreed.map((t, i) => (
            <li key={t} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-[#e4e5e9] py-5">
              <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
              <span className="text-[15px] leading-[1.65] text-[#1d1d1f]">{t}</span>
            </li>
          ))}
        </ol>

        <div className="mt-20 border-b border-[#e4e5e9] pb-3">
          <h3 className="text-[20px] font-medium tracking-[-0.02em] text-[#1d1d1f]">
            The disagreements <span className="text-[#8c8e95]">· {disputes.length}</span>
          </h3>
        </div>
        <ol className="grid gap-x-10 md:grid-cols-2">
          {disputes.map((d) => (
            <li key={d.topic} className="border-b border-[#eef0f3] py-7">
              <span className="inline-block rounded-full bg-[#eaf2fb] px-2.5 py-0.5 text-[11px] font-medium text-[#2d6aa8]">{d.topic}</span>
              <p className="mt-3 text-[13px] leading-[1.65] text-[#8c8e95]">{d.split}</p>
              <h4 className="mt-3 text-[16px] font-medium leading-[1.45] tracking-[-0.015em] text-[#1d1d1f]">{d.call}</h4>
              <p className="mt-2 text-[14px] leading-[1.7] text-[#5b606a]">{d.why}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Fit */}
      <section id="fit" className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Head eyebrow="How it fits" a="What we already have," b="and what is missing.">
            Each piece of the plan against what exists today, the gap, and when it closes.
          </Head>
          <div className="mt-12 hidden grid-cols-[1.05fr_1.7fr_1.35fr_1fr] gap-x-6 border-b border-[#dcdfe6] pb-3 lg:grid">
            {["Plan piece", "What exists", "Gap", "When"].map((h) => (
              <span key={h} className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777980]">{h}</span>
            ))}
          </div>
          <ul>
            {fit.map((r) => (
              <li key={r.piece} className="grid gap-x-6 gap-y-3 border-b border-[#e4e5e9] py-6 lg:grid-cols-[1.05fr_1.7fr_1.35fr_1fr]">
                <span className="text-[15px] font-medium leading-[1.45] text-[#1d1d1f]">{r.piece}</span>
                <span className="text-[14px] leading-[1.65] text-[#5b606a]">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8c8e95] lg:hidden">What exists</span>
                  {r.exists}
                </span>
                <span className="text-[14px] leading-[1.65] text-[#5b606a]">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8c8e95] lg:hidden">Gap</span>
                  {r.gap}
                </span>
                <span className="text-[14px] leading-[1.65] text-[#2d6aa8]">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8c8e95] lg:hidden">When</span>
                  {r.when}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The plan */}
      <section id="plan" className="mx-auto max-w-[1180px] px-6 py-24">
        <Head eyebrow="The plan, gaps filled" a="One ladder," b="one first market.">
          What we sell, to whom, through which doors, and in what order we build it. Prices are recommendations.
        </Head>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {ladder.map((l) => (
            <div key={l.name} className="rounded-2xl border border-[#e4e5e9] p-6">
              <span className="text-[12px] tabular-nums text-[#3778bc]">{l.n}</span>
              <h3 className="mt-2 text-[18px] font-medium tracking-[-0.015em] text-[#1d1d1f]">{l.name}</h3>
              <p className="mt-1 text-[14px] font-medium text-[#1d1d1f]">{l.price}</p>
              <p className="mt-3 text-[14px] leading-[1.65] text-[#5b606a]">{l.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>First market</Eyebrow>
            <p className="mt-4 max-w-[28rem] text-[15px] leading-[1.7] text-[#6c7481]">
              West Michigan owner-operated businesses with a priced catalog and books in QuickBooks, Xero or Excel, sold
              through their accountants and your network. The engine is built against a distribution-shaped synthetic file.
              Kalamazoo County has 128-153 independent bars and restaurants worth roughly $0.54-0.64M a year at an assumed
              $4,200 contract, which is why the first market cannot be bars alone and Dabney stays the proof, not the frame.
            </p>
          </div>
          <div>
            <Eyebrow>Channels, in order</Eyebrow>
            <ol className="mt-4">
              {channels.map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-[#e4e5e9] py-4">
                  <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                  <span>
                    <span className="block text-[16px] text-[#1d1d1f]">{t}</span>
                    <span className="mt-1 block text-[14px] leading-[1.65] text-[#7d8088]">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Product build order</Eyebrow>
            <p className="mt-4 max-w-[28rem] text-[15px] leading-[1.7] text-[#6c7481]">
              Working days, assuming agents write and you review; all assumptions. About 7 days to a concierge snapshot,
              about 18 to self-serve. No figure ships without the rows behind it, and the snapshot says which columns it
              found.
            </p>
          </div>
          <ol>
            {buildOrder.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[2rem_1fr_auto] gap-3 border-t border-[#e4e5e9] py-4">
                <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                <span className="text-[15px] leading-[1.5] text-[#1d1d1f]">{t}</span>
                <span className="text-[13px] tabular-nums text-[#8c8e95]">{d}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-20 grid gap-x-10 gap-y-10 md:grid-cols-3">
          <div>
            <Eyebrow>External signals</Eyebrow>
            <p className="mt-4 text-[14px] leading-[1.7] text-[#5b606a]">
              BLS and EIA are free with registration; FRED needs a free key and its redistribution terms are unread. A 3-5
              day build once a customer asks. The hard part is mapping to their cost data, so it is month 4 at the earliest.
            </p>
          </div>
          <div>
            <Eyebrow>Security path</Eyebrow>
            <p className="mt-4 text-[14px] leading-[1.7] text-[#5b606a]">
              Days 1-14: merge the tenant-scoped branch, run a two-tenant RLS probe, confirm one real scheduler tick. Days
              15-30: graph off the Mac, a named responder, a SOC 2 quote. Before any anonymous upload: a written review and a
              deletion guarantee.
            </p>
          </div>
          <div>
            <Eyebrow>Naming</Eyebrow>
            <p className="mt-4 text-[14px] leading-[1.7] text-[#5b606a]">
              LOVELEEDAY is the company, the seller and the public brand. Arthur is the engine. The badge reads Connected
              with Arthur, and never stands alone as a brand.
            </p>
          </div>
        </div>
      </section>

      {/* If PearX says no */}
      <section id="thirty" className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Head eyebrow="If PearX says no" a="Thirty days," b="day by day.">
            The PearX answer is due about day 30, so everything here is worth doing either way. All outreach is drafted and
            you approve each send.
          </Head>
          <ol className="mt-12 grid gap-x-10 md:grid-cols-2">
            {days.map((x) => (
              <li key={x.d} className="grid grid-cols-[5.5rem_1fr] gap-3 border-t border-[#dcdfe6] py-4">
                <span className="text-[13px] tabular-nums text-[#3778bc]">{x.d}</span>
                <span className="text-[14px] leading-[1.65] text-[#4a4d55]">{x.t}</span>
              </li>
            ))}
          </ol>

          <div className="mt-20 grid gap-x-10 gap-y-12 lg:grid-cols-2">
            <div>
              <Eyebrow>Ninety days</Eyebrow>
              <ol className="mt-4">
                {ninety.map(([t, d]) => (
                  <li key={t} className="border-t border-[#dcdfe6] py-5">
                    <span className="block text-[16px] text-[#1d1d1f]">{t}</span>
                    <span className="mt-1 block text-[14px] leading-[1.65] text-[#5b606a]">{d}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <Eyebrow>Twelve months</Eyebrow>
              <ol className="mt-4">
                {twelve.map(([t, d]) => (
                  <li key={t} className="border-t border-[#dcdfe6] py-5">
                    <span className="block text-[16px] text-[#1d1d1f]">{t}</span>
                    <span className="mt-1 block text-[14px] leading-[1.65] text-[#5b606a]">{d}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-20">
            <Eyebrow>Cash and MRR, from the CFO memo</Eyebrow>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {cash.map((k) => (
                <div key={k.c} className="rounded-2xl border border-[#e4e5e9] bg-white p-6">
                  <h3 className="text-[18px] font-medium tracking-[-0.015em] text-[#1d1d1f]">{k.c}</h3>
                  <dl className="mt-4 grid grid-cols-[1fr_auto] gap-y-2 text-[14px]">
                    <dt className="text-[#7d8088]">MRR, month 3</dt>
                    <dd className="tabular-nums text-[#1d1d1f]">{k.m3}</dd>
                    <dt className="text-[#7d8088]">MRR, month 6</dt>
                    <dd className="tabular-nums text-[#1d1d1f]">{k.m6}</dd>
                    <dt className="text-[#7d8088]">MRR, month 12</dt>
                    <dd className="tabular-nums text-[#1d1d1f]">{k.m12}</dd>
                    <dt className="border-t border-[#eef0f3] pt-2 text-[#7d8088]">Cash, 12 months</dt>
                    <dd className="border-t border-[#eef0f3] pt-2 tabular-nums text-[#1d1d1f]">{k.cash}</dd>
                  </dl>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-[48rem] text-[13px] leading-[1.7] text-[#6c7481]">
              Assumptions from the CFO: 15 percent of studies convert to a sprint, half attach a retainer, 3 percent monthly
              churn, capacity-capped. The aggressive case needs one hire at month 6 and a channel partner. One-time fees are
              about half of cash in the conservative and base cases. No salary draw is assumed and the day job continues,
              so capacity, not runway, is the limit.
            </p>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section id="coverage" className="bg-[#111217] text-white">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Head dark eyebrow="Coverage" a="The most organizations," b="without breaking delivery.">
            Every channel either runs without you in the room or is capped so it cannot swamp delivery.
          </Head>
          <div className="mt-14 grid gap-x-10 md:grid-cols-2">
            {coverage.map((x, i) => (
              <div key={x.t} className="border-t border-[#2a2c33] py-8">
                <span className="text-[11px] tabular-nums text-[#6f7480]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[18px] font-medium leading-[1.35] tracking-[-0.015em]">{x.t}</h3>
                <p className="mt-3 text-[14px] leading-[1.75] text-[#a3a8b2]">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risks */}
      <section id="risks" className="mx-auto max-w-[1180px] px-6 py-24">
        <Head eyebrow="Risks" a="Five things" b="that can stop this.">
          Each one is handled in the thirty days above.
        </Head>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {risks.map((r) => (
            <div key={r.t} className="rounded-2xl border border-[#e4e5e9] p-6">
              <h3 className="text-[17px] font-medium text-[#1d1d1f]">{r.t}</h3>
              <p className="mt-2 text-[14px] leading-[1.65] text-[#5b606a]">{r.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Decisions */}
      <section id="decisions" className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Head eyebrow="Decisions" a="What only you" b="can decide.">
            Each with the company&apos;s recommendation. Nothing is sent, spent or published until you say so.
          </Head>
          <ol className="mt-12">
            {decisions.map((d, i) => (
              <li key={d.q} className="grid grid-cols-[2.2rem_1fr] gap-3 border-t border-[#dcdfe6] py-6 lg:grid-cols-[2.2rem_1.6fr_1fr] lg:gap-x-8">
                <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                <span className="text-[16px] leading-[1.55] text-[#1d1d1f]">{d.q}</span>
                <span className="col-start-2 text-[14px] leading-[1.6] text-[#2d6aa8] lg:col-start-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8c8e95]">Recommendation </span>
                  {d.rec}
                </span>
              </li>
            ))}
          </ol>
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
