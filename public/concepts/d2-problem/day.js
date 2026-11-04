(function () {
  'use strict';
  var root = document.documentElement;
  var anim = root.classList.contains('anim'), pin = root.classList.contains('pin'), mob = root.classList.contains('mob');
  var qs = location.search;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return [].slice.call((c || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeO(t) { return 1 - Math.pow(1 - t, 3); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  var TAU = Math.PI * 2;
  var wasMob = mob;
  addEventListener('resize', function () { if ((innerWidth <= 700) !== wasMob) location.reload(); });

  var nav = $('#nav'), scenes = $$('.scene'), hero = $('#hero'), s1 = $('.s1'), open = $('.open'), main = $('#day');

  /* ---------------------------------------------------------------- navigation */
  var mts = $$('.mt'), scrim = $('#scrim'), openMt = null, hoverT = 0;
  function panelOf(b) { return document.getElementById(b.getAttribute('aria-controls')); }
  function openMenu(b) {
    if (openMt === b) return;
    if (openMt) { panelOf(openMt).hidden = true; openMt.setAttribute('aria-expanded', 'false'); }
    panelOf(b).hidden = false; b.setAttribute('aria-expanded', 'true'); scrim.hidden = false; openMt = b;
  }
  function closeMenu() {
    if (!openMt) return;
    panelOf(openMt).hidden = true; openMt.setAttribute('aria-expanded', 'false'); openMt = null; scrim.hidden = true;
  }
  var hoverOK = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;
  mts.forEach(function (b, i) {
    var mi = b.parentNode;
    b.addEventListener('click', function () { if (openMt === b) closeMenu(); else openMenu(b); });
    if (hoverOK) {
      mi.addEventListener('mouseenter', function () { clearTimeout(hoverT); hoverT = setTimeout(function () { openMenu(b); }, openMt ? 0 : 90); });
      mi.addEventListener('mouseleave', function () { clearTimeout(hoverT); hoverT = setTimeout(function () { if (openMt === b) closeMenu(); }, 160); });
    }
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); openMenu(b); var a = panelOf(b).querySelector('a'); if (a) a.focus(); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault(); var n = mts[(i + (e.key === 'ArrowRight' ? 1 : mts.length - 1)) % mts.length]; n.focus(); if (openMt) openMenu(n);
      }
    });
    panelOf(b).addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); closeMenu(); b.focus(); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        var links = $$('a', panelOf(b)), k = links.indexOf(document.activeElement);
        if (k > -1) { e.preventDefault(); links[(k + (e.key === 'ArrowDown' ? 1 : links.length - 1)) % links.length].focus(); }
      }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (openMt) { var b = openMt; closeMenu(); b.focus(); }
      if (root.classList.contains('sheet-open')) closeSheet();
      if (root.classList.contains('menu-open')) toggleMobMenu(false);
    }
  });
  document.addEventListener('click', function (e) { if (openMt && !e.target.closest('.mi')) closeMenu(); });
  scrim.addEventListener('click', closeMenu);
  nav.addEventListener('focusout', function (e) { if (openMt && e.relatedTarget && !e.relatedTarget.closest('.mi')) closeMenu(); });

  /* ---------------------------------------------------------------- phone menu, strip, bar */
  var burger = $('.burger'), mm = $('#mmenu'), mmIn = $('#mm-in');
  var strip = $('#strip');
  var LABELS = ['7:40', '9:15', '11:30', '12:40', '4:45', '5:50', '6:40', '7:15'];
  var FULL = ['7:40 AM', '9:15 AM', '11:30 AM', '12:40 PM', '4:45 PM', '5:50 PM', '6:40 PM', '7:15 PM'];
  function toggleMobMenu(on) {
    root.classList.toggle('menu-open', on);
    burger.setAttribute('aria-expanded', on ? 'true' : 'false');
    burger.setAttribute('aria-label', on ? 'Close menu' : 'Open menu');
    if (on) root.dataset.nav = 'ink';
  }
  if (mob) {
    var html = '';
    $$('.mi').forEach(function (mi, gi) {
      var name = $('.mt', mi).textContent, inner = '';
      $$('.pcol', mi).forEach(function (col) {
        var h = $('.pgh', col); if (!$('a', col)) return;
        if (h) inner += '<p class="mm-h">' + h.textContent + '</p>';
        $$('a', col).forEach(function (a) {
          var s = $('small', a);
          inner += '<a href="' + a.getAttribute('href') + '"><b>' + $('b', a).textContent + '</b>' + (s ? '<small>' + s.textContent + '</small>' : '') + '</a>';
        });
      });
      html += '<div class="mm-g"><button type="button" aria-expanded="false" aria-controls="mmp' + gi + '">' + name + '</button><div class="mm-p" id="mmp' + gi + '"><div>' + inner + '</div></div></div>';
    });
    html += '<div class="mm-act"><a class="s" href="#join">Get started</a><a href="/site/contact.html">Talk to us</a><a href="https://portal.loveleedaystudios.com/client/login">Sign in</a></div>';
    mmIn.innerHTML = html;
    mm.hidden = false;
    burger.addEventListener('click', function () { toggleMobMenu(!root.classList.contains('menu-open')); });
    $$('.mm-g > button', mm).forEach(function (b) {
      b.addEventListener('click', function () {
        var g = b.parentNode, on = !g.classList.contains('open');
        $$('.mm-g.open', mm).forEach(function (x) { x.classList.remove('open'); $('button', x).setAttribute('aria-expanded', 'false'); });
        g.classList.toggle('open', on); b.setAttribute('aria-expanded', on ? 'true' : 'false');
      });
    });
    $$('a', mm).forEach(function (a) { a.addEventListener('click', function () { toggleMobMenu(false); }); });
    strip.innerHTML = LABELS.map(function (l, i) { return '<button type="button" aria-label="Go to ' + FULL[i] + '" data-i="' + i + '">' + l + '</button>'; }).join('') + '<span class="bar"></span>';
    if (qs.indexOf('open=nav') > -1 || root.dataset.open === 'nav') { toggleMobMenu(true); var g0 = $('.mm-g', mm); if (g0) { g0.classList.add('open'); $('button', g0).setAttribute('aria-expanded', 'true'); } }
  } else if (qs.indexOf('open=nav') > -1 || root.dataset.open === 'nav') {
    openMenu(mts[1]);
  }

  /* ---------------------------------------------------------------- sheet (phone) */
  var REC = {
    s1: { h: 'Attendance, week 44', l: [[210, 'Student 0418, 11 days missed this term'], [211, 'Student 0422, 12 days missed this term'], [212, 'Student 0431, 10 days missed. Family contact: none on file', 1], [213, 'Handbook, section 4: ten missed days go to the family support team']] },
    s2: { h: 'Purchase orders, open', l: [[88, 'PO 55102, promised Oct 28, received: not yet'], [89, 'PO 55107, promised Oct 28, received: not yet', 1], [90, 'Receiving log, Oct 29: no delivery from either supplier']] },
    s3: { h: 'Adopted fee schedule', l: [[14, 'Permit review, effective July 1: $240', 1], [15, 'Counter copy, printed last year: $210'], [16, 'Adopted by council on May 6']] },
    s6: { h: 'Three systems, one company', l: [[1, 'Ledger: Vendor 44127, $18,420 this year'], [2, 'Mailbox: invoices from HES, $9,760 this year'], [3, 'Contracts: Harbor Equipment Services, master agreement', 1]] },
    s7: { h: 'Grant ledger, program supplies', l: [[30, 'Program supplies, Q2: $12,400, invoice on file'], [31, 'Volunteer hours, Q2: estimate from last year', 1], [32, 'Travel, Q2: $3,180, receipts on file']] },
    s8: { h: 'Deadlines calendar', l: [[7, 'Today: nothing open'], [8, 'Tomorrow: lease renewal, owner assigned', 1], [9, 'Tomorrow: vendor contract renewal, owner assigned']] }
  };
  var sheet = $('#sheet'), sbd = $('#sbd'), lastChip = null;
  function recHTML(r) {
    return '<p class="ln-h">' + r.h + '</p>' + r.l.map(function (x) { return '<p class="ln' + (x[2] ? ' on' : '') + '"><span>' + x[0] + '</span>' + x[1] + '</p>'; }).join('');
  }
  function openSheet(sc, chip) {
    var key = ['s1', 's2', 's3', 's6', 's7', 's8'].filter(function (k) { return sc.classList.contains(k); })[0];
    var src = $('.src', sc).firstChild.textContent.replace(/^Source:\s*/, '').replace(/\.$/, '');
    $('#sh-time').textContent = sc.dataset.time;
    $('#sh-t').textContent = src.charAt(0).toUpperCase() + src.slice(1);
    var y = $('.y', sc); $('#sh-y').textContent = y ? y.textContent : '';
    $('#sh-rec').innerHTML = recHTML(REC[key]);
    sheet.hidden = false; sbd.hidden = false; sheet.style.removeProperty('--drag');
    requestAnimationFrame(function () { root.classList.add('sheet-open'); $('#sx').focus(); });
    lastChip = chip;
  }
  function closeSheet() { root.classList.remove('sheet-open'); if (lastChip) lastChip.focus(); }
  if (mob) {
    scenes.forEach(function (sc) {
      var src = $('.a .src', sc); if (!src) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'chip';
      b.textContent = src.firstChild.textContent; b.setAttribute('aria-label', 'Show the record. ' + b.textContent);
      $('.a', sc).appendChild(b);
      b.addEventListener('click', function () { openSheet(sc, b); });
    });
    $('#sx').addEventListener('click', closeSheet); sbd.addEventListener('click', closeSheet);
    var gy = null, dy = 0;
    function dragStart(e) { if (e.target.closest('.sh-x')) return; if (sheet.scrollTop > 0 && !e.target.closest('#sgrab')) return; gy = e.clientY; dy = 0; }
    function dragMove(e) { if (gy == null) return; dy = Math.max(0, e.clientY - gy); sheet.classList.add('drag'); sheet.style.setProperty('--drag', 'translateY(' + dy + 'px)'); }
    function dragEnd() { if (gy == null) return; gy = null; sheet.classList.remove('drag'); if (dy > 90) closeSheet(); sheet.style.removeProperty('--drag'); }
    sheet.addEventListener('pointerdown', dragStart); addEventListener('pointermove', dragMove); addEventListener('pointerup', dragEnd); addEventListener('pointercancel', dragEnd);
    if (qs.indexOf('open=sheet') > -1 || root.dataset.open === 'sheet') {
      setTimeout(function () { var sc = $('.s2'); openSheet(sc, $('.chip', sc)); }, 400);
    }
  }

  /* ---------------------------------------------------------------- the proof: click any figure */
  var proof = $('#proof'), ledger = $('.ledger', proof), lineEl = $('.line', proof);
  var t2 = $('.t2', proof), t3 = $('.t3', proof), rows = $$('.row', proof), figs = $$('.fig', proof);
  var PD = {
    '4C': { h: 'Rent ledger, unit 4C', l: [[210, 'August rent, $6,300, due Aug 1, not paid'], [211, 'September rent, $6,300, due Sep 1, not paid'], [212, 'October rent, $6,300, due Oct 1, not paid. Total owed $18,900.', 1], [213, 'Lease section 3.2: rent is due on the first of the month']], n: 212 },
    '2A': { h: 'Rent ledger, unit 2A', l: [[131, 'September rent, $7,100, due Sep 1, not paid'], [132, 'October rent, $7,100, due Oct 1, not paid. Total owed $14,200.', 1], [133, 'Lease section 3.2: rent is due on the first of the month']], n: 132 },
    '1B': { h: 'Rent ledger, unit 1B', l: [[88, 'October rent, $11,300, due Oct 1, not paid. 21 days late.', 1], [89, 'Lease section 3.2: rent is due on the first of the month']], n: 88 },
    '3D': { h: 'Rent ledger, unit 3D', l: [[301, 'October rent, $11,100, due Oct 1, paid in part. $11,100 still owed.', 1], [302, 'Lease section 3.2: rent is due on the first of the month']], n: 301 },
    '1A': { h: 'Rent ledger, unit 1A', l: [[54, 'September rent, $3,950, due Sep 1, not paid'], [55, 'October rent, $3,950, due Oct 1, not paid. Total owed $7,900.', 1], [56, 'Lease section 3.2: rent is due on the first of the month']], n: 55 }
  };
  var interacted = false, demoRan = false;
  function showLedger(f) {
    var fresh = ledger.hidden; proof.classList.add('opened'); ledger.hidden = false; t2.hidden = false; t3.hidden = true;
    t2.textContent = f === 'late' ? 'Three lines, more than 30 days late' : 'Rent ledger, five lines';
    figs.forEach(function (x) { x.classList.toggle('on', x.dataset.f === f); });
    rows.forEach(function (r) { r.classList.toggle('dim', f === 'late' && r.dataset.late === '0'); });
    if (fresh) { lineEl.hidden = true; }
  }
  function showLine(id) {
    var d = PD[id]; if (!d) return;
    lineEl.hidden = true; void lineEl.offsetWidth;
    lineEl.innerHTML = '<p class="ln-h">' + d.h + '</p>' + d.l.map(function (x) { return '<p class="ln' + (x[2] ? ' on' : '') + '"><span>' + x[0] + '</span>' + x[1] + '</p>'; }).join('');
    lineEl.hidden = false; t3.hidden = false; t3.textContent = 'Line ' + d.n;
    rows.forEach(function (r) { r.classList.toggle('sel', r.dataset.r === id); });
  }
  figs.forEach(function (f) { f.addEventListener('click', function () { interacted = true; showLedger(f.dataset.f); }); });
  rows.forEach(function (r) { r.addEventListener('click', function () { interacted = true; if (ledger.hidden) showLedger('all'); showLine(r.dataset.r); }); });
  function demo() {
    if (demoRan || interacted) return; demoRan = true;
    var f = figs[2]; f.classList.add('pulse');
    setTimeout(function () { if (interacted) return; showLedger('late'); }, 700);
    setTimeout(function () { if (interacted) return; showLine('2A'); }, 2000);
  }
  showLedger('all'); showLine('4C');
  if (!anim) demoRan = true;
  var dwell = 0;
  function proofTick(visible, now) {
    if (!visible) { dwell = 0; return; }
    if (!dwell) dwell = now;
    if (now - dwell > 900) demo();
  }

  /* ---------------------------------------------------------------- the problem: a globe of unanswered questions */
  var cv = $('#qf'), ctx = cv.getContext('2d');
  var wall = $$('.wall li'), Q = wall.map(function (l) { return l.textContent.trim(); });
  var SI = wall.map(function (l) { return l.hasAttribute('data-s'); }).indexOf(true);
  var hcopy = $('.hcopy'), hint = $('.hint');
  var hx = 0, W = 0, H = 0, dpr = 1, R0 = 0, cxA = 0, cyA = 0, F = 14, rings = [], ready = false, surv = [], lineW = 0, DD = 1;
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function buildHero() {
    W = cv.clientWidth; H = cv.clientHeight; if (!W || !H) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2); cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    if (mob) { R0 = Math.min(W * .5, H * .29); cxA = W / 2; cyA = H * .32; F = 12.5; }
    else {
      R0 = Math.min(H * .39, W * .24); cxA = W - R0 - W * .035; cyA = H * .565; F = Math.max(14, Math.min(21, H / 48));
      var rg_ = document.createRange(); rg_.selectNodeContents($('.hh')); hx = 0;
      [].forEach.call(rg_.getClientRects(), function (r) { hx = Math.max(hx, r.right); });
    }
    DD = R0 * 3.4;
    ctx.font = '500 ' + F + 'px Switzer, system-ui, sans-serif';
    var mw = function (s) { return ctx.measureText(s).width; };
    var sp = mw(' '), gap = F * 2.6, NR = mob ? 11 : 17, lim = 74 * Math.PI / 180, rand = rng(11);
    var pool = Q.map(function (q, i) { return i; }).filter(function (i) { return i !== SI; });
    for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(rand() * (i + 1)), t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    var pi = 0; rings = []; surv = [];
    for (var k = 0; k < NR; k++) {
      var phi = -lim + 2 * lim * k / (NR - 1), r = R0 * Math.cos(phi), target = TAU * r, eq = k === (NR - 1) / 2, list = [], acc = 0;
      for (var guard = 0; guard < 40; guard++) {
        var qi = (eq && !list.length) ? SI : pool[pi++ % pool.length], nacc = acc + mw(Q[qi]) + gap;
        if (list.length && acc >= target * .8 && Math.abs(nacc - target) > Math.abs(acc - target)) break;
        list.push(qi); acc = nacc; if (acc > target * 1.5) break;
      }
      var words = [], x = 0;
      list.forEach(function (qi) {
        Q[qi].split(' ').forEach(function (tk) {
          var w = mw(tk), isS = eq && qi === SI;
          var o = { t: tk, x: x, w: w, s: isS }; words.push(o); if (isS) surv.push(o);
          x += w + sp;
        });
        x += gap - sp;
      });
      var sEnd = 0; words.forEach(function (o) { if (o.s) sEnd = o.x + o.w; });
      rings.push({ y: R0 * Math.sin(phi), r: r, words: words, total: x, dir: k % 2 ? 1 : -1, spd: .05 + .06 * rand(), a0: rand() * TAU, eq: eq, f: (sEnd / 2) / x, base: .55 + .3 * rand() });
    }
    // flat layout of the surviving question
    var Fs = mob ? 21 : Math.max(24, Math.min(42, W * .027)), sc = Fs / F, maxW = mob ? W - 56 : W * .78, lines = [[]], lw = [0];
    surv.forEach(function (o) {
      var ww = o.w * sc, li = lines.length - 1;
      if (lw[li] + ww > maxW && lines[li].length) { lines.push([]); lw.push(0); li++; }
      lines[li].push(o); o.lx = lw[li] + ww / 2; lw[li] += ww + sp * sc;
    });
    lineW = Math.max.apply(null, lw.map(function (v, i) { return v - sp * sc; }));
    lines.forEach(function (ln, li) {
      var wdt = lw[li] - sp * sc;
      ln.forEach(function (o) { o.fx = o.lx - wdt / 2; o.fy = (li - (lines.length - 1) / 2) * Fs * 1.32; o.sc = sc; });
    });
    ready = true;
  }
  var pa = [0, 0, 0, 0], pb = [0, 0, 0, 0], pc = [0, 0, 0, 0];
  function drawHero(h, time) {
    if (!ready) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    if (h >= .66) return;
    var t1 = clamp(h / .333, 0, 1), t2_ = clamp((h - .333) / .187, 0, 1), t3_ = clamp((h - .52) / .113, 0, 1);
    var e1 = ease(t1), e2 = ease(t2_);
    var kR = 1 - .72 * e1, cxC = lerp(cxA, W / 2, e1), cyC = lerp(cyA, H / 2, e1);
    var T = -.36 + .05 * Math.sin(time * .35), ct = Math.cos(T), st = Math.sin(T);
    function pj(o, x, y, z) { var y2 = y * ct - z * st, z2 = y * st + z * ct, s = DD / (DD - z2); o[0] = cxC + x * s * kR; o[1] = cyC + y2 * s * kR; o[2] = z2; o[3] = s; }
    ctx.font = '500 ' + F + 'px Switzer, system-ui, sans-serif'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#f5f1eb';
    var sy = 1, sx = 1;
    if (t3_ > 0) { sy = 1 - .97 * ease(clamp(t3_ / .5, 0, 1)); sx = 1 - ease(clamp((t3_ - .5) / .5, 0, 1)); }
    var ox = W / 2, oy = H / 2, tail = [];
    for (var k = 0; k < rings.length; k++) {
      var rg = rings[k], free = rg.a0 + rg.dir * (rg.spd * time + h * 16 * (.5 + rg.spd * 5)), off = free;
      if (rg.eq) { var al = -TAU * rg.f; al += TAU * Math.round((free - al) / TAU); off = lerp(free, al, e1); }
      var yk = rg.y * (1 - .85 * e2), r = rg.r, ws = rg.words;
      for (var i = 0; i < ws.length; i++) {
        var wd = ws[i];
        if (!wd.s && e2 > .98) continue;
        var bc = off + TAU * (wd.x + wd.w / 2) / rg.total, dl = Math.PI * wd.w / rg.total;
        pj(pc, r * Math.sin(bc), yk, r * Math.cos(bc));
        var fac = clamp((pc[2] / R0 + .22) / 1.22, 0, 1);
        if (fac <= .01 && !wd.s) continue;
        var lf = mob ? 1 : 1 - (1 - e1) * (1 - ease(clamp((pc[0] - hx - 10) / 170, 0, 1)));
        var alpha = wd.s ? lerp((.07 + rg.base * .62 * Math.pow(fac, 1.3)) * lf, 1, e2) : (.07 + rg.base * .62 * Math.pow(fac, 1.3)) * (1 - e2) * lf;
        if (mob && !wd.s) alpha = Math.min(1, alpha * 1.45);
        if (alpha < .02) continue;
        pj(pa, r * Math.sin(bc - dl), yk, r * Math.cos(bc - dl)); pj(pb, r * Math.sin(bc + dl), yk, r * Math.cos(bc + dl));
        var a = (pb[0] - pa[0]) / wd.w, b = (pb[1] - pa[1]) / wd.w, c = 0, d = ct * pc[3] * kR, e = pc[0], f = pc[1];
        if (wd.s && e2 > 0) {
          var fa = wd.sc, fe = ox + wd.fx, ff = oy + wd.fy;
          a = lerp(a, fa, e2); b = lerp(b, 0, e2); c = lerp(c, 0, e2); d = lerp(d, fa, e2); e = lerp(e, fe, e2); f = lerp(f, ff, e2);
          if (t3_ > 0) { a *= sx; c *= sx; b *= sy; d *= sy; e = ox + (e - ox) * sx; f = oy + (f - oy) * sy; alpha *= 1 - clamp((1 - sy) * 1.6, 0, 1); }
        }
        if (Math.abs(a) < .03 && Math.abs(b) < .03) continue;
        ctx.setTransform(dpr * a, dpr * b, dpr * c, dpr * d, dpr * e, dpr * f);
        ctx.globalAlpha = alpha;
        ctx.fillText(wd.t, -wd.w / 2, 0);
      }
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (t3_ > 0) {
      var la = clamp((1 - sy) * 1.8, 0, 1), len = lineW * sx;
      if (sx > .02) { ctx.globalAlpha = la; ctx.fillStyle = '#f5f1eb'; ctx.fillRect(ox - len / 2, oy - 1, len, 2); }
      var rad = 3 + 3 * ease(clamp((t3_ - .5) / .5, 0, 1));
      ctx.globalAlpha = clamp((t3_ - .55) * 3, 0, 1); ctx.beginPath(); ctx.arc(ox, oy, rad, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  var heroH = -1;
  function heroState(h) {
    // copy fades as the mass collapses
    var t1 = clamp(h / .333, 0, 1);
    hcopy.style.opacity = (1 - clamp(t1 * 1.7, 0, 1)).toFixed(3);
    hcopy.style.transform = 'translate3d(0,' + (-ease(t1) * 5).toFixed(2) + 'vh,0)';
    if (hint) hint.style.opacity = clamp(1 - h * 6, 0, 1);
    // the iris
    var t4 = clamp((h - .633) / .367, 0, 1);
    s1.style.clipPath = t4 <= 0 ? 'circle(0px at 50% 50%)' : t4 >= 1 ? 'none' : 'circle(' + lerp(7, Math.hypot(innerWidth, innerHeight) / 2 + 6, ease(t4)).toFixed(1) + 'px at 50% 50%)';
    $('.in', s1).style.transform = t4 >= 1 ? '' : 'scale(' + lerp(1.08, 1, easeO(t4)).toFixed(4) + ')';
    if (!root.classList.contains('menu-open')) root.dataset.nav = t4 < .35 ? 'dark' : 'ink';
    return t4;
  }

  /* ---------------------------------------------------------------- the day: desktop engine */
  var T = scenes.map(function (s) { var m = /(\d+):(\d+)\s*(AM|PM)/.exec(s.dataset.time || ''); return m ? ((+m[1]) % 12 + (m[3] === 'PM' ? 12 : 0)) * 60 + (+m[2]) : 0; });
  var E = [0, .95, 2.1, 3.15, 4.2, 6.0, 7.05, 8.1, 9.1], WIPE = .6, IRIS = .55, END = 10.15;
  var hud = $('#hud'), hudEls = { h: $('.h', hud), m: $('.m', hud), ap: $('.ap', hud) }, lastTxt = '', lastTone = '';
  var n = scenes.length, vh = innerHeight;
  var qW = scenes.map(function (s, i) {
    var q = $('.q', s); if (!q || !pin || q.hasAttribute('data-keep')) return [];
    var words = q.textContent.trim().split(/\s+/); q.setAttribute('aria-label', q.textContent.trim());
    q.innerHTML = words.map(function (w) { return '<span class="w" aria-hidden="true">' + w + '</span>'; }).join(' ');
    return $$('.w', q);
  });
  var aK = scenes.map(function (s) { return $$('.a > *', s).filter(function (x) { return !x.classList.contains('chip'); }); });
  var rvs = scenes.map(function (s) { return $$('.rv', s).map(function (el) { return { el: el, at: +el.dataset.at, dur: +el.dataset.dur || .4 }; }); });
  var zs = scenes.map(function (s) { return $$('.z', s).map(function (el) { return { el: el, f: 1.05 }; }); });
  var ins = scenes.map(function (s) { return $('.in', s); });
  var shades = scenes.map(function (s, i) { if (!pin || i < 2) return null; var d = document.createElement('i'); d.className = 'shade'; s.appendChild(d); return d; });
  var REST = [];
  function layout() {
    vh = innerHeight;
    if (pin) {
      main.style.height = ((END + 1) * vh) + 'px';
      zs.forEach(function (list) {
        list.forEach(function (o) {
          var img = o.el, w = img.clientWidth, h = img.clientHeight, nw = img.naturalWidth || +img.getAttribute('width'), nh = img.naturalHeight || +img.getAttribute('height');
          var base = Math.max(w / nw, h / nh) || 1; o.f = Math.min(1.07, Math.max(1, 1.07 / base));
        });
      });
      REST = E.map(function (e, i) { return i === 0 ? 0 : i === 1 ? (e + IRIS + .38) * vh : i === 4 ? (e + 1.0) * vh : i === 8 ? (e + WIPE + .45) * vh : (e + WIPE + .38) * vh; });
    }
    buildHero();
    if (!anim) drawHero(0, 0);
  }
  var cur = 0, started = false, last = 0, tmr = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    var dt = Math.min(.05, (now - (last || now)) / 1000); last = now; tmr += dt;
    if (pin) {
      var target = Math.max(0, scrollY);
      if (!started) { cur = target; started = true; }
      cur += (target - cur) * .16; if (Math.abs(target - cur) < .4) cur = target;
      var yv = cur / vh, h = clamp(yv / 1.5, 0, 1);
      var o = [], e = [], k = 0, k5 = 0, i;
      for (i = 0; i < n; i++) {
        var oi = i === 0 ? 1 : clamp((yv - E[i]) / (i === 1 ? IRIS : WIPE), 0, 1);
        o.push(oi); e.push(i === 1 ? oi : ease(oi)); if (oi > 0) k = i; if (oi >= .5) k5 = i;
      }
      var t4 = heroState(h);
      if (h < .66 && yv < 1.8) drawHero(h, tmr); else if (heroH !== -2) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); }
      for (i = 0; i < n; i++) {
        var s = scenes[i], vis = i === 0 ? o[1] < 1 : (o[i] > 0 && !(i + 1 < n && o[i + 1] >= 1));
        s.style.visibility = vis ? 'visible' : 'hidden'; if (!vis) continue;
        if (i === 0) continue;
        var u = yv - E[i];
        if (i >= 2) {
          var t = e[i], rr = (1 - t);
          s.style.clipPath = o[i] >= 1 ? 'none' : 'inset(' + (rr * 100).toFixed(2) + '% 0 0 0 round ' + (14 * rr).toFixed(1) + 'px ' + (14 * rr).toFixed(1) + 'px 0 0)';
          var nx = i + 1 < n ? e[i + 1] : 0;
          ins[i].style.transform = 'translate3d(0,' + (rr * 7 - nx * 4).toFixed(2) + 'vh,0)';
          if (shades[i]) shades[i].style.opacity = (nx * .4).toFixed(3);
        }
        var co = i < n - 1 ? 1 - clamp(e[i + 1] * 2.2, 0, 1) : 1;
        var gi = $('.giant', s); if (gi) gi.style.opacity = co;
        var zl = zs[i], push = clamp(u / 1.5, 0, 1);
        for (var z = 0; z < zl.length; z++) zl[z].el.style.transform = 'scale(' + (1 + (zl[z].f - 1) * push).toFixed(4) + ')';
        var qw = qW[i];
        for (var w = 0; w < qw.length; w++) {
          var p = clamp((u - .28 - w * .015) / .12, 0, 1);
          qw[w].style.opacity = (p * co).toFixed(3); qw[w].style.transform = 'translate3d(0,' + ((1 - p) * 12).toFixed(1) + 'px,0)';
        }
        var ak = aK[i];
        for (var a = 0; a < ak.length; a++) {
          var pa_ = clamp((u - (.58 + a * .07)) / .16, 0, 1);
          ak[a].style.opacity = (pa_ * co).toFixed(3); ak[a].style.transform = 'translate3d(0,' + ((1 - pa_) * 14).toFixed(1) + 'px,0)';
        }
        var rl = rvs[i];
        for (var q = 0; q < rl.length; q++) {
          var pr = clamp((u - rl[q].at) / rl[q].dur, 0, 1), el = rl[q].el;
          el.style.opacity = (pr * co).toFixed(3);
          el.style.transform = el.classList.contains('proof') ? 'translate3d(0,' + ((1 - easeO(pr)) * 26).toFixed(1) + 'px,0)' : 'translate3d(0,' + ((1 - pr) * 14).toFixed(1) + 'px,0)';
          el.style.pointerEvents = pr > .6 && co > .9 ? '' : 'none';
        }
        if (i === 4) proofTick(o[4] >= 1 && u > .9 && o[5] === 0, now);
      }
      // the clock: the question becomes 7:40 AM, then the day ticks forward
      var mins = k >= 2 && o[k] < 1 ? lerp(T[k - 1], T[k], e[k]) : T[Math.max(k, 1)];
      var mm_ = Math.round(mins), hh = Math.floor(mm_ / 60) % 24, mi = mm_ % 60, ap = hh >= 12 ? 'PM' : 'AM';
      hh = hh % 12 || 12;
      var txt = hh + ':' + (mi < 10 ? '0' : '') + mi + ap;
      if (txt !== lastTxt) { hudEls.h.textContent = hh; hudEls.m.textContent = (mi < 10 ? '0' : '') + mi; hudEls.ap.textContent = ap; lastTxt = txt; }
      var tone = scenes[Math.max(k5, 1)].dataset.hud || 'ink';
      if (tone !== lastTone) { hud.dataset.tone = tone; lastTone = tone; }
      hud.style.opacity = (clamp((t4 - .6) / .3, 0, 1) * clamp((END - yv) / .12, 0, 1) * (tone === 'off' ? 0 : 1)).toFixed(3);
      hud.classList.toggle('stopped', k === n - 1 && o[k] >= 1);
    } else if (anim && mob) {
      var rect = open.getBoundingClientRect(), hm = clamp(-rect.top / (1.5 * innerHeight), 0, 1);
      var t4m = heroState(hm);
      if (rect.bottom > 0 && hm < .66) drawHero(hm, tmr);
      else if (heroH !== hm) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); }
      heroH = hm;
      nav.classList.toggle('day-on', hm > .72);
      s1.classList.toggle('on', hm >= .98 || rect.bottom < innerHeight * .9);
    }
    if (mob) mobTick(now);
  }

  /* ---------------------------------------------------------------- phone: progress, snap targets, reveals */
  var strBtns = $$('button', strip), bar = $('.bar', strip), curIdx = -1;
  function sceneTop(i) {
    if (i === 0 && anim) return open.getBoundingClientRect().top + scrollY + 1.55 * innerHeight;
    return scenes[i + 1].getBoundingClientRect().top + scrollY;
  }
  function mobTick(now) {
    var idx = -1, mid = innerHeight * .5;
    for (var i = 1; i < n; i++) {
      var r = scenes[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) idx = i - 1;
    }
    if (idx !== curIdx) {
      curIdx = idx;
      strBtns.forEach(function (b, j) { b.classList.toggle('on', j === idx); });
      if (bar) bar.style.transform = 'scaleX(' + ((idx + 1) / 8).toFixed(3) + ')';
    }
    if (idx === 3 && scenes[4].classList.contains('on')) proofTick(true, now); else proofTick(false, now);
  }
  if (mob) {
    strip.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; scrollTo({ top: sceneTop(+b.dataset.i), behavior: 'smooth' }); });
    if (!anim) { nav.classList.add('day-on'); root.dataset.nav = 'ink'; scenes.forEach(function (s) { s.classList.add('on'); }); requestAnimationFrame(mobTick); addEventListener('scroll', function () { mobTick(performance.now()); }, { passive: true }); }
    else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) en.target.classList.add('on'); }); }, { threshold: .5 });
      scenes.forEach(function (s, i) { if (i > 1) io.observe(s); });
    } else scenes.forEach(function (s) { s.classList.add('on'); });
  }

  /* ---------------------------------------------------------------- join */
  var jf = $('#jf');
  jf.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = new FormData(jf), em = (f.get('email') || '').trim(), org = (f.get('org') || '').trim(), q = (f.get('q') || '').trim();
    if (!/^\S+@\S+\.\S+$/.test(em) || !org || !q) { $('#jerr').hidden = false; return; }
    $('#jerr').hidden = true; $('#jq').textContent = q; $('#je').textContent = em;
    jf.hidden = true; var d = $('#jdone'); d.hidden = false; d.focus({ preventScroll: true });
  });
  $$('a[href="#join"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); scrollTo({ top: $('#join').getBoundingClientRect().top + scrollY, behavior: 'smooth' }); }); });

  /* ---------------------------------------------------------------- presenting: left and right keys */
  function targets() {
    if (pin) return REST.concat([$('#join').getBoundingClientRect().top + scrollY]);
    return [0].concat(scenes.slice(1).map(function (s, i) { return sceneTop(i); }), [$('#join').getBoundingClientRect().top + scrollY]);
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var t = e.target; if (t && (t.closest('input,textarea,select,[contenteditable]') || t.closest('.nav') || t.closest('.mmenu') || t.closest('.sheet'))) return;
    var tg = targets(), y = scrollY, best = 0;
    tg.forEach(function (v, i) { if (Math.abs(v - y) < Math.abs(tg[best] - y)) best = i; });
    var next = clamp(best + (e.key === 'ArrowRight' ? 1 : -1), 0, tg.length - 1);
    if (Math.abs(tg[best] - y) > innerHeight * .3 && ((e.key === 'ArrowRight') === (tg[best] > y))) next = best;
    e.preventDefault(); scrollTo({ top: tg[next], behavior: 'smooth' });
  });

  /* ---------------------------------------------------------------- start */
  addEventListener('resize', layout);
  var fontsOK = document.fonts && document.fonts.load ? document.fonts.load('500 14px Switzer').then(function () { return document.fonts.ready; }) : Promise.resolve();
  layout();
  fontsOK.then(layout);
  $$('img').forEach(function (im) { if (!im.complete) im.addEventListener('load', layout); });
  if (anim) { root.classList.add('ready'); requestAnimationFrame(frame); }
  if (!anim) {
    $('.hint').style.display = 'none';
    var navTone = function () { root.dataset.nav = scrollY < innerHeight * .85 ? 'dark' : 'ink'; };
    navTone(); addEventListener('scroll', navTone, { passive: true });
  }
})();
