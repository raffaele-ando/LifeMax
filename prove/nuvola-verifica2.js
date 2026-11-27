/* I PROBLEMI MEDI E MINORI DELLA VERIFICA DEL 25 NOVEMBRE 2026, col cloud
   vero in piccolo (Firebase Emulator Suite, vedi comune/emulatore.js).
   revisione/cloud2/RAPPORTO.md, capitolo 3:
     M1  «Esci» mentre il cloud non risponde, poi accede un altro: la
         modifica del primo non resta più bloccata sul PC
     M5  una scheda con una versione troppo vecchia per i dati del cloud
         smette di scrivere e dice «ricarica»
     M6  l'SDK di Firebase che non arriva all'apertura: si riprova da sé, e
         intanto le modifiche si segnano «non ancora nel cloud»
     M7  orologi molto sbagliati: lo scarto si ricorda, un orologio nel
         passato non scrive ore del passato, e senza misura non scade niente
     m1  la finestra di Google chiusa subito non porta la pagina da Google
   node prove/nuvola-verifica2.js     (CHROMIUM=/percorso/di/chrome se serve) */
'use strict';
const em = require('./comune/emulatore');
const { ok, guai } = em.conto();

(async () => {
  const E = await em.accendi(9600);
  const srv = await em.servi(E.P.sito, process.env.LIFEMAX_SITO);
  const B = em.banco(E), N = em.nuvola(E);
  await B.avvia();
  const azCloud = async (uid) => { const s = await N.stato(uid); return ((s && s.azioni) || []).map((a) => a.testo); };
  const FS = 'http://127.0.0.1:' + E.P.firestore + '/**';
  try {
    /* ------------------------------------------------------------ M1 */
    {
      await N.pulisci();
      const P = await B.dispositivo('pc');
      await B.accedi(P, 'mario', 'mario@prova.it');
      const mario = await B.uidDi(P);
      await P.ctx.route(FS, (r) => r.abort('connectionrefused'));
      await P.evaluate(() => LM.aggiungiAzione('Ultima cosa di Mario', null));
      const esito = await P.evaluate(() => window.LMCloud.signOut());
      ok('(preparazione) M1 Mario esce col cloud che non risponde: uscita «in attesa»', esito === 'in-attesa', esito);
      const detti = [];
      await P.exposeFunction('__detto', (t) => detti.push(t)).catch(() => {});
      await P.evaluate(() => document.addEventListener('lm:accesso-fallito', (e) => window.__detto(e.detail.titolo + ': ' + e.detail.testo)));
      await P.evaluate(() => { window.__chi = { sub: 'luigi', email: 'luigi@prova.it' }; return window.LMCloud.signIn(); });
      await P.waitForTimeout(1500);
      const dentro1 = await P.evaluate(() => window.LM_AUTH && window.LM_AUTH.user && window.LM_AUTH.user.email);
      ok('M1 Luigi prova ad accedere: l’app dice che c’è una modifica di chi è uscito, e aspetta', !dentro1 && detti.some((t) => /non è arrivata nel cloud/.test(t)), { dentro1, detti });
      /* il cloud torna: al tocco successivo l'uscita di Mario si completa, poi entra Luigi */
      await P.ctx.unroute(FS);
      await P.evaluate(() => window.LMCloud.signIn());
      await P.waitForFunction(() => window.LM_AUTH && window.LM_AUTH.user && !window.LM_AUTH.syncing, null, { timeout: 30000 }).catch(() => {});
      await B.calma(P, 1500);
      const dentro2 = await P.evaluate(() => window.LM_AUTH && window.LM_AUTH.user && window.LM_AUTH.user.email);
      ok('M1 …tornato il cloud, la modifica di Mario è nel SUO cloud', (await azCloud(mario)).includes('Ultima cosa di Mario'), await azCloud(mario));
      const luigi = await B.uidDi(P);
      ok('M1 …e Luigi è dentro, senza niente di Mario', dentro2 === 'luigi@prova.it' && !(await azCloud(luigi)).includes('Ultima cosa di Mario'), { dentro2 });
      await P.ctx.close();
    }
    /* ------------------------------------------------------------ M5 */
    {
      await N.pulisci();
      const T = await B.dispositivo('telefono', { tipo: 'iphone' });
      await B.accedi(T, 'anna', 'anna@prova.it');
      const anna = await B.uidDi(T);
      await T.evaluate(() => LM.aggiungiAzione('Prima della versione nuova', null)); await B.calma(T, 2000);
      const m0 = await N.doc('users/' + anna);
      ok('M5 il documento principale dice la versione minima che può scrivere', Number(m0 && m0.versioneMinima) >= 1, m0 && m0.versioneMinima);
      /* esce una versione che non vuole più le scritture delle vecchie */
      await N.richiesta('PATCH', 'users/' + anna + '?updateMask.fieldPaths=versioneMinima', { fields: { versioneMinima: { integerValue: '99' } } });
      await T.waitForTimeout(2500);
      const banda = await T.evaluate(() => { const b = document.getElementById('lm-versione-nuova'); return b ? b.textContent : ''; });
      ok('M5 la scheda vecchia lo sa subito e chiede di ricaricare', /Ricarica/.test(banda), banda);
      const rev0 = Number((await N.doc('users/' + anna)).rev);
      await T.evaluate(() => LM.aggiungiAzione('Scritta dalla scheda vecchia', null)); await T.waitForTimeout(3000);
      const m1 = await N.doc('users/' + anna);
      ok('M5 …e non scrive più nel cloud (la modifica resta sul dispositivo)', Number(m1.rev) === rev0 && Number(m1.versioneMinima) === 99 &&
        (await T.evaluate(() => LM.load().azioni.some((a) => a.testo === 'Scritta dalla scheda vecchia'))), { rev0, rev: m1.rev });
      await T.ctx.close();
    }
    /* ------------------------------------------------------------ M6 */
    {
      await N.pulisci();
      const ctx = await B.contesto({ tipo: 'android' });
      const A = await B.dispositivo('android', { ctx });
      await B.accedi(A, 'otto', 'otto@prova.it');
      const otto = await B.uidDi(A);
      ctx.__sdkKo = true;
      await A.reload(); await A.waitForFunction(() => window.LM, null, { timeout: 20000 }); await A.waitForTimeout(2500);
      await A.evaluate(() => LM.aggiungiAzione('Scritta senza SDK', null)); await A.waitForTimeout(500);
      const s1 = await A.evaluate(() => ({ cloud: window.LM_AUTH && window.LM_AUTH.available, sync: window.LM_SYNC && window.LM_SYNC.state }));
      ok('M6 SDK non arrivato: la modifica si segna «non ancora nel cloud»', s1.cloud === false && s1.sync === 'attesa', s1);
      ctx.__sdkKo = false;
      await A.evaluate(() => window.dispatchEvent(new Event('online')));
      /* l'app ricarica da sé la pagina per riprendere l'SDK: si aspetta che
         sia tornata, col cloud acceso */
      for (let i = 0; i < 60; i++) {
        const pronto = await A.evaluate(() => !!(window.LM_AUTH && window.LM_AUTH.available && window.LM_AUTH.user && !window.LM_AUTH.syncing)).catch(() => false);
        if (pronto) break;
        await new Promise((r) => setTimeout(r, 500));
      }
      await B.calma(A, 2500);
      ok('M6 tornata la rete, il cloud riparte da solo e la modifica arriva (senza riaprire)', (await azCloud(otto)).includes('Scritta senza SDK'), await azCloud(otto));
      await ctx.close();
    }
    /* ------------------------------------------------------------ M7 */
    {
      await N.pulisci();
      /* un telefono avanti di tre ore: misurato una volta col cloud... */
      const ctx = await B.contesto({ tipo: 'iphone', skew: 3 * 3600000 });
      const T = await B.dispositivo('telefono', { ctx });
      await B.accedi(T, 'eva', 'eva@prova.it');
      /* ...e riaperto il giorno dopo (l'ultima ora vista è vecchia),
         mentre il cloud non risponde: lo scarto si ricorda */
      await ctx.addInitScript(() => {
        if (sessionStorage.getItem('__giornoDopo')) return;
        sessionStorage.setItem('__giornoDopo', '1');
        localStorage.setItem('lm-ultimo-istante', String(Date.now() - 86400000));
        try { const s = JSON.parse(localStorage.getItem('lifemax.v2')); s.updatedAt = Date.now() - 86400000; localStorage.setItem('lifemax.v2', JSON.stringify(s)); } catch (e) { /* niente */ }
      });
      await ctx.route(FS, (r) => r.abort('connectionrefused'));
      await T.reload(); await T.waitForFunction(() => window.LM, null, { timeout: 20000 });
      const riaperto = await T.evaluate(() => Date.now() - LM.adesso());
      await ctx.unroute(FS);
      ok('M7 lo scarto dell’orologio si ricorda: riaprendo senza cloud le ore restano corrette', riaperto > 3 * 3600000 - 60000, { riaperto });
      await ctx.close();
      /* un tablet tornato al 2001, non ancora misurato */
      const vecchio = Date.UTC(2001, 0, 1) - Date.now();
      const ctx2 = await B.contesto({ tipo: 'ipad', skew: vecchio });
      const I = await B.dispositivo('ipad', { ctx: ctx2 });
      const ora = await I.evaluate(() => LM.adesso());
      ok('M7 un orologio nel 2001 non scrive ore del 2001', ora >= Date.UTC(2026, 10, 25), new Date(ora).toISOString());
      /* (verifica 3, N12) e quello che scrive va nel giorno vero, non nel 1° gennaio 2001 */
      const giorno = await I.evaluate(() => { LM.aggiungiAzione('scritta sul tablet del 2001', null); return LM.load().azioni.find((a) => a.testo === 'scritta sul tablet del 2001').data; });
      ok('N12 un orologio nel 2001: quello che scrive va in un giorno di adesso, non nel 1° gennaio 2001', giorno >= '2026-11-25', giorno);
      /* e senza misura le lapidi non scadono: un PC avanti di due anni */
      const tolte = await I.evaluate(() => {
        const s = LM.statoVuoto(); s.cancellati = [{ k: 'azioni', chiave: 'x', ts: Date.UTC(2026, 10, 20), vivo: false }];
        s.orologi = { 'azioni/x': Date.UTC(2026, 10, 20) };
        const u = LM.unisci(s, LM.statoVuoto());
        return { lapidi: u.cancellati.length, orologi: Object.keys(u.orologi || {}).length };
      });
      await ctx2.close();
      const ctx3 = await B.contesto({ tipo: 'pc', skew: 2 * 365 * 86400000 });
      const P = await B.dispositivo('pc', { ctx: ctx3 });
      const restano = await P.evaluate(() => {
        const s = LM.statoVuoto(); s.cancellati = [{ k: 'azioni', chiave: 'x', ts: Date.UTC(2026, 10, 20), vivo: false }];
        s.orologi = { 'azioni/x': Date.UTC(2026, 10, 20) };
        const u = LM.unisci(s, LM.statoVuoto());
        return { lapidi: u.cancellati.length, orologi: Object.keys(u.orologi || {}).length };
      });
      ok('M7 un PC avanti di due anni, non misurato, non butta lapidi né orologi', restano.lapidi === 1 && restano.orologi === 1, restano);
      await B.accedi(P, 'eva', 'eva@prova.it');
      const misurataP = await P.evaluate(() => {
        const s = LM.statoVuoto(); s.cancellati = [{ k: 'azioni', chiave: 'x', ts: Date.UTC(2026, 10, 20), vivo: false }];
        s.orologi = { 'azioni/x': Date.UTC(2026, 10, 20) };
        const u = LM.unisci(s, LM.statoVuoto());
        return { lapidi: u.cancellati.length, orologi: Object.keys(u.orologi || {}).length };
      });
      ok('M7 …e nemmeno dopo la misura: conta l’ora del server, non la sua', misurataP.lapidi === 1 && misurataP.orologi === 1, misurataP);
      void tolte;
      await ctx3.close();
    }
    /* ------------------------------------------------------------ m1 */
    {
      const P = await B.dispositivo('pc');
      await P.waitForFunction(() => window.LMCloud && window.LMCloud.available, null, { timeout: 20000 });
      const r = await P.evaluate(async () => { window.__popupFail = 'auth/popup-closed-by-user'; window.__redirectTried = 0; await window.LMCloud.signIn(); return window.__redirectTried; });
      ok('m1 la finestra di Google chiusa subito: niente redirect verso Google', r === 0, r);
      await P.ctx.close();
    }
    /* ------------------------------------------------------------ m11 */
    {
      await N.pulisci();
      const T = await B.dispositivo('telefono', { tipo: 'iphone' });
      await B.accedi(T, 'gaia', 'gaia@prova.it');
      const gaia = await B.uidDi(T);
      await T.evaluate(() => LM.aggiungiAzione('per avere la copia del giorno', null)); await B.calma(T, 2000);
      await T.evaluate(() => { const s = LM.load(); s.profilo.nome = 'Gaia'; s.profilo.visione = 'Scritta dopo la copia del giorno'; LM.save(); }); await B.calma(T, 2000);
      const I = await B.dispositivo('ipad', { tipo: 'ipad' });
      await I.evaluate(() => LM.aggiungiAzione('dal tablet nuovo', null));
      await B.accedi(I, 'gaia', 'gaia@prova.it'); await B.calma(I, 2000);
      const copie = await N.elenco('users/' + gaia + '/copie');
      ok('m11 un dispositivo nuovo entra: prima, una copia del cloud com’era (col profilo scritto dopo la copia del giorno)',
        copie.some((c) => c.motivo === 'primo-accesso-di-un-dispositivo' && /Scritta dopo/.test(c.visione || '')), copie.map((c) => c.motivo + ':' + c.visione));
      await T.ctx.close(); await I.ctx.close();
    }
    /* ------------------------------------------------------------ m12 */
    {
      await N.pulisci();
      const vecchio = 'http://127.0.0.1:' + E.P.sito, nuovo = 'http://localhost:' + E.P.sito;
      const init = 'window.__LM_TRASLOCO = ' + JSON.stringify({ vecchio, nuovo }) + ';';
      const ctx = await B.contesto({ tipo: 'pc', init });
      /* sul nuovo indirizzo è collegato l'account di Dario */
      const NU = await B.dispositivo('nuovo', { ctx, host: 'localhost' });
      await B.accedi(NU, 'dario', 'dario@prova.it');
      const dario = await B.uidDi(NU);
      await NU.close();
      const GH = await B.dispositivo('github.io', { ctx });
      await GH.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); LM.aggiungiAzione('di qualcun altro, su github.io', null); });
      await GH.reload(); await GH.waitForFunction(() => window.LM);
      await GH.waitForSelector('#lm-trasloco', { timeout: 10000 }).catch(() => {});
      const [di] = await Promise.all([ctx.waitForEvent('page', { timeout: 10000 }), GH.click('#lm-trasloco button.lm-tr-primo')]);
      await di.waitForFunction(() => window.LM, null, { timeout: 20000 });
      await di.waitForFunction(() => /account/.test((document.getElementById('lm-trasloco') || {}).textContent || ''), null, { timeout: 10000 }).catch(() => {});
      const chiede = await di.evaluate(() => (document.getElementById('lm-trasloco') || {}).textContent || '');
      ok('m12 sul nuovo indirizzo c’è un account: prima di aggiungere i dati di github.io si chiede, dicendo quanti sono', /Aggiungo/.test(chiede) && /1 elemento/.test(chiede), chiede);
      await di.click('#lm-trasloco button:not(.lm-tr-primo)').catch(() => {});
      await B.calma(di, 2500);
      ok('m12 …e dicendo di no, nell’account non entra niente', !(await azCloud(dario)).includes('di qualcun altro, su github.io') && !(await di.evaluate(() => LM.load().azioni.some((a) => /qualcun altro/.test(a.testo)))), await azCloud(dario));
      /* trasloco fatto: la proposta non ricompare intera a ogni visita */
      await GH.evaluate(() => { localStorage.setItem('lm-traslocato', String(Date.now())); sessionStorage.removeItem('lm-trasloco-dopo'); });
      await GH.reload(); await GH.waitForFunction(() => window.LM);
      await GH.waitForSelector('#lm-trasloco', { timeout: 10000 }).catch(() => {});
      const dopo = await GH.evaluate(() => { const d = document.getElementById('lm-trasloco'); return d ? { testo: d.textContent, piccolo: d.classList.contains('lm-tr-piccolo') } : null; });
      ok('m12 dopo il trasloco, sul vecchio indirizzo solo un promemoria piccolo', !!dopo && dopo.piccolo && !/Porta i miei dati/.test(dopo.testo), dopo);
      await ctx.close();
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
