exec(open('palette.py').read())
for t,marca,oro,sup in [('chiaro','#d9445a','#f5b440','#ffffff'),('scuro','#d9445a','#f5b440','#1c191a')]:
  print('==',t)
  for L in ([.42,.46,.50] if t=='chiaro' else [.68,.72,.76]):
    for H in [45,55,60]:
      for Cc in [.12,.15]:
        e=oklch2hex(L,Cc,H); print(f'  {e} L{L} H{H} C{Cc}  marca:{de(e,marca):.1f} d{de(deut(e),deut(marca)):.1f} oro:{de(e,oro):.1f} d{de(deut(e),deut(oro)):.1f} cr:{cr(e,sup):.2f}')
