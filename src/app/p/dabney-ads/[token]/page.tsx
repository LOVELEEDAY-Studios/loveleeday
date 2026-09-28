import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adsClients, categories, findings, getAdsClient, headline, method, ORDER, plan, themes, thisSaturday, weekdays } from "@/content/hub/dabney-ads";
import { saturdays, type Sat } from "@/content/hub/dabney-ads-saturdays";

export const dynamicParams = false;

export function generateStaticParams() {
  return adsClients.map((c) => ({ token: c.token }));
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const c = getAdsClient(token);
  return { title: c ? `${c.short}: ads and performance` : "A proposal" };
}

/* INTERNAL Dabney ads analysis on the hub template (local only, not deployed: it carries revenue). */

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

const TONE = { good: "text-[#1e6b3a] font-semibold", bad: "text-[#a1291f] font-semibold", "": "" } as const;
const TAG = {
  free: { label: "Free", cls: "bg-[#e6f4ea] text-[#1e6b3a]" },
  money: { label: "Spend", cls: "bg-[#fff4e0] text-[#8a5a00]" },
  needs: { label: "Needs your call", cls: "bg-[#eaf2fb] text-[#2d6aa8]" },
  done: { label: "Done", cls: "bg-[#1d1d1f] text-white" },
} as const;
const KIND: Record<Sat["kind"], { fill: string; name: string }> = {
  afterdark: { fill: "#3778bc", name: "After Dark" },
  theme: { fill: "#8fb6de", name: "Other theme night" },
  promoted: { fill: "#c9a46a", name: "Other promoted" },
  plain: { fill: "#d7d9de", name: "No paid ads" },
};

function SaturdayChart() {
  const W = 1000, H = 300, pl = 46, pr = 6, pt = 10, pb = 30, max = 6000;
  const bw = (W - pl - pr) / saturdays.length;
  const y = (v: number) => pt + (H - pt - pb) * (1 - v / max);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Net sales for every Saturday since August 2025, colored by what was promoted">
      {[0, 2000, 4000, 6000].map((v) => (
        <g key={v}>
          <line x1={pl} x2={W - pr} y1={y(v)} y2={y(v)} stroke="#eef0f3" />
          <text x={pl - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#8c8e95">${v / 1000}k</text>
        </g>
      ))}
      {saturdays.map((s, i) => {
        const x = pl + i * bw + 1.5;
        return (
          <g key={s.date}>
            <rect x={x} y={y(s.net)} width={Math.max(bw - 3, 2)} height={y(0) - y(s.net)} rx={1.5} fill={KIND[s.kind].fill}>
              <title>{`${s.date}: $${s.net.toLocaleString()} net, ${s.guests} guests${s.label ? ` · ${s.label}` : ""}`}</title>
            </rect>
            {Number(s.date.slice(8)) <= 7 && (
              <text x={x + bw / 2} y={H - 10} textAnchor="middle" fontSize="10.5" fill="#8c8e95">
                {new Date(`${s.date}T12:00:00`).toLocaleString("en-US", { month: "short" })}
              </text>
            )}
          </g>
        );
      })}
      <line x1={pl} x2={W - pr} y1={y(1789)} y2={y(1789)} stroke="#1d1d1f" strokeDasharray="4 4" strokeWidth={1.2} />
    </svg>
  );
}

export default async function AdsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const c = getAdsClient(token);
  if (!c) notFound();

  return (
    <div className="ll-os bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-[1180px] px-6 pb-20 pt-16 sm:pt-24">
        <Eyebrow>
          {c.short} · prepared for {c.preparedFor}, {c.role}
        </Eyebrow>
        <Two size="h1" a="Thirteen months of ads, against every night." b="What actually sells." />
        <p className="mt-8 max-w-[40rem] text-[17px] leading-[1.7] text-[#6c7481]">
          We matched all $18,704 of Meta ad spend since August 2025, 124 campaigns and 169 ads, to the night each one was selling,
          then scored that night in Toast against the same weekday&apos;s un-promoted nights nearby. One pattern carries the whole
          account: a named, themed Saturday roughly doubles the night, and almost nothing else the ads do moves revenue.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-[14px]">
          <a href="#findings" className="rounded-full bg-[#1d1d1f] px-5 py-2.5 font-medium text-white">
            See the {findings.length} findings
          </a>
          <a href="#plan" className="rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[#1d1d1f] hover:border-[#3778bc]">
            See the plan
          </a>
        </div>
      </section>

      {/* Headline numbers */}
      <section className="border-y border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-14">
          <Eyebrow>The short version</Eyebrow>
          <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-6">
            {headline.map((s) => (
              <div key={s.k}>
                <div className="text-[clamp(1.8rem,3.4vw,2.4rem)] font-medium tracking-[-0.04em] text-[#1d1d1f]">{s.k}</div>
                <div className="mt-1 text-[14px] leading-[1.55] text-[#4a4d55]">{s.label}</div>
                <div className="mt-1 text-[12px] text-[#8c8e95]">{s.src}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Saturdays */}
      <section className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow>Saturdays</Eyebrow>
            <Two a="Every big Saturday" b="had a name on it." />
          </div>
          <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
            Net sales for every Saturday since August 2025. The tall bars are After Dark and the tribute nights; the rest cluster
            around $1,789, the average of Saturdays with no paid ads.
          </p>
        </div>
        <div className="mt-10 rounded-2xl border border-[#e4e5e9] p-6">
          <div className="mb-4 flex flex-wrap gap-5 text-[13px] text-[#5b606a]">
            {Object.values(KIND).map((k) => (
              <span key={k.name} className="inline-flex items-center gap-2">
                <i className="inline-block h-3 w-3 rounded-sm" style={{ background: k.fill }} />
                {k.name}
              </span>
            ))}
            <span className="inline-flex items-center gap-2">
              <i className="inline-block w-5 border-t-2 border-dashed border-[#1d1d1f]" />
              No-paid-ads average, $1,789
            </span>
          </div>
          <div className="-mx-2 overflow-x-auto px-2">
            <div className="min-w-[760px]">
              <SaturdayChart />
            </div>
          </div>
        </div>
        <p className="mt-3 text-[12.5px] text-[#8c8e95]">
          Toast net sales before tax and tip, Aug 2, 2025 – Sept 19, 2026. Meta ad data starts Aug 25, 2025, so the two August 2025
          cover parties show as no paid ads, as does Valentine&apos;s Day. Hover a bar for the night and its campaign.
        </p>
      </section>

      {/* Findings */}
      <section id="findings" className="border-t border-[#e4e5e9] bg-white">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>What we found</Eyebrow>
              <Two a={`${findings.length} findings.`} b="Every one with its source." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
              Every number was read from Meta, Toast or OpenTable on September 25, 2026. Where a figure is a correlation rather
              than a measured result, the finding says so.
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
                      <span className="inline-block rounded-full bg-[#eaf2fb] px-2.5 py-0.5 text-[11px] font-medium text-[#2d6aa8]">Verified</span>
                      <h4 className="mt-3 text-[17px] font-medium leading-[1.4] tracking-[-0.015em] text-[#1d1d1f]">{f.title}</h4>
                      <p className="mt-2 text-[14px] leading-[1.7] text-[#5b606a]">{f.detail}</p>
                      <div className="mt-3 text-[12.5px]">
                        {f.src.url ? (
                          <a className="text-[#3778bc] underline decoration-[#cfe0f2] underline-offset-2" href={f.src.url} target="_blank" rel="noreferrer">
                            {f.src.label}
                          </a>
                        ) : (
                          <span className="text-[#8c8e95]">{f.src.label}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </section>

      {/* The tables */}
      <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>The numbers behind it</Eyebrow>
              <Two a="Where $18,704 went," b="and what each night did." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
              Lift is each promoted night against the median of the same weekday&apos;s un-promoted nights within six weeks.
            </p>
          </div>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-[#e4e5e9] bg-white">
            <table className="w-full min-w-[760px] text-[14px]">
              <thead>
                <tr className="border-b border-[#e4e5e9] text-left text-[11px] uppercase tracking-[0.12em] text-[#8c8e95]">
                  {["Campaign type", "Campaigns", "Spend", "Nights", "Avg night", "Baseline", "Lift a night", "Per $1"].map((h, i) => (
                    <th key={h} className={`px-5 py-3 font-medium ${i ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((r) => (
                  <tr key={r.type} className="border-b border-[#eef0f3] last:border-0">
                    <td className="px-5 py-3 text-[#1d1d1f]">{r.type}</td>
                    {[r.campaigns, r.spend, r.nights, r.avg, r.base].map((v, i) => (
                      <td key={i} className="px-5 py-3 text-right tabular-nums text-[#5b606a]">{v}</td>
                    ))}
                    <td className={`px-5 py-3 text-right tabular-nums ${TONE[r.tone]}`}>{r.lift}</td>
                    <td className={`px-5 py-3 text-right tabular-nums ${TONE[r.tone]}`}>{r.per}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-[#e4e5e9] bg-white">
            <table className="w-full min-w-[760px] text-[14px]">
              <thead>
                <tr className="border-b border-[#e4e5e9] text-left text-[11px] uppercase tracking-[0.12em] text-[#8c8e95]">
                  {["Night", "Promoted", "Ad spend", "With ads", "Plain", "Difference", "Plain-night guests"].map((h, i) => (
                    <th key={h} className={`px-5 py-3 font-medium ${i ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weekdays.map((r) => (
                  <tr key={r.day} className="border-b border-[#eef0f3] last:border-0">
                    <td className="px-5 py-3 text-[#1d1d1f]">{r.day}</td>
                    {[r.promoted, r.spend, r.withAds, r.plain].map((v, i) => (
                      <td key={i} className="px-5 py-3 text-right tabular-nums text-[#5b606a]">{v}</td>
                    ))}
                    <td className={`px-5 py-3 text-right tabular-nums ${TONE[r.tone]}`}>{r.diff}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-[#5b606a]">{r.guests}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* The plan */}
      <section id="plan" className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow>How we would sell it</Eyebrow>
            <Two a="Sell the night ahead," b="on OpenTable, with Meta pointing at it." />
            <p className="mt-6 max-w-[30rem] text-[15px] leading-[1.7] text-[#6c7481]">
              Every ad sends people to something they can buy: a prepaid OpenTable Experience for a named night. The table, the cover
              and the first round are paid up front, booked, and counted in OpenTable&apos;s Experiences report. Blues Fest already
              showed that selling works on Meta.
            </p>
          </div>
          <ol className="grid gap-6">
            {[...plan].sort((a, b) => Number(a.tag === "done") - Number(b.tag === "done")).map((p, i) => (
              <li key={p.t} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                <span>
                  <span className="block text-[16px] text-[#1d1d1f]">
                    {p.t}
                    <span className={`ml-2 inline-block rounded-full px-2.5 py-0.5 align-[2px] text-[11px] font-medium ${TAG[p.tag].cls}`}>{TAG[p.tag].label}</span>
                  </span>
                  <span className="mt-1 block text-[14px] leading-[1.65] text-[#7d8088]">{p.d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* This Saturday */}
      <section className="bg-[#111217] text-white">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-6 py-24 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <Eyebrow dark>October's two Saturdays</Eyebrow>
            <Two dark a="Full runway this time." b="Measurement is the open item." />
          </div>
          <p className="text-[16px] leading-[1.75] text-[#a3a8b2]">{thisSaturday}</p>
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
