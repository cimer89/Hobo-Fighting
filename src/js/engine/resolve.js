/* ===================== Silnik: rozpatrywanie rundy (sim, ataki, wynik) ===================== */
/* --- z części: TRYBY GRY + TRYB SPECJALNY (przedmioty na mapie) --- */
function seedStr(){return H?(st.seed||'h'):(net.code||'x')}
function spawnCount(r){return r===1?6:r===3?5:r===6?4:r===9?3:0}
function withRound(r,fn){const o=st.round,had=st._real!==undefined;if(!had)st._real=o;st.round=r;try{return fn()}finally{st.round=o;if(!had)delete st._real}}
function realRound(){return st._real!==undefined?st._real:st.round}
function finalAt(r){return withRound(r,()=>{const its=curItems().filter(o=>o.q.plans&&o.q.plans[r]&&o.q.posr&&o.q.posr[r]);return its.length?resolve(its):null})}
function resolveFin(items){return(st._fin&&st._finRound===st.round&&st._finMode===(H?'h':'n'))?st._fin:resolve(items)}
/* --- most do silnika walki (engine/combat.js) --- */
/* zasady zależne od trybu i planszy, odczytywane w chwili rozpatrywania */
function combatRules(round){return {tb:TB(),pnb:PNB(),zone:zoneR(round),br:window.__BR||3,selfLand:TBP.selfLand,zylR:TBP.zylR,zyl2:TBP.zyl2}}
/* kształt ataku (używany też przy planowaniu do podświetlania pól) */
function attack(p,d,ph,ch){ch=ch||st.ch;return Combat.shape(ch,p,d,ph,combatRules(st.round))}
/* rozpatrzenie rundy: ziarno losowania z kodu pokoju / gry i numeru rundy */
function sim(L,round,pd,PUD){return Combat.run({round,seed:seedStr()+':d:'+round,rules:combatRules(round),fighters:L,pushes:pd,puddles:PUD})}
function resolve(items){
 const r=st.round;
 const L=items.filter(o=>alive(o.q,r)).map(o=>{const q=o.q,b=q.bon,usable=!!b&&(q.bonR===undefined||q.bonR<r);
  return {id:o.id,ch:q.ch,pos:q.posr[r],hp:q.hpr&&q.hpr[r]!==undefined?q.hpr[r]:5,plan:q.plans[r],
   sh:usable&&b.k===4,refl:usable&&b.k===6,dg:(q.dg&&q.dg[r]!==undefined)?q.dg[r]:undefined,
   sheep:(q.sheepr&&q.sheepr[r])||null,dmgb:usable&&b.k===2,drone:(q.dr&&q.dr[r])?(q.dr[r]===true?2:+q.dr[r]):0,tm:(isTeam()&&q.tm)||null}});
 const PUD=[];items.forEach(o=>(o.q.pud||[]).forEach(p=>{if(p.r0<r&&r-p.r0<=2)PUD.push(p)}));
 const pd={};items.forEach(o=>{if(o.q.push&&o.q.push[r])pd[o.id]=o.q.push[r]});
 const SS=sim(L,r,pd,PUD),out={};
 SS.forEach(x=>{const o=items.find(o=>o.id===x.id),ov=o.q.hpo&&o.q.hpo[r];x.eff=ov!==undefined?ov:Math.max(0,x.hp);
  const xm=o.q.xm&&o.q.xm[r];if(xm&&!x.out)x.pos=xm.slice();out[x.id]=x});
 const hitP1=SS.ev.filter(e=>e.k==='hit'&&e.ph===1).map(e=>e.id);
 out._ev=SS.ev;out._pend=SS.pend;out._journal=SS.journal;out._trig=SS.ev.filter(e=>e.k==='trig');
 out._alert=L.filter(l=>l.refl&&l.dg===undefined&&hitP1.includes(l.id)).map(l=>l.id);
 out._sheep=SS.sheep;out._drone=SS.droneOn;out._pudNew=SS.pudNew;out._pudAll=SS.pudAll;
 if(st.gm==='special'){const pk=pickups(items.filter(o=>out[o.id]),out,r);out._pick=pk;pk.forEach(p=>{if(p.t===1){out[p.id].eff=Math.min(MAXHP(out[p.id].ch),out[p.id].eff+1);out[p.id].healed=true}})}
 return out}
