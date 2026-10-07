import type { Metadata } from "next";

export const metadata: Metadata = { title: "Arthur in the cloud: what Google Cloud unlocks" };

/* Proposal on the hub template: same Eyebrow / Two-line heading / hairline sections as the
   other /p/ pages. Every figure was measured or fetched on 2026-10-07; the dates stay on the page. */

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
      ? "text-[clamp(2.4rem,6.4vw,4.6rem)] leading-[1.04] tracking-[-0.05em]"
      : "text-[clamp(1.9rem,4.2vw,3rem)] leading-[1.08] tracking-[-0.045em]";
  const Tag = size;
  return (
    <Tag className={`mt-4 font-medium ${cls} ${dark ? "text-white" : "text-[#1d1d1f]"}`}>
      {a}
      <br />
      <span className={dark ? "text-[#8e8d99]" : "text-[#8c8e95]"}>{b}</span>
    </Tag>
  );
}

const Lede = ({ children, dark }: { children: React.ReactNode; dark?: boolean }) => (
  <p className={`mt-6 max-w-[34rem] text-[15px] leading-[1.75] ${dark ? "text-[#a3a8b2]" : "text-[#6c7481]"}`}>{children}</p>
);

const proven = [
  { k: "20 of 20", label: "browsers finished their work at the same time, in 17.1 seconds in total.", src: "Cloud browser fleet on Google Cloud Run, project roamlist, us-central1. Measured 2026-10-07." },
  { k: "9.6 seconds", label: "for one cold browser, started from nothing, to be ready to work.", src: "Same fleet. Measured 2026-10-07." },
  { k: "5 jobs", label: "moved onto the cloud the same day and checked by running them.", src: "Verified by running each one, 2026-10-07." },
  { k: "Essex blocked", label: "Essex, QAD, SharePoint, Salesforce and Outlook addresses cannot be opened from any cloud browser.", src: "Tested: QAD returned ERR_BLOCKED_BY_CLIENT. 2026-10-07." },
];

const movedJobs = [
  "MLCC licence monitor",
  "Google Ads tag check (run by launchd itself)",
  "LIVE at Dabney graphics",
  "The Friday story cadence",
  "The show-change guard",
];

const laptop = [
  ["8 GB", "of memory on this Mac"],
  ["8 cores", "to do everything with"],
  ["67%", "swap in use with only 2 working desks open"],
  ["3 desks", "is the hard cap (desk-cap.mjs); 8 desks once pushed swap to 96% and every terminal crawled for hours"],
  ["172 jobs", "scheduled and loaded today (237 at the 2026-09-21 audit)"],
  ["1 model", "resident on the Mac: the embedding model"],
];

type Move = { id: string; t: string; lead: string; body?: string[]; bullets?: string[]; after?: string };
const moves: Move[] = [
  {
    id: "A",
    t: "Workers instead of desks",
    lead: "The biggest lever.",
    body: [
      "Today a desk is a Claude Code window on this Mac. Each one costs roughly 0.9 GB of memory (measured: the Claude processes held 909 MB with 2 desks), and they all share one copy of the code, which the capability spec flags: \"Shared working tree — concurrent agent desks can conflict.\"",
      "In the cloud each task becomes a worker: its own container, its own copy of the code, its own browser, started in seconds and gone when done (Cloud Run Jobs). There are two kinds.",
    ],
    bullets: [
      "Claude workers: Claude Code running headless (claude -p) with Daniel's subscription token (CLAUDE_CODE_OAUTH_TOKEN, the same path Anthropic supports for GitHub Actions). The extra cost is $0 on the Max plan; the limit becomes the plan's usage limits, not the Mac.",
      "Cerebras workers: gpt-oss-120b with native tool calling, $0, with measured room for 1,000 requests a minute and 720M tokens a day (CLAUDE.md Rule 33). For bulk research, extraction, sorting and first drafts at a scale no desk count could reach.",
    ],
    after:
      "The result: \"3 desks\" becomes \"as many workers as the task has pieces.\" A five-part request stops running one piece after another. The wait becomes the time of the slowest piece.",
  },
  {
    id: "B",
    t: "The browser fleet, scaled",
    lead: "Built today at 20.",
    body: [
      "Next: request a quota increase (20 to 100 CPUs) or deploy the same service to 2 or 3 more regions. Every research, scraping, competitor, listing, vendor-portal and QA walk runs 20 to 100 wide instead of 3.",
    ],
  },
  {
    id: "C",
    t: "Heavy work on demand",
    lead: "Jobs that are slow or impossible on 8 GB become minutes in the cloud, run in parallel pieces.",
    bullets: [
      "Re-read the full memory (28,662 files at the last audit) and the knowledge index in one parallel pass, instead of a long crawl on the Mac that competes with Daniel's work.",
      "Mine transcripts, video and documents; render Dabney video with ffmpeg; walk every LOVELEEDAY page at desktop and phone widths to check it.",
      "Nightly refresh of the business-facts layer (the ontology) and the test suites.",
    ],
  },
  {
    id: "D",
    t: "Restart learning, with a gate",
    lead: "Training has been dormant since 2026-05-29 (spec section 10 and section 13) because a Mac with 8 GB cannot train.",
    body: [
      "Cloud Run GPU jobs (NVIDIA L4) bill per second at about $0.67 an hour, so a two-hour fine-tune is about $1.35.",
      "The spec is explicit that there is no promotion gate today, so the order is fixed: build the gate first (new weights must beat the current ones on the held-back tests before they are used), then train. Until the gate exists, \"Arthur is improving its weights\" stays a false claim.",
    ],
  },
  {
    id: "E",
    t: "An always-on brain",
    lead: "Work keeps running while the Mac sleeps, restarts or updates.",
    body: [
      "Non-Essex scheduled work moves to a cloud dispatcher: one Cloud Scheduler trigger every minute (3 jobs per billing account are free) reads a queue and launches the right Cloud Run Job.",
      "Every job must write an observed proof string. That attacks the spec's number one systemic defect directly: \"silent failure under green status.\"",
      "launchd keeps only Essex and the few jobs that genuinely need this Mac (saved logins such as Consumers Energy and Resy).",
    ],
  },
];

const devSteps = [
  "Gets one task.",
  "Copies the code into its own container.",
  "Installs what the project needs.",
  "Writes the change.",
  "Runs the build and the tests.",
  "Starts the app and checks it in a cloud browser at desktop and phone widths.",
  "Pushes a branch and opens a pull request with the screenshots attached as proof.",
];

const devWays = [
  {
    n: "1",
    t: "Our own Cloud Run dev workers",
    tag: "Recommended",
    d: "The same runtime as the browser fleet that is already built and measured. We control the machine size, the secrets and the proof every change must carry.",
    rec: true,
  },
  {
    n: "2",
    t: "Anthropic's hosted Claude Code cloud sessions",
    tag: "Not yet tested here",
    d: "Available at claude.ai/code. It exists, but it has not been tested on this account, so nothing on this page depends on it.",
  },
  {
    n: "3",
    t: "GitHub Actions on every push",
    tag: "2,000 free minutes a month",
    d: "Runs the tests and the build each time code is pushed. 2,000 free minutes a month on private repos.",
  },
];

const devStays = [
  "Essex code and data. Essex files are blocked from GitHub and stay on this Mac.",
  "Anything that drives Daniel's signed-in Chrome or Mac apps.",
];

const speed = [
  { t: "Big asks fan out.", d: "\"Review every Dabney artist's history, build the graphics, and research ten venues\" becomes about 10 to 20 workers in parallel instead of hours across 3 desks." },
  { t: "The Mac stays fast for Daniel.", d: "No swap storms, no hijacked Chrome, and Essex work never competes with background jobs." },
  { t: "No more \"close a desk first.\"", d: "The desk cap only governs the Mac, not cloud work." },
  { t: "Night shift becomes real.", d: "Queued work runs overnight in the cloud and is waiting, with proof, in the morning." },
];

const product = [
  { t: "Tenant safety (growth plan item 1)", d: "Every client's work runs in its own isolated worker with its own credentials. Nothing shares a machine or a folder." },
  { t: "Scale without buying hardware", d: "A school network, a charter management organization or a multi-site business gets more workers, not a bigger server. Cost follows usage." },
  { t: "A credible answer to \"where does our data run?\"", d: "Isolated per client on Google Cloud, region chosen, budget-capped." },
  { t: "Dabney is the proof case", d: "It runs on this first." },
];

const free = [
  ["180,000", "vCPU-seconds a month", "Cloud Run services"],
  ["360,000", "GiB-seconds a month", "Cloud Run services"],
  ["240,000", "vCPU-seconds a month", "Cloud Run jobs"],
  ["5 GB", "of storage", "Cloud Storage"],
  ["3 jobs", "per billing account", "Cloud Scheduler"],
];

const levels = [
  { name: "Free", price: "$0", d: "Browser fleet plus light jobs: about 50 browser-hours a month at $0." },
  { name: "Working (recommended)", price: "$15 to $35 a month", d: "10 workers for 1 to 2 hours a day plus nightly jobs. Claude workers cost $0 extra on the Max plan.", rec: true },
  { name: "Burst days", price: "Dollars per day", d: "Big research or QA pushes, capped by the budget alert." },
];

const guardrails = [
  { t: "Essex never leaves this Mac.", d: "Blocked in every cloud browser in code, and the worker image carries no Essex credentials." },
  { t: "Bounded autonomy by blast radius stays.", d: "Cloud workers run auto work only. Anything touching money, sending, or legal judgment still waits for Daniel." },
  { t: "Secrets live in Google Secret Manager.", d: "Never in images or logs." },
  { t: "Every cloud job writes a proof string.", d: "No proof means failed, never \"green.\"" },
  { t: "Budget alerts are hard tripwires.", d: "Not suggestions." },
];

const limits = [
  "Claude workers are bounded by the Max plan's usage limits. More workers burn the same allowance faster, so Cerebras workers carry the bulk.",
  "Sites that need Daniel's own signed-in Chrome (Toast writes, LinkedIn) stay on the Mac by design.",
  "Cloud quota starts at 20 CPUs per region until Google approves more. That is a request, not hardware.",
  "Arthur still depends on the Claude Code harness for its tool loop (spec section 13). The cloud multiplies it; it does not replace it.",
];

const build = [
  { w: "Week 1", t: "Worker runtime", d: "One container image (Arthur repo, Claude Code, Cerebras client, Playwright). The command arthur-run \"<task>\" --workers N fans a task out, and results and proof strings come back to Supabase and Storage, with secrets in Secret Manager. The same image is the cloud dev worker: it copies the code, builds, tests and screenshots a change. File the quota increase." },
  { w: "Week 2", t: "Desks to workers", d: "Research, build and QA work runs as workers, including coding work: each feature is built in a cloud dev worker and arrives as a pull request that is already built, tested and screenshotted. The Mac keeps the conversation and Essex." },
  { w: "Week 3", t: "Always-on dispatcher", d: "Move non-Essex scheduled jobs, starting with the ones that have failed silently before." },
  { w: "Week 4", t: "Learning", d: "The promotion gate first, then the first GPU fine-tune, plus the full memory re-read." },
  { w: "Then", t: "LOVELEEDAY tenant isolation", d: "On the same runtime, Dabney first." },
];

const decisions = [
  { t: "Monthly cap: approved", d: "Done 2026-10-07. The budget guard is now $25 a month with alerts at 50, 90 and 100%. Revisit after the first full month of real bills." },
  { t: "Quota increase: approved, filed", d: "Filed with Google 2026-10-07 for 100 CPUs and 200 GB in us-central1. Waiting on Google; still 20 CPUs until granted." },
  { t: "Optional: a free always-on server", d: "An Oracle Always Free server as a $0 always-on base. It needs Daniel's sign-up." },
];

const sources = [
  "cloud.google.com/run/pricing: Cloud Run free tier, vCPU-second rate and L4 GPU rate (fetched 2026-10-07).",
  "Google Cloud Scheduler pricing: 3 free jobs per billing account.",
  "Cloud Storage always-free tier.",
  "Claude Code headless and Docker auth docs (CLAUDE_CODE_OAUTH_TOKEN).",
  "GitHub Actions: 2,000 free minutes a month on private repos. Anthropic hosted Claude Code sessions: claude.ai/code (not yet tested on this account).",
  "CAPABILITY_SPEC.md (~/.arthur-brain/CAPABILITY_SPEC.md), section 10, section 13 and section 15.",
  "Measurements taken on this Mac and on the browser fleet on 2026-10-07.",
];

function Chip({ children, tone = "plain" }: { children: React.ReactNode; tone?: "plain" | "blue" | "dark" }) {
  const cls =
    tone === "blue"
      ? "border-[#bcd3ee] bg-[#f0f5fc] text-[#2d5f99]"
      : tone === "dark"
        ? "border-[#1d1d1f] bg-[#1d1d1f] text-white"
        : "border-[#dcdfe6] bg-white text-[#4a4d55]";
  return <span className={`rounded-full border px-3 py-1.5 text-[12px] font-medium leading-[1.2] ${cls}`}>{children}</span>;
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 40" aria-hidden="true" className="mx-auto h-8 w-5 text-[#3778bc]">
      <path d="M12 0v32M4 26l8 10 8-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BeforeAfter() {
  return (
    <div className="mt-12 grid items-start gap-5 md:grid-cols-2" role="img" aria-label="Before: one laptop does everything. After: the Mac is the front desk and cloud workers fan out.">
      <div className="rounded-2xl border border-[#e4e5e9] bg-white p-6">
        <Eyebrow>Today</Eyebrow>
        <h3 className="mt-2 text-[20px] font-medium tracking-[-0.02em] text-[#1d1d1f]">One laptop is the engine</h3>
        <div className="mt-5 rounded-xl border-2 border-dashed border-[#c9ccd3] bg-[#f5f7fa] p-4">
          <div className="text-[13px] font-semibold text-[#1d1d1f]">This Mac: 8 GB, 8 cores</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip>Conversation</Chip>
            <Chip>Daniel&apos;s Chrome</Chip>
            <Chip>Essex</Chip>
            <Chip>Desk 1</Chip>
            <Chip>Desk 2</Chip>
            <Chip>Desk 3</Chip>
            <Chip>About 3 browsers</Chip>
            <Chip>172 scheduled jobs</Chip>
            <Chip>Embedding model</Chip>
          </div>
        </div>
        <p className="mt-4 text-[14px] leading-[1.65] text-[#5b606a]">
          Everything shares one machine and one code folder. Jobs stop when the Mac sleeps. No room to train a model.
        </p>
      </div>

      <div className="rounded-2xl border-2 border-[#3778bc] bg-[#f0f5fc] p-6">
        <Eyebrow>With Google Cloud</Eyebrow>
        <h3 className="mt-2 text-[20px] font-medium tracking-[-0.02em] text-[#1d1d1f]">The Mac is the front desk</h3>
        <div className="mt-5 rounded-xl border border-[#bcd3ee] bg-white p-4">
          <div className="text-[13px] font-semibold text-[#1d1d1f]">This Mac keeps</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip tone="dark">Conversation</Chip>
            <Chip tone="dark">Daniel&apos;s Chrome</Chip>
            <Chip tone="dark">Everything Essex</Chip>
          </div>
        </div>
        <Arrow />
        <div className="rounded-xl border border-[#bcd3ee] bg-white p-4">
          <div className="text-[13px] font-semibold text-[#1d1d1f]">Cloud workers, as many as the task has pieces</div>
          <div className="mt-3 grid grid-cols-5 gap-1.5" aria-hidden="true">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} className="flex h-8 items-center justify-center rounded-md bg-[#3778bc] text-[10px] font-semibold text-white">
                {i + 1}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip tone="blue">Claude workers</Chip>
            <Chip tone="blue">Cerebras workers</Chip>
            <Chip tone="blue">20 browsers</Chip>
            <Chip tone="blue">Dev workers</Chip>
            <Chip tone="blue">GPU training job</Chip>
            <Chip tone="blue">Nightly dispatcher</Chip>
          </div>
        </div>
        <p className="mt-4 text-[14px] leading-[1.65] text-[#5b606a]">
          Each task gets its own container, code copy and browser. Work continues while the Mac sleeps.
        </p>
      </div>
    </div>
  );
}

export default function ArthurCloudProposal() {
  return (
    <div className="ll-os bg-white">
      {/* Bottom line */}
      <section className="mx-auto max-w-[1180px] px-6 pb-20 pt-16 sm:pt-24">
        <Eyebrow>Proposal · Review of 2026-10-07</Eyebrow>
        <Two size="h1" a="Arthur in the cloud." b="What Google Cloud unlocks." />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="max-w-[40rem] text-[17px] leading-[1.7] text-[#6c7481]">
            <p>
              Today Arthur is one laptop. Measured on 2026-10-07 on this Mac: 8 GB of memory, 8 cores, swap at 67% with only 2 working desks
              open, a hard cap of 3 desks (desk-cap.mjs) because 8 desks once pushed swap to 96% and every terminal crawled for hours, 172
              scheduled jobs loaded (237 at the 2026-09-21 audit), and one local model resident (the embedding model).
            </p>
            <p className="mt-5">
              Every limit Daniel feels traces to that one machine: only 3 desks at once, about 3 browsers, no model training, jobs that stop
              when the Mac sleeps, desks colliding in one shared code folder, and other desks&apos; browsers hijacking his Chrome. The capability
              spec says it plainly: &quot;Hardware ceiling — restricts local model size, local parallelism, and training — physical constraint
              on 8 GB host&quot; (CAPABILITY_SPEC section 13).
            </p>
            <p className="mt-5 font-medium text-[#1d1d1f]">
              Google Cloud changes the Mac&apos;s job. It stops being the engine and becomes the front desk. The conversation, Daniel&apos;s own
              Chrome and everything Essex stay here. The heavy and parallel work runs in the cloud, where the limit is a budget number Daniel
              sets, not memory.
            </p>
          </div>
          <dl className="grid self-start gap-px overflow-hidden rounded-2xl border border-[#e4e5e9] bg-[#e4e5e9] text-[14px]">
            {laptop.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-3 bg-white px-5 py-4">
                <dt className="text-[17px] font-medium tracking-[-0.02em] text-[#1d1d1f]">{k}</dt>
                <dd className="leading-[1.5] text-[#5b606a]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <BeforeAfter />
      </section>

      {/* Already proven */}
      <section className="border-y border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-16">
          <Eyebrow>Already proven today · 2026-10-07</Eyebrow>
          <h2 className="mt-4 max-w-[40rem] text-[clamp(1.6rem,3.4vw,2.2rem)] font-medium leading-[1.12] tracking-[-0.04em] text-[#1d1d1f]">
            Not a plan. Built and measured.
          </h2>
          <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-8 gap-y-8">
            {proven.map((s) => (
              <div key={s.k}>
                <div className="text-[clamp(1.8rem,3.4vw,2.4rem)] font-medium tracking-[-0.04em] text-[#1d1d1f]">{s.k}</div>
                <div className="mt-1 text-[14px] leading-[1.55] text-[#4a4d55]">{s.label}</div>
                <div className="mt-1 text-[12px] leading-[1.5] text-[#8c8e95]">{s.src}</div>
              </div>
            ))}
          </div>
          <div className="mt-12 grid gap-6 border-t border-[#dcdfe6] pt-10 lg:grid-cols-3">
            <div>
              <h3 className="text-[17px] font-medium text-[#1d1d1f]">Five scheduled jobs moved the same day</h3>
              <ul className="mt-3 grid gap-1.5 text-[14px] leading-[1.6] text-[#5b606a]">
                {movedJobs.map((j) => (
                  <li key={j} className="grid grid-cols-[1rem_1fr]"><span className="text-[#3778bc]">·</span><span>{j}</span></li>
                ))}
              </ul>
              <p className="mt-3 text-[14px] leading-[1.65] text-[#5b606a]">
                The two graphics jobs used to launch the real Chrome app, which is what hijacked Daniel&apos;s Chrome for other desks.
              </p>
            </div>
            <div>
              <h3 className="text-[17px] font-medium text-[#1d1d1f]">A budget guard is on</h3>
              <p className="mt-3 text-[14px] leading-[1.65] text-[#5b606a]">
                A $5 alert at 50, 90 and 100% on the billing account &quot;My Billing Account 1.&quot;
              </p>
            </div>
            <div>
              <h3 className="text-[17px] font-medium text-[#1d1d1f]">The ceiling was hit and named</h3>
              <p className="mt-3 text-[14px] leading-[1.65] text-[#5b606a]">
                A new Google project gets 20 CPUs per region. That is a quota, raised by request or by adding regions. It is not hardware.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Five moves */}
      <section id="moves" className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow>The five moves</Eyebrow>
            <Two a="What actually makes Arthur" b="bigger and faster." />
          </div>
          <Lede>Move A is the biggest lever. B to E build on it.</Lede>
        </div>
        <div className="mt-12 grid gap-5">
          {moves.map((m) => (
            <article key={m.id} className="grid gap-5 rounded-2xl border border-[#e4e5e9] bg-white p-6 md:grid-cols-[4rem_1fr] md:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d1d1f] text-[18px] font-medium text-white">{m.id}</div>
              <div>
                <h3 className="text-[22px] font-medium tracking-[-0.03em] text-[#1d1d1f]">{m.t}</h3>
                <p className="mt-2 max-w-[44rem] text-[16px] font-medium leading-[1.55] text-[#3778bc]">{m.lead}</p>
                {m.body?.map((p) => (
                  <p key={p.slice(0, 24)} className="mt-3 max-w-[44rem] text-[15px] leading-[1.7] text-[#5b606a]">{p}</p>
                ))}
                {m.bullets && (
                  <ul className="mt-4 grid max-w-[44rem] gap-3 text-[15px] leading-[1.7] text-[#5b606a]">
                    {m.bullets.map((b) => (
                      <li key={b.slice(0, 24)} className="grid grid-cols-[1.25rem_1fr]"><span className="text-[#3778bc]">·</span><span>{b}</span></li>
                    ))}
                  </ul>
                )}
                {m.after && <p className="mt-4 max-w-[44rem] text-[15px] font-medium leading-[1.7] text-[#1d1d1f]">{m.after}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Software development in the cloud */}
      <section id="dev" className="border-y border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>Software development in the cloud</Eyebrow>
              <Two a="Can the coding move too?" b="Yes." />
            </div>
            <Lede>
              Coding work moves to cloud dev workers. Each change arrives already built, tested and screenshotted.
            </Lede>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-[#e4e5e9] bg-white p-6 md:p-8">
              <h3 className="text-[19px] font-medium tracking-[-0.02em] text-[#1d1d1f]">What a dev worker does</h3>
              <ol className="mt-5 grid gap-3">
                {devSteps.map((s, i) => (
                  <li key={s} className="grid grid-cols-[2rem_1fr] items-baseline gap-2 text-[15px] leading-[1.6] text-[#5b606a]">
                    <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border border-[#e4e5e9] bg-white p-6 md:p-8">
              <h3 className="text-[19px] font-medium tracking-[-0.02em] text-[#1d1d1f]">Why it matters</h3>
              <p className="mt-4 text-[15px] leading-[1.7] text-[#5b606a]">
                Builds and tests are what push this 8 GB Mac&apos;s swap past 60%.
              </p>
              <p className="mt-3 text-[15px] leading-[1.7] text-[#5b606a]">
                In the cloud, ten features can be built side by side, each in its own copy of the code. No shared-folder collisions, no desk
                cap, and bigger machines than this one.
              </p>
              <p className="mt-3 text-[15px] font-medium leading-[1.7] text-[#1d1d1f]">
                Every change arrives already built, tested and screenshotted.
              </p>
            </div>
          </div>

          <h3 className="mt-14 text-[19px] font-medium tracking-[-0.02em] text-[#1d1d1f]">Three ways to do it</h3>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {devWays.map((w) => (
              <article key={w.n} className={`rounded-2xl p-6 ${w.rec ? "border-2 border-[#3778bc] bg-[#f0f5fc]" : "border border-[#e4e5e9] bg-white"}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13px] tabular-nums text-[#3778bc]">{w.n}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#777980]">{w.tag}</span>
                </div>
                <h4 className="mt-3 text-[18px] font-medium leading-[1.35] text-[#1d1d1f]">{w.t}</h4>
                <p className="mt-2 text-[14px] leading-[1.65] text-[#5b606a]">{w.d}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-[#dcdfe6] bg-white p-6 md:p-8">
            <h3 className="text-[19px] font-medium tracking-[-0.02em] text-[#1d1d1f]">What stays on this Mac</h3>
            <ul className="mt-4 grid gap-3 text-[15px] leading-[1.7] text-[#5b606a]">
              {devStays.map((s) => (
                <li key={s.slice(0, 24)} className="grid grid-cols-[1.25rem_1fr]"><span className="text-[#3778bc]">·</span><span>{s}</span></li>
              ))}
            </ul>
            <p className="mt-4 text-[15px] leading-[1.7] text-[#5b606a]">
              Secrets move to Google Secret Manager.
            </p>
          </div>
        </div>
      </section>

      {/* Speed */}
      <section>
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>What it means for speed</Eyebrow>
              <Two a="What Daniel notices" b="day to day." />
            </div>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {speed.map((s) => (
              <article key={s.t} className="rounded-2xl border border-[#e4e5e9] bg-white p-6">
                <h3 className="text-[17px] font-medium leading-[1.4] text-[#1d1d1f]">{s.t}</h3>
                <p className="mt-2 text-[14px] leading-[1.65] text-[#5b606a]">{s.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* LOVELEEDAY */}
      <section className="bg-[#111217] text-white">
        <div className="mx-auto grid max-w-[1180px] gap-12 px-6 py-24 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Eyebrow dark>What it means for LOVELEEDAY</Eyebrow>
            <Two dark a="The same runtime is the" b="product's backbone." />
            <Lede dark>Not just Arthur&apos;s. The same setup that makes Arthur faster is what a client&apos;s work would run on.</Lede>
          </div>
          <ol className="grid gap-7">
            {product.map((m, i) => (
              <li key={m.t} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="text-[13px] tabular-nums text-[#8fb6de]">{i + 1}</span>
                <span>
                  <span className="block text-[17px] text-white">{m.t}</span>
                  <span className="mt-1 block text-[14px] leading-[1.7] text-[#a3a8b2]">{m.d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Cost */}
      <section id="cost" className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow>Cost · rates fetched 2026-10-07</Eyebrow>
            <Two a="Near zero" b="by design." />
          </div>
          <Lede>
            Past the free amounts the rate is about $0.000018 per vCPU-second (about $0.065 per CPU-hour). An L4 GPU is about $0.67 an hour.
          </Lede>
        </div>

        <h3 className="mt-12 text-[17px] font-medium text-[#1d1d1f]">Free every month</h3>
        <p className="mt-1 text-[13px] text-[#8c8e95]">Source: cloud.google.com/run/pricing, fetched 2026-10-07.</p>
        <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] gap-px overflow-hidden rounded-2xl border border-[#e4e5e9] bg-[#e4e5e9]">
          {free.map(([k, u, w]) => (
            <div key={w + k} className="bg-white p-5">
              <div className="text-[26px] font-medium tracking-[-0.03em] text-[#1d1d1f]">{k}</div>
              <div className="mt-1 text-[14px] text-[#4a4d55]">{u}</div>
              <div className="mt-1 text-[12px] text-[#8c8e95]">{w}</div>
            </div>
          ))}
        </div>

        <h3 className="mt-12 text-[17px] font-medium text-[#1d1d1f]">Three levels</h3>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {levels.map((l) => (
            <article key={l.name} className={`rounded-2xl p-6 ${l.rec ? "border-2 border-[#3778bc] bg-[#f0f5fc]" : "border border-[#e4e5e9] bg-white"}`}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#777980]">{l.name}</div>
              <div className="mt-3 text-[26px] font-medium leading-[1.15] tracking-[-0.03em] text-[#1d1d1f]">{l.price}</div>
              <p className="mt-3 text-[14px] leading-[1.65] text-[#5b606a]">{l.d}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 max-w-[44rem] text-[16px] font-medium leading-[1.65] text-[#1d1d1f]">
          Approved 2026-10-07: the budget guard is $25 a month with alerts at 50, 90 and 100%. Revisit after the first full month of real
          bills.
        </p>
      </section>

      {/* Guardrails */}
      <section className="border-y border-[#e4e5e9] bg-[#f5f5f7]">
        <div className="mx-auto grid max-w-[1180px] items-start gap-12 px-6 py-24 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow>Guardrails</Eyebrow>
            <Two a="The same rules," b="enforced in the cloud too." />
            <Lede>These principles do not change. They are written into the cloud setup as well.</Lede>
          </div>
          <ol className="grid gap-6">
            {guardrails.map((g, i) => (
              <li key={g.t} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
                <span>
                  <span className="block text-[16px] font-medium text-[#1d1d1f]">{g.t}</span>
                  <span className="mt-1 block text-[14px] leading-[1.65] text-[#6c7481]">{g.d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Honest limits */}
      <section className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow>Honest limits</Eyebrow>
            <Two a="What this does not" b="change." />
          </div>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {limits.map((l) => (
            <li key={l.slice(0, 24)} className="rounded-2xl border border-[#e4e5e9] bg-white p-6 text-[15px] leading-[1.7] text-[#5b606a]">{l}</li>
          ))}
        </ul>
      </section>

      {/* Build order */}
      <section id="build" className="bg-[#111217] text-white">
        <div className="mx-auto max-w-[1180px] px-6 py-24">
          <Eyebrow dark>Build order</Eyebrow>
          <Two dark a="Four weeks," b="then the product." />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#2a2d36] bg-[#2a2d36] md:grid-cols-5">
            {build.map((b) => (
              <li key={b.w} className="bg-[#111217] p-6">
                <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8fb6de]">{b.w}</div>
                <div className="mt-2 text-[17px] text-white">{b.t}</div>
                <p className="mt-2 text-[14px] leading-[1.7] text-[#a3a8b2]">{b.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Decisions */}
      <section id="decisions" className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow>Decisions for Daniel</Eyebrow>
            <Two a="Two approved," b="one still yours." />
          </div>
        </div>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {decisions.map((d, i) => (
            <li key={d.t} className="rounded-2xl border border-[#e4e5e9] bg-white p-6">
              <span className="text-[13px] tabular-nums text-[#3778bc]">{i + 1}</span>
              <h3 className="mt-1 text-[18px] font-medium text-[#1d1d1f]">{d.t}</h3>
              <p className="mt-2 text-[14px] leading-[1.65] text-[#5b606a]">{d.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Sources */}
      <section className="border-t border-[#e4e5e9]">
        <div className="mx-auto max-w-[1180px] px-6 py-12">
          <Eyebrow>Sources</Eyebrow>
          <ul className="mt-5 grid max-w-[72ch] gap-2 text-[13px] leading-[1.6] text-[#6c7481]">
            {sources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
