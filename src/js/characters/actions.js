/* ===================== Postacie: akcje i ich opisy ===================== */
/* --- z części: NOWE POSTACIE (Pasterz, Truchel, Sierżant Przemo) + PUNKTACJA --- */
function whyTxt(w){return {'Wiatrak':'Wiatrak trafił 2+ przeciwników','Długi':'trafienie na najdalszym polu','Żyleta':'trafienie z 4+ heksów','Byku':'udana szarża','Ciotka':'przesunięcie: kolizja lub strefa','Pasterz':'owca trafiła przeciwnika','Truchel':'trucizna zraniła przeciwnika','Sierżant Przemo':'trafienie z 4+ heksów lub dronem','strefa':'zmiana strefy'}[w]||w}
function actDefs(ch,ph){
 if(ch==='Byku')return [{t:'move',l:'Skok'},{t:'atk',l:'Szarża',dis:ph<1}];
 if(ch==='Pasterz'){const s=sheepAtPhase(ph);return [{t:'move',l:'Ruch'},{t:'smove',l:'Ruch owcy',dis:!s},{t:'summon',l:'Przywołaj',dis:!!s},{t:'atk',l:'Szarża owcy',dis:!s}]}
 if(ch==='Truchel')return [{t:'move',l:'Teleport'},{t:'atk',l:'Kałuża'}];
 if(ch==='Sierżant Przemo'){const on=droneAt(ph);return [{t:'move',l:'Ruch'},{t:'atk',l:'Pistolet'},{t:'drone',l:ph===0?'Dron (aktywuj)':'Dron (wyślij)',dis:ph===0?on:(ph===1?!on:true)}]}
 return [{t:'move',l:'Ruch'},{t:'atk',l:'Atak'}]}
function actTxt(ch,x,pos,ph){const t=x.t;
 if(t==='move')return K(...x.m)===K(...pos)?'zostaje':(ch==='Byku'?'skok → ':ch==='Truchel'?'teleport → ':'ruch → ')+x.m.join(', ');
 if(t==='smove')return 'ruch owcy → '+x.m.join(', ');
 if(t==='summon')return 'przywołuje owcę → '+x.m.join(', ');
 if(t==='drone')return ph===0?'aktywuje drona':'wysyła drona → '+(x.m?x.m.join(', '):'?');
 return (ch==='Byku'?'szarża ':ch==='Pasterz'?'szarża owcy ':ch==='Truchel'?'kałuża ':ch==='Sierżant Przemo'?'pistolet ':'atak ')+DN[x.d]}
function planTxt(p){let pos=p.posr[st.round];return p.plans[st.round].map((x,i)=>{const t=actTxt(p.ch,x,pos,i);if(x.t==='move')pos=x.m;return 'Faza '+['I','II','III'][i]+': '+t}).join(' · ')}
/* --- z części: ŻYLETA: STRZAŁ SNAJPERSKI (Testy) --- */
function zylAim(){const p=st.plan&&st.plan[0];return p&&p.t==='aim'&&p.d!=null?p.d:null}
