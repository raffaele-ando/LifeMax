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
   byte. Niente browser: dura un istante, e sta fra le prove svelte.

   E TIRA DENTRO LE DUE PROVE DEL WORKER, che stavano in `postino/` e non
   le lanciava nessuno. `prova-piano.mjs` prova l'unica decisione che prende
   il server — chi tocca adesso, nel fuso di chi riceve — e `prova-worker.mjs`
   fa girare il giro intero con un KV finto e un push finto. Cinquecento
   righe di prove che c'erano già e non venivano mai chieste: il postino è il
   pezzo dell'app in cui un guasto non si vede e non si sente, quindi è
   l'ultimo posto dove tenere delle prove spente.
   (`prova.mjs` e `prova-chiavi.mjs` restano fuori di proposito: una vuole
   `http_ece` e `web-push` per il confronto con il mondo, l'altra apre un
   browser. Le loro intestazioni dicono come si lanciano.) */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const { RAMO } = require('./comune/dove');

let guai = 0;
const dice = (cond, nome, dettaglio) => {
  if (!cond) guai++;
  console.log('  ' + (cond ? 'ok  ' : 'KO  ') + nome + (dettaglio ? '  → ' + dettaglio : ''));
};

const committato = path.join(RAMO, 'postino', 'worker-unico.js');
const cartella = fs.mkdtempSync(path.join(os.tmpdir(), 'lifemax-postino-'));
const rifatto = path.join(cartella, 'worker-unico.js');

console.log('\nIL POSTINO CHE SI INCOLLA È QUELLO DEI TRE SORGENTI');

try {
  execFileSync(process.execPath, [path.join(RAMO, 'postino', 'impacchetta.mjs'), rifatto],
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
    ' byte — `node postino/impacchetta.mjs`');

/* e che nessuno l'abbia scritto a mano credendo fosse il sorgente */
const testa = a.toString('utf8').slice(0, 400);
dice(/QUESTO FILE È GENERATO/.test(testa), 'e dice di sé che è generato');

fs.rmSync(cartella, { recursive: true, force: true });

/* --- e le due prove del Worker, che girano qui dentro --- */
for (const prova of ['prova-piano.mjs', 'prova-worker.mjs']) {
  let uscita = '';
  let andata = true;
  try {
    uscita = execFileSync(process.execPath, [path.join(RAMO, 'postino', prova)],
      { cwd: RAMO, stdio: 'pipe' }).toString('utf8');
  } catch (e) {
    andata = false;
    uscita = String((e.stdout || '') + (e.stderr || '') || e.message);
  }
  /* quelle prove contano da sé e stampano «KO» sulle righe che non vanno:
     si guarda l'uscita del processo e, per sicurezza, anche quelle righe */
  const koDentro = (uscita.match(/^\s*KO\s/gm) || []).length;
  dice(andata && !koDentro, 'postino/' + prova,
    andata && !koDentro ? 'passa' : (koDentro ? koDentro + ' righe KO' : 'non gira') +
      ' — `node postino/' + prova + '`');
  if (!andata || koDentro) uscita.trimEnd().split('\n').slice(-8).forEach((r) => console.log('      │ ' + r));
}
console.log(guai ? '\n>>> ' + guai + (guai > 1 ? ' PROBLEMI' : ' PROBLEMA') : '\n>>> TUTTO A POSTO');
process.exit(guai ? 1 : 0);
