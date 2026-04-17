import { Resend } from "resend";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const projectType = formData.get("project_type") as string;
    const budget = formData.get("budget") as string;
    const details = formData.get("details") as string;

    if (!name || !email || !details) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send notification to Daniel
    await resend.emails.send({
      from: "LOVELEEDAY Studios <arthur@olldae.com>",
      to: "blackmarble.m.g@gmail.com",
      replyTo: email,
      subject: `New Project Brief — ${name} (${projectType || "Unspecified"})`,
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
              <td style="padding: 0.75rem 0; text-align: right; font-weight: 500;"><a href="mailto:${email}" style="color: #111;">${email}</a></td>
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
      from: "LOVELEEDAY Studios <arthur@olldae.com>",
      to: email,
      subject: "Transmission Received — LOVELEEDAY Studios",
      html: `
        <div style="font-family: Inter, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #F3F2EE; padding: 2rem; color: #111;">
          <h2 style="font-weight: 400; letter-spacing: -0.02em; margin-bottom: 0.5rem;">Transmission Received.</h2>
          <p style="color: #5A5A55; font-size: 0.9rem; margin-bottom: 2rem;">We've received your project brief and will reply within 12 hours with a scope, price, and timeline.</p>
          <p style="font-size: 0.9rem; line-height: 1.6;">In the meantime, feel free to reply to this email with any additional details or questions.</p>
          <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #D4D2C9; font-size: 0.8rem; color: #5A5A55;">
            LOVELEEDAY Studios LLC &middot; Delaware
          </div>
        </div>
      `,
    });

    // Redirect to success page
    return NextResponse.redirect(new URL("/contact/success", request.url), 303);
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
