/* QUANDO LO SPAZIO FINISCE — la scala che nessuno aveva mai salito.

   `save()` in `dati.ts` ha una scala di emergenza per il giorno in cui
   `localStorage` dice basta. Quattro gradini, in quest'ordine:

     1. si butta quello che si può rifare: i punti a cui tornare, che sono
        una copia intera dello stato ciascuno — la cosa più voluminosa che
        ci sia;
     2. poi le copie di sicurezza più vecchie, tenendone tre;
     3. poi, ma DICENDOLO, le righe vecchie del diario oltre le ultime 400,
        e la riga che le sostituisce racconta quante ne sono sparite;
     4. e se niente basta, si grida: `lm:errore-salvataggio`, una volta sola.

   È il codice che decide se perdi quello che hai scritto, e gira soltanto
   nel giorno peggiore. Fino a oggi non l'aveva mai provato nessuno: una
   scala di emergenza che non si è mai salita è una promessa, non una scala.

   Si finge il pieno invece di riempirlo davvero: riempire cinque megabyte di
   localStorage per davvero vuol dire una prova da minuti, e per giunta che
   dipende da quanto spazio dà il browser quel giorno.

   Si lancia con: node prove/spazio.js   (CHROMIUM=… se serve) */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { SERVITO: RADICE } = require('./comune/dove');
const PORTA = 8841;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.map': 'application/json' };

let guai = 0;
const ok = (nome, cond, det) => { if (!cond) guai++; console.log('  ' + (cond ? 'ok  ' : 'KO  ') + nome + (det ? '  → ' + det : '')); };

/* IL PIENO, FINTO MA FEDELE NEL PUNTO CHE CONTA: `setItem` sulla chiave
   grossa alza un QuotaExceededError, esattamente come farebbe il browser,
   e tutto il resto continua a funzionare — perché la scala di emergenza
   deve poter SCRIVERE le chiavi piccole mentre butta via le grandi. */
const FINGI_PIENO = () => {
  const vero = Storage.prototype.setItem;
  window.__scritture = [];
  window.__pieno = 0;            /* quante volte ancora deve dire «pieno» */
  Storage.prototype.setItem = function (k, v) {
    window.__scritture.push(k);
    if (k === 'lifemax.v2' && window.__pieno !== 0) {
      if (window.__pieno > 0) window.__pieno--;
      const e = new Error('pieno');
      e.name = 'QuotaExceededError';
      throw e;
    }
    return vero.call(this, k, v);
  };
};

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

  const apri = async () => {
    const ctx = await b.newContext({ viewport: { width: 390, height: 900 } });
    await ctx.addInitScript(FINGI_PIENO);
    const p = await ctx.newPage();
    p.on('pageerror', (e) => { guai++; console.log('  KO  errore in pagina  → ' + e); });
    await p.goto('http://localhost:' + PORTA + '/index.html');
    await p.waitForFunction(() => !!window.LM);
    await p.evaluate(() => {
      localStorage.clear(); LM.seedDemo();
      /* QUALCOSA DA BUTTARE A OGNI GRADINO, e va creato come lo crea l'app:
         un punto a cui tornare nasce da un salvataggio che CAMBIA qualcosa
         (`segnaPunto` scarta i salvataggi a vuoto), e una copia di sicurezza
         non si duplica se i dati sono identici alla precedente. Chiamarli in
         un ciclo senza toccare niente in mezzo ne produce uno e basta — ed è
         il primo modo in cui questa prova ha mentito a se stessa. */
      for (let i = 0; i < 6; i++) {
        LM.cattura('roba da buttare ' + i);
        LM.backup('prova ' + i);
      }
    });
    return p;
  };

  console.log('\nPRIMO GRADINO: SI BUTTANO I PUNTI A CUI TORNARE');
  {
    const p = await apri();
    const prima = await p.evaluate(() => LM.puntiDiRitorno().length);
    /* un pieno solo: al secondo tentativo, senza i punti, deve passare */
    const esito = await p.evaluate(() => {
      window.__pieno = 1;
      window.__urlo = 0;
      document.addEventListener('lm:errore-salvataggio', () => { window.__urlo++; });
      LM.cattura('una cosa scritta mentre lo spazio finiva');
      return {
        /* i punti SCRITTI in localStorage: quello che `save()` rifà alla fine
           per la modifica di adesso non conta, perché non è roba vecchia */
        vecchi: Object.keys(localStorage).filter((k) => k.indexOf('lifemax.annulla.p.') === 0).length,
        urlo: window.__urlo,
        salvata: (JSON.parse(localStorage.getItem('lifemax.v2') || '{}').inbox || [])
          .some((x) => /spazio finiva/.test(x.testo || ''))
      };
    });
    ok('prima c’erano dei punti a cui tornare', prima > 1, prima + '');
    ok('dopo il pieno ne resta al massimo quello di adesso', esito.vecchi <= 1,
      esito.vecchi + ' rimasti, erano ' + prima);
    ok('e quello che stavi scrivendo è finito nel salvataggio', esito.salvata);
    ok('senza gridare: al primo gradino il guaio è rientrato', esito.urlo === 0, esito.urlo + ' urla');
    await p.close();
  }

  console.log('\nSECONDO GRADINO: SI SFOLTISCONO LE COPIE DI SICUREZZA');
  {
    const p = await apri();
    const prima = await p.evaluate(() => LM.listBackups().length);
    const esito = await p.evaluate(() => {
      window.__pieno = 2;        /* il primo gradino non basta */
      window.__urlo = 0;
      document.addEventListener('lm:errore-salvataggio', () => { window.__urlo++; });
      LM.cattura('un’altra cosa');
      return { copie: LM.listBackups().length, urlo: window.__urlo,
        salvata: (JSON.parse(localStorage.getItem('lifemax.v2') || '{}').inbox || [])
          .some((x) => /un’altra cosa/.test(x.testo || '')) };
    });
    ok('prima le copie erano più di tre', prima > 3, prima + '');
    ok('dopo ne restano tre', esito.copie === 3, esito.copie + '');
    ok('e la cosa scritta è salva', esito.salvata);
    ok('e ancora nessuna urla', esito.urlo === 0, esito.urlo + ' urla');
    await p.close();
  }

  console.log('\nTERZO GRADINO: IL DIARIO SI ACCORCIA, MA LO DICE');
  {
    const p = await apri();
    const esito = await p.evaluate(() => {
      /* un diario lungo: il gradino scatta solo oltre le 400 righe */
      const s = LM.load();
      for (let i = 0; i < 500; i++) s.registro.push({ ts: Date.now() - i * 1000, cat: 'prova', testo: 'riga vecchia ' + i });
      LM.save();
      window.__pieno = 3;        /* i primi due gradini non bastano */
      window.__urlo = 0;
      document.addEventListener('lm:errore-salvataggio', () => { window.__urlo++; });
      LM.cattura('la terza cosa');
      const reg = LM.load().registro || [];
      return {
        righe: reg.length,
        loDice: reg.some((x) => /Spazio esaurito/.test(x.testo || '')),
        importante: reg.some((x) => /Spazio esaurito/.test(x.testo || '') && x.imp === true),
        urlo: window.__urlo
      };
    });
    ok('il diario è stato accorciato', esito.righe <= 401, esito.righe + ' righe');
    ok('e c’è scritto che è successo', esito.loDice);
    ok('segnato come importante, così non sparisce fra le righe', esito.importante);
    ok('e non si è gridato: il salvataggio è rientrato', esito.urlo === 0, esito.urlo + ' urla');
    await p.close();
  }

  console.log('\nQUARTO GRADINO: SE NIENTE BASTA, SI GRIDA — UNA VOLTA SOLA');
  {
    const p = await apri();
    const esito = await p.evaluate(() => {
      window.__pieno = -1;       /* pieno per sempre */
      window.__urlo = 0;
      document.addEventListener('lm:errore-salvataggio', () => { window.__urlo++; });
      LM.cattura('la prima che non entra');
      LM.cattura('la seconda che non entra');
      LM.cattura('la terza che non entra');
      return { urlo: window.__urlo, inMemoria: LM.load().inbox.filter((x) => /che non entra/.test(x.testo || '')).length };
    });
    ok('si grida', esito.urlo >= 1, esito.urlo + ' urla');
    ok('una volta sola, non a ogni tasto', esito.urlo === 1, esito.urlo + ' urla per tre salvataggi');
    ok('e intanto quello che hai scritto resta in memoria, non sparisce dallo schermo',
      esito.inMemoria === 3, esito.inMemoria + ' di 3');
    await p.close();
  }

  console.log('\nE QUANDO LO SPAZIO TORNA, SI RICOMINCIA A GRIDARE');
  {
    const p = await apri();
    const esito = await p.evaluate(() => {
      window.__pieno = -1; window.__urlo = 0;
      document.addEventListener('lm:errore-salvataggio', () => { window.__urlo++; });
      LM.cattura('a'); const primo = window.__urlo;
      window.__pieno = 0;        /* torna lo spazio */
      LM.cattura('b');
      window.__pieno = -1;       /* e finisce di nuovo */
      LM.cattura('c');
      return { primo: primo, totale: window.__urlo };
    });
    ok('la prima volta grida', esito.primo === 1, esito.primo + '');
    ok('e dopo un salvataggio riuscito torna a poterlo dire', esito.totale === 2,
      esito.totale + ' urla in tutto');
    await p.close();
  }

  await b.close(); srv.close();
  console.log(guai ? '\n>>> ' + guai + (guai > 1 ? ' PROBLEMI' : ' PROBLEMA') : '\n>>> TUTTO A POSTO');
  process.exit(guai ? 1 : 0);
})();
