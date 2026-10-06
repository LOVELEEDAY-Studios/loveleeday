import { Resend } from "resend";
import { escapeHtml } from "@/lib/guard";

const hello = "hello@loveleedaystudios.com";
export const alertsTo = () => process.env.LOVELEEDAY_ALERTS_TO || hello;
type Mail = { to: string; subject: string; template: string; paragraphs: string[]; action?: { label: string; url: string }; replyTo?: string; internal?: boolean; security?: boolean };

export async function sendEmail(mail: Mail) {
  const { to, subject, template, paragraphs, action, internal, security } = mail;
  const footer = `LOVELEEDAY Studios LLC · loveleedaystudios.com${process.env.LOVELEEDAY_POSTAL_ADDRESS ? ` · ${process.env.LOVELEEDAY_POSTAL_ADDRESS}` : ""}`;
  const text = `${paragraphs.join("\n\n")}${action ? `\n\n${action.label}: ${action.url}` : ""}\n\n${footer}`;
  const p = (s: string) => `<p style="margin:0 0 20px;line-height:1.6">${escapeHtml(s).replace(/\n/g, "<br>")}</p>`;
  const html = `<div style="background:#ffffff;color:#1d1d1f;font:16px/1.6 -apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:auto;padding:32px"><img src="https://loveleedaystudios.com/site/assets/mark-ink-512.png" width="32" height="32" alt="LOVELEEDAY" style="display:block;width:32px;height:32px;object-fit:contain;margin-bottom:28px">${paragraphs.map(p).join("")}${action ? `<p style="margin:28px 0"><a href="${escapeHtml(action.url)}" style="display:inline-block;background:#0071e3;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px">${escapeHtml(action.label)}</a></p><p style="color:#62656c;font-size:13px">${escapeHtml(action.url)}</p>` : ""}<div style="border-top:1px solid #e4e5e9;padding-top:20px;margin-top:32px;color:#62656c;font-size:13px">LOVELEEDAY Studios LLC · <a href="https://loveleedaystudios.com" style="color:#0066cc">loveleedaystudios.com</a>${process.env.LOVELEEDAY_POSTAL_ADDRESS ? ` · ${escapeHtml(process.env.LOVELEEDAY_POSTAL_ADDRESS)}` : ""}</div></div>`;
  try {
    if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY missing");
    const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: `${internal ? "LOVELEEDAY Alerts" : "LOVELEEDAY"} <${security ? "security@loveleedaystudios.com" : hello}>`,
      to, replyTo: mail.replyTo || hello, subject, html, text,
    });
    if (result.error) throw result.error;
    return result.data?.id;
  } catch (error) {
    console.error("Email send failed", { to, template, error });
    throw error;
  }
}

export async function notifyAsk(client: string, question: string, body: string, url: string) {
  return sendEmail({ internal: true, to: alertsTo(), template: "ask-alert", subject: `${client.replace(/[\r\n]/g, " ").slice(0, 80)} asked about the proposal: ${question.replace(/[\r\n]/g, " ").slice(0, 70)}`, paragraphs: [body], action: { label: "Open proposal", url } });
}
