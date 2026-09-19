# Collab Capital portfolio — site audit

Measured 2026-09-18 against live sites. Every company below returned HTTP 200 on
the date of measurement. Numbers are from a single uncached request per site and
should be re-measured before they are quoted to anyone.

## How the company list was established

The list is the fund's own, not a guess. An earlier pass in this session worked
from guessed domains and got several wrong — `toolbelt.com`, `riverhealth.com`,
`nectar.ai`, `clear.com` and `kairos.com` all resolved to unrelated companies,
and `collabcapital.com` is a parked domain that is not the fund. The fund is at
`collab.capital`, and it publishes a detail page per company at
`collab.capital/companies/<slug>` carrying the official outbound link. Thirty-eight
of forty resolved that way; the two that did not are the two marked acquired.

Correct domains that a guess gets wrong: Backpack Healthcare is `hellobackpack.com`,
Clear is `cleareyetest.com`, Hush is `gohush.com`, Homegrown is `joinhomegrown.com`,
Nectar is `usenectar.com`, Toolbelt is `toolbelt.work`, River Health is
`helloriver.com`, Janta Power is `jantaus.com`, Kairos is `kairoswater.io`,
Weir is `weir.ai`, A0 is `a0.dev`, BrightUp is `getbrightup.com`.

## Three things the fund cannot see from its own portfolio page

**Two companies have rebranded and the fund still lists the old name.** CircNova
now trades as **Novarna** — `circnova.com` serves a page titled "Novarna — The AI
Design Engine for RNA Medicines" and carries a banner reading "CircNova is now
Novarna — same team, same science, sharper focus." Hubble IQ now trades as
**Fyxit AI** — `hubbleiq.com` serves "Fyxit AI — IT Visibility for Lean Teams"
and leads with a product called Rosie. Collab's portfolio page lists both under
their former names. A third, UScope Technologies, goes to market as **PHOTO ID**
at `photoidapp.net`, which the fund's own link does reflect.

**The portfolio page links to none of its forty companies.** Checked directly:
zero `href` values on `collab.capital/portfolio` point at a company detail page,
and the card element wrapping a company name has no anchor ancestor, no click
handler, and `cursor: auto`. The detail pages exist and carry the outbound links;
nothing on the portfolio index reaches them. Every visitor who wants to look at a
portfolio company has to leave and search for it.

**The fund's own site is a purchased Webflow template.** The footer of
`collab.capital` credits `lucasgusso.webflow.io`.

## Portfolio-wide findings

- **27 of 38 (71%)** run on a no-code or template builder: 11 WordPress, 9 Webflow,
  2 Wix, 2 Squarespace, 2 Shopify, 1 Framer. Eleven are custom or could not be
  fingerprinted from markup.
- **15 of 38 (39%)** send no security headers at all — no HSTS, CSP, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy or Permissions-Policy.
- **13 of 38 (34%)** have no `og:image`, so every link the fund or a founder shares
  on LinkedIn, Slack or iMessage renders as a bare grey rectangle.
- **15 of 38 (39%)** have no meta description, leaving Google to invent the search snippet.
- **17 of 38 (44%)** do not have exactly one `<h1>`. Micruity has ten; UScope has nine.
- **18 of 38 (47%)** publish no structured data.
- Median page weight is 146 KB, but the mean is 359 KB — the distribution is dragged
  by a long tail. Soarce ships **5,009 KB**. Healthy Hip Hop ships 1,440 KB.
- Median TTFB is 0.46s. Slowest is BrightUp at 1.64s.

## A defect the numbers do not catch

Seven of the eighteen sites rendered in a browser open with a **cookie consent
modal covering the hero** — Janta Power, River Health, Intus Care, Healthy Hip Hop,
Toolbelt, Revry and Clear. On several the banner obscures the primary call to
action. This is invisible to a crawler and to every metric above; it only appears
when you load the page and look at it. It is also the cheapest fix in this document.

## Full measurements

| Company | Domain | Builder | Weight | Scripts | TTFB | Sec hdrs | H1 |
|---|---|---|---|---|---|---|---|
| A0 | `a0.dev` | custom/unknown | 156 KB | 71 | 0.59s | 2/6 | 0 |
| Backpack Healthcare | `hellobackpack.com` | Webflow | 80 KB | 20 | 0.41s | 1/6 | 1 |
| Blue Butterfly | `bluebutterfly.com` | WordPress | 373 KB | 71 | 0.47s | 3/6 | 1 |
| Bluecore Energy | `bluecore.energy` | Webflow | 49 KB | 21 | 0.65s | 1/6 | 1 |
| BrightUp | `getbrightup.com` | custom/unknown | 46 KB | 19 | 1.64s | 1/6 | 1 |
| CircNova | `circnova.com` | custom/unknown | 74 KB | 34 | 0.38s | 0/6 | 1 |
| Clear | `cleareyetest.com` | custom/unknown | 91 KB | 5 | 0.4s | 1/6 | 0 |
| Culina Health | `culinahealth.com` | WordPress | 185 KB | 24 | 0.18s | 0/6 | 1 |
| Employee Cycle | `employeecycle.com` | WordPress | 327 KB | 83 | 0.56s | 0/6 | 2 |
| FanFest | `fanfest.io` | custom/unknown | 72 KB | 2 | 0.91s | 1/6 | 1 |
| Goodr | `goodr.co` | WordPress | 136 KB | 33 | 0.39s | 1/6 | 1 |
| Greenlyne | `greenlyne.ai` | WordPress | 397 KB | 41 | 0.4s | 0/6 | 1 |
| Healthy Hip Hop | `healthy.hiphop` | Wix | 1440 KB | 70 | 1.02s | 2/6 | 2 |
| Homegrown | `joinhomegrown.com` | Framer | 605 KB | 19 | 0.35s | 2/6 | 1 |
| Hubble IQ | `hubbleiq.com` | custom/unknown | 12 KB | 6 | 0.77s | 3/6 | 0 |
| Hush | `gohush.com` | custom/unknown | 126 KB | 41 | 1.14s | 0/6 | 1 |
| ImIn | `imin2.com` | WordPress | 157 KB | 36 | 0.27s | 0/6 | 1 |
| Intus Care | `intuscare.com` | WordPress | 195 KB | 48 | 0.41s | 2/6 | 2 |
| Janta Power | `jantaus.com` | Squarespace | 4 KB | 3 | 0.28s | 0/6 | 0 |
| Kairos | `kairoswater.io` | custom/unknown | 20 KB | 23 | 0.72s | 1/6 | 0 |
| LoanWell | `loanwell.com` | Webflow | 44 KB | 9 | 0.22s | 0/6 | 1 |
| Mae | `meetmae.com` | custom/unknown | 90 KB | 18 | 0.26s | 6/6 | 1 |
| Micruity | `micruity.com` | WordPress | 231 KB | 34 | 0.91s | 0/6 | 10 |
| Myya | `myya.com` | Shopify | 260 KB | 68 | 0.2s | 0/6 | 3 |
| NICKLpass | `nicklpass.com` | Webflow | 110 KB | 16 | 0.37s | 1/6 | 1 |
| Nectar | `usenectar.com` | Webflow | 75 KB | 23 | 0.57s | 1/6 | 1 |
| Planet FWD | `planetfwd.com` | Webflow | 178 KB | 27 | 0.43s | 3/6 | 1 |
| Please Assist Me | `pleaseassistme.com` | Webflow | 46 KB | 18 | 0.44s | 1/6 | 1 |
| Posterchild | `posterchild.ai` | Webflow | 235 KB | 36 | 0.68s | 1/6 | 2 |
| Revry | `revry.tv` | Squarespace | 646 KB | 60 | 0.59s | 1/6 | 0 |
| River Health | `helloriver.com` | custom/unknown | 5 KB | 6 | 0.54s | 0/6 | 0 |
| Soarce | `soarceusa.com` | Wix | 5009 KB | 67 | 0.69s | 2/6 | 2 |
| Sparkcharge | `sparkcharge.io` | Webflow | 83 KB | 28 | 0.46s | 1/6 | 3 |
| Stack Influence | `stackinfluence.com` | Shopify | 193 KB | 38 | 0.17s | 0/6 | 1 |
| Toolbelt | `toolbelt.work` | WordPress | 384 KB | 36 | 0.79s | 0/6 | 1 |
| UScope Technologies | `photoidapp.net` | WordPress | 678 KB | 132 | 0.33s | 0/6 | 9 |
| Weir | `weir.ai` | custom/unknown | 8 KB | 10 | 0.7s | 3/6 | 2 |
| Writesea | `writesea.com` | WordPress | 814 KB | 83 | 0.81s | 0/6 | 1 |
## What this audit does not claim

It does not measure Core Web Vitals, accessibility beyond image alt coverage, or
anything behind a login. Page weight is the initial document plus what a single
request reports, not the fully-loaded transfer size. "Custom/unknown" means no
builder fingerprint appeared in the served markup, which is not proof the site is
hand-built. Company-level judgments about which sites look dated are mine, made
from 1440px desktop screenshots, and are opinion rather than measurement.
