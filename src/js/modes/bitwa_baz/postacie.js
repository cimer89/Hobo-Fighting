/* --- Bitwa baz, część: postacie – budowa gry, statystyki, zestaw umiejętności. Części są fragmentami jednego domknięcia MB i muszą być sklejane w kolejności z manifestu. --- */
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

