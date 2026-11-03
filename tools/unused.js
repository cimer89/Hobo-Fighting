/* Wyszukuje deklaracje funkcji (na każdym poziomie), do których nie ma żadnego odwołania. */
const {load}=require('./srcmap');const {text,ast,walk}=load(process.argv[2]||'github');
const decls=[];walk.full(ast,n=>{if(n.type==='FunctionDeclaration')decls.push(n)});
const refs={};walk.full(ast,n=>{if(n.type==='Identifier')refs[n.name]=(refs[n.name]||0)+1});
const dupInner={};walk.full(ast,n=>{if((n.type==='FunctionExpression'||n.type==='ArrowFunctionExpression'||n.type==='FunctionDeclaration')&&n.body.type==='BlockStatement'){const seen={};n.body.body.forEach(s=>{if(s.type==='FunctionDeclaration'){if(seen[s.id.name])(dupInner[s.id.name]=dupInner[s.id.name]||[]).push(s.loc.start.line);seen[s.id.name]=1}})}});
const sameName={};decls.forEach(d=>sameName[d.id.name]=(sameName[d.id.name]||0)+1);
const un=decls.filter(d=>refs[d.id.name]<=sameName[d.id.name]&&!(new RegExp("['\"`]"+d.id.name+"\\b").test(text)));
console.log('nieużywane funkcje:',un.map(d=>d.id.name+'@'+d.loc.start.line).join(' '));
console.log('duplikaty wewnątrz zakresów:',JSON.stringify(dupInner));
