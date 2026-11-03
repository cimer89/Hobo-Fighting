/* ===================== EFEKTY DŹWIĘKOWE (pliki) ===================== */

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
const _sndPlay=SND.play;
SND.play=function(n){if(SFXF.play(n))return;if(SFXF.FB[n]){if(SFXF.play(SFXF.FB[n]))return;return _sndPlay(SFXF.FB[n])}return _sndPlay(n)};
Object.assign(ATKSND,{'Byku':'punch','Pasterz':'staff','Truchel':'splash'});

/* --- dźwięk uderzenia w ścianę strefy w trakcie animacji rundy --- */
const _capSet3=capSet;
capSet=function(t){_capSet3(t);if(!t||!st.animating)return;const s=String(t);
 const who=Object.keys(C).find(c=>s.startsWith(c));if(!who)return;
 if(/ŚCIANA/.test(s))SND.play('crash')};
/* --- Bitwa baz: awans i wygrana --- */
(function(){let lastH='';const mo=new MutationObserver(()=>{const r=document.getElementById('mbRoot');if(!r)return;const t=r.textContent||'';const k=/Awans! Poziom/.test(t)?'lv'+t.slice(0,60):/Wygrywa .*!/.test(t)?'win':'';if(k&&k!==lastH){lastH=k;SND.play(k==='win'?'win':'levelup')}if(!k)lastH=''});
 const go=()=>{const r=document.getElementById('mbRoot');if(r)mo.observe(r,{childList:true,subtree:true});else setTimeout(go,800)};go()})();
render();


