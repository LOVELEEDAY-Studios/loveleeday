# Compliance registry — research brief (shared by every research agent)

LOVELEEDAY is a small US software/data studio. It handles clients' records (schools,
local government, nonprofits, hospitality, retail, manufacturing, professional
services, property and portfolio companies) as a **vendor / service provider /
data processor**. This registry records the legal obligations that apply to
LOVELEEDAY and its clients, jurisdiction by jurisdiction. It extends the DC work,
which was built only from documents the agencies publish. The same rule applies here.

## The one rule: never fabricate
- Every item needs `source_url` pointing to the **official** text: the state
  legislature's code site, the official state code publisher, the AG's page, or the
  federal regulator (ecfr.gov, hhs.gov, ftc.gov, ed.gov, fbi.gov, pcisecuritystandards.org).
  Law-firm summaries, NCSL, IAPP and Wikipedia can help you FIND the statute. They
  are never the `source_url`. Put them in `secondary_sources` if you used them.
- `verified: true` only if you actually fetched the official page THIS session and
  it supports the fields you filled in. Otherwise `verified: false`, and say why in `uncertainty`.
- If you cannot find a law (for example, a state has no student-privacy statute
  aimed at vendors), write an item with `exists: false`. Explain what you checked.
  Never invent a citation, a deadline or a number. A blank field beats a guessed one.
- Deadlines: quote the statute's actual wording ("most expedient time possible",
  "within 30 days"). Do not turn vague wording into a number of days.

## Output
Write ONE JSON file to the path you were given: `{"generated": "2026-09-23", "items": [ ... ]}`.
Each item:

```json
{
  "id": "us-mi-breach-notification",
  "jurisdiction": "US-MI",            // ISO-style: US, US-DC, US-MI …
  "level": "state",                    // federal | state | city
  "domain": "breach-notification",     // breach-notification | student-privacy | health-privacy | financial-privacy | payments | criminal-justice | children-online | public-records | charitable-solicitation | consumer-privacy | other
  "industries": ["all"],               // or any of: education, local-government, nonprofit, hospitality, retail, manufacturing, professional-services, property, portfolios, health
  "exists": true,
  "title": "Identity Theft Protection Act — security breach notification",
  "citation": "MCL 445.72",
  "applies_to_vendor": "What a service provider holding the data must do (for example, notify the data owner and the time limit for doing so)",
  "key_obligations": ["short, factual, each backed by the source"],
  "notice_deadline": "statute's own wording, or null",
  "regulator_notice": "AG/agency notice requirement and threshold, or null",
  "personal_info_definition_notes": "notable elements (biometrics, credentials…), or null",
  "penalties": "or null",
  "effective_or_amended": "latest amendment year if shown on the source, or null",
  "source_url": "https://official…",
  "secondary_sources": [],
  "retrieved": "2026-09-23",
  "verified": true,
  "uncertainty": "anything you could not confirm"
}
```

### Extra fields for federal / industry framework items (industry agents)
Daniel wants to know **how LOVELEEDAY becomes compliant** in every industry it lists,
not only what the rule says. For each framework item also fill:

```json
  "how_to_comply": [                    // ordered, concrete vendor steps, each backed by a source
    {"step": "Sign a Business Associate Agreement with each covered-entity client", "source_url": "https://www.hhs.gov/…"}
  ],
  "attestation": "what a buyer will ask to see: BAA, SAQ-D, CJIS Security Addendum, SOC 2 report, NDPA… or null",
  "triggered_when": "the facts that make it apply to LOVELEEDAY (for example, 'we store, process or transmit cardholder data')",
  "not_triggered_when": "how to stay out of scope legitimately (for example, a tokenized/hosted payment page that reduces PCI scope), or null",
  "effort": "low | medium | high, with one line explaining why"
```

Keep text tight and factual. Do not give legal advice or write marketing copy.
When finished, reply with: the file path, the item count, the count verified
against an official source, and any jurisdiction you could not source.
