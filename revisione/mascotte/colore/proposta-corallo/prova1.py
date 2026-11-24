exec(open('palette.py').read())
for n,h in [('corallo','#d9445a'),('pulsante','#c8344f'),('mattone','#b54708'),('oro','#f5b440'),('ok','#1f7a55'),('risvolto','#f4a3ae'),('indaco','#5b4ff5')]: print(n,h,lch(h))
# aree candidate: tono variabile, L e C costanti per chiaro (icone/puntini)
for H in [105,135,190,220,250,280,305,330]: print(H, oklch2hex(.56,.13,H), oklch2hex(.74,.12,H))
