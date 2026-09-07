/* ============================================================
   LifeMax — registro diagnostico
   Una console interna che scrive tutto quello che succede sotto il
   cofano: salvataggi, cloud, accesso, rete, errori JavaScript.

   Perché esiste: quando l'app dice "Salvataggio…" e non cambia più,
   dall'esterno non si capisce se il dato è al sicuro o perso. Una
   riga di stato non basta; serve la cronologia. E siccome il
   problema si vede sul telefono — dove non c'è nessuna console per
   sviluppatori — il registro deve stare dentro l'app, con un
   pulsante che copia tutto in un colpo.

   VA IMPORTATO PRIMO, prima di ogni altro modulo, così cattura anche
   gli errori di quelli che si caricano dopo. Nel sito di prima era il
   primo `<script>` della pagina; qui è la prima riga di `main.tsx`, e
   la ragione è la stessa.
   ============================================================ */

/* ---------------------------------------------------------------- i tipi
   `dati` è sempre una STRINGA, mai l'oggetto che gli hai passato: `pulisci`
   lo serializza e lo tronca subito. Sembra un dettaglio e invece è la
   ragione per cui un registro da cinquecento righe non tiene in vita
   mezza app in memoria. */
export type Livello = 'info' | 'avviso' | 'errore';

export interface Riga {
  t: number;      /* quando, in millisecondi dall'epoca */
  ms: number;     /* da quanto è aperta l'app */
  liv: Livello;
  can: string;    /* il canale: 'sync', 'js', 'dati'… */
  msg: string;
  dati: string;
}

const MAX = 500;            /* righe tenute in memoria */
const MAX_SALVATE = 150;    /* righe che sopravvivono a un ricaricamento */
const TETTO_BYTE = 24000;   /* tetto duro: il registro non deve mai rubare spazio ai dati */
const CHIAVE = 'lifemax.log.v1';
const T0 = Date.now();

let righe: Riga[] = [];
let salvaTimer: ReturnType<typeof setTimeout> | null = null;
let soloMemoria = false;    /* se lo spazio è agli sgoccioli si smette di scrivere su disco */

/* i dati allegati devono essere sempre serializzabili e mai enormi */
function pulisci(d: unknown): string {
  if (d === undefined || d === null) return '';
  if (typeof d === 'string') return d.length > 600 ? d.slice(0, 600) + '…' : d;
  if (typeof d === 'number' || typeof d === 'boolean') return String(d);
  try {
    const s = JSON.stringify(d, function (_k, v) {
      if (typeof v === 'string' && v.length > 200) return v.slice(0, 200) + '…';
      return v;
    });
    return s && s.length > 600 ? s.slice(0, 600) + '…' : (s || '');
  } catch { return '[non serializzabile]'; }
}

function riga(livello: Livello, canale: string, msg: unknown, dati?: unknown): Riga {
  return {
    t: Date.now(), ms: Date.now() - T0, liv: livello, can: canale,
    msg: String(msg == null ? '' : msg), dati: pulisci(dati)
  };
}

function salvaDopo(): void {
  if (soloMemoria || salvaTimer) return;
  salvaTimer = setTimeout(function () {
    salvaTimer = null;
    if (soloMemoria) return;
    try {
      let n = MAX_SALVATE, testoDaSalvare = JSON.stringify(righe.slice(-n));
      /* sotto il tetto a forza di dimezzare: meglio un registro corto che un
         salvataggio dei dati che non entra più */
      while (testoDaSalvare.length > TETTO_BYTE && n > 20) {
        n = Math.floor(n / 2);
        testoDaSalvare = JSON.stringify(righe.slice(-n));
      }
      localStorage.setItem(CHIAVE, testoDaSalvare);
    } catch { soloMemoria = true; }
  }, 600);
}

function aggiungi(livello: Livello, canale: string, msg: unknown, dati?: unknown): Riga {
  const r = riga(livello, canale, msg, dati);
  righe.push(r);
  if (righe.length > MAX) righe.splice(0, righe.length - MAX);
  salvaDopo();
  try { window.dispatchEvent(new CustomEvent('lm:log', { detail: r })); } catch { /* ignora */ }
  return r;
}

/* Se il salvataggio dei DATI non entra più, il registro si fa da parte
   subito: è uno strumento di servizio, non può essere la causa del guasto
   che dovrebbe aiutare a capire. */
function cedilPosto(): void {
  soloMemoria = true;
  try { localStorage.removeItem(CHIAVE); } catch { /* ignora */ }
  aggiungi('avviso', 'registro', 'Spazio agli sgoccioli: il registro resta solo in memoria e non occupa più disco');
}

/* ---------- persistenza ----------
   Il registro serve soprattutto DOPO: "prima si era piantato".
   Se sparisse a ogni ricaricamento sarebbe inutile proprio nel
   momento in cui serve. Lo teniamo in localStorage, troncato. */
try {
  const vecchie: unknown = JSON.parse(localStorage.getItem(CHIAVE) || '[]');
  if (Array.isArray(vecchie)) {
    righe = (vecchie as Riga[]).slice(-MAX_SALVATE);
    if (righe.length) righe.push(riga('info', 'sessione', '— nuova sessione: righe sopra da una sessione precedente —'));
  }
} catch { righe = []; }

/* ---------- formattazione ---------- */

function ora(t: number): string {
  const d = new Date(t);
  function p(n: number, l?: number) { return String(n).padStart(l || 2, '0'); }
  return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()) + '.' + p(d.getMilliseconds(), 3);
}

function mascheraEmail(e: string | null | undefined): string {
  if (!e || e.indexOf('@') < 0) return e || '';
  const p = e.split('@');
  return (p[0] || '').slice(0, 2) + '***@' + (p[1] || '');
}

/* Fotografia dell'ambiente: metà delle segnalazioni si risolvono
   qui (modalità app installata, spazio localStorage, offline…). */
function ambiente(): string {
  const a: string[] = [];
  function add(k: string, v: string) { a.push(k + ': ' + v); }
  add('quando', new Date().toString());
  add('url', location.href);
  add('userAgent', navigator.userAgent);
  add('lingua', navigator.language || '?');
  add('fuso', (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return '?'; } })());
  add('schermo', window.innerWidth + '×' + window.innerHeight + ' @' + (window.devicePixelRatio || 1) + 'x');
  add('online', String(navigator.onLine));
  /* `navigator.standalone` è di Safari e non sta in nessun tipo standard:
     è la sola via per sapere se l'app è stata installata da un iPhone */
  const nav = navigator as Navigator & { standalone?: boolean };
  add('installata (standalone)', String(
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || nav.standalone === true
  ));
  add('puntatore', (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ? 'tocco' : 'preciso');
  add('cookie/storage abilitati', String(navigator.cookieEnabled));
  try {
    let tot = 0, mio = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || '', v = localStorage.getItem(k) || '';
      tot += k.length + v.length;
      if (k.indexOf('lifemax') === 0) mio += k.length + v.length;
    }
    add('localStorage', Math.round(tot / 1024) + ' KB in totale, ' + Math.round(mio / 1024) + ' KB di LifeMax');
  } catch (e) { add('localStorage', 'non accessibile (' + (e instanceof Error ? e.message : '') + ')'); }
  try {
    const s = window.LM && window.LM.load();
    if (s) {
      /* `misure` NON ESISTE, e non è mai esistito. Questa riga scriveva
         «misure 0» in ogni registro tecnico da mesi: `s.misure || {}` su un
         campo che non c'è dà sempre zero, e zero in un rapporto diagnostico
         non si legge come «questo campo non esiste», si legge come «non hai
         misurato niente». L'ha trovato il tipo di `Stato`.
         Al suo posto le due cose che si misurano davvero, e che hanno una
         chiave per giorno: i voti alle aree e i minuti. */
      add('dati', 'inbox ' + (s.inbox || []).length + ' · azioni ' + (s.azioni || []).length +
        ' · abitudini ' + (s.abitudini || []).length + ' · backlog ' + (s.backlog || []).length +
        ' · giorni con voti ' + Object.keys(s.valutazioni || {}).length +
        ' · giorni con minuti ' + Object.keys(s.minuti || {}).length);
      add('ultima modifica locale', s.updatedAt ? new Date(s.updatedAt).toLocaleString('it-IT') : 'mai');
    }
  } catch { /* ignora */ }
  const au = window.LM_AUTH;
  add('cloud disponibile', String(!!(au && au.available)));
  add('account', au && au.user ? mascheraEmail(au.user.email) : 'non connesso');
  const sy = window.LM_SYNC;
  add('stato sync', (sy && sy.state) || 'sconosciuto');
  if (sy && sy.error) add('ultimo errore sync', sy.error);
  if (sy && sy.at) add('ultima conferma dal cloud', new Date(sy.at).toLocaleString('it-IT'));
  return a.join('\n');
}

function testo(): string {
  const corpo = righe.map(function (r) {
    return ora(r.t) + '  +' + String(Math.round(r.ms / 100) / 10) + 's  [' + r.liv.toUpperCase() + '] ' +
      r.can + ' — ' + r.msg + (r.dati ? '  ' + r.dati : '');
  }).join('\n');
  return 'LifeMax — registro diagnostico\n' +
    '================================\n' + ambiente() +
    '\n\nCRONOLOGIA (' + righe.length + ' righe)\n' +
    '--------------------------------\n' + (corpo || '(vuoto)') + '\n';
}

/* ---------- cattura automatica ---------- */

window.addEventListener('error', function (e) {
  /* un `<img>` o uno `<script>` che non si carica alza `error` sull'ELEMENTO,
     e quell'evento risale fino a qui: si distingue dal bersaglio */
  const bersaglio = e.target as (Element & { src?: string; href?: string }) | null;
  if (bersaglio && (bersaglio as unknown) !== window && bersaglio.tagName) {
    aggiungi('errore', 'risorsa', 'Risorsa non caricata: ' + (bersaglio.src || bersaglio.href || bersaglio.tagName));
    return;
  }
  aggiungi('errore', 'js', (e && e.message) || 'Errore sconosciuto',
    e && e.filename ? (e.filename.split('/').pop() + ':' + e.lineno + ':' + e.colno) : '');
}, true);

window.addEventListener('unhandledrejection', function (e) {
  const r = e && (e.reason as { message?: string; code?: string; stack?: string } | undefined);
  aggiungi('errore', 'promessa', (r && (r.message || r.code)) || String(r), r && r.stack ? String(r.stack).split('\n')[1] : '');
});

/* Anche i console.warn/error passano dal registro: molti moduli
   (Firebase compreso) parlano solo attraverso la console. */
(['warn', 'error'] as const).forEach(function (m) {
  const orig = console[m];
  console[m] = function (...argomenti: unknown[]) {
    try {
      const parti = argomenti.map(function (x) {
        if (typeof x === 'string') return x;
        if (x instanceof Error) return x.message;
        try { return JSON.stringify(x); } catch { return String(x); }
      });
      aggiungi(m === 'error' ? 'errore' : 'avviso', 'console', parti.join(' '));
    } catch { /* mai far fallire una console.log */ }
    return orig.apply(console, argomenti);
  };
});

window.addEventListener('online', function () { aggiungi('info', 'rete', 'Rete tornata disponibile'); });
window.addEventListener('offline', function () { aggiungi('avviso', 'rete', 'Rete assente'); });

window.addEventListener('lm:sync', function (e) {
  const d = ((e as CustomEvent).detail || {}) as { state?: string; error?: string };
  aggiungi(d.state === 'error' || d.state === 'muto' ? 'errore' : (d.state === 'attesa' ? 'avviso' : 'info'),
    'sync', 'stato → ' + d.state + (d.error ? ' — ' + d.error : ''));
});

window.addEventListener('lm:auth', function () {
  const a = window.LM_AUTH;
  aggiungi('info', 'account', a && a.user ? ('connesso come ' + mascheraEmail(a.user.email)) :
    (a && a.available ? 'non connesso (cloud disponibile)' : 'cloud non disponibile'));
});

window.addEventListener('lm:remote', function () { aggiungi('info', 'cloud', 'Ricevuto aggiornamento da un altro dispositivo'); });

document.addEventListener('lm:errore-salvataggio', function () {
  aggiungi('errore', 'locale', 'Salvataggio su questo dispositivo non riuscito (spazio esaurito?)');
  if (!soloMemoria) cedilPosto();
});

let nCambi = 0;
let cambiTimer: ReturnType<typeof setTimeout> | undefined;
document.addEventListener('lm:change', function () {
  nCambi++;
  clearTimeout(cambiTimer);
  /* le modifiche arrivano a raffica: le raggruppiamo, altrimenti il
     registro diventa illeggibile proprio quando serve leggerlo */
  cambiTimer = setTimeout(function () {
    aggiungi('info', 'dati', nCambi === 1 ? 'Modifica salvata sul dispositivo' : nCambi + ' modifiche salvate sul dispositivo');
    nCambi = 0;
  }, 500);
});

window.addEventListener('hashchange', function () { aggiungi('info', 'navigazione', location.hash || '#/'); });

document.addEventListener('visibilitychange', function () {
  aggiungi('info', 'app', document.hidden ? 'in secondo piano' : 'in primo piano');
});

window.addEventListener('load', function () {
  try {
    const n = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined : null;
    aggiungi('info', 'app', 'Pagina caricata' + (n ? ' in ' + Math.round(n.duration) + ' ms (' + n.type + ')' : ''));
  } catch { aggiungi('info', 'app', 'Pagina caricata'); }
});

aggiungi('info', 'app', 'Registro avviato');

export const LMLog = {
  add: aggiungi,
  info: function (c: string, m: unknown, d?: unknown) { return aggiungi('info', c, m, d); },
  avviso: function (c: string, m: unknown, d?: unknown) { return aggiungi('avviso', c, m, d); },
  errore: function (c: string, m: unknown, d?: unknown) { return aggiungi('errore', c, m, d); },
  righe: function () { return righe.slice(); },
  ora: ora,
  ambiente: ambiente,
  testo: testo,
  svuota: function () {
    righe = [aggiungi('info', 'registro', 'Registro svuotato dall’utente')];
    try { localStorage.setItem(CHIAVE, JSON.stringify(righe)); } catch { /* ignora */ }
  }
};

export type Registro = typeof LMLog;

/* finché qualcosa del vecchio sito lo cerca su `window` */
window.LMLog = LMLog;
