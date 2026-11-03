/* ===================== BONUSY POSTACI ===================== */
function mine(id){return H?true:id===net.uid}
function curP(){return H?(H.p[H.cur]||null):ME}
function curItems(){return H?H.p.map((q,i)=>({id:'p'+i,q,idx:i})):netItems()}
function playerOf(id){if(H){const i=+String(id).slice(1);return H.p[i]||null}if(id===net.uid)return ME;return (net.pl&&net.pl[id])||null}
function saveP(p){if(!H&&p===ME)save()}
function bonusUsable(p){return !!p.bon&&(p.bonR===undefined||p.bonR<st.round)}
function bonName(k){return {1:'+1 HP',2:'+1 DMG',3:'Dodatkowy ruch',4:'Tarcza',6:'Refleks'}[k]||String(k)}
function posPh2(q){const r=st.round,pl=q.plans&&q.plans[r];let p=q.posr[r];if(!pl)return p;if(pl[0]&&pl[0].t==='move'&&pl[0].m)p=pl[0].m;if(pl[1]&&pl[1].t==='move'&&pl[1].m)p=pl[1].m;return p}
function pickFrom(pk){const it=curItems().find(o=>o.id===pk.id);if(!it)return null;if(pk.kind==='dg')return posPh2(it.q);const x=resolve(curItems())[pk.id];return x?x.pos:null}



function applyRoll(id,v){const p=playerOf(id);if(!p)return;
 const x=resolve(curItems())[id];const eff=x?x.eff:0;
 p.rolled=p.rolled||{};p.rolled[st.round]=true;
 if(v===1){if(eff<MAXHP(p.ch)){p.hpo=p.hpo||{};p.hpo[st.round]=Math.min(MAXHP(p.ch),eff+1)}}
 else if(v>=2&&v<=6&&v!==5){p.bon={k:v};p.bonR=st.round}
 saveP(p)}

function revCore(items,tap){
 const r=st.round,key=(H?'h':'n')+r;
 const Rs=resolve(items),hl={};
 const alerts=Rs._alert||[],pend=Rs._pend||[];
 if(st.animating)return {Rs,over:false,pend:true,html:animView(items)};
 if(!pend.length&&!alerts.length&&st.animKey!==key){st.animating=true;st.animKey=key;st.animItems=items;st.animEv=Rs._ev||[];st.animPick=Rs._pick||[];st.skipReq=false;st.capText='';initAnimPos(items);setTimeout(runAnim,30);return {Rs,over:false,pend:true,html:animView(items)}}
 items.forEach(o=>{const x=Rs[o.id];if(!x||x.eff<=0)return;const k=K(...x.pos),c=C[o.q.ch];hl[k]=hl[k]?{fill:hl[k].fill,t:hl[k].t+o.q.ch[0],stroke:'var(--hit)'}:{fill:c.col,t:o.q.ch[0]}});
 const HL={fill:'color-mix(in srgb,#3ddc84 35%,transparent)',stroke:'#3ddc84'};
 const around=c=>D.forEach(([a,b])=>{const q=c[0]+a,rr=c[1]+b;if(IN(q,rr))hl[K(q,rr)]=Object.assign({},hl[K(q,rr)],HL)});
 pend.forEach(p=>{if(mine(p.by))around(p.pos)});
 if(st.pick){const pf=pickFrom(st.pick);if(pf)around(pf)}
 board(hl);
 const cards=[];
 pend.forEach(p=>{const tc=items.find(o=>o.id===p.id).q.ch;cards.push('<div class="card" style="border-color:'+C.Ciotka.col+'"><b>Ciotka trafiła: '+tc+'!</b> Do wykonania jest akcja przesunięcia o 1 pole w dowolnym kierunku. '+(mine(p.by)?'<button class="go" data-mapmode="1" style="margin-top:6px;width:100%">Wybierz pole na mapie</button>':'Czekamy na gracza Ciotki.')+'</div>')});
 alerts.forEach(id=>{const o=items.find(x=>x.id===id);if(!o)return;
  if(!mine(id)){cards.push('<div class="card"><b>Refleks: '+o.q.ch+'</b> — czekamy na decyzję gracza.</div>');return}
  cards.push('<div class="card" style="border-color:#3ddc84"><b>Refleks: '+o.q.ch+'!</b> Zaraz dostajesz atak. Wybierz zielone pole obok (unik) albo zostań. <div class="row"><button data-pick="dg:'+id+'">Wybierz pole</button><button data-stay="'+id+'">Zostaję</button></div></div>')});
 if(isSp()){(Rs._pick||[]).forEach(pk=>{const o=items.find(x=>x.id===pk.id);cards.push('<div class="card" style="border-color:#f2c230"><b>'+(o?o.q.ch:'')+'</b> podnosi: '+ITEM[pk.t].n+'</div>')});const sc0=spawnCount(r);if(sc0&&!pend.length&&items.filter(o=>Rs[o.id]&&Rs[o.id].eff>0).length>1)cards.push('<div class="card">Nowe przedmioty na mapie: '+sc0+'</div>')}
 const trig=[];
 if(false)items.forEach(o=>{const x=Rs[o.id];if(x&&x.eff>0&&!trig.some(t=>t.id===o.id))trig.push({id:o.id,why:'strefa'})});
 const rolls=[],seen={};
 trig.forEach(t=>{if(seen[t.id])return;seen[t.id]=1;const p=playerOf(t.id);if(!p)return;
  if(p.rolled&&p.rolled[r]==='lost'){cards.push('<div class="card">Okazja przepadła: '+p.ch+' ma już aktywny bonus.</div>');return}
  if(p.rolled&&p.rolled[r])return;
  if(p.bon){if(mine(t.id)){p.rolled=p.rolled||{};p.rolled[r]='lost';saveP(p);cards.push('<div class="card">Okazja przepadła: '+p.ch+' ma już aktywny bonus.</div>')}return}
  rolls.push({id:t.id,why:t.why})});
 rolls.forEach(t=>{const p=playerOf(t.id);
  if(mine(t.id))cards.push('<div class="card" style="border-color:#f2c230"><b>Rzut kością: '+p.ch+'</b> — '+whyTxt(t.why)+'. <button class="go" data-roll="'+t.id+'">Zakręć koło</button></div>');
  else cards.push('<div class="card">Czeka na rzut: '+p.ch+'</div>')});
 let xmCount=0;
 items.forEach(o=>{const q=o.q,x=Rs[o.id];if(!x||x.eff<=0||!q.bon||q.bon.k!==3)return;if(q.bonR!==undefined&&q.bonR>=r)return;if(q.xm&&q.xm[r])return;
  xmCount++;
  if(mine(o.id))cards.push('<div class="card" style="border-color:#f2c230"><b>Dodatkowy ruch: '+q.ch+'</b> — wybierz pole obok. <button data-pick="xm:'+o.id+'">Wybierz pole</button></div>');
  else cards.push('<div class="card">Czeka na dodatkowy ruch: '+q.ch+'</div>')});
 const blocking=pend.length>0||alerts.length>0||rolls.length>0||xmCount>0;
 const rows=items.map(o=>{const x=Rs[o.id],q=o.q,pre=H?'Gracz '+(o.idx+1)+': ':'';
  if(!x)return '<div style="margin:8px 0;opacity:.5"><b>'+pre+(q.ch||'')+'</b> odpadł</div>';
  const bn=q.bon?'<br><span style="color:#f2c230">Bonus: '+bonName(q.bon.k)+(bonusUsable(q)?'':' (od następnej rundy)')+'</span>':'';
  return '<div style="margin:8px 0;display:flow-root"><img class="av" style="float:left;margin-right:8px;border-color:'+C[q.ch].col+'" src="'+IMG[q.ch]+'" alt=""><b>'+pre+(q.nick?'<span class="prnick">'+hfEsc(q.nick)+'</span> · ':'')+q.ch+(o.id===net.uid?' (Ty)':'')+'</b>'+teamTag(q)+' '+pips({hp:x.eff,ch:q.ch},tap(o),o.idx)+'<span style="margin-left:8px;color:#f2c230;font-weight:700">'+ptTotal(o,Rs)+' pkt</span><br>'+planTxt(q)+((Rs._ev||[]).some(e=>e.k==='cancel'&&e.id===o.id)?'<br><span style="color:#ffb74d">Faza III anulowana: przesunięty przez inną postać</span>':'')+'<br><span style="color:'+(x.log.length?'var(--hit)':'var(--mute)')+'">'+(x.log.length?x.log.join('; '):'bez obrażeń')+'</span>'+bn+'</div>'}).join('');
 const surv=items.filter(o=>Rs[o.id]&&Rs[o.id].eff>0),over=!(typeof H!=="undefined"&&H&&H.train)&&(isTeam()?new Set(surv.map(o=>o.q.tm)).size<=1:surv.length<=1);
 const html='<h2 style="font:400 22px Bangers,Impact,sans-serif;margin:0">Runda '+r+': wyniki</h2>'+cards.join('')+'<div class="card sum">'+rows+'</div>'+(over?scoreTable(items,Rs):'');
 return {Rs,over,pend:blocking,html}}

function revH(){const v=revCore(netItems(),o=>o.id===net.uid),me=v.Rs[net.uid];
 if(st.animating)return v.html;
 if((!me||me.eff<=0)&&ME.hpr[st.round+1]!==0){ME.hpr[st.round+1]=0;save()}
 if(v.over)return v.html+'<button class="go" data-a="newgame">Menu główne</button>';
 if(v.pend)return v.html+'<p>Czekamy na rozstrzygnięcia (rzut, refleks, ruch).</p>';
 return v.html+(me&&me.eff>0?'<button class="go" data-a="next">Następna runda</button>':'<p>Odpadłeś. Obserwuj pozostałych.</p>')}

function hRevH(){const v=revCore(curItems(),()=>true);
 if(st.animating)return v.html;
 if(v.over)return v.html+'<button class="go" data-a="newgame">Menu główne</button>';
 if(v.pend)return v.html+'<p>Czekamy na rozstrzygnięcia (rzut, refleks, ruch).</p>';
 return v.html+'<button class="go" data-a="hnextr">Następna runda</button>'}

function openWheel(id){
 const p=playerOf(id);if(!p||!mine(id))return;
 const names=['+1 HP','+1 DMG','Dodatkowy ruch','Tarcza','Wybór 1–4','Refleks'];
 const cols=['#3fa7d6','#f08a24','#6b8f3e','#9aa3ad','#f2c230','#8a4fc7'];
 const k=1+Math.floor(Math.random()*6),i=k-1;
 let seg='';
 for(let j=0;j<6;j++){const a0=(j*60-90)*Math.PI/180,a1=((j+1)*60-90)*Math.PI/180;
  const x0=150+140*Math.cos(a0),y0=150+140*Math.sin(a0),x1=150+140*Math.cos(a1),y1=150+140*Math.sin(a1);
  const am=(a0+a1)/2,tx=150+92*Math.cos(am),ty=150+92*Math.sin(am);
  seg+='<path d="M150,150 L'+x0.toFixed(1)+' '+y0.toFixed(1)+' A140,140 0 0,1 '+x1.toFixed(1)+' '+y1.toFixed(1)+' Z" fill="'+cols[j]+'" stroke="#111" stroke-width="3"/><text x="'+tx.toFixed(1)+'" y="'+ty.toFixed(1)+'" text-anchor="middle" dominant-baseline="middle" font-size="26" font-weight="700" fill="#111">'+(j+1)+'</text>'}
 const ov=document.createElement('div');ov.id='wheelOv';
 ov.style.cssText='position:fixed;inset:0;z-index:30;background:rgba(0,0,0,.88);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:12px;color:#eee;font-family:system-ui,sans-serif';
 ov.innerHTML='<div style="font:400 28px Bangers,Impact,sans-serif">Rzut: '+p.ch+'</div>'+
  '<div style="width:0;height:0;border-left:14px solid transparent;border-right:14px solid transparent;border-top:26px solid #fff;margin-bottom:-6px;position:relative;z-index:2"></div>'+
  '<svg id="wh" viewBox="0 0 300 300" style="width:270px;height:270px;transition:transform 3.2s cubic-bezier(.17,.67,.2,1);transform-origin:50% 50%;transform:rotate(0deg)">'+seg+'<circle cx="150" cy="150" r="14" fill="#111"/></svg>'+
  '<div id="wres" style="min-height:90px;text-align:center"></div>';
 document.body.appendChild(ov);
 setTimeout(()=>{const w=document.getElementById('wh');if(w)w.style.transform='rotate('+(360*6-(i*60+30))+'deg)'},60);
 setTimeout(()=>{const res=document.getElementById('wres');if(!res)return;
  let h='<div style="font-size:18px;margin-bottom:8px">Wynik: <b>'+k+'</b> — '+names[i]+'</div>';
  if(k===5)h+='<div class="row" style="justify-content:center;gap:6px;flex-wrap:wrap">'+[1,2,3,4].map(c=>'<button data-wc="'+c+'" style="min-height:44px;padding:8px 12px">'+c+' — '+names[c-1]+'</button>').join('')+'</div>';
  else h+='<button class="go" data-wok="'+k+'" style="min-height:44px;padding:8px 16px">Zastosuj</button>';
  res.innerHTML=h;
  res.querySelectorAll('[data-wok],[data-wc]').forEach(b=>b.addEventListener('click',()=>{const v=+(b.dataset.wok||b.dataset.wc);applyRoll(id,v);ov.remove();render()}))},3350)}


const _baseRender=render;
render=function(){_baseRender();injectExtras()};

function pickCell(k){
 const [q,r]=k.split(',').map(Number);const pk=st.pick;st.pick=null;if(!pk)return;
 const p=playerOf(pk.id);const pf=pickFrom(pk);
 if(!p||!mine(pk.id)||!pf||!IN(q,r)||!D.some(([a,b])=>pf[0]+a===q&&pf[1]+b===r))return;
 if(pk.kind==='dg'){p.dg=p.dg||{};p.dg[st.round]=[q,r];p.bon=null}
 else{p.xm=p.xm||{};p.xm[st.round]=[q,r];p.bon=null}
 saveP(p)}

document.addEventListener('click',function(e){
 if(!st.pick)return;
 const t=e.target.closest('[data-k]');if(!t)return;
 e.stopImmediatePropagation();pickCell(t.dataset.k);render()},true);

document.addEventListener('click',function(e){
 const t=e.target.closest('[data-roll],[data-pick],[data-stay],[data-bdtog]');if(!t||st.animating)return;
 const ds=t.dataset;
 if(ds.roll!==undefined){openWheel(ds.roll);return}
 if(ds.pick!==undefined){const parts=ds.pick.split(':');st.pick={kind:parts[0],id:parts[1]};render();return}
 if(ds.stay!==undefined){const p=playerOf(ds.stay);if(p&&mine(ds.stay)){p.dg=p.dg||{};p.dg[st.round]='stay';saveP(p)}render();return}
 if(ds.bdtog!==undefined){const pl=st.plan[st.ph];if(pl)pl.bd=!pl.bd;render();return}});

document.addEventListener('click',function(e){
 const t=e.target.closest('[data-a="next"],[data-a="hnextr"]');if(!t)return;
 st.pick=null;
 const items=curItems(),Rs=resolve(items);st._fin=Rs;st._finRound=st.round;st._finMode=H?'h':'n';let changed=false;
 items.forEach(o=>{const q=o.q,b=q.bon,x=Rs[o.id];if(!b||!mine(o.id)||!(q.bonR===undefined||q.bonR<st.round))return;
  if(b.k===4&&x&&x.shUsed){q.bon=null;changed=true}
  if(b.k===2&&x&&x.dmgbUsed){q.bon=null;changed=true}});
 if(changed)saveP(curP());},true);

render();

const CHA={"Żyleta": '', "Byku": '', "Wiatrak": '', "Długi": '', "Ciotka": ''};
const ART={"Żyleta": "@@asset:img/art_zyleta.webp@@", "Byku": "@@asset:img/art_byku.webp@@", "Wiatrak": "@@asset:img/art_wiatrak.webp@@", "Długi": "@@asset:img/art_dlugi.webp@@", "Ciotka": "@@asset:img/art_ciotka.webp@@"};
