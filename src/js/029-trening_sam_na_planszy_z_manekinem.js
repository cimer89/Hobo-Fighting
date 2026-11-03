/* ===================== TRENING: sam na planszy z manekinem ===================== */
(function(){
 const DUMMY='Manekin',DHP=10,PSTART=[0,1],DSTART=[0,-1];
 const css=`.trbar{position:fixed;left:8px;top:calc(max(8px,env(safe-area-inset-top)) + 54px);z-index:60;display:flex;gap:6px;align-items:center;background:linear-gradient(#5a3a1f,#3b2412);border:2px solid #1a0f06;border-radius:14px;padding:4px 6px 4px 10px;box-shadow:0 4px 0 #1a0f06;color:#ffd84a;font:400 16px Bangers,Impact,sans-serif;letter-spacing:1px}
.trbar button{min-height:30px;padding:3px 10px;font:700 12px system-ui;border-radius:10px;letter-spacing:0}
#trSel{position:fixed;inset:0;z-index:70;background:rgba(8,12,20,.8);display:flex;align-items:center;justify-content:center;padding:16px}
#trSel .box{width:min(440px,100%);background:linear-gradient(#5a3a1f,#3b2412);border:3px solid #1a0f06;border-radius:18px;padding:14px;color:#fff;box-shadow:0 8px 0 #1a0f06}
#trSel h2{margin:0 0 4px;text-align:center;font:400 32px Bangers,Impact,sans-serif;color:#ffd84a;-webkit-text-stroke:1.5px #1a0f06;letter-spacing:2px}
#trSel p{margin:0 0 10px;text-align:center;font:600 13px system-ui;opacity:.85}
#trSel .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
#trSel .grid button{padding:4px;border-radius:12px;display:flex;flex-direction:column;align-items:center;gap:2px;font:700 11px system-ui;min-height:0}
#trSel .grid img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:50%;border:3px solid var(--c)}
#trSel .x{margin-top:10px;width:100%}`;
 const s0=document.createElement('style');s0.textContent=css;document.head.appendChild(s0);
 const T=()=>typeof H!=='undefined'&&H&&H.train;
 /* manekin istnieje w C tylko w trakcie treningu, żeby nie pojawiał się w wyborze postaci */
 function addDummy(){INI['µ']=DUMMY;INI['M']=DUMMY;C[DUMMY]={col:'#c9a36b',txt:'Manekin treningowy: nie atakuje, co rundę odnawia HP do '+DHP+', można go przesuwać i odrzucać.'};if(typeof MANEKIN_IMG!=='undefined')IMG[DUMMY]=MANEKIN_IMG}
 function delDummy(){if(C[DUMMY]&&!T()){delete C[DUMMY];delete INI['µ'];delete INI['M']}}
 const _mx=MAXHP;MAXHP=function(ch){return ch===DUMMY?DHP:_mx(ch)};
 /* manekin widoczny na planszy także podczas planowania */
 const _bd=board;board=function(hl){try{if(T()&&st.scr==='plan'&&hl){const q=H.p[1].posr[st.round];if(q){const k=K(...q),e=hl[k]||{};hl[k]=Object.assign({},e,{t:(e.t||'')+'µ'})}}}catch(e){}return _bd.apply(this,arguments)};
 const _zr=zoneR;zoneR=function(r){return T()?3:_zr(r)};
 /* w treningu nie ma końca gry */
 function stay(p,r){const pos=p.posr[r];return Array.from({length:3},()=>({t:'move',m:pos.slice(),d:null}))}
 function goPlan(){const p=H.p[0];H.cur=0;H.tgt='plan';st.scr='plan';st.ch=p.ch;st.start=p.posr[st.round];st.plan=newPlan();st.ph=0;st.done=false}
 function start(ch){addDummy();net.db=null;st.tm2='ffa';st.round=1;st.chOk=true;
  const hp=MAXHP(ch);
  H={n:2,cur:0,tgt:'plan',train:true,p:[{ch,start:PSTART.slice(),plans:{},posr:{1:PSTART.slice()},hp,hpr:{1:hp},hpo:{}},
   {ch:DUMMY,dummy:true,start:DSTART.slice(),plans:{},posr:{1:DSTART.slice()},hp:DHP,hpr:{1:DHP},hpo:{}}]};
  goPlan();const el=document.getElementById('trSel');if(el)el.remove();render()}
 function pick(){const el=document.createElement('div');el.id='trSel';
  el.innerHTML='<div class="box"><h2>TRENING</h2><p>Wybierz postać. Na planszy czeka manekin: nie oddaje, co rundę odnawia HP, można go przesuwać.</p><div class="grid">'
   +Object.keys(C).filter(n=>n!==DUMMY).map(n=>'<button data-trch="'+n+'" style="--c:'+C[n].col+'"><img src="'+IMG[n]+'" alt="">'+(n==='Sierżant Przemo'?'Przemo':n)+'</button>').join('')
   +'</div><button class="x" data-trx="1">← Wróć</button></div>';
  document.body.appendChild(el)}
 window.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-train],[data-trch],[data-trx],[data-trreset],[data-trend]');
  if(t){e.preventDefault();e.stopImmediatePropagation();try{SND.play('click')}catch(_){}
   if(t.dataset.train){pick();return}
   if(t.dataset.trch){start(t.dataset.trch);return}
   if(t.dataset.trx){const el=document.getElementById('trSel');if(el)el.remove();return}
   if(t.dataset.trreset&&T()){const d=H.p[1];d.posr[st.round]=d.start.slice();if(st.scr==='hrev')return;render();return}
   if(t.dataset.trend){H=null;delDummy();const b=document.querySelector('.trbar');if(b)b.remove();try{goMenu()}catch(_){st.scr='splash';render()}return}
   return}
  if(!T())return;const a=e.target.closest&&e.target.closest('[data-a="hnext"],[data-a="hnextr"]');if(!a||st.animating)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(a.dataset.a==='hnext'){const p=H.p[0],d=H.p[1];p.plans[st.round]=JSON.parse(JSON.stringify(st.plan));d.plans[st.round]=stay(d,st.round);st.scr='hrev';render();return}
  const Q=resolveFin(H.p.map((q,i)=>({id:'p'+i,q,idx:i})));
  H.p.forEach((p,i)=>{const x=Q['p'+i];p.posr[st.round+1]=x?x.pos:p.posr[st.round];p.hpr[st.round+1]=p.dummy?DHP:(x&&x.eff>0?x.eff:MAXHP(p.ch))});
  st.round++;goPlan();render()},true);
 const _r=render;render=function(){_r.apply(this,arguments);try{
  if(!T())delDummy();
  /* przycisk "Trening" po wybraniu trybu */
  if(st.scr==='lobby'&&st.gm&&!st.tm2&&!document.querySelector('[data-train]')){const all=[...app.querySelectorAll('[data-tm],[data-mbopen]')];const last=all.pop();
   if(last)last.insertAdjacentHTML('afterend','<button class="mbtn" data-train="1"><b>Trening</b><small>Sam na planszy z manekinem: sprawdź postacie i ataki bez presji. Manekin co rundę odnawia HP.</small></button>')}
  let bar=document.querySelector('.trbar');
  if(T()&&['plan','hrev'].includes(st.scr)){if(!bar){bar=document.createElement('div');bar.className='trbar';document.body.appendChild(bar)}
   bar.innerHTML='TRENING · R'+st.round+(st.scr==='plan'?'<button data-trreset="1">↺ Manekin na start</button>':'')+'<button data-trend="1">Zakończ</button>'}
  else if(bar)bar.remove();
 }catch(e){console.warn('trening',e)}};
 render();
})();

