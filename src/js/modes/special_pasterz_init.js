/* 7 HP */
MAXHP=function(ch){return (TB()&&TBHP[ch])||(isSp()&&ch==='Pasterz'?TBHP['Pasterz']:0)||5};
/* opis na karcie postaci */
const _tbtSP=tbTexts;
tbTexts=function(){_tbtSP();if(isSp()&&!TB()&&TBTXT['Pasterz'])C['Pasterz'].txt=TBTXT['Pasterz']};
addRender('modes/special_pasterz_init',_rSP=>function(){try{spInit()}catch(e){console.warn(e)}_rSP()});
/* akcja Kij */
const _adSP=actDefs;
actDefs=function(ch,ph){const d=_adSP(ch,ph);if(isSp()&&ch==='Pasterz'&&!d.some(a=>a.t==='staff'))return d.concat([{t:'staff',l:'Kij'}]);return d};
/* podpowiedź szarży owcy */
const _hintSP=planHint;
planHint=function(pl,ph){if(isSp()&&st.ch==='Pasterz'&&pl.t==='atk'&&pl.d!==null&&pl.d!==undefined)return 'Szarża owcy: '+DN[pl.d]+' (2 DMG każdej postaci w linii).';return _hintSP(pl,ph)};
/* przykłady akcji: wersja z Testów */
(function(){const oP=DEMOS['Pasterz'];DEMOS['Pasterz']=()=>{if(!isSp())return oP();const g=st.gm;st.gm='test';let l;try{l=oP()}finally{st.gm=g}
  l.forEach(it=>{if(it&&typeof it.d==='string')it.d=it.d.replace('W trybie testów','W trybie specjalnym')});return l};
 const oB=DEMOS['Byku'];DEMOS['Byku']=()=>{const l=oB();if(!isSp())return l;
  l.forEach(it=>{if(!it||it.t!=='Zderzenie z owcą'||typeof it.run!=='function')return;const r=it.run;
   it.run=function(a){const px=new Proxy(a,{get(t,k){if(k==='dmg')return (id,txt)=>t.dmg(id,id==='h'&&txt==='−1'?'−2':txt);const v=t[k];return typeof v==='function'?v.bind(t):v}});return r.call(this,px)}});
  return l}})();
render();
