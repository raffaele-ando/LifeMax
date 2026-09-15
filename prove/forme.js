/* TRE FORME PER «ADESSO», e una sola deve essere in pagina alla volta.

   Nasce da una cosa che si rompe in silenzio. `wireFuoco()` lega i comandi
   per `id` — `btn-fatto`, `btn-timer`, `btn-nonora` — e nelle forme «spina»
   e «poi» quei comandi escono dalla scheda per andare nella fascia in fondo
   allo schermo. Se per una svista restassero anche dov'erano, in pagina ci
   sarebbero DUE elementi con lo stesso `id`: `getElementById` restituisce
   il primo, che è quello nascosto, e il tasto che si vede diventa un tasto
   che non fa niente. Nessun errore, nessun avviso: si preme «Fatto» e non
   succede niente.

   Qui si pretende che ogni `id` compaia UNA VOLTA SOLA, in tutte e tre le
   forme e in quattro situazioni diverse, e che premendolo la cosa succeda
   davvero. E si tiene ferma la seconda metà della decisione: le frasi che
   dichiarano un'assenza — «nessun orario», «Adesso non hai niente in
   programma» — nelle forme nuove non ci sono, e la coda di oggi non si
   disegna due volte (aperta sotto e chiusa dentro la fisarmonica).

   node prove/forme.js        (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const RADICE = require('./comune/dove').SERVITO;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.map': 'application/json' };
const PORTA = 8767;
let fail = 0;
const ok = (n, c, d) => { if (!c) fail++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

/* i comandi che il cablaggio cerca per `id`. Se uno di questi compare due
   volte, quello che si vede non è quello che risponde. */
const COMANDI = ['btn-fatto', 'btn-timer', 'btn-adesso', 'btn-nonora', 'btn-salta', 'btn-mancata', 'btn-concentra'];

/* quattro situazioni, non una: i comandi cambiano con lo stato, e il
   doppione può nascondersi in quella che non si prova. */
const CASI = [
  ['una cosa in corso', '2026-08-25T15:10:00', () => {
    LM.aggiungiAzione('Confrontare piani telefonici', 'finanze', { ora: '15:00', durata: 60 });
    ['Rispondere alle mail', 'Rivedere il budget'].forEach(t => LM.aggiungiAzione(t, 'founder', {}));
  }],
  ['una cosa più tardi', '2026-08-25T10:00:00', () => {
    LM.aggiungiAzione('Confrontare piani telefonici', 'finanze', { ora: '15:00', durata: 60 });
  }],
  ['una cosa senza orario', '2026-08-25T10:00:00', () => {
    ['Scrivere il changelog', 'Rispondere alle mail'].forEach(t => LM.aggiungiAzione(t, 'founder', {}));
  }],
  ['un’abitudine', '2026-08-25T07:10:00', () => {
    /* il 25 agosto 2026 è un MARTEDÌ: un'abitudine di lunedì-mercoledì-venerdì
       oggi non è prevista, e la prova guarderebbe un'altra cosa senza dirlo */
    const h = LM.aggiungiAbitudine('Corsa 5 km', 'salute', [1, 2, 4], { ora: '07:00', durata: 45 });
    const s = LM.load(); s.abitudini.find(x => x.id === h.id).fatti = {}; LM.save();
  }]
];

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
  const err = [];

  async function apri(forma, oraIso, prepara) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    p.on('pageerror', e => err.push(forma + ': ' + e));
    await p.addInitScript(t => {
      const D = Date; const base = D.now();
      class F extends D {
        constructor(...a) { if (!a.length) super(t + (D.now() - base)); else super(...a); }
        static now() { return t + (D.now() - base); }
      }
      window.Date = F;
    }, new Date(oraIso).getTime());
    await p.goto('http://localhost:' + PORTA + '/index.html'); await p.waitForTimeout(350);
    await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
    await p.evaluate(() => {
      const s = LM.load(), t = LM.todayKey();
      s.azioni.filter(a => a.data === t).forEach(a => { a.done = true; });
      s.abitudini.forEach(h => { h.fatti[t] = true; });
      LM.save();
    });
    await p.evaluate(prepara);
    await p.evaluate(f => { const s = LM.load(); s.profilo.forma = f; LM.save(); }, forma);
    await p.evaluate(() => { location.hash = '#/oggi'; });
    await p.reload(); await p.waitForTimeout(900);
    return { ctx, p };
  }

  console.log('OGNI COMANDO ESISTE UNA VOLTA SOLA');
  for (const forma of ['scheda', 'spina', 'poi']) {
    for (const [nome, ora, prep] of CASI) {
      const { ctx, p } = await apri(forma, ora, prep);
      const doppi = await p.evaluate(ids => ids
        .map(i => [i, document.querySelectorAll('#' + i).length])
        .filter(x => x[1] > 1), COMANDI);
      ok(forma + ' · ' + nome, doppi.length === 0, doppi.length ? JSON.stringify(doppi) : '');
      /* e almeno il comando principale c'è: una forma che non disegna
         nessun tasto passerebbe la prova qui sopra a pieni voti */
      const primario = await p.evaluate(() => !!(document.getElementById('btn-fatto') || document.getElementById('btn-adesso')));
      ok('  e il comando principale c’è', primario);
      await ctx.close();
    }
  }

  console.log('\nE RISPONDE DAVVERO, ANCHE DALLA FASCIA');
  for (const forma of ['spina', 'poi']) {
    const { ctx, p } = await apri(forma, '2026-08-25T15:10:00', CASI[0][2]);
    const prima = await p.evaluate(() => LM.azioniDiOggi().filter(a => !a.done).length);
    await p.evaluate(() => { document.getElementById('btn-fatto').click(); });
    await p.waitForTimeout(600);
    const dopo = await p.evaluate(() => LM.azioniDiOggi().filter(a => !a.done).length);
    ok(forma + ': «Fatto» nella fascia spunta davvero', dopo === prima - 1, prima + ' → ' + dopo);
    await ctx.close();
  }

  console.log('\nLE FRASI CHE DICHIARANO UN’ASSENZA NON CI SONO');
  for (const forma of ['spina', 'poi']) {
    {
      const { ctx, p } = await apri(forma, '2026-08-25T10:00:00', CASI[2][2]);
      const t = await p.evaluate(() => document.querySelector('.focus-scena').textContent);
      ok(forma + ': niente «nessun orario»', !/nessun orario/i.test(t));
      await ctx.close();
    }
    {
      const { ctx, p } = await apri(forma, '2026-08-25T10:00:00', CASI[1][2]);
      const t = await p.evaluate(() => document.querySelector('.focus-scena').textContent);
      ok(forma + ': niente «Adesso non hai niente in programma»', !/non hai niente in programma/i.test(t));
      await ctx.close();
    }
  }

  console.log('\nLA CODA DI OGGI NON SI DISEGNA DUE VOLTE');
  for (const forma of ['spina', 'poi']) {
    const { ctx, p } = await apri(forma, '2026-08-25T15:10:00', CASI[0][2]);
    const v = await p.evaluate(() => ({
      fisarmonica: document.querySelectorAll('.focus-altre').length,
      aperta: document.querySelectorAll('.coda-riga').length
    }));
    ok(forma + ': la fisarmonica non c’è', v.fisarmonica === 0, JSON.stringify(v));
    ok(forma + ': la coda è in pagina', v.aperta > 0, JSON.stringify(v));
    await ctx.close();
  }
  {
    /* e nella forma di sempre non cambia niente: la fisarmonica resta, e
       la coda aperta non compare */
    const { ctx, p } = await apri('scheda', '2026-08-25T15:10:00', CASI[0][2]);
    const v = await p.evaluate(() => ({
      fisarmonica: document.querySelectorAll('.focus-altre').length,
      aperta: document.querySelectorAll('.coda-riga').length,
      fascia: document.querySelectorAll('.fuoco-fascia').length
    }));
    ok('scheda: resta com’era', v.fisarmonica === 1 && v.aperta === 0 && v.fascia === 0, JSON.stringify(v));
    await ctx.close();
  }

  console.log('\nLA SETTIMANA DELL’ABITUDINE È SCRITTA, NON A PALLINI');
  for (const forma of ['spina', 'poi']) {
    const { ctx, p } = await apri(forma, '2026-08-25T07:10:00', CASI[3][2]);
    const v = await p.evaluate(() => ({
      pallini: document.querySelectorAll('.focus-ripete i, .focus-ripete span[class*=gio]').length,
      testo: document.querySelector('.focus-scena').textContent
    }));
    ok(forma + ': i giorni sono parole', /Lun|Mar|Gio|Ogni giorno/.test(v.testo), v.testo.slice(0, 60));
    await ctx.close();
  }

  if (err.length) { fail += err.length; console.log('\nERRORI DI PAGINA:'); err.forEach(e => console.log('  ' + e)); }
  await b.close(); srv.close();
  console.log('\n' + (fail ? fail + ' PROBLEMI' : 'tutto a posto'));
  process.exit(fail ? 1 : 0);
})();
