/* ============================================================
   CHE COSA VUOLE OGNI PANNELLO — un contratto, non un elenco.

   I quindici pannelli si aprono con `apriFoglio(titolo, quale, props)`, e
   `props` era una mappa qualunque: `Record<string, unknown>`. Vuol dire che
   un `apriFoglio('…', 'mancata', { di: id })` — con la chiave sbagliata —
   compilava benissimo, e il pannello si apriva con `id` indefinito. È la
   stessa specie di difetto della regola di fusione dimenticata: un
   CONTRATTO fra due pezzi che nessuno controlla.

   Questa tabella lo controlla. `apriFoglio` è generica su `quale`, quindi
   `props` viene preteso della forma giusta per QUEL pannello, con i nomi
   dei campi che quel pannello legge davvero.

   PERCHÉ STA IN UN FILE SUO, e non in `app.ts` né nel registro.
   `app.ts` ne ha bisogno per dichiarare `apriFoglio`, ma non deve conoscere
   i pannelli — se li conoscesse tornerebbe l'anello che il registro degli
   schermi esiste per rompere. Le righe qui sotto sono `import type`, che
   il compilatore cancella: a tempo d'esecuzione questo file non esiste, e
   `app.ts` non importa un bel niente da nessun pannello.
   ============================================================ */
import type { PropTimer } from './Timer';
import type { PropMancata } from './Mancata';
import type { PropAbitudine } from './Abitudine';
import type { PropQuandoPasso } from './QuandoPasso';

/* i cinque che non chiedono niente: `{}` e basta. Non è `unknown` e non è
   una mappa vuota qualunque — è «questo pannello non prende proprietà», e
   passargliene una è un errore. */
type Niente = Record<string, never>;

export interface PropDiFoglio {
  filtri: { dopo?: () => void };
  menu: Niente;
  aree: Niente;
  guida: Niente;
  review: Niente;
  backup: Niente;
  diagnostica: Niente;
  ritmo: Niente;
  scheda: { id: string };
  lezione: { id: string };
  'da-abitudine': { id: string };
  abitudine: PropAbitudine;
  'quando-passo': PropQuandoPasso;
  mancata: PropMancata;
  timer: PropTimer;
}

export type NomeFoglio = keyof PropDiFoglio;
