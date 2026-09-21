import Link from "next/link";

export default function ContactSuccess() {
  return (
    <>
      <section className="border-b border-[var(--line)] bg-[var(--paper)] pt-[clamp(64px,8vw,116px)] pb-[clamp(48px,6vw,88px)]">
        <div className="shell">
          <p className="eyebrow flex items-center gap-2.5 text-[var(--dim)]">
            <span className="inline-block h-[7px] w-[7px]" style={{ background: "var(--signal)" }} />
            Brief received
          </p>
          <h1 className="display display-lg mt-7">
            Got it.
            <br />
            <span style={{ color: "var(--dim)" }}>You&rsquo;ll hear back today.</span>
          </h1>
          <p className="mt-7 max-w-[52ch] text-[1.05rem] leading-[1.6] text-[var(--muted)]">
            A copy is on its way to your inbox. Daniel reads these himself, so the reply will be a
            person asking about your problem rather than a sequence asking for a call.
          </p>
        </div>
      </section>

      <section className="bg-[var(--paper)] py-[clamp(56px,7vw,100px)]">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h2 className="eyebrow text-[var(--dim)]">While you wait</h2>
            <div className="mt-6 border-t border-[var(--line)]">
              {[
                ["How Arthur works", "/arthur", "The five components, and what each one refuses to do without."],
                ["What we've shipped", "/work", "Five products in production and six uncommissioned rebuilds."],
              ].map(([label, href, note]) => (
                <Link key={href} href={href} className="group block border-b border-[var(--line)] py-5">
                  <span className="text-[1.15rem] font-semibold tracking-[-0.02em] transition-colors group-hover:text-[var(--signal)]">
                    {label} &rarr;
                  </span>
                  <span className="mt-1.5 block max-w-[46ch] text-[13.5px] text-[var(--muted)]">{note}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="lg:border-l lg:border-[var(--line)] lg:pl-12">
            <h2 className="eyebrow text-[var(--dim)]">Something urgent?</h2>
            <a
              href="mailto:hello@loveleedaystudios.com"
              className="mt-5 block text-[1.15rem] font-semibold underline decoration-[var(--line-2)] underline-offset-4 hover:decoration-[var(--signal)]"
            >
              hello@loveleedaystudios.com
            </a>
            <p className="mt-4 max-w-[40ch] text-[13.5px] leading-[1.6] text-[var(--muted)]">
              Reply to the confirmation email and it lands in the same thread.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
