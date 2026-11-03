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

 /* mapa symetryczna względem środka w osiach heksów: dolna połowa jest wzorem, górna to jej odbicie */
 function symCells(rows,W){const H=rows.length,rc=(H-1)>>1,cc=(W-1)>>1,C=ax(cc,rc),out={};const sw=ch=>ch==='A'?'B':ch==='B'?'A':ch;
  rows.forEach((row,r)=>[...row].forEach((ch,c)=>{if(r<rc||(r===rc&&c>cc)||ch==='X')return;const a=ax(c,r),m=[2*C[0]-a[0],2*C[1]-a[1]];
   out[K(...a)]={a,ch:ch==='B'?'.':ch};if(!(r===rc&&c===cc))out[K(...m)]={a:m,ch:sw(ch==='B'?'.':ch)}}));return Object.values(out)}
 function symOk(cl){const m={};cl.forEach(x=>m[K(...x.a)]=x.ch);const open=k=>m[k]!==undefined&&!'#w'.includes(m[k]);
  const a=cl.find(x=>x.ch==='A');if(!a||!cl.find(x=>x.ch==='B'))return false;const seen={},q=[a.a];seen[K(...a.a)]=1;
  while(q.length){const p=q.pop();DIRS.forEach(d=>{const n=[p[0]+d[0],p[1]+d[1]],k=K(...n);if(open(k)&&!seen[k]){seen[k]=1;q.push(n)}})}
  return cl.every(x=>'#w'.includes(x.ch)||seen[K(...x.a)])}
 /* labirynt NIESYMETRYCZNY: cała mapa losowana od nowa, bazy na przeciwnych brzegach; uczciwość pilnowana odległościami */
 function genMazeA(W,H,big){const D=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
  const nbOff=(c,r)=>{const a=ax(c,r),o=[];D.forEach(d=>{const q=a[0]+d[0],rr=a[1]+d[1];if(rr<0||rr>=H)return;const cc=q+((rr-(rr&1))>>1);if(cc>=0&&cc<W)o.push([cc,rr])});return o};
  const rnd=a=>a[Math.floor(Math.random()*a.length)],key=(c,r)=>c+','+r;
  const g=Array.from({length:H},()=>Array(W).fill('#'));
  const st0=[2*Math.floor(Math.random()*((W+1)>>1)),H-1],vis={};vis[key(...st0)]=1;g[st0[1]][st0[0]]='.';const stack=[st0];
  while(stack.length){const [c,r]=stack[stack.length-1];
   const mv=[[2,0],[-2,0],[0,2],[0,-2]].map(([dc,dr])=>[c+dc,r+dr,c+dc/2,r+dr/2]).filter(([nc,nr])=>nc>=0&&nc<W&&nr>=0&&nr<H&&!vis[key(nc,nr)]);
   if(!mv.length){stack.pop();continue}const [nc,nr,ic,ir]=rnd(mv);vis[key(nc,nr)]=1;g[ir][ic]='.';g[nr][nc]='.';stack.push([nc,nr])}
  for(let r=0;r<H;r++)for(let c=0;c<W;c++)if(g[r][c]==='#'&&((r%2===0&&c%2===1)||(r%2===1&&c%2===0))&&Math.random()<(big?0.17:0.13))g[r][c]='.';
  /* bazy: losowa kolumna przy dolnym i górnym brzegu (nie naprzeciw siebie) */
  const bcA=1+Math.floor(Math.random()*(W-2));let bcB=1+Math.floor(Math.random()*(W-2));if(W>5)while(bcB===W-1-bcA&&Math.random()<.85)bcB=1+Math.floor(Math.random()*(W-2));
  const A=[bcA,H-1],B=[bcB,0];g[A[1]][A[0]]='A';g[B[1]][B[0]]='B';[A,B].forEach(p=>nbOff(...p).forEach(([c,r])=>g[r][c]='.'));
  const cr=(H-1)>>1,cc=Math.floor(W/2)+(Math.random()<.5?-1:0)*(W>7?1:0);g[cr][cc]='C';nbOff(cc,cr).forEach(([c,r])=>{if(g[r][c]==='#')g[r][c]='.'});
  const pas=(c,r)=>g[r][c]!=='#';
  const bfs=s=>{const d={};d[key(...s)]=0;const q=[s];while(q.length){const p=q.shift();nbOff(...p).forEach(n=>{const k=key(...n);if(d[k]===undefined&&pas(...n)&&!'AB'.includes(g[n[1]][n[0]])){d[k]=d[key(...p)]+1;q.push(n)}})}return d};
  const dA=bfs(A),dB=bfs(B);const open=[];for(let r=0;r<H;r++)for(let c=0;c<W;c++)if(g[r][c]==='.'||g[r][c]==='C')open.push([c,r]);
  if(open.some(p=>dA[key(...p)]===undefined))return null;
  const kC=key(cc,cr);if(Math.abs(dA[kC]-dB[kC])>2)return null;
  /* każda strona dostaje stworki i skrzynie w "swojej" połowie (bliżej własnej bazy), najchętniej w ślepych zaułkach */
  const pick=(arr,n)=>{const o=[],a=arr.slice();while(o.length<n&&a.length)o.push(a.splice(Math.floor(Math.random()*a.length),1)[0]);return o};
  const dead=p=>nbOff(...p).filter(n=>pas(...n)).length===1;
  const nc=big?2:1,nch=big?2:1;
  for(const [me,ot] of [[dA,dB],[dB,dA]]){const mine=open.filter(p=>g[p[1]][p[0]]==='.'&&me[key(...p)]>=3&&me[key(...p)]+1<ot[key(...p)]);
   const dd=mine.filter(dead);pick(dd.length>=nc?dd:mine,nc).forEach(([c,r])=>g[r][c]='c');
   const rest=mine.filter(p=>g[p[1]][p[0]]==='.'),dr=rest.filter(dead);pick(dr.length>=nch?dr:rest,nch).forEach(([c,r])=>g[r][c]='?');
   pick(mine.filter(p=>g[p[1]][p[0]]==='.'&&!dead(p)),big?3:2).forEach(([c,r])=>g[r][c]='*')}
  if(open.filter(p=>g[p[1]][p[0]]==='c').length<2*nc)return null;
  const out=[];g.forEach((row,r)=>row.forEach((ch,c)=>{if((r===0||r===H-1)&&(c===0||c===W-1)&&ch==='#')return;out.push({a:ax(c,r),ch})}));return out}
 function mapCells(t,big){if(t.id!=='maze')return symCells(t.rows,t.W);for(let i=0;i<80;i++){const cl=genMazeA(t.W,t.rows.length,big);if(cl&&symOk(cl))return cl}return symCells(t.rows,t.W)}
 /* linia widzenia: skały i krzaki zasłaniają pola za nimi */
 function losClear(a,b){const n=dist(a,b);if(n<=1)return true;const ok=e=>{for(let i=1;i<n;i++){const t=i/n,q=a[0]+(b[0]-a[0])*t+e,r=a[1]+(b[1]-a[1])*t+e,s=-q-r;let rq=Math.round(q),rr=Math.round(r),rs=Math.round(s);
   const dq=Math.abs(rq-q),dr=Math.abs(rr-r),ds=Math.abs(rs-s);if(dq>dr&&dq>ds)rq=-rr-rs;else if(dr>ds)rr=-rq-rs;const c=G.cells[K(rq,rr)];if(c&&(c.t==='r'||c.t==='b'))return false}return true};
  return ok(1e-4)||ok(-1e-4)}
 /* pola, na które postać może wejść w tej fazie: po drodze (bez przeskakiwania skał i wody) i tylko w polu widzenia drużyny */
 /* pola zasłonięte tylko krzakami: znany teren, nieznana zawartość */
 function losRock(a,b){const n=dist(a,b);if(n<=1)return true;const ok=e=>{for(let i=1;i<n;i++){const t=i/n,q=a[0]+(b[0]-a[0])*t+e,r=a[1]+(b[1]-a[1])*t+e,s=-q-r;let rq=Math.round(q),rr=Math.round(r),rs=Math.round(s);
   const dq=Math.abs(rq-q),dr=Math.abs(rr-r),ds=Math.abs(rs-s);if(dq>dr&&dq>ds)rq=-rr-rs;else if(dr>ds)rr=-rq-rs;const c=G.cells[K(rq,rr)];if(c&&c.t==='r')return false}return true};
  return ok(1e-4)||ok(-1e-4)}
 function knownSet(team){const vs=visSet(team),s={};const add=(p,r)=>{Object.values(G.cells).forEach(c=>{const k=K(...c.p);if(!vs[k]&&dist(c.p,p)<=r&&losRock(p,c.p))s[k]=1})};
  G.heroes.forEach(h=>{if(h.team===team&&!h.dead&&h.pos)add(h.pos,visR(h))});add(G.bases[team].pos,3);return s}
 function moveCells(h,from){const mk=moveKind(h),vs=Object.assign({},visSet(h.team),knownSet(h.team)),o={};
  if(mk.tele){Object.values(G.cells).forEach(c=>{const k=K(...c.p);if(vs[k]&&passable(c.p,h.team)&&dist(c.p,from)<=mk.r&&dist(c.p,from)>0)o[k]=1});return o}
  const dd={},q=[from];dd[K(...from)]=0;while(q.length){const p=q.shift(),d0=dd[K(...p)];if(d0>=mk.r)continue;
   nb(p).forEach(n=>{const k=K(...n);if(dd[k]!==undefined||!passable(n,h.team)||!vs[k])return;dd[k]=d0+1;o[k]=1;q.push(n)})}
  delete o[K(...from)];return o}

 /* ---------- budowa gry ---------- */
 function newGame(mode,mi){
  const t=MAPS[mode==='1v1'?'small':'big'][mi||0],cells={},bases={},creeps=[],chests=[];let ci=0;
  mapCells(t,mode!=='1v1').forEach(({a,ch})=>{const k=K(...a);
   cells[k]={p:a,t:ch==='#'?'r':(ch==='*'||ch==='T')?'b':ch==='w'?'w':'g'};if(ch==='T')cells[k].tr=1;if(ch==='p')cells[k].pa=1;if(ch==='c'||ch==='C')cells[k].camp=ch==='C'?2:1;
   if(ch==='A'||ch==='B'){cells[k].t='base';bases[ch]={pos:a,hp:t.baseHp,max:t.baseHp}}
   if(ch==='c'||ch==='C'){const ty=ch==='C'?'boss':'small';creeps.push({id:'c'+(ci++),ty,home:a,pos:a,hp:CREEP[ty].hp,alive:true,resp:0})}
   if(ch==='?')chests.push({pos:a,item:rndItem()})});
  const n=mode==='1v1'?1:mode==='2v2'?2:3;
  G={mode,mapN:t.n,n,cells,bases,creeps,chests,puddles:[],heroes:[],round:1,scr:'pick',pickI:0,cur:0,ph:0,plan:null,act:null,
   seen:{A:{},B:{}},memChest:{A:{},B:{}},log:{A:[],B:[]},winner:null};
  for(let i=0;i<n*2;i++){const team=i%2===0?'A':'B';G.heroes.push({id:'h'+i,pl:i+1,team,ch:null,pos:null,hp:5,lvl:1,xp:0,up:{},pend:0,items:[],dead:0,rev:false,kills:0,dmgDone:0,plans:null})}
 }
 function rndItem(){const k=Object.keys(ITEMS);return k[Math.floor(Math.random()*k.length)]}
 const cell=p=>p&&G.cells[K(...p)];
 const passable=(p,team)=>{const c=cell(p);if(!c||c.t==='r'||c.t==='w')return false;if(c.t==='base')return !!team&&!!G.bases[team]&&eq(G.bases[team].pos,p);return true};
 const nb=p=>DIRS.map((d,i)=>step(p,i)).filter(q=>!!cell(q));
 function startPositions(){['A','B'].forEach(t=>{G.heroes.filter(h=>h.team===t).forEach(h=>{h.pos=G.bases[t].pos.slice();h.hp=maxHp(h)})})}

 /* ---------- statystyki i zestaw umiejętności ---------- */
 const maxHp=h=>5+(h.lvl-1)+2*cnt(h,'hp');
 const U=(h,t,k)=>(h.up&&h.up[t]&&h.up[t][k])||0;
 const visR=h=>2+U(h,'vision','rng')+2*cnt(h,'eye');
 const dmgB=h=>cnt(h,'dmg');
 const nPh=h=>h.ch==='Długi'&&h.lvl>=3?3:2;
 const UNL={Wiatrak:{2:'Wachlarz: 3 pola przed sobą (2/1/1 DMG)',3:'Drugi rząd wachlarza (1 DMG)'},'Długi':{2:'Włócznia: linia 2 pól (1–2 DMG), przebija',3:'Trzecia faza w każdej rundzie'},
  'Żyleta':{2:'Strzał: linia 3 pól, 1 DMG, trafia pierwszy cel',3:'Strzał snajperski: celuj w fazie I, w fazie II 3 DMG przez całą mapę'},Byku:{2:'Skok o 2 pola: lądowanie na wrogu 2 DMG',3:'Szarża: do 5 pól, 2 DMG i odrzut'},
  Ciotka:{2:'Zaklęcie: linia 3 pól, 1 DMG, przebija',3:'Zaklęcie odpycha trafionych o 1 pole'},Pasterz:{2:'Kij: 2 pola, 1 DMG, przebija',3:'Owca: szarża przez 4 pola, 2 DMG'},
  Truchel:{2:'Kałuża trucizny (2 rundy, 1 DMG na fazę)',3:'Teleport do 4 pól'},'Sierżant Przemo':{2:'Pistolet: linia 4 pól, 1 DMG, pierwszy cel',3:'Dron (2 akcje): 2 DMG najbliższemu wrogowi do 4 pól'}};
 function moveKind(h){if(h.ch==='Truchel'&&h.lvl>=3)return {r:4+U(h,'move','rng'),l:'Teleport',tele:true};return {r:(h.ch==='Byku'&&h.lvl>=2?2:1)+cnt(h,'boots')+U(h,'move','rng'),l:h.ch==='Byku'&&h.lvl>=2?'Skok':'Ruch'}}
 function atkName(h){const L=h.lvl;return {Wiatrak:L>=2?'Wachlarz':'Atak','Długi':L>=2?'Włócznia':'Atak','Żyleta':L>=2?'Strzał':'Atak',Ciotka:L>=2?'Zaklęcie':'Atak',Pasterz:L>=2?'Kij':'Atak','Sierżant Przemo':L>=2?'Pistolet':'Atak'}[h.ch]||'Atak'}
 function kit(h,ph,plan){const mk=moveKind(h),L=h.lvl,a=[{t:'move',l:mk.l},{t:'stay',l:'Stój'},{t:'atk',l:atkName(h)}];
  if(h.ch==='Byku'&&L>=3)a.push({t:'charge',l:'Szarża'});
  if(h.ch==='Pasterz'&&L>=3)a.push({t:'sheep',l:'Owca'});
  if(h.ch==='Truchel'&&L>=2)a.push({t:'puddle',l:'Kałuża'});
  if(h.ch==='Żyleta'&&L>=3){if(ph===0)a.push({t:'aim',l:'Celuj'});else a.push({t:'snipe',l:'Snajperski',dis:!(plan[0]&&plan[0].t==='aim')})}
  if(h.ch==='Sierżant Przemo'&&L>=3){if(ph===0)a.push({t:'drone',l:'Dron'});else a.push({t:'drone2',l:'Dron: atak',dis:!(plan[0]&&plan[0].t==='drone')})}
  return a}
 function lineCells(p,d,n){const o=[];for(let k=1;k<=n;k++){const q=step(p,d,k),c=cell(q);if(!c||c.t==='r')break;o.push(q);if(c.t==='base')break}return o}
 // komórki ataku: {cells:[[p,dmg]],first:bool}
 function atkShape(h,p,d,t){const L=h.lvl,ch=h.ch;let out=[],first=false;const add=(q,dm)=>{const c=cell(q);if(c&&c.t!=='r')out.push([q,dm])};
  if(t==='sheep'){const u=U(h,'sheep','dmg');lineCells(p,d,4+U(h,'sheep','rng')).forEach(q=>out.push([q,2+u]));return {cells:out,first}}
  if(t==='snipe'){const u=U(h,'snipe','dmg');lineCells(p,d,9).forEach(q=>out.push([q,3+u]));return {cells:out,first:true}}
  const u=U(h,'atk','dmg'),rg=U(h,'atk','rng');
  if(ch==='Wiatrak'&&L>=2){add(step(p,d),2+u);add(step(p,(d+1)%6),1+u);add(step(p,(d+5)%6),1+u);
   if(L>=3){add(step(p,d,2),1+u);add(step(step(p,d),(d+1)%6),1+u);add(step(step(p,d),(d+5)%6),1+u)}
   const k0=L>=3?3:2;for(let k=k0;k<k0+rg;k++)add(step(p,d,k),1+u)}
  else if(ch==='Długi'&&L>=2){lineCells(p,d,2+rg).forEach((q,k)=>out.push([q,(k===0?1:2)+u]))}
  else if(ch==='Żyleta'&&L>=2){lineCells(p,d,3+rg).forEach(q=>out.push([q,1+u]));first=true}
  else if(ch==='Ciotka'&&L>=2){lineCells(p,d,3+rg).forEach(q=>out.push([q,1+u]))}
  else if(ch==='Pasterz'&&L>=2){lineCells(p,d,2+rg).forEach(q=>out.push([q,1+u]))}
  else if(ch==='Sierżant Przemo'&&L>=2){lineCells(p,d,4+rg).forEach(q=>out.push([q,1+u]));first=true}
  else{lineCells(p,d,1+rg).forEach(q=>out.push([q,1+u]));first=true}
  return {cells:out,first}}
 const chargeDmg=h=>2+U(h,'charge','dmg'),chargeRng=h=>5+U(h,'charge','rng'),jumpDmg=h=>2+U(h,'move','dmg'),pudDmg=h=>1+U(h,'puddle','dmg'),pudRng=h=>1+U(h,'puddle','rng'),droneDmg=h=>2+U(h,'drone','dmg'),droneRng=h=>4+U(h,'drone','rng');
 function atkRange(h){return atkShape(h,[0,0],0,'atk').cells.reduce((m,[q])=>Math.max(m,dist(q,[0,0])),0)}
 function upOpts(h){const o=[],mk=moveKind(h),an=atkName(h),sh=atkShape(h,[0,0],0,'atk'),mx=Math.max(...sh.cells.map(c=>c[1]),1);
  o.push({t:'vision',k:'rng',l:'Wzrok +1',d:'Zasięg wzroku '+visR(h)+' → '+(visR(h)+1),dis:U(h,'vision','rng')>=4});
  o.push({t:'move',k:'rng',l:mk.l+': zasięg +1',d:'Zasięg '+mk.r+' → '+(mk.r+1),dis:U(h,'move','rng')>=1});
  if(h.ch==='Byku'&&h.lvl>=2)o.push({t:'move',k:'dmg',l:'Skok: +1 DMG',d:'Lądowanie na wrogu '+jumpDmg(h)+' → '+(jumpDmg(h)+1)+' DMG'});
  o.push({t:'atk',k:'dmg',l:an+': +1 DMG',d:'Obrażenia '+mx+' → '+(mx+1)+' (na każdym polu)'});
  o.push({t:'atk',k:'rng',l:an+': zasięg +1',d:'Zasięg '+atkRange(h)+' → '+(atkRange(h)+1)+' pól',dis:U(h,'atk','rng')>=3});
  if(h.ch==='Byku'&&h.lvl>=3){o.push({t:'charge',k:'dmg',l:'Szarża: +1 DMG',d:chargeDmg(h)+' → '+(chargeDmg(h)+1)+' DMG'});o.push({t:'charge',k:'rng',l:'Szarża: zasięg +1',d:chargeRng(h)+' → '+(chargeRng(h)+1)+' pól',dis:U(h,'charge','rng')>=3})}
  if(h.ch==='Pasterz'&&h.lvl>=3){o.push({t:'sheep',k:'dmg',l:'Owca: +1 DMG',d:(2+U(h,'sheep','dmg'))+' → '+(3+U(h,'sheep','dmg'))+' DMG'});o.push({t:'sheep',k:'rng',l:'Owca: zasięg +1',d:(4+U(h,'sheep','rng'))+' → '+(5+U(h,'sheep','rng'))+' pól',dis:U(h,'sheep','rng')>=3})}
  if(h.ch==='Truchel'&&h.lvl>=2){o.push({t:'puddle',k:'dmg',l:'Kałuża: +1 DMG',d:pudDmg(h)+' → '+(pudDmg(h)+1)+' DMG na fazę'});o.push({t:'puddle',k:'rng',l:'Kałuża: zasięg +1',d:'Rzut na '+pudRng(h)+' → '+(pudRng(h)+1)+' pola',dis:U(h,'puddle','rng')>=3})}
  if(h.ch==='Sierżant Przemo'&&h.lvl>=3){o.push({t:'drone',k:'dmg',l:'Dron: +1 DMG',d:droneDmg(h)+' → '+(droneDmg(h)+1)+' DMG'});o.push({t:'drone',k:'rng',l:'Dron: zasięg +1',d:droneRng(h)+' → '+(droneRng(h)+1)+' pól',dis:U(h,'drone','rng')>=3})}
  if(h.ch==='Żyleta'&&h.lvl>=3)o.push({t:'snipe',k:'dmg',l:'Snajperski: +1 DMG',d:(3+U(h,'snipe','dmg'))+' → '+(4+U(h,'snipe','dmg'))+' DMG'});
  return o}
 function applyUp(h,o){h.up=h.up||{};h.up[o.t]=h.up[o.t]||{};h.up[o.t][o.k]=(h.up[o.t][o.k]||0)+1}
 function abilityList(h){const L=h.lvl,un=UNL[h.ch]||{},o=[{lv:1,t:'Ruch o 1 pole i atak 1 DMG na sąsiednie pole',on:true}];
  [2,3].forEach(l=>{if(un[l])o.push({lv:l,t:un[l],on:L>=l})});
  const mk=moveKind(h),sh=atkShape(h,[0,0],0,'atk'),mx=Math.max(...sh.cells.map(c=>c[1]),1);
  o.push({lv:0,t:'Teraz: wzrok '+visR(h)+', '+mk.l.toLowerCase()+' '+mk.r+', '+atkName(h).toLowerCase()+' do '+mx+' DMG / zasięg '+atkRange(h)+(h.ch==='Byku'&&L>=3?', szarża '+chargeDmg(h)+' DMG / '+chargeRng(h)+' pól':'')+(h.ch==='Truchel'&&L>=2?', kałuża '+pudDmg(h)+' DMG':'')+(h.ch==='Sierżant Przemo'&&L>=3?', dron '+droneDmg(h)+' DMG / '+droneRng(h)+' pól':''),on:true});
  return o}

 /* ---------- widoczność ---------- */
 function visSet(team){const s={};const add=(p,r)=>{Object.values(G.cells).forEach(c=>{if(dist(c.p,p)<=r&&losClear(p,c.p))s[K(...c.p)]=1})};
  G.heroes.forEach(h=>{if(h.team===team&&!h.dead&&h.pos)add(h.pos,visR(h))});add(G.bases[team].pos,3);return s}
 function seesHero(team,h,vs){if(h.team===team)return !h.dead;if(h.dead||!h.pos)return false;const k=K(...h.pos);if(!vs[k])return false;return cell(h.pos).t!=='b'||h.rev}
 function updateSeen(){['A','B'].forEach(t=>{const vs=visSet(t);Object.keys(vs).forEach(k=>{G.seen[t][k]=1});Object.keys(knownSet(t)).forEach(k=>{G.seen[t][k]=1});
  Object.keys(vs).forEach(k=>{delete G.memChest[t][k]});G.chests.forEach(c=>{const k=K(...c.pos);if(vs[k])G.memChest[t][k]=c.item})})}

 /* ---------- rozstrzyganie rundy ---------- */
 function logEv(txt,at,teams){(teams||['A','B']).forEach(t=>G.log[t].push(txt))}
 function evVis(txt,p,involved){['A','B'].forEach(t=>{const vs=G._vs[t];if((p&&vs[K(...p)])||(involved||[]).includes(t))G.log[t].push(txt)})}
 function hname(h){return h.ch+' ('+(h.team==='A'?'nieb.':'czerw.')+')'}
 function gainXp(h,n){if(!h)return;h.xp+=n;while(h.lvl<MAXLV&&h.xp>=LVLXP[h.lvl]){h.lvl++;h.hp=Math.min(maxHp(h),h.hp+2);h.pend=(h.pend||0)+1;const un=(UNL[h.ch]||{})[h.lvl];G.log[h.team].push('⭐ '+h.ch+' awansuje na poziom '+h.lvl+(un?': '+un:'')+'. Wybierz wzmocnienie na początku tury.')}}
 function resolveRound(){
  G.log={A:[],B:[]};const alive=()=>G.heroes.filter(h=>!h.dead&&h.pos);
  const maxP=Math.max(...alive().map(nPh),2);
  for(let ph=0;ph<maxP;ph++){
   const act=alive().filter(h=>h.plans&&h.plans[ph]);
   // 1. ruchy
   act.forEach(h=>{const a=h.plans[ph];h._from=h.pos.slice();if(a.t==='move'&&a.m&&passable(a.m,h.team))h.pos=a.m.slice()});
   G._vs={A:visSet('A'),B:visSet('B')};
   const dmgs=[];const hitT=(kind,ref,n,src,why)=>dmgs.push({kind,ref,n,src,why});
   // lądowanie Byka
   act.forEach(h=>{const a=h.plans[ph];if(h.ch!=='Byku'||h.lvl<2||a.t!=='move'||eq(h._from,h.pos))return;
    G.heroes.forEach(y=>{if(y.team!==h.team&&!y.dead&&eq(y.pos,h.pos))hitT('hero',y,jumpDmg(h)+dmgB(h),h,'skok Byka')});
    G.creeps.forEach(c=>{if(c.alive&&eq(c.pos,h.pos))hitT('creep',c,jumpDmg(h)+dmgB(h),h,'skok Byka')})});
   // skrzynki
   act.forEach(h=>{const i=G.chests.findIndex(c=>eq(c.pos,h.pos));if(i>=0&&h.items.length<3){const it=G.chests[i].item;h.items.push(it);if(it==='hp')h.hp+=2;G.chests.splice(i,1);evVis('🎁 '+hname(h)+' zdobywa: '+ITEMS[it].n,h.pos,[h.team])}});
   // 2. ataki
   const targetsAt=(p,team)=>{const o=[];G.heroes.forEach(y=>{if(y.team!==team&&!y.dead&&eq(y.pos,p))o.push(['hero',y])});G.creeps.forEach(c=>{if(c.alive&&eq(c.pos,p))o.push(['creep',c])});
    ['A','B'].forEach(t=>{if(t!==team&&eq(G.bases[t].pos,p))o.push(['base',G.bases[t]])});return o};
   const pushes=[];
   act.forEach(h=>{const a=h.plans[ph];let attacked=false;
    if(['atk','sheep','snipe'].includes(a.t)){let d=a.d;if(a.t==='snipe'){const a0=h.plans[0];if(!a0||a0.t!=='aim')return;d=a0.d}if(d==null)return;
     const sh=atkShape(h,h.pos,d,a.t);attacked=true;let hit=false;
     for(const [q,dm] of sh.cells){const ts=targetsAt(q,h.team);if(!ts.length)continue;ts.forEach(([k,ref])=>{hitT(k,ref,dm+dmgB(h),h,a.t==='sheep'?'owca':a.t==='snipe'?'strzał snajperski':atkName(h).toLowerCase());
      if(h.ch==='Ciotka'&&h.lvl>=3&&k!=='base')pushes.push([ref,d])});hit=true;if(sh.first)break}
     evVis((hit?'💥 ':'💨 ')+hname(h)+': '+(a.t==='sheep'?'owca':a.t==='snipe'?'strzał snajperski':atkName(h))+(hit?'':' (pudło)'),h.pos,[h.team])}
    else if(a.t==='charge'&&a.d!=null){attacked=true;let cur=h.pos.slice(),hit=null;
     for(let k=0;k<chargeRng(h);k++){const q=step(cur,a.d),c=cell(q);if(!c||c.t==='r')break;const ts=targetsAt(q,h.team);if(ts.length){hit=[q,ts];break}if(c.t==='base')break;cur=q}
     h.pos=cur;if(hit){hit[1].forEach(([k,ref])=>{hitT(k,ref,chargeDmg(h)+dmgB(h),h,'szarża');if(k!=='base')pushes.push([ref,a.d])})}
     evVis((hit?'💥 ':'💨 ')+hname(h)+': szarża'+(hit?'':' (pudło)'),h.pos,[h.team])}
    else if(a.t==='puddle'&&a.d!=null){attacked=true;let q=null;for(let k=1;k<=pudRng(h);k++){const z=step(h.pos,a.d,k),cz=cell(z);if(!cz||cz.t==='r'||cz.t==='base')break;if(passable(z))q=z}if(q){G.puddles.push({pos:q,team:h.team,dmg:pudDmg(h)+dmgB(h),until:G.round+1,src:h});evVis('☠ '+hname(h)+' tworzy kałużę trucizny',q,[h.team])}}
    else if(a.t==='drone2'){const a0=h.plans[0];if(a0&&a0.t==='drone'){attacked=true;let best=null,bd=99;
     G.heroes.forEach(y=>{if(y.team!==h.team&&!y.dead&&y.pos){const dd=dist(y.pos,h.pos);if(dd<=droneRng(h)&&dd<bd){bd=dd;best=['hero',y]}}});
     if(!best)G.creeps.forEach(c=>{if(c.alive){const dd=dist(c.pos,h.pos);if(dd<=droneRng(h)&&dd<bd){bd=dd;best=['creep',c]}}});
     if(best)hitT(best[0],best[1],droneDmg(h)+dmgB(h),h,'dron');evVis('✈ '+hname(h)+(best?': dron trafia':': dron bez celu'),h.pos,[h.team])}}
    if(attacked&&cell(h.pos).t==='b')h.rev=true});
   // kałuże
   G.puddles.forEach(p=>{G.heroes.forEach(y=>{if(y.team!==p.team&&!y.dead&&eq(y.pos,p.pos))hitT('hero',y,p.dmg,p.src,'trucizna')});G.creeps.forEach(c=>{if(c.alive&&eq(c.pos,p.pos))hitT('creep',c,p.dmg,p.src,'trucizna')})});
   applyDmg(dmgs);
   pushes.forEach(([ref,d])=>{if(ref.alive===false||ref.dead)return;const q=step(ref.pos,d);if(passable(q,ref.team))ref.pos=q});
   // 3. stworki
   const cd=[];
   G.creeps.forEach(c=>{if(!c.alive)return;const df=CREEP[c.ty];
    const seen=y=>!y.dead&&y.pos&&!(cell(y.pos).t==='b'&&!y.rev);
    let tg=c.aggro?G.heroes.find(y=>y.id===c.aggro):null;
    if(tg&&(!seen(tg)||dist(tg.pos,c.home)>4))tg=null;
    if(!tg){const adj=G.heroes.filter(y=>seen(y)&&dist(y.pos,c.pos)===1).sort((a,b)=>a.hp-b.hp);if(adj.length)tg=adj[0]}
    c.aggro=tg?tg.id:null;
    if(tg){if(dist(tg.pos,c.pos)===1){cd.push({kind:'hero',ref:tg,n:df.dmg,src:null,why:df.n.toLowerCase()});return}
     const opts=nb(c.pos).filter(q=>passable(q)&&dist(q,c.home)<=4).sort((a,b)=>dist(a,tg.pos)-dist(b,tg.pos));if(opts.length&&dist(opts[0],tg.pos)<dist(c.pos,tg.pos))c.pos=opts[0];return}
    if(!eq(c.pos,c.home)){const opts=nb(c.pos).filter(passable).sort((a,b)=>dist(a,c.home)-dist(b,c.home));if(opts.length)c.pos=opts[0]}});
   // 4. bazy strzelają
   ['A','B'].forEach(t=>{const b=G.bases[t];const en=G.heroes.filter(y=>y.team!==t&&!y.dead&&y.pos&&dist(y.pos,b.pos)<=2).sort((a,b2)=>dist(a.pos,b.pos)-dist(b2.pos,b.pos));if(en.length)cd.push({kind:'hero',ref:en[0],n:1,src:null,why:'baza'})});
   applyDmg(cd);
   // krzaki: wyjście z krzaków znowu chowa
   G.heroes.forEach(h=>{if(!h.dead&&h.pos&&cell(h.pos).t!=='b')h.rev=false});
   if(G.winner)break}
  // koniec rundy
  G.puddles=G.puddles.filter(p=>p.until>G.round);
  G.heroes.forEach(h=>{if(h.dead){h.dead--;if(h.dead===0){h.pos=G.bases[h.team].pos.slice();h.hp=maxHp(h);h.rev=false;G.log[h.team].push('↺ '+h.ch+' odradza się w bazie')}}else gainXp(h,1)});
  G.creeps.forEach(c=>{if(!c.alive&&G.round>=c.resp){c.alive=true;c.pos=c.home.slice();c.hp=CREEP[c.ty].hp;c.aggro=null}else if(c.alive&&!c.aggro&&c.hp<CREEP[c.ty].hp)c.hp++});
  G.heroes.forEach(h=>{h.plans=null});G.round++;updateSeen()}
 function applyDmg(list){
  list.forEach(e=>{if(e.kind==='hero'){const y=e.ref;if(y.dead)return;y.hp-=e.n;if(e.src)e.src.dmgDone+=e.n;y._last=e.src;
    evVis('−'+e.n+' '+hname(y)+' ('+e.why+')',y.pos,[y.team].concat(e.src?[e.src.team]:[]))}
   else if(e.kind==='creep'){const c=e.ref;if(!c.alive)return;c.hp-=e.n;c._last=e.src;if(e.src){e.src.dmgDone+=e.n;c.aggro=e.src.id}}
   else if(e.kind==='base'){const b=e.ref;b.hp=Math.max(0,b.hp-e.n);if(e.src){e.src.dmgDone+=e.n;gainXp(e.src,1)}logEv('🏰 Baza '+(b===G.bases.A?'niebieska':'czerwona')+' −'+e.n+' (zostało '+b.hp+')')}});
  G.heroes.forEach(y=>{if(!y.dead&&y.pos&&y.hp<=0){const at=y.pos.slice();y.dead=2;y.pos=null;y.rev=false;const k=y._last;
   logEv('☠ '+hname(y)+' pada'+(k?' (zabija: '+k.ch+')':''));
   if(k&&k.team!==y.team){k.kills++;gainXp(k,4);G.heroes.forEach(a=>{if(a!==k&&a.team===k.team&&!a.dead&&a.pos&&dist(a.pos,at)<=5)gainXp(a,2)})}}});
  G.creeps.forEach(c=>{if(c.alive&&c.hp<=0){c.alive=false;c.resp=G.round+5;const k=c._last,df=CREEP[c.ty];
   if(k){gainXp(k,df.xp);G.heroes.forEach(a=>{if(a!==k&&a.team===k.team&&!a.dead&&a.pos&&dist(a.pos,c.pos)<=4)gainXp(a,1)});G.log[k.team].push('🐀 '+k.ch+' pokonuje: '+df.n+' (+'+df.xp+' XP)')}
   if(c.ty==='boss')G.chests.push({pos:c.pos.slice(),item:rndItem()})}});
  ['A','B'].forEach(t=>{if(G.bases[t].hp<=0&&!G.winner)G.winner=t==='A'?'B':'A'})}

 /* ---------- rysowanie ---------- */
 function hexPts(r){let a=[];for(let i=0;i<6;i++){const t=Math.PI/180*(60*i-30);a.push((r*Math.cos(t)).toFixed(1)+','+(r*Math.sin(t)).toFixed(1))}return a.join(' ')}
 function bounds(){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;Object.values(G.cells).forEach(c=>{const [x,y]=px(c.p);x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)});return [x0-S,y0-S,x1-x0+2*S,y1-y0+2*S]}
 function mapSvg(team,hl){const vs=visSet(team),ks=knownSet(team),seen=G.seen[team],[bx,by,bw,bh]=bounds();let g='';const P=hexPts(S-1);
  Object.values(G.cells).sort((a,b)=>a.p[1]-b.p[1]).forEach(c=>{const k=K(...c.p),[x,y]=px(c.p),v=!!vs[k],sn=!!seen[k];
   let fill={g:'#4b5a3c',b:'#2f7a34',r:'#6f6a66',base:'#4b5a3c',w:'#2b5f8f'}[c.t];
   const h=hl&&hl[k];
   g+='<g transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')" data-mk="'+k+'">'+MBA.cell(c.t,sn,P,k,c);
   if(sn&&!v)g+=ks[k]?'<polygon points="'+P+'" fill="rgba(40,30,60,.38)"/><g opacity=".75"><path d="M-9,-1 q9,-9 18,0 q-9,9 -18,0z" fill="none" stroke="#fff" stroke-width="1.8"/><circle cy="-1" r="2.6" fill="#fff"/><path d="M-9,7 L9,-9" stroke="#fff" stroke-width="2" stroke-linecap="round"/></g>':'<polygon points="'+P+'" fill="rgba(5,6,10,.55)"/>';
   if(h)g+='<polygon points="'+hexPts(S-3)+'" fill="'+(h.f||'none')+'" stroke="'+(h.s||'none')+'" stroke-width="3"/>'+(h.t?'<text class="mbl" y="6">'+h.t+'</text>':'');
   g+='</g>'});
  // bazy
  ['A','B'].forEach(t=>{const b=G.bases[t],[x,y]=px(b.pos);const ba=MBA.base(t,b);if(ba){g+='<g transform="translate('+x+','+y+')">'+ba+'</g>';return}g+='<g transform="translate('+x+','+y+')"><polygon points="'+hexPts(S-2)+'" fill="'+TCOL[t]+'" fill-opacity=".35" stroke="'+TCOL[t]+'" stroke-width="3"/><path d="M-14,10 V-6 L-9,-12 L-4,-6 V-12 H4 V-6 L9,-12 L14,-6 V10 Z" fill="'+TCOL[t]+'" stroke="#111" stroke-width="2"/><rect x="-17" y="14" width="34" height="6" rx="3" fill="#111"/><rect x="-17" y="14" width="'+(34*b.hp/b.max).toFixed(1)+'" height="6" rx="3" fill="'+TCOL[t]+'"/><text class="mbs" y="-16">'+b.hp+'</text></g>'});
  // kałuże
  G.puddles.forEach(p=>{const k=K(...p.pos);if(!vs[k])return;const [x,y]=px(p.pos);const pa=MBA.puddle();g+='<g transform="translate('+x+','+y+')">'+(pa||'<ellipse rx="20" ry="12" fill="#8fe03a" fill-opacity=".55" stroke="#4f9a12" stroke-width="2"/>')+'</g>'});
  // skrzynki (pamięć drużyny)
  Object.entries(G.memChest[team]).forEach(([k,it])=>{const c=G.cells[k];if(!c)return;const [x,y]=px(c.p);const cha=MBA.chest(ITEMS[it].c);if(cha){g+='<g transform="translate('+x+','+y+')">'+cha+'</g>';return}g+='<g transform="translate('+x+','+y+')"><rect x="-11" y="-9" width="22" height="16" rx="3" fill="#8a5a2b" stroke="#2a180b" stroke-width="2"/><rect x="-11" y="-9" width="22" height="6" rx="2" fill="#b07a3c" stroke="#2a180b" stroke-width="2"/><circle cy="-1" r="3" fill="'+ITEMS[it].c+'"/></g>'});
  // stworki
  G.creeps.forEach(c=>{if(!c.alive)return;const k=K(...c.pos);if(!vs[k])return;const [x,y]=px(c.pos),big=c.ty==='boss',r=big?17:12;
   const ch0=curHero(),lv=CREEP[c.ty].lv,hl0=ch0?ch0.lvl:1,lc=lv<hl0?'#5cff8a':lv===hl0?'#ffe066':'#ff5a4a';g+='<g transform="translate('+x+','+y+')">'+(MBA.creep(big)||'<circle r="'+r+'" fill="'+(big?'#7a2e8a':'#8a6a4a')+'" stroke="#111" stroke-width="2"/><text class="mbs" y="5">'+(big?'M':'S')+'</text>')+'<g transform="translate('+(MBA.creep(big)?(big?18:15):r-2)+','+(MBA.creep(big)?(big?-38:-16):-r+2)+')"><circle r="8" fill="'+lc+'" stroke="#111" stroke-width="1.5"/><text class="mbs" style="font-size:9px;fill:#111;stroke:none" y="3">'+lv+'</text></g><rect x="-14" y="'+(MBA.creep(big)?17:r+3)+'" width="28" height="5" rx="2" fill="#111"/><rect x="-14" y="'+(MBA.creep(big)?17:r+3)+'" width="'+(28*c.hp/CREEP[c.ty].hp).toFixed(1)+'" height="5" rx="2" fill="#e0342b"/></g>'});
  // postacie
  G.heroes.forEach(h=>{if(!seesHero(team,h,vs))return;const [x,y]=px(h.pos),hid=cell(h.pos).t==='b'&&!h.rev;
   g+='<g transform="translate('+x+','+y+')"'+(h===curHero()?' class="mbme"':'')+' opacity="'+(hid&&h.team===team?.75:1)+'">'+(MBA.hero(h)||'<circle r="18" fill="'+TCOL[h.team]+'"/><image href="'+IMG[h.ch]+'" x="-15" y="-15" width="30" height="30" clip-path="url(#mbclip)" preserveAspectRatio="xMidYMid slice"/><circle r="15.5" fill="none" stroke="'+TCOL[h.team]+'" stroke-width="3"/>')
    +'<g transform="translate('+(MBA.hero(h)?'16,-44':'13,-13')+')"><circle r="7" fill="#f2c230" stroke="#111" stroke-width="1.5"/><text class="mbs" style="font-size:9px;fill:#111" y="3">'+h.lvl+'</text></g>'
    +'<rect x="-15" y="20" width="30" height="5" rx="2" fill="#111"/><rect x="-15" y="20" width="'+(30*Math.max(0,h.hp)/maxHp(h)).toFixed(1)+'" height="5" rx="2" fill="#4fc183"/>'+(hid?'<text class="mbs" y="-22" style="font-size:9px">ukryty</text>':'')+'</g>'});
  return '<svg class="mbmap" viewBox="'+[bx,by,bw,bh].map(v=>v.toFixed(0)).join(' ')+'" width="'+(bw*MBZ).toFixed(0)+'" height="'+(bh*MBZ).toFixed(0)+'"><defs><clipPath id="mbclip"><circle r="15"/></clipPath>'+MBA.defs()+'</defs>'+g+'</svg>'}


 /* ---------- oprawa rysunkowa ---------- */
 const MBA=(function(){let TX=null;
  function tex(){if(TX)return TX;const mk=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);return c.toDataURL('image/jpeg',0.86)};
   let sd=5;const rnd=()=>{sd=(sd*16807)%2147483647;return (sd-1)/2147483646};
   const gr=mk(128,128,(g,w,h)=>{g.fillStyle='#86c34f';g.fillRect(0,0,w,h);for(let i=0;i<70;i++){const x=rnd()*w,y=rnd()*h,r=6+rnd()*20,l=rnd()<.5;for(const dx of [-w,0,w])for(const dy of [-h,0,h]){const G2=g.createRadialGradient(x+dx,y+dy,0,x+dx,y+dy,r);G2.addColorStop(0,l?'rgba(165,216,100,.45)':'rgba(92,150,52,.4)');G2.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=G2;g.beginPath();g.arc(x+dx,y+dy,r,0,7);g.fill()}}
    for(let i=0;i<260;i++){const x=rnd()*w,y=rnd()*h,hh=3+rnd()*5;g.strokeStyle=rnd()<.6?'rgba(70,128,40,.6)':'rgba(195,235,125,.65)';g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x+rnd()*2-1,y-hh);g.stroke()}});
   const wa=mk(96,96,(g,w,h)=>{const G2=g.createLinearGradient(0,0,0,h);G2.addColorStop(0,'#3b9ee6');G2.addColorStop(1,'#2a82d0');g.fillStyle=G2;g.fillRect(0,0,w,h);g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=2;for(let i=0;i<9;i++){const x=rnd()*w,y=rnd()*h,l=8+rnd()*14;g.beginPath();g.moveTo(x-l,y);g.quadraticCurveTo(x,y-4,x+l,y);g.stroke()}});
   const fog=mk(64,64,(g,w,h)=>{g.fillStyle='#1b2029';g.fillRect(0,0,w,h);for(let i=0;i<24;i++){g.fillStyle='rgba(255,255,255,'+(0.02+rnd()*0.03)+')';g.beginPath();g.arc(rnd()*w,rnd()*h,4+rnd()*10,0,7);g.fill()}});
   TX={gr,wa,fog};return TX}
  const A=n=>(typeof MBART!=='undefined'&&MBART[n])||null,PR=n=>(typeof PROPS2D!=='undefined'&&PROPS2D[n])||null;
  const hsh=k=>{let h=0;for(const ch of k)h=(h*31+ch.charCodeAt(0))|0;return Math.abs(h)};
  function defs(){const t=tex();const ol=(id,c)=>'<filter id="'+id+'" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="1.4" result="d"/><feFlood flood-color="'+c+'"/><feComposite in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
   return '<pattern id="mbgr" patternUnits="userSpaceOnUse" width="64" height="64"><image href="'+t.gr+'" width="64" height="64"/></pattern><pattern id="mbwa" patternUnits="userSpaceOnUse" width="60" height="60"><image href="'+t.wa+'" width="60" height="60"/></pattern><pattern id="mbfog" patternUnits="userSpaceOnUse" width="40" height="40"><image href="'+t.fog+'" width="40" height="40"/></pattern>'+ol('mbolA',TCOL.A)+ol('mbolB',TCOL.B)}
  /* drzewo: rysunkowa korona z konturem, lekko losowana z klucza pola */
  function tree(k){const h=hsh(k),v=h%3,sc=(0.92+(h%5)*0.04).toFixed(2),dx=(h%7)-3,cs=[['#3f9a3a','#5cbf4a','#86d860'],['#357f34','#4fae43','#7ccc58'],['#4a9a2e','#6cbb3c','#9fd85a']][v];
   const o='stroke="#173214" stroke-width="2.4"';
   return '<ellipse cx="1" cy="13" rx="21" ry="6.5" fill="rgba(25,45,18,.38)"/><g transform="translate('+dx+',0) scale('+sc+')">'
    +'<path d="M-5,14 L-4,-4 L4,-4 L5,14 Q0,16 -5,14Z" fill="#7a4a24" '+o+'/><path d="M-1,10 L-1,-2" stroke="#5a3418" stroke-width="1.6"/>'
    +'<path d="M-22,-6 Q-26,-22 -12,-26 Q-12,-42 4,-40 Q18,-44 20,-28 Q30,-22 24,-8 Q22,4 6,0 Q-2,6 -10,1 Q-24,4 -22,-6Z" fill="'+cs[0]+'" '+o+'/>'
    +'<path d="M-14,-12 Q-17,-24 -6,-26 Q-4,-36 8,-33 Q17,-34 16,-22 Q22,-16 15,-9 Q6,-6 -2,-9 Q-10,-5 -14,-12Z" fill="'+cs[1]+'"/>'
    +'<path d="M-8,-24 Q-4,-31 3,-30 M7,-29 Q13,-28 13,-22" fill="none" stroke="'+cs[2]+'" stroke-width="3" stroke-linecap="round"/>'
    +(h%4===0?'<circle cx="10" cy="-14" r="2.6" fill="#e2463a" stroke="#173214" stroke-width="1.2"/><circle cx="-9" cy="-18" r="2.6" fill="#e2463a" stroke="#173214" stroke-width="1.2"/>':'')+'</g>'}
  /* ścieżka: ubita ziemia z kamyczkami */
  function path(k){const h=hsh(k);let p='<polygon points="'+hexPts(S-3)+'" fill="#c9a46a" stroke="#a9814a" stroke-width="2" stroke-dasharray="7 4" opacity=".95"/><polygon points="'+hexPts(S-9)+'" fill="#d8b77e" opacity=".8"/>';
   for(let i=0;i<4;i++){const a=((h>>(i*3))%360)*Math.PI/180,r=6+((h>>(i*2))%12);p+='<ellipse cx="'+(Math.cos(a)*r).toFixed(1)+'" cy="'+(Math.sin(a)*r*.8).toFixed(1)+'" rx="2.4" ry="1.6" fill="#9c7a4c"/>'}
   return p}
  /* obozowisko stworów: namiot z łat i ognisko */
  function camp(boss){return '<g transform="translate(-13,-10)"><path d="M-11,9 L0,-10 L11,9Z" fill="'+(boss?'#7a3d8c':'#9c6b3c')+'" stroke="#2a180b" stroke-width="2" stroke-linejoin="round"/><path d="M0,-10 L-3,9 L3,9Z" fill="#2a180b"/><rect x="3" y="-1" width="5" height="5" fill="#d9c27a" stroke="#2a180b" stroke-width="1"/></g>'
   +'<g transform="translate(15,12)"><path d="M-8,3 L8,-1 M-8,-1 L8,3" stroke="#5a3418" stroke-width="3.2" stroke-linecap="round"/><path class="mbfire" d="M0,-12 Q6,-5 3,1 Q0,3 -3,1 Q-6,-5 0,-12Z" fill="#ff9a2a" stroke="#b5401a" stroke-width="1.4"/><path d="M0,-6 Q2,-2 1,0 Q0,1 -1,0 Q-2,-2 0,-6Z" fill="#ffe36a"/></g>'}
  function cell(t,sn,P,k,c){if(!sn)return '<polygon points="'+P+'" fill="url(#mbfog)" stroke="#262c36" stroke-width="1.2"/>';
   c=c||{};let s='<polygon points="'+P+'" fill="'+(t==='w'?'url(#mbwa)':'url(#mbgr)')+'" stroke="rgba(250,240,175,.6)" stroke-width="1.4"/>';
   if(c.pa)s+=path(k);
   if(c.camp)s+=camp(c.camp===2);
   if(t==='b'&&c.tr){s+=tree(k);return s}
   if(t==='b'){const im=PR(hsh(k)%2?'bush':'bush2');s+=im?'<ellipse cx="1" cy="12" rx="20" ry="6" fill="rgba(30,50,20,.3)"/><image href="'+im+'" x="-25" y="-30" width="50" height="48"/>':'<path d="M-10,6 q4,-14 8,0 q4,-16 9,0 q3,-10 5,2" fill="none" stroke="#7fd36a" stroke-width="2.5" stroke-linecap="round"/>'}
   if(t==='r'){const im=PR('rock');s+=im?'<ellipse cx="1" cy="12" rx="21" ry="6" fill="rgba(30,40,20,.3)"/><image href="'+im+'" x="-25" y="-28" width="50" height="45"/>':'<path d="M-14,8 L-6,-10 L4,-4 L12,-12 L16,8 Z" fill="#8c8580" stroke="#3b3836" stroke-width="2"/>'}
   if(t!=='w'&&t!=='b'&&t!=='r'&&!c.pa&&!c.camp&&hsh(k)%7===0){const fl=PR('flowers');if(fl)s+='<image href="'+fl+'" x="'+(hsh(k)%2?4:-20)+'" y="2" width="16" height="14" opacity=".9"/>'}
   return s}
  function base(t,b){const im=A('base'+t);if(!im)return null;return '<polygon points="'+hexPts(S-2)+'" fill="'+TCOL[t]+'" fill-opacity=".28" stroke="'+TCOL[t]+'" stroke-width="3"/><ellipse cy="13" rx="24" ry="7" fill="rgba(20,30,15,.35)"/><image href="'+im+'" x="-30" y="-34" width="60" height="52"/><rect x="-18" y="18" width="36" height="6" rx="3" fill="#111"/><rect x="-18" y="18" width="'+(36*b.hp/b.max).toFixed(1)+'" height="6" rx="3" fill="'+TCOL[t]+'"/><text class="mbs" y="-30">'+b.hp+'</text>'}
  function chest(c){const im=A('chest');if(!im)return null;return '<ellipse cy="9" rx="13" ry="4" fill="rgba(20,30,15,.35)"/><image href="'+im+'" x="-15" y="-15" width="30" height="27"/><circle cx="11" cy="-11" r="4.5" fill="'+c+'" stroke="#111" stroke-width="1.2"/>'}
  function puddle(){const im=A('puddle');return im?'<image href="'+im+'" x="-24" y="-12" width="48" height="26" opacity=".95"/>':null}
  function creep(big){const im=A(big?'boss':'rats');if(!im)return null;return big?'<ellipse cy="13" rx="20" ry="6" fill="rgba(20,30,15,.35)"/><image href="'+im+'" x="-28" y="-46" width="56" height="62"/>':'<ellipse cy="11" rx="17" ry="5" fill="rgba(20,30,15,.35)"/><image href="'+im+'" x="-22" y="-20" width="44" height="34"/>'}
  function hero(h){const set=(typeof SPR2D!=='undefined')&&SPR2D[h.ch];if(!set)return null;const im=set[6]||set[0];
   return '<ellipse class="mbring" cy="13" rx="17" ry="6" fill="rgba(20,30,15,.35)" stroke="'+TCOL[h.team]+'" stroke-width="2.5"/><image href="'+im+'" x="-24" y="-50" width="48" height="66" preserveAspectRatio="xMidYMax meet" filter="url(#mbol'+h.team+')"/>'}
  return {defs,cell,base,chest,puddle,creep,hero}})();
 const MBZ=1.3;
 /* ---------- ekrany ---------- */
 const curHero=()=>G&&G.scr==='plan'?G.heroes[G.cur]:null;
 function miniMap(m,big){const s=7,sq=Math.sqrt(3);let g='',x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;const col={'p':'#b08a55','T':'#1d5424','.':'#4b5a3c','*':'#2f7a34','#':'#77706b','w':'#2b6fa8','?':'#b07a3c','c':'#8a6a4a','C':'#7a2e8a','A':'#3e8ef7','B':'#ef4a3c'};
  mapCells(m,big).forEach(({a,ch})=>{const x=s*sq*(a[0]+a[1]/2),y=s*1.5*a[1];x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);g+='<polygon transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')" points="'+hexPts(s-.6)+'" fill="'+(col[ch]||'#4b5a3c')+'"/>'});
  return '<svg viewBox="'+(x0-s)+' '+(y0-s)+' '+(x1-x0+2*s)+' '+(y1-y0+2*s)+'">'+g+'</svg>'}

 /* ---------- ONLINE ---------- */
 let ON=null;
 function seedRng(seed){let s=(seed>>>0)%2147483647||1;return ()=>{s=(s*16807)%2147483647;return (s-1)/2147483646}}
 function withSeed(seed,f){const o=Math.random;Math.random=seedRng(seed);try{return f()}finally{Math.random=o}}
 const onNick=()=>{try{return (typeof PROF!=='undefined'&&PROF.nick)||null}catch(e){return null}};
 function onDb(){if(!net.uid||!net.db||!net.p2p){try{P2P.init()}catch(e){}}return P2P.db}
 function onPub(){if(!ON||!ON.code)return;const r={};Object.keys(ON.myR).map(Number).sort((a,b)=>b-a).slice(0,3).forEach(k=>r[k]=ON.myR[k]);
  const d={nick:onNick()||'',slot:ON.slot,ts:ON.ts||0,ch:ON.ch||null,r};if(ON.host)d.host=ON.hostInfo;
  onDb().doc('rooms/MB'+ON.code+'/players/'+net.uid).set(d)}
 function onSub(){onDb().collection('rooms/MB'+ON.code+'/players').onSnapshot(sn=>{if(!ON)return;ON.docs={};sn.docs.forEach(d=>ON.docs[d.id]=d.data());onSync()})}
 function onHostInfo(){if(!ON)return null;if(ON.host)return ON.hostInfo;const h=Object.values(ON.docs||{}).find(d=>d&&d.host);return h?h.host:null}
 function onSlots(hi){const n=hi.mode==='1v1'?2:hi.mode==='2v2'?4:6,own=[];
  for(let i=0;i<n;i++){const cl=Object.entries(ON.docs).filter(([,d])=>d&&d.slot===i).sort((a,b)=>(a[1].ts-b[1].ts)||(a[0]<b[0]?-1:1));own.push(cl.length?{id:cl[0][0],d:cl[0][1]}:null)}
  const used={};own.forEach(o=>{if(!o||!o.d.ch)return;if(used[o.d.ch])o.dup=true;else used[o.d.ch]=1});return own}
 function onCreate(mode,mi){const R='ACDEFGHJKLMNPQRTUVWXYZ23456789',code='B'+[0,1,2].map(()=>R[Math.floor(Math.random()*R.length)]).join('');
  ON={code,host:true,hostInfo:{mode,mi,seed:Math.floor(Math.random()*2e9)+1,start:false},docs:{},myR:{},ups:{},slot:0,ts:Date.now(),ch:null};onSub();onPub();draw()}
 function onJoin(code){code=(code||'').trim().toUpperCase();if(code.length!==4)return false;ON={code,host:false,docs:{},myR:{},ups:{},slot:null,ts:0,ch:null};onSub();onPub();draw();return true}
 function onLeave(){try{P2P.reset()}catch(e){}ON=null}
 function onStartGame(hi){if(G&&G._on)return;const asg=hi.assign;
  withSeed(hi.seed,()=>newGame(hi.mode,hi.mi));G._on=true;
  asg.forEach((a,i)=>{G.heroes[i].ch=a[1];G.heroes[i].nick=a[2]||''});
  startPositions();updateSeen();ON.slot=asg.findIndex(a=>a[0]===net.uid);G.cur=ON.slot;G.scr='opass';G.pickI=G.heroes.length;draw()}
 function onSync(){if(!ON)return;const hi=onHostInfo();
  if(hi&&hi.start&&hi.assign&&!G){if(hi.assign.some(a=>a[0]===net.uid))onStartGame(hi);else{ON.full=true;draw()}return}
  if(G&&G._on&&G.scr==='owait')onTry();
  else if(!G||!G._on)draw()}
 function onSubmit(){const h=G.heroes[ON.slot],r=G.round;ON.myR[r]={p:h.plans?JSON.parse(JSON.stringify(h.plans)):null,u:ON.ups[r]||[]};onPub();G.scr='owait';onTry()}
 function onTry(){if(!G||G.scr!=='owait')return draw();const hi=onHostInfo(),r=G.round,ents=[];
  for(let i=0;i<hi.assign.length;i++){const d=ON.docs[hi.assign[i][0]],e=d&&d.r&&d.r[r];if(!e)return draw();ents.push(e)}
  ents.forEach((e,i)=>{if(i===ON.slot)return;const h=G.heroes[i];(e.u||[]).forEach(ix=>{const o=upOpts(h)[ix];if(o&&!o.dis){applyUp(h,o);h.pend=Math.max(0,(h.pend||0)-1)}});h.plans=e.p?JSON.parse(JSON.stringify(e.p)):null});
  withSeed(hi.seed+r*7919,()=>resolveRound());G.cur=ON.slot;G.scr=G.winner?'over':'opass';draw()}
 function onDraw(){let h='';
  if(!G){if(ON.pending)return false;
   const hi=onHostInfo();
   if(ON.full)h='<div class="mbbox"><h2>Pokój '+ON.code+'</h2><p class="mbwarn">Gra w tym pokoju już się zaczęła.</p><button data-mb="on:leave">← Wróć</button></div>';
   else if(!hi)h='<div class="mbbox"><h2>Pokój '+ON.code+'</h2><p>Łączenie z pokojem… Jeśli to trwa długo, sprawdź kod i internet.</p><button data-mb="on:leave">← Wróć</button></div>';
   else{const sl=onSlots(hi),me=sl.findIndex(o=>o&&o.id===net.uid),taken=sl.filter((o,i)=>o&&i!==me&&o.d.ch).map(o=>o.d.ch);
    const ok=sl.every(o=>o&&o.d.ch&&!o.dup);
    h='<div class="mbbox"><h2>Bitwa baz online</h2><p>Kod pokoju: <b style="font-size:22px;letter-spacing:3px;color:#ffd84a">'+ON.code+'</b><br>'+hi.mode+' · '+MAPS[hi.mode==='1v1'?'small':'big'][hi.mi].n+'. Podaj kod znajomym.</p>'
     +'<div class="mbteams">'+['A','B'].map(t=>'<div style="border-color:'+TCOL[t]+'"><b style="color:'+TCOL[t]+'">'+TNAME[t]+'</b>'+sl.map((o,i)=>[o,i]).filter(([o,i])=>i%2===(t==='A'?0:1)).map(([o,i])=>
       '<button data-mb="on:slot:'+i+'" style="margin:3px 0;width:100%;'+(i===me?'outline:3px solid #ffd84a;':'')+'" '+(o&&i!==me?'disabled':'')+'>'+(o?((o.d.nick?hfEsc(o.d.nick):'Gracz')+(o.id===net.uid?' (Ty)':'')+' · '+(o.d.ch?SHORT(o.d.ch)+(o.dup?' ⚠':''):'wybiera…')):'+ Wolne miejsce')+'</button>').join('')+'</div>').join('')+'</div>'
     +(me>=0?'<p>Wybierz postać:</p><div class="mbgrid">'+Object.keys(C).filter(n=>n!=='Manekin').map(n=>'<button class="mbtile" data-mb="on:ch:'+n+'" '+(taken.includes(n)?'disabled':'')+' style="'+(sl[me].d.ch===n?'outline:3px solid #ffd84a':'')+'"><img src="'+IMG[n]+'" alt=""><span>'+SHORT(n)+'</span></button>').join('')+'</div>':'<p class="mbwarn">Dotknij wolnego miejsca w drużynie.</p>')
     +(ON.host?'<button class="mbgo" data-mb="on:start" '+(ok?'':'disabled')+'>'+(ok?'Zaczynamy!':'Czekamy, aż wszystkie miejsca będą zajęte…')+'</button>':'<p>'+(ok?'Czekamy, aż założyciel pokoju zacznie grę.':'Czekamy na graczy…')+'</p>')
     +'<button data-mb="on:leave">← Opuść pokój</button></div>'}
   root.innerHTML=h;return true}
  if(G.scr==='opass'){const hh=G.heroes[ON.slot];
   h='<div class="mbbox"><p>Online · pokój '+ON.code+'</p><h2 style="color:'+TCOL[hh.team]+'">Runda '+G.round+' · '+hh.ch+'</h2><p>'+TNAME[hh.team]+(hh.nick?' · '+hfEsc(hh.nick):'')+'</p>'
    +(hh.dead?'<p class="mbwarn">Twoja postać nie żyje. Odrodzi się w bazie za '+hh.dead+' '+(hh.dead===1?'rundę':'rundy')+'.</p><button class="mbgo" data-mb="skip">Dalej</button>':'<button class="mbgo" data-mb="ready">Planuj rundę</button>')+'<button data-mb="quit">Opuść grę</button></div>';
   root.innerHTML=h;return true}
  if(G.scr==='owait'){const hi=onHostInfo(),r=G.round;
   const rows=hi.assign.map((a,i)=>{const d=ON.docs[a[0]],ok=!!(d&&d.r&&d.r[r]),hh=G.heroes[i];return '<div style="color:'+TCOL[hh.team]+';margin:2px 0">'+(ok?'✓ ':'⏳ ')+(a[2]?hfEsc(a[2])+' · ':'')+hh.ch+(i===ON.slot?' (Ty)':'')+'</div>'}).join('');
   h='<div class="mbbox"><h2>Runda '+r+'</h2><p>Twój plan wysłany. Czekamy na pozostałych graczy…</p><div>'+rows+'</div><p style="opacity:.7">Pokój '+ON.code+'</p><button data-mb="quit">Opuść grę</button></div>';
   root.innerHTML=h;return true}
  return false}
 function onClickOn(v){
  if(v==='on:host'){ON={pending:true};MSEL=null;draw();return true}
  if(v==='on:join'){const el=root.querySelector('#mbcode'),cv=((el&&el.value)||'').trim().toUpperCase();
   if(cv.length===4&&cv[0]!=='B'){if(el){el.style.outline='3px solid #ff5a4a';let w=root.querySelector('.mbcw');if(!w){w=document.createElement('p');w.className='mbwarn mbcw';el.parentNode.insertAdjacentElement('afterend',w)}w.textContent='Kody Bitwy baz zaczynają się od litery B. Ten kod jest do zwykłej gry – wpisz go w menu głównym w „Dołącz kodem”.'}return true}
   if(!onJoin(cv)){if(el)el.style.outline='3px solid #ff5a4a'}return true}
  if(v==='on:leave'){onLeave();draw();return true}
  if(v==='mback'&&ON&&ON.pending&&!MSEL){ON=null;draw();return true}
  if(ON&&ON.pending&&v.startsWith('map:')){const mode=MSEL;MSEL=null;onCreate(mode,+v.slice(4));return true}
  if(!ON||ON.pending)return false;
  if(v.startsWith('on:slot:')){ON.slot=+v.slice(8);ON.ts=Date.now();ON.ch=null;onPub();draw();return true}
  if(v.startsWith('on:ch:')){ON.ch=v.slice(6);onPub();draw();return true}
  if(v==='on:start'&&ON.host){const sl=onSlots(ON.hostInfo);if(!sl.every(o=>o&&o.d.ch&&!o.dup))return true;ON.hostInfo.assign=sl.map(o=>[o.id,o.d.ch,o.d.nick||'']);ON.hostInfo.start=true;onPub();onSync();return true}
  if(v==='quit'){onLeave();return false}
  return false}
 function open(){root=document.getElementById('mbRoot');if(!root){root=document.createElement('div');root.id='mbRoot';document.body.appendChild(root);root.addEventListener('click',onClick)}G=null;MSEL=null;draw()}
 function close(){if(root)root.remove();root=null;G=null;if(ON)onLeave()}
 function draw(){if(!root)return;let h='';if(ON&&onDraw())return;
  if(!G){h='<div class="mbbox"><h2>Bitwa baz <span class="mbbeta">BETA</span></h2><p>Każda drużyna startuje w swojej bazie. Skały zasłaniają widok. Za krzakiem znasz teren, ale nie widzisz, kto tam jest – możesz tam wejść na własne ryzyko (pomarańczowe pola). Odkrywaj mapę, zbieraj przedmioty, pokonuj stworki dla doświadczenia i zniszcz wrogą bazę. Postacie zaczynają słabe i rosną z poziomami.</p>'
   +(MSEL?'<p><b>'+MSEL+'</b> · wybierz mapę</p><div class="mbmaps">'+MAPS[MSEL==='1v1'?'small':'big'].map((m,i)=>'<button class="mbmapb" data-mb="map:'+i+'">'+miniMap(m,MSEL!=='1v1')+'<b>'+m.n+(m.id==='maze'?' 🎲':'')+'</b><small>'+m.d+'</small></button>').join('')+'</div><button data-mb="mback">← Zmień rozmiar</button>'
   :(ON&&ON.pending?'':'<b>Na jednym telefonie</b>')+'<button class="mbbig" data-mb="mode:1v1"><b>1 vs 1</b><small>Małe mapy (ok. 75 pól), baza 12 HP</small></button>'
   +'<button class="mbbig" data-mb="mode:2v2"><b>2 vs 2</b><small>Duże mapy (ok. 120 pól), baza 20 HP</small></button>'
   +'<button class="mbbig" data-mb="mode:3v3"><b>3 vs 3</b><small>Duże mapy (ok. 120 pól), baza 20 HP</small></button>')
   +(MSEL?'':(ON&&ON.pending?'<p class="mbwarn">Zakładasz pokój online: wybierz rozmiar, potem mapę.</p><button data-mb="on:leave">Anuluj pokój online</button>':'<div class="mbonl"><b>Online – każdy na swoim telefonie</b><button class="mbbig" data-mb="on:host"><b>Załóż pokój</b><small>Wybierz rozmiar i mapę, dostaniesz kod dla znajomych</small></button><div style="display:flex;gap:6px"><input id="mbcode" maxlength="4" placeholder="KOD" autocapitalize="characters" style="flex:1;min-width:0;font:800 18px system-ui;text-align:center;letter-spacing:3px;padding:8px;border-radius:10px;border:2px solid #c8954a;background:#fff8e8;color:#2a180b;text-transform:uppercase"><button data-mb="on:join" style="flex:1">Dołącz</button></div></div>'))+'<button data-mb="quit">← Wróć do menu</button></div>'}
  else if(G.scr==='pick'){const hh=G.heroes[G.pickI],taken=G.heroes.filter(x=>x.ch).map(x=>x.ch);
   h='<div class="mbbox"><h2 style="color:'+TCOL[hh.team]+'">Gracz '+hh.pl+' · '+TNAME[hh.team]+'</h2><p>Wybierz postać.</p><div class="mbgrid">'
   +Object.keys(C).map(n=>'<button class="mbtile" data-mb="pick:'+n+'" '+(taken.includes(n)?'disabled':'')+'><img src="'+IMG[n]+'" alt=""><span>'+SHORT(n)+'</span></button>').join('')+'</div>'
   +'<div class="mbteams">'+['A','B'].map(t=>'<div style="border-color:'+TCOL[t]+'"><b style="color:'+TCOL[t]+'">'+TNAME[t]+'</b>'+G.heroes.filter(x=>x.team===t).map(x=>'<span>'+(x.ch||'…')+'</span>').join('')+'</div>').join('')+'</div></div>'}
  else if(G.scr==='pass'){const hh=G.heroes[G.cur];
   h='<div class="mbbox"><p>Przekaż telefon</p><h2 style="color:'+TCOL[hh.team]+'">Gracz '+hh.pl+' · '+hh.ch+'</h2><p>'+TNAME[hh.team]+' · runda '+G.round+'. Przeciwnicy niech nie patrzą.</p>'
   +(hh.dead?'<p class="mbwarn">Twoja postać nie żyje. Odrodzi się w bazie za '+hh.dead+' '+(hh.dead===1?'rundę':'rundy')+'.</p><button class="mbgo" data-mb="skip">Dalej</button>':'<button class="mbgo" data-mb="ready">Jestem gotowy</button>')+'</div>'}
  else if(G.scr==='levelup'){const hh=G.heroes[G.cur],os=upOpts(hh);h='<div class="mbbox"><h2 style="color:#f2c230">Awans! Poziom '+hh.lvl+'</h2><p>'+hh.ch+' · wybierz jedno wzmocnienie'+(hh.pend>1?' (zostało '+hh.pend+')':'')+'.</p>'+(G._lastUp&&hh.pend>0?'<p style="color:#5cff8a">Wybrano: '+G._lastUp+'</p>':'')+'<div class="mbups">'+os.map((o,i)=>'<button data-mb="up:'+i+'" '+(o.dis?'disabled':'')+'><b>'+o.l+'</b><small>'+(o.dis?'Maksimum':o.d)+'</small></button>').join('')+'</div></div>'}
  else if(G.scr==='plan')h=planH();
  else if(G.scr==='over'){const w=G.winner;h='<div class="mbbox"><h2 style="color:'+TCOL[w]+'">Wygrywa '+TNAME[w]+'!</h2><p>Baza przeciwnika zniszczona w rundzie '+(G.round-1)+'. Mapa: '+G.mapN+'.</p><table class="mbtab"><tr><th>Postać</th><th>Poz.</th><th>Zab.</th><th>Obr.</th></tr>'
   +G.heroes.map(x=>'<tr style="color:'+TCOL[x.team]+'"><td>'+x.ch+'</td><td>'+x.lvl+'</td><td>'+x.kills+'</td><td>'+x.dmgDone+'</td></tr>').join('')+'</table><button class="mbgo" data-mb="quit">Menu główne</button></div>'}
  root.innerHTML=h;
  if(G&&G.scr==='plan'){const hh=curHero(),sc=root.querySelector('.mbscroll'),svg=root.querySelector('.mbmap');if(hh&&sc&&svg&&!G._scrolled){G._scrolled=true;const [bx,by]=bounds(),p=px(G._ghost||hh.pos);sc.scrollLeft=(p[0]-bx)*MBZ-sc.clientWidth/2;sc.scrollTop=(p[1]-by)*MBZ-sc.clientHeight/2}else if(sc&&G._sc){sc.scrollLeft=G._sc[0];sc.scrollTop=G._sc[1]}}}
 function posAtPhase(h,ph){let p=h.pos.slice();for(let i=0;i<ph;i++){const a=G.plan[i];if(a&&a.t==='move'&&a.m)p=a.m.slice();if(a&&a.t==='charge'&&a.d!=null){let cur=p;for(let k=0;k<chargeRng(h);k++){const q=step(cur,a.d),c=cell(q);if(!c||c.t==='r'||c.t==='base')break;cur=q}p=cur}}return p}
 function planHL(h){const hl={},ph=G.ph,a=G.plan[ph],p=posAtPhase(h,ph);
  if(a.t==='move'){const vs0=visSet(h.team);Object.keys(moveCells(h,p)).forEach(k=>{hl[k]=vs0[k]?{f:'rgba(92,255,138,.22)',s:'#5cff8a'}:{f:'rgba(255,170,60,.25)',s:'#ffaa3c',t:'?'}});if(a.m)hl[K(...a.m)]={f:'rgba(242,194,48,.5)',s:'#ffe066',t:'●'}}
  else if(['atk','sheep','charge','puddle','aim'].includes(a.t)){
   if(a.d==null)nb(p).forEach(q=>{hl[K(...q)]={s:'#ff6b5b'}});
   else if(a.t==='charge'){let cur=p;for(let k=0;k<chargeRng(h);k++){const q=step(cur,a.d),c=cell(q);if(!c||c.t==='r')break;hl[K(...q)]={f:'rgba(255,70,50,.35)',s:'#ff6b5b',t:'»'};if(c.t==='base')break;cur=q}}
   else if(a.t==='puddle'){let q=step(p,a.d);for(let k=1;k<=pudRng(h);k++){const z=step(p,a.d,k),cz=cell(z);if(!cz||cz.t==='r'||cz.t==='base')break;if(passable(z))q=z}if(cell(q))hl[K(...q)]={f:'rgba(143,224,58,.45)',s:'#8fe03a',t:'☠'}}
   else if(a.t==='aim'){lineCells(p,a.d,9).forEach(q=>{hl[K(...q)]={f:'rgba(255,224,102,.25)',s:'#ffe066',t:'◎'}})}
   else{const sh=atkShape(h,p,a.d,a.t);sh.cells.forEach(([q,dm])=>{hl[K(...q)]={f:'rgba(255,70,50,.38)',s:'#ff6b5b',t:String(dm+dmgB(h))}})}}
  else if(a.t==='snipe'&&G.plan[0]&&G.plan[0].d!=null)lineCells(p,G.plan[0].d,9).forEach(q=>{hl[K(...q)]={f:'rgba(255,70,50,.38)',s:'#ff6b5b',t:String(3+dmgB(h))}});
  else if(a.t==='drone2')Object.values(G.cells).forEach(c=>{if(dist(c.p,p)<=droneRng(h)&&dist(c.p,p)>0)hl[K(...c.p)]={f:'rgba(200,200,220,.12)'}});
  if(ph>0)hl[K(...p)]=Object.assign(hl[K(...p)]||{},{s:'#ffffff'});
  return hl}
 function infoAt(p){const me=curHero(),vs=visSet(me.team);if(!vs[K(...p)])return null;
  const c=G.creeps.find(c=>c.alive&&eq(c.pos,p));
  if(c){const df=CREEP[c.ty],diff=df.lv<me.lvl?['#5cff8a','Łatwy']:df.lv===me.lvl?['#ffe066','Wyrównany']:['#ff5a4a','Trudny'];
   return '<div class="mbinfo"><div class="mbih"><b>'+df.n+'</b><span style="background:'+diff[0]+'">Poz. '+df.lv+' · '+diff[1]+'</span></div>'
    +'<div class="mbis"><div>HP<b>'+c.hp+'/'+df.hp+'</b></div><div>Obrażenia<b>'+df.dmg+'/fazę</b></div><div>Nagroda<b>'+df.xp+' XP</b></div></div>'
    +'<p>'+df.info+' Nie widzi postaci w krzakach. Goni do 4 pól od legowiska, potem wraca i leczy się o 1 HP na rundę. Odradza się po 5 rundach.</p><p><b>Zalecane:</b> '+df.rec+' Ty: poz. '+me.lvl+', '+me.hp+' HP, atak '+(1+dmgB(me))+'+ DMG.</p><button data-mb="info">Zamknij</button></div>'}
  const h=G.heroes.find(y=>!y.dead&&y.pos&&eq(y.pos,p)&&seesHero(me.team,y,vs));
  if(h)return '<div class="mbinfo"><div class="mbih"><b style="color:'+TCOL[h.team]+'">'+h.ch+'</b><span style="background:#f2c230">Poz. '+h.lvl+'</span></div><div class="mbis"><div>HP<b>'+h.hp+'/'+maxHp(h)+'</b></div><div>Przedmioty<b>'+(h.items.map(i=>ITEMS[i].n).join(', ')||'brak')+'</b></div><div>'+(h.team===me.team?'Sojusznik':'Wróg')+'<b>'+TNAME[h.team].split(' ')[1]+'</b></div></div>'
   +'<p>'+abilityList(h).filter(x=>x.on).map(x=>x.t).join(' · ')+'</p><button data-mb="info">Zamknij</button></div>';
  return null}
 function planOk(h){const a=G.plan[G.ph];if(!a.t)return false;if(a.t==='move')return !!a.m;if(a.t==='stay'||a.t==='snipe'||a.t==='drone'||a.t==='drone2')return true;return a.d!=null}
 function hint(h){const a=G.plan[G.ph];if(!a.t)return 'Wybierz akcję na tę fazę. Dotknij stworka lub postaci, by zobaczyć statystyki.';
  return {move:a.m?(visSet(h.team)[K(...a.m)]?'Ruch na wybrane pole.':'Ruch za krzak – nie widać, kto tam jest. Na własne ryzyko!'):'Dotknij zielonego pola. Pomarańczowe: za krzakiem, nie widać, kto tam jest.',stay:'Zostajesz na miejscu.',atk:a.d==null?'Dotknij pola obok, by wybrać kierunek.':'Atak: '+DNAME[a.d]+'. Liczby to obrażenia.',
   charge:a.d==null?'Kierunek szarży: pole obok.':'Szarża: do '+chargeRng(h)+' pól, '+(chargeDmg(h)+dmgB(h))+' DMG i odrzut.',sheep:a.d==null?'Kierunek owcy: pole obok.':'Owca biegnie 4 pola, 2 DMG każdemu.',
   puddle:a.d==null?'Kierunek kałuży: pole obok.':'Kałuża trucizny na 2 rundy (do '+pudRng(h)+' pól).',aim:a.d==null?'Celowanie: kierunek.':'W fazie II wybierz „Snajperski”.',snipe:'Strzał snajperski: 3 DMG przez całą mapę.',
   drone:'Aktywujesz drona (cała faza I).',drone2:'Dron atakuje najbliższego wroga do '+droneRng(h)+' pól od ciebie ('+(droneDmg(h)+dmgB(h))+' DMG).'}[a.t]||''}
 function planH(){const h=curHero(),ph=G.ph,np=nPh(h),hl=planHL(h),k=kit(h,ph,G.plan),a=G.plan[ph],al=abilityList(h),xpN=h.lvl<MAXLV?LVLXP[h.lvl]:null;
  let s='<div class="mbtop"><span style="color:'+TCOL[h.team]+'">Runda '+G.round+' · Gracz '+h.pl+'</span><span class="mbb" style="color:'+TCOL.A+'">🏰 '+G.bases.A.hp+'</span><span class="mbb" style="color:'+TCOL.B+'">🏰 '+G.bases.B.hp+'</span><button data-mb="log">Dziennik</button></div>';
  s+='<div class="mbscroll">'+mapSvg(h.team,hl)+'</div>';
  if(G._info)s+=G._info;
  if(G._showLog)s+='<div class="mblog"><b>Ostatnia runda ('+TNAME[h.team]+')</b>'+((G.log[h.team]||[]).length?G.log[h.team].map(t=>'<div>'+t+'</div>').join(''):'<div>Nic nie widzieliście.</div>')+'<button data-mb="log">Zamknij</button></div>';
  s+='<div class="mbpanel"><div class="mbhero"><img src="'+IMG[h.ch]+'" style="border-color:'+TCOL[h.team]+'"><div><b>'+h.ch+' <i>poz. '+h.lvl+'</i></b>'
   +'<div class="mbbar"><span style="width:'+(100*Math.max(0,h.hp)/maxHp(h))+'%;background:#4fc183"></span><em>HP '+h.hp+'/'+maxHp(h)+'</em></div>'
   +'<div class="mbbar"><span style="width:'+(xpN?100*(h.xp-LVLXP[h.lvl-1])/(xpN-LVLXP[h.lvl-1]):100)+'%;background:#f2c230"></span><em>'+(xpN?'XP '+h.xp+'/'+xpN:'Maks. poziom')+'</em></div></div>'
   +'<div class="mbitems">'+[0,1,2].map(i=>{const it=h.items[i];return '<span title="'+(it?ITEMS[it].d:'')+'" style="'+(it?'background:'+ITEMS[it].c:'')+'">'+(it?ITEMS[it].g:'')+'</span>'}).join('')+'</div></div>'
   +'<div class="mbphase">'+Array.from({length:np},(_,i)=>'<span class="'+(i===ph?'on':i<ph?'done':'')+'">'+['I','II','III'][i]+'</span>').join('')+'<small>'+hint(h)+'</small></div>'
   +'<div class="mbacts">'+k.map(x=>'<button data-mb="act:'+x.t+'" class="'+(a.t===x.t?'on':'')+' t-'+x.t+'" '+(x.dis?'disabled':'')+'>'+x.l+'</button>').join('')+'</div>'
   +'<div class="mbok">'+(ph>0?'<button data-mb="prev">← Wróć</button>':'')+'<button class="mbgo" data-mb="ok" '+(planOk(h)?'':'disabled')+'>'+(ph<np-1?'Zatwierdź fazę '+['I','II','III'][ph]:'Zatwierdź plan')+'</button></div>'
   +'<details class="mbab"><summary>Umiejętności postaci</summary>'+al.map(x=>'<div class="'+(x.on?'on':'')+'">'+(x.lv?'Poz. '+x.lv+': ':'')+x.t+'</div>').join('')+'</details></div>';
  return s}
 function nextPlayer(){if(ON&&G&&G._on){onSubmit();return}
  for(let i=G.cur+1;i<G.heroes.length;i++){G.cur=i;G.scr='pass';return}
  resolveRound();if(G.winner){G.scr='over';return}G.cur=0;G.scr='pass'}
 function onClick(e){const t=e.target.closest('[data-mb]'),mk=e.target.closest('[data-mk]');
  if(!t&&mk&&G&&G.scr==='plan'){const sc=root.querySelector('.mbscroll');if(sc)G._sc=[sc.scrollLeft,sc.scrollTop];const cp=mk.dataset.mk.split(',').map(Number);G._info=null;const used=tapCell(cp);if(!used||G.creeps.some(c=>c.alive&&eq(c.pos,cp)))G._info=infoAt(cp);draw();return}
  if(!t)return;e.stopPropagation();let v=t.dataset.mb;try{SND.play('click')}catch(_){}if(onClickOn(v))return;
  const sc=root.querySelector('.mbscroll');if(sc)G&&(G._sc=[sc.scrollLeft,sc.scrollTop]);
  if(v==='quit'){close();try{goMenu()}catch(_){}return}
  if(v.startsWith('mode:')){MSEL=v.slice(5);draw();return}
  if(v==='mback'){MSEL=null;draw();return}
  if(v.startsWith('map:')){newGame(MSEL,+v.slice(4));MSEL=null;draw();return}
  if(v.startsWith('pick:')){G.heroes[G.pickI].ch=v.slice(5);G.pickI++;if(G.pickI>=G.heroes.length){startPositions();updateSeen();G.cur=0;G.scr='pass'}draw();return}
  if(v.startsWith('up:')){const h=G.heroes[G.cur],o=upOpts(h)[+v.slice(3)];if(!o||o.dis)return;applyUp(h,o);h.pend--;if(ON&&G&&G._on){(ON.ups[G.round]=ON.ups[G.round]||[]).push(+v.slice(3))}G._lastUp=o.l;if(h.pend>0){draw();return}v='ready'}
  if(v==='ready'&&G.heroes[G.cur].pend>0){G.scr='levelup';draw();return}
  if(v==='ready'){G._info=null;const h=G.heroes[G.cur];G.plan=Array.from({length:nPh(h)},()=>({t:null,m:null,d:null}));G.ph=0;G.scr='plan';G._scrolled=false;G._sc=null;G._showLog=(G.log[h.team]||[]).length>0&&G.round>1;draw();return}
  if(v==='skip'){nextPlayer();draw();return}
  if(v==='log'){G._showLog=!G._showLog;draw();return}
  if(v==='info'){G._info=null;draw();return}
  if(v.startsWith('act:')){const a=G.plan[G.ph];a.t=v.slice(4);a.m=null;a.d=null;draw();return}
  if(v==='prev'){if(G.ph>0)G.ph--;draw();return}
  if(v==='ok'){const h=curHero();if(!planOk(h))return;if(G.plan[G.ph].t==='stay')G.plan[G.ph]={t:'move',m:posAtPhase(h,G.ph),d:null,stay:true};
   if(G.ph<nPh(h)-1){G.ph++;draw();return}h.plans=G.plan.map(x=>Object.assign({},x));nextPlayer();draw();return}}
 function tapCell(p){const h=curHero(),a=G.plan[G.ph],from=posAtPhase(h,G.ph);
  if(a.t==='move'){if(moveCells(h,from)[K(...p)]){a.m=p;return true}return false}
  if(['atk','sheep','charge','puddle','aim'].includes(a.t)){const i=DIRS.findIndex((d,j)=>eq(step(from,j),p));if(i>=0){a.d=i;return true}}return false}
 return {open,close,get G(){return G},newGame,resolveRound,visSet,seesHero,atkShape,kit,maxHp,draw,_set:g=>{G=g}}})();
/* wejście w trybie Testy: ekran wyboru rodzaju walki */
const _rMB=render;render=function(){_rMB();try{if(st.scr==='lobby'&&st.gm==='test'&&!st.tm2){const last=[...app.querySelectorAll('[data-tm]')].pop();if(last&&!app.querySelector('[data-mbopen]'))last.insertAdjacentHTML('afterend','<button class="mbtn tbmode" data-mbopen="1"><b>Bitwa baz</b><small>Drużyny 1v1, 2v2 lub 3v3. Odkrywanie mapy, krzaki, stworki, przedmioty, poziomy postaci. Cel: zniszczyć wrogą bazę.</small></button>')}}catch(e){}};
window.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-mbopen]');if(!t)return;e.preventDefault();e.stopImmediatePropagation();try{SND.play('click')}catch(_){}MB.open()},true);
const _goMenuMB=goMenu;goMenu=function(){try{MB.close()}catch(e){}_goMenuMB()};
render();
