import sys,itertools; sys.path.insert(0,'.')
from lib import *
sup2=hx(0.955,0.007,75); best=[]
for BH in (332,335,338):
 for BC in (0.17,0.19):
  for SG in (0.58,0.60):
   for sL in (0.58,0.60,0.62):
    for sh in (138,142,146,150):
     for eL in (0.42,0.44,0.46):
      for eh in (35,40,45):
       S={'marca':hx(0.53,BC,BH),'segno':hx(SG,BC,BH),'successo':hx(sL,0.14,sh),'errore':hx(eL,0.16,eh),'oro':hx(0.80,0.15,85)}
       if cr(S['successo'],sup2)<3 or cr(S['errore'],sup2)<4.5: continue
       ps=[(a,b) for a,b in itertools.combinations(S,2) if {a,b}!={'marca','segno'}]
       mn=min(de(S[a],S[b]) for a,b in ps); md=min(ded(S[a],S[b]) for a,b in ps); mp=min(dep(S[a],S[b]) for a,b in ps)
       best.append((min(mn,md,mp),round(mn,1),round(md,1),round(mp,1),BH,BC,SG,sL,sh,eL,eh))
best.sort(reverse=True)
for r in best[:8]: print(r)
