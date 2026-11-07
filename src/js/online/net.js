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
  net.db={doc:p=>({set:o=>fs.doc(p).set({j:JSON.stringify(o),t:Date.now()})}),
   collection:p=>({onSnapshot:(cb,er)=>fs.collection(p).onSnapshot(sn=>cb({docs:sn.docs.map(d=>({id:d.id,data:()=>dec(d)}))}),er||(e=>{console.warn('Firebase:',e);net.err=true;render()}))})};
 }catch(e){console.warn('Firebase:',e);net.db=null}
 render()
}
//@@else
async function initNet(){try{const u=await claude.use('user'),d=await claude.use('db');if(u&&d){net.uid=await u.id();net.db=d}}catch(e){}render()}
//@@end
function save(){if(!net.db)return;net.db.doc('rooms/'+net.code+'/players/'+net.uid).set(JSON.parse(JSON.stringify(ME))).catch(()=>{net.err=true;render()})}
function join(code){net.code=code.toUpperCase();net.unsub&&net.unsub();net.unsub=net.db.collection('rooms/'+net.code+'/players').onSnapshot(sn=>{net.pl={};sn.docs.forEach(d=>net.pl[d.id]=d.data());chk();render()},()=>{});save();st.scr='pick';render()}
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
