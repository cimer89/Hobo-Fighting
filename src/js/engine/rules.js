/* ===================== Silnik: zasady (strefa, fazy, drużyny, punkty) ===================== */
/* --- z części: js/000-start.js --- */
function zoneR(r){return r<=3?3:r<=6?2:r<=9?1:0}
/* --- z części: TRYBY GRY + TRYB SPECJALNY (przedmioty na mapie) --- */
function lastActor(){return !!H&&H.p.findIndex((q,i)=>i>H.cur&&alive(q,st.round))<0}
/* --- z części: POSTACIE v3: Długi (3 fazy), Byku (Skok i Szarża) --- */
function nPh(ch){return ch==='Długi'?3:2}
function newPlan(){const a=[];for(let i=0;i<nPh(st.ch);i++)a.push({t:null,m:null,d:null});return a}
/* --- z części: NOWE POSTACIE (Pasterz, Truchel, Sierżant Przemo) + PUNKTACJA --- */
function sheepAtPhase(ph){const q=curP();if(!q)return null;let s=q.sheepr&&q.sheepr[st.round]?q.sheepr[st.round].slice():null;
 for(let i=0;i<ph;i++){const x=st.plan[i];if(!x)continue;
  if(x.t==='summon'&&x.m)s=x.m.slice();
  else if(x.t==='smove'&&x.m&&s)s=x.m.slice();
  else if(x.t==='atk'&&x.d!==null&&s){const dd=D[x.d];let cur=s.slice();for(;;){const nq=cur[0]+dd[0],nr=cur[1]+dd[1];if(!IN(nq,nr))break;cur=[nq,nr]}s=cur}}
 return s}
/* liczba aktywacji drona (0–2) na początku fazy ph: stan z początku rundy + akcje drona zaplanowane wcześniej (trzecia akcja = atak, licznik od zera) */
function droneAt(ph){const q=curP();if(!q)return 0;let d=q.dr&&q.dr[st.round]?(q.dr[st.round]===true?2:+q.dr[st.round]):0;for(let i=0;i<ph;i++){const x=st.plan[i];if(x&&x.t==='drone')d=d>=2?0:d+1}return d}
function entState(){
 const r=st.round,its=curItems(),rev=(st.scr==='rev'||st.scr==='hrev');
 if(rev&&!st.animating){let Rs=null;try{Rs=resolve(its)}catch(e){}
  if(Rs){const sheep=[],drone=[];Object.keys(Rs._sheep||{}).forEach(id=>sheep.push({o:id,pos:Rs._sheep[id]}));Object.keys(Rs._drone||{}).forEach(id=>{if(Rs[id])drone.push({o:id,pos:Rs[id].pos})});return {sheep,pud:Rs._pudAll||[],drone}}}
 const sheep=[],pud=[],drone=[];
 its.forEach(o=>{const q=o.q;if(!alive(q,r))return;const s=q.sheepr&&q.sheepr[r];if(s)sheep.push({o:o.id,pos:s});(q.pud||[]).forEach(p=>{if(p.r0<r&&r-p.r0<=2)pud.push(p)});if(q.dr&&q.dr[r]&&q.posr&&q.posr[r])drone.push({o:o.id,pos:q.posr[r]})});
 return {sheep,pud,drone}}
/* --- punktacja --- */
function ptsOf(o,Rs){const q=o.q;let d=0,m=0,it=0;
 Object.keys(q.pts||{}).forEach(r=>{if(+r<st.round){d+=q.pts[r].d||0;m+=q.pts[r].m||0}});
 Object.keys(q.got||{}).forEach(r=>{if(+r<st.round)it++});
 const x=Rs&&Rs[o.id];if(x&&x.pts){d+=x.pts.d;m+=x.pts.m}
 if(Rs&&Rs._pick)Rs._pick.forEach(p=>{if(p.id===o.id)it++});
 return {d,m,it}}
function ptTotal(o,Rs){const p=ptsOf(o,Rs);return p.d+p.m+p.it}
/* --- z części: TRYBY WALKI: FREE FOR ALL / 2 VS 2 --- */
function isTeam(){return st.tm2==='2v2'}
function teamOfCh(ch){if(!isTeam())return null;try{const o=curItems().find(o=>o.q.ch===ch);if(o&&o.q.tm)return o.q.tm}catch(e){}return ch===st.ch?st.team:null}
/* --- wynik i punktacja drużynowa --- */
function winTeam(items,Rs){const al=items.filter(o=>Rs[o.id]&&Rs[o.id].eff>0),ts=new Set(al.map(o=>o.q.tm));return ts.size===1?[...ts][0]:null}
