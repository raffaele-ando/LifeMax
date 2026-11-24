import json,os
D=os.path.dirname(os.path.abspath(__file__))
tk=json.load(open(os.path.join(D,'token.json')))
def h(c):
    c=c.lstrip('#'); 
    if len(c)==3: c=''.join(x*2 for x in c)
    return [int(c[i:i+2],16) for i in (0,2,4)]+[1]
def mix(a,b,p):  # color-mix srgb a p% , b
    return [a[i]*p+b[i]*(1-p) for i in range(3)]+[1]
def over(f,b):
    a=f[3] if len(f)>3 else 1
    return [f[i]*a+b[i]*(1-a) for i in range(3)]+[1]
def lum(c):
    v=[]
    for x in c[:3]:
        x/=255; v.append(x/12.92 if x<=0.04045 else ((x+0.055)/1.055)**2.4)
    return .2126*v[0]+.7152*v[1]+.0722*v[2]
def cr(a,b):
    A,B=lum(a),lum(b); return (max(A,B)+.05)/(min(A,B)+.05)
def hx(c): return '#%02x%02x%02x'%tuple(round(x) for x in c[:3])
AREE={'Studio':('#2a78d6','#5aa2f0'),'Salute':('#008300','#3fb950'),'Relazioni':('#e87ba4','#ee8db2'),'Finanze':('#eda100','#f2b53b'),'Associazioni':('#1baf7a','#33c792'),'Founder':('#eb6834','#f2804f'),'Lavoro':('#4a3aa7','#9085e9'),'Altro':('#e34948','#ee7a79')}
righe=[]
for tema in ['light','dark']:
    T={k:v for k,v in tk[tema]['tok'].items()}
    L=tema=='light'
    s1,s2,s3,pg=T['superficie-1'],T['superficie-2'],T['superficie-3'],T['pagina']
    W=h('#fff')
    def add(cat,nome,fg,bg,min_,note=''):
        r=cr(fg,bg); righe.append((tema,cat,nome,hx(fg),hx(bg),r,min_,'PASS' if r>=min_ else 'FAIL',note))
    for t in ['inchiostro-1','inchiostro-2','inchiostro-muto']:
        for n,b in [('pagina',pg),('sup-1',s1),('sup-2',s2),('sup-3',s3)]:
            add('Testo',f'--{t} su {n}',T[t],b,4.5)
    add('Testo','segnaposto (UA #757575, nessuna regola ::placeholder) su sup-1',h('#757575'),s1,4.5)
    add('Testo','segnaposto su sup-2 (campi dentro i fogli)',h('#757575'),s2,4.5)
    add('Testo','segnaposto su pagina',h('#757575'),pg,4.5)
    # bottoni
    add('Pulsanti','--accento-ink su --accento-pieno (btn-primario)',T['accento-ink'],T['accento-pieno'],4.5)
    add('Pulsanti','#fff su --ok-pieno (btn-ok «Fatto»)',W,T['ok-pieno'],4.5)
    add('Pulsanti','#fff su --critico-pieno (btn-pericolo)',W,T['critico-pieno'],4.5)
    tinta=mix(T['accento'],s1,.13)
    add('Pulsanti','--accento-testo su btn-tinta (accento 13% su sup-1)',T['accento-testo'],tinta,4.5)
    add('Pulsanti','--accento-testo su sup-1 (link, ghost-accento)',T['accento-testo'],s1,4.5)
    add('Pulsanti','--accento-testo su pagina',T['accento-testo'],pg,4.5)
    add('Pulsanti','--accento (non -testo) su sup-1, usato come testo in .ob/.sp-link ecc.',T['accento'],s1,4.5)
    # disabled
    dis=over(T['accento-pieno'][:3]+[.45],pg); disT=over(T['accento-ink'][:3]+[.45],over(T['accento-pieno'][:3]+[.45],pg))
    add('Pulsanti','disattivato: testo su pieno a opacity .45 (esente WCAG, ma leggibile?)',disT,dis,3,'esente 1.4.3')
    if not L:
        nav=mix(T['accento'],s1,.26)
        add('Pulsanti','nav attiva scuro: #fff su accento 26% (r.5535)',W,nav,4.5)
    # stato testo
    add('Stato','--ok-testo su sup-1',T['ok-testo'],s1,4.5)
    add('Stato','--ok come testo (.abd-fatta r.5562) su sup-1',T['ok'],s1,4.5)
    add('Stato','--ok come icona/linea su sup-1 (non testo 3:1)',T['ok'],s1,3)
    add('Stato','--critico-testo su sup-1',T['critico-testo'],s1,4.5)
    add('Stato','--critico icona su sup-1',T['critico'],s1,3)
    add('Stato','--avviso come icona su sup-1',T['avviso'],s1,3)
    if L:
        add('Stato','#7a5200 su avviso 20% (scad-badge r.3803)',h('#7a5200'),mix(T['avviso'],s1,.2),4.5)
        add('Stato','#3d2a00 su --avviso pieno (me-scad r.3625)',h('#3d2a00'),T['avviso'],4.5)
        add('Stato','#c2410c serie (lista-sub r.2732) su sup-1',h('#c2410c'),s1,4.5)
        add('Stato','#eb6834 fiamma (icona r.1308) su sup-1',h('#eb6834'),s1,3)
        add('Stato','#b4470f su serie 15% (casa-serie r.4321)',h('#b4470f'),mix(h('#eb6834'),s1,.15),4.5)
        add('Stato','#fff su #3a63d6 (tl-now r.3403)',W,h('#3a63d6'),4.5)
        add('Stato','#fff su #a4671f (fascia-ritardo r.4280)',W,h('#a4671f'),4.5)
        add('Stato','#fff su #0a7f28 (fascia-ora r.4278)',W,h('#0a7f28'),4.5)
    else:
        add('Stato','--avviso come testo (scad-badge scuro r.3804) su avviso 20%',T['avviso'],mix(T['avviso'],s1,.2),4.5)
        add('Stato','#f97316 serie scuro su sup-1',h('#f97316'),s1,4.5)
        add('Stato','#ff9a62 casa-serie scuro su serie 15%',h('#ff9a62'),mix(h('#eb6834'),s1,.15),4.5)
        add('Stato','#fff su #636366 segmento attivo scuro (r.5486)',W,h('#636366'),4.5)
    # non testo
    for n,b in [('sup-1',s1),('pagina',pg)]:
        add('Bordi/controlli 3:1',f'--bordo-forte (bordo dei campi) su {n}',over(T['bordo-forte'],b),b,3)
        add('Bordi/controlli 3:1',f'--bordo su {n}',over(T['bordo'],b),b,3,'decorativo ammesso')
    add('Bordi/controlli 3:1','--baseline (cerchio spunta vuota r.5549) su sup-1',T['baseline'],s1,3)
    add('Bordi/controlli 3:1','interruttore spento: --superficie-3 su sup-2 (riga gr)',T['superficie-3'],s2,3)
    add('Bordi/controlli 3:1','interruttore spento: --superficie-3 su sup-1',T['superficie-3'],s1,3)
    if not L: add('Bordi/controlli 3:1','pomello spento #9a9a9a su traccia sup-3',h('#9a9a9a'),T['superficie-3'],3)
    else: add('Bordi/controlli 3:1','pomello spento #fff su traccia sup-3 (senza ombra)',W,T['superficie-3'],3)
    add('Bordi/controlli 3:1','interruttore acceso --accento-pieno su sup-1',T['accento-pieno'],s1,3)
    add('Focus','anello :focus-visible --accento su pagina',T['accento'],pg,3)
    add('Focus','anello --accento su sup-1',T['accento'],s1,3)
    add('Focus','anello --accento accanto a btn-primario pieno (contrasto col pieno)',T['accento'],T['accento-pieno'],3,'2.4.13 vuole 3:1 fra stato e non-stato')
    add('Focus','campo a fuoco: bordo --accento su sup-1',T['accento'],s1,3)
    # aree
    for a,(cl,cd) in AREE.items():
        c=h(cl if L else cd)
        add('Aree',f'{a} come testo su sup-1',c,s1,4.5)
        add('Aree',f'{a} come icona su sup-1',c,s1,3)
        add('Aree',f'{a} testo su chip area 16%',c,mix(c,s1,.16),4.5)
        add('Aree',f'#fff su {a} pieno (ab-spunta fatta r.5022)',W,c,3,'icona spunta')
json.dump(righe,open(os.path.join(D,'contrasti.json'),'w'))
for r in righe: print('%-5s %-20s %-70s %s %s %5.2f %3.1f %s %s'%r)
