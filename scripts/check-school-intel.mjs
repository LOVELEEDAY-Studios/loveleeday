import { readFileSync } from "node:fs";

const sources = ["src/content/hub/school-intel.ts", "src/app/p/school-intel/[token]/page.tsx"];
const issues = [];
for (const path of sources) {
  const text = readFileSync(path, "utf8");
  for (const match of text.matchAll(/\$\s*\d[\d,.]*\s*[KMB]?\b|\b\d+(?:\.\d+)?\s*%|\b\d+(?:\.\d+)?\s+days\b/gi)) {
    issues.push(`${path}: ${match[0]}`);
  }
}
const data = JSON.parse(readFileSync("src/content/hub/school-intel-data.json", "utf8"));
function inspect(value, path = "root") {
  if (Array.isArray(value)) return value.forEach((item, index) => inspect(item, `${path}[${index}]`));
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (key === "file") issues.push(`${path}.file`);
      inspect(item, `${path}.${key}`);
    }
  } else if (typeof value === "string" && /\.xls|\.md\b|research\/|school-work|Training School|City|EdOps/i.test(value)) {
    issues.push(`${path}: prohibited string`);
  }
}
inspect(data);
if (issues.length) {
  console.error(`school-intel check failed:\n${issues.join("\n")}`);
  process.exit(1);
}
console.log("school-intel check passed: source literals and JSON exclusions");
