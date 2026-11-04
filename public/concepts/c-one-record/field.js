/* LOVELEEDAY: one living field of records. Canvas 2D, typed arrays, no libraries. */
(function () {
'use strict';
var Q = new URLSearchParams(location.search);
var REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
var STATIC = Q.get('static') === '1' || REDUCE;
var docEl = document.documentElement;
docEl.classList.add(STATIC ? 'static' : 'live');

function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
function lerp(a, b, t) { return a + (b - a) * t; }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function gauss(r) { var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2831853 * v); }

/* ---------- records ---------- */
var PHONE = Math.min(innerWidth, screen.width || 9999) < 700;
var N = PHONE ? 1800 : 6000;
var SYS = ['Ledger', 'Mailbox', 'Contracts', 'Work orders', 'Orders'];
var VOC = { 3: ['Orders', 'Inspections', 'Suppliers', 'Work orders', 'Shipments'], 4: ['Roster', 'Forms', 'Attendance', 'Billing', 'Parent email'], 5: ['Permits', 'Inspections', 'Parcels', 'Calendar', 'Resident email'], 6: ['Donors', 'Grants', 'Gifts', 'Volunteers', 'Shared drive'] };
var NAMES = ['Harbor Equipment Services', 'Northline Studio', 'Cedar Ridge Supply', 'Alder & Finch', 'Meridian Print Co.', 'Larkspur Foods', 'Westbrook Electric', 'Ironwood Freight', 'Pelham Machine Works', 'Redfern Staffing', 'Kestrel Logistics', 'Maple Court Partners', 'Birchfield Academy', 'Tallgrass Cooperative', 'Copperleaf Studio', 'Halcyon Medical', 'Fairmont Tool and Die', 'Juniper Hill Realty', 'Quarry Street Supply', 'Lakeside Safety Co.', 'Marlow Textiles', 'Ninth Ward Printing', 'Oakline Property Trust', 'Brightwater Utilities', 'Granite Peak Paper', 'Sable Creek Farms', 'Orchard Lane Clinic', 'Stonebridge Builders', 'Vantage Point Labs', 'Willow Park Schools'];
var R0 = mulberry(20261103);
var sys = new Uint8Array(N), fam = new Uint16Array(N), tone = new Uint8Array(N), flag = new Uint8Array(N);
var dly = new Float32Array(N), wf = new Float32Array(N), ph = new Float32Array(N * 2), bw = new Float32Array(N), bh = new Float32Array(N);
var famStart = [], famSize = [], famName = [];
(function gen() {
  var i = 0, f = 0;
  while (i < N) {
    var size, members;
    if (f === 0) { size = 3; members = [0, 1, 2]; }
    else if (f === 1) { size = 3; members = [4, 2, 1]; }
    else if (f === 2) { size = 3; members = [0, 3, 4]; }
    else {
      var r = R0(); size = r < .36 ? 1 : r < .55 ? 2 : r < .8 ? 3 : r < .93 ? 4 : 5;
      var pool = [0, 1, 2, 3, 4]; members = [];
      for (var m = 0; m < size; m++) members.push(pool.splice(Math.floor(R0() * pool.length), 1)[0]);
    }
    size = Math.min(size, N - i);
    famStart.push(i); famSize.push(size);
    famName.push(f < NAMES.length ? NAMES[f] : NAMES[f % NAMES.length].split(' ')[0] + ' ' + ['Group', 'Partners', 'Supply', 'Works', 'Trust'][f % 5]);
    for (var k = 0; k < size; k++, i++) fam[i] = f, sys[i] = members[k];
    f++;
  }
  var KW = [3.2, 1.3, 2.3, 2.9, 1.9], KH = [1.3, 3.2, 2.3, 1.5, 1.9];
  for (var j = 0; j < N; j++) {
    var q = R0(); tone[j] = q < .4 ? 0 : q < .8 ? 1 : 2;
    dly[j] = R0(); wf[j] = R0(); ph[j * 2] = R0() * 6.283; ph[j * 2 + 1] = R0() * 6.283;
    bw[j] = KW[sys[j]]; bh[j] = KH[sys[j]];
    flag[j] = (j % 25 === 7) ? 1 : 0;
  }
})();
function initials(n) { var w = n.replace(/[&.]/g, '').split(' ').filter(Boolean); return w.length > 1 ? w.map(function (x) { return x[0]; }).join('').toUpperCase() : w[0]; }
function alias(s, f) {
  var nm = famName[f], fw = nm.split(' ')[0];
  switch (s) {
    case 0: return 'Vendor ' + (f === 0 ? 44127 : 30000 + (f * 7919) % 60000);
    case 1: return f === 0 ? 'HES' : f === 1 ? 'Northline' : initials(nm);
    case 2: return nm;
    case 3: return 'WO-' + (2000 + (f * 131) % 7000) + ' ' + fw;
    default: return 'PO ' + (10000 + (f * 977) % 80000) + ' ' + fw;
  }
}
function label(i, v) {
  if (v && VOC[v]) return VOC[v][sys[i]] + ' ' + (1000 + (i * 7919) % 9000);
  return alias(sys[i], fam[i]);
}

/* ---------- scenes ---------- */
var AK = ['view', 'view', 'rule', 'struct0', 'struct1', 'struct2', 'struct3', 'trfield', 'trfield', 'trfield', 'trfield', 'trfield', 'view', 'view'];
var NS = 14, SX = [], SY = [];
var P = [
  { jit: .7, a: 1, sz: 1.25, rec: 0, lbl: 1 },
  { jit: .1, a: .95, sz: 1, rec: 1, lbl: 0 },
  { jit: 0, a: 1, sz: .5, rec: 2, lbl: 0 },
  { jit: .2, a: 1, sz: 1, rec: 1, lbl: 1, tap: 1, v: 3 }, { jit: .2, a: 1, sz: 1, rec: 1, lbl: 1, tap: 1, v: 4 },
  { jit: .2, a: 1, sz: 1, rec: 1, lbl: 1, tap: 1, v: 5 }, { jit: .2, a: 1, sz: 1, rec: 1, lbl: 1, tap: 1, v: 6 },
  { jit: .25, a: 1, sz: 1, rec: 3, lbl: 0 }, { jit: .05, a: 1, sz: .9, rec: 4, lbl: 0 }, { jit: .1, a: 1, sz: .9, rec: 4, lbl: 0 },
  { jit: .03, a: 1, sz: .9, rec: 4, lbl: 0 }, { jit: .15, a: 1, sz: .9, rec: 4, lbl: 0 },
  { jit: .7, a: 1, sz: 1.3, rec: 5, lbl: 0, dim: [1, .5, .5, .5, .5] },
  { jit: 1, a: 1, sz: 1, rec: 4, lbl: 0 }
];
function dimsOf(p) { return p.dim || [1, 1, 1, 1, 1]; }

function rectDims(key) {
  var el = $('[data-anchor="' + key + '"]') || $('[data-sa="' + key + '"]');
  if (key === 'view' || !el) return { w: innerWidth, h: innerHeight };
  var r = el.getBoundingClientRect();
  if (r.width < 10) return { w: innerWidth * .55, h: innerHeight * .5 };
  return { w: r.width, h: r.height };
}
var DRIFT_C = [[.52, .22], [.85, .22], [.78, .90], [.44, .90], [.20, .22]], DRIFT_S = [[.06, .045], [.06, .045], [.06, .04], [.06, .04], [.055, .045]];
if (PHONE) { DRIFT_C = [[.5, .15], [.84, .15], [.62, .92], [.28, .92], [.16, .15]]; DRIFT_S = [[.07, .02], [.07, .02], [.06, .03], [.06, .03], [.07, .02]]; }
var SC = [0, 0, 0, 0, 0]; for (var q0 = 0; q0 < N; q0++) SC[sys[q0]]++;

function buildAll() {
  for (var s = 0; s < 16; s++) { SX[s] = new Float32Array(N); SY[s] = new Float32Array(N); }
  var r = mulberry(11), i, d;
  // 0 drift
  for (i = 0; i < N; i++) {
    if (r() < .03) { SX[0][i] = r(); SY[0][i] = r(); }
    else { var c = DRIFT_C[sys[i]], g = DRIFT_S[sys[i]]; SX[0][i] = c[0] + gauss(r) * g[0]; SY[0][i] = c[1] + gauss(r) * g[1]; }
  }
  // 1 rows
  var cnt = [0, 0, 0, 0, 0], idx = [0, 0, 0, 0, 0], RP = 7, step = .74 / (5 * RP + 3);
  for (i = 0; i < N; i++) cnt[sys[i]]++;
  for (i = 0; i < N; i++) {
    var s2 = sys[i], j = idx[s2]++, per = Math.ceil(cnt[s2] / RP), row = Math.floor(j / per), col = j % per;
    SX[1][i] = .05 + .9 * (col + .5) / per; SY[1][i] = .13 + (s2 * (RP + 1) + row) * step;
  }
  // 2 line
  for (i = 0; i < N; i++) { SX[2][i] = i / (N - 1); SY[2][i] = .5; }
  // 3 lanes
  d = rectDims('struct0'); var asp = d.w / d.h, W = d.w, H = d.h;
  var L = 8, per3 = N / L, K = 9;
  for (i = 0; i < N; i++) {
    var l = Math.floor(i / per3), u = (i - l * per3 + .5) / per3, wp = u - .8 * Math.sin(6.2831853 * K * u) / (6.2831853 * K);
    SX[3][i] = .02 + .96 * wp; SY[3][i] = .07 + .86 * (l + .5) / L + gauss(r) * .004 * (1 + (Math.cos(6.2831853 * K * u) + 1) * .9);
  }
  // 4 school blocks
  d = rectDims('struct1'); asp = d.w / d.h;
  var cols = 6, rows = 3, B = cols * rows, per4 = N / B, bwd = .15, bhd = .27;
  var Lx = Math.ceil(Math.sqrt(per4 * bwd * asp / bhd)), Ly = Math.ceil(per4 / Lx);
  for (i = 0; i < N; i++) {
    var b = Math.floor(i / per4), jj = i - b * per4, bc = b % cols, br = Math.floor(b / cols), cx0 = jj % Lx, cy0 = Math.floor(jj / Lx);
    SX[4][i] = .02 + bc * (.96 - bwd) / (cols - 1) + (cx0 + .5) / Lx * bwd; SY[4][i] = .03 + br * (.97 - bhd - .03) / (rows - 1) + (cy0 + .5) / Ly * bhd;
  }
  // 5 facade
  var F = 12, U = 9, per5 = N / (F * U), uw = .6 / U, uh = .96 / F;
  var Lx5 = Math.ceil(Math.sqrt(per5 * (uw * .7 * asp) / (uh * .62))), Ly5 = Math.ceil(per5 / Lx5);
  for (i = 0; i < N; i++) {
    var un = Math.floor(i / per5), j5 = i - un * per5, ux = un % U, uy = Math.floor(un / U), a5 = j5 % Lx5, b5 = Math.floor(j5 / Lx5);
    SX[5][i] = .03 + ux * uw + .15 * uw + (a5 + .5) / Lx5 * uw * .7; SY[5][i] = .02 + uy * uh + .19 * uh + (b5 + .5) / Ly5 * uh * .62;
  }
  // 6 parcel map
  d = rectDims('struct2'); asp = d.w / d.h;
  var rs = mulberry(66), rects = [[.012, .02, .976, .96]];
  for (var lv = 0; lv < 5; lv++) {
    var nx2 = [];
    rects.forEach(function (rc) {
      var t = .36 + .28 * rs();
      if (rc[2] * asp > rc[3]) nx2.push([rc[0], rc[1], rc[2] * t, rc[3]], [rc[0] + rc[2] * t, rc[1], rc[2] * (1 - t), rc[3]]);
      else nx2.push([rc[0], rc[1], rc[2], rc[3] * t], [rc[0], rc[1] + rc[3] * t, rc[2], rc[3] * (1 - t)]);
    });
    rects = nx2;
  }
  var tot = 0, pr = rects.map(function (rc) { var w0 = rc[2] - .008, h0 = rc[3] - .02; var p = 2 * (w0 * asp + h0); tot += p; return p; }), acc = 0, pi = 0, ps = 0;
  for (i = 0; i < N; i++) {
    while (pi < rects.length - 1 && i >= (acc + pr[pi]) / tot * N) { acc += pr[pi]; pi++; }
    var rc = rects[pi], x0 = rc[0] + .004, y0 = rc[1] + .01, w0 = rc[2] - .008, h0 = rc[3] - .02, lw = w0 * asp, lh = h0, tt = 2 * (lw + lh);
    var lo = acc / tot * N, hi = (acc + pr[pi]) / tot * N, s6 = (i - lo + .5) / Math.max(1, hi - lo), dd = s6 * tt, x6, y6;
    if (dd < lw) { x6 = x0 + dd / lw * w0; y6 = y0; } else if (dd < lw + lh) { x6 = x0 + w0; y6 = y0 + (dd - lw) / lh * h0; }
    else if (dd < 2 * lw + lh) { x6 = x0 + w0 - (dd - lw - lh) / lw * w0; y6 = y0 + h0; } else { x6 = x0; y6 = y0 + h0 - (dd - 2 * lw - lh) / lh * h0; }
    SX[6][i] = x6; SY[6][i] = y6;
  }
  // 7 flows
  var rb = [], rr = mulberry(77), tw = 0, a, bb, c2;
  function ly(n, k) { return .05 + .9 * (k + .5) / n; }
  for (a = 0; a < 7; a++) for (bb = 0; bb < 2; bb++) rb.push({ x0: .03, y0: ly(7, a), x1: .5, y1: ly(4, (a + bb * 2) % 4), w: .5 + rr() });
  for (bb = 0; bb < 4; bb++) for (c2 = 0; c2 < 3; c2++) rb.push({ x0: .5, y0: ly(4, bb), x1: .97, y1: ly(5, (bb + c2 * 2) % 5), w: .5 + rr() });
  rb.forEach(function (q) { tw += q.w; });
  var ri = 0, racc = 0;
  for (i = 0; i < N; i++) {
    while (ri < rb.length - 1 && i >= (racc + rb[ri].w) / tw * N) { racc += rb[ri].w; ri++; }
    var q = rb[ri], lo7 = racc / tw * N, n7 = q.w / tw * N, jj7 = i - lo7, lanes = Math.ceil(3 + q.w * 3), tq = (Math.floor(jj7 / lanes) + .5) / Math.ceil(n7 / lanes), ln = (jj7 % lanes) / (lanes - 1) - .5;
    SX[7][i] = q.x0 + (q.x1 - q.x0) * tq; SY[7][i] = q.y0 + (q.y1 - q.y0) * sm(tq) + ln * .016 * q.w;
  }
  // 8 bars
  var NB = 44, hb = [], ht = 0, rg = mulberry(88);
  for (a = 0; a < NB; a++) { var hv = clamp(.2 + .8 * (.5 + .3 * Math.sin(a * .55 + 1) + .35 * (rg() - .5)), .12, 1); hb.push(hv); ht += hv; }
  var bi = 0, bacc = 0;
  for (i = 0; i < N; i++) {
    while (bi < NB - 1 && i >= (bacc + hb[bi]) / ht * N) { bacc += hb[bi]; bi++; }
    var nb = hb[bi] / ht * N, jb = i - bacc / ht * N, col8 = jb % 3, row8 = Math.floor(jb / 3), rows8 = Math.ceil(nb / 3);
    SX[8][i] = .03 + bi * .0215 + (col8 + .5) / 3 * .0165; SY[8][i] = 1 - (row8 + .5) / rows8 * hb[bi] * .98;
  }
  // trust
  d = rectDims('trfield'); W = d.w; H = d.h;
  var rt = mulberry(99);
  for (i = 0; i < N; i++) {                                   // 9 names: clumps and strays
    if (i % 10 >= 7) { SX[9][i] = rt(); SY[9][i] = rt(); continue; }
    var e = Math.floor(i / 90);
    SX[9][i] = .07 + .86 * ((.5 + e * .7548776662) % 1) + gauss(rt) * .016 * 1.5 / (W / H);
    SY[9][i] = .07 + .86 * ((.5 + e * .5698402909) % 1) + gauss(rt) * .016 * 1.5;
  }
  var ci = [0, 0, 0, 0, 0];
  for (i = 0; i < N; i++) {                                   // 10 sources: five columns
    var sc = sys[i], jc = ci[sc]++, nrow = Math.ceil(cnt[sc] / 8);
    SX[10][i] = (sc + .5) / 5 + ((jc % 8) - 3.5) * 5 / W; SY[10][i] = .13 + .85 * Math.floor(jc / 8) / nrow;
  }
  for (i = 0; i < N; i++) {                                   // 11 history
    SX[11][i] = .08 + .84 * ((i * 0.6180339887) % 1); SY[11][i] = .08 + .84 * ((sys[i] + .5) / 5) + gauss(rt) * .022;
  }
  var gc = Math.ceil(Math.sqrt(N * W / H)), gr = Math.ceil(N / gc);
  for (i = 0; i < N; i++) { SX[12][i] = .02 + .96 * ((i % gc) + .5) / gc; SY[12][i] = .04 + .92 * (Math.floor(i / gc) + .5) / gr; }
  var Rm = Math.min(W, H) * .47;
  for (i = 0; i < N; i++) { var ang = i * 2.399963, rad = Math.sqrt((i + .5) / N) * Rm; SX[13][i] = .5 + rad * Math.cos(ang) / W; SY[13][i] = .5 + rad * Math.sin(ang) / H; }
  // 14 one: Ledger tidy on the right, the rest drift dimmed
  var n0 = cnt[0], c0 = 0, lx = Math.ceil(Math.sqrt(n0 * (.36 * innerWidth) / (.27 * innerHeight)));
  for (i = 0; i < N; i++) {
    if (sys[i] === 0) { var j0 = c0++; SX[14][i] = .06 + .36 * ((j0 % lx) + .5) / lx; SY[14][i] = .67 + .27 * (Math.floor(j0 / lx) + .5) / Math.ceil(n0 / lx); }
    else { SX[14][i] = SX[0][i]; SY[14][i] = SY[0][i]; }
  }
  var ra = mulberry(5);
  for (i = 0; i < N; i++) { SX[15][i] = SX[0][i] + .12 + .12 * ra(); SY[15][i] = SY[0][i] - .55 - .6 * ra(); }
  var map = [0, 1, 2, 3, 4, 6, 7, 9, 10, 11, 12, 13, 14, 15], ox = SX.slice(), oy = SY.slice();
  SX = map.map(function (m) { return ox[m]; }); SY = map.map(function (m) { return oy[m]; });
}

/* ---------- state ---------- */
var cx = new Float32Array(N), cy = new Float32Array(N), px = new Float32Array(N), py = new Float32Array(N);
var rec = new Float32Array(N), al = new Float32Array(N), cat = new Uint8Array(N);
var cvs = $('#field'), ctx = cvs.getContext('2d');
var DPR = Math.min(window.devicePixelRatio || 1, 2), VW = innerWidth, VH = innerHeight;
var ptr = { x: -999, y: -999, sx: -999, sy: -999, on: false, t: 0 };
var hotFam = -1, hotT = 0, cycle = 0, sigHide = false, fieldAlpha = 1, introT = 0;
var TONE = [.62, .84, 1];
var started = false;

function rectFor(key, rootEl, W, H, cr) {
  if (key === 'view') return { x: 0, y: 0, w: W, h: H };
  var el = rootEl.querySelector('[data-anchor="' + key + '"]');
  if (!el) return { x: 0, y: 0, w: W, h: H };
  var r = el.getBoundingClientRect();
  return { x: r.left - cr.left, y: r.top - cr.top, w: r.width, h: r.height, dir: el.dataset.dir || 'r' };
}

/* hero glyph mask */
var heroM = null;
function buildHeroMask() {
  var hero = $('.hero'), h1 = $('#h1'); if (!hero || !h1) { heroM = null; return; }
  var hr = hero.getBoundingClientRect(), S = 4, hw = Math.ceil(hr.width / S), hh = Math.ceil(hr.height / S);
  var c = document.createElement('canvas'); c.width = hw; c.height = hh; var g = c.getContext('2d');
  var cs = getComputedStyle(h1), fs = parseFloat(cs.fontSize);
  g.filter = 'blur(2.6px)'; g.fillStyle = '#000'; g.textBaseline = 'middle';
  g.font = cs.fontWeight + ' ' + (fs / S) + 'px Switzer, system-ui, sans-serif';
  if ('letterSpacing' in g) g.letterSpacing = (parseFloat(cs.letterSpacing) / S || 0) + 'px';
  $$('.ln', h1).forEach(function (ln) {
    var r = ln.getBoundingClientRect();
    g.fillText(ln.textContent, (r.left - hr.left) / S, (r.top - hr.top + r.height * .52) / S);
  });
  var d = g.getImageData(0, 0, hw, hh).data, a = new Uint8Array(hw * hh);
  for (var i = 0; i < a.length; i++) a[i] = d[i * 4 + 3];
  heroM = { a: a, w: hw, h: hh, S: S, hero: hero };
}
function masksFor(rootEl, cr, W, H) {
  var out = [];
  $$('[data-mask]', rootEl).forEach(function (el) {
    var k = el._k === undefined ? 1 : el._k; if (k < .03) return;
    var r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return;
    var x0 = r.left - cr.left, y0 = r.top - cr.top, x1 = x0 + r.width, y1 = y0 + r.height;
    if (x1 < -40 || y1 < -40 || x0 > W + 40 || y0 > H + 40) return;
    out.push([x0, y0, x1, y1, k]);
  });
  return out;
}

/* one frame of positions. S: {A,B,tm,root,W,H,cr,t,dt,direct,hero,fixedHot} */
var topK = [], KMAX = 12;
function compute(S) {
  var A = S.A, B = S.B, tm = S.tm, W = S.W, H = S.H, t = S.t, same = A === B;
  var rA = rectFor(AK[A], S.root, W, H, S.cr), rB = same ? rA : rectFor(AK[B], S.root, W, H, S.cr);
  var nxA = SX[A], nyA = SY[A], nxB = SX[B], nyB = SY[B], pa = P[A], pb = P[B];
  var jit = lerp(pa.jit, pb.jit, tm) * 10, alpha = lerp(pa.a, pb.a, tm), szm = lerp(pa.sz, pb.sz, tm), tap = lerp(pa.tap || 0, pb.tap || 0, tm);
  var da = dimsOf(pa), db = dimsOf(pb), kk = S.direct ? 1 : 1 - Math.exp(-S.dt * (S.intro ? 2.6 : 15)), rk = S.direct ? 1 : Math.min(1, S.dt * 7);
  var photo = null;
  if (tap > .01) {
    var phA = A >= 3 && A <= 6 ? rectFor('photo' + (A - 3), S.root, W, H, S.cr) : null, phB = B >= 3 && B <= 6 && !same ? rectFor('photo' + (B - 3), S.root, W, H, S.cr) : null;
    photo = phA && phB ? { x: lerp(phA.x, phB.x, tm), y: lerp(phA.y, phB.y, tm), w: lerp(phA.w, phB.w, tm), h: lerp(phA.h, phB.h, tm), dir: tm > .5 ? phB.dir : phA.dir } : (phA || phB);
  }
  var ms = S.masks, hm = S.hero ? heroM : null, hr = null;
  if (hm) { var q = hm.hero.getBoundingClientRect(); hr = { x: q.left - S.cr.left, y: q.top - S.cr.top }; }
  var wTR = [0, 0, 0, 0, 0], k5;
  for (k5 = 0; k5 < 5; k5++) wTR[k5] = (A === 7 + k5 ? 1 - tm : 0) + (B === 7 + k5 && !same ? tm : 0);
  if (same) for (k5 = 0; k5 < 5; k5++) wTR[k5] = A === 7 + k5 ? 1 : 0;
  S.w1 = same ? (A === 12 ? 1 : 0) : (A === 12 ? 1 - tm : 0) + (B === 12 ? tm : 0);
  S.w0 = same ? (A === 0 ? 1 : 0) : (A === 0 ? 1 - tm : 0) + (B === 0 ? tm : 0);
  S.wTR = wTR;
  var hot = S.fixedHot !== undefined ? S.fixedHot : hotFam, vocab = (tm > .5 ? pb.v : pa.v) || 0;
  var ptrOn = S.ptr && ptr.on, pxx = ptr.sx, pyy = ptr.sy, R = 120, R2 = R * R, near = 1e9, nearI = -1;
  topK.length = 0;
  var rip = S.rip, rw = wTR[4], ma = pa.rec, mb = pb.rec, ptrLean = S.ptr ? 1 : 0;
  for (var i = 0; i < N; i++) {
    var dl = dly[i], s = same ? 1 : sm((tm - dl * .42) / .58);
    var ax = rA.x + nxA[i] * rA.w, ay = rA.y + nyA[i] * rA.h, x = ax, y = ay;
    if (!same) { x = ax + (rB.x + nxB[i] * rB.w - ax) * s; y = ay + (rB.y + nyB[i] * rB.h - ay) * s; }
    if (jit > .05) {
      var w1 = .25 + .2 * wf[i];
      x += Math.sin(t * w1 + ph[i * 2] + y * .006) * jit; y += Math.cos(t * (w1 * .85) + ph[i * 2 + 1] + x * .006) * jit;
    }
    if (hm && hr) {
      for (var it = 0; it < 2; it++) {
        var mx = (x - hr.x) / hm.S, my = (y - hr.y) / hm.S;
        if (mx > 1 && my > 1 && mx < hm.w - 2 && my < hm.h - 2) {
          var o = (my | 0) * hm.w + (mx | 0), v = hm.a[o];
          if (v > 8) {
            var gx = hm.a[o + 1] - hm.a[o - 1], gy = hm.a[o + hm.w] - hm.a[o - hm.w], gl = Math.sqrt(gx * gx + gy * gy) + 1e-3, pu = v / 255 * 38;
            if (gl < 2) { gx = 0; gy = -1; gl = 1; }
            x -= gx / gl * pu; y -= gy / gl * pu;
          }
        }
      }
    }
    if (ptrOn) {
      var dx = pxx - x, dy = pyy - y, d2 = dx * dx + dy * dy;
      if (d2 < R2) {
        var dd = Math.sqrt(d2) + .001, f = 1 - dd / R, mv = Math.min(dd, f * f * 24);
        x += dx / dd * mv; y += dy / dd * mv;
        if (d2 < near && (i > 2 || !S.sigHide)) { near = d2; nearI = i; }
        if (d2 < 105 * 105) {
          if (topK.length < KMAX || d2 < topK[topK.length - 1][1]) {
            var pos = topK.length; topK.push([i, d2]);
            while (pos > 0 && topK[pos - 1][1] > d2) { topK[pos] = topK[pos - 1]; pos--; }
            topK[pos] = [i, d2]; if (topK.length > KMAX) topK.pop();
          }
        }
      }
    }
    if (S.first) { cx[i] = x + (S.scatter ? (dl - .5) * W * .5 : 0); cy[i] = y + (S.scatter ? (wf[i] - .5) * H * .5 : 0); }
    else { cx[i] += (x - cx[i]) * kk; cy[i] += (y - cy[i]) * kk; }
    var X = cx[i], Y = cy[i]; px[i] = X; py[i] = Y;
    var vis = 1;
    if (ms) for (var m = 0; m < ms.length; m++) {
      var mm = ms[m], ddx = Math.max(mm[0] - X, 0, X - mm[2]), ddy = Math.max(mm[1] - Y, 0, Y - mm[3]);
      var dist = Math.sqrt(ddx * ddx + ddy * ddy);
      if (dist < 34) vis *= 1 - mm[4] * (1 - sm((dist - 4) / 30));
    }
    if (hm && hr) {
      var mx2 = (X - hr.x) / hm.S, my2 = (Y - hr.y) / hm.S;
      if (mx2 > 0 && my2 > 0 && mx2 < hm.w && my2 < hm.h) { var v2 = hm.a[(my2 | 0) * hm.w + (mx2 | 0)] / 255; if (v2 > .25) vis *= 1 - sm((v2 - .25) / .35); }
    }
    var sy2 = sys[i], dm = same ? da[sy2] : lerp(da[sy2], db[sy2], tm), a0 = TONE[tone[i]] * alpha * dm * vis * (S.fade === undefined ? 1 : S.fade);
    // recognition
    var tgt, ta = ma === 0 ? ((fam[i] === hot || (fam[i] < 10 && famSize[fam[i]] > 1)) ? 1 : 0) : ma === 1 ? (famSize[fam[i]] > 1 && fam[i] % 4 === 0 ? 1 : 0) : ma === 2 ? 1 : ma === 3 ? ((((i / 90) | 0) % 3 !== 0 && i % 10 < 7) ? 1 : 0) : ma === 5 ? (sys[i] === 0 ? 1 : 0) : 0;
    if (same) tgt = ta; else {
      var tb = mb === 0 ? ((fam[i] === hot || (fam[i] < 10 && famSize[fam[i]] > 1)) ? 1 : 0) : mb === 1 ? (famSize[fam[i]] > 1 && fam[i] % 4 === 0 ? 1 : 0) : mb === 2 ? 1 : mb === 3 ? ((((i / 90) | 0) % 3 !== 0 && i % 10 < 7) ? 1 : 0) : mb === 5 ? (sys[i] === 0 ? 1 : 0) : 0;
      tgt = lerp(ta, tb, tm);
    }
    if (rw > .3 && rip) {
      for (var rq = 0; rq < rip.length; rq++) { var rdx = X - rip[rq].x, rdy = Y - rip[rq].y, rd = Math.abs(Math.sqrt(rdx * rdx + rdy * rdy) - rip[rq].r); if (rd < 14) tgt = Math.max(tgt, (1 - rd / 14) * rip[rq].a * rw); }
    }
    rec[i] += (tgt - rec[i]) * rk;
    var c = rec[i] > .5 ? 1 : 0, a1 = a0;
    if (photo && tap > .01 && X > photo.x && X < photo.x + photo.w && Y > photo.y && Y < photo.y + photo.h) {
      var dp = photo.dir === 'l' ? 1 - (X - photo.x) / photo.w : photo.dir === 't' ? (photo.y + photo.h - Y) / photo.h : (X - photo.x) / photo.w;
      c = 2; a1 = a0 * tap * Math.pow(Math.max(0, 1 - dp * .92), 1.25) * 1.15;
    }
    if (S.sigHide && i < 3) a1 = 0;
    if (wTR[3] > .3 && flag[i]) a1 = 0;
    al[i] = a1; cat[i] = a1 < .035 ? 255 : c;
  }
  S.szm = szm; S.nearI = nearI; S.near = near;
  S.lblW = lerp(pa.lbl, pb.lbl, tm); S.vocab = vocab;
}

function drawMarks(g, S) {
  var cols = ['#1d1d1f', '#0066cc', '#ffffff'], szm = S.szm, dpr = S.dpr, i;
  for (var c = 0; c < 3; c++) {
    g.fillStyle = cols[c];
    for (i = 0; i < N; i++) {
      if (cat[i] !== c) continue;
      var r = rec[i], k = szm * (1 + r * .3), w = bw[i] * k, h = bh[i] * k;
      g.globalAlpha = al[i];
      g.fillRect(Math.round((px[i] - w / 2) * dpr) / dpr, Math.round((py[i] - h / 2) * dpr) / dpr, w, h);
    }
  }
  g.globalAlpha = 1;
}
function drawExtras(g, S) {
  var wT = S.wTR, W = S.W, H = S.H, t = S.t, i, fs = '500 10.5px Switzer, system-ui, sans-serif';
  g.font = fs;
  var rT = rectFor('trfield', S.root, W, H, S.cr);
  if (S.w1 > .05) {                        // one system connected, read-only
    g.globalAlpha = S.w1 * (S.fade === undefined ? 1 : S.fade); g.textAlign = 'left';
    g.fillStyle = '#0066cc'; g.font = '600 11px Switzer, system-ui, sans-serif'; g.fillText('LEDGER, CONNECTED READ-ONLY', .06 * W, .67 * H - 16);
    g.fillStyle = '#62656c'; g.font = '500 11px Switzer, system-ui, sans-serif'; g.fillText('The other systems wait their turn.', .06 * W, .67 * H - 2);
    g.globalAlpha = 1;
  }
  if (S.w0 > .05) {                        // the systems, named: each cluster is one place records live
    var fa = S.w0 * (S.fade === undefined ? 1 : S.fade);
    g.textAlign = 'center'; g.strokeStyle = '#1d1d1f'; g.lineWidth = 1;
    for (i = 0; i < 5; i++) {
      var lx = DRIFT_C[i][0] * W, ly = (DRIFT_C[i][1] - DRIFT_S[i][1] * 2.7) * H, hit = false;
      if (S.masks) S.masks.forEach(function (m) { if (lx > m[0] - 36 && lx < m[2] + 36 && ly > m[1] - 22 && ly < m[3] + 12) hit = true; });
      if (hit) continue;
      g.globalAlpha = fa * .5; g.beginPath(); g.moveTo(lx - 24, ly - 15); g.lineTo(lx + 24, ly - 15); g.stroke();
      g.globalAlpha = fa; g.fillStyle = '#1d1d1f'; g.font = '600 10.5px Switzer, system-ui, sans-serif';
      g.fillText(SYS[i].toUpperCase().split('').join(String.fromCharCode(8202)), lx, ly);
      g.fillStyle = '#62656c'; g.font = '500 10.5px Switzer, system-ui, sans-serif';
      g.fillText(SC[i].toLocaleString('en-US') + ' records', lx, ly + 13);
    }
    g.textAlign = 'left'; g.globalAlpha = 1; g.font = fs;
  }
  if (wT[1] > .05) {                       // source columns and one traced mark
    g.globalAlpha = wT[1]; g.fillStyle = '#62656c'; g.textAlign = 'center';
    var nar = rT.w < 500; if (nar) g.font = '500 8.5px Switzer, system-ui, sans-serif';
    for (i = 0; i < 5; i++) g.fillText(nar ? ['Ledger', 'Mail', 'Contracts', 'Work', 'Orders'][i].toUpperCase() : SYS[i].toUpperCase().split('').join(String.fromCharCode(8202)), rT.x + (i + .5) / 5 * rT.w, rT.y + .06 * rT.h);
    g.textAlign = 'left'; g.strokeStyle = '#0066cc'; g.lineWidth = 1; g.beginPath();
    for (i = 0; i < 3; i++) { var hx = (i + .5) / 5 * rT.w + rT.x; g.moveTo(px[i], py[i]); g.lineTo(px[i], rT.y + .09 * rT.h); }
    g.stroke(); g.fillStyle = '#0066cc'; g.globalAlpha = wT[1];
    for (i = 0; i < 3; i++) { g.beginPath(); g.arc(px[i], py[i], 3.2, 0, 6.283); g.fill(); }
    g.fillStyle = '#1d1d1f'; g.fillText('Vendor 44127 came from the Ledger', Math.min(px[0] + 10, rT.x + rT.w - 190), py[0] + 4);
    g.globalAlpha = 1;
  }
  if (wT[2] > .05) {                       // kept history: older copies stay behind
    g.fillStyle = '#1d1d1f';
    [[.07, .2], [.14, .1]].forEach(function (o) {
      g.globalAlpha = o[1] * wT[2];
      for (i = 0; i < N; i += 2) { if (cat[i] === 255) continue; g.fillRect(px[i] - o[0] * rT.w, py[i], 1.6, 1.4); }
    });
    g.globalAlpha = wT[2]; g.strokeStyle = '#e4e5e9'; g.beginPath(); g.moveTo(rT.x + .05 * rT.w, rT.y + .95 * rT.h); g.lineTo(rT.x + .95 * rT.w, rT.y + .95 * rT.h); g.stroke();
    g.fillStyle = '#62656c'; g.fillText('older', rT.x + .05 * rT.w, rT.y + .99 * rT.h + 2); g.textAlign = 'right'; g.fillText('now', rT.x + .95 * rT.w, rT.y + .99 * rT.h + 2); g.textAlign = 'left'; g.globalAlpha = 1;
  }
  if (wT[3] > .05) {                       // checks: a sweep settles the field, unsupported marks held out
    var sw = S.sweep !== undefined ? S.sweep : (t * .22) % 1, sx = rT.x + (.02 + .96 * sw) * rT.w;
    g.globalAlpha = wT[3]; g.strokeStyle = '#0066cc'; g.lineWidth = 1; g.beginPath(); g.moveTo(sx, rT.y); g.lineTo(sx, rT.y + rT.h); g.stroke();
    g.strokeStyle = '#1d1d1f';
    for (i = 0; i < N; i++) { if (!flag[i]) continue; var ox = px[i], oy = py[i] + (ox < sx ? 7 : 0); g.strokeRect(Math.round(ox) - 2.5, Math.round(oy) - 2.5, 5, 5); }
    g.fillStyle = '#62656c'; g.fillText('Held back: no record supports it', Math.min(sx + 10, rT.x + rT.w - 190), rT.y + 14);
    g.globalAlpha = 1;
  }
  if (wT[4] > .05 && S.rip) {              // changes: a ripple where something moved
    g.globalAlpha = wT[4]; g.lineWidth = 1;
    S.rip.forEach(function (r) { if (r.a < .02) return; g.strokeStyle = 'rgba(0,102,204,' + (r.a * .9).toFixed(3) + ')'; g.beginPath(); g.arc(r.x, r.y, r.r, 0, 6.283); g.stroke(); });
    var r0 = S.rip[0]; g.globalAlpha = sm((wT[4] - .6) / .4); g.fillStyle = '#1d1d1f'; g.fillText('Invoice now overdue. Support ticket open.', Math.min(r0.x + 10, rT.x + rT.w - 220), r0.y - 8);
    g.globalAlpha = 1;
  }
}
function drawLabels(g, S) {
  if (S.lblW < .3) return;
  var placed = [], list = [], i;
  if (S.hotLabels !== undefined ? S.hotLabels >= 0 : hotFam >= 0) {
    var hf = S.hotLabels !== undefined ? S.hotLabels : hotFam;
    if (famSize[hf] > 1) for (i = famStart[hf]; i < famStart[hf] + famSize[hf]; i++) list.push(i);
  }
  topK.forEach(function (k) { if (list.indexOf(k[0]) < 0) list.push(k[0]); });
  g.font = '500 10.5px Switzer, system-ui, sans-serif'; g.textAlign = 'left'; g.lineWidth = 3; g.lineJoin = 'round';
  list.forEach(function (i) {
    if (cat[i] === 255 || cat[i] === 2) return;
    var tx = px[i] + 8, ty = py[i] - 7;
    for (var k = 0; k < placed.length; k++) if (Math.abs(placed[k][0] - tx) < 70 && Math.abs(placed[k][1] - ty) < 13) return;
    placed.push([tx, ty]);
    var txt = label(i, S.vocab);
    if (tx + 120 > S.W) tx = px[i] - 8 - g.measureText(txt).width;
    g.globalAlpha = S.lblW; g.strokeStyle = 'rgba(255,255,255,.92)'; g.strokeText(txt, tx, ty);
    g.fillStyle = cat[i] === 1 ? '#0066cc' : '#1d1d1f'; g.fillText(txt, tx, ty);
  });
  g.globalAlpha = 1;
}

/* ---------- timeline ---------- */
var el = {};
function pageTop(e) { return e.getBoundingClientRect().top + scrollY; }
function timeline(y) {
  var vh = VH, S0 = pageTop(el.sig), Rs = el.sig.offsetHeight - vh, I0 = pageTop(el.ind), Ri = el.ind.offsetHeight - vh,
    T0 = pageTop(el.trust), Rt = el.trust.offsetHeight - vh, H0 = pageTop(el.how), C0 = pageTop(el.close);
  var seg = [[S0 + .28 * Rs, S0 + .62 * Rs, 0, 1], [S0 + .62 * Rs, S0 + .8 * Rs, 1, 2], [S0 + Rs, I0, 2, 3]], k;
  for (k = 0; k < 3; k++) seg.push([I0 + ((k + .45 + .5) / 4) * Ri, I0 + ((k + .95 + .5) / 4) * Ri, 3 + k, 4 + k]);
  seg.push([I0 + Ri + .1 * vh, T0 - .3 * vh, 6, 7]);
  for (k = 0; k < 4; k++) seg.push([T0 + ((k + .45 + .5) / 5) * Rt, T0 + ((k + .95 + .5) / 5) * Rt, 7 + k, 8 + k]);
  seg.push([T0 + Rt, H0 + .15 * vh, 11, 12]);
  seg.push([H0 + .45 * el.how.offsetHeight, C0 + .1 * vh, 12, 13]);
  var cur = 0;
  for (k = 0; k < seg.length; k++) {
    var sg = seg[k];
    if (y >= sg[1]) { cur = sg[3]; continue; }
    if (y >= sg[0]) return { A: sg[2], B: sg[3], tm: sm((y - sg[0]) / Math.max(1, sg[1] - sg[0])) };
    break;
  }
  return { A: cur, B: cur, tm: 0 };
}

/* ---------- DOM controllers (live) ---------- */
function setO(e, o) { e.style.opacity = o.toFixed(3); }
function itemWeights(x, n, set) {
  for (var j = 0; j < n; j++) {
    var d = x - j, o = Math.min(clamp((d + .28) / .1, 0, 1), clamp((.72 - d) / .1, 0, 1));
    set(j, o);
  }
}
var tiles, tm_, caps, sa = {};
function updateSig(S) {
  var r = el.sig.getBoundingClientRect(), R = r.height - VH, p = clamp(-r.top / R, 0, 1), sr = el.sigStage.getBoundingClientRect();
  S.sigHide = p > .06 && p < .8;
  setO(caps[0], sm(p / .05) * (1 - sm((p - .2) / .06)));
  setO(caps[1], sm((p - .3) / .05) * (1 - sm((p - .62) / .06)));
  caps[0]._k = +caps[0].style.opacity; caps[1]._k = +caps[1].style.opacity;
  var e1 = sm((p - .06) / .18), e2 = sm((p - .3) / .14), e3 = sm((p - .44) / .05), e4 = sm((p - .62) / .14);
  var phone = VW < 700, cxm = VW / 2, cym = VH * .5, rr = sa.rule.getBoundingClientRect();
  var stage = phone ? [[.5, .32], [.5, .5], [.5, .68]] : [[.2, .52], [.5, .52], [.8, .52]];
  var tw = tiles[0].offsetWidth || 330;
  tiles.forEach(function (t, k) {
    var sx = px[k], sy = py[k], gx = stage[k][0] * VW, gy = stage[k][1] * VH;
    var x = lerp(sx, gx, e1), y = lerp(sy, gy, e1);
    var offx = (k - 1) * 12 * (1 - e3), offy = (k - 1) * 9 * (1 - e3);
    x = lerp(x, cxm + offx, e2); y = lerp(y, cym + offy, e2);
    var sc = lerp(.03, 1, e1);
    var o = clamp(e1 * 5, 0, 1) * (1 - sm(e3 * 2));
    t.style.opacity = o.toFixed(3);
    t.style.transform = 'translate3d(' + (x - sr.left).toFixed(1) + 'px,' + (y - sr.top).toFixed(1) + 'px,0) translate(-50%,-50%) scale(' + sc.toFixed(3) + ')';
    t.style.zIndex = k === 1 ? 3 : 2;
  });
  var tmo = sm(e3 * 2 - 1) * (1 - sm((e4 - .15) / .85));
  tm_.style.opacity = tmo.toFixed(3); tm_._k = tmo;
  tm_.style.transform = 'translate3d(' + (cxm - sr.left).toFixed(1) + 'px,' + (cym - sr.top - e4 * 40).toFixed(1) + 'px,0) translate(-50%,-50%) scale(' + lerp(1, .97, e4).toFixed(3) + ')';
  S.sigDim = sm((p - .28) / .08) * (1 - sm((p - .6) / .05));
  var ap = clamp((p - .72) / .2, 0, 1), opq = sm((p - .7) / .06);
  setO(sa.q, opq); sa.q._k = opq;
  setO(sa.lbl, sm(ap / .3));
  var mx = 0;
  sa.al.forEach(function (e, j) { var q = sm(clamp((ap - (2 - j) * .14) / .5, 0, 1)); e.style.opacity = q.toFixed(3); e.style.top = ((1 - q) * 20).toFixed(1) + 'px'; mx = Math.max(mx, q); });
  sa.a._k = mx; setO(sa.rule, sm((p - .8) / .06)); setO(sa.srcs, sm((p - .9) / .08));
}
function updateInd(S) {
  var r = el.ind.getBoundingClientRect(), R = r.height - VH, p = clamp(-r.top / R, 0, 1), x = clamp(p * 4 - .5, 0, 3);
  itemWeights(x, 4, function (j, o) { var it = el.its[j]; setO(it, o); it.style.transform = 'translateY(' + ((1 - o) * 14).toFixed(1) + 'px)'; el.itCopy[j]._k = o; });
  var inn = function (j) { return j === 0 ? 1 : sm((x - (j - 1) - .55) / .3); };
  el.photos.forEach(function (im, j) { im.style.opacity = (inn(j) * (j < 3 ? 1 - inn(j + 1) : 1)).toFixed(3); im.style.zIndex = j; });
  var ri = Math.round(x); el.rail.forEach(function (li, j) { li.classList.toggle('on', j === ri); });
}
function updateTrust() {
  var r = el.trust.getBoundingClientRect(), R = r.height - VH, p = clamp(-r.top / R, 0, 1), x = clamp(p * 5 - .5, 0, 4);
  itemWeights(x, 5, function (j, o) { var it = el.tcs[j]; setO(it, o); it.style.transform = 'translateY(' + ((1 - o) * 12).toFixed(1) + 'px)'; el.tcCopy[j]._k = o; });
}
function updateHow() {
  var th = VH * .62;
  el.hs.forEach(function (h) { var r = h.getBoundingClientRect(); h.style.setProperty('--on', r.top < th ? 1 : .18); });
  var lr = el.hline.getBoundingClientRect(); el.hline.style.setProperty('--h', clamp((th - lr.top) / lr.height, 0, 1).toFixed(3));
}
var rcLast = -1;
function updateRows() {
  var n = 0, a = VH * .86, b = VH * .70;
  el.rows.forEach(function (row) {
    var r = row.getBoundingClientRect(), v = clamp((a - r.top) / (a - b), 0, 1);
    row.style.setProperty('--r', v.toFixed(3)); if (v >= 1) n++;
  });
  if (n !== rcLast) { rcLast = n; el.rc.textContent = n; }
}

/* ---------- loop ---------- */
var last = 0, frames = 0, ripT = [0, .33, .66];
function rippleState(t, fixed) {
  var c = [.31, .52, .77].map(function (f) { return Math.floor(f * N); });
  return c.map(function (i, k) { var ph2 = fixed !== undefined ? (fixed + k * .33) % 1 : (t * .3 + ripT[k]) % 1; return { x: px[i], y: py[i], r: ph2 * 130, a: Math.pow(1 - ph2, 1.4) }; });
}
function frame(now) {
  requestAnimationFrame(frame);
  var dt = Math.min(.05, (now - last) / 1000 || .016); last = now;
  var t = now / 1000, y = scrollY;
  var band = el.band.getBoundingClientRect(), cl = el.close.getBoundingClientRect();
  updateRows();
  fieldAlpha = 1 - clamp((VH * .2 - cl.top) / (VH * .75), 0, 1);
  var covered = band.top <= 0 && band.bottom >= VH;
  var S0 = { A: 0, B: 0, tm: 0 };
  var tl = timeline(y);
  var S = { A: tl.A, B: tl.B, tm: tl.tm, root: document, W: VW, H: VH, cr: { left: 0, top: 0 }, t: t, dt: dt, direct: false, ptr: true, hero: y < VH * 1.1, intro: t < 3 };
  updateSig(S); updateInd(S); updateTrust(); updateHow();
  if (covered || fieldAlpha < .01) { if (!covered) ctx.clearRect(0, 0, VW, VH); return; }
  // pointer
  ptr.sx += (ptr.x - ptr.sx) * .3; ptr.sy += (ptr.y - ptr.sy) * .3;
  if (!ptr.on || ptr.sx < -500) { ptr.sx = ptr.x; ptr.sy = ptr.y; }
  S.masks = masksFor(document, S.cr, VW, VH);
  S.fade = fieldAlpha * clamp(t / .8, 0, 1) * (1 - .55 * (S.sigDim || 0));
  S.rip = rippleState(t);
  if (!frames) { S.first = true; S.scatter = true; }
  // hot family
  var inHero = tl.A === 0 && tl.B === 0 || (tl.A === 0 && tl.tm < .3);
  if (inHero) {
    if (ptr.on && now - ptr.t < 2500) { if (S.nearI >= 0) { } }
    else if (now - hotT > 3400 || hotFam < 0) { var cand = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; hotFam = cand[cycle++ % cand.length]; if (famSize[hotFam] < 2) hotFam = 0; hotT = now; }
  } else hotFam = -1;
  compute(S);
  if (ptr.on && inHero && S.nearI >= 0 && S.near < 70 * 70) { hotFam = fam[S.nearI]; hotT = now; }
  S.dpr = DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, VW, VH);
  drawMarks(ctx, S); drawExtras(ctx, S); drawLabels(ctx, S);
  frames++;
  el.cue.style.opacity = clamp(1 - y / (VH * .25), 0, 1);
}

/* ---------- static render ---------- */
function staticRender() {
  $$('.sc').forEach(function (c) { c.remove(); });
  var items = $$('[data-scene]');
  items.forEach(function (host) {
    var s = +host.dataset.scene, hr = host.getBoundingClientRect(); if (hr.width < 10 || hr.height < 10) return;
    var c = document.createElement('canvas'); c.className = 'sc'; var d = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(hr.width * d); c.height = Math.round(hr.height * d); host.insertBefore(c, host.firstChild);
    var g = c.getContext('2d'), cr = c.getBoundingClientRect();
    var S = { A: s, B: s, tm: 0, root: host, W: hr.width, H: hr.height, cr: cr, t: 14, dt: .016, direct: true, ptr: false, hero: s === 0, first: true, fixedHot: s === 0 ? 0 : -1, hotLabels: s === 0 ? 0 : -1, dpr: d, sweep: .55 };
    S.masks = masksFor(host, cr, hr.width, hr.height);
    S.rip = [];
    compute(S); S.rip = rippleState(0, .35); S.first = false; compute(S);
    g.setTransform(d, 0, 0, d, 0, 0); drawMarks(g, S); drawExtras(g, S); drawLabels(g, S);
  });
}

/* ---------- init ---------- */
function setup() {
  el.sig = $('#sig'); el.sigStage = $('.sig-stage'); el.ind = $('#industries'); el.trust = $('#trust'); el.how = $('#how'); el.close = $('#company'); el.band = $('#records');
  el.cue = $('#cue'); el.rows = $$('[data-r]'); el.rc = $('#rc'); el.rt = $('#rt'); el.rt.textContent = el.rows.length;
  if (STATIC) {
    $$('[data-sa]').forEach(function (e) { e.dataset.anchor = e.dataset.sa; });
    $$('[data-live-only]').forEach(function (e) { e.remove(); });
    $$('.ii').forEach(function (ii) {
      var k = ii.dataset.k, it = $('.it[data-k="' + k + '"]'), img = $('img', ii);
      img.dataset.anchor = 'photo' + k; img.removeAttribute('loading'); it.insertBefore(img, it.firstChild); ii.remove();
    });
    $$('.hero,.sig,.it,.tc,.how').forEach(function (e) { e.style.position = 'relative'; });
    el.rc.textContent = el.rows.length;
    return;
  }
  tiles = $$('.tile.t0,.tile.t1,.tile.t2'); tm_ = $('.tile.tm'); caps = [$('.sig-cap.c0'), $('.sig-cap.c1')];
  sa = { q: $('.sa-q'), lbl: $('.sa-a .lbl'), a: $('.sa-a'), al: $$('.sa-a .al'), rule: $('.rule'), srcs: $('.srcs') };
  el.its = $$('.it'); el.itCopy = el.its.map(function (e) { return $('.it-copy', e); });
  el.photos = $$('.ii-photo'); el.rail = $$('.ind-rail li');
  el.tcs = $$('.tc'); el.tcCopy = el.tcs.map(function (e) { return $('.tc-copy', e); });
  el.hs = $$('.hs'); el.hline = $('.hline');
  $$('.ii').forEach(function (e) { e.removeAttribute('data-scene'); });
  $$('.it,.tc,.hero,.sig,.how').forEach(function (e) { e.removeAttribute('data-scene'); });
  $$('.it-struct,.tc-field').forEach(function (e) { e.removeAttribute('data-sa'); });
}
function sizeCanvas() {
  VW = innerWidth; VH = innerHeight; DPR = Math.min(window.devicePixelRatio || 1, 2);
  cvs.width = Math.round(VW * DPR); cvs.height = Math.round(VH * DPR);
}
function nav() {
  var tg = $('.nav-toggle'), menu = $('#nav-menu');
  tg.addEventListener('click', function () { var o = menu.classList.toggle('open'); tg.setAttribute('aria-expanded', o); });
  $$('.nav-item').forEach(function (d) { d.addEventListener('toggle', function () { if (d.open) $$('.nav-item').forEach(function (o) { if (o !== d) o.open = false; }); }); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.nav-item')) $$('.nav-item').forEach(function (o) { o.open = false; }); });
}
function boot() {
  setup(); nav();
  if (STATIC) {
    var run = function () { buildAll(); buildHeroMask(); staticRender(); };
    var again = function () { run(); };
    run(); setTimeout(again, 700); window.addEventListener('load', function () { setTimeout(again, 300); });
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(again, 250); });
    return;
  }
  sizeCanvas(); buildAll(); buildHeroMask();
  addEventListener('pointermove', function (e) { if (e.pointerType === 'touch') return; ptr.x = e.clientX; ptr.y = e.clientY; ptr.on = true; ptr.t = performance.now(); });
  document.addEventListener('pointerleave', function () { ptr.on = false; });
  var rt2; addEventListener('resize', function () {
    clearTimeout(rt2); rt2 = setTimeout(function () { var w = VW; sizeCanvas(); if (w !== VW) { buildAll(); buildHeroMask(); } }, 150);
  });
  requestAnimationFrame(frame);
}
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { requestAnimationFrame(boot); });
})();
