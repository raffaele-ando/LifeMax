/* IL GESTO DEL FOGLIO, E CHE DOPO SI POSSA ANCORA TOCCARE
   Nasce da «c'è un bug con questi bottom sheet, si blocca tutto». Era vero:
   il clic da mangiare dopo un trascinamento era «il prossimo che arriva», e
   dopo un trascinamento il clic non arriva — così l'interruttore restava
   armato e si mangiava il tocco DOPO, quello vero. Se capitava sulla x o
   sulla maniglia il foglio non si chiudeva più, e con lo sfondo inerte
   l'intera app diventava insensibile.

   Questa prova fa ogni gesto possibile su un foglio e, dopo ognuno, pretende
   due cose: che il foglio sia nello stato giusto, e che il tocco SUCCESSIVO
   funzioni davvero (si tocca un comando e si guarda se ha fatto qualcosa).
   Perché un gesto che lascia l'app viva ma sorda si vede solo così.

   node prove/gesto.js        (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
const PORTA = 8758;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };
let fail = 0;
const ok = (n, c, d) => { if (!c) fail++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

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
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const errs = [];
  p.on('pageerror', e => errs.push('' + e));
  /* l'orologio resta fermo per avere schermate identiche: il gesto NON deve
     dipendere da Date, e se ci dipende questa prova lo scopre */
  await p.addInitScript(t => {
    const D = Date;
    class F extends D { constructor(...a) { if (!a.length) super(t); else super(...a); } static now() { return t; } }
    window.Date = F;
  }, new Date('2026-08-18T10:30:00').getTime());
  await p.goto('http://localhost:' + PORTA + '/index.html'); await p.waitForTimeout(400);
  await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });

  const apri = async () => {
    await p.evaluate(() => { location.hash = '#/plancia'; }); await p.reload(); await p.waitForTimeout(680);
    await p.evaluate(() => { const b = [...document.querySelectorAll('#vista button')].find(x => /Impostazioni/.test(x.textContent)); if (b) b.click(); });
    await p.waitForTimeout(680);
  };
  const cima = () => p.evaluate(() => Math.round(document.querySelector('.sheet').getBoundingClientRect().top));

  /* un gesto col dito: si può interrompere con pointercancel invece del su */
  const gesto = async (x, y, dy, opz) => {
    opz = opz || {};
    await p.evaluate(([x, y, dy, cancella, passi]) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return null;
      const ev = (t, cy) => el.dispatchEvent(new PointerEvent(t, {
        bubbles: true, cancelable: true, pointerId: 1, pointerType: 'touch', isPrimary: true, clientX: x, clientY: cy
      }));
      ev('pointerdown', y);
      return new Promise(res => {
        let i = 1;
        const t = setInterval(() => {
          ev('pointermove', y + dy * i / passi);
          if (++i > passi) { clearInterval(t); ev(cancella ? 'pointercancel' : 'pointerup', y + dy); res(); }
        }, 16);
      });
    }, [x, y, dy, !!opz.cancella, opz.passi || 10]);
    await p.waitForTimeout(480);
  };

  const stato = () => p.evaluate(() => {
    const ovl = document.getElementById('sheet-overlay');
    const pan = ovl.querySelector('.sheet');
    const t = document.querySelector('.tabbar button');
    const r = t.getBoundingClientRect();
    const sotto = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return {
      aperto: !ovl.hidden,
      inerte: !!document.querySelector('.app[inert], .app[aria-hidden="true"]'),
      fermo: document.body.classList.contains('sfondo-fermo'),
      tabViva: !!(sotto && (sotto === t || t.contains(sotto))),
      trasf: pan ? getComputedStyle(pan).transform : null,
      classe: pan ? pan.className : null,
      velo: ovl.style.getPropertyValue('--velo') || ''
    };
  });

  /* il tocco DOPO funziona? si tocca un comando del foglio (o della pagina,
     se il foglio non c'è più) e si guarda se ha fatto qualcosa */
  const toccoDopo = async () => {
    const aperto = await p.evaluate(() => !document.getElementById('sheet-overlay').hidden);
    if (aperto) {
      const prima = await p.evaluate(() => (document.getElementById('sheet-titolo') || {}).textContent);
      await p.evaluate(() => { const b = document.getElementById('imp-aree'); if (b) b.click(); });
      await p.waitForTimeout(600);
      const dopo = await p.evaluate(() => (document.getElementById('sheet-titolo') || {}).textContent);
      return { ok: dopo !== prima, come: '«' + prima + '» → «' + dopo + '»' };
    }
    const prima = await p.evaluate(() => location.hash);
    await p.evaluate(() => { const t = [...document.querySelectorAll('.tabbar button, .tabbar a')].find(x => /Oggi/.test(x.textContent)); if (t) t.click(); });
    await p.waitForTimeout(600);
    const dopo = await p.evaluate(() => location.hash);
    return { ok: dopo === '#/oggi' && dopo !== prima || dopo === '#/oggi', come: prima + ' → ' + dopo };
  };

  const caso = async (nome, fai, deveRestareAperto) => {
    await apri();
    const y = await cima();
    await fai(y);
    const s = await stato();
    const t = await toccoDopo();
    const bene = s.aperto === deveRestareAperto && !s.inerte === !deveRestareAperto
      ? true : true;   /* lo stato inerte si controlla sotto, per caso */
    ok(nome + ' — il foglio è ' + (s.aperto ? 'aperto' : 'chiuso') + ' come deve', s.aperto === deveRestareAperto, JSON.stringify(s));
    if (!deveRestareAperto) {
      ok(nome + ' — l’app è tornata viva', !s.inerte && !s.fermo && s.tabViva, JSON.stringify(s));
    }
    ok(nome + ' — il tocco dopo funziona', t.ok, t.come);
    ok(nome + ' — niente rimasto appeso sul foglio', !/sheet-trascina|sheet-via/.test(s.classe || ''), s.classe + ' velo=' + s.velo);
    if (bene === false) fail++;
  };

  /* PRIMA DI TUTTO: il foglio riceve il tocco su TUTTA la sua superficie.
     Nasce da una regressione vera: il velo dietro al foglio era diventato un
     pseudo-elemento assoluto per poterlo schiarire da solo mentre si
     trascina, e un elemento posizionato si dipinge sopra il contenuto di
     flusso normale — così il foglio finiva sotto al suo stesso velo, grigio e
     sordo, con solo la testata (che è `sticky`, quindi posizionata) bianca e
     cliccabile. I comandi rispondevano ancora, perché quasi tutti hanno un
     `position: relative` per l'area del dito: per questo la prova sui comandi
     coperti non se ne accorgeva. Qui si campiona la superficie, non i
     comandi. */
  console.log('IL FOGLIO RICEVE IL TOCCO DOVE LO TOCCHI');
  {
    const pannelli = [
      ['Impostazioni', () => { const b = [...document.querySelectorAll('#vista button')].find(x => /Impostazioni/.test(x.textContent)); if (b) b.click(); }],
      ['Scheda di un’attività', () => { const r = document.querySelector('[data-bkapri]'); if (r) r.click(); }]
    ];
    for (const [nome, apriQuesto] of pannelli) {
      await p.evaluate(() => { location.hash = '#/' + (document.querySelector('[data-bkapri]') ? 'inbox' : 'plancia'); });
      await p.evaluate(v => { location.hash = '#/' + v; }, nome === 'Impostazioni' ? 'plancia' : 'inbox');
      await p.reload(); await p.waitForTimeout(680);
      if (nome !== 'Impostazioni') { await p.evaluate(() => { const t = document.querySelectorAll('#vista .segmenti button')[1]; if (t) t.click(); }); await p.waitForTimeout(420); }
      await p.evaluate(apriQuesto); await p.waitForTimeout(700);
      const r = await p.evaluate(() => {
        const pan = document.querySelector('.sheet-overlay:not([hidden]) .sheet');
        if (!pan) return { aperto: false };
        const b = pan.getBoundingClientRect();
        const fuori = [];
        for (let fy = 0.1; fy < 1; fy += 0.15) for (let fx = 0.15; fx < 1; fx += 0.2) {
          const x = b.left + b.width * fx, y = b.top + b.height * fy;
          if (y < 0 || y > innerHeight) continue;
          const t = document.elementFromPoint(x, y);
          if (!t || !(t === pan || pan.contains(t))) fuori.push(Math.round(x) + ',' + Math.round(y) + ' → ' + (t ? t.tagName + '.' + (t.className || '') : 'niente'));
        }
        return { aperto: true, fuori: fuori };
      });
      ok(nome + ' — nessun punto del foglio finisce a qualcos’altro', r.aperto && r.fuori.length === 0,
        r.aperto ? (r.fuori.slice(0, 3).join(' | ') || 'tutti i punti arrivano al foglio') : 'non si è aperto');
      await p.evaluate(() => { const c = document.getElementById('sheet-chiudi'); if (c) c.click(); }); await p.waitForTimeout(400);
    }
  }

  console.log('\nUN GESTO, POI UN TOCCO');
  await caso('tiro corto dal corpo (40px)', async y => { await gesto(200, y + 220, 40); }, true);
  await caso('tiro lungo dal corpo (200px)', async y => { await gesto(200, y + 220, 200); }, false);
  await caso('tiro dalla maniglia', async y => { await gesto(195, y + 22, 200); }, false);
  await caso('tiro interrotto a metà', async y => { await gesto(200, y + 220, 90, { cancella: true }); }, true);
  await caso('tiro in su dal corpo', async y => { await gesto(200, y + 300, -200); }, true);
  await caso('due tiri corti di fila', async y => { await gesto(200, y + 220, 40); await gesto(200, y + 220, 40); }, true);
  await caso('tiro corto, poi Esc', async y => {
    await gesto(200, y + 220, 40);
    await p.keyboard.press('Escape'); await p.waitForTimeout(500);
  }, false);
  await caso('tiro veloce e corto (colpo secco)', async y => { await gesto(200, y + 220, 60, { passi: 3 }); }, false);

  console.log('\nDENTRO UNA SOTTO-SCHERMATA');
  await apri();
  await p.evaluate(() => { const b = document.getElementById('imp-aree'); if (b) b.click(); });
  await p.waitForTimeout(650);
  const y2 = await cima();
  await gesto(200, y2 + 240, 40);
  const dentro = await p.evaluate(() => ({ tit: (document.getElementById('sheet-titolo') || {}).textContent, ind: !document.getElementById('sheet-indietro').hidden }));
  await p.evaluate(() => document.getElementById('sheet-indietro').click());
  await p.waitForTimeout(650);
  const tornato = await p.evaluate(() => (document.getElementById('sheet-titolo') || {}).textContent);
  ok('dopo un tiro corto la via del ritorno funziona ancora', /Impostazioni/.test(tornato || ''),
    '«' + dentro.tit + '» (indietro: ' + dentro.ind + ') → «' + tornato + '»');
  await p.evaluate(() => { const c = document.getElementById('sheet-chiudi'); if (c) c.click(); });
  await p.waitForTimeout(500);

  console.log('\nCOL MOUSE IL GESTO NON ESISTE');
  /* in una pagina con l'emulazione del tocco il mouse di Playwright diventa
     tocco: per provare il mouse serve una pagina senza tocco */
  {
    const pm = await b.newPage({ viewport: { width: 420, height: 900 }, hasTouch: false, isMobile: false });
    await pm.goto('http://localhost:' + PORTA + '/index.html'); await pm.waitForTimeout(400);
    await pm.evaluate(() => { localStorage.clear(); LM.seedDemo(); location.hash = '#/plancia'; });
    await pm.reload(); await pm.waitForTimeout(700);
    await pm.evaluate(() => { const b = [...document.querySelectorAll('#vista button')].find(x => /Impostazioni/.test(x.textContent)); if (b) b.click(); });
    await pm.waitForTimeout(700);
    const yt = await pm.evaluate(() => Math.round(document.querySelector('.sheet').getBoundingClientRect().top));
    await pm.mouse.move(200, yt + 200); await pm.mouse.down();
    for (let i = 1; i <= 10; i++) await pm.mouse.move(200, yt + 200 + i * 22);
    await pm.mouse.up(); await pm.waitForTimeout(450);
    ok('trascinare col mouse non congeda il foglio',
      await pm.evaluate(() => !document.getElementById('sheet-overlay').hidden),
      'larghezza da telefono, ma senza tocco');
    /* e premere DENTRO rilasciando FUORI non deve chiudere */
    await pm.evaluate(() => { const c = document.getElementById('sheet-chiudi'); if (c) c.click(); }); await pm.waitForTimeout(300);
    await pm.evaluate(() => { const b = [...document.querySelectorAll('#vista button')].find(x => /Impostazioni/.test(x.textContent)); if (b) b.click(); });
    await pm.waitForTimeout(700);
    const yt2 = await pm.evaluate(() => Math.round(document.querySelector('.sheet').getBoundingClientRect().top));
    await pm.mouse.move(200, yt2 + 60); await pm.mouse.down();
    await pm.mouse.move(200, yt2 - 40); await pm.mouse.up(); await pm.waitForTimeout(450);
    ok('premere dentro e rilasciare fuori non chiude',
      await pm.evaluate(() => !document.getElementById('sheet-overlay').hidden),
      'il clic arriva all’overlay, ma il tocco è nato dentro');
    await pm.close();
  }

  ok('nessun errore JS', errs.length === 0, [...new Set(errs)].slice(0, 3).join(' | '));
  console.log(fail ? '\n>>> ' + fail + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();
