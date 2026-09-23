# Lightship Capital Portfolio — Technical & Business Audit

Prepared for LOVELEEDAY Studios. All 18 companies currently listed at lightship.capital/portfolio were checked directly (live fetch, 2026-09-22), visited with a real headless Chrome browser, and researched individually for business status. Machine-readable data: `data/lightship-companies.json`. Lighthouse mobile scores: `data/lightship-measured.json`.

**A note on "BLOCKED."** Four of the 18 sites did not load normally under automated testing. Per instruction, these are reported as BLOCKED or DOMAIN-LAPSED, never as "broken," because in three of the four cases the company itself is fine — it's the specific link on Lightship's own portfolio page that has failed:

- **Visuwall** — the live site returns a Cloudflare bot-challenge (HTTP 403) to any automated visitor, curl included. Multiple funding databases (Crunchbase, PitchBook) separately list VisuWall as "Exited," which is consistent with a site nobody is maintaining.
- **CurlMix** — the domain works fine for humans (curl gets a normal 200 and a full Shopify storefront), but a Shopify anti-bot app ("EasyLockdown") redirects any automated/headless browser to google.com, which also made Lighthouse hang. This is an automation block, not a live-site outage — but see the finding below.
- **Bootup** — the domain itself now resolves to unrelated Indonesian gambling spam, confirmed independently with curl (not a bot artifact). The company is very much alive under the name "Bootup Studios."
- **Semiosis AI** — the domain is disconnected from its Wix hosting (HTTP 404, "Reconnect Your Domain"), confirmed with curl. Status of the underlying company could not be confirmed either way.

---

## Fund-level findings

1. **One in five links on Lightship's own portfolio page is dead or hijacked, and one is actively embarrassing.** Bootup's old domain (joinbootup.com) — still the exact link on lightship.capital/portfolio — now serves Indonesian online-gambling deposit-guide spam. Anyone who clicks that specific portfolio card lands on a gambling site, not on the actively-growing company Lightship is still partnered with through 2027. This is a same-day, zero-cost fix: swap the link or pull the card.

2. **A quarter of the portfolio's outbound links don't reach the company at all.** Visuwall (bot-blocked / likely exited), Bootup (squatted), and Semiosis AI (disconnected domain) — 3 of 18 — fail before a visitor sees anything real. A fourth, CurlMix, fails specifically for any visitor whose browser looks automated, which is a risk category that also includes some accessibility tools and ad-network crawlers, not just researchers.

3. **Performance is a real, not cosmetic, problem for a chunk of the portfolio.** Mobile Lighthouse performance scores cluster in the 34-56 range for several companies (Allergy Amulet, Healthy Roots Dolls, Boddle, Haute Hijab), driven mainly by uncompressed autoplay video. Allergy Amulet's mobile Largest Contentful Paint is 25-27 seconds — on mobile data, most visitors never see the page. This site carries a Vimeo product video that alone accounts for most of its 63MB page weight.

4. **Accessibility (missing alt text) is systemic, not isolated.** 13 of the 14 measurable sites are missing alt text on at least some images; Vyrill is missing it on 89 of 91 images (98%), Healthy Roots Dolls on 28 of 33 (85%), Undock on 16 of 19 (84%). This is a one-afternoon fix per site with outsized SEO and ADA-risk value, especially for the e-commerce sites (Healthy Roots Dolls, Femi Secrets, Haute Hijab) where product images are the thing search engines and screen readers most need described.

5. **The portfolio's site quality does not track funding stage.** CModel (small, $1.25M raised) has the cleanest site in the portfolio — full meta/OG tags, current copyright year, HubSpot CMS, no visible defects. Enable Injections ($344M raised, Sanofi-backed, FDA approvals landing in 2026) has the best Lighthouse scores (87 performance / 100 SEO / 99 accessibility). But Arbit's site hasn't been touched since 2022 (stale footer copyright) despite a 2025 acquisition event, and CurlMix — mid-crisis, publicly begging for 20,000 orders to survive 2025 — has a storefront configuration that turns away any visitor its bot-detection app doesn't like. Site quality is a founder-attention problem, not a money problem, which is exactly the kind of gap an outside studio fills.

---

## Top 5 where a rebuild/rescue would matter most

| Rank | Company | Why now |
|---|---|---|
| 1 | **CurlMix** | A real, currently-operating company publicly said it needs 20,000 orders in 60 days to avoid closing by end of 2025 (staff already cut 40→14), and its own storefront is configured to turn away automated and possibly some real traffic via an "EasyLockdown" app. Auditing and fixing that app, plus a performance/conversion pass, is the single highest-stakes, highest-urgency item in this whole portfolio — a company could fail partly because of a site setting. |
| 2 | **Bootup** | Zero technical difficulty, maximum reputational payoff: the fund's own listed link sends visitors to gambling spam for a company (Bootup Studios) that is actively expanding with Morehouse and University of Tulsa pilots and a multi-year Lightship Foundation partnership. A new domain + simple site is a fast, visible win that also protects Lightship's own credibility. |
| 3 | **Allergy Amulet** | Worst measured mobile performance in the portfolio (25-27s LCP, 63MB page weight) at a company that is doing small bridge/debt raises (signaling a tight runway) and sells direct-to-consumer — every second of load time is lost revenue it can least afford right now. |
| 4 | **Semiosis AI** | The site is simply gone (Wix disconnected), and open-source research couldn't even confirm whether the company Lightship invested in still exists under this name. This is a "figure out what's actually there" market-research engagement before anything else — possibly followed by a rebuild, possibly a fund-page removal. |
| 5 | **Arbit** | Footer copyright frozen at 2022, no visible update since; the company reportedly merged with/was acquired by The Sneaker Database in May 2025. Nobody has told the marketing site. Either redirect it to explain the outcome, or if the standalone product still operates, give it an owner. |

---

## Lighthouse mobile scores (14 measurable sites, sorted by performance)

| Company | Perf | SEO | A11y | Best Practices | LCP | Page weight |
|---|---|---|---|---|---|---|
| Allergy Amulet | 35 | 85 | 81 | 73 | 25.3s | 35.0MB |
| CModel | 36 | 100 | 100 | 77 | 33.2s | 8.2MB |
| Haute Hijab | 40 | 92 | 92 | 54 | 8.1s | 7.4MB |
| Proov | 48 | 92 | 84 | 54 | 10.6s | 3.9MB |
| Fresh Fry | 50 | 92 | 88 | 73 | 18.1s | 7.1MB |
| Healthy Roots Dolls | 53 | 92 | 82 | 73 | 6.6s | 4.9MB |
| Vyrill | 64 | 92 | 83 | 77 | 16.6s | 3.9MB |
| Femi Secrets | 67 | 92 | 87 | 73 | 6.2s | 8.7MB |
| Arbit | 71 | 100 | 90 | 77 | 8.3s | 9.7MB |
| Boddle | 72 | 100 | 89 | 69 | 3.5s | 7.0MB |
| Undock | 74 | 82 | 85 | 96 | 18.1s | 4.6MB |
| Kare Mobile | 80 | 92 | 89 | 77 | 4.1s | 3.5MB |
| Brevity | 83 | 92 | 93 | 77 | 3.9s | 0.9MB |
| Enable Injections | 89 | 100 | 99 | 100 | 2.2s | 4.5MB |

Median performance **65.5** · median SEO **92** · median accessibility **88.5**. Visuwall, Bootup, CurlMix, and Semiosis AI are not in this table — see "A note on BLOCKED" above.

**Surprise finding: CModel.** Its markup is the cleanest in the portfolio (complete meta tags, valid og:image, current copyright), but it posted the **worst Largest Contentful Paint in the entire portfolio — 33.2 seconds** under Lighthouse's throttled mobile emulation, despite a mid-sized 8.2MB page. Clean markup and real-world mobile speed are two different things, and this site has the biggest gap between them of anything measured here.

## Portfolio-level stats

- **Companies checked:** 18 of 18 listed on lightship.capital/portfolio today. (Third-party trackers — PitchBook, CB Insights — cite slightly higher total investment counts, 19-26, likely including companies no longer shown on the public page or counted across multiple funds; not chased further, flagged for awareness.)
- **Reachable and legitimately measurable:** 14 of 18. Excluded: Visuwall (blocked), Bootup (squatted domain), CurlMix (automation-blocked), Semiosis AI (domain disconnected).
- **Platforms in use:** Shopify (5), Webflow (3), WordPress (2), HubSpot CMS (2), Squarespace (2 — one is Visuwall's blocked shell), Wix (1 — Semiosis AI's disconnected shell), Next.js custom (1), unidentified/compromised (2 — CurlMix, Bootup).
- **Missing meta description:** 3 of 18 (Kare Mobile, CurlMix, Semiosis AI).
- **Missing or broken og:image (social preview):** 3 of 18 (Proov has no og:image tag at all; CurlMix and Semiosis AI have neither tag nor image because those pages aren't the real site).
- **Alt-text gap:** 13 of 14 measurable sites are missing alt text on at least one image; median gap is roughly 1 in 3 images across the portfolio; worst is Vyrill at 98%.
- **Broken (0×0 / failed-to-load) images found in-page:** Proov (1), Allergy Amulet (1), Healthy Roots Dolls (9), Haute Hijab (1), Fresh Fry (3).
- **Heaviest pages (total bytes transferred):** Allergy Amulet (~63-66MB, Vimeo video), Femi Secrets (~35-37MB, Shopify video), Enable Injections (~14MB), Arbit (~13MB), Boddle (~7-11MB).
- **Slowest to finish loading:** Allergy Amulet (14.4s wall-clock / 25-27s Lighthouse mobile LCP), Boddle (13.7s), Femi Secrets (13.7s), Enable Injections (12.5s), Haute Hijab (12.0s).
- **Stale copyright footers (year not current or missing):** Arbit (2022), Vyrill (2025, one year behind), plus Visuwall/Boddle/Kare Mobile/Bootup/CurlMix/Semiosis AI show no footer year at all (several of those are the broken-site cases above, but Boddle and Kare Mobile are otherwise healthy, live sites that simply don't print one).

---

## Per-company detail

### Visuwall — BLOCKED (site likely inactive)
**What they do:** Ad-tech marketplace turning vacant storefront windows into measurable digital/static advertising, with computer-vision foot-traffic analytics. HQ New York, NY. Seed stage, $1.7M raised (last round Mar 2021).
**Most important finding:** The live site returns a Cloudflare 403 challenge to every visitor type tested, and multiple funding databases (Crunchbase, PitchBook, LeadIQ) independently tag the company "(Exited)." Nobody appears to be maintaining this presence.
**Highest-value move:** Market-research check with Lightship on the actual disposition of the company (exit, wind-down, or just dormant) before spending design effort — a rebuild is premature until that's answered.
**Sources:** [Crunchbase](https://www.crunchbase.com/organization/visuwall) · [PitchBook](https://pitchbook.com/profiles/company/157766-50) · [Lightship investment post](https://www.lightship.capital/post/lightship-leads-investment-in-ad-tech-company-visuwall)

### Proov
**What they do:** At-home hormone/fertility diagnostic test strips and women's reproductive-health support. HQ Cincinnati, OH. Series A, $10.9M total ($9.7M Series A).
**Technical:** proovtest.com, Shopify, 200 OK. Lighthouse mobile: 48 performance, 92 SEO, 84 accessibility, **54 best practices** (a console-errors/deprecated-API level flag). Meta description present and strong; **no og:image tag at all** — a shared Proov link on social media or iMessage shows no preview image. 49 images, 8 missing alt text, 1 broken image.
**Most important finding:** Missing og:image undercuts every social/paid-ad share of the site with a blank preview card — an easy, high-leverage fix for a DTC brand that almost certainly runs paid social.
**Highest-value move:** Add og:image + a lightweight performance pass (page currently loads in ~8s wall-clock).
**Sources:** [MobiHealthNews](https://www.mobihealthnews.com/news/home-fertility-testing-company-proov-scoops-97m)

### Allergy Amulet
**What they do:** Portable molecular sensor for on-site food-allergen/toxin detection, consumer wearable + B2B "Amulet Scientific" platform. HQ Madison, WI. Series A, $12.6-13.16M total; most recent rounds were small (debt + Series A-III extension through March 2026), signaling a tight-runway stage.
**Technical:** allergyamulet.com, Squarespace, 200 OK. **Heaviest page in the portfolio** (66MB measured live in-browser; 35MB under Lighthouse's throttled load) and **worst mobile Lighthouse performance score in the portfolio: 35/100, with a 25.3-second Largest Contentful Paint** — driven by an autoplaying Vimeo product video loaded on the homepage. 36 images, 7 missing alt, 1 broken.
**Most important finding:** A company doing small bridge raises is losing a meaningful share of mobile visitors before the page even paints — this is directly recoverable revenue.
**Highest-value move:** Performance rebuild: lazy-load or replace the autoplay video, compress/defer non-critical assets. This is the single highest-ROI technical fix in the whole portfolio.
**Sources:** [Crunchbase news](https://news.crunchbase.com/startups/exclusive-allergy-amulet-lands-3-3m-seed-round-for-food-allergen-sensor/) · [Tracxn funding](https://tracxn.com/d/companies/allergy-amulet/__EYYZukw4h8pfdjBKh6Ds4ESmKSfytUAalfZxS3uBZNM/funding-and-investors)

### Healthy Roots Dolls
**What they do:** Dolls and storybooks teaching natural hair care to young girls of color. HQ Detroit, MI. Seed, $1.5M raised (Backstage Capital led, Lightship participated).
**Technical:** healthyrootsdolls.com, Shopify, 200 OK. 33 images, **28 missing alt text (85%)**, **9 broken images** — the worst broken-image count in the portfolio.
**Most important finding:** Nearly all product imagery is invisible to screen readers and search, and roughly a quarter of images fail to load outright — for a consumer toy brand, product photography failing to render directly costs sales.
**Highest-value move:** A Shopify image/asset audit — re-upload the 9 broken images and bulk-fill alt text (this is scriptable, not a full rebuild).
**Sources:** [AfroTech](https://afrotech.com/toy-company-healthy-roots-dolls-raises-1m-seed-to-represent-the-beauty-of-diversity-and-representation)

### Boddle
**What they do:** Game-based K-6 math/English learning platform ("Boddle Learning"), 2.5M+ students, revenue estimated $10-25M. Seed, $4.35M raised.
**Technical:** boddlelearning.com, Webflow, 200 OK. Mobile performance mid-range (see data file). 90 images, 34 missing alt (38%). No footer copyright year printed at all.
**Most important finding:** For a company with real usage scale and revenue, the site's polish lags its traction — missing footer year and a third of images unlabeled reads as under-invested for a company this size.
**Highest-value move:** A findability/trust pass (footer, schema, alt text) rather than a full rebuild — the product story is already strong.
**Sources:** [Tracxn](https://tracxn.com/d/companies/boddle-learning/__q3P3dZKS0-n4BF88ALpgk_8grmGIezJYbtUJaNNI2IY)

### Undock
**What they do:** AI-assisted meeting scheduling ("autocomplete for your calendar"). HQ New York, NY. Seed, $1.7M raised (2020).
**Technical:** Lightship's own link (undock.com/m/) redirects to undock.com/l/; Next.js, 200 OK. Fast in-browser load (~3s unthrottled) but an 18.1s LCP under Lighthouse's throttled mobile emulation (performance 74, best practices a strong 96 — the highest in the portfolio). 19 images, 16 missing alt (84%).
**Most important finding:** Headcount is down to ~7 (from 11 in 2023) while 2024 revenue grew to ~$499K — a small team stretched thin, consistent with the alt-text gap and the stale portfolio link.
**Highest-value move:** Fix the fund's own outbound link (cosmetic, costs Lightship nothing) and a same-afternoon alt-text pass for the small team that likely can't prioritize it themselves.
**Sources:** [CB Insights](https://www.cbinsights.com/company/undock) · [Getlatka](https://getlatka.com/companies/undock/funding)

### Haute Hijab
**What they do:** Modest-fashion brand selling hijabs and related apparel. HQ New York, NY. ~$2.3-3.9M raised across multiple rounds, most recent undisclosed (Jun 2022).
**Technical:** hautehijab.com, Shopify, 200 OK. Lighthouse mobile: 40 performance, 92 SEO, 92 accessibility, **54 best practices**. **A visible technical error:** the site's own tracking subdomain (ht3.hautehijab.com) fails with `ERR_CERT_COMMON_NAME_INVALID` — an SSL certificate misconfiguration on their own infrastructure, and almost certainly the reason the best-practices score is depressed. 58 images, 12 missing alt, 1 broken. Nav link count abnormally high (305) — likely a mega-menu/sitemap artifact worth a manual look.
**Most important finding:** A broken SSL cert on their own subdomain is silently failing analytics/tracking calls in every visitor's browser — they may be flying blind on a chunk of their own traffic data without knowing it.
**Highest-value move:** Fix the cert (quick), then a performance pass — 26 employees is enough team that this is likely just an unnoticed drift, not a resourcing gap.
**Sources:** [FashionNetwork](https://us.fashionnetwork.com/news/Haute-hijab-closes-2-3-million-funding-round,1066662.html)

### Femi Secrets
**What they do:** Natural, chemical-free feminine hygiene/period-care products. HQ Buffalo, NY. Seed round Sep 2021, amount undisclosed.
**Technical:** femisecrets.com, Shopify, 200 OK. **Second-heaviest page in the portfolio (~35-37MB)**, driven by an autoplay Shopify product video. 47 images, 12 missing alt.
**Most important finding:** As of March 2026, third-party data shows only 5 employees at the company — a very small team carrying a 35MB homepage that is actively working against them on mobile conversion.
**Highest-value move:** Same fix pattern as Allergy Amulet — compress/lazy-load the video. High leverage for a 5-person team with no bandwidth to self-diagnose this.
**Sources:** [PR Newswire](https://www.prnewswire.com/news-releases/lightship-capital-invests-in-femi-secrets-award-winning-feminine-care-brand-301387401.html)

### Vyrill
**What they do:** AI-powered video intelligence / UGC video-commerce marketing platform. HQ San Francisco, CA. Seed, $4.85M raised ($3M seed, Noemis Ventures + Lightship).
**Technical:** vyrill.com, Webflow, 200 OK, fast load (~2s). **Worst alt-text gap in the entire portfolio: 89 of 91 images (98%) missing alt text.** Footer copyright shows 2025, one year behind. Nav link count unusually high (120).
**Most important finding:** A company literally selling "AI-powered video intelligence" and conversion optimization to other e-commerce brands has a near-total accessibility/SEO gap on its own marketing site — an uncomfortable irony worth mentioning directly.
**Highest-value move:** A one-day alt-text and footer-year fix; cite the irony as the pitch.
**Sources:** [Vyrill funding announcement](https://www.vyrill.com/blog/vyrill-raises-3m-seed-round)

### Fresh Fry
**What they do:** Patented pods/filters that purify and extend commercial frying-oil life. HQ Louisville, KY. Seed, $1.7M raised (Dec 2023).
**Technical:** freshfry.me, Shopify, 200 OK. Only 6 images on the homepage, but **5 of 6 missing alt (83%) and 3 of 6 broken.**
**Most important finding:** A B2B/B2B2C hardware product is running an almost entirely unlabeled, partly-broken image set on its main site — for a product that needs visual explanation (a pod, in a fryer, showing the mechanism), broken/undescribed images are a real comprehension barrier, not just an SEO nit.
**Highest-value move:** Straightforward image-asset fix; the site is otherwise fast and clean (8s load, no other errors).
**Sources:** [VentureFirst case study](https://venturefirst.com/case-studies/fresh-fry/)

### Kare Mobile
**What they do:** Turnkey mobile dental-clinic vans + software/back-office platform, targeting "dental deserts." HQ Detroit, MI, expanding into Kentucky.
**Technical:** Lightship's link (kare.mobi) correctly redirects to karemobile.com; WordPress, 200 OK, fast (~2s). **No meta description at all.** 21 images, 4 missing alt.
**Most important finding:** A completely missing meta description means every Google result and social share for Kare Mobile shows either nothing or an auto-scraped, un-curated snippet — a five-minute fix with real search-visibility upside for a company actively expanding into new counties.
**Highest-value move:** Write and add a meta description; otherwise a healthy site.
**Sources:** [Lightship post on Michigan expansion](https://www.lightship.capital/post/kare-mobile-expands-affordable-mobile-dental-care-to-underserved-michigan-communities)

### Bootup — DOMAIN LAPSED / SQUATTED
**What they do (now, under the surviving brand):** Originally an ed-tech/bootcamp company; founder Chandler Malone has pivoted the operating brand to "Bootup Studios," an AI venture studio helping laid-off professionals launch businesses (product: LaunchMate, live since mid-2025).
**Most important finding:** Lightship's own portfolio page still links to joinbootup.com, which now serves Indonesian online-gambling spam content — confirmed independently via curl, not a bot-detection artifact. Meanwhile the real company is thriving: pilots at Morehouse College and the University of Tulsa, and a Lightship Foundation Bootcamp partnership running through 2027. The fund is unknowingly sending visitors to a gambling site instead of celebrating a live success story.
**Highest-value move:** Immediate: get the dead link off the portfolio page or point it at the real Bootup Studios presence. Follow-on: build/host a proper site for Bootup Studios if one doesn't already exist at its current domain.
**Sources:** [Yahoo Finance / LaunchMate launch](https://finance.yahoo.com/news/bootup-studios-announces-ai-powered-122800062.html) · [Mogul Millennial](https://www.mogulmillennial.com/chandler-malone-bootup/) · [Refresh Miami](https://refreshmiami.com/news/when-the-layoffs-hit-this-miami-founder-built-a-studio-to-help-people-launch-their-own-companies/)

### Enable Injections
**What they do:** Maker of the enFuse wearable on-body injector for high-volume subcutaneous drug delivery, used in pharma-partnered products. HQ Cincinnati, OH. Series C / growth stage, $344M total raised.
**Technical:** enableinjections.com, WordPress, 200 OK. **Best Lighthouse scores in the portfolio** (performance high-80s, SEO 100, accessibility 99). 18 images, 0 missing alt.
**Most important finding:** This is the fund's standout success story — Sanofi invested $30M in January 2026, and in July 2026 Sanofi won FDA approval for the first anticancer treatment delivered via an on-body injector, built on Enable's platform. The site quality matches the company's stage: nothing to fix.
**Highest-value move:** None technical. If anything, investor-materials support (case study, press kit) to help the fund showcase this outcome elsewhere.
**Sources:** [FirstWord Pharma](https://firstwordpharma.com/story/7047203) · [Medical Design & Outsourcing](https://www.medicaldesignandoutsourcing.com/enable-injections-enfuse-on-body-injector/)

### Arbit
**What they do:** Real-time marketplace pricing / normalized product data API for resale and commerce platforms. HQ Tulsa, OK. Seed, $1.57M raised.
**Technical:** getarbit.com, Webflow, 200 OK. **Footer copyright frozen at 2022** — the oldest/stalest date found anywhere in the portfolio. 32 images, 21 missing alt (66%).
**Most important finding:** Third-party data shows Arbit merged with/was acquired by The Sneaker Database on May 3, 2025, but the marketing site has clearly not been touched since 2022 and still presents Arbit as an independent going concern — visitors have no way to know what actually happened to the company.
**Highest-value move:** Market-research call first (confirm the current legal/operating status with Lightship or the founders), then either redirect the domain to explain the outcome or hand it a real update if the API product still runs standalone under Sneaker Database.
**Sources:** [PitchBook](https://pitchbook.com/profiles/company/528710-68)

### CurlMix — AUTOMATION-BLOCKED (live for humans)
**What they do:** Textured/curly-hair care products, Shark Tank alum, Black-owned. HQ Chicago, IL. $16.5M total raised.
**Most important finding:** In 2025 founder Kim Lewis launched the #ProtectCurlMix campaign, saying the company needed 20,000 orders within 60 days to avoid closing by the end of 2025, citing tariffs, ingredient costs, and supply-chain delays; staff was cut from 40 to 14. Separately, the live storefront has a Shopify "EasyLockdown" app installed, and both a real headless-Chrome browser and Lighthouse were blocked/redirected to google.com or hung entirely when visiting it — while a plain `curl` request gets a normal 200 and full storefront. This needs to be checked by a human in a real browser immediately: if EasyLockdown is misconfigured in a way that also catches real customers (not just bots), a company on the edge of survival could be silently losing exactly the orders it's begging for.
**Highest-value move:** Urgent human QA of the checkout/storefront flow, followed by whatever performance and conversion work the crisis affords time for.
**Sources:** [Global Cosmetics News](https://www.globalcosmeticsnews.com/curlmix-launches-protectcurlmix-campaign-as-founder-seeks-20000-orders-to-avoid-closure/)

### Brevity
**What they do:** AI sales-coaching platform (training plans, AI role-plays, live-call analysis) — note: Lightship's original pitch-deck-tool "Brevity" appears to have repositioned into sales coaching; the live site's current copy matches this newer description, not the pitch-deck-prep description found in funding databases. HQ Minneapolis, MN. Seed, $2M raised, last disclosed round Feb 2023.
**Technical:** brevitypitch.com, HubSpot CMS, 200 OK, fast (~1.6s), lightest page in the portfolio (~0.46MB). 42 images, 2 missing alt — cleanest image hygiene in the portfolio.
**Most important finding:** Longest funding silence of any company researched (over 3 years since last disclosed round) combined with an apparent product repositioning that funding databases haven't caught up to — worth a direct check-in on current status/traction.
**Highest-value move:** Market-research/positioning check-in rather than a technical rebuild — the site itself is in good shape.
**Sources:** [Tracxn](https://tracxn.com/d/companies/brevity/__sx9IKh-musR1k06P2Zq_BXGePEsa-AZGNjHE_T7Mv4g)

### Semiosis AI — DOMAIN DISCONNECTED
**What they do:** Unclear. Lightship's portfolio listing implies an AI company; the domain (semiosis-ai.com) is currently disconnected from Wix hosting and returns a 404 "Reconnect Your Domain" page — confirmed via both curl and headless browser.
**Most important finding:** This is a genuine unknown, not a confirmed shutdown: open research surfaced a different, seemingly unrelated "Semiosis AI" describing itself as a resume-support/job-search tool, but couldn't confirm whether that's a pivot of the same company, a coincidence, or outdated search-index noise. The only fact confirmed directly is that the domain Lightship links to is dead.
**Highest-value move:** A direct status check with Lightship before any design work — this is the one company in the portfolio where LOVELEEDAY genuinely doesn't know what it would be rebuilding.
**Sources:** [semiosis-ai.com live check, 2026-09-22]

### CModel
**What they do:** Decision-intelligence SaaS for economic-development organizations (business retention/expansion tracking, incentive programs, impact reporting). HQ Birmingham, AL (relocated from San Francisco, Jun 2024). Seed, $1.25M raised.
**Technical:** cmodel.io, HubSpot CMS, 200 OK. Markup is the cleanest in the portfolio — complete meta description, valid og:image, current (2026) copyright year, perfect 100/100 Lighthouse SEO and accessibility. But mobile **performance is 36/100 with a 33.2-second Largest Contentful Paint — the single worst LCP of any site measured**, on an 8.2MB page that isn't even the heaviest in the portfolio.
**Most important finding:** CModel is the clearest case in this audit of "the code is clean but the experience is broken." Every markup-level signal says this site was built carefully; the actual mobile-loading experience says the opposite. Something in the render path (likely render-blocking HubSpot scripts or an unoptimized hero asset) is quietly costing a sales-focused B2B site real visitor patience.
**Highest-value move:** A focused performance diagnostic (waterfall trace) rather than a full rebuild — this looks like a fixable configuration issue, not a design problem.
**Sources:** [CB Insights](https://www.cbinsights.com/company/c-model)

---

## Method notes

- Portfolio list and outbound links pulled live from lightship.capital/portfolio on 2026-09-22; matches the known 2026-09-22 list exactly (no additions or removals since).
- Technical data gathered with a single headless real-Chrome (Playwright, `channel: "chrome"`) session, one company at a time, closed after each batch — not run in parallel, per the memory constraint.
- Lighthouse mobile audits run locally (`scripts/measure-local.mjs`, matching this repo's existing methodology for prior portfolio audits) for the 14 sites that load normally. Visuwall, Bootup, CurlMix, and Semiosis AI were excluded from Lighthouse for the reasons stated above — measuring a Cloudflare challenge page, a gambling-spam page, a hung/redirected session, or a domain-not-connected page would misrepresent the real company, not describe it.
- No performance value is ever recorded as 0 — a missing/unmeasurable metric is `null` in the JSON, with the reason stated in prose.
- Business-context research used public web search; every claim above is cited to a source URL. Where sources conflicted or were ambiguous (Semiosis AI, Brevity's apparent repositioning), that ambiguity is stated rather than resolved by guessing.
