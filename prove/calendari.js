/* I CALENDARI COLLEGATI, NEI DUE SENSI — con un Google e un Microsoft FINTI.

   La sincronizzazione coi calendari è il pezzo dell'app che può fare danni
   FUORI dall'app: un errore qui non sporca LifeMax, sposta la riunione di
   qualcun altro o la cancella. Quindi si prova tutto, e niente sulla rete
   vera — `comune/lancia.js` chiude fuori i quattro indirizzi veri, e qui si
   mettono al loro posto:
     · la libreria di Google (accounts.google.com/gsi/client), finta: dà un
       permesso a ogni richiesta e conta quante finestre ha «aperto»;
     · l'API di Google Calendar, finta, con i suoi eventi in memoria;
     · la pagina di accesso di Microsoft, finta: rimanda indietro all'app
       con un codice, come fa quella vera;
     · il cambio del codice e Microsoft Graph, finti.
   Il finto tiene il registro di ogni richiesta, così la prova può dire non
   solo «la riga è giusta» ma «è partita proprio una PATCH, e con dentro
   l'ora giusta».

   LE COSE CHE CERCA
    1. un ID mancante: «da configurare», il link alle istruzioni, e nessuna
       richiesta partita
    2. importazione: gli eventi di oggi in poi diventano attività, all'ora
       giusta nel fuso di qui; il passato, i rifiutati e quelli di tutto il
       giorno trattati come deciso
    3. un cambio fatto sul calendario arriva qui
    4. un cambio fatto qui parte verso il calendario (e solo il campo
       cambiato)
    5. le cancellazioni, nei due sensi — e una già fatta resta, staccata
    6. il conflitto: vince il calendario, e il Diario lo dice
    7. due «dispositivi» che importano lo stesso evento: dopo la fusione è
       UNA riga
    8. il permesso scaduto: nessuna finestra aperta da sola, «Ricollega»
       compare, e un tocco basta
    9. le nuove attività con orario nel calendario scelto, una volta sola
   10. Microsoft: il giro intero, dal rimando alla pagina di accesso fino
       alla modifica spedita

   node prove/calendari.js     (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const RADICE = require('./comune/dove').SERVITO;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const PORTA = 8843;
const SITO = 'http://localhost:' + PORTA + '/';
let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d !== undefined && d !== '' ? '  → ' + d : '')); };

/* L'OROLOGIO È FERMO a lunedì 23 novembre 2026, le 8 del mattino a Roma
   (ora solare, +01:00): così «oggi», «il passato» e i fusi sono gli stessi
   a ogni giro. L'orologio va avanti dai suoi otto, quindi i timer
   funzionano. */
const ADESSO = Date.parse('2026-11-23T08:00:00+01:00');
const FUSO = 'Europe/Rome';

/* ===================================================== il Google finto */
const G = {
  token: new Set(),
  n: 0,
  richieste: [],
  calendari: [
    { id: 'io@esempio.it', summary: 'io@esempio.it', primary: true, accessRole: 'owner' },
    { id: 'lavoro@gruppo', summary: 'Lavoro', accessRole: 'writer' },
    { id: 'feste@gruppo', summary: 'Festività', accessRole: 'reader' }
  ],
  eventi: {}
};
let etag = 0;
const nuovoEtag = () => '"e' + (++etag) + '"';
function semina() {
  G.eventi = {
    'lavoro@gruppo': {
      g1: { id: 'g1', summary: 'Riunione di progetto', start: { dateTime: '2026-11-23T10:00:00+01:00' }, end: { dateTime: '2026-11-23T11:00:00+01:00' } },
      /* di tutto il giorno: una data, non un'ora, e la fine è esclusa */
      g2: { id: 'g2', summary: 'Compleanno di Anna', start: { date: '2026-11-24' }, end: { date: '2026-11-25' } },
      /* scritto in UTC: alle 14:30 di Greenwich sono le 15:30 a Roma */
      g3: { id: 'g3', summary: 'Dentista', start: { dateTime: '2026-11-25T14:30:00Z' }, end: { dateTime: '2026-11-25T15:30:00Z' } },
      /* il passato non si importa */
      g4: { id: 'g4', summary: 'Riunione della settimana scorsa', start: { dateTime: '2026-11-20T10:00:00+01:00' }, end: { dateTime: '2026-11-20T11:00:00+01:00' } },
      /* attraversa la mezzanotte: qui si ferma alle 24 */
      g5: { id: 'g5', summary: 'Treno di notte', start: { dateTime: '2026-11-26T22:00:00+01:00' }, end: { dateTime: '2026-11-27T02:00:00+01:00' } },
      /* rifiutato da te: non si importa */
      g6: { id: 'g6', summary: 'Aperitivo che ho rifiutato', start: { dateTime: '2026-11-24T19:00:00+01:00' }, end: { dateTime: '2026-11-24T20:00:00+01:00' },
        attendees: [{ self: true, responseStatus: 'declined' }] },
      /* privato, senza titolo */
      g7: { id: 'g7', start: { dateTime: '2026-11-27T09:00:00+01:00' }, end: { dateTime: '2026-11-27T09:30:00+01:00' } }
    },
    'io@esempio.it': {},
    'feste@gruppo': {}
  };
  Object.values(G.eventi).forEach((c) => Object.values(c).forEach((e) => { e.etag = nuovoEtag(); e.status = 'confirmed'; }));
}
semina();

function rispondi(route, stato, corpo) {
  return route.fulfill({ status: stato, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' },
    body: corpo === undefined ? '' : JSON.stringify(corpo) });
}

async function googleApi(route) {
  const q = route.request();
  const u = new URL(q.url());
  const metodo = q.method();
  if (metodo === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' } });
  const tok = (q.headers()['authorization'] || '').replace('Bearer ', '');
  const via = decodeURIComponent(u.pathname.replace('/calendar/v3', ''));
  const corpo = q.postData() ? JSON.parse(q.postData()) : null;
  G.richieste.push({ metodo, via, corpo, q: u.search });
  if (!G.token.has(tok)) return rispondi(route, 401, { error: { message: 'Invalid Credentials' } });
  if (via === '/users/me/calendarList') return rispondi(route, 200, { items: G.calendari });
  const m = /^\/calendars\/([^/]+)\/events(?:\/(.+))?$/.exec(via);
  if (!m) return rispondi(route, 404, { error: { message: 'no' } });
  const cal = G.eventi[m[1]] || (G.eventi[m[1]] = {});
  const id = m[2];
  if (!id && metodo === 'GET') return rispondi(route, 200, { items: Object.values(cal) });
  if (!id && metodo === 'POST') {
    const nid = corpo.id || ('n' + Date.now());
    if (cal[nid]) return rispondi(route, 409, { error: { message: 'duplicate' } });
    cal[nid] = Object.assign({ status: 'confirmed' }, corpo, { id: nid, etag: nuovoEtag() });
    return rispondi(route, 200, cal[nid]);
  }
  const e = cal[id];
  if (!e) return rispondi(route, 404, { error: { message: 'Not Found' } });
  if (metodo === 'GET') return rispondi(route, 200, e);
  if (metodo === 'DELETE') { delete cal[id]; return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*' }, body: '' }); }
  if (metodo === 'PATCH') {
    Object.keys(corpo).forEach((k) => {
      if (k === 'start' || k === 'end') {
        const v = {}; Object.keys(corpo[k]).forEach((x) => { if (corpo[k][x] !== null) v[x] = corpo[k][x]; });
        e[k] = v;
      } else e[k] = corpo[k];
    });
    e.etag = nuovoEtag();
    return rispondi(route, 200, e);
  }
  return rispondi(route, 405, {});
}

/* la libreria GIS finta: una «finestra» per richiesta, contata */
const GIS_FINTA = `
window.__gis = { chieste: [] };
window.google = { accounts: { oauth2: {
  initTokenClient: function (cfg) {
    return { requestAccessToken: function (o) {
      window.__gis.chieste.push(o || {});
      fetch('https://accounts.google.com/__permesso').then(function (r) { return r.json(); })
        .then(function (j) { cfg.callback({ access_token: j.t, expires_in: 3599, scope: cfg.scope }); });
    } };
  },
  hasGrantedAllScopes: function () { return true; },
  revoke: function () {}
} } };`;

/* ================================================== il Microsoft finto */
const M = {
  token: new Set(), n: 0, richieste: [], scambi: [],
  calendari: [{ id: 'AAMkCal1', name: 'Calendario', canEdit: true, isDefaultCalendar: true }],
  eventi: {
    m1: { id: 'm1', subject: 'Call con il cliente', isAllDay: false, changeKey: 'k1',
      start: { dateTime: '2026-11-24T08:00:00.0000000', timeZone: 'UTC' }, end: { dateTime: '2026-11-24T08:45:00.0000000', timeZone: 'UTC' } },
    m2: { id: 'm2', subject: 'Ferie', isAllDay: true, changeKey: 'k2',
      start: { dateTime: '2026-11-30T00:00:00.0000000', timeZone: 'UTC' }, end: { dateTime: '2026-12-02T00:00:00.0000000', timeZone: 'UTC' } },
    m3: { id: 'm3', subject: 'Annullata', isAllDay: false, isCancelled: true, changeKey: 'k3',
      start: { dateTime: '2026-11-25T08:00:00.0000000', timeZone: 'UTC' }, end: { dateTime: '2026-11-25T09:00:00.0000000', timeZone: 'UTC' } }
  }
};
let ck = 10;
async function microsoftApi(route) {
  const q = route.request();
  const u = new URL(q.url());
  const metodo = q.method();
  if (metodo === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' } });
  const tok = (q.headers()['authorization'] || '').replace('Bearer ', '');
  const via = decodeURIComponent(u.pathname.replace('/v1.0', ''));
  const corpo = q.postData() ? JSON.parse(q.postData()) : null;
  M.richieste.push({ metodo, via, corpo, prefer: q.headers()['prefer'] || '' });
  if (!M.token.has(tok)) return rispondi(route, 401, { error: { code: 'InvalidAuthenticationToken' } });
  if (via === '/me') return rispondi(route, 200, { mail: 'io@contoso.com' });
  if (via === '/me/calendars') return rispondi(route, 200, { value: M.calendari });
  if (/^\/me\/calendars\/[^/]+\/calendarView$/.test(via)) return rispondi(route, 200, { value: Object.values(M.eventi) });
  if (/^\/me\/calendars\/[^/]+\/events$/.test(via) && metodo === 'POST') {
    const nid = 'mx' + (++ck);
    M.eventi[nid] = Object.assign({}, corpo, { id: nid, changeKey: 'k' + ck });
    return rispondi(route, 201, M.eventi[nid]);
  }
  const m = /^\/me\/events\/(.+)$/.exec(via);
  const e = m && M.eventi[m[1]];
  if (!e) return rispondi(route, 404, { error: { code: 'ErrorItemNotFound' } });
  if (metodo === 'GET') return rispondi(route, 200, e);
  if (metodo === 'DELETE') { delete M.eventi[m[1]]; return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*' }, body: '' }); }
  if (metodo === 'PATCH') { Object.assign(e, corpo, { changeKey: 'k' + (++ck) }); return rispondi(route, 200, e); }
  return rispondi(route, 405, {});
}

async function microsoftLogin(route) {
  const q = route.request();
  const u = new URL(q.url());
  if (/\/authorize$/.test(u.pathname)) {
    /* la pagina di Microsoft, in un colpo: «sì» e si torna all'app */
    M.autorizza = Object.fromEntries(u.searchParams);
    const torna = u.searchParams.get('redirect_uri') + '?code=CODICE-FINTO&state=' + encodeURIComponent(u.searchParams.get('state'));
    return route.fulfill({ status: 302, headers: { Location: torna }, body: '' });
  }
  if (q.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' } });
  const corpo = Object.fromEntries(new URLSearchParams(q.postData() || ''));
  M.scambi.push(corpo);
  const t = 'ms-tok-' + (++M.n);
  M.token.add(t);
  return rispondi(route, 200, { access_token: t, refresh_token: 'ms-rinnovo-' + M.n, expires_in: 3600, token_type: 'Bearer' });
}

/* ============================================================ il browser */
(async () => {
  const srv = http.createServer((q, r) => {
    let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
    fs.readFile(path.join(RADICE, p), (e, d) => {
      if (e) { r.statusCode = 404; r.end('x'); return; }
      r.setHeader('Content-Type', T[path.extname(p)] || 'application/octet-stream'); r.end(d);
    });
  });
  await new Promise((r) => srv.listen(PORTA, r));
  const b = await require('./comune/lancia')();
  const errori = [];

  async function dispositivo(nome) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, timezoneId: FUSO, locale: 'it-IT' });
    await ctx.route('https://accounts.google.com/gsi/client', (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: GIS_FINTA }));
    await ctx.route('https://accounts.google.com/__permesso', (r) => {
      const t = 'g-tok-' + (++G.n); G.token.add(t);
      return rispondi(r, 200, { t });
    });
    await ctx.route('https://www.googleapis.com/**', googleApi);
    await ctx.route('https://graph.microsoft.com/**', microsoftApi);
    await ctx.route('https://login.microsoftonline.com/**', microsoftLogin);
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errori.push(nome + ': ' + String(e).split('\n')[0]));
    await p.addInitScript((t) => {
      const D = Date; const base = D.now();
      class F extends D {
        constructor(...a) { if (!a.length) super(t + (D.now() - base)); else super(...a); }
        static now() { return t + (D.now() - base); }
      }
      window.Date = F;
    }, ADESSO);
    await p.goto(SITO + 'index.html');
    await p.waitForTimeout(400);
    await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
    await p.reload();
    await p.waitForTimeout(900);
    return { ctx, p };
  }
  const apriPannello = async (p) => {
    await p.evaluate(() => { location.hash = '#/profilo'; });
    await p.waitForTimeout(500);
    await p.evaluate(() => { const r = document.getElementById('imp-calendari'); if (r) r.click(); });
    await p.waitForTimeout(600);
  };
  const giro = (p) => p.evaluate(() => window.__PROVE__.calendari.sincronizza('prova'));
  const collegate = (p, prov) => p.evaluate((pr) => LM.load().azioni.filter((a) => a.esterno && a.esterno.prov === pr)
    .map((a) => ({ id: a.id, ev: a.esterno.id, testo: a.testo, data: a.data, ora: a.ora, durata: a.durata, area: a.areaId, done: a.done })), prov);
  const diEvento = async (p, ev) => (await collegate(p, 'google')).find((a) => a.ev === ev);

  /* ================================================== 1. senza ID
     L'ID di Google può essere già scritto in src/calendari/config.ts (il
     fondatore ce l'ha messo): allora «da configurare» lo controlla solo
     Microsoft, e Google parte già «da collegare» senza campo da riempire. */
  const CONF = fs.readFileSync(path.join(__dirname, '..', 'src', 'calendari', 'config.ts'), 'utf8');
  const IN_G = /GOOGLE_CLIENT_ID = '[^']+'/.test(CONF), IN_M = /MICROSOFT_CLIENT_ID = '[^']+'/.test(CONF);
  console.log('\n1. SENZA ID DELL’APP: DA CONFIGURARE, E NIENTE PARTE' + (IN_G || IN_M ? ' (ID già nel codice: ' + [IN_G && 'Google', IN_M && 'Microsoft'].filter(Boolean).join(', ') + ')' : ''));
  const A = await dispositivo('A');
  const p = A.p;
  await apriPannello(p);
  {
    const v = await p.evaluate(() => ({
      titolo: (document.getElementById('sheet-titolo') || {}).textContent,
      g: (document.getElementById('cal-google-stato') || {}).textContent,
      m: (document.getElementById('cal-microsoft-stato') || {}).textContent,
      link: [...document.querySelectorAll('.cal-link')].map((a) => a.getAttribute('href')),
      collega: !!document.getElementById('cal-google-collega'),
      sinc: !!document.getElementById('cal-sincronizza')
    }));
    ok('il pannello si apre dal Profilo', /Calendari collegati/.test(v.titolo || ''), v.titolo);
    ok(IN_G ? 'Google, con l’ID nel codice, è già «da collegare»' : 'Google è «da configurare»', v.g === (IN_G ? 'Da collegare' : 'Da configurare'), v.g);
    ok(IN_M ? 'Microsoft, con l’ID nel codice, è già «da collegare»' : 'Microsoft è «da configurare»', v.m === (IN_M ? 'Da collegare' : 'Da configurare'), v.m);
    const mancano = (IN_G ? 0 : 1) + (IN_M ? 0 : 1);
    ok('un link alle istruzioni per ogni ID che manca', v.link.length === mancano && v.link.every((h) => /LEGGIMI\.md$/.test(h)), v.link.length + '');
    ok('e niente da sincronizzare' + (IN_G ? '' : ' né da collegare'), (IN_G || !v.collega) && !v.sinc);
    const prima = G.richieste.length + M.richieste.length;
    await giro(p);
    ok('un giro non manda nessuna richiesta', G.richieste.length + M.richieste.length === prima, (G.richieste.length + M.richieste.length - prima) + ' richieste');
    ok('e non rompe niente', !errori.length, errori.join(' | '));
  }

  /* ============================================ 2. Google: importazione */
  console.log('\n2. GOOGLE: SI COLLEGA, SI SCEGLIE, SI IMPORTA');
  {
    if (!IN_G) {
      await p.fill('#cal-google-id', '1234-finto.apps.googleusercontent.com');
      await p.press('#cal-google-id', 'Enter');
      await p.waitForTimeout(500);
    }
    const stato = await p.textContent('#cal-google-stato');
    ok('incollato l’ID, Google è «da collegare»', stato === 'Da collegare', stato);
    await p.click('#cal-google-collega');
    await p.waitForTimeout(800);
    const v = await p.evaluate(() => ({
      stato: (document.getElementById('cal-google-stato') || {}).textContent,
      email: (document.querySelector('#cal-google .cal-email') || {}).textContent,
      cal: [...document.querySelectorAll('#cal-google .cal-nome')].map((x) => x.textContent),
      accesi: [...document.querySelectorAll('#cal-google [data-cal]')].filter((x) => x.getAttribute('aria-checked') === 'true').length,
      token: !!localStorage.getItem('lifemax.calendari.google'),
      nelProfilo: JSON.stringify(LM.load().profilo.calendari || {})
    }));
    ok('collegato, con l’email dell’account', v.stato === 'Collegato' && v.email === 'io@esempio.it', v.stato + ' · ' + v.email);
    ok('l’elenco dei calendari c’è', v.cal.length === 3, v.cal.join(', '));
    ok('e nessuno è acceso finché non lo scegli', v.accesi === 0, v.accesi + ' accesi');
    ok('il permesso sta in questo browser', v.token);
    ok('e NON nei dati che vanno nel cloud', !/g-tok-/.test(v.nelProfilo));

    /* area «Lavoro» (quella di partenza) per il calendario di lavoro, e lo si accende */
    await p.selectOption('#cal-google .cal-riga:has([data-cal="lavoro@gruppo"]) select', 'lavoro');
    await p.click('#cal-google [data-cal="lavoro@gruppo"]');
    await p.waitForTimeout(300);
    await giro(p);
    const az = await collegate(p, 'google');
    const per = (ev) => az.find((a) => a.ev === ev) || {};
    ok('gli eventi di oggi in poi sono diventati attività', ['g1', 'g2', 'g3', 'g5', 'g7'].every((e) => per(e).id), az.map((a) => a.ev).join(','));
    ok('il passato no', !per('g4').id);
    ok('e nemmeno quello che hai rifiutato', !per('g6').id);
    ok('con orario: giorno, ora e durata di qui', per('g1').data === '2026-11-23' && per('g1').ora === '10:00' && per('g1').durata === 60,
      per('g1').data + ' ' + per('g1').ora + ' ' + per('g1').durata + ' min');
    ok('un’ora scritta in UTC arriva nell’ora di Roma', per('g3').ora === '15:30', per('g3').ora);
    ok('tutto il giorno = senza orario, nel suo giorno', per('g2').data === '2026-11-24' && per('g2').ora === null && per('g2').durata === null,
      per('g2').data + ' ' + per('g2').ora);
    ok('a cavallo della mezzanotte: il giorno in cui comincia, fino alle 24', per('g5').data === '2026-11-26' && per('g5').durata === 120,
      per('g5').data + ' ' + per('g5').ora + ' ' + per('g5').durata + ' min');
    ok('un evento senza titolo si chiama «Impegno»', per('g7').testo === 'Impegno', per('g7').testo);
    ok('nell’area scelta per quel calendario', az.every((a) => a.area === 'lavoro'), [...new Set(az.map((a) => a.area))].join(','));
    const idg1 = await p.evaluate(() => window.__PROVE__.calendari.idAzione('google', 'lavoro@gruppo', 'g1'));
    ok('l’id dell’attività nasce dall’evento', per('g1').id === idg1, per('g1').id);
    /* un secondo giro, senza che sia cambiato niente, non scrive niente là */
    const scritte = G.richieste.filter((r) => r.metodo !== 'GET').length;
    await giro(p);
    ok('un giro senza novità non scrive niente nel calendario', G.richieste.filter((r) => r.metodo !== 'GET').length === scritte);
    ok('e non fa doppioni', (await collegate(p, 'google')).length === az.length);

    /* nella giornata si vede da dove viene */
    await p.evaluate(() => { window.__PROVE__ && document.querySelector('.sheet-chiudi') && document.querySelector('.sheet-chiudi').click(); location.hash = '#/giornata'; });
    await p.waitForTimeout(900);
    const segno = await p.evaluate((id) => {
      const blk = document.querySelector('[data-blk-az="' + id + '"] .tl-blk-t, [data-drag-az="' + id + '"] .tl-blk-t');
      return blk ? blk.innerHTML : '';
    }, idg1);
    ok('nella Giornata il blocco porta il segno del calendario', /<svg/.test(segno), segno ? 'c’è' : 'blocco non trovato');
  }

  /* ===================================== 3. cambiato sul calendario */
  console.log('\n3. CAMBIATO SUL CALENDARIO → CAMBIA QUI');
  {
    const e = G.eventi['lavoro@gruppo'].g1;
    e.start = { dateTime: '2026-11-23T12:00:00+01:00' }; e.end = { dateTime: '2026-11-23T13:30:00+01:00' }; e.summary = 'Riunione di progetto (spostata)'; e.etag = nuovoEtag();
    const scritte = G.richieste.filter((r) => r.metodo !== 'GET').length;
    await giro(p);
    const a = await diEvento(p, 'g1');
    ok('ora, durata e titolo arrivano qui', a.ora === '12:00' && a.durata === 90 && a.testo === 'Riunione di progetto (spostata)', a.ora + ' ' + a.durata + ' «' + a.testo + '»');
    ok('e non si rimanda indietro niente', G.richieste.filter((r) => r.metodo !== 'GET').length === scritte);
  }

  /* ============================================ 4. cambiato qui */
  console.log('\n4. CAMBIATO QUI → PARTE VERSO IL CALENDARIO');
  {
    const a3 = await diEvento(p, 'g3');
    const a2 = await diEvento(p, 'g2');
    await p.evaluate(([x, y]) => { LM.setOraAzione(x, '17:00'); LM.modificaAzione(y, 'Compleanno di Anna — torta!'); }, [a3.id, a2.id]);
    const da = G.richieste.length;
    await giro(p);
    const patch = G.richieste.slice(da).filter((r) => r.metodo === 'PATCH');
    const p3 = patch.find((r) => /g3$/.test(r.via)), p2 = patch.find((r) => /g2$/.test(r.via));
    ok('una PATCH per ognuna', patch.length === 2, patch.map((r) => r.via).join(', '));
    ok('l’ora nuova, nel fuso giusto: le 17 di Roma sono le 16 UTC', p3 && p3.corpo.start && p3.corpo.start.dateTime === '2026-11-25T16:00:00.000Z',
      p3 && JSON.stringify(p3.corpo.start));
    ok('e lo spostamento non accorcia: resta un’ora', p3 && p3.corpo.end && p3.corpo.end.dateTime === '2026-11-25T17:00:00.000Z', p3 && JSON.stringify(p3.corpo.end));
    ok('spostare non tocca il titolo', p3 && p3.corpo.summary === undefined);
    ok('rinominare manda solo il titolo', p2 && p2.corpo.summary === 'Compleanno di Anna — torta!' && !p2.corpo.start,
      p2 && JSON.stringify(p2.corpo));
    const e2 = G.eventi['lavoro@gruppo'].g2;
    ok('e il giorno intero resta un giorno intero', e2.start.date === '2026-11-24' && !e2.start.dateTime, JSON.stringify(e2.start));
    const da2 = G.richieste.length;
    await giro(p);
    ok('il giro dopo non rispedisce', !G.richieste.slice(da2).some((r) => r.metodo === 'PATCH'));
    /* la durata cambiata qui cambia davvero la fine */
    await p.evaluate((x) => LM.setDurataAzione(x, 30), a3.id);
    await giro(p);
    ok('cambiare la durata cambia la fine', G.eventi['lavoro@gruppo'].g3.end.dateTime === '2026-11-25T16:30:00.000Z', G.eventi['lavoro@gruppo'].g3.end.dateTime);
  }

  /* ============================================ 5. cancellazioni */
  console.log('\n5. LE CANCELLAZIONI, NEI DUE SENSI');
  {
    const a5 = await diEvento(p, 'g5');
    await p.evaluate((x) => LM.rimuoviAzione(x), a5.id);
    await giro(p);
    ok('eliminata qui → cancellata nel calendario', !G.eventi['lavoro@gruppo'].g5, G.richieste.filter((r) => r.metodo === 'DELETE').map((r) => r.via).join(','));
    await giro(p);
    ok('e non torna al giro dopo', !(await diEvento(p, 'g5')));

    /* cancellato là: g3 sparisce; g2 era già fatta e resta, staccata */
    const a2 = await diEvento(p, 'g2');
    await p.evaluate((x) => LM.completaAzione(x), a2.id);
    delete G.eventi['lavoro@gruppo'].g3;
    delete G.eventi['lavoro@gruppo'].g2;
    await giro(p);
    const resta = await p.evaluate((id) => { const a = LM.load().azioni.find((x) => x.id === id); return a ? { done: a.done, esterno: a.esterno } : null; }, a2.id);
    ok('cancellata nel calendario → tolta qui', !(await diEvento(p, 'g3')));
    ok('ma una già fatta resta, staccata', resta && resta.done && resta.esterno === null, JSON.stringify(resta));

    /* «Azzera tutto» NON svuota il calendario: le lapidi non sono un «cancella» */
    const quanti = Object.keys(G.eventi['lavoro@gruppo']).length;
    const tolti = await p.evaluate(() => {
      const s = LM.load();
      s.azioni = s.azioni.filter((a) => !a.esterno); LM.save();
      return Object.keys((s.profilo.calendari || {}).tolti || {}).length;
    });
    await giro(p);
    ok('righe sparite senza un «elimina» non cancellano niente là', Object.keys(G.eventi['lavoro@gruppo']).length === quanti,
      quanti + ' → ' + Object.keys(G.eventi['lavoro@gruppo']).length + ' (tolti chiesti: ' + tolti + ')');
  }

  /* ================================================ 6. conflitto */
  console.log('\n6. CAMBIATA DA TUTTE E DUE LE PARTI: VINCE IL CALENDARIO');
  {
    const a1 = await diEvento(p, 'g1');
    ok('(la riunione è tornata dopo che le righe erano sparite)', !!a1);
    await p.evaluate((x) => LM.setOraAzione(x, '09:00'), a1.id);
    const e = G.eventi['lavoro@gruppo'].g1;
    e.start = { dateTime: '2026-11-23T14:00:00+01:00' }; e.end = { dateTime: '2026-11-23T15:00:00+01:00' }; e.etag = nuovoEtag();
    const da = G.richieste.length;
    await giro(p);
    const a = await diEvento(p, 'g1');
    ok('l’ora è quella del calendario', a.ora === '14:00', a.ora);
    ok('e là non è partito niente', !G.richieste.slice(da).some((r) => r.metodo === 'PATCH'));
    const v = await p.evaluate(() => ({
      diario: LM.load().registro.filter((r) => r.cat === 'calendario').map((r) => r.testo).join(' | '),
      esito: (LM.load().profilo.calendari.esito || {}).testo
    }));
    ok('il Diario lo racconta', /cambiata qui e anche su Google/.test(v.diario), v.diario.slice(0, 120));
    ok('e l’esito lo dice senza allarmi', /versione del calendario/.test(v.esito || '') && !/errore/i.test(v.esito || ''), v.esito);
  }

  /* =========================================== 7. due dispositivi */
  console.log('\n7. DUE DISPOSITIVI, LO STESSO EVENTO: UNA RIGA SOLA');
  const B = await dispositivo('B');
  {
    const q = B.p;
    /* la configurazione arriva da A — come farebbe il cloud — ma il permesso no */
    await q.evaluate((st) => LM.hydrate(JSON.parse(st)), await p.evaluate(() => JSON.stringify(LM.snapshot())));
    await apriPannello(q);
    const stato = await q.textContent('#cal-google-stato');
    ok('su B la scelta c’è, il permesso no: lo dice', stato === 'Collegato su un altro dispositivo', stato);
    const prima = G.richieste.length;
    await giro(q);
    ok('e senza permesso B non chiede niente a Google', G.richieste.length === prima);
    await q.click('#cal-google-ricollega');
    await q.waitForTimeout(500);
    /* B importa per conto suo un evento nuovo, che A non ha ancora visto */
    G.eventi['lavoro@gruppo'].g8 = { id: 'g8', summary: 'Pranzo con Luca', status: 'confirmed', etag: nuovoEtag(),
      start: { dateTime: '2026-11-28T13:00:00+01:00' }, end: { dateTime: '2026-11-28T14:00:00+01:00' } };
    await giro(q);
    await giro(p);
    const inA = (await collegate(p, 'google')).filter((a) => a.ev === 'g8').length;
    const inB = (await collegate(q, 'google')).filter((a) => a.ev === 'g8').length;
    ok('l’hanno importato tutti e due', inA === 1 && inB === 1, 'A ' + inA + ', B ' + inB);
    /* la fusione del cloud, nei due versi */
    await q.evaluate((st) => LM.hydrate(JSON.parse(st)), await p.evaluate(() => JSON.stringify(LM.snapshot())));
    await p.evaluate((st) => LM.hydrate(JSON.parse(st)), await q.evaluate(() => JSON.stringify(LM.snapshot())));
    const dopo = await q.evaluate(() => {
      const per = {};
      LM.load().azioni.forEach((a) => { if (a.esterno) per[a.esterno.id] = (per[a.esterno.id] || 0) + 1; });
      return per;
    });
    ok('dopo la fusione, una riga per evento', Object.values(dopo).every((n) => n === 1) && dopo.g8 === 1, JSON.stringify(dopo));
    ok('e lo stesso su A', (await collegate(p, 'google')).filter((a) => a.ev === 'g8').length === 1);
    await B.ctx.close();
  }

  /* ========================================== 8. permesso scaduto */
  console.log('\n8. IL PERMESSO SCADUTO: NESSUNA FINESTRA DA SOLA, UN TOCCO BASTA');
  {
    await p.evaluate(() => {
      const v = JSON.parse(localStorage.getItem('lifemax.calendari.google'));
      v.scade = Date.now() - 1000; localStorage.setItem('lifemax.calendari.google', JSON.stringify(v));
    });
    const finestre = await p.evaluate(() => window.__gis.chieste.length);
    const prima = G.richieste.length;
    await giro(p);
    const esitoPrima = await p.evaluate(() => JSON.stringify(LM.load().profilo.calendari.esito));
    await apriPannello(p);
    const v = await p.evaluate(() => ({ n: window.__gis.chieste.length, esito: JSON.stringify(LM.load().profilo.calendari.esito),
      nota: (document.getElementById('cal-nota') || {}).textContent }));
    ok('un giro automatico non apre finestre', v.n === finestre, (v.n - finestre) + ' finestre');
    ok('e non chiede niente a Google con un permesso scaduto', G.richieste.length === prima);
    ok('il pannello dice cosa fare, con calma', /Ricollega/.test(v.nota || '') && !/errore/i.test(v.nota || ''), v.nota);
    ok('e l’esito comune, che legge anche l’altro dispositivo, non cambia', v.esito === esitoPrima);
    const tasto = await p.evaluate(() => (document.getElementById('cal-google-ricollega') || {}).textContent);
    ok('nel pannello c’è «Ricollega»', tasto === 'Ricollega', tasto);
    await p.click('#cal-google-ricollega');
    await p.waitForTimeout(800);
    const w = await p.evaluate(() => ({ n: window.__gis.chieste.length, ultima: window.__gis.chieste[window.__gis.chieste.length - 1],
      stato: (document.getElementById('cal-google-stato') || {}).textContent }));
    ok('un tocco apre UNA finestra, senza ri-chiedere il consenso', w.n === finestre + 1 && w.ultima && w.ultima.prompt === '', JSON.stringify(w.ultima));
    ok('e si torna collegati', w.stato === 'Collegato', w.stato);
    /* un token rifiutato da Google a metà strada (401) */
    G.token.clear();
    await giro(p);
    await p.waitForTimeout(200);
    const r = await p.evaluate(() => ({ t: localStorage.getItem('lifemax.calendari.google'), nota: (document.getElementById('cal-nota') || {}).textContent,
      tasto: !!document.getElementById('cal-google-ricollega') }));
    ok('un 401 di Google butta il permesso e chiede «Ricollega»', !r.t && /Ricollega/.test(r.nota || '') && r.tasto, r.nota);
    await p.click('#cal-google-ricollega');
    await p.waitForTimeout(800);
  }

  /* ============================== 9. le nuove attività, nel calendario */
  console.log('\n9. LE NUOVE ATTIVITÀ CON ORARIO, NEL CALENDARIO SCELTO');
  {
    const prima = await p.evaluate(() => { const a = LM.aggiungiAzione('Vecchia, nata prima', 'salute', { ora: '18:00', durata: 30 }); return a.id; });
    await p.selectOption('#cal-dest', 'google|lavoro@gruppo');
    await p.waitForTimeout(200);
    const scelte = await p.evaluate(() => [...document.querySelectorAll('#cal-dest option')].map((o) => o.textContent));
    ok('la scelta parte da «Nessuno» e mostra solo dove si può scrivere', scelte[0] === 'Nessuno' && !scelte.some((t) => /Festivit/.test(t)), scelte.join(' / '));
    const id = await p.evaluate(() => { const a = LM.aggiungiAzione('Palestra', 'salute', { ora: '19:00', durata: 45, data: LM.addDays(LM.todayKey(), 1) }); return a.id; });
    await p.evaluate(() => LM.aggiungiAzione('Senza orario', 'salute', {}));
    await giro(p);
    const ev = Object.values(G.eventi['lavoro@gruppo']).filter((e) => e.summary === 'Palestra');
    ok('la nuova con orario è diventata un evento', ev.length === 1 && ev[0].start.dateTime === '2026-11-24T18:00:00.000Z', ev[0] && JSON.stringify(ev[0].start));
    ok('che dura quanto lei', ev[0] && ev[0].end.dateTime === '2026-11-24T18:45:00.000Z');
    ok('quella senza orario no', !Object.values(G.eventi['lavoro@gruppo']).some((e) => e.summary === 'Senza orario'));
    ok('e nemmeno quelle nate prima della scelta', !Object.values(G.eventi['lavoro@gruppo']).some((e) => e.summary === 'Vecchia, nata prima'));
    const a = await p.evaluate((x) => LM.load().azioni.find((y) => y.id === x).esterno, id);
    ok('da qui in poi è collegata', a && a.prov === 'google' && a.id === ev[0].id, a && a.id);
    /* l'id l'ha scelto LifeMax: un secondo dispositivo che la spedisce prima
       di essersi fuso trova «esiste già», e non fa un doppione */
    await p.evaluate((x) => { const s = LM.load(); delete s.azioni.find((y) => y.id === x).esterno; LM.save(); }, id);
    await giro(p);
    ok('spedita due volte, resta UN evento', Object.values(G.eventi['lavoro@gruppo']).filter((e) => e.summary === 'Palestra').length === 1);
    void prima;
    await p.selectOption('#cal-dest', '');
  }

  /* ================================================= 10. Microsoft */
  console.log('\n10. OUTLOOK: DAL RIMANDO ALLA PAGINA DI ACCESSO ALLA MODIFICA SPEDITA');
  {
    if (!IN_M) {
      await p.fill('#cal-microsoft-id', 'id-finto-microsoft');
      await p.press('#cal-microsoft-id', 'Enter');
    }
    await p.waitForTimeout(400);
    await Promise.all([p.waitForNavigation(), p.click('#cal-microsoft-collega')]);
    await p.waitForTimeout(1800);
    const v = await p.evaluate(() => ({
      url: location.href,
      titolo: (document.getElementById('sheet-titolo') || {}).textContent,
      stato: (document.getElementById('cal-microsoft-stato') || {}).textContent,
      email: (document.querySelector('#cal-microsoft .cal-email') || {}).textContent
    }));
    const au = M.autorizza || {};
    ok('a Microsoft si chiede il codice con la sfida PKCE', au.code_challenge_method === 'S256' && !!au.code_challenge && au.response_type === 'code',
      au.code_challenge_method);
    ok('e i due permessi, più quello per rinnovare', /Calendars\.ReadWrite/.test(au.scope || '') && /User\.Read/.test(au.scope || '') && /offline_access/.test(au.scope || ''), au.scope);
    ok('il ritorno è la pagina dell’app', au.redirect_uri === SITO, au.redirect_uri);
    ok('il codice è stato scambiato con la sua chiave', M.scambi.length === 1 && M.scambi[0].code === 'CODICE-FINTO' && !!M.scambi[0].code_verifier,
      JSON.stringify(Object.keys(M.scambi[0] || {})));
    ok('e tolto dall’indirizzo', !/code=/.test(v.url), v.url);
    ok('al ritorno il pannello si riapre da sé', /Calendari collegati/.test(v.titolo || ''), v.titolo);
    ok('collegato, con l’email', v.stato === 'Collegato' && v.email === 'io@contoso.com', v.stato + ' · ' + v.email);
    await p.click('#cal-microsoft [data-cal="AAMkCal1"]');
    await p.waitForTimeout(300);
    await giro(p);
    const az = await collegate(p, 'microsoft');
    const per = (e) => az.find((a) => a.ev === e) || {};
    ok('gli eventi di Outlook sono attività', !!per('m1').id && !!per('m2').id, az.map((a) => a.ev).join(','));
    ok('quelli annullati no', !per('m3').id);
    ok('le 8 UTC sono le 9 a Roma', per('m1').ora === '09:00' && per('m1').durata === 45, per('m1').ora + ' ' + per('m1').durata);
    ok('le ferie di più giorni: dal primo giorno, senza orario', per('m2').data === '2026-11-30' && per('m2').ora === null, per('m2').data + ' ' + per('m2').ora);
    ok('le ore si chiedono in UTC, e le traduce il browser', M.richieste.some((r) => /calendarView/.test(r.via) && /UTC/.test(r.prefer)));
    await p.evaluate((x) => LM.setOraAzione(x, '11:15'), per('m1').id);
    await giro(p);
    const pm = M.richieste.filter((r) => r.metodo === 'PATCH').pop();
    ok('la modifica parte verso Outlook, in UTC', pm && pm.corpo.start.dateTime === '2026-11-24T10:15:00' && pm.corpo.start.timeZone === 'UTC',
      pm && JSON.stringify(pm.corpo.start));
    /* il permesso breve scaduto si rinnova da sé col refresh token, senza tornare da Microsoft */
    await p.evaluate(() => { const v = JSON.parse(localStorage.getItem('lifemax.calendari.microsoft')); v.scade = 0; localStorage.setItem('lifemax.calendari.microsoft', JSON.stringify(v)); });
    await giro(p);
    ok('scaduto il permesso breve, si rinnova da solo', M.scambi.length === 2 && M.scambi[1].grant_type === 'refresh_token', M.scambi.map((s) => s.grant_type).join(','));

    /* scollegare: chiede, e «tienile» le lascia staccate */
    await p.click('#cal-microsoft-scollega');
    await p.waitForTimeout(200);
    const chiede = await p.evaluate(() => !!document.getElementById('cal-microsoft-tieni') && !!document.getElementById('cal-microsoft-togli'));
    ok('scollegare chiede cosa fare delle attività', chiede);
    const quanteEventi = Object.keys(M.eventi).length;
    await p.click('#cal-microsoft-tieni');
    await p.waitForTimeout(300);
    const dopo = await p.evaluate(() => ({
      ms: LM.load().azioni.filter((a) => a.esterno && a.esterno.prov === 'microsoft').length,
      staccate: LM.load().azioni.filter((a) => a.esterno === null && /Call con il cliente|Ferie/.test(a.testo)).length,
      token: !!localStorage.getItem('lifemax.calendari.microsoft'),
      stato: (document.getElementById('cal-microsoft-stato') || {}).textContent
    }));
    ok('«tienile»: restano, staccate', dopo.ms === 0 && dopo.staccate === 2, JSON.stringify(dopo));
    ok('il permesso se ne va', !dopo.token && dopo.stato === 'Da collegare', dopo.stato);
    ok('e il calendario non si tocca', Object.keys(M.eventi).length === quanteEventi);
  }

  ok('nessun errore nella pagina, in tutta la prova', !errori.length, errori.slice(0, 3).join(' | '));
  await b.close();
  srv.close();
  console.log(guai ? '\n>>> ' + guai + (guai === 1 ? ' PROBLEMA' : ' PROBLEMI') : '\n>>> TUTTO A POSTO');
  process.exit(guai ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
