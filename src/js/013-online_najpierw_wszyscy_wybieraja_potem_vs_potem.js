/* ===================== online: najpierw wszyscy wybierają, potem VS, potem rozstawienie ===================== */
function netPlayers(){return Object.entries(net.pl||{}).sort((a,b)=>a[0]<b[0]?-1:1).map(([id,p])=>({id,q:id===net.uid?ME:p}))}
function allPicked(){const ps=netPlayers();if(ps.length<2||!ps.every(o=>o.q.chready||o.q.sready))return false;
 if(isTeam())return ps.length===4&&ps.filter(o=>o.q.tm==='A').length===2&&ps.filter(o=>o.q.tm==='B').length===2;return true}
function taken(n){if(H)return H.p.some((p,i)=>i!==H.cur&&p.ch===n);return !!net.db&&Object.entries(net.pl).some(([id,p])=>id!==net.uid&&p.ch===n&&(p.chready||p.sready))}
function teamCount(t){if(H)return H.p.filter((p,i)=>i!==H.cur&&p.tm===t).length;return Object.entries(net.pl||{}).filter(([id,p])=>id!==net.uid&&(p.chready||p.sready)&&p.tm===t).length}
function vsH(){
 let ps;if(H)ps=H.p.map((q,i)=>({q,i}));else ps=netPlayers().map((o,i)=>({q:o.q,i,me:o.id===net.uid}));
 let L,Rr;if(isTeam()){L=ps.filter(o=>o.q.tm==='A');Rr=ps.filter(o=>o.q.tm==='B')}else{const k=Math.ceil(ps.length/2);L=ps.slice(0,k);Rr=ps.slice(k)}
 const fx=(o,j)=>{const tc=isTeam()&&o.q.tm?TCOL[o.q.tm]:'',bg=(typeof BGART!=='undefined')&&BGART[o.q.ch];return '<div class="fx" style="--c:'+C[o.q.ch].col+(tc?';--tc:'+tc:'')+';animation-delay:'+(j*.12)+'s">'+(bg?'<img class="cov" style="object-position:'+((typeof BGPOS!=='undefined'&&BGPOS[o.q.ch])||'42% 22%')+'" src="'+bg+'" alt="">':'<img src="'+ART[o.q.ch]+'" alt="">')+'<span class="pl">'+(o.me?'TY':'GRACZ '+(o.i+1))+(isTeam()?' · '+o.q.tm:'')+'</span><div class="nm">'+o.q.ch.toUpperCase()+'</div></div>'};
 return '<div class="selbg" style="--c:#ff7a00"></div><div class="seltop"><span class="seltitle">'+(isTeam()?'DRUŻYNA A KONTRA DRUŻYNA B':'WSZYSCY NA WSZYSTKICH')+'</span></div><div class="vsrow"><div class="side left">'+L.map(fx).join('')+'</div><div class="side right">'+Rr.map(fx).join('')+'</div><div class="vsmark">VS</div><div class="flash"></div></div><button class="selgo" data-a="vsgo">ROZSTAWIENIE</button>'}
function cwaitH(){
 const ps=netPlayers(),need=isTeam()?4:2;
 let rows=ps.map(o=>{const q=o.q,ok=q.chready||q.sready;return '<div class="cwrow'+(ok?' ok':'')+'" style="--c:'+(q.ch?C[q.ch].col:'#555')+'">'+(ok&&q.ch?'<img src="'+IMG[q.ch]+'" alt="">':'<div class="ph">?</div>')+'<b>'+(o.id===net.uid?'TY':'GRACZ')+(isTeam()&&q.tm?' · '+q.tm:'')+'</b><span>'+(ok&&q.ch?'✓ '+q.ch:'wybiera…')+'</span></div>'}).join('');
 for(let i=ps.length;i<need;i++)rows+='<div class="cwrow"><div class="ph">?</div><b>WOLNE MIEJSCE</b><span>czekamy</span></div>';
 return '<div class="selbg" style="--c:#3e8ef7"></div><div class="seltop"><span class="seltitle">CZEKAMY NA GRACZY</span></div><div class="cwlist">'+rows+'</div><p class="cwinfo">Kod pokoju: <b style="font-size:20px;letter-spacing:2px">'+net.code+'</b><br>Rozstawienie zacznie się, gdy wszyscy wybiorą postacie.</p><button class="selsec" data-a="cback">← Zmień postać</button>'}
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
window.addEventListener('click',function(e){
 if(H||!net.db)return;
 const t=e.target.closest&&e.target.closest('[data-a="chok"],[data-a="vsgo"],[data-a="cback"]');if(!t)return;
 const a=t.dataset.a;e.stopImmediatePropagation();
 if(a==='chok'){if(st.chOk||st.cwait||!st.ch||taken(st.ch))return;if(isTeam()&&(!st.team||teamCount(st.team)>=2))return;
  ME.ch=st.ch;if(isTeam())ME.tm=st.team;ME.chready=true;save();st.cwait=true;render();return}
 if(a==='cback'){ME.chready=false;save();st.cwait=false;render();return}
 if(a==='vsgo'){st.cwait=false;st.chOk=true;st.ch=ME.ch;st.team=ME.tm||null;st.start=null;render();return}},true);
render();
