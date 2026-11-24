exec(open('palette.py').read())
C=dict(
 chiaro=dict(pagina='#fbf7f4',sup='#ffffff',sup2='#f4eeea',inch='#2a1a1f',muto='#6e6166',linea='#8a7d82',
   marca='#d9445a',pieno='#c8344f',marcaTesto='#a8283f',tenue='#fbe4e7',oro='#f5b440',oroTesto='#8a5a00',ok='#1f7a55',errore='#b54708',risvolto='#f4a3ae'),
 scuro=dict(pagina='#121011',sup='#1c191a',sup2='#2a2627',inch='#f5eff1',muto='#a89da1',linea='#7d7276',
   marca='#d9445a',pieno='#c8344f',marcaTesto='#ff7a8c',tenue='#3a1f25',oro='#f5b440',oroTesto='#f5b440',ok='#3fbf86',errore='#ff8a4c',risvolto='#f4a3ae'))
AREE={'Studio':250,'Salute':135,'Relazioni':330,'Finanze':105,'Associazioni':190,'Founder':280,'Lavoro':220,'Altro':305}
A={'chiaro':{k:oklch2hex(.53,.13,h) for k,h in AREE.items()},'scuro':{k:oklch2hex(.76,.12,h) for k,h in AREE.items()}}
out={}
for t,c in C.items():
  print('==',t)
  for a,b in [('inch','pagina'),('inch','sup2'),('muto','pagina'),('muto','sup2'),('linea','sup'),('linea','sup2'),('marcaTesto','pagina'),('marcaTesto','sup'),('oroTesto','pagina'),('ok','sup'),('errore','sup'),('marca','pagina'),('marca','sup')]:
    print(f'  {a:10s} su {b:7s} {cr(c[a],c[b]):5.2f}')
  print('  bianco su pieno', round(cr('#ffffff',c['pieno']),2), ' bianco su ok', round(cr('#ffffff','#1f7a55'),2))
  sem={k:c[k] for k in ['marca','ok','errore','oro']}
  for (x,y) in itertools.combinations(sem,2): print(f'  ΔE {x}-{y}: {de(sem[x],sem[y]):.1f}  deut {de(deut(sem[x]),deut(sem[y])):.1f}')
  worst=[]
  for an,ah in A[t].items():
    print(f'  area {an:12s} {ah} contrasto su sup {cr(ah,c["sup"]):.2f}', ' '.join(f'{k}:{de(ah,v):.0f}' for k,v in sem.items()), 'risv:%.0f'%de(ah,c['risvolto']))
open('aree.json','w').write(json.dumps(A,indent=1))
