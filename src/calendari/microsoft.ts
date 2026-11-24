/* ============================================================
   OUTLOOK / MICROSOFT 365 — il permesso con il flusso «Authorization Code
   con PKCE», gli eventi con Microsoft Graph.

   PERCHÉ NON C'È MSAL.js, che era la strada prevista. MSAL si caricava da
   una CDN di Microsoft (alcdn.msauth.net), come Firebase da gstatic. Dalla
   versione 3 (settembre 2023) Microsoft NON la pubblica più su CDN: si
   distribuisce solo come pacchetto npm, e le versioni vecchie rimaste lassù
   non vengono più aggiornate. Restavano tre strade:
     · prendere MSAL da npm e metterla nel pacco: un centinaio di kilobyte
       per una cosa che userà una persona su dieci, e la versione 4-5 vuole
       una pagina di ritorno apposta (il «redirect bridge») da registrare nel
       portale accanto a quella dell'app;
     · prenderla da una CDN qualunque (jsDelivr): codice che gestisce i
       permessi del tuo account di lavoro servito da un terzo, senza nessuno
       che garantisca che sia quello pubblicato da Microsoft;
     · scrivere il flusso a mano. È lo standard OAuth 2.0 con PKCE (RFC
       7636), e per un'app nel browser sono due richieste: mandarti alla
       pagina di Microsoft con una sfida, e scambiare il codice che torna
       con il permesso. Microsoft lo documenta per le «single-page
       application» e accetta lo scambio direttamente dal browser.
   La terza è la più semplice, non aggiunge niente al pacco, e si prova
   tutta con una rete finta (prove/calendari.js). Quello che MSAL avrebbe
   fatto in più — il rinnovo con un iframe nascosto — oggi i browser lo
   bloccano comunque (cookie di terze parti), e MSAL stesso ripiega sul
   «refresh token», che è esattamente quello che si fa qui.

   COME VA, IN PRATICA.
     1. «Collega»: la pagina va su login.microsoftonline.com. Niente
        finestra a parte — sui telefoni le finestre a parte si perdono.
     2. Microsoft torna all'INDIRIZZO DELL'APP (la stessa pagina, registrata
        nel portale come «Single-page application») con `?code=…`.
     3. All'avvio questo modulo vede il codice, lo scambia, e lo toglie
        dall'indirizzo.
     4. Il permesso dura circa un'ora; il «refresh token» lo rinnova senza
        chiedere niente per 24 ore (è il limite che Microsoft dà alle app nel
        browser). Dopo, serve un tocco su «Ricollega».

   `common`: valgono sia gli account personali (outlook.com, hotmail) sia
   quelli di lavoro o di scuola.
   ============================================================ */
import type { Fornitore, EventoRemoto, CalendarioRemoto, Scrittura } from './fornitore';
import { ErroreCalendario, conOrario, istante, piuGiorni, SENZA_TITOLO, invitoDa } from './fornitore';
import { giorno } from '../tipi/stato';
import { MICROSOFT_CLIENT_ID } from './config';
import { LM } from '../dati/dati';

const LOGIN = 'https://login.microsoftonline.com/common/oauth2/v2.0/';
const GRAPH = 'https://graph.microsoft.com/v1.0';
/* `offline_access` è quello che dà il refresh token; `openid profile` sono
   quelli che Microsoft aggiunge comunque. I due veri sono gli ultimi. */
const SCOPE = 'openid profile offline_access User.Read Calendars.ReadWrite';
const DOVE = 'lifemax.calendari.microsoft';
const ATTESA = 'lifemax.calendari.microsoft.attesa';
/* le ore arrivano in UTC e qui le traduce il browser, che conosce il fuso
   di questo dispositivo meglio di qualunque nome scritto a mano */
const FUSO = { Prefer: 'outlook.timezone="UTC"' };

interface Permesso { t: string; scade: number; r: string; rScade: number }
interface Quando { dateTime?: string; timeZone?: string }
interface EventoGraph {
  id: string; subject?: string; changeKey?: string; lastModifiedDateTime?: string;
  isAllDay?: boolean; isCancelled?: boolean;
  start?: Quando; end?: Quando;
  responseStatus?: { response?: string };
  isOrganizer?: boolean;
  attendees?: { type?: string }[];
}

function leggi(): Permesso | null {
  try { const v = JSON.parse(localStorage.getItem(DOVE) || 'null') as Permesso | null; return v && v.t ? v : null; } catch { return null; }
}
function scrivi(p: Permesso | null): void {
  try { if (p) localStorage.setItem(DOVE, JSON.stringify(p)); else localStorage.removeItem(DOVE); } catch { /* vale per questa visita */ }
}
function idApp(): string {
  const c = LM.load().profilo.calendari;
  return (MICROSOFT_CLIENT_ID || (c && c.idMicrosoft) || '').trim();
}

/* L'INDIRIZZO DI RITORNO È LA PAGINA DELL'APP, senza `index.html` in coda:
   è quello registrato nel portale (https://…github.io/LifeMax/), e Microsoft
   lo confronta carattere per carattere. Chi ha aperto `…/LifeMax/index.html`
   tornerebbe a un indirizzo che il portale non conosce. */
export function ritorno(): string {
  return location.origin + location.pathname.replace(/index\.html$/, '');
}

/* ------------------------------------------------------------- PKCE
   La sfida: una stringa a caso che resta qui (`verificatore`) e la sua
   impronta SHA-256 che va a Microsoft. Al ritorno si manda la stringa, e
   Microsoft controlla che l'impronta sia quella: chi intercettasse il
   codice per strada, senza la stringa, non ci fa niente. */
function base64url(b: Uint8Array): string {
  let s = '';
  b.forEach(function (x) { s += String.fromCharCode(x); });
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function caso(n: number): string {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return base64url(b);
}
async function sfida(v: string): Promise<string> {
  const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v));
  return base64url(new Uint8Array(h));
}

async function vai(prompt: string, hint: string): Promise<never> {
  const verificatore = caso(48), stato = caso(16);
  /* in localStorage e non in sessionStorage: su alcuni telefoni il ritorno
     da Microsoft apre una scheda nuova, e la sessione resterebbe di là */
  try {
    localStorage.setItem(ATTESA, JSON.stringify({ v: verificatore, s: stato, h: location.hash || '#/profilo', ts: Date.now() }));
  } catch { throw new ErroreCalendario('altro', 'Questo browser non lascia salvare niente: il collegamento non può funzionare.'); }
  const q = new URLSearchParams({
    client_id: idApp(), response_type: 'code', redirect_uri: ritorno(), response_mode: 'query',
    scope: SCOPE, state: stato, code_challenge: await sfida(verificatore), code_challenge_method: 'S256'
  });
  if (prompt) q.set('prompt', prompt);
  if (hint) q.set('login_hint', hint);
  location.assign(LOGIN + 'authorize?' + q.toString());
  /* la pagina se ne va: questa promessa non si risolve, ed è giusto così */
  return new Promise<never>(function () { /* si resta qui finché si parte */ });
}

async function scambia(corpo: Record<string, string>): Promise<Permesso> {
  let r: Response;
  try {
    r = await fetch(LOGIN + 'token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(Object.assign({ client_id: idApp(), scope: SCOPE }, corpo)).toString()
    });
  } catch {
    /* un rifiuto di rete qui è quasi sempre CORS: Microsoft accetta lo
       scambio dal browser solo se l'indirizzo è registrato come «Single-page
       application», non come «Web». Vale la pena dirlo. */
    throw new ErroreCalendario('rete', 'Microsoft non risponde. Se succede sempre, controlla nel portale che l’indirizzo sia registrato come «Single-page application».');
  }
  const j = await r.json().catch(function () { return {}; }) as { access_token?: string; expires_in?: number; refresh_token?: string; error?: string; error_description?: string };
  if (!r.ok || !j.access_token) {
    throw new ErroreCalendario('token', (j.error_description || j.error || 'Microsoft non ha dato il permesso.').split('\n')[0] || '', r.status);
  }
  const p: Permesso = {
    t: j.access_token, scade: Date.now() + (Number(j.expires_in) || 3600) * 1000,
    r: j.refresh_token || '', rScade: Date.now() + 24 * 3600 * 1000 - 5 * 60000
  };
  scrivi(p);
  return p;
}

/* il permesso per un giro: quello che c'è, o rinnovato col refresh token
   SENZA aprire niente. Se nemmeno quello basta, serve un tocco. */
let rinnovo: Promise<Permesso> | null = null;
async function token(): Promise<string> {
  const p = leggi();
  if (p && p.scade > Date.now() + 60000) return p.t;
  if (p && p.r && p.rScade > Date.now()) {
    /* uno solo alla volta: due richieste in parallelo con lo stesso refresh
       token, e la seconda trova il token già consumato */
    if (!rinnovo) rinnovo = scambia({ grant_type: 'refresh_token', refresh_token: p.r }).finally(function () { rinnovo = null; });
    try { return (await rinnovo).t; }
    catch (e) {
      if (e instanceof ErroreCalendario && e.tipo === 'rete') throw e;
      scrivi(null);
    }
  }
  throw new ErroreCalendario('token', 'Il permesso di Microsoft è scaduto.');
}

/* ------------------------------------------------ il ritorno da Microsoft
   Chiamata una volta all'avvio. Torna l'email se un collegamento è appena
   andato a buon fine (anche '' se Microsoft non l'ha detta), `null` se non
   c'era niente da fare, e lancia se c'era un ritorno e non è andato bene:
   il pannello lo racconta. */
export async function completaRitorno(): Promise<string | null> {
  const q = new URLSearchParams(location.search);
  const codice = q.get('code'), stato = q.get('state'), errore = q.get('error');
  if (!codice && !errore) return null;
  let attesa: { v: string; s: string; h: string } | null = null;
  try { attesa = JSON.parse(localStorage.getItem(ATTESA) || 'null'); } catch { attesa = null; }
  /* se lo stato non è il nostro, quel codice non l'abbiamo chiesto noi */
  if (!attesa || attesa.s !== stato) return null;
  try { localStorage.removeItem(ATTESA); } catch { /* niente */ }
  /* via dall'indirizzo, subito: un codice lasciato lì verrebbe ripresentato
     a ogni ricarica, e finirebbe nei preferiti di chi salva la pagina */
  try { history.replaceState(null, '', ritorno() + (attesa.h || '#/profilo')); } catch { /* resta: non fa danni */ }
  if (errore) {
    throw new ErroreCalendario('token', errore === 'access_denied'
      ? 'Su Microsoft non è stato dato il permesso.'
      : (q.get('error_description') || errore).split('\n')[0] || errore);
  }
  await scambia({ grant_type: 'authorization_code', code: codice || '', redirect_uri: ritorno(), code_verifier: attesa.v });
  try {
    const me = await chiama<{ mail?: string; userPrincipalName?: string }>('GET', '/me?$select=mail,userPrincipalName');
    return (me && (me.mail || me.userPrincipalName)) || '';
  } catch { return ''; }
}

/* ---------------------------------------------------------------- la rete */
async function chiama<T>(metodo: string, via: string, corpo?: unknown, testa?: Record<string, string>): Promise<T | null> {
  const t = await token();
  let r: Response;
  try {
    const h: Record<string, string> = Object.assign({ Authorization: 'Bearer ' + t }, testa || {});
    const opz: RequestInit = { method: metodo, headers: h };
    if (corpo !== undefined) { h['Content-Type'] = 'application/json'; opz.body = JSON.stringify(corpo); }
    r = await fetch(/^https:/.test(via) ? via : GRAPH + via, opz);
  } catch {
    throw new ErroreCalendario('rete', 'Niente rete, o Microsoft non risponde.');
  }
  if (r.status === 204) return null;
  if (r.ok) return await r.json() as T;
  let codice = '';
  try { const j = await r.json() as { error?: { code?: string } }; codice = (j.error && j.error.code) || ''; } catch { /* niente */ }
  if (r.status === 401) {
    /* il permesso c'era ma Graph non lo accetta più: si butta quello breve e
       si tiene il refresh token, che al prossimo giro ne fa uno nuovo */
    const p = leggi(); if (p) scrivi(Object.assign({}, p, { scade: 0 }));
    throw new ErroreCalendario('token', 'Il permesso di Microsoft è scaduto.', 401);
  }
  if (r.status === 404 || r.status === 410) throw new ErroreCalendario('sparito', 'L’evento non c’è più.', r.status);
  if (r.status === 429 || r.status >= 500) throw new ErroreCalendario('rete', 'Microsoft è occupato: riprovo fra poco.', r.status);
  if (r.status === 403) throw new ErroreCalendario('permesso', 'Microsoft non permette di cambiare questo calendario.', 403);
  throw new ErroreCalendario('altro', 'Microsoft ha risposto ' + r.status + (codice ? ' (' + codice + ')' : '') + '.', r.status);
}

/* ------------------------------------------------------------ la traduzione */
/* `isOrganizer` e `attendees` servono a una domanda sola, «è solo tua?»:
   Microsoft non lascia chiedere meno dell'elenco degli invitati, che qui si
   conta e si butta (vedi `traduci`) */
const CAMPI = '$select=id,subject,start,end,isAllDay,isCancelled,responseStatus,changeKey,lastModifiedDateTime,isOrganizer,attendees';

/* «2026-11-24T09:00:00.0000000» con `timeZone: UTC` accanto: l'ora c'è, il
   fuso no. Si aggiunge la Z, e il browser lo porta nell'ora di qui. */
function utc(q: Quando | undefined): number {
  const s = (q && q.dateTime) || '';
  return Date.parse(/[zZ]|[+-]\d\d:\d\d$/.test(s) ? s : s + 'Z') || 0;
}

function traduci(e: EventoGraph): EventoRemoto {
  const via = !!e.isCancelled || !!(e.responseStatus && e.responseStatus.response === 'declined');
  const testo = (e.subject || '').trim() || SENZA_TITOLO;
  const versione = e.changeKey || e.lastModifiedDateTime || '';
  const invito = invitoDa(e.isOrganizer !== false, (e.attendees || []).some(function (a) { return !!a && a.type !== 'resource'; }));
  if (e.isAllDay) {
    /* TUTTO IL GIORNO È UNA DATA, NON UN'ORA: Microsoft la scrive come la
       mezzanotte di quel giorno, e quel giorno resta quello qualunque sia il
       fuso di chi guarda. Si prende la data così com'è, senza conversioni:
       convertita, il compleanno di domani a Roma diventerebbe oggi a New
       York. */
    const da = giorno(((e.start && e.start.dateTime) || '').slice(0, 10));
    const aS = ((e.end && e.end.dateTime) || '').slice(0, 10);
    const a = aS ? giorno(aS) : piuGiorni(da, 1);
    return { id: e.id, testo, data: da, ora: null, durata: null, versione, tuttoIlGiorno: true,
      inizio: istante(da, null), fine: istante(a, null), via, invito };
  }
  const inizio = utc(e.start), fine = utc(e.end) || inizio;
  const t = conOrario(inizio, fine);
  return { id: e.id, testo, data: t.data, ora: t.ora, durata: t.durata, versione, tuttoIlGiorno: false, inizio, fine, via, invito };
}

function corpoDi(w: Scrittura): Record<string, unknown> {
  const c: Record<string, unknown> = {};
  if (w.testo !== undefined) c['subject'] = w.testo;
  if (w.tempo) {
    const t = w.tempo;
    c['isAllDay'] = t.tuttoIlGiorno;
    /* tutto il giorno: mezzanotte a mezzanotte, e Microsoft pretende che le
       due ore siano proprio mezzanotte nel fuso che si dichiara */
    c['start'] = t.tuttoIlGiorno ? { dateTime: t.dataInizio + 'T00:00:00', timeZone: 'UTC' }
      : { dateTime: new Date(t.inizio).toISOString().slice(0, 19), timeZone: 'UTC' };
    c['end'] = t.tuttoIlGiorno ? { dateTime: t.dataFine + 'T00:00:00', timeZone: 'UTC' }
      : { dateTime: new Date(t.fine).toISOString().slice(0, 19), timeZone: 'UTC' };
  }
  return c;
}

const ev = (id: string) => '/me/events/' + encodeURIComponent(id);

export const microsoft: Fornitore = {
  prov: 'microsoft',
  nome: 'Outlook',
  idApp: idApp,
  pronto: function () {
    const p = leggi();
    return !!p && (p.scade > Date.now() + 60000 || (!!p.r && p.rScade > Date.now()));
  },
  collega: function () { return vai('select_account', ''); },
  ricollega: function (email: string) { return vai('', email).then(function () { /* mai */ }); },
  dimentica: async function () { scrivi(null); },

  calendari: async function () {
    const r = await chiama<{ value?: { id: string; name?: string; canEdit?: boolean; isDefaultCalendar?: boolean }[] }>(
      'GET', '/me/calendars?$select=id,name,canEdit,isDefaultCalendar&$top=100');
    return ((r && r.value) || []).map(function (c): CalendarioRemoto {
      return { id: c.id, nome: c.name || 'Calendario', lettura: c.canEdit === false, principale: !!c.isDefaultCalendar };
    });
  },

  eventi: async function (c: string, da: number, a: number) {
    /* calendarView e non events: è calendarView che ESPANDE le ricorrenze —
       ogni martedì della riunione arriva come un evento a sé, col suo id */
    let via: string = '/me/calendars/' + encodeURIComponent(c) + '/calendarView?startDateTime=' +
      encodeURIComponent(new Date(da).toISOString()) + '&endDateTime=' + encodeURIComponent(new Date(a).toISOString()) +
      '&$top=200&' + CAMPI;
    const out: EventoRemoto[] = [];
    for (let giro = 0; giro < 20 && via; giro++) {
      const r = await chiama<{ value?: EventoGraph[]; '@odata.nextLink'?: string }>('GET', via, undefined, FUSO);
      ((r && r.value) || []).forEach(function (e) { out.push(traduci(e)); });
      via = (r && r['@odata.nextLink']) || '';
    }
    return out;
  },

  evento: async function (_c: string, id: string) {
    try {
      const r = await chiama<EventoGraph>('GET', ev(id) + '?' + CAMPI, undefined, FUSO);
      return r ? traduci(r) : null;
    } catch (e) {
      if (e instanceof ErroreCalendario && e.tipo === 'sparito') return null;
      throw e;
    }
  },

  aggiorna: async function (_c: string, id: string, w: Scrittura) {
    const r = await chiama<EventoGraph>('PATCH', ev(id), corpoDi(w), FUSO);
    if (!r) throw new ErroreCalendario('altro', 'Microsoft non ha restituito l’evento.');
    return traduci(r);
  },

  togli: async function (_c: string, id: string) {
    try { await chiama('DELETE', ev(id)); }
    catch (e) { if (!(e instanceof ErroreCalendario && e.tipo === 'sparito')) throw e; }
  },

  crea: async function (c: string, testo: string, tempo, chiave: string) {
    /* `transactionId` è fatto apposta: se la stessa creazione arriva due
       volte (due dispositivi, o una rete che ripete), Microsoft ne fa una */
    const corpo = Object.assign({ transactionId: chiave }, corpoDi({ testo: testo, tempo: tempo }));
    const r = await chiama<EventoGraph>('POST', '/me/calendars/' + encodeURIComponent(c) + '/events', corpo, FUSO);
    if (!r) throw new ErroreCalendario('altro', 'Microsoft non ha restituito l’evento.');
    return traduci(r);
  }
};
