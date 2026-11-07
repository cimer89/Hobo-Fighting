/* Macierz pojedynków 1v1: każda para postaci, obie kolejności (zamiana stron i pozycji startowych), mieszane strategie.
   node tests/matchups.js [gier_na_parę=200] [tryb=classic] [plik.csv]   – nic nie zmienia w grze */
global.Combat=require('../src/js/engine/combat.js');
const Bots=require('../src/js/dev/bots.js'),fs=require('fs');
const [G=200,mode='classic',csv]=process.argv.slice(2);
const CH=['Wiatrak','Długi','Żyleta','Byku','Ciotka','Pasterz','Truchel','Sierżant Przemo'],ST=['agresywny','przewidujący','ostrożny'];
const W={},N={},rows=[];
for(const a of CH)for(const b of CH){if(a===b)continue;let wa=0,n=0;
 for(let g=0;g<+G;g++){const sa=ST[g%3],sb=ST[Math.floor(g/3)%3];const r=Bots.play({chars:[a,b],mode,strats:[sa,sb],seed:1000+g});if(r.draw)continue;n++;if(r.players[0].win)wa++}
 W[a+'|'+b]=wa;N[a+'|'+b]=n}
const short=s=>s==='Sierżant Przemo'?'Przemo':s;
const pct=(a,b)=>{const w=(W[a+'|'+b]||0)+((N[b+'|'+a]||0)-(W[b+'|'+a]||0)),n=(N[a+'|'+b]||0)+(N[b+'|'+a]||0);return n?w/n:NaN};
console.log('Wygrane wiersza przeciw kolumnie (obie strony startu), '+G+' gier na kolejność, tryb '+mode);
console.log(''.padEnd(9)+CH.map(c=>short(c).slice(0,7).padStart(8)).join('')+'   śr.');
CH.forEach(a=>{const v=CH.map(b=>a===b?NaN:pct(a,b));const av=v.filter(x=>!isNaN(x));const m=av.reduce((s,x)=>s+x,0)/av.length;
 console.log(short(a).slice(0,8).padEnd(9)+v.map(x=>isNaN(x)?'      – ':((x*100).toFixed(0)+'%').padStart(8)).join('')+((m*100).toFixed(0)+'%').padStart(7));
 CH.forEach((b,i)=>{if(a!==b)rows.push([a,b,(v[i]*100).toFixed(1),(N[a+'|'+b]||0)+(N[b+'|'+a]||0)])})});
/* wpływ strony startu */
let s0=0,sn=0;Object.keys(W).forEach(k=>{s0+=W[k];sn+=N[k]});console.log('gracz 1 (pierwsza pozycja) wygrywa '+(100*s0/sn).toFixed(1)+'% partii (n='+sn+')');
if(csv)fs.writeFileSync(csv,'postac;przeciwnik;wygrane_proc;partie\n'+rows.map(r=>r.join(';')).join('\n')+'\n');
