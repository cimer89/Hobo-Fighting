/* ===================== ONLINE: maks. 6 graczy w pokoju ===================== */
(function(){const MAXON=6;
 function toast(t){const d=document.createElement('div');d.style.cssText='position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);z-index:9999;background:linear-gradient(#5a3a1f,#3b2412);border:3px solid #1a0f06;border-radius:16px;padding:14px 18px;color:#fff;font:700 15px system-ui;text-align:center;max-width:320px;box-shadow:0 8px 0 #1a0f06';d.innerHTML=t;document.body.appendChild(d);d.addEventListener('click',()=>d.remove());setTimeout(()=>d.remove(),4500)}
 addRender('online/max6',_r=>function(){_r.apply(this,arguments);try{
  app.querySelectorAll('[data-tm="ffa"] small').forEach(e=>{if(/2–5 graczy/.test(e.textContent))e.textContent=e.textContent.replace('2–5 graczy','2–6 graczy online (do 5 na jednym telefonie)')});
  if(!net.code){net._capOk=false;return}
  /* pełny pokój: sprawdzane raz po dołączeniu, gdy znamy listę graczy */
  if(!net._capOk&&!H&&net.pl&&(typeof P2P==='undefined'||!net.p2p||P2P.ready)){const ids=Object.keys(net.pl);if(!ids.length)return;net._capOk=true;
   const others=ids.filter(id=>id!==net.uid).length;
   if(others>=MAXON){const code=net.code;try{if(net.p2p)P2P.reset()}catch(e){}net.code=null;try{goMenu()}catch(e){}
    setTimeout(()=>toast('<span style="font:400 26px Bangers,Impact,sans-serif;color:#ffd84a">POKÓJ PEŁNY</span><br>W pokoju '+code+' gra już '+MAXON+' graczy (maksimum). Załóż nowy pokój.'),120)}}
 }catch(e){console.warn('online6',e)}});
})();

