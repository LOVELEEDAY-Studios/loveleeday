import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/* LOVELEEDAY team sign-in. No password: a six-digit code is emailed to an address on TEAM_EMAILS,
   and the session is a signed cookie. Stateless on purpose, so there is no session table to leak;
   rotating TEAM_SESSION_SECRET signs everyone out. */

export const SESSION_COOKIE = "ll_team_session";
export const PENDING_COOKIE = "ll_team_pending";
export const SESSION_DAYS = 30;

const enc = new TextEncoder();

async function hmac(data: string) {
  const secret = process.env.TEAM_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("TEAM_SESSION_SECRET is not set");
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Buffer.from(sig).toString("base64url");
}

function same(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

export const teamEmails = () =>
  (process.env.TEAM_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

export const isTeamEmail = (email: string) => teamEmails().includes(email.trim().toLowerCase());

/* Session: base64url(email).expiry.signature */
export async function signSession(email: string) {
  const exp = Date.now() + SESSION_DAYS * 86_400_000;
  const body = `${Buffer.from(email).toString("base64url")}.${exp}`;
  return `${body}.${await hmac(`session:${body}`)}`;
}

export async function readSession(value: string | undefined): Promise<string | null> {
  if (!value) return null;
  const [e, exp, sig] = value.split(".");
  if (!e || !exp || !sig || Date.now() > Number(exp)) return null;
  if (!same(sig, await hmac(`session:${e}.${exp}`))) return null;
  const email = Buffer.from(e, "base64url").toString();
  return isTeamEmail(email) ? email : null;
}

/* Pending code: the code itself never sits in the cookie, only a signature over it. */
export async function signPending(email: string, code: string) {
  const exp = Date.now() + 10 * 60_000;
  const body = `${Buffer.from(email).toString("base64url")}.${exp}`;
  return `${body}.${await hmac(`code:${body}:${code}`)}`;
}

export async function checkPending(value: string | undefined, code: string): Promise<string | null> {
  if (!value || !/^\d{6}$/.test(code)) return null;
  const [e, exp, sig] = value.split(".");
  if (!e || !exp || !sig || Date.now() > Number(exp)) return null;
  if (!same(sig, await hmac(`code:${e}.${exp}:${code}`))) return null;
  const email = Buffer.from(e, "base64url").toString();
  return isTeamEmail(email) ? email : null;
}

/* For team pages: the signed-in address, or off to the sign-in page. */
export async function requireTeam(): Promise<string> {
  const email = await readSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!email) redirect("/team/login");
  return email;
}
