/* LE FORME DELL'SDK DI FIREBASE, SCRITTE A MANO E SOLO PER QUELLO CHE SI USA.

   Perché non `npm i firebase`: l'SDK qui non arriva da un pacchetto, arriva
   da `https://www.gstatic.com/firebasejs/...` con un `import()` a runtime.
   È una scelta del sito, non una dimenticanza — così l'app resta un mucchio
   di file statici e il cloud è un pezzo che può anche non caricarsi, senza
   che questo faccia cadere niente. Installare il pacchetto solo per i tipi
   vorrebbe dire tenere allineate DUE versioni di Firebase: quella su npm e
   quella nell'indirizzo. Due posti dove una versione può essere diversa.

   Quindi qui sotto ci sono i tipi delle sole funzioni che questo file chiama
   davvero — una decina — e sono tipi OPACHI dove il contenuto non ci
   interessa (`App`, `Auth`, `Db`, `Rif`): non si finge di sapere com'è fatto
   dentro un DocumentReference, si sa soltanto che lo si passa a `getDoc`.
   Se domani l'SDK cambia una firma, questo file non compila più — che è
   esattamente il momento in cui va guardato.  */

declare const marchioApp: unique symbol;
declare const marchioAuth: unique symbol;
declare const marchioDb: unique symbol;
declare const marchioRif: unique symbol;
declare const marchioColl: unique symbol;
declare const marchioProv: unique symbol;

export type App = { readonly [marchioApp]: true };
export type Auth = { readonly [marchioAuth]: true };
export type Db = { readonly [marchioDb]: true };
export type Rif = { readonly [marchioRif]: true };
export type Coll = { readonly [marchioColl]: true };
export type Provider = { readonly [marchioProv]: true; setCustomParameters(p: Record<string, string>): void };

/* l'utente come lo dà Firebase: quattro campi, e tre possono mancare */
export interface UtenteFirebase {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  /* il «gettone» firmato da Google che dice chi sei: lo controlla la
     sentinella dei calendari (sentinella/identita.mjs). Firebase lo tiene e
     lo rinnova da sé; `true` lo fa rinnovare subito. */
  getIdToken?(forza?: boolean): Promise<string>;
}

export interface Documento {
  id: string;
  exists(): boolean;
  /* la forma la decide chi legge: il documento principale, una fetta, una copia */
  data(): (DatiDocumento & Partial<DatiFetta> & Partial<DatiCopia>) | undefined;
  /* Firestore consegna OGNI scrittura anche a chi l'ha fatta, e la consegna
     due volte: subito, dal suo ottimismo locale (`hasPendingWrites`), e di
     nuovo quando il server l'ha accettata. Chi ascolta deve saperlo
     distinguere, altrimenti si scambia la propria eco per un altro
     dispositivo — vedi `ascolta` in nuvola.ts. Facoltativo perché nelle
     versioni vecchie dell'SDK poteva non esserci, e qui non si finge di
     sapere più di quello che si usa. */
  metadata?: { hasPendingWrites: boolean; fromCache: boolean };
}

/* l'ora del server, come la consegna Firestore */
export interface OraServer { toMillis(): number }
/* il segnaposto «metti qui l'ora del server» che si manda scrivendo */
export type SegnapostoOra = { readonly __segnaposto: true };

/* UN PEZZO NEL DOCUMENTO PRINCIPALE: quale versione (`h`) e in quante fette */
export interface VocePezzo { h: string; n: number }

/* il documento come lo scriviamo noi. Due forme, perché una versione
   vecchia dell'app aperta in una scheda può ancora scrivere la prima:
     · VECCHIA: tutto lo stato in JSON nel campo `data`;
     · NUOVA (`schema: 2`): lo stato diviso in pezzi (src/nuvola/pezzi.ts),
       e qui solo l'elenco dei pezzi con la loro impronta. */
export interface DatiDocumento {
  data?: string;
  updatedAt?: number;
  salvato?: number;
  email?: string;
  name?: string;
  schema?: number;
  rev?: number;
  scrittore?: string;
  pezzi?: Record<string, VocePezzo>;
  servito?: OraServer | SegnapostoOra | null;
  ultimaCopia?: number;
  avviso?: string;
  /* la versione più vecchia dell'app che può ancora scrivere (nuvola.ts, M5) */
  versioneMinima?: number;
  /* la «cassetta delle lettere»: quello che un dispositivo ha mandato
     mentre la pagina si chiudeva (vedi `pagehide` in nuvola.ts), per
     dispositivo, in JSON */
  posta?: Record<string, string>;
}

/* una fetta di un pezzo: users/{uid}/pezzi/{nome~impronta~i} */
export interface DatiFetta { data: string; nome: string; h: string; i: number; n: number; rev: number }

/* una copia di sicurezza nuova: users/{uid}/copie/{id}, con le fette sotto */
export interface DatiCopia {
  ts: number; salvato: number; motivo: string; ricchezza: number; n: number;
  nome?: string; visione?: string; schema?: number;
}

/* il documento di un dispositivo: serve a misurare l'orologio */
export interface DatiDispositivo { servito?: OraServer | SegnapostoOra | null; visto?: number }

export interface Transazione {
  get(rif: Rif): Promise<Documento>;
  set(rif: Rif, dati: object): Transazione;
  delete(rif: Rif): Transazione;
}
export interface Lotto {
  set(rif: Rif, dati: object): Lotto;
  delete(rif: Rif): Lotto;
  commit(): Promise<void>;
}

export interface Elenco {
  forEach(f: (d: Documento) => void): void;
  size?: number;
}

export interface ErroreFirebase { code?: string; message?: string }

export interface ModuloApp {
  initializeApp(config: Record<string, string>): App;
}

export interface ModuloAuth {
  getAuth(app: App): Auth;
  GoogleAuthProvider: new () => Provider;
  setPersistence(auth: Auth, p: unknown): Promise<void>;
  browserLocalPersistence: unknown;
  signInWithPopup(auth: Auth, p: Provider): Promise<unknown>;
  signInWithRedirect(auth: Auth, p: Provider): Promise<unknown>;
  getRedirectResult(auth: Auth): Promise<unknown>;
  signOut(auth: Auth): Promise<void>;
  onAuthStateChanged(auth: Auth, f: (u: UtenteFirebase | null) => void): () => void;
}

export interface ModuloFirestore {
  initializeFirestore(app: App, opz: { experimentalAutoDetectLongPolling: boolean }): Db;
  getFirestore(app: App): Db;
  doc(db: Db, ...parti: string[]): Rif;
  collection(db: Db, ...parti: string[]): Coll;
  getDoc(rif: Rif): Promise<Documento>;
  getDocs(coll: Coll): Promise<Elenco>;
  setDoc(rif: Rif, dati: object): Promise<void>;
  deleteDoc(rif: Rif): Promise<void>;
  onSnapshot(rif: Rif, ok: (d: Documento) => void, ko: (e: ErroreFirebase) => void): () => void;
  runTransaction<T>(db: Db, f: (tx: Transazione) => Promise<T>, opz?: { maxAttempts?: number }): Promise<T>;
  writeBatch(db: Db): Lotto;
  serverTimestamp(): SegnapostoOra;
}
