/* ===================== PODSUMOWANIE RUNDY (animowane) + baner nowej rundy ===================== */
(function(){
 const css=`#rsum{position:fixed;inset:0;z-index:9000;pointer-events:none;display:flex;align-items:center;justify-content:center;background:rgba(8,12,20,.0);animation:rsBg .35s forwards;padding:16px}
@keyframes rsBg{to{background:rgba(8,12,20,.62)}}
#rsum .rsc{pointer-events:auto;width:min(420px,100%);background:linear-gradient(#5a3a1f,#3b2412);border:3px solid #1a0f06;border-radius:18px;box-shadow:0 10px 0 #1a0f06,0 18px 40px rgba(0,0,0,.5);padding:14px 14px 10px;transform:scale(.6) translateY(40px);opacity:0;animation:rsIn .45s cubic-bezier(.2,1.4,.4,1) .1s forwards;color:#fff}
@keyframes rsIn{to{transform:none;opacity:1}}
#rsum h2{margin:0 0 2px;text-align:center;font:400 32px Bangers,Impact,sans-serif;letter-spacing:2px;color:#ffd84a;-webkit-text-stroke:2px #1a0f06;text-shadow:0 4px 0 #1a0f06;animation:rsT .6s ease-out .25s both}
@keyframes rsT{0%{transform:scale(2.2) rotate(-6deg);opacity:0}60%{transform:scale(.92) rotate(2deg);opacity:1}100%{transform:none}}
#rsum .rss{text-align:center;font:700 13px system-ui;opacity:.8;margin-bottom:10px}
#rsum .rsr{display:grid;grid-template-columns:44px 1fr auto;gap:8px;align-items:center;background:rgba(0,0,0,.28);border-radius:12px;padding:6px 8px;margin:6px 0;opacity:0;transform:translateX(-30px);animation:rsRow .4s ease-out forwards}
@keyframes rsRow{to{opacity:1;transform:none}}
#rsum .rsr img{width:44px;height:44px;border-radius:50%;border:3px solid var(--c);object-fit:cover;background:var(--c)}
#rsum .rsn{font:400 19px Bangers,Impact,sans-serif;letter-spacing:1px;line-height:1}
#rsum .rsb{position:relative;height:12px;background:#140c06;border-radius:6px;overflow:hidden;margin-top:4px}
#rsum .rsb i{position:absolute;left:0;top:0;bottom:0;border-radius:6px}
#rsum .rsb .lost{background:#ff5a4f;transition:width .6s ease-in .2s}
#rsum .rsb .now{background:#4fc183;transition:width .7s cubic-bezier(.3,.9,.3,1)}
#rsum .rsv{text-align:right;font:900 13px system-ui;white-space:nowrap}
#rsum .rsv b{display:block;font-size:17px}
#rsum .dmg{color:#ff8a7a}#rsum .heal{color:#7dffa8}#rsum .ok{color:#cfe8c0;opacity:.75}
#rsum .ko{position:relative}
#rsum .ko::after{content:'ODPADA';position:absolute;right:6px;top:50%;transform:translateY(-50%) rotate(-12deg);font:400 22px Bangers,Impact,sans-serif;color:#ff4a3c;-webkit-text-stroke:1.5px #1a0f06;animation:rsKo .5s cubic-bezier(.2,1.6,.4,1) both;animation-delay:inherit}
@keyframes rsKo{0%{transform:translateY(-50%) rotate(-12deg) scale(3);opacity:0}100%{opacity:1}}
#rsum .rsf{margin-top:8px;text-align:center;font:700 12px system-ui;opacity:.8}
#rsum .rsp{height:4px;border-radius:2px;background:rgba(255,255,255,.15);overflow:hidden;margin-top:6px}
#rsum .rsp i{display:block;height:100%;background:#ffd84a;width:100%;animation:rsP linear forwards}
@keyframes rsP{to{width:0}}
#rsum .rsj{margin-top:8px;width:100%;min-height:30px;padding:4px 10px;font:700 12px system-ui;border-radius:10px}
#rsum .rsjl{display:none;margin-top:6px;max-height:34vh;overflow:auto;background:rgba(0,0,0,.35);border-radius:10px;padding:6px 8px;text-align:left;font:500 11.5px/1.35 system-ui}
#rsum .rsjl div{padding:2px 0;border-bottom:1px solid rgba(255,255,255,.08)}
#rsum.jopen .rsjl{display:block}#rsum.jopen .rsp{visibility:hidden}
#rsum.out{animation:rsOut .3s forwards}@keyframes rsOut{to{opacity:0}}
.rbn{position:fixed;left:50%;top:30%;z-index:8999;transform:translate(-50%,-50%);pointer-events:none;text-align:center;font:400 54px Bangers,Impact,sans-serif;letter-spacing:3px;color:#ffd84a;-webkit-text-stroke:2.5px #1a0f06;text-shadow:0 5px 0 #1a0f06;animation:rbn 1.7s ease-out forwards;white-space:nowrap}
.rbn small{display:block;font-size:22px;color:#fff;letter-spacing:1px;-webkit-text-stroke:1.2px #1a0f06}
@keyframes rbn{0%{transform:translate(-50%,-50%) scale(2.4);opacity:0}18%{transform:translate(-50%,-50%) scale(.95);opacity:1}28%{transform:translate(-50%,-50%) scale(1)}80%{opacity:1}100%{transform:translate(-50%,-70%);opacity:0}}`;
 const st0=document.createElement('style');st0.textContent=css;document.head.appendChild(st0);
 function close(el){if(!el||el._c)return;el._c=1;el.classList.add('out');setTimeout(()=>el.remove(),300)}
 function show(rnd,rows,jr){const old=document.getElementById('rsum');if(old)old.remove();
  const el=document.createElement('div');el.id='rsum';const AUTO=5200;
  let h='<div class="rsc"><h2>KONIEC RUNDY '+rnd+'</h2><div class="rss">Podsumowanie</div>';
  rows.forEach((r,i)=>{const d=(0.45+i*0.12).toFixed(2)+'s';
   const v=r.lost>0?'<span class="dmg"><b>−'+r.lost+' HP</b></span>':r.lost<0?'<span class="heal"><b>+'+(-r.lost)+' HP</b></span>':'<span class="ok"><b>bez strat</b></span>';
   h+='<div class="rsr'+(r.ko?' ko':'')+'" style="--c:'+r.col+';animation-delay:'+d+'"><img src="'+r.img+'" alt=""><div><div class="rsn">'+r.n+'</div><div class="rsb"><i class="lost" style="width:'+(100*r.h0/r.max)+'%"></i><i class="now" style="width:'+(100*r.h0/r.max)+'%"></i></div></div><div class="rsv">'+(r.ko?'':v)+(r.dealt?'<span>⚔ zadał '+r.dealt+'</span>':'')+'</div></div>'});
  /* dziennik rundy: dlaczego ktoś stracił HP, został przesunięty albo odpadł */
  const nm=id=>{try{return nmOf(id)}catch(e){return id}};const J=(jr||[]).filter(e=>['dmg','shield','eliminacja','odrzut','przesunięcie','losowanie','sheep','śmierć owcy','szarża owcy','anulowana faza III','szarża','unik'].includes(e.k));
  if(J.length)h+='<button class="rsj" data-rsj="1">📜 Dziennik rundy ('+J.length+')</button><div class="rsjl">'+J.map(e=>'<div>'+hfEsc(Combat.explain(e,nm))+'</div>').join('')+'</div>';
  h+='<div class="rsf">Dotknij, aby kontynuować</div><div class="rsp"><i style="animation-duration:'+AUTO+'ms"></i></div></div>';
  el.innerHTML=h;document.body.appendChild(el);
  rows.forEach((r,i)=>setTimeout(()=>{const row=el.querySelectorAll('.rsr')[i];if(!row)return;const w=(100*Math.max(0,r.h1)/r.max)+'%';row.querySelector('.now').style.width=w;row.querySelector('.lost').style.width=w},650+i*120+350));
  try{SND.play('click')}catch(e){}
  el.addEventListener('click',e=>{if(e.target.closest('[data-rsj]')){e.stopPropagation();el.classList.toggle('jopen');el._keep=1;return}if(e.target.closest('.rsjl'))return;close(el)});setTimeout(()=>{if(!el._keep)close(el)},AUTO)}
 /* zbiera dane z animacji rundy */
 const _ra=runAnim;
 runAnim=async function(){const jr=(st.animJournal||[]).slice(),its=(st.animItems||[]).slice(),hp0=Object.assign({},st.animHp||{}),ev=(st.animEv||[]).slice(),rnd=st.round;
  const dealt={},ko={};let cur=null;
  ev.forEach(e=>{if(['atk','charge','drone','scharge','puddle'].includes(e.k))cur=e.id;
   if(e.k==='dmg'&&cur&&cur!==e.id&&e.w!=='strefa'&&e.w!=='ścisk')dealt[cur]=(dealt[cur]||0)+(e.n||0);
   if(e.k==='out')ko[e.id]=1});
  try{await _ra.apply(this,arguments)}finally{
   try{/* HP po rundzie z wyniku silnika (działa też po „Pomiń animację”) */let RF=null;try{RF=resolveFin(its)}catch(_){}
    const rows=its.filter(o=>o&&o.q&&o.q.ch&&(hp0[o.id]===undefined||hp0[o.id]>0||ko[o.id])).map(o=>{const ch=o.q.ch,max=(typeof MAXHP==='function'?MAXHP(ch):5)||5;
     const h0=Math.max(0,Math.min(max,hp0[o.id]!==undefined?hp0[o.id]:max)),h1=ko[o.id]?0:Math.max(0,Math.min(max,RF&&RF[o.id]&&RF[o.id].eff!==undefined?RF[o.id].eff:((st.animHp||{})[o.id]!==undefined?st.animHp[o.id]:h0)));
     const tc=(typeof isTeam==='function'&&isTeam()&&o.q.tm&&typeof TCOL!=='undefined')?TCOL[o.q.tm]:null;
     return {n:(o.q.nick?hfEsc(o.q.nick)+' · '+ch:(typeof nmOf==='function'?nmOf(o.id):ch)),img:IMG[ch],col:tc||(C[ch]&&C[ch].col)||'#888',max,h0,h1,lost:h0-h1,dealt:dealt[o.id]||0,ko:!!ko[o.id]}});
    if(rows.length)setTimeout(()=>show(rnd,rows,jr),250)}catch(e){console.warn('rsum',e)}}};
 /* baner "RUNDA N" na początku planowania kolejnej rundy */
 let lastB=null;
 addRender('ui/round_summary',_rr=>function(){_rr.apply(this,arguments);try{
  if(!st.animating&&st.round>=1&&!['menu','lobby','sel','pick','over'].includes(st.scr)&&document.getElementById('stage')){const key=(typeof H!=='undefined'&&H?'h':'n')+st.round;if(lastB!==key){const first=st.round<=1;lastB=key;
    if(!first){const d=document.createElement('div');d.className='rbn';d.innerHTML='RUNDA '+st.round+'<small>'+((typeof H!=='undefined'&&H)?'zaplanuj ruchy':'twój ruch')+'</small>';
     const w=document.getElementById('rsum');setTimeout(()=>{document.body.appendChild(d);setTimeout(()=>d.remove(),1800)},w?400:50)}}}
 }catch(e){}});
})();

