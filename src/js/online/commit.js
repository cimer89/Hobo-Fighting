/* ===================== Online: tajne plany (zobowiązanie i ujawnienie) ===================== */
/* Gracz najpierw zapisuje w pokoju tylko skrót SHA-256 swojego planu (z losową solą).
   Plan i sól wysyła dopiero, gdy wszyscy żywi gracze zapisali swoje skróty.
   Skróty innych graczy są „zamrażane” w chwili, gdy wszyscy się zobowiązali; ujawniony plan musi do nich pasować,
   inaczej gracz jest oznaczany jako podejrzany (zmiana planu po zobaczeniu cudzych). */
const GAME_VERSION='@@BUILD@@';
const Commit=(function(){
 const ok=!!(window.crypto&&crypto.subtle&&window.TextEncoder);
 const hex=a=>[...new Uint8Array(a)].map(x=>x.toString(16).padStart(2,'0')).join('');
 async function sha(s){return hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))}
 function salt(){const a=new Uint8Array(16);crypto.getRandomValues(a);return hex(a)}
 const mine={},opened={},locked={},checked={},bad={};
 /* mój plan pod kluczem key -> {h: skrót, salt}; nowy skrót tylko gdy plan się zmienił */
 async function seal(key,obj){const pj=JSON.stringify(obj);let c=mine[key];if(!c||c.pj!==pj){const s=salt();c={pj,salt:s,h:await sha(s+'|'+key+'|'+pj)};mine[key]=c}return c}
 const open=key=>{opened[key]=true};
 const isOpen=key=>!!opened[key];
 /* zamrożenie cudzego skrótu (pierwszy zapamiętany wygrywa) */
 function lock(key,h){if(h&&!(key in locked))locked[key]=h}
 /* sprawdzenie ujawnionego planu; wynik zapamiętany; cb wołane przy wykryciu niezgodności */
 function verify(key,obj,s,h,cb){if(!ok||checked[key])return;checked[key]=1;const want=locked[key]||h;if(!want||!s){return}
  sha(s+'|'+key+'|'+JSON.stringify(obj)).then(x=>{if(x!==want){bad[key]=1;cb&&cb(key)}})}
 return {ok,seal,open,isOpen,lock,verify,bad,reset(){[mine,opened,locked,checked].forEach(o=>Object.keys(o).forEach(k=>delete o[k]))}}})();
