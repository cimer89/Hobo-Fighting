
/* --- podnoszenie przedmiotu --- */

/* --- pasek informacji z drużyną --- */

/* --- obsługa kliknięć (przed starszymi obsługami) --- */
addClick('modes/teams_init',window,function(e){
 const t=e.target.closest&&e.target.closest('[data-tm],[data-a="modeback"],[data-a="create"],[data-a="joinb"],[data-a="hgo"],[data-team],[data-a="confirm"],[data-a="chok"]');if(!t)return;
 const d=t.dataset;
 if(d.tm){st.tm2=d.tm;e.stopImmediatePropagation();render();return}
 if(d.a==='modeback'&&st.tm2){st.tm2=null;e.stopImmediatePropagation();render();return}
 if(d.a==='create'&&net.db){const L='ACDEFGHJKLMNPQRUVWXYZ',R='ABCDEFGHJKLMNPQRTUVWXYZ3456789',pk=s=>s[Math.floor(Math.random()*s.length)];
  const code=(st.gm==='special'?'S':st.gm==='test'?'T':pk(L))+(isTeam()?'2':pk(R))+pk(R)+pk(R);e.stopImmediatePropagation();st.team=null;join(code);return}
 if(d.a==='joinb'){const el=document.getElementById('code'),v=((el&&el.value)||'').trim().toUpperCase();if(v.length===4)st.tm2=v[1]==='2'?'2v2':'ffa';st.team=null;return}
 if(d.a==='hgo'){st.team=null;return}
 if(d.team){if(teamCount(d.team)<2)st.team=d.team;e.stopImmediatePropagation();render();return}
 if(d.a==='chok'&&isTeam()&&(!st.team||teamCount(st.team)>=2)){e.stopImmediatePropagation();render();return}
 if(d.a==='confirm'&&isTeam()){const q=H?H.p[H.cur]:ME;if(q)q.tm=st.team}},true);
render();
Object.assign(CHA,{"Pasterz": '', "Truchel": '', "Sierżant Przemo": ''});
render();
