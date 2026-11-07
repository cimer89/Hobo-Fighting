/* ===================== V2: post-render, chipy, animacja z kamerą ===================== */
const NS2='http://www.w3.org/2000/svg';
(function(){if(!document.getElementById('bgfx')&&document.body){const d=document.createElement('div');d.id='bgfx';d.style.backgroundImage='url('+SPLURI+')';document.body.appendChild(d)}})();
addRender('fx/anim_init',_r4=>function(){_r4();v2post()});
addClick('fx/anim_init',document,function(e){if(navigator.vibrate&&e.target.closest&&e.target.closest('button:not(:disabled),[data-k]'))navigator.vibrate(8)},true);

/* --- animacja --- */
const EASE=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
render();
