"use client";

import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  LineChart,
  School,
  GraduationCap,
  Users,
  ClipboardCheck,
  Database,
} from "lucide-react";
import type { Requirement } from "@/content/compliance";
import { gcPublic, gcSample } from "@/content/compliance/gc-profile";
import { ComplianceApp } from "@/components/compliance/ComplianceApp";
import { Bars, Lines, Meter, fmtMoney } from "./charts";
import { runPlan, type PlanInputs } from "./model";

type Tab = "overview" | "plan" | "enrollment" | "students" | "faculty" | "compliance" | "sources";

const NAV: { k: Tab; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { k: "overview", label: "Overview", icon: LayoutDashboard },
  { k: "plan", label: "5-year plan", icon: LineChart },
  { k: "enrollment", label: "Enrollment", icon: School },
  { k: "students", label: "Students", icon: GraduationCap },
  { k: "faculty", label: "Faculty", icon: Users },
  { k: "compliance", label: "Compliance", icon: ClipboardCheck },
  { k: "sources", label: "Data sources", icon: Database },
];

/* Calibrated so the model's cost structure reproduces the 2024–25 990 total
   ($5.47M on 198 students) within a few percent; every number is a slider. */
const DEFAULTS: PlanInputs = {
  startEnrollment: 198,
  gradesNow: 6,
  gradesAddedPerYear: [1, 1, 0, 0, 0],
  seatsPerGrade: 50,
  fillRate: 80,
  capacity: 400,
  perPupil: 30_000,
  perPupilGrowth: 2.5,
  studentsPerTeacher: 10,
  staffCostPerTeacher: 95_000,
  otherStaffPerTeacher: 0.6,
  raise: 3,
  attrition: 20,
  facilityCost: 600_000,
  otherPerPupil: 9_000,
};

const PRESETS: { name: string; patch: Partial<PlanInputs> }[] = [
  { name: "Current plan", patch: {} },
  { name: "Slow fill in the new building", patch: { fillRate: 65 } },
  { name: "Full by 2027–28", patch: { fillRate: 100 } },
  { name: "Keep more teachers", patch: { attrition: 10, raise: 4.5 } },
];

const mono = "text-[9px] font-semibold uppercase tracking-[0.12em]";

function Card({ title, tag, children, className = "" }: { title?: string; tag?: "public" | "sample" | "model"; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[12px] border border-[#edf0f4] bg-white p-5 ${className}`}>
      {(title || tag) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          {title && <h3 className="text-[14px] font-medium leading-[1.35] tracking-[-0.01em]">{title}</h3>}
          {tag && <Tag kind={tag} />}
        </div>
      )}
      {children}
    </div>
  );
}

function Tag({ kind }: { kind: "public" | "sample" | "model" }) {
  const t = {
    public: ["Public record", "bg-[#f0f5fc] text-[#3970af]"],
    sample: ["Sample data", "bg-[#fbf3ed] text-[#a0603a]"],
    model: ["Your model", "bg-[#f2f3f5] text-[#4a4f58]"],
  }[kind];
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${t[1]}`}>{t[0]}</span>;
}

function Kpi({ k, label, sub, tag }: { k: string; label: string; sub?: string; tag?: "public" | "sample" | "model" }) {
  return (
    <div className="rounded-[12px] border border-[#edf0f4] bg-white p-4 sm:p-5">
      <div className="flex flex-wrap-reverse items-start justify-between gap-2">
        <span className="tnum text-[26px] font-medium leading-none tracking-[-0.035em] sm:text-[30px]">{k}</span>
        {tag && <Tag kind={tag} />}
      </div>
      <span className="mt-2.5 block text-[12.5px] text-[#323b48]">{label}</span>
      {sub && <span className="mt-0.5 block text-[11.5px] text-[#6a6e77]">{sub}</span>}
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, format }: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void; format: (n: number) => string }) {
  return (
    <label className="grid gap-1.5">
      <span className="flex items-baseline justify-between text-[12.5px]">
        <span className="text-[var(--mid)]">{label}</span>
        <span className="tnum font-medium">{format(value)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[#3778bc]" />
    </label>
  );
}

export function Dashboard({ items, storageKey, school, token }: { items: Requirement[]; storageKey: string; school: string; token: string }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [p, setP] = useState<PlanInputs>(DEFAULTS);
  const [preset, setPreset] = useState("Current plan");
  const [asked, setAsked] = useState<number | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);
  const qi = asked ?? 0;
  const [custom, setCustom] = useState<{ q: string; head: string; answer: string; evidence: string[] } | null>(null);
  const [draft, setDraft] = useState("");
  const [asking, setAsking] = useState(false);
  const [askErr, setAskErr] = useState("");
  const set = (patch: Partial<PlanInputs>) => {
    setPreset("");
    setP((prev) => ({ ...prev, ...patch }));
  };

  const plan = useMemo(() => runPlan(p), [p]);
  const low = useMemo(() => runPlan({ ...p, fillRate: Math.max(40, p.fillRate - 10) }), [p]);
  const firstDeficit = plan.find((y) => y.net < 0);
  const y1 = plan[0];
  const y2 = plan[1];
  const fiveYearNet = plan.reduce((a, y) => a + y.net, 0);
  const applies = items.filter((r) => r.applies === "yes");
  const octCount = applies.filter((r) => r.due?.startsWith("2026-10")).length;

  const questions = [
    {
      tab: "Plan the next grade",
      q: "Can we afford to open grade 5 in 2027–28?",
      head: y2.net >= 0 ? "Yes, on the current plan." : "Not yet, on the current plan.",
      evidence: "5-year plan tab · FY25 990: $6.11M revenue on 198 students · UPSFF FY27 $15,455 · charter ceiling 400",
      a: `2027–28 ends ${y2.net >= 0 ? "with a surplus" : "with a deficit"} of ${fmtMoney(Math.abs(y2.net))} at ${y2.enrollment} students across ${y2.grades} grades. A classroom covers its own staff once it holds ${Math.ceil((p.staffCostPerTeacher * (1 + p.otherStaffPerTeacher)) / (p.perPupil - p.otherPerPupil))} students, so the risk is an under-filled grade, not the grade itself.`,
    },
    {
      tab: "Staff for growth",
      q: "How many teachers do we need to hire for next year?",
      head: `${y2.hires} hires for 2027–28.`,
      evidence: "5-year plan tab: students per teacher, turnover rate · HR system once connected",
      a: `${Math.max(0, y2.teachers - y1.teachers)} new positions as enrollment grows to ${y2.enrollment}, and about ${y2.hires - Math.max(0, y2.teachers - y1.teachers)} to replace the ${p.attrition}% who typically leave. Immersion roles in Mandarin and Spanish take longest to fill, so those postings should go up first.`,
    },
    {
      tab: "Stress-test enrollment",
      q: "What if enrollment comes in 10 points under plan?",
      head: low.some((y) => y.net < 0) ? "It dips into deficit." : "The plan holds, with less room.",
      evidence: "5-year plan tab, rerun at fill rate minus 10 points · October audited count",
      a: `Five-year net falls from ${fmtMoney(fiveYearNet)} to ${fmtMoney(low.reduce((a, y) => a + y.net, 0))}. ${low.find((y) => y.net < 0) ? `The first deficit year would be ${low.find((y) => y.net < 0)!.year}.` : "No year goes into deficit, but the cushion for the building thins."} That is the number to watch in the October count.`,
    },
    {
      tab: "Find the crunch",
      q: "When are our heaviest compliance weeks?",
      head: `October: ${octCount} deadlines.`,
      evidence: "DC PCSB 2026–27 LEA Submission Calendar · OSSE LEA Requirements Calendar",
      a: `October 2026 carries ${octCount} deadlines, the most of any month, clustered on October 1, the Enrollment Audit window and the Compass data submissions around October 23. Those should be assigned now.`,
    },
  ];

  const shown = custom ?? { q: questions[qi].q, head: questions[qi].head, answer: questions[qi].a, evidence: [questions[qi].evidence] };

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    const question = draft.trim();
    if (question.length < 4 || asking) return;
    setAsking(true);
    setAskErr("");
    setShowEvidence(false);
    try {
      const res = await fetch("/api/compliance/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          question,
          plan: plan.map(({ year, grades, enrollment, revenue, expenses, net, teachers, hires, staff }) => ({ year, grades, enrollment, revenue, expenses, net, teachers, hires, staff })),
          assumptions: {
            fillRatePct: p.fillRate,
            seatsPerGrade: p.seatsPerGrade,
            fundingPerStudent: p.perPupil,
            fundingGrowthPct: p.perPupilGrowth,
            studentsPerTeacher: p.studentsPerTeacher,
            costPerStaffMember: p.staffCostPerTeacher,
            raisePct: p.raise,
            teacherTurnoverPct: p.attrition,
            buildingCostPerYear: p.facilityCost,
            otherCostPerStudent: p.otherPerPupil,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Arthur could not answer just now.");
      setCustom({ q: question, head: data.head, answer: data.answer, evidence: data.evidence ?? [] });
      setDraft("");
    } catch (err) {
      setAskErr(err instanceof Error ? err.message : "Arthur could not answer just now.");
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="ll-os overflow-hidden rounded-[16px] border border-[#dcdfe6] bg-white shadow-[0_24px_56px_#202d4210]">
      <div className="flex min-h-[56px] flex-wrap items-center justify-between gap-2 border-b border-[#edf0f4] px-4 py-3 text-[11px] text-[#8b8e96] sm:px-6">
        <div className="flex items-center gap-4">
          <span className="flex gap-1" aria-hidden="true">
            <i className="h-2 w-2 rounded-full bg-[#dfe2e8]" />
            <i className="h-2 w-2 rounded-full bg-[#dfe2e8]" />
            <i className="h-2 w-2 rounded-full bg-[#dfe2e8]" />
          </span>
          <span>LOVELEEDAY / {school}</span>
        </div>
        <span className="flex items-center gap-2 text-[10px]">
          <i className="h-[5px] w-[5px] rounded-full bg-[#719cb1]" aria-hidden="true" />
          Interactive system preview
        </span>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[210px_minmax(0,1fr)]">
        {/* nav */}
        <nav className="flex min-w-0 gap-1 overflow-x-auto border-b border-[#edf0f4] bg-[#fafbfc] p-2 lg:flex-col lg:border-b-0 lg:border-r lg:px-4 lg:py-6" aria-label="Dashboard">
          <span className="mx-2 mb-3 hidden text-[9px] uppercase tracking-[0.12em] text-[#6a6e77] lg:block">Workspace</span>
          {NAV.map(({ k, label, icon: Icon }) => (
            <button
              key={k}
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
            Charter and amendments
            <br />DC PCSB and OSSE calendars
            <br />990 and audited financials
            <br />My School DC profile
          </p>
        </nav>

        <div className="min-w-0 bg-white p-4 sm:p-6 lg:p-8">
          {tab === "overview" && (
            <div className="grid gap-5">
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <Kpi k={String(gcPublic.enrollment2425)} label="Students, 2024–25" sub={`charter allows ${gcPublic.ceiling[6].n} by 2027–28`} tag="public" />
                <Kpi k={fmtMoney(gcPublic.revenueFY25)} label="Revenue, FY25" sub={`+${Math.round((gcPublic.revenueFY25 / gcPublic.revenueFY24 - 1) * 100)}% on FY24`} tag="public" />
                <Kpi k={fmtMoney(y2.net)} label="Projected 2027–28 net" sub={`at ${y2.enrollment} students`} tag="model" />
                <Kpi k={String(octCount)} label="Compliance deadlines in October" sub="your heaviest month" tag="public" />
              </div>

              <div>
                <div className="flex flex-wrap gap-2" role="tablist" aria-label="Questions for Arthur">
                  {questions.map((x, i) => (
                    <button
                      key={x.q}
                      role="tab"
                      aria-selected={!custom && qi === i}
                      onClick={() => {
                        setAsked(i);
                        setCustom(null);
                        setShowEvidence(false);
                      }}
                      className={`min-h-[36px] rounded-full border px-3.5 text-[12px] ${!custom && qi === i ? "border-[#d8e6f8] bg-[#f0f5fc] text-[#3970af]" : "border-[#e8ebf0] bg-white text-[#818692] hover:text-[#4a4f58]"}`}
                    >
                      {x.tab}
                    </button>
                  ))}
                </div>
                <h3 className="mt-6 text-[22px] font-medium leading-[1.35] tracking-[-0.025em]">{shown.q}</h3>
                <div className="mt-5 flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-[linear-gradient(130deg,#f1f5fa,#e1e9f7)] text-[18px] text-[#618bbc]" aria-hidden="true">✧</span>
                  <div className="min-w-0 max-w-[560px] text-[14px] leading-[1.75] text-[#6c7481]">
                    <strong className="font-medium text-[#323b48]">{shown.head}</strong>
                    <br />
                    {shown.answer}
                    <button onClick={() => setShowEvidence((v) => !v)} aria-expanded={showEvidence} className="mt-3 block min-h-[24px] text-[12px] text-[#477bae]">
                      View the evidence <span aria-hidden="true">↗</span>
                    </button>
                    {showEvidence && (
                      <div className="mt-2 border-l border-[#cbd9ed] pl-4 text-[12px] leading-[1.8] text-[#778393]">
                        <strong className="font-medium text-[#394b64]">Grounded in</strong>
                        <br />
                        {shown.evidence.map((ev, i) => (
                          <span key={i} className="block">{ev}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <form onSubmit={ask} className="mt-6 flex flex-wrap items-center gap-3 rounded-[8px] border border-[#e2e6ed] bg-[#fcfcfd] p-2 pl-4 focus-within:border-[#b9cde8]">
                  <label htmlFor="ask-arthur" className="sr-only">Ask Arthur a question</label>
                  <input
                    id="ask-arthur"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    maxLength={400}
                    placeholder="Ask your own question: budget, enrollment, staffing or a deadline"
                    className="min-h-[40px] min-w-0 flex-1 bg-transparent text-[13px] text-[#323b48] outline-none placeholder:text-[#868a93]"
                  />
                  <button
                    type="submit"
                    disabled={asking || draft.trim().length < 4}
                    className="min-h-[36px] rounded-full bg-[#1d1d1f] px-4 text-[12px] text-white disabled:bg-[#c9ccd3]"
                  >
                    {asking ? "Thinking…" : "Ask Arthur ✧"}
                  </button>
                </form>
                <p className={`mt-2 text-[11px] ${askErr ? "text-[#b3261e]" : "text-[#6a6e77]"}`} aria-live="polite">
                  {askErr || "Live. Arthur answers from your school's public record, the DC calendars and the plan on your screen, and shows where each answer came from."}
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                <Card title="Enrollment: charter ceiling vs your plan" tag="model">
                  <Bars
                    data={plan.map((y, i) => ({ label: y.year, value: y.enrollment, tone: i === 0 ? "ink" : "teal" }))}
                    cap={gcPublic.building.occupancy}
                    capLabel="Charter ceiling 400"
                  />
                </Card>
                <Card title="Revenue and spending, five years" tag="model">
                  <Lines
                    labels={plan.map((y) => y.year)}
                    series={[
                      { name: "Revenue", values: plan.map((y) => y.revenue), color: "var(--teal)" },
                      { name: "Spending", values: plan.map((y) => y.expenses), color: "var(--copper)" },
                    ]}
                  />
                </Card>
              </div>
            </div>
          )}

          {tab === "plan" && (
            <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
              <Card title="Assumptions" tag="model">
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {PRESETS.map((pr) => (
                    <button
                      key={pr.name}
                      onClick={() => {
                        setP({ ...DEFAULTS, ...pr.patch });
                        setPreset(pr.name);
                      }}
                      className={`min-h-[32px] rounded-full border px-3 text-[11.5px] ${preset === pr.name ? "border-[#d8e6f8] bg-[#f0f5fc] text-[#3970af]" : "border-[#e8ebf0] text-[#818692] hover:text-[#4a4f58]"}`}
                    >
                      {pr.name}
                    </button>
                  ))}
                </div>
                <div className="grid gap-4">
                  <Slider label="Seats filled in each grade" value={p.fillRate} min={40} max={100} step={1} onChange={(n) => set({ fillRate: n })} format={(n) => `${n}%`} />
                  <Slider label="Seats per grade" value={p.seatsPerGrade} min={30} max={60} step={2} onChange={(n) => set({ seatsPerGrade: n })} format={(n) => String(n)} />
                  <Slider label="Public funding per student" value={p.perPupil} min={22_000} max={36_000} step={500} onChange={(n) => set({ perPupil: n })} format={(n) => `$${n.toLocaleString()}`} />
                  <Slider label="Funding growth per year" value={p.perPupilGrowth} min={0} max={5} step={0.25} onChange={(n) => set({ perPupilGrowth: n })} format={(n) => `${n}%`} />
                  <Slider label="Students per teacher" value={p.studentsPerTeacher} min={7} max={16} step={0.5} onChange={(n) => set({ studentsPerTeacher: n })} format={(n) => String(n)} />
                  <Slider label="Cost per staff member" value={p.staffCostPerTeacher} min={70_000} max={130_000} step={1_000} onChange={(n) => set({ staffCostPerTeacher: n })} format={(n) => `$${Math.round(n / 1000)}k`} />
                  <Slider label="Annual raise" value={p.raise} min={0} max={8} step={0.5} onChange={(n) => set({ raise: n })} format={(n) => `${n}%`} />
                  <Slider label="Teachers leaving each year" value={p.attrition} min={0} max={40} step={1} onChange={(n) => set({ attrition: n })} format={(n) => `${n}%`} />
                  <Slider label="Building cost per year" value={p.facilityCost} min={200_000} max={1_500_000} step={25_000} onChange={(n) => set({ facilityCost: n })} format={(n) => fmtMoney(n)} />
                  <Slider label="Other cost per student" value={p.otherPerPupil} min={4_000} max={14_000} step={250} onChange={(n) => set({ otherPerPupil: n })} format={(n) => `$${n.toLocaleString()}`} />
                </div>
                <p className="mt-5 text-[11.5px] leading-[1.55] text-[var(--dim)]">
                  Starting point: FY25 revenue of $6.11M on 198 students is about $30,900 per student from every public
                  source; DC&apos;s base rate rises 2.55% in FY27. Grade 4 opens in 2026–27 and grade 5 in 2027–28, and the
                  charter caps enrollment at 400.
                </p>
              </Card>
              <div className="grid content-start gap-5">
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                  <Kpi k={fmtMoney(fiveYearNet)} label="Five-year net" />
                  <Kpi k={firstDeficit ? firstDeficit.year : "None"} label="First deficit year" />
                  <Kpi k={String(plan[plan.length - 1].enrollment)} label="Students at full build" sub="of 400 allowed" />
                  <Kpi k={String(plan.reduce((a, y) => a + y.hires, 0))} label="Teacher hires, five years" />
                </div>
                <Card title="Revenue and spending">
                  <Lines
                    labels={plan.map((y) => y.year)}
                    series={[
                      { name: "Revenue", values: plan.map((y) => y.revenue), color: "var(--teal)" },
                      { name: "Spending", values: plan.map((y) => y.expenses), color: "var(--copper)" },
                      { name: "Revenue if 10 points under", values: low.map((y) => y.revenue), color: "var(--dim)", dashed: true },
                    ]}
                  />
                </Card>
                <Card title="Year by year">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-[13px]">
                      <thead>
                        <tr className="border-b border-[var(--line-2)] text-left text-[var(--dim)]">
                          {["Year", "Grades", "Students", "Revenue", "Spending", "Net", "Teachers", "Hires"].map((h) => (
                            <th key={h} className="py-2 pr-3 font-normal">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="tnum">
                        {plan.map((y) => (
                          <tr key={y.year} className="border-b border-[var(--line)]">
                            <td className="py-2 pr-3">{y.year}</td>
                            <td className="py-2 pr-3">{y.grades === 8 ? "PK3–5" : `PK3–${y.grades - 3}`}</td>
                            <td className="py-2 pr-3">{y.enrollment}</td>
                            <td className="py-2 pr-3">{fmtMoney(y.revenue)}</td>
                            <td className="py-2 pr-3">{fmtMoney(y.expenses)}</td>
                            <td className={`py-2 pr-3 ${y.net < 0 ? "text-[#B3261E]" : "text-[var(--good)]"}`}>{fmtMoney(y.net)}</td>
                            <td className="py-2 pr-3">{y.teachers}</td>
                            <td className="py-2 pr-3">{y.hires}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {tab === "enrollment" && (
            <div className="grid gap-5 xl:grid-cols-2">
              <Card title="What the charter allows each year" tag="public">
                <Bars data={gcPublic.ceiling.map((c) => ({ label: c.sy, value: c.n, tone: c.sy === "24–25" ? "ink" : "teal" }))} />
                <p className="mt-3 text-[12.5px] leading-[1.6] text-[var(--mid)]">
                  In 2024–25 the school enrolled {gcPublic.enrollment2425} against a ceiling of 250. The ceiling reaches 400 in
                  2027–28, the year the new {gcPublic.building.ward} building is meant to be full.
                </p>
              </Card>
              <Card title="Your seat plan" tag="model">
                <Bars data={plan.map((y) => ({ label: y.year, value: y.enrollment }))} cap={400} capLabel="400" />
                <p className="mt-3 text-[12.5px] leading-[1.6] text-[var(--mid)]">
                  At {p.fillRate}% of {p.seatsPerGrade} seats a grade, you reach {plan[plan.length - 1].enrollment} students.
                  {plan[plan.length - 1].enrollment < 400 ? ` That leaves ${400 - plan[plan.length - 1].enrollment} funded seats the charter allows but the plan does not fill.` : " The building is full."} Change it on the 5-year plan tab.
                </p>
              </Card>
              <Card title="Re-enrollment intent for next year" tag="sample">
                <Bars data={gcSample.reEnrollment.map((r, i) => ({ label: r.label, value: r.n, tone: i === 0 ? "teal" : i === 1 ? "copper" : "muted" }))} height={140} />
                <p className="mt-3 text-[12.5px] leading-[1.6] text-[var(--mid)]">
                  The undecided families are the ones worth a call before the lottery. Arthur lists them by grade with what
                  each has told you.
                </p>
              </Card>
              <Card title="The new building" tag="public">
                <dl className="grid grid-cols-[9rem_1fr] gap-y-2 text-[13.5px]">
                  <dt className="text-[var(--dim)]">Location</dt><dd>{gcPublic.building.ward}</dd>
                  <dt className="text-[var(--dim)]">Classrooms today</dt><dd>{gcPublic.building.classrooms}</dd>
                  <dt className="text-[var(--dim)]">Occupancy</dt><dd>Certificate to be revised for {gcPublic.building.occupancy}+</dd>
                  <dt className="text-[var(--dim)]">Renovation</dt><dd>{gcPublic.building.renovation}</dd>
                  <dt className="text-[var(--dim)]">Full PK3–5</dt><dd>{gcPublic.building.fullBuildout}</dd>
                </dl>
                <p className="mt-3 text-[12.5px] leading-[1.6] text-[var(--mid)]">
                  The move is also a recruitment question: families in Ward 7 who travel further, and new Ward 6 families who
                  have not heard of you yet.
                </p>
              </Card>
            </div>
          )}

          {tab === "students" && (
            <div className="grid gap-5">
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <Kpi k={String(gcPublic.qsr.enrolled)} label="Students at the site review" sub={gcPublic.qsr.asOf} tag="public" />
                <Kpi k={`${Math.round((gcPublic.qsr.swd / gcPublic.qsr.enrolled) * 100)}%`} label="Students with disabilities" sub={`${gcPublic.qsr.swd} students`} tag="public" />
                <Kpi k={`${Math.round((gcPublic.qsr.eml / gcPublic.qsr.enrolled) * 100)}%`} label="Emerging multilingual learners" sub={`${gcPublic.qsr.eml} students`} tag="public" />
                <Kpi k={String(gcSample.familySatisfaction)} label="Family satisfaction" sub="out of 5" tag="sample" />
              </div>
              <div className="grid gap-5 xl:grid-cols-2">
                <Card title="Attendance, this year" tag="sample">
                  <Bars data={gcSample.attendanceTiers.map((t, i) => ({ label: t.label, value: t.n, tone: i < 2 ? "teal" : "copper" }))} height={150} />
                </Card>
                <Card title="Who the school serves" tag="public">
                  <div className="grid gap-3">
                    {gcPublic.demographics.map((d) => (
                      <div key={d.label} className="grid grid-cols-[8rem_1fr_2.5rem] items-center gap-3 text-[13px]">
                        <span className="text-[var(--mid)]">{d.label}</span>
                        <Meter value={d.pct} />
                        <span className="tnum text-right">{d.pct}%</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              <Card title="Early warning: Arthur flags these before a teacher has to" tag="sample">
                <div className="divide-y divide-[var(--line)]">
                  {gcSample.earlyWarning.map((s) => (
                    <div key={s.id} className="grid gap-1 py-3 sm:grid-cols-[8rem_3rem_1fr_12rem] sm:items-center sm:gap-3">
                      <span className="text-[13.5px] font-medium">{s.id}</span>
                      <span className="text-[12.5px] text-[var(--dim)]">{s.grade}</span>
                      <span className="text-[13.5px] text-[var(--mid)]">{s.flag}</span>
                      <span className="text-[12.5px] text-[var(--teal)]">{s.action}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {tab === "faculty" && (
            <div className="grid gap-5">
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <Kpi k={String(gcSample.staffRoles.reduce((a, r) => a + r.n, 0))} label="Staff today" tag="sample" />
                <Kpi k={`${gcSample.retention[gcSample.retention.length - 1].pct}%`} label="Teachers retained" sub="this year" tag="sample" />
                <Kpi k={String(y2.hires)} label="Hires needed for 2027–28" sub="from your 5-year plan" tag="model" />
                <Kpi k={String(y2.teachers)} label="Teachers at 2027–28 enrollment" tag="model" />
              </div>
              <div className="grid gap-5 xl:grid-cols-2">
                <Card title="Teacher retention by year" tag="sample">
                  <Bars data={gcSample.retention.map((r) => ({ label: r.sy, value: r.pct, tone: "teal" }))} format={(n) => `${n}%`} height={150} />
                </Card>
                <Card title="Staff survey" tag="sample">
                  <div className="grid gap-3">
                    {gcSample.survey.map((s) => (
                      <div key={s.label} className="grid gap-1.5">
                        <span className="flex justify-between gap-3 text-[13px]"><span className="text-[var(--mid)]">{s.label}</span><span className="tnum">{s.score.toFixed(1)}</span></span>
                        <Meter value={s.score} max={5} tone={s.score < 3.2 ? "var(--copper)" : "var(--teal)"} />
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 border-l-2 border-[var(--copper)] pl-3 text-[12.5px] leading-[1.6] text-[var(--mid)]">
                    Arthur&apos;s read: workload is the lowest score, and the year with the lowest retention followed the lowest
                    workload score. Ask about workload in the spring survey before contracts go out.
                  </p>
                </Card>
              </div>
              <Card title="Where the staff are" tag="sample">
                <Bars data={gcSample.staffRoles.map((r) => ({ label: r.label, value: r.n, tone: "ink" }))} height={140} />
              </Card>
            </div>
          )}

          {tab === "compliance" && <ComplianceApp items={items} storageKey={storageKey} school={school} />}

          {tab === "sources" && (
            <div className="grid gap-5">
              <p className="max-w-[64ch] text-[14px] leading-[1.65] text-[var(--mid)]">
                Planning takes weeks because the numbers live in a dozen places. Arthur reads each of them on a schedule, so
                the dashboard is current when leadership sits down, not after someone spends a week exporting spreadsheets.
              </p>
              <div className="grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 xl:grid-cols-3">
                {[
                  ["DC PCSB and OSSE calendars", "Compliance deadlines", "Loaded"],
                  ["Charter agreement and amendments", "Enrollment ceiling, grades", "Loaded"],
                  ["IRS 990 and audited financials", "Revenue, spending, assets", "Loaded"],
                  ["My School DC", "Lottery demand, waitlists", "Connect"],
                  ["Student information system", "Attendance, enrollment, re-enrollment", "Connect"],
                  ["OSSE Qlik and SLED", "Audited enrollment, data validation", "Connect"],
                  ["Accounting system (back office)", "Monthly actuals vs budget", "Connect"],
                  ["HR and payroll", "Staffing, turnover, cost", "Connect"],
                  ["Family and staff surveys", "Satisfaction, retention risk", "Connect"],
                ].map(([name, what, status]) => (
                  <div key={name} className="bg-[var(--paper)] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[14px] font-medium leading-[1.3]">{name}</span>
                      <span className={`shrink-0 border px-1.5 py-px ${mono} !text-[9.5px] ${status === "Loaded" ? "border-[var(--good)] text-[var(--good)]" : "border-[var(--line-2)] text-[var(--dim)]"}`}>{status === "Loaded" ? "Loaded" : "At onboarding"}</span>
                    </div>
                    <span className="mt-1 block text-[12.5px] text-[var(--mid)]">{what}</span>
                  </div>
                ))}
              </div>
              <Card title="Public sources behind this preview">
                <ul className="grid gap-1.5 text-[13px]">
                  {gcPublic.sources.map((s) => (
                    <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="underline decoration-[var(--line-2)] underline-offset-2 hover:text-[var(--teal)]">{s.label}</a></li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
