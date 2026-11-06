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
  var NAV = 64;
  var openParam = root.getAttribute('data-open');
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function seg(v, a, b) { return ease((v - a) / (b - a)); }

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
      s.addEventListener('click', function () { sheetOpen(s.closest('.hr'), s); });
      s.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sheetOpen(s.closest('.hr'), s); } });
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

  /* ================= the clock ================= */
  var H = $$('.hr'), NH = H.length;
  var A = H.map(function (h) { return +h.dataset.t; });
  var DAY0 = A[0], DAY1 = A[NH - 1];
  var stage = $('#stage'), htxt = $('#htxt'), exEl = $('#ex'), h1t = $('#h1t'), subEl = $('#sub'), hintEl = $('#hint');
  var dialwrap = $('#dialwrap'), dial = $('#dial'), closeEl = $('#close'), sunEl = $('#sun'), shadeEl = $('#shade'), duskEl = $('#dusk'), fieldEl = $('.field');
  var runway = $('#runway'), probe = null;
  var SUB = 'Ask across your systems. Get an answer you can trace.', SUB_END = 'Every answer today traced back to a record, so the evening can be yours.';

  function fmt(t) { t = ((Math.round(t) % 1440) + 1440) % 1440; var h = Math.floor(t / 60), m = t % 60; return { h: h % 12 || 12, m: ('0' + m).slice(-2), ap: h >= 12 ? 'PM' : 'AM' }; }
  function fmtS(t) { var f = fmt(t); return f.h + ':' + f.m + ' ' + f.ap; }
  function hex(c) { c = c.replace('#', ''); return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; }
  function mixc(a, b, t) { a = hex(a); b = hex(b); return 'rgb(' + [0, 1, 2].map(function (i) { return Math.round(lerp(a[i], b[i], t)); }).join(',') + ')'; }
  var BG = [[460, '#eaf2fb'], [680, '#ffffff'], [900, '#f5f1eb'], [1155, '#f5f1eb']];
  function bgAt(T) {
    if (T <= BG[0][0]) return BG[0][1];
    for (var i = 1; i < BG.length; i++) if (T <= BG[i][0]) return mixc(BG[i - 1][1], BG[i][1], (T - BG[i - 1][0]) / (BG[i][0] - BG[i - 1][0]));
    return BG[BG.length - 1][1];
  }

  /* the time it is: real, or ?t=14:14 */
  var qm = /[?&]t=(\d{1,2})[:.](\d{2})/.exec(location.search), nowD = new Date();
  var Treal = qm ? (+qm[1]) * 60 + (+qm[2]) : (stat ? 14 * 60 + 14 : nowD.getHours() * 60 + nowD.getMinutes());
  var offHours = !(Treal >= DAY0 && Treal < DAY1);

  /* ---------- dial markup ---------- */
  function pt(a, r) { var t = a * Math.PI / 180; return [500 + r * Math.sin(t), 500 - r * Math.cos(t)]; }
  function f1(n) { return Math.round(n * 10) / 10; }
  function dialSVG(full) {
    var s = '<svg class="' + (full ? 'dsvg' : 'mini') + '" viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">';
    s += '<circle cx="500" cy="500" r="492" fill="url(#d-case)"/><circle cx="500" cy="500" r="462" fill="url(#d-bezel)"/><circle cx="500" cy="500" r="452" fill="#0e0f12"/><circle cx="500" cy="500" r="445" fill="url(#d-face)"/>';
    var i, p, q, a;
    if (full) {
      s += '<g stroke="#14161a" stroke-opacity=".05" stroke-width="1.3">';
      for (i = 0; i < 180; i++) { p = pt(i * 2, 46); q = pt(i * 2, 326); s += '<line x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(q[0]) + '" y2="' + f1(q[1]) + '"/>'; }
      s += '</g><g fill="none" stroke="#14161a" stroke-opacity=".07" stroke-width="1.2">';
      for (i = 0; i < 8; i++) s += '<circle cx="500" cy="500" r="' + (120 + i * 26) + '"/>';
      s += '</g>';
    }
    s += '<g stroke="#14161a" stroke-linecap="butt">';
    for (i = 0; i < 60; i++) {
      if (!full && i % 5) continue;
      var big = i % 5 === 0; p = pt(i * 6, big ? 414 : 422); q = pt(i * 6, 436);
      s += '<line x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(q[0]) + '" y2="' + f1(q[1]) + '" stroke-width="' + (big ? 4 : 1.6) + '" stroke-opacity="' + (big ? .85 : .6) + '"/>';
    }
    s += '</g><g stroke="#14161a" stroke-opacity=".55" stroke-width="1.4">';
    for (i = 0; i < 12; i++) {
      var w = 17;
      if (i === 0) s += '<rect x="' + (500 - 27) + '" y="102" width="20" height="66" rx="3" fill="url(#d-baton)"/><rect x="' + (500 + 7) + '" y="102" width="20" height="66" rx="3" fill="url(#d-baton)"/>';
      else s += '<rect x="' + (500 - w / 2) + '" y="102" width="' + w + '" height="66" rx="3" fill="url(#d-baton)" transform="rotate(' + (i * 30) + ' 500 500)"/>';
    }
    s += '</g>';
    if (full) {
      s += '<text x="500" y="262" text-anchor="middle" font-family="Switzer,system-ui,sans-serif" font-size="25" font-weight="650" letter-spacing="3.6" fill="#14161a">LOVELEEDAY</text>';
      var a0 = DAY0 / 2, a1 = DAY1 / 2, r = 318;
      var p0 = pt(a0, r), p1 = pt(a1, r);
      s += '<path d="M' + f1(p0[0]) + ' ' + f1(p0[1]) + ' A' + r + ' ' + r + ' 0 1 1 ' + f1(p1[0]) + ' ' + f1(p1[1]) + '" fill="none" stroke="#14161a" stroke-opacity=".2" stroke-width="2.4" stroke-dasharray="2 7" stroke-linecap="round"/>';
      s += '<path class="arc" d="" fill="none" stroke="#0066cc" stroke-width="5" stroke-linecap="round"/>';
      s += '<circle cx="' + f1(p0[0]) + '" cy="' + f1(p0[1]) + '" r="7" fill="#0066cc"/>';
      s += '<circle cx="' + f1(p1[0]) + '" cy="' + f1(p1[1]) + '" r="11" fill="#f6f1e8" stroke="#14161a" stroke-width="3.4"/>';
      var l0 = pt(a0, 262), l1 = pt(a1, 262);
      s += '<text x="' + f1(l0[0] - 6) + '" y="' + f1(l0[1] + 4) + '" text-anchor="end" font-family="Switzer,system-ui,sans-serif" font-size="23" font-weight="600" fill="#14161a" fill-opacity=".72">7:40</text>';
      s += '<text x="' + f1(l1[0] + 4) + '" y="' + f1(l1[1] + 20) + '" text-anchor="start" font-family="Switzer,system-ui,sans-serif" font-size="23" font-weight="600" fill="#14161a" fill-opacity=".72">7:15</text>';
      /* aperture: the hour in a window */
      s += '<clipPath id="d-apc"><circle cx="500" cy="728" r="80"/></clipPath><circle cx="500" cy="728" r="90" fill="url(#d-case)"/><circle cx="500" cy="728" r="82" fill="#0e0f12"/><g clip-path="url(#d-apc)">';
      H.forEach(function (h, k) {
        var im = $('.hr-ph img', h), ap = (h.dataset.ap || '.5,1.1').split(','), fx = +ap[0], z = +ap[1], hh = 160 * z, ww = hh * 1.5;
        s += '<image class="ap-img" data-k="' + k + '" href="' + im.getAttribute('src') + '" x="' + f1(500 - 80 - (ww - 160) * fx) + '" y="' + f1(728 - 80 - (hh - 160) * .5) + '" width="' + f1(ww) + '" height="' + f1(hh) + '" preserveAspectRatio="xMidYMid slice"/>';
      });
      s += '</g><circle cx="500" cy="728" r="80" fill="none" stroke="#14161a" stroke-opacity=".5" stroke-width="2"/>';
    }
    s += '<g filter="url(#d-hs)"><g class="hh"><polygon points="500,266 484,500 500,540" fill="#3d4047"/><polygon points="500,266 516,500 500,540" fill="#101114"/><line x1="500" y1="266" x2="500" y2="540" stroke="#fff" stroke-opacity=".3" stroke-width="1.4"/></g></g>';
    s += '<g filter="url(#d-hs)"><g class="mh"><polygon points="500,108 489,500 500,552" fill="#3d4047"/><polygon points="500,108 511,500 500,552" fill="#101114"/><line x1="500" y1="108" x2="500" y2="552" stroke="#fff" stroke-opacity=".3" stroke-width="1.2"/></g></g>';
    if (full) s += '<g filter="url(#d-hs2)"><g class="sh"><line x1="500" y1="604" x2="500" y2="88" stroke="#0066cc" stroke-width="3.4"/><circle cx="500" cy="584" r="17" fill="#f6f1e8" stroke="#0066cc" stroke-width="5"/></g></g>';
    s += '<circle cx="500" cy="500" r="30" fill="url(#d-cap)"/><circle cx="500" cy="500" r="11" fill="#0066cc"/>';
    if (full) s += '<circle cx="500" cy="500" r="445" fill="url(#d-glare)" pointer-events="none"/>';
    return s + '</svg>';
  }
  function setHands(el, T, sec) {
    var h = $('.hh', el), m = $('.mh', el), s = $('.sh', el);
    if (h) h.setAttribute('transform', 'rotate(' + f1((((T % 720) + 720) % 720) * .5) + ' 500 500)');
    if (m) m.setAttribute('transform', 'rotate(' + f1((((T % 60) + 60) % 60) * 6) + ' 500 500)');
    if (s && sec != null) s.setAttribute('transform', 'rotate(' + f1(sec * 6) + ' 500 500)');
  }
  dial.innerHTML = dialSVG(true);
  var arcEl = $('.arc', dial), apImgs = $$('.ap-img', dial);
  H.forEach(function (h, k) { var d = $('.hc-dial', h); d.innerHTML = dialSVG(false); setHands(d, A[k]); });
  var secOn = !stat;
  function secNow() { if (!secOn) return 0; var d = new Date(); return d.getSeconds() + d.getMilliseconds() / 1000; }

  /* ---------- painting one moment ---------- */
  var cur = { T: Treal, f: 0, idx: -1 }, shown = -1, apShown = -1, swT = null;
  var exProof = null, proofTimer = null, geo = {};
  function idxOf(T) { for (var i = NH - 2; i >= 0; i--) if (T >= A[i]) return i; return 0; }
  function arcPath(T) {
    var a0 = DAY0 / 2, a1 = clamp(T, DAY0, DAY1) / 2, r = 318;
    if (a1 - a0 < .6) return '';
    var p0 = pt(a0, r), p1 = pt(a1, r);
    return 'M' + f1(p0[0]) + ' ' + f1(p0[1]) + ' A' + r + ' ' + r + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 1 ' + f1(p1[0]) + ' ' + f1(p1[1]);
  }
  function showEx(idx) {
    var src = $('.hr-ex', H[idx]);
    exEl.innerHTML = src.innerHTML;
    htxt.classList.remove('po'); stage.classList.remove('po');
    exProof && exProof.reset();
    clearTimeout(proofTimer);
    if (idx === 3) {
      if (stat) exProof.open('a');
      else if (pin && !rm) proofTimer = setTimeout(function () { if (shown === 3) exProof.play(); }, 3200);
    }
    syncDup();
  }
  function setEx(idx) {
    if (idx === shown) return;
    if (shown < 0 || rm || stat || !pin) { shown = idx; showEx(idx); return; }
    shown = idx; clearTimeout(swT);
    exEl.classList.add('sw');
    swT = setTimeout(function () { showEx(shown); exEl.classList.remove('sw'); }, 170);
  }
  function syncDup() {
    if (pin || mob) return;
    H.forEach(function (h, k) { h.hidden = (k === shown && shown >= 0 && !(cur.f > 0 || offHours)); });
  }
  function paint(T, f, idx, immediate) {
    var Td = T;
    if (f > 0 && offHours) Td = lerp(DAY1, Treal, ease(f));
    cur.T = T; cur.f = f; cur.idx = idx;
    var fm = fmt(Td); h1t.textContent = fm.h + ':' + fm.m + ' ' + fm.ap + '.';
    var sub = f > .3 ? SUB_END : SUB; if (subEl.textContent !== sub) subEl.textContent = sub;
    setHands(dial, Td, secNow());
    arcEl.setAttribute('d', arcPath(Td));
    dial.setAttribute('aria-valuenow', Math.round(clamp(Td, DAY0, DAY1))); dial.setAttribute('aria-valuetext', fmtS(Td));
    /* aperture */
    var ak = f > .3 ? NH - 1 : idx;
    if (ak !== apShown) { apImgs.forEach(function (im, k) { im.classList.toggle('on', k === ak); }); apShown = ak; }
    /* light */
    var u = clamp((T - DAY0) / (DAY1 - DAY0), 0, 1);
    var dusk = seg(f, 0, .6), rv = seg(f, .08, .72);
    fieldEl.style.setProperty('--bg', bgAt(T));
    sunEl.style.setProperty('--sx', f1(lerp(12, 90, u)) + '%');
    sunEl.style.setProperty('--sy', f1(66 - 56 * (1 - Math.pow(2 * u - 1, 2))) + '%');
    sunEl.style.setProperty('--sa', f1(lerp(.95, .4, u) * (1 - dusk)));
    shadeEl.style.setProperty('--sh', f1(seg(u, .72, 1) * .3 * (1 - dusk)));
    duskEl.style.opacity = f1(dusk);
    stage.style.setProperty('--rv', f1(rv * 1000) / 1000);
    stage.classList.toggle('dark', dusk > .45);
    /* text */
    exEl.style.opacity = f > 0 ? f1(1 - seg(f, 0, .2)) : '';
    exEl.hidden = f > .22;
    hintEl.style.opacity = f > 0 ? 0 : '';
    var cl = seg(f, .6, .92); closeEl.style.opacity = f1(cl); closeEl.classList.toggle('on', cl > .5);
    /* the clock moves to the corner as the table arrives */
    var k = seg(f, .12, .72);
    if (geo.dx != null) dialwrap.style.transform = k > 0 ? 'translate3d(' + f1(geo.dx * k) + 'px,' + f1(geo.dy * k) + 'px,0) scale(' + f1(lerp(1, geo.sc, k) * 1000) / 1000 + ')' : '';
    /* rail */
    railSet(f > .3 ? NH - 1 : idx);
    setEx(idx);
    if (f > .3 && pin) { /* exchange is gone, keep last */ }
  }

  /* ---------- geometry ---------- */
  var W = [1, 1, 1, 1.8, 1, 1, 1], FIN = 1.2, CUM = [], SUMW = 0, UNIT = 600, TOTAL = 0;
  (function () { var c = 0; W.forEach(function (w, i) { CUM[i] = c; c += w; }); SUMW = c; CUM[NH - 1] = c; TOTAL = c + FIN; })();
  function layout() {
    var vh = innerHeight, vw = innerWidth;
    UNIT = vh * .8;
    if (pin) runway.style.height = Math.round(vh + TOTAL * UNIT) + 'px';
    if (!probe) probe = $('.bandprobe') || (function () { var i = document.createElement('i'); i.className = 'bandprobe'; stage.appendChild(i); return i; })();
    var sw = stage.clientWidth, sh = stage.clientHeight, band = probe.offsetHeight;
    var imgH = Math.max(sh, sw * 2 / 3), imgTop = (sh - imgH) / 2, faceY = imgTop + .4 * imgH;
    stage.style.setProperty('--shift', Math.round(sh - band * .52 - faceY) + 'px');
    var U = Math.min(vw * .01, vh * .016), Df = Math.min(12 * U, 190), D = dialwrap.offsetWidth;
    var bx = dialwrap.offsetLeft + D / 2, by = dialwrap.offsetTop + D / 2;
    geo.sc = Df / D; geo.dx = (sw - sw * .03 - Df / 2) - bx; geo.dy = (NAV + 1.2 * U + Df / 2) - by;
    if (mob || !pin) { geo.dx = null; }
  }
  function sOfT(T) {
    if (T >= DAY1) return SUMW;
    var k = idxOf(T);
    return CUM[k] + W[k] * clamp((T - A[k]) / (A[k + 1] - A[k]), 0, 1);
  }
  function stateOfS(s) {
    if (s >= SUMW) return { T: DAY1, f: clamp((s - SUMW) / FIN, 0, 1), idx: NH - 2 };
    var k = 0; for (var i = 0; i < NH - 1; i++) if (s >= CUM[i]) k = i;
    return { T: lerp(A[k], A[k + 1], clamp((s - CUM[k]) / W[k], 0, 1)), f: 0, idx: k };
  }

  /* ---------- day rail ---------- */
  var day = $('#day');
  day.innerHTML = H.map(function (h, i) { return '<button type="button" aria-label="' + h.dataset.label + '" data-i="' + i + '"><span class="tk"></span><span class="tl">' + h.dataset.label + '</span></button>'; }).join('');
  var dbtn = $$('button', day), railOn = -2;
  function railSet(k, frac) {
    if (k !== railOn) {
      dbtn.forEach(function (b, i) { b.classList.toggle('on', i === k); b.classList.toggle('past', i < k); if (i === k) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      railOn = k;
    }
    if (mob && k >= 0 && frac != null) dbtn[k].style.setProperty('--f', Math.round(clamp(frac, 0, 1) * 100) + '%');
  }
  function yOfIdx(i) { return Math.round((i >= NH - 1 ? TOTAL : CUM[i]) * UNIT) + (i && i < NH - 1 ? 2 : 0); }
  function panelY(i) { return Math.round(H[i].getBoundingClientRect().top + scrollY - (mob ? NAV + 28 : NAV) + (mob ? NAV + 28 : 0)); }
  function go(i) {
    if (pin) scrollTo({ top: yOfIdx(i), behavior: rm ? 'auto' : 'smooth' });
    else { H[i].hidden = false; scrollTo({ top: Math.max(0, panelY(i) - (mob ? 0 : NAV)), behavior: rm ? 'auto' : 'smooth' }); }
  }
  dbtn.forEach(function (b) { b.addEventListener('click', function () { go(+b.dataset.i); }); });
  function nowIdx() {
    if (pin) { var y = scrollY, k = -1; for (var i = 0; i < NH; i++) if (yOfIdx(i) <= y + 6) k = i; return k; }
    var y2 = scrollY + (mob ? NAV + 40 : NAV + 8), k2 = -1;
    for (var j = 0; j < NH; j++) if (!H[j].hidden && H[j].getBoundingClientRect().top + scrollY <= y2) k2 = j;
    return k2;
  }
  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var el = document.activeElement, tag = el && el.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el && el.isContentEditable)) return;
    if (openItem || !sheet.hidden || !mm.hidden || (el && el.closest && el.closest('.nav, .ex, .hr-ex'))) return;
    var k = nowIdx();
    if (e.key === 'ArrowRight') { if (k >= NH - 1) return; k += 1; }
    else {
      if (k < 0) return;
      var start = pin ? yOfIdx(k) : H[k].getBoundingClientRect().top + scrollY - (mob ? 0 : NAV);
      if (scrollY > start + 40) { /* back to the start of this hour */ } else if (k === 0) { e.preventDefault(); scrollTo({ top: 0, behavior: rm ? 'auto' : 'smooth' }); return; } else k -= 1;
    }
    e.preventDefault(); go(k);
  });

  /* ---------- the proof: click any figure ---------- */
  function Proof(rootEl) {
    var st = { cur: null, tok: 0, done: false };
    function nodes() { var dr = $('.dr', rootEl); return { dr: dr, drw: dr && $('.dr-w', dr), figs: $$('.fig', rootEl) }; }
    function po(on) { if (rootEl === exEl) { htxt.classList.toggle('po', on); stage.classList.toggle('po', on); } }
    function show(html) { var n = nodes(); if (!n.dr) return; n.drw.innerHTML = '<div class="dr-in">' + html + '</div>'; n.dr.classList.add('open'); po(true); }
    function close() {
      st.cur = null; var n = nodes(); if (!n.dr) return;
      n.figs.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); }); n.dr.classList.remove('open'); po(false);
      setTimeout(function () { if (!n.dr.classList.contains('open')) n.drw.innerHTML = ''; }, 460);
    }
    function fig(fk) { st.cur = fk; nodes().figs.forEach(function (b) { b.setAttribute('aria-expanded', String(b.dataset.f === fk)); }); show(askList(fk)); }
    function rec(fk, i) { st.cur = fk; show(askLine(fk, i)); }
    function stop() { st.tok++; st.done = true; }
    async function play() {
      if (st.done) return; st.done = true;
      var t = ++st.tok, ok = function () { return t === st.tok; };
      var f = nodes().figs[0]; if (!f) return;
      f.classList.add('pulse'); await sleep(2600); if (!ok()) return;
      fig('a'); f.classList.remove('pulse'); await sleep(3600); if (!ok()) return;
      rec('a', 0);
    }
    rootEl.addEventListener('click', function (e) {
      var n = nodes(); if (!n.dr) return;
      stop();
      var fg = e.target.closest('.fig');
      if (fg) { return st.cur === fg.dataset.f && n.dr.classList.contains('open') ? close() : fig(fg.dataset.f); }
      var row = e.target.closest('.dr-row'); if (row) return rec(st.cur, +row.dataset.i);
      if (e.target.closest('.dr-x')) return close();
      if (e.target.closest('.ln-back')) return fig(st.cur);
    });
    rootEl.addEventListener('keydown', function (e) { if (e.key === 'Escape' && st.cur) { e.stopPropagation(); stop(); close(); } });
    rootEl.addEventListener('pointerdown', function () { st.tok++; st.done = true; });
    return { play: play, open: fig, reset: function () { st.cur = null; st.tok++; }, st: st };
  }
  exProof = Proof(exEl);
  var listProof = Proof($('.hr-ex', H[3]));
  if (!pin && !stat && !rm && 'IntersectionObserver' in window) {
    var aio = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { aio.disconnect(); listProof.play(); } }); }, { threshold: .7 });
    aio.observe($('.hr-ex', H[3]));
  }
  if (stat || rm) listProof.st.done = true;

  /* ---------- driving the clock ---------- */
  var target = 0, curS = 0, raf = 0;
  function sFromScroll() { return clamp(scrollY / UNIT, 0, TOTAL); }
  function paintS(s) { var st = stateOfS(s); paint(st.T, st.f, st.idx); }
  function tick() {
    var d = target - curS;
    if (Math.abs(d) < .0007) { curS = target; paintS(curS); raf = 0; return; }
    curS += d * .2; paintS(curS); raf = requestAnimationFrame(tick);
  }
  function setHero(T) { var idx = idxOf(T); paint(T, offHours ? 1 : 0, idx); }
  function tFromAngle(ang) {
    var M = ang / 360 * 720;
    if (M >= 460) return M;
    if (M <= 435) return M + 720;
    return M < 447.5 ? DAY1 : DAY0;
  }
  var dragging = false, lastT = null;
  function onDrag(e) {
    var r = dial.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var ang = Math.atan2(e.clientX - cx, -(e.clientY - cy)) * 180 / Math.PI; if (ang < 0) ang += 360;
    var T = clamp(tFromAngle(ang), DAY0, DAY1); lastT = T;
    if (pin) scrollTo(0, Math.round(sOfT(T) * UNIT));
    else { offHoursOverride = false; setHero(T); }
  }
  var offHoursOverride = false;
  dial.addEventListener('pointerdown', function (e) { dragging = true; dial.setPointerCapture(e.pointerId); stage.classList.add('drag'); onDrag(e); });
  dial.addEventListener('pointermove', function (e) { if (dragging) onDrag(e); });
  function endDrag() { if (!dragging) return; dragging = false; stage.classList.remove('drag'); }
  dial.addEventListener('pointerup', endDrag); dial.addEventListener('pointercancel', endDrag);

  layout();
  addEventListener('resize', function () { layout(); if (pin) { target = sFromScroll(); curS = target; paintS(curS); } else setHero(cur.T); });

  /* ---------- go ---------- */
  var heroT = offHours ? DAY1 : Treal;
  if (pin) {
    history.scrollRestoration = 'manual';
    var s0 = offHours ? TOTAL : sOfT(Treal);
    scrollTo(0, Math.round(s0 * UNIT));
    target = curS = sFromScroll();
    paintS(curS);
    addEventListener('scroll', function () { target = sFromScroll(); if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
    setInterval(function () { setHands(dial, cur.f > 0 && offHours ? lerp(DAY1, Treal, ease(cur.f)) : cur.T, secNow()); }, 90);
  } else {
    if (offHours) { H.forEach(function (h) { h.hidden = false; }); }
    paint(offHours ? DAY1 : heroT, offHours ? 1 : 0, offHours ? NH - 2 : idxOf(heroT));
    if (!stat && !rm) setInterval(function () { setHands(dial, cur.f > 0 && offHours ? Treal : cur.T, secNow()); }, 90);
    syncDup();
  }
  if (!mob) H.forEach(function (h) { if (!h.classList.contains('fin')) h.style.setProperty('--hbg', bgAt(+h.dataset.t)); });

  /* phone: entrance and progress */
  if (mob) {
    if (root.classList.contains('anim') && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { threshold: .25 });
      H.forEach(function (h) { io.observe(h); });
    } else H.forEach(function (h) { h.classList.add('in'); });
    var ctab = $('#ctabar');
    var onS = function () {
      if (ctab) ctab.classList.toggle('solo', scrollY > stage.offsetHeight * .55);
      var y = scrollY + NAV + 36, k = -1, i;
      for (i = 0; i < NH; i++) if (H[i].getBoundingClientRect().top + scrollY <= y) k = i;
      if (k < 0) { railOn = -2; dbtn.forEach(function (b) { b.classList.remove('on', 'past'); }); return; }
      var a = H[k].getBoundingClientRect().top + scrollY, b2 = k < NH - 1 ? H[k + 1].getBoundingClientRect().top + scrollY : a + H[k].offsetHeight;
      railSet(k, (y - a) / Math.max(1, b2 - a));
    };
    addEventListener('scroll', onS, { passive: true }); onS();
  }

  if (openParam === 'nav') { var it = items[1] || items[0]; openM(it); }
  if (openParam === 'sheet') sheetOpen(H[3], null);
  document.fonts && document.fonts.ready.then(function () { layout(); });
})();
