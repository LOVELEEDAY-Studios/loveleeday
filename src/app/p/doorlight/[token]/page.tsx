// {/* built-from-reference: /p/civic */}
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { begin, groups, hero, layers, member, meta, method, neighbor, numbers, pilot, pricing, proof, proofNote, questions, slot, trust, tryIt, doorlightClients, getDoorlight } from "@/content/hub/doorlight-ywca";
import { NoteForm } from "@/components/portal/NoteForm";

export const metadata: Metadata = {
  title: "Doorlight for YWCA Kalamazoo: a private review",
  description: "Doorlight: a live board of which local nonprofits are accepting which donations right now, updated by one text. A private review prepared for YWCA Kalamazoo.",
};

/* Private review for YWCA Kalamazoo. Local only, not deployed, no token, same register as /p/civic:
   system type, white and #f5f5f7 stages, one dark stage for trust, two-tone headlines. Screens are
   served from the live mockup at doorlight.loveleedaystudios.com; nothing is copied into public/. */

function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`block text-[13px] font-medium ${dark ? "text-[#9ea3ad]" : "text-[#777980]"}`}>
      {children}
    </span>
  );
}

function Two({ a, b, dark, size = "h2" }: { a: string; b: string; dark?: boolean; size?: "h1" | "h2" }) {
  const cls =
    size === "h1"
      ? "text-[clamp(2.6rem,6.4vw,4.6rem)] leading-[1.02] tracking-[-0.05em]"
      : "text-[clamp(2rem,4.2vw,3rem)] leading-[1.08] tracking-[-0.045em]";
  const Tag = size;
  return (
    <Tag className={`mt-4 font-medium ${cls} ${dark ? "text-white" : "text-[#1d1d1f]"}`}>
      {b ? `${a} ${b}` : a}
    </Tag>
  );
}

type ShotT = { f: string; t: string; d: string; alt: string; crop?: { y: number; h: number } };

function Shot({ s, n }: { s: ShotT; n?: number }) {
  return (
    <figure className="min-w-0">
      <div className="overflow-hidden rounded-2xl border border-[#e4e5e9] bg-[#f5f5f7]">
        {s.crop ? (
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: `1440 / ${s.crop.h}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.f} alt={s.alt} className="absolute left-0 block w-full" style={{ top: `-${(s.crop.y / s.crop.h) * 100}%` }} />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.f} alt={s.alt} className="block w-full" />
        )}
      </div>
      <figcaption className="mt-4">
        {n ? <span className="text-[12px] tabular-nums text-[#3778bc]">{String(n).padStart(2, "0")} </span> : null}
        <span className="text-[17px] font-medium tracking-[-0.015em] text-[#1d1d1f]">{s.t}</span>
        <p className="mt-1 max-w-[40rem] text-[14px] leading-[1.65] text-[#5b606a]">{s.d}</p>
      </figcaption>
    </figure>
  );
}

const TAG = {
  quote: { label: "Quoted", cls: "bg-[#eaf2fb] text-[#2d6aa8]" },
  read: { label: "Our reading", cls: "bg-[#eef0f3] text-[#4a4f58]" },
  estimate: { label: "Estimate, unverified", cls: "bg-[#f4efe6] text-[#8a6420]" },
  research: { label: "Research", cls: "bg-[#eaf2fb] text-[#2d6aa8]" },
} as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return doorlightClients.map((m) => ({ token: m.token }));
}

export default async function DoorlightYwcaPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!getDoorlight(token)) notFound();
  return (
    <div className="ll-os bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-[1180px] px-6 pb-20 pt-16 sm:pt-24">
        <Eyebrow>
          {meta.short} · prepared for {meta.preparedFor}, {meta.role}
        </Eyebrow>
        <Two size="h1" a={hero.a} b={hero.b} />
        <p className="mt-8 max-w-[40rem] text-[17px] leading-[1.7] text-[#6c7481]">{hero.lead}</p>
        <div className="mt-10 flex flex-wrap gap-3 text-[14px]">
          <a href={tryIt.url} target="_blank" rel="noreferrer" className="rounded-full bg-[#1d1d1f] px-5 py-2.5 font-medium text-white">
            Try the working mockup
          </a>
          <a href="#problem" className="rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[#1d1d1f] hover:border-[#3778bc]">
            See what the notices show
          </a>
        </div>
      </section>

      {/* Try it yourself */}
      <section id="try" className="border-t border-[#e4e5e9] bg-white">
        <div className="mx-auto max-w-[1180px] px-6 py-20">
          <Eyebrow>{tryIt.eyebrow}</Eyebrow>
          <div className="mt-4 grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
            <Two size="h2" a={tryIt.a} b={tryIt.b} />
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">{tryIt.lead}</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {tryIt.doors.map((d) => (
              <a key={d.href} href={d.href} target="_blank" rel="noreferrer" className="group rounded-2xl border border-[#e4e5e9] bg-[#f5f5f7] p-7 transition hover:border-[#3778bc]">
                <p className="text-[13px] text-[#6c7481]">{d.k}</p>
                <h3 className="mt-2 text-[20px] font-medium tracking-[-0.02em] text-[#1d1d1f]">{d.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-[#6c7481]">{d.body}</p>
                <p className="mt-4 text-[14px] font-medium text-[#3778bc]">Open it →</p>
              </a>
            ))}
          </div>
          <p className="mt-6 text-[13px] leading-[1.7] text-[#6c7481]">
            <a href={tryIt.url} target="_blank" rel="noreferrer" className="font-medium text-[#1d1d1f] underline decoration-[#3778bc] underline-offset-4">{tryIt.urlLabel}</a> · {tryIt.note}
          </p>
        </div>
      </section>

      {/* Numbers */}
      <section className="border-y border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-14">
          <Eyebrow>The problem in four numbers</Eyebrow>
          <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-6">
            {numbers.map((s) => (
              <div key={s.k}>
                <div className="text-[clamp(1.8rem,3.4vw,2.4rem)] font-medium tracking-[-0.04em] text-[#1d1d1f]">{s.k}</div>
                <div className="mt-1 text-[14px] leading-[1.55] text-[#4a4d55]">{s.label}</div>
                <div className="mt-1 text-[12px] text-[#8c8e95]">{s.src}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[44rem] text-[14px] leading-[1.7] text-[#6c7481]">
            Only the first number is an estimate, and it is Carl Brown&apos;s, not ours. The rest are read from a public source
            that is named beneath it.
          </p>
        </div>
      </section>

      {/* Problem, sourced */}
      <section id="problem" className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow>What the record shows</Eyebrow>
            <Two a="Donors cannot tell what is wanted." b="Every source is named." />
          </div>
          <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
            Everything about the YWCA below is quoted exactly from two public sources and labelled as a quote. Where we are
            reading between the lines, or repeating an estimate, it says so.
          </p>
        </div>

        {groups.map((g) => (
          <div key={g.name} className="mt-16">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#e4e5e9] pb-3">
              <h3 className="text-[20px] font-medium tracking-[-0.02em] text-[#1d1d1f]">
                {g.name} <span className="text-[#8c8e95]">· {g.items.length}</span>
              </h3>
              <span className="text-[13px] text-[#8c8e95]">{g.line}</span>
            </div>
            <ol className="grid gap-x-10 md:grid-cols-2">
              {g.items.map((f) => (
                <li key={f.title} className="border-b border-[#eef0f3] py-7">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${TAG[f.tag].cls}`}>{TAG[f.tag].label}</span>
                  <h4 className="mt-3 text-[17px] font-medium leading-[1.4] tracking-[-0.015em] text-[#1d1d1f]">{f.title}</h4>
                  <p className="mt-2 text-[14px] leading-[1.7] text-[#5b606a]">{f.detail}</p>
                  <div className="mt-3 text-[12.5px]">
                    {f.src.url ? (
                      <a className="text-[#3778bc] underline decoration-[#cfe0f2] underline-offset-2" href={f.src.url} target="_blank" rel="noreferrer">
                        {f.src.label}
                      </a>
                    ) : (
                      <span className="text-[#8c8e95]">{f.src.label}</span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}

        <div className="mt-16 rounded-2xl bg-[#f5f5f7] p-8">
          <Eyebrow>{slot.label}</Eyebrow>
          <h3 className="mt-3 text-[20px] font-medium tracking-[-0.02em] text-[#1d1d1f]">{slot.body}</h3>
          <p className="mt-2 max-w-[40rem] text-[14px] leading-[1.7] text-[#6c7481]">{slot.note}</p>
        </div>
      </section>

      {/* The product, neighbor then member */}
      <section id="screens" className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>The neighbor&apos;s view</Eyebrow>
              <Two a="Look first." b="Then drive." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">{neighbor.lead}</p>
          </div>
          <div className="mt-12 grid gap-10">
            {(neighbor.shots as ShotT[]).map((s) => (
              <Shot key={s.f} s={s} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow>The YWCA member view</Eyebrow>
            <Two a="Thirty seconds, no login." b="One text changes the board." />
          </div>
          <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">{member.lead}</p>
        </div>
        <div className="mt-14 grid items-start gap-y-14">
          {(member.shots as ShotT[]).map((s, i) => (
            <Shot key={s.f} s={s} n={i + 1} />
          ))}
        </div>
      </section>

      {/* Proof already running */}
      <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>Already running</Eyebrow>
              <Two a="The system behind it" b="runs a real business today." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">{proofNote}</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {proof.map((p) => (
              <div key={p.k} className="rounded-2xl border border-[#e4e5e9] bg-white p-6">
                <h3 className="text-[17px] font-medium text-[#1d1d1f]">{p.k}</h3>
                <p className="mt-2 text-[14px] leading-[1.65] text-[#5b606a]">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capability cards + questions */}
      <section className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow>What Doorlight does</Eyebrow>
            <Two a="A board that stays true," b="for a whole region." />
          </div>
          <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
            The product is not the map. It is keeping the map true: updates by text, statuses that expire, and a report the
            sponsor can read.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {layers.map((l, i) => (
            <div key={l.name} className="rounded-2xl border border-[#e4e5e9] p-6">
              <span className="text-[12px] tabular-nums text-[#3778bc]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-[18px] font-medium tracking-[-0.015em] text-[#1d1d1f]">{l.name}</h3>
              <p className="mt-2 text-[14px] leading-[1.65] text-[#5b606a]">{l.does}</p>
              <p className="mt-4 border-t border-[#eef0f3] pt-3 text-[13px] leading-[1.6] text-[#7d8088]">
                <span className="text-[#1d1d1f]">Answers:</span> {l.ask}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Questions your staff could ask</Eyebrow>
            <p className="mt-4 max-w-[26rem] text-[15px] leading-[1.7] text-[#6c7481]">
              Once the board has a few weeks of real updates, these answer themselves.
            </p>
          </div>
          <ol className="grid gap-0">
            {questions.map((x, i) => (
              <li key={x.q} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-[#e4e5e9] py-4">
                <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                <span>
                  <span className="block text-[16px] leading-[1.5] text-[#1d1d1f]">{x.q}</span>
                  <span className="mt-1 block text-[13px] text-[#8c8e95]">From: {x.joins}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pilot plan */}
      <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>The pilot</Eyebrow>
              <Two a="One region, one sponsor," b="eight weeks." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">{pilot.lead}</p>
          </div>
          <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {pilot.weeks.map((w) => (
              <li key={w.w} className="rounded-2xl border border-[#e4e5e9] bg-white p-6">
                <span className="text-[12px] font-medium text-[#3778bc]">{w.w}</span>
                <h3 className="mt-2 text-[16px] font-medium leading-[1.35] tracking-[-0.015em] text-[#1d1d1f]">{w.t}</h3>
                <p className="mt-2 text-[13.5px] leading-[1.65] text-[#5b606a]">{w.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Eyebrow>How we would know it worked</Eyebrow>
              <div className="mt-6 rounded-2xl border border-dashed border-[#c9ced8] bg-white p-6">
                <div className="text-[13px] font-medium text-[#777980]">{pricing.label}</div>
                <p className="mt-2 text-[16px] font-medium text-[#1d1d1f]">{pricing.body}</p>
              </div>
            </div>
            <ol className="grid gap-0">
              {pilot.measures.map((m, i) => (
                <li key={m.k} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-[#e4e5e9] py-4">
                  <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                  <span>
                    <span className="block text-[16px] text-[#1d1d1f]">{m.k}</span>
                    <span className="mt-1 block text-[14px] leading-[1.65] text-[#6c7481]">{m.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-[#111217] text-white">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow dark>Safety and trust</Eyebrow>
              <Two dark a="Built around a shelter." b="Safe by design." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#a3a8b2]">
              The YWCA runs a domestic violence shelter, so these rules come first. Here they are in plain terms, before
              anything is shared or switched on.
            </p>
          </div>
          <div className="mt-14 grid gap-x-10 md:grid-cols-2">
            {trust.map((x, i) => (
              <div key={x.t} className="border-t border-[#2a2c33] py-8">
                <span className="text-[11px] tabular-nums text-[#6f7480]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[18px] font-medium leading-[1.35] tracking-[-0.015em]">{x.t}</h3>
                <p className="mt-3 text-[14px] leading-[1.75] text-[#a3a8b2]">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we would begin */}
      <section id="next" className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow>How we would begin</Eyebrow>
            <Two a="Start with a conversation." b="Count, then build." />
            <ol className="mt-10 grid gap-6">
              {begin.map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                  <span>
                    <span className="block text-[16px] text-[#1d1d1f]">{t}</span>
                    <span className="mt-1 block text-[14px] leading-[1.65] text-[#7d8088]">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <NoteForm
            token={meta.token}
            client={meta.preparedFor}
            deliverables={[{ slug: "analysis", title: "Doorlight pilot proposal" }]}
            intent="start"
            heading="Reply to us"
            blurb="Tell us what is wrong on this page, what the YWCA would want listed, or when to talk."
          />
        </div>
      </section>

      {/* Sources */}
      <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-12">
          <details>
            <summary className="cursor-pointer text-[13px] font-medium text-[#777980] hover:text-[#3778bc]">
              Sources and method
            </summary>
            <ul className="mt-5 grid max-w-[72ch] gap-2 text-[13px] leading-[1.6] text-[#6c7481]">
              {method.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </details>
          <p className="mt-6 text-[12px] text-[#8c8e95]">A LOVELEEDAY concept. Prepared for private review; not sent to anyone.</p>
        </div>
      </section>
    </div>
  );
}
