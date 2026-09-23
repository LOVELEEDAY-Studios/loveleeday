import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  complianceSchools,
  complianceStats,
  getComplianceSchool,
  requirements,
  requirementSources,
} from "@/content/compliance";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { NoteForm } from "@/components/portal/NoteForm";

export const dynamicParams = false;

export function generateStaticParams() {
  return complianceSchools.map((s) => ({ token: s.token }));
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const s = getComplianceSchool(token);
  return { title: s ? `${s.short}: compliance calendar` : "Compliance calendar" };
}

const mono = "font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em]";
const monthName = (ym: string) =>
  new Date(ym + "-15T12:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" });

export default async function CompliancePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const s = getComplianceSchool(token);
  if (!s) notFound();
  const st = complianceStats();

  return (
    <>
      <section className="mx-auto max-w-[1340px] px-6 pb-14 pt-16 sm:pt-24">
        <p className={`${mono} text-[var(--accent)]`}>
          Leadership dashboard
          <span className="text-[var(--dim)]"> · prepared for {s.preparedFor}, {s.short}</span>
        </p>
        <h1 className="mt-5 max-w-[17ch] text-[clamp(2.4rem,6vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.035em]">
          Every deadline the city holds you to, in one place.
        </h1>
        <p className="rule-left mt-8 max-w-[var(--measure)] text-[17px] leading-[1.7] text-[var(--mid)]">
          You told Daniel this morning that nobody can say what is due when, that the work is spread across ten logins,
          and that it takes more of your week than it should. So we built it. Below is {s.short}&apos;s full {s.year}{" "}
          compliance year, built from the two calendars DC actually publishes, sorted to the requirements that apply to
          a single-campus elementary school. Then we went further, to what you said leadership spends weeks on: planning
          the next five years across too many data sources. It all sits in one dashboard below, and it works.
        </p>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--paper)]">
        <div className="mx-auto grid max-w-[1340px] grid-cols-2 gap-px bg-[var(--line)] px-0 lg:grid-cols-4">
          {[
            [String(st.published), "requirements published", `${st.pcsb} from DC PCSB, ${st.osse} from OSSE`],
            [String(st.applies), "apply to Global Citizens", `${st.conditional} more apply only if something triggers them`],
            [String(st.platforms), "places to file them", "portals, inboxes and shared folders"],
            [String(st.busiestCount), `due in ${monthName(st.busiest)}`, "your heaviest month, and it is next"],
          ].map(([k, l, sub]) => (
            <div key={l} className="bg-[var(--paper)] px-4 py-6 sm:px-6 sm:py-8">
              <span className="tnum block text-[34px] leading-none tracking-[-0.03em] sm:text-[44px]">{k}</span>
              <span className="mt-3 block text-[14px] font-medium sm:text-[15px]">{l}</span>
              <span className="mt-1 block text-[12.5px] text-[var(--mid)] sm:text-[13px]">{sub}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1340px] px-6 py-16">
        <div className="mb-8 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] font-medium tracking-[-0.02em]">Your leadership dashboard</h2>
            <p className="mt-2 max-w-[62ch] text-[15px] leading-[1.65] text-[var(--mid)]">
              Compliance is one tab. The others are what you asked about: a five-year plan your team can move with a slider
              instead of weeks of spreadsheets, enrollment against the charter&apos;s ceiling, and student and faculty
              profiles for retention and satisfaction. Public figures are yours from the record; anything marked sample is
              what your own systems will fill in.
            </p>
          </div>
          <span className="text-[13px] text-[var(--dim)]">Working preview · click anything</span>
        </div>
        <Dashboard items={requirements} storageKey={`llc-compliance-${token}`} school={s.short} />
      </section>

      <section className="border-t border-[var(--line)]">
        <div className="mx-auto max-w-[1340px] px-6 py-20">
          <span className={`${mono} text-[var(--accent)]`}>How it runs</span>
          <h2 className="mt-4 max-w-[24ch] text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium leading-[1.06] tracking-[-0.025em]">
            A calendar tells you. Arthur does the chasing.
          </h2>
          <div className="mt-12 grid gap-px bg-[var(--line)] md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Watches both agencies", "DC PCSB and OSSE change dates and rules during the year, and OSSE has not published its 2026–27 calendar yet. Arthur checks both and updates your calendar when anything moves, so a projected date becomes a confirmed one without you looking."],
              ["Builds each packet", "Two weeks out, Arthur pulls last year's filing, the official guide and the documents in your vault together, drafts what can be drafted, and sends it to the owner to review."],
              ["Chases the owner", "Reminders at 14, 7 and 2 days, to the person who owns the item rather than to you. Once something is filed, Arthur asks for the confirmation number and logs it."],
              ["Reports to your board", "A one-page status for every board meeting: what was filed on time, what is coming, who owns it. It is the record the annual compliance review asks for, kept as you go."],
            ].map(([t, d], i) => (
              <div key={t} className="bg-[var(--ground)] p-7">
                <span className="tnum font-[family-name:var(--font-mono)] text-[11px] tracking-[0.18em] text-[var(--dim)]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-[17px] font-medium leading-[1.3]">{t}</h3>
                <p className="mt-3 text-[14px] leading-[1.65] text-[var(--mid)]">{d}</p>
              </div>
            ))}
          </div>
          <p className="rule-left mt-10 max-w-[var(--measure)] text-[15px] leading-[1.7] text-[var(--mid)]">
            What stays with your team: pressing submit. The logins to Epicenter, The Hub, Compass, SLED and the rest belong
            to the school, and they should. Everything up to that button is ours.
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--paper)]">
        <div className="mx-auto grid max-w-[1340px] gap-10 px-6 py-20 lg:grid-cols-2">
          <div>
            <span className={`${mono} text-[var(--accent)]`}>What we read about your school</span>
            <h2 className="mt-4 max-w-[22ch] text-[clamp(1.7rem,3vw,2.4rem)] font-medium leading-[1.08] tracking-[-0.02em]">
              A clean record, and a bigger year ahead.
            </h2>
          </div>
          <div className="grid gap-5 text-[15px] leading-[1.7] text-[var(--mid)]">
            <p>
              On April 27, 2026 the DC PCSB Board voted unanimously to continue Global Citizens&apos; charter. Board staff
              found no material violation of law or of the charter, no pattern of fiscal mismanagement, and charter goals
              fully met in all three years reviewed.
            </p>
            <p>
              2026–27 is also the year you grow: a new building and grades through five. That adds work of its own. The
              calendar already includes DC PCSB&apos;s pre-opening site visit checklist for schools that are relocating, and
              the Certificate of Occupancy filing due October 27, which a new building turns from routine into real
              work. There are also more students to enroll, audit and report.
            </p>
            <p>
              So this is not a rescue. It is how you keep the record you have while the school gets bigger, without the
              compliance work growing with it.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)]">
        <div className="mx-auto max-w-[1340px] px-6 py-20">
          <span className={`${mono} text-[var(--accent)]`}>The offer</span>
          <h2 className="mt-4 max-w-[24ch] text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium leading-[1.06] tracking-[-0.025em]">
            Start small this month. Earn the rest by next year.
          </h2>
          <div className="mt-12 grid gap-px bg-[var(--line)] lg:grid-cols-2">
            <div className="bg-[var(--paper)] p-8">
              <span className={`${mono} text-[var(--dim)]`}>Now · 2026–27</span>
              <h3 className="mt-4 text-[22px] font-medium">Compliance desk</h3>
              <p className="mt-2 tnum text-[34px] leading-none tracking-[-0.02em]">$1,950<span className="text-[15px] text-[var(--mid)]"> a month</span></p>
              <ul className="mt-6 grid gap-2.5 text-[14.5px] leading-[1.6] text-[var(--mid)]">
                <li>The calendar above, live for your whole team, with every date kept current as DC PCSB and OSSE publish</li>
                <li>A document vault: last year&apos;s filings and this year&apos;s, attached to the requirement they answer</li>
                <li>Arthur drafts each packet two weeks out and chases the owner at 14, 7 and 2 days</li>
                <li>A board-ready compliance report before every board meeting</li>
                <li>A weekly status note to you: what was filed, what is next, what is stuck</li>
              </ul>
              <p className="mt-6 text-[13px] leading-[1.6] text-[var(--dim)]">
                At $23,400 a year it sits under the $25,000 line that requires a public bid, so it can start this week and
                run next to the vendors you already have. Month to month; stop whenever it stops earning its place.
              </p>
            </div>
            <div className="bg-[var(--paper)] p-8">
              <span className={`${mono} text-[var(--dim)]`}>From 2027–28</span>
              <h3 className="mt-4 text-[22px] font-medium">Compliance and student data, together</h3>
              <p className="mt-2 tnum text-[34px] leading-none tracking-[-0.02em]">$3,900<span className="text-[15px] text-[var(--mid)]"> a month</span></p>
              <ul className="mt-6 grid gap-2.5 text-[14.5px] leading-[1.6] text-[var(--mid)]">
                <li>Everything in the compliance desk</li>
                <li>Student data submissions handled end to end: enrollment audit, attendance and discipline validation, the Compass and OSSE data collections</li>
                <li>A named DC data specialist on your account, with Arthur doing the checking and the chasing</li>
              </ul>
              <p className="mt-6 text-[13px] leading-[1.6] text-[var(--dim)]">
                Only once the first year has shown you the work. At that size it goes through your normal public bid, and
                you compare us with whoever else answers it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="next" className="border-t border-[var(--line)]">
        <div className="mx-auto grid max-w-[1340px] items-start gap-10 px-6 py-20 lg:grid-cols-[1fr_1.1fr] lg:py-28">
          <div>
            <span className={`${mono} text-[var(--accent)]`}>Next step</span>
            <h2 className="mt-4 max-w-[20ch] text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium leading-[1.06] tracking-[-0.025em]">
              Thirty minutes, and your real year goes live.
            </h2>
            <ol className="mt-8 grid gap-4 text-[15px] leading-[1.65] text-[var(--mid)]">
              <li><span className="tnum mr-2 text-[var(--accent)]">1</span>Walk us through your ten logins and who owns what today.</li>
              <li><span className="tnum mr-2 text-[var(--accent)]">2</span>We mark off what is already filed this year and load last year&apos;s submissions into the vault.</li>
              <li><span className="tnum mr-2 text-[var(--accent)]">3</span>Arthur starts on October&apos;s filings, your heaviest month, the same week.</li>
            </ol>
            <p className="mt-8 max-w-[var(--measure)] text-[15px] leading-[1.7] text-[var(--mid)]">
              We would run next to your current firm for the first cycle, so nothing depends on us before it has earned
              it.
            </p>
          </div>
          <NoteForm
            token={s.token}
            client={s.short}
            deliverables={[{ slug: "compliance", title: "Compliance calendar" }]}
            intent="start"
            heading="Reply to us"
            blurb="Say the word and we start this week, or tell us what to change first. It reaches Daniel directly."
          />
        </div>
      </section>

      <section className="border-t border-[var(--line)]">
        <div className="mx-auto max-w-[1340px] px-6 py-10">
          <details>
            <summary className={`${mono} cursor-pointer text-[var(--dim)] hover:text-[var(--accent)]`}>Sources and method</summary>
            <ul className="mt-4 grid max-w-[70ch] gap-2 text-[13px] leading-[1.6] text-[var(--mid)]">
              {requirementSources.map((src) => (
                <li key={src.url}><a className="underline decoration-[var(--line-2)] underline-offset-2 hover:text-[var(--accent)]" href={src.url} target="_blank" rel="noreferrer">{src.label}</a></li>
              ))}
              <li>OSSE had not published its 2026–27 requirements calendar as of September 23, 2026. Its dated items are last year&apos;s dates moved forward a year and marked as projected.</li>
              <li>High school, career and adult education requirements are excluded. Amendment, waiver and notice-driven items are listed under &quot;Only if triggered&quot;.</li>
              <li><a className="underline decoration-[var(--line-2)] underline-offset-2 hover:text-[var(--accent)]" href="https://www.dcpcsb.org/board-meeting-april-2026" target="_blank" rel="noreferrer">DC PCSB Board meeting, April 27, 2026 (transcript)</a></li>
            </ul>
          </details>
        </div>
      </section>
    </>
  );
}
