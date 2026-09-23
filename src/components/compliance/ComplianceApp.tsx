"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { Requirement } from "@/content/compliance";

type Status = "open" | "progress" | "review" | "submitted" | "accepted";
interface Track {
  status?: Status;
  owner?: string;
  notes?: string;
  confirmation?: string;
  submittedOn?: string;
  files?: { name: string; size: number; added: string }[];
}
type Tracks = Record<string, Track>;

const STATUS: { k: Status; label: string }[] = [
  { k: "open", label: "Not started" },
  { k: "progress", label: "In progress" },
  { k: "review", label: "Ready for review" },
  { k: "submitted", label: "Submitted" },
  { k: "accepted", label: "Accepted" },
];
const DONE = (s?: Status) => s === "submitted" || s === "accepted";
const OWNERS = ["Operations", "Finance", "Data & enrollment", "Head of school", "Special education", "Arthur"];

const DAY = 86_400_000;
const iso = (d: Date) => d.toISOString().slice(0, 10);
const parse = (s: string) => new Date(s + "T12:00:00");
const fmt = (s: string, o: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }) =>
  parse(s).toLocaleDateString("en-US", o);
const daysUntil = (s: string, today: string) => Math.round((parse(s).getTime() - parse(today).getTime()) / DAY);

const noSubscribe = () => () => {};
function readRaw(key: string): string {
  try {
    return localStorage.getItem(key) ?? "{}";
  } catch {
    return "{}";
  }
}

function Pill({ children, tone = "mid" }: { children: React.ReactNode; tone?: "mid" | "teal" | "copper" | "good" | "bad" }) {
  const c = {
    mid: "border-[var(--line-2)] text-[var(--mid)]",
    teal: "border-[var(--teal)] text-[var(--teal)]",
    copper: "border-[var(--copper)] text-[var(--copper)]",
    good: "border-[var(--good)] text-[var(--good)]",
    bad: "border-[#B3261E] text-[#B3261E]",
  }[tone];
  return (
    <span className={`inline-flex items-center whitespace-nowrap border px-1.5 py-px font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.12em] ${c}`}>
      {children}
    </span>
  );
}

function DueTag({ r, t, today }: { r: Requirement; t?: Track; today: string }) {
  if (DONE(t?.status)) return <Pill tone="good">{t?.status === "accepted" ? "Accepted" : "Submitted"}</Pill>;
  if (!r.due) return <Pill>{r.dueLabel || "Date TBD"}</Pill>;
  const n = daysUntil(r.due, today);
  if (n < 0) return <Pill>Mark off</Pill>;
  if (n === 0) return <Pill tone="copper">Due today</Pill>;
  if (n <= 14) return <Pill tone="copper">{n} day{n === 1 ? "" : "s"}</Pill>;
  return <Pill>{n} days</Pill>;
}

/* ---------- detail drawer ---------- */

function Drawer({ r, t, today, save, onClose }: {
  r: Requirement;
  t: Track;
  today: string;
  save: (id: string, patch: Partial<Track>) => void;
  onClose: () => void;
}) {
  const [confirmation, setConfirmation] = useState(t.confirmation ?? "");
  const [notes, setNotes] = useState(t.notes ?? "");
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#16243A]/40" onClick={() => onClose()} role="dialog" aria-modal="true" aria-label={r.title}>
      <div className="h-full w-full max-w-[36rem] overflow-y-auto bg-[var(--ground)] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--line)] bg-[var(--ground)] px-6 py-3">
          <span className="flex gap-2">
            <Pill tone={r.agency === "OSSE" ? "copper" : "teal"}>{r.agency}</Pill>
            <Pill>{r.kind}</Pill>
          </span>
          <button onClick={() => onClose()} className="min-h-[40px] px-2 text-[20px] leading-none text-[var(--mid)] hover:text-[var(--ink)]" aria-label="Close">×</button>
        </div>
        <div className="px-6 py-6">
          <h3 className="text-[22px] font-medium leading-[1.2] tracking-[-0.015em]">{r.title}</h3>
          <dl className="mt-5 grid grid-cols-[7.5rem_1fr] gap-x-4 gap-y-2.5 text-[14px]">
            <dt className="text-[var(--dim)]">Due</dt>
            <dd>
              {r.due ? fmt(r.due, { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : r.dueLabel || "Date not yet published"}
              {r.precision === "season" && <span className="text-[var(--dim)]"> ({r.dueLabel}, end of window shown)</span>}
              {r.precision === "window" && <span className="text-[var(--dim)]"> ({r.dueLabel})</span>}
              {r.projected && <span className="block text-[12.5px] text-[var(--copper)]">Projected from OSSE&apos;s 2025–26 calendar. OSSE has not published 2026–27 yet.</span>}
            </dd>
            <dt className="text-[var(--dim)]">File it in</dt>
            <dd>{r.platform}{r.alsoVia?.length ? <span className="block text-[12.5px] text-[var(--dim)]">Also via {r.alsoVia.join(", ")}</span> : null}</dd>
            <dt className="text-[var(--dim)]">Who must file</dt>
            <dd>{r.whoMustSubmit}{r.appliesWhy && <span className="block text-[12.5px] text-[var(--teal)]">{r.appliesWhy}</span>}</dd>
            {r.contact && (<><dt className="text-[var(--dim)]">Agency contact</dt><dd className="break-words">{r.contact}</dd></>)}
            {r.alsoOsse && r.agency === "DC PCSB" && (<><dt className="text-[var(--dim)]">Note</dt><dd>OSSE requests this too, so it may overlap with an OSSE submission.</dd></>)}
          </dl>
          {r.purpose && <p className="mt-5 whitespace-pre-line text-[14px] leading-[1.65] text-[var(--mid)]">{r.purpose}</p>}
          {r.guideUrl && (
            <a href={r.guideUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-[40px] items-center border border-[var(--ink)] px-3 text-[13px] hover:bg-[var(--ink)] hover:text-[var(--on-deep)]">
              {r.guide || "Official guidance"} ↗
            </a>
          )}

          <div className="mt-8 border-l-2 border-[var(--teal)] bg-[var(--teal-wash)] p-4">
            <h4 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--teal-d)]">What Arthur does for this one</h4>
            <ol className="mt-2 grid list-decimal gap-1 pl-5 text-[13.5px] leading-[1.55] text-[var(--ink)]">
              <li>Watches {r.agency === "OSSE" ? "OSSE" : "DC PCSB"} for changes to the date or the rules{r.guideUrl ? ", and keeps the official guide attached here" : ""}.</li>
              <li>Pulls last year&apos;s filing and the documents it needs out of your vault.</li>
              <li>Drafts the packet and sends it to {t.owner ?? r.owner} for review {r.due ? "two weeks before the deadline" : "as soon as a date is published"}.</li>
              <li>Reminds the owner at 14, 7 and 2 days, and asks for the confirmation number once it is filed.</li>
            </ol>
            <p className="mt-2 text-[12.5px] text-[var(--mid)]">Pressing submit in {r.platform} stays with your team. The login belongs to the school.</p>
          </div>

          <div className="mt-8 grid gap-5">
            <label className="grid gap-1.5 text-[13px]">
              <span className="text-[var(--dim)]">Status</span>
              <div className="flex flex-wrap gap-1">
                {STATUS.map((s) => (
                  <button
                    key={s.k}
                    onClick={() => save(r.id, { status: s.k, ...(DONE(s.k) && !t.submittedOn ? { submittedOn: today } : {}) })}
                    className={`min-h-[38px] border px-2.5 text-[12.5px] ${(t.status ?? "open") === s.k ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--on-deep)]" : "border-[var(--line-2)] bg-[var(--paper)] hover:bg-[var(--sunk)]"}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </label>
            <label className="grid gap-1.5 text-[13px]">
              <span className="text-[var(--dim)]">Owner</span>
              <select
                value={t.owner ?? r.owner}
                onChange={(e) => save(r.id, { owner: e.target.value })}
                className="min-h-[42px] border border-[var(--line-2)] bg-[var(--paper)] px-2 text-[14px]"
              >
                {[...new Set([r.owner, ...OWNERS])].map((o) => <option key={o}>{o}</option>)}
              </select>
            </label>
            {DONE(t.status) && (
              <label className="grid gap-1.5 text-[13px]">
                <span className="text-[var(--dim)]">Confirmation number</span>
                <input
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  onBlur={() => save(r.id, { confirmation })}
                  placeholder="From the portal's receipt"
                  className="min-h-[42px] border border-[var(--line-2)] bg-[var(--paper)] px-3 text-[14px]"
                />
              </label>
            )}
            <label className="grid gap-1.5 text-[13px]">
              <span className="text-[var(--dim)]">Documents</span>
              <input
                type="file"
                multiple
                onChange={(e) =>
                  save(r.id, {
                    files: [
                      ...(t.files ?? []),
                      ...[...(e.target.files ?? [])].map((f) => ({ name: f.name, size: f.size, added: today })),
                    ],
                  })
                }
                className="text-[13px] file:mr-3 file:min-h-[38px] file:border file:border-[var(--line-2)] file:bg-[var(--paper)] file:px-3"
              />
              {t.files?.length ? (
                <ul className="grid gap-1">
                  {t.files.map((f, i) => (
                    <li key={i} className="flex justify-between border-b border-[var(--line)] py-1 text-[13px]">
                      <span className="truncate">{f.name}</span>
                      <span className="tnum text-[var(--dim)]">{Math.max(1, Math.round(f.size / 1024))} KB</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </label>
            <label className="grid gap-1.5 text-[13px]">
              <span className="text-[var(--dim)]">Notes</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={() => save(r.id, { notes })}
                rows={3}
                className="border border-[var(--line-2)] bg-[var(--paper)] p-3 text-[14px]"
              />
            </label>
          </div>
          <p className="mt-6 text-[12px] leading-[1.6] text-[var(--dim)]">
            Preview: your changes are saved in this browser only. In the live version they are shared with your team, and
            documents go into the school&apos;s vault.
          </p>
        </div>
      </div>
    </div>
  );
}


export function ComplianceApp({ items, storageKey, school }: { items: Requirement[]; storageKey: string; school: string }) {
  /* Today and the saved statuses exist only in the browser; the page itself is built once at deploy. */
  const today = useSyncExternalStore(noSubscribe, () => iso(new Date()), () => "2026-09-23");
  const raw = useSyncExternalStore(noSubscribe, () => readRaw(storageKey), () => "{}");
  const [, bump] = useState(0);
  const tracks = useMemo<Tracks>(() => {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }, [raw]);
  const [tab, setTab] = useState<"upcoming" | "calendar" | "portals" | "all" | "report">("upcoming");
  const [open, setOpen] = useState<string | null>(null);
  const [monthSel, setMonth] = useState<string | null>(null);
  const month = monthSel ?? today.slice(0, 7);
  const [day, setDay] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<"yes" | "if" | "no" | "any">("yes");

  const save = (id: string, patch: Partial<Track>) => {
    const next = { ...tracks, [id]: { ...tracks[id], ...patch } };
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
    bump((n) => n + 1);
  };

  const mine = useMemo(() => items.filter((r) => r.applies === "yes"), [items]);
  const dated = mine.filter((r) => r.due);
  const past = dated.filter((r) => r.due! < today && !DONE(tracks[r.id]?.status));
  const next14 = dated.filter((r) => r.due! >= today && daysUntil(r.due!, today) <= 14 && !DONE(tracks[r.id]?.status));
  const next30 = dated.filter((r) => r.due! >= today && daysUntil(r.due!, today) <= 30 && !DONE(tracks[r.id]?.status));
  const done = mine.filter((r) => DONE(tracks[r.id]?.status));
  const byId = useMemo(() => new Map(items.map((r) => [r.id, r])), [items]);
  const current = open ? byId.get(open) : undefined;

  function downloadIcs() {
    const esc = (s: string) => s.replace(/[\\;,]/g, (m) => "\\" + m).replace(/\n/g, "\\n");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//LOVELEEDAY//Compliance//EN", `X-WR-CALNAME:${school} compliance`];
    for (const r of dated) {
      const d = r.due!.replace(/-/g, "");
      const end = iso(new Date(parse(r.due!).getTime() + DAY)).replace(/-/g, "");
      lines.push(
        "BEGIN:VEVENT",
        `UID:${r.id}@loveleedaystudios.com`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
        `DTSTART;VALUE=DATE:${d}`,
        `DTEND;VALUE=DATE:${end}`,
        `SUMMARY:${esc(`${r.agency}: ${r.title}`)}`,
        `DESCRIPTION:${esc(`Submit via ${r.platform}.${r.projected ? " Date projected from OSSE's 2025-26 calendar." : ""} ${r.purpose.slice(0, 400)}`)}`,
        "BEGIN:VALARM", "TRIGGER:-P7D", "ACTION:DISPLAY", `DESCRIPTION:${esc(r.title)} due in 7 days`, "END:VALARM",
        "END:VEVENT",
      );
    }
    lines.push("END:VCALENDAR");
    const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "global-citizens-compliance-2026-27.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  const Row = ({ r }: { r: Requirement }) => (
    <button
      onClick={() => setOpen(r.id)}
      className="grid w-full grid-cols-[4.2rem_1fr] items-start gap-3 border-b border-[var(--line)] px-4 py-3 text-left transition-colors hover:bg-[var(--sunk)] sm:grid-cols-[4.2rem_1fr_auto]"
    >
      <span className="tnum pt-0.5 text-[13px] text-[var(--mid)]">{r.due ? fmt(r.due) : "—"}</span>
      <span className="min-w-0">
        <span className="block text-[14.5px] font-medium leading-[1.35] text-[var(--ink)]">{r.title}</span>
        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[var(--dim)]">
          <span className={r.agency === "OSSE" ? "text-[var(--copper)]" : "text-[var(--teal)]"}>{r.agency}</span>
          <span aria-hidden="true">·</span>
          <span>{r.platform}</span>
          <span aria-hidden="true">·</span>
          <span>{tracks[r.id]?.owner ?? r.owner}</span>
          {r.projected && <span className="italic">· date projected</span>}
        </span>
      </span>
      <span className="col-start-2 sm:col-start-auto">
        <DueTag r={r} t={tracks[r.id]} today={today} />
      </span>
    </button>
  );

  /* ---------- views ---------- */

  function Upcoming() {
    const soon = dated
      .filter((r) => r.due! >= today && daysUntil(r.due!, today) <= 60)
      .sort((a, b) => a.due!.localeCompare(b.due!));
    const weeks = new Map<string, Requirement[]>();
    for (const r of soon) {
      const d = parse(r.due!);
      const monday = new Date(d.getTime() - ((d.getDay() + 6) % 7) * DAY);
      const k = iso(monday);
      weeks.set(k, [...(weeks.get(k) ?? []), r]);
    }
    return (
      <div className="grid gap-8">
        {past.length > 0 && (
          <div>
            <h3 className="flex items-baseline justify-between gap-4 text-[15px] font-medium">
              Earlier this year: confirm these were filed
              <span className="tnum font-[family-name:var(--font-mono)] text-[11px] text-[var(--dim)]">{past.length}</span>
            </h3>
            <p className="mt-1 max-w-[60ch] text-[13px] leading-[1.6] text-[var(--mid)]">
              Their deadlines have passed. Mark each one Submitted with its confirmation number, and the board report has a
              complete record for the year.
            </p>
            <details className="mt-3 border border-[var(--line)] bg-[var(--paper)]">
              <summary className="cursor-pointer px-4 py-3 text-[13px] text-[var(--teal)]">Show all {past.length}</summary>
              {past.map((r) => <Row key={r.id} r={r} />)}
            </details>
          </div>
        )}
        {[...weeks.entries()].map(([wk, rs]) => (
          <div key={wk}>
            <h3 className="flex items-baseline justify-between gap-4 text-[15px] font-medium">
              Week of {fmt(wk, { month: "long", day: "numeric" })}
              <span className="tnum font-[family-name:var(--font-mono)] text-[11px] text-[var(--dim)]">{rs.length} due</span>
            </h3>
            <div className="mt-3 border border-[var(--line)] bg-[var(--paper)]">
              {rs.map((r) => <Row key={r.id} r={r} />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function Calendar() {
    const [y, m] = month.split("-").map(Number);
    const first = new Date(y, m - 1, 1);
    const lead = (first.getDay() + 6) % 7;
    const daysIn = new Date(y, m, 0).getDate();
    const cells = Array.from({ length: Math.ceil((lead + daysIn) / 7) * 7 }, (_, i) => i - lead + 1);
    const shift = (n: number) => {
      const d = new Date(y, m - 1 + n, 1);
      setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    };
    const inMonth = dated.filter((r) => r.due!.startsWith(month));
    return (
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-medium">
            {first.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            <span className="ml-3 tnum text-[13px] font-normal text-[var(--dim)]">{inMonth.length} deadlines</span>
          </h3>
          <div className="flex gap-1">
            <button onClick={() => shift(-1)} className="min-h-[40px] border border-[var(--line-2)] px-3 text-[13px] hover:bg-[var(--sunk)]" aria-label="Previous month">←</button>
            <button onClick={() => setMonth(today.slice(0, 7))} className="min-h-[40px] border border-[var(--line-2)] px-3 text-[13px] hover:bg-[var(--sunk)]">Today</button>
            <button onClick={() => shift(1)} className="min-h-[40px] border border-[var(--line-2)] px-3 text-[13px] hover:bg-[var(--sunk)]" aria-label="Next month">→</button>
          </div>
        </div>
        <div className="mt-4 hidden grid-cols-7 gap-px border border-[var(--line)] bg-[var(--line)] md:grid">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="bg-[var(--sunk)] px-2 py-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--dim)]">{d}</div>
          ))}
          {cells.map((n, i) => {
            const ds = n >= 1 && n <= daysIn ? `${month}-${String(n).padStart(2, "0")}` : "";
            const rs = ds ? inMonth.filter((r) => r.due === ds) : [];
            return (
              <div key={i} className={`min-h-[112px] p-1.5 ${ds ? "bg-[var(--paper)]" : "bg-[var(--ground)]"}`}>
                {ds && (
                  <span className={`tnum inline-flex h-6 w-6 items-center justify-center text-[12px] ${ds === today ? "bg-[var(--ink)] text-[var(--on-deep)]" : "text-[var(--mid)]"}`}>{n}</span>
                )}
                <div className="mt-1 grid gap-1">
                  {rs.slice(0, 3).map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setOpen(r.id)}
                      className={`truncate border-l-2 px-1.5 py-0.5 text-left text-[11.5px] leading-[1.35] hover:bg-[var(--sunk)] ${DONE(tracks[r.id]?.status) ? "border-[var(--good)] text-[var(--dim)] line-through" : r.agency === "OSSE" ? "border-[var(--copper)] bg-[var(--copper-wash)]" : "border-[var(--teal)] bg-[var(--teal-wash)]"}`}
                      title={r.title}
                    >
                      {r.title}
                    </button>
                  ))}
                  {rs.length > 3 && (
                    <button onClick={() => setDay(ds)} className="px-1.5 text-left text-[11.5px] text-[var(--teal)] hover:underline">
                      +{rs.length - 3} more
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {day && day.startsWith(month) && (
          <div className="mt-4 hidden border border-[var(--line)] bg-[var(--paper)] md:block">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-2.5">
              <span className="text-[14px] font-medium">{fmt(day, { weekday: "long", month: "long", day: "numeric" })}</span>
              <button onClick={() => setDay(null)} className="text-[13px] text-[var(--mid)] hover:text-[var(--ink)]">Close</button>
            </div>
            {inMonth.filter((r) => r.due === day).map((r) => <Row key={r.id} r={r} />)}
          </div>
        )}
        <div className="mt-4 border border-[var(--line)] bg-[var(--paper)] md:hidden">
          {inMonth.length ? inMonth.map((r) => <Row key={r.id} r={r} />) : <p className="p-4 text-[14px] text-[var(--mid)]">Nothing due this month.</p>}
        </div>
        <p className="mt-3 flex flex-wrap gap-4 text-[12px] text-[var(--dim)]">
          <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 bg-[var(--teal)]" /> DC PCSB</span>
          <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 bg-[var(--copper)]" /> OSSE</span>
          <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 bg-[var(--good)]" /> Submitted</span>
        </p>
      </div>
    );
  }

  function Portals() {
    const groups = new Map<string, Requirement[]>();
    for (const r of mine) groups.set(r.platform, [...(groups.get(r.platform) ?? []), r]);
    const sorted = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
    return (
      <div>
        <p className="max-w-[64ch] text-[14px] leading-[1.65] text-[var(--mid)]">
          The same year&apos;s work, sorted by where it has to be filed. Each login shows how much is waiting behind it and when the
          next thing is due, so a single sitting in one system clears everything queued there.
        </p>
        <div className="mt-6 grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 xl:grid-cols-3">
          {sorted.map(([p, rs]) => {
            const openRs = rs.filter((r) => !DONE(tracks[r.id]?.status));
            const nextDue = openRs.filter((r) => r.due && r.due >= today).sort((a, b) => a.due!.localeCompare(b.due!))[0];
            return (
              <details key={p} className="group bg-[var(--paper)]">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 hover:bg-[var(--sunk)]">
                  <span>
                    <span className="block text-[15px] font-medium leading-[1.3]">{p}</span>
                    <span className="mt-1 block text-[12.5px] text-[var(--mid)]">
                      {nextDue ? <>Next: {nextDue.title.slice(0, 48)}{nextDue.title.length > 48 ? "…" : ""} · {fmt(nextDue.due!)}</> : "Nothing dated ahead"}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="tnum block text-[26px] leading-none">{openRs.length}</span>
                    <span className="font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-[0.14em] text-[var(--dim)]">open</span>
                  </span>
                </summary>
                <div className="border-t border-[var(--line)]">
                  {rs.sort((a, b) => (a.due ?? "9").localeCompare(b.due ?? "9")).map((r) => <Row key={r.id} r={r} />)}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    );
  }

  function All() {
    const list = items
      .filter((r) => scope === "any" || r.applies === scope)
      .filter((r) => !q || (r.title + r.platform + r.purpose + r.agency).toLowerCase().includes(q.toLowerCase()));
    return (
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search requirements, portals, agencies"
            className="min-h-[42px] w-full max-w-[26rem] border border-[var(--line-2)] bg-[var(--paper)] px-3 text-[14px] outline-none focus:border-[var(--ink)]"
          />
          {([["yes", "Applies to you"], ["if", "Only if triggered"], ["no", "Doesn't apply"], ["any", "Everything"]] as const).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setScope(k)}
              className={`min-h-[42px] border px-3 text-[13px] ${scope === k ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--on-deep)]" : "border-[var(--line-2)] hover:bg-[var(--sunk)]"}`}
            >
              {l} <span className="tnum opacity-70">{k === "any" ? items.length : items.filter((r) => r.applies === k).length}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 border border-[var(--line)] bg-[var(--paper)]">
          {list.map((r) => <Row key={r.id} r={r} />)}
          {!list.length && <p className="p-4 text-[14px] text-[var(--mid)]">No matches.</p>}
        </div>
      </div>
    );
  }

  function Report() {
    const due = dated.filter((r) => r.due! < today);
    const onTime = due.filter((r) => DONE(tracks[r.id]?.status));
    const owners = new Map<string, number>();
    for (const r of next30) owners.set(tracks[r.id]?.owner ?? r.owner, (owners.get(tracks[r.id]?.owner ?? r.owner) ?? 0) + 1);
    return (
      <div className="border border-[var(--line)] bg-[var(--paper)] p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="text-[20px] font-medium">Compliance report to the board</h3>
          <button onClick={() => window.print()} className="min-h-[40px] border border-[var(--line-2)] px-3 text-[13px] hover:bg-[var(--sunk)]">Print</button>
        </div>
        <p className="mt-1 text-[13px] text-[var(--dim)]">{school} · as of {fmt(today, { month: "long", day: "numeric", year: "numeric" })}</p>
        <div className="mt-6 grid gap-px bg-[var(--line)] sm:grid-cols-4">
          {[
            [`${onTime.length} of ${due.length}`, "past deadlines confirmed filed"],
            [String(next30.length), "due in the next 30 days"],
            [String(done.length), "submitted this year"],
            [String(mine.filter((r) => !r.due).length), "awaiting a published date"],
          ].map(([k, l]) => (
            <div key={l} className="bg-[var(--paper)] p-4">
              <span className="tnum block text-[28px] leading-none">{k}</span>
              <span className="mt-2 block text-[12.5px] text-[var(--mid)]">{l}</span>
            </div>
          ))}
        </div>
        <h4 className="mt-8 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--dim)]">Next 30 days, by owner</h4>
        <ul className="mt-3 grid gap-1 text-[14px]">
          {[...owners.entries()].sort((a, b) => b[1] - a[1]).map(([o, n]) => (
            <li key={o} className="flex justify-between border-b border-[var(--line)] py-1.5"><span>{o}</span><span className="tnum">{n}</span></li>
          ))}
        </ul>
        <h4 className="mt-8 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--dim)]">Submission log</h4>
        {done.length ? (
          <ul className="mt-3 grid gap-1 text-[14px]">
            {done.map((r) => (
              <li key={r.id} className="grid grid-cols-[1fr_auto] gap-4 border-b border-[var(--line)] py-1.5">
                <span>{r.title}</span>
                <span className="tnum text-[var(--mid)]">{tracks[r.id]?.submittedOn ? fmt(tracks[r.id]!.submittedOn!) : ""} {tracks[r.id]?.confirmation ? `· #${tracks[r.id]!.confirmation}` : ""}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[14px] text-[var(--mid)]">Nothing marked submitted yet. Open any requirement and set it to Submitted to start the log.</p>
        )}
      </div>
    );
  }

  const tabs = [
    ["upcoming", "Coming up"],
    ["calendar", "Calendar"],
    ["portals", "By login"],
    ["all", "All requirements"],
    ["report", "Board report"],
  ] as const;

  return (
    <div>
      <div className="grid grid-cols-2 gap-px border border-[var(--line)] bg-[var(--line)] lg:grid-cols-4">
        {[
          [next14.length, "due in the next 14 days", "copper"],
          [next30.length, "due in the next 30 days", "ink"],
          [past.length, "earlier this year, to mark off", "ink"],
          [done.length, `of ${mine.length} filed this year`, "good"],
        ].map(([n, l, tone]) => (
          <div key={l as string} className="bg-[var(--paper)] p-4 sm:p-5">
            <span className={`tnum block text-[28px] leading-none sm:text-[34px] ${tone === "copper" ? "text-[var(--copper)]" : tone === "good" ? "text-[var(--good)]" : ""}`}>{n}</span>
            <span className="mt-2 block text-[12.5px] text-[var(--mid)] sm:text-[13px]">{l}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line-2)]">
        <div className="-mb-px flex overflow-x-auto" role="tablist">
          {tabs.map(([k, l]) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={`min-h-[46px] whitespace-nowrap border-b-2 px-4 text-[14px] ${tab === k ? "border-[var(--ink)] font-medium text-[var(--ink)]" : "border-transparent text-[var(--mid)] hover:text-[var(--ink)]"}`}
            >
              {l}
            </button>
          ))}
        </div>
        <button onClick={downloadIcs} className="mb-2 min-h-[40px] border border-[var(--line-2)] px-3 text-[13px] hover:bg-[var(--sunk)]">
          Add to Outlook / Google Calendar
        </button>
      </div>

      <div className="mt-6">
        {tab === "upcoming" && Upcoming()}
        {tab === "calendar" && Calendar()}
        {tab === "portals" && Portals()}
        {tab === "all" && All()}
        {tab === "report" && Report()}
      </div>

      {current && (
        <Drawer key={current.id} r={current} t={tracks[current.id] ?? {}} today={today} save={save} onClose={() => setOpen(null)} />
      )}
    </div>
  );
}
