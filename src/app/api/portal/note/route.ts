import { Resend } from "resend";
import { NextResponse } from "next/server";
import { getPortal } from "@/content/portals";
import { getPortfolio } from "@/content/portfolio";
import { getComplianceSchool } from "@/content/compliance";
import { getCivic } from "@/content/civic/kalamazoo";
import { getStudio } from "@/content/studio/elemental";

export const dynamic = "force-dynamic";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token ?? "");

    // The token is re-checked here rather than trusted from the client, so this
    // endpoint cannot be used to send mail from an arbitrary payload. The
    // fund-level portfolio page carries its own token and is accepted the same
    // way — it is a different object but the same trust boundary.
    // Every portfolio page, not `portfolio` — that export is an alias for Collab, so notes sent
    // from the Lightship and Meknology pages were rejected with "Unknown review link" (404,
    // reproduced 2026-09-23). A form that silently cannot send is worse than no form.
    const found = getPortal(token);
    const pf = found ? undefined : getPortfolio(token);
    const st = found || pf ? undefined : getStudio(token);
    const civic = found || pf || st ? undefined : getCivic(token);
    const cs = found || pf || st || civic ? undefined : getComplianceSchool(token);
    if (!found && !pf && !cs && !civic && !st) {
      return NextResponse.json({ error: "Unknown review link" }, { status: 404 });
    }
    const portal = found ?? (pf
      ? {
          token: pf.token,
          client: pf.fund,
          project: "Portfolio study",
          round: "Round 01",
          deliverables: pf.cases.map((c) => ({ slug: c.slug, title: c.company })),
        }
      : st
        ? {
            token: st.token!,
            client: st.short,
            project: "Spot, rebuild and Arthur",
            round: "Round 01",
            deliverables: [{ slug: "proposal", title: "Spot, rebuild and Arthur" }],
          }
        : civic
        ? {
            token: civic.token,
            client: civic.short,
            project: "County analysis",
            round: "Round 01",
            deliverables: [{ slug: "analysis", title: "County analysis" }],
          }
        : {
            token: cs!.token,
            client: cs!.short,
            project: "Compliance calendar",
            round: "Round 01",
            deliverables: [{ slug: "compliance", title: "Compliance calendar" }],
          });
    const portfolioLink = !found;
    const linkBase = st ? "studio/" : civic ? "civic/" : cs ? "compliance/" : "portfolio/";

    const name = String(body.name ?? "").trim().slice(0, 120);
    const email = String(body.email ?? "").trim().slice(0, 200);
    const note = String(body.note ?? "").trim().slice(0, 5000);
    const slug = String(body.slug ?? "").trim();
    const intent = body.intent === "start" ? "start" : "feedback";

    if (!name || !email || !note) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "That email does not look right" }, { status: 400 });
    }

    const deliverable = portal.deliverables.find((d) => d.slug === slug);
    const about = deliverable ? deliverable.title : "The package overall";

    const resend = new Resend(process.env.RESEND_API_KEY);

    const row = (k: string, v: string) =>
      `<tr style="border-bottom:1px solid #D4D2C9"><td style="padding:.6rem 0;font:600 11px ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#5A5A55">${esc(k)}</td><td style="padding:.6rem 0;text-align:right">${v}</td></tr>`;

    await resend.emails.send({
      from: "LOVELEEDAY Portal <hello@loveleedaystudios.com>",
      to: "blackmarble.m.g@gmail.com",
      replyTo: email,
      subject: `${intent === "start" ? "READY TO START" : "Portal note"} — ${portal.client}: ${name}`,
      html: `<div style="font-family:Inter,-apple-system,sans-serif;max-width:620px;margin:0 auto;background:#F3F2EE;padding:2rem;color:#111">
        <h2 style="font-weight:400;letter-spacing:-.02em;margin:0 0 1.25rem">Review note — ${esc(portal.client)}</h2>
        <table style="width:100%;border-collapse:collapse">
          ${row("From", `${esc(name)} &lt;<a href="mailto:${esc(email)}" style="color:#111">${esc(email)}</a>&gt;`)}
          ${row("Intent", intent === "start" ? "Let's get started" : "Feedback on the work")}
          ${row("About", esc(about))}
          ${row("Project", esc(portal.project))}
          ${row("Round", esc(portal.round))}
        </table>
        <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid #D4D2C9">
          <p style="font:600 11px ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#5A5A55;margin:0 0 .5rem">Note</p>
          <p style="line-height:1.6;white-space:pre-wrap;margin:0">${esc(note)}</p>
        </div>
        <p style="margin-top:1.5rem;font-size:12px;color:#5A5A55">
          <a href="https://loveleedaystudios.com/p/${portfolioLink ? linkBase : ""}${esc(portal.token ?? "")}${!portfolioLink && deliverable ? "/" + esc(deliverable.slug) : ""}" style="color:#111">Open the portal page they were looking at</a>
        </p>
      </div>`,
    });

    // The client gets their own words back, so the note is a record and not a
    // message into a void.
    await resend.emails.send({
      from: "LOVELEEDAY Studios <hello@loveleedaystudios.com>",
      to: email,
      replyTo: "daniel@loveleedaystudios.com",
      subject: `Note received — ${portal.client} review`,
      html: `<div style="font-family:Inter,-apple-system,sans-serif;max-width:620px;margin:0 auto;background:#F3F2EE;padding:2rem;color:#111">
        <h2 style="font-weight:400;letter-spacing:-.02em;margin:0 0 .5rem">Note received.</h2>
        <p style="color:#5A5A55;font-size:.9rem;margin:0 0 1.5rem">We will come back to you within one business day.</p>
        <p style="font:600 11px ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#5A5A55;margin:0 0 .5rem">What you wrote, on ${esc(about)}</p>
        <p style="line-height:1.6;white-space:pre-wrap;margin:0;padding-left:1rem;border-left:2px solid #D4D2C9">${esc(note)}</p>
        <div style="margin-top:2rem;padding-top:1rem;border-top:1px solid #D4D2C9;font-size:.8rem;color:#5A5A55">LOVELEEDAY Studios LLC</div>
      </div>`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Portal note error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
