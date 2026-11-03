/* Usuwa wcześniejsze (martwe) deklaracje funkcji najwyższego poziomu, które są nadpisane późniejszą deklaracją o tej samej nazwie. */
const {load}=require('./srcmap');const fs=require('fs');
const V=process.argv[3]||'github';const {files,text,ast,fileOf,ROOT}=load(V);
const byName={};ast.body.forEach(s=>{if(s.type==='FunctionDeclaration')(byName[s.id.name]=byName[s.id.name]||[]).push(s)});
const cuts=[];for(const [n,arr] of Object.entries(byName))if(arr.length>1)arr.slice(0,-1).forEach(s=>cuts.push({n,s}));
const DRY=process.argv[2]!=='apply';const rep={};
cuts.sort((a,b)=>b.s.start-a.s.start).forEach(({n,s})=>{const f=fileOf(s.start);if(fileOf(s.end-1)!==f)throw new Error('cross-file '+n);
 let a=s.start-f.start,b=s.end-f.start;/* zjedz końcowy znak nowej linii */ if(f.t[b]==='\n')b++;
 rep[f.f]=(rep[f.f]||0)+1;f.t=f.t.slice(0,a)+f.t.slice(b)});
console.log('usunięte martwe duplikaty:',cuts.length,'w plikach',rep);
console.log(cuts.map(c=>c.n+'@'+c.s.loc.start.line).sort().join(' '));
if(!DRY)files.forEach(x=>fs.writeFileSync(ROOT+'/src/'+x.f,x.t));
