/* ===================== Silnik: bonusy postaci (koło) ===================== */
/* --- z części: BONUSY POSTACI --- */
function bonusUsable(p){return !!p.bon&&(p.bonR===undefined||p.bonR<st.round)}
function bonName(k){return {1:'+1 HP',2:'+1 DMG',3:'Dodatkowy ruch',4:'Tarcza',6:'Refleks'}[k]||String(k)}
function posPh2(q){const r=st.round,pl=q.plans&&q.plans[r];let p=q.posr[r];if(!pl)return p;if(pl[0]&&pl[0].t==='move'&&pl[0].m)p=pl[0].m;if(pl[1]&&pl[1].t==='move'&&pl[1].m)p=pl[1].m;return p}
function pickFrom(pk){const it=curItems().find(o=>o.id===pk.id);if(!it)return null;if(pk.kind==='dg')return posPh2(it.q);const x=resolve(curItems())[pk.id];return x?x.pos:null}
function applyRoll(id,v){const p=playerOf(id);if(!p)return;
 const x=resolve(curItems())[id];const eff=x?x.eff:0;
 p.rolled=p.rolled||{};p.rolled[st.round]=true;
 if(v===1){if(eff<MAXHP(p.ch)){p.hpo=p.hpo||{};p.hpo[st.round]=Math.min(MAXHP(p.ch),eff+1)}}
 else if(v>=2&&v<=6&&v!==5){p.bon={k:v};p.bonR=st.round}
 saveP(p)}
/* --- z części: TRYBY GRY + TRYB SPECJALNY (przedmioty na mapie) --- */
function bonusSpent(q,x,r){const b=q.bon;if(!b)return false;if(!(q.bonR===undefined||q.bonR<r))return false;if(b.k===4)return !!x.shUsed;if(b.k===2)return !!x.dmgbUsed;return false}
