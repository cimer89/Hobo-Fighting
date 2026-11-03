/* ===================== ONLINE: poczekalnia → drużyny → wybór postaci po kolei (losowa kolejka) ===================== */
(function(){
 const css=`#selOv .drq{display:flex;flex-direction:column;gap:6px;margin:8px 14px;overflow:auto}
#selOv .drrow{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;background:rgba(0,0,0,.45);border:2px solid rgba(255,255,255,.12);color:#fff;font:700 14px system-ui}
#selOv .drrow.now{border-color:#ffd84a;box-shadow:0 0 0 3px rgba(255,216,74,.35);animation:drp 1s ease-in-out infinite}
@keyframes drp{50%{transform:scale(1.02)}}
#selOv .drrow .n{width:26px;height:26px;border-radius:50%;background:#ffd84a;color:#2a180b;display:flex;align-items:center;justify-content:center;font:900 14px system-ui;flex:none}
#selOv .drrow img{width:34px;height:34px;border-radius:50%;object-fit:cover;border:2px solid var(--c,#888)}
#selOv .drrow .ph{width:34px;height:34px;border-radius:50%;background:#333;display:flex;align-items:center;justify-content:center}
#selOv .drrow span{margin-left:auto;font-weight:600;opacity:.85;font-size:12px}
#selOv .drinfo{margin:6px 14px;color:#fff;text-align:center;font:600 14px system-ui}
#selOv .drteams{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 14px}
#selOv .drteams>div{border:3px solid var(--tc);border-radius:14px;padding:8px;background:rgba(0,0,0,.45);color:#fff;font:700 13px system-ui;min-height:110px}
#selOv .drteams b{display:block;color:var(--tc);margin-bottom:6px}
#selOv .drteams button{width:100%;margin-top:6px}
#selOv .drturn{position:absolute;left:50%;top:64px;transform:translateX(-50%);z-index:5;background:#ffd84a;color:#2a180b;font:400 20px Bangers,Impact,sans-serif;letter-spacing:1px;padding:4px 14px;border-radius:12px;border:2px solid #2a180b;white-space:nowrap}`;
 const s0=document.createElement('style');s0.textContent=css;document.head.appendChild(s0);
 const online=()=>!H&&!!net.db&&!!net.code;
 const isHost=()=>!!net._host;
 function lob(){if(isHost())return ME.lob||null;const h=Object.values(net.pl||{}).find(p=>p&&p.lob);return h?h.lob:null}
 const players=()=>netPlayers();
 const nm=(o,i)=>o.q.nick?hfEsc(o.q.nick):'Gracz '+(i+1);
 const picked=q=>!!(q.chready||q.sready);
 function curPicker(L){if(!L||L.ph!=='draft')return null;for(const id of L.order){const o=players().find(x=>x.id===id);if(o&&!picked(o.q))return id}return null}
 function need(){return isTeam()?4:2}
 function setLob(l){ME.lob=l;save();render()}
 function waitH(L){const ps=players(),host=isHost(),n=ps.length,ok=isTeam()?n===4:n>=2;
  const rows=ps.map((o,i)=>'<div class="drrow"><div class="ph">👤</div>'+nm(o,i)+(o.id===net.uid?' (Ty)':'')+(o.q.lob?'<span>założyciel</span>':'')+'</div>').join('');
  return '<div class="selbg" style="--c:#3e8ef7"></div><div class="seltop"><span class="seltitle">POCZEKALNIA</span></div>'
   +'<div class="drinfo">Kod pokoju: <b style="font-size:22px;letter-spacing:3px;color:#ffd84a">'+net.code+'</b><br>Graczy: '+n+(isTeam()?' / 4':' (2–6)')+'</div><div class="drq">'+rows+'</div>'
   +(host?'<button class="selgo" data-dr="go" '+(ok?'':'disabled')+'>'+(ok?(isTeam()?'WSZYSCY SĄ – DRUŻYNY':'WSZYSCY SĄ – LOSUJ KOLEJKĘ'):(isTeam()?'CZEKAMY NA 4 GRACZY':'CZEKAMY NA GRACZY'))+'</button>'
    :'<div class="drinfo">Czekamy, aż założyciel pokoju zacznie wybór.</div>')}
 function teamH(L){const ps=players(),host=isHost();
  const col=t=>'<div style="--tc:'+TCOL[t]+'"><b>'+TNAME[t]+' ('+ps.filter(o=>o.q.tm===t).length+'/2)</b>'+ps.map((o,i)=>[o,i]).filter(([o])=>o.q.tm===t).map(([o,i])=>'<div>'+nm(o,i)+(o.id===net.uid?' (Ty)':'')+'</div>').join('')
   +(ME.tm!==t?'<button data-dr="team:'+t+'" '+(ps.filter(o=>o.q.tm===t).length>=2?'disabled':'')+'>Dołącz</button>':'')+'</div>';
  const free=ps.map((o,i)=>[o,i]).filter(([o])=>!o.q.tm).map(([o,i])=>nm(o,i)).join(', ');
  const ok=ps.length===4&&['A','B'].every(t=>ps.filter(o=>o.q.tm===t).length===2);
  return '<div class="selbg" style="--c:#3e8ef7"></div><div class="seltop"><span class="seltitle">WYBÓR DRUŻYN</span></div><div class="drteams">'+col('A')+col('B')+'</div>'
   +(free?'<div class="drinfo">Bez drużyny: '+free+'</div>':'')
   +(host?'<button class="selgo" data-dr="draft" '+(ok?'':'disabled')+'>'+(ok?'LOSUJ KOLEJKĘ WYBORU':'CZEKAMY NA DRUŻYNY 2 + 2')+'</button>':'<div class="drinfo">'+(ok?'Czekamy, aż założyciel wylosuje kolejkę.':'Wybierz drużynę.')+'</div>')}
 function queueH(L){const ps=players(),cur=curPicker(L);
  const rows=L.order.map((id,k)=>{const i=ps.findIndex(o=>o.id===id),o=ps[i];if(!o)return '';const q=o.q,p=picked(q),tc=isTeam()&&q.tm?TCOL[q.tm]:'';
   return '<div class="drrow'+(id===cur?' now':'')+'" style="'+(tc?'border-color:'+tc:'')+'"><div class="n">'+(k+1)+'</div>'+(p&&q.ch?'<img src="'+IMG[q.ch]+'" style="--c:'+C[q.ch].col+'">':'<div class="ph">?</div>')+nm(o,i)+(id===net.uid?' (Ty)':'')+'<span>'+(p?'✓ '+q.ch:id===cur?'wybiera…':'czeka')+'</span></div>'}).join('');
  const co=ps.find(o=>o.id===cur),ci=ps.indexOf(co);
  return '<div class="selbg" style="--c:#f2c230"></div><div class="seltop"><span class="seltitle">KOLEJKA WYBORU</span></div>'
   +'<div class="drinfo">'+(co?'Teraz wybiera: <b style="color:#ffd84a">'+nm(co,ci)+'</b>':'Wszyscy wybrali.')+'</div><div class="drq">'+rows+'</div><div class="drinfo" style="opacity:.75">Kolejność została wylosowana. Gdy przyjdzie Twoja kolej, zobaczysz ekran wyboru postaci.</div>'}
 const _r=render;render=function(){
  let L=null,myTurn=false;
  if(online()&&st.scr==='pick'&&!st.chOk&&!ME.chready){L=lob();myTurn=!!(L&&L.ph==='draft'&&curPicker(L)===net.uid);if(myTurn&&isTeam()&&ME.tm)st.team=ME.tm;if(myTurn&&st.ch&&taken(st.ch))st.ch=Object.keys(C).find(n=>!taken(n)&&n!=='Manekin')||st.ch}
  _r.apply(this,arguments);
  try{if(!online()||st.scr!=='pick'||st.chOk)return;const ov=document.getElementById('selOv');if(!ov)return;
   if(ME.chready){const L2=lob();if(L2&&L2.ph==='draft'){ov.querySelectorAll('[data-a="cback"]').forEach(e=>e.remove());if(!allPicked()&&!ov.classList.contains('vs')){ov.className='';ov.innerHTML=queueH(L2)}}return}
   if(myTurn){ov.querySelectorAll('.selteam').forEach(e=>e.remove());if(!ov.querySelector('.drturn'))ov.insertAdjacentHTML('beforeend','<div class="drturn">TWOJA KOLEJ!</div>');return}
   ov.className='';
   if(!L||L.ph==='wait')ov.innerHTML=waitH(L);
   else if(L.ph==='team')ov.innerHTML=teamH(L);
   else if(L.order.includes(net.uid))ov.innerHTML=queueH(L);
   else ov.innerHTML='<div class="selbg" style="--c:#555"></div><div class="seltop"><span class="seltitle">POKÓJ '+net.code+'</span></div><div class="drinfo">Wybór postaci w tym pokoju już trwa. Załóż nowy pokój.</div>';
  }catch(e){console.warn('draft',e)}};
 window.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-dr]');if(!t)return;e.preventDefault();e.stopImmediatePropagation();try{SND.play('click')}catch(_){}
  const v=t.dataset.dr;
  if(v==='go'&&isHost()){if(isTeam())setLob({ph:'team'});else{const o=players().map(x=>x.id);for(let i=o.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[o[i],o[j]]=[o[j],o[i]]}setLob({ph:'draft',order:o})}return}
  if(v.startsWith('team:')){const tm=v.slice(5);if(players().filter(o=>o.id!==net.uid&&o.q.tm===tm).length>=2)return;ME.tm=tm;st.team=tm;save();render();return}
  if(v==='draft'&&isHost()){const o=players().map(x=>x.id);for(let i=o.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[o[i],o[j]]=[o[j],o[i]]}setLob({ph:'draft',order:o});return}},true);
 /* nowa gra online czyści stan poczekalni */
 const _j=join;join=function(){ME.lob=null;ME.tm=null;const r=_j.apply(this,arguments);if(net._host){ME.lob={ph:'wait'};save()}return r};
 render();
})();

