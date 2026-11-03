/* Wspólne: wczytuje src/js wg manifestu, parsuje całość i mapuje pozycje na pliki. */
const NM='/opt/node-tools/node_modules/';const acorn=require(NM+'acorn'),walk=require(NM+'acorn-walk'),fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
function blank(t,variant){/* zastępuje spacjami linie wariantu, który nie jest analizowany (długość tekstu bez zmian) */
 const L=t.split('\n');let mode=null;return L.map(l=>{const m=/^\s*(?:\/\/|<!--)@@(if github|else|end)/.exec(l);if(m){mode=m[1]==='if github'?'a':m[1]==='else'?'b':null;return l}
  if(mode&&((mode==='a')!==(variant==='github')))return ' '.repeat(l.length);return l}).join('\n')}
function load(variant){variant=variant||'github';const man=JSON.parse(fs.readFileSync(ROOT+'/src/manifest.json','utf8'));const files=man.js.map(f=>({f,t:fs.readFileSync(ROOT+'/src/'+f,'utf8')}));
 let off=0;files.forEach(x=>{x.start=off;off+=x.t.length;x.end=off});const text=files.map(x=>x.t).join('');const ptext=blank(text,variant);
 const ast=acorn.parse(ptext,{ecmaVersion:2022,ranges:true,locations:true});
 const fileOf=pos=>files.find(x=>pos>=x.start&&pos<x.end);return {files,text,ast,fileOf,walk,acorn,ROOT,man}}
module.exports={load,blank};
