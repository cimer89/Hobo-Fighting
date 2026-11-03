/* ===================== OWCA vs BYKU, KIJ PASTERSKI ===================== */
(function(){let s=sim.toString();const rep=(a,b)=>{if(s.split(a).length!==2)throw new Error('sim2: '+a);s=s.replace(a,b)};
 // owca zawsze zostaje tam, gdzie skończyła szarżę
 rep("s.pos=victims.length?cur.slice():from.slice();","s.pos=cur.slice();");
 rep(",back:!victims.length});","});");
 rep("const planOf=i=>L[i].plan[ph]||null;","const planOf=i=>L[i].plan[ph]||null;const CLASH=new Set();");
 // szarża Byka zderza się z owcą
 rep("let cur=x.pos.slice(),hitCell=null,steps=0;","let cur=x.pos.slice(),hitCell=null,steps=0,shCl=null;");
 rep("if(!IN(nq,nr))break;cur=[nq,nr];steps++;\n    if(S.some(","if(!IN(nq,nr))break;cur=[nq,nr];steps++;\n    shCl=SHP.find(z=>z.alive&&z.o!==i&&!ally(i,z.o)&&z.pos[0]===nq&&z.pos[1]===nr)||null;if(shCl)break;\n    if(S.some(");
 rep("ev.push({k:'charge',id:x.id,from,to:cur.slice(),steps,hit:victims.length>0,dir:a.d,bd:extra>0});\n   x.pos=cur.slice();",
     "ev.push({k:'charge',id:x.id,from,to:cur.slice(),steps,hit:victims.length>0||!!shCl,dir:a.d,bd:extra>0});\n   x.pos=cur.slice();"
     +"if(shCl){killSheep(shCl);CLASH.add(shCl.o);const sa=planOf(shCl.o);if(sa&&sa.t==='atk'&&S[shCl.o].ch==='Pasterz'&&sa.d===(a.d+3)%6){ev.push({k:'hit',id:x.id,ph});dmg(i,TB()?2:1,'zderzenie z owcą',shCl.o)}}");
 rep("const s=sheepOf(i);if(!s){ev.push({k:'scharge',id:x.id,none:true});return}","const s=sheepOf(i);if(!s){if(!CLASH.has(i))ev.push({k:'scharge',id:x.id,none:true});return}");
 // kij pasterski (Testy): 2 pola przed sobą, 2 DMG, przebija
 const a="\n  const pnd=[];";
 rep(a,"\n  S.forEach((x,i)=>{const a=planOf(i);if(x.out||!a||a.t!=='staff'||x.ch!=='Pasterz')return;"
  +"const dd=D[a.d],extra=(a.bd||x.dmgb)?1:0,cs=[],hs=[];for(let k=1;k<=2;k++){const q=x.pos[0]+dd[0]*k,r=x.pos[1]+dd[1]*k;if(!IN(q,r))break;cs.push([q,r]);"
  +"SHP.forEach(z=>{if(z.alive&&z.o!==i&&!ally(i,z.o)&&z.pos[0]===q&&z.pos[1]===r)killSheep(z)});"
  +"S.forEach((y,j)=>{if(j!==i&&!ally(i,j)&&!y.out&&y.pos[0]===q&&y.pos[1]===r)hs.push(j)})}"
  +"ev.push({k:'atk',id:x.id,ch:x.ch,ph,from:x.pos.slice(),cells:cs,end:cs.length?cs[cs.length-1]:x.pos.slice(),hit:hs.length>0,line:false,bd:extra>0});"
  +"hs.forEach(j=>{if(ph===1)ev.push({k:'hit',id:S[j].id,ph});dmg(j,2+extra,'kij pasterski',i)});if(hs.length>=2)x.pts.m+=hs.length-1;if(hs.length&&x.dmgb){x.dmgb=false;x.dmgbUsed=true}});"+a);
 sim=(0,eval)('('+s+')')})();
/* planowanie: kij */
const _adP=actDefs;actDefs=function(ch,ph){const d=_adP(ch,ph);if(TB()&&ch==='Pasterz')return d.concat([{t:'staff',l:'Kij'}]);return d};
const _okP=planOk;planOk=function(pl,ph){if(pl.t==='staff')return pl.d!==null;return _okP(pl,ph)};
const _tapP=planTap;planTap=function(pl,q,r,from,i){if(pl.t==='staff'){if(i>=0)pl.d=i;return}return _tapP(pl,q,r,from,i)};
const _hintP=planHint;planHint=function(pl,ph){if(pl.t==='staff')return pl.d===null?'Kij pasterski: dotknij pola obok, by wybrać kierunek.':'Kij: '+DN[pl.d]+' (2 pola, 2 DMG każdemu na nich).';return _hintP(pl,ph)};
const _hlP=extraHL;extraHL=function(hl,pl,from,ph){if(pl.t==='staff'){if(pl.d===null){nbCells(from).forEach(c=>{hl[K(...c)]={stroke:'var(--hit)'}});return}
 for(let k=1;k<=2;k++){const q=from[0]+D[pl.d][0]*k,r=from[1]+D[pl.d][1]*k;if(IN(q,r))hl[K(q,r)]={fill:'color-mix(in srgb,var(--hit) 45%,transparent)',stroke:'var(--hit)',t:'2'}}return}return _hlP(hl,pl,from,ph)};
const _atP=actTxt;actTxt=function(ch,x,pos,ph){if(x.t==='staff')return 'kij '+DN[x.d];return _atP(ch,x,pos,ph)};
TBTXT['Pasterz']='Zaczyna z owcą obok. Owca (1 HP): ruch, szarża 2 DMG przez całą linię. Kij: 2 pola przed sobą, 2 DMG każdemu. 7 HP.';
/* przykłady */
(function(){const oP=DEMOS['Pasterz'];DEMOS['Pasterz']=()=>{const l=oP();if(!TB())return l;
 l.splice(1,0,{t:'Kij',d:'Kij pasterski: 2 pola przed Pasterzem, 2 DMG każdemu, kto na nich stoi.',T:4400,run(a){a.tok('h','hero',DH).tok('f0','foe',N(DH,2)).tok('f1','foe',N(DH,2,2));
  dmAt(300,()=>{a.mark(dmNb(DH),'opt');a.cap('Wybierz kierunek: pole obok siebie.')});
  dmAt(1400,()=>{a.clear();a.mark([N(DH,2),N(DH,2,2)],'hit',['2','2']);a.cap('Kij sięga 2 pola przed siebie…')});
  dmAt(2200,()=>{a.act('h','swing');a.dmg('f0','−2');a.dmg('f1','−2');a.cap('…i bije <b>każdego</b> na tych polach: 2 DMG.')})}});
 return l};
 const oB=DEMOS['Byku'];DEMOS['Byku']=()=>{const l=oB();l.splice(2,0,{t:'Zderzenie z owcą',tag:'faza II',d:'Gdy Byku szarżuje na owcę, zatrzymuje się na jej polu, a owca ginie. Jeśli owca szarżowała naprzeciw niego, Byku też dostaje obrażenia.',T:4600,run(a){const s0=N(DH,2,3);a.tok('h','hero',DH).tok('s','sheep',s0);
  dmAt(300,()=>{a.mark([N(DH,2),N(DH,2,2),s0],'hit');a.cap('Byku i owca szarżują na siebie…')});
  dmAt(1300,()=>{a.clear();a.mv('h',s0,'fast',[-6,3])});
  dmAt(1700,()=>{a.dmg('s','−1');a.gone('s');a.dmg('h',TB()?'−2':'−1');a.cap('<b>Zderzenie!</b> Owca ginie, Byku zostaje na miejscu uderzenia i dostaje obrażenia od owcy.')})}});return l}})();
render();
