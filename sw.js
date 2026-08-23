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
      icon: 'assets/icone/icona-192.png',
      /* `badge` è il segno piccolo che Android mette nella barra di stato,
         accanto all'ora, e là viene reso in monocromatico: l'icona a colori
         dell'app ci diventa un quadrato pieno, cioè una macchia. Questa è la
         sola forma, bianca su niente, e a 18px si legge ancora. */
      badge: 'assets/icone/badge-96.png',
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
