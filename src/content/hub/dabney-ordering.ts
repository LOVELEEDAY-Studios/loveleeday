/* INTERNAL review of Dabney's off-premise ordering channels and the path to $10k/month, on the hub template.
   Local only, not deployed. Sources, September 26, 2026: Toast orders API, 180 days (Mar 30 to Sep 26, 2026) via
   ~/arthur/scripts/toast-channel-report.mjs; Toast partner menu settings; public DoorDash and Uber Eats storefronts read
   in the cloud browser; dabneyandco.com/pantry; the site's takeout_orders table. Raw: ~/arthur/data/ordering-review/. */

export const orderingClients = [{ token: "dabney-ordering-internal", short: "Dabney & Co.", preparedFor: "Daniel May", role: "Founder" }];
export const getOrderingClient = (token: string) => orderingClients.find((c) => c.token === token);

export const glance = [
  { k: "$1,910", label: "Best delivery month so far (August): 68 orders across DoorDash, Uber Eats and Grubhub. September is pacing near $1,400.", src: "Toast orders by dining option" },
  { k: "90%", label: "Of delivery orders came through DoorDash: 149 of 166 since June. Uber Eats had 14, Grubhub 3.", src: "Toast, Jun 1 to Sep 26" },
  { k: "$27.50", label: "Average DoorDash order. One sandwich and a side. Dine-in averages $48 a check.", src: "Toast, 180 days" },
  { k: "3 a night", label: "Delivery orders on an average open night. $10k a month needs about 17 at today's order size.", src: "August: 68 orders over ~22 open nights" },
  { k: "0", label: "Orders ever placed through Toast online ordering or the Pantry on dabneyandco.com, the two channels with no commission.", src: "Toast; takeout_orders table" },
  { k: "4.6", label: "DoorDash rating, but from only 10+ reviews. Uber Eats showed no rating at all.", src: "Public storefronts, Sep 26" },
];

export type Sev = "fix" | "watch" | "good";
export const CONCEPTS_URL = "/p/dabney-ordering-concepts/dabney-ordering-concepts-internal";
export const grades: { area: string; grade: string; why: string; concepts?: number[] }[] = [
  { area: "DoorDash", grade: "B−", why: "Live, DashPass, a strong description, 4.6 stars and consistent +$1.50 pricing. It carries the whole channel. But 10+ reviews is too few to rank, there's no merchant-funded offer, and hours end at 10:55 PM while Uber Eats says 11:15." },
  { area: "Uber Eats", grade: "D", why: "55 item photos and good descriptions, better than DoorDash. But it showed \"Delivery unavailable\" at 7 PM on a Saturday, has no rating, and its only offer is Buy 1, get 1 on hummus and on a $1.50 blueberry sauce. 14 orders in three months." },
  { area: "Grubhub", grade: "F", why: "3 orders in three months. It shares the DoorDash menu but Toast can't mark up its prices, so every Grubhub order is priced like dine-in and pays full commission." },
  { area: "Toast online ordering", grade: "F", why: "Set up at order.toasttab.com/online/drinkswithdabney and never used: 0 orders in 180 days. It's the cheapest channel you have and nothing points to it.", concepts: [1, 5] },
  { area: "The Pantry", grade: "C", why: "Beautiful page and a clear offer (three packaged favorites, $12 each, $30 for all three, pickup Tue to Sat). 0 orders so far. It's retail, not dinner delivery, so it can't carry the $10k goal alone.", concepts: [4] },
  { area: "Menu for delivery", grade: "B", why: "The right items travel: sandwiches, flatbreads, cornbread, dips. But the menu is built for one person. No bundles, no family meal, nothing that turns a $27 order into a $45 one.", concepts: [2] },
];

export const findings: { sev: Sev; area: string; t: string; d: string; concepts?: number[] }[] = [
  { sev: "fix", area: "Uber Eats", t: "Uber Eats showed \"Delivery unavailable\" during open hours.", d: "Read at about 7 PM Saturday without an address, so confirm in the Uber Eats Manager whether the store is paused, the radius is tiny, or it's an address-only message. Its hours (4:30 to 11:15 PM) also don't match DoorDash (4:30 to 10:55)." },
  { sev: "fix", area: "Uber Eats", t: "The only Uber Eats offer is Buy 1, get 1 on hummus and blueberry sauce.", d: "A BOGO on a $1.50 sauce does nothing for search ranking and gives away margin. Replace it with one offer that moves orders: $5 off $30, or a free Lemon Blueberry Cornbread over $25 (the most-ordered item on Uber Eats)." },
  { sev: "fix", area: "Menu", t: "There are no bundles, so the average order is $27.50.", d: "Add three: Supper for Two (two sandwiches, a dip, a cornbread, ~$42), the Flatbread Night trio (~$34), and a Dip Board (collard dip + hummus + pita, ~$20). Raising the average to $38 is +38% revenue on the same orders.", concepts: [2] },
  { sev: "fix", area: "Reviews", t: "10+ DoorDash reviews isn't enough to rank.", d: "A card in every bag (\"Loved it? A quick rating keeps our kitchen on your feed\") and prompt replies to every review. At 3 orders a night that's 60+ new ratings a month, which moves Dabney up the Kalamazoo list.", concepts: [5] },
  { sev: "fix", area: "Own channel", t: "The commission-free channels have zero orders.", d: "Toast online ordering is live and unused. Put \"Order pickup, skip the app fees\" with a QR code in every delivery bag, the weekly email and the website nav. Every order moved from DoorDash to Toast keeps the 15 to 30% commission.", concepts: [1, 5] },
  { sev: "fix", area: "Grubhub", t: "Grubhub orders aren't marked up.", d: "Toast can raise Uber Eats and DoorDash prices automatically but not Grubhub's, so Grubhub orders pay full commission at dine-in prices. Either keep it for reach and accept the margin, or pause it until volume justifies it." },
  { sev: "watch", area: "Hours", t: "Delivery runs only Tue to Sat, 4:30 to about 11 PM.", d: "That's roughly 32 hours a week. Most delivery demand is lunch and Sunday. The single biggest volume lever is adding delivery-only windows (Thu to Sat lunch, or Sunday afternoon) when the kitchen can staff one cook." },
  { sev: "watch", area: "Catering", t: "No catering channel is live.", d: "Dabney already has a catering calculator on the site. Listing on DoorDash catering and ezCater for office lunches (sandwich platters, dip boards) brings orders of $200 to $400 each. Four a month is $1,000 to $1,500.", concepts: [3] },
  { sev: "watch", area: "Promotions", t: "No merchant-funded marketing on any app.", d: "DoorDash and Uber Eats both sell sponsored placement and new-customer offers. A test budget of $300 to $500 a month with a $5-off-$30 offer is how a 10-review store gets seen. Measure cost per new customer, not clicks." },
  { sev: "watch", area: "Toast data", t: "\"Take Out\" is being used for bar drinks.", d: "547 Take Out orders in 180 days, $17k, are mostly shots and cocktails on Saturdays. They aren't food takeout. It hides the real takeout number and could raise questions about alcohol to go. Staff should use Dine In or a bar tab." },
  { sev: "good", area: "Pricing", t: "Delivery prices are disciplined.", d: "Every DoorDash and Uber Eats item is exactly $1.50 over the house price, one delivery menu serves all three apps, and the unused Grubhub copy is now archived." },
  { sev: "good", area: "Menu", t: "The best sellers travel well.", d: "Sunday Dinner Sandwich, Fried Green Tomato BLT, Peach Cobbler Cornbread, the Steakhouse Sandwich and Grandma's Collard Green Dip lead on DoorDash. That's a delivery menu that holds up in a bag." },
  { sev: "good", area: "Uber Eats", t: "Uber Eats has the photos and copy.", d: "55 item photos and full descriptions. Once it's reliably open and has one real offer, it can pull its weight." },
];

export const ladder: { stage: string; when: string; monthly: string; what: string }[] = [
  { stage: "Today", when: "Sep 2026", monthly: "$1,400 to $1,900", what: "About 3 delivery orders a night at $27.50, almost all DoorDash, Tue to Sat evenings only." },
  { stage: "Fix the basics", when: "Weeks 1 to 2", monthly: "$2,500 to $3,000", what: "Uber Eats open and matching hours, real offers on both apps, bag cards for ratings, and the three bundles to lift the average toward $35." },
  { stage: "Get seen", when: "Month 2", monthly: "$4,500 to $5,500", what: "$300 to $500 a month in DoorDash and Uber Eats sponsored placement with a new-customer offer, 60+ new ratings a month, and pickup QR codes moving regulars to Toast online ordering." },
  { stage: "Add the hours", when: "Month 3", monthly: "$7,000 to $8,000", what: "Delivery-only lunch Thursday to Saturday, or a Sunday afternoon window, with one cook. More hours is the only way to more than double orders." },
  { stage: "Catering and own channel", when: "Months 4 to 6", monthly: "$10,000+", what: "Four to six catering orders a month through DoorDash catering, ezCater and the site ($1,000 to $2,000), plus the Pantry trio and pickup orders that pay no commission." },
];

export const fixes: { t: string; d: string; tag: "done" | "free" | "needs" | "money"; concepts?: number[] }[] = [
  { t: "Check Uber Eats: store status, radius and hours.", d: "Match hours to DoorDash and to when the kitchen really closes.", tag: "free" },
  { t: "Replace the Uber Eats BOGO with one real offer.", d: "$5 off $30, or free Lemon Blueberry Cornbread over $25.", tag: "needs" },
  { t: "Add the three bundles to the delivery menu.", d: "Supper for Two, Flatbread Night, Dip Board. I can build them in Toast's delivery menu.", tag: "free", concepts: [2] },
  { t: "Print bag cards: rate us, and order pickup to skip app fees.", d: "One card, QR to order.toasttab.com/online/drinkswithdabney.", tag: "money", concepts: [1, 5] },
  { t: "Reply to every DoorDash and Uber Eats review.", d: "I can draft replies for your approval.", tag: "free" },
  { t: "Decide on Grubhub.", d: "Keep for reach at a lower margin, or pause.", tag: "needs" },
  { t: "Test sponsored placement.", d: "$300 to $500 a month for 60 days, judged on cost per new customer.", tag: "money" },
  { t: "Pick a delivery-only window.", d: "Thursday to Saturday lunch or Sunday afternoon, if one cook can be scheduled.", tag: "needs" },
  { t: "List on DoorDash catering and ezCater.", d: "Sandwich platters and dip boards, priced from the site's catering calculator.", tag: "free", concepts: [3] },
  { t: "Stop ringing bar drinks as Take Out.", d: "A note to staff, so takeout numbers mean food.", tag: "free" },
];

export const method = [
  "Orders: every non-deleted, non-voided Toast order with a positive check amount over 180 days (Mar 30 to Sep 26, 2026), grouped by dining option. Net is the check amount after discounts, before tax and tips. Delivery started in June.",
  "Channel menus and markups: Toast's partner ordering settings. Uber Eats, DoorDash and Grubhub all read DABNEY KITCHEN (3PO). Uber Eats and DoorDash can take an automatic price increase; Grubhub cannot.",
  "Storefronts: read as a customer, logged out, in a cloud browser on September 26 around 7 PM Eastern. DoorDash menu items only render after an address is entered, so the DoorDash photo count wasn't measured.",
  "Toast online ordering (order.toasttab.com/online/drinkswithdabney) blocked the cloud browser with a bot check. The zero-order figure comes from Toast's own order data.",
  "The Pantry figure comes from the site's takeout_orders table, which had no rows.",
  "The $10k ladder is a planning estimate, not a forecast. It assumes today's $27.50 average rising toward $35 with bundles, and more orders from ratings, offers and added hours. Commission rates depend on your DoorDash and Uber Eats plans, which weren't read here.",
];
