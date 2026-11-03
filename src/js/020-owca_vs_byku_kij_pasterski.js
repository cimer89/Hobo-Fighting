/* ===================== OWCA vs BYKU, KIJ PASTERSKI ===================== */
/* planowanie: kij */
const _adP=actDefs;actDefs=function(ch,ph){const d=_adP(ch,ph);if(TB()&&ch==='Pasterz')return d.concat([{t:'staff',l:'Kij'}]);return d};
const _okP=planOk;planOk=function(pl,ph){if(pl.t==='staff')return pl.d!==null;return _okP(pl,ph)};
const _tapP=planTap;planTap=function(pl,q,r,from,i){if(pl.t==='staff'){if(i>=0)pl.d=i;return}return _tapP(pl,q,r,from,i)};
const _hintP=planHint;planHint=function(pl,ph){if(pl.t==='staff')return pl.d===null?'Kij pasterski: dotknij pola obok, by wybrać kierunek.':'Kij: '+DN[pl.d]+' (2 pola, 2 DMG każdemu na nich).';return _hintP(pl,ph)};
const _hlP=extraHL;extraHL=function(hl,pl,from,ph){if(pl.t==='staff'){if(pl.d===null){nbCells(from).forEach(c=>{hl[K(...c)]={stroke:'var(--hit)'}});return}
 for(let k=1;k<=2;k++){const q=from[0]+D[pl.d][0]*k,r=from[1]+D[pl.d][1]*k;if(IN(q,r))hl[K(q,r)]={fill:'color-mix(in srgb,var(--hit) 45%,transparent)',stroke:'var(--hit)',t:'2'}}return}return _hlP(hl,pl,from,ph)};
const _atP=actTxt;actTxt=function(ch,x,pos,ph){if(x.t==='staff')return 'kij '+DN[x.d];return _atP(ch,x,pos,ph)};
TBTXT['Pasterz']='Zaczyna z owcą obok. Owca (1 HP): ruch, szarża 2 DMG przez całą linię. Kij: 2 pola przed sobą, 2 DMG każdemu. 7 HP.';
/* przykłady */
(function(){const oP=DEMOS['Pasterz'];DEMOS['Pasterz']=()=>{const l=oP();if(!TB())return l;
 l.splice(1,0,{t:'Kij',d:'Kij pasterski: 2 pola przed Pasterzem, 2 DMG każdemu, kto na nich stoi.',T:4400,run(a){a.tok('h','hero',DH).tok('f0','foe',N(DH,2)).tok('f1','foe',N(DH,2,2));
  dmAt(300,()=>{a.mark(dmNb(DH),'opt');a.cap('Wybierz kierunek: pole obok siebie.')});
  dmAt(1400,()=>{a.clear();a.mark([N(DH,2),N(DH,2,2)],'hit',['2','2']);a.cap('Kij sięga 2 pola przed siebie…')});
  dmAt(2200,()=>{a.act('h','swing');a.dmg('f0','−2');a.dmg('f1','−2');a.cap('…i bije <b>każdego</b> na tych polach: 2 DMG.')})}});
 return l};
 const oB=DEMOS['Byku'];DEMOS['Byku']=()=>{const l=oB();l.splice(2,0,{t:'Zderzenie z owcą',tag:'faza II',d:'Gdy Byku szarżuje na owcę, zatrzymuje się na jej polu, a owca ginie. Jeśli owca szarżowała naprzeciw niego, Byku też dostaje obrażenia.',T:4600,run(a){const s0=N(DH,2,3);a.tok('h','hero',DH).tok('s','sheep',s0);
  dmAt(300,()=>{a.mark([N(DH,2),N(DH,2,2),s0],'hit');a.cap('Byku i owca szarżują na siebie…')});
  dmAt(1300,()=>{a.clear();a.mv('h',s0,'fast',[-6,3])});
  dmAt(1700,()=>{a.dmg('s','−1');a.gone('s');a.dmg('h',TB()?'−2':'−1');a.cap('<b>Zderzenie!</b> Owca ginie, Byku zostaje na miejscu uderzenia i dostaje obrażenia od owcy.')})}});return l}})();
render();
