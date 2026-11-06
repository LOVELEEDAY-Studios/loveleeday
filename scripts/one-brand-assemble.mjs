#!/usr/bin/env node
/* one-brand-assemble.mjs <page.html> <body-file> [--css name,name]
   Rebuilds a page for the one-brand kit: keeps the page's <head> (title, description, canonical, share and card meta, schema,
   icons), drops its old stylesheets, theme-color and <style> blocks, adds the kit's head lines (+ assets/ob/<name>.css for each
   --css), then appends the body file (everything from <body> to </html>) and stamps the chrome and ?v= hashes.
   Run from the repo root. The body file holds <body class="ob ..."> <!--ob:top--><!--/ob:top--> <main>...</main> <!--ob:bottom--><!--/ob:bottom--> scripts </body></html>. */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const [page, bodyFile, ...rest] = process.argv.slice(2);
if (!page || !bodyFile) { console.error('usage: one-brand-assemble.mjs <page.html> <body-file> [--css a,b]'); process.exit(1); }
const css = rest[0] === '--css' ? rest[1].split(',') : [];
const src = fs.readFileSync(page, 'utf8');
const headEnd = src.indexOf('</head>');
let head = src.slice(0, headEnd);
head = head.replace(/<link[^>]+rel="stylesheet"[^>]*>/g, '').replace(/<meta name="theme-color"[^>]*>/g, '').replace(/<style\b[\s\S]*?<\/style>/g, '');
head = head.replace(/<!--ob:[\s\S]*$/, '');
/* the share-card tool takes a card photo from the first jpg in the page, and the stamped chrome now carries nav images: pin the photo the page had */
if (!/name="card:photo"/.test(head) && !/<!--ob:top-->/.test(src)) {
  const first = [...src.matchAll(/assets\/([a-z0-9-]+\.jpg)/g)].map(m => m[1]).find(f => !f.startsWith('share'));
  if (first) head = head.replace(/(<meta name="robots")/, `<meta name="card:photo" content="${first}">$1`);
}
const kit = fs.readFileSync('public/site/assets/ob/ob-page-head.txt', 'utf8');
const extra = css.map(c => `<link rel="stylesheet" href="/site/assets/ob/${c}.css?v=HASH">\n`).join('');
fs.writeFileSync(page, head + '\n' + kit + extra + '</head>\n' + fs.readFileSync(bodyFile, 'utf8'));
execFileSync('node', ['scripts/one-brand-chrome.mjs', page], { stdio: 'inherit' });
