import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  buildOrder, calls, changed, coverage, decisions, facts, fit, funnel, getGrowthPlan, growthPlanClients,
  hierarchy, kept, ladder, model, phases, risks, sources,
} from "@/content/growth-plan";

export const dynamicParams = false;

export function generateStaticParams() {
  return growthPlanClients.map((c) => ({ token: c.token }));
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  return { title: getGrowthPlan(token) ? "Growth plan: we take control" : "A proposal" };
}

/* Same register as the Hub, County and Elemental pages: white .ll-os ground, 1180px column, the
   Eyebrow and two-tone headline, hairline lists, a dark section for coverage. */

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

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8c8e95] lg:hidden">{children}</span>
);

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
        <Two size="h1" a="We take control." b="We ship this week." />
        <p className="mt-8 max-w-[44rem] text-[17px] leading-[1.7] text-[#6c7481]">
          The company read the plan and said the direction is right. You set the rest: we do not wait for permission, for
          PearX or for a marketplace. Tenant safety and the market-data feeds are built now. Delivery is automated, so the
          Snapshot and the audit reach any organization, small, medium or large, in any industry, the same day, with no
          person in the loop and no ceiling on volume. The original plan is the foundation. We keep what is sound, change
          what the memos show will not work, and turn every gap they found into a same-week action.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-[14px]">
          <a href="#kept" className="rounded-full bg-[#1d1d1f] px-5 py-2.5 font-medium text-white">
            What we kept and changed
          </a>
          <a href="#thirty" className="rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[#1d1d1f] hover:border-[#3778bc]">
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
              <div key={s.label}>
                <div className="text-[clamp(1.8rem,3.4vw,2.4rem)] font-medium tracking-[-0.04em] text-[#1d1d1f]">{s.k}</div>
                <div className="mt-1 text-[14px] leading-[1.55] text-[#4a4d55]">{s.label}</div>
                <div className="mt-1 text-[12px] text-[#8c8e95]">{s.src}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[44rem] text-[14px] leading-[1.7] text-[#6c7481]">
            Every number on this page is sourced to a named memo in the review or labelled an assumption. No LOVELEEDAY
            price is on file, so every price here is a recommendation.
          </p>
        </div>
      </section>

      {/* Daniel's calls */}
      <section id="calls" className="mx-auto max-w-[1180px] px-6 py-24">
        <Head eyebrow="Your decisions" a="What you set," b="and what it changes.">
          These override the memos wherever they differ. The risks the company raised stay on the page, as things we manage
          while we move.
        </Head>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {calls.map((x, i) => (
            <div key={x.t} className="rounded-2xl border border-[#e4e5e9] p-6">
              <span className="text-[12px] tabular-nums text-[#3778bc]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-[18px] font-medium tracking-[-0.015em] text-[#1d1d1f]">{x.t}</h3>
              <p className="mt-2 text-[14px] leading-[1.65] text-[#5b606a]">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kept and changed */}
      <section id="kept" className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Head eyebrow="The original plan" a="Where we kept it, where we" b="changed it, and why.">
            The pasted plan is the foundation. We build off it with what the company shows will work.
          </Head>
          <div className="mt-14 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Eyebrow>Kept as written</Eyebrow>
              <ul className="mt-4">
                {kept.map((k) => (
                  <li key={k} className="flex gap-3 border-t border-[#dcdfe6] py-4 text-[14px] leading-[1.65] text-[#4a4d55]">
                    <span className="mt-[11px] h-px w-3 shrink-0 bg-[#3778bc]" aria-hidden="true" />
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Eyebrow>Changed, with the reason</Eyebrow>
              <ol className="mt-4">
                {changed.map((x, i) => (
                  <li key={x.what} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-[#dcdfe6] py-5">
                    <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                    <span>
                      <span className="block text-[15px] leading-[1.55] text-[#1d1d1f]">{x.what}</span>
                      <span className="mt-1 block text-[14px] leading-[1.65] text-[#7d8088]">Why: {x.why}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Fit */}
      <section id="fit" className="mx-auto max-w-[1180px] px-6 py-24">
        <Head eyebrow="How it fits" a="What we already have," b="and the move for each gap.">
          Every gap the company found becomes an action this week.
        </Head>
        <div className="mt-12 hidden grid-cols-[1fr_1.7fr_1.3fr_1.4fr] gap-x-6 border-b border-[#dcdfe6] pb-3 lg:grid">
          {["Plan piece", "What exists", "Gap", "Same-week action"].map((h) => (
            <span key={h} className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777980]">{h}</span>
          ))}
        </div>
        <ul>
          {fit.map((r) => (
            <li key={r.piece} className="grid gap-x-6 gap-y-3 border-b border-[#e4e5e9] py-6 lg:grid-cols-[1fr_1.7fr_1.3fr_1.4fr]">
              <span className="text-[15px] font-medium leading-[1.45] text-[#1d1d1f]">{r.piece}</span>
              <span className="text-[14px] leading-[1.65] text-[#5b606a]"><Label>What exists</Label>{r.exists}</span>
              <span className="text-[14px] leading-[1.65] text-[#5b606a]"><Label>Gap</Label>{r.gap}</span>
              <span className="text-[14px] leading-[1.65] text-[#2d6aa8]"><Label>Same-week action</Label>{r.action}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* The plan */}
      <section id="plan" className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Head eyebrow="The plan" a="One ladder," b="one automated funnel.">
            Tier prices for the original bands are the pasted plan&apos;s figures. The changes are our judgment. All are
            assumptions.
          </Head>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {ladder.map((l) => (
              <div key={l.name} className="rounded-2xl border border-[#e4e5e9] bg-white p-6">
                <span className="text-[12px] tabular-nums text-[#3778bc]">{l.n}</span>
                <h3 className="mt-2 text-[18px] font-medium tracking-[-0.015em] text-[#1d1d1f]">{l.name}</h3>
                <p className="mt-1 text-[14px] font-medium text-[#1d1d1f]">{l.price}</p>
                <p className="mt-3 text-[14px] leading-[1.65] text-[#5b606a]">{l.d}</p>
                <p className="mt-4 border-t border-[#eef0f3] pt-3 text-[12.5px] leading-[1.6] text-[#8c8e95]">{l.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Eyebrow>The automated funnel</Eyebrow>
              <p className="mt-4 max-w-[28rem] text-[15px] leading-[1.7] text-[#6c7481]">
                No person delivers any step. Every figure carries lineage back to its rows, and the engine refuses a figure
                it cannot source.
              </p>
            </div>
            <ol>
              {funnel.map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-[#dcdfe6] py-4">
                  <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                  <span>
                    <span className="block text-[16px] text-[#1d1d1f]">{t}</span>
                    <span className="mt-1 block text-[14px] leading-[1.65] text-[#7d8088]">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-20 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Eyebrow>Integration hierarchy</Eyebrow>
              <p className="mt-4 max-w-[28rem] text-[15px] leading-[1.7] text-[#6c7481]">
                The original hierarchy stands. The order of work follows what needs no vendor approval first.
              </p>
            </div>
            <ol>
              {hierarchy.map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-[#dcdfe6] py-4">
                  <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                  <span>
                    <span className="block text-[16px] text-[#1d1d1f]">{t}</span>
                    <span className="mt-1 block text-[14px] leading-[1.65] text-[#7d8088]">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-20 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Eyebrow>Product build order</Eyebrow>
              <p className="mt-4 max-w-[28rem] text-[15px] leading-[1.7] text-[#6c7481]">
                Working days from the CPO memo, all assumptions, now run in parallel because agents write the code.
              </p>
            </div>
            <ol>
              {buildOrder.map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[2rem_1fr_auto] gap-3 border-t border-[#dcdfe6] py-4">
                  <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                  <span className="text-[15px] leading-[1.5] text-[#1d1d1f]">{t}</span>
                  <span className="text-[13px] tabular-nums text-[#8c8e95]">{d}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Thirty days and beyond */}
      <section id="thirty" className="mx-auto max-w-[1180px] px-6 py-24">
        <Head eyebrow="The calendar" a="Thirty days, ninety days," b="twelve months.">
          Nothing waits on PearX, whose answer is due about day 30.
        </Head>
        <ol className="mt-12">
          {phases.map((x) => (
            <li key={x.d} className="grid gap-3 border-t border-[#e4e5e9] py-6 lg:grid-cols-[10rem_1fr] lg:gap-x-8">
              <span className="text-[15px] font-medium text-[#3778bc]">{x.d}</span>
              <span className="max-w-[60rem] text-[15px] leading-[1.7] text-[#4a4d55]">{x.t}</span>
            </li>
          ))}
        </ol>

        <div className="mt-20">
          <Eyebrow>Revenue by month 3, on funnel arithmetic</Eyebrow>
          <p className="mt-4 max-w-[48rem] text-[14px] leading-[1.7] text-[#6c7481]">
            200 sends a day for 90 days is 18,000 messages. The rates below are assumptions, so treat the figures as a
            shape to test at day 30, not a forecast.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {model.map((k) => (
              <div key={k.c} className="rounded-2xl border border-[#e4e5e9] p-6">
                <h3 className="text-[18px] font-medium tracking-[-0.015em] text-[#1d1d1f]">{k.c}</h3>
                <dl className="mt-4 grid grid-cols-[1fr_auto] gap-y-2 text-[14px]">
                  <dt className="text-[#7d8088]">Snapshot request rate</dt>
                  <dd className="tabular-nums text-[#1d1d1f]">{k.req}</dd>
                  <dt className="text-[#7d8088]">Snapshots run</dt>
                  <dd className="tabular-nums text-[#1d1d1f]">{k.snaps}</dd>
                  <dt className="text-[#7d8088]">Become paying</dt>
                  <dd className="tabular-nums text-[#1d1d1f]">{k.conv}</dd>
                  <dt className="text-[#7d8088]">Customers</dt>
                  <dd className="tabular-nums text-[#1d1d1f]">{k.cust}</dd>
                  <dt className="text-[#7d8088]">Average first plan</dt>
                  <dd className="tabular-nums text-[#1d1d1f]">{k.plan}</dd>
                  <dt className="border-t border-[#eef0f3] pt-2 text-[#7d8088]">Month-3 MRR</dt>
                  <dd className="border-t border-[#eef0f3] pt-2 tabular-nums text-[#1d1d1f]">{k.mrr}</dd>
                </dl>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-[48rem] text-[13px] leading-[1.7] text-[#6c7481]">
            The CFO&apos;s capacity-capped month-3 MRR was $1,000, $3,000 and $6,000, so the base case here agrees with it and
            the aggressive case is what removing the cap is worth. For month 12 the only sourced anchor is the CFO&apos;s
            $6,000, $22,000 and $55,000 MRR and about $45,000, $150,000 and $380,000 cumulative cash. We treat that as a
            floor and recompute from live funnel data at day 30. Enterprise and Portfolio count as $0 until SOC 2.
          </p>
        </div>
      </section>

      {/* Coverage */}
      <section id="coverage" className="bg-[#111217] text-white">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Head dark eyebrow="Coverage" a="Every organization," b="not one at a time.">
            Because delivery is automated, none of these breaks anything by working.
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
        <Head eyebrow="Risks to manage" a="What the company raised," b="and the move for each.">
          Risks, not reasons to wait. Each one has an action this week.
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
          <Head eyebrow="Decisions" a="Only what is" b="truly yours.">
            Three things we cannot do for you. Everything else is moving.
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
