/* Example data for the page. Every figure in an answer equals the sum of the records listed under it.
   Checked by check-data.cjs beside this file. */
window.LL_DATA = {
  asOf: 'Nov 3, 2026',
  sets: {
    pro: {
      org: 'Fennimore Group', area: 'Professional services',
      q: 'What have we finished but not invoiced?',
      looked: '5 systems',
      tables: {
        ts: { sys: 'Timesheets', file: 'time_entries', dateCol: 6, cols: ['Row', 'Client', 'Work', 'Hours', 'Rate', 'Amount', 'Last entry', 'Billed'], rows: [
          [2099, 'Brightwater Co-op', 'Intake interviews', 24, '$175', '$4,200', 'Sep 12', 'INV-1179'],
          [2100, 'Ostrander Group', 'Q2 reporting support', 61, '$175', '$10,675', 'Aug 29', 'INV-1176'],
          [2101, 'Pell & Marrow', 'Discovery sprint', 38, '$175', '$6,650', 'Oct 17', 'Not yet'],
          [2102, 'Ostrander Group', 'Q3 reporting support', 54, '$175', '$9,450', 'Sep 26', 'Not yet']] },
        pt: { sys: 'Project tracker', file: 'milestones', dateCol: 4, cols: ['Row', 'Client', 'Milestone', 'Status', 'Date', 'Fee', 'Invoice'], rows: [
          [311, 'Harlow Dental', 'Phase 1 launch', 'Accepted', 'Jul 30', '$14,500', 'INV-1161'],
          [312, 'Harlow Dental', 'Phase 2 build', 'Accepted', 'Oct 9', '$12,000', 'Not yet'],
          [313, 'Brightwater Co-op', 'Onboarding workshop', 'Delivered', 'Oct 21', '$6,400', 'Not yet'],
          [314, 'Ostrander Group', 'Annual plan', 'Accepted', 'Jun 4', '$8,000', 'INV-1142']] },
        mail: { sys: 'Mailbox', file: 'messages', dateCol: 1, cols: ['Row', 'Date', 'From', 'Subject', 'Line'], rows: [
          [88410, 'Oct 13', 'Pell & Marrow', 'Re: Sprint schedule', 'Thursday works for the readout.'],
          [88412, 'Oct 14', 'Dana Ostrander', 'Re: Change request 7', 'Approved at $6,800. Please start the reporting module.'],
          [88415, 'Oct 20', 'Harlow Dental', 'Phase 2 sign-off', 'Signed and attached.']] },
        bill: { sys: 'Billing', file: 'invoices', dateCol: 3, cols: ['Row', 'Invoice', 'Client', 'Date', 'Amount', 'Status'], rows: [
          [412, 'INV-1142', 'Ostrander Group', 'Jun 4', '$8,000', 'Paid'],
          [431, 'INV-1161', 'Harlow Dental', 'Jul 30', '$14,500', 'Paid'],
          [447, 'INV-1176', 'Ostrander Group', 'Aug 29', '$10,675', 'Paid'],
          [452, 'INV-1179', 'Brightwater Co-op', 'Sep 12', '$4,200', 'Paid']] }
      },
      figs: {
        a: { head: 'Finished, not yet invoiced', total: '$41,300', recs: [
          { t: 'ts', r: 2102, v: 9450, col: 5, note: 'Ostrander Group · Q3 reporting support' },
          { t: 'pt', r: 312, v: 12000, col: 5, note: 'Harlow Dental · Phase 2 build' },
          { t: 'pt', r: 313, v: 6400, col: 5, note: 'Brightwater Co-op · Onboarding workshop' },
          { t: 'ts', r: 2101, v: 6650, col: 5, note: 'Pell & Marrow · Discovery sprint' },
          { t: 'mail', r: 88412, v: 6800, col: 4, note: 'Ostrander Group · Change request 7' }], sum: 41300, foot: 'five records' },
        b: { head: 'Owed by Ostrander Group', total: '$16,250', recs: [
          { t: 'ts', r: 2102, v: 9450, col: 5, note: 'Q3 reporting support' },
          { t: 'mail', r: 88412, v: 6800, col: 4, note: 'Change request 7' }], sum: 16250, foot: 'two records' },
        c: { head: 'Days since the last timesheet entry', total: '38 days', recs: [
          { t: 'ts', r: 2102, v: 'Sep 26', col: 6, note: 'Last hours logged on Q3 reporting' },
          { t: 'bill', r: 447, v: 'Aug 29', col: 3, note: 'Last invoice to Ostrander Group' }], days: ['Sep 26', 'Nov 3', 38] }
      },
      answer: '<b class="k">What we found.</b> {a|$41,300} of finished work has not been invoiced. Ostrander Group is the largest at {b|$16,250}, and its oldest item has waited {c|38 days}.<span class="gap"></span><b class="k">What to do.</b> Invoice Ostrander first, then Harlow Dental, whose Phase 2 milestone was accepted on Oct 9.'
    },
    edu: {
      org: 'Larkspur Charter Schools', area: 'Schools',
      q: 'Will we hit our enrollment number before the state count day?',
      looked: '3 systems',
      tables: {
        sis: { sys: 'Student information system', file: 'enrollment_by_campus', dateCol: 4, cols: ['Row', 'Campus', 'Grades', 'Enrolled', 'As of'], rows: [
          [1, 'North campus', 'K to 5', 142, 'Oct 30'],
          [2, 'Riverside campus', 'K to 5', 131, 'Oct 30'],
          [3, 'Hill campus', '6 to 8', 121, 'Oct 30']] },
        reg: { sys: 'Registration portal', file: 'offers', dateCol: -1, cols: ['Row', 'Campus', 'Offers accepted', 'Registered', 'Not finished'], rows: [
          [1, 'North campus', 151, 142, 9],
          [2, 'Riverside campus', 139, 131, 8],
          [3, 'Hill campus', 127, 121, 6]] },
        bud: { sys: 'Budget workbook', file: 'Enrollment plan', dateCol: -1, cols: ['Row', 'Line', 'Value', 'Note'], rows: [
          [3, 'Funding per student', '$9,860', 'State estimate'],
          [4, 'Students, all campuses', 412, 'Approved Jun 11, 2026'],
          [5, 'Teaching positions', 31, 'Board vote Jun 11']] }
      },
      figs: {
        a: { head: 'Students enrolled', total: '394', recs: [
          { t: 'sis', r: 1, v: 142, col: 3, note: 'North campus' },
          { t: 'sis', r: 2, v: 131, col: 3, note: 'Riverside campus' },
          { t: 'sis', r: 3, v: 121, col: 3, note: 'Hill campus' }], sum: 394, foot: 'three campuses' },
        b: { head: 'Students in the budget plan', total: '412', recs: [
          { t: 'bud', r: 4, v: 412, col: 2, note: 'Students, all campuses' }], sum: 412, foot: 'one record' },
        c: { head: 'Students short of the plan', total: '18', recs: [
          { ref: 'b', v: 412, note: 'Planned students' },
          { ref: 'a', v: -394, note: 'Enrolled today' }], sum: 18, foot: 'plan minus enrolled' },
        d: { head: 'Families who accepted a seat and have not finished', total: '23', recs: [
          { t: 'reg', r: 1, v: 9, col: 4, note: 'North campus' },
          { t: 'reg', r: 2, v: 8, col: 4, note: 'Riverside campus' },
          { t: 'reg', r: 3, v: 6, col: 4, note: 'Hill campus' }], sum: 23, foot: 'three campuses' }
      },
      answer: '<b class="k">What we found.</b> You have {a|394} students enrolled against a plan of {b|412}, so you are {c|18} short.<span class="gap"></span><b class="k">Why it matters.</b> {d|23} families accepted a seat and have not finished registering, enough to close the gap.<span class="gap"></span><b class="k">What to do.</b> Call those families this week, starting with North campus.'
    },
    mfg: {
      org: 'Corliss Molded Products', area: 'Manufacturing',
      q: 'Are we going to miss any shipments this month because of materials?',
      looked: '3 systems',
      tables: {
        erp: { sys: 'Open orders', file: 'sales_orders', dateCol: 3, cols: ['Row', 'Order', 'Customer', 'Ships', 'Value', 'Resin lot'], rows: [
          [7731, 'SO-7731', 'Carver Tool', 'Nov 8', '$48,200', 'R-2291'],
          [7736, 'SO-7736', 'Orrin Hardware', 'Nov 10', '$17,800', 'R-1180'],
          [7740, 'SO-7740', 'Dyer Packaging', 'Nov 11', '$39,600', 'R-2291'],
          [7744, 'SO-7744', 'Carver Tool', 'Nov 13', '$31,500', 'R-2291'],
          [7752, 'SO-7752', 'Halvorsen Supply', 'Nov 19', '$27,300', 'R-2291'],
          [7758, 'SO-7758', 'Meridian Fittings', 'Nov 22', '$36,900', 'R-2291'],
          [7763, 'SO-7763', 'Dyer Packaging', 'Nov 26', '$28,900', 'R-2291']] },
        po: { sys: 'Purchasing', file: 'purchase_orders', dateCol: 4, cols: ['Row', 'PO', 'Supplier', 'Item', 'Due', 'Status'], rows: [
          [2201, 'PO-2201', 'Brandt Steel', 'Bar stock 1018', 'Nov 5', 'On time'],
          [2204, 'PO-2204', 'Kessler Polymers', 'Resin R-2291, 40 pallets', 'Nov 18', 'Moved from Nov 6'],
          [2207, 'PO-2207', 'Pine Ridge Packaging', 'Cartons', 'Nov 9', 'On time']] },
        mail: { sys: 'Mailbox', file: 'messages', dateCol: 1, cols: ['Row', 'Date', 'From', 'Subject', 'Line'], rows: [
          [9118, 'Oct 30', 'Brandt Steel', 'Delivery Tuesday', 'Truck arrives Nov 5 as planned.'],
          [9120, 'Oct 31', 'Kessler Polymers', 'Resin R-2291 arrival', 'New arrival date is Nov 18. Port delay, not production.']] }
      },
      figs: {
        a: { head: 'Open orders waiting on resin R-2291', total: '$212,400', recs: [
          { t: 'erp', r: 7731, v: 48200, col: 4, note: 'Carver Tool · ships Nov 8' },
          { t: 'erp', r: 7740, v: 39600, col: 4, note: 'Dyer Packaging · ships Nov 11' },
          { t: 'erp', r: 7744, v: 31500, col: 4, note: 'Carver Tool · ships Nov 13' },
          { t: 'erp', r: 7752, v: 27300, col: 4, note: 'Halvorsen Supply · ships Nov 19' },
          { t: 'erp', r: 7758, v: 36900, col: 4, note: 'Meridian Fittings · ships Nov 22' },
          { t: 'erp', r: 7763, v: 28900, col: 4, note: 'Dyer Packaging · ships Nov 26' }], sum: 212400, foot: 'six orders' },
        b: { head: 'Orders that ship before the resin arrives', total: '$119,300', recs: [
          { t: 'erp', r: 7731, v: 48200, col: 4, note: 'Carver Tool · ships Nov 8' },
          { t: 'erp', r: 7740, v: 39600, col: 4, note: 'Dyer Packaging · ships Nov 11' },
          { t: 'erp', r: 7744, v: 31500, col: 4, note: 'Carver Tool · ships Nov 13' }], sum: 119300, foot: 'three orders' },
        c: { head: 'When the resin arrives', total: 'Nov 18', recs: [
          { t: 'po', r: 2204, v: 'Nov 18', col: 4, note: 'Purchase order due date' },
          { t: 'mail', r: 9120, v: 'Nov 18', col: 4, note: 'Supplier email, Oct 31' }], txt: true }
      },
      answer: '<b class="k">What we found.</b> Six open orders worth {a|$212,400} need resin lot R-2291, and it is now due {c|Nov 18}, not Nov 6.<span class="gap"></span><b class="k">Why it matters.</b> Three of them, worth {b|$119,300}, ship before then.<span class="gap"></span><b class="k">What to do.</b> Call Carver Tool and Dyer Packaging today.'
    },
    gov: {
      org: 'City of Alderbrook', area: 'Local government',
      q: 'How much of our road grant do we still have to spend, and by when?',
      looked: '2 systems',
      tables: {
        led: { sys: 'Finance ledger', file: 'grant_ledger', dateCol: 3, cols: ['Row', 'Grant', 'Entry', 'Date', 'Amount'], rows: [
          [17, 'Road Repair Grant', 'Spend by deadline', 'Dec 31', 'none'],
          [18, 'Road Repair Grant', 'Award', 'Jan 12', '$640,000'],
          [61, 'Road Repair Grant', 'Spent through Oct 31', 'Oct 31', '$321,600'],
          [72, 'Park Safety Grant', 'Award', 'Mar 3', '$150,000']] },
        po: { sys: 'Contracts', file: 'purchase_orders', dateCol: 4, cols: ['Row', 'PO', 'Vendor', 'Project', 'Signed', 'Amount', 'Grant'], rows: [
          [2209, 'PO-2209', 'Ridgeline Paving', 'Mill Street resurfacing', 'Sep 18', '$146,000', 'Road Repair'],
          [2211, 'PO-2211', 'Teague Fence', 'Playground fencing', 'Oct 2', '$22,500', 'Park Safety'],
          [2214, 'PO-2214', 'Calloway Concrete', 'Curb and drain repair', 'Oct 9', '$55,000', 'Road Repair']] }
      },
      figs: {
        a: { head: 'Road grant left to spend', total: '$318,400', recs: [
          { t: 'led', r: 18, v: 640000, col: 4, note: 'Award' },
          { t: 'led', r: 61, v: -321600, col: 4, note: 'Spent through Oct 31' }], sum: 318400, foot: 'award minus spent' },
        b: { head: 'Already committed to signed contracts', total: '$201,000', recs: [
          { t: 'po', r: 2209, v: 146000, col: 5, note: 'Ridgeline Paving · Mill Street' },
          { t: 'po', r: 2214, v: 55000, col: 5, note: 'Calloway Concrete · Curb and drain' }], sum: 201000, foot: 'two contracts' },
        c: { head: 'Not yet spoken for', total: '$117,400', recs: [
          { ref: 'a', v: 318400, note: 'Left to spend' },
          { ref: 'b', v: -201000, note: 'Committed' }], sum: 117400, foot: 'left minus committed' },
        d: { head: 'Spend-by date', total: 'Dec 31', recs: [
          { t: 'led', r: 17, v: 'Dec 31', col: 3, note: 'Grant agreement term' }], txt: true }
      },
      answer: '<b class="k">What we found.</b> {a|$318,400} of the road repair grant has to be spent by {d|Dec 31}. {b|$201,000} is already committed to two signed contracts.<span class="gap"></span><b class="k">Why it matters.</b> {c|$117,400} is not spoken for yet.<span class="gap"></span><b class="k">What to do.</b> Ask Public Works to name a project this month.'
    }
  }
};
