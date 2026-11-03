

const _baseRender=render;
render=function(){_baseRender();injectExtras()};

document.addEventListener('click',function(e){
 if(!st.pick)return;
 const t=e.target.closest('[data-k]');if(!t)return;
 e.stopImmediatePropagation();pickCell(t.dataset.k);render()},true);

document.addEventListener('click',function(e){
 const t=e.target.closest('[data-roll],[data-pick],[data-stay],[data-bdtog]');if(!t||st.animating)return;
 const ds=t.dataset;
 if(ds.roll!==undefined){openWheel(ds.roll);return}
 if(ds.pick!==undefined){const parts=ds.pick.split(':');st.pick={kind:parts[0],id:parts[1]};render();return}
 if(ds.stay!==undefined){const p=playerOf(ds.stay);if(p&&mine(ds.stay)){p.dg=p.dg||{};p.dg[st.round]='stay';saveP(p)}render();return}
 if(ds.bdtog!==undefined){const pl=st.plan[st.ph];if(pl)pl.bd=!pl.bd;render();return}});

document.addEventListener('click',function(e){
 const t=e.target.closest('[data-a="next"],[data-a="hnextr"]');if(!t)return;
 st.pick=null;
 const items=curItems(),Rs=resolve(items);st._fin=Rs;st._finRound=st.round;st._finMode=H?'h':'n';let changed=false;
 items.forEach(o=>{const q=o.q,b=q.bon,x=Rs[o.id];if(!b||!mine(o.id)||!(q.bonR===undefined||q.bonR<st.round))return;
  if(b.k===4&&x&&x.shUsed){q.bon=null;changed=true}
  if(b.k===2&&x&&x.dmgbUsed){q.bon=null;changed=true}});
 if(changed)saveP(curP());},true);

render();
