/* LOVELEEDAY — the motion library, extracted so pages can use it.

   These ten objects were built on 2026-09-21 and then sat in motion.html doing
   nothing while ten direction concepts shipped with static heroes. Daniel,
   the same day: "i dont see the motion graphics you developed that you had
   planned to run." He was right -- a library nothing imports is a demo.

   Everything below is lifted verbatim from motion.html. Each painter is a pure
   function of (ctx, W, H, t, still): no DOM, no state, so the same function
   draws the live hero and the still frame a screenshot or a
   prefers-reduced-motion visitor gets.

   mount() handles the rest: device pixel ratio, resize, an IntersectionObserver
   so an offscreen hero costs nothing, an fps throttle, and a single still frame
   when the visitor has asked for reduced motion.

     LD.mount(canvasEl, LD.s01, 30)        one object
     LD.hero(canvasEl, 'prism')            by name, with its own tuned fps

   Names: bundle lattice current aperture halftone flow series orbit contour prism
*/
(function(){
'use strict';
var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── value noise, once, for every scene that needs a field ───────────────── */
var PERM=(function(){var p=[],i,s=1337;
  for(i=0;i<256;i++)p[i]=i;
  for(i=255;i>0;i--){s=(s*1103515245+12345)&0x7fffffff;var j=s%(i+1);var t=p[i];p[i]=p[j];p[j]=t;}
  return p.concat(p);})();
function fade(t){return t*t*t*(t*(t*6-15)+10);}
function lerp(a,b,t){return a+(b-a)*t;}
function grad(h,x,y){var u=h&1?x:-x,v=h&2?y:-y;return u+v;}
function noise(x,y){
  var X=Math.floor(x)&255,Y=Math.floor(y)&255;
  x-=Math.floor(x); y-=Math.floor(y);
  var u=fade(x),v=fade(y);
  var A=PERM[X]+Y,B=PERM[X+1]+Y;
  return lerp(lerp(grad(PERM[A],x,y),grad(PERM[B],x-1,y),u),
              lerp(grad(PERM[A+1],x,y-1),grad(PERM[B+1],x-1,y-1),u),v)*0.7;
}
function fbm(x,y,o){var s=0,a=0.5,f=1;o=o||3;
  for(var i=0;i<o;i++){s+=a*noise(x*f,y*f);f*=2;a*=0.5;}return s;}

/* ── scene harness ──────────────────────────────────────────────────────── */
function mount(cv, draw, fps){
  var ctx=cv.getContext('2d'), dpr=Math.min(devicePixelRatio||1,2);
  var W=0,H=0,t0=null,last=0,run=false,started=false;
  var gap=1000/(fps||34);
  function fit(){var b=cv.getBoundingClientRect(); if(!b.width) return;
    W=b.width;H=b.height;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    /* ALWAYS paint a still frame here, not only under reduced motion.
       The animation loop is gated on an IntersectionObserver, so until a canvas
       has been scrolled into view it was sized and never drawn -- blank. That is
       invisible while you scroll a page slowly and total in a full-page
       screenshot, where every object below the fold came out empty. The still
       frame is the floor; the observer upgrades it to motion. */
    draw(ctx,W,H,18,true);}
  new ResizeObserver(fit).observe(cv);
  new IntersectionObserver(function(e){run=e[0].isIntersecting;
    if(run&&!started&&!REDUCED){started=true;frame(performance.now());}},{rootMargin:'160px'}).observe(cv);
  function frame(ts){ requestAnimationFrame(frame);
    if(!run||REDUCED){t0=null;return;}
    if(t0===null){t0=ts;last=0;}
    if(ts-t0-last<gap) return;
    last=ts-t0;
    if(W>4) draw(ctx,W,H,(ts-t0)/1000,false);
  }
  fit();
}
/* ONE GROUND FOR THE WHOLE LIBRARY.

   Each object used to clear to its own ad-hoc near-white -- #F4F4F2, #F6F8FB,
   #F7F4EE, #F7F7F5, #FBF8F2, #FFFFFF, eight values across ten objects. Drop any
   of them onto a cream page and a visible rectangle appears behind the art,
   which is exactly what happened to the hero on 2026-09-21. The page now tells
   the library what ground it is sitting on.

   s10 (Prism) is the one exception and keeps pure white on purpose: it is
   subtractive, modelled as a spectrum cast on a WHITE surface, so tinting the
   ground shifts every wavelength in it. */
var GROUND = 'transparent';
function clear(x,W,H,bg){
  /* TRANSPARENT IS THE DEFAULT, and it has to be: the page now uses four
     grounds (cream, sunk, two mesh gradients), and a canvas that paints its own
     opaque ground matches exactly one of them. It showed up as a pale rectangle
     behind the hero object the moment a gradient went in underneath it.
     Clearing to transparent lets whatever the page is do the job. */
  if (bg === '#FFFFFF_KEEP') { x.fillStyle = '#FFFFFF'; x.fillRect(0,0,W,H); return; }
  if (GROUND === 'transparent') { x.clearRect(0,0,W,H); return; }
  x.fillStyle = GROUND; x.fillRect(0,0,W,H);
}

/* ══ 01 · RESOLUTION BUNDLE ═══════════════════════════════════════════════
   Edge bundling. Many records on the left collapse onto few objects on the
   right; handles pulled apart so the bundle reads as routing, and a travelling
   tick on the active bundle so it reads as live rather than printed. */
function s01(x,W,H,t,still){
  clear(x,W,H,'#FBF8F2');
  var N=14,M=5, pad=H*0.10;
  var sy=[],i; for(i=0;i<N;i++) sy.push(pad+i*((H-pad*2)/(N-1)));
  /* Owners were contiguous blocks -- records 0,1,2 to object 0, 3,4,5 to
     object 1 -- and each object was placed at the MEAN y of its own sources.
     Between them those two choices guarantee every edge is near-horizontal
     whatever the handles do, which is the "flat comb" this function's own
     note warns about: it rendered as a bad chart rather than as routing.
     It is also the wrong claim. The records that resolve to one object are
     precisely the ones that arrived from DIFFERENT systems, so they are
     scattered through the list, not adjacent in it. Interleaving the owners
     and spreading the objects over the full height makes the edges cross,
     which is what identity resolution actually looks like. */
  var owner=[],ey=[],e; for(i=0;i<N;i++) owner.push(i%M);
  for(e=0;e<M;e++) ey.push(pad+e*((H-pad*2)/(M-1)));
  var x0=W*0.16, x1=W*0.80, span=x1-x0;
  var act = still?4:Math.floor(t/2.6)%M;
  var COL=['#0E7C7B','#A36141','#45536A'];
  for(i=0;i<N;i++){
    var on=owner[i]===act;
    x.strokeStyle=COL[i%3]; x.globalAlpha=on?0.9:0.26; x.lineWidth=on?1.5:1;
    x.beginPath(); x.moveTo(x0,sy[i]);
    x.bezierCurveTo(x0+span*0.56,sy[i],x1-span*0.22,ey[owner[i]],x1,ey[owner[i]]); x.stroke();
    x.fillStyle=COL[i%3]; x.globalAlpha=on?1:0.4;
    x.beginPath(); x.arc(x0,sy[i],on?3:2,0,7); x.fill();
    if(on&&!still){ /* one tick travelling the bundle */
      var k=((t*0.42)%1), kk=k*k*(3-2*k);
      var bx=cub(x0,x0+span*0.56,x1-span*0.22,x1,kk), by=cub(sy[i],sy[i],ey[owner[i]],ey[owner[i]],kk);
      x.fillStyle='#CF340A'; x.beginPath(); x.arc(bx,by,2.6,0,7); x.fill();
    }
  }
  x.globalAlpha=1;
  for(e=0;e<M;e++){ var hot=e===act;
    x.fillStyle=hot?'#CF340A':'#16243A'; x.globalAlpha=hot?1:0.5;
    x.beginPath(); x.arc(x1,ey[e],hot?5.5:3.6,0,7); x.fill();
    if(hot){x.globalAlpha=0.16;x.beginPath();x.arc(x1,ey[e],11+Math.sin(t*3)*2,0,7);x.fill();}
  }
  x.globalAlpha=1;
}
function cub(a,b,c,d,t){var u=1-t;return u*u*u*a+3*u*u*t*b+3*u*t*t*c+t*t*t*d;}

/* ══ 02 · LATTICE ═════════════════════════════════════════════════════════
   A 5x5x5 node lattice with axis struts, one key light, per-node Lambert and a
   specular cap, depth-sorted, sized from its true projected extent. */
function s02(x,W,H,t,still){
  clear(x,W,H,'#F4F4F2');
  var n=5,S=[],i,j,k;
  for(i=0;i<n;i++)for(j=0;j<n;j++)for(k=0;k<n;k++)
    S.push({x:(i/(n-1)-.5)*2,y:(j/(n-1)-.5)*2,z:(k/(n-1)-.5)*2,i:i,j:j,k:k});
  var cx=W/2, cy=H*0.52, R=Math.min(W*0.148,H*0.215);
  var ry=(still?1.1:t*0.24), rx=-0.32;
  var ca=Math.cos(rx),sa=Math.sin(rx),cb=Math.cos(ry),sb=Math.sin(ry);
  var L=[-.40,-.62,.68],lm=Math.hypot(L[0],L[1],L[2]);L=[L[0]/lm,L[1]/lm,L[2]/lm];
  var P=S.map(function(p){
    var X=p.x*cb+p.z*sb, Z=-p.x*sb+p.z*cb;
    var Y=p.y*ca-Z*sa; Z=p.y*sa+Z*ca;
    var s=2.6/(2.6-Z*0.45);
    return {X:cx+X*R*s,Y:cy+Y*R*s,Z:Z,i:p.i,j:p.j,k:p.k,
            nl:Math.max(0,(X*L[0]+Y*L[1]+Z*L[2])/1.74)};});
  function at(a,b,c){return P[(a*n+b)*n+c];}
  var sh=cy+R*1.95, g=x.createRadialGradient(cx,sh,2,cx,sh,R*2.1);
  g.addColorStop(0,'rgba(0,0,0,.14)');g.addColorStop(1,'rgba(0,0,0,0)');
  x.fillStyle=g;x.beginPath();x.ellipse(cx,sh,R*2,R*0.22,0,0,7);x.fill();
  var st=[];
  for(i=0;i<n;i++)for(j=0;j<n;j++)for(k=0;k<n;k++){
    if(i<n-1)st.push([at(i,j,k),at(i+1,j,k)]);
    if(j<n-1)st.push([at(i,j,k),at(i,j+1,k)]);
    if(k<n-1)st.push([at(i,j,k),at(i,j,k+1)]);}
  st.sort(function(a,b){return (a[0].Z+a[1].Z)-(b[0].Z+b[1].Z);});
  st.forEach(function(e){var d=((e[0].Z+e[1].Z)/2+1)/2;
    x.globalAlpha=0.05+0.40*d*d;x.strokeStyle='#14161A';x.lineWidth=0.5+1.4*d;
    x.beginPath();x.moveTo(e[0].X,e[0].Y);x.lineTo(e[1].X,e[1].Y);x.stroke();});
  P.slice().sort(function(a,b){return a.Z-b.Z;}).forEach(function(p){
    var d=(p.Z+1)/2, r=1.3+3.2*d;
    var corner=(p.i===0||p.i===n-1)+(p.j===0||p.j===n-1)+(p.k===0||p.k===n-1);
    x.globalAlpha=0.18+0.82*d;
    if(corner===3){x.fillStyle='#CF340A';r*=1.2;}
    else{var v=Math.round(146-116*p.nl);x.fillStyle='rgb('+v+','+v+','+(v+4)+')';}
    x.beginPath();x.arc(p.X,p.Y,r,0,7);x.fill();
    if(p.nl>0.66&&d>0.62){x.globalAlpha=(p.nl-.66)/.34*.7*d;x.fillStyle='#fff';
      x.beginPath();x.arc(p.X-r*.3,p.Y-r*.32,r*.36,0,7);x.fill();}});
  x.globalAlpha=1;
}

/* ══ 03 · CURRENT ═════════════════════════════════════════════════════════
   Curl-noise advection. 900 particles follow the perpendicular of a noise
   gradient, leaving trails drawn by fading the previous frame instead of
   clearing it -- which is what gives the long silky strokes. */
var s03p=null;
function s03(x,W,H,t,still){
  if(!s03p||s03p.W!==W){ s03p={W:W,a:[]};
    for(var i=0;i<900;i++) s03p.a.push({x:Math.random()*W,y:Math.random()*H,l:Math.random()*160}); }
  if(still){ clear(x,W,H,'#F7F4EE'); }
  else { x.fillStyle='rgba(247,244,238,.055)'; x.fillRect(0,0,W,H); }
  var sc=0.0032, steps = still?190:1;
  for(var s=0;s<steps;s++){
    s03p.a.forEach(function(p,i){
      var n1=fbm(p.x*sc,p.y*sc+t*0.045,3);
      var a=n1*Math.PI*2.4;
      var vx=Math.cos(a), vy=Math.sin(a);
      var px=p.x, py=p.y;
      p.x+=vx*1.35; p.y+=vy*1.35; p.l--;
      if(p.l<0||p.x<-6||p.x>W+6||p.y<-6||p.y>H+6){
        p.x=Math.random()*W;p.y=Math.random()*H;p.l=90+Math.random()*130;return;}
      var hot=(i%23)===0;
      x.strokeStyle=hot?'rgba(168,65,15,.62)':'rgba(78,73,64,.30)';
      x.lineWidth=hot?1.2:0.85;
      x.beginPath();x.moveTo(px,py);x.lineTo(p.x,p.y);x.stroke();
    });
  }
}

/* ══ 04 · APERTURE ═══════════════════════════════════════════════════════
   A moving mesh gradient shown only inside letterforms, via source-in
   compositing on an offscreen buffer. The type is the window. */
var s04b=null, s04m=null;
function s04(x,W,H,t,still){
  clear(x,W,H,'#FFFFFF');
  var dpr=Math.min(devicePixelRatio||1,2), bw=Math.round(W*dpr), bh=Math.round(H*dpr);
  if(!s04b){s04b=document.createElement('canvas'); s04m=document.createElement('canvas');}
  if(s04b.width!==bw){s04b.width=s04m.width=bw; s04b.height=s04m.height=bh;}

  /* The mask is built on its OWN buffer and applied in a single
     destination-in. The first version ran destination-in twice -- once per word
     -- and destination-in is not additive: the second call kept only what fell
     inside "OBJECT" of what "ONE" had already left behind, which is nothing.
     That is why this tile rendered as an empty grey box. */
  var m=s04m.getContext('2d');
  m.setTransform(dpr,0,0,dpr,0,0);
  m.globalCompositeOperation='source-over';
  m.clearRect(0,0,W,H);
  m.fillStyle='#000'; m.textAlign='center'; m.textBaseline='middle';
  /* Size from the MEASURED width of the longest word, not from a fraction of
     the canvas. "OBJECT" is six characters and was running off both edges at
     W*0.26 -- a mask that clips is a mask with a typo in it. */
  var fs=Math.min(W*0.26,H*0.40);
  m.font='800 '+fs+'px Archivo, sans-serif';
  var widest=Math.max(m.measureText('ONE').width, m.measureText('OBJECT').width);
  var fit=(W*0.88)/widest;
  if(fit<1){ fs*=fit; m.font='800 '+fs+'px Archivo, sans-serif'; }
  m.fillText('ONE',W/2,H*0.34);
  m.fillText('OBJECT',W/2,H*0.66);

  var b=s04b.getContext('2d');
  b.setTransform(dpr,0,0,dpr,0,0);
  b.globalCompositeOperation='source-over';
  b.clearRect(0,0,W,H);
  var T = still?12:t;
  [['#1D4ED8',0.00,0.62],['#0E7490',0.9,0.48],['#CF340A',1.9,0.40],['#0E7C7B',2.8,0.52]]
   .forEach(function(c){
    var px=W*(0.5+0.42*Math.sin(T*0.30+c[1])), py=H*(0.5+0.46*Math.cos(T*0.24+c[1]*1.3));
    var r=Math.max(W,H)*c[2];
    var g=b.createRadialGradient(px,py,0,px,py,r);
    g.addColorStop(0,c[0]); g.addColorStop(1,'rgba(255,255,255,0)');
    b.fillStyle=g; b.fillRect(0,0,W,H);
  });
  b.globalCompositeOperation='destination-in';
  b.setTransform(1,0,0,1,0,0);
  b.drawImage(s04m,0,0);
  b.setTransform(dpr,0,0,dpr,0,0);

  x.drawImage(s04b,0,0,W,H);
}

/* ══ 05 · HALFTONE FIELD ══════════════════════════════════════════════════
   A dot matrix whose radius is driven by a moving scalar field. The grid never
   moves; only the weight does, which is why it reads as a printed thing being
   exposed rather than as particles. */
function s05(x,W,H,t,still){
  clear(x,W,H,'#F6F8FB');
  var step=Math.max(9,W/46), T=still?9:t;
  for(var gy=step*0.6;gy<H;gy+=step) for(var gx=step*0.6;gx<W;gx+=step){
    var u=gx/W, v=gy/H;
    var f=fbm(u*2.6+T*0.13, v*2.6-T*0.09, 3);
    var d=Math.hypot(u-0.5,(v-0.5)*0.9);
    var val=f*1.5 + (0.46-d)*1.5;
    var r=Math.max(0,Math.min(1,val))*step*0.46;
    if(r<0.35) continue;
    var hot = val>0.78;
    x.fillStyle = hot?'#1D4ED8':'#0F172A';
    x.globalAlpha = hot?0.92:(0.18+0.55*Math.min(1,val));
    x.beginPath(); x.arc(gx,gy,r,0,7); x.fill();
  }
  x.globalAlpha=1;
}

/* ══ 06 · FLOW ════════════════════════════════════════════════════════════
   A Sankey. Ribbon width is the value, ribbons are stacked without gaps at
   each node, and a highlight sweeps one path at a time so you can follow a
   single flow through three stages. */
function s06(x,W,H,t,still){
  clear(x,W,H,'#FFFFFF');
  var pad=H*0.12, colW=W*0.055;
  var A=[['Payments',34],['Ledger',26],['Documents',22],['POS',18]];
  var B=[['Resolved',62],['Review',22],['Rejected',16]];
  var C=[['Reported',52],['Held',26],['Dropped',22]];
  var COL=['#0E7C7B','#A36141','#45536A','#1D4ED8'];
  function stack(list,xx){
    var tot=list.reduce(function(s,i){return s+i[1];},0), y=pad, out=[];
    list.forEach(function(it,i){ var h=(H-pad*2)*it[1]/tot;
      out.push({x:xx,y0:y,y1:y+h,h:h,n:it[0],i:i}); y+=h; });
    return out;
  }
  var SA=stack(A,W*0.10), SB=stack(B,W*0.50), SC=stack(C,W*0.90);
  var act = still?0:Math.floor(t/2.2)%A.length;
  function ribbon(a,b,col,alpha,fa,fb){
    var ay0=a.y0+a.h*fa[0], ay1=a.y0+a.h*fa[1];
    var by0=b.y0+b.h*fb[0], by1=b.y0+b.h*fb[1];
    var mx=(a.x+b.x)/2;
    x.beginPath();
    x.moveTo(a.x+colW,ay0);
    x.bezierCurveTo(mx,ay0,mx,by0,b.x,by0);
    x.lineTo(b.x,by1);
    x.bezierCurveTo(mx,by1,mx,ay1,a.x+colW,ay1);
    x.closePath(); x.globalAlpha=alpha; x.fillStyle=col; x.fill(); x.globalAlpha=1;
  }
  SA.forEach(function(a,i){
    var on=i===act;
    [[0,0.62,0],[0.62,0.86,1],[0.86,1,2]].forEach(function(seg){
      var b=SB[seg[2]];
      ribbon(a,b,COL[i],on?0.62:0.15,[seg[0],seg[1]],[i/A.length,(i+1)/A.length]);
    });
  });
  SB.forEach(function(b,i){
    [[0,0.70,0],[0.70,0.90,1],[0.90,1,2]].forEach(function(seg){
      var c=SC[seg[2]];
      ribbon(b,c,i===0?'#0E7C7B':'#45536A',i===0?0.30:0.13,[seg[0],seg[1]],[i/B.length,(i+1)/B.length]);
    });
  });
  [SA,SB,SC].forEach(function(S){ S.forEach(function(nd,i){
    x.fillStyle=(S===SA&&i===act)?'#CF340A':'#16243A';
    x.fillRect(nd.x,nd.y0,colW,nd.h-2);
    x.font='500 10px "JetBrains Mono", monospace'; x.fillStyle='#535963';
    x.textAlign = S===SC?'right':'left'; x.textBaseline='middle';
    x.fillText(nd.n.toUpperCase(), S===SC?nd.x-6:nd.x+colW+6, (nd.y0+nd.y1)/2);
  });});
}

/* ══ 07 · SERIES ══════════════════════════════════════════════════════════
   A live series: gradient area, the line drawn to a moving head, a crosshair
   locked to the head, and a tabular readout that changes with it. */
var s07d=null;
function s07(x,W,H,t,still){
  clear(x,W,H,'#FBF8F2');
  if(!s07d){ s07d=[]; var v=52;
    for(var i=0;i<160;i++){ v+=(noise(i*0.09,3.1))*9 + (Math.sin(i*0.07)*1.4); s07d.push(v); } }
  var mn=Math.min.apply(null,s07d), mx=Math.max.apply(null,s07d);
  var padL=W*0.06, padR=W*0.26, padT=H*0.16, padB=H*0.16;
  var n=s07d.length;
  var head = still ? n-1 : Math.floor(((t*0.13)%1)*(n-1));
  function px(i){return padL+(i/(n-1))*(W-padL-padR);}
  function py(i){return padT+(1-(s07d[i]-mn)/(mx-mn))*(H-padT-padB);}
  x.strokeStyle='#E6E0D6'; x.lineWidth=1;
  for(var g=0;g<=3;g++){var yy=padT+(g/3)*(H-padT-padB);
    x.beginPath();x.moveTo(padL,yy);x.lineTo(W-padR,yy);x.stroke();}
  var grd=x.createLinearGradient(0,padT,0,H-padB);
  grd.addColorStop(0,'rgba(14,124,123,.30)'); grd.addColorStop(1,'rgba(14,124,123,0)');
  x.beginPath(); x.moveTo(px(0),H-padB);
  for(var i=0;i<=head;i++) x.lineTo(px(i),py(i));
  x.lineTo(px(head),H-padB); x.closePath(); x.fillStyle=grd; x.fill();
  x.beginPath(); x.moveTo(px(0),py(0));
  for(i=1;i<=head;i++) x.lineTo(px(i),py(i));
  x.strokeStyle='#0E7C7B'; x.lineWidth=1.8; x.stroke();
  x.strokeStyle='rgba(207,52,10,.5)'; x.lineWidth=1; x.setLineDash([3,3]);
  x.beginPath(); x.moveTo(px(head),padT*0.5); x.lineTo(px(head),H-padB); x.stroke();
  x.setLineDash([]);
  x.fillStyle='#CF340A'; x.beginPath(); x.arc(px(head),py(head),4,0,7); x.fill();
  x.fillStyle='#fff'; x.beginPath(); x.arc(px(head),py(head),1.6,0,7); x.fill();
  var rx=W-padR+14;
  x.textAlign='left'; x.textBaseline='middle';
  x.font='500 10px "JetBrains Mono", monospace'; x.fillStyle='#7D838C';
  x.fillText('OBSERVED', rx, padT+2);
  x.font='700 '+Math.round(Math.min(W*0.052,26))+'px Archivo, sans-serif'; x.fillStyle='#16243A';
  x.fillText(s07d[head].toFixed(1), rx, padT+24);
  x.font='400 10px "JetBrains Mono", monospace'; x.fillStyle='#7D838C';
  x.fillText('t = '+String(head).padStart(3,'0'), rx, padT+46);
  x.fillText('src erp:4412', rx, padT+62);
  var dv=s07d[head]-s07d[Math.max(0,head-1)];
  x.fillStyle=dv>=0?'#0F7B4F':'#CF340A';
  x.fillText((dv>=0?'▲ ':'▼ ')+Math.abs(dv).toFixed(2), rx, padT+78);
}

/* ══ 08 · ORBIT ═══════════════════════════════════════════════════════════
   Impostor sphere shading: the surface normal is reconstructed per pixel, lit
   with Lambert plus a Blinn specular and a Fresnel rim, computed once into a
   sprite and blitted. Three depth-of-field levels chosen per body. */
var s08s=null;
function s08sprite(rgb,ao){
  var S=88,c=document.createElement('canvas');c.width=c.height=S;
  var q=c.getContext('2d'),img=q.createImageData(S,S),d=img.data;
  function toLin(v){v/=255;return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4);}
  function toS(v){v=v<=0.0031308?v*12.92:1.055*Math.pow(v,1/2.4)-0.055;
    return Math.max(0,Math.min(255,Math.round(v*255)));}
  var base=rgb.map(toLin), L=[-0.44,-0.58,0.68],lm=Math.hypot(L[0],L[1],L[2]);
  L=[L[0]/lm,L[1]/lm,L[2]/lm];
  var hx=L[0],hy=L[1],hz=L[2]+1,hm=Math.hypot(hx,hy,hz);hx/=hm;hy/=hm;hz/=hm;
  var r=S/2-1,mid=S/2;
  for(var py=0;py<S;py++)for(var pxx=0;pxx<S;pxx++){
    var dx=(pxx-mid+.5)/r,dy=(py-mid+.5)/r,r2=dx*dx+dy*dy,i4=(py*S+pxx)*4;
    if(r2>1){d[i4+3]=0;continue;}
    var nz=Math.sqrt(1-r2);
    var ndl=Math.max(0,dx*L[0]+dy*L[1]+nz*L[2]);
    var spec=Math.pow(Math.max(0,dx*hx+dy*hy+nz*hz),46)*0.6;
    var fres=Math.pow(1-nz,5)*0.3, up=0.5+0.5*(-dy);
    for(var ch=0;ch<3;ch++){
      var amb=(0.14+(0.62-0.14)*up)*ao;
      d[i4+ch]=toS(base[ch]*(amb+ndl*1.2)+spec+fres*0.45);
    }
    var edge=r2>0.86?(r2-0.86)/0.14:0;
    if(edge)for(var e2=0;e2<3;e2++)d[i4+e2]*=(1-0.45*edge);
    d[i4+3]=Math.round(255*Math.min(1,(1-r2)*r*0.5+0.5));
  }
  q.putImageData(img,0,0); return c;
}
function s08blur(src,p){ if(!p)return src;
  var c=document.createElement('canvas');c.width=src.width;c.height=src.height;
  var q=c.getContext('2d');q.filter='blur('+p+'px)';q.drawImage(src,0,0);return c;}
function s08(x,W,H,t,still){
  clear(x,W,H,'#F7F7F5');
  if(!s08s){ s08s={};
    [['a',[168,122,62]],['b',[96,108,132]],['c',[122,114,106]],['x',[207,52,10]]].forEach(function(e){
      var base=s08sprite(e[1],0.92);
      s08s[e[0]]=[base,s08blur(base,2),s08blur(base,4.4)]; }); }
  var cx=W/2, cy=H/2, T=still?7:t;
  var bodies=[];
  for(var ring=0;ring<3;ring++){
    var cnt=[9,14,20][ring], rad=Math.min(W,H)*[0.13,0.24,0.35][ring];
    for(var i=0;i<cnt;i++){
      var a=(i/cnt)*Math.PI*2 + T*(0.26-ring*0.06)*(ring%2?-1:1);
      var tilt=[0.30,0.52,0.20][ring];
      var wx=Math.cos(a)*rad, wz=Math.sin(a)*rad;
      var wy=Math.sin(a)*rad*tilt*(ring===1?1:-1);
      bodies.push({x:cx+wx, y:cy+wy*0.55, z:wz, r:[7,5,3.4][ring],
        k:(ring===0&&i%3===0)?'x':['a','b','c'][(i+ring)%3], rad:rad});
    }
  }
  bodies.sort(function(a,b){return a.z-b.z;});
  bodies.forEach(function(b){
    var dep=(b.z/(Math.min(W,H)*0.35)+1)/2;
    var lvl = Math.abs(b.z)>Math.min(W,H)*0.26 ? 2 : Math.abs(b.z)>Math.min(W,H)*0.14 ? 1 : 0;
    var rr=b.r*(0.72+0.55*dep);
    x.globalAlpha=0.30+0.70*dep;
    x.drawImage(s08s[b.k][lvl], b.x-rr, b.y-rr, rr*2, rr*2);
  });
  x.globalAlpha=1;
}

/* ══ 09 · CONTOUR ═════════════════════════════════════════════════════════
   Marching squares over a moving scalar field. Eight iso-levels, the middle one
   picked out in the accent -- this is a topographic map of data that is still
   changing, which is a different claim from a chart of data that is finished. */
function s09(x,W,H,t,still){
  clear(x,W,H,'#FFFFFF');
  var cols=Math.max(24,Math.round(W/13)), rows=Math.max(14,Math.round(H/13));
  var T=still?6:t, f=[], i, j;
  for(j=0;j<=rows;j++){ f[j]=[];
    for(i=0;i<=cols;i++){
      var u=i/cols, v=j/rows;
      f[j][i]=fbm(u*2.4+T*0.10, v*2.4-T*0.07, 4) + (0.42-Math.hypot(u-0.5,(v-0.5)*1.25))*1.1;
    } }
  var LV=8;
  for(var l=0;l<LV;l++){
    var iso=-0.45+l*(1.05/LV);
    var mid = l===Math.floor(LV/2);
    x.strokeStyle = mid?'#CF340A':'#14161A';
    x.globalAlpha = mid?0.85:(0.10+0.16*(l/LV));
    x.lineWidth = mid?1.6:0.9;
    x.beginPath();
    for(j=0;j<rows;j++) for(i=0;i<cols;i++){
      var x0=i*W/cols, x1=(i+1)*W/cols, y0=j*H/rows, y1=(j+1)*H/rows;
      var a=f[j][i], b=f[j][i+1], c=f[j+1][i+1], d=f[j+1][i];
      var idx=(a>iso?8:0)|(b>iso?4:0)|(c>iso?2:0)|(d>iso?1:0);
      if(idx===0||idx===15) continue;
      function ip(p,q,vp,vq){ return p+(q-p)*((iso-vp)/(vq-vp||1e-6)); }
      var T_={x:ip(x0,x1,a,b),y:y0}, Rr={x:x1,y:ip(y0,y1,b,c)},
          Bm={x:ip(x0,x1,d,c),y:y1}, Lf={x:x0,y:ip(y0,y1,a,d)};
      var seg={1:[Lf,Bm],2:[Bm,Rr],3:[Lf,Rr],4:[T_,Rr],5:[T_,Rr],6:[T_,Bm],7:[T_,Lf],
               8:[T_,Lf],9:[T_,Bm],10:[T_,Lf],11:[T_,Rr],12:[Lf,Rr],13:[Bm,Rr],14:[Lf,Bm]}[idx];
      if(!seg) continue;
      x.moveTo(seg[0].x,seg[0].y); x.lineTo(seg[1].x,seg[1].y);
    }
    x.stroke();
  }
  x.globalAlpha=1;
}

/* ══ 10 · PRISM ═══════════════════════════════════════════════════════════
   Dispersion on paper. The first version composited beams with 'lighter',
   which is how light behaves on a dark stage and is a NO-OP on white --
   white plus anything is still white, so the tile rendered as an empty box
   with one line across it. On paper the physics is the other way round: a
   spectrum cast on a white surface is SUBTRACTIVE, each wavelength removing
   its complement, overlaps going deeper rather than brighter. So it is
   multiply, and it is the correct model rather than a workaround. */
function s10(x,W,H,t,still){
  clear(x,W,H,'#FFFFFF_KEEP');   // subtractive: must be white
  var T=still?5:t;
  var ox=W*0.30, oy=H*1.02;                   // the refracting edge, bottom-left
  var base=-1.14 + Math.sin(T*0.17)*0.05;     // the fan drifts, slowly

  x.save();
  x.globalCompositeOperation='multiply';
  var SPEC=[[29,78,216],[14,116,144],[14,124,123],[90,130,60],[201,162,39],[168,97,65],[207,52,10]];
  SPEC.forEach(function(c,i){
    var spread=0.40;
    var a0=base - spread/2 + (i/(SPEC.length-1))*spread;
    var wob=Math.sin(T*0.55+i*0.7)*0.010;
    var ang=a0+wob;
    var len=Math.max(W,H)*1.9;
    var ex=ox+Math.cos(ang)*len, ey=oy+Math.sin(ang)*len;
    var g=x.createLinearGradient(ox,oy,ex,ey);
    var rgb='rgba('+c[0]+','+c[1]+','+c[2]+',';
    g.addColorStop(0,   rgb+'0)');
    g.addColorStop(0.10,rgb+'0.30)');
    g.addColorStop(0.55,rgb+'0.17)');
    g.addColorStop(1,   rgb+'0)');
    x.strokeStyle=g; x.lineWidth=W*0.062; x.lineCap='round';
    x.beginPath(); x.moveTo(ox,oy); x.lineTo(ex,ey); x.stroke();
  });
  x.restore();

  /* the incoming beam: one narrow neutral wedge arriving at the edge */
  x.save(); x.globalCompositeOperation='multiply';
  var ia=-2.72, il=Math.max(W,H)*1.4;
  var g2=x.createLinearGradient(ox+Math.cos(ia)*il, oy+Math.sin(ia)*il, ox, oy);
  g2.addColorStop(0,'rgba(20,22,26,0)'); g2.addColorStop(1,'rgba(20,22,26,.13)');
  x.strokeStyle=g2; x.lineWidth=W*0.020; x.lineCap='butt';
  x.beginPath(); x.moveTo(ox+Math.cos(ia)*il, oy+Math.sin(ia)*il); x.lineTo(ox,oy); x.stroke();
  x.restore();

  /* the prism itself -- one opaque hard-edged triangle, the only crisp thing */
  x.beginPath();
  x.moveTo(ox-W*0.09, oy); x.lineTo(ox+W*0.09, oy); x.lineTo(ox, oy-H*0.30);
  x.closePath();
  var pg=x.createLinearGradient(ox-W*0.09,oy,ox+W*0.09,oy-H*0.30);
  pg.addColorStop(0,'rgba(20,22,26,.10)'); pg.addColorStop(0.5,'rgba(20,22,26,.03)');
  pg.addColorStop(1,'rgba(20,22,26,.12)');
  x.fillStyle=pg; x.fill();
  x.strokeStyle='rgba(20,22,26,.72)'; x.lineWidth=1.4; x.stroke();
}

/* ── the ten, described ─────────────────────────────────────────────────── */
var TEN=[
 {n:'Resolution bundle',fn:s01,fps:34,wide:true,
  tech:'edge bundling · cubic handles at 0.56 / 0.22 · travelling tick',
  d:'Fourteen source records collapsing onto five objects. Handles are pulled apart rather than parked at the midpoint, which is the difference between a bundle that reads as routing and one that reads as a flat comb.',
  use:'Hero. The single best explanation of identity resolution that fits in one frame.'},
 {n:'Lattice',fn:s02,fps:34,
  tech:'3D lattice · per-node Lambert + specular · depth-sorted',
  d:'A 5×5×5 node lattice with struts on the axes only. Sized from its true projected extent — half-diagonal × perspective — so a rotating cube never clips its own corners.',
  use:'Product stage. Works on a light ground where a wireframe sphere does not.'},
 {n:'Current',fn:s03,fps:30,wide:true,
  tech:'curl-noise advection · 900 particles · trails by frame decay',
  d:'Particles follow a noise field and the previous frame is faded rather than cleared, which is what makes the strokes silky instead of stuttering. Every twenty-third particle is hot, so the accent reads as signal in noise.',
  use:'Full-bleed section background, at low opacity, behind type.'},
 {n:'Aperture',fn:s04,fps:30,
  tech:'mesh gradient · source-in compositing through letterforms',
  d:'Four radial gradients orbiting on an offscreen buffer, then masked to the type with destination-in. The word is a window onto the colour, not a thing sitting on top of it.',
  use:'Brand moment. Section break, or the closing frame of a page.'},
 {n:'Halftone field',fn:s05,fps:26,
  tech:'fixed dot matrix · radius driven by fBm + radial falloff',
  d:'The grid never moves; only the weight of each dot does. That is why it reads as something being exposed or printed rather than as particles drifting.',
  use:'Card art, repeated across a grid with a different seed per card.'},
 {n:'Flow',fn:s06,fps:26,wide:true,
  tech:'Sankey · stacked ribbons, no gaps at the nodes',
  d:'Four sources through three review states into three outcomes, with one path lit at a time so a single flow can be followed end to end. Ribbon width is the value, and the widths sum exactly at every node.',
  use:'The “how work moves” section. Also a real chart if fed real numbers.'},
 {n:'Series',fn:s07,fps:34,
  tech:'progressive path · gradient area · crosshair locked to the head',
  d:'The line draws to a moving head and the readout beside it changes with it — value, index, source reference and delta. A chart that is still arriving makes a different claim from one that has finished.',
  use:'Anywhere a live figure is the argument. Feed it real data and it stays honest.'},
 {n:'Orbit',fn:s08,fps:34,
  tech:'sphere impostors · linear-space Lambert/Blinn/Fresnel · 3-level DOF',
  d:'Normals are reconstructed per pixel and lit in linear space, rasterised once into a sprite and blitted. The defocus on the far ring is a stronger depth cue than fog and costs nothing at runtime.',
  use:'Hero for anything scientific or structural. The technique behind the RNA duplex.'},
 {n:'Contour',fn:s09,fps:24,wide:true,
  tech:'marching squares · 8 iso-levels over a moving scalar field',
  d:'A topographic map of a field that is still changing, with the median level picked out. Sixteen cases, two interpolated crossings each — about forty lines of maths for a graphic most sites would buy as a video.',
  use:'Section background or a full-bleed band. Reads as measurement, not decoration.'},
 {n:'Prism',fn:s10,fps:26,
  tech:'subtractive dispersion · seven wavelengths · multiply',
  d:'A spectrum cast on white paper is subtractive — each wavelength removes its complement and overlaps go deeper, not brighter. Composited with multiply for that reason. The only one of the ten with no data in it.',
  use:'The brand moment — a title card, an opening frame, an OG image.'}
];

/* Register EVERY word of a name as an alias. Keying on the first word alone
   meant "Resolution bundle" answered to "resolution" and not to "bundle", so
   the one call site that asked for it threw and its hero came back blank. */
var BY_NAME = {};
TEN.forEach(function(g){
  var full = g.n.toLowerCase();
  BY_NAME[full] = g;
  full.split(' ').forEach(function(w){ if (!BY_NAME[w]) BY_NAME[w] = g; });
});

window.LD = {
  mount: mount,
  /* Tell the library what ground the page is using. Call before mounting. */
  setGround: function(hex){ GROUND = hex; },
  ten: TEN,
  byName: BY_NAME,
  s01:s01, s02:s02, s03:s03, s04:s04, s05:s05,
  s06:s06, s07:s07, s08:s08, s09:s09, s10:s10,
  /* Mount by name. An unknown name is a loud failure rather than a blank
     canvas, because a hero that silently does not paint is the exact bug this
     file exists to stop. */
  hero: function(cv, name){
    var g = BY_NAME[String(name).toLowerCase()];
    if (!g) throw new Error('LD.hero: no motion graphic named "' + name + '"');
    mount(cv, g.fn, g.fps);
    return g;
  }
};
})();
