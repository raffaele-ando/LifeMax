import sys,itertools; sys.path.insert(0,'.')
from lib import *
sup2=hx(0.955,0.007,75)
def cerca(BH,BL,SB):
  best=[]
  for sL in (0.52,0.56,0.60,0.64):
   for sh in (135,145,152,160):
    for eL in (0.44,0.47,0.50,0.53):
     for eh in (5,15,25,32,38,45):
      S={'marca':hx(BL,0.15,BH),'segno':hx(SB,0.15,BH),'successo':hx(sL,0.14,sh),'errore':hx(eL,0.16,eh),'oro':hx(0.80,0.15,85)}
      if cr(S['successo'],sup2)<3 or cr(S['errore'],sup2)<3 or cr('#ffffff',S['marca'])<4.5: continue
      ps=[(a,b) for a,b in itertools.combinations(S,2) if {a,b}!={'marca','segno'}]
      mn=min(de(S[a],S[b]) for a,b in ps); md=min(ded(S[a],S[b]) for a,b in ps)
      best.append((min(mn,md*1.5),round(mn,1),round(md,1),sL,sh,eL,eh,S['marca'],S['segno'],S['errore']))
  best.sort(reverse=True); return best[:3]
print('B ottanio 215'); [print(r) for r in cerca(215,0.50,0.56)]
print('C terracotta 42'); [print(r) for r in cerca(42,0.55,0.62)]
