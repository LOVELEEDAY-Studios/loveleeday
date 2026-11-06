export type Src = { label: string; url: string };

export const D = {
  mshdaScore: { label: "MSHDA, 2026-2027 LIHTC Scoring Criteria, version 01.2026", url: "https://www.michigan.gov/mshda/-/media/Project/Websites/mshda/developers/lihtc/assets/liqap/mshda_li_qap_2026_2027_score_sum_final_pdf.pdf" },
  mshdaMi: { label: "MSHDA, Michigan Low-Income Housing Tax Credit page, Oct 2026", url: "https://www.michigan.gov/mshda/developers/mi-lihtc" },
  tr: { label: "Thomson Reuters, July 28, 2026", url: "https://tax.thomsonreuters.com/news/michigan-enacts-housing-opportunity-tax-credit-program/" },
  pm: { label: "Plante Moran, Sept 8, 2026", url: "https://plantemoran.com/explore-our-thinking/insight/2026/plante-moran-realpoint/michigan-expands-real-estate-incentives" },
  wm: { label: "Williams Mullen, July 11, 2025", url: "https://www.williamsmullen.com/insights/news/legal-news/low-income-housing-tax-credit-reform-one-big-beautiful-bill-acts-effect" },
  cbs: { label: "CBS Detroit, June 18, 2026", url: "https://www.cbsnews.com/detroit/news/whitmer-603-affordable-housing-units-across-michigan/" },
  kalFund: { label: "Kalamazoo County, Apply for Funding", url: "https://www.kalcounty.gov/1149/Apply-for-Funding" },
  kalAmi: { label: "Kalamazoo County, Area Median Incomes, effective May 1, 2026", url: "https://www.kalcounty.gov/1152/Area-Median-Incomes" },
  acs: { label: "U.S. Census Bureau, American Community Survey 2020-2024 5-year and 2025 1-year, tables B25064, B25070, B19013", url: "https://api.census.gov/data/2024/acs/acs5" },
  bls: { label: "BLS, Occupational Employment and Wage Statistics, Kalamazoo-Portage, 2025", url: "https://www.bls.gov/oes/current/oes_28020.htm" },
  fred: { label: "FRED, Federal Reserve Bank of St. Louis: DGS10, SOFR, MORTGAGE30US", url: "https://fred.stlouisfed.org" },
  sw0204: { label: "Second Wave, Feb 4, 2026", url: "https://secondwavemedia.com/new-complex-at-burdick-and-vine-will-mark-the-intersection-of-needed-housing-and-healthy-living/" },
  sw0612: { label: "Second Wave, June 12, 2026", url: "https://secondwavemedia.com/phase-ii-of-a-northside-kalamazoo-housing-project-gets-2-million-investment/" },
  sw0911: { label: "Second Wave, Sept 11, 2026", url: "https://secondwavemedia.com/10-6-million-expansion-of-northside-housing-project-will-add-38-more-apartments/" },
  indian: { label: "Indian Gaming, July 22, 2025", url: "https://www.indiangaming.com/pokagon-band-partners-on-affordable-housing-project/" },
  rej: { label: "REjournals, Sept 11, 2026", url: "https://rejournals.com/?p=187912" },
  wwmt23: { label: "WWMT, March 28, 2023", url: "https://www.wwmt.com/news/local/jamauri-bogan-development-northside-neighborhood-kalamazoo-housing-child-care-park-street-brownfield-development" },
  bridge: { label: "Bridge Michigan, Jan 8, 2026", url: "https://bridgemi.com/michigan-government/michigan-helps-employers-build-housing-in-detroit-kalamazoo-as-fund-runs-dry/" },
  kzcf: { label: "Kalamazoo Community Foundation", url: "https://kzcf.org/news-resources/impact-investments/breaking-barriers/" },
  site: { label: "bogandevelopments.com", url: "https://bogandevelopments.com" },
  hudSec3: { label: "HUD Section 3 final rule, Federal Register Sept 29, 2020 (benchmarks as reported in search results; rule text not opened)", url: "https://www.govinfo.gov/content/pkg/FR-2020-09-29/pdf/2020-19333.pdf" },
} satisfies Record<string, Src>;

export type Stage = {
  n: number;
  name: string;
  when: string;
  involves: string;
  livesToday: string;
  answers: string;
  joins: string[];
  sample: string;
  proof: { text: string; src: Src }[];
};

export const lifecycle: Stage[] = [
  {
    n: 1, name: "Site control", when: "Before anything is committed",
    involves: "The owner, price or donation terms, zoning now and zoning needed, brownfield or Neighborhood Enterprise Zone status, and how long the option runs. Your sites so far came by city-owned lot, hospital land, assembled parcels and a township parcel.",
    livesToday: "Is it a folder per parcel, an email thread, a list of sites you are watching, or one person's memory? Who knows when an option expires?",
    answers: "Which sites do we hold, what does each still need before it is real, and what is the next date that matters on each?",
    joins: ["County parcel and tax records", "City and township zoning maps", "Planning commission and council agendas", "HUD qualified census tracts and difficult development areas"],
    sample: "Where the portal allows it: which parcels in Kalamazoo, Portage and Battle Creek were on a council or planning agenda in the last 30 days, and which are zoned for five stories?",
    proof: [{ text: "B on Burdick replaces a closed store and vacant houses on land Bronson owns.", src: D.sw0204 }],
  },
  {
    n: 2, name: "Pre-development", when: "Months or years, before capital commits",
    involves: "Drawings, market study, environmental reports, rezoning, site plan approval, neighborhood meetings, estimates that move monthly, and a first pass at who funds what.",
    livesToday: "Is it the architect's shared folder, a consultant's PDF, a binder or an inbox? When the estimate changes, who updates the stack?",
    answers: "What do we have in hand, what is missing, and what does each month of waiting cost?",
    joins: ["MSHDA scoring sheet (zoning and site plan approval are 3 points each)", "City planning calendars", "Lender rate quotes"],
    sample: "Which of our sites already have zoning and site plan approval in hand, and what is each worth if we applied this year?",
    proof: [{ text: "Zoning is 3 points and site plan approval is 3 points on a nine percent application, and neither can be bought later.", src: D.mshdaScore }],
  },
  {
    n: 3, name: "Capital stack assembly", when: "From first sketch to closing",
    involves: "Federal credits at 9 percent and 4 percent, Michigan's new state credit, MSHDA grants and loans, Brownfield capture and the Transformational Brownfield Program, county millage, Employer-Assisted Housing, HOME and CDBG through a city, a Federal Home Loan Bank AHP grant through a member bank, CDFI loans, New Markets credits. For each: amount, committed or applied for, conditions, dates, and what it asks of the building.",
    livesToday: "Is the stack a spreadsheet one person keeps, with award letters in another folder and conditions in people's heads? Where is Phase II's county award, payable 2027, written next to the lender's closing date?",
    answers: "What is committed, what is conditional, what is left to raise, and what changes if one source slips a quarter?",
    joins: ["Each program's published rules", "MSHDA board and award announcements", "County funding page and scoring sheet", "Rates"],
    sample: "If the county millage does not renew after 2028, which of our next three deals loses a source, and how large is the gap?",
    proof: [
      { text: "Phase I took at least six sources to build 12 homes, including a 20-year $1.95 million Community Foundation loan.", src: D.wwmt23 },
      { text: "Phase II's named public sources add to $4.35 million of a $10.6 million cost, about 41 percent.", src: D.sw0911 },
    ],
  },
  {
    n: 4, name: "Tax credit and bond applications", when: "Rounds set by MSHDA",
    involves: "Choosing the 9 percent competitive route or the 4 percent bond route, then the state credit on top of 4 percent. Documents mostly dated within a year of the round deadline.",
    livesToday: "Is there a checklist for a MSHDA application, or is it rebuilt from the last one? Which letters in last year's file have expired?",
    answers: "For the next round, what is each candidate site worth, what is each missing, and what is the cheapest way to close each gap?",
    joins: ["MSHDA scoring sheet", "MSHDA award lists from past rounds", "HUD tract and area designations", "Household-burden figures by census tract"],
    sample: "Which of our sites could use the 4 percent credit plus the state credit, and what must be ready by the January 2027 window?",
    proof: [
      { text: "June 2026: 13 developments, $18.9 million in 9 percent credits, awards of $1,098,242 to $1,650,000 a project.", src: D.cbs },
      { text: "State credit: $42 million a year, six-year credit, half through Pass-Through Bonds and half through Direct Lending, targets Dec 4, 2026 and Jan 4, 2027 (tentative) and mid-July 2027.", src: D.mshdaMi },
      { text: "Federal change for 2026: the bond-financing test for 4 percent deals drops from 50 to 25 percent for bonds issued after Dec 31, 2025; a 12 percent increase in 9 percent allocations is permanent.", src: D.wm },
    ],
  },
  {
    n: 5, name: "Brownfield and local incentives", when: "Alongside site control and the stack",
    involves: "Brownfield plans, Neighborhood Enterprise Zones, abatements and city loans, each approved by a local body, each interacting with the others and with scoring.",
    livesToday: "Is the plan with the city's authority, the incentive math in an accountant's file, and the scoring consequence written nowhere?",
    answers: "What is each parcel's incentive worth over its life, what does choosing it cost us elsewhere, and which meetings must approve it?",
    joins: ["Brownfield Redevelopment Authority and council agendas", "State program rules", "MSHDA scoring sheet"],
    sample: "On a nine percent application, what do we gain and lose by using the brownfield capture structure instead of a straight abatement?",
    proof: [
      { text: "Phase I: $159,578 of state tax capture for brownfield reimbursement. Phase II: brownfield plan, Neighborhood Enterprise Zone, $500,000 city brownfield loan.", src: D.wwmt23 },
      { text: "Transformational Brownfield expanded in 2026: $160 million a year, $3.2 billion total, sunset Dec 31, 2032, 20 percent affordable units for full income tax capture.", src: D.pm },
      { text: "A project using a housing tax increment structure can earn the 3 abatement points but is not eligible for the 5 points for committing beyond 30 years.", src: D.mshdaScore },
    ],
  },
  {
    n: 6, name: "Public and philanthropic money", when: "Each source on its own clock",
    involves: "County millage, Employer-Assisted Housing, HOME and CDBG, FHLB AHP, community lenders, New Markets. Application windows, scoring, reporting rules, and whether a dollar of one disqualifies a dollar of another.",
    livesToday: "Is it a spreadsheet of programs, a peer's phone call, a program officer's email?",
    answers: "What is open now, what is coming, which of our deals fit, and what does each ask of us afterward?",
    joins: ["County and city funding pages", "MSHDA board agendas", "FHLB announcements", "State budget bills"],
    sample: "What can we apply for before January 31, and which of those would add a report we are not set up to produce?",
    proof: [
      { text: "County multi-family: $4,000,000 available, units affordable at or below 120 percent of median, 20 years of affordability, first review deadline Oct 23, 2026, later applications from Q1 2027 subject to funding.", src: D.kalFund },
      { text: "Employer-Assisted Housing funds were spent by January 2026 with no new state money in the October 2025 budget.", src: D.bridge },
    ],
  },
  {
    n: 7, name: "Closing and construction draws", when: "From closing to certificate of occupancy",
    involves: "Each lender's draw schedule, retainage, change orders, inspections, lien waivers, architect certifications, and the order in which sources must be spent.",
    livesToday: "Is it each lender's portal, the architect's certificates, the builder's pay application packets and a running sheet of what came from which source?",
    answers: "How much of each source is drawn, what is the next draw and what does it need, and are we on budget line by line?",
    joins: ["Lender and agency draw requirements", "Rates and cost indexes"],
    sample: "Which sources have we not yet drawn on Phase II, and what is the deadline on each before it lapses?",
    proof: [{ text: "Phase II: groundbreaking Sept 10, 2026, Pinnacle Construction Group named construction manager, opening targeted fall 2027.", src: D.sw0911 }],
  },
  {
    n: 8, name: "Minority- and women-owned firms, and Section 3", when: "Every pay application",
    involves: "Subcontracts, pay applications, payroll reports, certification status, and labor hours. HUD's Section 3 benchmarks are 25 percent of labor hours by Section 3 workers, with 5 percent by targeted workers counted inside the 25.",
    livesToday: "Is it in the builder's reports, and do you see it before a funder asks?",
    answers: "Where do we stand against the commitment today, which upcoming contracts could close the gap, and what does each funder need?",
    joins: ["Certified-vendor lists", "HUD Section 3 benchmarks"],
    sample: "What share of Burdick's contracted work is with minority- and women-owned firms today, and what would it take to reach 33 percent?",
    proof: [{ text: "Burdick earmarks 33 percent of construction work for minority- and women-owned firms.", src: D.sw0204 }],
  },
  {
    n: 9, name: "Lease-up", when: "Before and after opening",
    involves: "Waitlist, eligibility by unit, the rent each band can carry after utilities, committed preferences (a hospital's employees, tribal families), and fair-housing rules.",
    livesToday: "Is it a property manager's system, a paper list, a form that forwards by email?",
    answers: "Who is on the list, who qualifies for what, and how fast are units filling against the schedule an investor was shown?",
    joins: ["County income table effective May 1, 2026", "Rent ceilings it implies"],
    sample: "How many people on the Phase II list qualify for a studio at 40 percent of median versus 60 percent?",
    proof: [
      { text: "Phase II mix: 10 studios, 18 one-bedrooms, 10 two-bedrooms. Burdick: 85 homes at 60 to 120 percent of median, 20 leased to Bronson employees.", src: D.sw0204 },
      { text: "Lighthouse Ridge reserves 11 of 52 homes for Pokagon Band families.", src: D.indian },
    ],
  },
  {
    n: 10, name: "Income certification and recertification", when: "Move-in, then on each funder's schedule",
    involves: "Application, third-party verification, certification date, the limit in force that day, the unit's band, and the next recertification date. One building with three funders can carry three rule sets.",
    livesToday: "Is it in the property manager's files, and does a person check each against the table in force on that date?",
    answers: "Which households are due, which are at risk, and which vacancies must be filled at a certain band?",
    joins: ["County income table each time it changes", "Each funder's rules for each building"],
    sample: "Which Phase I households are due for recertification in the next 60 days, and what limit applies to each?",
    proof: [{ text: "County 4-person limits effective May 1, 2026: 60 percent $63,180; 100 percent $105,300; 120 percent $126,360.", src: D.kalAmi }],
  },
  {
    n: 11, name: "Asset management", when: "Every month after lease-up",
    involves: "Occupancy, rents, operating cost, reserves, loan covenants, insurance, repairs, and debt that eventually comes due.",
    livesToday: "Is it a monthly PDF from each property manager that someone reads and files?",
    answers: "Which properties are drifting, why, and what is due in the next 90 days?",
    joins: ["Rates", "Local rent and wage data", "Funder covenant terms"],
    sample: "Which properties are within 10 percent of a loan covenant, and what drove it?",
    proof: [{ text: "Overnight financing rate 3.92 percent on Nov 5, 2026, up from 3.62 percent on Sept 10.", src: D.fred }],
  },
  {
    n: 12, name: "Investor and syndicator reporting", when: "Quarterly, in each investor's layout",
    involves: "Occupancy, rents, certifications, construction progress, credit delivery, and anything that changes the investor's return.",
    livesToday: "Is each report rebuilt by hand from the property reports, in each investor's layout?",
    answers: "What do we owe each investor and funder this quarter, and can the first draft be built from the record?",
    joins: ["Investor report templates", "The deal's own record"],
    sample: "Draft the Community Foundation update from what happened this quarter, with every figure sourced.",
    proof: [{ text: "Lighthouse Ridge: $12.4 million of credit equity closed.", src: D.rej }],
  },
  {
    n: 13, name: "The compliance years", when: "Years 1 to 30 and beyond",
    involves: "Each building's start date and every funder's end date, ownership changes, inspections and notices.",
    livesToday: "Does anyone track, for each building, the last day each obligation ends?",
    answers: "For every home we own, what do we owe, to whom, until when, and what happens if we sell, refinance or restructure?",
    joins: ["Funder agreements", "Statutory periods"],
    sample: "If we sold Zone 32 Phase I in year 10, which obligations would travel with the building and for how long?",
    proof: [
      { text: "Tax credit buildings: 15-year compliance period plus 15-year extended use, a 30-year minimum.", src: D.mshdaScore },
      { text: "County millage dollars: 20 years of affordability.", src: D.kalFund },
    ],
  },
];

export type Feed = {
  name: string; publisher: string; joinsTo: number[]; what: string; asOf: string;
  status: "read this session" | "found in search only" | "not opened"; src: Src | null;
};

export const feeds: Feed[] = [
  { name: "Income limits", publisher: "Kalamazoo County, from HUD", joinsTo: [9, 10], what: "Four-person limits $63,180 at 60 percent, $105,300 at 100 percent, $126,360 at 120 percent; table stops at five persons. No Van Buren County table was read.", asOf: "Effective May 1, 2026; read Nov 6, 2026", status: "read this session", src: D.kalAmi },
  { name: "Qualified census tracts and difficult development areas", publisher: "HUD", joinsTo: [1, 4], what: "2026 designations, effective Jan 1, 2026. A site inside one can earn up to 30 percent more credit. Kalamazoo-area tracts not read.", asOf: "Search results only", status: "found in search only", src: null },
  { name: "Scoring criteria", publisher: "MSHDA", joinsTo: [2, 4, 5], what: "48-page 2026-2027 sheet, version 01.2026: Urban Opportunity 44, Development Characteristics 62, Development Team 11, Cost Reasonableness 5.", asOf: "Version 01.2026; read Nov 6, 2026", status: "read this session", src: D.mshdaScore },
  { name: "Award lists", publisher: "MSHDA", joinsTo: [4], what: "June 18, 2026: 13 developments, $18.9 million; two in southwest Michigan (Allegan Terrace $1,476,000, 44 homes; Sunset Grove at South Haven $1,369,652, 42 homes). MSHDA's own release refused reading; table read from a published copy.", asOf: "June 18, 2026", status: "read this session", src: D.cbs },
  { name: "State credit program page", publisher: "MSHDA", joinsTo: [3, 4], what: "$42 million a year, six-year credit, at least 30 percent rural if enough applications; tentative Dec 4, 2026, Jan 4, 2027, mid-July 2027.", asOf: "October 2026; read Nov 6, 2026", status: "read this session", src: D.mshdaMi },
  { name: "State credit statute summary", publisher: "Thomson Reuters", joinsTo: [3, 4], what: "Effective July 21, 2026 (P.A. 23 of 2026); $42 million base for the 2027 cycle, then CPI; at least 25 percent each for new-construction and preservation 4 percent projects.", asOf: "July 28, 2026", status: "read this session", src: D.tr },
  { name: "Brownfield and abatement changes", publisher: "Plante Moran", joinsTo: [5], what: "Transformational Brownfield cap $160 million a year, $3.2 billion total, sunset Dec 31, 2032, 20 percent affordable for full capture; PA 210 and 255 abatements to Dec 31, 2035.", asOf: "Sept 8, 2026", status: "read this session", src: D.pm },
  { name: "County funding page", publisher: "Kalamazoo County", joinsTo: [3, 6, 13], what: "Multi-family $4,000,000; 120 percent of median ceiling; 20 years; first review Oct 23, 2026; later from Q1 2027.", asOf: "Read Nov 6, 2026", status: "read this session", src: D.kalFund },
  { name: "Housing cost and rent burden", publisher: "U.S. Census Bureau, ACS", joinsTo: [1, 4, 9], what: "2020-2024: county median rent $1,093, 49.0 percent of 38,004 renter households pay 30 percent or more, 24.5 percent pay 50 percent or more; city median rent $1,078, 53.3 and 30.4 percent of 17,044. 2025 one-year county: rent $1,171, household income $72,002.", asOf: "Pulled Nov 6, 2026", status: "read this session", src: D.acs },
  { name: "Wages by occupation", publisher: "BLS, OEWS", joinsTo: [9], what: "Kalamazoo-Portage 2025 medians: registered nurses $88,200 (about 3,300 employed); licensed practical nurses $66,320; medical assistants $46,690; nursing assistants $39,500 (about 1,260 employed).", asOf: "2025 annual; pulled Nov 6, 2026", status: "read this session", src: D.bls },
  { name: "Rates", publisher: "Federal Reserve Bank of St. Louis", joinsTo: [3, 11], what: "10-year Treasury 4.90 percent (Nov 4); overnight financing rate 3.92 percent (Nov 5); average 30-year mortgage 7.18 percent (Nov 5).", asOf: "Nov 4 to 5, 2026", status: "read this session", src: D.fred },
  { name: "Section 3 benchmarks", publisher: "HUD", joinsTo: [8], what: "25 percent of labor hours by Section 3 workers; 5 percent by targeted workers, counted inside the 25. Dollar threshold for covered projects not confirmed.", asOf: "Rule effective Nov 30, 2020, per search results", status: "found in search only", src: D.hudSec3 },
  { name: "Jobs and commuting", publisher: "Census, LEHD", joinsTo: [1, 9], what: "Where workers live against where they work, for any employer partner. Not pulled for this draft.", asOf: "Not pulled", status: "not opened", src: null },
  { name: "County parcel records and council, planning and brownfield agendas", publisher: "County and city bodies", joinsTo: [1, 2, 5], what: "County and city sites refused automated reading in our checks. This is the piece that needs a connection or a person.", asOf: "Not opened", status: "not opened", src: null },
];

export type Answer = {
  q: string; stages: number[]; answer: string; working: string; caution: string; needsBoganRecords: boolean; src: Src[];
};

export const sampleAnswers: Answer[] = [
  {
    q: "Who can afford the rents planned at Burdick?",
    stages: [9],
    answer: "A nursing assistant at the area median clears the studio on one income, not the one-bedroom. A licensed practical nurse clears the one-bedroom. A registered nurse clears all three. A medical assistant clears the studio only.",
    working: "Rents $957, $1,400, about $2,100 need $38,280, $56,000 and $84,000 a year at 30 percent of income. Area medians: nursing assistant $39,500, medical assistant $46,690, licensed practical nurse $66,320, registered nurse $88,200. County 60 percent limit is $44,280 for one person and $50,580 for two; a one-bedroom at the standard 1.5 persons is about $1,186 before utility allowance, so $1,400 sits above the 60 percent ceiling.",
    caution: "Area medians, not Bronson's pay scale. We would replace them with the employer's own wage bands.",
    needsBoganRecords: false, src: [D.sw0204, D.bls, D.kalAmi],
  },
  {
    q: "What does the public record say is left to raise on Phase II and Burdick?",
    stages: [3],
    answer: "Phase II: named public sources total $4.35 million of $10.6 million, about 41 percent; the rest is not itemized in anything public. Burdick: the two named awards total $4 million of $40 million, exactly 10 percent, matching the public plan of 80 percent private, 10 percent public, 10 percent philanthropic.",
    working: "Phase II: county $2.0M + MSHDA $1.5M + city $0.35M + city brownfield loan $0.5M = $4.35M; 4.35 / 10.6 = 41.0 percent. Burdick: county $2M + Employer-Assisted Housing $2M = $4M; 4 / 40 = 10 percent.",
    caution: "Press-reported figures; your award letters would replace them. Bridge Michigan reports a different Employer-Assisted figure for Burdick and says its own totals do not reconcile.",
    needsBoganRecords: false, src: [D.sw0911, D.sw0204, D.sw0612],
  },
  {
    q: "How big is a nine percent award compared with what Burdick would need?",
    stages: [3, 4],
    answer: "A single award at the June 2026 maximum would raise about $13.6 million, roughly 34 percent of a $40 million project, at Lighthouse Ridge's pricing.",
    working: "June 2026 awards ran $1,098,242 to $1,650,000 a year. Lighthouse Ridge: $1.5M credits, $12.4M equity. If that is $1.5M a year for ten years, equity is 12.4 / 15 = about 83 cents per credit dollar. $1.65M x 10 x 0.83 = about $13.6M; 13.6 / 40 = 34 percent.",
    caution: "We do not know whether Burdick's plan includes tax credits, or whether $1.5M is the final Lighthouse Ridge award. Illustrates scale only.",
    needsBoganRecords: false, src: [D.cbs, D.indian, D.rej],
  },
  {
    q: "How efficient was Lighthouse Ridge's credit compared with recent awards nearby?",
    stages: [4],
    answer: "About $28,846 of credit per home against $32,611 and $33,545 for the two southwest Michigan awards in June 2026, Lighthouse Ridge's figure is about 12 and 14 percent lower.",
    working: "$1,500,000 / 52 = $28,846. Sunset Grove $1,369,652 / 42 = $32,611. Allegan Terrace $1,476,000 / 44 = $33,545.",
    caution: "Different rounds, and the sheet scores against averages for each building type, not against other projects. Shows the shape of the question, not a ranking. Whether Sunset Grove is the project South Haven's council discussed with Dwelling Place in 2025 is unconfirmed.",
    needsBoganRecords: false, src: [D.cbs, D.indian, D.mshdaScore],
  },
  {
    q: "What is open, and when?",
    stages: [4, 6],
    answer: "State-credit gap round targeted Dec 4, 2026 (28 days, tentative); first pass-through window Jan 4, 2027 (59 days, tentative); second mid-July 2027. County multi-family had $4 million with a first review deadline of Oct 23, 2026, now passed; later applications from Q1 2027, subject to funding.",
    working: "Days counted from Nov 6, 2026.",
    caution: "MSHDA marks its dates tentative. We would add a fit note for each of your deals and flag documents that will have expired by the date.",
    needsBoganRecords: false, src: [D.mshdaMi, D.kalFund],
  },
  {
    q: "What has the cost of money done since Phase II's awards?",
    stages: [3, 11],
    answer: "The 10-year Treasury was 0.71 of a percentage point higher at the Phase II groundbreaking than when Bogan's news item reported MSHDA's award; the overnight rate that floats construction debt barely moved through the Sept 10 groundbreaking.",
    working: "10-year: 4.24 (Jan 27), 4.48 (June 12, county award reported), 4.95 (Sept 10, groundbreaking). Overnight rate: 3.66, 3.65, 3.62; 3.92 on Nov 5.",
    caution: "Rates only. The effect on a gap needs the project's debt terms.",
    needsBoganRecords: false, src: [D.fred],
  },
  {
    q: "How many renters in Kalamazoo are stretched, and where?",
    stages: [1, 4],
    answer: "49.0 percent of county renter households and 53.3 percent in the city pay 30 percent or more of income for housing; 30.4 percent in the city pay half or more. The state's sheet scores overburden by census tract: 1 point at 30 to 39.9 percent, 2 at 40 to 49.9, 3 at 50 and above, with a third-of-a-mile reach to a higher tract.",
    working: "County: (2,788 + 2,757 + 3,778 + 9,305) / 38,004. City: (1,120 + 1,255 + 1,525 + 5,183) / 17,044.",
    caution: "The sheet's own table is by tract and may define the share differently; we would use its table for any site.",
    needsBoganRecords: false, src: [D.acs, D.mshdaScore],
  },
  {
    q: "What does the year-by-year obligation list look like?",
    stages: [13],
    answer: "County millage dollars: 20 years of affordability. A tax credit building: 15 years of compliance plus 15 of extended use. For each building, every funder, its first and last day, the next report due, and what changes if you refinance.",
    working: "As printed on the county funding page and the MSHDA scoring sheet.",
    caution: "Each of your own agreements would replace these general terms.",
    needsBoganRecords: true, src: [D.kalFund, D.mshdaScore],
  },
  {
    q: "What share of Burdick's work has gone to minority- and women-owned firms?",
    stages: [8],
    answer: "Public numbers cannot answer this one. With the subcontracts and pay applications, the answer is a percentage against the 33 percent commitment, the contracts that would move it, and what each funder will ask for.",
    working: "Needs your contract records.",
    caution: "Stated plainly because the public record holds only the promise, not the result.",
    needsBoganRecords: true, src: [D.sw0204],
  },
];

export type QapLine = {
  section: "Urban Opportunity" | "Development Characteristics" | "Development Team" | "Cost Reasonableness";
  line: string; points: string; rule: string; publicFact: string; boganAngle: string; status: "documented" | "checkable now" | "needs a letter" | "needs your records";
};
export const qapScorecard: QapLine[] = [
  { section: "Urban Opportunity", line: "Community supported initiatives, place-based developer", points: "5 (3 without a place-based developer)", rule: "Applicant headquartered and working mainly in the local municipality, county or economic region, with at least 25 percent ownership.", publicFact: "Initiative must be within 24 months of the round deadline.", boganAngle: "On Lighthouse Ridge, where Bogan is a development partner and not the lead, the ownership share decides these points.", status: "needs your records" },
  { section: "Urban Opportunity", line: "Proximity to amenities", points: "25", rule: "Within 1 mile earns full points, within 2 miles half. Child care 5, grocery 5, pharmacy 3, clinic 3, library 2, public school 2, community organization 2, employment center 1, park 1, job training 1.", publicFact: "An employment center is one employer with 250 or more year-round employees at one location (125 in balance of state).", boganAngle: "A licensed child care center nearby counts for family projects.", status: "checkable now" },
  { section: "Urban Opportunity", line: "Proximity to transportation", points: "4", rule: "Stop within a quarter mile in urban areas, or dial-a-ride five days a week.", publicFact: "Straight-line distance.", boganAngle: "Mapped for every site before it is optioned.", status: "checkable now" },
  { section: "Urban Opportunity", line: "Household overburdened area", points: "3", rule: "By census tract: 30 to 39.9 percent of households 1, 40 to 49.9 percent 2, 50 percent and above 3; a third-of-a-mile reach to a higher tract.", publicFact: "County renter burden 49.0 percent; city 53.3 percent (ACS 2020-2024).", boganAngle: "Tract-level figure for each site.", status: "checkable now" },
  { section: "Urban Opportunity", line: "Communities without recent awards", points: "2", rule: "County with no 9 percent reservation in the last four funding rounds.", publicFact: "June 2026 list included a project in South Haven Township.", boganAngle: "Van Buren County has recent reservations, so a next site there would likely not earn these points. Check other counties.", status: "checkable now" },
  { section: "Urban Opportunity", line: "Job growth opportunities", points: "4 (2 within 25 miles)", rule: "Within 15 miles of an economic-development project funded with significant state money, from a list published before each round.", publicFact: "List not yet read.", boganAngle: "Employer-partner leads would be checked against it.", status: "needs a letter" },
  { section: "Urban Opportunity", line: "Community revitalization plan area", points: "1", rule: "Signed letter or resolution from local government dated within 60 days of the deadline.", publicFact: "Population-based investment thresholds apply where no plan exists.", boganAngle: "A calendar item to request the letter on time.", status: "needs a letter" },
  { section: "Development Characteristics", line: "Low-income targeting", points: "25", rule: "Depth and breadth of targeting; printed factors 100 at 20 percent of median, 70 at 30 percent, 30 at 40 percent; caps on counted units.", publicFact: "Phase II reports disagree between 60 percent and 40 percent of median for 10 units.", boganAngle: "Which is right changes the score.", status: "needs your records" },
  { section: "Development Characteristics", line: "Zoning and site plan approval", points: "3 + 3", rule: "Proper zoning in place; letter from the local body that no further approvals are needed beyond staff level.", publicFact: "Evidence required.", boganAngle: "Cannot be bought later.", status: "needs a letter" },
  { section: "Development Characteristics", line: "Tax abatement", points: "3", rule: "Abatement or an equivalent structure in place longer than the 15-year compliance period.", publicFact: "A housing tax increment structure can earn these points.", boganAngle: "Choosing it forfeits the affordability-commitment points.", status: "documented" },
  { section: "Development Characteristics", line: "Affordability commitment", points: "5", rule: "0.34 points per year beyond the 30-year minimum, up to 5.", publicFact: "Projects using a TIF structure are not eligible.", boganAngle: "The trade-off against tax abatement.", status: "documented" },
  { section: "Development Team", line: "Previous experience of general partner or member", points: "7", rule: "2 for non-credit affordable housing experience, 2 for government-funded economic development, 3 / 5 / 7 for 1-2 / 3-4 / 5 or more completed credit projects. An owner with no completed credit project must show a team that has done so.", publicFact: "Completed means construction done and IRS Form 8609 received in the last 20 years.", boganAngle: "Zone 32's public funding history may count in the first two lines; Lighthouse Ridge is not yet a completed project.", status: "needs your records" },
  { section: "Development Team", line: "Previous experience of management agent", points: "4", rule: "1 to 4 points by number of credit projects managed for over 3 years.", publicFact: "Property manager named on Phase I: The Lukeman Group.", boganAngle: "Choice of manager is a scoring choice.", status: "needs your records" },
  { section: "Cost Reasonableness", line: "Cost reasonableness with credit efficiency", points: "up to +5, negative if above", rule: "Credit per home against the average for the building type, with a 2.5 percent safe harbor either side.", publicFact: "Lighthouse Ridge about $28,846 a home; June 2026 southwest Michigan awards $32,611 and $33,545.", boganAngle: "Different rounds; shape of the question only.", status: "checkable now" },
];

export const qapMethod = {
  summary: "For each candidate site, read the printed line, find the public fact that settles it, mark it documented, checkable now, needs a letter or needs your records, then rank sites by points held and by the points cheapest to close. Every figure keeps its source and date.",
  limits: [
    "A prediction of how a deal would score, not of whether it would win. The sheet is public; the scores of past winners are not in what we read.",
    "The 9 percent sheet does not govern a 4 percent bond deal, the route the state credit sits beside. A project the size of Burdick would be scored in a different conversation.",
    "The sheet is revised for each two-year plan. We read 2026-2027 and would re-read it when MSHDA reissues it.",
  ],
  src: D.mshdaScore,
};

export type Software = {
  slug: string; name: string; rank: number; users: string[]; problem: string; does: string; connects: string[];
  size: "S" | "S to M" | "M" | "M to L"; improvement: string; foldsInto?: string;
};

export const software: Software[] = [
  { slug: "stack", name: "Capital stack modeller, tied to the funding calendar", rank: 1, users: ["You", "Your vice president", "Lender contacts", "Your accountant"], problem: "The stack for each deal is a spreadsheet one person keeps, and it does not know that a county award is payable in 2027 or that a state round closes next month.", does: "Holds every source for every project with amount, committed or not, conditions and dates, and lets you move one source to see what breaks.", connects: ["Award letters and closing documents", "Funding calendar", "Rates", "MSHDA scoring sheet"], size: "M", improvement: "Carries the interactions between sources (a tax-increment structure that costs scoring points, a source that cannot be combined with another) and starts a new deal's stack from the last deal's, so a first draft of an application begins from what you already learned." },
  { slug: "dataroom", name: "Funder data room with live reporting", rank: 2, users: ["Funders", "Investors", "County", "MSHDA", "Community Foundation", "A future buyer"], problem: "Every ask is rebuilt from four folders.", does: "One private room per deal in which each party sees what it is entitled to, in its own format, always current, with each figure linked to its source.", connects: ["Stack modeller", "Draw tracker", "Certification workflow", "Property manager's monthly reports"], size: "M", improvement: "Each funder gets its own layout from the same record, and a person approves every report before it leaves." },
  { slug: "draws", name: "Construction draw tracker", rank: 3, users: ["You", "Construction manager", "Architect", "Lenders"], problem: "Money moves from several sources in a set order against pay applications, and keeping it straight is someone's side job.", does: "Shows what has been drawn from each source, the next draw and what it needs, and cost against budget by line.", connects: ["Lender draw schedules", "Pay applications", "Change orders"], size: "M", improvement: "Feeds the contractor-commitment tracker from the same pay applications, so the minority- and women-owned share becomes a by-product of paperwork already done." },
  { slug: "mwbe", name: "Minority- and women-owned business and Section 3 tracker", rank: 4, users: ["You", "Construction manager", "Funders who ask"], problem: "Burdick's plan promises 33 percent of construction to minority- and women-owned firms, and the number is checked only when a funder asks.", does: "Tracks contracted and paid work by firm and certification, and where federal housing money applies, Section 3 labor hours against HUD's 25 and 5 percent benchmarks.", connects: ["Pay applications", "Payroll reports", "Certified-vendor lists"], size: "S to M", improvement: "Works forward as well as backward, flagging upcoming bid packages where a certified firm could move the number." },
  { slug: "certs", name: "Income certification and recertification workflow", rank: 5, users: ["Property manager", "Whoever carries compliance at Bogan", "Residents", "Investors who audit"], problem: "Every household is certified at move-in and re-checked on each funder's schedule, against the limit in force that day, and one miss can put credits or grants at risk.", does: "Collects documents, calculates income, checks it against the county table and the unit's band, and schedules each recertification.", connects: ["County income table", "Property manager's records", "Lease-up list"], size: "M to L", improvement: "Knows which funders apply to which unit, checks one household against all of them in one pass, and warns when a vacancy must be filled at a particular band. Works alongside the property manager, not in place of one." },
  { slug: "portal", name: "Resident application and waitlist portal with income pre-screen", rank: 6, users: ["Prospective residents", "Leasing staff"], problem: "People do not know whether they qualify, and staff spend time on people who do not.", does: "Lets a person privately check which homes they may qualify for, join a waitlist and submit documents.", connects: ["County income table", "Certification workflow"], size: "M to L", improvement: "The real work is the waitlist that keeps preferences (a hospital's employees, tribal families) and fair-housing rules straight, and keeps the screen from ever making the final decision. Best built after the certification workflow it feeds; Phase II opens fall 2027." },
  { slug: "hearings", name: "Public-hearing and community engagement tracker", rank: 7, users: ["You", "Your vice president"], problem: "Every project needs a rezoning, brownfield plan, enterprise zone or site plan, each with hearings, neighbors and a vote.", does: "Tracks approvals, hearing dates, who spoke, what neighbors asked and what was promised.", connects: ["City and county agendas from the meeting-watch layer"], size: "S", improvement: "Promises made at a hearing become tracked commitments, so what you told a neighborhood in year one is remembered in year four, and the dated letters the scoring sheet asks for are already on file.", foldsInto: "Early addition to the funding calendar" },
  { slug: "employer", name: "Employer-assisted housing partner portal", rank: 8, users: ["An employer's human resources team", "Bogan"], problem: "Bronson's 20 leased units mean employees who need to find them, and the next employer will ask what the first one got.", does: "Shows an employer its units, its employees' eligibility and move-in progress, and the reports it needs.", connects: ["Waitlist", "Stack modeller"], size: "S to M", improvement: "A view inside the funder data room, not a separate product. The state pilot money has run out, so the value is in recruiting the next partner with a model that works.", foldsInto: "Funder data room" },
  { slug: "ops", name: "Property operations dashboard", rank: 9, users: ["You", "An asset manager", "Property managers"], problem: "Each property sends its own monthly report.", does: "Puts occupancy, rent, cost and repair data from every property on one page, with covenants and reserves beside them.", connects: ["Property manager exports (read, not replaced)"], size: "M", improvement: "Watches each loan covenant and the rate, so you hear a building is drifting before the lender tells you. Value grows with building count: small at 12 homes, large at 187." },
  { slug: "learning", name: "Early learning partner reporting", rank: 10, users: ["Child care operator", "Community Foundation", "Bogan"], problem: "Phase I's early learning center is part of why funders backed it, and its enrollment and outcomes are part of what they ask about.", does: "Collects enrollment and attendance from the operator for funder reports.", connects: ["Funder data room"], size: "S", improvement: "One section of funder reporting, not its own system. Public reports disagree on whether the operator is the YMCA or the YWCA, and the first job is to set that straight in the record.", foldsInto: "Funder data room" },
];

export type TopPick = { order: number; slug: string; why: string };
export const softwareTop5: TopPick[] = [
  { order: 1, slug: "stack", why: "Needs only your documents, useful the day it exists, and the next dated windows (Dec 4, Jan 4, the county's Q1 2027 review) are weeks away. Every other tool reads from it. You have said the risk sits before the money; this is where it gets smaller." },
  { order: 2, slug: "draws", why: "Phase II broke ground Sept 10 and Burdick is next. Draws are monthly, so value starts the first month." },
  { order: 3, slug: "mwbe", why: "Built with the draw tracker because it reads the same pay applications, so it costs little more alongside and it protects a public promise you have already made." },
  { order: 4, slug: "dataroom", why: "Useful once 1 to 3 hold real records; built earlier it would be filled by hand. It is what the Community Foundation, the county and the next investor would see." },
  { order: 5, slug: "certs", why: "Matters most when homes fill but must be running before the first resident applies, so it finishes in the first half of 2027 ahead of Phase II lease-up in fall 2027. The resident portal follows it, since it needs the same rules." },
];

export const alsoRans = "The other five are real but come later or fold into these: the resident portal after certification, the hearing tracker as a small early addition to the funding calendar, the employer portal as a view inside the data room, the operations dashboard when more than a few buildings are open, and early learning reporting as a section of funder reporting.";
export const terms = "Terms are set together after the walkthrough.";

export const notVerified: string[] = [
  "Full 2026-2027 Qualified Allocation Plan text and MSHDA's own June 18, 2026 award release (both refused reading; scoring sheet and a published copy of the release were read).",
  "Which Kalamazoo-area census tracts are qualified census tracts or difficult development areas in 2026.",
  "Federal Home Loan Bank of Indianapolis 2027 round dates.",
  "The dollar threshold at which HUD's Section 3 benchmarks apply (the 25 and 5 percent benchmarks came from search results; the rule text was not opened).",
  "2027 nine percent round dates, rules of the emerging-developer set-aside, and the tie-breaking order between equal scores.",
  "HOME and CDBG amounts, New Markets terms, and CDFI terms other than the Community Foundation loan.",
  "County parcel records, council, planning and brownfield agendas, and LEHD data (not pulled).",
  "Whether Burdick's plan includes tax credits; whether $1.5 million is Lighthouse Ridge's final credit; whether Sunset Grove is the Dwelling Place project.",
  "Burdick's status after February 2026. No line here says construction has begun on it.",
];
