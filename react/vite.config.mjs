/* IL BUILD DELL'ISOLA REACT.

   Esce in `assets/react/` con nomi fissi, e da lì se lo prende
   `costruisci.mjs`, che gli mette l'impronta nel nome e lo tratta come il
   Design lab: un pezzo che si carica SOLO quando serve. Chi non accende
   l'interruttore non scarica React.

   `lib` e non `app`: qui non si costruisce un sito, si costruisce un pezzo
   che una pagina già viva monta dentro a un contenitore. Il formato è IIFE
   perché deve poter essere caricato con un `<script>` normale, senza moduli e
   senza `import` a runtime — la stessa strada del laboratorio.  */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const QUI = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  /* IN MODALITÀ LIBRERIA VITE NON LO SOSTITUISCE DA SÉ, e senza questa riga
     dentro al pacco finisce la versione di SVILUPPO di React: più grossa, più
     lenta, e con dentro tutti gli avvisi da console. Il primo build era
     583 KB per questo motivo. È l'errore classico di `build.lib`, e non fa
     rumore: funziona tutto, costa solo il doppio. */
  define: { 'process.env.NODE_ENV': '"production"' },
  resolve: { alias: { react: 'preact/compat', 'react-dom': 'preact/compat',
    'react-dom/client': 'preact/compat', 'react/jsx-runtime': 'preact/jsx-runtime' } },
  build: {
    outDir: resolve(QUI, '..', 'assets', 'react'),
    emptyOutDir: true,
    /* i telefoni di qualche anno fa: la stessa scelta del resto del build */
    target: 'es2019',
    lib: {
      entry: resolve(QUI, 'src', 'monta.jsx'),
      name: 'LM_REACT',
      formats: ['iife'],
      fileName: () => 'isola.js'
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: { assetFileNames: 'isola.[ext]' }
    }
  }
});
