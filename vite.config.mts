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
    assetsDir: 'pacco',
    sourcemap: true
  }
});
