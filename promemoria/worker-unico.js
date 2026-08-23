/* ============================================================
   IL POSTINO DEI PROMEMORIA — un file solo, da incollare.

   QUESTO FILE È GENERATO. Non modificarlo: le modifiche vanno in
   promemoria/push.js, promemoria/piano.js e promemoria/worker.js, e poi
     node promemoria/impacchetta.mjs
   lo rifà. Quello che c'è scritto qui sotto è la somma di quei tre.

   Serve al pannello di Cloudflare, che vuole del codice da incollare in una
   finestra invece di tre moduli separati. Le istruzioni, passo per passo e
   senza terminale, sono in promemoria/LEGGIMI.md.
   ============================================================ */

/* ══════════ push.js ══════════ */
/* WEB PUSH, CIFRATURA E FIRMA — RFC 8291 (aes128gcm) e RFC 8292 (VAPID).
   Scritto con la sola WebCrypto, quindi gira dentro un Cloudflare Worker:
   il pacchetto `web-push` di npm dipende da Node e là non funziona.

   Perché aes128gcm e non `aesgcm`: `aesgcm` è lo schema vecchio (bozza 04) e
   il servizio push di Apple — quello che serve Safari e le app aggiunte alla
   schermata Home dell'iPhone — accetta SOLO aes128gcm. Con lo schema vecchio
   le notifiche arriverebbero su Android e non sull'iPhone.

   La cifratura è verificata byte per byte contro `http_ece`, la libreria che
   usa `web-push`: vedi promemoria/prova.mjs. */

const B = {
  /* base64url senza riempimento, nei due sensi */
  da(s) {
    const b = atob(String(s).replace(/-/g, '+').replace(/_/g, '/'));
    const u = new Uint8Array(b.length);
    for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
    return u;
  },
  a(u) {
    let s = '';
    const v = new Uint8Array(u);
    for (let i = 0; i < v.length; i++) s += String.fromCharCode(v[i]);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
};

function unisci(pezzi) {
  let n = 0;
  for (const p of pezzi) n += p.length;
  const out = new Uint8Array(n);
  let i = 0;
  for (const p of pezzi) { out.set(p, i); i += p.length; }
  return out;
}
const testo = (s) => new TextEncoder().encode(s);

/* HKDF di WebCrypto fa estrazione ed espansione in un colpo, che è
   esattamente quello che chiede la specifica */
async function hkdf(sale, ikm, info, byte) {
  const k = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: sale, info: info }, k, byte * 8));
}

/* la chiave pubblica di una coppia P-256, nei 65 byte non compressi */
async function pubblicaGrezza(coppia) {
  return new Uint8Array(await crypto.subtle.exportKey('raw', coppia.publicKey));
}

/* IL CORPO CIFRATO
   salt(16) | rs(4) | lunghezza chiave(1) | chiave pubblica nostra(65) | AES-GCM */
async function cifra(iscrizione, testoChiaro, opz = {}) {
  const uaPub = B.da(iscrizione.keys.p256dh);
  const auth = B.da(iscrizione.keys.auth);
  const sale = opz.sale || crypto.getRandomValues(new Uint8Array(16));
  const rs = opz.rs || 4096;

  const mia = opz.coppia || await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPub = await pubblicaGrezza(mia);

  const altrui = await crypto.subtle.importKey(
    'raw', uaPub, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const segreto = new Uint8Array(await crypto.subtle.deriveBits(
    { name: 'ECDH', public: altrui }, mia.privateKey, 256));

  /* «WebPush: info» lega la chiave alle DUE chiavi pubbliche: senza, lo stesso
     segreto potrebbe essere riusato altrove */
  const infoChiave = unisci([testo('WebPush: info'), new Uint8Array([0]), uaPub, asPub]);
  const ikm = await hkdf(auth, segreto, infoChiave, 32);

  const cek = await hkdf(sale, ikm, unisci([testo('Content-Encoding: aes128gcm'), new Uint8Array([0])]), 16);
  const nonce = await hkdf(sale, ikm, unisci([testo('Content-Encoding: nonce'), new Uint8Array([0])]), 12);

  const chiave = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  /* 0x02 chiude l'ultimo (e unico) record */
  const dentro = unisci([testoChiaro, new Uint8Array([2])]);
  const cifrato = new Uint8Array(await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce, tagLength: 128 }, chiave, dentro));

  const testa = new Uint8Array(21);
  testa.set(sale, 0);
  new DataView(testa.buffer).setUint32(16, rs, false);
  testa[20] = asPub.length;
  return unisci([testa, asPub, cifrato]);
}

/* LA FIRMA (VAPID): un JWT ES256 che dice «sono io che mando» */
async function intestazioneVapid(endpoint, vapid) {
  const aud = new URL(endpoint).origin;
  const testaJwt = B.a(testo(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const corpo = B.a(testo(JSON.stringify({
    aud: aud,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: vapid.soggetto
  })));
  const daFirmare = testo(testaJwt + '.' + corpo);

  /* la privata VAPID sono 32 byte grezzi: WebCrypto vuole una JWK, e per
     costruirla serve anche la pubblica (che è quella che pubblichiamo) */
  const pub = B.da(vapid.pubblica);
  const jwk = {
    kty: 'EC', crv: 'P-256', ext: true,
    d: vapid.privata,
    x: B.a(pub.slice(1, 33)),
    y: B.a(pub.slice(33, 65))
  };
  const k = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const firma = new Uint8Array(await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' }, k, daFirmare));
  const jwt = testaJwt + '.' + corpo + '.' + B.a(firma);
  return { Authorization: 'vapid t=' + jwt + ', k=' + vapid.pubblica };
}

/* MANDA. Torna lo stato HTTP: 201 è consegnato al servizio push,
   404 e 410 vogliono dire «questa iscrizione non esiste più». */
async function manda(iscrizione, dati, vapid, opz = {}) {
  const corpo = await cifra(iscrizione, testo(JSON.stringify(dati)), opz);
  const testa = await intestazioneVapid(iscrizione.endpoint, vapid);
  const r = await fetch(iscrizione.endpoint, {
    method: 'POST',
    headers: {
      ...testa,
      'Content-Encoding': 'aes128gcm',
      'Content-Type': 'application/octet-stream',
      TTL: String(opz.ttl || 3600),
      Urgency: opz.urgenza || 'normal'
    },
    body: corpo
  });
  /* Non basta il numero. Quando Apple o Google rifiutano, il perché lo
     scrivono nel corpo — «BadJwtToken», «UnauthorizedRegistration», «the key
     in the token pairs with a different application server key» — e senza
     quella riga un 401 e un 403 si somigliano troppo per sapere quale delle
     due chiavi rimettere. Si tronca perché è per un pannello, non per un log. */
  let detto = '';
  try { detto = (await r.text()).trim().slice(0, 300); } catch (e) { detto = ''; }
  return { stato: r.status, detto: detto };
}

const base64url = B;

/* ══════════ piano.js ══════════ */
/* CHI TOCCA ADESSO — la sola decisione che prende il server.
   Niente rete, niente KV, niente orologio di sistema: dentro e fuori solo
   dati. Così si può provare tutto senza far partire nulla (prova-piano.mjs).

   Il problema che risolve non è «che ora è». È questo: il piano lo manda
   l'app, e l'app la apri tu. Se stasera non la apro, domani alle 8:30 il
   server ha in mano il piano di ieri. Buttarlo via vuol dire non ricordarti
   niente proprio nei giorni in cui te ne saresti dimenticato — cioè quelli
   che contano. Tenerlo tutto vuol dire ricordarti alle 16:30 di domani una
   priorità che avevi scritto ieri, che è una bugia.
   Per questo ogni voce dice se `ripete`. I tre momenti e le abitudini sì: se
   l'app è rimasta chiusa, per definizione non li hai fatti. La priorità del
   giorno no. */

/* Più tardi di così non è un promemoria, è un rimprovero: se il telefono era
   spento alle 8:30 e si riaccende a mezzogiorno, «Cosa fai oggi» non serve
   più a niente. Un'ora e mezza è la finestra. */
const RITARDO_MAX = 90;
/* Al massimo tre in un colpo. Se il telefono è stato spento mezza giornata,
   riaccendendosi non deve arrivare una raffica: quella si scarta tutta in
   blocco, comprese le voci buone. */
const MAX_PER_VOLTA = 3;

/* L'ora locale di CHI riceve, non quella del server. Un Worker gira in un
   posto qualsiasi del mondo, e Intl è l'unico modo di sapere che ore sono a
   Milano senza tenersi una tabella dei fusi (che cambia due volte l'anno). */
function oraLocale(adesso, fuso) {
  let parti;
  try {
    parti = new Intl.DateTimeFormat('en-CA', {
      timeZone: fuso || 'Europe/Rome', hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', weekday: 'short'
    }).formatToParts(new Date(adesso));
  } catch (e) {
    /* fuso scritto male: meglio l'ora di Roma che nessun promemoria */
    return oraLocale(adesso, 'Europe/Rome');
  }
  const p = {};
  for (const x of parti) p[x.type] = x.value;
  /* `hour` con hour12:false può venire «24» a mezzanotte in alcune versioni */
  const h = Number(p.hour) % 24;
  const GIORNI = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    giorno: p.year + '-' + p.month + '-' + p.day,
    minuti: h * 60 + Number(p.minute),
    settimana: GIORNI[p.weekday]
  };
}

function minutiDaOra(hhmm) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || '').trim());
  if (!m) return null;
  const h = Number(m[1]), min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/* La chiave di «questa l'ho già mandata»: giorno locale + voce. Il giorno
   dentro la chiave è quello che rende la cosa ripetibile domani senza
   azzerare niente a mezzanotte. */
const segno = (giorno, id) => giorno + '|' + id;

/* LA FASCIA DI SILENZIO.
   Un promemoria alle due di notte non si legge, sveglia, e insegna a spegnere
   tutto. Va guardata sull'ora di ADESSO e non su quella scritta nella voce:
   una voce delle 21:30 può arrivare fino alle 23:00 per la regola del
   ritardo, e senza questo controllo entrerebbe in punta di piedi dentro la
   fascia. La fascia scavalca la mezzanotte quasi sempre (23:00→07:00), quindi
   i due casi sono diversi e vanno scritti entrambi. */
function inSilenzio(silenzio, minuti) {
  if (!silenzio || !silenzio.on) return false;
  const da = minutiDaOra(silenzio.da), a = minutiDaOra(silenzio.a);
  if (da === null || a === null || da === a) return false;
  return da < a ? (minuti >= da && minuti < a) : (minuti >= da || minuti < a);
}

/* rec = { fuso, giorno, voci, inviate: [], silenzio } — quello che sta in KV.
   Restituisce { dovute, segni, giornoLocale }: le voci da mandare adesso e i
   segni da aggiungere a `inviate`. */
function dovute(rec, adesso) {
  const l = oraLocale(adesso, rec && rec.fuso);
  const fuori = { dovute: [], segni: [], giornoLocale: l.giorno, locale: l };
  if (!rec || !Array.isArray(rec.voci)) return fuori;
  if (inSilenzio(rec.silenzio, l.minuti)) return fuori;

  const vecchio = rec.giorno !== l.giorno;      /* il piano è di un altro giorno */
  const fatte = new Set(rec.inviate || []);

  for (const v of rec.voci) {
    if (!v || !v.titolo) continue;
    if (vecchio && !v.ripete) continue;
    const giorni = Array.isArray(v.giorni) ? v.giorni : [];
    if (giorni.length && giorni.indexOf(l.settimana) < 0) continue;
    const q = minutiDaOra(v.ora);
    if (q === null) continue;
    const ritardo = l.minuti - q;
    if (ritardo < 0 || ritardo > RITARDO_MAX) continue;
    const s = segno(l.giorno, v.id);
    if (fatte.has(s)) continue;
    fuori.dovute.push(v);
    fuori.segni.push(s);
    if (fuori.dovute.length >= MAX_PER_VOLTA) break;
  }
  return fuori;
}

/* I segni di ieri non servono a nessuno e il record cresce per sempre: si
   tengono solo quelli del giorno locale corrente più i nuovi. */
function potaSegni(inviate, giornoLocale, nuovi) {
  const t = new Set((inviate || []).filter((s) => String(s).slice(0, 10) === giornoLocale));
  for (const s of nuovi || []) t.add(s);
  return [...t];
}

/* Solo i servizi push veri. Senza questo controllo il Worker diventa un modo
   per far partire richieste verso un indirizzo qualsiasi scritto da chi
   passa: chiunque potrebbe usarlo per bussare a porte non sue. */
const SERVIZI = [
  'web.push.apple.com',
  'fcm.googleapis.com',
  'updates.push.services.mozilla.com',
  'notify.windows.com'
];
function endpointValido(url) {
  let u;
  try { u = new URL(String(url)); } catch (e) { return false; }
  if (u.protocol !== 'https:') return false;
  return SERVIZI.some((d) => u.hostname === d || u.hostname.endsWith('.' + d));
}

/* ══════════ worker.js ══════════ */
/* IL POSTINO. Cloudflare Worker, piano gratuito.
   Fa due cose e nient'altro:
     POST   /piano        l'app deposita il piano di oggi
     DELETE /piano/:id    l'app dice «non mandarmi più niente»
   e ogni cinque minuti si sveglia da solo, guarda chi tocca e manda.

   Quello che NON fa: decidere cosa vale la pena ricordare. Quella decisione
   sta nell'app, dove stanno i dati; qui arriva già presa (assets/promemoria.js).
   Al server resta l'orologio, che è l'unica cosa che l'app non può avere:
   una pagina chiusa non si sveglia alle 8:30.

   Perché serve un server, visto che tutto il resto è statico: sul web non
   esiste un modo di programmare una notifica per domani. L'unica API che lo
   permetteva (Notification Triggers) non è mai uscita dalla sperimentazione.
   O la notifica arriva da fuori, o non arriva.

   Quanto costa: zero. Il cron gira 288 volte al giorno, ogni giro è una
   lettura di KV per dispositivo e una scrittura solo quando manda davvero.
   Il piano gratuito dà 100.000 richieste al giorno e 1.000 scritture: siamo
   a due ordini di grandezza sotto.  Istruzioni: promemoria/LEGGIMI.md */



const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};
const risposta = (o, stato = 200) =>
  new Response(JSON.stringify(o), { status: stato, headers: { 'Content-Type': 'application/json', ...CORS } });

/* Un id di dispositivo arriva da fuori e diventa una chiave: se ci passasse
   qualsiasi cosa, chiunque potrebbe scrivere sopra il record di un altro o
   riempire lo spazio di chiavi finte. */
const idPulito = (s) => /^[A-Za-z0-9_-]{4,64}$/.test(String(s || '')) ? String(s) : null;

/* Il testo che finisce dentro la notifica: corto, perché nessun servizio push
   accetta payload grandi e perché una notifica lunga non si legge comunque. */
const taglia = (s, n) => { s = String(s == null ? '' : s); return s.length > n ? s.slice(0, n - 1) + '…' : s; };

async function riceviPiano(req, env) {
  let b;
  try { b = await req.json(); } catch (e) { return risposta({ errore: 'json' }, 400); }

  const id = idPulito(b && b.id);
  if (!id) return risposta({ errore: 'id' }, 400);
  const isc = b.iscrizione;
  if (!isc || !isc.endpoint || !isc.keys || !isc.keys.p256dh || !isc.keys.auth) return risposta({ errore: 'iscrizione' }, 400);
  if (!endpointValido(isc.endpoint)) return risposta({ errore: 'endpoint' }, 400);
  if (!Array.isArray(b.voci)) return risposta({ errore: 'voci' }, 400);
  if (b.voci.length > 40) return risposta({ errore: 'troppe voci' }, 400);

  /* Il record vecchio serve per due motivi: tenere i segni di «già mandata»
     (altrimenti ogni salvataggio dell'app rimanderebbe le stesse notifiche) e
     accorgersi che il giorno è cambiato. */
  const vecchio = await leggi(env, id);
  const giorno = String(b.giorno || '').slice(0, 10);
  const rec = {
    iscrizione: { endpoint: isc.endpoint, keys: { p256dh: isc.keys.p256dh, auth: isc.keys.auth } },
    fuso: String(b.fuso || 'Europe/Rome').slice(0, 64),
    giorno: giorno,
    /* la fascia in cui non arriva niente. Passa solo se sono due orari veri:
       una fascia scritta male vorrebbe dire o silenzio sempre o mai, e in
       entrambi i casi senza che si capisca perché. */
    silenzio: (b.silenzio && minutiDaOra(b.silenzio.da) !== null && minutiDaOra(b.silenzio.a) !== null)
      ? { on: !!b.silenzio.on, da: String(b.silenzio.da), a: String(b.silenzio.a) } : null,
    /* il numero da mettere sull'icona: lo conta l'app, che sa che cosa hai
       ancora aperto oggi. Qui viaggia solo per essere rispedito. */
    numero: Number.isFinite(b.numero) && b.numero >= 0 && b.numero < 1000 ? Math.floor(b.numero) : null,
    voci: b.voci.slice(0, 40).map((v) => ({
      id: taglia(v.id, 48), ora: taglia(v.ora, 5), ripete: !!v.ripete,
      /* «stato» è la nota fissa: arriva zitta e si riscrive al posto della
         precedente. Qualsiasi altra cosa è un promemoria normale. */
      tipo: v.tipo === 'stato' ? 'stato' : 'promemoria',
      giorni: Array.isArray(v.giorni) ? v.giorni.filter((n) => n >= 0 && n <= 6).slice(0, 7) : [],
      titolo: taglia(v.titolo, 80), corpo: taglia(v.corpo, 160), vai: taglia(v.vai, 40)
    })).filter((v) => v.id && v.titolo),
    inviate: (vecchio && vecchio.inviate) || [],
    aggiornato: Date.now()
  };
  await env.PROMEMORIA.put('d:' + id, JSON.stringify(rec), { expirationTtl: 60 * 60 * 24 * 30 });
  return risposta({ ok: true, voci: rec.voci.length });
}

const leggi = async (env, id) => {
  try { return JSON.parse(await env.PROMEMORIA.get('d:' + id) || 'null'); } catch (e) { return null; }
};

/* IL GIRO. Una volta ogni cinque minuti: chi tocca adesso, e mandaglielo. */
async function giro(env, adesso) {
  const vapid = {
    pubblica: env.VAPID_PUBBLICA,
    privata: env.VAPID_PRIVATA,
    soggetto: env.VAPID_SOGGETTO || 'mailto:promemoria@lifemax.invalid'
  };
  if (!vapid.pubblica || !vapid.privata) { console.log('manca la coppia VAPID'); return; }

  let cursore, mandate = 0, viste = 0;
  do {
    const l = await env.PROMEMORIA.list({ prefix: 'd:', cursor: cursore, limit: 200 });
    cursore = l.list_complete ? null : l.cursor;
    for (const k of l.keys) {
      viste++;
      const rec = await leggi(env, k.name.slice(2));
      if (!rec || !rec.iscrizione) continue;
      const g = dovute(rec, adesso);
      if (!g.dovute.length) continue;

      const riusciti = [];
      for (const v of g.dovute) {
        let stato = 0, detto = '';
        try {
          const esito = await manda(rec.iscrizione, {
            titolo: v.titolo, corpo: v.corpo, vai: v.vai, tag: 'lm-' + v.id,
            tipo: v.tipo, numero: rec.numero
          }, vapid, { ttl: 3600 });
          stato = esito.stato; detto = esito.detto;
        } catch (e) { console.log('errore invio', k.name, '' + e); }
        /* 404 e 410 vogliono dire «questa iscrizione non esiste più»: il
           telefono ha disinstallato, o il permesso è stato revocato. Tenere il
           record vorrebbe dire riprovare per sempre a bussare a una porta
           murata, e il piano gratuito è fatto di richieste. */
        if (stato === 404 || stato === 410) { await env.PROMEMORIA.delete(k.name); riusciti.length = 0; break; }
        if (stato >= 200 && stato < 300) { riusciti.push(segnoDi(g, v)); mandate++; }
        else console.log('rifiutata', k.name, v.id, stato, detto);
      }
      if (riusciti.length) {
        /* il segno si mette DOPO la consegna: se il servizio push è giù, la
           prossima passata riprova invece di dare per fatta una cosa che non
           è arrivata */
        rec.inviate = potaSegni(rec.inviate, g.giornoLocale, riusciti);
        await env.PROMEMORIA.put(k.name, JSON.stringify(rec), { expirationTtl: 60 * 60 * 24 * 30 });
      }
    }
  } while (cursore);
  console.log('giro:', viste, 'dispositivi,', mandate, 'notifiche');
}
const segnoDi = (g, v) => g.segni[g.dovute.indexOf(v)];

export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (req.method === 'POST' && u.pathname === '/piano') return riceviPiano(req, env);
    if (req.method === 'DELETE' && u.pathname.startsWith('/piano/')) {
      const id = idPulito(u.pathname.slice(7));
      if (!id) return risposta({ errore: 'id' }, 400);
      await env.PROMEMORIA.delete('d:' + id);
      return risposta({ ok: true });
    }
    /* MANDAMENE UNA ADESSO.
       È lo strumento che serve a chi installa da solo: senza, l'unico modo di
       sapere se la catena funziona è aspettare le 08:30 di domani e vedere se
       succede qualcosa. Non decide niente e non scrive niente — prende
       l'iscrizione che c'è già in KV e ci manda una notifica sola. Se non c'è
       un piano per quell'id, non c'è nulla a cui mandarla. */
    if (req.method === 'POST' && u.pathname === '/prova') {
      let b;
      try { b = await req.json(); } catch (e) { return risposta({ errore: 'json' }, 400); }
      const id = idPulito(b && b.id);
      if (!id) return risposta({ errore: 'id' }, 400);
      const rec = await leggi(env, id);
      if (!rec || !rec.iscrizione) return risposta({ errore: 'nessun piano per questo dispositivo' }, 404);
      if (!env.VAPID_PUBBLICA || !env.VAPID_PRIVATA) return risposta({ errore: 'manca la coppia VAPID' }, 500);
      let stato = 0, detto = '';
      try {
        const esito = await manda(rec.iscrizione, {
          titolo: 'Prova riuscita', corpo: 'I promemoria arrivano. Questa è l’unica di prova.',
          vai: '#/oggi', tag: 'lm-prova', numero: rec.numero
        }, {
          pubblica: env.VAPID_PUBBLICA, privata: env.VAPID_PRIVATA,
          soggetto: env.VAPID_SOGGETTO || 'mailto:promemoria@lifemax.invalid'
        }, { ttl: 60, urgenza: 'high' });
        stato = esito.stato; detto = esito.detto;
      } catch (e) {
        /* qui non si è nemmeno arrivati a parlare col servizio push: o la
           chiave privata non è una chiave (spazio, ritorno a capo, pezzo di
           testo incollato dentro), o l'iscrizione salvata è malformata */
        return risposta({ errore: 'invio: ' + e.message, dove: 'firma' }, 502);
      }
      /* 404 e 410 vogliono dire che l'iscrizione non vale più: dirlo qui
         serve, perché è esattamente il caso in cui «non arriva niente» */
      if (stato === 404 || stato === 410) {
        await env.PROMEMORIA.delete('d:' + id);
        return risposta({ errore: 'iscrizione scaduta: riaccendi i promemoria', stato: stato }, 410);
      }
      /* Il numero da solo non basta a nessuno. Si passa su anche quello che ha
         detto il servizio push, e quale delle due chiavi il Worker ha in mano:
         il caso di gran lunga più comune è che la pubblica scritta nell'app e
         quella messa nei segreti non siano la stessa coppia, e da qui si vede
         confrontandole invece di indovinare. */
      return risposta({
        ok: stato >= 200 && stato < 300, stato: stato, detto: detto,
        pubblica: env.VAPID_PUBBLICA, soggetto: env.VAPID_SOGGETTO || ''
      }, stato >= 200 && stato < 300 ? 200 : 502);
    }

    /* una porta per capire se è vivo, senza dire niente di privato */
    /* La chiave PUBBLICA la si dice: è pubblica per definizione — finisce nel
       browser di chiunque e nelle mani del servizio push. Dirla qui serve a
       confrontarla con quella scritta nell'app, che è l'errore numero uno di
       chi installa da sé: due chiavi di due coppie diverse, e il servizio push
       risponde 403 senza spiegare niente. */
    if (u.pathname === '/salute') return risposta({
      ok: true, vapid: !!(env.VAPID_PUBBLICA && env.VAPID_PRIVATA),
      pubblica: env.VAPID_PUBBLICA || '', soggetto: env.VAPID_SOGGETTO || ''
    });
    return risposta({ errore: 'niente qui' }, 404);
  },
  async scheduled(evento, env, ctx) {
    ctx.waitUntil(giro(env, evento.scheduledTime || Date.now()));
  }
};
