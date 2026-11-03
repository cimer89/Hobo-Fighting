/* ===================== Dźwięk: panel ===================== */
/* --- z części: DŹWIĘK: muzyka + efekty (pliki z audio/ albo dźwięki zastępcze) --- */
/* --- ustawienia dźwięku --- */
function sndPanel(){let el=document.getElementById('sndPanel');if(el){el.remove();return}
 el=document.createElement('div');el.id='sndPanel';const S=SND.S;
 el.innerHTML='<b>DŹWIĘK</b><label>Muzyka<input type="range" min="0" max="1" step="0.05" value="'+S.vol.music+'" data-sv="music"></label><label>Efekty<input type="range" min="0" max="1" step="0.05" value="'+S.vol.sfx+'" data-sv="sfx"></label><button data-smute="1">'+(S.mute?'Włącz dźwięk':'Wycisz wszystko')+'</button><small>'+(Object.keys(SND.files).length?'Pliki z folderu audio: '+Object.keys(SND.files).length:'Dźwięki zastępcze (brak folderu audio)')+'</small>';
 document.body.appendChild(el)}
function sndBtn(){let b=document.getElementById('sndBtn');const show=st.scr!=='splash';if(!show){if(b)b.remove();return}
 if(!b){b=document.createElement('button');b.id='sndBtn';b.setAttribute('aria-label','Ustawienia dźwięku');document.body.appendChild(b)}
 b.textContent=SND.S.mute?'🔇':'🔊'}
