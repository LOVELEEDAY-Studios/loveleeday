import { createHmac, timingSafeEqual } from "node:crypto";
import { Resend } from "resend";

/**
 * Open and click tracking for every email Arthur sends, from any mailbox.
 * Senders register the message in Supabase `email_sends` (see ~/arthur/lib/email/tracking.mjs);
 * these endpoints only ever call `record_email_event`, so the publishable key here cannot read
 * who was emailed. Clicks are HMAC-signed so /api/t/c cannot be used as an open redirect.
 */
const SUPABASE_URL = process.env.EMAIL_TRACK_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.EMAIL_TRACK_SUPABASE_KEY ?? "";
const SECRET = process.env.EMAIL_TRACK_SECRET ?? "";
const NOTIFY_TO = "blackmarble.m.g@gmail.com";

export const PIXEL = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

export function sign(id: string, url: string) {
  return createHmac("sha256", SECRET).update(`${id}|${url}`).digest("hex").slice(0, 20);
}

export function validSig(id: string, url: string, sig: string) {
  if (!SECRET || sig.length !== 20) return false;
  return timingSafeEqual(Buffer.from(sign(id, url)), Buffer.from(sig));
}

type Result = { machine: boolean; reason: string | null; first_human: boolean; to: string; subject: string; mailbox: string; sent_at: string } | null;

export async function record(id: string, kind: "open" | "click", request: Request, url?: string): Promise<Result> {
  if (!SUPABASE_URL || !/^[a-f0-9]{16,40}$/.test(id)) return null;
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/record_email_event`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ p_id: id, p_kind: kind, p_url: url ?? null, p_ua: request.headers.get("user-agent") ?? "", p_ip: ip }),
    cache: "no-store",
  });
  if (!r.ok) {
    console.error("email-track record failed", r.status, await r.text());
    return null;
  }
  return (await r.json()) as Result;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** One alert on the first human open, and one on every human click. Machine prefetches stay silent. */
export async function notify(res: Result, kind: "open" | "click", url?: string) {
  if (!res || res.machine) return;
  if (kind === "open" && !res.first_human) return;
  const verb = kind === "open" ? "Opened" : "Clicked";
  const when = new Date().toLocaleString("en-US", { timeZone: "America/Detroit", dateStyle: "medium", timeStyle: "short" });
  const sent = new Date(res.sent_at).toLocaleString("en-US", { timeZone: "America/Detroit", dateStyle: "medium", timeStyle: "short" });
  await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: "Arthur <hello@loveleedaystudios.com>",
    to: NOTIFY_TO,
    subject: `${verb}: ${res.to} — ${res.subject}`,
    html: `<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:15px;color:#111;line-height:1.5">
      <p><b>${esc(res.to)}</b> ${kind === "open" ? "opened" : "clicked a link in"} <b>${esc(res.subject)}</b> at ${when}.</p>
      ${url ? `<p>Link: <a href="${esc(url)}">${esc(url)}</a></p>` : ""}
      <p style="color:#666">Sent ${sent} from ${esc(res.mailbox)}.</p></div>`,
  });
}
