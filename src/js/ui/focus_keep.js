/* ===================== Fokus pól tekstowych ===================== */
/* Zewnętrzna warstwa renderu (ostatnia w manifeście): gdy ekran przebuduje się w trakcie pisania (np. sygnał z serwera,
   odświeżenie lobby), nowe pole o tym samym id dostaje z powrotem treść, kursor i fokus – klawiatura telefonu się nie chowa. */
addRender('ui/focus_keep',inner=>function(){
 const a=typing()?document.activeElement:null,id=a&&a.id,v=a&&a.value,s0=a&&a.selectionStart,s1=a&&a.selectionEnd;
 const out=inner.apply(this,arguments);
 if(id){const n=document.getElementById(id);if(n&&n!==a){n.value=v;try{n.focus({preventScroll:true});n.setSelectionRange(s0,s1)}catch(e){}}}
 return out});
