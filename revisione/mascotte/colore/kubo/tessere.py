"""Colori di fondo delle tessere-emozione del foglio 6 (25 tessere con nome)."""
import sys,glob,json; sys.path.insert(0,'.')
import numpy as np
from PIL import Image
from lib import fmt_lch, de, ded, lch
fs=sorted(glob.glob('../../kubo-zip/kubo/*.png'))
im=Image.open(fs[6]).convert('RGB').resize((900,900)); a=np.asarray(im).astype(float)
nomi=['Felice','Energico','Concentrato','Motivato','Stanco','Frustrato','Confuso','Sorreso','Soddisfatto','Calmo','Organizza','To-do','Obiettivi','Progressi','Abitudini','Focus','Studio','Pausa','Riposo','Alimentazione','Allenamento','Benessere','Crescita','Riflessione','Sovraccarico']
x0,y0,p=20,30,176
out=[]
for i,n in enumerate(nomi):
    r,c=divmod(i,5); x=x0+c*p; y=y0+r*p
    patch=np.concatenate([a[y+40:y+110, x+4:x+16].reshape(-1,3), a[y+20:y+30, x+60:x+100].reshape(-1,3)])
    m=np.median(patch,0); h='#%02x%02x%02x'%tuple(int(v) for v in m)
    out.append((n,h)); print(f"{n:14s} {h} {fmt_lch(h)}")
json.dump(out,open('tessere.json','w'),indent=1,ensure_ascii=False)
