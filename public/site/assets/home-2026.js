/* Home page: the Arthur band. Cycles the four branch prompts and their answer line.
   Motion is the brain drift (CSS) and an auto-advance every 6 seconds; both stop with "Pause motion" and never start
   for visitors who ask for reduced motion. "Next question" always works. */
(() => {
  const root = document.querySelector('[data-brain]');
  if (!root) return;
  const steps = [...root.querySelectorAll('[data-step]')].sort((a, b) => Number(a.dataset.step) - Number(b.dataset.step));
  const ans = root.querySelector('[data-ans]');
  const ev = root.querySelector('[data-ev]');
  const next = root.querySelector('[data-next]');
  const pause = root.querySelector('[data-pause]');
  const copy = [
    ['One company, connected across its different names.', 'Example: two names matched to one company record'],
    ['Every record that belongs to it, in one place.', 'Example: invoices, tickets and contracts tied to the company'],
    ['Each fact carries the record it came from.', 'Example: a figure followed back to its source line'],
    ['A figure is checked against its record before you rely on it.', 'Example: a number with no source held back']
  ];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let i = 0, paused = reduce.matches, timer = null;
  const show = (n) => {
    i = (n + steps.length) % steps.length;
    steps.forEach((s, k) => s.classList.toggle('on', k === i));
    ans.textContent = copy[i][0];
    ev.textContent = copy[i][1];
  };
  const stop = () => { clearInterval(timer); timer = null; };
  const start = () => { stop(); if (!paused && !reduce.matches) timer = setInterval(() => show(i + 1), 6000); };
  const setPaused = (p) => {
    paused = p;
    root.classList.toggle('is-paused', p);
    pause.setAttribute('aria-pressed', String(p));
    pause.textContent = p ? 'Resume motion' : 'Pause motion';
    start();
  };
  next.addEventListener('click', () => { show(i + 1); start(); });
  pause.addEventListener('click', () => setPaused(!paused));
  reduce.addEventListener?.('change', (e) => { if (e.matches) setPaused(true); });
  if (reduce.matches) { root.classList.add('is-paused'); pause.setAttribute('aria-pressed', 'true'); pause.textContent = 'Resume motion'; }
  // Only run while the band is on screen.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? start() : stop())), { threshold: 0.2 }).observe(root);
  } else start();
})();
