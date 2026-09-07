/* I GLOBALI CHE ESISTONO DAVVERO, DICHIARATI UNA VOLTA.

   Non è una lista di comodo: sono i pezzi che nel browser vivono su `window`
   perché ci arrivano da uno `<script>` — il registro tecnico, i disegni, la
   nuvola. Man mano che passano a modulo, le righe qui sotto sparivano una per
   una: quando questo file è vuoto, la migrazione è finita.  */
import type { ApiLM } from '../dati/dati';

/* IL REGISTRO. È il primo di tutti a caricarsi, apposta: così prende anche
   gli errori degli script che vengono dopo. */
export interface Registro {
  info(can: string, msg: string, dati?: string): void;
  avviso(can: string, msg: string, dati?: string): void;
  errore(can: string, msg: string, dati?: string): void;
  righe(): { t: number; liv: string; can: string; msg: string; dati?: string }[];
  testo(): string;
  ora(t: number): string;
  svuota(): void;
}

declare global {
  interface Window {
    LM: ApiLM;
    LMLog?: Registro;
  }
}
