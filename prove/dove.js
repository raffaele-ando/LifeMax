/* DOVE STA IL SITO DA PROVARE, deciso in un posto.

   Le prove pilotano un browser vero e interrogano il DOM da fuori: non sanno
   né gli importa chi ha scritto il markup. È per questo che sono
   sopravvissute intere al cambio di motore — venti file, e quello che
   cambiava era il percorso da cui servire i file.

   `SERVITO` è la cartella che il server delle prove pubblica, e `RAMO` la
   radice del deposito: sono lo stesso posto, perché il build esce lì. Restano
   due nomi perché dicono due cose diverse — «da dove si serve il sito» e «da
   dove si legge il codice» — e il giorno che tornassero a essere due cartelle
   diverse cambierebbe una riga qui invece di trenta file.

   Da provare va SEMPRE il costruito, non il sorgente. Un `npm run build:nuovo`
   prima di far girare le prove non è un passaggio in più: è quello che
   trasforma «i tipi tornano» in «il sito che esce funziona». */
'use strict';
const path = require('path');

const RAMO = path.join(__dirname, '..');
/* il sito si costruisce NELLA RADICE, perché Pages serve la radice e perché
   un service worker controlla solo le pagine al suo livello o sotto: sono lo
   stesso posto (vedi vite.config.mts) */
const SERVITO = RAMO;
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
