/* ============================================================
   COSA SERVE ALLA SENTINELLA PER PARTIRE, e da dove lo prende.

   I SEGRETI stanno nel pannello di Cloudflare (Worker «lifemax» →
   Impostazioni → Variabili e segreti), mai nel repository:
     GOOGLE_CLIENT_SECRET     il segreto del client OAuth di Google
     MICROSOFT_CLIENT_SECRET  il segreto dell'app Microsoft
     CHIAVE_CALENDARI         la chiave che cifra i permessi (32 byte base64)
   Le istruzioni passo per passo: src/calendari/LEGGIMI.md.

   SENZA SEGRETI NON SI ROMPE NIENTE. Il servizio di quel calendario
   risponde «non configurato», e l'app continua come prima: il permesso
   nel browser, come ha sempre fatto. Ogni fornitore parte da sé: con solo
   il segreto di Google, Google va dal server e Outlook resta nel browser.

   Gli ID dei client NON sono segreti (finiscono comunque nell'indirizzo
   della pagina di Google): stanno qui e in src/calendari/config.ts. Le
   altre voci si possono cambiare dall'ambiente solo per le prove.
   ============================================================ */
import { GOOGLE_ID, MICROSOFT_ID } from './fornitori.mjs';
import { chiaveValida } from './cifra.mjs';

export const ORIGINI = ['https://lifemax.theproject.world', 'https://raffaele-ando.github.io'];
export const RITORNI = ['https://lifemax.theproject.world/', 'https://raffaele-ando.github.io/LifeMax/'];

export function config(env) {
  const e = env || {};
  const lista = function (v, d) { return v ? String(v).split(',').map(function (x) { return x.trim(); }).filter(Boolean) : d; };
  return {
    base: (e.INDIRIZZO || 'https://lifemax.theproject.world').replace(/\/$/, ''),
    progetto: e.FIREBASE_PROGETTO || 'lifemax-9dc63',
    chiaviFirebase: e.CHIAVI_FIREBASE || '',
    chiave: e.CHIAVE_CALENDARI || '',
    origini: lista(e.ORIGINI, ORIGINI),
    ritorni: lista(e.RITORNI, RITORNI),
    google: { id: e.GOOGLE_CLIENT_ID || GOOGLE_ID, segreto: e.GOOGLE_CLIENT_SECRET || '' },
    microsoft: { id: e.MICROSOFT_CLIENT_ID || MICROSOFT_ID, segreto: e.MICROSOFT_CLIENT_SECRET || '' }
  };
}

/* il servizio di un fornitore c'è se ci sono: il posto dove tenere i dati
   (il Durable Object), la chiave per cifrarli, e il segreto di quel
   fornitore */
export function attivo(cfg, env, p) {
  return !!(env && env.SENTINELLA) && chiaveValida(cfg.chiave) && !!cfg[p] && !!cfg[p].id && !!cfg[p].segreto;
}

export function redirect(cfg, p) { return cfg.base + '/api/calendari/' + p + '/ritorno'; }

export const PROVENIENZE = ['google', 'microsoft'];
