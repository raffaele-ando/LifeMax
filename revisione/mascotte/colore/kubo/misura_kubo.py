import sys,glob,math,json; sys.path.insert(0,'.')
import numpy as np
from PIL import Image
K='../../kubo-zip/kubo/'
fs=sorted(glob.glob(K+'*.png'))
def to_oklab(rgb):
    c=rgb/255.0; lin=np.where(c<=0.04045,c/12.92,((c+0.055)/1.055)**2.4)
    M1=np.array([[0.4122214708,0.5363325363,0.0514459929],[0.2119034982,0.6806995451,0.1073969566],[0.0883024619,0.2817188376,0.6299787005]])
    lms=np.cbrt(lin@M1.T)
    M2=np.array([[0.2104542553,0.7936177850,-0.0040720468],[1.9779984951,-2.4285922050,0.4505937099],[0.0259040371,0.7827717662,-0.8086757660]])
    return lms@M2.T
def hexx(r): return '#%02x%02x%02x'%tuple(int(round(x)) for x in r)
out={}
for i in (0,1,4,15,16,19):
    a=np.asarray(Image.open(fs[i]).convert('RGB')).reshape(-1,3).astype(float)
    lab=to_oklab(a); L=lab[:,0]; C=np.hypot(lab[:,1],lab[:,2]); H=(np.degrees(np.arctan2(lab[:,2],lab[:,1]))+360)%360
    cls={
     'blu_accento': (C>0.15)&(H>245)&(H<275)&(L>0.45),
     'visore': (L<0.36)&(H>240)&(H<290)&(C>0.04),
     'giallo': (C>0.12)&(H>70)&(H<100),
     'corpo_mezzitoni': (L>0.86)&(L<0.95)&(C>0.015)&(H>255)&(H<300),
     'fondo': (L>0.985),
    }
    r={}
    for k,m in cls.items():
        if m.sum()==0: continue
        sel=a[m]; med=np.median(sel,axis=0); p=lambda q: hexx(np.percentile(sel,q,axis=0))
        Lm,Cm,Hm=np.median(L[m]),np.median(C[m]),np.median(H[m])
        r[k]={'mediana':hexx(med),'p10':p(10),'p90':p(90),'L':round(float(Lm),3),'C':round(float(Cm),3),'h':round(float(Hm),1),'quota':round(float(m.mean()),4)}
    out[i]=r
    print(i, {k:(v['mediana'],v['L'],v['C'],v['h'],v['quota']) for k,v in r.items()})
json.dump(out,open('misure-kubo.json','w'),indent=1)
