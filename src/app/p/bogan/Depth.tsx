import { alsoRans, feeds, lifecycle, notVerified, qapMethod, qapScorecard, sampleAnswers, software, softwareTop5, terms } from "@/content/hub/bogan-depth";

const STATUS: Record<string, string> = {
  documented: "On the record",
  "checkable now": "Checkable now",
  "needs a letter": "Needs a letter",
  "needs your records": "Needs your records",
};

function Title({ eyebrow, a, b, note }: { eyebrow: string; a: string; b: string; note: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
      <div>
        <p className="text-[13px] font-medium text-[#6c7481]">{eyebrow}</p>
        <h2 className="mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium leading-[1.08] tracking-[-0.035em] text-[#1d1d1f]">{a}<br />{b}</h2>
      </div>
      <p className="max-w-[34rem] text-[15.5px] leading-[1.7] text-[#5b606a]">{note}</p>
    </div>
  );
}

export function Depth() {
  const bySlug = Object.fromEntries(software.map((s) => [s.slug, s]));
  const rest = software.filter((s) => !softwareTop5.some((t) => t.slug === s.slug));
  return (
    <>
      <section id="lifecycle" className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Title eyebrow="How the intelligence fits a deal" a="From the first parcel" b="to the last compliance year." note="The same record follows a project through every stage, so nothing is rebuilt for the next funder. We do not know how your team keeps these today, so each stage starts with that question." />
          <div className="mt-12 border-b border-[#dfe1e6]">
            {lifecycle.map((s) => (
              <details key={s.n} className="group border-t border-[#dfe1e6]">
                <summary className="flex cursor-pointer list-none items-baseline gap-5 py-5 [&::-webkit-details-marker]:hidden">
                  <span className="w-7 shrink-0 text-[13px] tabular-nums text-[#3778bc]">{String(s.n).padStart(2, "0")}</span>
                  <span className="flex-1 text-[19px] font-medium tracking-[-0.02em] text-[#1d1d1f]">{s.name}</span>
                  <span className="hidden text-[13.5px] text-[#6c7481] sm:block">{s.when}</span>
                  <span aria-hidden className="text-[20px] leading-none text-[#6c7481] transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="grid gap-8 pb-8 pl-12 lg:grid-cols-2">
                  <div>
                    <p className="text-[15px] leading-[1.7] text-[#3a3f47]">{s.involves}</p>
                    <p className="mt-4 text-[13px] font-medium text-[#1d1d1f]">Where does it live today?</p>
                    <p className="mt-1 text-[14.5px] leading-[1.65] text-[#5b606a]">{s.livesToday}</p>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#1d1d1f]">What it would answer</p>
                    <p className="mt-1 text-[15px] leading-[1.65] text-[#1d1d1f]">{s.answers}</p>
                    <p className="mt-4 text-[13px] font-medium text-[#1d1d1f]">Ask it</p>
                    <p className="mt-1 text-[14.5px] leading-[1.65] text-[#3a3f47]">{s.sample}</p>
                    <p className="mt-4 text-[13px] leading-[1.6] text-[#6c7481]">Joined with: {s.joins.join(", ")}.</p>
                    {s.proof.map((p) => (
                      <p key={p.text} className="mt-2 text-[13px] leading-[1.6] text-[#6c7481]">{p.text} <a className="underline underline-offset-2" href={p.src.url}>{p.src.label}</a></p>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="answers" className="border-t border-[#e4e5e9]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Title eyebrow="Worked from public numbers" a="The kind of answer" b="you would get back." note="Each of these was worked from sources read for this review. Open the working on any of them. Where your own records would change the answer, it says so." />
          <div className="mt-12 grid gap-x-12 lg:grid-cols-2">
            {sampleAnswers.map((a) => (
              <article key={a.q} className="border-t border-[#e4e5e9] py-7">
                <h3 className="text-[19px] font-medium leading-[1.3] tracking-[-0.02em] text-[#1d1d1f]">{a.q}</h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-[#3a3f47]">{a.answer}</p>
                <details className="mt-3">
                  <summary className="cursor-pointer text-[13.5px] font-medium text-[#3778bc]">See the working</summary>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#5b606a]">{a.working}</p>
                  <p className="mt-2 text-[13px] leading-[1.6] text-[#6c7481]">{a.src.map((s, i) => <span key={s.url}>{i > 0 ? " · " : ""}<a className="underline underline-offset-2" href={s.url}>{s.label}</a></span>)}</p>
                </details>
                <p className="mt-3 text-[13.5px] leading-[1.6] text-[#6c7481]">{a.caution}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="score" className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Title eyebrow="Before you apply" a="Score the next deal" b="against the published sheet." note={qapMethod.summary} />
          <div className="mt-12 overflow-hidden rounded-2xl border border-[#e4e5e9] bg-white">
            {qapScorecard.map((l) => (
              <div key={l.line} className="grid gap-x-8 gap-y-2 border-t border-[#eceef1] px-6 py-5 first:border-t-0 lg:grid-cols-[1.1fr_0.4fr_1.5fr_0.6fr]">
                <div>
                  <p className="text-[13px] text-[#6c7481]">{l.section}</p>
                  <h3 className="mt-1 text-[16px] font-medium leading-[1.35] text-[#1d1d1f]">{l.line}</h3>
                </div>
                <p className="text-[14px] tabular-nums text-[#1d1d1f]">{l.points}</p>
                <div>
                  <p className="text-[14px] leading-[1.6] text-[#3a3f47]">{l.boganAngle}</p>
                  <p className="mt-1 text-[13px] leading-[1.55] text-[#6c7481]">{l.rule}</p>
                </div>
                <p className="text-[13.5px] font-medium text-[#3778bc]">{STATUS[l.status]}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 max-w-[52rem] space-y-1">
            {qapMethod.limits.map((x) => <p key={x} className="text-[13.5px] leading-[1.6] text-[#6c7481]">{x}</p>)}
            <p className="text-[13.5px] text-[#6c7481]"><a className="underline underline-offset-2" href={qapMethod.src.url}>{qapMethod.src.label}</a></p>
          </div>
        </div>
      </section>

      <section id="software" className="border-t border-[#e4e5e9]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Title eyebrow="Software we would build for you" a="Five tools, in the order" b="your projects need them." note="Each one runs on the same record as the intelligence layer, so a number entered once appears everywhere it is owed." />
          <div className="mt-12">
            {softwareTop5.map((t) => {
              const s = bySlug[t.slug];
              return (
                <article key={t.slug} className="grid gap-x-10 gap-y-3 border-t border-[#e4e5e9] py-8 lg:grid-cols-[0.1fr_1fr_1.15fr]">
                  <span className="text-[13px] tabular-nums text-[#3778bc]">{String(t.order).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-[22px] font-medium leading-[1.2] tracking-[-0.025em] text-[#1d1d1f]">{s.name}</h3>
                    <p className="mt-3 text-[14.5px] leading-[1.65] text-[#5b606a]">{s.problem}</p>
                    <p className="mt-3 text-[13px] leading-[1.6] text-[#6c7481]">For {s.users.join(", ").toLowerCase().replace(/^you\b/, "you")}.</p>
                  </div>
                  <div>
                    <p className="text-[15px] leading-[1.7] text-[#3a3f47]">{s.does}</p>
                    <p className="mt-3 text-[13px] font-medium text-[#1d1d1f]">Why this order</p>
                    <p className="mt-1 text-[14px] leading-[1.65] text-[#5b606a]">{t.why}</p>
                    <p className="mt-3 text-[13px] leading-[1.6] text-[#6c7481]">Connects to: {s.connects.join(", ")}.</p>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="border-t border-[#e4e5e9] pt-8">
            <h3 className="text-[18px] font-medium text-[#1d1d1f]">Then</h3>
            <p className="mt-2 max-w-[52rem] text-[15px] leading-[1.7] text-[#3a3f47]">{alsoRans}</p>
            <ul className="mt-4 grid gap-x-10 gap-y-3 md:grid-cols-2">
              {rest.map((s) => <li key={s.slug} className="text-[14px] leading-[1.6] text-[#5b606a]"><span className="text-[#1d1d1f]">{s.name}.</span> {s.does}</li>)}
            </ul>
            <p className="mt-6 text-[14px] text-[#6c7481]">{terms}</p>
          </div>
          <details className="mt-12 rounded-2xl bg-[#f5f5f7] px-6 py-5">
            <summary className="cursor-pointer text-[14px] font-medium text-[#1d1d1f]">Public sources behind this, and what we could not confirm</summary>
            <ul className="mt-4 grid gap-x-10 gap-y-2 md:grid-cols-2">
              {feeds.map((f) => <li key={f.name} className="text-[13px] leading-[1.55] text-[#5b606a]"><span className="text-[#1d1d1f]">{f.name}</span>, {f.publisher}. {f.what} {f.asOf}.</li>)}
            </ul>
            <p className="mt-6 text-[13.5px] font-medium text-[#1d1d1f]">Not confirmed</p>
            <ul className="mt-2 space-y-1">{notVerified.map((n) => <li key={n} className="text-[13px] leading-[1.55] text-[#5b606a]">{n}</li>)}</ul>
          </details>
        </div>
      </section>
    </>
  );
}
