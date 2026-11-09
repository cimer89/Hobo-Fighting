/* ===================== POSTACIE 2D (rysunkowe sprite'y, styl "mobilny cartoon") ===================== */
/* SPR2D[ch] = [0 stoi SE, 1 stoi NE, 2 atak SE, 3 atak S, 4 atak NE, 5 atak N, 6 stoi S, 7 stoi N]; kierunki SW/NW to lustrzane odbicie.
   6 kierunków = 6 ścian heksa: 0 SE, 1 S, 2 SW, 3 NW, 4 N, 5 NE (ekran, y w dół) */
const S2D=(function(){
 const EL=40*Math.PI/180,SE=Math.sin(EL);
 let state=0,canvas,g,W=0,H=0,DPR=1,last=0,lastOn=false;const T={};
 const enabled=()=>{try{return localStorage.getItem('hf_2d')!=='0'}catch(e){return true}};
 function setEnabled(v){try{localStorage.setItem('hf_2d',v?'1':'0')}catch(e){}if(v&&!state)init();if(!v)hideAll()}
 /* wysokość postaci względem szerokości podstawki żetonu, poprawki pozycji stóp */
 const SZ={'Manekin':2.5,'Owca':1.5,'Byku':2.2,'Sierżant Przemo':2.05,'Długi':2.1,'Wiatrak':2.1,'Żyleta':2.0,'Ciotka':1.95,'Truchel':1.92,'Pasterz':2.1};
 function load(src){return new Promise(res=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>res(null);im.src=src})}
 /* biała sylwetka do błysku przy trafieniu (canvas filter nie działa w Safari) */
 function sil(im){const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);return c}
 /* otoczka drużyny: rozszerzona sylwetka w kolorze drużyny */
 function outl(I,k,col){const key=k+col;I.ol=I.ol||{};if(I.ol[key])return I.ol[key];const s=I.sils[k],p=Math.max(6,Math.round(s.height*0.028));
  const c=document.createElement('canvas');c.width=s.width+2*p;c.height=s.height+2*p;const x=c.getContext('2d');
  for(let i=0;i<16;i++){const a=i/16*Math.PI*2;x.drawImage(s,p+Math.cos(a)*p,p+Math.sin(a)*p)}x.drawImage(s,p,p);
  x.globalCompositeOperation='source-in';x.fillStyle=col;x.fillRect(0,0,c.width,c.height);return I.ol[key]={c,p}}
 async function init(){if(state||!enabled()||typeof SPR2D==='undefined')return;state=1;
  canvas=document.createElement('canvas');canvas.id='s2d';g=canvas.getContext('2d');
  await Promise.all(Object.keys(SPR2D).map(async ch=>{const ims=await Promise.all(SPR2D[ch].map(load));if(ims.some(i=>!i))return;
   T[ch]={ch,ims,sils:ims.map(sil),dir:0,fx:1,ft:0,pend:null,av:[1,0.6],px:null,py:null,vx:0,vy:0,still:0,lock:0,hold:0,
    mode:'idle',mt:0,ko:false,seen:false,ph:Math.random()*6.28,hop:0,run:0,face:[1,0]}}));
  state=2;last=performance.now();requestAnimationFrame(loop)}
 function hideAll(){document.querySelectorAll('.s3on').forEach(e=>e.classList.remove('s3on'));if(canvas)canvas.style.display='none'}
 function upt(n,x,y){const svg=n.ownerSVGElement;let px=x,py=y;
  for(;n&&n!==svg;n=n.parentNode){const tl=n.transform&&n.transform.baseVal;if(!tl||!tl.numberOfItems)continue;
   for(let i=tl.numberOfItems-1;i>=0;i--){const m=tl.getItem(i).matrix,nx=m.a*px+m.c*py+m.e;py=m.b*px+m.d*py+m.f;px=nx}}
  return [px,py]}
 /* kierunek -> jedna z 6 ścian heksa; zmiana robi "anime" obrót: zwężenie do zera i rozwinięcie z nowym ujęciem */
 function dirOf(dx,dy){const a=Math.atan2(dy/SE+0.03*Math.abs(dx),dx)*180/Math.PI;return ((Math.round((a-30)/60)%6)+6)%6}
 function faceTo(I,dx,dy){if(Math.abs(dx)+Math.abs(dy)<1e-3)return;want(I,dirOf(dx,dy))}
 function want(I,d){const cur=I.pend!==null&&I.pend!==undefined?I.pend:I.dir;if(cur===d)return;I.pend=d;if(I.ft<=0)I.ft=0.17}
 const IDLE=[[0,1],[6,0],[0,-1],[1,-1],[7,0],[1,1]],ATK=[[2,1],[3,0],[2,-1],[4,-1],[5,0],[4,1]],FB=[0,1,0,2,1,2,0,1];
 function pick(I,v){let k=v;while(!I.ims[k]&&k!==FB[k])k=FB[k];return I.ims[k]?k:0}
 function view(I,atk){const e=(atk?ATK:IDLE)[I.dir];return [pick(I,e[0]),e[1]||I.fx]}
 function play(I,m){if(I.ko&&m!=='ko')return;I.mode=m;I.mt=0}
 function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1),w=Math.max(1,Math.round(r.width*d)),h=Math.max(1,Math.round(r.height*d));
  if(w!==W||h!==H){W=w;H=h;canvas.width=W;canvas.height=H}DPR=d;return r}
 const ease=t=>t<0?0:t>1?1:t*t*(3-2*t);
 function loop(now){requestAnimationFrame(loop);const dt=Math.min(0.05,Math.max(0.001,(now-last)/1000));last=now;
  const svg=document.querySelector('#stage svg');const on=enabled()&&svg&&svg.isConnected&&svg.getBoundingClientRect().width>0;
  if(!on){if(lastOn)hideAll();lastOn=false;return}
  const stage=document.getElementById('stage')||svg.parentNode;
  if(canvas.parentNode!==stage){stage.appendChild(canvas);if(getComputedStyle(stage).position==='static')stage.style.position='relative'}
  lastOn=true;canvas.style.display='';const cr=resize();g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,W,H);
  Object.values(T).forEach(I=>I.seen=false);const draw=[];
  svg.querySelectorAll('[data-s3]').forEach(el=>{const I=T[el.getAttribute('data-s3')];if(!I)return;
   const pm=el.querySelector('.s3p'),wm=el.querySelector('.s3w');if(!pm||!wm)return;
   const r=pm.getBoundingClientRect(),rw=wm.getBoundingClientRect();if(rw.width<2)return;
   const tk=el.closest('[id^="tk-"]');let op=1;if(tk){op=+getComputedStyle(tk).opacity;if(isNaN(op))op=1}
   if(op<0.05)return;el.classList.add('s3on');I.seen=true;
   const cx=r.left+r.width/2-cr.left,cy=r.top+r.height/2-cr.top,w=rw.width;
   let hop=0;const hp=el.querySelector('.hop');if(hp){const m=/translate\(\s*[-\d.]+\s*,\s*(-?[\d.]+)/.exec(hp.getAttribute('transform')||'');if(m)hop=-parseFloat(m[1])*(w/64)}
   const fy=+pm.getAttribute('cy')||0,bp=upt(el,0,fy),bq=upt(el,32,fy),bw=Math.max(1,2*Math.hypot(bq[0]-bp[0],bq[1]-bp[1]));
   if(I.px!==null){const vx=(bp[0]-I.px)/dt,vy=(bp[1]-I.py)/dt,sp=Math.hypot(vx,vy),k=Math.min(1,dt*9);I.vx+=(vx-I.vx)*k;I.vy+=(vy-I.vy)*k;
    if(sp>bw*0.6){if(now>I.lock)faceTo(I,I.vx,I.vy);I.still=0;I.run=Math.min(1,I.run+dt*6)}
    else{I.still+=dt;I.run=Math.max(0,I.run-dt*5);}}
   I.px=bp[0];I.py=bp[1];
   if(I.ko&&typeof st!=='undefined'&&!st.animating){I.ko=false;I.mode='idle'}
   draw.push({I,cx,cy,w,hop,op})});
  /* w spoczynku: przodem do najbliższego przeciwnika albo między dwóch podobnie bliskich */
  const tmOf=I=>(typeof teamOfCh==='function')?teamOfCh(I.ch==='Owca'?'Pasterz':I.ch):null;
  draw.forEach(d=>{const I=d.I;if(I.mode!=='idle'||now<I.lock||I.still<0.35||I.px===null)return;const tm=tmOf(I);
   const en=draw.filter(o=>o.I!==I&&o.I.px!==null&&!(I.ch==='Owca'&&o.I.ch==='Pasterz')&&!(I.ch==='Pasterz'&&o.I.ch==='Owca')&&o.I.ch!=='Owca'&&!(tm&&tmOf(o.I)===tm))
    .map(o=>{const dx=o.I.px-I.px,dy=o.I.py-I.py;return {dx,dy,d:Math.hypot(dx,dy/SE)}}).filter(o=>o.d>1).sort((a,b)=>a.d-b.d);
   if(!en.length)return;let vx=en[0].dx/en[0].d,vy=en[0].dy/en[0].d;
   if(en[1]&&en[1].d<en[0].d*1.25){vx+=en[1].dx/en[1].d;vy+=en[1].dy/en[1].d}
   if(Math.abs(vx)+Math.abs(vy)>0.05)faceTo(I,vx,vy)});
  /* ŚCISK: kilka postaci na jednym polu = kreskówkowy kłąb kurzu z ikonkami; w planowaniu własna postać się wyłania */
  {const groups=[],BG=window.__BRAWLG||{};draw.forEach(d=>{if(d.I.ch==='Owca'||d.I.run>0.25)return;let gg=groups.find(G=>Math.hypot(G.x-d.cx,G.y-d.cy)<d.w*0.3);if(!gg){gg={x:d.cx,y:d.cy,w:d.w,op:d.op,m:[],chs:[]};groups.push(gg)}
    gg.m.push(d);(BG[d.I.ch]||[d.I.ch]).forEach(c=>{if(!gg.chs.includes(c))gg.chs.push(c)})});
   const planning=typeof st!=='undefined'&&st.scr==='plan'&&!st.animating;
   groups.forEach(gg=>{if(gg.chs.length<2)return;const emCh=planning&&gg.chs.includes(st.ch)&&T[st.ch]?st.ch:null;
    gg.m.forEach(d=>{d.skip=true});
    if(emCh){const base=gg.m[0],E=T[emCh];if(!E.emT)E.emT=now;E.seen=true;draw.push(Object.assign({},base,{I:E,emerge:true,skip:false}))}
    draw.push({cloud:true,emg:!!emCh,cx:gg.x,cy:gg.y-0.01,w:gg.w,op:gg.op,mem:gg.chs.filter(c=>c!==emCh),key:gg.chs.slice().sort().join('|')})});
   Object.values(T).forEach(I=>{if(!draw.some(d=>d.emerge&&d.I===I))I.emT=0})}
  draw.sort((a,b)=>a.cy-b.cy);
  draw.forEach(d=>{if(d.cloud)brawl(d,now);else if(!d.skip)paint(d,dt,now)});
  /* "rentgen": postać schowana za wyższą postacią stojącą bliżej widza jest dorysowana półprzezroczyście */
  draw.forEach((d,i)=>{const a=d.bb;if(!a)return;let cov=0;for(let j=i+1;j<draw.length;j++){const b=draw[j].bb;if(!b)continue;
    const ix=Math.max(0,Math.min(a[2],b[2])-Math.max(a[0],b[0])),iy=Math.max(0,Math.min(a[3],b[3])-Math.max(a[1],b[1]));cov=Math.max(cov,ix*iy/((a[2]-a[0])*(a[3]-a[1])))}
   if(cov>0.3){g.save();g.globalAlpha=0.4*d.op;g.setTransform(d.tf[0],d.tf[1],d.tf[2],d.tf[3],d.tf[4],d.tf[5]);g.drawImage(d.im,d.dr[0],d.dr[1],d.dr[2],d.dr[3]);g.restore()}});
  Object.values(T).forEach(I=>{if(!I.seen)I.px=null})}
 const PORT={};function port(ch){if(PORT[ch]!==undefined)return PORT[ch];PORT[ch]=null;if(typeof IMG!=='undefined'&&IMG[ch]){const im=new Image();im.onload=()=>PORT[ch]=im;im.src=IMG[ch]}return null}
 function brawl(D,now){const {cx,cy,w}=D,t=now/1000,R=w*0.95,X=cx*DPR,Y=cy*DPR,k=DPR;let sd=0;for(const c of D.key)sd=(sd*31+c.charCodeAt(0))%997;
  g.save();g.globalAlpha=D.op;const sx=Math.sin(t*23)*w*0.02*k,sy=Math.cos(t*19)*w*0.015*k;g.translate(X+sx,Y-R*0.75*k+sy);
  /* cień */
  g.fillStyle='rgba(30,40,20,.28)';g.beginPath();g.ellipse(-sx,R*0.75*k,R*1.05*k,R*0.3*k,0,0,7);g.fill();
  /* kłęby: najpierw kontur, potem wypełnienie */
  const P=[];for(let i=0;i<11;i++){const a=i/11*Math.PI*2+sd,rr=R*(0.62+0.12*Math.sin(t*9+i*2.1)),r0=R*(0.36+0.08*Math.sin(t*11+i*1.7));P.push([Math.cos(a)*rr*1.15,Math.sin(a)*rr*0.72,r0])}
  P.push([0,0,R*0.62]);
  g.fillStyle='#3a2414';P.forEach(([x,y,r])=>{g.beginPath();g.arc(x*k,y*k,(r+w*0.035)*k,0,7);g.fill()});
  g.fillStyle='#e9d6ae';P.forEach(([x,y,r])=>{g.beginPath();g.arc(x*k,y*k,r*k,0,7);g.fill()});
  g.fillStyle='#fbf2dc';P.forEach(([x,y,r])=>{g.beginPath();g.arc((x-r*0.25)*k,(y-r*0.3)*k,r*0.55*k,0,7);g.fill()});
  /* gwiazdki i kreski akcji */
  for(let i=0;i<5;i++){const ph=(t*1.6+i/5+sd*0.01)%1,a=i*1.3+sd+Math.floor(t*1.6+i/5)*2.4,d=R*(0.9+ph*0.7);const x=Math.cos(a)*d*1.2*k,y=Math.sin(a)*d*0.8*k;
   g.save();g.globalAlpha=D.op*(1-ph);g.translate(x,y);g.rotate(t*6+i);const s=w*0.07*k*(1-ph*0.4);g.beginPath();for(let j=0;j<10;j++){const rr=j%2?s*0.45:s;g.lineTo(Math.cos(j*Math.PI/5)*rr,Math.sin(j*Math.PI/5)*rr)}g.closePath();
   g.fillStyle=i%2?'#ffd84a':'#ff7a3c';g.strokeStyle='#3a2414';g.lineWidth=1.5*k;g.fill();g.stroke();g.restore()}
  g.strokeStyle='#3a2414';g.lineCap='round';g.lineWidth=2.2*k;for(let i=0;i<4;i++){const a=t*3+i*1.57+sd;const r1=R*1.05,r2=R*1.3;g.beginPath();g.moveTo(Math.cos(a)*r1*1.15*k,Math.sin(a)*r1*0.75*k);g.lineTo(Math.cos(a)*r2*1.15*k,Math.sin(a)*r2*0.75*k);g.stroke()}
  /* ikonki uczestników wyskakujące z kłębu */
  const n=D.mem.length,ir=w*0.24;
  D.mem.forEach((ch,i)=>{const a=(i/n)*Math.PI*2+t*1.8+sd,bob=Math.abs(Math.sin(t*7+i*2))*w*0.05,x=(D.emg?(i%2?1:-1)*R*(1.0+0.08*Math.sin(t*2+i))+Math.cos(a)*R*0.08:Math.cos(a)*R*0.42)*k,y=(D.emg?-R*0.15+Math.sin(a)*R*0.12-bob:Math.sin(a)*R*0.28-bob)*k;
   const im=port(ch);g.save();g.translate(x,y);g.beginPath();g.arc(0,0,(ir+2)*k,0,7);g.fillStyle='#3a2414';g.fill();
   g.beginPath();g.arc(0,0,ir*k,0,7);g.fillStyle=(typeof C!=='undefined'&&C[ch]&&C[ch].col)||'#888';g.fill();
   if(im){g.save();g.beginPath();g.arc(0,0,(ir-1)*k,0,7);g.clip();g.drawImage(im,-ir*k,-ir*k,ir*2*k,ir*2*k);g.restore()}
   const tm=(typeof teamOfCh==='function'&&typeof TCOL!=='undefined')?teamOfCh(ch):null;if(tm&&TCOL[tm]){g.lineWidth=2.5*k;g.strokeStyle=TCOL[tm];g.beginPath();g.arc(0,0,ir*k,0,7);g.stroke()}
   g.restore()});
  /* napis */
  g.save();g.translate(0,R*0.72*k);g.rotate(Math.sin(t*5)*0.08);const fs=Math.round(w*0.36*k);g.font='400 '+fs+'px Bangers, Impact, sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';
  g.lineWidth=fs*0.22;g.strokeStyle='#3a2414';g.strokeText('BÓJKA!',0,0);g.fillStyle='#ffd84a';g.fillText('BÓJKA!',0,0);g.restore();
  g.restore()}
 function paint(D,dt,now){const {I,cx,cy,w,hop,op}=D;
  I.mt+=dt;
  if(I.ft>0){const was=I.ft;I.ft-=dt;if(was>0.085&&I.ft<=0.085&&I.pend!==null){I.dir=I.pend;I.pend=null;const nf=IDLE[I.dir][1];if(nf)I.fx=nf}if(I.ft<=0){I.ft=0;if(I.pend!==null&&I.pend!==undefined)I.ft=0.17}}
  const turn=I.ft>0?Math.abs(I.ft-0.085)/0.085:1;
  const t=now/1000+I.ph;let sx=1,sy=1,ox=0,oy=0,rot=0,flash=0,alpha=op;
  if(D.emerge&&I.emT){const e=Math.min(1,(now-I.emT)/450),b=e<1?(1-Math.pow(1-e,3))*(1+0.25*Math.sin(e*Math.PI)):1;sx*=0.3+0.7*b;sy*=0.3+0.7*b;oy+=(1-b)*w*0.3}let [img,fx]=view(I,false);
  /* oddech + chód */
  sy*=1+0.018*Math.sin(t*2.4);sx*=1-0.01*Math.sin(t*2.4);
  if(I.run>0){oy-=Math.abs(Math.sin(t*13))*w*0.07*I.run;rot+=Math.sin(t*13)*0.06*I.run}
  const m=I.mode,mt=I.mt;
  const av=I.av,ux=av[0],uy=av[1];
  if(m==='attack'){const D=0.8;if(mt>D)play(I,'idle');else if(mt<0.08){const k=ease(mt/0.08);ox-=ux*w*0.07*k;oy-=uy*w*0.04*k;sy*=1-0.06*k;sx*=1+0.05*k}
    else{[img,fx]=view(I,true);const a=mt<0.19?ease((mt-0.08)/0.11):1-ease((mt-0.55)/0.25);ox+=ux*w*0.2*Math.max(0,a);oy+=uy*w*0.12*Math.max(0,a);
     if(mt<0.15){const k=1-(mt-0.08)/0.07;sx*=1+0.12*k;sy*=1-0.08*k}}}
  else if(m==='charge'){const D=I.cd||0.8;if(mt>D)play(I,'idle');else{[img,fx]=view(I,true);rot+=Math.sin(t*16)*0.04;oy-=Math.abs(Math.sin(t*16))*w*0.04}}
  else if(m==='cast'){const D=0.7;if(mt>D)play(I,'idle');else{[img,fx]=view(I,mt>0.12);const a=mt<0.22?ease(mt/0.22):1-ease((mt-0.45)/0.25);ox+=ux*w*0.08*Math.max(0,a);oy+=uy*w*0.05*Math.max(0,a)}}
  else if(m==='hit'){const D=0.45;if(mt>D)play(I,'idle');else{const k=1-mt/D;flash=k;ox+=Math.sin(mt*70)*w*0.05*k;ox-=fx*w*0.06*k;rot-=fx*0.1*k}}
  else if(m==='ko'){const k=ease(mt/0.5);rot+=-fx*1.35*k;alpha*=1-0.35*k;oy+=w*0.05*k}
  else if(m==='win'){if(mt>1.6)play(I,'idle');else{oy-=Math.abs(Math.sin(mt*Math.PI*2.5))*w*0.28;img=pick(I,6)}}
  const im=I.ims[img],A=(typeof SPRA!=='undefined'&&SPRA[I.ch])||null,n=I.ims.length;const hgt=(SZ[I.ch]||2.2)*w*((A&&A[n+img])||1),wid=im.width*hgt/im.height,ax=(A&&A[img])||.5;
  const X=(cx+ox)*DPR,Y=(cy-Math.max(0,hop)+oy)*DPR;
  g.save();g.globalAlpha=alpha;
  /* cień */
  const sh=Math.max(0.35,1-Math.max(0,hop)/(w*1.2));g.fillStyle='rgba(30,40,20,'+(0.28*sh)+')';g.beginPath();g.ellipse((cx+ox*0.6)*DPR,cy*DPR,w*0.36*DPR*sh,w*0.13*DPR*sh,0,0,7);g.fill();
  g.translate(X,Y);g.rotate(rot);g.scale(fx*sx*turn*DPR,sy*DPR);
  {const tm=(typeof teamOfCh==='function'&&typeof TCOL!=='undefined')?teamOfCh(I.ch==='Owca'?'Pasterz':I.ch):null;
   if(tm&&TCOL[tm]){const o=outl(I,img,TCOL[tm]),k2=hgt/im.height;g.drawImage(o.c,-wid*ax-o.p*k2,-hgt-o.p*k2,o.c.width*k2,o.c.height*k2)}}
  g.drawImage(im,-wid*ax,-hgt,wid,hgt);
  {const m=g.getTransform();D.tf=[m.a,m.b,m.c,m.d,m.e,m.f];D.im=im;D.dr=[-wid*ax,-hgt,wid,hgt];const X0=X-wid*(fx>0?ax:1-ax)*DPR,Y0=Y-hgt*DPR;D.bb=[X0+wid*DPR*0.2,Y0+hgt*DPR*0.1,X0+wid*DPR*0.8,Y];}
  if(flash>0){g.globalAlpha=alpha*flash*0.85;g.drawImage(I.sils[img],-wid*ax,-hgt,wid,hgt)}
  g.restore()
  {const nk=(typeof hfNickOfCh==='function')?hfNickOfCh(I.ch):null;if(nk){g.save();g.globalAlpha=op;g.font='800 '+Math.round(11*DPR)+'px system-ui,sans-serif';g.textAlign='center';g.lineJoin='round';g.lineWidth=3.5*DPR;g.strokeStyle='rgba(20,12,6,.9)';g.fillStyle='#ffe9a8';const ty=Y-(hgt+6)*DPR;g.strokeText(nk,X,ty);g.fillText(nk,X,ty);g.restore()}}}
 function cell(c){try{return cellC(c)}catch(e){return null}}
 function faceP(I,a,b,ms){if(!a||!b)return;const dx=b[0]-a[0],dy=b[1]-a[1];if(Math.abs(dx)+Math.abs(dy)<1)return;
  faceTo(I,dx,dy);const L=Math.hypot(dx,dy/SE)||1;I.av=[dx/L,dy/L];if(I.ft>0&&I.pend!==null){I.dir=I.pend;I.pend=null;I.ft=0.085;const nf=IDLE[I.dir][1];if(nf)I.fx=nf}const now=performance.now();I.lock=Math.max(I.lock,now+ms);I.hold=Math.max(I.hold,now+ms+900);I.still=0}
 function bpos(id){const p=(typeof st!=='undefined'&&st.curPos)?st.curPos[id]:null;return p?[p[0],p[1]]:null}
 let ATT=null;
 /* cel ataku: środek trafianych pól (albo pole końcowe) */
 function aim(e){const cs=(e.cells||[]).map(cell).filter(Boolean);if(e.end){const c=cell(e.end);if(c)return c}if(cs.length){let x=0,y=0;cs.forEach(c=>{x+=c[0];y+=c[1]});return [x/cs.length,y/cs.length]}return null}
 function ev(e){if(state!==2)return;const ch=(typeof chOfId==='function')?chOfId(e.id):null;const I=ch&&T[ch],now=performance.now();
  if(e.k==='atk'){const a=cell(e.from),b=aim(e);ATT={id:e.id,p:a,t:now};if(I){faceP(I,a,b,1700);play(I,'attack')}}
  else if(e.k==='charge'){const a=cell(e.from),b=cell(e.to),dur=Math.max(520,260*Math.max(1,e.steps||1));ATT={id:e.id,p:b,t:now};
   if(I){faceP(I,a,b,dur+1300);I.cd=dur/1000+0.35;play(I,'charge')}}
  else if(e.k==='scharge'&&!e.none){const b=cell(e.to);ATT={id:e.id,p:b,t:now};if(I){faceP(I,bpos(e.id),b,1500);play(I,'cast')}
   const O=T['Owca'];if(O&&O.px!==null){faceP(O,[O.px,O.py],b,1800);O.cd=Math.max(420,200*Math.max(1,e.steps||1))/1000+0.3;play(O,'charge')}}
  else if(e.k==='drone'&&!e.none){const b=cell(e.to);ATT={id:e.id,p:b,t:now};if(I){faceP(I,bpos(e.id),b,1800)}}
  else if((e.k==='puddle'||e.k==='summon')&&!e.none&&I){faceP(I,bpos(e.id),cell(e.to),1300);play(I,e.k==='summon'?'cast':'attack')}
  else if(e.k==='dmg'&&I&&!I.ko){if(ATT&&ATT.id!==e.id&&now-ATT.t<4500&&e.w!=='strefa'&&e.w!=='ścisk')faceP(I,bpos(e.id),ATT.p,1600);play(I,'hit')}
  else if((e.k==='knock'||e.k==='push')&&I&&!I.ko){I.lock=Math.max(I.lock,now+1100);I.hold=Math.max(I.hold,now+2000);play(I,'hit')}
  else if(e.k==='out'&&I){play(I,'ko');I.ko=true}}
 function win(ch){const I=T[ch];if(I)play(I,'win')}
 return {get _t(){return T},init,ev,win,setEnabled,enabled,get ready(){return state===2}}})();
/* zgodność: plansza 3D ładuje three.js przez G3D.libs() */
if(typeof G3D==='undefined'){var G3D=(function(){let P=null;const ls=s=>new Promise((res,rej)=>{const e=document.createElement('script');e.src=s;e.onload=res;e.onerror=rej;document.head.appendChild(e)});
 return {libs(){if(!P)P=(async()=>{if(typeof THREE==='undefined')await ls('https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js')})();return P},ev(){},win(){},enabled(){return false},setEnabled(){},init(){}}})()}
/* znaczniki pozycji w żetonach (stopy i szerokość podstawki) */
/* które postacie stoją razem na jednym polu (plansza rysuje wtedy jeden żeton) */
window.__BRAWLG={};
const _bdBR=board;
board=function(hl){const G2={};try{Object.values(hl||{}).forEach(h=>{if(!h||!h.t)return;const ids=[...new Set([...String(h.t)].filter(c=>INI[c]).map(c=>INI[c]))];if(ids.length>1)G2[ids[0]]=ids})}catch(e){}window.__BRAWLG=G2;return _bdBR.apply(this,arguments)};
const _standee2=standee;
standee=function(ch,delay){return '<g data-s3="'+ch+'"><circle class="s3p" cx="0" cy="4" r="0.5" fill="none" stroke="none"/><rect class="s3w" x="-32" y="3.5" width="64" height="1" fill="none" stroke="none"/>'+_standee2(ch,delay)+'</g>'};
const _sheepArt2=sheepArt;
sheepArt=function(){return '<g data-s3="Owca"><circle class="s3p" cx="0" cy="6" r="0.5" fill="none" stroke="none"/><rect class="s3w" x="-32" y="5.5" width="64" height="1" fill="none" stroke="none"/>'+_sheepArt2()+'</g>'};
addRender('fx/sprites2d',_r2dB=>function(){_r2dB();try{if(document.querySelector('#stage svg'))S2D.init()}catch(e){}});
render();
/* przełączniki w panelu dźwięku */
const _sndPanel2=sndPanel;
sndPanel=function(){_sndPanel2();const el=document.getElementById('sndPanel');if(!el)return;const sm=el.querySelector('small');
 const b=document.createElement('button');b.setAttribute('data-s2d','1');b.textContent=S2D.enabled()?'Postacie rysunkowe: włączone':'Postacie rysunkowe: wyłączone';if(sm)el.insertBefore(b,sm);else el.appendChild(b);
 if(typeof B3D!=='undefined'){const c=document.createElement('button');c.setAttribute('data-b3d','1');c.textContent=B3D.enabled()?'Nowa plansza: włączona':'Nowa plansza: wyłączona';if(sm)el.insertBefore(c,sm);else el.appendChild(c)}};
addClick('fx/sprites2d#1',document,e=>{const t=e.target.closest&&e.target.closest('[data-s2d]');if(!t)return;e.stopImmediatePropagation();
 const v=!S2D.enabled();S2D.setEnabled(v);t.textContent=v?'Postacie rysunkowe: włączone':'Postacie rysunkowe: wyłączone'},true);
addClick('fx/sprites2d#2',document,e=>{const t=e.target.closest&&e.target.closest('[data-b3d]');if(!t||typeof B3D==='undefined')return;e.stopImmediatePropagation();
 const v=!B3D.enabled();B3D.setEnabled(v);t.textContent=v?'Nowa plansza: włączona':'Nowa plansza: wyłączona'},true);

/* przełącznik efektów cząsteczkowych (fx/particles.js) w panelu dźwięku */
const _sndPanel3=sndPanel;
const pfxOn=()=>{try{return localStorage.getItem('hf_pfx')!=='0'}catch(e){return true}};
sndPanel=function(){_sndPanel3();const el=document.getElementById('sndPanel');if(!el)return;const sm=el.querySelector('small');
 const b=document.createElement('button');b.setAttribute('data-pfx','1');b.textContent=pfxOn()?'Efekty cząsteczkowe: włączone':'Efekty cząsteczkowe: wyłączone';if(sm)el.insertBefore(b,sm);else el.appendChild(b)};
addClick('fx/sprites2d#3',document,e=>{const t=e.target.closest&&e.target.closest('[data-pfx]');if(!t)return;e.stopImmediatePropagation();
 const v=!pfxOn();try{localStorage.setItem('hf_pfx',v?'1':'0')}catch(x){}if(!v)PFX.clear();t.textContent=v?'Efekty cząsteczkowe: włączone':'Efekty cząsteczkowe: wyłączone';if(v)PFX.play('dice',0,-40)},true);
