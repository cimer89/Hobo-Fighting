/* ===================== DŹWIĘK: muzyka + efekty (pliki z audio/ albo dźwięki zastępcze) ===================== */
const SND=(function(){
 const NAMES=['click','confirm','select','vs','phase','step','jump','swing','thrust','sniper','pistol','magic','charge','hit','miss','ko','shield','heal','pickup','sheep','drone','poison','teleport','knock','wheel','win'];
 const MUSIC=['music_menu','music_battle'];
 let ctx=null,master,musB,sfxB,unlocked=false,files={},mode=null,musicEl=null,seqTimer=null,nextT=0,step=0;
 const S={vol:{music:.45,sfx:.8},mute:false};
 try{const v=JSON.parse(localStorage.getItem('hf_sound')||'null');if(v)Object.assign(S,v)}catch(e){}
 const persist=()=>{try{localStorage.setItem('hf_sound',JSON.stringify(S))}catch(e){}};
 function gains(){if(!ctx)return;const m=S.mute?0:1;master.gain.value=m;musB.gain.value=S.vol.music*.55;sfxB.gain.value=S.vol.sfx;if(musicEl)musicEl.volume=S.mute?0:S.vol.music}
 function init(){if(ctx)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;ctx=new AC();master=ctx.createGain();musB=ctx.createGain();sfxB=ctx.createGain();musB.connect(master);sfxB.connect(master);master.connect(ctx.destination);gains();probe()}
 function probe(){NAMES.concat(MUSIC).forEach(n=>{['mp3','ogg'].forEach(ext=>{if(files[n])return;const a=new Audio();a.preload='auto';a.src='audio/'+n+'.'+ext;a.addEventListener('canplaythrough',()=>{if(!files[n]){files[n]=a.src;if(MUSIC.includes(n))setMode(mode,true)}},{once:true});a.addEventListener('error',()=>{},{once:true});try{a.load()}catch(e){}})})}
 function unlock(){init();if(!ctx)return;if(ctx.state!=='running')ctx.resume();unlocked=true;setMode(mode,true)}
 // --- synteza ---
 function env(g,t,a,d,v){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(v,0.0002),t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+d)}
 function tone(f,d,o){o=o||{};const t=(o.t||ctx.currentTime)+(o.at||0),os=ctx.createOscillator(),g=ctx.createGain();os.type=o.type||'square';os.frequency.setValueAtTime(f,t);if(o.to)os.frequency.exponentialRampToValueAtTime(o.to,t+d);
  if(o.vib){const l=ctx.createOscillator(),lg=ctx.createGain();l.frequency.value=o.vib;lg.gain.value=f*.06;l.connect(lg);lg.connect(os.frequency);l.start(t);l.stop(t+d+.05)}
  let n=os;if(o.lp){const fl=ctx.createBiquadFilter();fl.type='lowpass';fl.frequency.value=o.lp;os.connect(fl);n=fl}
  n.connect(g);g.connect(o.bus||sfxB);env(g,t,o.a||.005,d,o.v||.25);os.start(t);os.stop(t+d+.05)}
 let nbuf=null;function noise(d,o){o=o||{};if(!nbuf){nbuf=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);const c=nbuf.getChannelData(0);for(let i=0;i<c.length;i++)c[i]=Math.random()*2-1}
  const t=(o.t||ctx.currentTime)+(o.at||0),s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=nbuf;s.loop=true;f.type=o.ft||'lowpass';f.frequency.setValueAtTime(o.f||2000,t);if(o.fto)f.frequency.exponentialRampToValueAtTime(o.fto,t+d);f.Q.value=o.q||1;
  s.connect(f);f.connect(g);g.connect(o.bus||sfxB);env(g,t,o.a||.003,d,o.v||.3);s.start(t);s.stop(t+d+.05)}
 const SYN={
  click:()=>tone(900,.04,{to:600,v:.08}),
  confirm:()=>{tone(523,.09,{v:.15,type:'triangle'});tone(784,.14,{v:.15,type:'triangle',at:.08})},
  select:()=>tone(660,.08,{type:'triangle',v:.14,to:880}),
  vs:()=>{noise(.5,{f:3000,fto:200,v:.35});tone(110,.7,{to:40,type:'sawtooth',v:.3,lp:600})},
  phase:()=>noise(.35,{ft:'bandpass',f:400,fto:3000,q:2,v:.25,a:.08}),
  step:()=>noise(.06,{f:600,v:.18}),
  jump:()=>tone(260,.18,{to:720,type:'triangle',v:.16}),
  swing:()=>noise(.28,{ft:'bandpass',f:600,fto:2500,q:3,v:.35,a:.04}),
  thrust:()=>{noise(.12,{ft:'highpass',f:1500,v:.25});tone(220,.12,{to:110,v:.12})},
  sniper:()=>{noise(.07,{ft:'highpass',f:1800,v:.5});tone(1400,.25,{to:150,type:'sawtooth',v:.12,at:.02})},
  pistol:()=>{noise(.06,{ft:'highpass',f:1200,v:.45});tone(500,.08,{to:120,v:.1})},
  magic:()=>tone(380,.45,{to:1300,type:'sine',v:.2,vib:14}),
  charge:()=>{tone(70,.55,{to:160,type:'sawtooth',v:.25,lp:500});noise(.5,{f:500,v:.2,a:.1})},
  hit:()=>{noise(.13,{f:1400,v:.45});tone(140,.18,{to:55,type:'sine',v:.4})},
  miss:()=>noise(.25,{ft:'bandpass',f:2400,fto:500,q:4,v:.22,a:.03}),
  ko:()=>{tone(320,.7,{to:55,type:'sawtooth',v:.22,lp:1200});noise(.4,{f:800,v:.2,at:.1})},
  shield:()=>{tone(1500,.35,{type:'sine',v:.18});tone(2250,.3,{type:'sine',v:.08})},
  heal:()=>[523,659,784,1046].forEach((f,i)=>tone(f,.16,{type:'sine',v:.15,at:i*.07})),
  pickup:()=>{tone(880,.08,{v:.12});tone(1320,.12,{v:.12,at:.07})},
  sheep:()=>tone(330,.55,{to:300,type:'sawtooth',v:.16,vib:22,lp:1600}),
  drone:()=>tone(190,.7,{type:'sawtooth',v:.08,vib:40,lp:900}),
  poison:()=>{for(let i=0;i<6;i++)tone(300+Math.random()*500,.06,{type:'sine',v:.12,at:i*.06,to:700})},
  teleport:()=>tone(1500,.35,{to:180,type:'sine',v:.18,vib:30}),
  knock:()=>{noise(.1,{f:900,v:.3});tone(200,.12,{to:90,v:.15})},
  wheel:()=>tone(1200,.025,{v:.07}),
  win:()=>[392,523,659,784].forEach((f,i)=>tone(f,.2,{type:'square',v:.1,at:i*.09}))};
 function play(n){if(!unlocked||!ctx||S.mute||S.vol.sfx<=0)return;
  if(files[n]){try{const a=new Audio(files[n]);a.volume=S.vol.sfx;a.play().catch(()=>{})}catch(e){}return}
  try{SYN[n]&&SYN[n]()}catch(e){}}
 // --- muzyka zastępcza (sekwencer) ---
 const RIFF={menu:{bpm:96,bass:[40,0,40,43,0,45,43,0,38,0,38,43,0,45,47,0],kick:[1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],snare:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1]},
             battle:{bpm:148,bass:[40,40,52,40,43,43,55,43,38,38,50,38,45,45,47,43],kick:[1,0,0,0,1,0,0,1,1,0,0,0,1,0,1,0],snare:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1]}};
 const mtof=m=>440*Math.pow(2,(m-69)/12);
 function tick(){if(!ctx)return;const R=RIFF[mode];if(!R)return;const sp=60/R.bpm/4;
  while(nextT<ctx.currentTime+.12){const i=step%16;
   if(R.bass[i])tone(mtof(R.bass[i]),sp*.9,{t:nextT,type:'sawtooth',v:.22,lp:mode==='battle'?900:600,bus:musB});
   if(R.kick[i])tone(150,.18,{t:nextT,to:40,type:'sine',v:.55,bus:musB});
   if(R.snare[i])noise(.12,{t:nextT,f:2500,ft:'highpass',v:.22,bus:musB});
   if(mode==='battle'||i%2===0)noise(.03,{t:nextT,f:7000,ft:'highpass',v:.07,bus:musB});
   nextT+=sp;step++}}
 function stopMusic(){if(seqTimer){clearInterval(seqTimer);seqTimer=null}if(musicEl){musicEl.pause();musicEl=null}}
 function setMode(m,force){if(m===mode&&!force)return;mode=m;if(!unlocked||!ctx)return;stopMusic();if(!m)return;
  const f=files['music_'+m];
  if(f){musicEl=new Audio(f);musicEl.loop=true;musicEl.volume=S.mute?0:S.vol.music;musicEl.play().catch(()=>{});return}
  nextT=ctx.currentTime+.05;step=0;seqTimer=setInterval(tick,25)}
 return {play,setMode,unlock,S,gains,persist,files}})();
document.addEventListener('input',e=>{const t=e.target;if(t&&t.dataset&&t.dataset.sv){SND.S.vol[t.dataset.sv]=+t.value;SND.gains();SND.persist();if(t.dataset.sv==='sfx')SND.play('click')}});
addClick('fx/sound_init#1',document,e=>{const t=e.target.closest&&e.target.closest('#sndBtn,[data-smute]');if(!t)return;e.stopImmediatePropagation();
 if(t.id==='sndBtn'){SND.unlock();sndPanel();return}
 SND.S.mute=!SND.S.mute;SND.gains();SND.persist();t.textContent=SND.S.mute?'Włącz dźwięk':'Wycisz wszystko';sndBtn()},true);
/* --- odblokowanie i dźwięki interfejsu --- */
['pointerdown','touchstart','keydown'].forEach(ev=>window.addEventListener(ev,()=>SND.unlock(),{capture:true,passive:true}));
addClick('fx/sound_init#2',window,e=>{const t=e.target.closest&&e.target.closest('button,[data-k]');if(!t||t.disabled||t.id==='sndBtn')return;
 const a=t.dataset&&t.dataset.a;
 if(t.dataset.ch)SND.play('select');else if(['ok','confirm','chok','hnext','start'].includes(a))SND.play('confirm');else if(a==='vsgo')SND.play('phase');else SND.play('click')},true);
/* --- dźwięki animacji: na podstawie opisu zdarzenia --- */
const ATKSND={'Wiatrak':'swing','Długi':'thrust','Żyleta':'sniper','Ciotka':'magic','Sierżant Przemo':'pistol'};
const _capSet=capSet;
capSet=function(t){_capSet(t);if(!t||!st.animating)return;const s=String(t);
 let n=null;
 if(/ odpada/.test(s))n='ko';else if(/podnosi: \+1 HP/.test(s))n='heal';else if(/podnosi/.test(s))n='pickup';
 else if(/−\d/.test(s))n='hit';else if(/pudło/.test(s))n='miss';else if(/tarcza/i.test(s))n='shield';
 else if(/szarża owcy|przywołuje owcę|ruch owcy|Owca/.test(s))n='sheep';else if(/szarżuje/.test(s))n='charge';
 else if(/drona/.test(s))n='drone';else if(/kałuż/.test(s))n='poison';else if(/teleport/.test(s))n='teleport';
 else if(/odrzucony|przesunięty/.test(s))n='knock';else if(/skacze|unik/.test(s))n='jump';else if(/rusza się|^Ruchy/.test(s))n='step';
 else if(/^Faza/.test(s))n='phase';
 else if(/atakuje/.test(s)){const ch=Object.keys(ATKSND).find(c=>s.startsWith(c));n=ch?ATKSND[ch]:'swing'}
 if(n)SND.play(n)};
/* --- koło --- */
const _openWheel=openWheel;
openWheel=function(id){_openWheel(id);let k=0;const iv=setInterval(()=>{SND.play('wheel');if(++k>40)clearInterval(iv)},Math.max(40,70));setTimeout(()=>{clearInterval(iv);SND.play('win')},3350)};
/* --- muzyka zależna od ekranu --- */
addRender('fx/sound_init',_r11=>function(){_r11();
 const sel=document.getElementById('selOv'),vs=sel&&sel.classList.contains('vs');
 if(vs&&!st._vsSnd){st._vsSnd=true;SND.play('vs')}if(!vs)st._vsSnd=false;
 const menu=['splash','lobby','hsetup'].includes(st.scr)||(!!sel&&!vs);
 SND.setMode(st.scr==='splash'&&!st._started?null:(menu?'menu':'battle'));sndBtn()});
addClick('fx/sound_init#3',window,e=>{if(e.target.closest&&e.target.closest('[data-a="start"]'))st._started=true},true);
render();
