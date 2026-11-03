/* Zrzuty kluczowych ekranów do porównania wyglądu: node shots.js <plik.html> <katalog> */
const {chromium}=require('playwright');const fs=require('fs');
const FILE=process.argv[2],DIR=process.argv[3];fs.mkdirSync(DIR,{recursive:true});
const INIT=()=>{let s=12345;window.__seed=v=>{s=v>>>0||1};Math.random=function(){s=(s+0x6D2B79F5)|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
(async()=>{const b=await chromium.launch();const errs=[];
 const fresh=async()=>{const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true});await ctx.route(/^https?:\/\//,r=>r.abort());
  const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));await p.addInitScript(INIT);await p.goto('file://'+FILE);
  await p.waitForFunction(()=>typeof B3D!=='undefined'&&/^on/.test(B3D.status)&&!/busy/.test(B3D.status),null,{timeout:30000}).catch(()=>{});await p.waitForTimeout(600);return p};
 const shot=async(p,n)=>{await p.waitForTimeout(900);await p.screenshot({path:DIR+'/'+n+'.png'})};
 const tap=async(p,s)=>{await p.tap(s,{timeout:8000});await p.waitForTimeout(400)};
 let p=await fresh();await shot(p,'01_splash');
 await tap(p,'[data-a="start"]');await shot(p,'02_menu');
 await tap(p,'[data-mode="classic"]');await shot(p,'03_lobby_classic');
 await tap(p,'[data-tm="ffa"]');await shot(p,'04_lobby_ffa');
 await tap(p,'[data-a="hot"]');await tap(p,'[data-n="2"]');await shot(p,'05_pick');
 await p.evaluate(()=>{const b=[...document.querySelectorAll('[data-a="chok"]')].pop();b.click()});await p.waitForTimeout(500);
 await p.evaluate(()=>{const b=[...document.querySelectorAll('[data-a="chok"]')].pop();b.click()});await p.waitForTimeout(800);await shot(p,'06_vs');
 await tap(p,'[data-a="vsgo"]');await tap(p,'[data-a="hgo"]');await shot(p,'07_start2p');
 await p.context().close();
 /* plansza 4 graczy w planowaniu */
 p=await fresh();await p.evaluate(()=>{st.gm='special';st.tm2='ffa';st.seed='shot';st.round=1;const S=[[0,2],[0,-2],[2,0],[-2,0]],ch=['Byku','Pasterz','Wiatrak','Ciotka'];
  H={n:4,cur:0,tgt:'plan',p:ch.map((c,i)=>({ch:c,start:S[i],plans:{},posr:{1:S[i]},hp:5,hpr:{1:5},hpo:{}}))};st.scr='plan';st.ch='Byku';st.start=[0,2];st.plan=newPlan();st.ph=0;st.done=false;render()});
 await shot(p,'08_plan4');
 await p.tap('[data-t="move"]');await p.waitForTimeout(300);await shot(p,'09_plan4_move');
 await p.context().close();
 /* Bitwa baz */
 p=await fresh();await tap(p,'[data-a="start"]');await tap(p,'.mbmain');await shot(p,'10_mb_menu');
 await p.evaluate(()=>{window.__seed(99);MB.newGame('2v2',0);const G=MB.G;const chs=['Byku','Pasterz','Wiatrak','Ciotka'];G.heroes.forEach((h,i)=>{h.ch=chs[i];h.pos=G.bases[h.team].pos.slice()});G.cur=0;G.scr='pass';MB.draw()});
 await tap(p,'[data-mb="ready"]');await shot(p,'11_mb_map');
 await p.context().close();
 /* trening */
 p=await fresh();await tap(p,'[data-a="start"]');await tap(p,'[data-mode="classic"]');await tap(p,'[data-train]');await tap(p,'[data-trch="Byku"]');await shot(p,'12_training');
 await p.context().close();
 console.log('shots ok, errors:',errs.length?errs.slice(0,3):'none');await b.close()})().catch(e=>{console.log('FAILED',e.message);process.exit(1)});
