/* IL FILE DA INCOLLARE È ANCORA LA SOMMA DEI TRE?

   Il Worker dei promemoria è scritto in tre file — `push.js` la crittografia,
   `piano.js` la decisione, `worker.js` le porte — e `impacchetta.mjs` ne fa
   `worker-unico.js`, che è quello che si incolla nel pannello di Cloudflare.

   Chi corregge una cosa la corregge nei tre, perché è là che si legge. Se poi
   non rifà il file unico, il ramo resta giusto e il POSTINO resta vecchio: si
   continua a incollare il codice di prima. E il modo in cui te ne accorgi è
   che i promemoria smettono di arrivare — cioè non te ne accorgi, perché una
   notifica che non arriva non lascia traccia da nessuna parte.

   Qui il file si rifà in una cartella temporanea e si confronta byte per
   byte. Niente browser: dura un istante, e sta fra le prove svelte. */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const { RAMO } = require('./comune/dove');

let guai = 0;
const dice = (cond, nome, dettaglio) => {
  if (!cond) guai++;
  console.log('  ' + (cond ? 'ok  ' : 'KO  ') + nome + (dettaglio ? '  → ' + dettaglio : ''));
};

const committato = path.join(RAMO, 'promemoria', 'worker-unico.js');
const cartella = fs.mkdtempSync(path.join(os.tmpdir(), 'lifemax-postino-'));
const rifatto = path.join(cartella, 'worker-unico.js');

console.log('\nIL POSTINO CHE SI INCOLLA È QUELLO DEI TRE SORGENTI');

try {
  execFileSync(process.execPath, [path.join(RAMO, 'promemoria', 'impacchetta.mjs'), rifatto],
    { cwd: RAMO, stdio: 'pipe' });
} catch (e) {
  dice(false, 'impacchetta.mjs gira', String((e.stderr || e.message || '')).slice(-300));
  console.log('\n>>> ' + guai + ' PROBLEMA');
  process.exit(1);
}

const a = fs.readFileSync(committato);
const b = fs.readFileSync(rifatto);
dice(a.equals(b), 'worker-unico.js è quello che uscirebbe adesso',
  a.equals(b) ? a.length + ' byte' : 'committato ' + a.length + ' byte, rifatto ' + b.length +
    ' byte — `node promemoria/impacchetta.mjs`');

/* e che nessuno l'abbia scritto a mano credendo fosse il sorgente */
const testa = a.toString('utf8').slice(0, 400);
dice(/QUESTO FILE È GENERATO/.test(testa), 'e dice di sé che è generato');

fs.rmSync(cartella, { recursive: true, force: true });
console.log(guai ? '\n>>> ' + guai + ' PROBLEMA' + (guai > 1 ? 'I' : '') : '\n>>> TUTTO A POSTO');
process.exit(guai ? 1 : 0);
