(function () {
  var root = document.documentElement;
  var pin = root.classList.contains('pin');
  var scenes = [].slice.call(document.querySelectorAll('.scene'));
  var hud = document.getElementById('hud');
  var light = document.querySelector('.light');
  var main = document.getElementById('day');
  var n = scenes.length;
  if (!pin || !main) return;

  function parseTime(s) {
    var m = /(\d+):(\d+)\s*(AM|PM)/.exec(s);
    var h = (+m[1]) % 12;
    if (m[3] === 'PM') h += 12;
    return h * 60 + (+m[2]);
  }
  var T = scenes.map(function (s) { return parseTime(s.dataset.time); });
  var LEN = scenes.map(function (s) { return +s.dataset.len || 2.2; });
  var FROMD = scenes.map(function (s) {
    return (s.dataset.from || '0 49.6 0 49.6').split(' ').map(Number);
  });
  var FROM = FROMD;
  var QAT = scenes.map(function (s) { return s.dataset.q == null ? null : +s.dataset.q; });
  var AAT = scenes.map(function (s) { return s.dataset.a == null ? null : +s.dataset.a; });

  // split questions into words
  var qWords = scenes.map(function (s) {
    var q = s.querySelector('.q');
    if (!q) return [];
    var words = q.textContent.trim().split(/\s+/);
    q.setAttribute('aria-label', q.textContent.trim());
    q.innerHTML = words.map(function (w) { return '<span class="w" aria-hidden="true">' + w + '</span>'; }).join(' ');
    return [].slice.call(q.querySelectorAll('.w'));
  });
  var aKids = scenes.map(function (s) { return [].slice.call(s.querySelectorAll('.a > *')); });
  var rvs = scenes.map(function (s) {
    return [].slice.call(s.querySelectorAll('.rv')).map(function (el) {
      return { el: el, at: +el.dataset.at, dur: +el.dataset.dur || .5 };
    });
  });
  var zs = scenes.map(function (s) {
    return [].slice.call(s.querySelectorAll('.z')).map(function (el) { return { el: el, f: 1.05 }; });
  });
  var hint = document.querySelector('.hint');

  var vh = innerHeight, starts = [], total = 0, D = 0;
  function layout() {
    vh = innerHeight;
    D = .95 * vh;
    FROM = innerWidth <= 700 ? FROMD.map(function (f, i) { return i === 0 ? f : [0, 49.6, 0, 49.6]; }) : FROMD;
    starts = [];
    var acc = 0;
    for (var i = 0; i < n; i++) { starts.push(acc); acc += LEN[i] * vh; }
    total = acc + vh;
    main.style.height = total + 'px';
    // never push a photograph beyond 1.08 of its native size
    zs.forEach(function (list) {
      list.forEach(function (o) {
        var img = o.el, w = img.clientWidth, h = img.clientHeight;
        var nw = img.naturalWidth || +img.getAttribute('width'), nh = img.naturalHeight || +img.getAttribute('height');
        var base = Math.max(w / nw, h / nh) || 1;
        o.f = Math.min(1.08, Math.max(1, 1.08 / base));
      });
    });
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  var intro0 = null, introDone = false, introO = 0;
  var cur = 0, started = false, autoV = 0;
  var hudEls = { h: hud.querySelector('.h'), m: hud.querySelector('.m'), ap: hud.querySelector('.ap') };
  var lastTxt = '', lastTone = '', lastNav = '';

  function frame(now) {
    var target = Math.max(0, scrollY - main.offsetTop);
    if (!started) { cur = target; started = true; }
    cur += (target - cur) * .14;
    if (Math.abs(target - cur) < .4) cur = target;
    var y = cur;

    if (intro0 === null) intro0 = now + 250;
    introO = target > 40 ? 1 : clamp((now - intro0) / 1500, 0, 1);
    autoV = clamp((now - intro0 - 1300) / 1800, 0, 1) * 1.0;

    var o = [], e = [], k = 0, k5 = 0;
    for (var i = 0; i < n; i++) {
      var oi = i === 0 ? introO : clamp((y - starts[i]) / D, 0, 1);
      o.push(oi); e.push(ease(oi));
      if (oi > 0) k = i;
      if (oi >= .5) k5 = i;
    }

    for (i = 0; i < n; i++) {
      var s = scenes[i];
      var vis = o[i] > 0 && !(i + 1 < n && o[i + 1] >= 1);
      s.style.visibility = vis ? 'visible' : 'hidden';
      if (!vis) continue;
      var f = FROM[i], t = e[i];
      if (o[i] >= 1) s.style.clipPath = 'none';
      else {
        var r = (1 - t);
        s.style.clipPath = 'inset(' + (f[0] * r).toFixed(2) + '% ' + (f[1] * r).toFixed(2) + '% ' + (f[2] * r).toFixed(2) + '% ' + (f[3] * r).toFixed(2) + '% round ' + (10 * r).toFixed(1) + 'px)';
      }
      var v = (y - starts[i]) / vh;
      if (i === 0) v = Math.max(v, autoV); else v -= .8;
      var co = i < n - 1 ? 1 - clamp(o[i + 1] * 2.5, 0, 1) : 1;
      var gi = s.querySelector('.giant'); if (gi) gi.style.opacity = co;
      var push = clamp((v + (i === 0 ? 0 : .8)) / LEN[i], 0, 1);
      var zl = zs[i];
      for (var z = 0; z < zl.length; z++) {
        zl[z].el.style.transform = 'scale(' + (1 + (zl[z].f - 1) * (i === 0 ? clamp(.15 + push, 0, 1) : push)).toFixed(4) + ')';
      }
      // questions
      var qw = qWords[i], qa = QAT[i];
      if (qw.length && qa != null) {
        for (var w = 0; w < qw.length; w++) {
          var p = clamp((v - qa - w * .02) / .12, 0, 1);
          qw[w].style.opacity = p * co;
          qw[w].style.transform = 'translateY(' + ((1 - p) * 10).toFixed(1) + 'px)';
        }
      }
      // answers
      var ak = aKids[i], aa = AAT[i];
      if (ak.length && aa != null) {
        for (var a = 0; a < ak.length; a++) {
          var pa = clamp((v - aa + .1 - a * .06) / .14, 0, 1);
          ak[a].style.opacity = pa * co;
          ak[a].style.transform = 'translateY(' + ((1 - pa) * 12).toFixed(1) + 'px)';
        }
      }
      var rl = rvs[i];
      for (var q = 0; q < rl.length; q++) {
        var pr = rl[q].at < 0 ? clamp((o[i] - .55) / .45, 0, 1) : clamp((v - rl[q].at) / rl[q].dur, 0, 1);
        var el = rl[q].el;
        el.style.opacity = pr * co;
        if (el.classList.contains('rec')) {
          el.style.transform = 'none';
          el.style.clipPath = 'inset(0 ' + ((1 - ease(pr)) * 100).toFixed(1) + '% 0 0)';
        } else if (el.classList.contains('u')) {
          el.style.transform = 'scaleX(' + ease(pr).toFixed(3) + ')';
        } else if (el.classList.contains('shot')) {
          el.style.transform = 'translateY(' + ((1 - ease(pr)) * 60).toFixed(1) + 'px)';
        } else el.style.transform = 'translateY(' + ((1 - pr) * 14).toFixed(1) + 'px)';
      }
    }

    // the clock
    var mins;
    var v0 = (y - starts[k]) / vh;
    if (k > 0 && o[k] < 1) mins = lerp(T[k - 1] + 2, T[k], e[k]);
    else mins = T[k] + 2 * clamp((v0 - .95) / (LEN[k] - .95), 0, 1);
    var mm = Math.round(mins), hh = Math.floor(mm / 60) % 24, mi = mm % 60;
    var ap = hh >= 12 ? 'PM' : 'AM';
    hh = hh % 12 || 12;
    var txt = hh + ':' + (mi < 10 ? '0' : '') + mi + ap;
    if (txt !== lastTxt) {
      hudEls.h.textContent = hh; hudEls.m.textContent = (mi < 10 ? '0' : '') + mi; hudEls.ap.textContent = ap;
      lastTxt = txt;
    }
    var tone = scenes[k5].dataset.hud || 'ink';
    if (tone !== lastTone) { hud.dataset.tone = tone; lastTone = tone; }
    var nv = scenes[k5].dataset.nav || 'ink';
    if (nv !== lastNav) { root.dataset.nav = nv; lastNav = nv; }
    hud.classList.toggle('stopped', k === n - 1 && v0 > 1.6);

    // the light of the day
    var pos = 0;
    for (i = 0; i < n; i++) pos += o[i];
    pos -= 1;
    var li = 0;
    if (pos > 3) li = clamp((pos - 3) / 2, 0, 1) * .12;
    if (pos > 5) li = .12 + clamp((pos - 5) / 1, 0, 1) * .04;
    if (pos > 6) li = .16 * (1 - clamp(pos - 6, 0, 1));
    light.style.opacity = li.toFixed(3);
    if (hint) hint.style.opacity = clamp(1 - y / (.3 * vh), 0, 1);

    requestAnimationFrame(frame);
  }

  function boot() {
    layout();
    requestAnimationFrame(frame);
  }
  addEventListener('resize', layout);
  var imgs = [].slice.call(document.images), pending = imgs.filter(function (i) { return !i.complete; }).length;
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  imgs.forEach(function (im) { if (!im.complete) im.addEventListener('load', function () { layout(); }); });
  boot();
})();
