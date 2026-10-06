# How LOVELEEDAY talks about data

The standing voice rule for every page of the site, the portal, proposals, emails and decks. It replaces the voice section of COPY.md. Enforced in part by `node scripts/check-plain-language.mjs` (in `npm run check:site` and prebuild).

## The rule

Data is only worth something when a person understands what it means and what to do about it. We write for the owner, the manager, the head of school, the finance lead: busy people with too many decisions and not enough time. We never write for a data engineer unless the page is explicitly technical (Architecture, Integrations, Trust, legal pages).

## Questions are asked the way a person asks them

A question on the site is something a real person would say out loud to a colleague, not a database query.

| Not this | This |
|---|---|
| Which open orders, by plant, depend on this supplier item? | If this part shows up late, which orders and customers does it hold up? |
| Which vendors appear under different names across booking, accounting and email? | Are we paying the same supplier under different names? |
| Which statements in this program report have supporting records? | Can we back up every number in this grant report? |
| Where are common suppliers creating shared cost exposure? | Which suppliers do several of our companies use, and could we buy better together? |

Test: could the owner say it in a hallway? Does it name their worry, not our method?

## Answers say what it means and what to do

Every result shows three things, in this order: what we found, why it matters, the next step. A count alone is not an answer.

| Not this | This |
|---|---|
| 14 open orders, supplier lot on quality hold | 14 orders waiting, and the latest batch failed inspection. Call these customers first. |
| Three names in three systems, one vendor | Listed three different ways, but it is one company. Now you can see what you really spend with them. |
| Scope amended since the last invoice | The scope grew after the last invoice. Bill for it before the next one goes out. |

Labels follow the same idea: "What you would ask" and "What Arthur tells you", not "Query" and "Result".

## Describe the experience, not the plumbing

Say what changes in someone's week. Mention the mechanism only after the benefit, and in plain words.

- Not "Connect the item master, purchasing, quality and open orders so a part is one record." Instead "See everything about a part in one place: who supplies it, what is on order, and whether it passed inspection."
- Not "ingest", "entity resolution", "canonical record", "source coverage", "realized prices", "item master", "data pipeline", "schema". Say "bring in", "recognize it is the same customer", "one record you can trust", "what we can see", "the prices you actually got", "your parts list".
- Lineage and provenance become "every figure shows where it came from".

## Why we exist, in one breath

Organizations have too many decisions to make and not enough time, and more data than they have people to work through it. LOVELEEDAY gives them the answers already worked out, with the source behind every one, so people spend their time deciding and doing, not assembling the picture.

## One example question per page

The same example question never appears on two pages: a reader who meets the same question twice concludes Arthur only solves one thing. Each page's lead example comes from a different part of an organization. `scripts/check-plain-language.mjs` fails the build when an example question (`.eq span`, `.ip-q`, `.ha-card` ask, `.tv3-q`, `.cv3-card`, the `placeholder` of a question field, or a rotation `"q"`) repeats across pages, or repeats a question listed below for a surface outside this repo.

| Page | Lead example | Area |
|---|---|---|
| Home | If this part shows up late, which orders and customers does it hold up? | Operations |
| Talk | If two big customers pay late, will we have enough cash at the end of next month? | Cash |
| Contact | Which deadlines in the next 60 days does nobody own yet? | Deadlines and compliance |
| Industries | Which machines stop most often, and what does the downtime cost us? (plus one rotation per industry) | Every industry |
| Manufacturing | If this batch cannot be used, which orders and customers will wait? | Quality |
| Property | Where are residents falling behind while repairs are still open? | Property |
| Use cases | What is going on with this customer? | Customers |
| How it works | Is Northline Studio at risk of not renewing? | Renewals |
| Operational intelligence | Which sites have work orders slipping past due? | Sites and maintenance |
| Municipal review | Which permits expire next quarter, and who owns each one? | Government |
| Operating system | Which ordinance actually applies today? | Rules |

Outside this repo (checked here so the site never borrows them):

- portal sign-in: Which budget lines are on pace to run over before the year ends?
- portal invitation: Which shifts next week still need someone?

## A national company

We work with organizations across the United States. Never anchor the company to one city or region in public copy, schema or share images. (Client-specific proposals may name the client's own place.)

## Carried over

- Name: LOVELEEDAY in copy; LOVELEEDAY Studios LLC only where the legal entity matters.
- No public prices. No emojis. No invented clients, numbers or founder history.
- Examples span every industry; never lead with bars or restaurants.
- Active voice, short sentences, no banned filler: thrilled, excited, leverage, delve, passion, synergy, unlock, empower, journey, innovative, seamless, world-class, cutting-edge, holistic, robust, streamlined.
