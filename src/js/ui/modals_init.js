const _r6=render;
render=function(){_r6();modalize()};
document.addEventListener('click',function(e){
 const t=e.target.closest('[data-a="mmin"],[data-a="mshow"],[data-a="mback"],[data-mapmode]');if(!t)return;
 const d=t.dataset;
 if(d.a==='mmin')st.modalMin=true;else if(d.a==='mshow')st.modalMin=false;else if(d.a==='mback'){st.pick=null;st.mapMode=false}else if(d.mapmode!==undefined)st.mapMode=true;
 e.stopImmediatePropagation();render()},true);
render();
