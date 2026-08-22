/* Gli spazi fra gli elementi: una scala sola, e la vicinanza che dice il vero.
   Nasce da «analizza ogni spazio tra elementi e misura tipo griglia».

   Misurando ogni distanza fra due elementi incolonnati su venti schermate e
   otto larghezze erano venuti fuori 38 valori diversi, con 7-8-9-10-11 usati
   per lo stesso mestiere: differenze che l'occhio non vede ma che impediscono
   a due componenti di allinearsi. E quasi nessuna era stata scelta — nascevano
   dal collasso di due margini indipendenti, e cambiavano da sole quando un
   contenitore diventava flex (fra la testa e la riga delle sezioni: 20px su
   ogni pagina, 38 su «Oggi», per quel motivo e per nient'altro).

   Questa prova tiene fermo quello che si è messo a posto:
     · i giunti della pagina (testa → sezioni → corpo) sono UNO, uguale su
       tutte le pagine e a tutte le larghezze;
     · le distanze di primo e secondo livello stanno sulla scala 0/4/8/12/
       16/24/32/40 (un pixel di tolleranza: i bordi delle schede);
     · lo spazio FRA due gruppi non è minore di quello DENTRO un gruppo —
       la regola di Gestalt che l'occhio legge prima di ogni etichetta;
     · nessuna schermata sborda in orizzontale, a nessuna larghezza.

   Nota su cosa NON misura: solo elementi di blocco, e solo se incolonnati.
   Fra due etichette con un campo in mezzo la distanza risulta enorme perché
   il campo è inline e viene saltato: quelle non sono distanze vere.

   node prove/spazi.js        (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
const PORTA = 8757;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };
const SCALA = [0, 4, 8, 12, 16, 24, 32, 40, 48];
const TOLL = 1.5;              /* i bordi da 1px e le altezze frazionarie */
const LARGHEZZE = [320, 390, 744, 1280];

const SCENE = [
  { n: 'Oggi', vai: 'oggi' },
  { n: 'Oggi · vuota', vai: 'oggi', prep: () => { const s = LM.load(), t = LM.todayKey(); s.azioni = s.azioni.filter(a => a.data !== t); LM.save(); } },
  { n: 'La giornata', vai: 'giornata' },
  { n: 'Attività · da sistemare', vai: 'inbox', tab: 0 },
  { n: 'Attività · da fare', vai: 'inbox', tab: 1 },
  { n: 'Attività · abitudini', vai: 'inbox', tab: 2 },
  { n: 'Rituali', vai: 'rituali' },
  { n: 'Andamento · riepilogo', vai: 'plancia', tab: 0 },
  { n: 'Andamento · diario', vai: 'plancia', tab: 1 },
  { n: 'Esperimenti', vai: 'esperimenti' },
  { n: 'Scheda di un’attività', vai: 'inbox', tab: 1, poi: p => p.evaluate(() => { const r = document.querySelector('[data-bkapri]'); if (r) r.click(); }) },
  { n: 'Impostazioni', vai: 'plancia', poi: p => p.evaluate(() => { const b = [...document.querySelectorAll('#vista button')].find(x => /Impostazioni/.test(x.textContent)); if (b) b.click(); }) },
  { n: 'Cattura rapida', vai: 'oggi', poi: p => p.evaluate(() => { const b = document.querySelector('.tabbar [data-catt]'); if (b) b.click(); }) }
];

const MISURA = `(function () {
  var ovl = document.querySelector('.sheet-overlay:not([hidden]), .overlay:not([hidden])');
  var radice = ovl ? (ovl.querySelector('.sheet-corpo, .pannello-cattura') || ovl) : document.getElementById('vista');
  if (!radice) return null;
  function vis(el) {
    var r = el.getBoundingClientRect(), s = getComputedStyle(el);
    return r.width > 2 && r.height > 2 && s.visibility !== 'hidden' && s.display !== 'none' && s.display !== 'contents';
  }
  function blocco(el) {
    var s = getComputedStyle(el).display;
    return !/^inline($|-)/.test(s) || s === 'inline-flex' || s === 'inline-grid';
  }
  function nome(el) {
    return el.tagName.toLowerCase() + (el.className && el.className.toString
      ? ('.' + el.className.toString().trim().split(/\\s+/).slice(0, 2).join('.')) : '');
  }
  function firma(el) { return el.tagName + '|' + (el.className || '').toString().trim(); }
  /* i figli incolonnati di un contenitore, e la distanza fra due vicini */
  function colonna(cont) {
    var f = [].slice.call(cont.children).filter(function (e) { return vis(e) && blocco(e); });
    var out = [];
    for (var i = 0; i < f.length - 1; i++) {
      var a = f[i].getBoundingClientRect(), b = f[i + 1].getBoundingClientRect();
      if (b.top >= a.bottom - 1 && Math.abs(a.left - b.left) < Math.max(a.width, b.width)) {
        out.push({ g: Math.round((b.top - a.bottom) * 10) / 10, a: f[i], b: f[i + 1] });
      }
    }
    return { figli: f, coppie: out };
  }
  var spazi = [], gruppi = [];
  (function cammina(cont, liv) {
    var c = colonna(cont);
    c.coppie.forEach(function (p) {
      if (p.g >= 0 && p.g <= 220) spazi.push({ g: p.g, liv: liv, cont: nome(cont), a: nome(p.a), b: nome(p.b) });
    });
    /* un contenitore di gruppi: due o più figli con la stessa firma.
       Lo spazio fra loro non può essere minore di quello dentro di loro. */
    var perFirma = {};
    c.figli.forEach(function (e) { (perFirma[firma(e)] = perFirma[firma(e)] || []).push(e); });
    Object.keys(perFirma).forEach(function (k) {
      var g = perFirma[k];
      if (g.length < 2) return;
      /* Il bianco che si vede fra due gruppi non è solo il margine: è il
         margine PIÙ il riempimento dei due (un gruppo con 16px di padding e
         un filo sopra è separatissimo anche se i due riquadri si toccano).
         Senza contarlo, ogni elenco con le righe bordate sembrava un errore. */
      var fra = [];
      c.coppie.forEach(function (p) {
        if (firma(p.a) !== k || firma(p.b) !== k) return;
        var sa = getComputedStyle(p.a), sb = getComputedStyle(p.b);
        fra.push(p.g + parseFloat(sa.paddingBottom) + parseFloat(sb.paddingTop));
      });
      if (!fra.length) return;
      var dentro = 0, quale = '';
      g.forEach(function (e) {
        colonna(e).coppie.forEach(function (p) { if (p.g > dentro) { dentro = p.g; quale = nome(p.a) + '→' + nome(p.b); } });
      });
      var min = Math.min.apply(null, fra);
      if (dentro > 0 && min + 1 < dentro) {
        gruppi.push({ cont: nome(cont), gruppo: nome(g[0]), fra: min, dentro: dentro, quale: quale });
      }
    });
    if (liv < 3) c.figli.forEach(function (e) { cammina(e, liv + 1); });
  })(radice, 0);
  /* i giunti della pagina: testa → riga delle sezioni → corpo */
  var giunti = null;
  if (!ovl) {
    var v = document.getElementById('vista');
    var nv = v.querySelector(':scope > .sez-nav');
    if (nv) {
      /* «testa» non è più la distanza da un titolo — le schermate il cui nome
         è già scritto nella navigazione non ne hanno uno — ma da dove comincia
         il contenuto della pagina: è quella che si vede, e deve essere la
         stessa su tutte le pagine. */
      var st = getComputedStyle(v);
      var alto = v.getBoundingClientRect().top + parseFloat(st.paddingTop) - v.scrollTop;
      /* il primo fratello che occupa spazio: l'intestazione per i lettori di
         schermo è assoluta e alta un pixel, e presa come «blocco dopo» dava
         distanze negative */
      var dopo = nv.nextElementSibling;
      while (dopo && dopo.getBoundingClientRect().height < 2) dopo = dopo.nextElementSibling;
      /* su «Oggi» il blocco dopo la riga è la scena a margini automatici:
         lì il giunto non è un numero, è lo spazio che resta */
      var slack = dopo && (dopo.classList.contains('focus-scena') || dopo.querySelector(':scope > .focus-scena'));
      giunti = {
        testa: Math.round((nv.getBoundingClientRect().top - alto) * 10) / 10,
        corpo: (dopo && !slack) ? Math.round((dopo.getBoundingClientRect().top - nv.getBoundingClientRect().bottom) * 10) / 10 : null
      };
    }
  }
  return { spazi: spazi, gruppi: gruppi, giunti: giunti,
    scroll: { w: document.documentElement.scrollWidth, vp: innerWidth } };
})()`;

let fail = 0;
const ok = (n, c, d) => { if (!c) fail++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };
const sullaScala = g => SCALA.some(v => Math.abs(g - v) <= TOLL);

(async () => {
  const srv = http.createServer((q, r) => {
    let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
    fs.readFile(path.join(RADICE, p), (e, d) => {
      if (e) { r.statusCode = 404; r.end('x'); return; }
      r.setHeader('Content-Type', T[path.extname(p)] || 'application/octet-stream'); r.end(d);
    });
  });
  await new Promise(r => srv.listen(PORTA, r));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  const fuori = new Map(), gruppiRotti = new Map(), sborda = [], giunti = new Map();
  let misurati = 0;

  for (const L of LARGHEZZE) {
    const p = await b.newPage({ viewport: { width: L, height: L < 500 ? 844 : 900 }, hasTouch: L < 860, isMobile: L < 860 });
    await p.addInitScript(t => {
      const D = Date;
      class F extends D { constructor(...a) { if (!a.length) super(t); else super(...a); } static now() { return t; } }
      window.Date = F;
      /* Niente animazioni mentre si misura. Le schermate entrano con uno
         scorrimento a scaglioni (fino a 250ms di ritardo sul sesto blocco):
         misurando durante l'ingresso le distanze risultavano 10, 17.9, 27,
         37.6 per la stessa coppia a ogni giro — non erano spazi, erano
         fotogrammi. */
      addEventListener('DOMContentLoaded', function () {
        var st = document.createElement('style');
        st.textContent = '*, *::before, *::after { animation: none !important;' +
          ' transition: none !important; }';
        document.head.appendChild(st);
      });
    }, new Date('2026-08-18T10:30:00').getTime());
    await p.goto('http://localhost:' + PORTA + '/index.html'); await p.waitForTimeout(300);
    for (const s of SCENE) {
      await p.evaluate(() => {
        localStorage.clear(); LM.seedDemo();
        ['Rispondere alla mail del prof', 'Prep pasti per domani', 'Chiamare la banca']
          .forEach(t => LM.aggiungiAzione(t, 'altro', {}));
      });
      if (s.prep) await p.evaluate(s.prep);
      await p.evaluate(v => { location.hash = '#/' + v; }, s.vai);
      await p.reload(); await p.waitForTimeout(540);
      if (s.tab != null) { await p.evaluate(i => { const t = document.querySelectorAll('#vista .segmenti button')[i]; if (t) t.click(); }, s.tab); await p.waitForTimeout(400); }
      if (s.poi) { await s.poi(p); await p.waitForTimeout(600); }
      const m = await p.evaluate(MISURA);
      if (!m) continue;
      /* `.focus-scena` centra il suo cuore con margini automatici e appoggia
         la porta in fondo: la distanza fra i due È lo spazio che resta, e
         cambia con l'altezza dello schermo. Non è un numero scelto. */
      m.spazi.filter(x => x.liv <= 1 && x.cont !== 'div.focus-scena').forEach(x => {
        misurati++;
        if (!sullaScala(x.g)) {
          const k = x.g + '|' + x.cont + '|' + x.a + '|' + x.b;
          if (!fuori.has(k)) fuori.set(k, { ...x, dove: new Set() });
          fuori.get(k).dove.add(s.n + '@' + L);
        }
      });
      m.gruppi.forEach(x => {
        const k = x.cont + '|' + x.gruppo;
        if (!gruppiRotti.has(k)) gruppiRotti.set(k, { ...x, dove: new Set() });
        gruppiRotti.get(k).dove.add(s.n + '@' + L);
      });
      if (m.scroll.w > m.scroll.vp + 1) sborda.push(s.n + '@' + L + ': ' + m.scroll.w + '>' + m.scroll.vp);
      if (m.giunti) {
        /* per larghezza, non in assoluto: su desktop la testa respira di più,
           ed è voluto — quello che non deve cambiare è da pagina a pagina */
        if (!giunti.has(L)) giunti.set(L, new Map());
        const g = giunti.get(L);
        const k = m.giunti.testa + (m.giunti.corpo === null ? '' : '/' + m.giunti.corpo);
        if (!g.has(k)) g.set(k, new Set());
        g.get(k).add(s.n);
      }
    }
    await p.close();
  }

  console.log('UNA SCALA SOLA  (' + misurati + ' distanze di primo e secondo livello)');
  ok('ogni distanza sta sulla scala 0/4/8/12/16/24/32/40', fuori.size === 0,
    fuori.size ? [...fuori.values()].sort((a, b) => b.dove.size - a.dove.size).slice(0, 10)
      .map(x => x.g + 'px in ' + x.cont + ' (' + x.a + '→' + x.b + ') ×' + x.dove.size).join(' | ')
      : 'nessuna fuori');

  console.log('\nLA VICINANZA DICE IL VERO');
  ok('nessun gruppo più vicino al vicino che a sé stesso', gruppiRotti.size === 0,
    gruppiRotti.size ? [...gruppiRotti.values()]
      .map(x => x.gruppo + ' in ' + x.cont + ': fra ' + x.fra + 'px, dentro ' + x.dentro + 'px (' + x.quale + ')').join(' | ')
      : 'nessuno');

  console.log('\nI GIUNTI DELLA PAGINA, UGUALI SU TUTTE LE PAGINE');
  /* si controlla il giunto della testa, che è definito allo stesso modo
     ovunque; quello verso il corpo si stampa come informazione, perché su
     alcune pagine il blocco dopo la riga non è il corpo (la scena a margini
     automatici di «Oggi», la barra compatta della «Giornata» su desktop). */
  [...giunti.entries()].forEach(([L, g]) => {
    const teste = new Map();
    [...g.entries()].forEach(([k, v]) => {
      const t = Math.round(+k.split('/')[0]);
      if (!teste.has(t)) teste.set(t, new Set());
      v.forEach(x => teste.get(t).add(x));
    });
    ok(L + 'px: dall’alto del contenuto alla riga delle sezioni, un solo valore', teste.size === 1,
      [...teste.entries()].map(([k, v]) => k + 'px (' + v.size + ' pagine)').join('  ·  '));
    console.log('       riga → corpo: ' + [...g.entries()].map(([k, v]) => (k.split('/')[1] || '—') + 'px×' + v.size).join(' '));
  });

  console.log('\nNIENTE SBORDA IN ORIZZONTALE');
  ok('a nessuna delle ' + LARGHEZZE.length + ' larghezze', sborda.length === 0, sborda.join(' | ') || 'nessuna');

  console.log(fail ? '\n>>> ' + fail + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();
