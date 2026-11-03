/* ===================== animacja podniesienia przedmiotu (leczenie ≠ obrażenia) ===================== */
const PKCOL={1:'#5cff8a',2:'#ffb347',3:'#6cc8ff',4:'#d6dde6',6:'#c792ff'};
async function pickAnim(){
 if(!isSp()||st.skipReq)return;
 for(const p of (st.animPick||[])){
  if(st.skipReq)break;ovSet('');
  const g=GEO[p.k],el=document.getElementById(iid(p.k)),ico=el&&el.querySelector('.ico'),col=PKCOL[p.t]||'#fff';
  const tp=st.curPos[p.id]||g.c,dx=tp[0]-g.c[0],dy=(tp[1]-62)-(g.c[1]+4);
  capSet(nmOf(p.id)+' podnosi: '+ITEM[p.t].n);
  if(ico){const a=ico.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate(0,-55px) scale(1.35)',opacity:1,offset:.38},{transform:'translate('+dx+'px,'+dy+'px) scale(.12)',opacity:.3}],{duration:780,easing:'cubic-bezier(.3,.7,.3,1)',fill:'forwards'});try{await a.finished}catch(e){}}
  else await wait(400);
  if(el)el.remove();
  const tok=document.querySelector('#tk-'+p.id+' .in');
  if(p.t===1){
   const before=st.animHp[p.id]||5,after=Math.min(MAXHP(chOfId(p.id)),before+1);st.animHp[p.id]=after;
   const f=document.getElementById('hpf-'+p.id);if(f){f.style.fill='#5cff8a';f.style.transform='scaleX('+after/MAXHP(chOfId(p.id))+')';setTimeout(()=>{if(f)f.style.fill=after>2?'#4fc183':after>1?'#f0a020':'#e0342b'},900)}
   let sp='';for(let i=0;i<7;i++){const x=-34+i*11,d=(i%3)*90;sp+='<g transform="translate('+x+',0)"><text class="healfx" style="animation-delay:'+d+'ms;font:900 26px system-ui;fill:#5cff8a;stroke:#0b3a17;stroke-width:4px;paint-order:stroke">+</text></g>'}
   ovAdd('<g transform="translate('+tp[0]+','+(tp[1]-40)+')"><g class="healring"><circle r="34" fill="none" stroke="#5cff8a" stroke-width="6"/></g>'+sp+'</g>');
   ovAdd('<g transform="translate('+tp[0]+','+(tp[1]-150)+')"><text class="fl big heal">+1 HP</text></g>');
   if(tok){tok.classList.remove('tokglow');void tok.getBoundingClientRect();tok.classList.add('tokglow')}
  }else{
   ovAdd('<g transform="translate('+tp[0]+','+(tp[1]-62)+')"><g class="pkring"><circle r="16" fill="none" stroke="'+col+'" stroke-width="7"/></g></g>');
   burst(tp[0],tp[1]-62,col,12);
   ovAdd('<g transform="translate('+tp[0]+','+(tp[1]-150)+')"><text class="fl big gain" style="fill:'+col+'">'+ITEM[p.t].n+'</text></g>');
   if(tok){tok.classList.remove('tokgain');void tok.getBoundingClientRect();tok.classList.add('tokgain')}}
  await wait(1000)}}

