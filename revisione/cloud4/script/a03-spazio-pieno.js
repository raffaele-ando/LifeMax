/* A03 — Chi usa l'app da mesi: la memoria del browser (localStorage, ~5 MB
   per sito) si riempie delle COPIE DI SICUREZZA locali (fino a 25 copie
   intere dello stato) e dei punti di ritorno (12 copie intere). Da lì le
   copie nuove non si scrivono più, in silenzio: un ripristino o un import
   avvengono SENZA la copia «di prima» che l'app promette.
   Stato realistico: ~8 mesi di uso (azioni, check-in, diario, voti).
   Solo locale (ospite) e poi con l'account: la memoria è quella del browser.
   node a03-spazio-pieno.js */
'use strict';
const { banco, esiti } = require('./lib');
const R = esiti('a03-spazio-pieno');

(async () => {
  const { B, N, chiudi } = await banco(9400);
  try {
    await N.pulisci();
    const P = await B.dispositivo('pc');
    await B.accedi(P, 'pia', 'pia@prova.it');
    /* otto mesi di uso: ~6 cose al giorno, un check-in, un voto, la review e il diario */
    const dim = await P.evaluate(() => {
      const s = LM.load(); s.onboarded = true;
      const oggi = new Date();
      for (let g = 0; g < 240; g++) {
        const d = new Date(oggi.getTime() - g * 86400000); const k = LM.dayKey ? LM.dayKey(d) : d.toISOString().slice(0, 10);
        for (let i = 0; i < 6; i++) s.azioni.push({ id: 'a' + g + '_' + i + Math.random().toString(36).slice(2, 6), areaId: 'lavoro', testo: 'Cosa numero ' + i + ' del giorno ' + k + ' con un po’ di descrizione', ifThen: '', mit: i === 0, done: i % 2 === 0, data: k, doneAt: i % 2 === 0 ? d.getTime() : null, creata: d.getTime(), ora: null, durata: null, passoDi: null, aggiornata: d.getTime() });
        s.checkins.push({ id: 'c' + g, data: k, ts: d.getTime(), energia: 3, focus: 3, umore: 4, contesto: 'ufficio' });
        s.reviewSera[k] = { vittoria: 'Ho finito la parte ' + g, blocco: 'Interruzioni', shutdown: true, ts: d.getTime() };
        s.valutazioni[k] = { lavoro: 4, salute: 3 };
        for (let r = 0; r < 8; r++) s.registro.push({ ts: d.getTime() + r, cat: 'azione', testo: 'Riga di diario ' + r + ' del ' + k, imp: false });
      }
      LM.save();
      return localStorage.getItem('lifemax.v2').length;
    });
    await B.calma(P, 4000);
    R.nota('A03 dimensione dello stato (caratteri)', dim);
    /* quanto spazio resta: si prova a scrivere fino a riempire */
    const usato = await P.evaluate(() => { let t = 0; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); t += k.length + (localStorage.getItem(k) || '').length; } return t; });
    R.nota('A03 caratteri in localStorage dopo il primo salvataggio', usato);
    /* qualche settimana di vita normale: ogni tanto un'operazione che prende una copia */
    const giri = [];
    for (let i = 0; i < 12; i++) {
      const r = await P.evaluate((n) => {
        const prima = JSON.parse(localStorage.getItem('lifemax.backups.v1') || '[]').length;
        LM.backup('prima-import');   /* la stessa chiamata che fanno import, ripristino, azzera… */
        const s = LM.load(); s.azioni.push({ id: 'nuova' + n + Math.random().toString(36).slice(2, 6), areaId: 'lavoro', testo: 'Nuova ' + n, ifThen: '', mit: false, done: false, data: LM.todayKey(), doneAt: null, creata: Date.now(), ora: null, durata: null, passoDi: null }); LM.save();
        const dopo = JSON.parse(localStorage.getItem('lifemax.backups.v1') || '[]').length;
        return { prima, dopo };
      }, i);
      giri.push(r);
    }
    R.nota('A03 copie locali prima/dopo ogni backup', giri);
    const fermo = giri.findIndex((g) => g.dopo <= g.prima && g.prima < 25);
    R.ok('A03.1 ogni operazione che promette «prima faccio una copia» la fa davvero (finché sono meno di 25)', fermo < 0, { primaCopiaMancata: fermo, giri });
    /* il caso che conta: «Ripristina» un backup → deve nascere «prima del ripristino» */
    const rip = await P.evaluate(() => {
      const elenco = LM.listBackups();
      const ts = elenco.length ? elenco[elenco.length - 1].ts : 0;
      const n0 = LM.load().azioni.length;
      const ok = LM.restoreBackup(ts);
      const dopo = LM.listBackups();
      return { ok, n0, nDopo: LM.load().azioni.length, copiaPrimaDelRipristino: dopo.some((b) => b.motivo === 'prima-del-ripristino'), copie: dopo.length };
    });
    R.ok('A03.2 dopo «Ripristina» c’è la copia «prima di un ripristino» (per tornare indietro)', rip.copiaPrimaDelRipristino, rip);
    /* e l'annulla dal diario (punti di ritorno) */
    const pt = await P.evaluate(() => { const s = LM.load(); s.azioni[0].testo = 'cambiata per l’annulla'; LM.save(); return LM.puntiDiRitorno().length; });
    R.nota('A03 punti di ritorno dopo una modifica', pt);
    const err = await P.evaluate(() => (window.LMLog && LMLog.voci ? LMLog.voci().filter((v) => /spazio|quota|salvataggio/i.test(JSON.stringify(v))).slice(-5) : null));
    R.nota('A03 registro tecnico (spazio)', err);
    await P.ctx.close();
  } catch (e) { R.ok('eccezione', false, String(e && e.stack || e)); }
  await chiudi();
  process.exit(R.fine() ? 1 : 0);
})();
