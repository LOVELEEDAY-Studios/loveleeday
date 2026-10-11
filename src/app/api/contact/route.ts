import { sendEmail, alertsTo } from "@/lib/email";
import { NextResponse } from "next/server";
import { isEmail, limited } from "@/lib/guard";
import { clientIp } from "@/lib/visits";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    let name: string, email: string, projectType: string, budget: string, details: string;
    let honeypot: unknown, elapsedMs: unknown;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      name = body.name as string;
      email = body.email as string;
      projectType = body.project_type as string;
      budget = body.budget as string;
      details = body.details as string;
      honeypot = body.website;
      elapsedMs = body.elapsed;
    } else {
      const formData = await request.formData();
      name = formData.get("name") as string;
      email = formData.get("email") as string;
      projectType = formData.get("project_type") as string;
      budget = formData.get("budget") as string;
      details = formData.get("details") as string;
      honeypot = formData.get("website");
      elapsedMs = formData.get("elapsed") ?? undefined;
    }

    // Spam and malformed input are refused here, not trusted to the page script (the form works only because site.js
    // posts it, and anyone can post to this route directly).
    // 1. Cross-site posts: a browser always names the page that sent it. Only this site, the portal and local dev may.
    const origin = request.headers.get("origin");
    if (origin && !/^https:\/\/(www\.)?loveleedaystudios\.com$|^https:\/\/portal\.loveleedaystudios\.com$|^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$|^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
      return NextResponse.json({ error: "This form can only be sent from our website." }, { status: 403 });
    }
    // 2. Honeypot: a field people never see. A bot fills it; we answer as if it worked and send nothing.
    if (typeof honeypot === "string" && honeypot.trim() !== "") return NextResponse.json({ ok: true });
    // 3. A form filled in under two seconds was not typed by a person.
    if (elapsedMs !== undefined && Number.isFinite(Number(elapsedMs)) && Number(elapsedMs) < 2000) return NextResponse.json({ ok: true });
    for (const [label, v, max] of [["name", name, 200], ["email", email, 254], ["project type", projectType, 100], ["budget", budget, 100], ["details", details, 10_000]] as const) {
      if (v !== undefined && v !== null && (typeof v !== "string" || v.length > max)) {
        return NextResponse.json({ error: `The ${label} is not valid.` }, { status: 400 });
      }
    }
    if (!name || !email || !details) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (name.trim().length < 2 || /https?:\/\/|www\./i.test(name)) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    if (details.trim().length < 15) return NextResponse.json({ error: "Please tell us a little more about your question." }, { status: 400 });
    if ((details.match(/https?:\/\/|www\./gi) ?? []).length > 3 || /<\s*(script|iframe)\b/i.test(details)) {
      return NextResponse.json({ error: "Please remove the links from your message and send it again." }, { status: 400 });
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
    name = String(name).slice(0, 200);
    projectType = String(projectType ?? "").slice(0, 100);
    budget = String(budget ?? "").slice(0, 100);
    details = String(details).slice(0, 10_000);

    const rawDetails = details;
    const customerQuestion = (rawDetails.split("THE QUESTION\n")[1]?.split("\n\n")[0] || rawDetails).slice(0, 500).replace(/Arthur/gi, "our team");
    await sendEmail({ internal: true, to: alertsTo(), replyTo: email, template: "brief-alert", subject: subjectLine,
      paragraphs: ["A new project brief has arrived.", `Name: ${plain(name, 200)}\nEmail: ${email}\nProject type: ${plain(projectType, 100) || "Not specified"}\nBudget: ${plain(budget, 100) || "Not specified"}`, rawDetails] });
    try {
      await sendEmail({ to: email, template: "brief-confirmation", subject: "We received your project brief — LOVELEEDAY",
        paragraphs: [`Hi ${plain(name, 120)},`, "Thank you for sending your brief. We have it and are reading it now.", `Your question: ${customerQuestion}`, "We aim to reply within one working day to talk through next steps. You can reply here if anything else comes to mind.", "Warmly,\nThe LOVELEEDAY team"] });
    } catch (error) { console.error("Brief confirmation failed after alert", { to: email, error }); }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
