/* ===================== ONLINE BEZ KONFIGURACJI: P2P (PeerJS / WebRTC) ===================== */
const P2P=(function(){
 /* Przekaźnik przez serwer (ntfy.sh, HTTPS, bez konta): działa w każdej sieci z internetem. */
 const BASE='https://ntfy.sh/',PFX='hobofight-v2-';
 let topic=null,code=null,docs={},seen={},subs=[],es=null,lastId=null,ready=false,timers={},outbox=[];
 function snap(){return {docs:Object.entries(docs).map(([id,d])=>({id,data:()=>JSON.parse(JSON.stringify(d))}))}}
 function emit(){const s=snap();subs.forEach(f=>{try{f(s)}catch(e){console.warn(e)}})}
 function ui(){try{render()}catch(e){}}
 function fail(msg){net.err=true;net.p2pErr=msg;ui()}
 const b64=u=>{let s='';for(let i=0;i<u.length;i+=8192)s+=String.fromCharCode.apply(null,u.subarray(i,i+8192));return btoa(s)};
 async function pack(o){const s=JSON.stringify(o);try{if(window.CompressionStream){const st=new Blob([s]).stream().pipeThrough(new CompressionStream('deflate-raw'));return 'z:'+b64(new Uint8Array(await new Response(st).arrayBuffer()))}}catch(e){}return 'j:'+s}
 async function unpack(t){if(t.startsWith('j:'))return JSON.parse(t.slice(2));if(t.startsWith('z:')){const bin=atob(t.slice(2)),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);const st=new Blob([u]).stream().pipeThrough(new DecompressionStream('deflate-raw'));return JSON.parse(await new Response(st).text())}return null}
 async function handle(m){if(!m||m.event!=='message'||!m.message)return;let o;try{o=JSON.parse(m.message)}catch(e){return}if(!o||!o.u||!o.p||!o.s)return;
  if(seen[o.u]&&seen[o.u]>=o.s)return;let d=null;try{d=await unpack(o.p)}catch(e){return}if(!d)return;if(seen[o.u]&&seen[o.u]>=o.s)return;seen[o.u]=o.s;
  if(o.u===net.uid&&docs[o.u])return;docs[o.u]=d;emit()}
 async function send(id,doc,tries){const body=JSON.stringify({u:id,s:Date.now(),p:await pack(doc)});
  try{const r=await fetch(BASE+topic,{method:'POST',body,headers:{'Content-Type':'text/plain'}});if(!r.ok)throw new Error('HTTP '+r.status);seen[id]=JSON.parse(body).s}
  catch(e){if((tries||0)<3)setTimeout(()=>send(id,docs[id],(tries||0)+1),1500*((tries||0)+1));else fail('Nie udało się wysłać ruchu ('+e.message+'). Sprawdź internet.')}}
 function publish(id,doc){docs[id]=doc;emit();clearTimeout(timers[id]);timers[id]=setTimeout(()=>{if(!ready&&!topic){outbox.push(id);return}send(id,docs[id])},250)}
 async function connect(c){topic=PFX+c.toLowerCase();
  try{const r=await fetch(BASE+topic+'/json?poll=1&since=12h');if(!r.ok)throw new Error('HTTP '+r.status);const txt=await r.text();
   for(const line of txt.split('\n')){if(!line.trim())continue;let m;try{m=JSON.parse(line)}catch(e){continue}if(m.id)lastId=m.id;await handle(m)}}
  catch(e){fail('Brak połączenia z serwerem gry ('+e.message+'). Sprawdź internet i odśwież stronę.');return}
  if(topic!==PFX+c.toLowerCase())return;
  es=new EventSource(BASE+topic+'/sse'+(lastId?'?since='+lastId:''));
  es.onopen=()=>{ready=true;if(net.p2pErr&&net.p2pErr.startsWith('Utracono'))net.p2pErr=null,net.err=false;ui()};
  es.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch(x){return}if(m.id)lastId=m.id;handle(m)};
  es.onerror=()=>{};
  ready=true;ui();outbox.splice(0).forEach(id=>send(id,docs[id]));Object.keys(docs).forEach(id=>{if(id===net.uid)send(id,docs[id])})}
 const db={
  doc(path){const p=path.split('/');return {set(obj){publish(p[3],JSON.parse(JSON.stringify(obj)));return Promise.resolve()}}},
  collection(path){const c=path.split('/')[1];return {onSnapshot(cb){subs=[cb];if(code!==c){reset();code=c;connect(c)}else emit();return ()=>{subs=[]}}}}};
 function reset(){try{es&&es.close()}catch(e){}es=null;topic=null;docs={};seen={};lastId=null;ready=false;outbox=[];Object.values(timers).forEach(clearTimeout);timers={};net.err=false;net.p2pErr=null;code=null}
 async function init(){let id=null;try{id=sessionStorage.getItem('hf_uid')}catch(e){}if(!id){id='u'+Math.random().toString(36).slice(2,10);try{sessionStorage.setItem('hf_uid',id)}catch(e){}}
  net.uid=id;net.db=db;net.p2p=true;ui()}
 return {init,reset,get ready(){return ready},get host(){return false},db}})();
// wybór silnika: Firebase gdy jest konfiguracja, w przeciwnym razie P2P
(function(){const fbOk=window.firebase&&typeof FIREBASE_CONFIG!=='undefined'&&FIREBASE_CONFIG.apiKey!=='WPISZ_TUTAJ';if(!fbOk&&!net.db)P2P.init()})();
const _joinP2P=join;join=function(code){if(net.p2p){const el=document.getElementById('code'),typed=((el&&el.value)||'').trim().toUpperCase();net._host=typed!==String(code).toUpperCase()}return _joinP2P(code)};
const _goMenuP2P=goMenu;goMenu=function(){try{if(net.p2p)P2P.reset()}catch(e){}net._host=false;_goMenuP2P()};
// komunikat o stanie połączenia
const _rP2P=render;render=function(){_rP2P();try{const old=document.getElementById('p2pBar');if(old)old.remove();if(!net.p2p||!net.code)return;
 const msg=net.p2pErr?('⚠ '+net.p2pErr):(P2P.ready?'🟢 Połączono z pokojem '+net.code:'⏳ Łączenie z pokojem '+net.code+'… (jeśli trwa długo, sprawdź internet)');
 const d=document.createElement('div');d.id='p2pBar';d.className=net.p2pErr?'err':'';d.textContent=msg;document.body.appendChild(d)}catch(e){}};
render();

const SFXDATA={"charge": "@@asset:audio/sfxdata_charge.mp3@@", "confirm": "@@asset:audio/sfxdata_confirm.mp3@@", "crash": "@@asset:audio/sfxdata_crash.mp3@@", "drone": "@@asset:audio/sfxdata_drone.mp3@@", "heal": "@@asset:audio/sfxdata_heal.mp3@@", "hit": "@@asset:audio/sfxdata_hit.mp3@@", "jump": "@@asset:audio/sfxdata_jump.mp3@@", "knock": "@@asset:audio/sfxdata_knock.mp3@@", "ko": "@@asset:audio/sfxdata_ko.mp3@@", "levelup": "@@asset:audio/sfxdata_levelup.mp3@@", "magic": "@@asset:audio/sfxdata_magic.mp3@@", "miss": "@@asset:audio/sfxdata_miss.mp3@@", "phase": "@@asset:audio/sfxdata_phase.mp3@@", "pickup": "@@asset:audio/sfxdata_pickup.mp3@@", "pistol": "@@asset:audio/sfxdata_pistol.mp3@@", "poison": "@@asset:audio/sfxdata_poison.mp3@@", "punch": "@@asset:audio/sfxdata_punch.mp3@@", "select": "@@asset:audio/sfxdata_select.mp3@@", "sheep": "@@asset:audio/sfxdata_sheep.mp3@@", "shield": "@@asset:audio/sfxdata_shield.mp3@@", "sniper": "@@asset:audio/sfxdata_sniper.mp3@@", "splash": "@@asset:audio/sfxdata_splash.mp3@@", "staff": "@@asset:audio/sfxdata_staff.mp3@@", "step": "@@asset:audio/sfxdata_step.mp3@@", "swing": "@@asset:audio/sfxdata_swing.mp3@@", "teleport": "@@asset:audio/sfxdata_teleport.mp3@@", "thrust": "@@asset:audio/sfxdata_thrust.mp3@@", "win": "@@asset:audio/sfxdata_win.mp3@@"};
