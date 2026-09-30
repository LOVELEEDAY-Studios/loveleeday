import { NextResponse, type NextRequest } from "next/server";
import { checkPending, PENDING_COOKIE, SESSION_COOKIE, SESSION_DAYS, signSession } from "@/lib/team-auth";
import { clientIp, TEAM_COOKIE } from "@/lib/visits";
import { limited } from "@/lib/guard";

export const dynamic = "force-dynamic";

const tries = new Map<string, number>();

/* Step two: the code from the email. Five wrong codes and the pending sign-in is dead on the server.
   The count is checked BEFORE the code: deleting the cookie only asked the browser to forget it, so an
   attacker replaying the same cookie could guess all million codes in its ten minutes (sim lab, 2026-09-30). */
export async function POST(req: NextRequest) {
  const code = String((await req.json().catch(() => ({}))).code ?? "").replace(/\D/g, "");
  const pending = req.cookies.get(PENDING_COOKIE)?.value;
  if (!pending || (tries.get(pending) ?? 0) >= 5 || limited(`verify:${clientIp(req.headers)}`, 20, 15 * 60_000)) {
    const res = NextResponse.json({ error: "Too many tries. Ask for a new code." }, { status: 429 });
    res.cookies.delete(PENDING_COOKIE);
    return res;
  }
  const email = await checkPending(pending, code);
  if (!email) {
    const n = (tries.get(pending ?? "") ?? 0) + 1;
    tries.set(pending ?? "", n);
    const res = NextResponse.json({ error: "That code is not right, or it has expired." }, { status: 401 });
    if (n >= 5) res.cookies.delete(PENDING_COOKIE);
    return res;
  }
  tries.set(pending, 5); // the code works once
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(PENDING_COOKIE);
  res.cookies.set(SESSION_COOKIE, await signSession(email), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: SESSION_DAYS * 86_400 });
  // A signed-in teammate's own visits to client pages are ours, never a prospect's.
  res.cookies.set(TEAM_COOKIE, "1", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
