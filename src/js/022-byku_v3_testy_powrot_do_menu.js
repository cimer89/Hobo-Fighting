/* ===================== BYKU v3 (Testy) + POWRÓT DO MENU ===================== */
(function(){let s=sim.toString();const rep=(a,b)=>{if(s.split(a).length!==2)throw new Error('byku3: '+a);s=s.replace(a,b)};
 // skok: lądowanie na wrogu (skok o 1 lub 2 pola) = 2 DMG, Byku bez obrażeń
 rep("const fj=g.filter(i=>S[i].ch==='Byku'&&mv[i]===2);","const fj=g.filter(i=>S[i].ch==='Byku'&&(TB()?mv[i]>=1:mv[i]===2));");
 rep("others.forEach(i=>dmg(i,1,'lądowanie Byka',fj[0]));","others.forEach(i=>dmg(i,TB()?2:1,'lądowanie Byka',fj[0]));");
 // szarża: pudło przy aktywnej strefie = uderzenie w ścianę strefy (−1), Byku zostaje przy ścianie
 rep("let cur=x.pos.slice(),hitCell=null,steps=0,shCl=null;","let cur=x.pos.slice(),hitCell=null,steps=0,shCl=null,crash=false;");
 rep("if(!IN(nq,nr))break;cur=[nq,nr];steps++;\n    shCl=","if(!IN(nq,nr))break;if(TB()&&zoneR(round)<3&&dist(...cur)<=zoneR(round)&&dist(nq,nr)>zoneR(round)){crash=true;break}cur=[nq,nr];steps++;\n    shCl=");
 rep("hit:victims.length>0||!!shCl,dir:a.d,bd:extra>0});\n   x.pos=cur.slice();","hit:victims.length>0||!!shCl,dir:a.d,bd:extra>0,crash});\n   x.pos=cur.slice();if(crash){ev.push({k:'hit',id:x.id,ph});dmg(i,1,'ściana strefy')}");
 sim=(0,eval)('('+s+')')})();
TBTXT['Byku']='Skok o 1–2 pola (o 2 tylko w fazie I): wylądowanie na polu przeciwnika = 2 DMG, Byku bez obrażeń. Szarża (faza II): przez całą planszę, 1 DMG i odrzut. Pudło przy strefie = uderzenie w ścianę: Byku −1.';
const _hintB=planHint;planHint=function(pl,ph){if(TB()&&st.ch==='Byku'){
 if(pl.t==='move')return (ph>0?'Faza II: skok o 1 pole':'Skok o 1–2 pola')+'. Wyląduj na przeciwniku: 2 DMG dla niego.';
 if(pl.t==='atk'&&pl.d!==null)return 'Szarża: '+DN[pl.d]+' (1 DMG i odrzut).'+(zoneR(st.round)<3?' Uwaga: pudło = uderzenie w ścianę strefy, −1 HP.':'')}
 return _hintB(pl,ph)};
(function(){const oB=DEMOS['Byku'];DEMOS['Byku']=()=>{const l=oB();if(!TB())return l;
 l[0]={t:'Skok',tag:'2 pola: tylko faza I',d:'Skok o 1–2 pola. Wylądowanie dokładnie na polu przeciwnika zadaje mu 2 DMG, Byku nie traci HP.',T:4600,run(a){const to=N(DH,2);a.tok('f0','foe',to).tok('h','hero',DH);
  dmAt(300,()=>{a.mark(dmAll().filter(c=>dmDist(c,DH)<=2&&dmDist(c,DH)>0),'opt');a.cap('Zasięg skoku: 1–2 pola (2 pola tylko w fazie I).')});
  dmAt(1500,()=>{a.clear();a.mark([to],'pick');a.cap('Musisz trafić <b>dokładnie</b> w pole przeciwnika…')});
  dmAt(2100,()=>{a.clear();a.mv('h',to,'jump',[-7,3]);a.mv('f0',to,0,[8,-3])});
  dmAt(2650,()=>{a.mark([to],'hit');a.dmg('f0','−2');a.cap('Trafiony skok: <b>2 DMG</b>, Byku bez obrażeń.')})}};
 l.splice(2,0,{t:'Ściana strefy',tag:'gdy jest strefa',d:'Gdy strefa już się zmniejszyła, a szarża nikogo nie trafi, Byku wpada na ścianę strefy i traci 1 HP.',T:4600,run(a){a.tok('h','hero',DH);
  dmAt(200,()=>{a.mark(dmAll().filter(c=>dmDist(c,[0,0])>2),'hit');a.cap('Czerwone pola: poza strefą.')});
  dmAt(1200,()=>{a.cap('Szarża w pustą linię…')});
  dmAt(1800,()=>{a.mv('h',[0,-2],'fast')});
  dmAt(2200,()=>{a.act('h','shk');a.dmg('h','−1');a.cap('<b>Bum!</b> Ściana strefy: Byku −1 HP i zatrzymuje się przy niej.')})}});
 return l}})();
/* --- powrót do menu bez przeładowania strony --- */
function goMenu(){
 try{dmStop()}catch(e){}
 try{if(net.unsub)net.unsub()}catch(e){}
 ['resModal','modalBar','selOv','demoOv','bonBar','legBar','sndPanel','wheelOv'].forEach(id=>{const e=document.getElementById(id);if(e)e.remove()});
 document.querySelectorAll('.wheel,.wov,#wheel').forEach(e=>e.remove());
 H=null;net.code=null;net.pl={};net.unsub=null;
 Object.keys(ME).forEach(k=>delete ME[k]);Object.assign(ME,{ch:null,start:null,sready:false,plans:{},posr:{},hp:5,hpr:{1:5},hpo:{}});
 const keep={_started:true};Object.keys(st).forEach(k=>delete st[k]);
 Object.assign(st,{scr:'lobby',lastPanel:null,leaving:false,round:1,ch:'Wiatrak',start:null,slot:0,ph:0,mode:'move',plan:[{m:null,d:null},{m:null,d:null}],done:false},keep);
 app.style.display='';st._selHid=false;BOARD_SVG=null;
 window.scrollTo(0,0);render()}
window.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-a="newgame"]');if(!t)return;e.preventDefault();e.stopImmediatePropagation();try{SND.play('click')}catch(_){}goMenu()},true);
render();
