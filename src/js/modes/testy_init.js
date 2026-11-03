/* kształty ataków trybu Testy: engine/combat.js (Combat.shape) */
Object.keys(C).forEach(k=>TBORIG[k]=C[k].txt);
const _rTB=render;
render=function(){tbTexts();try{tbInit()}catch(e){console.warn(e)}_rTB()};
/* przykłady akcji w trybie testów */
(function(){const oB=DEMOS['Byku'];DEMOS['Byku']=()=>{const l=oB();if(!TB())return l;
  l[0]={t:'Skok',tag:'2 pola: tylko faza I',d:TBTXT['Byku'],T:4800,run(a){const to=N(DH,2,2);a.tok('f0','foe',to).tok('h','hero',DH);
   dmAt(300,()=>{a.mark(dmAll().filter(c=>dmDist(c,DH)<=2),'opt');a.cap('Faza I: skok do 2 pól. W fazie II tylko o 1 pole.')});
   dmAt(1500,()=>{a.clear();a.mark([to],'pick');a.cap('Skaczesz na pole przeciwnika…')});
   dmAt(2100,()=>{a.clear();a.mv('h',to,'jump',[-7,3]);a.mv('f0',to,0,[8,-3])});
   dmAt(2650,()=>{a.mark([to],'hit');a.dmg('f0','−1');a.cap('Daleki skok na wroga: <b>1 DMG</b> dla niego, Byku bez obrażeń.')})}};
  l[1]={t:'Szarża',tag:'tylko faza II',d:'Szarża na wprost przez całą planszę do pierwszej postaci lub ściany: 2 DMG i odrzucenie o 1 pole.',T:5000,run(a){const f=N(DH,2,3);a.tok('f0','foe',f).tok('h','hero',DH);
   dmAt(300,()=>{a.mark(dmNb(DH),'opt');a.cap('Faza II: wybierz kierunek szarży.')});
   dmAt(1300,()=>{a.clear();a.mark(attack(DH,2,1,'Byku').map(c=>[c[0],c[1]]),'hit');a.cap('Byku pędzi przez całą planszę…')});
   dmAt(2100,()=>{a.clear();a.mv('h',N(DH,2,2),'fast')});
   dmAt(2500,()=>{a.dmg('f0','−2');a.mv('f0',N(DH,2,4));a.mark([N(DH,2,4)],'hit');a.cap('<b>2 DMG</b> i odrzut o 1 pole. Wepchnięcie na kogoś: obaj −1.')})}};
  return l};
 const oP=DEMOS['Pasterz'];DEMOS['Pasterz']=()=>{const l=oP();if(!TB())return l;
  l[1].d='W trybie testów Pasterz zaczyna grę z owcą obok. Gdy owca zginie, przywołujesz nową na pole obok.';
  l[3]={t:'Szarża owcy',d:'Owca biegnie przez całą linię i uderza każdego po drodze za 2 DMG.',T:4600,run(a){const s=N(DH,2),f1=N(s,2,1),f2=N(s,2,2);a.tok('h','hero',DH).tok('s','sheep',s).tok('f0','foe',f1).tok('f1','foe',f2);
   dmAt(300,()=>{a.mark(dmNb(s),'opt');a.cap('Wybierz kierunek: pole obok owcy.')});
   dmAt(1400,()=>{a.clear();a.mark([f1,f2,N(s,2,3)],'hit');a.cap('Owca szarżuje przez całą linię…')});
   dmAt(2000,()=>{a.mv('s',N(s,2,3),'fast')});
   dmAt(2300,()=>{a.dmg('f0','−2');a.dmg('f1','−2');a.cap('…i taranuje <b>każdego</b> po drodze: 2 DMG.')})}};
  return l};
})();
render();
