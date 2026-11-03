/* ===================== Silnik walki: jedno miejsce rozpatrywania rundy ===================== */
/* Combat.run(wejście) -> wynik rundy. Funkcja czysta: nie czyta stanu gry (st, H, net),
   dostaje wszystko w parametrach, a jedyne losowanie (remis celów drona) idzie z ziarna.
   Ten sam stan początkowy + plany + ziarno = zawsze identyczny wynik.

   Wejście:
   { round, seed,                         // ziarno losowania (np. 'kod:d:3')
     rules:{tb,pnb,zone,br,selfLand,zylR,zyl2},  // tryb Testy, nowy balans Pasterza, promień strefy, promień planszy, ...
     fighters:[{id,ch,pos,hp,plan,sh,dmgb,drone,sheep,dg,tm}],  // plan = akcje na fazy I–III
     pushes:{id:[q,r]},                   // wybrane pola przesunięcia przez Ciotkę (z fazy II)
     puddles:[{k,o,r0,b}] }               // aktywne kałuże Truchla
   Wynik: tablica postaci (pos, hp, log, out, …) z polami .ev (zdarzenia dla animacji), .pend,
   .sheep, .droneOn, .pudNew, .pudAll oraz .journal – dziennik: każde trafienie, przesunięcie,
   utrata HP i eliminacja z fazą, krokiem, zasadą i sprawcą.

   KOLEJNOŚĆ ROZPATRYWANIA (każda faza I, II, III; faza III tylko gdy działa Długi):
    1 ruch            – wszystkie ruchy jednocześnie (skok Byka, teleport Truchla)
    2 przygotowanie   – ruch owcy, przywołanie owcy, aktywacja drona
    3 unik            – (faza II) unik z bonusu Refleks
    4 kolizje         – lądowanie Byka (z bonusem +1) / ścisk na wspólnym polu
    5 dron            – (faza II) atak drona Sierżanta
    6 strzał snajperski – (faza II) Żyleta po celowaniu
    7 kij pasterski
    8 ataki           – zwykłe ataki, po kolei wg kolejności graczy
    9 kałuże          – Truchel stawia kałużę
   10 szarża Byka     – z odrzuceniem i kolizją po odrzuceniu
   11 szarża owcy     – także owca trafiona w tej fazie (ginie dopiero w kroku 14)
   12 manipulacja     – przesunięcie przez Ciotkę (faza II)
   13 trucizna        – kałuże zadają obrażenia
   14 eliminacje      – trafione owce giną, postacie z HP ≤ 0 odpadają
   15 anulowanie      – (faza II) przesunięty Długi traci fazę III
   Na koniec rundy: strefa (−1 poza strefą, tarcza blokuje) i eliminacje. */
const Combat=(function(){
 const D=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
 const K=(q,r)=>q+','+r;
 const dist=(q,r)=>Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r));
 function rng(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return function(){h+=0x6D2B79F5;let t=h;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
 const STEPS=['ruch','przygotowanie','unik','kolizje','dron','strzał snajperski','kij pasterski','ataki','kałuże','szarża Byka','szarża owcy','manipulacja','trucizna','eliminacje','anulowanie'];

 /* kształty ataków (pola i obrażenia); tryb Testy ma własne warianty */
 function shape(ch,p,d,ph,R){const out=[],[dq,dr]=D[d],IN=(q,r)=>dist(q,r)<=R.br;
  const line=(n,dm)=>{for(let k=1;k<=n;k++){const q=p[0]+dq*k,r=p[1]+dr*k;if(!IN(q,r))break;out.push([q,r,dm(k)])}};
  if(R.tb){
   if(ch==='Ciotka'){for(let k=1;k<=3;k++){const q=p[0]+dq*k,r=p[1]+dr*k;if(!IN(q,r))break;out.push([q,r,2])}return out}
   if(ch==='Wiatrak'){[[d,2],[(d+1)%6,1],[(d+5)%6,1]].forEach(([i,v])=>{const q=p[0]+D[i][0],r=p[1]+D[i][1];if(IN(q,r))out.push([q,r,v])});
    [[2*dq,2*dr],[dq+D[(d+1)%6][0],dr+D[(d+1)%6][1]],[dq+D[(d+5)%6][0],dr+D[(d+5)%6][1]]].forEach(([a,b])=>{const q=p[0]+a,r=p[1]+b;if(IN(q,r))out.push([q,r,1])});return out}
   if(ch==='Żyleta'){line(R.zylR,k=>k<=R.zyl2?2:1);return out}
   if(ch==='Długi'){line(3,k=>k===1?1:2);return out}}
  if(ch==='Wiatrak'){[[d,2],[(d+1)%6,1],[(d+5)%6,1]].forEach(([i,v])=>{const q=p[0]+D[i][0],r=p[1]+D[i][1];if(IN(q,r))out.push([q,r,v])})}
  else if(ch==='Długi')line(3,k=>k===3?2:1);
  else if(ch==='Żyleta')line(9,()=>2);
  else if(ch==='Ciotka')line(3,()=>ph===0?2:1);
  else if(ch==='Byku')line(9,()=>'»');
  else if(ch==='Sierżant Przemo')line(9,()=>1);
  else if(ch==='Truchel'){const q=p[0]+dq,r=p[1]+dr;if(IN(q,r))out.push([q,r,'☠'])}
  return out}

 function run(I){
  const R=I.rules,L=I.fighters,round=I.round,pd=I.pushes,zone=R.zone,IN=(q,r)=>dist(q,r)<=R.br;
  const S=L.map(x=>({id:x.id,ch:x.ch,pos:x.pos.slice(),hp:x.hp,log:[],out:false,sh:!!x.sh,shUsed:false,dmgb:!!x.dmgb,dmgbUsed:false,moved:false,cancel3:false,drone:!!x.drone,pts:{d:0,m:0},tm:x.tm||null})),ev=[],pend=[],journal=[];
  const SHP=[];L.forEach((x,i)=>{if(x.sheep)SHP.push({o:i,pos:x.sheep.slice(),alive:true})});
  const PU=(I.puddles||[]).map(p=>Object.assign({},p)),pudNew=[];
  const rnd=rng(I.seed);
  const ally=(i,j)=>i!==j&&!!S[i].tm&&S[i].tm===S[j].tm;
  const trig=(id,why)=>ev.push({k:'trig',id,why});
  const sheepOf=i=>SHP.find(s=>s.o===i&&s.alive);
  let ph=0,step='';
  const J=e=>journal.push(Object.assign({ph,step},e));
  /* trafiona owca zostaje na planszy do końca ataków (wykonuje swoją szarżę, zasłania strzały) i ginie w kroku eliminacji */
  const killSheep=(s,by)=>{const first=!s.doomed;s.doomed=true;J({k:'sheep',id:S[s.o].id,pos:s.pos.slice(),by:by!==undefined?S[by].id:null,rule:first?'owca trafiona – zginie po rozpatrzeniu ataków':'owca trafiona ponownie'})};
  const at=(i,q,r)=>S.map((y,j)=>j!==i&&!ally(i,j)&&!y.out&&y.pos[0]===q&&y.pos[1]===r?j:-1).filter(j=>j>=0);
  const useBonus=x=>{if(x.dmgb){x.dmgb=false;x.dmgbUsed=true}};
  const move=(j,to,kind,by,rule)=>{const f=S[j].pos.slice();S[j].pos=to.slice();J({k:kind,id:S[j].id,from:f,to:to.slice(),by:by!==undefined&&by!==null?S[by].id:null,rule})};

  for(ph=0;ph<3;ph++){
   const planOf=i=>L[i].plan[ph]||null;
   const act=S.map((x,i)=>!x.out&&!(ph===2&&x.cancel3)&&!!planOf(i));
   if(ph===2&&!S.some((x,i)=>act[i]&&x.ch==='Długi'))break;
   ev.push({k:'phase',ph});
   /* obrażenia: tarcza zdejmuje 1 punkt, sojusznicy (2v2) nie ranią się atakami */
   const dmg=(i,n,w,src)=>{if(src!==undefined&&ally(src,i))return;
    if(S[i].sh&&n>0){S[i].sh=false;S[i].shUsed=true;n-=1;S[i].log.push('F'+(ph+1)+': tarcza blokuje');ev.push({k:'shield',id:S[i].id,ph});J({k:'shield',id:S[i].id,cause:w,by:src!==undefined?S[src].id:null})}
    if(n<=0)return;
    const app=Math.max(0,Math.min(n,S[i].hp));
    S[i].hp-=n;S[i].log.push('F'+(ph+1)+': −'+n+' '+w);ev.push({k:'dmg',id:S[i].id,n,w,ph});J({k:'dmg',id:S[i].id,n,cause:w,by:src!==undefined?S[src].id:null,hp:S[i].hp});
    if(src!==undefined&&src!==i&&app>0)S[src].pts.d+=app};

   /* 1 ruch */
   step=STEPS[0];
   const mv=S.map((x,i)=>{const a=planOf(i);if(!x.out&&a&&a.t==='move'){const from=x.pos.slice(),to=a.m.slice(),ch=K(...to)!==K(...x.pos),far=x.ch==='Byku'&&ch&&dist(to[0]-from[0],to[1]-from[1])>=2;x.pos=to;
     if(ch||x.ch==='Byku')ev.push({k:'move',id:x.id,from,to,ph,jump:x.ch==='Byku',far,tele:x.ch==='Truchel',stay:!ch});
     if(ch||x.ch==='Byku')J({k:x.ch==='Byku'?(ch?(far?'skok daleki':'skok'):'skok w miejscu'):x.ch==='Truchel'?'teleport':'ruch',id:x.id,from,to,by:x.id,rule:'plan gracza'});
     return far?2:(ch?1:0)}return 0});
   /* 2 przygotowanie: owca i dron */
   step=STEPS[1];
   S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a)return;
    if(a.t==='smove'){const s=sheepOf(i);if(s){const f=s.pos.slice();s.pos=a.m.slice();ev.push({k:'smove',id:x.id,from:f,to:a.m.slice(),ph});J({k:'ruch owcy',id:x.id,from:f,to:a.m.slice(),by:x.id,rule:'plan gracza'})}}
    else if(a.t==='summon'&&!sheepOf(i)){SHP.push({o:i,pos:a.m.slice(),alive:true});ev.push({k:'summon',id:x.id,to:a.m.slice(),ph});J({k:'przywołanie owcy',id:x.id,to:a.m.slice(),by:x.id,rule:'plan gracza'})}
    else if(a.t==='drone'&&ph===0&&!x.drone){x.drone=true;ev.push({k:'droneon',id:x.id,ph});J({k:'dron aktywny',id:x.id,by:x.id,rule:'plan gracza'})}});
   /* 3 unik (bonus Refleks, faza II) */
   step=STEPS[2];
   if(ph===1)S.forEach((x,i)=>{const d=L[i].dg;if(!x.out&&Array.isArray(d)){const from=x.pos.slice();x.pos=d.slice();ev.push({k:'move',id:x.id,from,to:d.slice(),ph,dodge:true});J({k:'unik',id:x.id,from,to:d.slice(),by:x.id,rule:'bonus Refleks'})}});
   /* 4 kolizje: lądowanie Byka albo ścisk */
   step=STEPS[3];
   const G={};S.forEach((x,i)=>{if(!x.out)(G[K(...x.pos)]=G[K(...x.pos)]||[]).push(i)});
   Object.values(G).forEach(g=>{if(g.length<2)return;
    if(ph===2&&!g.some(i=>act[i]))return;
    const fj=g.filter(i=>S[i].ch==='Byku'&&(mv[i]>=1||(planOf(i)&&planOf(i).t==='move')));
    if(fj.length){const others=g.filter(i=>!fj.includes(i)&&!ally(fj[0],i)),la=planOf(fj[0]),lx=((la&&la.bd)||S[fj[0]].dmgb)?1:0;others.forEach(i=>dmg(i,(mv[fj[0]]===2?1:3)+lx,'lądowanie Byka',fj[0]));if(others.length)useBonus(S[fj[0]]);if(R.tb&&R.selfLand&&others.length)fj.forEach(i=>dmg(i,1,'ścisk'));if(others.length>=2)S[fj[0]].pts.m+=others.length-1}
    else if(!g.every(i=>S[i].tm&&S[i].tm===S[g[0]].tm))g.forEach(i=>dmg(i,1,'ścisk'))});
   /* 5 dron (faza II): najbliższa postać; remis -> najwięcej HP; dalej losowo z ziarna */
   step=STEPS[4];
   if(ph===1)S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a||a.t!=='drone'||!x.drone)return;
    const to=a.m?a.m.slice():x.pos.slice();let best=[],bd=1e9;
    S.forEach((y,j)=>{if(j===i||y.out||ally(i,j))return;const d=dist(y.pos[0]-to[0],y.pos[1]-to[1]);if(d<bd){bd=d;best=[j]}else if(d===bd)best.push(j)});
    if(best.length>1){const mh=Math.max(...best.map(j=>S[j].hp));best=best.filter(j=>S[j].hp===mh)}
    const draw=best.length>1;const tgt=best.length?best[draw?Math.floor(rnd()*best.length):0]:-1;
    if(draw)J({k:'losowanie',id:x.id,among:best.map(j=>S[j].id),pick:S[tgt].id,rule:'remis celów drona'});
    x.drone=false;ev.push({k:'drone',id:x.id,to,target:tgt>=0?S[tgt].id:null,ph});
    if(tgt>=0){ev.push({k:'hit',id:S[tgt].id,ph});dmg(tgt,(R.tb?2:1)+((a.bd||x.dmgb)?1:0),'dron',i);trig(x.id,'Sierżant Przemo');useBonus(x)}});
   /* 6 strzał snajperski (faza II, po celowaniu w fazie I) */
   step=STEPS[5];
   S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a||a.t!=='snipe'||ph!==1)return;const a0=L[i].plan[0];if(!a0||a0.t!=='aim'||a0.d==null)return;
    const dd=D[a0.d],extra=(a.bd||x.dmgb)?1:0,from=x.pos.slice(),cs=[];let cur=x.pos.slice(),end=null,hs=[];
    for(;;){const nq=cur[0]+dd[0],nr=cur[1]+dd[1];if(!IN(nq,nr))break;cur=[nq,nr];cs.push(cur.slice());
     const sh=SHP.find(z=>z.alive&&!ally(i,z.o)&&z.pos[0]===nq&&z.pos[1]===nr);if(sh){killSheep(sh,i);end=cur.slice();break}
     const t=at(i,nq,nr);if(t.length){hs=[t[0]];end=cur.slice();break}}
    ev.push({k:'atk',id:x.id,ch:x.ch,ph,from,cells:cs,end:end||cur.slice(),hit:hs.length>0,line:true,bd:extra>0,snipe:true});
    hs.forEach(j=>{ev.push({k:'hit',id:S[j].id,ph});dmg(j,3+extra,'strzał snajperski',i)});if(hs.length)useBonus(x)});
   /* 7 kij pasterski */
   step=STEPS[6];
   S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a||a.t!=='staff'||x.ch!=='Pasterz')return;const dd=D[a.d],extra=(a.bd||x.dmgb)?1:0,cs=[],hs=[];
    for(let k=1;k<=2;k++){const q=x.pos[0]+dd[0]*k,r=x.pos[1]+dd[1]*k;if(!IN(q,r))break;cs.push([q,r]);SHP.forEach(z=>{if(z.alive&&z.o!==i&&!ally(i,z.o)&&z.pos[0]===q&&z.pos[1]===r)killSheep(z,i)});S.forEach((y,j)=>{if(j!==i&&!ally(i,j)&&!y.out&&y.pos[0]===q&&y.pos[1]===r)hs.push(j)})}
    ev.push({k:'atk',id:x.id,ch:x.ch,ph,from:x.pos.slice(),cells:cs,end:cs.length?cs[cs.length-1]:x.pos.slice(),hit:hs.length>0,line:false,bd:extra>0});
    hs.forEach(j=>{if(ph===1)ev.push({k:'hit',id:S[j].id,ph});dmg(j,2+extra,'kij pasterski',i)});if(hs.length>=2)x.pts.m+=hs.length-1;if(hs.length)useBonus(x)});
   /* 8 zwykłe ataki – po kolei wg kolejności graczy */
   step=STEPS[7];
   const pnd=[];
   S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a||a.t!=='atk'||x.ch==='Byku'||x.ch==='Pasterz'||x.ch==='Truchel')return;
    const cs=shape(x.ch,x.pos,a.d,ph,R);
    const extra=(a.bd||x.dmgb)?1:0,hs=[];let hitIdx=-1,sheepHit=false,end=cs.length?cs[x.ch==='Wiatrak'?0:cs.length-1].slice(0,2):null;
    const first=x.ch==='Żyleta'||x.ch==='Ciotka'||x.ch==='Sierżant Przemo';
    if(first){for(let k=0;k<cs.length;k++){
      const sh=SHP.find(s=>s.alive&&!ally(i,s.o)&&s.pos[0]===cs[k][0]&&s.pos[1]===cs[k][1]);
      if(sh){killSheep(sh,i);sheepHit=true;end=[cs[k][0],cs[k][1]];break}
      const t=at(i,cs[k][0],cs[k][1]);if(t.length){hs.push([t[0],cs[k][2]+extra]);end=[cs[k][0],cs[k][1]];hitIdx=k;break}}}
    else{cs.forEach((c,k)=>at(i,c[0],c[1]).forEach(j=>{hs.push([j,c[2]+extra]);if(hitIdx<0)hitIdx=k}));SHP.forEach(s=>{if(s.alive&&!ally(i,s.o)&&cs.some(c=>c[0]===s.pos[0]&&c[1]===s.pos[1])){killSheep(s,i);sheepHit=true}})}
    if(x.ch==='Wiatrak'&&hs.length>=2)trig(x.id,'Wiatrak');
    if(x.ch==='Długi'&&cs.length===3&&at(i,cs[2][0],cs[2][1]).length)trig(x.id,'Długi');
    if((x.ch==='Żyleta'||x.ch==='Sierżant Przemo')&&hitIdx>=3)trig(x.id,x.ch);
    ev.push({k:'atk',id:x.id,ch:x.ch,ph,from:x.pos.slice(),cells:cs.map(c=>[c[0],c[1]]),end,hit:hs.length>0||sheepHit,line:x.ch!=='Wiatrak',bd:extra>0});
    const uniq=new Set(hs.map(h=>h[0]));
    hs.forEach(([j,v])=>{if(ph===1)ev.push({k:'hit',id:S[j].id,ph});dmg(j,v,'atak '+x.ch,i)});if(hs.length)useBonus(x);
    if(uniq.size>=2)x.pts.m+=uniq.size-1;
    if(ph===1&&x.ch==='Ciotka'&&hs.length)pnd.push({by:x.id,t:hs[0][0]})});
   /* 9 kałuże Truchla */
   step=STEPS[8];
   S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a||a.t!=='atk'||x.ch!=='Truchel')return;
    const nq=x.pos[0]+D[a.d][0],nr=x.pos[1]+D[a.d][1];
    if(!IN(nq,nr)){ev.push({k:'puddle',id:x.id,none:true});return}
    const p={k:K(nq,nr),o:x.id,r0:round,b:(a.bd||x.dmgb)?1:0};PU.push(p);pudNew.push(p);useBonus(x);ev.push({k:'puddle',id:x.id,to:[nq,nr],b:p.b,ph});J({k:'kałuża',id:x.id,to:[nq,nr],by:x.id,rule:'plan gracza'})});
   /* 10 szarża Byka */
   step=STEPS[9];
   S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a||a.t!=='atk'||x.ch!=='Byku')return;
    const dd=D[a.d],extra=(a.bd||x.dmgb)?1:0,from=x.pos.slice();let cur=x.pos.slice(),hitCell=null,steps=0,shCl=null,crash=false;
    for(;;){const nq=cur[0]+dd[0],nr=cur[1]+dd[1];if(!IN(nq,nr))break;if(R.tb&&zone<3&&dist(...cur)<=zone&&dist(nq,nr)>zone){crash=true;break}cur=[nq,nr];steps++;
     shCl=SHP.find(z=>z.alive&&z.o!==i&&!ally(i,z.o)&&z.pos[0]===nq&&z.pos[1]===nr)||null;if(shCl)break;
     if(S.some((y,j)=>j!==i&&!ally(i,j)&&!y.out&&y.pos[0]===nq&&y.pos[1]===nr)){hitCell=cur.slice();break}}
    const victims=hitCell?S.map((y,j)=>j!==i&&!ally(i,j)&&!y.out&&K(...y.pos)===K(...hitCell)?j:-1).filter(j=>j>=0):[];
    ev.push({k:'charge',id:x.id,from,to:cur.slice(),steps,hit:victims.length>0||!!shCl,dir:a.d,bd:extra>0,crash});
    x.pos=cur.slice();J({k:'szarża',id:x.id,from,to:cur.slice(),by:x.id,rule:crash?'zatrzymanie na ścianie strefy':shCl?'zderzenie z owcą':hitCell?'do pierwszej postaci':'do krawędzi planszy'});
    if(crash){ev.push({k:'hit',id:x.id,ph});dmg(i,1,'ściana strefy')}
    if(shCl){killSheep(shCl,i);const sa=planOf(shCl.o),po=S[shCl.o];
     /* owca szarżująca naprzeciw Byka: zderzenie – Byku dostaje obrażenia jej szarży, owca dalej nie biegnie */
     if(sa&&sa.t==='atk'&&po.ch==='Pasterz'&&sa.d===(a.d+3)%6){shCl.clash=true;const sx=(sa.bd||po.dmgb)?1:0;ev.push({k:'hit',id:x.id,ph});dmg(i,(R.pnb?2:1)+sx,'zderzenie z owcą',shCl.o);useBonus(po)}}
    if(victims.length){trig(x.id,'Byku');useBonus(x);
     victims.forEach(j=>{if(ph===1)ev.push({k:'hit',id:S[j].id,ph});dmg(j,2+extra,'szarża Byka',i)});
     if(victims.length>=2)x.pts.m+=victims.length-1;
     const nq=hitCell[0]+dd[0],nr=hitCell[1]+dd[1],moved=[];
     if(IN(nq,nr))victims.forEach(j=>{const f=S[j].pos.slice();move(j,[nq,nr],'odrzut',i,'szarża Byka');S[j].moved=true;ev.push({k:'knock',id:S[j].id,from:f,to:[nq,nr],ph});moved.push(j)});
     else J({k:'brak odrzutu',id:x.id,by:x.id,rule:'za trafionym jest krawędź planszy'});
     if(moved.length){const g=S.map((y,j)=>!y.out&&K(...y.pos)===K(nq,nr)?j:-1).filter(j=>j>=0);if(g.length>1)g.forEach(j=>dmg(j,1,'kolizja po odrzuceniu'))}}});
   /* 11 szarża owcy */
   step=STEPS[10];
   S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a||a.t!=='atk'||x.ch!=='Pasterz')return;
    const s=sheepOf(i);if(!s){ev.push({k:'scharge',id:x.id,none:true});return}if(s.clash)return;
    const dd=D[a.d],extra=(a.bd||x.dmgb)?1:0,from=s.pos.slice();let cur=s.pos.slice(),victims=[],steps=0;
    for(;;){const nq=cur[0]+dd[0],nr=cur[1]+dd[1];if(!IN(nq,nr))break;
     const vs=at(i,nq,nr);
     if(vs.length){if(R.pnb){victims=victims.concat(vs)}else{victims=vs;break}}cur=[nq,nr];steps++}
    s.pos=cur.slice();ev.push({k:'scharge',id:x.id,from,to:cur.slice(),steps,hit:victims.length>0,dir:a.d});J({k:'szarża owcy',id:x.id,from,to:cur.slice(),by:x.id,rule:R.pnb?'owca przebiega przez postacie':'owca zatrzymuje się na pierwszej postaci'});
    if(victims.length){trig(x.id,'Pasterz');useBonus(x);victims.forEach(j=>{if(ph===1)ev.push({k:'hit',id:S[j].id,ph});dmg(j,(R.pnb?2:1)+extra,'szarża owcy',i)});if(victims.length>=2)x.pts.m+=victims.length-1}});
   /* 12 manipulacja: Ciotka przesuwa trafioną postać (pole wybiera gracz po rozpatrzeniu) */
   step=STEPS[11];
   pnd.forEach(p=>{const t=S[p.t],dest=pd&&pd[p.by];t.moved=true;const by=S.findIndex(y=>y.id===p.by);
    if(dest){const from=t.pos.slice();move(p.t,dest,'przesunięcie',by,'manipulacja Ciotki');ev.push({k:'push',id:t.id,from,to:dest.slice()});
     const g=S.map((y,j)=>!y.out&&K(...y.pos)===K(...dest)?j:-1).filter(j=>j>=0);
     if(g.length>1){trig(p.by,'Ciotka');g.forEach(j=>dmg(j,1,'kolizja po przesunięciu'))}
     else if(dist(...dest)>zone)trig(p.by,'Ciotka')}
    else{pend.push({by:p.by,id:t.id,pos:t.pos.slice()});ev.push({k:'pending',id:t.id,pos:t.pos.slice()});J({k:'czeka na przesunięcie',id:t.id,by:p.by,rule:'gracz Ciotki wybiera pole'})}});
   /* 13 trucizna z kałuż */
   step=STEPS[12];
   const poisoners=new Set();
   PU.forEach(p=>{const oi=S.findIndex(y=>y.id===p.o);S.forEach((y,j)=>{if(y.out||y.id===p.o||K(...y.pos)!==p.k||(oi>=0&&ally(oi,j)))return;dmg(j,(p.b?2:1)+(R.tb?1:0),'trucizna',oi>=0?oi:undefined);poisoners.add(p.o)})});
   poisoners.forEach(o=>trig(o,'Truchel'));
   /* 14 eliminacje */
   step=STEPS[13];
   SHP.forEach(s=>{if(s.alive&&s.doomed){s.alive=false;ev.push({k:'sheephit',id:S[s.o].id,pos:s.pos.slice()});J({k:'śmierć owcy',id:S[s.o].id,pos:s.pos.slice(),rule:'owca trafiona w tej fazie'})}});
   S.forEach(x=>{if(!x.out&&x.hp<=0){x.out=true;ev.push({k:'out',id:x.id});J({k:'eliminacja',id:x.id,hp:x.hp,rule:'HP ≤ 0 na koniec fazy'})}});
   /* 15 anulowanie fazy III Długiego po przesunięciu */
   step=STEPS[14];
   if(ph===1)S.forEach((x,i)=>{if(x.ch==='Długi'&&x.moved&&!x.out&&L[i].plan[2]){x.cancel3=true;ev.push({k:'cancel',id:x.id});J({k:'anulowana faza III',id:x.id,rule:'Długi przesunięty w fazie II'})}});
  }
  /* koniec rundy: strefa */
  ph=3;step='strefa';
  S.forEach(x=>{if(x.out||dist(...x.pos)<=zone)return;
   if(x.sh){x.sh=false;x.shUsed=true;x.log.push('strefa: tarcza blokuje');ev.push({k:'shield',id:x.id});J({k:'shield',id:x.id,cause:'strefa',by:null});return}
   x.hp-=1;x.log.push('strefa: −1');ev.push({k:'dmg',id:x.id,n:1,w:'strefa',ph:3});J({k:'dmg',id:x.id,n:1,cause:'strefa',by:null,hp:x.hp});
   if(x.hp<=0){x.out=true;ev.push({k:'out',id:x.id});J({k:'eliminacja',id:x.id,hp:x.hp,rule:'HP ≤ 0 po strefie'})}});
  SHP.forEach(s=>{if(S[s.o].out)s.alive=false});
  S.sheep={};SHP.forEach(s=>{if(s.alive)S.sheep[S[s.o].id]=s.pos.slice()});
  S.droneOn={};S.forEach(x=>{if(x.drone&&!x.out)S.droneOn[x.id]=true});
  S.pudNew=pudNew;S.pudAll=PU;S.ev=ev;S.pend=pend;S.journal=journal;return S}

 /* czytelny opis wpisu dziennika */
 function explain(e,name){const n=id=>name?name(id):id,f=['I','II','III','koniec'][e.ph]||e.ph;
  if(e.k==='dmg')return 'Faza '+f+' ['+e.step+']: '+n(e.id)+' −'+e.n+' HP ('+e.cause+(e.by&&e.by!==e.id?', sprawca: '+n(e.by):'')+') → '+e.hp+' HP';
  if(e.k==='shield')return 'Faza '+f+' ['+e.step+']: tarcza '+n(e.id)+' blokuje 1 punkt ('+e.cause+')';
  if(e.k==='sheep')return 'Faza '+f+' ['+e.step+']: owca gracza '+n(e.id)+' trafiona'+(e.by?' przez '+n(e.by):'')+' – zginie po rozpatrzeniu ataków';
  if(e.k==='śmierć owcy')return 'Faza '+f+': owca gracza '+n(e.id)+' ginie';
  if(e.k==='eliminacja')return 'Faza '+f+': '+n(e.id)+' odpada ('+e.rule+')';
  if(e.from&&e.to)return 'Faza '+f+' ['+e.step+']: '+e.k+' '+n(e.id)+' '+e.from.join(',')+' → '+e.to.join(',')+(e.by&&e.by!==e.id?' (sprawca: '+n(e.by)+')':'')+(e.rule?' – '+e.rule:'');
  return 'Faza '+f+' ['+e.step+']: '+e.k+' '+n(e.id)+(e.rule?' – '+e.rule:'')}
 return {run,shape,explain,STEPS,rng}})();
if(typeof module!=='undefined')module.exports=Combat;
