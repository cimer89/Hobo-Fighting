/* ===================== NOWE POSTACIE (Pasterz, Truchel, Sierżant Przemo) + PUNKTACJA ===================== */
Object.assign(C,{
 'Pasterz':{col:'#c8a26b',txt:'Owca (1 HP): przywołaj, poruszaj, szarżuj nią (1 DMG). Osłania przed strzałami. Jedna owca na planszy.'},
 'Truchel':{col:'#19b5a5',txt:'Teleport na dowolne pole. Zamiast ataku tworzy kałużę trucizny (3 rundy, obrażenia na koniec każdej fazy).'},
 'Sierżant Przemo':{col:'#d9544f',txt:'Pistolet 1 DMG (jak Żyleta). Dron: faza I aktywacja, faza II wysłanie, atakuje najbliższą postać.'}});
Object.assign(INI,{P:'Pasterz',T:'Truchel',S:'Sierżant Przemo'});
function whyTxt(w){return {'Wiatrak':'Wiatrak trafił 2+ przeciwników','Długi':'trafienie na najdalszym polu','Żyleta':'trafienie z 4+ heksów','Byku':'udana szarża','Ciotka':'przesunięcie: kolizja lub strefa','Pasterz':'owca trafiła przeciwnika','Truchel':'trucizna zraniła przeciwnika','Sierżant Przemo':'trafienie z 4+ heksów lub dronem','strefa':'zmiana strefy'}[w]||w}

/* --- akcje i interfejs planowania --- */
function nbCells(c){return D.map(([a,b])=>[c[0]+a,c[1]+b]).filter(([q,r])=>IN(q,r))}
function sheepAtPhase(ph){const q=curP();if(!q)return null;let s=q.sheepr&&q.sheepr[st.round]?q.sheepr[st.round].slice():null;
 for(let i=0;i<ph;i++){const x=st.plan[i];if(!x)continue;
  if(x.t==='summon'&&x.m)s=x.m.slice();
  else if(x.t==='smove'&&x.m&&s)s=x.m.slice();
  else if(x.t==='atk'&&x.d!==null&&s){const dd=D[x.d];let cur=s.slice();for(;;){const nq=cur[0]+dd[0],nr=cur[1]+dd[1];if(!IN(nq,nr))break;cur=[nq,nr]}s=cur}}
 return s}
function droneAt(ph){const q=curP();if(!q)return false;let d=!!(q.dr&&q.dr[st.round]);for(let i=0;i<ph;i++){const x=st.plan[i];if(x&&x.t==='drone')d=(i===0)}return d}
function actDefs(ch,ph){
 if(ch==='Byku')return [{t:'move',l:'Skok'},{t:'atk',l:'Szarża',dis:ph<1}];
 if(ch==='Pasterz'){const s=sheepAtPhase(ph);return [{t:'move',l:'Ruch'},{t:'smove',l:'Ruch owcy',dis:!s},{t:'summon',l:'Przywołaj',dis:!!s},{t:'atk',l:'Szarża owcy',dis:!s}]}
 if(ch==='Truchel')return [{t:'move',l:'Teleport'},{t:'atk',l:'Kałuża'}];
 if(ch==='Sierżant Przemo'){const on=droneAt(ph);return [{t:'move',l:'Ruch'},{t:'atk',l:'Pistolet'},{t:'drone',l:ph===0?'Dron (aktywuj)':'Dron (wyślij)',dis:ph===0?on:(ph===1?!on:true)}]}
 return [{t:'move',l:'Ruch'},{t:'atk',l:'Atak'}]}
function actBtns(pl,ph){const defs=actDefs(st.ch,ph),w=defs.length>3?'44':defs.length===3?'30':'46';return '<div class="row acts" style="--n:'+defs.length+'">'+defs.map(d=>'<button class="'+(pl.t===d.t?'on':'')+'" data-t="'+d.t+'" '+(d.dis?'disabled':'')+'>'+d.l+'</button>').join('')+'</div>'}
function planOk(pl,ph){const t=pl.t;if(t==='move'||t==='smove'||t==='summon')return !!pl.m;if(t==='atk')return pl.d!==null;if(t==='drone')return ph===0?true:!!pl.m;return false}
function planHint(pl,ph){const ch=st.ch;
 if(ch==='Pasterz'){if(!pl.t)return sheepAtPhase(ph)?'Owca jest już na mapie: rusz siebie, rusz owcę albo szarżuj nią.':'Wybierz akcję: ruch albo przywołanie owcy.';
  if(pl.t==='move')return 'Ruch Pasterza o 1 pole lub zostań.';
  if(pl.t==='smove')return 'Ruch owcy o 1 pole (dotknij pola obok owcy).';
  if(pl.t==='summon')return 'Dotknij sąsiedniego pola, by przywołać owcę.';
  if(pl.t==='atk')return pl.d===null?'Dotknij pola obok owcy, by wybrać kierunek szarży.':'Szarża owcy: '+DN[pl.d]+(TB()?' (2 DMG każdej postaci w linii).':' (1 DMG pierwszej napotkanej postaci).')}
 if(ch==='Truchel'){if(pl.t==='move')return 'Teleport: dotknij dowolnego pola (także zajętego).';
  if(pl.t==='atk')return pl.d===null?'Dotknij sąsiedniego pola, na którym powstanie kałuża.':'Kałuża: '+DN[pl.d]+' (trucizna przez 3 rundy).'}
 if(ch==='Sierżant Przemo'){if(pl.t==='atk')return pl.d===null?'Pistolet: dotknij sąsiedniego pola, by wybrać kierunek (1 DMG).':'Pistolet: '+DN[pl.d]+' (1 DMG, trafia pierwszą postać).';
  if(pl.t==='drone')return ph===0?'Aktywujesz drona (to cała akcja fazy I).':'Dotknij pola, nad które lecisz dronem. Dron zaatakuje najbliższą postać.'}
 return ''}
function planTap(pl,q,r,from,i){const ch=st.ch,ph=st.ph;
 if(pl.t==='move'){if(ch==='Truchel'){pl.m=[q,r];return}if(i>=0||(q===from[0]&&r===from[1])||(ch==='Byku'&&dist(q-from[0],r-from[1])<=(TB()&&ph>0?1:2)))pl.m=[q,r];return}
 if(pl.t==='atk'){if(ch==='Pasterz'){const s=sheepAtPhase(ph);if(!s)return;const j=D.findIndex(([a,b])=>s[0]+a===q&&s[1]+b===r);if(j>=0)pl.d=j;return}if(i>=0)pl.d=i;return}
 if(pl.t==='smove'){const s=sheepAtPhase(ph);if(s&&dist(q-s[0],r-s[1])<=1)pl.m=[q,r];return}
 if(pl.t==='summon'){if(i>=0)pl.m=[q,r];return}
 if(pl.t==='drone'&&ph>=1)pl.m=[q,r]}
function extraHL(hl,pl,from,ph){
 const ch=st.ch,OK={fill:'color-mix(in srgb,var(--ok) 35%,transparent)',stroke:'var(--ok)'},PUR='color-mix(in srgb,#b36cff 26%,transparent)',SEL='color-mix(in srgb,#b36cff 55%,transparent)';
 if(ch==='Truchel'&&pl.t==='move'){cells.forEach(([q,r])=>{hl[K(q,r)]={fill:PUR}});if(pl.m)hl[K(...pl.m)]={fill:SEL,stroke:'var(--ink)',t:'→'};return}
 if(ch==='Sierżant Przemo'&&pl.t==='drone'&&ph>=1){cells.forEach(([q,r])=>{hl[K(q,r)]={fill:PUR}});if(pl.m)hl[K(...pl.m)]={fill:SEL,stroke:'var(--ink)',t:'✈'};return}
 if(ch==='Pasterz'){const s=sheepAtPhase(ph);
  if(pl.t==='summon'){nbCells(from).forEach(c=>{hl[K(...c)]=Object.assign({},OK)});if(pl.m)hl[K(...pl.m)]={fill:'color-mix(in srgb,var(--ok) 55%,transparent)',stroke:'var(--ink)',t:'O'}}
  else if(pl.t==='smove'&&s){nbCells(s).concat([s]).forEach(c=>{hl[K(...c)]=Object.assign({},OK)});if(pl.m)hl[K(...pl.m)]={fill:'color-mix(in srgb,var(--ok) 55%,transparent)',stroke:'var(--ink)',t:'O'}}
  else if(pl.t==='atk'&&s){if(pl.d===null)nbCells(s).forEach(c=>{hl[K(...c)]={stroke:'var(--hit)'}});else{const dd=D[pl.d];let cur=s.slice();for(;;){const nq=cur[0]+dd[0],nr=cur[1]+dd[1];if(!IN(nq,nr))break;cur=[nq,nr];hl[K(nq,nr)]={fill:'color-mix(in srgb,var(--hit) 40%,transparent)',stroke:'var(--hit)',t:'»'}}}}}}
function actTxt(ch,x,pos,ph){const t=x.t;
 if(t==='move')return K(...x.m)===K(...pos)?'zostaje':(ch==='Byku'?'skok → ':ch==='Truchel'?'teleport → ':'ruch → ')+x.m.join(', ');
 if(t==='smove')return 'ruch owcy → '+x.m.join(', ');
 if(t==='summon')return 'przywołuje owcę → '+x.m.join(', ');
 if(t==='drone')return ph===0?'aktywuje drona':'wysyła drona → '+(x.m?x.m.join(', '):'?');
 return (ch==='Byku'?'szarża ':ch==='Pasterz'?'szarża owcy ':ch==='Truchel'?'kałuża ':ch==='Sierżant Przemo'?'pistolet ':'atak ')+DN[x.d]}
function planTxt(p){let pos=p.posr[st.round];return p.plans[st.round].map((x,i)=>{const t=actTxt(p.ch,x,pos,i);if(x.t==='move')pos=x.m;return 'Faza '+['I','II','III'][i]+': '+t}).join(' · ')}
function attack(p,d,ph,ch){ch=ch||st.ch;
 const out=[],[dq,dr]=D[d];
 const line=(n,dm)=>{for(let k=1;k<=n;k++){const q=p[0]+dq*k,r=p[1]+dr*k;if(!IN(q,r))break;out.push([q,r,dm(k)])}};
 if(ch==='Wiatrak'){[[d,2],[(d+1)%6,1],[(d+5)%6,1]].forEach(([i,v])=>{const q=p[0]+D[i][0],r=p[1]+D[i][1];if(IN(q,r))out.push([q,r,v])})}
 else if(ch==='Długi')line(3,k=>k===3?2:1);
 else if(ch==='Żyleta')line(9,()=>2);
 else if(ch==='Ciotka')line(3,()=>ph===0?2:1);
 else if(ch==='Byku')line(9,()=>'»');
 else if(ch==='Sierżant Przemo')line(9,()=>1);
 else if(ch==='Truchel'){const q=p[0]+dq,r=p[1]+dr;if(IN(q,r))out.push([q,r,'☠'])}
 return out}

/* --- symulacja --- */
function sim(L,round,pd,PUD){
 const S=L.map(x=>({id:x.id,ch:x.ch,pos:x.pos.slice(),hp:x.hp,log:[],out:false,sh:!!x.sh,shUsed:false,dmgb:!!x.dmgb,dmgbUsed:false,moved:false,cancel3:false,drone:!!x.drone,pts:{d:0,m:0},tm:x.tm||null})),ev=[],pend=[];
 const SHP=[];L.forEach((x,i)=>{if(x.sheep)SHP.push({o:i,pos:x.sheep.slice(),alive:true})});
 const PU=(PUD||[]).map(p=>Object.assign({},p)),pudNew=[];
 const rnd=rng(seedStr()+':d:'+round);
 const ally=(i,j)=>i!==j&&!!S[i].tm&&S[i].tm===S[j].tm;
 const trig=(id,why)=>ev.push({k:'trig',id,why});
 const sheepOf=i=>SHP.find(s=>s.o===i&&s.alive);
 const killSheep=s=>{s.alive=false;ev.push({k:'sheephit',id:S[s.o].id,pos:s.pos.slice()})};
 for(let ph=0;ph<3;ph++){
  const planOf=i=>L[i].plan[ph]||null;const CLASH=new Set();
  const act=S.map((x,i)=>!x.out&&!(ph===2&&x.cancel3)&&!!planOf(i));
  if(ph===2&&!S.some((x,i)=>act[i]&&x.ch==='Długi'))break;
  ev.push({k:'phase',ph});
  const dmg=(i,n,w,src)=>{if(src!==undefined&&ally(src,i))return;
   if(S[i].sh&&n>0){S[i].sh=false;S[i].shUsed=true;n-=1;S[i].log.push('F'+(ph+1)+': tarcza blokuje');ev.push({k:'shield',id:S[i].id,ph})}
   if(n<=0)return;
   const app=Math.max(0,Math.min(n,S[i].hp));
   S[i].hp-=n;S[i].log.push('F'+(ph+1)+': −'+n+' '+w);ev.push({k:'dmg',id:S[i].id,n,w,ph});
   if(src!==undefined&&src!==i&&app>0)S[src].pts.d+=app};
  const mv=S.map((x,i)=>{const a=planOf(i);if(!x.out&&a&&a.t==='move'){const from=x.pos.slice(),to=a.m.slice(),ch=K(...to)!==K(...x.pos),far=x.ch==='Byku'&&ch&&dist(to[0]-from[0],to[1]-from[1])>=2;x.pos=to;if(ch||x.ch==='Byku')ev.push({k:'move',id:x.id,from,to,ph,jump:x.ch==='Byku',far,tele:x.ch==='Truchel',stay:!ch});return far?2:(ch?1:0)}return 0});
  S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a)return;
   if(a.t==='smove'){const s=sheepOf(i);if(s){const f=s.pos.slice();s.pos=a.m.slice();ev.push({k:'smove',id:x.id,from:f,to:a.m.slice(),ph})}}
   else if(a.t==='summon'&&!sheepOf(i)){SHP.push({o:i,pos:a.m.slice(),alive:true});ev.push({k:'summon',id:x.id,to:a.m.slice(),ph})}
   else if(a.t==='drone'&&ph===0&&!x.drone){x.drone=true;ev.push({k:'droneon',id:x.id,ph})}});
  if(ph===1)S.forEach((x,i)=>{const d=L[i].dg;if(!x.out&&Array.isArray(d)){const from=x.pos.slice();x.pos=d.slice();ev.push({k:'move',id:x.id,from,to:d.slice(),ph,dodge:true})}});
  const G={};S.forEach((x,i)=>{if(!x.out)(G[K(...x.pos)]=G[K(...x.pos)]||[]).push(i)});
  Object.values(G).forEach(g=>{if(g.length<2)return;
   if(ph===2&&!g.some(i=>act[i]))return;
   const fj=g.filter(i=>S[i].ch==='Byku'&&(mv[i]>=1||(planOf(i)&&planOf(i).t==='move')));
   if(fj.length){const others=g.filter(i=>!fj.includes(i)&&!ally(fj[0],i));others.forEach(i=>dmg(i,3,'lądowanie Byka',fj[0]));if(TB()&&TBP.selfLand&&others.length)fj.forEach(i=>dmg(i,1,'ścisk'));if(others.length>=2)S[fj[0]].pts.m+=others.length-1}
   else if(!g.every(i=>S[i].tm&&S[i].tm===S[g[0]].tm))g.forEach(i=>dmg(i,1,'ścisk'))});
  if(ph===1)S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a||a.t!=='drone'||!x.drone)return;
   const to=a.m?a.m.slice():x.pos.slice();let best=[],bd=1e9;
   S.forEach((y,j)=>{if(j===i||y.out||ally(i,j))return;const d=dist(y.pos[0]-to[0],y.pos[1]-to[1]);if(d<bd){bd=d;best=[j]}else if(d===bd)best.push(j)});
   if(best.length>1){const mh=Math.max(...best.map(j=>S[j].hp));best=best.filter(j=>S[j].hp===mh)}
   const tgt=best.length?best[best.length>1?Math.floor(rnd()*best.length):0]:-1;
   x.drone=false;ev.push({k:'drone',id:x.id,to,target:tgt>=0?S[tgt].id:null,ph});
   if(tgt>=0){ev.push({k:'hit',id:S[tgt].id,ph});dmg(tgt,(TB()?2:1)+((a.bd||x.dmgb)?1:0),'dron',i);trig(x.id,'Sierżant Przemo');if(x.dmgb){x.dmgb=false;x.dmgbUsed=true}}});
  S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a||a.t!=='snipe'||ph!==1)return;const a0=L[i].plan[0];if(!a0||a0.t!=='aim'||a0.d==null)return;const dd=D[a0.d],extra=(a.bd||x.dmgb)?1:0,from=x.pos.slice(),cs=[];let cur=x.pos.slice(),end=null,hs=[];for(;;){const nq=cur[0]+dd[0],nr=cur[1]+dd[1];if(!IN(nq,nr))break;cur=[nq,nr];cs.push(cur.slice());const sh=SHP.find(z=>z.alive&&!ally(i,z.o)&&z.pos[0]===nq&&z.pos[1]===nr);if(sh){killSheep(sh);end=cur.slice();break}const t=S.map((y,j)=>j!==i&&!ally(i,j)&&!y.out&&y.pos[0]===nq&&y.pos[1]===nr?j:-1).filter(j=>j>=0);if(t.length){hs=[t[0]];end=cur.slice();break}}ev.push({k:'atk',id:x.id,ch:x.ch,ph,from,cells:cs,end:end||cur.slice(),hit:hs.length>0,line:true,bd:extra>0,snipe:true});hs.forEach(j=>{ev.push({k:'hit',id:S[j].id,ph});dmg(j,3+extra,'strzał snajperski',i)});if(hs.length&&x.dmgb){x.dmgb=false;x.dmgbUsed=true}});
  S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a||a.t!=='staff'||x.ch!=='Pasterz')return;const dd=D[a.d],extra=(a.bd||x.dmgb)?1:0,cs=[],hs=[];for(let k=1;k<=2;k++){const q=x.pos[0]+dd[0]*k,r=x.pos[1]+dd[1]*k;if(!IN(q,r))break;cs.push([q,r]);SHP.forEach(z=>{if(z.alive&&z.o!==i&&!ally(i,z.o)&&z.pos[0]===q&&z.pos[1]===r)killSheep(z)});S.forEach((y,j)=>{if(j!==i&&!ally(i,j)&&!y.out&&y.pos[0]===q&&y.pos[1]===r)hs.push(j)})}ev.push({k:'atk',id:x.id,ch:x.ch,ph,from:x.pos.slice(),cells:cs,end:cs.length?cs[cs.length-1]:x.pos.slice(),hit:hs.length>0,line:false,bd:extra>0});hs.forEach(j=>{if(ph===1)ev.push({k:'hit',id:S[j].id,ph});dmg(j,2+extra,'kij pasterski',i)});if(hs.length>=2)x.pts.m+=hs.length-1;if(hs.length&&x.dmgb){x.dmgb=false;x.dmgbUsed=true}});
  const pnd=[];
  S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a||a.t!=='atk'||x.ch==='Byku'||x.ch==='Pasterz'||x.ch==='Truchel')return;
   const cs=attack(x.pos,a.d,ph,x.ch),at=(q,r)=>S.map((y,j)=>j!==i&&!ally(i,j)&&!y.out&&y.pos[0]===q&&y.pos[1]===r?j:-1).filter(j=>j>=0);
   const extra=(a.bd||x.dmgb)?1:0,hs=[];let hitIdx=-1,sheepHit=false,end=cs.length?cs[x.ch==='Wiatrak'?0:cs.length-1].slice(0,2):null;
   const first=x.ch==='Żyleta'||x.ch==='Ciotka'||x.ch==='Sierżant Przemo';
   if(first){for(let k=0;k<cs.length;k++){
     const sh=SHP.find(s=>s.alive&&!ally(i,s.o)&&s.pos[0]===cs[k][0]&&s.pos[1]===cs[k][1]);
     if(sh){killSheep(sh);sheepHit=true;end=[cs[k][0],cs[k][1]];break}
     const t=at(cs[k][0],cs[k][1]);if(t.length){hs.push([t[0],cs[k][2]+extra]);end=[cs[k][0],cs[k][1]];hitIdx=k;break}}}
   else{cs.forEach((c,k)=>at(c[0],c[1]).forEach(j=>{hs.push([j,c[2]+extra]);if(hitIdx<0)hitIdx=k}));SHP.forEach(s=>{if(s.alive&&!ally(i,s.o)&&cs.some(c=>c[0]===s.pos[0]&&c[1]===s.pos[1])){killSheep(s);sheepHit=true}})}
   if(x.ch==='Wiatrak'&&hs.length>=2)trig(x.id,'Wiatrak');
   if(x.ch==='Długi'&&cs.length===3&&at(cs[2][0],cs[2][1]).length)trig(x.id,'Długi');
   if((x.ch==='Żyleta'||x.ch==='Sierżant Przemo')&&hitIdx>=3)trig(x.id,x.ch);
   ev.push({k:'atk',id:x.id,ch:x.ch,ph,from:x.pos.slice(),cells:cs.map(c=>[c[0],c[1]]),end,hit:hs.length>0||sheepHit,line:x.ch!=='Wiatrak',bd:extra>0});
   const uniq=new Set(hs.map(h=>h[0]));
   hs.forEach(([j,v])=>{if(ph===1)ev.push({k:'hit',id:S[j].id,ph});dmg(j,v,'atak '+x.ch,i)});if(hs.length&&x.dmgb){x.dmgb=false;x.dmgbUsed=true}
   if(uniq.size>=2)x.pts.m+=uniq.size-1;
   if(ph===1&&x.ch==='Ciotka'&&hs.length)pnd.push({by:x.id,t:hs[0][0]})});
  S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a||a.t!=='atk'||x.ch!=='Truchel')return;
   const nq=x.pos[0]+D[a.d][0],nr=x.pos[1]+D[a.d][1];
   if(!IN(nq,nr)){ev.push({k:'puddle',id:x.id,none:true});return}
   const p={k:K(nq,nr),o:x.id,r0:round,b:(a.bd||x.dmgb)?1:0};PU.push(p);pudNew.push(p);if(x.dmgb){x.dmgb=false;x.dmgbUsed=true}ev.push({k:'puddle',id:x.id,to:[nq,nr],b:p.b,ph})});
  S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a||a.t!=='atk'||x.ch!=='Byku')return;
   const dd=D[a.d],extra=(a.bd||x.dmgb)?1:0,from=x.pos.slice();let cur=x.pos.slice(),hitCell=null,steps=0,shCl=null,crash=false;
   for(;;){const nq=cur[0]+dd[0],nr=cur[1]+dd[1];if(!IN(nq,nr))break;if(TB()&&zoneR(round)<3&&dist(...cur)<=zoneR(round)&&dist(nq,nr)>zoneR(round)){crash=true;break}cur=[nq,nr];steps++;
    shCl=SHP.find(z=>z.alive&&z.o!==i&&!ally(i,z.o)&&z.pos[0]===nq&&z.pos[1]===nr)||null;if(shCl)break;
    if(S.some((y,j)=>j!==i&&!ally(i,j)&&!y.out&&y.pos[0]===nq&&y.pos[1]===nr)){hitCell=cur.slice();break}}
   const victims=hitCell?S.map((y,j)=>j!==i&&!ally(i,j)&&!y.out&&K(...y.pos)===K(...hitCell)?j:-1).filter(j=>j>=0):[];
   ev.push({k:'charge',id:x.id,from,to:cur.slice(),steps,hit:victims.length>0||!!shCl,dir:a.d,bd:extra>0,crash});
   x.pos=cur.slice();if(crash){ev.push({k:'hit',id:x.id,ph});dmg(i,1,'ściana strefy')}if(shCl){killSheep(shCl);CLASH.add(shCl.o);const sa=planOf(shCl.o);if(sa&&sa.t==='atk'&&S[shCl.o].ch==='Pasterz'&&sa.d===(a.d+3)%6){ev.push({k:'hit',id:x.id,ph});dmg(i,PNB()?2:1,'zderzenie z owcą',shCl.o)}}
   if(victims.length){trig(x.id,'Byku');if(x.dmgb){x.dmgb=false;x.dmgbUsed=true}
    victims.forEach(j=>{if(ph===1)ev.push({k:'hit',id:S[j].id,ph});dmg(j,2+extra,'szarża Byka',i)});
    if(victims.length>=2)x.pts.m+=victims.length-1;
    const nq=hitCell[0]+dd[0],nr=hitCell[1]+dd[1],moved=[];
    if(IN(nq,nr))victims.forEach(j=>{const f=S[j].pos.slice();S[j].pos=[nq,nr];S[j].moved=true;ev.push({k:'knock',id:S[j].id,from:f,to:[nq,nr],ph});moved.push(j)});
    if(moved.length){const g=S.map((y,j)=>!y.out&&K(...y.pos)===K(nq,nr)?j:-1).filter(j=>j>=0);if(g.length>1)g.forEach(j=>dmg(j,1,'kolizja po odrzuceniu'))}}});
  S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a||a.t!=='atk'||x.ch!=='Pasterz')return;
   const s=sheepOf(i);if(!s){if(!CLASH.has(i))ev.push({k:'scharge',id:x.id,none:true});return}
   const dd=D[a.d],extra=(a.bd||x.dmgb)?1:0,from=s.pos.slice();let cur=s.pos.slice(),victims=[],steps=0;
   for(;;){const nq=cur[0]+dd[0],nr=cur[1]+dd[1];if(!IN(nq,nr))break;
    const vs=S.map((y,j)=>j!==i&&!ally(i,j)&&!y.out&&y.pos[0]===nq&&y.pos[1]===nr?j:-1).filter(j=>j>=0);
    if(vs.length){if(PNB()){victims=victims.concat(vs)}else{victims=vs;break}}cur=[nq,nr];steps++}
   s.pos=cur.slice();ev.push({k:'scharge',id:x.id,from,to:cur.slice(),steps,hit:victims.length>0,dir:a.d});
   if(victims.length){trig(x.id,'Pasterz');if(x.dmgb){x.dmgb=false;x.dmgbUsed=true}victims.forEach(j=>{if(ph===1)ev.push({k:'hit',id:S[j].id,ph});dmg(j,(PNB()?2:1)+extra,'szarża owcy',i)});if(victims.length>=2)x.pts.m+=victims.length-1}});
  pnd.forEach(p=>{const t=S[p.t],dest=pd&&pd[p.by];t.moved=true;
   if(dest){const from=t.pos.slice();t.pos=dest.slice();ev.push({k:'push',id:t.id,from,to:dest.slice()});
    const g=S.map((y,j)=>!y.out&&K(...y.pos)===K(...dest)?j:-1).filter(j=>j>=0);
    if(g.length>1){trig(p.by,'Ciotka');g.forEach(j=>dmg(j,1,'kolizja po przesunięciu'))}
    else if(dist(...dest)>zoneR(round))trig(p.by,'Ciotka')}
   else{pend.push({by:p.by,id:t.id,pos:t.pos.slice()});ev.push({k:'pending',id:t.id,pos:t.pos.slice()})}});
  const poisoners=new Set();
  PU.forEach(p=>{const oi=S.findIndex(y=>y.id===p.o);S.forEach((y,j)=>{if(y.out||y.id===p.o||K(...y.pos)!==p.k||(oi>=0&&ally(oi,j)))return;dmg(j,(p.b?2:1)+(TB()?1:0),'trucizna',oi>=0?oi:undefined);poisoners.add(p.o)})});
  poisoners.forEach(o=>trig(o,'Truchel'));
  S.forEach(x=>{if(!x.out&&x.hp<=0){x.out=true;ev.push({k:'out',id:x.id})}});
  if(ph===1)S.forEach((x,i)=>{if(x.ch==='Długi'&&x.moved&&!x.out&&L[i].plan[2]){x.cancel3=true;ev.push({k:'cancel',id:x.id})}});
 }
 S.forEach(x=>{if(x.out||dist(...x.pos)<=zoneR(round))return;
  if(x.sh){x.sh=false;x.shUsed=true;x.log.push('strefa: tarcza blokuje');ev.push({k:'shield',id:x.id});return}
  x.hp-=1;x.log.push('strefa: −1');ev.push({k:'dmg',id:x.id,n:1,w:'strefa',ph:3});if(x.hp<=0){x.out=true;ev.push({k:'out',id:x.id})}});
 SHP.forEach(s=>{if(S[s.o].out)s.alive=false});
 S.sheep={};SHP.forEach(s=>{if(s.alive)S.sheep[S[s.o].id]=s.pos.slice()});
 S.droneOn={};S.forEach(x=>{if(x.drone&&!x.out)S.droneOn[x.id]=true});
 S.pudNew=pudNew;S.pudAll=PU;S.ev=ev;S.pend=pend;return S}

function resolve(items){
 const r=st.round;
 const L=items.filter(o=>alive(o.q,r)).map(o=>{const q=o.q,b=q.bon,usable=!!b&&(q.bonR===undefined||q.bonR<r);
  return {id:o.id,ch:q.ch,pos:q.posr[r],hp:q.hpr&&q.hpr[r]!==undefined?q.hpr[r]:5,plan:q.plans[r],
   sh:usable&&b.k===4,refl:usable&&b.k===6,dg:(q.dg&&q.dg[r]!==undefined)?q.dg[r]:undefined,
   sheep:(q.sheepr&&q.sheepr[r])||null,dmgb:usable&&b.k===2,drone:!!(q.dr&&q.dr[r]),tm:(isTeam()&&q.tm)||null}});
 const PUD=[];items.forEach(o=>(o.q.pud||[]).forEach(p=>{if(p.r0<r&&r-p.r0<=2)PUD.push(p)}));
 const pd={};items.forEach(o=>{if(o.q.push&&o.q.push[r])pd[o.id]=o.q.push[r]});
 const SS=sim(L,r,pd,PUD),out={};
 SS.forEach(x=>{const o=items.find(o=>o.id===x.id),ov=o.q.hpo&&o.q.hpo[r];x.eff=ov!==undefined?ov:Math.max(0,x.hp);
  const xm=o.q.xm&&o.q.xm[r];if(xm&&!x.out)x.pos=xm.slice();out[x.id]=x});
 const hitP1=SS.ev.filter(e=>e.k==='hit'&&e.ph===1).map(e=>e.id);
 out._ev=SS.ev;out._pend=SS.pend;out._trig=SS.ev.filter(e=>e.k==='trig');
 out._alert=L.filter(l=>l.refl&&l.dg===undefined&&hitP1.includes(l.id)).map(l=>l.id);
 out._sheep=SS.sheep;out._drone=SS.droneOn;out._pudNew=SS.pudNew;out._pudAll=SS.pudAll;
 if(st.gm==='special'){const pk=pickups(items.filter(o=>out[o.id]),out,r);out._pick=pk;pk.forEach(p=>{if(p.t===1){out[p.id].eff=Math.min(MAXHP(out[p.id].ch),out[p.id].eff+1);out[p.id].healed=true}})}
 return out}

/* --- elementy na planszy: owca, kałuże, dron --- */
function sheepArt(){return '<ellipse cx="3" cy="22" rx="30" ry="9" fill="#000" opacity=".4" filter="url(#bl)"/><g class="ibob"><circle cx="-14" cy="-4" r="17" fill="#f7f7f2" stroke="#555" stroke-width="3"/><circle cx="4" cy="-14" r="19" fill="#f7f7f2" stroke="#555" stroke-width="3"/><circle cx="20" cy="-2" r="17" fill="#f7f7f2" stroke="#555" stroke-width="3"/><circle cx="2" cy="6" r="19" fill="#f7f7f2" stroke="#555" stroke-width="3"/><ellipse cx="-32" cy="2" rx="11" ry="13" fill="#3a3a3a"/><circle cx="-35" cy="-1" r="3" fill="#fff"/><rect x="-14" y="16" width="6" height="12" fill="#3a3a3a"/><rect x="12" y="16" width="6" height="12" fill="#3a3a3a"/></g>'}
function sheepEl(o,c,isNew){return '<g id="sh-'+o+'" transform="translate('+c[0].toFixed(1)+','+c[1].toFixed(1)+') scale('+(depthScale(c[1])*.95).toFixed(3)+')" style="pointer-events:none"><g'+(isNew?' class="newi"':'')+'>'+sheepArt()+'</g></g>'}
function puddleSvg(){return '<g class="pud"><ellipse rx="52" ry="28" fill="#8fe03a" fill-opacity=".6" stroke="#4a7c10" stroke-width="3"/><ellipse rx="32" ry="16" fill="#b6f25c" fill-opacity=".55"/><circle cx="-20" cy="-4" r="6" fill="#e1ffa8"/><circle cx="16" cy="7" r="5" fill="#e1ffa8"/><circle cx="26" cy="-8" r="3.5" fill="#e1ffa8"/></g>'}
function droneArt(){return '<g class="ibob"><ellipse cx="3" cy="44" rx="22" ry="7" fill="#000" opacity=".35" filter="url(#bl)"/><rect x="-18" y="-8" width="36" height="18" rx="7" fill="#4b5058" stroke="#111" stroke-width="3"/><circle cx="0" cy="1" r="5" fill="#ff5a4f"/><ellipse cx="-26" cy="-12" rx="17" ry="4" fill="#cfd3da" stroke="#111" stroke-width="2"/><ellipse cx="26" cy="-12" rx="17" ry="4" fill="#cfd3da" stroke="#111" stroke-width="2"/></g>'}
function droneEl(o,c){return '<g id="dr-'+o+'" transform="translate('+c[0].toFixed(1)+','+(c[1]-76).toFixed(1)+') scale('+depthScale(c[1]).toFixed(3)+')" style="pointer-events:none">'+droneArt()+'</g>'}
function entState(){
 const r=st.round,its=curItems(),rev=(st.scr==='rev'||st.scr==='hrev');
 if(rev&&!st.animating){let Rs=null;try{Rs=resolve(its)}catch(e){}
  if(Rs){const sheep=[],drone=[];Object.keys(Rs._sheep||{}).forEach(id=>sheep.push({o:id,pos:Rs._sheep[id]}));Object.keys(Rs._drone||{}).forEach(id=>{if(Rs[id])drone.push({o:id,pos:Rs[id].pos})});return {sheep,pud:Rs._pudAll||[],drone}}}
 const sheep=[],pud=[],drone=[];
 its.forEach(o=>{const q=o.q;if(!alive(q,r))return;const s=q.sheepr&&q.sheepr[r];if(s)sheep.push({o:o.id,pos:s});(q.pud||[]).forEach(p=>{if(p.r0<r&&r-p.r0<=2)pud.push(p)});if(q.dr&&q.dr[r]&&q.posr&&q.posr[r])drone.push({o:o.id,pos:q.posr[r]})});
 return {sheep,pud,drone}}
function boardExtras(){try{const E=entState();let under='',over='';
 E.pud.forEach((p,i)=>{const g=GEO[p.k];if(!g)return;under+='<g transform="translate('+g.c[0]+','+(g.c[1]+8)+')" style="pointer-events:none">'+puddleSvg()+'</g>'});
 E.sheep.forEach(s=>{const g=GEO[K(...s.pos)];if(g)over+=sheepEl(s.o,g.c)});
 E.drone.forEach(d=>{const g=GEO[K(...d.pos)];if(g)over+=droneEl(d.o,g.c)});
 return {under,over}}catch(e){return {under:'',over:''}}}
function exAdd(h){const ex=document.getElementById('ex');if(ex)ex.insertAdjacentHTML('beforeend',h)}
function shPos(o,x,y){const e=document.getElementById('sh-'+o);if(e)e.setAttribute('transform','translate('+x.toFixed(1)+','+y.toFixed(1)+') scale('+(depthScale(y)*.95).toFixed(3)+')')}

/* --- punktacja --- */
function ptsOf(o,Rs){const q=o.q;let d=0,m=0,it=0;
 Object.keys(q.pts||{}).forEach(r=>{if(+r<st.round){d+=q.pts[r].d||0;m+=q.pts[r].m||0}});
 Object.keys(q.got||{}).forEach(r=>{if(+r<st.round)it++});
 const x=Rs&&Rs[o.id];if(x&&x.pts){d+=x.pts.d;m+=x.pts.m}
 if(Rs&&Rs._pick)Rs._pick.forEach(p=>{if(p.id===o.id)it++});
 return {d,m,it}}
function ptTotal(o,Rs){const p=ptsOf(o,Rs);return p.d+p.m+p.it}

/* --- zapis stanu na kolejną rundę --- */
document.addEventListener('click',function(e){
 if(e.target.closest&&e.target.closest('[data-a="newgame"]')){location.reload();return}
 const t=e.target.closest('[data-a="next"],[data-a="hnextr"]');if(!t)return;
 const r=st.round,items=curItems(),fin=(st._fin&&st._finRound===r)?st._fin:null;if(!fin)return;
 items.forEach(o=>{if(!mine(o.id))return;const q=o.q;
  q.sheepr=q.sheepr||{};q.dr=q.dr||{};q.pts=q.pts||{};
  q.sheepr[r+1]=(fin._sheep&&fin._sheep[o.id])?fin._sheep[o.id].slice():null;
  q.dr[r+1]=!!(fin._drone&&fin._drone[o.id]);
  const x=fin[o.id];if(x&&x.pts)q.pts[r]={d:x.pts.d,m:x.pts.m};
  (fin._pudNew||[]).forEach(p=>{if(p.o===o.id){q.pud=q.pud||[];q.pud.push({k:p.k,o:p.o,r0:p.r0,b:p.b})}})});
 if(!H)save();},true);
render();
Object.assign(IMG,{"Pasterz": '', "Truchel": '', "Sierżant Przemo": ''});
Object.assign(CHA,{"Pasterz": '', "Truchel": '', "Sierżant Przemo": ''});
Object.assign(ART,{"Pasterz": "@@asset:img/art_pasterz_2.webp@@", "Truchel": "@@asset:img/art_truchel_2.webp@@", "Sierżant Przemo": "@@asset:img/art_sierzant_przemo_2.webp@@"});
