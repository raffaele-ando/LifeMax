/* Due indirizzi dello stesso sito (raffaele-ando.github.io/LifeMax e lifemax.theproject.world) = due copie locali indipendenti
   nello STESSO browser. Simulati con due origini: 127.0.0.1:9301 ("github.io") e localhost:9301 ("dominio Cloudflare"). */
const L = require('./lib');
const G = 86400000;
const vista = (p) => p.evaluate(() => { const s = LM.load(); return { azioni: s.azioni.map(a => a.testo + (a.done ? '[x]' : '')).sort().join(' | '), nome: s.profilo.nome, sveglia: s.profilo.ritmo.sveglia, areaStudio: s.areeAttive.includes('studio'), connesso: !!(window.LM_AUTH && window.LM_AUTH.user) }; });
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  // stesso browser (stesso contesto), due origini
  const GH = await L.dispositivo('github.io', { tipo: 'iphone' });
  await L.accedi(GH, 'mario', 'mario@prova.it'); const uid = await L.uidDi(GH);
  await GH.evaluate(() => { const s = LM.load(); s.onboarded = true; s.profilo.nome = 'Mario'; s.profilo.ritmo.sveglia = '06:00'; LM.save();
    LM.aggiungiAzione('Bolletta luce', null); const a = LM.aggiungiAzione('Palestra', null); LM.completaAzione(a.id); LM.aggiungiAzione('Vecchia idea', null); });
  await L.calma(GH, 2500);
  // il fondatore passa al dominio nuovo: stesso browser, origine nuova, niente dati, deve rifare l'accesso
  const CF = await L.dispositivo('dominio-cloudflare', { ctx: GH.ctx, host: 'localhost' });
  const appena = await vista(CF);
  L.esito('S11.1 dominio nuovo, stesso browser: non è collegato e non ha dati (due copie separate: atteso)', !appena.connesso && appena.azioni === '', appena);
  await L.accedi(CF, 'mario', 'mario@prova.it'); await L.calmaTutti([CF, GH], 3000);
  const d1 = { dominio: await vista(CF), github: await vista(GH) };
  L.esito('S11.2 accesso sul dominio nuovo: arrivano tutti i dati e il profilo (nome, sveglia) NON viene azzerato', d1.dominio.azioni === d1.github.azioni && d1.dominio.nome === 'Mario' && d1.github.nome === 'Mario' && d1.dominio.sveglia === '06:00', d1);
  // ripristino a mano del profilo per continuare
  await CF.evaluate(() => { const s = LM.load(); s.profilo.nome = 'Mario'; s.profilo.ritmo.sveglia = '06:00'; LM.save(); }); await L.calmaTutti([CF, GH], 2500);
  // la scheda github.io si chiude (resta il segnalibro); per tre settimane si usa solo il dominio
  await GH.close();
  await L.avanti(CF, 21 * G);
  await CF.evaluate(() => { const s = LM.load(); LM.rimuoviAzione(s.azioni.find(a => a.testo === 'Vecchia idea').id); LM.completaAzione(s.azioni.find(a => a.testo === 'Palestra').id); LM.toggleArea('studio', false); LM.aggiungiAzione('Dentista (dal dominio)', null); });
  await L.calma(CF, 3000);
  const atteso = await vista(CF);
  // un giorno si apre per sbaglio il vecchio segnalibro github.io (sessione Firebase ancora valida lì, dati di 3 settimane fa)
  const GH2 = await L.dispositivo('github.io', { ctx: CF.ctx });
  await GH2.evaluate((ms) => { window.__off = ms; }, 21 * G);
  const primaGH = await vista(GH2);
  await L.calmaTutti([GH2, CF], 5000);
  const dopo = { dominio: await vista(CF), github: await vista(GH2) };
  const cloud = (await L.docCloud(uid)).stato;
  L.esito('S11.3 vecchio segnalibro github.io riaperto dopo 3 settimane: NON riporta indietro il dominio (cancellazione, spunta tolta, area disattivata restano)', JSON.stringify(dopo.dominio) === JSON.stringify(atteso) && JSON.stringify(dopo.github) === JSON.stringify(atteso), { atteso, primaDiSincronizzare: primaGH, dopo, cloudAzioni: cloud.azioni.map(a => a.testo + (a.done ? '[x]' : '')) });
  // github.io senza sessione (scaduta) ma con dati: chi lo usa da ospite, poi rientra
  await GH2.evaluate(() => window.__R_AUTH.signOut(window.__auth)); await GH2.waitForTimeout(1500);
  await GH2.evaluate(() => LM.aggiungiAzione('scritta su github.io da disconnesso', null));
  await L.accedi(GH2, 'mario', 'mario@prova.it'); await L.calmaTutti([GH2, CF], 3000);
  L.esito('S11.4 github.io: sessione persa, si scrive da disconnessi, si rientra: la cosa arriva al dominio, senza riportare indietro altro', (await vista(CF)).azioni.includes('scritta su github.io') && !(await vista(CF)).azioni.includes('Vecchia idea'), { dominio: await vista(CF) });
  L.salvaRisultati('s11'); await L.browser().close(); srv.close();
})();
