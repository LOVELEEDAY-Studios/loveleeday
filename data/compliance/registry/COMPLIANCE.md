# How LOVELEEDAY becomes compliant

Generated 2026-09-23 from `registry.json` by `scripts/render-compliance-guide.py`. 190 requirements, 156 verified against the official source. Every line traces to a `source_url` in the registry. This is a research register, not legal advice. Confirm with counsel before relying on it for a contract or bid.

## By industry

### Schools and education

#### COPPA — school-authorized consent in place of parental consent for ed-tech vendors (15 U.S.C. 6501-6506; 16 CFR Part 312 (COPPA Rule), 16 CFR 312.5), verified
- **Applies when:** The product collects personal information (as defined in 16 CFR 312.2) directly from a child under 13, and a school is authorizing that collection for a school-authorized educational purpose
- **Staying out of scope:** The product is used only by staff/adults, only by students 13 and older, or LOVELEEDAY never collects personal information directly from the child (e.g., only aggregate or de-identified analytics)
- **What a buyer will ask for:** A signed notice/agreement to the school describing the operator's data practices (satisfies the FTC's school-consent framework); often bundled into the same SDPC NDPA used for FERPA
- **Effort:** medium — requires giving schools COPPA notice before collection and building technical/contractual controls that block any commercial use of children's data.
- **How we comply:**
  1. Confirm the product's user base and whether it collects personal information directly from children under 13
  2. If school-authorized consent will be relied on, give the school COPPA-required notice of data practices before any collection begins
  3. Contractually commit to use children's data solely for the school-authorized educational purpose, with no commercial/marketing use
  4. Build data-minimization, security, and school-initiated deletion capability into the product
- Source: https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-312/section-312.5

#### FERPA — "school official" exception letting a vendor handle education records without consent (20 U.S.C. 1232g; 34 CFR 99.31(a)(1)(i)(B), 99.31(a)(1)(ii), 99.33(a)), verified
- **Applies when:** LOVELEEDAY stores, processes, or otherwise has access to K-12 or higher-ed student education records on behalf of a school or LEA client
- **Staying out of scope:** LOVELEEDAY provides infrastructure only (e.g., encrypted storage it cannot itself decrypt) with no access to identifiable student records, or the school never discloses education records to LOVELEEDAY at all
- **What a buyer will ask for:** A signed data-privacy agreement/contract addendum containing the 34 CFR 99.31(a)(1)(i)(B) school-official language (often satisfied by signing the SDPC National Data Privacy Agreement — see us-sdpc-ndpa)
- **Effort:** low — the compliance mechanism is a contract clause (school-official designation + redisclosure limits), not a technical build; effort rises to medium if LOVELEEDAY must also build deletion/return-of-records workflows to match contract terms.
- **How we comply:**
  1. Include a 'school official' designation clause in every school/LEA contract or data-privacy agreement, citing 34 CFR 99.31(a)(1)(i)(B) and naming the specific institutional service performed
  2. Contractually accept the school's direct control over use/maintenance of the records and agree not to redisclose PII without consent per 34 CFR 99.33(a)
  3. Limit LOVELEEDAY staff access to education records to those with a legitimate need tied to the contracted service
  4. Return or destroy education records at contract end per the school's own retention terms (FERPA sets no fixed number of days)
- Source: https://www.ecfr.gov/current/title-34/subtitle-A/part-99/subpart-D/section-99.31

#### Protection of Pupil Rights Amendment (PPRA) (20 U.S.C. 1232h; 34 CFR Part 98), verified
- **Applies when:** LOVELEEDAY's product administers or processes a survey/analysis/evaluation funded by an ED program that touches one of PPRA's eight protected areas, or the product is used to market to students/families using LEA-sourced data
- **Staying out of scope:** The product does not administer surveys touching the eight protected areas and is never used for marketing purposes
- **What a buyer will ask for:** No federal PPRA attestation form; LEAs typically add a PPRA-compliance representation/contract clause covering surveys and marketing use, often folded into the SDPC NDPA
- **Effort:** low — mainly a contractual pass-through of the LEA's own notice/consent duties; no PPRA-specific technical build unless the product itself runs covered surveys.
- **How we comply:**
  1. Identify whether the product administers surveys/assessments that could touch PPRA's eight protected areas
  2. Build in a flag/workflow so the LEA can issue the required parental notice and consent/opt-out before a covered survey is administered
  3. Contractually commit not to use LEA-sourced student data for marketing without the LEA's PPRA-compliant parental notice/opt-out process
- Source: https://studentprivacy.ed.gov/topic/protection-pupil-rights-amendment-ppra

#### Student Data Privacy Consortium (SDPC) National Data Privacy Agreement (NDPA) — vendor signatory process (SDPC National Data Privacy Agreement (NDPA), current version (v2.x), Student Data Privacy Consortium / A4L Community), verified
- **Applies when:** A school district or state alliance customer requires student-data-privacy contract terms and uses (or will accept) the SDPC NDPA framework
- **Staying out of scope:** The district insists on its own custom DPA instead of the NDPA, or LOVELEEDAY has no K-12 district-level customers
- **What a buyer will ask for:** Signed NDPA + Exhibit E on the SDPC Resource Registry; results in the SDPC Vendor Signatory Badge buyers look for
- **Effort:** low — signing a pre-negotiated template is materially faster than one-off district contract negotiation; 'no additional work requirements for vendors outside of their normal contracting processes' per SDPC's own guidance.
- **How we comply:**
  1. Contact a state Alliance (or the district directly) using the SDPC's standard NDPA template rather than drafting a bespoke agreement
  2. Sign the NDPA core agreement and Exhibit E (General Offer of Privacy Terms)
  3. Confirm the signed agreement is posted to the SDPC Resource Registry and claim the SDPC Vendor Signatory Badge
- Source: https://privacy.a4l.org/national-dpa/


### Local government

#### FBI CJIS Security Policy — CJIS Security Addendum (CJIS Security Policy (CJISD-ITS-DOC-08140), Appendix H — Security Addendum; 28 CFR 20.33), verified
- **Applies when:** LOVELEEDAY software stores, processes, or transmits Criminal Justice Information for a police department, sheriff, court, or other criminal-justice-agency client
- **Staying out of scope:** The client is a general local-government department (finance, parks, permitting) with no criminal-justice data, or LOVELEEDAY only receives de-identified/aggregate statistics
- **What a buyer will ask for:** Signed CJIS Security Addendum (Appendix H) plus completed fingerprint-based background checks for in-scope personnel
- **Effort:** high — requires the criminal justice agency to sponsor the addendum, background-check every in-scope employee, and build to CJIS technical controls (FIPS-validated encryption, advanced authentication); not a self-service certification
- **How we comply:**
  1. Determine whether any LOVELEEDAY product/contract will store, process, or transmit CJI (criminal history, biometric, or justice-system case data) for a law-enforcement or criminal-justice-agency client
  2. If yes, have the contracting criminal justice agency execute the CJIS Security Addendum with LOVELEEDAY as the private contractor
  3. Submit each LOVELEEDAY employee/contractor who will access CJI for a state/national fingerprint-based background check via the contracting agency
  4. Implement CJIS Security Policy technical controls (encryption, advanced authentication, audit logging, incident response) on the systems that touch CJI
- Source: https://le.fbi.gov/cjis-division/cjis-security-policy-resource-center/appendicies/security-addendum.pdf

#### 2 CFR Part 200 (Uniform Guidance) — obligations that flow down to contractors of federally funded grantees (2 CFR Part 200, Subpart D; specifically 200.318(b), 200.331, 200.334, 200.337), verified
- **Applies when:** LOVELEEDAY is under contract to a nonprofit or local-government client that is a recipient or subrecipient of federal grant funds, and LOVELEEDAY's services are paid for in whole or part from that federal award
- **Staying out of scope:** LOVELEEDAY is paid from the client's unrestricted/non-federal funds, or the relationship is structured (correctly, per 200.331(b)) as a standard commercial contractor arrangement rather than a subrecipient relationship
- **What a buyer will ask for:** No federal attestation form for a 'contractor' (as distinct from a 'subrecipient'); the procurement contract/purchase order itself, plus any required Appendix II flow-down clauses, is the instrument
- **Effort:** low for a normal contractor relationship (records-access clause + retention alignment); would become high only if LOVELEEDAY were misclassified as a 'subrecipient,' which pulls in full Uniform Guidance subpart F single-audit exposure — worth confirming contractor status explicitly in each grant-funded contract.
- **How we comply:**
  1. Confirm with the nonprofit/local-government client whether the specific engagement is paid from a federal award, and whether LOVELEEDAY is being treated as a contractor (normal case) or a subrecipient
  2. Accept a records-access clause giving the federal agency/pass-through entity/Inspectors General/Comptroller General timely access to records pertinent to the award, for as long as they're retained
  3. Match LOVELEEDAY's own records-retention practice to the client's federal retention schedule for anything pertinent to the award (generally 3 years from final expenditure report)
  4. Review and accept any Appendix II flow-down clauses the client's grant terms require in the vendor contract
- Source: https://www.ecfr.gov/current/title-2/subtitle-A/chapter-II/part-200/subpart-D/section-200.318

#### ADA Title II Rule — Accessibility of Web Content and Mobile Apps of State and Local Government (28 CFR Part 35, Subpart H (§§35.200–35.207), as amended by 89 FR 31320 (Apr. 24, 2024) and the 2026 Interim Final Rule extending compliance dates), verified
- **Applies when:** LOVELEEDAY builds or maintains a public-facing website, portal, or mobile app for a state or local government client
- **Staying out of scope:** The deliverable is purely internal/back-office tooling never exposed to the public, or content falls under a named Title II exception (e.g., true archival content)
- **What a buyer will ask for:** WCAG 2.1 AA conformance report / VPAT (Voluntary Product Accessibility Template) the government client will request from LOVELEEDAY
- **Effort:** medium-high — WCAG 2.1 AA conformance requires design and engineering discipline (semantic HTML, contrast, keyboard nav, ARIA) but is achievable without third-party certification
- **How we comply:**
  1. Build all client-facing web content and mobile apps delivered to local-government clients to conform to WCAG 2.1 Level AA success criteria
  2. Track each government client's population-based compliance deadline (April 26, 2027 for population ≥50,000; April 26, 2028 for <50,000/special districts) and schedule remediation/testing before it
  3. Run automated + manual accessibility testing (screen reader, keyboard-only navigation, color contrast) before each government-facing release and document conformance for the client's compliance file
- Source: https://www.ada.gov/resources/2024-03-08-web-rule/

#### Section 508 of the Rehabilitation Act — ICT Accessibility for Federally Funded Technology (29 U.S.C. § 794d; 36 CFR Part 1194 (Revised 508 Standards, incorporating WCAG 2.0/2.1 Level AA by reference)), verified
- **Applies when:** LOVELEEDAY's software is procured, developed, or used by a federal agency, or by a state/local government program under a contract/grant that flows down Section 508 requirements
- **Staying out of scope:** The client and funding source are purely state/local with no federal funding or flow-down clause (ADA Title II governs instead)
- **What a buyer will ask for:** Accessibility Conformance Report (ACR/VPAT)
- **Effort:** medium — largely the same WCAG 2.1 AA engineering work as the ADA Title II item, plus producing a VPAT document
- **How we comply:**
  1. Determine whether the local-government client's project is federally funded with a Section 508 flow-down requirement in the grant/contract
  2. Build ICT deliverables to conform with the Revised 508 Standards (WCAG 2.1 AA) under 36 CFR Part 1194
  3. Prepare an Accessibility Conformance Report (VPAT) documenting conformance for the procuring agency
- Source: https://www.section508.gov/manage/laws-and-policies/section-508-law/

#### Public-Records Exposure of Vendor Contracts and Data Held for Government Clients (general note; federal FAR analog) (48 CFR Subpart 24.2 (FAR Part 24, Protection of Privacy and Freedom of Information), 48 CFR 24.202–24.203), verified
- **Applies when:** LOVELEEDAY submits contracts, technical proposals, pricing, or other records to a state or local government client, all of which are presumptively public records absent a specific, properly asserted exemption
- **Staying out of scope:** LOVELEEDAY works only with private-sector or non-FOIA-exempt-agency clients where state open-records law does not apply
- **Effort:** low — primarily a contract-drafting and document-marking discipline, not a technical or certification program
- **How we comply:**
  1. Mark all technical, pricing, and proprietary submissions to government clients as 'Confidential — Trade Secret/Proprietary' and identify the specific exemption category being claimed (mirrors the FAR 24.203 approach), so the client's records officer knows the vendor's position before a request is decided
  2. Negotiate a contract clause requiring the government client to notify LOVELEEDAY before releasing records LOVELEEDAY has marked confidential, so LOVELEEDAY can seek a state-law exemption or objection if applicable
  3. Before signing with any specific local-government client, have counsel check that state's own public/open-records statute (each state differs) for the scope of vendor-record exemptions available
- Source: https://www.ecfr.gov/current/title-48/chapter-1/subchapter-D/part-24/subpart-24.2

#### GovRAMP (formerly StateRAMP) Security Authorization (StateRAMP Security Assessment Framework v4.0 (Feb 2025)), verified
- **Applies when:** LOVELEEDAY sells a cloud-hosted SaaS product directly to a state agency or local government that has adopted a GovRAMP/StateRAMP requirement in procurement policy
- **Staying out of scope:** Client governments have no GovRAMP mandate, or LOVELEEDAY's product is on-premise / not a cloud service in scope
- **What a buyer will ask for:** GovRAMP Authorized or Provisional status listing on the GovRAMP Authorized Vendors list
- **Effort:** high — 6–12 months average per govramp.org, requires a paid 3PAO assessment and ongoing continuous monitoring
- **How we comply:**
  1. Confirm whether target state/local government clients require GovRAMP/StateRAMP status in their procurement rules
  2. Use the StateRAMP Data Classification Tool to determine the applicable security category for the LOVELEEDAY product
  3. Engage a StateRAMP-approved 3PAO and notify the GovRAMP PMO to move status to 'In Process'
  4. Complete SR-SSP, SR-SCT, and POA&M documentation and pass the 3PAO assessment for Authorization
- Source: https://govramp.org/wp-content/uploads/2025/02/StateRAMP-Security-Assessment-Framework-4.0.pdf

#### Texas Risk and Authorization Management Program (TX-RAMP) (Texas Government Code § 2054.0593; TX-RAMP Program Manual v3.1 (May 2025)), verified
- **Applies when:** LOVELEEDAY contracts to provide a cloud computing service to a Texas state agency, public university, or community college
- **Staying out of scope:** The Texas client is a city, county, or school district not covered by Texas Government Code 2054.0593, or the product is not a 'cloud computing service' as DIR defines it
- **What a buyer will ask for:** TX-RAMP Certification (Level 1 or Level 2) or Provisional Status letter from Texas DIR
- **Effort:** medium — Level 1 is a self-attestation; Level 2 requires a more detailed assessment, though existing StateRAMP/FedRAMP work can be reused
- **How we comply:**
  1. Confirm the Texas client is a state agency, public university, or community college (TX-RAMP's actual scope) rather than a city/county not covered by the statute
  2. Submit a TX-RAMP request through DIR and select Level 1 or Level 2 based on data sensitivity
  3. Complete the assessment (or provide existing StateRAMP Category 2 / FedRAMP Moderate authorization as equivalent evidence) or apply for Provisional Status to contract while certification is pending
- Source: https://dir.texas.gov/information-security/texas-risk-and-authorization-management-program-tx-ramp


### Nonprofits and community organizations

#### 2 CFR Part 200 (Uniform Guidance) — obligations that flow down to contractors of federally funded grantees (2 CFR Part 200, Subpart D; specifically 200.318(b), 200.331, 200.334, 200.337), verified
- **Applies when:** LOVELEEDAY is under contract to a nonprofit or local-government client that is a recipient or subrecipient of federal grant funds, and LOVELEEDAY's services are paid for in whole or part from that federal award
- **Staying out of scope:** LOVELEEDAY is paid from the client's unrestricted/non-federal funds, or the relationship is structured (correctly, per 200.331(b)) as a standard commercial contractor arrangement rather than a subrecipient relationship
- **What a buyer will ask for:** No federal attestation form for a 'contractor' (as distinct from a 'subrecipient'); the procurement contract/purchase order itself, plus any required Appendix II flow-down clauses, is the instrument
- **Effort:** low for a normal contractor relationship (records-access clause + retention alignment); would become high only if LOVELEEDAY were misclassified as a 'subrecipient,' which pulls in full Uniform Guidance subpart F single-audit exposure — worth confirming contractor status explicitly in each grant-funded contract.
- **How we comply:**
  1. Confirm with the nonprofit/local-government client whether the specific engagement is paid from a federal award, and whether LOVELEEDAY is being treated as a contractor (normal case) or a subrecipient
  2. Accept a records-access clause giving the federal agency/pass-through entity/Inspectors General/Comptroller General timely access to records pertinent to the award, for as long as they're retained
  3. Match LOVELEEDAY's own records-retention practice to the client's federal retention schedule for anything pertinent to the award (generally 3 years from final expenditure report)
  4. Review and accept any Appendix II flow-down clauses the client's grant terms require in the vendor contract
- Source: https://www.ecfr.gov/current/title-2/subtitle-A/chapter-II/part-200/subpart-D/section-200.318

#### PCI DSS v4.0.1 — Self-Assessment Questionnaire (SAQ) scope and hosted/tokenized payment page reduction (PCI Data Security Standard (PCI DSS) v4.0.1, PCI Security Standards Council; SAQ A, SAQ A-EP, SAQ D (Merchant and Service Provider)), verified
- **Applies when:** LOVELEEDAY's software stores, processes, or transmits cardholder data for a hospitality/retail/nonprofit-donation client, or any LOVELEEDAY-served script/redirect mechanism is part of the payment page
- **Staying out of scope:** Payments run entirely through a hosted/redirect checkout or a tokenized drop-in widget (e.g., a compliant processor's hosted page or iframe) with no LOVELEEDAY-served code touching the card fields — this keeps both LOVELEEDAY and the client eligible for SAQ A and typically keeps LOVELEEDAY fully out of PCI DSS scope
- **What a buyer will ask for:** Attestation of Compliance (AOC) for the applicable SAQ (A, A-EP, or D/D-SP for a service provider that touches card data); for a fully tokenized/hosted integration, reliance on the payment processor's own AOC is the norm
- **Effort:** low if fully tokenized/hosted (an architecture choice made once, not ongoing compliance work); high if LOVELEEDAY's systems ever touch raw cardholder data (full SAQ D-SP or QSA assessment, recurring annually).
- **How we comply:**
  1. Map the payment integration architecture and confirm no LOVELEEDAY-served code touches cardholder data (use a hosted redirect or tokenized iframe/drop-in widget from a PCI DSS compliant processor)
  2. If eligible, have the client complete SAQ A (fully outsourced, card-not-present) with its Attestation of Compliance
  3. If any LOVELEEDAY script/redirect mechanism sits on infrastructure LOVELEEDAY or the client controls, plan for SAQ A-EP instead and implement the additional network/application security controls it requires
  4. Collect and review the payment processor/TPSP's PCI DSS Attestation of Compliance annually
- Source: https://www.pcisecuritystandards.org/document_library/


### Hospitality and experiences

#### FTC Act Section 5 — Unfair or Deceptive Data Security Practices (15 U.S.C. § 45(a)), verified
- **Applies when:** LOVELEEDAY collects, stores, processes, or transmits hospitality/retail customer personal data in the United States — this applies essentially to every LOVELEEDAY client relationship, not a narrow trigger
- **Staying out of scope:** Not applicable — Section 5 is a baseline that applies to virtually all LOVELEEDAY operations; there is no legitimate way to opt out of 'reasonable security' obligations
- **What a buyer will ask for:** No formal certificate; a written information security program plus (often) a SOC 2 report is the practical evidence a client or the FTC would expect
- **Effort:** medium — building and documenting a reasonable security program is ongoing operational discipline, not a one-time certification
- **How we comply:**
  1. Adopt and document a written information-security program covering encryption, access control, vendor/subprocessor oversight, patch management, and incident response, sized to the sensitivity of hospitality/retail customer and payment data handled
  2. Review all external security representations (privacy policy, sales/marketing claims, any certifications referenced) for accuracy before publishing, since a false claim is independently actionable as deceptive
  3. Remediate known vulnerabilities promptly and maintain evidence of doing so, since unremediated known flaws have driven FTC unfairness findings
- Source: https://www.ftc.gov/news-events/topics/protecting-consumer-privacy-security/privacy-security-enforcement

#### TCPA — Restrictions on Telemarketing Calls and Text Messages (47 U.S.C. § 227; 47 CFR 64.1200), verified
- **Applies when:** LOVELEEDAY's product sends or enables a hospitality/retail client to send marketing or informational SMS/voice messages using an automatic telephone dialing system or prerecorded voice
- **Staying out of scope:** All messaging is one-to-one, manually dialed, non-marketing, and outside TCPA's autodialer/prerecorded-voice triggers (a narrow carve-out; treat most bulk messaging features as in-scope)
- **What a buyer will ask for:** No formal certificate; clients/carriers (via 10DLC registration) will ask for documented consent-capture and opt-out workflows
- **Effort:** medium — mainly a product/consent-UX design requirement, not a certification, but must be built correctly from the start
- **How we comply:**
  1. Build the SMS/voice feature so that a client cannot enable marketing sends to a contact without a stored, timestamped record of prior express written consent
  2. Implement automatic honoring of STOP/opt-out keywords and suppress further sends to opted-out numbers
  3. Pass accurate caller ID / sender identification through any calling feature
- Source: https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-64/subpart-L/section-64.1200

#### CAN-SPAM Act — Commercial Email Requirements (15 U.S.C. § 7701 et seq.; 16 CFR Part 316), verified
- **Applies when:** LOVELEEDAY's product sends or enables a hospitality/retail client to send commercial (marketing) email
- **Staying out of scope:** All email is purely transactional (e.g., receipts, reservation confirmations) with no promotional content, which CAN-SPAM treats differently (lighter requirements, but still must avoid false header information)
- **What a buyer will ask for:** No formal certificate; email service providers (e.g., for deliverability) will review compliant sending practices
- **Effort:** low — mostly a product-template requirement (address, unsubscribe link) rather than a certification
- **How we comply:**
  1. Build email-sending features so every commercial email template requires a valid physical postal address and a working one-click unsubscribe link
  2. Process opt-out requests automatically and suppress the address from future sends within the statute's processing window, without requiring payment or additional information beyond the email address
  3. Do not allow header/subject-line spoofing in the platform's send configuration
- Source: https://www.ftc.gov/legal-library/browse/rules/can-spam-rule

#### ADA Title III — Website Accessibility for Public Accommodations (no final DOJ regulation) (42 U.S.C. §§ 12181–12189 (Title III); DOJ's Title III implementing regulations at 28 CFR Part 36 — no web-specific technical standard has been adopted), verified
- **Applies when:** LOVELEEDAY builds a public-facing website or app for a hospitality or retail client that is a 'place of public accommodation' under Title III
- **Staying out of scope:** Purely internal/back-office tooling with no public-facing surface
- **What a buyer will ask for:** No formal certificate; a VPAT/WCAG conformance statement is the practical document clients request
- **Effort:** medium — same WCAG 2.1 AA engineering discipline as the government items above, done here as risk mitigation rather than a codified mandate
- **How we comply:**
  1. Build hospitality/retail client-facing websites and apps to conform with WCAG 2.1 (or current 2.2) Level AA as a practical risk-reduction standard, while telling clients honestly that this is not a codified DOJ requirement for Title III
  2. Ensure effective communication alternatives exist (e.g., accessible contact methods) consistent with Title III's general nondiscrimination requirement
- Source: https://www.ada.gov/resources/web-guidance/

#### PCI DSS v4.0.1 — Self-Assessment Questionnaire (SAQ) scope and hosted/tokenized payment page reduction (PCI Data Security Standard (PCI DSS) v4.0.1, PCI Security Standards Council; SAQ A, SAQ A-EP, SAQ D (Merchant and Service Provider)), verified
- **Applies when:** LOVELEEDAY's software stores, processes, or transmits cardholder data for a hospitality/retail/nonprofit-donation client, or any LOVELEEDAY-served script/redirect mechanism is part of the payment page
- **Staying out of scope:** Payments run entirely through a hosted/redirect checkout or a tokenized drop-in widget (e.g., a compliant processor's hosted page or iframe) with no LOVELEEDAY-served code touching the card fields — this keeps both LOVELEEDAY and the client eligible for SAQ A and typically keeps LOVELEEDAY fully out of PCI DSS scope
- **What a buyer will ask for:** Attestation of Compliance (AOC) for the applicable SAQ (A, A-EP, or D/D-SP for a service provider that touches card data); for a fully tokenized/hosted integration, reliance on the payment processor's own AOC is the norm
- **Effort:** low if fully tokenized/hosted (an architecture choice made once, not ongoing compliance work); high if LOVELEEDAY's systems ever touch raw cardholder data (full SAQ D-SP or QSA assessment, recurring annually).
- **How we comply:**
  1. Map the payment integration architecture and confirm no LOVELEEDAY-served code touches cardholder data (use a hosted redirect or tokenized iframe/drop-in widget from a PCI DSS compliant processor)
  2. If eligible, have the client complete SAQ A (fully outsourced, card-not-present) with its Attestation of Compliance
  3. If any LOVELEEDAY script/redirect mechanism sits on infrastructure LOVELEEDAY or the client controls, plan for SAQ A-EP instead and implement the additional network/application security controls it requires
  4. Collect and review the payment processor/TPSP's PCI DSS Attestation of Compliance annually
- Source: https://www.pcisecuritystandards.org/document_library/


### Retail and commerce

#### FTC Act Section 5 — Unfair or Deceptive Data Security Practices (15 U.S.C. § 45(a)), verified
- **Applies when:** LOVELEEDAY collects, stores, processes, or transmits hospitality/retail customer personal data in the United States — this applies essentially to every LOVELEEDAY client relationship, not a narrow trigger
- **Staying out of scope:** Not applicable — Section 5 is a baseline that applies to virtually all LOVELEEDAY operations; there is no legitimate way to opt out of 'reasonable security' obligations
- **What a buyer will ask for:** No formal certificate; a written information security program plus (often) a SOC 2 report is the practical evidence a client or the FTC would expect
- **Effort:** medium — building and documenting a reasonable security program is ongoing operational discipline, not a one-time certification
- **How we comply:**
  1. Adopt and document a written information-security program covering encryption, access control, vendor/subprocessor oversight, patch management, and incident response, sized to the sensitivity of hospitality/retail customer and payment data handled
  2. Review all external security representations (privacy policy, sales/marketing claims, any certifications referenced) for accuracy before publishing, since a false claim is independently actionable as deceptive
  3. Remediate known vulnerabilities promptly and maintain evidence of doing so, since unremediated known flaws have driven FTC unfairness findings
- Source: https://www.ftc.gov/news-events/topics/protecting-consumer-privacy-security/privacy-security-enforcement

#### TCPA — Restrictions on Telemarketing Calls and Text Messages (47 U.S.C. § 227; 47 CFR 64.1200), verified
- **Applies when:** LOVELEEDAY's product sends or enables a hospitality/retail client to send marketing or informational SMS/voice messages using an automatic telephone dialing system or prerecorded voice
- **Staying out of scope:** All messaging is one-to-one, manually dialed, non-marketing, and outside TCPA's autodialer/prerecorded-voice triggers (a narrow carve-out; treat most bulk messaging features as in-scope)
- **What a buyer will ask for:** No formal certificate; clients/carriers (via 10DLC registration) will ask for documented consent-capture and opt-out workflows
- **Effort:** medium — mainly a product/consent-UX design requirement, not a certification, but must be built correctly from the start
- **How we comply:**
  1. Build the SMS/voice feature so that a client cannot enable marketing sends to a contact without a stored, timestamped record of prior express written consent
  2. Implement automatic honoring of STOP/opt-out keywords and suppress further sends to opted-out numbers
  3. Pass accurate caller ID / sender identification through any calling feature
- Source: https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-64/subpart-L/section-64.1200

#### CAN-SPAM Act — Commercial Email Requirements (15 U.S.C. § 7701 et seq.; 16 CFR Part 316), verified
- **Applies when:** LOVELEEDAY's product sends or enables a hospitality/retail client to send commercial (marketing) email
- **Staying out of scope:** All email is purely transactional (e.g., receipts, reservation confirmations) with no promotional content, which CAN-SPAM treats differently (lighter requirements, but still must avoid false header information)
- **What a buyer will ask for:** No formal certificate; email service providers (e.g., for deliverability) will review compliant sending practices
- **Effort:** low — mostly a product-template requirement (address, unsubscribe link) rather than a certification
- **How we comply:**
  1. Build email-sending features so every commercial email template requires a valid physical postal address and a working one-click unsubscribe link
  2. Process opt-out requests automatically and suppress the address from future sends within the statute's processing window, without requiring payment or additional information beyond the email address
  3. Do not allow header/subject-line spoofing in the platform's send configuration
- Source: https://www.ftc.gov/legal-library/browse/rules/can-spam-rule

#### ADA Title III — Website Accessibility for Public Accommodations (no final DOJ regulation) (42 U.S.C. §§ 12181–12189 (Title III); DOJ's Title III implementing regulations at 28 CFR Part 36 — no web-specific technical standard has been adopted), verified
- **Applies when:** LOVELEEDAY builds a public-facing website or app for a hospitality or retail client that is a 'place of public accommodation' under Title III
- **Staying out of scope:** Purely internal/back-office tooling with no public-facing surface
- **What a buyer will ask for:** No formal certificate; a VPAT/WCAG conformance statement is the practical document clients request
- **Effort:** medium — same WCAG 2.1 AA engineering discipline as the government items above, done here as risk mitigation rather than a codified mandate
- **How we comply:**
  1. Build hospitality/retail client-facing websites and apps to conform with WCAG 2.1 (or current 2.2) Level AA as a practical risk-reduction standard, while telling clients honestly that this is not a codified DOJ requirement for Title III
  2. Ensure effective communication alternatives exist (e.g., accessible contact methods) consistent with Title III's general nondiscrimination requirement
- Source: https://www.ada.gov/resources/web-guidance/

#### PCI DSS v4.0.1 — Self-Assessment Questionnaire (SAQ) scope and hosted/tokenized payment page reduction (PCI Data Security Standard (PCI DSS) v4.0.1, PCI Security Standards Council; SAQ A, SAQ A-EP, SAQ D (Merchant and Service Provider)), verified
- **Applies when:** LOVELEEDAY's software stores, processes, or transmits cardholder data for a hospitality/retail/nonprofit-donation client, or any LOVELEEDAY-served script/redirect mechanism is part of the payment page
- **Staying out of scope:** Payments run entirely through a hosted/redirect checkout or a tokenized drop-in widget (e.g., a compliant processor's hosted page or iframe) with no LOVELEEDAY-served code touching the card fields — this keeps both LOVELEEDAY and the client eligible for SAQ A and typically keeps LOVELEEDAY fully out of PCI DSS scope
- **What a buyer will ask for:** Attestation of Compliance (AOC) for the applicable SAQ (A, A-EP, or D/D-SP for a service provider that touches card data); for a fully tokenized/hosted integration, reliance on the payment processor's own AOC is the norm
- **Effort:** low if fully tokenized/hosted (an architecture choice made once, not ongoing compliance work); high if LOVELEEDAY's systems ever touch raw cardholder data (full SAQ D-SP or QSA assessment, recurring annually).
- **How we comply:**
  1. Map the payment integration architecture and confirm no LOVELEEDAY-served code touches cardholder data (use a hosted redirect or tokenized iframe/drop-in widget from a PCI DSS compliant processor)
  2. If eligible, have the client complete SAQ A (fully outsourced, card-not-present) with its Attestation of Compliance
  3. If any LOVELEEDAY script/redirect mechanism sits on infrastructure LOVELEEDAY or the client controls, plan for SAQ A-EP instead and implement the additional network/application security controls it requires
  4. Collect and review the payment processor/TPSP's PCI DSS Attestation of Compliance annually
- Source: https://www.pcisecuritystandards.org/document_library/


### Manufacturing and distribution

#### DFARS 252.204-7012 — Safeguarding Covered Defense Information and Cyber Incident Reporting (48 CFR 252.204-7012; DFARS Subpart 204.73), verified
- **Applies when:** LOVELEEDAY holds a DoD contract or subcontract (including as a manufacturing/distribution software vendor to a defense supplier) that flows down DFARS 252.204-7012 because covered defense information will be processed, stored, or transmitted
- **Staying out of scope:** LOVELEEDAY's manufacturing/distribution clients are entirely commercial with no DoD prime or subcontract, or the information involved is not CDI/CUI
- **What a buyer will ask for:** Self-assessment score submitted to the Supplier Performance Risk System (SPRS), SSP/POA&M, and — where the contract requires it — a CMMC certificate/self-assessment
- **Effort:** high — implementing all applicable NIST SP 800-171 controls (110 requirements under Rev 2) across a production environment is a significant security-engineering undertaking
- **How we comply:**
  1. Confirm whether any DoD prime/subcontract LOVELEEDAY holds or will hold includes DFARS 252.204-7012 and whether LOVELEEDAY's system will process Covered Defense Information
  2. Implement the NIST SP 800-171 security requirements on the information system that touches CDI and document a System Security Plan (SSP) and Plan of Action & Milestones (POA&M) for any gaps
  3. Register in the DoD DIBNet portal and stand up an incident-reporting process able to report within 72 hours of discovery
  4. Flow the clause down to any subcontractor that will handle covered defense information on LOVELEEDAY's behalf
- Source: https://www.acquisition.gov/dfars/252.204-7012-safeguarding-covered-defense-information-and-cyber-incident-reporting.

#### NIST SP 800-171 — Protecting Controlled Unclassified Information in Nonfederal Systems (NIST SP 800-171 Rev. 2 (Feb 2020, currently the DoD/CMMC-referenced baseline) and Rev. 3 (May 2024, final)), verified
- **Applies when:** LOVELEEDAY's software stores, processes, or transmits Controlled Unclassified Information for a manufacturing/distribution client performing on a federal or DoD contract
- **Staying out of scope:** The manufacturing/distribution client's use of LOVELEEDAY's product is purely commercial, with no CUI or federal contract flow-down involved
- **What a buyer will ask for:** SPRS self-assessment score; SSP and POA&M; CMMC Level 2 certificate/self-assessment where required
- **Effort:** high — same underlying control set as DFARS 252.204-7012; a multi-month security program build-out for a small vendor
- **How we comply:**
  1. Scope which LOVELEEDAY systems store/process/transmit CUI for a manufacturing/distribution client's federal or DoD-flow-down work
  2. Implement the applicable SP 800-171 security requirement families on those systems (access control, encryption, audit logging, incident response, etc.)
  3. Complete a self-assessment against SP 800-171A, score it, and submit the score to SPRS if required by contract
- Source: https://csrc.nist.gov/projects/protecting-controlled-unclassified-information

#### Cybersecurity Maturity Model Certification (CMMC) Program (32 CFR Part 170), verified
- **Applies when:** LOVELEEDAY is a subcontractor (directly or via a manufacturing/distribution client) on a DoD contract that requires CMMC status because FCI or CUI will be processed, stored, or transmitted
- **Staying out of scope:** LOVELEEDAY's manufacturing/distribution clients have no DoD contracts, or the LOVELEEDAY product never touches FCI/CUI
- **What a buyer will ask for:** CMMC Status certificate (Level 1/2 self-assessment or Level 2 C3PAO / Level 3 DIBCAC certificate) recorded in the DoD supplier system
- **Effort:** high for Level 2/3 (third-party or DIBCAC assessment, full NIST 800-171/800-172 control implementation); low-medium for Level 1 (self-assessment against 15 basic controls)
- **How we comply:**
  1. Determine the CMMC level required by the specific DoD prime contract or subcontract LOVELEEDAY supports, based on whether FCI or CUI is involved
  2. For Level 1, complete and annually renew a self-assessment against the 15 FCI safeguarding requirements
  3. For Level 2, implement all NIST SP 800-171 R2 requirements and engage a C3PAO for a third-party assessment (or self-assess if the specific contract allows)
  4. Have a senior company official submit the annual affirmation of continued compliance in the DoD supplier portal
- Source: https://www.ecfr.gov/current/title-32/subtitle-A/chapter-I/subchapter-G/part-170

#### ITAR — Export Control of Technical Data Related to Defense Articles (22 CFR Parts 120–130 (International Traffic in Arms Regulations); definition of 'technical data' at 22 CFR 120.33), verified
- **Applies when:** A manufacturing client's data stored or processed by LOVELEEDAY includes technical data for a defense article on the U.S. Munitions List
- **Staying out of scope:** The manufacturing client makes only commercial (non-defense) products, or LOVELEEDAY never receives design/production/technical data tied to a USML article — the default assumption for most LOVELEEDAY manufacturing clients
- **What a buyer will ask for:** No standard third-party certificate; a buyer may ask for an ITAR compliance/export-control policy, U.S.-person-only access attestation, or DDTC registration number if applicable
- **Effort:** high if triggered (access segregation, U.S.-persons-only staffing, possible DDTC registration); most LOVELEEDAY manufacturing clients should aim to stay in the 'not triggered' state by contract scope
- **How we comply:**
  1. Screen new manufacturing clients and their data for USML-controlled technical data before onboarding; do not accept ITAR technical data into a system not built for it
  2. If ITAR data will be handled, restrict system access to verified U.S. persons only and geofence hosting to U.S. data centers/regions
  3. Consult export-control counsel on whether LOVELEEDAY must register with DDTC or qualifies for an exemption, before signing a contract that involves ITAR technical data
- Source: https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M/part-120/subpart-C/section-120.33

#### EAR — Export Control of Dual-Use Technology and Technical Data (15 CFR Parts 730–774 (Export Administration Regulations); scope at 15 CFR Part 734), verified
- **Applies when:** A manufacturing/distribution client's data hosted by LOVELEEDAY includes EAR-controlled technology/technical data (dual-use or otherwise controlled under the Commerce Control List)
- **Staying out of scope:** The client's technology/data is EAR99 (not separately controlled) or purely commercial business data with no export-controlled technical content — the default for most LOVELEEDAY manufacturing clients
- **What a buyer will ask for:** No standard third-party certificate; a buyer may ask for an export-control compliance policy or ECCN determination for the data involved
- **Effort:** medium-high if triggered (ECCN determination, access screening); low if LOVELEEDAY's contract scope stays limited to non-controlled business/operations data
- **How we comply:**
  1. Ask manufacturing/distribution clients whether the data/technology LOVELEEDAY will host is subject to an ECCN under the Commerce Control List
  2. If controlled technology is involved, restrict access (including cloud-region and support-staff access) to authorized/screened persons and countries, treating any foreign-person access as a deemed export requiring a license or exception
  3. Screen users/clients against BIS restricted- and denied-party lists before granting access
- Source: https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-734


### Professional services

#### Gramm-Leach-Bliley Act (GLBA) — FTC Safeguards Rule, service-provider oversight (15 U.S.C. 6801-6809; 16 CFR Part 314, specifically 314.4(a) and 314.4(f)), verified
- **Applies when:** LOVELEEDAY is a service provider handling 'customer information' (nonpublic personal financial information) on behalf of a client that qualifies as a 'financial institution' under GLBA's broad definition
- **Staying out of scope:** The client is not a GLBA 'financial institution,' or LOVELEEDAY's role never touches customer financial data
- **What a buyer will ask for:** Contract clause requiring safeguards (16 CFR 314.4(f)(2)); financial-institution customers increasingly ask for a SOC 2 Type II report or a completed security questionnaire as evidence
- **Effort:** high — the client will contractually require a real written information-security program (risk assessment, access controls, encryption, MFA, incident response); this is engineering and policy work, not just paperwork.
- **How we comply:**
  1. Identify which clients qualify as 'financial institutions' under GLBA's broad activity-based definition (not just banks)
  2. Accept and be ready to sign the client's Safeguards Rule service-provider contract clause (314.4(f)(2))
  3. Build/document a written risk assessment, access controls, encryption, MFA, secure-development practices, and an incident response plan matching 314.4(b)-(h)
  4. Cooperate with the client's periodic reassessment of LOVELEEDAY as a service provider
- Source: https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-314

#### IRS Publication 4557 / Written Information Security Plan (WISP) for Tax-Preparer Clients (IRS Publication 4557 (Safeguarding Taxpayer Data); Gramm-Leach-Bliley Act Safeguards Rule (16 CFR Part 314), which Pub. 4557 implements guidance for; IRC § 7216 (tax return information confidentiality)), verified
- **Applies when:** LOVELEEDAY holds or processes taxpayer return data on behalf of a tax-preparation professional-services client
- **Staying out of scope:** The professional-services client does not prepare tax returns (e.g., general bookkeeping/consulting with no taxpayer-data handling)
- **What a buyer will ask for:** No formal certificate; a completed security questionnaire referencing IRS Pub. 4557/5708 categories (employee management, information systems, detecting/managing system failures) is what a tax-preparer client will request
- **Effort:** low-medium — mostly documentation support for the client's own WISP, layered on LOVELEEDAY's general security program
- **How we comply:**
  1. Provide tax-preparer clients with a security-controls summary/questionnaire response they can incorporate into their own WISP's service-provider oversight section
  2. Restrict use of any taxpayer data LOVELEEDAY processes to the specific purpose the preparer authorizes, consistent with IRC 7216
  3. Build a defined incident-notification SLA to tax-preparer clients so they can meet their own breach-response obligations
- Source: https://www.irs.gov/pub/irs-pdf/p4557.pdf

#### AICPA SOC 2 — System and Organization Controls Report (AICPA SOC 2 (based on the AICPA Trust Services Criteria); 2018 SOC 2 Description Criteria (with revised implementation guidance, 2022)), verified
- **Applies when:** A professional-services client (accounting firm, law firm, consultancy) or its own regulators/auditors requires evidence of independently audited security controls before buying or renewing LOVELEEDAY's software
- **Staying out of scope:** Small/early clients who accept a security questionnaire or self-attestation instead of a formal report — common for early-stage vendors before their first SOC 2
- **What a buyer will ask for:** SOC 2 Type I or Type II report issued by a licensed CPA firm
- **Effort:** high — Type I typically takes a few months of control remediation plus the audit; Type II adds a multi-month observation window before the audit; ongoing annual renewal effort thereafter
- **How we comply:**
  1. Complete a readiness assessment (gap analysis against the Trust Services Criteria, typically security at minimum) — can be self-performed or via a readiness consultant
  2. Remediate control gaps (access control, change management, encryption, vendor management, incident response, logging) and document policies
  3. Engage a licensed CPA firm to perform a SOC 2 Type I examination first (point-in-time design assessment) to validate control design
  4. Operate the controls through a 3–12 month observation window, then have the CPA firm perform the SOC 2 Type II examination testing operating effectiveness
- Source: https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services

#### ABA Model Rule 1.6(c) — Lawyer's Duty of Reasonable Efforts to Prevent Disclosure, as it Flows Down to Vendors (ABA Model Rules of Professional Conduct, Rule 1.6(c) (and Comment); related Model Rule 5.3 (supervision of nonlawyer assistance)), verified
- **Applies when:** LOVELEEDAY holds or processes 'information relating to the representation' for a law-firm client (documents, case data, communications)
- **Staying out of scope:** The professional-services client is not a law firm (e.g., an accounting or consulting firm), where different professional-conduct rules apply instead
- **What a buyer will ask for:** No formal certificate; a completed vendor-security questionnaire and a signed confidentiality/data-processing addendum are what a law firm will actually request
- **Effort:** low-medium — mostly documentation and contract-addendum work built on top of the general security program already required
- **How we comply:**
  1. Maintain data location/ownership/encryption/deletion documentation (where data is stored, who controls it, how it's encrypted, how the firm can retrieve or purge it on termination) to answer law-firm vendor due-diligence questionnaires built around ABA Formal Opinion 477 factors
  2. Build and commit to a prompt security-incident notification process to law-firm clients, supporting their Model Rule 1.4 client-notification duty
  3. Offer a data-processing/confidentiality addendum in the LOVELEEDAY contract that mirrors Rule 1.6(c)'s reasonable-efforts standard (encryption, access control, staff confidentiality obligations)
- Source: https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_1_6_confidentiality_of_information/


### Property and facilities

#### FCRA — Consumer Reports Used in Tenant Screening (15 U.S.C. § 1681 et seq. (Fair Credit Reporting Act); FTC/CFPB implementing guidance), verified
- **Applies when:** LOVELEEDAY's software collects, displays, stores, or transmits consumer-report tenant-screening data (credit, criminal, eviction history) for a property-management client's leasing decisions
- **Staying out of scope:** LOVELEEDAY's product only manages leases/maintenance/payments and never touches tenant-screening consumer-report data
- **What a buyer will ask for:** No standard certificate; property clients may ask for a data-processing addendum and confirmation of how tenant-screening data is sourced (integrated CRA vs. self-compiled)
- **Effort:** medium — primarily an architecture decision (integrate vs. build) plus adverse-action workflow support; high if LOVELEEDAY ever becomes a CRA itself
- **How we comply:**
  1. Architect the product to integrate with a licensed third-party tenant-screening consumer reporting agency (CRA) for the actual report generation, rather than LOVELEEDAY compiling credit/criminal/eviction data itself, to avoid becoming a CRA
  2. Build workflow features that capture the applicant's FCRA authorization and generate the required adverse-action notice when a property-client user denies an application based in part on the report
  3. If LOVELEEDAY ever does assemble/resell report data directly, implement FCRA's accuracy, dispute-handling, and permissible-purpose-verification obligations as a consumer reporting agency
- Source: https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title15-section1681b&num=0&edition=prelim

#### Fair Housing Act — Nondiscriminatory Advertising, as it Touches Property-Management Software (42 U.S.C. § 3604(c); HUD implementing regulations, 24 CFR Part 100), verified
- **Applies when:** LOVELEEDAY builds listing, advertising, tenant-matching/recommendation, or ad-targeting features used to advertise or match applicants to a dwelling
- **Staying out of scope:** LOVELEEDAY's product is limited to internal operations (maintenance tickets, rent collection, accounting) with no advertising or applicant-matching feature
- **What a buyer will ask for:** No formal certificate; a fair-housing compliance review or documented ad-targeting restrictions is what a sophisticated property client or HUD investigation would look for
- **Effort:** medium — mostly product-design guardrails (content review, restricted targeting parameters) rather than a certification
- **How we comply:**
  1. Build content-review or automated screening into listing/ad-creation tools to catch language or imagery that conveys a preference/limitation on a protected class before publication
  2. If LOVELEEDAY builds or integrates digital ad-targeting for property clients, disable or restrict targeting parameters that exclude protected classes or their proxies (following the HUD v. Facebook precedent and 2024 digital-platform guidance)
  3. Audit any listing-recommendation or matching algorithm for disparate steering effects on protected classes
- Source: https://www.hud.gov/sites/documents/huddojstatement.pdf


### Groups and portfolios

#### Gramm-Leach-Bliley Act (GLBA) — FTC Safeguards Rule, service-provider oversight (15 U.S.C. 6801-6809; 16 CFR Part 314, specifically 314.4(a) and 314.4(f)), verified
- **Applies when:** LOVELEEDAY is a service provider handling 'customer information' (nonpublic personal financial information) on behalf of a client that qualifies as a 'financial institution' under GLBA's broad definition
- **Staying out of scope:** The client is not a GLBA 'financial institution,' or LOVELEEDAY's role never touches customer financial data
- **What a buyer will ask for:** Contract clause requiring safeguards (16 CFR 314.4(f)(2)); financial-institution customers increasingly ask for a SOC 2 Type II report or a completed security questionnaire as evidence
- **Effort:** high — the client will contractually require a real written information-security program (risk assessment, access controls, encryption, MFA, incident response); this is engineering and policy work, not just paperwork.
- **How we comply:**
  1. Identify which clients qualify as 'financial institutions' under GLBA's broad activity-based definition (not just banks)
  2. Accept and be ready to sign the client's Safeguards Rule service-provider contract clause (314.4(f)(2))
  3. Build/document a written risk assessment, access controls, encryption, MFA, secure-development practices, and an incident response plan matching 314.4(b)-(h)
  4. Cooperate with the client's periodic reassessment of LOVELEEDAY as a service provider
- Source: https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-314

#### SEC Regulation S-P (2024 amendments) — service-provider breach notification for broker-dealers and investment advisers (15 U.S.C. 78o(g)(2); 17 CFR 248.30 (Regulation S-P)), verified
- **Applies when:** LOVELEEDAY is a service provider to an SEC-registered broker-dealer, investment company, or registered investment adviser and maintains a customer information system for that client
- **Staying out of scope:** The client is not SEC-registered (e.g., a private real-estate portfolio company with no broker-dealer/RIA registration — GLBA/Safeguards Rule may still apply instead; see us-glba-ftc-safeguards-rule)
- **What a buyer will ask for:** Written service-provider agreement establishing the 72-hour breach-notification duty under 17 CFR 248.30(a)(5)
- **Effort:** medium-high — requires a written 72-hour breach-notice agreement and an incident-response workflow fast enough to actually hit that window.
- **How we comply:**
  1. Confirm whether the client is an SEC 'covered institution' (registered broker-dealer, investment company, or registered investment adviser) subject to Reg S-P
  2. Sign the client's service-provider oversight/due-diligence agreement including the 72-hour breach-notice clause
  3. Build a breach-detection and 72-hour notification workflow to the covered institution
  4. Decide, per client, whether LOVELEEDAY will also handle investor notification on the covered institution's behalf via a separate written agreement
- Source: https://www.ecfr.gov/current/title-17/chapter-II/part-248/subpart-A/section-248.30


### Health data (any client)

#### FTC Health Breach Notification Rule — third-party service provider notice duty (16 CFR Part 318, specifically 16 CFR 318.3(b)), verified
- **Applies when:** LOVELEEDAY is a third-party service provider to a vendor of personal health records or PHR-related entity that is not a HIPAA covered entity/business associate for that data
- **Staying out of scope:** The client is a HIPAA covered entity, or LOVELEEDAY is itself a HIPAA business associate for that data set (then the HIPAA Breach Notification Rule applies instead — see us-hipaa-business-associate-obligations)
- **What a buyer will ask for:** Written contract naming the designated recipient of third-party-service-provider breach notices under 16 CFR 318.3(b)
- **Effort:** low — the vendor-facing duty is a contract clause plus a straightforward notify-and-get-acknowledgment workflow; the heavier consumer/FTC/media notice burden sits with the PHR vendor/PHR-related-entity client, not LOVELEEDAY.
- **How we comply:**
  1. Confirm with each health-adjacent client whether it is a 'vendor of personal health records' or 'PHR related entity' under this Rule (as opposed to a HIPAA covered entity/business associate, where the HIPAA rule applies instead)
  2. Add a contract clause naming the designated official to receive LOVELEEDAY's breach notices, per 16 CFR 318.3(b)
  3. Build a breach-detection and prompt-notification workflow that identifies affected customers and obtains acknowledgment of receipt from the designated official
- Source: https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-318

#### HIPAA Privacy, Security, and Breach Notification Rules — business associate obligations (45 CFR Parts 160 and 164; Privacy Rule 164.502(e)/164.504(e); Security Rule 164.308, 164.310, 164.312, 164.314; Breach Notification Rule 164.402, 164.404, 164.410), verified
- **Applies when:** LOVELEEDAY creates, receives, maintains, or transmits PHI on behalf of a HIPAA covered entity or another business associate client
- **Staying out of scope:** The client is not a HIPAA covered entity/business associate, or LOVELEEDAY never receives health information (e.g., pure billing/scheduling metadata with no health content)
- **What a buyer will ask for:** Signed BAA; a documented risk analysis; buyers increasingly also ask for a SOC 2 Type II report or HITRUST certification as evidence, though neither is a HIPAA legal requirement
- **Effort:** high — a signed BAA per client, a documented risk analysis, a real administrative/physical/technical-safeguards program, and a rehearsed 60-day breach-notification process; this is the heaviest-effort item in this set.
- **How we comply:**
  1. Sign a Business Associate Agreement with each covered-entity (or upstream business associate) client before touching PHI
  2. Conduct and document a HIPAA Security Rule risk analysis covering all systems that create/receive/maintain/transmit ePHI
  3. Implement the Security Rule's required/addressable administrative, physical, and technical safeguards and document a remediation plan for gaps
  4. Build and rehearse a breach-detection and 60-day covered-entity notification workflow
  5. Flow BAA-equivalent terms down to any subcontractor (e.g., cloud host) that will also touch PHI (164.308(b)(1))
- Source: https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.308

#### 42 CFR Part 2 — Confidentiality of Substance Use Disorder Patient Records; Qualified Service Organization Agreement (QSOA) (42 U.S.C. 290dd-2; 42 CFR Part 2, definitions at 42 CFR 2.11), verified
- **Applies when:** The health-sector client is a federally assisted substance use disorder program and LOVELEEDAY receives, stores, or processes SUD patient-identifying records
- **Staying out of scope:** The client is a general health provider with no federally assisted SUD program, or LOVELEEDAY never touches SUD-specific patient records
- **What a buyer will ask for:** Signed Qualified Service Organization Agreement (QSOA)
- **Effort:** medium — mainly a signed QSOA; the underlying technical safeguards largely overlap with the HIPAA Security Rule program already required for any health client.
- **How we comply:**
  1. Confirm whether the health-industry client is a federally assisted SUD ('Part 2') program as opposed to a general health provider
  2. Sign a Qualified Service Organization Agreement (QSOA) with the Part 2 program before receiving any SUD patient records
  3. Layer Part 2's stricter redisclosure limits on top of the existing HIPAA BAA safeguards program (see us-hipaa-business-associate-obligations)
- Source: https://www.ecfr.gov/current/title-42/chapter-I/subchapter-A/part-2

### Every industry (baseline)

- **NIST Cybersecurity Framework (CSF) 2.0 — Free Baseline**, verified: No certificate — a CSF-mapped self-assessment/questionnaire response is the artifact buyers see (https://www.nist.gov/cyberframework)
- **ISO/IEC 27001 — Information Security Management System Certification**, verified: ISO/IEC 27001 certificate issued by an accredited certification body (https://www.iso.org/standard/27001)

## State by state

What applies to LOVELEEDAY as a vendor holding a client's data. **no law** means the research found no statute of that kind, and the registry item records what was checked.

| State | Breach notification: vendor duty | Student-data privacy | Consumer privacy (processor duties) |
|---|---|---|---|
| AK | AS 45.48.010 – 45.48.090; "in the most expeditious time possible and without unreasonable delay" (per secondary source description of AS 45.48.010; not independently confirmed against the primary statute text this session) | no law | no law |
| AL | Ala. Code §§ 8-38-1 to 8-38-12; "as expeditiously as possible and without unreasonable delay, but no later than 10 days following the determination of the breach of security" (third-party agent to covered entity, §8-38-8); "as expeditiously as possible and without unreasonable delay... within 45 days" (covered entity to individuals and Attorney General, §§8-38-5(b), 8-38-6(a)) | no law | HB 351, 2026 Regular Session (enrolled act, to be codified in the Code of Alabama 1975) |
| AR | Ark. Code Ann. § 4-110-101 et seq. (enacted as Act 1526 of 2005, SB1167); "the most expedient time and manner possible and without unreasonable delay" (owner/licensee to residents, §4-110-105(a)(2)); "immediately following discovery" (non-owning maintainer/vendor to owner/licensee, §4-110-105(b)) | Ark. Code Ann. § 6-18-2501 et seq. (Act 754 of 2023, HB1757) | no law |
| AZ | A.R.S. § 18-552 (formerly § 18-545, renumbered 2018); "within forty-five days after the determination" that a breach occurred (owner/licensee to individuals/agencies, §18-552(B)); "as soon as practicable" (third party/vendor to data owner/licensee, §18-552(C)) | A.R.S. § 15-1046 | no law |
| CA | Cal. Civ. Code § 1798.82 (businesses); § 1798.29 (parallel provision for state agencies); "within 30 calendar days of discovery or notification of the data breach" (owner/licensee to residents, §1798.82(a)(2)(A)); "immediately following discovery" (non-owning maintainer/vendor to owner/licensee, §1798.82(b)) | Cal. Bus. & Prof. Code § 22584 et seq. | Cal. Civ. Code § 1798.100 et seq. (definitions and thresholds at § 1798.140) |
| CO | C.R.S. § 6-1-716; "within 30 days" of the entity determining a breach occurred that may lead to misuse of Coloradans' personal information (per the official Colorado Attorney General guidance page) | C.R.S. § 22-16-101 et seq. (added by HB16-1423) | C.R.S. § 6-1-1301 et seq. |
| CT | Conn. Gen. Stat. § 36a-701b; "without unreasonable delay but not later than sixty days after the discovery of such breach" (owner/licensee to residents, §36a-701b(b)(1)); "immediately following its discovery" (non-owning maintainer/vendor to owner/licensee, §36a-701b(c)) | Conn. Gen. Stat. §§ 10-234aa to 10-234dd | Conn. Gen. Stat. §§ 42-515 to 42-525 (Chapter 743jj, Part I — Consumer Data Privacy and Online Monitoring) |
| DC | D.C. Code § 28-3851 et seq. (Title 28, Chapter 38, Subchapter II); "the most expedient time possible following discovery" (vendor-to-owner notice); "most expedient time possible and without unreasonable delay" (owner-to-resident notice) — statute does not convert this to a fixed number of days | D.C. Code § 38-831.01 et seq. (Title 38, Chapter 8B) | no law |
| DE | 6 Del. C. § 12B-101 et seq.; "without unreasonable delay but not later than 60 days after determination of the breach of security" (owner/licensee to residents); "immediately following determination of the breach of security" (non-owning maintainer/vendor to owner/licensee) | 14 Del. C. Chapter 81A, §§ 8101A–8106A | 6 Del. C. Chapter 12D, §§ 12D-101 to 12D-111 |
| FL | Fla. Stat. § 501.171; third-party agent to covered entity: 'as expeditiously as practicable, but no later than 10 days following the determination of the breach'; covered entity to Dept. of Legal Affairs: 'as expeditiously as practicable, but no later than 30 days after the determination of the breach' | Fla. Stat. § 1006.1494 | Fla. Stat. §§ 501.701-501.718 (Part VI) |
| GA | O.C.G.A. §§ 10-1-910 through 10-1-915; Secondary sources describe a 24-hour information-broker-to-data-owner window; this specific number could not be confirmed against the official O.C.G.A. text this session and should be treated as unverified. (UNVERIFIED) | O.C.G.A. §§ 20-2-660 through 20-2-668 (Title 20, Chapter 2, Article 15) (UNVERIFIED) | no law |
| HI | Haw. Rev. Stat. § 487N-1 et seq. | Haw. Rev. Stat. § 302A-500 (enacted as SB2607, 2016) (UNVERIFIED) | no law |
| IA | Iowa Code § 715C.2; "in the most expeditious manner possible and without unreasonable delay" (no fixed day count in the statute); AG notice "within five business days after giving notice of the breach ... to any consumer" when more than 500 residents are affected | Iowa Code § 279.71 | Iowa Code ch. 715D |
| ID | Idaho Code §§ 28-51-104 through 28-51-107; 'immediately following discovery' (vendor-to-owner notice); 'in the most expedient time possible and without unreasonable delay' (owner-to-resident notice); 'within twenty-four (24) hours' (state agency to Idaho AG) | Idaho Code § 33-133 (enacted via SB 1372, Student Data Accessibility, Transparency and Accountability Act, 2014) | no law |
| IL | 815 ILCS 530/1 et seq.; vendor-to-owner: 'immediately following discovery'; owner-to-resident: 'in the most expedient time possible and without unreasonable delay' | 105 ILCS 85/1 et seq. | no law |
| IN | Ind. Code art. 24-4.9 (UNVERIFIED) | no law | Ind. Code art. 24-15 |
| KS | K.S.A. 50-7a01, 50-7a02; "as soon as possible" and "in the most expedient time possible and without unreasonable delay, consistent with the legitimate needs of law enforcement" -- no fixed day count in the statute | K.S.A. 72-6331 through 72-6334 | no law |
| KY | KRS 365.732; "the most expedient time possible and without unreasonable delay" (§2); "as soon as reasonably practicable following discovery" for the vendor-to-owner duty (§3) -- no fixed day count | KRS 365.734 | KRS 367.3611 to 367.3629 |
| LA | La. R.S. 51:3071 et seq. (notification requirements at R.S. 51:3074); "in the most expedient time possible and without unreasonable delay but not later than sixty days from the discovery of the breach" (R.S. 51:3074(E)) | La. R.S. 17:3914 | La. R.S. 51:1780.1 through 1780.5 (Chapter 20-B of Title 51), enacted by 2026 Act No. 502 (SB 386) |
| MA | M.G.L. c. 93H, § 3; "as soon as practicable and without unreasonable delay" -- no fixed day count in the statute | no law | no law |
| MD | Md. Code Ann., Com. Law § 14-3504; "as soon as reasonably practicable, but not later than 45 days after the business discovers or is notified of the breach" for consumer notice; "not later than 10 days" for the vendor-to-owner notice duty | Md. Code Ann., Educ. § 4-131 | Md. Code Ann., Com. Law §§ 14-4701 through 14-4714 (Subtitle 47, recodified from Subtitle 46 §§14-4601-14-4614) |
| ME | 10 M.R.S. §§ 1346-1350 (ch. 210-B); notice requirements at §1348; "as expediently as possible and without unreasonable delay"; a maximum of 30 days after discovery, unless law enforcement requests a delay of up to 7 business days | 20-A M.R.S. § 953 (ch. 13) | no law |
| MI | MCL 445.72 (Identity Theft Protection Act, Act 452 of 2004, as amended); "without unreasonable delay" (MCL 445.72(4)); vendor-to-owner notice has no separate numeric deadline in the statute. | MCL 388.1291–388.1295 (Act 368 of 2016) | no law |
| MN | Minn. Stat. § 325E.61; "in the most expedient time possible and without unreasonable delay"; consumer-reporting-agency notice "within 48 hours" when >500 persons affected at one time. | Minn. Stat. § 13.32 | Minn. Stat. §§ 325M.10–325M.21 (ch. 325M) |
| MO | Mo. Rev. Stat. § 407.1500; "without unreasonable delay"; vendor-to-owner notice "immediately following discovery of the breach". | Mo. Rev. Stat. § 161.096 | no law |
| MS | Miss. Code Ann. § 75-24-29; "as soon as practicable" following discovery; general disclosure "without unreasonable delay". | Miss. Code Ann. § 37-15-1 (Student Data Accessibility, Transparency and Accountability Act of 2015, enacted via SB 2777, 2015 Reg. Sess.); Miss. Code Ann. § 37-11-81 (vendor requirements for digital/online K-12 resources) (UNVERIFIED) | no law |
| MT | Mont. Code Ann. § 30-14-1704; "immediately following discovery" for the vendor-to-owner notice; "without unreasonable delay" for the owner-to-resident notice. | no law | Mont. Code Ann. §§ 30-14-2801–2820 (Title 30, ch. 14, part 28) |
| NC | N.C.G.S. § 75-65 (Article 2A, Chapter 75); "without unreasonable delay, consistent with the legitimate needs of law enforcement" (general obligation); "immediately following discovery of the breach" (non-owning business to owner/licensee) — no fixed number of days is set in the statute | N.C.G.S. § 115C-401.2 | no law |
| ND | N.D.C.C. ch. 51-30 (§§ 51-30-01 to 51-30-07; vendor duty at § 51-30-03; AG/consumer notice at § 51-30-02; enforcement at § 51-30-07); "most expedient time possible and without unreasonable delay" (owner to residents/AG); "immediately following the discovery" (non-owning maintainer to owner/licensee) | N.D.C.C. § 15.1-07-25.3 (amended by 2025 H.B. 1357) | no law |
| NE | Neb. Rev. Stat. §§ 87-801 to 87-808; "as soon as possible and without unreasonable delay"; AG notice "not later than the time when notice is provided to the Nebraska resident." | Neb. Rev. Stat. §§ 79-2,153 to 79-2,155 | Neb. Rev. Stat. §§ 87-1101 to 87-1130 (Laws 2024, LB1074) |
| NH | RSA 359-C:19 to 359-C:21 (vendor duty at RSA 359-C:20, II); "as soon as possible" (to individuals); "immediately following discovery" (vendor/maintainer to owner or licensee) | RSA 189:68-a | RSA 507-H (applicability RSA 507-H:2, I; processor duties RSA 507-H:7, II; enforcement RSA 507-H:11) |
| NJ | N.J.S.A. 56:8-163; "in the most expedient time possible and without unreasonable delay, consistent with the legitimate needs of law enforcement...or any measures necessary to determine the scope of the breach and restore the reasonable integrity of the data system" | no law | P.L.2023, c.266 (S332); codified in N.J.S.A. Title 56 (exact section numbers not independently confirmed this session) |
| NM | NMSA 1978, §§ 57-12C-1 to 57-12C-12 (vendor duty and consumer notice at § 57-12C-6; AG/CRA notice at § 57-12C-10; contractual security flow-down at § 57-12C-5); "in the most expedient time possible, but not later than forty-five calendar days following discovery of the security breach" | no law | no law |
| NV | NRS 603A.220; Vendor-to-owner notice: "immediately following discovery"; general disclosure: "in the most expedient time possible and without unreasonable delay." | NRS 388.281–388.296, esp. NRS 388.292 | NRS 603A.300–603A.360 |
| NY | General Business Law § 899-aa; "in the most expedient time possible and without unreasonable delay, provided that such notification shall be made within thirty days after the breach has been discovered" (to residents); "immediately, provided that such notification shall be made within thirty days following discovery" (vendor to owner) | Education Law § 2-d; implementing regulations at 8 NYCRR Part 121 | no law |
| OH | Ohio Rev. Code § 1349.19; "in the most expedient time possible but not later than forty-five days following its discovery or notification of the breach" | Ohio Rev. Code § 3319.326 (enacted by 2024 Senate Bill 29) | no law |
| OK | 24 Okla. Stat. §§ 161-166 | 70 Okla. Stat. § 3-168 | SB 546 (2026), expected codification 75A Okla. Stat. §§ 300-315 per secondary trackers |
| OR | ORS 646A.604; "as soon as is practicable but not later than 45 days" after discovery (covered entity); vendor to covered entity "as soon as is practicable but not later than 10 days" after discovery | ORS 336.184 | ORS 646A.570 - 646A.589 |
| PA | 73 P.S. §§ 2301-2308 (as amended by 2024 Act 33, P.L. 427); "without unreasonable delay" following determination of the breach (state agencies/political subdivisions: "within seven business days following determination") | no law | no law |
| RI | R.I. Gen. Laws § 11-49.3-4; "no later than forty-five (45) calendar days after confirmation of the breach" (persons/businesses); "no later than thirty (30) calendar days" (state/municipal agencies) | R.I. Gen. Laws § 16-104-1 | R.I. Gen. Laws §§ 6-48.1-1 to 6-48.1-10 |
| SC | S.C. Code Ann. § 39-1-90; "in the most expedient time possible and without unreasonable delay, consistent with the legitimate needs of law enforcement" | no law | no law |
| SD | S.D. Codified Laws §§ 22-40-19 to 22-40-26; "no later than sixty days from the discovery or notification of the breach of system security", unless a longer period is required for legitimate law-enforcement needs | no law | no law |
| TN | Tenn. Code Ann. § 47-18-2107; "no later than forty-five (45) days from the discovery or notification of the breach of system security", unless a longer period is required due to the legitimate needs of law enforcement | Tenn. Code Ann. §§ 49-1-701 to 49-1-708 (UNVERIFIED) | Tenn. Code Ann. §§ 47-18-3201 to 47-18-3213 |
| TX | Tex. Bus. & Com. Code §§ 521.002, 521.053, 521.151; Vendor to owner: 'immediately after discovering the breach.' Owner to individuals: 'without unreasonable delay and in each case not later than the 60th day after the date on which the person determines that the breach occurred.' | Tex. Educ. Code §§ 32.151–32.157 | Tex. Bus. & Com. Code §§ 541.001–541.205 |
| UT | Utah Code § 13-44-202; 'in the most expedient time possible without unreasonable delay,' after determining scope of breach and restoring reasonable system integrity | Utah Code § 53E-9-309 | Utah Code Title 13, Chapter 61 |
| VA | Va. Code § 18.2-186.6; 'without unreasonable delay' (no fixed day count in this section) | Va. Code § 22.1-289.01 | Va. Code §§ 59.1-575 to 59.1-585 (Title 59.1, Chapter 53) |
| VT | 9 V.S.A. § 2435; Consumers: 'most expedient time possible and without unreasonable delay, but not later than 45 days after the discovery or notification.' Vendor-to-owner: 'immediately following discovery.' | 9 V.S.A. §§ 2443, 2443a | S.71 (2026), Act 145 — to be codified at 9 V.S.A. chapter 61A, §§ 2415a et seq. |
| WA | RCW 19.255.010; definitions at RCW 19.255.005; consumer-protection provision at RCW 19.255.040; 'most expedient time possible, without unreasonable delay, and no more than thirty calendar days after the breach was discovered' | RCW 28A.604.010–.060 (chapter 28A.604 RCW) | no law |
| WI | Wis. Stat. § 134.98; 'within a reasonable time, not to exceed 45 days after the entity learns of the acquisition' (reasonableness considers number of notices required and communication methods available) | no law | no law |
| WV | W. Va. Code §§ 46A-2A-101 to 46A-2A-105; 'without unreasonable delay' for individual notice; 'as soon as practicable' for vendor-to-owner notice; no fixed day count in the statute | W. Va. Code § 18-2-5h | no law |
| WY | Wyo. Stat. §§ 40-12-501, 40-12-502; 'as soon as possible' / 'most expedient time possible and without unreasonable delay, consistent with the legitimate needs of law enforcement' — no fixed day count in the statute | no law | no law |

**Additional state laws in the registry:** IL: Biometric Information Privacy Act (BIPA) (740 ILCS 14/1 et seq.); NY: SHIELD Act — reasonable data security safeguards requirement (General Business Law § 899-bb); WA: My Health My Data Act (RCW 19.373.010–.900 (chapter 19.373 RCW))

## Open verification items

Laws that exist but whose official text could not yet be read: us-ga-breach-notification, us-ga-student-privacy, us-hi-student-privacy, us-in-breach-notification, us-ms-student-privacy, us-tn-student-privacy.
