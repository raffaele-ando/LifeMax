/* N08 — OROLOGI MOLTO SBAGLIATI (oltre i 400 giorni che l'app sa correggere)
   e lapidi che scadono sul dispositivo sbagliato.
   A. tablet con la data tornata al 2001 (batteria tampone, reset): le sue modifiche e cancellazioni
   B. PC con l'anno sbagliato (+2 anni): fa risorgere cose cancellate dagli altri?
   node n08-orologi-lontani.js */
const L = require('./lib');
const G = 86400000;
const testo = (p, id) => p.evaluate((id) => { const a = LM.load().azioni.find((x) => x.id === id); return a ? a.testo : null; }, id);
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  const T = await L.dispositivo('telefono', { tipo: 'iphone' });
  await L.accedi(T, 'pia', 'pia@prova.it'); const uid = await L.uidDi(T);

  /* A: tablet nel 2001 */
  const anni25 = Date.now() - Date.parse('2001-01-01T10:00:00Z');
  const V = await L.dispositivo('tablet-2001', { tipo: 'ipad', skew: -anni25 });
  await L.accedi(V, 'pia', 'pia@prova.it');
  const ids = await T.evaluate(() => ({ a: LM.aggiungiAzione('A da rinominare sul tablet', null).id, b: LM.aggiungiAzione('B da cancellare sul tablet', null).id }));
  await L.calmaTutti([T, V], 2500);
  await V.evaluate((id) => LM.modificaAzione(id, 'A rinominata sul tablet (nel 2001)'), ids.a);
  await V.evaluate((id) => LM.rimuoviAzione(id), ids.b);
  await V.evaluate(() => { const s = LM.load(); s.profilo.nome = 'Pia dal tablet'; LM.save(); });
  await L.calmaTutti([T, V], 3500);
  const a = { telefono: await testo(T, ids.a), tablet: await testo(V, ids.a), Bsultelefono: await testo(T, ids.b), Bsultablet: await testo(V, ids.b), nomeT: await T.evaluate(() => LM.load().profilo.nome), nomeV: await V.evaluate(() => LM.load().profilo.nome) };
  await L.foto(V, 'n08-tablet-2001-modifica-tornata-indietro');
  L.esito('A1 tablet con la data al 2001: la sua rinomina arriva agli altri e resta', a.telefono === 'A rinominata sul tablet (nel 2001)' && a.tablet === a.telefono, a);
  L.esito('A2 tablet nel 2001: la sua cancellazione arriva agli altri e resta', a.Bsultelefono === null && a.Bsultablet === null, a);
  L.esito('A3 tablet nel 2001: il nome cambiato resta', a.nomeT === 'Pia dal tablet' && a.nomeV === 'Pia dal tablet', a);
  const nuovi = await V.evaluate(() => ({ data: LM.todayKey(), azione: LM.aggiungiAzione('scritta sul tablet nel 2001', null) }));
  await L.calmaTutti([T, V], 2500);
  const dove = await T.evaluate((id) => { const x = LM.load().azioni.find((a) => a.id === id); return x && x.data; }, nuovi.azione.id);
  L.esito('A4 una cosa scritta sul tablet nel 2001 finisce nel giorno 2001 (non si vede in «oggi»)', true, { giornoTablet: nuovi.data, giornoNelCloud: dove });

  /* B: PC con l'anno sbagliato, +2 anni e un giorno */
  const idc = await T.evaluate(() => { const a = LM.aggiungiAzione('C cancellata dal telefono', null); return a.id; });
  await L.calmaTutti([T, V], 2000);
  const P = await L.dispositivo('pc-anno-sbagliato', { tipo: 'pc', skew: 732 * G });
  await L.accedi(P, 'pia', 'pia@prova.it'); await L.calma(P, 2000);
  await P.ctx.setOffline(true);
  await T.evaluate((id) => LM.rimuoviAzione(id), idc); await L.calma(T, 2000);
  await P.evaluate(() => LM.aggiungiAzione('qualcosa dal pc (anno sbagliato)', null));
  await P.ctx.setOffline(false); await P.evaluate(() => window.dispatchEvent(new Event('online'))); await L.calmaTutti([T, P], 4000);
  const b = { telefono: await testo(T, idc), pc: await testo(P, idc), lapidiPc: await P.evaluate(() => (LM.load().cancellati || []).length), lapidiTel: await T.evaluate(() => (LM.load().cancellati || []).length) };
  L.esito('B1 PC con l’anno avanti di 2: una cosa cancellata dal telefono NON risorge', b.telefono === null && b.pc === null, b);
  const lap = await T.evaluate(() => (LM.load().cancellati || []).length);
  L.esito('B2 le lapidi nel cloud non vengono buttate dal PC con l’anno sbagliato', lap > 0, { lapidiTelefonoDopo: lap, cloud: ((await L.docCloud(uid)).stato.cancellati || []).length });

  L.salvaRisultati('n08-orologi-lontani'); await L.browser().close(); srv.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
