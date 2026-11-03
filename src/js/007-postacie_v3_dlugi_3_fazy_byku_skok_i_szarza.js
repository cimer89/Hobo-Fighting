/* ===================== POSTACIE v3: Długi (3 fazy), Byku (Skok i Szarża) ===================== */
function nPh(ch){return ch==='Długi'?3:2}
function newPlan(){const a=[];for(let i=0;i<nPh(st.ch);i++)a.push({t:null,m:null,d:null});return a}
function actTxt(ch,x,pos){return x.t==='move'?(K(...x.m)===K(...pos)?'zostaje':(ch==='Byku'?'skok → ':'ruch → ')+x.m.join(', ')):(ch==='Byku'?'szarża ':'atak ')+DN[x.d]}
function planTxt(p){let pos=p.posr[st.round];return p.plans[st.round].map((x,i)=>{const t=actTxt(p.ch,x,pos);if(x.t==='move')pos=x.m;return 'Faza '+['I','II','III'][i]+': '+t}).join(' · ')}
function stepperHtml(cur,tot){const N=['I','II','III'],ci=N.indexOf(cur),n=N.indexOf(tot)+1;let h='<div class="stepper"><b>FAZA</b>';for(let i=0;i<n;i++)h+='<i class="'+(i===ci?'on':(i<ci?'done':''))+'">'+N[i]+'</i>';return h+'</div>'}
function attack(p,d,ph,ch){ch=ch||st.ch;
 const out=[],[dq,dr]=D[d];
 const line=(n,dm)=>{for(let k=1;k<=n;k++){const q=p[0]+dq*k,r=p[1]+dr*k;if(!IN(q,r))break;out.push([q,r,dm(k)])}};
 if(ch==='Wiatrak'){[[d,2],[(d+1)%6,1],[(d+5)%6,1]].forEach(([i,v])=>{const q=p[0]+D[i][0],r=p[1]+D[i][1];if(IN(q,r))out.push([q,r,v])})}
 else if(ch==='Długi')line(3,k=>k===3?2:1);
 else if(ch==='Żyleta')line(9,()=>2);
 else if(ch==='Ciotka')line(3,()=>ph===0?2:1);
 else if(ch==='Byku')line(9,()=>'»');
 return out}

function sim(L,round,pd){
 const S=L.map(x=>({id:x.id,ch:x.ch,pos:x.pos.slice(),hp:x.hp,log:[],out:false,sh:!!x.sh,shUsed:false,moved:false,cancel3:false})),ev=[],pend=[];
 const trig=(id,why)=>ev.push({k:'trig',id,why});
 for(let ph=0;ph<3;ph++){
  const planOf=i=>L[i].plan[ph]||null;
  const act=S.map((x,i)=>!x.out&&!(ph===2&&x.cancel3)&&!!planOf(i));
  if(ph===2&&!S.some((x,i)=>act[i]&&x.ch==='Długi'))break;
  ev.push({k:'phase',ph});
  const dmg=(i,n,w)=>{
   if(S[i].sh&&n>0){S[i].sh=false;S[i].shUsed=true;n-=1;S[i].log.push('F'+(ph+1)+': tarcza blokuje');ev.push({k:'shield',id:S[i].id,ph})}
   if(n<=0)return;
   S[i].hp-=n;S[i].log.push('F'+(ph+1)+': −'+n+' '+w);ev.push({k:'dmg',id:S[i].id,n,w,ph})};
  const mv=S.map((x,i)=>{const a=planOf(i);if(!x.out&&a&&a.t==='move'){const from=x.pos.slice(),to=a.m.slice(),ch=K(...to)!==K(...x.pos),far=x.ch==='Byku'&&ch&&dist(to[0]-from[0],to[1]-from[1])>=2;x.pos=to;if(ch)ev.push({k:'move',id:x.id,from,to,ph,jump:x.ch==='Byku',far});return far?2:(ch?1:0)}return 0});
  if(ph===1)S.forEach((x,i)=>{const d=L[i].dg;if(!x.out&&Array.isArray(d)){const from=x.pos.slice();x.pos=d.slice();ev.push({k:'move',id:x.id,from,to:d.slice(),ph,dodge:true})}});
  const G={};S.forEach((x,i)=>{if(!x.out)(G[K(...x.pos)]=G[K(...x.pos)]||[]).push(i)});
  Object.values(G).forEach(g=>{if(g.length<2)return;
   if(ph===2&&!g.some(i=>act[i]))return;
   const fj=g.filter(i=>S[i].ch==='Byku'&&mv[i]===2);
   if(fj.length)g.forEach(i=>{if(!fj.includes(i))dmg(i,1,'lądowanie Byka')});
   else g.forEach(i=>dmg(i,1,'ścisk'))});
  const pnd=[];
  S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a||a.t!=='atk'||x.ch==='Byku')return;
   const cs=attack(x.pos,a.d,ph,x.ch),at=(q,r)=>S.map((y,j)=>j!==i&&!y.out&&y.pos[0]===q&&y.pos[1]===r?j:-1).filter(j=>j>=0);
   const extra=a.bd?1:0,hs=[];let hitIdx=-1,end=cs.length?cs[x.ch==='Wiatrak'?0:cs.length-1].slice(0,2):null;
   if(x.ch==='Żyleta'||x.ch==='Ciotka'){for(let k=0;k<cs.length;k++){const t=at(cs[k][0],cs[k][1]);if(t.length){hs.push([t[0],cs[k][2]+extra]);end=[cs[k][0],cs[k][1]];hitIdx=k;break}}}
   else cs.forEach((c,k)=>at(c[0],c[1]).forEach(j=>{hs.push([j,c[2]+extra]);if(hitIdx<0)hitIdx=k}));
   if(x.ch==='Wiatrak'&&hs.length>=2)trig(x.id,'Wiatrak');
   if(x.ch==='Długi'&&cs.length===3&&at(cs[2][0],cs[2][1]).length)trig(x.id,'Długi');
   if(x.ch==='Żyleta'&&hitIdx>=3)trig(x.id,'Żyleta');
   ev.push({k:'atk',id:x.id,ch:x.ch,ph,from:x.pos.slice(),cells:cs.map(c=>[c[0],c[1]]),end,hit:hs.length>0,line:x.ch!=='Wiatrak',bd:extra>0});
   hs.forEach(([j,v])=>{if(ph===1)ev.push({k:'hit',id:S[j].id,ph});dmg(j,v,'atak '+x.ch)});
   if(ph===1&&x.ch==='Ciotka'&&hs.length)pnd.push({by:x.id,t:hs[0][0]})});
  S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a||a.t!=='atk'||x.ch!=='Byku')return;
   const dd=D[a.d],extra=a.bd?1:0,from=x.pos.slice();let cur=x.pos.slice(),hitCell=null,steps=0;
   for(;;){const nq=cur[0]+dd[0],nr=cur[1]+dd[1];if(!IN(nq,nr))break;cur=[nq,nr];steps++;
    if(S.some((y,j)=>j!==i&&!y.out&&y.pos[0]===nq&&y.pos[1]===nr)){hitCell=cur.slice();break}}
   const victims=hitCell?S.map((y,j)=>j!==i&&!y.out&&K(...y.pos)===K(...hitCell)?j:-1).filter(j=>j>=0):[];
   ev.push({k:'charge',id:x.id,from,to:cur.slice(),steps,hit:victims.length>0,dir:a.d,bd:extra>0});
   x.pos=cur.slice();
   if(victims.length){trig(x.id,'Byku');
    victims.forEach(j=>{if(ph===1)ev.push({k:'hit',id:S[j].id,ph});dmg(j,3+extra,'szarża Byka')});
    const nq=hitCell[0]+dd[0],nr=hitCell[1]+dd[1],moved=[];
    if(IN(nq,nr))victims.forEach(j=>{const f=S[j].pos.slice();S[j].pos=[nq,nr];S[j].moved=true;ev.push({k:'knock',id:S[j].id,from:f,to:[nq,nr],ph});moved.push(j)});
    if(moved.length){const g=S.map((y,j)=>!y.out&&K(...y.pos)===K(nq,nr)?j:-1).filter(j=>j>=0);if(g.length>1)g.forEach(j=>dmg(j,1,'kolizja po odrzuceniu'))}}});
  pnd.forEach(p=>{const t=S[p.t],dest=pd&&pd[p.by];t.moved=true;
   if(dest){const from=t.pos.slice();t.pos=dest.slice();ev.push({k:'push',id:t.id,from,to:dest.slice()});
    const g=S.map((y,j)=>!y.out&&K(...y.pos)===K(...dest)?j:-1).filter(j=>j>=0);
    if(g.length>1){trig(p.by,'Ciotka');g.forEach(j=>dmg(j,1,'kolizja po przesunięciu'))}
    else if(dist(...dest)>zoneR(round))trig(p.by,'Ciotka')}
   else{pend.push({by:p.by,id:t.id,pos:t.pos.slice()});ev.push({k:'pending',id:t.id,pos:t.pos.slice()})}});
  S.forEach(x=>{if(!x.out&&x.hp<=0){x.out=true;ev.push({k:'out',id:x.id})}});
  if(ph===1)S.forEach((x,i)=>{if(x.ch==='Długi'&&x.moved&&!x.out&&L[i].plan[2]){x.cancel3=true;ev.push({k:'cancel',id:x.id})}});
 }
 S.forEach(x=>{if(x.out||dist(...x.pos)<=zoneR(round))return;
  if(x.sh){x.sh=false;x.shUsed=true;x.log.push('strefa: tarcza blokuje');ev.push({k:'shield',id:x.id});return}
  x.hp-=1;x.log.push('strefa: −1');ev.push({k:'dmg',id:x.id,n:1,w:'strefa',ph:3});if(x.hp<=0){x.out=true;ev.push({k:'out',id:x.id})}});
 S.ev=ev;S.pend=pend;return S}
render();
Object.assign(IMG,{"Pasterz": "@@asset:img/img_pasterz.jpg@@", "Truchel": "@@asset:img/img_truchel.jpg@@", "Sierżant Przemo": "@@asset:img/img_sierzant_przemo.jpg@@"});
Object.assign(CHA,{"Pasterz": "@@asset:img/cha_pasterz.jpg@@", "Truchel": "@@asset:img/cha_truchel.jpg@@", "Sierżant Przemo": "@@asset:img/cha_sierzant_przemo.jpg@@"});
Object.assign(ART,{"Pasterz": "@@asset:img/art_pasterz.webp@@", "Truchel": "@@asset:img/art_truchel.webp@@", "Sierżant Przemo": "@@asset:img/art_sierzant_przemo.webp@@"});
