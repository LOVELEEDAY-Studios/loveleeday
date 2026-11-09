(function () {
  var R = document.documentElement;
  var DAYS = window.LL_DAYS;
  var anim = R.classList.contains('anim');
  var qs = new URLSearchParams(location.search);
  var isPhone = function () { return window.matchMedia('(max-width:760px)').matches; };
  var isNarrow = function () { return window.matchMedia('(max-width:960px)').matches; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mark(line, hl) {
    var e = esc(line);
    if (!hl) return e;
    var h = esc(hl), i = e.indexOf(h);
    return i < 0 ? e : e.slice(0, i) + '<mark>' + h + '</mark>' + e.slice(i + h.length);
  }
  function resolve(k) {
    k = (k || '').toLowerCase().trim();
    if (DAYS.days[k]) return k;
    if (DAYS.alias[k]) return DAYS.alias[k];
    return DAYS.def;
  }

  var cur = resolve(qs.get('day'));
  var shown = null;

  /* ---------- scene markup ---------- */
  var holder = $('#hours');
  var dayEl = $('#day');
  var pinned = anim && !window.matchMedia('(max-width:760px)').matches;
  if (pinned) R.classList.add('pinned');
  var pinCur = 0;
  var KINDS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'];
  var TIMES = ['7:40 AM', '9:15 AM', '11:30 AM', '12:40 PM', '3:10 PM', '5:50 PM', '6:40 PM'];
  var CHECKS = [['Names', 'Different names, one customer.'], ['Sources', 'Every answer has a way back.'], ['History', 'What you knew, and when.'], ['Checks', 'Checked before it is said.'], ['Changes', 'Told when something changes.']];

  function clockHTML(t) {
    var m = /(\d+:\d+)\s*(AM|PM)/.exec(t);
    return '<b>' + m[1] + '</b><i>' + m[2] + '</i>';
  }
  function sceneHTML(i) {
    var k = KINDS[i], t = TIMES[i];
    var h = '<div class="ph"><img alt="" width="1880" height="1253"' + (i > 1 ? ' loading="lazy"' : '') + '></div>';
    h += '<p class="clk rv" aria-hidden="true">' + clockHTML(t) + '</p>';
    if (i === 3) {
      h += '<div class="ex"><p class="q"></p>' +
        '<div class="pa"><p class="pf rv" id="pf"></p><p class="y rv"></p><p class="n rv"></p>' +
        '<button class="src rv" type="button" aria-expanded="false"><span class="sl">Source</span><span class="st"></span></button></div></div>' +
        '<div class="pnl rv" id="pnl" aria-live="polite"></div>';
    } else {
      h += '<div class="ex"><p class="q"></p><div class="a"><span class="who rv">Arthur</span><p class="f rv"></p><p class="y rv"></p><p class="n rv"></p>' +
        '<button class="src rv" type="button" aria-expanded="false"><span class="sl">Source</span><span class="st"></span></button>' +
        '<div class="rl" hidden><p class="rl-l"></p></div></div></div>';
      if (i === 4) h += '<dl class="facts rv"></dl>';
      if (i === 5) {
        h += '<p class="cap rv">Before you leave for the day, here is how every answer is checked.</p><ul class="checks rv">' +
          CHECKS.map(function (c) { return '<li><b>' + c[0] + '</b>' + c[1] + '</li>'; }).join('') + '</ul>';
      }
    }
    h += '<p class="exd rv">Example data.</p>';
    return '<section class="hr ' + k + '" id="hr' + (i + 1) + '" data-i="' + i + '" data-time="' + t + '" aria-label="' + t + '">' + h + '</section>';
  }
  holder.innerHTML = TIMES.map(function (_, i) { return sceneHTML(i); }).join('');
  var scenes = $$('.hr', holder);
  var dinner = $('#dinner');
  holder.appendChild(dinner);
  var all = scenes.concat([dinner]);

  /* ---------- proof state ---------- */
  var proofState = { fig: 'a', rec: 0 };
  var demoDone = false, demoCancel = false;

  function renderProof(sc, hr) {
    var p = hr.proof;
    var pf = $('#pf', sc);
    pf.innerHTML = p.ans.map(function (x) {
      if (typeof x === 'string') return esc(x);
      return '<button type="button" class="fig" data-k="' + x.k + '" aria-pressed="false">' + esc(x.t) + '</button>';
    }).join('');
    paintProof(sc, hr);
  }
  function paintProof(sc, hr) {
    var p = hr.proof, f = proofState.fig, pnl = $('#pnl', sc);
    $$('.fig', sc).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.k === f ? 'true' : 'false'); });
    if (!f) {
      pnl.innerHTML = '<div class="pnl-h"><span class="pnl-t">Records behind this answer</span></div><p class="pnl-hint">Select a figure in the answer to see the records it came from.</p><p class="pnl-n">Example data.</p>';
      return;
    }
    var label = '';
    p.ans.forEach(function (x) { if (typeof x !== 'string' && x.k === f) label = x.t; });
    var recs = p.figs[f];
    pnl.innerHTML = '<div class="pnl-h"><span class="pnl-t">Records behind <b>' + esc(label) + '</b></span><span class="pnl-c">' + recs.length + ' records</span></div><ul class="pnl-l">' +
      recs.map(function (r, j) {
        var on = proofState.rec === j;
        return '<li class="' + (on ? 'on' : '') + '"><button type="button" class="rec" data-j="' + j + '" aria-expanded="' + on + '"><b>' + esc(r.t) + '</b><small>' + esc(r.s) + '</small></button>' +
          '<div class="rec-d"' + (on ? '' : ' hidden') + '><p class="ln"><span class="no">' + r.n + '</span><span class="tx">' + mark(r.line, r.hl) + '</span></p></div></li>';
      }).join('') + '</ul><p class="pnl-n">Example data.</p>';
  }

  /* ---------- render ---------- */
  function setText(el, txt) { if (el) el.textContent = txt; }
  function splitQ(el, text) {
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(' ').map(function (w, i) { return '<span class="w" aria-hidden="true" style="--i:' + i + '">' + esc(w) + '</span>'; }).join(' ');
  }
  // a photograph changes by a new one wiping up over the old: the frame is never empty
  function swapImg(box, base, src, alt, w, h, pos) {
    var host = box.closest('.hr, .hero');
    function put() { base.src = src; base.alt = alt; base.width = w; base.height = h; base.style.objectPosition = pos; }
    if (!host || !host.classList.contains('swp')) { put(); return; }
    var stale = $('img.nw', box); if (stale) stale.remove();
    var nw = new Image();
    nw.className = 'nw'; nw.alt = alt; nw.width = w; nw.height = h; nw.style.objectPosition = pos; nw.style.transform = base.style.transform;
    nw.onload = function () {
      requestAnimationFrame(function () { nw.classList.add('on'); });
      setTimeout(function () { if (!nw.parentNode) return; put(); setTimeout(function () { nw.remove(); }, 80); }, 1080);
    };
    nw.src = src; box.appendChild(nw);
  }
  function setPhoto(sc, ph) {
    var box = $('.ph', sc);
    swapImg(box, $('img:not(.nw)', box), ph.src, ph.alt, ph.w, ph.h, ph.pos);
  }
  var OUTDOORS = { src: '../../site/assets/outdoors.jpg', alt: 'A mother and her young son holding hands in a field of tall grass at sunset', pos: '50% 50%', w: 940, h: 627 };
  function renderScene(i) {
    var d = DAYS.days[cur], hr = d.hours[i], sc = scenes[i];
    setPhoto(sc, hr.photo || OUTDOORS);
    var q = $('.q', sc);
    if (i === 3) {
      splitQ(q, hr.proof.q);
      renderProof(sc, hr);
      setText($('.y', sc), hr.proof.y); setText($('.n', sc), hr.proof.n); setText($('.st', sc), hr.proof.src);
    } else {
      splitQ(q, hr.q);
      setText($('.f', sc), hr.f); setText($('.y', sc), hr.y); setText($('.n', sc), hr.n); setText($('.st', sc), hr.src);
      $('.rl-l', sc).innerHTML = mark(hr.line, hr.hl);
      $('.rl', sc).hidden = true;
      $('.src', sc).setAttribute('aria-expanded', 'false');
      if (i === 4) $('.facts', sc).innerHTML = hr.facts.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('');
    }
    sc.setAttribute('aria-label', hr.t + '. ' + (hr.q || hr.proof.q));
    sc.dataset.day = cur;
  }

  /* ---------- hero ---------- */
  var hero = $('#hero'), heroImg = $('#hero-img'), pick = $('#pick');
  var pickLinks = $$('a', pick);
  function renderHero() {
    var d = DAYS.days[cur], ph = d.hours[2].photo;
    swapImg($('.hero-ph'), heroImg, ph.src, ph.alt, ph.w, ph.h, ph.hpos || ph.pos);
    setText($('#hero-role'), 'The day of ' + d.role);
    paintPick();
  }
  function paintPick() {
    var idx = DAYS.order.indexOf(cur);
    pick.style.setProperty('--i', idx);
    pickLinks.forEach(function (a) {
      var on = a.dataset.day === cur;
      a.setAttribute('aria-checked', on ? 'true' : 'false');
      a.tabIndex = on ? 0 : -1;
      a.classList.toggle('on', on);
    });
    $('#prog-name').textContent = DAYS.days[cur].name;
    $$('#prog-pop button, #sheet-b .pk').forEach(function (b) { b.classList.toggle('on', b.dataset.day === cur); b.setAttribute('aria-checked', b.dataset.day === cur ? 'true' : 'false'); });
    var jq = $('#jq'); if (jq) jq.placeholder = DAYS.days[cur].hours[0].q;
  }

  /* ---------- state transitions: one grammar for everything ---------- */
  function preload(src) {
    return new Promise(function (res) {
      var im = new Image(); var done = false;
      function fin() { if (!done) { done = true; res(); } }
      im.onload = fin; im.onerror = fin; im.src = src;
      setTimeout(fin, 1200);
    });
  }
  function reflow(el) { void el.offsetWidth; }
  async function cycle(el, render, srcs) {
    var prev = el._p || Promise.resolve();
    var run = prev.then(async function () {
      var wasIn = el.classList.contains('in');
      el._busy = true;
      if (wasIn) el.classList.add('swp');
      // the old hour stays whole on screen until everything that replaces it has arrived
      if (srcs) await Promise.all(srcs().map(preload));
      if (anim && wasIn) {
        el.classList.remove('in'); el.classList.add('out');
        await sleep(170);
        el.classList.add('nt'); el.classList.remove('out'); reflow(el);
      }
      render();
      reflow(el);
      el.classList.remove('nt'); reflow(el);
      if (wasIn || el === hero) el.classList.add('in');
      el._busy = false;
      setTimeout(function () { if (!el._busy) el.classList.remove('swp'); }, 1400);
    });
    el._p = run.catch(function () {});
    return run;
  }
  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.bottom > 80 && r.top < innerHeight - 40;
  }
  function setDay(key, opts) {
    opts = opts || {};
    key = resolve(key);
    if (key === cur && shown === cur) return;
    cur = key;
    var u = new URL(location.href); u.searchParams.set('day', cur);
    try { history.replaceState(null, '', u.pathname + u.search + u.hash); } catch (e) { }
    proofState = { fig: 'a', rec: 0 };
    paintPick();
    var d = DAYS.days[cur];
    cycle(hero, function () { renderHero(); }, function () { return [d.hours[2].photo.src]; });
    var n = 0;
    scenes.forEach(function (sc, i) {
      var vis = pinned ? (i === pinCur && inView(dayEl)) : inView(sc), delay = vis ? n++ * 120 : 0;
      var go = function () {
        if (!vis) {
          // offscreen: rewrite quietly, and let it enter again when it is next seen
          if (sc.classList.contains('in')) { sc.classList.add('nt'); sc.classList.remove('in'); reflow(sc); sc.classList.remove('nt'); }
          renderScene(i);
          return Promise.resolve();
        }
        return cycle(sc, function () { renderScene(i); }, function () { return [(DAYS.days[cur].hours[i].photo || OUTDOORS).src]; });
      };
      if (delay) setTimeout(go, delay); else go();
    });
    shown = cur;
  }

  /* ---------- initial paint ---------- */
  function initialPaint() {
    renderHero();
    scenes.forEach(function (_, i) { renderScene(i); });
    shown = cur;
  }
  initialPaint();
  // pick links start as real links; with script they become the picker
  pick.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-day]');
    if (!a) return;
    e.preventDefault();
    setDay(a.dataset.day);
  });
  pick.addEventListener('keydown', function (e) {
    var a = e.target.closest('a[data-day]'); if (!a) return;
    var i = DAYS.order.indexOf(a.dataset.day), n = DAYS.order.length, t = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      t = (i + (e.key === 'ArrowDown' ? 1 : n - 1)) % n;
      e.preventDefault(); setDay(DAYS.order[t]); pickLinks[t].focus();
    } else if (e.key === ' ') { e.preventDefault(); setDay(a.dataset.day); }
  });

  /* ---------- reveal on view ---------- */
  var io = null;
  if (anim && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          if (!e.target.classList.contains('in')) {
            e.target.classList.add('in');
            if (e.target.id === 'hr4') startDemo();
          }
        }
      });
    }, { threshold: [0, .22], rootMargin: '0px 0px -6% 0px' });
    if (!pinned) all.forEach(function (s) { io.observe(s); });
    [$('.join'), $('.foot')].forEach(function (s) { io.observe(s); });
    requestAnimationFrame(function () { setTimeout(function () { hero.classList.add('in'); hero.classList.add('ld'); }, 60); });
  } else { hero.classList.add('in'); hero.classList.add('ld'); all.forEach(function (s) { s.classList.add('in'); }); }

  /* ---------- the 12:40 proof: click a figure, then a record. It shows itself once if untouched. ---------- */
  var s4 = scenes[3];
  function proofTouch() { demoCancel = true; demoDone = true; }
  s4.addEventListener('pointerdown', proofTouch);
  s4.addEventListener('keydown', proofTouch);
  s4.addEventListener('click', function (e) {
    var fg = e.target.closest('.fig');
    if (fg) { proofState = { fig: fg.dataset.k, rec: 0 }; paintProof(s4, DAYS.days[cur].hours[3]); return; }
    var rc = e.target.closest('.rec');
    if (rc) {
      var j = +rc.dataset.j;
      proofState.rec = proofState.rec === j ? -1 : j;
      paintProof(s4, DAYS.days[cur].hours[3]);
      var again = $('.rec[data-j="' + j + '"]', s4); if (again) again.focus();
    }
  });
  async function startDemo() {
    if (demoDone || !anim) return;
    demoDone = true; demoCancel = false;
    var hr = DAYS.days[cur].hours[3];
    proofState = { fig: null, rec: -1 };
    paintProof(s4, hr);
    await sleep(1500); if (demoCancel) return;
    proofState = { fig: 'a', rec: -1 }; paintProof(s4, hr);
    await sleep(1100); if (demoCancel) return;
    proofState = { fig: 'a', rec: 0 }; paintProof(s4, hr);
  }

  /* ---------- sheet ---------- */
  var sheet = $('#sheet'), sheetB = $('#sheet-b'), sheetP = $('#sheet-p'), sheetOpener = null;
  function openSheet(html, opener) {
    sheetB.innerHTML = html;
    sheetOpener = opener || null;
    sheet.hidden = false;
    reflow(sheet);
    sheet.classList.add('on'); R.classList.add('sheet-open');
    sheetP.style.transform = '';
    setTimeout(function () { var g = $('#sheet-grab'); if (g) g.focus({ preventScroll: true }); }, 30);
  }
  function closeSheet() {
    if (sheet.hidden) return;
    sheet.classList.remove('on'); R.classList.remove('sheet-open');
    setTimeout(function () { sheet.hidden = true; sheetB.innerHTML = ''; }, 320);
    if (sheetOpener && sheetOpener.focus) sheetOpener.focus({ preventScroll: true });
  }
  $('#sheet-bk').addEventListener('click', closeSheet);
  $('#sheet-grab').addEventListener('click', closeSheet);
  (function drag() {
    var y0 = null, dy = 0, t0 = 0;
    var g = $('#sheet-grab');
    g.addEventListener('pointerdown', function (e) { y0 = e.clientY; dy = 0; t0 = Date.now(); g.setPointerCapture(e.pointerId); sheetP.style.transition = 'none'; });
    g.addEventListener('pointermove', function (e) { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); sheetP.style.transform = 'translateY(' + dy + 'px)'; });
    function end() {
      if (y0 == null) return;
      sheetP.style.transition = '';
      var fast = dy / Math.max(1, Date.now() - t0) > .6;
      y0 = null;
      if (dy > 90 || fast) closeSheet(); else sheetP.style.transform = '';
      if (dy < 6) { /* a tap closes via the click handler */ }
    }
    g.addEventListener('pointerup', end); g.addEventListener('pointercancel', end);
  })();
  function sourceSheet(sc) {
    var i = +sc.dataset.i, d = DAYS.days[cur], hr = d.hours[i];
    var src = i === 3 ? hr.proof.src : hr.src, y = i === 3 ? hr.proof.y : hr.y, n = i === 3 ? hr.proof.n : hr.n;
    var rec = '';
    if (i === 3) {
      var p = hr.proof;
      rec = ['a', 'b'].map(function (k) {
        var label = ''; p.ans.forEach(function (x) { if (typeof x !== 'string' && x.k === k) label = x.t; });
        var r = p.figs[k][0];
        return '<div class="sh-rec"><p class="sh-rt">' + esc(label) + '</p><p class="sh-rn">' + esc(r.t) + ' <span>' + esc(r.s) + '</span></p><p class="sh-line"><span class="no">' + r.n + '</span><span class="tx">' + mark(r.line, r.hl) + '</span></p></div>';
      }).join('');
    } else {
      rec = '<div class="sh-rec"><p class="sh-rn">The record <span>line ' + (i + 3) + '</span></p><p class="sh-line"><span class="tx">' + mark(hr.line, hr.hl) + '</span></p></div>';
    }
    return '<h3 id="sheet-t">Where this answer came from</h3><p class="sh-p"><b>Why it matters.</b> ' + esc(y) + '</p><p class="sh-p"><b>Next step.</b> ' + esc(n) + '</p><p class="sh-src">Source: ' + esc(src) + '</p>' + rec + '<p class="sh-ex">Example data.</p>';
  }
  holder.addEventListener('click', function (e) {
    var b = e.target.closest('.src');
    if (!b) return;
    var sc = b.closest('.hr');
    if (isPhone()) { openSheet(sourceSheet(sc), b); return; }
    var i = +sc.dataset.i;
    if (i === 3) { openSheet(sourceSheet(sc), b); return; }
    var rl = $('.rl', sc), open = rl.hidden;
    rl.hidden = !open; b.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* ---------- picker list (day line + phone sheet) ---------- */
  var pop = $('#prog-pop'), chip = $('#prog-chip');
  function pickerHTML(cls) {
    return DAYS.order.map(function (k) {
      var d = DAYS.days[k];
      return '<button type="button" role="radio" class="' + cls + '" data-day="' + k + '" aria-checked="' + (k === cur) + '"><b>' + esc(d.name) + '</b><span>' + esc(d.short) + '</span></button>';
    }).join('');
  }
  pop.innerHTML = '<p class="pop-h">Whose day is this?</p>' + pickerHTML('pp');
  pop.setAttribute('role', 'radiogroup');
  paintPick();
  function popOpen() { pop.hidden = false; reflow(pop); pop.classList.add('on'); chip.setAttribute('aria-expanded', 'true'); var o = $('button.on', pop) || $('button', pop); if (o) o.focus({ preventScroll: true }); }
  function popClose(refocus) { if (pop.hidden) return; pop.classList.remove('on'); chip.setAttribute('aria-expanded', 'false'); setTimeout(function () { pop.hidden = true; }, 200); if (refocus) chip.focus({ preventScroll: true }); }
  function pickerSheet() {
    openSheet('<h3 id="sheet-t">Whose day is this?</h3><div class="sh-pick" role="radiogroup">' + pickerHTML('pk') + '</div>', chip);
  }
  chip.addEventListener('click', function () {
    if (isPhone()) { pickerSheet(); return; }
    pop.hidden ? popOpen() : popClose(true);
  });
  pop.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-day]'); if (!b) return;
    setDay(b.dataset.day); popClose(true);
  });
  pop.addEventListener('keydown', function (e) {
    var bs = $$('button', pop), i = bs.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); bs[(i + 1) % bs.length].focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); bs[(i + bs.length - 1) % bs.length].focus(); }
  });
  sheetB.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-day]'); if (!b) return;
    setDay(b.dataset.day); closeSheet();
  });
  document.addEventListener('pointerdown', function (e) {
    if (!pop.hidden && !e.target.closest('#prog')) popClose(false);
  });

  /* ---------- the pinned day: one full viewport per hour, each wiped in from below ---------- */
  var LEN = [.9, 1.1, 1.1, 1.8, 1.1, 1.1, 1.1, 1.0], starts = [], PD = 0, pvh = innerHeight;
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function pinLayout() {
    pvh = innerHeight; PD = .8 * pvh; starts = []; var acc = 0;
    LEN.forEach(function (l) { starts.push(acc); acc += l * pvh; });
    dayEl.style.height = (acc + pvh) + 'px';
  }
  function pinPos() {
    var y = scrollY - dayEl.offsetTop, st = dayEl.getBoundingClientRect().top, idx = -1, frac = 0;
    if (st < pvh * .55) idx = 0;
    for (var i = 1; i < all.length; i++) if (y >= starts[i] + PD * .5) idx = i;
    if (idx >= 0) {
      var lead = idx ? PD : 0;
      frac = clamp((y - starts[idx] - lead) / Math.max(1, LEN[idx] * pvh - lead), 0, 1);
    }
    return { idx: idx, frac: frac };
  }
  if (pinned) (function engine() {
    pinLayout();
    addEventListener('resize', pinLayout);
    var cur = 0, started = false, n = all.length;
    function frame() {
      var target = Math.max(0, scrollY - dayEl.offsetTop);
      if (!started) { cur = target; started = true; }
      cur += (target - cur) * .16;
      if (Math.abs(target - cur) < .4) cur = target;
      var y = cur, st = dayEl.getBoundingClientRect().top, o = [], e = [], k5 = 0, i;
      for (i = 0; i < n; i++) {
        var oi = i === 0 ? 1 : clamp((y - starts[i]) / PD, 0, 1);
        o.push(oi); e.push(ease(oi));
        if (oi >= .5) k5 = i;
      }
      pinCur = k5;
      for (i = 0; i < n; i++) {
        var sc = all[i], vis = !(i + 1 < n && o[i + 1] >= 1) && (i === 0 || o[i] > 0);
        sc.style.visibility = vis ? 'visible' : 'hidden';
        if (!vis) { if (!sc._busy && sc.classList.contains('in')) sc.classList.remove('in'); continue; }
        if (o[i] >= 1) sc.style.clipPath = 'none';
        else { var r = 1 - e[i], rad = (18 * r).toFixed(1); sc.style.clipPath = 'inset(' + (r * 100).toFixed(2) + '% 0 0 0 round ' + rad + 'px ' + rad + 'px 0 0)'; }
        var want = i === 0 ? st < pvh * .55 : o[i] >= .55;
        if (!sc._busy) {
          if (want && !sc.classList.contains('in')) { sc.classList.add('in'); if (i === 3) startDemo(); }
          else if (i === 0 && !want && st > pvh * .9 && sc.classList.contains('in')) sc.classList.remove('in');
        }
        var img = $('.ph img', sc);
        if (img) {
          var push = clamp((y - starts[i]) / (LEN[i] * pvh), 0, 1), nw = img.naturalWidth || 0, w = img.parentNode.clientWidth;
          var f = nw && nw >= w * 1.06 ? 1 + .045 * push : 1;
          img.style.transform = 'translate3d(0,' + ((1 - e[i]) * 4).toFixed(2) + '%,0) scale(' + f.toFixed(4) + ')';
        }
      }
      requestAnimationFrame(frame);
    }
    frame();
  })();

  /* ---------- progress ---------- */
  var prog = $('#prog'), track = $('#prog-track'), fill = $('#prog-fill'), ptime = $('#prog-time');
  var marks = all;
  marks.forEach(function (m, i) {
    var t = m.dataset.time;
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'tick'; b.style.left = (i / (marks.length - 1) * 100) + '%';
    b.setAttribute('aria-label', 'Go to ' + t); b.dataset.i = i;
    track.appendChild(b);
  });
  var ticks = $$('.tick', track);
  track.addEventListener('click', function (e) {
    var b = e.target.closest('.tick');
    if (b) { go(marks[+b.dataset.i]); return; }
    var r = track.getBoundingClientRect(), f = clamp((e.clientX - r.left) / r.width, 0, 1);
    go(marks[Math.round(f * (marks.length - 1))]);
  });
  prog.hidden = false;
  var lastIdx = -2;
  function onScroll() {
    var vh = innerHeight, y = scrollY, idx = -1, frac = 0;
    if (pinned) { var pp = pinPos(); idx = pp.idx; frac = pp.frac; }
    else {
      var tops = marks.map(function (m) { return m.getBoundingClientRect().top; });
      for (var i = 0; i < tops.length; i++) if (tops[i] <= vh * .45) idx = i;
      if (idx >= 0 && idx < tops.length - 1) frac = clamp((vh * .45 - tops[idx]) / (tops[idx + 1] - tops[idx]), 0, 1);
    }
    var joinTop = $('.join').getBoundingClientRect().top;
    var show = idx >= 0 && joinTop > vh * .6;
    prog.classList.toggle('on', show);
    var p = idx < 0 ? 0 : (idx + frac) / (marks.length - 1);
    fill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    if (idx !== lastIdx && idx >= 0) {
      lastIdx = idx;
      ptime.textContent = marks[idx].dataset.time;
      ticks.forEach(function (t, i) { t.classList.toggle('past', i <= idx); t.classList.toggle('now', i === idx); });
    }
    // the warm light of late afternoon
    var tt = idx < 0 ? 0 : (idx + frac) / (marks.length - 1), li = 0;
    if (tt > .45) li = clamp((tt - .45) / .4, 0, 1) * .12;
    if (tt > .85) li = .12 * (1 - clamp((tt - .85) / .1, 0, 1));
    $('.light').style.opacity = li.toFixed(3);
    if (!anim || pinned) return;
    // slow drift of large photographs
    for (var s = 0; s < scenes.length; s++) {
      var img = $('.ph img', scenes[s]);
      var r = img.parentNode.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) continue;
      var nw = img.naturalWidth || 0;
      if (nw < 1400 || r.width * 1.06 > nw || isPhone()) { img.style.transform = ''; continue; }
      var off = ((r.top + r.height / 2) - vh / 2) / vh;
      img.style.transform = 'translate3d(0,' + (-off * 22).toFixed(1) + 'px,0) scale(1.06)';
    }
  }
  var ticking = false;
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; onScroll(); }); } }, { passive: true });
  addEventListener('resize', onScroll);

  /* ---------- keys: left and right move hour to hour ---------- */
  var stops = [hero].concat(all).concat([$('.join')]);
  function reduced() { return !anim; }
  function yOf(el) {
    var i = all.indexOf(el);
    if (pinned && i >= 0) return dayEl.offsetTop + starts[i] + (i ? PD + 2 : 0);
    return el.getBoundingClientRect().top + scrollY;
  }
  function go(el) {
    if (!el) return;
    scrollTo({ top: Math.max(0, yOf(el)), behavior: reduced() ? 'auto' : 'smooth' });
  }
  function curStop() {
    var k = 0;
    for (var i = 0; i < stops.length; i++) if (yOf(stops[i]) <= scrollY + 8) k = i;
    return k;
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var t = e.target;
    if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
    if (t && t.closest && t.closest('.nav-main, .dd')) return;
    if (R.classList.contains('sheet-open') || R.classList.contains('menu-open') || R.classList.contains('dd-open')) return;
    var k = curStop(), nx = clamp(k + (e.key === 'ArrowRight' ? 1 : -1), 0, stops.length - 1);
    if (nx === k) return;
    e.preventDefault(); go(stops[nx]);
  });

  /* ---------- navigation: dropdowns ---------- */
  $$('.dd-links').forEach(function (g) { $$('a', g).forEach(function (a, i) { a.style.setProperty('--k', i); }); });
  var nav = $('#nav'), scrim = $('#scrim');
  var btns = $$('.dd-btn'), openBtn = null, hoverT = null, closeT = null;
  function panelOf(b) { return document.getElementById(b.getAttribute('aria-controls')); }
  function ddOpen(b, focusFirst) {
    clearTimeout(closeT);
    if (openBtn === b) return;
    if (openBtn) ddCloseNow(false);
    openBtn = b; b.setAttribute('aria-expanded', 'true');
    var p = panelOf(b); p.hidden = false; reflow(p); p.classList.add('on');
    scrim.hidden = false; reflow(scrim); scrim.classList.add('on');
    R.classList.add('dd-open');
    if (focusFirst) { var a = $('a', p); if (a) a.focus(); }
  }
  function ddCloseNow(refocus) {
    if (!openBtn) return;
    var b = openBtn, p = panelOf(b); openBtn = null;
    b.setAttribute('aria-expanded', 'false'); p.classList.remove('on');
    setTimeout(function () { if (openBtn !== b) p.hidden = true; }, 220);
    scrim.classList.remove('on'); setTimeout(function () { if (!openBtn) scrim.hidden = true; }, 220);
    R.classList.remove('dd-open');
    if (refocus) b.focus();
  }
  btns.forEach(function (b, i) {
    b.addEventListener('click', function () { openBtn === b ? ddCloseNow(false) : ddOpen(b); });
    b.parentNode.addEventListener('mouseenter', function () { if (isNarrow() || !matchMedia('(hover:hover)').matches) return; clearTimeout(hoverT); hoverT = setTimeout(function () { ddOpen(b); }, 70); });
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); ddOpen(b, true); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); btns[(i + 1) % btns.length].focus(); if (openBtn) ddOpen(btns[(i + 1) % btns.length]); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); btns[(i + btns.length - 1) % btns.length].focus(); if (openBtn) ddOpen(btns[(i + btns.length - 1) % btns.length]); }
    });
  });
  nav.addEventListener('mouseleave', function () { clearTimeout(hoverT); closeT = setTimeout(function () { ddCloseNow(false); }, 160); });
  nav.addEventListener('mouseenter', function () { clearTimeout(closeT); });
  $$('.dd', nav).forEach(function (p) {
    p.addEventListener('keydown', function (e) {
      var links = $$('a', p), i = links.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); links[(i + 1) % links.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); links[(i + links.length - 1) % links.length].focus(); }
    });
  });
  scrim.addEventListener('click', function () { ddCloseNow(false); });
  nav.addEventListener('focusout', function (e) {
    if (!openBtn) return;
    var n = e.relatedTarget; if (n && nav.contains(n)) return;
    if (n === null) return;
    ddCloseNow(false);
  });
  document.addEventListener('pointerdown', function (e) { if (openBtn && !nav.contains(e.target)) ddCloseNow(false); });

  /* ---------- navigation: phone menu ---------- */
  var burger = $('.burger'), mnav = $('#mnav');
  function menu(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) { mnav.hidden = false; reflow(mnav); mnav.classList.add('on'); R.classList.add('menu-open'); }
    else { mnav.classList.remove('on'); R.classList.remove('menu-open'); setTimeout(function () { if (!R.classList.contains('menu-open')) mnav.hidden = true; }, 260); }
  }
  burger.addEventListener('click', function () { menu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('.acc > button', mnav).forEach(function (b) {
    b.addEventListener('click', function () {
      var p = document.getElementById(b.getAttribute('aria-controls')), o = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', o ? 'false' : 'true'); p.hidden = o;
    });
  });
  mnav.addEventListener('click', function (e) { if (e.target.closest('a')) menu(false); });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!sheet.hidden) { closeSheet(); return; }
    if (!pop.hidden) { popClose(true); return; }
    if (openBtn) { ddCloseNow(true); return; }
    if (R.classList.contains('menu-open')) { menu(false); burger.focus(); }
  });
  addEventListener('resize', function () { if (!isNarrow() && R.classList.contains('menu-open')) menu(false); });

  /* ---------- join (front end only) ---------- */
  var jf = $('#jf'), jok = $('#jok');
  jf.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = null;
    $$('input,textarea', jf).forEach(function (f) {
      var ok = f.value.trim() && (f.type !== 'email' || /^\S+@\S+\.\S+$/.test(f.value.trim()));
      f.classList.toggle('bad', !ok); if (!ok && !bad) bad = f;
    });
    if (bad) { bad.focus(); return; }
    $('#jok-q').textContent = $('#jq').value.trim();
    jf.hidden = true; jok.hidden = false; jok.focus({ preventScroll: true });
    jok.classList.remove('in'); reflow(jok); jok.classList.add('in');
  });
  jf.addEventListener('input', function (e) { e.target.classList.remove('bad'); });

  /* ---------- review states ---------- */
  var op = qs.get('open');
  if (op) {
    setTimeout(function () {
      if (op === 'nav') { if (isNarrow()) menu(true); else ddOpen(btns[1]); }
      if (op === 'sheet') { scrollTo(0, yOf(scenes[0])); setTimeout(function () { onScroll(); sourceFirst(); }, 700); }
      if (op === 'picker') { scrollTo(0, yOf(scenes[2])); setTimeout(function () { onScroll(); isPhone() ? pickerSheet() : popOpen(); }, 900); }
      if (op === 'proof') { scrollTo(0, yOf(scenes[3])); }
    }, 500);
  }
  function sourceFirst() { var b = $('.src', scenes[0]); if (b) b.click(); }
  if (/#hr\d/.test(location.hash)) { var tg = document.querySelector(location.hash); if (tg) setTimeout(function () { go(tg); }, 100); }
  var wasPhone = isPhone();
  addEventListener('resize', function () { if (isPhone() !== wasPhone) location.reload(); });
  onScroll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(onScroll);
})();
