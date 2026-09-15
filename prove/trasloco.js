/* PORTARSI VIA I PROPRI DATI, E RIPORTARSELI INDIETRO.

   `Impostazioni → Esporta` scrive un file, `Importa da un file` lo rilegge.
   È la sola strada che non passa da nessun server, da nessun account e da
   nessuna rete: è quella che resta quando tutto il resto non funziona — il
   telefono nuovo, l'account che non entra, il cloud che non risponde. E
   quindi è la strada che DEVE funzionare, e l'unica che nessuna prova
   guardava.

   Quello che si pretende, in ordine di gravità:

     · il giro completo non perde niente. Si esporta, si azzera, si
       reimporta, e quello che c'era c'è. Se questa cade, il file di backup
       è carta straccia e nessuno lo sa finché non serve.
     · importare UNISCE, non sostituisce. È la stessa regola del cloud, e per
       la stessa ragione: un file è una copia parziale della stessa vita, e
       sostituire vorrebbe dire buttare quello che nel file non c'è. La copia
       di sicurezza presa prima dell'import resta comunque, per chi voleva
       davvero ripartire dal file.
     · un file sbagliato viene RIFIUTATO, con un motivo leggibile, senza
       toccare niente. Un import che accetta spazzatura e la mescola ai dati
       veri è peggio di un import che non funziona.
     · e prima di toccare qualcosa si mette da parte una copia.

   Si lancia con: node prove/trasloco.js   (CHROMIUM=… se serve) */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { SERVITO: RADICE } = require('./comune/dove');
const PORTA = 8843;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.map': 'application/json' };

let guai = 0;
const ok = (nome, cond, det) => { if (!cond) guai++; console.log('  ' + (cond ? 'ok  ' : 'KO  ') + nome + (det ? '  → ' + det : '')); };

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
  const p = await b.newPage({ viewport: { width: 390, height: 900 } });
  p.on('pageerror', (e) => { guai++; console.log('  KO  errore in pagina  → ' + e); });
  await p.goto('http://localhost:' + PORTA + '/index.html');
  await p.waitForFunction(() => !!window.LM);
  await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });

  console.log('\nIL FILE CHE ESCE È LEGGIBILE E DICE DA DOVE VIENE');
  const fuori = await p.evaluate(() => LM.exportJson());
  let doc = null;
  try { doc = JSON.parse(fuori); } catch (e) { /* lo dice il controllo qui sotto */ }
  ok('è JSON valido', !!doc, doc ? Math.round(fuori.length / 1024) + ' kB' : 'non si rilegge');
  ok('dice di che app è', doc && doc.app === 'LifeMax', doc ? String(doc.app) : '—');
  ok('e porta lo stato dentro a «stato»', !!(doc && doc.stato && Array.isArray(doc.stato.azioni)));
  ok('è indentato, così si può aprire e guardare', /\n  "/.test(fuori));

  console.log('\nIL GIRO COMPLETO, SU UN DISPOSITIVO NUOVO, NON PERDE NIENTE');
  {
    /* «Come un telefono nuovo» si finge svuotando il deposito, non con
       `reset()`: azzerare NON è la stessa cosa che non avere mai avuto
       niente. `reset()` scrive l'istante dell'azzeramento, e la fusione
       taglia apposta tutto quello che è più vecchio — se no il cloud si
       rimangerebbe l'azzeramento alla prima sincronizzazione. Il caso vero
       del backup è il telefono nuovo, e questo è il telefono nuovo. */
    const esito = await p.evaluate((testo) => {
      const prima = LM.ricchezza(LM.snapshot());
      localStorage.clear();
      location.reload();
      return prima;
    }, fuori);
    await p.waitForFunction(() => !!window.LM);
    await p.waitForTimeout(300);
    const dopo = await p.evaluate((testo) => {
      const vuoto = LM.ricchezza(LM.snapshot());
      const r = LM.importJson(testo);
      return { vuoto: vuoto, dopo: LM.ricchezza(LM.snapshot()), r: r };
    }, fuori);
    ok('prima c’era roba', esito > 20, esito + ' elementi');
    ok('sul dispositivo nuovo non c’è niente', dopo.vuoto < esito, dopo.vuoto + ' elementi');
    ok('l’import dice di essere riuscito', dopo.r && dopo.r.ok === true, JSON.stringify(dopo.r));
    ok('e torna tutto quello che c’era', dopo.dopo >= esito,
      dopo.dopo + ' contro ' + esito + ' di partenza');
    ok('e non ha tagliato niente, perché non c’era nessun azzeramento',
      dopo.r && dopo.r.tagliati === 0, String(dopo.r && dopo.r.tagliati));
    await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  }

  console.log('\nDOPO UN «AZZERA TUTTO», IL FILE VECCHIO ENTRA SOLO IN PARTE — E LO DICE');
  {
    /* QUESTO È IL CASO CHE L'APP RACCONTAVA MALE. L'azzeramento dichiarato
       tiene fuori tutto quello che è più vecchio di lui, ed è giusto; ma il
       messaggio diceva «Dati importati (322 elementi)» contando quelli del
       FILE, mentre ne erano entrati 91. Adesso `importJson` conta le righe
       che il taglio prenderà, e chi chiama lo dice a chi guarda. */
    const esito = await p.evaluate((testo) => {
      const prima = LM.ricchezza(LM.snapshot());
      LM.reset();
      const r = LM.importJson(testo);
      return { prima: prima, dopo: LM.ricchezza(LM.snapshot()), r: r,
        diario: (LM.load().registro || []).filter((x) => /importati da file/.test(x.testo || '')).map((x) => x.testo) };
    }, fuori);
    ok('parecchia roba è rimasta fuori', esito.dopo < esito.prima / 2,
      esito.dopo + ' contro ' + esito.prima);
    ok('e l’import lo dice, con quante righe', esito.r && esito.r.tagliati > 0,
      'tagliate ' + (esito.r && esito.r.tagliati));
    ok('il numero tagliato è credibile, non tutto e non niente',
      esito.r && esito.r.tagliati > 10 && esito.r.tagliati <= esito.prima,
      String(esito.r && esito.r.tagliati) + ' su ' + esito.prima);
    ok('e resta scritto anche nel diario', esito.diario.some((t) => /non sono rientrate/.test(t)),
      esito.diario.slice(-1)[0] || 'niente');
    await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  }

  console.log('\nIMPORTARE UNISCE, NON SOSTITUISCE');
  {
    const esito = await p.evaluate((testo) => {
      LM.cattura('una cosa che nel file NON c’è');
      const prima = LM.load().inbox.length;
      LM.importJson(testo);
      const s = LM.load();
      return {
        laMia: s.inbox.some((x) => /nel file NON c/.test(x.testo || '')),
        quante: s.inbox.length, prima: prima
      };
    }, fuori);
    ok('quello che avevo solo io resta', esito.laMia);
    ok('e non è stato sostituito dal file', esito.quante >= esito.prima,
      esito.quante + ' contro ' + esito.prima);
  }

  console.log('\nPRIMA DI TOCCARE, UNA COPIA');
  {
    const esito = await p.evaluate((testo) => {
      const prima = LM.listBackups().length;
      LM.importJson(testo);
      const b = LM.listBackups();
      return { prima: prima, dopo: b.length, motivo: (b[0] || {}).motivo || '' };
    }, fuori);
    ok('la copia di sicurezza c’è', esito.dopo > esito.prima, esito.prima + ' → ' + esito.dopo);
    ok('e dice perché è stata presa', /import/.test(esito.motivo), esito.motivo);
  }

  console.log('\nUN FILE SBAGLIATO SI RIFIUTA, E LO DICE');
  {
    const casi = [
      ['non è JSON', 'questo non è un file, è una frase'],
      ['JSON ma non è LifeMax', '{"qualcosa":"altro"}'],
      ['vuoto', ''],
      ['un elenco invece di un oggetto', '[1,2,3]'],
      ['lo stato c’è ma è storto', '{"stato":{"azioni":"non un elenco"}}']
    ];
    for (const [nome, testo] of casi) {
      const esito = await p.evaluate((t) => {
        const prima = LM.ricchezza(LM.snapshot());
        const r = LM.importJson(t);
        return { r: r, uguale: LM.ricchezza(LM.snapshot()) === prima };
      }, testo);
      ok(nome + ': rifiutato', esito.r && esito.r.ok === false, JSON.stringify(esito.r));
      ok(nome + ': con un motivo che si legge',
        !!(esito.r && esito.r.err && esito.r.err.length > 15 && !/undefined|\[object/.test(esito.r.err)),
        esito.r ? esito.r.err : '—');
      ok(nome + ': e non ha toccato niente', esito.uguale);
    }
  }

  console.log('\nLO STATO NUDO SI ACCETTA LO STESSO');
  {
    /* chi ha un backup vecchio, o lo copia a mano dal registro tecnico, ha
       in mano lo stato senza l'involucro: rifiutarlo sarebbe pedanteria */
    const esito = await p.evaluate((testo) => {
      const nudo = JSON.stringify(JSON.parse(testo).stato);
      return LM.importJson(nudo);
    }, fuori);
    ok('un file con dentro solo lo stato passa', esito && esito.ok === true, JSON.stringify(esito));
  }

  await b.close(); srv.close();
  console.log(guai ? '\n>>> ' + guai + (guai > 1 ? ' PROBLEMI' : ' PROBLEMA') : '\n>>> TUTTO A POSTO');
  process.exit(guai ? 1 : 0);
})();
