/* A05 — Tre dispositivi, una vita vera: il telefono usato tutti i giorni da
   mesi, l'iPad riaperto dopo settimane, il PC con la scheda sempre aperta
   (e a un certo punto senza rete). Il giro di controllo generale: alla fine
   i tre dispositivi e il cloud devono dire la stessa cosa, nessuna cosa
   cancellata deve tornare, nessuna modifica deve sparire.
   node a05-tre-dispositivi-mesi.js */
'use strict';
const { banco, esiti } = require('./lib');
const R = esiti('a05-tre-dispositivi-mesi');

(async () => {
  const { E, B, N, chiudi } = await banco(9400);
  const FS = 'http://127.0.0.1:' + E.P.firestore + '/**';
  const vista = (d) => d.evaluate(() => {
    const s = LM.load(); const o = {};
    s.azioni.forEach((a) => { o[a.id] = a.testo + (a.done ? '[x]' : ''); });
    return { azioni: o, visione: s.profilo.visione, abitudini: s.abitudini.map((h) => h.id + ':' + Object.keys(h.fatti || {}).sort().join(',')).sort() };
  });
  try {
    await N.pulisci();
    const T = await B.dispositivo('telefono', { tipo: 'iphone' });
    /* tre mesi di uso sul telefono, da ospite, poi l'accesso */
    await T.evaluate(() => {
      const s = LM.load(); s.onboarded = true; s.profilo.nome = 'Sara'; s.profilo.visione = 'Vivere con calma';
      LM.save();
      const oggi = Date.now();
      for (let g = 90; g >= 1; g--) {
        const d = new Date(oggi - g * 86400000); const k = LM.dayKey(d);
        for (let i = 0; i < 3; i++) s.azioni.push({ id: 'v' + g + '_' + i, areaId: 'lavoro', testo: 'Vecchia ' + g + '.' + i, ifThen: '', mit: false, done: true, data: k, doneAt: d.getTime(), creata: d.getTime(), ora: null, durata: null, passoDi: null, aggiornata: d.getTime() });
        s.valutazioni[k] = { lavoro: 3 };
      }
      LM.save();
      for (let i = 0; i < 40; i++) LM.aggiungiAzione('Da fare ' + i, null);
      LM.aggiungiAbitudine('Camminare', null, [0, 1, 2, 3, 4, 5, 6]);
    });
    await B.accedi(T, 'sara', 'sara@prova.it');
    const uid = await B.uidDi(T);
    await B.calma(T, 3000);
    const I = await B.dispositivo('ipad', { tipo: 'ipad' });
    await B.accedi(I, 'sara', 'sara@prova.it');
    const P = await B.dispositivo('pc');
    await B.accedi(P, 'sara', 'sara@prova.it');
    await B.calmaTutti([T, I, P], 3000);
    const v0 = [await vista(T), await vista(I), await vista(P)];
    R.ok('A05.0 dopo il primo accesso i tre dispositivi hanno le stesse cose', JSON.stringify(v0[0]) === JSON.stringify(v0[1]) && JSON.stringify(v0[0]) === JSON.stringify(v0[2]), { n: v0.map((v) => Object.keys(v.azioni).length) });
    /* l'iPad si chiude (resta la sua memoria) */
    const ctxI = I.ctx; await I.close();
    /* settimane sul telefono */
    await T.evaluate(() => {
      const az = LM.load().azioni.filter((a) => /^Da fare/.test(a.testo));
      az.slice(0, 10).forEach((a) => LM.rimuoviAzione(a.id));
      az.slice(10, 20).forEach((a) => LM.completaAzione(a.id));
      az.slice(20, 30).forEach((a) => LM.modificaAzione(a.id, a.testo + ' (telefono)'));
      for (let i = 0; i < 15; i++) LM.aggiungiAzione('Nuova dal telefono ' + i, null);
      const h = LM.load().abitudini[0]; LM.completaAbitudine(h.id, LM.todayKey());
      const s = LM.load(); s.profilo.visione = 'Vivere con calma, e scrivere'; LM.save();
    });
    await B.calmaTutti([T, P], 3000);
    /* il PC, aperto da giorni, cambia altre cose; poi perde la rete e ne cambia altre */
    await P.evaluate(() => {
      const az = LM.load().azioni.filter((a) => /^Da fare 3\d$/.test(a.testo));
      az.slice(0, 5).forEach((a) => LM.modificaAzione(a.id, a.testo + ' (pc)'));
    });
    await B.calmaTutti([T, P], 3000);
    await P.ctx.route(FS, (r) => r.abort());
    await P.evaluate(() => window.dispatchEvent(new Event('offline')));
    await P.evaluate(() => {
      const az = LM.load().azioni.filter((a) => /^Da fare 3[5-9]$/.test(a.testo));
      az.forEach((a) => LM.completaAzione(a.id));
      const n = LM.load().azioni.find((a) => a.testo === 'Nuova dal telefono 0'); if (n) LM.modificaAzione(n.id, 'Nuova dal telefono 0 (corretta dal pc, offline)');
      LM.aggiungiAzione('Scritta sul PC senza rete', null);
    });
    await P.waitForTimeout(2000);
    /* intanto, dopo, il telefono rinomina la stessa cosa: vince lui (è dopo) */
    await T.evaluate(() => { const n = LM.load().azioni.find((a) => /^Nuova dal telefono 0/.test(a.testo)); LM.modificaAzione(n.id, 'Nuova dal telefono 0 (rinominata dopo, telefono)'); });
    await B.calma(T, 2500);
    /* l'iPad si riapre dopo settimane */
    const I2 = await B.dispositivo('ipad', { ctx: ctxI });
    await B.calma(I2, 4000); await I2.waitForTimeout(2000); await B.calma(I2, 1000);
    /* il PC ritrova la rete */
    await P.ctx.unroute(FS);
    await P.evaluate(() => window.dispatchEvent(new Event('online')));
    await B.calmaTutti([T, I2, P], 5000); await B.calmaTutti([T, I2, P], 3000);
    const fine = { telefono: await vista(T), ipad: await vista(I2), pc: await vista(P) };
    const st = await N.stato(uid); const cloud = { azioni: {} }; (st.azioni || []).forEach((a) => { cloud.azioni[a.id] = a.testo + (a.done ? '[x]' : ''); });
    const tutti = Object.assign({}, fine, { cloud });
    const firme = Object.keys(tutti).map((k) => JSON.stringify(Object.keys(tutti[k].azioni).sort().map((i) => i + '=' + tutti[k].azioni[i])));
    R.ok('A05.1 alla fine telefono, iPad, PC e cloud hanno le stesse cose', firme.every((f) => f === firme[0]), Object.keys(tutti).map((k) => k + ':' + Object.keys(tutti[k].azioni).length));
    const a = fine.ipad.azioni; const testi = Object.values(a);
    R.ok('A05.2 le 10 cose cancellate sul telefono non tornano (iPad)', !testi.some((t) => /^Da fare [0-9](\[x\])?$/.test(t)), testi.filter((t) => /^Da fare [0-9](\[x\])?$/.test(t)));
    R.ok('A05.3 le 10 spunte del telefono ci sono (iPad)', testi.filter((t) => /^Da fare 1\d\[x\]$/.test(t)).length === 10);
    R.ok('A05.4 le rinomine del telefono e del PC ci sono', testi.filter((t) => /\(telefono\)$/.test(t)).length === 10 && testi.filter((t) => /\(pc\)/.test(t)).length === 5, testi.filter((t) => /\((telefono|pc)\)/.test(t)).length);
    R.ok('A05.5 le cose fatte sul PC senza rete ci sono (spunte e la cosa nuova)', testi.includes('Scritta sul PC senza rete') && testi.filter((t) => /^Da fare 3[5-9]( \(pc\))?\[x\]$/.test(t)).length === 5, testi.filter((t) => /^Da fare 3/.test(t)));
    R.ok('A05.6 la rinomina fatta dopo sul telefono vince su quella del PC senza rete', testi.includes('Nuova dal telefono 0 (rinominata dopo, telefono)'), testi.filter((t) => /Nuova dal telefono 0/.test(t)));
    R.ok('A05.7 la visione nuova e la spunta dell’abitudine ci sono ovunque', ['telefono', 'ipad', 'pc'].every((k) => fine[k].visione === 'Vivere con calma, e scrivere' && fine[k].abitudini[0] && /,?\d{4}-/.test(fine[k].abitudini[0])), Object.keys(fine).map((k) => fine[k].visione + ' ' + fine[k].abitudini[0]));
    for (const d of [T, I2, P]) if (d.__err && d.__err.length) R.ok('nessun errore in pagina su ' + d.__nome, false, d.__err.slice(0, 3));
  } catch (e) { R.ok('eccezione', false, String(e && e.stack || e)); }
  await chiudi();
  process.exit(R.fine() ? 1 : 0);
})();
