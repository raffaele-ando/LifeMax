/* PORTA UN SEGNO DEL PACCO DENTRO L'APP.
     node segni/prendi.mjs calendar-clock scadenza "una data con una scadenza"

   Scrive il tracciato dentro src/segni/segni.ts, in fondo al blocco dei segni,
   con accanto da dove viene e che cosa vuol dire. Il commento non è
   decorazione: è quello che permette a `cerca.mjs` di dire «questo l'hai già
   preso, e sta dicendo un'altra cosa», e alla prova prove/segni.js di
   controllare che nessun significato sia scritto due volte.

   Nel browser la libreria non arriva mai: solo i segni che servono finiscono nel
   file, e il file resta di venti kB invece di trecentosessanta. */
import fs from 'fs';
import path from 'path';
const QUI = path.dirname(new URL(import.meta.url).pathname);
/* IL FILE DEI SEGNI DELL'APP. Era `assets/icons.js`, che non esiste da
   quando l'app è in TypeScript: questi tre strumenti puntavano tutti là, e
   quindi nessuno dei tre funzionava più — cosa che si scopre solo il giorno
   che serve un'icona nuova. */
const FILE = path.join(QUI, '..', 'src', 'segni', 'segni.ts');

const [daLucide, nostro, ...resto] = process.argv.slice(2);
const senso = resto.join(' ');
if (!daLucide || !nostro || !senso) {
  console.log('  uso: node segni/prendi.mjs <nome-lucide> <nomeNostro> "che cosa vuol dire"');
  process.exit(1);
}
if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(nostro)) { console.log('  il nome nostro è un identificatore JS'); process.exit(1); }

const lucide = JSON.parse(fs.readFileSync(path.join(QUI, 'lucide.json'), 'utf8'));
const d = lucide[daLucide];
if (!d) {
  console.log('  «' + daLucide + '» non sta nella libreria. Cercalo:  node segni/cerca.mjs ' + daLucide.split('-')[0]);
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
if (new RegExp('^ {2}' + nostro + ':', 'm').test(src)) {
  console.log('  «' + nostro + '» c’è già. Cambia nome, o togli quello vecchio a mano.');
  process.exit(1);
}
const ANCORA = '\n  /* ---------- presi dal pacco ---------- */';
if (src.indexOf(ANCORA) < 0) {
  /* La prima volta si apre la sezione, subito prima della graffa che chiude
     PATHS: le aggiunte future si accodano lì e non si mescolano ai disegni
     fatti a mano. L'ultima voce di prima non aveva la virgola, perché era
     l'ultima: ora non lo è più. */
  src = src.replace(/('(?:[^'\\]|\\.)*')(,?\s*)\n(};\n)/, (t, val, sp, fine) => val + ',' + sp + ANCORA + '\n' + fine);
}
const riga = '  ' + nostro + ": '" + d.replace(/'/g, "\\'") + "',  /* lucide:" + daLucide + ' — ' + senso + ' */';
src = src.replace(ANCORA + '\n', ANCORA + '\n' + riga + '\n');
fs.writeFileSync(FILE, src);
console.log('  preso: ' + nostro + '  ← lucide/' + daLucide + '  («' + senso + '»)');
