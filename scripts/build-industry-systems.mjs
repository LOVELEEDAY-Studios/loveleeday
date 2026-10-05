#!/usr/bin/env node
// Fill the "Systems it connects to" block on each industry page from src/content/integrations.json, listing only
// connectors a customer can use today (status Available) and never a status label: where we stand with a vendor is not
// the customer's concern. Re-run after gen-integrations.mjs.   node scripts/build-industry-systems.mjs
import fs from "node:fs";

const PAGES = {
  manufacturing: ["dynamics-365-business-central", "dynamics-365-finance-operations", "epicor-prophet-21", "sap-business-one", "microsoft-365", "csv-excel-upload"],
  property: ["buildium", "xero", "google-workspace", "microsoft-365", "box", "csv-excel-upload"],
};
const { items } = JSON.parse(fs.readFileSync("src/content/integrations.json", "utf8"));
const COLORS = JSON.parse(fs.readFileSync("src/content/logo-colors.json", "utf8"));
const tint = (i) => { const c = (i.logo && COLORS[i.logo.split("/").pop()]) || "#5B6472"; return `background:${c}2E;border-color:${c}73`; };
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

for (const [page, keys] of Object.entries(PAGES)) {
  const file = `public/site/industries/${page}.html`;
  const html = fs.readFileSync(file, "utf8");
  const rows = keys.map((k) => items.find((i) => i.key === k && i.status === "Available")).filter(Boolean)
    .map((i) => `<div class="c"><span class="sq logo" style="${tint(i)}">${i.logo ? `<img src="${esc(i.logo)}" alt="${esc(i.name)} logo" loading="lazy">` : esc(i.name[0])}</span><div><b>${esc(i.name)}</b><span class="t">${esc(i.reads)}</span></div></div>`);
  if (rows.length < 3) throw new Error(`${page}: only ${rows.length} available systems matched; check the keys`);
  const start = html.indexOf('<div class="sys">');
  const end = html.indexOf('<p class="xs muted mt16"', start);
  if (start < 0 || end < 0) throw new Error(`${page}: systems block not found`);
  fs.writeFileSync(file, html.slice(0, start) + `<div class="sys">\n${rows.join("\n")}\n</div>\n` + html.slice(end));
  console.log(page, rows.length, "systems");
}
