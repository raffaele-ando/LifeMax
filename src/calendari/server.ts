/* ============================================================
   I CALENDARI ATTRAVERSO LA SENTINELLA (sentinella/, nel Worker).

   Quando il Worker ha i suoi segreti e hai fatto l'accesso a LifeMax con
   Google, i permessi di Google e Microsoft non stanno più nel browser:
   li tiene la sentinella, cifrati, e li rinnova da sola. Da qui cambiano
   quattro cose, e sono le quattro che prima erano limiti:
     · niente più «Ricollega» ogni ora (Google) o ogni giorno (Microsoft);
     · niente più «Collega anche qui» su ogni dispositivo: il collegamento è
       del tuo account, non del browser;
     · lo SPECCHIO del calendario arriva fino a più di un anno avanti, e le
       viste della Giornata lo mostrano tutto;
     · la sentinella guarda il calendario e ritenta le modifiche anche ad
       app chiusa.

   Questo file è il «fornitore» che parla con la sentinella invece che con
   Google: lo stesso contratto di google.ts e microsoft.ts (fornitore.ts),
   quindi l'algoritmo di sincronia.ts — chi ha ragione, le cancellazioni, i
   doppioni — è ESATTAMENTE quello di prima. Cambia solo da dove arrivano gli
   eventi (dallo specchio, in un colpo) e dove vanno le modifiche (alla coda
   della sentinella, che le fa una volta sola anche se arrivano due volte).

   QUANDO NON C'È. Se il Worker non risponde, o risponde «non configurato»,
   o non hai fatto l'accesso a LifeMax, si resta nel browser come sempre:
   google.ts e microsoft.ts, invariati.
   ============================================================ */
import type { Fornitore, EventoRemoto, CalendarioRemoto, Scrittura } from './fornitore';
import { ErroreCalendario, conOrario, istante, piuGiorni, SENZA_TITOLO, invitoDa } from './fornitore';
import type { Provenienza, Giorno } from '../tipi/stato';
import { giorno } from '../tipi/stato';

/* un evento come lo tiene la sentinella (sentinella/fornitori.mjs) */
export interface Neutro {
  p: Provenienza; c: string; id: string;
  t?: string; tg?: boolean; di?: string; df?: string; i?: number; f?: number;
  v?: string; via?: boolean; fuori?: boolean; org?: boolean; altri?: boolean;
}
export interface ContoServer {
  servizio: boolean; collegato: boolean; revocato: boolean; email: string;
  calendari: CalendarioRemoto[];
}
/* una modifica da riportare nel calendario, come la vuole la coda */
export interface OpServer {
  p: Provenienza;
  tipo: 'aggiorna' | 'togli' | 'crea';
  c: string;
  id?: string;
  w?: Scrittura;
  testo?: string;
  tempo?: Required<Scrittura>['tempo'];
  chiave?: string;
}

/* L'INDIRIZZO. Dal sito vero è lo stesso indirizzo dell'app; da GitHub
   Pages (l'altra porta dello stesso sito) si va su quello vero. */
function base(): string {
  return /\.github\.io$/.test(location.hostname) ? 'https://lifemax.theproject.world/api/calendari/' : location.origin + '/api/calendari/';
}

/* ------------------------------------------------------- c'è la sentinella?
   Si chiede una volta per visita, e la risposta si ricorda: all'apertura
   l'app deve sapere SUBITO quale strada prendere, senza aspettare la rete. */
const SERV_KEY = 'lifemax.calendari.servizio';
let servizio: Record<Provenienza, boolean> = (function () {
  try { const v = JSON.parse(localStorage.getItem(SERV_KEY) || 'null') as Record<Provenienza, boolean> | null; if (v) return { google: !!v.google, microsoft: !!v.microsoft }; } catch { /* niente */ }
  return { google: false, microsoft: false };
})();
let chiesto: Promise<void> | null = null;
export function controllaServizio(): Promise<void> {
  if (chiesto) return chiesto;
  chiesto = (async function () {
    try {
      const r = await fetch(base() + 'stato', { cache: 'no-store' });
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json() as { servizio?: Record<string, boolean> };
      if (!j || !j.servizio) throw new Error('forma');
      servizio = { google: !!j.servizio['google'], microsoft: !!j.servizio['microsoft'] };
      try { localStorage.setItem(SERV_KEY, JSON.stringify(servizio)); } catch { /* vale per questa visita */ }
    } catch {
      /* nessuna sentinella (le prove, un sito servito altrove) o niente rete:
         si tiene quello che si sapeva, e se non si sapeva niente, il browser */
    }
  })();
  return chiesto;
}

function connesso(): boolean {
  return !!(window.LM_AUTH && window.LM_AUTH.user) && !!(window.LMCloud && window.LMCloud.gettone);
}
/* LA DOMANDA DI TUTTO IL FILE: questo calendario passa dalla sentinella? */
export function viaServer(p: Provenienza): boolean { return !!servizio[p] && connesso(); }

/* -------------------------------------------------------------- il gettone */
let gett = { t: '', scade: 0 };
function scadenza(t: string): number {
  try {
    const c = JSON.parse(atob((t.split('.')[1] || '').replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number };
    return (c.exp || 0) * 1000;
  } catch { return 0; }
}
async function gettone(forza: boolean): Promise<string> {
  if (!forza && gett.t && gett.scade > Date.now() + 60000) return gett.t;
  const cloud = window.LMCloud;
  const t = cloud && cloud.gettone ? await cloud.gettone(forza) : '';
  gett = { t: t, scade: scadenza(t) };
  return t;
}
/* quello che c'è già, senza aspettare niente: serve mentre l'app si chiude */
function gettoneSubito(): string { return gett.t && gett.scade > Date.now() + 30000 ? gett.t : ''; }

/* ---------------------------------------------------------------- la rete */
interface Risposta { errore?: string; [k: string]: unknown }
async function manda<T>(via: string, corpo: Record<string, unknown>, keepalive?: boolean): Promise<T & Risposta> {
  for (let giro = 0; giro < 2; giro++) {
    const t = await gettone(giro > 0);
    if (!t) throw new ErroreCalendario('token', 'Per tenere il calendario allineato serve l’accesso a LifeMax con Google.');
    let r: Response;
    try {
      /* text/plain: una richiesta «semplice», senza domanda preliminare del
         browser — che una keepalive, mentre l'app si chiude, non sempre fa */
      r = await fetch(base() + via, { method: 'POST', cache: 'no-store', keepalive: !!keepalive,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify(Object.assign({}, corpo, { gettone: t })) });
    } catch {
      throw new ErroreCalendario('rete', 'Niente rete, o LifeMax non risponde.');
    }
    const j = await r.json().catch(function () { return {}; }) as T & Risposta;
    if (r.status === 401 && j.errore === 'gettone' && giro === 0) continue;
    if (r.ok) return j;
    const e = j.errore || '';
    if (e === 'revocato' || e === 'token' || e === 'gettone') throw new ErroreCalendario('token', 'Il permesso del calendario non vale più.', r.status);
    if (e === 'rete' || r.status >= 500 || e === 'non-configurato') throw new ErroreCalendario('rete', 'Il calendario adesso non risponde: riprovo fra poco.', r.status);
    if (e === 'permesso') throw new ErroreCalendario('permesso', 'Il calendario non permette di cambiare questo evento.', r.status);
    if (e === 'sparito') throw new ErroreCalendario('sparito', 'L’evento non c’è più.', r.status);
    throw new ErroreCalendario('altro', 'La sentinella ha risposto ' + r.status + (e ? ' (' + e + ')' : '') + '.', r.status);
  }
  throw new ErroreCalendario('token', 'Per tenere il calendario allineato serve l’accesso a LifeMax con Google.');
}

/* ================================================================ LO SPECCHIO
   Una copia, qui, dello specchio della sentinella: gli eventi dei calendari
   accesi fino a più di un anno avanti. Sta in localStorage e NON nei dati che
   vanno nel cloud — il documento di Firestore ha un tetto di 1 MB, e un anno
   di riunioni non deve mangiarselo. Si aggiorna chiedendo solo «cosa è
   cambiato dopo il numero tale». */
interface Specchio {
  uid: string; seq: number; accesi: string;
  ev: Record<string, Neutro>;
  conti: Partial<Record<Provenienza, ContoServer>>;
  finestra: number;
}
const SP_KEY = 'lifemax.calendari.specchio';
let sp: Specchio | null = null;
let versione = 0;
function uid(): string { const u = window.LM_AUTH && window.LM_AUTH.user; return u ? u.uid : ''; }
function vuoto(u: string): Specchio { return { uid: u, seq: 0, accesi: '', ev: {}, conti: {}, finestra: 0 }; }
export function specchio(): Specchio {
  const u = uid();
  if (!sp) { try { sp = JSON.parse(localStorage.getItem(SP_KEY) || 'null') as Specchio | null; } catch { sp = null; } }
  /* un altro account su questo dispositivo: lo specchio del primo non vale */
  if (!sp || sp.uid !== u) { sp = vuoto(u); versione++; }
  return sp;
}
function salva(): void {
  versione++;
  try { if (sp) localStorage.setItem(SP_KEY, JSON.stringify(sp)); } catch { /* resta in memoria per questa visita */ }
}
export function versioneSpecchio(): number { return versione; }
export function contoServer(p: Provenienza): ContoServer | undefined { return specchio().conti[p]; }

export async function aggiornaSpecchio(accesi: Partial<Record<Provenienza, string[]>>): Promise<void> {
  const s = specchio();
  const firma = JSON.stringify(accesi);
  /* calendari accesi o spenti da quando si è chiesto l'ultima volta: si
     riparte da zero, così non resta niente di un calendario spento */
  const dopo = firma === s.accesi ? s.seq : 0;
  const j = await manda<{ seq: number; completo: boolean; eventi: Neutro[]; conti: Record<Provenienza, ContoServer>; finestra: number }>('cambi', { dopo: dopo, accesi: accesi });
  if (j.completo) s.ev = {};
  (j.eventi || []).forEach(function (n) {
    const k = n.p + '|' + n.c + '|' + n.id;
    if (n.fuori) delete s.ev[k];
    else s.ev[k] = n;
  });
  s.seq = j.seq || 0;
  s.accesi = firma;
  s.conti = j.conti || {};
  s.finestra = j.finestra || 0;
  salva();
}

/* fin dove arriva lo specchio, da oggi */
export function orizzonteSpecchio(): number { const s = specchio(); return s.finestra ? Date.now() + s.finestra : 0; }

/* -------------------------------------------- dalla forma neutra a quella di qui */
export function daNeutro(n: Neutro): EventoRemoto {
  const testo = (n.t || '').trim() || SENZA_TITOLO;
  const invito = invitoDa(n.org !== false, !!n.altri);
  if (n.tg && n.di) {
    const da = giorno(n.di);
    const a: Giorno = n.df ? giorno(n.df) : piuGiorni(da, 1);
    return { id: n.id, testo: testo, data: da, ora: null, durata: null, versione: n.v || '', tuttoIlGiorno: true,
      inizio: istante(da, null), fine: istante(a, null), via: !!n.via, invito: invito };
  }
  const i = n.i || 0, f = n.f || i;
  const t = conOrario(i, f);
  return { id: n.id, testo: testo, data: t.data, ora: t.ora, durata: t.durata, versione: n.v || '', tuttoIlGiorno: false,
    inizio: i, fine: f, via: !!n.via, invito: invito };
}

/* tutti gli eventi dello specchio (non cancellati) di un fornitore */
export function eventiSpecchio(): { p: Provenienza; c: string; n: Neutro }[] {
  const s = specchio();
  return Object.keys(s.ev).map(function (k) { const n = s.ev[k] as Neutro; return { p: n.p, c: n.c, n: n }; })
    .filter(function (x) { return !x.n.via && (x.n.tg ? !!x.n.di : x.n.i !== undefined); });
}
export function eventoSpecchio(p: Provenienza, c: string, id: string): Neutro | undefined { return specchio().ev[p + '|' + c + '|' + id]; }

/* ================================================================ LA CODA
   LA CHIAVE di una modifica nasce da quello che chiede: la stessa modifica
   (mandata mentre l'app si chiude, e di nuovo dal giro normale) ha la
   stessa chiave, e la sentinella la fa una volta sola. */
function impronta(s: string): string {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
export function chiaveOp(op: OpServer): string {
  const s = JSON.stringify([op.tipo, op.p, op.c, op.id || '', op.w || null, op.testo || '', op.tempo || null, op.chiave || '']);
  return 'lm' + impronta(s) + impronta(s + '|') + s.length.toString(36);
}

interface Esito { ok: boolean; tipo?: string; conflitto?: boolean; e?: Omit<Neutro, 'p' | 'c'> }
async function scrivi(op: OpServer): Promise<EventoRemoto | null> {
  const k = chiaveOp(op);
  const j = await manda<{ esiti: Record<string, Esito> }>('scrivi', { ops: [Object.assign({ k: k }, op)] }, true);
  const e = j.esiti && j.esiti[k];
  if (!e) throw new ErroreCalendario('rete', 'La modifica non è arrivata: riprovo fra poco.');
  if (!e.ok) {
    const t = e.tipo === 'sparito' || e.tipo === 'permesso' || e.tipo === 'token' || e.tipo === 'rete' ? e.tipo : 'altro';
    throw new ErroreCalendario(t, t === 'rete' ? 'Il calendario adesso non risponde: la sentinella riprova da sola.' : 'Il calendario non ha accettato la modifica.');
  }
  if (!e.e) return null;
  const n: Neutro = Object.assign({ p: op.p, c: op.c }, e.e) as Neutro;
  specchio().ev[op.p + '|' + op.c + '|' + n.id] = n;
  salva();
  const ev = daNeutro(n);
  if (e.conflitto) ev.conflitto = true;
  return ev;
}

/* MENTRE L'APP SI CHIUDE. Le modifiche partono tutte insieme, in una
   richiesta `keepalive`: il browser la porta a termine anche se la pagina
   non c'è più. Nessuna attesa, nessuna risposta letta — quella la legge il
   giro successivo. Senza un gettone già in mano non parte niente: aspettarlo
   vorrebbe dire non partire affatto. */
export function spedisciSubito(ops: OpServer[]): boolean {
  const t = gettoneSubito();
  if (!t || !ops.length) return false;
  try {
    const corpo = JSON.stringify({ gettone: t, ops: ops.slice(0, 40).map(function (op) { return Object.assign({ k: chiaveOp(op) }, op); }) });
    /* le keepalive hanno un tetto di 64 kB: oltre, ci pensa il giro */
    if (corpo.length > 60000) return false;
    void fetch(base() + 'scrivi', { method: 'POST', keepalive: true, cache: 'no-store', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: corpo })
      .catch(function () { /* il giro ci riprova */ });
    return true;
  } catch { return false; }
}

/* ============================================================== COLLEGARE
   Si chiede alla sentinella da dove partire, e si va. Si torna all'app con
   `?lmcal=google&esito=ok`: lo legge `completaRitornoServer`. */
const DOVE_KEY = 'lifemax.calendari.ritorno';
/* DAL VECCHIO INDIRIZZO (github.io) IL CALENDARIO SI COLLEGA SUL DOMINIO
   (verifica 3, N2). La conferma del collegamento (C2) si fida solo del
   biscotto che il ritorno lascia nel browser, e da github.io quel biscotto
   non torna: sta su un altro sito, ed è `SameSite=Lax` apposta. Metterlo
   `SameSite=None` per far funzionare github.io indebolirebbe proprio la
   difesa di C2. Allora da github.io si va sul dominio, dove il giro intero
   (inizio, ritorno, conferma) sta sullo stesso sito; il collegamento è
   dell'account, e da lì vale anche qui. */
const DOMINIO_SENTINELLA = 'https://lifemax.theproject.world';
async function vai(p: Provenienza): Promise<never> {
  if (/\.github\.io$/.test(location.hostname)) {
    location.assign(DOMINIO_SENTINELLA + '/?lmcal=' + p + '&esito=dal-vecchio-indirizzo');
    return new Promise<never>(function () { /* la pagina se ne va */ });
  }
  const qui = location.origin + location.pathname.replace(/index\.html$/, '');
  const j = await manda<{ url?: string }>(p + '/inizia', { ritorno: qui });
  if (!j.url) throw new ErroreCalendario('altro', j.errore === 'ritorno' ? 'Questo indirizzo dell’app non è fra quelli che la sentinella conosce.' : 'Il collegamento non è partito.');
  try { localStorage.setItem(DOVE_KEY, location.hash || '#/profilo'); } catch { /* si torna al profilo */ }
  location.assign(j.url);
  return new Promise<never>(function () { /* la pagina se ne va */ });
}

export function completaRitornoServer(): { p: Provenienza; esito: string } | null {
  const q = new URLSearchParams(location.search);
  const p = q.get('lmcal');
  if (p !== 'google' && p !== 'microsoft') return null;
  let h = '#/profilo';
  try { h = localStorage.getItem(DOVE_KEY) || h; localStorage.removeItem(DOVE_KEY); } catch { /* il profilo */ }
  try { history.replaceState(null, '', location.pathname + h); } catch { /* resta: non fa danni */ }
  return { p: p, esito: q.get('esito') || 'errore' };
}

/* LA CONFERMA DEL COLLEGAMENTO. Tornati da Google o Microsoft con
   `esito=da-confermare`, il permesso sta ancora in sospeso nella sentinella:
   diventa di questo account solo se lo conferma questa app, con il suo
   gettone, dallo stesso browser che è tornato (il biscotto del ritorno lo
   porta il browser da solo). È la difesa contro il collegamento cominciato
   da un altro e mandato a te come link (verifica del 25 novembre 2026, C2).
   Torna l'email del calendario collegato, o l'esito che dice cosa non va. */
export async function confermaCollegamento(p: Provenienza): Promise<{ esito: string; email: string }> {
  try {
    const j = await manda<{ ok?: boolean; email?: string }>(p + '/conferma', {});
    if (j.ok) return { esito: 'ok', email: j.email || '' };
    return { esito: j.errore === 'altro-browser' ? 'altro-browser' : 'scaduto', email: '' };
  } catch {
    return { esito: 'errore', email: '' };
  }
}

export function spiegaEsito(esito: string, nome: string): string {
  if (esito === 'dal-vecchio-indirizzo') return nome + ' si collega da questo indirizzo: accedi con lo stesso account (se non l’hai già fatto) e tocca «Collega». Vale anche sul vecchio indirizzo.';
  if (esito === 'negato') return 'Su ' + nome + ' non è stato dato il permesso.';
  if (esito === 'caselle') return 'Nella finestra di ' + nome + ' servono tutte e due le caselle: l’elenco dei calendari e gli eventi.';
  if (esito === 'scaduto') return 'Il collegamento ci ha messo troppo, o era già stato usato: riprova.';
  if (esito === 'altro-browser') return 'Questo collegamento non era partito da qui, o non da questo account: per sicurezza non l’ho usato. Se vuoi collegare il calendario, comincia da qui.';
  return nome + ' non ha completato il collegamento: riprova fra poco.';
}

/* ============================================================ IL FORNITORE */
export function fornitoreServer(p: Provenienza, nome: string): Fornitore {
  return {
    prov: p,
    nome: nome,
    /* l'ID dell'app c'è: lo conosce la sentinella */
    idApp: function () { return 'sentinella'; },
    pronto: function () { const c = contoServer(p); return !!c && c.collegato && !c.revocato; },
    collega: async function () { await vai(p); return ''; },
    ricollega: async function () { await vai(p); },
    dimentica: async function () {
      try { await manda(p + '/scollega', {}); }
      finally {
        const s = specchio();
        delete s.conti[p];
        Object.keys(s.ev).forEach(function (k) { if (k.indexOf(p + '|') === 0) delete s.ev[k]; });
        salva();
      }
    },
    calendari: async function () {
      const j = await manda<{ calendari: CalendarioRemoto[] }>(p + '/calendari', {});
      return j.calendari || [];
    },
    eventi: async function (cal: string, da: number, a: number) {
      return eventiSpecchio().filter(function (x) { return x.p === p && x.c === cal; })
        .map(function (x) { return daNeutro(x.n); })
        .filter(function (e) { return e.fine > da && e.inizio < a; });
    },
    evento: async function (cal: string, id: string) {
      const n = eventoSpecchio(p, cal, id);
      if (n) return daNeutro(n);
      /* non è nello specchio (uscito dalla finestra): lo si chiede adesso */
      const j = await manda<{ e: Omit<Neutro, 'p' | 'c'> | null }>(p + '/evento', { c: cal, id: id });
      return j.e ? daNeutro(Object.assign({ p: p, c: cal }, j.e) as Neutro) : null;
    },
    aggiorna: async function (cal: string, id: string, w: Scrittura) {
      const e = await scrivi({ p: p, tipo: 'aggiorna', c: cal, id: id, w: w });
      if (!e) throw new ErroreCalendario('altro', 'La sentinella non ha restituito l’evento.');
      return e;
    },
    togli: async function (cal: string, id: string) { await scrivi({ p: p, tipo: 'togli', c: cal, id: id }); },
    crea: async function (cal: string, testo: string, tempo, chiave: string) {
      const e = await scrivi({ p: p, tipo: 'crea', c: cal, testo: testo, tempo: tempo, chiave: chiave });
      if (!e) throw new ErroreCalendario('altro', 'La sentinella non ha restituito l’evento.');
      return e;
    }
  };
}
