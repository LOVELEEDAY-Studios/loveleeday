#!/usr/bin/env python3
"""fix-industry-pages.py : one-off repair of the three industry detail pages.
The product panels were removed in a9eda44 and left empty scaffolding behind: an ip-band holding only the rotating-question
JSON, three manufacturing sections with a blank right column, and a button that points at a bare dark band.
This restores the labelled sample answer card (the same card the home page and overview use), folds the three blank
manufacturing sections into one editorial list, drops numerals from the step rows, and retargets the hero button."""
import re, subprocess, sys

ROOT = '/Users/danielmay/wt/ll-review-1026'
PAGES = {
    'manufacturing': {
        'ip': None,
    },
    'property': {
        'ip': ('<div class="ip"><div class="ip-h"><span class="ip-t">Properties needing attention</span><span class="ip-pill">Illustrative sample</span></div>'
               '<div class="ip-q"><b>What you would ask</b>Which building should get the first call this week?</div>'
               '<ul><li class="hot"><b>Linden Court</b><span>Rent and repairs both need review. Check the affected units first.</span><em>Sample record</em></li>'
               '<li class="wt"><b>Westbrook Commons</b><span>Review overdue balances with open repairs before the owner update.</span><em>Sample record</em></li>'
               '<li class="ok"><b>Maple Terrace</b><span>Fewer issues here. Confirm the open repairs are assigned.</span><em>Sample record</em></li></ul>'
               '<div class="ip-f">Each line keeps its source and date</div></div>'),
    },
    'schools': {
        'ip': ('<div class="ip"><div class="ip-h"><span class="ip-t">Items due this term</span><span class="ip-pill">Illustrative sample</span></div>'
               '<div class="ip-q"><b>What you would ask</b>Which items on our charter renewal checklist still have no document behind them?</div>'
               '<ul><li class="hot"><b>Annual financial audit</b><span>Due in 12 days. The signed copy is not on file yet. Ask the business office today.</span><em>Sample record</em></li>'
               '<li class="wt"><b>Board meeting minutes</b><span>Two of the last six sets are missing a signature. Collect them before the site visit.</span><em>Sample record</em></li>'
               '<li class="ok"><b>Fire safety inspection</b><span>Done, and the certificate is attached. Nothing to do.</span><em>Sample record</em></li></ul>'
               '<div class="ip-f">Each line keeps its source and date</div></div>'),
    },
}
MF_IP = ('<div class="ip"><div class="ip-h"><span class="ip-t">Open orders by plant</span><span class="ip-pill">Illustrative sample</span></div>'
         '<div class="ip-q"><b>What you would ask</b>If this batch cannot be used, which orders and customers will wait?</div>'
         '<ul><li class="hot"><b>Plant 2</b><span>14 orders may slip because the lot failed inspection. Call these customers first.</span><em>Quality log</em></li>'
         '<li class="wt"><b>Plant 1</b><span>6 orders may miss their dates because delivery moved. Confirm dates with those customers.</span><em>Purchasing</em></li>'
         '<li class="ok"><b>Plant 3</b><span>No orders on this item. Nothing to do.</span><em>ERP</em></li></ul>'
         '<div class="ip-f">Each line keeps its source and date</div></div>')
PAGES['manufacturing']['ip'] = MF_IP

# manufacturing: three blank-sided sections become one list in the same grammar as the other two industry pages
MF_STEPS = ('<section class="steps wrap"><h2>Know which customers will wait, and why.</h2><div class="stepgrid">'
            '<div><b>One part</b><h3>A part with four names has one record</h3><p>Your parts list, purchasing records, inspection log and quotes call the same part by different names. LOVELEEDAY shows it as one part, so what is on hand, on order, on hold and promised to customers reads as one picture, with the source of each fact beside it.</p></div>'
            '<div><b>Across plants</b><h3>See who waits if a batch cannot be used</h3><p>The view shows the affected orders and customers together, across plants, with each supporting record available to check.</p></div>'
            '<div><b>Before anyone asks</b><h3>Flagged by the right person first</h3><p>Changes across ERP, purchasing and quality are watched together, and the ones that matter are put in front of the right person with the records behind them.</p></div>'
            '</div></section>')

for slug, cfg in PAGES.items():
    path = f'{ROOT}/public/site/industries/{slug}.html'
    s = open(path).read()
    # 1. restore the sample card inside the ip-band, keep the rotating JSON before it
    s = re.sub(r'(<section class="ip-band")(><div class="wrap">)(<script type="application/json" class="asks">.*?</script>)(</div></section>)',
               lambda m: m.group(1) + ' id="example"' + m.group(2) + m.group(3) + cfg['ip'] + m.group(4), s, count=1, flags=re.S)
    # 2. hero button
    s = s.replace('<a class="btn ghost" href="#demo">See the sample view</a>', '<a class="btn ghost" href="#example">See an example answer</a>')
    s = s.replace(' id="demo"', '')
    # 3. dark starting-question band: no fixed height
    s = s.replace('style="margin-top:72px;padding:88px 0;min-height:440px"', 'style="margin-top:72px;padding:72px 0"')
    # 4. step rows lose their numerals
    s = re.sub(r'<b>0[1-3] (Read|Match|Answer)</b>', r'<b>\1</b>', s)
    # 5. manufacturing: fold the blank sections
    if slug == 'manufacturing':
        s = re.sub(r'<section class="mf-one wrap">.*?</section>\s*<section class="mf-plants">.*?</section>\s*<section class="mf-feed wrap">.*?</section>', MF_STEPS, s, count=1, flags=re.S)
    # 6. long integration names
    s = s.replace('Google Workspace (Drive, Gmail, Calendar, Sheets)</b>', 'Google Workspace</b>').replace('Microsoft 365 (Graph: Outlook, SharePoint, OneDrive, Teams, Excel)</b>', 'Microsoft 365</b>')
    open(path, 'w').write(s)
    print(slug, 'ip' in s, s.count('class="ip"'), s.count('mf-one'))
