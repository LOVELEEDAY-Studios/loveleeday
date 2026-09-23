/* Who opened a pitch page: a prospect, us, or a machine.

   Every private page view is written to `page_views` in the Dabney Supabase project,
   next to `email_opens`, so one report answers both. The IP is kept only as the same
   16-character hash the open pixel uses, which is enough to recognise our own
   addresses and nothing more. Our visits are marked three ways: the ll_team cookie
   (set once per device at /api/t/me), our IP hashes in `team_ips`, and automation
   user agents. Report: node ~/arthur/scripts/page-views.mjs */

export const TEAM_COOKIE = "ll_team";

export const isAutomation = (ua: string) =>
  !ua ||
  /bot|crawl|spider|slurp|preview|scan|fetch|monitor|uptime|validator|curl|wget|python|axios|okhttp|headless|phantom|puppeteer|playwright|facebookexternalhit|Slackbot|Twitterbot|WhatsApp|LinkedInBot|TelegramBot|Discordbot|Barracuda|Proofpoint|Mimecast|Symantec|MessageLabs|SafeLinks|urldefense|GoogleImageProxy|YahooMailProxy|ggpht/i.test(ua) ||
  // Mail-security sandboxes announce long-dead browsers: Lanette's first "open" was Chrome 42 on
  // Windows, 33 seconds after sending (2026-09-23). No person runs a 2015 browser.
  /Chrome\/([1-5]?[0-9])\./.test(ua);

export async function hashIp(ip: string) {
  if (!ip) return null;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip.toLowerCase()));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

export const clientIp = (headers: Headers) =>
  (headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || headers.get("x-real-ip") || "";

async function insert(table: string, row: Record<string, unknown>) {
  const url = process.env.OPENS_SUPABASE_URL;
  const key = process.env.OPENS_SUPABASE_ANON_KEY;
  if (!url || !key) return;
  const r = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
  if (!r.ok) console.error(`${table}_store_failed`, r.status, (await r.text()).slice(0, 200));
}

export async function recordView(headers: Headers, path: string, teamCookie: boolean) {
  const ua = headers.get("user-agent") ?? "";
  await insert("page_views", {
    path: path.slice(0, 300),
    ip_hash: await hashIp(clientIp(headers)),
    ua: ua.slice(0, 400) || null,
    team_cookie: teamCookie,
    automation: isAutomation(ua),
    referer: headers.get("referer")?.slice(0, 300) ?? null,
  });
}
