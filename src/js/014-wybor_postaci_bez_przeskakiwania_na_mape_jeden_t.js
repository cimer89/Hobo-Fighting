/* ===================== wybór postaci bez przeskakiwania na mapę (jeden telefon) ===================== */
function firstFree(){return Object.keys(C).find(n=>!taken(n))||Object.keys(C)[0]}
const _r10=render;render=function(){
 if(H&&st.scr==='hpass'&&H.tgt==='pick'){st.scr='pick';st.chOk=false;st.start=null;st.team=null;st.ch=firstFree()}
 _r10();
 const ov=document.getElementById('selOv');
 if(ov&&H&&st.scr==='pick'&&!st.chOk){if(st._selPlayer!==H.cur){st._selPlayer=H.cur;ov.classList.remove('newp');void ov.offsetWidth;ov.classList.add('newp')}}
 else st._selPlayer=null};
render();
