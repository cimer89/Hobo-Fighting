/* ===================== Interfejs: ekrany i render ===================== */
/* --- z części: js/000-start.js --- */
function hStartsH(){return '<h2 style="font:400 26px Bangers,Impact,sans-serif;margin:8px 0">Pozycje startowe</h2>'+board(hTok(p=>p.posr[1]))+'<div class="card">'+H.p.map((p,i)=>'<div style="border-left:10px solid '+C[p.ch].col+';padding-left:6px;margin:4px 0">Gracz '+(i+1)+': '+p.ch+teamTag(p)+'</div>').join('')+'</div><button class="go" data-a="hplan">Zaczynamy planowanie</button>'}
function splashH(){return '<div class="spl" data-a="start"><img src="@@asset:img/src.jpg@@" alt="Hobo Fighting"><div class="press">Naciśnij żeby rozpocząć</div></div>'}
function render(){
 BOARD_SVG=null;if(st.scr==='splash'){app.className='full';app.innerHTML=splashH();stageSet(false);return}
 const c=C[st.ch];
 let h=(st.scr==='lobby'?'<h1>HOBO FIGHTING</h1>':'')+(net.code?'<p>Pokój: <b>'+net.code+'</b></p>':'')+(st.scr==='plan'?'<p>Runda '+st.round+(zoneR(st.round)<3?'. Czerwone pola to strefa: −1 HP na koniec rundy.':'')+'</p>':'')+(H&&(st.scr==='pick'||st.scr==='plan')?'<p><b>Gracz '+(H.cur+1)+'</b></p>':'');
 if(st.scr==='hsetup'){h+=hSetupH()}else if(st.scr==='hpass'){h+=hPassH()}else if(st.scr==='hstarts'){h+=hStartsH()}else if(st.scr==='hrev'){h+=hRevH()}else if(st.scr==='lobby'){h+=lobbyH()}else if(st.scr==='wait'){h+=waitH()}else if(st.scr==='rev'){h+=revH()}else if(st.scr==='pick'){
  const pk='pick:'+st.round+':'+(H?H.cur:'o'),cls=st.lastPanel!==pk?' pin':'';st.lastPanel=pk;
  h+='<div id="phpanel" class="pp'+cls+'"><p>Tajny wybór pola startowego. Kilku graczy może wybrać to samo pole.</p><div class="row">'+Object.keys(C).map(n=>'<button class="face'+(n===st.ch?' on':'')+'" style="--c:'+C[n].col+'" data-ch="'+n+'" '+(taken(n)?'disabled':'')+'><img src="'+IMG[n]+'" alt=""><span>'+n+'</span></button>').join('')+'</div>';
  h+='<div class="card" style="display:flex;gap:10px;align-items:center;border-color:'+c.col+'"><img class="av" style="width:64px;height:64px;border-color:'+c.col+'" src="'+IMG[st.ch]+'" alt=""><div><b>'+st.ch+'</b><p>'+c.txt+'</p></div></div>';
  const hl={};if(st.start)hl[K(...st.start)]={fill:c.col,t:st.ch[0]};
  h+='<p style="text-align:center">'+(st.start?'Start: pole '+st.start.join(', '):'Dotknij pola, na którym chcesz zacząć.')+'</p><button class="go" data-a="confirm" '+(st.start?'':'disabled')+'>Zatwierdź start</button></div>';
  h+=board(hl);
 }else{
  const ph=st.ph,pl=st.plan[ph],from=fromPos(ph),hl={},ROM=['I','II','III'];
  const faint=(p,x,i)=>attack(p,x.d,i).forEach(([q,r,v])=>{hl[K(q,r)]={fill:'color-mix(in srgb,var(--hit) 22%,transparent)',stroke:'var(--hit)',t:v}});
  if(st.done){
   const lb={};const add=(p,t)=>{const k=K(...p);lb[k]=(lb[k]?lb[k]+'/':'')+t};
   add(st.start,'◉');add(fromPos(1),'1');add(fromPos(2),'2');if(st.plan.length>2)add(fromPos(3),'3');
   st.plan.forEach((x,i)=>{if(x.t==='atk'&&x.d!==null)faint(fromPos(i),x,i)});
   Object.keys(lb).forEach(k=>{hl[k]=Object.assign({},hl[k],{fill:c.col,t:lb[k]})});
  }else{
   if(ph>=1&&st.plan[ph-1].t==='atk'&&st.plan[ph-1].d!==null)faint(from,st.plan[ph-1],ph-1);
   if(pl.t==='move'&&st.ch!=='Truchel'){
    D.forEach(([a,b])=>{const q=from[0]+a,r=from[1]+b;if(IN(q,r))hl[K(q,r)]={fill:'color-mix(in srgb,var(--ok) 35%,transparent)',stroke:'var(--ok)'}});if(st.ch==='Byku'&&!(TB()&&st.ph>0))cells.forEach(([q,r])=>{if(dist(q-from[0],r-from[1])===2)hl[K(q,r)]={fill:'color-mix(in srgb,#f08a24 35%,transparent)',stroke:'#f08a24',t:'1'}});
    if(pl.m)hl[K(...pl.m)]={fill:'color-mix(in srgb,var(--ok) 55%,transparent)',stroke:'var(--ink)',t:K(...pl.m)===K(...from)?'•':'→'};
   }else if(pl.t==='atk'&&st.ch!=='Pasterz'){
    if(pl.d!==null)attack(from,pl.d,ph).forEach(([q,r,v])=>{hl[K(q,r)]={fill:'color-mix(in srgb,var(--hit) 40%,transparent)',stroke:'var(--hit)',t:v}});
    else D.forEach(([a,b])=>{const q=from[0]+a,r=from[1]+b;if(IN(q,r))hl[K(q,r)]={stroke:'var(--hit)'}});
   }
   extraHL(hl,pl,from,ph);if(!pl.m||K(...pl.m)!==K(...from))hl[K(...from)]=Object.assign({},hl[K(...from)],{fill:c.col,t:st.ch[0]});
  }
  othersOverlay(hl);
  h+='<div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><span style="display:flex;gap:10px;align-items:center"><img class="av" style="border-color:'+c.col+'" src="'+IMG[st.ch]+'" alt=""><b style="font-size:18px">'+st.ch+'</b></span>'+pips({hp:myHp()},false)+'</div><p>'+c.txt+'</p></div>';
  if(!st.done){
   const pk=st.round+':'+ph+':'+(H?H.cur:'o')+':'+st.scr,cls=st.lastPanel!==pk?' pin':'';st.lastPanel=pk;
   h+='<div id="phpanel" class="pp'+cls+'"><h2 style="font:400 26px Bangers,Impact,sans-serif;margin:8px 0 0">Faza '+ROM[ph]+' z '+ROM[nPh(st.ch)-1]+'</h2>'+actBtns(pl,ph);
   const hint=!pl.t?'Wybierz, co robisz w tej fazie: ruch albo atak.':pl.t==='move'?(st.ch==='Byku'?(TB()&&st.ph>0?'Faza II: skok tylko o 1 pole lub zostań.':'Skok o 1–2 pola (dalszy skok: 1 DMG w miejscu lądowania) lub zostań.'):'Ruch o 1 pole lub zostań (dotknij własnego pola).'):(pl.d===null?(st.ch==='Byku'?(TB()?'Szarża na wprost przez całą planszę: dotknij sąsiedniego pola, by wybrać kierunek.':'Szarża na wprost do pierwszej postaci lub ściany: dotknij sąsiedniego pola, by wybrać kierunek.'):'Dotknij sąsiedniego pola, by wybrać kierunek ataku.'):(st.ch==='Byku'?'Szarża: '+DN[pl.d]+(TB()?' (1 DMG i odrzucenie o 1 pole).':' (3 DMG i odrzucenie o 1 pole).'):'Atak: '+DN[pl.d]+'. Liczby to obrażenia.'));
   const hint2=planHint(pl,ph);const ok=planOk(pl,ph);
   h+='<p style="text-align:center">'+(hint2||hint)+'</p><button class="go" data-a="ok" '+(ok?'':'disabled')+'>'+'Zatwierdź fazę '+ROM[ph]+'</button>';
   if(ph>=1)h+='<div class="row" style="justify-content:center"><button data-a="prev">← Wróć do fazy '+ROM[ph-1]+'</button></div>';
   else if(!net.db&&!H)h+='<div class="row" style="justify-content:center"><button data-a="back">← Wybór startu</button></div>';
   h+='</div>';
   h+=board(hl);
  }else{
   h+=board(hl);
   const line=i=>{const x=st.plan[i];return '<li><b>Faza '+ROM[i]+':</b> '+(x.t==='move'?(K(...x.m)===K(...fromPos(i))?'zostaje na polu':'ruch → '+x.m.join(', ')):'atak '+DN[x.d])+'</li>'};
    const sumTxt=st.plan.map((x,i)=>'Faza '+ROM[i]+': '+actTxt(st.ch,x,fromPos(i),i)).join(' · ');
    h+='<div class="card" style="font-size:14px">'+sumTxt+'<br><b>'+waitTxt()+'</b></div><div class="row" style="flex-wrap:nowrap"><button style="flex:1" data-a="edit">Zmień plan</button>'+(H?'<button class="go" style="flex:2" data-a="hnext">'+(lastActor()?'Podsumowanie':'Ukryj plan i przekaż telefon')+'</button>':'')+'</div>';
  }
 }
 const isGame=st.scr!=='lobby';
  if(isGame){if(!BOARD_SVG)board({});}
  app.className=isGame?'':'full';
  app.innerHTML=h;stageSet(isGame);
}
/* --- z części: BONUSY POSTACI --- */
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
/* --- z części: STYL: postacie, metal i skóra, wybór startu --- */
function styleScreens(){
 if(st.scr==='splash'){app.innerHTML=app.innerHTML.replace('<div class="press">Naciśnij żeby rozpocząć</div>','<button class="press" data-a="start">Naciśnij żeby rozpocząć</button>');return}
 if(st.scr==='pick'){app.innerHTML=st.chOk?startPanelH():charPickH()}}
/* --- z części: V2: post-render, chipy, animacja z kamerą --- */
function v2post(){
 try{
  app.dataset.s=st.scr;
  const bg=document.getElementById('bgfx');if(bg)bg.style.opacity=(st.scr==='lobby')?'1':'0';
  if(st.scr==='splash'||st.scr==='lobby'||!app.children)return;
  [...app.children].forEach(el=>{if(el.tagName==='P'&&/^(Runda \d+|Gracz \d+)(\. .*)?$/.test((el.textContent||'').trim()))el.remove()});
  const h2=[...app.querySelectorAll('h2')].find(x=>/^Faza (I{1,3}) z (I{1,3})$/.test((x.textContent||'').trim()));
  if(h2){const m=h2.textContent.trim().match(/^Faza (I{1,3}) z (I{1,3})$/);h2.outerHTML=stepperHtml(m[1],m[2])}
 }catch(e){}}
/* --- z części: OKNA WYSKAKUJĄCE NA ŚRODKU EKRANU --- */
function hasPendPush(){try{return (resolve(curItems())._pend||[]).some(p=>mine(p.by))}catch(e){return false}}
function modalize(){
 try{
  const old=document.getElementById('resModal'),oldBar=document.getElementById('modalBar');
  const sc=old&&old.querySelector('.mscroll'),top=sc?sc.scrollTop:0;
  if(old)old.remove();if(oldBar)oldBar.remove();
  const eligible=['rev','hrev','hstarts','hpass','wait'].includes(st.scr)&&!st.animating;
  if(!eligible){app.style.display='';return}
  const key=st.scr+':'+st.round+':'+(H?H.cur:'o');
  if(st._mkey!==key){st._mkey=key;st.modalMin=false;st.mapMode=false}
  if(!hasPendPush())st.mapMode=false;
  const needMap=!!st.pick||!!st.mapMode;
  if(needMap||st.modalMin){
   app.style.display='none';
   const bar=document.createElement('div');bar.id='modalBar';
   bar.innerHTML=needMap?'<span>Dotknij zielonego pola na mapie</span><button data-a="mback">Wróć</button>':'<button class="go" data-a="mshow">Pokaż wyniki</button>';
   document.body.appendChild(bar);return}
  const nodes=[...app.children];if(!nodes.length){app.style.display='';return}
  let k=nodes.length;while(k>0&&(nodes[k-1].tagName==='BUTTON'||nodes[k-1].tagName==='P'))k--;
  const body=nodes.slice(0,k),foot=nodes.slice(k);
  const m=document.createElement('div');m.id='resModal';
  const box=document.createElement('div');box.className='mbox';
  if(['rev','hrev','hstarts'].includes(st.scr)){const t=document.createElement('div');t.className='mtop';t.innerHTML='<button data-a="mmin">Pokaż mapę</button>';box.appendChild(t)}
  const s=document.createElement('div');s.className='mscroll';body.forEach(n=>s.appendChild(n));box.appendChild(s);
  const f=document.createElement('div');f.className='mfoot';foot.forEach(n=>f.appendChild(n));box.appendChild(f);
  m.appendChild(box);document.body.appendChild(m);app.style.display='none';
  if(top)s.scrollTop=top;
 }catch(e){}}
/* --- z części: TRYBY WALKI: FREE FOR ALL / 2 VS 2 --- */
function teamTag(q){return isTeam()&&q&&q.tm?'<span class="tmtag" style="background:'+TCOL[q.tm]+'">'+q.tm+'</span>':''}
/* --- menu --- */
function lobbyH(){
 const ban='<img src="'+BAN+'" alt="Postacie Hobo Fighting" style="width:100%;max-height:20vh;object-fit:cover;border:2px solid var(--ink);border-radius:12px;display:block;margin:0;flex:none">';
 const codeRow=net.db?'<div class="row"><input id="code" maxlength="4" placeholder="KOD" aria-label="Kod pokoju" style="flex:1;min-height:46px;font:700 20px system-ui;text-transform:uppercase;text-align:center;border:2px solid var(--ink);border-radius:10px;background:var(--panel);color:var(--ink)"><button data-a="joinb">Dołącz kodem</button></div>':'';
 const gmName=st.gm==='special'?'Tryb specjalny':st.gm==='test'?'Testy (nowy balans)':'Tryb klasyczny';
 if(!st.gm)return ban+'<p>Wybierz tryb gry.</p>'
  +'<button class="mbtn" data-mode="classic"><b>Tryb klasyczny</b><small>Czysta walka, bez bonusów i przedmiotów.</small></button>'
  +'<button class="mbtn" data-mode="special"><b>Tryb specjalny</b><small>Zamiast losowania zbierasz przedmioty rozrzucone po mapie.</small></button>'
  +'<button class="mbtn tbmode" data-mode="test"><b>Testy</b><small>Jak tryb klasyczny (bez bonusów), ale z nowym balansem postaci: inne HP, obrażenia i zasięgi.</small></button>'+codeRow;
 if(!st.tm2)return ban+'<div class="chips"><span class="bn">'+gmName+'</span></div><p>Wybierz rodzaj walki.</p>'
  +'<button class="mbtn" data-tm="ffa"><b>Free for all</b><small>Każdy na każdego, 2–5 graczy. Wygrywa ostatni na polu.</small></button>'
  +'<button class="mbtn" data-tm="2v2"><b>2 vs 2</b><small>Dwie drużyny po dwóch graczy. Ataki nie ranią sojusznika. Wygrywa ostatnia drużyna.</small></button>'
  +'<button data-a="modeback">← Zmień tryb</button>';
 return ban+'<div class="chips"><span class="bn">'+gmName+'</span><span class="bn">'+(isTeam()?'2 vs 2':'Free for all')+'</span></div><p>Jak gracie?</p>'
  +'<button data-a="hot">Jeden telefon, przekazujemy sobie</button>'
  +(net.db?'<button class="go" data-a="create">Utwórz pokój online</button>':'<div class="card">Łączenie online… Jeśli to nie zniknie, sprawdź internet i odśwież stronę.</div>')
  +'<button data-a="modeback">← Zmień rodzaj walki</button>'}
function hSetupH(){const ns=isTeam()?[4]:[2,3,4,5];return '<p>'+(isTeam()?'2 vs 2 gra czterech graczy na tym telefonie.':'Ilu graczy gra na tym telefonie?')+'</p><div class="row">'+ns.map(n=>'<button data-n="'+n+'" style="flex:1">'+(isTeam()?'Zaczynamy (4 graczy)':n)+'</button>').join('')+'</div><p>Telefon będzie krążył: każdy wybiera i planuje po kolei, a plany ujawnicie razem.'+(isTeam()?' Każdy gracz wybiera też drużynę.':'')+'</p>'}
function charPickH(){
 const key='chpick:'+(H?H.cur:'o'),cls=st.lastPanel!==key?' pin':'';st.lastPanel=key;
 if(isTeam()&&!st.team)st.team=teamCount('A')<=teamCount('B')?'A':'B';
 const teamOk=!isTeam()||(st.team&&teamCount(st.team)<2);
 const ok=!!st.ch&&!taken(st.ch)&&teamOk;
 let h='<div id="phpanel" class="pp'+cls+'">';
 if(H)h+='<p>Gracz '+(H.cur+1)+': wybierz postać'+(isTeam()?' i drużynę':'')+'</p>';
 if(isTeam())h+='<div class="row tmrow">'+['A','B'].map(t=>{const n=teamCount(t),full=n>=2;return '<button data-team="'+t+'" class="'+(st.team===t?'on':'')+'" style="flex:1;min-height:38px" '+(full?'disabled':'')+'><span style="color:'+TCOL[t]+';font-size:18px">●</span> '+TNAME[t]+' ('+n+'/2)</button>'}).join('')+'</div>';
 h+='<div class="chrow">';
 Object.keys(C).forEach(n=>{h+='<button class="chcard'+(n===st.ch?' on':'')+'" data-ch="'+n+'" '+(taken(n)?'disabled':'')+' style="--c:'+C[n].col+'"><img src="'+CHA[n]+'" alt="'+n+'"></button>'});
 h+='</div>';
 if(st.ch)h+='<div class="card chinfo" style="border-color:'+C[st.ch].col+'"><img class="art" src="'+ART[st.ch]+'" alt="'+st.ch+'"><div><b>'+st.ch+'</b><p>'+C[st.ch].txt+'</p></div></div>';
 else h+='<div class="card"><p>Dotknij postaci.</p></div>';
 h+='<button class="go" data-a="chok" '+(ok?'':'disabled')+'>Dalej: miejsce startu</button></div>';
 return h}
function scoreRows(items,Rs){
 const surv=items.filter(o=>Rs[o.id]&&Rs[o.id].eff>0),sole=surv.length===1?surv[0]:null,wt=isTeam()?winTeam(items,Rs):null;
 return items.filter(o=>o.q.ch).map(o=>{const p=ptsOf(o,Rs),alive=Rs[o.id]&&Rs[o.id].eff>0;
  const last=isTeam()?((wt&&o.q.tm===wt&&alive)?5:0):((sole&&sole.id===o.id)?5:0);
  return {o,d:p.d,m:p.m,it:p.it,last,total:p.d+p.m+p.it+last}}).sort((a,b)=>b.total-a.total)}
function scoreTable(items,Rs){
 const rows=scoreRows(items,Rs);if(!rows.length)return '';
 const top=rows[0].total;let h='';
 if(isTeam()){const tt={A:0,B:0};rows.forEach(r=>{if(r.o.q.tm)tt[r.o.q.tm]+=r.total});
  const wt=winTeam(items,Rs)||(tt.A===tt.B?null:(tt.A>tt.B?'A':'B'));
  h+='<div class="card" style="border-color:'+(wt?TCOL[wt]:'#f2c230')+'"><b>Koniec gry!</b> '+(wt?'Wygrywa <span style="color:'+TCOL[wt]+'">'+TNAME[wt]+'</span>.':'Remis drużyn.')+'<br>'+TNAME.A+': <b>'+tt.A+' pkt</b> · '+TNAME.B+': <b>'+tt.B+' pkt</b></div>'}
 else{const wins=rows.filter(r=>r.total===top).map(r=>r.o.q.nick?hfEsc(r.o.q.nick)+' ('+r.o.q.ch+')':r.o.q.ch);h+='<div class="card" style="border-color:#f2c230"><b>Koniec gry!</b> Najwięcej punktów: '+wins.join(', ')+' ('+top+' pkt).</div>'}
 h+='<div class="card"><table class="sc"><tr><th></th><th>Obr.</th><th>Wiel.</th><th>Przedm.</th><th>Ostatni</th><th>Razem</th></tr>';
 rows.forEach(r=>{h+='<tr'+(r.total===top?' class="top"':'')+'><td><img class="av" style="width:22px;height:22px;border-width:2px;border-color:'+C[r.o.q.ch].col+'" src="'+IMG[r.o.q.ch]+'" alt=""> '+(r.o.q.nick?'<span class="prnick">'+hfEsc(r.o.q.nick)+'</span> · ':'')+r.o.q.ch+teamTag(r.o.q)+'</td><td>'+r.d+'</td><td>'+r.m+'</td><td>'+r.it+'</td><td>'+r.last+'</td><td class="tot">'+r.total+'</td></tr>'});
 return h+'</table><p>1 pkt za 1 obrażenie, +1 za każdego dodatkowego trafionego przeciwnika jednym atakiem, 1 pkt za przedmiot, 5 pkt dla '+(isTeam()?'każdego żywego gracza zwycięskiej drużyny':'ostatniego na polu')+'.</p></div>'}
/* --- z części: EKRAN WYBORU POSTACI (styl bijatyki) + VS --- */
function selPickerH(){
 const ch=st.ch||Object.keys(C)[0],c=C[ch],r=ROLE[ch]||['',[1,1,1]],pn=H?H.cur+1:1;
 if(isTeam()&&!st.team)st.team=teamCount('A')<=teamCount('B')?'A':'B';
 const teamOk=!isTeam()||(st.team&&teamCount(st.team)<2),ok=!!st.ch&&!taken(st.ch)&&teamOk;
 const fresh=st._selLast!==ch;st._selLast=ch;
 const tc=isTeam()&&st.team?TCOL[st.team]:'';
 const bgi=(typeof BGART!=='undefined')&&BGART[ch];let h='<div class="selbg'+(bgi?' img'+(fresh?' enter':''):'')+'"'+(bgi?' style="background-image:linear-gradient(180deg,rgba(5,6,9,.55),transparent 18%,transparent 42%,rgba(5,6,9,.88) 80%),url('+bgi+');background-position:'+((typeof BGPOS!=='undefined'&&BGPOS[ch])||'42% 18%')+'"':'')+'></div><div class="seltop"><span class="selp" style="--pc:'+(tc||'#f2c230')+'">GRACZ '+pn+'</span><span class="seltitle">WYBIERZ POSTAĆ</span></div>';
 if(isTeam())h+='<div class="selteam">'+['A','B'].map(t=>{const n=teamCount(t);return '<button data-team="'+t+'" class="'+(st.team===t?'on':'')+'" style="--tc:'+TCOL[t]+'" '+(n>=2?'disabled':'')+'>● '+TNAME[t]+' ('+n+'/2)</button>'}).join('')+'</div>';
 const bars=['Siła','Zasięg','Ruch'].map((l,i)=>'<div class="stat">'+l+'<b>'+[1,2,3,4,5].map(k=>'<i class="'+(k<=r[1][i]?'f':'')+'"></i>').join('')+'</b></div>').join('');
 h+='<div class="selhero"><img class="selart'+((ch==='Ciotka'||ch==='Długi')?' wide':'')+(fresh?' enter':'')+'" src="'+ART[ch]+'" alt="'+ch+'"><div class="selinfo'+(fresh?' enter':'')+'"><span class="selrole">'+r[0]+'</span><div class="selname'+(ch.length>9?' long':'')+'">'+ch.toUpperCase()+'</div>'+bars+'<p class="seldesc">'+c.txt+'</p></div></div>';
 h+='<div class="selgrid">'+Object.keys(C).map(n=>{const tk=taken(n);return '<button class="seltile'+(n===st.ch?' on':'')+(tk?' taken':'')+'" data-ch="'+n+'" data-p="'+pn+'" style="--c:'+C[n].col+(tc?';--tc:'+tc:'')+'" '+(tk?'disabled':'')+'><img src="'+IMG[n]+'" alt=""><span>'+SHORT(n)+'</span>'+(tk?'<em>ZAJĘTA</em>':'')+'</button>'}).join('')+'</div>';
 h+='<button class="selgo" data-a="chok" '+(ok?'':'disabled')+'>WYBIERAM</button>';
 return {h,col:c.col}}
function hPassH(){const p=H.p[H.cur];const what=H.tgt==='pick'?'Wybierze postać.':H.tgt==='place'?'Ustawi się w tajemnicy na planszy.':'Zaplanuje rundę '+st.round+'.';
 return '<div class="card" style="text-align:center"><p>Przekaż telefon</p><b style="font:400 36px Bangers,Impact,sans-serif">Gracz '+(H.cur+1)+(p.ch?' ('+p.ch+')':'')+'</b><p>'+what+' Reszta niech nie patrzy.</p></div><button class="go" data-a="hgo">Jestem gotowy</button>'}
function fitSelBg(){
 const ov=document.getElementById('selOv');if(!ov||!ov.classList.contains('full'))return;
 const bg=ov.querySelector('.selbg.img'),F=FACEPT[st.ch];if(!bg||!F)return;
 const iw=941,ih=1672,R=ov.getBoundingClientRect(),W=R.width,Hh=R.height;
 const topEl=ov.querySelector('.selteam')||ov.querySelector('.seltop'),info=ov.querySelector('.selinfo');
 const top=topEl.getBoundingClientRect().bottom-R.top,bot=info.getBoundingClientRect().top-R.top+14;
 const ty=top+(bot-top)*0.46,tx=W/2;
 let s=Math.max(W/iw,Hh/ih);
 if(F[1]*s<top+45)s=Math.max(s,(top+45)/F[1]);
 let oy=Math.min(0,Math.max(Hh-ih*s,ty-F[1]*s));
 if(oy+F[1]*s>bot-40){s=Math.max(W/iw,(bot-40)/F[1]);oy=0}
 const ox=Math.min(0,Math.max(W-iw*s,tx-F[0]*s));
 bg.style.backgroundSize='100% 100%,'+(iw*s).toFixed(1)+'px '+(ih*s).toFixed(1)+'px';
 bg.style.backgroundPosition='0 0,'+ox.toFixed(1)+'px '+oy.toFixed(1)+'px';
 bg.style.inset='0';st._face=[ox+F[0]*s,oy+F[1]*s,top,bot]}
/* --- z części: NOWY INTERFEJS: górny pasek, panel planowania --- */
function injectExtras(){
 ['bonBar','legBar'].forEach(id=>{const e=document.getElementById(id);if(e)e.remove()});
 if(!app||st.scr==='lobby'||st.scr==='splash'||st.scr==='hsetup')return;
 const p=curP();if(!p)return;
 const pl=st.plan&&st.plan[st.ph];let n=0;try{n=boardItems().length}catch(e){}
 const pn=H?'GRACZ '+(H.cur+1):(p.ch?p.ch.toUpperCase():'');
 let h='<div class="sign"><b>RUNDA '+st.round+'</b><small>'+pn+'</small></div>';
 if(isTeam()){const t=p.tm||st.team;if(t)h+='<div class="tb"><small>DRUŻYNA</small><b style="color:'+TCOL[t]+'">'+t+'</b></div>'}
 if(isSp())h+='<div class="tb"><small>BONUS</small><b>'+(p.bon?bonName(p.bon.k)+(bonusUsable(p)?'':'*'):'BRAK')+'</b></div>';
 if(isSp())h+='<div class="tb"><small>PRZEDMIOTY</small><b>'+n+'</b></div>';
 if(zoneR(st.round)<3)h+='<div class="tb zn"><small>STREFA</small><b>−1 HP</b></div>';
 if(isSp())h+='<button data-leg="1">?</button>';
 if(false)h+='<button data-bdtog="1" class="'+(pl.bd?'on':'')+'">+1 DMG: '+(pl.bd?'TAK':'NIE')+'</button>';
 const bar=document.createElement('div');bar.id='bonBar';bar.className='topbar';bar.innerHTML=h;document.body.appendChild(bar);
 if(isSp()&&st.legend){const l=document.createElement('div');l.id='legBar';l.className='legend';l.innerHTML=ITYPES.map(t=>'<span><svg viewBox="-28 -28 56 56"><circle r="26" fill="'+ITEM[t].c+'" stroke="#fff" stroke-width="3"/>'+glyph(t)+'</svg>'+ITEM[t].n+'</span>').join('');document.body.appendChild(l)}}
function hudify(){
 if(st.scr!=='plan'||st.done||st.animating)return;
 const pp=document.getElementById('phpanel');if(!pp||pp.querySelector('.hud'))return;
 const card=[...app.children].find(e=>e.classList&&e.classList.contains('card'));
 const step=pp.querySelector('.stepper'),hint=[...pp.children].find(e=>e.tagName==='P');
 const hud=document.createElement('div');hud.className='hud';
 if(card)hud.appendChild(card);if(step){const lab=step.querySelector('b');const box=document.createElement('span');[...step.querySelectorAll('i')].forEach(i=>box.appendChild(i));step.innerHTML='';step.appendChild(document.createTextNode('FAZA'));step.appendChild(box)}
 if(step)hud.appendChild(step);if(hint){hint.classList.add('note');hud.appendChild(hint)}
 pp.insertBefore(hud,pp.firstChild);
 const ok=pp.querySelector('[data-a="ok"]'),prv=pp.querySelector('[data-a="prev"],[data-a="back"]');
 if(ok){const row=document.createElement('div');row.className='okrow';const prow=prv&&prv.parentElement;if(prv){prv.textContent='← '+(prv.dataset.a==='prev'?'Wróć':'Start');row.appendChild(prv)}pp.insertBefore(row,ok);row.appendChild(ok);if(prow&&prow!==pp&&!prow.children.length)prow.remove()}
 const ps=H?H.p.map((q,i)=>({q,cur:i===H.cur})):Object.entries(net.pl||{}).map(([id,q])=>({q,cur:id===net.uid}));
 if(ps.length){const r=document.createElement('div');r.className='plrow';
  r.innerHTML=ps.map(o=>o.q.ch?'<img class="'+(o.cur?'cur':'')+(alive(o.q,st.round)?'':' dead')+'" src="'+IMG[o.q.ch]+'" alt="'+o.q.ch+'" title="'+o.q.ch+'" style="border-color:'+(o.cur?'':(isTeam()&&o.q.tm?TCOL[o.q.tm]:C[o.q.ch].col))+'">':'<span class="ph"></span>').join('');
  pp.appendChild(r)}}
/* --- z części: online: najpierw wszyscy wybierają, potem VS, potem rozstawienie --- */
function vsH(){
 let ps;if(H)ps=H.p.map((q,i)=>({q,i}));else ps=netPlayers().map((o,i)=>({q:o.q,i,me:o.id===net.uid}));
 let L,Rr;if(isTeam()){L=ps.filter(o=>o.q.tm==='A');Rr=ps.filter(o=>o.q.tm==='B')}else{const k=Math.ceil(ps.length/2);L=ps.slice(0,k);Rr=ps.slice(k)}
 const fx=(o,j)=>{const tc=isTeam()&&o.q.tm?TCOL[o.q.tm]:'',bg=(typeof BGART!=='undefined')&&BGART[o.q.ch];return '<div class="fx" style="--c:'+C[o.q.ch].col+(tc?';--tc:'+tc:'')+';animation-delay:'+(j*.12)+'s">'+(bg?'<img class="cov" style="object-position:'+((typeof BGPOS!=='undefined'&&BGPOS[o.q.ch])||'42% 22%')+'" src="'+bg+'" alt="">':'<img src="'+ART[o.q.ch]+'" alt="">')+'<span class="pl">'+(o.me?'TY':'GRACZ '+(o.i+1))+(isTeam()?' · '+o.q.tm:'')+'</span><div class="nm">'+o.q.ch.toUpperCase()+'</div></div>'};
 return '<div class="selbg" style="--c:#ff7a00"></div><div class="seltop"><span class="seltitle">'+(isTeam()?'DRUŻYNA A KONTRA DRUŻYNA B':'WSZYSCY NA WSZYSTKICH')+'</span></div><div class="vsrow"><div class="side left">'+L.map(fx).join('')+'</div><div class="side right">'+Rr.map(fx).join('')+'</div><div class="vsmark">VS</div><div class="flash"></div></div><button class="selgo" data-a="vsgo">ROZSTAWIENIE</button>'}
function selectOverlay(){
 let ov=document.getElementById('selOv');
 const online=!H&&!!net.db;
 const cw=online&&st.scr==='pick'&&st.cwait;
 const pick=st.scr==='pick'&&!st.chOk&&!cw;
 const vs=(!!H&&st.scr==='hpass'&&H.tgt==='vs')||(cw&&allPicked());
 if(!pick&&!vs&&!cw){if(ov)ov.remove();if(st._selHid){app.style.display='';st._selHid=false}return}
 ['resModal','modalBar'].forEach(id=>{const e=document.getElementById(id);if(e)e.remove()});
 if(!ov){ov=document.createElement('div');ov.id='selOv';document.body.appendChild(ov)}
 if(vs){if(ov.className!=='vs'||!ov.querySelector('.vsrow')){ov.className='vs';ov.style.setProperty('--c','#ff7a00');ov.innerHTML=vsH()}}
 else if(cw){ov.className='';ov.style.setProperty('--c','#3e8ef7');ov.innerHTML=cwaitH()}
 else{const r=selPickerH();ov.className=(typeof BGART!=='undefined'&&BGART[st.ch])?'full':'';ov.style.setProperty('--c',r.col);ov.innerHTML=r.h}
 app.style.display='none';st._selHid=true}
function startPanelH(){
 const c=C[st.ch],ok=!!st.start;
 return '<div class="pp" id="phpanel"><div class="card" style="display:flex;gap:8px;align-items:center;border-color:'+c.col+'"><img class="av" style="border-color:'+c.col+'" src="'+IMG[st.ch]+'" alt=""><div><b>'+st.ch+teamTag({tm:st.team})+'</b><p>'+(ok?'Start: pole '+st.start.join(', '):'Dotknij pola na mapie, żeby wybrać start (w tajemnicy).')+'</p></div></div>'
  +((H||net.db)?'':'<div class="row"><button data-a="chback">← Zmień postać</button></div>')
  +'<button class="go" data-a="confirm" '+(ok?'':'disabled')+'>Zatwierdź start</button></div>'}
/* --- z części: BYKU v3 (Testy) + POWRÓT DO MENU --- */
/* --- powrót do menu bez przeładowania strony --- */
function goMenu(){
 try{dmStop()}catch(e){}
 try{if(net.unsub)net.unsub()}catch(e){}
 ['resModal','modalBar','selOv','demoOv','bonBar','legBar','sndPanel','wheelOv'].forEach(id=>{const e=document.getElementById(id);if(e)e.remove()});
 document.querySelectorAll('.wheel,.wov,#wheel').forEach(e=>e.remove());
 H=null;net.code=null;net.pl={};net.unsub=null;
 Object.keys(ME).forEach(k=>delete ME[k]);Object.assign(ME,{ch:null,start:null,sready:false,plans:{},posr:{},hp:5,hpr:{1:5},hpo:{}});
 const keep={_started:true};Object.keys(st).forEach(k=>delete st[k]);
 Object.assign(st,{scr:'lobby',lastPanel:null,leaving:false,round:1,ch:'Wiatrak',start:null,slot:0,ph:0,mode:'move',plan:[{m:null,d:null},{m:null,d:null}],done:false},keep);
 app.style.display='';st._selHid=false;BOARD_SVG=null;
 window.scrollTo(0,0);render()}
