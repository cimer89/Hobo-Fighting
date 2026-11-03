/* ===================== NOWY INTERFEJS: górny pasek, panel planowania ===================== */
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
const _r9=render;render=function(){_r9();hudify()};
render();
