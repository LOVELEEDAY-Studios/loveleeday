(function () {
  'use strict';
  var D = window.QDATA, doc = document.documentElement;
  var STATIC = doc.classList.contains('static');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var esc = function (s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- nav ---------- */
  var nav = $('#nav'), burger = $('.burger'), navMain = $('#navMain');
  addEventListener('scroll', function () { nav.classList.toggle('scrolled', scrollY > 8); }, { passive: true });
  burger.addEventListener('click', function () {
    var o = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', o); navMain.classList.toggle('open', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });

  /* ---------- hero: the question ---------- */
  var qEl = $('#q'), whoEl = $('#who'), ansEl = $('#ans'), srcEl = $('#srcl'), chipsEl = $('#chips');
  var form = $('#ask'), inp = $('#askIn');
  var order = D.who.map(function (w) { return w.id; });
  var firstRun = true, run = 0, idx = 0, typing = false, heroVis = true, focused = false;

  D.who.forEach(function (w, i) {
    var li = document.createElement('li');
    li.innerHTML = '<button class="chip" type="button" aria-pressed="' + (i === 0) + '" data-i="' + i + '">' + w.label + '</button>';
    chipsEl.appendChild(li);
  });
  var chipBtns = $$('.chip');
  function mark(i) { chipBtns.forEach(function (b, k) { b.setAttribute('aria-pressed', k === i); }); }

  function wordsHTML(t) {
    return t.split(' ').map(function (w) {
      return '<span class="w">' + Array.prototype.map.call(w, function (c) { return '<span class="c">' + esc(c) + '</span>'; }).join('') + '</span>';
    }).join(' ');
  }
  function fit() {
    var vw = innerWidth, vh = innerHeight, small = vw < 700;
    var maxH = small ? Math.max(150, Math.min(vh * 0.21, 190)) : Math.max(280, Math.min(vh - 500, 520));
    var hi = small ? Math.min(72, vw * 0.178) : Math.min(170, vw * 0.118), lo = small ? 30 : 54;
    var fs = hi;
    qEl.parentNode.style.setProperty('--qh', maxH + 'px');
    while (fs > lo) { qEl.style.setProperty('--qfs', fs + 'px'); if (qEl.getBoundingClientRect().height <= maxH) break; fs -= 2; }
    qEl.style.setProperty('--qfs', fs + 'px');
  }

  async function showQ(text, my) {
    qEl.innerHTML = wordsHTML(text);
    fit();
    var chars = $$('.c', qEl);
    if (STATIC) { chars.forEach(function (c) { c.classList.add('on'); }); return true; }
    var caret = document.createElement('i'); caret.className = 'caret'; caret.setAttribute('aria-hidden', 'true');
    chars[0].before(caret);
    typing = true;
    for (var i = 0; i < chars.length; i++) {
      chars[i].classList.add('on'); chars[i].after(caret);
      var ch = chars[i].textContent;
      await sleep(firstRun ? 15 : (ch === ',' ? 190 : 30 + Math.random() * 34));
      if (my !== run) return false;
    }
    typing = false;
    return true;
  }

  async function showAns(beats, srcHTML, my) {
    ansEl.innerHTML = beats.map(function (b) {
      return '<div class="beat"><h3>' + b[0] + '</h3><p>' + b[1].split(' ').map(function (w) { return '<span class="wd">' + esc(w) + '</span>'; }).join(' ') + '</p></div>';
    }).join('');
    srcEl.innerHTML = srcHTML;
    var bs = $$('.beat', ansEl);
    if (firstRun && !STATIC) {
      bs.forEach(function (b) { b.classList.add('on'); $$('.wd', b).forEach(function (w) { w.classList.add('on'); }); });
      srcEl.classList.add('on'); firstRun = false; return true;
    }
    for (var i = 0; i < bs.length; i++) {
      bs[i].classList.add('on');
      var ws = $$('.wd', bs[i]);
      for (var k = 0; k < ws.length; k++) {
        ws[k].classList.add('on');
        if (!STATIC) { await sleep(36); if (my !== run) return false; }
      }
      if (!STATIC) { await sleep(220); if (my !== run) return false; }
    }
    srcEl.classList.add('on');
    return true;
  }
  var LABELS = ['What we found', 'Why it matters', 'What to do next'];

  async function hold(ms, my) {
    var t = 0;
    while (t < ms) { await sleep(200); if (my !== run) return false; if (heroVis && !focused) t += 200; }
    return true;
  }

  async function play(i, custom) {
    var my = ++run; idx = i;
    qEl.classList.remove('out'); ansEl.classList.remove('out'); srcEl.classList.remove('on', 'out'); whoEl.classList.remove('out');
    ansEl.innerHTML = ''; srcEl.innerHTML = '';
    var text, art, beats, src;
    if (custom) {
      mark(-1); art = 'You asked'; text = custom;
      beats = [[LABELS[0], 'We have not read your systems yet, so any figure we gave you here would be made up.'],
        [LABELS[1], 'Arthur answers from your own orders, records and inboxes, with the source behind every figure.'],
        [LABELS[2], 'Bring this question to us and we will answer it from your records.']];
      src = '<a href="/site/contact#message">Talk to us</a>';
    } else {
      mark(i);
      var w = D.who[i], s = D.sets[w.id];
      art = w.art + ' asks'; text = s.q;
      beats = s.a.map(function (a, k) { return [LABELS[k], a]; });
      src = 'Read from: ' + s.s.join(', ') + '. Example data.';
    }
    whoEl.textContent = art;
    if (!(await showQ(text, my))) return;
    if (!STATIC && !firstRun) { await sleep(420); if (my !== run) return; }
    if (!(await showAns(beats, src, my))) return;
    if (custom || STATIC) return;
    if (!(await hold(8200, my))) return;
    qEl.classList.add('out'); ansEl.classList.add('out'); srcEl.classList.add('out'); whoEl.classList.add('out');
    await sleep(520); if (my !== run) return;
    play((i + 1) % order.length);
  }

  chipsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return; play(+b.dataset.i);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = inp.value.trim().replace(/\s+/g, ' ');
    if (!v) { inp.focus(); return; }
    if (!/[?]$/.test(v)) v += '?';
    inp.value = ''; inp.blur(); focused = false;
    play(-1, v);
  });
  inp.addEventListener('focus', function () { focused = true; });
  inp.addEventListener('blur', function () { focused = false; });
  new IntersectionObserver(function (en) { heroVis = en[0].isIntersecting; }, { threshold: 0.05 }).observe($('#hero'));

  var rT; addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(fit, 120); });

  /* ---------- wall ---------- */
  var wallCols = $('#wallCols'), filtersEl = $('#filters'), wcount = $('#wcount');
  var items = [];
  for (var j = 0; j < 7; j++) D.who.forEach(function (w) { var r = D.wall[w.id][j]; items.push({ who: w.id, label: w.label, q: r[0], a: r[1], s: r[2] }); });
  var activeF = 'all', lastNC = 0;
  var filt = [{ id: 'all', label: 'Everyone' }].concat(D.who);
  filt.forEach(function (f) {
    var li = document.createElement('li');
    li.innerHTML = '<button type="button" aria-pressed="' + (f.id === 'all') + '" data-f="' + f.id + '">' + f.label + '</button>';
    filtersEl.appendChild(li);
  });
  function itemHTML(it, dup) {
    return '<button class="wq" type="button" data-who="' + it.who + '" aria-expanded="false"' + (dup ? ' tabindex="-1" aria-hidden="true"' : '') + '><span class="wq-q">' + esc(it.q) + '</span><span class="wq-w">' + it.label + '</span><span class="wq-a"><span class="wq-in"><span class="wq-t">' + esc(it.a) + '</span><span class="wq-s">Read from: ' + esc(it.s) + '</span></span></span></button>';
  }
  function applyFilter() {
    $$('.wq').forEach(function (b) { b.classList.toggle('dim', activeF !== 'all' && b.dataset.who !== activeF); });
    $$('button', filtersEl).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.f === activeF); });
    var n = activeF === 'all' ? items.length : items.filter(function (i) { return i.who === activeF; }).length;
    var lab = activeF === 'all' ? 'questions, from seven kinds of organization' : 'from ' + (D.who.filter(function (w) { return w.id === activeF; })[0].label.toLowerCase());
    wcount.textContent = n + (activeF === 'all' ? ' ' : ' questions ') + lab;
  }
  function buildWall() {
    var nc = innerWidth < 700 ? 2 : innerWidth < 1100 ? 3 : 5;
    if (nc === lastNC) return; lastNC = nc;
    wallCols.style.setProperty('--nc', nc);
    var cols = []; for (var c = 0; c < nc; c++) cols.push([]);
    items.forEach(function (it, i) { cols[i % nc].push(it); });
    var dur = [62, 88, 52, 76, 98], off = [0, -31, -14, -52, -22];
    wallCols.innerHTML = cols.map(function (list, c) {
      var a = list.map(function (it) { return itemHTML(it, false); }).join('');
      var b = list.map(function (it) { return itemHTML(it, true).replace('class="wq"', 'class="wq dup"'); }).join('');
      var fast = innerWidth < 700 ? 0.8 : 1;
      return '<div class="wcol' + (c % 2 ? ' rev' : '') + '" style="--d:' + Math.round(dur[c] * fast * (list.length / 10)) + 's;--o:' + off[c] + 's"><div class="wtrack">' + a + b + '</div></div>';
    }).join('');
    applyFilter();
  }
  wallCols.addEventListener('click', function (e) {
    var b = e.target.closest('.wq'); if (!b) return;
    var col = b.closest('.wcol'), open = b.getAttribute('aria-expanded') !== 'true';
    $$('.wq[aria-expanded=true]', wallCols).forEach(function (x) { x.setAttribute('aria-expanded', 'false'); });
    $$('.wcol.hasopen', wallCols).forEach(function (x) { x.classList.remove('hasopen'); });
    if (open) { b.setAttribute('aria-expanded', 'true'); col.classList.add('hasopen'); }
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest('.wq')) return;
    $$('.wq[aria-expanded=true]', wallCols).forEach(function (x) { x.setAttribute('aria-expanded', 'false'); });
    $$('.wcol.hasopen', wallCols).forEach(function (x) { x.classList.remove('hasopen'); });
  });
  filtersEl.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; activeF = b.dataset.f; applyFilter(); });
  buildWall(); addEventListener('resize', function () { clearTimeout(buildWall.t); buildWall.t = setTimeout(buildWall, 150); });
  if (STATIC) { var st = document.createElement('style'); st.textContent = '.static .wall-v{height:auto;-webkit-mask-image:none;mask-image:none}.static .wcol{height:auto}.static .wq.dup{display:none}'; document.head.appendChild(st); }

  /* ---------- split helpers ---------- */
  function splitWords(el, cls) {
    var t = el.textContent.trim().split(/\s+/);
    el.innerHTML = t.map(function (w) { return '<span class="' + cls + '">' + esc(w) + '</span>'; }).join(' ');
    return $$('.' + cls, el);
  }
  function maskWords(el) {
    var t = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = t.map(function (w) { return '<span class="mw" aria-hidden="true"><span class="mi">' + esc(w) + '</span></span>'; }).join(' ');
    return $$('.mi', el);
  }

  /* ---------- scroll ---------- */
  function start() {
    if (STATIC || typeof gsap === 'undefined') { startHero(); return; }
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' });
    var lenis;
    try {
      lenis = new Lenis({ lerp: 0.1, anchors: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } catch (e) { }

    var bk = $('#break'), stage = $('#bkStage'), flow = $('#bkFlow'), sys = $('#bkSys'), srcBox = $('#bkSrc');
    var flowWords = $$('.w', flow);
    var fws = flowWords.map(function (w) { var s = document.createElement('span'); s.className = 'fw'; s.setAttribute('aria-hidden', 'true'); s.textContent = w.textContent; stage.appendChild(s); return s; });
    var ansEl2 = $('#bkAnswer');
    var ansWords = splitWords(ansEl2, 'aw');
    var bctx, lastW = 0;

    function buildBreak() {
      if (bctx) bctx.revert();
      lastW = innerWidth;
      var small = innerWidth < 760;
      var sr = stage.getBoundingClientRect();
      var flowFs = getComputedStyle(flowWords[0]).fontSize;
      var hits = $$('.row.hit', sys);
      var sps = $$('.sp', srcBox);
      hits.forEach(function (h, i) { sps[i].style.height = h.getBoundingClientRect().height + 'px'; });
      fws.forEach(function (f, i) {
        var r = flowWords[i].getBoundingClientRect();
        f.style.left = (r.left - sr.left) + 'px'; f.style.top = (r.top - sr.top) + 'px'; f.style.fontSize = flowFs;
      });
      bctx = gsap.context(function () {
        gsap.set(ansEl2, { opacity: 1 }); gsap.set(ansWords, { opacity: 0 });
        var tl = gsap.timeline({ scrollTrigger: { trigger: bk, start: 'top top', end: '+=' + Math.round(innerHeight * (small ? 2.4 : 3.1)), pin: true, scrub: 0.7, anticipatePin: 1 }, defaults: { ease: 'none' } });
        var cols = $$('.sc', sys), allRows = $$('.row', sys), heads = $$('.sc h3', sys);
        tl.from(cols, { borderTopColor: 'rgba(29,29,31,0)', duration: 0.6, stagger: 0.1 }, 0.3);
        tl.from(heads.concat(allRows), { opacity: 0, y: 22, duration: 0.8, stagger: 0.04, ease: 'power2.out' }, 0.4);
        var seq = [1, 2, 3, 4, 6], T0 = 1.1, D1 = 1.5;
        seq.forEach(function (wi, k) {
          var f = fws[wi], slot = $('.sl[data-s="' + wi + '"]', sys);
          var fr = f.getBoundingClientRect(), sl = slot.getBoundingClientRect();
          var sc = parseFloat(getComputedStyle(slot).fontSize) / parseFloat(flowFs);
          var t = T0 + k * 0.3;
          tl.to(f, { x: sl.left - fr.left, y: sl.top - fr.top, scale: sc, duration: D1, ease: 'power3.inOut' }, t);
          tl.to(slot, { opacity: 1, duration: 0.01 }, t + D1);
          tl.to(f, { opacity: 0, duration: 0.01 }, t + D1);
        });
        var tV = T0 + 4 * 0.3 + D1 + 0.1;
        tl.to($$('.val', sys), { opacity: 1, duration: 0.8, stagger: 0.25 }, tV);
        var tF = tV + 1.5;
        tl.to($$('.row:not(.hit)', sys).concat(heads), { opacity: 0, duration: 0.35, stagger: 0.01 }, tF);
        tl.to(cols, { borderTopColor: 'rgba(29,29,31,0)', duration: 0.35 }, tF);
        tl.to([0, 5, 7].map(function (i) { return fws[i]; }), { opacity: 0, duration: 0.3 }, tF + 0.6);
        hits.forEach(function (h, i) {
          var a = h.getBoundingClientRect(), b = sps[i].getBoundingClientRect();
          tl.to(h, { x: b.left - a.left, y: b.top - a.top, scale: small ? 1 : 1.08, transformOrigin: "0 0", duration: 1.3, ease: "power3.inOut" }, tF + 0.7);
        });
        tl.to($('#bkSl'), { opacity: 1, duration: 0.5 }, tF + 1.4);
        tl.to(ansWords, { opacity: 1, duration: 0.15, stagger: 0.07 }, tF + 0.9);
        tl.to({}, { duration: 1.2 });
      }, bk);
    }

    var ctx2;
    function buildRest() {
      ctx2 = gsap.context(function () {
        var sw = splitWords($('#stT'), 'sw');
        var stl = gsap.timeline({ scrollTrigger: { trigger: '#statement', start: 'top 55%', end: 'bottom 85%', scrub: true }, defaults: { ease: 'none' } });
        stl.fromTo(sw, { color: '#d9d2c5' }, { color: '#1d1d1f', stagger: 1, duration: 1 });
        [['#wallH'], ['#trH'], ['#sxH']].forEach(function (a) {
          var mi = maskWords($(a[0]));
          gsap.set(mi, { yPercent: 108 });
          ScrollTrigger.create({ trigger: a[0], start: 'top 86%', once: true, onEnter: function () { gsap.to(mi, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.06 }); } });
        });
        gsap.fromTo('#phFrame', { clipPath: 'inset(9% 7% 9% 7%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '#photo', start: 'top 92%', end: 'top 12%', scrub: true } });
        gsap.fromTo('#phImg', { y: -28 }, { y: 28, ease: 'none', scrollTrigger: { trigger: '#photo', start: 'top bottom', end: 'bottom top', scrub: true } });
        var n = gsap.timeline({ scrollTrigger: { trigger: '#trN', start: 'top 82%', once: true } });
        n.from('#trN figcaption', { opacity: 0, y: 10, duration: 0.5 })
          .from('#trN p:not(.tr-one)', { opacity: 0, y: 18, duration: 0.7, stagger: 0.18, ease: 'power3.out' }, 0.1)
          .from('.tr-rule', { scaleX: 0, duration: 0.8, ease: 'power3.inOut' }, '>-0.1')
          .from('.tr-one', { opacity: 0, y: 12, duration: 0.7 }, '>-0.3');
        gsap.from('.tr-fn li', { opacity: 0, y: 14, stagger: 0.2, duration: 0.7, scrollTrigger: { trigger: '.tr-fn', start: 'top 90%', once: true } });
        gsap.from('.tr-c > div', { opacity: 0, y: 24, stagger: 0.15, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.tr-c', start: 'top 88%', once: true } });
        gsap.from('#clPh', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '#company', start: 'top bottom', end: 'top 30%', scrub: true } });
      });
    }
    function buildAll() { buildBreak(); if (!ctx2) buildRest(); ScrollTrigger.refresh(); }
    var go = function () { buildAll(); startHero(); };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { requestAnimationFrame(go); });
    var rr; addEventListener('resize', function () { clearTimeout(rr); rr = setTimeout(function () { if (innerWidth !== lastW) buildAll(); }, 250); });
    addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  var heroStarted = false;
  function startHero() {
    if (heroStarted) return; heroStarted = true;
    play(0);
  }
  if (STATIC) {
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { startHero(); });
  } else start();
})();
