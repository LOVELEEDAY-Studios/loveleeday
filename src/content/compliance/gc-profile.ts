/* Global Citizens PCS — every PUBLIC figure here carries its source. Anything a
   school would only have internally (student records, staff files, surveys) is
   marked sample and is illustrative until their systems are connected. */

export const gcPublic = {
  ceiling: [
    { sy: "21–22", n: 100 },
    { sy: "22–23", n: 150 },
    { sy: "23–24", n: 200 },
    { sy: "24–25", n: 250 },
    { sy: "25–26", n: 300 },
    { sy: "26–27", n: 350 },
    { sy: "27–28", n: 400 },
  ],
  enrollment2425: 198,
  qsr: { enrolled: 190, swd: 29, eml: 13, asOf: "February 2025" },
  demographics: [
    { label: "Black", pct: 79 },
    { label: "Hispanic/Latino", pct: 9 },
    { label: "Multiracial", pct: 5 },
    { label: "White", pct: 4 },
    { label: "Asian", pct: 3 },
  ],
  revenueFY25: 6_110_494,
  expensesFY25: 5_469_064,
  revenueFY24: 5_041_625,
  assetsFY25: 3_047_425,
  upsff: { fy26: 15_070, fy27: 15_455 },
  building: { ward: "Ward 6 (SW)", classrooms: 12, occupancy: 400, renovation: "$3–4M", fullBuildout: "2027–28" },
  sources: [
    { label: "Charter agreement, enrollment ceilings (DC PCSB, 2021)", url: "https://dcpcsb.org/sites/default/files/media/file/2021-06-21%20Global%20Citizens%20Charter%20Agreement.pdf" },
    { label: "My School DC profile: 2024–25 enrollment and demographics", url: "https://www.myschooldc.org/schools/profile/464" },
    { label: "DC PCSB Qualitative Site Review, 2025", url: "https://dcpcsb.egnyte.com/dl/T36Y8yVyt8YY" },
    { label: "Facility amendment application (DC PCSB)", url: "https://dcpcsb.org/sites/default/files/media/file/Global%20Citizens%20PCS%20Facility%20Amendment%20Application%20and%20Supplemental%20Documents_0.pdf" },
    { label: "Form 990 figures, FYE June 2025 (Cause IQ, from IRS filings)", url: "https://www.causeiq.com/organizations/global-citizens-public-charter-school,843619772/" },
    { label: "UPSFF foundation level FY26", url: "https://mayor.dc.gov/release/mayor-bowser-announces-strategic-investments-districts-public-schools-including-27-increase" },
    { label: "UPSFF foundation level FY27", url: "https://communityaffairs.dc.gov/content/district%E2%80%99s-public-schools-continue-make-progress-achievement-enrollment-and-teacher" },
  ],
};

/* Sample: what the student and staff modules look like once the SIS and HR system
   are connected. Invented, anonymised, and labelled as such on every screen. */
export const gcSample = {
  attendanceTiers: [
    { label: "95%+", n: 118 },
    { label: "90–95%", n: 44 },
    { label: "80–90%", n: 24 },
    { label: "Under 80%", n: 12 },
  ],
  earlyWarning: [
    { id: "Student A", grade: "K", flag: "Attendance fell from 94% to 81% since October", action: "Family call scheduled" },
    { id: "Student B", grade: "2", flag: "Reading growth below target two terms running", action: "Refer to MTSS team" },
    { id: "Student C", grade: "PK4", flag: "Sibling not re-enrolled for next year", action: "Ask why before the lottery closes" },
    { id: "Student D", grade: "1", flag: "Three behaviour incidents in two weeks", action: "Counsellor check-in" },
  ],
  reEnrollment: [
    { label: "Returning", n: 164 },
    { label: "Undecided", n: 21 },
    { label: "Leaving", n: 13 },
  ],
  staffRoles: [
    { label: "Lead teachers", n: 16 },
    { label: "Mandarin / Spanish immersion", n: 9 },
    { label: "Special education", n: 4 },
    { label: "Assistants", n: 8 },
    { label: "Operations", n: 6 },
  ],
  retention: [
    { sy: "22–23", pct: 78 },
    { sy: "23–24", pct: 81 },
    { sy: "24–25", pct: 76 },
    { sy: "25–26", pct: 84 },
  ],
  survey: [
    { label: "I would recommend this school as a place to work", score: 4.1 },
    { label: "Workload is manageable", score: 2.9 },
    { label: "I get useful feedback on my teaching", score: 3.6 },
    { label: "I see a future for myself here", score: 3.8 },
    { label: "Leadership communicates clearly", score: 3.4 },
  ],
  familySatisfaction: 4.4,
};
