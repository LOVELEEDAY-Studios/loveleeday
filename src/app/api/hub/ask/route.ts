import { NextResponse, after } from "next/server";
import { Resend } from "resend";
import { findings, getHub, layers, nextQuestions, proof, strengths, themes } from "@/content/hub/startupzoo";
import { cleanModelText } from "@/lib/model-text";

export const dynamic = "force-dynamic";

/* "Ask Arthur" on Startup Zoo's proposal. It answers ONLY from what the page shows: what we read on
   startupzoo.org and the public record, and what Arthur would do for an entrepreneurship hub. */

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
  lines.push("READER: Carl Brown, Executive Director of Startup Zoo, a 501(c)(3) entrepreneurship hub at 229 E Michigan Ave, Suite 335, Kalamazoo, Michigan. Cofounded by Ryan Goins and Carl Brown. Team: Jasmine Childress (Community Manager), Adam Muncy (Entrepreneur in Residence), Christopher Cayton (Community Engagement Specialist).");
  lines.push("PROGRAMS: Pitch Night every other month, five community-voted Kalamazoo businesses pitch 3 judges for $10,000 equity-free; next on November 13. Residency: 12 months, full-time, in-house, no cost, introductions to at least 50 investors, fundraising prep up to $1M. Space rental $150 an hour. Membership for Kalamazoo County residents. 2026 Southwest Michigan Entrepreneurship Summit, September 21-22 at the Kalamazoo Institute of Arts, keynote Jewel Burks Solomon of Collab Capital, with the PitchMI AI and Software semifinal for $250,000. A new space is being built for Q4.");
  lines.push("RELATIONSHIP: Daniel May of LOVELEEDAY is a Startup Zoo member: his bar Dabney & Co is a 2024-2025 resident, and Dabney runs on Arthur today.");
  lines.push("STRENGTHS:");
  for (const s of strengths) lines.push(`- ${s.k}: ${s.label} (${s.src})`);
  lines.push("FINDINGS (verified = read from the source; ask = only Startup Zoo can confirm):");
  findings.forEach((f, i) => lines.push(`${i + 1}. [${themes[f.theme].name}; ${f.status}] ${f.title} ${f.detail} Source: ${f.src.label}. Arthur part: ${f.catches}.`));
  lines.push("ARTHUR PARTS:");
  for (const l of layers) lines.push(`- ${l.name}: ${l.does} Would have caught: ${l.would}`);
  lines.push("WHAT ARTHUR ALREADY DOES FOR DABNEY, A RESIDENT:");
  for (const p of proof) lines.push(`- ${p.k}: ${p.d}`);
  lines.push("QUESTIONS ARTHUR COULD ANSWER ONCE CONNECTED (scope, not answered yet):");
  for (const q of nextQuestions) lines.push(`- ${q.q} (joins: ${q.joins})`);
  lines.push("FIRST 30 DAYS: fix the site findings, write the Summit recap, pull every applicant, pitch, resident and alumnus from the Google Forms, Eventbrite, Luma and HubSpot into one record, and produce the first impact report with sources.");
  lines.push("NOT CONNECTED YET: Startup Zoo's HubSpot, forms, Eventbrite, Luma, finances, sponsor agreements and residents' metrics.");
  return lines.join("\n");
}

const SYSTEM = `You are Arthur, the intelligence behind LOVELEEDAY, answering Carl Brown of Startup Zoo inside a proposal built from Startup Zoo's public site and records.
Rules:
- Answer ONLY from the CONTEXT. Never invent a figure, date, name, grant or result. If the context cannot answer, say so and name what Arthur would need to connect to.
- Never quote prices or fees; say pricing is set together after a conversation.
- Warm and direct, one member of the community to another. At most 90 words. Plain sentences, no markdown, no bullet characters, no headings. Plain ASCII spaces and hyphens only.
- Findings marked "ask" are unconfirmed: word them as worth confirming, never as failures.
- Return ONLY a JSON object: {"head": "<one short sentence that answers>", "answer": "<the explanation>", "evidence": ["<the finding or source each claim came from, in plain words>", ...]} with 1 to 4 evidence items.`;

const fail = (status = 502) => NextResponse.json({ error: "Arthur could not answer just now. Try again in a moment." }, { status });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token ?? "");
    const client = getHub(token);
    if (!client) return NextResponse.json({ error: "Unknown link" }, { status: 404 });

    const question = String(body.question ?? "").trim().slice(0, 400);
    if (question.length < 4) return NextResponse.json({ error: "Ask a question" }, { status: 400 });

    const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "anon";
    if (limited(`ip:${ip}`, 15, 10 * 60_000) || limited(`tok:${token}`, 150, 24 * 3600_000)) {
      return NextResponse.json({ error: "That is a lot of questions for one proposal. Give it a few minutes." }, { status: 429 });
    }

    const key = process.env.CEREBRAS_API_KEY;
    if (!key) return NextResponse.json({ error: "Arthur is not configured" }, { status: 503 });

    const res = await fetch(API, {
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
      console.error("hub ask: cerebras", res.status, (await res.text()).slice(0, 300));
      return fail();
    }
    const content: string = (await res.json())?.choices?.[0]?.message?.content ?? "";
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("hub ask: no JSON in content", content.slice(0, 300));
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
      try {
        if (!process.env.RESEND_API_KEY) return;
        await new Resend(process.env.RESEND_API_KEY).emails.send({
          from: "LOVELEEDAY Portal <hello@loveleedaystudios.com>",
          to: "blackmarble.m.g@gmail.com",
          subject: `${client.short} asked Arthur: ${question.slice(0, 70)}`,
          text: `${client.preparedFor} (${client.short}) asked on the proposal page:\n\n${question}\n\nArthur answered:\n${out.head}\n${out.answer}\n\nEvidence:\n- ${out.evidence.join("\n- ")}\n\nhttps://loveleedaystudios.com/p/hub/${client.token}`,
        });
      } catch (e) {
        console.error("hub ask: notify", e);
      }
    });

    return NextResponse.json(out);
  } catch (e) {
    console.error("hub ask", e);
    return fail(500);
  }
}
