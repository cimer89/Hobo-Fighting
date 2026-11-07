/* --- Bitwa baz, część: dane – stałe, mapy, stwory, przedmioty, pomocnicze. Części są fragmentami jednego domknięcia MB i muszą być sklejane w kolejności z manifestu. --- */
/* ===================== TRYB TESTY: BITWA BAZ (MOBA, BETA) ===================== */
const MB=(function(){
 const S=30,SQ=Math.sqrt(3);
 const DIRS=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
 const DNAME=['wschód','płn.-wschód','płn.-zachód','zachód','płd.-zachód','płd.-wschód'];
 const TCOL={A:'#3e8ef7',B:'#ef4a3c'},TNAME={A:'Drużyna Niebieska',B:'Drużyna Czerwona'};
 const MAPS={"small": [{"id": "open", "n": "Leśne ścieżki", "d": "Ścieżka prowadzi od bazy do środka, a po bokach las z obozowiskami stworów. Zboczysz z drogi – znajdziesz łup.", "W": 7, "baseHp": 12, "rows": ["X......", "X......", "X......", "X......", "X......", "TcTC", "T*.p.*T", ".T.p.cT", "#*?p.TT", "T..p.*T", "TT.A.TT"]}, {"id": "maze", "n": "Labirynt", "d": "Losowy, niesymetryczny labirynt – inny w każdej grze. Łatwo o zasadzkę.", "W": 7, "baseHp": 12, "rows": ["X.....X", "#..B..#", ".##.##.", ".#?.c#.", ".#.#.#.", "c..C..c", ".#.#.#.", ".#c.?#.", ".##.##.", "#..A..#", "X.....X"]}, {"id": "square", "n": "Kwadrat", "d": "Bazy w rogach, ukośna ścieżka przez las. Obozowiska stworów ukryte między drzewami.", "W": 9, "baseHp": 12, "rows": ["X........", "X........", "X........", "X........", "T*.pC", "Tc.p.TT#.", ".T.pT*?..", ".p.TTcT*.", "TAppp.TT*"]}, {"id": "river", "n": "Most nad rzeką", "d": "Rzeka dzieli mapę: ścieżka prowadzi na most, a w lesie po obu stronach czekają stwory.", "W": 7, "baseHp": 12, "rows": ["X......", "X......", "X......", "X......", "X......", "wpwC", ".pT.*#T", "Tp*TcTT", "cTp.T?T", "..p.*.T", "XT.A.TX"]}], "big": [{"id": "open", "n": "Leśne ścieżki", "d": "Szeroka droga od bazy do środka z odnogą w las. Obozowiska stworów i skrzynie czekają z dala od ścieżek.", "W": 9, "baseHp": 20, "rows": ["X........", "X........", "X........", "X........", "X........", "X........", "TcT.C", "T*..pTcTT", ".TTTp*.?#", "*?T.p..TT", "TT.ppp.*T", "T*..p.p.T", "TT..A..TT"]}, {"id": "maze", "n": "Labirynt", "d": "Losowy, niesymetryczny labirynt – inny w każdej grze. Łatwo o zasadzkę.", "W": 9, "baseHp": 20, "rows": ["XX.....XX", "X#..B..#X", ".###.###.", ".#?...c#.", ".#.###.#.", "...#*#...", "##.#.#.##", "c...C...c", "##.#.#.##", "...#*#...", ".#.###.#.", ".#c...?#.", ".###.###.", "X#..A..#X", "XX.....XX"]}, {"id": "square", "n": "Kwadrat", "d": "Bazy w rogach, ścieżka po skosie przez las. Stwory obozują w gęstwinie z boku.", "W": 11, "baseHp": 20, "rows": ["X..........", "X..........", "X..........", "X..........", "X..........", "TT.ppC", ".T.p..TT#..", "T.p.*.TcT..", ".Tp.#.TT.?.", "*p..*..TcT*", ".App*.#...*"]}, {"id": "river", "n": "Most nad rzeką", "d": "Ścieżka prowadzi przez las na most. Obozowiska stworów po obu stronach rzeki.", "W": 9, "baseHp": 20, "rows": ["X........", "X........", "X........", "X........", "X........", "X........", "X........", "wpwwC", ".p*#.#TT.", "Tp.TcT.*T", "*Tp.TT.?.", "cTp.*.cTT", "TT.p.TTT#", "X*.p.T.*X", "XX..A..XX"]}]};
 let MSEL=null;
 
 const CREEP={small:{n:'Szczury',hp:3,dmg:1,xp:2,lv:1,rec:'Poziom 1 – dasz radę sam.',info:'Gryzą, gdy ktoś podejdzie na sąsiednie pole albo je zaatakuje.'},boss:{n:'Wielki Menel',hp:10,dmg:2,xp:5,lv:3,rec:'Poziom 3 albo we dwóch.',info:'Bije mocno, gdy ktoś podejdzie na sąsiednie pole albo go zaatakuje. Po pokonaniu zostawia skrzynkę z przedmiotem.'}};
 const ITEMS={dmg:{n:'+1 DMG',d:'Wszystkie ataki +1 DMG',c:'#ffb347',g:'⚔'},hp:{n:'+2 HP',d:'+2 do maks. HP',c:'#5cff8a',g:'✚'},boots:{n:'Buty',d:'Ruch o 1 pole dalej',c:'#6cc8ff',g:'»'},eye:{n:'Luneta',d:'+2 do zasięgu wzroku',c:'#c792ff',g:'◉'}};
 const LVLXP=[0,3,7,12,18,25],MAXLV=6;
 const K=(q,r)=>q+','+r,ax=(c,r)=>[c-((r-(r&1))>>1),r];
 const dist=(a,b)=>(Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[0]+a[1]-b[0]-b[1]))/2;
 const step=(p,d,k)=>[p[0]+DIRS[d][0]*(k||1),p[1]+DIRS[d][1]*(k||1)];
 const px=p=>[S*SQ*(p[0]+p[1]/2),S*1.5*p[1]];
 const eq=(a,b)=>!!a&&!!b&&a[0]===b[0]&&a[1]===b[1];
 const cnt=(h,it)=>h.items.filter(x=>x===it).length;
 let G=null,root=null;

