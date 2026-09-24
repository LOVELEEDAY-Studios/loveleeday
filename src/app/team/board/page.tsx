import { requireTeam } from "@/lib/team-auth";
import { bids } from "@/content/team/bids";
import { TeamNav } from "@/components/team/TeamNav";
import { Eyebrow } from "@/components/team/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Board" };

/* The review board: every team-portal page, live, at desktop and phone width side by side.
   Frames are the real pages (same sign-in), scaled down, so the board is never out of date. */
const PAGES = [
  { href: "/team", title: "Overview", note: "Bids out, the funnel, what clients did." },
  { href: "/team/bids", title: "Bids", note: "Every proposal, its stage and its numbers." },
  { href: `/team/bids/${bids[0].slug}`, title: "One bid", note: "Timeline, client pages, emails sent." },
  { href: "/team/portals", title: "Client portals", note: "Every client link, opened as us." },
  { href: "/team/login", title: "Sign in", note: "A code by email, no password." },
];

function Frame({ href, w, h, scale }: { href: string; w: number; h: number; scale: number }) {
  return (
    <div className="shrink-0 overflow-hidden rounded-xl border border-[#e4e5e9] bg-white shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]" style={{ width: w * scale, height: h * scale }}>
      <iframe src={href} title={`${href} at ${w}px`} loading="lazy" style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "0 0", border: 0 }} />
    </div>
  );
}

export default async function Board() {
  const email = await requireTeam();
  return (
    <>
      <TeamNav email={email} />
      <main className="mx-auto max-w-[1400px] px-6 pb-24 pt-10 max-[640px]:px-4">
        <Eyebrow>Board</Eyebrow>
        <h1 className="mt-3 text-[clamp(2rem,4vw,2.8rem)] font-medium leading-[1.08] tracking-[-0.045em]">
          The team portal, page by page.
          <br />
          <span className="text-[#8c8e95]">Live, at 1440 and at 390.</span>
        </h1>
        <div className="mt-12 grid gap-16">
          {PAGES.map((p) => (
            <section key={p.href} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#e4e5e9] pb-3">
                <h2 className="text-[18px] font-medium">{p.title}</h2>
                <span className="text-[13px] text-[#8c8e95]">
                  {p.note} <a href={p.href} className="ml-2 text-[#3778bc]">Open →</a>
                </span>
              </div>
              <div className="mt-6 flex max-w-full items-start gap-6 overflow-x-auto pb-2">
                <Frame href={p.href} w={1440} h={1000} scale={0.62} />
                <Frame href={p.href} w={390} h={844} scale={0.74} />
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
