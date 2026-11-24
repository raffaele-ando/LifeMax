"""Verifica numerica del sistema «Ciclamino». Esegui: python3 -I verifica.py > verifica.txt"""
import sys, json, itertools; sys.path.insert(0, '.')
from lib import *
T = json.load(open('token.json'))
def c(tema, k): return T[tema][k]['hex']
AREE = ['Studio','Salute','Relazioni','Finanze','Associazioni','Founder','Lavoro','Altro']
fails = []
def riga(tema, fg, bg, soglia, nota=''):
    a, b = c(tema, fg) if not fg.startswith('#') else fg, c(tema, bg) if not bg.startswith('#') else bg
    v = cr(a, b); esito = 'PASS' if v >= soglia else ('FAIL' if soglia else '—')
    if esito == 'FAIL': fails.append((tema, fg, bg, round(v, 2)))
    print(f"| {tema} | {fg} `{a}` | {bg} `{b}` | {v:5.2f} | {soglia or '—'} | {esito} | {nota} |")

print("## 1. Contrasti WCAG 2.2\n")
print("| tema | primo piano | fondo | rapporto | soglia | esito | nota |\n|---|---|---|---|---|---|---|")
for t in ('chiaro', 'scuro'):
    for fg in ('testo-1', 'testo-2', 'testo-3'):
        for bg in ('pagina', 'superficie-1', 'superficie-2', 'superficie-3'):
            riga(t, fg, bg, 4.5, '1.4.3 testo')
    for bg in ('pagina', 'superficie-1', 'azione-tenue'):
        riga(t, 'azione-testo', bg, 4.5, '1.4.3 link / testo selezionato')
    for bg in ('azione', 'azione-hover', 'azione-premuta', 'successo-pieno', 'errore-pieno'):
        riga(t, 'testo-su-pieno', bg, 4.5, '1.4.3 etichetta su pieno')
    for fg, bg in (('successo-testo', 'superficie-1'), ('successo-testo', 'successo-tenue'), ('errore-testo', 'superficie-1'),
                   ('errore-testo', 'errore-tenue'), ('testo-su-oro', 'oro'), ('testo-1', 'oro-tenue'), ('testo-1', 'stanza-gioia'),
                   ('testo-1', 'stanza-capisce'), ('testo-1', 'stanza-bentornato'), ('azione-testo', 'stanza-gioia')):
        riga(t, fg, bg, 4.5, '1.4.3')
    for bg in ('pagina', 'superficie-1', 'superficie-2'):
        riga(t, 'linea-controllo', bg, 3, '1.4.11 bordo campo / spunta / interruttore')
    for fg in ('azione-linea', 'successo', 'errore', 'focus'):
        for bg in ('pagina', 'superficie-1'):
            riga(t, fg, bg, 3, '1.4.11 icona / linea / anello')
    riga(t, 'focus', 'azione', 0, 'anello sul pieno: si usa l\'anello doppio (2px pagina + 2px focus)')
    riga(t, 'azione', 'pagina', 0, 'pieno contro pagina (informativo)')
    for bg in ('pagina', 'superficie-1', 'superficie-2'):
        riga(t, 'segno', bg, 3, '1.4.11 sagoma della mascotte')
    riga(t, 'segno-occhi', 'segno', 3, '1.4.11 occhi sul corpo')
    riga(t, 'segno-rovescio', 'segno', 0, 'risvolto contro corpo (lettura della piega)')
    riga(t, 'segno-rovescio', 'pagina', 0, 'risvolto contro pagina: dettaglio interno, non sagoma')
    riga(t, 'oro', 'superficie-1', 0, 'oro: solo particelle o con contorno testo-1')
    riga(t, 'oro', 'testo-su-oro', 3, 'fiamma oro con contorno inchiostro')
    riga(t, 'oro', 'pagina', 0, 'oro sulla pagina')
    for a in AREE:
        riga(t, f'area-{a}', 'superficie-1', 3, f'1.4.11 icona area {a}')
        riga(t, f'area-{a}', 'pagina', 3, '')
        riga(t, f'area-{a}-testo', f'area-{a}-tenue', 4.5, '1.4.3 etichetta su chip d\'area')
        riga(t, f'area-{a}-testo', 'superficie-1', 4.5, '')
print(f"\n**FAIL totali: {len(fails)}** {fails}\n")

def matrice(tema, chiavi, f, titolo):
    print(f"\n### {titolo} — {tema}\n")
    print('| | ' + ' | '.join(k.replace('area-', '') for k in chiavi) + ' |')
    print('|---' * (len(chiavi) + 1) + '|')
    for a in chiavi:
        print(f"| {a.replace('area-','')} | " + ' | '.join('' if a == b else f"{f(c(tema,a), c(tema,b)):.1f}" for b in chiavi) + ' |')

SEM = ['azione', 'azione-linea', 'segno', 'successo', 'errore', 'oro']
MARCA = {'azione', 'azione-linea', 'segno'}
ALL = SEM + [f'area-{a}' for a in AREE]
print("## 2. Distanze ΔE OKLab ×100\n")
print("Soglie: ≥15 fra semantici e fra semantici e marca (normale e deuteranopia); aree: obiettivo ≥10 fra loro e dai semantici (sempre con icona ed etichetta). `azione` e `segno` sono la stessa tinta a due luminosità: la loro distanza non è un requisito.\n")
riass = []
for t in ('chiaro', 'scuro'):
    for nome, f in (('normale', de), ('deuteranopia', ded), ('protanopia', dep), ('tritanopia', det)):
        ps = [(a, b) for a, b in itertools.combinations(SEM, 2) if not {a, b} <= MARCA]
        m1 = min(ps, key=lambda p: f(c(t, p[0]), c(t, p[1])))
        pa = list(itertools.combinations(AREE, 2))
        m2 = min(pa, key=lambda p: f(c(t, 'area-'+p[0]), c(t, 'area-'+p[1])))
        pas = [(a, s) for a in AREE for s in SEM]
        m3 = min(pas, key=lambda p: f(c(t, 'area-'+p[0]), c(t, p[1])))
        riass.append((t, nome, f(c(t, m1[0]), c(t, m1[1])), m1, f(c(t, 'area-'+m2[0]), c(t, 'area-'+m2[1])), m2, f(c(t, 'area-'+m3[0]), c(t, m3[1])), m3))
print("| tema | visione | min semantici | coppia | min aree↔aree | coppia | min aree↔semantici | coppia |\n|---|---|---|---|---|---|---|---|")
for r in riass:
    print(f"| {r[0]} | {r[1]} | **{r[2]:.1f}** {'✓' if r[2]>=15 else '✗'} | {r[3][0]}↔{r[3][1]} | {r[4]:.1f} | {r[5][0]}↔{r[5][1]} | {r[6]:.1f} | {r[7][0]}↔{r[7][1]} |")
for t in ('chiaro', 'scuro'):
    matrice(t, ALL, de, 'Matrice ΔE, visione normale')
    matrice(t, ALL, ded, 'Matrice ΔE, deuteranopia (Machado 2009)')
print("\n### Risvolto di Segno contro le aree (rischio «Segno sembra Relazioni»)\n")
for t in ('chiaro',):
    for a in AREE + ['azione-tenue']:
        k = a if a == 'azione-tenue' else f'area-{a}'
        print(f"- {k}: ΔE {de(c(t,'segno-rovescio'), c(t,k)):.1f}")
print("\n## 3. Differenziazione: ΔE fra Segno/azione e i colori dominanti dei concorrenti\n")
D = json.load(open('icone/dominanti.json'))
D['duolingo (Feather Green ufficiale)'] = {'nome': 'Duolingo Feather Green', 'dominante': '#58cc02'}
print("| app | colore | ΔE da segno | ΔE da azione |\n|---|---|---|---|")
rows = sorted(((v['nome'], v['dominante'], de(c('chiaro','segno'), v['dominante']), de(c('chiaro','azione'), v['dominante'])) for k, v in D.items() if v.get('dominante')), key=lambda r: r[2])
for r in rows: print(f"| {r[0]} | `{r[1]}` {fmt_lch(r[1])} | {r[2]:.1f} | {r[3]:.1f} |")
