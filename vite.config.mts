/* IL BUILD, UNO SOLO.

   Prima erano due: `costruisci.mjs` con esbuild per il sito, e Vite in
   modalità libreria per l'isola React. Due motori vogliono dire due posti
   dove una regola può essere diversa — e infatti l'isola per un giro intero
   è finita nel pacco in versione di sviluppo senza che nessuno lo notasse.
   Adesso è Vite e basta.

   `base: './'`, perché il sito non sta alla radice del dominio ma sotto
   /LifeMax/: un indirizzo assoluto come /pacco/x.js là non esiste.  */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rmSync } from 'node:fs';

const QUI = dirname(fileURLToPath(import.meta.url));

/* SI SVUOTA `pacco/` A MANO, PRIMA DI OGNI BUILD.
   Il nome dei file porta dentro l'impronta del contenuto, quindi ogni build
   ne scrive di nuovi e lascia in pace i vecchi. Con `emptyOutDir: false` —
   che qui è obbligatorio, vedi sotto — nessuno li toglieva: otto generazioni
   di `index-*.js` con le loro mappe, cinque megabyte di roba morta, tutta
   committata. `pacco/` la scrive solo il build, quindi svuotarla è sicuro
   quanto svuotare una normale cartella d'uscita: è quello che Vite farebbe
   da sé se potesse. */
const svuotaPacco = {
  name: 'lm-svuota-pacco',
  apply: 'build' as const,
  buildStart() { rmSync(resolve(QUI, 'pacco'), { recursive: true, force: true }); }
};

export default defineConfig({
  root: resolve(QUI, 'src'),
  publicDir: resolve(QUI, 'public'),
  base: './',
  plugins: [react(), svuotaPacco],
  build: {
    /* SI COSTRUISCE NELLA RADICE, e non in una cartella d'uscita.
       GitHub Pages serve il ramo così com'è, dalla radice: un `index.html`
       in `docs/` vuol dire che l'indirizzo del sito non ha un `index.html`
       e Pages mostra il README. È successo.
       E c'è una seconda ragione, che vale anche il giorno che si cambia
       ospite: UN SERVICE WORKER CONTROLLA SOLO LE PAGINE AL SUO LIVELLO O
       SOTTO. In `docs/sw.js` i promemoria valgono per `/docs/…` e per
       nient'altro; in radice valgono per tutto il sito.
       `emptyOutDir: false` è obbligatorio: qui dentro ci sono anche `src/`,
       `prove/`, `promemoria/` — svuotare vorrebbe dire cancellarli. A
       svuotare `pacco/`, che è l'unica cartella che il build possiede
       davvero, ci pensa il pezzo qui sopra. */
    outDir: QUI,
    emptyOutDir: false,
    /* i telefoni di qualche anno fa: la stessa scelta del build di prima */
    target: 'es2019',
    /* MA LO STILE NON SI TRADUCE, e queste due righe valgono un bug vero.

       `cssTarget` senza un valore suo prende quello di `target`, e a quel
       punto il CSS che quei browser non conoscono non viene tradotto: viene
       TOLTO. `esnext` vuol dire «non toccarlo» — questo foglio è scritto a
       mano per i browser di questa app, e i prefissi `-webkit-` se li porta
       già dietro dove servono.

       E il minificatore è esbuild e non lightningcss (che in Vite 8 è
       quello di serie). Lightningcss guarda `backdrop-filter` e
       `-webkit-backdrop-filter` scritti uno sotto l'altro, decide che sono
       la stessa dichiarazione due volte, e ne tiene UNA: quella col
       prefisso. Su Chrome, che l'alias col prefisso non ce l'ha più, il
       vetro della barra e della colonna spariva — cioè metà dell'aspetto
       dell'app — e insieme se ne andavano `inset` e `grid-row`. Nessun
       errore, nessun avviso: il sito esce e si vede diverso.
       L'ha trovato `prove/disegno.js`, che conta le sfocature e ne ha
       trovate zero dove ne aspettava trentotto. */
    cssTarget: 'esnext',
    cssMinify: 'esbuild',
    assetsDir: 'pacco',
    sourcemap: true
  }
});
