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

import { manda } from './push.js';
import { dovute, potaSegni, endpointValido, minutiDaOra } from './piano.js';

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
        let stato = 0;
        try {
          stato = await manda(rec.iscrizione, {
            titolo: v.titolo, corpo: v.corpo, vai: v.vai, tag: 'lm-' + v.id,
            tipo: v.tipo, numero: rec.numero
          }, vapid, { ttl: 3600 });
        } catch (e) { console.log('errore invio', k.name, '' + e); }
        /* 404 e 410 vogliono dire «questa iscrizione non esiste più»: il
           telefono ha disinstallato, o il permesso è stato revocato. Tenere il
           record vorrebbe dire riprovare per sempre a bussare a una porta
           murata, e il piano gratuito è fatto di richieste. */
        if (stato === 404 || stato === 410) { await env.PROMEMORIA.delete(k.name); riusciti.length = 0; break; }
        if (stato >= 200 && stato < 300) { riusciti.push(segnoDi(g, v)); mandate++; }
        else console.log('rifiutata', k.name, v.id, stato);
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
      let stato = 0;
      try {
        stato = await manda(rec.iscrizione, {
          titolo: 'Prova riuscita', corpo: 'I promemoria arrivano. Questa è l’unica di prova.',
          vai: '#/oggi', tag: 'lm-prova', numero: rec.numero
        }, {
          pubblica: env.VAPID_PUBBLICA, privata: env.VAPID_PRIVATA,
          soggetto: env.VAPID_SOGGETTO || 'mailto:promemoria@lifemax.invalid'
        }, { ttl: 60, urgenza: 'high' });
      } catch (e) { return risposta({ errore: 'invio: ' + e.message }, 502); }
      /* 404 e 410 vogliono dire che l'iscrizione non vale più: dirlo qui
         serve, perché è esattamente il caso in cui «non arriva niente» */
      if (stato === 404 || stato === 410) {
        await env.PROMEMORIA.delete('d:' + id);
        return risposta({ errore: 'iscrizione scaduta: riaccendi i promemoria', stato: stato }, 410);
      }
      return risposta({ ok: stato >= 200 && stato < 300, stato: stato }, stato >= 200 && stato < 300 ? 200 : 502);
    }

    /* una porta per capire se è vivo, senza dire niente di privato */
    if (u.pathname === '/salute') return risposta({ ok: true, vapid: !!env.VAPID_PUBBLICA });
    return risposta({ errore: 'niente qui' }, 404);
  },
  async scheduled(evento, env, ctx) {
    ctx.waitUntil(giro(env, evento.scheduledTime || Date.now()));
  }
};
