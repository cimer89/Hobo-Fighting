/* Test tajnych planów (online/commit.js): skrót, ujawnienie, wykrycie podmiany. node tests/commit_test.js */
global.window=globalThis;const fs=require('fs');
eval(fs.readFileSync(__dirname+'/../src/js/online/commit.js','utf8').replace("const GAME_VERSION","var GAME_VERSION").replace("const Commit","global.Commit"));
(async()=>{let pass=0,fail=0;const t=(n,c)=>{if(c)pass++;else{fail++;console.log('✗',n)}};
 const plan=[{t:'move',m:[1,0],d:null},{t:'atk',m:null,d:3}];
 const a=await Commit.seal('k1',plan);t('skrót SHA-256 ma 64 znaki',a.h.length===64);
 const b=await Commit.seal('k1',plan);t('ten sam plan = ten sam skrót',a.h===b.h);
 const c=await Commit.seal('k2',plan);t('inny klucz (gracz/runda) = inny skrót',c.h!==a.h);
 let flagged=[];const done=()=>new Promise(r=>setTimeout(r,50));
 Commit.lock('k1',a.h);Commit.verify('k1',JSON.parse(JSON.stringify(plan)),a.salt,a.h,k=>flagged.push(k));await done();t('poprawne ujawnienie przechodzi',flagged.length===0);
 /* podmiana planu po zamrożeniu skrótu */
 const a4=await Commit.seal('k4',plan);Commit.lock('k4',a4.h);
 const p2=[{t:'move',m:[0,0],d:null},{t:'atk',m:null,d:3}];const a5=await Commit.seal('k4',p2);
 Commit.verify('k4',p2,a5.salt,a5.h,k=>flagged.push(k));await done();t('podmiana po zatwierdzeniu wszystkich jest wykryta',flagged.includes('k4'));
 Commit.verify('k3',plan,'zla-sol',a.h,k=>flagged.push(k));await done();t('zła sól jest wykryta',flagged.includes('k3'));
 console.log('testy tajnych planów:',pass,'zaliczone,',fail,'niezaliczone');process.exit(fail?1:0)})();
