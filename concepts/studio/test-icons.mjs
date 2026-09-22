import {chromium} from 'playwright';
const BASE=process.env.BASE||'http://localhost:3000';
const b=await chromium.launch({channel:'chrome'});
const p=await b.newPage();
const fails=[];
// The files themselves
for(const [u,type] of [['/favicon.ico','image/'],['/icon.svg','image/svg'],
  ['/apple-icon.png','image/png'],['/site/assets/icon.svg','image/svg'],
  ['/site/assets/favicon-32.png','image/png'],['/site/assets/apple-icon.png','image/png']]){
  const r=await p.request.get(BASE+u).catch(()=>null);
  const st=r?r.status():0, ct=r?(r.headers()['content-type']||''):'';
  const ok=st===200&&ct.includes(type);
  console.log(`  ${st} ${u.padEnd(32)} ${ct.split(';')[0]} ${ok?'':'*** expected '+type+' ***'}`);
  if(!ok)fails.push(`${u} -> ${st} ${ct}`);
}
// The tags each page actually emits
for(const route of ['/','/architecture','/studio','/work']){
  await p.goto(BASE+route,{waitUntil:'load'});
  const icons=await p.evaluate(()=>[...document.querySelectorAll('link[rel*=icon]')]
    .map(l=>`${l.getAttribute('rel')}:${l.getAttribute('href')}`));
  console.log(`  ${route.padEnd(16)} ${icons.length} icon tag(s)  ${icons.join('  ')||'(relies on /favicon.ico fallback)'}`);
  if(!icons.length&&route!=='/work')fails.push(`${route} emits no icon tags`);
  // every icon href must actually resolve
  for(const i of icons){
    const href=i.split(':').slice(1).join(':');
    const r=await p.request.get(new URL(href,BASE).toString()).catch(()=>null);
    if(!r||r.status()!==200)fails.push(`${route} icon ${href} -> ${r?r.status():0}`);
  }
}
await b.close();
console.log(fails.length?`\n${fails.length} FAILURE(S)\n  `+fails.join('\n  '):'\nICONS OK');
process.exit(fails.length?1:0);
