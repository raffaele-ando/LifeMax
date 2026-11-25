/* N04 — GLI OROLOGI: sbagliati, fusi orari, ora legale, mezzanotte con l'app
   aperta, giorni passati e futuri, fine trimestre.
   node n04-orologi.js */
const L = require('./lib');
const H = 3600e3;
const testo = (p, id) => p.evaluate((id) => { const a = LM.load().azioni.find((x) => x.id === id); return a ? a.testo : null; }, id);
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  const P = await L.dispositivo('pc-ora-giusta', { tipo: 'pc' });
  await L.accedi(P, 'olga', 'olga@prova.it'); const uid = await L.uidDi(P);

  /* A1: telefono avanti 3 ore, misurato all'accesso, poi offline */
  const T = await L.dispositivo('telefono-avanti-3h', { tipo: 'iphone', skew: 3 * H });
  await L.accedi(T, 'olga', 'olga@prova.it');
  const idA = await P.evaluate(() => LM.aggiungiAzione('A originale', null).id); await L.calmaTutti([P, T], 1500);
  await T.ctx.setOffline(true);
  await T.evaluate((id) => LM.modificaAzione(id, 'A dal telefono (PRIMA, orologio +3h)'), idA);
  await P.waitForTimeout(3000);
  await P.evaluate((id) => LM.modificaAzione(id, 'A dal pc (DOPO, ora giusta)'), idA); await L.calma(P, 1500);
  await T.ctx.setOffline(false); await L.calmaTutti([P, T], 4000);
  L.esito('A1 orologio +3h (scarto misurato all’accesso): vince la modifica fatta davvero dopo', (await testo(P, idA)) === 'A dal pc (DOPO, ora giusta)', { pc: await testo(P, idA), telefono: await testo(T, idA) });

  /* A2: lo stesso telefono RIAPERTO SENZA RETE (lo scarto è solo in memoria) */
  const idB = await P.evaluate(() => LM.aggiungiAzione('B originale', null).id); await L.calmaTutti([P, T], 1500);
  /* senza rete l'app non si riapre affatto (G3): si imita «riaperta con il cloud irraggiungibile» */
  await T.ctx.route(new RegExp('127\\.0\\.0\\.1:' + L.FSP), (r) => r.abort());
  await L.riapri(T); await T.waitForTimeout(6000);
  await T.evaluate((id) => LM.modificaAzione(id, 'B dal telefono (PRIMA, app riaperta offline, +3h)'), idB);
  await P.waitForTimeout(3000);
  await P.evaluate((id) => LM.modificaAzione(id, 'B dal pc (DOPO, ora giusta)'), idB); await L.calma(P, 1500);
  await T.ctx.unroute(new RegExp('127\\.0\\.0\\.1:' + L.FSP)); await T.evaluate(() => window.dispatchEvent(new Event('online'))); await L.calmaTutti([P, T], 8000);
  L.esito('A2 orologio +3h e app riaperta col cloud irraggiungibile: vince la modifica fatta davvero dopo', (await testo(P, idB)) === 'B dal pc (DOPO, ora giusta)', { pc: await testo(P, idB), telefono: await testo(T, idB) });

  /* A3: orologio INDIETRO di 10 minuti, app riaperta offline: cancella dopo una modifica del pc */
  const Q = await L.dispositivo('tablet-indietro-10min', { tipo: 'ipad', skew: -10 * 60e3 });
  await L.accedi(Q, 'olga', 'olga@prova.it');
  const idC = await P.evaluate(() => LM.aggiungiAzione('C da cancellare', null).id); await L.calmaTutti([P, Q], 1500);
  await P.evaluate((id) => LM.modificaAzione(id, 'C modificata dal pc'), idC); await L.calmaTutti([P, Q], 2000);
  await Q.ctx.route(new RegExp('127\\.0\\.0\\.1:' + L.FSP), (r) => r.abort()); await L.riapri(Q); await Q.waitForTimeout(6000);
  await Q.evaluate((id) => LM.rimuoviAzione(id), idC);
  await Q.ctx.unroute(new RegExp('127\\.0\\.0\\.1:' + L.FSP)); await Q.evaluate(() => window.dispatchEvent(new Event('online'))); await L.calmaTutti([P, Q], 8000);
  L.esito('A3 orologio -10 min, app riaperta col cloud irraggiungibile: la cancellazione fatta DOPO la modifica vince', (await testo(P, idC)) === null, { pc: await testo(P, idC), tablet: await testo(Q, idC) });

  /* C: fusi orari: telefono a New York, pc a Roma */
  const NY = await L.dispositivo('telefono-new-york', { tipo: 'iphone', tz: 'America/New_York' });
  await L.accedi(NY, 'olga', 'olga@prova.it');
  const fusi = { ny: await NY.evaluate(() => LM.todayKey()), roma: await P.evaluate(() => LM.todayKey()) };
  const hNY = await NY.evaluate(() => { const h = LM.aggiungiAbitudine('Leggere (fusi)', null, [0, 1, 2, 3, 4, 5, 6]); LM.completaAbitudine(h.id); return h.id; });
  await L.calmaTutti([P, NY], 2500);
  const visto = await P.evaluate((id) => { const h = LM.load().abitudini.find((x) => x.id === id); return h ? { fatti: Object.keys(h.fatti || {}), oggiRoma: LM.todayKey(), fattaOggiPerRoma: !!(h.fatti || {})[LM.todayKey()] } : null; }, hNY);
  L.esito('C1 abitudine spuntata a New York: per Roma in quale giorno cade (nota, non un errore)', true, { oggiNY: fusi.ny, oggiRoma: fusi.roma, visto });
  /* un'azione con orario fatta a NY alle 20:00 */
  const azNY = await NY.evaluate(() => { const a = LM.aggiungiAzione('Chiamata delle 20 (NY)', null, { ora: '20:00' }); return { id: a.id, data: a.data, ora: a.ora }; });
  await L.calmaTutti([P, NY], 2000);
  const azRoma = await P.evaluate((id) => { const a = LM.load().azioni.find((x) => x.id === id); return a && { data: a.data, ora: a.ora }; }, azNY.id);
  L.esito('C2 un’azione «alle 20:00» scritta a New York: a Roma resta «alle 20:00» (ora da muro, non istante)', true, { NY: azNY, Roma: azRoma });

  /* D: ora legale (conti sui giorni) */
  const dst = await P.evaluate(() => ({ marzo: [LM.addDays('2027-03-27', 1), LM.addDays('2027-03-28', 1)], ottobre: [LM.addDays('2026-10-24', 1), LM.addDays('2026-10-25', 1)], tra: LM.daysBetween ? [LM.daysBetween('2027-03-27', '2027-03-29'), LM.daysBetween('2026-10-24', '2026-10-26')] : null }));
  L.esito('D1 i conti sui giorni attraverso l’ora legale tornano', dst.marzo.join() === '2027-03-28,2027-03-29' && dst.ottobre.join() === '2026-10-25,2026-10-26' && (!dst.tra || dst.tra.join() === '2,2'), dst);

  /* E: mezzanotte con l'app aperta */
  const M = await L.dispositivo('pc-sempre-aperto', { tipo: 'pc' });
  await L.accedi(M, 'olga', 'olga@prova.it');
  const mancano = await M.evaluate(() => { const d = new Date(); const m = new Date(d); m.setHours(24, 0, 0, 0); return m - d; });
  await L.avanti(M, mancano - 15000);
  await M.evaluate(() => { location.hash = '#/oggi'; }); await M.waitForTimeout(1500);
  const prima = await M.evaluate(() => ({ oggi: LM.todayKey(), titolo: (document.querySelector('h1, .titolo, header') || {}).innerText || '' }));
  await M.waitForTimeout(25000);
  await M.evaluate(() => LM.aggiungiAzione('scritta subito dopo mezzanotte', null));
  const dopo = await M.evaluate(() => ({ oggi: LM.todayKey(), titolo: (document.querySelector('h1, .titolo, header') || {}).innerText || '', dataAzione: (LM.load().azioni.find((a) => a.testo === 'scritta subito dopo mezzanotte') || {}).data }));
  await L.foto(M, 'n04-e-dopo-mezzanotte-app-aperta');
  L.esito('E1 mezzanotte con l’app aperta: il giorno cambia e la cosa nuova va nel giorno nuovo', dopo.oggi !== prima.oggi && dopo.dataAzione === dopo.oggi, { prima, dopo });
  L.esito('E2 …e lo schermo si aggiorna da solo (intestazione cambiata senza toccare niente)', prima.titolo !== dopo.titolo, { prima: prima.titolo.slice(0, 80), dopo: dopo.titolo.slice(0, 80) });

  /* F: giorni passati e futuri, e il passaggio di trimestre */
  const r = await P.evaluate(() => {
    const ieri = LM.addDays(LM.todayKey(), -1), fra40 = LM.addDays(LM.todayKey(), 40), tre = LM.addDays(LM.todayKey(), -95);
    const a = LM.aggiungiAzione('di ieri', null, { data: ieri }); LM.completaAzione(a.id);
    const b = LM.aggiungiAzione('fra 40 giorni (altro trimestre)', null, { data: fra40 });
    LM.valutaArea(LM.load().aree[0].id, 6, tre);
    LM.setRitmoGiorno(fra40, { sveglia: '05:45' });
    return { a: a.id, b: b.id, ieri, fra40, tre };
  });
  await L.calmaTutti([P, T, NY], 3000);
  const vT = await T.evaluate((r) => { const s = LM.load(); const a = s.azioni.find((x) => x.id === r.a), b = s.azioni.find((x) => x.id === r.b); return { ieriFatta: !!(a && a.done), futura: b && b.data, voto: !!(s.valutazioni[r.tre]), ritmo: !!(s.ritmoGiorno[r.fra40]) }; }, r);
  L.esito('F1 modifiche su giorni passati e futuri (anche in altri trimestri) arrivano', vT.ieriFatta && vT.futura === r.fra40 && vT.voto && vT.ritmo, vT);
  /* spostare un'azione nel trimestre dopo mentre un altro dispositivo, offline, ne cambia il testo */
  await T.ctx.setOffline(true);
  await T.evaluate((id) => LM.modificaAzione(id, 'fra 40 giorni — testo cambiato offline'), r.b);
  await P.evaluate(([id, g]) => LM.spostaAzione(id, g), [r.b, await P.evaluate(() => LM.addDays(LM.todayKey(), 3))]); await L.calma(P, 1500);
  await T.ctx.setOffline(false); await L.calmaTutti([P, T], 4000);
  const fin = await P.evaluate((id) => { const x = LM.load().azioni.filter((a) => a.id === id); return x.map((a) => a.testo + ' @' + a.data); }, r.b);
  const finT = await T.evaluate((id) => { const x = LM.load().azioni.filter((a) => a.id === id); return x.map((a) => a.testo + ' @' + a.data); }, r.b);
  L.esito('F2 riga spostata di trimestre (pezzo diverso) mentre l’altro la modificava offline: una riga sola, uguale ovunque', fin.length === 1 && JSON.stringify(fin) === JSON.stringify(finT), { pc: fin, telefono: finT });
  const pezzi = Object.keys(((await L.docRaw('users/' + uid)) || {}).pezzi || {});
  L.esito('F3 i pezzi nel cloud', true, pezzi);

  L.salvaRisultati('n04-orologi'); await L.browser().close(); srv.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
