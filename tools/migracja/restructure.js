/* Etap 4: podział kodu na moduły tematyczne.
   - deklaracje funkcji (wynoszone na górę skryptu przez JS, więc kolejność nie ma znaczenia) -> pliki bibliotek wg FN,
   - stałe z samymi danymi (nic nie jest obliczane przy tworzeniu) -> pliki danych wg DATA,
   - wszystkie pozostałe instrukcje (owijki, IIFE, wywołania) zostają w PIERWOTNEJ kolejności, w plikach „init” wg SEG.
   node tools/restructure.js [apply] */
const {load}=require('../srcmap');const fs=require('fs'),path=require('path');
const {files,text,ast,walk,fileOf,ROOT}=load('github');
const LIB={
 'core/util.js':'shade rng wait tween hfEsc idByName dist',
 'core/state.js':'mine curP curItems playerOf saveP myHp alive',
 'engine/rules.js':'zoneR nPh newPlan sheepAtPhase droneAt entState ptsOf ptTotal winTeam isTeam teamOfCh lastActor',
 'engine/resolve.js':'attack sim resolve resolveFin finalAt withRound realRound seedStr spawnCount',
 'engine/bonuses.js':'bonusUsable bonName bonusSpent posPh2 pickFrom applyRoll',
 'characters/actions.js':'actDefs actTxt planTxt whyTxt zylAim',
 'characters/art.js':'sheepArt sheepEl puddleSvg droneArt droneEl standee',
 'characters/demos.js':'dmXY dmHexPts dmTokH dmAt dmStop dmApi dmMove dmLine dmCrush demoH demoPlay openDemo closeDemo',
 'board/board.js':'zf lab tok pips board zsort cellC nbCells boardExtras exAdd shPos hTok othersOverlay depthScale',
 'ui/planning.js':'fromPos setSlot next actBtns planOk planHint planTap extraHL stepperHtml pushPick pickCell firstFree',
 'ui/screens.js':'splashH render lobbyH hSetupH charPickH hStartsH styleScreens v2post selPickerH hPassH fitSelBg injectExtras hudify vsH selectOverlay startPanelH goMenu revCore revH hRevH scoreRows scoreTable openWheel modalize hasPendPush teamTag',
 'online/net.js':'initNet save join chk netItems netPlayers allPicked taken teamCount hfNickOfCh',
 'online/screens.js':'waitTxt waitH cwaitH',
 'fx/anim.js':'initAnimPos capSet ovSet nmOf popSet popHide shakeTok stageSet burst shakeStage hpSet phaseBanner ovAdd runAnim tokMove cam animView pickAnim hopSet tkFx',
 'fx/sound.js':'sndPanel sndBtn',
 'modes/special.js':'isSp pickups itemsAfter boardItems iid glyph itemSvg spInit PNB',
 'modes/testy.js':'TB MAXHP chOfId tbTexts tbInit'};
const DATA={
 'characters/data.js':'IMG INI C CHA ART ROLE SHORT BGART BGPOS FACEPT PKCOL TCOL,TNAME',
 'board/geometry.js':'GEO D DN cells K,IN px hexPts',
 'core/state.js#data':'st app BOARD_SVG net ME H LAST_BOARD BAN BG SPLURI',
 'fx/assets.js':'SPR2D SPRA MANEKIN_IMG MBART PROPS2D SFXDATA',
 'characters/demos.js#data':'DM dmNb,dmAll,dmDist DH,N DEMOS',
 'modes/special.js#data':'ITEM ITYPES',
 'modes/testy.js#data':'TBP TBHP TBORIG TBTXT'};
/* dodatkowe instrukcje przenoszone razem z danymi planszy (wypełnienie listy pól) */
const EXTRA_DATA={'board/geometry.js':[s=>fileOf(s.start).f.startsWith('js/000')&&s.type==='ForStatement']};
const SEG={'000':'core/main.js','001':'engine/bonuses_init.js','002':'ui/style_init.js','003':'fx/anim_init.js','004':'board/pseudo3d_init.js','005':'modes/special_init.js',
 '006':'ui/modals_init.js','007':'characters/v3_init.js','008':'characters/new_chars_init.js','009':'modes/teams_init.js','010':'ui/select_screen_init.js','011':'ui/hud_init.js',
 '012':'fx/pickup_init.js','013':'online/pick_flow_init.js','014':'ui/pick_hotseat_init.js','015':'fx/sound_init.js','016':'board/tokens_init.js','017':'characters/demos_init.js',
 '018':'modes/testy_init.js','019':'modes/testy_zyleta_init.js','020':'characters/owca_byku_init.js','021':'modes/testy_ciotka_init.js','022':'modes/testy_byku_menu_init.js',
 '023':'modes/bitwa_baz.js','024':'online/p2p.js','025':'fx/sfx_files.js','026':'modes/special_pasterz_init.js','027':'fx/sprites2d.js','028':'ui/round_summary.js',
 '029':'modes/training.js','030':'characters/byku_balance.js','031':'online/max6.js','032':'online/profiles.js','033':'ui/menu_fix.js','034':'online/draft.js',
 '035':'board/board2d.js','036':'board/small_board.js'};
const fnLib={};for(const [f,ns] of Object.entries(LIB))ns.split(' ').forEach(n=>fnLib[n]=f);
const dataOf={};for(const [f,ns] of Object.entries(DATA))ns.split(' ').forEach(n=>dataOf[n]=f);
/* granice instrukcji: od końca poprzedniej do końca bieżącej (komentarze przed instrukcją idą z nią) */
const body=ast.body;const chunks=[];let prevEnd=0;
const fileStartBefore=s=>{const f=fileOf(s.start);return f.start>prevEnd?f.start:prevEnd};
body.forEach((s,i)=>{let a=prevEnd;const f=fileOf(s.start);if(f.start>a)a=f.start;/* nie przekraczamy granicy pliku */
 let z=s.end;/* dołącz resztę linii (średnik, komentarz końcowy) */ const nl=text.indexOf('\n',z);const rest=nl<0?'':text.slice(z,nl);if(/^\s*(;\s*)?$/.test(rest))z=nl+1;
 chunks.push({i,s,a,z,f:f.f});prevEnd=z});
/* tekst między ostatnią instrukcją pliku a końcem pliku dołączamy do ostatniego kawałka tego pliku */
for(const f of files){const cs=chunks.filter(c=>c.f===f.f);if(cs.length){const last=cs[cs.length-1];if(last.z<f.end)last.z=f.end}else console.log('plik bez instrukcji',f.f)}
/* linie zamykające blok wariantu (//@@else, //@@end) na początku kawałka należą do poprzedniego kawałka */
for(let k=1;k<chunks.length;k++){const c=chunks[k],p=chunks[k-1];if(c.f!==p.f)continue;const lead=text.slice(c.a,c.s.start);const i=lead.lastIndexOf('@@end');
 if(i>=0){const pt=text.slice(p.a,p.z);const bal=(pt.match(/@@if github/g)||[]).length-(pt.match(/@@end/g)||[]).length;if(bal>0){const nl=text.indexOf('\n',c.a+i);p.z=nl+1;c.a=nl+1}}}
/* łączenie kawałków przecinających bloki wariantów */
const merged=[];for(const c of chunks){const t=text.slice(c.a,c.z);const prev=merged[merged.length-1];
 const open=x=>(x.match(/@@if github/g)||[]).length-(x.match(/@@end/g)||[]).length;
 if(prev&&prev.bal>0&&prev.f===c.f){prev.z=c.z;prev.items.push(c);prev.bal=open(text.slice(prev.a,prev.z))}else merged.push({a:c.a,z:c.z,f:c.f,items:[c],bal:open(t)})}
if(merged.some(m=>m.bal!==0))throw new Error('niezamknięty blok wariantu');
const isLiteralInit=init=>{let bad=false;walk.recursive(init,null,{Function(){},ArrowFunctionExpression(){},FunctionExpression(){},Identifier(n){bad=true},
 Property(n,st,c){if(n.computed)c(n.key,st);c(n.value,st)},MemberExpression(n,st,c){c(n.object,st);if(n.computed)c(n.property,st)}});return !bad};
const out={};const order=[];const add=(file,txt,kind)=>{if(!out[file]){out[file]={kind,parts:[]};order.push(file)}out[file].parts.push(txt)};
const missing=[];const hdr=/\/\*\s*={3,}[^]*?={3,}\s*\*\/\n?/g;
const srcHeader={};files.forEach(f=>{const m=f.t.match(/^\/\*\s*={3,}\s*(.*?)\s*={3,}\s*\*\//);srcHeader[f.f]=m?m[1]:''});
const seen=new Set();
for(const m of merged){const t=text.slice(m.a,m.z);const sts=m.items.map(c=>c.s);const src=m.f.slice(3,6);
 const allFn=sts.every(s=>s.type==='FunctionDeclaration');
 const varNames=s=>s.type==='VariableDeclaration'?s.declarations.map(d=>d.id.name).join(','):null;
 let target=null,kind='seg';
 if(allFn){const libs=[...new Set(sts.map(s=>fnLib[s.id.name]))];if(libs.length!==1||!libs[0]){sts.forEach(s=>{if(!fnLib[s.id.name])missing.push(s.id.name)});continue}target=libs[0];kind='lib'}
 else if(sts.length===1&&sts[0].type==='VariableDeclaration'&&dataOf[varNames(sts[0])]&&sts[0].declarations.every(d=>!d.init||isLiteralInit(d.init)||['app'].includes(d.id.name))){target=dataOf[varNames(sts[0])].split('#')[0];kind='data'}
 else if(Object.entries(EXTRA_DATA).some(([f,fs_])=>fs_.some(fn=>sts.length===1&&fn(sts[0])))){target=Object.entries(EXTRA_DATA).find(([f,fs_])=>fs_.some(fn=>fn(sts[0])))[0];kind='data'}
 else{target=SEG[src];kind='seg'}
 let piece=t;
 if(kind!=='seg'){/* nagłówki sekcji zostają w pliku sekwencji źródła (jako znacznik), z kawałków bibliotek je usuwamy */
  piece=piece.replace(hdr,'');piece=piece.replace(/^\n+/,'');
  const key=target+'|'+m.f;if(!seen.has(key)){seen.add(key);piece='/* --- z części: '+(srcHeader[m.f]||m.f)+' --- */\n'+piece}}
 if(!piece.endsWith('\n'))piece+='\n';
 add(target,piece,kind)}
if(missing.length){console.log('BRAK PRZYPISANIA funkcji:',missing.join(' '));process.exit(1)}
/* pliki sekwencji muszą zachować względną kolejność: sprawdzamy, że kolejność ich pierwszego wystąpienia jest zgodna z kolejnością źródeł */
const segFiles=order.filter(f=>out[f].kind==='seg');
const dataFiles=Object.keys(DATA).map(k=>k.split('#')[0]).filter((v,i,a)=>a.indexOf(v)===i&&out[v]);
const libFiles=Object.keys(LIB).filter(f=>out[f]&&!dataFiles.includes(f));
const HEAD={'core/util.js':'Narzędzia ogólne','core/state.js':'Stan gry: ekran, gracze, sieć','engine/rules.js':'Silnik: zasady (strefa, fazy, drużyny, punkty)','engine/resolve.js':'Silnik: rozpatrywanie rundy (sim, ataki, wynik)',
 'engine/bonuses.js':'Silnik: bonusy postaci (koło)','characters/actions.js':'Postacie: akcje i ich opisy','characters/art.js':'Postacie: grafika dodatków (owca, dron, kałuża, stojaki)','characters/demos.js':'Postacie: podgląd akcji (demo)',
 'characters/data.js':'Postacie: dane (nazwy, kolory, opisy, portrety)','board/geometry.js':'Plansza: geometria heksów','board/board.js':'Plansza: rysowanie pól i żetonów','ui/planning.js':'Interfejs: planowanie ruchów',
 'ui/screens.js':'Interfejs: ekrany i render','online/net.js':'Online: pokoje i synchronizacja','online/screens.js':'Online: ekrany oczekiwania','fx/anim.js':'Animacje rundy','fx/sound.js':'Dźwięk: panel',
 'fx/assets.js':'Grafiki i dźwięki (dane)','modes/special.js':'Tryb specjalny: przedmioty','modes/testy.js':'Tryb Testy: nowy balans'};
const finalFiles={};const pre=f=>'/* '+'='.repeat(21)+' '+(HEAD[f]||f)+' '+'='.repeat(21)+' */\n';
for(const f of [...dataFiles,...libFiles])finalFiles['js/'+f]=pre(f)+out[f].parts.join('');
for(const f of segFiles)finalFiles['js/'+f]=out[f].parts.join('');
const manifestJs=[...dataFiles,...libFiles,...segFiles].map(f=>'js/'+f);
/* kontrola: sekwencje w kolejności źródeł */
const segSrcOrder=segFiles.map(f=>Object.entries(SEG).find(([k,v])=>v===f)[0]);
if(segSrcOrder.join()!==segSrcOrder.slice().sort().join())throw new Error('zła kolejność sekwencji');
console.log('pliki danych:',dataFiles.length,'biblioteki:',libFiles.length,'sekwencje:',segFiles.length);
for(const f of manifestJs)console.log(' ',f,finalFiles[f].length);
if(process.argv[2]==='apply'){
 for(const f of files)fs.unlinkSync(ROOT+'/src/'+f.f);
 for(const [f,t] of Object.entries(finalFiles)){fs.mkdirSync(path.dirname(ROOT+'/src/'+f),{recursive:true});fs.writeFileSync(ROOT+'/src/'+f,t)}
 const man=JSON.parse(fs.readFileSync(ROOT+'/src/manifest.json','utf8'));man.js=manifestJs;fs.writeFileSync(ROOT+'/src/manifest.json',JSON.stringify(man,null,1))}
