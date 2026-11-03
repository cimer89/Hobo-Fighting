/* Usuwa zasoby (obrazy) przypisywane w kodzie, które później są nadpisywane innym przypisaniem tego samego klucza
   zanim gra cokolwiek wyświetli (cały skrypt wykonuje się przed pierwszym malowaniem strony). */
const {load}=require('./srcmap');const fs=require('fs');const V=process.argv[3]||'github';const {files,text,ast,fileOf,ROOT}=load(V);
const isA=n=>n&&n.type==='Literal'&&typeof n.value==='string'&&n.value.startsWith('@@asset:');
const key=n=>n.type==='Identifier'?n.name:(n.type==='Literal'?String(n.value):null);
const writes=[];/* {tgt,node(edit),kind,stmt} */
function scan(st){
 if(st.type==='VariableDeclaration')st.declarations.forEach(d=>{if(d.id.type!=='Identifier'||!d.init)return;
  if(isA(d.init))writes.push({tgt:d.id.name,lit:d.init});
  if(d.init.type==='ObjectExpression')d.init.properties.forEach(p=>{if(p.type==='Property'&&isA(p.value))writes.push({tgt:d.id.name+'.'+key(p.key),lit:p.value})})});
 if(st.type!=='ExpressionStatement')return;const e=st.expression;
 const one=e=>{
  if(e.type==='AssignmentExpression'&&e.operator==='='){
   if(e.left.type==='Identifier'&&isA(e.right))writes.push({tgt:e.left.name,lit:e.right});
   if(e.left.type==='MemberExpression'&&e.left.object.type==='Identifier'&&isA(e.right)){const k=e.left.computed?key(e.left.property):e.left.property.name;writes.push({tgt:e.left.object.name+'.'+k,lit:e.right})}}
  if(e.type==='CallExpression'&&e.callee.type==='MemberExpression'&&e.callee.object.name==='Object'&&e.callee.property.name==='assign'&&e.arguments[0]&&e.arguments[0].type==='Identifier')
   e.arguments.slice(1).forEach(o=>{if(o.type==='ObjectExpression')o.properties.forEach(p=>{if(p.type==='Property'&&isA(p.value))writes.push({tgt:e.arguments[0].name+'.'+key(p.key),lit:p.value})})})};
 if(e.type==='SequenceExpression')e.expressions.forEach(one);else one(e)}
ast.body.forEach(scan);
const last={};writes.forEach((w,i)=>last[w.tgt]=i);
const dead=writes.filter((w,i)=>last[w.tgt]!==i);
console.log('nadpisane przypisania zasobów:',dead.length,dead.map(w=>w.tgt).join(' '));
if(process.argv[2]==='apply'){/* zastępujemy martwą wartość pustym napisem (kolejność kluczy obiektów bez zmian) */
 dead.sort((a,b)=>b.lit.start-a.lit.start).forEach(w=>{const f=fileOf(w.lit.start);const a=w.lit.start-f.start,b=w.lit.end-f.start;f.t=f.t.slice(0,a)+"''"+f.t.slice(b)});
 files.forEach(x=>fs.writeFileSync(ROOT+'/src/'+x.f,x.t))}
