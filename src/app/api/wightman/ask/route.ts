import { NextResponse, after } from "next/server";
import { Resend } from "resend";
import { getWightman } from "@/content/hub/wightman";
import intel from "@/content/hub/wightman-intel.json";
import rows from "@/content/hub/wightman-intel-rows.json";
import { cleanModelText } from "@/lib/model-text";
import { recordAsk } from "@/lib/visits";

export const dynamic = "force-dynamic";

/* "Ask Arthur" on Wightman's territory brief. It answers ONLY from what the page shows: the state
   loan lists, federal awards, Wightman's corridors and the business study, and the contract record. */

const API = "https://api.cerebras.ai/v1/chat/completions";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
type Any = any; // eslint-disable-line @typescript-eslint/no-explicit-any
const I = intel as Any;
const $m = (n: number) => (n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${Math.round(n).toLocaleString()}`);

const hits = new Map<string, number[]>();
function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

function context(today: Date, question: string) {
  const L: string[] = [];
  L.push(`TODAY: ${today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`);
  L.push("READER: Phil Doorlag, PE, Regional Director (Kalamazoo) and Principal at Wightman, an employee-owned architecture, engineering and survey firm founded in 1946 with 12 offices in Michigan, Indiana and Ohio. Wightman is the City of Kalamazoo's owner's representative on the Kalamazoo Avenue two-way conversion.");
  L.push("RELATIONSHIP: Daniel May of LOVELEEDAY owns Dabney & Co. at 344 N. Rose St, inside the Kalamazoo Avenue work zone. Dabney runs on Arthur. Phil told Daniel he carries much of the firm's contract knowledge himself, and that people across Wightman don't know which AI tools to use, have no use cases and no policy.");
  const w = I.water;
  if (w) {
    L.push(`WATER PIPELINE: ${w.count} state revolving fund projects in Wightman's counties worth ${$m(w.total)} (deduplicated across Michigan FY2026 final and FY2027 draft, Indiana SFY2026, Ohio Allen County). Engineer of record public for ${w.engineerFound}. Firms: ${w.firms.map((f: Any) => `${f.firm} ${f.count} project(s) ${$m(f.amount)}${f.moderate ? " (partly confirmed)" : ""}`).join("; ")}.`);
    L.push(`LARGEST PROJECTS: ${w.top.map((p: Any) => `${p.applicant} (${p.county}, ${p.state}) ${p.program} ${$m(p.amount)} engineer ${p.engineer ?? "not public"}`).join("; ")}.`);
  }
  const f = I.federal;
  if (f) L.push(`FEDERAL: ${f.count} direct grants to local governments in the counties since 2024-01-01 worth ${$m(f.total)}; by county ${f.byCounty.slice(0, 8).map((c: Any) => `${c.key} ${$m(c.amount)}`).join(", ")}. Plus ${f.passThrough?.count} awards worth ${$m(f.passThrough?.amount ?? 0)} routed through state agencies with the work in these counties. Kalamazoo Avenue's Reconnecting Communities grant: $4,769,258 to MDOT for the W. Kalamazoo Ave conversion.`);
  const s = I.survival;
  if (s?.pooled) {
    const P = s.pooled;
    L.push(`BUSINESS SURVIVAL on ${P.corridors.length} finished Wightman corridors (${P.corridors.join(", ")}), businesses within ${s.bufferMeters} m vs the rest of the same city, same years (Foursquare open places): before construction ${P.before.relativeRisk}x city rate (range ${P.before.ci?.join("-")}), during ${P.during.relativeRisk}x (range ${P.during.ci?.join("-")}; ${P.during.corridorClosed} closures in ${P.during.corridorPlaceYears} business-years), two years after ${P.after.relativeRisk}x (range ${P.after.ci?.join("-")}). Ranges are wide; not yet proof.`);
    L.push(`PER CORRIDOR during construction: ${s.corridors.map((c: Any) => `${c.street} ${c.city} ${c.start}-${c.end}: ${c.phases.during ? `${c.phases.during.corridor.closed} closed of ${c.phases.during.corridor.placeYears} business-years` : "n/a"}`).join("; ")}.`);
  }
  const b = I.businessesNow;
  if (b) L.push(`CORRIDORS AHEAD, places listed open within ${b.buffer} m today: ${b.corridors.filter((c: Any) => c.constructionEnd && c.constructionEnd >= "2026").map((c: Any) => `${c.street} ${c.openNow} (dining and drinking ${c.openByCategory["Dining and Drinking"] ?? 0}, retail ${c.openByCategory["Retail"] ?? 0})`).join("; ")}.`);
  const k = I.contracts;
  if (k) {
    L.push(`CONTRACT RECORD read from ${k.coverage?.filter((x: Any) => x.meetingsScanned).map((x: Any) => `${x.body.split(" — ")[0]} (${x.meetingsScanned} meetings)`).join(", ")}: ${k.contracts.length} Wightman actions. Share of wallet: ${k.share.slice(0, 10).map((x: Any) => `${x.client} ${x.firm} ${x.count} actions ${$m(x.amount)}`).join("; ")}.`);
    L.push(`WIGHTMAN LARGEST APPROVALS: ${[...k.contracts].filter((c: Any) => c.amount).sort((a: Any, z: Any) => z.amount - a.amount).slice(0, 8).map((c: Any) => `${c.date} ${c.project} ${$m(c.amount)}`).join("; ")}.`);
  }
  // Row level, so a question about one county, client or program is answered by name and not by total.
  // When the question names a county or client, only that slice goes in: the model misreads a long table far more
  // often than a short one.
  const R0 = rows as Any;
  const q = question.toLowerCase();
  const hasWord = (name: string) => new RegExp(`\\b${name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(q);
  const counties = new Set<string>([...R0.water, ...R0.federal].map((r: Any) => r.county).filter((c: string) => c && hasWord(c.split("/")[0])));
  const clients = new Set<string>(R0.contracts.map((r: Any) => r.client).filter((c: string) => hasWord(c.replace(/^(City|Village|Township|County) of /i, ""))));
  const inC = (r: Any) => !counties.size || counties.has(r.county);
  const R = { water: R0.water.filter(inC), federal: R0.federal.filter(inC), contracts: R0.contracts.filter((r: Any) => !clients.size || clients.has(r.client)) };
  if (counties.size) L.push(`WATER PROJECTS IN THE COUNTY ASKED ABOUT (applicant | program | list status | amount | engineer of record):\n${R.water.map((r: Any) => `${r.applicant} | ${r.program} | ${r.status} | ${$m(r.amount)} | ${r.engineer ?? "none public"}`).join("\n")}`);
  L.push(`CITY APPROVALS${clients.size ? " FOR THE CLIENT ASKED ABOUT" : ""} (date | client | firm | project | action | amount):\n${R.contracts.map((r: Any) => `${r.date} | ${r.client} | ${r.firm} | ${r.project} | ${r.action} | ${r.amount ? $m(r.amount) : "no amount"}`).join("\n")}`);
  // Totals are computed here, never by the model: it lists well and adds badly.
  const group = (list: Any[], key: (r: Any) => string) => list.reduce((m: Map<string, Any[]>, r: Any) => m.set(key(r), [...(m.get(key(r)) ?? []), r]), new Map());
  const wBy = group(R.water, (r) => `${r.county} County, ${r.state}`);
  L.push(`WATER BY COUNTY, COMPUTED (use these totals exactly):\n${[...wBy].map(([c, l]: [string, Any[]]) => { const open = l.filter((r) => !r.engineer); return `${c}: ${l.length} projects ${$m(l.reduce((s, r) => s + r.amount, 0))}; no engineer public ${open.length} worth ${$m(open.reduce((s, r) => s + r.amount, 0))}${open.length ? ` (${open.map((r) => `${r.applicant} ${r.program} ${$m(r.amount)}`).join(", ")})` : ""}`; }).join("\n")}`);
  const fBy = group(R.federal, (r) => `${r.county} County, ${r.state}`);
  L.push(`FEDERAL BY COUNTY, COMPUTED over the ${R.federal.length} largest awards (use these totals exactly):\n${[...fBy].map(([c, l]: [string, Any[]]) => `${c}: ${l.length} awards ${$m(l.reduce((s, r) => s + r.amount, 0))}, of which direct ${$m(l.filter((r) => r.kind === "Direct").reduce((s, r) => s + r.amount, 0))} and through a state agency ${$m(l.filter((r) => r.kind !== "Direct").reduce((s, r) => s + r.amount, 0))}`).join("\n")}`);
  const cBy = group(R.contracts, (r) => `${r.client} / ${r.firm}`);
  L.push(`APPROVALS BY CLIENT AND FIRM, COMPUTED (use these exactly):\n${[...cBy].map(([k, l]: [string, Any[]]) => `${k}: ${l.length} actions ${$m(l.reduce((s, r) => s + (r.amount || 0), 0))}`).join("\n")}`);
  L.push(`FEDERAL AWARDS${counties.size ? " IN THE COUNTY ASKED ABOUT" : ", LARGEST 40"} (kind | recipient | county, state | program | amount | action date):\n${R.federal.slice(0, 40).map((r: Any) => `${r.kind} | ${r.recipient} | ${r.county}, ${r.state} | ${r.program} | ${$m(r.amount)} | ${r.date ?? "undated"}`).join("\n")}`);
  if (I.corridors) L.push(`WIGHTMAN CORRIDORS (street | city | limits | construction): ${I.corridors.map((c: Any) => `${c.street} | ${c.city} | ${c.from ?? "?"} to ${c.to ?? "?"} | ${c.start ?? "?"} to ${c.end ?? "?"}`).join("; ")}`);
  if (I.discoveries) L.push(`QUESTIONS ALREADY ANSWERED ON THE PAGE: ${I.discoveries.map((d: Any) => `${d.q} ${d.a}`).join(" | ")}`);
  L.push("PILOT: walk through the page with Phil and the Wightman people he picks; pick a pilot (the Kalamazoo corridor forecast, or answers on new state and federal money in their counties); run 30 days; decide on what it found. Nothing at Wightman is connected to Arthur today; everything is public record.");
  return L.join("\n");
}

const SYSTEM = `You are Arthur, the intelligence behind LOVELEEDAY, answering Phil Doorlag of Wightman inside a territory brief built from public records.
Rules:
- Answer ONLY from the CONTEXT. For any count or total, quote a COMPUTED line exactly and never add figures yourself; when listing items, list every one the CONTEXT gives. Never invent a figure, date, name, firm, contract or result. If the context cannot answer, say so and name the public source or Wightman system Arthur would need.
- The business-survival figures are correlations with wide ranges; never present them as proof.
- Never quote prices or fees; say pricing is set together after a conversation.
- Direct and respectful, one professional to another; Wightman has 80 years of experience. At most 90 words. Plain sentences, no markdown, no bullet characters, no headings. Plain ASCII spaces and hyphens only.
- Return ONLY a JSON object: {"head": "<one short sentence that answers>", "answer": "<the explanation>", "evidence": ["<the dataset or source each claim came from, in plain words>", ...]} with 1 to 4 evidence items.`;

const fail = (status = 502) => NextResponse.json({ error: "Arthur could not answer just now. Try again in a moment." }, { status });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token ?? "");
    const client = getWightman(token);
    if (!client) return NextResponse.json({ error: "Unknown link" }, { status: 404 });
    const question = String(body.question ?? "").trim().slice(0, 400);
    if (question.length < 4) return NextResponse.json({ error: "Ask a question" }, { status: 400 });
    const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "anon";
    if (limited(`ip:${ip}`, 15, 10 * 60_000) || limited(`tok:${token}`, 150, 24 * 3600_000)) {
      return NextResponse.json({ error: "That is a lot of questions for one brief. Give it a few minutes." }, { status: 429 });
    }
    const key = process.env.CEREBRAS_API_KEY;
    if (!key) return NextResponse.json({ error: "Arthur is not configured" }, { status: 503 });
    // gpt-oss spends its budget on reasoning first; an empty reply means it ran out, so retry once with less reasoning.
    const messages = [{ role: "system", content: SYSTEM }, { role: "user", content: `CONTEXT\n${context(new Date(), question)}\n\nQUESTION\n${question}` }];
    let content = "";
    for (const effort of ["high", "medium"]) {
      const res = await fetch(API, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "User-Agent": UA },
        body: JSON.stringify({ model: "gpt-oss-120b", temperature: 0.2, max_tokens: 12000, reasoning_effort: effort, messages }),
      });
      if (!res.ok) { console.error("wightman ask: cerebras", res.status, (await res.text()).slice(0, 300)); continue; }
      content = (await res.json())?.choices?.[0]?.message?.content ?? "";
      if (/\{[\s\S]*\}/.test(content)) break;
      console.error(`wightman ask: no JSON at ${effort} reasoning`, content.slice(0, 200));
    }
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) { console.error("wightman ask: no JSON", content.slice(0, 300)); return fail(); }
    const parsed = JSON.parse(match[0]);
    const out = {
      head: cleanModelText(String(parsed.head ?? "")).slice(0, 300),
      answer: cleanModelText(String(parsed.answer ?? "")).slice(0, 1500),
      evidence: Array.isArray(parsed.evidence) ? parsed.evidence.slice(0, 4).map((e: unknown) => cleanModelText(String(e)).slice(0, 300)) : [],
    };
    if (!out.head && !out.answer) return fail();
    after(async () => {
      await recordAsk(request.headers, { surface: "wightman", token, client: client.short, question, head: out.head }).catch((e) => console.error("ask log", e));
      try {
        if (!process.env.RESEND_API_KEY) return;
        await new Resend(process.env.RESEND_API_KEY).emails.send({
          from: "LOVELEEDAY Portal <hello@loveleedaystudios.com>",
          to: "blackmarble.m.g@gmail.com",
          subject: `${client.short} asked Arthur: ${question.slice(0, 70)}`,
          text: `${client.preparedFor} (${client.short}) asked on the territory brief:\n\n${question}\n\nArthur answered:\n${out.head}\n${out.answer}\n\nEvidence:\n- ${out.evidence.join("\n- ")}`,
        });
      } catch (e) { console.error("wightman ask: notify", e); }
    });
    return NextResponse.json(out);
  } catch (e) {
    console.error("wightman ask", e);
    return fail(500);
  }
}
