(function () {
  'use strict';
  var root = document.documentElement;
  var ST = root.classList.contains('st'), MOB = root.classList.contains('m'), PIN = root.classList.contains('pin');
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function eo(t) { return 1 - Math.pow(1 - t, 3); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function win(u, a, b) { return clamp((u - a) / (b - a), 0, 1); }
  var hrs = $$('.hr'), NH = hrs.length, join = $('#join'), stage = $('#stage');
  var openParam = root.getAttribute('data-open');

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
    it.addEventListener('focusout', function (e) { if (e.relatedTarget && !it.contains(e.relatedTarget)) closeM(it); });
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
    root.classList.toggle('lock', open); root.classList.toggle('mopen', open);
  }
  burger.addEventListener('click', function () { menu(mm.hidden); });
  $$('a', mm).forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mm.hidden) { menu(false); burger.focus(); } });

  /* ---------------- bottom sheet (phone) ---------------- */
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
    sheet.hidden = false; root.classList.add('lock'); shp.style.removeProperty('--dy');
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
    function end() { if (y0 == null) return; y0 = null; sheet.classList.remove('drag'); shp.style.transform = ''; if (dy > 90) sheetClose(); }
    g.addEventListener('pointerup', end); g.addEventListener('pointercancel', end);
    g.addEventListener('click', function (e) { if (dy > 6) e.stopImmediatePropagation(); }, true);
  })();
  if (MOB) {
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
    if (!RM) done.scrollIntoView({ block: 'center', behavior: 'smooth' });
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
      a: { head: 'Finished, not yet invoiced', total: '$41,300', recs: [
        { t: 'ts', r: 2102, v: 9450, col: 5, note: 'Ostrander Group, Q3 reporting support' },
        { t: 'pt', r: 312, v: 12000, col: 5, note: 'Harlow Dental, Phase 2 build' },
        { t: 'pt', r: 313, v: 6400, col: 5, note: 'Brightwater Co-op, Onboarding workshop' },
        { t: 'ts', r: 2101, v: 6650, col: 5, note: 'Pell & Marrow, Discovery sprint' },
        { t: 'mail', r: 88412, v: 6800, col: 4, note: 'Ostrander Group, Change request 7' }], foot: 'Five records add up to' },
      b: { head: 'Owed by Ostrander Group', total: '$16,250', recs: [
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
    var start = Math.max(0, Math.min(hi - 1, t.rows.length - 3)), win3 = t.rows.slice(start, start + 3);
    var head = '<tr>' + t.cols.map(function (c, ci) { return '<th' + (/^\$/.test(String(t.rows[0][ci])) ? ' class="r"' : '') + '>' + c + '</th>'; }).join('') + '</tr>';
    var body = win3.map(function (rw) {
      return '<tr' + (rw === row ? ' class="hit"' : '') + '>' + rw.map(function (c, ci) {
        var cls = [/^\$/.test(String(c)) ? 'r' : '', rw === row && ci === r.col ? 'key' : ''].filter(Boolean).join(' ');
        return '<td' + (cls ? ' class="' + cls + '"' : '') + '>' + (ci === 0 ? Number(c).toLocaleString('en-US') : c) + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return '<div class="ln-meta"><button class="ln-back" type="button">&#8592; ' + f.total + '</button><span class="chip">' + t.sys + '</span><span class="chip">Row ' + Number(row[0]).toLocaleString('en-US') + '</span></div>' +
      '<div class="ln-wrap"><table class="ln"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div><p class="ln-note">Quoted as written in the record. The system is read, and never changed.</p>';
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
    f.classList.add('pulse'); await sleep(2600); if (!ok()) return;
    askFig('a'); f.classList.remove('pulse'); await sleep(2600); if (!ok()) return;
    askRec('a', 0);
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
    if (ST) { askFig('a'); askDone = true; }
  }

  /* ---------------- the brain: the real surface from brain.js ---------------- */
  var G = null;
  if (window.Brain3D) {
    var host = document.createElement('canvas'); host.width = host.height = 2;
    host.style.cssText = 'position:absolute;left:0;top:0;width:2px;height:2px;opacity:0;pointer-events:none';
    document.body.appendChild(host);
    try { var bm = Brain3D.mount(host, { style: 'lobe', labels: false, count: MOB ? 640 : 0 }); bm.stop(); G = bm.graph; } catch (e) { G = null; }
    host.remove();
  }

  /* ---------------- the clock ---------------- */
  var HM = [460, 555, 690, 760, 920, 1005, 1070], M_END = 1155;
  var clock = $('#clock'), ckH = $('.h', clock), ckM = $('.m', clock), ckA = $('.ap', clock), lastClock = '';
  function setClock(m) {
    m = Math.round(m); var h24 = Math.floor(m / 60), mi = m % 60, ap = h24 >= 12 ? 'PM' : 'AM', h12 = h24 % 12 || 12;
    var s = h12 + ':' + mi + ap; if (s === lastClock) return; lastClock = s;
    ckH.textContent = h12; ckM.textContent = (mi < 10 ? '0' : '') + mi; ckA.textContent = ap;
  }

  /* ---------------- the rail ---------------- */
  var day = $('#day'), TL = HM.map(function (m) { var h24 = Math.floor(m / 60); return (h24 % 12 || 12) + ':' + ('0' + (m % 60)).slice(-2) + (h24 >= 12 ? ' PM' : ' AM'); }).concat(['7:15 PM']);
  day.innerHTML = TL.map(function (t, i) { return '<button type="button" aria-label="' + t + '" data-i="' + i + '"><span class="tk"></span><span class="tl">' + t + '</span></button>'; }).join('');
  var dbtn = $$('button', day), railOn = -2;
  function railSet(k, frac) {
    if (k !== railOn) {
      dbtn.forEach(function (b, i) { b.classList.toggle('on', i === k); b.classList.toggle('past', i < k); if (i === k) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      railOn = k;
    }
    if (MOB && k >= 0) dbtn[k].style.setProperty('--f', Math.round(clamp(frac, 0, 1) * 100) + '%');
  }

  function applyOpen() {
    if (openParam === 'nav' && items[0]) setTimeout(function () { openM(items[0]); }, 400);
    if (openParam === 'sheet' && MOB) setTimeout(function () { var s = $('#h0 .src'); if (s) { hrs[0].scrollIntoView(); sheetOpen(hrs[0], s); } }, 900);
  }
  if (!G) { applyOpen(); return; }

  /* ---------------- geometry of the brain ---------------- */
  var P = G.pts, N = P.length, X = new Float32Array(N), Y = new Float32Array(N), Z = new Float32Array(N), i, j;
  for (i = 0; i < N; i++) { X[i] = P[i].x; Y[i] = P[i].y; Z[i] = P[i].z; }
  var EN = G.edges.length, EA = new Int32Array(EN), EB = new Int32Array(EN);
  for (i = 0; i < EN; i++) { EA[i] = G.edges[i][0]; EB[i] = G.edges[i][1]; }
  var REG = [{ x: -.30, y: -.10, r: .27 }, { x: .02, y: -.30, r: .25 }, { x: -.10, y: .16, r: .25 }, { x: -.27, y: -.24, r: .23 }, { x: .32, y: -.04, r: .25 }, { x: .08, y: -.04, r: .23 }, { x: .20, y: .15, r: .23 }];
  function bfs(from) {
    var d = new Int16Array(N).fill(-1), q = [from], h = 0; d[from] = 0;
    while (h < q.length) { var n = q[h++], a = G.adj[n]; for (var k = 0; k < a.length; k++) { var m = a[k]; if (d[m] < 0) { d[m] = d[n] + 1; q.push(m); } } }
    return d;
  }
  function prep(reg, nrec) {
    var w = new Float32Array(N), best = -1, bd = 9, cand = [];
    for (var k = 0; k < N; k++) {
      var dd = Math.hypot(X[k] - reg.x, Y[k] - reg.y);
      if (dd < reg.r) { var f = 1 - dd / reg.r; w[k] = f * f * (3 - 2 * f); if (Z[k] < 0 && w[k] > .3) cand.push(k); }
      if (Z[k] < 0 && dd < bd) { bd = dd; best = k; }
    }
    var dep = bfs(best), maxd = 1;
    for (k = 0; k < N; k++) if (w[k] > 0 && dep[k] > maxd) maxd = dep[k];
    cand.sort(function (a, b) { return Math.atan2(Y[a] - reg.y, X[a] - reg.x) - Math.atan2(Y[b] - reg.y, X[b] - reg.x); });
    var org = [];
    for (k = 0; k < nrec; k++) org.push(cand.length ? cand[Math.floor((k + .5) * cand.length / nrec) % cand.length] : best);
    return { w: w, dep: dep, maxd: maxd, org: org };
  }
  var RD = hrs.map(function (h, k) { return prep(REG[k], $$('.rl li', h).length); });
  var RD0 = RD[0];

  /* ---------------- records: named, they orbit in ---------------- */
  var RECS = hrs.map(function (h) { return $$('.rl li', h).map(function (li) { var d = document.createElement('div'); d.className = 'rec'; d.innerHTML = '<b></b><span></span>'; $('b', d).textContent = li.dataset.n; $('span', d).textContent = li.dataset.r; return d; }); });

  /* ---------------- scenes ---------------- */
  function mkScene(cv, recHost) { return { cv: cv, ctx: cv.getContext('2d'), W: 0, H: 0, dpr: 1, glow: new Float32Array(N), recHost: recHost, pb: null, tg: null }; }
  function fit(sc, W, H) {
    sc.dpr = Math.min(window.devicePixelRatio || 1, MOB ? 2 : 1.75); sc.W = W; sc.H = H;
    sc.cv.width = Math.round(W * sc.dpr); sc.cv.height = Math.round(H * sc.dpr);
  }
  /* bokeh targets: the particles become the candlelight of the table */
  var FACES = [[.30, .31, .45, .53], [.61, .27, .77, .46]];
  var CAND = [[.4725, .281, 7, .012], [.505, .263, 8, .012], [.5325, .281, 7, .012], [.099, .45, 4, .01], [.27, .48, 4, .01], [.914, .431, 5, .011], [.267, .315, 2, .05], [.47, .29, 2, .05]];
  function seedRand(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function gauss(r) { return (r() + r() + r() - 1.5) * .8; }
  function buildTargets(sc) {
    var r = seedRand(7), tg = new Float32Array(N * 4), tot = 0, c;
    for (c = 0; c < CAND.length; c++) tot += CAND[c][2];
    for (i = 0; i < N; i++) {
      var fx, fy, tries = 0, tight = false;
      do {
        if (r() < .88) { var pick = r() * tot, k = 0; while (pick > CAND[k][2]) { pick -= CAND[k][2]; k++; } var cc = CAND[k]; tight = cc[3] < .02; fx = cc[0] + gauss(r) * cc[3]; fy = cc[1] + gauss(r) * cc[3] * 1.5; }
        else { fx = .02 + r() * .96; fy = .04 + r() * .8; }
        var hit = false; for (var f = 0; f < FACES.length; f++) if (fx > FACES[f][0] && fx < FACES[f][2] && fy > FACES[f][1] && fy < FACES[f][3]) hit = true;
        tries++;
      } while (hit && tries < 12);
      tg[i * 4] = fx; tg[i * 4 + 1] = fy; tg[i * 4 + 2] = tight ? 1.4 + r() * 3 : 2.2 + r() * 6.5; tg[i * 4 + 3] = tight ? .14 + r() * .2 : .1 + r() * .3;
    }
    sc.tg = tg;
  }
  function photoBox(sc, img) {
    if (!MOB || !img) { var s = Math.max(sc.W / 2400, sc.H / 1600), w = 2400 * s, h = 1600 * s; return { x: (sc.W - w) / 2, y: (sc.H - h) / 2, w: w, h: h }; }
    var r = img.getBoundingClientRect(), c = sc.cv.getBoundingClientRect(); return { x: r.left - c.left, y: r.top - c.top, w: r.width, h: r.height };
  }

  /* poses */
  function poses(W, H) {
    if (MOB) {
      var zt = 84, zb = H * .44, zh = zb - zt, std = { cx: W / 2, cy: (zt + zb) / 2 + 6, S: Math.min(W * .8, zh * 1.45), rx: W * .33, ry: zh * .4 };
      return { std: std, proof: std, hero: std, end: { cx: W / 2, cy: H * .34, S: Math.min(W * .74, H * .5), rx: 0, ry: 0 } };
    }
    return {
      std: { cx: .3 * W, cy: .56 * H, S: Math.min(.42 * W, .8 * H), rx: .19 * W, ry: .34 * H },
      proof: { cx: .2 * W, cy: .57 * H, S: Math.min(.27 * W, .6 * H), rx: .14 * W, ry: .3 * H },
      hero: { cx: .655 * W, cy: .34 * H, S: Math.min(.45 * W, .74 * H), rx: 0, ry: 0 },
      end: { cx: .5 * W, cy: .45 * H, S: Math.min(.5 * W, .8 * H), rx: 0, ry: 0 }
    };
  }
  function pl(a, b, t) { return { cx: lerp(a.cx, b.cx, t), cy: lerp(a.cy, b.cy, t), S: lerp(a.S, b.S, t), rx: lerp(a.rx, b.rx, t), ry: lerp(a.ry, b.ry, t) }; }

  /* ---------------- paint ---------------- */
  var sx = new Float32Array(N), sy = new Float32Array(N), sd = new Float32Array(N), sz = new Float32Array(N), ord = [];
  for (i = 0; i < N; i++) ord.push(i);
  var TOD0 = [150, 176, 198], TOD1 = [232, 192, 146];
  function paint(sc, S) {
    var ctx = sc.ctx, W = sc.W, H = sc.H, Pp = S.pose, scale = Pp.S / .98, cx = Pp.cx, cy = Pp.cy + .045 * scale;
    ctx.setTransform(sc.dpr, 0, 0, sc.dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var ca = Math.cos(S.ang), sa = Math.sin(S.ang), ct = .98, st = .1987;
    for (i = 0; i < N; i++) {
      var x = X[i] * ca - Z[i] * sa, z = X[i] * sa + Z[i] * ca, y = Y[i] * ct - z * st, z2 = Y[i] * st + z * ct, d = 4.1 / (4.1 + z2);
      sx[i] = cx + x * scale * d; sy[i] = cy + y * scale * d; sd[i] = d; sz[i] = z2;
    }
    var tod = S.tod, br = lerp(TOD0[0], TOD1[0], tod) | 0, bg = lerp(TOD0[1], TOD1[1], tod) | 0, bb = lerp(TOD0[2], TOD1[2], tod) | 0;
    var base = br + ',' + bg + ',' + bb;
    var e = S.ep > 0 ? ease(clamp((S.ep - .04) / .46, 0, 1)) : 0, h = S.h, R = RD[h < 0 ? 0 : h], g = sc.glow;
    /* the wave and the level */
    var spread, lvl = 1;
    if (S.h < 0) { var cyc = S.t % 8; spread = clamp(cyc / 3.4, 0, 1) * (R.maxd + 4); lvl = cyc < 5 ? 1 : 1 - (cyc - 5) / 3; lvl = .35 + .65 * lvl; }
    else { spread = win(S.uc, .04, .2) * (R.maxd + 4); lvl = S.ep > 0 ? .62 * (1 - e) : lerp(1, .62, win(S.uc, .78, .95)); }
    var kk = S.snap ? 1 : 1 - Math.exp(-S.dt * 5.5), r0 = (MOB ? 1.9 : 1.55);
    var lit = [], sw = 0, cwx = 0, cwy = 0;
    for (i = 0; i < N; i++) {
      var w = R.w[i], tw = 0, rg = 0;
      if (w > 0) { var fr = spread - R.dep[i]; tw = w * clamp(fr, 0, 1) * lvl; rg = clamp(1 - Math.abs(fr - .6) / 1.6, 0, 1) * w; }
      g[i] += (tw - g[i]) * kk;
      if (w > .25) { sw += w; cwx += w * sx[i]; cwy += w * sy[i]; }
      if (g[i] > .035 || rg > .04) lit.push(i, Math.min(1, g[i] + rg * .9));
    }
    ord.sort(function (a, b) { return sz[b] - sz[a]; });
    /* dispersal into candlelight */
    if (e > 0) {
      var pb = sc.pb, tg = sc.tg; if (!tg) buildTargets(sc), tg = sc.tg;
      var burst = Math.sin(Math.PI * e) * .55;
      for (i = 0; i < N; i++) {
        var tx = pb.x + tg[i * 4] * pb.w, ty = pb.y + tg[i * 4 + 1] * pb.h, ph = i * .37;
        var bx = sx[i] + (sx[i] - cx) * burst, by = sy[i] + (sy[i] - cy) * burst;
        sx[i] = lerp(bx, tx, e) + Math.sin(S.t * .5 + ph) * 3 * e; sy[i] = lerp(by, ty, e) + Math.cos(S.t * .43 + ph) * 3 * e;
      }
    }
    /* edges */
    var ef = 1 - clamp(S.ep * 3.2, 0, 1);
    if (ef > .01) {
      var p0 = new Path2D(), p1 = new Path2D(), p2 = new Path2D(), pp = [p0, p1, p2], le = [];
      for (var q = 0; q < EN; q++) {
        var a = EA[q], b = EB[q], gg = (g[a] + g[b]) * .5;
        if (gg > .05) { le.push(q, gg); continue; }
        var dm = (sd[a] + sd[b]) * .5, pth = dm < .97 ? p0 : dm < 1.03 ? p1 : p2;
        pth.moveTo(sx[a], sy[a]); pth.lineTo(sx[b], sy[b]);
      }
      ctx.lineWidth = .8; ctx.lineCap = 'round';
      var ea = [.09, .15, .26];
      for (q = 0; q < 3; q++) { ctx.strokeStyle = 'rgba(' + base + ',' + (ea[q] * ef) + ')'; ctx.stroke(pp[q]); }
      ctx.lineWidth = 1.25;
      for (q = 0; q < le.length; q += 2) {
        var ed = le[q], f2 = le[q + 1];
        ctx.strokeStyle = 'rgba(255,' + (190 + 40 * f2 | 0) + ',' + (120 + 70 * f2 | 0) + ',' + (.62 * f2 * ef) + ')';
        ctx.beginPath(); ctx.moveTo(sx[EA[ed]], sy[EA[ed]]); ctx.lineTo(sx[EB[ed]], sy[EB[ed]]); ctx.stroke();
      }
    }
    /* nodes */
    if (e <= 0) {
      var n0 = new Path2D(), n1 = new Path2D(), n2 = new Path2D(), np = [n0, n1, n2];
      for (var o = 0; o < N; o++) {
        var ni = ord[o], dv = sd[ni], rr = r0 * dv, pth2 = dv < .97 ? n0 : dv < 1.03 ? n1 : n2;
        pth2.moveTo(sx[ni] + rr, sy[ni]); pth2.arc(sx[ni], sy[ni], rr, 0, 6.2832);
      }
      var na = [.4, .62, .9];
      for (q = 0; q < 3; q++) { ctx.fillStyle = 'rgba(' + base + ',' + na[q] + ')'; ctx.fill(np[q]); }
      for (q = 0; q < lit.length; q += 2) {
        var li = lit[q], f3 = lit[q + 1], rl = r0 * sd[li] * (1 + f3 * 1.9);
        ctx.globalAlpha = .1 * f3; ctx.fillStyle = '#ffb25c'; ctx.beginPath(); ctx.arc(sx[li], sy[li], rl * 3.6, 0, 6.2832); ctx.fill();
        ctx.globalAlpha = .5 + .5 * f3; ctx.fillStyle = 'rgb(255,' + (196 + 48 * f3 | 0) + ',' + (130 + 90 * f3 | 0) + ')';
        ctx.beginPath(); ctx.arc(sx[li], sy[li], rl, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else {
      ctx.globalCompositeOperation = 'lighter';
      var tg2 = sc.tg, pbw = sc.pb.w / 1440;
      for (i = 0; i < N; i++) {
        var rb = lerp(r0 * sd[i], tg2[i * 4 + 2] * Math.max(.5, pbw), e), tw2 = .5 + .5 * Math.sin(S.t * .9 + i);
        ctx.globalAlpha = lerp(.55, tg2[i * 4 + 3] * (.7 + .5 * tw2), e);
        ctx.fillStyle = i % 7 === 0 ? 'rgb(255,226,186)' : 'rgb(255,' + (172 + (i % 5) * 9) + ',' + (96 + (i % 4) * 14) + ')';
        ctx.beginPath(); ctx.arc(sx[i], sy[i], rb, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
    /* embers rising from the candles into the mind */
    if (S.h < 0 && S.hp < .9 && sc.flames) {
      ctx.globalCompositeOperation = 'lighter';
      for (var m = 0; m < sc.flames.length; m++) {
        var fl = sc.flames[m], ph2 = (S.t * fl.sp + fl.ph) % 1, up = sc.embTop - 0, yy = fl.y - (fl.y - (Pp.cy + Pp.S * .25)) * ph2 * 1.0, xx = fl.x + Math.sin(S.t * .8 + fl.ph * 9) * 12 * ph2 + (Pp.cx - fl.x) * ph2 * .35;
        ctx.globalAlpha = Math.sin(Math.PI * ph2) * .7 * (1 - S.hp); ctx.fillStyle = '#ffc07a';
        ctx.beginPath(); ctx.arc(xx, yy, fl.r * (1 - ph2 * .5), 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
    /* records fly into the lit region, the region sends one beam to the answer */
    var recs = h >= 0 ? RECS[h] : null, n = recs ? recs.length : 0, A = S.A, uc = S.uc, snp = S.snap;
    if (recs && S.ep <= 0) {
      var CX = sw > 0 ? cwx / sw : cx, CY = sw > 0 ? cwy / sw : cy;
      for (j = 0; j < n; j++) {
        var el = recs[j], o2 = RD[h].org[j];
        var ain = snp ? 1 : win(uc, .06 + .03 * j, .18 + .03 * j), rho = lerp(1.9, 1, eo(ain));
        var th = j / n * 6.2832 + h * .9 + .5 + (uc - .1) * 2.2 + S.t * .12;
        var ox = Pp.cx + Math.cos(th) * Pp.rx * rho, oy = Pp.cy + Math.sin(th) * Pp.ry * rho, ds = .9 + .1 * Math.sin(th);
        var x0 = sx[o2], y0 = sy[o2];
        var cvj = snp ? 0 : ease(win(uc, .30 + .03 * j, .44 + .03 * j));
        var px = lerp(ox, x0, cvj), py = lerp(oy, y0, cvj), rs = ds * (1 - .6 * cvj), ra = ain * (1 - win(cvj, .72, 1));
        el.style.opacity = ra.toFixed(3); el.style.transform = 'translate3d(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px,0) translate(-50%,-50%) scale(' + rs.toFixed(3) + ')';
        var tp = snp ? 1 : win(uc, .10 + .03 * j, .24 + .03 * j);
        if (tp > 0 && ra > .02) {
          var mx = (x0 + px) / 2, my = (y0 + py) / 2, dx = px - x0, dy = py - y0, ln = Math.hypot(dx, dy) || 1;
          var bow = (.16 + .08 * Math.sin(j * 1.7 + h)) * ln, qx = mx - dy / ln * bow, qy = my + dx / ln * bow, seg = 16, tt;
          for (var pass = 0; pass < 2; pass++) {
            ctx.strokeStyle = pass ? 'rgba(255,220,170,' + (.9 * ra) + ')' : 'rgba(255,178,92,' + (.26 * ra) + ')'; ctx.lineWidth = pass ? 1.4 : 4.5; ctx.lineCap = 'round';
            ctx.beginPath();
            for (var s2 = 0; s2 <= seg; s2++) { tt = s2 / seg * tp; var a1 = (1 - tt) * (1 - tt), a2 = 2 * tt * (1 - tt), a3 = tt * tt; var lx = a1 * x0 + a2 * qx + a3 * px, ly = a1 * y0 + a2 * qy + a3 * py; if (s2) ctx.lineTo(lx, ly); else ctx.moveTo(lx, ly); }
            ctx.stroke();
          }
          /* the signal runs from the record toward the region */
          var pt = (1 - ((S.t * .7 + j * .31) % 1)) * tp, b1 = (1 - pt) * (1 - pt), b2 = 2 * pt * (1 - pt), b3 = pt * pt;
          ctx.globalAlpha = ra; ctx.fillStyle = '#fff6e6'; ctx.beginPath(); ctx.arc(b1 * x0 + b2 * qx + b3 * px, b1 * y0 + b2 * qy + b3 * py, 3.2, 0, 6.2832); ctx.fill(); ctx.globalAlpha = 1;
        }
        if (cvj > 0 && cvj < 1) { ctx.strokeStyle = 'rgba(255,224,180,' + (.8 * (1 - cvj)) + ')'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x0, y0, 4 + cvj * 20, 0, 6.2832); ctx.stroke(); }
      }
      if (!snp) {
        var fl = Math.sin(Math.PI * win(uc, .38, .58));
        if (fl > 0) { var fr0 = Pp.S * .2 * (1 + fl * .4), gr = ctx.createRadialGradient(CX, CY, 0, CX, CY, fr0); gr.addColorStop(0, 'rgba(255,200,130,' + (.42 * fl) + ')'); gr.addColorStop(1, 'rgba(255,178,92,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(CX, CY, fr0, 0, 6.2832); ctx.fill(); }
        var bm2 = win(uc, .46, .58), bA = 1 - win(uc, .68, .78);
        if (bm2 > 0 && bA > 0) {
          var bdx = A.x - CX, bdy = A.y - CY, bl = Math.hypot(bdx, bdy) || 1, nx = -bdy / bl, ny = bdx / bl;
          for (var k2 = 0; k2 < 3; k2++) {
            var off = (k2 - 1) * bl * .06, qx2 = (CX + A.x) / 2 + nx * off * 2, qy2 = (CY + A.y) / 2 + ny * off * 2;
            for (pass = 0; pass < 2; pass++) {
              ctx.strokeStyle = pass ? 'rgba(255,228,190,' + ((k2 === 1 ? .95 : .55) * bA) + ')' : 'rgba(255,178,92,' + (.28 * bA) + ')'; ctx.lineWidth = pass ? 1.6 : 6;
              ctx.beginPath();
              for (s2 = 0; s2 <= 20; s2++) { tt = s2 / 20 * bm2; a1 = (1 - tt) * (1 - tt); a2 = 2 * tt * (1 - tt); a3 = tt * tt; lx = a1 * CX + a2 * qx2 + a3 * A.x; ly = a1 * CY + a2 * qy2 + a3 * A.y; if (s2) ctx.lineTo(lx, ly); else ctx.moveTo(lx, ly); }
              ctx.stroke();
            }
            var pt2 = ((S.t * .9 + k2 * .33) % 1) * bm2, c1 = (1 - pt2) * (1 - pt2), c2 = 2 * pt2 * (1 - pt2), c3 = pt2 * pt2;
            ctx.globalAlpha = bA; ctx.fillStyle = '#fff6e6'; ctx.beginPath(); ctx.arc(c1 * CX + c2 * qx2 + c3 * A.x, c1 * CY + c2 * qy2 + c3 * A.y, 3.6, 0, 6.2832); ctx.fill(); ctx.globalAlpha = 1;
          }
        }
        var fl2 = win(uc, .56, .72);
        if (fl2 > 0 && fl2 < 1) { ctx.strokeStyle = 'rgba(255,224,180,' + (.8 * (1 - fl2)) + ')'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(A.x, A.y, 6 + fl2 * 52, 0, 6.2832); ctx.stroke(); }
      }
    }
    S.lit = lit;
  }
  function hideRecs(h) { if (h < 0) return; RECS[h].forEach(function (el) { el.style.opacity = 0; }); }

  /* ---------------- field colour and glow ---------------- */
  var F0 = [20, 22, 26], F1 = [60, 45, 32], fieldEl = $('#field'), glowEl = $('#glow'), lastField = '';
  function setField(tod, gx, gy, gop) {
    var c = 'rgb(' + (lerp(F0[0], F1[0], tod) | 0) + ',' + (lerp(F0[1], F1[1], tod) | 0) + ',' + (lerp(F0[2], F1[2], tod) | 0) + ')';
    if (c !== lastField) { fieldEl.style.background = c; stage.style.backgroundColor = c; lastField = c; }
    glowEl.style.transform = 'translate3d(' + gx.toFixed(0) + 'px,' + gy.toFixed(0) + 'px,0)'; glowEl.style.opacity = gop.toFixed(3);
  }

  /* =================== STATIC: a finished still of every hour =================== */
  var p1 = $('#p1'), p2 = $('#p2'), hero = $('#hero'), closeEl = $('#close');
  if (ST) {
    var hh = document.createElement('div'); hh.className = 'hc'; hh.setAttribute('aria-hidden', 'true'); hero.insertBefore(hh, hero.firstChild); hero.insertBefore(p1, hh);
    var ch = $('.hc', closeEl); closeEl.insertBefore(p2, closeEl.firstChild); p2.style.opacity = 1; p2.loading = 'eager';
    var drawStatic = function () {
      var mk = function (host, fn) {
        var cv = host.querySelector('canvas') || host.appendChild(document.createElement('canvas')), sc = host.__sc || (host.__sc = mkScene(cv, host));
        var W = host.clientWidth, H = host.clientHeight; if (!W || !H) return; fit(sc, W, H); fn(sc, W, H);
      };
      mk(hh, function (sc, W, H) {
        var po = poses(W, H); sc.flames = null;
        paint(sc, { h: -1, u: 0, uc: 0, hp: 0, ep: 0, t: 5.5, dt: 1, snap: true, ang: -.25, tod: 0, pose: po.hero, A: { x: 0, y: 0 } });
      });
      hrs.forEach(function (hr, k) {
        mk($('.hc', hr), function (sc, W, H) {
          var std = { cx: .5 * W, cy: .52 * H, S: Math.min(.6 * W, .66 * H * 1.35), rx: .34 * W, ry: .36 * H };
          RECS[k].forEach(function (el) { if (el.parentNode !== sc.recHost) sc.recHost.appendChild(el); });
          paint(sc, { h: k, u: .5, uc: .5, hp: 0, ep: 0, t: 3, dt: 1, snap: true, ang: -.25 + k * .06, tod: (HM[k] - 460) / 695, pose: std, A: { x: W, y: H / 2 } });
        });
      });
      mk(ch, function (sc, W, H) { sc.pb = photoBox(sc, MOB ? p2 : null); sc.tg = null; paint(sc, { h: 6, u: 1, uc: 1, hp: 1, ep: 1, t: 4, dt: 1, snap: true, ang: -.25, tod: 1, pose: poses(W, H).end, A: { x: 0, y: 0 } }); });
    };
    var rs;
    addEventListener('resize', function () { clearTimeout(rs); rs = setTimeout(drawStatic, 150); });
    (document.fonts && document.fonts.ready || Promise.resolve()).then(function () { requestAnimationFrame(drawStatic); });
    window.addEventListener('load', function () { setTimeout(drawStatic, 80); });
    $$('.hr .a, .hr .ask, .hr .q').forEach(function (e) { e.style.opacity = ''; });
    dbtn.forEach(function (b) { b.addEventListener('click', function () { var t = b.dataset.i < NH ? hrs[b.dataset.i] : closeEl; t.scrollIntoView(); }); });
    if (openParam) applyOpen();
    return;
  }

  /* =================== LIVE =================== */
  var cv = $('#mind'), live = mkScene(cv, $('#recs')), recsEl = $('#recs');
  RECS.forEach(function (arr) { arr.forEach(function (el) { recsEl.appendChild(el); }); });
  var W = 0, H = 0, PO = null, trackTop = 0, joinTop = 0, vh = 0, track = $('#track');
  var HERO = .4, LEN = [1.1, 1.1, 1.1, 1.8, 1.1, 1.1, 1.1], ENDL = 1.6, CUM = [], TOT = 0;
  (function () { var a = 0; for (var k = 0; k < NH; k++) { CUM.push(a); a += LEN[k]; } TOT = a; })();
  var CI = [.6, .6, .6, .45, .6, .6, .6];
  function layout() {
    var nw = document.documentElement.clientWidth, nh = innerHeight;
    if (MOB && W && Math.abs(nw - W) < 2 && Math.abs(nh - H) < 140) return;
    W = nw; H = nh; vh = H; fit(live, W, H); PO = poses(W, H);
    if (PIN) track.style.height = ((HERO + TOT + ENDL + 1) * vh) + 'px';
    trackTop = track.getBoundingClientRect().top + scrollY; joinTop = join.getBoundingClientRect().top + scrollY;
    var pr = p1.getBoundingClientRect(), dy = parseFloat((p1.style.transform.match(/translate3d\(0px,\s*([-\d.]+)px/) || [0, 0])[1]) || 0;
    var fx = [[.4725, .281], [.505, .263], [.5325, .281]], rr = seedRand(3);
    live.flames = [];
    var cnt = MOB ? 12 : 30;
    for (var k = 0; k < cnt; k++) { var f = fx[k % 3]; live.flames.push({ x: pr.left + f[0] * pr.width, y: pr.top - dy + f[1] * pr.height, sp: .09 + rr() * .07, ph: rr(), r: 1.2 + rr() * 1.6 }); }
    live.embTop = 0;
    live.pb = photoBox(live, MOB ? p2 : null); live.tg = null;
  }
  layout();
  var lt;
  addEventListener('resize', function () { clearTimeout(lt); lt = setTimeout(function () { var m = matchMedia('(max-width:700px)').matches; if (m !== MOB) { location.reload(); return; } layout(); }, 120); });
  (document.fonts && document.fonts.ready || Promise.resolve()).then(function () { setTimeout(layout, 50); });
  addEventListener('load', function () { setTimeout(layout, 80); });

  var curH = -2, ss = scrollY, lastT = performance.now(), running = false, played = [], arrive = [], tween = null, afterAns = false;
  function anchorOf(hr) { var t = $('.ask, .a', hr), r = t.getBoundingClientRect(); if (MOB) return { x: r.left + 26, y: clamp(r.top + 14, H * .36, H * .8) }; return { x: r.left - 12, y: r.top + Math.min(r.height * .3, 80) }; }

  function state(now, dt) {
    var S = { h: -1, u: 0, uc: 0, hp: 0, ep: 0, t: now / 1000, dt: dt, snap: false }, m = HM[0];
    S.ang = -.18 + Math.sin(S.t * .3) * .42;
    if (PIN) {
      var s = (ss - trackTop) / vh;
      if (s < HERO) { S.hp = clamp(s / HERO, 0, 1); }
      else {
        S.hp = 1; s -= HERO;
        if (s >= TOT) { S.h = NH - 1; S.u = 1; S.ep = clamp((s - TOT) / ENDL, 0, 1); }
        else { for (var k = NH - 1; k >= 0; k--) if (s >= CUM[k]) { S.h = k; S.u = clamp((s - CUM[k]) / LEN[k], 0, 1); break; } }
      }
    } else {
      S.hp = clamp(ss / (.6 * H), 0, 1);
      var rc = closeEl.getBoundingClientRect(); S.ep = clamp((H * .92 - rc.top) / (H * .92), 0, 1);
      var kk = -1, rects = [];
      for (var a = 0; a < NH; a++) { rects.push(hrs[a].getBoundingClientRect()); if (rects[a].top <= .62 * H) kk = a; }
      if (kk >= 0) {
        var p = (.62 * H - rects[kk].top) / (.62 * H);
        if (!arrive[kk] && p >= .6) arrive[kk] = now;
        var us = .1 * clamp(p, 0, 1), up = arrive[kk] ? .1 + .82 * ease(clamp((now - arrive[kk]) / 3600, 0, 1)) : 0;
        if (played[kk]) up = .92;
        if (arrive[kk] && now - arrive[kk] > 3600) played[kk] = true;
        S.h = kk; S.u = Math.max(us, up); S.p = p;
        if (p > 1) S.u = Math.max(S.u, .92 + clamp((p - 1) / .6, 0, 1) * .07);
      }
    }
    S.uc = PIN ? clamp(S.u / CI[Math.max(0, S.h)], 0, 1) : S.u;
    return S;
  }

  function frame(now) {
    var dt = clamp((now - lastT) / 1000, 0, .1); lastT = now;
    if (document.hidden) { running = false; return; }
    ss += (scrollY - ss) * (PIN ? 1 - Math.exp(-dt * 10) : 1); if (Math.abs(scrollY - ss) < .3) ss = scrollY;
    if (scrollY > joinTop + 10 && !tween) { running = false; return; }
    var S = state(now, dt), h = S.h, u = S.u;
    if (h !== curH) {
      if (curH >= 0) { hrs[curH].style.visibility = ''; hideRecs(curH); }
      curH = h; if (h >= 0 && PIN) hrs[h].style.visibility = 'visible';
    }
    /* pose */
    var pose;
    if (S.ep > 0) pose = pl(h >= 0 && h === 3 ? PO.proof : PO.std, PO.end, ease(clamp(S.ep / .4, 0, 1)));
    else if (h < 0) pose = pl(PO.hero, PO.std, ease(S.hp));
    else { var prev = h === 0 ? PO.std : (h - 1 === 3 ? PO.proof : PO.std), cur = h === 3 ? PO.proof : PO.std; pose = pl(prev, cur, ease(win(u, 0, .1))); }
    S.pose = pose;
    /* clock and tod */
    var mins;
    if (h < 0) mins = HM[0]; else {
      var pm = h === 0 ? HM[0] : HM[h - 1];
      mins = lerp(pm, HM[h], ease(win(u, 0, .08)));
      if (S.ep > 0) mins = lerp(HM[6], M_END, ease(win(S.ep, 0, .12)));
    }
    S.tod = clamp((mins - 460) / (M_END - 460), 0, 1);
    setClock(mins);
    if (MOB) clock.style.opacity = '0';
    else clock.style.opacity = h < 0 ? win(S.hp, .55, 1).toFixed(2) : '1';
    /* anchor */
    S.A = h >= 0 ? anchorOf(hrs[h]) : { x: 0, y: 0 };
    /* DOM of the current hour */
    if (h >= 0) driveHour(hrs[h], h, S);
    if (PIN) driveLayers(S);
    else driveLayersFlow(S);
    paint(live, S);
    var gl = (.16 + .5 * S.tod) * (S.ep > 0 ? 1 - win(S.ep, .2, .7) : 1);
    setField(S.tod, pose.cx, pose.cy, gl);
    /* rail */
    railSet(S.ep > .5 ? NH : h, MOB ? (h >= 0 ? u : 0) : 0);
    requestAnimationFrame(frame);
  }
  function start() { if (running) return; running = true; lastT = performance.now(); requestAnimationFrame(frame); }
  addEventListener('scroll', function () { if (!running && !document.hidden) start(); }, { passive: true });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });
  start();

  function sty(el, o, ty) { el.style.opacity = o.toFixed(3); el.style.transform = ty ? 'translate3d(0,' + ty.toFixed(1) + 'px,0)' : ''; }
  var qEls = hrs.map(function (hr) { return $('.hx > .q', hr); }), hxEls = hrs.map(function (hr) { return $('.hx', hr); }),
      aKids = hrs.map(function (hr) { var a = $('.a', hr); return a ? { f: $('.f', a), y: $('.y', a), n: $('.n', a), s: $('.src', a) } : null; });
  var SUBQ = [
    [['Who has missed ten days or more?', 'Attendance records'], ['Has anyone called home?', 'Contact log'], ['What does the handbook say to do?', 'Student handbook']],
    [['Which orders are waiting on a part?', 'Purchase orders'], ['Which deliveries have not arrived?', 'Receiving log'], ['What did each supplier last say?', 'Supplier email']],
    [['Which schedule did the council adopt?', 'Adopted fees'], ['Which copy sits at the counter?', 'Counter copy'], ['When did the new fees take effect?', 'Council minutes']],
    null,
    [['What did each item sell for?', 'Register sales'], ['What did each item cost us?', 'Supplier invoices'], ['Which items were on the front table?', 'Front table plan']],
    [['What does the ledger call this supplier?', 'Ledger'], ['What does the mailbox call it?', 'Mailbox'], ['What do the contracts call it?', 'Contracts']],
    [['Which figures are in the report?', 'Grant ledger'], ['Where was each one recorded?', 'Program log'], ['What does the agreement require?', 'Award terms']]
  ];
  var TRS = hrs.map(function (hr, k) {
    if (!PIN || !SUBQ[k]) return null;
    var a = $('.a', hr), stk = document.createElement('div'); stk.className = 'stack'; a.parentNode.insertBefore(stk, a); stk.appendChild(a);
    var ol = document.createElement('ol'); ol.className = 'tr'; ol.setAttribute('aria-hidden', 'true');
    ol.innerHTML = SUBQ[k].map(function (s) { return '<li><span>' + s[0] + '</span><em>' + s[1] + '</em></li>'; }).join('');
    stk.insertBefore(ol, a); return $$('li', ol);
  });
  var askRest = $('#ak-rest'), askTop = $('.ak-top', ask), askQ = $('.ak-q', ask), askLk = $('.ak-looked', ask), askA = $('.ak-a', ask), askS = $('.ak-src', ask);
  function driveHour(hr, h, S) {
    var u = S.u, uc = S.uc, exit = PIN ? win(u, .93, 1) : 0;
    if (PIN) {
      var hx = hxEls[h]; sty(hx, 1 - exit, -exit * 16);
      var qi = ease(win(u, 0, .06));
      if (h === 3) {
        var ci = ease(win(u, 0, .06)); ask.style.opacity = ci.toFixed(3); ask.style.transform = 'translate3d(0,' + ((1 - ci) * 22).toFixed(1) + 'px,0)';
        var ap = ease(win(uc, .56, .7)); askRest.style.gridTemplateRows = ap.toFixed(3) + 'fr'; sty(askA, ap, (1 - ap) * 14); sty(askS, ease(win(uc, .64, .78)), 0);
        if (uc > .75 && !askDone) askPlay();
      } else {
        sty(qEls[h], qi, (1 - qi) * 20);
        var tr = TRS[h]; if (tr) tr.forEach(function (li, jj) { var ti = ease(win(uc, .06 + .03 * jj, .16 + .03 * jj)) * (1 - ease(win(uc, .54, .62))); li.style.opacity = ti.toFixed(3); li.style.transform = 'translate3d(0,' + ((1 - ti) * 10).toFixed(1) + 'px,0)'; li.classList.toggle('on', uc > .4 + .03 * jj); });
        var k = aKids[h], f = ease(win(uc, .56, .68));
        k.f.style.opacity = f.toFixed(3); k.f.style.transform = 'translate3d(0,' + ((1 - f) * 16).toFixed(1) + 'px,0)'; k.f.style.clipPath = f < 1 ? 'inset(-6px ' + ((1 - f) * 100).toFixed(1) + '% -6px 0)' : '';
        sty(k.y, ease(win(uc, .64, .74)), (1 - ease(win(uc, .64, .74))) * 10);
        sty(k.n, ease(win(uc, .7, .8)), (1 - ease(win(uc, .7, .8))) * 10);
        sty(k.s, ease(win(uc, .76, .86)), (1 - ease(win(uc, .76, .86))) * 8);
      }
    } else {
      hr.classList.toggle('asked', u > .03 || (S.p || 0) > .3);
      var on = u > .58; hr.classList.toggle('ans', on);
      if (h === 3 && on && !askDone) askPlay();
    }
    if (h === 3) { askA.style.pointerEvents = ''; }
  }
  var heroCopy = $('.hero-copy', hero), hscrim = $('#hscrim'), p1o = -1;
  function driveLayers(S) {
    var hp = S.hp, h = S.h, ep = S.ep, e1 = ease(win(hp, .1, .9));
    p1.style.opacity = (1 - e1).toFixed(3); p1.style.transform = 'translate3d(0,' + (hp * 7 * vh / 100).toFixed(1) + 'px,0) scale(' + (1 - hp * .04).toFixed(4) + ')';
    var hv = hp < 1 && h < 0; hero.style.visibility = hv ? 'visible' : 'hidden';
    heroCopy.style.opacity = (1 - ease(win(hp, 0, .55))).toFixed(3); hscrim.style.opacity = heroCopy.style.opacity; heroCopy.style.transform = 'translate3d(0,' + (-hp * 6 * vh / 100).toFixed(1) + 'px,0)';
    p2.style.opacity = ease(win(ep, .06, .4)).toFixed(3);
    var cw = ep > 0; closeEl.style.visibility = cw ? 'visible' : 'hidden';
    closeEl.style.setProperty('--scrim', ease(win(ep, .5, .8)).toFixed(2));
    var ch2 = $('.close-in', closeEl), tin = ease(win(ep, .56, .7)), t2 = ease(win(ep, .66, .8)), t3 = ease(win(ep, .78, .9));
    var hh2 = $('h2', ch2), em = $('em', ch2), cta = $('.close-cta', ch2);
    hh2.style.opacity = tin.toFixed(3); hh2.style.transform = 'translate3d(0,' + ((1 - tin) * 20).toFixed(1) + 'px,0)';
    em.style.opacity = t2.toFixed(3); cta.style.opacity = t3.toFixed(3); cta.style.pointerEvents = t3 > .6 ? 'auto' : 'none';
  }
  function driveLayersFlow(S) {
    heroCopy.style.opacity = (1 - win(S.hp, 0, .5)).toFixed(3);
    p1.style.opacity = (1 - ease(win(S.hp, .15, .95))).toFixed(3);
    p2.style.opacity = ease(win(S.ep, .1, .55)).toFixed(3);
    closeEl.style.setProperty('--scrim', ease(win(S.ep, .5, .85)).toFixed(2));
    var cin = $('.close-in', closeEl); cin.style.opacity = ease(win(S.ep, .6, .85)).toFixed(3);
  }

  /* ---------------- keys, rail and pitching ---------------- */
  function settleY(k) {
    if (PIN) {
      if (k < 0) return 0;
      if (k >= NH) return trackTop + (HERO + TOT + ENDL * .97) * vh;
      return trackTop + (HERO + CUM[k] + LEN[k] * (k === 3 ? .58 : .9)) * vh;
    }
    var t = k < 0 ? 0 : k >= NH ? closeEl : hrs[k];
    return k < 0 ? 0 : t.getBoundingClientRect().top + scrollY;
  }
  function goTo(k) {
    var y = settleY(k), y0 = scrollY;
    if (RM || !PIN) { scrollTo({ top: y, behavior: RM ? 'auto' : 'smooth' }); return; }
    var dur = clamp(Math.abs(y - y0) / vh * .55, .9, 3.4) * 1000, t0 = performance.now(); tween = true;
    (function step(now) {
      if (!tween) return;
      var t = clamp((now - t0) / dur, 0, 1); scrollTo(0, y0 + (y - y0) * ease(t));
      if (t < 1) requestAnimationFrame(step); else tween = null;
    })(t0);
  }
  ['wheel', 'touchstart', 'pointerdown'].forEach(function (ev) { addEventListener(ev, function () { tween = null; }, { passive: true }); });
  dbtn.forEach(function (b) { b.addEventListener('click', function () { goTo(+b.dataset.i); }); });
  function nowIdx() {
    if (PIN) { var s = (scrollY - trackTop) / vh - HERO; if (s < -.05) return -1; if (s >= TOT + ENDL * .5) return NH; for (var k = NH - 1; k >= 0; k--) if (s >= CUM[k] - .02) return k; return -1; }
    var k2 = -1; for (var a = 0; a < NH; a++) if (hrs[a].getBoundingClientRect().top <= H * .5) k2 = a;
    if (closeEl.getBoundingClientRect().top <= H * .5) k2 = NH; return k2;
  }
  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var el = document.activeElement, tag = el && el.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el && el.isContentEditable)) return;
    if (openItem || !sheet.hidden || !mm.hidden || (el && el.closest && el.closest('.nav, .ask'))) return;
    if (scrollY > joinTop - 40) return;
    var k = nowIdx(), d = e.key === 'ArrowRight' ? 1 : -1, tgt = k + d;
    if (d < 0 && PIN && Math.abs(scrollY - settleY(k)) > vh * .25 && k >= 0) tgt = k;
    if (tgt < -1 || tgt > NH) return;
    e.preventDefault(); goTo(tgt);
  });
  $$('a[href="#h0"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); goTo(0); }); });
  applyOpen();
})();
