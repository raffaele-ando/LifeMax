/* ============================================================
   L'AVVIO — l'ordine in cui i pezzi entrano, e perché è questo.

   Prima era l'ordine di nove `<script>` in `index.html`, tenuto a mano con
   un commento accanto a ognuno. Adesso è un file: gli `import` di un modulo
   girano prima del suo corpo, quindi scrivere qui sotto le righe in
   quest'ordine è dire esattamente quello che diceva quella lista — ma in un
   posto che il compilatore controlla.

     1. IL REGISTRO PRIMO DI TUTTI. Attacca i suoi ascoltatori a
        `window.onerror` e a `unhandledrejection`: se qualcosa si rompe
        caricando i moduli dopo, quell'errore finisce nel registro tecnico
        invece che in una console che sul telefono non c'è.
     2. LO STILE, e poi la forma degli angoli. `forma.ts` disegna già alla
        prima schermata: caricata dopo, si vedrebbe un lampo di angoli tondi
        normali e poi lo scatto alla curva di Apple.
     3. I DATI. `dati.ts` scrive nel registro (che c'è già) e mette `LM` su
        `window`, dove lo cercano il service worker e la nuvola.
     4. IL REGISTRO DEGLI SCHERMI. Riempie i due registri di `app.ts` e il
        gancio per smontare i pannelli: è il modulo che conosce React, e
        `app.ts` non lo importa mai — se lo importasse tornerebbe l'anello
        che quel registro esiste per rompere.
     5. LA NUVOLA, per ultima, e senza aspettarla. Va a prendere l'SDK di
        Firebase dalla rete: l'app funziona lo stesso senza — solo su questo
        dispositivo — e farle aspettare la rete vorrebbe dire uno schermo
        bianco a chi non ce l'ha.
     6. `avvia()`, che disegna.
   ============================================================ */
import './registro/registro';
import './stile/app.css';
import './forma/forma';
import './dati/dati';
import { LM_PROMEMORIA as P } from './promemoria/promemoria';
import './grafici/grafici';
import './app/registro-schermi';
import { avvia } from './app/app';

/* la nuvola è un `import()` e non un `import`: quello che c'è dentro fa una
   richiesta di rete, e il resto dell'app non la deve aspettare. Prima era
   `<script type="module">`, che è la stessa cosa detta in HTML. */
void import('./nuvola/nuvola');

/* ============================================================
   UNA PORTA PER LE PROVE, e si chiama così apposta.

   `prove/promemoria.js` guida i promemoria da DENTRO alla pagina: chiede il
   piano di oggi, conta quante ne restano, accende la nota fissa e legge cosa
   c'è scritto — una ventina di cose che dall'interfaccia non si vedono,
   perché una notifica che non arriva non lascia traccia sullo schermo. Da
   fuori un modulo non si raggiunge: un pacco costruito non esporta niente, e
   quello è giusto così.

   La scelta era fra rifare la prova perché guidi tutto dai tasti — perdendo
   quasi tutto quello che misura — e questa riga. Vale la riga: è la sola
   parte dell'app in cui un difetto non si vede né si sente, si scopre non
   ricevendo un promemoria che doveva arrivare.

   STA QUI E NON IN `promemoria.ts`. Il modulo resta pulito e non sa di
   essere provato; è il punto in cui si monta tutto che apre la porta, che è
   il posto dove si prendono le decisioni di questo genere. E il nome dice a
   che serve: `prove/pezzi.js` controlla che dentro a `src/` non la usi
   nessuno — una porta per le prove che l'app comincia a usare smette di
   essere una porta per le prove e diventa un globale, cioè la cosa da cui
   veniamo. */
window.__PROVE__ = { promemoria: P };

avvia();
