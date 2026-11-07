/* ===================== Online: ostrzeżenia o wersji gry i niezgodnych planach ===================== */
addRender('online/fair_bar',_r=>function(){_r.apply(this,arguments);try{
 const old=document.getElementById('fairBar');if(old)old.remove();if(H||!net.db||!net.code||!net.pl)return;
 const msgs=[];
 const others=Object.entries(net.pl).filter(([id,p])=>id!==net.uid&&p);
 if(others.some(([,p])=>p._v&&p._v!==GAME_VERSION))msgs.push('⚠ Ktoś w pokoju ma inną wersję gry. Wszyscy odświeżcie stronę, inaczej wyniki rund mogą się różnić.');
 const ch=Object.keys(net.cheat||{});if(ch.length)msgs.push('⚠ Plan gracza '+ch.map(id=>{const p=net.pl[id];return (p&&p.nick)||(p&&p.ch)||'?'}).join(', ')+' nie zgadza się z wcześniej zapisanym skrótem (zmiana planu po zatwierdzeniu wszystkich).');
 if(!msgs.length)return;const d=document.createElement('div');d.id='fairBar';d.className='err';d.textContent=msgs.join(' ');
 d.style.cssText='position:fixed;left:8px;right:8px;top:8px;z-index:9999;background:#7a1f1f;color:#fff;padding:8px 10px;border-radius:8px;font:13px/1.35 system-ui,sans-serif;box-shadow:0 2px 8px #0008';
 document.body.appendChild(d)}catch(e){}});
