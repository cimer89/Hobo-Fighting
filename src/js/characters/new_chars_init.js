/* ===================== NOWE POSTACIE (Pasterz, Truchel, Sierżant Przemo) + PUNKTACJA ===================== */
Object.assign(C,{
 'Pasterz':{col:'#c8a26b',txt:'Owca (1 HP): przywołaj, poruszaj, szarżuj nią (1 DMG). Osłania przed strzałami. Jedna owca na planszy.'},
 'Truchel':{col:'#19b5a5',txt:'Teleport na dowolne pole. Zamiast ataku tworzy kałużę trucizny (3 rundy, obrażenia na koniec każdej fazy).'},
 'Sierżant Przemo':{col:'#d9544f',txt:'Pistolet 1 DMG (jak Żyleta). Dron: faza I aktywacja, faza II wysłanie, atakuje najbliższą postać.'}});
Object.assign(INI,{P:'Pasterz',T:'Truchel',S:'Sierżant Przemo'});

/* --- zapis stanu na kolejną rundę --- */
document.addEventListener('click',function(e){
 if(e.target.closest&&e.target.closest('[data-a="newgame"]')){location.reload();return}
 const t=e.target.closest('[data-a="next"],[data-a="hnextr"]');if(!t)return;
 const r=st.round,items=curItems(),fin=(st._fin&&st._finRound===r)?st._fin:null;if(!fin)return;
 items.forEach(o=>{if(!mine(o.id))return;const q=o.q;
  q.sheepr=q.sheepr||{};q.dr=q.dr||{};q.pts=q.pts||{};
  q.sheepr[r+1]=(fin._sheep&&fin._sheep[o.id])?fin._sheep[o.id].slice():null;
  q.dr[r+1]=!!(fin._drone&&fin._drone[o.id]);
  const x=fin[o.id];if(x&&x.pts)q.pts[r]={d:x.pts.d,m:x.pts.m};
  (fin._pudNew||[]).forEach(p=>{if(p.o===o.id){q.pud=q.pud||[];q.pud.push({k:p.k,o:p.o,r0:p.r0,b:p.b})}})});
 if(!H)save();},true);
render();
Object.assign(IMG,{"Pasterz": '', "Truchel": '', "Sierżant Przemo": ''});
Object.assign(CHA,{"Pasterz": '', "Truchel": '', "Sierżant Przemo": ''});
Object.assign(ART,{"Pasterz": "@@asset:img/art_pasterz_2.webp@@", "Truchel": "@@asset:img/art_truchel_2.webp@@", "Sierżant Przemo": "@@asset:img/art_sierzant_przemo_2.webp@@"});
