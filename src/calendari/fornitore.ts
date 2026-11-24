/* ============================================================
   QUELLO CHE OGNI CALENDARIO DEVE SAPER FARE — un contratto, due fornitori.

   Google e Microsoft parlano due lingue diverse: uno dice `summary` e
   l'altro `subject`, uno scrive le ore con il fuso dentro e l'altro accanto,
   uno chiama «etag» quello che l'altro chiama «changeKey». La
   sincronizzazione non deve saperlo. Parla con questo contratto, e i due
   file `google.ts` e `microsoft.ts` traducono.

   Il vantaggio non è l'eleganza: è che l'algoritmo — la parte dove si
   decide chi ha ragione, che è quella dove si perdono i dati — esiste UNA
   volta sola, ed è la stessa per tutti e due.
   ============================================================ */
import type { Giorno, Ora, Provenienza } from '../tipi/stato';
import { giorno, ora } from '../tipi/stato';

/* UN EVENTO, GIÀ TRADOTTO NELLA LINGUA DI LIFEMAX. Ore e giorni sono
   quelli di QUESTO dispositivo: un evento alle 9 a New York, visto da Roma,
   qui è alle 15. È quello che serve a chi guarda la giornata. */
export interface EventoRemoto {
  id: string;
  testo: string;
  data: Giorno;
  ora: Ora | null;
  durata: number | null;
  versione: string;
  tuttoIlGiorno: boolean;
  /* i due capi veri, in millisecondi: servono a spostare un evento di più
     giorni senza accorciarlo */
  inizio: number;
  fine: number;
  /* cancellato, o rifiutato da te: per LifeMax è come se non ci fosse */
  via: boolean;
}

export interface CalendarioRemoto {
  id: string;
  nome: string;
  lettura: boolean;
  principale: boolean;
}

/* COSA SCRIVERE. Solo quello che è cambiato: se hai spostato l'ora, il
   titolo là non si tocca — e un evento senza titolo («Impegno», qui) non si
   ritrova con un titolo che non ha mai avuto. */
export interface Scrittura {
  testo?: string;
  tempo?: {
    tuttoIlGiorno: boolean;
    inizio: number;          /* per un evento con orario */
    fine: number;
    dataInizio: Giorno;      /* per uno di tutto il giorno */
    dataFine: Giorno;        /* esclusa, come la vogliono tutti e due */
  };
}

/* PERCHÉ È ANDATA MALE, detto in cinque parole e non in cinquanta codici.
   La sincronizzazione decide cosa fare guardando solo questo:
     token     serve un tocco su «Ricollega»
     rete      niente rete, o il server non risponde: si riprova dopo
     permesso  il calendario non ti lascia scrivere
     sparito   l'evento non c'è più
     altro     tutto il resto, col testo del server dentro */
export type TipoErrore = 'token' | 'rete' | 'permesso' | 'sparito' | 'altro';
export class ErroreCalendario extends Error {
  tipo: TipoErrore;
  stato: number;
  constructor(tipo: TipoErrore, messaggio: string, stato?: number) {
    super(messaggio);
    this.tipo = tipo;
    this.stato = stato || 0;
  }
}

export interface Fornitore {
  prov: Provenienza;
  /* il nome che si legge: «Google», «Outlook» */
  nome: string;
  /* il Client ID in vigore, '' se manca */
  idApp(): string;
  /* c'è un permesso valido su questo dispositivo, senza chiedere niente? */
  pronto(): boolean;
  /* COLLEGA si chiama solo da un tocco: apre la finestra di Google, o porta
     alla pagina di Microsoft. Torna l'email dell'account. */
  collega(): Promise<string>;
  /* il rinnovo del permesso con un tocco, quando quello silenzioso non basta */
  ricollega(email: string): Promise<void>;
  /* dimentica il permesso su questo dispositivo (e, se si può, lo revoca) */
  dimentica(): Promise<void>;
  /* il permesso, SENZA aprire niente: se serve una finestra, ErroreCalendario('token') */
  calendari(): Promise<CalendarioRemoto[]>;
  eventi(cal: string, da: number, a: number): Promise<EventoRemoto[]>;
  /* un evento solo; `null` se non c'è più */
  evento(cal: string, id: string): Promise<EventoRemoto | null>;
  aggiorna(cal: string, id: string, w: Scrittura): Promise<EventoRemoto>;
  togli(cal: string, id: string): Promise<void>;
  /* `chiave` rende la creazione ripetibile: due dispositivi che spediscono
     la stessa attività fanno UN evento, non due */
  crea(cal: string, testo: string, w: Required<Scrittura>['tempo'], chiave: string): Promise<EventoRemoto>;
}

/* ------------------------------------------------------------ il tempo */
function due(n: number): string { return (n < 10 ? '0' : '') + n; }

/* un istante → il giorno e l'ora di QUESTO dispositivo */
export function giornoDi(ms: number): Giorno {
  const d = new Date(ms);
  return giorno(d.getFullYear() + '-' + due(d.getMonth() + 1) + '-' + due(d.getDate()));
}
export function oraDi(ms: number): Ora {
  const d = new Date(ms);
  return ora(due(d.getHours()) + ':' + due(d.getMinutes()));
}
/* il contrario: un giorno e un'ora di qui → l'istante. `new Date(a, m, g,
   h, min)` lavora nel fuso locale, ora legale compresa: è esattamente la
   domanda «che istante è, qui, alle 9 di quel giorno». */
export function istante(g: Giorno, o: Ora | null): number {
  const [a, m, d] = g.split('-').map(Number);
  const [h, mi] = (o || '00:00').split(':').map(Number);
  return new Date(a || 1970, (m || 1) - 1, d || 1, h || 0, mi || 0, 0, 0).getTime();
}
export function piuGiorni(g: Giorno, n: number): Giorno {
  const [a, m, d] = g.split('-').map(Number);
  const x = new Date(a || 1970, (m || 1) - 1, (d || 1) + n, 12);
  return giornoDi(x.getTime());
}
export function giorniFra(a: Giorno, b: Giorno): number {
  return Math.round((istante(b, ora('12:00')) - istante(a, ora('12:00'))) / 86400000);
}

/* UN EVENTO CON ORARIO, IN UNA RIGA DI LIFEMAX.
   La riga ha un giorno solo, e la giornata finisce a mezzanotte. Quindi un
   evento che dura più giorni compare il giorno in cui comincia, e la sua
   durata qui si ferma a mezzanotte: un blocco di trenta ore disegnato sulla
   griglia di un giorno coprirebbe tutto il resto. Spostarlo lo sposta
   intero — vedi `tempoDaScrivere` in sincronia.ts, che conserva la sua
   lunghezza vera — mentre cambiarne la durata qui cambia davvero la fine. */
export function conOrario(inizio: number, fine: number): { data: Giorno; ora: Ora; durata: number | null } {
  const data = giornoDi(inizio);
  const mezzanotte = istante(piuGiorni(data, 1), null);
  const min = Math.round((Math.min(fine, mezzanotte) - inizio) / 60000);
  return { data: data, ora: oraDi(inizio), durata: min > 0 ? min : null };
}

/* SENZA TITOLO. Un evento privato di un calendario condiviso arriva senza
   nome, e una riga vuota nella giornata non si tocca né si legge: si chiama
   «Impegno», che è quello che è. Il titolo vero non c'è, quindi non si
   riscrive mai — `Scrittura.testo` parte solo se lo cambi tu. */
export const SENZA_TITOLO = 'Impegno';
