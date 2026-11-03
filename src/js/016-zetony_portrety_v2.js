/* ===================== ŻETONY-PORTRETY v2 ===================== */
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
const _hopPrev={};
function hopSet(id,k){const e=document.querySelector('#tk-'+id+' .hop');if(e)e.setAttribute('transform','translate(0,'+(-k*32).toFixed(1)+')');
 const s=document.querySelector('#tk-'+id+' .sh');if(s)s.setAttribute('opacity',(.5-.28*k).toFixed(2));
 if(k===0&&(_hopPrev[id]||0)>.15)tkFx(id,'land',360);_hopPrev[id]=k}
function tkFx(id,cls,ms){const g=document.querySelector('#tk-'+id+' .tkA');if(!g)return;g.classList.remove(cls);void g.getBoundingClientRect();g.classList.add(cls);if(ms)setTimeout(()=>g.classList.remove(cls),ms)}
function idByName(s){const o=(st.animItems||[]).find(o=>o.q.ch&&s.startsWith(o.q.ch));return o?o.id:null}
const _capSetT=capSet;capSet=function(t){_capSetT(t);if(!t||!st.animating)return;const s=String(t);
 if(/atakuje|szarżuje|wysyła drona|tworzy kałużę|szarża owcy|przywołuje owcę/.test(s)){const id=idByName(s);if(id)tkFx(id,'atk',460)}
 if(/ odpada/.test(s)){const id=idByName(s);if(id)tkFx(id,'ko',0)}
 if(/−\d/.test(s))s.split(',').forEach(part=>{const id=idByName(part.trim());if(id)tkFx(id,'hurt',480)})};
render();
