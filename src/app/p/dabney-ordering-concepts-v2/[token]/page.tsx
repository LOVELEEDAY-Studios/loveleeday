import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewControl, ReviewSubmit } from "@/components/portal/ReviewControl";
import {
  directions,
  designNotes,
  getConceptsClient,
  conceptsClients,
  referenceBoard,
  dribbbleBoard,
  recommendation,
} from "@/content/hub/dabney-ordering-concepts-v2";

export const dynamicParams = false;

export function generateStaticParams() {
  return conceptsClients.map((c) => ({ token: c.token }));
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const c = getConceptsClient(token);
  return { title: c ? `${c.short}: ordering, round 2 — five new directions` : "A proposal" };
}

/* INTERNAL design exploration, ROUND 2, on the hub template (local only, not deployed, nothing
   sent, no money spent). Companion to /p/dabney-ordering-concepts (round 1) and /p/dabney-ordering
   (the platforms review) — see designNotes for sourcing. Round-1 files are untouched by this page. */

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
const EP = "/api/dabney-ordering-concepts-v2-review";
const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);

export default async function OrderingConceptsV2Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const c = getConceptsClient(token);
  if (!c) notFound();

  return (
    <div className="ll-os bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-[1180px] px-6 pb-16 pt-16 sm:pt-24">
        <Eyebrow>
          {c.short} · prepared for {c.preparedFor}, {c.role} · round 2, design exploration, not deployed
        </Eyebrow>
        <Two size="h1" a="Five new directions." b="Benchmarked against the brands doing this well." />
        <p className="mt-8 max-w-[46rem] text-[17px] leading-[1.7] text-[#6c7481]">
          Round 1 re-skinned Dabney&apos;s own site look across five concepts. Daniel&apos;s note back: it may not be the
          best direction. This round starts over on the visual side — five genuinely different palettes, typefaces and
          layouts, each named to the real screens it was built from (Sweetgreen, Uber Eats, DoorDash, Instacart, Blue
          Apron, Goldbelly-style gifting, Julienne, Squarespace, and more), pulled live via Mobbin, not recalled. Real
          menu items, real prices, real photography throughout — anything invented is labeled Proposed. Nothing here is
          live, wired to checkout, or spending money.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-[14px]">
          <a href="#references" className="rounded-full bg-[#1d1d1f] px-5 py-2.5 font-medium text-white">
            See the reference board
          </a>
          <a href="#directions" className="rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[#1d1d1f] hover:border-[#3778bc]">
            See all five directions
          </a>
          <a href="/p/dabney-ordering-concepts/dabney-ordering-concepts-internal" className="rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[#1d1d1f] hover:border-[#3778bc]">
            Round 1 (re-skin concepts)
          </a>
          <a href="/p/dabney-ordering/dabney-ordering-internal" className="rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[#1d1d1f] hover:border-[#3778bc]">
            The ordering-platforms review
          </a>
        </div>
      </section>

      {/* Reference board */}
      <section id="references" className="border-y border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-16">
          <Eyebrow>Reference board — real screens, pulled live</Eyebrow>
          <Two a="What we stole, and why it fits." b="Every shot links to its real source." />
          <p className="mt-6 max-w-[60ch] text-[14.5px] leading-[1.7] text-[#6c7481]">
            {referenceBoard.length} product screens pulled live via the Mobbin MCP (Sweetgreen, Uber Eats, DoorDash,
            Instacart, HelloFresh, Blue Apron, Churnkey, Expedia, Blue Bottle, CHOPT, Taco Bell, Zomato, Julienne,
            Squarespace, Selfridges), plus {dribbbleBoard.length} premium Dribbble shots found via live search — Dribbble
            itself blocks scraping without a login (see designNotes below), so those are cited by verified URL and
            designer rather than an embedded image.
          </p>

          <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
            {referenceBoard.map((r) => (
              <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-2xl border border-[#e4e5e9] bg-white">
                {r.thumb && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.thumb} alt={`${r.app} — ${r.pattern}`} className="h-[150px] w-full object-cover object-top" loading="lazy" />
                )}
                <div className="p-4">
                  <div className="text-[12.5px] font-semibold text-[#1d1d1f]">{r.app}</div>
                  <div className="mt-1 text-[12px] leading-[1.5] text-[#6c7481]">{r.pattern}</div>
                  <div className="mt-2 text-[11.5px] italic leading-[1.5] text-[#3778bc] group-hover:underline">{r.why}</div>
                </div>
              </a>
            ))}
          </div>

          <Eyebrow>Dribbble — premium shots, cited by link</Eyebrow>
          <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
            {dribbbleBoard.map((d) => (
              <a key={d.url} href={d.url} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-[#e4e5e9] bg-white p-4 hover:border-[#3778bc]">
                <div className="text-[13px] font-semibold text-[#1d1d1f]">{d.title}</div>
                <div className="text-[11.5px] text-[#8c8e95]">by {d.designer}</div>
                <div className="mt-2 text-[12px] leading-[1.55] text-[#6c7481]">{d.pattern}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* At-a-glance strip */}
      <section className="mx-auto max-w-[1180px] px-6 py-14">
        <Eyebrow>At a glance</Eyebrow>
        <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-x-8 gap-y-8">
          {directions.map((d) => (
            <a key={d.id} href={`#direction-${d.n}`} className="block">
              <div className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#3778bc]">Direction {d.n}</div>
              <div className="mt-1 text-[17px] font-medium text-[#1d1d1f]">{d.name}</div>
              <div className="mt-1 text-[13px] leading-[1.55] text-[#6c7481]">{d.tagline}</div>
              <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8c8e95]">{d.covers}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Directions */}
      <section id="directions" className="mx-auto max-w-[1180px] px-6 py-8">
        {directions.map((d, i) => (
          <article key={d.id} id={`direction-${d.n}`} className={`grid gap-10 py-20 lg:grid-cols-[1.05fr_1fr] ${i > 0 ? "border-t border-[#e4e5e9]" : ""}`}>
            <div>
              <Eyebrow>
                Direction {d.n} of 5 · {d.id} · covers: {d.covers}
              </Eyebrow>
              <Two a={d.name} b={d.tagline} />

              <div className="mt-6 grid gap-3 rounded-2xl border border-[#e4e5e9] bg-[#fafafa] p-4">
                <div><span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#3778bc]">Problem</span><p className="mt-1 text-[14px] leading-[1.65] text-[#3f434b]">{d.problem}</p></div>
                <div><span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#3778bc]">Insight</span><p className="mt-1 text-[14px] leading-[1.65] text-[#3f434b]">{d.insight}</p></div>
                <div><span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#3778bc]">Bet</span><p className="mt-1 text-[14px] leading-[1.65] text-[#3f434b]">{d.bet}</p></div>
              </div>

              <p className="mt-6 text-[15px] font-medium text-[#1d1d1f]">Who it&apos;s for</p>
              <p className="mt-1 text-[15px] leading-[1.7] text-[#5b606a]">{d.forWhom}</p>

              <p className="mt-6 text-[15px] font-medium text-[#1d1d1f]">Which finding this fixes</p>
              <p className="mt-1 text-[14px] leading-[1.7] text-[#5b606a]">{d.fixes}</p>

              <p className="mt-6 text-[15px] font-medium text-[#1d1d1f]">Palette, type, layout</p>
              <div className="mt-2 grid gap-2 text-[13.5px] leading-[1.6] text-[#5b606a]">
                <p><b className="text-[#1d1d1f]">Palette</b> — {d.palette}</p>
                <p><b className="text-[#1d1d1f]">Type</b> — {d.type}</p>
                <p><b className="text-[#1d1d1f]">Layout</b> — {d.layout}</p>
              </div>

              <p className="mt-6 text-[15px] font-medium text-[#1d1d1f]">Built from</p>
              <p className="mt-1 text-[13.5px] leading-[1.6] text-[#5b606a]">{d.refs.join(" · ")}</p>

              <p className="mt-6 text-[15px] font-medium text-[#1d1d1f]">How it would be built</p>
              <div className="mt-2 grid gap-3">
                {d.build.map((b) => (
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

              <p className="mt-6 text-[15px] font-medium text-[#1d1d1f]">Build path</p>
              <p className="mt-1 text-[14px] leading-[1.7] text-[#5b606a]">{d.buildPath}</p>

              <a href={d.mockup} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-full border border-[#dcdfe6] px-5 py-2.5 text-[14px] text-[#1d1d1f] hover:border-[#3778bc]">
                Open the interactive mockup ↗
              </a>

              <ReviewControl id={"direction-" + slug(d.name)} label={d.name} endpoint={EP} submitOnEnter />
            </div>

            <div className="grid gap-4">
              <figure className="overflow-hidden rounded-2xl border border-[#e4e5e9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.shots.desktop} alt={`${d.name} — desktop mockup`} className="w-full" loading="lazy" />
                <figcaption className="border-t border-[#e4e5e9] bg-[#fafafa] px-4 py-2 text-[12px] text-[#8c8e95]">Desktop, 1440px</figcaption>
              </figure>
              <figure className="mx-auto w-full max-w-[280px] overflow-hidden rounded-[24px] border border-[#e4e5e9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.shots.phone} alt={`${d.name} — phone mockup`} className="w-full" loading="lazy" />
                <figcaption className="border-t border-[#e4e5e9] bg-[#fafafa] px-4 py-2 text-center text-[12px] text-[#8c8e95]">Phone, 390px</figcaption>
              </figure>
            </div>
          </article>
        ))}
      </section>

      {/* Recommendation */}
      <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-16">
          <Eyebrow>What we&apos;d pick, and why</Eyebrow>
          <Two a={recommendation.headline} b="" />
          <div className="mt-6 grid max-w-[70ch] gap-4">
            {recommendation.body.map((p) => (
              <p key={p} className="text-[14.5px] leading-[1.75] text-[#3f434b]">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Submit */}
      <section className="border-t border-[#e4e5e9]">
        <div className="mx-auto max-w-[1180px] px-6 py-16">
          <Eyebrow>Next</Eyebrow>
          <Two a="Approve the ones worth building," b="or leave a note on any of them." />
          <p className="mt-6 max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
            None of this is live, wired, or spending money — approving a direction here starts the real build, it
            doesn&apos;t ship it.
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
