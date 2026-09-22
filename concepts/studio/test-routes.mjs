import {chromium} from 'playwright';
const BASE=process.env.BASE||'http://localhost:3000';
const PAGES=['/','/operating-system','/arthur','/architecture','/use-cases','/industries',
 '/municipal-review','/customer-data','/pricing-margins','/operational-intelligence',
 '/principles','/studio'];
const fails=[];
const b=await chromium.launch({channel:'chrome',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
for(const route of PAGES){
  const p=await b.newPage({viewport:{width:1280,height:900}});
  const errs=[],bad=[];
  p.on('pageerror',e=>errs.push(e.message));
  p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url().replace(BASE,''))});
  const resp=await p.goto(BASE+route,{waitUntil:'load'});
  await p.evaluate(()=>document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager'));
  await p.waitForTimeout(1300);
  const r=await p.evaluate(()=>({
    title:document.title,
    canon:(document.querySelector('link[rel=canonical]')||{}).href||'',
    css:!!getComputedStyle(document.body).backgroundColor,
    styled:getComputedStyle(document.querySelector('.site-footer')||document.body).backgroundColor,
    broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),
    imgs:document.images.length,
    mark:!!document.querySelector('.brand svg'),
    footerCols:document.querySelectorAll('.footer-col').length,
    dotHtml:[...document.querySelectorAll('a[href$=".html"]')].length}));
  const st=resp.status();
  if(st!==200)fails.push(`${route} -> HTTP ${st}`);
  if(errs.length)fails.push(`${route} -> js: ${errs[0].slice(0,60)}`);
  if(bad.length)fails.push(`${route} -> subresource ${bad.slice(0,2).join(', ')}`);
  if(r.broken.length)fails.push(`${route} -> broken img ${r.broken[0].replace(BASE,'')}`);
  if(r.styled==='rgba(0, 0, 0, 0)')fails.push(`${route} -> footer unstyled (css did not load)`);
  if(r.footerCols!==4)fails.push(`${route} -> ${r.footerCols} footer columns`);
  if(!r.mark)fails.push(`${route} -> no brand mark`);
  if(r.dotHtml)fails.push(`${route} -> ${r.dotHtml} link(s) still end in .html`);
  const want=route==='/'?'/':route;
  if(!r.canon.endsWith(want))fails.push(`${route} -> canonical ${r.canon}`);
  console.log(`  ${st} ${route.padEnd(30)} imgs:${String(r.imgs).padEnd(3)} ${r.title.slice(0,44)}`);
  await p.close();
}
// the things that must survive the cutover
for(const [route,expect] of [['/api/contact',405],['/sitemap.xml',200],['/robots.txt',200],['/work',200]]){
  // An API route is checked with a request, not a navigation: a 405 with no
  // body aborts the navigation and reports HTTP 0, which looks like an outage.
  const p=await b.newPage();
  const resp=await p.request.get(BASE+route).catch(()=>null);
  const st=resp?resp.status():0;
  const ok=route==='/api/contact'?(st===405||st===400||st===200):st===expect;
  console.log(`  ${st} ${route.padEnd(30)} ${ok?'':'*** expected '+expect+' ***'}`);
  if(!ok)fails.push(`${route} -> HTTP ${st}, expected ${expect}`);
  await p.close();
}
// redirects
for(const [from,to] of [['/about','/studio'],['/contact','/studio']]){
  const p=await b.newPage();
  await p.goto(BASE+from,{waitUntil:'load'}).catch(()=>null);
  const landed=new URL(p.url()).pathname;
  console.log(`  ${from} -> ${landed} ${landed===to?'':'*** expected '+to+' ***'}`);
  if(landed!==to)fails.push(`${from} redirected to ${landed}, expected ${to}`);
  await p.close();
}
await b.close();
console.log(fails.length?`\n${fails.length} FAILURE(S)\n  `+fails.join('\n  '):'\nALL ROUTES OK');
process.exit(fails.length?1:0);
