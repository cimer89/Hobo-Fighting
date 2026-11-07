/* ===================== Online: pokoje i synchronizacja ===================== */
/* --- z części: js/000-start.js --- */
//@@if github
async function initNet(){
 try{
  if(!window.firebase||FIREBASE_CONFIG.apiKey==='WPISZ_TUTAJ')return render();
  firebase.initializeApp(FIREBASE_CONFIG);
  /* tożsamość na kartę przeglądarki (jak w przekaźniku): dwie karty = dwóch graczy, odświeżenie karty zachowuje gracza */
  try{await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)}catch(e){}
  const cred=await firebase.auth().signInAnonymously();
  net.uid=cred.user.uid;
  /* Firestore nie przyjmuje tablic w tablicach (np. pola [q,r] w listach), więc dokument pokoju zapisujemy jako tekst JSON w polu j */
  const fs=firebase.firestore(),dec=d=>{const x=d.data();return x&&typeof x.j==='string'?JSON.parse(x.j):x};
  /* exp: data wygaśnięcia dokumentu pokoju (zasada TTL w Firestore usuwa stare pokoje po 2 dniach) */
  net.db={doc:p=>({set:o=>fs.doc(p).set({j:JSON.stringify(o),t:Date.now(),exp:firebase.firestore.Timestamp.fromMillis(Date.now()+2*864e5)})}),
   collection:p=>({onSnapshot:(cb,er)=>fs.collection(p).onSnapshot(sn=>cb({docs:sn.docs.map(d=>({id:d.id,data:()=>dec(d)}))}),er||(e=>{console.warn('Firebase:',e);net.err=true;render()}))})};
 }catch(e){console.warn('Firebase:',e);net.db=null;
  /* Firebase niedostępny (brak sieci do Google, zablokowany skrypt): zapasowo przekaźnik bez konfiguracji */
  setTimeout(()=>{try{if(!net.db)P2P.init()}catch(x){}},0)}
 render()
}
//@@else
async function initNet(){try{const u=await claude.use('user'),d=await claude.use('db');if(u&&d){net.uid=await u.id();net.db=d}}catch(e){}render()}
//@@end
/* klucz zobowiązania dla planu gracza id w rundzie r */
const cmKey=(id,r)=>'c:'+net.code+':'+r+':'+id;
/* czy wszyscy inni żywi gracze w pokoju zapisali już skrót lub plan na rundę r */
function allCommitted(r){const os=Object.entries(net.pl||{}).filter(([id,p])=>id!==net.uid&&p&&alive(p,r));return os.length>0&&os.every(([,p])=>(p.cm&&p.cm[r])||(p.plans&&p.plans[r]))}
/* dokument gracza do zapisu: plany jeszcze nieujawnione zastępuje skrót (cm), ujawnione mają sól (sl) */
async function buildDoc(){const d=JSON.parse(JSON.stringify(ME));d._v=GAME_VERSION;if(!Commit.ok||!d.plans)return d;d.cm={};d.sl={};
 for(const k of Object.keys(d.plans)){const key=cmKey(net.uid,k),c=await Commit.seal(key,d.plans[k]);d.cm[k]=c.h;
  if(Commit.isOpen(key)||allCommitted(+k)){Commit.open(key);d.sl[k]=c.salt}else delete d.plans[k]}
 return d}
function save(){if(!net.db)return;const seq=net._sv=(net._sv||0)+1;
 buildDoc().then(d=>{if(seq!==net._sv)return;const pr=net.db.doc('rooms/'+net.code+'/players/'+net.uid).set(d);pr&&pr.catch&&pr.catch(()=>{net.err=true;render()})})}
/* po każdej zmianie w pokoju: zamroź cudze skróty, ujawnij swój plan, sprawdź cudze ujawnienia */
function commitSync(){const r=st.round;if(!net.pl)return;
 if(allCommitted(r)&&ME.plans&&ME.plans[r])Object.entries(net.pl).forEach(([id,p])=>{if(id!==net.uid&&p&&p.cm&&p.cm[r])Commit.lock(cmKey(id,r),p.cm[r])});
 if(ME.plans&&ME.plans[r]&&!Commit.isOpen(cmKey(net.uid,r))&&allCommitted(r))save();
 Object.entries(net.pl).forEach(([id,p])=>{if(id===net.uid||!p||!p.plans)return;Object.keys(p.plans).forEach(k=>{if(p.sl&&p.sl[k])Commit.verify(cmKey(id,k),p.plans[k],p.sl[k],p.cm&&p.cm[k],()=>{net.cheat=net.cheat||{};net.cheat[id]=1;render()})})})}
function join(code){net.code=code.toUpperCase();net.unsub&&net.unsub();net.unsub=net.db.collection('rooms/'+net.code+'/players').onSnapshot(sn=>{net.pl={};sn.docs.forEach(d=>net.pl[d.id]=d.data());try{commitSync()}catch(e){console.warn('commit',e)}chk();render()},()=>{});save();st.scr='pick';render()}
function chk(){const ps=Object.values(net.pl);if(st.scr==='plan'&&st.done&&ps.length>1&&ps.filter(p=>alive(p,st.round)).every(p=>p.plans&&p.plans[st.round]))st.scr='rev'}
function netItems(){return Object.entries(net.pl).sort().map(([id,p])=>({id,q:id===net.uid?ME:p,idx:0}))}
/* --- z części: online: najpierw wszyscy wybierają, potem VS, potem rozstawienie --- */
function netPlayers(){return Object.entries(net.pl||{}).sort((a,b)=>a[0]<b[0]?-1:1).map(([id,p])=>({id,q:id===net.uid?ME:p}))}
function allPicked(){const ps=netPlayers();if(ps.length<2||!ps.every(o=>o.q.chready||o.q.sready))return false;
 if(isTeam())return ps.length===4&&ps.filter(o=>o.q.tm==='A').length===2&&ps.filter(o=>o.q.tm==='B').length===2;return true}
function taken(n){if(H)return H.p.some((p,i)=>i!==H.cur&&p.ch===n);return !!net.db&&Object.entries(net.pl).some(([id,p])=>id!==net.uid&&p.ch===n&&(p.chready||p.sready))}
function teamCount(t){if(H)return H.p.filter((p,i)=>i!==H.cur&&p.tm===t).length;return Object.entries(net.pl||{}).filter(([id,p])=>id!==net.uid&&(p.chready||p.sready)&&p.tm===t).length}
/* --- z części: PROFILE GRACZY, RANKING I STATYSTYKI (Firebase: Firestore + logowanie anonimowe) --- */
/* ---------- nick w grze: wybór postaci, plansza, wyniki ---------- */
function hfNickOfCh(ch){try{if(typeof H!=='undefined'&&H)return null;if(!net||!net.code||!net.pl)return null;
 if(ME&&ME.ch===ch&&ME.nick)return ME.nick;const p=Object.values(net.pl).find(q=>q&&q.ch===ch);return p&&p.nick||null}catch(e){return null}}
