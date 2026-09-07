/* AUDIT DI DESIGN — su tutte le scene, tutte insieme.

   ATTENZIONE: questa NON è una prova. Non dice sì o no e non fallisce mai:
   stampa un rapporto, e i numeri vanno letti da qualcuno. Le prove qui
   accanto tengono ferme cose già decise; questo serve a decidere.

   Si lancia con: node prove/audit.js   (CHROMIUM=… se serve)

   Non guarda il singolo caso (per quello ci sono già le prove): guarda se il
   SISTEMA è uno solo. Le voci vengono dal playbook «polish» di anti-ui-slop:
   gerarchia poco chiara, comandi principali in concorrenza, tipografia /
   colore / raggi incoerenti, testo che va a capo male, rumore decorativo.
   Spaziature e icone non si rifanno: le tengono già spazi.js e segni.js, e
   contrasto, stati e bordi stanno in colori.js, stati.js e bordi.js.

   UNA COSA IMPARATA SCRIVENDOLO, che vale più di metà del codice qui sotto:
   il primo giro dava «41 raggi diversi, sistema incoerente». Falso. Tutte e
   152 le regole del foglio usano un token (--r-1/2/3/tondo), e la dispersione
   la fa forma.js, che riscrive il raggio al 99% perché l'arco resti dentro al
   ritaglio — più lo schiacciamento che fa il browser sugli elementi piccoli.
   Un numero grosso non è una diagnosi: prima di scrivere «incoerente» si va a
   vedere da dove viene. */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const RADICE = require('./dove').SERVITO, PORTA = 8781;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
/* Il Design lab sta fuori: sono dieci interfacce diverse per scelta, e
   contarle qui vorrebbe dire chiamare «incoerenza» proprio la cosa che quella
   schermata esiste per mostrare. Prima ci stava dentro e faceva il 70% del
   rumore. */
const SCENE = JSON.parse(fs.readFileSync(path.join(RADICE, 'segni/scene.json'), 'utf8'))
  .filter((s) => !/^Design lab/.test(s.nome));

const RILEVA = `(function () {
  var out = { testo: [], raggi: [], ombre: [], colori: [], sfondi: [], primari: [],
              orfane: [], righeLunghe: [], fuori: [] };
  var vis = function (e) {
    var r = e.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    var s = getComputedStyle(e);
    return s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05;
  };
  var nome = function (e) {
    return e.tagName.toLowerCase() + (e.className && e.className.toString
      ? '.' + e.className.toString().trim().split(/\\s+/).slice(0, 2).join('.') : '');
  };
  var soloTesto = function (e) {
    for (var i = 0; i < e.childNodes.length; i++) {
      var n = e.childNodes[i];
      if (n.nodeType === 3 && n.nodeValue.trim().length > 1) return true;
    }
    return false;
  };

  var tutti = document.querySelectorAll('#vista *, .sheet *, .tabbar *, .sidebar *, .pannello-cattura *');
  for (var i = 0; i < tutti.length; i++) {
    var e = tutti[i];
    if (!vis(e)) continue;
    var s = getComputedStyle(e);

    /* --- tipografia: solo dove c'è davvero del testo --- */
    if (soloTesto(e)) {
      var px = Math.round(parseFloat(s.fontSize) * 10) / 10;
      out.testo.push(px + '/' + s.fontWeight);
      out.colori.push(s.color);
      /* righe troppo lunghe: si contano i caratteri per riga, non i pixel */
      /* QUANTI CARATTERI STANNO SU UNA RIGA. Dividere il testo per l'altezza
         del blocco è una stima, e sbagliava: sul diario diceva 84 caratteri
         su un blocco largo 390px, dove ce ne stanno sessantasette. Le righe
         vere le dà un Range — un rettangolo per riga — e da lì il conto è
         una divisione onesta invece che una proporzione sperata. */
      var t = (e.textContent || '').trim();
      if (e.childNodes.length === 1 && e.firstChild.nodeType === 3 && t.length > 40) {
        try {
          var rgL = document.createRange();
          rgL.selectNodeContents(e);
          var rL = [].slice.call(rgL.getClientRects()).filter(function (x) { return x.width > 0; });
          if (rL.length && t.length / rL.length > 78) {
            out.righeLunghe.push(nome(e) + ' ' + Math.round(t.length / rL.length) + ' caratteri su ' +
              rL.length + ' righe, larghe ' + Math.round(rL[0].width) + 'px');
          }
        } catch (er) {}
      }
      /* orfane: l'ultima riga con una parola sola e corta */
      /* ORFANE, MISURATE. Contare le parole non basta: quasi ogni testo di
         più righe finisce con una parola corta, e così si segnalava tutto.
         L'unica domanda vera è se l'ULTIMA RIGA contiene una parola sola, e
         quella si legge dai rettangoli di un Range, non dal testo. */
      if (righe > 1 && e.childNodes.length === 1 && e.firstChild.nodeType === 3 && t.length > 25) {
        try {
          var rg = document.createRange();
          rg.selectNodeContents(e);
          var rects = [].slice.call(rg.getClientRects()).filter(function (x) { return x.width > 0; });
          if (rects.length > 1) {
            var ult = rects[rects.length - 1];
            /* l'ultima riga è meno di un quinto della più larga: è una parola
               rimasta sola, e si vede */
            var largaMax = Math.max.apply(null, rects.map(function (x) { return x.width; }));
            if (ult.width < largaMax * 0.2 && s.textWrap !== 'balance' && s.textWrap !== 'pretty') {
              out.orfane.push(nome(e) + ' «…' + t.split(/\\s+/).pop().slice(0, 14) + '» ultima riga ' +
                Math.round(ult.width) + 'px su ' + Math.round(largaMax));
            }
          }
        } catch (er) {}
      }
    }

    /* --- raggi, ombre, superfici --- */
    var br = s.borderRadius;
    if (br && br !== '0px') out.raggi.push(br);
    if (s.boxShadow && s.boxShadow !== 'none') out.ombre.push(s.boxShadow);
    var bg = s.backgroundColor;
    if (bg && !/rgba\\(0, 0, 0, 0\\)|transparent/.test(bg)) out.sfondi.push(bg);

    /* --- comandi principali visibili insieme --- */
    if (/\\bbtn-primario\\b/.test(e.className || '')) out.primari.push(nome(e) + ' «' + (e.textContent || '').trim().slice(0, 24) + '»');

    /* --- roba che esce dal suo contenitore in orizzontale --- */
    /* Traboccare conta solo se a traboccare è del TESTO. Un <svg> dentro uno
       span di 18px «esce» di undici pixel per come è disegnato il viewBox, e
       non si vede: segnalarlo su tutte le schermate seppelliva le due o tre
       volte in cui a uscire è una parola. */
    if (soloTesto(e) && e.scrollWidth > e.clientWidth + 4 && e.clientWidth > 20 &&
        s.overflowX === 'visible' && !/ellipsis|clip/.test(s.textOverflow)) {
      out.fuori.push(nome(e) + ' «' + (e.textContent || '').trim().slice(0, 30) + '» ' +
        e.scrollWidth + '>' + e.clientWidth);
    }
  }
  return out;
})()`;

(async () => {
  const srv = http.createServer((q, r) => {
    let u = decodeURIComponent(q.url.split('?')[0]); if (u === '/') u = '/index.html';
    fs.readFile(path.join(RADICE, u), (e, d) => {
      if (e) { r.statusCode = 404; r.end('x'); return; }
      r.setHeader('Content-Type', T[path.extname(u)] || 'application/octet-stream'); r.end(d);
    });
  });
  await new Promise((r) => srv.listen(PORTA, r));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

  const conto = { testo: new Map(), raggi: new Map(), ombre: new Map(), colori: new Map(), sfondi: new Map() };
  const trovate = { primari: [], orfane: [], righeLunghe: [], fuori: [] };
  let viste = 0;
  const somma = (m, v, dove) => { if (!m.has(v)) m.set(v, { n: 0, dove: new Set() }); const x = m.get(v); x.n++; if (x.dove.size < 4) x.dove.add(dove); };

  const VIE = [[390, true, 'light'], [390, true, 'dark'], [1280, false, 'light']];
  for (const [largh, mob, tema] of VIE) {
    const ctx = await b.newContext({ viewport: { width: largh, height: 900 }, hasTouch: mob, isMobile: mob, colorScheme: tema });
    for (const { nome, via, tab, poi, prova } of SCENE) {
      const p = await ctx.newPage();
      try {
        await p.goto('http://localhost:' + PORTA + '/index.html'); await p.waitForTimeout(250);
        await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
        await p.evaluate((v) => { location.hash = '#/' + v; }, via);
        await p.reload(); await p.waitForTimeout(via === 'lab' ? 1300 : 650);
        if (tab !== null) {
          await p.evaluate((i) => { const s = document.querySelectorAll('#vista .segmenti button, #vista .sez-nav button'); if (s[i]) s[i].click(); }, tab);
          await p.waitForTimeout(400);
        }
        if (poi) { await p.evaluate(poi); await p.waitForTimeout(700); }
        if (prova && !(await p.evaluate((q) => document.querySelectorAll(q).length, prova))) throw new Error('scena non arrivata');
        const r = await p.evaluate(RILEVA);
        viste++;
        const dove = nome + ' [' + largh + '/' + tema + ']';
        r.testo.forEach((v) => somma(conto.testo, v, dove));
        r.raggi.forEach((v) => somma(conto.raggi, v, dove));
        r.ombre.forEach((v) => somma(conto.ombre, v, dove));
        r.colori.forEach((v) => somma(conto.colori, v, dove));
        r.sfondi.forEach((v) => somma(conto.sfondi, v, dove));
        if (r.primari.length > 1) trovate.primari.push(dove + ': ' + r.primari.join(' + '));
        r.orfane.forEach((x) => trovate.orfane.push(dove + ' · ' + x));
        r.righeLunghe.forEach((x) => trovate.righeLunghe.push(dove + ' · ' + x));
        r.fuori.forEach((x) => trovate.fuori.push(dove + ' · ' + x));
      } catch (e) {
        console.log('  (saltata: ' + nome + ' — ' + e.message.slice(0, 60) + ')');
      }
      await p.close();
    }
    await ctx.close();
  }
  await b.close(); srv.close();

  const mostra = (titolo, m, quanti) => {
    const v = [...m.entries()].sort((a, c) => c[1].n - a[1].n);
    console.log('\n' + titolo + ' — ' + v.length + ' valori diversi');
    v.slice(0, quanti).forEach(([k, x]) => console.log('    ' + String(x.n).padStart(6) + '×  ' + k));
    if (v.length > quanti) {
      console.log('    --- la coda, quelli usati meno di dieci volte:');
      v.filter(([, x]) => x.n < 10).slice(0, 14).forEach(([k, x]) =>
        console.log('    ' + String(x.n).padStart(6) + '×  ' + k + '   ' + [...x.dove][0]));
    }
  };
  console.log('\n════ ' + viste + ' scene guardate (' + SCENE.length + ' × ' + VIE.length + ' condizioni) ════');
  mostra('TIPOGRAFIA  (corpo/peso)', conto.testo, 12);
  mostra('RAGGI', conto.raggi, 10);
  mostra('OMBRE', conto.ombre, 6);
  mostra('COLORI DEL TESTO', conto.colori, 10);
  mostra('SUPERFICI', conto.sfondi, 10);

  const elenca = (titolo, arr) => {
    const u = [...new Set(arr)];
    console.log('\n' + titolo + ' — ' + u.length);
    u.slice(0, 12).forEach((x) => console.log('    ' + x));
    if (u.length > 12) console.log('    …e altri ' + (u.length - 12));
  };
  elenca('PIÙ DI UN COMANDO PRINCIPALE INSIEME', trovate.primari);
  elenca('RIGHE TROPPO LUNGHE (oltre 78 caratteri)', trovate.righeLunghe);
  elenca('ULTIMA RIGA CON UNA PAROLA SOLA', trovate.orfane);
  elenca('CONTENUTO CHE ESCE DAL SUO CONTENITORE', trovate.fuori);
})();
