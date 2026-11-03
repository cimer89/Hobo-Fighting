import json,sys
a=json.load(open(sys.argv[1]));b=json.load(open(sys.argv[2]));skip_snap='--nosnap' in sys.argv
bad=0
if not skip_snap:
    d=[k for k in set(a['snap'])|set(b['snap']) if a['snap'].get(k)!=b['snap'].get(k)]
    print('snap differences:',len(d),sorted(d)[:40]);bad+=len(d)
for sec in ('engine','mb','flow'):
    n=0;tot=0
    for k in a[sec]:
        tot+=len(a[sec][k])
        if a[sec][k]!=b[sec].get(k):
            x=[i for i,(u,v) in enumerate(zip(a[sec][k],b[sec].get(k,[]))) if u!=v];n+=len(x) or 1
            print(' ',sec,k,'diff at',x[:8])
    print(sec,'cases',tot,'differences',n);bad+=n
print('page errors',a['errs'],b['errs'])
print('RESULT','IDENTICAL' if bad==0 else 'DIFFERENT')
