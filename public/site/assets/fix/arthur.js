// Page-scoped: swaps the shared pricing demo (index 5) for an energy-use example, without touching site.js.
(function () {
  var q = document.getElementById('brain-question');
  if (!q) return;
  var OLD = 'Review our pricing. Where are we losing margin?';
  var d = {
    ask: 'Which of our locations are using more energy than a year ago, and why?',
    qs: ['Which locations and meters are in scope, under any name?', 'How does each month compare with the same month last year?', 'What changed at the locations that went up?', 'Which bill or reading supports each figure?'],
    ans: 'A list of the locations that went up, the likely reason for each, and the bill behind every number.',
    ev: 'Illustrative energy review · meters, bills and locations'
  };
  function apply() {
    if (q.textContent !== OLD) return;
    q.textContent = d.ask;
    d.qs.forEach(function (t, i) { var p = document.querySelector('#branch-' + i + ' p'); if (p) p.textContent = t; });
    var r = document.getElementById('brain-result'), e = document.getElementById('brain-evidence');
    if (r) r.textContent = d.ans;
    if (e) e.textContent = d.ev;
  }
  new MutationObserver(apply).observe(q, { childList: true, characterData: true, subtree: true });
  apply();
})();
