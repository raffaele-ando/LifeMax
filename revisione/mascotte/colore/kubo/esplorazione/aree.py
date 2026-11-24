import sys,itertools,random,json; sys.path.insert(0,'..')
from lib import *
random.seed(11)
fissi={'azione':hx(0.50,0.23,262),'kubo-blu':'#185fea','successo':hx(0.60,0.12,172),'errore':hx(0.40,0.16,38),'oro':hx(0.856,0.165,87)}
W='#ffffff'; pag=hx(0.975,0.006,80); sup2=hx(0.955,0.007,80); dsup=hx(0.215,0.022,270)
fin=dict(Studio=(290,315),Salute=(42,62),Relazioni=(350,375),Finanze=(95,120),Associazioni=(195,228),Founder=(318,345),Lavoro=(125,150),Altro=(40,100))
Cr={k:(0.07,0.14) for k in fin}; Cr['Altro']=(0.0,0.03); Cr['Relazioni']=(0.05,0.10)
def ok(h): return min(cr(h,W),cr(h,pag),cr(h,sup2))>=3.0
def scuro(L,C,H): return hx(min(L+0.22,0.86),C*0.95,H)
def punteggio(A):
    allc=dict(fissi); allc.update(A)
    aa=[de(A[a],A[b]) for a,b in itertools.combinations(A,2)]
    af=[de(A[a],fissi[f]) for a in A for f in fissi]
    aad=[ded(A[a],A[b]) for a,b in itertools.combinations(A,2)]
    afd=[ded(A[a],fissi[f]) for a in A for f in fissi]
    return min(min(aa),min(af)*0.9, min(aad)*1.6, min(afd)*1.3), (min(aa),min(af),min(aad),min(afd))
def campiona(k,cur=None,s=1.0):
    while True:
        if cur: L,C,H=cur; L=min(0.64,max(0.47,L+random.gauss(0,0.02*s))); C=min(Cr[k][1],max(Cr[k][0],C+random.gauss(0,0.01*s))); H=min(fin[k][1],max(fin[k][0],H+random.gauss(0,3*s)))%360
        else: L=random.uniform(0.47,0.64); C=random.uniform(*Cr[k]); H=random.uniform(*fin[k])%360
        h=hx(L,C,H)
        if ok(h) and cr(scuro(L,C,H),dsup)>=3: return (L,C,H)
bestP=None
for rip in range(14):
    P={k:campiona(k) for k in fin}
    sc,_=punteggio({k:hx(*v) for k,v in P.items()})
    for it in range(3500):
        k=random.choice(list(fin)); Q=dict(P); Q[k]=campiona(k,P[k],1.5 if it<2200 else .6)
        s2,_=punteggio({kk:hx(*v) for kk,v in Q.items()})
        if s2>=sc: P,sc=Q,s2
    if not bestP or sc>bestP[0]: bestP=(sc,P)
sc,P=bestP
A={k:hx(*v) for k,v in P.items()}
print('punteggio',round(sc,2),[round(x,1) for x in punteggio(A)[1]])
for k,v in P.items(): print(f"{k:13s} {A[k]} L{v[0]:.3f} C{v[1]:.3f} h{v[2]:.0f}  su bianco {cr(A[k],W):.2f}  scuro {scuro(*v)} {cr(scuro(*v),dsup):.2f}")
json.dump({k:[round(x,4) for x in v] for k,v in P.items()},open('aree_kubo.json','w'),indent=1)
