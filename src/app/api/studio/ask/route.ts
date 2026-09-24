import { NextResponse, after } from "next/server";
import { Resend } from "resend";
import { getStudio, layers, measured, questions } from "@/content/studio/elemental";
import { cleanModelText } from "@/lib/model-text";
import { recordAsk } from "@/lib/visits";

export const dynamic = "force-dynamic";

/* "Ask Arthur" on Elemental Media's proposal page. It answers ONLY from what the proposal
   already shows: the spec spots, the rebuild, what we measured on their site, and what Arthur
   would do for a production company. Their own jobs, invoices and footage come after. */

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
  lines.push("READER: the team at Elemental Media, a film and photography studio in Kalamazoo, Michigan. Crews from a single photographer to about twenty. Clients include Bell's Brewery, Landscape Forms, Kalamazoo Airport, Burdick's, Stedman USA, Factory Coffee, Ford, Stryker, Shinola, Kalamazoo College, Pactiv Evergreen and USA Hockey.");
  lines.push("WHAT THE PROPOSAL CONTAINS: (1) a :30 and a :15 spec commercial for Elemental, cut only from their own public films, one 2.39:1 frame throughout, music and voice-over finished, built on four elements: light, story, craft, motion. (2) Elemental 2.0, a rebuilt homepage: their real logo, every film an element tile (Bl, Lf, Ka, Bu, St, Fc) that plays on hover, a 2 MB hero loop, a globe of routes from Kalamazoo showing a small team serving a big world, client logos grey until hover, a real mobile menu. (3) One shoot, every channel: the same footage cut to 2.39, 9:16, 4:5, 1:1 and stills. (4) Voice-over samples in several voices, and short jingles, as spec samples. (5) Arthur as an intelligence layer.");
  lines.push("MEASURED ON weareelementalmedia.com (September 23, 2026):");
  for (const m of measured) lines.push(`- ${m.k}: ${m.t} ${m.d} (How: ${m.how})`);
  lines.push("WHAT ARTHUR WOULD DO FOR A PRODUCTION COMPANY:");
  for (const l of layers) lines.push(`- ${l.name}: ${l.does} Result: ${l.so}`);
  lines.push("QUESTIONS ARTHUR COULD ANSWER ONCE CONNECTED (not answered yet; these are scope):");
  for (const q of questions) lines.push(`- ${q}`);
  lines.push("SECURITY: Elemental's footage and client data stay theirs; nothing is used to train models or shared with other clients; access is per person and logged.");
  lines.push("FIRST 30 DAYS: connect the footage archive and the job and invoice records, index every frame, draft bids from real past job costs, and turn one existing film into every channel's cut.");
  lines.push("NOT CONNECTED YET: Elemental's footage drives, job costs, invoices, calendar, rental inventory, releases and licences. Those join after Elemental does.");
  return lines.join("\n");
}

const SYSTEM = `You are Arthur, the intelligence behind LOVELEEDAY, answering the team at Elemental Media, a film production company, inside their proposal.
Rules:
- Answer ONLY from the CONTEXT. Never invent a figure, price, date, client or result. If the context cannot answer, say so plainly and name what Arthur would need to connect to answer it.
- Never quote prices or fees; say pricing is set together after a conversation.
- Talk like a producer to producers: concrete, about footage, crews, bids, deliverables and clients. At most 90 words. Plain sentences, no markdown, no bullet characters, no headings. Plain ASCII spaces and hyphens only.
- Be respectful of their current site and work; frame what we measured as opportunities, never as failures.
- Return ONLY a JSON object: {"head": "<one short sentence that answers>", "answer": "<the explanation>", "evidence": ["<the part of the proposal each claim came from>", ...]} with 1 to 4 evidence items.`;

const fail = (status = 502) => NextResponse.json({ error: "Arthur could not answer just now. Try again in a moment." }, { status });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token ?? "");
    const client = getStudio(token);
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
      console.error("studio ask: cerebras", res.status, (await res.text()).slice(0, 300));
      return fail();
    }
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("studio ask: no JSON in content", content.slice(0, 300));
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
      await recordAsk(request.headers, { surface: "studio", token, client: client.short, question, head: out.head }).catch((e) => console.error("ask log", e));
      try {
        if (!process.env.RESEND_API_KEY) return;
        await new Resend(process.env.RESEND_API_KEY).emails.send({
          from: "LOVELEEDAY Portal <hello@loveleedaystudios.com>",
          to: "blackmarble.m.g@gmail.com",
          subject: `${client.short} asked Arthur: ${question.slice(0, 70)}`,
          text: `${client.preparedFor} asked on the proposal page:\n\n${question}\n\nArthur answered:\n${out.head}\n${out.answer}\n\nEvidence:\n- ${out.evidence.join("\n- ")}\n\nhttps://loveleedaystudios.com/p/studio/${client.token}`,
        });
      } catch (e) {
        console.error("studio ask: notify", e);
      }
    });

    return NextResponse.json(out);
  } catch (e) {
    console.error("studio ask", e);
    return fail(500);
  }
}
