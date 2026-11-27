/* IL BROWSER DELLE PROVE, CON IL CLOUD VERO CHIUSO FUORI.

   L'app prende l'SDK di Firebase da `www.gstatic.com` con un `import()` a
   runtime, e funziona anche se non arriva: resta su questo dispositivo.
   Tutte le prove sono nate su una macchina dove quell'indirizzo non si
   raggiungeva, e senza che nessuno l'avesse deciso si sono appoggiate a
   quel caso: le impronte dei pannelli, per dire, sono le impronte di
   un'app SENZA cloud.

   Il giorno che la stessa suite è girata su una macchina con la rete
   aperta, l'SDK è arrivato davvero. Quattro impronte sono cambiate — è
   comparso «Accedi con Google», è comparsa la sezione «Nel cloud» — e
   soprattutto è venuto fuori un guasto che in produzione c'era da sempre:
   il foglio «Menu» si apriva vuoto (vedi `stile()` in src/pezzi/pezzi.tsx).

   Una prova che cambia esito con la rete non prova il codice, prova la
   rete. Quindi qui il cloud vero è chiuso fuori SEMPRE, per scelta e non
   per caso: chi vuole il cloud lo finge, come fa `prove/cloud.js` — le
   sue `route` sono registrate dopo questa e Playwright le guarda per
   prime, quindi vincono loro. */
'use strict';
const { chromium } = require('playwright');

const SDK = 'https://www.gstatic.com/firebasejs/**';
/* LO STESSO PER I CALENDARI COLLEGATI (src/calendari/): la libreria di
   Google, le due API e la pagina di accesso di Microsoft. Nessuna prova deve
   poter parlare col calendario vero di qualcuno; chi li vuole li finge,
   come fa `prove/calendari.js`. */
const CALENDARI = [
  'https://accounts.google.com/**',
  'https://www.googleapis.com/**',
  'https://login.microsoftonline.com/**',
  'https://graph.microsoft.com/**'
];

module.exports = async function lancia() {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: require('./chiuso').concat(process.env.PROVE_ARGS ? process.env.PROVE_ARGS.split(' ') : []) });
  const contesto = b.newContext.bind(b);
  b.newContext = async function (opzioni) {
    const c = await contesto(opzioni);
    await c.route(SDK, (r) => r.abort());
    for (const via of CALENDARI) await c.route(via, (r) => r.abort());
    return c;
  };
  /* `newPage()` sul browser si fa un contesto suo, senza passare da qui
     sopra: va chiuso anche quello */
  b.newPage = async function (opzioni) {
    const c = await b.newContext(opzioni);
    return c.newPage();
  };
  return b;
};
