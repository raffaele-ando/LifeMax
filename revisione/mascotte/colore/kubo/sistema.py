"""Sistema colore LifeMax «Kubo» — unica fonte dei valori (OKLCH -> sRGB, croma ridotto se fuori gamut).
Esegui: python3 -I sistema.py  -> token.json"""
import sys, json; sys.path.insert(0, '.')
from lib import hx, fmt_lch

H = 262          # tinta del blu di Kubo: DATO FISSO (misurata 260-263° sulle 6 figure singole)
NOTTE = 270      # tinta del visore di Kubo (misurata 267-276°): inchiostro e tema scuro
CARTA = 80       # tinta della carta (neutri chiari)
VERDE = 172      # successo: verde smeraldo (vedi esplorazione/congiunta.py)
RUGGINE = 38     # errore

AREE = {  # (L, C, h) chiaro — esplorazione/aree.py, ottimizzate contro marca e semantici
    'Studio':       (0.551, 0.098, 290),
    'Salute':       (0.632, 0.107, 50),
    'Relazioni':    (0.520, 0.100, 350),
    'Finanze':      (0.568, 0.109, 95),
    'Associazioni': (0.470, 0.133, 216),
    'Founder':      (0.640, 0.140, 331),
    'Lavoro':       (0.499, 0.135, 131),
    'Altro':        (0.470, 0.030, 82),
}
SCURO_SPECIALE = {'Studio': (0.60, 0.14, 295), 'Associazioni': (0.60, 0.06, 220)}  # lontane dal blu di Kubo schiarito (azione-linea scura)
NOMI_AREE = {'Studio': 'Studio / Università', 'Salute': 'Salute & Sport', 'Relazioni': 'Relazioni & Sociale', 'Finanze': 'Finanze',
             'Associazioni': 'Associazioni', 'Founder': 'Progetti Founder', 'Lavoro': 'Lavoro', 'Altro': 'Altro / Esplorazione'}
KUBO = {  # la mascotte: misure e valori canonici proposti
    'kubo-blu': (0.50, 0.23, H),            # canonico proposto (misurato: oklch 53.5% 0.221 262 = #185fea)
    'kubo-visore': (0.31, 0.100, NOTTE),     # = misurato #1b2a62
    'kubo-corpo': (0.925, 0.030, 282),       # mezzitoni misurati #e2e4fb
    'kubo-ombra': (0.86, 0.045, 280),
    'kubo-occhi': (1.0, 0.0, 0),
    'kubo-scintilla': (0.856, 0.165, 87),    # = misurato #fec72c
}

def chiaro():
    t = {
      'pagina': (0.975, 0.006, CARTA), 'superficie-1': (1.0, 0.0, 0), 'superficie-2': (0.955, 0.007, CARTA), 'superficie-3': (0.925, 0.009, CARTA),
      'linea-decor': (0.895, 0.010, CARTA), 'linea-controllo': (0.60, 0.014, NOTTE),
      'testo-1': (0.25, 0.040, NOTTE), 'testo-2': (0.43, 0.030, NOTTE), 'testo-3': (0.50, 0.022, NOTTE), 'testo-su-pieno': (1.0, 0.0, 0),
      'azione': (0.50, 0.23, H), 'azione-hover': (0.45, 0.21, H), 'azione-premuta': (0.41, 0.19, H),
      'azione-testo': (0.47, 0.21, H), 'azione-linea': (0.50, 0.23, H), 'azione-tenue': (0.95, 0.030, H), 'azione-tenue-hover': (0.92, 0.045, H), 'focus': (0.47, 0.21, H),
      'successo': (0.60, 0.12, VERDE), 'successo-testo': (0.47, 0.09, VERDE), 'successo-pieno': (0.50, 0.10, VERDE), 'successo-tenue': (0.95, 0.035, VERDE),
      'errore': (0.40, 0.16, RUGGINE), 'errore-testo': (0.40, 0.16, RUGGINE), 'errore-pieno': (0.40, 0.16, RUGGINE), 'errore-tenue': (0.95, 0.025, RUGGINE),
      'oro': (0.856, 0.165, 87), 'oro-tenue': (0.95, 0.050, 90), 'testo-su-oro': (0.25, 0.040, NOTTE),
      'stanza-gioia': (0.955, 0.045, 90), 'stanza-raggio': (0.925, 0.070, 90), 'stanza-calma': (0.975, 0.006, CARTA),
      'stanza-capisce': (0.95, 0.010, 70), 'stanza-bentornato': (0.955, 0.022, 280), 'stanza-concentrazione': (0.17, 0.020, NOTTE),
    }
    t.update(KUBO)
    for k, (L, C, h) in AREE.items():
        t[f'area-{k}'] = (L, C, h); t[f'area-{k}-tenue'] = (0.95, min(0.030, C), h); t[f'area-{k}-testo'] = (min(L, 0.46), C, h)
    return t

def scuro():
    t = {
      'pagina': (0.17, 0.020, NOTTE), 'superficie-1': (0.215, 0.022, NOTTE), 'superficie-2': (0.26, 0.025, NOTTE), 'superficie-3': (0.31, 0.028, NOTTE),
      'linea-decor': (0.33, 0.025, NOTTE), 'linea-controllo': (0.60, 0.020, NOTTE),
      'testo-1': (0.95, 0.008, CARTA), 'testo-2': (0.82, 0.010, CARTA), 'testo-3': (0.74, 0.012, CARTA), 'testo-su-pieno': (1.0, 0.0, 0),
      'azione': (0.50, 0.23, H), 'azione-hover': (0.55, 0.22, H), 'azione-premuta': (0.46, 0.21, H),
      'azione-testo': (0.74, 0.13, H), 'azione-linea': (0.70, 0.13, H), 'azione-tenue': (0.30, 0.070, H), 'azione-tenue-hover': (0.34, 0.085, H), 'focus': (0.74, 0.13, H),
      'successo': (0.84, 0.12, VERDE), 'successo-testo': (0.84, 0.12, VERDE), 'successo-pieno': (0.50, 0.10, VERDE), 'successo-tenue': (0.29, 0.045, VERDE),
      'errore': (0.55, 0.14, RUGGINE), 'errore-testo': (0.72, 0.12, RUGGINE), 'errore-pieno': (0.40, 0.16, RUGGINE), 'errore-tenue': (0.28, 0.040, RUGGINE),
      'oro': (0.856, 0.165, 87), 'oro-tenue': (0.30, 0.050, 87), 'testo-su-oro': (0.25, 0.040, NOTTE),
      'stanza-gioia': (0.25, 0.045, 85), 'stanza-raggio': (0.29, 0.060, 85), 'stanza-calma': (0.17, 0.020, NOTTE),
      'stanza-capisce': (0.21, 0.012, 70), 'stanza-bentornato': (0.24, 0.045, 275), 'stanza-concentrazione': (0.17, 0.020, NOTTE),
    }
    t.update(KUBO)
    for k, (L, C, h) in AREE.items():
        Ls = min(L + 0.22, 0.86)
        t[f'area-{k}'] = SCURO_SPECIALE.get(k, (Ls, C * 0.95, h)); t[f'area-{k}-tenue'] = (0.28, min(0.040, C), h); t[f'area-{k}-testo'] = (max(Ls, 0.76), C * 0.9, h)
    return t

def risolvi(t): return {k: {'hex': hx(*v), 'oklch': fmt_lch(hx(*v)), 'spec': [round(x, 3) for x in v]} for k, v in t.items()}

if __name__ == '__main__':
    out = {'chiaro': risolvi(chiaro()), 'scuro': risolvi(scuro()), 'nomi_aree': NOMI_AREE}
    json.dump(out, open('token.json', 'w'), indent=1, ensure_ascii=False)
    lines = ['/* LifeMax — sistema colore «Kubo». Generato da sistema.py: non modificare a mano. */']
    for sel, tema in ((':root', 'chiaro'), (':root[data-mode="dark"]', 'scuro')):
        lines.append(sel + ' {'); lines += [f"  --{k}: {v['hex']}; /* {v['oklch']} */" for k, v in out[tema].items()]; lines.append('}')
    open('token.css', 'w').write('\n'.join(lines) + '\n')
    for tema in ('chiaro', 'scuro'):
        print('==', tema)
        for k, v in out[tema].items(): print(f"  --{k:24s} {v['hex']}  {v['oklch']}")
