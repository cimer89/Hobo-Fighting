/* ===================== Postacie: dane (nazwy, kolory, opisy, portrety) ===================== */
/* --- z części: js/000-start.js --- */
const IMG={"Żyleta": '', "Byku": '', "Wiatrak": '', "Długi": '', "Ciotka": ''};
const INI={W:'Wiatrak',D:'Długi','Ż':'Żyleta',B:'Byku',C:'Ciotka'};
const C={
 'Wiatrak':{col:'#3b6fd4',txt:'Wachlarz 3 pól: środek 2 DMG, boki po 1 DMG.'},
 'Długi':{col:'#6b8f3e',txt:'Linia 3 pól: 1 – 1 – 2 DMG. Ma 3 fazy w rundzie (anulowana, gdy ktoś go przesunie).'},
 'Żyleta':{col:'#e0a81c',txt:'Linia do końca planszy, trafia pierwszą postać, 2 DMG.'},
 'Byku':{col:'#e07a1a',txt:'Skok o 1 pole albo w miejscu: lądowanie na przeciwniku = 3 DMG (także gdy ktoś wejdzie na pole Byka). Dalszy skok (o 2 pola) = 1 DMG. Szarża (faza II): na wprost do pierwszej postaci, 1 DMG i odrzucenie o 1 pole.'},
 'Ciotka':{col:'#8a4fc7',txt:'Linia 3 pól. Faza I: 2 DMG. Faza II: 1 DMG + przesunięcie o 1.'}
};
/* --- z części: BONUSY POSTACI --- */
const CHA={"Żyleta": '', "Byku": '', "Wiatrak": '', "Długi": '', "Ciotka": ''};
const ART={"Żyleta": "@@asset:img/art_zyleta.webp@@", "Byku": "@@asset:img/art_byku.webp@@", "Wiatrak": "@@asset:img/art_wiatrak.webp@@", "Długi": "@@asset:img/art_dlugi.webp@@", "Ciotka": "@@asset:img/art_ciotka.webp@@"};
/* --- z części: TRYBY WALKI: FREE FOR ALL / 2 VS 2 --- */
const TCOL={A:'#e5484d',B:'#3e8ef7'},TNAME={A:'Drużyna A',B:'Drużyna B'};
/* --- z części: EKRAN WYBORU POSTACI (styl bijatyki) + VS --- */
const ROLE={'Wiatrak':['Obszar',[4,1,2]],'Długi':['Zasięg · 3 fazy',[3,3,2]],'Żyleta':['Snajperka',[3,5,2]],'Byku':['Szarża',[5,2,4]],'Ciotka':['Kontrola',[2,3,2]],'Pasterz':['Przywoływacz',[1,4,3]],'Truchel':['Trucizna',[2,1,5]],'Sierżant Przemo':['Wsparcie',[2,5,2]]};
const SHORT=n=>n==='Sierżant Przemo'?'Przemo':n;
const BGART={};
const BGPOS={'Wiatrak':'42% 18%','Długi':'35% 30%'};
/* --- tło sceny ustawiane tak, by twarz była nad panelem --- */
const FACEPT={'Wiatrak':[375,505],'Długi':[338,490],'Żyleta':[415,365],'Byku':[630,445],'Ciotka':[565,320]};
/* --- z części: animacja podniesienia przedmiotu (leczenie ≠ obrażenia) --- */
const PKCOL={1:'#5cff8a',2:'#ffb347',3:'#6cc8ff',4:'#d6dde6',6:'#c792ff'};
