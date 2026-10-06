(function () {
  // Memory panel: switch "as known at" date
  document.querySelectorAll('[data-asknown]').forEach(function (root) {
    var btns = root.querySelectorAll('button[data-d]');
    var marker = root.querySelector('.cx-marker-k');
    var marker2 = root.querySelector('.cx-marker-t');
    var val = root.querySelector('[data-val]');
    var lab = root.querySelector('[data-lab]');
    var note = root.querySelector('[data-note]');
    var data = {
      a: { k: '34%', t: '24%', v: '$60.00', l: 'as known at 12 Aug', n: 'The change had not been recorded yet.' },
      b: { k: '78%', t: '78%', v: '$72.00', l: 'as known at 03 Sep', n: 'The correction is on record and keeps its own date.' }
    };
    function set(k) {
      var d = data[k];
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.d === k ? 'true' : 'false'); });
      if (marker) marker.style.left = d.k;
      if (marker2) marker2.style.left = d.t;
      if (val) val.textContent = d.v;
      if (lab) lab.textContent = d.l;
      if (note) note.textContent = d.n;
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { set(b.dataset.d); }); });
    set('b');
  });

  // Principles rail highlight
  var links = document.querySelectorAll('.cx-rail a');
  if (links.length && 'IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('on'); });
          if (map[e.target.id]) map[e.target.id].classList.add('on');
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }
})();
