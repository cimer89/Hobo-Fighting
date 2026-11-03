"""Jednorazowe: rozkłada zbudowany index.html na źródła (src/) i zasoby (assets/).
Użycie: python3 tools/extract.py <zbudowany.html> <katalog_repo>"""
import re,sys,os,base64,hashlib,json,unicodedata
src,root=sys.argv[1],sys.argv[2]
s=open(src,encoding='utf-8').read()
EXT={'image/webp':'webp','image/jpeg':'jpg','image/png':'png','audio/mpeg':'mp3','image/svg+xml':'svg','audio/wav':'wav','image/gif':'gif'}
names={};used=set();byhash={}
def slug(x):
    x=unicodedata.normalize('NFKD',x.encode().decode('unicode_escape') if '\\u' in x else x)
    x=''.join(c for c in x if not unicodedata.combining(c)).replace('ł','l').replace('Ł','L')
    return re.sub(r'[^A-Za-z0-9]+','_',x).strip('_').lower() or 'x'
def ctxname(pre):
    pre=re.sub(r'@@asset:[^@]*@@','D',pre)
    pats=[r'Object\.assign\(\s*([A-Za-z_]\w*)',r'([A-Za-z_]\w*(?:\.\w+)*)\s*\[\s*["\'][^"\']+["\']\s*\]\s*=',r'([A-Za-z_]\w*(?:\.\w+)*)\s*=\s*(?=[{\[\'"(])',r'function\s+([A-Za-z_]\w*)']
    best=(-1,'asset')
    for p in pats:
        for m in re.finditer(p,pre):
            if m.start()>best[0]:best=(m.start(),m.group(1))
    o=best[1];after=pre[best[0]:] if best[0]>=0 else pre
    keys=list(re.finditer(r'["\']([^"\'\n]{1,40})["\']\s*[:\]]\s*',after))
    k='';idx=''
    if keys:
        km=keys[-1];k=km.group(1);rest=after[km.end():]
        if rest.lstrip().startswith('['):idx=str(rest.count('D'))
        elif rest.lstrip().startswith('{'):
            sub=re.findall(r'["\'](\w{1,3})["\']\s*:\s*["\']?$',rest);idx=sub[-1] if sub else ''
    return '_'.join(x for x in [slug(o),slug(k) if k else '',idx] if x)
def rep2(mime,data,pre):
    raw=base64.b64decode(data)
    assert base64.b64encode(raw).decode()==data,'base64 niekanoniczne'
    h=hashlib.sha1(raw).hexdigest()
    if h in byhash: return '@@asset:'+byhash[h]+'@@'
    base=ctxname(pre);ext=EXT.get(mime,'bin');sub={'webp':'img','jpg':'img','png':'img','svg':'img','gif':'img','mp3':'audio','wav':'audio'}.get(ext,'bin')
    n=f'{sub}/{base}.{ext}';i=2
    while n in used: n=f'{sub}/{base}_{i}.{ext}';i+=1
    used.add(n);byhash[h]=n
    os.makedirs(os.path.join(root,'assets',sub),exist_ok=True)
    open(os.path.join(root,'assets',n),'wb').write(raw)
    names[n]=mime
    return '@@asset:'+n+'@@'
DATA=re.compile(r'data:([a-z]+/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=]+)')
out=[];last=0
for m in DATA.finditer(s):
    out.append(s[last:m.start()]);last=m.end()
    tail=''.join(out[-600:])[-30000:]
    class M:pass
    out.append(rep2(m.group(1),m.group(2),tail))
out.append(s[last:]);s2=''.join(out)
json.dump(names,open(os.path.join(root,'assets','mime.json'),'w'),indent=0,sort_keys=True)
# szkielet
a=s2.index('<style>')+len('<style>');b=s2.index('</style>')
c=s2.index('<script>')+len('<script>');d=s2.rindex('</script>')
css,js=s2[a:b],s2[c:d]
skel=s2[:a]+'@@CSS@@'+s2[b:c]+'@@JS@@'+s2[d:]
os.makedirs(os.path.join(root,'src'),exist_ok=True)
open(os.path.join(root,'src','index.html'),'w').write(skel)
def split(text,pat,dirn,ext):
    cuts=[0]+[m.start() for m in re.finditer(pat,text,re.M) if m.start()>0]+[len(text)]
    os.makedirs(os.path.join(root,'src',dirn),exist_ok=True);files=[]
    for i in range(len(cuts)-1):
        part=text[cuts[i]:cuts[i+1]];h=re.match(r'/\*\s*=+\s*(.*?)\s*=*\s*\*/',part.lstrip('\n'))
        nm=f'{i:03d}-'+(slug(h.group(1))[:48] if h else 'start')+'.'+ext
        open(os.path.join(root,'src',dirn,nm),'w').write(part);files.append(dirn+'/'+nm)
    return files
cf=split(css,r'^/\* ={3,}','css','css');jf=split(js,r'^/\* ={3,}','js','js')
open(os.path.join(root,'src','manifest.json'),'w').write(json.dumps({'css':cf,'js':jf},indent=1,ensure_ascii=False))
print('assets',len(names),'css files',len(cf),'js files',len(jf))
