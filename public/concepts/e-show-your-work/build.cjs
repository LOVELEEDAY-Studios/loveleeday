// Assembles index.html: pastes the real site header and footer from public/site/index.html into index.src.html.
const fs = require('fs'), path = require('path');
const site = fs.readFileSync(path.join(__dirname, '../../site/index.html'), 'utf8');
const mk = '<img class="mk" src="../../site/assets/icon.svg" alt="" width="24" height="24">';
const fix = (h) => h.replace(/<svg aria-hidden="true"><use href="#mark"\/><\/svg>/g, mk)
  .replace(/href="\/(?!site\/|#)([^"]*)"/g, (m, p) => {
    if (p.startsWith('http')) return m;
    if (p === '') return 'href="/"';
    const [a, h] = p.split('#');
    return 'href="/site/' + (a.startsWith('industries') ? a : a) + '.html' + (h ? '#' + h : '') + '"';
  });
const header = site.match(/<header class="nav gh">[\s\S]*?<\/header>/)[0];
const footer = site.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)[0];
let out = fs.readFileSync(path.join(__dirname, 'index.src.html'), 'utf8')
  .replace('<!--HEADER-->', fix(header)).replace('<!--FOOTER-->', fix(footer));
fs.writeFileSync(path.join(__dirname, 'index.html'), out);
console.log('index.html', out.length, 'bytes');
