/* ============================================================
   LifeMax — sincronizzazione cloud (Firebase)
   Accesso con Google + salvataggio multi-dispositivo su Firestore.

   Progressive enhancement: se Firebase non si carica (offline, rete
   bloccata, script non raggiungibile) l'app continua a funzionare in
   locale su questo dispositivo. Nessun errore fatale.

   COM'ERA E PERCHÉ È CAMBIATO (la verifica del 24 novembre 2026, in
   revisione/cloud/RAPPORTO.md). Prima c'era un documento solo per utente,
   e ogni dispositivo lo SOVRASCRIVEVA intero con la sua copia, senza
   leggere prima cosa c'era; riconosceva le proprie scritture dall'ora, che
   la fusione però copiava dagli altri. Il risultato: un computer sempre
   aperto che smetteva di sentire, cose scritte sul telefono che sparivano
   dal cloud alla scrittura successiva del computer, e oltre 1 MB la
   sincronizzazione ferma per sempre.

   COME FUNZIONA ADESSO
   · I dati nel cloud sono divisi in PEZZI (src/nuvola/pezzi.ts): il
     documento principale `users/{uid}` tiene solo l'elenco dei pezzi con la
     loro impronta, e ogni pezzo sta in `users/{uid}/pezzi/`. Niente più
     limite di dimensione, e un salvataggio riscrive solo i pezzi cambiati.
   · OGNI salvataggio è una TRANSAZIONE che legge quello che c'è nel cloud,
     lo unisce con quello che c'è qui (`LM.unisci`, con gli orologi delle
     chiavi) e scrive il risultato solo se è diverso. Se nel frattempo un
     altro dispositivo ha scritto, Firestore rifà il giro da capo. Non
     esiste più una scrittura «cieca».
   · Le proprie scritture si riconoscono da un NOME DI SCRITTURA a caso, non
     dall'ora; e comunque riunire una propria scrittura non fa danni,
     perché unire due volte la stessa cosa dà la stessa cosa.
   · Quando il cloud cambia, il dispositivo rifà il giro: legge, unisce,
     e se aveva qualcosa che il cloud non ha lo rimanda su.
   · Le copie di sicurezza nel cloud sono al massimo una al giorno, ne
     restano le ultime trenta, e si elencano senza scaricarle.
   · I dati appartengono a UN account: al cambio d'account, alla sessione
     chiusa da Firebase, a «Esci» in un'altra scheda, il dispositivo si
     svuota — e quello che non era ancora nel cloud resta da parte per
     quell'account soltanto (vedi `mettiDaParte` in dati.ts).
   ============================================================ */
import type { Stato } from '../tipi/stato';
import type {
  App, Auth, Db, Provider, Documento, DatiDocumento, ErroreFirebase,
  ModuloApp, ModuloAuth, ModuloFirestore, UtenteFirebase, Transazione, VocePezzo, OraServer
} from './sdk';
import { dividi, ricomponi, affetta, hash } from './pezzi';
import type { Pezzo } from './pezzi';

/* ⚠️ L'INTERRUTTORE DELL'ACCESSO DA IPHONE — UNA RIGA, E VA TOCCATA SOLO DOPO
   I PASSI SCRITTI IN revisione/cloud/RAPPORTO.md («Accesso su iPhone»).
   Su Safari, quando il popup di Google è bloccato, l'accesso passa da un
   redirect che deve tornare sullo STESSO indirizzo del sito: con
   `authDomain` su firebaseapp.com può non tornare. Il Worker serve già
   `/__/auth/*` da lifemax.theproject.world (sentinella/worker.mjs), ma
   accendere questo interruttore PRIMA di aver aggiunto
   https://lifemax.theproject.world/__/auth/handler fra gli indirizzi di
   ritorno del client OAuth di Google (e il dominio fra quelli autorizzati
   di Firebase) romperebbe l'accesso a tutti. */
const ACCESSO_DAL_DOMINIO = false;
const DOMINIO = 'lifemax.theproject.world';

const firebaseConfig = {
  apiKey: 'AIzaSyCDaZSbI1Emzz27QKKixn61Lmu60hrA2BM',
  authDomain: (ACCESSO_DAL_DOMINIO && location.hostname === DOMINIO) ? DOMINIO : 'lifemax-9dc63.firebaseapp.com',
  projectId: 'lifemax-9dc63',
  storageBucket: 'lifemax-9dc63.firebasestorage.app',
  messagingSenderId: '168732828259',
  appId: '1:168732828259:web:de0fed5a8f807d9c2d0e56',
  measurementId: 'G-BBCW8VVENL'
};

const SDK = 'https://www.gstatic.com/firebasejs/12.16.0/';

/* la forma dei dati nel cloud: 2 = divisa in pezzi (vedi in cima) */
const SCHEMA = 2;
/* scritto nel documento principale per chi lo apre con la console o con una
   versione vecchia: i dati non stanno più qui dentro */
const AVVISO_SCHEMA = 'I dati stanno in users/{uid}/pezzi (schema 2). Una scheda con la versione vecchia di LifeMax va ricaricata.';
/* LA VERSIONE PIÙ VECCHIA DELL'APP CHE PUÒ ANCORA SCRIVERE (verifica del
   25 novembre 2026, M5). Una scheda rimasta aperta per giorni, con una
   versione di prima, non riceveva più niente e nessuno lo diceva. Da qui in
   poi il documento principale porta `versioneMinima`: ogni versione ci
   scrive almeno la sua VERSIONE_MINIMA, e una scheda la cui VERSIONE_APP è
   più bassa smette di scrivere e dice «C'è una versione nuova: ricarica».
   VERSIONE_APP si alza a ogni versione che cambia il modo di salvare;
   VERSIONE_MINIMA solo quando le versioni di prima non devono più scrivere
   (una forma dei dati che non capiscono). Per le schede di PRIMA di questo
   campo non c'è rimedio: il loro codice è già quello che è.

   ALZARE VERSIONE_MINIMA È SENZA RITORNO, SE NON SI FA COSÌ (verifica 3, N9).
   Il campo nel cloud sale e non scende (`Math.max` qui sotto): se si
   pubblica una versione con VERSIONE_MINIMA = 2 e poi si torna alla
   versione di prima così com'era (VERSIONE_APP = 1), tutte le schede
   restano ferme su «C'è una versione nuova», per sempre. Per tornare
   indietro dopo un rialzo:
     1. si prende il codice della versione a cui si vuole tornare;
     2. si alza QUI la sua VERSIONE_APP al valore di VERSIONE_MINIMA che
        c'è nel cloud (lo stesso numero della versione da cui si torna), e
        si lascia VERSIONE_MINIMA com'è;
     3. si ricostruisce (`npm run build:nuovo`) e si pubblica.
   Così la versione di prima può di nuovo scrivere, e chi la pubblica
   dichiara che la forma dei dati della versione nuova le va bene (se non le
   va bene, non è un ritorno indietro da fare). Non si cambia niente a mano
   nel cloud: i documenti sono uno per persona. */
const VERSIONE_APP = 1;
const VERSIONE_MINIMA = 1;
class VersioneVecchia extends Error {
  constructor() { super('versione dell’app troppo vecchia per questi dati'); }
}
/* quante copie di sicurezza tenere nel cloud, e ogni quanto farne una */
const COPIE_DA_TENERE = 30;
const COPIA_OGNI_MS = 20 * 3600 * 1000;
/* oltre questo, un dispositivo che torna è «assente da molto» (vedi
   `assenzaLunga` in dati.ts): le lapidi durano due anni */
const ASSENZA_LUNGA_MS = 600 * 24 * 3600 * 1000;

/* ------------------------------------------------------- quello che si vede */
export interface Utente { uid: string; email: string; name: string; photo: string }

export interface StatoAuth {
  user: Utente | null;
  available: boolean;
  syncing: boolean;
  ascolto?: boolean;
}

/* Stato del salvataggio cloud:
     'idle'    nulla da salvare
     'saving'  scrittura in corso (breve)
     'saved'   confermato dal server
     'attesa'  scritto sul dispositivo, NON ANCORA NEL CLOUD (rete assente o
               lenta, o app riaperta con modifiche rimaste indietro)
     'muto'    online ma il server non risponde
     'error'   rifiutato                                                    */
export type StatoScrittura = 'idle' | 'saving' | 'saved' | 'attesa' | 'muto' | 'error';

export interface StatoSync {
  state: StatoScrittura;
  error: string;
  at: number;
  inCoda: boolean;
}

/* una copia di sicurezza nel cloud, come la si vede nell'elenco. `vecchia`:
   presa dalla versione di prima dell'app (users/{uid}/backups) */
export interface CopiaNelCloud {
  id: string; ts: number; salvato: number; ricchezza: number;
  nome?: string; visione?: string; motivo?: string; vecchia?: boolean;
}

export type EsitoUscita = 'uscito' | 'in-attesa';

export interface ApiCloud {
  available: boolean;
  signIn(): void | Promise<void>;
  signOut(): void | Promise<void | EsitoUscita>;
  backups?(): Promise<CopiaNelCloud[]>;
  backupsVecchi?(): Promise<CopiaNelCloud[]>;
  riprendiBackup?(id: string, vecchia?: boolean): Promise<boolean>;
  sostituisciConBackup?(id: string, vecchia?: boolean): Promise<boolean>;
  riprendiProfilo?(id: string, vecchia?: boolean): Promise<boolean>;
  /* ci sono modifiche fatte qui che il cloud non ha ancora? */
  inSospeso?(): boolean;
  /* manda subito quello che manca; vero quando il cloud l'ha confermato */
  svuota?(attesaMs?: number): Promise<boolean>;
  /* il gettone di Firebase dell'utente collegato ('' se non c'è): lo usa
     src/calendari/server.ts per farsi riconoscere dalla sentinella */
  gettone?(forza?: boolean): Promise<string>;
}

export type RispostaEsempio = 'unisci' | 'solo-cloud';

export interface DettaglioEsempio {
  qui: number;
  cloud: number;
  decidi(v: RispostaEsempio): void;
}

/* ------------------------------------------------------------- lo stato interno */
let AUTHM: ModuloAuth | null = null, FSM: ModuloFirestore | null = null;
let auth: Auth | null = null, db: Db | null = null, provider: Provider | null = null;
let currentUser: Utente | null = null;
let utenteFb: UtenteFirebase | null = null;
let unsubDoc: (() => void) | null = null;
let applyingRemote = false;
let ascoltoAttivo = false;
let riprovaTimer: ReturnType<typeof setTimeout> | null = null;
let attesaRiprova = 0;
let cadute = 0;

/* LE NOSTRE SCRITTURE, riconosciute dal nome che portano (`scrittore`), non
   dall'ora: la fusione copia le ore degli altri, e un'ora presa in prestito
   faceva scambiare per propria la scrittura di un altro dispositivo, che
   quindi veniva ignorata. Era il «computer sordo» della verifica. */
const mieScritture = new Set<string>();
function ricordaScrittura(w: string): void {
  mieScritture.add(w);
  if (mieScritture.size > 64) { const v = mieScritture.values().next(); if (!v.done) mieScritture.delete(v.value); }
}

/* IL GIRO DI SINCRONIZZAZIONE: uno alla volta. Se ne serve un altro mentre
   uno è in corso (una modifica qui, un cambiamento nel cloud) si segna e si
   rifà appena quello finisce: niente si perde per strada, e due giri non
   si pestano i piedi. Prima un aggiornamento arrivato durante una propria
   scrittura veniva scartato. */
let syncInCorso: Promise<boolean> | null = null;
let syncPendente = false;
let syncDi = '';
let syncTimer: ReturnType<typeof setTimeout> | null = null;
let riprovaSyncTimer: ReturnType<typeof setTimeout> | null = null;
let attesaSync = 0;
/* le modifiche fatte qui: quante, e se il cloud le ha già tutte */
let modifiche = 0;
let sporco = false;
/* finché la prima unione di questo dispositivo con l'account non è riuscita:
   «mai unito» (vedi `nuovo` in dati.ts) */
let primaFusione: { nuovo: boolean } | null = null;
/* l'uscita è stata chiesta (non è Firebase che ha chiuso la sessione) */
let uscitaVoluta = false;
/* la sessione chiusa da Firebase è stata vista da questa finestra (anche
   all'avvio): serve a non dirlo due volte */
let fineSessioneDetta = false;

/* QUELLO CHE SI SA DEL CLOUD. Le fette dei pezzi si chiamano col nome del
   pezzo e la sua impronta (`azioni.2026q4~abc123~0`), quindi una fetta letta
   una volta vale per sempre: se il pezzo cambia, cambia il nome. */
const fette = new Map<string, string>();
let revNota = 0;
/* i pezzi trovati nel cloud quando il documento principale non li elenca
   più (l'ha sovrascritto una scheda con la versione vecchia dell'app) */
let orfani: string[] | null = null;
/* la copia del documento vecchio (un JSON solo) presa prima di dividerlo */
let copiaVecchiaFatta = '';
/* l'istante da cui parte l'ultimo giro riuscito: quello che è cambiato
   dopo è quello che il cloud potrebbe non avere ancora */
let giroDa = 0;
/* il gettone dell'utente, tenuto pronto: quando la pagina si chiude non c'è
   tempo di chiederlo */
let gettonePronto = '';
function rinfrescaGettone(): void {
  const u = utenteFb;
  if (u && u.getIdToken) u.getIdToken().then(function (t) { gettonePronto = t; }, function () { /* resta quello di prima */ });
}

function log(liv: 'info' | 'avviso' | 'errore', msg: string, dati?: unknown): void {
  if (window.LMLog) window.LMLog.add(liv, 'cloud', msg, dati);
}
function leggi(k: string): string { try { return localStorage.getItem(k) || ''; } catch { return ''; } }
function scrivi(k: string, v: string): void { try { localStorage.setItem(k, v); } catch { /* senza memoria */ } }
function togli(k: string): void { try { localStorage.removeItem(k); } catch { /* niente */ } }
const CHI = 'lm-account-unito';            /* di quale account sono i dati qui */
const SOSPESO = 'lm-sospeso';              /* l'account con modifiche non ancora nel cloud */
const ULTIMA = 'lm-ultima-sincronia';      /* l'ultima volta che il cloud ha detto «ho tutto» */
const USCITA = 'lm-uscita-in-attesa';      /* «Esci» senza rete: si chiude appena il cloud ha tutto */

function emitAuth(extra?: Partial<StatoAuth>): void {
  window.LM_AUTH = Object.assign(
    { user: currentUser, available: true, syncing: false, ascolto: ascoltoAttivo } as StatoAuth,
    extra || {}
  );
  window.dispatchEvent(new CustomEvent('lm:auth'));
}

function emitUnavailable(): void {
  window.LM_AUTH = { user: null, available: false, syncing: false };
  window.LMCloud = { available: false, signIn: function () {}, signOut: function () {} };
  window.dispatchEvent(new CustomEvent('lm:auth'));
  nascondiAggiornamento();
}

/* «NON ANCORA NEL CLOUD», SEMPRE A VISTA. Sul computer lo dice la barra di
   lato; sul telefono la barra non c'è, e un avviso che sparisce dopo tre
   secondi non basta: chi chiude l'app deve poter vedere che l'ultima cosa
   non è ancora partita. Una pastiglia piccola, in alto, che non prende i
   tocchi e se ne va appena il cloud conferma. */
function pastiglia(state: StatoScrittura): void {
  const serve = state === 'attesa' && !!(currentUser || leggi(CHI));
  let p = document.getElementById('lm-non-ancora');
  if (!serve) { if (p) p.remove(); return; }
  if (p || !document.body) return;
  if (!document.getElementById('lm-non-ancora-stile')) {
    const st = document.createElement('style');
    st.id = 'lm-non-ancora-stile';
    st.textContent = '#lm-non-ancora{position:fixed;right:12px;top:max(10px,env(safe-area-inset-top));z-index:9997;pointer-events:none;' +
      'background:var(--superficie,#fff);color:var(--testo,#222);border:1px solid var(--bordo,#ddd);border-radius:999px;padding:4px 10px;' +
      'font:600 12px/1.3 system-ui,sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.12)}@media (min-width:861px){#lm-non-ancora{display:none}}';
    document.head.appendChild(st);
  }
  p = document.createElement('div');
  p.id = 'lm-non-ancora';
  p.setAttribute('role', 'status');
  p.textContent = 'Non ancora nel cloud';
  document.body.appendChild(p);
}

function emitSync(state: StatoScrittura, error?: string): void {
  pastiglia(state);
  const prec = window.LM_SYNC;
  if (prec && prec.state === state && (prec.error || '') === (error || '')) return;
  const at = (state === 'saved') ? Date.now() : (prec && prec.at) || 0;
  window.LM_SYNC = { state: state, error: error || '', at: at, inCoda: state === 'attesa' };
  window.dispatchEvent(new CustomEvent('lm:sync', { detail: window.LM_SYNC }));
}

/* --- una sola clessidra per tutte le operazioni cloud ---
   Le operazioni si contano: 'saving' si emette solo alla prima, l'esito
   solo quando l'ultima si chiude. Nessuna operazione resta senza esito. */
const ATTESA_MS = 6000;
const MUTO_MS = 25000;
let opAperte = 0;
/* all'apertura c'erano modifiche rimaste indietro dall'ultima volta */
let rimastoIndietro = false;
let tAttesa: ReturnType<typeof setTimeout> | null = null;
let tMuto: ReturnType<typeof setTimeout> | null = null;

function opInizio(che: string): void {
  opAperte++;
  log('info', 'operazione avviata: ' + che, 'in corso: ' + opAperte);
  if (opAperte > 1) return;
  /* senza rete non si finge di salvare: si dice subito «non ancora nel
     cloud»; e così pure all'apertura, se l'ultima volta qualcosa era rimasto
     indietro, finché il cloud non conferma */
  emitSync(navigator.onLine && !rimastoIndietro ? 'saving' : 'attesa');
  if (tAttesa) return;
  tAttesa = setTimeout(function () {
    log('avviso', 'il cloud non ha ancora confermato dopo ' + (ATTESA_MS / 1000) + 's', 'online: ' + navigator.onLine);
    emitSync('attesa');
  }, ATTESA_MS);
  tMuto = setTimeout(function () {
    if (!navigator.onLine) return;
    log('errore', 'cloud muto: online da ' + (MUTO_MS / 1000) + 's senza risposta');
    emitSync('muto', 'Il cloud non risponde da un po’. I tuoi dati sono al sicuro su questo dispositivo e partono appena risponde.');
  }, MUTO_MS);
}

function opFine(che: string, stato: StatoScrittura, error?: string): void {
  opAperte = Math.max(0, opAperte - 1);
  log(stato === 'saved' ? 'info' : 'avviso', 'operazione conclusa: ' + che + ' → ' + stato, error || '');
  if (opAperte > 0) return;
  if (tAttesa) clearTimeout(tAttesa);
  if (tMuto) clearTimeout(tMuto);
  tAttesa = tMuto = null;
  emitSync(stato, error);
}

function messaggio(e: unknown): string {
  if (e instanceof Error) return e.message;
  const f = e as ErroreFirebase | null;
  return (f && (f.message || f.code)) || '';
}
function codice(e: unknown): string { return ((e as ErroreFirebase | null)?.code || '') + ''; }
/* un errore che vuol dire «manca la rete», e non «c'è un guasto» */
function eRete(e: unknown): boolean {
  if (!navigator.onLine) return true;
  return /unavailable|offline|network|deadline-exceeded/i.test(codice(e) + ' ' + messaggio(e));
}

/* --------------------------------------------- «aggiornamento…» all'apertura
   Un dispositivo riaperto dopo giorni mostrava per un paio di secondi i dati
   vecchi, che poi cambiavano sotto gli occhi: una cosa fatta ieri sul
   telefono non c'era, poi c'era; una cancellata c'era, poi spariva. Adesso,
   se l'ultima volta che questo dispositivo ha parlato col cloud è lontana,
   finché non arriva l'aggiornamento si vede una fascia che lo dice, e i dati
   sotto restano sbiaditi. Senza rete, o se il cloud tarda, la fascia lo dice
   e si toglie: si lavora coi dati di qui, che poi si uniranno. */
let fasciaTimer: ReturnType<typeof setTimeout> | null = null;
function mostraAggiornamento(): void {
  if (document.getElementById('lm-aggiornamento')) return;
  const stile = document.createElement('style');
  stile.id = 'lm-aggiornamento-stile';
  stile.textContent = 'html.lm-aggiornando #app,html.lm-aggiornando main{opacity:.35;transition:opacity .3s}' +
    '#lm-aggiornamento{position:fixed;left:50%;top:max(12px,env(safe-area-inset-top));transform:translateX(-50%);z-index:9999;' +
    'background:var(--superficie,#fff);color:var(--testo,#222);border:1px solid var(--bordo,#ddd);border-radius:999px;' +
    'padding:8px 16px;font:600 14px/1.3 system-ui,sans-serif;box-shadow:0 4px 18px rgba(0,0,0,.15);max-width:calc(100vw - 32px);text-align:center}';
  document.head.appendChild(stile);
  const f = document.createElement('div');
  f.id = 'lm-aggiornamento';
  f.setAttribute('role', 'status');
  f.textContent = 'Aggiornamento dal cloud…';
  (document.body || document.documentElement).appendChild(f);
  document.documentElement.classList.add('lm-aggiornando');
  fasciaTimer = setTimeout(function () { nascondiAggiornamento('Il cloud tarda: per ora vedi i dati di questo dispositivo.'); }, 12000);
}
function nascondiAggiornamento(ultima?: string): void {
  if (fasciaTimer) { clearTimeout(fasciaTimer); fasciaTimer = null; }
  document.documentElement.classList.remove('lm-aggiornando');
  const f = document.getElementById('lm-aggiornamento');
  if (!f) return;
  if (ultima) { f.textContent = ultima; setTimeout(function () { f.remove(); }, 3500); }
  else f.remove();
}
(function () {
  const chi = leggi(CHI);
  if (!chi) return;
  const ultima = Number(leggi(ULTIMA)) || 0;
  /* le modifiche rimaste indietro l'ultima volta: si dice subito */
  if (leggi(SOSPESO) === chi) {
    sporco = true; rimastoIndietro = true; emitSync('attesa');
    if (!document.body) document.addEventListener('DOMContentLoaded', function () { if (window.LM_SYNC) pastiglia(window.LM_SYNC.state); });
  }
  if (Date.now() - ultima < 10 * 60 * 1000) return;
  if (!navigator.onLine) return;
  const via = function () { if (document.body) mostraAggiornamento(); else document.addEventListener('DOMContentLoaded', mostraAggiornamento); };
  via();
})();
window.addEventListener('offline', function () {
  if (document.getElementById('lm-aggiornamento')) nascondiAggiornamento('Senza rete: vedi i dati di questo dispositivo.');
});

/* --------------------------------------------------------------- l'avvio
   SE L'SDK NON ARRIVA (verifica del 25 novembre 2026, M6): rete che va e
   viene all'apertura, gstatic lento. Prima si provava una volta sola, e il
   cloud restava spento finché non si chiudeva l'app — sul telefono, ore.
   Adesso si riprova quando torna la rete, quando si torna sull'app e ogni
   minuto; e intanto le modifiche di un dispositivo che è di un account si
   segnano «non ancora nel cloud» lo stesso (vedi `lm:change` qui sotto).
   RIPROVARE VUOL DIRE RICARICARE LA PAGINA: il browser si ricorda che quel
   modulo non è arrivato, e un secondo `import()` dello stesso indirizzo
   fallisce senza nemmeno chiederlo (e l'SDK si importa da sé per indirizzo
   intero: non si può cambiare con un «?r=2»).
   CON TRE FRENI (verifica 3, N3 e N6). Prima si ricaricava ogni minuto,
   per sempre, anche per chi non ha l'account e anche quando l'SDK era
   arrivato ma non partiva (un browser troppo vecchio, un filtro); e la
   ricarica si portava via la review della sera scritta a metà, se in quel
   momento il dito era sulle stelline e non sul campo. Adesso:
     · solo se il dispositivo è di un account (un ospite il cloud non l'ha);
     · solo se l'errore era di rete (il modulo non è arrivato); se è
       arrivato e non parte, ricaricare non serve: si dice, una volta;
     · al massimo tre volte per sessione, dopo uno, cinque e quindici
       minuti; poi ci si ferma e si dice;
     · e solo se ricaricare non porta via niente: app a vista, nessun
       foglio o finestra aperti, nessun campo con dentro qualcosa di
       scritto. Se no, la striscia con «Ricarica» e decidi tu. */
let avvioInCorso = false;
let sdkFallito = false;
let sdkPerRete = false;
let sdkRiprova: ReturnType<typeof setInterval> | null = null;
const RICARICA_SDK = 'lm-ricarica-per-sdk';
const ATTESE_SDK = [60000, 5 * 60000, 15 * 60000];
function staiScrivendo(): boolean {
  const a = document.activeElement as HTMLElement | null;
  return !!a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || a.isContentEditable);
}
/* ricaricare adesso porta via qualcosa? */
function ricaricareSicuro(): boolean {
  if (document.hidden || staiScrivendo()) return false;
  const visibile = function (el: Element): boolean { return el.getClientRects().length > 0; };
  const sopra = document.querySelectorAll('.sheet-overlay, .overlay, .avviso-ovl, [role="dialog"], [role="alertdialog"], dialog[open]');
  for (let i = 0; i < sopra.length; i++) { const el = sopra[i]; if (el && !(el as HTMLElement).hidden && visibile(el)) return false; }
  const campi = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('textarea, input:not([type]), input[type="text"], input[type="search"], input[type="number"], input[type="time"], input[type="date"], input[type="url"], input[type="email"]');
  for (let i = 0; i < campi.length; i++) {
    const c = campi[i];
    if (c && c.value !== c.defaultValue && c.value !== '') return false;
  }
  if ((document.querySelector('[contenteditable="true"]') as HTMLElement | null)?.textContent) return false;
  return true;
}
function leggiRicariche(): { n: number; ts: number } {
  try { const v = JSON.parse(sessionStorage.getItem(RICARICA_SDK) || 'null'); if (v && typeof v.n === 'number') return v; } catch { /* niente */ }
  return { n: 0, ts: 0 };
}
function cloudFermo(testo: string): void {
  if (!document.body) { document.addEventListener('DOMContentLoaded', function () { cloudFermo(testo); }); return; }
  let d = document.getElementById('lm-cloud-fermo');
  if (d) { const s0 = d.querySelector('span'); if (s0) s0.textContent = testo; return; }
  d = document.createElement('div');
  d.id = 'lm-cloud-fermo';
  d.setAttribute('role', 'status');
  d.style.cssText = 'position:fixed;left:12px;right:12px;bottom:max(12px,env(safe-area-inset-bottom));z-index:9998;display:flex;gap:10px;align-items:center;' +
    'background:var(--superficie,#fff);color:var(--testo,#222);border:1px solid var(--bordo,#ddd);border-radius:14px;padding:10px 12px;' +
    'font:500 14px/1.35 system-ui,sans-serif;box-shadow:0 4px 18px rgba(0,0,0,.16);max-width:560px;margin:0 auto';
  const s = document.createElement('span');
  s.style.flex = '1';
  s.textContent = testo;
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = 'Ricarica';
  b.style.cssText = 'font:600 14px system-ui,sans-serif;padding:8px 14px;border-radius:999px;border:0;background:var(--accento,#3b6);color:#fff;cursor:pointer';
  b.addEventListener('click', function () { location.reload(); });
  const x = document.createElement('button');
  x.type = 'button';
  x.textContent = '×';
  x.setAttribute('aria-label', 'Chiudi');
  x.style.cssText = 'font:600 18px system-ui,sans-serif;padding:4px 8px;border:0;background:transparent;color:inherit;cursor:pointer';
  x.addEventListener('click', function () { if (d) d.remove(); });
  d.appendChild(s); d.appendChild(b); d.appendChild(x);
  document.body.appendChild(d);
}
function riprovaSdk(perche: string): void {
  if (FSM || avvioInCorso || !navigator.onLine) return;
  if (!sdkFallito) { void init(); return; }
  if (!sdkPerRete || !leggi(CHI)) return;
  const r = leggiRicariche();
  if (r.n >= ATTESE_SDK.length) return;
  if (Date.now() - r.ts < (ATTESE_SDK[r.n] || 60000)) return;
  void fetch(SDK + 'firebase-app.js', { mode: 'no-cors', cache: 'no-store' }).then(function () {
    if (FSM) return;
    if (!ricaricareSicuro()) {
      cloudFermo('Il cloud è di nuovo raggiungibile: ricarica la pagina quando hai finito, per salvare anche lì.');
      return;
    }
    log('info', 'l’SDK di Firebase adesso arriva: ricarico la pagina per accendere il cloud (' + perche + ', ' + (r.n + 1) + 'ª volta)');
    try { sessionStorage.setItem(RICARICA_SDK, JSON.stringify({ n: r.n + 1, ts: Date.now() })); } catch { /* niente */ }
    location.reload();
  }).catch(function () { /* ancora niente: la prossima volta */ });
}
function armaRiprovaSdk(): void {
  if (sdkRiprova) return;
  sdkRiprova = setInterval(function () { riprovaSdk('un minuto dopo'); }, 60000);
  window.addEventListener('online', function () { riprovaSdk('è tornata la rete'); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) riprovaSdk('sei tornato sull’app'); });
}
document.addEventListener('lm:change', function (e) {
  if (FSM || applyingRemote) return;
  if ((e as CustomEvent<unknown>).detail === 'ricarica') return;
  const chi = leggi(CHI);
  if (!chi) return;
  modifiche++;
  if (!sporco) { sporco = true; scrivi(SOSPESO, chi); }
  emitSync('attesa');
});
void init();
async function init(): Promise<void> {
  if (avvioInCorso || FSM) return;
  avvioInCorso = true;
  try {
    const [appMod, authMod, fsMod] = await Promise.all([
      import(/* @vite-ignore */ SDK + 'firebase-app.js') as Promise<ModuloApp>,
      import(/* @vite-ignore */ SDK + 'firebase-auth.js') as Promise<ModuloAuth>,
      import(/* @vite-ignore */ SDK + 'firebase-firestore.js') as Promise<ModuloFirestore>
    ]);
    AUTHM = authMod; FSM = fsMod;
    log('info', 'SDK Firebase caricato');

    const app: App = appMod.initializeApp(firebaseConfig);
    const autenticazione = authMod.getAuth(app);
    auth = autenticazione;
    /* IL CANALE LUNGO, DICHIARATO INVECE CHE SPERATO: su reti che non
       digeriscono lo streaming Firestore ripiega da sé sul «long polling».
       NIENTE `localCache`, ED È UNA SCELTA: la coda offline ce l'ha già
       LifeMax (lo stato in localStorage, unito al cloud a ogni giro), e due
       code che riconciliano gli stessi dati con regole diverse sono il modo
       di perderne. */
    try {
      db = fsMod.initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
      log('info', 'Firestore avviato', 'riconoscimento automatico del canale lungo attivo');
    } catch (e) {
      db = fsMod.getFirestore(app);
      log('avviso', 'Firestore avviato nel modo normale', messaggio(e));
    }
    const prov = new authMod.GoogleAuthProvider();
    prov.setCustomParameters({ prompt: 'select_account' });
    provider = prov;

    try { await authMod.setPersistence(autenticazione, authMod.browserLocalPersistence); } catch { /* ignora */ }

    window.LMCloud = {
      available: true,
      signIn: async function () {
        /* L'USCITA DI UN ALTRO, ANCORA A METÀ (verifica del 25 novembre 2026,
           M1). Mario è uscito mentre il cloud non rispondeva: la sua ultima
           modifica aspetta qui, e la sua sessione è rimasta aperta di
           nascosto per mandarla. Prima, se entrava Luigi, quella modifica si
           fermava sul PC finché Mario non tornava proprio lì. Adesso prima si
           prova a finire l'uscita di Mario; se il cloud ancora non risponde,
           si dice, e solo un secondo «Accedi» entra lo stesso (la modifica
           di Mario resta su questo dispositivo, per lui). */
        const sospesa = leggi(USCITA);
        if (sospesa && utenteFb && utenteFb.uid === sospesa) {
          await conTempo(completaUscita(utenteFb), 8000);
          if (leggi(USCITA) && Date.now() - avvisoUscitaAltrui > 120000) {
            avvisoUscitaAltrui = Date.now();
            document.dispatchEvent(new CustomEvent('lm:accesso-fallito', { detail: {
              titolo: 'Un momento',
              testo: 'Chi è uscito da qui poco fa ha ancora una modifica che non è arrivata nel cloud, e il cloud adesso non risponde. Parte da sola appena può: riprova fra poco. Se tocchi di nuovo «Accedi» entri lo stesso, e quella modifica resta su questo dispositivo finché quell’account non rientra.'
            } }));
            return;
          }
        }
        const partito = Date.now();
        try {
          await authMod.signInWithPopup(autenticazione, prov);
        } catch (e) {
          const cod = codice(e);
          log('avviso', 'accesso con Google non riuscito', cod + ' ' + messaggio(e));
          /* I MESSAGGI SONO PER CHI USA L'APP. Prima dicevano «aggiungi il
             dominio in Firebase: Authentication → Impostazioni…», cioè
             parlavano al programmatore. Il dettaglio tecnico resta nel
             Registro tecnico, qui sopra. */
          const dire = function (titolo: string, testo: string): void {
            document.dispatchEvent(new CustomEvent('lm:accesso-fallito', { detail: { titolo: titolo, testo: testo } }));
          };
          if (/unauthorized-domain/.test(cod)) {
            dire('Da qui l’accesso non è attivo',
              'Da questo indirizzo non si può ancora accedere con Google. Apri LifeMax da ' + DOMINIO + ' e accedi da lì: i tuoi dati ti aspettano.');
          } else if (/operation-not-allowed/.test(cod)) {
            dire('Accesso momentaneamente spento', 'L’accesso con Google in questo momento non è disponibile. I tuoi dati restano su questo dispositivo: riprova più tardi.');
          } else if (/popup-closed-by-user|cancelled-popup-request/.test(cod)) {
            /* la finestra di Google l'hai chiusa tu (anche subito: un
               ripensamento, un tocco sbagliato). Non è un errore, e non si
               porta la pagina intera da Google (verifica 2, m1). */
          } else if (/popup-blocked/.test(cod) && Date.now() - partito > 2500) {
            /* «bloccato» dopo averlo visto: chiuso da te */
          } else if (/popup/.test(cod)) {
            try { await authMod.signInWithRedirect(autenticazione, prov); } catch (e2) {
              log('avviso', 'anche il redirect non è partito', codice(e2));
              dire('Accesso non riuscito', 'Il browser ha chiuso la finestra di Google. Riprova; se succede ancora, apri LifeMax nel browser invece che dalla schermata Home.');
            }
          } else if (/network/.test(cod)) {
            dire('Niente rete', 'Per accedere serve la connessione. I tuoi dati restano su questo dispositivo.');
          } else {
            dire('Accesso non riuscito', 'Non è andata, e non per colpa tua. Riprova fra poco.');
          }
        }
      },
      signOut: esci,
      backups: elencaCopie,
      backupsVecchi: elencaCopieVecchie,
      riprendiBackup: function (id: string, vecchia?: boolean) { return daCopia(id, 'riprendi', !!vecchia); },
      sostituisciConBackup: function (id: string, vecchia?: boolean) { return daCopia(id, 'sostituisci', !!vecchia); },
      riprendiProfilo: function (id: string, vecchia?: boolean) { return daCopia(id, 'profilo', !!vecchia); },
      inSospeso: function () { return sporco; },
      svuota: function (ms?: number) { return conTempo(sincronizza('richiesta'), ms || 8000); },
      gettone: async function (forza?: boolean) {
        const u = utenteFb;
        if (!u || !u.getIdToken || !currentUser) return '';
        try { return await u.getIdToken(!!forza); } catch { return ''; }
      }
    };

    log('info', 'cloud pronto', 'progetto ' + firebaseConfig.projectId);

    try { await authMod.getRedirectResult(autenticazione); } catch (e) { log('avviso', 'esito del redirect di accesso non recuperato', messaggio(e)); }

    authMod.onAuthStateChanged(autenticazione, async function (u: UtenteFirebase | null) {
      fermaAscolto();
      utenteFb = u;
      if (u) {
        /* «Esci» senza rete, rimasto a metà: qui si finisce, senza mostrare niente */
        const inAttesa = leggi(USCITA);
        if (inAttesa && inAttesa === u.uid) { currentUser = null; emitAuth(); void completaUscita(u); return; }
        if (inAttesa) togli(USCITA);
        currentUser = { uid: u.uid, email: u.email || '', name: u.displayName || '', photo: u.photoURL || '' };
        uscitaVoluta = false; fineSessioneDetta = false;
        rinfrescaGettone();
        log('info', 'accesso riscontrato, avvio la prima sincronizzazione', 'uid ' + u.uid.slice(0, 6) + '…');
        emitAuth({ syncing: true });
        await misuraOrologio(u.uid);
        await primaSincronizzazione(u.uid);
        if (currentUser && currentUser.uid === u.uid) ascolta(u.uid);
        emitAuth({ syncing: false });
      } else {
        currentUser = null;
        ascoltoAttivo = false;
        if (riprovaTimer) { clearTimeout(riprovaTimer); riprovaTimer = null; }
        attesaRiprova = 0;
        const proprietario = leggi(CHI);
        if (proprietario && !uscitaVoluta) sessioneFinita(proprietario);
        uscitaVoluta = false;
        nascondiAggiornamento();
        log('info', 'nessun account connesso: i dati restano su questo dispositivo');
        emitAuth();
        emitSync('idle');
      }
    });

    /* ogni modifica locale va nel cloud: subito se non c'è un giro in corso,
       subito dopo se c'è */
    document.addEventListener('lm:change', function (e) {
      if (applyingRemote) return;
      /* il dispositivo riletto (un'altra scheda l'ha svuotato): non è una modifica */
      if ((e as CustomEvent<unknown>).detail === 'ricarica') return;
      modifiche++;
      if (!currentUser) return;
      if (!sporco) { sporco = true; scrivi(SOSPESO, currentUser.uid); }
      guardaProfilo();
      programmaSync();
    });

    if (sdkRiprova) { clearInterval(sdkRiprova); sdkRiprova = null; }
  } catch (e) {
    console.warn('LifeMax: cloud non disponibile, uso solo questo dispositivo.', messaggio(e));
    log('errore', 'SDK Firebase non caricato: si lavora solo in locale (riprovo)', messaggio(e));
    AUTHM = null; FSM = null;
    sdkFallito = true;
    /* arrivato o no? Un modulo che non arriva è un TypeError con queste
       parole (Chromium, Safari, Firefox); un SyntaxError vuol dire che è
       arrivato e questo browser non lo sa eseguire */
    sdkPerRete = !navigator.onLine || (e instanceof TypeError && /dynamically imported module|Importing a module script failed|error loading dynamically/i.test(messaggio(e)));
    emitUnavailable();
    if (leggi(CHI)) {
      const r = leggiRicariche();
      if (!sdkPerRete) cloudFermo('Il cloud non è partito su questo browser: le tue modifiche restano su questo dispositivo. Prova a ricaricare; se succede ancora, aggiorna il browser.');
      else if (r.n >= ATTESE_SDK.length) cloudFermo('Il cloud ancora non risponde: le tue modifiche restano su questo dispositivo. Ricarica quando la rete è buona.');
    }
    armaRiprovaSdk();
  } finally {
    avvioInCorso = false;
  }
}

/* ----------------------------------------------------- di chi sono i dati

   LA FUGA FRA ACCOUNT (problema 1 della verifica). Due strade portavano i
   dati di Mario nell'account di Luigi sullo stesso computer:
     · Firebase chiudeva la sessione da solo (account disabilitato, sessione
       revocata o scaduta, dati del browser cancellati) e l'app non se ne
       accorgeva: i dati di Mario restavano lì, e al primo accesso di Luigi
       si univano al suo account;
     · «Esci» in una scheda lasciava l'altra scheda dentro, coi dati, e alla
       sua prima modifica li riscriveva sul dispositivo.
   Adesso i dati sul dispositivo hanno un proprietario (`lm-account-unito`)
   e non si uniscono MAI con un account diverso. */
function sessioneFinita(proprietario: string): void {
  if (fineSessioneDetta) return;
  fineSessioneDetta = true;
  log('avviso', 'la sessione è stata chiusa da Firebase: svuoto il dispositivo', 'account ' + proprietario.slice(0, 6) + '…');
  /* quello che non era ancora nel cloud resta da parte, per quell'account
     soltanto: torna quando quell'account rientra qui */
  if (leggi(SOSPESO) === proprietario) window.LM.mettiDaParte(proprietario);
  togli(CHI); togli(SOSPESO);
  window.LM.lasciaAccount(proprietario);
  sporco = false;
  fette.clear(); orfani = null; revNota = 0;
  window.dispatchEvent(new CustomEvent('lm:sessione-finita'));
}

/* «Esci». Prima si prova a mandare quello che manca. Se non si riesce
   (niente rete), i dati si mettono da parte per questo account e si esce lo
   stesso dallo schermo — il dispositivo si svuota subito — ma la sessione
   resta aperta di nascosto finché il cloud non ha tutto: appena torna la
   rete, anche ad app riaperta, la modifica parte e solo allora si chiude.
   Prima, uscendo senza rete, l'ultima modifica restava solo nel backup
   locale e nel cloud non arrivava più. */
async function esci(): Promise<EsitoUscita> {
  const chi = currentUser;
  uscitaVoluta = true;
  let rinviata = false;
  if (chi) {
    const ok = sporco ? await conTempo(sincronizza('uscita'), 6000) : true;
    if (!ok || sporco) {
      window.LM.mettiDaParte(chi.uid);
      scrivi(USCITA, chi.uid);
      rinviata = true;
      log('avviso', 'esco senza aver mandato tutto: lo mando appena c’è rete, poi chiudo la sessione');
    }
  }
  fermaAscolto();
  currentUser = null;
  /* prima si dice alle altre schede che l'account non c'è più (smettono di
     sincronizzare), poi si svuota il dispositivo */
  togli(CHI); togli(SOSPESO);
  window.LM.lasciaAccount(chi ? chi.uid : '');
  sporco = false;
  fette.clear(); orfani = null; revNota = 0;
  emitAuth(); emitSync('idle');
  if (rinviata) {
    window.dispatchEvent(new CustomEvent('lm:uscita-in-attesa'));
    return 'in-attesa';
  }
  try { if (AUTHM && auth) await AUTHM.signOut(auth); } catch { /* ignora */ }
  return 'uscito';
}

/* la parte rimasta di un'uscita senza rete: manda la copia messa da parte,
   poi chiude la sessione. Niente si mostra sullo schermo. */
let uscitaInCorso = false;
let avvisoUscitaAltrui = 0;
async function completaUscita(u: UtenteFirebase): Promise<void> {
  if (uscitaInCorso) return;
  uscitaInCorso = true;
  try {
    const copia = window.LM.copiaDaParte(u.uid);
    if (copia) {
      await giro(u.uid, { locale: copia, soloCloud: true, email: u.email || '', name: u.displayName || '' });
      window.LM.scartaDaParte(u.uid);
      log('info', 'uscita completata: la modifica rimasta indietro è nel cloud');
    }
    togli(USCITA);
    uscitaVoluta = true;
    if (AUTHM && auth) await AUTHM.signOut(auth);
  } catch (e) {
    log('avviso', 'uscita ancora in attesa: il cloud non risponde', messaggio(e));
  } finally {
    uscitaInCorso = false;
  }
}

/* «Esci» in UN'ALTRA scheda: anche questa esce. Il dispositivo l'ha già
   svuotato l'altra (e dati.ts rilegge da sé: vedi GEN_KEY). */
window.addEventListener('storage', function (ev) {
  if (ev.key !== CHI) return;
  if (!currentUser || ev.newValue === currentUser.uid) return;
  log('info', 'uscita da un’altra scheda: esco anche qui');
  uscitaVoluta = true;
  fermaAscolto();
  currentUser = null;
  sporco = false;
  fette.clear(); orfani = null; revNota = 0;
  emitAuth(); emitSync('idle');
  if (AUTHM && auth) { const a = auth; void AUTHM.signOut(a).catch(function () { /* già fuori */ }); }
});

/* ------------------------------------------------ l'orologio del server
   Un documento piccolo per dispositivo (`users/{uid}/dispositivi/{id}`):
   si scrive l'ora del server, si rilegge, e la differenza con l'orologio di
   qui è lo scarto da correggere (vedi `adesso` in dati.ts). Senza, un
   dispositivo con l'orologio indietro faceva risorgere le cose cancellate. */
async function misuraOrologio(uid: string): Promise<void> {
  if (!FSM || !db) return;
  const fs = FSM, base = db;
  try {
    await conTempo((async function () {
      const ref = fs.doc(base, 'users', uid, 'dispositivi', window.LM.idDispositivo());
      const t0 = Date.now();
      await fs.setDoc(ref, { servito: fs.serverTimestamp(), visto: t0 });
      const d = await fs.getDoc(ref);
      const t1 = Date.now();
      const s = d.data() as { servito?: OraServer } | undefined;
      /* la misura vale solo se il giro è stato rapido: l'errore è al più
         metà del tempo di andata e ritorno */
      if (t1 - t0 < 3000 && s && s.servito && typeof s.servito.toMillis === 'function') {
        const scarto = s.servito.toMillis() - Math.round((t0 + t1) / 2);
        window.LM.impostaScarto(scarto);
        if (Math.abs(scarto) > 5000) log('avviso', 'l’orologio di questo dispositivo è sfasato di ' + Math.round(scarto / 1000) + ' s: lo correggo nei dati');
      }
      return true;
    })(), 5000);
  } catch (e) { log('avviso', 'non riesco a misurare l’orologio', messaggio(e)); }
}

/* ------------------------------------------------ la prima sincronizzazione */
async function primaSincronizzazione(uid: string): Promise<void> {
  if (!FSM || !db) return;
  /* DI CHI SONO I DATI QUI. Di un altro account: si mettono da parte per
     lui (se aveva modifiche non ancora nel cloud) e il dispositivo si svuota.
     Non si uniscono mai. */
  const proprietario = leggi(CHI);
  if (proprietario && proprietario !== uid) {
    log('avviso', 'qui c’erano i dati di un altro account: li tolgo prima di entrare');
    if (leggi(SOSPESO) === proprietario) window.LM.mettiDaParte(proprietario);
    togli(CHI); togli(SOSPESO);
    window.LM.lasciaAccount(proprietario);
  }
  let giaUnito = leggi(CHI) === uid;
  /* QUI C'È L'ESEMPIO: CONTA SOLO L'ACCOUNT. L'esempio va in un backup di
     questo dispositivo e si prende quello che c'è nell'account. */
  const eraEsempio = window.LM.lasciaEsempio(giaUnito, uid);
  if (eraEsempio) log('info', 'qui c’erano i dati di esempio', 'messi da parte: conta solo l’account');
  else if (!giaUnito) {
    window.LM.primaUnione(uid);
    log('info', 'prima unione da questo dispositivo', 'esempio tenuto fuori, azzeramento locale non applicato al cloud');
  }
  /* quello che era rimasto da parte per questo account (un'uscita senza
     rete, una sessione chiusa con modifiche non ancora arrivate) torna qui
     e da qui va nel cloud. È roba dell'account: il dispositivo conta come
     già unito. */
  if (window.LM.riprendiDaParte(uid)) {
    log('info', 'ripreso quello che era rimasto da parte per questo account');
    giaUnito = true;
    sporco = true;
  }
  primaFusione = giaUnito ? null : { nuovo: true };
  /* tutti i pezzi in una volta sola, fuori dalla transazione: dentro, ogni
     lettura è un giro di rete */
  await precarica(uid);
  /* UN DISPOSITIVO NUOVO PER QUESTO ACCOUNT: prima di unire, una copia del
     cloud com'è adesso, anche se oggi ce n'è già una (verifica 2, m11). La
     copia del giorno si prende al primo salvataggio della giornata, e non
     contiene quello che si è scritto dopo: se proprio questa prima unione
     rovinasse il profilo, «Riprendi il profilo» deve avere da dove
     riprenderlo. */
  const ok = await sincronizza('prima sincronizzazione', giaUnito ? undefined : { motivoCopia: 'primo-accesso-di-un-dispositivo' });
  if (ok) {
    const restoEsempio = window.LM.contaEsempio();
    if (restoEsempio > 0) window.dispatchEvent(new CustomEvent('lm:esempio-nell-account', { detail: restoEsempio }));
  }
}

async function precarica(uid: string): Promise<void> {
  if (!FSM || !db) return;
  try {
    const q = await conTempo(FSM.getDocs(FSM.collection(db, 'users', uid, 'pezzi')), 15000);
    if (!q) return;
    const migliori: Record<string, { h: string; rev: number; n: number; parti: Record<number, string> }> = {};
    const tutte: Record<string, { h: string; rev: number; n: number; parti: Record<number, string> }> = {};
    q.forEach(function (d) {
      const v = d.data();
      if (!v || typeof v.data !== 'string' || typeof v.nome !== 'string' || typeof v.h !== 'string') return;
      fette.set(v.nome + '~' + v.h + '~' + (v.i || 0), v.data);
      const k = v.nome + '~' + v.h;
      const g = tutte[k] || (tutte[k] = { h: v.h, rev: Number(v.rev) || 0, n: Number(v.n) || 1, parti: {} });
      g.parti[Number(v.i) || 0] = v.data;
    });
    /* i pezzi «orfani»: per ogni nome, la versione completa più recente */
    Object.keys(tutte).forEach(function (k) {
      const g = tutte[k]; if (!g) return;
      const nome = k.slice(0, k.indexOf('~'));
      for (let i = 0; i < g.n; i++) if (g.parti[i] === undefined) return;
      const m = migliori[nome];
      if (!m || g.rev > m.rev) migliori[nome] = g;
    });
    orfani = Object.keys(migliori).sort().map(function (n) {
      const g = migliori[n]; if (!g) return '';
      let t = ''; for (let i = 0; i < g.n; i++) t += g.parti[i] || '';
      return t;
    }).filter(Boolean);
    log('info', 'pezzi nel cloud letti in blocco', q.size !== undefined ? q.size + ' fette' : '');
  } catch (e) {
    log('avviso', 'non riesco a leggere i pezzi in blocco: li leggo uno per uno', messaggio(e));
  }
}

/* ------------------------------------------------------------ il giro

   UN GIRO = una transazione: legge il cloud, unisce, scrive solo se serve.
   Se due dispositivi fanno il giro insieme, il secondo che arriva trova il
   documento cambiato e Firestore gli fa rifare tutto da capo con quello
   nuovo: nessuno dei due scrive sopra all'altro senza averlo letto. */
class DaFareFuori extends Error {
  cosa: 'copia-vecchia' | 'troppe-fette' | 'orfani';
  dati: unknown;
  constructor(cosa: 'copia-vecchia' | 'troppe-fette' | 'orfani', dati?: unknown) { super(cosa); this.cosa = cosa; this.dati = dati; }
}

interface EsitoGiro {
  unito: Stato; pezzi: Record<string, Pezzo>; scritto: boolean; copia: Record<string, unknown> | null;
  vecchi: Record<string, VocePezzo>; rev: number; scrittore: string; vecchio: string;
}
interface OpzGiro { locale?: Stato; soloCloud?: boolean; motivoCopia?: string; email?: string; name?: string }

function nomeFetta(nome: string, h: string, i: number): string { return nome + '~' + h + '~' + i; }

/* le fette di un pezzo: dalla memoria se le abbiamo, se no dal cloud */
async function testoPezzo(tx: Transazione, uid: string, nome: string, v: VocePezzo): Promise<string | null> {
  if (!FSM || !db) return null;
  let t = '';
  for (let i = 0; i < v.n; i++) {
    const k = nomeFetta(nome, v.h, i);
    let f = fette.get(k);
    if (f === undefined) {
      const d = await tx.get(FSM.doc(db, 'users', uid, 'pezzi', k));
      const x = d.exists() ? d.data() : undefined;
      if (!x || typeof x.data !== 'string') return null;
      f = x.data;
      fette.set(k, f);
    }
    t += f;
  }
  return t;
}

/* il cloud com'è adesso, ricomposto */
async function leggiCloud(tx: Transazione, uid: string, m: DatiDocumento | null): Promise<Record<string, unknown> | null> {
  if (!m) return null;
  let testi: string[] = [];
  const voci = (m.schema === SCHEMA && m.pezzi && typeof m.pezzi === 'object') ? m.pezzi : null;
  if (voci) {
    const nomi = Object.keys(voci).sort();
    for (const n of nomi) {
      const v = voci[n];
      if (!v) continue;
      const t = await testoPezzo(tx, uid, n, v);
      /* UN PEZZO CHE NON SI LEGGE non vuol dire «vuoto»: si va avanti senza,
         e unire senza un pezzo non toglie niente (quello che manca da una
         parte resta). Quello che c'è qui lo riscriverà. */
      if (t === null) { log('errore', 'un pezzo del cloud non si legge: vado avanti senza', n); continue; }
      testi.push(t);
    }
  } else if (typeof m.data === 'string') {
    /* il documento principale non elenca i pezzi: o non ci sono mai stati
       (dati della versione di prima, da dividere adesso), o una scheda con
       la versione vecchia l'ha sovrascritto. I pezzi, se ci sono, si
       recuperano da soli. */
    if (orfani === null) throw new DaFareFuori('orfani');
    testi = orfani;
  }
  let s: Record<string, unknown> | null = testi.length ? ricomponi(testi) : null;
  if (s && typeof m.updatedAt === 'number') s['updatedAt'] = m.updatedAt;
  /* la posta lasciata dalle pagine che si sono chiuse: si unisce */
  if (m.posta && typeof m.posta === 'object') {
    Object.keys(m.posta).forEach(function (dev) {
      const d = parseJson(String((m.posta as Record<string, string>)[dev] || ''));
      if (!d) return;
      s = s ? (window.LM.unisci(s, d) as unknown as Record<string, unknown>) : d;
      log('info', 'unita la posta lasciata da un dispositivo che si chiudeva', dev);
    });
  }
  return s;
}

function parseJson(t: string): Record<string, unknown> | null {
  try { const v = JSON.parse(t); return (v && typeof v === 'object' && !Array.isArray(v)) ? v : null; } catch { return null; }
}

function opzioniFusione(): { nuovo?: 'a'; assenzaLunga?: { da: number } } {
  const o: { nuovo?: 'a'; assenzaLunga?: { da: number } } = {};
  if (primaFusione && primaFusione.nuovo) o.nuovo = 'a';
  const ultima = Number(leggi(ULTIMA)) || 0;
  if (!o.nuovo && ultima && Date.now() - ultima > ASSENZA_LUNGA_MS) o.assenzaLunga = { da: ultima };
  return o;
}

/* UNA RICHIESTA APPESA NON FERMA PIÙ TUTTO (verifica 4, V4-03). In metro o
   su un Wi-Fi «che c'è ma non va» una richiesta parte e non torna mai, e
   Firestore alla lettura dentro la transazione non mette un tempo massimo:
   il giro restava in corso per sempre, `sincronizza` accodava tutti gli
   altri a quello, e niente partiva più — nemmeno a rete tornata buona,
   finché non si ricaricava la pagina.
   Adesso un giro ha un tempo massimo (`tempoGiro`, che raddoppia a ogni
   giro scaduto fino a quattro minuti, per non tagliare un caricamento
   grande su una rete lenta, e torna giù al primo giro riuscito); scaduto,
   lo si LASCIA: è un errore di rete come gli altri (stato «attesa», nuovo
   tentativo), e il giro dopo apre richieste nuove. Quando la rete torna, o
   si torna sull'app, un giro in corso da un po' si lascia subito.
   Il giro lasciato, se un giorno risponde, non fa più niente: `lasciato`
   gli dice di non scrivere nel cloud (si controlla prima delle scritture
   della transazione, e Firestore rifà la funzione se intanto il documento
   è cambiato) e di non toccare questo dispositivo dopo. */
const TEMPO_GIRO_MS = 40000;
const TEMPO_GIRO_MAX = 4 * 60000;
let tempoGiro = TEMPO_GIRO_MS;
let lasciaGiro: ((perche: string) => void) | null = null;
let giroPartito = 0;
interface Lasciato { si: boolean }
class GiroLasciato extends Error {
  constructor(perche: string) { super('il cloud non risponde (deadline-exceeded): ' + perche); }
}
function entroIlTempo(p: Promise<void>, ms: number, lasciato: Lasciato): Promise<void> {
  return new Promise(function (ok, no) {
    let finito = false;
    const chiudi = function (e?: unknown) {
      if (finito) return;
      finito = true; clearTimeout(t); lasciaGiro = null;
      if (e) no(e); else ok();
    };
    const t = setTimeout(function () {
      lasciato.si = true;
      tempoGiro = Math.min(tempoGiro * 2, TEMPO_GIRO_MAX);
      chiudi(new GiroLasciato('nessuna risposta in ' + Math.round(ms / 1000) + ' s'));
    }, ms);
    lasciaGiro = function (perche: string) { lasciato.si = true; chiudi(new GiroLasciato(perche)); };
    giroPartito = Date.now();
    p.then(function () { chiudi(); }, function (e) { chiudi(e || new Error('giro non riuscito')); });
  });
}
/* un giro in corso da più di `ms`: si lascia, e se ne fa uno nuovo */
function lasciaSeAppeso(ms: number, perche: string): void {
  if (lasciaGiro && Date.now() - giroPartito > ms) {
    log('avviso', 'il giro in corso non risponde da ' + Math.round((Date.now() - giroPartito) / 1000) + ' s: lo lascio e ne faccio uno nuovo', perche);
    lasciaGiro(perche);
  }
}

async function giro(uid: string, o: OpzGiro, lasciato?: Lasciato): Promise<void> {
  const seLasciato = function () { if (lasciato && lasciato.si) throw new GiroLasciato('giro vecchio, lasciato'); };
  if (!FSM || !db) throw new Error('cloud non avviato');
  const inizio = window.LM.adesso() - 1;
  const fs = FSM, base = db;
  const rifPrincipale = fs.doc(base, 'users', uid);
  const locale = (o.locale || window.LM.snapshotPerCloud()) as Stato;
  const opzU = o.soloCloud ? {} : opzioniFusione();
  const primaQui = o.soloCloud ? null : dividi(locale);
  /* la «generazione» del dispositivo all'inizio del giro: se nel frattempo
     il dispositivo è stato svuotato (uscita, sessione finita, un'altra
     scheda), il risultato di questo giro è di un account che qui non c'è
     più, e NON si rimette sul dispositivo */
  const gen0 = window.LM.generazione();
  const caricati = new Set<string>();
  for (let tentativo = 0; tentativo < 4; tentativo++) {
    seLasciato();
    const tenuto: { e: EsitoGiro | null } = { e: null };
    const scrittore = 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    try {
      await fs.runTransaction(base, async function (tx) {
        seLasciato();
        tenuto.e = null;
        const snap = await tx.get(rifPrincipale);
        const m = snap.exists() ? (snap.data() || {}) : null;
        if (m && Number(m.versioneMinima) > VERSIONE_APP) throw new VersioneVecchia();
        let remoto = await leggiCloud(tx, uid, m);
        /* IL DOCUMENTO DELLA VERSIONE DI PRIMA (un JSON solo): si unisce, e
           da qui in poi i dati stanno nei pezzi. Prima di toccarlo se ne
           prende una copia di sicurezza, che si fa fuori dalla transazione. */
        const vecchio = (m && typeof m.data === 'string') ? m.data : '';
        if (vecchio) {
          if (copiaVecchiaFatta !== hash(vecchio)) throw new DaFareFuori('copia-vecchia', vecchio);
          const v = parseJson(vecchio);
          if (v) {
            if (typeof m?.updatedAt === 'number' && typeof v['updatedAt'] !== 'number') v['updatedAt'] = m.updatedAt;
            remoto = remoto ? (window.LM.unisci(remoto, v) as unknown as Record<string, unknown>) : v;
          }
        }
        const unito = window.LM.normalizza(remoto ? window.LM.unisci(locale, remoto, opzU) : JSON.parse(JSON.stringify(locale)));
        /* l'impronta dei dati di esempio non va nel cloud e non torna di qua:
           tornando, la fusione la sostituirebbe con il «niente» del cloud, e
           l'esempio caricato qui smetterebbe di essere riconosciuto — finendo
           nell'account alla scrittura dopo */
        delete unito.esempio;
        const pezzi = dividi(unito);
        const vecchi: Record<string, VocePezzo> = (m && m.schema === SCHEMA && m.pezzi) ? m.pezzi : {};
        const nuovaRev = ((m && Number(m.rev)) || 0) + 1;
        const nomi = Object.keys(pezzi);
        const cambiati = nomi.some(function (n) { const v = vecchi[n], p = pezzi[n]; return !v || !p || v.h !== p.h; }) ||
          Object.keys(vecchi).some(function (n) { return !pezzi[n]; });
        const serve = !m || m.schema !== SCHEMA || !!vecchio || cambiati || !!(m.posta && Object.keys(m.posta).length);
        const daCaricare = nomi.filter(function (n) {
          const v = vecchi[n], p = pezzi[n];
          return !!p && (!v || v.h !== p.h) && !caricati.has(n + '~' + p.h);
        });
        let quanteFette = 0;
        daCaricare.forEach(function (n) { const p = pezzi[n]; if (p) quanteFette += affetta(p.testo).length; });
        if (serve && quanteFette > 300) throw new DaFareFuori('troppe-fette', daCaricare.map(function (n) { return pezzi[n]; }));
        const ora = Date.now();
        /* la copia del giorno (o quella chiesta prima di un ripristino). Il
           documento di prima ha già avuto la sua, appena presa qui sopra. */
        const copiaDovuta = serve && !!remoto && !vecchio && (!!o.motivoCopia || ora - Number((m && m.ultimaCopia) || 0) > COPIA_OGNI_MS);
        /* un giro lasciato nel frattempo non scrive (V4-03) */
        if (lasciato && lasciato.si) throw new GiroLasciato('giro vecchio, lasciato');
        if (serve) {
          daCaricare.forEach(function (n) {
            const p = pezzi[n]; if (!p) return;
            const parti = affetta(p.testo);
            parti.forEach(function (t, i) {
              tx.set(fs.doc(base, 'users', uid, 'pezzi', nomeFetta(n, p.h, i)), { data: t, nome: n, h: p.h, i: i, n: parti.length, rev: nuovaRev });
            });
          });
          const elenco: Record<string, VocePezzo> = {};
          nomi.forEach(function (n) { const p = pezzi[n]; if (p) elenco[n] = { h: p.h, n: affetta(p.testo).length }; });
          tx.set(rifPrincipale, {
            schema: SCHEMA, rev: nuovaRev, scrittore: scrittore,
            updatedAt: Number(unito.updatedAt) || ora,
            pezzi: elenco,
            email: o.email !== undefined ? o.email : (currentUser ? currentUser.email : ''),
            name: o.name !== undefined ? o.name : (currentUser ? currentUser.name : ''),
            servito: fs.serverTimestamp(),
            ultimaCopia: (copiaDovuta || vecchio) ? ora : Number((m && m.ultimaCopia) || 0),
            avviso: AVVISO_SCHEMA,
            versioneMinima: Math.max(Number((m && m.versioneMinima) || 0), VERSIONE_MINIMA)
          });
        }
        tenuto.e = { unito: unito, pezzi: pezzi, scritto: serve, copia: copiaDovuta ? remoto : null, vecchi: vecchi,
          rev: serve ? nuovaRev : Number((m && m.rev) || 0), scrittore: scrittore, vecchio: vecchio };
      });
    } catch (e) {
      if (e instanceof DaFareFuori) {
        if (e.cosa === 'orfani') { await precarica(uid); if (orfani === null) orfani = []; continue; }
        if (e.cosa === 'copia-vecchia') {
          const t = String(e.dati || '');
          const v = parseJson(t);
          if (v) await scriviCopia(uid, v, 'prima-di-dividere-il-documento');
          copiaVecchiaFatta = hash(t);
          log('info', 'documento della versione di prima messo da parte: adesso lo divido in pezzi');
          continue;
        }
        if (e.cosa === 'troppe-fette') {
          /* tanti pezzi nuovi in una volta (la prima divisione di un documento
             grande): le fette si caricano prima, fuori dalla transazione. Si
             può, perché il loro nome contiene la loro impronta: finché il
             documento principale non le nomina, non le legge nessuno. */
          await caricaFette(uid, (e.dati as Pezzo[]) || [], caricati);
          continue;
        }
      }
      throw e;
    }
    /* lasciato mentre aspettava: quello che ha letto è vecchio, e qui non
       si tocca niente (V4-03) */
    seLasciato();
    const fatto = tenuto.e;
    if (!fatto) return;
    /* quello che si sa adesso del cloud */
    const elenco: Record<string, VocePezzo> = {};
    Object.keys(fatto.pezzi).forEach(function (n) {
      const p = fatto.pezzi[n]; if (!p) return;
      const parti = affetta(p.testo);
      parti.forEach(function (t, i) { fette.set(nomeFetta(n, p.h, i), t); });
      elenco[n] = { h: p.h, n: parti.length };
    });
    revNota = fatto.rev;
    if (!o.soloCloud) giroDa = inizio;
    if (fatto.scritto) {
      ricordaScrittura(fatto.scrittore);
      if (fatto.vecchio) orfani = null;
      void sparecchia(uid, fatto.vecchi, elenco);
      log('info', 'cloud aggiornato', Object.keys(elenco).filter(function (n) { const v = fatto.vecchi[n], x = elenco[n]; return !v || !x || v.h !== x.h; }).length + ' pezzi riscritti su ' + Object.keys(elenco).length);
    }
    if (fatto.copia) {
      const c = fatto.copia;
      void scriviCopia(uid, c, o.motivoCopia || 'copia-del-giorno').then(function () { return potaCopie(uid); });
    }
    const ancoraQui = !!currentUser && currentUser.uid === uid && window.LM.generazione() === gen0;
    if (!o.soloCloud && !ancoraQui) log('avviso', 'il giro è finito dopo un cambio d’account: il risultato resta nel cloud e non torna qui');
    if (!o.soloCloud && ancoraQui) {
      /* il risultato torna anche qui: unito (non sostituito) con quello che
         c'è adesso, perché durante il giro si può aver toccato qualcosa */
      applyingRemote = true;
      try { window.LM.hydrate(fatto.unito); } finally { applyingRemote = false; }
      profiloNoto = firmaProfilo().firma;
      /* dal cloud è arrivato qualcosa che qui non c'era? */
      const arrivato = !!primaQui && Object.keys(fatto.pezzi).some(function (n) { const a = primaQui[n], b = fatto.pezzi[n]; return !a || !b || a.h !== b.h; });
      if (arrivato) window.dispatchEvent(new CustomEvent('lm:remote'));
    }
    return;
  }
  throw new Error('il giro non si chiude: troppi tentativi');
}

/* le fette che nessuno nomina più: via, senza aspettare (se non si riesce
   restano lì, e non fanno danni: nessuno le legge) */
async function sparecchia(uid: string, vecchi: Record<string, VocePezzo>, nuovi: Record<string, VocePezzo>): Promise<void> {
  if (!FSM || !db) return;
  const fs = FSM, base = db;
  const via: string[] = [];
  Object.keys(vecchi).forEach(function (n) {
    const v = vecchi[n], x = nuovi[n];
    if (!v || (x && x.h === v.h)) return;
    for (let i = 0; i < v.n; i++) via.push(nomeFetta(n, v.h, i));
  });
  if (!via.length) return;
  try {
    for (let i = 0; i < via.length; i += 400) {
      const b = fs.writeBatch(base);
      via.slice(i, i + 400).forEach(function (k) { b.delete(fs.doc(base, 'users', uid, 'pezzi', k)); fette.delete(k); });
      await b.commit();
    }
  } catch (e) { log('avviso', 'non riesco a togliere le fette vecchie (non fa danni)', messaggio(e)); }
}

async function caricaFette(uid: string, pezzi: Pezzo[], caricati: Set<string>): Promise<void> {
  if (!FSM || !db) return;
  const fs = FSM, base = db;
  const scritture: { k: string; d: object }[] = [];
  pezzi.forEach(function (p) {
    if (!p) return;
    const parti = affetta(p.testo);
    parti.forEach(function (t, i) { scritture.push({ k: nomeFetta(p.nome, p.h, i), d: { data: t, nome: p.nome, h: p.h, i: i, n: parti.length, rev: revNota + 1 } }); });
  });
  for (let i = 0; i < scritture.length; i += 200) {
    const b = fs.writeBatch(base);
    scritture.slice(i, i + 200).forEach(function (s) { b.set(fs.doc(base, 'users', uid, 'pezzi', s.k), s.d); });
    await b.commit();
  }
  pezzi.forEach(function (p) { if (p) caricati.add(p.nome + '~' + p.h); });
  log('info', 'caricate in anticipo ' + scritture.length + ' fette');
}

/* ------------------------------------------------ chi chiede un giro

   Subito, se non ce n'è uno in corso; appena finito, se c'è. Prima ogni
   modifica aspettava sette decimi di secondo, e una raffica seguita dalla
   chiusura dell'app non arrivava mai. */
let ultimaPartenza = 0;
function programmaSync(): void {
  /* un gesto isolato parte subito; dentro una raffica (l'ultimo giro è
     partito da meno di due secondi) si aspetta che la raffica finisca, e
     diventa una scrittura sola invece di dieci */
  const soli = Date.now() - ultimaPartenza > 2000;
  if (syncTimer) { if (soli) return; clearTimeout(syncTimer); }
  syncTimer = setTimeout(function () {
    syncTimer = null; ultimaPartenza = Date.now();
    const motivo = copiaProfilo; copiaProfilo = '';
    void sincronizza('modifica', motivo ? { motivoCopia: motivo } : undefined);
  }, soli ? 30 : 700);
}

/* PRIMA DI CAMBIARE IL NOME O LA VISIONE, UNA COPIA DEL CLOUD (verifica 3,
   N11; era m11). La copia del giorno si prende al primo salvataggio della
   giornata: un profilo rovinato lo stesso giorno, dopo, non c'era in
   nessuna copia, e «Riprendi il profilo» non aveva da dove riprenderlo.
   Nome e visione cambiano di rado: quando cambiano (e prima c'erano), il
   giro dopo prende una copia del cloud com'era — col profilo di prima. */
let profiloNoto: string | null = null;
let copiaProfilo = '';
function firmaProfilo(): { firma: string; pieno: boolean } {
  try {
    const p = window.LM.load().profilo as unknown as Record<string, unknown>;
    const nome = String(p['nome'] || ''), visione = String(p['visione'] || '');
    return { firma: nome + '\u0000' + visione, pieno: !!(nome || visione) };
  } catch { return { firma: '', pieno: false }; }
}
function guardaProfilo(): void {
  const f = firmaProfilo();
  if (profiloNoto !== null && f.firma !== profiloNoto && profiloNoto.replace('\u0000', '') !== '') copiaProfilo = 'prima-di-cambiare-il-profilo';
  profiloNoto = f.firma;
}

function sincronizza(motivo: string, opz?: OpzGiro): Promise<boolean> {
  if (!currentUser || !FSM || !db) return Promise.resolve(false);
  const uid = currentUser.uid;
  if (syncInCorso && syncDi !== uid) {
    /* c'è ancora in giro il giro di un altro account (uscito da poco, magari
       senza rete): si aspetta che finisca e si parte da capo per questo */
    const prima = syncInCorso;
    return prima.then(function () { return sincronizza(motivo, opz); });
  }
  if (syncInCorso) { syncPendente = true; return syncInCorso; }
  syncDi = uid;
  if (riprovaSyncTimer) { clearTimeout(riprovaSyncTimer); riprovaSyncTimer = null; }
  rinfrescaGettone();
  syncInCorso = (async function () {
    opInizio('sincronizzazione (' + motivo + ')');
    let giri = 0;
    try {
      do {
        syncPendente = false;
        const quante = modifiche;
        const lasciato: Lasciato = { si: false };
        await entroIlTempo(giro(uid, opz || {}, lasciato), tempoGiro, lasciato);
        tempoGiro = TEMPO_GIRO_MS;
        opz = undefined;
        if (!currentUser || currentUser.uid !== uid) break;
        /* la prima unione è riuscita: da qui in poi questo dispositivo è
           dell'account */
        if (primaFusione) primaFusione = null;
        scrivi(CHI, uid);
        scrivi(ULTIMA, String(Date.now()));
        if (modifiche === quante) { sporco = false; togli(SOSPESO); }
        else syncPendente = true;
        giri++;
      } while (syncPendente && giri < 6);
      attesaSync = 0;
      rimastoIndietro = false;
      nascondiAggiornamento();
      opFine('sincronizzazione', 'saved');
      if (leggi(USCITA) && utenteFb) void completaUscita(utenteFb);
      return true;
    } catch (e) {
      if (e instanceof VersioneVecchia) {
        /* niente nuovi tentativi: questa versione non deve scrivere. Le
           modifiche restano qui e partono dopo «Ricarica». */
        log('avviso', 'nel cloud c’è una versione dell’app più nuova di questa: non scrivo, chiedo di ricaricare');
        versioneNuova();
        nascondiAggiornamento();
        opFine('sincronizzazione', 'error', TESTO_VERSIONE);
        return false;
      }
      const rete = eRete(e);
      log(rete ? 'avviso' : 'errore', 'sincronizzazione non riuscita', codice(e) + ' ' + messaggio(e));
      if (rete) nascondiAggiornamento('Senza rete: vedi i dati di questo dispositivo.');
      else nascondiAggiornamento();
      opFine('sincronizzazione', rete ? 'attesa' : 'error', rete ? '' : erroreLeggibile(e));
      /* si riprova da sé, con attese che raddoppiano: la rete torna, le
         regole si sistemano, un intoppo passa */
      attesaSync = attesaSync ? Math.min(attesaSync * 2, rete ? 60000 : 300000) : (rete ? 5000 : 15000);
      riprovaSyncTimer = setTimeout(function () { riprovaSyncTimer = null; if (sporco || syncPendente) void sincronizza('nuovo tentativo'); }, attesaSync);
      return false;
    } finally {
      syncInCorso = null;
    }
  })();
  return syncInCorso;
}

function conTempo<T>(p: Promise<T>, ms: number): Promise<T | false> {
  return new Promise(function (ok) {
    let fatto = false;
    const t = setTimeout(function () { if (!fatto) { fatto = true; ok(false); } }, ms);
    p.then(function (v) { if (!fatto) { fatto = true; clearTimeout(t); ok(v); } },
      function () { if (!fatto) { fatto = true; clearTimeout(t); ok(false); } });
  });
}

/* ------------------------------------------------ le copie di sicurezza

   Una copia è lo stato intero di com'era il cloud, in fette sotto
   `users/{uid}/copie/{id}/parti/`, con un documento piccolo che la descrive
   (quando, quanti elementi, il nome nel profilo). Elencarle vuol dire
   leggere solo i documenti piccoli: prima, per aprire «Backup», si
   scaricavano tutte intere — cinque megabyte dopo dieci riaperture.
   Si fanno al massimo una volta al giorno (più quelle prima di un
   ripristino), e ne restano le ultime trenta. */
async function scriviCopia(uid: string, stato: Record<string, unknown>, motivo: string): Promise<void> {
  if (!FSM || !db) return;
  const fs = FSM, base = db;
  try {
    const testo = JSON.stringify(stato);
    const parti = affetta(testo);
    const id = String(Date.now()) + '-' + Math.random().toString(36).slice(2, 6);
    const prof = (stato['profilo'] && typeof stato['profilo'] === 'object') ? stato['profilo'] as Record<string, unknown> : {};
    const b = fs.writeBatch(base);
    parti.forEach(function (t, i) { b.set(fs.doc(base, 'users', uid, 'copie', id, 'parti', String(i)), { data: t }); });
    b.set(fs.doc(base, 'users', uid, 'copie', id), {
      ts: Number(stato['updatedAt']) || Date.now(), salvato: Date.now(), motivo: motivo,
      ricchezza: window.LM.ricchezza(stato), n: parti.length,
      nome: String(prof['nome'] || ''), visione: String(prof['visione'] || '').slice(0, 120), schema: SCHEMA
    });
    await b.commit();
    log('info', 'copia di sicurezza nel cloud', motivo + ' · ' + Math.round(testo.length / 1024) + ' KB');
  } catch (e) { log('avviso', 'copia di sicurezza nel cloud non riuscita', messaggio(e)); }
}

async function potaCopie(uid: string): Promise<void> {
  if (!FSM || !db) return;
  const fs = FSM, base = db;
  try {
    const q = await fs.getDocs(fs.collection(base, 'users', uid, 'copie'));
    const tutte: { id: string; salvato: number; n: number }[] = [];
    q.forEach(function (d) { const v = d.data() || {}; tutte.push({ id: d.id, salvato: Number(v.salvato) || 0, n: Number(v.n) || 0 }); });
    tutte.sort(function (a, b) { return b.salvato - a.salvato; });
    const via = tutte.slice(COPIE_DA_TENERE);
    if (!via.length) return;
    const b = fs.writeBatch(base);
    via.forEach(function (c) {
      for (let i = 0; i < c.n; i++) b.delete(fs.doc(base, 'users', uid, 'copie', c.id, 'parti', String(i)));
      b.delete(fs.doc(base, 'users', uid, 'copie', c.id));
    });
    await b.commit();
    log('info', 'copie di sicurezza nel cloud sfoltite', via.length + ' tolte, ne restano ' + COPIE_DA_TENERE);
  } catch (e) { log('avviso', 'non riesco a sfoltire le copie nel cloud', messaggio(e)); }
}

async function elencaCopie(): Promise<CopiaNelCloud[]> {
  if (!currentUser || !FSM || !db) return [];
  try {
    const q = await FSM.getDocs(FSM.collection(db, 'users', currentUser.uid, 'copie'));
    const out: CopiaNelCloud[] = [];
    q.forEach(function (d) {
      const v = d.data() || {};
      out.push({ id: d.id, ts: Number(v.ts) || 0, salvato: Number(v.salvato) || 0, ricchezza: Number(v.ricchezza) || 0,
        nome: String(v.nome || ''), visione: String(v.visione || ''), motivo: String(v.motivo || '') });
    });
    return out.sort(function (a, b) { return (b.salvato || b.ts) - (a.salvato || a.ts); });
  } catch (e) {
    log('errore', 'non riesco a leggere le copie nel cloud', messaggio(e));
    return [];
  }
}

/* LE COPIE DELLA VERSIONE DI PRIMA (users/{uid}/backups): intere, una per
   documento. Sono lì da mesi e possono essere tante e pesanti, quindi si
   leggono solo a richiesta. È qui che sta il profilo di prima, per chi se
   l'è visto azzerare da un dispositivo nuovo. */
async function elencaCopieVecchie(): Promise<CopiaNelCloud[]> {
  if (!currentUser || !FSM || !db) return [];
  try {
    const q = await FSM.getDocs(FSM.collection(db, 'users', currentUser.uid, 'backups'));
    const out: CopiaNelCloud[] = [];
    q.forEach(function (d) {
      const v = d.data() || {};
      const s = parseJson(String(v.data || ''));
      const prof = (s && s['profilo'] && typeof s['profilo'] === 'object') ? s['profilo'] as Record<string, unknown> : {};
      out.push({ id: d.id, ts: Number(v.updatedAt) || +d.id || 0, salvato: Number(v.salvato) || 0, ricchezza: s ? window.LM.ricchezza(s) : 0,
        nome: String(prof['nome'] || ''), visione: String(prof['visione'] || '').slice(0, 120), vecchia: true });
    });
    return out.sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
  } catch (e) {
    log('errore', 'non riesco a leggere le copie vecchie nel cloud', messaggio(e));
    return [];
  }
}

async function leggiCopia(uid: string, id: string, vecchia: boolean): Promise<Record<string, unknown> | null> {
  if (!FSM || !db) return null;
  if (vecchia) {
    const d = await FSM.getDoc(FSM.doc(db, 'users', uid, 'backups', id));
    const v = d.exists() ? d.data() : undefined;
    return v && typeof v.data === 'string' ? parseJson(v.data) : null;
  }
  const d = await FSM.getDoc(FSM.doc(db, 'users', uid, 'copie', id));
  const v = d.exists() ? d.data() : undefined;
  if (!v) return null;
  let t = '';
  for (let i = 0; i < (Number(v.n) || 0); i++) {
    const p = await FSM.getDoc(FSM.doc(db, 'users', uid, 'copie', id, 'parti', String(i)));
    const x = p.exists() ? p.data() : undefined;
    if (!x || typeof x.data !== 'string') return null;
    t += x.data;
  }
  return parseJson(t);
}

/* una copia dal cloud: unita, messa al posto di tutto, o solo il profilo */
async function daCopia(id: string, modo: 'riprendi' | 'sostituisci' | 'profilo', vecchia: boolean): Promise<boolean> {
  if (!currentUser) return false;
  try {
    const obj = await leggiCopia(currentUser.uid, String(id), vecchia);
    if (!obj) return false;
    if (modo === 'profilo') {
      if (!window.LM.riprendiProfilo(obj['profilo'])) return false;
    } else {
      /* senza la copia di com'è adesso non si tocca niente (verifica 4, V4-02) */
      if (!window.LM.copiaPrima(modo === 'sostituisci' ? 'prima-di-sostituire-con-una-copia-dal-cloud' : 'prima-di-riprendere-una-copia-dal-cloud')) return false;
      if (window.LM.scordaPunti) window.LM.scordaPunti();
      if (modo === 'sostituisci') window.LM.ripristinaStato(obj); else window.LM.riprendiCopia(obj);
    }
    /* e prima di toccare il cloud, una copia di com'era */
    await sincronizza('copia ripresa', { motivoCopia: 'prima-di-' + (modo === 'profilo' ? 'riprendere-il-profilo' : modo === 'sostituisci' ? 'sostituire-con-una-copia' : 'riprendere-una-copia') });
    return true;
  } catch (e) {
    log('errore', 'non riesco a usare la copia dal cloud', messaggio(e));
    return false;
  }
}

/* ==================================================================
   L'ASCOLTO DEGLI ALTRI DISPOSITIVI, E COSA SUCCEDE QUANDO CADE
   ==================================================================
   `onSnapshot` prende due funzioni: una per i dati, una per gli errori.
   Quella degli errori è il certificato di morte dell'ascolto: Firestore non
   lo riattacca. Qui si dice (nel Registro tecnico), si riattacca da sé con
   attese che raddoppiano fino a un minuto, e si riprova SUBITO quando torna
   la rete o quando si torna sull'app.
   Si ascolta solo il documento principale, che è piccolo: quando cambia, e
   non l'abbiamo cambiato noi, si fa un giro — che legge i pezzi cambiati,
   unisce, e rimanda su quello che il cloud non ha. */
function fermaAscolto(): void {
  if (unsubDoc) { try { unsubDoc(); } catch { /* niente */ } unsubDoc = null; }
  ascoltoAttivo = false;
}
function ascolta(uid: string): void {
  if (!FSM || !db) return;
  const fs = FSM, base = db;
  fermaAscolto();
  if (riprovaTimer) { clearTimeout(riprovaTimer); riprovaTimer = null; }
  try {
    unsubDoc = fs.onSnapshot(fs.doc(base, 'users', uid), function (snap: Documento) {
      attesaRiprova = 0;
      if (!ascoltoAttivo) { ascoltoAttivo = true; emitAuth(); }
      if (!snap.exists()) return;
      const d = snap.data();
      if (!d) return;
      if (Number(d.versioneMinima) > VERSIONE_APP) { versioneNuova(); return; }
      /* la nostra scrittura confermata. (L'ora del server che porta NON si
         usa per correggere l'orologio: arriva quando arriva — dopo un buco
         di rete anche molto dopo — e scambiare quel ritardo per un orologio
         sbagliato faceva datare le modifiche successive nel passato.) */
      const nostra = !!d.scrittore && mieScritture.has(d.scrittore) && typeof d.data !== 'string' && !(d.posta && Object.keys(d.posta).length);
      if (nostra) return;
      const conPosta = !!(d.posta && Object.keys(d.posta).length);
      if (typeof d.data !== 'string' && !conPosta && Number(d.rev) === revNota && revNota > 0) return;
      if (typeof d.data === 'string') {
        log('avviso', 'una versione vecchia dell’app ha scritto nel cloud: unisco e rimetto a posto');
        orfani = null;
      } else {
        log('info', 'il cloud è cambiato da un altro dispositivo: sincronizzo', 'rev ' + d.rev);
      }
      void sincronizza('dal cloud');
    }, function (err) {
      ascoltoAttivo = false;
      unsubDoc = null;
      cadute++;
      log('errore', 'l’ascolto degli altri dispositivi si è interrotto (' + cadute + 'ª volta)',
        (err && err.code ? err.code + ' · ' : '') + ((err && err.message) || ''));
      emitAuth();
      riattacca(uid);
    });
    ascoltoAttivo = true;
    log('info', 'ascolto in tempo reale attivo');
    emitAuth();
  } catch (e) {
    ascoltoAttivo = false;
    log('errore', 'non riesco a mettermi in ascolto', messaggio(e));
    emitAuth();
    riattacca(uid);
  }
}

function riattacca(uid: string): void {
  if (riprovaTimer) return;
  attesaRiprova = attesaRiprova ? Math.min(attesaRiprova * 2, 60000) : 2000;
  log('avviso', 'riprovo a mettermi in ascolto fra ' + Math.round(attesaRiprova / 1000) + ' secondi');
  riprovaTimer = setTimeout(function () {
    riprovaTimer = null;
    if (currentUser && currentUser.uid === uid) {
      ascolta(uid);
      /* mentre era sordo può essere cambiato qualcosa: un giro lo dice */
      void sincronizza('ascolto riattaccato');
    }
  }, attesaRiprova);
}

function riprovaSubito(perche: string): void {
  if (!currentUser || ascoltoAttivo) return;
  log('info', 'riprovo l’ascolto subito: ' + perche);
  attesaRiprova = 0;
  ascolta(currentUser.uid);
  void sincronizza(perche);
}

/* L'APP CHE SI CHIUDE SUBITO DOPO UNA MODIFICA. Sul telefono «chiudere» è
   mandare l'app in secondo piano: il browser lo dice (`visibilitychange`,
   `pagehide`) e per qualche istante la pagina vive ancora. È lì che si
   manda quello che manca, senza aspettare. Se non fa in tempo, la modifica
   resta segnata come «non ancora nel cloud» e parte alla prossima apertura. */
/* C'È UNA VERSIONE NUOVA: una striscia in alto con «Ricarica». Non si
   ricarica da sola: potresti essere a metà di una frase. */
const TESTO_VERSIONE = 'C’è una versione nuova di LifeMax: ricarica la pagina per continuare a salvare nel cloud. Le tue modifiche restano su questo dispositivo.';
function versioneNuova(perche?: 'pagina'): void {
  if (!document.body || document.getElementById('lm-versione-nuova')) return;
  const d = document.createElement('div');
  d.id = 'lm-versione-nuova';
  d.setAttribute('role', 'alert');
  d.style.cssText = 'position:fixed;left:12px;right:12px;top:max(10px,env(safe-area-inset-top));z-index:9998;display:flex;gap:10px;align-items:center;' +
    'background:var(--superficie,#fff);color:var(--testo,#222);border:1px solid var(--bordo,#ddd);border-radius:14px;padding:10px 12px;' +
    'font:500 14px/1.35 system-ui,sans-serif;box-shadow:0 4px 18px rgba(0,0,0,.16);max-width:560px;margin:0 auto';
  const s = document.createElement('span');
  s.style.flex = '1';
  s.textContent = perche === 'pagina' ? 'È uscita una versione nuova di LifeMax.' : TESTO_VERSIONE;
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = 'Ricarica';
  b.style.cssText = 'font:600 14px system-ui,sans-serif;padding:8px 14px;border-radius:999px;border:0;background:var(--accento,#3b6);color:#fff;cursor:pointer';
  b.addEventListener('click', function () { location.reload(); });
  d.appendChild(s); d.appendChild(b);
  document.body.appendChild(d);
}
/* e per le schede aperte da giorni: ogni tanto (tornando sull'app, al
   massimo ogni dieci minuti) si chiede index.html al server e si guarda se
   nomina lo stesso pacco di questa pagina. Se no, è uscita una versione
   nuova. */
let versioneGuardata = 0;
function guardaVersione(): void {
  const mio = document.querySelector('script[src*="pacco/index-"]') as HTMLScriptElement | null;
  if (!mio || !navigator.onLine || Date.now() - versioneGuardata < 10 * 60000) return;
  versioneGuardata = Date.now();
  const nome = (mio.getAttribute('src') || '').replace(/^.*pacco\//, '');
  void fetch('index.html', { cache: 'no-store' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (h) {
    const m = /pacco\/(index-[\w-]+\.js)/.exec(h || '');
    if (m && m[1] !== nome) { log('info', 'sul server c’è una versione nuova dell’app', m[1]); versioneNuova('pagina'); }
  }).catch(function () { /* senza rete: si riguarda la prossima volta */ });
}
setInterval(function () { if (!document.hidden) guardaVersione(); }, 30 * 60000);

document.addEventListener('visibilitychange', function () {
  if (document.hidden) { if (currentUser && sporco) void sincronizza('l’app va in secondo piano'); return; }
  guardaVersione();
  lasciaSeAppeso(15000, 'sei tornato sull’app');
  riprovaSubito('sei tornato sull’app');
  if (currentUser && (sporco || !ascoltoAttivo)) void sincronizza('sei tornato sull’app');
});
window.addEventListener('pagehide', function () {
  if (!currentUser || !sporco) return;
  void sincronizza('la pagina si chiude');
  imbuca(currentUser.uid);
});

/* LA CASSETTA DELLE LETTERE. Una pagina che si chiude (la scheda chiusa sul
   computer) non ha il tempo di fare un giro intero: il giro parte, ma la
   pagina muore prima della risposta. Ha però il tempo di mandare UNA
   richiesta, che il browser porta a termine anche a pagina chiusa
   (`keepalive`). Si manda quello che è cambiato dall'ultimo giro riuscito
   (`cambiateDopo` in dati.ts), piccolo, dentro al documento principale,
   nel campo `posta.<dispositivo>` — senza toccare nient'altro di quel
   documento. Il primo giro di qualunque dispositivo la unisce e la toglie.
   Se non parte (pagina troppo carica, gettone scaduto, un browser che non
   lo permette) non si perde niente: la modifica resta «non ancora nel
   cloud» e parte alla prossima apertura. */
function imbuca(uid: string): void {
  try {
    if (!gettonePronto || primaFusione) return;
    const base = (window as unknown as { __LM_FIRESTORE_REST?: string }).__LM_FIRESTORE_REST ||
      ('https://firestore.googleapis.com/v1/projects/' + firebaseConfig.projectId + '/databases/(default)/documents');
    const delta = JSON.stringify(window.LM.cambiateDopo(Math.max(0, giroDa - 5000)));
    if (delta.length > 55000) { log('avviso', 'la pagina si chiude: troppe modifiche per la cassetta delle lettere, partiranno alla prossima apertura'); return; }
    const dev = window.LM.idDispositivo().replace(/[^A-Za-z0-9_]/g, '_');
    const nome = base.slice(base.indexOf('projects/')) + '/users/' + uid;
    const corpo = {
      writes: [{
        update: { name: nome, fields: {
          posta: { mapValue: { fields: { [dev]: { stringValue: delta } } } },
          scrittore: { stringValue: 'posta-' + dev + '-' + Date.now().toString(36) }
        } },
        updateMask: { fieldPaths: ['posta.' + dev, 'scrittore'] },
        currentDocument: { exists: true }
      }]
    };
    void fetch(base + ':commit', {
      method: 'POST', keepalive: true,
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + gettonePronto },
      body: JSON.stringify(corpo)
    }).catch(function () { /* resta in sospeso: parte alla prossima apertura */ });
    log('info', 'la pagina si chiude: modifiche imbucate', Math.round(delta.length / 1024) + ' KB');
  } catch (e) { log('avviso', 'non riesco a imbucare le modifiche', messaggio(e)); }
}

window.addEventListener('offline', function () {
  if (currentUser && sporco) emitSync('attesa');
});
window.addEventListener('online', function () {
  if (currentUser) {
    log('info', 'rete tornata: riprovo il salvataggio'); attesaSync = 0;
    /* un giro partito quando la rete non andava è appeso a una connessione
       morta: si lascia, e il prossimo apre richieste nuove (V4-03) */
    lasciaSeAppeso(3000, 'è tornata la rete');
    /* l'orologio si rimisura a ogni ritorno della rete (M7): prima, poi il giro */
    const u = currentUser.uid;
    void misuraOrologio(u).then(function () { return sincronizza('è tornata la rete'); });
  }
  else if (leggi(USCITA) && utenteFb) void completaUscita(utenteFb);
  riprovaSubito('è tornata la rete');
});

/* GLI ERRORI DETTI A CHI USA L'APP. Prima: «Permessi Firestore negati:
   pubblica le regole di sicurezza», «attivalo nella console Firebase» —
   parole per il programmatore. Il codice tecnico resta nel Registro. */
function erroreLeggibile(e: unknown): string {
  const c = codice(e) + ' ' + messaggio(e);
  if (/unauthenticated/i.test(c)) return 'La sessione è scaduta: accedi di nuovo per salvare nel cloud. I dati restano su questo dispositivo.';
  if (/permission-denied|insufficient/i.test(c)) return 'Il cloud in questo momento non accetta il salvataggio. I tuoi dati sono al sicuro su questo dispositivo; riprovo da solo.';
  if (/resource-exhausted|too large|exceeds/i.test(c)) return 'Il cloud è troppo pieno per questo salvataggio. I tuoi dati sono al sicuro su questo dispositivo: esporta una copia da Impostazioni.';
  if (/unavailable|not-found|database/i.test(c)) return 'Il cloud non è raggiungibile. I tuoi dati sono al sicuro su questo dispositivo e partono appena possibile.';
  return 'Il salvataggio nel cloud non è riuscito. I tuoi dati sono al sicuro su questo dispositivo; riprovo da solo.';
}

void auth; void provider; void AUTHM;
