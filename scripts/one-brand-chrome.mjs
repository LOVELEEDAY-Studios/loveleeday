#!/usr/bin/env node
/* one-brand-chrome.mjs [--check] <page.html ...>
   Stamps the home page's header, phone menu, footer and phone call-to-action bar into pages, so the chrome has one source:
   public/site/index.html. Pages hold two marker pairs, filled and refreshed by this script:
     <!--ob:top--> ... <!--/ob:top-->        skip link, header, phone menu   (first thing in <body>)
     <!--ob:bottom--> ... <!--/ob:bottom-->  footer and phone bar            (right after </main>)
   A page without markers gets them inserted. The only change from home is that the same-page "#join" link becomes "/#join".
   --check changes nothing and exits 2 if any page is out of date.  Run from the repo root. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args = process.argv.slice(2);
const check = args[0] === '--check';
const pages = check ? args.slice(1) : args;
if (!pages.length) { console.error('usage: one-brand-chrome.mjs [--check] <page.html ...>'); process.exit(1); }

const home = fs.readFileSync(path.resolve('public/site/index.html'), 'utf8');
const grab = (re, what) => { const m = home.match(re); if (!m) { console.error('home page has no ' + what); process.exit(1); } return m[0]; };
const header = grab(/<header class="nav" id="nav">[\s\S]*?<\/header>/, 'header');
const menu = grab(/<div class="mm" id="mm"[\s\S]*?<\/div>\n<\/div>/, 'phone menu');
const footer = grab(/<footer class="foot" id="footer">[\s\S]*?<\/footer>/, 'footer');
const bar = grab(/<div class="cta-bar" id="ctabar">[\s\S]*?<\/div>/, 'phone bar');
const fix = s => s.replaceAll('href="#join"', 'href="/#join"').replace(/ aria-current="page"/g, '');
const noCurrent = s => s.replace(/ aria-current="page"/g, ''); // site-postprocess owns aria-current, per page
const top = `<!--ob:top-->\n<a class="sr" href="#main">Skip to content</a>\n\n${fix(header)}\n\n${fix(menu)}\n<!--/ob:top-->`;
const bottom = `<!--ob:bottom-->\n${fix(footer)}\n\n${fix(bar)}\n<!--/ob:bottom-->`;

let stale = 0;
for (const p of pages) {
  const src = fs.readFileSync(p, 'utf8');
  let out = src;
  if (/<!--ob:top-->/.test(out)) out = out.replace(/<!--ob:top-->[\s\S]*?<!--\/ob:top-->/, () => top);
  else out = out.replace(/(<body[^>]*>)/, (_, b) => b + '\n' + top);
  if (/<!--ob:bottom-->/.test(out)) out = out.replace(/<!--ob:bottom-->[\s\S]*?<!--\/ob:bottom-->/, () => bottom);
  else out = out.replace(/<\/main>/, () => '</main>\n' + bottom);
  out = out.replace(/(\/site\/assets\/[\w\/.-]+\.(?:css|js))\?v=\w+/g, (m, u) => {
    const fp = path.resolve('public' + u);
    return fs.existsSync(fp) ? u + '?v=' + crypto.createHash('sha1').update(fs.readFileSync(fp)).digest('hex').slice(0, 10) : m;
  });
  if (noCurrent(out) === noCurrent(src)) out = src;
  if (out !== src) { stale++; if (!check) fs.writeFileSync(p, out); console.log((check ? 'stale ' : 'stamped ') + p); }
  else console.log('current ' + p);
}
process.exit(check && stale ? 2 : 0);
