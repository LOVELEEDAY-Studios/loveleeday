(function () {
  'use strict';
  var root = document.documentElement;
  var mob = root.classList.contains('m'), stat = root.classList.contains('st'), rm = root.classList.contains('rm');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  /* ---------------- navigation menus ---------------- */
  var items = $$('.nav-item'), openItem = null, hoverT = null, canHover = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;
  function trig(it) { return $('.nav-t', it); }
  function place(it) {
    var p = $('.pnl', it), r = trig(it).getBoundingClientRect(), w = p.offsetWidth || 880;
    p.style.setProperty('--px', clamp(r.left - 14, 20, Math.max(20, innerWidth - w - 20)) + 'px');
  }
  function openM(it, focusFirst) {
    if (openItem && openItem !== it) closeM(openItem);
    it.classList.add('open'); trig(it).setAttribute('aria-expanded', 'true'); place(it); openItem = it;
    if (focusFirst) { var a = $('.pnl a', it); if (a) a.focus(); }
  }
  function closeM(it, refocus) {
    if (!it) return;
    it.classList.remove('open'); trig(it).setAttribute('aria-expanded', 'false');
    if (openItem === it) openItem = null;
    if (refocus) trig(it).focus();
  }
  items.forEach(function (it, idx) {
    var t = trig(it), p = $('.pnl', it);
    t.addEventListener('click', function () { it.classList.contains('open') ? closeM(it) : openM(it); });
    if (canHover) {
      it.addEventListener('mouseenter', function () { clearTimeout(hoverT); hoverT = setTimeout(function () { openM(it); }, openItem ? 0 : 90); });
      it.addEventListener('mouseleave', function () { clearTimeout(hoverT); hoverT = setTimeout(function () { closeM(it); }, 200); });
    }
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); openM(it, true); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault(); e.stopPropagation();
        var nx = items[(idx + (e.key === 'ArrowRight' ? 1 : items.length - 1)) % items.length], was = !!openItem;
        trig(nx).focus(); if (was) openM(nx);
      }
    });
    p.addEventListener('keydown', function (e) {
      var links = $$('a', p), i = links.indexOf(document.activeElement);
      if (e.key === 'Escape') { e.stopPropagation(); closeM(it, true); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); links[(i + 1) % links.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (i <= 0) trig(it).focus(); else links[i - 1].focus(); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') e.stopPropagation();
    });
    it.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !it.contains(e.relatedTarget)) closeM(it);
    });
  });
  document.addEventListener('click', function (e) { if (openItem && !e.target.closest('.nav-item')) closeM(openItem); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openItem) closeM(openItem, true); });
  addEventListener('resize', function () { if (openItem) place(openItem); });

  /* ---------------- phone menu ---------------- */
  var burger = $('#burger'), mm = $('#mm'), mmIn = $('#mm-in');
  mmIn.innerHTML = items.map(function (it) {
    var pgs = $$('.pg', it), multi = pgs.length > 1;
    var body = pgs.map(function (pg) {
      return (multi ? '<h3>' + $('h3', pg).textContent + '</h3>' : '') + $$('a', pg).map(function (a) {
        return '<a href="' + a.getAttribute('href') + '"><b>' + $('b', a).textContent + '</b><small>' + $('small', a).textContent + '</small></a>';
      }).join('');
    }).join('');
    return '<div class="mm-g1"><button type="button" aria-expanded="false">' + trig(it).textContent + '</button><div class="mm-l"><div>' + body + '</div></div></div>';
  }).join('');
  $$('.mm-g1 > button', mmIn).forEach(function (b) {
    b.addEventListener('click', function () {
      var g = b.parentNode, o = !g.classList.contains('open');
      $$('.mm-g1', mmIn).forEach(function (x) { x.classList.remove('open'); $('button', x).setAttribute('aria-expanded', 'false'); });
      if (o) { g.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
    });
  });
  function menu(open) {
    mm.hidden = !open; burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    root.classList.toggle('lock', open);
  }
  burger.addEventListener('click', function () { menu(mm.hidden); });
  $$('a', mm).forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mm.hidden) { menu(false); burger.focus(); } });

  /* ---------------- bottom sheet ---------------- */
  var sheet = $('#sheet'), shp = $('#sh-p'), shLast = null, shT = null;
  function sheetOpen(sc, from) {
    var src = $('.src', sc); if (!src) return;
    $('.sh-h', sheet).textContent = $('.f', sc).textContent;
    var y = $('.y', sc), nn = $('.n', sc);
    $('.sh-y', sheet).textContent = y ? 'Why it matters. ' + y.textContent : '';
    $('.sh-n', sheet).textContent = nn ? 'Next. ' + nn.textContent : '';
    $('.sys', sheet).textContent = src.dataset.sys; $('.file', sheet).textContent = src.dataset.file; $('.row', sheet).textContent = src.dataset.row;
    $('.sh-line', sheet).textContent = src.dataset.line;
    shLast = from || null; clearTimeout(shT);
    sheet.hidden = false; root.classList.add('lock'); shp.style.removeProperty('--dy'); sheet.style.removeProperty('--dy');
    requestAnimationFrame(function () { requestAnimationFrame(function () { sheet.classList.add('in'); $('.sh-x', sheet).focus({ preventScroll: true }); }); });
  }
  function sheetClose() {
    sheet.classList.remove('in'); root.classList.remove('lock');
    shT = setTimeout(function () { sheet.hidden = true; }, 350);
    if (shLast && shLast.focus) shLast.focus({ preventScroll: true });
  }
  $$('[data-close]', sheet).forEach(function (b) { b.addEventListener('click', sheetClose); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) sheetClose(); });
  (function drag() {
    var g = $('.sh-grab', sheet), y0 = null, dy = 0;
    g.addEventListener('pointerdown', function (e) { y0 = e.clientY; dy = 0; sheet.classList.add('drag'); g.setPointerCapture(e.pointerId); });
    g.addEventListener('pointermove', function (e) { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); shp.style.transform = 'translateY(' + dy + 'px)'; });
    function end() {
      if (y0 == null) return; y0 = null; sheet.classList.remove('drag'); shp.style.transform = '';
      if (dy > 90) sheetClose();
    }
    g.addEventListener('pointerup', end); g.addEventListener('pointercancel', end);
    g.addEventListener('click', function (e) { if (dy > 6) e.stopImmediatePropagation(); }, true);
  })();
  {
    $$('.src[data-sys]').forEach(function (s) {
      s.setAttribute('role', 'button'); s.setAttribute('tabindex', '0'); s.setAttribute('aria-haspopup', 'dialog');
      s.addEventListener('click', function () { sheetOpen(s.closest('.ask-s'), s); });
      s.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sheetOpen(s.closest('.ask-s'), s); } });
    });
  }

  /* ---------------- join form (front end only) ---------------- */
  var form = $('#jform'), done = $('#jdone');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var em = form.email, og = form.org, q = form.q, ok = true;
    [em, og, q].forEach(function (f) { var bad = !f.value.trim() || (f === em && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value.trim())); f.classList.toggle('bad', bad); if (bad) ok = false; });
    $('#j-err').hidden = ok;
    if (!ok) { [em, og, q].filter(function (f) { return f.classList.contains('bad'); })[0].focus(); return; }
    $('#jd-q').textContent = q.value.trim(); $('#jd-mail').textContent = em.value.trim();
    form.hidden = true; done.hidden = false; done.focus({ preventScroll: true });
    if (!rm) done.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  /* ---------------- the proof: click any figure ---------------- */
  var ask = $('#ask'), askDone = false, askTok = 0, askCur = null;
  var AD = {
    tables: {
      ts: { sys: 'Timesheets', dc: 6, cols: ['Row', 'Client', 'Work', 'Hours', 'Rate', 'Amount', 'Last entry', 'Billed'], rows: [
        [2099, 'Brightwater Co-op', 'Intake interviews', 24, '$175', '$4,200', 'Sep 12', 'INV-1179'],
        [2100, 'Ostrander Group', 'Q2 reporting support', 61, '$175', '$10,675', 'Aug 29', 'INV-1176'],
        [2101, 'Pell & Marrow', 'Discovery sprint', 38, '$175', '$6,650', 'Oct 17', 'Not yet'],
        [2102, 'Ostrander Group', 'Q3 reporting support', 54, '$175', '$9,450', 'Sep 26', 'Not yet']] },
      pt: { sys: 'Project tracker', dc: 4, cols: ['Row', 'Client', 'Milestone', 'Status', 'Date', 'Fee', 'Invoice'], rows: [
        [311, 'Harlow Dental', 'Phase 1 launch', 'Accepted', 'Jul 30', '$14,500', 'INV-1161'],
        [312, 'Harlow Dental', 'Phase 2 build', 'Accepted', 'Oct 9', '$12,000', 'Not yet'],
        [313, 'Brightwater Co-op', 'Onboarding workshop', 'Delivered', 'Oct 21', '$6,400', 'Not yet'],
        [314, 'Ostrander Group', 'Annual plan', 'Accepted', 'Jun 4', '$8,000', 'INV-1142']] },
      mail: { sys: 'Mailbox', dc: 1, cols: ['Row', 'Date', 'From', 'Subject', 'Line'], rows: [
        [88410, 'Oct 13', 'Pell & Marrow', 'Re: Sprint schedule', 'Thursday works for the readout.'],
        [88412, 'Oct 14', 'Dana Ostrander', 'Re: Change request 7', 'Approved at $6,800. Please start the reporting module.'],
        [88415, 'Oct 20', 'Harlow Dental', 'Phase 2 sign-off', 'Signed and attached.']] },
      bill: { sys: 'Billing', dc: 3, cols: ['Row', 'Invoice', 'Client', 'Date', 'Amount', 'Status'], rows: [
        [412, 'INV-1142', 'Ostrander Group', 'Jun 4', '$8,000', 'Paid'],
        [431, 'INV-1161', 'Harlow Dental', 'Jul 30', '$14,500', 'Paid'],
        [447, 'INV-1176', 'Ostrander Group', 'Aug 29', '$10,675', 'Paid'],
        [452, 'INV-1179', 'Brightwater Co-op', 'Sep 12', '$4,200', 'Paid']] }
    },
    figs: {
      a: { head: 'Finished, not yet invoiced', total: '$41,300', money: 1, recs: [
        { t: 'ts', r: 2102, v: 9450, col: 5, note: 'Ostrander Group, Q3 reporting support' },
        { t: 'pt', r: 312, v: 12000, col: 5, note: 'Harlow Dental, Phase 2 build' },
        { t: 'pt', r: 313, v: 6400, col: 5, note: 'Brightwater Co-op, Onboarding workshop' },
        { t: 'ts', r: 2101, v: 6650, col: 5, note: 'Pell & Marrow, Discovery sprint' },
        { t: 'mail', r: 88412, v: 6800, col: 4, note: 'Ostrander Group, Change request 7' }], foot: 'Five records add up to' },
      b: { head: 'Owed by Ostrander Group', total: '$16,250', money: 1, recs: [
        { t: 'ts', r: 2102, v: 9450, col: 5, note: 'Q3 reporting support' },
        { t: 'mail', r: 88412, v: 6800, col: 4, note: 'Change request 7' }], foot: 'Two records add up to' },
      c: { head: 'Days since the last timesheet entry', total: '38 days', recs: [
        { t: 'ts', r: 2102, v: 'Sep 26', col: 6, note: 'Last hours logged on Q3 reporting' },
        { t: 'bill', r: 447, v: 'Aug 29', col: 3, note: 'Last invoice to Ostrander Group' }], days: 'Nov 3 minus Sep 26 =' }
    }
  };
  function money(v) { return '$' + v.toLocaleString('en-US'); }
  function rowOf(t, r) { for (var i = 0; i < t.rows.length; i++) if (t.rows[i][0] === r) return i; return 0; }
  function askList(fk) {
    var f = AD.figs[fk];
    var rows = f.recs.map(function (r, i) {
      var t = AD.tables[r.t], row = t.rows[rowOf(t, r.r)];
      return '<button class="dr-row" type="button" data-i="' + i + '" style="--d:' + (i + 1) + '"><span class="sy">' + t.sys + '</span><span class="nt">' + r.note + '<small>' + row[t.dc] + '</small></span><span class="am">' + (typeof r.v === 'number' ? money(r.v) : r.v) + '</span><span class="ch" aria-hidden="true">&#8250;</span></button>';
    }).join('');
    var foot = f.days ? f.days + ' <b>' + f.total + '</b>' : f.foot + ' <b>' + f.total + '</b>';
    return '<div class="dr-head"><div><b>' + f.total + '</b><span>' + f.head + '</span></div><button class="dr-x" type="button">Close</button></div>' + rows +
      '<div class="dr-foot"><span>' + foot + '</span><span>' + f.recs.length + ' records</span></div>';
  }
  function askLine(fk, i) {
    var f = AD.figs[fk], r = f.recs[i], t = AD.tables[r.t], hi = rowOf(t, r.r), row = t.rows[hi];
    var start = Math.max(0, Math.min(hi - 1, t.rows.length - 3)), win = t.rows.slice(start, start + 3);
    var head = '<tr>' + t.cols.map(function (c, ci) { return '<th' + (/^\$/.test(String(t.rows[0][ci])) ? ' class="r"' : '') + '>' + c + '</th>'; }).join('') + '</tr>';
    var body = win.map(function (rw) {
      return '<tr' + (rw === row ? ' class="hit"' : '') + '>' + rw.map(function (c, ci) {
        var cls = [/^\$/.test(String(c)) ? 'r' : '', rw === row && ci === r.col ? 'key' : ''].filter(Boolean).join(' ');
        return '<td' + (cls ? ' class="' + cls + '"' : '') + '>' + (ci === 0 ? Number(c).toLocaleString('en-US') : c) + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return '<div class="ln-meta"><button class="ln-back" type="button">&#8592; ' + f.total + '</button><span class="chip">' + t.sys + '</span><span class="chip">Row ' + Number(row[0]).toLocaleString('en-US') + '</span></div>' +
      '<div class="ln-wrap"><table class="ln"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div><p class="ln-note">Quoted as written in the record. Arthur reads this system and does not change it.</p>';
  }
  var dr = ask && $('.dr', ask), drw = dr && $('.dr-w', dr), figs = ask ? $$('.fig', ask) : [];
  function askShow(html) { drw.innerHTML = '<div class="dr-in">' + html + '</div>'; dr.classList.add('open'); }
  function askClose() { askCur = null; figs.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); }); dr.classList.remove('open'); setTimeout(function () { if (!dr.classList.contains('open')) drw.innerHTML = ''; }, 460); }
  function askFig(fk) { askCur = fk; figs.forEach(function (b) { b.setAttribute('aria-expanded', String(b.dataset.f === fk)); }); askShow(askList(fk)); }
  function askRec(fk, i) { askCur = fk; askShow(askLine(fk, i)); }
  function askStop() { askTok++; }
  async function askPlay() {
    if (askDone) return; askDone = true;
    var t = ++askTok, ok = function () { return t === askTok; };
    var f = figs[0];
    f.classList.add('pulse'); await sleep(2400); if (!ok()) return;
    askRec('a', 0); await sleep(3800); if (!ok()) return;
    askFig('a'); f.classList.remove('pulse');
  }
  if (ask) {
    ask.addEventListener('click', function (e) {
      askStop(); askDone = true;
      var fg = e.target.closest('.fig');
      if (fg) { return askCur === fg.dataset.f && dr.classList.contains('open') ? askClose() : askFig(fg.dataset.f); }
      var row = e.target.closest('.dr-row'); if (row) return askRec(askCur, +row.dataset.i);
      if (e.target.closest('.dr-x')) return askClose();
      if (e.target.closest('.ln-back')) return askFig(askCur);
    });
    ask.addEventListener('keydown', function (e) { if (e.key === 'Escape' && askCur) { e.stopPropagation(); askStop(); askClose(); } });
    ask.addEventListener('pointerdown', askStop);

    if (stat || rm) { askDone = true; askFig('a'); }
    else if ('IntersectionObserver' in window) {
      var aio = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { aio.disconnect(); askPlay(); } }); }, { threshold: .6 });
      aio.observe(ask);
    }
  }


  /* ---------------- the two clocks ---------------- */
  var story = $('#story'), cb = $('#cb'), rows = $$('.hr'), n = rows.length;
  var H = [460, 555, 690, 760, 920, 1005, 1155];
  var L = [0, 20, 45, 65, 95, 120, 145, 145];
  var NAVH = function () { return (mob ? 48 : 64) + (mob ? 56 : 80); };
  function fmt(m) {
    m = Math.round(m); var h = Math.floor(m / 60) % 24, mi = m % 60, ap = h >= 12 ? 'PM' : 'AM', h12 = h % 12 || 12;
    return h12 + ':' + (mi < 10 ? '0' : '') + mi + ' ' + ap;
  }
  function span(m) {
    m = Math.round(m); if (m < 1) return 'Same minute';
    var h = Math.floor(m / 60), mi = m % 60;
    return (h ? h + ' h ' : '') + (mi ? (mi < 10 && h ? '0' : '') + mi + ' min' : '') ;
  }
  function compact(m) { m = Math.round(m); var h = Math.floor(m / 60), mi = m % 60; return (h ? h + 'h ' : '') + (mi ? mi + 'm' : ''); }
  function hands(svg, m) {
    $('.hh', svg).setAttribute('transform', 'rotate(' + ((m % 720) / 720 * 360).toFixed(1) + ' 50 50)');
    $('.mh', svg).setAttribute('transform', 'rotate(' + ((m % 60) * 6).toFixed(1) + ' 50 50)');
  }
  var dC = $('.d-c', cb), dA = $('.d-a', cb), tC = $('#tm-c'), tA = $('#tm-a'), gapT = $('#gap-t'), gapL = $('.gl', cb), gp = $('#gp');
  var tops = [], hts = [], hhs = [], ready = false;
  function measure() {
    var y = scrollY; tops = rows.map(function (r) { return r.getBoundingClientRect().top + y; }); hts = rows.map(function (r) { return r.offsetHeight; }); hhs = rows.map(function (r) { return $('.hh', r).offsetHeight; }); ready = true;
  }
  function fOf(ya) {
    if (ya <= tops[0]) return 0;
    var last = n - 1; if (ya >= tops[last] + hts[last]) return n;
    for (var i = last; i >= 0; i--) if (ya >= tops[i]) return i + clamp((ya - tops[i]) / hts[i], 0, 1);
    return 0;
  }
  function askMin(f) { var i = Math.min(Math.floor(f), n - 1); if (i >= n - 1) return H[n - 1]; var t = f - i; return t < .72 ? H[i] : lerp(H[i], H[i + 1], ease((t - .72) / .28)); }
  function lagMin(f) {
    var i = Math.min(Math.floor(f), n - 1), t = f >= n ? 1 : clamp((f - i - .12) / .62, 0, 1);
    return lerp(L[i], L[i + 1], ease(t));
  }
  var last = {}, stepsOf = rows.map(function (r) { return $$('.steps li', r).concat($$('.slip li.new', r)); });
  function setSteps(f) {
    rows.forEach(function (r, i) {
      var lis = $$('.steps li', r), k = lis.length, fi = f - i, nw = $('.slip li.new', r);
      lis.forEach(function (li, j) {
        var on = stat || rm || fi >= 1 || (fi >= .08 + .56 * j / Math.max(1, k - 1));
        if (li.classList.contains('on') !== on) li.classList.toggle('on', on);
      });
      if (nw) { var on2 = stat || rm || fi >= .72; if (nw.classList.contains('on') !== on2) nw.classList.toggle('on', on2); }
    });
  }
  var day = $('#day'), dbtn = [];
  day.innerHTML = rows.map(function (r, i) { return '<button type="button" aria-label="' + (i < n - 1 ? fmt(H[i]) : 'Dinner, 7:15 PM') + '" data-i="' + i + '"></button>'; }).join('');
  dbtn = $$('button', day);
  var railOn = -1;
  function rail(f) {
    var k = Math.min(n - 1, Math.floor(f)), fr = clamp(f - k, 0, 1);
    if (k !== railOn) { dbtn.forEach(function (b, i) { b.classList.toggle('past', i < k); b.classList.toggle('on', i === k); }); railOn = k; }
    dbtn[k].style.setProperty('--f', Math.round(fr * 100) + '%');
  }
  function paint(f) {
    var a = askMin(f), g = lagMin(f), c = a + g;
    var sa = fmt(a), sc = fmt(c);
    if (last.a !== sa) { tA.textContent = sa; hands(dA, a); last.a = sa; }
    if (last.c !== sc) { tC.textContent = sc; hands(dC, c); last.c = sc; }
    var sg = span(g);
    if (last.g !== sg) { gapT.textContent = sg === 'Same minute' ? 'Same minute' : sg + ' apart'; gp.textContent = g >= 1 ? '+' + compact(g) : ''; last.g = sg; }
    gapL.style.setProperty('--gw', Math.round(g / 145 * 150));
    rail(f); setSteps(f);
  }
  var ticking = false, lastAway = null, hwrap = $('.hnd');
  function upd() {
    ticking = false; if (!ready) measure();
    var ya = scrollY + innerHeight * .5, f = stat ? n : fOf(ya), i = Math.min(n - 1, Math.floor(f)), away = stat ? false : (f >= n || ya < tops[0] || ya - tops[i] < hhs[i]);
    if (away !== lastAway) { hwrap.classList.toggle('away', away); lastAway = away; }
    paint(f);
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', function () { ready = false; req(); });
  addEventListener('load', function () { ready = false; req(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ready = false; req(); });
  if ('ResizeObserver' in window) new ResizeObserver(function () { ready = false; req(); }).observe(story);
  upd();

  /* ---------------- the divider ---------------- */
  var hnd = $('#hnd'), split = 50;
  function setSplit(v) { split = clamp(v, 28, 72); story.style.setProperty('--split', split.toFixed(2)); hnd.setAttribute('aria-valuenow', Math.round(split)); }
  (function drag() {
    var down = false;
    hnd.addEventListener('pointerdown', function (e) { down = true; hnd.setPointerCapture(e.pointerId); hwrap.classList.add('hint'); e.preventDefault(); });
    hnd.addEventListener('pointermove', function (e) { if (!down) return; setSplit(e.clientX / innerWidth * 100); });
    function end() { down = false; setTimeout(function () { hwrap.classList.remove('hint'); }, 900); }
    hnd.addEventListener('pointerup', end); hnd.addEventListener('pointercancel', end);
    hnd.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowLeft' ? -4 : e.key === 'ArrowRight' ? 4 : 0;
      if (e.key === 'Home') { e.preventDefault(); e.stopPropagation(); setSplit(28); return; }
      if (e.key === 'End') { e.preventDefault(); e.stopPropagation(); setSplit(72); return; }
      if (d) { e.preventDefault(); e.stopPropagation(); setSplit(split + d); hwrap.classList.add('hint'); }
    });
    if (!stat && !rm && !mob && 'IntersectionObserver' in window) {
      var hio = new IntersectionObserver(function (es) {
        es.forEach(function (x) {
          if (!x.isIntersecting) return; hio.disconnect();
          hwrap.classList.add('hint'); var t0 = performance.now();
          (function step(t) {
            var p = clamp((t - t0) / 1900, 0, 1); if (down) return;
            setSplit(50 + Math.sin(p * Math.PI * 2) * 9 * (1 - p * .3));
            if (p < 1) requestAnimationFrame(step); else { setSplit(50); setTimeout(function () { if (!down) hwrap.classList.remove('hint'); }, 1200); }
          })(t0);
        });
      }, { threshold: .15, rootMargin: '0px 0px -30% 0px' });
      hio.observe(rows[1]);
    }
  })();

  /* ---------------- phone: tap between the two days ---------------- */
  function setDay(d) {
    story.setAttribute('data-day', d);
    $('#cb-l').setAttribute('aria-selected', String(d === 'chase')); $('#cb-r').setAttribute('aria-selected', String(d === 'ask'));
    ready = false; req();
  }
  if (mob) {
    var tl = $('#cb-l'), tr = $('#cb-r');
    cb.setAttribute('role', 'tablist');
    [[tl, 'chase', 'Chasing'], [tr, 'ask', 'Asking']].forEach(function (p) {
      p[0].setAttribute('role', 'tab'); p[0].setAttribute('tabindex', '0');
      p[0].addEventListener('click', function () { var y = $('.cb', story).getBoundingClientRect().top; setDay(p[1]); });
      p[0].addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setDay(p[1]); } });
    });
    setDay('ask');
  }

  /* ---------------- jump hour to hour (left and right arrows, and the rail) ---------------- */
  var closeS = $('#close'), joinS = $('#join');
  function targets() {
    var off = NAVH() - 1, y = scrollY, t = [0];
    rows.forEach(function (r) { t.push(Math.round(r.getBoundingClientRect().top + y - off)); });
    t.push(Math.round(closeS.getBoundingClientRect().top + y - (mob ? 48 : 64)));
    t.push(Math.round(joinS.getBoundingClientRect().top + y - (mob ? 48 : 64)));
    return t;
  }
  function go(i) { var t = targets(); scrollTo({ top: t[clamp(i, 0, t.length - 1)], behavior: rm ? 'auto' : 'smooth' }); }
  dbtn.forEach(function (b) { b.addEventListener('click', function () { go(+b.dataset.i + 1); }); });
  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var el = document.activeElement, tag = el && el.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el && el.isContentEditable)) return;
    if (openItem || !sheet.hidden || !mm.hidden || (el && el.closest && el.closest('.nav, .ask, .hnd'))) return;
    var t = targets(), y = scrollY, k = 0;
    for (var i = 0; i < t.length; i++) if (t[i] <= y + 6) k = i;
    if (e.key === 'ArrowRight') k = Math.min(t.length - 1, k + 1); else if (y > t[k] + 24) { /* back to the top of this hour */ } else k = Math.max(0, k - 1);
    e.preventDefault(); scrollTo({ top: t[k], behavior: rm ? 'auto' : 'smooth' });
  });

  /* ---------------- review states ---------------- */
  var op = root.getAttribute('data-open');
  if (op === 'nav') { var it0 = items[1]; if (it0) openM(it0); }
  if (op === 'sheet') { var s0 = $('.src[data-sys]'); if (s0) { if (mob) setDay('ask'); setTimeout(function () { sheetOpen(s0.closest('.ask-s'), s0); }, 60); } }
  var sp = /[?&]day=(ask|chase)/.exec(location.search); if (sp && mob) setDay(sp[1]);
})();
