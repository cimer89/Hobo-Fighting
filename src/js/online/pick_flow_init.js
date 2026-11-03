window.addEventListener('click',function(e){
 if(H||!net.db)return;
 const t=e.target.closest&&e.target.closest('[data-a="chok"],[data-a="vsgo"],[data-a="cback"]');if(!t)return;
 const a=t.dataset.a;e.stopImmediatePropagation();
 if(a==='chok'){if(st.chOk||st.cwait||!st.ch||taken(st.ch))return;if(isTeam()&&(!st.team||teamCount(st.team)>=2))return;
  ME.ch=st.ch;if(isTeam())ME.tm=st.team;ME.chready=true;save();st.cwait=true;render();return}
 if(a==='cback'){ME.chready=false;save();st.cwait=false;render();return}
 if(a==='vsgo'){st.cwait=false;st.chOk=true;st.ch=ME.ch;st.team=ME.tm||null;st.start=null;render();return}},true);
render();
