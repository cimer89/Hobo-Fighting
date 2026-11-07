const {chromium}=require('playwright');const SP='/tmp/claude-0/-home-claude/02ba6371-1854-5167-9776-8f373e9bc30b/scratchpad';
// relay ntfy symulowany w pamięci: POST zapisuje, GET poll zwraca, SSE strumieniuje
(async()=>{const b=await chromium.launch();const msgs={};let mid=0;const sse=[];
 const N=+(process.argv[3]||2),mode=N===2?'1v1':'2v2';
 const pages=[];const errs=[];
 for(let i=0;i<N;i++){const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(i+':'+e.message));
  await ctx.route(/^https?:\/\//,async r=>{const u=r.request().url();
   if(u.startsWith('https://ntfy.sh/')){const t=u.slice(16).split(/[/?]/)[0];msgs[t]=msgs[t]||[];
    if(r.request().method()==='POST'){const m={id:'m'+(++mid),event:'message',message:r.request().postData(),time:Date.now()};msgs[t].push(m);return r.fulfill({body:JSON.stringify(m)})}
    if(u.includes('/json'))return r.fulfill({body:msgs[t].map(m=>JSON.stringify(m)).join('\n')});
    if(u.includes('/sse'))return r.fulfill({status:200,headers:{'content-type':'text/event-stream'},body:''});}
   return r.fulfill({body:''})});
  await p.addInitScript(()=>{window.__AFK_MS=4000});await p.goto('file://'+process.argv[2]);await p.waitForTimeout(700);pages.push(p)}
 // SSE niedostępne w route -> okresowe odpytywanie: podmieniamy EventSource na polling
 for(const p of pages)await p.evaluate(()=>{window.EventSource=function(url){const self=this;const base=url.split('/sse')[0];let seen=new Set();setTimeout(()=>self.onopen&&self.onopen(),10);
   const tick=async()=>{try{const r=await fetch(base+'/json?poll=1');const t=await r.text();for(const l of t.split('\n')){if(!l)continue;const m=JSON.parse(l);if(seen.has(m.id))continue;seen.add(m.id);self.onmessage&&self.onmessage({data:l})}}catch(e){}self._t=setTimeout(tick,250)};tick();this.close=()=>clearTimeout(self._t)}});
 const tap=async(p,s)=>{await p.tap(s,{timeout:8000}).catch(async e=>{console.log('TAPFAIL',s,await p.evaluate(()=>MB.G&&MB.G.scr),await p.evaluate(()=>document.querySelector('#mbRoot').innerText.slice(0,300)));throw e});await p.waitForTimeout(350)};
 const H=pages[0];
 await tap(H,'[data-a="start"]');await tap(H,'.mbmain');await H.screenshot({path:SP+'/t2d/shots/mbo1.png'});
 await tap(H,'[data-mb="on:host"]');await tap(H,`[data-mb="mode:${mode}"]`);await tap(H,'[data-mb="map:0"]');await H.waitForTimeout(600);
 const code=await H.evaluate(()=>document.querySelector('.mbbox b').textContent);console.log('code',code);
 await tap(H,'[data-mb="on:ch:Wiatrak"]');
 const chs=['Byku','Ciotka','Pasterz'];
 for(let i=1;i<N;i++){const p=pages[i];await tap(p,'[data-a="start"]');await tap(p,'.mbmain');await p.fill('#mbcode',code);await tap(p,'[data-mb="on:join"]');await p.waitForTimeout(2500);console.log('join',i,await p.evaluate(()=>document.querySelector('#mbRoot').innerText.slice(0,200)),Object.keys(msgs).map(k=>k+':'+msgs[k].length));
  await tap(p,`[data-mb="on:slot:${i}"]`);await p.waitForTimeout(600);await tap(p,`[data-mb="on:ch:${chs[i-1]}"]`);await p.waitForTimeout(600)}
 await H.waitForTimeout(1500);await H.screenshot({path:SP+'/t2d/shots/mbo2.png'});
 await tap(H,'[data-mb="on:start"]');await H.waitForTimeout(1500);
 console.log('scr',await Promise.all(pages.map(p=>p.evaluate(()=>MB.G&&MB.G.scr+' slot '+MB.G.cur+' '+MB.G.heroes.map(h=>h.ch).join(',')))));
 for(let r=0;r<3;r++){
  for(const p of pages){if(r===1&&p===pages[1])continue;await tap(p,'[data-mb="ready"],[data-mb="skip"]');
   if(await p.$('[data-mb^="up:"]')){await tap(p,'[data-mb="up:0"]')}
   for(let ph=0;ph<3;ph++){if(!(await p.$('[data-mb="ok"]')))break;
     const act=ph===0?'move':'atk';await tap(p,`[data-mb="act:${act}"]`);
     const k=await p.evaluate(col=>{const g=[...document.querySelectorAll('.mbmap [data-mk]')].filter(e=>e.querySelector('polygon[stroke="'+col+'"]'));return g.length?g[Math.floor(g.length/2)].dataset.mk:null},act==='move'?'#5cff8a':'#ff6b5b');
     if(k){await p.evaluate(k=>document.querySelector(`[data-mk="${k}"]`).scrollIntoView({block:'center',inline:'center'}),k);await p.tap(`[data-mk="${k}"]`,{force:true});await p.waitForTimeout(250);const inf=await p.$('[data-mb="info"]');if(inf)await tap(p,'[data-mb="info"]')}
     else await tap(p,'[data-mb="act:stay"]');
     if(await p.evaluate(ph=>{const a=MB.G.plan[ph];return a.t==='move'?!a.m:a.d==null},ph))await tap(p,'[data-mb="act:stay"]');await tap(p,'[data-mb="ok"]');if(await p.$('.mbwarn'))await tap(p,'[data-mb="act:stay"]').then(()=>tap(p,'[data-mb="ok"]')).catch(()=>{})}}
 await H.waitForTimeout(r===1?12000:2500);
  console.log('round',r+1,JSON.stringify(await Promise.all(pages.map(p=>p.evaluate(()=>[MB.G.scr,MB.G.round,JSON.stringify(MB.G.heroes.map(h=>[h.pos,h.hp]))])))));}
 await pages[1].screenshot({path:SP+'/t2d/shots/mbo3.png'});
 const same=await Promise.all(pages.map(p=>p.evaluate(()=>JSON.stringify({h:MB.G.heroes.map(h=>[h.pos,h.hp,h.xp]),c:MB.G.creeps.map(c=>[c.pos,c.hp]),ch:MB.G.chests}))));
 console.log('in sync',same.every(x=>x===same[0]));
 console.log('errors',errs.join('|')||'none');await b.close()})().catch(e=>{console.log('FAILED',e.message.split('\n')[0]);process.exit(1)});
