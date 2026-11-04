(() => {
  'use strict';
  const D = window.LL_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const qs = new URLSearchParams(location.search);
  const STATIC = qs.get('static') === '1';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const calm = STATIC || RM;
  const root = document.documentElement;
  root.classList.toggle('static', STATIC);
  root.classList.toggle('rm', RM);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const money = (n) => (n < 0 ? '-' : '') + '$' + Math.abs(n).toLocaleString('en-US');
  const EASE = 'cubic-bezier(.2,.8,.2,1)';

  /* ---------- number and record formatting ---------- */
  const fmtVal = (f, v) => {
    if (typeof v === 'string') return v;
    return f.total.startsWith('$') ? money(v) : (v < 0 ? '-' : '') + Math.abs(v).toLocaleString('en-US');
  };
  const isNum = (c) => typeof c === 'number' || (typeof c === 'string' && /^\$[\d,]+$/.test(c));
  const rowOf = (s, r) => { const t = s.tables[r.t]; const i = t.rows.findIndex((x) => x[0] === r.r); return { t, i, row: t.rows[i] }; };
  const recDate = (s, r) => { const { t, row } = rowOf(s, r); return t.dateCol >= 0 ? row[t.dateCol] : 'Nov 3'; };

  /* ---------- drawer height morph ---------- */
  function morph(dr, html, mode, inst) {
    const h0 = dr.offsetHeight;
    if (mode === 'close') {
      if (!dr.classList.contains('open')) return;
      const done = () => { dr.classList.remove('open'); dr.innerHTML = ''; dr.style.height = '0px'; };
      if (calm) return done();
      dr.style.height = h0 + 'px';
      const a = dr.animate([{ height: h0 + 'px' }, { height: '0px' }], { duration: 320, easing: EASE });
      a.onfinish = done;
      return;
    }
    dr.innerHTML = '<div class="dr-in">' + html + '</div>';
    dr.classList.add('open');
    dr.style.height = 'auto';
    const h1 = dr.offsetHeight;
    if (calm || inst || h0 === h1) return;
    dr.style.height = h1 + 'px';
    const a = dr.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 440, easing: EASE });
    a.onfinish = () => { dr.style.height = 'auto'; };
  }

  /* ---------- the Ask interface ---------- */
  function renderAsk(k, o) {
    const s = D.sets[k];
    const systems = [...new Set(Object.values(s.tables).map((t) => t.sys))];
    const ans = s.answer.replace(/\{(\w)\|([^}]+)\}/g, '<button class="fig" type="button" data-f="$1" aria-expanded="false">$2</button>');
    const chips = systems.map((x) => '<span class="c">' + x + '</span>').join('');
    return '<div class="ask' + (o.sidebar ? '' : ' nosb') + '">' +
      '<aside class="ak-side"><div class="ak-org"><i></i><span>' + s.org + '</span></div>' +
      '<nav class="ak-nav"><a class="on">Ask</a><a>Signals<small>3</small></a><a>Workstreams<small>2</small></a><a>Sources<small>' + systems.length + '</small></a></nav>' +
      '<div class="ak-sys"><h6>Connected</h6><ul>' + systems.map((x) => '<li><i></i>' + x + '</li>').join('') + '</ul></div></aside>' +
      '<div class="ak-main"><div class="ak-top"><span>Ask</span><em>Example data</em></div>' +
      '<div class="ak-q"><div class="ak-qt">' + s.q + '</div><button class="ak-btn" type="button" tabindex="-1">Ask</button></div>' +
      '<p class="ak-looked">Answered from <b>' + s.looked + '</b>. Underlined figures open to the record.</p>' +
      '<div class="ak-a">' + ans + '</div>' +
      '<p class="ak-src"><span>Sources</span>' + chips + '</p>' +
      '<div class="dr" role="region" aria-label="Source records"></div></div></div>';
  }

  class Ask {
    constructor(el, k, o) { this.el = el; this.o = o; this.k = k; this.cur = null; this.hover = false; this.tok = 0; this.timer = null; this.mount(k); this.bind(); }
    mount(k) {
      this.k = k; this.s = D.sets[k]; this.cur = null;
      this.el.innerHTML = renderAsk(k, this.o);
      this.dr = $('.dr', this.el);
    }
    bind() {
      this.el.addEventListener('click', (e) => {
        const fig = e.target.closest('.fig');
        if (fig) { this.stopAuto(); const f = fig.dataset.f; if (this.cur === f && !this.hover) return this.close(); this.hover = false; return this.openFig(f); }
        const row = e.target.closest('.dr-row');
        if (row) { this.stopAuto(); return row.dataset.ref ? this.openFig(row.dataset.ref) : this.openLine(this.cur, +row.dataset.i); }
        if (e.target.closest('.dr-x')) { this.stopAuto(); return this.close(); }
        if (e.target.closest('.ln-back')) { this.stopAuto(); return this.openFig(this.cur, true); }
      });
      this.el.addEventListener('mouseover', (e) => {
        const fig = e.target.closest('.fig');
        if (!fig || !matchMedia('(hover:hover)').matches) return;
        clearTimeout(this.ht);
        this.ht = setTimeout(() => { this.stopAuto(); if (this.cur !== fig.dataset.f) { this.hover = true; this.openFig(fig.dataset.f); } }, 140);
      });
      this.el.addEventListener('mouseout', (e) => { if (e.target.closest('.fig')) clearTimeout(this.ht); });
      this.el.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.cur) { this.stopAuto(); this.close(); } });
      this.el.addEventListener('pointerdown', () => this.stopAuto());
    }
    setExpanded(f) { $$('.fig', this.el).forEach((b) => b.setAttribute('aria-expanded', String(b.dataset.f === f))); }
    listHTML(fk, fresh) {
      const s = this.s, f = s.figs[fk];
      const rows = f.recs.map((r, i) => {
        if (r.ref) return '<button class="dr-row rise" style="--d:' + (i + 1) + '" type="button" data-ref="' + r.ref + '"><span class="sy">Calculated</span><span class="nt">' + r.note + '</span><span class="am' + (r.v < 0 ? ' neg' : '') + '">' + fmtVal(f, r.v) + '</span><span class="ch">&#8250;</span></button>';
        const { t } = rowOf(s, r);
        return '<button class="dr-row rise" style="--d:' + (i + 1) + '" type="button" data-i="' + i + '"><span class="sy">' + t.sys + '</span><span class="nt">' + r.note + '<small>' + recDate(s, r) + '</small></span><span class="am' + (r.v < 0 ? ' neg' : '') + '">' + fmtVal(f, r.v) + '</span><span class="ch">&#8250;</span></button>';
      }).join('');
      let foot;
      if (f.days) foot = f.days[1] + ' minus ' + f.days[0] + ' = <b>' + f.days[2] + ' days</b>';
      else if (f.txt) foot = 'Every record agrees: <b>' + f.total + '</b>';
      else if (f.recs.length === 1) foot = 'One record says <b>' + f.total + '</b>';
      else if (/minus/.test(f.foot)) foot = cap(f.foot) + ' = <b>' + f.total + '</b>';
      else foot = cap(f.foot) + ' add up to <b>' + f.total + '</b>';
      return '<div class="dr-head"><div><b>' + f.total + '</b><span>' + f.head + '</span></div><button class="dr-x" type="button">Close</button></div>' + rows +
        '<div class="dr-foot"><span>' + foot + '</span><span>' + f.recs.length + (f.recs.length === 1 ? ' record' : ' records') + '</span></div>';
    }
    lineHTML(fk, i) {
      const s = this.s, f = s.figs[fk], r = f.recs[i];
      const { t, i: hi, row } = rowOf(s, r);
      const start = Math.max(0, Math.min(hi - 1, t.rows.length - 4));
      const win = t.rows.slice(start, start + 4);
      const dated = t.dateCol >= 0 ? 'Dated ' + row[t.dateCol] + ', 2026' : 'Read ' + D.asOf;
      const head = '<tr>' + t.cols.map((c, ci) => '<th' + (isNum(t.rows[0][ci]) ? ' class="r"' : '') + '>' + c + '</th>').join('') + '</tr>';
      const body = win.map((rw) => '<tr' + (rw === row ? ' class="hit"' : '') + '>' + rw.map((c, ci) => {
        const cls = [isNum(c) ? 'r' : '', rw === row && ci === r.col ? 'key' : ''].filter(Boolean).join(' ');
        const txt = ci === 0 ? Number(c).toLocaleString('en-US') : c;
        return '<td' + (cls ? ' class="' + cls + '"' : '') + (t.cols[ci] === 'Line' ? ' style="white-space:normal;min-width:190px"' : '') + '>' + txt + '</td>';
      }).join('') + '</tr>').join('');
      return '<div class="ln-meta rise" style="--d:0"><button class="ln-back" type="button">&#8592; ' + f.total + '</button><span class="c sys">' + t.sys + '</span><span class="c">' + t.file + '</span><span class="c">Row ' + Number(row[0]).toLocaleString('en-US') + '</span><span>' + dated + '</span></div>' +
        '<div class="ln-wrap rise" style="--d:2"><table class="ln"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>' +
        '<p class="ln-note rise" style="--d:4">Quoted exactly as written in the record. Arthur reads this system and does not change it.</p>';
    }
    openFig(fk, back, inst) {
      this.cur = fk; this.view = 'list'; this.setExpanded(fk);
      morph(this.dr, this.listHTML(fk, !back), null, inst);
    }
    openLine(fk, i, inst) { this.cur = fk; this.view = 'line'; morph(this.dr, this.lineHTML(fk, i), null, inst); }
    close() { this.cur = null; this.setExpanded(null); morph(this.dr, '', 'close'); }
    stopAuto() { this.tok++; }
    async autoplay(plan) {
      const t = ++this.tok; const ok = () => t === this.tok;
      const fig = $('.fig[data-f="' + plan.fig + '"]', this.el);
      await sleep(plan.start || 1200); if (!ok()) return;
      fig.classList.add('pulse'); await sleep(700); if (!ok()) return;
      this.openFig(plan.fig); await sleep(2100); if (!ok()) return;
      this.openLine(plan.fig, plan.rec); await sleep(3400); if (!ok()) return;
      this.openFig(plan.fig, true);
    }
    async play() { // question types in, the answer arrives, the figures pulse
      const t = ++this.tok; const ok = () => t === this.tok;
      const qt = $('.ak-qt', this.el), lk = $('.ak-looked', this.el), an = $('.ak-a', this.el), sr = $('.ak-src', this.el);
      const q = this.s.q, lkHTML = lk.innerHTML;
      an.classList.add('pending'); sr.classList.add('pending');
      lk.innerHTML = '&nbsp;';
      qt.innerHTML = '<span class="tt"></span><span class="caret"></span>';
      const tt = $('.tt', qt);
      for (let i = 1; i <= q.length; i++) { tt.textContent = q.slice(0, i); await sleep(i % 5 ? 22 : 38); if (!ok()) return; }
      qt.textContent = q;
      lk.textContent = 'Looking in ' + this.s.looked + '...'; await sleep(560); if (!ok()) return;
      lk.innerHTML = lkHTML;
      an.classList.remove('pending'); an.classList.add('rise'); sr.classList.remove('pending'); sr.classList.add('rise');
      await sleep(900); if (!ok()) return;
      $$('.fig', this.el).forEach((b, i) => setTimeout(() => ok() && b.classList.add('pulse'), i * 180));
    }
  }

  /* ---------- hero ---------- */
  const hero = new Ask($('#heroAsk'), 'pro', { sidebar: true });
  if (calm) hero.openFig('a'); else hero.autoplay({ fig: 'a', rec: 4, start: 1300 });
  $('#hintFig').addEventListener('click', () => { hero.stopAuto(); hero.hover = false; hero.openFig('a'); });

  /* ---------- stage: the same answer with its source line open ---------- */
  const stageUI = new Ask($('#stageAsk'), 'pro', { sidebar: false });
  stageUI.openFig('a', false, true);
  stageUI.openLine('a', 4, true);

  /* ---------- tabs ---------- */
  const tabEl = $('#tabAsk');
  const tabs = $$('.tab');
  const tabUI = new Ask(tabEl, 'edu', { sidebar: false });
  let tabKey = 'edu';
  const showPhoto = (k) => $$('.tp').forEach((p) => p.classList.toggle('on', p.dataset.k === k));
  showPhoto('edu');
  if (calm) tabUI.openFig('a');
  function selectTab(k, focus) {
    if (k === tabKey) return;
    tabKey = k;
    tabs.forEach((b) => { const on = b.dataset.k === k; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on) { tabEl.setAttribute('aria-labelledby', b.id); if (focus) b.focus(); } });
    showPhoto(k);
    tabUI.mount(k);
    if (calm) tabUI.openFig('a'); else tabUI.play();
  }
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => selectTab(b.dataset.k));
    b.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (d) { e.preventDefault(); selectTab(tabs[(i + d + tabs.length) % tabs.length].dataset.k, true); }
    });
  });
  if (!calm && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { io.disconnect(); if (tabKey === 'edu' && !tabUI.cur) tabUI.play(); } }, { threshold: 0.45 });
    io.observe(tabEl);
  }

  /* ---------- five checks ---------- */
  const CK = {
    names: { i: 0, t: 'Three systems, one client', s: 'The same client is written three ways.', rows: [['Timesheets, Project tracker, Billing', 'Ostrander Group', 1], ['Mailbox', 'Dana Ostrander'], ['Pell & Marrow', 'a different client']], f: 'Joined into one client, so its $16,250 is counted once.' },
    sources: { i: 1, t: 'Every figure keeps its record', s: 'Open any figure and you land on the line.', rows: [['Timesheets, row 2,102', '$9,450'], ['Project tracker, rows 312 and 313', '$18,400'], ['Timesheets, row 2,101', '$6,650'], ['Mailbox, message 88,412', '$6,800'], ['Five records', '$41,300', 1]], f: 'A figure with no record behind it is held back.' },
    history: { i: 2, t: 'What you knew, and when', s: 'This answer is as of Nov 3.', rows: [['Today, Nov 3', '38 days', 1], ['On Oct 31', '35 days'], ['Last hours logged', 'Sep 26']], f: 'You can look back at a decision with what you knew at the time.' },
    checks: { i: 3, t: 'Checked before it is said', s: 'The pieces add up to the number in the answer.', rows: [['Q3 reporting support', '$9,450'], ['Change request 7', '$6,800'], ['Owed by Ostrander Group', '$16,250', 1]], f: 'Matches the answer. A number that did not match would be held back.' },
    changes: { i: 4, t: 'Told when something moves', s: 'Harlow Dental became billable on Oct 9.', rows: [['Oct 9', 'Phase 2 build accepted', 1], ['Oct 20', 'Sign-off email arrived'], ['Today', 'Flagged to Priya']], f: 'When a fact behind a decision changes, it comes back to you.' }
  };
  const ckBtns = $$('.ck'), ckEv = $('#ckEv'), ckAns = $('#ckAns'), ckPipe = $('.ck-pipe');
  let ckCur = null;
  function selectCheck(c, first) {
    if (c === ckCur) return;
    ckCur = c; const d = CK[c];
    ckBtns.forEach((b) => { b.setAttribute('aria-pressed', String(b.dataset.c === c)); b.classList.toggle('done', CK[b.dataset.c].i < d.i); });
    ckPipe.style.setProperty('--p', d.i * 25 + '%');
    ckAns.classList.add('has-sel');
    $$('.cs', ckAns).forEach((x) => x.classList.toggle('on', x.dataset.c === c));
    ckEv.innerHTML = '<div class="ev-t">' + d.t + '</div><div class="ev-s">' + d.s + '</div>' +
      d.rows.map((r, n) => '<div class="ev-r' + (r[2] ? ' hi' : '') + (first || calm ? '' : ' rise') + '" style="--d:' + n + '"><span>' + r[0] + '</span><span>' + r[1] + '</span></div>').join('') +
      '<div class="ev-f' + (first || calm ? '' : ' rise') + '" style="--d:' + d.rows.length + '">' + d.f + '</div>';
  }
  ckBtns.forEach((b) => b.addEventListener('click', () => selectCheck(b.dataset.c)));
  $$('.cs', ckAns).forEach((x) => x.addEventListener('click', () => selectCheck(x.dataset.c)));
  selectCheck('sources', true);

  /* ---------- industries rail ---------- */

  /* ---------- the dark stage ---------- */
  const steps = $$('.st-steps li');
  const lightSteps = (n) => steps.forEach((li, i) => li.classList.toggle('on', i <= n));
  if (calm) lightSteps(2);
  else lightSteps(-1);
  if (window.gsap && window.ScrollTrigger && !calm) {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(min-width:1021px)', () => {
      gsap.set('.s-ask', { y: 70, opacity: 0 });
      gsap.set('.s-sig', { x: 150, opacity: 0 });
      gsap.set('.s-chip', { y: 30, opacity: 0, scale: 0.94 });
      gsap.set('.s-ws', { y: 110, opacity: 0 });
      gsap.set('.s-dec', { y: 40, opacity: 0, scale: 0.95 });
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: '.stage', start: 'top+=96 70%', end: 'bottom bottom', scrub: 0.7, onUpdate: (st) => lightSteps(st.progress < 0.3 ? 0 : st.progress < 0.62 ? 1 : 2) }
      });
      tl.to('.s-ask', { y: 0, opacity: 1, duration: 0.2 }, 0.0)
        .to('.s-sig', { x: 0, opacity: 1, duration: 0.18 }, 0.32)
        .to('.s-chip', { y: 0, opacity: 1, scale: 1, duration: 0.14 }, 0.4)
        .to('.s-ws', { y: 0, opacity: 1, duration: 0.18 }, 0.64)
        .to('.s-dec', { y: 0, opacity: 1, scale: 1, duration: 0.14 }, 0.72)
        .to({}, { duration: 0.1 }, 0.9);
      return () => { gsap.set('.s-ask,.s-sig,.s-ws,.s-chip,.s-dec', { clearProps: 'all' }); };
    });
    mm.add('(max-width:1020px)', () => {
      steps.forEach((li) => li.classList.add('on'));
      ['.s-ask', '.s-chip', '.s-sig', '.s-dec', '.s-ws'].forEach((sel, i) => {
        gsap.from(sel, { y: 46, opacity: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.08, scrollTrigger: { trigger: '.st-panels', start: 'top 80%', once: true } });
      });
    });
  }

  /* ---------- show the work ---------- */
  const notes = $$('[data-note]').map((el) => {
    const [tag, text] = el.dataset.note.split('|');
    const n = document.createElement('div');
    n.className = 'xnote';
    n.innerHTML = '<div class="xnote-in"><div class="xnote-b"><b>' + tag + '</b><p>' + text + '</p></div></div>';
    (el.closest('.ind-head,.ck-head') || el).after(n);
    return n;
  });
  $$('.xs[data-xr]').forEach((sec) => {
    const host = $('.stage-pin', sec) || sec;
    const tag = document.createElement('span');
    tag.className = 'xtag'; tag.textContent = sec.dataset.xr;
    host.appendChild(tag);
    if (host !== sec && getComputedStyle(host).position === 'static') host.style.position = 'relative';
  });
  const pill = $('#xr'), layer = $('#xrLayer');
  const mqM = matchMedia('(max-width:1020px)');
  const placePill = () => {
    const bar = $('.gh-bar');
    if (!bar) return;
    if (mqM.matches) bar.insertBefore(pill, $('.gh-toggle', bar));
    else { const act = $('.gh-actions', bar); if (act) act.insertBefore(pill, act.firstChild); }
  };
  placePill();
  mqM.addEventListener('change', placePill);
  function setX(on) {
    const r = pill.getBoundingClientRect();
    layer.style.setProperty('--x', r.left + r.width / 2 + 'px');
    layer.style.setProperty('--y', r.top + r.height / 2 + 'px');
    if (on) {
      notes.map((n) => ({ n, d: Math.abs(n.getBoundingClientRect().top - innerHeight / 2) })).sort((a, b) => a.d - b.d)
        .forEach((o, i) => o.n.style.setProperty('--xd', 0.3 + Math.min(i, 8) * 0.08 + 's'));
    } else notes.forEach((n) => n.style.setProperty('--xd', '0s'));
    root.classList.toggle('xray', on);
    pill.setAttribute('aria-checked', String(on));
  }
  pill.addEventListener('click', () => setX(pill.getAttribute('aria-checked') !== 'true'));
  if (qs.get('xray') === '1') setX(true);
  if (STATIC && qs.get('xray') !== '1') $('#top').classList.add('xr-on');
  if (window.ScrollTrigger) addEventListener('load', () => ScrollTrigger.refresh());
  document.addEventListener('click', (e) => { if (innerWidth > 700 || !e.isTrusted || !e.target.closest('[data-f],#hintFig')) return; setTimeout(() => { const d = (e.target.closest('section') || document).querySelector('.open'); if (d) d.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 500); });
})();
