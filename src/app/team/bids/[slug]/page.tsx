import { notFound } from "next/navigation";
import { requireTeam } from "@/lib/team-auth";
import { teamData, when } from "@/lib/team-data";
import { TeamNav } from "@/components/team/TeamNav";
import { Card, DOT, Eyebrow, StageChip } from "@/components/team/ui";

export const dynamic = "force-dynamic";

export default async function BidPage({ params }: { params: Promise<{ slug: string }> }) {
  const email = await requireTeam();
  const { slug } = await params;
  const { stats } = await teamData();
  const s = stats.find((x) => x.bid.slug === slug);
  if (!s) notFound();
  const { bid } = s;

  return (
    <>
      <TeamNav email={email} />
      <main className="mx-auto max-w-[1240px] px-6 pb-24 pt-10 max-[640px]:px-4">
        <a href="/team/bids" className="text-[13px] text-[#3778bc]">← All bids</a>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>{bid.kind}</Eyebrow>
            <h1 className="mt-3 text-[clamp(2rem,4vw,2.8rem)] font-medium leading-[1.08] tracking-[-0.045em]">
              {bid.client}
              <br />
              <span className="text-[#8c8e95]">{bid.contact}, {bid.role}</span>
            </h1>
          </div>
          <StageChip stage={s.stage} />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Sent", s.sent.length ? when(s.firstSent) : "Not yet"],
            ["Opened by a person", String(s.humanOpens)],
            ["Page visits", `${s.visits}${s.visitors ? ` · ${s.visitors} device${s.visitors > 1 ? "s" : ""}` : ""}`],
            ["Questions to Arthur", String(s.asks.length)],
          ].map(([k, v]) => (
            <Card key={k} className="p-5">
              <div className="text-[12px] text-[#8c8e95]">{k}</div>
              <div className="mt-2 text-[22px] font-medium tracking-[-0.03em]">{v}</div>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card>
            <div className="border-b border-[#eef0f3] px-6 py-4">
              <h2 className="text-[16px] font-medium">Timeline</h2>
            </div>
            {(() => {
              const real = s.events.filter((e) => e.human);
              const noise = s.events.filter((e) => !e.human);
              const row = (e: (typeof s.events)[number], i: number) => (
                <li key={i} className={`grid grid-cols-[10px_1fr_auto] gap-3 py-3 ${e.human ? "" : "opacity-60"}`}>
                  <span className="mt-[7px] h-2 w-2 rounded-full" style={{ background: e.human ? DOT[e.kind] : "#c3c6cc" }} />
                  <span className="min-w-0">
                    <span className="block text-[14px]">{e.text}</span>
                    {e.detail && <span className="block text-[12.5px] leading-[1.5] text-[#8c8e95]">{e.detail}</span>}
                  </span>
                  <span className="whitespace-nowrap text-[12px] text-[#8c8e95]">{when(e.at)}</span>
                </li>
              );
              return (
                <div className="px-6 py-3">
                  {real.length === 0 ? (
                    <p className="py-3 text-[14px] text-[#8c8e95]">
                      {s.isSent ? "No client activity yet." : "Not sent yet, or not sent from a tracked mailbox."}
                    </p>
                  ) : (
                    <ol>{real.map(row)}</ol>
                  )}
                  {noise.length > 0 && (
                    <details className="border-t border-[#f1f2f4] py-3">
                      <summary className="cursor-pointer text-[13px] text-[#3778bc]">
                        {noise.length} scanner, pre-send and team event{noise.length === 1 ? "" : "s"}, not counted
                      </summary>
                      <ol className="mt-1">{noise.map(row)}</ol>
                    </details>
                  )}
                </div>
              );
            })()}
          </Card>

          <div className="grid content-start gap-6">
            <Card>
              <div className="border-b border-[#eef0f3] px-6 py-4">
                <h2 className="text-[16px] font-medium">Client pages</h2>
                <p className="mt-1 text-[12.5px] text-[#8c8e95]">Opened from here, your visit is marked as ours.</p>
              </div>
              <ul className="px-6 py-2">
                {bid.pages.map((p) => (
                  <li key={p.path} className="flex items-center justify-between gap-3 border-b border-[#f1f2f4] py-3 last:border-0">
                    <span className="text-[14px]">{p.label}</span>
                    <a href={p.path} target="_blank" rel="noreferrer" className="rounded-full border border-[#dcdfe6] px-3 py-1.5 text-[12.5px] hover:border-[#1d1d1f]">
                      Open ↗
                    </a>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <div className="border-b border-[#eef0f3] px-6 py-4">
                <h2 className="text-[16px] font-medium">Emails sent</h2>
              </div>
              {s.sent.length === 0 ? (
                <p className="px-6 py-5 text-[13px] text-[#8c8e95]">{bid.emails.length ? `Nothing tracked to ${bid.emails.join(" or ")}.` : "No contact address on file."}</p>
              ) : (
                <ul className="px-6 py-2">
                  {s.sent.map((m) => (
                    <li key={m.token} className="border-b border-[#f1f2f4] py-3 last:border-0">
                      <span className="block text-[14px]">{m.subject}</span>
                      <span className="block text-[12.5px] text-[#8c8e95]">{when(m.sent_at)} · {m.from} → {m.to}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
