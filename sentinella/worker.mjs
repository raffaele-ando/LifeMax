/* ============================================================
   IL WORKER «lifemax»: il sito come prima, più /api/calendari/ e le
   pagine dell'accesso con Google (/__/auth/*, vedi `accessoFirebase`).

   Il sito resta quello che era: i file statici della radice, serviti da
   Cloudflare con le regole di `_headers` e il ritorno a index.html per gli
   indirizzi che non esistono. Questo codice NON li tocca: in wrangler.jsonc
   `run_worker_first` gli passa SOLO gli indirizzi che cominciano con
   /api/, e tutto il resto va dritto ai file come prima.

   Le strade (tutte rispondono JSON, mai con un permesso dentro):
     GET  /api/calendari/stato                quali calendari il server sa
                                              gestire (senza segreti: nessuno)
     POST /api/calendari/<p>/inizia           comincia il collegamento: torna
                                              l'indirizzo di /vai
     GET  /api/calendari/<p>/vai              lascia il biscotto del «legame» col
                                              browser e manda da Google o Microsoft
     GET  /api/calendari/<p>/ritorno          dove Google e Microsoft rimandano
                                              dopo il «sì»; si torna all'app
     POST /api/calendari/cambi                lo specchio: cosa è cambiato
     POST /api/calendari/scrivi               le modifiche da riportare là
     POST /api/calendari/<p>/calendari        l'elenco dei calendari
     POST /api/calendari/<p>/evento           un evento solo, letto adesso
     POST /api/calendari/<p>/scollega         ritira il permesso e cancella tutto
   <p> è `google` o `microsoft`.

   CHI CHIEDE. Ogni POST porta nel corpo il «gettone» di Firebase dell'utente
   (`gettone`), controllato da identita.mjs. Nel corpo e non in
   un'intestazione per una ragione pratica: così la richiesta è «semplice»
   (text/plain) e il browser non deve fare la domanda preliminare (CORS
   preflight) — che una richiesta `keepalive`, quella che parte mentre
   chiudi l'app, non sempre può fare.

   DA DOVE. Il CORS dice sì solo a https://lifemax.theproject.world e a
   https://raffaele-ando.github.io. Il gettone resta comunque la vera porta.
   ============================================================ */
import { Sentinella } from './sentinella.mjs';
import { verificaGettone } from './identita.mjs';
import { config, attivo, PROVENIENZE } from './config.mjs';

export { Sentinella };

function cors(cfg, req) {
  const o = req.headers.get('Origin') || '';
  const h = { 'Cache-Control': 'no-store', Vary: 'Origin' };
  if (o && cfg.origini.indexOf(o) >= 0) {
    h['Access-Control-Allow-Origin'] = o;
    h['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    h['Access-Control-Allow-Headers'] = 'Content-Type';
    h['Access-Control-Max-Age'] = '600';
  }
  return h;
}
function json(cfg, req, o, stato) {
  return new Response(JSON.stringify(o), { status: stato || 200, headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, cors(cfg, req)) });
}

function aggiungi(url, campi) {
  const u = new URL(url);
  Object.keys(campi).forEach(function (k) { u.searchParams.set(k, campi[k]); });
  if (!u.hash) u.hash = '#/profilo';
  return u.toString();
}

/* una pagina di due righe per quando il ritorno non porta da nessuna parte */
function pagina(cfg, testo) {
  return new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>LifeMax</title>' +
    '<p style="font:16px system-ui;margin:2em">' + testo + ' <a href="' + cfg.ritorni[0] + '#/profilo">Torna a LifeMax</a></p>',
  { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

function biscotto(req, p) {
  const m = new RegExp('(?:^|;\\s*)lmcal_' + p + '=([^;]*)').exec(req.headers.get('Cookie') || '');
  return m ? m[1] : '';
}

async function alDO(env, id, az, uid, corpo) {
  const stub = env.SENTINELLA.get(id);
  const h = {};
  if (uid) h['x-lm-uid'] = uid;
  const r = await stub.fetch(new Request('https://sentinella.interno/' + az, { method: 'POST', headers: h, body: JSON.stringify(corpo || {}) }));
  let j = {};
  try { j = await r.json(); } catch { j = { errore: 'altro' }; }
  return { stato: r.status, j: j };
}

async function api(req, env) {
  const cfg = config(env);
  const u = new URL(req.url);
  const via = u.pathname.replace(/^\/api\/calendari\/?/, '').split('/').filter(Boolean);
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(cfg, req) });
  if (!/^\/api\/calendari(\/|$)/.test(u.pathname)) return json(cfg, req, { errore: 'non c’è' }, 404);

  const servizio = {};
  PROVENIENZE.forEach(function (p) { servizio[p] = attivo(cfg, env, p); });

  if (via[0] === 'stato' && req.method === 'GET') return json(cfg, req, { servizio: servizio });

  /* il ritorno da Google o Microsoft: chi arriva qui non ha il gettone,
     ha lo `state`. Lo `state` dice a quale sentinella chiedere, e quella
     sentinella lo riconosce solo se l'ha emesso lei, da meno di dieci
     minuti, e non l'ha già usato. */
  if (via.length === 2 && via[1] === 'ritorno' && req.method === 'GET') {
    const p = via[0];
    if (PROVENIENZE.indexOf(p) < 0 || !env.SENTINELLA) return pagina(cfg, 'Questo collegamento non è valido.');
    const stato = u.searchParams.get('state') || '';
    const h = stato.split('.')[0] || '';
    let id;
    try { id = env.SENTINELLA.idFromString(h); } catch { return pagina(cfg, 'Questo collegamento non è valido o è scaduto.'); }
    const r = await alDO(env, id, 'ritorno', '', { p: p, stato: stato, codice: u.searchParams.get('code') || '', errore: u.searchParams.get('error') || '', legame: biscotto(req, p) });
    const dove = (r.j && r.j.ritorno) || cfg.ritorni[0];
    const testa = new Headers({ Location: aggiungi(dove, { lmcal: p, esito: (r.j && r.j.esito) || 'errore' }), 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' });
    testa.append('Set-Cookie', 'lmcal_' + p + '=; Path=/api/calendari/; Max-Age=0; HttpOnly; Secure; SameSite=Lax');
    /* il segreto della conferma resta in QUESTO browser, e da qui non esce:
       l'app lo manda indietro (da sola, è un biscotto) insieme al suo
       gettone, e solo allora il permesso diventa suo (vedi `conferma` in
       sentinella.mjs) */
    if (r.j && r.j.conferma) testa.append('Set-Cookie', 'lmcal_ok_' + p + '=' + r.j.conferma + '; Path=/api/calendari/; Max-Age=600; HttpOnly; Secure; SameSite=Lax');
    return new Response(null, { status: 302, headers: testa });
  }

  /* il passaggio dal nostro indirizzo prima di Google o Microsoft: lascia il
     biscotto del legame e manda avanti (vedi `vai` in sentinella.mjs) */
  if (via.length === 2 && via[1] === 'vai' && req.method === 'GET') {
    const p = via[0];
    if (PROVENIENZE.indexOf(p) < 0 || !env.SENTINELLA) return pagina(cfg, 'Questo collegamento non è valido.');
    const stato = u.searchParams.get('s') || '';
    let id;
    try { id = env.SENTINELLA.idFromString(stato.split('.')[0] || ''); } catch { return pagina(cfg, 'Questo collegamento non è valido o è scaduto.'); }
    const r = await alDO(env, id, 'vai', '', { p: p, stato: stato });
    if (!r.j || !r.j.url) return pagina(cfg, 'Questo collegamento è scaduto o è già stato usato: ricomincia da LifeMax.');
    return new Response(null, { status: 302, headers: { Location: r.j.url, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer',
      'Set-Cookie': 'lmcal_' + p + '=' + r.j.legame + '; Path=/api/calendari/; Max-Age=600; HttpOnly; Secure; SameSite=Lax' } });
  }

  if (req.method !== 'POST') return json(cfg, req, { errore: 'metodo' }, 405);
  if (!env.SENTINELLA) return json(cfg, req, { errore: 'non-configurato', servizio: servizio }, 503);

  let corpo;
  try { corpo = JSON.parse(await req.text()); } catch { return json(cfg, req, { errore: 'corpo' }, 400); }
  if (!corpo || typeof corpo !== 'object') return json(cfg, req, { errore: 'corpo' }, 400);
  let uid;
  try { uid = await verificaGettone(corpo.gettone, cfg.progetto, cfg.chiaviFirebase); }
  catch { return json(cfg, req, { errore: 'rete' }, 503); }
  if (!uid) return json(cfg, req, { errore: 'gettone' }, 401);
  delete corpo.gettone;

  const id = env.SENTINELLA.idFromName(uid);
  let az = '';
  if (via.length === 1 && (via[0] === 'cambi' || via[0] === 'scrivi')) az = via[0];
  else if (via.length === 2 && PROVENIENZE.indexOf(via[0]) >= 0 && ['inizia', 'conferma', 'calendari', 'evento', 'scollega'].indexOf(via[1]) >= 0) {
    az = via[1]; corpo.p = via[0];
    /* il biscotto della conferma lo legge solo il Worker: chi chiama non
       può metterlo nel corpo al posto suo */
    if (az === 'conferma') corpo.biscotto = biscotto(req, 'ok_' + via[0]);
    if (az !== 'scollega' && !servizio[via[0]]) return json(cfg, req, { errore: 'non-configurato', servizio: servizio }, 409);
  }
  if (!az) return json(cfg, req, { errore: 'non c’è' }, 404);
  const r = await alDO(env, id, az, uid, corpo);
  if (r.j && typeof r.j === 'object') r.j.servizio = servizio;
  const risp = json(cfg, req, r.j, r.stato);
  if (az === 'conferma') risp.headers.append('Set-Cookie', 'lmcal_ok_' + corpo.p + '=; Path=/api/calendari/; Max-Age=0; HttpOnly; Secure; SameSite=Lax');
  return risp;
}

/* L'ACCESSO CON GOOGLE SERVITO DA QUI (/__/auth/* e /__/firebase/*).
   Su iPhone, quando il popup di Google è bloccato, l'accesso passa da un
   redirect: Google rimanda a una pagina di Firebase (`/__/auth/handler`) che
   deve stare sullo STESSO indirizzo del sito, se no Safari — che tiene
   separati i dati dei siti diversi — può perdere l'accesso per strada. Qui
   quelle pagine si prendono dal progetto Firebase e si servono da
   lifemax.theproject.world, così com'erano: il Worker NON guarda e NON
   tocca niente di quello che passa, e non scrive niente su Firestore.
   Basta a far funzionare la strada; a USARLA si passa cambiando una riga in
   src/nuvola/nuvola.ts (`ACCESSO_DAL_DOMINIO`), dopo i passi a mano su
   Google Cloud e Firebase scritti in revisione/cloud/RAPPORTO.md. */
const FIREBASE_AUTH = 'https://lifemax-9dc63.firebaseapp.com';
export async function accessoFirebase(req) {
  const u = new URL(req.url);
  const verso = FIREBASE_AUTH + u.pathname + u.search;
  const h = new Headers(req.headers);
  h.delete('host');
  const metodo = req.method || 'GET';
  const r = await fetch(verso, {
    method: metodo, headers: h, redirect: 'manual',
    body: (metodo === 'GET' || metodo === 'HEAD') ? undefined : await req.arrayBuffer()
  });
  /* la risposta torna com'è: intestazioni comprese (anche i biscotti) */
  return new Response(r.body, { status: r.status, statusText: r.statusText, headers: r.headers });
}

export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    if (u.pathname.indexOf('/__/auth/') === 0 || u.pathname.indexOf('/__/firebase/') === 0) {
      try { return await accessoFirebase(req); }
      catch { return new Response('Accesso momentaneamente non raggiungibile', { status: 502 }); }
    }
    if (u.pathname === '/api' || u.pathname.indexOf('/api/') === 0) {
      try { return await api(req, env); }
      catch { return json(config(env), req, { errore: 'altro' }, 500); }
    }
    /* tutto il resto è il sito: lo serve Cloudflare dai file, come sempre */
    if (env.ASSETS) return env.ASSETS.fetch(req);
    return new Response('Not found', { status: 404 });
  },

  /* LA RISERVA. Ogni sentinella si sveglia da sé ogni dieci minuti; questo
     controlla una volta all'ora che nessuna sveglia sia andata persa. */
  async scheduled(_ev, env, ctx) {
    if (!env.SENTINELLA) return;
    const lavoro = (async function () {
      const el = await alDO(env, env.SENTINELLA.idFromName('__elenco'), 'elenco/lista', '', {});
      const tutte = (el.j && el.j.h) || [];
      for (const h of tutte.slice(0, 40)) {
        try { await alDO(env, env.SENTINELLA.idFromString(h), 'sveglia', '', {}); } catch { /* la prossima volta */ }
      }
    })();
    if (ctx && ctx.waitUntil) ctx.waitUntil(lavoro); else await lavoro;
  }
};
