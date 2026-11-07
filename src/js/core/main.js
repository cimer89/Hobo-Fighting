/* ===================== Start: obsługa kliknięć planowania, pierwszy render, połączenie ===================== */
addClick('core/main',document,e=>{
 const t=e.target.closest('[data-ch],[data-t],[data-a],[data-k],[data-hp],[data-n]');if(!t)return;
 const ds=t.dataset,pl=st.plan[st.ph];
 if(st.animating&&ds.a!=='skip')return;
 if(ds.k&&(st.scr==='rev'||st.scr==='hrev')){pushPick(ds.k);render();return}
 if(ds.a==='start'){st.scr='lobby'}
 else if(ds.ch){st.ch=ds.ch;st.start=null}
 else if(ds.t){pl.t=ds.t;pl.m=null;pl.d=null}
 else if(ds.n){H={n:+ds.n,cur:0,tgt:'pick',p:Array.from({length:+ds.n},()=>({ch:null,start:null,plans:{},posr:{},hp:5,hpr:{1:5},hpo:{}}))};st.round=1;st.scr='hpass'}
 else if(ds.a==='hot'){net.db=null;H=null;st.scr='hsetup'}
 else if(ds.a==='hgo'){if(H.tgt==='pick'){st.scr='pick';st.start=null;st.ch=Object.keys(C).find(n=>!taken(n))}else{const p=H.p[H.cur];st.scr='plan';st.ch=p.ch;st.start=p.posr[st.round];st.plan=newPlan();st.ph=0;st.done=false}}
 else if(ds.a==='hplan'){H.cur=0;H.tgt='plan';st.scr='hpass'}
 else if(ds.a==='hnext'){const p=H.p[H.cur];p.plans[st.round]=JSON.parse(JSON.stringify(st.plan));const nx=H.p.findIndex((q,i)=>i>H.cur&&alive(q,st.round));if(nx>=0){H.cur=nx;H.tgt='plan';st.scr='hpass'}else st.scr='hrev'}
 else if(ds.a==='hnextr'){{const Q=resolveFin(H.p.map((q,i)=>({id:'p'+i,q,idx:i})));H.p.forEach((p,i)=>{const x=Q['p'+i];p.posr[st.round+1]=x?x.pos:p.posr[st.round];p.hpr[st.round+1]=x?x.eff:0})}st.round++;H.cur=H.p.findIndex(p=>alive(p,st.round));H.tgt='plan';st.scr='hpass'}
 else if(ds.a==='confirm'&&H){const p=H.p[H.cur];p.ch=st.ch;p.start=st.start;p.posr[1]=st.start;if(H.cur<H.n-1){H.cur++;H.tgt='pick';st.scr='hpass'}else st.scr='hstarts'}
 else if(ds.a==='confirm'&&net.db){ME.ch=st.ch;ME.start=st.start;ME.sready=true;ME.posr[1]=st.start;save();st.scr='wait'}
 else if(ds.a==='confirm'){st.scr='plan';st.plan=newPlan();st.ph=0;st.done=false}
 else if(ds.a==='back'){st.scr='pick'}
 else if(ds.a==='ok'){if(st.leaving)return;st.leaving=true;const pe=document.getElementById('phpanel');if(pe)pe.classList.add('pout');setTimeout(()=>{st.leaving=false;if(st.ph<nPh(st.ch)-1)st.ph++;else{st.done=true;if(net.db){ME.plans[st.round]=JSON.parse(JSON.stringify(st.plan));save();chk()}}render()},pe?380:0);return}
 else if(ds.a==='prev'){st.ph=Math.max(0,st.ph-1)}
 else if(ds.a==='create'){join(Math.random().toString(36).slice(2,6))}
 else if(ds.a==='joinb'){const v=(document.getElementById('code').value||'').trim();if(v.length===4)join(v)}
 else if(ds.a==='solo'){net.db=null;st.scr='pick'}
 else if(ds.a==='goplan'){st.scr='plan';st.start=ME.start;st.plan=newPlan();st.ph=0;st.done=false}
 else if(ds.a==='next'){{const x=resolveFin(netItems())[net.uid];if(x){ME.posr[st.round+1]=x.pos;ME.hpr[st.round+1]=x.eff}}st.round++;st.start=ME.posr[st.round];st.plan=newPlan();st.ph=0;st.done=false;st.scr='plan';save()}
 else if(ds.hp!==undefined){const q=H?H.p[+ds.pi]:ME;q.hpo=q.hpo||{};q.hpo[st.round]=+ds.eff===+ds.hp?+ds.hp-1:+ds.hp;if(!H)save()}
 else if(ds.a==='edit'){if(net.db&&!H&&typeof allCommitted==='function'&&allCommitted(st.round))return;st.done=false;st.ph=0;if(net.db){delete ME.plans[st.round];save()}}
 else if(ds.k){
  const [q,r]=ds.k.split(',').map(Number);
  if(st.scr==='pick')st.start=[q,r];
  else if(!st.done){
   const from=fromPos(st.ph),i=D.findIndex(([a,b])=>from[0]+a===q&&from[1]+b===r);
   planTap(pl,q,r,from,i);
  }
 }
 render();
});
render();
window.addEventListener('resize',()=>render());
//@@if github
initNet();
//@@else
if(window.claude)initNet();
//@@end
