'use strict';
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

module.exports = { G, M, GIS_FINTA, googleApi, microsoftApi, microsoftLogin, rispondi, semina, ADESSO, FUSO, nuovoEtag };
