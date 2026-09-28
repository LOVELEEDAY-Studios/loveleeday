import { after, type NextRequest } from "next/server";
import { recordView, TEAM_COOKIE } from "@/lib/visits";

export const dynamic = "force-dynamic";

/* The beacon from every /p/ page. Only private pages are recorded. */
export async function POST(req: NextRequest) {
  let path = "";
  let id: string | undefined;
  let dwellMs: number | undefined;
  try {
    const body = await req.json();
    path = String(body.path ?? "");
    if (typeof body.visit === "string" && /^[0-9a-f-]{36}$/i.test(body.visit)) id = body.visit;
    // Capped at 4 hours: anything longer is a tab left open, not reading.
    if (id && Number.isFinite(body.dwell_ms)) dwellMs = Math.min(Math.max(Math.round(body.dwell_ms), 0), 4 * 3600_000);
  } catch {}
  if (path.startsWith("/p/")) {
    const team = req.cookies.get(TEAM_COOKIE)?.value === "1";
    after(() => recordView(req.headers, path, team, { id, dwellMs }));
  }
  return new Response(null, { status: 204 });
}
