import { NextResponse, type NextRequest } from "next/server";
import { clientIp, hashIp, TEAM_COOKIE } from "@/lib/visits";

export const dynamic = "force-dynamic";

/* Open once on each of our own devices: /api/t/me?k=<TEAM_MARK_KEY>.
   Marks the browser as ours for a year, so our visits to client pages never read
   as a prospect opening them. Also records the device's current IP hash. */
export async function GET(req: NextRequest) {
  const key = process.env.TEAM_MARK_KEY;
  if (!key || req.nextUrl.searchParams.get("k") !== key) {
    return new NextResponse(null, { status: 404 });
  }
  // team_ips is service-role only, so the Mac's addresses are registered by the local report
  // script; a marked browser is the stronger signal anyway.
  const ipHash = await hashIp(clientIp(req.headers));
  const res = new NextResponse(
    `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font:16px -apple-system,sans-serif;padding:40px;color:#1d1d1f"><h1 style="font-weight:500">This browser is marked as LOVELEEDAY.</h1><p style="color:#7d8088">Your visits to client pages from this device are now labelled as ours in the visit report.${ipHash ? ` Current network: ${ipHash}.` : ""}</p></body>`,
    { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } },
  );
  res.cookies.set(TEAM_COOKIE, "1", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}
