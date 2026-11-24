"""Genera tavola.html: Kubo originale su chiaro e scuro, ritocco col canvas, palette, aree, tessere-emozione disciplinate,
scheda d'esempio, mappa e codici dei concorrenti. Immagini incorporate come data URI (il canvas non si «sporca»)."""
import sys, json, math, base64; sys.path.insert(0, '.')
from lib import cr, lch, de, hx, fmt_lch
T = json.load(open('token.json')); D = json.load(open('icone/dominanti.json')); COD = json.load(open('codici.json'))
TESS = json.load(open('tessere.json'))
AREE = ['Studio','Salute','Relazioni','Finanze','Associazioni','Founder','Lavoro','Altro']; NOMI = T['nomi_aree']
def uri(p): return 'data:image/png;base64,' + base64.b64encode(open(p, 'rb').read()).decode()
K = [uri(f'ritagli/kubo-{i}-360.png') for i in range(6)]
def vars_css(t): return ';'.join(f"--{k}:{v['hex']}" for k, v in T[t].items())
def h(t, k): return T[t][k]['hex']

def campione(t, k, nota=''):
    bg = h(t, k)
    return f'<div class="cmp"><div class="sw" style="background:{bg}"></div><div class="lab"><b>--{k}</b><br>{bg}<br><span class="m">{T[t][k]["oklch"]}</span>{("<br><span class=m>"+nota+"</span>") if nota else ""}</div></div>'
def palette(t):
    s1 = h(t, 'superficie-1'); pg = h(t, 'pagina'); out = ''
    for nome, ks in (('Neutri: carta e notte', ['pagina','superficie-1','superficie-2','superficie-3','linea-decor','linea-controllo','testo-1','testo-2','testo-3']),
                     ('Marca: il blu di Kubo', ['azione','azione-hover','azione-premuta','azione-testo','azione-linea','azione-tenue','focus']),
                     ('Semantici', ['successo','successo-testo','successo-pieno','successo-tenue','errore','errore-testo','errore-pieno','errore-tenue','oro','oro-tenue']),
                     ('Kubo', ['kubo-blu','kubo-visore','kubo-corpo','kubo-ombra','kubo-scintilla']),
                     ('Stanze emotive', ['stanza-gioia','stanza-raggio','stanza-calma','stanza-capisce','stanza-bentornato','stanza-concentrazione'])):
        cells = ''
        for k in ks:
            n = ''
            if k.startswith('testo'): n = f"{cr(h(t,k), s1):.1f}:1 su sup-1"
            elif k in ('azione','azione-hover','azione-premuta','successo-pieno','errore-pieno'): n = f"bianco {cr('#ffffff', h(t,k)):.1f}:1"
            elif k in ('azione-testo','successo-testo','errore-testo'): n = f"{cr(h(t,k), s1):.1f}:1 su sup-1"
            elif k in ('linea-controllo','azione-linea','successo','errore','focus','kubo-blu'): n = f"{cr(h(t,k), pg):.1f}:1 su pagina"
            cells += campione(t, k, n)
        out += f'<h4>{nome}</h4><div class="riga">{cells}</div>'
    return out

ICONE = {
 'Studio': '<path d="M3 7l9-4 9 4-9 4-9-4z M7 9v5c0 1.5 2.5 3 5 3s5-1.5 5-3V9"/>',
 'Salute': '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
 'Relazioni': '<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3 19c0-3 2.5-5 5-5s5 2 5 5 M11 19c0-3 2.5-5 5-5s5 2 5 5"/>',
 'Finanze': '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
 'Associazioni': '<path d="M4 20V9l8-5 8 5v11 M9 20v-6h6v6"/>',
 'Founder': '<path d="M12 3c3 2 5 6 5 10l-5 4-5-4c0-4 2-8 5-10z M9 17l-2 4 M15 17l2 4"/><circle cx="12" cy="10" r="1.6"/>',
 'Lavoro': '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M9 7V5h6v2 M3 12h18"/>',
 'Altro': '<circle cx="12" cy="12" r="8"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
}
def ico(a, col, s=22): return f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="{col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{ICONE[a]}</svg>'
def aree(t):
    s1 = h(t, 'superficie-1'); cells = ''
    for a in AREE:
        c, tn, tx = h(t, f'area-{a}'), h(t, f'area-{a}-tenue'), h(t, f'area-{a}-testo')
        cells += f'''<div class="area"><div class="ai" style="background:{tn}">{ico(a, c)}</div><div><div class="an">{NOMI[a]}</div>
          <div class="m">{c} · {T[t][f"area-{a}"]["oklch"]}</div><div class="m">icona {cr(c, s1):.1f}:1 · <span class="chip" style="background:{tn};color:{tx}">● {a}</span> {cr(tx, tn):.1f}:1 · ΔE dal blu {de(c, h(t,"azione-linea")):.1f}</div></div></div>'''
    return f'<div class="aree">{cells}</div>'

FIAMMA = '<svg width="16" height="18" viewBox="0 0 16 18"><path d="M8 1c1 3 5 5 5 9.5A5 5 0 0 1 3 10.5C3 8 4.5 7 5 5c1 1.5 1.5 2.5 2.5 2.5C8 6 7.5 3.5 8 1z" fill="var(--oro)" stroke="var(--testo-su-oro)" stroke-width="1.4" stroke-linejoin="round"/></svg>'
SPUNTA = '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7.5l2.6 2.6L11 4.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
def scheda(t):
    return f'''<div class="tel" style="{vars_css(t)}">
  <div class="bar"><b>Adesso</b><span class="serie">{FIAMMA}<span>38 giorni</span></span></div>
  <div class="carta">
    <span class="chip" style="background:var(--area-Studio-tenue);color:var(--area-Studio-testo)">{ico('Studio','var(--area-Studio)',15)} Studio / Università</span>
    <div class="tit">Ripassa il capitolo 3</div><div class="meta">Una cosa alla volta · 25 minuti</div>
    <div class="sel"><span class="opz">15 min</span><span class="opz on">25 min</span><span class="opz">45 min</span></div>
    <button class="primario">Fatto</button><button class="ghost">Non ce l'ho fatta…</button>
  </div>
  <div class="lista">
    <div class="vo"><span class="sp fatta">{SPUNTA}</span><span class="fat">Bevi un bicchiere d'acqua</span>{ico('Salute','var(--area-Salute)',16)}</div>
    <div class="vo"><span class="sp"></span><span>Paga la bolletta</span>{ico('Finanze','var(--area-Finanze)',16)}</div>
    <div class="vo"><span class="sp"></span><span>Scrivi a Marta</span>{ico('Relazioni','var(--area-Relazioni)',16)}</div>
  </div>
  <div class="festa"><img src="{K[1]}" width="96"><div><b>Giornata chiusa</b><br><span class="xp">+40 XP</span></div></div>
  <div class="toast"><span class="ok">{SPUNTA}</span> Fatta. <span class="xp">+8 XP</span><span class="ann">Annulla</span></div>
  <div class="foc"><button class="primario piccolo anello">Con il fuoco</button><span class="m">anello doppio: 2px pagina + 2px focus</span></div>
  <div class="err"><span>Eliminare definitivamente?</span><button class="dist">Elimina</button></div>
</div>'''

def kubo_pagine():
    figs = ''.join(f'<img src="{u}" width="150">' for u in K)
    mis = [('blu (antenna, orecchie, piedi)', '#185fea', 'misurato 260-263°, L 0,50-0,55'), ('visore', '#1b2a62', 'L 0,29-0,34, 267-276°'),
           ('corpo, mezzitoni', '#e2e4fb', 'lavanda L 0,91-0,94'), ('scintille', '#fec72c', 'L 0,84-0,87, 83-90°')]
    chips = ''.join(f'<div class="cmp"><div class="sw" style="background:{x}"></div><div class="lab"><b>{n}</b><br>{x}<br><span class="m">{fmt_lch(x)} · {nota}</span></div></div>' for n, x, nota in mis)
    return f'''<div class="kp" style="background:{h('chiaro','pagina')}">{figs}</div><div class="kp" style="background:{h('scuro','pagina')}">{figs}</div>
    <h4>Colori misurati sulle 6 figure singole (mediana dei pixel per classe, misura_kubo.py)</h4><div class="riga">{chips}</div>'''

def ritocco():
    return f'''<div class="rit">
  <div><canvas id="c0" width="300" height="300"></canvas><div class="m"><b>Originale</b><br>blu misurato #185fea · oklch(53.5% 0.221 262)</div></div>
  <div><canvas id="c1" width="300" height="300"></canvas><div class="m"><b>Canonico proposto</b><br>#0151e3 · oklch(50% 0.23 262): stessa tinta, −0,035 di L, croma al massimo sRGB.<br>ΔE dall'originale 3,7 · bianco sopra 6,4:1 · ΔE da Things 12,7, TickTick 15,9</div></div>
  <div><canvas id="c2" width="300" height="300"></canvas><div class="m"><b>Anti-esempio: il «blu di categoria»</b><br>oklch(62% 0.18 260), il blu di Things/Calm: ΔE ≈ 2 da Things. È ciò da cui il canonico si allontana.</div></div>
  <div style="background:{h('scuro','pagina')};border-radius:12px"><canvas id="c3" width="300" height="300"></canvas><div class="m" style="color:#ddd"><b>Canonico su notte</b><br>la sagoma la porta il corpo bianco (15:1); il blu resta identico nei due temi</div></div>
</div>'''

def tessere():
    fam = {}
    for n, x in TESS:
        L, C, H = lch(x); f = ('rosso/corallo' if H < 40 or H >= 345 else 'arancio' if H < 70 else 'giallo' if H < 110 else 'verde' if H < 185 else 'acqua' if H < 215 else 'blu' if H < 280 else 'viola' if H < 320 else 'rosa')
        fam.setdefault(f, []).append((n, x))
    prima = ''.join(f'<div class="fam"><b>{f} ({len(v)})</b><div class="riga">' + ''.join(f'<div class="ts" style="background:{x}">{n}</div>' for n, x in v) + '</div></div>' for f, v in sorted(fam.items(), key=lambda z: -len(z[1])))
    stanze = [('stanza-gioia', 'Gioia', 'Felice, Energico, Motivato, Soddisfatto, Sorpreso, Crescita, Traguardo', 1),
              ('stanza-calma', 'Calma e focus', 'Concentrato, Calmo, Focus, Pausa, Riposo, Riflessione', 5),
              ('stanza-capisce', 'Comprensione', 'Stanco, Frustrato, Confuso, Sovraccarico, Stressato', 3),
              ('stanza-bentornato', 'Bentornato / affetto', 'Benessere, rientro, primo accesso', 4),
              ('stanza-concentrazione', 'Concentrazione (timer)', 'timer in corso, fine sessione', 2)]
    dopo = ''
    for t in ('chiaro', 'scuro'):
        dopo += '<div class="stz">' + ''.join(f'<div class="st" style="background:{h(t,k)};color:{h(t,"testo-1") if k!="stanza-concentrazione" else "#f2efe9"}"><img src="{K[i]}" width="110"><b>{nome}</b><span class="m">{tes}</span><span class="m">--{k} {h(t,k)}</span></div>' for k, nome, tes, i in stanze) + '</div>'
    return f'''<div class="tes"><div><h4>Prima: 25 tessere, 8 famiglie di tinta (campionate dal foglio)</h4><img src="{uri('ritagli/foglio-emozioni-420.png')}" width="300" style="border-radius:10px">{prima}</div>
    <div><h4>Dopo: 5 stanze, il colore lo porta la situazione, l'emozione la porta il viso di Kubo. Funzioni e categorie (To-do, Obiettivi, Studio, Alimentazione…) non hanno una tessera colorata: superficie neutra + icona, o il colore dell'area se sono un'area.</h4>{dopo}</div></div>'''

def mappa():
    W = 520; cx = cy = W / 2; R = 210
    def p(a, r): x = math.radians(-a); return cx + r * math.cos(x), cy + r * math.sin(x)
    s = f'<svg width="{W}" height="{W}" font-family="Inter" font-size="11">'
    x1, y1 = p(245, R); x2, y2 = p(270, R)
    s += f'<path d="M{cx} {cy}L{x1} {y1}A{R} {R} 0 0 0 {x2} {y2}Z" fill="#0151e3" opacity=".08"/>'
    for r in (70, 140, 210): s += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#ddd"/>'
    for a in range(0, 360, 30): x, y = p(a, R + 14); s += f'<text x="{x}" y="{y}" text-anchor="middle" fill="#999">{a}°</text>'
    pts = [(v['nome'].split(':')[0].split(' - ')[0][:16].replace('Duolingo', 'Duolingo (stag.)'), v['dominante']) for v in D.values() if v.get('dominante') and v.get('quota_colore', 1) > 0.05] + [('Duolingo (Feather)', '#58cc02')]
    for n, x in pts:
        L, C, H = lch(x); a, b = p(H, min(C, .25) / .25 * R)
        s += f'<circle cx="{a}" cy="{b}" r="7" fill="{x}" stroke="#333" stroke-width=".6"/><text x="{a+9}" y="{b+4}" fill="#444">{n}</text>'
    for n, x in (('Kubo canonico', h('chiaro', 'azione')), ('Kubo misurato', '#185fea'), ('oro di Kubo', h('chiaro', 'oro'))):
        L, C, H = lch(x); a, b = p(H, min(C, .25) / .25 * R)
        s += f'<circle cx="{a}" cy="{b}" r="11" fill="{x}" stroke="#111" stroke-width="2"/><text x="{a+14}" y="{b+4}" font-weight="700">{n}</text>'
    s += f'<text x="{cx}" y="{W-6}" text-anchor="middle" fill="#666">tinta OKLCH × croma. Settore 245°-270°: 5 concorrenti blu + Kubo</text></svg>'
    return s
def codici():
    rows = ''
    kubo = ''.join(f'<span style="flex:{w};background:{x}"></span>' for w, x in COD['kubo'])
    rows += f'<div class="cod"><b>Kubo (corpo, visore, blu, oro)</b><div class="bar2">{kubo}</div><span class="m">riferimento</span></div>'
    for d, n in COD['distanze'][:8]:
        cols = COD['icone'][n]; strip = ''.join(f'<span style="flex:{w};background:{x}"></span>' for w, x in cols)
        rows += f'<div class="cod"><b>{n[:30]}</b><div class="bar2">{strip}</div><span class="m">distanza di codice {d}</span></div>'
    return f'<div class="cods"><h4>Codici a 4 colori delle icone (k-means OKLab) più vicini a quello di Kubo</h4>{rows}</div>'

css = '''*{box-sizing:border-box} body{margin:0;font-family:Inter,system-ui,sans-serif;background:#ece9e4;color:#1a2135;padding:28px}
h1{margin:0 0 4px;font-size:30px} h2{margin:30px 0 10px;font-size:20px} h4{margin:12px 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:.05em;opacity:.75}
.m{font-size:11px;opacity:.8} .due{display:grid;grid-template-columns:1fr 1fr;gap:18px} .tema{border-radius:18px;padding:18px;background:var(--pagina);color:var(--testo-1)}
.riga{display:flex;flex-wrap:wrap;gap:8px} .cmp{width:118px} .sw{height:44px;border-radius:10px;border:1px solid rgba(128,128,128,.25)} .lab{font-size:10.5px;line-height:1.35;margin-top:4px}
.kp{display:flex;justify-content:space-around;border-radius:18px;padding:8px;margin-bottom:8px}
.rit{display:grid;grid-template-columns:repeat(4,1fr);gap:12px} .rit>div{background:#f9f6f2;border-radius:12px;padding:8px} .rit canvas{width:100%;height:auto}
.aree{display:grid;grid-template-columns:1fr 1fr;gap:10px} .area{display:flex;gap:10px;align-items:center;background:var(--superficie-1);padding:10px;border-radius:12px}
.ai{width:40px;height:40px;border-radius:10px;display:grid;place-items:center;flex:none} .an{font-weight:600;font-size:13px}
.chip{align-self:flex-start;display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;padding:3px 9px;border-radius:99px}
.tes{display:grid;grid-template-columns:420px 1fr;gap:20px;background:#fff;border-radius:18px;padding:16px} .fam{margin-top:6px} .ts{font-size:10px;padding:14px 6px 4px;border-radius:8px;color:#1a2135;width:76px}
.stz{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:8px} .st{border-radius:14px;padding:8px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:3px;min-height:230px}
.tel{width:380px;background:var(--pagina);color:var(--testo-1);border-radius:28px;padding:18px;display:flex;flex-direction:column;gap:12px}
.bar{display:flex;justify-content:space-between;align-items:center;font-size:20px} .serie{display:inline-flex;gap:6px;align-items:center;background:var(--oro-tenue);font-size:13px;font-weight:700;padding:5px 11px;border-radius:99px}
.carta{background:var(--superficie-1);border:1px solid var(--linea-decor);border-radius:20px;padding:16px;display:flex;flex-direction:column;gap:10px}
.tit{font-size:21px;font-weight:700} .meta{color:var(--testo-2);font-size:13px} .sel{display:flex;gap:8px}
.opz{padding:6px 12px;border-radius:99px;border:1.5px solid var(--linea-controllo);font-size:13px;color:var(--testo-2)} .opz.on{background:var(--azione-tenue);border-color:var(--azione-testo);color:var(--azione-testo);font-weight:700}
button{font:inherit;border:0;border-radius:14px;padding:13px;font-weight:700;font-size:16px} .primario{background:var(--azione);color:var(--testo-su-pieno)} .ghost{background:transparent;color:var(--testo-2);padding:6px} .piccolo{padding:8px 14px;font-size:13px}
.anello{outline:2px solid var(--focus);outline-offset:2px;box-shadow:0 0 0 2px var(--pagina)}
.lista{background:var(--superficie-1);border-radius:16px;padding:4px 12px} .vo{display:flex;align-items:center;gap:10px;padding:9px 0;font-size:14px;border-bottom:1px solid var(--linea-decor)} .vo:last-child{border:0} .vo span:nth-child(2){flex:1}
.sp{width:22px;height:22px;border-radius:50%;border:2px solid var(--linea-controllo);display:grid;place-items:center} .sp.fatta{background:var(--successo-pieno);border-color:var(--successo-pieno)} .fat{color:var(--testo-2);text-decoration:line-through}
.festa{display:flex;align-items:center;gap:10px;background:var(--stanza-gioia);border-radius:16px;padding:6px 12px;font-size:15px}
.toast{display:flex;align-items:center;gap:8px;background:var(--testo-1);color:var(--pagina);border-radius:14px;padding:10px 14px;font-size:14px;font-weight:600}
.toast .ok{width:20px;height:20px;border-radius:50%;background:var(--successo-pieno);display:grid;place-items:center} .xp{background:var(--oro);color:var(--testo-su-oro);padding:2px 8px;border-radius:99px;font-size:12px;font-weight:700} .ann{margin-left:auto;opacity:.75;font-weight:500}
.foc{display:flex;align-items:center;gap:12px} .err{display:flex;align-items:center;justify-content:space-between;background:var(--errore-tenue);color:var(--errore-testo);border-radius:14px;padding:10px 12px;font-size:13px;font-weight:600}
.dist{background:var(--errore-pieno);color:#fff;padding:7px 12px;font-size:13px;border-radius:10px} .gt{display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap}
.cods{background:#fff;border-radius:18px;padding:12px;width:520px} .cod{display:grid;grid-template-columns:190px 1fr 120px;gap:8px;align-items:center;font-size:12px;margin:4px 0} .bar2{display:flex;height:18px;border-radius:5px;overflow:hidden;border:1px solid #ddd}'''
tok = json.dumps({'orig': [0.535, 0.221], 'canon': [0.50, 0.23], 'cat': [0.62, 0.18]})
js = '''<script>
const P=%s;
function s2l(c){c/=255;return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4)}
function l2s(c){c=Math.max(0,Math.min(1,c));return 255*(c<=0.0031308?12.92*c:1.055*Math.pow(c,1/2.4)-0.055)}
function toLab(r,g,b){r=s2l(r);g=s2l(g);b=s2l(b);let l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b),m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b),s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);
 return [.2104542553*l+.7936177850*m-.0040720468*s,1.9779984951*l-2.4285922050*m+.4505937099*s,.0259040371*l+.7827717662*m-.8086757660*s]}
function toRgb(L,a,b){let l=Math.pow(L+.3963377774*a+.2158037573*b,3),m=Math.pow(L-.1055613458*a-.0638541728*b,3),s=Math.pow(L-.0894841775*a-1.2914855480*b,3);
 return [l2s(4.0767416621*l-3.3077115913*m+.2309699292*s),l2s(-1.2684380046*l+2.6097574011*m-.3413193965*s),l2s(-.0041960863*l-.7034186147*m+1.7076147010*s)]}
/* ricoloramento: solo i pixel della classe «blu di Kubo» (tinta 245-280°, croma > 0,10), con peso morbido sul croma;
   la luminosità si sposta dello scarto fra i valori di riferimento, il croma si scala: le ombre e le luci restano */
function ricolora(id,dest,bgs){const img=document.getElementById('src');const c=document.getElementById(id),x=c.getContext('2d');
 if(bgs){x.fillStyle=bgs;x.fillRect(0,0,300,300)}
 const o=document.createElement('canvas');o.width=300;o.height=300;const y=o.getContext('2d');y.drawImage(img,0,0,300,300);const d=y.getImageData(0,0,300,300),p=d.data;
 if(dest){const dL=dest[0]-P.orig[0],kC=dest[1]/P.orig[1];
  for(let i=0;i<p.length;i+=4){if(p[i+3]===0)continue;const [L,a,b]=toLab(p[i],p[i+1],p[i+2]);const C=Math.hypot(a,b);let h=Math.atan2(b,a)*180/Math.PI;if(h<0)h+=360;
   if(h<245||h>280||C<0.06)continue;const w=Math.min(1,(C-0.06)/0.08);const L2=L+dL*w,k=1+(kC-1)*w;const r=toRgb(L2,a*k,b*k);p[i]=r[0];p[i+1]=r[1];p[i+2]=r[2];}
  y.putImageData(d,0,0)}
 x.drawImage(o,0,0)}
window.addEventListener('load',()=>{ricolora('c0',null);ricolora('c1',P.canon);ricolora('c2',P.cat);ricolora('c3',P.canon,'%s');document.title+=' ✓'});
</script>''' % (tok, h('scuro', 'pagina'))
html = f'''<!doctype html><html lang="it"><meta charset="utf-8"><title>LifeMax Kubo</title><style>{css}</style><body>
<h1>LifeMax · sistema colore «Kubo»</h1>
<div class="m" style="font-size:13px">Marca = Kubo. Codice distintivo: blu elettrico + visore notte + corpo bianco + scintille d'oro, su carta calda. Verde smeraldo = fatto · ruggine = errore · oro = ricompensa. Valori da token.json, verificati in verifica.txt.</div>
<h2>1. Kubo, immagini originali scontornate, su pagina chiara (carta) e scura (notte)</h2>{kubo_pagine()}
<h2>2. Ritocco proposto del blu (canvas, solo valore e saturazione; la tinta 262° è fissa)</h2>{ritocco()}<img id="src" src="{uri('ritagli/kubo-0-360.png')}" style="display:none">
<h2>3. Palette, chiaro e scuro</h2><div class="due"><div class="tema" style="{vars_css('chiaro')}">{palette('chiaro')}</div><div class="tema" style="{vars_css('scuro')}">{palette('scuro')}</div></div>
<h2>4. Le otto aree (Studio non è più blu)</h2><div class="due"><div class="tema" style="{vars_css('chiaro')}">{aree('chiaro')}</div><div class="tema" style="{vars_css('scuro')}">{aree('scuro')}</div></div>
<h2>5. Le tessere-emozione: prima e dopo la disciplina</h2>{tessere()}
<h2>6. Scheda d'esempio (Adesso), mappa e codici dei concorrenti</h2><div class="gt">{scheda('chiaro')}{scheda('scuro')}<div><div style="background:#fff;border-radius:18px;padding:8px;margin-bottom:12px">{mappa()}</div>{codici()}</div></div>
{js}</body></html>'''
open('tavola.html', 'w').write(html); print('ok', len(html)//1024, 'KB')
