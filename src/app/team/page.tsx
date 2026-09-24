import { requireTeam } from "@/lib/team-auth";
import { ago, STAGES, teamData, when } from "@/lib/team-data";
import { TeamNav } from "@/components/team/TeamNav";
import { Card, DOT, Eyebrow, StageChip } from "@/components/team/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Overview" };

export default async function TeamOverview() {
  const email = await requireTeam();
  const { stats, totals, feed } = await teamData();
  const sent = stats.filter((s) => s.isSent).sort((a, b) => (b.last?.at ?? "").localeCompare(a.last?.at ?? ""));
  const drafts = stats.filter((s) => !s.isSent);
  const funnel = STAGES.slice(1, 5).map((st, i) => ({ ...st, n: [totals.sent, totals.opened, totals.visited, totals.asked][i] }));

  return (
    <>
      <TeamNav email={email} />
      <main className="mx-auto max-w-[1240px] px-6 pb-24 pt-10 max-[640px]:px-4">
        <Eyebrow>Overview · {when(new Date().toISOString())} ET</Eyebrow>
        <h1 className="mt-3 text-[clamp(2rem,4vw,2.8rem)] font-medium leading-[1.08] tracking-[-0.045em]">
          {totals.sent} bids out.
          <br />
          <span className="text-[#8c8e95]">
            {totals.opened} opened by a person, {totals.visited} visited, {totals.drafts} built and waiting.
          </span>
        </h1>

        {/* Funnel */}
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-5">
          <Card className="p-5">
            <div className="text-[12px] text-[#8c8e95]">Proposals built</div>
            <div className="mt-2 text-[34px] font-medium tracking-[-0.04em]">{totals.bids}</div>
          </Card>
          {funnel.map((f) => (
            <Card key={f.key} className="p-5">
              <div className="text-[12px] text-[#8c8e95]">{f.label}</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[34px] font-medium tracking-[-0.04em]">{f.n}</span>
                {totals.sent > 0 && f.key !== "sent" && <span className="text-[13px] text-[#8c8e95]">{Math.round((f.n / totals.sent) * 100)}%</span>}
              </div>
            </Card>
          ))}
        </div>
        <p className="mt-3 text-[12px] leading-[1.6] text-[#8c8e95]">
          Opens and visits within two minutes of a send are mail scanners and are not counted. Visits from our own devices are not counted.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          {/* Pipeline */}
          <Card>
            <div className="flex items-center justify-between border-b border-[#eef0f3] px-6 py-4">
              <h2 className="text-[16px] font-medium">Bids out</h2>
              <a href="/team/bids" className="text-[13px] text-[#3778bc]">All bids →</a>
            </div>
            <ul>
              {sent.map((s) => (
                <li key={s.bid.slug} className="border-b border-[#f1f2f4] last:border-0">
                  <a href={`/team/bids/${s.bid.slug}`} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-6 py-4 hover:bg-[#fafafb] sm:grid-cols-[1.4fr_auto_1fr]">
                    <span>
                      <span className="block text-[15px] font-medium">{s.bid.client}</span>
                      <span className="block text-[12.5px] text-[#8c8e95]">{s.bid.contact} · sent {when(s.firstSent)}</span>
                    </span>
                    <StageChip stage={s.stage} />
                    <span className="col-span-2 text-[12.5px] text-[#5b606a] sm:col-span-1 sm:text-right">
                      {s.humanOpens} open{s.humanOpens === 1 ? "" : "s"} · {s.visits} visit{s.visits === 1 ? "" : "s"} · {s.asks.length} question{s.asks.length === 1 ? "" : "s"}
                      <span className="block text-[#8c8e95]">{s.last ? `${s.last.text}, ${ago(s.last.at)}` : "—"}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Card>

          {/* Activity */}
          <Card>
            <div className="border-b border-[#eef0f3] px-6 py-4">
              <h2 className="text-[16px] font-medium">What clients did</h2>
            </div>
            {feed.length === 0 ? (
              <p className="px-6 py-6 text-[14px] text-[#8c8e95]">No client activity yet.</p>
            ) : (
              <ol className="px-6 py-3">
                {feed.map((e, i) => (
                  <li key={i} className="grid grid-cols-[10px_1fr] gap-3 py-3">
                    <span className="mt-[7px] h-2 w-2 rounded-full" style={{ background: DOT[e.kind] }} />
                    <span>
                      <a href={`/team/bids/${e.bid.slug}`} className="text-[14px] font-medium hover:text-[#3778bc]">{e.bid.client}</a>
                      <span className="block text-[13px] leading-[1.5] text-[#5b606a]">{e.text}</span>
                      <span className="block text-[12px] text-[#8c8e95]">{when(e.at)} · {e.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        {/* Built, waiting */}
        {drafts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-[16px] font-medium">Built, not sent</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {drafts.map((s) => (
                <a key={s.bid.slug} href={`/team/bids/${s.bid.slug}`} className="rounded-2xl border border-dashed border-[#d5d8de] bg-white/60 p-5 hover:border-[#1d1d1f]">
                  <span className="block text-[15px] font-medium">{s.bid.client}</span>
                  <span className="mt-1 block text-[12.5px] text-[#8c8e95]">{s.bid.contact}</span>
                  <span className="mt-3 block text-[12.5px] text-[#5b606a]">{s.bid.kind}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
