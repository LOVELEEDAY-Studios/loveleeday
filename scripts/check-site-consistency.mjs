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

// Our internal state is not the customer's business. Each of these reached a public page or the client-facing design on
// 2026-10-05 and Daniel had to catch it: vendor-access stages, our own (Dabney) accounts dressed up as client connections,
// and working-notes vocabulary. A public page says what a customer can do today, and nothing about where we are stuck.
const INTERNAL_STATE = [
  /vendor approval/i, /coming soon/i, /live (at|with) (a )?(customer|client)/i, /approved connectors?/i,
  /not switched on/i, /\bsandbox\b/i, /partner program/i, /\bUNVERIFIED\b/, /developer (app|account)s?\b/i,
  /awaiting (vendor|approval)/i, /pending (vendor )?approval/i,
];

// A logo tile is a span whose class list holds ic-logo, or sq together with logo. Every one must carry a real image (no
// initials fallback) and the brand-colour tint, so a connector can never ship as a blank or grey square again.
const logoTiles = (html) => [...html.matchAll(/<span\b([^>]*\bclass="([^"]*)"[^>]*)>([\s\S]*?)<\/span>/g)]
  .filter((m) => /(^|\s)ic-logo(\s|$)/.test(m[2]) || (/(^|\s)sq(\s|$)/.test(m[2]) && /(^|\s)logo(\s|$)/.test(m[2])))
  .map((m) => ({ attrs: m[1], inner: m[3], src: (m[3].match(/<img\b[^>]*\bsrc="([^"]+)"/) || [])[1] || null }));

function checkContent(label, html, problems, srcExists) {
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
  for (const re of INTERNAL_STATE) if (re.test(text)) problems.push(`${label}: shows internal status wording ${re} to the public`);
  for (const t of logoTiles(html)) {
    if (!t.src) { problems.push(`${label}: a logo tile has no image (initials fallback): ${t.inner.replace(/<[^>]+>/g, "").trim().slice(0, 20) || "(empty)"}`); continue; }
    if (srcExists && !srcExists(t.src)) problems.push(`${label}: logo ${t.src} does not exist`);
    if (!/style="[^"]*background\s*:\s*#[0-9a-fA-F]{6,8}/.test(t.attrs)) problems.push(`${label}: logo tile ${t.src} has no brand-colour tint`);
  }
}

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
  const srcExists = (src) => !/^https?:/.test(src) && fs.existsSync(path.join(root, "public", decodeURI(src.split(/[?#]/)[0])));
  for (const p of pages) {
    const html = fs.readFileSync(p, "utf8"), label = path.relative(root, p);
    compare(label, html, ref, problems);
    checkContent(label, html, problems, srcExists);
  }

  // One source of truth: every system a public page names as connectable must be Available in the integrations data,
  // so a hand-typed list can never contradict the directory again.
  const dataFile = path.join(root, "src/content/integrations.json");
  if (fs.existsSync(dataFile)) {
    const available = new Set(JSON.parse(fs.readFileSync(dataFile, "utf8")).items.filter((i) => i.status === "Available").map((i) => i.name));
    for (const p of pages) {
      const html = fs.readFileSync(p, "utf8");
      for (const m of html.matchAll(/<div class="c"><span class="sq logo"[^>]*>[\s\S]*?<b>([^<]+)<\/b>/g)) {
        const name = m[1].replace(/&amp;/g, "&").trim();
        if (!available.has(name)) problems.push(`${path.relative(root, p)}: lists "${name}", which is not Available in src/content/integrations.json`);
      }
    }
  }

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
  const logoSeen = new Set();
  for (const loc of locs) {
    const u = new URL(loc), route = u.pathname.replace(/\/$/, "") || "/";
    if (allowed(route)) continue;
    const page = await get(base + u.pathname);
    if (page.status !== 200) { problems.push(`${route}: HTTP ${page.status}`); continue; }
    compare(route, page.html, ref, problems);
    checkContent(route, page.html, problems, null);
    for (const t of logoTiles(page.html)) {
      if (!t.src || logoSeen.has(t.src)) continue;
      logoSeen.add(t.src);
      const r = await fetch(new URL(t.src, base + "/"), { method: "HEAD" }).catch(() => null);
      if (!r || r.status !== 200) problems.push(`${route}: logo ${t.src} returns ${r ? r.status : "no response"}`);
    }
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
