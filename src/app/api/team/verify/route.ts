import { NextResponse, type NextRequest } from "next/server";
import { checkPending, PENDING_COOKIE, SESSION_COOKIE, SESSION_DAYS, signSession } from "@/lib/team-auth";
import { TEAM_COOKIE } from "@/lib/visits";

export const dynamic = "force-dynamic";

const tries = new Map<string, number>();

/* Step two: the code from the email. Five wrong codes and the pending sign-in is dropped. */
export async function POST(req: NextRequest) {
  const code = String((await req.json().catch(() => ({}))).code ?? "").replace(/\D/g, "");
  const pending = req.cookies.get(PENDING_COOKIE)?.value;
  const email = await checkPending(pending, code);
  if (!email) {
    const n = (tries.get(pending ?? "") ?? 0) + 1;
    tries.set(pending ?? "", n);
    const res = NextResponse.json({ error: "That code is not right, or it has expired." }, { status: 401 });
    if (n >= 5) res.cookies.delete(PENDING_COOKIE);
    return res;
  }
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
