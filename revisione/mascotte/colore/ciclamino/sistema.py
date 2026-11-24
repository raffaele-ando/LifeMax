"""Sistema colore LifeMax «Ciclamino» — unica fonte dei valori. Tutto è definito in OKLCH (L, C, h)
e convertito in sRGB con riduzione del croma se fuori gamut. Esegui: python3 -I sistema.py -> token.json"""
import sys, json; sys.path.insert(0, '.')
from lib import hx, fmt_lch

H = 332          # tinta di marca (ciclamino): centro del vuoto 296°-17° nella mappa dei concorrenti, spostato verso il viola per la deuteranopia
CARTA = 80       # tinta dei neutri chiari (carta)
SEPPIA = 60      # tinta dei neutri scuri

AREE = {  # (L, C, h) chiaro; ottimizzate con aree_v4.py contro marca e semantici
    'Studio':       (0.558, 0.137, 260),
    'Salute':       (0.561, 0.132, 179),
    'Relazioni':    (0.477, 0.100, 0),
    'Finanze':      (0.530, 0.129, 108),
    'Associazioni': (0.470, 0.128, 236),
    'Founder':      (0.640, 0.140, 290),
    'Lavoro':       (0.491, 0.070, 61),
    'Altro':        (0.629, 0.009, 55),
}
SCURO_SPECIALE = {'Finanze': (0.84, 0.12, 110)}  # evita la collisione con successo scuro in protanopia
NOMI_AREE = {'Studio': 'Studio / Università', 'Salute': 'Salute & Sport', 'Relazioni': 'Relazioni & Sociale', 'Finanze': 'Finanze',
             'Associazioni': 'Associazioni', 'Founder': 'Progetti Founder', 'Lavoro': 'Lavoro', 'Altro': 'Altro / Esplorazione'}

def chiaro():
    t = {
      # neutri: carta calda
      'pagina': (0.975, 0.006, CARTA), 'superficie-1': (1.0, 0.0, 0), 'superficie-2': (0.955, 0.007, CARTA), 'superficie-3': (0.925, 0.009, CARTA),
      'linea-decor': (0.895, 0.010, CARTA), 'linea-controllo': (0.60, 0.012, CARTA),
      'testo-1': (0.25, 0.020, H), 'testo-2': (0.43, 0.016, H), 'testo-3': (0.50, 0.012, H), 'testo-su-pieno': (1.0, 0.0, 0),
      # marca / azione
      'azione': (0.53, 0.19, H), 'azione-hover': (0.48, 0.18, H), 'azione-premuta': (0.44, 0.17, H),
      'azione-testo': (0.47, 0.17, H), 'azione-linea': (0.53, 0.19, H), 'azione-tenue': (0.95, 0.030, H), 'azione-tenue-hover': (0.92, 0.045, H), 'focus': (0.47, 0.17, H),
      # semantici
      'successo': (0.60, 0.14, 138), 'successo-testo': (0.47, 0.12, 138), 'successo-pieno': (0.50, 0.13, 138), 'successo-tenue': (0.95, 0.040, 138),
      'errore': (0.42, 0.16, 38), 'errore-testo': (0.42, 0.16, 38), 'errore-pieno': (0.42, 0.16, 38), 'errore-tenue': (0.95, 0.025, 38),
      'oro': (0.80, 0.15, 85), 'oro-tenue': (0.95, 0.050, 90), 'testo-su-oro': (0.25, 0.020, H),
      # mascotte (uguale nei due temi)
      'segno': (0.58, 0.19, H), 'segno-rovescio': (0.83, 0.075, H + 3), 'segno-occhi': (0.24, 0.050, H),
      # stanze emotive
      'stanza-gioia': (0.955, 0.032, H), 'stanza-raggio': (0.925, 0.050, H), 'stanza-calma': (0.975, 0.006, CARTA),
      'stanza-capisce': (0.95, 0.010, 70), 'stanza-bentornato': (0.965, 0.030, 85),
    }
    for k, (L, C, h) in AREE.items():
        t[f'area-{k}'] = (L, C, h)
        t[f'area-{k}-tenue'] = (0.95, min(0.030, C), h)
        t[f'area-{k}-testo'] = (min(L, 0.46), C, h)
    return t

def scuro():
    t = {
      'pagina': (0.17, 0.006, SEPPIA), 'superficie-1': (0.215, 0.007, SEPPIA), 'superficie-2': (0.26, 0.008, SEPPIA), 'superficie-3': (0.31, 0.009, SEPPIA),
      'linea-decor': (0.33, 0.008, SEPPIA), 'linea-controllo': (0.58, 0.010, SEPPIA),
      'testo-1': (0.95, 0.008, H), 'testo-2': (0.82, 0.010, H), 'testo-3': (0.74, 0.010, H), 'testo-su-pieno': (1.0, 0.0, 0),
      'azione': (0.53, 0.19, H), 'azione-hover': (0.57, 0.19, H), 'azione-premuta': (0.49, 0.18, H),
      'azione-testo': (0.79, 0.11, H), 'azione-linea': (0.79, 0.11, H), 'azione-tenue': (0.30, 0.060, H), 'azione-tenue-hover': (0.34, 0.070, H), 'focus': (0.79, 0.11, H),
      'successo': (0.72, 0.15, 138), 'successo-testo': (0.72, 0.15, 138), 'successo-pieno': (0.50, 0.13, 138), 'successo-tenue': (0.29, 0.050, 138),
      'errore': (0.55, 0.13, 38), 'errore-testo': (0.72, 0.12, 38), 'errore-pieno': (0.42, 0.16, 38), 'errore-tenue': (0.28, 0.040, 38),
      'oro': (0.92, 0.12, 92), 'oro-tenue': (0.30, 0.050, 85), 'testo-su-oro': (0.25, 0.020, H),
      'segno': (0.58, 0.19, H), 'segno-rovescio': (0.83, 0.075, H + 3), 'segno-occhi': (0.24, 0.050, H),
      'stanza-gioia': (0.23, 0.040, H), 'stanza-raggio': (0.27, 0.055, H), 'stanza-calma': (0.17, 0.006, SEPPIA),
      'stanza-capisce': (0.20, 0.008, 60), 'stanza-bentornato': (0.22, 0.025, 75),
    }
    for k, (L, C, h) in AREE.items():
        t[f'area-{k}'] = SCURO_SPECIALE.get(k, (min(L + 0.22, 0.86), C * 0.95, h))
        t[f'area-{k}-tenue'] = (0.28, min(0.040, C), h)
        t[f'area-{k}-testo'] = (max(min(L + 0.22, 0.86), 0.76), C * 0.9, h)
    return t

def risolvi(t): return {k: {'hex': hx(*v), 'oklch': fmt_lch(hx(*v)), 'spec': [round(x, 3) for x in v]} for k, v in t.items()}

if __name__ == '__main__':
    out = {'chiaro': risolvi(chiaro()), 'scuro': risolvi(scuro()), 'nomi_aree': NOMI_AREE}
    json.dump(out, open('token.json', 'w'), indent=1, ensure_ascii=False)
    for tema in ('chiaro', 'scuro'):
        print('==', tema)
        for k, v in out[tema].items(): print(f"  --{k:24s} {v['hex']}  {v['oklch']}")
