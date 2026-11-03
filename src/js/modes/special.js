/* ===================== Tryb specjalny: przedmioty ===================== */
/* --- z części: TRYBY GRY + TRYB SPECJALNY (przedmioty na mapie) --- */
const ITEM={1:{n:'+1 HP',c:'#e0342b'},2:{n:'+1 DMG',c:'#f08a24'},3:{n:'Dodatkowy ruch',c:'#3fa7d6'},4:{n:'Tarcza',c:'#8c96a1'},6:{n:'Refleks',c:'#8a4fc7'}};
const ITYPES=[1,2,3,4,6];
function isSp(){return st.gm==='special'}
function pickups(its,out,r){
 const present=itemsAfter(r-1),res=[];
 const al=its.filter(o=>out[o.id]&&out[o.id].eff>0);
 al.forEach(o=>{const x=out[o.id],k=K(...x.pos),it=present.find(i=>i.k===k);if(!it)return;
  if(al.some(p=>p!==o&&K(...out[p.id].pos)===k))return;
  const q=o.q;
  if(it.t===1){if(x.eff>=5)return}else if(q.bon&&!bonusSpent(q,x,r))return;
  res.push({id:o.id,t:it.t,k})});
 return res}
function itemsAfter(r){
 if(r<=0)return [];
 const key=r+'|'+(H?'h':'n');if(ICACHE[key])return ICACHE[key];
 const rr=realRound();
 let present=itemsAfter(r-1).slice(),fin=null,picked=[];
 const sc=spawnCount(r);
 if(r===rr||sc)fin=finalAt(r);
 if(r<rr){curItems().forEach(o=>{const g=o.q.got&&o.q.got[r];if(g)picked.push(g.k)})}
 else if(r===rr&&fin)picked=(fin._pick||[]).map(p=>p.k);
 present=present.filter(it=>!picked.includes(it.k));
 const zr=zoneR(r+1),inZ=k=>{const [q,w]=k.split(',').map(Number);return dist(q,w)<=zr};present=present.filter(it=>inZ(it.k));
 if(sc&&fin){
  const occ=new Set();Object.keys(fin).forEach(id=>{if(id[0]!=='_'&&fin[id].eff>0)occ.add(K(...fin[id].pos))});
  present.forEach(it=>occ.add(it.k));
  const rnd=rng(seedStr()+':'+r);
  const cand=cells.map(([q,rw])=>K(q,rw)).filter(k=>!occ.has(k)&&inZ(k));
  for(let i=cand.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[cand[i],cand[j]]=[cand[j],cand[i]]}
  cand.slice(0,sc).forEach(k=>present.push({k,t:ITYPES[Math.floor(rnd()*5)],sr:r}))}
 ICACHE[key]=present;return present}
function boardItems(){
 if(!isSp())return [];
 const r=st.round,rev=(st.scr==='rev'||st.scr==='hrev');
 try{return itemsAfter(rev&&!st.animating?r:r-1)}catch(e){return []}}
function iid(k){return 'it'+k.replace(/-/g,'m').replace(',','_')}
function glyph(t){return {1:'<path d="M0,11 C-15,0 -14,-13 -6,-13 C-2,-13 0,-9 0,-9 C0,-9 2,-13 6,-13 C14,-13 15,0 0,11Z" fill="#fff"/>',2:'<text x="0" y="8" text-anchor="middle" font-size="24" font-weight="900" fill="#fff" style="font-family:system-ui,sans-serif">+1</text>',3:'<path d="M-11,-9 L0,0 L-11,9 M0,-9 L11,0 L0,9" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',4:'<path d="M0,-14 L12,-9 L12,2 C12,9 5,13 0,16 C-5,13 -12,9 -12,2 L-12,-9Z" fill="#fff"/>',6:'<path d="M4,-15 L-9,3 L-1,3 L-5,15 L10,-4 L1,-4Z" fill="#fff"/>'}[t]||''}
function itemSvg(it){
 const g=GEO[it.k];if(!g)return '';const [x,y]=g.c,s=depthScale(y)*.85,col=ITEM[it.t].c;
 const nw=(it.sr&&it.sr===st.round&&!st.animating&&(st.scr==='rev'||st.scr==='hrev'));
 return '<g id="'+iid(it.k)+'" transform="translate('+x+','+(y+4)+') scale('+s.toFixed(3)+')" style="pointer-events:none"><ellipse cx="3" cy="19" rx="25" ry="8" fill="#000" opacity=".4" filter="url(#bl)"/><g class="ico'+(nw?' newi':'')+'"><g class="ibob"><circle r="26" cy="3" fill="'+shade(col,-.45)+'"/><circle r="26" fill="'+col+'" stroke="#fff" stroke-width="3"/>'+glyph(it.t)+'</g></g></g>'}
/* --- z części: PASTERZ: nowy balans (z Testów) także w trybie specjalnym --- */
function PNB(){return TB()||isSp()}
/* start z owcą obok i 7 HP (jak tbInit, tylko dla Pasterza) */
function spInit(){if(!isSp())return;
 const all=H?H.p:Object.values(net.pl||{});const mine=H?H.p:(net.db?[ME]:[]);
 const placed=all.length&&all.every(p=>p.ch&&p.posr&&p.posr[1]);if(!placed)return;
 mine.forEach(p=>{if(p.ch!=='Pasterz'||p._sp)return;p._sp=1;p.hpr=p.hpr||{};p.hpr[1]=MAXHP(p.ch);p.hp=MAXHP(p.ch);
  const tk=new Set(all.filter(o=>o.ch&&o.posr&&o.posr[1]&&o.posr[1]!==p.posr[1]).map(o=>K(...o.posr[1])));
  const nb=nbCells(p.posr[1]).filter(c=>!tk.has(K(...c))).sort((a,b)=>dist(...a)-dist(...b));if(nb.length){p.sheepr=p.sheepr||{};p.sheepr[1]=nb[0].slice()}
  if(!H&&net.db)save()})}
