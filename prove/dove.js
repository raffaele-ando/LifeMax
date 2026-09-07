/* DOVE STA IL SITO DA PROVARE, deciso in un posto.

   Le prove pilotano un browser vero e interrogano il DOM da fuori: non sanno
   né gli importa chi ha scritto il markup. È per questo che sono
   sopravvissute intere al cambio di motore — venti file, e quello che
   cambiava era il percorso da cui servire i file.

   `SERVITO` è la cartella che il server delle prove pubblica: `docs/`, quello
   che esce da Vite. Il sito non si serve più dalla radice del deposito perché
   dalla radice, adesso, i file da servire non esistono — `index.html` è un
   modello dentro `src/`, e i moduli non sono ancora né TypeScript compilato
   né uno solo.

   `RAMO` è la radice del deposito: la usano le prove che leggono il CODICE
   invece di guardare la pagina (i nomi dei segni, le regole di fusione, le
   intestazioni della cache).

   Da provare va SEMPRE il costruito, non il sorgente. Un `npm run build:nuovo`
   prima di far girare le prove non è un passaggio in più: è quello che
   trasforma «i tipi tornano» in «il sito che esce funziona». */
'use strict';
const path = require('path');

const RAMO = path.join(__dirname, '..');
const SERVITO = path.join(RAMO, 'docs');
const SRC = path.join(RAMO, 'src');

/* TUTTO IL CODICE DI SRC, IN UNA STRINGA. Le prove che leggono il codice
   invece di guardare la pagina — «l'app non chiede l'orologio a mano da
   nessuna parte», «nessun campo nasce da una scrittura diretta» — avevano
   un elenco di file scritto a mano. Un elenco va aggiornato quando nasce un
   modulo, e il giorno che qualcuno se ne dimentica la prova continua a dire
   «tutto a posto» guardando la metà dei file: è il modo in cui un controllo
   diventa un rumore che rassicura. */
function tuttoIlCodice() {
  const fs = require('fs');
  return (function raccogli(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(function (e) {
      const v = path.join(dir, e.name);
      if (e.isDirectory()) return raccogli(v);
      return /\.(ts|tsx)$/.test(e.name) ? [fs.readFileSync(v, 'utf8')] : [];
    });
  })(SRC).join('\n');
}

/* senza commenti: lì dentro c'è il racconto di com'era, e un `showPicker`
   nominato in un commento non è un `showPicker` chiamato */
function codiceVivo() {
  return tuttoIlCodice()
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

module.exports = { RAMO: RAMO, SERVITO: SERVITO, SRC: SRC, tuttoIlCodice: tuttoIlCodice, codiceVivo: codiceVivo };
