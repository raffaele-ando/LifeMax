/* I CALENDARI ATTRAVERSO LA SENTINELLA — l'app vera, in un browser vero,
   davanti al Worker vero (sentinella/worker.mjs) che gira qui accanto.

   prove/calendari.js prova la strada di sempre, col permesso nel browser:
   deve restare identica, e resta lì. Questa prova la strada nuova: hai fatto
   l'accesso a LifeMax (un Firebase finto, che dà un gettone firmato con una
   chiave della prova), il Worker ha i suoi segreti (finti), e Google e
   Microsoft sono quelli finti di comune/sentinella-finta.js.

   LE COSE CHE CERCA
    1. il collegamento passa dal server: Google → ritorno al Worker →
       ritorno all'app, che riapre il pannello; nel browser nessun permesso
    2. l'importazione, con «chi c'è» (solo tuo / con altri / di altri)
    3. un evento fra dieci mesi si VEDE nella Giornata (vista mese), senza
       essere un'attività; toccato, lo diventa
    4. una modifica fatta e l'app chiusa subito dopo: arriva lo stesso nel
       calendario
    5. un cambiamento sul calendario mentre l'app è chiusa: la sentinella lo
       legge da sola, e l'app riaprendosi lo trova
    6. il permesso breve di Google scade: nessun «Ricollega», va da sé
    7. la sera, «rimanda a domani»: l'impegno solo tuo si sposta (anche nel
       calendario, stessa ora); le riunioni con altri restano, con il perché
       e le tre risposte; «Sposta…» e «Saltata» fanno quello che dicono
    8. scollegare ritira il permesso e cancella i dati della sentinella

   node prove/calendari-server.js     (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const RADICE = require('./comune/dove').SERVITO;
const { mondo } = require('./comune/sentinella-finta');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const PORTA = 8861;
const SITO = 'http://localhost:' + PORTA;
const UID = 'utente-prova';
let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d !== undefined && d !== '' ? '  → ' + d : '')); };
const aspetta = (ms) => new Promise((r) => setTimeout(r, ms));

/* il Firebase finto: c'è già un utente, e il suo gettone lo firma la prova */
const FINTO_APP = 'export function initializeApp() { return { finto: true }; }';
const FINTO_AUTH = `
const B = (window.__fb = window.__fb || {});
B.utente = { uid: '${UID}', email: 'prova@esempio.it', displayName: 'Prova', photoURL: null,
  getIdToken: function () { return window.__gettone(); } };
export function getAuth() { return { finto: true }; }
export function onAuthStateChanged(a, cb) { setTimeout(() => cb(B.utente), 0); return () => {}; }
export function GoogleAuthProvider() { this.setCustomParameters = () => {}; }
export const browserLocalPersistence = 'locale';
export function setPersistence() { return Promise.resolve(); }
export function signInWithPopup() { return Promise.resolve(); }
export function signInWithRedirect() { return Promise.resolve(); }
export function getRedirectResult() { return Promise.resolve(null); }
export function signOut() { return Promise.resolve(); }`;
const FINTO_FS = `
const B = (window.__fb = window.__fb || {});
export function getFirestore() { return { finto: true }; }
export function initializeFirestore() { return { finto: true }; }
export function doc() { return { via: [].slice.call(arguments, 1).join('/') }; }
export function collection() { return { via: [].slice.call(arguments, 1).join('/') }; }
export function getDoc() { return Promise.resolve({ exists: () => false, data: () => null, id: 'x' }); }
export function getDocs() { return Promise.resolve({ forEach: () => {} }); }
export function setDoc() { return Promise.resolve(); }
export function onSnapshot() { return function () {}; }
/* quello che serve alla sincronizzazione divisa in pezzi (src/nuvola/):
   qui il cloud non conta, risponde e basta */
export function serverTimestamp() { return {}; }
export function deleteDoc() { return Promise.resolve(); }
export function writeBatch() { const b = { set() { return b; }, delete() { return b; }, commit: () => Promise.resolve() }; return b; }
export async function runTransaction(db, f) { const tx = { get: () => Promise.resolve({ exists: () => false, data: () => undefined, id: 'x' }), set() { return tx; }, delete() { return tx; } }; return f(tx); }`;

(async () => {
  const W = await mondo({ indirizzo: SITO, ritorni: SITO + '/', origini: SITO });
  const { G, ns, worker, gettone, env } = W;
  const api = [];

  const srv = http.createServer(async (q, r) => {
    if (q.url.indexOf('/api/') === 0) {
      const pezzi = [];
      for await (const c of q) pezzi.push(c);
      const corpo = Buffer.concat(pezzi);
      const h = new Headers();
      Object.keys(q.headers).forEach((k) => { const v = q.headers[k]; if (typeof v === 'string') h.set(k, v); });
      api.push({ via: q.url.split('?')[0], metodo: q.method });
      const risp = await worker.fetch(new Request(SITO + q.url, { method: q.method, headers: h, body: q.method === 'GET' || q.method === 'HEAD' ? undefined : corpo }), env, { waitUntil() {} });
      const testa = {};
      risp.headers.forEach((v, k) => { testa[k] = v; });
      /* LA PAGINA DI GOOGLE la fa la prova, qui: Playwright non intercetta i
         passaggi di un rimando (302), e il browser andrebbe dal Google vero.
         Il «sì» si dà subito, e si rimanda al ritorno del Worker. */
      if (testa.location && /^https:\/\/accounts\.google\.com\//.test(testa.location)) {
        api.push({ via: 'google-consenso', metodo: 'GET' });
        testa.location = W.consenso(testa.location).url;
      }
      r.writeHead(risp.status, testa);
      r.end(Buffer.from(await risp.arrayBuffer()));
      return;
    }
    let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
    fs.readFile(path.join(RADICE, p), (e, d) => {
      if (e) { r.statusCode = 404; r.end('x'); return; }
      r.setHeader('Content-Type', T[path.extname(p)] || 'application/octet-stream'); r.end(d);
    });
  });
  await new Promise((r) => srv.listen(PORTA, r));
  const b = await require('./comune/lancia')();
  const errori = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, timezoneId: 'Europe/Rome', locale: 'it-IT' });
  await ctx.route('https://www.gstatic.com/firebasejs/**', (route) => {
    const u = route.request().url();
    route.fulfill({ status: 200, contentType: 'text/javascript', body: /firebase-app/.test(u) ? FINTO_APP : /firebase-auth/.test(u) ? FINTO_AUTH : FINTO_FS });
  });
  await ctx.exposeFunction('__gettone', () => gettone(UID));

  async function apri() {
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errori.push(String(e).split('\n')[0]));
    await p.goto(SITO + '/index.html');
    await p.waitForTimeout(1200);
    return p;
  }
  const apriPannello = async (p) => {
    await p.evaluate(() => { location.hash = '#/profilo'; });
    await p.waitForTimeout(500);
    await p.evaluate(() => { const r = document.getElementById('imp-calendari'); if (r) r.click(); });
    await p.waitForTimeout(700);
  };
  const giro = (p) => p.evaluate(() => window.__PROVE__.calendari.sincronizza('prova'));
  const collegate = (p) => p.evaluate(() => LM.load().azioni.filter((a) => a.esterno && a.esterno.prov === 'google')
    .map((a) => ({ id: a.id, ev: a.esterno.id, testo: a.testo, data: a.data, ora: a.ora, durata: a.durata, invito: a.esterno.invito, done: a.done, mancata: !!a.mancata })));

  let p = await apri();
  await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  await p.reload();
  await p.waitForTimeout(1500);
  const oggi = await p.evaluate(() => LM.todayKey());
  const piu = (n) => { const d = new Date(oggi + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  /* le ore sono di Roma (+01:00 a novembre) */
  const ora = (g, hh) => ({ dateTime: g + 'T' + hh + ':00+01:00' });
  G.metti('lavoro@gruppo', { id: 'solo', summary: 'Scrivere il report', start: ora(oggi, '07:30'), end: ora(oggi, '08:15'), organizer: { self: true } });
  G.metti('lavoro@gruppo', { id: 'riu', summary: 'Riunione di squadra', start: ora(oggi, '07:00'), end: ora(oggi, '07:30'), organizer: { self: true },
    attendees: [{ self: true, responseStatus: 'accepted' }, { email: 'anna@altrove.it' }] });
  G.metti('lavoro@gruppo', { id: 'inv', summary: 'Call di Luca', start: ora(oggi, '06:00'), end: ora(oggi, '06:30'), organizer: { self: false } });
  G.metti('lavoro@gruppo', { id: 'dopo', summary: 'Dentista', start: ora(piu(3), '15:00'), end: ora(piu(3), '16:00'), organizer: { self: true } });
  const lontano = piu(300);
  G.metti('lavoro@gruppo', { id: 'lontano', summary: 'Matrimonio di Sara', start: { date: lontano }, end: { date: piu(301) }, organizer: { self: true } });

  /* ============================================== 1 */
  console.log('\n1. IL COLLEGAMENTO PASSA DAL SERVER');
  {
    await apriPannello(p);
    const v0 = await p.evaluate(() => ({ stato: (document.getElementById('cal-google-stato') || {}).textContent, campoId: !!document.getElementById('cal-google-id') }));
    ok('con la sentinella Google è «da collegare», senza chiedere nessun ID', v0.stato === 'Da collegare' && !v0.campoId, v0.stato);
    await Promise.all([p.waitForNavigation({ url: /lmcal=google/ }).catch(() => null), p.click('#cal-google-collega')]);
    await p.waitForTimeout(2500);
    const v = await p.evaluate(() => ({
      url: location.href,
      titolo: (document.getElementById('sheet-titolo') || {}).textContent,
      stato: (document.getElementById('cal-google-stato') || {}).textContent,
      email: (document.querySelector('#cal-google .cal-email') || {}).textContent,
      nota: (document.getElementById('cal-google-server') || {}).textContent,
      memoria: JSON.stringify(Object.assign({}, localStorage))
    }));
    ok('il giro è passato da /inizia, /vai e /ritorno', ['/api/calendari/google/inizia', '/api/calendari/google/vai', 'google-consenso', '/api/calendari/google/ritorno'].every((x) => api.some((a) => a.via === x)),
      api.map((a) => a.via).join(' '));
    ok('si torna all’app, e l’indirizzo è pulito', !/lmcal|esito|code=/.test(v.url), v.url);
    ok('il pannello si riapre da sé', /Calendari collegati/.test(v.titolo || ''), v.titolo);
    ok('collegato, con l’email dell’account', v.stato === 'Collegato' && v.email === 'io@esempio.it', v.stato + ' · ' + v.email);
    ok('il pannello dice che resta allineato anche ad app chiusa', /app chiusa/.test(v.nota || ''), v.nota);
    ok('nel browser non c’è nessun permesso di Google', !/gat-|grt-/.test(v.memoria) && !/"lifemax\.calendari\.google"/.test(v.memoria));
  }

  /* ============================================== 2 */
  console.log('\n2. L’IMPORTAZIONE, CON «CHI C’È»');
  {
    await p.click('#cal-google [data-cal="lavoro@gruppo"]');
    await p.waitForTimeout(400);
    await giro(p);
    const az = await collegate(p);
    const per = (e) => az.find((a) => a.ev === e) || {};
    ok('gli eventi vicini sono attività', ['solo', 'riu', 'inv', 'dopo'].every((e) => per(e).id), az.map((a) => a.ev).join(','));
    ok('all’ora di Roma', per('solo').ora === '07:30' && per('solo').durata === 45, per('solo').ora + ' ' + per('solo').durata);
    ok('«solo tuo», «con altri», «di altri»', per('solo').invito === 'solo' && per('riu').invito === 'tua' && per('inv').invito === 'altrui',
      [per('solo').invito, per('riu').invito, per('inv').invito].join(','));
    ok('quello fra dieci mesi NON è un’attività (i dati non si gonfiano)', !per('lontano').id);
    const prima = G.richieste.filter((x) => x.metodo !== 'GET').length;
    await giro(p);
    ok('un giro senza novità non scrive niente', G.richieste.filter((x) => x.metodo !== 'GET').length === prima);
  }

  /* ============================================== 3 */
  console.log('\n3. FRA DIECI MESI, NELLA GIORNATA');
  {
    const v = await p.evaluate((k) => LM.azioniDelGiorno(k).map((a) => ({ id: a.id, testo: a.testo, f: !!a.fantasma })), lontano);
    ok('il giorno lo mostra, come fantasma', v.length === 1 && v[0].testo === 'Matrimonio di Sara' && v[0].f, JSON.stringify(v));
    await p.evaluate(() => { const c = document.querySelector('.sheet-chiudi'); if (c) c.click(); location.hash = '#/giornata'; });
    await p.waitForTimeout(800);
    await p.evaluate(() => { const b = document.querySelector('[data-orizz="mese"]'); if (b) b.click(); });
    await p.waitForTimeout(400);
    for (let i = 0; i < 12; i++) {
      const c = await p.evaluate((k) => !!document.querySelector('[data-me-g="' + k + '"]'), lontano);
      if (c) break;
      await p.evaluate(() => { const b = document.querySelector('[data-nav="next"]'); if (b) b.click(); });
      await p.waitForTimeout(250);
    }
    await p.click('[data-me-g="' + lontano + '"]');
    await p.waitForTimeout(400);
    const riga = await p.evaluate(() => [...document.querySelectorAll('[data-me-az]')].map((x) => ({ id: x.getAttribute('data-me-az'), t: x.textContent })));
    const fant = riga.find((x) => /Matrimonio di Sara/.test(x.t));
    ok('nella vista del mese, toccando quel giorno, c’è', !!fant, riga.map((x) => x.t).join(' | ').slice(0, 120));
    if (fant) {
      await p.click('[data-me-az="' + fant.id + '"]');
      await p.waitForTimeout(600);
      const vera = await p.evaluate((id) => { const a = LM.load().azioni.find((x) => x.id === id); return a ? { f: a.fantasma, est: a.esterno && a.esterno.id, data: a.data } : null; }, fant.id);
      ok('toccata, è diventata un’attività vera, collegata', vera && !vera.f && vera.est === 'lontano' && vera.data === lontano, JSON.stringify(vera));
      ok('e si è aperta (il tocco non si è perso)', await p.evaluate(() => !!document.querySelector('.sheet, [role="dialog"]')));
    }
    await p.keyboard.press('Escape');
  }

  /* ============================================== 4 */
  console.log('\n4. UNA MODIFICA, E L’APP CHIUSA SUBITO DOPO');
  {
    const a = (await collegate(p)).find((x) => x.ev === 'dopo');
    await p.evaluate((id) => LM.setOraAzione(id, '17:30'), a.id);
    await p.waitForTimeout(400);
    await p.close();
    await aspetta(600);
    const e = G.eventi['lavoro@gruppo'].dopo;
    ok('l’app è chiusa, e Google ha l’ora nuova', e.start.dateTime === new Date(piu(3) + 'T17:30:00+01:00').toISOString(), e.start.dateTime);
    ok('con la durata di prima (un’ora)', Date.parse(e.end.dateTime) - Date.parse(e.start.dateTime) === 3600e3);
  }

  /* ============================================== 5 */
  console.log('\n5. CAMBIATO SUL CALENDARIO MENTRE L’APP È CHIUSA');
  {
    G.metti('lavoro@gruppo', Object.assign({}, G.eventi['lavoro@gruppo'].dopo, { summary: 'Dentista (spostato da loro)', start: ora(piu(4), '10:00'), end: ora(piu(4), '11:00') }));
    G.metti('lavoro@gruppo', { id: 'nuovo', summary: 'Aperitivo', start: ora(piu(2), '19:00'), end: ora(piu(2), '20:00'), organizer: { self: true } });
    const da = G.richieste.length;
    await ns.suona(true);
    const lette = G.richieste.slice(da).filter((x) => /\/events$/.test(x.via));
    ok('la sentinella si è svegliata da sola e ha letto i cambiamenti', lette.length > 0 && lette.every((x) => x.q.syncToken));
    G.scadiAccessi();
    p = await apri();
    await p.waitForTimeout(2500);
    const az = await collegate(p);
    const d = az.find((x) => x.ev === 'dopo') || {};
    ok('riaprendo l’app, lo spostamento c’è', d.data === piu(4) && d.ora === '10:00' && /spostato da loro/.test(d.testo || ''), d.data + ' ' + d.ora + ' ' + d.testo);
    ok('e anche l’evento nuovo', az.some((x) => x.ev === 'nuovo'));
    const v = await p.evaluate(() => ({ nota: window.__PROVE__.calendari.statoQui().nota, esito: (LM.load().profilo.calendari.esito || {}).testo }));
    ok('il permesso breve era scaduto: nessun «Ricollega»', !/Ricollega/.test(v.nota || '') && !/Ricollega/.test(v.esito || ''), v.nota + ' / ' + v.esito);
  }

  /* ============================================== 6 */
  console.log('\n6. LA SERA: RIMANDA A DOMANI');
  {
    await p.evaluate(() => { location.hash = '#/giornata'; });
    await p.waitForTimeout(700);
    await p.evaluate(() => { const b = document.querySelector('[data-orizz="giorno"]'); if (b) b.click(); const o = document.querySelector('[data-nav="oggi"]'); if (o) o.click(); });
    await p.waitForTimeout(500);
    const c = await p.evaluate(() => !!document.getElementById('tl-rimanda'));
    ok('il tasto «rimanda» c’è', c);
    await p.click('#tl-rimanda');
    await p.waitForTimeout(500);
    const az = await collegate(p);
    const per = (e) => az.find((a) => a.ev === e) || {};
    ok('l’impegno solo tuo è passato a domani, alla stessa ora', per('solo').data === piu(1) && per('solo').ora === '07:30', per('solo').data + ' ' + per('solo').ora);
    ok('la riunione con altri e l’invito di Luca no', per('riu').data === oggi && per('inv').data === oggi);
    const riu = await p.evaluate(() => [...document.querySelectorAll('.tl-riu')].map((x) => ({
      t: (x.querySelector('.tl-riu-testo b') || {}).textContent, perche: (x.querySelector('.tl-riu-perche') || {}).textContent,
      tasti: [...x.querySelectorAll('.tl-riu-tasti button')].map((y) => y.textContent) })));
    ok('restano lì sotto, tutte e due, con le tre risposte', riu.length === 2 && riu.every((x) => x.tasti.join('|') === 'Fatta|Saltata|Sposta…'), JSON.stringify(riu.map((x) => x.t)));
    const r1 = riu.find((x) => /squadra/.test(x.t)) || {}, r2 = riu.find((x) => /Luca/.test(x.t)) || {};
    ok('con il perché in una riga: «altri invitati»', /altri invitati/.test(r1.perche || ''), r1.perche);
    ok('e «l’ha organizzata qualcun altro»', /qualcun altro/.test(r2.perche || ''), r2.perche);
    await giro(p);
    const s = G.eventi['lavoro@gruppo'].solo;
    ok('e nel calendario l’impegno solo tuo è a domani, stessa ora e durata', s.start.dateTime === new Date(piu(1) + 'T07:30:00+01:00').toISOString() &&
      Date.parse(s.end.dateTime) - Date.parse(s.start.dateTime) === 45 * 60000, s.start.dateTime);
    ok('la riunione nel calendario non si è mossa', G.eventi['lavoro@gruppo'].riu.start.dateTime === ora(oggi, '07:00').dateTime);
    /* «Sposta…» sulla riunione: sceglie il giorno, e si sposta per tutti */
    const idRiu = per('riu').id, idInv = per('inv').id;
    await p.click('[data-riu-sposta="' + idRiu + '"]');
    await p.waitForTimeout(300);
    await p.fill('#tl-riu-data', piu(2));
    await p.click('[data-riu-ok="' + idRiu + '"]');
    await p.waitForTimeout(300);
    await p.click('[data-riu-saltata="' + idInv + '"]');
    await p.waitForTimeout(300);
    await giro(p);
    const dopo = await collegate(p);
    const rr = dopo.find((a) => a.ev === 'riu') || {}, ii = dopo.find((a) => a.ev === 'inv') || {};
    ok('«Sposta…»: la riunione va al giorno scelto, e anche nel calendario', rr.data === piu(2) && G.eventi['lavoro@gruppo'].riu.start.dateTime === new Date(piu(2) + 'T07:00:00+01:00').toISOString(),
      rr.data + ' / ' + G.eventi['lavoro@gruppo'].riu.start.dateTime);
    ok('«Saltata»: segnata come non riuscita, il calendario non si tocca', ii.mancata && ii.data === oggi && G.eventi['lavoro@gruppo'].inv.start.dateTime === ora(oggi, '06:00').dateTime);
    ok('e il riquadro è sparito: non resta niente da decidere', await p.evaluate(() => !document.getElementById('tl-riunioni')));
  }

  /* ============================================== 7 */
  console.log('\n7. SCOLLEGARE');
  {
    await apriPannello(p);
    await p.click('#cal-google-scollega');
    await p.waitForTimeout(200);
    await p.click('#cal-google-tieni');
    await p.waitForTimeout(800);
    ok('il permesso è stato ritirato presso Google', G.revocati.length === 1, G.revocati.join(','));
    const h = ns.idFromName(UID).toString();
    const n = ns.istanze.get(h).db.prepare("SELECT (SELECT COUNT(*) FROM conti) + (SELECT COUNT(*) FROM ev) + (SELECT COUNT(*) FROM cal) AS n").get().n;
    ok('e nella sentinella non resta niente', n === 0, n);
    const v = await p.evaluate(() => ({ stato: (document.getElementById('cal-google-stato') || {}).textContent, specchio: localStorage.getItem('lifemax.calendari.specchio') || '' }));
    ok('il pannello torna «da collegare», e lo specchio qui si svuota', v.stato === 'Da collegare' && !/Matrimonio/.test(v.specchio), v.stato);
  }

  ok('nessun errore nella pagina, in tutta la prova', !errori.length, errori.slice(0, 3).join(' | '));
  await b.close();
  srv.close();
  console.log(guai ? '\n>>> ' + guai + (guai === 1 ? ' PROBLEMA' : ' PROBLEMI') : '\n>>> TUTTO A POSTO');
  process.exit(guai ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
