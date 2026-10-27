// serve.cjs <root> <port> : static server for the review copy with the production clean URLs:
// / -> /site/index.html, /how-it-works -> /site/how-it-works.html, /industries/schools -> /site/industries/schools.html.
// Form posts get a 200 "received (review copy, nothing sent)" so testers can finish a form without reaching anyone.
const http = require('http'), fs = require('fs'), path = require('path');
const [root, port] = process.argv.slice(2);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm', '.txt': 'text/plain', '.xml': 'application/xml', '.glb': 'model/gltf-binary' };
const file = f => { try { return fs.statSync(f).isFile() ? f : null; } catch { return null; } };
http.createServer((req, res) => {
  if (req.method === 'POST') { req.resume(); res.writeHead(200, { 'content-type': 'application/json' }); return res.end('{"ok":true,"note":"review copy, nothing sent"}'); }
  let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]).replace(/\/+$/, '') || '/';
  if (u.includes('..')) { res.writeHead(400); return res.end(); }
  const c = u === '/' ? ['/site/index.html'] : [u, u + '.html', u + '/index.html', '/site' + u, '/site' + u + '.html', '/site' + u + '/index.html'];
  const hit = c.map(x => file(path.join(root, x))).find(Boolean);
  if (!hit) { res.writeHead(404, { 'content-type': 'text/html' }); return res.end('<h1>404 not found</h1>'); }
  res.writeHead(200, { 'content-type': types[path.extname(hit).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(hit).pipe(res);
}).listen(+port, () => console.log('serving ' + root + ' on ' + port));
