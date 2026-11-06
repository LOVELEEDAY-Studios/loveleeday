/* ob.js: header menus, phone menu and reveal motion for one-brand pages. The menu code is the home page's (home/n1.js). */
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

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

  /* the phone call-to-action bar hides while the page is at the top, as on home */
  function topState() { root.classList.toggle('top', (window.pageYOffset || 0) < 40); }
  addEventListener('scroll', topState, { passive: true }); topState();

  /* reveal: elements marked data-ob-reveal rise in once, only when motion is allowed (ob-rv is set in the head) */
  var rv = $$('[data-ob-reveal]');
  if (rv.length) {
    if (!root.classList.contains('ob-rv') || !('IntersectionObserver' in window)) rv.forEach(function (e) { e.classList.add('is-in'); });
    else {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
      rv.forEach(function (e) { io.observe(e); });
    }
  }
})();
