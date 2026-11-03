/* ===================== Tryb Testy: nowy balans ===================== */
/* --- z części: TRYB TESTY (nowy balans) --- */
function TB(){return st.gm==='test'}
const TBP={selfLand:false,zylR:9,zyl2:3};
const TBHP={'Wiatrak':6,'Pasterz':7,'Sierżant Przemo':4};
function MAXHP(ch){return (TB()&&TBHP[ch])||5}
function chOfId(id){const o=(st.animItems||[]).find(o=>o.id===id);if(o&&o.q)return o.q.ch;if(H){const p=H.p[+String(id).replace(/\D/g,'')];if(p)return p.ch}const q=net.pl&&net.pl[id];return q?q.ch:null}
const TBORIG={};
const TBTXT={
 'Wiatrak':'Wachlarz 3 pól (2/1/1 DMG) plus drugi rząd 3 pól po 1 DMG. 6 HP.',
 'Długi':'Linia 3 pól: 1 – 2 – 2 DMG. Ma 3 fazy w rundzie (anulowana, gdy ktoś go przesunie).',
 'Żyleta':'Strzał przez całą planszę, trafia pierwszą postać: 2 DMG do 3 pól, dalej 1 DMG.',
 'Byku':'Skok o 1 pole albo w miejscu: lądowanie na przeciwniku = 3 DMG (także gdy ktoś wejdzie na pole Byka). Dalszy skok (o 2 pola) = 1 DMG. Szarża (faza II): na wprost do pierwszej postaci, 2 DMG i odrzucenie o 1 pole.',
 'Pasterz':'Zaczyna z owcą obok. Owca (1 HP): ruch, szarża 2 DMG przez całą linię. Osłania przed strzałami. 7 HP.',
 'Truchel':'Teleport na dowolne pole. Zamiast ataku kałuża trucizny (3 rundy, 2 DMG na koniec każdej fazy).',
 'Sierżant Przemo':'Pistolet 1 DMG (jak Żyleta). Dron 2 DMG: faza I aktywacja, faza II wysłanie, atakuje najbliższą postać. 4 HP.'};
function tbTexts(){Object.keys(C).forEach(k=>{C[k].txt=(TB()&&TBTXT[k])||TBORIG[k]})}
function tbInit(){if(!TB())return;
 const all=H?H.p:Object.values(net.pl||{});const mine=H?H.p:(net.db?[ME]:[]);
 const placed=all.length&&all.every(p=>p.ch&&p.posr&&p.posr[1]);if(!placed)return;
 mine.forEach(p=>{if(!p.ch||p._tb)return;p._tb=1;p.hpr=p.hpr||{};p.hpr[1]=MAXHP(p.ch);p.hp=MAXHP(p.ch);
  if(p.ch==='Pasterz'){const tk=new Set(all.filter(o=>o.ch&&o.posr&&o.posr[1]&&o.posr[1]!==p.posr[1]).map(o=>K(...o.posr[1])));
   const nb=nbCells(p.posr[1]).filter(c=>!tk.has(K(...c))).sort((a,b)=>dist(...a)-dist(...b));if(nb.length){p.sheepr=p.sheepr||{};p.sheepr[1]=nb[0].slice()}}
  if(!H&&net.db)save()})}
