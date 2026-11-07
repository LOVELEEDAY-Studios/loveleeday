(function(){
var tabs=[].slice.call(document.querySelectorAll('.oa-t [role=tab]'));
function pick(p,id){
  [].forEach.call(p.querySelectorAll('.oa-r'),function(r){r.classList.toggle('on',r.id===id)});
  [].forEach.call(p.querySelectorAll('.fig'),function(f){f.setAttribute('aria-pressed',f.dataset.r===id?'true':'false')});
}
function show(t,focus){
  tabs.forEach(function(b){
    var on=b===t;
    b.setAttribute('aria-selected',on?'true':'false');
    if(on)b.removeAttribute('tabindex');else b.setAttribute('tabindex','-1');
    document.getElementById(b.getAttribute('aria-controls')).classList.toggle('on',on);
  });
  if(focus)t.focus();
}
tabs.forEach(function(t,i){
  t.addEventListener('click',function(){show(t)});
  t.addEventListener('keydown',function(e){
    var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;
    if(d){e.preventDefault();show(tabs[(i+d+tabs.length)%tabs.length],true)}
  });
});
[].forEach.call(document.querySelectorAll('.oa-p'),function(p){
  var figs=p.querySelectorAll('.fig');
  if(figs[0])pick(p,figs[0].dataset.r);
  [].forEach.call(figs,function(f){f.addEventListener('click',function(){pick(p,f.dataset.r)})});
});
})();
