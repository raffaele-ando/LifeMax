/* ============================================================
   I CALENDARI E LIFEMAX, NEI DUE SENSI.

   Gli eventi dei calendari scelti diventano attività di LifeMax; quello che
   cambi qui — l'ora, il giorno, la durata, il titolo, o l'attività stessa
   che elimini — torna nel calendario. «Fatto» resta qui: un calendario non
   sa cosa vuol dire.

   IL PROBLEMA VERO NON È PARLARE CON GOOGLE: È SAPERE CHI HA RAGIONE.
   Qui c'è scritto 15:00, su Google 16:00. Chi l'ha spostato? Se è stato
   Google, la riga va aggiornata; se sei stato tu, va spedito. Guardando solo
   le due versioni non si può sapere. Per questo ogni attività collegata si
   porta dietro una FOTOGRAFIA dell'ultimo accordo (`esterno.istantanea`):
     · uguale qui, diverso là      → è cambiato il calendario: si aggiorna qui
     · diverso qui, uguale là      → l'hai cambiato tu: si spedisce
     · diverso da tutte e due      → CONFLITTO. Vince il calendario, e il
                                     Diario lo racconta. Il calendario lo
                                     vedono anche gli altri (chi ti ha
                                     invitato, chi ha spostato la riunione):
                                     a parità di dubbio, la sua è la versione
                                     più probabilmente vera.
     · uguali tutte e tre          → niente da fare

   I DUE DISPOSITIVI. Due telefoni collegati allo stesso calendario importano
   lo stesso evento ognuno per conto suo. Se l'attività avesse un id a caso,
   dopo la fusione nel cloud ce ne sarebbero due. L'id invece NASCE
   DALL'EVENTO (`idAzione`): stessa provenienza, stesso calendario, stesso
   evento → stesso id, e la fusione di dati.ts ne fa una riga sola.

   LE CANCELLAZIONI, NEI DUE SENSI.
     · sparito là (cancellato, o rifiutato da te) → si toglie qui. Se era già
       fatta resta, staccata: è storia tua, non dell'agenda.
     · tolto qui A MANO → si cancella là. «A mano» vuol dire `tolti` nel
       profilo, che scrive dati.ts solo quando elimini un'attività o la
       rimetti fra le cose da fare. Le lapidi non bastano e sarebbero
       pericolose: le lascia anche «Azzera tutto», e nessuno vuole che
       azzerare LifeMax svuoti il calendario di lavoro.

   COSA NON SI IMPORTA, e perché:
     · il passato. La finestra guarda da sette giorni fa a sessanta avanti,
       ma un'attività NUOVA nasce solo da oggi in poi: la riunione di
       martedì scorso comparirebbe come una cosa non fatta, e i conti della
       settimana mentirebbero. Quelle già collegate invece si seguono anche
       nei giorni passati.
     · gli eventi cancellati e quelli che hai rifiutato.
     · il «luogo di lavoro» di Google: è un'etichetta sulla giornata, non un
       impegno.
     · gli eventi privati di un calendario altrui arrivano senza titolo: si
       importano come «Impegno», e quel nome non viene mai scritto là.

   I FUSI ORARI. LifeMax pensa in giorni («AAAA-MM-GG») e ore («HH:MM») di
   questo dispositivo. Un evento con orario è un ISTANTE, e lo si porta qui
   col fuso locale: una riunione alle 9 di New York, vista da Roma, è alle
   15. Un evento di tutto il giorno è invece una DATA e resta quella data
   ovunque. Un evento di più giorni compare il giorno in cui comincia; vedi
   `conOrario` in fornitore.ts e `tempoDaScrivere` qui sotto.

   QUANDO SI GIRA. All'apertura, tornando sull'app (non più di una volta
   ogni cinque minuti), qualche secondo dopo che hai cambiato un'attività
   collegata, e quando tocchi «Sincronizza ora». Mai due giri insieme: se ne
   arriva un altro mentre uno è in corso, si rifà alla fine. Senza rete non
   si fa niente, e si riprova quando torna.

   I PERMESSI, DUE STRADE. Quali calendari, con che area, dove scrivere:
   sono nel profilo e si sincronizzano. Il permesso di Google o di Microsoft
     · CON LA SENTINELLA (server.ts: il Worker ha i suoi segreti e hai fatto
       l'accesso a LifeMax) lo tiene il server, cifrato, e lo rinnova da
       solo: vale per l'account, su ogni dispositivo, e il calendario si
       guarda anche ad app chiusa;
     · SENZA, resta in questo browser come sempre, e ogni dispositivo si
       collega da sé. Il pannello lo dice.
   L'algoritmo qui sotto è lo stesso per tutte e due: cambia solo il
   fornitore che risponde (vedi FORNITORI).

   PIÙ LONTANO DI SESSANTA GIORNI (solo con la sentinella). Le attività
   nascono dagli eventi dei prossimi sessanta giorni, come prima: oltre, un
   anno di riunioni gonfierebbe i dati che vanno nel cloud. Ma le viste
   della Giornata mostrano anche gli eventi più lontani, presi dallo
   specchio della sentinella (`fantasmi`), e uno diventa un'attività vera
   appena lo tocchi.
   ============================================================ */
import { LM } from '../dati/dati';
import type { Azione, Esterno, Istantanea, Provenienza, Calendari, AccountCalendario, CalendarioScelto, Giorno, Ora } from '../tipi/stato';
import type { Fornitore, EventoRemoto, Scrittura } from './fornitore';
import { ErroreCalendario, istante, piuGiorni, giornoDi, giorniFra } from './fornitore';
import { google, chiaveGoogle, precarica } from './google';
import { microsoft, completaRitorno } from './microsoft';
import type { OpServer } from './server';
import {
  viaServer, fornitoreServer, controllaServizio, aggiornaSpecchio, contoServer, completaRitornoServer, spiegaEsito, confermaCollegamento,
  spedisciSubito, eventiSpecchio, eventoSpecchio, daNeutro, versioneSpecchio
} from './server';

/* CHI RISPONDE PER OGNI CALENDARIO: la sentinella se c'è (e hai fatto
   l'accesso), il browser se no. Si decide ogni volta che lo si chiede:
   l'accesso a LifeMax può arrivare dopo l'apertura dell'app. */
const SERVITI: Record<Provenienza, Fornitore> = { google: fornitoreServer('google', 'Google'), microsoft: fornitoreServer('microsoft', 'Outlook') };
const NEL_BROWSER: Record<Provenienza, Fornitore> = { google: google, microsoft: microsoft };
export const FORNITORI: Record<Provenienza, Fornitore> = {
  get google() { return viaServer('google') ? SERVITI.google : NEL_BROWSER.google; },
  get microsoft() { return viaServer('microsoft') ? SERVITI.microsoft : NEL_BROWSER.microsoft; }
};
export { viaServer };
const ORDINE: Provenienza[] = ['google', 'microsoft'];

const PRIMA = 7;          /* giorni guardati all'indietro */
const DOPO = 60;          /* e in avanti */
const RITORNO_MS = 5 * 60000;
const ATTESA_MODIFICA = 4000;

/* ------------------------------------------------------------ la configurazione */
export function conf(): Calendari {
  const s = LM.load();
  return s.profilo.calendari || {};
}
/* il profilo si scrive sempre dallo stato vivo, e si salva */
function cambiaConf(fai: (c: Calendari) => void): void {
  const s = LM.load();
  const c = s.profilo.calendari || (s.profilo.calendari = {});
  fai(c);
  LM.save();
}
function account(c: Calendari, p: Provenienza): AccountCalendario {
  const a = c[p];
  if (a) return a;
  const nuovo: AccountCalendario = { collegato: false, email: '', calendari: {} };
  c[p] = nuovo;
  return nuovo;
}

/* ------------------------------------------------------- l'id che nasce dall'evento
   cyrb53: un'impronta di 53 bit, abbastanza perché due eventi diversi non
   finiscano mai sulla stessa riga, e sempre la stessa su ogni dispositivo. */
function impronta(s: string, seme: number): string {
  let h1 = 0xdeadbeef ^ seme, h2 = 0x41c6ce57 ^ seme;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
export function idAzione(p: Provenienza, cal: string, evento: string): string {
  const k = p + '|' + cal + '|' + evento;
  return 'cal' + impronta(k, 1) + impronta(k, 2);
}

/* ------------------------------------------------------------ i confronti */
interface Campi { testo: string; data: Giorno; ora: Ora | null; durata: number | null }
const campi = (x: Campi): Campi => ({ testo: x.testo, data: x.data, ora: x.ora || null, durata: x.durata || null });
const uguali = (a: Campi, b: Campi): boolean =>
  a.testo === b.testo && a.data === b.data && a.ora === b.ora && a.durata === b.durata;
const istDa = (e: EventoRemoto): Istantanea =>
  ({ testo: e.testo, data: e.data, ora: e.ora, durata: e.durata, versione: e.versione });

/* COSA SCRIVERE per una riga cambiata qui: solo i campi cambiati, e la
   versione da cui si parte (la sentinella non scrive se là nel frattempo è
   cambiato). La stessa funzione serve al giro e a `spedisciOra`: la stessa
   modifica deve uscire identica dalle due strade, perché la sentinella la
   riconosca e la faccia una volta sola. */
function scritturaPer(loc: Campi, base: Campi, ev: EventoRemoto | null, versione: string): Scrittura {
  const w: Scrittura = {};
  if (loc.testo !== base.testo) w.testo = loc.testo;
  if (loc.data !== base.data || loc.ora !== base.ora || loc.durata !== base.durata) w.tempo = tempoDaScrivere(loc, base, ev);
  w.se = versione;
  return w;
}

/* COME SI SCRIVE IL TEMPO DI UN'ATTIVITÀ SPOSTATA.
   La regola che conta: spostare non accorcia. Un evento di tre ore spostato
   di un giorno dura ancora tre ore, anche se qui la riga ne mostra di meno
   (un evento di più giorni qui arriva fino a mezzanotte). Solo se hai
   cambiato la DURATA la fine diventa quella che hai scelto. */
function tempoDaScrivere(loc: Campi, base: Campi, ev: EventoRemoto | null): Required<Scrittura>['tempo'] {
  if (!loc.ora) {
    /* senza orario = tutto il giorno; se lo era già, tiene i suoi giorni */
    const giorni = ev && ev.tuttoIlGiorno ? Math.max(1, giorniFra(ev.data, giornoDi(ev.fine))) : 1;
    return { tuttoIlGiorno: true, inizio: 0, fine: 0, dataInizio: loc.data, dataFine: piuGiorni(loc.data, giorni) };
  }
  const inizio = istante(loc.data, loc.ora);
  let lungo: number;
  if (loc.durata && loc.durata !== base.durata) lungo = loc.durata * 60000;
  else if (ev && !ev.tuttoIlGiorno && ev.fine > ev.inizio) lungo = ev.fine - ev.inizio;
  else lungo = (loc.durata || 30) * 60000;
  return { tuttoIlGiorno: false, inizio: inizio, fine: inizio + lungo, dataInizio: loc.data, dataFine: loc.data };
}

/* ----------------------------------------------------- lo stato di questo dispositivo
   Quello che NON va nel profilo: se qui serve un tocco, se c'è un giro in
   corso, cosa è successo nell'ultimo. Vale per questo browser e basta. */
export interface StatoQui {
  inCorso: boolean;
  ricollega: Record<Provenienza, boolean>;
  errore: string;       /* l'ultimo intoppo di un collegamento, detto semplice */
  /* quello che vale solo qui: «su questo dispositivo serve un tocco». Non
     va nell'esito del profilo, che si sincronizza: l'altro telefono, che
     il permesso ce l'ha, leggerebbe un problema che non è suo. */
  nota: string;
  ultimo: number;
}
const qui: StatoQui = { inCorso: false, ricollega: { google: false, microsoft: false }, errore: '', nota: '', ultimo: 0 };
export function statoQui(): StatoQui { return qui; }

/* SE QUESTO BROWSER È MAI STATO COLLEGATO. Serve a dire la cosa giusta
   quando il permesso non c'è: «è scaduto, ricollega» a chi l'aveva, «basta
   un tocco anche qui» al dispositivo nuovo che vede la scelta arrivata dal
   cloud. */
const QUI_KEY = 'lifemax.calendari.qui';
function eraQui(p: Provenienza): boolean {
  try { return !!(JSON.parse(localStorage.getItem(QUI_KEY) || '{}') as Record<string, boolean>)[p]; } catch { return false; }
}
function segnaQui(p: Provenienza, si: boolean): void {
  try {
    const v = JSON.parse(localStorage.getItem(QUI_KEY) || '{}') as Record<string, boolean>;
    if (si) v[p] = true; else delete v[p];
    localStorage.setItem(QUI_KEY, JSON.stringify(v));
  } catch { /* vale per questa visita */ }
}
function avvisa(): void { window.dispatchEvent(new CustomEvent('lm:calendari')); }

function attivo(p: Provenienza): boolean {
  const a = conf()[p];
  return !!a && a.collegato && !!FORNITORI[p].idApp();
}

/* ============================================================== IL GIRO */
type Op =
  | { t: 'crea'; az: Azione }
  | { t: 'aggiorna'; id: string; ev: EventoRemoto; conflitto: boolean }
  | { t: 'istantanea'; id: string; ist: Istantanea; invito?: Esterno['invito'] }
  | { t: 'sparito'; id: string }
  | { t: 'collega'; id: string; esterno: Esterno; ev: EventoRemoto }
  | { t: 'tolto'; id: string; cancellato?: boolean }
  | { t: 'lettura'; prov: Provenienza; cal: string }
  | { t: 'rifiutato'; prov: Provenienza; testo: string; cosa: 'cancellazione' | 'modifica' | 'creazione'; tolto?: string };

interface Conto { nuove: number; aggiornate: number; spedite: number; tolte: number; conflitti: number; rifiutate: number }

/* UN NO SU UNA RIGA NON FERMA LE ALTRE (verifica del 25 novembre 2026, G2).
   Prima un errore «vero» (non la rete, non il permesso: un 400, un 500 che
   resta, la sentinella che non riesce più a leggere il permesso) su UNA
   cancellazione o UNA modifica faceva saltare tutto il giro di quel
   fornitore: niente eventi nuovi, niente spostamenti, per giorni — e il
   pannello diceva «Tutto allineato». Adesso quella riga si conta fra le
   «non accettate», il pannello lo dice, e il giro va avanti. La rete e il
   permesso scaduto restano errori di tutto il giro: lì non c'è niente da
   fare riga per riga. */
const RIFIUTI_MAX = 3;
const RIPROVA_MS = 10 * 60000;
function rifiuto(e: unknown): boolean {
  if (!(e instanceof ErroreCalendario)) return false;
  return e.tipo === 'altro';
}

/* UN FORNITORE, TUTTO IL SUO GIRO. Legge, decide, spedisce — ma non tocca
   lo stato: raccoglie le operazioni, e le applica `applica` alla fine, tutte
   insieme, sullo stato di QUEL momento. Durante le attese di rete può
   arrivare una fusione dal cloud che rifà lo stato da capo, e una riga presa
   in mano prima delle attese sarebbe di uno stato che non c'è più. */
async function giroDi(f: Fornitore, ops: Op[], conto: Conto): Promise<void> {
  const p = f.prov;
  const s = LM.load();
  const c = conf();
  const acc = account(Object.assign({}, c), p);
  const oggi = LM.todayKey();
  const da = istante(piuGiorni(oggi, -PRIMA), null), a = istante(piuGiorni(oggi, DOPO + 1), null);
  const tolti = c.tolti || {};

  /* le attività già collegate a questo fornitore, per calendario ed evento */
  const legate = new Map<string, Azione>();
  s.azioni.forEach(function (x) { if (x.esterno && x.esterno.prov === p) legate.set(x.esterno.cal + '|' + x.esterno.id, x); });
  const toltiOra = new Set<string>();

  /* 1. LE CANCELLAZIONI CHIESTE QUI */
  for (const idA of Object.keys(tolti)) {
    const t = tolti[idA];
    if (!t || t.fatto || t.prov !== p) continue;
    toltiOra.add(t.cal + '|' + t.id);
    /* tornata in vita (un annulla, un backup): non si cancella niente */
    if (s.azioni.some(function (x) { return x.id === idA; })) { ops.push({ t: 'tolto', id: idA }); continue; }
    const sc = acc.calendari[t.cal];
    if (!sc || !sc.lettura) {
      try {
        await f.togli(t.cal, t.id); conto.tolte++;
        ops.push({ t: 'tolto', id: idA, cancellato: true });
        continue;
      }
      catch (e) {
        if (rifiuto(e)) {
          /* resta da fare: si riprova al giro dopo, fino a RIFIUTI_MAX */
          ops.push({ t: 'rifiutato', prov: p, testo: '', cosa: 'cancellazione', tolto: idA });
          conto.rifiutate++;
          continue;
        }
        if (!(e instanceof ErroreCalendario && e.tipo === 'permesso')) throw e;
        ops.push({ t: 'lettura', prov: p, cal: t.cal });
      }
    }
    ops.push({ t: 'tolto', id: idA });
  }

  /* 2. I CALENDARI SCELTI */
  const scelti = Object.keys(acc.calendari).filter(function (k) { const v = acc.calendari[k]; return !!v && v.on; });
  for (const cal of scelti) {
    const sc = acc.calendari[cal] as CalendarioScelto;
    const eventi = await f.eventi(cal, da, a);
    const visti = new Set<string>();
    for (const ev of eventi) {
      const k = cal + '|' + ev.id;
      visti.add(k);
      const az = legate.get(k);
      if (!az) {
        if (ev.via || ev.data < oggi || toltiOra.has(k)) continue;
        const idA = idAzione(p, cal, ev.id);
        /* c'è già con quell'id ma staccata, o tolta a mano e non ancora
           spedita: in tutti e due i casi qualcuno ha deciso, e non si rifà */
        if (tolti[idA] || s.azioni.some(function (x) { return x.id === idA; })) continue;
        ops.push({ t: 'crea', az: nuova(idA, p, cal, ev, sc) });
        conto.nuove++;
        continue;
      }
      if (ev.via) { ops.push({ t: 'sparito', id: az.id }); continue; }
      await confronta(f, az, ev, sc, ops, conto);
    }
    /* le collegate che la finestra non ha restituito: o sono sparite, o
       sono state spostate fuori dalla finestra. Si chiede l'evento uno per
       uno — è raro, e indovinare vorrebbe dire cancellare una riunione
       spostata al mese prossimo. */
    for (const [k, az] of legate) {
      if (visti.has(k) || !az.esterno || az.esterno.cal !== cal) continue;
      const ist = az.esterno.istantanea;
      const nellaFinestra = ist.data >= piuGiorni(oggi, -PRIMA) && ist.data <= piuGiorni(oggi, DOPO);
      if (!nellaFinestra && uguali(campi(az), campi(ist))) continue;
      const ev = await f.evento(cal, az.esterno.id);
      if (!ev || ev.via) ops.push({ t: 'sparito', id: az.id });
      else await confronta(f, az, ev, sc, ops, conto);
    }
  }

  /* 3. LE NUOVE ATTIVITÀ CON ORARIO, NEL CALENDARIO SCELTO */
  const dest = c.destinazione || '';
  if (dest.indexOf(p + '|') === 0) {
    const cal = dest.slice(p.length + 1);
    const daQuando = c.destinazioneDa || Infinity;
    for (const x of s.azioni) {
      /* `esterno === undefined` e non «falso»: `null` vuol dire staccata
         apposta, e una staccata non si rispedisce */
      if (x.esterno !== undefined || !x.ora || x.done || x.dopo || x.data < oggi || x.creata < daQuando) continue;
      const loc = campi(x);
      const tempo = tempoDaScrivere(loc, { testo: '', data: loc.data, ora: null, durata: null }, null);
      let ev: EventoRemoto;
      try { ev = await f.crea(cal, x.testo, tempo, p === 'google' ? chiaveGoogle(x.id) : x.id); }
      catch (e) {
        if (!rifiuto(e)) throw e;
        ops.push({ t: 'rifiutato', prov: p, testo: x.testo, cosa: 'creazione' });
        conto.rifiutate++;
        continue;
      }
      ops.push({ t: 'collega', id: x.id, esterno: { prov: p, cal: cal, id: ev.id, istantanea: istDa(ev), invito: ev.invito || 'solo' }, ev: ev });
      conto.spedite++;
    }
  }
}

function nuova(id: string, p: Provenienza, cal: string, ev: EventoRemoto, sc: CalendarioScelto): Azione {
  const s = LM.load();
  /* l'area scelta per il calendario, se esiste ancora; se no «Altro» */
  const area = s.aree.some(function (x) { return x.id === sc.areaId; }) ? sc.areaId : 'altro';
  const ora = Date.now();
  return {
    id: id, areaId: area, testo: ev.testo, ifThen: '', mit: false, done: false,
    data: ev.data, doneAt: null, creata: ora, ora: ev.ora, durata: ev.durata, passoDi: null,
    esterno: Object.assign({ prov: p, cal: cal, id: ev.id, istantanea: istDa(ev) }, ev.invito ? { invito: ev.invito } : {}), aggiornata: ora
  };
}

async function confronta(f: Fornitore, az: Azione, ev: EventoRemoto, sc: CalendarioScelto, ops: Op[], conto: Conto): Promise<void> {
  const est = az.esterno as Esterno;
  const base = campi(est.istantanea), loc = campi(az), rem = campi(ev);
  const remCambiato = !uguali(rem, base), locCambiato = !uguali(loc, base);
  if (!remCambiato && !locCambiato) {
    /* anche «chi c'è» si tiene allineato: le righe importate prima che lo si
       leggesse lo imparano al primo giro */
    if (ev.versione !== est.istantanea.versione || (ev.invito && ev.invito !== est.invito)) ops.push({ t: 'istantanea', id: az.id, ist: istDa(ev), invito: ev.invito });
    return;
  }
  /* cambiati tutti e due, ma nello stesso modo: non è un conflitto */
  if (uguali(loc, rem)) { ops.push({ t: 'istantanea', id: az.id, ist: istDa(ev), invito: ev.invito }); return; }
  if (remCambiato) {
    ops.push({ t: 'aggiorna', id: az.id, ev: ev, conflitto: locCambiato });
    conto.aggiornate++;
    if (locCambiato) conto.conflitti++;
    return;
  }
  /* cambiato solo qui. Su un calendario in sola lettura la modifica resta
     qui: là non si può scrivere, e rimetterla com'era sarebbe disfare
     quello che hai appena fatto. */
  if (sc.lettura) return;
  const w = scritturaPer(loc, base, ev, ev.versione);
  try {
    const nuovo = await f.aggiorna(est.cal, est.id, w);
    /* si prende quello che il calendario dice DOPO: se ha arrotondato
       qualcosa, la riga si allinea e il giro dopo non rispedisce. Con la
       sentinella può tornare «conflitto»: là era cambiato nel frattempo, e
       vince il calendario come sempre */
    ops.push({ t: 'aggiorna', id: az.id, ev: nuovo, conflitto: !!nuovo.conflitto });
    if (nuovo.conflitto) { conto.aggiornate++; conto.conflitti++; }
    else conto.spedite++;
  } catch (e) {
    if (e instanceof ErroreCalendario && e.tipo === 'sparito') { ops.push({ t: 'sparito', id: az.id }); return; }
    if (e instanceof ErroreCalendario && e.tipo === 'permesso') { ops.push({ t: 'lettura', prov: est.prov, cal: est.cal }); return; }
    if (rifiuto(e)) { ops.push({ t: 'rifiutato', prov: est.prov, testo: az.testo, cosa: 'modifica' }); conto.rifiutate++; return; }
    throw e;
  }
}

/* LE OPERAZIONI, TUTTE INSIEME, SULLO STATO DI ADESSO. Un salvataggio solo. */
let applicando = false;
const detti = new Set<string>();
function applica(ops: Op[], nomeDi: (p: Provenienza) => string): boolean {
  if (!ops.length) return false;
  const s = LM.load();
  const ora = Date.now();
  const trova = (id: string) => s.azioni.find(function (x) { return x.id === id; });
  ops.forEach(function (op) {
    if (op.t === 'crea') {
      if (!trova(op.az.id)) s.azioni.push(op.az);
    } else if (op.t === 'aggiorna') {
      const az = trova(op.id);
      if (!az || !az.esterno) return;
      if (op.conflitto) {
        LM.registra('calendario', '«' + az.testo + '» era cambiata qui e anche su ' + nomeDi(az.esterno.prov) +
          ': ho tenuto la versione del calendario' + (op.ev.testo !== az.testo ? ' («' + op.ev.testo + '»)' : '') + '.', true);
      }
      az.testo = op.ev.testo; az.data = op.ev.data; az.ora = op.ev.ora; az.durata = op.ev.durata;
      az.esterno.istantanea = istDa(op.ev);
      if (op.ev.invito) az.esterno.invito = op.ev.invito;
      az.aggiornata = ora;
    } else if (op.t === 'istantanea') {
      const az = trova(op.id);
      if (!az || !az.esterno) return;
      az.esterno.istantanea = op.ist;
      if (op.invito) az.esterno.invito = op.invito;
      az.aggiornata = ora;
    } else if (op.t === 'sparito') {
      const i = s.azioni.findIndex(function (x) { return x.id === op.id; });
      const az = s.azioni[i];
      if (!az || !az.esterno) return;
      if (az.done) {
        /* già fatta: è storia tua, resta — ma non è più collegata a niente */
        LM.registra('calendario', '«' + az.testo + '» non c’è più su ' + nomeDi(az.esterno.prov) + ': qui resta, fatta, e non è più collegata.', false);
        az.esterno = null;
        az.aggiornata = ora;
      } else {
        s.azioni.splice(i, 1);
        LM.registra('calendario', '«' + az.testo + '» è stata cancellata su ' + nomeDi(az.esterno.prov) + ': tolta anche qui.', false);
      }
    } else if (op.t === 'collega') {
      const az = trova(op.id);
      if (!az || az.esterno !== undefined) return;
      az.esterno = op.esterno;
      az.testo = op.ev.testo; az.data = op.ev.data; az.ora = op.ev.ora; az.durata = op.ev.durata;
      az.aggiornata = ora;
    } else if (op.t === 'tolto') {
      const c = s.profilo.calendari || (s.profilo.calendari = {});
      const t = (c.tolti || (c.tolti = {}))[op.id];
      if (t) t.fatto = true;
      /* TORNATA IN VITA MENTRE LA SI CANCELLAVA LÀ (verifica 4, V4-05): un
         annulla arrivato fra la lettura e la fine del giro. Là non c'è più:
         qui resta, staccata, e lo si dice — se restasse legata a un evento
         che non esiste, il giro dopo la toglierebbe di nuovo. */
      const viva = op.cancellato ? trova(op.id) : undefined;
      if (viva && viva.esterno) {
        LM.registra('calendario', '«' + viva.testo + '» era già stata cancellata su ' + nomeDi(viva.esterno.prov) + ': qui resta, e non è più collegata.', true);
        viva.esterno = null;
        viva.aggiornata = ora;
      }
    } else if (op.t === 'rifiutato') {
      const nome = nomeDi(op.prov);
      if (op.tolto) {
        const c = s.profilo.calendari || (s.profilo.calendari = {});
        const t = (c.tolti || (c.tolti = {}))[op.tolto];
        if (!t || t.fatto) return;
        /* lo stesso no ripetuto dalla sentinella entro dieci minuti è
           sempre quello: si conta una volta */
        if (t.rifiutoTs && ora - t.rifiutoTs < RIPROVA_MS) return;
        t.rifiutoTs = ora;
        t.rifiuti = (t.rifiuti || 0) + 1;
        if (t.rifiuti >= RIFIUTI_MAX) {
          t.fatto = true;
          LM.registra('calendario', nome + ' non ha accettato ' + RIFIUTI_MAX + ' volte la cancellazione di un evento' +
            (op.testo ? ' («' + op.testo + '»)' : '') + ': su ' + nome + ' resta, e se non serve più va tolto da lì.', true);
        }
        return;
      }
      /* una riga nel Diario una volta sola per sessione, non a ogni giro */
      const k = op.prov + '|' + op.cosa + '|' + op.testo;
      if (detti.has(k)) return;
      detti.add(k);
      LM.registra('calendario', nome + ' non ha accettato ' + (op.cosa === 'creazione' ? 'il nuovo evento' : 'la modifica') +
        ' di «' + op.testo + '»: qui resta com’è, e riprovo più tardi.', true);
    } else if (op.t === 'lettura') {
      const c = s.profilo.calendari || (s.profilo.calendari = {});
      const sc = account(c, op.prov).calendari[op.cal];
      if (sc) sc.lettura = true;
    }
  });
  return true;
}

/* le cancellazioni spedite da più di due mesi non servono più a nessuno */
function sfoltisci(c: Calendari): void {
  const t = c.tolti;
  if (!t) return;
  const soglia = Date.now() - 60 * 86400000;
  Object.keys(t).forEach(function (k) { const v = t[k]; if (v && v.fatto && v.ts < soglia) delete t[k]; });
}

/* L'ESITO, DETTO COME LO DIREBBE UNA PERSONA. Niente codici, niente
   «errore»: la maggior parte delle volte non è successo niente di grave, e
   quando serve un gesto il testo dice quale. */
function racconta(conto: Conto, intoppi: string[]): string {
  const pezzi: string[] = [];
  if (conto.nuove) pezzi.push(conto.nuove + (conto.nuove === 1 ? ' attività nuova' : ' attività nuove'));
  if (conto.aggiornate) pezzi.push(conto.aggiornate + (conto.aggiornate === 1 ? ' aggiornata' : ' aggiornate'));
  if (conto.spedite) pezzi.push(conto.spedite + (conto.spedite === 1 ? ' modifica mandata' : ' modifiche mandate') + ' al calendario');
  if (conto.tolte) pezzi.push(conto.tolte + (conto.tolte === 1 ? ' cancellata' : ' cancellate') + ' anche là');
  if (conto.rifiutate) pezzi.push(conto.rifiutate + (conto.rifiutate === 1 ? ' modifica non accettata' : ' modifiche non accettate') + ' dal calendario (riprovo più tardi)');
  /* «Tutto allineato» solo se è vero: con un intoppo o una modifica non
     accettata non lo è (G2) */
  let t = pezzi.length ? pezzi.join(', ') + '.' : (intoppi.length ? '' : 'Tutto allineato.');
  if (conto.conflitti) {
    t += ' ' + (conto.conflitti === 1 ? 'Una era cambiata' : conto.conflitti + ' erano cambiate') +
      ' da tutte e due le parti: ho tenuto la versione del calendario, e nel Diario c’è scritto quale.';
  }
  if (intoppi.length) t += ' ' + intoppi.join(' ');
  return t.trim();
}

/* ------------------------------------------------------------ un giro intero */
let corrente: Promise<void> | null = null;
let ancora = false;
let pendente = false;

export function sincronizza(perche: string): Promise<void> {
  if (corrente) { ancora = true; return corrente; }
  corrente = (async function () {
    do { ancora = false; await unGiro(perche); } while (ancora);
  })().finally(function () { corrente = null; qui.inCorso = false; avvisa(); });
  return corrente;
}

async function unGiro(perche: string): Promise<void> {
  const quali = ORDINE.filter(attivo);
  if (!quali.length) return;
  if (!navigator.onLine) { pendente = true; return; }
  qui.inCorso = true; avvisa();
  const ops: Op[] = [];
  const conto: Conto = { nuove: 0, aggiornate: 0, spedite: 0, tolte: 0, conflitti: 0, rifiutate: 0 };
  const intoppi: string[] = [];
  const note: string[] = [];
  let rete = false, provati = 0;
  /* con la sentinella, prima di tutto lo specchio: una richiesta sola porta
     tutto quello che è cambiato là (anche mentre l'app era chiusa) */
  let specchioOk = true;
  if (quali.some(viaServer)) {
    try { await aggiornaSpecchio(accesi()); }
    catch (e) {
      specchioOk = false;
      if (e instanceof ErroreCalendario && e.tipo === 'rete') { rete = true; intoppi.push('LifeMax adesso non raggiunge il calendario: riprovo fra poco.'); }
      else intoppi.push(e instanceof Error ? e.message : String(e));
    }
  }
  for (const p of quali) {
    const f = FORNITORI[p];
    if (viaServer(p) && !specchioOk) continue;
    if (!f.pronto()) {
      /* niente permesso QUI: non è un problema del calendario, è di questo
         browser (o, con la sentinella, dell'account), e lo dice il pannello */
      if (viaServer(p)) {
        qui.ricollega[p] = true;
        const cs = contoServer(p);
        note.push(cs && cs.revocato
          ? 'Il permesso di ' + f.nome + ' è stato ritirato (o è scaduto): basta un tocco su «Ricollega».'
          : 'Da adesso il permesso di ' + f.nome + ' lo tiene LifeMax, e vale su tutti i tuoi dispositivi: serve un tocco su «Ricollega», una volta sola.');
        continue;
      }
      qui.ricollega[p] = eraQui(p);
      if (qui.ricollega[p]) note.push('Il permesso di ' + f.nome + ' su questo dispositivo è scaduto: basta un tocco su «Ricollega».');
      continue;
    }
    try {
      await giroDi(f, ops, conto);
      qui.ricollega[p] = false;
      provati++;
    } catch (e) {
      /* quello che un fornitore aveva già deciso prima dell'intoppo vale lo
         stesso: le scritture già fatte là devono arrivare anche qui */
      const err = e instanceof ErroreCalendario ? e : new ErroreCalendario('altro', String((e as Error)?.message || e));
      if (err.tipo === 'token') {
        qui.ricollega[p] = true;
        note.push(viaServer(p) ? 'Il permesso di ' + f.nome + ' non vale più: basta un tocco su «Ricollega».'
          : 'Il permesso di ' + f.nome + ' su questo dispositivo è scaduto: basta un tocco su «Ricollega».');
      } else if (err.tipo === 'rete') {
        rete = true;
        intoppi.push(f.nome + ' adesso non risponde: riprovo fra poco.');
      } else {
        intoppi.push(f.nome + ': ' + err.message);
      }
    }
  }
  if (rete) pendente = true;
  qui.ultimo = Date.now();
  qui.nota = note.join(' ');
  /* l'esito comune si scrive solo se QUESTO dispositivo ha davvero parlato
     con un calendario: un telefono senza permesso non ha niente da dire
     agli altri */
  const parlato = provati > 0 || intoppi.length > 0;
  if (!ops.length && !parlato) return;
  applicando = true;
  try {
    applica(ops, function (p) { return FORNITORI[p].nome; });
    const s = LM.load();
    const c = s.profilo.calendari || (s.profilo.calendari = {});
    sfoltisci(c);
    if (parlato) c.esito = { ts: Date.now(), ok: !intoppi.length && !conto.rifiutate, testo: racconta(conto, intoppi) };
    LM.save();
  } finally { applicando = false; }
  ultimaFirma = firma();
  void perche;
}

/* --------------------------------------------- «qualcosa è cambiato qui?»
   Un'impronta delle sole righe che contano: quelle collegate, quelle che
   aspettano di essere spedite, le cancellazioni da fare. Se dopo un
   salvataggio è diversa da quella dell'ultimo giro, c'è qualcosa da
   mandare. Tutto il resto che si salva — una spunta, un check-in — non
   sveglia nessuno. */
let ultimaFirma = '';
function firma(): string {
  const s = LM.load();
  const c = s.profilo.calendari || {};
  const parti: string[] = [];
  s.azioni.forEach(function (x) {
    if (x.esterno) parti.push(x.id + x.testo + x.data + (x.ora || '') + (x.durata || ''));
    else if (x.esterno === undefined && c.destinazione && x.ora && x.creata >= (c.destinazioneDa || Infinity)) parti.push('+' + x.id);
  });
  Object.keys(c.tolti || {}).forEach(function (k) { const t = (c.tolti || {})[k]; if (t && !t.fatto) parti.push('-' + k); });
  return parti.join('|');
}

let attesaModifica: ReturnType<typeof setTimeout> | null = null;
let attesaSubito: ReturnType<typeof setTimeout> | null = null;
function forseCambiato(): void {
  if (applicando || !ORDINE.some(function (p) { return attivo(p) && FORNITORI[p].pronto(); })) return;
  if (firma() === ultimaFirma) return;
  /* con la sentinella la modifica parte SUBITO (un quarto di secondo, per
     raccogliere i salvataggi di un gesto solo), in una richiesta che
     sopravvive alla chiusura dell'app. Il giro di qualche secondo dopo
     controlla com'è andata. */
  if (ORDINE.some(viaServer)) {
    if (attesaSubito) clearTimeout(attesaSubito);
    attesaSubito = setTimeout(function () { attesaSubito = null; spedisciOra(); }, 250);
  }
  if (attesaModifica) clearTimeout(attesaModifica);
  attesaModifica = setTimeout(function () { attesaModifica = null; void sincronizza('modifica'); }, ATTESA_MODIFICA);
}

/* i calendari accesi, per fornitore, come li vuole lo specchio */
function accesi(): Partial<Record<Provenienza, string[]>> {
  const c = conf();
  const out: Partial<Record<Provenienza, string[]>> = {};
  ORDINE.forEach(function (p) {
    const a = c[p];
    if (!viaServer(p) || !a || !a.collegato) return;
    out[p] = Object.keys(a.calendari).filter(function (k) { const v = a.calendari[k]; return !!v && v.on; });
  });
  return out;
}

/* LE MODIFICHE DA MANDARE, DECISE SENZA LA RETE. È la stessa decisione
   del giro (le cancellazioni chieste qui, le righe cambiate solo qui, le
   nuove con orario), presa guardando lo specchio invece del calendario:
   così può partire anche nell'ultimo istante prima che l'app si chiuda. In
   dubbio (l'evento non è nello specchio, o là è cambiato) non manda niente:
   decide il giro, con le regole di sempre. */
function piano(): OpServer[] {
  const s = LM.load();
  const c = conf();
  const oggi = LM.todayKey();
  const out: OpServer[] = [];
  const tolti = c.tolti || {};
  ORDINE.forEach(function (p) {
    const a = c[p];
    if (!viaServer(p) || !a || !a.collegato || !FORNITORI[p].pronto()) return;
    Object.keys(tolti).forEach(function (idA) {
      const t = tolti[idA];
      if (!t || t.fatto || t.prov !== p) return;
      if (s.azioni.some(function (x) { return x.id === idA; })) return;
      const sc = a.calendari[t.cal];
      if (sc && sc.lettura) return;
      out.push({ p: p, tipo: 'togli', c: t.cal, id: t.id });
    });
    s.azioni.forEach(function (x) {
      const e = x.esterno;
      if (!e || e.prov !== p) return;
      const sc = a.calendari[e.cal];
      if (!sc || !sc.on || sc.lettura) return;
      const base = campi(e.istantanea), loc = campi(x);
      if (uguali(loc, base)) return;
      const n = eventoSpecchio(p, e.cal, e.id);
      if (!n || n.via || (n.v || '') !== e.istantanea.versione) return;
      const ev = daNeutro(n);
      if (uguali(loc, campi(ev))) return;
      out.push({ p: p, tipo: 'aggiorna', c: e.cal, id: e.id, w: scritturaPer(loc, base, ev, ev.versione) });
    });
    const dest = c.destinazione || '';
    if (dest.indexOf(p + '|') === 0) {
      const cal = dest.slice(p.length + 1);
      const daQuando = c.destinazioneDa || Infinity;
      s.azioni.forEach(function (x) {
        if (x.esterno !== undefined || !x.ora || x.done || x.dopo || x.data < oggi || x.creata < daQuando) return;
        const loc = campi(x);
        out.push({ p: p, tipo: 'crea', c: cal, testo: x.testo, tempo: tempoDaScrivere(loc, { testo: '', data: loc.data, ora: null, durata: null }, null),
          chiave: p === 'google' ? chiaveGoogle(x.id) : x.id });
      });
    }
  });
  return out;
}
function spedisciOra(): void {
  try { spedisciSubito(piano()); } catch { /* il giro ci riprova */ }
}

/* =============================================================== I GESTI */

/* «Sincronizza ora». Il permesso di Google, se è scaduto, si rinnova QUI,
   prima di qualunque attesa: siamo dentro al tocco, ed è l'unico momento in
   cui aprire la finestrella di Google è una cosa chiesta. */
export async function sincronizzaOra(): Promise<void> {
  const g = conf().google;
  if (attivo('google') && !viaServer('google') && !google.pronto() && g) {
    try { await google.ricollega(g.email); qui.ricollega.google = false; qui.nota = ''; segnaQui('google', true); }
    catch (e) { qui.errore = e instanceof Error ? e.message : String(e); }
  }
  await sincronizza('tocco');
}

export async function collega(p: Provenienza): Promise<void> {
  qui.errore = '';
  try {
    const email = await FORNITORI[p].collega();
    await dopoCollegato(p, email);
  } catch (e) {
    qui.errore = e instanceof Error ? e.message : String(e);
    avvisa();
  }
}

export async function ricollega(p: Provenienza): Promise<void> {
  qui.errore = '';
  const a = conf()[p];
  try {
    await FORNITORI[p].ricollega(a ? a.email : '');
    qui.ricollega[p] = false;
    qui.nota = '';
    segnaQui(p, true);
    avvisa();
    await sincronizza('tocco');
  } catch (e) {
    qui.errore = e instanceof Error ? e.message : String(e);
    avvisa();
  }
}

/* appena collegato: l'account si segna nel profilo e si scarica l'elenco
   dei calendari. NESSUNO acceso: sei tu a dire quali — un calendario di
   lavoro con trenta riunioni a settimana che entra da solo in LifeMax è il
   modo più veloce per riempire «Oggi» di rumore. */
async function dopoCollegato(p: Provenienza, email: string): Promise<void> {
  if (!email && viaServer(p)) {
    try { await aggiornaSpecchio(accesi()); } catch { /* l'email arriva al prossimo giro */ }
    const cs = contoServer(p);
    email = cs ? cs.email : '';
  }
  cambiaConf(function (c) {
    const a = account(c, p);
    a.collegato = true;
    if (email) a.email = email;
  });
  qui.ricollega[p] = false;
  segnaQui(p, true);
  await aggiornaCalendari(p);
}

export async function aggiornaCalendari(p: Provenienza): Promise<void> {
  if (!FORNITORI[p].pronto()) return;
  try {
    const elenco = await FORNITORI[p].calendari();
    cambiaConf(function (c) {
      const a = account(c, p);
      const pr = elenco.find(function (x) { return x.principale; });
      if (!a.email && pr && p === 'google') a.email = pr.id;
      elenco.forEach(function (x) {
        const gia = a.calendari[x.id];
        if (gia) { gia.nome = x.nome; gia.lettura = x.lettura; return; }
        a.calendari[x.id] = { nome: x.nome, on: false, areaId: 'lavoro', lettura: x.lettura };
      });
    });
  } catch (e) {
    if (e instanceof ErroreCalendario && e.tipo === 'token') qui.ricollega[p] = true;
    else qui.errore = e instanceof Error ? e.message : String(e);
  }
  avvisa();
}

export function scegli(p: Provenienza, cal: string, patch: Partial<CalendarioScelto>): void {
  cambiaConf(function (c) {
    const sc = account(c, p).calendari[cal];
    if (sc) Object.assign(sc, patch);
  });
  avvisa();
  if (patch.on) void sincronizza('scelta');
}

export function scegliDestinazione(v: string): void {
  cambiaConf(function (c) {
    c.destinazione = v;
    /* da ADESSO: le attività che hai già non partono tutte insieme */
    c.destinazioneDa = v ? Date.now() : 0;
  });
  ultimaFirma = firma();
  avvisa();
}

export function salvaId(p: Provenienza, v: string): void {
  cambiaConf(function (c) { if (p === 'google') c.idGoogle = v.trim(); else c.idMicrosoft = v.trim(); });
  avvisa();
}

/* SCOLLEGARE, e cosa fare delle attività che erano arrivate da lì.
     'tieni'  restano, staccate: non si sincronizzano più, ma sono tue
     'togli'  se ne vanno — tranne quelle fatte, che sono storia
   In nessuno dei due casi si cancella niente nel calendario: scollegare
   vuol dire smettere di parlarsi, non buttare via l'agenda. */
export async function scollega(p: Provenienza, modo: 'tieni' | 'togli'): Promise<void> {
  await FORNITORI[p].dimentica();
  segnaQui(p, false);
  const s = LM.load();
  const ora = Date.now();
  s.azioni = s.azioni.filter(function (x) {
    if (!x.esterno || x.esterno.prov !== p) return true;
    if (modo === 'togli' && !x.done) return false;
    x.esterno = null;
    x.aggiornata = ora;
    return true;
  });
  const c = s.profilo.calendari || (s.profilo.calendari = {});
  const a = account(c, p);
  a.collegato = false;
  Object.keys(a.calendari).forEach(function (k) { const v = a.calendari[k]; if (v) v.on = false; });
  if ((c.destinazione || '').indexOf(p + '|') === 0) { c.destinazione = ''; c.destinazioneDa = 0; }
  LM.registra('calendario', 'Scollegato ' + FORNITORI[p].nome + (modo === 'togli' ? ': tolte le attività che ne arrivavano.' : ': le attività restano, staccate.'), true);
  LM.save();
  qui.ricollega[p] = false;
  ultimaFirma = firma();
  avvisa();
}

/* ============================================================== L'AVVIO */
let avviato = false;
export function avviaCalendari(onRitorno?: () => void): void {
  if (avviato) return;
  avviato = true;

  /* c'è la sentinella? si chiede una volta, senza fermare niente */
  void controllaServizio().then(function () { avvisa(); });

  /* tornati da Google o Microsoft passando dalla sentinella */
  const daServer = completaRitornoServer();
  if (daServer) {
    const rp = daServer.p;
    void attendiAccesso().then(function () {
      /* il permesso è tornato ma non è ancora nostro: lo si conferma, da qui */
      if (daServer.esito === 'da-confermare') return confermaCollegamento(rp);
      return { esito: daServer.esito, email: '' };
    }).then(function (r) {
      if (r.esito === 'ok') {
        qui.ricollega[rp] = false; qui.nota = '';
        /* l'email la porta lo specchio, che così si carica subito coi calendari */
        return dopoCollegato(rp, '').then(function () { void sincronizza('collegato'); });
      }
      qui.errore = spiegaEsito(r.esito, NEL_BROWSER[rp].nome);
      avvisa();
      return undefined;
    }).then(function () { if (onRitorno) onRitorno(); });
  }

  /* i fantasmi (gli eventi lontani nelle viste) diventano attività appena
     li tocchi: il tocco arriva QUI prima che al suo pulsante */
  LM.registraFantasmi(fantasmi);
  document.addEventListener('pointerdown', toccaFantasma, true);
  document.addEventListener('click', toccaFantasma, true);

  /* l'app va in secondo piano o si chiude: le modifiche partono adesso */
  const via = function () { if (ORDINE.some(viaServer) && firma() !== ultimaFirma) spedisciOra(); };
  window.addEventListener('pagehide', via);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') via(); });

  /* tornati da Microsoft con un codice in tasca */
  completaRitorno().then(function (email) {
    if (email === null) return;
    void dopoCollegato('microsoft', email).then(function () { if (onRitorno) onRitorno(); });
  }, function (e) {
    qui.errore = e instanceof Error ? e.message : String(e);
    avvisa();
    if (onRitorno) onRitorno();
  });

  /* UN PERMESSO RITIRATO DA UN ALTRO DISPOSITIVO. Se là hai scollegato, il
     profilo arriva qui con `collegato: false`: il permesso di questo browser
     non serve più a niente e si butta. */
  const ritirati = function () {
    ORDINE.forEach(function (p) {
      const a = conf()[p];
      /* solo nel browser: con la sentinella il permesso è dell'account, e un
         dispositivo che non ha ancora ricevuto il profilo non deve ritirarlo */
      if (viaServer(p)) return;
      if (a && !a.collegato && (FORNITORI[p].pronto() || eraQui(p))) { segnaQui(p, false); void FORNITORI[p].dimentica(); }
    });
  };

  document.addEventListener('lm:change', function () { if (!applicando) { ritirati(); forseCambiato(); } });
  window.addEventListener('lm:remote', function () { ritirati(); forseCambiato(); });
  window.addEventListener('lm:auth', function () {
    /* la prima fusione col cloud può portare qui la configurazione fatta su
       un altro dispositivo: un giro, ma non uno ogni volta che l'account
       dice qualcosa */
    const au = window.LM_AUTH;
    if (au && au.user && !au.syncing && Date.now() - qui.ultimo > 20000) void sincronizza('account');
  });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && Date.now() - qui.ultimo > RITORNO_MS) void sincronizza('ritorno');
  });
  window.addEventListener('online', function () { if (pendente) { pendente = false; void sincronizza('rete'); } });

  /* il primo giro quando l'app si è già disegnata: aspettare la rete prima
     del primo disegno sarebbe uno schermo bianco */
  setTimeout(function () { ultimaFirma = firma(); void sincronizza('apertura'); }, 1500);
}

/* il pannello carica la libreria di Google appena si apre, così il tocco su
   «Collega» apre la finestra nello stesso istante (nel browser: con la
   sentinella non serve) */
export function preparaPannello(): void {
  if (!viaServer('google') && google.idApp()) void precarica().catch(function () { /* lo dirà il tocco */ });
}

/* l'accesso a LifeMax arriva qualche istante dopo l'apertura: chi ha
   bisogno della sentinella all'avvio lo aspetta (al massimo 15 secondi) */
function attendiAccesso(): Promise<void> {
  return new Promise<void>(function (ok) {
    const fatto = function () { const a = window.LM_AUTH; return !!(a && a.user); };
    if (fatto()) { ok(); return; }
    const t = setTimeout(function () { window.removeEventListener('lm:auth', su); ok(); }, 15000);
    const su = function () { if (fatto()) { clearTimeout(t); window.removeEventListener('lm:auth', su); ok(); } };
    window.addEventListener('lm:auth', su);
  });
}

/* ============================================================ I FANTASMI
   Gli eventi dello specchio che non sono (ancora) attività: quelli oltre i
   sessanta giorni, o non ancora importati. Le viste li mostrano come
   attività normali, con l'id che avranno davvero (`idAzione`), ma non
   stanno nei dati. Toccandone uno, diventa vero — con lo stesso id, quindi
   il pulsante toccato lo trova. */
const fantasmiVisti = new Map<string, Azione>();
let indice: { v: number; oggi: string; per: Map<string, { p: Provenienza; c: string; ev: EventoRemoto }[]> } | null = null;
function indiceFantasmi() {
  const oggi = LM.todayKey();
  const v = versioneSpecchio();
  if (indice && indice.v === v && indice.oggi === oggi) return indice.per;
  const per = new Map<string, { p: Provenienza; c: string; ev: EventoRemoto }[]>();
  eventiSpecchio().forEach(function (x) {
    const ev = daNeutro(x.n);
    if (ev.via || ev.data < oggi) return;
    const l = per.get(ev.data) || [];
    l.push({ p: x.p, c: x.c, ev: ev });
    per.set(ev.data, l);
  });
  indice = { v: v, oggi: oggi, per: per };
  return per;
}
function fantasmi(k: Giorno): Azione[] {
  if (!ORDINE.some(viaServer)) return [];
  const l = indiceFantasmi().get(k);
  if (!l || !l.length) return [];
  const s = LM.load();
  const c = conf();
  const tolti = c.tolti || {};
  const out: Azione[] = [];
  l.forEach(function (x) {
    const a = c[x.p];
    const sc = a && a.collegato ? a.calendari[x.c] : undefined;
    if (!sc || !sc.on || !viaServer(x.p)) return;
    const id = idAzione(x.p, x.c, x.ev.id);
    if (tolti[id] || s.azioni.some(function (y) { return y.id === id; })) return;
    const az = nuova(id, x.p, x.c, x.ev, sc);
    az.fantasma = true;
    fantasmiVisti.set(id, az);
    out.push(az);
  });
  return out;
}
function materializza(id: string): boolean {
  const f = fantasmiVisti.get(id);
  if (!f) return false;
  const s = LM.load();
  if (s.azioni.some(function (x) { return x.id === id; })) return false;
  const vera: Azione = Object.assign({}, f, { creata: Date.now(), aggiornata: Date.now() });
  delete vera.fantasma;
  s.azioni.push(vera);
  ultimaFirma = firma();
  LM.save();
  return true;
}
function toccaFantasma(e: Event): void {
  if (!fantasmiVisti.size) return;
  let el = e.target instanceof Element ? e.target : null;
  for (let giri = 0; el && giri < 12; giri++, el = el.parentElement) {
    for (const at of Array.from(el.attributes)) {
      if (at.name.indexOf('data-') === 0 && fantasmiVisti.has(at.value)) { materializza(at.value); return; }
    }
  }
}

/* LA PORTA PER LE PROVE (vedi main.tsx): le stesse funzioni dei tasti, più
   l'id di un evento — che la prova deve saper calcolare per controllare che
   due dispositivi non facciano doppioni. */
export const CALENDARI = {
  piano: function () { return piano(); },
  materializza: materializza,
  sincronizza: sincronizza,
  sincronizzaOra: sincronizzaOra,
  idAzione: idAzione,
  statoQui: statoQui,
  firma: function () { return firma(); }
};
