// Page-scoped: swaps the shared pricing demo (index 5) for a contract-renewal example, without touching site.js.
(function () {
  var q = document.getElementById('brain-question');
  if (!q) return;
  var OLD = 'Review our pricing. Where are we losing margin?';
  var d = {
    ask: 'Which contracts renew next quarter, and who owns them?',
    qs: ['Which agreements are in scope, under any name?', 'When does each one renew or lapse?', 'Who owns each, and what changed since?', 'Which clause and source support each date?'],
    ans: 'A renewal list with owners, dates and source clauses, and any contract with no owner flagged.',
    ev: 'Illustrative contract review · agreements, owners and dates'
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
