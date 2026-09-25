import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  complianceSchools,
  complianceStats,
  getComplianceSchool,
  requirements,
  requirementSources,
} from "@/content/compliance";
import { gcPublic } from "@/content/compliance/gc-profile";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { NoteForm } from "@/components/portal/NoteForm";

export const dynamicParams = false;

export function generateStaticParams() {
  return complianceSchools.map((s) => ({ token: s.token }));
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const s = getComplianceSchool(token);
  return { title: s ? `${s.short}: an analysis` : "An analysis" };
}

/* The whole page in the homepage's own register (public/site/assets/site.css):
   system type, white and #f5f5f7 stages, one dark stage for trust, two-tone
   headlines. .ll-os re-points the shared tokens so the dashboard and the note
   form inherit it. */

const monthName = (ym: string) =>
  new Date(ym + "-15T12:00:00").toLocaleDateString("en-US", { month: "long" });

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
      ? "text-[clamp(2.6rem,6.4vw,4.6rem)] leading-[1.02] tracking-[-0.05em]"
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

export default async function CompliancePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const s = getComplianceSchool(token);
  if (!s) notFound();
  const st = complianceStats();
  const tbdPlatform = requirements.filter((r) => r.applies === "yes" && r.platform === "Platform not yet announced").length;
  const overlap = requirements.filter((r) => r.agency === "DC PCSB" && r.alsoOsse).length;
  const pctOfCeiling = Math.round((gcPublic.enrollment2425 / 250) * 100);
  const growth = Math.round((gcPublic.revenueFY25 / gcPublic.revenueFY24 - 1) * 100);

  const steps: { n: string; ask: string; who: string; found: string; figure: string; figureLabel: string }[] = [
    {
      n: "01",
      who: "You asked",
      ask: "What is due, and when?",
      found: `Two agencies publish the answer, in two formats, on two websites. Together they list ${st.published} requirements for DC charter schools. ${st.applies} apply to a single-campus elementary school like yours, and ${st.conditional} more apply only if something triggers them. They are filed in ${st.platforms} different places.`,
      figure: String(st.busiestCount),
      figureLabel: `due in ${monthName(st.busiest)}, your heaviest month`,
    },
    {
      n: "02",
      who: "Arthur asked",
      ask: "Why is this so hard to keep straight?",
      found: `Because the system makes it hard, not your team. DC PCSB's own calendar says its requirements overlap with OSSE's and "can result in what appear to be duplicative submissions": ${overlap} of its items are also requested by OSSE. OSSE has not published its 2026–27 calendar at all, and ${tbdPlatform} of the requirements that apply to you have no filing platform named yet.`,
      figure: String(overlap),
      figureLabel: "DC PCSB items OSSE also asks for",
    },
    {
      n: "03",
      who: "Nobody asked",
      ask: "Can the school afford the growth ahead?",
      found: `Your charter allows ${gcPublic.ceiling[5].n} students this year and ${gcPublic.ceiling[6].n} by 2027–28. In 2024–25 you enrolled ${gcPublic.enrollment2425} against a ceiling of 250. Revenue grew ${growth}% in a year, to $6.11M, and the move to the ${gcPublic.building.ward} building carries a ${gcPublic.building.renovation} renovation. Whether the plan works depends on how fast seats fill, and that is a question you can now move with a slider.`,
      figure: `${pctOfCeiling}%`,
      figureLabel: "of the 2024–25 ceiling filled",
    },
    {
      n: "04",
      who: "Nobody asked",
      ask: "Who will teach them?",
      found:
        "Every grade you add is two or more classrooms, and a dual-language immersion school has to find Mandarin and Spanish teachers for them, from a far smaller pool than English-only roles. The plan turns enrollment into teachers needed and hires per year, so postings go up before the lottery, not after it.",
      figure: "PK3–5",
      figureLabel: "by 2027–28, two grades in two years",
    },
    {
      n: "05",
      who: "Nobody asked",
      ask: "Will families follow you to a new ward?",
      found: `You are moving from Ward 7 to ${gcPublic.building.ward}. Some current families will travel further and some Ward 6 families have not heard of you yet. Re-enrollment intent, tracked by grade before the lottery closes, is the earliest warning you get, and it is the number the budget depends on.`,
      figure: "2",
      figureLabel: "wards: the families you have, the families you need",
    },
    {
      n: "06",
      who: "Nobody asked",
      ask: "Are you keeping the record you earned?",
      found:
        'On April 27, 2026 DC PCSB voted unanimously to continue your charter: no material violations, no fiscal mismanagement, goals met all three years. The 2025 site review is where the next review will look first. Its lowest score was "using assessment in instruction", at 1.92 of 4.',
      figure: "3 of 3",
      figureLabel: "years of charter goals met",
    },
  ];

  const security: { t: string; d: string }[] = [
    {
      t: "Student privacy law, followed to the letter",
      d: "Under FERPA we act as a school official under your direct control, for your educational purposes only. DC's Protecting Students Digital Privacy Act adds the rest: no use of student information beyond education, no targeted advertising, reasonable security, breach notice, and deletion when the service ends. Students under 13 are covered by COPPA, and we never collect anything from a child directly.",
    },
    {
      t: "Walled off at the database",
      d: "Each school's information sits in its own tenant, and the wall is enforced by the database itself through row-level security, not by application code that could have a bug. Automated probes test that wall, and Arthur's own service account cannot read client data.",
    },
    {
      t: "Only your people get in",
      d: "Accounts belong to the school. Every sign-in requires two-factor authentication, access is set by role, so a teacher sees less than leadership, and removing a person revokes access at once.",
    },
    {
      t: "Your agency logins stay yours",
      d: "We never ask for or store the passwords to Epicenter, The Hub, Compass, SLED or any other state system. Arthur prepares the work; your team presses submit.",
    },
    {
      t: "Arthur works for you, not on you",
      d: "Arthur answers only from your school's own information, and shows where every answer came from. Your data is never sold, never used for marketing, and never used to train AI models, ours or anyone else's.",
    },
    {
      t: "Encrypted, logged, and deletable",
      d: "Encrypted in transit and at rest. Every sign-in, file and question is logged, and the log is yours to see. You can export everything at any time, and at the end of the service we delete it within 30 days and confirm in writing.",
    },
    {
      t: "The least data that does the job",
      d: "The compliance calendar needs no student records at all, and planning works from totals. Student-level information is connected only when you choose to, and de-identified wherever the question allows.",
    },
    {
      t: "Signed before anything is connected",
      d: "We sign your data privacy agreement, or the Student Data Privacy Consortium's National Data Privacy Agreement, before a single student record is shared, and commit to notify you within 72 hours of discovering any incident.",
    },
  ];

  return (
    <div className="ll-os bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-[1180px] px-6 pb-20 pt-16 sm:pt-24">
        <Eyebrow>
          Prepared for {s.preparedFor} · {s.short}
        </Eyebrow>
        <Two size="h1" a="You asked for a calendar." b="Arthur kept going." />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <p className="text-[17px] leading-[1.7] text-[#7d8088]">
            This morning you told Daniel that nobody can say what is due when, that the work is spread across ten logins,
            and that it takes more of your week than it should. <span className="text-[#1d1d1f]">So we built the calendar.</span>
          </p>
          <p className="text-[17px] leading-[1.7] text-[#7d8088]">
            Then we let Arthur keep asking. Each answer raised the next question, most of them ones nobody had put to it:
            about the budget behind your growth, the teachers it needs, the families you are moving toward, and the record
            you want to keep. <span className="text-[#1d1d1f]">This is what it found, and the working system it built.</span>
          </p>
        </div>
      </section>

      {/* Figures */}
      <section className="border-y border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-px px-0 lg:grid-cols-4">
          {[
            [String(st.published), "requirements published for DC charters", "by DC PCSB and OSSE"],
            [String(st.applies), "apply to Global Citizens", `and ${st.conditional} more if triggered`],
            [String(st.platforms), "places to file them", "portals, inboxes, shared folders"],
            [String(gcPublic.ceiling[6].n), "students your charter allows", "by 2027–28, from 198 in 2024–25"],
          ].map(([k, l, sub]) => (
            <div key={l} className="px-6 py-10">
              <span className="block text-[clamp(2.2rem,4vw,3rem)] font-medium leading-none tracking-[-0.05em] tabular-nums">{k}</span>
              <span className="mt-3 block text-[14px] text-[#1d1d1f]">{l}</span>
              <span className="mt-1 block text-[12.5px] text-[#8b8e96]">{sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How the analysis unfolded */}
      <section className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow>How the analysis unfolded</Eyebrow>
            <Two a="One question." b="Then the ones behind it." />
          </div>
          <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#7d8088]">
            Six questions, in the order Arthur reached them. The first was yours. Every figure comes from your school&apos;s
            public record or DC&apos;s published calendars, and the sources are listed at the end.
          </p>
        </div>
        <ol className="mt-14 border-t border-[#e4e5e9]">
          {steps.map((x) => (
            <li key={x.n} className="grid gap-6 border-b border-[#e4e5e9] py-10 lg:grid-cols-[4rem_1.1fr_1.4fr_12rem] lg:gap-10">
              <span className="text-[12px] tabular-nums text-[#6a6e77]">{x.n}</span>
              <div>
                <span className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${x.who === "You asked" ? "text-[#3778bc]" : "text-[#8b8e96]"}`}>{x.who}</span>
                <h3 className="mt-2 text-[22px] font-medium leading-[1.3] tracking-[-0.025em] text-[#1d1d1f]">{x.ask}</h3>
              </div>
              <p className="text-[15px] leading-[1.75] text-[#6c7481]">{x.found}</p>
              <div className="lg:text-right">
                <span className="block text-[34px] font-medium leading-none tracking-[-0.04em] tabular-nums text-[#1d1d1f]">{x.figure}</span>
                <span className="mt-2 block text-[12px] leading-[1.5] text-[#8b8e96]">{x.figureLabel}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* The system */}
      <section id="dashboard" className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1340px] px-6 py-24">
          {/* The dashboard runs wider (1340) than the page column (1180); the heading keeps the column's left edge. */}
          <div className="mx-auto mb-12 grid max-w-[1132px] gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>The working system</Eyebrow>
              <Two a="Ask simply." b="Plan completely." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#7d8088]">
              Every answer above lives here, and none of it is a picture. Move the plan, open a deadline, or ask Arthur your
              own question: it answers live from your public record and the plan on your screen, and shows its evidence.
            </p>
          </div>
          <Dashboard items={requirements} storageKey={`llc-compliance-${token}`} school={s.short} token={s.token} />
          <p className="mt-4 text-center text-[10.5px] leading-[1.6] text-[#6a6e77]">
            Interactive preview. Figures marked public come from Global Citizens&apos; public record. Figures marked sample show
            what your own systems fill in once connected. This preview holds no student information.
          </p>
        </div>
      </section>

      {/* What changes */}
      <section className="mx-auto max-w-[1180px] px-6 py-24">
        <Eyebrow>What changes for your team</Eyebrow>
        <Two a="Less chasing." b="More deciding." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-[16px] border border-[#e4e5e9] bg-[#e4e5e9] md:grid-cols-2">
          {[
            ["What is due this month", "Ten logins and a spreadsheet", "One list, sorted by owner, with the guide attached"],
            ["Getting each filing in", "Someone remembers, usually", "Arthur drafts it two weeks out and chases the owner at 14, 7 and 2 days"],
            ["Next year's budget", "Weeks of exports across too many sources", "A plan you move with a slider, with every assumption visible"],
            ["Hiring for growth", "Posted when the gap appears", "Hires per year from enrollment, posted before the lottery"],
            ["Family retention", "Learned at the October count", "Re-enrollment intent by grade, while there is time to act"],
            ["Your board", "Assembled the night before", "A compliance and planning report, kept current all year"],
          ].map(([what, before, after]) => (
            <div key={what} className="bg-white p-7">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6a6e77]">{what}</span>
              <p className="mt-4 text-[14px] leading-[1.6] text-[#6a6e77] line-through decoration-[#d5d8de]">{before}</p>
              <p className="mt-1 text-[16px] leading-[1.55] text-[#1d1d1f]">{after}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security & privacy */}
      <section className="bg-[#111217] text-white">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow dark>Security and student privacy</Eyebrow>
              <Two dark a="Built for a school." b="Private by design." />
            </div>
            <p className="max-w-[34rem] text-[15px] leading-[1.7] text-[#a3a8b2]">
              A school holds the most sensitive information there is: children&apos;s. Here is how it is protected, in
              plain terms, before you are asked to share any of it.
            </p>
          </div>
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

      {/* How we would begin */}
      <section id="next" className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow>How we would begin</Eyebrow>
            <Two a="Start with the calendar." b="Grow from there." />
            <ol className="mt-10 grid gap-6">
              {[
                ["A thirty-minute walkthrough", "Your ten logins, who owns what today, and what is already filed this year."],
                ["Sign the privacy agreement", "Yours or the National DPA, before anything is connected."],
                ["Compliance first", "It needs no student records. October, your heaviest month, is covered the same week."],
                ["Planning when you are ready", "Connect budget, enrollment and staffing sources one at a time, alongside the vendors you already have."],
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
            token={s.token}
            client={s.short}
            deliverables={[{ slug: "compliance", title: "Analysis and dashboard" }]}
            intent="start"
            heading="Reply to us"
            blurb="Say the word and we start with October, or tell us what to look at next."
          />
        </div>
      </section>

      {/* Sources */}
      <section className="border-t border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-12">
          <details>
            <summary className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777980] hover:text-[#3778bc]">
              Sources and method
            </summary>
            <ul className="mt-5 grid max-w-[72ch] gap-2 text-[13px] leading-[1.6] text-[#6c7481]">
              {[...requirementSources, ...gcPublic.sources,
                { label: "DC PCSB Board meeting, April 27, 2026 (transcript)", url: "https://www.dcpcsb.org/board-meeting-april-2026" },
                { label: "Protecting Students Digital Privacy Act of 2016 (D.C. Law 21-218)", url: "https://code.dccouncil.gov/us/dc/council/laws/21-218" },
              ].map((src) => (
                <li key={src.url}>
                  <a className="underline decoration-[#d5d8de] underline-offset-2 hover:text-[#3778bc]" href={src.url} target="_blank" rel="noreferrer">
                    {src.label}
                  </a>
                </li>
              ))}
              <li>OSSE had not published its 2026–27 requirements calendar as of September 23, 2026. Its dated items are last year&apos;s dates moved forward 52 weeks and marked as projected.</li>
              <li>High school, career, adult education and DCPS-only requirements are excluded. Amendment, waiver and notice-driven items are listed as applying only if triggered.</li>
            </ul>
          </details>
        </div>
      </section>
    </div>
  );
}
