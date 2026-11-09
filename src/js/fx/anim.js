/* ===================== Animacje rundy ===================== */
/* --- z części: js/000-start.js --- */
function initAnimPos(items){st.curPos={};st.logPos={};items.forEach(o=>{const c=o.q.posr&&o.q.posr[st.round];if(c){st.logPos[o.id]=c.slice();st.curPos[o.id]=GEO[c[0]+','+c[1]].c}})}
function capSet(t){st.capText=t;const el=document.getElementById('cap');if(el)el.textContent=t}
function ovSet(h){const el=document.getElementById('ov');if(el)el.innerHTML=h}
function nmOf(id){const o=(st.animItems||[]).find(o=>o.id===id);return o?o.q.ch:id}
function popSet(t,sub){const el=document.getElementById('pop');if(!el)return;el.innerHTML='<b>'+t+'</b>'+(sub?'<small>'+sub+'</small>':'');el.classList.remove('show');void el.offsetWidth;el.classList.add('show')}
function popHide(){const el=document.getElementById('pop');if(el)el.classList.remove('show')}
function shakeTok(id){const el=document.querySelector('#tk-'+id+' .in');if(el){el.classList.remove('shk');void el.getBoundingClientRect();el.classList.add('shk')}}
function stageSet(on){
  const sg=document.getElementById('stage');if(!sg)return;
  const front=st.animating||st.scr==='rev'||st.scr==='hrev';
  const was=sg.dataset.on==='1';sg.dataset.on=on?'1':'0';
  sg.className=(on?'':'hide ')+(front?'front':'dim')+(on&&!was?' enter':'');
  const html=on&&BOARD_SVG?BOARD_SVG:'';
  if(html!==LAST_BOARD){sg.innerHTML=html;LAST_BOARD=html}
}
/* --- z części: V2: post-render, chipy, animacja z kamerą --- */
function burst(x,y,col,n){const ov=document.getElementById('ov');if(!ov)return;n=n||9;for(let i=0;i<n;i++){const c=document.createElementNS(NS2,'circle');c.setAttribute('r',5+Math.random()*7);c.setAttribute('fill',i%2?col:'#fff');ov.appendChild(c);const a=Math.PI*2*i/n+Math.random()*.6,d=48+Math.random()*52;c.animate([{transform:'translate('+x+'px,'+y+'px) scale(1)',opacity:1},{transform:'translate('+(x+Math.cos(a)*d)+'px,'+(y+Math.sin(a)*d)+'px) scale(.2)',opacity:0}],{duration:540,easing:'cubic-bezier(.1,.7,.3,1)',fill:'forwards'})}}
function shakeStage(m){const s=document.getElementById('stage');if(!s)return;m=m||7;s.animate([{transform:'translate(0,0)'},{transform:'translate('+(-m)+'px,'+(m/2)+'px)'},{transform:'translate('+m+'px,'+(-m/2)+'px)'},{transform:'translate('+(-m/2)+'px,0)'},{transform:'translate(0,0)'}],{duration:340})}
function hpSet(id,hp){const f=document.getElementById('hpf-'+id);if(!f)return;f.style.transform='scaleX('+Math.max(0,hp)/MAXHP(chOfId(id))+')';f.style.fill=hp>2?'#4fc183':hp>1?'#f0a020':'#e0342b'}
function phaseBanner(t){const d=document.createElement('div');d.className='phb';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1300)}
function ovAdd(h){const ov=document.getElementById('ov');if(ov)ov.insertAdjacentHTML('beforeend',h)}
async function runAnim(){
 const ev=st.animEv||[],seenTrig={};
 try{
  await wait(350);
  for(let i=0;i<ev.length;i++){
   const e=ev[i];try{S2D.ev(e)}catch(_){}try{PFX.ev(e)}catch(_){}if(st.skipReq)break;ovSet('');
   if(e.k==='phase'){cam(null,1);phaseBanner(['FAZA I','FAZA II','FAZA III'][e.ph]);capSet(['Faza I','Faza II','Faza III'][e.ph]);await wait(1100)}
   else if(e.k==='move'&&e.tele){
    const t=document.getElementById('tk-'+e.id),a=cellC(e.from),c=cellC(e.to);capSet(nmOf(e.id)+' teleportuje się');burst(a[0],a[1]-30,'#b36cff',10);
    if(t)t.animate([{opacity:1},{opacity:0}],{duration:260,fill:'forwards'});await wait(280);
    tokMove(e.id,c[0],c[1]);st.logPos[e.id]=e.to.slice();burst(c[0],c[1]-30,'#b36cff',10);
    if(t)t.animate([{opacity:0},{opacity:1}],{duration:260,fill:'forwards'});await wait(360)}
   else if(e.k==='move'){
    const b=[e];while(ev[i+1]&&ev[i+1].k==='move'&&ev[i+1].ph===e.ph&&!!ev[i+1].dodge===!!e.dodge)b.push(ev[++i]);b.slice(1).forEach(x=>{try{PFX.ev(x)}catch(_){}});
    capSet(b.length>1?'Ruchy':nmOf(e.id)+(e.dodge?' robi unik':(e.jump?' skacze':' rusza się')));cam(null,1);
    b.forEach(m=>{const a=cellC(m.from);burst(a[0],a[1]+22,'#c9b58a',5)});
    await tween(640,t=>{const k=EASE(t);b.forEach(m=>{const a=cellC(m.from),c=cellC(m.to);tokMove(m.id,a[0]+(c[0]-a[0])*k,a[1]+(c[1]-a[1])*k);hopSet(m.id,Math.sin(Math.PI*k)*(m.far?1.9:1))})});b.forEach(m=>hopSet(m.id,0));
    b.forEach(m=>st.logPos[m.id]=m.to.slice());await wait(180)}
   else if(e.k==='atk'){
    const from=cellC(e.from),endc=e.end?cellC(e.end):from,mid=[(from[0]+endc[0])/2,(from[1]+endc[1])/2];
    cam(mid,1.3);capSet(nmOf(e.id)+(e.bd?' atakuje (+1 DMG)':' atakuje'));
    let h='';(e.cells||[]).forEach(c=>{const g=GEO[c[0]+','+c[1]];if(g)h+='<g transform="translate('+g.c[0]+','+g.c[1]+')"><polygon class="flash" points="'+g.p+'" fill="'+C[e.ch].col+'"/></g>'});
    ovSet(h);
    if(e.line&&e.end){const ov=document.getElementById('ov');if(ov){const ln=document.createElementNS(NS2,'line');['x1','y1','x2','y2'].forEach((k,j)=>ln.setAttribute(k,[from[0],from[1]-34,endc[0],endc[1]-34][j]));ln.setAttribute('stroke','#ffe066');ln.setAttribute('stroke-width','11');ln.setAttribute('stroke-linecap','round');ln.setAttribute('pathLength','1');ln.setAttribute('stroke-dasharray','1');ln.setAttribute('stroke-dashoffset','1');ov.appendChild(ln);ln.animate([{strokeDashoffset:1,opacity:1},{strokeDashoffset:0,opacity:1,offset:.55},{strokeDashoffset:0,opacity:0}],{duration:540,fill:'forwards',easing:'ease-out'})}}
    await wait(560);
    if(e.hit){burst(endc[0],endc[1]-34,C[e.ch].col,11);await wait(240)}
    else{ovAdd('<g transform="translate('+endc[0]+','+(endc[1]-18)+')"><text class="fl miss big">PUDŁO</text></g>');await wait(800)}}
   else if(e.k==='dmg'){
    const b=[e];while(ev[i+1]&&ev[i+1].k==='dmg'&&ev[i+1].ph===e.ph&&ev[i+1].w===e.w)b.push(ev[++i]);b.slice(1).forEach(x=>{try{PFX.ev(x)}catch(_){}});
    await wait(90);
    let h='';b.forEach(d=>{const p=st.curPos[d.id]||[0,0];h+='<g transform="translate('+p[0]+','+(p[1]-150)+')"><text class="fl big">−'+d.n+'</text></g>'});
    ovSet(h);shakeStage(9);
    b.forEach(d=>{shakeTok(d.id);const p=st.curPos[d.id]||[0,0];burst(p[0],p[1]-34,'#ff5a4f',9);st.animHp[d.id]=(st.animHp[d.id]||5)-d.n;hpSet(d.id,st.animHp[d.id])});
    capSet(b.map(d=>nmOf(d.id)+' −'+d.n).join(', ')+' ('+e.w+')');await wait(760)}
   else if(e.k==='charge'){
    const a=cellC(e.from),c=cellC(e.to);capSet(nmOf(e.id)+' szarżuje!');cam([(a[0]+c[0])/2,(a[1]+c[1])/2],1.25);
    ovAdd('<g><line x1="'+a[0]+'" y1="'+(a[1]-10)+'" x2="'+c[0]+'" y2="'+(c[1]-10)+'" stroke="#ff9a3c" stroke-width="14" stroke-linecap="round" stroke-dasharray="6 18" opacity=".8"/></g>');
    await tween(Math.max(520,260*Math.max(1,e.steps)),t=>{const k=EASE(t);tokMove(e.id,a[0]+(c[0]-a[0])*k,a[1]+(c[1]-a[1])*k);if(Math.random()<.25)burst(a[0]+(c[0]-a[0])*k,a[1]+(c[1]-a[1])*k+22,'#c9b58a',3)});
    st.logPos[e.id]=e.to.slice();
    if(e.hit){burst(c[0],c[1]-34,C.Byku.col,16);shakeStage(14);await wait(260)}
    else{ovAdd('<g transform="translate('+c[0]+','+(c[1]-70)+')"><text class="fl miss big">ŚCIANA</text></g>');shakeStage(8);await wait(800)}}
   else if(e.k==='knock'){
    const a=cellC(e.from),c=cellC(e.to);capSet(nmOf(e.id)+' odrzucony');
    await tween(420,t=>{const k=EASE(t);tokMove(e.id,a[0]+(c[0]-a[0])*k,a[1]+(c[1]-a[1])*k);hopSet(e.id,Math.sin(Math.PI*k)*.8)});hopSet(e.id,0);st.logPos[e.id]=e.to.slice();await wait(160)}
   else if(e.k==='cancel'){popSet('FAZA III ANULOWANA',nmOf(e.id)+' został przesunięty przez inną postać');await wait(1200);popHide()}
   else if(e.k==='summon'){const c=cellC(e.to);capSet(nmOf(e.id)+' przywołuje owcę');exAdd(sheepEl(e.id,c,true));burst(c[0],c[1]-20,'#ffffff',9);await wait(700)}
   else if(e.k==='sheepgone'){const s=document.getElementById('sh-'+e.id);if(s)s.remove();await wait(120)}
   else if(e.k==='smove'){const a=cellC(e.from),c=cellC(e.to);capSet(nmOf(e.id)+': ruch owcy');await tween(520,t=>{const k=EASE(t);shPos(e.id,a[0]+(c[0]-a[0])*k,a[1]+(c[1]-a[1])*k-Math.sin(Math.PI*k)*26)});shPos(e.id,c[0],c[1]);await wait(150)}
   else if(e.k==='scharge'){if(e.none){capSet('Brak owcy do szarży');await wait(300)}else{const a=cellC(e.from),c=cellC(e.to);capSet(nmOf(e.id)+': szarża owcy!');cam([(a[0]+c[0])/2,(a[1]+c[1])/2],1.2);await tween(Math.max(420,200*Math.max(1,e.steps)),t=>{const k=EASE(t);shPos(e.id,a[0]+(c[0]-a[0])*k,a[1]+(c[1]-a[1])*k)});shPos(e.id,c[0],c[1]);if(e.hit){burst(c[0],c[1]-30,'#ffffff',10);shakeStage(8)}if(e.back){await wait(220);capSet(nmOf(e.id)+': pudło, owca wraca');await tween(Math.max(380,150*Math.max(1,e.steps)),t=>{const k=EASE(t);shPos(e.id,c[0]+(a[0]-c[0])*k,c[1]+(a[1]-c[1])*k-Math.sin(Math.PI*k)*18)});shPos(e.id,a[0],a[1])}await wait(e.hit?250:400)}}
   else if(e.k==='sheephit'){const c=cellC(e.pos);burst(c[0],c[1]-20,'#ffffff',12);const s=document.getElementById('sh-'+e.id);if(s)s.remove();ovAdd('<g transform="translate('+c[0]+','+(c[1]-80)+')"><text class="fl big">OWCA!</text></g>');capSet('Owca '+nmOf(e.id)+' zginęła');await wait(850)}
   else if(e.k==='droneon'){const p=st.curPos[e.id]||[0,0];exAdd(droneEl(e.id,p));capSet(nmOf(e.id)+' składa drona'+(e.n?' ('+e.n+'/3)':''));burst(p[0],p[1]-80,'#cfd3da',8);await wait(650)}
   else if(e.k==='drone'){const d=document.getElementById('dr-'+e.id),p=st.curPos[e.id]||[0,0],to=cellC(e.to);capSet(nmOf(e.id)+' wysyła drona');cam(to,1.15);
    const sx=p[0],sy=p[1]-76,ex=to[0],ey=to[1]-60;
    await tween(750,t=>{const k=EASE(t);if(d)d.setAttribute('transform','translate('+(sx+(ex-sx)*k).toFixed(1)+','+(sy+(ey-sy)*k-Math.sin(Math.PI*k)*40).toFixed(1)+') scale('+depthScale(ey).toFixed(3)+')')});
    if(e.target){const tp=st.curPos[e.target]||to;await tween(380,t=>{const k=EASE(t);if(d)d.setAttribute('transform','translate('+(ex+(tp[0]-ex)*k).toFixed(1)+','+(ey+(tp[1]-60-ey)*k).toFixed(1)+') scale('+depthScale(tp[1]).toFixed(3)+')')});burst(tp[0],tp[1]-40,'#ff5a4f',12);shakeStage(8)}
    if(d)d.remove();await wait(e.target?300:500)}
   else if(e.k==='puddle'){if(e.none){await wait(150)}else{const c=cellC(e.to);capSet(nmOf(e.id)+' tworzy kałużę');exAdd('<g transform="translate('+c[0]+','+(c[1]+8)+')" style="pointer-events:none"><g class="newi">'+puddleSvg()+'</g></g>');burst(c[0],c[1],'#8fe03a',12);await wait(700)}}
   else if(e.k==='shield'){const p=st.curPos[e.id]||[0,0];burst(p[0],p[1]-34,'#7fd4ff',10);ovAdd('<g transform="translate('+p[0]+','+(p[1]-150)+')"><text class="fl big" style="fill:#7fd4ff">TARCZA</text></g>');capSet(nmOf(e.id)+': tarcza blokuje');await wait(800)}
   else if(e.k==='trig'&&!seenTrig[e.id]&&!isSp()){seenTrig[e.id]=1;const p=st.curPos[e.id]||[0,0];burst(p[0],p[1]-34,'#f6cf55',12);capSet(nmOf(e.id)+': rzut kością po rundzie!');await wait(520)}
   else if(e.k==='push'){
    popSet('DODATKOWA AKCJA!','Przesunięcie: '+nmOf(e.id)+' o 1 pole');await wait(1000);popHide();
    const a=cellC(e.from),c=cellC(e.to);capSet(nmOf(e.id)+' przesunięty');
    await tween(560,t=>{const k=EASE(t);tokMove(e.id,a[0]+(c[0]-a[0])*k,a[1]+(c[1]-a[1])*k);hopSet(e.id,Math.sin(Math.PI*k))});hopSet(e.id,0);st.logPos[e.id]=e.to.slice();await wait(200)}
   else if(e.k==='pending'){popSet('DODATKOWA AKCJA!','Ciotka przesuwa trafioną postać');await wait(1100);popHide()}
   else if(e.k==='out'){
    const p=st.curPos[e.id]||[0,0];cam(p,1.5);burst(p[0],p[1]-34,'#ff5a4f',14);shakeStage(12);
    ovAdd('<g transform="translate('+p[0]+','+(p[1]-150)+')"><text class="fl big">ODPADA</text></g>');
    const t=document.getElementById('tk-'+e.id);if(t)t.animate([{opacity:1},{opacity:0}],{duration:900,fill:'forwards'});
    capSet(nmOf(e.id)+' odpada z gry');await wait(1100)}
  }
  cam(null,1);await wait(300);await pickAnim();
 }finally{
  cam(null,1);ovSet('');popHide();st.animating=false;st.skipReq=false;render()}
}
/* --- z części: PSEUDO-3D: stojaki, podniesione pola, kamera --- */
function tokMove(id,x,y){st.curPos[id]=[x,y];const el=document.getElementById('tk-'+id);if(el)el.setAttribute('transform','translate('+x.toFixed(1)+','+y.toFixed(1)+') scale('+depthScale(y).toFixed(3)+')');zsort()}
function cam(px,s){const v=document.querySelector('#stage svg');if(!v)return;const p=px||[495,512];v.style.transformOrigin=((p[0]-62)/870*100)+'% '+((p[1]-40)/900*100)+'%';v.style.transition='transform .65s cubic-bezier(.2,.8,.2,1)';v.style.transform=(s&&s>1)?'perspective(900px) rotateX(9deg) scale('+s+')':'none'}
function animView(items){
 board({});const base=BOARD_SVG;let toks='';st.animHp={};
 const arr=items.filter(o=>st.curPos[o.id]&&o.q.ch).sort((a,b)=>st.curPos[a.id][1]-st.curPos[b.id][1]);
 arr.forEach((o,ix)=>{const p=st.curPos[o.id];
  const hp=(o.q.hpr&&o.q.hpr[st.round]!==undefined)?o.q.hpr[st.round]:5;st.animHp[o.id]=hp;
  toks+='<g id="tk-'+o.id+'" transform="translate('+p[0].toFixed(1)+','+p[1].toFixed(1)+') scale('+depthScale(p[1]).toFixed(3)+')">'+standee(o.q.ch,(ix*.37).toFixed(2))+'<g transform="translate(0,-72)"><rect x="-34" y="-5" width="68" height="10" rx="5" fill="#000" fill-opacity=".7" stroke="#fff" stroke-opacity=".5" stroke-width="2"/><rect id="hpf-'+o.id+'" class="hpf" x="-34" y="-5" width="68" height="10" rx="5" fill="'+(hp>2?'#4fc183':hp>1?'#f0a020':'#e0342b')+'" style="transform:scaleX('+hp/MAXHP(o.q.ch)+')"/></g></g>'});
 BOARD_SVG=base.replace('</svg>',toks+'<g id="ex"></g><g id="ov"></g></svg>');
 return '<div class="card" id="cap" style="text-align:center;font-weight:700">'+(st.capText||'')+'</div><div id="pop" class="pop"></div><button class="go" data-a="skip">Pomiń animację</button>'}
/* --- z części: animacja podniesienia przedmiotu (leczenie ≠ obrażenia) --- */
async function pickAnim(){
 if(!isSp()||st.skipReq)return;
 for(const p of (st.animPick||[])){
  if(st.skipReq)break;ovSet('');
  const g=GEO[p.k],el=document.getElementById(iid(p.k)),ico=el&&el.querySelector('.ico'),col=PKCOL[p.t]||'#fff';
  const tp=st.curPos[p.id]||g.c,dx=tp[0]-g.c[0],dy=(tp[1]-62)-(g.c[1]+4);
  capSet(nmOf(p.id)+' podnosi: '+ITEM[p.t].n);
  if(ico){const a=ico.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate(0,-55px) scale(1.35)',opacity:1,offset:.38},{transform:'translate('+dx+'px,'+dy+'px) scale(.12)',opacity:.3}],{duration:780,easing:'cubic-bezier(.3,.7,.3,1)',fill:'forwards'});try{await a.finished}catch(e){}}
  else await wait(400);
  if(el)el.remove();
  const tok=document.querySelector('#tk-'+p.id+' .in');
  if(p.t===1){
   const before=st.animHp[p.id]||5,after=Math.min(MAXHP(chOfId(p.id)),before+1);st.animHp[p.id]=after;
   const f=document.getElementById('hpf-'+p.id);if(f){f.style.fill='#5cff8a';f.style.transform='scaleX('+after/MAXHP(chOfId(p.id))+')';setTimeout(()=>{if(f)f.style.fill=after>2?'#4fc183':after>1?'#f0a020':'#e0342b'},900)}
   let sp='';for(let i=0;i<7;i++){const x=-34+i*11,d=(i%3)*90;sp+='<g transform="translate('+x+',0)"><text class="healfx" style="animation-delay:'+d+'ms;font:900 26px system-ui;fill:#5cff8a;stroke:#0b3a17;stroke-width:4px;paint-order:stroke">+</text></g>'}
   ovAdd('<g transform="translate('+tp[0]+','+(tp[1]-40)+')"><g class="healring"><circle r="34" fill="none" stroke="#5cff8a" stroke-width="6"/></g>'+sp+'</g>');
   ovAdd('<g transform="translate('+tp[0]+','+(tp[1]-150)+')"><text class="fl big heal">+1 HP</text></g>');
   if(tok){tok.classList.remove('tokglow');void tok.getBoundingClientRect();tok.classList.add('tokglow')}
  }else{
   ovAdd('<g transform="translate('+tp[0]+','+(tp[1]-62)+')"><g class="pkring"><circle r="16" fill="none" stroke="'+col+'" stroke-width="7"/></g></g>');
   burst(tp[0],tp[1]-62,col,12);
   ovAdd('<g transform="translate('+tp[0]+','+(tp[1]-150)+')"><text class="fl big gain" style="fill:'+col+'">'+ITEM[p.t].n+'</text></g>');
   if(tok){tok.classList.remove('tokgain');void tok.getBoundingClientRect();tok.classList.add('tokgain')}}
  await wait(1000)}}

/* --- z części: ŻETONY-PORTRETY v2 --- */
function hopSet(id,k){const e=document.querySelector('#tk-'+id+' .hop');if(e)e.setAttribute('transform','translate(0,'+(-k*32).toFixed(1)+')');
 const s=document.querySelector('#tk-'+id+' .sh');if(s)s.setAttribute('opacity',(.5-.28*k).toFixed(2));
 if(k===0&&(_hopPrev[id]||0)>.15)tkFx(id,'land',360);_hopPrev[id]=k}
function tkFx(id,cls,ms){const g=document.querySelector('#tk-'+id+' .tkA');if(!g)return;g.classList.remove(cls);void g.getBoundingClientRect();g.classList.add(cls);if(ms)setTimeout(()=>g.classList.remove(cls),ms)}
