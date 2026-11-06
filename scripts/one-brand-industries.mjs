#!/usr/bin/env node
/* one-brand-industries.mjs  Writes the one-brand body of industries.html to /private/tmp/claude-501/ob/b/industries.body.
   The nine industries are data so the nine scenes share one markup; copy and photos are the page's own. */
import fs from 'node:fs';
const I = [
  ['hospitality', 'Hospitality &amp; experiences', 'Give every location a clearer picture.', 'Connect purchasing, guest information, menus, and venue operations around the decisions that shape a good day.', 'Where are supplier changes putting menu margins under pressure?', '/pricing-margins', 'Review item economics', 'industry-hospitality.jpg', 'A dining room under a timber ceiling, tables set for evening service'],
  ['retail', 'Retail &amp; commerce', 'Follow the product and the customer.', 'Bring catalogue records, actual prices, costs, and customer interactions into a view that crosses channels.', 'Which products lose margin after discounts and selling costs?', '/customer-data', 'Connect customer context', 'industry-retail.jpg', 'Two shopkeepers in aprons working the floor of a small grocery'],
  ['manufacturing', 'Manufacturing &amp; distribution', 'See the relationships behind the supply chain.', 'Connect items, suppliers, cost changes, and operational records without losing where they came from.', 'Which items are affected when a supplier changes its price?', '/operational-intelligence', 'Explore operational intelligence', 'industry-manufacturing.jpg', 'A worker walking an aisle of racked stock in a warehouse'],
  ['professional-services', 'Professional services', 'Keep the context of the engagement.', 'Bring client identities, project records, correspondence, and billing information around one shared subject.', 'What has changed across this client’s active engagements?', '/customer-data', 'Reconcile client records', 'industry-professional-services.jpg', 'Two people talking over paperwork at a table in daylight'],
  ['property', 'Property &amp; facilities', 'Understand the work around each place.', 'Connect properties, service records, suppliers, and operating costs so an issue can be understood in context.', 'Which recurring service issues are driving avoidable costs?', '/operational-intelligence', 'Connect operational records', 'industry-property.jpg', 'A residential apartment block on a quiet street in the evening'],
  ['government', 'Local government', 'Make the public record easier to navigate.', 'Organize ordinances, amendments, documents, and what is missing around a defined review question.', 'What is on the books, what changed, and what needs review?', '/municipal-review', 'Explore municipal review', 'industry-government.jpg', 'The chamber of a civic building, empty between sessions'],
  ['schools', 'Schools &amp; charters', 'Know what is due and what proves it.', 'Bring enrollment, finance, staffing and board records into one reviewable picture, from a single charter to a network or district.', 'What is due this quarter, and which records prove it?', '/architecture#verification', 'See how verification works', 'industry-schools.jpg', 'An empty classroom with desks and a whiteboard'],
  ['nonprofit', 'Nonprofits &amp; community organizations', 'Keep the mission connected to the evidence.', 'Bring program records, spending, reporting requirements, and organizational context into a reviewable picture.', 'Can we back up every number in this grant report?', '/architecture#verification', 'See how verification works', 'industry-nonprofit.jpg', 'Volunteers loading boxes into the back of a van'],
  ['portfolios', 'Groups &amp; portfolios', 'See across companies. Keep their context.', 'Connect selected records across a group while preserving which company, time period, and source each fact belongs to.', 'Which suppliers do several of our companies use, and could we buy better together?', '/operational-intelligence', 'Explore cross-system questions', 'industry-portfolios.jpg', 'A city skyline at sunset, several districts in one view'],
];
const scenes = I.map(([id, name, h, p, q, href, cta, img, alt], i) => `<section class="ob-sec ob-scene${i % 2 ? ' ob-scene--flip' : ''}${i % 2 ? '' : ' ob-sec--white'}" id="${id}">
  <div class="ob-wrap ob-scene-in">
    <figure class="ob-scene-ph" style="--ar:3/2"><img src="/site/assets/${img}" alt="${alt}" width="1880" height="1253" loading="lazy"></figure>
    <div class="ob-scene-tx" data-ob-reveal>
      <p class="ob-meta" style="margin-bottom:14px">${name}</p>
      <h2 class="ob-h2 ob-h2--m">${h}</h2>
      <p class="ob-lede">${p}</p>
      <p class="ob-quiet" style="margin-top:24px;font-size:clamp(18px,1.4vw,22px);line-height:1.35"><span style="font-family:var(--sans);font-style:normal;font-weight:600;font-size:14px;display:block;margin-bottom:6px">A question to begin with</span>${q}</p>
      <p class="ob-btns" style="margin-top:24px"><a class="ob-btn ob-btn--ink" href="${href}">${cta}</a></p>
    </div>
  </div>
</section>`).join('\n\n');
const chips = I.map(([id, name]) => `<a class="chip" href="#${id}" style="min-height:44px;padding:0 18px;border-radius:22px">${name}</a>`).join('');
const body = `<body class="ob">
<!--ob:top--><!--/ob:top-->

<main id="main">
<section class="ob-lead ob-lead--photo">
  <div class="ob-wrap">
    <div>
      <h1 class="ob-h1">Different worlds.<br>The same need for clarity.</h1>
      <p class="ob-lede">One intelligence architecture can be shaped around different records, decisions, and ways of working. Start with your industry. Build around your question.</p>
      <p class="ob-meta" style="margin:28px 0 12px">Explore a starting point</p>
      <p class="ob-btns" style="gap:10px">${chips}</p>
    </div>
    <figure><img src="/site/assets/industries.jpg" alt="A server carrying plates through a warm dining room" width="940" height="627" fetchpriority="high"></figure>
  </div>
</section>

${scenes}

<section class="ob-sec">
  <div class="ob-wrap ob-qa">
    <h2 class="ob-h2" data-ob-reveal>The list is a beginning. Your question sets the scope.</h2>
    <div data-ob-reveal>
      <p class="ob-lede">These are possible applications of the architecture, rather than a list of customer deployments. The records available and the decision you need to make determine what a project can support.</p>
      <p class="ob-p" style="margin-top:24px">For a new industry, begin with the subjects you track, the systems they appear in, and the question you keep having to assemble by hand.</p>
    </div>
  </div>
</section>

<section class="ob-sec ob-sec--white">
  <div class="ob-wrap ob-qa">
    <h2 class="ob-h2" data-ob-reveal>One architecture, and the room decides what it becomes.</h2>
    <p class="ob-lede" data-ob-reveal>A municipality, a hospitality group, a growing retailer, a portfolio of companies. The same questions underneath.</p>
  </div>
</section>

<section class="ob-close">
  <div class="ob-wrap">
    <p class="ob-close-l">Bring us your world.<em>Start with the question that matters to your team.</em></p>
    <p class="ob-btns"><a class="ob-btn ob-btn--blue" href="/studio?use=Connected%20intelligence#project-brief">Define your project</a><a class="ob-btn ob-btn--ghost" href="/contact">Talk to us</a></p>
  </div>
</section>
</main>
<!--ob:bottom--><!--/ob:bottom-->

<script src="/site/assets/ob/ob.js?v=HASH" defer></script>
</body>
</html>
`;
fs.writeFileSync('/private/tmp/claude-501/ob/b/industries.body', body);
