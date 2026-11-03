/* ===================== STYL: postacie, metal i skóra, wybór startu ===================== */
function charPickH(){
 const key='chpick:'+(H?H.cur:'o'),cls=st.lastPanel!==key?' pin':'';st.lastPanel=key;
 const ok=!!st.ch&&!taken(st.ch);
 let h='<div id="phpanel" class="pp'+cls+'">';
 if(H)h+='<p>Gracz '+(H.cur+1)+': wybierz postać</p>';
 h+='<div class="chrow">';
 Object.keys(C).forEach(n=>{h+='<button class="chcard'+(n===st.ch?' on':'')+'" data-ch="'+n+'" '+(taken(n)?'disabled':'')+' style="--c:'+C[n].col+'"><img src="'+CHA[n]+'" alt="'+n+'"></button>'});
 h+='</div>';
 h+='<div class="card" style="border-color:'+(st.ch?C[st.ch].col:'var(--ink)')+'">'+(st.ch?'<b>'+st.ch+'</b><p>'+C[st.ch].txt+'</p>':'<p>Dotknij postaci.</p>')+'</div>';
 h+='<button class="go" data-a="chok" '+(ok?'':'disabled')+'>Dalej: miejsce startu</button></div>';
 return h}
function startPanelH(){
 const c=C[st.ch],ok=!!st.start;
 return '<div class="pp" id="phpanel"><div class="card" style="display:flex;gap:8px;align-items:center;border-color:'+c.col+'"><img class="av" style="border-color:'+c.col+'" src="'+IMG[st.ch]+'" alt=""><div><b>'+st.ch+'</b><p>'+(ok?'Start: pole '+st.start.join(', '):'Dotknij pola na mapie, żeby wybrać start.')+'</p></div></div>'
  +'<div class="row"><button data-a="chback">← Zmień postać</button></div>'
  +'<button class="go" data-a="confirm" '+(ok?'':'disabled')+'>Zatwierdź start</button></div>'}
function styleScreens(){
 if(st.scr==='splash'){app.innerHTML=app.innerHTML.replace('<div class="press">Naciśnij żeby rozpocząć</div>','<button class="press" data-a="start">Naciśnij żeby rozpocząć</button>');return}
 if(st.scr==='pick'){app.innerHTML=st.chOk?startPanelH():charPickH()}}
const _baseRender2=render;
render=function(){_baseRender2();styleScreens()};

document.addEventListener('click',function(e){
 const t=e.target.closest('[data-a="chok"],[data-a="chback"],[data-a="hgo"],[data-a="confirm"],[data-a="solo"],[data-a="hot"],[data-a="create"],[data-a="joinb"],[data-a="back"]');if(!t)return;
 const a=t.dataset.a;
 if(a==='chok'){st.chOk=true;render();return}
 if(a==='chback'){st.chOk=false;render();return}
 st.chOk=false},true);

render();


function charPickH(){
 const key='chpick:'+(H?H.cur:'o'),cls=st.lastPanel!==key?' pin':'';st.lastPanel=key;
 const ok=!!st.ch&&!taken(st.ch);
 let h='<div id="phpanel" class="pp'+cls+'">';
 if(H)h+='<p>Gracz '+(H.cur+1)+': wybierz postać</p>';
 h+='<div class="chrow">';
 Object.keys(C).forEach(n=>{h+='<button class="chcard'+(n===st.ch?' on':'')+'" data-ch="'+n+'" '+(taken(n)?'disabled':'')+' style="--c:'+C[n].col+'"><img src="'+CHA[n]+'" alt="'+n+'"></button>'});
 h+='</div>';
 if(st.ch)h+='<div class="card chinfo" style="border-color:'+C[st.ch].col+'"><img class="art" src="'+ART[st.ch]+'" alt="'+st.ch+'"><div><b>'+st.ch+'</b><p>'+C[st.ch].txt+'</p></div></div>';
 else h+='<div class="card"><p>Dotknij postaci.</p></div>';
 h+='<button class="go" data-a="chok" '+(ok?'':'disabled')+'>Dalej: miejsce startu</button></div>';
 return h}
render();
const SPLURI='@@asset:img/spluri.jpg@@';
