import sys,itertools; sys.path.insert(0,'.')
from lib import *
s1=hx(0.215,0.007,60); sup2=hx(0.955,0.007,80)
def mins(S):
    ps=[(a,b) for a,b in itertools.combinations(S,2) if {a,b}!={'az','segno'}]
    return min(de(S[a],S[b]) for a,b in ps), min(ded(S[a],S[b]) for a,b in ps), min(dep(S[a],S[b]) for a,b in ps)
res=[]
for sh in (138,145,152,160,168,175):
  # chiaro
  bl=None
  for sL in (0.56,0.60,0.64):
    for eL in (0.42,0.45):
      for eh in (35,40,45):
        S={'az':hx(0.53,0.19,332),'segno':hx(0.58,0.19,332),'successo':hx(sL,0.14,sh),'errore':hx(eL,0.16,eh),'oro':hx(0.80,0.15,85)}
        if cr(S['successo'],sup2)<3: continue
        m=mins(S); 
        if not bl or min(m)>min(bl[0]): bl=(m,sL,eL,eh)
  bd=None
  for sL in (0.66,0.70,0.74,0.78):
    for eL in (0.62,0.66):
      for oL in (0.86,0.90):
        S={'az':hx(0.79,0.11,332),'segno':hx(0.58,0.19,332),'successo':hx(sL,0.15,sh),'errore':hx(eL,0.14,bl[3]),'oro':hx(oL,0.14,88)}
        if cr(S['errore'],s1)<4.5 or cr(S['successo'],s1)<4.5: continue
        m=mins(S)
        if not bd or min(m)>min(bd[0]): bd=(m,sL,eL,oL)
  print(sh,'chiaro',[round(x,1) for x in bl[0]],bl[1:],'| scuro',[round(x,1) for x in bd[0]],bd[1:])
