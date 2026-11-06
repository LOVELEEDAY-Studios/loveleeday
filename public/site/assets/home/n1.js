(function () {
  'use strict';
  var root = document.documentElement;
  var pin = root.classList.contains('pin');
  var mob = root.classList.contains('m');
  var stat = root.classList.contains('st');
  var rm = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var scenes = $$('.scene'), n = scenes.length;
  var main = $('#day-main'), join = $('#join');
  var NAV = 64;
  var openParam = root.getAttribute('data-open');

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function parseTime(s) {
    var m = /(\d+):(\d+)\s*(AM|PM)/.exec(s), h = (+m[1]) % 12;
    if (m[3] === 'PM') h += 12;
    return h * 60 + (+m[2]);
  }

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
  if (mob) {
    $$('.src[data-sys]').forEach(function (s) {
      s.setAttribute('role', 'button'); s.setAttribute('tabindex', '0'); s.setAttribute('aria-haspopup', 'dialog');
      s.addEventListener('click', function () { sheetOpen(s.closest('.scene'), s); });
      s.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sheetOpen(s.closest('.scene'), s); } });
    });
  }

  /* ---------------- join form ---------------- */
  var form = $('#jform'), done = $('#jdone'), t0 = Date.now(), errBox = $('#j-err'), errText = errBox.textContent;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errBox.textContent = errText;
    var em = form.email, og = form.org, q = form.q, ok = true;
    [em, og, q].forEach(function (f) { var bad = !f.value.trim() || (f === em && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value.trim())); f.classList.toggle('bad', bad); if (bad) ok = false; });
    $('#j-err').hidden = ok;
    if (!ok) { [em, og, q].filter(function (f) { return f.classList.contains('bad'); })[0].focus(); return; }
    var btn = form.querySelector('button[type=submit]'), label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending';
    fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      name: og.value.trim(), email: em.value.trim(), project_type: 'First question', website: form.website.value, elapsed: Date.now() - t0,
      details: 'Organization: ' + og.value.trim() + '\nFirst question: ' + q.value.trim() }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok && r.status !== 429) throw new Error(j.error || ''); }); })
      .then(function () {
        $('#jd-q').textContent = q.value.trim(); $('#jd-mail').textContent = em.value.trim();
        form.hidden = true; done.hidden = false; done.focus({ preventScroll: true });
        if (!rm) done.scrollIntoView({ block: 'center', behavior: 'smooth' });
      })
      .catch(function (x) {
        btn.disabled = false; btn.textContent = label;
        errBox.textContent = x.message || 'That did not send. Please email hello@loveleedaystudios.com.'; errBox.hidden = false;
      });
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
    var more = '<button class="dr-more" type="button">Show all ' + f.recs.length + ' records</button>';
    var foot = f.days ? f.days + ' <b>' + f.total + '</b>' : f.foot + ' <b>' + f.total + '</b>';
    return '<div class="dr-head"><div><b>' + f.total + '</b><span>' + f.head + '</span></div><button class="dr-x" type="button">Close</button></div>' + rows +
      more + '<div class="dr-foot"><span>' + foot + '</span><span>' + f.recs.length + ' records</span></div>';
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
    f.classList.add('pulse'); await sleep(3200); if (!ok()) return;
    askRec('a', 0); await sleep(3800); if (!ok()) return;
    askFig('a'); f.classList.remove('pulse');
  }
  if (ask) {
    ask.addEventListener('click', function (e) {
      askStop(); askDone = true;
      var fg = e.target.closest('.fig');
      if (fg) { return askCur === fg.dataset.f && dr.classList.contains('open') ? askClose() : askFig(fg.dataset.f); }
      var mo = e.target.closest('.dr-more'); if (mo) { mo.closest('.dr-in').classList.add('all'); return; }
      var row = e.target.closest('.dr-row'); if (row) return askRec(askCur, +row.dataset.i);
      if (e.target.closest('.dr-x')) return askClose();
      if (e.target.closest('.ln-back')) return askFig(askCur);
    });
    ask.addEventListener('keydown', function (e) { if (e.key === 'Escape' && askCur) { e.stopPropagation(); askStop(); askClose(); } });
    ask.addEventListener('pointerdown', askStop);
    askFig('a');
    if (stat || rm) askDone = true;
    else if (!pin && 'IntersectionObserver' in window) {
      var aio = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { aio.disconnect(); askPlay(); } }); }, { threshold: .7 });
      aio.observe(ask);
    }
  }

  $$('.more').forEach(function (b) {
    b.addEventListener('click', function () { var a = b.closest('.a'), o = !a.classList.contains('ex'); a.classList.toggle('ex', o); b.setAttribute('aria-expanded', String(o)); b.textContent = o ? 'Less' : 'Why it matters'; });
  });

  /* ---------------- the day, wound back: rail, progress, jumps ---------------- */
  var day = $('#day');
  var TS = scenes.slice(0, 7).map(function (s) { return s.dataset.time; });
  day.innerHTML = TS.map(function (t, i) { return '<button type="button" aria-label="' + t + '" data-i="' + i + '"><span class="tk"></span><span class="tl">' + t + '</span></button>'; }).join('');
  var dbtn = $$('button', day), railOn = -1;
  function railSet(k, frac) {
    if (k !== railOn) {
      dbtn.forEach(function (b, i) { b.classList.toggle('on', i === k); b.classList.toggle('past', i < k); if (i === k) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      railOn = k;
      day.dataset.tone = scenes[k].dataset.tone || 'ink';
      root.classList.toggle('top', k === 0);
    }
    if (mob && dbtn[k]) dbtn[k].style.setProperty('--f', Math.round(clamp(frac, 0, 1) * 100) + '%');
  }
  var starts = [], D = 0, vh = innerHeight;
  function targetY(i) {
    if (i >= n) return Math.max(0, join.offsetTop - (mob ? 0 : NAV));
    if (pin) return (main.offsetTop + starts[i] + (i ? D + 2 : 0));
    return scenes[i].offsetTop;
  }
  function go(i) { scrollTo({ top: targetY(i), behavior: rm ? 'auto' : 'smooth' }); }
  dbtn.forEach(function (b) { b.addEventListener('click', function () { go(+b.dataset.i); }); });
  function nowIdx() {
    var y = scrollY, k = 0;
    for (var i = 0; i <= n; i++) if (targetY(i) <= y + 6) k = i;
    return k;
  }
  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var el = document.activeElement, tag = el && el.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el && el.isContentEditable)) return;
    if (openItem || !sheet.hidden || !mm.hidden || (el && el.closest && el.closest('.nav, .ask'))) return;
    var k = nowIdx();
    if (e.key === 'ArrowRight') { if (k >= n) return; k += 1; }
    else { if (scrollY > targetY(k) + 24) { /* back to the top of this hour */ } else k = Math.max(0, k - 1); }
    e.preventDefault(); go(k);
  });

  /* ---------------- phone and static: progress and entrance ---------------- */
  if (!pin) {
    var tick = false;
    var upd = function () {
      tick = false;
      var y = scrollY + innerHeight * .35, k = 0;
      for (var i = 0; i < n; i++) if (scenes[i].offsetTop <= y) k = i;
      var s = scenes[k], fr = (y - s.offsetTop) / Math.max(1, s.offsetHeight);
      railSet(k, fr);
    };
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    addEventListener('resize', upd); upd();
    if (root.classList.contains('anim') && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { threshold: .18 });
      scenes.forEach(function (s) { io.observe(s); });
      scenes[0].classList.add('in');
    }
  }

  /* ---------------- desktop: the pinned rewind ---------------- */
  if (pin && main) (function engine() {
    var LEN = [.7, 1.1, 1.1, 1.8, 1.1, 1.1, 1.1, 1.1, 1.3];
    var T = [1155, 1070, 920, 760, 690, 555, 460];
    var hud = $('#hud'), HW = $$('.w', hud), colH = $('.h .col', hud), colT = $('.mt .col', hud), colU = $('.mu .col', hud), colA = $('.ap .col', hud);
    function cells(col, arr) { col.innerHTML = arr.map(function (t) { return '<span>' + t + '</span>'; }).join(''); }
    cells(colH, ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
    cells(colT, [0, 1, 2, 3, 4, 5, 0]);
    cells(colU, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
    cells(colA, ['AM', 'PM']);
    var hw = HW[0];
    function setClock(v) {
      var mi = v % 60, hp = Math.floor(v / 60) + clamp(mi - 59, 0, 1), idx = hp % 12;
      colH.style.setProperty('--p', idx.toFixed(3));
      colT.style.setProperty('--p', (Math.floor(mi / 10) + clamp((v % 10) - 9, 0, 1)).toFixed(3));
      colU.style.setProperty('--p', (v % 10).toFixed(3));
      colA.style.setProperty('--p', clamp((v - 710) / 20, 0, 1).toFixed(3));
      var r = Math.round(idx);
      hw.style.width = (r === 0 || r >= 10 ? 1.3 : .68) + 'em';
    }
    var QD = [0, .1, .1, .1, .1, .1, .1, 0, 0];
    var AA = [0, .4, .4, .4, .4, .4, .4, 0, 0];
    var EX = { 0: [['.h1', .2], ['.promise', .5], ['.hint', .8]], 2: [['.big', .4]], 7: [['.t-steps', .5]], 8: [['.t-close', .3], ['.t-cta', .6]] };
    var qWords = scenes.map(function (s) {
      var q = $('.q', s); if (!q) return [];
      var words = q.textContent.trim().split(/\s+/);
      q.setAttribute('aria-label', q.textContent.trim());
      q.innerHTML = words.map(function (w) { return '<span class="w" aria-hidden="true">' + w + '</span>'; }).join(' ');
      q.classList.add('sp');
      return $$('.w', q);
    });
    var aKids = scenes.map(function (s) { return $$('.a > *', s); });
    var whys = scenes.map(function (s) { return $('.why', s); });
    var thrs = scenes.map(function (s) { return $('.thr', s); });
    var asks = scenes.map(function (s) { return $('.ask', s); });
    var exs = scenes.map(function (s, i) { return (EX[i] || []).map(function (d) { return { el: $(d[0], s), at: d[1] }; }).filter(function (o) { return o.el; }); });
    var turnKids = $$('.turn > *', scenes[n - 2]);
    var zs = scenes.map(function (s) { return $$('.z', s); });
    var rt = scenes.map(function () { return null; });
    var heroPx = 0, hudPx = 0, total = 0;
    function layout() {
      vh = innerHeight; D = .8 * vh; starts = []; var acc = 0;
      for (var i = 0; i < n; i++) { starts.push(acc); acc += LEN[i] * vh; }
      total = acc + vh; main.style.height = total + 'px';
      var u = Math.min(innerWidth / 100, innerHeight * .016);
      hudPx = u * 5.6; heroPx = u * 12.5;
    }
    function rise(el, p, px) { el.style.opacity = p.toFixed(3); el.style.transform = 'translateY(' + (-(1 - p) * (px || 14)).toFixed(1) + 'px)'; }
    var cur = 0, started = false, lastTone = '', askArmed = false;
    function frame(now) {
      var target = Math.max(0, scrollY - main.offsetTop);
      if (!started) { cur = target; started = true; }
      cur += (target - cur) * .16;
      if (Math.abs(target - cur) < .4) cur = target;
      var y = cur;
      var o = [], e = [], k = 0, k5 = 0, i;
      for (i = 0; i < n; i++) {
        var oi = i === 0 ? 1 : clamp((y - starts[i]) / D, 0, 1);
        o.push(oi); e.push(ease(oi));
        if (oi > 0) k = i;
        if (oi >= .5) k5 = i;
      }
      for (i = 0; i < n; i++) {
        var s = scenes[i];
        var vis = o[i] > 0 && !(i + 1 < n && o[i + 1] >= 1);
        s.style.visibility = vis ? 'visible' : 'hidden';
        if (!vis) continue;
        var t = e[i];
        if (o[i] >= 1) s.style.clipPath = 'none';
        else if (i === n - 1) s.style.clipPath = 'inset(' + ((1 - t) * 100).toFixed(2) + '% 0 0 0)';
        else { var r = 1 - t; s.style.clipPath = 'inset(0 0 ' + (r * 100).toFixed(2) + '% 0 round 0 0 ' + (18 * r).toFixed(1) + 'px ' + (18 * r).toFixed(1) + 'px)'; }
        if (rt[i] === null && (i === 0 || o[i] >= .5)) rt[i] = now;
        var tau = rt[i] === null ? -1 : (now - rt[i]) / 1000;
        var push = clamp((y - starts[i]) / (LEN[i] * vh), 0, 1);
        var out = i + 1 < n ? e[i + 1] : 0;
        var zl = zs[i];
        var phs = $('.ph', s);
        if (phs && i !== n - 1) phs.style.opacity = (1 - clamp(out * 1.7, 0, 1)).toFixed(3);
        for (var z = 0; z < zl.length; z++) {
          if (i === n - 1) {
            zl[z].style.transform = 'translate3d(0,0,0) scale(' + (1.07 - .035 * t).toFixed(4) + ')';
          } else {
            var sc = 1.07 - .035 * push, ty = i === 0 ? out * 1.5 : -(1 - t) * 3.5 + out * 1.5;
            zl[z].style.transform = 'translate3d(0,' + ty.toFixed(2) + '%,0) scale(' + sc.toFixed(4) + ')';
          }
        }
        var wh = whys[i];
        if (wh) { var pw = tau < 0 ? 0 : clamp((tau - .05) / .4, 0, 1); rise(wh, ease(pw), 10); thrs[i].style.transform = 'scaleY(' + ease(clamp((tau - .0) / .7, 0, 1)).toFixed(3) + ')'; }
        var qw = qWords[i], w;
        for (w = 0; w < qw.length; w++) {
          var p = tau < 0 ? 0 : clamp((tau - QD[i] - w * .03) / .4, 0, 1);
          rise(qw[w], p, 14);
        }
        var ak = aKids[i], a;
        for (a = 0; a < ak.length; a++) {
          var pa = tau < 0 ? 0 : clamp((tau - AA[i] - a * .1) / .4, 0, 1);
          rise(ak[a], pa, 12);
        }
        if (asks[i]) rise(asks[i], tau < 0 ? 0 : ease(clamp((tau - .25) / .5, 0, 1)), 18);
        var xl = exs[i], q2;
        for (q2 = 0; q2 < xl.length; q2++) rise(xl[q2].el, tau < 0 ? 0 : ease(clamp((tau - xl[q2].at) / .5, 0, 1)), 16);
        if (i === n - 2) { for (var tk = 0; tk < turnKids.length; tk++) rise(turnKids[tk], tau < 0 ? 0 : ease(clamp((tau - .05 - tk * .1) / .35, 0, 1)), 16); }
        if (i === 3 && !askArmed && tau > 1.2) { askArmed = true; askPlay(); }
      }

      // the clock: it begins as the hero object, then settles into the corner, and winds down
      var hp2 = ease(clamp(y / (.5 * vh), 0, 1));
      hud.style.fontSize = lerp(heroPx, hudPx, hp2).toFixed(1) + 'px';
      var v;
      if (k === n - 1) v = lerp(460, 1155, e[k]);
      else if (k > 0 && o[k] < 1) v = lerp(T[k - 1], k >= 7 ? 460 : T[k], e[k]);
      else v = T[Math.min(k, T.length - 1)];
      setClock(v);
      var tone = scenes[k5].dataset.tone || 'ink';
      if (k === n - 2 && o[k] >= 1 && o[n - 1] < .5) tone = 'ink';
      if (tone !== lastTone) { hud.dataset.tone = tone; lastTone = tone; }
      hud.classList.toggle('stopped', k === n - 1 && o[k] >= 1);
      railSet(k5, 0);
      requestAnimationFrame(frame);
    }
    addEventListener('resize', layout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    $$('img').forEach(function (im) { if (!im.complete) im.addEventListener('load', layout); });
    layout();
    requestAnimationFrame(frame);
  })();

  if (openParam === 'nav' && items[1]) openM(items[1]);
  if (openParam === 'menu') menu(true);
  if (openParam === 'sheet') setTimeout(function () { sheetOpen(scenes[1]); }, 400);
})();
