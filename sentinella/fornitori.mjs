/* ============================================================
   GOOGLE E MICROSOFT, VISTI DAL SERVER.

   Sono le stesse due lingue che l'app parla in src/calendari/google.ts e
   microsoft.ts, con due differenze:

   1. IL PERMESSO. Nel browser Google dà un permesso di un'ora e basta;
      qui la sentinella fa lo scambio «authorization code» con il proprio
      segreto (client secret) e riceve anche il REFRESH TOKEN: con quello
      rinnova il permesso da sola, senza finestre, finché tu non lo ritiri.
      Microsoft fa lo stesso, e a un'app «Web» (con segreto) dà permessi
      che durano 90 giorni e si allungano a ogni uso, invece delle 24 ore
      dei browser.

   2. LA FORMA DEGLI EVENTI. Il server non sa in che fuso sei: quindi non
      traduce in «giorno e ora di qui» come fa l'app. Tiene l'evento in una
      forma NEUTRA, e l'app la porta nel fuso del dispositivo:
        id   l'evento (o l'istanza, se si ripete)
        t    il titolo ('' se non c'è: l'app lo chiama «Impegno»)
        tg   tutto il giorno?
        di, df   i giorni (AAAA-MM-GG, fine esclusa) per tutto il giorno
        i, f     inizio e fine in millisecondi, per quelli con orario
        v    la versione (etag di Google, changeKey di Microsoft)
        via  cancellato, rifiutato da te, o «luogo di lavoro» di Google
        org  sei tu l'organizzatore (l'evento è di questo calendario)?
        altri  ci sono altri invitati? (sì o no: CHI non si legge e non si tiene)

   COSA SI LEGGE DEGLI INVITATI. Da Google si chiedono solo due campi per
   ogni invitato, `self` (sei tu?) e `resource` (è una sala?), con il
   parametro `fields`: nomi e indirizzi non arrivano proprio. Microsoft non
   permette di chiedere meno dell'elenco intero: arriva, si conta, e se ne
   tiene solo «ci sono altri sì/no». Non si scrive da nessuna parte.
   ============================================================ */

export const GOOGLE_ID = '168732828259-r62fu4bc9ppa5fdtljdmffj6qib16epa.apps.googleusercontent.com';
export const MICROSOFT_ID = '139c6fa8-e084-4b27-902b-fc348453b4f4';

const G_AUTH = 'https://accounts.google.com/o/oauth2/v2/auth';
const G_TOKEN = 'https://oauth2.googleapis.com/token';
const G_REVOCA = 'https://oauth2.googleapis.com/revoke';
const G_API = 'https://www.googleapis.com/calendar/v3';
const G_S_ELENCO = 'https://www.googleapis.com/auth/calendar.calendarlist.readonly';
const G_S_EVENTI = 'https://www.googleapis.com/auth/calendar.events';
const G_CAMPI = 'items(id,status,summary,etag,updated,eventType,start,end,attendees(self,resource,responseStatus),organizer(self)),nextPageToken,nextSyncToken';

const M_LOGIN = 'https://login.microsoftonline.com/common/oauth2/v2.0/';
const M_API = 'https://graph.microsoft.com/v1.0';
const M_SCOPE = 'openid profile offline_access User.Read Calendars.ReadWrite';
const M_CAMPI = '$select=id,subject,start,end,isAllDay,isCancelled,responseStatus,changeKey,lastModifiedDateTime,isOrganizer,attendees';

/* ------------------------------------------------------------ gli errori
   Le stesse cinque parole dell'app (fornitore.ts), più «revocato»: il
   refresh token non vale più (l'hai ritirato dalla pagina di Google, o è
   scaduto). È l'unico caso in cui serve davvero un tocco. */
export class Errore extends Error {
  constructor(tipo, msg, stato) { super(msg); this.tipo = tipo; this.stato = stato || 0; }
}

async function leggiJson(r) { try { return await r.json(); } catch { return {}; } }

function classifica(nome, r, j) {
  const motivo = (j && j.error && (j.error.errors && j.error.errors[0] && j.error.errors[0].reason || j.error.code || j.error.message)) || '';
  if (r.status === 401) return new Errore('token', nome + ': permesso scaduto', 401);
  if (r.status === 404 || r.status === 410) return new Errore('sparito', 'l’evento non c’è più', r.status);
  if (r.status === 429 || r.status >= 500 || /rateLimit|userRateLimit|quota/i.test(String(motivo))) return new Errore('rete', nome + ' è occupato', r.status);
  if (r.status === 403) return new Errore('permesso', nome + ' non permette di cambiare questo calendario', 403);
  if (r.status === 409) return new Errore('esiste', 'esiste già', 409);
  return new Errore('altro', nome + ' ha risposto ' + r.status + (motivo ? ' (' + motivo + ')' : ''), r.status);
}

async function modulo(url, campi) {
  let r;
  try {
    r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(campi).toString() });
  } catch { throw new Errore('rete', 'non risponde'); }
  const j = await leggiJson(r);
  return { r: r, j: j };
}

async function chiama(nome, base, at, metodo, via, corpo, testa) {
  let r;
  try {
    const h = Object.assign({ Authorization: 'Bearer ' + at }, testa || {});
    const o = { method: metodo, headers: h };
    if (corpo !== undefined) { h['Content-Type'] = 'application/json'; o.body = JSON.stringify(corpo); }
    r = await fetch(/^https?:/.test(via) ? via : base + via, o);
  } catch { throw new Errore('rete', nome + ' non risponde'); }
  if (r.status === 204) return null;
  const j = await leggiJson(r);
  if (r.ok) return j;
  throw classifica(nome, r, j);
}

/* ----------------------------------------------------- Microsoft: le ore */
function utc(q) {
  const s = (q && q.dateTime) || '';
  return Date.parse(/[zZ]|[+-]\d\d:\d\d$/.test(s) ? s : s + 'Z') || 0;
}
function giornoPiu(g, n) {
  const d = new Date(g + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/* ============================================================== GOOGLE */
function traduciGoogle(e) {
  const via = e.status === 'cancelled' || e.eventType === 'workingLocation' ||
    (e.attendees || []).some(function (a) { return !!a.self && a.responseStatus === 'declined'; });
  const s = e.start || {}, f = e.end || {};
  const n = { id: e.id, t: (e.summary || '').trim(), v: e.etag || e.updated || '', via: !!via,
    org: !e.organizer || !!e.organizer.self,
    altri: (e.attendees || []).some(function (a) { return !a.self && !a.resource; }) };
  if (s.date) {
    n.tg = true; n.di = s.date; n.df = f.date || giornoPiu(s.date, 1);
    n.i = Date.parse(n.di + 'T00:00:00Z'); n.f = Date.parse(n.df + 'T00:00:00Z');
  } else {
    n.tg = false; n.i = Date.parse(s.dateTime || '') || 0; n.f = Date.parse(f.dateTime || '') || n.i;
  }
  /* un evento cancellato dentro una sincronizzazione incrementale arriva
     senza orari: non serve niente altro che il suo id */
  return n;
}
function corpoGoogle(w) {
  const c = {};
  if (w.testo !== undefined) c.summary = w.testo;
  if (w.tempo) {
    if (w.tempo.tuttoIlGiorno) {
      c.start = { date: w.tempo.dataInizio, dateTime: null };
      c.end = { date: w.tempo.dataFine, dateTime: null };
    } else {
      c.start = { dateTime: new Date(w.tempo.inizio).toISOString(), date: null };
      c.end = { dateTime: new Date(w.tempo.fine).toISOString(), date: null };
    }
  }
  return c;
}
const gCal = function (id) { return '/calendars/' + encodeURIComponent(id); };

export const google = {
  nome: 'Google',
  autorizza: function (cfg, stato, sfida, redirect) {
    const q = new URLSearchParams({
      client_id: cfg.id, redirect_uri: redirect, response_type: 'code',
      scope: G_S_ELENCO + ' ' + G_S_EVENTI, access_type: 'offline',
      /* `consent` ogni volta che si collega: è l'unico modo in cui Google
         ridà il refresh token anche a chi aveva già detto sì una volta */
      prompt: 'consent', include_granted_scopes: 'true',
      state: stato, code_challenge: sfida, code_challenge_method: 'S256'
    });
    return G_AUTH + '?' + q.toString();
  },
  scambia: async function (cfg, codice, verificatore, redirect) {
    const x = await modulo(G_TOKEN, { code: codice, client_id: cfg.id, client_secret: cfg.segreto,
      redirect_uri: redirect, grant_type: 'authorization_code', code_verifier: verificatore });
    if (!x.r.ok || !x.j.access_token) throw new Errore('token', 'Google non ha dato il permesso (' + (x.j.error || x.r.status) + ')');
    const sc = String(x.j.scope || '');
    /* le due caselle della finestra di Google si possono togliere una per una */
    if (sc && (sc.indexOf(G_S_EVENTI) < 0 || sc.indexOf(G_S_ELENCO) < 0)) throw new Errore('permesso', 'servono tutte e due le caselle');
    if (!x.j.refresh_token) throw new Errore('token', 'Google non ha dato il permesso di rinnovo');
    return { at: x.j.access_token, scade: Date.now() + (Number(x.j.expires_in) || 3600) * 1000, rt: x.j.refresh_token };
  },
  rinnova: async function (cfg, rt) {
    const x = await modulo(G_TOKEN, { client_id: cfg.id, client_secret: cfg.segreto, grant_type: 'refresh_token', refresh_token: rt });
    if (x.r.ok && x.j.access_token) return { at: x.j.access_token, scade: Date.now() + (Number(x.j.expires_in) || 3600) * 1000, rt: x.j.refresh_token || '' };
    if (x.j.error === 'invalid_grant' || x.j.error === 'unauthorized_client') throw new Errore('revocato', 'permesso ritirato');
    throw new Errore('rete', 'Google non rinnova adesso');
  },
  revoca: async function (_cfg, rt) {
    try { await modulo(G_REVOCA, { token: rt }); } catch { /* lo si è provato: il resto si cancella comunque */ }
  },
  email: async function (_at, elenco) {
    const pr = elenco.find(function (c) { return c.principale; });
    return pr ? pr.id : '';
  },
  calendari: async function (at) {
    const r = await chiama('Google', G_API, at, 'GET', '/users/me/calendarList?minAccessRole=reader&maxResults=250');
    return ((r && r.items) || []).map(function (c) {
      return { id: c.id, nome: c.summaryOverride || c.summary || c.id, lettura: !(c.accessRole === 'owner' || c.accessRole === 'writer'), principale: !!c.primary };
    });
  },
  /* UNA PAGINA DI EVENTI. Con `gettone` (il syncToken dell'ultima volta)
     arrivano solo quelli cambiati, cancellati compresi; senza, tutti quelli
     della finestra. Google non permette di mescolare le due cose: con il
     syncToken niente timeMin/timeMax, e la finestra la guarda chi riceve. */
  pagina: async function (at, cal, o) {
    const q = new URLSearchParams({ singleEvents: 'true', maxResults: '250', fields: G_CAMPI });
    if (o.gettone) q.set('syncToken', o.gettone);
    else { q.set('timeMin', new Date(o.da).toISOString()); q.set('timeMax', new Date(o.a).toISOString()); }
    if (o.pagina) q.set('pageToken', o.pagina);
    const r = await chiama('Google', G_API, at, 'GET', gCal(cal) + '/events?' + q.toString());
    return { eventi: ((r && r.items) || []).map(traduciGoogle), pagina: (r && r.nextPageToken) || '', gettone: (r && r.nextSyncToken) || '' };
  },
  evento: async function (at, cal, id) {
    try { const r = await chiama('Google', G_API, at, 'GET', gCal(cal) + '/events/' + encodeURIComponent(id)); return r ? traduciGoogle(r) : null; }
    catch (e) { if (e instanceof Errore && e.tipo === 'sparito') return null; throw e; }
  },
  aggiorna: async function (at, cal, id, w) {
    const r = await chiama('Google', G_API, at, 'PATCH', gCal(cal) + '/events/' + encodeURIComponent(id), corpoGoogle(w));
    if (!r) throw new Errore('altro', 'Google non ha restituito l’evento');
    return traduciGoogle(r);
  },
  togli: async function (at, cal, id) {
    try { await chiama('Google', G_API, at, 'DELETE', gCal(cal) + '/events/' + encodeURIComponent(id)); }
    catch (e) { if (!(e instanceof Errore && e.tipo === 'sparito')) throw e; }
  },
  /* l'id lo sceglie LifeMax: se la stessa creazione arriva due volte,
     Google risponde 409 e si prende quello che c'è già */
  crea: async function (at, cal, testo, tempo, chiave) {
    try {
      const r = await chiama('Google', G_API, at, 'POST', gCal(cal) + '/events', Object.assign({ id: chiave }, corpoGoogle({ testo: testo, tempo: tempo })));
      return traduciGoogle(r);
    } catch (e) {
      if (e instanceof Errore && e.tipo === 'esiste') { const gia = await google.evento(at, cal, chiave); if (gia) return gia; }
      throw e;
    }
  }
};

/* =========================================================== MICROSOFT */
function traduciMicrosoft(e) {
  const via = !!e.isCancelled || !!(e.responseStatus && e.responseStatus.response === 'declined') || !!e['@removed'];
  const n = { id: e.id, t: (e.subject || '').trim(), v: e.changeKey || e.lastModifiedDateTime || '', via: via,
    org: e.isOrganizer !== false,
    altri: (e.attendees || []).some(function (a) { return a && a.type !== 'resource'; }) };
  if (e.isAllDay) {
    n.tg = true;
    n.di = ((e.start && e.start.dateTime) || '').slice(0, 10);
    n.df = ((e.end && e.end.dateTime) || '').slice(0, 10) || giornoPiu(n.di, 1);
    n.i = Date.parse(n.di + 'T00:00:00Z') || 0; n.f = Date.parse(n.df + 'T00:00:00Z') || n.i;
  } else {
    n.tg = false; n.i = utc(e.start); n.f = utc(e.end) || n.i;
  }
  return n;
}
function corpoMicrosoft(w) {
  const c = {};
  if (w.testo !== undefined) c.subject = w.testo;
  if (w.tempo) {
    const t = w.tempo;
    c.isAllDay = t.tuttoIlGiorno;
    c.start = t.tuttoIlGiorno ? { dateTime: t.dataInizio + 'T00:00:00', timeZone: 'UTC' } : { dateTime: new Date(t.inizio).toISOString().slice(0, 19), timeZone: 'UTC' };
    c.end = t.tuttoIlGiorno ? { dateTime: t.dataFine + 'T00:00:00', timeZone: 'UTC' } : { dateTime: new Date(t.fine).toISOString().slice(0, 19), timeZone: 'UTC' };
  }
  return c;
}
const FUSO = { Prefer: 'outlook.timezone="UTC"' };

export const microsoft = {
  nome: 'Outlook',
  autorizza: function (cfg, stato, sfida, redirect) {
    const q = new URLSearchParams({
      client_id: cfg.id, response_type: 'code', redirect_uri: redirect, response_mode: 'query',
      scope: M_SCOPE, state: stato, code_challenge: sfida, code_challenge_method: 'S256', prompt: 'select_account'
    });
    return M_LOGIN + 'authorize?' + q.toString();
  },
  scambia: async function (cfg, codice, verificatore, redirect) {
    const x = await modulo(M_LOGIN + 'token', { client_id: cfg.id, client_secret: cfg.segreto, scope: M_SCOPE,
      code: codice, redirect_uri: redirect, grant_type: 'authorization_code', code_verifier: verificatore });
    if (!x.r.ok || !x.j.access_token) throw new Errore('token', 'Microsoft non ha dato il permesso (' + (x.j.error || x.r.status) + ')');
    if (!x.j.refresh_token) throw new Errore('token', 'Microsoft non ha dato il permesso di rinnovo');
    return { at: x.j.access_token, scade: Date.now() + (Number(x.j.expires_in) || 3600) * 1000, rt: x.j.refresh_token };
  },
  /* Microsoft cambia il refresh token a ogni rinnovo: quello nuovo
     sostituisce il vecchio, e il conto dei 90 giorni riparte */
  rinnova: async function (cfg, rt) {
    const x = await modulo(M_LOGIN + 'token', { client_id: cfg.id, client_secret: cfg.segreto, scope: M_SCOPE, grant_type: 'refresh_token', refresh_token: rt });
    if (x.r.ok && x.j.access_token) return { at: x.j.access_token, scade: Date.now() + (Number(x.j.expires_in) || 3600) * 1000, rt: x.j.refresh_token || '' };
    if (x.j.error === 'invalid_grant' || x.j.error === 'interaction_required' || x.j.error === 'unauthorized_client') throw new Errore('revocato', 'permesso ritirato');
    throw new Errore('rete', 'Microsoft non rinnova adesso');
  },
  /* Microsoft non ha un indirizzo per ritirare un solo refresh token (c'è
     solo «esci da tutto», troppo per uno scollegamento): lo si dimentica,
     e la pagina dell'account Microsoft permette di togliere l'app */
  revoca: async function () { /* niente da chiamare */ },
  email: async function (at) {
    try { const me = await chiama('Microsoft', M_API, at, 'GET', '/me?$select=mail,userPrincipalName'); return (me && (me.mail || me.userPrincipalName)) || ''; }
    catch { return ''; }
  },
  calendari: async function (at) {
    const r = await chiama('Microsoft', M_API, at, 'GET', '/me/calendars?$select=id,name,canEdit,isDefaultCalendar&$top=100');
    return ((r && r.value) || []).map(function (c) { return { id: c.id, nome: c.name || 'Calendario', lettura: !c.canEdit, principale: !!c.isDefaultCalendar }; });
  },
  /* Microsoft: sempre la finestra intera (calendarView), una pagina alla
     volta. Il confronto con lo specchio dice cosa è cambiato. */
  pagina: async function (at, cal, o) {
    const via = o.pagina || ('/me/calendars/' + encodeURIComponent(cal) + '/calendarView?startDateTime=' + encodeURIComponent(new Date(o.da).toISOString()) +
      '&endDateTime=' + encodeURIComponent(new Date(o.a).toISOString()) + '&' + M_CAMPI + '&$top=200');
    const r = await chiama('Microsoft', M_API, at, 'GET', via, undefined, FUSO);
    return { eventi: ((r && r.value) || []).map(traduciMicrosoft), pagina: (r && r['@odata.nextLink']) || '', gettone: '' };
  },
  evento: async function (at, _cal, id) {
    try { const r = await chiama('Microsoft', M_API, at, 'GET', '/me/events/' + encodeURIComponent(id) + '?' + M_CAMPI, undefined, FUSO); return r ? traduciMicrosoft(r) : null; }
    catch (e) { if (e instanceof Errore && e.tipo === 'sparito') return null; throw e; }
  },
  aggiorna: async function (at, _cal, id, w) {
    const r = await chiama('Microsoft', M_API, at, 'PATCH', '/me/events/' + encodeURIComponent(id), corpoMicrosoft(w), FUSO);
    if (!r) throw new Errore('altro', 'Microsoft non ha restituito l’evento');
    return traduciMicrosoft(r);
  },
  togli: async function (at, _cal, id) {
    try { await chiama('Microsoft', M_API, at, 'DELETE', '/me/events/' + encodeURIComponent(id)); }
    catch (e) { if (!(e instanceof Errore && e.tipo === 'sparito')) throw e; }
  },
  /* `transactionId`: la stessa creazione due volte fa un evento solo */
  crea: async function (at, cal, testo, tempo, chiave) {
    const r = await chiama('Microsoft', M_API, at, 'POST', '/me/calendars/' + encodeURIComponent(cal) + '/events',
      Object.assign({ transactionId: chiave }, corpoMicrosoft({ testo: testo, tempo: tempo })), FUSO);
    return traduciMicrosoft(r);
  }
};

export const FORNITORI = { google: google, microsoft: microsoft };

/* LA SCRITTURA È GIÀ LÌ? Serve a non scrivere due volte la stessa cosa:
   se l'evento ha già il titolo e gli orari che si volevano mettere, non
   c'è niente da fare (ed è la risposta giusta anche se nel frattempo la
   sua versione è cambiata: è cambiata per colpa nostra). */
export function giaScritta(n, w) {
  if (!n) return false;
  if (w.testo !== undefined && (n.t || '') !== w.testo) return false;
  if (w.tempo) {
    if (w.tempo.tuttoIlGiorno) { if (!n.tg || n.di !== w.tempo.dataInizio || n.df !== w.tempo.dataFine) return false; }
    else if (n.tg || n.i !== w.tempo.inizio || n.f !== w.tempo.fine) return false;
  }
  return true;
}
