// Zamienia pary `const X=render; render=function(){...}` na addRender('nazwa', X=>function(){...})
// Użycie: node wraps.js <repo> [--write]
const acorn=require('/opt/node-tools/node_modules/acorn');
const walk=require('/opt/node-tools/node_modules/acorn-walk');
const fs=require('fs'),path=require('path');
const repo=process.argv[2],write=process.argv.includes('--write');
const man=JSON.parse(fs.readFileSync(path.join(repo,'src/manifest.json')));
const report=[];
for(const rel of man.js){
 const f=path.join(repo,'src',rel);let src=fs.readFileSync(f,'utf8');
 // warianty //@@if github – zostaw jako komentarze, acorn je ignoruje
 let ast;try{ast=acorn.parse(src,{ecmaVersion:'latest',sourceType:'script',allowReturnOutsideFunction:true})}catch(e){report.push(rel+': PARSE ERROR '+e.message);continue}
 const edits=[];
 walk.full(ast,node=>{
  const body=node.type==='Program'||node.type==='BlockStatement'?node.body:null;if(!body)return;
  for(let i=0;i<body.length-1;i++){
   const a=body[i],b=body[i+1];
   if(a.type!=='VariableDeclaration'||a.declarations.length!==1)continue;
   const d=a.declarations[0];if(!d.init||d.init.type!=='Identifier'||d.init.name!=='render'||d.id.type!=='Identifier')continue;
   if(b.type!=='ExpressionStatement'||b.expression.type!=='AssignmentExpression'||b.expression.left.type!=='Identifier'||b.expression.left.name!=='render'||b.expression.right.type!=='FunctionExpression')continue;
   const X=d.id.name,fn=b.expression.right;
   // X nie może być używane poza funkcją
   const occ=[...src.matchAll(new RegExp('\\b'+X.replace('$','\\$')+'\\b','g'))].map(m=>m.index);
   const outside=occ.filter(p=>p>=node.start&&p<node.end).filter(p=>!(p>=a.start&&p<a.end)&&!(p>=fn.start&&p<fn.end));
   if(outside.length){report.push(rel+': '+X+' used outside, skipped');continue}
   edits.push({a,b,X,fn});
  }
 });
 if(!edits.length)continue;
 edits.sort((p,q)=>q.a.start-p.a.start);
 const base=rel.replace(/^js\//,'').replace(/\.js$/,'');
 let n=edits.length;
 for(const e of edits){
  const name=base+(edits.length>1?'#'+n:'');n--;
  const fnSrc=src.slice(e.fn.start,e.fn.end);
  const rep="addRender('"+name+"',"+e.X+"=>"+fnSrc+");";
  src=src.slice(0,e.a.start)+rep+src.slice(e.b.end);
  report.push(rel+': '+e.X+' -> '+name);
 }
 if(write)fs.writeFileSync(f,src);
}
console.log(report.join('\n'));
