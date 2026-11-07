/* ===================== PROFILE GRACZY, RANKING I STATYSTYKI (Firebase: Firestore + logowanie anonimowe) ===================== */
/* Wklej tu konfigurację z konsoli Firebase (Ustawienia projektu → Twoje aplikacje → Konfiguracja). */
const PROF_FB=window.__PROF_FB_TEST||((typeof FIREBASE_CONFIG!=='undefined'&&FIREBASE_CONFIG.apiKey!=='WPISZ_TUTAJ')?FIREBASE_CONFIG:null)||{apiKey:'',authDomain:'',projectId:'',storageBucket:'',messagingSenderId:'',appId:''};
const PROF=(function(){
 let db=null,auth=null,uid=null,me=null,state='off',err='';
 const LSN='hf_nick';
 const configured=()=>!!(PROF_FB.apiKey&&PROF_FB.projectId&&window.firebase);
 function ui(){try{render()}catch(e){}const m=document.getElementById('prM');if(m&&m._redraw)m._redraw()}
 async function init(){if(state!=='off')return;if(!configured()){state='nocfg';return}state='init';
  try{const app=(firebase.apps||[]).find(a=>a.name==='prof')||firebase.initializeApp(PROF_FB,'prof');auth=app.auth();db=app.firestore();
   let u=await new Promise(r=>{const un=auth.onAuthStateChanged(x=>{un();r(x)})});if(!u)u=(await auth.signInAnonymously()).user;uid=u.uid;
   const d=await db.collection('players').doc(uid).get();me=d.exists?d.data():null;if(me&&me.nick)try{localStorage.setItem(LSN,me.nick)}catch(e){}
   state='ready'}catch(e){state='err';err=e.message||String(e);console.warn('PROF',e)}ui()}
 const nick=()=>me&&me.nick||null;
 function check(n){n=(n||'').trim();if(n.length<3||n.length>16)return 'Nick musi mieć od 3 do 16 znaków.';if(!/^[\p{L}\d _.\-]+$/u.test(n))return 'Dozwolone: litery, cyfry, spacja, kropka, myślnik i podkreślnik.';return null}
 async function setNick(n){n=n.trim();const e=check(n);if(e)throw new Error(e);const lo=n.toLowerCase();
  const pref=db.collection('players').doc(uid),nref=db.collection('nicks').doc(lo);
  await db.runTransaction(async t=>{const nd=await t.get(nref);if(nd.exists&&nd.data().uid!==uid)throw new Error('Ten nick jest już zajęty.');
   const pd=await t.get(pref),old=pd.exists?pd.data():null;
   if(old&&old.nickLower&&old.nickLower!==lo)t.delete(db.collection('nicks').doc(old.nickLower));
   t.set(nref,{uid});
   if(old)t.update(pref,{nick:n,nickLower:lo});
   else t.set(pref,{nick:n,nickLower:lo,created:firebase.firestore.FieldValue.serverTimestamp(),games:0,wins:0,kos:0,dmg:0,pts:0,chars:{}})});
  const d=await pref.get();me=d.data();try{localStorage.setItem(LSN,me.nick)}catch(e){}ui()}
 async function record(r){if(state!=='ready'||!me)return;const inc=firebase.firestore.FieldValue.increment,ch=r.ch||'?';
  const u={games:inc(1),wins:inc(r.win?1:0),kos:inc(r.kos||0),dmg:inc(r.dmg||0),pts:inc(r.pts||0),last:firebase.firestore.FieldValue.serverTimestamp()};
  u['chars.'+ch+'.g']=inc(1);u['chars.'+ch+'.w']=inc(r.win?1:0);
  try{await db.collection('players').doc(uid).update(u);const d=await db.collection('players').doc(uid).get();me=d.data()}catch(e){console.warn('PROF record',e)}}
 async function top(field){const q=await db.collection('players').orderBy(field,'desc').limit(50).get();return q.docs.map(d=>Object.assign({id:d.id},d.data()))}
 return {init,setNick,record,top,check,get state(){return state},get err(){return err},get nick(){return nick()},get me(){return me},get uid(){return uid}}})();

/* ---------- okna: profil i ranking ---------- */
(function(){
 const css=`.prrow{display:flex;gap:8px;margin:2px 0 6px}.prrow button{flex:1;min-height:44px!important;font:700 14px system-ui!important}
#prM{position:fixed;inset:0;z-index:80;background:rgba(8,12,20,.8);display:flex;align-items:center;justify-content:center;padding:14px}
#prM .box{width:min(460px,100%);max-height:90vh;overflow:auto;background:linear-gradient(#5a3a1f,#3b2412);border:3px solid #1a0f06;border-radius:18px;padding:14px;color:#fff;box-shadow:0 8px 0 #1a0f06}
#prM h2{margin:0 0 8px;text-align:center;font:400 32px Bangers,Impact,sans-serif;color:#ffd84a;-webkit-text-stroke:1.5px #1a0f06;letter-spacing:2px}
#prM p{font:500 13px system-ui;opacity:.9;margin:6px 0}
#prM input{width:100%;box-sizing:border-box;font:700 18px system-ui;padding:10px;border-radius:10px;border:2px solid #1a0f06;background:#fff8e8;color:#2a180b}
#prM .err{color:#ff8a7a;font-weight:700}
#prM .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:8px 0}
#prM .stats div{background:rgba(0,0,0,.28);border-radius:10px;padding:6px;text-align:center;font:600 11px system-ui}
#prM .stats b{display:block;font:400 24px Bangers,Impact,sans-serif;color:#ffd84a;letter-spacing:1px}
#prM table{width:100%;border-collapse:collapse;font:600 13px system-ui}
#prM td,#prM th{padding:5px 4px;border-bottom:1px solid rgba(255,255,255,.12);text-align:right}
#prM td:nth-child(2),#prM th:nth-child(2){text-align:left}
#prM tr.me td{color:#ffd84a}
#prM .tabs{display:flex;gap:6px;margin-bottom:8px}#prM .tabs button{flex:1;min-height:34px;font:700 12px system-ui}#prM .tabs button.on{outline:3px solid #ffd84a}
#prM .acts{display:flex;gap:8px;margin-top:10px}#prM .acts button{flex:1}
.prnick{font-weight:800;color:#ffd84a}`;
 const s0=document.createElement('style');s0.textContent=css;document.head.appendChild(s0);
 const NOCFG='<p>Profile, ranking i statystyki wymagają podłączenia bazy danych (Firebase). Gra działa normalnie, tylko bez profili.</p>';
 function modal(kind){let m=document.getElementById('prM');if(m)m.remove();m=document.createElement('div');m.id='prM';document.body.appendChild(m);
  m.addEventListener('click',e=>{if(e.target===m)m.remove()});let tab='wins',list=null,msg='';
  m._redraw=async function(){let h='<div class="box">';
   if(kind==='prof'){h+='<h2>PROFIL</h2>';
    if(PROF.state==='nocfg')h+=NOCFG;else if(PROF.state==='init'||PROF.state==='off')h+='<p>Łączenie…</p>';else if(PROF.state==='err')h+='<p class="err">Nie udało się połączyć z bazą: '+hfEsc(PROF.err)+'</p>';
    else{const me=PROF.me;
     if(!me||m._edit){h+='<p>'+(me?'Zmień nick.':'Załóż profil: wpisz nick, który zobaczą inni gracze podczas wyboru postaci, gry i w wynikach. Profil jest przypisany do tego telefonu.')+'</p><input id="prNick" maxlength="16" placeholder="Twój nick" value="'+hfEsc(me?me.nick:'')+'">'+(msg?'<p class="err">'+hfEsc(msg)+'</p>':'')+'<div class="acts"><button class="go" data-pr="save">Zapisz</button>'+(me?'<button data-pr="cancel">Anuluj</button>':'')+'</div>'}
     else{const g=me.games||0,w=me.wins||0,fav=Object.entries(me.chars||{}).sort((a,b)=>(b[1].g||0)-(a[1].g||0))[0];
      h+='<p style="text-align:center;font:400 28px Bangers,Impact,sans-serif;color:#fff;letter-spacing:1px;margin:0">'+hfEsc(me.nick)+'</p>'
       +'<div class="stats"><div><b>'+g+'</b>gry</div><div><b>'+w+'</b>wygrane</div><div><b>'+(g?Math.round(100*w/g):0)+'%</b>wygranych</div><div><b>'+(me.kos||0)+'</b>nokauty</div><div><b>'+(me.dmg||0)+'</b>zadane obr.</div><div><b>'+(me.pts||0)+'</b>punkty</div></div>'
       +(fav?'<p>Ulubiona postać: <b>'+hfEsc(fav[0])+'</b> ('+fav[1].g+' gier, '+(fav[1].w||0)+' wygranych)</p>':'<p>Statystyki zbierają się z gier online.</p>')
       +(Object.keys(me.chars||{}).length?'<table><tr><th></th><th>Postać</th><th>Gry</th><th>Wygr.</th></tr>'+Object.entries(me.chars).sort((a,b)=>(b[1].g||0)-(a[1].g||0)).map(([c,v])=>'<tr><td>'+(IMG[c]?'<img src="'+IMG[c]+'" style="width:22px;height:22px;border-radius:50%">':'')+'</td><td>'+hfEsc(c)+'</td><td>'+(v.g||0)+'</td><td>'+(v.w||0)+'</td></tr>').join('')+'</table>':'')
       +'<div class="acts"><button data-pr="edit">Zmień nick</button><button data-pr="rank">🏆 Ranking</button></div>'}}
    h+='<div class="acts"><button data-pr="close">Zamknij</button></div>'}
   else{h+='<h2>RANKING</h2>';
    if(PROF.state==='nocfg')h+=NOCFG;else if(PROF.state!=='ready')h+='<p>Łączenie…</p>';
    else{h+='<div class="tabs">'+[['wins','Wygrane'],['pts','Punkty'],['kos','Nokauty']].map(([k,l])=>'<button data-prtab="'+k+'" class="'+(tab===k?'on':'')+'">'+l+'</button>').join('')+'</div>';
     if(!list)h+='<p>Wczytywanie…</p>';else if(!list.length)h+='<p>Na razie pusto. Zagraj online, żeby pojawić się w rankingu.</p>';
     else h+='<table><tr><th>#</th><th>Gracz</th><th>Gry</th><th>Wygr.</th><th>%</th><th>'+({wins:'Wygr.',pts:'Pkt',kos:'KO'})[tab]+'</th></tr>'+list.map((p,i)=>'<tr class="'+(p.id===PROF.uid?'me':'')+'"><td>'+(i+1)+'</td><td>'+hfEsc(p.nick)+'</td><td>'+(p.games||0)+'</td><td>'+(p.wins||0)+'</td><td>'+(p.games?Math.round(100*(p.wins||0)/p.games):0)+'</td><td><b>'+(p[tab]||0)+'</b></td></tr>').join('')+'</table>'}
    h+='<div class="acts"><button data-pr="close">Zamknij</button></div>'}
   m.innerHTML=h+'</div>';
   if(kind==='rank'&&PROF.state==='ready'&&!list&&!m._loading){m._loading=true;try{list=await PROF.top(tab)}catch(e){list=[];console.warn(e)}m._loading=false;m._redraw()}};
  m.addEventListener('click',async e=>{const t=e.target.closest('[data-pr],[data-prtab]');if(!t)return;e.stopPropagation();const a=t.dataset.pr;
   if(t.dataset.prtab){tab=t.dataset.prtab;list=null;m._redraw();return}
   if(a==='close'){m.remove();return}
   if(a==='edit'){m._edit=true;msg='';m._redraw();return}
   if(a==='cancel'){m._edit=false;msg='';m._redraw();return}
   if(a==='rank'){modal('rank');return}
   if(a==='save'){const v=(document.getElementById('prNick')||{}).value||'';const c=PROF.check(v);if(c){msg=c;m._redraw();return}
    t.disabled=true;try{await PROF.setNick(v);m._edit=false;msg=''}catch(err){msg=err.message||String(err)}m._redraw()}});
  m._redraw()}
 addClick('online/profiles',window,e=>{const t=e.target.closest&&e.target.closest('[data-prof],[data-rank]');if(!t)return;e.preventDefault();e.stopImmediatePropagation();try{SND.play('click')}catch(_){}
  PROF.init();modal(t.dataset.prof?'prof':'rank')},true);
 /* przyciski w menu wyboru trybu */
 addRender('online/profiles#1',_r=>function(){_r.apply(this,arguments);try{
  if(st.scr==='lobby'&&!st.gm&&!document.querySelector('.prrow')){const first=app.querySelector('[data-mode]');
   if(first)first.insertAdjacentHTML('beforebegin','<div class="prrow"><button data-prof="1">👤 '+(PROF.nick?hfEsc(PROF.nick):'Profil')+'</button><button data-rank="1">🏆 Ranking</button></div>')}
 }catch(e){}});
 setTimeout(()=>PROF.init(),400);
})();
(function(){
 const _j=join;join=function(){try{if(PROF.nick)ME.nick=PROF.nick}catch(e){}return _j.apply(this,arguments)};
})();

/* ---------- zapis statystyk po grze online ---------- */
(function(){
 const LSK='hf_prof_rec';let acc={key:null,dmg:0,kos:0};
 const gameKey=()=>net.code+':'+(ME.posr&&JSON.stringify(ME.posr[1]))+':'+ME.ch;
 const _ra=runAnim;runAnim=async function(){const online=!(typeof H!=='undefined'&&H)&&net&&net.code;
  if(online){const k=gameKey();if(acc.key!==k)acc={key:k,dmg:0,kos:0};let cur=null;
   (st.animEv||[]).forEach(e=>{if(['atk','charge','drone','scharge','puddle'].includes(e.k))cur=e.id;
    if(e.k==='dmg'&&cur===net.uid&&e.id!==net.uid&&e.w!=='strefa'&&e.w!=='ścisk')acc.dmg+=e.n||0;
    if(e.k==='out'&&e.id!==net.uid&&cur===net.uid)acc.kos++})}
  return _ra.apply(this,arguments)};
 addRender('online/profiles#2',_r=>function(){_r.apply(this,arguments);try{
  if((typeof H!=='undefined'&&H)||!net||!net.code||st.scr!=='rev'||st.animating||!PROF.me||!ME.ch)return;
  const items=netItems();if(items.length<2)return;const Rs=resolve(items);if((Rs._pend||[]).length)return;
  const surv=items.filter(o=>Rs[o.id]&&Rs[o.id].eff>0),over=isTeam()?new Set(surv.map(o=>o.q.tm)).size<=1:surv.length<=1;if(!over)return;
  const k=gameKey();let done={};try{done=JSON.parse(localStorage.getItem(LSK)||'{}')}catch(e){}if(done[k])return;done[k]=Date.now();
  try{const ks=Object.keys(done);if(ks.length>200)ks.slice(0,ks.length-200).forEach(x=>delete done[x]);localStorage.setItem(LSK,JSON.stringify(done))}catch(e){}
  const meO=items.find(o=>o.id===net.uid);const win=isTeam()?(surv.length>0&&surv[0].q.tm===ME.tm):(surv.length===1&&surv[0].id===net.uid);
  let pts=0;try{const row=scoreRows(items,Rs).find(r=>r.o.id===net.uid);pts=row?row.total:0}catch(e){}
  PROF.record({win,pts,dmg:acc.key===k?acc.dmg:0,kos:acc.key===k?acc.kos:0,ch:ME.ch,mode:st.gm});
 }catch(e){console.warn('PROF stats',e)}});
})();

