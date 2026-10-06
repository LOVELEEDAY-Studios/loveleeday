import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
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
  if (!process.env.RESEND_API_KEY || !isTeamEmail(email)) return res;

  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, "0");
  try {
    await sendEmail({ to: email, template: "team-code", subject: "Your LOVELEEDAY sign-in code", security: true,
      paragraphs: [`Your sign-in code is ${code}. It works once and expires in 10 minutes.`, "If you did not ask for it, you can ignore this email."] });
  } catch { return NextResponse.json({ error: "Could not send code" }, { status: 503 }); }
  res.cookies.set(PENDING_COOKIE, await signPending(email, code), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 600 });
  return res;
}
