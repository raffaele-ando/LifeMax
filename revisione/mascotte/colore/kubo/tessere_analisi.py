import sys,json; sys.path.insert(0,'.')
from lib import de, lch
T=json.load(open('token.json'))['chiaro']; tess=json.load(open('tessere.json'))
ref={'azione (blu Kubo)':T['azione']['hex'],'Kubo misurato':'#185fea','successo':T['successo']['hex'],'oro':T['oro']['hex'],'errore (famiglia: rosso convenzionale #e5484d)':'#e5484d'}
fam=lambda h: ('rosso/corallo' if h<40 or h>=345 else 'arancio' if h<70 else 'giallo' if h<110 else 'verde' if h<185 else 'acqua' if h<215 else 'blu' if h<280 else 'viola' if h<320 else 'rosa')
print('| tessera | colore | famiglia | semantico più vicino | ΔE |\n|---|---|---|---|---|')
cnt={}
for n,h in tess:
    L,C,H=lch(h); f=fam(H); cnt[f]=cnt.get(f,[])+[n]
    k=min(ref,key=lambda r: de(h,ref[r])); print(f"| {n} | `{h}` | {f} | {k} | {de(h,ref[k]):.1f} |")
print(); [print(f"- {f}: {len(v)} — {', '.join(v)}") for f,v in sorted(cnt.items(),key=lambda x:-len(x[1]))]
