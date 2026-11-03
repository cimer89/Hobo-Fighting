/* ===================== STYL: postacie, metal i skóra, wybór startu ===================== */
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


render();
const SPLURI='@@asset:img/spluri.jpg@@';
