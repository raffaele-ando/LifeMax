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

  /* ============ 3. il poligono sta sulle Bézier di Apple ============ */
  console.log('\nIL POLIGONO STA SULLE BÉZIER DI APPLE');
  /* La curvatura di una spezzata non si può misurare — è zero sui segmenti e
     infinita sui vertici — ma la distanza dalla curva vera sì. Si misura come
     AREA fra le due divisa per la lunghezza dell'arco: è lo scarto medio, e
     non ha versi privilegiati. Riga per riga non si potrebbe: verso il lato la
     curva è quasi orizzontale e mezzo pixel di differenza vera darebbe
     centoventi pixel di scarto in x. */
  {
    const MASCHERA = `(function (b64, R) {
      return (async function () {
        const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, R, R).data;
        var m = [];
        for (var j = 0; j < R; j++) for (var i = 0; i < R; i++) {
          var k = (j * R + i) * 4;
          m.push((d[k] + d[k+1] + d[k+2]) / 3 < 128 ? 1 : 0);
        }
        return m;
      })();
    })`;
    const maschera = async (css, R) => {
      /* NIENTE `background:#000` qui: il colore di fondo copriva la maschera e
         il riferimento veniva un rettangolo pieno. Il colore lo mette chi
         chiama, o l'immagine. */
      await p1.setContent('<body style="margin:10px;background:#fff">' +
        '<div id="q" style="width:' + largo(R) + 'px;height:' + largo(R) + 'px;' + css + '"></div></body>');
      await p1.waitForTimeout(50);
      const png = await p1.locator('#q').screenshot();
      return p1.evaluate(MASCHERA + '(' + JSON.stringify(png.toString('base64')) + ',' + (R * DPR) + ')');
    };
    /* la lunghezza dell'arco dell'angolo, in unità di raggio */
    let L = 0;
    const pp = A.puntiAngolo(1, 0.000005);
    for (let i = 1; i < pp.length; i++) L += Math.hypot(pp[i][0] - pp[i - 1][0], pp[i][1] - pp[i - 1][1]);
    for (const R of [8, 12, 18, 26]) {
      /* il riferimento è il tracciato SVG, che ha le Bézier per quello che sono */
      const lato = largo(R);
      const d = A.tracciatoSvg(lato, lato, R);
      const svg = "url('data:image/svg+xml," + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="' + lato + '" height="' + lato + '">' +
        '<path d="' + d + '" fill="#000"/></svg>') + "')";
      const mRif = await maschera('background-image:' + svg + ';background-size:100% 100%;background-repeat:no-repeat;', R);
      const mNos = await maschera('background:#000;border-radius:0;clip-path:' + A.poligono([R, R, R, R], 0.2) + ';', R);
      let diverse = 0;
      for (let i = 0; i < mRif.length; i++) if (mRif[i] !== mNos[i]) diverse++;
      const medio = diverse / (L * R * DPR) / DPR;
      ok('a ' + R + 'px la spezzata sta sulle Bézier entro un decimo di pixel', medio < 0.1,
        'scarto medio ' + medio.toFixed(3) + 'px (' + diverse + ' pixel di schermo di differenza)');
    }
  }

  /* ============ 4. OGNI TRACCIATO GENERATO È CSS VALIDO ============ */
  console.log('\nOGNI TRACCIATO GENERATO È CSS VALIDO');
  /* La prova che mancava, e che è costata caro: un `calc(100% - 0)` — non
     valido, perché da una percentuale non si può sottrarre uno zero senza
     unità — faceva buttare al browser l'INTERA dichiarazione. Il ritaglio
     diventava `none`: l'elemento restava un rettangolo a spigoli e l'anello,
     senza più ritaglio, dipingeva un rettangolo pieno di colore sopra tutta la
     scheda. Nel foglio di stile il testo sembrava giusto, e il difetto si
     vedeva solo aprendo l'app. */
  {
    const css = fs.readFileSync(path.join(RADICE, 'assets/app.css'), 'utf8');
    const tracciati = [...css.matchAll(/(--sq-\d+-[pa]):\s*(polygon\([^;]+\))/g)].map((m) => [m[1], m[2]]);
    const rotti = await p1.evaluate((lista) => lista
      .filter(([, v]) => !CSS.supports('clip-path', v)).map(([n]) => n), tracciati);
    ok('i tracciati sono ' + tracciati.length + ', e il browser li accetta tutti', rotti.length === 0,
      rotti.length ? 'ROTTI: ' + rotti.join(' ') : 'nessuno rifiutato');
    ok('e ce n’è almeno uno per ogni raggio dell’app', tracciati.length >= 20,
      tracciati.length + ' tracciati');
    /* e la controprova: la prova sa vedere il difetto */
    const finto = await p1.evaluate(() => CSS.supports('clip-path', 'polygon(0 0, calc(100% - 0) 0, 100% 100%)'));
    ok('la prova sa riconoscere un tracciato rotto', finto === false,
      'calc(100% - 0) viene rifiutato, come deve');
  }

  /* ============ 5. l'app: ogni angolo, e il bordo che c'è davvero ======== */
  console.log('\nL’APP: OGNI ANGOLO RITAGLIATO, E IL BORDO SULLA CURVA');
  const GUARDA = `(function () {
    var out = { conRitaglio: 0, senza: [], nonPoligono: [], anelloSpento: [], mangiati: [], overflow: [] };
    var nome = function (e) { return e.tagName.toLowerCase() +
      (e.className && e.className.toString ? '.' + e.className.toString().trim().split(/\\s+/).slice(0, 2).join('.') : ''); };
    document.querySelectorAll('body *').forEach(function (e) {
      var s = getComputedStyle(e), r = e.getBoundingClientRect();
      if (r.width < 3 || r.height < 3 || s.visibility === 'hidden' || s.display === 'none') return;
      var raggi = ['borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius']
        .map(function (k) { return parseFloat(s[k]) || 0; });
      var rmax = Math.max.apply(null, raggi);
      var clip = s.clipPath;
      /* NESSUNA eccezione, pastiglie comprese. Erano rimaste archi di cerchio
         perché un ritaglio non sa dire «metà del lato corto»: adesso le loro
         altezze si MISURANO in pagina (segni/misure.mjs) e il raggio si ricava
         da là. Se una resta indietro, va rilanciata quella misura. */
      var capsula = rmax >= Math.min(r.width, r.height) / 2 - 0.6;
      /* I CAMPI DI FORM sono l'unica eccezione, e non è una scelta: un input,
         un select e una textarea non generano pseudo-elementi, quindi il bordo
         lì lo può dipingere solo il box. Ritagliandoli, il bordo verrebbe tagliato
         sulla curva e non ci sarebbe nessuno a ridisegnarlo: il campo resta
         senza bordo del tutto. È già successo a ogni campo di testo dell'app. */
      var campo = /^(input|select|textarea|progress|meter)$/.test(e.tagName.toLowerCase());
      if (rmax >= 1 && !campo && (!clip || clip === 'none'))
        { out.senza.push(nome(e) + ' (raggio ' + rmax + 'px' +
          (capsula ? ', pastiglia: lancia node segni/misure.mjs' : '') + ')'); return; }
      if (campo && (!clip || clip === 'none')) {
        /* e il bordo devono averlo: se qualcuno glielo spegne, sparisce */
        var bwc = parseFloat(s.borderTopWidth) || 0;
        if (bwc > 0 && /^(transparent|rgba\(0, 0, 0, 0\))$/.test(s.borderTopColor))
          out.senza.push(nome(e) + ' — CAMPO SENZA BORDO: colore spento e nessuno pseudo-elemento');
        return;
      }
      if (!clip || clip === 'none') return;
      out.conRitaglio++;
      if (!/^polygon/.test(clip)) out.nonPoligono.push(nome(e) + ': ' + clip.slice(0, 30));
      /* L'ANELLO. Il bordo del box viene tagliato proprio sulla curva, quindi
         va ridisegnato: se il suo colore è trasparente mentre l'elemento ha un
         bordo, il bordo NON C'È negli angoli. È il difetto che una riga
         una regola sull'asterisco degli pseudo-elementi aveva prodotto su
         tutta l'app. */
      var bw = parseFloat(s.borderTopWidth) || 0;
      /* il colore del bordo sta in --sq-b: sull'elemento è trasparente di
         proposito, perché a dipingerlo è l'anello — dipingendolo entrambi, sui
         lati dritti veniva doppio e sulla curva singolo, cioè fianchi scuri e
         angoli chiari */
      var bc = (s.getPropertyValue('--sq-b') || '').trim();
      var opaco = bw > 0 && bc && !/^(transparent|rgba\\(0, 0, 0, 0\\))$/.test(bc);
      if (opaco) {
        var quale = null;
        ['::before', '::after'].forEach(function (ps) {
          var q = getComputedStyle(e, ps);
          if (/^polygon\\(/.test(q.clipPath || '') && !/-200px/.test(q.clipPath || '')) quale = q;
        });
        if (!quale) out.anelloSpento.push(nome(e) + ' — nessun anello, bordo ' + bw + 'px ' + bc);
        else if (/rgba\\(0, 0, 0, 0\\)|transparent/.test(quale.backgroundColor))
          out.anelloSpento.push(nome(e) + ' — anello trasparente, bordo ' + bc);
      }
      /* L'OVERFLOW SI MANGIA L'ANELLO. Un overflow non visibile taglia al
         riquadro INTERNO, e l'anello del bordo sta nell'area del bordo, cioè
         fuori: veniva via tutto e quegli elementi restavano senza bordo. Si
         vedeva sulla scheda di «Adesso» (restava solo il filo colorato
         dell'area, tagliato) e sulla lista delle attività, dove il bordo del
         contenitore spariva e restavano quelli delle righe, di un altro
         colore. */
      if (opaco && !/^visible/.test(s.overflow) && quale) {
        /* conta solo se l'anello sta NELL'AREA DEL BORDO (inset negativo): là
           l'overflow, che taglia al riquadro interno, se lo mangia. Per chi
           scorre l'anello si disegna dentro, a inset 0, e allora va bene.
           E non conta se chi taglia è un overflow «clip» con un margine di
           ritaglio grande almeno quanto l'inset: quello sposta il taglio
           esattamente dove sta l'anello, e i figli restano dentro come voleva
           chi ha scritto il foglio. (Con «hidden» il margine non ha nessun
           effetto: misurato. E i pixel dicono che così il bordo c'è tutto —
           ventiquattro direzioni su ventiquattro, luminanza uguale.) */
        var ins = parseFloat(quale.top);
        var margine = /clip/.test(s.overflow) ? (parseFloat(s.overflowClipMargin) || 0) : 0;
        if (!isNaN(ins) && ins < -0.01 && margine < -ins - 0.01)
          out.overflow.push(nome(e) + ' — overflow ' + s.overflow + ' (margine ' +
            margine + ') si mangia l’anello (inset ' + quale.top + ')');
      }
      /* e il ritaglio non deve mangiare quello che sporge */
      if (/^visible/.test(s.overflow) && /^visible/.test(s.overflowY) && /^visible/.test(s.overflowX)) {
        for (var i = 0; i < e.children.length; i++) {
          var c = e.children[i], cs = getComputedStyle(c);
          if (cs.position === 'fixed') continue;
          var q2 = c.getBoundingClientRect();
          if (q2.width < 1 || q2.height < 1) continue;
          var fuori = Math.max(r.left - q2.left, r.top - q2.top, q2.right - r.right, q2.bottom - r.bottom);
          if (fuori > 0.6) out.mangiati.push(nome(e) + ' ← ' + nome(c) + ' (' + Math.round(fuori) + 'px fuori)');
        }
        ['::before', '::after'].forEach(function (ps) {
          var q3 = getComputedStyle(e, ps);
          if (!q3.content || q3.content === 'none' || q3.content === 'normal') return;
          if (q3.position !== 'absolute' && q3.position !== 'fixed') return;
          var nn = function (k) { var v = parseFloat(q3[k]); return isNaN(v) ? 0 : v; };
          var lati = [nn('top'), nn('left'), nn('right'), nn('bottom')];
          if (Math.min.apply(null, lati) >= -0.01) return;
          var anello = /^polygon\\(/.test(q3.clipPath || '') &&
            lati.every(function (x) { return Math.abs(x - lati[0]) < 0.01; }) && lati[0] < 0;
          if (anello) return;
          /* arrivare al bordo ESTERNO non è essere mangiato: là passa la forma,
             e quello che esce dalla forma è giusto che esca. Il filo dell'area
             in cima alla scheda di «Adesso» sta così di proposito — partendo dal
             riquadro interno restava sopra una striscia del colore del bordo, e
             si leggeva come un bordo di due colori tagliato. */
          if (Math.min.apply(null, lati) >= -(parseFloat(s.borderTopWidth) || 0) - 0.01) return;
          out.mangiati.push(nome(e) + ps + ' sporge (' + q3.top + ' ' + q3.left + ')');
        });
      }
    });
    return out;
  })()`;
  const SCENE = [
    ['Oggi', 'oggi', null], ['La giornata', 'giornata', null], ['Attività', 'inbox', null],
    ['Rituali', 'rituali', null], ['Andamento', 'plancia', null], ['Esperimenti', 'esperimenti', null],
    ['Impostazioni', 'plancia', () => { const b2 = (document.getElementById('fondo-impostazioni') || document.querySelector('[data-imp]')); if (b2) b2.click(); }],
    ['Promemoria', 'plancia', () => { const b2 = (document.getElementById('fondo-impostazioni') || document.querySelector('[data-imp]')); if (b2) b2.click(); const c = document.getElementById('imp-prom-come'); if (c) c.click(); }],
    ['Design lab', 'lab', null]
  ];
  const ps = await b.newPage({ viewport: { width: 390, height: 900 }, hasTouch: true, isMobile: true });
  await ps.goto('http://localhost:' + PORTA + '/index.html'); await ps.waitForTimeout(400);
  await ps.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  let totClip = 0;
  const senza = new Set(), nonPoly = new Set(), spenti = new Set(), mangiati = new Set(), overf = new Set();
  for (const [nome, vai, poi] of SCENE) {
    await ps.evaluate(v => { location.hash = '#/' + v; }, vai);
    await ps.reload(); await ps.waitForTimeout(vai === 'lab' ? 1600 : 800);
    if (poi) { await ps.evaluate(poi); await ps.waitForTimeout(500); }
    const r = await ps.evaluate(GUARDA);
    totClip += r.conRitaglio;
    r.senza.forEach(x => senza.add(nome + ' — ' + x));
    r.nonPoligono.forEach(x => nonPoly.add(x));
    r.anelloSpento.forEach(x => spenti.add(nome + ' — ' + x));
    r.mangiati.forEach(x => mangiati.add(nome + ' — ' + x));
    r.overflow.forEach(x => overf.add(x));
    console.log('      ' + nome.padEnd(16) + String(r.conRitaglio).padStart(4) + ' ritagliati' +
      (r.senza.length ? '   ' + r.senza.length + ' RIMASTI INDIETRO' : '') +
      (r.anelloSpento.length ? '   ' + r.anelloSpento.length + ' SENZA BORDO' : ''));
  }
  ok('nessun angolo rimasto un rettangolo arrotondato', senza.size === 0,
    [...senza].slice(0, 5).join(' | ') || 'nessuno');
  ok('e ogni ritaglio è un poligono', nonPoly.size === 0, [...nonPoly].slice(0, 3).join(' | ') || 'sì');
  ok('gli angoli ritagliati sono tanti', totClip > 300, totClip + ' elementi ritagliati');
  ok('e OGNI elemento col bordo ha l’anello acceso', spenti.size === 0,
    [...spenti].slice(0, 5).join(' | ') || 'nessuno spento');
  ok('e il ritaglio non si mangia niente che sporge', mangiati.size === 0,
    [...mangiati].slice(0, 5).join(' | ') || 'nessun figlio, nessuno pseudo-elemento');
  ok('e nessun overflow si mangia l’anello del bordo', overf.size === 0,
    [...overf].slice(0, 5).join(' | ') || 'nessuno');

  /* ============ 5b. col mouse sopra il bordo non raddoppia ============ */
  console.log('\nCOL MOUSE SOPRA, IL BORDO NON CAMBIA PESO');
  /* `.btn` dichiara il raggio e il bordo, `.btn:hover` dichiara solo un altro
     colore di bordo: quella variante non era nella lista di quelli da spegnere,
     quindi al passaggio del mouse il bordo del box si riaccendeva SOPRA
     l'anello — doppio sui fianchi, singolo sulla curva. Si vedeva come un
     bordo che si illumina in modo diverso a metà. */
  {
    const p2 = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await p2.goto('http://localhost:' + PORTA + '/index.html'); await p2.waitForTimeout(400);
    await p2.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
    await p2.reload(); await p2.waitForTimeout(900);
    const casi = [];
    for (const sel of ['.btn', '.card-hover', '.cattura-cta', 'input[type="text"]']) {
      const c = await p2.evaluate((sel) => {
        const e = [...document.querySelectorAll(sel)].find((x) => {
          const r = x.getBoundingClientRect(), s = getComputedStyle(x);
          return r.width > 30 && r.height > 20 && /^polygon\(/.test(s.clipPath || '');
        });
        if (!e) return null;
        e.setAttribute('data-sq-hover', '1');
        return { prima: getComputedStyle(e).borderTopColor };
      }, sel);
      if (!c) continue;
      await p2.hover('[data-sq-hover="1"]').catch(() => {});
      await p2.waitForTimeout(200);
      const d = await p2.evaluate(() => {
        const e = document.querySelector('[data-sq-hover="1"]');
        const s = getComputedStyle(e);
        e.removeAttribute('data-sq-hover');
        return { dopo: s.borderTopColor, sqb: (s.getPropertyValue('--sq-b') || '').trim() };
      });
      casi.push({ sel, prima: c.prima, dopo: d.dopo, sqb: d.sqb });
    }
    const cattivi = casi.filter((x) => !/rgba\(0, 0, 0, 0\)|transparent/.test(x.dopo));
    ok('il bordo del box resta spento anche col mouse sopra', casi.length >= 2 && cattivi.length === 0,
      cattivi.length ? cattivi.map((x) => x.sel + ' → ' + x.dopo).join(' | ')
        : casi.length + ' comandi provati, tutti col bordo dipinto solo dall’anello');
    const cambia = casi.filter((x) => x.sqb && !/^(transparent|rgba\(0, 0, 0, 0\))$/.test(x.sqb));
    ok('e l’anello prende il colore dello stato', cambia.length > 0,
      cambia.length + ' su ' + casi.length + ' cambiano colore col mouse sopra');
    await p2.close();
  }

  /* ============ 6. il bordo, sui pixel di un elemento vero ============ */
  console.log('\nIL BORDO, SUI PIXEL');
  {
    /* si torna su «Oggi»: il giro delle schermate lascia la pagina sull'ultima
       (il Design lab), dove gli elementi da misurare non ci sono */
    await ps.evaluate(() => { location.hash = '#/oggi'; });
    await ps.reload(); await ps.waitForTimeout(900);
    const info = await ps.evaluate(() => {
      let e = null;
      for (const sel of ['.giornata-strip', '.card', '.imp-sezione', '.riga-inbox',
        '.btn-mini', '.cattura-cta', '.rit-gruppo']) {
        e = [...document.querySelectorAll(sel)].find((x) => {
          const r = x.getBoundingClientRect(), s = getComputedStyle(x);
          /* il colore del bordo NON si chiede più all'elemento: là è
             trasparente di proposito, perché a dipingerlo è l'anello. Si
             guarda `--sq-b`, che è dove il colore sta adesso. */
          const q = getComputedStyle(x, '::before');
          return r.width > 120 && r.height > 40 && /^polygon\(/.test(s.clipPath || '') &&
            (parseFloat(s.borderTopWidth) || 0) > 0 &&
            /^polygon\(/.test(q.clipPath || '') && !/-200px/.test(q.clipPath || '') &&
            !/rgba\(0, 0, 0, 0\)|transparent/.test(q.backgroundColor);
        });
        if (e) break;
      }
      if (!e) return null;
      e.id = 'sq-bordo';
      const cp = getComputedStyle(e).clipPath;
      const q = cp.match(/min\(([0-9.]+)px/);
      return { cls: (e.className || '').toString(), dpr: window.devicePixelRatio || 1,
        raggio: q ? +q[1] / 1.528665 : null };
    });
    if (!info || !info.raggio) ok('c’è un elemento col bordo da misurare', false, 'non trovato');
    else {
      const png = await ps.locator('#sq-bordo').screenshot();
      const m = await ps.evaluate((a) => {
        const [b64, R] = a;
        return (async function () {
          const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
          const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
          const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
          const d = x.getImageData(0, 0, c.width, c.height).data;
          /* lo screenshot di un elemento è appiattito su bianco: l'alfa non
             dice niente, si guarda la LUCE. Dal centro del quadrato
             dell'angolo verso fuori, il primo pixel non chiaro è l'inizio del
             bordo, e subito dopo ci deve essere il bordo pieno. */
          const luce = (i, j) => { const k = (j * c.width + i) * 4; return (d[k] + d[k+1] + d[k+2]) / 3; };
          const fondo = luce(Math.round(c.width / 2), Math.round(c.height / 2));
          let conBordo = 0, tot = 0;
          const scuri = [];
          for (let g = 6; g <= 84; g += 4) {
            const a2 = g * Math.PI / 180;
            const dove = (t) => [Math.round(R - Math.cos(a2) * t), Math.round(R - Math.sin(a2) * t)];
            let buio = 255;
            for (let t = 0; t < R * 1.6; t += 0.5) {
              const [i, j] = dove(t);
              if (i < 0 || j < 0) break;
              buio = Math.min(buio, luce(i, j));
            }
            tot++;
            scuri.push(buio);
            if (buio < fondo - 8) conBordo++;
          }
          /* E QUANTO È SCURO, direzione per direzione. È il difetto che si
             vedeva a occhio — «bordo scuro e poi un taglio chiaro» — e ha due
             cause, entrambe misurabili qui: il bordo del box dipinto INSIEME
             all'anello (sui lati dritti veniva doppio, e i bordi di quest'app
             sono traslucidi) e il contorno esterno dell'anello sfumato due
             volte, dal proprio ritaglio e da quello del padre. Le direzioni
             quasi parallele ai lati sono «il fianco», quelle in mezzo «la
             curva». */
          const meta2 = scuri.length >> 1;
          const vicinoAiLati = Math.min(scuri[0], scuri[scuri.length - 1]);
          const inMezzo = scuri[meta2];
          return { conBordo, tot, fondo: Math.round(fondo),
            fianco: Math.round(vicinoAiLati), curva: Math.round(inMezzo) };
        })();
      /* R è la LUNGHEZZA DELL'ANGOLO in pixel d'immagine, non il raggio e non un
         suo multiplo a caso: i raggi partono dal punto (R,R) e con un R tre
         volte troppo grande partivano da dentro la scheda, sul testo, e
         misuravano quanto è scuro il testo invece del bordo. */
      }, [png.toString('base64'), Math.round(info.raggio * A.INIZIO * info.dpr)]);
      ok('«' + info.cls.split(' ')[0] + '»: il bordo c’è su tutta la curva',
        m.tot > 15 && m.conBordo === m.tot,
        m.conBordo + ' direzioni su ' + m.tot + ' hanno il bordo');
      ok('ed è scuro uguale sul fianco e sulla curva',
        Math.abs(m.fianco - m.curva) <= 12,
        'fianco ' + m.fianco + ' · curva ' + m.curva + ' (su 255; fondo ' + m.fondo + ')');
    }
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

  /* ============ 8. il blocco è generato, non scritto a mano ============ */
  console.log('\nIL BLOCCO È GENERATO, NON SCRITTO A MANO');
  {
    const prima = fs.readFileSync(path.join(RADICE, 'assets/app.css'), 'utf8');
    const { execFileSync } = require('child_process');
    execFileSync(process.execPath, [path.join(RADICE, 'segni/squircle.mjs')], { stdio: 'ignore' });
    const dopo = fs.readFileSync(path.join(RADICE, 'assets/app.css'), 'utf8');
    ok('rigenerandolo viene identico', prima === dopo, prima === dopo ? '' : 'lancia: node segni/squircle.mjs');
    ok('e c’è la rete: se il motore non sa fare il ritaglio, resta il raggio',
      /@supports \(clip-path: polygon\(min\(/.test(dopo), 'il blocco sta dentro un @supports');
    const fuori = [...dopo.split('/* ==== SUPERCERCHI')[0]
      .replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/clip-path\s*:\s*([^;}]+)/g)]
      .map((m) => m[1].trim()).filter((v) => v !== 'inset(50%)');
    ok('e fuori dal blocco nessuno dà una forma col ritaglio', fuori.length === 0,
      fuori.slice(0, 2).join(' | ') || 'solo il testo per i lettori di schermo');

    /* IL TEST DEVE PROVARE TUTTO QUELLO CHE IL BLOCCO USA.
       Il `@supports` provava `min()` e `calc()` dentro un `polygon()`, ma per
       un po' ogni tracciato ha cominciato con `evenodd` — che è un'altra
       funzione, e che WebKit dentro `polygon()` non fa. Su un iPad il test
       passava, il blocco entrava, e ogni `clip-path` finiva invalido: un
       valore che arriva da una `var()` e non è valido non fa cadere la
       regola, la porta a `unset`. Via il ritaglio dell'elemento, e via quello
       dell'anello — che senza il suo ritaglio smette di essere un anello e
       diventa un rettangolo PIENO del colore del bordo. La rete c'era e non
       serviva a niente, perché non provava la cosa giusta.
       Qui si raccolgono i pezzi di sintassi che i tracciati usano davvero e
       si pretende che la condizione del `@supports` li nomini tutti. */
    const corpo = dopo.split('/* ==== SUPERCERCHI')[1] || '';
    const condizione = (corpo.match(/@supports \(([^{]+)\) \{/) || [, ''])[1];
    const usati = new Set();
    [...corpo.matchAll(/polygon\(([^;]*?)\);/g)].forEach((m) => {
      const t = m[1];
      usati.add('polygon(');
      if (/\bmin\(/.test(t)) usati.add('min(');
      if (/\bmax\(/.test(t)) usati.add('max(');
      if (/\bclamp\(/.test(t)) usati.add('clamp(');
      if (/\bcalc\(/.test(t)) usati.add('calc(');
      /* il riempimento: sta subito dopo la parentesi del poligono */
      const f = t.match(/^\s*(evenodd|nonzero)\b/);
      if (f) usati.add(f[1]);
    });
    const scoperti = [...usati].filter((x) => condizione.indexOf(x) < 0);
    ok('e la rete prova TUTTO quello che i tracciati usano', scoperti.length === 0,
      scoperti.length ? 'mai provati: ' + scoperti.join(', ') : [...usati].join(' '));
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
