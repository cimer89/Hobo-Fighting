/* Lista łat działających przez podmianę tekstu funkcji (toString + eval) i przypisań nadpisujących funkcje. */
const {load}=require('./srcmap');const {text,ast,walk,fileOf}=load('github');
const out=[];walk.fullAncestor(ast,(n,anc)=>{
 if(n.type==='CallExpression'&&n.callee.type==='MemberExpression'&&n.callee.property.name==='toString'){const o=text.slice(n.callee.object.start,n.callee.object.end);out.push(['toString',o,n.loc.start.line,fileOf(n.start).f])}
 if(n.type==='AssignmentExpression'&&['sim','runAnim','revCore','resolve','attack'].includes(n.left.name)){out.push(['assign '+n.left.name,text.slice(n.right.start,Math.min(n.right.end,n.right.start+70)).replace(/\n/g,' '),n.loc.start.line,fileOf(n.start).f])}});
out.sort((a,b)=>a[2]-b[2]).forEach(x=>console.log(x[2],x[0],'|',x[1],'|',x[3]));
