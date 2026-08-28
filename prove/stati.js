/* QUANDO CI PASSI SOPRA, QUANDO LO SCEGLI, QUANDO CI ARRIVI COL TAB.
   Le altre prove guardano l'app a riposo. Questa la guarda mentre reagisce,
   perché è là che si è rotta senza che nessuno la vedesse rompersi.

   COSA È ANDATO STORTO. La forma dei supercerchi la fa un `clip-path`, e un
   `clip-path` taglia TUTTO il disegno dell'elemento — anche quello che sta
   FUORI dal riquadro del bordo. Fuori, però, un elemento disegna due cose che
   contano solo quando reagisce:

     · `box-shadow`, l'ombra. L'app ne dichiara tre livelli e li usa in
       centoventi punti: la scheda staccata dal fondo, il pulsante che si alza
       sotto il puntatore, la pastiglia accesa dentro un segmento. Col ritaglio
       pieno non se ne vedeva NESSUNA. Su «Chiaro · Auto · Scuro» quell'ombra
       era l'unico segno di quale fosse la scelta in vigore.
     · `outline`, il contorno di messa a fuoco. Chi va a tastiera vedeva
       spostarsi il fuoco senza nessun segno di dove fosse arrivato.

   Nessuna delle prove esistenti poteva accorgersene: prove/bordi.js controlla
   che il BORDO ci sia, e il bordo c'era. Il contorno e l'ombra sono un'altra
   cosa, e si vedono solo se qualcuno tiene premuto il mouse.

   LE TRE COSE CHE CERCA, in ogni schermata, a ogni larghezza, nei due temi e
   in quattro stati (a riposo, sopra col mouse, a fuoco da tastiera, premuto):
   1. contorno di messa a fuoco tagliato dal ritaglio
   2. ombra tagliata dal ritaglio
   3. evidenziazione rettangolare dentro un contenitore tondo
   e in più, come le altre prove, che ogni scena sia arrivata dove doveva.

   node prove/stati.js        (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const PORTA = 8829;
let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

const SCENE = JSON.parse(fs.readFileSync(path.join(RADICE, 'segni/scene.json'), 'utf8'));

/* IL CONTROLLO, dentro la pagina. Gli stati si accendono con
   `CSS.forcePseudoState` del protocollo di Chrome: `:hover` non si può
   simulare da JavaScript, e muovere il mouse su duemila elementi uno per volta
   costerebbe mezz'ora per schermata. */
const CONTROLLA = `(function (stato) {
  var nome = function (e) { return e.tagName.toLowerCase() +
    (e.className && e.className.toString ? '.' + e.className.toString().trim().split(/\\s+/).slice(0, 3).join('.') : ''); };
  /* «vuoto» vuol dire anche ALFA ZERO, in qualunque notazione. Un fondo che
     viene da un color-mix esce come oklab(0 0 0 / 0): trasparente, ma non
     una delle due scritture che si cercavano — e trentasei righe di elenco si
     sono presentate come evidenziazioni quadrate quando non erano nemmeno
     dipinte. */
  var vuoto = function (c) {
    if (!c || c === 'transparent' || c === 'none') return true;
    return /\\/\\s*0(\\.0+)?\\s*\\)/.test(c) || /,\\s*0(\\.0+)?\\s*\\)/.test(c);
  };
  /* un ritaglio che ARRIVA FUORI dal riquadro: è quello a quattro morsi, e
     lascia vivere l'ombra e il contorno. Un ritaglio che sta tutto dentro se
     li mangia. */
  var arrivaFuori = function (c) { return /-\\d\\d+(\\.\\d+)?px/.test(c); };
  var out = { contorni: [], ombre: [], rettangoli: [], visti: 0 };
  document.querySelectorAll('body *').forEach(function (e) {
    var s = getComputedStyle(e), r = e.getBoundingClientRect();
    if (r.width < 6 || r.height < 6 || s.visibility === 'hidden' || s.display === 'none' || s.opacity === '0') return;
    if (!e.matches('a,button,[role="button"],[role="switch"],summary,label,.lista-riga,.q-chip,.card-hover')) return;
    out.visti++;
    var clip = (s.clipPath && s.clipPath !== 'none') ? s.clipPath : null;
    var campo = /^(input|select|textarea|progress|meter)$/.test(e.tagName.toLowerCase());
    if (campo) return;

    /* 1. il contorno di messa a fuoco */
    var ow = parseFloat(s.outlineWidth) || 0;
    var contorno = ow > 0 && s.outlineStyle !== 'none' && !vuoto(s.outlineColor);
    if (contorno && clip && !arrivaFuori(clip))
      out.contorni.push(nome(e) + ' ' + ow + 'px, ritaglio che sta dentro il riquadro');

    /* 2. l'ombra. Solo quelle in FUORI: una \`inset\` sta dentro e nessuno la
          taglia. */
    var omb = (s.boxShadow || '').trim();
    var fuori = omb && omb !== 'none' && omb.split(/,(?![^(]*\\))/).some(function (x) { return !/inset/.test(x); });
    if (fuori && clip && !arrivaFuori(clip))
      out.ombre.push(nome(e) + ' ' + omb.slice(0, 40) + ', ritaglio che sta dentro il riquadro');

    /* 3. l'evidenziazione rettangolare dentro un contenitore tondo: un fondo
          acceso su un elemento a spigoli vivi, dentro un padre che invece è
          tondo. Sui bordi del padre il fondo esce quadrato. */
    var raggi = ['borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius']
      .map(function (k) { return parseFloat(s[k]) || 0; });
    var tondo = Math.max.apply(null, raggi) >= 1 || !!clip;
    if (stato !== 'riposo' && !vuoto(s.backgroundColor) && !tondo) {
      /* Il padre conta solo se è TONDO E NON TAGLIA. Un padre col ritaglio
         smussa da sé gli angoli di quello che ha dentro: la riga in cima a un
         elenco può avere il fondo quadrato quanto vuole, sull'angolo lo taglia
         il contenitore. Cercando anche i padri che tagliano venivano fuori
         quindici righe che a schermo sono giuste. Il caso vero è l'altro: un
         padre con l'angolo tondo che lascia passare tutto, e allora il fondo
         acceso della prima riga esce dallo spigolo. */
      var p = e.parentElement, pt = null;
      for (var i = 0; i < 2 && p; i++, p = p.parentElement) {
        var q = getComputedStyle(p);
        var pr = ['borderTopLeftRadius','borderBottomLeftRadius'].map(function (k) { return parseFloat(q[k]) || 0; });
        var taglia = (q.clipPath && q.clipPath !== 'none') || !/^visible/.test(q.overflow);
        if (Math.max.apply(null, pr) >= 6 && !taglia) { pt = p; break; }
      }
      /* conta solo se l'elemento TOCCA il bordo del padre: in mezzo alla lista
         un rettangolo è giusto che sia un rettangolo */
      if (pt) {
        var pq = pt.getBoundingClientRect();
        if (Math.abs(r.top - pq.top) < 3 || Math.abs(r.bottom - pq.bottom) < 3)
          out.rettangoli.push(nome(e) + ' fondo ' + s.backgroundColor + ' a spigoli, dentro ' + nome(pt));
      }
    }
    return;
  });
  return out;
})`;

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

  const tot = { contorni: new Map(), ombre: new Map(), rettangoli: new Map() };
  const rotte = new Map();
  let visti = 0, schermate = 0;
  const STATI = [['riposo', []], ['sopra', ['hover']], ['a fuoco', ['focus', 'focus-visible']], ['premuto', ['hover', 'active']]];
  const VIE = [[390, true, 'light'], [1280, false, 'dark']];
  for (const [largh, mob, tema] of VIE) {
    const ctx = await b.newContext({ viewport: { width: largh, height: 900 }, hasTouch: mob, isMobile: mob, colorScheme: tema });
    for (const { nome, via, tab, poi, prova } of SCENE) {
      const p = await ctx.newPage();
      try {
        const cdp = await ctx.newCDPSession(p);
        await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
        await p.goto('http://localhost:' + PORTA + '/index.html'); await p.waitForTimeout(300);
        await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
        await p.evaluate((v) => { location.hash = '#/' + v; }, via);
        await p.reload(); await p.waitForTimeout(via === 'lab' ? 1400 : 700);
        if (tab !== null) {
          await p.evaluate((i) => { const s = document.querySelectorAll('#vista .segmenti button, #vista .sez-nav button'); if (s[i]) s[i].click(); }, tab);
          await p.waitForTimeout(450);
        }
        if (poi) { await p.evaluate(poi); await p.waitForTimeout(800); }
        if (prova) {
          const c = await p.evaluate((q) => document.querySelectorAll(q).length, prova);
          if (!c) throw new Error('la scena non è arrivata: manca «' + prova + '»');
        }
        /* GLI STATI SI ACCENDONO SU TUTTI GLI ELEMENTI IN UNA VOLTA. Il
           protocollo vuole un nodo per chiamata, quindi si prendono gli id dei
           nodi interessanti e si accende lo stato su tutti; poi si misura. */
        const { root } = await cdp.send('DOM.getDocument', { depth: -1, pierce: false });
        const { nodeIds } = await cdp.send('DOM.querySelectorAll', {
          nodeId: root.nodeId,
          selector: 'a,button,[role="button"],[role="switch"],summary,label,.lista-riga,.q-chip,.card-hover'
        });
        for (const [eti, classi] of STATI) {
          if (classi.length) {
            for (const nodeId of nodeIds) {
              try { await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: classi }); } catch (e) { /* nodo andato via */ }
            }
          }
          /* la stringa si CHIAMA con l'argomento: `evaluate` con un testo lo
             valuta come espressione e non lo invoca, quindi passargli una
             funzione e un parametro a fianco restituiva la funzione stessa —
             e la prova, senza un solo elemento guardato, passava. */
          const r = await p.evaluate(CONTROLLA + '(' + JSON.stringify(eti) + ')');
          visti += r.visti; schermate++;
          const dove = largh + 'px/' + tema + ' · ' + nome + ' · ' + eti;
          Object.keys(tot).forEach((k) => (r[k] || []).forEach((x) => { if (!tot[k].has(x)) tot[k].set(x, dove); }));
          if (classi.length) {
            for (const nodeId of nodeIds) {
              try { await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] }); } catch (e) { /* idem */ }
            }
          }
        }
      } catch (e) {
        rotte.set(nome + ' a ' + largh + 'px', String(e).split('\n')[0].replace(/^Error: /, '').slice(0, 80));
      } finally { await p.close(); }
    }
    await ctx.close();
    console.log('  ' + largh + 'px ' + tema + ': fatto');
  }
  console.log('\n' + schermate + ' schermate × stato, ' + visti + ' elementi guardati\n');

  const mostra = (t, m) => {
    ok(t, m.size === 0, m.size ? m.size + ' casi:' : 'nessuno');
    [...m.entries()].forEach(([k, v]) => console.log('        ' + k + '   [' + v + ']'));
  };
  mostra('nessun contorno di messa a fuoco viene tagliato', tot.contorni);
  mostra('nessuna ombra viene tagliata', tot.ombre);
  mostra('nessuna evidenziazione quadrata in un contenitore tondo', tot.rettangoli);
  mostra('nessuna scena ha sbagliato strada', rotte);
  /* LA RETE SULLA RETE. Con `evaluate` chiamato male la funzione di controllo
     non veniva invocata: zero elementi guardati e tre controlli verdi. Una
     prova che non guarda niente non dice niente, e deve dirlo. */
  ok('e qualcosa ha davvero guardato', visti > 500, visti + ' elementi');

  console.log(guai ? '\n>>> ' + guai + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(guai ? 1 : 0);
})();
