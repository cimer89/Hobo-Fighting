/* ===================== EKRAN WYBORU POSTACI (styl bijatyki) + VS ===================== */
const ROLE={'Wiatrak':['Obszar',[4,1,2]],'Długi':['Zasięg · 3 fazy',[3,3,2]],'Żyleta':['Snajperka',[3,5,2]],'Byku':['Szarża',[5,2,4]],'Ciotka':['Kontrola',[2,3,2]],'Pasterz':['Przywoływacz',[1,4,3]],'Truchel':['Trucizna',[2,1,5]],'Sierżant Przemo':['Wsparcie',[2,5,2]]};
const SHORT=n=>n==='Sierżant Przemo'?'Przemo':n;
function selPickerH(){
 const ch=st.ch||Object.keys(C)[0],c=C[ch],r=ROLE[ch]||['',[1,1,1]],pn=H?H.cur+1:1;
 if(isTeam()&&!st.team)st.team=teamCount('A')<=teamCount('B')?'A':'B';
 const teamOk=!isTeam()||(st.team&&teamCount(st.team)<2),ok=!!st.ch&&!taken(st.ch)&&teamOk;
 const fresh=st._selLast!==ch;st._selLast=ch;
 const tc=isTeam()&&st.team?TCOL[st.team]:'';
 const bgi=(typeof BGART!=='undefined')&&BGART[ch];let h='<div class="selbg'+(bgi?' img'+(fresh?' enter':''):'')+'"'+(bgi?' style="background-image:linear-gradient(180deg,rgba(5,6,9,.55),transparent 18%,transparent 42%,rgba(5,6,9,.88) 80%),url('+bgi+');background-position:'+((typeof BGPOS!=='undefined'&&BGPOS[ch])||'42% 18%')+'"':'')+'></div><div class="seltop"><span class="selp" style="--pc:'+(tc||'#f2c230')+'">GRACZ '+pn+'</span><span class="seltitle">WYBIERZ POSTAĆ</span></div>';
 if(isTeam())h+='<div class="selteam">'+['A','B'].map(t=>{const n=teamCount(t);return '<button data-team="'+t+'" class="'+(st.team===t?'on':'')+'" style="--tc:'+TCOL[t]+'" '+(n>=2?'disabled':'')+'>● '+TNAME[t]+' ('+n+'/2)</button>'}).join('')+'</div>';
 const bars=['Siła','Zasięg','Ruch'].map((l,i)=>'<div class="stat">'+l+'<b>'+[1,2,3,4,5].map(k=>'<i class="'+(k<=r[1][i]?'f':'')+'"></i>').join('')+'</b></div>').join('');
 h+='<div class="selhero"><img class="selart'+((ch==='Ciotka'||ch==='Długi')?' wide':'')+(fresh?' enter':'')+'" src="'+ART[ch]+'" alt="'+ch+'"><div class="selinfo'+(fresh?' enter':'')+'"><span class="selrole">'+r[0]+'</span><div class="selname'+(ch.length>9?' long':'')+'">'+ch.toUpperCase()+'</div>'+bars+'<p class="seldesc">'+c.txt+'</p></div></div>';
 h+='<div class="selgrid">'+Object.keys(C).map(n=>{const tk=taken(n);return '<button class="seltile'+(n===st.ch?' on':'')+(tk?' taken':'')+'" data-ch="'+n+'" data-p="'+pn+'" style="--c:'+C[n].col+(tc?';--tc:'+tc:'')+'" '+(tk?'disabled':'')+'><img src="'+IMG[n]+'" alt=""><span>'+SHORT(n)+'</span>'+(tk?'<em>ZAJĘTA</em>':'')+'</button>'}).join('')+'</div>';
 h+='<button class="selgo" data-a="chok" '+(ok?'':'disabled')+'>WYBIERAM</button>';
 return {h,col:c.col}}
function hPassH(){const p=H.p[H.cur];const what=H.tgt==='pick'?'Wybierze postać.':H.tgt==='place'?'Ustawi się w tajemnicy na planszy.':'Zaplanuje rundę '+st.round+'.';
 return '<div class="card" style="text-align:center"><p>Przekaż telefon</p><b style="font:400 36px Bangers,Impact,sans-serif">Gracz '+(H.cur+1)+(p.ch?' ('+p.ch+')':'')+'</b><p>'+what+' Reszta niech nie patrzy.</p></div><button class="go" data-a="hgo">Jestem gotowy</button>'}
const _r7=render;render=function(){_r7();selectOverlay()};
window.addEventListener('click',function(e){
 const t=e.target.closest&&e.target.closest('[data-a="chok"],[data-a="hgo"],[data-a="confirm"],[data-a="vsgo"]');if(!t)return;
 const a=t.dataset.a;if(!H)return;
 if(a==='chok'&&st.scr==='pick'&&!st.chOk){e.stopImmediatePropagation();
  if(!st.ch||taken(st.ch))return;if(isTeam()&&(!st.team||teamCount(st.team)>=2))return;
  const p=H.p[H.cur];p.ch=st.ch;if(isTeam())p.tm=st.team;
  if(H.cur<H.n-1){H.cur++;H.tgt='pick'}else H.tgt='vs';st.scr='hpass';render();return}
 if(a==='vsgo'){e.stopImmediatePropagation();H.cur=0;H.tgt='place';st.scr='hpass';render();return}
 if(a==='hgo'&&H.tgt==='place'){e.stopImmediatePropagation();const p=H.p[H.cur];st.scr='pick';st.chOk=true;st.ch=p.ch;st.team=p.tm||null;st.start=null;render();return}
 if(a==='confirm'&&st.scr==='pick'&&st.chOk){e.stopImmediatePropagation();if(!st.start)return;
  const p=H.p[H.cur];p.start=st.start;p.posr[1]=st.start;
  if(H.cur<H.n-1){H.cur++;H.tgt='place';st.scr='hpass'}else st.scr='hstarts';render();return}},true);
render();
Object.assign(IMG,{"Ciotka":''});
render();
const BGART={};
Object.assign(IMG,{'Wiatrak':''});
Object.assign(CHA,{'Wiatrak':''});
render();
BGART['Długi']="@@asset:img/bgart_dlugi.jpg@@";
const BGPOS={'Wiatrak':'42% 18%','Długi':'35% 30%'};
Object.assign(IMG,{'Długi':"@@asset:img/img_dlugi_2.jpg@@"});
Object.assign(CHA,{'Długi':"@@asset:img/cha_dlugi_2.jpg@@"});
render();
BGART["Wiatrak"]="@@asset:img/bgart_wiatrak.jpg@@";BGPOS["Wiatrak"]="40% 30%";
Object.assign(IMG,{"Wiatrak":"@@asset:img/img_wiatrak_3.jpg@@"});Object.assign(CHA,{"Wiatrak":"@@asset:img/cha_wiatrak_3.jpg@@"});
BGART["\u017byleta"]="@@asset:img/bgart_zyleta.jpg@@";BGPOS["\u017byleta"]="45% 22%";
Object.assign(IMG,{"\u017byleta":"@@asset:img/img_zyleta_2.jpg@@"});Object.assign(CHA,{"\u017byleta":"@@asset:img/cha_zyleta_2.jpg@@"});
render();
BGART["Byku"]="@@asset:img/bgart_byku.jpg@@";BGPOS["Byku"]="55% 25%";
Object.assign(IMG,{"Byku":"@@asset:img/img_byku_2.jpg@@"});Object.assign(CHA,{"Byku":"@@asset:img/cha_byku_2.jpg@@"});
BGART["Ciotka"]="@@asset:img/bgart_ciotka.jpg@@";BGPOS["Ciotka"]="50% 18%";
Object.assign(IMG,{"Ciotka":''});Object.assign(CHA,{"Ciotka":"@@asset:img/cha_ciotka_2.jpg@@"});
render();
Object.assign(IMG,{"Ciotka":''});
render();
Object.assign(IMG,{"Ciotka":"@@asset:img/img_ciotka_5.jpg@@"});
render();
/* --- tło sceny ustawiane tak, by twarz była nad panelem --- */
const FACEPT={'Wiatrak':[375,505],'Długi':[338,490],'Żyleta':[415,365],'Byku':[630,445],'Ciotka':[565,320]};
function fitSelBg(){
 const ov=document.getElementById('selOv');if(!ov||!ov.classList.contains('full'))return;
 const bg=ov.querySelector('.selbg.img'),F=FACEPT[st.ch];if(!bg||!F)return;
 const iw=941,ih=1672,R=ov.getBoundingClientRect(),W=R.width,Hh=R.height;
 const topEl=ov.querySelector('.selteam')||ov.querySelector('.seltop'),info=ov.querySelector('.selinfo');
 const top=topEl.getBoundingClientRect().bottom-R.top,bot=info.getBoundingClientRect().top-R.top+14;
 const ty=top+(bot-top)*0.46,tx=W/2;
 let s=Math.max(W/iw,Hh/ih);
 if(F[1]*s<top+45)s=Math.max(s,(top+45)/F[1]);
 let oy=Math.min(0,Math.max(Hh-ih*s,ty-F[1]*s));
 if(oy+F[1]*s>bot-40){s=Math.max(W/iw,(bot-40)/F[1]);oy=0}
 const ox=Math.min(0,Math.max(W-iw*s,tx-F[0]*s));
 bg.style.backgroundSize='100% 100%,'+(iw*s).toFixed(1)+'px '+(ih*s).toFixed(1)+'px';
 bg.style.backgroundPosition='0 0,'+ox.toFixed(1)+'px '+oy.toFixed(1)+'px';
 bg.style.inset='0';st._face=[ox+F[0]*s,oy+F[1]*s,top,bot]}
const _r8=render;render=function(){_r8();fitSelBg()};
render();
BGART["Pasterz"]="@@asset:img/bgart_pasterz.jpg@@";BGPOS["Pasterz"]='58% 26%';FACEPT["Pasterz"]=[580,445];
Object.assign(IMG,{"Pasterz":"@@asset:img/img_pasterz_3.jpg@@"});Object.assign(CHA,{"Pasterz":"@@asset:img/cha_pasterz_4.jpg@@"});
render();
BGART["Truchel"]="@@asset:img/bgart_truchel.jpg@@";BGPOS["Truchel"]="55% 28%";FACEPT["Truchel"]=[550, 450];
Object.assign(IMG,{"Truchel":"@@asset:img/img_truchel_3.jpg@@"});Object.assign(CHA,{"Truchel":"@@asset:img/cha_truchel_4.jpg@@"});
BGART["Sier\u017cant Przemo"]="@@asset:img/bgart_sierzant_przemo.jpg@@";BGPOS["Sier\u017cant Przemo"]="50% 22%";FACEPT["Sier\u017cant Przemo"]=[500, 375];
Object.assign(IMG,{"Sier\u017cant Przemo":"@@asset:img/img_sierzant_przemo_3.jpg@@"});Object.assign(CHA,{"Sier\u017cant Przemo":"@@asset:img/cha_sierzant_przemo_4.jpg@@"});
render();
BG="@@asset:img/bg_2.jpg@@";
Object.keys(GEO).forEach(k=>delete GEO[k]);Object.assign(GEO,{"0,-3": {"c": [494.2, 179.2], "p": "-76,1 -56,-23 -39,-43 -39,-43 41,-43 51,-31 76,0 51,35 45,43 -44,43 -44,43 -57,26"}, "0,-2": {"c": [494.2, 264.2], "p": "-74,0 -44,-40 -34,-41 -34,-41 43,-40 49,-33 74,-0 54,33 48,40 -48,41 -48,41 -55,32"}, "0,-1": {"c": [494.2, 354.4], "p": "-82,3 -50,-43 -47,-48 -47,-48 47,-48 51,-42 81,2 55,42 51,48 51,48 -52,48 -58,39"}, "-1,-2": {"c": [382.3, 223.3], "p": "-69,0 -38,-38 -34,-42 1,-43 37,-42 48,-29 69,-0 38,42 38,42 -25,43 -25,43 -43,38"}, "-1,-1": {"c": [375.8, 312.8], "p": "-70,5 -35,-42 -33,-45 -33,-45 44,-45 54,-33 68,2 38,44 37,45 37,45 -45,45 -55,31"}, "-1,0": {"c": [368.4, 409.9], "p": "-68,-3 -48,-32 -35,-50 -35,-50 46,-51 65,-24 67,6 44,38 35,50 35,50 -45,51 -55,38"}, "-1,1": {"c": [364.8, 520.6], "p": "-81,0 -64,-24 -39,-59 39,-59 39,-59 65,-22 80,0 54,42 41,59 41,59 -44,59 -67,25"}, "-1,2": {"c": [365.2, 635.3], "p": "-80,-4 -48,-51 -45,-55 42,-55 42,-55 52,-42 80,0 60,29 42,55 -38,55 -38,55 -44,47"}, "-1,3": {"c": [368.4, 743.1], "p": "-74,-1 -48,-46 -42,-53 38,-53 38,-53 49,-38 75,-1 65,17 41,53 -36,53 -36,53 -36,53"}, "1,-3": {"c": [606.5, 223.3], "p": "-69,0 -43,-35 -37,-42 -3,-43 34,-42 44,-31 69,0 43,38 33,43 33,43 -37,43 -49,28"}, "1,-2": {"c": [611.8, 312.8], "p": "-70,-3 -47,-42 -44,-45 33,-45 33,-45 49,-23 70,5 56,30 45,45 -36,45 -36,45 -48,29"}, "1,-1": {"c": [619.5, 409.9], "p": "-76,-7 -48,-48 -45,-50 36,-50 36,-50 58,-18 73,3 58,35 46,50 -35,50 -35,50 -48,33"}, "1,0": {"c": [623.6, 520.6], "p": "-81,1 -72,-12 -40,-59 -40,-59 41,-59 58,-36 81,0 46,57 44,59 -42,59 -42,59 -66,26"}, "1,1": {"c": [622.4, 634.9], "p": "-80,-0 -63,-25 -42,-54 -3,-55 45,-54 54,-43 80,-3 51,39 39,55 39,55 -42,55 -46,50"}, "1,2": {"c": [618.7, 743.1], "p": "-77,0 -59,-24 -36,-53 33,-53 33,-53 55,-35 77,-3 52,31 36,53 36,53 -42,53 -42,53"}, "-2,-1": {"c": [271.7, 271.9], "p": "-70,-1 -47,-29 -31,-48 -31,-48 42,-48 48,-40 69,0 37,43 33,48 33,48 -40,48 -42,46"}, "-2,0": {"c": [262.7, 369.1], "p": "-70,5 -41,-34 -30,-48 -30,-48 42,-48 52,-36 66,-3 35,42 31,48 22,48 -42,48 -47,42"}, "-2,1": {"c": [253.3, 470.8], "p": "-72,4 -49,-27 -31,-52 -31,-52 42,-52 53,-37 70,-6 32,50 30,52 18,52 -39,52 -52,35"}, "-2,2": {"c": [250.0, 577.3], "p": "-71,2 -61,-13 -34,-54 -34,-54 35,-54 60,-16 72,3 64,15 36,54 36,54 -38,54 -47,42"}, "-2,3": {"c": [252.9, 685.9], "p": "-72,-2 -59,-26 -39,-54 34,-54 34,-54 44,-41 71,-1 56,32 41,54 -33,54 -33,54 -33,54"}, "2,-3": {"c": [716.7, 271.9], "p": "-72,-4 -45,-43 -42,-48 32,-48 32,-48 47,-29 70,-1 58,25 41,48 -33,48 -33,48 -47,30"}, "2,-2": {"c": [725.7, 369.1], "p": "-69,-7 -50,-40 -43,-48 30,-48 30,-48 33,-44 68,3 48,40 41,48 -4,48 -31,48 -39,37"}, "2,-1": {"c": [735.1, 470.8], "p": "-70,-8 -47,-45 -42,-52 29,-52 30,-52 60,-11 68,1 61,21 39,52 -7,52 -30,52 -38,40"}, "2,0": {"c": [738.8, 577.3], "p": "-71,0 -44,-41 -35,-54 32,-54 32,-54 48,-32 71,1 52,34 38,54 -38,54 -38,54 -44,46"}, "-3,0": {"c": [162.6, 327.9], "p": "-69,1 -34,-44 -29,-48 -29,-48 42,-48 57,-26 70,-6 42,31 29,48 29,48 -38,48 -45,39"}, "-3,1": {"c": [154.5, 425.9], "p": "-68,1 -51,-20 -29,-48 -11,-49 38,-49 60,-19 63,-0 29,47 29,47 27,49 -35,49 -43,39"}, "-3,2": {"c": [145.9, 528.3], "p": "-68,0 -52,-22 -29,-51 -28,-52 36,-52 56,-24 70,-3 59,13 32,52 32,52 -36,52 -58,21"}, "3,-2": {"c": [833.9, 425.9], "p": "-65,-0 -56,-25 -38,-49 17,-49 29,-48 47,-26 68,1 53,26 35,49 -29,49 -29,49 -32,45"}, "3,-1": {"c": [842.0, 527.9], "p": "-69,-1 -47,-38 -35,-52 29,-52 29,-52 51,-23 70,2 43,43 36,52 -32,52 -32,52 -36,46"}, "3,0": {"c": [844.1, 631.2], "p": "-69,1 -58,-16 -34,-50 33,-50 33,-50 54,-23 68,0 41,39 33,49 -31,50 -31,50 -50,30"}, "0,0": {"c": [494.2, 465.5], "p": "72,0 36,56 -36,56 -72,0 -36,-56 36,-56"}, "0,1": {"c": [494.2, 577.9], "p": "72,0 36,56 -36,56 -72,0 -36,-56 36,-56"}, "0,2": {"c": [494.2, 688.6], "p": "72,0 36,55 -36,55 -72,0 -36,-55 36,-55"}, "0,3": {"c": [494.2, 796.7], "p": "72,0 36,54 -36,54 -72,0 -36,-54 36,-54"}, "-3,3": {"c": [154.5, 632.0], "p": "72,0 36,52 -36,52 -72,0 -36,-52 36,-52"}, "2,1": {"c": [722.0, 688.7], "p": "72,0 36,55 -36,55 -72,0 -36,-55 36,-55"}, "3,-3": {"c": [839.6, 320.4], "p": "72,0 36,53 -36,53 -72,0 -36,-53 36,-53"}});
BAN="@@asset:img/ban_2.jpg@@";
(function(){const d=document.getElementById('bgfx');if(d)d.style.backgroundImage='url('+"@@asset:img/d_style_backgroundimage.jpg@@"+')'})();
