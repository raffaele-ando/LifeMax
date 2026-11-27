/* I DATI DI UN ACCOUNT RESTANO DI QUELL'ACCOUNT.

   Nata dalla verifica del cloud del 24 novembre 2026 (revisione/cloud/
   RAPPORTO.md, problemi 1, 9, 11 e 14). Firebase vero contro l'emulatore
   ufficiale (vedi prove/comune/emulatore.js).

   Quello che si pretende:
     1  Firebase chiude la sessione da solo (account disabilitato): l'app lo
        DICE, il dispositivo si svuota, e se poi entra un altro account sullo
        stesso computer nel suo account non finisce niente del primo;
     1  la sessione persa perché il browser ha cancellato i suoi dati: stessa
        cosa;
     1  «Esci» in una scheda fa uscire anche l'altra scheda, che si svuota e
        non rimette i dati sul dispositivo alla sua modifica successiva;
     9  «Esci» senza rete: si esce lo stesso, e la modifica fatta prima
        arriva nel cloud appena torna la rete — senza riaprire niente;
     1  la sessione chiusa con una modifica non ancora nel cloud: la
        modifica torna quando lo STESSO account rientra, e non va a nessun
        altro;
    11  i messaggi d'errore parlano a chi usa l'app, non al programmatore;
    14  due schede dello stesso browser che scrivono insieme: niente si
        perde, né sul dispositivo né nel cloud.

   Si lancia con: node prove/nuvola-account.js
   (serve l'emulatore: vedi prove/comune/emulatore.js) */
'use strict';
const em = require('./comune/emulatore');
const { ok, guai } = em.conto();

(async () => {
  const E = await em.accendi(9800);
  const srv = await em.servi(E.P.sito);
  const B = em.banco(E), N = em.nuvola(E);
  await B.avvia();
  const URL = 'http://127.0.0.1:' + E.P.sito + '/';
  const az = (p) => p.evaluate(() => LM.load().azioni.map((a) => a.testo).sort().join(' | '));
  const azCloud = async (uid) => { const s = await N.stato(uid); return ((s && s.azioni) || []).map((a) => a.testo).sort().join(' | '); };
  const avvisi = (p) => p.evaluate(() => [...document.querySelectorAll('.toast, [role=alert], [role=alertdialog], [role=status]')].map((t) => t.textContent.trim()).filter(Boolean).join(' / '));
  const salvatoNelDispositivo = (p) => p.evaluate(() => { try { return (JSON.parse(localStorage.getItem('lifemax.v2') || '{}').azioni || []).map((a) => a.testo); } catch (e) { return ['illeggibile']; } });
  try {
    /* -------------------------------------- 1. sessione chiusa da Firebase */
    {
      await N.pulisci();
      const A = await B.dispositivo('pc-di-casa');
      await B.accedi(A, 'mario', 'mario@prova.it');
      const uidM = await B.uidDi(A);
      await A.evaluate(() => { LM.aggiungiAzione('Analisi del sangue (privato di Mario)', null); LM.registraCheckin(1, 1, 1, 'giornata pessima'); });
      await B.calma(A, 2000);
      await N.disabilita(uidM);
      await A.evaluate(() => window.__auth.currentUser.getIdToken(true).catch((e) => e.code));
      await A.waitForTimeout(2500);
      const st = await A.evaluate(() => ({ connesso: !!(window.LM_AUTH && window.LM_AUTH.user), azioni: LM.load().azioni.length }));
      const detto = await avvisi(A);
      ok('1 sessione chiusa da Firebase: l’utente viene avvisato', /sessione|accedi/i.test(detto), detto);
      ok('1 …e i dati dell’account non restano visibili sul dispositivo', !st.connesso && st.azioni === 0, st);
      await B.accedi(A, 'luigi', 'luigi@prova.it');
      const uidL = await B.uidDi(A);
      await B.calma(A, 1500);
      const cl = await N.stato(uidL);
      ok('1 Luigi entra sullo stesso computer: nel suo account non c’è niente di Mario', !!cl && !(cl.azioni || []).some((a) => /Mario/.test(a.testo)) && !(cl.checkins || []).length, cl && { azioni: (cl.azioni || []).map((a) => a.testo), checkins: (cl.checkins || []).length });
      ok('1 …e sullo schermo di Luigi neanche', !/Mario/.test(await az(A)), await az(A));
      await A.ctx.close();
    }
    /* ------------------------------ 1. sessione persa: dati del browser via */
    {
      await N.pulisci();
      const C = await B.dispositivo('ipad', { tipo: 'ipad' });
      await B.accedi(C, 'mario', 'mario@prova.it');
      await C.evaluate(() => LM.aggiungiAzione('Visita (Mario)', null)); await B.calma(C, 1500);
      /* la sessione di Firebase sta nella memoria del browser (le chiavi
         `firebase:`), e un browser che fa pulizia la toglie: i dati di
         LifeMax restano */
      await C.goto(URL + 'manifest.webmanifest');
      await C.evaluate(() => new Promise((r) => {
        Object.keys(localStorage).filter((k) => /^firebase:/.test(k)).forEach((k) => localStorage.removeItem(k));
        const q = indexedDB.deleteDatabase('firebaseLocalStorageDb'); q.onsuccess = q.onerror = q.onblocked = () => r();
      }));
      await C.goto(URL + 'index.html'); await C.waitForFunction(() => window.LM && window.LM_AUTH, null, { timeout: 20000 }); await C.waitForTimeout(3000);
      const dopo = await C.evaluate(() => ({ connesso: !!(window.LM_AUTH && window.LM_AUTH.user), azioni: LM.load().azioni.length }));
      ok('1 sessione persa (dati di Firebase cancellati dal browser): i dati di Mario non restano a vista', !dopo.connesso && dopo.azioni === 0, dopo);
      await B.accedi(C, 'luigi', 'luigi@prova.it'); await B.calma(C, 1500);
      const cl = await N.stato(await B.uidDi(C));
      ok('1 …poi entra Luigi: niente di Mario nel suo account', !!cl && !(cl.azioni || []).some((a) => /Mario/.test(a.testo)), cl && (cl.azioni || []).map((a) => a.testo));
      await C.ctx.close();
    }
    /* ---------------------------------------------- 1. «Esci» e due schede */
    {
      await N.pulisci();
      const T1 = await B.dispositivo('scheda1');
      await B.accedi(T1, 'mario', 'mario@prova.it');
      await T1.evaluate(() => LM.aggiungiAzione('Colloquio di lavoro segreto (Mario)', null)); await B.calma(T1, 1500);
      const T2 = await B.dispositivo('scheda2', { ctx: T1.ctx }); await T2.waitForTimeout(3000);
      await B.calma(T2, 500);
      ok('1 (preparazione) la seconda scheda è dentro con gli stessi dati', (await az(T2)) === (await az(T1)) && await T2.evaluate(() => !!(window.LM_AUTH && window.LM_AUTH.user)), await az(T2));
      await T1.evaluate(() => window.LMCloud.signOut());
      await T1.waitForTimeout(6000);
      const s2 = await T2.evaluate(() => ({ connesso: !!(window.LM_AUTH && window.LM_AUTH.user), azioni: LM.load().azioni.length }));
      ok('1 «Esci» nella scheda 1: dopo 6 secondi anche la scheda 2 è fuori e vuota', !s2.connesso && s2.azioni === 0, s2);
      await T2.evaluate(() => LM.cattura('appunto scritto nella scheda 2'));
      await T2.waitForTimeout(800);
      const nel = await salvatoNelDispositivo(T1);
      ok('1 una modifica nella scheda 2 non rimette i dati di Mario sul dispositivo', Array.isArray(nel) && !nel.some((t) => /Mario/.test(t)), nel);
      await B.accedi(T1, 'luigi', 'luigi@prova.it'); await B.calmaTutti([T1, T2], 3000);
      const cl = await N.stato(await B.uidDi(T1));
      ok('1 Luigi entra nella scheda 1: niente di Mario nel suo account', !!cl && !(cl.azioni || []).some((a) => /Mario/.test(a.testo)), cl && (cl.azioni || []).map((a) => a.testo));
      await T1.ctx.close();
    }
    /* -------------------- verifica 2, C1: il dispositivo condiviso e i backup */
    {
      await N.pulisci();
      const P = await B.dispositivo('pc-condiviso');
      await B.accedi(P, 'mario', 'mario@prova.it');
      /* un calendario «della sentinella» e un permesso della strada del browser,
         come li lascerebbe l'app collegata */
      await P.evaluate(() => {
        LM.aggiungiAzione('PRIVATO-MARIO visita', null);
        const s = LM.load(); s.profilo.nome = 'PRIVATO-MARIO Rossi'; LM.save();
        LM.backup('prima-import');
        localStorage.setItem('lifemax.calendari.specchio', JSON.stringify({ uid: 'mario', ev: { x: { t: 'PRIVATO-MARIO riunione' } } }));
        localStorage.setItem('lifemax.calendari.google', JSON.stringify({ t: 'PRIVATO-MARIO-token', s: Date.now() + 3600e3 }));
      });
      await B.calma(P, 1500);
      await P.evaluate(() => window.LMCloud.signOut()); await P.waitForTimeout(1500);
      const dopo = await P.evaluate(() => ({
        copie: LM.listBackups().length,
        chiavi: Object.keys(localStorage).filter((k) => (localStorage.getItem(k) || '').indexOf('PRIVATO-MARIO') >= 0)
      }));
      ok('C1 dopo «Esci», l’ospite non vede nessuna copia di Mario in «Backup e ripristino»', dopo.copie === 0, dopo.copie);
      ok('C1 …e nel browser non resta niente di Mario (backup, punti a cui tornare, calendario, permessi)', dopo.chiavi.length === 0, dopo.chiavi);
      /* dall'interfaccia, come nella verifica: il pannello */
      const pannello = await P.evaluate(async () => {
        const { apriBackups } = window.LM_APP || {};
        void apriBackups;
        return LM.listBackups().map((b) => b.motivo);
      });
      ok('C1 il pannello non ha righe da ripristinare', !pannello.length, pannello);
      /* entra Luigi: niente di Mario nel suo account */
      await B.accedi(P, 'luigi', 'luigi@prova.it'); await B.calma(P, 1500);
      const cl = await N.stato(await B.uidDi(P));
      ok('C1 Luigi entra sullo stesso browser: niente di Mario nel suo account', !!cl && !JSON.stringify(cl).includes('PRIVATO-MARIO'), cl && (cl.azioni || []).map((a) => a.testo));
      const luigi = await P.evaluate(() => ({ copie: LM.listBackups().length, prova: (() => { const b = JSON.parse(localStorage.getItem('lifemax.backups.v1') || '[]'); return b.length; })() }));
      ok('C1 Luigi non vede copie di nessun altro', luigi.copie === 0, luigi);
      /* la sessione chiusa dal server, con una copia di sicurezza di prima */
      await P.evaluate(() => { LM.aggiungiAzione('PRIVATO-LUIGI conto', null); LM.backup('prima-import'); });
      await B.calma(P, 1500);
      await N.disabilita(await B.uidDi(P));
      await P.evaluate(() => window.__auth.currentUser.getIdToken(true).catch((e) => e.code));
      await P.waitForTimeout(2500);
      await P.evaluate(() => document.querySelectorAll('.avviso-ovl .avv-no').forEach((x) => x.click()));
      const fine = await P.evaluate(() => ({ copie: LM.listBackups().length, chiavi: Object.keys(localStorage).filter((k) => (localStorage.getItem(k) || '').indexOf('PRIVATO-LUIGI') >= 0) }));
      ok('C1 sessione chiusa dal server: nessuna copia di Luigi a vista, niente di Luigi nel browser', fine.copie === 0 && fine.chiavi.length === 0, fine);
      /* le copie di PRIMA, senza proprietario: quelle prese uscendo se ne vanno */
      const vecchie = await P.evaluate(() => {
        const st = JSON.stringify({ azioni: [{ id: 'z', testo: 'PRIVATO-VECCHIO' }] });
        localStorage.setItem('lifemax.backups.v1', JSON.stringify([
          { ts: 1, motivo: 'uscita-dall-account', data: st },
          { ts: 2, motivo: 'prima-import', data: st }
        ]));
        return { viste: LM.listBackups().length, restano: JSON.parse(localStorage.getItem('lifemax.backups.v1') || '[]').map((b) => b.motivo + ':' + b.chi) };
      });
      /* (verifica 3, N1: quella presa uscendo da un account se ne va; l'altra
         non si sa di chi sia, e resta «senza proprietario», non vista da
         nessuno ma non buttata — vedi prove/nuvola-verifica3.js) */
      ok('C1 le copie di prima senza proprietario, su un dispositivo che è passato da un account: non si vedono; quella presa uscendo se ne va, l’altra resta senza proprietario', vecchie.viste === 0 && vecchie.restano.join(',') === 'prima-import:?', vecchie);
      await P.ctx.close();
      /* un dispositivo che non è mai stato di un account: le sue copie restano sue */
      const Q = await B.dispositivo('solo-ospite');
      const ospite = await Q.evaluate(() => {
        localStorage.removeItem('lifemax.generazione');
        localStorage.setItem('lifemax.backups.v1', JSON.stringify([{ ts: 5, motivo: 'prima-import', data: JSON.stringify(LM.snapshot()) }]));
        return LM.listBackups().length;
      });
      ok('C1 su un dispositivo usato sempre senza account, le copie di prima restano dell’ospite', ospite === 1, ospite);
      await Q.ctx.close();
    }
    /* ------------------------------------------------- 9. «Esci» senza rete */
    {
      await N.pulisci();
      const P = await B.dispositivo('pc');
      await B.accedi(P, 'mario', 'mario@prova.it');
      const uid = await B.uidDi(P);
      await P.ctx.setOffline(true);
      await P.evaluate(() => LM.aggiungiAzione('scritta offline poi esco', null));
      const fine = await P.evaluate(() => Promise.race([Promise.resolve(window.LMCloud.signOut()).then((x) => 'uscito:' + x), new Promise((r) => setTimeout(() => r('ancora appeso dopo 20s'), 20000))]));
      const dopo = await P.evaluate(() => ({ connesso: !!(window.LM_AUTH && window.LM_AUTH.user), azioni: LM.load().azioni.length }));
      ok('9 «Esci» senza rete: l’uscita si completa e lo schermo si svuota', /^uscito/.test(fine) && !dopo.connesso && dopo.azioni === 0, { fine, dopo });
      await P.ctx.setOffline(false); await P.waitForTimeout(6000);
      const c = await azCloud(uid);
      ok('9 tornata la rete, la modifica fatta prima di uscire è nel cloud (senza riaprire niente)', c.includes('scritta offline poi esco'), c);
      const ancora = await P.evaluate(() => !!(window.__auth && window.__auth.currentUser));
      ok('9 …e solo allora la sessione si chiude davvero', !ancora, ancora);
      /* chiuso l'app prima che la rete torni: parte alla riapertura */
      await B.accedi(P, 'mario', 'mario@prova.it'); await B.calma(P, 1500);
      await P.ctx.setOffline(true);
      await P.evaluate(() => LM.aggiungiAzione('seconda scritta offline, poi esco e chiudo', null));
      await P.evaluate(() => window.LMCloud.signOut());
      await P.close();
      await P.ctx.setOffline(false);
      const P2 = await B.dispositivo('pc', { ctx: P.ctx }); await P2.waitForTimeout(6000);
      const c2 = await azCloud(uid);
      ok('9 uscito senza rete e app chiusa: alla riapertura la modifica parte, e non si vede niente', c2.includes('seconda scritta offline') && (await P2.evaluate(() => LM.load().azioni.length)) === 0 && !(await P2.evaluate(() => !!(window.LM_AUTH && window.LM_AUTH.user))), { cloud: c2 });
      await P2.ctx.close();
    }
    /* ------------------- 1. modifica non ancora nel cloud e sessione chiusa */
    {
      await N.pulisci();
      const A = await B.dispositivo('telefono', { tipo: 'iphone' });
      await B.accedi(A, 'mario', 'mario@prova.it');
      const uidM = await B.uidDi(A);
      await A.ctx.setOffline(true);
      await A.evaluate(() => LM.aggiungiAzione('scritta senza rete, poi la sessione finisce', null));
      await A.waitForTimeout(500);
      /* la sessione finisce (qui la si chiude dall'SDK, come fa Firebase) */
      await A.evaluate(() => window.__R_AUTH.signOut(window.__auth)); await A.waitForTimeout(1500);
      ok('1 (preparazione) sessione finita: lo schermo è vuoto', (await A.evaluate(() => LM.load().azioni.length)) === 0);
      await A.ctx.setOffline(false);
      await B.accedi(A, 'luigi', 'luigi@prova.it'); await B.calma(A, 2000);
      const cl = await N.stato(await B.uidDi(A));
      ok('1 entra Luigi: la modifica di Mario non va a lui', !!cl && !(cl.azioni || []).some((a) => /sessione finisce/.test(a.testo)), cl && (cl.azioni || []).map((a) => a.testo));
      await A.evaluate(() => window.LMCloud.signOut()); await A.waitForTimeout(1500);
      await B.accedi(A, 'mario', 'mario@prova.it'); await B.calma(A, 2500);
      const cm = await azCloud(uidM);
      ok('1 rientra Mario sullo stesso dispositivo: la sua modifica torna e arriva nel cloud', cm.includes('sessione finisce') && (await az(A)).includes('sessione finisce'), cm);
      await A.ctx.close();
    }
    /* ------------------------------------------- 11. messaggi comprensibili */
    {
      await N.pulisci();
      const C = await B.dispositivo('ipad', { tipo: 'ipad' });
      await B.accedi(C, 'mario', 'mario@prova.it');
      const uid = await B.uidDi(C);
      await N.regole("rules_version='2'; service cloud.firestore { match /databases/{d}/documents { match /{x=**} { allow read, write: if false; } } }");
      await C.evaluate(() => LM.aggiungiAzione('con permessi negati', null)); await C.waitForTimeout(4000);
      const neg = await C.evaluate(() => ({ sync: window.LM_SYNC, toast: [...document.querySelectorAll('.toast')].map((t) => t.textContent).join(' / ') }));
      ok('11 il cloud rifiuta: il messaggio non parla di regole, Firestore o console', !/regole|Firestore|console|permission|auth\//i.test(neg.toast + ' ' + (neg.sync && neg.sync.error)), neg);
      await N.regole(E.regole);
      await C.evaluate(() => LM.cattura('dopo le regole rimesse')); await B.calma(C, 6000);
      ok('11 regole rimesse a posto: la modifica fatta durante il blocco arriva, senza ricaricare', (await azCloud(uid)).includes('con permessi negati'), await azCloud(uid));
      /* l'accesso da un indirizzo non autorizzato: parole per chi usa l'app */
      await C.evaluate(() => { window.__popupFail = 'auth/unauthorized-domain'; });
      await C.evaluate(() => window.LMCloud.signOut()); await C.waitForTimeout(800);
      await C.evaluate(() => window.LMCloud.signIn()); await C.waitForTimeout(800);
      const fin = await C.evaluate(() => { const d = document.querySelector('[role=alertdialog]'); return d ? d.textContent : ''; });
      ok('11 accesso da un indirizzo non autorizzato: niente «Firebase» né menu della console', !!fin && !/Firebase|Authentication|Impostazioni →|domini autorizzati/i.test(fin), fin);
      await C.ctx.close();
    }
    /* -------------------------------------- 14. due schede scrivono insieme */
    {
      await N.pulisci();
      const T1 = await B.dispositivo('scheda1');
      await B.accedi(T1, 'mario', 'mario@prova.it');
      const uid = await B.uidDi(T1);
      const T2 = await B.dispositivo('scheda2', { ctx: T1.ctx }); await T2.waitForTimeout(2500);
      /* tutte e due scrivono «insieme»: la seconda non ha ancora ricevuto
         l'evento della prima */
      await Promise.all([
        T1.evaluate(() => { for (let i = 0; i < 5; i++) LM.aggiungiAzione('scheda uno ' + i, null); }),
        T2.evaluate(() => { for (let i = 0; i < 5; i++) LM.aggiungiAzione('scheda due ' + i, null); })
      ]);
      await B.calmaTutti([T1, T2], 4000);
      const nel = await salvatoNelDispositivo(T1);
      const c = await azCloud(uid);
      const tutte = (v) => [0, 1, 2, 3, 4].every((i) => v.includes('scheda uno ' + i) && v.includes('scheda due ' + i));
      ok('14 due schede scrivono insieme: sul dispositivo ci sono tutte e dieci le cose', tutte(nel.join('|')), nel);
      ok('14 …e anche nel cloud, e in tutte e due le schede', tutte(c) && tutte(await az(T1)) && tutte(await az(T2)), { cloud: c });
      await T1.ctx.close();
    }
    for (const p of B.tutti) if (p.__err.length) ok('nessun errore in pagina su ' + p.__nome, false, p.__err.slice(0, 2));
  } catch (e) {
    ok('la prova è arrivata in fondo', false, String(e && e.stack || e));
  } finally {
    await B.chiudi(); srv.close(); await E.spegni();
  }
  console.log(guai() ? '\n' + guai() + ' problemi' : '\ntutto a posto');
  process.exit(guai() ? 1 : 0);
})();
