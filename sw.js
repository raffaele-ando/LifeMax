/* IL SERVICE WORKER — i promemoria, e l'app anche senza rete.

   Sta nella radice del sito perché uno service worker può controllare solo le
   pagine che stanno al suo livello o sotto. */

/* appena installato prende servizio, senza aspettare la chiusura di tutte le
   schede: al primo caricamento vogliamo che i promemoria siano già attivi */
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil((async () => {
  /* le cache di una forma vecchia di questo file non servono più */
  const nomi = await caches.keys();
  await Promise.all(nomi.filter((n) => n.indexOf('lifemax-') === 0 && n !== CASSA).map((n) => caches.delete(n)));
  await self.clients.claim();
  /* la pagina aperta adesso è arrivata prima di questo worker: la si chiede
     una volta, così anche la prima apertura senza rete trova l'app */
  try {
    const r = await fetch(new URL(PAGINA, radice()), { cache: 'no-cache', credentials: 'same-origin' });
    if (r.ok && r.type === 'basic') await riempi(r);
  } catch (x) { /* senza rete adesso: ci si riprova alla prossima apertura */ }
})()));

/* L'APP SENZA RETE (verifica del 25 novembre 2026, G3).
   Prima questo file non teneva niente, apposta: «un'app che si sta ancora
   cambiando ogni giorno, con una cache di mezzo, ti mostra la versione di
   ieri e non capisci perché». Il prezzo era che in metropolitana l'app non
   si apriva affatto — col telefono pieno delle tue cose. Adesso tiene il
   minimo, con due regole che rendono impossibile la «versione di ieri»:

   · LA PAGINA (index.html) SEMPRE DALLA RETE. Quella in cassa si usa SOLO
     se la rete non risponde (non con un 404, non con un 500: quelli
     vengono dal server, e il server è la verità) o non risponde in tre
     secondi e mezzo. Con la rete, si apre sempre la versione nuova; senza
     rete, l'ultima che si è aperta.
   · I FILE DEL PACCO DALLA CASSA. Hanno l'impronta del contenuto nel nome
     (index-BEkSn4cA.js): un nome è sempre lo stesso contenuto, quindi
     tenerlo non può mai dare una versione sbagliata. Quando arriva una
     pagina nuova, si mettono in cassa i suoi file (anche quelli che si
     caricano dopo, come il cloud) e si buttano quelli che nessuna delle due
     pagine più recenti nomina più.

   Le chiamate al server (/api/, /__/) e tutto quello che sta su altri
   indirizzi (Firebase, Google) non passano di qui: senza rete non avrebbero
   senso, e una risposta vecchia di quelle sarebbe una bugia. */
const CASSA = 'lifemax-app-1';
const PAGINA = 'index.html';
const ATTESA_PAGINA = 3500;

function radice() { return new URL('./', self.registration.scope); }
function relativo(u) { const r = radice().href; return u.indexOf(r) === 0 ? u.slice(r.length) : null; }

/* i file del pacco che una pagina (o un file del pacco) nomina */
function nominati(testo, base) {
  const out = new Set();
  const re = base ? /["'`(]\.\/([\w.-]+\.(?:js|css))/g : /(pacco\/[\w.-]+\.(?:js|css))/g;
  let m;
  while ((m = re.exec(testo))) out.add(base ? base + m[1] : m[1]);
  return out;
}

/* una pagina nuova è arrivata: in cassa lei e tutti i suoi file, e via quelli
   che non servono più a nessuna delle due pagine più recenti */
async function riempi(risposta) {
  try {
    const cassa = await caches.open(CASSA);
    const testo = await risposta.clone().text();
    const vecchia = await cassa.match(PAGINA);
    const tieni = nominati(testo);
    if (vecchia) nominati(await vecchia.text()).forEach((x) => tieni.add(x));
    /* i file caricati dopo (import dinamici) li nomina il codice del pacco */
    const daGuardare = Array.from(nominati(testo));
    const visti = new Set();
    while (daGuardare.length) {
      const f = daGuardare.shift();
      if (visti.has(f)) continue;
      visti.add(f);
      let r = await cassa.match(f);
      if (!r) {
        r = await fetch(new URL(f, radice()), { credentials: 'same-origin' }).catch(() => null);
        if (!r || !r.ok) continue;
        await cassa.put(f, r.clone());
      }
      tieni.add(f);
      if (/\.js$/.test(f)) nominati(await r.text(), 'pacco/').forEach((x) => { tieni.add(x); if (!visti.has(x)) daGuardare.push(x); });
    }
    /* la pagina per ultima: in cassa c'è una pagina solo quando ci sono tutti
       i suoi file */
    await cassa.put(PAGINA, risposta);
    for (const q of await cassa.keys()) {
      const k = relativo(q.url);
      if (k && /^pacco\//.test(k) && !tieni.has(k)) await cassa.delete(q);
    }
  } catch (x) { /* la cassa è un di più: se non riesce, l'app va lo stesso */ }
}

self.addEventListener('fetch', (e) => {
  const q = e.request;
  if (q.method !== 'GET') return;
  const k = relativo(q.url.split('#')[0].split('?')[0]);
  if (k === null || /^(api|__)\//.test(k)) return;
  if (q.mode === 'navigate' && (k === '' || k === PAGINA)) {
    /* LA RETE CHE FINGE DI ESSERCI (verifica 3, N8): in metro e in treno il
       segnale c'è e i dati no, e la richiesta resta appesa senza fallire.
       Se dopo ATTESA_PAGINA la pagina non è arrivata e in cassa ce n'è una,
       si apre quella; la richiesta però continua, e se arriva la pagina
       nuova va in cassa per la volta dopo (e la striscia «C'è una versione
       nuova», vedi nuvola.ts, lo dice anche alla scheda aperta). */
    const dallaRete = fetch(q).then((r) => {
      if (r.ok && r.type === 'basic') e.waitUntil(riempi(r.clone()));
      return r;
    });
    e.waitUntil(dallaRete.catch(() => null));
    e.respondWith((async () => {
      const inCassa = await caches.match(PAGINA, { cacheName: CASSA });
      if (!inCassa) return dallaRete;
      let timer = null;
      const tempo = new Promise((ok) => { timer = setTimeout(() => ok(null), ATTESA_PAGINA); });
      try {
        const r = await Promise.race([dallaRete, tempo]);
        if (r) return r;
        /* troppo lenta: l'ultima pagina aperta */
        return inCassa;
      } catch (x) {
        /* niente rete: l'ultima pagina aperta */
        return inCassa;
      } finally {
        if (timer) clearTimeout(timer);
      }
    })());
    return;
  }
  if (/^pacco\//.test(k)) {
    e.respondWith((async () => {
      const c = await caches.match(k, { cacheName: CASSA }) || await caches.match(q, { cacheName: CASSA });
      if (c) return c;
      const r = await fetch(q);
      if (r.ok && r.type === 'basic') { const cassa = await caches.open(CASSA); e.waitUntil(cassa.put(k, r.clone()).catch(() => {})); }
      return r;
    })());
  }
});

/* IL NUMERO SULL'ICONA
   L'unica cosa che resta a vista senza chiedere niente a nessuno: il pallino
   col numero sull'icona nella schermata Home. Non è una notifica — non si
   scarta, non fa rumore, non va in una lista — e sull'iPhone funziona per
   l'app aggiunta alla schermata Home, purché il permesso alle notifiche sia
   stato dato (il numero si può impostare comunque, ma si vede solo con quel
   permesso). Zero vuol dire «hai finito», e allora si toglie del tutto:
   un'icona pulita è la ricompensa. */
async function segnaNumero(n) {
  try {
    if (typeof n !== 'number' || n < 0) return;
    if (n === 0) { if (self.navigator.clearAppBadge) await self.navigator.clearAppBadge(); }
    else if (self.navigator.setAppBadge) await self.navigator.setAppBadge(n);
  } catch (x) {}
}

/* UNA NOTIFICA ARRIVATA DA FUORI */
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { corpo: e.data && e.data.text() }; }
  e.waitUntil((async () => {
    await segnaNumero(d.numero);
    /* Il «tipo: stato» è la nota che resta lì.
       Quello che si può fare davvero, sul web: UNA notifica sola che si
       sostituisce da sé (`tag` fisso, `renotify` falso) e non fa rumore
       quando si aggiorna (`silent`). Resta nell'elenco delle notifiche
       finché non la scarti tu — su Android nella tendina, su iPhone nel
       centro notifiche — e ogni aggiornamento riscrive quella, non ne
       aggiunge una seconda.
       Quello che NON si può fare: una notifica che non si possa scartare,
       come quella di un navigatore o di un lettore musicale. Su Android
       serve un servizio in primo piano e su iPhone una Live Activity: sono
       due cose che solo un'app installata dallo store può avere. Qui non si
       finge di averla. */
    const fissa = d.tipo === 'stato';
    await self.registration.showNotification(d.titolo || 'LifeMax', {
      body: d.corpo || '',
      icon: 'icone/icona-192.png',
      /* `badge` è il segno piccolo che Android mette nella barra di stato,
         accanto all'ora, e là viene reso in monocromatico: l'icona a colori
         dell'app ci diventa un quadrato pieno, cioè una macchia. Questa è la
         sola forma, bianca su niente, e a 18px si legge ancora. */
      badge: 'icone/badge-96.png',
      lang: 'it',
      /* `tag` fa sostituire la precedente dello stesso tipo invece di
         accumularne dieci: chi ha l'ADHD non ha bisogno di una pila di avvisi
         che dicono la stessa cosa */
      tag: fissa ? 'lifemax-stato' : (d.tag || 'lifemax'),
      /* la nota fissa si riscrive in silenzio: se ogni aggiornamento
         suonasse, in un pomeriggio la spegneresti */
      renotify: !fissa,
      silent: fissa,
      /* sul desktop una notifica sparisce da sé dopo una ventina di secondi:
         questa no. Su Android l'opzione non conta, perché là restano già
         nella tendina finché non le scarti. */
      requireInteraction: fissa,
      data: { vai: d.vai || '#/oggi', tipo: d.tipo || 'promemoria' },
      /* una notifica che si può usare senza aprire l'app */
      actions: d.azioni || []
    });
  })());
});

/* TOCCANDOLA SI ARRIVA DOVE SERVE, e se l'app è già aperta non se ne apre
   una seconda: si porta avanti quella che c'è */
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const vai = (e.notification.data && e.notification.data.vai) || '#/oggi';
  e.waitUntil((async () => {
    const aperte = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (aperte.length) {
      const c = aperte[0];
      /* `focus` prima del messaggio: se la finestra è dietro, cambiare
         schermata senza portarla davanti non si vede */
      try { await c.focus(); } catch (x) {}
      c.postMessage({ lm: 'vai', vai: vai });
      return;
    }
    await self.clients.openWindow('./index.html' + vai);
  })());
});
