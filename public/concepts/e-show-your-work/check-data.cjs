const fs = require('fs'), vm = require('vm');
const w = {}; vm.runInNewContext(fs.readFileSync(__dirname + '/data.js', 'utf8'), { window: w });
let bad = 0;
const num = (s) => typeof s === 'number' ? s : Number(String(s).replace(/[$,]/g, ''));
for (const [k, s] of Object.entries(w.LL_DATA.sets)) {
  for (const [fk, f] of Object.entries(s.figs)) {
    if (f.txt || f.days) continue;
    const sum = f.recs.reduce((a, r) => a + r.v, 0);
    const shown = num(f.total);
    const ok = sum === f.sum && sum === shown;
    if (!ok) { bad++; console.log('MISMATCH', k, fk, sum, f.sum, shown); }
    for (const r of f.recs) if (r.t) {
      const t = s.tables[r.t]; const row = t.rows.find((x) => x[0] === r.r);
      if (!row) { bad++; console.log('NO ROW', k, fk, r.t, r.r); continue; }
      if (r.col != null && typeof r.v === 'number' && !(Math.abs(num(row[r.col])) === Math.abs(r.v) || String(row[r.col]).includes(Math.abs(r.v).toLocaleString('en-US')))) { bad++; console.log('CELL', k, fk, r.t, r.r, row[r.col], r.v); }
    }
  }
}
// invoiced-amount cross check for the hero rows
const p = w.LL_DATA.sets.pro.tables;
console.log(num(p.ts.rows[3][5]) === 9450, num(p.ts.rows[2][5]) === 6650, 54 * 175 === 9450, 38 * 175 === 6650);
console.log(bad ? 'FAIL ' + bad : 'all figures equal the sum of their records');
