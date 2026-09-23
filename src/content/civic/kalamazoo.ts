import { TOKENS } from "@/content/tokens";

/* Kalamazoo County, prepared for Terrell Cole, Interim County Administrator/Controller.
   Every finding was read from a public source on 2026-09-13/14 or 2026-09-23 and is linked.
   Research files: ~/arthur/docs/civic/ (county findings 2026-09-13, county-2026-09/A–E).
   "verified" = read directly from the source. "ask" = the public record cannot settle it;
   it is framed as a question only the County can answer. */

const DC = (id: number | string) => `https://www.kalcounty.gov/DocumentCenter/View/${id}`;

export type Theme = "duties" | "money" | "records" | "services" | "access";
export interface Finding {
  theme: Theme;
  title: string;
  detail: string;
  status: "verified" | "ask";
  src: { label: string; url: string };
  catches: string; // which part of Arthur would have caught it
}

export const themes: Record<Theme, { name: string; line: string }> = {
  duties: { name: "Statutory duties", line: "Deadlines set by someone other than the County, checked against what it has published." },
  money: { name: "Money and federal funds", line: "The budget, the audit and the relief dollars with a clock on them." },
  records: { name: "The public record", line: "What a resident, a reporter or a new administrator can actually find." },
  services: { name: "Services and outcomes", line: "What the departments report, and where the reporting stops." },
  access: { name: "Access and security", line: "The website as a front door, under a federal deadline." },
};

export const findings: Finding[] = [
  // ── Statutory duties ──
  {
    theme: "duties",
    title: "The County master plan's five-year review fell due June 5, 2023. It is 1,206 days past that date.",
    detail:
      "The plan was adopted June 5, 2018 by the Kalamazoo Metropolitan County Planning Commission. MCL 125.3845(2) requires a review at least every five years, recorded in that commission's minutes. The commission does not appear on any of the County's three published board rosters, and no review is discoverable in any machine-readable County source. Whether minutes exist is a question the County can answer in minutes.",
    status: "ask",
    src: { label: "Master Plan 2018, Document Center 1249 · MCL 125.3845", url: DC(1249) },
    catches: "Statutory calendar",
  },
  {
    theme: "duties",
    title: "The state transparency package that County revenue sharing depends on was last published for 2022.",
    detail:
      "The Citizen's Guide, Performance Dashboard, Debt Service Report and Projected Budget Report are certified to the state each year. The only public instance is dated December 1, 2022, and the Citizen's Guide archive stops at 2020. Everything else in Finance is current, so this reads as a publishing step that dropped out of a working process, not as neglect.",
    status: "verified",
    src: { label: "Document Center 2005 · Archive Center, Citizens Guide", url: DC(2005) },
    catches: "Statutory calendar",
  },
  {
    theme: "duties",
    title: "The website's federal accessibility deadline is April 26, 2027, and the template fails today.",
    detail:
      "The Justice Department moved the ADA Title II web deadline for governments over 50,000 people from April 24, 2026 to April 26, 2027. Kalamazoo County, at about 263,800, is covered. An automated WCAG scan found critical and serious violations shared across both pages tested, including 90 unlabeled progress elements on the homepage, which points to the site template rather than individual pages.",
    status: "verified",
    src: { label: "Federal Register 2026-07663 (April 20, 2026)", url: "https://www.federalregister.gov/documents/2026/04/20/2026-07663/" },
    catches: "Statutory calendar",
  },
  {
    theme: "duties",
    title: "The FOIA procedures residents are pointed to are dated December 14, 2020.",
    detail:
      "The FOIA Procedures and Guidelines and the Written Public Summary are the documents the Act requires the County to publish. The live version is nearly six years old and is published twice under two ids, byte-identical.",
    status: "verified",
    src: { label: "Document Center 135 and 2072", url: DC(135) },
    catches: "Document lifecycle",
  },
  {
    theme: "duties",
    title: "The ADA grievance procedure carries no revision date and sends complaints to the old .com domain.",
    detail: "A dated re-issue pointing to kalcounty.gov is a same-day fix for a document with a legal purpose.",
    status: "verified",
    src: { label: "Document Center 2234", url: DC(2234) },
    catches: "Document lifecycle",
  },
  {
    theme: "duties",
    title: "No indigent defense compliance plan can be found on the County's own site.",
    detail:
      "The Michigan Indigent Defense Commission reports every funding unit as approved, so this is likely a publishing gap, not a compliance gap. A resident researching the County's constitutional duty from kalcounty.gov still finds nothing.",
    status: "ask",
    src: { label: "MIDC annual report 2025", url: "https://michiganidc.gov/" },
    catches: "Statutory calendar",
  },
  {
    theme: "duties",
    title: "The jail population management plan on file is a court order from the 2012 case series.",
    detail:
      "Michigan's county jail overcrowding statute expects a current plan. The published order is the only one the County's site returns.",
    status: "ask",
    src: { label: "LAO 2012-01J, Document Center 1368", url: DC(1368) },
    catches: "Statutory calendar",
  },
  {
    theme: "duties",
    title: "One of six bargaining units has worked nine months past its contract's end date.",
    detail:
      "Five units publish 2025–2027 agreements. The Sheriff's Supervisors' agreement ran January 1, 2020 through December 31, 2025; the only document since is a narrow letter of agreement approved March 20, 2026 that does not extend the term. A successor may exist unpublished.",
    status: "ask",
    src: { label: "Document Center 5646 and 5210", url: DC(5646) },
    catches: "Statutory calendar",
  },
  {
    theme: "duties",
    title: "The law enforcement millage expires with the 2027 levy.",
    detail:
      "It is 1.4296 mills, 17.9% of the County's direct tax rate, about $13.6 million a year for the Sheriff, Prosecutor and courts. A renewal needs ballot language, a board resolution and an election date well before then.",
    status: "verified",
    src: { label: "FY2025 ACFR, Table 6 (Archive Center item 410)", url: "https://www.kalcounty.gov/ArchiveCenter/ViewFile/Item/410" },
    catches: "Statutory calendar",
  },

  // ── Money and federal funds ──
  {
    theme: "money",
    title: "The audit's one material weakness repeats, and it is in the COVID relief grant's accounting.",
    detail:
      "Finding 2025-001, a repeat of 2024-001: material audit adjustments were needed to record federal revenue and unearned revenue for the Coronavirus State and Local Fiscal Recovery Funds, and special assessments in the drainage districts. The opinion is clean. The finding sits on the same grant that has a federal spending deadline in 99 days.",
    status: "verified",
    src: { label: "FY2025 ACFR and Single Audit, p. 245 (Archive Center item 410)", url: "https://www.kalcounty.gov/ArchiveCenter/ViewFile/Item/410" },
    catches: "Grant and deadline tracker",
  },
  {
    theme: "money",
    title: "A $1,000,000 gun violence intervention project has been reported “not started” three years running.",
    detail:
      "The County's 2023, 2024 and 2025 Recovery Plan reports use the same sentence: “This project has not started.” Relief funds must be spent by December 31, 2026. Either the project moved and the report did not, or the money is at risk.",
    status: "verified",
    src: { label: "Recovery Plan reports, Document Center 5211–5213", url: DC(5213) },
    catches: "Grant and deadline tracker",
  },
  {
    theme: "money",
    title: "The County's own budget links serve a picture instead of the budget.",
    detail:
      "The FY2026 Recommended Budget and the FY2026 Adopted Budget both return an unrelated News Flash image. The adopted budget, about $325 million across all funds, can only be read through the hosted budget book.",
    status: "verified",
    src: { label: "Document Center 5406 and 5606", url: DC(5606) },
    catches: "Document lifecycle",
  },
  {
    theme: "money",
    title: "A $45 million bond for an indoor sports facility went to a public hearing in April. Its status is not public.",
    detail:
      "A hearing was set for April 7, 2026 on tax-exempt bonds not to exceed $45,000,000 for a 150,000 square foot facility on N. Drake Road, County-owned and leased to the Event Center Assessment District Authority. Whether they were issued, and on what terms, is not in any public document.",
    status: "ask",
    src: { label: "Notice of public hearing, Document Center 6409", url: DC(6409) },
    catches: "Board memory",
  },

  // ── The public record ──
  {
    theme: "records",
    title: "Three accommodation tax ordinances are live. The oldest is titled as though it is the only one.",
    detail:
      "Document 2131, titled simply “Accommodations Tax Ordinance”, is the 1974 ordinance as amended through 2002, and it is a scan no search can read. The current text is 3956, updated January 2025. The operative terms match, so no money is at risk; the fix is a title.",
    status: "verified",
    src: { label: "Document Center 2131, 4116, 3956", url: DC(3956) },
    catches: "Document lifecycle",
  },
  {
    theme: "records",
    title: "An expired parks plan is published as “Master Plan PDF”.",
    detail:
      "Document 1670 is the 2016–2020 parks plan under a title with no year or subject. It comes back alongside the 2018 County master plan and the current 2025–2029 parks plan with nothing to rank them.",
    status: "verified",
    src: { label: "Document Center 1670, 1264", url: DC(1670) },
    catches: "Document lifecycle",
  },
  {
    theme: "records",
    title: "Two personnel policy manuals share one title. Only the PDFs' insides say which is current.",
    detail: "Document 1038 is dated February 21, 2025 and linked from the navigation. Document 1055 is dated August 7, 2024, orphaned, and still live under the same name.",
    status: "verified",
    src: { label: "Document Center 1038 and 1055", url: DC(1038) },
    catches: "Document lifecycle",
  },
  {
    theme: "records",
    title: "A document titled “2021 Rules of Procedure” is not the Board's. Our own research misread it.",
    detail:
      "Document 2571 is a copier scan with no text layer. Its first page, once read, is the Apportionment Commission's rules. The Board's rulebook is filed as “2025 Bylaws” (approved January 7, 2025), and a 2026 rewrite has been on Committee of the Whole agendas since August. One of our own research passes took 2571 for the Board's rules before the text was recovered. A new commissioner or a reporter would do the same.",
    status: "verified",
    src: { label: "Document Center 2571 and 3982", url: DC(3982) },
    catches: "Document lifecycle",
  },
  {
    theme: "records",
    title: "The 138-page Sanitary Code regulates septic systems and body art, and an ordinance search cannot find it.",
    detail: "Its title never uses the word “ordinance”, so anyone following the County's own naming misses a binding regulation.",
    status: "verified",
    src: { label: "Document Center 840", url: DC(840) },
    catches: "Document lifecycle",
  },
  {
    theme: "records",
    title: "One in five Document Center PDFs cannot be searched or read aloud.",
    detail: "17 of a random 81 have no text layer, confirmed image-only. They are invisible to site search and to screen readers, which also matters for the April 2027 deadline.",
    status: "verified",
    src: { label: "Sample of 81 Document Center PDFs, September 23, 2026", url: "https://www.kalcounty.gov/DocumentCenter" },
    catches: "Document lifecycle",
  },
  {
    theme: "records",
    title: "The site's Agenda Center is empty for the Board. The real minutes live somewhere the navigation does not point.",
    detail:
      "kalcounty.gov/AgendaCenter returns “Loading” for every category and its feed publishes zero items. Board agendas, minutes and votes are in a separate CivicClerk portal, reached only through the “Meeting Dates, Agendas & Minutes” page. It has a public data interface, which is how every vote on this page was read.",
    status: "verified",
    src: { label: "Kalamazoo County CivicClerk portal", url: "https://kalamazoocomi.portal.civicclerk.com/" },
    catches: "Board memory",
  },
  {
    theme: "records",
    title: "The vote-of-record system holds a second, different copy of the interim appointment vote.",
    detail:
      "At the July 7 meeting the appointment motion is recorded 6–3. The same motion is recorded a second time, as 9–0 with every commissioner voting yes, attached to an unrelated item: the summer gun violence prevention funding request. It is almost certainly a data-entry slip, and it is the official record anyone querying the system will find.",
    status: "verified",
    src: { label: "CivicClerk meeting 2381, July 7, 2026", url: "https://kalamazoocomi.portal.civicclerk.com/event/2381" },
    catches: "Board memory",
  },
  {
    theme: "records",
    title: "The RFP evaluation policy sits behind a sign-in wall.",
    detail: "Revised Policy 13, linked from the public Government page, redirects to a CivicPlus login instead of the PDF. Vendors cannot read how they will be scored.",
    status: "verified",
    src: { label: "Document Center 6293", url: DC(6293) },
    catches: "Document lifecycle",
  },
  {
    theme: "records",
    title: "The master plan's own website no longer exists.",
    detail: "The plan's cover prints kalcountymasterplan.org. The domain returns no DNS record at all.",
    status: "verified",
    src: { label: "Master Plan 2018 cover", url: DC(1249) },
    catches: "Document lifecycle",
  },
  {
    theme: "records",
    title: "The only published GIS strategy is from 2008.",
    detail:
      "The parcel viewer has clearly moved past it. The plan recommended a GIS steering committee; no such body appears on the rosters.",
    status: "ask",
    src: { label: "Document Center 1251", url: DC(1251) },
    catches: "Document lifecycle",
  },
  {
    theme: "records",
    title: "The Land Bank has not published an annual report for 2024 or 2025.",
    detail: "Its board, chaired by the County Treasurer, also moved from monthly to every-other-month meetings for 2026.",
    status: "ask",
    src: { label: "Kalamazoo County Land Bank", url: "https://kalamazoolandbank.org/" },
    catches: "Performance view",
  },

  // ── Services and outcomes ──
  {
    theme: "services",
    title: "The Sheriff's Office publishes no annual report or performance data.",
    detail:
      "Across the Document Center index and the Sheriff's pages, no annual report appears. It is the one department-level gap in an otherwise well-documented County.",
    status: "verified",
    src: { label: "Document Center index, 4,383 entries", url: "https://www.kalcounty.gov/DocumentCenter" },
    catches: "Performance view",
  },
  {
    theme: "services",
    title: "The 911 dispatch authority is carrying a 23% dispatcher vacancy, and its millage ends in 2029.",
    detail: "From KCCDA's own January 2026 board packet.",
    status: "verified",
    src: { label: "KCCDA board packet, January 8, 2026", url: "https://kccda911.org/wp-content/uploads/2026/01/KCCDA-Board-Mtg-Packet-01.08.26.pdf" },
    catches: "Performance view",
  },
  {
    theme: "services",
    title: "The courts are 2.81 judges short by the state's own measure, and timeliness is slipping where that predicts.",
    detail: "The State Court Administrative Office puts Kalamazoo at 119% of judicial workload. Felony, appeals and child-protective timeliness declined from 2023 to 2025 in the County's own annual report.",
    status: "verified",
    src: { label: "SCAO Judicial Resources Recommendations 2025", url: "https://www.courts.michigan.gov/4afb74/siteassets/reports/judicial-resources/jrr_2025_final.pdf" },
    catches: "Performance view",
  },
  {
    theme: "services",
    title: "The housing millage has funded 1,492 units against a 5,497-unit shortage, and homelessness rose 19% last count.",
    detail: "The Housing Director's own framing: a good start, not enough. The 2025 point-in-time count rose 19% year over year.",
    status: "verified",
    src: { label: "2025 Point-in-Time and Housing Inventory Count", url: "https://kzoococ.org/wp-content/uploads/2025/07/Kalamazoo-County-2025-PIT-and-HIC-results.pdf" },
    catches: "Performance view",
  },
  {
    theme: "services",
    title: "The senior millage is oversubscribed in two programs and barely used in two others.",
    detail: "Transportation and Healthy Living run over 150% of their allocation; Veteran Supports and Hearing Aids under 20%, inside a stream that is secure through 2029.",
    status: "verified",
    src: { label: "Kalamazoo County Senior Millage", url: "https://www.kalcounty.gov/247/Kalamazoo-County-Senior-Millage" },
    catches: "Performance view",
  },
  {
    theme: "services",
    title: "One in five drug deaths in 2024 was a person recently released from incarceration.",
    detail: "From the Medical Examiner's 2024 annual report. It is a quantified case for jail-based overdose prevention, and it sits in a PDF no one connects to the jail's budget.",
    status: "verified",
    src: { label: "2024 Medical Examiner Annual Report, Document Center 5387", url: DC(5387) },
    catches: "Performance view",
  },
  {
    theme: "services",
    title: "Animal Services still euthanizes 35–41% of intake, funded by dog licence revenue that has fallen every year since 2021.",
    detail: "2025 improved on prior years; the funding source underneath it keeps shrinking.",
    status: "verified",
    src: { label: "Health & Community Services 2024 annual report appendix, Document Center 5675", url: DC(5675) },
    catches: "Performance view",
  },
  {
    theme: "services",
    title: "The County is getting older faster than it is growing.",
    detail: "The 65-and-over share rose 3.8 points in twelve years, and real income gains are about a quarter of what the nominal figures suggest. Both press on the senior, health and transportation budgets at once.",
    status: "verified",
    src: { label: "US Census Bureau, ACS 2012–2024, FIPS 26077", url: "https://data.census.gov/profile/Kalamazoo_County,_Michigan?g=050XX00US26077" },
    catches: "Performance view",
  },

  // ── Access and security ──
  {
    theme: "access",
    title: "Anyone can send email that claims to be from kalcounty.gov.",
    detail:
      "The domain's DMARC policy is p=none with no reporting address, so spoofed County mail is neither blocked nor logged. The County already pays for phishing training for staff; this is the technical half of the same control.",
    status: "verified",
    src: { label: "DNS TXT _dmarc.kalcounty.gov, September 23, 2026", url: "https://www.kalcounty.gov/" },
    catches: "Security review",
  },
  {
    theme: "access",
    title: "Kent, Washtenaw and Ottawa publish live budget tools or open data. Kalamazoo publishes PDF links.",
    detail: "Three of four peer counties give residents an interactive budget, a performance dashboard or a downloadable data catalog. Washtenaw publishes a Sheriff data dashboard.",
    status: "verified",
    src: { label: "Kent County Data Dashboards", url: "https://www.kentcountymi.gov/977/Data-Dashboards" },
    catches: "Performance view",
  },
  {
    theme: "access",
    title: "The Housing & Nuisance Complaints link on the health department page goes nowhere.",
    detail: "It opens the site's error page. 2 of 150 sampled links were broken, and both were on service paths that matter: this complaint form and the procurement policy above.",
    status: "verified",
    src: { label: "Health & Community Services page, September 23, 2026", url: "https://www.kalcounty.gov/236/Health-Community-Services" },
    catches: "Document lifecycle",
  },
];

/* What is already strong. Leading with it is accuracy, not flattery. */
export const strengths = [
  { k: "7 days", label: "The FY2025 audit was filed ahead of the state's six-month deadline", src: "Archive Center item 410" },
  { k: "AA+ / Aa3", label: "General obligation rating, with debt under 8% of the legal limit", src: "FY2025 ACFR, p. 31" },
  { k: "114.7%", label: "Pension funded ratio on the County's own assumptions", src: "Form 5572, Archive Center item 411" },
  { k: "4,383", label: "Public documents Arthur indexed and read, so nothing here is a sample of one", src: "kalcounty.gov Document Center" },
];

/* The parts of Arthur, each named by the findings it would have caught. */
export const layers = [
  {
    name: "Statutory calendar",
    does: "Every recurring duty Michigan and federal law puts on the County, with its statute, due date, owner and the published proof it was done.",
    would: "The master plan review, the transparency package, the millage renewal, the accessibility deadline.",
  },
  {
    name: "Grant and deadline tracker",
    does: "Each federal and state award, what is obligated, spent and reported, against its clock. Reports are drafted from the ledger, not copied from last year.",
    would: "The relief project reported as not started three years running, and the audit finding on the same grant.",
  },
  {
    name: "Document lifecycle",
    does: "One current version of every policy and ordinance, dated titles, superseded versions retired, scans made searchable, broken links found before a resident does.",
    would: "The three tax ordinances, two personnel manuals, the budget PDFs that serve an image, the locked RFP policy.",
  },
  {
    name: "Board memory",
    does: "Every agenda, minute and vote readable and searchable, so a question like “when did the Board last take this up” has an answer with a link.",
    would: "The minutes no machine can read, the bond with no public status.",
  },
  {
    name: "Performance view",
    does: "The numbers each department already produces, in one place, with the gaps marked, and the state dashboard published from it.",
    would: "The Sheriff's missing report, dispatch vacancy, court workload, housing and senior millage results.",
  },
  {
    name: "Ask the County",
    does: "Staff and, when the County chooses, residents ask in plain words and get answers with the source attached. Arthur says when the record cannot answer.",
    would: "Every question on this page, answered from the County's own documents.",
  },
];

/* The Board already asked for this. Quoted from its own plan, so the proposal is a
   continuation, not a new idea. */
export const mandate = {
  quote: "Enhance Operational Efficiency through Design, SOPs and Automation",
  source: "Strategic Plan FY2024–FY2029, Goal 7",
  url: DC(2873),
};

export const civicClients = [
  {
    token: TOKENS.kalcounty,
    short: "Kalamazoo County",
    preparedFor: "Terrell Cole",
    role: "Interim County Administrator/Controller",
  },
].filter((c): c is typeof c & { token: string } => Boolean(c.token));

export const getCivic = (token: string) => civicClients.find((c) => c.token === token);
