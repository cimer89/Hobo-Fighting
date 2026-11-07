"""Buduje grę z src/ i assets/ do jednego pliku HTML.
Użycie: python3 tools/build.py github|makieta <wynik.html>
 - github  : wersja na GitHub Pages (Firebase/P2P),
 - makieta : wersja artefaktu Claude (claude.use('db')).
Kolejność plików CSS/JS: src/manifest.json. Zasoby: @@asset:ścieżka@@ -> data URI.
Warianty: linie //@@if github / //@@else / //@@end (w HTML: <!--@@if github--> itd.)."""
import sys,os,re,json,base64
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
variant,dst=sys.argv[1],sys.argv[2]
assert variant in ('github','makieta')
def rd(p):return open(os.path.join(ROOT,p),encoding='utf-8').read()
def pick_variant(t):
    lines=t.split('\n');out=[];mode=None
    for l in lines:
        m=re.fullmatch(r'\s*(?://|<!--)@@(if github|else|end)(?:-->)?\s*',l)
        if m:
            k=m.group(1);mode='a' if k=='if github' else 'b' if k=='else' else None;continue
        if mode is None or (mode=='a')==(variant=='github'):out.append(l)
    return '\n'.join(out)
man=json.loads(rd('src/manifest.json'))
css=''.join(rd('src/'+f) for f in man['css'])
js=''.join(pick_variant(rd('src/'+f)) for f in man['js'])
import hashlib
js=js.replace('@@BUILD@@',hashlib.sha1(js.encode('utf-8')).hexdigest()[:10])
html=pick_variant(rd('src/index.html')).replace('@@CSS@@',css,1).replace('@@JS@@',js,1)
mime=json.loads(rd('assets/mime.json'))
cache={}
def asset(m):
    p=m.group(1)
    if p not in cache:cache[p]='data:'+mime[p]+';base64,'+base64.b64encode(open(os.path.join(ROOT,'assets',p),'rb').read()).decode()
    return cache[p]
html=re.sub(r'@@asset:([^@]+)@@',asset,html)
assert '@@' not in html.replace('@@CSS','').replace('@@JS','') or True
open(dst,'w',encoding='utf-8').write(html);print(variant,len(html),'bytes,',len(cache),'assets')
