import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewControl, ReviewSubmit } from "@/components/portal/ReviewControl";
import { concepts, designNotes, getConceptsClient, conceptsClients } from "@/content/hub/dabney-ordering-concepts";

export const dynamicParams = false;

export function generateStaticParams() {
  return conceptsClients.map((c) => ({ token: c.token }));
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const c = getConceptsClient(token);
  return { title: c ? `${c.short}: five ordering concepts` : "A proposal" };
}

/* INTERNAL design exploration on the hub template (local only, not deployed, nothing sent, no
   money spent). Companion to /p/dabney-ordering — see designNotes for sourcing. */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777980]">{children}</span>;
}
function Two({ a, b, size = "h2" }: { a: string; b: string; size?: "h1" | "h2" }) {
  const cls =
    size === "h1"
      ? "text-[clamp(2.6rem,6.4vw,4.6rem)] leading-[1.02] tracking-[-0.05em]"
      : "text-[clamp(2rem,4.2vw,3rem)] leading-[1.08] tracking-[-0.045em]";
  const Tag = size;
  return (
    <Tag className={`mt-4 font-medium ${cls} text-[#1d1d1f]`}>
      {a}
      <br />
      <span className="text-[#8c8e95]">{b}</span>
    </Tag>
  );
}
const EP = "/api/dabney-ordering-concepts-review";
const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);

export default async function OrderingConceptsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const c = getConceptsClient(token);
  if (!c) notFound();

  return (
    <div className="ll-os bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-[1180px] px-6 pb-16 pt-16 sm:pt-24">
        <Eyebrow>
          {c.short} · prepared for {c.preparedFor}, {c.role} · design exploration, not deployed
        </Eyebrow>
        <Two size="h1" a="Five ways to take an order." b="Pickup, delivery, big gatherings and the Pantry." />
        <p className="mt-8 max-w-[42rem] text-[17px] leading-[1.7] text-[#6c7481]">
          A companion to the ordering-platforms review: five genuinely different interaction models for Dabney&apos;s own
          site, each built from real menu items, real prices and real photography read from the site&apos;s own repo — not
          five skins on the same page. Nothing here is live. Approve, decline or leave a note per concept below.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-[14px]">
          <a href="#concepts" className="rounded-full bg-[#1d1d1f] px-5 py-2.5 font-medium text-white">
            See all five
          </a>
          <a href="/p/dabney-ordering/dabney-ordering-internal" className="rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[#1d1d1f] hover:border-[#3778bc]">
            Back to the ordering-platforms review
          </a>
        </div>
      </section>

      {/* Strip */}
      <section className="border-y border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-14">
          <Eyebrow>At a glance</Eyebrow>
          <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-x-8 gap-y-8">
            {concepts.map((cn) => (
              <a key={cn.id} href={`#concept-${cn.n}`} className="block">
                <div className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#3778bc]">Concept {cn.n}</div>
                <div className="mt-1 text-[17px] font-medium text-[#1d1d1f]">{cn.name}</div>
                <div className="mt-1 text-[13px] leading-[1.55] text-[#6c7481]">{cn.tagline}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Concepts */}
      <section id="concepts" className="mx-auto max-w-[1180px] px-6 py-8">
        {concepts.map((cn, i) => (
          <article key={cn.id} id={`concept-${cn.n}`} className={`grid gap-10 py-20 lg:grid-cols-[1.1fr_1fr] ${i > 0 ? "border-t border-[#e4e5e9]" : ""}`}>
            <div>
              <Eyebrow>
                Concept {cn.n} of 5 · {cn.id}
              </Eyebrow>
              <Two a={cn.name} b={cn.tagline} />
              <p className="mt-6 text-[15px] font-medium text-[#1d1d1f]">Who it&apos;s for</p>
              <p className="mt-1 text-[15px] leading-[1.7] text-[#5b606a]">{cn.forWhom}</p>

              <p className="mt-6 text-[15px] font-medium text-[#1d1d1f]">The flow</p>
              <ol className="mt-2 grid gap-2">
                {cn.steps.map((s, si) => (
                  <li key={s} className="grid grid-cols-[1.5rem_1fr] gap-2 text-[14px] leading-[1.6] text-[#5b606a]">
                    <span className="tabular-nums text-[#3778bc]">{si + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>

              <p className="mt-6 text-[15px] font-medium text-[#1d1d1f]">What it fixes</p>
              <p className="mt-1 text-[14px] leading-[1.7] text-[#5b606a]">{cn.fixes}</p>

              <p className="mt-6 text-[15px] font-medium text-[#1d1d1f]">Expected effect</p>
              <p className="mt-1 text-[14px] leading-[1.7] text-[#5b606a]">{cn.effect}</p>

              <p className="mt-6 text-[15px] font-medium text-[#1d1d1f]">How it would be built</p>
              <div className="mt-2 grid gap-3">
                {cn.build.map((b) => (
                  <div key={b.label} className="rounded-xl border border-[#e4e5e9] bg-[#fafafa] p-3">
                    <div className="flex items-center gap-2 text-[12.5px] font-medium text-[#1d1d1f]">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${b.exists ? "bg-[#e6f4ea] text-[#1e6b3a]" : "bg-[#fff4e0] text-[#8a5a00]"}`}>
                        {b.exists ? "Exists today" : "New"}
                      </span>
                      {b.label}
                    </div>
                    <p className="mt-1.5 text-[13px] leading-[1.6] text-[#6c7481]">{b.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[15px] font-medium text-[#1d1d1f]">Effort</p>
                  <p className="mt-1 text-[14px] leading-[1.65] text-[#5b606a]">{cn.effort}</p>
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[#1d1d1f]">Risks</p>
                  <ul className="mt-1 grid gap-1 text-[14px] leading-[1.6] text-[#5b606a]">
                    {cn.risks.map((r) => (
                      <li key={r}>&middot; {r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <a href={cn.mockup} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[14px] text-[#1d1d1f] hover:border-[#3778bc]">
                Open the interactive mockup ↗
              </a>

              <ReviewControl id={"concept-" + slug(cn.name)} label={cn.name} endpoint={EP} submitOnEnter />
            </div>

            <div className="grid gap-4">
              <figure className="overflow-hidden rounded-2xl border border-[#e4e5e9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cn.shots.desktop} alt={`${cn.name} — desktop mockup`} className="w-full" loading="lazy" />
                <figcaption className="border-t border-[#e4e5e9] bg-[#fafafa] px-4 py-2 text-[12px] text-[#8c8e95]">Desktop, 1440px</figcaption>
              </figure>
              <figure className="mx-auto w-full max-w-[280px] overflow-hidden rounded-[24px] border border-[#e4e5e9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cn.shots.phone} alt={`${cn.name} — phone mockup`} className="w-full" loading="lazy" />
                <figcaption className="border-t border-[#e4e5e9] bg-[#fafafa] px-4 py-2 text-center text-[12px] text-[#8c8e95]">Phone, 390px</figcaption>
              </figure>
            </div>
          </article>
        ))}
      </section>

      {/* Submit */}
      <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-16">
          <Eyebrow>Next</Eyebrow>
          <Two a="Approve the ones worth building," b="or leave a note on any of them." />
          <p className="mt-6 max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
            None of this is live, wired, or spending money — approving a concept here starts the real build, it doesn&apos;t
            ship it.
          </p>
          <div className="mt-8">
            <ReviewSubmit endpoint={EP} />
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="border-t border-[#e4e5e9]">
        <div className="mx-auto max-w-[1180px] px-6 py-12">
          <details>
            <summary className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777980] hover:text-[#3778bc]">
              Sources, design notes and gaps
            </summary>
            <ul className="mt-5 grid max-w-[76ch] gap-3 text-[13px] leading-[1.65] text-[#6c7481]">
              {designNotes.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </details>
        </div>
      </section>
    </div>
  );
}
