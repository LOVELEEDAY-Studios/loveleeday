import { sendEmail, alertsTo } from "@/lib/email";
import { isEmail, limited } from "@/lib/guard";
import { clientIp } from "@/lib/visits";
import { NextResponse } from "next/server";
import { getPortal } from "@/content/portals";
import { getPortfolio } from "@/content/portfolio";
import { getComplianceSchool } from "@/content/compliance";
import { getCivic } from "@/content/civic/kalamazoo";
import { getStudio } from "@/content/studio/elemental";
import { getHub } from "@/content/hub/startupzoo";
import { getWightman } from "@/content/hub/wightman";
import { getNow } from "@/content/hub/nowkalamazoo";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid note" }, { status: 400 });
    const input = body as Record<string, unknown>;
    const token = (typeof input.token === "string" ? input.token : "");

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
    const hub = found || pf || st ? undefined : getHub(token);
    const civic = found || pf || st ? undefined : (getCivic(token) ?? hub);
    const cs = found || pf || st || civic ? undefined : getComplianceSchool(token);
    const wm = found || pf || st || civic || cs ? undefined : getWightman(token);
    const nk = found || pf || st || civic || cs || wm ? undefined : getNow(token);
    if (!found && !pf && !cs && !civic && !st && !wm && !nk) {
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
      : nk
        ? {
            token: nk.token,
            client: nk.short,
            project: "NowKalamazoo proposal",
            round: "Round 01",
            deliverables: [{ slug: "analysis", title: "NowKalamazoo proposal" }],
          }
      : wm
        ? {
            token: wm.token,
            client: wm.short,
            project: "What Arthur can see across your territory",
            round: "Round 01",
            deliverables: [{ slug: "intelligence", title: "Territory intelligence brief" }],
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
            project: hub ? "Startup Zoo proposal" : "County analysis",
            round: "Round 01",
            deliverables: [{ slug: "analysis", title: hub ? "Startup Zoo proposal" : "County analysis" }],
          }
        : {
            token: cs!.token,
            client: cs!.short,
            project: "Compliance calendar",
            round: "Round 01",
            deliverables: [{ slug: "compliance", title: "Compliance calendar" }],
          });
    const portfolioLink = !found;
    const linkBase = st ? "studio/" : hub ? "hub/" : civic ? "civic/" : cs ? "compliance/" : "portfolio/";

    const name = (typeof input.name === "string" ? input.name : "").trim().replace(/[\r\n\t]+/g, " ").slice(0, 120);
    const email = (typeof input.email === "string" ? input.email : "").trim().slice(0, 200);
    const note = (typeof input.note === "string" ? input.note : "").trim().slice(0, 5000);
    const slug = (typeof input.slug === "string" ? input.slug : "").trim();
    const intent = input.intent === "start" ? "start" : "feedback";

    if (!name || !email || !note) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!isEmail(email)) {
      return NextResponse.json({ error: "That email does not look right" }, { status: 400 });
    }

    if (limited(`portal-ip:${clientIp(request.headers)}`, 5, 60 * 60_000) || limited(`portal-to:${email.toLowerCase()}`, 2, 24 * 60 * 60_000)) {
      return NextResponse.json({ error: "Too many notes. Please try again later." }, { status: 429 });
    }

    const deliverable = portal.deliverables.find((d) => d.slug === slug);
    const about = deliverable ? deliverable.title : "The package overall";

    const url = `https://loveleedaystudios.com/p/${portfolioLink ? linkBase : ""}${portal.token ?? ""}${!portfolioLink && deliverable ? "/" + deliverable.slug : ""}`;
    await sendEmail({ internal: true, to: alertsTo(), replyTo: email, template: "portal-note-alert",
      subject: `${intent === "start" ? "Ready to start" : "Portal note"} — ${portal.client}: ${name.replace(/[\r\n]/g, " ")}`,
      paragraphs: [`Review note from ${name} <${email}>`, `Client: ${portal.client}\nIntent: ${intent}\nAbout: ${about}\nProject: ${portal.project}\nRound: ${portal.round}`, note],
      action: { label: "Open review", url } });
    try {
      await sendEmail({ to: email, template: "portal-note-confirmation", subject: `We received your note — ${portal.client}`,
        paragraphs: [`Hi ${name},`, "Thank you for taking the time to share your thoughts. We have your note and will read it carefully.", `Your note: ${note.slice(0, 300).replace(/Arthur/gi, "our team")}${note.length > 300 ? "…" : ""}`, "We will come back to you within one business day. You can reply to this email if there is anything else you would like us to know.", "Warmly,\nThe LOVELEEDAY team"] });
    } catch (error) { console.error("Portal confirmation failed after alert", { to: email, error }); }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Portal note error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
