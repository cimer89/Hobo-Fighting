/* --- Bitwa baz, część: mapy – generowanie map, linia widzenia, pola ruchu. Części są fragmentami jednego domknięcia MB i muszą być sklejane w kolejności z manifestu. --- */
 /* mapa symetryczna względem środka w osiach heksów: dolna połowa jest wzorem, górna to jej odbicie */
 function symCells(rows,W){const H=rows.length,rc=(H-1)>>1,cc=(W-1)>>1,C=ax(cc,rc),out={};const sw=ch=>ch==='A'?'B':ch==='B'?'A':ch;
  rows.forEach((row,r)=>[...row].forEach((ch,c)=>{if(r<rc||(r===rc&&c>cc)||ch==='X')return;const a=ax(c,r),m=[2*C[0]-a[0],2*C[1]-a[1]];
   out[K(...a)]={a,ch:ch==='B'?'.':ch};if(!(r===rc&&c===cc))out[K(...m)]={a:m,ch:sw(ch==='B'?'.':ch)}}));return Object.values(out)}
 function symOk(cl){const m={};cl.forEach(x=>m[K(...x.a)]=x.ch);const open=k=>m[k]!==undefined&&!'#w'.includes(m[k]);
  const a=cl.find(x=>x.ch==='A');if(!a||!cl.find(x=>x.ch==='B'))return false;const seen={},q=[a.a];seen[K(...a.a)]=1;
  while(q.length){const p=q.pop();DIRS.forEach(d=>{const n=[p[0]+d[0],p[1]+d[1]],k=K(...n);if(open(k)&&!seen[k]){seen[k]=1;q.push(n)}})}
  return cl.every(x=>'#w'.includes(x.ch)||seen[K(...x.a)])}
 /* labirynt NIESYMETRYCZNY: cała mapa losowana od nowa, bazy na przeciwnych brzegach; uczciwość pilnowana odległościami */
 function genMazeA(W,H,big){const D=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
  const nbOff=(c,r)=>{const a=ax(c,r),o=[];D.forEach(d=>{const q=a[0]+d[0],rr=a[1]+d[1];if(rr<0||rr>=H)return;const cc=q+((rr-(rr&1))>>1);if(cc>=0&&cc<W)o.push([cc,rr])});return o};
  const rnd=a=>a[Math.floor(Math.random()*a.length)],key=(c,r)=>c+','+r;
  const g=Array.from({length:H},()=>Array(W).fill('#'));
  const st0=[2*Math.floor(Math.random()*((W+1)>>1)),H-1],vis={};vis[key(...st0)]=1;g[st0[1]][st0[0]]='.';const stack=[st0];
  while(stack.length){const [c,r]=stack[stack.length-1];
   const mv=[[2,0],[-2,0],[0,2],[0,-2]].map(([dc,dr])=>[c+dc,r+dr,c+dc/2,r+dr/2]).filter(([nc,nr])=>nc>=0&&nc<W&&nr>=0&&nr<H&&!vis[key(nc,nr)]);
   if(!mv.length){stack.pop();continue}const [nc,nr,ic,ir]=rnd(mv);vis[key(nc,nr)]=1;g[ir][ic]='.';g[nr][nc]='.';stack.push([nc,nr])}
  for(let r=0;r<H;r++)for(let c=0;c<W;c++)if(g[r][c]==='#'&&((r%2===0&&c%2===1)||(r%2===1&&c%2===0))&&Math.random()<(big?0.17:0.13))g[r][c]='.';
  /* bazy: losowa kolumna przy dolnym i górnym brzegu (nie naprzeciw siebie) */
  const bcA=1+Math.floor(Math.random()*(W-2));let bcB=1+Math.floor(Math.random()*(W-2));if(W>5)while(bcB===W-1-bcA&&Math.random()<.85)bcB=1+Math.floor(Math.random()*(W-2));
  const A=[bcA,H-1],B=[bcB,0];g[A[1]][A[0]]='A';g[B[1]][B[0]]='B';[A,B].forEach(p=>nbOff(...p).forEach(([c,r])=>g[r][c]='.'));
  const cr=(H-1)>>1,cc=Math.floor(W/2)+(Math.random()<.5?-1:0)*(W>7?1:0);g[cr][cc]='C';nbOff(cc,cr).forEach(([c,r])=>{if(g[r][c]==='#')g[r][c]='.'});
  const pas=(c,r)=>g[r][c]!=='#';
  const bfs=s=>{const d={};d[key(...s)]=0;const q=[s];while(q.length){const p=q.shift();nbOff(...p).forEach(n=>{const k=key(...n);if(d[k]===undefined&&pas(...n)&&!'AB'.includes(g[n[1]][n[0]])){d[k]=d[key(...p)]+1;q.push(n)}})}return d};
  const dA=bfs(A),dB=bfs(B);const open=[];for(let r=0;r<H;r++)for(let c=0;c<W;c++)if(g[r][c]==='.'||g[r][c]==='C')open.push([c,r]);
  if(open.some(p=>dA[key(...p)]===undefined))return null;
  const kC=key(cc,cr);if(Math.abs(dA[kC]-dB[kC])>2)return null;
  /* każda strona dostaje stworki i skrzynie w "swojej" połowie (bliżej własnej bazy), najchętniej w ślepych zaułkach */
  const pick=(arr,n)=>{const o=[],a=arr.slice();while(o.length<n&&a.length)o.push(a.splice(Math.floor(Math.random()*a.length),1)[0]);return o};
  const dead=p=>nbOff(...p).filter(n=>pas(...n)).length===1;
  const nc=big?2:1,nch=big?2:1;
  for(const [me,ot] of [[dA,dB],[dB,dA]]){const mine=open.filter(p=>g[p[1]][p[0]]==='.'&&me[key(...p)]>=3&&me[key(...p)]+1<ot[key(...p)]);
   const dd=mine.filter(dead);pick(dd.length>=nc?dd:mine,nc).forEach(([c,r])=>g[r][c]='c');
   const rest=mine.filter(p=>g[p[1]][p[0]]==='.'),dr=rest.filter(dead);pick(dr.length>=nch?dr:rest,nch).forEach(([c,r])=>g[r][c]='?');
   pick(mine.filter(p=>g[p[1]][p[0]]==='.'&&!dead(p)),big?3:2).forEach(([c,r])=>g[r][c]='*')}
  if(open.filter(p=>g[p[1]][p[0]]==='c').length<2*nc)return null;
  const out=[];g.forEach((row,r)=>row.forEach((ch,c)=>{if((r===0||r===H-1)&&(c===0||c===W-1)&&ch==='#')return;out.push({a:ax(c,r),ch})}));return out}
 function mapCells(t,big){if(t.id!=='maze')return symCells(t.rows,t.W);for(let i=0;i<80;i++){const cl=genMazeA(t.W,t.rows.length,big);if(cl&&symOk(cl))return cl}return symCells(t.rows,t.W)}
 /* linia widzenia: skały i krzaki zasłaniają pola za nimi */
 function losClear(a,b){const n=dist(a,b);if(n<=1)return true;const ok=e=>{for(let i=1;i<n;i++){const t=i/n,q=a[0]+(b[0]-a[0])*t+e,r=a[1]+(b[1]-a[1])*t+e,s=-q-r;let rq=Math.round(q),rr=Math.round(r),rs=Math.round(s);
   const dq=Math.abs(rq-q),dr=Math.abs(rr-r),ds=Math.abs(rs-s);if(dq>dr&&dq>ds)rq=-rr-rs;else if(dr>ds)rr=-rq-rs;const c=G.cells[K(rq,rr)];if(c&&(c.t==='r'||c.t==='b'))return false}return true};
  return ok(1e-4)||ok(-1e-4)}
 /* pola, na które postać może wejść w tej fazie: po drodze (bez przeskakiwania skał i wody) i tylko w polu widzenia drużyny */
 /* pola zasłonięte tylko krzakami: znany teren, nieznana zawartość */
 function losRock(a,b){const n=dist(a,b);if(n<=1)return true;const ok=e=>{for(let i=1;i<n;i++){const t=i/n,q=a[0]+(b[0]-a[0])*t+e,r=a[1]+(b[1]-a[1])*t+e,s=-q-r;let rq=Math.round(q),rr=Math.round(r),rs=Math.round(s);
   const dq=Math.abs(rq-q),dr=Math.abs(rr-r),ds=Math.abs(rs-s);if(dq>dr&&dq>ds)rq=-rr-rs;else if(dr>ds)rr=-rq-rs;const c=G.cells[K(rq,rr)];if(c&&c.t==='r')return false}return true};
  return ok(1e-4)||ok(-1e-4)}
 function knownSet(team){const vs=visSet(team),s={};const add=(p,r)=>{Object.values(G.cells).forEach(c=>{const k=K(...c.p);if(!vs[k]&&dist(c.p,p)<=r&&losRock(p,c.p))s[k]=1})};
  G.heroes.forEach(h=>{if(h.team===team&&!h.dead&&h.pos)add(h.pos,visR(h))});add(G.bases[team].pos,3);return s}
 function moveCells(h,from){const mk=moveKind(h),vs=Object.assign({},visSet(h.team),knownSet(h.team)),o={};
  if(mk.tele){Object.values(G.cells).forEach(c=>{const k=K(...c.p);if(vs[k]&&passable(c.p,h.team)&&dist(c.p,from)<=mk.r&&dist(c.p,from)>0)o[k]=1});return o}
  const dd={},q=[from];dd[K(...from)]=0;while(q.length){const p=q.shift(),d0=dd[K(...p)];if(d0>=mk.r)continue;
   nb(p).forEach(n=>{const k=K(...n);if(dd[k]!==undefined||!passable(n,h.team)||!vs[k])return;dd[k]=d0+1;o[k]=1;q.push(n)})}
  delete o[K(...from)];return o}

