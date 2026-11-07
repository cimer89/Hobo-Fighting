addRender('ui/style_init',_baseRender2=>function(){_baseRender2();styleScreens()});

addClick('ui/style_init',document,function(e){
 const t=e.target.closest('[data-a="chok"],[data-a="chback"],[data-a="hgo"],[data-a="confirm"],[data-a="solo"],[data-a="hot"],[data-a="create"],[data-a="joinb"],[data-a="back"]');if(!t)return;
 const a=t.dataset.a;
 if(a==='chok'){st.chOk=true;render();return}
 if(a==='chback'){st.chOk=false;render();return}
 st.chOk=false},true);

render();


render();
