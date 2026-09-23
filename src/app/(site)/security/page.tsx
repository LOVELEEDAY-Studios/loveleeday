import type { Metadata } from "next";
import Link from "next/link";

/* /security.
   ==========================================================================

   A public trust page for a buyer who goes looking for one before signing —
   a school district, an association, a benefits committee. The content is
   sourced from the company's own governance pack rather than written from
   memory: ~/arthur/knowledge/security/loveleeday-company-controls/README.md,
   the 2026-09-23 assessment, and the school-readiness pack. Anything that
   pack marks "Planned" or "Being added" is presented here as underway or on
   the roadmap, never as complete — a false certification is a liability, not
   a marketing win, and this page follows the about page's own rule: where a
   figure or status is unmeasured or unfinished, it says so.

   Verified against source as of 2026-09-23. Re-check the pack before the
   next edit to this page; controls change, and this page should never say
   more than the pack currently supports.
   ========================================================================== */

export const metadata: Metadata = {
  title: "Security & Compliance",
  description:
    "How LOVELEEDAY Studios protects client data: multi-factor authentication, US-only hosting, per-client isolation, automated daily backups, and a stated posture on SOC 2, penetration testing and SSO.",
  alternates: { canonical: "https://loveleedaystudios.com/security" },
};

const CONTROLS: [string, string, string][] = [
  ["01", "Encrypted in transit and at rest",
   "All traffic runs over TLS. Data at rest is encrypted by the underlying infrastructure (Fly.io, Supabase/AWS)."],
  ["02", "Multi-factor authentication",
   "TOTP-based MFA, via an authenticator app, is required for account access. There is no password-only path to a client's data."],
  ["03", "US-only data residency",
   "Application compute runs on Fly.io in Chicago. Databases run on Supabase, hosted on AWS in us-east-1. Data does not leave the United States as part of normal operation."],
  ["04", "Per-client isolation",
   "Each client's data lives in its own tenant, enforced by Row-Level Security in the database — not only in application code. One client cannot read another's rows."],
  ["05", "Automated daily backups",
   "Client data runs on managed Postgres with automated daily backups. Our internal operating records are additionally replicated to two independent providers, with restores tested rather than assumed."],
  ["06", "Least-privilege secret handling",
   "Credentials are scoped to what they need and held in a central, access-controlled store — never committed to source control and never shipped to a browser."],
  ["07", "An approval gate on outbound actions",
   "A send, a database write, a deployment — anything that leaves our systems or reaches a third party — passes an approval and logging step rather than running unsupervised."],
  ["08", "A complete audit trail",
   "Sends, writes, deployments and access changes are logged and reviewable after the fact, not reconstructed from memory."],
];

const ROADMAP: [string, string, string][] = [
  ["SOC 2, Type I then Type II", "Planned",
   "On our roadmap. We have not started the audit and will not describe ourselves as SOC 2 compliant, certified, or in progress toward a specific date until that work is actually under contract with an auditor."],
  ["Independent penetration test", "Planned",
   "Scoped, not yet performed. We will not represent our own internal security review — real as it is — as a substitute for third-party testing."],
  ["SSO / SAML for larger institutions", "Planned",
   "Not yet built, and we have not committed to a date. Client accounts today are provisioned directly, with MFA required on every one."],
];

export default function SecurityPage() {
  return (
    <>
      {/* ── masthead ─────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--line)] bg-[var(--paper)] pt-[clamp(56px,7vw,104px)] pb-[clamp(44px,5vw,76px)]">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="eyebrow flex items-center gap-2.5 text-[var(--dim)]">
              <span className="inline-block h-[7px] w-[7px]" style={{ background: "var(--teal)" }} />
              Trust
            </p>
            <h1 className="display display-lg mt-7">
              Security &amp;
              <br />
              <span style={{ color: "var(--dim)" }}>compliance.</span>
            </h1>
          </div>
          <div className="max-w-[var(--measure)] self-end">
            <p className="text-[1.05rem] leading-[1.6] text-[var(--mid)]">
              This page states our actual control posture, in plain terms, for a client who has to
              answer for that decision to someone else — a board, a district office, a compliance
              committee.
            </p>
            <p className="mt-4 text-[1.05rem] leading-[1.6] text-[var(--mid)]">
              What is in place is stated as in place. What is underway is stated as underway. We do
              not publish a badge or a certification we have not actually earned.
            </p>
          </div>
        </div>
      </section>

      {/* ── what's in place ──────────────────────────────────────────── */}
      <section className="bg-[var(--ground)] py-[clamp(56px,7.5vw,116px)]">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-end">
            <div data-rise>
              <p className="eyebrow text-[var(--dim)]">In place today</p>
              <h2 className="display mt-6 text-[clamp(1.9rem,3.7vw,2.95rem)]">
                Eight controls.
                <br />
                <span style={{ color: "var(--dim)" }}>Live, not planned.</span>
              </h2>
            </div>
            <p className="max-w-[var(--measure)] text-[15.5px] leading-[1.66] text-[var(--mid)]" data-rise>
              Verified against our own governance documentation as of September 23, 2026. Each
              control is enforced in the infrastructure, not stated only in a policy document.
            </p>
          </div>

          <ol className="mt-14 border-t border-[var(--line-3)]">
            {CONTROLS.map(([n, title, body]) => (
              <li key={n}
                  className="grid gap-x-8 gap-y-2 border-b border-[var(--line)] py-7 md:grid-cols-[56px_300px_1fr]"
                  data-rise>
                <span className="eyebrow tnum pt-1.5 text-[var(--dim)]">{n}</span>
                <h3 className="font-[family-name:var(--font-sans-var)] text-[1.2rem] font-semibold tracking-[-0.02em]">
                  {title}
                </h3>
                <p className="max-w-[58ch] text-[15px] leading-[1.65] text-[var(--mid)]">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── compliance posture ───────────────────────────────────────── */}
      <section className="border-t border-[var(--line)] bg-[var(--paper)] py-[clamp(56px,7vw,100px)]">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div data-rise>
            <p className="eyebrow text-[var(--dim)]">Compliance posture</p>
            <h2 className="display display-md mt-6">
              Built around the
              <br />
              <span style={{ color: "var(--dim)" }}>rules that apply to you.</span>
            </h2>
          </div>
          <div className="max-w-[var(--measure)] self-center" data-rise>
            <p className="text-[15px] leading-[1.68] text-[var(--mid)]">
              For education clients, our data handling is designed around the FERPA school-official
              exception and applicable state student-privacy law, including D.C. Code
              § 38-831.02 for education clients in the District.
            </p>
            <p className="mt-4 text-[15px] leading-[1.68] text-[var(--mid)]">
              We maintain a reusable Data Processing Agreement, reviewed against each client's own
              contract, available on request before signature.
            </p>
            <p className="mt-4 text-[15px] leading-[1.68] text-[var(--mid)]">
              On termination of an engagement, or on written request, a client's data is deleted
              from production within 30 days, with a signed deletion certificate on completion.
            </p>
          </div>
        </div>
      </section>

      {/* ── roadmap — the one dark stage, read as a contract not a pitch ─ */}
      <section className="bg-[var(--deep)] py-[clamp(56px,7.5vw,116px)] text-[var(--on-deep)]">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div data-rise>
            <p className="eyebrow flex items-center gap-2.5 text-[var(--on-deep-dim)]">
              <span className="inline-block h-[7px] w-[7px]" style={{ background: "var(--teal)" }} />
              On our roadmap
            </p>
            <h2 className="display mt-6 text-[clamp(2rem,4.4vw,3.5rem)]">
              Underway.
              <br />
              <span style={{ color: "var(--on-deep-mu)" }}>Not claimed complete.</span>
            </h2>
            <p className="mt-7 max-w-[var(--measure)] text-[15.5px] leading-[1.66] text-[var(--on-deep-mu)]">
              This is the section that has to be read as a contract rather than as a pitch. None of
              the three items below are done. We say so here in the same place we say what is
              finished, rather than leaving it out.
            </p>
          </div>
          <dl className="divide-y divide-[var(--deep-line)] border-y border-[var(--deep-line)]">
            {ROADMAP.map(([t, status, d]) => (
              <div key={t} className="grid gap-x-6 gap-y-2 py-6 md:grid-cols-[110px_1fr]" data-rise>
                <span className="eyebrow pt-1.5 text-[var(--on-deep-dim)]">{status}</span>
                <div>
                  <dt className="font-[family-name:var(--font-sans-var)] text-[1.06rem] font-semibold tracking-[-0.018em]">
                    {t}
                  </dt>
                  <dd className="mt-1.5 max-w-[62ch] text-[14.5px] leading-[1.62] text-[var(--on-deep-mu)]">{d}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── questions ────────────────────────────────────────────────── */}
      <section className="bg-[var(--ground)] py-[clamp(64px,8vw,110px)]">
        <div className="shell">
          <p className="eyebrow flex items-center gap-2.5 text-[var(--dim)]">
            <span className="inline-block h-[7px] w-[7px]" style={{ background: "var(--teal)" }} />
            Questions?
          </p>
          <h2 className="display mt-6 text-[clamp(1.9rem,4vw,3rem)]" data-rise>
            Ask us directly —
            <br />
            <span style={{ color: "var(--teal)" }}>we would rather you did.</span>
          </h2>
          <p className="mt-5 max-w-[56ch] text-[15px] leading-[1.68] text-[var(--mid)]" data-rise>
            For a security questionnaire, a Data Processing Agreement, or anything on this page you
            want to see the underlying policy for, reach us the same way you would about a project.
          </p>
          <div className="mt-9 flex flex-wrap gap-2.5" data-rise>
            <Link href="/contact"
                  className="inline-flex h-12 items-center rounded-[2px] bg-[var(--ink)] px-6 text-[14.5px] font-semibold text-[var(--paper)] transition-opacity hover:opacity-90">
              Start a project
            </Link>
            <a href="mailto:hello@loveleedaystudios.com"
               className="inline-flex h-12 items-center rounded-[2px] border border-[var(--line-2)] bg-[var(--paper)] px-6 text-[14.5px] font-semibold transition-colors hover:border-[var(--ink)]">
              hello@loveleedaystudios.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
