/* ===================== MNIEJSZA PLANSZA DLA 2 GRACZY (tryb klasyczny i specjalny): promień 2 zamiast 3 ===================== */
(function(){
 const full=cells.map(c=>c.slice());
 const hd=(q,r)=>Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r));
 let frozen=null;
 function want(){if(window.__BRFORCE)return window.__BRFORCE;try{
  if(typeof H!=='undefined'&&H){if(H.train)return 3;return H.n===2?2:3}
  if(net&&net.db&&net.code){const live=['menu','lobby','splash'].includes(st.scr);
   if(frozen&&frozen.code===net.code&&!['pick','wait','sel'].includes(st.scr))return frozen.r;
   const n=netPlayers().length,r=(n===2&&!(typeof isTeam==='function'&&isTeam()))?2:3;if(!live)frozen={code:net.code,r};return r}
 }catch(e){}return 3}
 function setBR(r){if((window.__BR||3)===r)return;window.__BR=r;cells.length=0;full.forEach(c=>{if(hd(c[0],c[1])<=r)cells.push(c.slice())});BOARD_SVG=null;try{B3D.setR(r)}catch(e){}}
 /* kadr planszy: przy mniejszej planszy przybliżamy obraz, żeby pola były większe */
 window.bdVB=function(){const R=window.__BR||3;if(R>=3||!GEO['0,0'])return '62 40 870 900';const c=GEO['0,0'].c,f=(R+2.1)/4.7;
  return [(c[0]-(c[0]-62)*f),(c[1]-(c[1]-40)*f-30*(1-f)*3),870*f,900*f].map(v=>v.toFixed(1)).join(' ')};
 const _r=render;render=function(){setBR(want());return _r.apply(this,arguments)};
 const _z=zoneR;zoneR=function(r){const z=_z(r),R=window.__BR||3;return z>=R?3:z};
 render();
})();

/* muzyka z ElevenLabs (Music v2.5), zapętlona */
try{SND.files.music_menu='@@asset:audio/snd_files_music_menu.mp3@@';SND.files.music_battle='@@asset:audio/snd_files_music_battle.mp3@@';}catch(e){}
/* odblokowanie dźwięku tylko raz: kolejne dotknięcia nie restartują utworu od początku */
(function(){const _u=SND.unlock;let done=false;SND.unlock=function(){if(done)return;done=true;_u()}})();

