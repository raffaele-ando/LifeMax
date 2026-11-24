import json,math,sys
from PIL import Image
sys.path.insert(0,'.')
from palette import oklab,rgb2hex
ic=json.load(open('icone/icone.json'))
res={}
for q,v in ic.items():
    if q.startswith('motion'): continue
    im=Image.open('icone/'+v['file']).convert('RGB').resize((96,96))
    px=list(im.getdata())
    # escludi i bordi arrotondati non c'e' (jpg quadrato). Classifica per tinta OKLCH
    bins={}
    neutri=0
    for p in px:
        L,a,b=oklab(rgb2hex(p))
        C=math.hypot(a,b)
        if C<0.04: neutri+=1; continue
        h=math.degrees(math.atan2(b,a))%360
        k=int(h//15)
        bins.setdefault(k,[]).append((L,a,b,p))
    tot=len(px)
    if not bins: res[q]={'dominante':None,'quota':0,'neutri':neutri/tot}; continue
    k=max(bins,key=lambda k:len(bins[k]))
    grp=bins[k]
    # aggiungi i bin vicini
    for kk in (k-1,k+1):
        grp=grp+bins.get(kk%24,[])
    grp.sort(key=lambda x:x[0]); m=grp[len(grp)//2]
    L,a,b,p=m
    res[q]={'nome':v['nome'],'dominante':rgb2hex(p),'L':round(L,2),'C':round(math.hypot(a,b),3),'h':round(math.degrees(math.atan2(b,a))%360),'quota_colore':round(len(grp)/tot,2),'neutri':round(neutri/tot,2)}
    print(f"{v['nome'][:34]:34s} {rgb2hex(p)} L{L:.2f} C{math.hypot(a,b):.3f} h{math.degrees(math.atan2(b,a))%360:5.0f}  colore {len(grp)/tot:.2f} neutri {neutri/tot:.2f}")
json.dump(res,open('icone/dominanti.json','w'),indent=1,ensure_ascii=False)
