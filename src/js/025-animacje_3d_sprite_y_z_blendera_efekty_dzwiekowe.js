/* ===================== ANIMACJE 3D (sprite'y z Blendera) + EFEKTY DŹWIĘKOWE (pliki) ===================== */
const A3D=(function(){
 function sprite(el,ch,kind,h,opt){opt=opt||{};const d=SPR3D[ch];if(!d)return null;
  const n=kind==='a'?d.na:d.ni,w=Math.round(h*d.w/d.h);
  el.style.width=w+'px';el.style.height=h+'px';el.style.backgroundImage='url('+d[kind]+')';el.style.backgroundSize=(w*n)+'px '+h+'px';el.style.backgroundPosition='0 0';
  if(el._t)clearInterval(el._t);let f=0;const fps=opt.fps||(kind==='a'?20:8);
  el._t=setInterval(()=>{f++;if(f>=n){if(opt.loop){f=0}else{clearInterval(el._t);el._t=null;if(opt.done)opt.done();return}}el.style.backgroundPosition=(-f*w)+'px 0'},1000/fps);
  return el}
 let last={ch:null,t:0},hideT=null;
 function cutin(ch){if(!SPR3D[ch])return;const now=Date.now();if(last.ch===ch&&now-last.t<1300)return;last={ch,t:now};
  let c=document.getElementById('cutin');if(c)c.remove();
  c=document.createElement('div');c.id='cutin';c.style.setProperty('--c',(C[ch]&&C[ch].col)||'#f2c230');
  c.innerHTML='<div class="ci-bg"></div><div class="ci-spr"></div><div class="ci-nm">'+ch.toUpperCase()+'</div>';
  document.body.appendChild(c);
  const h=Math.max(120,Math.min(200,Math.round(window.innerHeight*.24)));
  sprite(c.querySelector('.ci-spr'),ch,'a',h,{done:()=>{}});
  clearTimeout(hideT);hideT=setTimeout(()=>{c.classList.add('out');setTimeout(()=>c.remove(),300)},1250)}
 function selFig(){const ov=document.getElementById('selOv');
  const on=ov&&!ov.classList.contains('vs')&&st.scr==='pick'&&!st.chOk&&!st.cwait&&ov.querySelector('.selgrid');
  let f=document.getElementById('fig3d');
  if(!on){if(f){if(f._sp&&f._sp._t)clearInterval(f._sp._t);f.remove()}return}
  const ch=st.ch||Object.keys(C)[0];
  if(!f||f.parentNode!==ov){if(f)f.remove();f=document.createElement('button');f.id='fig3d';f.setAttribute('aria-label','Podgląd 3D postaci – dotknij, żeby zobaczyć atak');f.innerHTML='<div class="f3s"></div><span>3D</span>';ov.appendChild(f);f._ch=null}
  f.style.width=Math.round(f.clientHeight*.78)+'px';
  if(f._ch!==ch){f._ch=ch;f._sp=f.querySelector('.f3s');const h=f.clientHeight?Math.round(f.clientHeight-8):150;f._h=h;sprite(f._sp,ch,'i',h,{loop:true})}}
 document.addEventListener('click',e=>{const f=e.target.closest&&e.target.closest('#fig3d');if(!f)return;e.preventDefault();e.stopImmediatePropagation();
  const ch=f._ch;if(!ch)return;try{SND.unlock();SND.play(ATKSND[ch]||'swing')}catch(_){}
  sprite(f._sp,ch,'a',f._h||150,{done:()=>sprite(f._sp,ch,'i',f._h||150,{loop:true})})},true);
 return {cutin,selFig,sprite}})();

/* --- dźwięki z plików (ElevenLabs), z dźwiękami zastępczymi jako rezerwą --- */
const SFXF=(function(){
 const D=(typeof SFXDATA!=='undefined')?SFXDATA:{};let ctx=null,bus=null,buf={};
 const FB={punch:'hit',staff:'swing',splash:'poison',crash:'hit',levelup:'heal',base:'hit',land:'step'};
 function init(){if(ctx)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;ctx=new AC();bus=ctx.createGain();bus.connect(ctx.destination);
  Object.keys(D).forEach(n=>{try{const bin=atob(D[n].split(',')[1]),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
   const p=ctx.decodeAudioData(u.buffer,b=>{buf[n]=b},()=>{});if(p&&p.catch)p.catch(()=>{})}catch(e){}})}
 function unlock(){init();if(ctx&&ctx.state!=='running')try{ctx.resume()}catch(e){}}
 function play(n){if(!ctx||!buf[n])return false;if(SND.S.mute||SND.S.vol.sfx<=0)return true;
  const s=ctx.createBufferSource(),g=ctx.createGain();g.gain.value=SND.S.vol.sfx*.75;s.buffer=buf[n];s.connect(g);g.connect(bus);s.start();return true}
 return {unlock,play,FB,count:()=>Object.keys(D).length}})();
['pointerdown','touchstart','keydown'].forEach(ev=>window.addEventListener(ev,()=>SFXF.unlock(),{capture:true,passive:true}));
const _sndPlay=SND.play;SND.play=function(n){if(SFXF.play(n))return;if(SFXF.FB[n]){if(SFXF.play(SFXF.FB[n]))return;return _sndPlay(SFXF.FB[n])}return _sndPlay(n)};
Object.assign(ATKSND,{'Byku':'punch','Pasterz':'staff','Truchel':'splash'});

/* --- wyzwalanie przerywników 3D w trakcie animacji rundy --- */
const _capSet3=capSet;capSet=function(t){_capSet3(t);if(!t||!st.animating)return;const s=String(t);
 const who=Object.keys(C).find(c=>s.startsWith(c));if(!who)return;
 if(/atakuje|szarżuje|szarża owcy|wysyła drona|aktywuje drona|teleportuje|tworzy kałużę|przywołuje owcę/.test(s))A3D.cutin(who);
 if(/ŚCIANA/.test(s))SND.play('crash')};
const _r3d=render;render=function(){_r3d();try{A3D.selFig()}catch(e){}};
/* --- Bitwa baz: awans i wygrana --- */
(function(){let lastH='';const mo=new MutationObserver(()=>{const r=document.getElementById('mbRoot');if(!r)return;const t=r.textContent||'';const k=/Awans! Poziom/.test(t)?'lv'+t.slice(0,60):/Wygrywa .*!/.test(t)?'win':'';if(k&&k!==lastH){lastH=k;SND.play(k==='win'?'win':'levelup')}if(!k)lastH=''});
 const go=()=>{const r=document.getElementById('mbRoot');if(r)mo.observe(r,{childList:true,subtree:true});else setTimeout(go,800)};go()})();
render();


