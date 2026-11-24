import sys,itertools; sys.path.insert(0,'.')
from lib import *
best=[]
sup2=hx(0.955,0.007,75)
for BH in (330,335,340):
 for sL in (0.56,0.58,0.60,0.62,0.64):
  for sh in (145,152,160,168,175):
   for eL in (0.44,0.47,0.50,0.53):
    for eh in (25,30,35,40,45):
      S={'marca':hx(0.53,0.19,BH),'segno':hx(0.58,0.19,BH),'successo':hx(sL,0.14,sh),'errore':hx(eL,0.16,eh),'oro':hx(0.80,0.15,85)}
      if cr(S['successo'],sup2)<3 or cr(S['errore'],sup2)<3: continue
      ps=[(a,b) for a,b in itertools.combinations(S,2) if {a,b}!={'marca','segno'}]
      mn=min(de(S[a],S[b]) for a,b in ps); md=min(ded(S[a],S[b]) for a,b in ps); mp=min(dep(S[a],S[b]) for a,b in ps)
      best.append((min(mn,md*1.5),mn,md,mp,BH,sL,sh,eL,eh))
best.sort(reverse=True)
for r in best[:12]: print([round(x,2) if isinstance(x,float) else x for x in r])
