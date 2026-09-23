
const questions=[{q:'Who is FES, across our systems?',a:'<strong>One company. Several names.</strong><br>FES and Fintech Equipment Services resolve to the same company, alongside its vendor ID and Stripe customer record.',trace:'<strong>Canonical object</strong><br>vendor:fintech-equipment-services<br>Match: “FES” → alias → company record'},{q:'What did we know before the payment?',a:'<strong>The balance was $902.58.</strong><br>The supplied record shows that amount before payment confirmation on September 2, 2026. After confirmation, the balance becomes $0.00. Both states remain in the history.',trace:'<strong>Source: Stripe · supplied record</strong><br>Prior balance: $902.58 · observed September 2, 10:00<br>Payment confirmed: September 2, 12:00 · balance $0.00'},{q:'Can we publish “4,000 objects resolved”?',a:'<strong>That claim is not supported.</strong><br>The supplied verification result finds no matching property for 4,000. The claim is withheld until evidence supports it.',trace:'<strong>Source: arthur-verify · supplied output</strong><br>UNSUPPORTED · 4,000<br>No live property holds this value — do not publish it'}];
const $=id=>document.getElementById(id);
function selectTabs(nodes,current){nodes.forEach(b=>{const yes=b===current;b.setAttribute('aria-selected',String(yes));b.tabIndex=yes?0:-1})}
const questionsOS=[{q:'Which ordinance actually applies today?',a:'<strong>One of three, and not the one most often cited.</strong><br>The 2019 text was superseded by a 2023 amendment. The earlier version stays in the record, marked as no longer in force.',trace:'<strong>Illustrative municipal example</strong><br>Provision · three versions · effective dates recorded<br>In force: 2023 amendment · superseded: 2019 text'},{q:'Where did this month\u2019s margin go?',a:'<strong>Discounts, not costs.</strong><br>Unit cost held steady while realized price fell below target on nine items. The gap is in what was charged, not what was paid.',trace:'<strong>Illustrative pricing example</strong><br>Realized price vs cost vs target, per item<br>Nine items below target · cost unchanged'},{q:'Are these two customers the same person?',a:'<strong>Probably \u2014 and it is flagged, not merged.</strong><br>Two records share an address and a card fingerprint but differ on name spelling. An uncertain match is held for review rather than decided silently.',trace:'<strong>Illustrative customer example</strong><br>Shared: billing address, card fingerprint<br>Differs: name spelling \u00b7 status: held for review'}];
// Each page picks its own example set: the homepage teases the core
// mechanics, the operating system page shows the trace on other material.
const questionSet=document.body.dataset.questionSet==='os'?questionsOS:questions;
const qButtons=[...document.querySelectorAll('[data-q]')];qButtons.forEach(b=>b.addEventListener('click',()=>{selectTabs(qButtons,b);const d=questionSet[Number(b.dataset.q)];$('question').textContent=d.q;$('answer').innerHTML=d.a;$('trace').innerHTML=d.trace;$('trace').hidden=true;$('evidence').setAttribute('aria-expanded','false');$('evidence').innerHTML='View the evidence <span aria-hidden="true">↗</span>';$('answer-panel').setAttribute('aria-labelledby',b.id)}));
$('evidence')?.addEventListener('click',()=>{const expanded=$('evidence').getAttribute('aria-expanded')==='true';$('trace').hidden=expanded;$('evidence').setAttribute('aria-expanded',String(!expanded));$('evidence').innerHTML=expanded?'View the evidence <span aria-hidden="true">↗</span>':'Hide the evidence <span aria-hidden="true">−</span>'});
const layers=[['The ontology layer','Different names.<br>The same understanding.','A company can have a name in your inbox, an ID in your ledger, and an alias in conversation. The object layer connects them to one identity, so context follows the company.',['FES','Vendor ID','Stripe customer'],'One company'],['The evidence layer','An answer with<br>a way back.','Every observation carries its source system and source reference. The architecture described in the supplied source refuses records without this evidence, keeping the trail intact.',['Source system','Source record','Observation'],'Traceable fact'],['The bitemporal layer','A memory that<br>keeps perspective.','Track when something was true and when it became known. Revisit a decision with the information available at that moment, while preserving everything learned since.',['True in the world','Known to the system'],'Context in time'],['The verification layer','Confidence begins<br>with evidence.','Check the figures in a claim against recorded properties. Unsupported figures are held back, so a convincing sentence does not become a substitute for a supported answer.',['Proposed claim','Recorded properties'],'Evidence check'],['The awareness layer','Attention, where<br>it matters.','Standing conditions watch the information behind a decision. When a relevant fact changes, the system brings that decision back into view.',['Standing condition','New observation'],'Change detected']];
const lButtons=[...document.querySelectorAll('[data-layer]')];lButtons.forEach(b=>b.addEventListener('click',()=>{selectTabs(lButtons,b);lButtons.forEach(x=>x.querySelector('.plus').textContent=x===b?'−':'+');const d=layers[Number(b.dataset.layer)];$('detail-kicker').textContent=d[0];$('detail-title').innerHTML=d[1];$('detail-copy').textContent=d[2];$('schema').innerHTML='<div class="schema-in">'+d[3].map(t=>'<span>'+t+'</span>').join('')+'</div><span class="schema-line" aria-hidden="true">→</span><div class="schema-out">'+d[4]+'</div>';$('schema').setAttribute('aria-label',d[3].join(', ')+' leads to '+d[4]);$('layer-panel').setAttribute('aria-labelledby',b.id)}));
[qButtons,lButtons].forEach(buttons=>buttons.forEach((b,i)=>b.addEventListener('keydown',e=>{const next=['ArrowRight','ArrowDown'].includes(e.key)?(i+1)%buttons.length:['ArrowLeft','ArrowUp'].includes(e.key)?(i+buttons.length-1)%buttons.length:e.key==='Home'?0:e.key==='End'?buttons.length-1:-1;if(next>=0){e.preventDefault();buttons[next].focus();buttons[next].click()}})));

if($('brain')) {
const brainDemos=[
{ask:'Who is FES across our systems?',questions:['Which names refer to the same company?','Which records belong to it?','Where did each observation come from?','Can we trace the answer?'],answer:'One company. Connected across its different names.',evidence:'Ontology example · alias matched to a canonical object'},
{ask:'What did we know before the payment?',questions:['Which balance was valid at the time?','When did we learn it?','When was the payment confirmed?','Has the original state been preserved?'],answer:'The balance was $902.58. After confirmation, $0.00.',evidence:'Supplied Stripe example · both states preserved in time'},
{ask:'Can we publish “4,000 objects resolved”?',questions:['What figure does the claim contain?','Which recorded property supports it?','Does the evidence match the claim?','Should the claim be held back?'],answer:'Not yet. The figure has no supporting property.',evidence:'Supplied verifier example · unsupported claim withheld'},
{"ask":"Review every ordinance and law on the municipality’s books.","questions":["Which ordinances and laws are on the books?","What was amended, repealed, or superseded?","Where do provisions conflict or leave gaps?","Which source and effective date support each finding?"],"answer":"A cited inventory of current laws, amendments, and issues to review.","evidence":"Illustrative municipal review · source citations and effective dates"},
{"ask":"Process our customer data into one reliable view.","questions":["Which records belong to the same customer?","Where is information missing, stale, or conflicting?","How do purchases and interactions connect?","Can every field be traced to its source?"],"answer":"A unified customer view, with duplicates linked and uncertain fields flagged.","evidence":"Illustrative customer data review · source records and quality checks"},
{"ask":"Review our pricing. Where are we losing margin?","questions":["What does each item actually cost to deliver?","How do discounts, returns, and fees affect margin?","Which prices fall below cost or target margin?","Which cost and price records support each flag?"],"answer":"An item-by-item margin review, with losses flagged and price changes proposed.","evidence":"Illustrative pricing review · costs, realized prices, and margin targets"}
];
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;let paused=reducedMotion,lastBrainBeat=-1,lastBrainStage=-1,inView=true;
// A page may declare which demos its brain cycles, so the homepage and the
// Arthur page do not rotate through identical text.
const brainSet=(document.body.dataset.brainSet||'').split(',')
  .filter(x=>x!=='').map(Number).filter(i=>brainDemos[i]);
const activeDemos=brainSet.length?brainSet.map(i=>brainDemos[i]):brainDemos;
function updateBrain(k,t){const n=activeDemos.length,ki=Number.isFinite(Number(k))?Math.trunc(Number(k)):0,index=((ki%n)+n)%n,stage=reducedMotion?5:t>=6?5:t>=4.5?4:t>=3.4?3:t>=2.3?2:t>=1.2?1:0;const d=activeDemos[index];if(index!==lastBrainBeat){$('brain-question').textContent=d.ask;d.questions.forEach((q,i)=>$('branch-'+i).querySelector('p').textContent=q);$('brain-result').textContent=d.answer;$('brain-evidence').textContent=d.evidence;document.querySelectorAll('[data-brain-example]').forEach(link=>link.setAttribute('aria-current',String(Number(link.dataset.brainExample)===index)));lastBrainBeat=index;lastBrainStage=-1;}if(stage!==lastBrainStage){d.questions.forEach((q,i)=>$('branch-'+i).classList.toggle('visible',stage>i));$('brain-answer').classList.toggle('visible',stage===5);lastBrainStage=stage;}}
const brain=Brain3D.mount($('brain'),{style:'lobe',labels:false,override:{oscillate:false},onFrame:updateBrain});
function setPaused(){if(paused||!inView)brain.stop();else brain.start();$('motion').textContent=paused?'Play motion ▷':'Pause motion Ⅱ';$('motion').setAttribute('aria-pressed',String(paused))}
$('motion').addEventListener('click',()=>{paused=!paused;setPaused()});$('brain-next').addEventListener('click',()=>{brain.next();if(paused)updateBrain(lastBrainBeat,7)});setPaused();
if(reducedMotion)$('motion').hidden=true;
if(window.IntersectionObserver)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;setPaused()},{threshold:.05}).observe($('arthur'));

const picks=[...document.querySelectorAll('[data-brain-example]')];picks.forEach(link=>link.addEventListener('click',e=>{e.preventDefault();brain.show(Number(link.dataset.brainExample));if(paused)updateBrain(Number(link.dataset.brainExample),7);picks.forEach(x=>x.setAttribute('aria-current',String(x===link)))}));

}
const dropdowns=[...document.querySelectorAll('.nav-dropdown')];dropdowns.forEach(menu=>{menu.addEventListener('toggle',()=>{if(menu.open)dropdowns.forEach(other=>{if(other!==menu)other.open=false})});menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.open=false;if(link.dataset.goLayer!==undefined)lButtons[Number(link.dataset.goLayer)]?.click()}))});document.addEventListener('click',e=>{dropdowns.forEach(menu=>{if(!menu.contains(e.target))menu.open=false})});document.addEventListener('keydown',e=>{if(e.key==='Escape')dropdowns.forEach(menu=>{if(menu.open){menu.open=false;menu.querySelector('summary').focus()}})});

// Document register filters.
const recordFilters=[...document.querySelectorAll('[data-record-filter]')];
recordFilters.forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.recordFilter;let count=0;document.querySelectorAll('[data-record-status]').forEach(row=>{row.hidden=filter!=='all'&&row.dataset.recordStatus!==filter;if(!row.hidden)count++});recordFilters.forEach(x=>x.setAttribute('aria-pressed',String(x===button)));$('record-count').textContent=count+' demonstration record'+(count===1?'':'s')+' shown'}));
// Field-level evidence remains next to its source-derived value.
document.querySelectorAll('[data-evidence-toggle]').forEach(button=>button.addEventListener('click',()=>{const panel=$(button.dataset.evidenceToggle),open=button.getAttribute('aria-expanded')==='true';panel.hidden=open;button.setAttribute('aria-expanded',String(!open))}));
// Per-unit contribution model. A zero-revenue item has no defined margin percentage.
function calculateMargin(v){const values=[v.price,v.cost,v.discount,v.fees,v.target];if(values.some(x=>!Number.isFinite(x))||v.price<0||v.cost<0||v.fees<0||v.discount<0||v.discount>100||v.target<0||v.target>=100)return null;const revenue=v.price*(1-v.discount/100),cost=v.cost+v.fees,profit=revenue-cost;return{revenue,profit,margin:revenue>0?profit/revenue*100:null,targetPrice:v.discount===100?null:Math.ceil((cost/(1-v.target/100)/(1-v.discount/100)-1e-9)*100)/100,target:v.target}}
const marginForm=$('margin-form');
if(marginForm){const ids=['sale-price','item-cost','discount','variable-fees','target-margin'];const money=x=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(x);function updateMargin(){const values=ids.map(id=>$(id).value.trim()===''?NaN:Number($(id).value)),v=calculateMargin({price:values[0],cost:values[1],discount:values[2],fees:values[3],target:values[4]});if(!v){['margin-value','realized-value','profit-value','target-price'].forEach(id=>$(id).textContent='—');$('margin-message').textContent='Enter nonnegative amounts, a discount from 0–100%, and a target below 100%.';return}$('margin-value').textContent=v.margin===null?'—':v.margin.toFixed(1)+'%';$('realized-value').textContent=money(v.revenue);$('profit-value').textContent=money(v.profit);$('target-price').textContent=v.targetPrice===null?'Not attainable':money(v.targetPrice);$('margin-message').textContent=v.revenue===0?'With no realized revenue, a margin percentage is undefined.':v.margin<0?'This item loses money on the entered variable costs.':v.margin+1e-9<v.target?'Below the '+v.target+'% target at these inputs.':'Meets the '+v.target+'% target at these inputs.'}marginForm.addEventListener('input',updateMargin);marginForm.addEventListener('submit',e=>e.preventDefault());updateMargin()}
function createBrief(v){return ['LOVELEEDAY — Project brief','','Organization / project: '+v.organization,'Area of work: '+v.workType,'','THE QUESTION',v.question,'','SOURCES AND CONTEXT',v.sources||'To be defined.','','DESIRED OUTCOME',v.outcome||'To be defined.','','Created locally. No inquiry has been submitted.'].join('\n')}
const briefForm=$('brief-form');if(briefForm){const params=new URLSearchParams(location.search),use=params.get('use');if(use&&[...$('work-type').options].some(x=>x.value===use))$('work-type').value=use;briefForm.addEventListener('submit',async e=>{
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
 body:JSON.stringify({name:values.name,email:values.email,project_type:values.workType,details:text})});
if(!res.ok)throw new Error('HTTP '+res.status);
save();
briefForm.reset();
fb.textContent='Sent. We reply within one working day, and a copy has downloaded for your records.';
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
