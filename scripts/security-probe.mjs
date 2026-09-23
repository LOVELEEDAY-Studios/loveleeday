// Outside-in security probe of LOVELEEDAY's own public surface: the marketing
// site, the client portal and the client database, the way an attacker would
// look at them first. Non-destructive: reads, plus one anonymous write attempt
// that RLS must refuse.
//
//   node scripts/security-probe.mjs            → table + exit 1 on any FAIL
//   node scripts/security-probe.mjs --json     → machine-readable
//
// Every check can fail and returns the value it saw, so a green line is evidence,
// not an assumption.

const SITE = "https://loveleedaystudios.com";
const PORTAL = "https://arthur-online.fly.dev";
const SB = "https://eydcfgoklajcztpoprsl.supabase.co";
// Public anon key (RLS-gated, already shipped in the portal bundle and fly.toml).
const ANON = process.env.LL_ANON_KEY;
const TABLES = ["tenants", "memberships", "invites", "deliverables", "contracts", "audit_log"];

const results = [];
const add = (area, check, status, seen) => results.push({ area, check, status, seen: String(seen).slice(0, 160) });
const get = (url, opt = {}) => fetch(url, { redirect: "manual", ...opt, signal: AbortSignal.timeout(20000) });

async function headers(label, url) {
  const r = await get(url);
  const h = r.headers;
  const hsts = h.get("strict-transport-security");
  add(label, "HSTS", hsts && /max-age=(\d+)/.test(hsts) && +hsts.match(/max-age=(\d+)/)[1] >= 15552000 ? "PASS" : "FAIL", hsts || "missing");
  const csp = h.get("content-security-policy") || "";
  add(label, "clickjacking (frame-ancestors / X-Frame-Options)", /frame-ancestors/.test(csp) || h.get("x-frame-options") ? "PASS" : "FAIL", h.get("x-frame-options") || (csp.match(/frame-ancestors[^;]*/) || ["missing"])[0]);
  add(label, "X-Content-Type-Options nosniff", h.get("x-content-type-options") === "nosniff" ? "PASS" : "FAIL", h.get("x-content-type-options") || "missing");
  add(label, "Referrer-Policy", h.get("referrer-policy") ? "PASS" : "WARN", h.get("referrer-policy") || "missing");
  add(label, "Content-Security-Policy", csp ? (/script-src[^;]*'unsafe-inline'/.test(csp) ? "WARN" : "PASS") : "WARN", csp ? csp.slice(0, 120) : "missing");
  add(label, "server fingerprint hidden", h.get("x-powered-by") ? "WARN" : "PASS", h.get("x-powered-by") || "no x-powered-by");
  const plain = await get(url.replace("https://", "http://"));
  add(label, "http → https redirect", [301, 308].includes(plain.status) && (plain.headers.get("location") || "").startsWith("https://") ? "PASS" : "FAIL", `${plain.status} ${plain.headers.get("location") || ""}`);
}

async function exposedFiles(label, base) {
  for (const p of ["/.env", "/.env.local", "/.env.production", "/.git/HEAD", "/.git/config", "/.DS_Store", "/backup.zip", "/db.sql", "/.vercel/project.json", "/fly.toml", "/Dockerfile"]) {
    const r = await get(base + p);
    const body = r.status === 200 ? (await r.text()).slice(0, 200) : "";
    const leaked = r.status === 200 && /(=|ref:|\[core\]|PK|CREATE TABLE|app =|FROM )/.test(body);
    add(label, `not exposed: ${p}`, leaked ? "FAIL" : "PASS", leaked ? `200 ${body.slice(0, 60)}` : r.status);
  }
}

function jwtRole(tok) {
  try { return JSON.parse(Buffer.from(tok.split(".")[1], "base64url").toString()).role; } catch { return null; }
}

async function bundleSecrets(label, pageUrl) {
  const html = await (await get(pageUrl, { redirect: "follow" })).text();
  const srcs = [...new Set([...html.matchAll(/src="([^"]+\.js[^"]*)"/g)].map((m) => new URL(m[1], pageUrl).href))];
  const found = [];
  for (const s of srcs) {
    const js = await (await get(s)).text();
    for (const m of js.matchAll(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/g)) {
      const role = jwtRole(m[0]);
      if (role && role !== "anon") found.push(`JWT role=${role} in ${s.split("/").pop()}`);
    }
    for (const [re, name] of [[/sk_live_[A-Za-z0-9]{10,}/, "Stripe live secret"], [/AKIA[0-9A-Z]{16}/, "AWS key"], [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "private key"], [/SUPABASE_SERVICE_ROLE|service_role_key/i, "service-role reference"], [/re_[A-Za-z0-9]{8,}_[A-Za-z0-9]{10,}/, "Resend key"]]) {
      if (re.test(js)) found.push(`${name} in ${s.split("/").pop()}`);
    }
  }
  add(label, `no secrets in ${srcs.length} shipped JS files`, found.length ? "FAIL" : "PASS", found.join("; ") || "clean");
}

async function authGates() {
  for (const p of ["/client", "/client/team", "/client/contracts", "/client/billing", "/client/account"]) {
    const r = await get(PORTAL + p);
    const loc = r.headers.get("location") || "";
    add("portal", `signed-out ${p} is gated`, [302, 303, 307, 308].includes(r.status) && /login/.test(loc) ? "PASS" : "FAIL", `${r.status} ${loc}`);
  }
  for (const p of ["/dashboard", "/api/client/team/invite"]) {
    const r = await get(PORTAL + p, p.startsWith("/api") ? { method: "POST", headers: { "content-type": "application/json" }, body: "{}" } : {});
    add("portal", `signed-out ${p} refused`, r.status >= 300 && r.status !== 404 ? "PASS" : r.status === 404 ? "WARN" : "FAIL", r.status);
  }
}

async function database() {
  if (!ANON) return add("database", "anon key", "WARN", "LL_ANON_KEY not set, database checks skipped");
  const h = { apikey: ANON, Authorization: `Bearer ${ANON}` };
  for (const t of TABLES) {
    const r = await get(`${SB}/rest/v1/${t}?select=*&limit=5`, { headers: h });
    const body = await r.text();
    const rows = r.ok ? JSON.parse(body || "[]").length : 0;
    add("database", `anonymous cannot read ${t}`, rows === 0 ? "PASS" : "FAIL", `${r.status} rows=${rows}`);
  }
  const w = await get(`${SB}/rest/v1/tenants`, { method: "POST", headers: { ...h, "content-type": "application/json", Prefer: "return=representation" }, body: JSON.stringify({ name: "probe", slug: `probe-${Date.now()}` }) });
  add("database", "anonymous cannot write tenants", w.status >= 400 ? "PASS" : "FAIL", `${w.status} ${(await w.text()).slice(0, 80)}`);
  const rpc = await get(`${SB}/rest/v1/rpc/create_tenant`, { method: "POST", headers: { ...h, "content-type": "application/json" }, body: JSON.stringify({ p_name: "probe", p_slug: `probe-${Date.now()}` }) });
  add("database", "anonymous cannot call create_tenant", rpc.status >= 400 ? "PASS" : "FAIL", rpc.status);
  const s = await (await get(`${SB}/auth/v1/settings`, { headers: h })).json();
  add("auth", "email confirmation required", s.mailer_autoconfirm === false ? "PASS" : "FAIL", `mailer_autoconfirm=${s.mailer_autoconfirm}`);
  add("auth", "open self-signup", s.disable_signup ? "PASS" : "WARN", `disable_signup=${s.disable_signup} (invite flow needs signup; tenant creation is staff-only)`);
}

await headers("site", SITE + "/");
await headers("portal", PORTAL + "/client/login");
await exposedFiles("site", SITE);
await exposedFiles("portal", PORTAL);
await bundleSecrets("site", SITE + "/");
await bundleSecrets("portal", PORTAL + "/client/login");
await authGates();
await database();

if (process.argv.includes("--json")) console.log(JSON.stringify(results, null, 1));
else {
  for (const r of results) console.log(`${r.status.padEnd(4)}  ${r.area.padEnd(8)}  ${r.check.padEnd(48)}  ${r.seen}`);
  const c = (s) => results.filter((r) => r.status === s).length;
  console.log(`\n${c("PASS")} pass · ${c("WARN")} warn · ${c("FAIL")} fail`);
}
process.exit(results.some((r) => r.status === "FAIL") ? 1 : 0);
