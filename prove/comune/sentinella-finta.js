/* LA SENTINELLA DEI CALENDARI, FATTA GIRARE QUI — con tutto il mondo finto.

   Il Worker (sentinella/worker.mjs) si importa così com'è e gli si dà un
   `env` finto:
     · SENTINELLA, i Durable Object: ognuno con un SQLite vero (node:sqlite)
       e una sveglia che la prova fa suonare a mano;
     · ASSETS, i file del sito, letti dalla cartella;
     · i segreti, finti.
   E si sostituisce `fetch` di Node, così tutte le chiamate del Worker verso
   fuori arrivano a un Google, un Microsoft e un Firebase finti:
     · oauth2.googleapis.com (scambio del codice, rinnovo, revoca)
     · www.googleapis.com/calendar/v3 (con syncToken vero e proprio)
     · login.microsoftonline.com e graph.microsoft.com
     · le chiavi pubbliche di Firebase, con cui la prova firma i gettoni
   Nessuna richiesta esce davvero: un indirizzo che il finto non conosce fa
   fallire la prova. */
'use strict';
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

const PROGETTO = 'lifemax-9dc63';
const CHIAVI = 'https://chiavi.finte/securetoken';

/* ------------------------------------------------------------ Firebase */
const coppia = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const estranea = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const KID = 'kid-finto';
const jwk = Object.assign(coppia.publicKey.export({ format: 'jwk' }), { kid: KID, alg: 'RS256', use: 'sig' });
const b64u = (b) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
function gettone(uid, o) {
  o = o || {};
  const ora = Math.floor(Date.now() / 1000);
  const testa = { alg: o.alg || 'RS256', kid: o.kid || KID, typ: 'JWT' };
  const corpo = Object.assign({ iss: 'https://securetoken.google.com/' + PROGETTO, aud: PROGETTO, sub: uid, iat: ora - 10, auth_time: ora - 10, exp: ora + 3600 }, o.corpo || {});
  const dati = b64u(JSON.stringify(testa)) + '.' + b64u(JSON.stringify(corpo));
  const firma = crypto.sign('sha256', Buffer.from(dati), (o.chiave || coppia.privateKey));
  return dati + '.' + b64u(firma);
}

/* -------------------------------------------------------- i Durable Object */
class Id { constructor(h) { this.h = h; } toString() { return this.h; } }
function namespace(caricaClasse, envRef) {
  const istanze = new Map();
  const ns = {
    istanze: istanze,
    idFromName(n) { return new Id(crypto.createHash('sha256').update('do:' + n).digest('hex')); },
    idFromString(h) { if (!/^[0-9a-f]{64}$/.test(String(h))) throw new Error('id non valido'); return new Id(h); },
    get(id) {
      const h = id.toString();
      return {
        fetch: async (req) => {
          let s = istanze.get(h);
          if (!s) {
            const db = new DatabaseSync(':memory:');
            s = { db: db, sveglia: null, obj: null };
            const stato = {
              id: new Id(h),
              storage: {
                sql: { exec(q, ...a) {
                  const st = db.prepare(q);
                  const righe = /^\s*(SELECT|PRAGMA|WITH)/i.test(q) ? st.all(...a) : (st.run(...a), []);
                  return { toArray: () => righe.map((r) => Object.assign({}, r)) };
                } },
                async setAlarm(t) { s.sveglia = t; },
                async getAlarm() { return s.sveglia; },
                async deleteAlarm() { s.sveglia = null; }
              }
            };
            s.stato = stato;
            istanze.set(h, s);
          }
          /* l'oggetto in memoria si può buttare (come fa Cloudflare quando
             il Durable Object resta fermo): il database resta */
          if (!s.obj) s.obj = new (caricaClasse())(s.stato, envRef.env);
          return s.obj.fetch(req);
        }
      };
    },
    /* fa suonare le sveglie scadute (o tutte, con `tutte`) */
    async suona(tutte) {
      for (const [, s] of istanze) {
        if (s.sveglia !== null && (tutte || s.sveglia <= Date.now())) {
          s.sveglia = null;
          if (!s.obj) s.obj = new (caricaClasse())(s.stato, envRef.env);
          await s.obj.alarm();
        }
      }
    },
    dimentica() { for (const [, s] of istanze) s.obj = null; }
  };
  return ns;
}

/* ------------------------------------------------------------ Google finto */
function googleFinto() {
  const G = {
    codici: new Map(),   /* code → { verificatore sfida, scope } */
    rinnovi: new Map(),  /* refresh token → vivo */
    accessi: new Map(),  /* access token → scade */
    revocati: [], richieste: [], scambi: [], n: 0, versione: 0, giroSync: 0,
    calendari: [
      { id: 'io@esempio.it', summary: 'io@esempio.it', primary: true, accessRole: 'owner' },
      { id: 'lavoro@gruppo', summary: 'Lavoro', accessRole: 'writer' }
    ],
    eventi: { 'io@esempio.it': {}, 'lavoro@gruppo': {} },
    lento: false, giu: 0, negaScope: false
  };
  G.metti = function (cal, e) {
    G.versione++;
    const x = Object.assign({ status: 'confirmed' }, e, { etag: '"g' + G.versione + '"', _v: G.versione });
    G.eventi[cal][e.id] = x;
    return x;
  };
  G.togli = function (cal, id) {
    G.versione++;
    const e = G.eventi[cal][id];
    if (e) G.eventi[cal][id] = { id: id, status: 'cancelled', _v: G.versione, etag: '"g' + G.versione + '"' };
  };
  G.scadiAccessi = function () { G.accessi.clear(); };
  return G;
}

function microsoftFinto() {
  const M = { codici: new Map(), rinnovi: new Map(), accessi: new Set(), richieste: [], scambi: [], n: 0, ck: 0,
    calendari: [{ id: 'AAMkCal1', name: 'Calendario', canEdit: true, isDefaultCalendar: true }],
    eventi: {} };
  M.metti = function (e) { M.ck++; M.eventi[e.id] = Object.assign({}, e, { changeKey: 'k' + M.ck }); return M.eventi[e.id]; };
  return M;
}

function risposta(stato, corpo, testa) {
  return new Response(corpo === undefined ? null : JSON.stringify(corpo), { status: stato, headers: Object.assign({ 'Content-Type': 'application/json' }, testa || {}) });
}

/* l'evento Google come lo restituisce con `fields`: niente email degli invitati */
function comeGoogle(e) {
  const x = Object.assign({}, e);
  delete x._v;
  if (x.attendees) x.attendees = x.attendees.map((a) => { const y = {}; ['self', 'resource', 'responseStatus'].forEach((k) => { if (a[k] !== undefined) y[k] = a[k]; }); return y; });
  return x;
}

function installaFetch(G, M) {
  const vero = globalThis.fetch;
  globalThis.fetch = async function (url, opz) {
    const u = new URL(typeof url === 'string' ? url : url.url);
    opz = opz || {};
    const metodo = (opz.method || 'GET').toUpperCase();
    const corpoTesto = opz.body ? String(opz.body) : '';
    const auth = ((opz.headers || {}).Authorization || '').replace('Bearer ', '');
    if (u.href === CHIAVI) return risposta(200, { keys: [jwk] }, { 'Cache-Control': 'public, max-age=3600' });

    /* ---------------- Google: il permesso */
    if (u.host === 'oauth2.googleapis.com') {
      const f = Object.fromEntries(new URLSearchParams(corpoTesto));
      G.scambi.push(Object.assign({ via: u.pathname }, f));
      if (u.pathname === '/revoke') { G.revocati.push(f.token); G.rinnovi.delete(f.token); return risposta(200, {}); }
      if (f.client_secret !== 'segreto-google-finto') return risposta(401, { error: 'invalid_client' });
      if (f.grant_type === 'authorization_code') {
        const c = G.codici.get(f.code);
        G.codici.delete(f.code);
        if (!c) return risposta(400, { error: 'invalid_grant' });
        const sfida = crypto.createHash('sha256').update(f.code_verifier || '').digest('base64url');
        if (sfida !== c.sfida) return risposta(400, { error: 'invalid_grant', error_description: 'pkce' });
        const rt = 'grt-' + (++G.n), at = 'gat-' + G.n;
        G.rinnovi.set(rt, true); G.accessi.set(at, Date.now() + 3600e3);
        return risposta(200, { access_token: at, expires_in: 3599, refresh_token: rt, scope: c.scope, token_type: 'Bearer' });
      }
      if (f.grant_type === 'refresh_token') {
        if (!G.rinnovi.has(f.refresh_token)) return risposta(400, { error: 'invalid_grant' });
        const at = 'gat-' + (++G.n);
        G.accessi.set(at, Date.now() + 3600e3);
        return risposta(200, { access_token: at, expires_in: 3599, scope: '', token_type: 'Bearer' });
      }
      return risposta(400, { error: 'unsupported_grant_type' });
    }
    /* ---------------- Google: il calendario */
    if (u.host === 'www.googleapis.com') {
      const via = decodeURIComponent(u.pathname.replace('/calendar/v3', ''));
      const corpo = corpoTesto ? JSON.parse(corpoTesto) : null;
      G.richieste.push({ metodo, via, corpo, q: Object.fromEntries(u.searchParams) });
      if (G.giu > 0) { G.giu--; return risposta(503, { error: { message: 'backendError' } }); }
      if (!G.accessi.has(auth) || G.accessi.get(auth) < Date.now()) return risposta(401, { error: { message: 'Invalid Credentials' } });
      if (via === '/users/me/calendarList') return risposta(200, { items: G.calendari });
      const m = /^\/calendars\/([^/]+)\/events(?:\/(.+))?$/.exec(via);
      if (!m) return risposta(404, { error: { message: 'no' } });
      const cal = G.eventi[m[1]] || (G.eventi[m[1]] = {});
      const id = m[2];
      if (!id && metodo === 'GET') {
        const sync = u.searchParams.get('syncToken');
        let items;
        if (sync) {
          if (sync === 'scaduto') return risposta(410, { error: { errors: [{ reason: 'fullSyncRequired' }] } });
          const da = +sync.replace('st-', '');
          items = Object.values(cal).filter((e) => e._v > da);
        } else {
          const tMin = Date.parse(u.searchParams.get('timeMin')), tMax = Date.parse(u.searchParams.get('timeMax'));
          items = Object.values(cal).filter((e) => e.status !== 'cancelled' && e.start && Date.parse(e.start.dateTime || (e.start.date + 'T00:00:00Z')) < tMax &&
            Date.parse(e.end.dateTime || (e.end.date + 'T00:00:00Z')) > tMin);
        }
        return risposta(200, { items: items.map(comeGoogle), nextSyncToken: 'st-' + G.versione });
      }
      if (!id && metodo === 'POST') {
        if (cal[corpo.id] && cal[corpo.id].status !== 'cancelled') return risposta(409, { error: { message: 'duplicate' } });
        const st = {}; ['start', 'end'].forEach((k) => { st[k] = {}; Object.keys(corpo[k]).forEach((x) => { if (corpo[k][x] !== null) st[k][x] = corpo[k][x]; }); });
        return risposta(200, comeGoogle(G.metti(m[1], Object.assign({}, corpo, st, { organizer: { self: true } }))));
      }
      const e = cal[id];
      if (!e || e.status === 'cancelled') return risposta(404, { error: { message: 'Not Found' } });
      if (metodo === 'GET') return risposta(200, comeGoogle(e));
      if (metodo === 'DELETE') { G.togli(m[1], id); return new Response(null, { status: 204 }); }
      if (metodo === 'PATCH') {
        if (e._solaLettura) return risposta(403, { error: { errors: [{ reason: 'forbiddenForNonOrganizer' }] } });
        const n = Object.assign({}, e);
        Object.keys(corpo).forEach((k) => {
          if (k === 'start' || k === 'end') { const v = {}; Object.keys(corpo[k]).forEach((x) => { if (corpo[k][x] !== null) v[x] = corpo[k][x]; }); n[k] = v; }
          else n[k] = corpo[k];
        });
        return risposta(200, comeGoogle(G.metti(m[1], n)));
      }
      return risposta(405, {});
    }
    /* ---------------- Microsoft */
    if (u.host === 'login.microsoftonline.com') {
      const f = Object.fromEntries(new URLSearchParams(corpoTesto));
      M.scambi.push(f);
      if (f.client_secret !== 'segreto-microsoft-finto') return risposta(401, { error: 'invalid_client' });
      if (f.grant_type === 'authorization_code') {
        const c = M.codici.get(f.code); M.codici.delete(f.code);
        if (!c) return risposta(400, { error: 'invalid_grant' });
        if (crypto.createHash('sha256').update(f.code_verifier || '').digest('base64url') !== c.sfida) return risposta(400, { error: 'invalid_grant' });
      } else if (f.grant_type === 'refresh_token') {
        if (!M.rinnovi.has(f.refresh_token)) return risposta(400, { error: 'invalid_grant' });
        M.rinnovi.delete(f.refresh_token); /* Microsoft lo cambia a ogni giro */
      } else return risposta(400, { error: 'unsupported_grant_type' });
      const n = ++M.n, at = 'mat-' + n, rt = 'mrt-' + n;
      M.accessi.add(at); M.rinnovi.set(rt, true);
      return risposta(200, { access_token: at, refresh_token: rt, expires_in: 3600, token_type: 'Bearer' });
    }
    if (u.host === 'graph.microsoft.com') {
      const via = decodeURIComponent(u.pathname.replace('/v1.0', ''));
      const corpo = corpoTesto ? JSON.parse(corpoTesto) : null;
      M.richieste.push({ metodo, via, corpo, prefer: (opz.headers || {}).Prefer || '' });
      if (!M.accessi.has(auth)) return risposta(401, { error: { code: 'InvalidAuthenticationToken' } });
      if (via === '/me') return risposta(200, { mail: 'io@contoso.com' });
      if (via === '/me/calendars') return risposta(200, { value: M.calendari });
      if (/^\/me\/calendars\/[^/]+\/calendarView$/.test(via)) return risposta(200, { value: Object.values(M.eventi) });
      if (/^\/me\/calendars\/[^/]+\/events$/.test(via) && metodo === 'POST') {
        const gia = Object.values(M.eventi).find((e) => e.transactionId && e.transactionId === corpo.transactionId);
        if (gia) return risposta(201, gia);
        return risposta(201, M.metti(Object.assign({}, corpo, { id: 'mx' + (M.ck + 1), isOrganizer: true })));
      }
      const m = /^\/me\/events\/(.+)$/.exec(via);
      const e = m && M.eventi[m[1]];
      if (!e) return risposta(404, { error: { code: 'ErrorItemNotFound' } });
      if (metodo === 'GET') return risposta(200, e);
      if (metodo === 'DELETE') { delete M.eventi[m[1]]; return new Response(null, { status: 204 }); }
      if (metodo === 'PATCH') return risposta(200, M.metti(Object.assign({}, e, corpo)));
      return risposta(405, {});
    }
    if (process.env.SENTINELLA_RETE_VERA && vero) return vero(url, opz);
    throw new Error('la sentinella ha provato a uscire verso ' + u.host);
  };
}

/* la pagina di Google o di Microsoft, in un colpo: «sì», e il codice torna
   al Worker. Restituisce l'indirizzo del ritorno, come farebbe il 302. */
function consenso(G, M, url, opz) {
  opz = opz || {};
  const u = new URL(url);
  const q = Object.fromEntries(u.searchParams);
  const codice = 'codice-' + crypto.randomBytes(6).toString('hex');
  const scope = opz.scope || q.scope;
  if (u.host === 'accounts.google.com') G.codici.set(codice, { sfida: q.code_challenge, scope: scope });
  else M.codici.set(codice, { sfida: q.code_challenge });
  const r = new URL(q.redirect_uri);
  if (opz.nega) r.searchParams.set('error', 'access_denied');
  else r.searchParams.set('code', codice);
  r.searchParams.set('state', opz.stato || q.state);
  return { url: r.toString(), q: q };
}

/* IL MONDO INTERO: il Worker caricato, l'env, i finti */
async function mondo(opz) {
  opz = opz || {};
  const G = googleFinto(), M = microsoftFinto();
  installaFetch(G, M);
  const radice = path.join(__dirname, '..', '..');
  const mod = await import(path.join(radice, 'sentinella', 'worker.mjs'));
  const envRef = { env: null };
  const ns = namespace(() => mod.Sentinella, envRef);
  const env = Object.assign({
    SENTINELLA: ns,
    ASSETS: { fetch: async (req) => {
      let p = new URL(req.url).pathname; if (p === '/') p = '/index.html';
      const f = path.join(opz.cartella || radice, p);
      try { return new Response(fs.readFileSync(f), { status: 200 }); } catch { return new Response(fs.readFileSync(path.join(opz.cartella || radice, 'index.html')), { status: 200 }); }
    } },
    GOOGLE_CLIENT_SECRET: 'segreto-google-finto',
    MICROSOFT_CLIENT_SECRET: 'segreto-microsoft-finto',
    CHIAVE_CALENDARI: crypto.randomBytes(32).toString('base64'),
    CHIAVI_FIREBASE: CHIAVI,
    INDIRIZZO: opz.indirizzo || 'https://lifemax.theproject.world',
    RITORNI: opz.ritorni || undefined,
    ORIGINI: opz.origini || undefined
  }, opz.env || {});
  Object.keys(env).forEach((k) => { if (env[k] === undefined) delete env[k]; });
  envRef.env = env;
  return { G, M, env, ns, worker: mod.default, mod, gettone, estranea, consenso: (url, o) => consenso(G, M, url, o) };
}

module.exports = { mondo, gettone, PROGETTO };
