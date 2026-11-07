/* ===================== Online: ekrany oczekiwania ===================== */
/* --- z części: js/000-start.js --- */
function waitTxt(){if(H)return 'Plan zapisany.';if(!net.db)return 'Tryb solo.';const ps=Object.values(net.pl).filter(p=>alive(p,st.round)),n=ps.filter(p=>(p.plans&&p.plans[st.round])||(p.cm&&p.cm[st.round])).length;return 'Gotowych: '+n+' z '+ps.length+'. Kod pokoju: '+net.code}
/* --- z części: TRYBY WALKI: FREE FOR ALL / 2 VS 2 --- */
function waitH(){const ps=Object.entries(net.pl),nA=ps.filter(([,p])=>p.tm==='A').length,nB=ps.filter(([,p])=>p.tm==='B').length;
 const all=(isTeam()?ps.length===4&&nA===2&&nB===2:ps.length>1)&&ps.every(([,p])=>p.sready);
 return (net.err?'<div class="card">Nie udało się zapisać. Potrzebujesz prawa edycji w tym linku.</div>':'')+'<div class="card">'+ps.map(([id,p])=>'<div>'+(p.sready?'✓ ':'… ')+(p.nick?'<span class="prnick">'+hfEsc(p.nick)+'</span> · ':'')+(p.ch||'wybiera')+(isTeam()&&p.tm?' · '+TNAME[p.tm]:'')+(id===net.uid?' (Ty)':'')+'</div>').join('')+'</div>'
  +(all?board(tok(p=>p.posr&&p.posr[1]))+'<p style="text-align:center">Pozycje startowe ujawnione.</p><button class="go" data-a="goplan">Planuj fazę I</button>':'<p style="text-align:center">'+(isTeam()?'2 vs 2: potrzeba 4 graczy, po 2 w drużynie. ':'')+'Czekamy na pozostałych graczy. Kod pokoju: <b>'+net.code+'</b></p>')}
/* --- z części: online: najpierw wszyscy wybierają, potem VS, potem rozstawienie --- */
function cwaitH(){
 const ps=netPlayers(),need=isTeam()?4:2;
 let rows=ps.map(o=>{const q=o.q,ok=q.chready||q.sready;return '<div class="cwrow'+(ok?' ok':'')+'" style="--c:'+(q.ch?C[q.ch].col:'#555')+'">'+(ok&&q.ch?'<img src="'+IMG[q.ch]+'" alt="">':'<div class="ph">?</div>')+'<b>'+(q.nick?hfEsc(q.nick)+(o.id===net.uid?' (TY)':''):(o.id===net.uid?'TY':'GRACZ'))+(isTeam()&&q.tm?' · '+q.tm:'')+'</b><span>'+(ok&&q.ch?'✓ '+q.ch:'wybiera…')+'</span></div>'}).join('');
 for(let i=ps.length;i<need;i++)rows+='<div class="cwrow"><div class="ph">?</div><b>WOLNE MIEJSCE</b><span>czekamy</span></div>';
 return '<div class="selbg" style="--c:#3e8ef7"></div><div class="seltop"><span class="seltitle">CZEKAMY NA GRACZY</span></div><div class="cwlist">'+rows+'</div><p class="cwinfo">Kod pokoju: <b style="font-size:20px;letter-spacing:2px">'+net.code+'</b><br>Rozstawienie zacznie się, gdy wszyscy wybiorą postacie.</p><button class="selsec" data-a="cback">← Zmień postać</button>'}
