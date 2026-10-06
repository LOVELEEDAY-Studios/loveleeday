// Header behavior for the shared site chrome (src/site-chrome/header.html). Menus are <details> so they work
// without JS; this adds one-open-at-a-time, close on outside click and Escape, and the mobile sheet toggle.
(() => {
  const nav = document.querySelector('.gh');
  if (!nav) return;
  const items = [...nav.querySelectorAll('.gh-item')];
  const btn = nav.querySelector('.gh-toggle');
  const closeAll = (except) => items.forEach((d) => { if (d !== except) d.open = false; });
  items.forEach((d) => d.addEventListener('toggle', () => { if (d.open) closeAll(d); }));
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) closeAll(); });
  const setSheet = (open) => {
    nav.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };
  btn.addEventListener('click', () => setSheet(!nav.classList.contains('menu-open')));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = items.find((d) => d.open);
    if (open) { open.open = false; open.querySelector('summary').focus(); }
    else if (nav.classList.contains('menu-open')) { setSheet(false); btn.focus(); }
  });
  // Mark the current page in the menu so screen readers and styles can see where the visitor is.
  const here = location.pathname.replace(/\/$/, '') || '/';
  nav.querySelectorAll('a[href^="/"]').forEach((a) => { if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page'); });
})();
