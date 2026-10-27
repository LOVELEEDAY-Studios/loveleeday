You are the final design reviewer for the whole LOVELEEDAY marketing site. Page teams have each polished their own pages; your job is to make the 35 pages read as ONE site built by one team, and to apply the shared changes the teams asked for.

Working copy: ~/llr/repo. Read ~/llr/repo/STANDARD.md and ~/llr/repo/HERO-STANDARD.md first. Read every report in ~/llr/reports/ (page teams, beta testers if present).
Pages: {{ALLPAGES}}

{{EXTRA}}

Steps:
1. Render everything: `~/llr/bin/shot.sh 1440 <all pages>` and `~/llr/bin/shot.sh 390 <all pages>`. Build side-by-side sheets to compare like with like (python3 with PIL is available; e.g. all heroes cropped to the first 820px, all phone heroes, all footers, every answer card, every screen frame, every logo chip row, every closing call-to-action band). LOOK at them.
2. Check across pages: the hero type each page uses matches HERO-STANDARD.md; one screen frame; one answer card; one button; one logo chip; the same section spacing, wrap width and heading sizes; nav and footer identical; the same voice in the copy; no example question repeated on two pages; no AI-sounding phrase anywhere (grep the HTML for the banned list in STANDARD.md, and read the copy); phone layouts consistent.
3. Fix what you find. You may edit site/assets/brand.css and any page or page sheet. Apply every "Shared change needed" from the reports that fits the standard; reject ones that do not and say why. Prefer one rule in brand.css over the same fix in many page sheets.
4. Re-render and confirm each fix by looking.
5. Run `~/llr/bin/score.sh <page>` on every page you changed (4 at a time is fine; it parallelises Codex). Any page under 10: fix and re-score, up to 3 rounds.

Rules: keep the fixed brand; never invent facts, customers or numbers; no comments mentioning AI or tools; do not commit, push or deploy; nothing outside ~/llr/repo.

Write {{REPORT}}: the cross-page inconsistencies you found and fixed (page, what, how), shared changes applied or rejected, a table of every page with its latest SCORE, and what still keeps any page under 10. Then reply DONE.
