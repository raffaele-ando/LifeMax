/* LA RICARICA DA SOLA PER RIPRENDERE IL CLOUD, CON I FRENI (verifica del 27
   novembre 2026, revisione/cloud3/RAPPORTO.md, N3 e N6).
     N3  l'SDK arriva ma non parte (browser vecchio, filtro): mai ricaricare
         da sola, dirlo; un ospite (senza account) non si ricarica mai; con
         la rete che va e viene, al massimo tre volte, poi si dice
     N6  non si ricarica se qualcosa andrebbe perso: un campo con dentro del
         testo, un foglio aperto. Al posto, la striscia con «Ricarica»
   Il tempo passa spostando l'orologio della pagina (`avanti`), e la rete
   «torna» con l'evento `online`.
   node prove/nuvola-ricarica.js     (CHROMIUM=/percorso/di/chrome se serve) */
'use strict';
const em = require('./comune/emulatore');
const { ok, guai } = em.conto();

(async () => {
  const E = await em.accendi(9100);
  const srv = await em.servi(E.P.sito, process.env.LIFEMAX_SITO);
  const B = em.banco(E), N = em.nuvola(E);
  await B.avvia();
  const MIN = 60000;
  /* un dispositivo di un account, riaperto con l'SDK che non va */
  const prepara = async (nome, guasto) => {
    const ctx = await B.contesto({ tipo: 'pc' });
    const p = await B.dispositivo(nome, { ctx });
    await B.accedi(p, nome, nome + '@prova.it');
    ctx[guasto] = true;
    p.__carichi = 0; p.on('load', () => { p.__carichi++; });
    await p.reload(); await p.waitForFunction(() => window.LM, null, { timeout: 20000 }); await p.waitForTimeout(2500);
    p.__carichi = 0;
    return p;
  };
  /* passa del tempo e torna la rete: n volte */
  const giri = async (p, n, min) => {
    for (let i = 0; i < n; i++) {
      await B.avanti(p, (min || 6) * MIN).catch(() => {});
      await p.evaluate(() => window.dispatchEvent(new Event('online'))).catch(() => {});
      await p.waitForTimeout(2500);
      await p.waitForFunction(() => window.LM, null, { timeout: 20000 }).catch(() => {});
    }
  };
  const striscia = (p) => p.evaluate(() => { const d = document.getElementById('lm-cloud-fermo'); return d ? d.textContent : ''; }).catch(() => '');
  try {
    await N.pulisci();
    /* N3: arrivato ma non eseguibile */
    {
      const p = await prepara('rotto', '__sdkRotto');
      const detto = await striscia(p);
      await giri(p, 6, 16);
      ok('N3 l’SDK arriva ma non parte: la pagina non si ricarica mai da sola', p.__carichi === 0, p.__carichi + ' ricariche');
      ok('N3 …e lo dice, con «Ricarica»', /non è partito/.test(detto) && /Ricarica/.test(detto), detto);
      await p.ctx.close();
    }
    /* N3: un ospite non si ricarica mai */
    {
      const ctx = await B.contesto({ tipo: 'pc' });
      ctx.__sdkKo = true;
      const p = await B.dispositivo('ospite', { ctx });
      p.__carichi = 0; p.on('load', () => { p.__carichi++; });
      await p.evaluate(() => LM.aggiungiAzione('scritta da ospite', null));
      ctx.__sdkKo = false;
      await giri(p, 4, 6);
      ok('N3 un ospite (nessun account) non si ricarica mai per il cloud', p.__carichi === 0, p.__carichi + ' ricariche');
      await ctx.close();
    }
    /* N3: rete che va e viene: al massimo tre volte */
    {
      const p = await prepara('rete', '__sdkKo');
      /* la rete «torna» ma gstatic continua a non dare l'SDK al browser: ogni ricarica fallisce di nuovo */
      await p.route('https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js', (r) => r.request().resourceType() === 'fetch' ? r.fulfill({ status: 200, body: '' }) : r.fallback());
      await giri(p, 8, 16);
      const detto = await striscia(p);
      ok('N3 con la rete che va e viene: al massimo tre ricariche, poi basta', p.__carichi <= 3 && p.__carichi >= 1, p.__carichi + ' ricariche');
      ok('N3 …e alla fine lo dice', /non risponde/.test(detto), detto);
      await p.ctx.close();
    }
    /* N6: qualcosa di scritto, o un foglio aperto: niente ricarica, la striscia */
    {
      const p = await prepara('scrive', '__sdkKo');
      await p.evaluate(() => { const t = document.createElement('textarea'); t.id = 'prova-campo'; document.body.appendChild(t); });
      await p.fill('#prova-campo', 'Oggi ho finito il capitolo 3');
      await p.evaluate(() => { document.activeElement && document.activeElement.blur(); document.body.focus(); });
      p.ctx.__sdkKo = false;
      await giri(p, 1, 2);
      const t1 = await p.evaluate(() => (document.getElementById('prova-campo') || {}).value).catch(() => null);
      const s1 = await striscia(p);
      ok('N6 un campo con del testo non salvato (e il fuoco altrove): la pagina non si ricarica, il testo resta', p.__carichi === 0 && t1 === 'Oggi ho finito il capitolo 3', { carichi: p.__carichi, t1 });
      ok('N6 …e la striscia dice che il cloud è tornato, con «Ricarica»', /raggiungibile/.test(s1), s1);
      /* un foglio aperto (prima lo si apre, poi si toglie il campo: se no
         il controllo di ogni minuto potrebbe ricaricare in mezzo). Il
         foglio è quello dell'app (#sheet-overlay), aperto come lo apre lei */
      await p.evaluate(() => { const o = document.getElementById('sheet-overlay'); if (o) o.hidden = false; });
      await p.evaluate(() => { const t = document.getElementById('prova-campo'); if (t) t.remove(); const d = document.getElementById('lm-cloud-fermo'); if (d) d.remove(); });
      const aperto = await p.evaluate(() => !!document.querySelector('.sheet-overlay:not([hidden])'));
      await giri(p, 1, 2);
      ok('N6 con un foglio aperto la pagina non si ricarica', aperto && p.__carichi === 0, { aperto, carichi: p.__carichi });
      /* chiuso il foglio, al giro dopo sì: il cloud riparte */
      await p.evaluate(() => { const o = document.getElementById('sheet-overlay'); if (o) o.hidden = true; }); await p.waitForTimeout(300);
      await giri(p, 1, 2);
      await p.waitForFunction(() => window.LM_AUTH && window.LM_AUTH.available, null, { timeout: 20000 }).catch(() => {});
      const acceso = await p.evaluate(() => !!(window.LM_AUTH && window.LM_AUTH.available)).catch(() => false);
      ok('N6 …chiuso il foglio, la ricarica avviene e il cloud riparte', p.__carichi === 1 && acceso, { carichi: p.__carichi, acceso });
      await p.ctx.close();
    }
    for (const q of B.tutti) if (q.__err && q.__err.length) ok('nessun errore in pagina su ' + q.__nome, false, q.__err.slice(0, 2));
  } catch (e) {
    ok('la prova è arrivata in fondo', false, String(e && e.stack || e));
  } finally {
    await B.chiudi(); srv.close(); await E.spegni();
  }
  console.log(guai() ? '\n' + guai() + ' problemi' : '\ntutto a posto');
  process.exit(guai() ? 1 : 0);
})();
