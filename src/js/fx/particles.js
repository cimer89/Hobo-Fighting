/* ===================== Efekty cząsteczkowe (PFX) ===================== */
/* Lekki silnik cząsteczek na płótnie nad planszą. Cząsteczki żyją we współrzędnych planszy SVG
   (#ov), więc podążają za kamerą i powiększeniem. Efekty to dane (PFX.LIB): każdy efekt to lista emiterów
   – kształt, liczba, kąt, prędkość, grawitacja, opór, czas życia, rozmiar od→do, kolory od→do, przezroczystość, tryb mieszania.
   PFX.play(nazwa, x, y, opcje) odpala efekt; PFX.ev(zdarzenie) dobiera efekty do zdarzeń animacji rundy.
   Nie zmienia zasad ani przebiegu animacji – tylko dokłada obraz. Wyłączenie: localStorage hf_pfx = '0'. */
const PFX=(function(){
 let cv=null,cx=null,parts=[],raf=0,last=0,dpr=1;
 const MAX=900;
 /* skala efektów względem jednostek planszy (heks ma ok. 140 jednostek szerokości) */
 const K=1.9;
 const on=()=>{try{return localStorage.getItem('hf_pfx')!=='0'}catch(e){return true}};
 const rnd=(a,b)=>a+Math.random()*(b-a);
 const pick=a=>Array.isArray(a)?a[Math.floor(Math.random()*a.length)]:a;
 const hex=h=>{h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return [n>>16&255,n>>8&255,n&255]};
 const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
 /* kolor wg czasu życia: lista przystanków */
 function grad(cols,t){t=Math.max(0,Math.min(1,t||0));if(cols.length===1)return cols[0];const s=t*(cols.length-1),i=Math.min(cols.length-2,Math.floor(s));return mix(cols[i],cols[i+1],s-i)}

 /* ---------- biblioteka efektów (dane jak z edytora) ---------- */
 const LIB={
  hit:[
   {shape:'spark',n:18,speed:[260,560],life:[.25,.55],size:[3,1],len:.045,grav:700,drag:1.8,col:['#ffffff','#ffd166','#ff5a2f'],blend:'lighter'},
   {shape:'glow',n:1,speed:[0,0],life:[.22,.22],size:[18,70],col:['#ffffff','#ff7a45'],alpha:[.9,0],blend:'lighter'},
   {shape:'ring',n:1,speed:[0,0],life:[.32,.32],size:[8,62],width:5,col:['#ffffff','#ff5a4f'],alpha:[.9,0]},
   {shape:'circle',n:6,speed:[60,170],life:[.35,.6],size:[9,0],grav:220,col:['#ff5a4f','#8a1c14'],alpha:[1,.6]}],
  shield:[
   {shape:'ring',n:2,stagger:.09,speed:[0,0],life:[.45,.45],size:[20,86],width:6,col:['#e6fbff','#3fb8ff'],alpha:[1,0],blend:'lighter'},
   {shape:'shard',n:14,speed:[180,360],life:[.4,.7],size:[9,2],grav:300,drag:1.2,spin:[-10,10],col:['#dff6ff','#59c7ff'],blend:'lighter'}],
  dust:[
   {shape:'smoke',n:7,speed:[30,110],angle:[200,340],life:[.6,1.1],size:[12,38],grav:-30,drag:2,col:['#d8c7a0','#a8936a'],alpha:[.55,0]}],
  land:[
   {shape:'smoke',n:16,speed:[120,260],angle:[160,380],life:[.5,1],size:[14,42],grav:-20,drag:3.2,col:['#e3d3ad','#9c8862'],alpha:[.6,0],flat:.45},
   {shape:'shard',n:10,speed:[160,330],angle:[200,340],life:[.4,.7],size:[7,3],grav:900,spin:[-12,12],col:['#7b6a4c','#4c4130']},
   {shape:'ring',n:1,speed:[0,0],life:[.35,.35],size:[16,95],width:7,col:['#fff3d6','#c9b58a'],alpha:[.8,0],flat:.45}],
  impact:[
   {shape:'glow',n:1,speed:[0,0],life:[.3,.3],size:[30,120],col:['#fff4d6','#ff8a2a'],alpha:[.95,0],blend:'lighter'},
   {shape:'spark',n:30,speed:[320,720],life:[.3,.65],size:[4,1],len:.05,grav:800,drag:1.5,col:['#ffffff','#ffc14d','#ff5a1f'],blend:'lighter'},
   {shape:'shard',n:12,speed:[180,420],life:[.5,.9],size:[9,3],grav:1000,spin:[-14,14],col:['#8b6f4a','#4a3a26']},
   {shape:'smoke',n:10,speed:[60,200],life:[.7,1.3],size:[20,60],grav:-40,drag:2.4,col:['#d9c39b','#8e8172'],alpha:[.55,0]},
   {shape:'ring',n:1,speed:[0,0],life:[.4,.4],size:[20,130],width:8,col:['#ffffff','#ff9a3c'],alpha:[.9,0]}],
  fan:[
   {shape:'spark',n:26,speed:[380,620],spread:55,life:[.25,.45],size:[3,1],len:.07,drag:1,col:['#ffffff','#bff3ff','#7fd8ff'],alpha:[.9,0],blend:'lighter'},
   {shape:'smoke',n:6,speed:[200,360],spread:45,life:[.35,.6],size:[10,34],drag:3,col:['#e9fbff','#a5d9e6'],alpha:[.45,0]}],
  muzzle:[
   {shape:'glow',n:1,speed:[0,0],life:[.14,.14],size:[16,48],col:['#ffffff','#ffd166'],alpha:[1,0],blend:'lighter'},
   {shape:'spark',n:10,speed:[300,620],spread:22,life:[.12,.26],size:[3,1],len:.05,col:['#ffffff','#ffd166'],blend:'lighter'},
   {shape:'smoke',n:4,speed:[30,80],spread:40,life:[.5,.9],size:[8,26],grav:-50,col:['#cfcfcf','#7a7a7a'],alpha:[.45,0]}],
  explosion:[
   {shape:'glow',n:1,speed:[0,0],life:[.35,.35],size:[30,150],col:['#ffffff','#ffcf4a','#ff4a1a'],alpha:[1,0],blend:'lighter'},
   {shape:'circle',n:14,speed:[80,260],life:[.35,.7],size:[22,4],drag:2.5,col:['#fff2b0','#ffb02e','#ff4a1a','#5a2a1a'],alpha:[1,0],blend:'lighter'},
   {shape:'spark',n:26,speed:[300,700],life:[.3,.7],size:[3,1],len:.05,grav:700,drag:1.4,col:['#ffffff','#ffcf4a','#ff6a1a'],blend:'lighter'},
   {shape:'shard',n:10,speed:[200,460],life:[.5,1],size:[8,3],grav:1000,spin:[-16,16],col:['#5d6066','#2b2d31']},
   {shape:'smoke',n:12,stagger:.08,speed:[30,140],life:[.9,1.7],size:[24,80],grav:-70,drag:1.8,col:['#5b5550','#2a2725'],alpha:[.6,0]}],
  toxic:[
   {shape:'bubble',n:14,speed:[20,90],angle:[230,310],life:[.6,1.2],size:[5,13],grav:-120,drag:1,col:['#c8ff6a','#5ec416'],alpha:[.9,0]},
   {shape:'circle',n:12,speed:[120,300],angle:[200,340],life:[.35,.6],size:[7,2],grav:900,col:['#9be84a','#3d8a12']},
   {shape:'smoke',n:6,speed:[20,60],angle:[240,300],life:[.8,1.4],size:[16,46],grav:-30,col:['#a6f05a','#4d7d1e'],alpha:[.35,0],blend:'lighter'}],
  wool:[
   {shape:'smoke',n:12,speed:[80,220],life:[.5,1],size:[12,32],grav:-20,drag:2.6,col:['#ffffff','#e9e4d8'],alpha:[.95,0]},
   {shape:'circle',n:8,speed:[140,300],life:[.4,.7],size:[6,2],grav:500,col:['#ffffff','#f1ede4']}],
  teleport:[
   {shape:'spark',n:20,speed:[60,220],angle:[240,300],life:[.4,.8],size:[3,1],len:.03,grav:-200,col:['#f0d8ff','#b36cff','#6a2bd8'],blend:'lighter'},
   {shape:'ring',n:2,stagger:.1,speed:[0,0],life:[.4,.4],size:[50,6],width:5,col:['#f3e4ff','#9d4dff'],alpha:[.9,0],blend:'lighter',flat:.45}],
  gas:[
   {shape:'smoke',n:10,speed:[20,80],life:[.9,1.6],size:[18,52],grav:-40,col:['#d65bff','#5a1f6e'],alpha:[.45,0]}],
  dice:[
   {shape:'star',n:12,speed:[80,220],life:[.5,.9],size:[9,2],grav:-60,spin:[-6,6],col:['#fff6c9','#f6cf55'],blend:'lighter'}],
  build:[
   {shape:'spark',n:10,speed:[60,180],life:[.25,.45],size:[2.5,1],len:.03,grav:400,col:['#ffffff','#9fd7ff'],blend:'lighter'},
   {shape:'smoke',n:3,speed:[10,40],life:[.5,.8],size:[8,20],grav:-40,col:['#cfd3da','#8a8f98'],alpha:[.4,0]}],
  ko:[
   {shape:'glow',n:1,speed:[0,0],life:[.45,.45],size:[40,170],col:['#ffffff','#ff4f45'],alpha:[1,0],blend:'lighter'},
   {shape:'spark',n:40,speed:[300,820],life:[.4,.9],size:[4,1],len:.06,grav:600,drag:1.2,col:['#ffffff','#ffd166','#ff3b2f'],blend:'lighter'},
   {shape:'star',n:14,speed:[120,320],angle:[200,340],life:[.7,1.2],size:[11,3],grav:260,spin:[-8,8],col:['#fff6c9','#f6cf55']},
   {shape:'smoke',n:14,stagger:.05,speed:[40,160],life:[1,1.8],size:[26,90],grav:-90,drag:1.6,col:['#6b625a','#2a2522'],alpha:[.6,0]},
   {shape:'ring',n:2,stagger:.12,speed:[0,0],life:[.5,.5],size:[24,160],width:9,col:['#ffffff','#ff5a4f'],alpha:[.9,0]}]
 };

 /* ---------- płótno i przeliczanie współrzędnych ---------- */
 function ensure(){if(cv&&document.body.contains(cv))return true;cv=document.createElement('canvas');cv.id='pfx';
  cv.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:3';document.body.appendChild(cv);cx=cv.getContext('2d');size();return true}
 function size(){if(!cv)return;dpr=Math.min(2,window.devicePixelRatio||1);cv.width=Math.round(innerWidth*dpr);cv.height=Math.round(innerHeight*dpr)}
 window.addEventListener('resize',size);
 function ctm(){const ov=document.getElementById('ov')||document.querySelector('#stage svg');if(!ov||!ov.getScreenCTM)return null;return ov.getScreenCTM()}

 /* ---------- emisja ---------- */
 function emit(em,x,y,o){const ang0=o&&o.dir!=null?o.dir:null;
  for(let i=0;i<em.n;i++){if(parts.length>=MAX)break;
   let a;if(ang0!=null){const s=(em.spread||30)*Math.PI/180;a=ang0+rnd(-s,s)}else if(em.angle){a=rnd(em.angle[0],em.angle[1])*Math.PI/180}else a=rnd(0,Math.PI*2);
   const sp=rnd(em.speed[0],em.speed[1])*(o&&o.power||1)*K,fl=em.flat||1,life=rnd(em.life[0],em.life[1]);
   parts.push({x:x+rnd(-(o&&o.jit||4),(o&&o.jit||4)),y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp*fl,g:(em.grav||0)*K,dr:em.drag||0,t:0,life,
    s0:em.size[0]*(o&&o.scale||1)*K,s1:em.size[1]*(o&&o.scale||1)*K,cols:(o&&o.cols||em.col).map(hex),a0:em.alpha?em.alpha[0]:1,a1:em.alpha?em.alpha[1]:0,
    shape:em.shape,len:em.len||.04,w:(em.width||4)*K*.7,blend:em.blend||'source-over',rot:rnd(0,6.28),spin:em.spin?rnd(em.spin[0],em.spin[1]):0,fl})}}
 function play(name,x,y,o){if(!on())return;const fx=LIB[name];if(!fx)return;ensure();
  fx.forEach(em=>{if(em.stagger){for(let k=0;k<em.n;k++)setTimeout(()=>emit(Object.assign({},em,{n:1}),x,y,o),k*em.stagger*1000)}else emit(em,x,y,o)});
  if(!raf){last=performance.now();raf=requestAnimationFrame(loop)}}
 /* ślad wzdłuż odcinka (szarża, strzał, wachlarz) */
 function trail(name,a,b,dur,o){const n=Math.max(2,Math.round(dur/60));for(let i=0;i<=n;i++)setTimeout(()=>{const k=i/n;play(name,a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,o)},dur*i/n)}

 /* ---------- symulacja i rysowanie ---------- */
 function loop(now){/* znacznik klatki bywa wcześniejszy niż performance.now() z play() – krok czasu nie może być ujemny */
  const dt=Math.max(0,Math.min(.05,(now-last)/1000))||0;last=Math.max(last,now);
  const m=ctm();cx.setTransform(1,0,0,1,0,0);cx.clearRect(0,0,cv.width,cv.height);
  const sg=document.getElementById('stage');if(m&&sg){const R=sg.getBoundingClientRect();cx.save();cx.beginPath();cx.rect(R.left*dpr,R.top*dpr,R.width*dpr,R.height*dpr);cx.clip()}
  if(m){const sc=Math.hypot(m.a,m.b)*dpr;
   for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.t+=dt;if(p.t>=p.life){parts.splice(i,1);continue}
    const k=Math.exp(-p.dr*dt);p.vx*=k;p.vy*=k;p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.spin*dt;
    const t=p.t/p.life,s=(p.s0+(p.s1-p.s0)*t)*sc,al=p.a0+(p.a1-p.a0)*t,c=grad(p.cols,t);
    const X=(m.a*p.x+m.c*p.y+m.e)*dpr,Y=(m.b*p.x+m.d*p.y+m.f)*dpr;if(s<=0||al<=0)continue;
    cx.globalCompositeOperation=p.blend;cx.globalAlpha=Math.max(0,Math.min(1,al));const rgb='rgb('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+')';
    if(p.shape==='spark'){cx.strokeStyle=rgb;cx.lineWidth=Math.max(1,s);cx.lineCap='round';cx.beginPath();cx.moveTo(X,Y);cx.lineTo(X-p.vx*p.len*sc,Y-p.vy*p.len*sc);cx.stroke()}
    else if(p.shape==='ring'){cx.strokeStyle=rgb;cx.lineWidth=Math.max(1,p.w*sc*(1-t*.6));cx.beginPath();cx.ellipse(X,Y,s,s*p.fl,0,0,6.283);cx.stroke()}
    else if(p.shape==='glow'||p.shape==='smoke'){const g=cx.createRadialGradient(X,Y,0,X,Y,s);g.addColorStop(0,rgb);g.addColorStop(1,'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+',0)');cx.fillStyle=g;cx.beginPath();cx.ellipse(X,Y,s,s*(p.shape==='smoke'?p.fl:1),0,0,6.283);cx.fill()}
    else if(p.shape==='bubble'){cx.strokeStyle=rgb;cx.lineWidth=Math.max(1,s*.25);cx.beginPath();cx.arc(X,Y,s,0,6.283);cx.stroke();cx.globalAlpha*=.35;cx.fillStyle=rgb;cx.fill()}
    else if(p.shape==='shard'){cx.save();cx.translate(X,Y);cx.rotate(p.rot);cx.fillStyle=rgb;cx.beginPath();cx.moveTo(0,-s);cx.lineTo(s*.6,s*.5);cx.lineTo(-s*.6,s*.5);cx.closePath();cx.fill();cx.restore()}
    else if(p.shape==='star'){cx.save();cx.translate(X,Y);cx.rotate(p.rot);cx.fillStyle=rgb;cx.beginPath();for(let j=0;j<10;j++){const r=j%2?s*.42:s,a=j*Math.PI/5;cx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}cx.closePath();cx.fill();cx.restore()}
    else{cx.fillStyle=rgb;cx.beginPath();cx.arc(X,Y,s,0,6.283);cx.fill()}}}
  else parts.length=0;
  if(m&&sg)cx.restore();
  cx.globalAlpha=1;cx.globalCompositeOperation='source-over';
  if(parts.length)raf=requestAnimationFrame(loop);else{raf=0;cx.clearRect(0,0,cv.width,cv.height)}}

 /* ---------- zdarzenia animacji rundy -> efekty (czasy dopasowane do runAnim) ---------- */
 const P=id=>(st.curPos&&st.curPos[id])||null;
 const cc=c=>{try{return cellC(c)}catch(e){return null}};
 const at=(ms,f)=>setTimeout(()=>{if(!st.skipReq)f()},ms);
 const COLS={Wiatrak:'#7fd8ff','Długi':'#ffb347','Żyleta':'#ff5a7a',Ciotka:'#d68cff','Sierżant Przemo':'#9bd35a',Pasterz:'#f2e6c9',Truchel:'#8fe03a',Byku:'#ff9a3c'};
 function ev(e){if(!on())return;try{
  if(e.k==='move'){const a=cc(e.from),c=cc(e.to);if(!a||!c)return;
   if(e.tele){play('teleport',a[0],a[1]-20);at(300,()=>play('teleport',c[0],c[1]-20));return}
   play('dust',a[0],a[1]+20);if(e.jump)at(640,()=>play('land',c[0],c[1]+18,{scale:e.far?.8:1.15}));else at(640,()=>play('dust',c[0],c[1]+20,{scale:.7}))}
  else if(e.k==='atk'){const a=cc(e.from),b=e.end?cc(e.end):a;if(!a||!b)return;const dir=Math.atan2(b[1]-a[1],b[0]-a[0]),col=COLS[e.ch]||'#ffe066';
   if(e.ch==='Wiatrak'){play('fan',a[0],a[1]-34,{dir});at(120,()=>play('fan',a[0],a[1]-34,{dir,power:.8}))}
   else if(e.line){play('muzzle',a[0],a[1]-34,{dir});trail('build',[a[0],a[1]-34],[b[0],b[1]-34],380,{cols:['#ffffff',col]})}
   else (e.cells||[]).forEach((cl,i)=>{const g=cc(cl);if(g)at(i*70,()=>play('build',g[0],g[1]-20,{cols:['#ffffff',col]}))});
   if(e.hit)at(560,()=>play('hit',b[0],b[1]-34,{scale:e.bd?1.3:1}))}
  else if(e.k==='dmg'){const p=P(e.id);if(!p)return;const w=e.w||'';
   if(w==='trucizna')at(90,()=>play('toxic',p[0],p[1]-20));
   else if(w==='strefa')at(90,()=>play('gas',p[0],p[1]-20));
   else if(/ścisk|kolizja/.test(w))at(90,()=>play('dust',p[0],p[1]+10,{scale:1.3}));
   at(90,()=>play('hit',p[0],p[1]-34,{scale:Math.min(1.6,.8+.25*(e.n||1))}))}
  else if(e.k==='charge'){const a=cc(e.from),c=cc(e.to);if(!a||!c)return;const d=Math.max(520,260*Math.max(1,e.steps));
   trail('dust',[a[0],a[1]+22],[c[0],c[1]+22],d,{scale:1.2});at(d,()=>play(e.hit?'impact':'land',c[0],c[1]-(e.hit?34:-18)))}
  else if(e.k==='knock'){const c=cc(e.to);if(c)at(420,()=>play('land',c[0],c[1]+18,{scale:.8}))}
  else if(e.k==='summon'){const c=cc(e.to);if(c)play('wool',c[0],c[1]-20)}
  else if(e.k==='smove'){const c=cc(e.to);if(c)at(520,()=>play('dust',c[0],c[1]+16,{scale:.7}))}
  else if(e.k==='scharge'&&!e.none){const a=cc(e.from),c=cc(e.to);if(!a||!c)return;const d=Math.max(420,200*Math.max(1,e.steps));
   trail('wool',[a[0],a[1]-10],[c[0],c[1]-10],d,{scale:.5,power:.4});if(e.hit)at(d,()=>play('impact',c[0],c[1]-30,{scale:.8}))}
  else if(e.k==='sheephit'){const c=cc(e.pos);if(c)play('wool',c[0],c[1]-20,{scale:1.4,power:1.4})}
  else if(e.k==='droneon'){const p=P(e.id);if(p)play('build',p[0],p[1]-80)}
  else if(e.k==='drone'){const to=cc(e.to);if(!to)return;const tp=e.target&&P(e.target);at(tp?1130:750,()=>{const q=tp||[to[0],to[1]+20];play('explosion',q[0],q[1]-40,{scale:tp?1:.8})})}
  else if(e.k==='puddle'&&!e.none){const c=cc(e.to);if(c)play('toxic',c[0],c[1],{scale:1.2})}
  else if(e.k==='shield'){const p=P(e.id);if(p)play('shield',p[0],p[1]-34)}
  else if(e.k==='trig'){const p=P(e.id);if(p)play('dice',p[0],p[1]-60)}
  else if(e.k==='push'){const c=cc(e.to);if(c)at(1560,()=>play('land',c[0],c[1]+18,{scale:.8}))}
  else if(e.k==='out'){const p=P(e.id);if(p)play('ko',p[0],p[1]-34)}
 }catch(err){}}
 function clear(){parts.length=0}
 /* pokaz wszystkich efektów na środku planszy (podgląd w konsoli: PFX.demo()) */
 function demo(){const names=Object.keys(LIB);names.forEach((n,i)=>setTimeout(()=>play(n,0,0),i*700));return names}
 return {LIB,play,trail,ev,clear,demo,count:()=>parts.length}})();
