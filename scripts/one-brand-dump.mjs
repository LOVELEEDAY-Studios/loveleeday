#!/usr/bin/env node
/* one-brand-dump.mjs <page.html ...>  Prints a page's <main> as a plain outline (headings, paragraphs, list items, links, images, forms)
   so a one-brand rebuild can keep the facts and wording. Reads the file as it is on disk (use git show for the original). */
import fs from 'node:fs';
for (const f of process.argv.slice(2)) {
  const html = fs.readFileSync(f, 'utf8');
  const main = (html.match(/<main[\s\S]*<\/main>/) || [''])[0];
  console.log('=== ' + f + '  (' + (html.match(/<title>([^<]*)/) || [])[1] + ')');
  const out = main
    .replace(/<script[\s\S]*?<\/script>|<svg[\s\S]*?<\/svg>|<style[\s\S]*?<\/style>/g, '')
    .replace(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g, '\n[IMG $1 | $2]\n')
    .replace(/<img[^>]*src="([^"]+)"[^>]*>/g, '\n[IMG $1]\n')
    .replace(/<(form|canvas|input|select|textarea|button)\b[^>]*?(id|name)="([^"]*)"[^>]*>/g, '\n[$1 #$3]\n')
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>/g, '[link:$1 ')
    .replace(/<\/a>/g, ']')
    .replace(/<(section|article|h1|h2|h3|h4|p|li|div|details|summary|label|figure|figcaption|blockquote|tr)\b[^>]*?(class="[^"]*")?[^>]*>/g, (m, t) => '\n<' + t + '> ')
    .replace(/<br\s*\/?>/g, ' / ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&#8599;|&rarr;/g, '>').replace(/&middot;/g, '.')
    .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n');
  console.log(out.trim());
}
