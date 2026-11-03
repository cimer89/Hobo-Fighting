/* ===================== TRYBY WALKI: FREE FOR ALL / 2 VS 2 ===================== */
const TCOL={A:'#e5484d',B:'#3e8ef7'},TNAME={A:'Drużyna A',B:'Drużyna B'};
function isTeam(){return st.tm2==='2v2'}
function teamOfCh(ch){if(!isTeam())return null;try{const o=curItems().find(o=>o.q.ch===ch);if(o&&o.q.tm)return o.q.tm}catch(e){}return ch===st.ch?st.team:null}
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
function waitH(){const ps=Object.entries(net.pl),nA=ps.filter(([,p])=>p.tm==='A').length,nB=ps.filter(([,p])=>p.tm==='B').length;
 const all=(isTeam()?ps.length===4&&nA===2&&nB===2:ps.length>1)&&ps.every(([,p])=>p.sready);
 return (net.err?'<div class="card">Nie udało się zapisać. Potrzebujesz prawa edycji w tym linku.</div>':'')+'<div class="card">'+ps.map(([id,p])=>'<div>'+(p.sready?'✓ ':'… ')+(p.nick?'<span class="prnick">'+hfEsc(p.nick)+'</span> · ':'')+(p.ch||'wybiera')+(isTeam()&&p.tm?' · '+TNAME[p.tm]:'')+(id===net.uid?' (Ty)':'')+'</div>').join('')+'</div>'
  +(all?board(tok(p=>p.posr&&p.posr[1]))+'<p style="text-align:center">Pozycje startowe ujawnione.</p><button class="go" data-a="goplan">Planuj fazę I</button>':'<p style="text-align:center">'+(isTeam()?'2 vs 2: potrzeba 4 graczy, po 2 w drużynie. ':'')+'Czekamy na pozostałych graczy. Kod pokoju: <b>'+net.code+'</b></p>')}

/* --- wynik i punktacja drużynowa --- */
function winTeam(items,Rs){const al=items.filter(o=>Rs[o.id]&&Rs[o.id].eff>0),ts=new Set(al.map(o=>o.q.tm));return ts.size===1?[...ts][0]:null}
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

/* --- podnoszenie przedmiotu --- */

/* --- pasek informacji z drużyną --- */

/* --- obsługa kliknięć (przed starszymi obsługami) --- */
window.addEventListener('click',function(e){
 const t=e.target.closest&&e.target.closest('[data-tm],[data-a="modeback"],[data-a="create"],[data-a="joinb"],[data-a="hgo"],[data-team],[data-a="confirm"],[data-a="chok"]');if(!t)return;
 const d=t.dataset;
 if(d.tm){st.tm2=d.tm;e.stopImmediatePropagation();render();return}
 if(d.a==='modeback'&&st.tm2){st.tm2=null;e.stopImmediatePropagation();render();return}
 if(d.a==='create'&&net.db){const L='ACDEFGHJKLMNPQRUVWXYZ',R='ABCDEFGHJKLMNPQRTUVWXYZ3456789',pk=s=>s[Math.floor(Math.random()*s.length)];
  const code=(st.gm==='special'?'S':st.gm==='test'?'T':pk(L))+(isTeam()?'2':pk(R))+pk(R)+pk(R);e.stopImmediatePropagation();st.team=null;join(code);return}
 if(d.a==='joinb'){const el=document.getElementById('code'),v=((el&&el.value)||'').trim().toUpperCase();if(v.length===4)st.tm2=v[1]==='2'?'2v2':'ffa';st.team=null;return}
 if(d.a==='hgo'){st.team=null;return}
 if(d.team){if(teamCount(d.team)<2)st.team=d.team;e.stopImmediatePropagation();render();return}
 if(d.a==='chok'&&isTeam()&&(!st.team||teamCount(st.team)>=2)){e.stopImmediatePropagation();render();return}
 if(d.a==='confirm'&&isTeam()){const q=H?H.p[H.cur]:ME;if(q)q.tm=st.team}},true);
render();
Object.assign(CHA,{"Pasterz": '', "Truchel": '', "Sierżant Przemo": ''});
render();
