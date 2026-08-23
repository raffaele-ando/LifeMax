/* FA UN FILE SOLO da incollare nel pannello di Cloudflare.
     node promemoria/impacchetta.mjs

   Il Worker è scritto in tre file perché così si legge e si prova a pezzi
   (push.js la crittografia, piano.js la decisione, worker.js le porte). Ma il
   pannello di Cloudflare vuole del codice da incollare in una finestra, e
   spiegare a qualcuno come creare tre moduli in un editor web è un modo di
   far fallire l'installazione al primo passo.

   Quindi: un file generato, mai scritto a mano. In cima ha scritto che è
   generato, così nessuno lo modifica pensando che sia il sorgente.
   `prova-worker.mjs` gira anche su questo file, quindi i due non possono
   dire cose diverse senza che una prova se ne accorga. */
import fs from 'fs';
import path from 'path';
const QUI = path.dirname(new URL(import.meta.url).pathname);
const leggi = (f) => fs.readFileSync(path.join(QUI, f), 'utf8');

/* via gli `import` fra i nostri file e gli `export`: qui tutto finisce nello
   stesso ambito, e `export default` resta perché è quello che Cloudflare
   cerca per sapere qual è il Worker */
const spoglia = (src) => src
  .replace(/^import[^;]*;\s*$/gm, '')
  .replace(/^export (?=(async )?function|const|let|var)/gm, '');

const pezzi = ['push.js', 'piano.js', 'worker.js'];

/* due nomi uguali in due file, messi insieme, diventano un errore muto: uno
   dei due vince e la metà del programma che usava l'altro cambia
   comportamento. Meglio fermarsi qui. */
const visti = new Map();
for (const f of pezzi) {
  for (const m of leggi(f).matchAll(/^(?:export )?(?:async )?(?:function|const|let|var) ([A-Za-z_$][\w$]*)/gm)) {
    if (visti.has(m[1])) {
      console.log('  fermo: «' + m[1] + '» è dichiarato sia in ' + visti.get(m[1]) + ' sia in ' + f);
      process.exit(1);
    }
    visti.set(m[1], f);
  }
}

const testa = `/* ============================================================
   IL POSTINO DEI PROMEMORIA — un file solo, da incollare.

   QUESTO FILE È GENERATO. Non modificarlo: le modifiche vanno in
   promemoria/push.js, promemoria/piano.js e promemoria/worker.js, e poi
     node promemoria/impacchetta.mjs
   lo rifà. Quello che c'è scritto qui sotto è la somma di quei tre.

   Serve al pannello di Cloudflare, che vuole del codice da incollare in una
   finestra invece di tre moduli separati. Le istruzioni, passo per passo e
   senza terminale, sono in promemoria/LEGGIMI.md.
   ============================================================ */

`;

const corpo = pezzi.map((f) =>
  '/* ══════════ ' + f + ' ══════════ */\n' + spoglia(leggi(f)).trim() + '\n'
).join('\n');

fs.writeFileSync(path.join(QUI, 'worker-unico.js'), testa + corpo);
const kb = (fs.statSync(path.join(QUI, 'worker-unico.js')).size / 1024).toFixed(1);
console.log('  scritto promemoria/worker-unico.js — ' + kb + ' kB, ' +
  (testa + corpo).split('\n').length + ' righe');
