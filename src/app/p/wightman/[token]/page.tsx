import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWightman, wightmanClients } from "@/content/hub/wightman";
import intel from "@/content/hub/wightman-intel.json";
import { CivicAsk } from "@/components/civic/CivicAsk";
import { NoteForm } from "@/components/portal/NoteForm";
import rows from "@/content/hub/wightman-intel-rows.json";
import { WightmanDashboard } from "@/components/wightman/Dashboard";
import { StaticCorridorMap } from "@/components/wightman/StaticCorridorMap";

export const dynamicParams = false;
export function generateStaticParams() {
  return wightmanClients.map((c) => ({ token: c.token }));
}
export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  return { title: getWightman(token) ? "Wightman: what Arthur can see across your territory" : "A proposal" };
}

/* Intelligence brief for Wightman on the hub template. Local only. Every figure comes from
   ~/arthur/data/wightman-intel via scripts/wightman-intel-compile.mjs; a panel with no data renders nothing. */

type Any = any; // eslint-disable-line @typescript-eslint/no-explicit-any
const I = intel as Any;
const CORRIDOR = "#3778bc", CONTROL = "#c07a2c", INK = "#1d1d1f", MUTED = "#8c8e95", GRID = "#eef0f3";
const $m = (n: number) => (n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${Math.round(n).toLocaleString()}`);
const firm = (s: string) => s.replace(/\s*\(.*?\)\s*/g, " ").replace(/\s*--.*$/, "").replace(/,? (LLC|Inc\.?)$/i, "").trim();
const usd = (s?: string | null) => { const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(s ?? ""); return m ? `${"JanFebMarAprMayJunJulAugSepOctNovDec".slice(+m[2] * 3 - 3, +m[2] * 3)}${m[3] ? ` ${+m[3]},` : ""} ${m[1]}` : s ?? ""; };
// Section 06 (one storefront's weekly sales) stays off the client page: it is Dabney's own data. Flip to show it.
const SHOW_STREET = false;
const ym = (s?: string | null) => (s ? usd(s.slice(0, 7)) : "undated");
// Federal records arrive in capitals ("TRANSPORTATION, MICHIGAN DEPARTMENT OF"); show them as written names.
const SMALL = new Set(["of", "and", "for", "the", "in", "to", "on", "a", "or"]);
const tc = (s?: string | null) => {
  if (!s) return "";
  const m = s.match(/^([A-Z &]+), ([A-Z .]+) DEPARTMENT OF$/);
  const t = (m ? `${m[2]} DEPARTMENT OF ${m[1]}` : s).toLowerCase().replace(/[a-z0-9]+/g, (w, i) => (i > 0 && SMALL.has(w) ? w : w[0].toUpperCase() + w.slice(1)));
  return t.replace(/\b(Covid|Rcp|Aip|Cdbg|Ffy|Fta|Epa|Hud)\b/g, (x) => x.toUpperCase());
};
const TODAY = new Date().toISOString().slice(0, 7);
// Past, current and future work read differently: "built", "under construction since", "planned".
const when = (st?: string | null, en?: string | null) =>
  en && en > TODAY ? (st && st <= TODAY ? ` · under construction since ${ym(st)}, to finish ${ym(en)}` : ` · planned, to finish ${ym(en)}`)
  : st && en ? ` · built ${ym(st)} to ${ym(en)}` : en ? ` · finished ${ym(en)}` : " · construction dates unpublished";
// Some sources describe a limit in a sentence; show the street, not the paragraph.
const lim = (s: string) => s.replace(/\s*\(.*$/, "").split(/[;,]/)[0].trim();

function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return <span className={`block text-[10px] font-semibold uppercase tracking-[0.16em] ${dark ? "text-[#9ea3ad]" : "text-[#777980]"}`}>{children}</span>;
}
function Two({ a, b, dark, size = "h2" }: { a: string; b: string; dark?: boolean; size?: "h1" | "h2" }) {
  const cls = size === "h1" ? "text-[clamp(2.6rem,6.4vw,4.6rem)] leading-[1.02] tracking-[-0.05em]" : "text-[clamp(2rem,4.2vw,3rem)] leading-[1.08] tracking-[-0.045em]";
  const Tag = size;
  return (
    <Tag className={`mt-4 font-medium ${cls} ${dark ? "text-white" : "text-[#1d1d1f]"}`}>
      {a}
      <br />
      <span className={dark ? "text-[#8e8d99]" : "text-[#8c8e95]"}>{b}</span>
    </Tag>
  );
}
function Head({ id, eyebrow, a, b, note }: { id?: string; eyebrow: string; a: string; b: string; note: React.ReactNode }) {
  return (
    <div id={id} className="grid gap-6 lg:grid-cols-2 lg:items-end">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Two a={a} b={b} />
      </div>
      <div className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">{note}</div>
    </div>
  );
}
function Src({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-[12px] leading-[1.6] text-[#8c8e95]">{children}</p>;
}

/* Horizontal bars: one hue (magnitude), labels in ink, value at the end. */
function Bars({ rows, max }: { rows: { label: string; value: number; sub?: string }[]; max?: number }) {
  const m = max ?? Math.max(...rows.map((r) => r.value));
  return (
    <div className="grid gap-2.5">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[minmax(7rem,11rem)_1fr_4.5rem] items-center gap-3 text-[13px]" title={`${r.label}: ${$m(r.value)}${r.sub ? ` · ${r.sub}` : ""}`}>
          <span className="truncate text-[#1d1d1f]">{r.label}</span>
          <span className="h-3.5 rounded-r-[4px] bg-[#3778bc]" style={{ width: `${Math.max(1, (100 * r.value) / m)}%` }} />
          <span className="text-right tabular-nums text-[#5b606a]">{$m(r.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* A corridor drawn to its own scale: the real street geometry between its cross streets. */
function Corridor({ coords }: { coords: [number, number][] }) {
  const W = 220, H = 120, pad = 12;
  const lat0 = coords.reduce((s, c) => s + c[1], 0) / coords.length;
  const k = Math.cos((lat0 * Math.PI) / 180);
  const xs = coords.map((c) => c[0] * k), ys = coords.map((c) => c[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const s = Math.min((W - 2 * pad) / Math.max(maxX - minX, 1e-6), (H - 2 * pad) / Math.max(maxY - minY, 1e-6));
  const ox = (W - s * (maxX - minX)) / 2, oy = (H - s * (maxY - minY)) / 2;
  const d = coords.map((c, i) => `${i ? "L" : "M"}${(ox + s * (c[0] * k - minX)).toFixed(1)},${(H - oy - s * (c[1] - minY)).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full rounded-xl bg-[#f5f5f7]" role="img" aria-label="Corridor geometry">
      <path d={d} fill="none" stroke={CORRIDOR} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Weekly net sales, this year vs the same weeks last year, with the construction start marked. */
function StreetChart({ weeks, start }: { weeks: Any[]; start: string }) {
  const W = 1000, H = 280, pl = 52, pr = 12, pt = 16, pb = 34;
  const max = Math.max(...weeks.flatMap((w: Any) => [w.net, w.lyNet])) * 1.08;
  const x = (i: number) => pl + (i * (W - pl - pr)) / (weeks.length - 1);
  const y = (v: number) => pt + (H - pt - pb) * (1 - v / max);
  const line = (k: string) => weeks.map((w: Any, i: number) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(w[k]).toFixed(1)}`).join(" ");
  const si = weeks.findIndex((w: Any) => w.week >= start);
  const ticks = [0, 5000, 10000, 15000].filter((t) => t < max);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Weekly net sales this year and last year, construction start marked">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pl} x2={W - pr} y1={y(t)} y2={y(t)} stroke={GRID} />
          <text x={pl - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill={MUTED}>${t / 1000}k</text>
        </g>
      ))}
      {si > 0 && (
        <g>
          <rect x={x(si)} y={pt} width={W - pr - x(si)} height={H - pt - pb} fill="#f5f5f7" />
          <text x={x(si) + 8} y={pt + 14} fontSize="11" fill={INK}>Construction on the block</text>
        </g>
      )}
      <path d={line("lyNet")} fill="none" stroke={CONTROL} strokeWidth={2} />
      <path d={line("net")} fill="none" stroke={CORRIDOR} strokeWidth={2} />
      {weeks.map((w: Any, i: number) => (
        <g key={w.week}>
          <circle cx={x(i)} cy={y(w.net)} r={3} fill={CORRIDOR}><title>{`Week of ${w.week}: $${w.net.toLocaleString()} this year, $${w.lyNet.toLocaleString()} last year`}</title></circle>
          {i % 3 === 0 && <text x={x(i)} y={H - 12} textAnchor="middle" fontSize="10.5" fill={MUTED}>{new Date(`${w.week}T12:00:00`).toLocaleString("en-US", { month: "short", day: "numeric" })}</text>}
        </g>
      ))}
    </svg>
  );
}

export default async function WightmanPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const c = getWightman(token);
  if (!c) notFound();
  const { water, federal, corridors, survival, contracts, street } = I;
  const mapped = (corridors || []).filter((k: Any) => k.coords && k.coords.length > 1);
  const studyReady = mapped.filter((k: Any) => k.quality === "exact-between-intersections" && ["high", "mixed"].includes(k.frontage) && k.end && k.end >= "2016" && k.end <= "2025-12");
  const engAmt = water ? water.firms.reduce((s: number, f: Any) => s + f.amount, 0) : 0;
  const wightmanWater = water ? water.firms.filter((f: Any) => /wightman/i.test(f.firm)) : [];

  return (
    <div className="ll-os bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-[1180px] px-6 pb-16 pt-16 sm:pt-24">
        <Eyebrow>{c.short} · prepared for {c.preparedFor}, {c.role}</Eyebrow>
        <Two size="h1" a="What Arthur can see across your territory." b="Before the RFQ, and after the ribbon cutting." />
        <p className="mt-8 max-w-[44rem] text-[17px] leading-[1.7] text-[#6c7481]">
          Wightman knows its projects better than anyone. This page is about what sits around them: the public money moving
          toward your clients before it becomes a solicitation, the contract history scattered across city agendas, and what
          happened to the businesses on the streets you rebuilt. Arthur assembled all of it from public records in one working
          day. Every number links to where it came from.
        </p>
      </section>

      {/* Headline */}
      <section className="border-y border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-8 px-6 py-14">
          {water && (
            <div>
              <div className="text-[clamp(1.9rem,3.6vw,2.6rem)] font-medium tracking-[-0.04em] text-[#1d1d1f]">{$m(water.total)}</div>
              <div className="mt-1 text-[14px] leading-[1.55] text-[#4a4d55]">in {water.count} ranked water and sewer projects across your offices&apos; counties, funded before most are ever put out to bid.</div>
              <div className="mt-1 text-[12px] text-[#8c8e95]">State revolving fund lists, MI · IN · OH, deduplicated</div>
            </div>
          )}
          {federal && (
            <div>
              <div className="text-[clamp(1.9rem,3.6vw,2.6rem)] font-medium tracking-[-0.04em] text-[#1d1d1f]">{$m(federal.total)}</div>
              <div className="mt-1 text-[14px] leading-[1.55] text-[#4a4d55]">in {federal.count} federal grants to cities, counties and authorities in those counties since January 2024.</div>
              <div className="mt-1 text-[12px] text-[#8c8e95]">USAspending.gov, retrieved {federal.retrieved}</div>
            </div>
          )}
          {corridors && (
            <div>
              <div className="text-[clamp(1.9rem,3.6vw,2.6rem)] font-medium tracking-[-0.04em] text-[#1d1d1f]">{mapped.length} corridors</div>
              <div className="mt-1 text-[14px] leading-[1.55] text-[#4a4d55]">of Wightman&apos;s street work mapped to the exact blocks, {studyReady.length} finished recently enough to measure what happened to the businesses on them.</div>
              <div className="mt-1 text-[12px] text-[#8c8e95]">gowightman.com projects + OpenStreetMap geometry</div>
            </div>
          )}
          {water && (
            <div>
              <div className="text-[clamp(1.9rem,3.6vw,2.6rem)] font-medium tracking-[-0.04em] text-[#1d1d1f]">{water.engineerFound} of {water.count}</div>
              <div className="mt-1 text-[14px] leading-[1.55] text-[#4a4d55]">pipeline projects where the engineer of record is already public, covering {$m(engAmt)}. The state lists never name the engineer.</div>
              <div className="mt-1 text-[12px] text-[#8c8e95]">Project plans, minutes and bid notices</div>
            </div>
          )}
        </div>
      </section>

      {/* Questions nobody has asked yet */}
      {I.discoveries?.length > 0 && (
        <section id="questions" className="mx-auto max-w-[1180px] px-6 py-24">
          <Head eyebrow="The questions nobody has asked yet" a="Eight questions," b="already answered." note={<>None of these come from inside Wightman. Each one is answered from public records, in the time it took to build this page, and every answer is traced below to where it came from.</>} />
          <div className="mt-14 grid gap-x-10 gap-y-2 md:grid-cols-2">
            {I.discoveries.map((d: Any, i: number) => (
              <div key={d.q} className="border-t border-[#e4e5e9] py-7">
                <span className="text-[11px] tabular-nums text-[#3778bc]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-[18px] font-medium leading-[1.35] tracking-[-0.015em] text-[#1d1d1f]">{d.q}</h3>
                <p className="mt-2 text-[14.5px] leading-[1.7] text-[#3a3f47]">{d.a}</p>
                <p className="mt-2 text-[12px] text-[#8c8e95]">{d.src}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* The working system */}
      <section id="dashboard" className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1340px] px-6 py-24">
          <div className="mx-auto mb-12 grid max-w-[1132px] gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>The working system</Eyebrow>
              <Two a="Arthur at Wightman." b="What you'd open every morning." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#7d8088]">
              This is the working system, not a picture of it. Filter by county, sort the pipeline, click a
              corridor on the map, switch clients in the contract record. Items marked public record are real today; items marked
              sample show what your own contract files fill in once connected.
            </p>
          </div>
          <WightmanDashboard embedded token={c.token} preparedFor={c.preparedFor} rows={rows as Any} corridors={I.corridors} survival={I.survival} businessesNow={I.businessesNow} builtAt={I.builtAt} />
          <p className="mt-4 text-center text-[11.5px] leading-[1.6] text-[#6a6e77]">
            Interactive preview built from public records. <a className="underline decoration-[#cfe0f2] underline-offset-2" href={`/p/wightman/${c.token}/dashboard`}>Open it full screen</a>.
          </p>
        </div>
      </section>

      {/* What changes */}
      <section className="mx-auto max-w-[1180px] px-6 py-24">
        <Eyebrow>What changes for your team</Eyebrow>
        <Two a="Less remembering." b="More deciding." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-[16px] border border-[#e4e5e9] bg-[#e4e5e9] md:grid-cols-2">
          {[
            ["What's left on a contract", "Ask Phil, who remembers", "Ask Arthur: remaining not-to-exceed, invoices against it, next deliverable, with the page it came from"],
            ["The next RFQ in your counties", "Heard when it's advertised", "Seen when the city lands on the state loan list or wins the grant, months earlier"],
            ["Who's winning your clients' work", "A feeling from the last interview", "Every engineering approval your clients' boards made since 2016, by firm and dollar"],
            ["A qualifications package", "Rebuilt from old files each time", "A first draft from past projects, awards and staff bios, every claim sourced"],
            ["What your corridor will do to the block", "Found out at the public meeting", "Businesses counted and risk measured before the first barricade, from your own past corridors"],
            ["AI across the firm", "Everyone guessing what's allowed", "One policy, approved tools, and use cases by role, with client data kept inside the rules"],
          ].map(([what, before, after]) => (
            <div key={what} className="bg-white p-7">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6a6e77]">{what}</span>
              <p className="mt-4 text-[14px] leading-[1.6] text-[#6a6e77] line-through decoration-[#d5d8de]">{before}</p>
              <p className="mt-1 text-[16px] leading-[1.55] text-[#1d1d1f]">{after}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Water */}
      {water && (
        <section className="mx-auto max-w-[1180px] px-6 py-24">
          <Head eyebrow="01 · The water money on your map" a="Your next RFQs," b="already ranked and funded."
            note={<>Michigan EGLE and the Indiana Finance Authority publish every project they intend to fund, with the applicant and the loan amount, months before the engineering is advertised. Each project below is counted once: {water.dedup?.miTerritoryFilteredCarriedForwardMatches != null ? `${water.dedup.miTerritoryFilteredCarriedForwardMatches} of the ${water.dedup.miTerritoryFilteredCanonicalProjects} Michigan projects here sit on both the FY2026 final and FY2027 draft lists` : "FY2026 projects carried into FY2027 are matched"}. Counties come from the Census gazetteer, not from guessing at town names.</>} />
          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="mb-5 text-[15px] font-medium text-[#1d1d1f]">By county, largest first</h3>
              <Bars rows={water.byCounty.slice(0, 12).map((r: Any) => ({ label: r.county, value: r.amount, sub: `${r.count} projects` }))} />
              <Src>{water.byCounty.length} counties in total; the 12 largest shown. Wayne dominates because Detroit and the Great Lakes Water Authority sit there.</Src>
            </div>
            <div>
              <h3 className="mb-5 text-[15px] font-medium text-[#1d1d1f]">Where the engineer is already public</h3>
              {water.firms.length ? (
                <Bars rows={water.firms.slice(0, 10).map((f: Any) => ({ label: `${firm(f.firm)}${f.moderate ? " (partly confirmed)" : ""}`, value: f.amount, sub: `${f.count} project${f.count > 1 ? "s" : ""}` }))} />
              ) : null}
              <Src>
                Found for {water.engineerFound} of {water.count} projects in project plans, council minutes and bid notices.
                {wightmanWater.length ? ` Wightman appears on ${wightmanWater.reduce((s: number, f: Any) => s + f.count, 0)} (${$m(wightmanWater.reduce((s: number, f: Any) => s + f.amount, 0))}).` : ""}{water.inHouse?.length ? ` ${water.inHouse.length} are engineered by the city's own staff (${water.inHouse[0].applicant}).` : ""} The
                rest have no engineer named in any public document yet; those are the openings.
              </Src>
            </div>
          </div>
          <div className="mt-14 overflow-x-auto rounded-2xl border border-[#e4e5e9]">
            <table className="w-full min-w-[760px] text-[14px]">
              <thead>
                <tr className="border-b border-[#e4e5e9] text-left text-[11px] uppercase tracking-[0.12em] text-[#8c8e95]">
                  {["Applicant", "County", "Program", "Status", "Amount", "Engineer of record"].map((h, i) => <th key={h} className={`px-5 py-3 font-medium ${i === 4 ? "text-right" : ""}`}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {water.top.map((p: Any) => (
                  <tr key={p.applicant + p.program + p.amount} className="border-b border-[#eef0f3] last:border-0">
                    <td className="px-5 py-3 text-[#1d1d1f]">{p.source ? <a href={p.source} target="_blank" rel="noreferrer" className="underline decoration-[#cfe0f2] underline-offset-2">{p.applicant}</a> : p.applicant}</td>
                    <td className="px-5 py-3 text-[#5b606a]">{p.county}, {p.state}</td>
                    <td className="px-5 py-3 text-[#5b606a]">{p.program}</td>
                    <td className="px-5 py-3 text-[#5b606a]">{p.status}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-[#1d1d1f]">{$m(p.amount)}</td>
                    <td className="px-5 py-3 text-[#5b606a]">{p.engineer ? firm(p.engineer) : <span className="text-[#8c8e95]">Not yet public</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Federal */}
      {federal && (
        <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
          <div className="mx-auto max-w-[1180px] px-6 py-24">
            <Head eyebrow="02 · Federal money to your clients" a="Every grant to your clients," b="the day it's awarded." note={<>Direct federal awards to cities, counties and authorities in the counties around your offices, from transportation, EPA, HUD, FEMA and EDA programs. A grant is the earliest public sign that engineering is coming.</>} />
            <div className="mt-12 grid gap-12 lg:grid-cols-2">
              <div>
                <h3 className="mb-5 text-[15px] font-medium text-[#1d1d1f]">By county</h3>
                <Bars rows={federal.byCounty.slice(0, 12).map((r: Any) => ({ label: `${r.key.toLowerCase().replace(/\b\w/g, (m: string) => m.toUpperCase())}${r.state ? `, ${r.state}` : ""}`, value: r.amount, sub: `${r.count} awards` }))} />
              </div>
              <div>
                <h3 className="mb-5 text-[15px] font-medium text-[#1d1d1f]">Largest awards</h3>
                <ol className="grid gap-0">
                  {federal.top.map((a: Any) => (
                    <li key={a.url} className="grid grid-cols-[1fr_auto] gap-3 border-t border-[#e4e5e9] py-3 text-[13.5px]">
                      <span><a href={a.url} target="_blank" rel="noreferrer" className="text-[#1d1d1f] underline decoration-[#cfe0f2] underline-offset-2">{tc(a.recipient)}</a><span className="block text-[12px] text-[#8c8e95]">{tc(a.program)}</span></span>
                      <span className="tabular-nums text-[#1d1d1f]">{$m(a.amount)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <Src>
              Recipient is a local government registered in the county; awards with actions from January 1, 2024 to {federal.retrieved}. Money that passes through a state agency first is counted separately{federal.passThrough ? `: ${federal.passThrough.count.toLocaleString()} more awards, ${$m(federal.passThrough.amount)}${federal.passThrough.incomplete?.length ? ` (${federal.passThrough.incomplete.join(" and ")} still being fetched, so this is a floor)` : ""}` : ""}.
              {federal.noted.map((n: Any) => ` Also counted there: ${tc(n.recipient)}, ${$m(n.amount)} from the ${tc(n.program)} for Kalamazoo Avenue.`)}
            </Src>
          </div>
        </section>
      )}

      {/* Corridors */}
      {corridors && (
        <section className="mx-auto max-w-[1180px] px-6 py-24">
          <Head eyebrow="03 · The streets you rebuilt" a={`${mapped.length} Wightman corridors,`} b="drawn from the street itself." note={<>Each line is the real street between the two cross streets named in the project, traced from OpenStreetMap, at its own scale. This is the base for the business study: which storefronts sit within 100 meters of each line, and what became of them.</>} />
          <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {mapped.map((k: Any) => (
              <figure key={k.id}>
                <StaticCorridorMap id={k.id} label={k.street || k.name} />
                <figcaption className="mt-3">
                  <span className="block text-[14px] font-medium leading-[1.35] text-[#1d1d1f]">{k.street || k.name}</span>
                  <span className="block text-[12.5px] leading-[1.5] text-[#5b606a]">{k.city}, {k.state}{k.from && k.to ? ` · ${lim(k.from)} to ${lim(k.to)}` : ""}</span>
                  <span className="mt-1 block text-[12px] text-[#8c8e95]">{k.lengthMeters ? `${(k.lengthMeters / 1609.34).toFixed(2)} mi` : ""}{when(k.start, k.end)}{k.quality !== "exact-between-intersections" ? " · downtown extent" : ""}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <Src>{(corridors.length - mapped.length)} more projects have no street segment to draw (a planning study and an undocumented 2013 award). Two dates and two sets of limits are still unpublished anywhere Arthur could find, and are shown as such.</Src>
        </section>
      )}

      {/* Why it matters + what the history predicts */}
      {I.businessesNow && (
        <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
          <div className="mx-auto max-w-[1180px] px-6 py-24">
            <Head eyebrow="04 · Why the streets matter to Wightman" a="Your past corridors" b="are a forecast for your next ones." note={<>Every street Wightman has rebuilt is a finished experiment: a known length, a known schedule, a known phasing, and a set of businesses that either made it through or didn&apos;t. Measured together, they say what the next corridor will do to the block before the first barricade goes up.</>} />
            <div className="mt-14 grid gap-x-10 md:grid-cols-2">
              {[
                ["Win the work", "Federal programs your clients chase, like the Reconnecting Communities grant behind Kalamazoo Avenue, ask applicants to show community and economic benefit. A firm that arrives with its own record of what happened to businesses on its corridors, against the rest of each city, brings evidence nobody else at the interview has."],
                ["Design the phasing on evidence", "Construction length, one block at a time or all at once, the season, whether access stayed open: across Wightman's own projects, which choices went with fewer closures? That becomes a phasing recommendation the client can defend at a public meeting."],
                ["Plan support before the barricades", "The businesses on each upcoming block, and what kind they are, are countable today. The city and the downtown authority can size wayfinding, open-during-construction marketing and relief before work starts, which is where most of the complaints, and the political cost, land."],
                ["A new line of work", "A corridor business-impact assessment, before and after, as a deliverable to cities, DDAs and state DOTs. The same public data covers every corridor in the country, so the benchmark isn't limited to Wightman's own streets."],
              ].map(([t, d], i) => (
                <div key={t} className="border-t border-[#dcdfe6] py-8">
                  <span className="text-[11px] tabular-nums text-[#3778bc]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-[18px] font-medium leading-[1.35] tracking-[-0.015em] text-[#1d1d1f]">{t}</h3>
                  <p className="mt-3 text-[14px] leading-[1.75] text-[#5b606a]">{d}</p>
                </div>
              ))}
            </div>
            <h3 className="mt-16 text-[20px] font-medium tracking-[-0.02em] text-[#1d1d1f]">The corridors ahead, counted today</h3>
            <p className="mt-2 max-w-[44rem] text-[14px] leading-[1.7] text-[#5b606a]">Places listed as open within {I.businessesNow.buffer} meters of each planned Wightman corridor, from Foursquare&apos;s open places data. The last column applies what Wightman&apos;s finished corridors showed: while work is under way, businesses on the corridor close at about {survival?.pooled?.during?.relativeRisk ?? "—"}× their city&apos;s rate.</p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-[#e4e5e9] bg-white">
              <table className="w-full min-w-[760px] text-[14px]">
                <thead>
                  <tr className="border-b border-[#e4e5e9] text-left text-[11px] uppercase tracking-[0.12em] text-[#8c8e95]">
                    {["Corridor", "Construction", "Listed open", "Dining and drinking", "Retail", "Services and offices", "Risk while under way"].map((h, i) => <th key={h} className={`px-5 py-3 font-medium ${i >= 2 ? "text-right" : ""}`}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {I.businessesNow.corridors.filter((k: Any) => k.constructionEnd && k.constructionEnd >= "2026").map((k: Any) => (
                    <tr key={k.id} className="border-b border-[#eef0f3] last:border-0">
                      <td className="px-5 py-3 text-[#1d1d1f]">{k.street}<span className="block text-[12px] text-[#8c8e95]">{k.city} · {(k.lengthMeters / 1609.34).toFixed(2)} mi</span></td>
                      <td className="px-5 py-3 text-[#5b606a]">{k.constructionStart ? ym(k.constructionStart) : "planned"} to {ym(k.constructionEnd)}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-[#1d1d1f]">{k.openNow}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-[#5b606a]">{k.openByCategory["Dining and Drinking"] ?? 0}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-[#5b606a]">{k.openByCategory["Retail"] ?? 0}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-[#5b606a]">{k.openByCategory["Business and Professional Services"] ?? 0}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-[#1d1d1f]">{survival?.pooled?.during ? `${survival.pooled.during.relativeRisk}× city` : "—"}<span className="block text-[11.5px] text-[#8c8e95]">{survival?.pooled?.during?.ci ? `range ${survival.pooled.during.ci[0]}–${survival.pooled.during.ci[1]}×` : ""}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Src>&ldquo;Listed open&rdquo; means Foursquare has no closure date on record; its listings lag real closures and include offices and public places, not only storefronts. Counts use the real street geometry, not a circle around an address.</Src>
          </div>
        </section>
      )}

      {/* Survival study */}
      {survival && (
        <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
          <div className="mx-auto max-w-[1180px] px-6 py-24">
            <Head eyebrow="05 · What happened to the businesses" a="While the street was torn up," b="its businesses closed faster. After, slower." note={<>Every business within {survival.bufferMeters} meters of {survival.pooled.corridors.length} finished Wightman corridors, compared each year with every other business in the same city. Same data, same years, same cities on both sides of the comparison, so a change in how Foursquare records closures shows up in both.</>} />
            {(() => {
              const P = survival.pooled;
              const ph = [["before", "3 years before"], ["during", "During construction"], ["after", "2 years after"]] as const;
              const max = Math.max(...ph.flatMap(([k]) => [P[k]?.corridorRate ?? 0, P[k]?.cityRate ?? 0])) * 1.15;
              return (
                <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
                  <div className="rounded-2xl border border-[#e4e5e9] bg-white p-6">
                    <div className="mb-5 flex flex-wrap gap-6 text-[13px] text-[#5b606a]">
                      <span className="inline-flex items-center gap-2"><i className="inline-block h-3 w-3 rounded-sm" style={{ background: CORRIDOR }} />Businesses on the corridor</span>
                      <span className="inline-flex items-center gap-2"><i className="inline-block h-3 w-3 rounded-sm" style={{ background: CONTROL }} />Rest of the same city</span>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      {ph.map(([k, label]) => {
                        const v = P[k];
                        if (!v) return null;
                        return (
                          <div key={k} className="flex flex-col items-center">
                            <div className="flex h-44 items-end gap-1.5" title={`${label}: corridor ${(100 * v.corridorRate).toFixed(2)}%/yr (${v.corridorClosed} of ${v.corridorPlaceYears} business-years), city ${(100 * v.cityRate).toFixed(2)}%/yr`}>
                              <span className="w-9 rounded-t-[4px]" style={{ height: `${(100 * v.corridorRate) / max}%`, background: CORRIDOR }} />
                              <span className="w-9 rounded-t-[4px]" style={{ height: `${(100 * v.cityRate) / max}%`, background: CONTROL }} />
                            </div>
                            <span className="mt-3 text-center text-[13px] text-[#1d1d1f]">{label}</span>
                            <span className="text-[22px] font-medium tracking-[-0.03em] text-[#1d1d1f]">{v.relativeRisk}×</span>
                            <span className="text-center text-[11.5px] text-[#8c8e95]">city rate{v.ci ? ` · range ${v.ci[0]}–${v.ci[1]}×` : ""}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-[14.5px] leading-[1.75] text-[#3a3f47]">
                    <p>Before construction, businesses on these streets closed at the same rate as the rest of their cities ({P.before.relativeRisk}×). While the work was under way they closed at {P.during.relativeRisk}× the city rate: {P.during.corridorClosed} closures in {P.during.corridorPlaceYears.toLocaleString()} business-years. In the two years after, they closed at {P.after.relativeRisk}× the city rate, less often than their neighbors elsewhere in town.</p>
                    <p className="mt-4">Read that plainly: the construction window costs something, and the rebuilt street appears to pay it back. With {survival.pooled.corridors.length} corridors, the ranges are wide and neither difference is proven yet. Each corridor Wightman adds narrows them, and the same records exist for every street in the country, which is how this becomes a benchmark rather than an anecdote.</p>
                  </div>
                </div>
              );
            })()}
            <div className="mt-12 overflow-x-auto rounded-2xl border border-[#e4e5e9] bg-white">
              <table className="w-full min-w-[760px] text-[13.5px]">
                <thead>
                  <tr className="border-b border-[#e4e5e9] text-left text-[11px] uppercase tracking-[0.12em] text-[#8c8e95]">
                    {["Corridor", "Built", "Businesses", "Before", "During", "After"].map((h, i) => <th key={h} className={`px-5 py-3 font-medium ${i >= 2 ? "text-right" : ""}`}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {survival.corridors.map((c: Any) => (
                    <tr key={c.id} className="border-b border-[#eef0f3] last:border-0">
                      <td className="px-5 py-3 text-[#1d1d1f]">{c.street || c.name}<span className="block text-[12px] text-[#8c8e95]">{c.city}</span></td>
                      <td className="px-5 py-3 text-[#5b606a]">{c.start === c.end ? c.end : `${c.start}–${c.end}`}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-[#5b606a]">{c.businessesInBuffer}</td>
                      {(["before", "during", "after"] as const).map((k) => {
                        const r = c.phases[k];
                        return <td key={k} className="px-5 py-3 text-right tabular-nums text-[#5b606a]">{r ? `${r.corridor.closed} closed` : "—"}<span className="block whitespace-nowrap text-[11.5px] text-[#8c8e95]">{r ? `of ${r.corridor.placeYears} business-yrs` : ""}</span></td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-12 grid gap-8 rounded-2xl border border-[#e4e5e9] bg-white p-8 lg:grid-cols-[1fr_1.3fr]">
              <div>
                <Eyebrow>What the local press recorded</Eyebrow>
                <p className="mt-3 text-[22px] font-medium leading-[1.3] tracking-[-0.02em] text-[#1d1d1f]">One corridor in thirteen made the news for its businesses. The data covers all of them.</p>
                <p className="mt-3 text-[13.5px] leading-[1.65] text-[#5b606a]">Arthur searched 267 local articles published from a year before to two years after each construction window. Only Whites Road drew coverage of what the work did to businesses, and it is the corridor with the highest measured risk while under way.</p>
              </div>
              <ul className="grid gap-4 text-[14px] leading-[1.65] text-[#3a3f47]">
                <li className="border-l-2 border-[#3778bc] pl-4">&ldquo;Owners said they have already lost business since the construction began Monday, and they are worried about going out of business if they cannot bring in customers off of the heavily-detoured road.&rdquo;<span className="mt-1 block text-[12px] text-[#8c8e95]"><a className="underline decoration-[#cfe0f2] underline-offset-2" href="https://wwmt.com/news/local/construction-kalamazoo-westnedge-sunny-mart-roads-business-customers-jobs-shut-down-westnedge-whites-traffic-drivers" target="_blank" rel="noreferrer">WWMT, March 6, 2024</a> · Whites Road and Westnedge</span></li>
                <li className="border-l-2 border-[#3778bc] pl-4">&ldquo;There are also statistics to back up some of the issues that some businesses have had, and they show that sales are down.&rdquo; The city offered rides to nine businesses in the Westnedge work zone, from Mid-Town Fresh and Ace Hardware to Happy&apos;s Pizza and Heilman&apos;s Nuts.<span className="mt-1 block text-[12px] text-[#8c8e95]"><a className="underline decoration-[#cfe0f2] underline-offset-2" href="https://wrkr.com/kalamazoo-construction-closed-businesses/" target="_blank" rel="noreferrer">WRKR, July 26, 2024</a></span></li>
              </ul>
            </div>
            <Src>Businesses are Foursquare places in retail, dining and drinking, professional services, health, and arts and entertainment. A closure counts in the year Foursquare dates it; those dates lag real closures and arrive in cleanup batches, which is why every rate is compared with the same city in the same years instead of read on its own. Pooled figures use the corridors with commercial frontage and exact street geometry: {survival.pooled.corridors.join(", ")}.</Src>
          </div>
        </section>
      )}

      {/* The street, from inside */}
      {SHOW_STREET && street && (
        <section className="mx-auto max-w-[1180px] px-6 py-24">
          <Head eyebrow="06 · The street, from inside a storefront" a="What a work zone does" b="to one business's week." note={<>Public data shows which businesses closed. It can&apos;t show the ones that stayed open and bled. Any business on a corridor can connect its point-of-sale, and Arthur lines its sales up against your construction schedule. Here is the first one: a cocktail bar on Rose Street, inside the Kalamazoo Avenue project.</>} />
          <div className="mt-10 rounded-2xl border border-[#e4e5e9] p-6">
            <div className="mb-4 flex flex-wrap gap-6 text-[13px] text-[#5b606a]">
              <span className="inline-flex items-center gap-2"><i className="inline-block h-0.5 w-6" style={{ background: CORRIDOR }} />This year</span>
              <span className="inline-flex items-center gap-2"><i className="inline-block h-0.5 w-6" style={{ background: CONTROL }} />Same weeks last year</span>
            </div>
            <StreetChart weeks={street.weeks} start={street.start} />
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {([["Before construction", street.before], ["During construction", street.during]] as [string, Any][]).map(([t, v]) => (
              <div key={t} className="rounded-2xl border border-[#e4e5e9] p-6">
                <Eyebrow>{t}</Eyebrow>
                <div className="mt-3 text-[2rem] font-medium tracking-[-0.04em] text-[#1d1d1f]">{v.all.yoyPct > 0 ? "+" : ""}{v.all.yoyPct}%</div>
                <p className="mt-1 text-[13.5px] leading-[1.6] text-[#5b606a]">year over year, {v.all.nights} nights. Saturdays {v.sat.yoyPct > 0 ? "+" : ""}{v.sat.yoyPct}%, Fridays {v.fri.yoyPct > 0 ? "+" : ""}{v.fri.yoyPct}%, Tuesday–Thursday {v.weeknights.yoyPct > 0 ? "+" : ""}{v.weeknights.yoyPct}%.</p>
              </div>
            ))}
            <div className="rounded-2xl border border-[#e8d5bd] bg-[#fdf8f1] p-6">
              <Eyebrow>The confound, stated</Eyebrow>
              <p className="mt-3 text-[13.5px] leading-[1.65] text-[#3a3f47]">
                The {Math.abs(street.gapPts)}-point swing sits almost entirely on Saturdays, and last year&apos;s biggest Saturdays in this window were event nights:
                {street.lyTopDuring.map((r: Any, i: number) => ` ${new Date(`${r.lyDate}T12:00:00`).toLocaleString("en-US", { month: "short", day: "numeric" })} ($${r.lyNet.toLocaleString()} vs $${r.net.toLocaleString()} this year)${i < street.lyTopDuring.length - 1 ? "," : "."}`)}
                {" "}Part of the drop is a different event calendar, not the street. One business can&apos;t separate the two. A corridor of them, set against a control street, can.
              </p>
            </div>
          </div>
          <Src>Toast point-of-sale net sales before tax and tip, by business date; last year means the same weekday 52 weeks earlier. Construction start {street.start} from the City of Kalamazoo Streets for All page.</Src>
        </section>
      )}

      {/* Contracts */}
      {contracts && (
        <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
          <div className="mx-auto max-w-[1180px] px-6 py-24">
            <Head eyebrow="07 · Your contract record, assembled" a="Every approval, in one place," b="read from the agendas." note={<>Each contract action approved by a client&apos;s council or commission, with the amount as written and the meeting it came from. {contracts.coverage ? `Arthur read ${contracts.coverage.reduce((s: number, b: Any) => s + (b.meetingsScanned || 0), 0).toLocaleString()} meetings across ${contracts.coverage.filter((b: Any) => b.meetingsScanned).length} public bodies, 2016 to today. Most of it lives only in PDF packets no one searches.` : ""}</>} />
            <div className="mt-12 grid gap-12 lg:grid-cols-2">
              {["City of Kalamazoo", "City of Portage"].map((cl) => {
                const rows = (contracts.share || []).filter((s: Any) => s.client === cl && s.amount > 0).slice(0, 8);
                if (!rows.length) return null;
                return (
                  <div key={cl}>
                    <h3 className="mb-5 text-[15px] font-medium text-[#1d1d1f]">{cl}: engineering dollars approved, 2016–2026</h3>
                    <Bars rows={rows.map((s: Any) => ({ label: `${s.firm} · ${s.count}`, value: s.amount, sub: `${s.count} actions` }))} />
                  </div>
                );
              })}
            </div>
            <Src>Share of wallet: every engineering contract, amendment and task order the same body approved, by firm, with the number of actions after the firm name. Amounts are as written in the agenda packets and minutes; actions without a stated amount are counted but add nothing.</Src>
            <h3 className="mt-14 text-[20px] font-medium tracking-[-0.02em] text-[#1d1d1f]">Wightman&apos;s largest approvals</h3>
            <ol className="mt-4 grid gap-0">
              {[...contracts.contracts].filter((k: Any) => k.amount).sort((a: Any, b: Any) => b.amount - a.amount).slice(0, 10).map((k: Any) => (
                <li key={k.date + k.project} className="grid grid-cols-[6.5rem_1fr_auto] gap-4 border-t border-[#e4e5e9] py-4 text-[14px]">
                  <span className="tabular-nums text-[#8c8e95]">{usd(k.date)}</span>
                  {(() => {
                    const d = (rows as Any).contracts.find((r: Any) => r.doc && r.date === k.date && r.project === k.project)?.doc;
                    return (
                      <span>
                        <a href={d?.href ?? k.source} target="_blank" rel="noreferrer" className="text-[#1d1d1f] underline decoration-[#cfe0f2] underline-offset-2">{k.project}</a>
                        <span className="block text-[12.5px] text-[#8c8e95]">
                          {k.client} · {k.action}
                          {d && <> · <a href={d.href} target="_blank" rel="noreferrer" className="text-[#3778bc] underline decoration-[#cfe0f2] underline-offset-2">official agenda report, pp. {d.pages[0]}{d.pages[1] !== d.pages[0] ? `–${d.pages[1]}` : ""}</a></>}
                        </span>
                      </span>
                    );
                  })()}
                  <span className="tabular-nums text-[#1d1d1f]">{$m(k.amount)}</span>
                </li>
              ))}
            </ol>
            <Src>{contracts.contracts.length} Wightman actions in all, {contracts.contracts.filter((k: Any) => !k.amount).length} without a stated amount.</Src>
            {contracts.coverage && (
              <div className="mt-12 overflow-x-auto rounded-2xl border border-[#e4e5e9] bg-white">
                <table className="w-full min-w-[640px] text-[13.5px]">
                  <thead>
                    <tr className="border-b border-[#e4e5e9] text-left text-[11px] uppercase tracking-[0.12em] text-[#8c8e95]">
                      {["Public body searched", "Years", "Meetings read"].map((h, i) => <th key={h} className={`px-5 py-3 font-medium ${i === 2 ? "text-right" : ""}`}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.coverage.filter((b: Any) => b.meetingsScanned > 0).map((b: Any) => (
                      <tr key={b.body} className="border-b border-[#eef0f3] last:border-0">
                        <td className="px-5 py-3 text-[#1d1d1f]">{b.body.split(" — ")[0]}<span className="block text-[12px] text-[#8c8e95]">{b.body.split(" — ")[1] ?? ""}</span></td>
                        <td className="px-5 py-3 text-[#5b606a]">{b.from ? `${b.from.slice(0, 4)}–${(b.to || "").slice(0, 4)}` : "—"}</td>
                        <td className="px-5 py-3 text-right tabular-nums text-[#5b606a]">{b.meetingsScanned || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Ask Arthur */}
      <section id="ask" className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto grid max-w-[1180px] items-start gap-12 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Ask Arthur</Eyebrow>
            <Two a="Ask it anything." b="It answers with the source." />
            <p className="mt-6 max-w-[28rem] text-[15px] leading-[1.7] text-[#6c7481]">
              This preview knows everything on this page: the pipeline, the federal money, your corridors, the business study and
              your contract record. Connected to Wightman&apos;s own files, the same question gets the inside answer, with the same
              rule: no source, no answer.
            </p>
          </div>
          <CivicAsk
            token={c.token}
            endpoint="/api/wightman/ask"
            source="Wightman territory brief"
            presets={[
              "Which funded projects near our offices have no engineer yet?",
              "Who is winning work from our biggest client?",
              "What would Michigan Avenue do to the businesses on it?",
              "Where is federal money headed in Kalamazoo County?",
              "What would the first 30 days look like?",
            ]}
            placeholder="Ask anything about your territory"
            inputLabel="Ask Arthur a question about Wightman's territory brief"
            reading="Arthur is working on"
          />
        </div>
      </section>

      {/* Security & privacy */}
      <section className="bg-[#111217] text-white">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow dark>Security and privacy</Eyebrow>
              <Two dark a="Your clients' data is the firm." b="It stays under your rules." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#a3a8b2]">
              Municipal clients will ask how their data is handled before they ask what the AI can do. This is the answer.
            </p>
          </div>
          <div className="mt-14 grid gap-x-10 md:grid-cols-2">
            {[
              ["Wightman's data stays Wightman's", "Contracts and project files sit in an environment for Wightman alone, never mixed with another client's, and nothing is used to train a model."],
              ["People approve, Arthur prepares", "Drafts, answers and alerts come with their source. Anything that goes to a client, spends money or makes a commitment waits for a person."],
              ["Every figure is traceable", "A number without a source isn't shown. Each answer links back to the document and page it came from."],
              ["Policy first, then tools", "Which tools, which data, who approves: your policy sets the boundaries, and the pilot runs inside them."],
            ].map(([t, d], i) => (
              <div key={t} className="border-t border-[#2a2c33] py-8">
                <span className="text-[11px] tabular-nums text-[#6f7480]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[18px] font-medium leading-[1.35] tracking-[-0.015em]">{t}</h3>
                <p className="mt-3 text-[14px] leading-[1.75] text-[#a3a8b2]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we would begin */}
      <section id="begin" className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow>How we would begin</Eyebrow>
            <Two a="One office, one question," b="thirty days." />
            <p className="mt-6 max-w-[30rem] text-[15px] leading-[1.7] text-[#6c7481]">
              Nothing here needs a new system at Wightman or access to anything private. It starts from public records and grows
              only as far as it proves useful.
            </p>
          <ol className="mt-10 grid gap-6">
            {[
              ["Walk through it with your team", "This page on the screen with the people you pick, and the questions you'd want answered for the Kalamazoo office first."],
              ["Pick the pilot", "The Kalamazoo corridor forecast for Michigan Avenue and the Spaghetti Bowl, a look at the new state and federal money in your counties, or both."],
              ["Run it for thirty days", "Arthur answers the questions you pick, on the corridor or the market you choose, with the source behind every figure."],
              ["Decide on what it found", "Keep what earned its place, drop what didn't, and decide together whether it goes firm-wide."],
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
            deliverables={[{ slug: "intelligence", title: "Territory intelligence brief" }]}
            intent="start"
            heading="Reply to us"
            blurb="Tell us which question you'd want answered first, or when to walk your team through it."
          />
        </div>
      </section>

      <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-12">
          <details>
            <summary className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777980] hover:text-[#3778bc]">Sources and method</summary>
            <ul className="mt-5 grid max-w-[72ch] gap-2 text-[13px] leading-[1.6] text-[#6c7481]">
              {water?.sources?.map((s: Any) => <li key={s.url ?? s.name}>{s.name ?? s.url}{s.fiscalYear ? `, ${s.fiscalYear}` : ""}{s.url ? <> · <a className="underline" href={s.url}>source</a></> : null}</li>)}
              <li>Federal: USAspending.gov award search, grant types 02–05, recipient located in the county, awarding agencies DOT, EPA, HUD, DHS/FEMA and Commerce/EDA.</li>
              <li>Corridors: Wightman project pages and press, with dates from city pages and local news; geometry traced between intersection nodes from OpenStreetMap via Overpass.</li>
              <li>Built {new Date(I.builtAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}. Arthur is not connected to any Wightman system; everything here is public record, plus one business&apos;s own sales with its owner&apos;s consent.</li>
            </ul>
          </details>
        </div>
      </section>
    </div>
  );
}
