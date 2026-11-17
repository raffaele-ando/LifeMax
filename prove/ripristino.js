/* AZZERA, RIPRISTINA, E L'ALTRO DISPOSITIVO SEGUE.
   La sequenza vera che ha fatto perdere i dati due volte: computer e telefono
   sullo stesso account; sul computer «Azzera tutto» (collegato: si svuota
   anche il telefono); poi sul computer si ripristina il backup. Il computer
   tornava a posto, il telefono restava a zero — e al giro dopo il telefono
   rimandava su il vuoto. Qui si pretende che il ripristino arrivi ovunque, e
   resti, da qualunque parte si faccia, anche con un backup dal cloud.
   node prove/ripristino.js   (CHROMIUM=/percorso/di/chrome se serve) */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const RADICE = require('./comune/dove').SERVITO;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
(async () => {
  const srv = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
    fs.readFile(path.join(RADICE, p), (e, d) => { if (e) { r.statusCode = 404; r.end('x'); return; } r.setHeader('Content-Type', T[path.extname(p)] || 'application/octet-stream'); r.end(d); }); });
  await new Promise((r) => srv.listen(8854, r));
  const b = await require('./comune/lancia')();
  const err = []; let guai = 0;
  const ok = (n, c, d) => { if (!c) guai++; console.log((c ? '  ok  ' : '  KO  ') + n + (d ? '  → ' + d : '')); };
  async function disp() {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'it-IT' }); const p = await ctx.newPage();
    p.on('pageerror', (e) => err.push('' + e));
    await p.goto('http://localhost:8854/index.html'); await p.waitForTimeout(400);
    return p;
  }
  const PC = await disp(), TEL = await disp();
  /* i dati veri: righe, diario, voti — nati settimane fa */
  await PC.evaluate(() => {
    localStorage.clear();
    const s = LM.statoVuoto(); s.onboarded = true;
    const vecchio = Date.now() - 20 * 86400000;
    for (let i = 0; i < 12; i++) s.azioni.push({ id: 'a' + i, testo: 'AZIONE VERA ' + i, data: LM.todayKey(), creata: vecchio, areaId: 'studio', done: false });
    for (let i = 0; i < 5; i++) s.backlog.push({ id: 'b' + i, testo: 'DA FARE VERA ' + i, creata: vecchio, areaId: 'studio' });
    s.lezioni.push({ id: 'l1', testo: 'SCOPERTA VERA', verso: 'si', forza: 'noto', creata: vecchio });
    s.reviewSera['2026-08-01'] = { vittoria: 'SERA VERA', blocco: '', ts: vecchio };
    s.valutazioni['2026-08-01'] = { studio: 4 };
    s.updatedAt = vecchio;
    LM.hydrate(s, true);
  });
  const conta = (p) => p.evaluate(() => { const s = LM.snapshot(); return { az: s.azioni.length, bk: s.backlog.length, lz: s.lezioni.length, sera: Object.keys(s.reviewSera).length, voti: Object.keys(s.valutazioni).length }; });
  /* la nuvola: ogni dispositivo unisce quello che arriva dall'altro, come fa onSnapshot */
  const manda = async (da, a) => {
    const t = await da.evaluate(() => JSON.stringify(LM.snapshotPerCloud()));
    await a.evaluate((t) => { LM.hydrate(JSON.parse(t), false); }, t);
  };
  await manda(PC, TEL);
  ok('il telefono parte con gli stessi dati', JSON.stringify(await conta(TEL)) === JSON.stringify(await conta(PC)), JSON.stringify(await conta(TEL)));

  console.log('\nAZZERA TUTTO, COLLEGATO');
  await PC.evaluate(() => { LM.reset(true); });
  await manda(PC, TEL); await manda(TEL, PC);
  const vuoti = [await conta(PC), await conta(TEL)];
  ok('si svuotano tutti e due', vuoti.every((c) => c.az + c.bk + c.lz + c.sera + c.voti === 0), JSON.stringify(vuoti));

  console.log('\nRIPRISTINO DAL BACKUP DEL COMPUTER');
  await PC.evaluate(() => { const b = LM.listBackups().find((x) => x.motivo === 'prima-azzeramento'); LM.restoreBackup(b.ts); });
  const pieno = await conta(PC);
  ok('il computer torna com’era', pieno.az === 12 && pieno.bk === 5 && pieno.lz === 1 && pieno.sera === 1 && pieno.voti === 1, JSON.stringify(pieno));
  await manda(PC, TEL);
  ok('e il telefono lo riceve, senza ripristinare niente', JSON.stringify(await conta(TEL)) === JSON.stringify(pieno), JSON.stringify(await conta(TEL)));
  await manda(TEL, PC); await manda(PC, TEL); await manda(TEL, PC);
  ok('e dopo qualche giro resta così su tutti e due', JSON.stringify(await conta(PC)) === JSON.stringify(pieno) && JSON.stringify(await conta(TEL)) === JSON.stringify(pieno),
    JSON.stringify([await conta(PC), await conta(TEL)]));
  /* la copia «del cloud» per dopo: com'era adesso, prima del nuovo azzeramento */
  const copia = await PC.evaluate(() => JSON.stringify(LM.snapshot()));
  /* un valore NUOVO nello stesso giorno di un voto cancellato non deve sparire */
  await TEL.evaluate(() => { LM.reset(true); });
  await manda(TEL, PC);
  await PC.evaluate(() => { const s = LM.load(); s.valutazioni['2026-08-01'] = { studio: 2 }; LM.save(); });
  await manda(PC, TEL); await manda(TEL, PC);
  ok('dopo un azzeramento, un voto nuovo nello stesso giorno resta', await TEL.evaluate(() => (LM.snapshot().valutazioni['2026-08-01'] || {}).studio === 2));

  console.log('\nRIPRESO DA UNA COPIA DEL CLOUD, SENZA SOSTITUIRE');
  await PC.evaluate((d) => { LM.riprendiCopia(JSON.parse(d)); }, copia);
  await manda(PC, TEL); await manda(TEL, PC);
  const due = [await conta(PC), await conta(TEL)];
  ok('le righe sepolte tornano, qui e sull’altro', due.every((c) => c.az === 12 && c.bk === 5 && c.lz === 1 && c.sera === 1), JSON.stringify(due));

  console.log('\nE UNA CANCELLAZIONE VERA, DOPO, VALE ANCORA');
  await TEL.evaluate(() => { const s = LM.load(); s.backlog = s.backlog.filter((x) => x.id !== 'b0'); LM.save(); });
  await manda(TEL, PC); await manda(PC, TEL);
  ok('la cosa cancellata dopo il ripristino resta cancellata', await PC.evaluate(() => !LM.snapshot().backlog.some((x) => x.id === 'b0')));

  console.log('\nAZZERARE DA SOLI NON TOCCA L’ACCOUNT');
  await PC.evaluate(() => { LM.reset(false); });
  ok('niente lapidi né tagli che partano verso il cloud', await PC.evaluate(() => LM.snapshot().cancellati.length === 0 && !LM.snapshot().azzerato));
  ok('nessun errore in pagina', err.length === 0, err.slice(0, 2).join(' | '));
  console.log(''); console.log(guai ? '>>> ' + guai + ' PROBLEMI' : '>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(guai ? 1 : 0);
})();
