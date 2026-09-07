/* IL BUILD, UNO SOLO.

   Prima erano due: `costruisci.mjs` con esbuild per il sito, e Vite in
   modalità libreria per l'isola React. Due motori vogliono dire due posti
   dove una regola può essere diversa — e infatti l'isola per un giro intero
   è finita nel pacco in versione di sviluppo senza che nessuno lo notasse.
   Adesso è Vite e basta.

   ESCE IN `docs/` E NON TOCCA LA RADICE. Il sito che sta in piedi adesso è
   `index.html` alla radice con `assets/`: finché la riscrittura non passa
   tutte le prove, quella resta dov'è e continua a funzionare. Quando è
   pronta si cambia una sola impostazione di GitHub Pages, da «/» a «/docs».
   Una riscrittura non deve chiedere di stare senza l'app per giorni.

   `base: './'`, perché il sito non sta alla radice del dominio ma sotto
   /LifeMax/: un indirizzo assoluto come /assets/x.js là non esiste.  */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const QUI = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: resolve(QUI, 'src'),
  publicDir: resolve(QUI, 'public'),
  base: './',
  plugins: [react()],
  build: {
    outDir: resolve(QUI, 'docs'),
    emptyOutDir: true,
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
