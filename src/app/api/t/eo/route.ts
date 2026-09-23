import { createHash } from "node:crypto";
import { after } from "next/server";
import { isAutomation } from "@/lib/visits";

export const dynamic = "force-dynamic";

/**
 * The LOVELEEDAY host for Arthur's email open pixel, so a LOVELEEDAY email never carries a
 * drinkswithdabney.com image. It mirrors go.drinkswithdabney.com/eo (~/arthur/social/dabney-track)
 * exactly and writes to the same `email_opens` table, so `arthur-email-opens` answers for both.
 * Tokens are minted by ~/arthur/lib/email/open-tracking.js.
 */
const GIF = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

const isProxy = (ua: string) => /GoogleImageProxy|YahooMailProxy|ggpht/i.test(ua);
const isBot = (ua: string) =>
  !ua || isProxy(ua) ||
  /bot|crawl|spider|slurp|preview|scan|fetch|monitor|uptime|validator|curl|wget|python-requests|axios|okhttp|headless|phantom|puppeteer|playwright|facebookexternalhit|Slackbot|Twitterbot|WhatsApp|LinkedInBot|TelegramBot|Discordbot|Barracuda|Proofpoint|Mimecast|Symantec|MessageLabs|SafeLinks|urldefense/i.test(ua);

export async function GET(request: Request) {
  const t = new URL(request.url).searchParams.get("t");
  if (t) {
    const ua = request.headers.get("user-agent") ?? "";
    const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
    const row = {
      token: t.slice(0, 64),
      ua: ua ? ua.slice(0, 400) : null,
      ip_hash: ip ? createHash("sha256").update(ip.toLowerCase()).digest("hex").slice(0, 16) : null,
      proxy: isBot(ua) || isAutomation(ua),
      referer: request.headers.get("referer")?.slice(0, 300) ?? null,
    };
    after(async () => {
      const key = process.env.OPENS_SUPABASE_ANON_KEY ?? "";
      const r = await fetch(`${process.env.OPENS_SUPABASE_URL}/rest/v1/email_opens`, {
        method: "POST",
        headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify(row),
      });
      if (!r.ok) console.error("email_open_store_failed", r.status, (await r.text()).slice(0, 200));
    });
  }
  return new Response(GIF, {
    headers: { "Content-Type": "image/gif", "Cache-Control": "no-store, no-cache, must-revalidate, private", Pragma: "no-cache", Expires: "0" },
  });
}
