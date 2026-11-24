"""Genera tavola.html (la tavola visiva del sistema) da token.json e icone/dominanti.json."""
import sys, json, math, random; sys.path.insert(0, '.')
from lib import cr, fmt_lch, lch
T = json.load(open('token.json')); D = json.load(open('icone/dominanti.json'))
AREE = ['Studio','Salute','Relazioni','Finanze','Associazioni','Founder','Lavoro','Altro']
NOMI = T['nomi_aree']
def vars_css(tema): return ';'.join(f"--{k}:{v['hex']}" for k, v in T[tema].items())
def h(tema, k): return T[tema][k]['hex']

def campione(tema, k, testo=None, nota=''):
    bg = h(tema, k); fg = '#ffffff' if cr('#ffffff', bg) >= cr('#1a1a1a', bg) else '#1a1a1a'
    return f'''<div class="cmp"><div class="sw" style="background:{bg};color:{fg}">{testo or ''}</div>
      <div class="lab"><b>--{k}</b><br>{bg}<br><span class="m">{T[tema][k]['oklch']}</span>{('<br><span class="m">'+nota+'</span>') if nota else ''}</div></div>'''

def palette(tema):
    s1 = h(tema, 'superficie-1')
    grp = [
      ('Neutri', ['pagina','superficie-1','superficie-2','superficie-3','linea-decor','linea-controllo','testo-1','testo-2','testo-3']),
      ('Marca e azione', ['azione','azione-hover','azione-premuta','azione-testo','azione-linea','azione-tenue','focus']),
      ('Semantici', ['successo','successo-testo','successo-pieno','successo-tenue','errore','errore-testo','errore-pieno','errore-tenue','oro','oro-tenue']),
      ('Segno (uguale nei due temi)', ['segno','segno-rovescio','segno-occhi']),
      ('Stanze emotive', ['stanza-gioia','stanza-raggio','stanza-calma','stanza-capisce','stanza-bentornato']),
    ]
    out = ''
    for nome, ks in grp:
        cells = ''
        for k in ks:
            nota = ''
            if k.startswith('testo') and k != 'testo-su-pieno': nota = f"{cr(h(tema,k), s1):.1f}:1 su sup-1"
            elif k in ('azione','successo-pieno','errore-pieno','azione-hover','azione-premuta'): nota = f"bianco {cr('#ffffff', h(tema,k)):.1f}:1"
            elif k in ('azione-testo','successo-testo','errore-testo'): nota = f"{cr(h(tema,k), s1):.1f}:1 su sup-1"
            elif k in ('linea-controllo','azione-linea','successo','errore','focus','segno'): nota = f"{cr(h(tema,k), h(tema,'pagina')):.1f}:1 su pagina"
            cells += campione(tema, k, nota=nota)
        out += f'<h4>{nome}</h4><div class="riga">{cells}</div>'
    return out

ICONE = {  # piccole icone lineari, 24px
 'Studio': '<path d="M3 7l9-4 9 4-9 4-9-4z M7 9v5c0 1.5 2.5 3 5 3s5-1.5 5-3V9"/>',
 'Salute': '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
 'Relazioni': '<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3 19c0-3 2.5-5 5-5s5 2 5 5 M11 19c0-3 2.5-5 5-5s5 2 5 5"/>',
 'Finanze': '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
 'Associazioni': '<path d="M4 20V9l8-5 8 5v11 M9 20v-6h6v6"/>',
 'Founder': '<path d="M12 3c3 2 5 6 5 10l-5 4-5-4c0-4 2-8 5-10z M9 17l-2 4 M15 17l2 4"/><circle cx="12" cy="10" r="1.6"/>',
 'Lavoro': '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M9 7V5h6v2 M3 12h18"/>',
 'Altro': '<circle cx="12" cy="12" r="8"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
}
def ico(a, col, size=22): return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{ICONE[a]}</svg>'

def aree(tema):
    s1 = h(tema, 'superficie-1'); cells = ''
    for a in AREE:
        c = h(tema, f'area-{a}'); t = h(tema, f'area-{a}-tenue'); tx = h(tema, f'area-{a}-testo')
        cells += f'''<div class="area"><div class="ai" style="background:{t}">{ico(a, c)}</div>
          <div><div class="an">{NOMI[a]}</div><div class="m">{c} · {T[tema][f'area-{a}']['oklch']}</div>
          <div class="m">icona {cr(c, s1):.1f}:1 · <span class="chip" style="background:{t};color:{tx}">● {a}</span> {cr(tx, t):.1f}:1</div></div></div>'''
    return f'<div class="aree">{cells}</div>'

FIAMMA = '<svg width="16" height="18" viewBox="0 0 16 18"><path d="M8 1c1 3 5 5 5 9.5A5 5 0 0 1 3 10.5C3 8 4.5 7 5 5c1 1.5 1.5 2.5 2.5 2.5C8 6 7.5 3.5 8 1z" fill="var(--oro)" stroke="var(--testo-su-oro)" stroke-width="1.4" stroke-linejoin="round"/></svg>'
SPUNTA = '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7.5l2.6 2.6L11 4.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

def scheda(tema):
    return f'''<div class="tel {tema}" style="{vars_css(tema)}">
  <div class="bar"><b>Adesso</b><span class="serie">{FIAMMA}<span>38 giorni</span></span></div>
  <div class="carta">
    <span class="chip" style="background:var(--area-Studio-tenue);color:var(--area-Studio-testo)">{ico('Studio', 'var(--area-Studio)', 15)} Studio / Università</span>
    <div class="tit">Ripassa il capitolo 3</div>
    <div class="meta">Una cosa alla volta · 25 minuti</div>
    <div class="sel"><span class="opz">15 min</span><span class="opz on">25 min</span><span class="opz">45 min</span></div>
    <button class="primario">Fatto</button>
    <button class="ghost">Non ce l'ho fatta…</button>
  </div>
  <div class="lista">
    <div class="vo"><span class="sp fatta">{SPUNTA}</span><span class="fat">Bevi un bicchiere d'acqua</span>{ico('Salute','var(--area-Salute)',16)}</div>
    <div class="vo"><span class="sp"></span><span>Paga la bolletta</span>{ico('Finanze','var(--area-Finanze)',16)}</div>
    <div class="vo"><span class="sp"></span><span>Scrivi a Marta</span>{ico('Relazioni','var(--area-Relazioni)',16)}</div>
  </div>
  <div class="toast"><span class="ok">{SPUNTA}</span> Fatta. <span class="xp">+8 XP</span><span class="ann">Annulla</span></div>
  <div class="foc"><button class="primario piccolo anello">Con il fuoco</button><span class="m">anello doppio: 2px pagina + 2px focus</span></div>
  <div class="err"><span>Eliminare definitivamente?</span><button class="dist">Elimina</button></div>
</div>'''

STATI = ['calma','gioia','concentrato','capisce','curioso','fiero','dorme','affetto']
def particelle(seed, n, w, h_, tema):
    random.seed(seed); cols = ['var(--oro)']*7 + ['var(--segno)']*5 + ['var(--segno-rovescio)']*4
    if tema == 'scuro': n = int(n*0.7)
    s = ''
    for i in range(n):
        x, y = random.uniform(0, w), random.uniform(0, h_*0.8); r = random.uniform(0, 180); c = random.choice(cols)
        if random.random() < .35: s += f'<path d="M{x} {y-5}l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z" fill="{c}"/>'
        else: s += f'<rect x="{x}" y="{y}" width="7" height="3.2" rx="1" fill="{c}" transform="rotate({r} {x} {y})"/>'
    return f'<svg class="part" viewBox="0 0 {w} {h_}" width="{w}" height="{h_}">{s}</svg>'

def mascotte(tema):
    v = vars_css(tema)
    celle = ''.join(f'<div class="ms" data-k="{k}"><div class="ombra"></div></div>' for k in STATI)
    stanze = ''
    for k, nome, part, txt in (('stanza-gioia','Gioia grande: giornata chiusa', 26, 'Giornata chiusa'), ('stanza-bentornato','Bentornato', 4, 'Bentornata, Giulia'),
                               ('stanza-capisce','Comprensione: non ce l\'ho fatta', 0, 'Va bene così. Riprendiamo da qui.'), ('stanza-calma','Calma: attesa, timer', 0, '')):
        stato = {'stanza-gioia':'fiero','stanza-bentornato':'affetto','stanza-capisce':'capisce','stanza-calma':'calma'}[k]
        colt = 'var(--azione-testo)' if k=='stanza-gioia' else 'var(--testo-1)'
        stanze += f'''<div class="stanza" style="background:var(--{k})">{particelle(len(k), part, 240, 200, tema) if part else ''}
          <div class="ms piccola" data-k="{stato}"></div><div class="st" style="color:{colt}">{txt}</div><div class="sn">{nome}<br><span class="m">--{k} {h(tema,k)}</span></div></div>'''
    return f'<div class="masc {tema}" style="{v}"><div class="riga-m">{celle}</div><div class="stanze">{stanze}</div></div>'

def mappa():
    W = 520; cx = cy = W/2; R = 210
    s = f'<svg width="{W}" height="{W}" viewBox="0 0 {W} {W}" font-family="Inter" font-size="11">'
    # settore vuoto 296→17
    def p(ang, r): a = math.radians(-ang); return cx + r*math.cos(a), cy + r*math.sin(a)
    x1, y1 = p(296, R); x2, y2 = p(377, R)
    s += f'<path d="M{cx} {cy}L{x1} {y1}A{R} {R} 0 0 0 {x2} {y2}Z" fill="#b744ab" opacity=".08"/>'
    for r in (70, 140, 210): s += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#ddd"/>'
    for ang in range(0, 360, 30):
        x, y = p(ang, R+14); s += f'<text x="{x}" y="{y}" text-anchor="middle" fill="#999">{ang}°</text>'
    pts = [(v['nome'].split(':')[0].split(' - ')[0][:16], v['dominante']) for v in D.values() if v.get('dominante') and v.get('quota_colore', 1) > 0.05]
    pts=[(n.replace('Duolingo','Duolingo (icona stagionale)'),x) for n,x in pts]; pts.append(('Duolingo (Feather)', '#58cc02'))
    for nome, hexv in pts:
        L, C, H = lch(hexv); x, y = p(H, min(C, 0.25)/0.25*R)
        s += f'<circle cx="{x}" cy="{y}" r="7" fill="{hexv}" stroke="#333" stroke-width=".6"/><text x="{x+9}" y="{y+4}" fill="#444">{nome}</text>'
    for nome, k in (('LifeMax · Segno', 'segno'),):
        L, C, H = lch(h('chiaro', k)); x, y = p(H, C/0.25*R)
        s += f'<circle cx="{x}" cy="{y}" r="12" fill="{h("chiaro",k)}" stroke="#111" stroke-width="2"/><text x="{x+15}" y="{y+4}" font-weight="700" fill="#111">{nome}</text>'
    s += f'<text x="{cx}" y="{W-6}" text-anchor="middle" fill="#666">tinta OKLCH (angolo) × croma (raggio). Settore ombreggiato: 296°→17°, nessun concorrente</text></svg>'
    return s

html = f'''<!doctype html><html lang="it"><meta charset="utf-8"><title>LifeMax Ciclamino</title>
<style>
*{{box-sizing:border-box}} body{{margin:0;font-family:Inter,system-ui,sans-serif;background:#efebe6;color:#222;padding:28px}}
h1{{margin:0 0 4px;font-size:30px}} h2{{margin:28px 0 10px;font-size:20px}} h4{{margin:12px 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:.06em;opacity:.7}}
.m{{font-size:11px;opacity:.75}} .due{{display:grid;grid-template-columns:1fr 1fr;gap:18px}}
.tema{{border-radius:18px;padding:18px}} .tema.chiaro{{background:var(--pagina);color:var(--testo-1)}} .tema.scuro{{background:var(--pagina);color:var(--testo-1)}}
.riga{{display:flex;flex-wrap:wrap;gap:8px}} .cmp{{width:118px}} .sw{{height:46px;border-radius:10px;border:1px solid rgba(128,128,128,.25)}} .lab{{font-size:10.5px;line-height:1.35;margin-top:4px}}
.aree{{display:grid;grid-template-columns:1fr 1fr;gap:10px}} .area{{display:flex;gap:10px;align-items:center;background:var(--superficie-1);padding:10px;border-radius:12px}}
.ai{{width:40px;height:40px;border-radius:10px;display:grid;place-items:center;flex:none}} .an{{font-weight:600;font-size:13px}}
.chip{{align-self:flex-start;display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;padding:3px 9px;border-radius:99px}}
.tel{{width:380px;background:var(--pagina);color:var(--testo-1);border-radius:28px;padding:18px;display:flex;flex-direction:column;gap:12px}}
.bar{{display:flex;justify-content:space-between;align-items:center;font-size:20px}} .serie{{display:inline-flex;gap:6px;align-items:center;background:var(--oro-tenue);color:var(--testo-1);font-size:13px;font-weight:700;padding:5px 11px;border-radius:99px}}
.carta{{background:var(--superficie-1);border:1px solid var(--linea-decor);border-radius:20px;padding:16px;display:flex;flex-direction:column;gap:10px}}
.tit{{font-size:21px;font-weight:700}} .meta{{color:var(--testo-2);font-size:13px}}
.sel{{display:flex;gap:8px}} .opz{{padding:6px 12px;border-radius:99px;border:1.5px solid var(--linea-controllo);font-size:13px;color:var(--testo-2)}}
.opz.on{{background:var(--azione-tenue);border-color:var(--azione-testo);color:var(--azione-testo);font-weight:700}}
button{{font:inherit;border:0;border-radius:14px;padding:13px;font-weight:700;font-size:16px}} .primario{{background:var(--azione);color:var(--testo-su-pieno)}}
.ghost{{background:transparent;color:var(--testo-2);padding:6px}} .piccolo{{padding:8px 14px;font-size:13px}}
.anello{{outline:2px solid var(--focus);outline-offset:2px;box-shadow:0 0 0 2px var(--pagina)}}
.lista{{background:var(--superficie-1);border-radius:16px;padding:4px 12px}} .vo{{display:flex;align-items:center;gap:10px;padding:9px 0;font-size:14px;border-bottom:1px solid var(--linea-decor)}} .vo:last-child{{border:0}} .vo span:nth-child(2){{flex:1}}
.sp{{width:22px;height:22px;border-radius:50%;border:2px solid var(--linea-controllo);display:grid;place-items:center}} .sp.fatta{{background:var(--successo-pieno);border-color:var(--successo-pieno)}} .fat{{color:var(--testo-2);text-decoration:line-through}}
.toast{{display:flex;align-items:center;gap:8px;background:var(--testo-1);color:var(--pagina);border-radius:14px;padding:10px 14px;font-size:14px;font-weight:600}} .scuro .toast{{background:var(--superficie-3);color:var(--testo-1)}}
.toast .ok{{width:20px;height:20px;border-radius:50%;background:var(--successo-pieno);display:grid;place-items:center}} .xp{{background:var(--oro);color:var(--testo-su-oro);padding:2px 8px;border-radius:99px;font-size:12px}} .ann{{margin-left:auto;opacity:.75;font-weight:500}}
.foc{{display:flex;align-items:center;gap:12px}} .err{{display:flex;align-items:center;justify-content:space-between;background:var(--errore-tenue);color:var(--errore-testo);border-radius:14px;padding:10px 12px;font-size:13px;font-weight:600}}
.dist{{background:var(--errore-pieno);color:#fff;padding:7px 12px;font-size:13px;border-radius:10px}}
.masc{{background:var(--pagina);border-radius:18px;padding:14px}} .riga-m{{display:grid;grid-template-columns:repeat(8,1fr);gap:6px}}
.ms{{position:relative}} .ms svg{{width:100%;height:auto;display:block}} .masc .m{{color:var(--testo-2);opacity:1}} .ms.piccola{{width:150px;margin:0 auto}}
.stanze{{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:10px}} .stanza{{position:relative;border-radius:14px;padding:6px 6px 10px;overflow:hidden;min-height:250px}}
.part{{position:absolute;left:0;top:0;width:100%}} .st{{text-align:center;font-weight:800;font-size:16px;min-height:20px}} .sn{{text-align:center;font-size:11px;color:var(--testo-2);margin-top:4px}}
.cands{{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}} .cand{{background:#fff;border-radius:16px;padding:14px}} .mc{{width:100px;border-radius:10px;padding:4px}} .mc svg{{width:100%;display:block}} .griglia-tel{{display:flex;gap:24px;align-items:flex-start}}
</style><body>
<h1>LifeMax · sistema colore «Ciclamino»</h1>
<div class="m" style="font-size:13px">Marca = Segno: un nastro segnalibro color ciclamino (OKLCH 58% 0,19 332°) su carta calda. Verde = fatto · ruggine = errore · oro = ricompensa. Valori da token.json, verificati in verifica.txt.</div>
<h2>1. Palette, chiaro e scuro</h2>
<div class="due"><div class="tema chiaro" style="{vars_css('chiaro')}">{palette('chiaro')}</div><div class="tema scuro" style="{vars_css('scuro')}">{palette('scuro')}</div></div>
<h2>2. Le otto aree (sempre icona + etichetta, mai superficie grande)</h2>
<div class="due"><div class="tema chiaro" style="{vars_css('chiaro')}">{aree('chiaro')}</div><div class="tema scuro" style="{vars_css('scuro')}">{aree('scuro')}</div></div>
<h2>3. Segno ricolorato, su pagina chiara e scura, e le stanze emotive</h2>
{mascotte('chiaro')}<div style="height:12px"></div>{mascotte('scuro')}
<h2>4. Scheda d'esempio: Adesso (chiaro e scuro) e mappa dei concorrenti</h2>
<div class="griglia-tel">{scheda('chiaro')}{scheda('scuro')}<div style="background:#fff;border-radius:18px;padding:8px">{mappa()}</div></div>
<h2>5. I tre candidati (Segno ricolorato e quattro colori chiave)</h2><div class="cands"><div class="cand"><b>A · Ciclamino (scelto)</b><div class="m">semantici min ΔE 21,3 / deut 16,5 / prot 15,6 · concorrente più vicino Habitica 14,3</div><div style="display:flex;gap:6px;margin:6px 0"><div style="width:54px;height:36px;border-radius:8px;background:#a6339b"></div><div style="width:54px;height:36px;border-radius:8px;background:#53933a"></div><div style="width:54px;height:36px;border-radius:8px;background:#872802"></div><div style="width:54px;height:36px;border-radius:8px;background:#eab532"></div></div>
    <div style="display:flex;gap:8px"><div class="mc" data-col='{{"corpo": "#b744ab", "rovescio": "#e7b5db", "occhi": "#2d162a"}}' data-k="calma" style="background:#f9f6f2"></div><div class="mc" data-col='{{"corpo": "#b744ab", "rovescio": "#e7b5db", "occhi": "#2d162a"}}' data-k="fiero" style="background:#f9f6f2"></div><div class="mc" data-col='{{"corpo": "#b744ab", "rovescio": "#e7b5db", "occhi": "#2d162a"}}' data-k="calma" style="background:#110f0d"></div><div class="mc" data-col='{{"corpo": "#b744ab", "rovescio": "#e7b5db", "occhi": "#2d162a"}}' data-k="capisce" style="background:#110f0d"></div></div>
    <div class="m">pulsante · successo · errore · oro</div></div><div class="cand"><b>B · Ottanio</b><div class="m">semantici min ΔE 16,2 / deut 15,2 · concorrente più vicino Calm 12,0</div><div style="display:flex;gap:6px;margin:6px 0"><div style="width:54px;height:36px;border-radius:8px;background:#016f82"></div><div style="width:54px;height:36px;border-radius:8px;background:#599234"></div><div style="width:54px;height:36px;border-radius:8px;background:#8e2e00"></div><div style="width:54px;height:36px;border-radius:8px;background:#eab532"></div></div>
    <div style="display:flex;gap:8px"><div class="mc" data-col='{{"corpo": "#058298", "rovescio": "#9ed5e3", "occhi": "#02242b"}}' data-k="calma" style="background:#f9f6f2"></div><div class="mc" data-col='{{"corpo": "#058298", "rovescio": "#9ed5e3", "occhi": "#02242b"}}' data-k="fiero" style="background:#f9f6f2"></div><div class="mc" data-col='{{"corpo": "#058298", "rovescio": "#9ed5e3", "occhi": "#02242b"}}' data-k="calma" style="background:#110f0d"></div><div class="mc" data-col='{{"corpo": "#058298", "rovescio": "#9ed5e3", "occhi": "#02242b"}}' data-k="capisce" style="background:#110f0d"></div></div>
    <div class="m">pulsante · successo · errore · oro</div></div><div class="cand"><b>C · Terracotta</b><div class="m">semantici min ΔE 11,9 / deut 8,2 ✗ · concorrente più vicino Duolingo (icona) 4,1, Sunsama 6,4</div><div style="display:flex;gap:6px;margin:6px 0"><div style="width:54px;height:36px;border-radius:8px;background:#b64c1b"></div><div style="width:54px;height:36px;border-radius:8px;background:#067d51"></div><div style="width:54px;height:36px;border-radius:8px;background:#971a20"></div><div style="width:54px;height:36px;border-radius:8px;background:#eab532"></div></div>
    <div style="display:flex;gap:8px"><div class="mc" data-col='{{"corpo": "#ce6234", "rovescio": "#efc3ab", "occhi": "#2f1810"}}' data-k="calma" style="background:#f9f6f2"></div><div class="mc" data-col='{{"corpo": "#ce6234", "rovescio": "#efc3ab", "occhi": "#2f1810"}}' data-k="fiero" style="background:#f9f6f2"></div><div class="mc" data-col='{{"corpo": "#ce6234", "rovescio": "#efc3ab", "occhi": "#2f1810"}}' data-k="calma" style="background:#110f0d"></div><div class="mc" data-col='{{"corpo": "#ce6234", "rovescio": "#efc3ab", "occhi": "#2f1810"}}' data-k="capisce" style="background:#110f0d"></div></div>
    <div class="m">pulsante · successo · errore · oro</div></div></div>
<script>window.SEGNO_COLORI={{corpo:'{h('chiaro','segno')}',rovescio:'{h('chiaro','segno-rovescio')}',occhi:'{h('chiaro','segno-occhi')}'}};</script>
<script src="nastro-ciclamino.js"></script>
<script>
document.querySelectorAll('.ms').forEach(el=>{{const k=el.dataset.k;el.insertAdjacentHTML('afterbegin',NASTRO3.disegna(k));
 if(!el.classList.contains('piccola'))el.insertAdjacentHTML('beforeend','<div class="m" style="text-align:center">'+NASTRO3.STATI[k].n+'</div>');}});
document.querySelectorAll('.mc').forEach(el=>{{el.innerHTML=NASTRO3.disegna(el.dataset.k,{{colori:JSON.parse(el.dataset.col)}});}});
</script></body></html>'''
open('tavola.html', 'w').write(html)
print('ok')
