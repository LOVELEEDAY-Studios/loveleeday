/* brain.js — what Arthur does with a question, drawn.

   Daniel, 2026-09-21: "a brain that pings with thought questions, neurons
   flashing and showing what happens when you give arthur a question or data
   to review, the questions it then generates in its brain."

   So this is not decoration. It is a four-beat loop with a claim in it:

     1 ASK      a question enters from the left and lands on a node
     2 FIRE     the signal propagates outward along real edges, breadth-first,
                so what lights is the graph's actual topology, not random noise
     3 ASK BACK the sub-questions Arthur generates surface at the nodes they
                fired from, tethered by a line to that node
     4 SETTLE   everything decays and the next question arrives

   The sub-questions are the ones the system genuinely asks -- resolution,
   bitemporality, lineage, blast radius. That is the argument: you give it a
   question, it decomposes into the questions it must answer first.

   The silhouette is a metaball field of six ellipses (frontal, main mass,
   occipital, temporal, cerebellum, stem) rather than a traced path, because
   a field can be sampled for "is this point inside" and a path cannot without
   a lot more code. Nodes are rejection-sampled into it and then relaxed apart
   so the spacing reads deliberate.

   No dependencies. DPR-aware. Pauses off-screen. Draws a still frame under
   prefers-reduced-motion and never animates.
*/
(function (global) {
  'use strict';

  /* A brain in left profile. The first pass used six loosely-spaced ellipses
     and rendered as a blob with a thin tail hanging off it -- the stem read as
     a rendering fault rather than as anatomy. These overlap enough to fuse into
     one mass: frontal, two crown lobes, the body, occipital, temporal, and a
     cerebellum tucked under the back with a short stem. */
  var LOBES = [
    [0.255, 0.455, 0.135, 0.150],
    [0.375, 0.345, 0.155, 0.135],
    [0.565, 0.340, 0.165, 0.135],
    [0.440, 0.455, 0.215, 0.175],
    [0.700, 0.435, 0.140, 0.140],
    [0.430, 0.600, 0.165, 0.100],
    [0.665, 0.590, 0.105, 0.088],
    [0.605, 0.660, 0.070, 0.070]
  ];

  function field(x, y) {
    var s = 0;
    for (var i = 0; i < LOBES.length; i++) {
      var L = LOBES[i];
      var dx = (x - L[0]) / L[2], dy = (y - L[1]) / L[3];
      s += Math.exp(-2.4 * (dx * dx + dy * dy));
    }
    return s;
  }
  var INSIDE = 0.52;

  function rng(seed) {
    return function () {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
  }

  function build(count, seed) {
    var rand = rng(seed || 7), pts = [], guard = 0;
    while (pts.length < count && guard++ < count * 400) {
      var x = rand(), y = rand() * 0.95;
      if (field(x, y) > INSIDE) pts.push({ x: x, y: y });
    }
    /* Relax: without this the rejection sample clumps and the graph reads as
       static rather than as a structure. */
    for (var pass = 0; pass < 26; pass++) {
      for (var i = 0; i < pts.length; i++) {
        var ax = 0, ay = 0;
        for (var j = 0; j < pts.length; j++) {
          if (i === j) continue;
          var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 0.0021 && d2 > 1e-9) { ax += dx / d2; ay += dy / d2; }
        }
        var nx = pts[i].x + ax * 0.000013, ny = pts[i].y + ay * 0.000013;
        if (field(nx, ny) > INSIDE) { pts[i].x = nx; pts[i].y = ny; }
      }
    }
    /* Edges: three nearest neighbours, de-duplicated. */
    var edges = [], adj = pts.map(function () { return []; });
    for (var a = 0; a < pts.length; a++) {
      var near = [];
      for (var b = 0; b < pts.length; b++) {
        if (a === b) continue;
        var ex = pts[a].x - pts[b].x, ey = pts[a].y - pts[b].y;
        near.push([ex * ex + ey * ey, b]);
      }
      near.sort(function (p, q) { return p[0] - q[0]; });
      for (var k = 0; k < 3 && k < near.length; k++) {
        var o = near[k][1];
        if (a < o) { edges.push([a, o]); adj[a].push(o); adj[o].push(a); }
        else if (adj[o].indexOf(a) < 0) { edges.push([o, a]); adj[a].push(o); adj[o].push(a); }
      }
    }
    /* Fit from the cloud's MEASURED bounds. The projection used hand-tuned
       constants against the unit square, so the crown clipped off the top of
       the canvas and the shape sat high with dead ground beneath it. The
       sample knows where it actually is; ask it. */
    var bb = { x0: 1, y0: 1, x1: 0, y1: 0 };
    for (var m = 0; m < pts.length; m++) {
      bb.x0 = Math.min(bb.x0, pts[m].x); bb.x1 = Math.max(bb.x1, pts[m].x);
      bb.y0 = Math.min(bb.y0, pts[m].y); bb.y1 = Math.max(bb.y1, pts[m].y);
    }
    return { pts: pts, edges: edges, adj: adj, bb: bb };
  }

  function depths(adj, from) {
    var d = new Array(adj.length).fill(-1), q = [from], h = 0;
    d[from] = 0;
    while (h < q.length) {
      var n = q[h++];
      for (var i = 0; i < adj[n].length; i++) {
        var m = adj[n][i];
        if (d[m] < 0) { d[m] = d[n] + 1; q.push(m); }
      }
    }
    return d;
  }

  var SCRIPT = [
    { ask: 'Why did margin fall in August?',
      out: ['Which objects does "margin" resolve to?',
            'What did we know on 2026-08-31?',
            'Does every input carry lineage?',
            'Which source systems were stale?'] },
    { ask: 'Is this invoice safe to pay?',
      out: ['Is the vendor one object or four records?',
            'What is the blast radius of this action?',
            'Has the figure been observed, or inferred?',
            'Does it need a human to close?'] },
    { ask: 'Rebuild the forecast for Q4.',
      out: ['Which values were valid then?',
            'Exclude anything learned after the date',
            'Print the trail for each input',
            'Flag every number without a source'] }
  ];

  function mount(canvas, opts) {
    opts = opts || {};
    var ctx = canvas.getContext('2d');
    var C = {
      node: opts.node || '#8FA6B5',
      edge: opts.edge || 'rgba(143,166,181,.20)',
      hot: opts.hot || '#E56E3E',
      live: opts.live || '#5FD3C4',
      text: opts.text || '#F4F4F2',
      dim: opts.dim || 'rgba(244,244,242,.55)',
      ground: opts.ground || 'transparent',
      labels: opts.labels !== false,
      count: opts.count || 300
    };
    var G = build(C.count, opts.seed || 11);
    var W = 0, H = 0, dpr = 1, raf = 0, t0 = performance.now(), running = false;
    var beat = 0, dep = depths(G.adj, 0), entry = 0, pulses = [], shown = [];
    var reduced = global.matchMedia &&
                  global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function fit() {
      var r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      dpr = Math.min(global.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      W = r.width; H = r.height;
      return true;
    }

    /* Project the unit shape into the box, preserving aspect and leaving room
       on the right for the generated questions. */
    /* On a phone the generated questions ran off the right edge -- they are
       laid out beside the silhouette, which assumes a wide canvas. Below 640px
       the brain moves to the top half and the questions stack underneath it. */
    function narrow() { return W < 640; }

    function P(p) {
      var bb = G.bb;
      if (narrow()) {
        var gw2 = bb.x1 - bb.x0, gh2 = bb.y1 - bb.y0;
        var aw = W - 24, ah = H * (C.labels ? 0.42 : 0.9);
        var s2 = Math.min(aw / gw2, ah / gh2);
        var ox2 = (W - gw2 * s2) / 2;
        var oy2 = H * (C.labels ? 0.085 : 0.05) + (ah - gh2 * s2) / 2;
        return [ox2 + (p.x - bb.x0) * s2, oy2 + (p.y - bb.y0) * s2];
      }
      var gw = bb.x1 - bb.x0, gh = bb.y1 - bb.y0;
      var mx = W * 0.03, my = H * (C.labels ? 0.17 : 0.07);
      var availW = (C.labels ? W * 0.56 : W) - mx * 2;
      var availH = H - my * 2;
      var s = Math.min(availW / gw, availH / gh);
      var ox = mx + (availW - gw * s) / 2 + (C.labels ? W * 0.015 : 0);
      var oy = my + (availH - gh * s) / 2;
      return [ox + (p.x - bb.x0) * s, oy + (p.y - bb.y0) * s];
    }

    function pickEntry() {
      /* Enter at the frontal lobe -- the left of the silhouette. */
      var best = 0, bx = 9;
      for (var i = 0; i < G.pts.length; i++) {
        var v = G.pts[i].x + Math.abs(G.pts[i].y - 0.44) * 0.5;
        if (v < bx) { bx = v; best = i; }
      }
      return best;
    }

    function startBeat(k) {
      beat = k % SCRIPT.length;
      entry = pickEntry();
      dep = depths(G.adj, entry);
      shown = [];
      var maxd = Math.max.apply(null, dep);
      var outs = SCRIPT[beat].out;
      /* Attach each generated question to a node deep in the propagation, so
         the line visibly comes back from where the signal actually reached. */
      var cand = [];
      for (var i = 0; i < dep.length; i++) if (dep[i] > maxd * 0.45) cand.push(i);
      cand.sort(function (a, b) { return G.pts[b].x - G.pts[a].x; });
      for (var q = 0; q < outs.length; q++) {
        var n = cand[Math.floor(q * cand.length / Math.max(outs.length, 1)) % cand.length];
        shown.push({ node: n === undefined ? 0 : n, text: outs[q], at: 1.15 + q * 0.42 });
      }
    }

    function draw(now) {
      var el = (now - t0) / 1000;
      var cycle = 7.2;
      var k = Math.floor(el / cycle);
      var tt = el - k * cycle;
      if (k !== (draw._k === undefined ? -1 : draw._k)) { draw._k = k; startBeat(k); }

      if (C.ground === 'transparent') ctx.clearRect(0, 0, canvas.width, canvas.height);
      else { ctx.fillStyle = C.ground; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.save();
      ctx.scale(dpr, dpr);

      var maxd = Math.max.apply(null, dep) || 1;
      var front = (tt - 0.55) * 7.4;             /* how far the wave has travelled */

      /* edges */
      for (var e = 0; e < G.edges.length; e++) {
        var a = G.edges[e][0], b = G.edges[e][1];
        var pa = P(G.pts[a]), pb = P(G.pts[b]);
        var d = Math.min(dep[a], dep[b]);
        var lit = front - d;
        ctx.beginPath();
        ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]);
        if (lit > 0 && lit < 2.4) {
          ctx.strokeStyle = C.live;
          ctx.globalAlpha = 0.85 * (1 - lit / 2.4);
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = C.edge; ctx.globalAlpha = 1; ctx.lineWidth = 1;
        }
        ctx.stroke();
      }

      /* nodes */
      for (var i = 0; i < G.pts.length; i++) {
        var p = P(G.pts[i]);
        var lit2 = front - dep[i];
        var shimmer = 0.5 + 0.5 * Math.sin(el * 1.6 + i * 1.7);
        var r = 1.5 + shimmer * 0.5;
        ctx.globalAlpha = 0.55 + shimmer * 0.2;
        ctx.fillStyle = C.node;
        if (lit2 > 0 && lit2 < 2.0) {
          var f = 1 - lit2 / 2.0;
          ctx.fillStyle = C.live; ctx.globalAlpha = 0.5 + f * 0.5;
          r = 1.6 + f * 3.1;
          ctx.beginPath(); ctx.arc(p[0], p[1], r * 3.4, 0, 7);
          ctx.globalAlpha = 0.10 * f; ctx.fill();
          ctx.globalAlpha = 0.5 + f * 0.5;
        }
        ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (C.labels) {
        var ep = P(G.pts[entry]);
        /* 1 — the question arriving */
        var inAlpha = tt < 0.45 ? tt / 0.45 : (tt > 6.4 ? Math.max(0, (7.0 - tt) / 0.6) : 1);
        ctx.globalAlpha = Math.min(1, inAlpha);
        ctx.font = '500 13px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillStyle = C.hot;
        ctx.textAlign = 'left';
        var qx = 10, qy = H * 0.12;
        ctx.fillText('ASK', qx, qy);
        ctx.font = '400 14.5px system-ui, sans-serif';
        ctx.fillStyle = C.text;
        ctx.fillText(SCRIPT[beat].ask, qx + 34, qy);
        ctx.strokeStyle = C.hot; ctx.lineWidth = 1;
        ctx.globalAlpha = Math.min(1, inAlpha) * 0.5;
        ctx.beginPath(); ctx.moveTo(qx + 6, qy + 9);
        ctx.bezierCurveTo(qx + 6, (qy + ep[1]) / 2, ep[0] * 0.5, ep[1], ep[0] - 4, ep[1]);
        ctx.stroke();
        ctx.globalAlpha = 1;

        /* 3 — the questions it generates */
        var nw = narrow();
        ctx.font = nw
          ? '400 11.5px ui-monospace, SFMono-Regular, Menlo, monospace'
          : '400 12.5px ui-monospace, SFMono-Regular, Menlo, monospace';
        for (var s = 0; s < shown.length; s++) {
          var S = shown[s];
          var age = tt - S.at;
          if (age < 0) continue;
          var al = age < 0.34 ? age / 0.34 : (tt > 6.3 ? Math.max(0, (6.9 - tt) / 0.6) : 1);
          if (al <= 0) continue;
          var np = P(G.pts[S.node]);
          var lx = nw ? 22 : W * 0.615;
          var ly = nw ? H * 0.665 + s * 22 : H * (0.22 + s * 0.17);
          ctx.globalAlpha = al * 0.4;
          ctx.strokeStyle = C.live; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(np[0], np[1]);
          if (nw) { ctx.lineTo(np[0], ly - 4); ctx.lineTo(lx - 6, ly - 4); }
          else ctx.lineTo(lx - 12, ly - 4);
          ctx.stroke();
          ctx.globalAlpha = al;
          ctx.fillStyle = C.live;
          ctx.beginPath(); ctx.arc(np[0], np[1], 2.6, 0, 7); ctx.fill();
          ctx.fillStyle = C.dim;
          ctx.fillText('?', lx - 10, ly);
          ctx.fillStyle = C.text;
          var txt = S.text, maxw = W - lx - 14;
          while (txt.length > 6 && ctx.measureText(txt).width > maxw) {
            txt = txt.slice(0, -2);
          }
          if (txt !== S.text) txt = txt.replace(/[\s?]+$/, '') + '\u2026';
          ctx.fillText(txt, lx + 4, ly);
        }
        ctx.globalAlpha = 1;
      }
      ctx.restore();
    }

    function loop(now) { draw(now); raf = requestAnimationFrame(loop); }

    function start() {
      if (running || reduced) return;
      running = true; raf = requestAnimationFrame(loop);
    }
    function stop() { running = false; cancelAnimationFrame(raf); }

    if (!fit()) {
      var tries = 0, iv = setInterval(function () {
        if (fit() || ++tries > 20) { clearInterval(iv); draw(performance.now()); }
      }, 120);
    }
    startBeat(0);
    draw(performance.now());

    if (global.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        es[0].isIntersecting ? start() : stop();
      }, { threshold: 0.05 }).observe(canvas);
    } else start();

    global.addEventListener('resize', function () { if (fit()) draw(performance.now()); });
    return { start: start, stop: stop, graph: G };
  }

  global.Brain = { mount: mount, script: SCRIPT };
})(window);
