/* --- Bitwa baz, część: silnik – widoczność i rozstrzyganie rundy. Części są fragmentami jednego domknięcia MB i muszą być sklejane w kolejności z manifestu. --- */
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

