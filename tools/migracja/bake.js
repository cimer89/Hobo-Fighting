/* Etap 3: „wypieka” łaty działające przez podmianę tekstu funkcji (toString + eval).
   Ostateczny tekst każdej łatanej funkcji (odczytany z działającej gry) trafia wprost do jej deklaracji,
   a kod łatający jest usuwany. Po zbudowaniu tekst wszystkich funkcji ma być identyczny jak przedtem.
   node tools/bake.js <zbudowany.html> */
const {chromium}=require('playwright');const fs=require('fs');const {load}=require('../srcmap');
(async()=>{
 const b=await chromium.launch();const ctx=await b.newContext();await ctx.route(/^https?:\/\//,r=>r.abort());const p=await ctx.newPage();
 await p.goto('file://'+process.argv[2]);await p.waitForTimeout(1200);
 const FIN=await p.evaluate(()=>({sim:sim.toString(),revCore:revCore.toString(),scoreTable:scoreTable.toString(),waitH:waitH.toString(),cwaitH:cwaitH.toString(),
  demo:{'Truchel':DEMOS['Truchel'].toString(),'Sierżant Przemo':DEMOS['Sierżant Przemo'].toString(),'Ciotka':DEMOS['Ciotka'].toString()}}));
 await b.close();
 const {files,text,ast,walk,fileOf,ROOT}=load('github');
 const edits=[];/* [start,end,replacement] w pozycjach całego tekstu */
 const top=n=>ast.body.find(s=>s.type==='FunctionDeclaration'&&s.id.name===n);
 for(const n of ['sim','revCore','scoreTable','waitH','cwaitH']){const d=top(n);if(!d)throw new Error('brak deklaracji '+n);
  if(!FIN[n].startsWith('function '+n+'('))throw new Error('nieoczekiwany tekst '+n);edits.push([d.start,d.end,FIN[n]])}
 /* runAnim: jedyna łata tekstowa to wstawienie S2D.ev(e) (JS String.replace – pierwsze wystąpienie) */
 {const d=ast.body.find(s=>s.type==='FunctionDeclaration'&&s.id.name==='runAnim');const t=text.slice(d.start,d.end);const a='const e=ev[i];';
  if(!t.includes(a))throw new Error('runAnim');edits.push([d.start,d.end,t.replace(a,'const e=ev[i];try{S2D.ev(e)}catch(_){}')])}
 /* DEMOS: wartości właściwości */
 {const d=ast.body.find(s=>s.type==='VariableDeclaration'&&s.declarations[0].id.name==='DEMOS');const obj=d.declarations[0].init;
  for(const [k,v] of Object.entries(FIN.demo)){const pr=obj.properties.find(x=>(x.key.value||x.key.name)===k);if(!pr)throw new Error('DEMOS '+k);edits.push([pr.value.start,pr.value.end,v])}}
 /* usuwanie kodu łatającego */
 const stmtHas=(s,str)=>text.slice(s.start,s.end).includes(str);
 const rmTop=(str,file)=>{const s=ast.body.filter(x=>x.type==='ExpressionStatement'&&stmtHas(x,str)&&fileOf(x.start).f.includes(file));if(s.length!==1)throw new Error('rmTop '+file+' '+str+' '+s.length);edits.push([s[0].start,s[0].end,null])};
 rmTop('let s=sim.toString()','js/018');rmTop('let s=sim.toString()','js/019');rmTop('let s=sim.toString()','js/020');rmTop('let s=sim.toString()','js/022');rmTop('let s=sim.toString()','js/026');
 rmTop("DEMOS['Ciotka'].toString()",'js/021');rmTop("runAnim=(0,eval)",'js/027');
 /* 030: część IIFE z łatą sim */
 {const a=text.indexOf("try{let s=sim.toString();const rep=(a,b)=>{if(!s.includes(a)){console.warn('byku bal: '+a)");const e="sim=(0,eval)('('+s+')')}catch(e){console.warn(e)}\n";const z=text.indexOf(e,a);
  if(a<0||z<0||!fileOf(a).f.includes('js/030'))throw new Error('030');edits.push([a,z+e.length,''])}
 /* 018: pomocnik ev i dwa wywołania (wrapper Byka zostaje) */
 {const a=text.indexOf("const ev=(k,pairs)=>{let s=DEMOS[k].toString()");const z=text.indexOf(' const oB=DEMOS[\'Byku\']',a);if(a<0||z<0)throw new Error('018 ev');edits.push([a,z+1,''])}
 /* 029: łata revCore w treningu */
 {const a=text.indexOf(" try{let s=revCore.toString();");const z=text.indexOf("\n",a);if(a<0)throw new Error('029');edits.push([a,z+1,''])}
 /* 032: pomocnik pf, NK i wywołania pf(...) */
 {const a=text.indexOf(" const pf=(name,pairs)=>");let z=a;for(const n of ['revCore','scoreTable','waitH','cwaitH']){const i=text.indexOf(" pf('"+n+"'",z);if(i<0)throw new Error('pf '+n);z=i}
  /* koniec ostatniego wywołania pf: do końca linii z "]]);" */
  const end=text.indexOf("]]);",z)+4;const nl=text[end]==='\n'?end+1:end;
  const seg=text.slice(a,nl);if(!/^ const pf=/.test(seg))throw new Error('pf seg');
  console.log('032 usuwany fragment ('+seg.split('\n').length+' linii) zaczyna się:',seg.slice(0,60).replace(/\n/g,'⏎'),'… kończy:',seg.slice(-60).replace(/\n/g,'⏎'));
  edits.push([a,nl,''])}
 /* nakładanie zmian od końca */
 edits.sort((x,y)=>y[0]-x[0]);for(let i=1;i<edits.length;i++)if(edits[i][1]>edits[i-1][0])throw new Error('nakładające się zmiany');
 let T=text;for(const [s,e,r] of edits){let s2=s,e2=e;if(r===null){/* całe zdanie: z wcięciem i końcem linii */while(s2>0&&T[s2-1]===' ')s2--;if(T[e2]==='\n')e2++}T=T.slice(0,s2)+(r||'')+T.slice(e2)}
 /* rozpisanie z powrotem na pliki: przesunięcia liczymy po kolei */
 /* dokładne granice: po każdej zmianie przesuwamy granice plików leżące za nią */
 const bounds=files.map(f=>f.end);const ed=edits.slice().sort((x,y)=>x[0]-y[0]);const nb=bounds.slice();
 for(const [s,e,r] of ed){let s2=s,e2=e;if(r===null){while(s2>0&&text[s2-1]===' ')s2--;if(text[e2]==='\n')e2++}const dl=(r||'').length-(e2-s2);for(let i=0;i<nb.length;i++)if(bounds[i]>s2)nb[i]+=dl;}
 let prev=0;files.forEach((f,i)=>{const t=T.slice(prev,nb[i]);prev=nb[i];fs.writeFileSync(ROOT+'/src/'+f.f,t)});
 console.log('zmian:',edits.length,'długość przed',text.length,'po',T.length);
})().catch(e=>{console.log('BŁĄD',e.message);process.exit(1)});
