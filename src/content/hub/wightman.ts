import { TOKENS } from "@/content/tokens";
/* Wightman (employee-owned AEC firm, 1946; Kalamazoo office at 433 W. Ransom). Prepared for Phil Doorlag after
   he met Daniel at Dabney on September 25, 2026 about the Kalamazoo Avenue water line work. Dabney sits on
   Rose Street inside Wightman's Streets for All work zone, so the page speaks as a neighbor, not a cold vendor.
   Local only, not deployed. Every finding was read September 25, 2026 and names its source. Arthur claims
   follow the capability spec: nothing at Wightman is connected, so everything below is proposed, not running. */

export const wightmanClients = TOKENS.wightman ? [{ token: TOKENS.wightman, short: "Wightman", preparedFor: "Phil Doorlag", role: "Regional Director, Kalamazoo" }] : [];
export const getWightman = (token: string) => wightmanClients.find((c) => c.token === token);

export const strengths = [
  { k: "80 years", label: "Founded 1946 and still wholly owned by its employees, with new owners named every spring.", src: "Wightman Story; 2026 ownership release" },
  { k: "200+", label: "Professionals across architecture, civil, survey, GIS, interiors and reality capture, in 12 locations.", src: "gowightman.com" },
  { k: "$19.6M", label: "Kalamazoo Avenue conversion under way since July 20, with Wightman as the City's owner's representative.", src: "WWMT; WMUK" },
  { k: "3 awards", label: "ACEC/Michigan 2026 merit awards, including KRESA Career Connect and Whites Road for Kalamazoo.", src: "Wightman press release" },
];

export type Theme = "ai" | "contracts" | "front" | "downtown";
export const themes: Record<Theme, { name: string; line: string }> = {
  ai: { name: "AI at Wightman", line: "Where the industry is, and where Wightman is." },
  contracts: { name: "Contract knowledge", line: "What lives in one person's head today." },
  downtown: { name: "The downtown program", line: "Streets for All, seen from a business on Rose Street." },
  front: { name: "The front door", line: "What a client or recruit sees on gowightman.com." },
};
export const ORDER: Theme[] = ["ai", "contracts", "downtown", "front"];

type Src = { label: string; url: string };
export type Finding = { theme: Theme; title: string; detail: string; src: Src };

export const findings: Finding[] = [
  { theme: "ai", title: "AEC firms are adopting AI faster than they can govern it: adoption went from 53% to 70% in a year, and 5% call themselves fully developed.", detail: "In Deltek's 2025 Clarity study of 896 architecture and engineering firms, 90% use or plan to use AI in at least one function, but only 38% report a measurable benefit and 45% are unclear on the return.", src: { label: "Deltek Clarity A&E Industry Study", url: "https://www.deltek.com/company/news/latest-deltek-clarity-industry-studies-highlight-ai-challenges/" } },
  { theme: "ai", title: "69% of AEC technology leaders say unclear AI rules are affecting their plans, and 42% name data security as the barrier.", detail: "Bluebeam's 2025 survey of more than 1,000 decision-makers. Of the firms already using AI, 68% saved at least $50,000.", src: { label: "Bluebeam AEC Technology Report, Oct 2025", url: "https://press.bluebeam.com/2025/10/new-bluebeam-report-shows-early-ai-adopters-in-aec-seeing-significant-roi-despite-uneven-adoption/" } },
  { theme: "ai", title: "Wightman has no public AI policy, program or AI role, and neither do its Michigan peers.", detail: "A search of gowightman.com, its press releases and job pages found no mention of AI. Among Prein & Newhof, Fishbeck and Abonmarche, only Fishbeck mentions AI, for drone-based pavement defect detection. The first firm in this region with a clear, governed program will be alone in that position.", src: { label: "gowightman.com and peer sites, Sept 25, 2026", url: "https://gowightman.com/" } },
  { theme: "ai", title: "What Phil described matches the surveys: people don't know which platforms to use, have no real use cases, and have no policy telling them what is allowed.", detail: "That gap is why the numbers above stall at \"piloting.\" Tools are easy to buy. The missing pieces are a short approved list, examples by role, and rules on which project and client data may go where.", src: { label: "Conversation with Phil Doorlag at Dabney, Sept 25, 2026", url: "" } },
  { theme: "contracts", title: "The contract history for one client already spans several separate agreements, and the details live in Phil's head.", detail: "For Kalamazoo Avenue alone, the City Commission approved a $2,139,900 construction-engineering contract with Wightman beside a $16.8 million MDOT agreement. Earlier design work and the next Streets for All segments are separate awards. Every rate, amendment, not-to-exceed and deliverable date is something someone has to remember.", src: { label: "WWMT, Kalamazoo Avenue contracts", url: "https://wwmt.com/news/local/kalamazoo-avenue-two-way-conversion-project-downtown-construction-traffic-planning-commission-contracts-meeting-infrastructure-west-michigan-wwmt" } },
  { theme: "contracts", title: "Procore runs the field work: 3 users on 6 active projects from the Kalamazoo office, at an average project value near $23.9 million.", detail: "Procore handles project collaboration, not the firm's contract memory. There is no public sign of a contract system above it, so terms, amendments and task orders most likely sit in files, email and people's heads.", src: { label: "Procore Construction Network profile, Wightman Kalamazoo", url: "https://network.procore.com/p/wightman-and-associates-inc-kalamazoo" } },
  { theme: "contracts", title: "Phil carries a regional director's load, a board seat, and two civic roles.", detail: "Secretary of the Board (2023 announcement), Vice Chair of Kalamazoo's Complete Streets Advisory Committee, and Chair of the Oshtemo Township Planning Commission. When one person is the index for every contract, that person becomes the bottleneck and the risk.", src: { label: "Wightman staff bio and 2023 leadership release", url: "https://gowightman.com/staff/phillip-doorlag" } },
  { theme: "downtown", title: "Rose Street is live in the work zone: the City's page planned to pave part of the Rose intersection on September 19 and shift traffic to one lane each way.", detail: "The Kalamazoo Avenue work replaces the water main and service lines along with sewer, electric, lighting and signals, one block at a time from Westnedge toward Pitcher. Dabney sits at 344 North Rose.", src: { label: "City of Kalamazoo, Streets for All: Kalamazoo Ave", url: "https://www.kalamazoocity.org/Community/Projects/Streets-for-All/Streets-for-All-Kalamazoo-Ave-2026-2027" } },
  { theme: "downtown", title: "Businesses on the corridor plan staffing and events around dates they mostly hear about secondhand.", detail: "Dabney's Saturdays are down 41% year over year this summer, the same summer the Rose crossings closed some weeks; our own data can't separate the two. A dated, block-by-block update written for owners would be worth a great deal to every business on the route, and it builds goodwill for the program.", src: { label: "Dabney & Co. Toast sales, June 26 – Sept 24, 2025 and 2026", url: "" } },
  { theme: "front", title: "The site's voice is warm and human, and employee ownership is up front where it belongs.", detail: "\"Analyzing is all about people,\" six named values, and a benefits page more specific than most in the industry: a dollar-for-dollar 401(k) match on the first 3% with immediate vesting, 15 PTO days, tuition reimbursement.", src: { label: "gowightman.com, Values and Benefits", url: "https://gowightman.com/about/values" } },
  { theme: "front", title: "The Current Job Openings page lists no openings; the real listings sit in a separate search tool.", detail: "A recruit on a phone, or a search engine, lands on an empty section. Job postings are some of the highest-intent traffic a firm gets.", src: { label: "gowightman.com/careers", url: "https://gowightman.com/careers/search-apply" } },
  { theme: "front", title: "The site says 12 locations while the About page names 10, and nothing explains how employee ownership works.", detail: "One page with the current offices, headcount, years and ownership mechanics would answer what a senior hire or a municipal client checks first.", src: { label: "gowightman.com, Wightman Story", url: "https://gowightman.com/about/wightman-story" } },
];

export const layers = [
  { name: "Contract memory", does: "Every contract, task order, amendment and change order read once and kept searchable. Ask \"what's our not-to-exceed on the Kalamazoo Avenue construction-engineering contract, and what's left?\" and get the answer with the page it came from.", would: "Terms and dates that live only in Phil's head." },
  { name: "An AI policy people can follow", does: "A one-page policy written with Wightman's leadership: which tools are approved, which data may never leave, who approves what. Short enough to read, specific enough to use.", would: "Staff unsure what they're allowed to use, and client data pasted into whatever is open." },
  { name: "Use cases by role", does: "A short list for each role, from engineers and surveyors to PMs, marketing and admin, with worked examples on Wightman's own documents: proposal first drafts, meeting minutes to action items, spec checks, RFI summaries.", would: "\"We don't have real use cases.\"" },
  { name: "Corridor updates for businesses", does: "The Streets for All schedule turned into a dated, block-by-block update for the businesses on the route, drafted weekly for the City and Wightman to approve before it goes out.", would: "Owners planning around closures they heard about secondhand." },
  { name: "Proposal and qualifications engine", does: "Past projects, staff bios, awards and references kept current, so an RFQ response starts from a complete first draft with every claim sourced.", would: "Rebuilding the same qualifications package from scratch for each municipal RFQ." },
  { name: "Guardrails built in", does: "Arthur prepares and a person approves. Anything that sends, spends or makes a legal commitment waits for a human, and every answer shows its source.", would: "AI that nobody can audit." },
];

export const nextQuestions = [
  { q: "Which task orders on the City of Kalamazoo contracts are above 80% of their not-to-exceed?", joins: "Contracts, amendments and invoices" },
  { q: "What did we commit to in writing about restoration and access on the Kalamazoo Avenue blocks?", joins: "Contract documents, meeting minutes and correspondence" },
  { q: "Which contract renewals and deliverable dates land in the next 90 days, across every office?", joins: "Contracts and project schedules" },
  { q: "Which of our past projects best answer this RFQ's scoring criteria, with references?", joins: "Project records, awards and staff bios" },
  { q: "Which staff are using which AI tools today, and on what data?", joins: "A short survey plus the new policy" },
  { q: "Which businesses on the corridor are affected by next week's closures, and have they been told?", joins: "The Streets for All schedule and a business contact list" },
];

export const proof = [
  { k: "Books", d: "Every bank line categorised and reconciled, with the evidence for each." },
  { k: "Events", d: "Inquiries answered, quotes built, deposits and follow-ups tracked for every private event." },
  { k: "Documents", d: "Licenses, leases and compliance files read once and searchable, with the source page for every answer." },
  { k: "Guardrails", d: "Nothing sends, spends or signs without a person approving it." },
];

export const steps: [string, string][] = [
  ["A working session at Dabney", "Two hours with Phil and the people he picks: where AI is used today, what worries leadership, and ten use cases worth trying. Dabney hosts, on Rose Street, inside the project you're building."],
  ["An AI policy in two weeks", "A one-page policy and an approved-tools list drafted from that session, for Wightman's leadership to edit and adopt."],
  ["A contract-memory pilot", "One office, one client: the Kalamazoo office's City of Kalamazoo contracts, read and made searchable, with Phil asking it real questions for 30 days."],
  ["Decide on evidence", "After 30 days, keep what saved time, drop what didn't, and decide together whether to extend it firm-wide."],
];

export const security = [
  { t: "Wightman's data stays Wightman's", d: "Contracts and project files sit in an environment for Wightman alone, never mixed with another client's, and nothing is used to train a model." },
  { t: "People approve, Arthur prepares", d: "Drafts, summaries and answers come with their source. Anything that goes to a client, spends money or makes a commitment waits for a person." },
  { t: "Every answer is traceable", d: "A figure without a source isn't reported. Each answer links back to the page and document it came from." },
  { t: "Policy first, tools second", d: "The policy decides which tools and which data. The pilot runs inside it." },
];

export const method = [
  "Firm facts come from gowightman.com (Wightman Story, Values, Benefits, staff bios, press releases) read September 25, 2026. Headcount is Wightman's own \"more than 200\"; third-party bands vary and are not used.",
  "Kalamazoo Avenue figures come from WWMT, WMUK, Public Media Network and the City of Kalamazoo project pages. Figures in conflict between sources, such as the design-phase contract amounts, are left out.",
  "Industry figures are quoted as published by Deltek (Clarity A&E study) and Bluebeam (AEC Technology Report, Oct 2025).",
  "Peer AI posture comes from each firm's public site. OHM Advisors and Spicer Group could not be checked conclusively and are not characterized.",
  "Arthur is not connected to any Wightman system. Everything under \"What Arthur would do\" is proposed, and the pilot is how it would be proven.",
];
