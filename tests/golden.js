/* Złoty test zachowania Hobo Fighting.
   node golden.js <plik.html> <wynik.json> [szybki]
   Zapisuje: migawkę kodu globalnych funkcji i danych, wyniki silnika (losowe rundy), przebiegi gier i Bitwy baz. */
const {chromium}=require('playwright');const fs=require('fs'),crypto=require('crypto');
const FILE=process.argv[2],OUT=process.argv[3],QUICK=process.argv[4]==='q';
const NAMES=JSON.parse(fs.readFileSync(__dirname+'/names.json','utf8'));
const h=s=>crypto.createHash('sha1').update(s).digest('hex').slice(0,12);
const INIT=()=>{let s=12345;window.__seed=v=>{s=v>>>0||1};Math.random=function(){s=(s+0x6D2B79F5)|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
 let now=0;const _pn=performance.now.bind(performance);/* zegar zostaje prawdziwy – animacje go potrzebują */};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true});
 await ctx.route(/^https?:\/\//,r=>r.abort());const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(INIT);await p.goto('file://'+FILE);await p.waitForFunction(()=>typeof B3D!=='undefined'&&/^on/.test(B3D.status)&&!/busy/.test(B3D.status),null,{timeout:30000}).catch(()=>{});await p.waitForTimeout(800);
 const out={errs};
 /* 1. migawka kodu */
 out.snap=await p.evaluate(names=>{const o={};names.forEach(n=>{try{const v=(0,eval)(n);o[n]=typeof v==='function'?'F:'+v.toString():(typeof v==='object'&&v!==null)?'O:'+(()=>{try{return JSON.stringify(v,(k,x)=>typeof x==='function'?'fn:'+x.toString():x)}catch(e){return 'cyc'}})():typeof v+':'+String(v)}catch(e){o[n]='ERR:'+e.message}});return o},NAMES);
 for(const k in out.snap)out.snap[k]=h(out.snap[k].replace(/blob:[^"' )]+/g,'blob:X'));
 /* 2. silnik: losowe pojedyncze rundy */
 out.engine=await p.evaluate(QUICK=>{const res={};
  const R=seed=>{let s=seed>>>0||1;return ()=>{s=(s+0x6D2B79F5)|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
  const chars=Object.keys(C).filter(n=>n!=='Manekin');
  for(const gm of ['classic','special','test'])for(const tm of ['ffa','2v2'])for(const n of (tm==='2v2'?[4]:[2,3,4,5,6])){
   const key=gm+'/'+tm+'/'+n,arr=[];const N=QUICK?15:60;
   for(let c=0;c<N;c++){const rnd0=R(c*7919+n*31+gm.length*17+tm.length),TR=[];const rnd=()=>{const v=rnd0();TR.push(v.toFixed(4));return v};const ri=k=>Math.floor(rnd()*k);
    const pick=a=>a[ri(a.length)];
    st.gm=gm;st.tm2=tm;st.seed='g'+c;st.round=1+ri(12);
    const ch=((a)=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a})(chars.slice()).slice(0,n);
    const BR=n===2&&tm!=='2v2'?2:3;
    const cellsR=[];for(let q=-BR;q<=BR;q++)for(let r=-BR;r<=BR;r++)if(Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r))<=BR)cellsR.push([q,r]);
    const near=(p,k)=>{const o=cellsR.filter(c=>Math.max(Math.abs(c[0]-p[0]),Math.abs(c[1]-p[1]),Math.abs(c[0]-p[0]+c[1]-p[1]))<=k);return pick(o).slice()};
    const P=ch.map((cn,i)=>{const pos=pick(cellsR).slice(),q={ch:cn,posr:{},plans:{},hpr:{},hpo:{},got:{},pts:{},tm:tm==='2v2'?(i%2?'B':'A'):undefined};
     q.posr[st.round]=pos;q.hpr[st.round]=1+ri(MAXHP(cn));
     if(rnd()<.3){q.bon={k:1+ri(6)};if(rnd()<.5)q.bonR=st.round-1}
     if(cn==='Pasterz'&&rnd()<.6){q.sheepr={};q.sheepr[st.round]=near(pos,2)}
     if(cn==='Sierżant Przemo'&&rnd()<.5){q.dr={};q.dr[st.round]=true}
     if(rnd()<.15){q.push={};q.push[st.round]=near(pos,1)}
     if(cn==='Truchel'&&rnd()<.4)q.pud=[{k:near(pos,2).join(','),p:near(pos,2),r0:st.round-1-ri(2),o:'p'+i}];
     return q});
    H={n,cur:0,tgt:'plan',p:P};window.__BR=BR;
    try{cells.length=0;for(const c of cellsR)cells.push(c.slice())}catch(e){}
    P.forEach((q,i)=>{const np=nPh(q.ch),pl=[];let pos=q.posr[st.round];
     for(let ph=0;ph<np;ph++){st.ch=q.ch;let defs=[];try{defs=actDefs(q.ch,ph).filter(d=>!d.dis)}catch(e){defs=[{t:'move'},{t:'atk'}]}
      const d=pick(defs.length?defs:[{t:'move'}]);const a={t:d.t,m:null,d:null};
      if(a.t==='move'){a.m=near(pos,q.ch==='Byku'?2:1);pos=a.m}else if(a.t==='atk'||a.t==='staff')a.d=ri(6);else if(a.t==='drone'&&ph===0){}else a.m=near(pos,2);
      if(a.t==='atk'&&rnd()<.2)a.bd=1;pl.push(a)}
     q.plans[st.round]=pl;if(rnd()<.1){q.dg={};q.dg[st.round]=near(pos,1)}});
    const IN=TR.length+':'+chars.join(',')+':'+ch.join(',')+'#'+JSON.stringify(P)+'|'+st.round+'|'+st.seed;window.__seed(c+1);try{ICACHE={}}catch(e){}st._fin=null;let r;try{r=JSON.stringify(resolve(P.map((q,i)=>({id:'p'+i,q,idx:i}))))}catch(e){r='ERR '+e.message}
    arr.push(IN+'=>'+r)}
   res[key]=arr}
  H=null;window.__BR=3;try{cells.length=0;for(let q=-3;q<=3;q++)for(let r=Math.max(-3,-q-3);r<=Math.min(3,-q+3);r++)cells.push([q,r])}catch(e){}
  return res},QUICK);
 const engHash={};for(const k in out.engine){engHash[k]=out.engine[k].map(h)}out.engineRaw=out.engine;out.engine=engHash;
 /* 3. Bitwa baz: pełne rundy */
 out.mb=await p.evaluate(QUICK=>{const res={};
  const R=seed=>{let s=seed>>>0||1;return ()=>{s=(s+0x6D2B79F5)|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
  const chars=Object.keys(C).filter(n=>n!=='Manekin');
  for(const [mode,maps] of [['1v1',[0,1,2,3]],['2v2',[0,1,2,3]],['3v3',[0,3]]])for(const mi of maps)for(let g=0;g<(QUICK?1:3);g++){
   const rnd=R(1000+g*101+mi*13+mode.charCodeAt(0));const ri=k=>Math.floor(rnd()*k),pick=a=>a[ri(a.length)];
   window.__seed(777+g*31+mi);MB.newGame(mode,mi);const G=MB.G;const chs=((a)=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a})(chars.slice());
   G.heroes.forEach((hh,i)=>{hh.ch=chs[i%chs.length];hh.lvl=1+ri(4);hh.pos=G.bases[hh.team].pos.slice();hh.hp=MB.maxHp(hh)});
   const snaps=[];
   for(let r=0;r<(QUICK?4:8);r++){window.__seed(5000+r+g*97+mi*7);
    G.heroes.forEach((hh,hi)=>{if(hh.dead||!hh.pos){hh.plans=null;return}const pl=[];let pos=hh.pos.slice();
     for(let ph=0;ph<2;ph++){let ks=[];try{ks=MB.kit(hh,ph,pl).filter(x=>!x.dis)}catch(e){ks=[{t:'stay'}]}const k=pick(ks);const a={t:k.t,m:null,d:null};
      if(a.t==='move'){const cand=Object.values(G.cells).filter(c=>{const d=Math.max(Math.abs(c.p[0]-pos[0]),Math.abs(c.p[1]-pos[1]),Math.abs(c.p[0]-pos[0]+c.p[1]-pos[1]));return d>=1&&d<=2&&c.t!=='r'&&c.t!=='w'});if(cand.length){a.m=pick(cand).p.slice();pos=a.m.slice()}else a.t='stay'}
      else if(a.t!=='stay'){a.d=ri(6);if(a.t==='drone2'||a.t==='puddle')a.m=pos.slice()}
      pl.push(a)}
     hh.plans=pl});
    try{MB.resolveRound()}catch(e){snaps.push('ERR '+e.message);break}
    snaps.push(JSON.stringify({round:G.round,winner:G.winner||null,heroes:G.heroes.map(x=>({ch:x.ch,pos:x.pos,hp:x.hp,lvl:x.lvl,xp:x.xp,dead:x.dead,items:x.items})),bases:G.bases,creeps:G.creeps.map(c=>({pos:c.pos,hp:c.hp,alive:c.alive})),chests:G.chests,puddles:G.puddles,cells:Object.keys(G.cells).length,log:G.log}))}
   res[mode+'/'+mi+'/'+g]=snaps}
  return res},QUICK);
 const mbHash={};for(const k in out.mb)mbHash[k]=out.mb[k].map(h);out.mbRaw=out.mb;out.mb=mbHash;

 /* 4. przebiegi gier na jednym telefonie (prawdziwe przyciski "Następna runda", bonusy, przedmioty) */
 out.flow={};
 for(const [gm,tm,n] of (QUICK?[['classic','ffa',2],['special','ffa',3]]:[['classic','ffa',2],['classic','ffa',4],['special','ffa',3],['special','2v2',4],['test','ffa',3],['test','ffa',2]])){
  const key=gm+'/'+tm+'/'+n;const snaps=[];
  await p.evaluate(([gm,tm,n])=>{window.__seed(4242+n);st.gm=gm;st.tm2=tm;st.seed='flow';st.round=1;ICACHE={};
   const chars=['Byku','Pasterz','Sierżant Przemo','Truchel','Wiatrak','Długi','Żyleta','Ciotka'];const starts=[[0,2],[0,-2],[2,0],[-2,0],[2,-2],[-2,2]];
   H={n,cur:0,tgt:'plan',p:Array.from({length:n},(_,i)=>{const ch=chars[(i*3+n)%chars.length],hp=MAXHP(ch);return {ch,start:starts[i].slice(),plans:{},posr:{1:starts[i].slice()},hp,hpr:{1:hp},hpo:{},tm:tm==='2v2'?(i%2?'B':'A'):undefined}})};st.scr='hpass';render()},[gm,tm,n]);
  for(let r=0;r<(QUICK?3:5);r++){
   const alive=await p.evaluate(r=>{const R=seed=>{let s=seed>>>0||1;return ()=>{s=(s+0x6D2B79F5)|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
    const rnd=R(99+r*13+H.n),ri=k=>Math.floor(rnd()*k),pick=a=>a[ri(a.length)];const BR=window.__BR||3;
    const cl=[];for(let q=-BR;q<=BR;q++)for(let rr=-BR;rr<=BR;rr++)if(Math.max(Math.abs(q),Math.abs(rr),Math.abs(q+rr))<=BR)cl.push([q,rr]);
    const near=(p,k)=>pick(cl.filter(c=>Math.max(Math.abs(c[0]-p[0]),Math.abs(c[1]-p[1]),Math.abs(c[0]-p[0]+c[1]-p[1]))<=k)).slice();
    let any=0;H.p.forEach((q,i)=>{if(!alive(q,st.round))return;any++;H.cur=i;st.ch=q.ch;let pos=q.posr[st.round];const pl=[];
     for(let ph=0;ph<nPh(q.ch);ph++){let defs=[];try{defs=actDefs(q.ch,ph).filter(d=>!d.dis)}catch(e){}const d=pick(defs.length?defs:[{t:'move'}]);const a={t:d.t,m:null,d:null};
      if(a.t==='move'){a.m=near(pos,q.ch==='Byku'?2:1);pos=a.m}else if(a.t==='atk'||a.t==='staff')a.d=ri(6);else if(a.t==='drone'&&ph===0){}else a.m=near(pos,2);pl.push(a)}
     q.plans[st.round]=pl});
    st.scr='hrev';render();st.skipReq=true;return any},r);
   if(alive<2)break;
   await p.waitForFunction(()=>!st.animating,null,{timeout:60000}).catch(()=>{});
   for(let k=0;k<12;k++){await p.waitForTimeout(150);
    const did=await p.evaluate(()=>{st.skipReq=true;if(st.animating)return 'anim';const b=document.querySelector('[data-roll],[data-wok],[data-wc],[data-pick],[data-stay]');if(b){b.click();return 'ui'}const n=document.querySelector('[data-a="hnextr"]');if(n){n.click();return 'next'}return st.scr});
    if(did==='next'||did==='hpass'||did==='over')break}
   snaps.push(await p.evaluate(()=>JSON.stringify({round:st.round,scr:st.scr,p:H.p.map(q=>({ch:q.ch,posr:q.posr,hpr:q.hpr,got:q.got,pts:q.pts,bon:q.bon,bonR:q.bonR,sheepr:q.sheepr,dr:q.dr,pud:q.pud,push:q.push,hpo:q.hpo}))})))}
  out.flow[key]=snaps.map(h);out.flowRaw=out.flowRaw||{};out.flowRaw[key]=snaps}
 fs.writeFileSync(OUT,JSON.stringify(out));
 const nE=Object.values(out.engine).reduce((a,x)=>a+x.length,0),nM=Object.values(out.mb).reduce((a,x)=>a+x.length,0);
 const eErr=Object.values(out.engineRaw).flat().filter(x=>x.startsWith('ERR')).length;
 console.log('snap',Object.keys(out.snap).length,'engine cases',nE,'(errors '+eErr+')','mb rounds',nM,'flow',JSON.stringify(Object.fromEntries(Object.entries(out.flow).map(([k,v])=>[k,v.length]))),'page errors',errs.length,errs.slice(0,3));
 await b.close()})().catch(e=>{console.log('FAILED',e.message);process.exit(1)});
