# LOVELEEDAY landing redesign — shared build brief

Build ONE self-contained landing-page mockup as a single standalone **.html** file (inline `<style>`, fonts via Google Fonts CDN, NO build step, NO external JS frameworks). It must render correctly at **1280px wide** (it will be scaled into a moodboard iframe) and degrade gracefully at 390px. Pure HTML/CSS; tiny inline `<script>` only if genuinely needed.

This is a premium redesign of loveleedaystudios.com. The founder called the current site "amateur" and wants it to look like a **serious, grown-up data-intelligence company** (Palantir / Stripe / Vercel / Linear tier). Your mockup must clear that bar.

## What LOVELEEDAY is (use this, in plain language — NO data jargon)
LOVELEEDAY builds **Arthur**, "the object layer for the business you already run." Records scattered across payments, ledgers, documents and email are resolved into single **objects** — each one carrying the date it was true in the world, the date we learned it, and a trail back to the system it came from. Every workflow runs on the object, not the spreadsheet.

## Real copy to use (keep meaning; you may tighten)
- Wordmark: **LOVELEEDAY** (never "LOVELEEDAY Studios" in copy). A simple heart/spark mark is fine.
- Nav: Product · Solutions · Services · Company · Sign in · **Talk to us** (primary CTA button)
- Hero statement: **The object layer for the business you already run.**
- Hero sub: "Records scattered across payments, ledgers and documents are resolved into single objects — each carrying the date it was true, the date we learned it, and a trail back to the system it came from."
- Hero CTAs: **Talk to us** (primary) · **See how Arthur works** (secondary)
- Footnote near hero: "For organizations across the United States."

### PRODUCT-AS-PROOF block (this is the hero's centerpiece or sits right under it — the current site's biggest miss is showing no product). Show Arthur answering ONE plain question by resolving across systems, with visible SOURCE TRAIL chips. Use this example, and LABEL it "Illustrative — not a customer":
- Question: "Which contracts renew next quarter, and who owns them?"
- Answer resolves across sources shown as chips/rows: **CRM** (Northline Studio) · **Billing** (Northline Studio Ltd) · **Ledger** (Vendor 44127) · **Contracts** (Harbor Equipment Services) → one object, "Northline Studio," renews next quarter, owner named, clause + date attached.
- Small line: "Same company, four names — resolved to one object, every value traceable to its source."

### The five guarantees (section: "Enforced, not promised") — number them 01–05:
- 01 **Identity resolution** — A payments customer, a vendor id in the ledger and a string in an email signature are three records and one company. You ask about the object, never about whichever string a source happened to use.
- 02 **Bitemporality** — Every property knows when it was valid in the world and when it was observed. Judging an August decision with September knowledge is look-ahead bias; the two timelines are kept apart so it can't happen quietly.
- 03 **Lineage** — Writing a value requires its source system and source reference. The trail prints for any figure. A number with no trail is not reportable.
- 04 **Bounded autonomy** — Actions are classified by blast radius. Only the reversible class runs unattended; anything touching money, outbound communication or a legal document waits for a person.
- 05 **Observed completion** — Work closes on a value read back out of the system that was supposed to change. An HTTP 200 is not evidence anything happened.

### Industries band (one line each, scannable): Hospitality & experiences · Manufacturing & distribution · Property & facilities · Schools & charters · Groups & portfolios · Retail & commerce · Professional services · Local government · Nonprofits & community organizations. (LOVELEEDAY serves every industry — do NOT frame around bars/restaurants.)

### Closing CTA: "Begin with one question about one system." Primary button **Talk to us**. (NO pricing anywhere — we never show prices publicly.)

### Footer: LOVELEEDAY · one-line tagline · column links (Product / Solutions / Industries / Services / Company) · "© 2026 LOVELEEDAY Studios LLC" (entity only here) · United States.

## HARD design rules (these are what separate pro from amateur)
1. **No generic stock photography as the hero.** The product (Arthur answering, with source trails / lineage / status) is the visual centerpiece. If you use any photography, it is one deliberate, high-craft human-outcome moment, never a laptop-stock cliché.
2. **Strong type hierarchy** — a real display/section/body/label ladder with big contrast between tiers. Never one weight/size for everything. Never the "big headline + pale thin second line" trick.
3. **Distinctive type** — use real, characterful web fonts from Google Fonts (per direction below). NOT Arial/Helvetica/system defaults, NOT generic.
4. **Conviction in color** — a committed palette with one decisive accent used sparingly for action/verified status. No lifeless all-gray cards, no default `rounded-lg` AI-slop, no drop-shadow soup.
5. **Density with hierarchy** — one lead element, one clear action, a compact supporting list. Generous but intentional whitespace, aligned to a grid. Tabular numerals for any figures.
6. **Accessible** — real contrast on all essential text, status shown by more than color, visible focus states.
7. Verify your file opens standalone in a browser with no console errors and no horizontal overflow at 1280 and 390.

Write ONLY your one assigned HTML file. Return its absolute path and 2 lines on the design language you executed.
