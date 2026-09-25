"use client";

import { useMemo, useState } from "react";
import { CorridorMap } from "./CorridorMap";
import { Sun, Droplets, Landmark, Map as MapIcon, Store, FileText } from "lucide-react";

/* Wightman territory dashboard: five working views over public records, filtered by state and county,
   every table sortable, every row linked to its source. Light surface, one blue for magnitude, amber only
   for the comparison city in the business view (validated pair). */

type Any = any; // eslint-disable-line @typescript-eslint/no-explicit-any
const BLUE = "#3778bc", AMBER = "#c07a2c", INK = "#1d1d1f", MUTED = "#8c8e95";
const $m = (n: number) => (n == null ? "—" : n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${Math.round(n / 1e3)}K` : `$${Math.round(n)}`);
const usd = (s?: string | null) => { const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(s ?? ""); return m ? `${"JanFebMarAprMayJunJulAugSepOctNovDec".slice(+m[2] * 3 - 3, +m[2] * 3)}${m[3] ? ` ${+m[3]},` : ""} ${m[1]}` : s ?? ""; };
const ASKS = [
  "Which funded projects in Kalamazoo County have no engineer yet?",
  "Who else is the City of Portage approving for engineering?",
  "What did our corridors do to the businesses on them?",
  "What federal money is headed to Allegan County?",
];
const TABS = [
  ["today", "Today", Sun],
  ["water", "Water pipeline", Droplets],
  ["federal", "Federal money", Landmark],
  ["corridors", "Your corridors", MapIcon],
  ["business", "Businesses", Store],
  ["contracts", "Contracts", FileText],
] as const;
type Tab = (typeof TABS)[number][0];

function useSort(list: Any[], initial: string, desc = true) {
  const [key, setKey] = useState<string>(initial);
  const [down, setDown] = useState(desc);
  const sorted = useMemo(() => [...list].sort((a: Any, b: Any) => {
    const x = a[key], y = b[key];
    const c = typeof x === "number" || typeof y === "number" ? (x ?? -Infinity) - (y ?? -Infinity) : String(x ?? "").localeCompare(String(y ?? ""));
    return down ? -c : c;
  }), [list, key, down]);
  const head = (k: string, label: string, right = false) => (
    <th
      key={k}
      onClick={() => (k === key ? setDown(!down) : (setKey(k), setDown(true)))}
      className={`cursor-pointer select-none whitespace-nowrap px-4 py-3 font-medium hover:text-[#1d1d1f] ${right ? "text-right" : "text-left"}`}
      aria-sort={k === key ? (down ? "descending" : "ascending") : "none"}
    >
      {label}
      {k === key ? (down ? " ↓" : " ↑") : ""}
    </th>
  );
  return { sorted, head };
}

function Kpi({ k, label }: { k: string; label: string }) {
  return (
    <div className="rounded-[12px] border border-[#edf0f4] bg-white p-4 sm:p-5">
      <span className="block text-[26px] font-medium leading-none tracking-[-0.035em] text-[#1d1d1f] tabular-nums sm:text-[28px]">{k}</span>
      <span className="mt-2.5 block text-[12.5px] leading-[1.45] text-[#323b48]">{label}</span>
    </div>
  );
}

function BarList({ rows, onPick, picked, cols = 1 }: { rows: { key: string; value: number; sub?: string }[]; onPick?: (k: string) => void; picked?: string | null; cols?: number }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className={cols === 2 ? "grid gap-1.5 md:grid-cols-2 md:gap-x-10" : "grid gap-1.5"}>
      {rows.map((r) => (
        <button
          key={r.key}
          type="button"
          onClick={() => onPick?.(r.key === picked ? "" : r.key)}
          className={`grid grid-cols-[minmax(6rem,10rem)_1fr_4.5rem] items-center gap-3 rounded-md px-1.5 py-1 text-left text-[12.5px] hover:bg-[#f5f5f7] ${picked === r.key ? "bg-[#eaf2fb]" : ""}`}
          title={`${r.key}: ${$m(r.value)}${r.sub ? ` · ${r.sub}` : ""}`}
        >
          <span className="truncate text-[#1d1d1f]">{r.key}</span>
          <span className="h-3 rounded-r-[4px]" style={{ width: `${Math.max(1.5, (100 * r.value) / max)}%`, background: BLUE }} />
          <span className="text-right tabular-nums text-[#5b606a]">{$m(r.value)}</span>
        </button>
      ))}
    </div>
  );
}

function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-h-[560px] overflow-auto rounded-2xl border border-[#e4e5e9] bg-white">
      <table className="w-full min-w-[720px] text-[13px]">{children}</table>
    </div>
  );
}
const THEAD = "sticky top-0 z-10 border-b border-[#e4e5e9] bg-white text-[10.5px] uppercase tracking-[0.1em] text-[#8c8e95]";

/* Territory map: every corridor's real geometry on one equirectangular frame. */
function TerritoryMap({ corridors, picked, onPick, labelStreets = false }: { corridors: Any[]; picked: number | null; onPick: (id: number | null) => void; labelStreets?: boolean }) {
  const lines = corridors.filter((c) => c.coords?.length > 1);
  const all = lines.flatMap((c) => c.coords);
  if (!all.length) return null;
  const lat0 = all.reduce((s: number, p: number[]) => s + p[1], 0) / all.length, k = Math.cos((lat0 * Math.PI) / 180);
  const xs = all.map((p: number[]) => p[0] * k), ys = all.map((p: number[]) => p[1]);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const W = 900, H = 560, pad = 40, s = Math.min((W - 2 * pad) / (maxX - minX), (H - 2 * pad) / (maxY - minY));
  const ox = (W - 2 * pad - s * (maxX - minX)) / 2 - 60, oy = (H - 2 * pad - s * (maxY - minY)) / 2;
  const X = (p: number[]) => pad + Math.max(0, ox) + s * (p[0] * k - minX), Y = (p: number[]) => H - pad - oy - s * (p[1] - minY);
  const cities = new Map<string, number[]>();
  for (const c of lines) if (!cities.has(c.city)) cities.set(c.city, c.coords[Math.floor(c.coords.length / 2)]);
  // Labels sit right of each marker (street names zoomed in, city names zoomed out); a label that would
  // overlap one already placed moves down a line.
  const mid = (c: Any) => c.coords[Math.floor(c.coords.length / 2)];
  const items = labelStreets
    ? lines.map((c) => ({ id: c.id, p: mid(c), t: String(c.street).split(/[\/(]/)[0].trim() }))
    : [...cities].map(([t, p], i) => ({ id: -1 - i, p, t }));
  const labels: { id: number; x: number; y: number; t: string }[] = [];
  for (const it of items.sort((a, b) => Y(a.p) - Y(b.p))) {
    const x = X(it.p) + 12, w = it.t.length * 6.6;
    let y = Y(it.p) + 4;
    while (labels.some((l) => Math.abs(l.y - y) < 15 && x < l.x + l.t.length * 6.6 && l.x < x + w)) y += 15;
    labels.push({ id: it.id, x, y, t: it.t });
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full rounded-2xl border border-[#e4e5e9] bg-[#f7f8fa]" role="img" aria-label="Map of Wightman corridors">
      {lines.map((c) => {
        const d = c.coords.map((p: number[], i: number) => `${i ? "L" : "M"}${X(p).toFixed(1)},${Y(p).toFixed(1)}`).join(" ");
        const on = picked === c.id;
        return (
          <g key={c.id} className="cursor-pointer" onClick={() => onPick(on ? null : c.id)}>
            <path d={d} fill="none" stroke="transparent" strokeWidth={16} />
            <circle cx={X(c.coords[Math.floor(c.coords.length / 2)])} cy={Y(c.coords[Math.floor(c.coords.length / 2)])} r={on ? 9 : 6} fill={on ? INK : BLUE} fillOpacity={0.9} stroke="#fff" strokeWidth={2} />
            <path d={d} fill="none" stroke={on ? INK : BLUE} strokeWidth={on ? 6 : 4} strokeLinecap="round" strokeLinejoin="round">
              <title>{`${c.street} · ${c.city}`}</title>
            </path>
          </g>
        );
      })}
      {labels.map((l) => (
        <text key={`l${l.id}`} x={l.x} y={l.y} fontSize="12" fill={picked === l.id ? INK : "#3d424b"} stroke="#f7f8fa" strokeWidth={4} paintOrder="stroke" className="pointer-events-none">{l.t}</text>
      ))}
    </svg>
  );
}

export function WightmanDashboard({ token, preparedFor, rows, corridors, survival, businessesNow, builtAt, embedded = false }: { token: string; preparedFor: string; rows: Any; corridors: Any[]; survival: Any; businessesNow: Any; builtAt: string; embedded?: boolean }) {
  const [tab, setTab] = useState<Tab>("today");
  const [askQ, setAskQ] = useState("");
  const [asking, setAsking] = useState(false);
  const [askErr, setAskErr] = useState("");
  const [askOut, setAskOut] = useState<Any>(null);
  async function askArthur(e?: React.FormEvent, preset?: string) {
    e?.preventDefault();
    const question = preset ?? (askQ.trim() || "Which funded projects near our Kalamazoo office have no engineer yet?");
    if (preset) setAskQ(preset);
    setAsking(true);
    setAskErr("");
    try {
      const res = await fetch("/api/wightman/ask", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, question }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Arthur could not answer just now.");
      setAskOut(data);
    } catch (err) {
      setAskErr(err instanceof Error ? err.message : "Arthur could not answer just now.");
    } finally {
      setAsking(false);
    }
  }
  const [state, setState] = useState("All");
  const [county, setCounty] = useState("");
  const [q, setQ] = useState("");
  const [corr, setCorr] = useState<number | null>(null);
  const [client, setClient] = useState("City of Kalamazoo");
  const [zoom, setZoom] = useState<"Territory" | "Kalamazoo & Portage">("Territory");

  const inScope = (r: Any) => (state === "All" || r.state === state) && (!county || r.county === county) && (!q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
  const water = useMemo(() => rows.water.filter(inScope), [rows, state, county, q]); // eslint-disable-line react-hooks/exhaustive-deps
  const fed = useMemo(() => rows.federal.filter(inScope), [rows, state, county, q]); // eslint-disable-line react-hooks/exhaustive-deps
  const counties = useMemo(() => {
    const src = tab === "federal" ? rows.federal : rows.water;
    const m: Record<string, number> = {};
    for (const r of src) if ((state === "All" || r.state === state) && r.county) m[r.county] = (m[r.county] ?? 0) + (r.amount || 0);
    return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([key, value]) => ({ key, value }));
  }, [rows, tab, state]);

  const W = useSort(water, "amount");
  const F = useSort(fed, "amount");
  const clientRows = useMemo(() => rows.contracts.filter((r: Any) => r.client === client && (!q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()))), [rows, client, q]);
  const C = useSort(clientRows, "date");
  const share = useMemo(() => {
    const m: Record<string, { key: string; value: number; n: number }> = {};
    for (const r of clientRows) { const f = (m[r.firm] ||= { key: r.firm, value: 0, n: 0 }); f.value += r.amount || 0; f.n++; }
    return Object.values(m).sort((a, b) => b.value - a.value).map((f) => ({ key: `${f.key} · ${f.n}`, value: f.value }));
  }, [clientRows]);
  const clients = useMemo(() => Array.from(new Set<string>(rows.contracts.map((r: Any) => r.client))).sort(), [rows]);

  const mapped = (corridors || []).filter((c: Any) => c.coords?.length > 1);
  const inView = zoom === "Territory" ? mapped : mapped.filter((c: Any) => /Kalamazoo|Portage/.test(c.city));
  const pickedCorr = mapped.find((c: Any) => c.id === corr);
  const survFor = (c: Any) => survival?.corridors?.find((s: Any) => s.id === c?.id);
  const nowFor = (c: Any) => businessesNow?.corridors?.find((s: Any) => s.id === c?.id);

  const waterTotal = water.reduce((s: number, r: Any) => s + (r.amount || 0), 0);
  const noEng = water.filter((r: Any) => !r.engineer);
  const fedTotal = fed.reduce((s: number, r: Any) => s + (r.amount || 0), 0);

  return (
    <div className={embedded ? "" : "ll-os min-h-screen bg-[#f5f5f7]"}>
      <div className={embedded ? "" : "mx-auto max-w-[1340px] px-4 pb-16 pt-8 sm:px-6"}>
        {!embedded && <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777980]">Wightman · prepared for {preparedFor}</span>
            <h1 className="mt-2 text-[clamp(1.6rem,3vw,2.2rem)] font-medium tracking-[-0.04em] text-[#1d1d1f]">What Arthur can see across your territory</h1>
          </div>
          <a href={`/p/wightman/${token}`} className="rounded-full border border-[#dcdfe6] bg-white px-4 py-2 text-[13px] text-[#1d1d1f] hover:border-[#3778bc]">Back to the brief</a>
        </div>}

        {/* The LOVELEEDAY system shell, same as every client workspace: window bar, workspace nav, pane. */}
        <div className="ll-os overflow-hidden rounded-[16px] border border-[#dcdfe6] bg-white shadow-[0_24px_56px_#202d4210]">
          <div className="flex min-h-[56px] flex-wrap items-center justify-between gap-2 border-b border-[#edf0f4] px-4 py-3 text-[11px] text-[#8b8e96] sm:px-6">
            <div className="flex items-center gap-4">
              <span className="flex gap-1" aria-hidden="true">
                <i className="h-2 w-2 rounded-full bg-[#dfe2e8]" />
                <i className="h-2 w-2 rounded-full bg-[#dfe2e8]" />
                <i className="h-2 w-2 rounded-full bg-[#dfe2e8]" />
              </span>
              <span>LOVELEEDAY / Wightman</span>
            </div>
            <span className="flex items-center gap-2 text-[11px]">
              <i className="h-[5px] w-[5px] rounded-full bg-[#719cb1]" aria-hidden="true" />
              Interactive system preview
            </span>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[210px_minmax(0,1fr)]">
            <nav className="flex min-w-0 gap-1 overflow-x-auto border-b border-[#edf0f4] bg-[#fafbfc] p-2 lg:flex-col lg:border-b-0 lg:border-r lg:px-4 lg:py-6" aria-label="Dashboard">
              <span className="mx-2 mb-3 hidden text-[9px] uppercase tracking-[0.12em] text-[#6a6e77] lg:block">Workspace</span>
              {TABS.map(([k, label, Icon]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTab(k)}
                  className={`flex min-h-[36px] shrink-0 items-center gap-2 rounded-[8px] px-2.5 text-left text-[12.5px] ${tab === k ? "bg-[#eaf1fb] text-[#3778bc]" : "text-[#8b8f99] hover:bg-[#f1f3f6] hover:text-[#4a4f58]"}`}
                >
                  <Icon size={14} strokeWidth={1.6} />
                  {label}
                </button>
              ))}
              <span className="mx-2 my-6 hidden h-px bg-[#e8ebef] lg:block" />
              <span className="mx-2 mb-3 hidden text-[9px] uppercase tracking-[0.12em] text-[#6a6e77] lg:block">Connected context</span>
              <p className="mx-2 hidden text-[11px] leading-[1.8] text-[#6a6e77] lg:block">
                EGLE, IFA and Ohio EPA lists
                <br />USAspending.gov
                <br />City meeting records
                <br />OpenStreetMap streets
                <br />Foursquare open places
              </p>
              <span className="mx-2 mb-3 mt-6 hidden text-[9px] uppercase tracking-[0.12em] text-[#6a6e77] lg:block">Once connected</span>
              <p className="mx-2 hidden text-[11px] leading-[1.8] text-[#a0a4ad] lg:block">
                Contracts and task orders
                <br />Invoices and budgets
                <br />Project schedules
              </p>
            </nav>

            <div className="min-w-0 bg-white p-4 sm:p-6 lg:p-8">
        {(tab === "water" || tab === "federal" || tab === "contracts") && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-[13px]">
            {tab !== "contracts" && (
              <>
                <select value={state} onChange={(e) => { setState(e.target.value); setCounty(""); }} className="rounded-lg border border-[#dcdfe6] bg-white px-3 py-2" aria-label="State">
                  {["All", "MI", "IN", "OH"].map((s) => <option key={s} value={s}>{s === "All" ? "All states" : s}</option>)}
                </select>
                <select value={county} onChange={(e) => setCounty(e.target.value)} className="rounded-lg border border-[#dcdfe6] bg-white px-3 py-2" aria-label="County">
                  <option value="">All counties</option>
                  {counties.map((c) => <option key={c.key} value={c.key}>{c.key}</option>)}
                </select>
              </>
            )}
            {tab === "contracts" && (
              <select value={client} onChange={(e) => setClient(e.target.value)} className="rounded-lg border border-[#dcdfe6] bg-white px-3 py-2" aria-label="Client">
                {clients.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search names, programs, firms" className="min-w-[220px] flex-1 rounded-lg border border-[#dcdfe6] bg-white px-3 py-2" aria-label="Search" />
          </div>
        )}

        {/* Today: what Phil would open each morning. Public items come from the data; sample items need Wightman's own files. */}
        {tab === "today" && (() => {
          const newOpen = rows.water.filter((r: Any) => /draft \(new\)/i.test(r.status) && !r.engineer).sort((a: Any, b: Any) => b.amount - a.amount).slice(0, 3);
          const comp = rows.contracts.filter((r: Any) => r.firm !== "Wightman" && r.amount).sort((a: Any, b: Any) => (a.date < b.date ? 1 : -1))[0];
          const kzFed = rows.federal.filter((r: Any) => r.county === "Kalamazoo" && r.date).sort((a: Any, b: Any) => (a.date < b.date ? 1 : -1))[0];
          const kave = businessesNow?.corridors?.find((c: Any) => c.street === "Kalamazoo Avenue");
          const items: { tag: "public" | "sample"; kind: string; title: string; body: string; href?: string }[] = [
            ...newOpen.map((r: Any) => ({ tag: "public" as const, kind: "New on the state list", title: `${r.applicant}: ${$m(r.amount)} ${r.program}`, body: `${r.description ?? "Water and sewer work"}. On the FY2027 draft list for the first time, and no engineer is named anywhere public yet.`, href: r.source ?? undefined })),
            ...(comp ? [{ tag: "public" as const, kind: "Competitor approval", title: `${comp.firm} · ${comp.client}`, body: `${comp.project}, ${$m(comp.amount)}, approved ${usd(comp.date)}.`, href: comp.source ?? undefined }] : []),
            ...(kzFed ? [{ tag: "public" as const, kind: "Federal money in Kalamazoo County", title: `${kzFed.recipient}: ${$m(kzFed.amount)}`, body: `${kzFed.program}. Awarded ${usd(kzFed.date)}.`, href: kzFed.url }] : []),
            ...(kave ? [{ tag: "public" as const, kind: "Corridor watch", title: `Kalamazoo Avenue: ${kave.openNow} places on the blocks`, body: `Under construction now. ${kave.openByCategory["Dining and Drinking"] ?? 0} restaurants and bars sit within 100 meters; on your finished corridors, businesses closed at ${survival?.pooled?.during?.relativeRisk}x their city's rate while work was under way.` }] : []),
            { tag: "sample", kind: "Contract", title: "Kalamazoo Avenue construction engineering: what's left?", body: "Once connected to your contract files: the $2,139,900 agreement, every invoice against it, the remaining not-to-exceed, and the next deliverable date, with the page each figure came from." },
            { tag: "sample", kind: "Deadline", title: "Three task orders pass 80% of their ceiling this month", body: "Once connected: every task order across your offices, watched against its not-to-exceed, flagged before an amendment is needed rather than after." },
          ];
          return (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <Kpi k={$m(rows.water.filter((r: Any) => !r.engineer).reduce((s: number, r: Any) => s + r.amount, 0))} label="funded water work, no engineer on record" />
                <Kpi k={String(rows.water.filter((r: Any) => /draft \(new\)/i.test(r.status)).length)} label="projects new to the FY2027 draft list" />
                <Kpi k={`${survival?.pooled?.during?.relativeRisk}×`} label="closure rate on your corridors during work" />
                <Kpi k={String(rows.contracts.filter((r: Any) => r.firm === "Wightman").length)} label="Wightman approvals read from 1,179 meetings" />
              </div>

              <form onSubmit={askArthur} className="rounded-[12px] border border-[#edf0f4] bg-[#fcfcfd] p-4 sm:p-5">
                <div className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-[linear-gradient(130deg,#f1f5fa,#e1e9f7)] text-[18px] text-[#618bbc]" aria-hidden="true">✧</span>
                  <div className="min-w-0 flex-1">
                    <label htmlFor="wm-ask" className="block text-[14px] font-medium text-[#1d1d1f]">Ask Arthur about your territory</label>
                    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-[8px] border border-[#e2e6ed] bg-white p-1.5 pl-3 focus-within:border-[#b9cde8]">
                      <input id="wm-ask" value={askQ} onChange={(e) => setAskQ(e.target.value)} placeholder="Which funded projects near our Kalamazoo office have no engineer yet?" className="min-w-[200px] flex-1 bg-transparent text-[13.5px] outline-none" />
                      <button type="submit" disabled={asking} className="min-h-[34px] rounded-[7px] bg-[#1d1d1f] px-4 text-[12.5px] text-white disabled:opacity-50">{asking ? "Reading…" : "Ask"}</button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {ASKS.map((a) => (
                        <button key={a} type="button" disabled={asking} onClick={() => askArthur(undefined, a)} className="min-h-[32px] rounded-full border border-[#e8ebf0] bg-white px-3 text-[12px] text-[#818692] hover:border-[#d8e6f8] hover:text-[#3970af] disabled:opacity-50">{a}</button>
                      ))}
                    </div>
                    {askErr && <p className="mt-2 text-[12px] text-[#a0603a]">{askErr}</p>}
                    {askOut && (
                      <div className="mt-4 max-w-[640px] text-[13.5px] leading-[1.75] text-[#6c7481]">
                        <strong className="font-medium text-[#323b48]">{askOut.head}</strong>
                        <br />
                        {askOut.answer}
                        {askOut.evidence?.length > 0 && (
                          <div className="mt-3 border-l border-[#cbd9ed] pl-4 text-[12px] leading-[1.8] text-[#778393]">
                            <strong className="font-medium text-[#394b64]">Grounded in</strong>
                            {askOut.evidence.map((ev: string, i: number) => <span key={i} className="block">{ev}</span>)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </form>

              <div>
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[14px] font-medium text-[#1d1d1f]">Good morning, Phil. Here&apos;s what changed.</h3>
                  <span className="text-[11.5px] text-[#8b8e96]">Public record items are real today. Sample items show what your own files fill in.</span>
                </div>
                <div className="grid gap-3 xl:grid-cols-2">
                  {items.map((it, i) => (
                    <div key={i} className="rounded-[12px] border border-[#edf0f4] bg-white p-5">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6a6e77]">{it.kind}</span>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${it.tag === "public" ? "bg-[#f0f5fc] text-[#3970af]" : "bg-[#fbf3ed] text-[#a0603a]"}`}>{it.tag === "public" ? "Public record" : "Sample data"}</span>
                      </div>
                      <h4 className="mt-2 text-[14.5px] font-medium leading-[1.4] tracking-[-0.01em] text-[#1d1d1f]">{it.href ? <a href={it.href} target="_blank" rel="noreferrer" className="underline decoration-[#cfe0f2] underline-offset-2">{it.title}</a> : it.title}</h4>
                      <p className="mt-1.5 text-[12.5px] leading-[1.65] text-[#6c7481]">{it.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Water */}
        {tab === "water" && (
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Kpi k={$m(waterTotal)} label={`in ${water.length} ranked water and sewer projects`} />
              <Kpi k={String(noEng.length)} label={`with no engineer on record, worth ${$m(noEng.reduce((s: number, r: Any) => s + r.amount, 0))}`} />
              <Kpi k={String(water.filter((r: Any) => /LSLR/.test(r.program)).length)} label="lead service line projects" />
              <Kpi k={String(water.filter((r: Any) => /draft/i.test(r.status)).length)} label="new or carried onto the FY2027 draft list" />
            </div>
            <div className="grid gap-6">
              <div className="rounded-2xl border border-[#e4e5e9] bg-white p-5">
                <h3 className="mb-3 text-[14px] font-medium text-[#1d1d1f]">By county · click to filter</h3>
                <BarList cols={2} rows={counties.slice(0, 18)} picked={county} onPick={setCounty} />
              </div>
              <Table>
                <thead className={THEAD}><tr>{W.head("applicant", "Applicant")}{W.head("county", "County")}{W.head("program", "Program")}{W.head("amount", "Amount", true)}{W.head("engineer", "Engineer of record")}</tr></thead>
                <tbody>
                  {W.sorted.map((r: Any) => (
                    <tr key={r.id} className="border-b border-[#eef0f3] last:border-0 hover:bg-[#fafbfc]">
                      <td className="px-4 py-2.5 text-[#1d1d1f]">{r.source ? <a href={r.source} target="_blank" rel="noreferrer" className="underline decoration-[#cfe0f2] underline-offset-2">{r.applicant}</a> : r.applicant}<span className="block max-w-[26rem] truncate text-[11.5px] text-[#8c8e95]" title={r.description ?? ""}>{r.description}</span></td>
                      <td className="px-4 py-2.5 text-[#5b606a]">{r.county}, {r.state}</td>
                      <td className="px-4 py-2.5 text-[#5b606a]">{r.program}<span className="block whitespace-nowrap text-[11.5px] text-[#8c8e95]">{r.status}</span></td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-[#1d1d1f]">{$m(r.amount)}</td>
                      <td className="px-4 py-2.5">{r.engineer ? <span className="text-[#1d1d1f]">{r.engineer}{r.partial ? <span className="text-[#8c8e95]"> · partly confirmed</span> : null}</span> : <span className="rounded-full bg-[#eaf2fb] px-2 py-0.5 text-[11.5px] font-medium text-[#2d6aa8]">Open</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}

        {/* Federal */}
        {tab === "federal" && (
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Kpi k={$m(fedTotal)} label={`across the ${fed.length} largest awards in view`} />
              <Kpi k={$m(fed.filter((r: Any) => r.kind === "Direct").reduce((s: number, r: Any) => s + r.amount, 0))} label="granted directly to cities, counties and authorities" />
              <Kpi k={$m(fed.filter((r: Any) => r.kind !== "Direct").reduce((s: number, r: Any) => s + r.amount, 0))} label="routed through MDOT, INDOT, ODOT and state agencies" />
              <Kpi k={String(new Set(fed.map((r: Any) => r.program)).size)} label="federal programs represented" />
            </div>
            <div className="grid gap-6">
              <div className="rounded-2xl border border-[#e4e5e9] bg-white p-5">
                <h3 className="mb-3 text-[14px] font-medium text-[#1d1d1f]">By county · click to filter</h3>
                <BarList cols={2} rows={counties.slice(0, 18)} picked={county} onPick={setCounty} />
              </div>
              <Table>
                <thead className={THEAD}><tr>{F.head("recipient", "Recipient")}{F.head("county", "County")}{F.head("kind", "Route")}{F.head("program", "Program")}{F.head("amount", "Amount", true)}</tr></thead>
                <tbody>
                  {F.sorted.slice(0, 300).map((r: Any, i: number) => (
                    <tr key={r.url + i} className="border-b border-[#eef0f3] last:border-0 hover:bg-[#fafbfc]">
                      <td className="px-4 py-2.5"><a href={r.url} target="_blank" rel="noreferrer" className="text-[#1d1d1f] underline decoration-[#cfe0f2] underline-offset-2">{r.recipient}</a><span className="block text-[11.5px] text-[#8c8e95]">{r.agency}</span></td>
                      <td className="px-4 py-2.5 text-[#5b606a]">{r.county}, {r.state}</td>
                      <td className="px-4 py-2.5 text-[#5b606a]">{r.kind}</td>
                      <td className="max-w-[22rem] px-4 py-2.5 text-[#5b606a]">{r.program}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-[#1d1d1f]">{$m(r.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <p className="text-[12px] text-[#8c8e95]">USAspending.gov, grants with actions since January 1, 2024. The 600 largest awards are loaded here.</p>
          </div>
        )}

        {/* Corridors */}
        {tab === "corridors" && (
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <div className="mb-2 flex gap-2 text-[12.5px]">{(["Territory", "Kalamazoo & Portage"] as const).map((z) => <button key={z} type="button" onClick={() => setZoom(z)} className={`min-h-[32px] rounded-full border px-3.5 ${zoom === z ? "border-[#d8e6f8] bg-[#f0f5fc] text-[#3970af]" : "border-[#e8ebf0] bg-white text-[#818692] hover:text-[#4a4f58]"}`}>{z}</button>)}</div>
              <CorridorMap corridors={inView} picked={corr} onPick={setCorr} />
            </div>
            <div className="rounded-2xl border border-[#e4e5e9] bg-white p-5">
              {pickedCorr ? (
                <>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777980]">{pickedCorr.city}, {pickedCorr.state}</span>
                  <h3 className="mt-1 text-[20px] font-medium tracking-[-0.02em] text-[#1d1d1f]">{pickedCorr.street}</h3>
                  <p className="mt-1 text-[13px] text-[#5b606a]">{pickedCorr.from && pickedCorr.to ? `${pickedCorr.from} to ${pickedCorr.to} · ` : ""}{pickedCorr.lengthMeters ? `${(pickedCorr.lengthMeters / 1609.34).toFixed(2)} mi` : ""}</p>
                  <p className="mt-1 text-[13px] text-[#5b606a]">Construction {pickedCorr.start ? pickedCorr.start.slice(0, 7) : ""}{pickedCorr.end ? ` to ${pickedCorr.end.slice(0, 7)}` : ""}</p>
                  {nowFor(pickedCorr) && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Kpi k={String(nowFor(pickedCorr).openNow)} label="places listed open within 100 m today" />
                      <Kpi k={String(nowFor(pickedCorr).openByCategory["Dining and Drinking"] ?? 0)} label="restaurants and bars" />
                    </div>
                  )}
                  {survFor(pickedCorr) && (
                    <div className="mt-4">
                      <h4 className="text-[13px] font-medium text-[#1d1d1f]">Closures vs the rest of {pickedCorr.city}</h4>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                        {(["before", "during", "after"] as const).map((ph) => {
                          const r = survFor(pickedCorr).phases[ph];
                          return (
                            <div key={ph} className="rounded-xl bg-[#f5f5f7] px-2 py-3">
                              <div className="text-[11px] uppercase tracking-[0.1em] text-[#8c8e95]">{ph}</div>
                              <div className="mt-1 text-[18px] font-medium tabular-nums text-[#1d1d1f]">{r ? `${r.corridor.closed}` : "—"}</div>
                              <div className="text-[11px] text-[#8c8e95]">{r ? `closed of ${r.corridor.placeYears} bus.-yrs` : "not measured"}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {pickedCorr.source && <a href={pickedCorr.source} target="_blank" rel="noreferrer" className="mt-4 inline-block text-[12.5px] text-[#3778bc] underline decoration-[#cfe0f2] underline-offset-2">Project source</a>}
                </>
              ) : (
                <>
                  <h3 className="text-[16px] font-medium text-[#1d1d1f]">{inView.length} Wightman corridors{zoom === "Territory" ? "" : " in Kalamazoo & Portage"}</h3>
                  <p className="mt-1 text-[13px] leading-[1.6] text-[#5b606a]">Each line is the real street between the cross streets named in the project. Click one to see its businesses and what happened to them.</p>
                  <ul className="mt-4 grid max-h-[420px] gap-1 overflow-auto">
                    {inView.map((c: Any) => (
                      <li key={c.id}><button type="button" onClick={() => setCorr(c.id)} className="w-full rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-[#f5f5f7]"><span className="text-[#1d1d1f]">{c.street}</span><span className="text-[#8c8e95]"> · {c.city}</span></button></li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}

        {/* Businesses */}
        {tab === "business" && survival?.pooled && (
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Kpi k={`${survival.pooled.before.relativeRisk}×`} label="closure rate vs city, 3 years before construction" />
              <Kpi k={`${survival.pooled.during.relativeRisk}×`} label={`during construction (range ${survival.pooled.during.ci?.join("–")}×)`} />
              <Kpi k={`${survival.pooled.after.relativeRisk}×`} label="2 years after construction" />
              <Kpi k={String(survival.pooled.corridors.length)} label="finished commercial corridors measured" />
            </div>
            <Table>
              <thead className={THEAD}><tr><th className="px-4 py-3 text-left font-medium">Corridor</th><th className="px-4 py-3 text-left font-medium">Built</th><th className="px-4 py-3 text-right font-medium">Businesses</th><th className="px-4 py-3 text-right font-medium">Before</th><th className="px-4 py-3 text-right font-medium">During</th><th className="px-4 py-3 text-right font-medium">After</th><th className="px-4 py-3 text-right font-medium">During vs city</th></tr></thead>
              <tbody>
                {survival.corridors.map((c: Any) => {
                  const cell = (r: Any) => (r ? `${r.corridor.closed} / ${r.corridor.placeYears}` : "—");
                  const rr = c.phases.during?.relativeRisk;
                  return (
                    <tr key={c.id} className="border-b border-[#eef0f3] last:border-0 hover:bg-[#fafbfc]">
                      <td className="px-4 py-2.5 text-[#1d1d1f]">{c.street}<span className="block text-[11.5px] text-[#8c8e95]">{c.city}</span></td>
                      <td className="px-4 py-2.5 text-[#5b606a]">{c.start === c.end ? c.end : `${c.start}–${c.end}`}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-[#5b606a]">{c.businessesInBuffer}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-[#5b606a]">{cell(c.phases.before)}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-[#5b606a]">{cell(c.phases.during)}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-[#5b606a]">{cell(c.phases.after)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums" style={{ color: rr > 1 ? AMBER : INK }}>{rr != null && c.phases.during.corridor.closed > 0 ? `${rr}×` : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <p className="text-[12px] text-[#8c8e95]">Closures / business-years open. Foursquare open places within {survival.bufferMeters} m of each corridor, compared with the rest of the same city in the same years.</p>
            {businessesNow && (
              <div className="rounded-2xl border border-[#e4e5e9] bg-white p-5">
                <h3 className="text-[14px] font-medium text-[#1d1d1f]">The corridors ahead</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {businessesNow.corridors.filter((c: Any) => c.constructionEnd && c.constructionEnd >= "2026").map((c: Any) => (
                    <div key={c.id} className="rounded-xl bg-[#f5f5f7] p-4">
                      <div className="text-[14px] text-[#1d1d1f]">{c.street}</div>
                      <div className="mt-1 text-[24px] font-medium tabular-nums text-[#1d1d1f]">{c.openNow}</div>
                      <div className="text-[12px] text-[#5b606a]">places listed open · {c.openByCategory["Dining and Drinking"] ?? 0} restaurants and bars · {survival.pooled.during.relativeRisk}× city closure risk while under way</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contracts */}
        {tab === "contracts" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <div className="rounded-2xl border border-[#e4e5e9] bg-white p-5">
              <h3 className="mb-3 text-[14px] font-medium text-[#1d1d1f]">{client}: engineering dollars by firm</h3>
              <BarList rows={share} />
              <p className="mt-3 text-[11.5px] text-[#8c8e95]">Number after each firm is the count of approvals.</p>
            </div>
            <Table>
              <thead className={THEAD}><tr>{C.head("date", "Date")}{C.head("firm", "Firm")}{C.head("project", "Project")}{C.head("action", "Action")}{C.head("amount", "Amount", true)}<th className="px-4 py-3 text-left font-medium">Official record</th></tr></thead>
              <tbody>
                {C.sorted.map((r: Any, i: number) => (
                  <tr key={r.date + r.project + i} className="border-b border-[#eef0f3] last:border-0 hover:bg-[#fafbfc]">
                    <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-[#8c8e95]">{usd(r.date)}</td>
                    <td className="px-4 py-2.5" style={{ color: r.firm === "Wightman" ? BLUE : INK }}>{r.firm}</td>
                    <td className="px-4 py-2.5">{r.doc || r.source ? <a href={r.doc?.href ?? r.source} target="_blank" rel="noreferrer" className="text-[#1d1d1f] underline decoration-[#cfe0f2] underline-offset-2">{r.project}</a> : r.project}</td>
                    <td className="px-4 py-2.5 text-[#5b606a]">{r.action}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-[#1d1d1f]">{r.amount ? $m(r.amount) : "—"}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-[12px]">
                      {r.doc ? (
                        <a href={r.doc.href} target="_blank" rel="noreferrer" className="text-[#3778bc] underline decoration-[#cfe0f2] underline-offset-2" title={r.doc.subject ?? undefined}>
                          Agenda report, pp. {r.doc.pages[0]}{r.doc.pages[1] !== r.doc.pages[0] ? `–${r.doc.pages[1]}` : ""}
                        </a>
                      ) : r.source ? (
                        <a href={r.source} target="_blank" rel="noreferrer" className="text-[#8c8e95] underline decoration-[#e4e5e9] underline-offset-2">{/civicclerk|granicus|\.gov|kalamazoocity/i.test(r.source) ? "Meeting record" : "Press report"}</a>
                      ) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        <p className="mt-10 text-[11.5px] text-[#8c8e95]">Built {new Date(builtAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Detroit" })} from public records: EGLE, IFA and Ohio EPA priority lists, USAspending.gov, Wightman project pages, OpenStreetMap, Foursquare open places and city meeting records. Arthur is not connected to any Wightman system.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
