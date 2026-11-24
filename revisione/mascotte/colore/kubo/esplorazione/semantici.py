import sys,itertools; sys.path.insert(0,'.')
from lib import *
sup2=hx(0.955,0.007,80); s1d=hx(0.215,0.022,270); s2d=hx(0.26,0.025,270)
B=hx(0.50,0.23,262); Bd=hx(0.74,0.13,262); ORO=hx(0.856,0.165,87)
def m(S,ex):
    ps=[(a,b) for a,b in itertools.combinations(S,2) if not {a,b}<=ex]
    return tuple(min(f(S[a],S[b]) for a,b in ps) for f in (de,ded,dep,det))
best=[]
for sL in (0.56,0.60,0.64):
 for sh in (135,142,150,158):
  for eL in (0.42,0.45,0.48):
   for eh in (25,30,38):
    S={'az':B,'successo':hx(sL,0.14,sh),'errore':hx(eL,0.16,eh),'oro':ORO}
    if cr(S['successo'],sup2)<3 or cr(S['errore'],sup2)<4.5: continue
    for dsL in (0.68,0.72,0.76):
     for deL in (0.55,0.58,0.62):
      D={'az':Bd,'pieno':B,'successo':hx(dsL,0.15,sh),'errore':hx(deL,0.13,eh),'oro':ORO}
      if cr(D['errore'],s2d)<3 or cr(D['successo'],s1d)<4.5: continue
      a=m(S,set()); b=m(D,{'az','pieno'})
      best.append((min(a[:3]+b[:3]),[round(x,1) for x in a],[round(x,1) for x in b],sL,sh,eL,eh,dsL,deL))
best.sort(key=lambda r:-r[0])
for r in best[:8]: print(r)
