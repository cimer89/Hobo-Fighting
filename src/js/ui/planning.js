/* ===================== Interfejs: planowanie ruchów ===================== */
/* --- z części: js/000-start.js --- */
function fromPos(ph){let p=st.start;for(let i=0;i<ph;i++){const x=st.plan[i];if(x.t==='move'&&x.m)p=x.m}return p}
function setSlot(i){st.slot=i;st.ph=i>>1;st.mode=i%2?'atk':'move'}
function next(){let i=st.slot+1;if(st.ch==='Byku'&&i%2)i++;if(i<=3)setSlot(i)}
function pushPick(k){
 const items=H?H.p.map((q,i)=>({id:'p'+i,q,idx:i})):netItems();
 const pend=resolve(items)._pend||[];
 if(!pend.length)return;
 const p=pend[0];
 if(!H&&p.by!==net.uid)return;
 const [q,r]=k.split(',').map(Number);
 if(!IN(q,r)||!D.some(([a,b])=>p.pos[0]+a===q&&p.pos[1]+b===r))return;
 const o=items.find(o=>o.id===p.by);
 o.q.push=o.q.push||{};o.q.push[st.round]=[q,r];
 if(!H)save();
}
/* --- z części: BONUSY POSTACI --- */
function pickCell(k){
 const [q,r]=k.split(',').map(Number);const pk=st.pick;st.pick=null;if(!pk)return;
 const p=playerOf(pk.id);const pf=pickFrom(pk);
 if(!p||!mine(pk.id)||!pf||!IN(q,r)||!D.some(([a,b])=>pf[0]+a===q&&pf[1]+b===r))return;
 if(pk.kind==='dg'){p.dg=p.dg||{};p.dg[st.round]=[q,r];p.bon=null}
 else{p.xm=p.xm||{};p.xm[st.round]=[q,r];p.bon=null}
 saveP(p)}
/* --- z części: POSTACIE v3: Długi (3 fazy), Byku (Skok i Szarża) --- */
function stepperHtml(cur,tot){const N=['I','II','III'],ci=N.indexOf(cur),n=N.indexOf(tot)+1;let h='<div class="stepper"><b>FAZA</b>';for(let i=0;i<n;i++)h+='<i class="'+(i===ci?'on':(i<ci?'done':''))+'">'+N[i]+'</i>';return h+'</div>'}
/* --- z części: NOWE POSTACIE (Pasterz, Truchel, Sierżant Przemo) + PUNKTACJA --- */
function actBtns(pl,ph){const defs=actDefs(st.ch,ph),w=defs.length>3?'44':defs.length===3?'30':'46';return '<div class="row acts" style="--n:'+defs.length+'">'+defs.map(d=>'<button class="'+(pl.t===d.t?'on':'')+'" data-t="'+d.t+'" '+(d.dis?'disabled':'')+'>'+d.l+'</button>').join('')+'</div>'}
function planOk(pl,ph){const t=pl.t;if(t==='move'||t==='smove'||t==='summon')return !!pl.m;if(t==='atk')return pl.d!==null;if(t==='drone')return ph===0?true:!!pl.m;return false}
function planHint(pl,ph){const ch=st.ch;
 if(ch==='Pasterz'){if(!pl.t)return sheepAtPhase(ph)?'Owca jest już na mapie: rusz siebie, rusz owcę albo szarżuj nią.':'Wybierz akcję: ruch albo przywołanie owcy.';
  if(pl.t==='move')return 'Ruch Pasterza o 1 pole lub zostań.';
  if(pl.t==='smove')return 'Ruch owcy o 1 pole (dotknij pola obok owcy).';
  if(pl.t==='summon')return 'Dotknij sąsiedniego pola, by przywołać owcę.';
  if(pl.t==='atk')return pl.d===null?'Dotknij pola obok owcy, by wybrać kierunek szarży.':'Szarża owcy: '+DN[pl.d]+(TB()?' (2 DMG każdej postaci w linii).':' (2 DMG pierwszej napotkanej postaci).')}
 if(ch==='Truchel'){if(pl.t==='move')return 'Teleport: dotknij dowolnego pola (także zajętego).';
  if(pl.t==='atk')return pl.d===null?'Dotknij sąsiedniego pola, na którym powstanie kałuża.':'Kałuża: '+DN[pl.d]+' (trucizna przez 3 rundy).'}
 if(ch==='Sierżant Przemo'){if(pl.t==='atk')return pl.d===null?'Pistolet: dotknij sąsiedniego pola, by wybrać kierunek (1 DMG).':'Pistolet: '+DN[pl.d]+' (1 DMG, trafia pierwszą postać).';
  if(pl.t==='drone')return ph===0?'Aktywujesz drona (to cała akcja fazy I).':'Dotknij pola, nad które lecisz dronem. Dron zaatakuje najbliższą postać.'}
 return ''}
function planTap(pl,q,r,from,i){const ch=st.ch,ph=st.ph;
 if(pl.t==='move'){if(ch==='Truchel'){pl.m=[q,r];return}if(i>=0||(q===from[0]&&r===from[1])||(ch==='Byku'&&dist(q-from[0],r-from[1])<=(TB()&&ph>0?1:2)))pl.m=[q,r];return}
 if(pl.t==='atk'){if(ch==='Pasterz'){const s=sheepAtPhase(ph);if(!s)return;const j=D.findIndex(([a,b])=>s[0]+a===q&&s[1]+b===r);if(j>=0)pl.d=j;return}if(i>=0)pl.d=i;return}
 if(pl.t==='smove'){const s=sheepAtPhase(ph);if(s&&dist(q-s[0],r-s[1])<=1)pl.m=[q,r];return}
 if(pl.t==='summon'){if(i>=0)pl.m=[q,r];return}
 if(pl.t==='drone'&&ph>=1)pl.m=[q,r]}
function extraHL(hl,pl,from,ph){
 const ch=st.ch,OK={fill:'color-mix(in srgb,var(--ok) 35%,transparent)',stroke:'var(--ok)'},PUR='color-mix(in srgb,#b36cff 26%,transparent)',SEL='color-mix(in srgb,#b36cff 55%,transparent)';
 if(ch==='Truchel'&&pl.t==='move'){cells.forEach(([q,r])=>{hl[K(q,r)]={fill:PUR}});if(pl.m)hl[K(...pl.m)]={fill:SEL,stroke:'var(--ink)',t:'→'};return}
 if(ch==='Sierżant Przemo'&&pl.t==='drone'&&ph>=1){cells.forEach(([q,r])=>{hl[K(q,r)]={fill:PUR}});if(pl.m)hl[K(...pl.m)]={fill:SEL,stroke:'var(--ink)',t:'✈'};return}
 if(ch==='Pasterz'){const s=sheepAtPhase(ph);
  if(pl.t==='summon'){nbCells(from).forEach(c=>{hl[K(...c)]=Object.assign({},OK)});if(pl.m)hl[K(...pl.m)]={fill:'color-mix(in srgb,var(--ok) 55%,transparent)',stroke:'var(--ink)',t:'O'}}
  else if(pl.t==='smove'&&s){nbCells(s).concat([s]).forEach(c=>{hl[K(...c)]=Object.assign({},OK)});if(pl.m)hl[K(...pl.m)]={fill:'color-mix(in srgb,var(--ok) 55%,transparent)',stroke:'var(--ink)',t:'O'}}
  else if(pl.t==='atk'&&s){if(pl.d===null)nbCells(s).forEach(c=>{hl[K(...c)]={stroke:'var(--hit)'}});else{const dd=D[pl.d];let cur=s.slice();for(;;){const nq=cur[0]+dd[0],nr=cur[1]+dd[1];if(!IN(nq,nr))break;cur=[nq,nr];hl[K(nq,nr)]={fill:'color-mix(in srgb,var(--hit) 40%,transparent)',stroke:'var(--hit)',t:'»'}}}}}}
/* --- z części: wybór postaci bez przeskakiwania na mapę (jeden telefon) --- */
function firstFree(){return Object.keys(C).find(n=>!taken(n))||Object.keys(C)[0]}
