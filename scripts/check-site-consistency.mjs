#!/usr/bin/env node
// Every public page must wear the live site's design system: the same header, the same footer, the same site.css.
// Built after /integrations shipped as a React route on the superseded (site) layout ("Arthur 4.0" strip, second nav row,
// cream ground) while every real page is static HTML under public/site sharing one header and footer. Nothing failed:
// the build passed and the page screenshotted fine in isolation. This makes "does it match the site" a check that can fail.
//
//   node scripts/check-site-consistency.mjs              static: public/site/**/*.html + React routes vs rewrites (prebuild)
//   node scripts/check-site-consistency.mjs --live [url] live: every <loc> in sitemap.xml vs the live homepage
// Exit 2 on any mismatch. Known exceptions live in scripts/site-consistency-allow.json, each with a reason.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const allow = JSON.parse(fs.readFileSync(path.join(root, "scripts/site-consistency-allow.json"), "utf8"));
const allowed = (route) => allow.routes.some((a) => a.route === route || (a.route.endsWith("/*") && route.startsWith(a.route.slice(0, -1))));

// Old-layout fingerprints: if any of these reach a public page, it is on the superseded design.
const FORBIDDEN = [/Arthur 4\.0/, /About the Ontology/];

const block = (html, tag) => (html.match(new RegExp(`<${tag}[\\s>][\\s\\S]*?</${tag}>`, "i")) || [""])[0];
// Only per-page or per-request noise is normalized away: which nav item is current, cache-busting query strings, and
// Cloudflare's email obfuscation (it re-encodes every address with a fresh key on each response).
const norm = (s) => s
  .replace(/\s+aria-current="[^"]*"/g, "")
  .replace(/\?v=[A-Za-z0-9_-]+/g, "")
  .replace(/\/cdn-cgi\/l\/email-protection#[0-9a-f]+/g, "/cdn-cgi/l/email-protection")
  .replace(/data-cfemail="[0-9a-f]+"/g, 'data-cfemail=""')
  .replace(/<span class="__cf_email__"[^>]*>\[email&#160;protected\]<\/span>/g, "EMAIL")
  .replace(/<a [^>]*href="mailto:[^"]*"[^>]*>[^<]*<\/a>/g, (m) => m.replace(/>[^<]*</, ">EMAIL<"))
  .replace(/\s+/g, " ").trim();
const usesSiteCss = (html) => /<link[^>]+rel="?stylesheet"?[^>]+href="?\/site\/assets\/site\.css/i.test(html);

function compare(label, html, ref, problems) {
  const h = norm(block(html, "header")), f = norm(block(html, "footer"));
  if (!h) problems.push(`${label}: no <header>`); else if (h !== ref.header) problems.push(`${label}: header differs from the homepage`);
  if (!f) problems.push(`${label}: no <footer>`); else if (f !== ref.footer) problems.push(`${label}: footer differs from the homepage`);
  if (!usesSiteCss(html)) problems.push(`${label}: does not load /site/assets/site.css`);
  for (const re of FORBIDDEN) if (re.test(html)) problems.push(`${label}: carries old-layout marker ${re}`);
}

function staticMode() {
  const problems = [];
  const siteDir = path.join(root, "public/site");
  const index = fs.readFileSync(path.join(siteDir, "index.html"), "utf8");
  const ref = { header: norm(block(index, "header")), footer: norm(block(index, "footer")) };
  if (!ref.header || !ref.footer) { console.error("public/site/index.html has no header/footer to compare against"); process.exit(2); }
  const pages = [];
  (function walk(d) {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) { if (f !== "assets") walk(p); } else if (f.endsWith(".html")) pages.push(p);
    }
  })(siteDir);
  for (const p of pages) compare(path.relative(root, p), fs.readFileSync(p, "utf8"), ref, problems);

  // A React page under src/app/(site) renders the superseded layout unless a rewrite or redirect shadows its route.
  const config = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");
  const sources = new Set([...config.matchAll(/source:\s*"([^"]+)"/g)].map((m) => m[1]));
  const appDir = path.join(root, "src/app/(site)");
  const routes = [];
  (function walk(d, r) {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) walk(p, `${r}/${f.replace(/^\[(.+)\]$/, ":$1")}`);
      else if (f === "page.tsx" || f === "page.jsx") routes.push(r || "/");
    }
  })(appDir, "");
  for (const r of routes) {
    if (sources.has(r) || allowed(r)) continue;
    problems.push(`route ${r}: served by a React page on the old (site) layout; build it as public/site/*.html with a rewrite, or add it to site-consistency-allow.json with a reason`);
  }
  return { problems, checked: pages.length + routes.length };
}

async function liveMode(base) {
  const problems = [];
  const get = async (u) => { const r = await fetch(u, { redirect: "follow" }); return { status: r.status, url: r.url, html: await r.text() }; };
  const home = await get(base + "/");
  const ref = { header: norm(block(home.html, "header")), footer: norm(block(home.html, "footer")) };
  if (!ref.header || !ref.footer) { console.error(`${base}/ has no header/footer to compare against`); process.exit(2); }
  const xml = (await get(base + "/sitemap.xml")).html;
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (!locs.length) { console.error("sitemap.xml listed no URLs: nothing was checked"); process.exit(2); }
  for (const loc of locs) {
    const u = new URL(loc), route = u.pathname.replace(/\/$/, "") || "/";
    if (allowed(route)) continue;
    const page = await get(base + u.pathname);
    if (page.status !== 200) { problems.push(`${route}: HTTP ${page.status}`); continue; }
    compare(route, page.html, ref, problems);
  }
  return { problems, checked: locs.length };
}

const live = process.argv.indexOf("--live");
const { problems, checked } = live > -1 ? await liveMode((process.argv[live + 1] || "https://loveleedaystudios.com").replace(/\/$/, "")) : staticMode();
if (problems.length) {
  console.error(`site consistency: ${problems.length} problem(s) across ${checked} checked\n  ${problems.join("\n  ")}`);
  process.exit(2);
}
console.log(`site consistency: ${checked} checked, all match the homepage header, footer and site.css`);
