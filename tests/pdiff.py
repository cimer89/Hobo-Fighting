import sys,os
from PIL import Image,ImageChops
import numpy as np
a,b=sys.argv[1],sys.argv[2];worst=0
for f in sorted(os.listdir(a)):
    if not f.endswith('.png'):continue
    if not os.path.exists(os.path.join(b,f)):print(f,'MISSING');continue
    x=np.asarray(Image.open(os.path.join(a,f)).convert('RGB')).astype(int);y=np.asarray(Image.open(os.path.join(b,f)).convert('RGB')).astype(int)
    if x.shape!=y.shape:print(f,'SIZE',x.shape,y.shape);continue
    d=np.abs(x-y).max(axis=2);pct=(d>24).mean()*100;worst=max(worst,pct)
    print(f'{f:22s} {pct:6.3f}% px differ')
print('WORST',round(worst,3))
