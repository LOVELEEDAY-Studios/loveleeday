// School intelligence program, trained on one closed DC charter school's real 2016-2019 files.
// The school is a training case, not a prospect: what Arthur would have predicted for it, and what Arthur
// does inside schools like it. Anonymized as "the training school"; every figure traces to the private pilot folder.

import data from "./school-intel-data.json";
const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const short = (n: number) => (Math.abs(n) >= 1e6 ? "$" + (Math.round(n / 1e5) / 10).toLocaleString("en-US") + "M" : "$" + Math.round(n / 1000).toLocaleString("en-US") + "K");
const pct = (n: number) => `${n}%`;
const days = (n: number) => `${n} days`;
const c = data.context, o = data.operations, v = data.savings, p = data.pattern, a = data.projection, b = data.backtest;
export type Sev = "fix" | "watch" | "good";

export const sysClients = [
  { token: "lanette-edu", short: "School intelligence program", preparedFor: "internal review", role: "program design" },
];
export const getSysClient = (t: string) => sysClients.find((c) => c.token === t);

export const copy = {
  glanceDate: "the training school, read as of each date, never with hindsight",
  gradesHead: ["Everything a small school runs on,", "watched in one place."] as [string, string],
  gradesLead:
    "A small school is a business with a mission: students, staff, a building, lunch, buses, grants and an authorizer. Here is what Arthur watches in each area, and how the training school looked in it.",
  findingsHead: ["What Arthur would have flagged,", "and when."] as [string, string],
  findingsLead: "Each flag uses only what the school knew at the time. The dates are when the signal first showed up in its own files.",
  pathsEyebrow: "How Arthur works inside a school",
  pathsHead: ["A data partner for operations,", "not another dashboard."] as [string, string],
  pathsLead:
    "Arthur reads the files a school already keeps, such as the budget, bank balances, enrollment, the lunch program, facility costs, staffing and academic results. It tells leaders what needs attention early, what can be cut and what to bring to the board.",
  nextHead: ["What is built,", "and what comes next."] as [string, string],
  nextLead:
    "The cash warning and the rating rebuild already run on the training school's files. The academic projection and the relief-money check run on public records too. The next step is the training school's attendance, test results and monthly bank balances.",
};

export const hero = {
  a: "One closed school, read again.",
  b: "What Arthur would have seen coming.",
  lead:
    `A DC charter school had healthy actual cash and a surplus each year. Its own spring forecast warned of a cash squeeze, while its academic scores fell short of the renewal target. Arthur could have called both signals early and helped the school respond.`,
};

export const glance = [
  { k: "June 2017", label: "First sign of renewal risk. The planning team wrote a goal to define its own goals outside the authorizer's academic score", src: "Strategic plan notes" },
  { k: "Sept 2017", label: `The budget had ${data.students_to_breach.value} students of room before planned cash crossed the minimum.`, src: "Budget model" },
  { k: "May 2018", label: `The school's own forecast put June cash at ${days(c.forecast_days)}, below the ${days(c.minimum_days)} minimum. Actual cash remained healthy.`, src: "Monthly cash forecast; authorizer report" },
  { k: "Fall 2018", label: `Enrollment moved from ${c.enrollment_prior} to ${c.enrollment_later}, a ${pct(c.enrollment_change_pct)} change.`, src: "Authorizer renewal report" },
  { k: "Dec 2018", label: `The authorizer voted ${c.vote_for} to ${c.vote_against} to close the school for academics.`, src: "Authorizer renewal report" },
];

export const grades: { area: string; grade: string; why: string }[] = [
  { area: "Academics and renewal", grade: "F", why: "Arthur tracks the authorizer's academic score each year and projects it to renewal. The training school had no academic data next to its money, and this is what closed it." },
  { area: "Enrollment", grade: "D", why: `Enrollment moved from ${c.enrollment_prior} to ${c.enrollment_later}. The fall budget had room for ${data.students_to_breach.value} fewer students before planned cash crossed the minimum.` },
  { area: "Cash and rating", grade: "C", why: `Actual cash stayed between ${days(c.actual_cash_days_min)} and ${days(c.actual_cash_days_max)} with annual surpluses. The May forecast warned of ${days(c.forecast_days)} in June, below the ${days(c.minimum_days)} minimum. Cash did not close the school.` },
  { area: "Building and maintenance", grade: "C", why: `Net rent of ${money(o.building.net_rent)} was covered by ${money(o.building.facility_alloc)} in facilities money. Building running costs of ${money(o.building.running_costs)} came from classroom money.` },
  { area: "Lunch", grade: "C", why: `The vendor cost ${money(o.lunch.groups.lunch_cost.total)} against ${money(o.lunch.groups.lunch_revenue.total)} in meal money. Arthur checks meal counts, claims and bills.` },
  { area: "Staff", grade: "C", why: `Substitutes cost ${money(o.substitutes.total)}. Only ${pct(c.teacher_schedule_input_pct)} of teachers had a say in schedules. Arthur connects absences, spending and feedback.` },
  { area: "Outside services", grade: "C", why: `Outside services cost ${money(o.outside_services.total)}. Arthur reviews the analysis work within those contracts.` },
  { area: "Budget discipline", grade: "B+", why: "A monthly model, account by account, whose cash path ties out to the dollar. The data was good. Nobody was reading it all together." },
];

export const findings: { sev: Sev; area: string; t: string; d: string }[] = [
  { sev: "fix", area: "June 2017 · Renewal", t: "The score that would decide the charter was set aside.", d: "The strategic plan notes include 'start defining our own set of goals outside of the PMF'. The PMF is the authorizer's academic scorecard, and 18 months later it closed the school. Arthur keeps that score at the center from year one and projects it to the renewal date." },
  { sev: "fix", area: "Fall 2017 · Enrollment", t: "The enrollment plan had a thin cushion.", d: `The budget allowed ${data.students_to_breach.value} lost students before planned cash crossed the minimum. Enrollment later moved from ${c.enrollment_prior} to ${c.enrollment_later}.` },
  { sev: "fix", area: "Spring 2018 · Spending", t: "Spending ran over plan in the spring.", d: `The forecast showed overruns in classroom costs (${short(c.class_overrun)}), salaries (${short(c.salary_overrun)}), office (${short(c.office_overrun)}), building services (${short(c.building_overrun)}) and contract staff (${short(c.contract_overrun)}). A monthly check would have raised this in April.` },
  { sev: "watch", area: "May 2018 · Cash", t: "The forecast called for a cash response.", d: `The fall budget showed ${days(data.days_at_june.value)} for June. The May forecast fell to ${days(c.forecast_days)}, below the ${days(c.minimum_days)} minimum. Actual cash stayed at ${days(c.actual_cash_days_min)} to ${days(c.actual_cash_days_max)} with annual surpluses. The warning was worth acting on; cash did not close the school.` },
  { sev: "watch", area: "Every month · Lunch", t: "The lunch program needed a monthly check.", d: `The ${money(o.lunch.gap)} gap between vendor costs and meal money deserves a check of counts, claims and invoices. Its cause is not established.` },
  { sev: "watch", area: "Every month · Building", t: "Building operations drew on classroom money.", d: `After the property tax offset, net rent of ${money(o.building.net_rent)} was covered by the ${money(o.building.facility_alloc)} facilities allotment. Utilities, repairs, services, janitorial supplies and custodial staff added ${money(o.building.running_costs)}.` },
  { sev: "watch", area: "Board", t: "The board summary and its tables disagreed.", d: `The prose claimed ${days(c.board_claim_days)} of cash and a ${pct(c.board_claim_margin_pct)} margin. Its tables showed ${days(data.days_at_june.value)} and ${pct(c.board_actual_margin_pct)}. Arthur checks the words against the numbers.` },
  { sev: "good", area: "Liquidity", t: "Actual cash was healthy.", d: `The authorizer reported ${days(c.actual_cash_days_min)} to ${days(c.actual_cash_days_max)} in the final reported years and a surplus every year. Closure was academic.` },
];

export const savings = {
  groups: [
    { title: "Revenue protected", detail: "Keep half to all of the students lost through better retention checks.", range: `${short(v.retention_low)} to ${short(v.retention_high)} a year` },
    { title: "Costs reduced each year", detail: `Building ${short(v.building_low)} to ${short(v.building_high)}; lunch ${short(v.lunch_low)} to ${short(v.lunch_high)}; substitutes ${short(v.substitutes_low)} to ${short(v.substitutes_high)}; outside services ${short(v.outside_low)} to ${short(v.outside_high)}.`, range: `${short(v.recurring_low)} to ${short(v.recurring_high)} a year` },
    { title: "One-time overspend caught in April", detail: "Hold part of the spring overrun with monthly budget checks.", range: `${short(v.one_time_low)} to ${short(v.one_time_high)} once` },
  ],
  total: `${short(v.combined_low)} to ${short(v.combined_high)}`,
  note: `Even the low end exceeds the roughly ${short(v.shortfall_cash)} needed to keep the May forecast's June cash at the ${days(c.minimum_days)} minimum. These are estimates, not realized savings. They would not have saved the charter; closure was academic.`,
  tax: `Budget check: unemployment tax was budgeted at ${money(v.unemployment_budget)} against an estimated ceiling of ${money(v.unemployment_ceiling)} for ${v.headcount} staff. The tax rate year and turnover need checking. This is not counted as a saving.`,
};

const e = data.eagle;
export const eagle = {
  intro: `A second DC school, Eagle Academy, closed in August 2024, days before school started. Its academics were fine. From ${e.students_2019} students to ${e.students_2023}, enrollment fell ${pct(e.enrollment_drop_pct)}, but revenue fell only ${pct(e.revenue_drop_pct)} and spending only ${pct(e.spend_drop_pct)}. Spending per student went from ${money(e.spend_per_student_2019)} to ${money(e.spend_per_student_2023)}. Pandemic relief money filled the gap, so cash looked strong: ${days(e.cash_2022)} in 2022.`,
  rows: e.rows.map(r => ({ fy: `FY${r.fy}`, students: `${r.students} students`, line: `${r.temporary > 500000 ? `One-time money ${short(r.temporary)}` : "Little one-time money"} · ${r.gap > 0 ? `gap underneath ${short(r.gap)}` : "no gap underneath"} · ${money(r.per_student)} spent per student` })),
  flags: [
    { when: "Fall 2021", t: `About a third of this year's money is one-time. When it ends, spending runs about ${short(e.rows[1].gap)} a year over what the school takes in. Cut toward the school you have now, or plan a merger while cash is strong.` },
    { when: "Spring 2022", t: `The trend points to about ${e.trend_2023} students next year. The budget plans for ${e.budget_2023}. The fall count came in at ${e.actual_2023}.` },
    { when: "Winter 2022", t: `Cash is at ${days(e.cash_dec_2022)}, with a loan payoff and delayed grant payments already scheduled. The monthly forecast shows the drop to ${days(e.cash_mar_2023)} by March before it happens.` },
    { when: "Every pay period", t: `Headcount and payroll against the plan. Promised cuts that never happen show up within weeks, not in an audit a year later that corrects the books by ${short(e.audit_adjustment)}.` },
  ],
  end: `The finding holds under any reasonable funding growth: the gap stays between ${short(e.gap_low)} and ${short(e.gap_high)} a year. In the DC test, falling enrollment on its own is a weak warning, because many schools shrink and survive. Spending that does not follow students, hidden by one-time money, is what set Eagle apart.`,
};

const n = data.national;
const top = Math.max(...n.size.map(s => s.rate));
export const national = {
  intro: `We then ran the same test on every charter school in the country, ${n.first_year} to ${n.last_year}: ${n.schools.toLocaleString("en-US")} schools and ${n.closures.toLocaleString("en-US")} closures, from federal school records, using only what each year showed. Schools that only changed their federal ID are left out.`,
  sizeHead: `Chance an established charter closes within ${n.horizon_years} years, by size`,
  size: n.size.map(s => ({ label: s.label, rate: pct(s.rate), width: Math.round((s.rate / top) * 100) })),
  contrast: `A small school that lost ${pct(n.drop_threshold)} or more of its students in two years closed ${pct(n.small_shrinking)} of the time. A large school holding steady closed ${pct(n.large_steady)} of the time. New schools show the same pattern, ${pct(n.new_small)} against ${pct(n.new_large)}, so this is not just young schools failing.`,
  rulesHead: "How each warning did, every closure in the country",
  rules: n.rules.map(r => ({ label: r.label, caught: pct(r.caught), open: pct(r.open_flagged), lead: `${r.lead} years` })),
  end: `No single warning is enough. The strongest catches about half the closures and also flags many schools that survive, so Arthur reads them together, every month, and explains the lines behind each one. Federal finance and test records stop at ${n.finance_last_year}, so the relief-money years are checked from each school's tax filings instead.`,
};

const op = data.national_operations;
export const operations = {
  intro: `Small charters spend ${money(op.overhead_gap)} more per student on overhead than large charters in the same state and year. Overhead here is the school's leadership and front office, central administration and running the building, compared across ${op.state_years} state-years of federal finance records.`,
  parts: [
    { label: "School leadership and front office", value: money(op.school_admin_gap) },
    { label: "Running the building", value: money(op.building_gap) },
    { label: "Central administration", value: money(op.admin_gap) },
  ],
  total: `In ${n.finance_last_year}, ${op.schools_2020.toLocaleString("en-US")} small charters spent above their peers' median on overhead. Bringing each one to the median is worth ${short(op.savings_2020)} in that year alone. A gap is where to look, not a promised saving: lease terms, staffing and service quality decide what is real.`,
  providersLead: `A few providers serve most schools. Of ${op.filers.toLocaleString("en-US")} charters matched to the federal internet and technology discount program, the five largest vendors serve ${pct(op.top5_vendor_share)}. Arthur compares what one school pays with what the same vendor charges schools like it.`,
  vendors: op.top_vendors.map(v => ({ name: v.name, schools: `${v.schools.toLocaleString("en-US")} schools` })),
  consultants: op.top_consultants.map(v => ({ name: v.name, schools: `${v.schools.toLocaleString("en-US")} schools` })),
  end: `Cost alone is a weak closure warning. Administration in the top fifth of peers caught ${pct(op.admin_flag_caught)} of closures but also flagged ${pct(op.admin_flag_open)} of schools that stayed open. Cost data is for savings; the closure warnings come from enrollment, academics and the money mix.`,
};

const r0 = n.rules;
export const lessons: { t: string; d: string }[] = [
  { t: "Small schools carry the risk", d: `Established charters under 300 students close at ${pct(n.size[0].rate)} within ${n.horizon_years} years, against ${pct(n.size[2].rate)} for schools of 600 or more. That is the market: schools too small for a finance or operations team.` },
  { t: "Shrinking is the loudest early signal", d: `Losing ${pct(n.drop_threshold)} of students in two years caught ${pct(r0[0].caught)} of closures about ${r0[0].lead} years ahead. Adding weak test results raised that to ${pct(r0[1].caught)}, about ${r0[1].lead} years ahead.` },
  { t: "Money signals come first", d: `Spending that does not follow students, and a rising federal share while enrollment falls, are rarer but show up ${r0[3].lead} to ${r0[4].lead} years ahead, earlier than anything else. That is the Eagle pattern, and it is not only in DC.` },
  { t: "One bad year means little", d: `A year of spending more than it took in showed up in ${pct(r0[5].open_flagged)} of schools that stayed open. Arthur does not raise alarms on a single number; it looks for the combination.` },
];

export const offers: { t: string; d: string; who: string }[] = [
  { t: "Risk read from public records", who: "Before a first meeting", d: "Any US charter scored from its federal records and tax filings: enrollment trend, test standing, spending per student and the money mix, against every school like it. A school sees its own picture on day one, before sharing a single file." },
  { t: "Monthly early warning", who: "School leaders and boards", d: "Cash, enrollment against budget, the authorizer's financial rating and the academic score projected forward each month, with the lines driving any change and what to do about it." },
  { t: "Cost and operations review", who: "Business managers", d: "The building, lunch, substitutes, transportation, outside services and payroll taxes, each against plan and against similar schools, with every saving sized in dollars." },
  { t: "Contract and provider comparison", who: "Business managers", d: "Internet, technology, food, back-office and building contracts compared with what the same providers charge similar schools, with the questions to ask before renewal." },
  { t: "Unclaimed money check", who: "Before every filing window", d: "The federal internet and technology discount, the free-meals option for high-need schools and grant deadlines, checked against the school's own records so nothing it qualifies for is left behind." },
  { t: "Board and authorizer packet", who: "Boards and authorizers", d: "The monthly board packet drafted with every number traced to its source, and renewal projected from year one so the charter decision is never a surprise." },
  { t: "Portfolio watch", who: "Networks, authorizers and funders", d: "Every school in a portfolio ranked by the same tested warnings, so attention goes to the few that need it, years before a closure vote." },
];

export const pattern = [
  { text: `We tested Arthur's warnings on every DC charter's public reports, ${b.lea_years} school-years, using only what each year's report showed. A yearly academic score under 40 flagged ${b.academic_caught} of the ${b.closed} closed schools a median of ${b.academic_lead} years before closing, and only ${b.academic_open_flagged} of the ${b.open} that stayed open.`, source: "DC charter authorizer financial and academic reports, back-tested" },
  { text: `Adding cash under ${days(c.minimum_days)} caught all ${b.either_caught} closed schools, a median of ${b.either_lead} years early, but also flagged ${b.either_open_flagged} of ${b.open} that stayed open. A warning is a reason to look, not a verdict.`, source: "DC charter authorizer financial and academic reports, back-tested" },
  { text: `Of ${p.closed_leas} closed DC charter organizations, ${p.finance_enrollment_cases} named finance or enrollment and ${p.academic_cases} named academics as the primary reason.`, source: "DC charter authorizer, history of openings and closures" },
  { text: `DC charters spent ${short(p.facilities_gap_million * 1000000)} more on occupancy than the facilities allotment across the studied years, about ${money(p.facilities_gap_per_student)} per student on average.`, source: "Bellwether, Resource Realities" },
  { text: `Booker T. Washington had ${days(p.booker_cash_days)} of cash and repeated deficits before non-renewal.`, source: "DC charter authorizer renewal report" },
  { text: `Democracy Prep Congress Heights had ${days(p.democracy_cash_days)} of cash, deficits and weak academic results before relinquishment.`, source: "DC charter authorizer review" },
  { text: `Eagle Academy lost enrollment and reached ${days(p.eagle_cash_days)} of cash before relinquishing.`, source: "DC charter authorizer records" },
  { text: `Potomac Prep had as little as ${days(p.potomac_cash_days)} of cash in reviewed years, though revocation was for academic goals.`, source: "DC charter authorizer review" },
  { text: `Excel Academy had ${days(p.excel_cash_days)} of cash in its last reviewed fiscal year and closed for academics.`, source: "DC charter authorizer review" },
];

export const projection = {
  intro: `Each year Arthur shows the average score needed across the remaining years to reach the ${pct(a.target)} renewal target. It flags when that needed score exceeds the school's best published year. The first flag was ${a.first_flag_year}.`,
  rows: a.rows.map(r => ({ year: r.year, score: r.score === null ? "Not published" : pct(r.score), needed: r.needed_average === null ? "Renewal decision" : pct(r.needed_average) })),
  end: `The published scores averaged ${pct(c.score_average)} against the ${pct(a.target)} target. This is an early warning based on scores available then, not a claim that improvement was impossible.`,
};

export const model: { t: string; d: string }[] = [
  { t: "Early warning, every month", d: "Cash, the authorizer's financial rating, enrollment against budget and the academic score, each projected forward, with the few lines driving any change. Leaders hear about a problem in the month it starts." },
  { t: "Cost review, area by area", d: "Lunch, the building, maintenance, utilities, substitutes, transportation, technology and outside fees, each compared with plan and with similar schools, and every saving sized in dollars." },
  { t: "Board and authorizer ready", d: "The monthly board packet drafted with every number traced to its source and checked against the words. Renewal projected from year one, so the charter is never a surprise." },
];

export const fixes: { t: string; d: string; tag: "done" | "free" | "needs" | "money" }[] = [
  { t: "Training case read end to end", d: "Budget models, a board deck, cash forecast, staff feedback, planning notes and an operations contract, tied to their sources.", tag: "done" },
  { t: "Cash early warning", d: "Runs on the school's files and flags the June forecast under the minimum.", tag: "done" },
  { t: "Financial rating rebuild", d: "Scores a school on the authorizer's financial rubric and names the measures costing points.", tag: "done" },
  { t: "Enrollment sensitivity", d: `Shows revenue per student and how many students could be lost before planned cash runs short. ${data.students_to_breach.value} in this budget.`, tag: "done" },
  { t: "Academic renewal projection", d: "Each year shows the average the school needs over the remaining years to reach the renewal target, and flags the year it needs more than its best year. On the training school it flags the first year.", tag: "done" },
  { t: "Operations checks", d: "Building running costs against the facilities money, the lunch program against meal revenue, substitutes, outside services, and payroll taxes against their legal ceiling.", tag: "done" },
  { t: "Board packet and claim checks", d: "Every figure in a board summary or on this page is recomputed from the budget, and any sentence that disagrees with its own tables is flagged.", tag: "done" },
  { t: "Attendance, test results and monthly bank balances", d: "From Lanette if she has them. Attendance and test results show the academic slide inside a year, and bank balances score the cash forecast against what happened.", tag: "needs" },
  { t: "Every US charter as training data", d: `Every charter in the federal records since ${n.first_year}, closed and open, scored on the same warnings with no hindsight. DC adds the authorizer's own financial and academic reports.`, tag: "done" },
  { t: "Relief-money years for every school", d: `Federal finance stops at ${n.finance_last_year}. Tax filings for each school cover the years after, so the Eagle pattern can be tested nationally.`, tag: "free" },
];

export const method = [
  "The budget cash path and building costs come from the plan-year export. The spring cash figure is a forecast; actual cash and closure reason come from authorizer records.",
  "Savings ranges are estimates from the savings model. Peer benchmarks and the unemployment tax rate year still need confirmation.",
  "The academic projection uses published score years. The missing year stays missing.",
];
