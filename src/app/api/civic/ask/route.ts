import { NextResponse, after } from "next/server";
import { Resend } from "resend";
import { findings, getCivic, layers, mandate, strengths, themes } from "@/content/civic/kalamazoo";

export const dynamic = "force-dynamic";

/* "Ask Arthur" on the County's pitch page. It answers ONLY from what the page already
   shows: findings read from the County's public record, each with its source. Nothing
   private and no other client. The version over the County's own systems comes after. */

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

const DAY = 86_400_000;
const daysUntil = (iso: string, today: Date) => Math.round((Date.parse(iso) - today.getTime()) / DAY);

function context(today: Date) {
  const lines: string[] = [];
  lines.push(`TODAY: ${today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`);
  lines.push("READER: Terrell Cole, Interim County Administrator/Controller of Kalamazoo County, Michigan, since August 15, 2026, for a six-month term ending about February 15, 2027. Previously Deputy County Administrator for Internal Services.");
  lines.push(`PRECOMPUTED: federal relief (SLFRF) spending deadline December 31, 2026 is ${daysUntil("2026-12-31T23:59:00-05:00", today)} days away. ADA Title II web accessibility deadline April 26, 2027 is ${daysUntil("2027-04-26T00:00:00-04:00", today)} days away. Master plan review was due June 5, 2023, ${-daysUntil("2023-06-05T00:00:00-04:00", today)} days ago.`);
  lines.push("PROCUREMENT: the County Purchasing Manual section 5.07 allows negotiation with two or three qualified vendors for professional or novel services without a public RFP, and section 9.01 lets the County Administrator approve service contracts up to $75,000 a year without Board action (Document Center 1289).");
  lines.push(`BOARD MANDATE: ${mandate.source}: "${mandate.quote}".`);
  lines.push("STRENGTHS:");
  for (const s of strengths) lines.push(`- ${s.k}: ${s.label} (${s.src})`);
  lines.push("FINDINGS (status: verified = read from the source; ask = only the County can confirm):");
  findings.forEach((f, i) => {
    lines.push(`${i + 1}. [${themes[f.theme].name}; ${f.status}] ${f.title} ${f.detail} Source: ${f.src.label}. Arthur part: ${f.catches}.`);
  });
  lines.push("ARTHUR PARTS:");
  for (const l of layers) lines.push(`- ${l.name}: ${l.does} Would have caught: ${l.would}`);
  lines.push("NOT CONNECTED (these need the County's own systems after it joins): internal finance ledgers, HR and payroll, case management, 911 CAD data, internal email, unpublished minutes or contracts.");
  return lines.join("\n");
}

const SYSTEM = `You are Arthur, the intelligence behind LOVELEEDAY, answering the County Administrator of Kalamazoo County inside a preview built from the County's public record.
Rules:
- Answer ONLY from the CONTEXT. Never invent a figure, date, name, statute or vote. If the context cannot answer, say so plainly and name the County system or office that would, which Arthur connects to after the County joins.
- Be direct and useful to a busy county executive. At most 90 words. Plain sentences, no markdown, no bullet characters, no headings, no ISO dates.
- For a list question, name the three to five that matter most, then say how many more there are.
- Never calculate. Quote the precomputed figures.
- Be respectful of County staff. A finding marked "ask" is unconfirmed: word it as "the public record does not show..." or "worth confirming...", never as missing, overdue, failed or required. Never tell the Administrator what he must do; say what the record shows and what Arthur would track.
- Return ONLY a JSON object: {"head": "<one short sentence that answers>", "answer": "<the explanation>", "evidence": ["<the specific finding or source each claim came from>", ...]} with 1 to 4 evidence items.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token ?? "");
    const client = getCivic(token);
    if (!client) return NextResponse.json({ error: "Unknown link" }, { status: 404 });

    const question = String(body.question ?? "").trim().slice(0, 400);
    if (question.length < 4) return NextResponse.json({ error: "Ask a question" }, { status: 400 });

    const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "anon";
    if (limited(`ip:${ip}`, 15, 10 * 60_000) || limited(`tok:${token}`, 150, 24 * 3600_000)) {
      return NextResponse.json({ error: "That is a lot of questions for one preview. Give it a few minutes." }, { status: 429 });
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
      console.error("civic ask: cerebras", res.status, (await res.text()).slice(0, 300));
      return NextResponse.json({ error: "Arthur could not answer just now. Try again in a moment." }, { status: 502 });
    }
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("civic ask: no JSON in content", content.slice(0, 300));
      return NextResponse.json({ error: "Arthur could not answer just now. Try again in a moment." }, { status: 502 });
    }
    const parsed = JSON.parse(match[0]);
    const out = {
      head: String(parsed.head ?? "").slice(0, 300),
      answer: String(parsed.answer ?? "").slice(0, 1500),
      evidence: Array.isArray(parsed.evidence) ? parsed.evidence.slice(0, 4).map((e: unknown) => String(e).slice(0, 300)) : [],
    };
    if (!out.head && !out.answer) {
      return NextResponse.json({ error: "Arthur could not answer just now. Try again in a moment." }, { status: 502 });
    }

    after(async () => {
      try {
        if (!process.env.RESEND_API_KEY) return;
        await new Resend(process.env.RESEND_API_KEY).emails.send({
          from: "LOVELEEDAY Portal <hello@loveleedaystudios.com>",
          to: "blackmarble.m.g@gmail.com",
          subject: `${client.short} asked Arthur: ${question.slice(0, 70)}`,
          text: `${client.preparedFor} (${client.short}) asked on the pitch page:\n\n${question}\n\nArthur answered:\n${out.head}\n${out.answer}\n\nEvidence:\n- ${out.evidence.join("\n- ")}\n\nhttps://loveleedaystudios.com/p/civic/${client.token}`,
        });
      } catch (e) {
        console.error("civic ask: notify", e);
      }
    });

    return NextResponse.json(out);
  } catch (e) {
    console.error("civic ask", e);
    return NextResponse.json({ error: "Arthur could not answer just now. Try again in a moment." }, { status: 500 });
  }
}
