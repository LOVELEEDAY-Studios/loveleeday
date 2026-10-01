"use client";

import { useEffect, useMemo, useState } from "react";
import { Newspaper, FileSearch, Landmark, CalendarDays, Clock } from "lucide-react";

/* NowKalamazoo working view. Light surface, one blue for emphasis, amber only for "not covered" and
   "clock running". Every row links to its public source. The time panel is the newsroom's to edit:
   its numbers are starting assumptions, never claims. */

type Any = any; // eslint-disable-line @typescript-eslint/no-explicit-any
const MONTHS = "JanFebMarAprMayJunJulAugSepOctNovDec";
const day = (s?: string | null) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s ?? "");
  if (!m) return s ?? "";
  const d = new Date(`${m[1]}-${m[2]}-${m[3]}T12:00:00`);
  return `${"SunMonTueWedThuFriSat".slice(d.getDay() * 3, d.getDay() * 3 + 3)}, ${MONTHS.slice(+m[2] * 3 - 3, +m[2] * 3)} ${+m[3]}`;
};
const time = (s?: string | null) => {
  const m = /(\d{2}):(\d{2})/.exec(s ?? "");
  if (!m) return "";
  const h = +m[1];
  return `${h % 12 || 12}:${m[2]} ${h < 12 ? "a.m." : "p.m."}`;
};

const TABS = [
  ["desk", "Story and records desk", FileSearch],
  ["meetings", "Meeting watch", Landmark],
  ["morning", "Morning desk", Newspaper],
  ["calendar", "Calendar", CalendarDays],
  ["time", "Time back", Clock],
] as const;
type Tab = (typeof TABS)[number][0];

function Kpi({ k, label }: { k: string; label: string }) {
  return (
    <div className="rounded-[12px] border border-[#edf0f4] bg-white p-4 sm:p-5">
      <span className="block text-[26px] font-medium leading-none tracking-[-0.035em] text-[#1d1d1f] tabular-nums sm:text-[28px]">{k}</span>
      <span className="mt-2.5 block text-[12.5px] leading-[1.45] text-[#323b48]">{label}</span>
    </div>
  );
}

function Panel({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#e4e5e9] pb-3">
        <h2 className="text-[18px] font-medium tracking-[-0.02em] text-[#1d1d1f]">{title}</h2>
        {note && <span className="text-[12.5px] text-[#8c8e95]">{note}</span>}
      </div>
      {children}
    </section>
  );
}

const A = ({ href, children }: { href?: string | null; children: React.ReactNode }) =>
  href ? (
    <a href={href} target="_blank" rel="noreferrer" className="text-[#3778bc] underline decoration-[#cfe0f2] underline-offset-2">
      {children}
    </a>
  ) : (
    <>{children}</>
  );

const Tag = ({ tone, children }: { tone: "blue" | "amber" | "grey"; children: React.ReactNode }) => (
  <span
    className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
      tone === "blue" ? "bg-[#eaf2fb] text-[#2d6aa8]" : tone === "amber" ? "bg-[#f4efe6] text-[#8a6420]" : "bg-[#f1f2f4] text-[#5b606a]"
    }`}
  >
    {children}
  </span>
);

/* ---------------- Story and records desk ---------------- */
function Desk({ desk }: { desk: Any }) {
  const agendas: Any[] = desk.agendas ?? [];
  const posted = agendas.filter((a) => a.posted && a.items?.length);
  const items = posted.reduce((n, a) => n + a.items.length, 0);
  const leads: Any[] = desk.leads ?? [];
  const foia: Any[] = desk.foia ?? [];
  const gaps: Any[] = (desk.coverage ?? []).filter((c: Any) => !c.mentionsSinceJul1);
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi k={String(leads.length)} label="Story leads from today's public record" />
        <Kpi k={String(items)} label={`Agenda items already posted, across ${posted.length} bodies`} />
        <Kpi k={String(foia.length)} label="Records requests drafted, ready for an editor" />
        <Kpi k={String(gaps.length)} label="Public bodies with no mention since July 1" />
      </div>

      {!!leads.length && (
        <Panel title="Leads Arthur would put on the desk this morning" note={`Read ${day(desk.readAt)} from public sources`}>
          <ol>
            {leads.map((l, i) => (
              <li key={i} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-[#eef0f3] py-5">
                <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[16px] font-medium leading-[1.45] text-[#1d1d1f]">{l.lead}</h3>
                    {l.covered ? <Tag tone="grey">Covered</Tag> : <Tag tone="amber">Not yet covered</Tag>}
                  </div>
                  <p className="mt-1.5 text-[14px] leading-[1.65] text-[#5b606a]">{l.why}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px]">
                    {(l.sources ?? []).slice(0, 3).map((s: string, j: number) => (
                      <A key={j} href={s}>
                        Source {j + 1}
                      </A>
                    ))}
                    {l.covered && <A href={l.covered}>Our story</A>}
                  </div>
                  {l.foia && (
                    <p className="mt-2 text-[13px] leading-[1.6] text-[#7d8088]">
                      <span className="text-[#1d1d1f]">Records to ask for:</span> {l.foia}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      )}

      {!!foia.length && (
        <Panel title="Records requests, drafted" note="Michigan FOIA: 5 business days to respond, one 10-day extension">
          <div className="mt-4 grid gap-3">
            {foia.map((f, i) => (
              <div key={i} className="rounded-[12px] border border-[#edf0f4] bg-white">
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full flex-wrap items-center justify-between gap-2 px-5 py-4 text-left">
                  <span className="text-[15px] font-medium text-[#1d1d1f]">{f.body}</span>
                  <span className="text-[12.5px] text-[#8c8e95]">{open === i ? "Hide request" : "Show request"}</span>
                </button>
                {open === i && (
                  <div className="border-t border-[#eef0f3] px-5 py-4">
                    <p className="text-[13px] leading-[1.6] text-[#5b606a]">{f.why}</p>
                    <pre className="mt-3 whitespace-pre-wrap rounded-[10px] bg-[#f5f5f7] p-4 font-sans text-[13.5px] leading-[1.65] text-[#1d1d1f]">{f.request}</pre>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-[#8c8e95]">
                      {f.portal && <A href={f.portal}>Where to file</A>}
                      {f.coordinator && <span>FOIA coordinator: {f.coordinator}</span>}
                      <span>Draft only. An editor files it.</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Panel>
      )}

      {!!posted.length && (
        <Panel title="Agendas already posted" note="Substantive items only">
          <div className="mt-2 grid gap-x-10 md:grid-cols-2">
            {posted.map((a, i) => (
              <div key={i} className="border-b border-[#eef0f3] py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[15px] font-medium text-[#1d1d1f]">{a.body}</h3>
                  <span className="text-[12.5px] text-[#8c8e95]">
                    {day(a.date)}
                    {a.time ? `, ${a.time}` : ""}
                  </span>
                </div>
                <ul className="mt-2 grid gap-1.5">
                  {a.items.slice(0, 6).map((it: Any, j: number) => (
                    <li key={j} className="text-[13.5px] leading-[1.55] text-[#4a4d55]">
                      <A href={it.url ?? a.agendaUrl}>{it.title}</A>
                      {it.amount && <span className="text-[#1d1d1f]"> · {it.amount}</span>}
                      {it.party && <span className="text-[#8c8e95]"> · {it.party}</span>}
                    </li>
                  ))}
                  {a.items.length > 6 && <li className="text-[12.5px] text-[#8c8e95]">and {a.items.length - 6} more</li>}
                </ul>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {!!gaps.length && (
        <Panel title="Bodies the newsroom has not mentioned since July 1" note="From the newsroom's own directory and archive">
          <div className="mt-4 flex flex-wrap gap-2">
            {gaps.map((g, i) => (
              <span key={i} className="rounded-full border border-[#e4e5e9] px-3 py-1 text-[13px] text-[#4a4d55]">
                {g.body}
              </span>
            ))}
          </div>
        </Panel>
      )}
    </>
  );
}

/* ---------------- Meeting watch ---------------- */
function Meetings({ data, desk }: { data: Any; desk: Any }) {
  const [cat, setCat] = useState("All");
  const postedBy = new Map<string, Any>((desk?.agendas ?? []).map((a: Any) => [String(a.body).toLowerCase(), a]));
  const rows = useMemo(() => {
    const list: Any[] = [];
    for (const m of data.meetings as Any[]) for (const d of m.dates ?? []) list.push({ ...m, date: d });
    return list.sort((a, b) => a.date.localeCompare(b.date) || String(a.name ?? a.body).localeCompare(String(b.name ?? b.body)));
  }, [data]);
  const cats = ["All", ...Array.from(new Set((data.meetings as Any[]).map((m) => m.category)))];
  const shown = rows.filter((r) => cat === "All" || r.category === cat);
  const unscheduled = (data.meetings as Any[]).filter((m) => !m.parsed);
  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi k={String(data.meetings.length)} label="Meetings in the newsroom's own directory" />
        <Kpi k={String(rows.length)} label="Of them, meetings in the next two weeks with a set schedule" />
        <Kpi k={String(unscheduled.length)} label={`Schedules too loose to date ("varies", "as needed")`} />
        <Kpi k={day(data.directoryGenerated)} label="When the directory was last generated" />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-3.5 py-1.5 text-[13px] ${cat === c ? "bg-[#1d1d1f] text-white" : "border border-[#e4e5e9] text-[#4a4d55] hover:border-[#3778bc]"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-4 overflow-x-auto rounded-[12px] border border-[#edf0f4] bg-white">
        <table className="w-full min-w-[640px] text-[13.5px]">
          <thead className="border-b border-[#e4e5e9] text-[10.5px] uppercase tracking-[0.1em] text-[#8c8e95]">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Meeting</th>
              <th className="px-4 py-3 text-left font-medium">Schedule</th>
              <th className="px-4 py-3 text-left font-medium">Agenda</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r, i) => {
              const p = postedBy.get(String(r.name).toLowerCase()) ?? postedBy.get(String(r.body).toLowerCase());
              return (
                <tr key={i} className="border-b border-[#f1f2f4] last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-[#1d1d1f]">{day(r.date)}</td>
                  <td className="px-4 py-3 text-[#1d1d1f]">
                    {r.name ?? r.body}
                    <span className="block text-[12px] text-[#8c8e95]">{r.category}</span>
                  </td>
                  <td className="px-4 py-3 text-[#5b606a]">
                    {r.schedule}
                    {r.time ? `, ${r.time}` : ""}
                    {r.corrected && (
                      <span className="mt-1 block text-[12px] text-[#8a6420]">
                        The directory&apos;s schedule points to {day(r.corrected.directory?.[0])}; the body&apos;s own calendar says {day(r.corrected.official)}.
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="whitespace-nowrap">{p?.posted ? <Tag tone="blue">Posted · {p.items?.length ?? 0} items</Tag> : <A href={r.agendaUrl}>Watch page</A>}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[12.5px] leading-[1.6] text-[#8c8e95]">
        Dates are worked out from each schedule as the directory writes it. Arthur would confirm every date against the body&apos;s own posted notice before
        flagging it.
      </p>
    </>
  );
}

/* ---------------- Morning desk ---------------- */
function Morning({ data, desk }: { data: Any; desk: Any }) {
  const lead = data.posts?.[0];
  const also = (desk?.leads ?? []).filter((l: Any) => !l.covered).slice(0, 2);
  const ev = data.events?.sample ?? [];
  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[14px] border border-[#edf0f4] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777980]">Daily News · draft for {day(data.events?.weekStart)}</span>
          <Tag tone="amber">Draft for Ben to edit</Tag>
        </div>
        {lead && (
          <>
            <h3 className="mt-5 text-[22px] font-medium leading-[1.25] tracking-[-0.025em] text-[#1d1d1f]">{lead.title}</h3>
            <p className="mt-2 text-[13px] text-[#8c8e95]">
              Lead from the newest story, <A href={lead.url}>published {day(lead.date)}</A>
            </p>
          </>
        )}
        {!!also.length && (
          <div className="mt-6 border-t border-[#eef0f3] pt-5">
            <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#3778bc]">Also</span>
            <ul className="mt-2 grid gap-2">
              {also.map((l: Any, i: number) => (
                <li key={i} className="text-[14.5px] leading-[1.55] text-[#1d1d1f]">
                  {l.lead}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-6 border-t border-[#eef0f3] pt-5">
          <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#3778bc]">Things to do</span>
          <ul className="mt-2 grid gap-1.5">
            {ev.slice(0, 5).map((e: Any, i: number) => (
              <li key={i} className="text-[14px] text-[#4a4d55]">
                <A href={e.url}>{e.title}</A>
                <span className="text-[#8c8e95]">
                  {" "}
                  · {time(e.start)}
                  {e.venue ? `, ${e.venue}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h3 className="text-[16px] font-medium text-[#1d1d1f]">The last ten issues, as the newsroom built them</h3>
        <ul className="mt-3">
          {(data.issues ?? []).map((x: Any, i: number) => (
            <li key={i} className="border-b border-[#eef0f3] py-2.5 text-[13.5px]">
              <A href={x.url}>{x.title}</A>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[13px] leading-[1.65] text-[#7d8088]">
          Arthur lays the draft out in the same shape (a lead, two &ldquo;Also&rdquo; items, things to do) from the night&apos;s stories, the meeting
          flags and the calendar. It is waiting at 5 a.m. Nothing is sent without an editor.
        </p>
      </div>
    </div>
  );
}

/* ---------------- Calendar ---------------- */
function Calendar({ data }: { data: Any }) {
  const e = data.events;
  const max = Math.max(...e.byDay.map((d: Any) => d[1]));
  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi k={String(e.total)} label={`Events on the calendar, ${day(e.weekStart)} to ${day(e.weekEnd)}`} />
        <Kpi k={String(Math.round(e.total / 7))} label="Events a day on average" />
        <Kpi k={String(e.duplicates)} label="Duplicate listings, same name and day" />
        <Kpi k={String(e.noVenue)} label="Listings with no venue" />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Panel title="Events by day">
          <div className="mt-4 grid gap-2">
            {e.byDay.map(([d, n]: [string, number]) => (
              <div key={d} className="grid grid-cols-[7rem_1fr_2.5rem] items-center gap-3 text-[13px]">
                <span className="text-[#4a4d55]">{day(d)}</span>
                <span className="h-2.5 rounded-full bg-[#3778bc]" style={{ width: `${(n / max) * 100}%` }} />
                <span className="text-right tabular-nums text-[#1d1d1f]">{n}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="What the week is made of">
          <div className="mt-4 grid gap-2">
            {e.topCategories.map(([c, n]: [string, number]) => (
              <div key={c} className="flex justify-between border-b border-[#f1f2f4] py-1.5 text-[13.5px]">
                <span className="text-[#4a4d55]">{c}</span>
                <span className="tabular-nums text-[#1d1d1f]">{n}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <p className="mt-6 max-w-[48rem] text-[13px] leading-[1.65] text-[#7d8088]">
        Arthur keeps this clean every night: duplicates merged, past events cleared, missing venues filled from the organizer&apos;s own page, and the
        listings a Premier Event or Event Highlight could be offered to flagged for Gabrielle.
      </p>
    </>
  );
}

/* ---------------- Time back ---------------- */
const WORK = [
  { k: "Checking agendas for 44 public bodies", before: 6, after: 1 },
  { k: "Assembling the Daily News, five mornings", before: 7.5, after: 2.5 },
  { k: "Cleaning the events calendar", before: 5, after: 1.5 },
  { k: "Sponsor impact reports", before: 2, after: 0.25 },
  { k: "Grant reports and funder deadlines", before: 3, after: 1 },
  { k: "Tracking records requests and follow-ups", before: 1.5, after: 0.25 },
];
function TimeBack() {
  const [rows, setRows] = useState(WORK);
  const set = (i: number, f: "before" | "after", v: number) => setRows(rows.map((r, j) => (j === i ? { ...r, [f]: Math.max(0, v) } : r)));
  const b = rows.reduce((s, r) => s + r.before, 0);
  const a = rows.reduce((s, r) => s + r.after, 0);
  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi k={`${b.toFixed(1)} h`} label="A week on this work today" />
        <Kpi k={`${a.toFixed(1)} h`} label="A week with Arthur doing the watching" />
        <Kpi k={`${(b - a).toFixed(1)} h`} label="Back to reporting, every week" />
        <Kpi k={`${Math.round(((b - a) * 52) / 40)} wks`} label="Full-time weeks a year" />
      </div>
      <div className="mt-6 overflow-x-auto rounded-[12px] border border-[#edf0f4] bg-white">
        <table className="w-full min-w-[560px] text-[13.5px]">
          <thead className="border-b border-[#e4e5e9] text-[10.5px] uppercase tracking-[0.1em] text-[#8c8e95]">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Work</th>
              <th className="px-4 py-3 text-right font-medium">Hours a week today</th>
              <th className="px-4 py-3 text-right font-medium">With Arthur</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.k} className="border-b border-[#f1f2f4] last:border-0">
                <td className="px-4 py-3 text-[#1d1d1f]">{r.k}</td>
                {(["before", "after"] as const).map((f) => (
                  <td key={f} className="px-4 py-2 text-right">
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      value={r[f]}
                      onChange={(e) => set(i, f, Number(e.target.value))}
                      aria-label={`${r.k}, ${f === "before" ? "hours today" : "hours with Arthur"}`}
                      className="w-20 rounded-[8px] border border-[#e4e5e9] px-2 py-1.5 text-right tabular-nums focus:border-[#3778bc] focus:outline-none"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 max-w-[48rem] text-[13px] leading-[1.65] text-[#7d8088]">
        These are starting assumptions, not measurements: we have not seen the newsroom&apos;s week from the inside. Change any number and the totals
        follow. The first two weeks of work would replace them with measured hours.
      </p>
    </>
  );
}

export function NowDashboard({ preparedFor, data, desk }: { token: string; preparedFor: string; data: Any; desk: Any }) {
  const tabs = TABS.filter(([k]) => k !== "desk" || desk);
  const [tab, setTab] = useState<Tab>(tabs[0][0]);
  useEffect(() => {
    const h = window.location.hash.slice(1) as Tab;
    if (tabs.some(([k]) => k === h)) setTab(h);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="ll-os min-h-screen bg-[#f7f8fa]">
      <div className="mx-auto max-w-[1180px] px-6 pb-24 pt-12">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777980]">NowKalamazoo · prepared for {preparedFor}</span>
        <h1 className="mt-3 text-[clamp(2rem,4.2vw,3rem)] font-medium leading-[1.08] tracking-[-0.045em] text-[#1d1d1f]">
          This morning, with Arthur.
          <br />
          <span className="text-[#8c8e95]">Built from your public record.</span>
        </h1>
        <p className="mt-4 max-w-[44rem] text-[15px] leading-[1.7] text-[#6c7481]">
          Everything here was read from public sources on {day(data.builtAt)}: your meeting directory, your events calendar, your archive, and the
          agendas and records around them. Connected to the newsroom&apos;s own tools, the same view runs every morning.
        </p>
        <nav className="mt-8 flex gap-1 overflow-x-auto border-b border-[#e4e5e9]" role="tablist">
          {tabs.map(([k, label, Icon]) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3.5 py-3 text-[13.5px] ${
                tab === k ? "border-[#1d1d1f] text-[#1d1d1f]" : "border-transparent text-[#7d8088] hover:text-[#1d1d1f]"
              }`}
            >
              <Icon size={15} strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </nav>
        {tab === "desk" && desk && <Desk desk={desk} />}
        {tab === "meetings" && <Meetings data={data} desk={desk} />}
        {tab === "morning" && <Morning data={data} desk={desk} />}
        {tab === "calendar" && <Calendar data={data} />}
        {tab === "time" && <TimeBack />}
      </div>
    </div>
  );
}
