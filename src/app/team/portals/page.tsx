import { requireTeam } from "@/lib/team-auth";
import { portals } from "@/content/portals";
import { publishedPortfolios } from "@/content/portfolio";
import { complianceSchools } from "@/content/compliance";
import { civicClients } from "@/content/civic/kalamazoo";
import { studio } from "@/content/studio/elemental";
import { hubClients } from "@/content/hub/startupzoo";
import { STUDY_DIRS } from "@/content/study-dirs";
import { TeamNav } from "@/components/team/TeamNav";
import { Card, Eyebrow } from "@/components/team/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Client portals" };

type Row = { client: string; what: string; href: string };

const STUDY_NAMES: Record<string, string> = {
  micruity: "Micruity", janta: "Janta Power", fyxit: "Fyxit AI", novarna: "Novarna", soarce: "Soarce", loanwell: "LoanWell",
  enable: "Enable Injections", venturehue: "VentureHue", meknology: "Meknology", blacktechweek: "Black Tech Week",
  lightshipcapital: "Lightship Capital", lightshipfoundation: "Lightship Foundation", elemental: "Elemental Media", startupzoo: "Startup Zoo",
};

export default async function Portals() {
  const email = await requireTeam();

  const groups: { title: string; line: string; rows: Row[] }[] = [
    {
      title: "Proposals",
      line: "The pitch pages each client received.",
      rows: [
        ...civicClients.map((c) => ({ client: c.short, what: "Public-record analysis", href: `/p/civic/${c.token}` })),
        ...complianceSchools.map((c) => ({ client: c.short, what: "Compliance calendar", href: `/p/compliance/${c.token}` })),
        ...(studio.token ? [{ client: studio.short, what: "Spot, rebuild and Arthur", href: `/p/studio/${studio.token}` }] : []),
        ...hubClients.map((c) => ({ client: c.short, what: "Findings, rebuild and Arthur", href: `/p/hub/${c.token}` })),
        ...publishedPortfolios.map((p) => ({ client: p.fund, what: "Portfolio study", href: `/p/portfolio/${p.token}` })),
      ],
    },
    {
      title: "Client portals",
      line: "Delivered work, round by round.",
      rows: portals.filter((p) => p.token).map((p) => ({ client: p.client, what: `${p.project} · ${p.round}`, href: `/p/${p.token}` })),
    },
    {
      title: "Site studies and rebuilds",
      line: "The full rebuilds, each behind its own key.",
      rows: Object.entries(STUDY_DIRS)
        .filter(([, t]) => t)
        .map(([dir, t]) => ({ client: STUDY_NAMES[dir] ?? dir, what: `/portal/${dir}`, href: `/portal/${dir}/${dir === "elemental" ? "concepts/c1-periodic.html" : "index.html"}?k=${t}` })),
    },
  ];

  return (
    <>
      <TeamNav email={email} />
      <main className="mx-auto max-w-[1240px] px-6 pb-24 pt-10 max-[640px]:px-4">
        <Eyebrow>Client portals</Eyebrow>
        <h1 className="mt-3 text-[clamp(2rem,4vw,2.8rem)] font-medium leading-[1.08] tracking-[-0.045em]">
          Every client link in one place.
          <br />
          <span className="text-[#8c8e95]">Opened from here, it counts as us, not them.</span>
        </h1>

        {groups.map((g) => (
          <section key={g.title} className="mt-12">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[18px] font-medium">
                {g.title} <span className="text-[#8c8e95]">· {g.rows.length}</span>
              </h2>
              <span className="text-[13px] text-[#8c8e95]">{g.line}</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.rows.map((r) => (
                <Card key={r.href} className="flex min-w-0 items-center justify-between gap-3 p-5">
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-medium">{r.client}</span>
                    <span className="block truncate text-[12.5px] text-[#8c8e95]">{r.what}</span>
                  </span>
                  <a href={r.href} target="_blank" rel="noreferrer" className="shrink-0 rounded-full border border-[#dcdfe6] px-3 py-1.5 text-[12.5px] hover:border-[#1d1d1f]">
                    Open ↗
                  </a>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
