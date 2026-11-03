/* ===================== CIOTKA: faza II 2 DMG (Testy) ===================== */
(function(){const _a=attack;attack=function(p,d,ph,ch){ch=ch||st.ch;if(TB()&&ch==='Ciotka'){const out=[],[dq,dr]=D[d];for(let k=1;k<=3;k++){const q=p[0]+dq*k,r=p[1]+dr*k;if(!IN(q,r))break;out.push([q,r,2])}return out}return _a(p,d,ph,ch)}})();
TBTXT['Ciotka']='Linia 3 pól, 2 DMG w obu fazach. W fazie II dodatkowo przesuwa trafioną postać o 1 pole.';
(function(){let s=DEMOS['Ciotka'].toString();const rep=(a,b)=>{if(!s.includes(a))throw new Error('ciotka demo: '+a);s=s.split(a).join(b)};
 rep("[[0,'−1']],{ph:1","[[0,TB()?'−2':'−1']],{ph:1");
 rep("c1:'Faza II: linia 3 pól, 1 DMG…'","c1:'Faza II: linia 3 pól, '+(TB()?2:1)+' DMG…'");
 rep("'Faza II: 1 DMG i przesunięcie trafionej postaci o 1 pole.","(TB()?'Faza II: 2 DMG':'Faza II: 1 DMG')+' i przesunięcie trafionej postaci o 1 pole.");
 DEMOS['Ciotka']=(0,eval)('('+s+')')})();
render();
