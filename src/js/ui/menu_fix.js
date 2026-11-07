/* ===================== MENU: Bitwa baz w głównym menu + wszystko mieści się na małych telefonach ===================== */
(function(){
 const css=`main.full[data-lobby]{overflow-y:auto!important;-webkit-overflow-scrolling:touch;gap:8px!important;padding-bottom:calc(70px + env(safe-area-inset-bottom,0px))!important}
main.full[data-lobby]>*{flex-shrink:0}
main.full[data-lobby] h1{font-size:clamp(28px,8.5vh,46px)!important;margin:0!important}
main.full[data-lobby]>img{max-height:15vh!important;height:auto!important;width:auto;max-width:100%;align-self:center;object-fit:cover}
main.full[data-lobby] button.mbtn{min-height:0!important;padding:8px 14px!important}
main.full[data-lobby] button.mbtn b{font-size:clamp(20px,3.6vh,26px)!important;line-height:1.05}
main.full[data-lobby] button.mbtn small{font-size:11.5px!important;line-height:1.2!important}
main.full[data-lobby] .prrow button{min-height:40px!important}
main.full[data-lobby]>p{margin:0!important}
main.full[data-lobby]>.row{padding-left:54px}
@media (max-height:700px){main.full[data-lobby]>img{display:none!important}main.full[data-lobby] button.mbtn small{display:none}}
.mbtn.mbmain{background:linear-gradient(#e9f3ff,#b9d4f5)!important}`;
 const s0=document.createElement('style');s0.textContent=css;document.head.appendChild(s0);
 addRender('ui/menu_fix',_r=>function(){_r.apply(this,arguments);try{
  const lob=st.scr==='lobby';if(lob)app.setAttribute('data-lobby','1');else app.removeAttribute('data-lobby');
  if(lob&&!st.gm&&!app.querySelector('.mbmain')){const ms=app.querySelectorAll('[data-mode]'),last=ms[ms.length-1];
   if(last)last.insertAdjacentHTML('afterend','<button class="mbtn mbmain" data-mbopen="1"><b>Bitwa baz</b><small>Drużyny 1v1, 2v2, 3v3 – na jednym telefonie albo online. Odkrywanie mapy, stworki, poziomy. Zniszcz wrogą bazę.</small></button>')}
  if(lob&&st.gm==='test')app.querySelectorAll('[data-mbopen]:not(.mbmain)').forEach(e=>e.remove());
 }catch(e){}});
 render();
})();
/* kod pokoju Bitwy baz (zaczyna się od B) wpisany w zwykłe „Dołącz kodem” prowadzi do lobby Bitwy baz zamiast do zwykłej poczekalni */
addClick('ui/menu_fix',window,function(e){const t=e.target.closest&&e.target.closest('[data-a="joinb"]');if(!t)return;
 const el=document.getElementById('code'),v=((el&&el.value)||'').trim().toUpperCase();if(v.length!==4||v[0]!=='B')return;
 e.preventDefault();e.stopImmediatePropagation();try{SND.play('click')}catch(_){}
 const ob=document.querySelector('[data-mbopen]');if(ob)ob.click();else{try{MB.open()}catch(_){}}
 setTimeout(()=>{const c=document.querySelector('#mbcode'),j=document.querySelector('[data-mb="on:join"]');if(c&&j){c.value=v;j.click()}},120)},true);

