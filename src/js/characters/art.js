/* ===================== Postacie: grafika dodatków (owca, dron, kałuża, stojaki) ===================== */
/* --- z części: NOWE POSTACIE (Pasterz, Truchel, Sierżant Przemo) + PUNKTACJA --- */
/* --- elementy na planszy: owca, kałuże, dron --- */
function sheepArt(){return '<ellipse cx="3" cy="22" rx="30" ry="9" fill="#000" opacity=".4" filter="url(#bl)"/><g class="ibob"><circle cx="-14" cy="-4" r="17" fill="#f7f7f2" stroke="#555" stroke-width="3"/><circle cx="4" cy="-14" r="19" fill="#f7f7f2" stroke="#555" stroke-width="3"/><circle cx="20" cy="-2" r="17" fill="#f7f7f2" stroke="#555" stroke-width="3"/><circle cx="2" cy="6" r="19" fill="#f7f7f2" stroke="#555" stroke-width="3"/><ellipse cx="-32" cy="2" rx="11" ry="13" fill="#3a3a3a"/><circle cx="-35" cy="-1" r="3" fill="#fff"/><rect x="-14" y="16" width="6" height="12" fill="#3a3a3a"/><rect x="12" y="16" width="6" height="12" fill="#3a3a3a"/></g>'}
function sheepEl(o,c,isNew){return '<g id="sh-'+o+'" transform="translate('+c[0].toFixed(1)+','+c[1].toFixed(1)+') scale('+(depthScale(c[1])*.95).toFixed(3)+')" style="pointer-events:none"><g'+(isNew?' class="newi"':'')+'>'+sheepArt()+'</g></g>'}
function puddleSvg(){return '<g class="pud"><ellipse rx="52" ry="28" fill="#8fe03a" fill-opacity=".6" stroke="#4a7c10" stroke-width="3"/><ellipse rx="32" ry="16" fill="#b6f25c" fill-opacity=".55"/><circle cx="-20" cy="-4" r="6" fill="#e1ffa8"/><circle cx="16" cy="7" r="5" fill="#e1ffa8"/><circle cx="26" cy="-8" r="3.5" fill="#e1ffa8"/></g>'}
function droneArt(){return '<g class="ibob"><ellipse cx="3" cy="44" rx="22" ry="7" fill="#000" opacity=".35" filter="url(#bl)"/><rect x="-18" y="-8" width="36" height="18" rx="7" fill="#4b5058" stroke="#111" stroke-width="3"/><circle cx="0" cy="1" r="5" fill="#ff5a4f"/><ellipse cx="-26" cy="-12" rx="17" ry="4" fill="#cfd3da" stroke="#111" stroke-width="2"/><ellipse cx="26" cy="-12" rx="17" ry="4" fill="#cfd3da" stroke="#111" stroke-width="2"/></g>'}
function droneEl(o,c){return '<g id="dr-'+o+'" transform="translate('+c[0].toFixed(1)+','+(c[1]-76).toFixed(1)+') scale('+depthScale(c[1]).toFixed(3)+')" style="pointer-events:none">'+droneArt()+'</g>'}
/* --- z części: ŻETONY-PORTRETY v2 --- */
function standee(ch,delay){
 const col=C[ch].col,dk=shade(col,-.55),lt=shade(col,.45),tm=(typeof teamOfCh==='function')?teamOfCh(ch):null,D='#140d07';
 let studs='';for(let i=0;i<10;i++){const a=i/10*Math.PI*2+.31;studs+='<circle cx="'+(Math.cos(a)*31.2).toFixed(1)+'" cy="'+(-20+Math.sin(a)*31.2).toFixed(1)+'" r="1.6" fill="'+lt+'" stroke="'+D+'" stroke-width=".6"/>'}
 const base='<g class="gnd"><ellipse class="sh" cx="5" cy="22" rx="38" ry="12" fill="#000" opacity=".5" filter="url(#bl)"/>'
  +(tm?'<ellipse cx="0" cy="17" rx="40" ry="15" fill="none" stroke="'+TCOL[tm]+'" stroke-width="6"/>':'')
  +'<ellipse cx="0" cy="21" rx="32" ry="10.5" fill="'+D+'"/><rect x="-32" y="12" width="64" height="9" fill="url(#tkSide)"/><rect x="-32" y="12" width="64" height="9" fill="'+dk+'" fill-opacity=".55"/>'
  +'<ellipse cx="0" cy="12" rx="32" ry="10.5" fill="'+col+'" stroke="'+D+'" stroke-width="2"/><ellipse cx="0" cy="12" rx="24" ry="7.5" fill="'+dk+'" fill-opacity=".45"/><ellipse cx="0" cy="11" rx="24" ry="7.5" fill="none" stroke="'+lt+'" stroke-opacity=".6" stroke-width="1.2"/>'
  +'<path d="M-29,15 A32,10.5 0 0 0 29,15" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2"/></g>';
 const med='<rect x="-5" y="0" width="10" height="13" rx="2" fill="'+dk+'" stroke="'+D+'" stroke-width="1.5"/>'
  +'<circle cx="1.5" cy="-16.5" r="34" fill="'+D+'"/><circle cx="1" cy="-17.5" r="33.5" fill="'+dk+'"/>'
  +'<circle cx="0" cy="-20" r="33.5" fill="'+col+'"/><circle cx="0" cy="-20" r="33.5" fill="url(#tkRim)"/>'
  +studs
  +'<circle cx="0" cy="-20" r="28.6" fill="'+D+'"/>'
  +'<image href="'+IMG[ch]+'" x="-28" y="-48" width="56" height="56" clip-path="url(#cpk)" preserveAspectRatio="xMidYMid slice"/>'
  +'<circle cx="0" cy="-20" r="27.4" fill="url(#tkVig)"/>'
  +'<circle cx="0" cy="-20" r="27.6" fill="none" stroke="'+(tm?TCOL[tm]:lt)+'" stroke-width="'+(tm?3:1.6)+'"/>'
  +'<circle cx="0" cy="-20" r="33.5" fill="none" stroke="'+D+'" stroke-width="2.2"/>'
  +'<path d="M-22,-36 A27,27 0 0 1 4,-46.5" stroke="#fff" stroke-opacity=".5" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="-24" cy="-31" r="1.8" fill="#fff" fill-opacity=".7"/>'
  +(tm?'<g transform="translate(26,-46)"><circle r="11.5" fill="'+TCOL[tm]+'" stroke="#fff" stroke-width="2.5"/><text y="5" text-anchor="middle" font-size="14" font-weight="900" fill="#fff" style="font-family:system-ui,sans-serif">'+tm+'</text></g>':'');
 return '<g class="in">'+base+'<g class="hop"><g class="md" style="animation-delay:'+delay+'s"><g class="tkA">'+med+'</g></g></g></g>'}
