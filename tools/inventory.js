const {load}=require('./srcmap');const {ast,fileOf,text}=load('github');
const by={};ast.body.forEach(s=>{const f=fileOf(s.start).f.replace('js/','').slice(0,3);let n;
 if(s.type==='FunctionDeclaration')n='F:'+s.id.name;else if(s.type==='VariableDeclaration')n=s.kind+':'+s.declarations.map(d=>d.id.name||'?').join(',');else{const t=text.slice(s.start,s.start+40).replace(/\s+/g,' ');n='S:'+t}
 (by[f]=by[f]||[]).push(n)});
for(const [f,a] of Object.entries(by))console.log(f,a.length,'|',a.filter(x=>x.startsWith('F:')).map(x=>x.slice(2)).join(' '),'\n   vars:',a.filter(x=>/^(const|let|var):/.test(x)).map(x=>x.split(':')[1]).join(' '),'\n   stmts:',a.filter(x=>x.startsWith('S:')).length);
