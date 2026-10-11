# Site fixes from the 2026-10-11 review (branch sitefix-2026-10-11)

Nothing from this branch is deployed. No push to main. Worktree: ~/wt/ll-sitefix (node_modules there is a dir of symlinks to ~/Projects/loveleeday/node_modules plus satori/sharp/opentype.js from /tmp/ll-extra; recreate if needed because share-cards needs satori).
Gates run locally and pass: `npm run check:site`, `npm run test:voice`, `node scripts/share-cards.mjs` verify.
Render helper: `~/arthur/scripts/ll-site-shot.sh ~/wt/ll-sitefix <outdir> <1440|390> site/<page>.html ...` (cloud render, lean stage). Shots so far in ~/arthur/data/loveleeday-review-2026-10-11/fixes/after/ (390: terms, schools, integrations; 1440: schools, industries, manufacturing, index, integrations, notes, terms, contact). The 1440 shots were taken but NOT yet looked at.

## Findings
- #5 /terms mobile: DONE in code (fix/terms.css mobile block resets .tm-shell). 390 render checked: width 390, readable. Not live.
- #6 Schools page: DONE in code. public/site/industries/schools.html (cloned from property), rewrite in next.config.ts, sitemap.ts, header/footer chrome, home industry list (9th item spans full row via site.css), link from industries.html schools card, share card rendered. 390 render checked; 1440 not yet viewed. Not live.
- #4 /integrations: DONE in code. Only brevo and toast (probe-verified live in tenant_connections, capability loveleeday.client_connections LIVE_VERIFIED) read "Ready to connect"; other 58 "Planned"; runtime status override removed; no count. List in src/content/connector-verified.json. Not live.
- #10 CSP and HSTS: DONE in code (next.config.ts). Full CSP enforced on marketing routes only (p, portal, team keep report-only); HSTS max-age=63072000; includeSubDomains; preload (all subdomains enumerated in Cloudflare: apex, www, portal, demo, doorlight, wildcard; all valid HTTPS). Must verify live that the later Content-Security-Policy header replaces the frame-ancestors-only one, and rerun ~/arthur/scripts/steel-site-walk.mjs on live to look for CSP console errors on every page. Not live.
- #11 page weight: DONE in code. scripts/make-card-images.py makes 960px WebP in public/site/assets/cards/; used on industries, industry pages, notes, build (width/height set). Verify live byte totals.
- #12 repeated question: DONE. Note rec-h now "Which staff certifications run out this quarter..."; arthur page example (fix/arthur.js and pill) changed to energy use. Gate extended (notes, rec-h, fx-ask-card, fix/*.js ask). Note: architecture.html still has the claim chip "Three contracts renew next quarter" (a claim, not a question); left.
- #13 empty tiles: DONE in code. The three tiles were lazy images not loaded in the review screenshot; now eager WebP with width/height. Verify on live render.
- #14 typography: PARTIAL. Manrope self-hosted (assets/fonts/manrope-latin.woff2, @font-face + --sans, word-spacing .1em because negative letter-spacing squeezed words). Palette not changed (live white/blue system kept). Needs a look at 1440 and 390 on index, contact, industries for wrapping or overflow.
- #15 forms: DONE in code. /api/contact: origin check, honeypot (field "website" added to both brief forms), under-2s trap (JS sends elapsed), type/length checks, link cap; noscript mailto fallback. site.js changed. Not tested end to end; no real submission made.
- #16 smaller notes: robots.ts now allows AI search/assistant crawlers on marketing pages (CCBot stays blocked); 21 page titles rewritten with search phrases (generator for integrations updated). Portal items (white space, wrapping) belong to the portal agent: not touched.

## Left to do
1. Look at the 1440 shots and the 390 shots of index/industries/notes/build; run visual-critic.mjs on schools, terms, industries, manufacturing; fix defects.
2. Merge: branch is based on origin/main 5b32f2f; git push origin HEAD:main (fast-forward), per ~/.claude/skills/loveleeday-render-check-deploy.
3. After Vercel deploys, probe live with unique strings: "Ready to connect" on /integrations, "Know what is due," on /industries/schools, tm-shell rule via shot of /terms at 390, response headers (CSP enforced, HSTS includeSubDomains; preload), "cards/industry-" in /industries, "Which staff certifications" on the note, and a POST to /api/contact with honeypot filled (expect ok without mail) and with a bad Origin (expect 403).
4. Save before/after shots into fixes/ (before shots are in ../shots/).
