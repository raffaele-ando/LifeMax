/* N01b — le schermate del problema C1, passo per passo, dall'interfaccia (non dalle funzioni):
   Mario esce; l'ospite apre Impostazioni → Backup e ripristino, tocca «Ripristina» sulla copia
   «all'uscita dall'account» e vede «Oggi» di Mario.   node n01b-schermate-backup.js */
const L = require('./lib');
(async () => {
  const srv = await L.servi(); await L.avvia(); await L.pulisciTutto();
  const P = await L.dispositivo('pc-condiviso', { tipo: 'pc' });
  await L.accedi(P, 'mario', 'mario@prova.it');
  await P.evaluate(() => { const s = LM.load(); s.onboarded = true; s.profilo.nome = 'Mario Rossi'; LM.save(); LM.aggiungiAzione('Visita dallo psichiatra (privato Mario)', null); LM.aggiungiAzione('Pagare il mutuo di Mario', null); });
  await L.calma(P, 2500);
  await P.evaluate(() => window.LMCloud.signOut()); await L.calma(P, 1500);
  await P.evaluate(() => { location.hash = '#/profilo'; }); await P.waitForTimeout(1200);
  await P.getByText('Impostazioni', { exact: true }).first().click().catch(() => {}); await P.waitForTimeout(1000);
  const b = await P.$('#imp-backup');
  if (b) await b.click(); else await P.evaluate(() => { const x = [...document.querySelectorAll('button, [role=button], a')].find((e) => /Backup e ripristino/.test(e.textContent)); if (x) x.click(); });
  await P.waitForTimeout(1200);
  await L.foto(P, 'n01b-1-ospite-vede-backup-di-mario');
  const testo = await P.evaluate(() => document.body.innerText);
  L.esito('il pannello Backup mostra all’ospite la copia «all’uscita dall’account»', /all’uscita dall’account/.test(testo), testo.slice(testo.indexOf('Su questo dispositivo'), testo.indexOf('Su questo dispositivo') + 200));
  const btn = await P.$('[data-ts]');
  if (btn) { await btn.click(); await P.waitForTimeout(500); await P.click('.avv-si').catch(() => {}); await P.waitForTimeout(1200); }
  await P.evaluate(() => { location.hash = '#/oggi'; }); await P.waitForTimeout(1500);
  await L.foto(P, 'n01b-2-ospite-ha-ripristinato-i-dati-di-mario');
  const vis = await P.evaluate(() => document.body.innerText.indexOf('psichiatra') >= 0);
  L.esito('dopo «Ripristina» (tocco nell’interfaccia) l’ospite vede le cose di Mario in «Oggi»', !vis, { visibile: vis });
  L.salvaRisultati('n01b-schermate-backup'); await L.browser().close(); srv.close(); process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
