import { after, type NextRequest } from "next/server";
import { recordView, TEAM_COOKIE } from "@/lib/visits";

export const dynamic = "force-dynamic";

/* The beacon from every /p/ page. Only private pages are recorded. */
export async function POST(req: NextRequest) {
  let path = "";
  try {
    path = String((await req.json()).path ?? "");
  } catch {}
  if (path.startsWith("/p/")) {
    const team = req.cookies.get(TEAM_COOKIE)?.value === "1";
    after(() => recordView(req.headers, path, team));
  }
  return new Response(null, { status: 204 });
}
