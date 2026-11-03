const _hopPrev={};
const _capSetT=capSet;
capSet=function(t){_capSetT(t);if(!t||!st.animating)return;const s=String(t);
 if(/atakuje|szarżuje|wysyła drona|tworzy kałużę|szarża owcy|przywołuje owcę/.test(s)){const id=idByName(s);if(id)tkFx(id,'atk',460)}
 if(/ odpada/.test(s)){const id=idByName(s);if(id)tkFx(id,'ko',0)}
 if(/−\d/.test(s))s.split(',').forEach(part=>{const id=idByName(part.trim());if(id)tkFx(id,'hurt',480)})};
render();
