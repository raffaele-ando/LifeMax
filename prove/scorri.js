/* SFOGLIARE DI LATO FRA LE SCHERMATE.

   Nasce da «attiva la modalità che se faccio swipe vado nelle altre
   schermate della pagina in cui sono».

   Di un gesto così la parte facile è riconoscerlo. La parte che decide se
   l'app resta usabile è NON riconoscerlo quando non c'è: un'app che cambia
   schermata mentre provi a scorrere in basso è inservibile, e chi la usa non
   pensa «ho fatto un gesto storto» — pensa che l'app sia impazzita, perché
   ha perso il posto in cui era senza aver chiesto niente.

   Quindi qui i controlli sono di due specie, e i secondi sono più di venti
   contro cinque:
     · che il gesto FUNZIONI — avanti, indietro, col colpo secco, e che il
       muro in fondo alla fila si senta;
     · che il gesto NON PARTA — scorrendo in verticale, in diagonale, dentro
       le colonne della settimana che scorrono già di lato per conto loro, su
       un blocco che si trascina, su un campo, dal bordo dello schermo (che è
       del browser, che ci fa indietro e avanti), con un foglio aperto, col
       mouse, e da spento.

   Il gesto si fa con eventi puntatore veri (`p.mouse` non basta: manda
   `pointerType: mouse`, che è proprio quello che il gesto rifiuta), quindi
   qui si usa `CDP Input.dispatchTouchEvent`, cioè un dito vero.

   node prove/scorri.js       (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
const PORTA = 8772;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
let fail = 0;
const ok = (n, c, d) => { if (!c) fail++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

(async () => {
  const srv = http.createServer((q, r) => {
    let u = decodeURIComponent(q.url.split('?')[0]); if (u === '/') u = '/index.html';
    fs.readFile(path.join(RADICE, u), (e, d) => {
      if (e) { r.statusCode = 404; r.end('x'); return; }
      r.setHeader('Content-Type', T[path.extname(u)] || 'application/octet-stream'); r.end(d);
    });
  });
  await new Promise(r => srv.listen(PORTA, r));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  const errori = []; p.on('pageerror', e => errori.push('' + e));
  const cdp = await ctx.newCDPSession(p);

  /* UN DITO VERO. `passi` dice in quante tappe si muove: una sola tappa non è
     un trascinamento, è un salto, e il codice che rinuncia quando il dito
     scende ha bisogno di vedere la strada per poterci rinunciare. */
  async function dito(x0, y0, x1, y1, ms, passi) {
    passi = passi || 8;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y: y0 }] });
    for (let i = 1; i <= passi; i++) {
      const k = i / passi;
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove', touchPoints: [{ x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k }]
      });
      if (ms) await new Promise(r => setTimeout(r, ms / passi));
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await p.waitForTimeout(450);
  }

  /* UN PUNTO CHE IL GESTO ACCETTA, scelto guardando la pagina.
     Un punto fisso non va bene: su «La giornata» meta' schermo sono blocchi
     che si trascinano, e li' il gesto DEVE rifiutarsi. Provandolo li' non si
     misura il gesto, si misura la fortuna. */
  const puntoBuono = () => p.evaluate(() => {
    const vietato = 'input, textarea, select, [contenteditable="true"], [data-drag-az], [data-drag-ab], [data-manico], .segmenti';
    for (let y = 300; y <= 760; y += 20) {
      const t = document.elementFromPoint(195, y);
      if (!t || !t.closest('#vista') || t.closest(vietato)) continue;
      let n = t, lato = false;
      while (n && n !== document.body) {
        if (n.nodeType === 1 && n.scrollWidth > n.clientWidth + 2) {
          const ox = getComputedStyle(n).overflowX;
          if (ox === 'auto' || ox === 'scroll') { lato = true; break; }
        }
        n = n.parentNode;
      }
      if (!lato) return y;
    }
    return 0;
  });
  /* sfoglia avanti o indietro dal punto buono di QUESTA pagina */
  async function sfoglia(verso, ms, passi) {
    const y = await puntoBuono();
    if (!y) return false;
    await dito(200, y, 200 - verso * 112, y, ms == null ? 160 : ms, passi);
    return true;
  }

  async function apri(via, dopo) {
    await p.evaluate((v) => { location.hash = '#/' + v; }, via);
    await p.reload(); await p.waitForTimeout(1200);
    if (dopo) { await p.evaluate(dopo); await p.waitForTimeout(900); }
  }
  /* quale linguetta è accesa adesso */
  const dove = () => p.evaluate(() => {
    const bar = document.querySelector('#vista .segmenti.sez-nav');
    if (!bar) return '(nessuna riga)';
    const a = [...bar.children].find(x => x.classList.contains('attivo'));
    return a ? (a.textContent || '').trim() : '(nessuna accesa)';
  });
  const quante = () => p.evaluate(() => {
    const bar = document.querySelector('#vista .segmenti.sez-nav');
    return bar ? [...bar.children].filter(x => x.tagName === 'A' || x.tagName === 'BUTTON').length : 0;
  });

  await p.goto('http://localhost:' + PORTA + '/index.html'); await p.waitForTimeout(400);
  await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  await apri('oggi');

  console.log('\nIL GESTO FUNZIONA');
  const n = await quante();
  ok('la pagina «Oggi» ha una riga di linguette da sfogliare', n >= 3, n + ' linguette');
  const a0 = await dove();
  await sfoglia(1);
  const a1 = await dove();
  ok('dito a sinistra → la schermata dopo', a1 !== a0 && a1 !== '(nessuna accesa)', a0 + ' → ' + a1);
  await sfoglia(-1);
  const a2 = await dove();
  ok('dito a destra → si torna indietro', a2 === a0, a1 + ' → ' + a2);

  /* IL COLPO SECCO: trentacinque pixel, ma in fretta. Due tappe sole, senza
     pause: piu' veloce di cosi' non si riesce a mandare un dito da qui. */
  const yc = await puntoBuono();
  await dito(200, yc, 165, yc, 0, 2);
  const a3 = await dove();
  ok('un colpo secco corto conta lo stesso (35px, senza pause)', a3 !== a2, a2 + ' → ' + a3);
  /* torna al principio, con un fondo: un ciclo che aspetta un gesto che
     potrebbe non funzionare e' un ciclo che non finisce mai (successo) */
  for (let i = 0; i < 6 && (await dove()) !== a0; i++) await sfoglia(-1);
  ok('si torna al principio per il resto della prova', (await dove()) === a0, await dove());

  /* IL CLIC CHE VIENE DOPO, E PERCHÉ NON C'È.
     Sotto una certa distanza il browser considera il tocco ancora un tocco, e
     dopo `touchend` sintetizza un clic su quello che c'era sotto il dito:
     sfogliando sopra al tasto «Fatto» si cambierebbe schermata E si
     spunterebbe la cosa. La prima versione del gesto aveva un ascoltatore che
     ingoiava quel clic — e questa prova ha mostrato che non ingoiava niente,
     perché a quelle distanze il clic non arriva mai.
     Quindi non c'è più codice da controllare: c'è un NUMERO da tenere fermo.
     Qui si misura dove Chromium smette di sintetizzare il clic, e si pretende
     che la soglia del colpo secco stia sopra. Se un giorno qualcuno la
     abbassa per rendere il gesto più pronto, questa riga diventa rossa e dice
     esattamente perché. */
  console.log('\nLA SOGLIA DEL COLPO SECCO STA SOPRA IL CLIC SINTETIZZATO');
  await p.evaluate(() => { const st = LM.load(); st.profilo.scorri = 'no'; LM.save(); });
  await apri('oggi');
  await p.evaluate(() => {
    window.__clic = 0;
    document.addEventListener('click', () => { window.__clic++; }, true);
  });
  let ultimoConClic = 0;
  for (const dx of [0, 5, 8, 12, 16, 20, 25, 30]) {
    const c = await p.evaluate(() => {
      const b = [...document.querySelectorAll('#vista button')].find(x => x.offsetWidth > 80 && x.offsetHeight > 30);
      if (!b) return null;
      b.scrollIntoView({ block: 'center' });
      const r = b.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    if (!c) break;
    await p.waitForTimeout(250);
    await p.evaluate(() => { window.__clic = 0; });
    await dito(c.x, c.y, c.x - dx, c.y, 0, 2);
    if (await p.evaluate(() => window.__clic > 0)) ultimoConClic = dx;
    await apri('oggi');
    await p.evaluate(() => {
      window.__clic = 0;
      document.addEventListener('click', () => { window.__clic++; }, true);
    });
  }
  const soglia = +(fs.readFileSync(path.join(RADICE, 'assets/app.js'), 'utf8')
    .match(/colpo:\s*(\d+)/) || [])[1];
  ok('il browser sintetizza ancora un clic a qualche distanza (se no la misura è muta)',
    ultimoConClic > 0, 'l’ultima con clic: ' + ultimoConClic + 'px');
  ok('la soglia del colpo secco sta sopra quella distanza',
    soglia > ultimoConClic, 'soglia ' + soglia + 'px, ultimo clic sintetizzato a ' + ultimoConClic + 'px');
  await p.evaluate(() => { const st = LM.load(); st.profilo.scorri = 'si'; LM.save(); });
  await apri('oggi');

  /* e comunque, il gesto vero sopra il tasto non lo preme */
  const bF = await p.evaluate(() => {
    const b = document.getElementById('btn-fatto') || document.getElementById('btn-adesso');
    if (!b) return null;
    b.scrollIntoView({ block: 'center' });
    const r = b.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, testo: (b.textContent || '').trim() };
  });
  await p.waitForTimeout(400);
  ok('c’è il tasto grande su cui provare', !!bF, bF ? bF.testo : 'nessuno');
  if (bF) {
    const fatteP = await p.evaluate(() => LM.load().azioni.filter(a => a.done).length);
    const seP = await dove();
    await dito(bF.x + 55, bF.y, bF.x - 55, bF.y, 0, 2);
    const fatteD = await p.evaluate(() => LM.load().azioni.filter(a => a.done).length);
    ok('un colpo secco sopra il tasto cambia schermata', (await dove()) !== seP, seP + ' → ' + (await dove()));
    ok('e non lo preme', fatteD === fatteP, fatteP + ' fatte prima, ' + fatteD + ' dopo');
  }
  await apri('oggi');

  console.log('\nIL MURO IN FONDO ALLA FILA');
  /* fino in fondo, poi ancora una volta */
  for (let i = 0; i < 6; i++) await sfoglia(1);
  const ultimo = await dove();
  await p.evaluate(() => { const x = document.querySelector('.sez-muro'); if (x) x.classList.remove('sez-muro'); });
  await sfoglia(1);
  const dopoMuro = await dove();
  const scattato = await p.evaluate(() => !!document.querySelector('#vista .segmenti.sez-nav.sez-muro'));
  ok('oltre l’ultima non si va', dopoMuro === ultimo, 'fermo su ' + ultimo);
  ok('ma il muro si vede (la riga fa uno scatto)', scattato, scattato ? 'classe sez-muro messa' : 'nessun segno');

  console.log('\nIL GESTO NON PARTE — è la parte che conta');
  async function fermo(nome, fai, prepara) {
    if (prepara) { await prepara(); await p.waitForTimeout(400); }
    const prima = await dove();
    await fai();
    const dopo = await dove();
    ok(nome, prima === dopo, prima === dopo ? '' : prima + ' → ' + dopo);
    return prima === dopo;
  }

  await apri('oggi');
  const yb = await puntoBuono();
  ok('c’è un punto della pagina che il gesto accetta', yb > 0, 'y=' + yb);
  await fermo('scorrendo in verticale', () => dito(200, yb + 100, 200, yb - 200, 200));
  await fermo('in diagonale, con la discesa che vince', () => dito(200, yb + 100, 110, yb - 170, 200));
  await fermo('un tocco fermo, senza spostamento', () => dito(200, yb, 202, yb + 1, 120));
  await fermo('un trascinamento lento e lunghissimo (più di un secondo)',
    () => dito(200, yb, 60, yb, 1600, 16));
  await fermo('partendo dal bordo sinistro (lì il browser fa indietro)',
    () => dito(8, yb, 200, yb, 160));
  await fermo('partendo dal bordo destro', () => dito(382, yb, 200, yb, 160));
  await fermo('sulla riga delle linguette stessa', async () => {
    const y = await p.evaluate(() => {
      const bar = document.querySelector('#vista .segmenti.sez-nav');
      const r = bar.getBoundingClientRect(); return r.top + r.height / 2;
    });
    await dito(200, y, 90, y, 160);
  });

  /* col mouse: un trascinamento è una selezione di testo */
  await fermo('col mouse, che trascinando seleziona il testo', async () => {
    await p.mouse.move(200, yb); await p.mouse.down();
    for (let i = 1; i <= 8; i++) await p.mouse.move(200 - 14 * i, yb);
    await p.mouse.up(); await p.waitForTimeout(400);
  });

  /* con un foglio aperto */
  await apri('inbox', () => {
    const b = [...document.querySelectorAll('.segmenti button')].find(x => /da fare/i.test(x.textContent));
    if (b) b.click();
  });
  await p.evaluate(() => { const x = document.querySelector('[data-bkapri]'); if (x) x.click(); });
  await p.waitForTimeout(900);
  const foglioSu = await p.evaluate(() => !document.getElementById('sheet-overlay').hidden);
  ok('il foglio si è aperto davvero (se no la prova qui sotto è muta)', foglioSu, foglioSu ? 'aperto' : 'chiuso');
  await fermo('con un foglio aperto sopra', () => dito(200, 500, 90, 500, 160));
  await p.keyboard.press('Escape'); await p.waitForTimeout(600);

  /* dentro qualcosa che scorre già di lato per conto suo */
  await apri('giornata', () => { const x = document.querySelector('[data-orizz="settimana"]'); if (x) x.click(); });
  const scorreDavvero = await p.evaluate(() => {
    const c = document.querySelector('.wk-cols');
    return !!c && c.scrollWidth > c.clientWidth + 2;
  });
  ok('le colonne della settimana scorrono davvero di lato (se no la prova qui sotto è muta)',
    scorreDavvero, scorreDavvero ? 'sì' : 'no: allarga la finestra o aggiungi giorni');
  await fermo('dentro le colonne della settimana, che scorrono già di loro', async () => {
    const y = await p.evaluate(() => {
      const c = document.querySelector('.wk-cols'); const r = c.getBoundingClientRect();
      return r.top + Math.min(r.height / 2, 200);
    });
    await dito(200, y, 90, y, 160);
  });
  /* su un blocco che si trascina */
  const cB = await p.evaluate(() => {
    const b = document.querySelector('.tl-grid-mini [data-drag-az]');
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  ok('c’è un blocco che si trascina su cui provare', !!cB, cB ? 'trovato' : 'nessuno');
  if (cB) await fermo('su un blocco che si trascina', () => dito(cB.x, cB.y, cB.x - 110, cB.y, 160));

  /* su un campo: «Rituali» ne ha sempre uno */
  await apri('rituali');
  const cC = await p.evaluate(() => {
    const i = [...document.querySelectorAll('#vista input, #vista textarea')]
      .find(x => !x.hidden && x.type !== 'checkbox' && x.type !== 'radio' && x.offsetWidth > 40);
    if (!i) return null;
    i.scrollIntoView({ block: 'center' });
    const r = i.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await p.waitForTimeout(400);
  ok('c’è un campo su cui provare', !!cC, cC ? 'trovato' : 'nessuno');
  if (cC) await fermo('dentro un campo di testo', () => dito(cC.x, cC.y, cC.x - 110, cC.y, 160));

  console.log('\nSI PUÒ SPEGNERE');
  await p.evaluate(() => { const s = LM.load(); s.profilo.scorri = 'no'; LM.save(); });
  await apri('oggi');
  await fermo('da spento, il gesto non fa più niente', async () => { await sfoglia(1); });
  await p.evaluate(() => { const s = LM.load(); s.profilo.scorri = 'si'; LM.save(); });
  await apri('oggi');
  const pr = await dove();
  await sfoglia(1);
  ok('e riacceso torna a funzionare', (await dove()) !== pr, pr + ' → ' + (await dove()));
  ok('la scelta si salva davvero',
    await p.evaluate(() => LM.load().profilo.scorri === 'si'), '');

  ok('nessun errore in pagina', errori.length === 0, errori.slice(0, 2).join(' · '));

  await b.close(); srv.close();
  console.log(fail ? '\n>>> ' + fail + ' GUAI' : '\n>>> TUTTO A POSTO');
  process.exit(fail ? 1 : 0);
})();
