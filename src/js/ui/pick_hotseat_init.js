addRender('ui/pick_hotseat_init',_r10=>function(){
 if(H&&st.scr==='hpass'&&H.tgt==='pick'){st.scr='pick';st.chOk=false;st.start=null;st.team=null;st.ch=firstFree()}
 _r10();
 const ov=document.getElementById('selOv');
 if(ov&&H&&st.scr==='pick'&&!st.chOk){if(st._selPlayer!==H.cur){st._selPlayer=H.cur;ov.classList.remove('newp');void ov.offsetWidth;ov.classList.add('newp')}}
 else st._selPlayer=null});
render();
