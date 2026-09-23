import Link from "next/link";
import { LogoMark } from "./Nav";

/* The old footer was two lines of copyright and an email address, styled with
   var(--bone) and var(--pewter) -- two custom properties that do not exist in
   globals.css and never did, so its rule and its type colour were silently
   falling back to whatever they inherited. A dead token is invisible until you
   go looking, which is why this one survived a redesign.

   What replaces it is the closing stage of the page rather than a strip under
   it: dark, full-bleed, the wordmark set large, and real columns. Every link
   here resolves -- there are no placeholder columns, because a footer full of
   dead links is the fastest way to look smaller than you are. */

const COLUMNS: { title: string; links: { label: string; href: string; ext?: boolean }[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Arthur", href: "/arthur" },
      { label: "Architecture", href: "/arthur#architecture" },
      { label: "How we scope", href: "/about#method" },
    ],
  },
  {
    /* No outbound link to an owned company here. A footer link to olldae.com
       from the studio's front door reads as a client logo, and olldae is ours.
       It lives on /work under the heading that says so. */
    title: "Work",
    links: [
      { label: "Client rebuilds", href: "/work#studies" },
      { label: "Companies we operate", href: "/work" },
      { label: "How we measure", href: "/about#method" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Security & compliance", href: "/security" },
      { label: "Start a project", href: "/contact" },
      { label: "hello@loveleedaystudios.com", href: "mailto:hello@loveleedaystudios.com", ext: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-[var(--deep)] text-[var(--on-deep)]">
      <div className="shell pt-20 pb-10">
        <div className="grid gap-12 border-b border-[var(--deep-line)] pb-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label="LOVELEEDAY Studios — home">
              <LogoMark size={24} />
              <span className="text-[13.5px] font-semibold">
                LOVELEEDAY<span className="text-[var(--on-deep-mu)]"> Studios</span>
              </span>
            </Link>
            <p className="mt-5 max-w-[30ch] text-[14px] leading-[1.55] text-[var(--on-deep-mu)]">
              Intelligence architecture and the production software that runs on top of it.
            </p>
            <p className="eyebrow mt-6 text-[var(--on-deep-dim)]">
              Kalamazoo, Michigan
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="eyebrow text-[var(--on-deep-dim)]">{col.title}</h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.ext ? (
                      <a
                        href={l.href}
                        className="text-[14px] text-[var(--on-deep-mu)] transition-colors hover:text-[var(--on-deep)]"
                        {...(l.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-[14px] text-[var(--on-deep-mu)] transition-colors hover:text-[var(--on-deep)]"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* The wordmark set large across the foot, in the ground colour lifted
            just enough to read. Novarna does this and it is the cheapest way to
            make a page end on the company's name rather than on its lawyers. */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none pt-10 text-center font-semibold leading-[0.82] tracking-[-0.055em]"
          style={{
            fontSize: "clamp(3.4rem, 15vw, 13rem)",
            color: "var(--deep-line)",
          }}
        >
          LOVELEEDAY
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-[var(--deep-line)] pt-7 text-[12.5px] text-[var(--on-deep-dim)] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 LOVELEEDAY Studios LLC — a Delaware company.</span>
          <span className="tnum">
            Figures on this site name their source. Where one is unmeasured it says so.
          </span>
        </div>
      </div>
    </footer>
  );
}
