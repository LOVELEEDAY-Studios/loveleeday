
const questions=[{q:'Who is HES, across our systems?',a:'<strong>One company. Several names.</strong><br>HES and Harbor Equipment Services resolve to the same company, alongside its vendor ID and payment customer record.',trace:'<strong>Canonical object</strong><br>Company record: Harbor Equipment Services<br>Match: “HES” → alias → company record'},{q:'What did we know before the payment?',a:'<strong>The balance was $902.58.</strong><br>The record shows that amount before payment confirmation on September 2, 2026. After confirmation, the balance becomes $0.00. Both states remain in the history.',trace:'<strong>Source: payment record</strong><br>Prior balance: $902.58 · observed September 2, 10:00<br>Payment confirmed: September 2, 12:00 · balance $0.00'},{q:'Can we publish “4,000 objects resolved”?',a:'<strong>That claim is not supported.</strong><br>The verification check finds no matching record for 4,000. The claim is withheld until evidence supports it.',trace:'<strong>Source: verification check</strong><br>UNSUPPORTED · 4,000<br>No current record holds this value, so it should not be published'}];
const $=id=>document.getElementById(id);
function selectTabs(nodes,current){nodes.forEach(b=>{const yes=b===current;b.setAttribute('aria-selected',String(yes));b.tabIndex=yes?0:-1})}
const questionsOS=[{q:'Which ordinance actually applies today?',a:'<strong>The 2023 amendment appears to replace the rule most often cited.</strong><br>Have the municipal reviewer confirm the source text before applying it. The 2019 version stays available for the history, marked as no longer in force.',trace:'<strong>Illustrative municipal example</strong><br>Provision · three versions · effective dates recorded<br>In force: 2023 amendment · superseded: 2019 text'},{q:'Where did this month\u2019s margin go?',a:'<strong>Discounts, not costs.</strong><br>What each item costs held steady, but nine items sold below target because of what was charged. Review those discounts before you change any prices.',trace:'<strong>Illustrative pricing example</strong><br>What customers paid vs cost vs target, per item<br>Nine items below target · cost unchanged'},{q:'Are these two customers the same person?',a:'<strong>Probably, and it is held for review rather than merged.</strong><br>Two records share an address and a card on file but spell the name differently. Check the match before you treat them as one customer.',trace:'<strong>Illustrative customer example</strong><br>Same: billing address, card on file<br>Differs: name spelling \u00b7 status: held for review'}];
// Each page picks its own example set: the homepage teases the core
// mechanics, the operating system page shows the trace on other material.
const questionSet=document.body.dataset.questionSet==='os'?questionsOS:questions;
const qButtons=[...document.querySelectorAll('[data-q]')];qButtons.forEach(b=>b.addEventListener('click',()=>{selectTabs(qButtons,b);const d=questionSet[Number(b.dataset.q)];$('question').textContent=d.q;$('answer').innerHTML=d.a;$('trace').innerHTML=d.trace;$('trace').hidden=true;$('evidence').setAttribute('aria-expanded','false');$('evidence').innerHTML='View the evidence';$('answer-panel').setAttribute('aria-labelledby',b.id)}));
$('evidence')?.addEventListener('click',()=>{const expanded=$('evidence').getAttribute('aria-expanded')==='true';$('trace').hidden=expanded;$('evidence').setAttribute('aria-expanded',String(!expanded));$('evidence').innerHTML=expanded?'View the evidence':'Hide the evidence'});
const layers=[['Names','Different names, one customer','A customer can be a name in your inbox, a number in your ledger and a nickname in conversation. Arthur learns they are one, so everything about them stays together.',['Inbox name','Ledger number','Nickname'],'One customer'],['Sources','Every answer has a way back','Each fact Arthur uses keeps a note of the system and record it came from. If it cannot say where something came from, it does not use it.',['System','Record','Fact'],'Traceable answer'],['History','What you knew, and when','Arthur remembers when something was true and when you found out. You can look back at a decision with what you knew at the time, without losing anything learned since.',['When it was true','When you learned it'],'The full story'],['Checks','Checked before it is said','Before an answer goes out, every number in it is checked against your records. Anything it cannot support is held back.',['Draft answer','Your records'],'Checked answer'],['Changes','Told when something changes','Arthur keeps an eye on the facts behind your decisions. When one of them changes, it brings the decision back to you.',['What you decided','What just changed'],'Flagged for you']];
const lButtons=[...document.querySelectorAll('[data-layer]')];lButtons.forEach(b=>b.addEventListener('click',()=>{selectTabs(lButtons,b);lButtons.forEach(x=>x.querySelector('.plus').textContent=x===b?'−':'+');const d=layers[Number(b.dataset.layer)];$('detail-kicker').textContent=d[0];$('detail-title').innerHTML=d[1];$('detail-copy').textContent=d[2];$('schema').innerHTML='<div class="schema-in">'+d[3].map(t=>'<span>'+t+'</span>').join('')+'</div><span class="schema-line" aria-hidden="true">→</span><div class="schema-out">'+d[4]+'</div>';$('schema').setAttribute('aria-label',d[3].join(', ')+' leads to '+d[4]);$('layer-panel').setAttribute('aria-labelledby',b.id)}));
[qButtons,lButtons].forEach(buttons=>buttons.forEach((b,i)=>b.addEventListener('keydown',e=>{const next=['ArrowRight','ArrowDown'].includes(e.key)?(i+1)%buttons.length:['ArrowLeft','ArrowUp'].includes(e.key)?(i+buttons.length-1)%buttons.length:e.key==='Home'?0:e.key==='End'?buttons.length-1:-1;if(next>=0){e.preventDefault();buttons[next].focus();buttons[next].click()}})));

const dropdowns=[...document.querySelectorAll('.nav-dropdown')];dropdowns.forEach(menu=>{menu.addEventListener('toggle',()=>{if(menu.open)dropdowns.forEach(other=>{if(other!==menu)other.open=false})});menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.open=false;if(link.dataset.goLayer!==undefined)lButtons[Number(link.dataset.goLayer)]?.click()}))});document.addEventListener('click',e=>{dropdowns.forEach(menu=>{if(!menu.contains(e.target))menu.open=false})});document.addEventListener('keydown',e=>{if(e.key==='Escape')dropdowns.forEach(menu=>{if(menu.open){menu.open=false;menu.querySelector('summary').focus()}})});

// Document register filters.
const recordFilters=[...document.querySelectorAll('[data-record-filter]')];
recordFilters.forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.recordFilter;let count=0;document.querySelectorAll('[data-record-status]').forEach(row=>{row.hidden=filter!=='all'&&row.dataset.recordStatus!==filter;if(!row.hidden)count++});recordFilters.forEach(x=>x.setAttribute('aria-pressed',String(x===button)));$('record-count').textContent=count+' demonstration record'+(count===1?'':'s')+' shown'}));
// Field-level evidence remains next to its source-derived value.
document.querySelectorAll('[data-evidence-toggle]').forEach(button=>button.addEventListener('click',()=>{const panel=$(button.dataset.evidenceToggle),open=button.getAttribute('aria-expanded')==='true';panel.hidden=open;button.setAttribute('aria-expanded',String(!open))}));
// Per-unit contribution model. A zero-revenue item has no defined margin percentage.
function calculateMargin(v){const values=[v.price,v.cost,v.discount,v.fees,v.target];if(values.some(x=>!Number.isFinite(x))||v.price<0||v.cost<0||v.fees<0||v.discount<0||v.discount>100||v.target<0||v.target>=100)return null;const revenue=v.price*(1-v.discount/100),cost=v.cost+v.fees,profit=revenue-cost;return{revenue,profit,margin:revenue>0?profit/revenue*100:null,targetPrice:v.discount===100?null:Math.ceil((cost/(1-v.target/100)/(1-v.discount/100)-1e-9)*100)/100,target:v.target}}
const marginForm=$('margin-form');
if(marginForm){const ids=['sale-price','item-cost','discount','variable-fees','target-margin'];const money=x=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(x);function updateMargin(){const values=ids.map(id=>$(id).value.trim()===''?NaN:Number($(id).value)),v=calculateMargin({price:values[0],cost:values[1],discount:values[2],fees:values[3],target:values[4]});if(!v){['margin-value','realized-value','profit-value','target-price'].forEach(id=>$(id).textContent='—');$('margin-message').textContent='Enter nonnegative amounts, a discount from 0–100%, and a target below 100%.';return}$('margin-value').textContent=v.margin===null?'—':v.margin.toFixed(1)+'%';$('realized-value').textContent=money(v.revenue);$('profit-value').textContent=money(v.profit);$('target-price').textContent=v.targetPrice===null?'Not attainable':money(v.targetPrice);$('margin-message').textContent=v.revenue===0?'Nothing was paid, so a margin percentage cannot be worked out.':v.margin<0?'This item loses money at these costs. Review the discount and costs before changing the price.':v.margin+1e-9<v.target?'At these sample inputs, this item misses the '+v.target+'% target. Review the discount and costs before changing the price.':'At these sample inputs, this item meets the '+v.target+'% target. No change needed.'}marginForm.addEventListener('input',updateMargin);marginForm.addEventListener('submit',e=>e.preventDefault());updateMargin()}
function createBrief(v){return ['LOVELEEDAY — Project brief','','Organization / project: '+v.organization,'Area of work: '+v.workType,'','THE QUESTION',v.question,'','SOURCES AND CONTEXT',v.sources||'To be defined.','','DESIRED OUTCOME',v.outcome||'To be defined.'].join('\n')}
const briefForm=$('brief-form');if(briefForm){const t0=Date.now();const params=new URLSearchParams(location.search),use=params.get('use');if(use&&[...$('work-type').options].some(x=>x.value===use))$('work-type').value=use;briefForm.addEventListener('submit',async e=>{
e.preventDefault();
if(!briefForm.reportValidity())return;
const values=Object.fromEntries(new FormData(briefForm).entries());
const text=createBrief(values);
const fb=$('brief-feedback');
const btn=briefForm.querySelector('button[type=submit]');
const label=btn.textContent;
function save(){const blob=new Blob([text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='loveleeday-project-brief.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
btn.disabled=true;btn.textContent='Sending…';fb.textContent='';
/* The endpoint is the Next app's existing contact route. It is overridable so
   the page can be hosted apart from the app, and the whole call is wrapped:
   a static copy opened from file:// has no API beside it, and the flow must
   degrade to the download rather than show a tick into a void. */
const endpoint=briefForm.dataset.endpoint||'/api/contact';
try{
const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},
 body:JSON.stringify({name:values.name,email:values.email,project_type:values.workType,details:text,website:values.website||'',elapsed:Date.now()-t0})});
if(!res.ok)throw new Error('HTTP '+res.status);
if(briefForm.dataset.download!=='off')save();
briefForm.reset();
fb.textContent=briefForm.dataset.download==='off'?'Your note is on its way. We aim to reply within one working day.':'Sent. We reply within one working day, and a copy has downloaded for your records.';
fb.className='form-feedback ok';
}catch(err){
save();
fb.innerHTML='Your brief downloaded, but it could NOT be sent from here. Email it to <a href="mailto:hello@loveleedaystudios.com">hello@loveleedaystudios.com</a> and we will pick it up.';
fb.className='form-feedback warn';
}finally{btn.disabled=false;btn.textContent=label;}
})}

/* Architecture figures start their motion when they are scrolled to, and
   stay running after -- retriggering a loop on every re-entry makes the
   page feel twitchy on a scroll back up. */
(function(){const f=[...document.querySelectorAll('.layer-fig')];if(!f.length)return;
if(!('IntersectionObserver' in window)){f.forEach(e=>e.classList.add('is-in'));return}
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){
e.target.classList.add('is-in');io.unobserve(e.target)}})},{threshold:.25});
f.forEach(e=>io.observe(e))})();

// Phone-width menu (scripts/add-mobile-menu.py): open/close the sheet, close on
// navigation, Escape, or widening past the phone breakpoint.
(()=>{const nav=document.querySelector('.nav'),btn=document.querySelector('.nav-toggle');if(!nav||!btn)return;
const set=o=>{nav.classList.toggle('menu-open',o);btn.setAttribute('aria-expanded',String(o));btn.setAttribute('aria-label',o?'Close menu':'Open menu');document.body.classList.toggle('menu-lock',o)};
btn.addEventListener('click',()=>set(!nav.classList.contains('menu-open')));
nav.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>set(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('menu-open')){set(false);btn.focus()}});
window.matchMedia('(min-width:701px)').addEventListener('change',e=>{if(e.matches)set(false)})})();

