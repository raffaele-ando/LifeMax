/* ============================================================
   GOOGLE CALENDAR — il permesso con Google Identity Services, gli eventi
   con l'API REST v3. Tutto dal browser: LifeMax un server non ce l'ha.

   PERCHÉ IL «TOKEN CLIENT» E NON UN ACCESSO VERO E PROPRIO. Firebase fa già
   entrare con Google, ma quell'accesso dice CHI sei, non dà il permesso di
   leggere il calendario: sono due domande diverse, e mescolarle vorrebbe
   dire chiedere il calendario a chiunque voglia solo salvare i dati nel
   cloud. Il token client fa la seconda domanda e basta: una finestrella di
   Google, «LifeMax vuole vedere e modificare gli eventi», e torna un
   permesso che vale circa un'ora.

   LA LIBRERIA ARRIVA DALLA RETE, come l'SDK di Firebase: uno `<script>` da
   accounts.google.com, aggiunto solo quando serve. Niente pacchetti npm —
   quella libreria Google la distribuisce soltanto così.

   I DUE PERMESSI, e sono i più stretti che bastano:
     calendar.calendarlist.readonly  l'ELENCO dei tuoi calendari, per farti
                                     scegliere quali importare — e nient'altro
     calendar.events                 leggere e scrivere gli EVENTI
   Il permesso pieno (`calendar`) darebbe anche creare e cancellare interi
   calendari e cambiarne la condivisione: a LifeMax non serve.

   IL RINNOVO. Il permesso scade dopo un'ora e Google non dà un modo di
   rinnovarlo senza finestra: anche `prompt: ''` apre un attimo la sua
   finestrella, che si richiude da sola se avevi già detto sì. Una finestra
   che si apre da sola mentre stai facendo altro è proprio quello che non si
   vuole — e i browser la bloccano, giustamente. Quindi il rinnovo avviene
   SOLO dentro a un tocco: «Sincronizza ora», o «Ricollega» quando il
   permesso è scaduto mentre l'app lavorava da sola.
   ============================================================ */
import type { Fornitore, EventoRemoto, CalendarioRemoto, Scrittura } from './fornitore';
import { ErroreCalendario, conOrario, istante, piuGiorni, SENZA_TITOLO, invitoDa } from './fornitore';
import { giorno } from '../tipi/stato';
import type { Giorno } from '../tipi/stato';
import { GOOGLE_CLIENT_ID } from './config';
import { LM } from '../dati/dati';

const GIS = 'https://accounts.google.com/gsi/client';
const API = 'https://www.googleapis.com/calendar/v3';
const S_ELENCO = 'https://www.googleapis.com/auth/calendar.calendarlist.readonly';
const S_EVENTI = 'https://www.googleapis.com/auth/calendar.events';
const DOVE = 'lifemax.calendari.google';

/* --------------------------------------------- le forme di quello che arriva
   Scritte a mano e solo per quello che si legge, come quelle di Firebase in
   src/nuvola/sdk.ts: la libreria non arriva da npm, quindi i tipi neanche. */
interface RispostaToken { access_token?: string; expires_in?: number | string; scope?: string; error?: string; error_description?: string }
interface ConfigToken {
  client_id: string;
  scope: string;
  prompt?: string;
  include_granted_scopes?: boolean;
  callback: (r: RispostaToken) => void;
  error_callback?: (e: { type?: string; message?: string }) => void;
}
interface ClientToken { requestAccessToken(o?: { prompt?: string; hint?: string }): void }
interface Gis {
  accounts: {
    oauth2: {
      initTokenClient(c: ConfigToken): ClientToken;
      hasGrantedAllScopes(r: RispostaToken, ...s: string[]): boolean;
      revoke(t: string, fatto?: () => void): void;
    };
  };
}
interface Quando { date?: string; dateTime?: string; timeZone?: string }
interface EventoGoogle {
  id: string; status?: string; summary?: string; etag?: string; updated?: string;
  eventType?: string;
  start?: Quando; end?: Quando;
  attendees?: { self?: boolean; resource?: boolean; responseStatus?: string }[];
  organizer?: { self?: boolean };
}
interface Permesso { t: string; scade: number }

declare global { interface Window { google?: Gis } }

/* -------------------------------------------------------------- il permesso */
function leggi(): Permesso | null {
  try { const v = JSON.parse(localStorage.getItem(DOVE) || 'null') as Permesso | null; return v && v.t ? v : null; } catch { return null; }
}
function scrivi(p: Permesso | null): void {
  try { if (p) localStorage.setItem(DOVE, JSON.stringify(p)); else localStorage.removeItem(DOVE); } catch { /* pazienza: vale per questa visita */ }
}

function idApp(): string {
  const c = LM.load().profilo.calendari;
  return (GOOGLE_CLIENT_ID || (c && c.idGoogle) || '').trim();
}

/* la libreria si carica una volta, e la si tiene in mano già pronta: il
   tocco su «Collega» deve aprire la finestra SUBITO, dentro al gesto. Un
   `await` della rete in mezzo e Safari non la considera più una cosa
   chiesta da te, e la blocca. Per questo il pannello la fa caricare appena
   si apre (`precarica`). */
let gis: Gis | null = null;
let caricando: Promise<Gis> | null = null;
export function precarica(): Promise<Gis> {
  if (gis) return Promise.resolve(gis);
  if (caricando) return caricando;
  caricando = new Promise<Gis>(function (ok, ko) {
    if (window.google && window.google.accounts) { gis = window.google; ok(gis); return; }
    const s = document.createElement('script');
    s.src = GIS; s.async = true;
    s.onload = function () {
      if (window.google && window.google.accounts) { gis = window.google; ok(gis); }
      else ko(new ErroreCalendario('rete', 'La libreria di Google non si è caricata.'));
    };
    s.onerror = function () { caricando = null; ko(new ErroreCalendario('rete', 'Non riesco a raggiungere Google.')); };
    document.head.appendChild(s);
  });
  return caricando;
}

function chiedi(g: Gis, prompt: string, hint: string): Promise<string> {
  return new Promise<string>(function (ok, ko) {
    const client = g.accounts.oauth2.initTokenClient({
      client_id: idApp(),
      scope: S_ELENCO + ' ' + S_EVENTI,
      include_granted_scopes: true,
      callback: function (r) {
        if (r.error || !r.access_token) { ko(new ErroreCalendario('token', r.error_description || r.error || 'Google non ha dato il permesso.')); return; }
        /* IL PERMESSO A METÀ. Nella finestra di Google le due caselle si
           possono togliere una per una: senza la seconda LifeMax vede i
           calendari ma non gli eventi, e ogni giro finirebbe in un errore
           che non spiega niente. Meglio dirlo qui, una volta, con le parole
           giuste. */
        if (!g.accounts.oauth2.hasGrantedAllScopes(r, S_ELENCO, S_EVENTI)) {
          ko(new ErroreCalendario('permesso', 'Nella finestra di Google servono tutte e due le caselle: l’elenco dei calendari e gli eventi.'));
          return;
        }
        const sec = Number(r.expires_in) || 3600;
        scrivi({ t: r.access_token, scade: Date.now() + sec * 1000 });
        ok(r.access_token);
      },
      error_callback: function (e) {
        ko(new ErroreCalendario('token', e && e.type === 'popup_closed'
          ? 'La finestra di Google si è chiusa prima della fine.'
          : 'Il browser non ha aperto la finestra di Google.'));
      }
    });
    client.requestAccessToken(hint ? { prompt: prompt, hint: hint } : { prompt: prompt });
  });
}

/* il permesso per un giro automatico: c'è o non c'è, e non si apre niente */
function token(): string {
  const p = leggi();
  if (p && p.scade > Date.now() + 60000) return p.t;
  throw new ErroreCalendario('token', 'Il permesso di Google è scaduto.');
}

/* ---------------------------------------------------------------- la rete */
async function chiama<T>(metodo: string, via: string, corpo?: unknown): Promise<T | null> {
  const t = token();
  let r: Response;
  try {
    const opz: RequestInit = { method: metodo, headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' } };
    if (corpo !== undefined) opz.body = JSON.stringify(corpo);
    r = await fetch(API + via, opz);
  } catch {
    throw new ErroreCalendario('rete', 'Niente rete, o Google non risponde.');
  }
  if (r.status === 204) return null;
  if (r.ok) return await r.json() as T;
  let motivo = '';
  try {
    const j = await r.json() as { error?: { message?: string; errors?: { reason?: string }[] } };
    motivo = (j.error && j.error.errors && j.error.errors[0] && j.error.errors[0].reason) || (j.error && j.error.message) || '';
  } catch { /* il corpo non è JSON: resta il codice */ }
  if (r.status === 401) { scrivi(null); throw new ErroreCalendario('token', 'Il permesso di Google è scaduto.', 401); }
  if (r.status === 404 || r.status === 410) throw new ErroreCalendario('sparito', 'L’evento non c’è più.', r.status);
  if (r.status === 409) throw new ErroreCalendario('altro', 'esiste già', 409);
  if (r.status === 429 || r.status >= 500 || /rateLimit|userRateLimit|quota/i.test(motivo)) {
    throw new ErroreCalendario('rete', 'Google è occupato: riprovo fra poco.', r.status);
  }
  if (r.status === 403) throw new ErroreCalendario('permesso', 'Google non permette di cambiare questo calendario.', 403);
  throw new ErroreCalendario('altro', 'Google ha risposto ' + r.status + (motivo ? ' (' + motivo + ')' : '') + '.', r.status);
}

/* ------------------------------------------------------------ la traduzione */
function traduci(e: EventoGoogle): EventoRemoto {
  const via = e.status === 'cancelled' ||
    /* il luogo di lavoro di oggi («in ufficio», «da casa») è un'etichetta
       sulla giornata, non un impegno: come attività sarebbe rumore */
    e.eventType === 'workingLocation' ||
    (e.attendees || []).some(function (a) { return !!a.self && a.responseStatus === 'declined'; });
  const testo = (e.summary || '').trim() || SENZA_TITOLO;
  const versione = e.etag || e.updated || '';
  /* l'organizzatore è «questo calendario»? e c'è qualcun altro (che non sia
     una sala)? Gli indirizzi degli invitati non si guardano */
  const invito = invitoDa(!e.organizer || !!e.organizer.self, (e.attendees || []).some(function (a) { return !a.self && !a.resource; }));
  const s = e.start || {}, f = e.end || {};
  if (s.date) {
    const da = giorno(s.date);
    const a: Giorno = f.date ? giorno(f.date) : piuGiorni(da, 1);
    return { id: e.id, testo, data: da, ora: null, durata: null, versione, tuttoIlGiorno: true,
      inizio: istante(da, null), fine: istante(a, null), via, invito };
  }
  const inizio = Date.parse(s.dateTime || '') || 0;
  const fine = Date.parse(f.dateTime || '') || inizio;
  const t = conOrario(inizio, fine);
  return { id: e.id, testo, data: t.data, ora: t.ora, durata: t.durata, versione, tuttoIlGiorno: false, inizio, fine, via, invito };
}

function corpoDi(w: Scrittura): Record<string, unknown> {
  const c: Record<string, unknown> = {};
  if (w.testo !== undefined) c['summary'] = w.testo;
  if (w.tempo) {
    /* `null` sull'altro campo, e serve: passando da «tutto il giorno» a
       un'ora (o al contrario) Google tiene il campo vecchio se non gli si
       dice esplicitamente di toglierlo, e risponde che start ha due valori */
    if (w.tempo.tuttoIlGiorno) {
      c['start'] = { date: w.tempo.dataInizio, dateTime: null };
      c['end'] = { date: w.tempo.dataFine, dateTime: null };
    } else {
      c['start'] = { dateTime: new Date(w.tempo.inizio).toISOString(), date: null };
      c['end'] = { dateTime: new Date(w.tempo.fine).toISOString(), date: null };
    }
  }
  return c;
}

const cal = (id: string) => '/calendars/' + encodeURIComponent(id);

/* ------------------------------------------------------------- il fornitore */
export const google: Fornitore = {
  prov: 'google',
  nome: 'Google',
  idApp: idApp,
  pronto: function () { try { token(); return true; } catch { return false; } },

  collega: async function () {
    /* se la libreria è già qui la finestra parte nello stesso istante del
       tocco; se non c'è ancora, si aspetta e si prova lo stesso */
    const g = gis || await precarica();
    await chiedi(g, 'consent', '');
    const elenco = await google.calendari();
    const pr = elenco.find(function (c) { return c.principale; });
    /* l'email non la chiediamo a parte (servirebbe un terzo permesso): il
       calendario principale di un account Google si chiama come l'account */
    return pr ? pr.id : '';
  },
  ricollega: async function (email: string) {
    const g = gis || await precarica();
    await chiedi(g, '', email);
  },
  dimentica: async function () {
    const p = leggi();
    scrivi(null);
    if (p && gis) { try { gis.accounts.oauth2.revoke(p.t); } catch { /* era già scaduto */ } }
  },

  calendari: async function () {
    const r = await chiama<{ items?: { id: string; summary?: string; summaryOverride?: string; primary?: boolean; accessRole?: string }[] }>(
      'GET', '/users/me/calendarList?minAccessRole=reader&maxResults=250');
    return ((r && r.items) || []).map(function (c): CalendarioRemoto {
      return { id: c.id, nome: c.summaryOverride || c.summary || c.id,
        lettura: !(c.accessRole === 'owner' || c.accessRole === 'writer'), principale: !!c.primary };
    });
  },

  eventi: async function (c: string, da: number, a: number) {
    const out: EventoRemoto[] = [];
    let pagina = '';
    /* `singleEvents=true`: un evento che si ripete arriva come le sue
       istanze, ognuna col suo id. È quello che serve — in LifeMax ogni
       martedì è un'attività a sé, e spostarne uno non deve spostarli tutti */
    for (let giro = 0; giro < 20; giro++) {
      const q = '?singleEvents=true&maxResults=250&timeMin=' + encodeURIComponent(new Date(da).toISOString()) +
        '&timeMax=' + encodeURIComponent(new Date(a).toISOString()) + (pagina ? '&pageToken=' + encodeURIComponent(pagina) : '');
      const r = await chiama<{ items?: EventoGoogle[]; nextPageToken?: string }>('GET', cal(c) + '/events' + q);
      ((r && r.items) || []).forEach(function (e) { out.push(traduci(e)); });
      pagina = (r && r.nextPageToken) || '';
      if (!pagina) break;
    }
    return out;
  },

  evento: async function (c: string, id: string) {
    try {
      const r = await chiama<EventoGoogle>('GET', cal(c) + '/events/' + encodeURIComponent(id));
      return r ? traduci(r) : null;
    } catch (e) {
      if (e instanceof ErroreCalendario && e.tipo === 'sparito') return null;
      throw e;
    }
  },

  aggiorna: async function (c: string, id: string, w: Scrittura) {
    const r = await chiama<EventoGoogle>('PATCH', cal(c) + '/events/' + encodeURIComponent(id), corpoDi(w));
    if (!r) throw new ErroreCalendario('altro', 'Google non ha restituito l’evento.');
    return traduci(r);
  },

  togli: async function (c: string, id: string) {
    try { await chiama('DELETE', cal(c) + '/events/' + encodeURIComponent(id)); }
    catch (e) { if (!(e instanceof ErroreCalendario && e.tipo === 'sparito')) throw e; }
  },

  crea: async function (c: string, testo: string, tempo, chiave: string) {
    /* L'ID LO SCEGLIE LIFEMAX, ed è quello che impedisce i doppioni: se due
       dispositivi spediscono la stessa attività prima di essersi parlati, il
       secondo si sente dire «esiste già» (409) e si prende quello che c'è. */
    const corpo = Object.assign({ id: chiave }, corpoDi({ testo: testo, tempo: tempo }));
    try {
      const r = await chiama<EventoGoogle>('POST', cal(c) + '/events', corpo);
      if (!r) throw new ErroreCalendario('altro', 'Google non ha restituito l’evento.');
      return traduci(r);
    } catch (e) {
      if (e instanceof ErroreCalendario && e.stato === 409) {
        const gia = await google.evento(c, chiave);
        if (gia) return gia;
      }
      throw e;
    }
  }
};

/* l'id di un evento nuovo, scritto con le sole lettere che Google accetta
   (base32hex: 0-9 e a-v). Da un id di LifeMax esce sempre lo stesso. */
export function chiaveGoogle(idAzione: string): string {
  let out = 'lm';
  for (let i = 0; i < idAzione.length; i++) out += idAzione.charCodeAt(i).toString(16);
  return out.slice(0, 1000);
}

