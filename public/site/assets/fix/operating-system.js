// Page-scoped: replaces the pricing question in this page's example set with an inventory one. Runs after site.js handlers.
(function () {
  var d = {
    q: 'Where do our records of this item disagree?',
    a: '<strong>Two systems, two answers.</strong><br>The warehouse system shows the item in stock. The order system shows it out of stock. Both are kept side by side, with the time each was last updated.',
    trace: '<strong>Illustrative inventory example</strong><br>Warehouse system: in stock · updated this morning<br>Order system: out of stock · updated yesterday'
  };
  var btn = document.getElementById('q1');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var q = document.getElementById('question'), a = document.getElementById('answer'), t = document.getElementById('trace');
    if (q) q.textContent = d.q;
    if (a) a.innerHTML = d.a;
    if (t) t.innerHTML = d.trace;
  });
})();
