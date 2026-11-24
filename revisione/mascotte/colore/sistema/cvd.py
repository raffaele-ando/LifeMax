import math,json,os,itertools
D=os.path.dirname(os.path.abspath(__file__))
M={'normale':None,
 'deuteranopia':[[0.367322,0.860646,-0.227968],[0.280085,0.672501,0.047413],[-0.011820,0.042940,0.968881]],
 'protanopia':[[0.152286,1.052583,-0.204868],[0.114503,0.786281,0.099216],[-0.003882,-0.048116,1.051998]],
 'tritanopia':[[1.255528,-0.076749,-0.178779],[-0.078411,0.930809,0.147602],[0.004733,0.691367,0.303900]]}
def h(c): c=c.lstrip('#'); return [int(c[i:i+2],16)/255 for i in (0,2,4)]
def lin(x): return x/12.92 if x<=0.04045 else ((x+0.055)/1.055)**2.4
def unlin(x): x=max(0,min(1,x)); return 12.92*x if x<=0.0031308 else 1.055*x**(1/2.4)-0.055
def sim(c,m):
    l=[lin(x) for x in h(c)]
    if m is None: return l
    return [max(0,min(1,sum(m[i][j]*l[j] for j in range(3)))) for i in range(3)]
def oklab(l):
    r,g,b=l
    L=0.4122214708*r+0.5363325363*g+0.0514459929*b; Mm=0.2119034982*r+0.6806995451*g+0.1073969566*b; S=0.0883024619*r+0.2817188376*g+0.6299787005*b
    L,Mm,S=[math.copysign(abs(x)**(1/3),x) for x in (L,Mm,S)]
    return [0.2104542553*L+0.7936177850*Mm-0.0040720468*S,1.9779984951*L-2.4285922050*Mm+0.4505937099*S,0.0259040371*L+0.7827717662*Mm-0.8086757660*S]
def dE(a,b,m): A=oklab(sim(a,m));B=oklab(sim(b,m)); return 100*math.dist(A,B)
def tohex(l): return '#'+''.join('%02x'%round(unlin(x)*255) for x in l)
SET={
 'light':{'Studio':'#2a78d6','Salute':'#008300','Relazioni':'#e87ba4','Finanze':'#eda100','Associazioni':'#1baf7a','Founder':'#eb6834','Lavoro':'#4a3aa7','Altro':'#e34948',
          'ACCENTO':'#5b4ff5','OK (fatto)':'#16b364','OK-pieno':'#0a7a42','CRITICO':'#d03b3b','AVVISO':'#fab219','FIAMMA':'#eb6834','ORA-tl':'#3a63d6','SERIE-1':'#2a78d6','Mascotte':'#d9445a','Mascotte-oro':'#f5b440'},
 'dark':{'Studio':'#5aa2f0','Salute':'#3fb950','Relazioni':'#ee8db2','Finanze':'#f2b53b','Associazioni':'#33c792','Founder':'#f2804f','Lavoro':'#9085e9','Altro':'#ee7a79',
          'ACCENTO':'#8f87ff','OK (fatto)':'#16b364','OK-pieno':'#0f7a2e','CRITICO':'#e85c56','AVVISO':'#fab219','FIAMMA':'#eb6834','SERIE-1':'#3987e5','Mascotte':'#d9445a','Mascotte-oro':'#f5b440'}}
out={}
for tema,S in SET.items():
    print('\n=== ',tema)
    for mn,m in M.items():
        coppie=[]
        for (a,ca),(b,cb) in itertools.combinations(S.items(),2):
            if a in('SERIE-1',) and b=='Studio' or (a,b)==('Founder','FIAMMA'): pass
            coppie.append((dE(ca,cb,m),a,b))
        coppie.sort()
        vicine=[c for c in coppie if c[0]<12]
        print(mn, ' | '.join('%s~%s %.1f'%(a,b,d) for d,a,b in vicine))
        out.setdefault(tema,{})[mn]={k:tohex(sim(v,m)) for k,v in S.items()}
json.dump(out,open(os.path.join(D,'cvd.json'),'w'),indent=1)
