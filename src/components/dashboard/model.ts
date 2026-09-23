/* The five-year model behind the planner. Deliberately simple and fully visible:
   a leadership team should be able to check every number by hand. */

export interface PlanInputs {
  startEnrollment: number;
  gradesNow: number;
  gradesAddedPerYear: number[]; // new grades opened in each of the five years
  seatsPerGrade: number;
  fillRate: number; // % of seats filled in each grade
  capacity: number; // building / charter ceiling
  perPupil: number; // all per-pupil public funding, $
  perPupilGrowth: number; // %/yr
  studentsPerTeacher: number;
  staffCostPerTeacher: number; // salary + benefits, $
  otherStaffPerTeacher: number; // non-teaching staff per teacher
  raise: number; // %/yr
  attrition: number; // % of teachers leaving each year
  facilityCost: number; // $/yr
  otherPerPupil: number; // $/student/yr
}

export interface PlanYear {
  year: string;
  grades: number;
  enrollment: number;
  revenue: number;
  staff: number;
  facility: number;
  other: number;
  expenses: number;
  net: number;
  teachers: number;
  hires: number;
}

export function runPlan(p: PlanInputs, startYear = 2026): PlanYear[] {
  const out: PlanYear[] = [];
  let grades = p.gradesNow;
  let prevTeachers = 0;
  for (let i = 0; i < 5; i++) {
    grades += p.gradesAddedPerYear[i] ?? 0;
    const planned = i === 0 && (p.gradesAddedPerYear[0] ?? 0) === 0
      ? p.startEnrollment
      : Math.max(p.startEnrollment, Math.round(grades * p.seatsPerGrade * (p.fillRate / 100)));
    const enrollment = Math.min(p.capacity, planned);
    const g = Math.pow(1 + p.perPupilGrowth / 100, i);
    const revenue = enrollment * p.perPupil * g;
    const teachers = Math.ceil(enrollment / p.studentsPerTeacher);
    const staffUnits = teachers * (1 + p.otherStaffPerTeacher);
    const staff = staffUnits * p.staffCostPerTeacher * Math.pow(1 + p.raise / 100, i);
    const other = enrollment * p.otherPerPupil * Math.pow(1.03, i);
    const expenses = staff + p.facilityCost + other;
    const leavers = i === 0 ? Math.round(teachers * (p.attrition / 100)) : Math.round(prevTeachers * (p.attrition / 100));
    const hires = Math.max(0, teachers - (i === 0 ? teachers : prevTeachers)) + leavers;
    prevTeachers = teachers;
    out.push({
      year: `${String(startYear + i).slice(2)}–${String(startYear + i + 1).slice(2)}`,
      grades,
      enrollment,
      revenue,
      staff,
      facility: p.facilityCost,
      other,
      expenses,
      net: revenue - expenses,
      teachers,
      hires,
    });
  }
  return out;
}
