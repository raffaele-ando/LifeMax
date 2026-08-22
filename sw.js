/* IL SERVICE WORKER — serve solo ai promemoria.
   Niente cache: un'app che si sta ancora cambiando ogni giorno, con una cache
   di mezzo, ti mostra la versione di ieri e non capisci perché. Se un giorno
   servirà l'offline si aggiunge qui, con un numero di versione.

   Sta nella radice del sito perché uno service worker può controllare solo le
   pagine che stanno al suo livello o sotto. */

/* appena installato prende servizio, senza aspettare la chiusura di tutte le
   schede: al primo caricamento vogliamo che i promemoria siano già attivi */
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

/* UNA NOTIFICA ARRIVATA DA FUORI */
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { corpo: e.data && e.data.text() }; }
  const titolo = d.titolo || 'LifeMax';
  e.waitUntil(self.registration.showNotification(titolo, {
    body: d.corpo || '',
    icon: 'assets/icone/icona-192.png',
    badge: 'assets/icone/icona-192.png',
    lang: 'it',
    /* `tag` fa sostituire la precedente dello stesso tipo invece di
       accumularne dieci: chi ha l'ADHD non ha bisogno di una pila di avvisi
       che dicono la stessa cosa */
    tag: d.tag || 'lifemax',
    renotify: true,
    data: { vai: d.vai || '#/oggi' },
    /* una notifica che si può usare senza aprire l'app */
    actions: d.azioni || []
  }));
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
