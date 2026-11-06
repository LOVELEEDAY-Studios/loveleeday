#!/usr/bin/env node
/* one-brand-layers.mjs  Writes the body of architecture.html for the one-brand kit to /private/tmp/claude-501/ob/b/architecture.body.
   The five layers are data here so their markup stays identical; copy is the page's own, word for word. */
import fs from 'node:fs';
const L = [
  ['identity', 'Identity', 'Different names.<br>One subject.', ['A company might be a familiar name in a conversation, a customer ID in a payment system, and a supplier record in a ledger. The ontology connects those references to a single subject.', 'Connect the names without losing the source identifiers. Keep uncertain matches available for review.'], 'HES → Harbor Equipment Services → a canonical company record.'],
  ['lineage', 'Lineage', 'Every fact.<br>A way back.', ['An observation carries the source system and record that support it. That trail gives someone reviewing an answer a place to begin.', 'A missing source is a gap in the evidence. It should remain visible instead of being hidden behind confident wording.'], 'Observation → source system → source reference.'],
  ['memory', 'Memory', 'What was true.<br>What was known.', ['The bitemporal record separates when a fact held in the world from when it became known to the system. That distinction preserves the context of a past decision.', 'A later correction adds information. It does not rewrite what someone could have known earlier.'], 'The supplied payment example keeps the earlier $902.58 balance and the later $0.00 balance.'],
  ['verification', 'Verification', 'A claim needs<br>something behind it.', ['The verifier checks figures against recorded properties. An unsupported figure stays out of the answer until evidence supports it.', 'A polished sentence and a supported statement are separate things. Verification connects the statement to a named subject and recorded value.'], 'The supplied “4,000 objects resolved” claim is flagged as unsupported.'],
  ['awareness', 'Awareness', 'When facts change,<br>attention follows.', ['Standing conditions describe changes that matter to a decision. A new observation can bring an earlier assumption back into focus.', 'Define what deserves attention, which evidence should accompany it, and who reviews the next step.'], 'Example condition: an item’s cost rises above its realized selling price.'],
];
const rows = L.map(([id, name, h, ps, ex], i) => `<section class="ob-sec${i % 2 ? '' : ' ob-sec--white'}" id="${id}">
  <div class="ob-wrap ob-qa">
    <div data-ob-reveal><p class="ob-meta" style="margin-bottom:14px">${name}</p><h2 class="ob-h2">${h}</h2></div>
    <div data-ob-reveal>
      <p class="ob-lede">${ps[0]}</p>
      <p class="ob-p" style="margin-top:20px">${ps[1]}</p>
      <p class="ob-quiet" style="margin-top:24px;font-size:clamp(18px,1.4vw,22px);line-height:1.35"><span style="font-family:var(--sans);font-style:normal;font-weight:600;font-size:14px;display:block;margin-bottom:6px">In practice</span>${ex}</p>
    </div>
  </div>
</section>`).join('\n\n');
const body = `<body class="ob">
<!--ob:top--><!--/ob:top-->

<main id="main">
<section class="ob-lead ob-lead--photo">
  <div class="ob-wrap">
    <div>
      <h1 class="ob-h1">Intelligence is designed.<br>Trust is built in.</h1>
      <p class="ob-lede">Five connected layers give information identity, history, provenance, and a standard of evidence.</p>
      <p class="ob-btns"><a class="ob-btn ob-btn--blue" href="#identity">Explore the layers</a></p>
    </div>
    <figure><img src="/site/assets/architecture.jpg" alt="A timber and glass roof opening to the sky" width="940" height="627" fetchpriority="high"></figure>
  </div>
</section>

${rows}

<section class="ob-sec">
  <div class="ob-wrap ob-qa">
    <h2 class="ob-h2" data-ob-reveal>Structure you can see through is structure you can trust.</h2>
    <p class="ob-lede" data-ob-reveal>Five connected layers, built so that a value is recorded with its source and its dates, not merely described in a diagram.</p>
  </div>
</section>

<section class="ob-close">
  <div class="ob-wrap">
    <p class="ob-close-l">Put the layers to work.<em>See how the architecture meets a real operational question.</em></p>
    <p class="ob-btns"><a class="ob-btn ob-btn--blue" href="/use-cases">Explore use cases</a><a class="ob-btn ob-btn--ghost" href="/contact">Talk to us</a></p>
  </div>
</section>
</main>
<!--ob:bottom--><!--/ob:bottom-->

<script src="/site/assets/site.js?v=HASH" defer></script>
<script src="/site/assets/ob/ob.js?v=HASH" defer></script>
</body>
</html>
`;
fs.writeFileSync('/private/tmp/claude-501/ob/b/architecture.body', body);
