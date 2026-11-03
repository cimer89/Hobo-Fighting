/* ===================== TRYBY GRY + TRYB SPECJALNY (przedmioty na mapie) ===================== */
const ITEM={1:{n:'+1 HP',c:'#e0342b'},2:{n:'+1 DMG',c:'#f08a24'},3:{n:'Dodatkowy ruch',c:'#3fa7d6'},4:{n:'Tarcza',c:'#8c96a1'},6:{n:'Refleks',c:'#8a4fc7'}};
const ITYPES=[1,2,3,4,6];
let ICACHE={};
function isSp(){return st.gm==='special'}
function seedStr(){return H?(st.seed||'h'):(net.code||'x')}
function rng(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return function(){h+=0x6D2B79F5;let t=h;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function spawnCount(r){return r===1?6:r===3?5:r===6?4:r===9?3:0}
function withRound(r,fn){const o=st.round,had=st._real!==undefined;if(!had)st._real=o;st.round=r;try{return fn()}finally{st.round=o;if(!had)delete st._real}}
function realRound(){return st._real!==undefined?st._real:st.round}
function finalAt(r){return withRound(r,()=>{const its=curItems().filter(o=>o.q.plans&&o.q.plans[r]&&o.q.posr&&o.q.posr[r]);return its.length?resolve(its):null})}
function resolveFin(items){return(st._fin&&st._finRound===st.round&&st._finMode===(H?'h':'n'))?st._fin:resolve(items)}
function bonusSpent(q,x,r){const b=q.bon;if(!b)return false;if(!(q.bonR===undefined||q.bonR<r))return false;if(b.k===4)return !!x.shUsed;if(b.k===2)return !!x.dmgbUsed;return false}
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
function lastActor(){return !!H&&H.p.findIndex((q,i)=>i>H.cur&&alive(q,st.round))<0}

/* --- menu --- */
document.addEventListener('click',function(e){
 ICACHE={};
 const t=e.target.closest('[data-mode],[data-a="modeback"],[data-a="create"],[data-a="joinb"],[data-n],[data-leg]');if(!t)return;
 const d=t.dataset;
 if(d.mode){st.gm=d.mode;e.stopImmediatePropagation();render();return}
 if(d.a==='modeback'){st.gm=null;e.stopImmediatePropagation();render();return}
 if(d.a==='create'&&net.db){const L='ACDEFGHIJKLMNOPQRUVWXYZ',R=()=>'ABCDEFGHJKLMNPQRTUVWXYZ23456789'[Math.floor(Math.random()*31)];const code=(st.gm==='special'?'S':st.gm==='test'?'T':L[Math.floor(Math.random()*L.length)])+R()+R()+R();e.stopImmediatePropagation();join(code);return}
 if(d.a==='joinb'&&net.db){const el=document.getElementById('code'),v=((el&&el.value)||'').trim().toUpperCase();e.stopImmediatePropagation();if(v.length===4){st.gm=v[0]==='S'?'special':v[0]==='T'?'test':'classic';join(v)}return}
 if(d.n){st.seed=Math.random().toString(36).slice(2,8);return}
 if(d.leg!==undefined){st.legend=!st.legend;e.stopImmediatePropagation();render()}},true);
const _r5=render;render=function(){ICACHE={};_r5()};

/* --- chipy + legenda --- */

document.addEventListener('click',function(e){
 if(!isSp())return;
 const t=e.target.closest('[data-a="next"],[data-a="hnextr"]');if(!t)return;
 const r=st.round,items=curItems(),fin=(st._fin&&st._finRound===r)?st._fin:null;if(!fin)return;
 (fin._pick||[]).forEach(pk=>{if(!mine(pk.id))return;const o=items.find(x=>x.id===pk.id);if(!o)return;const q=o.q;q.got=q.got||{};q.got[r]={k:pk.k,t:pk.t};if(pk.t!==1){q.bon={k:pk.t};q.bonR=r}});
 if(!H)save();},true);
render();
