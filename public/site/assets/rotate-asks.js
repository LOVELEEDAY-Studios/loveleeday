/* Rotating "What you would ask" examples on the industry pages.
   A <script type="application/json" class="asks"> inside a section or card lists extra examples; the markup already on
   the page is always the first one, so the page reads correctly without JavaScript. Each example can carry:
     q      the question            -> .eq span, .ip-q (after its label), .qq
     a      [title, text]           -> .ix-ex b and .ix-ex > span (the card's "What Arthur tells you")
     title  panel title             -> .ip-t
     rows   [[tone, name, text, source], ...] with tone hot|wt|ok -> the panel's list
   Rotates every 6s, pauses on hover or focus, dots jump to an example and stop the rotation. Reduced motion: no rotation. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = document.createElement('style');
  css.textContent = '.ask-dots{display:flex;gap:6px;margin:10px 0 2px}.ask-dots button{width:22px;height:4px;padding:0;border:0;border-radius:2px;background:#c9ccd3;cursor:pointer}.ask-dots button[aria-current=true]{background:#0066cc}.ask-dots button:focus-visible{outline:2px solid #0066cc;outline-offset:3px}';
  document.head.appendChild(css);
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  document.querySelectorAll('script.asks').forEach(function (tag) {
    var box = tag.closest('li, section');
    if (!box) return;
    var extra; try { extra = JSON.parse(tag.textContent); } catch (e) { return; }
    if (!extra.length) return;
    var qEls = box.querySelectorAll('.eq span, .ip-q, .qq');
    var aTitle = box.querySelector('.ix-ex b'), aText = box.querySelector('.ix-ex > span');
    var pTitle = box.querySelector('.ip-t'), pList = box.querySelector('.ip ul');
    var label = function (el) { var b = el.querySelector('b'); return b ? b.outerHTML : ''; };
    var first = {
      q: qEls[0] ? qEls[0].textContent.replace(qEls[0].querySelector('b') ? qEls[0].querySelector('b').textContent : '', '') : '',
      aHtml: aTitle ? [aTitle.innerHTML, aText.innerHTML] : null,
      title: pTitle ? pTitle.textContent : null,
      listHtml: pList ? pList.innerHTML : null
    };
    var items = [first].concat(extra), i = 0, timer = null, paused = false;
    var fadeEls = [].slice.call(qEls).concat([box.querySelector('.ix-ex'), box.querySelector('.ip')]).filter(Boolean);
    fadeEls.forEach(function (el) { el.style.transition = 'opacity .35s ease'; });
    function paint(n) {
      var it = items[n];
      qEls.forEach(function (el) { el.innerHTML = (el.classList.contains('ip-q') ? label(el) : '') + esc(it.q); });
      if (aTitle) { if (it.aHtml) { aTitle.innerHTML = it.aHtml[0]; aText.innerHTML = it.aHtml[1]; } else if (it.a) { aTitle.textContent = it.a[0]; aText.textContent = it.a[1]; } }
      if (pTitle && (it.title || it.listHtml)) pTitle.textContent = it.title || pTitle.textContent;
      if (pList) {
        if (it.listHtml) pList.innerHTML = it.listHtml;
        else if (it.rows) pList.innerHTML = it.rows.map(function (r) { return '<li class="' + esc(r[0]) + '"><b>' + esc(r[1]) + '</b><span>' + esc(r[2]) + '</span><em>' + esc(r[3]) + '</em></li>'; }).join('');
      }
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === n ? 'true' : 'false'); });
    }
    function go(n) {
      fadeEls.forEach(function (el) { el.style.opacity = '0'; });
      setTimeout(function () { i = n; paint(i); fadeEls.forEach(function (el) { el.style.opacity = '1'; }); }, 350);
    }
    var nav = document.createElement('div');
    nav.className = 'ask-dots';
    nav.setAttribute('aria-label', 'More example questions');
    var dots = items.map(function (_, k) {
      var d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', 'Example question ' + (k + 1) + ' of ' + items.length);
      d.addEventListener('click', function () { stop(); if (k !== i) go(k); });
      nav.appendChild(d);
      return d;
    });
    var anchor = box.querySelector('.eq') || box.querySelector('.ip-q');
    if (anchor) anchor.insertAdjacentElement('afterend', nav);
    paint(0);
    function stop() { clearInterval(timer); timer = null; }
    if (reduce) return;
    timer = setInterval(function () { if (!paused) go((i + 1) % items.length); }, 6000);
    box.addEventListener('mouseenter', function () { paused = true; });
    box.addEventListener('mouseleave', function () { paused = false; });
    box.addEventListener('focusin', function () { paused = true; });
    box.addEventListener('focusout', function () { paused = false; });
  });
})();
