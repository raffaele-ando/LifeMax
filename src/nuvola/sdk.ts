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
}

export interface Documento {
  id: string;
  exists(): boolean;
  data(): DatiDocumento | undefined;
}

/* il documento come lo scriviamo noi: lo stato in JSON, più quattro etichette */
export interface DatiDocumento {
  data?: string;
  updatedAt?: number;
  salvato?: number;
  email?: string;
  name?: string;
}

export interface Elenco {
  forEach(f: (d: Documento) => void): void;
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
  setDoc(rif: Rif, dati: DatiDocumento): Promise<void>;
  onSnapshot(rif: Rif, ok: (d: Documento) => void, ko: (e: ErroreFirebase) => void): () => void;
}
