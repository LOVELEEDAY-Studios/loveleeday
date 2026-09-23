/**
 * Meknology — addressed to the founder, Daniel Hodges, not to a fund.
 *
 * Daniel May met him on 2026-09-22 and told him we could help. So this is a
 * follow-up to a conversation, not an unsolicited study, and it carries two
 * things: the site rebuild, and market intelligence on the protein-drink idea
 * he raised (including Western Michigan University athletics). The research is
 * half the point — it shows we can do more than websites — so it renders above
 * the site findings (researchFirst).
 *
 * Same register rule as portfolio.ts: plain language, every number sourced.
 */
import type { Portfolio } from "./portfolio";
import { TOKENS } from "./tokens";
import { v } from "./assetVersion";
import { meknologyResearch } from "./meknology-research";

export const meknology: Portfolio = {
  token: TOKENS.meknologyPortfolio,
  fund: "Meknology",
  eyebrow: "Meknology",
  headline: "Your site, rebuilt. Your next market, mapped.",
  heroNote: "Website and market intelligence",
  fundDomain: "meknology.com",
  preparedFor: "Daniel Hodges",
  deliveredOn: "2026-09-22",
  intro:
    "Thank you for the time at PitchMI yesterday. You asked what we could do, so rather than describe it we did some. This page has two parts. The first is market intelligence on the idea you raised with us: turning the protein in your spent-grain stream into a drink, and how to turn Western Michigan University athletics' interest into your first customer. The second is a rebuild of meknology.com that puts the proof you already have in front of the brewery owners and investors you are talking to. Every figure names where it came from, so you can check any line yourself.",

  researchFirst: true,
  research: meknologyResearch,

  fundFindings: [
    {
      title: "One FAQ answer on your live site still has a note-to-self in it",
      detail:
        "Question three reads: “They are other markets such as bioreactors and (word for taking biological ingredients to make plastic) and hydroponics.” The word it is reaching for is bioplastics. It is a one-minute fix, and it is on the page investors and brewery owners read before they call you.",
    },
    {
      title: "Your strongest proof is not on your homepage",
      detail:
        "The planned deployments at Mammoth Distilling, Roar Brewing and HOMES Brewpub, the $50,000 EGLE grant, Techstars and Kalamazoo Forward Ventures, and your own engineering background at Ford and Whirlpool are all public, in the press. None of it appears on meknology.com. A buyer putting new equipment into their plant looks for exactly that, and today they find a stock photo of a water splash.",
    },
    {
      title: "Search engines and link previews get nothing from your site",
      detail:
        "The homepage has no description for Google to show and no preview image, so a link to it shared in a text or on LinkedIn shows up bare. All 31 images have empty descriptions, which also means screen readers and search engines cannot tell what they show. The only location on the site is Southfield, while the press has reported your move to Kalamazoo.",
    },
  ],

  stats: [
    { k: "3", label: "Products from one waste stream", sub: "Feed, biochar and clean water — your own claim, from meknology.com" },
    { k: "~12,000", label: "US brewers and distillers", sub: "Every one makes this waste. Second Wave Media, October 2025" },
    { k: "0", label: "Pilots, backers or team shown on your homepage", sub: "All three are public in the press. Checked 22 September 2026" },
    { k: "31 of 31", label: "Images with no description", sub: "Read from your homepage's code, 22 September 2026" },
  ],

  cases: [
    {
      slug: "meknology",
      company: "Meknology",
      domain: "meknology.com",
      portalToken: TOKENS.meknology as string,
      sector: "Wastewater to feed, fertilizer and water · Michigan",
      before: v("/portal/meknology/meknology-before.jpg"),
      after: v("/portal/meknology/meknology-after.jpg"),
      thesis:
        "Your system takes the thing a brewery pays to get rid of every week and turns it into three things it can sell. A brewery owner understands that in one sentence. Your current homepage takes seven sections to get there and never shows the proof. The rebuild tells the same story in the order a brewery owner would ask for it: what it costs you now, what comes out, who is already in, and who built it.",
      findings: [
        "The headline is the decision the buyer is making: stop paying to haul it away, start selling what's in it.",
        "One diagram carries the whole idea. Three waste streams go in; animal feed, biochar and clean water come out.",
        "Your own blue, taken from your logo, now means water and only water. Amber is grain and charcoal is biochar, so a color anywhere on the page tells you which product you are reading about.",
        "Your four contact forms became four labeled doors — brewery, feed buyer, supplier, investor — so nobody lands in the wrong one.",
        "Your first sites, your backers and your engineering background each get a section of their own.",
      ],
      search:
        "Not measured. We did not run search-position tooling for this study, so rather than estimate where you rank we are telling you we do not know.",
    },
  ],

  method: [
    "Every site finding was read directly from meknology.com's own code on 22 September 2026, including the FAQ text quoted word for word.",
    "Facts about your pilots, grant, backers and background come from Second Wave Media (October 2025), Michigan EGLE (January 2024) and CB Insights, and are labeled as reported, not verified by us.",
    "The market research names a source for every figure. Where sources disagree we give the range and say so, and where we could not confirm something we say that instead of guessing.",
    "Photography on the rebuild is licensed stock from Pexels, credited in its footer. It shows breweries, grain and soil in general, never your equipment. A real photograph of your prototype would beat every image on the page.",
  ],
};
