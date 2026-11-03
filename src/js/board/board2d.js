/* ===================== PLANSZA RYSUNKOWA (styl "mobilny cartoon"): wyspa z trawiastych heksów, klify, morze ===================== */
const B3D=(function(){
 const GEO0=JSON.parse(JSON.stringify(GEO)),BG0=BG;
 let url=null,busy=false,applied=false,err='',RB=3;const URLS={};
 const enabled=()=>{try{return localStorage.getItem('hf_b3d')!=='0'}catch(e){return true}};
 const L=(function(){const P=Object.keys(GEO0).map(k=>{const [q,r]=k.split(',').map(Number);return [q,r,GEO0[k].c[0],GEO0[k].c[1]]});
  const lin=(xs,ys)=>{const n=xs.length,mx=xs.reduce((a,b)=>a+b,0)/n,my=ys.reduce((a,b)=>a+b,0)/n;let sxy=0,sxx=0;for(let i=0;i<n;i++){sxy+=(xs[i]-mx)*(ys[i]-my);sxx+=(xs[i]-mx)*(xs[i]-mx)}const a=sxy/sxx;return [my-a*mx,a]};
  const [x0,ax]=lin(P.map(p=>p[0]),P.map(p=>p[2])),[y0,ay]=lin(P.map(p=>p[1]+p[0]/2),P.map(p=>p[3]));return {x0,ax,y0,ay,s:ax/1.5}})();
 const SEB=Math.sin(40*Math.PI/180);
 const cxy=(q,r)=>[L.x0+L.ax*q,L.y0+Math.sqrt(3)*L.s*SEB*(r+q/2)];
 function geoReg(){const o={};Object.keys(GEO0).forEach(k=>{const [q,r]=k.split(',').map(Number),c=cxy(q,r),R=L.s*0.92,p=[];
   for(let i=0;i<6;i++){const a=i*Math.PI/3;p.push(Math.round(R*Math.cos(a))+','+Math.round(R*Math.sin(a)*SEB))}
   o[k]={c:[+c[0].toFixed(1),+c[1].toFixed(1)],p:p.join(' ')}});return o}
 let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};const rr=(a,b)=>a+(b-a)*rnd();
 const hexd=(q,r)=>Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r));
 function hexPath(g,c,R,dy){g.moveTo(c[0]+R,c[1]+(dy||0));for(let i=1;i<6;i++){const a=i*Math.PI/3;g.lineTo(c[0]+R*Math.cos(a),c[1]+R*Math.sin(a)*SEB+(dy||0))}g.closePath()}
 function blot(g,x,y,r,col,a){const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,col.replace('A',a));gr.addColorStop(1,col.replace('A',0));g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill()}
 function load(src){return new Promise(res=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>res(null);im.src=src})}
 async function paint(S){seed=11;const out=document.createElement('canvas');out.width=out.height=S;const g=out.getContext('2d');
  const k=S/1024;g.setTransform(k,0,0,k,17*k,0); /* jednostki planszy: x∈[-17,1007], y∈[0,1024] */
  const R=L.s*0.985,CL=46; /* wysokość klifu */
  /* --- morze --- */
  const sea=g.createLinearGradient(0,0,0,1024);sea.addColorStop(0,'#3b9ee6');sea.addColorStop(.5,'#2f8ad8');sea.addColorStop(1,'#2576c4');g.fillStyle=sea;g.fillRect(-17,0,1024,1024);
  for(let i=0;i<160;i++){const x=rr(-17,1007),y=rr(0,1024);g.strokeStyle='rgba(255,255,255,'+rr(.08,.22)+')';g.lineWidth=rr(1.5,3);g.beginPath();const w=rr(10,34);g.moveTo(x-w,y);g.quadraticCurveTo(x,y-rr(2,5),x+w,y);g.stroke()}
  /* --- kształt wyspy: pierścienie 0..4, narożniki pierścienia 4 częściowo usunięte; dodatkowe pola u góry i dołu --- */
  const isl=[];for(let q=-6;q<=6;q++)for(let r=-6;r<=6;r++){const d=hexd(q,r);let inn=d<=RB+1;
   if(d===RB+1){const E=RB+1,corner=(Math.abs(q)===E&&(r===0||r===-q))||(Math.abs(r)===E&&q===0)||(Math.abs(q+r)===E&&(q===0||r===0));if(corner&&rnd()<0.55)inn=false;if(rnd()<0.12)inn=false}
   if(d===5&&Math.abs(q)<=1)rnd();
   if(inn)isl.push([q,r,cxy(q,r)])}
  isl.sort((a,b)=>a[2][1]-b[2][1]);
  /* piana i płycizna wokół */
  g.save();g.fillStyle='rgba(120,215,240,.45)';g.beginPath();isl.forEach(c=>hexPath(g,c[2],R*1.22,CL+6));g.fill();g.restore();
  g.save();g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=7;g.lineJoin='round';g.beginPath();isl.forEach(c=>hexPath(g,c[2],R*1.06,CL+4));g.stroke();
  g.fillStyle='#fff';g.beginPath();isl.forEach(c=>hexPath(g,c[2],R*1.03,CL+3));g.fill();g.restore();
  /* klify: tylko krawędzie od strony widza bez sąsiada na wyspie */
  const has=new Set(isl.map(c=>c[0]+','+c[1])),NB=[[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]];
  const ctex=document.createElement('canvas');ctex.width=ctex.height=256;{const t=ctex.getContext('2d');const cg=t.createLinearGradient(0,0,0,256);cg.addColorStop(0,'#b88b5c');cg.addColorStop(1,'#93673f');t.fillStyle=cg;t.fillRect(0,0,256,256);
   for(let i=0;i<220;i++){const x=rr(0,256),y=rr(0,256);t.fillStyle=rnd()<.5?'rgba(90,56,30,'+rr(.15,.35)+')':'rgba(222,184,132,'+rr(.12,.3)+')';t.beginPath();t.ellipse(x,y,rr(6,18),rr(3,8),0,0,7);t.fill()}
   t.strokeStyle='rgba(80,48,26,.5)';t.lineWidth=1.6;for(let i=0;i<160;i++){const x=rr(0,256),y=rr(0,256);t.beginPath();t.moveTo(x,y);t.lineTo(x+rr(-2,2),y+rr(8,20));t.stroke()}}
  const cpat=g.createPattern(ctex,'repeat');
  isl.forEach(c=>{const [q,r]=c;for(let i=0;i<3;i++){if(has.has((q+NB[i][0])+','+(r+NB[i][1])))continue;
   const a0=i*Math.PI/3,a1=(i+1)*Math.PI/3,p0=[c[2][0]+R*Math.cos(a0),c[2][1]+R*Math.sin(a0)*SEB],p1=[c[2][0]+R*Math.cos(a1),c[2][1]+R*Math.sin(a1)*SEB];
   g.beginPath();g.moveTo(p0[0],p0[1]-1);g.lineTo(p1[0],p1[1]-1);g.lineTo(p1[0],p1[1]+CL);g.lineTo(p0[0],p0[1]+CL);g.closePath();g.fillStyle=cpat;g.fill();
   const sh=i===0?'rgba(255,230,190,.18)':i===2?'rgba(40,20,10,.22)':'rgba(0,0,0,0)';g.fillStyle=sh;g.fill();
   g.strokeStyle='rgba(70,40,20,.6)';g.lineWidth=2;g.beginPath();g.moveTo(p0[0],p0[1]+CL);g.lineTo(p1[0],p1[1]+CL);g.stroke()}});
  /* wierzch wyspy (trawa) */
  const top=new Path2D();isl.forEach(c=>{const p=new Path2D();hexPath(p,c[2],R,0);top.addPath(p)});
  g.save();g.clip(top);g.fillStyle='#86c34f';g.fillRect(-17,0,1024,1024);
  for(let i=0;i<420;i++){const x=rr(-17,1007),y=rr(0,1024);blot(g,x,y,rr(18,70),rnd()<.5?'rgba(160,214,96,A)':'rgba(92,150,52,A)',rr(.18,.4))}
  for(let i=0;i<2600;i++){const x=rr(-17,1007),y=rr(0,1024),h=rr(4,10);g.strokeStyle=rnd()<.6?'rgba(70,128,40,.55)':'rgba(190,232,120,.6)';g.lineWidth=rr(1,2);g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+rr(-2,2),y-h*.6,x+rr(-3,3),y-h);g.stroke()}
  /* brzeg: ciemniejszy pas przy krawędzi klifu */
  const edge=new Path2D();isl.forEach(c=>{const [q,r]=c;for(let i=0;i<6;i++){if(has.has((q+NB[i][0])+','+(r+NB[i][1])))continue;const a0=i*Math.PI/3,a1=(i+1)*Math.PI/3;
    edge.moveTo(c[2][0]+R*Math.cos(a0),c[2][1]+R*Math.sin(a0)*SEB);edge.lineTo(c[2][0]+R*Math.cos(a1),c[2][1]+R*Math.sin(a1)*SEB)}});
  g.lineCap='round';g.strokeStyle='rgba(58,108,34,.6)';g.lineWidth=12;g.stroke(edge);g.strokeStyle='rgba(196,238,135,.75)';g.lineWidth=3.5;g.stroke(edge);
  /* pola gry: delikatne wydeptane plamy + jasne linie heksów */
  Object.keys(GEO0).forEach(kk=>{const [q,r]=kk.split(',').map(Number),c=cxy(q,r);if(hexd(q,r)>RB)return;
   if(rnd()<0.28){blot(g,c[0]+rr(-20,20),c[1]+rr(-10,10),rr(22,38),'rgba(176,140,86,A)',rr(.35,.6))}
   g.save();g.beginPath();hexPath(g,c,L.s*0.95,0);g.clip();const hg=g.createRadialGradient(c[0],c[1]-10,5,c[0],c[1],L.s);hg.addColorStop(0,'rgba(255,255,210,.10)');hg.addColorStop(1,'rgba(40,80,20,.10)');g.fillStyle=hg;g.fillRect(c[0]-L.s,c[1]-L.s,L.s*2,L.s*2);g.restore()});
  g.lineJoin='round';g.strokeStyle='rgba(60,95,30,.35)';g.lineWidth=4;g.beginPath();Object.keys(GEO0).forEach(kk=>{const [q,r]=kk.split(',').map(Number);if(hexd(q,r)<=RB)hexPath(g,cxy(q,r),L.s*0.97,1.5)});g.stroke();
  g.strokeStyle='rgba(250,240,175,.85)';g.lineWidth=2.4;g.beginPath();Object.keys(GEO0).forEach(kk=>{const [q,r]=kk.split(',').map(Number);if(hexd(q,r)<=RB)hexPath(g,cxy(q,r),L.s*0.97,0)});g.stroke();
  g.restore();
  /* --- rekwizyty na polach poza planszą gry --- */
  const P=typeof PROPS2D!=='undefined'?await Promise.all(Object.keys(PROPS2D).map(async n=>[n,await load(PROPS2D[n])])):[];const PI={};P.forEach(([n,im])=>{if(im)PI[n]=im});
  const spots=isl.filter(c=>hexd(c[0],c[1])>=RB+1).map(c=>c[2]);
  const put=(n,x,y,h)=>{const im=PI[n]||PI[n.replace(/2$/,'')];if(!im)return;const s=h/im.height,w=im.width*s;g.save();g.fillStyle='rgba(30,50,20,.28)';g.beginPath();g.ellipse(x,y,w*0.42,w*0.13,0,0,7);g.fill();g.drawImage(im,x-w/2,y-h+h*0.06,w,h);g.restore()};
  const order=['bush','rock','flowers','crate','bush2','rock2','flowers','barrel','bush','tires','rock','flowers2','crate','bush2'];
  const items=[];spots.forEach((c,i)=>{if(rnd()<0.18)return;const n=order[i%order.length];const big={bush:96,bush2:92,rock:88,rock2:50,crate:76,barrel:86,tires:82,flowers:40,flowers2:36}[n]||60;
   items.push([n,c[0]+rr(-14,14),c[1]+rr(-6,8),big*rr(.85,1.15)]);
   if(rnd()<0.5)items.push([rnd()<.5?'flowers':'flowers2',c[0]+rr(-34,34),c[1]+rr(10,22),26*rr(.8,1.1)])});
  /* drobne kwiatki na trawie między polami gry */
  items.sort((a,b)=>a[2]-b[2]).forEach(it=>put(...it));
  try{await Promise.race([document.fonts.load('100px Bangers'),new Promise(r=>setTimeout(r,2500))])}catch(e){}
  return out}
 async function make(){const S=2048;const out=await paint(S);
  const blob=await new Promise(r=>{try{out.toBlob(b=>r(b),'image/jpeg',0.9)}catch(e){r(null)}});
  if(blob){const u=URL.createObjectURL(blob);const ok=await new Promise(r=>{const im=new Image();im.onload=()=>r(true);im.onerror=()=>r(false);im.src=u});if(ok)return u}
  return out.toDataURL('image/jpeg',0.9)}
 function setGeo(reg){const src=reg?geoReg():GEO0;Object.keys(GEO).forEach(k=>delete GEO[k]);Object.keys(src).forEach(k=>GEO[k]={c:src[k].c.slice(),p:src[k].p})}
 function apply(){if(!url||!enabled())return;if(typeof st!=='undefined'&&st.animating){setTimeout(apply,500);return}BG=url;setGeo(true);applied=true;try{render()}catch(e){}}
 function restore(){if(!applied)return;if(typeof st!=='undefined'&&st.animating){setTimeout(restore,500);return}BG=BG0;setGeo(false);applied=false;try{render()}catch(e){}}
 async function go(){if(busy||!enabled())return;if(URLS[RB]){url=URLS[RB];apply();return}busy=true;const r0=RB;try{const u=await make();URLS[r0]=u;if(r0===RB){url=u;apply()}}catch(e){err=String(e&&e.message||e);console.warn('B2D',e)}finally{busy=false}if(r0!==RB)go()}
 function setR(r){if(r===RB)return;RB=r;if(URLS[RB]){url=URLS[RB];if(applied){BG=url;try{render()}catch(e){}}else go()}else go()}
 function setEnabled(v){try{localStorage.setItem('hf_b3d',v?'1':'0')}catch(e){}if(v)go();else restore()}
 return {go,make,paint,setEnabled,setR,get R(){return RB},enabled,geoReg,get L(){return L},get status(){return (applied?'on':'off')+(busy?' busy':'')+(err?' err='+err:'')}}})();
setTimeout(()=>{try{B3D.go()}catch(e){}},300);

