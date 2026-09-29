/* INTERNAL, local-only store for the Dabney ordering-concepts review's approve/comment controls.
   Refuses to run in production so it can never become a public write endpoint.
   POST {id,label,approved,comment} saves one item; POST {submit:true} stamps _submittedAt.
   Same shape as /api/dabney-ordering-review — see that file for the full comment. */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const FILE = path.join(os.homedir(), ".arthur/data/ordering-concepts-review/review.json");
const local = () => process.env.NODE_ENV !== "production";

function read(): Record<string, unknown> {
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return {}; }
}
function write(all: Record<string, unknown>) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(all, null, 1));
}

export async function GET() {
  if (!local()) return new Response("Not found", { status: 404 });
  return Response.json(read());
}

export async function POST(req: Request) {
  if (!local()) return new Response("Not found", { status: 404 });
  const b = await req.json().catch(() => null);
  const all = read();
  if (b?.submit === true) {
    all._submittedAt = new Date().toISOString();
    write(all);
    return Response.json({ ok: true, submittedAt: all._submittedAt });
  }
  if (!b || typeof b.id !== "string" || b.id.length > 80 || b.id.startsWith("_")) return new Response("Bad request", { status: 400 });
  all[b.id] = { ...((all[b.id] as object) || {}), label: String(b.label || "").slice(0, 300), approved: !!b.approved, comment: String(b.comment || "").slice(0, 4000), at: new Date().toISOString() };
  write(all);
  return Response.json({ ok: true });
}
