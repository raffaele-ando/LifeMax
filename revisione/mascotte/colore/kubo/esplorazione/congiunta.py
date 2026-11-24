import sys,itertools; sys.path.insert(0,'.')
from lib import *
sup2=hx(0.955,0.007,80); s1=hx(0.215,0.022,270); s2=hx(0.26,0.025,270)
oro=hx(0.856,0.165,87)
def mn(S,ex):
    return min(min(de(S[a],S[b]),ded(S[a],S[b]),dep(S[a],S[b])) for a,b in itertools.combinations(S,2) if not {a,b}<=ex)
for sh in (150,158,165,172,180):
  bl=max(((mn({'az':hx(0.50,0.23,262),'successo':hx(sL,sC,sh),'errore':hx(eL,0.16,eh),'oro':oro},set()),sL,sC,eL,eh)
          for sL in (0.52,0.56,0.60,0.64) for sC in (0.12,0.14) for eL in (0.40,0.42,0.45) for eh in (25,32,38)
          if cr(hx(sL,sC,sh),sup2)>=3), key=lambda r:r[0])
  bd=max(((mn({'az':hx(azL,0.13,262),'pieno':hx(0.50,0.23,262),'successo':hx(sL,sC,sh),'errore':hx(eL,0.14,bl[4]),'oro':oro},{'az','pieno'}),sL,sC,eL,azL)
          for sL in (0.68,0.72,0.76,0.80,0.84) for sC in (0.12,0.15) for eL in (0.55,0.57) for azL in (0.70,0.74)
          if cr(hx(eL,0.14,bl[4]),s2)>=3 and cr(hx(sL,sC,sh),s1)>=4.5), key=lambda r:r[0])
  print(sh,'chiaro',[round(bl[0],1)]+list(bl[1:]),'scuro',[round(bd[0],1)]+list(bd[1:]))
