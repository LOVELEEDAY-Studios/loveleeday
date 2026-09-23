import data from "./requirements.json";
import { TOKENS } from "../tokens";

/* Built by scripts/build-compliance-data.py from the two calendars DC actually
   publishes. Nothing here is typed by hand: re-run the script when either
   agency posts a new edition. */
export interface Requirement {
  id: string;
  agency: "DC PCSB" | "OSSE";
  kind: string;
  title: string;
  due: string | null;
  dueLabel: string;
  precision: "day" | "season" | "window" | "none";
  /** OSSE has not published SY26-27; this date is last year's moved forward a year. */
  projected: boolean;
  purpose: string;
  guide: string;
  guideUrl: string;
  whoMustSubmit: string;
  applies: "yes" | "if" | "no";
  appliesWhy: string;
  platform: string;
  contact: string;
  alsoOsse: boolean;
  owner: string;
  source: string;
  /** Other channels OSSE lists for the same requirement on the same date. */
  alsoVia?: string[];
}

export const requirements = data.items as Requirement[];
export const requirementSources = data.sources;

export interface ComplianceSchool {
  token: string;
  name: string;
  short: string;
  preparedFor: string;
  role: string;
  year: string;
}

export const complianceSchools: ComplianceSchool[] = TOKENS.globalCitizens
  ? [
      {
        token: TOKENS.globalCitizens,
        name: "Global Citizens Public Charter School",
        short: "Global Citizens PCS",
        preparedFor: "Lanette Dailey-Reese",
        role: "Director of Operations and Compliance",
        year: "2026–27",
      },
    ]
  : [];

export const getComplianceSchool = (token: string) =>
  complianceSchools.find((s) => s.token === token);

export function complianceStats() {
  const applies = requirements.filter((r) => r.applies === "yes");
  const platforms = new Set(
    requirements.filter((r) => r.applies !== "no").map((r) => r.platform),
  );
  const byMonth = new Map<string, number>();
  for (const r of applies) if (r.due) byMonth.set(r.due.slice(0, 7), (byMonth.get(r.due.slice(0, 7)) ?? 0) + 1);
  const [busiest, busiestCount] = [...byMonth.entries()].sort((a, b) => b[1] - a[1])[0];
  return {
    published: requirements.length,
    applies: applies.length,
    conditional: requirements.filter((r) => r.applies === "if").length,
    platforms: platforms.size,
    busiest,
    busiestCount,
    pcsb: requirements.filter((r) => r.agency === "DC PCSB").length,
    osse: requirements.filter((r) => r.agency === "OSSE").length,
  };
}
