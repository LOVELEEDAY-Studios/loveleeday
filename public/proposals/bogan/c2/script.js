const doc = document.documentElement;
if (navigator.webdriver) doc.classList.add('still');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const nav = document.querySelector('.nav');
const hasHero = !!document.querySelector('.hero,.bleed-top');
let last = 0;
const onScroll = () => {
  const y = scrollY;
  nav.classList.toggle('solid', y > innerHeight * (hasHero ? 0.8 : 0.08));
  nav.classList.toggle('hide', y > last && y > innerHeight && !nav.classList.contains('open'));
  last = y;
  if (!reduce) document.querySelectorAll('[data-drift]').forEach((im) => {
    const r = im.parentElement.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight) im.style.transform = `translate3d(0,${-(r.top / innerHeight) * 0.09 * r.height - 0.06 * r.height}px,0)`;
  });
};
addEventListener('scroll', onScroll, { passive: true }); onScroll();
document.querySelector('.menu')?.addEventListener('click', (e) => {
  const open = nav.classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', open); e.currentTarget.textContent = open ? 'Close' : 'Menu';
});

const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), { threshold: 0.12 });
document.querySelectorAll('.rv,.panel').forEach((el) => io.observe(el));

const homes = document.getElementById('plans');
if (homes) {
  const data = JSON.parse(document.getElementById('home-data').textContent);
  const dlg = document.getElementById('viewer'); const cv = dlg.querySelector('.canvas');
  const chk = document.getElementById('check');
  if (chk) {
    const ami = JSON.parse(document.getElementById('ami-data').textContent);
    chk.addEventListener('submit', (e) => {
      e.preventDefault();
      const out = document.getElementById('check-out');
      const inc = Number(chk.income.value.replace(/[^0-9.]/g, ''));
      const say = (cls, t) => { const p = document.createElement('p'); if (cls) p.className = cls; p.textContent = t; out.append(p); };
      out.replaceChildren();
      if (!inc) { say('', 'Enter your household income before taxes.'); return; }
      const pct = Math.round((inc / ami[chk.people.value]) * 100);
      say('pct', `About ${pct}% of area median income`);
      if (pct < 60) say('', 'That is below the 60% floor at Zone 32 Phase I and The B on Burdick. Lighthouse Ridge will serve 30 to 80%, measured on the Van Buren County table.');
      else if (pct <= 120) say('', 'That sits inside the 60 to 120% range at Zone 32 Phase I and The B on Burdick.');
      else say('', 'That is above the 120% ceiling at Zone 32 Phase I and The B on Burdick.');
      say('', 'Income rules for Zone 32 Phase II have not been announced.');
    });
  }
  let plans = null; let stop = null; let cur = null; const state = { community: 'all', size: 'all' };
  const cards = [...homes.querySelectorAll('.card')];
  const apply = () => {
    let n = 0;
    cards.forEach((c) => { const show = (state.community === 'all' || c.dataset.community === state.community) && (state.size === 'all' || c.dataset.size === state.size || c.dataset.size === 'all' || c.dataset.size === 'all'); c.hidden = !show; n += show; });
    document.getElementById('count').textContent = `${n} ${n === 1 ? 'layout' : 'layouts'}`;
    document.querySelectorAll('.comm').forEach((g) => { g.hidden = ![...g.querySelectorAll('.card')].some((c) => !c.hidden); });
  };
  document.querySelectorAll('.filters select').forEach((s) => s.addEventListener('change', () => { state[s.dataset.key] = s.value; apply(); }));
  let turn = 0;
  const clear = () => { turn += 1; if (stop) { stop(); stop = null; } };
  const show2d = () => { clear(); cv.classList.remove('d3'); cv.innerHTML = `<img src="assets/plans/plan-${cur.plan}.svg" alt="${cur.layout} floor plan">`; };
  const show3d = async () => {
    clear(); const mine = turn; cv.classList.add('d3'); cv.textContent = 'Loading the model';
    try {
      plans = plans || await (await fetch('assets/plans/plans.json')).json();
      const { mountPlan } = await import('./assets/plans/plan3d.js');
      if (mine === turn) stop = mountPlan(cv, plans[cur.plan]);
    } catch { if (mine === turn) mode('2d'); }
  };
  const mode = (m) => {
    dlg.querySelectorAll('.modes button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.m === m));
    dlg.querySelector('.tip').hidden = m !== '3d';
    (m === '3d' ? show3d : show2d)();
  };
  dlg.querySelectorAll('.modes button').forEach((b) => b.addEventListener('click', () => mode(b.dataset.m)));
  const open = (id) => {
    cur = data[id]; dlg.querySelector('h2').textContent = cur.layout; dlg.querySelector('.who').textContent = cur.community;
    dlg.querySelector('.kv').innerHTML = cur.rows.map(([k, v]) => `<div><span>${k}</span><span>${v}</span></div>`).join('');
    const f = dlg.querySelector('form'); f.hidden = false; f.reset(); dlg.querySelector('.ok').hidden = true;
    f.elements.community.value = cur.community; f.elements.layout.value = cur.layout;
    dlg.showModal(); mode('3d');
  };
  cards.forEach((c) => c.addEventListener('click', () => open(c.dataset.id)));
  dlg.querySelector('.close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('close', clear);
  dlg.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); e.target.hidden = true; dlg.querySelector('.ok').hidden = false; });
  apply();
}
