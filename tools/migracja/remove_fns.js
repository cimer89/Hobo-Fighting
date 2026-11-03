/* Usuwa wskazane deklaracje funkcji (po nazwie) – tylko te bez odwołań. node tools/remove_fns.js nazwa1 nazwa2 ... */
const {load}=require('../srcmap');const fs=require('fs');const {files,ast,walk,fileOf,ROOT}=load('github');
const want=new Set(process.argv.slice(2));const hits=[];walk.full(ast,n=>{if(n.type==='FunctionDeclaration'&&want.has(n.id.name))hits.push(n)});
hits.sort((a,b)=>b.start-a.start).forEach(s=>{const f=fileOf(s.start);let a=s.start-f.start,b=s.end-f.start;
 /* usuń też wcięcie przed i znak nowej linii po, jeśli funkcja zajmuje całą linię */
 let a2=a;while(a2>0&&(f.t[a2-1]===' '||f.t[a2-1]==='\t'))a2--;if(a2===0||f.t[a2-1]==='\n'){if(f.t[b]==='\n'){a=a2;b++}}
 f.t=f.t.slice(0,a)+f.t.slice(b);console.log('usunięto',s.id.name,f.f)});
files.forEach(x=>fs.writeFileSync(ROOT+'/src/'+x.f,x.t));
