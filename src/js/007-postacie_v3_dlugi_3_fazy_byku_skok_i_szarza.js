/* ===================== POSTACIE v3: Długi (3 fazy), Byku (Skok i Szarża) ===================== */
function nPh(ch){return ch==='Długi'?3:2}
function newPlan(){const a=[];for(let i=0;i<nPh(st.ch);i++)a.push({t:null,m:null,d:null});return a}
function stepperHtml(cur,tot){const N=['I','II','III'],ci=N.indexOf(cur),n=N.indexOf(tot)+1;let h='<div class="stepper"><b>FAZA</b>';for(let i=0;i<n;i++)h+='<i class="'+(i===ci?'on':(i<ci?'done':''))+'">'+N[i]+'</i>';return h+'</div>'}

render();
Object.assign(IMG,{"Pasterz": '', "Truchel": '', "Sierżant Przemo": ''});
Object.assign(CHA,{"Pasterz": '', "Truchel": '', "Sierżant Przemo": ''});
Object.assign(ART,{"Pasterz": '', "Truchel": '', "Sierżant Przemo": ''});
