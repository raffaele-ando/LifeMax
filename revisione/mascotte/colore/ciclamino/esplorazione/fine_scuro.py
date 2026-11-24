import sys,itertools; sys.path.insert(0,'.')
from lib import *
s1=hx(0.215,0.007,60); best=[]
for eL in (0.62,0.64,0.66,0.68):
 for eC in (0.12,0.14):
  for sL in (0.70,0.73,0.76,0.79):
   for sh in (138,145,150,155):
    for oL in (0.84,0.87,0.90):
     for oC in (0.11,0.13,0.15):
      for oh in (85,92):
       S={'azione-linea':hx(0.79,0.11,332),'segno':hx(0.58,0.19,332),'successo':hx(sL,0.15,sh),'errore':hx(eL,eC,40),'oro':hx(oL,oC,oh)}
       if cr(S['errore'],s1)<4.5 or cr(S['successo'],s1)<4.5: continue
       ps=[(a,b) for a,b in itertools.combinations(S,2) if {a,b}!={'azione-linea','segno'}]
       mn=min(de(S[a],S[b]) for a,b in ps); md=min(ded(S[a],S[b]) for a,b in ps); mp=min(dep(S[a],S[b]) for a,b in ps)
       best.append((min(mn,md,mp),round(mn,1),round(md,1),round(mp,1),eL,eC,sL,sh,oL,oC,oh))
best.sort(reverse=True)
for r in best[:8]: print(r)
