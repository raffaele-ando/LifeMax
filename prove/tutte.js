/* TUTTE LE PROVE, IN UN COMANDO SOLO.

   Le prove erano ventotto e il modo di lanciarle tutte non stava nel ramo:
   `npm run prove` ne girava quattro, le altre ventiquattro bisognava sapere
   che c'erano e chiamarle a mano. Una prova che nessuno lancia è una prova
   che non esiste — e il giorno che ne cade una in silenzio non se ne accorge
   nessuno.

   Si lancia con:
     node prove/tutte.js              tutte, in fila
     node prove/tutte.js segni bordi  solo quelle
     node prove/tutte.js --da pacco   da lì in avanti (per riprendere)

   L'elenco non sta scritto da nessuna parte: sono i file `.js` qui dentro,
   in ordine. Le librerie condivise stanno in `prove/comune/`, che è
   esattamente perché ci stanno — così una prova nuova è un file nuovo e
   basta, senza un elenco da aggiornare che prima o poi resta indietro.

   LA PORTA OCCUPATA NON È UN GUASTO. Ogni prova alza un server suo su una
   porta fissa, e quando una passata precedente è stata interrotta il sistema
   operativo tiene giù quella porta ancora per un po'. La prova cade con
   EADDRINUSE, che non dice niente sul codice. Qui si riconosce e si riprova
   una volta sola, dopo qualche secondo: se cade di nuovo, allora è un
   problema vero. */
'use strict';
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');

const QUI = __dirname;
const TETTO_MS = 20 * 60 * 1000;   /* nessuna prova ha mai passato i quindici minuti */

const tutte = fs.readdirSync(QUI)
  .filter((f) => f.endsWith('.js') && f !== 'tutte.js')
  .sort();

/* quali girare: tutte, quelle nominate, o da un certo punto in poi */
const arg = process.argv.slice(2);
let elenco = tutte;
const da = arg.indexOf('--da');
if (da >= 0) {
  const dove = tutte.indexOf(arg[da + 1] + '.js');
  if (dove < 0) { console.error('non c’è nessuna prova che si chiama ' + arg[da + 1]); process.exit(2); }
  elenco = tutte.slice(dove);
} else if (arg.length) {
  elenco = arg.map((n) => n.replace(/\.js$/, '') + '.js');
  const persa = elenco.find((f) => !tutte.includes(f));
  if (persa) { console.error('non c’è nessuna prova che si chiama ' + persa.replace(/\.js$/, '')); process.exit(2); }
}

const ESITI = fs.mkdtempSync(path.join(os.tmpdir(), 'lifemax-prove-'));

function gira(file) {
  return new Promise((risolvi) => {
    const dentro = [];
    const p = spawn(process.execPath, [path.join(QUI, file)], {
      cwd: path.join(QUI, '..'),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    const orologio = setTimeout(() => { p.kill('SIGKILL'); }, TETTO_MS);
    p.stdout.on('data', (d) => dentro.push(d));
    p.stderr.on('data', (d) => dentro.push(d));
    p.on('close', (codice) => {
      clearTimeout(orologio);
      risolvi({ codice: codice === null ? 124 : codice, testo: Buffer.concat(dentro).toString('utf8') });
    });
  });
}

const PORTA_OCCUPATA = /EADDRINUSE/;
const attendi = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const caduti = [];
  const partenza = Date.now();
  for (const file of elenco) {
    const nome = file.replace(/\.js$/, '');
    const t0 = Date.now();
    process.stdout.write('  ' + nome.padEnd(14));
    let esito = await gira(file);
    if (esito.codice !== 0 && PORTA_OCCUPATA.test(esito.testo)) {
      process.stdout.write('porta occupata, riprovo… ');
      await attendi(5000);
      esito = await gira(file);
    }
    const sec = Math.round((Date.now() - t0) / 1000);
    fs.writeFileSync(path.join(ESITI, nome + '.txt'), esito.testo);
    if (esito.codice === 0) {
      console.log('ok   ' + sec + 's');
    } else {
      caduti.push(nome);
      console.log('KO   ' + sec + 's   (codice ' + esito.codice + ')');
      /* le ultime righe bastano quasi sempre a capire cos'è: il resto sta nel file */
      esito.testo.trimEnd().split('\n').slice(-12).forEach((r) => console.log('       │ ' + r));
    }
  }
  const min = Math.round((Date.now() - partenza) / 60000);
  console.log('');
  console.log('  il racconto completo di ognuna: ' + ESITI);
  if (!caduti.length) {
    console.log('  ' + elenco.length + ' prove, tutte a posto (' + min + ' minuti)');
    process.exit(0);
  }
  console.log('  ' + caduti.length + ' su ' + elenco.length + ' non passano: ' + caduti.join(', '));
  process.exit(1);
})();
