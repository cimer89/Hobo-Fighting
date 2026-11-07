/* Symulacje balansu z wiersza poleceń: node tests/balance_sim.js [gier=2000] [tryb=classic] [graczy=2] [strategia=mieszane] [plik.csv]
   Wypisuje tabelę postaci i propozycje (nic nie zmienia w grze). */
global.Combat=require('../src/js/engine/combat.js');
const Bots=require('../src/js/dev/bots.js'),BL=require('../src/js/dev/balance.js'),fs=require('fs');
const [games=2000,mode='classic',players=2,strat='mieszane',csv]=process.argv.slice(2);
const t0=Date.now();const G=Bots.series({games:+games,mode,players:+players,strat,seed:7}),rows=BL.perChar(G).sort((a,b)=>b.wr-a.wr);const pct=x=>(x*100).toFixed(0).padStart(3)+'%';
console.log(`${G.length} partii (${mode}, ${players} graczy, ${strat}) w ${Date.now()-t0} ms · remisy ${G.filter(g=>g.draw).length} · średnio rund ${(G.reduce((a,g)=>a+g.rounds,0)/G.length).toFixed(1)}`);
console.log('postać            partie  wygrane  oczek.  95% przedział  zadane  otrzym.  skuteczn.');
rows.forEach(c=>console.log(c.ch.padEnd(17),String(c.fin).padStart(6),pct(c.wr).padStart(8),pct(c.expWr).padStart(7),(pct(c.ci[0])+'–'+pct(c.ci[1])).padStart(14),(c.dealt/c.games).toFixed(1).padStart(7),(c.taken/c.games).toFixed(1).padStart(8),(c.attacks?pct(c.acc):'   –').padStart(10)));
console.log('\nPROPOZYCJE:');BL.proposals(rows,'bot').forEach(p=>console.log(' -',p.txt));
const st={};G.forEach(g=>g.players.forEach(p=>{const k=p.strat;st[k]=st[k]||[0,0];if(g.finished){st[k][0]++;if(p.win)st[k][1]++}}));
console.log('\nstrategie (wygrane/zakończone):',Object.entries(st).map(([k,[n,w]])=>k+' '+pct(w/n)+' ('+n+')').join(', '));
if(csv)fs.writeFileSync(csv,'﻿'+BL.csvChars(rows));
