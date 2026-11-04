(function () {
  'use strict';
  var doc = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (x, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a === undefined ? 0 : a, x)); };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a)); };
  var E = function (t) { return t * t * (3 - 2 * t); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  var params = new URLSearchParams(location.search);
  var STATIC = params.has('static') || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (STATIC) doc.classList.add('static');

  /* ---------- nav ---------- */
  var nav = $('#nav'), toggle = $('.nav-toggle'), menu = $('#nav-menu');
  toggle.addEventListener('click', function () {
    var o = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(o));
    menu.classList.toggle('open', o);
    toggle.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
    if (o) nav.classList.add('light'); else navTheme();
  });
  $$('.nav-item').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) $$('.nav-item').forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.nav-item')) $$('.nav-item').forEach(function (o) { o.open = false; }); });

  /* ---------- elements ---------- */
  var seq = $('#seq'), stage = $('#stage'), canvas = $('#brain'), still = $('#still');
  var heroCopy = $('#heroCopy'), hint = $('#hint');
  var qEl = $('#q'), qline = $('#qline'), capEl = $('#cap'), bloom = $('#bloom'), ans = $('#ans'), links = $('#links');
  var glow = $('.glow'), chips = $$('.chip'), srcs = $$('.src');
  var W = innerWidth, H = innerHeight, mobile = W < 700;

  /* split the big question into words for the scrubbed reveal */
  var words = [];
  qEl.innerHTML = qEl.textContent.split(' ').map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
  words = $$('.w', qEl);

  /* ---------- brain ---------- */
  var V = { zoom: 1, cy: 0, front: null, spin: 0, maxd: 20, edgeA: 0.62, nodeA: 0.5, add: true };
  var HZ = function () { return mobile ? 1.5 : 0.8; }, HCY = function () { return mobile ? 0.1 : 0.03; };
  var brain = null;
  function sizeStill() {
    var scale = Math.min(W, H * 1.35) * 0.73;
    var z = HZ();
    still.style.width = Math.round(0.98 * scale * z / 0.557) + 'px';
    still.style.top = Math.round((0.5 + HCY()) * H) + 'px';
  }
  function mountBrain() {
    try {
      var ok = canvas.getContext && canvas.getContext('2d');
      if (!ok || !window.Brain3D) throw new Error('no canvas');
      brain = Brain3D.mount(canvas, { style: 'lobe', labels: false, override: { oscillate: false, nodeSize: 2.7, edgeWidth: 1.25, fog: 0.25, glow: 1 }, view: V, onReady: function () { stage.classList.add('ready'); } });
      brain.start();
    } catch (e) { stage.classList.add('nogl'); }
    setTimeout(function () { if (!stage.classList.contains('ready')) stage.classList.add('nogl'); }, 8000);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      if (!brain) return;
      if (en[0].isIntersecting) brain.start(); else brain.stop();
    }, { threshold: 0 }).observe(stage);
  }

  /* ---------- svg links ---------- */
  var NS = 'http://www.w3.org/2000/svg';
  function mk(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); links.appendChild(e); return e; }
  var ring = mk('ellipse', { fill: 'none', stroke: 'rgba(143,184,200,.22)', 'stroke-width': 1, 'stroke-dasharray': '2 7' });
  var spokes = [0, 1, 2, 3].map(function () { return mk('line', { stroke: 'rgba(143,184,200,.5)', 'stroke-width': 1 }); });
  var sparks = [0, 1, 2, 3].map(function () { return mk('circle', { r: 3.2, fill: '#fff' }); });
  var beams = [0, 1, 2].map(function () { return mk('line', { stroke: 'rgba(143,184,200,.55)', 'stroke-width': 1 }); });

  var caps = [
    { a: 0.24, b: 0.37, t: 'Arthur breaks it into smaller questions.' },
    { a: 0.39, b: 0.52, t: 'Then reads the systems you already use.' },
  ];
  var capIdx = -1;

  /* ---------- stage render ---------- */
  var DARK = [20, 22, 26], CREAM = [245, 241, 235];
  function mixc(t) { return 'rgb(' + DARK.map(function (d, i) { return Math.round(lerp(d, CREAM[i], t)); }).join(',') + ')'; }
  var lit = false;

  function renderStage(p) {
    var cx = W / 2;
    var z = HZ();
    z = lerp(z, mobile ? 1.25 : 0.92, E(seg(p, 0.02, 0.1)));
    z = lerp(z, mobile ? 1.0 : 0.8, E(seg(p, 0.2, 0.27)));
    z = lerp(z, mobile ? 4.2 : 4.6, E(seg(p, 0.36, 0.5)));
    z = lerp(z, 0.3, E(seg(p, 0.54, 0.64)));
    V.zoom = z;
    V.cy = lerp(HCY(), 0, E(seg(p, 0, 0.08)));
    V.spin = p * 3.4;
    V.front = p < 0.2 ? null : (((p - 0.2) / 0.32 * 2.2 * (V.maxd + 4)) % (V.maxd + 4)) - 1;
    var cy = H / 2 + V.cy * H;
    var op = 1 - 0.66 * (E(seg(p, 0.06, 0.11)) - E(seg(p, 0.17, 0.23)));
    op *= 1 - E(seg(p, 0.5, 0.62));
    canvas.style.opacity = op.toFixed(3);
    glow.style.opacity = (op * (1 - E(seg(p, 0.5, 0.6)))).toFixed(3);
    still.style.opacity = stage.classList.contains('ready') ? 0 : op;

    var t = E(seg(p, 0.52, 0.64));
    stage.style.background = mixc(t);
    var bs = E(seg(p, 0.47, 0.6));
    bloom.style.opacity = Math.min(1, bs * 1.8).toFixed(3);
    bloom.style.transform = 'translate(-50%,-50%) scale(' + bs.toFixed(3) + ')';
    lit = t > 0.5;

    var h = E(seg(p, 0.01, 0.07));
    heroCopy.style.opacity = (1 - h).toFixed(3);
    heroCopy.style.transform = 'translateY(' + (-h * 50).toFixed(1) + 'px)';
    heroCopy.style.visibility = h >= 1 ? 'hidden' : 'visible';

    var qi = E(seg(p, 0.07, 0.1)) * (1 - E(seg(p, 0.19, 0.23)));
    qEl.style.opacity = qi.toFixed(3);
    qEl.style.transform = 'translate(-50%,-50%) scale(' + lerp(1, 0.93, E(seg(p, 0.19, 0.23))).toFixed(3) + ')';
    var wr = seg(p, 0.09, 0.17) * (words.length + 1.5);
    for (var i = 0; i < words.length; i++) words[i].style.opacity = (0.14 + 0.86 * clamp(wr - i)).toFixed(3);
    qline.style.opacity = (E(seg(p, 0.22, 0.26)) * (1 - E(seg(p, 0.5, 0.55)))).toFixed(3);

    var rx = mobile ? W / 2 - 84 : W * 0.355, ry = mobile ? H * 0.27 : H * 0.285;
    var rot = (p - 0.23) * 3.4;
    var spread = 1 + 1.5 * E(seg(p, 0.36, 0.46));
    var th = [], px = [], py = [], ent = [];
    for (i = 0; i < 4; i++) {
      var s0 = 0.225 + i * 0.025;
      ent[i] = E(seg(p, s0, s0 + 0.035));
      th[i] = -Math.PI * 0.78 + i * Math.PI / 2 + rot;
      var rr = lerp(0.3, 1, ent[i]) * spread;
      px[i] = cx + Math.cos(th[i]) * rx * rr;
      py[i] = cy + Math.sin(th[i]) * ry * rr;
      var hw = (chips[i].offsetWidth || 150) / 2; px[i] = clamp(px[i], 10 + hw, W - 10 - hw);
      var co = ent[i] * (1 - E(seg(p, 0.38, 0.48)));
      chips[i].style.opacity = co.toFixed(3);
      chips[i].style.transform = 'translate(' + px[i].toFixed(1) + 'px,' + py[i].toFixed(1) + 'px) translate(-50%,-50%) scale(' + lerp(0.7, 1, ent[i]).toFixed(3) + ')';
    }
    var lo = clamp(seg(p, 0.23, 0.26) * (1 - E(seg(p, 0.38, 0.46))));
    ring.setAttribute('cx', cx); ring.setAttribute('cy', cy); ring.setAttribute('rx', rx * spread); ring.setAttribute('ry', ry * spread);
    ring.style.opacity = lo.toFixed(3);
    for (i = 0; i < 4; i++) {
      var sp = spokes[i];
      sp.setAttribute('x1', cx); sp.setAttribute('y1', cy);
      sp.setAttribute('x2', lerp(cx, px[i], ent[i])); sp.setAttribute('y2', lerp(cy, py[i], ent[i]));
      sp.style.opacity = (lo * ent[i]).toFixed(3);
      var u = (p * 9 + i * 0.25) % 1, a = th[i] + (th[(i + 1) % 4] + (i === 3 ? Math.PI * 2 : 0) - th[i]) * u;
      sparks[i].setAttribute('cx', cx + Math.cos(a) * rx * spread);
      sparks[i].setAttribute('cy', cy + Math.sin(a) * ry * spread);
      sparks[i].style.opacity = (Math.sin(Math.PI * u) * lo * Math.min(ent[i], ent[(i + 1) % 4])).toFixed(3);
    }

    var cv = E(seg(p, 0.52, 0.6));
    var pos = mobile ? [[-0.34, -0.2], [-0.28, 0.0], [-0.34, 0.2]] : [[-0.2, -0.15], [0.1, -0.05], [-0.11, 0.18]];
    for (i = 0; i < 3; i++) {
      var si = E(seg(p, 0.4 + i * 0.03, 0.45 + i * 0.03));
      var sx = cx + pos[i][0] * W * (1 - cv) - 7 * (1 - cv), sy = H / 2 + pos[i][1] * H * (1 - cv);
      srcs[i].style.opacity = (si * (1 - cv)).toFixed(3);
      srcs[i].style.transform = 'translate(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px) translateY(-50%) scale(' + lerp(0.85, 1, si).toFixed(3) + ')';
      beams[i].setAttribute('x1', cx); beams[i].setAttribute('y1', H / 2);
      beams[i].setAttribute('x2', sx + 7); beams[i].setAttribute('y2', sy);
      beams[i].style.opacity = (si * (1 - cv) * 0.9).toFixed(3);
    }

    var want = -1, cop = 0;
    for (i = 0; i < caps.length; i++) {
      var c = caps[i], o = E(seg(p, c.a, c.a + 0.03)) * (1 - E(seg(p, c.b - 0.03, c.b)));
      if (o > cop) { cop = o; want = i; }
    }
    if (want !== capIdx && want >= 0) { capEl.textContent = caps[want].t; capIdx = want; }
    capEl.style.opacity = cop.toFixed(3);
    capEl.style.color = t > 0.45 ? '#1d1d1f' : '#fff';
    capEl.style.transform = 'translateY(' + ((1 - cop) * 14).toFixed(1) + 'px)';
    qline.style.color = t > 0.45 ? '#62656c' : 'rgba(255,255,255,.62)';

    var ai = E(seg(p, 0.57, 0.65));
    ans.style.opacity = ai.toFixed(3);
    ans.style.transform = 'translate(-50%,-50%) translateY(' + ((1 - ai) * 36).toFixed(1) + 'px)';
    ansKids[0].style.opacity = ansKids[1].style.opacity = '1';
    ansKids[2].style.opacity = E(seg(p, 0.61, 0.68)).toFixed(3);
    ansKids[3].style.opacity = E(seg(p, 0.65, 0.72)).toFixed(3);
    ansKids[4].style.opacity = ansKids[3].style.opacity;
  }
  var ansKids = $$('#ans > *');

  /* ---------- fan ---------- */
  var fan = $('#fan'), cards = $$('.card'), fanStage = $('.fan-stage');
  function renderFan(p) {
    var rise = E(seg(p, 0, 0.08)), open = lerp(0.3, 1, E(seg(p, 0, 0.42)));
    var spreadX = mobile ? W * 0.115 : Math.min(W * 0.125, 220), maxRot = mobile ? 8 : 10.5;
    cards.forEach(function (c, i) {
      var k = i - 2;
      var rot = k * lerp(1, maxRot, open);
      var tx = k * lerp(10, spreadX, open);
      var ty = lerp(Math.abs(k) * 8, k * k * (mobile ? 12 : 18), open) + (1 - rise) * H * 0.12;
      c.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) rotate(' + rot.toFixed(2) + 'deg) scale(' + lerp(0.9, 1, rise).toFixed(3) + ')';
      c.style.zIndex = 10 - Math.abs(k);
    });
    fan.classList.toggle('open', open > 0.92);
  }

  /* ---------- checks ---------- */
  var checks = $('#checks'), stack = $('#ckStack'), plates = [];
  ['p0', 'p1', 'p2', 'p3', 'p4', 'p5'].forEach(function (c) { plates.push($('.' + c, stack)); });
  var lis = $$('#ckList li'), ckLine = $('#ckLine'), ckIdx = -2;
  function renderChecks(p) {
    var pw = stack.offsetWidth || 400;
    var ex = E(seg(p, 0.03, 0.3));
    var gap = lerp(2, pw * 0.2, ex);
    var idx = p < 0.3 ? 0 : Math.min(5, Math.floor(seg(p, 0.3, 0.94) * 5.999) + 1);
    stack.style.transform = 'rotateX(' + lerp(68, 56, ex).toFixed(1) + 'deg) rotateZ(' + lerp(-6, -24, ex).toFixed(1) + 'deg)';
    plates.forEach(function (pl, k) {
      var z = (5 - k) * gap + (k === idx && k > 0 ? gap * 0.7 : 0);
      pl.style.transform = 'translateZ(' + z.toFixed(1) + 'px)';
      pl.classList.toggle('on', STATIC ? k > 0 : k === idx && k > 0);
    });
    if (idx !== ckIdx) {
      ckIdx = idx;
      lis.forEach(function (li, i) { li.classList.toggle('on', STATIC || i < idx || (idx === 0 && false)); });
      if (idx === 0) ckLine.textContent = 'Harbor Equipment Services has three open invoices.';
      else { var li = lis[idx - 1]; ckLine.textContent = $('b', li).textContent + '. ' + $('span', li).textContent; }
    }
  }

  /* ---------- rail ---------- */
  var rail = $('#rail'), track = $('#track'), railTotal = 0;
  function sizeRail() {
    if (STATIC) return;
    railTotal = Math.max(0, track.scrollWidth - W);
    rail.style.height = Math.round(railTotal + H * 1.15) + 'px';
  }
  var figs = $$('.r'), figImgs = figs.map(function (f) { return $('img', f); });
  function renderRail(p) {
    if (STATIC) return;
    var sh = p * railTotal;
    track.style.transform = 'translate3d(' + (-sh).toFixed(1) + 'px,0,0)';
    for (var i = 0; i < figs.length; i++) {
      var c = figs[i].offsetLeft + figs[i].offsetWidth / 2 - sh, d = c - W / 2;
      var t = 1 - clamp(Math.abs(d) / (W * 0.55));
      figs[i].style.transform = 'scale(' + (0.84 + 0.16 * E(t)).toFixed(3) + ')';
      figs[i].style.opacity = (0.5 + 0.5 * E(t)).toFixed(3);
      figImgs[i].style.transform = 'translate3d(' + (-d * 0.06).toFixed(1) + 'px,0,0) scale(1.14)';
    }
  }

  /* ---------- nav theme ---------- */
  var themeEls = [[stage, function () { return lit; }], [fan, 0], [$('#bento'), 0], [checks, 1], [rail, 0], [$('#close'), 1], [$('.site-footer'), 1]];
  function navTheme() {
    if (menu.classList.contains('open')) return;
    var y = 36, dark = false;
    themeEls.forEach(function (t) {
      var r = t[0].getBoundingClientRect();
      if (r.top <= y && r.bottom > y) dark = typeof t[1] === 'function' ? !t[1]() : !!t[1] || t[0] === stage;
    });
    nav.classList.toggle("light", !dark);
    var inStage = stage.getBoundingClientRect().bottom > y;
    nav.classList.toggle("dk", dark && !inStage);
  }

  /* ---------- loop ---------- */
  function prog(el) {
    var r = el.getBoundingClientRect();
    return { p: clamp(-r.top / Math.max(1, r.height - H)), vis: r.bottom > -50 && r.top < H + 50 };
  }
  var tick = 0;
  function frame() {
    var s = prog(seq);
    if (s.vis) renderStage(s.p);
    var f = prog(fan); if (f.vis) renderFan(f.p);
    var c = prog(checks); if (c.vis) renderChecks(c.p);
    var r = prog(rail); if (r.vis) renderRail(r.p);
    navTheme();
    requestAnimationFrame(frame);
  }

  function layout() {
    W = innerWidth; H = innerHeight; mobile = W < 700;
    sizeStill(); sizeRail();
  }
  addEventListener('resize', function () { layout(); if (STATIC) paintStatic(); });

  function paintStatic() {
    renderStage(0); renderFan(1); renderChecks(1);
    qEl.style.opacity = 0;
  }

  layout();
  mountBrain();
  if (STATIC) {
    paintStatic();
    ansKids.forEach(function (k) { k.style.opacity = 1; });
    requestAnimationFrame(function () { renderChecks(1); });
    (function loopNav() { navTheme(); requestAnimationFrame(loopNav); })();
  } else {
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeRail);
    addEventListener('load', sizeRail);
    frame();
  }
})();
