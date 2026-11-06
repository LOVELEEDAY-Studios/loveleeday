#!/usr/bin/env node
/* one-brand-usecases.mjs  Writes the one-brand bodies of the four use-case pages (customer-data, operational-intelligence, pricing-margins,
   municipal-review) to /private/tmp/claude-501/ob/b/<page>.body. They share one frame; each supplies its own copy (word for word from the
   page it replaces) and its interactive widget markup, whose ids and classes are the ones site.js drives. */
import fs from 'node:fs';

const frame = (p) => `<body class="ob">
<!--ob:top--><!--/ob:top-->

<main id="main">
<section class="ob-lead ob-lead--photo">
  <div class="ob-wrap">
    <div>
      <p class="ob-meta" style="margin-bottom:18px"><a class="ob-link" href="/use-cases">Use cases</a> / ${p.name}</p>
      <h1 class="ob-h1">${p.h1}</h1>
      <p class="ob-lede">${p.lede}</p>
      <p class="ob-btns">${p.btns}</p>
    </div>
    <figure><img src="/site/assets/${p.img}" alt="${p.alt}" width="940" height="627" fetchpriority="high"></figure>
  </div>
</section>

<section class="ob-sec">
  <div class="ob-wrap ob-qa">
    <div data-ob-reveal><h2 class="ob-h2">${p.h2}</h2></div>
    <div data-ob-reveal>${p.intro}</div>
  </div>
</section>

${p.widget}

<section class="ob-sec">
  <div class="ob-wrap">
    <h2 class="ob-h2">${p.h3}</h2>
    <ul class="ob-rules" style="margin-top:clamp(28px,3.4vw,52px)" data-ob-reveal>
${p.steps.map(([b, s]) => `      <li><b>${b}</b><span>${s}</span></li>`).join('\n')}
    </ul>
  </div>
</section>

<section class="ob-sec ob-sec--white">
  <div class="ob-wrap ob-qa">
    <h2 class="ob-h2" data-ob-reveal>${p.h4}</h2>
    <p class="ob-lede" data-ob-reveal>${p.l4}</p>
  </div>
</section>

<section class="ob-close">
  <div class="ob-wrap">
    <p class="ob-close-l">${p.cta[0]}<em>${p.cta[1]}</em></p>
    <p class="ob-btns"><a class="ob-btn ob-btn--blue" href="${p.cta[3]}">${p.cta[2]}</a><a class="ob-btn ob-btn--ghost" href="/contact">Talk to us</a></p>
  </div>
</section>
</main>
<!--ob:bottom--><!--/ob:bottom-->

<script src="/site/assets/site.js?v=HASH" defer></script>
<script src="/site/assets/ob/ob.js?v=HASH" defer></script>
</body>
</html>
`;
const sec = (cls, id, head, lead, inner) => `<section class="ob-sec ${cls}" id="${id}">
  <div class="ob-wrap">
    <h2 class="ob-h2">${head}</h2>${lead ? `\n    <p class="ob-lede" style="margin-top:20px">${lead}</p>` : ''}
    <div style="margin-top:clamp(28px,3.4vw,52px)">
${inner}
    </div>
  </div>
</section>`;
const P = (s) => s.map((t, i) => `<p class="${i ? 'ob-p' : 'ob-lede'}"${i ? ' style="margin-top:24px"' : ''}>${t}</p>`).join('');

const pages = {};
pages['customer-data'] = {
  name: 'Customer data', h1: 'Many records.<br>A fuller customer picture.',
  lede: 'Connect names, identifiers, purchases, and interactions. Keep uncertainty visible while you build a more reliable view.',
  btns: '<a class="ob-btn ob-btn--blue" href="#customer-example">Explore the records</a>',
  img: 'customer-data.jpg', alt: 'Two people talking across a table in daylight',
  h2: 'Recognize the customer. Remember the context.',
  intro: P(['A customer can arrive through different channels with different spellings, account IDs, and contact information. Those records should contribute to the same understanding when the evidence supports a match.', 'Conflicting fields remain a review task. The goal is a useful customer picture with its sources intact.']),
  widget: sec('ob-sec--white', 'customer-example', 'One view. The history behind it.', '', `      <div class="customer-panel">
        <div class="panel-head"><h3>Customer reconciliation</h3><span class="sample-badge">Demonstration data</span></div>
        <div class="customer-layout">
          <div class="customer-records">
            <div class="source-record"><strong>Northline Studio</strong><p>CRM · CRM-104<br>Shared account ID: ACCT-204<br>Contact: hello@northline.example</p></div>
            <div class="source-record"><strong>Northline</strong><p>Orders · ORD-208<br>Shared account ID: ACCT-204<br>Contact: hello@northline.example</p></div>
            <div class="source-record"><strong>Northline Studio Ltd.</strong><p>Billing · BILL-316<br>Shared account ID: ACCT-204<br>Contact: accounts@northline.example</p></div>
          </div>
          <div class="customer-result">
            <span class="mini-label">Proposed customer view</span>
            <h3>Northline Studio</h3>
            <dl class="field-list">
              <div><dt>Identity</dt><dd>Shared account: ACCT-204<button data-evidence-toggle="identity-source" aria-expanded="false" aria-controls="identity-source">View match evidence &#8599;</button></dd></div>
              <div><dt>Aliases</dt><dd>Northline<br>Northline Studio Ltd.</dd></div>
              <div><dt>Contact</dt><dd>Two addresses preserved<button data-evidence-toggle="contact-source" aria-expanded="false" aria-controls="contact-source">Review contact sources &#8599;</button></dd></div>
              <div><dt>Next step</dt><dd>Confirm the role of each contact address before selecting a primary contact.</dd></div>
            </dl>
            <p class="field-evidence" id="identity-source" hidden>CRM-104, ORD-208, and BILL-316 share account identifier ACCT-204 in this sample. Similar names alone are not the match evidence.</p>
            <p class="field-evidence" id="contact-source" hidden>CRM and Orders hold hello@northline.example. Billing holds accounts@northline.example. Both are retained; the sample does not assume one replaces the other.</p>
          </div>
        </div>
      </div>
      <p class="caption">Fictional records demonstrate reconciliation and source inspection. No customer records are uploaded or changed.</p>`),
  h3: 'Connect what belongs. Flag what needs care.',
  steps: [['Normalize the records', 'Bring source fields into a consistent structure while preserving original values and identifiers.'], ['Resolve the identity', 'Link records using supporting evidence. Separate confirmed matches from candidates that need review.'], ['Review data quality', 'Surface missing, stale, or conflicting information and retain a trail back to the original record.']],
  h4: 'A customer is a person before they are a record.', l4: 'Four names for one company become one object, and the person on the other end stays recognisable.',
  cta: ['Start with your customer question.', 'Define the sources, quality issues, and customer view you need.', 'Create a data brief', '/studio?use=Customer%20data#project-brief'],
};
pages['operational-intelligence'] = {
  name: 'Operational intelligence', h1: 'See the connections.<br>Find the next question.',
  lede: 'Bring people, companies, items, documents, and places into a shared context. Follow a change to the decisions it could affect.',
  btns: '<a class="ob-btn ob-btn--blue" href="/studio?use=Connected%20intelligence#project-brief">Create an intelligence brief</a>',
  img: 'operational-intelligence.jpg', alt: 'A chef working the pass in a busy kitchen',
  h2: 'The answer crosses more than one team.',
  intro: P(['A supplier change can affect a catalogue, a location, and a forecast. A recurring service issue can connect a property, a contractor, and a spending pattern.', 'Operational intelligence begins by defining those relationships. It gives a cross-system question an evidence trail and a scope someone can review.']),
  widget: sec('ob-sec--white', 'change-example', 'One change. A wider field of view.', '', `      <ul class="ob-rules" data-ob-reveal>
        <li><b>What changed: a supplier cost changes.</b><span>A new cost record arrives, with its source and effective date.</span></li>
        <li><b>Context: related items come into view.</b><span>The supplier connects to item records and relevant selling prices.</span></li>
        <li><b>Attention: a margin question surfaces.</b><span>A defined condition highlights the items that now need review.</span></li>
      </ul>
      <p class="ob-note">Illustrative relationship flow. Actual coverage depends on the connected records.</p>`),
  h3: 'Start focused. Connect what is relevant.',
  steps: [['Name the question', 'Define the decision, the owner, and what information would make the answer useful.'], ['Map the subjects', 'Connect the companies, locations, items, and records involved. Preserve source and organizational context.'], ['Watch the assumptions', 'Describe changes that should bring the decision back into focus, with evidence for the person reviewing it.']],
  h4: 'Operations do not wait for the monthly report.', l4: 'Standing conditions watch the work while it is happening and speak up when an assumption shifts.',
  cta: ['What do you keep piecing together?', 'That question is a useful place to start.', 'Create an intelligence brief', '/studio?use=Connected%20intelligence#project-brief'],
};
pages['pricing-margins'] = {
  name: 'Pricing &amp; margins', h1: 'See what sells.<br>Know what it leaves.',
  lede: 'Review actual prices alongside item costs, discounts, and variable fees. Find where the economics need a closer look.',
  btns: '<a class="ob-btn ob-btn--blue" href="#margin-calculator">Explore the numbers</a>',
  img: 'pricing-margins.jpg', alt: 'A market stall stacked with produce in the evening',
  h2: 'Follow the money. Item by item.',
  intro: P(['A listed price can look healthy while discounts and delivery costs tell a different story. Connect the price a customer actually pays with the costs attached to that sale.', 'A margin review makes those assumptions explicit. It identifies prices to investigate and keeps proposed changes tied to their inputs.']),
  widget: sec('ob-sec--white', 'margin-calculator', 'See the margin move.', 'Change the inputs to explore a single item’s contribution margin. Amounts use dollars for this example.', `      <div class="calculator">
        <div class="panel-head"><h3>Item economics</h3><span class="sample-badge">Interactive example</span></div>
        <div class="calculator-grid">
          <form id="margin-form" class="calculator-fields">
            <div class="field"><label for="sale-price">Listed price ($)</label><input id="sale-price" name="price" type="number" min="0" step="0.01" value="100" required></div>
            <div class="field"><label for="item-cost">Item cost ($)</label><input id="item-cost" name="cost" type="number" min="0" step="0.01" value="55" required></div>
            <div class="field"><label for="discount">Discount (%)</label><input id="discount" name="discount" type="number" min="0" max="100" step="0.1" value="10" required></div>
            <div class="field"><label for="variable-fees">Other variable costs ($/unit)</label><input id="variable-fees" name="fees" type="number" min="0" step="0.01" value="5" required></div>
            <div class="field full"><label for="target-margin">Target contribution margin (%)</label><input id="target-margin" name="target" type="number" min="0" max="99.9" step="0.1" value="35" required></div>
          </form>
          <div class="calc-result" aria-live="polite">
            <span class="mini-label">Contribution margin</span>
            <div class="metric" id="margin-value">33.3%</div>
            <span class="metric-label">of realized revenue</span>
            <dl>
              <div><dt>Realized revenue / unit</dt><dd id="realized-value">$90.00</dd></div>
              <div><dt>Contribution / unit</dt><dd id="profit-value">$30.00</dd></div>
              <div><dt>Listed price for target</dt><dd id="target-price">$102.57</dd></div>
            </dl>
            <p class="calc-message" id="margin-message">Below the 35% target at these inputs.</p>
          </div>
        </div>
        <p class="calc-footnote">Realized revenue = listed price × (1 − discount). Contribution = realized revenue − item cost − other variable costs. The target price keeps the same discount. This example excludes fixed overhead and taxes; add per-unit costs relevant to your review.</p>
      </div>`),
  h3: 'From one item. To a reviewable plan.',
  steps: [['Reconcile the inputs', 'Match catalogue items to cost records, selling prices, discounts, and relevant variable costs.'], ['Flag the exceptions', 'Identify losses, margins below the chosen target, and missing or outdated cost observations.'], ['Propose the changes', 'Prepare item-level changes with assumptions, the records behind them, and an opportunity to review before anything is written back.']],
  h4: 'Margin is not a spreadsheet. It is what the day earns.', l4: 'Per-unit contribution, computed line by line, against what the item actually costs you.',
  cta: ['Bring the catalogue.', 'Start with the costs, prices, and margin question you want to resolve.', 'Create a pricing brief', '/studio?use=Pricing%20and%20margins#project-brief'],
};
const rec = (st, name, code, cls, label, tag, note) => `        <article class="record-row" data-record-status="${st}">
          <div><h4>${name}</h4><small>${code}</small></div>
          <div><div class="record-status ${cls}">${label}</div><small>${tag}</small></div>
          <details><summary>Review notes</summary><p>${note}</p></details>
        </article>`;
pages['municipal-review'] = {
  name: 'Municipal review', h1: 'The whole codebook.<br>A clearer picture.',
  lede: 'Review the ordinances and laws on a municipality’s books. Organize the record, trace amendments, and flag questions for review.',
  btns: '<a class="ob-btn ob-btn--blue" href="#document-register">Explore the register</a><a class="ob-btn ob-btn--ink" href="/studio?use=Municipal%20review#project-brief">Shape a review</a>',
  img: 'municipal-review.jpg', alt: 'A classical civic building among trees',
  h2: 'What applies? What changed?',
  intro: P(['A review needs a defined jurisdiction, a collection of source documents, and a record of what is missing. Start with the code, then connect amendments, repeals, and relevant supporting materials.', 'The useful output is a cited inventory: a way to see the history of a provision and the questions that require interpretation.']),
  widget: sec('ob-sec--white', 'document-register', 'A register you can follow.', 'Filter the demonstration records, then open the review notes.', `      <div class="register-panel">
        <div class="panel-head"><h3>Municipal document register</h3><span class="sample-badge">Fictional sample</span></div>
        <div class="filter-bar" role="group" aria-label="Filter review records">
          <button data-record-filter="all" aria-pressed="true">All records</button>
          <button data-record-filter="review" aria-pressed="false">Needs review</button>
          <button data-record-filter="current" aria-pressed="false">Current in sample</button>
          <button data-record-filter="superseded" aria-pressed="false">Superseded in sample</button>
        </div>
${rec('current', 'Noise standards', 'DEMO-ORD-001', '', 'Current in sample', 'Base record', 'This fictional record represents a provision with a source reference. A real review would also require the actual text, effective date, jurisdiction, and amendment history.')}
${rec('review', 'Public-space permits', 'DEMO-ORD-002', 'review', 'Cross-reference to review', 'Linked amendment', 'The sample illustrates a cross-reference that needs checking against an amendment. It is a review prompt, not a legal conclusion.')}
${rec('superseded', 'Permit fee schedule', 'DEMO-ORD-003', 'old', 'Superseded in sample', 'Retained history', 'The prior version stays in the register, connected to the record that replaced it. Its past validity should not be confused with present applicability.')}
${rec('review', 'Records retention', 'DEMO-ORD-004', 'review', 'Source gap to review', 'Missing attachment', 'The sample represents a referenced attachment that was not included in the document set. Record the gap before claiming complete coverage.')}
        <p class="record-count" id="record-count" aria-live="polite">4 demonstration records shown</p>
      </div>
      <p class="caption">Fictional records for interaction only. No municipality or actual ordinance is represented.</p>`),
  h3: 'Collect. Reconcile. Prepare the next decision.',
  steps: [['Establish coverage', 'List the document sources, versions, jurisdiction, and known gaps in the collection.'], ['Follow the changes', 'Connect amendments, repeals, superseded provisions, and cross-references to their supporting documents.'], ['Prepare the review', 'Produce a cited register of issues, with source passages and questions for the responsible reviewer.']],
  h4: 'Public work deserves a record that holds up.', l4: 'Every document, every decision, and the trail back to the source that supports it.',
  cta: ['Bring the codebook.', 'Start with the jurisdiction, source collection, and scope of review.', 'Create a review brief', '/studio?use=Municipal%20review#project-brief'],
};
for (const [k, v] of Object.entries(pages)) fs.writeFileSync(`/private/tmp/claude-501/ob/b/${k}.body`, frame(v));
