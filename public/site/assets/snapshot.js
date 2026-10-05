/* Free snapshot page. Talks to the portal's anonymous API. Every value that came from the visitor's file is written with
   textContent, never innerHTML, so a hostile cell cannot run script on this page. */
(function () {
  'use strict';
  var PORTAL = 'https://portal.loveleedaystudios.com';
  var q = new URLSearchParams(location.search);
  var override = q.get('api');
  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var API = (local && override && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(override) ? override : PORTAL) + '/api/public/snapshot';
  var $ = function (id) { return document.getElementById(id); };
  var state = { id: null, view: null };

  function el(tag, opts, kids) {
    var n = document.createElement(tag);
    opts = opts || {};
    if (opts.cls) n.className = opts.cls;
    if (opts.text != null) n.textContent = opts.text;
    if (opts.attrs) for (var k in opts.attrs) n.setAttribute(k, opts.attrs[k]);
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); return n; }
  var usd = function (n) { return '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 }); };
  var usd2 = function (n) { return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var num = function (n) { return Number(n).toLocaleString('en-US'); };
  var pct = function (n) { return n == null ? 'n/a' : (n > 0 ? '+' : '') + Number(n).toFixed(1) + '%'; };

  function show(step) {
    ['step-upload', 'step-map', 'step-result'].forEach(function (id) { $(id).hidden = id !== step; });
    var top = $('snapshot-app'); if (top && top.scrollIntoView) top.scrollIntoView({ block: 'start', behavior: 'auto' });
  }
  function msg(id, text, bad) {
    var m = $(id); if (!text) { m.hidden = true; return; }
    m.textContent = text; m.className = 'snap-msg' + (bad ? ' bad' : ''); m.hidden = false;
  }
  function busy(on, label) {
    ['try-sample', 'run-checks'].forEach(function (id) { var b = $(id); if (b) b.disabled = on; });
    if (on) msg('upload-msg', label || 'Working...', false);
  }

  function api(path, opts) {
    return fetch(API + path, opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) { var e = new Error(j.error || ('Request failed (' + r.status + ')')); e.status = r.status; throw e; }
        return j;
      });
    }, function () { throw new Error('Could not reach the snapshot service. Check your connection and try again.'); });
  }

  /* ---- step 1: upload ---- */
  function sendFile(file) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { msg('upload-msg', 'That file is larger than 10 MB.', true); return; }
    var fd = new FormData(); fd.append('file', file);
    busy(true, 'Reading ' + file.name + '...');
    api('', { method: 'POST', body: fd }).then(function (d) { busy(false); msg('upload-msg', ''); showMap(d); })
      .catch(function (e) { busy(false); msg('upload-msg', e.message, true); });
  }
  function trySample() {
    var fd = new FormData(); fd.append('sample', '1');
    busy(true, 'Loading the synthetic sample...');
    api('', { method: 'POST', body: fd }).then(function (d) {
      var m = {}; Object.keys(d.mapping).forEach(function (f) { m[f] = d.mapping[f].column; });
      state.id = d.id;
      return api('/' + d.id, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mapping: m }) }).then(function () { return api('/' + d.id); });
    }).then(function (v) { busy(false); msg('upload-msg', ''); showResult(v); })
      .catch(function (e) { busy(false); msg('upload-msg', e.message, true); });
  }

  /* ---- step 2: confirm columns ---- */
  function confidenceCell(m) {
    if (!m) return el('span', { cls: 'pill', text: 'not found' });
    var cls = m.source === 'user' ? 'info' : m.confidence >= 0.8 ? 'good' : m.confidence >= 0.5 ? 'wait' : 'bad';
    var label = m.source === 'llm' ? 'suggested by model' : m.source === 'user' ? 'chosen by you' : m.confidence >= 0.8 ? 'strong match' : m.confidence >= 0.5 ? 'likely' : 'weak match';
    return el('div', null, [el('span', { cls: 'pill ' + cls, text: label }), m.reason && m.source !== 'llm' && m.source !== 'user' ? el('small', { text: m.reason }) : null]);
  }
  function showMap(d) {
    state.id = d.id; state.view = d;
    $('map-file').textContent = (d.filename || 'your file') + ' - ' + num(d.rows_total) + ' rows';
    var llm = d.llm || {};
    $('map-llm').textContent = llm.used ? 'Some columns were suggested by a language model from the header and a few sample values. They are marked, and you can change them.'
      : (llm.error ? 'Matched by header and value shape. ' + llm.error + '.' : 'Matched by header and value shape.');
    var body = clear($('map-rows'));
    d.fields.forEach(function (f) {
      var sel = el('select', { attrs: { 'data-field': f.id, 'aria-label': f.label } });
      sel.appendChild(el('option', { text: 'Not in my file', attrs: { value: '' } }));
      d.header.forEach(function (h) { if (h) sel.appendChild(el('option', { text: h, attrs: { value: h } })); });
      var cur = d.mapping[f.id]; if (cur) sel.value = cur.column;
      var cell = el('td', null, [sel]); var conf = el('td'); conf.appendChild(confidenceCell(cur));
      sel.addEventListener('change', function () { clear(conf).appendChild(confidenceCell(sel.value ? { source: 'user', confidence: 1 } : null)); });
      var label = el('td', null, [el('b', { text: f.label }), f.required ? el('span', { cls: 'snap-req', text: '*', attrs: { title: 'required' } }) : null]);
      body.appendChild(el('tr', null, [label, cell, conf]));
    });
    var head = clear($('prev-head')); var hr = el('tr'); d.header.forEach(function (h) { hr.appendChild(el('th', { text: h })); }); head.appendChild(hr);
    var pb = clear($('prev-rows')); (d.preview_rows || []).forEach(function (r) { var tr = el('tr'); r.forEach(function (c) { tr.appendChild(el('td', { text: c })); }); pb.appendChild(tr); });
    msg('map-msg', d.missing_required && d.missing_required.length ? 'We could not find a required column. Choose it from the lists below.' : '', true);
    show('step-map');
  }
  function runChecks() {
    var mapping = {};
    document.querySelectorAll('#map-rows select').forEach(function (s) { if (s.value) mapping[s.getAttribute('data-field')] = s.value; });
    if (!mapping.item || !mapping.price) { msg('map-msg', 'Choose the item and price columns to continue.', true); return; }
    msg('map-msg', 'Running the checks...', false); busy(true);
    api('/' + state.id, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mapping: mapping }) })
      .then(function () { return api('/' + state.id); })
      .then(function (v) { busy(false); msg('map-msg', ''); showResult(v); })
      .catch(function (e) { busy(false); msg('map-msg', e.message, true); });
  }

  /* ---- step 3: result ---- */
  var ROW_COLS = {
    below_cost: [['sku', 'Item'], ['customer_id', 'Customer'], ['price', 'Price', 'usd2'], ['current_cost', 'Cost', 'usd2'], ['gap_per_unit', 'Gap per unit', 'usd2'], ['units_t12m', 'Units, 12 mo', 'num'], ['exposure', 'Amount', 'usd2']],
    stale_price: [['sku', 'Item'], ['customer_id', 'Customer'], ['price', 'Price', 'usd2'], ['price_date', 'Price date'], ['last_sale_date', 'Last sale']],
    dead_sku: [['id', 'Item'], ['description', 'Description'], ['category', 'Category'], ['last_sale_date', 'Last sale'], ['on_hand', 'On hand', 'num']],
    duplicate_customer: [['member_names', 'Names that look alike'], ['member_addresses', 'Addresses'], ['members', 'Records', 'num'], ['price_records', 'Price records', 'num']],
    inactive_customer_prices: [['customer_name', 'Customer'], ['sku', 'Item'], ['price', 'Price', 'usd2'], ['price_date', 'Price date']],
  };
  function fmt(v, kind) {
    if (v == null || v === '') return '';
    if (Array.isArray(v)) return v.join(' | ');
    if (kind === 'usd2') return usd2(v);
    if (kind === 'num') return num(v);
    return String(v);
  }
  function rowLabel(r) { var m = /^r(\d+)$/.exec(String(r.id)); return m ? m[1] : ''; }

  function rowsTable(rule, rows) {
    var cols = ROW_COLS[rule] || [];
    var t = el('table'); var hr = el('tr'); hr.appendChild(el('th', { text: 'Row in file' }));
    cols.forEach(function (c) { hr.appendChild(el('th', { text: c[1], cls: c[2] ? 'num' : '' })); });
    t.appendChild(el('thead', null, [hr]));
    var tb = el('tbody'); t.appendChild(tb); appendRows(tb, rule, rows);
    return { table: t, body: tb };
  }
  function appendRows(tb, rule, rows) {
    var cols = ROW_COLS[rule] || [];
    rows.forEach(function (r) {
      var tr = el('tr'); tr.appendChild(el('td', { text: rowLabel(r) }));
      cols.forEach(function (c) { tr.appendChild(el('td', { text: fmt(r[c[0]], c[2]), cls: (c[2] ? 'num ' : '') + 'wrapcell' })); });
      tb.appendChild(tr);
    });
  }

  function exposureTag(ex) {
    if (ex.kind === 'loss') return el('span', { cls: 'pill bad', text: 'Loss' });
    if (ex.kind === 'exposure') return el('span', { cls: 'pill wait', text: 'Exposure, not loss' });
    return el('span', { cls: 'pill', text: 'Not quantified' });
  }
  var SEV = { critical: 'bad', high: 'bad', medium: 'wait', low: 'info' };

  function finding(f) {
    var d = el('details', { cls: 'snap-find' });
    var fig = f.exposure.kind === 'loss' && f.exposure.amount != null ? usd(f.exposure.amount) : '';
    var tail = el('div', { cls: 'tail' }, [fig ? el('span', { cls: 'fig', text: fig }) : null, f.count ? exposureTag(f.exposure) : null, el('span', { cls: 'pill ' + (SEV[f.severity] || ''), text: f.count ? f.severity : 'clear' })]);
    d.appendChild(el('summary', null, [el('div', null, [el('b', { text: f.title }), el('small', { text: num(f.count) + ' ' + f.unit + ' flagged of ' + num(f.population) + ' scanned' })]), tail]));
    var body = el('div', { cls: 'body' }); d.appendChild(body);
    var why = el('div', { cls: 'why' });
    why.appendChild(el('p', null, [el('b', { text: 'How the figure is made. ' }), f.exposure.formula]));
    why.appendChild(el('p', null, [el('b', { text: 'Basis. ' }), f.exposure.basis]));
    body.appendChild(why);
    if (f.rows.length) {
      var acts = el('div', { cls: 'acts' });
      acts.appendChild(el('a', { cls: 'btn sec sm', text: 'Export these rows as CSV', attrs: { href: API + '/' + state.id + '/export?rule=' + encodeURIComponent(f.rule), rel: 'noopener' } }));
      acts.appendChild(el('span', { cls: 'xs muted', text: 'Showing ' + num(Math.min(f.rows.length, f.rows_total)) + ' of ' + num(f.rows_total) + (f.rows_truncated ? ' (the export is capped at the first 5,000)' : '') }));
      body.appendChild(acts);
      var t = rowsTable(f.rule, f.rows); body.appendChild(el('div', { cls: 'snap-scroll' }, [t.table]));
      if (f.rows_total > f.rows.length) {
        var shown = f.rows.length; var more = el('button', { cls: 'btn sec sm more', text: 'Show more rows', attrs: { type: 'button' } });
        more.addEventListener('click', function () {
          more.disabled = true;
          api('/' + state.id + '/rows?rule=' + encodeURIComponent(f.rule) + '&offset=' + shown + '&limit=100').then(function (p) {
            appendRows(t.body, f.rule, p.rows); shown += p.rows.length; more.disabled = false;
            if (shown >= p.rows_total || !p.rows.length) more.hidden = true;
          }).catch(function () { more.disabled = false; });
        });
        body.appendChild(more);
      }
    } else body.appendChild(el('p', { cls: 'xs muted', text: 'No rows were flagged by this check.' }));
    return d;
  }

  function showResult(v) {
    state.view = v; state.id = v.id;
    var r = v.result;
    var ban = $('res-banner');
    if (v.source === 'sample') { ban.textContent = 'Synthetic sample: a fictional industrial-supplies distributor with invented customers, items and prices. Not real company data.'; ban.hidden = false; } else ban.hidden = true;

    var loss = r.findings.filter(function (f) { return f.exposure.kind === 'loss' && f.exposure.amount != null; });
    var lossTotal = loss.reduce(function (a, f) { return a + f.exposure.amount; }, 0);
    var flagged = r.findings.reduce(function (a, f) { return a + f.count; }, 0);
    var stats = clear($('res-stats'));
    function stat(label, n, d, cls) { return el('div', { cls: 'stat' }, [el('span', { cls: 'cap', text: label }), el('div', { cls: 'n', text: n }), el('div', { cls: 'd ' + (cls || ''), text: d })]); }
    stats.appendChild(stat('Integrity score', r.score.score + ' / 100', '100 minus a penalty per check, weighted by how directly it loses money.', r.score.score < 70 ? 'dn' : r.score.score < 85 ? 'w' : 'up'));
    stats.appendChild(stat('Margin loss found', loss.length ? usd(lossTotal) : 'Not quantified', loss.length ? 'Traced to specific rows, on your sales volume.' : 'No loss figure: the file has no volume to price it.', loss.length ? 'dn' : ''));
    stats.appendChild(stat('Flagged items', num(flagged), 'Across ' + r.findings.length + ' checks that could run.'));
    stats.appendChild(stat('Coverage', r.coverage.score + '%', r.coverage.basis + '.'));

    var b = clear($('res-brief'));
    b.appendChild(el('span', { cls: 'eyebrow', text: 'Executive brief' }));
    b.appendChild(el('h2', { text: v.brief.headline }));
    v.brief.paragraphs.forEach(function (p) { b.appendChild(el('p', { text: p })); });
    b.appendChild(el('p', { cls: 'xs muted', text: 'Written from templates. Every figure above is read from the computed result, not generated by a model.' }));

    var cols = clear($('res-cols'));
    var fieldLabel = {}; v.fields.forEach(function (f) { fieldLabel[f.id] = f.label; });
    v.fields.map(function (f) { return f.id; }).filter(function (f) { return r.columns_found[f]; }).forEach(function (f) {
      var c = r.columns_found[f];
      cols.appendChild(el('div', { cls: 'snap-colrow' }, [el('span', { text: fieldLabel[f] || f }), el('b', { text: c.column })]));
    });
    if (r.columns_missing.length) cols.appendChild(el('p', { cls: 'snap-miss', text: 'Not found in your file: ' + r.columns_missing.map(function (m) { return m.label.toLowerCase(); }).join(', ') + '.' }));
    var iss = r.row_issues.total ? num(r.row_issues.total) + ' cells could not be used and were left out, for example row ' + r.row_issues.first[0].row + ': ' + r.row_issues.first[0].problem + '. ' : '';
    $('res-issues').textContent = num(r.rows_used) + ' of ' + num(r.rows_total) + ' rows were used. ' + iss + r.notes.join(' ');

    var cov = clear($('res-cov'));
    cov.appendChild(el('div', { cls: 'bar' + (r.coverage.score >= 75 ? ' good' : r.coverage.score >= 40 ? ' wait' : ' bad'), attrs: { role: 'img', 'aria-label': 'Coverage ' + r.coverage.score + ' percent' } }, [el('i', { attrs: { style: 'width:' + r.coverage.score + '%' } })]));
    cov.appendChild(el('p', { cls: 'xs muted', text: r.coverage.basis + '.', attrs: { style: 'margin:8px 0 6px' } }));
    r.coverage.blocked.forEach(function (c) {
      var n = el('div', { cls: 'snap-blocked' }, [el('b', { text: c.title }), el('small', { text: 'Needs ' + c.missing.join(' and ') + '. Unlocks: ' + c.unlocks + '.' }), el('small', { text: c.how })]);
      cov.appendChild(n);
    });

    var fl = clear($('res-findings')); r.findings.forEach(function (f) { fl.appendChild(finding(f)); });
    var sk = clear($('res-skipped'));
    if (r.skipped.length) {
      var ul = el('ul'); r.skipped.forEach(function (s) { ul.appendChild(el('li', null, [el('b', { text: s.rule.replace(/_/g, ' ') + ': ' }), s.reason + '.'])); });
      sk.appendChild(el('div', { cls: 'snap-skip' }, [el('b', { text: 'Checks that could not run on this file' }), ul]));
    }

    renderMarket(v.market);
    $('plan-btn').hidden = !v.pricing_enabled;
    var link = location.origin + location.pathname + '#r=' + v.id;
    var rl = clear($('res-link')); rl.appendChild(document.createTextNode('Link to this result: ')); rl.appendChild(el('a', { text: link, attrs: { href: link } }));
    $('res-expiry').textContent = v.retention || '';
    try { history.replaceState(null, '', '#r=' + v.id); } catch (e) { /* hash only */ }
    show('step-result');
  }

  function renderMarket(m) {
    var box = clear($('res-market')); box.className = 'panel snap-mkt';
    box.appendChild(el('span', { cls: 'eyebrow', text: 'Market context' }));
    box.appendChild(el('h2', { cls: 'h', text: 'Public index movement beside your cost categories.', attrs: { style: 'margin-top:8px' } }));
    if (!m || m.status !== 'ok') {
      box.appendChild(el('p', { cls: 'sm muted', text: m && m.status === 'not_applicable' ? 'Not shown: ' + m.reason + '.' : 'Market data is not available right now, so nothing is shown here.', attrs: { style: 'margin-top:8px' } }));
      return;
    }
    box.appendChild(el('p', { cls: 'sm muted', text: 'These are public price indexes. They show how the market moved, not what you paid.', attrs: { style: 'margin-top:8px;max-width:640px' } }));
    function table(rows, withCat) {
      var t = el('table'); var hr = el('tr');
      (withCat ? ['Your category', 'Index', 'Latest', 'Year on year', 'Month on month'] : ['Index', 'Latest', 'Year on year', 'Month on month']).forEach(function (h, i) { hr.appendChild(el('th', { text: h, cls: i >= (withCat ? 2 : 1) ? 'num' : '' })); });
      t.appendChild(el('thead', null, [hr])); var tb = el('tbody'); t.appendChild(tb);
      rows.forEach(function (x) {
        var ix = x.index || x; var tr = el('tr');
        if (withCat) tr.appendChild(el('td', null, [el('b', { text: x.your_category }), el('span', { cls: 'sub', text: num(x.rows_in_category) + ' rows' })]));
        tr.appendChild(el('td', null, [el('b', { text: ix.title }), el('span', { cls: 'sub', text: ix.source + ', index movement, not your cost' })]));
        tr.appendChild(el('td', { cls: 'num', text: Number(ix.latest_value).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' (' + ix.latest_date + ')' }));
        tr.appendChild(el('td', { cls: 'num', text: pct(ix.yoy_pct) })); tr.appendChild(el('td', { cls: 'num', text: pct(ix.mom_pct) }));
        tb.appendChild(tr);
      });
      return el('div', { cls: 'snap-scroll', attrs: { style: 'margin-top:14px' } }, [t]);
    }
    if (m.lines.length) box.appendChild(table(m.lines, true));
    else box.appendChild(el('p', { cls: 'sm muted', text: 'None of your category names matched a tracked index.', attrs: { style: 'margin-top:12px' } }));
    if (m.context.length) { box.appendChild(el('p', { cls: 'cap', text: 'General context', attrs: { style: 'margin-top:20px' } })); box.appendChild(table(m.context, false)); }
  }

  /* ---- wiring ---- */
  var drop = $('drop');
  $('file').addEventListener('change', function (e) { sendFile(e.target.files[0]); e.target.value = ''; });
  $('try-sample').addEventListener('click', trySample);
  $('run-checks').addEventListener('click', runChecks);
  $('map-back').addEventListener('click', function () { show('step-upload'); });
  $('res-again').addEventListener('click', function () { try { history.replaceState(null, '', location.pathname); } catch (e) { /* ignore */ } show('step-upload'); });
  ['dragenter', 'dragover'].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
  ['dragleave', 'drop'].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.remove('over'); }); });
  drop.addEventListener('drop', function (e) { if (e.dataTransfer && e.dataTransfer.files[0]) sendFile(e.dataTransfer.files[0]); });

  var m = /^#r=([A-Za-z0-9_-]{32,64})$/.exec(location.hash);
  if (m) {
    msg('upload-msg', 'Loading your result...', false);
    api('/' + m[1]).then(function (v) { msg('upload-msg', ''); if (v.status === 'done') showResult(v); else showMap(v); })
      .catch(function (e) { msg('upload-msg', e.status === 404 ? 'That result has expired or does not exist. Results are kept for seven days.' : e.message, true); });
  }
})();
