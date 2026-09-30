import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isTeamEmail, PENDING_COOKIE, signPending } from "@/lib/team-auth";
import { clientIp } from "@/lib/visits";
import { limited } from "@/lib/guard";

export const dynamic = "force-dynamic";

/* Step one of sign-in. The reply is the same whether or not the address is on the team, so the
   form cannot be used to discover who is. */
export async function POST(request: Request) {
  const email = String((await request.json().catch(() => ({}))).email ?? "").trim().toLowerCase().slice(0, 200);
  if (limited(`ip:${clientIp(request.headers)}`, 8, 15 * 60_000) || limited(`e:${email}`, 5, 15 * 60_000)) {
    return NextResponse.json({ error: "Too many codes. Try again in a few minutes." }, { status: 429 });
  }
  const res = NextResponse.json({ ok: true });
  if (!isTeamEmail(email)) return res;

  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, "0");
  if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: "Email is not configured" }, { status: 503 });
  await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: "LOVELEEDAY Team <hello@loveleedaystudios.com>",
    to: email,
    subject: `Your LOVELEEDAY team code: ${code}`,
    text: `Your sign-in code is ${code}. It works once and expires in 10 minutes.\n\nIf you did not ask for it, ignore this email.`,
  });
  res.cookies.set(PENDING_COOKIE, await signPending(email, code), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 600 });
  return res;
}
