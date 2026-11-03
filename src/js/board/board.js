/* ===================== Plansza: rysowanie pól i żetonów ===================== */
/* --- z części: js/000-start.js --- */
function zf(h,q,r){if(h.fill)return h.fill;if(zoneR(st.round)>=3)return '';return dist(q,r)>zoneR(st.round)?'color-mix(in srgb,#e0342b 50%,transparent)':'color-mix(in srgb,#2fbf5f 30%,transparent)'}
function lab(h){if(!h.t)return '';const a=[...String(h.t)],ids=a.filter(c=>INI[c]),rest=a.filter(c=>!INI[c]).join('');let o='';
 if(ids.length){const n=INI[ids[0]];o+='<circle r="19" fill="'+C[n].col+'"/><image href="'+IMG[n]+'" x="-17" y="-17" width="34" height="34" clip-path="url(#cp)" preserveAspectRatio="xMidYMid slice"/>'+(ids.length>1?'<text class="lbl" y="13">+'+(ids.length-1)+'</text>':'')}
 if(rest)o+='<text class="lbl" y="'+(ids.length?-14:0)+'">'+rest+'</text>';return o?'<g transform="scale(2)">'+o+'</g>':o}
function tok(g){const hl={};Object.entries(net.pl).forEach(([id,p])=>{const q=g(p);if(!q||!p.ch)return;const k=K(...q);hl[k]=hl[k]?{fill:hl[k].fill,t:hl[k].t+p.ch[0],stroke:'var(--hit)'}:{fill:C[p.ch].col,t:p.ch[0],stroke:id===net.uid?'var(--ink)':undefined}});return hl}
function pips(p,own,idx){return '<span class="hp" style="display:inline-flex">'+Array.from({length:MAXHP(p.ch||st.ch)},(_,i)=>i+1).map(n=>'<i '+(own?'data-hp="'+n+'" data-pi="'+(idx||0)+'" data-eff="'+p.hp+'" ':'')+'style="'+(n<=p.hp?'':'opacity:.2')+'"></i>').join('')+'</span>'}
function hTok(g){const hl={};H.p.forEach(p=>{const q=g(p);if(!q)return;const k=K(...q);hl[k]=hl[k]?{fill:hl[k].fill,t:hl[k].t+p.ch[0],stroke:'var(--hit)'}:{fill:C[p.ch].col,t:p.ch[0]}});return hl}
function othersOverlay(hl){const L=[];if(H)H.p.forEach((p,i)=>{if(i!==H.cur)L.push(p)});else if(net.db)Object.entries(net.pl).forEach(([id,p])=>{if(id!==net.uid)L.push(p)});L.forEach(p=>{const q=p.posr&&p.posr[st.round];if(!q||!p.ch||!alive(p,st.round))return;const k=K(...q),e=hl[k]||{};hl[k]=Object.assign({},e,{fill:'color-mix(in srgb,'+C[p.ch].col+' 60%,transparent)',t:(e.t||'')+p.ch[0]})})}
/* --- z części: V2: post-render, chipy, animacja z kamerą --- */
function cellC(c){return GEO[c[0]+','+c[1]].c}
/* --- z części: PSEUDO-3D: stojaki, podniesione pola, kamera --- */
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
/* --- z części: NOWE POSTACIE (Pasterz, Truchel, Sierżant Przemo) + PUNKTACJA --- */
/* --- akcje i interfejs planowania --- */
function nbCells(c){return D.map(([a,b])=>[c[0]+a,c[1]+b]).filter(([q,r])=>IN(q,r))}
function boardExtras(){try{const E=entState();let under='',over='';
 E.pud.forEach((p,i)=>{const g=GEO[p.k];if(!g)return;under+='<g transform="translate('+g.c[0]+','+(g.c[1]+8)+')" style="pointer-events:none">'+puddleSvg()+'</g>'});
 E.sheep.forEach(s=>{const g=GEO[K(...s.pos)];if(g)over+=sheepEl(s.o,g.c)});
 E.drone.forEach(d=>{const g=GEO[K(...d.pos)];if(g)over+=droneEl(d.o,g.c)});
 return {under,over}}catch(e){return {under:'',over:''}}}
function exAdd(h){const ex=document.getElementById('ex');if(ex)ex.insertAdjacentHTML('beforeend',h)}
function shPos(o,x,y){const e=document.getElementById('sh-'+o);if(e)e.setAttribute('transform','translate('+x.toFixed(1)+','+y.toFixed(1)+') scale('+(depthScale(y)*.95).toFixed(3)+')')}
