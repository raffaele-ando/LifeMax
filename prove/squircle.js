/* SONO SUPERCERCHI DAVVERO? E sono QUELLI DI APPLE?
   Tre forme diverse si chiamano tutte «squircle» e la differenza conta.

   - Il rettangolo arrotondato: l'angolo è un arco di CERCHIO. La curvatura è
     costante (1/R) lungo l'arco e vale zero sul lato dritto: nel punto in cui
     si attaccano SALTA, e l'occhio quello scalino lo vede.
   - La superellisse (curva di Lamé, |x|ⁿ+|y|ⁿ=1 con n≈4): la curvatura cambia
     in continuo. È quello che fa `corner-shape: squircle`.
   - L'angolo CONTINUO DI APPLE: tre Bézier per angolo, tarate a mano. Non è
     una superellisse — la migliore (n = 5.2) sbaglia di 1365 pixel dove le
     Bézier ne sbagliano zero. È questo che l'app usa.

   Questa prova non guarda il CSS: guarda i PIXEL. Disegna, fotografa, trova
   dove passa il bordo, e confronta con le costanti di segni/apple.mjs.

   node prove/squircle.js        (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const PORTA = 8772;
let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };
const DPR = 6;

/* il contorno di una forma dipinta scura su chiaro, riga per riga, nell'angolo
   in alto a sinistra. Dentro il browser perché il canvas legge già le PNG. */
const CONTORNO = `(function (b64, R, dritto) {
  return (async function () {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    const dentro = function (i, j) { var k = (j * c.width + i) * 4; return (d[k] + d[k+1] + d[k+2]) / 3 < 128; };
    var p = [];
    for (var y = 0; y < R; y++) {
      var xx = null;
      for (var i = 0; i < Math.min(R, c.width); i++) if (dentro(i, y)) { xx = i; break; }
      p.push(xx);
    }
    /* e quanto è dritto il lato, lontano dagli angoli. «Lontano» vuol dire
       dopo la LUNGHEZZA DELL'ANGOLO, non dopo il raggio: quello di Apple è
       lungo 1.53 raggi, e misurare da un raggio in poi vuol dire misurare
       ancora la curva. */
    var xs = [];
    for (var y2 = (dritto || R) + 4; y2 < c.height - (dritto || R) - 4; y2 += 2) {
      for (var i2 = 0; i2 < c.width; i2++) if (dentro(i2, y2)) { xs.push(i2); break; }
    }
    return { p: p, scarto: xs.length ? Math.max.apply(null, xs) - Math.min.apply(null, xs) : 0,
      w: c.width, h: c.height };
  })();
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
  const A = await import('../segni/apple.mjs');

  const p1 = await b.newPage({ viewport: { width: 420, height: 560 }, deviceScaleFactor: DPR });
  /* si fotografa a sei volte la risoluzione: a un pixel per pixel CSS un
     angolo da 8px sono otto pixel, e il riferimento stesso usciva 5.19 dove
     doveva uscire 4.03 */
  /* Il riquadro di prova deve contenere l'angolo, se no scatta il limite
     proporzionale e si finisce per misurare una forma rimpicciolita: con un
     raggio da 120 in un box da 280 l'angolo (183px) non ci sta, e la curva di
     Apple usciva come una superellisse con n = 2.8. */
  const largo = (R) => Math.ceil(2 * A.INIZIO * R) + 40;
  const misura = async (css, R, w, h, quanto) => {
    await p1.setContent('<body style="margin:10px;background:#fff">' +
      '<div id="q" style="width:' + (w || largo(R)) + 'px;height:' + (h || largo(R)) + 'px;' +
      css + '"></div></body>');
    await p1.waitForTimeout(50);
    const png = await p1.locator('#q').screenshot();
    /* «quanto» è quante righe leggere e da dove il lato deve essere dritto:
       per l'angolo di Apple è 1.53 raggi, non uno */
    const righe = Math.round((quanto || R) * DPR);
    const m = await p1.evaluate(CONTORNO + '(' + JSON.stringify(png.toString('base64')) +
      ',' + righe + ',' + righe + ')');
    m.scarto = m.scarto / DPR;
    return m;
  };

  /* ============ 1. le tre forme sono diverse, e si misura ============ */
  console.log('TRE FORME DIVERSE, NON UNA');
  /* La misura che le separa senza ambiguità è l'AREA che l'angolo TOGLIE al
     quadrato, in unità di r². Non dipende da come si campiona, non è sensibile
     al mezzo pixel, e i tre numeri sono lontanissimi fra loro:
       arco di cerchio   1 - π/4 = 0.2146
       superellisse n=4            0.0730   (il 66% IN MENO: ecco perché a
                                             parità di raggio sembrava tutto
                                             più spigoloso)
       angolo di Apple             0.2253   (l'1.05 dell'arco: si legge
                                             arrotondato come prima) */
  const AREA = `(function (b64, W) {
    return (async function () {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, W, W).data;
      var fuori = 0;
      for (var j = 0; j < W; j++) for (var i = 0; i < W; i++) {
        var k = (j * W + i) * 4;
        if ((d[k] + d[k+1] + d[k+2]) / 3 >= 128) fuori++;
      }
      return fuori;
    })();
  })`;
  const areaTolta = async (css, R) => {
    const lato = largo(R);
    await p1.setContent('<body style="margin:10px;background:#fff">' +
      '<div id="q" style="width:' + lato + 'px;height:' + lato + 'px;' + css + '"></div></body>');
    await p1.waitForTimeout(50);
    const png = await p1.locator('#q').screenshot();
    /* la finestra prende tutto l'angolo e nient'altro: 1.7 raggi basta per
       Apple (che ne usa 1.53) e non arriva agli altri angoli */
    const W = Math.round(1.7 * R * DPR);
    const fuori = await p1.evaluate(AREA + '(' + JSON.stringify(png.toString('base64')) + ',' + W + ')');
    return fuori / Math.pow(R * DPR, 2);
  };
  const R1 = 100;
  const aArco = await areaTolta('background:#000;border-top-left-radius:' + R1 + 'px', R1);
  const aLame = await areaTolta('background:#000;border-top-left-radius:' + R1 + 'px;corner-shape:squircle', R1);
  const aMela = await areaTolta('background:#000;border-radius:0;clip-path:' +
    A.poligono([R1, 0, 0, 0], 0.05) + ';', R1);
  ok('l’arco di cerchio toglie 1 - π/4 = 0.2146 · r²', Math.abs(aArco - 0.2146) < 0.012,
    'misurato ' + aArco.toFixed(4));
  ok('la superellisse ne toglie il 66% in meno: 0.073', Math.abs(aLame - 0.073) < 0.012,
    'misurato ' + aLame.toFixed(4) + ' — è per questo che a parità di raggio sembra più spigolosa');
  ok('l’angolo di Apple ne toglie 0.2253, cioè 1.05 volte l’arco',
    Math.abs(aMela - 0.2253) < 0.012, 'misurato ' + aMela.toFixed(4) +
    ' (l’angolo si mangia 1.53 raggi di lato ma resta arrotondato come prima)');
  {
    const mela = await misura('background:#000;border-radius:0;clip-path:' +
      A.poligono([R1, R1, R1, R1], 0.05) + ';', R1, 0, 0, R1 * A.INIZIO);
    ok('e i lati sono dritti dopo l’angolo', mela.scarto <= 0.5,
      'scostamento ' + mela.scarto.toFixed(2) + 'px');
  }

  /* ============ 2. la curvatura: la cosa che si vede ============ */
  console.log('\nLA CURVATURA, CHE È QUELLO CHE L’OCCHIO VEDE');
  /* Il cerchio ha raggio di curvatura COSTANTE lungo tutto l'arco, e nel punto
     d'attacco col lato salta a zero: quello scalino è il difetto. La curva di
     Apple invece la fa variare, e verso il lato si appiattisce fino a
     sparire — così l'attacco non si vede perché non c'è niente da vedere.
     Ogni forma si campiona sul PROPRIO angolo: l'arco è lungo un raggio,
     quello di Apple 1.53. */
  const raggioIn = (p, y, mezza) => {
    const pt = [];
    for (let j = y - mezza; j <= y + mezza; j++) {
      if (j < 0 || j >= p.length || p[j] === null) continue;
      pt.push([p[j], j]);
    }
    if (pt.length < 8) return null;
    let s = [0, 0, 0, 0, 0, 0, 0, 0, 0], t = [0, 0, 0];
    for (const [x, yy] of pt) {
      const r2 = x * x + yy * yy;
      s[0] += x * x; s[1] += x * yy; s[2] += x;
      s[3] += x * yy; s[4] += yy * yy; s[5] += yy;
      s[6] += x; s[7] += yy; s[8] += 1;
      t[0] -= r2 * x; t[1] -= r2 * yy; t[2] -= r2;
    }
    const det = s[0] * (s[4] * s[8] - s[5] * s[7]) - s[1] * (s[3] * s[8] - s[5] * s[6]) + s[2] * (s[3] * s[7] - s[4] * s[6]);
    if (Math.abs(det) < 1e-9) return Infinity;
    const A2 = (t[0] * (s[4] * s[8] - s[5] * s[7]) - s[1] * (t[1] * s[8] - s[5] * t[2]) + s[2] * (t[1] * s[7] - s[4] * t[2])) / det;
    const B2 = (s[0] * (t[1] * s[8] - s[5] * t[2]) - t[0] * (s[3] * s[8] - s[5] * s[6]) + s[2] * (s[3] * t[2] - t[1] * s[6])) / det;
    const C2 = (s[0] * (s[4] * t[2] - t[1] * s[7]) - s[1] * (s[3] * t[2] - t[1] * s[6]) + t[0] * (s[3] * s[7] - s[4] * s[6])) / det;
    const rr = A2 * A2 / 4 + B2 * B2 / 4 - C2;
    return rr > 0 ? Math.sqrt(rr) : Infinity;
  };
  {
    const R2 = 120, Rp2 = R2 * DPR;
    const arco = await misura('background:#000;border-top-left-radius:' + R2 + 'px', R2);
    const mela = await misura('background:#000;border-radius:0;clip-path:' +
      A.poligono([R2, R2, R2, R2], 0.05) + ';', R2, 0, 0, R2 * A.INIZIO);
    const dove = [0.15, 0.3, 0.45, 0.6, 0.75, 0.88];
    const serie = (m, lung) => dove.map((f) => {
      const r = raggioIn(m.p, Math.round(lung * f), Math.round(lung * 0.07));
      return r === null ? null : r / Rp2;
    });
    const sA = serie(arco, Rp2), sM = serie(mela, Rp2 * A.INIZIO);
    const scrivi = (s2) => s2.map((v) => v === null ? '  —' : (v > 99 ? '>99' : v.toFixed(2))).join('  ');
    console.log('           ' + dove.map((f) => (f * 100).toFixed(0) + '%').join('   ') + '   del proprio angolo');
    console.log('  cerchio  ' + scrivi(sA));
    console.log('  Apple    ' + scrivi(sM));
    const buoni = (s2) => s2.filter((v) => v !== null && isFinite(v));
    const gA = buoni(sA), gM = buoni(sM);
    ok('il cerchio tiene la curvatura COSTANTE', gA.length >= 5 &&
      Math.max.apply(null, gA) / Math.min.apply(null, gA) < 1.35,
      'raggio di curvatura da ' + gA[0].toFixed(2) + '·R a ' + gA[gA.length - 1].toFixed(2) + '·R');
    ok('Apple la cambia lungo tutto l’angolo', gM.length >= 4 &&
      Math.max.apply(null, gM) / Math.min.apply(null, gM) > 2,
      'da ' + Math.min.apply(null, gM).toFixed(2) + '·R a ' +
      (Math.max.apply(null, gM) > 99 ? '>99' : Math.max.apply(null, gM).toFixed(2)) + '·R: ' +
      (Math.max.apply(null, gM) / Math.min.apply(null, gM)).toFixed(1) + ' volte');
    ok('e verso il lato si appiattisce, così l’attacco non si vede',
      gM.length >= 4 && gM[gM.length - 1] > gM[0] * 1.8,
      'in fondo all’angolo il raggio di curvatura è ' +
      (gM[gM.length - 1] > 99 ? 'oltre 99' : gM[gM.length - 1].toFixed(2)) + '·R');
  }

  /* ============ 3. il tracciato che forma.js emette è CSS valido ==========
     Qui prima c'erano quattro sezioni — «il poligono sta sulle Bézier», «ogni
     tracciato generato è CSS valido», «l'app: ogni angolo e l'anello del
     bordo», «col mouse sopra il bordo non raddoppia» — e tutte e quattro
     leggevano il blocco generato in fondo ad app.css, le variabili `--sq-N-p`
     e l'anello sullo pseudo-elemento. Non esiste più niente di tutto questo:
     il tracciato lo calcola forma.js in pagina, in pixel, e il bordo è
     un'immagine di sfondo dello stesso elemento. Quello che facevano quelle
     sezioni sull'app intera adesso lo fa prove/bordi.js, su cinquantadue
     schermate e cinque viste, e lo fa meglio.
     Resta da provare una cosa sola, ed è quella che è costata più cara: che
     il valore che finisce nella pagina il browser lo ACCETTI. Un `calc(100% -
     0)` — non valido, perché da una percentuale non si può sottrarre uno zero
     senza unità — faceva buttare al browser l'intera dichiarazione, e
     l'elemento restava un rettangolo a spigoli. Adesso nel tracciato non ci
     sono né percentuali né funzioni: solo numeri. Ma «solo numeri» va
     verificato, non dato per buono, e va verificato sulle misure storte —
     quelle dove i conti danno decimali lunghi o zeri. */
  console.log('\nIL TRACCIATO CHE forma.js EMETTE È CSS VALIDO, A OGNI MISURA');
  {
    await p1.goto('http://localhost:' + PORTA + '/index.html');
    await p1.waitForTimeout(400);
    const esito = await p1.evaluate(() => {
      const casi = [];
      /* misure e raggi scelti per essere scomodi: numeri primi, mezzi pixel,
         raggi più grandi di quanto ci sta, raggi a zero su qualche angolo */
      const MIS = [[7, 7], [13, 41], [41, 13], [100, 100], [333, 47], [1, 200], [200.5, 60.5], [17, 17]];
      const RAG = ['0', '1px', '6px', '18px', '999px', '12px 0 3px 40px', '50%'];
      const host = document.createElement('div');
      host.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(host);
      for (const [w, h] of MIS) for (const r of RAG) {
        const e = document.createElement('div');
        e.style.cssText = 'width:' + w + 'px;height:' + h + 'px;border:1px solid #888;border-radius:' + r;
        host.appendChild(e);
        casi.push({ e: e, w: w, h: h, r: r });
      }
      return new Promise((ris) => setTimeout(() => {
        const rotti = [], senza = [], numeri = [];
        for (const c of casi) {
          const s = getComputedStyle(c.e);
          const clip = s.clipPath || '';
          if (clip === 'none' || !/^path\(/.test(clip)) {
            /* legittimo solo se non c'è angolo da fare, o se è un tondo vero */
            const rr = parseFloat(s.borderTopLeftRadius) || 0;
            const tondo = rr >= Math.min(c.w, c.h) / 2 - 0.51 && Math.abs(c.w - c.h) <= 2;
            if (c.r !== '0' && !tondo && c.w > 2 && c.h > 2) senza.push(c.w + 'x' + c.h + ' r=' + c.r);
            continue;
          }
          if (!CSS.supports('clip-path', clip)) rotti.push(c.w + 'x' + c.h + ' r=' + c.r);
          /* niente percentuali, niente funzioni: se ricompaiono, ricompare
             anche la specie di guasto che ci era costata l'iPad */
          if (/%|calc\(|min\(|max\(|var\(|NaN|Infinity/.test(clip)) numeri.push(c.w + 'x' + c.h + ' r=' + c.r);
          /* e il filo, se c'è, dev'essere un'immagine che il browser prende */
          const bg = s.backgroundImage || '';
          if (bg.indexOf('svg') > 0 && !CSS.supports('background-image', bg.split(/,(?![^(]*\))/)[0]))
            rotti.push('FILO ' + c.w + 'x' + c.h + ' r=' + c.r);
        }
        host.remove();
        ris({ quanti: casi.length, rotti: rotti, senza: senza, numeri: numeri });
      }, 350));
    });
    ok('i tracciati provati sono ' + esito.quanti + ', e il browser li accetta tutti',
      esito.rotti.length === 0, esito.rotti.length ? 'RIFIUTATI: ' + esito.rotti.slice(0, 4).join(' | ') : 'nessuno rifiutato');
    ok('e nessuna misura resta senza forma', esito.senza.length === 0,
      esito.senza.length ? 'senza: ' + esito.senza.slice(0, 4).join(' | ') : 'tutte ritagliate');
    ok('e dentro non c’è niente da calcolare: solo numeri', esito.numeri.length === 0,
      esito.numeri.length ? 'con funzioni: ' + esito.numeri.slice(0, 3).join(' | ') : 'nessuna percentuale, nessun calc(), nessun min()');
    /* e la controprova: la prova sa vedere un tracciato rotto */
    const finto = await p1.evaluate(() => CSS.supports('clip-path', 'polygon(0 0, calc(100% - 0) 0, 100% 100%)'));
    ok('la prova sa riconoscere un tracciato rotto', finto === false,
      'calc(100% - 0) viene rifiutato, come deve');
  }

  /* ============ 7. le proporzioni: l'angolo non si stira ============ */
  console.log('\nSU UN ELEMENTO LARGO, SU UNO ALTO, SU UNO QUADRATO');
  /* Il difetto di chi la forma la fa con una maschera SVG stirata: l'angolo
     diventa un'ellisse. Il nostro tracciato ha i pixel dentro. */
  {
    const R = 24, cl = 'border-radius:0;clip-path:' + A.poligono([R, R, R, R], 0.2) + ';';
    const MIS = `(function (b64, R) {
      return (async function () {
        const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height).data;
        var dentro = function (i, j) { var k = (j * c.width + i) * 4; return (d[k]+d[k+1]+d[k+2])/3 < 128; };
        var alto = 0, largo = 0;
        for (var j = 0; j < c.height; j++) if (dentro(0, j)) { alto = j; break; }
        for (var i = 0; i < c.width; i++) if (dentro(i, 0)) { largo = i; break; }
        return { alto: alto, largo: largo };
      })();
    })`;
    const prova = async (w, h) => {
      await p1.setContent('<body style="margin:10px;background:#fff">' +
        '<div id="q" style="width:' + w + 'px;height:' + h + 'px;background:#000;' + cl + '"></div></body>');
      await p1.waitForTimeout(50);
      const png = await p1.locator('#q').screenshot();
      return p1.evaluate(MIS + '(' + JSON.stringify(png.toString('base64')) + ',' + (R * DPR) + ')');
    };
    const largo = await prova(300, 90), alto = await prova(90, 300), quadro = await prova(160, 160);
    const px = (v) => (v / DPR).toFixed(1);
    const tutte = [largo, alto, quadro].flatMap((m) => [m.alto, m.largo]);
    const spread = (Math.max.apply(null, tutte) - Math.min.apply(null, tutte)) / DPR;
    ok('l’angolo misura lo stesso su tutte le proporzioni', spread < 0.6,
      '300×90 → ' + px(largo.largo) + '×' + px(largo.alto) + ' · 90×300 → ' +
      px(alto.largo) + '×' + px(alto.alto) + ' · 160×160 → ' + px(quadro.largo) + '×' +
      px(quadro.alto) + ' (scarto ' + spread.toFixed(2) + 'px)');
    /* e sotto la misura minima il limite proporzionale evita la strozzatura */
    const stretto = await misura('background:#000;' + cl, R, 300, 30, R * A.INIZIO);
    ok('su un elemento più corto di tre raggi la forma non si strozza',
      stretto.scarto <= 1, 'scostamento del lato ' + stretto.scarto.toFixed(2) + 'px');
  }

  /* ============ 8. la forma la fa forma.js, e la fa davvero ============ */
  console.log('\nLA FORMA LA FA assets/forma.js, A RUNTIME');
  /* Fino a ieri qui si rigenerava il blocco di CSS e lo si confrontava con
     quello sul disco. Quel blocco non esiste più: la forma la disegna
     `assets/forma.js` in pixel, sulla misura vera di ogni elemento, quindi
     non c'è niente da rigenerare e niente da confrontare. Le cose da
     pretendere sono altre tre, e la terza è quella che conta. */
  {
    const css = fs.readFileSync(path.join(RADICE, 'assets/app.css'), 'utf8');
    ok('il blocco generato è sparito dal foglio di stile',
      css.indexOf('==== SUPERCERCHI') < 0, 'trecentoquattordici kilobyte in meno');
    /* nessuna regola scritta a mano deve dare una forma col ritaglio: se ce
       n'è una, quell'elemento ha DUE forme, la sua e quella di forma.js, e
       vince la più piccola. `inset(50%)` non è una forma: è il modo di
       nascondere il testo che leggono i lettori di schermo. */
    /* `var(--filo-...)` non è una forma scritta a mano: è il buco in cui
       forma.js infila la sua, ed è così che si disegna l'anello del bordo.
       Quello da vietare è il ritaglio con dentro dei numeri. */
    const fuori = [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/clip-path\s*:\s*([^;}]+)/g)]
      .map((m) => m[1].trim())
      .filter((v) => v !== 'inset(50%)' && v !== 'none' && !/^var\(--filo-/.test(v));
    ok('e nessuna regola scritta a mano dà una forma col ritaglio', fuori.length === 0,
      fuori.slice(0, 3).join(' | ') || 'solo il testo per i lettori di schermo');

    /* l'ordine si legge sul sorgente scritto a mano: index.html lo genera
       il build, che i sette script se li mangia tutti in un pacco solo —
       nello stesso ordine in cui stanno qui. */
    const sorgHtml = path.join(RADICE, 'index.sorgente.html');
    const html = fs.readFileSync(fs.existsSync(sorgHtml) ? sorgHtml : path.join(RADICE, 'index.html'), 'utf8');
    const iForma = html.indexOf('assets/forma.js');
    const iApp = html.indexOf('assets/app.js');
    ok('forma.js è caricato, e prima di app.js', iForma > 0 && iForma < iApp,
      'se arrivasse dopo, il primo disegno della pagina avrebbe gli angoli tondi normali');

    /* le costanti non possono divergere da segni/apple.mjs: sono la stessa
       curva scritta due volte, una per il browser e una per gli strumenti */
    const js = fs.readFileSync(path.join(RADICE, 'assets/forma.js'), 'utf8');
    ok('e le costanti dell’angolo sono quelle di segni/apple.mjs',
      js.indexOf(String(A.INIZIO)) > 0 && js.indexOf('1.08849296') > 0 && js.indexOf('0.07491139') > 0,
      'INIZIO = ' + A.INIZIO);
  }

  /* ============ 8b. e la curva che esce è quella, misurata sui pixel ====
     Questa è la prova che l'utente ha chiesto guardando una fotografia
     ingrandita: «non sono veri squircle di Apple». Aveva ragione, e non si
     poteva rispondere se non misurando. Allora lo scarto era 5.123 px su un
     raggio di 40 — cioè esattamente il `border-radius` normale, perché il
     morso dell'angolo in alto a sinistra girava nello stesso verso del
     rettangolone e non toglieva niente.
     LA DISTANZA SI MISURA IN PERPENDICOLARE, non lungo una riga. Vicino al
     vertice la curva è quasi parallela al lato: là un errore di un decimo di
     pixel in verticale diventa un errore di un pixel intero in orizzontale, e
     quello che si misura è la pendenza invece della forma. È così che lo
     stesso angolo, già a posto, sembrava sbagliato di 0.861 px.
     Si guarda un elemento VERO dell'app, disegnato da forma.js in pagina, non
     una forma di prova: quello che si misura è quello che si vede. */
  console.log('\nE LA CURVA CHE ESCE È QUELLA DI APPLE, MISURATA SUI PIXEL');
  {
    const R = 40;
    const p2 = await b.newPage({ viewport: { width: 420, height: 560 }, deviceScaleFactor: DPR });
    await p2.goto('http://localhost:' + PORTA + '/index.html');
    await p2.waitForTimeout(400);
    await p2.evaluate((r) => {
      /* un elemento come tutti gli altri: un bordo, un raggio, e forma.js che
         se ne accorge da solo */
      /* IL RIQUADRO DA FOTOGRAFARE È PIÙ GRANDE DELLA FORMA.
         Fotografando l'elemento e basta, lo scatto comincia esattamente sul
         suo bordo: per trovare dove passa il contorno bisogna partire da
         FUORI, dal bianco, e fuori non c'è. Il primo giro dava zero su tutti
         e quattro gli angoli — cioè «nessuno scarto», che è il modo più
         subdolo che una misura ha di essere rotta: sembra un risultato
         perfetto. Quaranta pixel di bianco attorno bastano. */
      document.body.innerHTML = '<div id="foglio" style="padding:40px;background:#fff;width:280px">' +
        '<div id="q" style="width:200px;height:200px;background:#000;border-radius:' + r + 'px"></div></div>';
      document.documentElement.style.background = '#fff';
    }, R);
    await p2.waitForTimeout(400);
    const haForma = await p2.evaluate(() => {
      const s = getComputedStyle(document.getElementById('q')).clipPath || '';
      return /^path\(/.test(s) && s.indexOf('-200') >= 0;
    });
    ok('l’elemento di prova ha preso la forma da forma.js', haForma,
      haForma ? '' : 'senza il ritaglio la misura qui sotto non vuol dire niente');
    const png = await p2.locator('#foglio').screenshot();
    /* IL CONFRONTO, dentro la pagina: si campiona la curva analitica fitta e
       per ogni punto del bordo trovato si prende la distanza al punto più
       vicino della curva. */
    const SCARTO = `(function (b64, R, S) {
      return (async function () {
        const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height).data;
        /* il riquadro della forma dentro lo scatto: quaranta pixel di
           margine da ogni lato, il padding del foglio */
        const M = 40, W = 200, H = 200;
        const val = function (i, j) { const k = ((j | 0) * c.width + (i | 0)) * 4; return (d[k] + d[k+1] + d[k+2]) / 3; };
        const INIZIO = 1.528665;
        const CURVE = [{ c1: [1.08849296, 0], c2: [0.86840694, 0], p: [0.63149379, 0.07491139] },
          { c1: [0.37282383, 0.16905956], c2: [0.16905956, 0.37282383], p: [0.07491139, 0.63149379] },
          { c1: [0, 0.86840694], c2: [0, 1.08849296], p: [0, 1.528665] }];
        const bez = function (p0, c1, c2, p3, t) { const u = 1 - t, a = u*u*u, b = 3*u*u*t, cc = 3*u*t*t, dd = t*t*t;
          return [a*p0[0]+b*c1[0]+cc*c2[0]+dd*p3[0], a*p0[1]+b*c1[1]+cc*c2[1]+dd*p3[1]]; };
        const pt = []; let p0 = [INIZIO, 0];
        for (const q of CURVE) { for (let i = 0; i <= 3000; i++) { const v = bez(p0, q.c1, q.c2, q.p, i/3000); pt.push([v[0]*R, v[1]*R]); } p0 = q.p; }
        const dist = function (px, py) { let m = 1e9;
          for (let i = 0; i < pt.length; i++) { const a = pt[i][0]-px, b = pt[i][1]-py; const v = a*a+b*b; if (v < m) m = v; }
          return Math.sqrt(m); };
        /* il bordo lungo una riga, a mezzo pixel: si cerca il passaggio da
           chiaro a scuro e si interpola */
        const bordo = function (jy, da, a, passo) {
          let prima = val(da, jy);
          for (let i = da + passo; passo > 0 ? i < a : i > a; i += passo) {
            const v = val(i, jy);
            if (prima >= 128 && v < 128) { const t = (prima - 128) / (prima - v); return (i - passo + passo * t) / S; }
            prima = v;
          }
          return null;
        };
        const L = INIZIO * R + 4;
        const ANG = { tl: [M, M, 1, 1], tr: [M + W, M, -1, 1], br: [M + W, M + H, -1, -1], bl: [M, M + H, 1, -1] };
        const out = {};
        let peggio = 0, attacco = 0;
        for (const k in ANG) {
          const A2 = ANG[k]; let p = 0;
          for (let t = 0.6; t < INIZIO * R + 8; t += 0.25) {
            const jy = Math.round((A2[1] + A2[3] * t) * S);
            if (jy < 1 || jy > c.height - 2) continue;
            const da = Math.round((A2[0] - A2[2] * 12) * S), fin = Math.round((A2[0] + A2[2] * L) * S);
            const xx = bordo(jy, da, fin, A2[2]);
            if (xx === null) continue;
            const rientro = Math.abs(xx - A2[0]);
            /* DOVE L'ANGOLO SI ATTACCA AL LATO DRITTO. E' la misura che
               separa le due forme senza ambiguita': l'arco di cerchio finisce
               a un raggio dal vertice, quello di Apple a 1.528665 raggi. In
               perpendicolare invece le due curve si somigliano parecchio —
               meno di un pixel su un raggio di quaranta — quindi la sola
               distanza non basterebbe a dire che forma e'. */
            if (rientro > 0.15 && t > attacco) attacco = t;
            if (t > INIZIO * R) continue;
            const dd2 = dist(t, rientro);
            if (dd2 > p) p = dd2;
          }
          out[k] = +p.toFixed(3);
          if (p > peggio) peggio = p;
        }
        out.peggio = +peggio.toFixed(3);
        out.attacco = +attacco.toFixed(2);
        return out;
      })();
    })`;
    const m = await p2.evaluate(SCARTO + '(' + JSON.stringify(png.toString('base64')) + ',' + R + ',' + DPR + ')');
    ok('ogni angolo sta a meno di un quarto di pixel dalla curva di Apple', m.peggio < 0.25,
      'tl ' + m.tl + ' · tr ' + m.tr + ' · br ' + m.br + ' · bl ' + m.bl +
      ' → peggio ' + m.peggio + 'px su un raggio di ' + R);
    /* LA RETE: un `border-radius` puro, cioè un arco di cerchio, deve
       FALLIRE questa misura di brutto. Se passasse, vorrebbe dire che la
       misura non distingue le due forme e non prova niente — ed è
       esattamente lo stato in cui la forma è stata per un giorno intero
       senza che nessuno se ne accorgesse.
       Il riferimento si disegna in una pagina VUOTA, senza forma.js dentro:
       spegnere il ritaglio sull'elemento dell'app non serve a niente, perché
       alla passata dopo forma.js glielo rimette — e la rete misurerebbe di
       nuovo il supercerchio, dicendo che va tutto bene. */
    await p1.setContent('<body style="margin:0;background:#fff">' +
      '<div id="foglio" style="padding:40px;background:#fff;width:280px">' +
      '<div style="width:200px;height:200px;background:#000;border-radius:' + R + 'px"></div></div></body>');
    await p1.waitForTimeout(80);
    const png2 = await p1.locator('#foglio').screenshot();
    const m2 = await p1.evaluate(SCARTO + '(' + JSON.stringify(png2.toString('base64')) + ',' + R + ',' + DPR + ')');
    /* DOVE L'ANGOLO SI ATTACCA AL LATO. È la misura che separa le due forme
       senza ambiguità: in perpendicolare si somigliano — meno di un pixel su
       un raggio di quaranta, come dice il numero qui sotto — e una prova che
       guardasse solo quella si farebbe ingannare da un `border-radius` puro.
       L'arco finisce a un raggio dal vertice, quello di Apple a 1.528665.
       Il confronto è FRA LE DUE MISURE, non con il numero teorico: la curva
       di Apple si appiattisce così dolcemente che l'ultimo tratto rientra di
       meno di un sesto di pixel, cioè meno di quanto uno scatto a sei volte
       la risoluzione possa distinguere, e il valore assoluto esce sempre un
       po' corto (48 invece di 61). La DIFFERENZA fra le due, misurata allo
       stesso modo, resta netta. */
    ok('e la misura sa distinguere un arco di cerchio (se no non prova niente)',
      m2.peggio < 1.2 && m.attacco > m2.attacco + 8,
      'in perpendicolare l’arco dista solo ' + m2.peggio + 'px — troppo poco per distinguerlo; ' +
      'ma si attacca al lato a ' + m2.attacco + 'px mentre la nostra forma a ' + m.attacco +
      'px (' + (m.attacco - m2.attacco).toFixed(1) + 'px di differenza)');
    await p2.close();
  }

  /* ============ 9. l'icona dell'app ============ */
  console.log('\nL’ICONA DELL’APP');
  const angoloPng = async (f) => {
    const png = fs.readFileSync(path.join(RADICE, f)).toString('base64');
    return p1.evaluate((b64) => (async () => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data;
      return d[3];
    })(), png);
  };
  {
    const svg = fs.readFileSync(path.join(RADICE, 'assets/icone/icona.svg'), 'utf8');
    const d = (svg.match(/d="(M ?[0-9][^"]{200,})"/) || [])[1] || '';
    const atteso = A.tracciatoSvg(512, 512, 512 / (2 * A.INIZIO));
    ok('icona.svg ha il tracciato di Apple, generato', d === atteso,
      d === atteso ? 'combacia con segni/apple.mjs' : 'lancia: node segni/icone.mjs');
    ok('e il raggio è il più grande che ci sta (i due angoli si toccano)',
      /167\.5|167\.4/.test(atteso.slice(0, 40)) || atteso.length > 100,
      'raggio ' + (512 / (2 * A.INIZIO)).toFixed(1) + 'px su 512');
  }
  for (const f of ['icona-180.png', 'icona-167.png', 'icona-152.png', 'icona-maskable-192.png']) {
    const a = await angoloPng('assets/icone/' + f);
    ok(f + ' è piena fino al bordo', a > 200,
      a > 200 ? 'alfa ' + a : 'ha l’angolo tagliato: dentro la maschera del sistema resterebbe un anello di niente');
  }
  for (const f of ['icona-192.png', 'icona-512.png', 'favicon-32.png']) {
    const a = await angoloPng('assets/icone/' + f);
    ok(f + ' ha l’angolo a supercerchio', a < 40, 'alfa ' + a);
  }

  console.log(guai ? '\n>>> ' + guai + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(guai ? 1 : 0);
})();
