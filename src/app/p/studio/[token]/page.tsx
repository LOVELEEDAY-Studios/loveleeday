import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStudio, layers, measured, questions, studio } from "@/content/studio/elemental";
import { NoteForm } from "@/components/portal/NoteForm";
import { CommercialPlayer } from "@/components/studio/CommercialPlayer";
import { BeforeAfter } from "@/components/portal/BeforeAfter";
import { CivicAsk } from "@/components/civic/CivicAsk";

export const dynamicParams = false;

export function generateStaticParams() {
  return studio.token ? [{ token: studio.token }] : [];
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  return { title: getStudio(token) ? "Elemental Media: a spot, a rebuild, and what comes next" : "A proposal" };
}

/* For a production company the work leads. One dark, cinematic stage for the film, then the
   homepage register (white, #f5f5f7) for the reading, then dark again for trust. */

function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`block text-[10px] font-semibold uppercase tracking-[0.16em] ${dark ? "text-[#9ea3ad]" : "text-[#777980]"}`}>
      {children}
    </span>
  );
}

function Two({ a, b, dark, size = "h2" }: { a: string; b: string; dark?: boolean; size?: "h1" | "h2" }) {
  const cls =
    size === "h1"
      ? "text-[clamp(2.6rem,6.4vw,4.8rem)] leading-[1.02] tracking-[-0.05em]"
      : "text-[clamp(2rem,4.2vw,3rem)] leading-[1.08] tracking-[-0.045em]";
  const Tag = size;
  return (
    <Tag className={`mt-4 font-medium ${cls} ${dark ? "text-white" : "text-[#1d1d1f]"}`}>
      {a}
      <br />
      <span className={dark ? "text-[#8e8d99]" : "text-[#8c8e95]"}>{b}</span>
    </Tag>
  );
}

const security = [
  { t: "Your footage stays yours", d: "Arthur reads it where it already lives, in your drives, NAS or Frame.io. Nothing is copied to a shared pool, and you can have everything we hold exported or deleted." },
  { t: "No training on your work", d: "Client footage and your cuts are never used to train a model, ours or anyone's. We choose AI providers under contracts that say the same." },
  { t: "Client confidentiality, by project", d: "Access is set per client and per job, so an unreleased spot is visible only to the people on it. Every view and export is logged." },
  { t: "You approve what leaves", d: "Arthur drafts bids, schedules and deliverables. Nothing goes to a client or a platform until a person on your team approves it." },
];

export default async function StudioPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const s = getStudio(token);
  if (!s) notFound();
  const k = s.studyToken ?? "";
  const rebuild = `/portal/elemental/concepts/c1-periodic.html?k=${k}`;
  // The reel and the voice samples appear the moment their files exist in public/.
  const pub = (p: string) => fs.existsSync(path.join(process.cwd(), "public", p));
  const hasReel = pub("portal/elemental/video/elemental-reel-2026.mp4");
  const voices: { file: string; title: string; voice: string; script: string }[] = pub("portal/elemental/voice/samples.json")
    ? JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/portal/elemental/voice/samples.json"), "utf8"))
    : [];

  return (
    <div className="ll-os bg-white">
      {/* The spot */}
      <section className="bg-[#0d0e12] text-white">
        <div className="mx-auto max-w-[1280px] px-6 pb-16 pt-16 sm:pt-20">
          <Eyebrow dark>For Elemental Media · a spec spot, a rebuild, and what comes next</Eyebrow>
          <Two dark size="h1" a="We cut you a spot." b="From your own footage." />
          <div className="mt-10">
            <CommercialPlayer />
          </div>
          <div className="mt-5 flex flex-wrap justify-between gap-x-8 gap-y-2 text-[13px] text-[#8e93a0]">
            <span>:30 · 2.39:1 throughout · picture from six Elemental films · script, VO, music, grade and mix by Arthur</span>
            <span>Spec work, made for this proposal. Not for broadcast.</span>
          </div>
          <div className="mt-12 grid items-center gap-8 md:grid-cols-[1fr_1.4fr]">
            <div>
              <Eyebrow dark>The :15</Eyebrow>
              <p className="mt-3 max-w-[30rem] text-[15px] leading-[1.7] text-[#a3a8b2]">
                The same spot, cut down for pre-roll and paid social. Same frame, same voice, same finish.
              </p>
            </div>
            <CommercialPlayer
              src="/portal/elemental/video/elemental-15.mp4"
              poster="/portal/elemental/video/elemental-15-poster.jpg"
              label="Elemental Media spec commercial, fifteen seconds"
            />
          </div>
        </div>
      </section>

      {/* The rebuild */}
      <section className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <Eyebrow>Elemental 2.0</Eyebrow>
            <Two a="And a new front door." b="Built on the name." />
            <p className="mt-6 max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
              Elemental: the essential element. Your logo leads, and every film becomes an element on a periodic table of the
              work.
            </p>
            <ul className="mt-6 grid gap-3 text-[14px] leading-[1.6] text-[#4a4d55]">
              {[
                "Every film an element tile (Bl, Lf, Ka, Bu, St, Fc) that plays when you hover over it.",
                "One 2.39 frame for every film, from the hero loop to the tiles.",
                "One shoot, every channel: the brand film plus the 9:16, 4:5, 1:1 and stills your clients need.",
                "A small team, a big world: a live globe of routes from Kalamazoo.",
                "A 2 MB hero loop instead of a 49 MB reel fetched twice, and a real mobile menu.",
              ].map((x) => (
                <li key={x} className="grid grid-cols-[1rem_1fr] gap-2">
                  <span className="text-[#3778bc]">✧</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={rebuild} className="inline-block rounded-full bg-[#1d1d1f] px-5 py-2.5 text-[14px] font-medium text-white">
                Open Elemental 2.0
              </a>
            </div>
          </div>
          <a href={rebuild} className="block overflow-hidden rounded-2xl border border-[#e4e5e9] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/portal/elemental/img/concept1-top.jpg" alt="The Elemental 2.0 homepage" className="block w-full" />
          </a>
        </div>

        <div className="mt-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>Before and after</Eyebrow>
              <Two a="Today, and 2.0." b="Drag to compare." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
              The first screen of weareelementalmedia.com as it loads today, and the same screen as Elemental 2.0, both at 1440 by
              900.
            </p>
          </div>
          <div className="mt-10 overflow-hidden rounded-2xl border border-[#e4e5e9]">
            <BeforeAfter
              before="/portal/elemental/img/before-top.jpg"
              after="/portal/elemental/img/concept1-top.jpg"
              label="Elemental Media homepage today and as Elemental 2.0"
              beforeCaption="Today"
              afterCaption="Elemental 2.0"
            />
          </div>
        </div>
      </section>

      {/* One shoot, every channel */}
      <section className="border-t border-[#e4e5e9]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>For your clients</Eyebrow>
              <Two a="One shoot." b="Every channel." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
              What your clients buy is one production. What they need is the brand film and every social cut from the same
              footage. Here is one of your own shoots, Factory Coffee, cut for each.
            </p>
          </div>
          <div className="mt-12 grid items-end gap-4 [grid-template-columns:repeat(2,minmax(0,1fr))] md:[grid-template-columns:2.2fr_.72fr_.9fr_1fr_1fr]">
            {[
              { f: "master-239", t: "Brand film", d: "2.39 · web and broadcast", r: "2.39 / 1", wide: true },
              { f: "reel-916", t: "Reel", d: "9:16 · Reels, TikTok, Shorts", r: "9 / 16" },
              { f: "feed-45", t: "Feed", d: "4:5 · Instagram, LinkedIn", r: "4 / 5" },
              { f: "square-11", t: "Bumper", d: "1:1 · six-second paid", r: "1 / 1" },
            ].map((x) => (
              <figure key={x.f} className={`m-0 ${x.wide ? "col-span-2 md:col-span-1" : ""}`}>
                <video className="block w-full rounded-lg bg-black object-cover" style={{ aspectRatio: x.r }} src={`/portal/elemental/social/${x.f}.mp4`} poster={`/portal/elemental/social/${x.f}.jpg`} autoPlay muted loop playsInline preload="none" aria-label={`Factory Coffee footage, ${x.t} cut`} />
                <figcaption className="mt-2 text-[13px] leading-[1.4]"><b className="block font-medium text-[#1d1d1f]">{x.t}</b><span className="text-[#7d8088]">{x.d}</span></figcaption>
              </figure>
            ))}
            <figure className="m-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="block w-full rounded-lg object-cover" style={{ aspectRatio: "1 / 1" }} src="/portal/elemental/social/still-11.jpg" alt="A still of a latte pour" />
              <figcaption className="mt-2 text-[13px] leading-[1.4]"><b className="block font-medium text-[#1d1d1f]">Stills</b><span className="text-[#7d8088]">Grid posts, press, web</span></figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* The new reel: shown once the file exists */}
      {hasReel && (
        <section className="bg-[#0d0e12] text-white">
          <div className="mx-auto max-w-[1280px] px-6 py-24">
            <Eyebrow dark>A new reel</Eyebrow>
            <Two dark a="Your reel, recut." b="From shots it never used." />
            <p className="mt-6 max-w-[40rem] text-[15px] leading-[1.7] text-[#a3a8b2]">
              Every shot in this reel is one your 2024 reel and our spot left on the table, drawn from all six of your films.
            </p>
            <div className="mt-10">
              <CommercialPlayer src="/portal/elemental/video/elemental-reel-2026.mp4" poster="/portal/elemental/video/elemental-reel-2026.jpg" label="Elemental Media reel, recut" />
            </div>
          </div>
        </section>
      )}

      {/* Voice samples: shown once they exist */}
      {voices.length > 0 && (
        <section className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>Voices and scripts</Eyebrow>
              <Two a="Written, cast and voiced." b="In an afternoon." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
              Short spots scripted and voiced by Arthur, each in a different voice. The ones in a client&apos;s name are samples, not
              anything a client said or approved.
            </p>
          </div>
          <ol className="mt-12 grid gap-5 md:grid-cols-2">
            {voices.map((x, i) => (
              <li key={x.file} className="rounded-2xl border border-[#e4e5e9] p-6">
                <span className="text-[12px] tabular-nums text-[#3778bc]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-[17px] font-medium text-[#1d1d1f]">{x.title}</h3>
                <p className="mt-1 text-[13px] text-[#7d8088]">{x.voice}</p>
                <audio className="mt-4 w-full" controls preload="none" src={`/portal/elemental/voice/${x.file}`} />
                <p className="mt-4 text-[14px] leading-[1.7] text-[#4a4d55]">&ldquo;{x.script}&rdquo;</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* What we measured */}
      <section className="border-y border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>What we measured</Eyebrow>
              <Two a="Great work." b="A site that hides it." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
              Five things we measured on weareelementalmedia.com. None of them is about craft. All of them decide how many
              people ever see it.
            </p>
          </div>
          <ol className="mt-12 grid gap-x-10 md:grid-cols-2">
            {measured.map((m) => (
              <li key={m.t} className="border-t border-[#dfe1e6] py-8">
                <span className="text-[clamp(1.8rem,3.4vw,2.4rem)] font-medium tracking-[-0.04em] text-[#1d1d1f]">{m.k}</span>
                <h3 className="mt-3 text-[17px] font-medium leading-[1.4] tracking-[-0.015em] text-[#1d1d1f]">{m.t}</h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-[#5b606a]">{m.d}</p>
                <p className="mt-3 text-[12px] text-[#8c8e95]">Measured: {m.how}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Arthur behind the camera */}
      <section className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow>Arthur, behind the camera</Eyebrow>
            <Two a="An intelligence layer" b="for a production company." />
          </div>
          <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#6c7481]">
            The spot and the site are what Arthur makes. The bigger value is what it keeps track of: the footage, the money,
            the rights and the clients that sit behind every job.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {layers.map((l, i) => (
            <div key={l.name} className="rounded-2xl border border-[#e4e5e9] p-6">
              <span className="text-[12px] tabular-nums text-[#3778bc]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-[18px] font-medium tracking-[-0.015em] text-[#1d1d1f]">{l.name}</h3>
              <p className="mt-2 text-[14px] leading-[1.65] text-[#5b606a]">{l.does}</p>
              <p className="mt-4 border-t border-[#eef0f3] pt-3 text-[13px] leading-[1.6] text-[#1d1d1f]">{l.so}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Questions nobody has time to ask</Eyebrow>
            <p className="mt-4 max-w-[26rem] text-[15px] leading-[1.7] text-[#6c7481]">
              Connected to your jobs, invoices and footage, Arthur answers these with the numbers behind them.
            </p>
          </div>
          <ol className="grid gap-0">
            {questions.map((q, i) => (
              <li key={q} className="grid grid-cols-[2rem_1fr] gap-3 border-t border-[#e4e5e9] py-4 text-[16px] leading-[1.5] text-[#1d1d1f]">
                <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                <span>{q}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Ask Arthur</Eyebrow>
            <p className="mt-4 max-w-[26rem] text-[15px] leading-[1.7] text-[#6c7481]">
              Ask it anything about this proposal. Today it knows what is on this page; connected, it knows your footage, jobs
              and clients.
            </p>
          </div>
          <CivicAsk
            token={token}
            endpoint="/api/studio/ask"
            source="Elemental Media proposal"
            presets={[
              "What would Arthur do for us in the first 30 days?",
              "How does one shoot become every channel?",
              "Where is our site losing people?",
              "How would Arthur help us bid jobs?",
              "Who owns our footage if we use Arthur?",
            ]}
            placeholder="Ask anything about the proposal"
            inputLabel="Ask Arthur a question about the Elemental Media proposal"
            reading="Arthur is working on"
          />
        </div>
      </section>

      {/* Security */}
      <section className="bg-[#111217] text-white">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Eyebrow dark>Footage, rights and trust</Eyebrow>
          <Two dark a="Your clients' work." b="Handled like it is." />
          <div className="mt-14 grid gap-x-10 md:grid-cols-2">
            {security.map((x, i) => (
              <div key={x.t} className="border-t border-[#2a2c33] py-8">
                <span className="text-[11px] tabular-nums text-[#6f7480]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-[18px] font-medium leading-[1.35] tracking-[-0.015em]">{x.t}</h3>
                <p className="mt-3 text-[14px] leading-[1.75] text-[#a3a8b2]">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Begin */}
      <section id="next" className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow>How we would begin</Eyebrow>
            <Two a="Start with the site." b="Then the footage." />
            <ol className="mt-10 grid gap-6">
              {[
                ["An hour in your studio", "Walk the rebuild and the spot together. Tell us what you would cut."],
                ["Launch the site", "Your content, your domain, the case studies you want to lead with, measured before and after."],
                ["Index the archive", "Arthur reads your footage where it lives and makes every shot searchable."],
                ["Connect the business", "Jobs, invoices, releases and the rental calendar, one at a time, when you are ready."],
              ].map(([t, d], i) => (
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
            token={s.token!}
            client={s.short}
            deliverables={[{ slug: "proposal", title: "Spot, rebuild and Arthur" }]}
            intent="start"
            heading="Reply to us"
            blurb="Tell us what you would change in the cut, or when to come by."
          />
        </div>
      </section>
    </div>
  );
}
