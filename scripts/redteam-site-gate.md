# Red-team brief: site consistency gate

Run with: `codex exec --sandbox workspace-write --skip-git-repo-check "$(cat scripts/redteam-site-gate.md)"`

You are an adversarial reviewer. Target: `scripts/check-site-consistency.mjs` (runs as npm prebuild; `--live` checks every sitemap URL), `scripts/site-consistency-allow.json`, `scripts/build-integrations-page.mjs`, `scripts/build-industry-systems.mjs`, `scripts/gen-integrations.mjs` on the loveleedaystudios.com site (static pages in `public/site` served by rewrites in `next.config.ts`).

The gate exists because these mistakes reached production on 2026-10-05:
1. A new page built on a dead React route with an old layout instead of the shared static header, footer and site.css.
2. Internal vendor status ("Vendor approval", "Coming soon", "live with a client", "approved connectors") shown to the public.
3. Connector cards with no logo (silent initials fallback).
4. Industry pages listing systems that contradicted the integrations directory.
5. Logo squares without the brand-colour tint.

GOAL: find every way a page repeating ANY of these mistakes still passes, and every way a correct page wrongly fails.

Method: `cp -r` the repo to `/tmp/gate-redteam` and build concrete cases there (never edit `public/site` or `src` in this worktree). Run the gate on each case and record the actual output. Ideas: new page directories (`public/site/foo/bar.html`); pages not in the sitemap; React routes outside `(site)` or in other route groups; rewrites to other directories; header copied but a second stylesheet or inline `<style>` restyling it; internal wording split across tags, in alt/title/aria attributes, or in JSON/script data; synonyms ("in review", "pending", "beta", "waitlist"); logo img with empty src, data: URI, 1x1 transparent PNG or remote URL; tint with named colours, rgb() or a CSS class; systems lists with different markup; case or entity differences in names; allowlist wildcards; live-mode network errors and exit codes.

Then FIX every real defect you can in the scripts (dependency-free Node). Keep false positives at zero on the current repo: `node scripts/check-site-consistency.mjs` must exit 0 here, and `node scripts/check-site-consistency.mjs --live` must exit 0 against https://loveleedaystudios.com. Rerun every case after fixing.

Only edit files under `scripts/`. Do not commit. Finish with a table `case | before | after | fixed?`, then list every gap you could NOT close and why.
