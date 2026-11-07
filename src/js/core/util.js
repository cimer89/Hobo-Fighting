/* ===================== Narzędzia ogólne ===================== */
/* --- z części: js/000-start.js --- */
/* Warstwy renderu: każdy moduł dokłada swoją warstwę wokół render() przez addRender(nazwa, poprzedni=>nowa funkcja).
   Ostatnia dodana warstwa jest zewnętrzna (jej kod „przed” działa pierwszy, „po” – ostatni).
   Kolejność dodawania wyznacza src/manifest.json; aktualną listę pokazuje RENDER_LAYERS. */
const RENDER_LAYERS=[];
function addRender(name,wrap){const inner=render;render=wrap(inner);RENDER_LAYERS.push(name)}
function dist(q,r){return Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r))}
async function wait(ms){for(let t=0;t<ms&&!st.skipReq;t+=40)await new Promise(r=>setTimeout(r,40))}
function tween(ms,f){return new Promise(res=>{const t0=performance.now();(function step(){if(st.skipReq){f(1);return res()}const t=Math.min(1,(performance.now()-t0)/ms);f(t);if(t<1)requestAnimationFrame(step);else res()})()})}
/* --- z części: PSEUDO-3D: stojaki, podniesione pola, kamera --- */
function shade(hex,f){const n=parseInt(hex.slice(1),16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;const m=v=>Math.max(0,Math.min(255,Math.round(v*(1+f))));return 'rgb('+m(r)+','+m(g)+','+m(b)+')'}
/* --- z części: TRYBY GRY + TRYB SPECJALNY (przedmioty na mapie) --- */
function rng(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return function(){h+=0x6D2B79F5;let t=h;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
/* --- z części: ŻETONY-PORTRETY v2 --- */
function idByName(s){const o=(st.animItems||[]).find(o=>o.q.ch&&s.startsWith(o.q.ch));return o?o.id:null}
/* --- z części: PROFILE GRACZY, RANKING I STATYSTYKI (Firebase: Firestore + logowanie anonimowe) --- */
function hfEsc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
