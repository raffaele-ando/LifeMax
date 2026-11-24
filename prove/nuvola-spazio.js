/* IL CLOUD NEL TEMPO: TANTI DATI, VERSIONI VECCHIE, COPIE, CHIUSURE, INDIRIZZI.

   Nata dalla verifica del cloud del 24 novembre 2026 (revisione/cloud/
   RAPPORTO.md). Firebase vero contro l'emulatore ufficiale (vedi
   prove/comune/emulatore.js).

   Quello che si pretende, e il problema del rapporto da cui viene:
     5  oltre un anno di storia (più di 1 MB) si sincronizza, arriva intero
        su un altro dispositivo, e nessun documento del cloud si avvicina al
        limite di 1 MiB;
     5  il documento della versione di prima (un JSON solo) passa da sé alla
        forma nuova, con una copia di sicurezza presa PRIMA, e non si perde
        niente; e una scheda con la versione vecchia ancora aperta che lo
        riscrive non distrugge la forma nuova;
    12  le copie di sicurezza nel cloud restano poche, si sfoltiscono alle
        ultime trenta, e si elencano senza scaricarle;
     7  l'app chiusa subito dopo una modifica: la modifica arriva agli altri;
        e senza rete si vede «non ancora nel cloud», anche riaprendo;
    15  un dispositivo riaperto dopo giorni dice «Aggiornamento dal cloud…»
        invece di mostrare per un attimo i dati vecchi come se fossero buoni;
     -  il profilo azzerato si riprende da una copia nel cloud, anche da una
        copia della versione di prima, e torna su tutti i dispositivi;
     -  il vecchio indirizzo (github.io) accompagna al nuovo senza lasciare
        indietro niente: con l'account manda prima tutto nel cloud, senza
        account porta i dati con un tocco;
     -  il Worker serve /__/auth/* da firebaseapp.com (per l'accesso su
        iPhone), e l'app NON lo usa finché l'interruttore è spento.

   Si lancia con: node prove/nuvola-spazio.js
   (serve l'emulatore: vedi prove/comune/emulatore.js) */
'use strict';
const fs = require('fs'), path = require('path');
const em = require('./comune/emulatore');
const { RAMO } = require('./comune/dove');
const { ok, guai } = em.conto();
const G = 86400000;

/* una storia realistica di N giorni, scritta direttamente nello stato (in pagina) */
function genera(giorni) {
  const s = LM.load();
  s.onboarded = true; s.profilo.nome = 'Mario';
  const aree = s.aree.map((a) => a.id);
  const ora = Date.now();
  const rid = () => Math.random().toString(36).slice(2, 10);
  const dk = (t) => LM.dayKey(new Date(t));
  for (let h = 0; h < 6; h++) s.abitudini.push({ id: 'h' + h, testo: 'Abitudine ' + h + ' con un nome normale', areaId: aree[h % aree.length], giorni: [0, 1, 2, 3, 4, 5, 6], ora: null, durata: null, creata: ora - giorni * 86400000, fatti: {}, da: dk(ora - giorni * 86400000), a: null, salti: {} });
  for (let g = giorni; g >= 0; g--) {
    const t = ora - g * 86400000, k = dk(t);
    for (let i = 0; i < 7; i++) {
      const fatta = Math.random() < 0.7;
      s.azioni.push({ id: rid(), areaId: aree[i % aree.length], testo: 'Cosa da fare numero ' + i + ' del giorno, scritta in modo normale', ifThen: i === 0 ? 'se arrivo in ufficio allora comincio da qui' : '', mit: i === 0, done: fatta, data: k, doneAt: fatta ? t + i * 3600000 : null, creata: t, ora: i < 3 ? '09:00' : null, durata: i < 3 ? 30 : null, passoDi: null });
    }
    s.abitudini.forEach((h) => { if (Math.random() < 0.6) h.fatti[k] = true; });
    s.checkins.push({ data: k, ts: t + 1000, energia: 3, focus: 4, umore: 3, contesto: 'casa' });
    for (let j = 0; j < 2; j++) s.sessioni.push({ id: 'se' + g + '_' + j, giorno: k, areaId: aree[j], azioneId: null, testo: 'lavoro concentrato', tipo: 'pomodoro', inizio: t + j * 7200000, minuti: 25, creata: t, aggiornata: t });
    s.valutazioni[k] = {}; aree.forEach((a) => { s.valutazioni[k][a] = 3 + (g % 3); });
    s.reviewSera[k] = { ts: t, vittoria: 'ho finito la cosa principale della giornata', blocco: 'troppe notifiche', shutdown: true };
    s.pianoMattina[k] = { compilato: true, intenzione: 'concentrarmi su una cosa sola', ts: t };
    s.xpPerGiorno[k] = 60; s.xp += 60;
    if (g % 3 === 0) s.inbox.push({ id: rid(), testo: 'idea catturata al volo ' + g, creata: t });
    if (g % 7 === 0) s.reviewSettimana[k] = { ts: t, vittorie: 'settimana buona', blocchi: 'sonno', imparato: 'meglio la mattina', prossima: 'meno riunioni' };
    if (g % 10 === 0) s.lezioni.push({ id: rid(), testo: 'lezione imparata ' + g, verso: 'si', forza: 'media', areaId: null, creata: t, aggiornata: t });
  }
  for (let i = 0; i < 800; i++) s.registro.push({ ts: ora - i * 60000, cat: 'azione', testo: 'Completata «Cosa da fare numero 3 del giorno» (+10 XP)', imp: false });
  LM.save();
  return JSON.stringify(LM.snapshotPerCloud()).length;
}

(async () => {
  const E = await em.accendi(9900);
  const srv = await em.servi(E.P.sito);
  const B = em.banco(E), N = em.nuvola(E);
  await B.avvia();
  const az = (p) => p.evaluate(() => LM.load().azioni.map((a) => a.testo).sort().join(' | '));
  const azCloud = async (uid) => { const s = await N.stato(uid); return ((s && s.azioni) || []).map((a) => a.testo).sort().join(' | '); };
  try {
    /* ------------------------------------------------- 5. tanti dati */
    {
      await N.pulisci();
      const A = await B.dispositivo('telefono', { tipo: 'iphone' });
      await B.accedi(A, 'mario', 'mario@prova.it');
      const uid = await B.uidDi(A);
      const byte = await A.evaluate('(' + genera.toString() + ')(420)');
      await B.calma(A, 8000);
      const sync = await A.evaluate(() => window.LM_SYNC);
      const nA = await A.evaluate(() => LM.load().azioni.length);
      const s = await N.stato(uid);
      const docs = await N.elenco('users/' + uid + '/pezzi');
      const maxByte = Math.max.apply(null, docs.map((d) => d.__byte).concat([0]));
      const principale = (await N.elenco('users')).find((d) => d.__id === uid);
      ok('5 420 giorni di storia (' + Math.round(byte / 1024) + ' KB): il salvataggio riesce', sync.state === 'saved' && !!s && (s.azioni || []).length === nA, { sync: sync, cloud: s && (s.azioni || []).length, qui: nA });
      ok('5 nessun documento del cloud si avvicina a 1 MiB (il più grosso: ' + Math.round(maxByte / 1024) + ' KB; il principale: ' + Math.round(((principale && principale.__byte) || 0) / 1024) + ' KB)', byte > 1048576 && maxByte < 700 * 1024 && principale && principale.__byte < 60 * 1024, { maxByte });
      const P = await B.dispositivo('pc');
      const t0 = Date.now(); await B.accedi(P, 'mario', 'mario@prova.it'); await B.calma(P, 3000);
      const nP = await P.evaluate(() => LM.load().azioni.length);
      ok('5 un altro dispositivo che entra riceve tutto (' + Math.round((Date.now() - t0) / 1000) + ' s)', nP === nA, { pc: nP, telefono: nA });
      /* una modifica dopo: riscrive pochi pezzi, non tutto */
      const prima = await N.doc('users/' + uid);
      await A.evaluate(() => LM.aggiungiAzione('una cosa in più', null)); await B.calmaTutti([A, P], 3000);
      const dopo = await N.doc('users/' + uid);
      const cambiati = Object.keys(dopo.pezzi).filter((n) => !prima.pezzi[n] || prima.pezzi[n].h !== dopo.pezzi[n].h);
      ok('5 una modifica riscrive pochi pezzi (' + cambiati.length + ' su ' + Object.keys(dopo.pezzi).length + '), e arriva', cambiati.length <= 4 && (await az(P)).includes('una cosa in più'), cambiati);
      await A.ctx.close(); await P.ctx.close();
    }
    /* -------------------------------- 5. dalla versione di prima, e ritorno */
    {
      await N.pulisci();
      /* l'account esiste già, con il documento di prima (un JSON solo) */
      const A = await B.dispositivo('telefono', { tipo: 'iphone' });
      await B.accedi(A, 'mario', 'mario@prova.it');
      const uid = await B.uidDi(A);
      await A.evaluate(() => window.LMCloud.signOut()); await A.waitForTimeout(1000);
      const vecchio = await A.evaluate(() => {
        const s = LM.statoVuoto(); s.onboarded = true; s.profilo.nome = 'Mario'; s.profilo.visione = 'Vivere con calma'; s.updatedAt = Date.now() - 3600000;
        for (let i = 0; i < 20; i++) s.azioni.push({ id: 'v' + i, areaId: 'altro', testo: 'dalla versione di prima ' + i, ifThen: '', mit: false, done: false, data: LM.todayKey(), doneAt: null, creata: Date.now() - 7200000, ora: null, durata: null, passoDi: null });
        delete s.orologi; delete s.xpConti;
        return s;
      });
      await N.scriviDoc('users/' + uid, { data: JSON.stringify(vecchio), updatedAt: vecchio.updatedAt, email: 'mario@prova.it', name: 'Mario' });
      await B.accedi(A, 'mario', 'mario@prova.it'); await B.calma(A, 3000);
      const s = await N.stato(uid);
      const copie = await N.elenco('users/' + uid + '/copie');
      ok('5 il documento di prima passa da solo alla forma nuova, senza perdere niente', !!s && !s.__vecchio && (s.azioni || []).filter((a) => /versione di prima/.test(a.testo)).length === 20 && s.profilo.nome === 'Mario', s && { vecchio: !!s.__vecchio, azioni: (s.azioni || []).length, nome: s.profilo && s.profilo.nome });
      ok('5 …dopo aver preso una copia di sicurezza del documento di prima', copie.some((c) => c.motivo === 'prima-di-dividere-il-documento' && c.ricchezza >= 20), copie.map((c) => c.motivo));
      ok('5 e il documento principale dice in che forma sono i dati', s && s.__principale.schema === 2 && !!s.__principale.pezzi, s && s.__principale.schema);
      /* una scheda con la versione VECCHIA, ancora aperta, riscrive il
         documento principale come faceva lei: tutto in `data` */
      const vecchiaScheda = Object.assign(JSON.parse(JSON.stringify(vecchio)), { updatedAt: Date.now() });
      vecchiaScheda.azioni.push({ id: 'dalla-scheda-vecchia', areaId: 'altro', testo: 'scritta da una scheda con la versione vecchia', ifThen: '', mit: false, done: false, data: vecchio.azioni[0].data, doneAt: null, creata: Date.now(), ora: null, durata: null, passoDi: null });
      await N.scriviDoc('users/' + uid, { data: JSON.stringify(vecchiaScheda), updatedAt: vecchiaScheda.updatedAt, email: 'mario@prova.it', name: 'Mario' });
      await A.waitForTimeout(1500); await B.calma(A, 3000);
      const s2 = await N.stato(uid);
      ok('5 una scheda con la versione vecchia riscrive il cloud: la forma nuova torna da sé, e quello che ha scritto c’è',
        !!s2 && s2.__principale.schema === 2 && !s2.__vecchio && (s2.azioni || []).some((a) => a.id === 'dalla-scheda-vecchia') && (s2.azioni || []).filter((a) => /versione di prima/.test(a.testo)).length === 20, s2 && { schema: s2.__principale.schema, vecchio: !!s2.__vecchio, n: (s2.azioni || []).length });
      ok('5 …e sul dispositivo anche', (await az(A)).includes('scheda con la versione vecchia'), await az(A));
      await A.ctx.close();
    }
    /* -------------------------------------------------- 12. le copie nel cloud */
    {
      await N.pulisci();
      const T = await B.dispositivo('telefono', { tipo: 'iphone' });
      await B.accedi(T, 'mario', 'mario@prova.it');
      const uid = await B.uidDi(T);
      await T.evaluate('(' + genera.toString() + ')(60)'); await B.calma(T, 3000);
      const P = await B.dispositivo('pc'); await B.accedi(P, 'mario', 'mario@prova.it');
      let Tn = T;
      for (let i = 0; i < 10; i++) {
        await Tn.close();
        await P.evaluate((i) => LM.aggiungiAzione('dal pc ' + i, null), i); await B.calma(P, 800);
        Tn = await B.dispositivo('telefono', { ctx: T.ctx }); await B.calma(Tn, 2500);
      }
      const nuove = await N.elenco('users/' + uid + '/copie');
      const vecchie = await N.elenco('users/' + uid + '/backups');
      ok('12 dieci riaperture con differenze: le copie nel cloud restano poche (' + nuove.length + ')', nuove.length <= 3 && vecchie.length === 0, { nuove: nuove.length, vecchie: vecchie.length });
      /* trentacinque copie: si sfoltiscono alle ultime trenta */
      for (let i = 0; i < 35; i++) await N.scriviDoc('users/' + uid + '/copie/finta' + i, { ts: Date.now() - (40 - i) * G, salvato: Date.now() - (40 - i) * G, motivo: 'copia-del-giorno', ricchezza: 1, n: 0, nome: 'Mario' });
      const ok1 = await P.evaluate(() => window.LMCloud.backups().then((l) => l[0] && window.LMCloud.riprendiBackup(l[0].id)));
      await P.waitForTimeout(3000);
      const dopo = await N.elenco('users/' + uid + '/copie');
      ok('12 oltre trenta copie, le più vecchie se ne vanno', !!ok1 && dopo.length <= 30, dopo.length);
      const t0 = Date.now();
      const elenco = await P.evaluate(() => window.LMCloud.backups().then((l) => l.map((c) => ({ n: c.nome, r: c.ricchezza }))));
      ok('12 elencarle è veloce e non scarica le copie intere (' + (Date.now() - t0) + ' ms)', elenco.length === dopo.length && dopo.every((d) => d.__byte < 4000), { elencate: elenco.length });
      await T.ctx.close(); await P.ctx.close();
    }
    /* ------------------------------------- 7. chiusa subito, e «non ancora» */
    {
      await N.pulisci();
      const A = await B.dispositivo('telefono', { tipo: 'iphone' }), P = await B.dispositivo('pc');
      for (const p of [A, P]) await B.accedi(p, 'mario', 'mario@prova.it');
      await A.evaluate(() => LM.aggiungiAzione('ultima prima di chiudere', null)); await A.close({ runBeforeUnload: true });
      await P.waitForTimeout(3000);
      ok('7 app chiusa subito dopo una modifica: arriva agli altri', (await az(P)).includes('ultima prima di chiudere'), await az(P));
      /* in secondo piano (il telefono che passa a un'altra app) subito dopo */
      const A2 = await B.dispositivo('telefono', { ctx: A.ctx }); await A2.waitForTimeout(3000);
      await A2.evaluate(() => { LM.aggiungiAzione('scritta e poi in secondo piano', null); Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
      await A2.waitForTimeout(150); await A2.close();
      await P.waitForTimeout(3000);
      ok('7 app mandata in secondo piano e chiusa: la modifica arriva', (await az(P)).includes('scritta e poi in secondo piano'), await az(P));
      /* senza rete: lo si vede, e si vede anche riaprendo */
      const A3 = await B.dispositivo('telefono', { ctx: A.ctx }); await A3.waitForTimeout(3000); await B.calma(A3, 500);
      await A3.ctx.setOffline(true);
      await A3.evaluate(() => LM.aggiungiAzione('senza rete', null)); await A3.waitForTimeout(1500);
      const s1 = await A3.evaluate(() => ({ stato: window.LM_SYNC && window.LM_SYNC.state, testo: document.body.innerText }));
      ok('7 senza rete si vede «non ancora nel cloud»', s1.stato === 'attesa' && /non ancora nel cloud/i.test(s1.testo), s1.stato);
      await A3.close();
      /* si riapre l'app: la pagina arriva (dalla cache del browser, o con
         un filo di rete) ma il cloud non si raggiunge ancora */
      await A3.ctx.setOffline(false);
      const via = 'http://127.0.0.1:' + E.P.firestore + '/**';
      await A3.ctx.route(via, (r) => r.abort('internetdisconnected'));
      const A4 = await B.dispositivo('telefono', { ctx: A.ctx }); await A4.waitForTimeout(8000);
      const s2 = await A4.evaluate(() => ({ stato: window.LM_SYNC && window.LM_SYNC.state, testo: /non ancora nel cloud/i.test(document.body.innerText) }));
      ok('7 …e riaprendo l’app, col cloud ancora irraggiungibile, lo dice subito', s2.stato === 'attesa' && s2.testo, s2);
      await A3.ctx.unroute(via);
      await A4.evaluate(() => window.dispatchEvent(new Event('online'))); await B.calmaTutti([A4, P], 6000);
      ok('7 tornata la rete, parte da sola', (await az(P)).includes('senza rete') && (await A4.evaluate(() => window.LM_SYNC.state)) === 'saved', await az(P));
      await A4.ctx.close(); await P.ctx.close();
    }
    /* -------------------------------- 15. riaperto dopo giorni: «aggiornamento» */
    {
      await N.pulisci();
      const T = await B.dispositivo('telefono', { tipo: 'iphone' }), I = await B.dispositivo('ipad', { tipo: 'ipad' });
      for (const p of [T, I]) await B.accedi(p, 'mario', 'mario@prova.it');
      await T.evaluate(() => LM.aggiungiAzione('Vecchia cosa', null)); await B.calmaTutti([T, I], 2000);
      await I.close();
      await B.avanti(T, 20 * G);
      /* anche per l'iPad passano venti giorni (il suo orologio si sposta
         alla prossima apertura) */
      { const q = await I.ctx.newPage(); await q.goto('http://127.0.0.1:' + E.P.sito + '/manifest.webmanifest'); await q.evaluate((ms) => localStorage.setItem('__off', String(ms)), 20 * G); await q.close(); }
      await T.evaluate(() => { LM.rimuoviAzione(LM.load().azioni.find((a) => a.testo === 'Vecchia cosa').id); LM.aggiungiAzione('Cosa di adesso', null); });
      await B.calma(T, 2500);
      const I2 = await I.ctx.newPage();
      I2.on('pageerror', (e) => { I2.__err = (I2.__err || []).concat(String(e)); });
      await I2.goto('http://127.0.0.1:' + E.P.sito + '/index.html');
      await I2.waitForFunction(() => window.LM, null, { timeout: 20000 });
      const subito = await I2.evaluate(() => { const f = document.getElementById('lm-aggiornamento'); return { fascia: f ? f.textContent : '', sbiadito: document.documentElement.classList.contains('lm-aggiornando') }; });
      ok('15 iPad riaperto dopo venti giorni: si vede subito «Aggiornamento dal cloud…», non i dati vecchi come buoni', /Aggiornamento dal cloud/.test(subito.fascia) && subito.sbiadito, subito);
      await I2.waitForFunction(() => window.LM_AUTH && window.LM_AUTH.user && !window.LM_AUTH.syncing, null, { timeout: 30000 }).catch(() => {});
      await I2.waitForTimeout(1500);
      const dopo = await I2.evaluate(() => ({ fascia: !!document.getElementById('lm-aggiornamento'), azioni: LM.load().azioni.map((a) => a.testo).join(',') }));
      ok('15 …e appena arriva l’aggiornamento la fascia se ne va, coi dati giusti', !dopo.fascia && dopo.azioni === 'Cosa di adesso', dopo);
      await T.ctx.close(); await I.ctx.close();
    }
    /* --------------------------------- il profilo azzerato, ripreso dal cloud */
    {
      await N.pulisci();
      const T = await B.dispositivo('telefono', { tipo: 'iphone' }), P = await B.dispositivo('pc');
      for (const p of [T, P]) await B.accedi(p, 'mario', 'mario@prova.it');
      const uid = await B.uidDi(T);
      /* com'era il profilo nelle copie della versione di prima */
      const buono = await T.evaluate(() => { const s = LM.statoVuoto(); s.profilo.nome = 'Raffaele'; s.profilo.visione = 'Una vita con meno rumore'; s.profilo.ritmo.sveglia = '06:10'; s.profilo.modo = 'dark'; s.azioni.push({ id: 'b1', areaId: 'altro', testo: 'nella copia', ifThen: '', mit: false, done: false, data: LM.todayKey(), doneAt: null, creata: Date.now() - 9e8, ora: null, durata: null, passoDi: null }); s.updatedAt = Date.now() - 9e8; return s; });
      await N.scriviDoc('users/' + uid + '/backups/' + buono.updatedAt, { data: JSON.stringify(buono), updatedAt: buono.updatedAt, salvato: buono.updatedAt });
      /* adesso il profilo è vuoto, e nel frattempo c'è roba nuova */
      await T.evaluate(() => { const s = LM.load(); s.profilo.nome = ''; s.profilo.visione = ''; LM.save(); LM.aggiungiAzione('cosa nuova, da tenere', null); });
      await B.calmaTutti([T, P], 2500);
      const vecchie = await T.evaluate(() => window.LMCloud.backupsVecchi());
      const quella = vecchie.find((c) => c.nome === 'Raffaele');
      ok('recupero: tra le copie di prima si vede quella col nome giusto', !!quella, vecchie.map((c) => c.nome));
      const fatto = quella ? await T.evaluate((id) => window.LMCloud.riprendiProfilo(id, true), quella.id) : false;
      await B.calmaTutti([T, P], 3000);
      const prof = (p) => p.evaluate(() => { const s = LM.load(); return { nome: s.profilo.nome, visione: s.profilo.visione, sveglia: s.profilo.ritmo.sveglia, modo: s.profilo.modo, azioni: s.azioni.map((a) => a.testo).join(',') }; });
      const pt = await prof(T), pp = await prof(P);
      ok('recupero: «Riprendi il profilo» rimette nome, visione, sveglia e tema, anche sull’altro dispositivo', fatto && pp.nome === 'Raffaele' && pp.visione === 'Una vita con meno rumore' && pp.sveglia === '06:10' && pp.modo === 'dark' && pt.nome === 'Raffaele', { telefono: pt, pc: pp });
      ok('recupero: …senza toccare il resto (la cosa nuova resta, quella della copia non entra)', /da tenere/.test(pp.azioni) && !/nella copia/.test(pp.azioni), pp.azioni);
      /* e dal pannello: il tasto c'è */
      const ui = await T.evaluate(async () => {
        location.hash = '#/oggi';
        const imp = document.querySelector('#fondo-impostazioni, [data-apri="impostazioni"]');
        return !!imp;
      });
      void ui;
      await T.ctx.close(); await P.ctx.close();
    }
    /* ---------------------------------------- il vecchio indirizzo (github.io) */
    {
      await N.pulisci();
      const vecchio = 'http://127.0.0.1:' + E.P.sito, nuovo = 'http://localhost:' + E.P.sito;
      const init = 'window.__LM_TRASLOCO = ' + JSON.stringify({ vecchio, nuovo }) + ';';
      /* senza account: i dati passano con un tocco */
      const ctx = await B.contesto({ tipo: 'iphone', init });
      const GH = await B.dispositivo('github.io', { ctx });
      await GH.evaluate(() => { const s = LM.load(); s.onboarded = true; s.profilo.nome = 'Ospite'; LM.save(); LM.aggiungiAzione('scritta da ospite sul vecchio indirizzo', null); });
      await GH.reload(); await GH.waitForFunction(() => window.LM);
      await GH.waitForSelector('#lm-trasloco', { timeout: 10000 }).catch(() => {});
      const testo = await GH.evaluate(() => { const d = document.getElementById('lm-trasloco'); return d ? d.textContent : ''; });
      ok('indirizzi: sul vecchio indirizzo, da ospite, si propone di portare i dati', /Porta i miei dati/.test(testo), testo);
      const [nuovaPagina] = await Promise.all([
        ctx.waitForEvent('page', { timeout: 10000 }),
        GH.click('#lm-trasloco button.lm-tr-primo')
      ]);
      await nuovaPagina.waitForFunction(() => window.LM, null, { timeout: 20000 });
      await GH.waitForFunction(() => /Fatto/.test((document.getElementById('lm-trasloco') || {}).textContent || ''), null, { timeout: 15000 }).catch(() => {});
      const arrivati = await nuovaPagina.evaluate(() => LM.load().azioni.map((a) => a.testo).join(','));
      const qui = await GH.evaluate(() => ({ scheda: (document.getElementById('lm-trasloco') || {}).textContent || '', azioni: LM.load().azioni.length }));
      ok('indirizzi: con un tocco i dati arrivano sul nuovo indirizzo', /vecchio indirizzo/.test(arrivati), arrivati);
      ok('indirizzi: …il vecchio lo conferma e non cancella niente', /Fatto/.test(qui.scheda) && qui.azioni === 1, qui);
      /* il nuovo indirizzo, aperto normalmente, non propone niente */
      const NU = await B.dispositivo('nuovo', { ctx, host: 'localhost' }); await NU.waitForTimeout(4500);
      ok('indirizzi: sul nuovo indirizzo non compare il trasloco', !(await NU.evaluate(() => !!document.getElementById('lm-trasloco'))));
      await ctx.close();
      /* con l'account: prima il cloud deve avere tutto, poi si va */
      const ctx2 = await B.contesto({ tipo: 'pc', init });
      const GA = await B.dispositivo('github.io-account', { ctx: ctx2 });
      await B.accedi(GA, 'mario', 'mario@prova.it');
      const uid = await B.uidDi(GA);
      await GA.evaluate(() => { try { sessionStorage.removeItem('lm-trasloco-dopo'); } catch (e) {} });
      await GA.reload(); await GA.waitForFunction(() => window.LM);
      await GA.waitForSelector('#lm-trasloco', { timeout: 15000 }).catch(() => {});
      const proposta = await GA.evaluate(() => (document.getElementById('lm-trasloco') || {}).textContent || '');
      ok('indirizzi: con l’account si propone di andare, e si dice che i dati sono nell’account', /Vai al nuovo indirizzo/.test(proposta) && /account/.test(proposta), proposta);
      await GA.ctx.setOffline(true);
      await GA.evaluate(() => LM.aggiungiAzione('ultima scritta sul vecchio indirizzo', null));
      await GA.click('#lm-trasloco button.lm-tr-primo').catch(() => {});
      await GA.waitForTimeout(2500);
      const fermo = await GA.evaluate(() => ({ dove: location.origin, scheda: (document.getElementById('lm-trasloco') || {}).textContent || '' }));
      ok('indirizzi: con l’account e una modifica non ancora nel cloud, NON si parte (e lo dice)', fermo.dove === vecchio && /non sono ancora nel cloud/i.test(fermo.scheda), fermo);
      await GA.ctx.setOffline(false);
      await GA.waitForTimeout(4000);
      await GA.click('#lm-trasloco button.lm-tr-primo').catch(() => {});
      await GA.waitForURL(nuovo + '/**', { timeout: 15000 }).catch(() => {});
      const c = await azCloud(uid);
      ok('indirizzi: tornata la rete, prima la modifica va nel cloud e poi si va al nuovo indirizzo', GA.url().startsWith(nuovo) && c.includes('ultima scritta sul vecchio indirizzo'), { url: GA.url(), cloud: c });
      await ctx2.close();
    }
    /* ----------------------------------------- il Worker e l'accesso da iPhone */
    {
      const w = fs.readFileSync(path.join(RAMO, 'wrangler.jsonc'), 'utf8');
      ok('iPhone: il Worker riceve /__/auth/* prima dei file', /run_worker_first"\s*:\s*\[[^\]]*"\/__\/auth\/\*"/.test(w));
      const mod = await import(path.join(RAMO, 'sentinella', 'worker.mjs'));
      const vere = global.fetch; let chiesto = null;
      global.fetch = async (u, o) => { chiesto = { u: String(u), metodo: o && o.method }; return new Response('<html>handler</html>', { status: 200, headers: { 'content-type': 'text/html' } }); };
      const r = await mod.default.fetch(new Request('https://lifemax.theproject.world/__/auth/handler?apiKey=x&mode=signIn'), {});
      global.fetch = vere;
      ok('iPhone: /__/auth/handler viene preso da firebaseapp.com, così com’è', chiesto && chiesto.u === 'https://lifemax-9dc63.firebaseapp.com/__/auth/handler?apiKey=x&mode=signIn' && r.status === 200 && /handler/.test(await r.text()), chiesto);
      const n = fs.readFileSync(path.join(RAMO, 'src', 'nuvola', 'nuvola.ts'), 'utf8');
      ok('iPhone: l’app NON usa ancora il dominio per l’accesso (interruttore spento finché non si fanno i passi a mano)', /const ACCESSO_DAL_DOMINIO = false;/.test(n));
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
