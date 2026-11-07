/* ===================== Postacie: podgląd akcji (demo) ===================== */
/* --- z części: PODGLĄD AKCJI POSTACI --- */
const DM={S:21,timers:[],ch:null,i:0};
function dmXY(c){const s=DM.S;return [1.5*s*c[0],Math.sqrt(3)*s*(c[1]+c[0]/2)]}
function dmHexPts(){const s=DM.S-1;let a=[];for(let i=0;i<6;i++){const t=Math.PI/3*i;a.push((s*Math.cos(t)).toFixed(1)+','+(s*Math.sin(t)).toFixed(1))}return a.join(' ')}
const dmNb=c=>nbCells(c), dmAll=()=>cells.map(c=>c.slice()), dmDist=(a,b)=>dist(a[0]-b[0],a[1]-b[1]);
function dmTokH(kind){const D2='#140d07';
 if(kind==='hero'){const col=C[DM.ch].col;return '<circle r="18" fill="'+col+'" stroke="'+D2+'" stroke-width="2"/><image href="'+IMG[DM.ch]+'" x="-15.5" y="-15.5" width="31" height="31" clip-path="url(#dmclip)" preserveAspectRatio="xMidYMid slice"/><circle r="15.5" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.2"/>'}
 if(kind==='foe')return '<circle r="16" fill="#4a4f57" stroke="'+D2+'" stroke-width="2"/><circle cy="-4" r="5.5" fill="#22262c"/><path d="M-9,10 Q0,-2 9,10 Z" fill="#22262c"/><circle r="13.5" fill="none" stroke="#ff6b5b" stroke-opacity=".7" stroke-width="1.5" stroke-dasharray="4 3"/>';
 if(kind==='sheep')return '<g stroke="'+D2+'" stroke-width="1.5" fill="#f4f1ea"><circle cx="-7" cy="-2" r="7"/><circle cx="6" cy="-3" r="7.5"/><circle cx="0" cy="4" r="8"/><circle cx="-5" cy="-8" r="6"/><circle cx="5" cy="-9" r="5.5"/></g><ellipse cx="10" cy="1" rx="5" ry="6" fill="#2a2a2a"/><circle cx="11.5" cy="0" r="1.2" fill="#fff"/>';
 if(kind==='drone')return '<g stroke="#111" stroke-width="1.5"><line x1="-10" y1="-10" x2="10" y2="10"/><line x1="10" y1="-10" x2="-10" y2="10"/><g fill="#9aa4ad" fill-opacity=".8"><circle cx="-10" cy="-10" r="5"/><circle cx="10" cy="-10" r="5"/><circle cx="-10" cy="10" r="5"/><circle cx="10" cy="10" r="5"/></g><rect x="-5" y="-5" width="10" height="10" rx="2" fill="#4c5530"/></g><circle r="2" fill="#ff3b30"/>';
 if(kind==='puddle')return '<ellipse rx="18" ry="13" fill="#8fe03a" fill-opacity=".55" stroke="#4f9a12" stroke-width="1.5"/><circle cx="-6" cy="-2" r="2.5" fill="#d8ff9c"/><circle cx="5" cy="3" r="1.8" fill="#d8ff9c"/>';
 return ''}
function dmAt(ms,f){DM.timers.push(setTimeout(f,ms))}
function dmStop(){DM.timers.forEach(clearTimeout);DM.timers=[]}
function dmApi(svg){const L=n=>svg.querySelector('.'+n);
 const api={
  tok(id,kind,c){const [x,y]=dmXY(c);const lay=kind==='puddle'?L('dmlp'):L('dmlt');lay.insertAdjacentHTML('beforeend','<g class="dmt dm-'+kind+'" id="dmt-'+id+'" style="transform:translate('+x+'px,'+y+'px)"><g class="dmi">'+dmTokH(kind)+'</g></g>');return api},
  mv(id,c,how,off){const e=svg.querySelector('#dmt-'+id);if(!e)return;let [x,y]=dmXY(c);if(off){x+=off[0];y+=off[1]}const i=e.firstChild;
   if(how==='tele'){i.classList.add('tout');setTimeout(()=>{e.style.transition='none';e.style.transform='translate('+x+'px,'+y+'px)';void e.getBoundingClientRect();e.style.transition='';i.classList.remove('tout');i.classList.add('tin')},320);return}
   if(how==='fast')e.classList.add('fast');else e.classList.remove('fast');
   if(how==='jump'){i.classList.remove('jump');void i.getBoundingClientRect();i.classList.add('jump')}
   e.style.transform='translate('+x+'px,'+y+'px)'},
  mark(cs,cls,labels){cs.forEach((c,k)=>{const h=svg.querySelector('[data-dk="'+c[0]+','+c[1]+'"]');if(h)h.classList.add(cls);
   if(labels&&labels[k]!=null){const [x,y]=dmXY(c);L('dmll').insertAdjacentHTML('beforeend','<text class="dml" x="'+x+'" y="'+(y+5)+'">'+labels[k]+'</text>')}});return api},
  clear(){svg.querySelectorAll('.dmhx').forEach(h=>h.setAttribute('class','dmhx'));L('dmll').innerHTML='';return api},
  dmg(id,txt,heal){const e=svg.querySelector('#dmt-'+id);if(!e)return;const i=e.firstChild;i.classList.remove('shk');void i.getBoundingClientRect();if(!heal)i.classList.add('shk');
   const m=/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(e.style.transform)||[0,0,0];
   L('dmlf').insertAdjacentHTML('beforeend','<text class="dmf'+(heal?' heal':'')+'" x="'+m[1]+'" y="'+(m[2]-20)+'">'+txt+'</text>')},
  act(id,cls){const e=svg.querySelector('#dmt-'+id);if(!e)return;const i=e.firstChild;i.classList.remove(cls);void i.getBoundingClientRect();i.classList.add(cls)},
  gone(id){const e=svg.querySelector('#dmt-'+id);if(e)e.firstChild.classList.add('gone')},
  shot(a,b,col){const [x1,y1]=dmXY(a),[x2,y2]=dmXY(b);L('dmlf').insertAdjacentHTML('beforeend','<line class="dmshot" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+(col||'#ffe27a')+'" pathLength="1"/>')},
  cap(t){const e=document.querySelector('#demoOv .dmcap');if(e){e.innerHTML='<span>'+t+'</span>';e.classList.remove('in');void e.offsetWidth;e.classList.add('in')}}};
 return api}
const DH=[0,1],N=(c,d,k)=>[c[0]+D[d][0]*(k||1),c[1]+D[d][1]*(k||1)];
function dmMove(lbl){return {t:lbl||'Ruch',d:'Jedna akcja na fazę: ruch o 1 pole albo zostanie w miejscu.',T:4200,run(a){a.tok('h','hero',DH);
 dmAt(300,()=>{a.mark([DH,...dmNb(DH)],'opt');a.cap('Zielone pola: tam możesz pójść (albo zostać).')});
 dmAt(1500,()=>{a.mark([N(DH,1)],'pick');a.cap('Dotykasz wybranego pola.')});
 dmAt(2200,()=>{a.clear();a.mv('h',N(DH,1));a.cap('Ruch wykonuje się w odkryciu, razem z ruchami innych.')})}}}
function dmLine(t,d,foes,dm,opt){return {t,d,T:opt.T||4800,tag:opt.tag,run(a){a.tok('h','hero',DH);foes.forEach((f,k)=>a.tok('f'+k,'foe',f));
 const cs=attack(DH,2,opt.ph||0,DM.ch);
 dmAt(300,()=>{a.mark(dmNb(DH),'opt');a.cap('Wybierasz kierunek: dotknij pola obok siebie.')});
 dmAt(1400,()=>{a.clear();a.mark([N(DH,2)],'pick')});
 dmAt(1900,()=>{a.clear();a.mark(cs.map(c=>[c[0],c[1]]),'hit',opt.nolab?null:cs.map(c=>c[2]));a.cap(opt.c1)});
 dmAt(2700,()=>{a.act('h','swing');if(opt.shot)a.shot(DH,opt.shot,opt.col);dm.forEach(([k,txt])=>a.dmg('f'+k,txt));a.cap(opt.c2)});
 if(opt.after)opt.after(a)}}}
function dmCrush(){return {t:'Ścisk',d:'Gdy dwie postacie skończą ruch na tym samym polu, obie dostają 1 DMG.',T:4200,run(a){const m=N(DH,2);a.tok('h','hero',DH).tok('f0','foe',N(m,1));
 dmAt(400,()=>{a.mark([m],'pick');a.cap('Ty i przeciwnik planujecie wejść na to samo pole…')});
 dmAt(1500,()=>{a.clear();a.mv('h',m,0,[-8,3]);a.mv('f0',m,0,[8,-3])});
 dmAt(2100,()=>{a.mark([m],'hit');a.dmg('h','−1');a.dmg('f0','−1');a.cap('<b>Ścisk:</b> obie postacie −1 HP. Planuj tak, żeby zaskoczyć rywala!')})}}}
const DEMOS={
 'Wiatrak':()=>[dmMove(),dmLine('Atak',C['Wiatrak'].txt,[N(DH,2),N(DH,1)],[[0,'−2'],[1,'−1']],{c1:'Wachlarz 3 pól przed tobą.',c2:'Środek 2 DMG, boki po 1 DMG.'}),dmCrush()],
 'Długi':()=>[dmMove(),dmLine('Atak',C['Długi'].txt,[N(DH,2),N(DH,2,3)],[[0,'−1'],[1,'−2']],{c1:'Linia 3 pól: 1 – 1 – 2 DMG.',c2:'Trafia wszystkich w linii. Najdalsze pole bije najmocniej.'}),
  {t:'3 fazy',d:'Długi planuje 3 akcje w rundzie zamiast 2. Trzecia przepada, jeśli ktoś go przesunie.',T:4600,run(a){a.tok('h','hero',DH);
   [[300,1,'Faza I'],[1500,2,'Faza II'],[2700,3,'Faza III – tylko Długi!']].forEach(([t,k,l],j)=>dmAt(t,()=>{const p=[DH,N(DH,2),N(N(DH,2),1),N(N(N(DH,2),1),2)];a.clear();a.mark([p[k]],'pick');a.mv('h',p[k]);a.cap('<b>'+l+'</b>')}))}},dmCrush()],
 'Żyleta':()=>[dmMove(),dmLine('Strzał',C['Żyleta'].txt,[N(DH,2,2),N(DH,2,4)],[[0,'−2']],{nolab:true,shot:N(DH,2,2),c1:'Strzał leci prosto aż do krawędzi planszy…',c2:'…i trafia <b>pierwszą</b> postać na drodze: 2 DMG. Ta za nią jest bezpieczna.'}),dmCrush()],
 'Byku':()=>[
  {t:'Skok',d:'Skok o 1 pole albo w miejscu: lądowanie na przeciwniku = 3 DMG. Dalszy skok o 2 pola: 1 DMG.',T:4600,run(a){const to=N(DH,2,2);a.tok('f0','foe',to).tok('h','hero',DH);
   dmAt(300,()=>{a.mark(dmAll().filter(c=>dmDist(c,DH)<=2),'opt');a.cap('Zasięg skoku: do 2 pól w każdą stronę.')});
   dmAt(1500,()=>{a.clear();a.mark([to],'pick');a.cap('Skaczesz na pole przeciwnika…')});
   dmAt(2100,()=>{a.clear();a.mv('h',to,'jump',[-7,3]);a.mv('f0',to,0,[8,-3])});
   dmAt(2650,()=>{a.mark([to],'hit',['1']);a.dmg('f0','−1');a.cap('Dalszy skok (2 pola): <b>1 DMG</b> dla przeciwnika. Skok o 1 pole: <b>3 DMG</b>.')})}},
  {t:'Szarża',tag:'tylko faza II',d:'Szarża na wprost do pierwszej postaci lub ściany: 1 DMG i odrzucenie o 1 pole.',T:5000,run(a){const f=N(DH,2,3);a.tok('f0','foe',f).tok('h','hero',DH);
   dmAt(300,()=>{a.mark(dmNb(DH),'opt');a.cap('Faza II: wybierz kierunek szarży.')});
   dmAt(1300,()=>{a.clear();a.mark(attack(DH,2,1,'Byku').map(c=>[c[0],c[1]]),'hit');a.cap('Byku pędzi prosto przed siebie…')});
   dmAt(2100,()=>{a.clear();a.mv('h',N(DH,2,2),'fast')});
   dmAt(2500,()=>{a.dmg('f0','−1');a.mv('f0',N(DH,2,4));a.mark([N(DH,2,4)],'hit');a.cap('<b>1 DMG</b> i odrzut o 1 pole. Ściana za plecami = brak odrzutu.')})}},dmCrush()],
 'Ciotka':()=>[dmMove(),dmLine('Atak – faza I',C['Ciotka'].txt,[N(DH,2,2)],[[0,'−2']],{c1:'Linia 3 pól przed tobą.',c2:'W fazie I zaklęcie zadaje <b>2 DMG</b> każdemu w linii.'}),
  dmLine('Atak – faza II',(TB()?'Faza II: 2 DMG':'Faza II: 1 DMG')+' i przesunięcie trafionej postaci o 1 pole. Wepchnięcie na kogoś: obaj −1.',[N(DH,2,2)],[[0,TB()?'−2':'−1']],{ph:1,T:5600,tag:'faza II',c1:'Faza II: linia 3 pól, '+(TB()?2:1)+' DMG…',c2:'…a potem przesuwasz trafionego.',after(a){const f=N(DH,2,2),to=N(f,1);
   dmAt(3500,()=>{a.clear();a.mark(dmNb(f),'opt');a.cap('Wybierasz, gdzie go przepchniesz.')});
   dmAt(4300,()=>{a.clear();a.mark([to],'pick');a.mv('f0',to)})}}),dmCrush()],
 'Pasterz':()=>[dmMove(),
  {t:'Przywołaj',d:'Przywołujesz owcę (1 HP) na pole obok. Na planszy może być tylko jedna owca.',T:3800,run(a){a.tok('h','hero',DH);
   dmAt(300,()=>{a.mark(dmNb(DH),'opt');a.cap('Dotknij pola obok siebie.')});
   dmAt(1400,()=>{a.clear();a.mark([N(DH,2)],'pick');a.tok('s','sheep',N(DH,2));a.act('s','dmpop');a.cap('Beee! Owca jest na planszy.')})}},
  {t:'Ruch owcy',d:'Zamiast siebie możesz poruszyć owcę o 1 pole.',T:3800,run(a){const s=N(DH,2);a.tok('h','hero',DH).tok('s','sheep',s);
   dmAt(300,()=>{a.mark(dmNb(s),'opt');a.cap('Pola, na które może pójść owca.')});
   dmAt(1500,()=>{a.clear();a.mark([N(s,1)],'pick');a.mv('s',N(s,1));a.cap('Owca idzie tam, gdzie każesz.')})}},
  {t:'Szarża owcy',d:'Owca biegnie na wprost i uderza pierwszą napotkaną postać za 2 DMG.',T:4400,run(a){const s=N(DH,2),f=N(s,2,2);a.tok('h','hero',DH).tok('s','sheep',s).tok('f0','foe',f);
   dmAt(300,()=>{a.mark(dmNb(s),'opt');a.cap('Wybierz kierunek: pole obok owcy.')});
   dmAt(1400,()=>{a.clear();a.mark([N(s,2),f],'hit');a.cap('Owca szarżuje…')});
   dmAt(2000,()=>{a.mv('s',N(s,2),'fast')});
   dmAt(2400,()=>{a.dmg('f0','−2');a.cap('…i taranuje pierwszego wroga: <b>2 DMG</b>.')})}},
  {t:'Osłona',d:'Owca stoi na linii strzału i przyjmuje go na siebie. Ma tylko 1 HP.',T:4000,run(a){const s=N(DH,2),f=N(DH,2,4);a.tok('h','hero',DH).tok('s','sheep',s).tok('f0','foe',f);
   dmAt(400,()=>{a.mark([N(DH,2,3),N(DH,2,2),s],'hit');a.cap('Wróg strzela w stronę Pasterza…')});
   dmAt(1300,()=>{a.shot(f,s,'#ffe27a')});
   dmAt(1700,()=>{a.dmg('s','−1');a.gone('s');a.cap('…owca przyjmuje strzał i znika. Pasterz cały!')})}}],
 'Truchel':()=>[
  {t:'Teleport',d:'Zamiast ruchu: teleport na dowolne pole planszy.',T:4000,run(a){const to=[2,-2];a.tok('h','hero',DH);
   dmAt(300,()=>{a.mark(dmAll(),'opt');a.cap('Możesz pojawić się na <b>dowolnym</b> polu.')});
   dmAt(1400,()=>{a.clear();a.mark([to],'pick')});
   dmAt(1900,()=>{a.mv('h',to,'tele');a.cap('Puf! Truchel jest po drugiej stronie.')})}},
  {t:'Kałuża',d:'Zamiast ataku: kałuża trucizny na polu obok. Trzyma się 3 rundy i rani każdego, kto w niej stoi na koniec fazy.',T:4800,run(a){const p=N(DH,2);a.tok('h','hero',DH).tok('f0','foe',N(p,1));
   dmAt(300,()=>{a.mark(dmNb(DH),'opt');a.cap('Wybierz pole obok siebie.')});
   dmAt(1300,()=>{a.clear();a.tok('pd','puddle',p);a.act('pd','dmpop');a.cap('Kałuża trucizny zostaje na 3 rundy.')});
   dmAt(2300,()=>{a.mv('f0',p,0,[0,-2])});
   dmAt(3000,()=>{a.dmg('f0',TB()?'−2':'−1');a.cap('Wróg wszedł w kałużę: obrażenia na koniec fazy.')})}},dmCrush()],
 'Sierżant Przemo':()=>[dmMove(),dmLine('Pistolet','Pistolet strzela na wprost i trafia pierwszą postać: 1 DMG.',[N(DH,2,2),N(DH,2,3)],[[0,'−1']],{nolab:true,shot:N(DH,2,2),col:'#ffb070',c1:'Strzał leci prosto…',c2:'…i trafia <b>pierwszą</b> postać: 1 DMG.'}),
  {t:'Dron',d:'Dron to 3 akcje: dwie aktywacje (można na raty, w różnych fazach i rundach), a trzecia wysyła go nad wybrane pole – atakuje najbliższą postać za 2 DMG.',T:5400,run(a){const to=[1,-2],f1=[1,-3],f2=[-3,2];a.tok('h','hero',DH).tok('f0','foe',f1).tok('f1','foe',f2);
   dmAt(300,()=>{a.tok('dr','drone',DH);a.act('dr','dmpop');a.cap('<b>Akcje 1 i 2:</b> składasz drona – możesz to zrobić na raty.')});
   dmAt(1700,()=>{a.mark([to],'pick');a.cap('<b>Akcja 3:</b> wybierasz pole, nad które leci dron.')});
   dmAt(2400,()=>{a.clear();a.mv('dr',to)});
   dmAt(3100,()=>{a.mark([f1],'hit');a.shot(to,f1,'#ff6b5b');a.dmg('f0','−2');a.cap('Dron atakuje <b>najbliższą</b> postać: 2 DMG.')})}},dmCrush()]};
function demoH(){const ch=DM.ch,list=DEMOS[ch](),d=list[DM.i],r=(ROLE[ch]||[''])[0];
 let hx='';cells.forEach(c=>{const [x,y]=dmXY(c);hx+='<polygon class="dmhx" data-dk="'+c[0]+','+c[1]+'" points="'+dmHexPts()+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')"/>'});
 return '<div class="dmbox" style="--c:'+C[ch].col+'"><div class="dmhead"><img src="'+IMG[ch]+'" alt=""><div><small>'+r+'</small><b>'+ch.toUpperCase()+'</b></div><button class="dmx" data-dm="x" aria-label="Zamknij">✕</button></div>'
  +'<div class="dmchips">'+list.map((x,k)=>'<button class="'+(k===DM.i?'on':'')+'" data-dm="'+k+'">'+x.t+'</button>').join('')+'</div>'
  +'<div class="dmstage"><svg viewBox="-122 -132 244 264" aria-label="Przykład akcji"><defs><clipPath id="dmclip"><circle r="15.5"/></clipPath></defs><g class="dmlh">'+hx+'</g><g class="dmlp"></g><g class="dmll"></g><g class="dmlt"></g><g class="dmlf"></g></svg>'+(d.tag?'<span class="dmtag">'+d.tag+'</span>':'')+'</div>'
  +'<div class="dmcap"></div><p class="dmdesc">'+d.d+'</p>'
  +'<div class="dmnav"><button data-dm="prev" '+(DM.i?'':'disabled')+'>◀</button><span>'+(DM.i+1)+' / '+list.length+'</span><button data-dm="next" '+(DM.i<list.length-1?'':'disabled')+'>▶</button></div></div>'}
function demoPlay(){dmStop();const ov=document.getElementById('demoOv');if(!ov)return;ov.innerHTML=demoH();const d=DEMOS[DM.ch]()[DM.i],svg=ov.querySelector('svg');
 const loop=()=>{svg.querySelector('.dmlp').innerHTML='';svg.querySelector('.dmlt').innerHTML='';svg.querySelector('.dmlf').innerHTML='';const a=dmApi(svg);a.clear();d.run(a);dmAt(d.T,loop)};loop()}
function openDemo(ch){DM.ch=ch;DM.i=0;let ov=document.getElementById('demoOv');if(!ov){ov=document.createElement('div');ov.id='demoOv';document.body.appendChild(ov)}demoPlay()}
function closeDemo(){dmStop();const ov=document.getElementById('demoOv');if(ov)ov.remove()}
