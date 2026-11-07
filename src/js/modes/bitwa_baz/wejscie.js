/* --- Bitwa baz, część: wejscie – wejście z menu Testy. Części są fragmentami jednego domknięcia MB i muszą być sklejane w kolejności z manifestu. --- */
/* wejście w trybie Testy: ekran wyboru rodzaju walki */
addRender('modes/bitwa_baz',_rMB=>function(){_rMB();try{if(st.scr==='lobby'&&st.gm==='test'&&!st.tm2){const last=[...app.querySelectorAll('[data-tm]')].pop();if(last&&!app.querySelector('[data-mbopen]'))last.insertAdjacentHTML('afterend','<button class="mbtn tbmode" data-mbopen="1"><b>Bitwa baz</b><small>Drużyny 1v1, 2v2 lub 3v3. Odkrywanie mapy, krzaki, stworki, przedmioty, poziomy postaci. Cel: zniszczyć wrogą bazę.</small></button>')}}catch(e){}});
addClick('modes/bitwa_baz',window,e=>{const t=e.target.closest&&e.target.closest('[data-mbopen]');if(!t)return;e.preventDefault();e.stopImmediatePropagation();try{SND.play('click')}catch(_){}MB.open()},true);
const _goMenuMB=goMenu;
goMenu=function(){try{MB.close()}catch(e){}_goMenuMB()};
render();
