/* Testy narzędzi balansu: zapis prawdziwej partii, ekran statystyk, symulacja botów, eksport CSV.
   node tests/balance_test.js <plik.html> */
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,acceptDownloads:true});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await c.route(/^https?:\/\//,r=>r.abort());await p.goto('file://'+process.argv[2]);await p.waitForTimeout(1500);
 let ok=0,bad=0;const chk=(n,v)=>{if(v){ok++}else{bad++;console.log('✗',n)}};
 /* 1. prawdziwa partia na jednym telefonie do końca */
 await p.evaluate(()=>{localStorage.removeItem('hf_balance_v1');st.gm='classic';st.tm2='ffa';st.seed='bt';st.round=1;
  const P=(t,m,d)=>({t,m,d});const mk=(ch,pos)=>({ch,start:pos,posr:{1:pos},plans:{},hp:5,hpr:{1:5},hpo:{},got:{},pts:{}});
  H={n:2,cur:0,tgt:'plan',p:[mk('Byku',[0,1]),mk('Wiatrak',[1,0])]};window.__P=P});
 for(let r=0;r<4;r++){
  const over=await p.evaluate(()=>{const r=st.round,a=H.p[0],w=H.p[1];const pa=a.posr[r],pw=w.posr[r];if(!pa||!pw)return true;
   a.plans[r]=[__P('move',pw.slice()),__P('move',pw.slice())];w.plans[r]=[__P('move',pw.slice()),__P('move',pw.slice())];st.scr='hrev';render();st.skipReq=true;return false});
  if(over)break;await p.waitForFunction(()=>!st.animating,null,{timeout:30000});await p.waitForTimeout(400);
  const s=await p.evaluate(()=>{const r=document.getElementById('rsum');if(r)r.remove();const n=document.querySelector('[data-a="hnextr"]');if(n){n.click();return 'next'}return 'over'});
  if(s==='over')break;await p.waitForTimeout(300)}
 const log=await p.evaluate(()=>BalanceLog.all());
 chk('zapisana 1 partia',log.length===1);const g=log[0]||{players:[]};
 chk('partia zakończona, zwycięzca Byku',g.finished&&g.players.find(x=>x.ch==='Byku').win&&!g.players.find(x=>x.ch==='Wiatrak').win);
 chk('obrażenia zadane = otrzymane',g.players.reduce((a,x)=>a+x.dealt,0)===g.players.reduce((a,x)=>a+x.taken,0));
 chk('sposób eliminacji: lądowanie Byka',(g.players.find(x=>x.ch==='Wiatrak').elim||{}).cause==='lądowanie Byka');
 chk('umiejętności: skoki Byka',(g.players.find(x=>x.ch==='Byku').abil['skok']||0)>=1);
 console.log('partia:',JSON.stringify(g));
 /* 2. ekran statystyk + symulacja */
 await p.evaluate(()=>{H=null;goMenu()});await p.waitForTimeout(400);
 await p.tap('[data-devopen]');await p.waitForTimeout(300);chk('ekran statystyk',!!(await p.$('#devSt')));
 await p.selectOption('[data-dvs="games"]','100');await p.tap('[data-dv="sim"]');await p.waitForFunction(()=>BalanceLog.all().filter(g=>g.src==='bot').length>=100,null,{timeout:60000});await p.waitForTimeout(500);
 const rows=await p.$$eval('#devSt table tr',t=>t.length-1);chk('tabela postaci po symulacji',rows>=8);
 const props=await p.$$eval('#devSt .prop',t=>t.map(x=>x.innerText));chk('propozycje',props.length>=8);console.log(props.slice(0,4).join('\n'));
 const [dl]=await Promise.all([p.waitForEvent('download'),p.tap('[data-dv="csvc"]')]);const path=await dl.path();const csv=require('fs').readFileSync(path,'utf8');
 chk('CSV postaci',csv.includes('postac;partie')&&csv.split('\n').length>=9);console.log(csv.split('\n').slice(0,3).join('\n'));
 const [dl2]=await Promise.all([p.waitForEvent('download'),p.tap('[data-dv="csvp"]')]);const csv2=require('fs').readFileSync(await dl2.path(),'utf8');chk('CSV graczy',csv2.split('\n').length>=200);
 if(process.argv[3])await p.screenshot({path:process.argv[3]});
 chk('bez błędów strony',!errs.length);console.log('testy balansu:',ok,'zaliczone,',bad,'niezaliczone',errs.slice(0,3));await b.close();process.exit(bad?1:0)})().catch(e=>{console.log('FAILED',e.message);process.exit(1)});
