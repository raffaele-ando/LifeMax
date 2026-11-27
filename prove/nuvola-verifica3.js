/* LE COPIE DI PRIMA, LETTE DA AVVERSARIO (verifica del 27 novembre 2026,
   revisione/cloud3/RAPPORTO.md, N1 e N5), col cloud vero in piccolo.
     N1  una copia locale presa PRIMA dell'aggiornamento (senza proprietario)
         non va a chi è dentro adesso, se non è della sua vita; e quelle che
         la versione del 25 novembre gli aveva già dato si riguardano
     N5  la copia «prima di entrare nell'account» dell'ospite con l'esempio
         si vede da dentro l'account; e quelle di prima non si buttano
     N4  un orologio andato avanti una volta sola (+400 giorni, col cloud
         che non risponde) non fa vincere per 400 giorni quel dispositivo:
         rimesso giusto e misurato, una modifica fatta DOPO altrove vince
     N11 il nome rovinato lo stesso giorno si riprende: prima di cambiare
         nome o visione, una copia del cloud com'era
   Le copie «di prima» si scrivono direttamente nella memoria del browser,
   come le lasciava la versione vecchia: senza il campo `chi`.
   node prove/nuvola-verifica3.js     (CHROMIUM=/percorso/di/chrome se serve) */
'use strict';
const em = require('./comune/emulatore');
const { ok, guai } = em.conto();

(async () => {
  const E = await em.accendi(9300);
  const srv = await em.servi(E.P.sito, process.env.LIFEMAX_SITO);
  const B = em.banco(E), N = em.nuvola(E);
  await B.avvia();
  const SEG = 'Segreto di Mario (privato)', MIA = 'La mia cosa vera scritta sopra l’esempio';
  const copie = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('lifemax.backups.v1') || '[]'));
  const con = (arr, t) => arr.filter((b) => (b.data || '').indexOf(t) >= 0);
  /* una copia come la lasciava la versione vecchia */
  const metti = (p, data, motivo, chi) => p.evaluate(([d, m, c]) => {
    const arr = JSON.parse(localStorage.getItem('lifemax.backups.v1') || '[]');
    const b = { ts: Date.now() - 86400000 - arr.length * 1000, motivo: m, data: d };
    if (c !== undefined) b.chi = c;
    arr.push(b);
    localStorage.setItem('lifemax.backups.v1', JSON.stringify(arr));
  }, [data, motivo, chi]);
  try {
    /* ------------------------------------------------------------ N1 */
    {
      await N.pulisci();
      const P = await B.dispositivo('pc-condiviso');
      await B.accedi(P, 'mario', 'mario@prova.it');
      await P.evaluate((t) => { LM.aggiungiAzione(t, null); const s = LM.load(); s.profilo.nome = 'Mario Rossi'; LM.save(); }, SEG);
      await B.calma(P, 1500);
      const statoMario = await P.evaluate(() => localStorage.getItem('lifemax.v2'));
      await P.evaluate(() => window.LMCloud.signOut()); await B.calma(P, 1500);
      await B.accedi(P, 'luigi', 'luigi@prova.it');
      const luigi = await B.uidDi(P);
      await P.evaluate(() => LM.aggiungiAzione('Cosa di Luigi', null)); await B.calma(P, 1500);
      const statoLuigi = await P.evaluate(() => localStorage.getItem('lifemax.v2'));
      /* arriva l'aggiornamento: nel browser ci sono due copie di prima,
         senza proprietario — una con la vita di Mario, una con quella di Luigi */
      await metti(P, statoMario, 'prima-di-riprendere-una-copia-dal-cloud');
      await metti(P, statoLuigi, 'prima-import');
      await P.evaluate(() => localStorage.removeItem('lm-copie-riesaminate'));
      await P.reload(); await P.waitForFunction(() => window.LM); await B.calma(P, 2000);
      const elenco = await P.evaluate(() => LM.listBackups());
      const tutte = await copie(P);
      const diMario = con(tutte, SEG);
      ok('N1 la copia di prima con la vita di Mario NON va a Luigi', diMario.length > 0 && !diMario.some((b) => b.chi === luigi), diMario.map((b) => b.chi));
      ok('N1 …e non si butta: resta «senza proprietario»', diMario.some((b) => b.chi === '?'), diMario.map((b) => b.chi));
      ok('N1 la copia di prima con la vita di Luigi è sua, e la vede', elenco.some((b) => b.motivo === 'prima-import'), elenco);
      const ts = diMario.length ? diMario[0].ts : 0;
      const rip = await P.evaluate((x) => LM.restoreBackup(x), ts);
      await B.calma(P, 2000);
      const cloudL = JSON.stringify(await N.stato(luigi) || {});
      ok('N1 Luigi non può ripristinarla: i dati di Mario non entrano nel suo cloud', !rip && cloudL.indexOf(SEG) < 0 && cloudL.indexOf('Mario Rossi') < 0, { rip });
      /* le copie che la versione del 25 novembre aveva già dato a Luigi con la regola vecchia */
      await P.evaluate((u) => {
        const arr = JSON.parse(localStorage.getItem('lifemax.backups.v1') || '[]');
        arr.forEach((b) => { if (b.chi === '?') b.chi = u; });
        localStorage.setItem('lifemax.backups.v1', JSON.stringify(arr));
        localStorage.removeItem('lm-copie-riesaminate');
      }, luigi);
      await P.reload(); await P.waitForFunction(() => window.LM); await B.calma(P, 1500);
      const elenco2 = await P.evaluate(() => LM.listBackups());
      const diMario2 = con(await copie(P), SEG);
      ok('N1 una copia di Mario già data a Luigi dalla versione di prima si riguarda e torna senza proprietario', !diMario2.some((b) => b.chi === luigi) && elenco2.length === elenco.length, { chi: diMario2.map((b) => b.chi), elenco2 });
      /* «Backup e ripristino» la mostra a parte, con l'avviso, e solo da scaricare o eliminare */
      await P.evaluate(() => { location.hash = '#/profilo'; }); await P.waitForTimeout(600);
      await P.evaluate(() => { const b = document.getElementById('imp-tutte'); if (b) b.click(); }); await P.waitForTimeout(700);
      await P.evaluate(() => { const b = document.getElementById('imp-backup'); if (b) b.click(); }); await P.waitForTimeout(900);
      const sez = await P.evaluate(() => { const e = document.getElementById('bk-senza'); return e ? { testo: e.parentElement.innerText, scarica: !!document.querySelector('[data-senza-scarica]'), ripristina: !!document.querySelector('[data-senza-scarica]') && !!document.querySelector('#bk-senza ~ .backup-lista [data-ts]') } : null; });
      ok('N1 in «Backup e ripristino» c’è «Copie senza proprietario», con l’avviso, da scaricare o eliminare (non da ripristinare)', !!sez && /altra persona/.test(sez.testo) && sez.scarica && !sez.ripristina, sez);
      await P.ctx.close();
    }
    /* ------------------------------------------------------------ N5 */
    {
      await N.pulisci();
      const R = await B.dispositivo('telefono-ospite', { tipo: 'iphone' });
      await R.evaluate(() => LM.seedDemo());
      await R.reload(); await R.waitForFunction(() => window.LM);
      await R.evaluate((t) => LM.aggiungiAzione(t, null), MIA); await R.waitForTimeout(500);
      await B.accedi(R, 'carla', 'carla@prova.it'); await B.calma(R, 2000);
      const sch = await R.evaluate((t) => LM.load().azioni.some((a) => a.testo === t), MIA);
      const vis = await R.evaluate(() => LM.listBackups());
      ok('N5 (com’è deciso) entrando, l’esempio e la cosa scritta sopra lasciano lo schermo', !sch);
      ok('N5 …e la copia «prima di entrare nell’account» si vede da dentro l’account', vis.some((b) => b.motivo === 'prima-di-entrare-nell-account'), vis);
      /* una copia così presa da una versione di prima, senza proprietario */
      const stato = JSON.stringify({ azioni: [{ id: 'idospite1', testo: MIA, areaId: 'altro', data: '2026-11-20', done: false }], profilo: {} });
      await R.evaluate(() => localStorage.removeItem('lm-copie-riesaminate'));
      await metti(R, stato, 'prima-di-entrare-nell-account');
      await R.reload(); await R.waitForFunction(() => window.LM); await B.calma(R, 1500);
      await R.evaluate(() => LM.listBackups());
      const resta = con(await copie(R), 'idospite1');
      ok('N5 la copia «prima di entrare nell’account» di prima dell’aggiornamento non si butta', resta.length === 1, resta.map((b) => b.chi));
      await R.ctx.close();
    }
    /* ------------------------------------------------------------ N4 */
    {
      await N.pulisci();
      const G = 86400000;
      const FS = 'http://127.0.0.1:' + E.P.firestore + '/**';
      const P = await B.dispositivo('pc'), T = await B.dispositivo('telefono', { tipo: 'iphone' });
      await B.accedi(P, 'olga', 'olga@prova.it'); await B.accedi(T, 'olga', 'olga@prova.it');
      await P.evaluate(() => { LM.aggiungiAzione('Riunione', null); LM.aggiungiAzione('Altra cosa', null); });
      await B.calmaTutti([P, T], 3000);
      const id = await P.evaluate(() => LM.load().azioni.find((a) => a.testo === 'Riunione').id);
      const rinomina = (d, i, x) => d.evaluate(([a, b]) => { const r = LM.load().azioni.find((y) => y.id === a); r.testo = b; LM.save(); }, [i, x]);
      const riapri = async (d) => { await d.reload(); await d.waitForFunction(() => window.LM, null, { timeout: 20000 }); };
      /* il PC apre con l'orologio avanti di 400 giorni, il cloud non risponde, e scrive */
      await P.ctx.route(FS, (r) => r.abort());
      await B.avanti(P, 400 * G);
      await riapri(P); await P.waitForTimeout(2500);
      const altra = await P.evaluate(() => LM.load().azioni.find((x) => x.testo === 'Altra cosa').id);
      await rinomina(P, altra, 'Altra cosa (dal pc)'); await P.waitForTimeout(800);
      /* l'orologio torna giusto, il cloud risponde, il PC riapre e misura */
      await B.avanti(P, -400 * G);
      await P.ctx.unroute(FS);
      await riapri(P); await B.calmaTutti([P, T], 4000);
      await rinomina(P, id, 'Riunione (scritto dal PC prima)');
      await B.calmaTutti([P, T], 3000); await T.waitForTimeout(2000);
      await rinomina(T, id, 'Riunione (scritto dal telefono dopo)');
      await B.calmaTutti([P, T], 4000);
      await riapri(P); await riapri(T); await B.calmaTutti([P, T], 4000);
      const fine = { pc: await P.evaluate((i) => LM.load().azioni.find((a) => a.id === i).testo, id), telefono: await T.evaluate((i) => LM.load().azioni.find((a) => a.id === i).testo, id) };
      fine.cloud = (((await N.stato(await B.uidDi(P))) || {}).azioni || []).filter((a) => a.id === id).map((a) => a.testo)[0];
      ok('N4 il PC aveva l’orologio avanti di 400 giorni; rimesso giusto, la modifica fatta DOPO sul telefono vince, ovunque', Object.values(fine).every((v) => /telefono/.test(v || '')), fine);
      await P.ctx.close(); await T.ctx.close();
    }
    /* ------------------------------------------------------------ N11 */
    {
      await N.pulisci();
      const T = await B.dispositivo('telefono', { tipo: 'iphone' });
      await B.accedi(T, 'nora', 'nora@prova.it');
      const nora = await B.uidDi(T);
      await T.evaluate(() => LM.aggiungiAzione('la prima cosa di oggi', null)); await B.calma(T, 2000);
      await T.evaluate(() => LM.aggiungiAzione('la seconda', null)); await B.calma(T, 2000);
      await T.evaluate(() => { const s = LM.load(); s.profilo.nome = 'Nora'; s.profilo.visione = 'Finire la tesi entro giugno'; LM.save(); }); await B.calma(T, 2500);
      /* lo stesso giorno il profilo si rovina (un dispositivo nuovo vuoto, un errore) */
      await T.evaluate(() => { const s = LM.load(); s.profilo.nome = ''; s.profilo.visione = ''; LM.save(); }); await B.calma(T, 3000);
      const copie = await N.elenco('users/' + nora + '/copie');
      ok('N11 il profilo rovinato lo stesso giorno: nel cloud c’è una copia col nome e la visione di prima', copie.some((c) => c.nome === 'Nora' && /tesi/.test(c.visione || '')), copie.map((c) => c.motivo + ':' + c.nome));
      await T.ctx.close();
    }
    for (const p of B.tutti) if (p.__err && p.__err.length) ok('nessun errore in pagina su ' + p.__nome, false, p.__err.slice(0, 2));
  } catch (e) {
    ok('la prova è arrivata in fondo', false, String(e && e.stack || e));
  } finally {
    await B.chiudi(); srv.close(); await E.spegni();
  }
  console.log(guai() ? '\n' + guai() + ' problemi' : '\ntutto a posto');
  process.exit(guai() ? 1 : 0);
})();
