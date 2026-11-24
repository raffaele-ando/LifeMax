import sys,itertools; sys.path.insert(0,'.')
from lib import *
# semantici candidati, tema chiaro (livello "icona/linea" e "pieno")
S={
 'marca':hx(0.53,0.19,340),
 'segno':hx(0.58,0.19,340),
 'successo':hx(0.52,0.12,158),
 'errore':hx(0.50,0.15,32),
 'ricompensa':hx(0.80,0.15,85),   # oro-luce
 'ricomp-testo':hx(0.50,0.10,80),
}
for k,v in S.items(): print(k,v,fmt_lch(v),'su bianco',round(cr(v,'#ffffff'),2))
for a,b in itertools.combinations(S,2):
  print(f"{a:12s} {b:12s} N {de(S[a],S[b]):5.1f}  D {ded(S[a],S[b]):5.1f}  P {dep(S[a],S[b]):5.1f}  T {det(S[a],S[b]):5.1f}")
