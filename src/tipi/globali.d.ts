/* I QUATTRO GLOBALI CHE RESTANO, E PERCHÉ NON SONO UNA SVISTA.

   Qui c'erano dieci nomi: i pezzi che nel browser vivevano su `window`
   perché ci arrivavano da uno `<script>` — i disegni, la forma, i grafici,
   i promemoria, il laboratorio. Adesso quelli sono moduli e chi li vuole se
   li importa: sei righe sparite, e con loro la possibilità che qualcuno
   chiami `window.ICO(...)` su un niente.

   I QUATTRO CHE RESTANO SONO UN APPUNTAMENTO, non una comodità.

   `LM` sta qui perché `dati.ts` e `registro.ts` si cercano a vicenda:
   `dati.ts` scrive nel registro ogni volta che salva, e il registro legge lo
   stato per la fotografia dell'ambiente. Fra moduli sarebbe un giro chiuso
   di import; su `window` è un appuntamento che nessuno dei due deve
   conoscere in anticipo.

   I tre della nuvola — `LM_AUTH`, `LM_SYNC`, `LMCloud` — stanno qui per una
   ragione diversa e più forte: la nuvola SI CARICA A PARTE, con un
   `import()`, perché va a prendere l'SDK di Firebase dalla rete e l'app deve
   funzionare anche senza. Se `app.ts` la importasse per leggere chi è
   entrato, Vite la metterebbe nel pezzo principale — cioè esattamente quello
   che il caricamento a parte esiste per evitare. Chi c'è lo si chiede a
   `window`, e chi non c'è non risponde: è la stessa cosa detta dal
   `?` accanto ai tre nomi.  */
import type { ApiLM } from '../dati/dati';
import type { Registro, Riga as RigaRegistro } from '../registro/registro';
import type { StatoAuth, StatoSync, ApiCloud, DettaglioEsempio } from '../nuvola/nuvola';

declare global {
  interface Window {
    LM: ApiLM;
    LMLog?: Registro;
    /* la nuvola: `available: false` quando l'SDK non si carica, e da lì in
       poi l'app funziona lo stesso su questo dispositivo */
    LM_AUTH?: StatoAuth;
    LM_SYNC?: StatoSync;
    LMCloud?: ApiCloud;
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
