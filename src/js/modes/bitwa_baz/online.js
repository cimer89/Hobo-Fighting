/* --- Bitwa baz, część: online – gra przez sieć. Części są fragmentami jednego domknięcia MB i muszą być sklejane w kolejności z manifestu. --- */
 /* ---------- ONLINE ---------- */
 let ON=null;
 function seedRng(seed){let s=(seed>>>0)%2147483647||1;return ()=>{s=(s*16807)%2147483647;return (s-1)/2147483646}}
 function withSeed(seed,f){const o=Math.random;Math.random=seedRng(seed);try{return f()}finally{Math.random=o}}
 const onNick=()=>{try{return (typeof PROF!=='undefined'&&PROF.nick)||null}catch(e){return null}};
 function onDb(){if(net.db&&!net.p2p&&window.firebase&&firebase.apps&&firebase.apps.length)return net.db;if(!net.uid||!net.db||!net.p2p){try{P2P.init()}catch(e){}}return P2P.db}
 function onPub(){if(!ON||!ON.code)return;const r={};Object.keys(ON.myR).map(Number).sort((a,b)=>b-a).slice(0,3).forEach(k=>r[k]=ON.myR[k]);
  const d={nick:onNick()||'',slot:ON.slot,ts:ON.ts||0,ch:ON.ch||null,r};if(ON.host)d.host=ON.hostInfo;
  onDb().doc('rooms/MB'+ON.code+'/players/'+net.uid).set(d)}
 function onSub(){onDb().collection('rooms/MB'+ON.code+'/players').onSnapshot(sn=>{if(!ON)return;ON.docs={};sn.docs.forEach(d=>ON.docs[d.id]=d.data());onSync()})}
 function onHostInfo(){if(!ON)return null;if(ON.host)return ON.hostInfo;const h=Object.values(ON.docs||{}).find(d=>d&&d.host);return h?h.host:null}
 function onSlots(hi){const n=hi.mode==='1v1'?2:hi.mode==='2v2'?4:6,own=[];
  for(let i=0;i<n;i++){const cl=Object.entries(ON.docs).filter(([,d])=>d&&d.slot===i).sort((a,b)=>(a[1].ts-b[1].ts)||(a[0]<b[0]?-1:1));own.push(cl.length?{id:cl[0][0],d:cl[0][1]}:null)}
  const used={};own.forEach(o=>{if(!o||!o.d.ch)return;if(used[o.d.ch])o.dup=true;else used[o.d.ch]=1});return own}
 function onCreate(mode,mi){const R='ACDEFGHJKLMNPQRTUVWXYZ23456789',code='B'+[0,1,2].map(()=>R[Math.floor(Math.random()*R.length)]).join('');
  ON={code,host:true,hostInfo:{mode,mi,seed:Math.floor(Math.random()*2e9)+1,start:false},docs:{},myR:{},ups:{},slot:0,ts:Date.now(),ch:null};onSub();onPub();draw()}
 function onJoin(code){code=(code||'').trim().toUpperCase();if(code.length!==4)return false;ON={code,host:false,docs:{},myR:{},ups:{},slot:null,ts:0,ch:null};onSub();onPub();draw();return true}
 function onLeave(){try{P2P.reset()}catch(e){}ON=null}
 function onStartGame(hi){if(G&&G._on)return;const asg=hi.assign;
  withSeed(hi.seed,()=>newGame(hi.mode,hi.mi));G._on=true;
  asg.forEach((a,i)=>{G.heroes[i].ch=a[1];G.heroes[i].nick=a[2]||''});
  startPositions();updateSeen();ON.slot=asg.findIndex(a=>a[0]===net.uid);G.cur=ON.slot;G.scr='opass';G.pickI=G.heroes.length;draw()}
 function onSync(){if(!ON)return;const hi=onHostInfo();
  if(hi&&hi.start&&hi.assign&&!G){if(hi.assign.some(a=>a[0]===net.uid))onStartGame(hi);else{ON.full=true;draw()}return}
  if(G&&G._on&&G.scr==='owait')onTry();
  else if(!G||!G._on)draw()}
 function onSubmit(){const h=G.heroes[ON.slot],r=G.round;ON.myR[r]={p:h.plans?JSON.parse(JSON.stringify(h.plans)):null,u:ON.ups[r]||[]};onPub();G.scr='owait';onTry()}
 function onTry(){if(!G||G.scr!=='owait')return draw();const hi=onHostInfo(),r=G.round,ents=[];
  for(let i=0;i<hi.assign.length;i++){const d=ON.docs[hi.assign[i][0]],e=d&&d.r&&d.r[r];if(!e)return draw();ents.push(e)}
  ents.forEach((e,i)=>{if(i===ON.slot)return;const h=G.heroes[i];(e.u||[]).forEach(ix=>{const o=upOpts(h)[ix];if(o&&!o.dis){applyUp(h,o);h.pend=Math.max(0,(h.pend||0)-1)}});h.plans=e.p?JSON.parse(JSON.stringify(e.p)):null});
  withSeed(hi.seed+r*7919,()=>resolveRound());G.cur=ON.slot;G.scr=G.winner?'over':'opass';draw()}
 function onDraw(){let h='';
  if(!G){if(ON.pending)return false;
   const hi=onHostInfo();
   if(ON.full)h='<div class="mbbox"><h2>Pokój '+ON.code+'</h2><p class="mbwarn">Gra w tym pokoju już się zaczęła.</p><button data-mb="on:leave">← Wróć</button></div>';
   else if(!hi)h='<div class="mbbox"><h2>Pokój '+ON.code+'</h2><p>Łączenie z pokojem… Jeśli to trwa długo, sprawdź kod i internet.</p><button data-mb="on:leave">← Wróć</button></div>';
   else{const sl=onSlots(hi),me=sl.findIndex(o=>o&&o.id===net.uid),taken=sl.filter((o,i)=>o&&i!==me&&o.d.ch).map(o=>o.d.ch);
    const ok=sl.every(o=>o&&o.d.ch&&!o.dup);
    h='<div class="mbbox"><h2>Bitwa baz online</h2><p>Kod pokoju: <b style="font-size:22px;letter-spacing:3px;color:#ffd84a">'+ON.code+'</b><br>'+hi.mode+' · '+MAPS[hi.mode==='1v1'?'small':'big'][hi.mi].n+'. Podaj kod znajomym.</p>'
     +'<div class="mbteams">'+['A','B'].map(t=>'<div style="border-color:'+TCOL[t]+'"><b style="color:'+TCOL[t]+'">'+TNAME[t]+'</b>'+sl.map((o,i)=>[o,i]).filter(([o,i])=>i%2===(t==='A'?0:1)).map(([o,i])=>
       '<button data-mb="on:slot:'+i+'" style="margin:3px 0;width:100%;'+(i===me?'outline:3px solid #ffd84a;':'')+'" '+(o&&i!==me?'disabled':'')+'>'+(o?((o.d.nick?hfEsc(o.d.nick):'Gracz')+(o.id===net.uid?' (Ty)':'')+' · '+(o.d.ch?SHORT(o.d.ch)+(o.dup?' ⚠':''):'wybiera…')):'+ Wolne miejsce')+'</button>').join('')+'</div>').join('')+'</div>'
     +(me>=0?'<p>Wybierz postać:</p><div class="mbgrid">'+Object.keys(C).filter(n=>n!=='Manekin').map(n=>'<button class="mbtile" data-mb="on:ch:'+n+'" '+(taken.includes(n)?'disabled':'')+' style="'+(sl[me].d.ch===n?'outline:3px solid #ffd84a':'')+'"><img src="'+IMG[n]+'" alt=""><span>'+SHORT(n)+'</span></button>').join('')+'</div>':'<p class="mbwarn">Dotknij wolnego miejsca w drużynie.</p>')
     +(ON.host?'<button class="mbgo" data-mb="on:start" '+(ok?'':'disabled')+'>'+(ok?'Zaczynamy!':'Czekamy, aż wszystkie miejsca będą zajęte…')+'</button>':'<p>'+(ok?'Czekamy, aż założyciel pokoju zacznie grę.':'Czekamy na graczy…')+'</p>')
     +'<button data-mb="on:leave">← Opuść pokój</button></div>'}
   root.innerHTML=h;return true}
  if(G.scr==='opass'){const hh=G.heroes[ON.slot];
   h='<div class="mbbox"><p>Online · pokój '+ON.code+'</p><h2 style="color:'+TCOL[hh.team]+'">Runda '+G.round+' · '+hh.ch+'</h2><p>'+TNAME[hh.team]+(hh.nick?' · '+hfEsc(hh.nick):'')+'</p>'
    +(hh.dead?'<p class="mbwarn">Twoja postać nie żyje. Odrodzi się w bazie za '+hh.dead+' '+(hh.dead===1?'rundę':'rundy')+'.</p><button class="mbgo" data-mb="skip">Dalej</button>':'<button class="mbgo" data-mb="ready">Planuj rundę</button>')+'<button data-mb="quit">Opuść grę</button></div>';
   root.innerHTML=h;return true}
  if(G.scr==='owait'){const hi=onHostInfo(),r=G.round;
   const rows=hi.assign.map((a,i)=>{const d=ON.docs[a[0]],ok=!!(d&&d.r&&d.r[r]),hh=G.heroes[i];return '<div style="color:'+TCOL[hh.team]+';margin:2px 0">'+(ok?'✓ ':'⏳ ')+(a[2]?hfEsc(a[2])+' · ':'')+hh.ch+(i===ON.slot?' (Ty)':'')+'</div>'}).join('');
   h='<div class="mbbox"><h2>Runda '+r+'</h2><p>Twój plan wysłany. Czekamy na pozostałych graczy…</p><div>'+rows+'</div><p style="opacity:.7">Pokój '+ON.code+'</p><button data-mb="quit">Opuść grę</button></div>';
   root.innerHTML=h;return true}
  return false}
 function onClickOn(v){
  if(v==='on:host'){ON={pending:true};MSEL=null;draw();return true}
  if(v==='on:join'){const el=root.querySelector('#mbcode'),cv=((el&&el.value)||'').trim().toUpperCase();
   if(cv.length===4&&cv[0]!=='B'){if(el){el.style.outline='3px solid #ff5a4a';let w=root.querySelector('.mbcw');if(!w){w=document.createElement('p');w.className='mbwarn mbcw';el.parentNode.insertAdjacentElement('afterend',w)}w.textContent='Kody Bitwy baz zaczynają się od litery B. Ten kod jest do zwykłej gry – wpisz go w menu głównym w „Dołącz kodem”.'}return true}
   if(!onJoin(cv)){if(el)el.style.outline='3px solid #ff5a4a'}return true}
  if(v==='on:leave'){onLeave();draw();return true}
  if(v==='mback'&&ON&&ON.pending&&!MSEL){ON=null;draw();return true}
  if(ON&&ON.pending&&v.startsWith('map:')){const mode=MSEL;MSEL=null;onCreate(mode,+v.slice(4));return true}
  if(!ON||ON.pending)return false;
  if(v.startsWith('on:slot:')){ON.slot=+v.slice(8);ON.ts=Date.now();ON.ch=null;onPub();draw();return true}
  if(v.startsWith('on:ch:')){ON.ch=v.slice(6);onPub();draw();return true}
  if(v==='on:start'&&ON.host){const sl=onSlots(ON.hostInfo);if(!sl.every(o=>o&&o.d.ch&&!o.dup))return true;ON.hostInfo.assign=sl.map(o=>[o.id,o.d.ch,o.d.nick||'']);ON.hostInfo.start=true;onPub();onSync();return true}
  if(v==='quit'){onLeave();return false}
  return false}
