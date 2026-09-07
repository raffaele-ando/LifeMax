/* I GLOBALI CHE ESISTONO DAVVERO, DICHIARATI UNA VOLTA.

   Non è una lista di comodo: sono i pezzi che nel browser vivono su `window`
   perché ci arrivano da uno `<script>` — il registro tecnico, i disegni, la
   nuvola. Man mano che passano a modulo, le righe qui sotto sparivano una per
   una: quando questo file è vuoto, la migrazione è finita.

   QUELLO CHE RESTA È IL SEME, e non è una svista. `LM`, il registro e la
   nuvola si cercano a vicenda: `dati.ts` scrive nel registro, il registro
   legge lo stato per la fotografia dell'ambiente, la nuvola chiama tutt'e
   due. Fra moduli sarebbe un giro chiuso di import; su `window` è un
   appuntamento che nessuno dei tre deve conoscere in anticipo. È lo stesso
   motivo per cui c'erano tre `<script>` e non un albero di dipendenze.  */
import type { ApiLM } from '../dati/dati';
import type { Registro, Riga as RigaRegistro } from '../registro/registro';
import type { StatoAuth, StatoSync, ApiCloud, DettaglioEsempio } from '../nuvola/nuvola';
import type { Segni } from '../segni/segni';
import type { Forma } from '../forma/forma';
import type { Grafici } from '../grafici/grafici';
import type { Promemoria } from '../promemoria/promemoria';
import type { Lab } from '../lab/lab';

declare global {
  interface Window {
    LM: ApiLM;
    LMLog?: Registro;
    /* la nuvola: `available: false` quando l'SDK non si carica, e da lì in
       poi l'app funziona lo stesso su questo dispositivo */
    LM_AUTH?: StatoAuth;
    LM_SYNC?: StatoSync;
    LMCloud?: ApiCloud;
    /* i disegni: una funzione con quattro tabelle attaccate */
    ICO: Segni;
    GOOGLE_G: (size?: number) => string;
    LOGO: (size?: number) => string;
    /* la forma degli angoli, applicata al DOM vero */
    LM_FORMA?: Forma;
    /* i grafici: sei funzioni che scrivono SVG dentro a un contenitore */
    LMCharts: Grafici;
    /* i promemoria: il pezzo che parla col Worker postino */
    LM_PROMEMORIA?: Promemoria;
    /* il laboratorio di design: dieci mock, e si apre da una pagina sola */
    LM_LAB?: Lab;
  }
}

/* ------------------------------------------------------ GLI EVENTI DI CASA

   Gli otto eventi che i pezzi dell'app si mandano fra loro. Dichiararli qui
   serve a una cosa sola, e vale la riga: in `addEventListener('lm:...',
   function (e) {...})` il tipo di `e` diventa quello giusto, quindi `e.detail`
   si legge senza scriverci sopra un `as`. Senza questa tabella ogni ascolto
   avrebbe un cast, e un cast è dove ci si sbaglia sul nome di un campo senza
   che nessuno lo dica.

   Metà non porta niente: sono avvisi che qualcosa è cambiato, e chi ascolta
   va a guardare da sé. Quelli con un carico ce l'hanno scritto qui. */
declare global {
  interface WindowEventMap {
    /* è entrato o uscito qualcuno: `window.LM_AUTH` dice chi */
    'lm:auth': CustomEvent<void>;
    /* lo stato del salvataggio è cambiato */
    'lm:sync': CustomEvent<StatoSync>;
    /* è arrivato un aggiornamento da un altro dispositivo */
    'lm:remote': CustomEvent<void>;
    /* c'è un esempio qui e dei dati veri nell'account: chiedere prima di
       unire, e rispondere con `decidi` */
    'lm:esempio-al-cloud': CustomEvent<DettaglioEsempio>;
    /* una riga nuova nel registro tecnico */
    'lm:log': CustomEvent<RigaRegistro>;
  }
  interface DocumentEventMap {
    /* i dati sono cambiati: chi disegna ridisegna */
    'lm:change': CustomEvent<void>;
    /* il pannello che si apre da sotto si è chiuso */
    'lm:sheet-chiuso': CustomEvent<void>;
    /* localStorage ha detto no (spazio finito, o modalità privata) */
    'lm:errore-salvataggio': CustomEvent<void>;
    /* quello che c'era salvato non si legge: JSON rotto */
    'lm:dati-illeggibili': CustomEvent<void>;
  }
}
