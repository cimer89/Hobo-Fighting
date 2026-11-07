// Zamienia window/document.addEventListener('click',fn[,opt]) na addClick('nazwa',window|document,fn[,opt])
const acorn=require('/opt/node-tools/node_modules/acorn');
const walk=require('/opt/node-tools/node_modules/acorn-walk');
const fs=require('fs'),path=require('path');
const repo=process.argv[2],write=process.argv.includes('--write');
const man=JSON.parse(fs.readFileSync(path.join(repo,'src/manifest.json')));
const report=[];
for(const rel of man.js){
 const f=path.join(repo,'src',rel);let src=fs.readFileSync(f,'utf8');
 const ast=acorn.parse(src,{ecmaVersion:'latest',sourceType:'script',allowReturnOutsideFunction:true});
 const hits=[];
 walk.simple(ast,{CallExpression(n){const c=n.callee;
  if(c.type!=='MemberExpression'||c.property.name!=='addEventListener'||c.object.type!=='Identifier')return;
  if(!['window','document'].includes(c.object.name))return;
  const a0=n.arguments[0];if(!a0||a0.type!=='Literal'||a0.value!=='click')return;
  hits.push(n)}});
 if(!hits.length)continue;
 hits.sort((p,q)=>p.start-q.start);
 const base=rel.replace(/^js\//,'').replace(/\.js$/,'');
 const named=hits.map((n,i)=>({n,name:base+(hits.length>1?'#'+(i+1):'')}));
 for(const {n,name} of named.slice().reverse()){
  const rest=n.arguments.slice(1).map(a=>src.slice(a.start,a.end)).join(',');
  const rep="addClick('"+name+"',"+n.callee.object.name+","+rest+")";
  src=src.slice(0,n.start)+rep+src.slice(n.end);report.push(rel+' -> '+name+' @'+n.callee.object.name+(n.arguments[2]?' capture':''));
 }
 if(write)fs.writeFileSync(f,src);
}
console.log(report.join('\n'));
