/* ===================== BYKU: skok (o 1 i o 2 pola) = 3 DMG, szarża = 2 DMG (wszystkie tryby) ===================== */
(function(){ const TXT='Skok o 1–2 pola albo w miejscu: lądowanie na przeciwniku = 3 DMG (także skok w miejscu, gdy ktoś wejdzie na pole Byka). Szarża (faza II): na wprost do pierwszej postaci, 2 DMG i odrzucenie o 1 pole.';
 try{C['Byku'].txt=TXT;if(typeof TBORIG!=='undefined')TBORIG['Byku']=TXT;if(typeof TBTXT!=='undefined')TBTXT['Byku']=TXT}catch(e){}
 /* podpowiedź przy szarży */
 const _r=render;render=function(){_r.apply(this,arguments);try{if(st.ch!=='Byku')return;
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const v=n.nodeValue;if(v&&/\((1|3) DMG i odrzucenie o 1 pole\)/.test(v))n.nodeValue=v.replace(/\((1|3) DMG i odrzucenie o 1 pole\)/,'(2 DMG i odrzucenie o 1 pole)')}}catch(e){}};
})();

