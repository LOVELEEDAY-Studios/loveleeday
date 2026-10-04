import { Resend } from "resend";
import { NextResponse } from "next/server";
import { escapeHtml, isEmail, limited } from "@/lib/guard";
import { clientIp } from "@/lib/visits";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    let name: string, email: string, projectType: string, budget: string, details: string;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      name = body.name as string;
      email = body.email as string;
      projectType = body.project_type as string;
      budget = body.budget as string;
      details = body.details as string;
    } else {
      const formData = await request.formData();
      name = formData.get("name") as string;
      email = formData.get("email") as string;
      projectType = formData.get("project_type") as string;
      budget = formData.get("budget") as string;
      details = formData.get("details") as string;
    }

    if (!name || !email || !details) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    email = String(email).trim().slice(0, 254);
    if (!isEmail(email)) return NextResponse.json({ error: "That email address does not look right." }, { status: 400 });
    // The form mails whatever address is typed in, so it is bounded per sender and per address (sim lab, 2026-09-30).
    if (limited(`ip:${clientIp(request.headers)}`, 5, 60 * 60_000) || limited(`to:${email.toLowerCase()}`, 2, 24 * 60 * 60_000)) {
      return NextResponse.json({ error: "Thanks, we already have your brief. We'll be in touch soon." }, { status: 429 });
    }
    // Everything a visitor typed is escaped before it goes into the HTML we send to our own inbox.
    const plain = (s: unknown, n: number) => String(s ?? "").replace(/[\r\n\t]+/g, " ").slice(0, n);
    const subjectLine = `New Project Brief — ${plain(name, 120)} (${plain(projectType, 60) || "Unspecified"})`;
    name = escapeHtml(String(name).slice(0, 200));
    projectType = escapeHtml(String(projectType ?? "").slice(0, 100));
    budget = escapeHtml(String(budget ?? "").slice(0, 100));
    details = escapeHtml(String(details).slice(0, 10_000));
    const emailHtml = escapeHtml(email);

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send notification to Daniel
    await resend.emails.send({
      from: "LOVELEEDAY <hello@loveleedaystudios.com>",
      to: "hello@loveleedaystudios.com",
      replyTo: email,
      subject: subjectLine,
      html: `
        <div style="font-family: Inter, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #F3F2EE; padding: 2rem; color: #111;">
          <h2 style="font-weight: 400; letter-spacing: -0.02em; margin-bottom: 1.5rem;">New Project Brief</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #D4D2C9;">
              <td style="padding: 0.75rem 0; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; text-transform: uppercase; color: #5A5A55;">Name</td>
              <td style="padding: 0.75rem 0; text-align: right; font-weight: 500;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #D4D2C9;">
              <td style="padding: 0.75rem 0; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; text-transform: uppercase; color: #5A5A55;">Email</td>
              <td style="padding: 0.75rem 0; text-align: right; font-weight: 500;"><a href="mailto:${emailHtml}" style="color: #111;">${emailHtml}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #D4D2C9;">
              <td style="padding: 0.75rem 0; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; text-transform: uppercase; color: #5A5A55;">Project Type</td>
              <td style="padding: 0.75rem 0; text-align: right; font-weight: 500;">${projectType || "Not specified"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #D4D2C9;">
              <td style="padding: 0.75rem 0; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; text-transform: uppercase; color: #5A5A55;">Budget</td>
              <td style="padding: 0.75rem 0; text-align: right; font-weight: 500;">${budget || "Not specified"}</td>
            </tr>
          </table>
          <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #D4D2C9;">
            <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; text-transform: uppercase; color: #5A5A55; margin-bottom: 0.5rem;">Project Details</p>
            <p style="line-height: 1.5; white-space: pre-wrap;">${details}</p>
          </div>
        </div>
      `,
    });

    // Send confirmation to the client
    await resend.emails.send({
      from: "LOVELEEDAY <hello@loveleedaystudios.com>",
      replyTo: "hello@loveleedaystudios.com",
      to: email,
      subject: "Brief received — LOVELEEDAY",
      html: `
        <div style="font-family: Inter, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #F3F2EE; padding: 2rem; color: #111;">
          <h2 style="font-weight: 400; letter-spacing: -0.02em; margin-bottom: 0.5rem;">Brief received.</h2>
          <p style="color: #5A5A55; font-size: 0.9rem; margin-bottom: 2rem;">We'll reply within one working day to talk through scope and next steps.</p>
          <p style="font-size: 0.9rem; line-height: 1.6;">In the meantime, feel free to reply to this email with any additional details or questions.</p>
          <p style="font-size: 0.85rem; color: #5A5A55; line-height: 1.5; margin-top: 1.5rem;">If you don't see our reply, check your spam folder — we send from <strong>hello@loveleedaystudios.com</strong>.</p>
          <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #D4D2C9; font-size: 0.8rem; color: #5A5A55;">
            LOVELEEDAY Studios LLC &middot; Delaware
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
