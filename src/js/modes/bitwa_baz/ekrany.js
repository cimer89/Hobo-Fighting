/* --- Bitwa baz, część: ekrany – ekrany, planowanie, kliknięcia (koniec domknięcia MB). Części są fragmentami jednego domknięcia MB i muszą być sklejane w kolejności z manifestu. --- */
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
