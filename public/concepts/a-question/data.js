window.QDATA = {
  who: [
    { id: 'plant', label: 'Plant manager', art: 'A plant manager' },
    { id: 'head', label: 'Head of school', art: 'A head of school' },
    { id: 'clerk', label: 'City clerk', art: 'A city clerk' },
    { id: 'property', label: 'Property manager', art: 'A property manager' },
    { id: 'nonprofit', label: 'Nonprofit director', art: 'A nonprofit director' },
    { id: 'shop', label: 'Shop owner', art: 'A shop owner' },
    { id: 'firm', label: 'Firm partner', art: 'A partner at a firm' }
  ],
  sets: {
    plant: { q: 'If this part ships late, which customers wait?', a: ['Fourteen orders wait on it, and the latest batch failed inspection.', 'Every one of those orders is waiting on the same failed lot.', 'Call those customers first, then ask the supplier for a new date.'], s: ['Open orders', 'Inspection record', 'Supplier email'] },
    head: { q: 'Which families still owe a form before the field trip?', a: ['Thirty-one of 212 families have not returned the permission form.', 'The bus leaves Thursday, and no form means no seat.', 'Send the reminder to those 31 today. Six have no phone number on file.'], s: ['Enrollment records', 'Forms inbox', 'Trip roster'] },
    clerk: { q: 'Which permits run out before the council meets again?', a: ['Nine permits expire before the next meeting, and two have no owner.', 'An expired permit stops work on site the next morning.', 'Assign the two without an owner, and send renewal notices for the other seven.'], s: ['Permit register', 'Council calendar', 'Staff directory'] },
    property: { q: 'Which buildings cost the most to keep up this year?', a: ['Two buildings account for almost half of repair spending.', 'Both use the same boiler contractor, and the same repair keeps coming back.', 'Ask for a written fix on the boiler before approving the next invoice.'], s: ['Work orders', 'Vendor invoices', 'Lease records'] },
    nonprofit: { q: 'Which grants report next month, and who owns each one?', a: ['Four reports are due, and one has no name beside it.', 'That one is the largest grant, and its numbers still sit in two spreadsheets.', 'Give it an owner this week and bring both sheets into one.'], s: ['Grant tracker', 'Ledger', 'Shared drive'] },
    shop: { q: 'Why did my best-selling candle stop selling?', a: ['It sold out on the fourteenth, and the reorder was never placed.', 'It was about a fifth of your weekly sales.', 'Place the reorder today. The supplier lists a nine day wait.'], s: ['Inventory', 'Orders', 'Supplier email'] },
    firm: { q: 'Which clients have work we have not billed for in two months?', a: ['Five clients have unbilled work, about two months old on average.', 'Two of them signed a change of scope that never reached an invoice.', 'Bill those two before the next invoice goes out.'], s: ['Time entries', 'Contracts', 'Invoices'] }
  },
  wall: {
    head: [
      ['Which students have missed more than ten days since September?', 'Eleven have, and seven of them miss mostly Mondays. Call those families this week.', 'Attendance, Student roster'],
      ['Do we have enough certified teachers for next year?', 'Two sections have no certified teacher yet, both in science. Open those postings now.', 'Staff records, Course schedule'],
      ['How many seats will we really fill in the fall?', 'Of 140 offers, 96 families said yes and 22 have not answered. Call the 22 before the deposit deadline.', 'Enrollment, Offers'],
      ['Which families asked about tuition help and never heard back?', 'Eight families wrote in and no reply is on file. Answer those first.', 'Inbox, Aid requests'],
      ['Are we on pace to spend the whole technology grant?', 'Sixty percent is spent with four months left, and two orders are still unplaced. Place them this month.', 'Grant ledger, Purchase orders'],
      ['Which buses ran late more than twice this month?', 'Route 4 ran late five times, always after the same stop. Ask the driver what happens there.', 'Transport log, Parent messages'],
      ['Who has not finished the required training this year?', 'Seventeen staff, nine of them new this fall. Send the link with a Friday date.', 'Training records, Staff list']
    ],
    clerk: [
      ['Who owns the records request that came in last week?', 'No one. It has sat unassigned for six days and the legal limit is ten. Assign it today.', 'Request log, Staff directory'],
      ['Which business licenses lapsed and never renewed?', 'Thirty-four lapsed, and nineteen of those are still operating. Send a notice and a call list to the inspector.', 'License register, Inspections'],
      ['What did the council actually decide about the sidewalk repair?', 'Approved in March with a cap, then amended in June. The June version controls, and both sets of minutes are attached.', 'Council minutes, Ordinances'],
      ['Which ordinance covers this fence request?', 'Two overlap, and the 2022 amendment replaced the older one. The newer one applies.', 'Ordinance library, Permit file'],
      ['Are we paying any vendor twice for the same job?', 'One mowing contractor appears under two names and was paid twice in August. Ask finance to recover it.', 'Payables, Contracts'],
      ['Which public notices are due before the vote?', 'Three, and one is already a day late. Post it now and note the reason.', 'Meeting calendar, Notice log'],
      ['How long do permit applications really take?', 'Half finish in 19 days, but anything that needs the fire department takes over 40. Start that review first.', 'Permit system, Review log']
    ],
    plant: [
      ['Which line lost the most hours last month?', 'Line 3 lost forty hours, most of it waiting on one tooling part. Order a spare.', 'Downtime log, Parts orders'],
      ['Is the new supplier’s material passing inspection?', 'It passed in 41 of 46 lots. All five failures came from one plant. Raise it with the supplier.', 'Inspection records, Receiving'],
      ['What are we about to run out of?', 'Three materials fall below one week of stock by Monday, and one has a six week lead time. Reorder that one first.', 'Inventory, Purchase orders'],
      ['Which customer orders are at risk this week?', 'Six, all waiting on the same casting. Tell those customers today.', 'Open orders, Supplier email'],
      ['Why did scrap go up in October?', 'It rose on nights after a tool change on the ninth. Check the new tool’s settings.', 'Quality records, Maintenance log'],
      ['Are we paying the same supplier under different names?', 'Yes. Three listings are one company, and you spend more with them than you thought. Join them and renegotiate.', 'Ledger, Mailbox, Contracts'],
      ['Which maintenance is overdue on the machines that matter most?', 'Two presses are past due for inspection. Schedule them before the weekend run.', 'Maintenance schedule, Production plan']
    ],
    property: [
      ['Which units have had the same repair twice?', 'Eleven units, mostly a leaking sink trap. Replace it instead of tightening it again.', 'Work orders, Unit history'],
      ['Which leases end in the next ninety days?', 'Twenty-two, and nine have no renewal offer yet. Send those offers first.', 'Lease records, Rent roll'],
      ['Which vendors serve several buildings, and do we pay one price?', 'Four vendors, and one charges thirty percent more at the older buildings. Ask for one price.', 'Invoices, Contracts'],
      ['Who is behind on rent, and have we heard from them?', 'Fourteen are late and six of them wrote to us with no reply. Answer those six today.', 'Rent roll, Tenant inbox'],
      ['Which building is most likely to fail inspection?', 'Building C has three open items from the last visit, all past their fix date. Close them first.', 'Inspection reports, Work orders'],
      ['What did we promise this tenant in the lease?', 'Parking for two cars and a repainted kitchen by spring. The painting is not scheduled. Book it.', 'Lease, Work orders'],
      ['Is insurance current on every building?', 'Yes for nine, and one expires in twelve days. Ask the broker for the renewal.', 'Policies, Calendar']
    ],
    nonprofit: [
      ['Which donors gave last year and have not given this year?', 'Two hundred and six, and forty of them gave five years running. Write those forty personally.', 'Donations, Contact records'],
      ['Can we back up every number in this grant report?', 'Forty-one of forty-four trace to a record. Three come from a spreadsheet no one has opened since June. Check those three.', 'Grant report, Ledger, Program records'],
      ['Which program is costing more than we planned?', 'After-school is over by eighteen percent, mostly transport. Look at the route costs.', 'Budget, Ledger'],
      ['Who volunteered often and never got a thank you?', 'Fifty-three people. Thank the top ten by name this week.', 'Volunteer log, Mailbox'],
      ['Is the same donor in our list three times?', 'For 412 of them, yes. Merge them before the year-end letter goes out.', 'Donor database, Event list, Mailbox'],
      ['How many families did we serve this quarter, really?', '1,260 households, after removing 190 repeat entries. Use that number in the report.', 'Intake forms, Program records'],
      ['What do we owe funders before the end of the year?', 'Six reports and one site visit. The earliest is due on the third.', 'Grant tracker, Calendar']
    ],
    shop: [
      ['Which products do I keep discounting that I should drop?', 'Five sell only on sale and cost more to ship than they earn. Drop them.', 'Orders, Shipping costs'],
      ['Who are the customers that buy every month?', 'Eighty-three, about a quarter of revenue. Send them a thank-you before the holidays.', 'Orders, Email list'],
      ['Did that supplier really raise their price?', 'Yes, eight percent in September, and your shelf prices did not move. Adjust them this week.', 'Supplier invoices, Price list'],
      ['Which orders are stuck at the post office?', 'Seven, all with the same zip code format problem. Write to those customers today.', 'Shipping, Customer emails'],
      ['What did the market stall earn after the fees?', 'About half of what it looked like once fees and travel came out. Keep the Saturday, drop the Sunday.', 'Sales, Expenses'],
      ['Am I about to run out of what sells fastest?', 'Two items last about nine days, and the supplier takes twelve. Order today.', 'Inventory, Orders'],
      ['Which customers wrote in and never got an answer?', 'Nine in the last two weeks, three about a damaged order. Reply to those three first.', 'Inbox, Orders']
    ],
    firm: [
      ['Which projects are over their hours?', 'Four, and one is forty percent over with no change order. Talk to that client this week.', 'Time entries, Contracts'],
      ['Who has not signed the renewed engagement letter?', 'Nine clients, and three are already getting work. Send those three first.', 'Contracts, Client inbox'],
      ['Which client is slowest to pay?', 'One client averages 71 days and holds two of every five late invoices. Change their terms.', 'Invoices, Payments'],
      ['Who on the team is overbooked next month?', 'Two people, by about a week each. Move one project before it slips.', 'Schedule, Project plans'],
      ['What did we tell this client we would do?', 'A quarterly review and one training day. Neither is on the calendar. Book them.', 'Proposal, Email thread, Calendar'],
      ['Are we charging one client two different rates?', 'Yes, for two different teams. Pick one rate and tell them first.', 'Contracts, Invoices'],
      ['Which filings are due this month, and who has them?', 'Eleven, and two have no one assigned. Assign them today.', 'Filing calendar, Staff list']
    ]
  }
};
