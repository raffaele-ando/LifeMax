/* Il contrasto del testo e dei controlli, su tutta l'app e nei due temi, e
   i colori scritti in un posto solo (vedi CONTROLLI e statico() più sotto).
   Nasce da un errore che l'occhio non vede: scritto `var(--inchiostro)` al
   posto di `var(--inchiostro-1)`, il color-mix diventa invalido e il testo
   torna al colore ereditato — grigio su bianco, cioè un colore plausibile.
   Il nome dell'area sulla schermata «Adesso» è rimasto grigio per un giro
   intero senza che si notasse, e a scoprirlo è stata una misura.

   Per ogni schermata e per ogni tema legge il colore CALCOLATO di ogni testo
   visibile e il fondo davvero dipinto sotto di lui, e pretende il minimo di
   WCAG AA: 4.5:1 per il testo normale, 3:1 per quello grande (≥24px, o ≥18.66
   se in grassetto). I colori si fanno risolvere al browser dipingendoli su un
   pixel: `getComputedStyle` restituisce i color-mix come `color(srgb …)` o
   `oklab(…)`, e leggerli con una regex dà zero.

   node prove/colori.js        (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const RADICE = require('./comune/dove').SERVITO;
const PORTA = 8756;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };

/* le schermate, e come ci si arriva */
const SCENE = [
  { nome: 'Oggi', vai: 'oggi' },
  { nome: 'Oggi · priorità', vai: 'oggi', prep: () => { const s = LM.load(), t = LM.todayKey();
      s.azioni = s.azioni.filter(x => x.data !== t); LM.save();
      const a = LM.aggiungiAzione('Una cosa da fare', 'finanze', { mit: true });
      a.ifThen = 'Quando succede X, allora faccio Y'; LM.save(); } },
  { nome: 'Oggi · in ritardo', ora: '16:40', vai: 'oggi' },
  { nome: 'Oggi · finita', ora: '21:00', vai: 'oggi', prep: () => { const s = LM.load(), t = LM.todayKey();
      s.azioni.filter(a => a.data === t).forEach(a => { a.done = true; a.doneAt = Date.now(); }); LM.save(); } },
  { nome: 'La giornata', vai: 'giornata' },
  { nome: 'Attività', vai: 'inbox' },
  { nome: 'Rituali', vai: 'rituali' },
  { nome: 'Andamento', vai: 'plancia' },
  { nome: 'Esperimenti', vai: 'esperimenti' },
  /* i pannelli, che prima restavano fuori: là i grigi piccoli sono più
     frequenti che nelle pagine (righe di spiegazione sotto un titolo, note
     sotto un campo) ed è proprio quella la combinazione che scivola sotto il
     minimo senza che si veda */
  { nome: 'Impostazioni', vai: 'plancia', apri: p => p.evaluate(() => {
      const b = (document.getElementById('fondo-impostazioni') || document.querySelector('[data-imp]'));
      if (b) b.click();
    }) },
  { nome: 'Promemoria', vai: 'plancia', apri: p => p.evaluate(() => {
      const b = (document.getElementById('fondo-impostazioni') || document.querySelector('[data-imp]'));
      if (b) b.click();
      const c = document.getElementById('imp-prom-come');
      if (c) c.click();
    }) },
  /* i posti che la prima versione non guardava: un foglio con campi e passi,
     le abitudini con le loro spunte, e il primo avvio — che nello scuro
     prendeva i colori delle aree del chiaro */
  { nome: 'Aspetto', vai: 'profilo', apri: async p => {
      await p.evaluate(() => { const b = [...document.querySelectorAll('#vista .lista-riga, #vista button')].find(x => x.textContent.includes('Impostazioni')); if (b) b.click(); });
      await p.waitForTimeout(700);
      await p.evaluate(() => { const b = document.getElementById('imp-aspetto'); if (b) b.click(); });
      /* i tre interruttori partono accesi: se ne spegne uno, per misurarlo */
      await p.waitForTimeout(600);
      await p.evaluate(() => { const i = document.querySelector('.sheet .interr.on'); if (i) i.click(); });
    } },
  { nome: 'Da fare · scheda', vai: 'inbox', apri: p => p.evaluate(() => {
      const t = [...document.querySelectorAll('#vista button')].find(x => x.textContent.includes('Da fare')); if (t) t.click();
      setTimeout(() => { const b = document.querySelector('#vista [data-bkapri]'); if (b) b.click(); }, 300);
    }) },
  { nome: 'Abitudini', vai: 'inbox', apri: p => p.evaluate(() => {
      const t = [...document.querySelectorAll('#vista button')].find(x => x.textContent.includes('Abitudini')); if (t) t.click();
    }) },
  { nome: 'Benvenuto', vai: 'oggi', vuoto: true },
  { nome: 'Benvenuto · aree', vai: 'oggi', vuoto: true, apri: async p => {
      await p.evaluate(() => { const b = document.querySelector('[data-bv=inizia]'); if (b) b.click(); });
      await p.waitForTimeout(500);
      await p.evaluate(() => { const b = document.querySelector('[data-bv=avanti]'); if (b) b.click(); });
      await p.waitForTimeout(500);
      await p.evaluate(() => { [...document.querySelectorAll('[data-area]')].slice(0, 2).forEach(e => e.click()); });
    } }
];
/* dentro la pagina: ogni testo visibile, il suo contrasto col fondo dipinto */
/* gli attrezzi comuni alle due misure: risolvere un colore, comporre gli
   strati, il rapporto di contrasto */
const AIUTI = `
  var cv = document.createElement('canvas'); cv.width = cv.height = 1;
  var cx = cv.getContext('2d', { willReadFrequently: true });
  /* Un colore CSS qualunque → [r, g, b, a], alfa compresa.
     Serve dipingerlo due volte, su bianco e su nero: getComputedStyle
     restituisce i color-mix come \`color(srgb …)\` o \`oklab(…)\`, e leggerli
     con una regex dà zero; e dipingerlo una volta sola perde l'alfa, che è
     il pezzo che conta quando una pastiglia è «accento al 18%». */
  function pinta(fondo, c) {
    cx.fillStyle = fondo; cx.fillRect(0, 0, 1, 1);
    cx.fillStyle = c; cx.fillRect(0, 0, 1, 1);
    var d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2]];
  }
  function risolvi(c) {
    var b = pinta('#000', c), w = pinta('#fff', c);
    /* su bianco: c·a + 255(1−a);  su nero: c·a  ⇒  a = 1 − (w−b)/255 */
    var a = 1 - (w[0] - b[0]) / 255;
    if (a <= 0.004) return [0, 0, 0, 0];
    return [b[0] / a, b[1] / a, b[2] / a, Math.min(1, a)];
  }
  function sopra(f, s) {
    var a = f[3];
    return [f[0] * a + s[0] * (1 - a), f[1] * a + s[1] * (1 - a), f[2] * a + s[2] * (1 - a), 1];
  }
  function lum(c) {
    var v = [c[0], c[1], c[2]].map(function (x) { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  function rapporto(f, s) {
    var a = lum(f), b = lum(s);
    return Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100;
  }

  /* gli strati sotto al testo, dal più vicino al più lontano. Ogni strato è
     un elenco di colori possibili: una tinta ne ha uno, una sfumatura ne ha
     uno per fermata (e si prende il caso peggiore, perché il testo ci passa
     sopra tutta). */
  function strati(el) {
    var out = [], e = el;
    while (e) {
      var st = getComputedStyle(e);
      var bi = st.backgroundImage;
      if (bi && bi !== 'none') {
        var f = bi.match(/rgba?\\([^)]*\\)|#[0-9a-fA-F]{3,8}|\\b(?:white|black)\\b/g);
        if (f && f.length) out.push(f.slice(0, 4));
      }
      var bg = st.backgroundColor;
      if (bg && bg !== 'transparent' && !/rgba\\(0, *0, *0, *0\\)/.test(bg)) {
        var r = risolvi(bg);
        out.push([bg]);
        if (r[3] >= 0.995) break;   /* opaco: sotto non si vede più niente */
      }
      e = e.parentElement;
    }
    var radice = getComputedStyle(document.documentElement).backgroundColor;
    out.push([(radice && !/rgba\\(0, *0, *0, *0\\)/.test(radice)) ? radice : '#fff']);
    return out;
  }

  /* il fondo composto, per ogni combinazione di fermate: si parte dal fondo
     e si sovrappongono gli strati venendo verso il testo */
  function fondi(el) {
    var st = strati(el);
    var combo = [[]];
    for (var i = 0; i < st.length; i++) {
      var nuove = [];
      for (var k = 0; k < combo.length; k++) {
        for (var j = 0; j < st[i].length; j++) {
          nuove.push(combo[k].concat([st[i][j]]));
          if (nuove.length >= 12) break;   /* basta: interessa il caso peggiore, non tutti */
        }
      }
      combo = nuove;
    }
    return combo.map(function (via) {
      var acc = risolvi(via[via.length - 1]); acc[3] = 1;
      for (var i = via.length - 2; i >= 0; i--) acc = sopra(risolvi(via[i]), acc);
      return acc;
    });
  }

`;

/* dentro la pagina: ogni testo visibile, il suo contrasto col fondo dipinto */
const CONTRASTI = `(function () {` + AIUTI + `
  var fuori = [], ammessi = [], visti = 0;
  document.querySelectorAll('body *').forEach(function (el) {
    /* solo chi ha testo proprio: se lo contasse anche il genitore, lo stesso
       testo finirebbe misurato dieci volte col colore di dieci scatole */
    var proprio = [].slice.call(el.childNodes)
      .filter(function (n) { return n.nodeType === 3 && n.textContent.trim(); })
      .map(function (n) { return n.textContent.trim(); }).join(' ');
    if (!proprio) return;
    var r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    var st = getComputedStyle(el);
    if (st.visibility === 'hidden' || +st.opacity < 0.35) return;
    if (el.closest('[hidden], .lab-demo')) return;
    var px = parseFloat(st.fontSize);
    var grosso = px >= 24 || (px >= 18.66 && parseInt(st.fontWeight, 10) >= 700);
    var minimo = grosso ? 3 : 4.5;
    /* Su un fondo di marca il testo bianco non passa: il ramo chiaro della
       sfumatura arriva a 2.3:1. È un difetto vero e sta scritto qui invece di
       essere nascosto — per sistemarlo servirebbe scurire la sfumatura di
       tutta l'app (il viola e il blu cambiano appena, #7c5df0→#7a5bf0 e
       #4a7bf5→#356bf4; il ciano diventa un turchese, #2ab8e8→#127fa3), che è
       una decisione sull'aspetto, non un ritocco. */
    /* QUI C'ERA UN'ESENZIONE, e ha coperto un guasto per mesi.
       «.btn-primario» e «.tab-catt» erano «ammessi» sotto il minimo: quando
       il marchio era una sfumatura viola-ciano il bianco sopra non passava,
       e la scelta era stata di scriverlo invece di nasconderlo. Poi il
       marchio è diventato un petrolio pieno — su cui il bianco passa a
       13:1 — e l'esenzione è rimasta. Nel tema scuro quel petrolio si
       ribalta in un quasi-bianco, il testo dei tasti restava bianco fisso,
       e il risultato era 1,28:1 su OGNI tasto principale dell'app: questa
       prova lo misurava, lo metteva fra gli «ammessi», e diceva verde.
       Un'eccezione senza scadenza diventa il posto dove i guasti nuovi
       vanno a nascondersi. Adesso non ce n'è nessuna. */
    var ammesso = false;
    var peggio = null;
    fondi(el).forEach(function (bg) {
      var testo = sopra(risolvi(st.color), bg);
      var rap = rapporto(testo, bg);
      if (peggio === null || rap < peggio) peggio = rap;
    });
    visti++;
    if (peggio < minimo) {
      (ammesso ? ammessi : fuori).push({ testo: proprio.slice(0, 42), cls: el.className && el.className.toString().slice(0, 30),
        px: Math.round(px * 10) / 10, peso: st.fontWeight, rap: peggio, minimo: minimo });
    }
  });
  return { visti: visti, fuori: fuori, ammessi: ammessi };
})()`;

let fail = 0;
const ok = (n, c, d) => { if (!c) fail++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

/* ============================================================
   I CONTROLLI, NON SOLO LE PAROLE (SC 1.4.11, 2.4.7)

   La misura qui sopra guarda il testo, e per questo era verde mentre il
   bordo dei campi stava a 1,36:1, il cerchio della spunta a 1,46:1 e
   l'interruttore spento a 1,05:1: nessuno dei tre è un nodo di testo. E il
   segnaposto, che è uno pseudo-elemento, lo disegnava il browser in un
   grigio suo che sulle superfici grigie dei fogli scendeva sotto 4,5.
   Qui si misurano, sugli elementi veri di ogni schermata:
     · il bordo di ogni campo, contro il fondo fuori e dentro   ≥ 3:1
     · il cerchio di ogni spunta non ancora fatta                ≥ 3:1
     · l'interruttore spento: il contorno e il pomello           ≥ 3:1
     · il segnaposto di ogni campo vuoto                         ≥ 4,5:1
     · l'anello del fuoco sul tasto principale: spesso almeno 2px,
       staccato almeno 2px, e ≥ 3:1 sul fondo dove cade
   e, una volta per tema, le coppie di token che li fanno.
   Il bordo che `forma.ts` ridisegna come immagine si legge da
   `data-forma-bordo`, dove forma.ts lo mette da parte: il bordo vero, a quel
   punto, è stato reso trasparente. */
const CONTROLLI = `(function (conToken) {` + AIUTI + `
  var fuori = [], visti = 0;
  function vede(el) {
    var r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false;
    var st = getComputedStyle(el); if (st.visibility === 'hidden' || st.display === 'none') return false;
    if (el.closest('[hidden], .lab-demo, #lab-demo, .gr-spento')) return false;
    for (var e = el; e; e = e.parentElement) if (+getComputedStyle(e).opacity < 0.5) return false;
    return true;
  }
  function nome(el) { return el.tagName.toLowerCase() + (el.className && el.className.toString ? '.' + el.className.toString().trim().split(/\\s+/).slice(0, 2).join('.') : ''); }
  function peggio(col, el) {
    var m = null;
    fondi(el).forEach(function (bg) { var r = rapporto(sopra(risolvi(col), bg), bg); if (m === null || r < m) m = r; });
    return m;
  }
  function misura(cosa, el, col, dove, minimo) {
    if (!col || risolvi(col)[3] < 0.05) return;
    visti++;
    var r = peggio(col, dove);
    if (r < minimo) fuori.push(cosa + ' ' + nome(el) + ' ' + r + ' < ' + minimo);
  }
  /* il colore che fa vedere un controllo: il bordo, o quello dello
     pseudo-elemento che lo disegna, o l'ombra interna che fa da bordo */
  function tratto(el) {
    var st = getComputedStyle(el);
    if (parseFloat(st.borderTopWidth) >= 1) {
      var c = el.dataset.formaBordo || st.borderTopColor;
      if (risolvi(c)[3] > 0.05) return c;
    }
    var pr = getComputedStyle(el, '::before');
    if (pr.content !== 'none' && parseFloat(pr.borderTopWidth) >= 1) return pr.borderTopColor;
    var m = /(rgba?\\([^)]*\\)|color\\([^)]*\\)|oklab\\([^)]*\\))[^,]*inset/.exec(st.boxShadow);
    return m ? m[1] : null;
  }
  var CAMPI = 'input[type=text], input[type=url], input[type=time], input[type=date], input[type=number], textarea, select';
  document.querySelectorAll(CAMPI).forEach(function (el) {
    if (!vede(el)) return;
    var st = getComputedStyle(el);
    if (parseFloat(st.borderTopWidth) >= 1) {
      var c = el.dataset.formaBordo || st.borderTopColor;
      misura('bordo del campo', el, c, el.parentElement, 3);
      if (risolvi(st.backgroundColor)[3] > 0.5) misura('bordo del campo (dentro)', el, c, el, 3);
    }
    if (el.placeholder && !el.value) misura('segnaposto', el, getComputedStyle(el, '::placeholder').color, el, 4.5);
  });
  var SPUNTE = '.spunta-tonda, .giornata .gio-so-riga:not(.fatta) .tl-check, .lista-riga:not(.fatta) .lista-azione.spunta, ' +
    '.riga-azione:not(.fatta) .spunta, .tl-blk-att:not(.fatta) .tl-blk-check, .tl-ed-riga:not(.fatta) .tl-check, ' +
    '.ab-carta:not(.fatta) .ab-spunta, .bv-tessera:not(.on) .bv-spunta, .bv-scelta:not(.on) .bv-radio';
  document.querySelectorAll(SPUNTE).forEach(function (el) {
    if (!vede(el)) return;
    misura('cerchio della spunta', el, tratto(el), el.parentElement, 3);
  });
  document.querySelectorAll('.interr:not(.on)').forEach(function (el) {
    if (!vede(el)) return;
    misura('interruttore spento', el, tratto(el), el.parentElement, 3);
    var i = el.querySelector('i'); if (i) misura('pomello spento', i, getComputedStyle(i).backgroundColor, el.parentElement, 3);
  });
  /* il fuoco sul tasto principale: è il caso difficile, perché il blu
     dell'anello e il blu del pieno sono lo stesso blu */
  var tasto = [].slice.call(document.querySelectorAll('.btn-primario, .btn-ok, .bv-cta, .fascia-ora button')).filter(vede)[0];
  if (tasto) {
    tasto.focus({ focusVisible: true });
    var fs = getComputedStyle(tasto);
    visti++;
    if (fs.outlineStyle === 'none' || parseFloat(fs.outlineWidth) < 2) fuori.push('anello del fuoco assente o sotto i 2px su ' + nome(tasto) + ' (' + fs.outlineStyle + ' ' + fs.outlineWidth + ')');
    else {
      if (parseFloat(fs.outlineOffset) < 2) fuori.push('anello del fuoco attaccato al pieno su ' + nome(tasto) + ' (offset ' + fs.outlineOffset + ')');
      misura('anello del fuoco', tasto, fs.outlineColor, tasto.parentElement, 3);
    }
    tasto.blur();
  }
  if (conToken) {
    var R = getComputedStyle(document.documentElement);
    var t = function (n) { return R.getPropertyValue('--' + n).trim(); };
    var coppia = function (a, b, minimo) {
      visti++;
      var f = risolvi(t(b)); f[3] = 1;
      var r = rapporto(sopra(risolvi(t(a)), f), f);
      if (r < minimo) fuori.push('token --' + a + ' su --' + b + ' ' + r + ' < ' + minimo);
    };
    ['pagina', 'superficie-1', 'superficie-2'].forEach(function (s) {
      coppia('linea-controllo', s, 3); coppia('focus', s, 3); coppia('azione-linea', s, 3);
    });
    ['pagina', 'superficie-1', 'superficie-2', 'superficie-3'].forEach(function (s) {
      coppia('campo-segnaposto', s, 4.5); coppia('testo-3', s, 4.5);
    });
    ['azione', 'azione-hover', 'azione-premuta', 'successo-pieno', 'errore-pieno'].forEach(function (s) {
      coppia('testo-su-pieno', s, 4.5);
    });
    coppia('testo-su-oro', 'oro', 4.5);
    coppia('timer-anello', 'timer-fondo', 3); coppia('timer-anello-pausa', 'timer-fondo', 3);
  }
  return { visti: visti, fuori: fuori };
})`;

/* ============================================================
   UN COLORE SI SCRIVE IN UN POSTO SOLO

   Fuori da `src/stile/token.css` nessun esadecimale e nessun `rgb()`: prima
   erano centoquattro, nove arancioni per la stessa fiamma. E dentro
   token.css gli esadecimali stanno solo fra le PRIMITIVE; i due temi sono
   un blocco ciascuno, e nessun altro foglio ridefinisce un token.
   Le eccezioni sono scritte qui, col perché:
     · il Design lab (src/lab, lab.css, Lab.tsx): dieci interfacce diverse
       per scelta, ognuna col suo colore, chiuse sotto `#lab-demo`;
     · il logo di Google sul tasto d'accesso: i suoi quattro colori li
       impongono le linee guida del marchio;
     · il colore della barra del browser in index.html e nel manifest: un
       attributo HTML e un JSON non leggono var(). Devono essere UGUALI a
       --pagina del tema, e questa prova lo controlla.
   Le icone PNG/SVG in icone/ sono immagini, non codice, e non si leggono. */
const ECCEZIONI_HEX = {
  'src/segni/segni.ts': ['#ea4335', '#4285f4', '#fbbc05', '#34a853']
};
function statico() {
  const RAMO = path.join(__dirname, '..');
  const tutti = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? tutti(path.join(d, e.name)) : [path.join(d, e.name)]);
  const senzaCommenti = s => s.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '))
    .replace(/<!--[\s\S]*?-->/g, m => m.replace(/[^\n]/g, ' ')).replace(/(^|[^:'"\\])\/\/.*$/gm, '$1');
  const COLORE = /(?<![&\w])#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(/g;
  const tok = fs.readFileSync(path.join(RAMO, 'src/stile/token.css'), 'utf8');
  /* i valori dei token, per seguire le catene var() fino all'esadecimale */
  const blocchi = {};
  senzaCommenti(tok).replace(/(:root(?:\[data-mode="dark"\])?)\s*\{([\s\S]*?)\n\}/g, (m, sel, corpo) => {
    (blocchi[sel] = blocchi[sel] || []).push(corpo); return m;
  });
  ok('token.css: un blocco solo per tema', (blocchi[':root'] || []).length === 1 && (blocchi[':root[data-mode="dark"]'] || []).length === 1,
    ':root ×' + (blocchi[':root'] || []).length + ', scuro ×' + (blocchi[':root[data-mode="dark"]'] || []).length);
  const decl = c => { const o = {}; c.replace(/(--[\w-]+)\s*:\s*([^;]+);/g, (m, k, v) => { o[k] = v.trim(); return m; }); return o; };
  const chiaro = decl((blocchi[':root'] || [''])[0]);
  const scuro = Object.assign({}, chiaro, decl((blocchi[':root[data-mode="dark"]'] || [''])[0]));
  const vale = (t, n, giro) => { const v = t[n] || ''; const m = /^var\((--[\w-]+)\)$/.exec(v); return m && (giro || 0) < 9 ? vale(t, m[1], (giro || 0) + 1) : v.toLowerCase(); };
  /* gli esadecimali di token.css stanno solo nelle primitive */
  const iSem = tok.indexOf('-- 2. SEMANTICI');
  const fuoriPrim = (senzaCommenti(tok.slice(iSem)).match(/(?<![&\w%])#[0-9a-fA-F]{3,8}\b/g) || []);
  ok('token.css: esadecimali solo fra le primitive', fuoriPrim.length === 0, fuoriPrim.join(' ') || 'semantici e componenti puntano alle primitive');
  /* nessun altro foglio ridefinisce un token */
  const nomi = new Set(Object.keys(chiaro));
  const fuori = [], ridefiniti = [];
  for (const f of tutti(path.join(RAMO, 'src'))) {
    const rel = path.relative(RAMO, f).split(path.sep).join('/');
    if (!/\.(css|ts|tsx|html)$/.test(f) || rel === 'src/stile/token.css') continue;
    if (/^src\/lab\/|^src\/stile\/lab\.css$|^src\/schermi\/Lab\.tsx$/.test(rel)) continue;
    const testo = senzaCommenti(fs.readFileSync(f, 'utf8'));
    testo.split('\n').forEach((riga, i) => {
      (riga.match(COLORE) || []).forEach(h => {
        const v = h.toLowerCase();
        if ((ECCEZIONI_HEX[rel] || []).includes(v)) return;
        if (rel === 'src/index.html' && /theme-color/.test(riga)) return;   /* controllato sotto */
        fuori.push(rel + ':' + (i + 1) + ' ' + h);
      });
    });
    if (/\.css$/.test(f)) testo.replace(/(--[\w-]+)\s*:/g, (m, k) => { if (nomi.has(k)) ridefiniti.push(rel + ' ' + k); return m; });
  }
  ok('nessun colore scritto fuori da token.css', fuori.length === 0, fuori.slice(0, 12).join(' | ') || 'eccezioni: lab, logo Google, barra del browser');
  ok('nessun foglio ridefinisce un token', ridefiniti.length === 0, ridefiniti.slice(0, 12).join(' | ') || 'fonte unica');
  /* la barra del browser = --pagina */
  const html = fs.readFileSync(path.join(RAMO, 'src/index.html'), 'utf8');
  const meta = s => ((new RegExp('theme-color" content="(#[0-9a-fA-F]{6})" media="\\(prefers-color-scheme: ' + s)).exec(html) || [])[1];
  const man = JSON.parse(fs.readFileSync(path.join(RAMO, 'public/manifest.webmanifest'), 'utf8'));
  const pc = vale(chiaro, '--pagina'), ps = vale(scuro, '--pagina');
  ok('barra del browser = --pagina', (meta('light') || '').toLowerCase() === pc && (meta('dark') || '').toLowerCase() === ps &&
    man.theme_color.toLowerCase() === pc && man.background_color.toLowerCase() === pc, 'chiaro ' + pc + ', scuro ' + ps);
}

(async () => {
  console.log('IL CODICE');
  statico();
  const srv = http.createServer((q, r) => {
    let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
    fs.readFile(path.join(RADICE, p), (e, d) => {
      if (e) { r.statusCode = 404; r.end('x'); return; }
      r.setHeader('Content-Type', T[path.extname(p)] || 'application/octet-stream'); r.end(d);
    });
  });
  await new Promise(r => srv.listen(PORTA, r));
  const b = await require('./comune/lancia')();
  let totale = 0, controlli = 0;
  const noti = new Set();

  for (const scuro of [false, true]) {
    console.log('\n' + (scuro ? 'TEMA SCURO' : 'TEMA CHIARO'));
    for (const s of SCENE) {
      const p = await b.newPage({ viewport: { width: 390, height: 900 }, hasTouch: true, isMobile: true,
        colorScheme: scuro ? 'dark' : 'light' });
      await p.addInitScript(t => {
        const D = Date;
        class F extends D { constructor(...a) { if (!a.length) super(t); else super(...a); } static now() { return t; } }
        window.Date = F;
      }, new Date('2026-08-18T' + (s.ora || '10:30') + ':00').getTime());
      await p.goto('http://localhost:' + PORTA + '/index.html'); await p.waitForTimeout(320);
      await p.evaluate(v => { localStorage.clear(); if (!v) LM.seedDemo(); }, !!s.vuoto);
      if (s.prep) await p.evaluate(s.prep);
      await p.evaluate(v => { location.hash = '#/' + v; }, s.vai);
      await p.reload(); await p.waitForTimeout(700);
      if (s.apri) { await s.apri(p); await p.waitForTimeout(500); }
      const r = await p.evaluate(CONTRASTI);
      totale += r.visti;
      const dillo = x => '«' + x.testo + '» ' + x.rap + ' < ' + x.minimo + ' (' + x.px + 'px/' + x.peso + (x.cls ? ' .' + x.cls : '') + ')';
      ok(s.nome.padEnd(20) + r.visti + ' testi', r.fuori.length === 0,
        r.fuori.length ? r.fuori.map(dillo).join(' | ') : 'tutti sopra il minimo');
      r.ammessi.forEach(x => noti.add(dillo(x)));
      const k = await p.evaluate(CONTROLLI + '(' + (s === SCENE[0]) + ')');
      controlli += k.visti;
      ok(s.nome.padEnd(20) + k.visti + ' controlli', k.fuori.length === 0, k.fuori.length ? k.fuori.join(' | ') : 'bordi, spunte, segnaposto e fuoco sopra il minimo');
      await p.close();
    }
  }
  console.log('\n' + totale + ' testi misurati, ' + controlli + ' controlli');
  if (noti.size) {
    console.log('\n--- sotto il minimo, e lo sappiamo ---');
    [...noti].sort().forEach(x => console.log('  ' + x));
  }
  console.log(fail ? '>>> ' + fail + ' PROBLEMI' : '>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();
