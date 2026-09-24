import { requireTeam } from "@/lib/team-auth";
import { ago, teamData, when } from "@/lib/team-data";
import { TeamNav } from "@/components/team/TeamNav";
import { Card, Eyebrow, StageChip } from "@/components/team/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Bids" };

export default async function Bids() {
  const email = await requireTeam();
  const { stats, totals } = await teamData();
  const rows = [...stats].sort((a, b) => (b.firstSent ?? "").localeCompare(a.firstSent ?? ""));

  return (
    <>
      <TeamNav email={email} />
      <main className="mx-auto max-w-[1240px] px-6 pb-24 pt-10 max-[640px]:px-4">
        <Eyebrow>Bids</Eyebrow>
        <h1 className="mt-3 text-[clamp(2rem,4vw,2.8rem)] font-medium leading-[1.08] tracking-[-0.045em]">
          Every proposal we have built.
          <br />
          <span className="text-[#8c8e95]">{totals.sent} sent, {totals.drafts} waiting.</span>
        </h1>

        <Card className="mt-10 overflow-hidden">
          <table className="w-full text-left text-[14px] max-[760px]:hidden">
            <thead className="border-b border-[#eef0f3] text-[12px] text-[#8c8e95]">
              <tr>
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-3 py-3 font-medium">Stage</th>
                <th className="px-3 py-3 font-medium">Sent</th>
                <th className="px-3 py-3 text-right font-medium">Opens</th>
                <th className="px-3 py-3 text-right font-medium">Visits</th>
                <th className="px-3 py-3 text-right font-medium">Questions</th>
                <th className="px-6 py-3 font-medium">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.bid.slug} className="border-b border-[#f1f2f4] last:border-0 hover:bg-[#fafafb]">
                  <td className="px-6 py-4">
                    <a href={`/team/bids/${s.bid.slug}`} className="font-medium hover:text-[#3778bc]">{s.bid.client}</a>
                    <span className="block text-[12.5px] text-[#8c8e95]">{s.bid.contact} · {s.bid.kind}</span>
                  </td>
                  <td className="px-3 py-4"><StageChip stage={s.stage} /></td>
                  <td className="px-3 py-4 text-[#5b606a]">{s.firstSent ? when(s.firstSent) : "—"}</td>
                  <td className="px-3 py-4 text-right tabular-nums">{s.isSent ? s.humanOpens : "—"}</td>
                  <td className="px-3 py-4 text-right tabular-nums">{s.isSent ? s.visits : "—"}</td>
                  <td className="px-3 py-4 text-right tabular-nums">{s.asks.length || "—"}</td>
                  <td className="px-6 py-4 text-[12.5px] text-[#5b606a]">{s.last ? `${s.last.text}, ${ago(s.last.at)}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phone: one card per bid instead of a table that would scroll sideways. */}
          <ul className="min-[761px]:hidden">
            {rows.map((s) => (
              <li key={s.bid.slug} className="border-b border-[#f1f2f4] last:border-0">
                <a href={`/team/bids/${s.bid.slug}`} className="block px-5 py-4">
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-[15px] font-medium">{s.bid.client}</span>
                    <StageChip stage={s.stage} />
                  </span>
                  <span className="mt-1 block text-[12.5px] text-[#8c8e95]">{s.bid.contact} · {s.firstSent ? `sent ${when(s.firstSent)}` : "not sent"}</span>
                  {s.isSent && (
                    <span className="mt-2 block text-[12.5px] text-[#5b606a]">{s.humanOpens} open{s.humanOpens === 1 ? "" : "s"} · {s.visits} visit{s.visits === 1 ? "" : "s"} · {s.asks.length} question{s.asks.length === 1 ? "" : "s"}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </main>
    </>
  );
}
