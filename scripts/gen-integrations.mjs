// Generates src/content/integrations.json from the portal connector catalog and copies logos.
// Usage: node scripts/gen-integrations.mjs
import fs from "node:fs";
import path from "node:path";

const PORTAL = "/Users/danielmay/Projects/arthur-launch";
const SRC = `${PORTAL}/lib/connectors/definitions.generated.ts`;
const OUT = new URL("../src/content/integrations.json", import.meta.url).pathname;
const LOGO_OUT = new URL("../public/integrations/logos/", import.meta.url).pathname;

// Sign-in (oauth2_authcode) connectors whose production vendor credentials are configured.
// Mirrors the CONNECTOR_OAUTH_* secrets on the portal. Update only when a secret is added there.
const SIGN_IN_CONFIGURED = new Set([
  "airtable", "box", "calendly", "clickup", "clio-manage", "dropbox-business",
  "google-workspace", "monday", "pipedrive", "typeform", "xero",
]);

// Same groups, same order, as GROUPS in lib/client-portal/connector-ui.ts.
const GROUPS = [
  ["accounting", "Accounting and ERP", ["erp", "accounting"]],
  ["crm", "CRM and sales", ["crm"]],
  ["commerce", "Commerce, POS and payments", ["commerce", "pos", "payments"]],
  ["marketing", "Marketing and email", ["marketing"]],
  ["support", "Customer support", ["support"]],
  ["work", "Projects and work management", ["project_management"]],
  ["documents", "Files, documents and e-signature", ["files", "esignature", "productivity"]],
  ["people", "Payroll and HR", ["hr_payroll"]],
  ["property", "Property and construction", ["property", "construction"]],
  ["public", "Public sector, nonprofit and legal", ["public_sector", "nonprofit", "legal"]],
  ["data", "Data warehouses and uploads", ["warehouse", "ingest"]],
  ["other", "Other systems", []],
];
const CATEGORY_LABEL = {
  erp: "ERP", accounting: "Accounting", crm: "CRM and sales", commerce: "Commerce", pos: "Point of sale", payments: "Payments",
  marketing: "Email marketing", property: "Property management", construction: "Construction", hr_payroll: "Payroll and HR",
  public_sector: "Public sector", nonprofit: "Donor management", legal: "Legal practice", warehouse: "Data warehouse",
  files: "Files", ingest: "File upload", productivity: "Email and documents",
  support: "Customer support", project_management: "Project management", esignature: "E-signature",
};

const src = fs.readFileSync(SRC, "utf8");
// Employer-owned systems are never listed: QAD belongs to Superior Essex (Daniel's employer), not to the product.
const EXCLUDE = new Set(["qad-adaptive-erp"]);
const defs = JSON.parse(src.slice(src.indexOf("= [") + 2, src.lastIndexOf("];") + 1)).filter((d) => !EXCLUDE.has(d.key));

const lower = (t) => t.split(" ").map((w) => (/^[A-Z]{2,}$/.test(w) ? w : w.toLowerCase())).join(" ");
const humanize = (o) =>
  lower(o.replace(/\s*\(.*?\)/g, "").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").trim());
const messy = (o) => /[\/_]| v\d| or |\(|Journal|Entries|Lines/.test(o) || o.split(" ").length > 3;

// Hand-written lines where the catalog's object names do not read as plain English.
const OVERRIDES = {
  "amazon-s3": "Reads CSV, JSON, Parquet and PDF files in the folders you choose. Read-only.",
  "azure-synapse": "Reads the tables and views you grant to a read account. Read-only.",
  clover: "Reads orders, payments, customers and items. Read-only.",
  "csv-excel-upload": "Reads a spreadsheet or CSV you send us, mapped to your columns.",
  databricks: "Reads the catalog tables and views you grant. Read-only.",
  "dynamics-365-finance-operations": "Reads customers, vendors, sales orders and invoices. Read-only.",
  "google-bigquery": "Reads the datasets you share with a read account. Read-only.",
  "google-workspace": "Reads labeled mail, calendar events, Drive files and sheet values. Read-only.",
  homebase: "Reads locations, employees, shifts and timecards. Read-only.",
  laserfiche: "Reads the folders, documents and metadata you scope. Read-only.",
  "microsoft-365": "Reads Outlook mail, SharePoint libraries, OneDrive files and Teams messages. Read-only.",
  netsuite: "Reads customers, vendors, invoices and vendor bills. Read-only.",
  "sage-intacct": "Reads customers, vendors, receivable invoices and payable bills. Read-only.",
  salesforce: "Reads accounts, contacts, leads and opportunities. Read-only.",
  "sftp-drop": "Reads the CSV or spreadsheet files you drop on a schedule. Read-only.",
  snowflake: "Reads the tables and views you grant to a read role. Read-only.",
  toast: "Reads checks, employees, cash entries and menu setup. Read-only.",
  "tyler-munis": "Reads vendors, payable invoices, purchase orders and budgets. Read-only.",
  workday: "Reads workers, organizations and job profiles. Read-only.",
};

function reads(objects) {
  const clean = (objects || []).filter((o) => !messy(o));
  const pool = clean.length >= 2 ? clean : (objects || []).map((o) => o.split("/")[0]);
  const seen = [];
  for (const o of pool) {
    const h = humanize(o);
    if (h && !seen.includes(h)) seen.push(h);
    if (seen.length === 4) break;
  }
  if (!seen.length) return "Reads the files you send us. Read-only.";
  const list = seen.length > 1 ? `${seen.slice(0, -1).join(", ")} and ${seen.at(-1)}` : seen[0];
  return `Reads ${list}. Read-only.`;
}

const method = (a) => (a === "oauth2_authcode" ? "Sign in" : ["none", "upload", "sftp"].includes(a) ? "File" : "Key");

fs.mkdirSync(LOGO_OUT, { recursive: true });
const items = defs.map((d) => {
  const group = GROUPS.find((g) => g[2].includes(d.category)) ?? GROUPS.at(-1);
  let status;
  if (d.access_gate === "partner/license") status = "Vendor approval";
  else if (d.auth_method !== "oauth2_authcode") status = "Available";
  else status = SIGN_IN_CONFIGURED.has(d.key) ? "Available" : "Coming soon";
  const logo = d.logo ? path.basename(d.logo) : null;
  if (logo) {
    const from = `${PORTAL}/public/connectors/logos/${logo}`;
    if (fs.existsSync(from)) fs.copyFileSync(from, LOGO_OUT + logo);
  }
  return {
    key: d.key, name: d.name, vendor: d.vendor, group: group[0], category: CATEGORY_LABEL[d.category] ?? d.category,
    method: method(d.auth_method), status, reads: OVERRIDES[d.key] ?? reads(d.objects),
    // Catalog logo first; otherwise a mark committed here under the connector key (vendor logo or a plain file/server icon).
    logo: logo && fs.existsSync(LOGO_OUT + logo) ? `/integrations/logos/${logo}`
      : ((f) => (f ? `/integrations/logos/${f}` : null))(["svg", "png"].map((x) => `${d.key}.${x}`).find((f) => fs.existsSync(LOGO_OUT + f))),
  };
});

const out = {
  groups: GROUPS.map(([id, label]) => ({ id, label, count: items.filter((i) => i.group === id).length })),
  items,
};
const missing = items.filter((i) => i.status === "Available" && !i.logo).map((i) => i.key);
if (missing.length) throw new Error(`Available connectors missing logos: ${missing.join(", ")}`);
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
const c = {};
items.forEach((i) => (c[i.status] = (c[i.status] || 0) + 1));
console.log(items.length, c, items.filter((i) => i.status === "Available" && i.method === "Sign in").map((i) => i.key).join(","));
