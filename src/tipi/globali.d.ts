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
import type { Registro } from '../registro/registro';
import type { StatoAuth, StatoSync, ApiCloud } from '../nuvola/nuvola';
import type { Segni } from '../segni/segni';
import type { Forma } from '../forma/forma';
import type { Grafici } from '../grafici/grafici';
import type { Promemoria } from '../promemoria/promemoria';

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
  }
}
