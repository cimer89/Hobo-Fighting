/* --- Bitwa baz, część: rysowanie – plansza SVG, oprawa, minimapa. Części są fragmentami jednego domknięcia MB i muszą być sklejane w kolejności z manifestu. --- */
 /* ---------- rysowanie ---------- */
 function hexPts(r){let a=[];for(let i=0;i<6;i++){const t=Math.PI/180*(60*i-30);a.push((r*Math.cos(t)).toFixed(1)+','+(r*Math.sin(t)).toFixed(1))}return a.join(' ')}
 function bounds(){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;Object.values(G.cells).forEach(c=>{const [x,y]=px(c.p);x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)});return [x0-S,y0-S,x1-x0+2*S,y1-y0+2*S]}
 function mapSvg(team,hl){const vs=visSet(team),ks=knownSet(team),seen=G.seen[team],[bx,by,bw,bh]=bounds();let g='';const P=hexPts(S-1);
  Object.values(G.cells).sort((a,b)=>a.p[1]-b.p[1]).forEach(c=>{const k=K(...c.p),[x,y]=px(c.p),v=!!vs[k],sn=!!seen[k];
   let fill={g:'#4b5a3c',b:'#2f7a34',r:'#6f6a66',base:'#4b5a3c',w:'#2b5f8f'}[c.t];
   const h=hl&&hl[k];
   g+='<g transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')" data-mk="'+k+'">'+MBA.cell(c.t,sn,P,k,c);
   if(sn&&!v)g+=ks[k]?'<polygon points="'+P+'" fill="rgba(40,30,60,.38)"/><g opacity=".75"><path d="M-9,-1 q9,-9 18,0 q-9,9 -18,0z" fill="none" stroke="#fff" stroke-width="1.8"/><circle cy="-1" r="2.6" fill="#fff"/><path d="M-9,7 L9,-9" stroke="#fff" stroke-width="2" stroke-linecap="round"/></g>':'<polygon points="'+P+'" fill="rgba(5,6,10,.55)"/>';
   if(h)g+='<polygon points="'+hexPts(S-3)+'" fill="'+(h.f||'none')+'" stroke="'+(h.s||'none')+'" stroke-width="3"/>'+(h.t?'<text class="mbl" y="6">'+h.t+'</text>':'');
   g+='</g>'});
  // bazy
  ['A','B'].forEach(t=>{const b=G.bases[t],[x,y]=px(b.pos);const ba=MBA.base(t,b);if(ba){g+='<g transform="translate('+x+','+y+')">'+ba+'</g>';return}g+='<g transform="translate('+x+','+y+')"><polygon points="'+hexPts(S-2)+'" fill="'+TCOL[t]+'" fill-opacity=".35" stroke="'+TCOL[t]+'" stroke-width="3"/><path d="M-14,10 V-6 L-9,-12 L-4,-6 V-12 H4 V-6 L9,-12 L14,-6 V10 Z" fill="'+TCOL[t]+'" stroke="#111" stroke-width="2"/><rect x="-17" y="14" width="34" height="6" rx="3" fill="#111"/><rect x="-17" y="14" width="'+(34*b.hp/b.max).toFixed(1)+'" height="6" rx="3" fill="'+TCOL[t]+'"/><text class="mbs" y="-16">'+b.hp+'</text></g>'});
  // kałuże
  G.puddles.forEach(p=>{const k=K(...p.pos);if(!vs[k])return;const [x,y]=px(p.pos);const pa=MBA.puddle();g+='<g transform="translate('+x+','+y+')">'+(pa||'<ellipse rx="20" ry="12" fill="#8fe03a" fill-opacity=".55" stroke="#4f9a12" stroke-width="2"/>')+'</g>'});
  // skrzynki (pamięć drużyny)
  Object.entries(G.memChest[team]).forEach(([k,it])=>{const c=G.cells[k];if(!c)return;const [x,y]=px(c.p);const cha=MBA.chest(ITEMS[it].c);if(cha){g+='<g transform="translate('+x+','+y+')">'+cha+'</g>';return}g+='<g transform="translate('+x+','+y+')"><rect x="-11" y="-9" width="22" height="16" rx="3" fill="#8a5a2b" stroke="#2a180b" stroke-width="2"/><rect x="-11" y="-9" width="22" height="6" rx="2" fill="#b07a3c" stroke="#2a180b" stroke-width="2"/><circle cy="-1" r="3" fill="'+ITEMS[it].c+'"/></g>'});
  // stworki
  G.creeps.forEach(c=>{if(!c.alive)return;const k=K(...c.pos);if(!vs[k])return;const [x,y]=px(c.pos),big=c.ty==='boss',r=big?17:12;
   const ch0=curHero(),lv=CREEP[c.ty].lv,hl0=ch0?ch0.lvl:1,lc=lv<hl0?'#5cff8a':lv===hl0?'#ffe066':'#ff5a4a';g+='<g transform="translate('+x+','+y+')">'+(MBA.creep(big)||'<circle r="'+r+'" fill="'+(big?'#7a2e8a':'#8a6a4a')+'" stroke="#111" stroke-width="2"/><text class="mbs" y="5">'+(big?'M':'S')+'</text>')+'<g transform="translate('+(MBA.creep(big)?(big?18:15):r-2)+','+(MBA.creep(big)?(big?-38:-16):-r+2)+')"><circle r="8" fill="'+lc+'" stroke="#111" stroke-width="1.5"/><text class="mbs" style="font-size:9px;fill:#111;stroke:none" y="3">'+lv+'</text></g><rect x="-14" y="'+(MBA.creep(big)?17:r+3)+'" width="28" height="5" rx="2" fill="#111"/><rect x="-14" y="'+(MBA.creep(big)?17:r+3)+'" width="'+(28*c.hp/CREEP[c.ty].hp).toFixed(1)+'" height="5" rx="2" fill="#e0342b"/></g>'});
  // postacie
  G.heroes.forEach(h=>{if(!seesHero(team,h,vs))return;const [x,y]=px(h.pos),hid=cell(h.pos).t==='b'&&!h.rev;
   g+='<g transform="translate('+x+','+y+')"'+(h===curHero()?' class="mbme"':'')+' opacity="'+(hid&&h.team===team?.75:1)+'">'+(MBA.hero(h)||'<circle r="18" fill="'+TCOL[h.team]+'"/><image href="'+IMG[h.ch]+'" x="-15" y="-15" width="30" height="30" clip-path="url(#mbclip)" preserveAspectRatio="xMidYMid slice"/><circle r="15.5" fill="none" stroke="'+TCOL[h.team]+'" stroke-width="3"/>')
    +'<g transform="translate('+(MBA.hero(h)?'16,-44':'13,-13')+')"><circle r="7" fill="#f2c230" stroke="#111" stroke-width="1.5"/><text class="mbs" style="font-size:9px;fill:#111" y="3">'+h.lvl+'</text></g>'
    +'<rect x="-15" y="20" width="30" height="5" rx="2" fill="#111"/><rect x="-15" y="20" width="'+(30*Math.max(0,h.hp)/maxHp(h)).toFixed(1)+'" height="5" rx="2" fill="#4fc183"/>'+(hid?'<text class="mbs" y="-22" style="font-size:9px">ukryty</text>':'')+'</g>'});
  return '<svg class="mbmap" viewBox="'+[bx,by,bw,bh].map(v=>v.toFixed(0)).join(' ')+'" width="'+(bw*MBZ).toFixed(0)+'" height="'+(bh*MBZ).toFixed(0)+'"><defs><clipPath id="mbclip"><circle r="15"/></clipPath>'+MBA.defs()+'</defs>'+g+'</svg>'}


 /* ---------- oprawa rysunkowa ---------- */
 const MBA=(function(){let TX=null;
  function tex(){if(TX)return TX;const mk=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);return c.toDataURL('image/jpeg',0.86)};
   let sd=5;const rnd=()=>{sd=(sd*16807)%2147483647;return (sd-1)/2147483646};
   const gr=mk(128,128,(g,w,h)=>{g.fillStyle='#86c34f';g.fillRect(0,0,w,h);for(let i=0;i<70;i++){const x=rnd()*w,y=rnd()*h,r=6+rnd()*20,l=rnd()<.5;for(const dx of [-w,0,w])for(const dy of [-h,0,h]){const G2=g.createRadialGradient(x+dx,y+dy,0,x+dx,y+dy,r);G2.addColorStop(0,l?'rgba(165,216,100,.45)':'rgba(92,150,52,.4)');G2.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=G2;g.beginPath();g.arc(x+dx,y+dy,r,0,7);g.fill()}}
    for(let i=0;i<260;i++){const x=rnd()*w,y=rnd()*h,hh=3+rnd()*5;g.strokeStyle=rnd()<.6?'rgba(70,128,40,.6)':'rgba(195,235,125,.65)';g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x+rnd()*2-1,y-hh);g.stroke()}});
   const wa=mk(96,96,(g,w,h)=>{const G2=g.createLinearGradient(0,0,0,h);G2.addColorStop(0,'#3b9ee6');G2.addColorStop(1,'#2a82d0');g.fillStyle=G2;g.fillRect(0,0,w,h);g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=2;for(let i=0;i<9;i++){const x=rnd()*w,y=rnd()*h,l=8+rnd()*14;g.beginPath();g.moveTo(x-l,y);g.quadraticCurveTo(x,y-4,x+l,y);g.stroke()}});
   const fog=mk(64,64,(g,w,h)=>{g.fillStyle='#1b2029';g.fillRect(0,0,w,h);for(let i=0;i<24;i++){g.fillStyle='rgba(255,255,255,'+(0.02+rnd()*0.03)+')';g.beginPath();g.arc(rnd()*w,rnd()*h,4+rnd()*10,0,7);g.fill()}});
   TX={gr,wa,fog};return TX}
  const A=n=>(typeof MBART!=='undefined'&&MBART[n])||null,PR=n=>(typeof PROPS2D!=='undefined'&&PROPS2D[n])||null;
  const hsh=k=>{let h=0;for(const ch of k)h=(h*31+ch.charCodeAt(0))|0;return Math.abs(h)};
  function defs(){const t=tex();const ol=(id,c)=>'<filter id="'+id+'" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="1.4" result="d"/><feFlood flood-color="'+c+'"/><feComposite in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
   return '<pattern id="mbgr" patternUnits="userSpaceOnUse" width="64" height="64"><image href="'+t.gr+'" width="64" height="64"/></pattern><pattern id="mbwa" patternUnits="userSpaceOnUse" width="60" height="60"><image href="'+t.wa+'" width="60" height="60"/></pattern><pattern id="mbfog" patternUnits="userSpaceOnUse" width="40" height="40"><image href="'+t.fog+'" width="40" height="40"/></pattern>'+ol('mbolA',TCOL.A)+ol('mbolB',TCOL.B)}
  /* drzewo: rysunkowa korona z konturem, lekko losowana z klucza pola */
  function tree(k){const h=hsh(k),v=h%3,sc=(0.92+(h%5)*0.04).toFixed(2),dx=(h%7)-3,cs=[['#3f9a3a','#5cbf4a','#86d860'],['#357f34','#4fae43','#7ccc58'],['#4a9a2e','#6cbb3c','#9fd85a']][v];
   const o='stroke="#173214" stroke-width="2.4"';
   return '<ellipse cx="1" cy="13" rx="21" ry="6.5" fill="rgba(25,45,18,.38)"/><g transform="translate('+dx+',0) scale('+sc+')">'
    +'<path d="M-5,14 L-4,-4 L4,-4 L5,14 Q0,16 -5,14Z" fill="#7a4a24" '+o+'/><path d="M-1,10 L-1,-2" stroke="#5a3418" stroke-width="1.6"/>'
    +'<path d="M-22,-6 Q-26,-22 -12,-26 Q-12,-42 4,-40 Q18,-44 20,-28 Q30,-22 24,-8 Q22,4 6,0 Q-2,6 -10,1 Q-24,4 -22,-6Z" fill="'+cs[0]+'" '+o+'/>'
    +'<path d="M-14,-12 Q-17,-24 -6,-26 Q-4,-36 8,-33 Q17,-34 16,-22 Q22,-16 15,-9 Q6,-6 -2,-9 Q-10,-5 -14,-12Z" fill="'+cs[1]+'"/>'
    +'<path d="M-8,-24 Q-4,-31 3,-30 M7,-29 Q13,-28 13,-22" fill="none" stroke="'+cs[2]+'" stroke-width="3" stroke-linecap="round"/>'
    +(h%4===0?'<circle cx="10" cy="-14" r="2.6" fill="#e2463a" stroke="#173214" stroke-width="1.2"/><circle cx="-9" cy="-18" r="2.6" fill="#e2463a" stroke="#173214" stroke-width="1.2"/>':'')+'</g>'}
  /* ścieżka: ubita ziemia z kamyczkami */
  function path(k){const h=hsh(k);let p='<polygon points="'+hexPts(S-3)+'" fill="#c9a46a" stroke="#a9814a" stroke-width="2" stroke-dasharray="7 4" opacity=".95"/><polygon points="'+hexPts(S-9)+'" fill="#d8b77e" opacity=".8"/>';
   for(let i=0;i<4;i++){const a=((h>>(i*3))%360)*Math.PI/180,r=6+((h>>(i*2))%12);p+='<ellipse cx="'+(Math.cos(a)*r).toFixed(1)+'" cy="'+(Math.sin(a)*r*.8).toFixed(1)+'" rx="2.4" ry="1.6" fill="#9c7a4c"/>'}
   return p}
  /* obozowisko stworów: namiot z łat i ognisko */
  function camp(boss){return '<g transform="translate(-13,-10)"><path d="M-11,9 L0,-10 L11,9Z" fill="'+(boss?'#7a3d8c':'#9c6b3c')+'" stroke="#2a180b" stroke-width="2" stroke-linejoin="round"/><path d="M0,-10 L-3,9 L3,9Z" fill="#2a180b"/><rect x="3" y="-1" width="5" height="5" fill="#d9c27a" stroke="#2a180b" stroke-width="1"/></g>'
   +'<g transform="translate(15,12)"><path d="M-8,3 L8,-1 M-8,-1 L8,3" stroke="#5a3418" stroke-width="3.2" stroke-linecap="round"/><path class="mbfire" d="M0,-12 Q6,-5 3,1 Q0,3 -3,1 Q-6,-5 0,-12Z" fill="#ff9a2a" stroke="#b5401a" stroke-width="1.4"/><path d="M0,-6 Q2,-2 1,0 Q0,1 -1,0 Q-2,-2 0,-6Z" fill="#ffe36a"/></g>'}
  function cell(t,sn,P,k,c){if(!sn)return '<polygon points="'+P+'" fill="url(#mbfog)" stroke="#262c36" stroke-width="1.2"/>';
   c=c||{};let s='<polygon points="'+P+'" fill="'+(t==='w'?'url(#mbwa)':'url(#mbgr)')+'" stroke="rgba(250,240,175,.6)" stroke-width="1.4"/>';
   if(c.pa)s+=path(k);
   if(c.camp)s+=camp(c.camp===2);
   if(t==='b'&&c.tr){s+=tree(k);return s}
   if(t==='b'){const im=PR(hsh(k)%2?'bush':'bush2');s+=im?'<ellipse cx="1" cy="12" rx="20" ry="6" fill="rgba(30,50,20,.3)"/><image href="'+im+'" x="-25" y="-30" width="50" height="48"/>':'<path d="M-10,6 q4,-14 8,0 q4,-16 9,0 q3,-10 5,2" fill="none" stroke="#7fd36a" stroke-width="2.5" stroke-linecap="round"/>'}
   if(t==='r'){const im=PR('rock');s+=im?'<ellipse cx="1" cy="12" rx="21" ry="6" fill="rgba(30,40,20,.3)"/><image href="'+im+'" x="-25" y="-28" width="50" height="45"/>':'<path d="M-14,8 L-6,-10 L4,-4 L12,-12 L16,8 Z" fill="#8c8580" stroke="#3b3836" stroke-width="2"/>'}
   if(t!=='w'&&t!=='b'&&t!=='r'&&!c.pa&&!c.camp&&hsh(k)%7===0){const fl=PR('flowers');if(fl)s+='<image href="'+fl+'" x="'+(hsh(k)%2?4:-20)+'" y="2" width="16" height="14" opacity=".9"/>'}
   return s}
  function base(t,b){const im=A('base'+t);if(!im)return null;return '<polygon points="'+hexPts(S-2)+'" fill="'+TCOL[t]+'" fill-opacity=".28" stroke="'+TCOL[t]+'" stroke-width="3"/><ellipse cy="13" rx="24" ry="7" fill="rgba(20,30,15,.35)"/><image href="'+im+'" x="-30" y="-34" width="60" height="52"/><rect x="-18" y="18" width="36" height="6" rx="3" fill="#111"/><rect x="-18" y="18" width="'+(36*b.hp/b.max).toFixed(1)+'" height="6" rx="3" fill="'+TCOL[t]+'"/><text class="mbs" y="-30">'+b.hp+'</text>'}
  function chest(c){const im=A('chest');if(!im)return null;return '<ellipse cy="9" rx="13" ry="4" fill="rgba(20,30,15,.35)"/><image href="'+im+'" x="-15" y="-15" width="30" height="27"/><circle cx="11" cy="-11" r="4.5" fill="'+c+'" stroke="#111" stroke-width="1.2"/>'}
  function puddle(){const im=A('puddle');return im?'<image href="'+im+'" x="-24" y="-12" width="48" height="26" opacity=".95"/>':null}
  function creep(big){const im=A(big?'boss':'rats');if(!im)return null;return big?'<ellipse cy="13" rx="20" ry="6" fill="rgba(20,30,15,.35)"/><image href="'+im+'" x="-28" y="-46" width="56" height="62"/>':'<ellipse cy="11" rx="17" ry="5" fill="rgba(20,30,15,.35)"/><image href="'+im+'" x="-22" y="-20" width="44" height="34"/>'}
  function hero(h){const set=(typeof SPR2D!=='undefined')&&SPR2D[h.ch];if(!set)return null;const im=set[6]||set[0];
   return '<ellipse class="mbring" cy="13" rx="17" ry="6" fill="rgba(20,30,15,.35)" stroke="'+TCOL[h.team]+'" stroke-width="2.5"/><image href="'+im+'" x="-24" y="-50" width="48" height="66" preserveAspectRatio="xMidYMax meet" filter="url(#mbol'+h.team+')"/>'}
  return {defs,cell,base,chest,puddle,creep,hero}})();
 const MBZ=1.3;
 /* ---------- ekrany ---------- */
 const curHero=()=>G&&G.scr==='plan'?G.heroes[G.cur]:null;
 function miniMap(m,big){const s=7,sq=Math.sqrt(3);let g='',x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;const col={'p':'#b08a55','T':'#1d5424','.':'#4b5a3c','*':'#2f7a34','#':'#77706b','w':'#2b6fa8','?':'#b07a3c','c':'#8a6a4a','C':'#7a2e8a','A':'#3e8ef7','B':'#ef4a3c'};
  mapCells(m,big).forEach(({a,ch})=>{const x=s*sq*(a[0]+a[1]/2),y=s*1.5*a[1];x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);g+='<polygon transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')" points="'+hexPts(s-.6)+'" fill="'+(col[ch]||'#4b5a3c')+'"/>'});
  return '<svg viewBox="'+(x0-s)+' '+(y0-s)+' '+(x1-x0+2*s)+' '+(y1-y0+2*s)+'">'+g+'</svg>'}

