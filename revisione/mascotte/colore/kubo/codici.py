"""Per ogni icona concorrente: i 4 colori principali (k-means in OKLab) con la quota.
Poi la distanza fra il «codice» di ogni marca e il codice di Kubo (blu, visore, bianco, oro)."""
import sys,json,glob; sys.path.insert(0,'.')
import numpy as np
from PIL import Image
from lib import de, fmt_lch
def oklab_arr(rgb):
    c=rgb/255.0; lin=np.where(c<=0.04045,c/12.92,((c+0.055)/1.055)**2.4)
    M1=np.array([[0.4122214708,0.5363325363,0.0514459929],[0.2119034982,0.6806995451,0.1073969566],[0.0883024619,0.2817188376,0.6299787005]])
    M2=np.array([[0.2104542553,0.7936177850,-0.0040720468],[1.9779984951,-2.4285922050,0.4505937099],[0.0259040371,0.7827717662,-0.8086757660]])
    return np.cbrt(lin@M1.T)@M2.T
def kmeans(X,k=4,it=30,seed=0):
    rng=np.random.default_rng(seed); C=X[rng.choice(len(X),k,replace=False)]
    for _ in range(it):
        d=((X[:,None,:]-C[None])**2).sum(-1); l=d.argmin(1)
        C=np.array([X[l==j].mean(0) if (l==j).any() else C[j] for j in range(k)])
    return C,l
def hexx(r): return '#%02x%02x%02x'%tuple(int(round(max(0,min(255,x)))) for x in r)
ic=json.load(open('icone/icone.json'))
res={}
for q,v in ic.items():
    if q.startswith('motion'): continue
    a=np.asarray(Image.open('icone/'+v['file']).convert('RGB').resize((80,80))).reshape(-1,3).astype(float)
    X=oklab_arr(a); best=None
    for s in range(4):
        C,l=kmeans(X,4,seed=s); err=((X-C[l])**2).sum()
        if best is None or err<best[0]: best=(err,C,l)
    _,C,l=best
    cols=[]
    for j in range(4):
        m=l==j
        if m.sum()==0: continue
        cols.append((round(float(m.mean()),2),hexx(np.median(a[m],0))))
    cols.sort(reverse=True); res[v['nome']]=cols
KUBO=[(0.45,'#e2e4fb'),(0.25,'#1f2d65'),(0.2,'#185fea'),(0.1,'#fec72c')]
def dist(A,B):
    # distanza media pesata: ogni colore di A va al più vicino di B, e viceversa
    f=lambda P,Q: sum(w*min(de(c,d) for _,d in Q) for w,c in P)/sum(w for w,_ in P)
    return (f(A,B)+f(B,A))/2
out=[]
for n,cols in res.items(): out.append((round(dist(KUBO,cols),1),n,cols))
out.sort()
for d,n,c in out: print(f"{d:5.1f}  {n[:34]:34s} {c}")
json.dump({'kubo':KUBO,'icone':res,'distanze':[(d,n) for d,n,_ in out]},open('codici.json','w'),indent=1,ensure_ascii=False)
