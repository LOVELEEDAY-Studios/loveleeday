/**
 * The fund-level portfolio page. One token, one link, the rebuilds side by side
 * with what each site looks like today.
 *
 * This is a different object to a client Portal: a Portal is addressed to one
 * company about its own work, this is addressed to the investor about several.
 * Keeping them separate stops the client-facing copy drifting into pitch copy.
 *
 * REGISTER (Daniel, 2026-09-22): "write this like you are talking to someone who
 * doesn't understand tech — think like you are presenting to an executive
 * leadership team." That is a hard constraint on every string below, not a tone
 * preference. A managing partner is not going to ask what largest contentful
 * paint is; they are going to skim, and whatever they cannot parse in one pass
 * they will read as us showing off. So:
 *   - No unexplained jargon. Not Lighthouse, LCP, og:image, CMS, SERP, HTTP 404,
 *     h1, SVG, CrUX, no-code. Say the consequence, then the evidence.
 *   - Every number carries its meaning: "25 seconds" is nothing until it sits
 *     next to "most visitors leave after three."
 *   - Lead each finding with what it costs them. The measurement is support.
 *   - US spelling. An earlier pass shipped "organisation" four times.
 * Translating a figure is allowed. CHANGING one is not — every number here was
 * measured, and the plain-language version has to survive being checked.
 */

import { TOKENS } from "./tokens";
import { v } from "./assetVersion";
import { meknology } from "./meknology-study";
import type { Video } from "./portals";
import { lightshipCases, lightshipResearch } from "./lightship-studies";

export interface Case {
  slug: string;
  company: string;
  domain: string;
  /** Which client portal holds the full package. */
  portalToken: string;
  sector: string;
  before: string;
  after: string;
  /** The single sentence that justifies the rebuild. */
  thesis: string;
  /** Measured, with its source. */
  findings: string[];
  /** The search line, already bounded. */
  search: string;
  /** Commercials cut from the company's own footage. */
  videos?: Video[];
}

export interface Portfolio {
  /** Undefined until the fund's token is set: written, not yet reachable. */
  token?: string;
  fund: string;
  /** The line under the fund name in the hero. Written per study, because what was reviewed
   *  differs: a whole portfolio, part of one, or the fund's own site. */
  heroNote: string;
  fundDomain: string;
  preparedFor: string;
  deliveredOn: string;
  intro: string;
  /** Things true of the fund itself, not any one company. */
  fundFindings: { title: string; detail: string }[];
  /** Portfolio-wide measurements. */
  stats: { k: string; label: string; sub: string }[];
  cases: Case[];
  method: string[];
  /** A study addressed to a founder about their own company rather than to a fund about its
   *  portfolio. The fund wording ("Portfolio study", "One of your companies, rebuilt.") reads
   *  wrong to the person whose company it is. */
  eyebrow?: string;
  headline?: string;
  /** Market research delivered alongside the rebuild. Every point names its source. */
  research?: Research;
  /** Render the research above the site findings — for studies where it is the headline. */
  researchFirst?: boolean;
  /** Where the fund findings were found, finishing "N things we found …". Defaults to the fund's own domain. */
  findingsScope?: string;
  /** The close: what the reader does next. Rendered as its own section before the method. */
  close?: { title: string; body: string; cta: { label: string; href: string }; secondary?: { label: string; href: string } };
}

export interface Research {
  kicker: string;
  title: string;
  intro: string;
  verdict?: string;
  /** The plan as numbered steps; replaces the verdict paragraph when present. */
  steps?: { when: string; what: string }[];
  points: { title: string; detail: string }[];
  sources: { label: string; url: string }[];
}

const collab: Portfolio = {
  token: TOKENS.collab,
  fund: "Collab Capital",
  heroNote: "38 companies reviewed",
  fundDomain: "collab.capital",
  preparedFor: "Collab Capital",
  deliveredOn: "2026-09-19",
  intro:
    "We help organizations see something their own numbers already know, and then act on it. This is not a pitch for a redesign — the rebuilds at the end are simply how we show our work. Nobody asked us to do this. We took your portfolio page, opened all thirty-eight companies on it, and looked at each one the way a customer or an acquirer would: on a phone, from a cold search, with no introduction. Then we wrote down what we found. Every figure here belongs to the company it describes and names where it came from, so you can check any line on this page yourself.",

  fundFindings: [
    {
      title: "Two of your companies changed their names. Your portfolio page still uses the old ones",
      detail:
        "CircNova now trades as Novarna — their own site says so, with a banner reading “CircNova is now Novarna.” Hubble IQ now trades as Fyxit AI. Both are still listed under their former names on collab.capital/portfolio. Anyone doing diligence who searches the name you published will not find the company you funded.",
    },
    {
      // Forty are listed; thirty-eight are live and were measured. Both numbers are right, but
      // the page stated them 200 words apart with nothing connecting them, so it read as a
      // contradiction to anyone checking — which is exactly the reader this study invites.
      title: "None of the forty companies listed on your portfolio page can be clicked",
      detail:
        "Forty are listed; the thirty-eight still trading are the ones we measured. The names are printed on the page, but not one of them is a link. Nothing happens if you try. Each company does have a detail page elsewhere on your site, and those pages carry the outbound links — but nothing on the main list reaches them. So anyone who wants to look at one of your companies has to leave your site and go searching. That is the moment you stop controlling the story.",
    },
    {
      title: "Seven in ten of your companies run on an off-the-shelf website builder",
      detail:
        "Eleven on WordPress, nine on Webflow, two Wix, two Squarespace, two Shopify, one Framer. Eleven are custom-built or could not be identified. This is not a criticism of the tools; plenty of serious companies use them. It is an observation about ambition — the typical site in this portfolio is doing less work than the company standing behind it.",
    },
  ],

  stats: [
    { k: "38", label: "Companies we opened and measured", sub: "Every live company in your portfolio, 18 September 2026" },
    { k: "57", label: "Google's mobile speed score, median", sub: "Out of 100. Eleven of the thirty-three we could measure score below 50" },
    { k: "92", label: "Median score for being findable", sub: "The underlying setup is mostly fine. Findability is not what is hurting them" },
    { k: "19", label: "Have too few visitors for Google to report on", sub: "Of 33 measured. Google only publishes real-visitor data above a traffic floor" },
  ],

  cases: [
    {
      slug: "novarna",
      company: "Novarna",
      domain: "circnova.com",
      portalToken: TOKENS.novarna,
      sector: "AI-designed RNA therapeutics · Detroit, MI",
      before: v("/portal/collab/novarna-before.jpg"),
      after: v("/portal/collab/novarna-after.jpg"),
      thesis:
        "Of the six, this is the only company whose product is a physical thing rather than a screen, so we built the page around the molecule itself. Their single best piece of evidence was buried near the bottom of their site: the University of Michigan's DiFeo Lab tested their candidates in its own facility, and the designs outperformed a treatment already on the market. An outside laboratory willing to say that is close to unheard of in this field. It was a paragraph.",
      findings: [
        "The opening image is the molecule, drawn to its true shape and dimensions rather than illustrated, turning slowly as you read. It is built out of the page itself rather than loaded as a graphic, so the whole thing appears instantly even on a weak phone signal.",
        "The Michigan result now has a section of its own instead of a footnote, laid out as a result you can take in at a glance.",
        "One thing to fix regardless of what you think of the rebuild: their files already come from novarna.ai while their web address still says circnova.com. Two names split whatever credibility the address has earned, and Google treats them as two different companies.",
      ],
      search:
        "They appear ninth out of nine for the phrase that describes what they do. The eight above them are scientific journals and catalog sites, not competitors — which means the category has no commercial rival in it yet. That is an opening, and it will not stay open.",
    },
    {
      slug: "soarce",
      company: "Soarce",
      domain: "soarceusa.com",
      portalToken: TOKENS.soarce,
      sector: "Industrial nanofiber materials · Orlando, FL",
      before: v("/portal/collab/soarce-before.jpg"),
      after: v("/portal/collab/soarce-after.jpg"),
      thesis:
        "Their entire pitch is stronger, lighter, cheaper. Their homepage is the heaviest of all thirty-eight sites we measured — loading it pulls down about 30 megabytes, roughly a three-minute video, most of it the same file fetched three separate times. A materials company should not be shipping the heaviest page in its investor's portfolio.",
      findings: [
        "Our rebuild makes exactly the same claims and pulls down under one percent as much. On an ordinary phone that is the difference between appearing immediately and appearing after the visitor has already left.",
        "Their own figures carry the page — eight times stronger than steel, two hundred times water retention — instead of being buried underneath the weight.",
        "Weight and findability are the same problem here. A page that heavy is slow for Google to read and slow for the buyer who does manage to find it.",
      ],
      search:
        "They do not appear in the top nine results for the phrase describing what they sell. A competitor, matregenix.com, ranks first.",
    },
    {
      slug: "loanwell",
      company: "LoanWell",
      domain: "loanwell.com",
      portalToken: TOKENS.loanwell,
      sector: "Lending technology for CDFIs · Durham, NC",
      before: v("/portal/collab/loanwell-before.jpg"),
      after: v("/portal/collab/loanwell-after.jpg"),
      thesis:
        "Affordable capital reaches nobody if the lender looking for the tool cannot find the tool. Their mission and their product writing are both strong. The page argues about software features, when the thing actually being bought is the ability to get money out of the door.",
      findings: [
        // The search finding lives in `search`, which renders directly above this block under
        // "How they are found today". Repeating it here made LoanWell the only company whose
        // "What we changed" opened by restating a problem instead of describing the rebuild.
        "Their whole differentiator is that they serve mission-driven lenders, and the platforms ranking above them do not. Our rebuild says that in the first line, where their page had a general claim about lending software.",
        "Our rebuild closes on the quote from their own CEO that you already publish on your portfolio page, and puts an actual borrower where their page had three abstract boxes. The section is titled “We take lending personally” and there was nobody in it.",
        "Two things worth fixing whatever you make of the rebuild. One of their product screenshots has a visual glitch, with several rows of a payment schedule duplicated over one another. And six of the seven product screenshots on their site show a real street address in the header bar, readable at full size.",
      ],
      search:
        "Not in the top nine for “loan origination software for CDFI”. Nortridge, The Mortgage Office and Builders Patch rank instead.",
    },
    {
      slug: "janta",
      company: "Janta Power",
      domain: "jantaus.com",
      portalToken: TOKENS.janta,
      sector: "3D solar towers · Dallas, TX",
      before: v("/portal/collab/janta-before.jpg"),
      after: v("/portal/collab/janta-after.jpg"),
      thesis:
        "Their best number is buried three screens down in a small box. Their own worked example: 500 kilowatts in Dallas takes 3.3 acres of ordinary tilted panels to make 876,000 kilowatt-hours a year, against one acre of their towers making 1,182,600. Scale that to a 50-megawatt build and it is 230 acres saved — about 174 football fields — while producing more power, not less. That is the entire company in one sentence, and today it is a footnote.",
      findings: [
        "The rebuild makes the land argument the page's one bold move: their own two aerial photographs, one dissolving into the other as you scroll, while the acreage counts down from 330 to 100. The page states plainly that the 50-megawatt figures are their own 500-kilowatt example multiplied out — the arithmetic is ours, the inputs are theirs.",
        "A cookie consent box covers nearly a quarter of the first thing a visitor sees, including part of the sentence explaining what the company does. No automated tool flags this. It is obvious the moment a human loads the page.",
        "One correction worth passing on. A partner logo on their site is labeled “PV Magazine” but is, pixel for pixel, the logo of Third Derivative — a different organization, and an accelerator whose program they are genuinely in. A blind visitor's screen reader announces one name while everybody else sees another. Their own footer gets it right.",
      ],
      search:
        "Not in the top eight for either phrase describing what they sell. A Reddit thread asking whether solar towers are even a real thing ranks first for one of them; a journal index takes the other.",
    },
    {
      slug: "fyxit",
      company: "Fyxit AI",
      domain: "hubbleiq.com",
      portalToken: TOKENS.fyxit,
      sector: "AI tech support for school districts · San Francisco, CA",
      before: v("/portal/collab/fyxit-before.jpg"),
      after: v("/portal/collab/fyxit-after.jpg"),
      thesis:
        "Their whole claim is “does the work, not just the talking.” The site talks. Our rebuild opens on the product doing the work: a teacher reports the Wi-Fi dropping in room 214, the system reads the access point, finds the conflict, fixes it, and closes the issue in two minutes forty seconds — without anyone ever filing a ticket.",
      findings: [
        "The six problems on their own demo — slow Wi-Fi, a sluggish computer, a jammed printer, an app that will not open, a cracked screen, a phishing email — are the most concrete thing on the site, and today they are buttons. In the rebuild they are the spine of the page, and their claim that 60% of issues resolve themselves is shown as a Monday-morning queue with real outcomes rather than asserted as a statistic.",
        "Rosie is their own AI technician. She appears 810 times inside their software and not once on the page selling it. In the rebuild she answers the teacher, by name.",
        "Their web address still says hubbleiq.com while the product is called Fyxit AI. Two names, one reputation, split between them.",
      ],
      search:
        "Not in the top nine for “AI IT helpdesk for school districts”. The site ranking first, incidentiq.com, is listed on Fyxit's own homepage as a partner they integrate with.",
    },
    {
      slug: "micruity",
      company: "Micruity",
      domain: "micruity.com",
      portalToken: TOKENS.micruity,
      sector: "Retirement income infrastructure · Sacramento, CA",
      before: v("/portal/collab/micruity-before.jpg"),
      after: v("/portal/collab/micruity-after.jpg"),
      thesis:
        "A category-defining product explained in the visual language of a template. Our rebuild keeps their structure and all four of their products and changes one thing only: how much the page is willing to say about the human being at the other end of a retirement annuity.",
      findings: [
        "Their homepage has ten competing main headlines. A page should have one — otherwise neither a reader nor a search engine can tell what it is about.",
        "Google flags text on the page as too faint against its background to read comfortably. That is a real reader being shut out, not a score.",
        "Of the six, this is the one where search is already working. The argument here is about clarity, not traffic.",
      ],
      search:
        "First — and ninth as well, two results on the same page — for “retirement income infrastructure recordkeeper insurer”, and fifth for “plan participant portability annuity”.",
    },
  ],

  method: [
    "The company list came from your own per-company detail pages rather than guesswork. An earlier pass using guessed web addresses landed on five unrelated businesses, and collabcapital.com turns out to be a parked domain that is not you.",
    "Speed scores are Google's own published measurement, run on a simulated phone on 18 September 2026. Four companies failed to return a result and are left out entirely rather than counted as zero.",
    "Search positions come from live Google results, re-run on 19 September rather than quoted from our first pass. We can see eight or nine results per search, so “not in the top eight” is the strongest claim we are entitled to make. It says nothing about position nine or beyond, and nothing about other search engines.",
    "Every figure on the six rebuilt pages belongs to the company it describes and was read from their own site. Where we have done arithmetic on their numbers — the Janta land comparison is their published example scaled up — the page says so on the page itself. We have not independently verified any company's underlying claims.",
    "The photography is real licensed stock, credited on each page. An earlier version of the Micruity page used AI-generated people and we replaced it. The Fyxit conversation and queue are an illustration of the layout, not data from their system.",
  ],
};

/** Every fund study that exists. One publishes only once it has a token. */
/**
 * Lightship Capital — Brian Brackeen, Funder's Panel, 2026-09-22.
 *
 * Every figure below was checked directly with curl or local Lighthouse on
 * 2026-09-22, not taken from a research summary. Where the coverage is partial
 * the denominator is stated on the page rather than rounded away — 7 of 18
 * measured is a finding; "median performance 56" on its own would be a claim.
 */
const lightship: Portfolio = {
  token: TOKENS.lightship,
  fund: "Lightship Capital",
  eyebrow: "Lightship",
  headline: "Your fund, your foundation and your week, rebuilt.",
  heroNote: "18 companies reviewed · 3 of your sites rebuilt · 3 videos",
  fundDomain: "lightship.capital",
  preparedFor: "Brian Brackeen",
  deliveredOn: "2026-09-22",
  intro:
    "Thank you for the time at PitchMI tonight. You asked what LOVELEEDAY does, so rather than describe it, we did some. We help organizations see something their own records already know, and then act on it. This page has four parts: market intelligence on Black Tech Week's move to Columbus and on the fund's own presence; what we found across all eighteen of your portfolio companies; rebuilds of blacktechweek.com, lightship.capital and lightship.foundation, each with the reasoning behind it; and three short videos cut from your own footage. Every figure names where it came from, so you can check any line yourself.",

  researchFirst: true,
  research: lightshipResearch,
  findingsScope: "across your eighteen companies",
  close: {
    title: "Start with step one this week.",
    body: "The two portfolio links and Black Tech Week's broken ticket address and share image are an afternoon's work, and they are the first things a sponsor or LP will click. Tell us to go and we'll fix them this week, then set up the Columbus sponsor package and the first portfolio brief on a call.",
    cta: { label: "Email Daniel to get started", href: "mailto:daniel@loveleedaystudios.com?subject=Lightship%20%E2%80%94%20let%27s%20start" },
    secondary: { label: "About LOVELEEDAY Studios", href: "https://loveleedaystudios.com/" },
  },

  fundFindings: [
    {
      title: "Two of your companies are linked from your site to web addresses they no longer own",
      detail:
        "joinbootup.com now loads an Indonesian online gambling site. The registration lapsed, somebody else bought it, and that is what they put there. semiosis-ai.com is simply gone. Both are still linked from lightship.capital/portfolio, so a visitor clicking through from your page lands on a gambling site with your recommendation behind them. This is a registrar and legal matter before it is anything else, and it is the most urgent line on this page.",
    },
    {
      title: "A live company site is publishing its own editing software's instructions to the author",
      detail:
        "Enable Injections' site contains the sentence “Delete this tip before you publish” — a note the website software shows the writer, left in and published to the world. Undock's navigation menu produces links containing the word “undefined”, which is what appears when a value was never filled in. We read both straight from the live pages. Enable holds FDA clearance and named partnerships with Sanofi, Roche and Sobi; the distance between that credibility and a page carrying leftover scaffolding is the widest gap in your portfolio.",
    },
    {
      title: "What most of these are losing to is weight, not taste",
      detail:
        "Across the fourteen sites Google could score, the median mobile speed score is 66 out of 100. On a phone, CModel takes 33 seconds to show its main content, and Allergy Amulet takes 25 seconds while pulling down 37 megabytes, about a four-minute video's worth. For scale, most people leave a page after three seconds. These are not opinions about taste. They are the numbers Google records, and they decide whether anybody ever sees the design.",
    },
    {
      title: "Thirteen of fourteen sites leave images undescribed",
      detail:
        "Every image on a website should carry a short text description. It is what screen readers speak aloud, and it is how search engines understand a picture. Thirteen of the fourteen sites we could measure leave some images without one. Vyrill leaves 89 of its 91 images blank, and Healthy Roots Dolls 28 of 33. It is an afternoon's fix per site, with real value for search and for accessibility.",
    },
  ],

  stats: [
    { k: "18", label: "Companies in your portfolio", sub: "Read from your own portfolio page, 22 September 2026" },
    { k: "2", label: "Portfolio links that send people somewhere else", sub: "Bootup's lapsed domain now serves a gambling site; Semiosis AI's no longer loads" },
    { k: "66", label: "Google's mobile speed score, median", sub: "Out of 100, across the fourteen sites Google could score" },
    { k: "13 of 14", label: "Sites with undescribed images", sub: "Invisible to screen readers and to image search" },
  ],

  cases: [
    ...lightshipCases,
    {
      slug: "enable",
      company: "Enable Injections",
      domain: "enableinjections.com",
      portalToken: TOKENS.enable as string,
      sector: "Wearable large-volume drug delivery · Cincinnati, OH",
      before: v("/portal/lightship/enable-before.jpg"),
      after: v("/portal/lightship/enable-after.jpg"),
      thesis:
        "This company holds the rarest asset in medical-device marketing and does not lead with it. Their enFuse device is FDA-cleared and carries named partnerships with Sanofi, Roche and Sobi. On the live site those partners sit under a heading several screens below the top, after the product explanation. Our rebuild changes the order and almost nothing else: the clearance and the partners are the first things you see, the device is shown as a photograph of the real product, and the patients they already quote do the closing.",
      findings: [
        "Their site is technically healthy and this study does not pretend otherwise. Google scores it 88 out of 100 for speed and full marks for findability, and it shows its first content in 2.1 seconds. There is no speed argument to make here.",
        "The page does carry one genuine error: the sentence “Delete this tip before you publish” is live on it. That is the website software's instruction to whoever wrote the page, published by accident.",
        "One consequence of how their page is built is that the middle of it stays empty until a visitor scrolls. That is a deliberate technique and it is the reason the page is fast, so we are noting it rather than counting it against them.",
        "The rebuild uses their own magenta and navy, read from their live page rather than guessed, their own typeface, their own product photograph and their own partner marks.",
      ],
      search:
        "Not measured. Another study in this portfolio quotes live Google positions; the tool that produces them is not set up on this project, so rather than estimate a position we did not measure, we are telling you we do not have it.",
    },
  ],

  method: [
    "The company list was read from lightship.capital/portfolio on 22 September 2026 — eighteen companies, with no further pages hidden behind it.",
    "Every address was opened with an ordinary browser and its result recorded. A site that blocks automated visitors is reported as blocked and never as broken: visuwall.com blocks us, so it is excluded from every count here rather than marked as a defect.",
    "Speed was measured with Google's own tool, run on our machines because Google's hosted version refused our requests. It returned a score for fourteen of the eighteen. The other four are excluded rather than scored zero: Visuwall and CurlMix turn away automated visitors, and Bootup's and Semiosis AI's addresses no longer belong to the companies.",
    "The rebuilds of blacktechweek.com, lightship.capital and lightship.foundation use only your own words, figures and photography, read from those sites on 22 September 2026. The three videos are cut from your own YouTube footage.",
    "We quote no figures anywhere about how your companies' real visitors behave. We measured the pages, not the traffic, and we will not blur the two.",
    "Bootup and Semiosis AI are left out of every speed figure. Scoring an address the company no longer owns would mean measuring a stranger's website.",
    "Every figure on the Enable rebuild belongs to Enable and comes from their own material. We have not independently verified any clinical claim.",
  ],
};


/**
 * VentureHue — Brittni Abiolu, Funder's Panel, 2026-09-22.
 *
 * The subject of this study is the accelerator's own site, not a portfolio
 * company's. Every defect below was confirmed by direct request on 2026-09-22;
 * the Lighthouse figures are a local run and cover 4 of 6, which the page says.
 */
const venturehue: Portfolio = {
  token: TOKENS.venturehue,
  fund: "VentureHue",
  heroNote: "Your own site, reviewed",
  fundDomain: "venturehue.com",
  preparedFor: "Brittni Abiolu",
  deliveredOn: "2026-09-22",
  intro:
    "We help organizations see something their own records already know, and then act on it. This is not a pitch for a redesign — the rebuild is simply how we show our work. This one is about your own front door rather than a portfolio company's, and the finding fits in a sentence: the program is real, the $2,192,470 is real, and a founder arriving at venturehue.com today can reach none of it. Nobody asked us to look. Every fact in the rebuild is yours, recovered from your own earlier pages rather than written for you.",

  fundFindings: [
    {
      title: "Your homepage is still showing the contact details that came with the template",
      detail:
        "venturehue.com publishes the email address hello@dream-theme.com, the phone number 001 234 56 78 and an address in SoHo, New York. None of those are yours. They are the sample details the website template shipped with, and they were never replaced. A founder who tries to contact you from your homepage is writing to a software vendor in another state.",
    },
    {
      title: "Your portfolio section is gone, and the pages return an error",
      detail:
        "Your homepage and your portfolio section both display the words “Nothing Found”. A specific project page — Career Karma — returns a “Page Not Found” error. We checked an archived copy of your own site from June 2026 and those pages were live then. The work exists. Your site no longer shows it.",
    },
    {
      title: "A published page is asking the reader to paste in a piece of code",
      detail:
        "Your early-access page is live and contains a developer's note reading “paste this persona's Gravity Forms shortcode” — an instruction to whoever was building the page, left visible to anybody who visits it. Beside it, two counters read zero founders coached and $0 total funding. The true figure is $2,192,470 raised by founders in your network.",
    },
  ],

  stats: [
    { k: "$2.19M", label: "Raised by founders in your network", sub: "$2,192,470 — your own published figure, and nowhere on your live site" },
    { k: "$0", label: "What your live funding counter shows today", sub: "On your early-access page, beside a counter reading zero founders coached" },
    { k: "4", label: "Errors we confirmed by visiting the pages", sub: "Template contact details, an empty portfolio, a broken project page, developer notes in public" },
    { k: "7.8s", label: "Wait before your homepage shows anything", sub: "On a phone. Most visitors leave after three seconds" },
  ],

  cases: [
    {
      slug: "venturehue",
      company: "VentureHue",
      domain: "venturehue.com",
      portalToken: TOKENS.venturehueStudy as string,
      sector: "Capital-readiness accelerator · Detroit, MI",
      before: v("/portal/venturehue/venturehue-before.jpg"),
      after: v("/portal/venturehue/venturehue-after.jpg"),
      thesis:
        "You teach founders that being ready for capital is a discipline, and the $2,192,470 your network has raised is the proof that the teaching works. None of it is reachable on your site today. This rebuild adds no claim of its own. It takes what you already published, recovered from an archive of your own pages, and puts the track record first.",
      findings: [
        "The $2,192,470 leads the page. On your live site the equivalent counter reads $0, which is the single most damaging thing on it.",
        "ACCESS Lab is laid out as a numbered path with a beginning and an end, rather than three identical boxes, so a founder can see what they are being taken through before they commit.",
        "Your own blue and purple, read from your live site rather than guessed, and the two typefaces your site already loads.",
        "The testimonials from Eric Williamson, Sharon Porter and Akindele Akinyemi are yours, recovered from your own pages rather than written by us.",
      ],
      search:
        "Not measured. The tool that produced live search positions for other studies in this portfolio is not set up on this project, so rather than estimate a position we did not measure, we are telling you we do not have it.",
    },
  ],

  method: [
    "Every error was confirmed by visiting the page ourselves and reading what it sent back. The template email address, the template phone number, the “Nothing Found” pages, the broken project page and the developer's note were each found word for word in the live pages.",
    "The wording in the rebuild comes from a June 2026 archived copy of venturehue.com, because the live pages that held it now return errors. Nothing on the rebuilt page was invented.",
    "Speed was measured with Google's own tool, run on our machines because Google's hosted version refused our requests. Four of your six sites are measured — venturehue.com, Career Karma, Upright Oats and Small Business Brain — and the figures say so.",
    "We quote nothing about your real visitor numbers. We measured your pages, not your traffic.",
    "The photography is real licensed stock from Pexels, credited by photographer in the page footer. It shows founders generally and never stands in for anybody named on the page — Brittni appears as initials, and the three founders quoted appear as words. Putting a stock face on a real person's name is the one thing we will not do.",
  ],
};


/**
 * 100KM VC — Shalanda Armstrong, Funder's Panel, 2026-09-22.
 *
 * This portfolio is HEALTHY, and the study says so. Eleven of fifteen sites are
 * professionally built with real logos, named case studies and FDA clearances.
 * There is no broken-site argument to make here and inventing one would be the
 * fastest way to lose the room. The finding is elsewhere: the fund's own
 * metadata describes a different fund than the one she runs.
 */
const hundredkm: Portfolio = {
  token: TOKENS.hundredkm,
  fund: "100KM VC",
  heroNote: "15 companies reviewed",
  fundDomain: "100kmvc.com",
  preparedFor: "Shalanda Armstrong",
  deliveredOn: "2026-09-22",
  intro:
    "We help organizations see something their own records already know, and then act on it. This is not a pitch for a redesign — the rebuild at the end is simply how we show our work. Nobody asked us to do this. We asked one question about your portfolio that almost nobody asks — what do these fifteen companies tell a machine about themselves, before a single human reads a word — and then went and measured it. Most of what we found is in good shape, and that is worth saying plainly rather than manufacturing a crisis. What follows is the part that is not, and what we would do about it.",

  fundFindings: [
    {
      title: "Six of your fifteen companies arrive as a blank grey box when anyone shares their link, and you are one of the six",
      detail:
        "Every website carries a small preview image and a one-line description that LinkedIn, Slack, iMessage and Google display when somebody shares a link to it. It is invisible on the site itself, and it is the only thing people see when the link travels without you. Six of your companies have no preview image at all — 100KM VC itself, Scout Financial, Beam Dynamics, Bump, Health In Her HUE and Athlytic. Three have no description either, so Google writes one on their behalf. Twelve of the fifteen have at least one of these gaps. You share these links constantly, in LP updates and warm introductions, and six of them land as a grey rectangle. The fix is one image and one sentence per company: an afternoon of work, and probably the highest-return hour anywhere in the portfolio.",
    },
    {
      title: "Your own site tells Google you invest in Latin America",
      detail:
        "100kmvc.com carries the sentence “We back bold founders building the future of work and health in Latin America” in three separate places behind the scenes. It appears nowhere on the visible page, and the word Detroit appears nowhere at all. No visitor reading your site will ever see this. Google, LinkedIn and every link preview do. For a fund raising its first, that is the sentence an LP meets before they meet you.",
    },
    {
      title: "Three of your companies take more than ten seconds to show anything on a phone",
      detail:
        "Athlytic takes 35 seconds. Scout Financial takes 18. Health In Her HUE takes 14. Most people leave after three. Athlytic is the clearest case of the three: its content is genuinely rich once it arrives, and an automated check reports the page as blank, because the entire interface is assembled afterwards inside the visitor's own browser. The content is not the problem. The wait is.",
    },
    {
      title: "Two of your sites download 25 megabytes or more before a visitor can use them",
      detail:
        "Bump pulls down 40 megabytes and Dopl Technologies 26. Bump gets away with it, because it holds the heavy parts back until they are needed and still scores 86 out of 100 for speed. Dopl does not, at 62, with a ten-second wait. The weight by itself is not automatically the fault — what it costs you depends entirely on what is held back.",
    },
  ],

  stats: [
    { k: "6/15", label: "Arrive as a blank grey box when shared", sub: "No preview image, and 100kmvc.com is one of them. Measured 22 September 2026" },
    { k: "62", label: "Google's mobile speed score, median", sub: "Out of 100. Three of the fifteen score below 50" },
    { k: "100", label: "Median score for being findable", sub: "The underlying setup is excellent. Findability is not this portfolio's problem" },
    { k: "35s", label: "Longest wait before anything appears", sub: "Athlytic on a phone. Scout Financial 18s, Health In Her HUE 14s" },
  ],

  cases: [
    {
      slug: "novarna",
      company: "Novarna",
      domain: "novarna.ai",
      portalToken: TOKENS.novarna,
      sector: "AI-designed RNA therapeutics · Detroit, MI",
      before: v("/portal/hundredkm/novarna-before.jpg"),
      after: v("/portal/hundredkm/novarna-after.jpg"),
      thesis:
        "Their strongest piece of evidence sits in a paragraph near the bottom of their site: the University of Michigan's DiFeo Lab tested their candidates in its own facility, and the designs outperformed a treatment already on the market. An outside laboratory willing to put its name to that is close to unheard of in this field, and on the page it is set as body text like everything else around it. This rebuild changes almost nothing except what the page leads with.",
      findings: [
        "The opening image is the molecule itself, drawn to its real shape and dimensions rather than illustrated, turning slowly as you read. It is built out of the page rather than loaded as a graphic, so the entire page weighs less than a single photograph.",
        "The Michigan result now has a section of its own instead of a footnote, laid out as a result you can take in at a glance.",
        "Measured on 22 September: novarna.ai scores 76 out of 100 for speed and full marks for findability, shows its first content in 4.9 seconds and weighs under a megabyte — among the healthiest sites in your portfolio before we touched anything.",
        "They rebranded from CircNova, and circnova.com now forwards to novarna.ai. Your portfolio page still lists them under the old name, so anyone doing diligence who searches what you published will not find the company you funded.",
      ],
      search:
        "Ninth out of nine for the phrase that describes their platform, measured on live Google results on 19 September. The eight above them are scientific journals and catalog sites rather than companies — the category has no commercial rival in it yet.",
    },
  ],

  method: [
    "The company list was read from 100kmvc.com/portfolio on 22 September 2026 — fifteen companies. All fifteen returned a speed result; none is excluded.",
    "The Latin America finding was confirmed by fetching the page and counting the sentence in what it actually sends: three times behind the scenes, zero times in the visible page, and zero mentions of Detroit anywhere.",
    "The preview-image audit opened all sixteen pages in a real browser and recorded what each one publishes about itself. Singulate is excluded from every count because it answers automated visitors with a security challenge rather than its own page, and counting its missing tags would mean measuring the wrong document. Fifteen usable, twelve with at least one gap. The script is scripts/metadata-audit.py, so your team can re-run it without us.",
    "Speed was measured with Google's own tool, run on our machines because Google's hosted version refused our requests. Same engine, no queue.",
    "Two earlier claims were checked and withdrawn rather than repeated. Athlytic and Health In Her HUE were both reported elsewhere as showing a blank page. Both display in full. The honest finding is that they are slow, not empty.",
    "We quote nothing about your companies' real visitor numbers. We measured the pages, not the traffic.",
    "Every figure on the Novarna rebuild belongs to Novarna and was read from their own site and their own published material. We have not independently verified any of their scientific claims.",
  ],
};

export const portfolios: Portfolio[] = [collab, lightship, hundredkm, venturehue, meknology];

/** Studies reachable right now -- the ones whose token is set. */
export const publishedPortfolios = portfolios.filter((p) => Boolean(p.token));

export function getPortfolio(token: string): Portfolio | undefined {
  return publishedPortfolios.find((p) => p.token === token);
}

/** Kept so existing imports do not break; prefer getPortfolio(token). */
export const portfolio = collab;
