import { arthurFetch } from "@/lib/arthur-core";
import { NextResponse, after } from "next/server";
import { notifyAsk } from "@/lib/email";
import { askFacts, findings, getNow, layers, nextQuestions, proof, strengths, themes } from "@/content/hub/nowkalamazoo";
import { cleanModelText } from "@/lib/model-text";
import { clientIp, recordAsk } from "@/lib/visits";

export const dynamic = "force-dynamic";

/* "Ask Arthur" on the NowKalamazoo proposal. Same contract as /api/hub/ask: it answers ONLY from what
   the page shows, which is what we read on nowkalamazoo.org and the public record. */

const API = "https://api.cerebras.ai/v1/chat/completions";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const hits = new Map<string, number[]>();
function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

function context(today: Date) {
  const lines: string[] = [];
  lines.push(`TODAY: ${today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`);
  lines.push(...askFacts);
  lines.push("STRENGTHS:");
  for (const s of strengths) lines.push(`- ${s.k}: ${s.label} (${s.src})`);
  lines.push("FINDINGS (verified = read from the source; ask = only NowKalamazoo can confirm):");
  findings.forEach((f, i) => lines.push(`${i + 1}. [${themes[f.theme].name}; ${f.status}] ${f.title} ${f.detail} Source: ${f.src.label}. Arthur part: ${f.catches}.`));
  lines.push("ARTHUR PARTS:");
  for (const l of layers) lines.push(`- ${l.name}: ${l.does} Would have caught: ${l.would}`);
  lines.push("WHAT ARTHUR ALREADY DOES:");
  for (const p of proof.items) lines.push(`- ${p.k}: ${p.d}`);
  lines.push("QUESTIONS ARTHUR COULD ANSWER ONCE CONNECTED (scope, not answered yet):");
  for (const q of nextQuestions) lines.push(`- ${q.q} (joins: ${q.joins})`);
  return lines.join("\n");
}

const SYSTEM = `You are Arthur, the intelligence behind LOVELEEDAY, answering the NowKalamazoo team inside a proposal built from NowKalamazoo's public site and the public record.
Rules:
- Answer ONLY from the CONTEXT. Never invent a figure, date, name, grant or result. If the context cannot answer, say so and name what Arthur would need to connect to.
- Never quote prices or fees; say pricing is set together after a conversation.
- Arthur never writes or publishes journalism. It watches, gathers, drafts operational material and flags; reporters and editors decide and write. Say so plainly if asked.
- Warm and direct, a neighbor talking to a newsroom it respects. At most 90 words. Plain sentences, no markdown, no bullet characters, no headings. Plain ASCII spaces and hyphens only.
- Findings marked "ask" are unconfirmed: word them as worth confirming, never as failures.
- Return ONLY a JSON object: {"head": "<one short sentence that answers>", "answer": "<the explanation>", "evidence": ["<the finding or source each claim came from, in plain words>", ...]} with 1 to 4 evidence items.`;

const fail = (status = 502) => NextResponse.json({ error: "Arthur could not answer just now. Try again in a moment." }, { status });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token ?? "");
    const client = getNow(token);
    if (!client) return NextResponse.json({ error: "Unknown link" }, { status: 404 });

    const question = String(body.question ?? "").trim().slice(0, 400);
    if (question.length < 4) return NextResponse.json({ error: "Ask a question" }, { status: 400 });

    const ip = clientIp(request.headers) || "anon";
    if (limited(`ip:${ip}`, 15, 10 * 60_000) || limited(`tok:${token}`, 150, 24 * 3600_000)) {
      return NextResponse.json({ error: "That is a lot of questions for one proposal. Give it a few minutes." }, { status: 429 });
    }

    const key = process.env.CEREBRAS_API_KEY;
    if (!key) return NextResponse.json({ error: "Arthur is not configured" }, { status: 503 });

    const res = await arthurFetch(API, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "User-Agent": UA },
      body: JSON.stringify({
        model: "gpt-oss-120b",
        temperature: 0.2,
        max_tokens: 3000,
        reasoning_effort: "medium",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `CONTEXT\n${context(new Date())}\n\nQUESTION\n${question}` },
        ],
      }),
    });
    if (!res.ok) {
      console.error("nowkalamazoo ask: cerebras", res.status, (await res.text()).slice(0, 300));
      return fail();
    }
    const content: string = (await res.json())?.choices?.[0]?.message?.content ?? "";
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("nowkalamazoo ask: no JSON in content", content.slice(0, 300));
      return fail();
    }
    const parsed = JSON.parse(match[0]);
    const out = {
      head: cleanModelText(String(parsed.head ?? "")).slice(0, 300),
      answer: cleanModelText(String(parsed.answer ?? "")).slice(0, 1500),
      evidence: Array.isArray(parsed.evidence) ? parsed.evidence.slice(0, 4).map((e: unknown) => cleanModelText(String(e)).slice(0, 300)) : [],
    };
    if (!out.head && !out.answer) return fail();

    after(async () => {
      await recordAsk(request.headers, { surface: "hub", token, client: client.short, question, head: out.head }).catch((e) => console.error("ask log", e));
      try {
        await notifyAsk(client.short, question, `${client.preparedFor} (${client.short}) asked on the proposal page:\n\n${question}\n\nArthur answered:\n${out.head}\n${out.answer}\n\nEvidence:\n- ${out.evidence.join("\n- ")}`, `https://loveleedaystudios.com/p/nowkalamazoo/${client.token}`);
      } catch (e) {
        console.error("nowkalamazoo ask: notify", e);
      }
    });

    return NextResponse.json(out);
  } catch (e) {
    console.error("nowkalamazoo ask", e);
    return fail(500);
  }
}

export const maxDuration = 60;
