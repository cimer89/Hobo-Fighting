/* ===================== Testy balansu: zapis partii, statystyki deweloperskie, CSV, propozycje ===================== */
/* Zapis: każda partia trybu klasycznego, specjalnego i Testów (na jednym telefonie i online, bez treningu i samouczka)
   trafia do pamięci przeglądarki (localStorage 'hf_balance_v1', ostatnie 1000 partii) – tylko na tym urządzeniu.
   Nic tu nie zmienia zasad gry: propozycje zmian są tylko tekstem do decyzji. */
const BalanceLog=(function(){
 const KEY='hf_balance_v1',MAX=1000,MIN_N=30;
 const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []}};
 const store=a=>{try{localStorage.setItem(KEY,JSON.stringify(a.slice(-MAX)))}catch(e){}};
 let mem=null;const all=()=>mem||(mem=load());
 const add=g=>{all().push(g);if(mem.length>MAX)mem=mem.slice(-MAX);store(mem)};
 const clear=src=>{mem=all().filter(g=>src&&g.src!==src);store(mem)};
 const ABIL={'skok':1,'skok daleki':1,'skok w miejscu':1,'teleport':1,'przywołanie owcy':1,'ruch owcy':1,'dron aktywny':1,'szarża':1,'szarża owcy':1,'kałuża':1,'unik':1};

 /* ---------- zapis prawdziwych partii (z ekranu wyników rundy) ---------- */
 let CUR=null;
 const recordable=()=>typeof st!=='undefined'&&['classic','special','test'].includes(st.gm)&&!(typeof H!=='undefined'&&H&&(H.train||H.tut));
 function gameKey(){return (typeof H!=='undefined'&&H)?'hot':'net:'+(net.code||'')}
 function finish(winners,draw){if(!CUR||CUR.done)return;CUR.done=true;
  const g={src:'gra',mode:CUR.mode,n:CUR.players.length,team:CUR.team,rounds:CUR.rounds.length,finished:true,draw:!!draw,ts:Date.now(),
   players:CUR.players.map(p=>({ch:p.ch,strat:null,team:p.team||null,dealt:p.dealt,taken:p.taken,attacks:p.attacks,hits:p.hits,abil:p.abil,elim:p.elim,win:winners.includes(p.id)}))};
  add(g)}
 function abandon(){if(CUR&&!CUR.done&&CUR.rounds.length){CUR.done=true;add({src:'gra',mode:CUR.mode,n:CUR.players.length,team:CUR.team,rounds:CUR.rounds.length,finished:false,draw:false,ts:Date.now(),
  players:CUR.players.map(p=>({ch:p.ch,strat:null,team:p.team||null,dealt:p.dealt,taken:p.taken,attacks:p.attacks,hits:p.hits,abil:p.abil,elim:p.elim,win:false}))})}}
 function onRound(items,Rs,over){if(!recordable()||!Rs)return;const r=st.round,key=gameKey();
  const ref=items[0]&&items[0].q;
  /* nowa partia: inny pokój / nowe obiekty graczy albo cofnięta runda */
  if(!CUR||CUR.key!==key||CUR.ref!==ref||r<CUR.last){abandon();CUR={key,ref,mode:st.gm,team:typeof isTeam==='function'&&isTeam(),last:0,rounds:[],done:false,
   players:items.map(o=>({id:o.id,ch:o.q.ch,team:o.q.tm||null,dealt:0,taken:0,attacks:0,hits:0,abil:{},elim:null}))}}
  if(CUR.done||CUR.rounds.includes(r))return;CUR.rounds.push(r);CUR.last=r;
  items.forEach(o=>{const x=Rs[o.id],p=CUR.players.find(z=>z.id===o.id);if(!x||!p)return;const h0=o.q.hpr&&o.q.hpr[r]!==undefined?o.q.hpr[r]:5;
   p.dealt+=(x.pts&&x.pts.d)||0;p.taken+=Math.max(0,h0-x.eff)});
  (Rs._ev||[]).forEach(e=>{const p=CUR.players.find(z=>z.id===e.id);if(!p)return;if(['atk','charge','scharge','drone'].includes(e.k)&&!e.none){p.attacks++;if(e.hit||e.target)p.hits++}if(e.k==='atk'&&e.snipe)p.abil['strzał snajperski']=(p.abil['strzał snajperski']||0)+1});
  (Rs._journal||[]).forEach(e=>{const p=CUR.players.find(z=>z.id===e.id);if(p&&ABIL[e.k])p.abil[e.k]=(p.abil[e.k]||0)+1;
   if(e.k==='przesunięcie'&&e.by){const q=CUR.players.find(z=>z.id===e.by);if(q)q.abil['manipulacja']=(q.abil['manipulacja']||0)+1}});
  items.forEach(o=>{const x=Rs[o.id],p=CUR.players.find(z=>z.id===o.id);if(!x||!p||p.elim)return;if(x.eff<=0){const last=(Rs._journal||[]).filter(e=>e.k==='dmg'&&e.id===o.id).pop();
   const by=last&&last.by?CUR.players.find(z=>z.id===last.by):null;p.elim={round:r,cause:last?last.cause:'?',by:by?by.ch:null}}});
  if(over){const surv=items.filter(o=>Rs[o.id]&&Rs[o.id].eff>0).map(o=>o.id);
   if(CUR.team){const t=surv.length?CUR.players.find(z=>z.id===surv[0]).team:null;finish(t?CUR.players.filter(z=>z.team===t).map(z=>z.id):[],!t)}
   else finish(surv.length===1?surv:[],surv.length!==1)}}

 /* ---------- statystyki ---------- */
 function wilson(k,n){if(!n)return [0,1];const z=1.96,p=k/n,d=1+z*z/n,c=(p+z*z/(2*n))/d,h=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d;return [Math.max(0,c-h),Math.min(1,c+h)]}
 function filter(f){return all().filter(g=>(!f.src||f.src==='all'||g.src===f.src)&&(!f.mode||f.mode==='all'||g.mode===f.mode)&&(!f.n||f.n==='all'||g.n===+f.n))}
 function perChar(games){const C={};
  games.forEach(g=>g.players.forEach(p=>{const c=C[p.ch]=C[p.ch]||{ch:p.ch,games:0,fin:0,wins:0,exp:0,dealt:0,taken:0,attacks:0,hits:0,abil:{},deaths:{},kills:0,rounds:0};
   c.games++;c.dealt+=p.dealt;c.taken+=p.taken;c.attacks+=p.attacks;c.hits+=p.hits;c.rounds+=g.rounds;
   for(const k in p.abil)c.abil[k]=(c.abil[k]||0)+p.abil[k];
   if(p.elim)c.deaths[p.elim.cause]=(c.deaths[p.elim.cause]||0)+1;
   if(g.finished){c.fin++;c.exp+=g.team?0.5:1/g.n;if(p.win)c.wins++}
   g.players.forEach(o=>{if(o.elim&&o.elim.by===p.ch&&o!==p)c.kills++})}));
  return Object.values(C).map(c=>Object.assign(c,{wr:c.fin?c.wins/c.fin:0,expWr:c.fin?c.exp/c.fin:0,ci:wilson(c.wins,c.fin),acc:c.attacks?c.hits/c.attacks:0}))}
 /* ---------- propozycje zmian (tylko tekst; nic nie jest zmieniane automatycznie) ---------- */
 const LEVERS={'Byku':{nerf:'skok o 1 pole / w miejscu 3 → 2 DMG albo szarża 2 → 1 DMG',buff:'dalszy skok 1 → 2 DMG albo szarża 2 → 3 DMG'},
  'Wiatrak':{nerf:'boki wachlarza 1 → 0 DMG (tylko środek 2)',buff:'+1 HP albo środek wachlarza 2 → 3 DMG'},
  'Długi':{nerf:'trzecie pole linii 2 → 1 DMG',buff:'pierwsze pole linii 1 → 2 DMG'},
  'Żyleta':{nerf:'zasięg strzału 9 → 5 pól albo 2 → 1 DMG od 3. pola',buff:'+1 HP albo strzał snajperski 3 → 4 DMG'},
  'Ciotka':{nerf:'faza I 2 → 1 DMG',buff:'faza II 1 → 2 DMG'},
  'Pasterz':{nerf:'szarża owcy zatrzymuje się na pierwszej postaci także w Testach',buff:'szarża owcy 1 → 2 DMG w trybie klasycznym'},
  'Truchel':{nerf:'kałuża działa 1 rundę zamiast 2',buff:'trucizna 1 → 2 DMG'},
  'Sierżant Przemo':{nerf:'dron 1 → 0 DMG przy remisie celów (losowanie usunięte)',buff:'+1 HP albo pistolet 1 → 2 DMG na 1–2 pola'}};
 function proposals(rows,src){const out=[];
  rows.forEach(c=>{const lv=LEVERS[c.ch]||{};const pct=x=>Math.round(x*100)+'%';
   if(c.fin<MIN_N){out.push({ch:c.ch,lvl:'brak',txt:c.ch+': za mało zakończonych partii ('+c.fin+' z wymaganych '+MIN_N+'). Bez propozycji.'});return}
   const [lo,hi]=c.ci,e=c.expWr,conf=c.fin>=200?'mocna':c.fin>=100?'umiarkowana':'wstępna';
   if(lo>e*1.1)out.push({ch:c.ch,lvl:conf,dir:'za silna',txt:c.ch+' wygrywa '+pct(c.wr)+' partii (oczekiwane '+pct(e)+', 95% przedział '+pct(lo)+'–'+pct(hi)+', n='+c.fin+'). Pewność: '+conf+'. Do rozważenia osłabienie: '+(lv.nerf||'–')+'.'});
   else if(hi<e*0.9)out.push({ch:c.ch,lvl:conf,dir:'za słaba',txt:c.ch+' wygrywa tylko '+pct(c.wr)+' partii (oczekiwane '+pct(e)+', 95% przedział '+pct(lo)+'–'+pct(hi)+', n='+c.fin+'). Pewność: '+conf+'. Do rozważenia wzmocnienie: '+(lv.buff||'–')+'.'});
   else out.push({ch:c.ch,lvl:conf,dir:'ok',txt:c.ch+': '+pct(c.wr)+' (oczekiwane '+pct(e)+', n='+c.fin+') – w granicach błędu, bez zmian.'})});
  if(src==='bot')out.push({lvl:'uwaga',txt:'Dane z symulacji botów: boty grają według prostych reguł, więc wyniki pokazują raczej siłę „mechaniczną” postaci niż to, jak grają ludzie. Przed zmianą warto porównać z prawdziwymi partiami.'});
  return out}
 /* ---------- CSV ---------- */
 const esc=v=>{v=v===null||v===undefined?'':String(v);return /[;"\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
 function csvPlayers(games){const h=['partia','zrodlo','data','tryb','graczy','druzyny','rundy','zakonczona','remis','postac','strategia','druzyna','wygrana','zadane','otrzymane','ataki','trafienia','skutecznosc','umiejetnosci','eliminacja_runda','eliminacja_przyczyna','eliminacja_sprawca'];
  const rows=[h.join(';')];games.forEach((g,i)=>g.players.forEach(p=>rows.push([i+1,g.src,new Date(g.ts).toISOString(),g.mode,g.n,g.team?1:0,g.rounds,g.finished?1:0,g.draw?1:0,p.ch,p.strat||'',p.team||'',p.win?1:0,p.dealt,p.taken,p.attacks,p.hits,p.attacks?(p.hits/p.attacks).toFixed(3):'',
   Object.entries(p.abil||{}).map(([k,v])=>k+':'+v).join(' '),p.elim?p.elim.round:'',p.elim?p.elim.cause:'',p.elim?p.elim.by||'':''].map(esc).join(';'))));return rows.join('\n')}
 function csvChars(rows){const h=['postac','partie','zakonczone','wygrane','procent_wygranych','oczekiwany_procent','ci_dol','ci_gora','zadane_na_partie','otrzymane_na_partie','skutecznosc_atakow','eliminacje_na_partie','umiejetnosci_na_partie'];
  return [h.join(';')].concat(rows.map(c=>[c.ch,c.games,c.fin,c.wins,(c.wr*100).toFixed(1),(c.expWr*100).toFixed(1),(c.ci[0]*100).toFixed(1),(c.ci[1]*100).toFixed(1),(c.dealt/c.games).toFixed(2),(c.taken/c.games).toFixed(2),(c.attacks?(c.acc*100).toFixed(1):''),(c.kills/c.games).toFixed(2),
   Object.entries(c.abil).map(([k,v])=>k+':'+(v/c.games).toFixed(2)).join(' ')].map(esc).join(';'))).join('\n')}
 return {onRound,abandon,all,add,clear,filter,perChar,proposals,csvPlayers,csvChars,wilson,MIN_N}})();
if(typeof module!=='undefined')module.exports=BalanceLog;

/* ---------- podpięcie zapisu i ekran statystyk (tylko w przeglądarce) ---------- */
(function(){if(typeof window==='undefined'||typeof revCore==='undefined')return;
 const _rc=revCore;revCore=function(items){const v=_rc.apply(this,arguments);try{if(v&&!v.pend)BalanceLog.onRound(items,v.Rs,v.over)}catch(e){console.warn('balans',e)}return v};
 const css=`#devSt{position:fixed;inset:0;z-index:9800;background:#15110c;color:#f3e9d6;overflow:auto;font:500 13px/1.4 system-ui;padding:calc(max(10px,env(safe-area-inset-top))) 10px 30px}
#devSt h2{margin:0 0 6px;font:400 26px Bangers,Impact,sans-serif;letter-spacing:1px;color:#ffd84a}
#devSt h3{margin:14px 0 6px;font:800 14px system-ui;color:#ffd84a}
#devSt .top{display:flex;gap:6px;align-items:center;flex-wrap:wrap}#devSt .top .x{margin-left:auto}
#devSt button,#devSt select,#devSt input{font:700 12.5px system-ui;border-radius:9px;padding:6px 10px;min-height:32px;border:1.5px solid #6b5236;background:#2a2017;color:#f3e9d6}
#devSt button.p{background:#ffd84a;color:#2a180b;border-color:#2a180b}
#devSt .f{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
#devSt .tw{overflow-x:auto;border:1px solid #3a2e22;border-radius:10px}
#devSt table{border-collapse:collapse;width:100%;min-width:640px}#devSt th,#devSt td{padding:5px 7px;border-bottom:1px solid #2d241b;text-align:right;white-space:nowrap}
#devSt th{position:sticky;top:0;background:#241b13;color:#d9c7a6;font-weight:700}#devSt td:first-child,#devSt th:first-child{text-align:left}
#devSt .bar{display:inline-block;height:8px;border-radius:4px;background:#4fc183;vertical-align:middle;margin-right:5px}
#devSt .hi{color:#ff8a7a}#devSt .lo{color:#7fc4ff}#devSt .mute{color:#a8957a}
#devSt .prop{padding:7px 9px;border-radius:9px;margin:5px 0;background:#241b13;border-left:4px solid #6b5236}
#devSt .prop.za-silna{border-color:#ff5a4f}#devSt .prop.za-slaba{border-color:#3e8ef7}#devSt .prop.ok{border-color:#4fc183}
#devSt .note{color:#a8957a;font-size:12px;margin-top:4px}
#devSt .prog{height:6px;background:#2d241b;border-radius:3px;overflow:hidden;margin-top:6px}#devSt .prog i{display:block;height:100%;background:#ffd84a;width:0}`;
 const s0=document.createElement('style');s0.textContent=css;document.head.appendChild(s0);
 const F={src:'all',mode:'all',n:'all'};let simRun=false;
 const pct=x=>(x*100).toFixed(0)+'%';
 function view(){let el=document.getElementById('devSt');if(!el){el=document.createElement('div');el.id='devSt';document.body.appendChild(el)}
  const games=BalanceLog.filter(F),rows=BalanceLog.perChar(games).sort((a,b)=>b.wr-a.wr),fin=games.filter(g=>g.finished);
  const opt=(k,vals,labels)=>'<select data-dvf="'+k+'">'+vals.map((v,i)=>'<option value="'+v+'"'+(String(F[k])===String(v)?' selected':'')+'>'+labels[i]+'</option>').join('')+'</select>';
  const avgR=games.length?(games.reduce((a,g)=>a+g.rounds,0)/games.length).toFixed(1):'–';
  let h='<div class="top"><h2>Statystyki balansu</h2><button class="x" data-dv="close">✕ Zamknij</button></div>'
   +'<div class="note">Narzędzie deweloperskie. Partie zapisują się tylko na tym urządzeniu. Zasady gry nie są tu zmieniane.</div>'
   +'<div class="f">'+opt('src',['all','gra','bot'],['Wszystkie źródła','Prawdziwe partie','Symulacje botów'])+opt('mode',['all','classic','special','test'],['Wszystkie tryby','Klasyczny','Specjalny','Testy'])+opt('n','all,2,3,4,5,6'.split(','),['Dowolna liczba graczy','2 graczy','3 graczy','4 graczy','5 graczy','6 graczy'])+'</div>'
   +'<div>Partie: <b>'+games.length+'</b> (zakończone: '+fin.length+', remisy: '+fin.filter(g=>g.draw).length+', przerwane: '+(games.length-fin.length)+') · średnio rund: <b>'+avgR+'</b></div>';
  h+='<h3>Postacie</h3>'+(rows.length?'<div class="tw"><table><tr><th>Postać</th><th>Partie</th><th>Wygrane</th><th>Oczek.</th><th>95% przedział</th><th>Zadane/partię</th><th>Otrzymane/partię</th><th>Skuteczność ataków</th><th>Eliminacje/partię</th><th>Umiejętności/partię</th><th>Jak odpadała</th></tr>'
   +rows.map(c=>{const hl=c.fin>=BalanceLog.MIN_N?(c.ci[0]>c.expWr*1.1?'hi':c.ci[1]<c.expWr*0.9?'lo':''):'mute';const ab=Object.entries(c.abil).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v])=>k+' '+(v/c.games).toFixed(1)).join(', ')||'–';
    const de=Object.entries(c.deaths).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([k,v])=>k+' '+v).join(', ')||'–';
    return '<tr><td><b>'+c.ch+'</b></td><td>'+c.games+'</td><td class="'+hl+'"><span class="bar" style="width:'+Math.round(c.wr*60)+'px"></span>'+pct(c.wr)+'</td><td>'+pct(c.expWr)+'</td><td>'+(c.fin?pct(c.ci[0])+'–'+pct(c.ci[1]):'–')+'</td><td>'+(c.dealt/c.games).toFixed(1)+'</td><td>'+(c.taken/c.games).toFixed(1)+'</td><td>'+(c.attacks?pct(c.acc)+' <span class="mute">('+c.hits+'/'+c.attacks+')</span>':'–')+'</td><td>'+(c.kills/c.games).toFixed(2)+'</td><td style="text-align:left">'+ab+'</td><td style="text-align:left">'+de+'</td></tr>'}).join('')
   +'</table></div><div class="note">Czerwony: wygrywa wyraźnie częściej niż oczekiwano, niebieski: wyraźnie rzadziej (95% przedział nie obejmuje oczekiwanej wartości ±10%). Szary: mniej niż '+BalanceLog.MIN_N+' zakończonych partii. Skuteczność Byka liczy szarże; skoki są w umiejętnościach.</div>':'<div class="note">Brak partii dla wybranych filtrów. Zagraj albo uruchom symulację poniżej.</div>');
  const props=BalanceLog.proposals(rows,F.src);
  h+='<h3>Propozycje zmian balansu</h3><div class="note">Tylko propozycje do Twojej decyzji – gra nie zmienia niczego sama.</div>'+(props.length?props.map(p=>'<div class="prop '+(p.dir==='za silna'?'za-silna':p.dir==='za słaba'?'za-slaba':p.dir==='ok'?'ok':'')+'">'+hfEsc(p.txt)+'</div>').join(''):'<div class="note">Brak danych.</div>');
  h+='<h3>Symulacje walk botów</h3><div class="f"><select data-dvs="mode"><option value="classic">Klasyczny</option><option value="test">Testy</option></select>'
   +'<select data-dvs="players">'+[2,3,4,5,6].map(n=>'<option value="'+n+'">'+n+' graczy</option>').join('')+'</select>'
   +'<select data-dvs="strat"><option value="mieszane">Strategie mieszane</option>'+Bots.STRATS.map(s=>'<option value="'+s+'">Wszyscy: '+s+'</option>').join('')+'</select>'
   +'<select data-dvs="games"><option>100</option><option selected>300</option><option>1000</option></select><button class="p" data-dv="sim">▶ Symuluj</button></div>'
   +'<div class="note">Boty: agresywny (atakuje tam, gdzie wróg stoi), przewidujący (celuje tam, gdzie wróg może przejść), ostrożny (dystans i strefa), losowy. Składy losowane bez powtórzeń postaci. Tryb specjalny nie jest symulowany (przedmioty i bonusy).</div><div class="prog"><i id="dvProg"></i></div>';
  h+='<h3>Eksport i dane</h3><div class="f"><button data-dv="csvp">⬇ CSV: gracze w partiach</button><button data-dv="csvc">⬇ CSV: podsumowanie postaci</button><button data-dv="clrb">Usuń symulacje</button><button data-dv="clrg">Usuń prawdziwe partie</button></div><div class="note">Eksport uwzględnia bieżące filtry. Separator: średnik (Excel w polskiej wersji).</div>';
  el.innerHTML=h}
 function download(name,text){const blob=new Blob(['﻿'+text],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);
  try{navigator.clipboard&&navigator.clipboard.writeText(text).catch(()=>{})}catch(e){}}
 function simulate(){if(simRun)return;simRun=true;const el=document.getElementById('devSt');const g=k=>el.querySelector('[data-dvs="'+k+'"]').value;
  const opt={mode:g('mode'),players:+g('players'),strat:g('strat'),games:+g('games'),seed:Date.now()%1e9};let done=0;const CH=25,pr=document.getElementById('dvProg');
  const step=()=>{const k=Math.min(CH,opt.games-done);Bots.series(Object.assign({},opt,{games:k,seed:opt.seed+done})).forEach(BalanceLog.add);done+=k;if(pr)pr.style.width=(100*done/opt.games)+'%';
   if(done<opt.games)setTimeout(step,0);else{simRun=false;F.src='bot';F.mode=opt.mode;F.n=String(opt.players);view()}};step()}
 document.addEventListener('change',e=>{const t=e.target.closest&&e.target.closest('[data-dvf]');if(t){F[t.dataset.dvf]=t.value;view()}});
 window.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-dv],[data-devopen]');if(!t)return;e.preventDefault();e.stopImmediatePropagation();
  if(t.dataset.devopen){view();return}const v=t.dataset.dv;
  if(v==='close'){const el=document.getElementById('devSt');if(el)el.remove();return}
  if(v==='sim'){simulate();return}
  if(v==='csvp'){download('hobo_partie.csv',BalanceLog.csvPlayers(BalanceLog.filter(F)));return}
  if(v==='csvc'){download('hobo_postacie.csv',BalanceLog.csvChars(BalanceLog.perChar(BalanceLog.filter(F))));return}
  if(v==='clrb'){BalanceLog.clear('bot');view();return}
  if(v==='clrg'){BalanceLog.clear('gra');view();return}},true);
 /* przerwanie gry (powrót do menu) zapisuje partię jako przerwaną */
 const _gm=goMenu;goMenu=function(){try{BalanceLog.abandon()}catch(e){}return _gm.apply(this,arguments)};
 /* mały przycisk w menu głównym */
 const _r=render;render=function(){_r.apply(this,arguments);try{if(st.scr==='lobby'&&!st.gm&&!app.querySelector('[data-devopen]')){const ref=app.querySelector('[data-tutstart]')||app.querySelector('.mbmain');
   if(ref)ref.insertAdjacentHTML('afterend','<button class="mbtn" data-devopen="1" style="min-height:0;padding:6px 12px;opacity:.85"><b style="font-size:15px">🛠 Statystyki balansu</b><small>Dla twórców: wyniki partii, symulacje botów, eksport CSV.</small></button>')}}catch(e){}};
 render();
})();
