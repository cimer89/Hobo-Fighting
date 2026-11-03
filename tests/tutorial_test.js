/* Przejście całego samouczka tak, jak zrobiłby to gracz: zawsze dotyka tego, co pokazuje trener.
   node tests/tutorial_test.js <plik.html> [katalog_zrzutów] */
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true,isMobile:true});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await c.route(/^https?:\/\//,r=>r.abort());await p.goto('file://'+process.argv[2]);await p.waitForTimeout(1500);const SH=process.argv[3];if(SH)fs.mkdirSync(SH,{recursive:true});
 const tap=async s=>{await p.tap(s,{timeout:8000,force:true});await p.waitForTimeout(450)};
 await tap('[data-a="start"]');await tap('[data-tutstart]');
 const results=[];let shot=0;
 for(let guard=0;guard<160;guard++){
  const st=await p.evaluate(()=>{const c=document.getElementById('tutCoach');if(!c)return {gone:true};
   const ring=document.querySelector('.tutRing:not(.ghost)');let target=null;
   if(ring){const r=ring.getBoundingClientRect();target={x:r.left+r.width/2,y:r.top+r.height/2}}
   return {title:c.querySelector('.tt').innerText,txt:c.querySelector('.tm').innerText,cls:c.className,go:!!c.querySelector('[data-tut="next"]'),target}});
  if(st.gone)break;
  if(st.cls==='ok'||st.cls==='bad'){results.push((st.cls==='ok'?'✓ ':'✗ ')+st.title.split('\n')[0]+' — '+st.txt.slice(0,90).replace(/\n/g,' '));if(SH)await p.screenshot({path:SH+'/tut_'+(++shot)+'.png'});
   await p.evaluate(()=>{const r=document.getElementById('rsum');if(r)r.remove()});
   if(st.go)await tap('#tutCoach [data-tut="next"]');else{results.push('  (powtórka)');await tap('#tutCoach [data-tut="again"]')}continue}
  if(st.target){if(SH&&guard<3)await p.screenshot({path:SH+'/tut_start_'+guard+'.png'});await p.touchscreen.tap(st.target.x,st.target.y);await p.waitForTimeout(700);continue}
  await p.waitForTimeout(600)}
 console.log(results.join('\n'));console.log('koniec:',await p.evaluate(()=>st.scr+' tut='+!!(typeof H!=='undefined'&&H&&H.tut)+' done='+localStorage.getItem('hf_tut_done')));
 console.log('errors',errs.join('|')||'none');await b.close()})().catch(e=>{console.log('FAILED',e.message);process.exit(1)});
