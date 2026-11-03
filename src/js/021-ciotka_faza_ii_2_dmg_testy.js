/* ===================== CIOTKA: faza II 2 DMG (Testy) ===================== */
(function(){const _a=attack;attack=function(p,d,ph,ch){ch=ch||st.ch;if(TB()&&ch==='Ciotka'){const out=[],[dq,dr]=D[d];for(let k=1;k<=3;k++){const q=p[0]+dq*k,r=p[1]+dr*k;if(!IN(q,r))break;out.push([q,r,2])}return out}return _a(p,d,ph,ch)}})();
TBTXT['Ciotka']='Linia 3 pól, 2 DMG w obu fazach. W fazie II dodatkowo przesuwa trafioną postać o 1 pole.';
render();
