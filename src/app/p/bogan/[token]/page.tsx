// {/* built-from-reference: /p/wightman */}
import { boganClients, getBogan } from "@/content/hub/bogan";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BeforeAfter } from "@/components/portal/BeforeAfter";
import { Depth } from "../Depth";
import {
  concepts, findings, hero, layers, meta, method, needs, numbers, placement, proof, questions, radar, recommended, shifts, siteAudit, sources, steps, strengths, themes, ORDER, trust,
} from "@/content/hub/bogan";

export const metadata: Metadata = {
  title: "Bogan Developments: what we found, and what comes next",
  description: "A private review prepared for Jamauri Bogan: the firm's public record, its placement, a new website and where an intelligence layer fits.",
  robots: { index: false, follow: false },
};

/* Private proposal for Bogan Developments. Local only, not deployed, no token. Same register as /p/wightman:
   white and #f5f5f7 stages, one dark trust stage, two-tone headlines. Nothing at Bogan is connected, so every
   capability below is proposed, not running. */

function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return <span className={`block text-[13px] font-medium ${dark ? "text-[#9ea3ad]" : "text-[#5b606a]"}`}>{children}</span>;
}
function Two({ a, b, dark, size = "h2" }: { a: string; b: string; dark?: boolean; size?: "h1" | "h2" }) {
  const cls = size === "h1" ? "text-[clamp(2.6rem,6.4vw,4.6rem)] leading-[1.02] tracking-[-0.05em]" : "text-[clamp(2rem,4.2vw,3rem)] leading-[1.08] tracking-[-0.045em]";
  const Tag = size;
  return <Tag className={`mt-4 font-medium ${cls} ${dark ? "text-white" : "text-[#1d1d1f]"}`}>{b ? `${a} ${b}` : a}</Tag>;
}
function Head({ id, eyebrow, a, b, note }: { id?: string; eyebrow: string; a: string; b: string; note: React.ReactNode }) {
  return (
    <div id={id} className="grid gap-6 lg:grid-cols-2 lg:items-end">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Two a={a} b={b} />
      </div>
      <div className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">{note}</div>
    </div>
  );
}
const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" className="underline decoration-[#cfe0f2] underline-offset-2">{children}</a>
);

export const dynamicParams = false;

export function generateStaticParams() {
  return boganClients.map((m) => ({ token: m.token }));
}

export default async function BoganPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!getBogan(token)) notFound();
  return (
    <div className="ll-os bg-white">
      <section className="mx-auto max-w-[1180px] px-6 pb-16 pt-16 sm:pt-24">
        <Eyebrow>{meta.short} · prepared for {meta.preparedFor}, {meta.role}</Eyebrow>
        <Two size="h1" a={hero.a} b={hero.b} />
        <p className="mt-8 max-w-[44rem] text-[17px] leading-[1.7] text-[#6c7481]">{hero.lead}</p>
      </section>

      <section className="border-y border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-8 px-6 py-14">
          {numbers.map((n) => (
            <div key={n.k}>
              <div className="text-[clamp(1.9rem,3.6vw,2.6rem)] font-medium tracking-[-0.04em] text-[#1d1d1f]">{n.k}</div>
              <div className="mt-1 text-[14px] leading-[1.55] text-[#4a4d55]">{n.label}</div>
              <div className="mt-1 text-[13px] text-[#5b606a]">{n.src}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-24">
        <Head eyebrow="What you have built" a="The record is stronger" b="than the front door says." note="Everything here comes from your own pages and the public record. Nothing needed anything private." />
        <div className="mt-14 grid gap-x-10 gap-y-2 md:grid-cols-2">
          {strengths.map((s, i) => (
            <div key={s.t} className="border-t border-[#e4e5e9] py-7">
              <span className="text-[13px] tabular-nums text-[#3778bc]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-[18px] font-medium leading-[1.35] tracking-[-0.015em] text-[#1d1d1f]">{s.t}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.7] text-[#3a3f47]">{s.d}</p>
              <p className="mt-2 text-[13px] text-[#5b606a]"><A href={s.src.url}>{s.src.label}</A></p>
            </div>
          ))}
        </div>
      </section>

      {ORDER.map((th, ti) => (
        <section key={th} className={ti % 2 === 0 ? "border-t border-[#e4e5e9] bg-[#f5f5f7]" : "border-t border-[#e4e5e9]"}>
          <div className="mx-auto max-w-[1180px] px-6 py-20">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <Eyebrow>{String(ti + 1).padStart(2, "0")} · What we found</Eyebrow>
                <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.2rem)] font-medium leading-[1.12] tracking-[-0.035em] text-[#1d1d1f]">{themes[th].name}</h2>
                <p className="mt-4 max-w-[24rem] text-[15px] leading-[1.7] text-[#6c7481]">{themes[th].line}</p>
              </div>
              <div>
                {findings.filter((f) => f.theme === th).map((f) => (
                  <div key={f.title} className="border-t border-[#dcdfe6] py-6 first:border-t-0 first:pt-0">
                    <h3 className="text-[17px] font-medium leading-[1.4] tracking-[-0.015em] text-[#1d1d1f]">{f.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-[1.7] text-[#3a3f47]">{f.detail}</p>
                    <p className="mt-2 text-[12.5px] leading-[1.6] text-[#5b606a]">
                      {f.src.url ? <A href={f.src.url}>{f.src.label}</A> : f.src.label}
                      <span className="text-[#5b606a]"> · Arthur: {f.catches}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      <section id="placement" className="border-t border-[#e4e5e9]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Head eyebrow="Placement" a="Found by name." b="Missing when someone is looking." note={placement.note} />
          <div className="mt-12 overflow-x-auto rounded-2xl border border-[#e4e5e9]">
            <table className="w-full min-w-[720px] text-[14px]">
              <thead>
                <tr className="border-b border-[#e4e5e9] text-left text-[13px] text-[#5b606a]">
                  {["What someone searches", "Your position", "Who holds the first result"].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {placement.rows.map((r) => (
                  <tr key={r.q} className="border-b border-[#eef0f3] last:border-0">
                    <td className="px-5 py-3 text-[#1d1d1f]">{r.q}</td>
                    <td className={`px-5 py-3 ${r.onPage ? "text-[#1d1d1f]" : "text-[#a3522c]"}`}>{r.pos}</td>
                    <td className="px-5 py-3 text-[#5b606a]">{r.top}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] leading-[1.6] text-[#5b606a]">{placement.scope}</p>
          <h3 className="mt-16 text-[20px] font-medium tracking-[-0.02em] text-[#1d1d1f]">What is on the pages today</h3>
          <div className="mt-6 grid gap-x-10 md:grid-cols-2">
            {siteAudit.map((s) => (
              <div key={s.t} className="border-t border-[#e4e5e9] py-5">
                <h4 className="text-[15.5px] font-medium leading-[1.4] text-[#1d1d1f]">{s.t}</h4>
                <p className="mt-1.5 text-[14px] leading-[1.65] text-[#5b606a]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="concepts" className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Head eyebrow="Your site, rebuilt" a="The Standard." b="Built, not sketched." note="A working set of pages using your real photographs, your real logo and only facts on the public record. Renderings are labelled. Open it and click through." />
          <div className="mt-14">
            <BeforeAfter before="/proposals/bogan/compare-before.jpg" after={recommended.after} label="The current Bogan Developments homepage compared with The Standard" beforeCaption="Today" afterCaption={recommended.name} />
          </div>
          <p className="mt-10 max-w-[52rem] text-[15px] leading-[1.7] text-[#1d1d1f]">{recommended.why}</p>
          <div className="mt-20 grid gap-20">
            {concepts.map((c) => (
              <article key={c.slug}>
                <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div>
                    <h3 className="mt-1 text-[clamp(1.6rem,3vw,2.2rem)] font-medium tracking-[-0.035em] text-[#1d1d1f]">{c.name}</h3>
                    <p className="mt-2 text-[17px] font-medium text-[#1d1d1f]">{c.line}</p>
                    <p className="mt-2 max-w-[44rem] text-[15px] leading-[1.7] text-[#5b606a]">{c.idea}</p>
                  </div>
                  <a href={`/proposals/bogan/${c.slug}/index.html`} target="_blank" className="text-[14px] font-medium text-[#3778bc] underline underline-offset-4">Open the working pages</a>
                </div>
                <div className="mt-7 grid gap-5 lg:grid-cols-[3.4fr_1fr]">
                  <div className="overflow-hidden rounded-2xl border border-[#e4e5e9] bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/proposals/bogan/${c.slug}-home.jpg`} alt={`${c.name} homepage, first screens`} className="block w-full" />
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-[#e4e5e9] bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/proposals/bogan/${c.slug}-phone.jpg`} alt={`${c.name} on a phone`} className="block w-full" />
                  </div>
                </div>
              </article>
            ))}
            <div>
              <h3 className="text-[clamp(1.4rem,2.4vw,1.8rem)] font-medium tracking-[-0.03em] text-[#1d1d1f]">How each page looks when it is shared.</h3>
              <p className="mt-2 max-w-[44rem] text-[15px] leading-[1.7] text-[#5b606a]">Every page carries its own preview image, so a link sent by text, email or LinkedIn shows the page it leads to.</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {[["index", "Home"], ["homes", "Find a home"], ["project", "Zone 32 Phase II"], ["partners", "Work with us"]].map(([f, t]) => (
                  <figure key={f}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/proposals/bogan/c2/assets/og-${f}.jpg`} alt={`Share image for the ${t} page`} className="block w-full rounded-xl border border-[#e4e5e9]" />
                    <figcaption className="mt-2 text-[13px] text-[#5b606a]">{t}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="radar" className="border-t border-[#e4e5e9]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Head eyebrow="What Arthur found this week" a="This is the work," b="not a description of it." note={radar.note} />
          <div className="mt-12 grid gap-x-10 md:grid-cols-2">
            {radar.items.map((r) => (
              <div key={r.t} className="border-t border-[#e4e5e9] py-6">
                <span className="text-[13px] text-[#3778bc]">{r.when}</span>
                <h3 className="mt-1 text-[16.5px] font-medium leading-[1.4] tracking-[-0.015em] text-[#1d1d1f]">{r.t}</h3>
                <p className="mt-1.5 text-[14px] leading-[1.65] text-[#3a3f47]">{r.why}</p>
                <p className="mt-1.5 text-[13px] text-[#5b606a]"><A href={r.src.url}>{r.src.label}</A></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Eyebrow>What changes for your team</Eyebrow>
          <Two a="Fewer things in two heads." b="More closings." />
          <div className="mt-14 grid gap-px overflow-hidden rounded-[16px] border border-[#e4e5e9] bg-[#e4e5e9] md:grid-cols-2">
            {shifts.map(([what, before, after]) => (
              <div key={what} className="bg-white p-7">
                <span className="text-[13px] font-medium text-[#6a6e77]">{what}</span>
                <p className="mt-4 text-[14px] leading-[1.6] text-[#6a6e77] line-through decoration-[#d5d8de]">{before}</p>
                <p className="mt-1 text-[16px] leading-[1.55] text-[#1d1d1f]">{after}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="layer" className="mx-auto max-w-[1180px] px-6 py-24">
        <Eyebrow>Arthur for Bogan Developments</Eyebrow>
        <Two a="An intelligence layer" b="for a firm building past its first city." />
        <div className="mt-14 grid gap-x-10 md:grid-cols-2">
          {layers.map((l, i) => (
            <div key={l.name} className="border-t border-[#e4e5e9] py-7">
              <span className="text-[13px] tabular-nums text-[#3778bc]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-[18px] font-medium tracking-[-0.015em] text-[#1d1d1f]">{l.name}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.7] text-[#3a3f47]">{l.does}</p>
              <p className="mt-2 text-[13px] leading-[1.6] text-[#5b606a]">Without it: {l.would}</p>
            </div>
          ))}
        </div>
        <h3 className="mt-16 text-[20px] font-medium tracking-[-0.02em] text-[#1d1d1f]">Questions you could ask it</h3>
        <div className="mt-5 grid gap-x-10 md:grid-cols-2">
          {questions.map((q) => (
            <div key={q.q} className="border-t border-[#e4e5e9] py-4">
              <p className="text-[15.5px] leading-[1.5] text-[#1d1d1f]">{q.q}</p>
              <p className="mt-1 text-[12.5px] text-[#5b606a]">{q.joins}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="brand" className="border-t border-[#e4e5e9]">
        <div className="mx-auto grid max-w-[1180px] gap-6 px-6 py-20 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="text-[13px] font-medium text-[#6c7481]">Brand book</p>
            <h2 className="mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium leading-[1.08] tracking-[-0.035em] text-[#1d1d1f]">Bogan Developments 2.0.</h2>
          </div>
          <div>
            <p className="max-w-[34rem] text-[15.5px] leading-[1.7] text-[#5b606a]">The position, mark, color, type and voice behind the recommended site, written so any designer or printer can hold the line. Your current logo stays as it is. Anything new is marked Proposed.</p>
            <a href="/proposals/bogan/brand/book.html" target="_blank" className="mt-4 inline-block text-[14px] font-medium text-[#3778bc] underline underline-offset-2">Open the brand book</a>
          </div>
        </div>
      </section>

      <Depth />

      <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Eyebrow>Proof already running</Eyebrow>
          <Two a="We do this" b="on our own business first." />
          <p className="mt-6 max-w-[42rem] text-[15px] leading-[1.7] text-[#6c7481]">{meta.proofLine}</p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {proof.map((p) => (
              <div key={p.k} className="border-t border-[#dcdfe6] pt-5">
                <h3 className="text-[16px] font-medium text-[#1d1d1f]">{p.k}</h3>
                <p className="mt-2 text-[14px] leading-[1.65] text-[#5b606a]">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111217] text-white">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow dark>Security and privacy</Eyebrow>
              <Two dark a="Your deal files are the firm." b="They stay under your rules." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#a3a8b2]">Investors, lenders and agencies will ask how their documents are handled. This is the answer.</p>
          </div>
          <div className="mt-14 grid gap-x-10 md:grid-cols-2">
            {trust.map(([t, d], i) => (
              <div key={t} className="border-t border-[#2a2c33] py-8">
                <span className="text-[13px] tabular-nums text-[#6f7480]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[18px] font-medium leading-[1.35] tracking-[-0.015em]">{t}</h3>
                <p className="mt-3 text-[14px] leading-[1.75] text-[#a3a8b2]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="begin" className="mx-auto max-w-[1180px] px-6 py-24">
        <Eyebrow>How we would begin</Eyebrow>
        <Two a="One site, one project," b="thirty days." />
        <ol className="mt-12 grid max-w-[46rem] gap-6">
          {steps.map(([t, d], i) => (
            <li key={t} className="grid grid-cols-[2rem_1fr] gap-3">
              <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
              <span>
                <span className="block text-[16px] text-[#1d1d1f]">{t}</span>
                <span className="mt-1 block text-[14px] leading-[1.65] text-[#7d8088]">{d}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section id="needs" className="border-t border-[#e4e5e9]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Eyebrow>What we would need from you</Eyebrow>
          <Two a="Eight things only you" b="can give us." />
          <div className="mt-12 grid gap-x-10 md:grid-cols-2">
            {needs.map((n) => (
              <div key={n.t} className="border-t border-[#e4e5e9] py-6">
                <h3 className="text-[17px] font-medium leading-[1.4] tracking-[-0.015em] text-[#1d1d1f]">{n.t}</h3>
                <p className="mt-2 text-[14.5px] leading-[1.7] text-[#3a3f47]">{n.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-12">
          <details>
            <summary className="cursor-pointer text-[13px] font-medium text-[#5b606a] hover:text-[#3778bc]">Sources and method</summary>
            <p className="mt-5 max-w-[72ch] text-[13px] leading-[1.6] text-[#6c7481]">{method}</p>
            <ul className="mt-4 grid max-w-[72ch] gap-2 text-[13px] leading-[1.6] text-[#6c7481]">
              {sources.map((s) => <li key={s.url}>{s.label} · <a className="underline" href={s.url}>source</a></li>)}
            </ul>
          </details>
        </div>
      </section>
    </div>
  );
}
