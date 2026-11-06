(function () {
  var D = window.LL_DAYS, R = document.documentElement;
  var qs = new URLSearchParams(location.search);
  var anim = R.classList.contains('anim'), STATIC = qs.get('static') === '1';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function reflow(el) { void el.offsetWidth; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function isPhone() { return matchMedia('(max-width:960px)').matches; }
  var navH = function () { return isPhone() ? 56 : 68; };
  var smooth = anim ? 'smooth' : 'auto';

  /* ---------- data ---------- */
  function resolve(k) { if (!k) return null; k = String(k).toLowerCase(); if (D.days[k]) return k; return D.alias[k] || null; }
  var key = resolve(qs.get('day')) || D.def;
  var H = [], EVE = null, DAY = null;
  function plain(parts) { return parts.map(function (p) { return typeof p === 'string' ? p : p.t; }).join(''); }
  function norm(h) {
    var o = { t: h.t, photo: h.photo };
    if (h.proof) {
      var p = h.proof;
      o.proof = true; o.q = p.q; o.ans = p.ans; o.y = p.y; o.n = p.n; o.src = p.src; o.figs = p.figs;
      o.f = plain(p.ans); o.line = p.figs.a[0].line; o.hl = p.figs.a[0].hl;
    } else { o.q = h.q; o.f = h.f; o.y = h.y; o.n = h.n; o.src = h.src; o.line = h.line; o.hl = h.hl; o.facts = h.facts; }
    return o;
  }
  function load(k) {
    key = k; DAY = D.days[k];
    H = DAY.hours.slice(0, 6).map(norm);
    EVE = norm(DAY.hours[6]);
  }
  function mark(line, hl) {
    var i = hl ? line.indexOf(hl) : -1;
    if (i < 0) return esc(line);
    return esc(line.slice(0, i)) + '<mark>' + esc(hl) + '</mark>' + esc(line.slice(i + hl.length));
  }
  function checked(src) {
    return src.replace(/\.$/, '').split(/,\s+(?=the\s)|\s+and\s+/i).map(function (s) {
      s = s.replace(/^(the|your)\s+/i, '').trim();
      return s.charAt(0).toUpperCase() + s.slice(1);
    }).filter(Boolean);
  }
  function words(text, start) {
    var i = start || 0;
    return (text.match(/\S+\s*|\s+/g) || []).map(function (w) { return '<span class="w" style="--i:' + (i++) + '">' + esc(w) + '</span>'; }).join('');
  }
  function ansHTML(parts) {
    var out = '', i = 0, afterFig = false;
    parts.forEach(function (p) {
      if (typeof p === 'string') {
        var m = afterFig ? p.match(/^[.,;:]+/) : null;
        if (m) { out = out.replace(/<\/button><\/span>$/, esc(m[0]) + '</button></span>'); p = p.slice(m[0].length); }
        out += words(p, i); i += 4; afterFig = false;
      } else {
        out += '<span class="w" style="--i:' + (i++) + '"><button class="fig" type="button" data-k="' + p.k + '" aria-expanded="false">' + esc(p.t) + '</button></span>';
        afterFig = true;
      }
    });
    return out;
  }

  /* ---------- hero thread ---------- */
  var winB = $('#win-b');
  function renderHero(swap) {
    var seq = [
      '<p class="stamp"><time>Today, 6:40 PM</time></p>',
      '<div class="m me"><p>' + esc(EVE.q) + '</p></div>',
      '<div class="m ar last"><p>' + esc(EVE.f) + '</p></div>',
      '<button class="src" type="button" data-hero="1" aria-expanded="false"><b>Source</b><span>' + esc(EVE.src) + '</span></button>',
      '<div class="rec" hidden></div>',
      '<p class="stamp"><time>7:15 PM</time></p>',
      '<div class="m ar last"><p>Anything else before you go?</p></div>',
      '<div class="m me"><p>No. I am at dinner.</p></div>',
      '<p class="rcpt">Read 7:15 PM</p>'
    ];
    winB.classList.toggle('swap', !!(swap && anim));
    winB.innerHTML = seq.map(function (s, i) { return s.replace(/^<(\w+)/, '<$1 style="--k:' + i + '"'); }).join('');
    renderChips(Math.max(0, active));
    winB.scrollTop = winB.scrollHeight;
    $$('#pick button').forEach(function (b) { b.setAttribute('aria-checked', b.dataset.day === key ? 'true' : 'false'); b.tabIndex = b.dataset.day === key ? 0 : -1; });
  }
  var chipFor = -2;
  function renderChips(a) {
    if (a === chipFor) return; chipFor = a;
    var all = H.concat([EVE]), out = [];
    for (var k = 1; k <= all.length - 1; k++) out.push(all[(a + k) % all.length]);
    $('#chips').innerHTML = out.map(function (h) { return '<button type="button">' + esc(h.q) + '</button>'; }).join('');
  }

  /* ---------- the day ---------- */
  var hoursEl = $('#hours'), sideEl = $('#side'), railList = $('#rail-list');
  function hourHTML(h, i) {
    var ph = h.photo;
    var img = ph ? '<figure class="ph-msg ri"><img src="' + ph.src + '" width="' + ph.w + '" height="' + ph.h + '" alt="' + esc(ph.alt) + '" loading="lazy" style="object-position:' + (ph.pos || '50% 40%') + '"></figure>' : '';
    var f = h.proof ? ansHTML(h.ans) : words(h.f);
    var tail = h.proof
      ? '<p class="hint ri">Select a figure to see the records behind it.</p><div class="rec" hidden></div>'
      : '<button class="src ri" type="button" aria-expanded="false"><b>Source</b><span>' + esc(h.src) + '</span></button><div class="rec" hidden></div>';
    return '<article class="hg' + (h.proof ? ' proof' : '') + '" id="h' + i + '" data-i="' + i + '" aria-label="' + esc(h.t) + '">' +
      '<p class="stamp ri"><time>' + esc(h.t) + '</time></p>' + img +
      '<div class="m me ri"><p>' + esc(h.q) + '</p></div>' +
      '<div class="fw"><span class="typing" aria-hidden="true"><i></i><i></i><i></i></span><div class="m ar f ri"><p>' + f + '</p></div></div>' +
      '<div class="m ar y ri"><p>' + esc(h.y) + '</p></div>' +
      '<div class="m ar n last ri"><p><b>Next.</b> ' + esc(h.n) + '</p></div>' + tail + '</article>';
  }
  function sideHTML(h, i) {
    var ph = h.photo;
    return '<div class="side-i" data-i="' + i + '"><figure><img src="' + ph.src + '" width="' + ph.w + '" height="' + ph.h + '" alt="" style="object-position:' + (ph.hpos || ph.pos || '50% 40%') + '"' + (i ? ' loading="lazy"' : '') + '><figcaption><b>' + esc(h.t) + '</b>' + esc(ph.alt) + '.</figcaption></figure>' +
      '<div class="sline"><b>The line it came from</b><p>' + mark(h.line, h.hl) + '</p><small>' + esc(h.src) + ' Example data.</small></div>' +
      '<div class="chk"><b>Checked for this answer</b><ul>' + checked(h.src).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></div></div>';
  }
  var groups = [], io = null, active = -1;
  function renderDay() {
    cancelDemo();
    hoursEl.innerHTML = H.map(hourHTML).join('');
    sideEl.innerHTML = H.map(sideHTML).join('');
    railList.innerHTML = H.map(function (h, i) { return '<li data-i="' + i + '"><button type="button" aria-label="Jump to ' + esc(h.t) + '"><time>' + esc(h.t) + '</time><span class="rq">' + esc(h.q) + '</span></button></li>'; }).join('');
    groups = $$('.hg:not(.hf)');
    PS = { fig: null, rec: -1, h: 3 };
    if (io) io.disconnect();
    if (anim) {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('on'); io.unobserve(e.target);
          if (e.target.classList.contains('proof')) startDemo(e.target);
        });
      }, { rootMargin: '0px 0px -14% 0px', threshold: 0.04 });
      $$('.hg').forEach(function (g) { io.observe(g); });
    } else {
      $$('.hg').forEach(function (g) { g.classList.add('on'); });
      if (STATIC && !isPhone()) { PS = { fig: 'a', rec: 0, h: 3 }; paintProof(); }
    }
    active = -1; setActive(0, true); onScroll();
  }
  function setDay(k, user) {
    if (k === key && !user) return;
    load(k);
    if (user) { var u = new URL(location.href); u.searchParams.set('day', k); history.replaceState(null, '', u); }
    var swap = function () { chipFor = -2; renderHero(true); renderDay(); };
    if (anim && user) {
      var th = $('#thread'); th.style.transition = 'opacity .25s'; th.style.opacity = 0;
      setTimeout(function () { swap(); th.style.opacity = 1; }, 230);
    } else swap();
  }

  /* ---------- active hour, progress, rail ---------- */
  var rail = $('#rail'), railFill = $('#rail-fill'), clockB = $('#rail-clock b'), clockI = $('#rail-clock i'), thNow = $('#th-now');
  function setActive(i, force) {
    if (i === active && !force) return;
    active = i;
    var a = Math.max(0, i);
    $$('.rail-list li').forEach(function (li, j) { li.classList.toggle('on', j === i); li.classList.toggle('past', j < i); });
    $$('.side-i').forEach(function (s, j) { s.classList.toggle('on', j === a); });
    var t = H[a].t.split(' ');
    clockB.textContent = t[0]; clockI.textContent = t[1]; thNow.textContent = H[a].t; $('#th-q').textContent = H[a].q; $('#rail-q').textContent = H[a].q; renderChips(a);
    if (isPhone() && i >= 0) {
      var li = $('.rail-list li.on'); if (li) railList.scrollTo({ left: Math.max(0, li.offsetLeft - 12), behavior: smooth });
    }
  }
  var tick = false;
  function onScroll() { if (!tick) { tick = true; requestAnimationFrame(update); } }
  function update() {
    tick = false;
    var vh = innerHeight, y = vh * 0.42, ph = isPhone();
    var hero = $('#hero').getBoundingClientRect(), end = $('#end').getBoundingClientRect(), join = $('#join').getBoundingClientRect();
    R.classList.toggle('rail-on', ph && hero.bottom < navH() + 40 && end.top > vh * 0.5);
    R.classList.toggle('dock-off', ph && (end.top < vh * 0.8));
    if (!groups.length) return;
    var idx = -1;
    groups.forEach(function (g, i) { if (g.getBoundingClientRect().top < vh * 0.62) idx = i; });
    if (hero.bottom > vh * 0.7) idx = -1;
    setActive(idx < 0 ? 0 : idx);
    var t0 = groups[0].getBoundingClientRect().top, tl = groups[groups.length - 1].getBoundingClientRect().top;
    var p = tl - t0 > 1 ? clamp((y - t0) / (tl - t0 + 200), 0, 1) : 0;
    if (idx < 0) p = 0;
    rail.style.setProperty('--p', p.toFixed(4));
    if (!ph) { var lt = railList.offsetTop; rail.style.setProperty('--rt', lt + 'px'); }
    $('#end').classList.toggle('in', end.top < vh * 0.6);
    var z = clamp((vh - end.top) / (vh + end.height * 0.4), 0, 1);
    $('#end').style.setProperty('--z', (anim ? z : 1).toFixed(3));
    R.style.setProperty('--dock', Math.round($('#dock').getBoundingClientRect().height) + 'px');
    void join;
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);

  function go(el, off) {
    var y = el.getBoundingClientRect().top + scrollY - (off == null ? navH() + (isPhone() ? 78 : 0) + 56 : off);
    scrollTo({ top: Math.max(0, y), behavior: smooth });
  }
  railList.addEventListener('click', function (e) {
    var li = e.target.closest('li'); if (!li) return;
    go(groups[+li.dataset.i]);
  });
  $('#cue').addEventListener('click', function (e) { e.preventDefault(); go(groups[0]); });

  /* ---------- sources and the proof moment ---------- */
  var PS = { fig: null, rec: -1, h: 3 };
  var sheet = $('#sheet'), sheetB = $('#sheet-b'), sheetP = $('#sheet-p'), sheetOpener = null, userTouched = false;
  function srcHTML(h) {
    return '<p class="rec-t">' + esc(h.src) + '</p><p class="rec-l">' + mark(h.line, h.hl) + '</p><p class="rec-x">Example data.</p>';
  }
  function proofHTML() {
    var h = H[PS.h]; if (!PS.fig) return '';
    var fig = h.ans.filter(function (p) { return typeof p !== 'string' && p.k === PS.fig; })[0];
    var rows = h.figs[PS.fig].map(function (r, j) {
      return '<div class="rw"><button class="row" type="button" data-j="' + j + '" aria-expanded="' + (j === PS.rec) + '"><b>' + esc(r.t) + '</b><small>' + esc(r.s) + ', ' + r.n + ' records</small></button>' +
        (j === PS.rec ? '<p class="row-l">' + mark(r.line, r.hl) + '</p>' : '') + '</div>';
    }).join('');
    return '<p class="rec-t">Where &ldquo;' + esc(fig.t) + '&rdquo; came from</p><div class="rows">' + rows + '</div><p class="rec-x">Example data.</p>';
  }
  function showRec(rec, html) {
    if (!html) { rec.classList.remove('on'); setTimeout(function () { if (!rec.classList.contains('on')) rec.hidden = true; }, 360); return; }
    rec.innerHTML = html; rec.hidden = false; reflow(rec); rec.classList.add('on');
  }
  function paintProof() {
    var g = $('#h' + PS.h); if (!g) return;
    $$('.fig', g).forEach(function (b) { b.setAttribute('aria-expanded', b.dataset.k === PS.fig ? 'true' : 'false'); });
    if (isPhone()) { if (!sheet.hidden) sheetB.innerHTML = '<h3>Where this came from</h3><div class="rec on">' + proofHTML() + '</div>'; return; }
    showRec($('.rec', g), proofHTML());
  }
  var demoCancel = false, demoRan = false;
  function cancelDemo() { demoCancel = true; demoRan = false; }
  async function startDemo(g) {
    if (demoRan || isPhone() || STATIC) return;
    demoRan = true; demoCancel = false; userTouched = false;
    await sleep(3400); if (demoCancel || userTouched) return;
    PS = { fig: 'a', rec: -1, h: +g.dataset.i }; paintProof();
    await sleep(1300); if (demoCancel || userTouched) return;
    PS.rec = 0; paintProof();
  }
  hoursEl.addEventListener('click', function (e) {
    var g = e.target.closest('.hg'); if (!g) return;
    var i = +g.dataset.i, h = H[i];
    var fig = e.target.closest('.fig'), src = e.target.closest('.src'), row = e.target.closest('.row');
    if (fig || row) userTouched = true;
    if (fig) {
      PS.h = i; var same = PS.fig === fig.dataset.k;
      PS.fig = same && !isPhone() ? null : fig.dataset.k; PS.rec = -1;
      if (isPhone()) { openSheet('<h3>Where this came from</h3><div class="rec on">' + proofHTML() + '</div>', fig); }
      paintProof();
    } else if (row && !isPhone()) {
      var j = +row.dataset.j; PS.rec = PS.rec === j ? -1 : j; paintProof();
    } else if (src) {
      if (isPhone()) { openSheet('<h3>Where this came from</h3><div class="rec on">' + srcHTML(h) + '</div>', src); return; }
      var rec = $('.rec', g), open = src.getAttribute('aria-expanded') === 'true';
      src.setAttribute('aria-expanded', open ? 'false' : 'true');
      showRec(rec, open ? '' : srcHTML(h));
    }
  });
  sheetB.addEventListener('click', function (e) {
    var row = e.target.closest('.row'); if (!row) return;
    var j = +row.dataset.j; PS.rec = PS.rec === j ? -1 : j; paintProof();
  });

  /* ---------- sheet ---------- */
  function openSheet(html, opener) {
    sheetB.innerHTML = html; sheetOpener = opener || null;
    sheet.hidden = false; reflow(sheet); sheet.classList.add('on'); R.classList.add('sheet-open'); sheetP.style.transform = '';
    setTimeout(function () { $('#sheet-grab').focus({ preventScroll: true }); }, 30);
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
    var y0 = null, dy = 0, t0 = 0, g = $('#sheet-grab');
    g.addEventListener('pointerdown', function (e) { y0 = e.clientY; dy = 0; t0 = Date.now(); g.setPointerCapture(e.pointerId); sheetP.style.transition = 'none'; });
    g.addEventListener('pointermove', function (e) { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); sheetP.style.transform = 'translateY(' + dy + 'px)'; });
    function end() { if (y0 == null) return; sheetP.style.transition = ''; var fast = dy / Math.max(1, Date.now() - t0) > .6; y0 = null; if (dy > 90 || fast) closeSheet(); else sheetP.style.transform = ''; }
    g.addEventListener('pointerup', end); g.addEventListener('pointercancel', end);
  })();

  /* ---------- the composer ---------- */
  var STOP = 'that this with have from your what which when where does about there their they been were will would could should into than then them also just more most some such only over very still tonight today'.split(' ');
  function toks(s) { return (s.toLowerCase().match(/[a-z]{4,}/g) || []).filter(function (w) { return STOP.indexOf(w) < 0; }).map(function (w) { return w.replace(/(ing|ed|es|s)$/, ''); }); }
  function match(text) {
    var all = H.concat([EVE]), t = toks(text), best = null, bs = 0;
    all.forEach(function (h) {
      if (h.q.toLowerCase() === text.toLowerCase()) { best = h; bs = 99; return; }
      var pool = toks(h.q + ' ' + h.f + ' ' + h.src), s = 0;
      t.forEach(function (w) { if (pool.indexOf(w) >= 0) s++; });
      if (s > bs) { bs = s; best = h; }
    });
    return bs >= 2 ? best : null;
  }
  var FALL = { f: 'That one is not in this example day.', y: 'With your own records connected, I would answer it from them, and show the line each figure came from.', n: 'Try one of the questions above, or bring your own question to the form below.' };
  function bubbles(r) {
    var h = r || FALL;
    return '<div class="m ar f"><p>' + esc(h.f) + '</p></div><div class="m ar y"><p>' + esc(h.y) + '</p></div><div class="m ar n last"><p><b>Next.</b> ' + esc(h.n) + '</p></div>';
  }
  var asking = false;
  async function ask(text) {
    text = (text || '').trim(); if (!text || asking) return;
    asking = true;
    var r = match(text);
    if (isPhone()) {
      openSheet('<h3>Your question</h3><div class="sh-thread"><div class="m me"><p>' + esc(text) + '</p></div><div class="m ar last typ"><span class="dots"><i></i><i></i><i></i></span></div></div>', $('#comp-in'));
      await sleep(anim ? 900 : 0);
      $('.sh-thread', sheetB).innerHTML = '<div class="m me"><p>' + esc(text) + '</p></div>' + bubbles(r) +
        (r ? '<div class="rec on" style="margin-top:12px">' + srcHTML(r) + '</div>' : '');
    } else {
      var add = function (html) { var d = document.createElement('div'); d.innerHTML = html; var n = d.firstElementChild; n.classList.add('add'); n.style.setProperty('--k', 0); winB.appendChild(n); winB.scrollTo({ top: winB.scrollHeight, behavior: smooth }); return n; };
      add('<div class="m me"><p>' + esc(text) + '</p></div>');
      var ty = add('<div class="m ar last typ"><span class="dots"><i></i><i></i><i></i></span></div>');
      await sleep(anim ? 900 : 0); ty.remove();
      var wrap = document.createElement('div'); wrap.innerHTML = bubbles(r);
      var items = Array.prototype.slice.call(wrap.children);
      for (var i = 0; i < items.length; i++) { items[i].classList.add('add'); winB.appendChild(items[i]); winB.scrollTo({ top: winB.scrollHeight, behavior: smooth }); await sleep(anim ? 380 : 0); }
      if (r) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'src add'; b.style.marginLeft = '44px';
        b.setAttribute('aria-expanded', 'false'); b.innerHTML = '<b>Source</b><span>' + esc(r.src) + '</span>';
        var rec = document.createElement('div'); rec.className = 'rec'; rec.hidden = true; rec.style.marginLeft = '44px';
        b.addEventListener('click', function () { var o = b.getAttribute('aria-expanded') === 'true'; b.setAttribute('aria-expanded', o ? 'false' : 'true'); showRec(rec, o ? '' : srcHTML(r)); setTimeout(function () { winB.scrollTo({ top: winB.scrollHeight, behavior: smooth }); }, 60); });
        winB.appendChild(b); winB.appendChild(rec);
      }
      winB.scrollTo({ top: winB.scrollHeight, behavior: smooth });
    }
    asking = false;
  }
  $('#comp').addEventListener('submit', function (e) { e.preventDefault(); var i = $('#comp-in'); var v = i.value; i.value = ''; ask(v); });
  $('#chips').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) ask(b.textContent); });
  winB.addEventListener('click', function (e) {
    var b = e.target.closest('.src[data-hero]'); if (!b) return;
    if (isPhone()) { openSheet('<h3>Where this came from</h3><div class="rec on">' + srcHTML(EVE) + '</div>', b); return; }
    var rec = b.nextElementSibling, o = b.getAttribute('aria-expanded') === 'true';
    b.setAttribute('aria-expanded', o ? 'false' : 'true'); showRec(rec, o ? '' : srcHTML(EVE));
    setTimeout(function () { winB.scrollTo({ top: winB.scrollHeight, behavior: smooth }); }, 60);
  });
  $('#pick').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setDay(b.dataset.day, true); });
  $('#pick').addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    var o = D.order, i = o.indexOf(key), n = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : -1;
    var nk = o[(i + n + o.length) % o.length]; setDay(nk, true);
    setTimeout(function () { var b = $('#pick [aria-checked=true]'); if (b) b.focus(); }, 300);
  });

  /* ---------- keyboard: hour to hour ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var t = e.target;
    if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
    if (t && t.closest && t.closest('.nav-main, .dd, #pick')) return;
    if (R.classList.contains('sheet-open') || R.classList.contains('menu-open') || R.classList.contains('dd-open')) return;
    var stops = [$('#hero')].concat(groups, [$('#end')]);
    var vh = innerHeight, k = 0;
    stops.forEach(function (s, i) { if (s.getBoundingClientRect().top < vh * 0.5) k = i; });
    var nx = clamp(k + (e.key === 'ArrowRight' ? 1 : -1), 0, stops.length - 1);
    if (nx === k) return;
    e.preventDefault();
    var s = stops[nx];
    if (s.id === 'hero') scrollTo({ top: 0, behavior: smooth });
    else if (s.id === 'end') scrollTo({ top: s.getBoundingClientRect().top + scrollY, behavior: smooth });
    else go(s);
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
    b.parentNode.addEventListener('mouseenter', function () { if (isPhone() || !matchMedia('(hover:hover)').matches) return; clearTimeout(hoverT); hoverT = setTimeout(function () { ddOpen(b); }, 70); });
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
    if (openBtn) { ddCloseNow(true); return; }
    if (R.classList.contains('menu-open')) { menu(false); burger.focus(); }
  });
  addEventListener('resize', function () { if (!isPhone() && R.classList.contains('menu-open')) menu(false); });

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
  if (anim) {
    var jn = $('#join');
    new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { jn.classList.add('in'); o.disconnect(); } }); }, { threshold: .15 }).observe(jn);
  }

  /* ---------- go ---------- */
  load(key); renderHero(); renderDay();
  var op = window.__OPEN || qs.get('open');
  if (op) {
    setTimeout(function () {
      if (op === 'nav') { if (isPhone()) menu(true); else ddOpen(btns[1]); }
      if (op === 'sheet') { go(groups[0]); setTimeout(function () { var s = $('.src', groups[0]); if (s) s.click(); }, 700); }
      if (op === 'proof') { go(groups[3]); }
      if (op === 'ask') { ask('Which classrooms are short of a teacher?'); }
    }, 500);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(onScroll);
})();
