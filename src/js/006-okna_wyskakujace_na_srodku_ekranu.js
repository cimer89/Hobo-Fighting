/* ===================== OKNA WYSKAKUJĄCE NA ŚRODKU EKRANU ===================== */
function hasPendPush(){try{return (resolve(curItems())._pend||[]).some(p=>mine(p.by))}catch(e){return false}}
function modalize(){
 try{
  const old=document.getElementById('resModal'),oldBar=document.getElementById('modalBar');
  const sc=old&&old.querySelector('.mscroll'),top=sc?sc.scrollTop:0;
  if(old)old.remove();if(oldBar)oldBar.remove();
  const eligible=['rev','hrev','hstarts','hpass','wait'].includes(st.scr)&&!st.animating;
  if(!eligible){app.style.display='';return}
  const key=st.scr+':'+st.round+':'+(H?H.cur:'o');
  if(st._mkey!==key){st._mkey=key;st.modalMin=false;st.mapMode=false}
  if(!hasPendPush())st.mapMode=false;
  const needMap=!!st.pick||!!st.mapMode;
  if(needMap||st.modalMin){
   app.style.display='none';
   const bar=document.createElement('div');bar.id='modalBar';
   bar.innerHTML=needMap?'<span>Dotknij zielonego pola na mapie</span><button data-a="mback">Wróć</button>':'<button class="go" data-a="mshow">Pokaż wyniki</button>';
   document.body.appendChild(bar);return}
  const nodes=[...app.children];if(!nodes.length){app.style.display='';return}
  let k=nodes.length;while(k>0&&(nodes[k-1].tagName==='BUTTON'||nodes[k-1].tagName==='P'))k--;
  const body=nodes.slice(0,k),foot=nodes.slice(k);
  const m=document.createElement('div');m.id='resModal';
  const box=document.createElement('div');box.className='mbox';
  if(['rev','hrev','hstarts'].includes(st.scr)){const t=document.createElement('div');t.className='mtop';t.innerHTML='<button data-a="mmin">Pokaż mapę</button>';box.appendChild(t)}
  const s=document.createElement('div');s.className='mscroll';body.forEach(n=>s.appendChild(n));box.appendChild(s);
  const f=document.createElement('div');f.className='mfoot';foot.forEach(n=>f.appendChild(n));box.appendChild(f);
  m.appendChild(box);document.body.appendChild(m);app.style.display='none';
  if(top)s.scrollTop=top;
 }catch(e){}}
const _r6=render;render=function(){_r6();modalize()};
document.addEventListener('click',function(e){
 const t=e.target.closest('[data-a="mmin"],[data-a="mshow"],[data-a="mback"],[data-mapmode]');if(!t)return;
 const d=t.dataset;
 if(d.a==='mmin')st.modalMin=true;else if(d.a==='mshow')st.modalMin=false;else if(d.a==='mback'){st.pick=null;st.mapMode=false}else if(d.mapmode!==undefined)st.mapMode=true;
 e.stopImmediatePropagation();render()},true);
render();
