/* Mounts the 3D brain (brain.js) wherever a page has #brain, and walks it through
   plain questions from different kinds of organizations. A page picks which
   questions it cycles with data-brain-set on <body>, so no two pages repeat. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  if (!$('brain') || !window.Brain3D) return;
  var demos = [
    { ask: 'Which families still owe a form before the field trip?',
      questions: ['Which students are on the trip list?', 'Whose forms came back signed?', 'Which records use a different name for the same student?', 'Where did each answer come from?'],
      answer: 'Eleven families still owe a form. Four of them were already reminded twice.',
      evidence: 'A charter school, from its enrollment and forms systems. Example data.' },
    { ask: 'If this part ships late, which customers wait?',
      questions: ['Which open orders need the part?', 'Which customers placed them?', 'Did the latest batch pass inspection?', 'What did the supplier say last?'],
      answer: 'Fourteen orders wait on it, and the latest batch failed inspection. Call those customers first.',
      evidence: 'A manufacturer, from open orders, inspection records and supplier email. Example data.' },
    { ask: 'Which buildings cost the most to keep up this year?',
      questions: ['Which work orders belong to which building?', 'Which vendor invoices match them?', 'Which repairs keep coming back?', 'What changed from last year?'],
      answer: 'Two buildings account for most of the spend. The same roof leak was fixed three times.',
      evidence: 'A property manager, from work orders and vendor invoices. Example data.' },
    { ask: 'Is this the same customer, or three different ones?',
      questions: ['Which names and emails match?', 'Which purchases belong to each record?', 'Which support tickets mention them?', 'Which record is the most recent?'],
      answer: 'One customer, filed three ways. Their open ticket and late invoice belong together.',
      evidence: 'A retailer, from its store, billing and support systems. Example data.' },
    { ask: 'Which grants report next month, and who owns each one?',
      questions: ['Which awards are active?', 'What does each agreement require?', 'Who is named as the owner?', 'Which reports are already drafted?'],
      answer: 'Three reports are due next month. One has no owner named yet.',
      evidence: 'A nonprofit, from grant agreements and its shared drive. Example data.' },
    { ask: 'Which guests arriving this weekend asked for something special?',
      questions: ['Who arrives between Friday and Sunday?', 'Which bookings carry a note or request?', 'Which guests are filed under two different names?', 'Which requests has the front desk already handled?'],
      answer: 'Nine arrivals have requests. Three have not reached the front desk, and two belong to returning guests filed under an old name.',
      evidence: 'A small hotel, from its bookings, messages and guest notes. Example data.' },
    { ask: 'Which permits run out before the council meets again?',
      questions: ['Which permits end this quarter?', 'Which were already renewed?', 'Which applicants appear under more than one spelling?', 'When is the next council meeting?'],
      answer: 'Seven permits lapse before the next meeting. Two were renewed under a different spelling, so five need a notice this week.',
      evidence: 'A city clerk’s office, from permit records and the meeting calendar. Example data.' },
    { ask: 'Which clients have work we have not billed for in two months?',
      questions: ['Which projects logged hours this quarter?', 'Which of those hours went on an invoice?', 'Is each client one account or several?', 'Who owns each project?'],
      answer: 'Four clients carry unbilled work older than sixty days. One of them is filed under two names, which hid the total.',
      evidence: 'A consulting firm, from time tracking and invoices. Example data.' }
  ];
  var set = (document.body.dataset.brainSet || '').split(',').filter(function (x) { return x !== '' && demos[+x]; }).map(Number);
  var active = set.length ? set.map(function (i) { return demos[i]; }) : demos;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var paused = reduced, inView = true, lastBeat = -1, lastStage = -1;
  function update(k, t) {
    var n = active.length, ki = isFinite(+k) ? Math.trunc(+k) : 0, i = ((ki % n) + n) % n;
    var stage = reduced ? 5 : t >= 6 ? 5 : t >= 4.5 ? 4 : t >= 3.4 ? 3 : t >= 2.3 ? 2 : t >= 1.2 ? 1 : 0, d = active[i];
    if (i !== lastBeat) {
      $('brain-question').textContent = d.ask;
      d.questions.forEach(function (q, j) { var b = $('branch-' + j); if (b) b.querySelector('p').textContent = q; });
      $('brain-result').textContent = d.answer;
      $('brain-evidence').textContent = d.evidence;
      lastBeat = i; lastStage = -1;
    }
    if (stage !== lastStage) {
      d.questions.forEach(function (q, j) { var b = $('branch-' + j); if (b) b.classList.toggle('visible', stage > j); });
      $('brain-answer').classList.toggle('visible', stage === 5);
      lastStage = stage;
    }
  }
  var brain = Brain3D.mount($('brain'), { style: 'lobe', labels: false, override: { oscillate: false }, onFrame: update });
  var motion = $('motion');
  function sync() {
    if (paused || !inView) brain.stop(); else brain.start();
    if (motion) { motion.textContent = paused ? 'Play' : 'Pause'; motion.setAttribute('aria-pressed', String(paused)); }
  }
  if (motion) { motion.addEventListener('click', function () { paused = !paused; sync(); }); if (reduced) motion.hidden = true; }
  if ($('brain-next')) $('brain-next').addEventListener('click', function () { brain.next(); if (paused) update(lastBeat + 1, 7); });
  if (window.IntersectionObserver) new IntersectionObserver(function (e) { inView = e[0].isIntersecting; sync(); }, { threshold: .05 }).observe($('brain'));
  sync();
  update(0, reduced ? 7 : 0);
})();
