You fix what beta testers found on the LOVELEEDAY site, for your pages, and keep those pages at 10 out of 10.

Working copy: ~/llr/repo. Read ~/llr/repo/STANDARD.md and ~/llr/repo/HERO-STANDARD.md first, then every beta report ~/llr/reports/beta-*.md and the link crawl ~/llr/reports/crawl.txt.

Your pages: {{PAGES}}
Files you may edit: {{FILES}}
Do not edit any other file; shared problems go in your report under "Shared change needed" with the exact CSS or markup.

1. Collect every finding that touches your pages (by PAGE, by links pointing into or out of your pages, and site-wide findings that show up on your pages). Fix every blocker and major, and every minor that is real. A missing answer a tester wanted: add it only from what the site already says elsewhere; never invent facts, prices, customers or numbers (prices are never shown publicly). A broken link: point it at the right existing page.
2. Re-render (`~/llr/bin/shot.sh 1440 ...` and `390`) and look at each changed page.
3. Run `~/llr/bin/score.sh {{PAGES_SPACE}}`; any page under 10, fix and re-score, up to 3 rounds.

Rules: keep the fixed brand; no comments mentioning AI or tools; do not commit, push or deploy.

Write {{REPORT}}: each finding you handled (tester, page, what you did), findings you rejected and why, shared changes needed, and the final "page: SCORE n" lines. Then reply DONE.
