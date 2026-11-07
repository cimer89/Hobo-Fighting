/* ===================== Testy balansu: symulacje walk botów ===================== */
/* Bots.play({chars,mode,strats,seed}) rozgrywa całą partię bez interfejsu, na tym samym silniku walki (Combat.run).
   Tryby: 'classic' i 'test' (tryb specjalny ma przedmioty na mapie i bonusy z koła – nie jest symulowany).
   Strategie botów:
    agresywny   – atakuje tam, gdzie przeciwnik stoi teraz; gdy nie ma kogo trafić, idzie do najbliższego,
    przewidujący – zakłada, że przeciwnik może się ruszyć, i celuje w pola, na których najpewniej będzie,
    ostrożny    – trzyma dystans i pilnuje strefy, atakuje tylko z dobrą szansą,
    losowy      – dowolne poprawne akcje.
   Wynik: zapis partii w tym samym formacie co prawdziwe partie (BalanceLog). */
const Bots=(function(){
 const CB=typeof Combat!=='undefined'?Combat:require('../engine/combat.js');
 const D=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]],K=p=>p[0]+','+p[1];
 const dist=(a,b)=>Math.max(Math.abs(a[0]-b[0]),Math.abs(a[1]-b[1]),Math.abs(a[0]-b[0]+a[1]-b[1]));
 const STRATS=['agresywny','przewidujący','ostrożny','losowy'];
 const CHARS=['Wiatrak','Długi','Żyleta','Byku','Ciotka','Pasterz','Truchel','Sierżant Przemo'];
 const TBHP={'Wiatrak':6,'Pasterz':7,'Sierżant Przemo':4};
 const maxHp=(ch,mode)=>(mode==='test'&&TBHP[ch])||5;
 const nPh=ch=>ch==='Długi'?3:2;
 const zoneBase=r=>r<=3?3:r<=6?2:r<=9?1:0;
 function play(cfg){
  const mode=cfg.mode||'classic',tb=mode==='test',chars=cfg.chars,n=chars.length,BR=n===2?2:3,rnd=CB.rng(String(cfg.seed||1)+':bots');
  const ri=k=>Math.floor(rnd()*k),pick=a=>a[ri(a.length)];
  const zoneR=r=>{const z=zoneBase(r);return z>=BR?3:z};
  const cells=[];for(let q=-BR;q<=BR;q++)for(let r=-BR;r<=BR;r++)if(dist([q,r],[0,0])<=BR)cells.push([q,r]);
  const IN=p=>dist(p,[0,0])<=BR;
  /* start: pola na krawędzi, rozłożone równomiernie */
  const ring=cells.filter(c=>dist(c,[0,0])===BR);const off=ri(ring.length);
  const P=chars.map((ch,i)=>({id:'p'+i,ch,strat:(cfg.strats&&cfg.strats[i])||'agresywny',pos:ring[(off+Math.floor(i*ring.length/n))%ring.length].slice(),hp:maxHp(ch,mode),max:maxHp(ch,mode),
   alive:true,sheep:null,drone:false,stat:{dealt:0,taken:0,attacks:0,hits:0,abil:{},elim:null}}));
  let puddles=[],round=1;const MAXR=40;
  const rules=r=>({tb,pnb:tb,zone:zoneR(r),br:BR,selfLand:false,zylR:9,zyl2:2});
  const enemies=me=>P.filter(o=>o.alive&&o!==me);
  /* gdzie może być przeciwnik po ruchu: rozkład prawdopodobieństwa */
  function guess(o,strat){if(strat==='agresywny')return [[o.pos,1]];const nb=D.map(d=>[o.pos[0]+d[0],o.pos[1]+d[1]]).filter(IN);const st=0.4,each=(1-st)/Math.max(1,nb.length);return [[o.pos,st]].concat(nb.map(c=>[c,each]))}
  function moves(me,from,ph){if(me.ch==='Truchel')return cells.map(c=>c.slice());const r=me.ch==='Byku'?(tb&&ph>0?1:2):1;return cells.filter(c=>dist(c,from)<=r).map(c=>c.slice())}
  /* oczekiwane obrażenia ataku w kierunku d */
  function atkValue(me,from,d,ph,strat){const R=rules(round);let v=0;
   if(me.ch==='Byku'){if(ph<1)return -1;let c=from.slice();for(;;){c=[c[0]+D[d][0],c[1]+D[d][1]];if(!IN(c))break;let hit=0;enemies(me).forEach(o=>guess(o,strat).forEach(([p,w])=>{if(K(p)===K(c))hit+=w}));if(hit>0){v+=2*hit;break}}return v}
   if(me.ch==='Truchel'){const c=[from[0]+D[d][0],from[1]+D[d][1]];if(!IN(c))return -1;enemies(me).forEach(o=>{if(dist(o.pos,c)<=1)v+=0.6});return v}
   const sh=CB.shape(me.ch,from,d,ph,R);const first=['Żyleta','Ciotka','Sierżant Przemo'].includes(me.ch);
   enemies(me).forEach(o=>guess(o,strat).forEach(([p,w])=>{const k=sh.findIndex(c=>c[0]===p[0]&&c[1]===p[1]);if(k>=0){const dm=typeof sh[k][2]==='number'?sh[k][2]:1;v+=w*dm*(first?Math.pow(0.85,k):1)}}));return v}
  function nearest(me,from){let b=null,bd=1e9;enemies(me).forEach(o=>{const d=dist(o.pos,from);if(d<bd){bd=d;b=o}});return b}
  function moveScore(me,c,ph,strat){const z=zoneR(round),zp=dist(c,[0,0])>z?-3:0;const e=nearest(me,c);const d=e?dist(e.pos,c):5;
   if(me.ch==='Byku'&&e&&K(e.pos)===K(c))return (strat==='ostrożny'?2:3.2)+zp;
   if(strat==='ostrożny')return zp+(d>=2&&d<=3?0.6:d<2?-0.8:0.2)-dist(c,[0,0])*0.05;
   return zp-d*0.35}
  function plan(me){const pl=[];let from=me.pos.slice();const strat=me.strat;
   for(let ph=0;ph<nPh(me.ch);ph++){
    const opts=[];
    const mv=moves(me,from,ph);
    if(strat==='losowy'){const t=pick(['move','atk']);if(t==='atk'&&!(me.ch==='Byku'&&ph<1)&&me.ch!=='Pasterz'){pl.push({t:'atk',m:null,d:ri(6)});continue}const m=pick(mv);pl.push({t:'move',m,d:null});from=m;continue}
    mv.forEach(m=>opts.push({a:{t:'move',m,d:null},v:moveScore(me,m,ph,strat)}));
    if(me.ch==='Pasterz'){
     if(!me.sheep){const e=nearest(me,from);const nb=D.map(d=>[from[0]+d[0],from[1]+d[1]]).filter(IN);if(nb.length){const m=nb.sort((a,b)=>(e?dist(a,e.pos)-dist(b,e.pos):0))[0];opts.push({a:{t:'summon',m,d:null},v:1.2})}}
     else{for(let d=0;d<6;d++){let c=me.sheep.slice(),v=0;for(;;){c=[c[0]+D[d][0],c[1]+D[d][1]];if(!IN(c))break;enemies(me).forEach(o=>guess(o,strat).forEach(([p,w])=>{if(K(p)===K(c))v+=w*(tb?2:1)}))}if(v>0)opts.push({a:{t:'atk',m:null,d},v})}}}
    else if(me.ch==='Sierżant Przemo'&&!me._dr&&ph===0&&!me.drone){opts.push({a:{t:'drone',m:null,d:null},v:1.1})}
    else if(me.ch==='Sierżant Przemo'&&(me.drone||me._dr)&&ph===1){const e=nearest(me,from);if(e)opts.push({a:{t:'drone',m:e.pos.slice(),d:null},v:1.5})}
    if(me.ch!=='Pasterz')for(let d=0;d<6;d++){const v=atkValue(me,from,d,ph,strat);if(v>0)opts.push({a:{t:'atk',m:null,d},v:v*(strat==='ostrożny'?0.9:1.1)})}
    opts.sort((a,b)=>b.v-a.v);const best=opts.filter(o=>o.v>=opts[0].v-1e-9);const ch=pick(best).a;
    if(ch.t==='drone'&&ph===0)me._dr=true;
    pl.push(ch);if(ch.t==='move')from=ch.m}
   me._dr=false;return pl}
  const rounds=[];
  while(round<=MAXR){const live=P.filter(o=>o.alive);if(live.length<=1)break;
   const fighters=live.map(o=>({id:o.id,ch:o.ch,pos:o.pos.slice(),hp:o.hp,plan:plan(o),sh:false,dmgb:false,drone:o.drone,sheep:o.sheep,dg:undefined,tm:null}));
   const pud=puddles.filter(p=>p.r0<round&&round-p.r0<=2);
   const run=pushes=>CB.run({round,seed:String(cfg.seed||1)+':d:'+round,rules:rules(round),fighters,pushes,puddles:pud});
   let S=run({});
   /* Ciotka: bot wybiera pole przesunięcia trafionego (najchętniej poza strefę albo na innego gracza) */
   if(S.pend.length){const pushes={};S.pend.forEach(pp=>{const t=S.find(x=>x.id===pp.id),z=zoneR(round);const nb=D.map(d=>[pp.pos[0]+d[0],pp.pos[1]+d[1]]).filter(IN);
     const sc=c=>(dist(c,[0,0])>z?2:0)+(S.some(x=>x!==t&&!x.out&&K(x.pos)===K(c))?1.5:0)+rnd()*0.1;pushes[pp.by]=nb.sort((a,b)=>sc(b)-sc(a))[0]||pp.pos;});S=run(pushes)}
   /* statystyki rundy */
   S.forEach(x=>{const o=P.find(p=>p.id===x.id);o.stat.dealt+=x.pts.d;o.stat.taken+=Math.max(0,o.hp-Math.max(0,x.hp))});
   S.ev.forEach(e=>{const o=P.find(p=>p.id===e.id);if(!o)return;if(['atk','charge','scharge','drone'].includes(e.k)&&!e.none){o.stat.attacks++;if(e.hit||e.target)o.stat.hits++}});
   S.journal.forEach(e=>{const o=P.find(p=>p.id===e.id);if(!o)return;const A={'skok':1,'skok daleki':1,'skok w miejscu':1,'teleport':1,'przywołanie owcy':1,'ruch owcy':1,'dron aktywny':1,'szarża':1,'szarża owcy':1,'kałuża':1,'unik':1};
    if(A[e.k])o.stat.abil[e.k]=(o.stat.abil[e.k]||0)+1;
    if(e.k==='przesunięcie'&&e.by){const q=P.find(p=>p.id===e.by);if(q)q.stat.abil['manipulacja']=(q.stat.abil['manipulacja']||0)+1}});
   S.ev.forEach(e=>{if(e.k==='atk'&&e.snipe){const o=P.find(p=>p.id===e.id);o.stat.abil['strzał snajperski']=(o.stat.abil['strzał snajperski']||0)+1}});
   S.forEach(x=>{const o=P.find(p=>p.id===x.id);o.hp=Math.max(0,x.hp);o.pos=x.pos.slice();o.sheep=(S.sheep&&S.sheep[x.id])||null;o.drone=!!(S.droneOn&&S.droneOn[x.id]);
    if(x.out&&o.alive){o.alive=false;const last=S.journal.filter(e=>e.k==='dmg'&&e.id===x.id).pop();const by=last&&last.by?P.find(p=>p.id===last.by):null;o.stat.elim={round,cause:last?last.cause:'?',by:by?by.ch:null}}});
   puddles=puddles.concat(S.pudNew||[]);rounds.push(round);round++}
  const alive=P.filter(o=>o.alive);const winner=alive.length===1?alive[0]:null;
  return {src:'bot',mode,n,team:false,rounds:rounds.length,finished:true,draw:!winner,ts:Date.now(),seed:cfg.seed,
   players:P.map(o=>({ch:o.ch,strat:o.strat,team:null,dealt:o.stat.dealt,taken:o.stat.taken,attacks:o.stat.attacks,hits:o.stat.hits,abil:o.stat.abil,elim:o.stat.elim,win:o===winner}))}}
 /* seria partii: losowe składy (bez powtórzeń postaci), strategie wg ustawień */
 function series(opt){const out=[],rnd=CB.rng('seria:'+(opt.seed||1));for(let g=0;g<opt.games;g++){const n=opt.players||2;
   const pool=CHARS.slice();for(let i=pool.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
   const strats=Array.from({length:n},()=>opt.strat==='mieszane'?STRATS[Math.floor(rnd()*STRATS.length)]:(opt.strat||'agresywny'));
   out.push(play({chars:pool.slice(0,n),mode:opt.mode||'classic',strats,seed:(opt.seed||1)*100003+g}))}return out}
 return {play,series,STRATS,CHARS}})();
if(typeof module!=='undefined')module.exports=Bots;
