/* ===================== ŻYLETA: STRZAŁ SNAJPERSKI (Testy) ===================== */
TBP.zylR=9;TBP.zyl2=2;
TBTXT['Żyleta']='Strzał: trafia pierwszą postać, 2 DMG na 2 pierwszych polach, dalej 1 DMG. Strzał snajperski (2 akcje): faza I celowanie, faza II 3 DMG przez całą planszę.';
function zylAim(){const p=st.plan&&st.plan[0];return p&&p.t==='aim'&&p.d!=null?p.d:null}
const _adS=actDefs;actDefs=function(ch,ph){if(TB()&&ch==='Żyleta'){
 if(ph===0)return [{t:'move',l:'Ruch'},{t:'atk',l:'Strzał'},{t:'aim',l:'Celuj'}];
 return [{t:'move',l:'Ruch'},{t:'atk',l:'Strzał'},{t:'snipe',l:'Snajperski',dis:zylAim()===null}]}return _adS(ch,ph)};
const _okS=planOk;planOk=function(pl,ph){if(pl.t==='aim')return pl.d!==null;if(pl.t==='snipe')return zylAim()!==null;return _okS(pl,ph)};
const _tapS=planTap;planTap=function(pl,q,r,from,i){if(pl.t==='aim'){if(i>=0)pl.d=i;return}if(pl.t==='snipe')return;return _tapS(pl,q,r,from,i)};
const _hintS=planHint;planHint=function(pl,ph){if(TB()&&st.ch==='Żyleta'){
 if(pl.t==='aim')return pl.d===null?'Celowanie: dotknij pola obok, by wybrać kierunek. W fazie II oddasz strzał snajperski.':'Celujesz: '+DN[pl.d]+'. W fazie II wybierz „Snajperski”.';
 if(pl.t==='snipe')return 'Strzał snajperski: '+DN[zylAim()]+', 3 DMG pierwszej postaci przez całą planszę.';
 if(pl.t==='atk')return pl.d===null?'Strzał: dotknij pola obok, by wybrać kierunek.':'Strzał: '+DN[pl.d]+' (2 DMG na 2 pierwszych polach, dalej 1).';
 if(!pl.t&&ph===1&&zylAim()!==null)return 'Wycelowałaś w fazie I: wybierz „Snajperski”, żeby strzelić za 3 DMG.'}
 return _hintS(pl,ph)};
const _hlS=extraHL;extraHL=function(hl,pl,from,ph){
 if(TB()&&st.ch==='Żyleta'&&(pl.t==='aim'||pl.t==='snipe')){const d=pl.t==='aim'?pl.d:zylAim();
  if(d===null||d===undefined){nbCells(from).forEach(c=>{hl[K(...c)]={stroke:'var(--hit)'}});return}
  let cur=from.slice();for(;;){const nq=cur[0]+D[d][0],nr=cur[1]+D[d][1];if(!IN(nq,nr))break;cur=[nq,nr];hl[K(nq,nr)]={fill:pl.t==='aim'?'color-mix(in srgb,#ffe066 30%,transparent)':'color-mix(in srgb,var(--hit) 45%,transparent)',stroke:pl.t==='aim'?'#ffe066':'var(--hit)',t:pl.t==='aim'?'◎':'3'}}return}
 return _hlS(hl,pl,from,ph)};
const _atS=actTxt;actTxt=function(ch,x,pos,ph){if(x.t==='aim')return 'celuje '+DN[x.d];if(x.t==='snipe')return 'strzał snajperski';return _atS(ch,x,pos,ph)};
/* przykład w „Zobacz akcje” */
(function(){const oZ=DEMOS['Żyleta'];DEMOS['Żyleta']=()=>{const l=oZ();if(!TB())return l;
 l[1]=dmLine('Strzał','Strzał trafia pierwszą postać na drodze: 2 DMG na 2 pierwszych polach, dalej 1 DMG.',[N(DH,2,3)],[[0,'−1']],{shot:N(DH,2,3),c1:'Strzał leci przez całą planszę…',c2:'Cel jest dalej niż 2 pola: <b>1 DMG</b>. Z bliska byłoby 2.'});
 l.splice(2,0,{t:'Snajperski',tag:'2 akcje',d:'Faza I: celujesz w wybranym kierunku. Faza II: strzał za 3 DMG w pierwszą postać, przez całą planszę.',T:5200,run(a){const f=N(DH,2,4);a.tok('h','hero',DH).tok('f0','foe',f);
  dmAt(300,()=>{a.mark(dmNb(DH),'opt');a.cap('<b>Faza I:</b> celowanie, wybierz kierunek.')});
  dmAt(1300,()=>{a.clear();a.mark([1,2,3,4].map(k=>N(DH,2,k)),'pick');a.cap('Żyleta celuje (cała faza I).')});
  dmAt(2600,()=>{a.clear();a.mark([1,2,3,4].map(k=>N(DH,2,k)),'hit');a.cap('<b>Faza II:</b> strzał snajperski!')});
  dmAt(3100,()=>{a.act('h','swing');a.shot(DH,f,'#ff6b5b');a.dmg('f0','−3');a.cap('<b>3 DMG</b> pierwszej postaci, przez całą planszę.')})}});
 return l}})();
render();
