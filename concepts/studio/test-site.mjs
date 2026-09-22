import {chromium} from 'playwright';
import fs from 'fs'; import path from 'path';
const DIR='/Users/danielmay/Projects/loveleeday/concepts/studio/site';
const pages=fs.readdirSync(DIR).filter(f=>f.endsWith('.html')).sort();
const fail=[]; const note=(page,test,msg)=>fail.push({page,test,msg});
const b=await chromium.launch({channel:'chrome',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const titles=new Map(), descs=new Map();

for(const f of pages){
  const p=await b.newPage({viewport:{width:1280,height:900}});
  const errs=[],reqfail=[];
  p.on('pageerror',e=>errs.push(e.message));
  p.on('requestfailed',r=>{if(!r.url().startsWith('data:'))reqfail.push(r.url().split('/').pop())});
  await p.goto('file://'+DIR+'/'+f,{waitUntil:'load'});
  await p.evaluate(()=>document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager'));
  // walk the page so lazy/scroll-triggered things fire
  const H=await p.evaluate(()=>document.body.scrollHeight);
  for(let y=0;y<H;y+=800){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(120);}
  await p.evaluate(()=>scrollTo(0,0)); await p.waitForTimeout(700);

  const r=await p.evaluate(()=>{
    const q=s=>[...document.querySelectorAll(s)];
    const head=document.head;
    const meta=n=>(head.querySelector(`meta[name="${n}"],meta[property="${n}"]`)||{}).content||'';
    return {
      lang:document.documentElement.lang,
      title:document.title,
      desc:meta('description'),
      canonical:(head.querySelector('link[rel=canonical]')||{}).href||'',
      ogImage:meta('og:image'), ogTitle:meta('og:title'), twCard:meta('twitter:card'),
      ld:[...head.querySelectorAll('script[type="application/ld+json"]')].map(s=>s.textContent),
      h1:q('h1').length,
      headingJumps:(()=>{let last=0,bad=[];for(const h of q('h1,h2,h3,h4')){
        const l=+h.tagName[1]; if(last&&l>last+1)bad.push(h.textContent.trim().slice(0,32)); last=l;} return bad})(),
      imgsNoAlt:q('img').filter(i=>i.getAttribute('alt')===null).map(i=>i.getAttribute('src')),
      brokenImgs:q('img').filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.getAttribute('src')),
      emptyLinks:q('a').filter(a=>!a.textContent.trim()&&!a.getAttribute('aria-label')&&!a.querySelector('img,svg')).length,
      hrefs:q('a[href]').map(a=>a.getAttribute('href')),
      ids:q('[id]').map(e=>e.id),
      inputsNoLabel:q('input,textarea,select').filter(i=>{
        if(i.type==='hidden')return false;
        return !i.labels?.length && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby')}).length,
      btnsNoName:q('button').filter(x=>!x.textContent.trim()&&!x.getAttribute('aria-label')).length,
      footerCols:q('.footer-col').length, services:q('.footer-services-grid span').length,
      deadFooter:q('.site-footer a').filter(a=>!a.getAttribute('href')||a.getAttribute('href')==='#').length,
      tabsOk:q('[role=tab]').every(t=>t.hasAttribute('aria-selected')&&t.getAttribute('aria-controls')),
      skipLink:!!document.querySelector('a.skip,a[href="#main"]'),
      mainEl:!!document.querySelector('main'),
    };
  });

  if(errs.length) note(f,'js',errs[0].slice(0,90));
  if(reqfail.length) note(f,'404',reqfail.join(', ').slice(0,90));
  if(r.brokenImgs.length) note(f,'img',`broken: ${r.brokenImgs.join(', ').slice(0,80)}`);
  if(r.imgsNoAlt.length) note(f,'a11y',`img without alt: ${r.imgsNoAlt.length}`);
  if(r.lang!=='en') note(f,'a11y',`html lang="${r.lang}"`);
  if(r.h1!==1) note(f,'seo',`${r.h1} h1 elements`);
  if(r.headingJumps.length) note(f,'a11y',`heading level jump before "${r.headingJumps[0]}"`);
  if(r.inputsNoLabel) note(f,'a11y',`${r.inputsNoLabel} unlabelled field(s)`);
  if(r.btnsNoName) note(f,'a11y',`${r.btnsNoName} button(s) with no accessible name`);
  if(r.emptyLinks) note(f,'a11y',`${r.emptyLinks} link(s) with no text`);
  if(!r.skipLink) note(f,'a11y','no skip link');
  if(!r.mainEl) note(f,'a11y','no <main>');
  if(!r.tabsOk) note(f,'a11y','a role=tab is missing aria-selected/controls');
  if(!r.canonical) note(f,'seo','no canonical');
  else if(!r.canonical.endsWith(f==='index.html'?'/':'/'+f)) note(f,'seo',`canonical mismatch: ${r.canonical}`);
  if(!r.ogImage) note(f,'seo','no og:image');
  else { const local=path.join(DIR,'assets',r.ogImage.split('/assets/')[1]||'');
         if(!fs.existsSync(local)) note(f,'seo',`og:image missing on disk: ${r.ogImage}`); }
  if(!r.ogTitle) note(f,'seo','no og:title');
  if(r.twCard!=='summary_large_image') note(f,'seo',`twitter:card="${r.twCard}"`);
  if(!r.ld.length) note(f,'seo','no structured data');
  for(const s of r.ld){ try{JSON.parse(s)}catch(e){note(f,'seo','JSON-LD does not parse')} }
  if(!r.desc) note(f,'seo','no description');
  else if(r.desc.length<60||r.desc.length>165) note(f,'seo',`description ${r.desc.length} chars`);
  if(r.title.length>65) note(f,'seo',`title ${r.title.length} chars`);
  if(titles.has(r.title)) note(f,'seo',`title duplicates ${titles.get(r.title)}`); else titles.set(r.title,f);
  if(descs.has(r.desc)) note(f,'seo',`description duplicates ${descs.get(r.desc)}`); else descs.set(r.desc,f);
  if(r.footerCols!==4) note(f,'footer',`${r.footerCols} columns`);
  if(r.services!==6) note(f,'footer',`${r.services} service items`);
  if(r.deadFooter) note(f,'footer',`${r.deadFooter} dead link(s)`);

  // links: every internal target must exist, every anchor must resolve
  for(const h of new Set(r.hrefs)){
    if(/^(https?:|mailto:|tel:)/.test(h)) continue;
    // A query string is not part of the path. Splitting only on '#' made
    // studio.html?use=Customer%20data look like a missing file, and the
    // ?use= pre-fill is real -- site.js reads it to preselect the work type,
    // verified for all four values in the browser.
    const [pathPart,frag]=h.split('#'); const file=pathPart.split('?')[0];
    if(file && !fs.existsSync(path.join(DIR,file))) note(f,'link',`dead file: ${h}`);
    if(frag && !file && !r.ids.includes(frag)) note(f,'link',`dead anchor: ${h}`);
    if(frag && file && fs.existsSync(path.join(DIR,file))){
      if(!fs.readFileSync(path.join(DIR,file),'utf8').includes(`id="${frag}"`))
        note(f,'link',`dead anchor: ${h}`);
    }
  }

  // responsive: no horizontal overflow at any breakpoint
  for(const w of [390,768,1024,1440]){
    await p.setViewportSize({width:w,height:900});
    await p.waitForTimeout(220);
    const o=await p.evaluate(()=>({over:document.documentElement.scrollWidth>window.innerWidth+1,
      by:document.documentElement.scrollWidth-window.innerWidth}));
    if(o.over) note(f,'responsive',`overflows by ${o.by}px at ${w}px`);
  }
  await p.close();
}
await b.close();

const bytes=fs.readdirSync(path.join(DIR,'assets')).map(x=>({x,s:fs.statSync(path.join(DIR,'assets',x)).size}));
const heavy=bytes.filter(b=>b.s>900*1024);
for(const h of heavy) note('assets','weight',`${h.x} is ${Math.round(h.s/1024)}KB`);
if(!fs.existsSync(path.join(DIR,'sitemap.xml'))) note('site','seo','no sitemap.xml');
if(!fs.existsSync(path.join(DIR,'robots.txt'))) note('site','seo','no robots.txt');

console.log(`\n${pages.length} pages · ${fail.length} finding(s)\n`);
const by={}; for(const x of fail)(by[x.test]??=[]).push(x);
for(const k of Object.keys(by).sort())
  for(const x of by[k]) console.log(`  [${k}] ${x.page.padEnd(30)} ${x.msg}`);
if(!fail.length) console.log('  ALL CLEAN');
