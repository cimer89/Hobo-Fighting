/* Automatyczne testy interakcji postaci w silniku walki (engine/combat.js).
   Uruchomienie: node tests/combat_test.js
   Każdy test opisuje sytuację, plany graczy i oczekiwany skutek zgodny z obecnymi zasadami.
   Kierunki: 0 wschód, 1 płn.-wsch., 2 płn.-zach., 3 zachód, 4 płd.-zach., 5 płd.-wsch. */
const Combat=require('../src/js/engine/combat.js');
const RULES={tb:false,pnb:false,zone:3,br:3,selfLand:false,zylR:9,zyl2:2};
let pass=0,fail=0;const fails=[];
const F=(id,ch,pos,plan,x)=>Object.assign({id,ch,pos,hp:5,plan,sh:false,dmgb:false,drone:false,sheep:null,dg:undefined,tm:null},x||{});
const M=m=>({t:'move',m}),A=d=>({t:'atk',d}),stay=p=>M(p);
function run(fighters,o){o=o||{};return Combat.run({round:o.round||1,seed:o.seed||'test:d:1',rules:Object.assign({},RULES,o.rules||{}),fighters,pushes:o.pushes||{},puddles:o.puddles||[]})}
const by=(S,id)=>S.find(x=>x.id===id);
function t(name,fn){try{fn();pass++}catch(e){fail++;fails.push(name+': '+e.message)}}
function eq(a,b,msg){const A=JSON.stringify(a),B=JSON.stringify(b);if(A!==B)throw new Error((msg||'')+' oczekiwano '+B+', jest '+A)}
const dmgOf=(S,id)=>5-by(S,id).hp;
const why=(S,id)=>S.journal.filter(e=>e.k==='dmg'&&e.id===id).map(e=>e.cause+(e.by?'<'+e.by:''));

/* --- ataki podstawowe --- */
t('Wiatrak: wachlarz – środek 2, boki 1',()=>{const S=run([F('w','Wiatrak',[0,0],[A(0),stay([0,0])]),F('a','Długi',[1,0],[stay([1,0]),stay([1,0])]),F('b','Ciotka',[1,-1],[stay([1,-1]),stay([1,-1])])]);eq(dmgOf(S,'a'),2);eq(dmgOf(S,'b'),1)});
t('Długi: linia 3 pól – 1, 1, 2',()=>{const S=run([F('d','Długi',[-2,0],[A(0),stay([-2,0])]),F('a','Wiatrak',[-1,0],[stay([-1,0]),stay([-1,0])]),F('b','Ciotka',[1,0],[stay([1,0]),stay([1,0])])]);eq(dmgOf(S,'a'),1);eq(dmgOf(S,'b'),2)});
t('Żyleta: trafia tylko pierwszą postać na linii',()=>{const S=run([F('z','Żyleta',[-2,0],[A(0),stay([-2,0])]),F('a','Wiatrak',[0,0],[stay([0,0]),stay([0,0])]),F('b','Ciotka',[1,0],[stay([1,0]),stay([1,0])])]);eq(dmgOf(S,'a'),2);eq(dmgOf(S,'b'),0)});
t('Ciotka: faza I 2 DMG, faza II 1 DMG',()=>{const S=run([F('c','Ciotka',[-2,0],[A(0),A(0)]),F('a','Wiatrak',[0,0],[stay([0,0]),stay([0,0])])],{pushes:{c:[0,1]}});eq(dmgOf(S,'a'),3)});
t('Sierżant: pistolet 1 DMG w pierwszą postać',()=>{const S=run([F('s','Sierżant Przemo',[-3,0],[A(0),stay([-3,0])]),F('a','Wiatrak',[0,0],[stay([0,0]),stay([0,0])]),F('b','Ciotka',[1,0],[stay([1,0]),stay([1,0])])]);eq(dmgOf(S,'a'),1);eq(dmgOf(S,'b'),0)});
t('atak poza planszę: brak pól poza promieniem',()=>{eq(Combat.shape('Długi',[3,0],0,0,RULES).length,0)});

/* --- Byku --- */
t('Byku: skok o 1 pole na przeciwnika = 3 DMG, Byku bez obrażeń',()=>{const S=run([F('b','Byku',[0,0],[M([1,0]),stay([1,0])]),F('a','Wiatrak',[1,0],[stay([1,0]),stay([1,0])])]);eq(dmgOf(S,'a'),3+3,'(dwa lądowania: faza I i skok w miejscu w fazie II)');eq(dmgOf(S,'b'),0)});
t('Byku: dalszy skok (2 pola) = 1 DMG',()=>{const S=run([F('b','Byku',[0,0],[M([2,0]),A(0)]),F('a','Wiatrak',[2,0],[stay([2,0]),M([3,0])])]);eq(by(S,'a').log[0],'F1: −1 lądowanie Byka')});
t('Byku: skok w miejscu = 3 DMG temu, kto wejdzie na jego pole',()=>{const S=run([F('b','Byku',[0,0],[stay([0,0]),A(3)]),F('a','Wiatrak',[1,0],[M([0,0]),M([1,0])])]);eq(by(S,'a').log[0],'F1: −3 lądowanie Byka');eq(by(S,'b').log.length,0)});
t('Byku nie skacze (szarżuje), ktoś wchodzi na jego pole: ścisk −1 dla obu',()=>{const S=run([F('b','Byku',[0,0],[stay([0,0]),A(3)]),F('a','Wiatrak',[0,1],[stay([0,1]),M([0,0])])]);eq(by(S,'a').log.includes('F2: −1 ścisk'),true);eq(by(S,'b').log.includes('F2: −1 ścisk'),true)});
t('Byku: szarża 2 DMG i odrzut o 1 pole',()=>{const S=run([F('b','Byku',[-3,0],[stay([-3,0]),A(0)]),F('a','Wiatrak',[0,0],[stay([0,0]),stay([0,0])])]);eq(dmgOf(S,'a'),2);eq(by(S,'a').pos,[1,0]);eq(by(S,'b').pos,[0,0])});
t('Byku: odrzut na zajęte pole = kolizja −1 dla obu',()=>{const S=run([F('b','Byku',[-3,0],[stay([-3,0]),A(0)]),F('a','Wiatrak',[0,0],[stay([0,0]),stay([0,0])]),F('c','Ciotka',[1,0],[stay([1,0]),stay([1,0])])]);eq(dmgOf(S,'a'),3);eq(dmgOf(S,'c'),1);eq(why(S,'c'),['kolizja po odrzuceniu'])});
t('Byku: trafiony przy krawędzi – brak odrzutu',()=>{const S=run([F('b','Byku',[0,0],[stay([0,0]),A(0)]),F('a','Wiatrak',[3,0],[stay([3,0]),stay([3,0])])]);eq(by(S,'a').pos,[3,0]);eq(dmgOf(S,'a'),2)});
t('Byku: szarża w pustą linię kończy się na krawędzi',()=>{const S=run([F('b','Byku',[0,0],[stay([0,0]),A(0)]),F('a','Wiatrak',[0,3],[stay([0,3]),stay([0,3])])]);eq(by(S,'b').pos,[3,0])});
t('Testy: szarża w ścianę strefy – Byku −1',()=>{const S=run([F('b','Byku',[0,0],[stay([0,0]),A(0)]),F('a','Wiatrak',[0,1],[stay([0,1]),stay([0,1])])],{rules:{tb:true,zone:1}});eq(why(S,'b')[0],'ściana strefy')});

/* --- ścisk i drużyny --- */
t('ścisk: dwóch wchodzi na to samo pole – po 1 DMG',()=>{const S=run([F('a','Wiatrak',[-1,0],[M([0,0]),stay([0,0])]),F('c','Ciotka',[1,0],[M([0,0]),stay([0,0])])]);eq(by(S,'a').log[0],'F1: −1 ścisk');eq(by(S,'c').log[0],'F1: −1 ścisk')});
t('2v2: sojusznicy na jednym polu – bez ścisku',()=>{const S=run([F('a','Wiatrak',[-1,0],[M([0,0]),stay([0,0])],{tm:'A'}),F('c','Ciotka',[1,0],[M([0,0]),stay([0,0])],{tm:'A'})]);eq(dmgOf(S,'a'),0);eq(dmgOf(S,'c'),0)});
t('2v2: atak nie rani sojusznika',()=>{const S=run([F('w','Wiatrak',[0,0],[A(0),stay([0,0])],{tm:'A'}),F('a','Długi',[1,0],[stay([1,0]),stay([1,0])],{tm:'A'})]);eq(dmgOf(S,'a'),0)});

/* --- bonusy --- */
t('tarcza blokuje 1 punkt jeden raz',()=>{const S=run([F('w','Wiatrak',[0,0],[A(0),A(0)]),F('a','Długi',[1,0],[stay([1,0]),stay([1,0])],{sh:true})]);eq(dmgOf(S,'a'),1+2);eq(by(S,'a').shUsed,true)});
t('bonus +1 DMG działa na pierwsze trafienie i znika',()=>{const S=run([F('w','Wiatrak',[0,0],[A(0),A(0)],{dmgb:true}),F('a','Długi',[1,0],[stay([1,0]),stay([1,0])])]);eq(dmgOf(S,'a'),3+2);eq(by(S,'w').dmgbUsed,true)});
t('Refleks: unik w fazie II przed atakami',()=>{const S=run([F('w','Wiatrak',[0,0],[stay([0,0]),A(0)]),F('a','Długi',[1,0],[stay([1,0]),stay([1,0])],{dg:[2,0]})]);eq(by(S,'a').pos,[2,0]);eq(dmgOf(S,'a'),0)});

/* --- Truchel --- */
t('Truchel: teleport na dowolne pole',()=>{const S=run([F('t','Truchel',[0,0],[M([3,-3]),stay([3,-3])])]);eq(by(S,'t').pos,[3,-3]);eq(S.journal[0].k,'teleport')});
t('Truchel: kałuża rani wroga stojącego na niej (trucizna 1)',()=>{const S=run([F('t','Truchel',[0,0],[stay([0,0]),stay([0,0])]),F('a','Wiatrak',[1,0],[stay([1,0]),stay([1,0])])],{round:2,puddles:[{k:'1,0',o:'t',r0:1,b:0}]});eq(dmgOf(S,'a'),2,'(1 w każdej fazie)');eq(why(S,'a')[0],'trucizna<t')});
t('Truchel: kałuża nie rani samego Truchla',()=>{const S=run([F('t','Truchel',[1,0],[stay([1,0]),stay([1,0])])],{round:2,puddles:[{k:'1,0',o:'t',r0:1,b:0}]});eq(dmgOf(S,'t'),0)});
t('Truchel: nowa kałuża powstaje na sąsiednim polu',()=>{const S=run([F('t','Truchel',[0,0],[A(0),stay([0,0])])]);eq(S.pudNew.map(p=>p.k),['1,0'])});
t('Testy: trucizna +1',()=>{const S=run([F('t','Truchel',[0,0],[stay([0,0]),stay([0,0])]),F('a','Wiatrak',[1,0],[stay([1,0]),stay([1,0])])],{round:2,rules:{tb:true},puddles:[{k:'1,0',o:'t',r0:1,b:0}]});eq(dmgOf(S,'a'),4)});

/* --- Sierżant: dron --- */
t('dron: aktywacja w fazie I, atak w fazie II na najbliższą postać (1 DMG)',()=>{const S=run([F('s','Sierżant Przemo',[-3,0],[{t:'drone'},{t:'drone',m:[0,0]}]),F('a','Wiatrak',[1,0],[stay([1,0]),stay([1,0])]),F('b','Ciotka',[3,0],[stay([3,0]),stay([3,0])])]);eq(dmgOf(S,'a'),1);eq(dmgOf(S,'b'),0)});
t('dron: remis odległości – cel z większym HP',()=>{const S=run([F('s','Sierżant Przemo',[-3,0],[{t:'drone'},{t:'drone',m:[0,0]}]),F('a','Wiatrak',[1,0],[stay([1,0]),stay([1,0])],{hp:3}),F('b','Ciotka',[-1,0],[stay([-1,0]),stay([-1,0])],{hp:4})]);eq(by(S,'b').hp,3);eq(by(S,'a').hp,3)});
t('dron: pełny remis – losowanie z ziarna, zapisane w dzienniku',()=>{const mk=()=>[F('s','Sierżant Przemo',[-3,0],[{t:'drone'},{t:'drone',m:[0,0]}]),F('a','Wiatrak',[1,0],[stay([1,0]),stay([1,0])]),F('b','Ciotka',[-1,0],[stay([-1,0]),stay([-1,0])])];
 const S=run(mk(),{seed:'x:d:1'});const d=S.journal.find(e=>e.k==='losowanie');eq(!!d,true);eq(d.among,['a','b']);
 const hits=new Set();for(let i=0;i<40;i++){const R=run(mk(),{seed:'s'+i+':d:1'});hits.add(R.journal.find(e=>e.k==='losowanie').pick)}eq(hits.size,2,'różne ziarna dają różne wyniki losowania')});
t('Testy: dron 2 DMG',()=>{const S=run([F('s','Sierżant Przemo',[-3,0],[{t:'drone'},{t:'drone',m:[0,0]}]),F('a','Wiatrak',[1,0],[stay([1,0]),stay([1,0])])],{rules:{tb:true}});eq(dmgOf(S,'a'),2)});

/* --- Pasterz i owca --- */
t('Pasterz: przywołanie owcy',()=>{const S=run([F('p','Pasterz',[0,0],[{t:'summon',m:[1,0]},stay([0,0])])]);eq(S.sheep.p,[1,0])});
t('owca: szarża zatrzymuje się na pierwszej postaci (1 DMG)',()=>{const S=run([F('p','Pasterz',[0,2],[stay([0,2]),A(0)],{sheep:[-3,0]}),F('a','Wiatrak',[0,0],[stay([0,0]),stay([0,0])]),F('b','Ciotka',[1,0],[stay([1,0]),stay([1,0])])]);eq(dmgOf(S,'a'),1);eq(dmgOf(S,'b'),0);eq(S.sheep.p,[-1,0])});
t('owca (tryb specjalny/Testy): przebiega przez postacie, 2 DMG każdej',()=>{const S=run([F('p','Pasterz',[0,2],[stay([0,2]),A(0)],{sheep:[-3,0]}),F('a','Wiatrak',[0,0],[stay([0,0]),stay([0,0])]),F('b','Ciotka',[1,0],[stay([1,0]),stay([1,0])])],{rules:{pnb:true}});eq(dmgOf(S,'a'),2);eq(dmgOf(S,'b'),2);eq(S.sheep.p,[3,0])});
t('kij pasterski: 2 pola, 2 DMG',()=>{const S=run([F('p','Pasterz',[0,0],[{t:'staff',d:0},stay([0,0])]),F('a','Wiatrak',[2,0],[stay([2,0]),stay([2,0])])]);eq(dmgOf(S,'a'),2)});
t('Żyleta strzela w owcę: owca ginie i zasłania postać za nią',()=>{const S=run([F('z','Żyleta',[-3,0],[A(0),stay([-3,0])]),F('p','Pasterz',[0,2],[stay([0,2]),stay([0,2])],{sheep:[-1,0]}),F('a','Wiatrak',[0,0],[stay([0,0]),stay([0,0])])]);eq(dmgOf(S,'a'),0);eq(S.sheep.p,undefined);eq(S.journal.some(e=>e.k==='sheep'&&e.by==='z'),true)});
t('szarża Byka w owcę: owca ginie, Byku staje na jej polu',()=>{const S=run([F('b','Byku',[-3,0],[stay([-3,0]),A(0)]),F('p','Pasterz',[0,2],[stay([0,2]),stay([0,2])],{sheep:[0,0]})]);eq(S.sheep.p,undefined);eq(by(S,'b').pos,[0,0]);eq(dmgOf(S,'b'),0)});
t('Byku vs owca szarżująca naprzeciw: Byku −1 (klasyczny)',()=>{const S=run([F('b','Byku',[-3,0],[stay([-3,0]),A(0)]),F('p','Pasterz',[0,2],[stay([0,2]),A(3)],{sheep:[0,0]})]);eq(why(S,'b'),['zderzenie z owcą<p'])});

/* --- Żyleta: strzał snajperski --- */
t('strzał snajperski: celowanie w fazie I, 3 DMG w fazie II',()=>{const S=run([F('z','Żyleta',[-3,0],[{t:'aim',d:0},{t:'snipe'}]),F('a','Wiatrak',[2,0],[stay([2,0]),stay([2,0])])]);eq(dmgOf(S,'a'),3)});

/* --- Ciotka: manipulacja --- */
t('Ciotka: bez wybranego pola – trafiony czeka na przesunięcie',()=>{const S=run([F('c','Ciotka',[-2,0],[stay([-2,0]),A(0)]),F('a','Wiatrak',[0,0],[stay([0,0]),stay([0,0])])]);eq(S.pend.length,1);eq(S.pend[0].id,'a')});
t('Ciotka: przesunięcie na zajęte pole – kolizja −1 dla obu',()=>{const S=run([F('c','Ciotka',[-2,0],[stay([-2,0]),A(0)]),F('a','Wiatrak',[0,0],[stay([0,0]),stay([0,0])]),F('b','Długi',[0,1],[stay([0,1]),stay([0,1])])],{pushes:{c:[0,1]}});eq(by(S,'a').pos,[0,1]);eq(why(S,'b'),['kolizja po przesunięciu'])});
t('Długi przesunięty w fazie II traci fazę III',()=>{const S=run([F('c','Ciotka',[-2,0],[stay([-2,0]),A(0)]),F('d','Długi',[0,0],[stay([0,0]),stay([0,0]),A(0)])],{pushes:{c:[0,1]}});eq(by(S,'d').cancel3,true);eq(S.ev.filter(e=>e.k==='phase').length,2)});
t('Długi: faza III, gdy nie został przesunięty',()=>{const S=run([F('d','Długi',[0,0],[stay([0,0]),stay([0,0]),A(0)]),F('a','Wiatrak',[1,0],[stay([1,0]),stay([1,0])])]);eq(S.ev.filter(e=>e.k==='phase').length,3);eq(dmgOf(S,'a'),1)});

/* --- strefa i eliminacje --- */
t('strefa: −1 poza strefą na koniec rundy',()=>{const S=run([F('a','Wiatrak',[3,0],[stay([3,0]),stay([3,0])])],{rules:{zone:2}});eq(why(S,'a'),['strefa'])});
t('strefa: tarcza blokuje',()=>{const S=run([F('a','Wiatrak',[3,0],[stay([3,0]),stay([3,0])],{sh:true})],{rules:{zone:2}});eq(dmgOf(S,'a'),0)});
t('eliminacja: HP ≤ 0 na koniec fazy, potem już nie działa',()=>{const S=run([F('w','Wiatrak',[0,0],[A(0),A(0)]),F('a','Długi',[1,0],[stay([1,0]),A(3)],{hp:2})]);eq(by(S,'a').out,true);eq(dmgOf(S,'w'),0,'wyeliminowany w fazie I nie atakuje w fazie II')});
t('ataki w jednej fazie są jednoczesne: wyeliminowany w tej fazie i tak atakuje',()=>{const S=run([F('w','Wiatrak',[0,0],[A(0),stay([0,0])],{hp:1}),F('a','Długi',[1,0],[A(3),stay([1,0])],{hp:1})]);eq(by(S,'w').out,true);eq(by(S,'a').out,true)});

/* --- dziennik i powtarzalność --- */
t('dziennik: każda utrata HP ma przyczynę, sprawcę i krok',()=>{const S=run([F('w','Wiatrak',[0,0],[A(0),stay([0,0])]),F('a','Długi',[1,0],[stay([1,0]),stay([1,0])])]);const e=S.journal.find(x=>x.k==='dmg');eq([e.cause,e.by,e.step,e.ph],['atak Wiatrak','w','ataki',0])});
t('powtarzalność: ten sam stan, plany i ziarno = identyczny wynik',()=>{const mk=()=>[F('s','Sierżant Przemo',[-3,0],[{t:'drone'},{t:'drone',m:[0,0]}]),F('a','Wiatrak',[1,0],[A(3),M([0,0])]),F('b','Byku',[-1,0],[M([1,0]),A(0)]),F('p','Pasterz',[0,2],[{t:'summon',m:[0,1]},A(1)])];
 const ser=S=>JSON.stringify({S,ev:S.ev,j:S.journal,sheep:S.sheep});const a=ser(run(mk(),{seed:'q'})),b=ser(run(mk(),{seed:'q'}));eq(a===b,true)});
t('wejście nie jest modyfikowane przez silnik',()=>{const f=[F('w','Wiatrak',[0,0],[A(0),stay([0,0])]),F('a','Długi',[1,0],[stay([1,0]),stay([1,0])])];const before=JSON.stringify(f);run(f);eq(JSON.stringify(f),before)});

/* --- OBECNE ZACHOWANIE W SYTUACJACH NIEJEDNOZNACZNYCH (zgłoszone do decyzji, zasad nie zmieniano) --- */
t('[N1] kolejność zwykłych ataków zależy od kolejności graczy (owca zabita wcześniej nie zasłania)',()=>{
 const w=F('w','Wiatrak',[0,1],[A(2),stay([0,1])]),z=F('z','Żyleta',[-3,0],[A(0),stay([-3,0])]),rest=()=>[F('p','Pasterz',[0,3],[stay([0,3]),stay([0,3])],{sheep:[0,0]}),F('a','Ciotka',[2,0],[stay([2,0]),stay([2,0])])];
 eq(dmgOf(run([w,z,...rest()]),'a'),2,'Wiatrak przed Żyletą');eq(dmgOf(run([z,w,...rest()]),'a'),0,'Żyleta przed Wiatrakiem')});
t('[N2] dwóch Byków ląduje na jednym polu: obaj bez obrażeń, cel dostaje obrażenia tylko raz',()=>{const S=run([F('b1','Byku',[-1,0],[M([0,0]),stay([0,0])]),F('b2','Byku',[1,0],[M([0,0]),stay([0,0])]),F('a','Wiatrak',[0,0],[stay([0,0]),stay([0,0])])]);eq(dmgOf(S,'b1')+dmgOf(S,'b2'),0);eq(dmgOf(S,'a'),6)});
t('[N3] 2v2: ścisk z wrogiem rani także sojuszników na tym polu',()=>{const S=run([F('a','Wiatrak',[-1,0],[M([0,0]),stay([0,0])],{tm:'A'}),F('c','Ciotka',[1,0],[M([0,0]),stay([0,0])],{tm:'A'}),F('d','Długi',[0,1],[M([0,0]),stay([0,0])],{tm:'B'})]);eq(dmgOf(S,'a'),2);eq(dmgOf(S,'c'),2)});
t('[N4] bonus +1 DMG nie działa na lądowanie Byka i nie jest zużywany',()=>{const S=run([F('b','Byku',[0,0],[M([1,0]),stay([1,0])],{dmgb:true}),F('a','Wiatrak',[1,0],[stay([1,0]),M([2,0])])]);eq(by(S,'a').log[0],'F1: −3 lądowanie Byka');eq(by(S,'b').dmgbUsed,false)});
t('[N5] kolizja po odrzuceniu/przesunięciu rani też sojuszników i nie daje punktów sprawcy',()=>{const S=run([F('b','Byku',[-3,0],[stay([-3,0]),A(0)],{tm:'A'}),F('a','Wiatrak',[0,0],[stay([0,0]),stay([0,0])],{tm:'B'}),F('c','Ciotka',[1,0],[stay([1,0]),stay([1,0])],{tm:'A'})]);eq(why(S,'c'),['kolizja po odrzuceniu'])});

console.log('testy silnika walki:',pass,'zaliczone,',fail,'niezaliczone');fails.forEach(f=>console.log('  ✗',f));process.exit(fail?1:0);
