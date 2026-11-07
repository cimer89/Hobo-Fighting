const {chromium}=require('playwright');const SP='/tmp/claude-0/-home-claude/02ba6371-1854-5167-9776-8f373e9bc30b/scratchpad';
(async()=>{const b=await chromium.launch();const msgs={};let mid=0;const N=+(process.argv[3]||3),TM=process.argv[4]||'ffa';const pages=[];const errs=[];
 for(let i=0;i<N;i++){const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(i+':'+e.message));
  await ctx.route(/^https?:\/\//,async r=>{const u=r.request().url();
   if(u.startsWith('https://ntfy.sh/')){const t=u.slice(16).split(/[/?]/)[0];msgs[t]=msgs[t]||[];
    if(r.request().method()==='POST'){const m={id:'m'+(++mid),event:'message',message:r.request().postData(),time:Date.now()};msgs[t].push(m);return r.fulfill({body:JSON.stringify(m)})}
    if(u.includes('/json'))return r.fulfill({body:msgs[t].map(m=>JSON.stringify(m)).join('\n')});}
   return r.fulfill({body:''})});
  await p.addInitScript(()=>{window.EventSource=function(url){const self=this;const base=url.split('/sse')[0];let seen=new Set();setTimeout(()=>self.onopen&&self.onopen(),10);
   const tick=async()=>{try{const r=await fetch(base+'/json?poll=1');const t=await r.text();for(const l of t.split('\n')){if(!l)continue;const m=JSON.parse(l);if(seen.has(m.id))continue;seen.add(m.id);self.onmessage&&self.onmessage({data:l})}}catch(e){}self._t=setTimeout(tick,250)};tick();this.close=()=>clearTimeout(self._t)}});
   await p.addInitScript(()=>{window.__AFK_MS=4000});
  await p.goto('file://'+process.argv[2]);await p.waitForTimeout(700);pages.push(p)}
 const H=pages[0],B=pages[1];const tap=async(p,s)=>{await p.tap(s,{timeout:8000});await p.waitForTimeout(350)};
 await tap(H,'[data-a="start"]');await tap(H,'[data-mode="classic"]');await tap(H,'[data-tm="ffa"]');await tap(H,'[data-a="create"]');await H.waitForTimeout(800);
 const code=await H.evaluate(()=>net.code);await tap(B,'[data-a="start"]');await B.fill('#code',code);await tap(B,'[data-a="joinb"]');await B.waitForTimeout(1500);
 await tap(H,'[data-dr="go"]');await H.waitForTimeout(1500);
 const chs=['Wiatrak','Byku'];for(let k=0;k<2;k++){await H.waitForTimeout(1200);let who=-1;for(let i=0;i<2;i++)if(await pages[i].$('.drturn'))who=i;if(who<0){console.log('FAIL brak kolejki');break}
  const p=pages[who];await p.tap(`#selOv [data-ch="${chs[k]}"]`,{force:true});await p.waitForTimeout(400);await p.tap('#selOv [data-a="chok"]',{force:true});await p.waitForTimeout(500)}
 await H.waitForTimeout(1500);for(const p of pages){const b=await p.$('[data-a="vsgo"]');if(b){await b.tap().catch(()=>{});await p.waitForTimeout(800)}}
 const place=async(p,k)=>{await p.evaluate(k=>{document.querySelector('#stage svg [data-k="'+k+'"] polygon').dispatchEvent(new MouseEvent('click',{bubbles:true}))},k);await p.waitForTimeout(400);await tap(p,'[data-a="confirm"]')};
 await place(H,'-2,0');await place(B,'2,0');await H.waitForTimeout(1500);
 for(const p of pages){const g=await p.$('[data-a="goplan"]');if(g){await g.tap();await p.waitForTimeout(600)}}
 /* tylko H planuje */
 await H.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const cl=k=>document.querySelector('#stage svg [data-k="'+k+'"] polygon').dispatchEvent(new MouseEvent('click',{bubbles:true}));
  for(const [t,k] of [['move','-1,0'],['atk','0,0']]){document.querySelector('#app [data-t="'+t+'"]').click();await W(300);cl(k);await W(300);document.querySelector('#app [data-a="ok"]').click();await W(700)}});
 await H.waitForTimeout(2500);const w1=await H.evaluate(()=>[st.scr,typeof waitTxt==='function'?waitTxt():'']);console.log('przed limitem',JSON.stringify(w1));
 if(w1[0]==='rev')console.log('FAIL runda ruszyła bez gracza B');
 await H.waitForTimeout(9000);
 const s=await Promise.all(pages.map(p=>p.evaluate(()=>[st.scr,JSON.stringify(ME.plans),JSON.stringify(ME.afk||null)])));console.log('po limicie',JSON.stringify(s));
 if(s[0][0]!=='rev'||s[1][0]!=='rev')console.log('FAIL nie przeszło do ujawnienia');
 await H.waitForTimeout(6000);
 const sum=await Promise.all(pages.map(p=>p.evaluate(()=>{const t=document.body.innerText.replace(/\s+/g,' ');const i=t.indexOf('Runda 1: wyniki');return i<0?'brak':t.slice(i,t.indexOf('Następna runda',i)).replace(/ \(Ty\)/g,'')})));console.log('podsumowania',JSON.stringify(sum));
 if(sum[0]!==sum[1]||sum[0]==='brak')console.log('FAIL różne podsumowania');else console.log('PASS ta sama runda u obu, B stał');
 const bar=await B.evaluate(()=>{const b=document.getElementById('fairBar');return b?b.textContent:null});console.log('komunikat B',bar);
 console.log('errors',errs.join('|')||'none');await b.close()})().catch(e=>{console.log('FAILED',e.message.split('\n')[0]);process.exit(1)});
