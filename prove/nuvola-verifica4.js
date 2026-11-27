/* LA QUARTA VERIFICA (27 novembre 2026, revisione/cloud4/RAPPORTO.md), col
   cloud vero in piccolo. Ogni parte è un riproduttore della verifica,
   diventato una prova che resta: falliva sul codice di allora (a354d5c).
     annulla     V4-01  «Annulla» dal Diario, il messaggino dei sette secondi
                        e «Rimetti» disfano IL GESTO: quello che nel
                        frattempo è arrivato dagli altri dispositivi resta,
                        su tutti; e se una cosa toccata dal gesto è cambiata
                        altrove, non si tocca niente e lo si dice
     spazio      V4-02  con mesi di dati le copie di sicurezza si fanno
                        ancora; e quando proprio non c'è posto, «Ripristina»
                        si ferma e offre di scaricare un file invece di
                        andare avanti senza copia
     rete        V4-03  una richiesta appesa non blocca la sincronizzazione
                        fino alla ricarica
     orologio    V4-04  un orologio andato avanti di giorni, una volta sola:
                        le modifiche fatte dopo vincono, anche sullo stesso
                        dispositivo
     calendario  V4-05  annullare la rimozione di una riunione già cancellata
                        su Google non dice «Annullato» per poi farla sparire
     copie       V4-06  ritoccare la visione non butta fuori dal cloud le
                        copie dei giorni prima
     timer       V4-07  un timer avviato senza rete non lo spegne una modifica
                        qualunque fatta su un altro dispositivo
   node prove/nuvola-verifica4.js [parte…]   (CHROMIUM=/percorso/di/chrome se serve) */
'use strict';
const em = require('./comune/emulatore');
const { ok, guai } = em.conto();
const H = 3600000, GIORNO = 24 * H;
const scelte = process.argv.slice(2);
const parte = (n) => !scelte.length || scelte.indexOf(n) >= 0;

/* GOOGLE FINTO, come in prove/nuvola-calendario.js: la libreria GIS e
   l'API Calendar servite dal banco, un calendario «Lavoro» in memoria */
const G = { token: new Set(), n: 0, eventi: {} };
let etag = 0;
const nuovoEtag = () => '"e' + (++etag) + '"';
const rispondi = (route, stato, corpo) => route.fulfill({ status: stato, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: corpo === undefined ? '' : JSON.stringify(corpo) });
async function googleApi(route) {
  const q = route.request(); const u = new URL(q.url()); const metodo = q.method();
  if (metodo === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' } });
  const tok = (q.headers()['authorization'] || '').replace('Bearer ', '');
  const via = decodeURIComponent(u.pathname.replace('/calendar/v3', ''));
  const corpo = q.postData() ? JSON.parse(q.postData()) : null;
  if (!G.token.has(tok)) return rispondi(route, 401, { error: { message: 'Invalid Credentials' } });
  if (via === '/users/me/calendarList') return rispondi(route, 200, { items: [{ id: 'io@esempio.it', summary: 'io', primary: true, accessRole: 'owner' }, { id: 'lavoro@gruppo', summary: 'Lavoro', accessRole: 'writer' }] });
  const m = /^\/calendars\/([^/]+)\/events(?:\/(.+))?$/.exec(via);
  if (!m) return rispondi(route, 404, { error: { message: 'no' } });
  const cal = G.eventi[m[1]] || (G.eventi[m[1]] = {});
  const id = m[2];
  if (!id && metodo === 'GET') return rispondi(route, 200, { items: Object.values(cal) });
  if (!id && metodo === 'POST') { const nid = corpo.id || ('n' + Date.now()); cal[nid] = Object.assign({ status: 'confirmed' }, corpo, { id: nid, etag: nuovoEtag() }); return rispondi(route, 200, cal[nid]); }
  const e = cal[id];
  if (!e) return rispondi(route, 404, { error: { message: 'Not Found' } });
  if (metodo === 'GET') return rispondi(route, 200, e);
  if (metodo === 'DELETE') { delete cal[id]; return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*' }, body: '' }); }
  if (metodo === 'PATCH') { Object.keys(corpo).forEach((k) => { e[k] = corpo[k]; }); e.etag = nuovoEtag(); return rispondi(route, 200, e); }
  return rispondi(route, 405, {});
}
const GIS_FINTA = `
window.google = { accounts: { oauth2: {
  initTokenClient: function (cfg) { return { requestAccessToken: function () {
    fetch('https://accounts.google.com/__permesso').then(function (r) { return r.json(); })
      .then(function (j) { cfg.callback({ access_token: j.t, expires_in: 3599, scope: cfg.scope }); }); } }; },
  hasGrantedAllScopes: function () { return true; }, revoke: function () {}
} } };`;

(async () => {
  const E = await em.accendi(9500);
  const srv = await em.servi(E.P.sito, process.env.LIFEMAX_SITO);
  const B = em.banco(E), N = em.nuvola(E);
  await B.avvia();
  const FS = 'http://127.0.0.1:' + E.P.firestore + '/**';
  const testi = (p) => p.evaluate(() => LM.load().azioni.map((a) => a.testo));
  const riapri = async (d) => { await d.reload(); await d.waitForFunction(() => window.LM, null, { timeout: 20000 }); };
  const alDiario = async (p) => {
    await p.evaluate(() => { location.hash = '#/oggi'; }); await p.waitForTimeout(300);
    await p.evaluate(() => { location.hash = '#/profilo'; }); await p.waitForTimeout(700);
    await p.evaluate(() => { const t = document.getElementById('imp-diario'); if (t) t.click(); }); await p.waitForTimeout(700);
    await p.evaluate(() => { const t = [...document.querySelectorAll('#diario-filtro button')].find((x) => /Tutto/.test(x.textContent)); if (t) t.click(); }); await p.waitForTimeout(600);
  };
  /* il tasto «Annulla» del diario sulla riga che dice `re` */
  const annullaRiga = (p, re) => p.evaluate((s) => {
    const r = [...document.querySelectorAll('.diario-evento')].find((e) => new RegExp(s).test(e.textContent) && e.querySelector('[data-annulla]'));
    if (!r) return null;
    const b = r.querySelector('[data-annulla]');
    const pt = LM.puntoDiRitorno(+b.getAttribute('data-annulla'));
    b.click();
    return { dopo: pt && pt.dopo, avviso: !!document.querySelector('.avviso-ovl') };
  }, re);
  const messaggi = (p) => p.evaluate(() => [...document.querySelectorAll('.toast')].map((x) => x.textContent.replace(/\s+/g, ' ').trim()));
  try {
    /* ============================================================ V4-01 */
    if (parte('annulla')) {
      await N.pulisci();
      const P = await B.dispositivo('pc'), T = await B.dispositivo('telefono', { tipo: 'iphone' });
      await B.accedi(P, 'anna', 'anna@prova.it'); await B.accedi(T, 'anna', 'anna@prova.it');
      const uid = await B.uidDi(P);
      await P.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); });
      await B.calmaTutti([P, T], 2000);
      for (const d of [P, T]) { await riapri(d); await d.waitForFunction(() => window.LM_AUTH && window.LM_AUTH.user, null, { timeout: 20000 }); }
      await B.calmaTutti([P, T], 2000);
      await P.evaluate(() => { LM.aggiungiAzione('Cosa da togliere', null); LM.aggiungiAzione('Bozza relazione', null); });
      await B.calmaTutti([P, T], 3000);
      await P.evaluate(() => { const a = LM.load().azioni.find((x) => x.testo === 'Cosa da togliere'); LM.rimuoviAzione(a.id); });
      await B.calmaTutti([P, T], 3000);
      /* sul telefono, DOPO: una cosa nuova e una rinomina; il PC le riceve */
      await T.evaluate(() => {
        LM.aggiungiAzione('Chiamare il medico (dal telefono)', null);
        const b = LM.load().azioni.find((x) => x.testo === 'Bozza relazione'); b.testo = 'Relazione finale (dal telefono)'; LM.save();
      });
      await B.calmaTutti([P, T], 3000); await P.waitForTimeout(1500); await B.calma(P, 1000);
      const ricevute = await testi(P);
      ok('V4-01 (preparazione) il PC ha ricevuto le due cose del telefono', ricevute.includes('Chiamare il medico (dal telefono)') && ricevute.includes('Relazione finale (dal telefono)'), ricevute);
      await alDiario(P);
      const riga = await annullaRiga(P, 'Rimossa da oggi');
      ok('V4-01 sul PC «Rimossa da oggi» è l’ultima cosa fatta lì: si annulla senza chiedere', !!riga && riga.dopo === 0 && !riga.avviso, riga);
      await B.calmaTutti([P, T], 4000); await T.waitForTimeout(2000); await B.calmaTutti([P, T], 2000);
      const dopo = { pc: await testi(P), telefono: await testi(T), cloud: (((await N.stato(uid)) || {}).azioni || []).map((a) => a.testo) };
      ok('V4-01 «Annulla» dal Diario: la cosa tolta torna, ovunque', ['pc', 'telefono', 'cloud'].every((k) => dopo[k].includes('Cosa da togliere')), dopo);
      ok('V4-01 …e la cosa nuova del telefono c’è ancora (PC, telefono, cloud)', ['pc', 'telefono', 'cloud'].every((k) => dopo[k].includes('Chiamare il medico (dal telefono)')), dopo);
      ok('V4-01 …e la rinomina del telefono c’è ancora (PC, telefono, cloud)', ['pc', 'telefono', 'cloud'].every((k) => dopo[k].includes('Relazione finale (dal telefono)') && !dopo[k].includes('Bozza relazione')), dopo);

      /* IL MESSAGGINO DEI SETTE SECONDI: si toglie sul PC, nel frattempo il
         telefono scrive, e si tocca «Annulla» */
      await P.evaluate(() => { location.hash = '#/oggi'; }); await P.waitForTimeout(400);
      await P.evaluate(() => { const a = LM.load().azioni.find((x) => x.testo === 'Cosa da togliere'); window.__PROVE__.annulla.conAnnulla('Rimossa da oggi.', 'trash', () => LM.rimuoviAzione(a.id)); });
      /* il messaggino dura sette secondi: si aspetta solo quello che serve */
      await T.evaluate(() => LM.aggiungiAzione('Scritta sul telefono nei sette secondi', null));
      const arrivata = await P.waitForFunction(() => LM.load().azioni.some((a) => a.testo === 'Scritta sul telefono nei sette secondi'), null, { timeout: 5500, polling: 100 }).then(() => true, () => false);
      const tasto = await P.evaluate(() => { const b = [...document.querySelectorAll('.toast button')].find((x) => /Annulla/.test(x.textContent)); if (b) b.click(); return !!b; });
      const dopoTasto = await messaggi(P);
      await B.calmaTutti([P, T], 3000); await B.calmaTutti([P, T], 1500);
      const dopo2 = { pc: await testi(P), telefono: await testi(T), cloud: (((await N.stato(uid)) || {}).azioni || []).map((a) => a.testo) };
      ok('V4-01 messaggino «Annulla»: la cosa tolta torna e quella arrivata dal telefono resta, ovunque', arrivata && ['pc', 'telefono', 'cloud'].every((k) => dopo2[k].includes('Cosa da togliere') && dopo2[k].includes('Scritta sul telefono nei sette secondi')), { arrivata, tasto, dopoTasto, dopo2 });

      /* «RIMETTI» dopo un annulla: si spunta sul PC, si annulla dal diario
         (col «Rimetti» nel messaggio), il telefono scrive, si tocca «Rimetti» */
      await P.evaluate(() => { const a = LM.load().azioni.find((x) => x.testo === 'Cosa da togliere'); LM.completaAzione(a.id); });
      await B.calmaTutti([P, T], 2500);
      await alDiario(P);
      await P.evaluate(() => { const id = LM.load().azioni.find((x) => x.testo === 'Cosa da togliere').id; const b = [...document.querySelectorAll('[data-annulla]')].find((x) => x.getAttribute('data-chiave') === id); if (b) b.click(); });
      const annullata = await P.evaluate(() => !LM.load().azioni.find((x) => x.testo === 'Cosa da togliere').done);
      await T.evaluate(() => LM.aggiungiAzione('Scritta sul telefono prima di «Rimetti»', null));
      await P.waitForFunction(() => LM.load().azioni.some((a) => a.testo === 'Scritta sul telefono prima di «Rimetti»'), null, { timeout: 5500, polling: 100 }).catch(() => {});
      const tastoR = await P.evaluate(() => { const b = [...document.querySelectorAll('.toast button')].filter((x) => /Rimetti/.test(x.textContent)).pop(); if (b) b.click(); return !!b; });
      await B.calmaTutti([P, T], 3000); await B.calmaTutti([P, T], 1500);
      const rim = { pc: await P.evaluate(() => LM.load().azioni.filter((a) => a.done).map((a) => a.testo).concat(LM.load().azioni.map((a) => a.testo))), telefono: await testi(T) };
      ok('V4-01 «Rimetti»: la spunta torna e la cosa arrivata dal telefono resta', rim.pc.indexOf('Cosa da togliere') >= 0 && rim.pc.filter((x) => x === 'Cosa da togliere').length === 2 && rim.pc.includes('Scritta sul telefono prima di «Rimetti»') && rim.telefono.includes('Scritta sul telefono prima di «Rimetti»'), { annullata, tastoR, rim });

      /* QUANDO L'INVERSO ESATTO NON C'È: il PC rinomina, il telefono rinomina
         la stessa cosa dopo, il PC annulla la sua rinomina. Rimettere il nome
         di prima cancellerebbe quello del telefono: non si fa, e si dice */
      await P.evaluate(() => { const a = LM.load().azioni.find((x) => x.testo === 'Relazione finale (dal telefono)'); LM.modificaAzione(a.id, 'Relazione (rinominata dal PC)'); });
      await B.calmaTutti([P, T], 2500);
      await T.evaluate(() => { const a = LM.load().azioni.find((x) => x.testo === 'Relazione (rinominata dal PC)'); LM.modificaAzione(a.id, 'Relazione (rinominata dal telefono, dopo)'); });
      await B.calmaTutti([P, T], 3000); await P.waitForTimeout(1000); await B.calma(P, 800);
      const esito = await P.evaluate(() => { const ps = LM.puntiDiRitorno(); const r = ps.length ? LM.tornaAlPunto(ps[0].fino, 'Rinominata') : null; return { r, motivo: LM.motivoRifiuto() }; });
      await B.calmaTutti([P, T], 2500);
      const nomi = { pc: await testi(P), telefono: await testi(T) };
      ok('V4-01 se la cosa toccata è cambiata altrove dopo, l’annulla non la riporta indietro e dice perché', esito.r === false && /cambiata dopo/.test(esito.motivo) && ['pc', 'telefono'].every((k) => nomi[k].includes('Relazione (rinominata dal telefono, dopo)')), { esito, nomi });
      await P.ctx.close(); await T.ctx.close();
    }
    /* ============================================================ V4-02 */
    if (parte('spazio')) {
      await N.pulisci();
      const P = await B.dispositivo('pc'), T = await B.dispositivo('telefono', { tipo: 'iphone' });
      await B.accedi(P, 'pia', 'pia@prova.it'); await B.accedi(T, 'pia', 'pia@prova.it');
      /* otto mesi di uso: sei cose al giorno, un check-in, un voto, la
         review e otto righe di diario */
      const dim = await P.evaluate(() => {
        const s = LM.load(); s.onboarded = true;
        const oggi = new Date();
        for (let g = 0; g < 240; g++) {
          const d = new Date(oggi.getTime() - g * 86400000); const k = LM.dayKey(d);
          for (let i = 0; i < 6; i++) s.azioni.push({ id: 'a' + g + '_' + i + Math.random().toString(36).slice(2, 6), areaId: 'lavoro', testo: 'Cosa numero ' + i + ' del giorno ' + k + ' con un po’ di descrizione', ifThen: '', mit: i === 0, done: i % 2 === 0, data: k, doneAt: i % 2 === 0 ? d.getTime() : null, creata: d.getTime(), ora: null, durata: null, passoDi: null, aggiornata: d.getTime() });
          s.checkins.push({ id: 'c' + g, data: k, ts: d.getTime(), energia: 3, focus: 3, umore: 4, contesto: 'ufficio' });
          s.reviewSera[k] = { vittoria: 'Ho finito la parte ' + g, blocco: 'Interruzioni', shutdown: true, ts: d.getTime() };
          s.valutazioni[k] = { lavoro: 4, salute: 3 };
          for (let r = 0; r < 8; r++) s.registro.push({ ts: d.getTime() + r, cat: 'azione', testo: 'Riga di diario ' + r + ' del ' + k, imp: false });
        }
        LM.save();
        return localStorage.getItem('lifemax.v2').length;
      });
      await B.calmaTutti([P, T], 4000);
      /* qualche settimana di vita: dodici operazioni che prendono una copia */
      const giri = await P.evaluate(() => {
        const out = [];
        for (let n = 0; n < 12; n++) {
          const prima = LM.listBackups().length;
          const fatta = LM.backup('prima-import');
          const s = LM.load(); s.azioni.push({ id: 'nuova' + n + Math.random().toString(36).slice(2, 6), areaId: 'lavoro', testo: 'Nuova ' + n, ifThen: '', mit: false, done: false, data: LM.todayKey(), doneAt: null, creata: Date.now(), ora: null, durata: null, passoDi: null }); LM.save();
          out.push({ prima, fatta, dopo: LM.listBackups().length });
        }
        let usato = 0; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); usato += k.length + (localStorage.getItem(k) || '').length; }
        return { out, usato };
      });
      ok('V4-02 con otto mesi di dati ogni operazione che promette «prima faccio una copia» la fa', giri.out.every((g) => g.fatta === true && g.dopo === g.prima + 1), { stato: dim, giri });
      ok('V4-02 …e la memoria del browser resta lontana dal pieno', giri.usato < 3500000, giri.usato);
      const rip = await P.evaluate(() => {
        const el = LM.listBackups(); const ts = el[el.length - 1].ts;
        const n0 = LM.load().azioni.length; const fatto = LM.restoreBackup(ts);
        return { fatto, n0, n: LM.load().azioni.length, primaDelRipristino: LM.listBackups().some((b) => b.motivo === 'prima-del-ripristino') };
      });
      ok('V4-02 dopo «Ripristina» c’è la copia «prima di un ripristino»', rip.fatto && rip.primaDelRipristino && rip.n !== rip.n0, rip);
      const punti = await P.evaluate(() => { const s = LM.load(); s.azioni[0].testo = 'cambiata per l’annulla'; LM.save(); return LM.puntiDiRitorno().length; });
      ok('V4-02 …e i punti dell’annulla si scrivono ancora', punti >= 1, punti);
      await B.calmaTutti([P, T], 3000);

      /* la memoria del browser riempita d'altro, finché non entra più niente */
      const riempi = (d) => d.evaluate(() => {
        let n = 0; const pezzo = (q) => 'x'.repeat(q);
        for (const q of [400000, 100000, 20000, 4000, 500, 50, 5]) {
          for (;;) { try { localStorage.setItem('zavorra.' + (n++), pezzo(q)); } catch (e) { break; } }
        }
        return n;
      });
      const svuota = (d) => d.evaluate(() => { Object.keys(localStorage).filter((k) => k.indexOf('zavorra.') === 0).forEach((k) => localStorage.removeItem(k)); });
      /* LA FUSIONE DAL CLOUD CON LA MEMORIA PIENA (l'ipotesi della verifica):
         quello che arriva dal telefono non deve diventare, al salvataggio
         dopo, una modifica fatta sul PC adesso */
      const idx = await T.evaluate(() => LM.load().azioni.find((a) => !a.done && /Cosa numero 1 /.test(a.testo)).id);
      await riempi(P);
      await T.evaluate((i) => { LM.modificaAzione(i, 'Rinominata sul telefono'); }, idx);
      await B.calma(T, 2500);
      await P.waitForFunction((i) => (LM.load().azioni.find((a) => a.id === i) || {}).testo === 'Rinominata sul telefono', idx, { timeout: 20000 }).catch(() => {});
      const orologioT = await T.evaluate((i) => { const o = LM.load().orologi; return o['azioni/i' + i + '/testo']; }, idx);
      await P.waitForTimeout(1500);
      await P.evaluate(() => { const s = LM.load(); s.profilo.nome = 'Pia'; LM.save(); });
      const orologioP = await P.evaluate((i) => { const o = LM.load().orologi; return o['azioni/i' + i + '/testo']; }, idx);
      ok('V4-02 memoria piena durante una fusione: la rinomina del telefono non diventa una modifica del PC', !!orologioT && orologioP === orologioT, { telefono: orologioT, pc: orologioP });
      await svuota(P); await B.calmaTutti([P, T], 3000);

      /* LA MEMORIA PROPRIO PIENA: una copia sola, piccola (com'era
         all'inizio), e la memoria riempita d'altro finché non entra niente:
         anche togliendo tutte le copie che si possono togliere, quella di
         adesso non entra */
      const piccola = () => P.evaluate(() => {
        const arr = JSON.parse(localStorage.getItem('lifemax.backups.v1') || '[]');
        const chi = arr[0].chi;
        localStorage.setItem('lifemax.backups.v1', JSON.stringify([{ ts: Date.now() - 60000, motivo: 'prima-import', data: JSON.stringify({ azioni: [], profilo: {} }), chi: chi }]));
        LM.scordaPunti();
      });
      await piccola(); await riempi(P);
      const fermo = await P.evaluate(() => {
        const el = LM.listBackups(); const ts = el[el.length - 1].ts;
        const n0 = LM.load().azioni.length;
        const r = LM.restoreBackup(ts);
        return { r, motivo: LM.motivoFermo(), n0, n: LM.load().azioni.length };
      });
      ok('V4-02 memoria piena: «Ripristina» senza posto per la copia di adesso si ferma, e non tocca i dati', fermo.r === false && fermo.motivo === 'spazio' && fermo.n === fermo.n0, fermo);
      /* dall'interfaccia: la proposta di scaricare un file, e poi si va avanti */
      await P.evaluate(() => { location.hash = '#/profilo'; }); await P.waitForTimeout(600);
      await P.evaluate(() => { const b = document.getElementById('imp-tutte'); if (b) b.click(); }); await P.waitForTimeout(700);
      await P.evaluate(() => { const b = document.getElementById('imp-backup'); if (b) b.click(); }); await P.waitForTimeout(900);
      const n0 = await P.evaluate(() => LM.load().azioni.length);
      await P.evaluate(() => { const b = [...document.querySelectorAll('[data-ts]')].pop(); if (b) b.click(); }); await P.waitForTimeout(500);
      await P.evaluate(() => { const b = document.querySelector('.avv-si'); if (b) b.click(); }); await P.waitForTimeout(700);
      const proposta = await P.evaluate(() => { const a = document.querySelector('.avviso'); return a ? a.textContent.replace(/\s+/g, ' ').trim() : null; });
      ok('V4-02 …e dall’interfaccia propone di scaricare un file invece di andare avanti', !!proposta && /spazio per la copia/.test(proposta) && /Scarica e continua/.test(proposta) && await P.evaluate(() => LM.load().azioni.length) === n0, proposta);
      const scaricato = P.waitForEvent('download', { timeout: 10000 }).then((d) => d.suggestedFilename(), () => null);
      await P.evaluate(() => { const b = document.querySelector('.avv-si'); if (b) b.click(); });
      const file = await scaricato; await P.waitForTimeout(800);
      const n1 = await P.evaluate(() => LM.load().azioni.length);
      ok('V4-02 «Scarica e continua»: il file si scarica, e poi il ripristino si fa', !!file && /lifemax-.*\.json/.test(file) && n1 !== n0, { file, n0, n1 });
      await P.keyboard.press('Escape').catch(() => {});

      await svuota(P);
      await P.ctx.close(); await T.ctx.close();
    }
    /* ============================================================ V4-03 */
    if (parte('rete')) {
      await N.pulisci();
      const T = await B.dispositivo('telefono', { tipo: 'iphone' });
      await B.accedi(T, 'gea', 'gea@prova.it');
      const uid = await B.uidDi(T);
      await T.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); LM.aggiungiAzione('Prima del buco', null); });
      await B.calma(T, 2500);
      /* la rete si appende: quello che va a Firestore non torna più */
      const appese = []; let appendi = true;
      await T.ctx.route(FS, (r) => { if (appendi) appese.push(r); else r.continue(); });
      await T.evaluate(() => LM.aggiungiAzione('Scritta durante il buco', null));
      await T.waitForTimeout(40000);
      /* torna la rete buona: le richieste nuove passano, quelle appese restano appese */
      appendi = false;
      await T.evaluate(() => window.dispatchEvent(new Event('online')));
      const nelCloud = async (testo, ms) => {
        const t0 = Date.now();
        while (Date.now() - t0 < ms) {
          const st = await N.stato(uid);
          if (st && (st.azioni || []).some((a) => a.testo === testo)) return Math.round((Date.now() - t0) / 1000);
          await T.waitForTimeout(2000);
        }
        return -1;
      };
      const dopo = await nelCloud('Scritta durante il buco', 60000);
      ok('V4-03 tornata la rete, la modifica fatta durante il buco arriva nel cloud entro un minuto (senza ricaricare)', dopo >= 0, { secondi: dopo, appese: appese.length, stato: await T.evaluate(() => window.LM_SYNC && window.LM_SYNC.state) });
      await T.evaluate(() => LM.aggiungiAzione('Scritta dopo il buco', null));
      const nuova = await nelCloud('Scritta dopo il buco', 45000);
      ok('V4-03 …e una modifica nuova, a rete buona, arriva', nuova >= 0, { secondi: nuova, stato: await T.evaluate(() => window.LM_SYNC && window.LM_SYNC.state) });
      /* le richieste appese, se un giorno rispondono, non fanno danni: il
         giro lasciato non riscrive niente qui */
      const prima = await testi(T);
      for (const r of appese) await r.continue().catch(() => {});
      await T.waitForTimeout(4000); await B.calma(T, 1500);
      const poi = await testi(T);
      ok('V4-03 …e le richieste appese che rispondono tardi non riportano indietro niente', ['Prima del buco', 'Scritta durante il buco', 'Scritta dopo il buco'].every((x) => poi.includes(x)) && poi.length === prima.length, { prima, poi });
      /* e senza nessun segnale dalla rete: la richiesta si appende, la rete
         torna buona in silenzio, e il giro appeso scade da solo */
      const appese2 = []; let appendi2 = true;
      await T.ctx.unroute(FS);
      await T.ctx.route(FS, (r) => { if (appendi2) appese2.push(r); else r.continue(); });
      await T.evaluate(() => LM.aggiungiAzione('Scritta nel secondo buco', null));
      await T.waitForTimeout(5000);
      appendi2 = false;
      const sola = await nelCloud('Scritta nel secondo buco', 75000);
      ok('V4-03 …e anche senza l’evento «online» il giro appeso scade da solo e la modifica arriva', sola >= 0, { secondi: sola, appese: appese2.length });
      appese2.forEach((r) => r.abort().catch(() => {}));
      await T.ctx.close();
    }

  } catch (e) { ok('eccezione', false, String(e && e.stack || e)); }
  await B.chiudi(); srv.close(); await E.spegni();
  console.log(guai() ? '\n>>> ' + guai() + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  process.exit(guai() ? 1 : 0);
})();
