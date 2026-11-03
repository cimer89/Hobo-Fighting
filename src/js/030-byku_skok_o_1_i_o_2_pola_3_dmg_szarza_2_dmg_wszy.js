/* ===================== BYKU: skok (o 1 i o 2 pola) = 3 DMG, szarża = 2 DMG (wszystkie tryby) ===================== */
(function(){try{let s=sim.toString();const rep=(a,b)=>{if(!s.includes(a)){console.warn('byku bal: '+a);return}s=s.split(a).join(b)};
 rep("const fj=g.filter(i=>S[i].ch==='Byku'&&(TB()?mv[i]>=1:mv[i]===2));","const fj=g.filter(i=>S[i].ch==='Byku'&&(mv[i]>=1||(planOf(i)&&planOf(i).t==='move')));");
 /* skok w miejscu: Byku podskakuje i ląduje na swoim polu – widać to w animacji */
 rep("if(ch)ev.push({k:'move',id:x.id,from,to,ph,jump:x.ch==='Byku',far,tele:x.ch==='Truchel'});","if(ch||x.ch==='Byku')ev.push({k:'move',id:x.id,from,to,ph,jump:x.ch==='Byku',far,tele:x.ch==='Truchel',stay:!ch});");
 rep("others.forEach(i=>dmg(i,TB()?2:1,'lądowanie Byka',fj[0]));","others.forEach(i=>dmg(i,3,'lądowanie Byka',fj[0]));");
 rep("dmg(j,(TB()?1:3)+extra,'szarża Byka',i)","dmg(j,2+extra,'szarża Byka',i)");
 sim=(0,eval)('('+s+')')}catch(e){console.warn(e)}
 const TXT='Skok o 1–2 pola albo w miejscu: lądowanie na przeciwniku = 3 DMG (także skok w miejscu, gdy ktoś wejdzie na pole Byka). Szarża (faza II): na wprost do pierwszej postaci, 2 DMG i odrzucenie o 1 pole.';
 try{C['Byku'].txt=TXT;if(typeof TBORIG!=='undefined')TBORIG['Byku']=TXT;if(typeof TBTXT!=='undefined')TBTXT['Byku']=TXT}catch(e){}
 /* podpowiedź przy szarży */
 const _r=render;render=function(){_r.apply(this,arguments);try{if(st.ch!=='Byku')return;
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const v=n.nodeValue;if(v&&/\((1|3) DMG i odrzucenie o 1 pole\)/.test(v))n.nodeValue=v.replace(/\((1|3) DMG i odrzucenie o 1 pole\)/,'(2 DMG i odrzucenie o 1 pole)')}}catch(e){}};
})();

