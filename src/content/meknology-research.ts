import type { Research } from "./portfolio";

/* Market intelligence for Meknology, researched 2026-09-22. Every figure below is
   in a named source in `sources`; where firms disagree the range is given. The
   WMU incumbent sponsor is NOT public and the copy says so rather than guessing. */
export const meknologyResearch: Research = {
  kicker: "Market intelligence",
  title: "The protein drink idea, and whether Western Michigan is the place to start.",
  intro:
    "You told us you want to turn the protein in your spent-grain stream into a canned drink, and that Western Michigan University could use it for its athletes instead of Gatorade. Here is what the market says. The short version: the money is real and the science is proven, but someone large got there first, and the Gatorade framing points at the wrong shelf. There is a better way in.",
  points: [
    {
      title: "The market is about $2 billion in the US and growing 8% a year",
      detail:
        "Ready-to-drink protein beverages are worth roughly $2.1 to $2.3 billion in the US in 2026, growing 7.7% to 8.8% a year depending on the forecaster. Plant-based protein drinks are a smaller slice, about $1.5 billion, and growing faster at about 9.6%. Upcycled food as a whole is estimated at $44 billion to $71 billion; the firms disagree that widely, so treat it as direction, not a number.",
    },
    {
      title: "Food-grade protein sells for 20 to 70 times what feed does",
      detail:
        "Distillers' grains sold as animal feed trade around $145 to $180 a ton in the US in 2026, roughly 16 to 20 cents a kilo. Food-grade plant protein isolate, using pea protein as the closest comparison, sells for about $4.50 to $12 a kilo. That gap is the whole opportunity: the same grain is worth far more as food than as feed.",
    },
    {
      title: "AB InBev has already proven it works, and sells it as an ingredient",
      detail:
        "EverGrain, owned by AB InBev, has made a barley protein from brewers' spent grain at commercial scale in St. Louis since 2022 and sells it to Nestlé and Post. It has never launched its own branded drink. ReGrained tried its own branded snack bars, dropped them, and now sells only ingredients. The companies that last in this space supply the protein; they do not own the can.",
    },
    {
      title: "Getting from feed to a drink is a real step up",
      detail:
        "Spent grain is roughly 15% to 30% protein when dry. Making it drinkable takes enzyme treatment and filtering to dissolve it and remove the bitter, malty aftertaste, which is where most attempts struggle. Selling it as food also needs a documented safety case (FDA's GRAS process) and a food-grade facility. Your current system produces feed-grade output, so this is a new production line, not a setting change.",
    },
    {
      title: "Gatorade is the wrong comparison, and that helps you",
      detail:
        "Gatorade is sugar, salt and water for hydration. A protein drink competes with recovery drinks instead: Gatorade Recover (20g protein), Fairlife Core Power (26 to 42g) and Muscle Milk. NCAA rules no longer cap how much protein a school can give athletes (the 30% limit was removed in 2017). But most athletic departments require NSF Certified for Sport testing against banned substances before anything reaches a player.",
    },
    {
      title: "WMU's drink contract is the gate, and it is not public",
      detail:
        "We could not find WMU Athletics' beverage sponsor or contract term in any public record. Gatorade is a partner of the Mid-American Conference, which WMU plays in, and big schools usually sign exclusive deals of several years; Michigan signed one with Coca-Cola in May 2026. Until that contract is known, “replace Gatorade” is a question for WMU's athletics business office, not a product decision.",
    },
  ],
  verdict:
    "Start with WMU's Nutrition and Dietetics program, not the athletics sponsorship. It is accredited and already teaches sustainable food systems. A small research batch of a spent-grain recovery drink, formulated and taste-tested with faculty and students, gives you real nutrition and taste data, a Kalamazoo circular-economy story, and a case for MEDC or MSU Product Center support, which also offers product development and co-packing help. In parallel, sell dried spent grain or a protein concentrate to an ingredient processor, as EverGrain does, so the drink never has to carry the business on its own. Bell's in Comstock and New Holland in Holland are natural partners: Bell's already sends its spent grain to cattle feed, and New Holland runs a brewery and a distillery side by side. Once the recovery drink has data and NSF certification behind it, the athletics conversation is about adding a product next to Gatorade, which is far easier than replacing it.",
  sources: [
    { label: "Research and Markets — US ready-to-drink protein beverages", url: "https://www.researchandmarkets.com/reports/5854311/ready-to-drink-protein-beverages-market-share" },
    { label: "Fortune Business Insights — RTD protein beverages market", url: "https://www.fortunebusinessinsights.com/rtd-protein-beverages-market-103179" },
    { label: "Future Market Insights — plant-based protein beverages", url: "https://www.futuremarketinsights.com/reports/plant-based-protein-beverages-market" },
    { label: "Global Market Insights — upcycled food products market", url: "https://www.gminsights.com/industry-analysis/upcycled-food-products-market" },
    { label: "Fortune Business Insights — upcycled food products market", url: "https://www.fortunebusinessinsights.com/upcycled-food-products-market-113710" },
    { label: "Brownfield Ag News — DDG prices in 2026", url: "https://www.brownfieldagnews.com/news/ddg-price-shifts-could-raise-livestock-feed-costs-in-2026/" },
    { label: "ChemAnalyst — pea protein isolate pricing", url: "https://www.chemanalyst.com/Pricing-data/pea-protein-isolate-2396" },
    { label: "Food Dive — EverGrain upcycles AB InBev's barley waste", url: "https://www.fooddive.com/news/evergrain-upcycles-ab-inbevs-barley-waste-into-plant-based-protein/592839/" },
    { label: "FoodNavigator — EverGrain starts commercial production", url: "https://www.foodnavigator.com/Article/2022/07/07/EverGrain-starts-commercial-production-of-upcycled-barley-protein/" },
    { label: "Nosh — ReGrained turns away from branded items", url: "https://www.nosh.com/news/2021/with-renewed-focus-on-ingredients-regrained-turns-away-from-branded-items/" },
    { label: "PMC — brewers' spent grain protein in food formulations", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10093925/" },
    { label: "ScienceDirect — enzyme-assisted extraction of spent grain protein", url: "https://www.sciencedirect.com/science/article/pii/S2772502222000683" },
    { label: "Athletic Business — NCAA 30 percent protein rule deregulated", url: "https://www.athleticbusiness.com/operations/programming/article/15148966/ncaas-30-percent-protein-calorie-rule-deregulated" },
    { label: "NSF — Certified for Sport program", url: "https://www.nsf.org/consumer-resources/articles/certified-for-sport-program" },
    { label: "Gatorade — recovery products", url: "https://www.gatorade.com/recovery" },
    { label: "Fairlife — Core Power", url: "https://fairlife.com/core-power/" },
    { label: "JMI Sports — Mid-American Conference partners", url: "https://www.jmisports.com/our-partners/mid-american-conference-marketing/" },
    { label: "University Record — Coca-Cola selected as U-M's exclusive beverage supplier", url: "https://record.umich.edu/articles/coca-cola-selected-as-u-ms-exclusive-beverage-supplier/" },
    { label: "Van Wagner — WMU Athletics multimedia rights partnership", url: "https://www.vanwagner.com/western-michigan-university-athletics-and-van-wagner-announce-multimedia-rights-partnership/" },
    { label: "WMU — Nutrition and Dietetics program", url: "https://wmich.edu/familyconsumer/academics/dietetics" },
    { label: "MSU — Food Processing and Innovation Center", url: "https://www.canr.msu.edu/fpic/about" },
    { label: "Craft Brewing Business — Bell's Brewery sustainability", url: "https://www.craftbrewingbusiness.com/news/bells-brewery-earns-energy-star-challenge-award-lets-detail-its-sustainability-efforts/" },
    { label: "New Holland Brewing — our journey", url: "https://www.newhollandbrew.com/our-journey/" },
    { label: "Second Wave Media — Meknology profile, October 2025", url: "https://secondwavemedia.com/good-for-we-meknologys-daniel-hodges-has-found-a-better-way-to-treat-wastewater/" },
  ],
};
