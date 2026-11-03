/* ===================== Stan gry: ekran, gracze, sieć ===================== */
/* --- z części: js/000-start.js --- */
let BAN='';
let BG='';
const st={scr:'splash',lastPanel:null,leaving:false,round:1,ch:'Wiatrak',start:null,slot:0,ph:0,mode:'move',plan:[{m:null,d:null},{m:null,d:null}],done:false};
const app=document.getElementById('app');
function myHp(){const q=H?H.p[H.cur]:ME;return q.hpr&&q.hpr[st.round]!==undefined?q.hpr[st.round]:5}
let BOARD_SVG=null;
const net={db:null,uid:null,code:null,pl:{},unsub:null,err:false};
const ME={ch:null,start:null,sready:false,plans:{},posr:{},hp:5,hpr:{1:5},hpo:{}};
function alive(p,r){const v=p.hpr&&p.hpr[r];return (v===undefined?5:v)>0}
let H=null;
let LAST_BOARD=null;
/* --- z części: BONUSY POSTACI --- */
function mine(id){return H?true:id===net.uid}
function curP(){return H?(H.p[H.cur]||null):ME}
function curItems(){return H?H.p.map((q,i)=>({id:'p'+i,q,idx:i})):netItems()}
function playerOf(id){if(H){const i=+String(id).slice(1);return H.p[i]||null}if(id===net.uid)return ME;return (net.pl&&net.pl[id])||null}
function saveP(p){if(!H&&p===ME)save()}
/* --- z części: STYL: postacie, metal i skóra, wybór startu --- */
const SPLURI='@@asset:img/spluri.jpg@@';
