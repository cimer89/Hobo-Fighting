window.addEventListener('click',e=>{
 const b=e.target.closest&&e.target.closest('[data-a="demo"]');
 if(b){e.preventDefault();e.stopImmediatePropagation();try{SND.play('click')}catch(_){}openDemo(st.ch||Object.keys(C)[0]);return}
 const ov=document.getElementById('demoOv');if(!ov||!ov.contains(e.target))return;
 e.stopImmediatePropagation();const t=e.target.closest('[data-dm]');
 if(!t){if(e.target===ov)closeDemo();return}
 const v=t.dataset.dm,n=DEMOS[DM.ch]().length;try{SND.play('click')}catch(_){}
 if(v==='x')closeDemo();else if(v==='prev'){if(DM.i>0){DM.i--;demoPlay()}}else if(v==='next'){if(DM.i<n-1){DM.i++;demoPlay()}}else{DM.i=+v;demoPlay()}},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('demoOv'))closeDemo()});
const _selPickerD=selPickerH;
selPickerH=function(){const r=_selPickerD();const ch=st.ch||Object.keys(C)[0],d='<p class="seldesc">'+C[ch].txt+'</p>';r.h=r.h.replace(d,d+'<button class="seldemo" data-a="demo" aria-label="Zobacz przykłady akcji">▶ Zobacz akcje</button>');return r};
const _rDemo=render;
render=function(){_rDemo();if(document.getElementById('demoOv')&&!(st.scr==='pick'&&document.getElementById('selOv')))closeDemo()};
render();
