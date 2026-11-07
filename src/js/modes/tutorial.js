/* ===================== SAMOUCZEK: krótkie scenariusze na prawdziwej planszy i prawdziwym silniku ===================== */
/* Każda lekcja to jedna runda w normalnym trybie klasycznym (2 graczy). Gracz planuje swoje fazy,
   przeciwnik ma plan z góry, a rundę rozpatruje zwykły silnik walki – zasady gry się nie zmieniają.
   Trener (dymek u góry) mówi, co zrobić, i pokazuje pulsującą obwódką przycisk albo pole. */
(function(){
 const LS='hf_tut_done';
 const css=`#tutCoach{position:fixed;z-index:9500;color:#2a180b;border:3px solid #2a180b;background:linear-gradient(#fff8e6,#f3e2b8);font:600 14px/1.35 system-ui;box-sizing:border-box}
#tutCoach.bar{left:0;right:0;top:0;border-width:0 0 3px;border-radius:0 0 14px 14px;padding:calc(max(4px,env(safe-area-inset-top)) + 2px) 10px 5px 10px;box-shadow:0 3px 10px rgba(0,0,0,.35);font-size:13.5px;animation:tutDn .25s ease-out}
#tutCoach.bar .tt{font-size:13px;margin:0;padding-right:58px}#tutCoach.bar .tt span{display:none}#tutCoach.bar .tm{margin-top:1px}
#tutCoach.bar .tb{position:absolute;right:8px;top:calc(max(4px,env(safe-area-inset-top)) + 1px);margin:0}
#tutCoach.card{left:50%;top:50%;transform:translate(-50%,-50%);width:min(400px,calc(100% - 28px));border-radius:18px;padding:14px 16px 12px;box-shadow:0 8px 0 #2a180b,0 16px 40px rgba(0,0,0,.5);font-size:15px;animation:tutIn .3s cubic-bezier(.2,1.4,.4,1)}
#tutCoach.card .tt{font-size:22px}
#tutCoach.sheet{left:0;right:0;bottom:0;border-width:3px 0 0;border-radius:18px 18px 0 0;padding:12px 14px calc(max(10px,env(safe-area-inset-bottom)) + 4px);box-shadow:0 -6px 18px rgba(0,0,0,.4);max-height:52vh;overflow:auto;animation:tutUp .3s ease-out}
@keyframes tutIn{from{transform:translate(-50%,-50%) scale(.85);opacity:0}}
@keyframes tutDn{from{transform:translateY(-100%)}}@keyframes tutUp{from{transform:translateY(100%)}}
#tutCoach.bar{pointer-events:none}#tutCoach button{pointer-events:auto}
#tutCoach .tt{display:flex;align-items:center;gap:8px;margin-bottom:4px;font:400 18px Bangers,Impact,sans-serif;letter-spacing:1px;color:#b5401a}
#tutCoach .tt span{margin-left:auto;font:700 11px system-ui;color:#6b5236;letter-spacing:0}
#tutCoach .tm b{color:#b5401a}
#tutCoach .tb{display:flex;flex-wrap:wrap;gap:6px;margin-top:7px;justify-content:flex-end;align-items:center}
#tutCoach .tb button{min-height:30px;padding:3px 12px;border-radius:10px;font:700 12.5px system-ui}
#tutCoach .tb .tgo{background:#ffd84a;border:2px solid #2a180b;color:#2a180b}
#tutCoach .tb .tskip{background:transparent;border:0;color:#6b5236;text-decoration:underline;margin-right:auto}
#tutCoach.sheet.ok{background:linear-gradient(#e9ffe6,#bfe8b5)}#tutCoach.sheet.bad{background:linear-gradient(#ffe9e2,#f5c2b2)}
#tutCoach .why{margin-top:5px;font:500 12px/1.3 system-ui;color:#4a3524;background:rgba(255,255,255,.55);border-radius:8px;padding:4px 7px}
.tutRing{position:fixed;z-index:9400;pointer-events:none;border:4px solid #ffd84a;border-radius:14px;box-shadow:0 0 0 4px rgba(42,24,11,.55),0 0 18px #ffd84a;animation:tutP 1s ease-in-out infinite}
.tutRing.cell{border-radius:50%}
@keyframes tutP{50%{transform:scale(1.12);opacity:.65}}
.tutRing i{position:absolute;left:50%;top:-30px;transform:translateX(-50%);font:900 22px system-ui;color:#ffd84a;-webkit-text-stroke:1.5px #2a180b;animation:tutA .8s ease-in-out infinite;font-style:normal}
@keyframes tutA{50%{transform:translate(-50%,6px)}}
.tutRing.ghost{border-color:#ff5a4f;box-shadow:0 0 0 4px rgba(42,24,11,.55),0 0 18px #ff5a4f}.tutRing.ghost i{color:#ff5a4f}
.mtbtn.tutb{background:linear-gradient(#fff3c4,#f2c230)!important}`;
 const s0=document.createElement('style');s0.textContent=css;document.head.appendChild(s0);
 const T=()=>typeof H!=='undefined'&&H&&H.tut;
 const done=()=>{try{return localStorage.getItem(LS)==='1'}catch(e){return false}};
 const mark=()=>{try{localStorage.setItem(LS,'1')}catch(e){}};
 const ROM=['I','II','III'],K2=p=>p[0]+','+p[1];
 const DIRN=['wschód','płn.-wschód','płn.-zachód','zachód','płd.-zachód','płd.-wschód'];
 const dirTo=(a,b)=>D.findIndex(([x,y])=>a[0]+x===b[0]&&a[1]+y===b[1]);
 const St=(p)=>({t:'move',m:p.slice(),d:null});
 /* lekcje: me/foe – postać i pozycja; foePlan – plan przeciwnika; req – wymagane akcje gracza na fazy;
    check(wynik) – czy lekcja zaliczona; text – komunikaty */
 const L=[
  {title:'Poruszanie się',me:['Wiatrak',[0,1]],foe:['Długi',[-2,2]],foePlan:[St([-2,2]),St([-2,2])],
   intro:'Plansza to heksy. W każdej fazie możesz przejść o <b>1 pole</b> albo zostać.',
   req:[{t:'move',m:[1,0],tx:'przejdź na zaznaczone pole'},{t:'move',m:[1,0],tx:'zostań: dotknij <b>swojego</b> pola'}],
   check:R=>K2(R.me.pos)==='1,0',ok:'Stoisz na celu. Zostanie w miejscu to też ruch – zwykły wybór w każdej fazie.',bad:'Nie dotarłeś na zaznaczone pole.'},
  {title:'Dwie fazy',me:['Wiatrak',[0,1]],foe:['Długi',[-2,2]],foePlan:[St([-2,2]),St([-2,2])],
   intro:'Runda ma <b>dwie fazy</b>. Najpierw planujesz obie, a potem wszyscy wykonują fazę I, a następnie fazę II. Cel jest 2 pola dalej.',
   req:[{t:'move',m:[1,0],tx:'faza I: krok na zaznaczone pole'},{t:'move',m:[1,-1],tx:'faza II: drugi krok na cel'}],
   check:R=>K2(R.me.pos)==='1,-1',ok:'Dwa kroki w dwóch fazach. Zawsze planujesz całą rundę z góry.',bad:'Nie dotarłeś do celu.'},
  {title:'Atak i przewidywanie',key:true,me:['Ciotka',[0,0]],foe:['Długi',[1,0]],foePlan:[St([1,-1]),St([1,-1])],
   intro:'Najważniejsza lekcja! Ciotka atakuje linią 3 pól. Długi stoi obok – zaatakuj go tam, gdzie stoi <b>teraz</b>.',
   req:[{t:'atk',d:0,tx:'wybierz kierunek: pole z Długim'},{t:'move',m:[0,0],tx:'faza II: zostań na swoim polu'}],
   check:R=>R.foe.lost>0,ok:'',bad:'<b>PUDŁO!</b> Długi przesunął się w tej samej fazie. <b>Ruchy są rozpatrywane przed atakami</b> – atakujesz pole, nie postać.',
   retry:{intro:'Przeciwnik też planuje. Długi lubi uciekać na <b>płn.-wschód</b> (czerwone pole). Wyceluj tam, gdzie <b>będzie</b>.',
    req:[{t:'atk',d:1,tx:'wyceluj w pole, na które ucieknie Długi'},{t:'move',m:[0,0],tx:'faza II: zostań na swoim polu'}],ghost:[1,-1],
    check:R=>R.foe.lost>0,ok:'<b>Trafienie!</b> Przewidziałeś ruch przeciwnika. Myśl o tym, gdzie wróg <b>będzie</b> po ruchach, a nie gdzie stoi.',bad:'Znowu pudło – wyceluj w czerwone pole.'}},
  {title:'Kolizje i HP',me:['Wiatrak',[0,1]],foe:['Długi',[1,-1]],foePlan:[St([0,0]),St([0,0])],
   intro:'Długi idzie na środek. Wejdź tam też: gdy dwie postacie staną na jednym polu, jest <b>ścisk</b> – każda traci 1 HP.',
   req:[{t:'move',m:[0,0],tx:'wejdź na środek'},{t:'move',m:[0,1],tx:'faza II: wróć na swoje pole'}],
   check:R=>R.me.lost===1&&R.foe.lost===1,ok:'Ścisk: oboje −1 HP (czerwone kwadraciki pod portretem). Gdy HP spadnie do 0, postać odpada. Byku zamiast ścisku zadaje obrażenia skokiem!',bad:'Nie doszło do ścisku – wejdź na środek w fazie I.'},
  {title:'Kurcząca się strefa',round:7,me:['Wiatrak',[0,2]],foe:['Długi',[2,-2]],foePlan:[St([2,-2]),St([2,-2])],
   intro:'Z czasem plansza się kurczy. <b>Czerwone pola</b> to strefa: kto na nich skończy rundę, traci 1 HP. Wejdź do środka.',
   req:[{t:'move',m:[0,1],tx:'wejdź na bezpieczne pole'},{t:'move',m:[0,1],tx:'faza II: zostań w strefie'}],
   check:R=>R.me.lost===0&&R.foe.lost===1,ok:'Jesteś bezpieczny, a Długi został na czerwonym polu i stracił 1 HP. Strefa zmniejsza się w rundach 4, 7 i 10 (przy dwóch graczach od rundy 7).',bad:'Skończyłeś rundę poza strefą.'},
  {title:'Bonusy i umiejętności',me:['Byku',[0,1]],foe:['Długi',[1,0]],foePlan:[St([1,0]),St([1,0])],bon:{k:2},
   intro:'Każda postać ma coś specjalnego. <b>Byku skacze</b>: lądowanie na przeciwniku z 1 pola to 3 DMG. Masz też bonus <b>+1 DMG</b> – w trybie specjalnym zbierasz takie przedmioty z mapy.',
   req:[{t:'move',m:[1,0],tx:'skocz na Długiego'},{t:'move',m:[0,1],tx:'faza II: odskocz na swoje pole'}],
   check:R=>R.foe.lost>=4,ok:'Skok 3 DMG + bonus 1 = <b>4 DMG</b>! Inne postacie: Pasterz ma owcę, Sierżant drona, Truchel trujące kałuże, Żyleta strzał snajperski – zobacz „Zobacz akcje” przy wyborze postaci.',bad:'Nie trafiłeś skokiem – wyląduj na polu Długiego.'}];
 const S={i:0,retry:false,phase:'plan',res:null};
 function lesson(){const l=L[S.i];return S.retry&&l.retry?Object.assign({},l,l.retry):l}
 function setup(){const l=lesson();net.db=null;st.gm='classic';st.tm2='ffa';st.round=l.round||1;st.seed='tut';st.chOk=true;
  const mk=(ch,pos,extra)=>Object.assign({ch,start:pos.slice(),plans:{},posr:{},hp:MAXHP(ch),hpr:{},hpo:{},got:{},pts:{}},extra||{});
  const me=mk(l.me[0],l.me[1],l.bon?{bon:l.bon}:{}),foe=mk(l.foe[0],l.foe[1]);[me,foe].forEach(p=>{p.posr[st.round]=p.start.slice();p.hpr[st.round]=p.hp});
  H={n:2,cur:0,tgt:'plan',tut:true,p:[me,foe]};
  st.scr='plan';st.ch=me.ch;st.start=me.start.slice();st.plan=newPlan();st.ph=0;st.done=false;st.animKey=null;S.phase='intro';S.res=null;
  const ov=document.getElementById('selOv');if(ov)ov.remove();render();coach()}
 function start(){S.i=0;S.retry=false;setup()}
 function quit(fin){if(fin)mark();H=null;clear();const c=document.getElementById('tutCoach');if(c)c.remove();try{goMenu()}catch(_){st.scr='lobby';render()}}
 /* wskazówka: obwódka wokół przycisku albo pola planszy */
 function clear(){document.querySelectorAll('.tutRing').forEach(e=>e.remove())}
 function dodge(r){const c=document.getElementById('tutCoach');if(!c)return;c.style.top='';const cr=c.getBoundingClientRect();if(r.bottom<cr.top-4||r.top>cr.bottom+4)return;
  const below=r.bottom+40;if(below+cr.height<innerHeight*0.62)c.style.top=below+'px';else c.style.top=Math.max(8,r.top-cr.height-44)+'px'}
 function ring(el,cls,mark){if(!el)return;const r=el.getBoundingClientRect();if(r.width<2)return;const d=document.createElement('div');d.className='tutRing '+(cls||'');
  const pad=cls&&cls.includes('cell')?2:5,w=cls&&cls.includes('cell')?Math.min(r.width,r.height*1.25):r.width;
  d.style.left=(r.left+r.width/2-w/2-pad)+'px';d.style.top=(r.top-pad)+'px';d.style.width=(w+2*pad)+'px';d.style.height=(r.height+2*pad)+'px';d.innerHTML='<i>'+(mark||'▼')+'</i>';document.body.appendChild(d);}
 /* widoczny element (panel planowania przy zmianie fazy ma chwilowo dwie kopie przycisków) */
 const vis=sel=>{const all=[...document.querySelectorAll(sel)].filter(e=>{const r=e.getBoundingClientRect();return r.width>2&&r.left>=-4&&r.right<=innerWidth+4&&r.top>=-4&&r.bottom<=innerHeight+4});return all.pop()||null};
 const cellEl=p=>document.querySelector('#stage [data-k="'+K2(p)+'"] polygon.hexp')||document.querySelector('#stage [data-k="'+K2(p)+'"]');
 /* co gracz ma teraz zrobić */
 function want(){const l=lesson();if(S.phase!=='plan')return null;
  if(st.done)return {el:'[data-a="hnext"]',tx:'Plan gotowy. Dotknij <b>„Podsumowanie”</b> – runda zostanie rozpatrzona.'};
  const ph=st.ph,rq=l.req[ph],pl=st.plan[ph];if(!rq)return null;
  if(pl.t!==rq.t)return {el:'[data-t="'+rq.t+'"]',tx:'Faza '+ROM[ph]+': dotknij <b>„'+(rq.t==='move'?(st.ch==='Byku'?'Skok':'Ruch'):(st.ch==='Byku'?'Szarża':'Atak'))+'”</b>.'};
  const from=fromPos(ph);
  if(rq.t==='move'&&(!pl.m||K2(pl.m)!==K2(rq.m)))return {cell:rq.m,tx:'Faza '+ROM[ph]+': '+rq.tx+'.'+(pl.m?' <i>(to nie to pole)</i>':'')};
  if(rq.t==='atk'&&pl.d!==rq.d)return {cell:[from[0]+D[rq.d][0],from[1]+D[rq.d][1]],tx:'Faza '+ROM[ph]+': '+rq.tx+' ('+DIRN[rq.d]+').'+(pl.d!==null&&pl.d!==undefined?' <i>(inny kierunek)</i>':'')};
  return {el:'[data-a="ok"]',tx:'Dobrze! Dotknij <b>„Zatwierdź fazę '+ROM[ph]+'”</b>.'}}
 function coach(){if(!T())return;let c=document.getElementById('tutCoach');if(!c){c=document.createElement('div');c.id='tutCoach';document.body.appendChild(c)}
  const l=lesson(),w=want();clear();
  const head='<div class="tt">'+(l.key?'★ ':'')+'Lekcja '+(S.i+1)+': '+l.title+'<span>'+(S.i+1)+' / '+L.length+'</span></div>',skip='<button class="tskip" data-tut="skip">Pomiń samouczek</button>';let h;
  /* karta na środku tylko przed lekcją – plansza nic jeszcze nie pokazuje */
  if(S.phase==='intro'){c.className='card';h=head+'<div class="tm">'+l.intro+'</div>'+(l.ghost?'<div class="why">Czerwone pole z „?” pokazuje, dokąd ruszy się przeciwnik.</div>':'')+'<div class="tb">'+skip+'<button class="tgo" data-tut="go">Zaczynamy →</button></div>'}
  /* w trakcie planowania i animacji: wąski pasek u góry, plansza zostaje odsłonięta */
  else if(S.phase==='plan'){c.className='bar';h=head+'<div class="tm">'+(w?w.tx:'')+'</div><div class="tb">'+skip.replace('Pomiń samouczek','Pomiń')+'</div>'}
  else if(S.phase==='anim'||S.phase==='wait'||S.phase==='eval'){c.className='bar';h=head+'<div class="tm">Patrz na planszę: najpierw ruchy, potem ataki…</div><div class="tb">'+skip.replace('Pomiń samouczek','Pomiń')+'</div>'}
  /* wynik: panel u dołu, w miejscu panelu planowania */
  else{const ok=S.res&&S.res.ok;c.className='sheet '+(ok?'ok':'bad');h=head+'<div class="tm">'+(ok?(l.ok||'Zaliczone!'):l.bad)+'</div>'+(S.res&&S.res.why?'<div class="why">'+S.res.why+'</div>':'')+
   '<div class="tb">'+skip+(ok?'':'<button data-tut="again">↺ Jeszcze raz</button>')+'<button class="tgo" data-tut="'+(ok||l.retry&&!S.retry?'next':'again')+'">'+(ok?(S.i===L.length-1?'Koniec samouczka':'Dalej →'):(l.retry&&!S.retry?'Spróbuj inaczej →':'↺ Jeszcze raz'))+'</button></div>'}
  c.innerHTML=h;
  /* wskazówki na ekranie */
  requestAnimationFrame(()=>{if(!T())return;clear();if(S.phase!=='plan')return;
   if(l.ghost&&!st.done)ring(cellEl(l.ghost),'cell ghost','?');
   if(w&&w.el)ring(vis(w.el));else if(w&&w.cell)ring(cellEl(w.cell),'cell')});
  clearTimeout(coach._t);coach._t=setTimeout(()=>{if(T()&&S.phase==='plan'){clear();const w2=want(),l2=lesson();if(l2.ghost&&!st.done)ring(cellEl(l2.ghost),'cell ghost','?');if(w2&&w2.el)ring(vis(w2.el));else if(w2&&w2.cell)ring(cellEl(w2.cell),'cell')}},450)}
 /* rozpatrzenie lekcji */
 function evaluate(){const l=lesson(),r=st.round;const R=resolve(H.p.map((q,i)=>({id:'p'+i,q,idx:i})));
  const me=R.p0,foe=R.p1,res={me:{pos:me.pos,lost:H.p[0].hpr[r]-me.eff},foe:{pos:foe.pos,lost:H.p[1].hpr[r]-foe.eff}};
  const ok=!!l.check(res);const nm=id=>id==='p0'?H.p[0].ch+' (Ty)':H.p[1].ch;
  const J=(R._journal||[]).filter(e=>['dmg','skok','skok daleki','skok w miejscu','ruch','eliminacja'].includes(e.k)).slice(0,5).map(e=>Combat.explain(e,nm));
  S.res={ok,why:J.length?'<b>Dziennik rundy:</b><br>'+J.map(hfEsc).join('<br>'):(ok?'':'Nikt nie stracił HP.')};S.phase='result';coach()}
 /* przechwycenie przycisków rundy w samouczku */
 window.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-tut],[data-tutstart]');
  if(t){e.preventDefault();e.stopImmediatePropagation();try{SND.play('click')}catch(_){}
   if(t.dataset.tutstart){start();return}
   const v=t.dataset.tut;
   if(v==='skip'){quit(true);return}
   if(v==='go'){S.phase='plan';coach();return}
   if(v==='again'){setup();return}
   if(v==='next'){const l=L[S.i];if(S.res&&!S.res.ok&&l.retry&&!S.retry){S.retry=true;setup();return}if(S.i>=L.length-1){quit(true);return}S.i++;S.retry=false;setup();return}
   return}
  if(!T())return;const a=e.target.closest&&e.target.closest('[data-a="hnext"],[data-a="hnextr"]');if(!a)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(a.dataset.a==='hnext'){if(st.animating)return;const l=lesson(),me=H.p[0],foe=H.p[1];
   /* plan musi być zgodny z zadaniem lekcji */
   const bad=l.req.findIndex((rq,ph)=>{const pl=st.plan[ph];return !pl||pl.t!==rq.t||(rq.t==='move'&&K2(pl.m||[9,9])!==K2(rq.m))||(rq.t==='atk'&&pl.d!==rq.d)});
   if(bad>=0){st.done=false;st.ph=bad;render();coach();return}
   me.plans[st.round]=JSON.parse(JSON.stringify(st.plan));foe.plans[st.round]=JSON.parse(JSON.stringify(l.foePlan));
   S.phase='anim';st.scr='hrev';render();coach();return}
  /* „Następna runda” w samouczku nie występuje – po animacji pokazujemy wynik lekcji */},true);
 /* po animacji rundy: ocena lekcji */
 setInterval(()=>{if(!T())return;if(S.phase==='anim'&&st.scr==='hrev'&&!st.animating&&st.animKey){S.phase='wait';S.w0=Date.now();S.sum=false;coach()}if(S.phase==='wait'&&document.getElementById('rsum'))S.sum=true;
  /* wynik lekcji dopiero po zamknięciu karty podsumowania rundy (albo gdy się nie pojawiła) */
  if(S.phase==='wait'&&!st.animating&&!document.getElementById('rsum')&&(S.sum||Date.now()-S.w0>1500)){S.phase='eval';setTimeout(()=>{if(T()&&S.phase==='eval')evaluate()},300)}},250);
 addRender('modes/tutorial',_r=>function(){_r.apply(this,arguments);try{
  if(T()){if(S.phase!=='result')coach();else if(S.phase==='result'){clear()}
   /* przycisk „Następna runda” chowamy – dalej prowadzi trener */
   document.querySelectorAll('[data-a="hnextr"]').forEach(b=>b.style.display='none')}
  else{const c=document.getElementById('tutCoach');if(c)c.remove();clear()}
  /* przycisk w menu głównym */
  if(st.scr==='lobby'&&!st.gm&&typeof app!=='undefined'&&!app.querySelector('[data-tutstart]')){const ref=app.querySelector('.mbmain')||[...app.querySelectorAll('[data-mode]')].pop();
   if(ref)ref.insertAdjacentHTML('afterend','<button class="mbtn mtbtn tutb" data-tutstart="1"><b>Samouczek'+(done()?'':' · NOWE')+'</b><small>6 krótkich lekcji na planszy: ruch, fazy, atak, kolizje, strefa, umiejętności. Ok. 3 minuty.</small></button>')}
 }catch(e){console.warn('samouczek',e)}});
 window.addEventListener('resize',()=>{if(T())coach()});
 render();
})();
