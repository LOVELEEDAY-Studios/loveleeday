import { NextResponse, after } from "next/server";
import { Resend } from "resend";
import { getComplianceSchool, requirements } from "@/content/compliance";
import { gcPublic } from "@/content/compliance/gc-profile";
import { cleanModelText } from "@/lib/model-text";

export const dynamic = "force-dynamic";

/* "Ask Arthur" on a prospect's pitch page. It answers ONLY from what that page
   already shows them: their school's public record, the published DC compliance
   calendars, and the five-year plan on their screen. Nothing private, nothing
   from Arthur's own memory, no other client. The private version, over their own
   systems, lives behind the client portal's login once they sign. */

const API = "https://api.cerebras.ai/v1/chat/completions";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// Per-instance limits. A pitch page has one reader; these stop a forwarded link from becoming a bill.
const hits = new Map<string, number[]>();
function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

interface PlanRow {
  year: string;
  grades: number;
  enrollment: number;
  revenue: number;
  expenses: number;
  net: number;
  teachers: number;
  hires: number;
  staff: number;
}

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

function context(plan: PlanRow[], assumptions: Record<string, number>, today: string) {
  const req = requirements
    .filter((r) => r.applies === "yes")
    .map((r) => `${r.due ?? "date TBD"}${r.projected ? " (projected)" : ""} | ${r.agency} | ${r.title} | file in: ${r.platform} | owner: ${r.owner}`)
    .join("\n");
  const cond = requirements.filter((r) => r.applies === "if").map((r) => `${r.title} (${r.appliesWhy})`).join("; ");
  /* The model is not trusted with arithmetic in front of a client: every derived
     figure it might need is computed here and handed to it as a fact. */
  const planTxt = plan
    .map(
      (y) =>
        `${y.year}: grades ${y.grades}, students ${y.enrollment}, revenue ${money(y.revenue)}, total spending ${money(y.expenses)}, net ${money(y.net)}, teachers ${y.teachers} (new teacher hires that year, already included in the teacher count: ${y.hires}), all staff pay and benefits ${money(y.staff)}; each extra percentage point of raise on top of the plan adds about ${money(y.staff * 0.01)} that year, which would leave net at about ${money(y.net - y.staff * 0.01)} per extra point`,
    )
    .join("\n");
  const soon = requirements
    .filter((r) => r.applies === "yes" && r.due && r.due >= today)
    .filter((r) => (Date.parse(r.due!) - Date.parse(today)) / 86_400_000 <= 14)
    .sort((x, y) => x.due!.localeCompare(y.due!));
  const soonTxt = soon.map((r) => `${r.due} | ${r.agency} | ${r.title} | ${r.platform}`).join("\n");
  const a = Object.entries(assumptions).map(([k, v]) => `${k}: ${v}`).join(", ");
  return `TODAY: ${today}

SCHOOL — Global Citizens Public Charter School, Washington DC (public record)
- Opened 2021–22, Ward 7 (4095 Minnesota Ave NE), dual-language Mandarin/Spanish immersion, PK3 upward; serving PK3–3 in 2025–26, adding grade 4 in 2026–27 and grade 5 in 2027–28.
- Charter enrollment ceiling by year: ${gcPublic.ceiling.map((c) => `${c.sy} ${c.n}`).join(", ")}.
- Enrollment 2024–25: ${gcPublic.enrollment2425}. At the Feb 2025 site review: ${gcPublic.qsr.enrolled} students, ${gcPublic.qsr.swd} with disabilities, ${gcPublic.qsr.eml} emerging multilingual learners.
- Demographics 2024–25: ${gcPublic.demographics.map((d) => `${d.label} ${d.pct}%`).join(", ")}.
- Form 990: FY25 revenue ${money(gcPublic.revenueFY25)}, expenses ${money(gcPublic.expensesFY25)}, assets ${money(gcPublic.assetsFY25)}; FY24 revenue ${money(gcPublic.revenueFY24)}.
- DC per-pupil base (UPSFF foundation): FY26 $15,070, FY27 $15,455.
- New building from 2026–27: ${gcPublic.building.ward}, ${gcPublic.building.classrooms} classrooms today, certificate of occupancy to be revised for ${gcPublic.building.occupancy}+, renovation ${gcPublic.building.renovation}, full PK3–5 by ${gcPublic.building.fullBuildout}.
- DC PCSB five-year charter review, April 27 2026: charter continued unanimously; no material violations, no fiscal mismanagement, charter goals met all three years reviewed.
- 2025 Qualitative Site Review: classroom environment 2.95/4, instruction 2.57/4; weakest area "using assessment in instruction" 1.92.

FIVE-YEAR PLAN currently on the viewer's screen (a model they are adjusting; say "on the plan you have up")
Assumptions: ${a}
${planTxt}

DUE IN THE NEXT 14 DAYS (${soon.length} items, soonest first)
${soonTxt}

COMPLIANCE — requirements that apply to this school, 2026–27 (date | agency | title | where filed | owner)
${req}

Only if triggered: ${cond}

NOT CONNECTED IN THIS PREVIEW: individual student records, attendance, staff/HR, payroll, surveys, lottery and waitlist counts, monthly financial actuals. These arrive when the school's own systems are connected after they join.`;
}

const SYSTEM = `You are Arthur, the intelligence behind LOVELEEDAY, answering a school leader's question inside a preview of their leadership dashboard.
Rules:
- Answer ONLY from the CONTEXT. Never invent a figure, date, name or policy. If the context cannot answer, say so plainly and name the system that would (for example their student information system, HR system, or My School DC), which connects after they join.
- Be direct and useful to a busy operations leader. The answer is at most 90 words. Plain sentences, no markdown, no bullet characters, no headings, no ISO dates (write "October 1"). Write dates in words with ordinary spaces and a comma, like December 31, 2026; plain ASCII spaces and hyphens only.
- For a list question, name the three to five that matter most, then say how many more there are and where to see them (the Compliance tab).
- Never calculate. Every figure you need is precomputed in the CONTEXT; quote it. If a figure you would need is not there, say what it depends on instead.
- Mention the five-year plan only when the question is about money, enrollment or staffing, and then say the figures depend on the assumptions on screen.
- Return ONLY a JSON object: {"head": "<one short sentence that answers>", "answer": "<the explanation>", "evidence": ["<the specific context line or source each claim came from>", ...]} with 1 to 4 evidence items.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token ?? "");
    const school = getComplianceSchool(token);
    if (!school) return NextResponse.json({ error: "Unknown link" }, { status: 404 });

    const question = String(body.question ?? "").trim().slice(0, 400);
    if (question.length < 4) return NextResponse.json({ error: "Ask a question" }, { status: 400 });

    const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "anon";
    if (limited(`ip:${ip}`, 15, 10 * 60_000) || limited(`tok:${token}`, 150, 24 * 3600_000)) {
      return NextResponse.json({ error: "That is a lot of questions for one preview. Give it a few minutes." }, { status: 429 });
    }

    const plan: PlanRow[] = Array.isArray(body.plan)
      ? body.plan.slice(0, 5).map((y: Record<string, unknown>) => ({
          year: String(y.year ?? "").slice(0, 8),
          grades: num(y.grades),
          enrollment: num(y.enrollment),
          revenue: num(y.revenue),
          expenses: num(y.expenses),
          net: num(y.net),
          teachers: num(y.teachers),
          hires: num(y.hires),
          staff: num(y.staff),
        }))
      : [];
    const assumptions: Record<string, number> = {};
    if (body.assumptions && typeof body.assumptions === "object") {
      for (const [k, v] of Object.entries(body.assumptions as Record<string, unknown>).slice(0, 20)) {
        if (/^[a-zA-Z]{2,30}$/.test(k) && typeof v === "number" && Number.isFinite(v)) assumptions[k] = v;
      }
    }

    const key = process.env.CEREBRAS_API_KEY;
    if (!key) return NextResponse.json({ error: "Arthur is not configured" }, { status: 503 });

    const today = new Date().toISOString().slice(0, 10);
    const res = await fetch(API, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "User-Agent": UA },
      body: JSON.stringify({
        model: "gpt-oss-120b",
        temperature: 0.2,
        // gpt-oss spends part of its budget reasoning; a small cap returns empty content.
        max_tokens: 3000,
        reasoning_effort: "medium",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `CONTEXT\n${context(plan, assumptions, today)}\n\nQUESTION\n${question}` },
        ],
      }),
    });
    if (!res.ok) {
      console.error("ask: cerebras", res.status, (await res.text()).slice(0, 300));
      return NextResponse.json({ error: "Arthur could not answer just now. Try again in a moment." }, { status: 502 });
    }
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    const match = content.match(/\{[\s\S]*\}/);
    // Empty content is a failure to raise, never an answer to show.
    if (!match) {
      console.error("ask: no JSON in content", content.slice(0, 300));
      return NextResponse.json({ error: "Arthur could not answer just now. Try again in a moment." }, { status: 502 });
    }
    const parsed = JSON.parse(match[0]);
    const out = {
      head: cleanModelText(String(parsed.head ?? "")).slice(0, 300),
      answer: cleanModelText(String(parsed.answer ?? "")).slice(0, 1500),
      evidence: Array.isArray(parsed.evidence) ? parsed.evidence.slice(0, 4).map((e: unknown) => cleanModelText(String(e)).slice(0, 300)) : [],
    };
    if (!out.head && !out.answer) {
      return NextResponse.json({ error: "Arthur could not answer just now. Try again in a moment." }, { status: 502 });
    }

    // What a prospect asks is the best signal of what they care about. Daniel sees every question.
    after(async () => {
      try {
        if (!process.env.RESEND_API_KEY) return;
        await new Resend(process.env.RESEND_API_KEY).emails.send({
          from: "LOVELEEDAY Portal <hello@loveleedaystudios.com>",
          to: "blackmarble.m.g@gmail.com",
          subject: `${school.short} asked Arthur: ${question.slice(0, 70)}`,
          text: `${school.preparedFor} (${school.short}) asked on the pitch page:\n\n${question}\n\nArthur answered:\n${out.head}\n${out.answer}\n\nEvidence:\n- ${out.evidence.join("\n- ")}\n\nhttps://loveleedaystudios.com/p/compliance/${school.token}`,
        });
      } catch (e) {
        console.error("ask: notify", e);
      }
    });

    return NextResponse.json(out);
  } catch (e) {
    console.error("ask", e);
    return NextResponse.json({ error: "Arthur could not answer just now. Try again in a moment." }, { status: 500 });
  }
}
