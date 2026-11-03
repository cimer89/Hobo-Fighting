
//@@if github
// ==== KONFIGURACJA FIREBASE (wklej wartości z konsoli Firebase, patrz README.md) ====
const FIREBASE_CONFIG={apiKey:'WPISZ_TUTAJ',authDomain:'WPISZ_TUTAJ',projectId:'WPISZ_TUTAJ',storageBucket:'WPISZ_TUTAJ',messagingSenderId:'WPISZ_TUTAJ',appId:'WPISZ_TUTAJ'};
// =====================================================================================
//@@else
//@@end
const IMG={"Żyleta": '', "Byku": '', "Wiatrak": '', "Długi": '', "Ciotka": ''};
let BAN='';
const INI={W:'Wiatrak',D:'Długi','Ż':'Żyleta',B:'Byku',C:'Ciotka'};
let BG='';
const GEO={"-3,0": {"c": [148.5, 322.0], "p": "-65,0 -38,-36 -24,-47 -24,-47 40,-47 48,-36 55,3 38,26 26,40 -5,47 -32,47 -48,25"}, "-3,1": {"c": [142.5, 420.5], "p": "-64,-2 -44,-28 -28,-49 5,-53 31,-53 55,-19 58,2 44,24 27,49 23,53 -28,52 -49,22"}, "-3,2": {"c": [136.0, 527.5], "p": "-61,2 -35,-37 -26,-50 16,-55 30,-54 45,-35 60,-3 37,36 28,50 4,54 -32,52 -48,31"}, "-3,3": {"c": [145.0, 631.0], "p": "-55,-24 -55,-26 -27,-50 4,-51 24,-46 50,-8 55,0 37,28 26,45 8,51 -28,42 -32,38"}, "-2,-1": {"c": [254.0, 263.5], "p": "-70,1 -51,-24 -31,-46 -20,-49 41,-49 49,-42 67,2 38,40 31,48 31,48 -36,49 -45,44"}, "-2,0": {"c": [241.5, 362.5], "p": "-70,3 -57,-14 -28,-50 -16,-51 44,-51 68,-19 58,5 45,25 29,47 2,49 -28,51 -55,25"}, "-2,1": {"c": [234.0, 464.5], "p": "-67,8 -38,-37 -27,-51 8,-54 38,-56 49,-43 60,-1 54,10 26,51 -20,55 -34,56 -65,14"}, "-2,2": {"c": [231.0, 573.5], "p": "-65,-1 -37,-47 -31,-54 -18,-55 33,-55 36,-51 67,1 49,33 33,55 17,56 -34,54 -65,10"}, "-2,3": {"c": [237.5, 683.5], "p": "-72,-1 -58,-22 -34,-53 12,-55 28,-55 52,-24 71,3 51,38 39,55 -29,55 -32,54 -36,50"}, "-1,-2": {"c": [367.0, 213.5], "p": "-70,1 -52,-23 -27,-43 -27,-43 38,-43 41,-40 70,-1 49,31 38,43 38,43 -40,43 -54,26"}, "-1,-1": {"c": [358.5, 301.5], "p": "-74,10 -43,-32 -32,-45 -32,-45 41,-46 57,-33 70,-1 41,40 37,44 11,45 -47,46 -60,32"}, "-1,0": {"c": [348.5, 397.5], "p": "-70,1 -47,-35 -33,-51 -33,-51 46,-52 61,-34 68,5 50,31 32,51 -23,52 -23,52 -69,23"}, "-1,1": {"c": [343.5, 510.0], "p": "-79,0 -58,-34 -34,-61 10,-62 39,-62 72,-13 79,-2 53,47 42,61 4,62 -45,62 -69,28"}, "-1,2": {"c": [345.5, 630.0], "p": "-80,-2 -62,-35 -46,-58 -8,-59 40,-59 68,-19 80,1 46,55 43,58 21,59 -31,59 -48,43"}, "-1,3": {"c": [352.0, 741.5], "p": "-76,-1 -51,-44 -43,-53 36,-53 36,-53 56,-28 77,1 47,49 42,53 -34,53 -34,53 -46,40"}, "0,-3": {"c": [480.0, 171.5], "p": "-76,-1 -43,-37 -38,-42 -38,-42 39,-42 49,-33 75,1 48,37 42,42 42,42 -42,42 -49,36"}, "0,-2": {"c": [479.5, 253.5], "p": "-75,3 -51,-29 -42,-40 -42,-40 43,-40 48,-35 75,2 50,37 47,40 47,40 -47,40 -52,35"}, "0,-1": {"c": [479.5, 340.5], "p": "-80,-2 -52,-41 -46,-47 -46,-47 46,-47 52,-41 82,2 65,35 54,47 54,47 -55,47 -62,40"}, "0,0": {"c": [479.0, 446.0], "p": "-92,-3 -58,-54 -36,-59 34,-59 34,-59 76,-29 95,0 78,33 59,56 -50,59 -50,59 -70,43"}, "0,1": {"c": [479.5, 573.0], "p": "-94,0 -58,-55 -41,-59 41,-59 41,-59 64,-47 93,0 76,26 52,59 52,59 -53,59 -69,38"}, "0,2": {"c": [479.5, 687.0], "p": "-92,-1 -68,-37 -54,-55 40,-56 40,-56 61,-47 92,1 57,49 51,56 51,56 -52,56 -55,53"}, "0,3": {"c": [480.0, 795.5], "p": "-84,2 -59,-44 -52,-53 -2,-54 50,-53 67,-29 84,-1 49,39 33,54 33,54 -35,53 -48,41"}, "1,-3": {"c": [593.0, 213.5], "p": "-70,-2 -52,-26 -38,-43 34,-43 34,-43 50,-25 69,-1 54,25 39,43 -38,43 -38,43 -56,21"}, "1,-2": {"c": [600.5, 301.0], "p": "-70,0 -52,-38 -40,-46 32,-45 32,-45 40,-35 73,8 55,37 48,46 -10,46 -37,45 -46,34"}, "1,-1": {"c": [610.0, 398.0], "p": "-77,-9 -54,-43 -47,-52 35,-52 35,-52 43,-41 70,0 67,25 26,52 26,52 -34,51 -55,24"}, "1,0": {"c": [614.0, 510.0], "p": "-81,2 -43,-56 -38,-62 -21,-62 41,-61 46,-57 80,-1 72,23 46,62 5,62 -41,61 -53,47"}, "1,1": {"c": [612.5, 630.0], "p": "-80,1 -51,-43 -40,-59 -3,-59 47,-58 61,-38 79,0 60,28 35,59 -4,59 -42,58 -73,14"}, "1,2": {"c": [606.5, 741.0], "p": "-76,0 -49,-37 -36,-54 -16,-54 43,-53 63,-25 76,-1 44,42 34,54 34,54 -42,54 -56,34"}, "2,-3": {"c": [705.0, 263.0], "p": "-72,-5 -48,-41 -41,-49 23,-49 31,-47 43,-33 72,3 59,25 40,49 -30,49 -30,49 -43,33"}, "2,-2": {"c": [717.5, 362.5], "p": "-62,1 -50,-44 -43,-51 27,-51 27,-51 52,-21 70,2 41,46 27,51 27,51 -26,47 -36,40"}, "2,-1": {"c": [724.5, 464.0], "p": "-67,-11 -50,-40 -34,-56 21,-52 28,-51 34,-45 67,6 68,11 37,56 -17,53 -28,49 -51,14"}, "2,0": {"c": [728.0, 573.0], "p": "-68,0 -49,-32 -30,-58 5,-56 31,-54 37,-47 66,1 40,46 34,54 4,58 -34,56 -38,52"}, "2,1": {"c": [721.5, 684.0], "p": "-71,1 -41,-41 -28,-56 -12,-56 34,-54 40,-50 72,-1 51,28 12,55 -4,56 -38,56 -48,42"}, "3,-3": {"c": [810.5, 322.0], "p": "-63,-7 -46,-38 -39,-47 28,-47 28,-47 38,-37 65,0 49,24 32,47 9,47 -26,39 -31,34"}, "3,-2": {"c": [817.0, 420.5], "p": "-62,-4 -39,-43 -31,-53 1,-53 28,-49 38,-36 63,-1 46,27 28,52 -10,53 -29,47 -41,28"}, "3,-1": {"c": [824.0, 527.5], "p": "-62,-4 -62,-10 -31,-54 -12,-55 24,-52 52,-12 62,4 50,26 31,52 -3,54 -30,48 -45,25"}, "3,0": {"c": [813.0, 632.0], "p": "-54,0 -43,-18 -24,-46 8,-52 34,-51 54,-31 54,-31 40,49 37,52 -19,52 -23,48 -50,7"}};
const D=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
const DN=['wschód','płn.-wschód','płn.-zachód','zachód','płd.-zachód','płd.-wschód'];
const C={
 'Wiatrak':{col:'#3b6fd4',txt:'Wachlarz 3 pól: środek 2 DMG, boki po 1 DMG.'},
 'Długi':{col:'#6b8f3e',txt:'Linia 3 pól: 1 – 1 – 2 DMG. Ma 3 fazy w rundzie (anulowana, gdy ktoś go przesunie).'},
 'Żyleta':{col:'#e0a81c',txt:'Linia do końca planszy, trafia pierwszą postać, 2 DMG.'},
 'Byku':{col:'#e07a1a',txt:'Skok o 1–2 pola (dalszy: 1 DMG w miejscu lądowania). Szarża (tylko faza II): na wprost do pierwszej postaci lub ściany, 3 DMG i odrzucenie o 1 pole.'},
 'Ciotka':{col:'#8a4fc7',txt:'Linia 3 pól. Faza I: 2 DMG. Faza II: 1 DMG + przesunięcie o 1.'}
};
const cells=[];for(let q=-3;q<=3;q++)for(let r=Math.max(-3,-q-3);r<=Math.min(3,-q+3);r++)cells.push([q,r]);
const K=(q,r)=>q+','+r, IN=(q,r)=>Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r))<=(window.__BR||3);
const px=(q,r)=>GEO[q+','+r].c;
const hexPts=()=>'75.3,0 37.7,51.7 -37.7,51.7 -75.3,0 -37.7,-51.7 37.7,-51.7';
const st={scr:'splash',lastPanel:null,leaving:false,round:1,ch:'Wiatrak',start:null,slot:0,ph:0,mode:'move',plan:[{m:null,d:null},{m:null,d:null}],done:false};
const app=document.getElementById('app');

function fromPos(ph){let p=st.start;for(let i=0;i<ph;i++){const x=st.plan[i];if(x.t==='move'&&x.m)p=x.m}return p}
function setSlot(i){st.slot=i;st.ph=i>>1;st.mode=i%2?'atk':'move'}
function next(){let i=st.slot+1;if(st.ch==='Byku'&&i%2)i++;if(i<=3)setSlot(i)}

function zf(h,q,r){if(h.fill)return h.fill;if(zoneR(st.round)>=3)return '';return dist(q,r)>zoneR(st.round)?'color-mix(in srgb,#e0342b 50%,transparent)':'color-mix(in srgb,#2fbf5f 30%,transparent)'}
function lab(h){if(!h.t)return '';const a=[...String(h.t)],ids=a.filter(c=>INI[c]),rest=a.filter(c=>!INI[c]).join('');let o='';
 if(ids.length){const n=INI[ids[0]];o+='<circle r="19" fill="'+C[n].col+'"/><image href="'+IMG[n]+'" x="-17" y="-17" width="34" height="34" clip-path="url(#cp)" preserveAspectRatio="xMidYMid slice"/>'+(ids.length>1?'<text class="lbl" y="13">+'+(ids.length-1)+'</text>':'')}
 if(rest)o+='<text class="lbl" y="'+(ids.length?-14:0)+'">'+rest+'</text>';return o?'<g transform="scale(2)">'+o+'</g>':o}
function myHp(){const q=H?H.p[H.cur]:ME;return q.hpr&&q.hpr[st.round]!==undefined?q.hpr[st.round]:5}
let BOARD_SVG=null;

const net={db:null,uid:null,code:null,pl:{},unsub:null,err:false};
const ME={ch:null,start:null,sready:false,plans:{},posr:{},hp:5,hpr:{1:5},hpo:{}};
//@@if github
async function initNet(){
 try{
  if(!window.firebase||FIREBASE_CONFIG.apiKey==='WPISZ_TUTAJ')return render();
  firebase.initializeApp(FIREBASE_CONFIG);
  const cred=await firebase.auth().signInAnonymously();
  net.uid=cred.user.uid;net.db=firebase.firestore();
 }catch(e){console.warn('Firebase:',e);net.db=null}
 render()
}
//@@else
async function initNet(){try{const u=await claude.use('user'),d=await claude.use('db');if(u&&d){net.uid=await u.id();net.db=d}}catch(e){}render()}
//@@end
function save(){if(!net.db)return;net.db.doc('rooms/'+net.code+'/players/'+net.uid).set(JSON.parse(JSON.stringify(ME))).catch(()=>{net.err=true;render()})}
function join(code){net.code=code.toUpperCase();net.unsub&&net.unsub();net.unsub=net.db.collection('rooms/'+net.code+'/players').onSnapshot(sn=>{net.pl={};sn.docs.forEach(d=>net.pl[d.id]=d.data());chk();render()},()=>{});save();st.scr='pick';render()}
function chk(){const ps=Object.values(net.pl);if(st.scr==='plan'&&st.done&&ps.length>1&&ps.filter(p=>alive(p,st.round)).every(p=>p.plans&&p.plans[st.round]))st.scr='rev'}
function waitTxt(){if(H)return 'Plan zapisany.';if(!net.db)return 'Tryb solo.';const ps=Object.values(net.pl).filter(p=>alive(p,st.round)),n=ps.filter(p=>p.plans&&p.plans[st.round]).length;return 'Gotowych: '+n+' z '+ps.length+'. Kod pokoju: '+net.code}
function tok(g){const hl={};Object.entries(net.pl).forEach(([id,p])=>{const q=g(p);if(!q||!p.ch)return;const k=K(...q);hl[k]=hl[k]?{fill:hl[k].fill,t:hl[k].t+p.ch[0],stroke:'var(--hit)'}:{fill:C[p.ch].col,t:p.ch[0],stroke:id===net.uid?'var(--ink)':undefined}});return hl}
function pips(p,own,idx){return '<span class="hp" style="display:inline-flex">'+Array.from({length:MAXHP(p.ch||st.ch)},(_,i)=>i+1).map(n=>'<i '+(own?'data-hp="'+n+'" data-pi="'+(idx||0)+'" data-eff="'+p.hp+'" ':'')+'style="'+(n<=p.hp?'':'opacity:.2')+'"></i>').join('')+'</span>'}
//@@if github
//@@else
//@@end
function alive(p,r){const v=p.hpr&&p.hpr[r];return (v===undefined?5:v)>0}
function zoneR(r){return r<=3?3:r<=6?2:r<=9?1:0}
function dist(q,r){return Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r))}
function netItems(){return Object.entries(net.pl).sort().map(([id,p])=>({id,q:id===net.uid?ME:p,idx:0}))}
let H=null;
function hTok(g){const hl={};H.p.forEach(p=>{const q=g(p);if(!q)return;const k=K(...q);hl[k]=hl[k]?{fill:hl[k].fill,t:hl[k].t+p.ch[0],stroke:'var(--hit)'}:{fill:C[p.ch].col,t:p.ch[0]}});return hl}
function hStartsH(){return '<h2 style="font:400 26px Bangers,Impact,sans-serif;margin:8px 0">Pozycje startowe</h2>'+board(hTok(p=>p.posr[1]))+'<div class="card">'+H.p.map((p,i)=>'<div style="border-left:10px solid '+C[p.ch].col+';padding-left:6px;margin:4px 0">Gracz '+(i+1)+': '+p.ch+teamTag(p)+'</div>').join('')+'</div><button class="go" data-a="hplan">Zaczynamy planowanie</button>'}
function othersOverlay(hl){const L=[];if(H)H.p.forEach((p,i)=>{if(i!==H.cur)L.push(p)});else if(net.db)Object.entries(net.pl).forEach(([id,p])=>{if(id!==net.uid)L.push(p)});L.forEach(p=>{const q=p.posr&&p.posr[st.round];if(!q||!p.ch||!alive(p,st.round))return;const k=K(...q),e=hl[k]||{};hl[k]=Object.assign({},e,{fill:'color-mix(in srgb,'+C[p.ch].col+' 60%,transparent)',t:(e.t||'')+p.ch[0]})})}
function initAnimPos(items){st.curPos={};st.logPos={};items.forEach(o=>{const c=o.q.posr&&o.q.posr[st.round];if(c){st.logPos[o.id]=c.slice();st.curPos[o.id]=GEO[c[0]+','+c[1]].c}})}
function capSet(t){st.capText=t;const el=document.getElementById('cap');if(el)el.textContent=t}
function ovSet(h){const el=document.getElementById('ov');if(el)el.innerHTML=h}
function nmOf(id){const o=(st.animItems||[]).find(o=>o.id===id);return o?o.q.ch:id}
function popSet(t,sub){const el=document.getElementById('pop');if(!el)return;el.innerHTML='<b>'+t+'</b>'+(sub?'<small>'+sub+'</small>':'');el.classList.remove('show');void el.offsetWidth;el.classList.add('show')}
function popHide(){const el=document.getElementById('pop');if(el)el.classList.remove('show')}
function shakeTok(id){const el=document.querySelector('#tk-'+id+' .in');if(el){el.classList.remove('shk');void el.getBoundingClientRect();el.classList.add('shk')}}
async function wait(ms){for(let t=0;t<ms&&!st.skipReq;t+=40)await new Promise(r=>setTimeout(r,40))}
function tween(ms,f){return new Promise(res=>{const t0=performance.now();(function step(){if(st.skipReq){f(1);return res()}const t=Math.min(1,(performance.now()-t0)/ms);f(t);if(t<1)requestAnimationFrame(step);else res()})()})}
let LAST_BOARD=null;
function stageSet(on){
  const sg=document.getElementById('stage');if(!sg)return;
  const front=st.animating||st.scr==='rev'||st.scr==='hrev';
  const was=sg.dataset.on==='1';sg.dataset.on=on?'1':'0';
  sg.className=(on?'':'hide ')+(front?'front':'dim')+(on&&!was?' enter':'');
  const html=on&&BOARD_SVG?BOARD_SVG:'';
  if(html!==LAST_BOARD){sg.innerHTML=html;LAST_BOARD=html}
}
function pushPick(k){
 const items=H?H.p.map((q,i)=>({id:'p'+i,q,idx:i})):netItems();
 const pend=resolve(items)._pend||[];
 if(!pend.length)return;
 const p=pend[0];
 if(!H&&p.by!==net.uid)return;
 const [q,r]=k.split(',').map(Number);
 if(!IN(q,r)||!D.some(([a,b])=>p.pos[0]+a===q&&p.pos[1]+b===r))return;
 const o=items.find(o=>o.id===p.by);
 o.q.push=o.q.push||{};o.q.push[st.round]=[q,r];
 if(!H)save();
}
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
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-ch],[data-t],[data-a],[data-k],[data-hp],[data-n]');if(!t)return;
 const ds=t.dataset,pl=st.plan[st.ph];
 if(st.animating&&ds.a!=='skip')return;
 if(ds.k&&(st.scr==='rev'||st.scr==='hrev')){pushPick(ds.k);render();return}
 if(ds.a==='start'){st.scr='lobby'}
 else if(ds.ch){st.ch=ds.ch;st.start=null}
 else if(ds.t){pl.t=ds.t;pl.m=null;pl.d=null}
 else if(ds.n){H={n:+ds.n,cur:0,tgt:'pick',p:Array.from({length:+ds.n},()=>({ch:null,start:null,plans:{},posr:{},hp:5,hpr:{1:5},hpo:{}}))};st.round=1;st.scr='hpass'}
 else if(ds.a==='hot'){net.db=null;H=null;st.scr='hsetup'}
 else if(ds.a==='hgo'){if(H.tgt==='pick'){st.scr='pick';st.start=null;st.ch=Object.keys(C).find(n=>!taken(n))}else{const p=H.p[H.cur];st.scr='plan';st.ch=p.ch;st.start=p.posr[st.round];st.plan=newPlan();st.ph=0;st.done=false}}
 else if(ds.a==='hplan'){H.cur=0;H.tgt='plan';st.scr='hpass'}
 else if(ds.a==='hnext'){const p=H.p[H.cur];p.plans[st.round]=JSON.parse(JSON.stringify(st.plan));const nx=H.p.findIndex((q,i)=>i>H.cur&&alive(q,st.round));if(nx>=0){H.cur=nx;H.tgt='plan';st.scr='hpass'}else st.scr='hrev'}
 else if(ds.a==='hnextr'){{const Q=resolveFin(H.p.map((q,i)=>({id:'p'+i,q,idx:i})));H.p.forEach((p,i)=>{const x=Q['p'+i];p.posr[st.round+1]=x?x.pos:p.posr[st.round];p.hpr[st.round+1]=x?x.eff:0})}st.round++;H.cur=H.p.findIndex(p=>alive(p,st.round));H.tgt='plan';st.scr='hpass'}
 else if(ds.a==='confirm'&&H){const p=H.p[H.cur];p.ch=st.ch;p.start=st.start;p.posr[1]=st.start;if(H.cur<H.n-1){H.cur++;H.tgt='pick';st.scr='hpass'}else st.scr='hstarts'}
 else if(ds.a==='confirm'&&net.db){ME.ch=st.ch;ME.start=st.start;ME.sready=true;ME.posr[1]=st.start;save();st.scr='wait'}
 else if(ds.a==='confirm'){st.scr='plan';st.plan=newPlan();st.ph=0;st.done=false}
 else if(ds.a==='back'){st.scr='pick'}
 else if(ds.a==='ok'){if(st.leaving)return;st.leaving=true;const pe=document.getElementById('phpanel');if(pe)pe.classList.add('pout');setTimeout(()=>{st.leaving=false;if(st.ph<nPh(st.ch)-1)st.ph++;else{st.done=true;if(net.db){ME.plans[st.round]=JSON.parse(JSON.stringify(st.plan));save();chk()}}render()},pe?380:0);return}
 else if(ds.a==='prev'){st.ph=Math.max(0,st.ph-1)}
 else if(ds.a==='create'){join(Math.random().toString(36).slice(2,6))}
 else if(ds.a==='joinb'){const v=(document.getElementById('code').value||'').trim();if(v.length===4)join(v)}
 else if(ds.a==='solo'){net.db=null;st.scr='pick'}
 else if(ds.a==='goplan'){st.scr='plan';st.start=ME.start;st.plan=newPlan();st.ph=0;st.done=false}
 else if(ds.a==='next'){{const x=resolveFin(netItems())[net.uid];if(x){ME.posr[st.round+1]=x.pos;ME.hpr[st.round+1]=x.eff}}st.round++;st.start=ME.posr[st.round];st.plan=newPlan();st.ph=0;st.done=false;st.scr='plan';save()}
 else if(ds.hp!==undefined){const q=H?H.p[+ds.pi]:ME;q.hpo=q.hpo||{};q.hpo[st.round]=+ds.eff===+ds.hp?+ds.hp-1:+ds.hp;if(!H)save()}
 else if(ds.a==='edit'){st.done=false;st.ph=0;if(net.db){delete ME.plans[st.round];save()}}
 else if(ds.k){
  const [q,r]=ds.k.split(',').map(Number);
  if(st.scr==='pick')st.start=[q,r];
  else if(!st.done){
   const from=fromPos(st.ph),i=D.findIndex(([a,b])=>from[0]+a===q&&from[1]+b===r);
   planTap(pl,q,r,from,i);
  }
 }
 render();
});
render();
window.addEventListener('resize',()=>render());
//@@if github
initNet();
//@@else
if(window.claude)initNet();
//@@end
