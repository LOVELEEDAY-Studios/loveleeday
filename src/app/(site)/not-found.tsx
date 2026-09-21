import Link from "next/link";

/* 404. Previously styled against var(--font-display-var) and var(--pewter),
   neither of which existed, so it rendered in the body face and an inherited
   grey. A 404 is a page people reach by accident and judge you on anyway. */
export default function NotFound() {
  return (
    <section className="bg-[var(--deep)] py-[clamp(88px,12vw,180px)] text-[var(--on-deep)]">
      <div className="shell">
        <p className="eyebrow flex items-center gap-2.5 text-[var(--on-deep-dim)]">
          <span className="inline-block h-[7px] w-[7px]" style={{ background: "var(--teal)" }} />
          404 — not found
        </p>
        <h1 className="display display-lg mt-7">
          That page
          <br />
          <span style={{ color: "var(--on-deep-mu)" }}>does not exist.</span>
        </h1>
        <p className="mt-7 max-w-[46ch] text-[1.02rem] leading-[1.6] text-[var(--on-deep-mu)]">
          The link may be out of date, or the page may have moved. If you were sent a private review
          link, open the original URL — portal links are unguessable and cannot be reached from
          here.
        </p>

        <nav className="mt-12 border-t border-[var(--deep-line)]" aria-label="Where to go instead">
          {[
            ["Arthur", "/arthur", "The intelligence system"],
            ["Work", "/work", "Shipped products and rebuilds"],
            ["Company", "/about", "How we build, and who for"],
            ["Start a project", "/contact", "Describe the problem, get a fixed quote"],
          ].map(([label, href, note]) => (
            <Link
              key={href}
              href={href}
              className="group flex items-baseline justify-between gap-6 border-b border-[var(--deep-line)] py-5"
            >
              <span className="text-[1.15rem] font-semibold tracking-[-0.02em] transition-colors group-hover:text-[var(--teal)]">
                {label}
              </span>
              <span className="text-right text-[13px] text-[var(--on-deep-dim)]">{note}</span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
