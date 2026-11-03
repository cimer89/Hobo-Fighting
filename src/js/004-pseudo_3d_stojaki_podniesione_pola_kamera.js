/* ===================== PSEUDO-3D: stojaki, podniesione pola, kamera ===================== */
function shade(hex,f){const n=parseInt(hex.slice(1),16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;const m=v=>Math.max(0,Math.min(255,Math.round(v*(1+f))));return 'rgb('+m(r)+','+m(g)+','+m(b)+')'}
function depthScale(y){return 1.2+.2*Math.max(0,Math.min(1,(y-170)/620))}
function board(hl,onlyStart){
 let g='';const toks=[];
 cells.forEach(([q,r])=>{
  const [x,y]=px(q,r),k=K(q,r),h=hl[k]||{};
  const a=h.t?[...String(h.t)]:[],ids=a.filter(c=>INI[c]),rest=a.filter(c=>!INI[c]).join('');
  const lift=!!h.stroke,zfv=zf(h,q,r);
  g+='<g data-k="'+k+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')" style="cursor:pointer">'+(lift?'<polygon class="wall" points="'+GEO[k].p+'"/>':'')+'<polygon class="hexp'+(lift?' lift':'')+'" points="'+GEO[k].p+'" '+(zfv?'style="fill:'+zfv+(String(h.fill).startsWith('#')?';fill-opacity:.4':'')+'" ':'')+(h.stroke?'stroke="'+h.stroke+'" stroke-width="6"':'')+'/>'+(rest?'<g transform="translate(0,'+(lift?-8:0)+') scale(2)"><text class="lbl" y="'+(ids.length?-14:0)+'">'+rest+'</text></g>':'')+'</g>';
  if(ids.length){const n=INI[ids[0]];toks.push({y,svg:'<g transform="translate('+x.toFixed(1)+','+y.toFixed(1)+') scale('+depthScale(y).toFixed(3)+')" style="pointer-events:none">'+standee(n,(toks.length*.37).toFixed(2))+(ids.length>1?'<g transform="translate(28,-46)"><circle r="14" fill="#000" stroke="#fff" stroke-width="2"/><text class="lbl2" style="font-size:18px;stroke-width:0" y="1" dominant-baseline="middle">+'+(ids.length-1)+'</text></g>':'')+'</g>'})}
 });
 toks.sort((a,b)=>a.y-b.y);const itm=boardItems().map(itemSvg).join('');const ext=boardExtras();
 BOARD_SVG='<svg class="bd" viewBox="'+(window.bdVB?bdVB():'62 40 870 900')+'" role="img" aria-label="Plansza 37 heksów"><image href="'+BG+'" x="-17" y="0" width="1024" height="1024"/><defs><clipPath id="cp"><circle r="17"/></clipPath><clipPath id="cpm"><circle cx="0" cy="-20" r="28"/></clipPath><clipPath id="cpk"><circle cx="0" cy="-20" r="27.6"/></clipPath><linearGradient id="tkRim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient><radialGradient id="tkVig" cx=".5" cy=".42" r=".55"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient><linearGradient id="tkSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset=".35" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></linearGradient><filter id="bl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter></defs>'+g+ext.under+itm+toks.map(t=>t.svg).join('')+ext.over+'</svg>';return ''}
function zsort(){const ov=document.getElementById('ov');if(!ov||!ov.parentNode)return;const par=ov.parentNode;const t=[...par.querySelectorAll(':scope>[id^="tk-"]')];const ord=t.map(e=>({e,y:(st.curPos[e.id.slice(3)]||[0,0])[1]})).sort((a,b)=>a.y-b.y);const same=ord.every((o,i)=>o.e===t[i]);if(same)return;ord.forEach(o=>par.insertBefore(o.e,ov))}
function tokMove(id,x,y){st.curPos[id]=[x,y];const el=document.getElementById('tk-'+id);if(el)el.setAttribute('transform','translate('+x.toFixed(1)+','+y.toFixed(1)+') scale('+depthScale(y).toFixed(3)+')');zsort()}
function cam(px,s){const v=document.querySelector('#stage svg');if(!v)return;const p=px||[495,512];v.style.transformOrigin=((p[0]-62)/870*100)+'% '+((p[1]-40)/900*100)+'%';v.style.transition='transform .65s cubic-bezier(.2,.8,.2,1)';v.style.transform=(s&&s>1)?'perspective(900px) rotateX(9deg) scale('+s+')':'none'}
function animView(items){
 board({});const base=BOARD_SVG;let toks='';st.animHp={};
 const arr=items.filter(o=>st.curPos[o.id]&&o.q.ch).sort((a,b)=>st.curPos[a.id][1]-st.curPos[b.id][1]);
 arr.forEach((o,ix)=>{const p=st.curPos[o.id];
  const hp=(o.q.hpr&&o.q.hpr[st.round]!==undefined)?o.q.hpr[st.round]:5;st.animHp[o.id]=hp;
  toks+='<g id="tk-'+o.id+'" transform="translate('+p[0].toFixed(1)+','+p[1].toFixed(1)+') scale('+depthScale(p[1]).toFixed(3)+')">'+standee(o.q.ch,(ix*.37).toFixed(2))+'<g transform="translate(0,-72)"><rect x="-34" y="-5" width="68" height="10" rx="5" fill="#000" fill-opacity=".7" stroke="#fff" stroke-opacity=".5" stroke-width="2"/><rect id="hpf-'+o.id+'" class="hpf" x="-34" y="-5" width="68" height="10" rx="5" fill="'+(hp>2?'#4fc183':hp>1?'#f0a020':'#e0342b')+'" style="transform:scaleX('+hp/MAXHP(o.q.ch)+')"/></g></g>'});
 BOARD_SVG=base.replace('</svg>',toks+'<g id="ex"></g><g id="ov"></g></svg>');
 return '<div class="card" id="cap" style="text-align:center;font-weight:700">'+(st.capText||'')+'</div><div id="pop" class="pop"></div><button class="go" data-a="skip">Pomiń animację</button>'}
render();
