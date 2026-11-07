let ICACHE={};

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
addRender('modes/special_init',_r5=>function(){ICACHE={};_r5()});

/* --- chipy + legenda --- */

document.addEventListener('click',function(e){
 if(!isSp())return;
 const t=e.target.closest('[data-a="next"],[data-a="hnextr"]');if(!t)return;
 const r=st.round,items=curItems(),fin=(st._fin&&st._finRound===r)?st._fin:null;if(!fin)return;
 (fin._pick||[]).forEach(pk=>{if(!mine(pk.id))return;const o=items.find(x=>x.id===pk.id);if(!o)return;const q=o.q;q.got=q.got||{};q.got[r]={k:pk.k,t:pk.t};if(pk.t!==1){q.bon={k:pk.t};q.bonR=r}});
 if(!H)save();},true);
render();
