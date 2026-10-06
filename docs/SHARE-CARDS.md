# Share cards

Every public page under `public/site/` gets its own 1200x630 link-preview card and a complete set of share meta, with no per-page work. Add `public/site/anything.html` with a `<title>`, a meta description and an `<h1>`; the next build does the rest, and a missing, stale or reused card fails the build.

## How it works

- Source of truth is the page itself. Headline: the `<h1>`, split into the white line and the tan line at a `<br>` or a trailing `<span>`. Caption: the title without ` — LOVELEEDAY`. Photo: the first photo the page uses, else `hero.jpg`. Description: the page's meta description.
- `npm run build` runs `scripts/share-cards.mjs` first (the `prebuild` step), so every Vercel deploy regenerates what changed, then `scripts/check-site-consistency.mjs` verifies the result and fails the deploy on anything it cannot fix.
- Rendering is pure Node: satori lays the card out (text becomes vector paths, using the self-hosted Inter in `scripts/share-cards/fonts/`), sharp crops the photo and encodes the JPEG. No headless browser, so it behaves the same on a laptop and in Vercel.
- Each card is recorded in `public/site/assets/share/manifest.json` with a content hash of its inputs (headline, caption, photo bytes, mark, fonts and the renderer source). Unchanged cards are skipped; editing the template re-renders all of them.
- Meta is written into the static HTML at build time, not injected at request time: crawlers read the HTML file as served, a build step cannot fail at runtime, and it is the same pattern as `site-postprocess.mjs`. Existing tags are updated in place and a page that is already correct is not touched. The tags are canonical, `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image` (with `?v=<hash>` so a changed card is a new URL and crawlers refetch it), width, height, alt, `og:locale`, and `twitter:card=summary_large_image` with title, description and image.
- Hidden pages are skipped: any page whose route is covered by a redirect in `next.config.ts`, any page with `robots` noindex, or any listed in `hidden` in `scripts/share-cards/config.json`. Adding a redirect hides the page from this system automatically.

## Commands

```
npm run cards          render stale or missing cards, rewrite page meta, prune orphans, verify
npm run cards:check    change nothing; exit 2 listing every problem (what pre-push and CI run)
npm run check:site     the full site check; includes the card check
npm run check:site:live   also HEADs every live page's og:image (200 and an image content type)
node scripts/share-cards-selftest.mjs   proves the checks can fail (runs in a temp copy)
npm run hooks:install  optional: repo pre-push that runs cards:check, then the global hook
```

## What fails

A public page with no card, a card that is not 1200x630 or is over 5 MB, an og:image that does not exist, a page that points at another page's card or has a byte-identical one, a card that no longer matches its page (headline, caption, photo or template changed), a card file changed by hand, an orphan card, missing or wrong share tags, a canonical that does not match the route, a title over 70 characters, a description over 200 or under 40, a missing card photo.

On Vercel the build regenerates stale cards itself, so staleness is repaired there; the failures that stop a deploy are the ones nothing can fix (limits, missing photo, reuse, hand edits). Locally, `npm run cards` then commit the changed files, so the repo matches what ships.

## Override a card

Highest precedence first.

1. In the page `<head>`:
   - `<meta name="card:headline" content="White line|Tan line">`
   - `<meta name="card:caption" content="Small line under the headline">`
   - `<meta name="card:photo" content="industry-retail.jpg">` (a file in `public/site/assets/`, or an absolute `/site/...` path)
   - `<meta name="card:image" content="/site/assets/my-card.jpg">` for a finished 1200x630 card made elsewhere (notes cards work this way). It is validated for size and uniqueness but not rendered.
2. Without touching the page: `scripts/share-cards/config.json`, `pages["<file under public/site>"]` with `headline`, `line1`, `line2`, `caption`, `photo`, `ogType`; or `pathRules` for a whole folder (`work/` sets the second line and caption, `notes/` sets `og:type` article).
3. Otherwise derived from the page, as above.

Pages that share the default photo look alike; give a page its own with `card:photo`. A headline too long for one line shrinks from 66px to 52px, then wraps to at most three lines, then truncates, so it can never overflow.
