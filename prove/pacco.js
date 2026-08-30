/* IL PACCO È QUELLO DEI SORGENTI DI ADESSO.

   Un build ha un solo modo di fare danni: qualcuno cambia il codice, prova
   sul suo computer aprendo i sorgenti, non ricostruisce, e in rete resta la
   versione di ieri. Non se ne accorge nessuno finché non lo usa qualcuno.
   Questa prova rifà i conti del build in memoria e li confronta con quello
   che c'è sul disco. Se non combaciano dice cosa ricostruire.

   Guarda anche le due cose che il build può rompere in silenzio:
     · il pacco deve contenere davvero tutti e sette gli script, nell'ordine;
     · nessun file del pacco può restare orfano nel repository.

   Si lancia con: node prove/pacco.js   (non serve Chromium; serve esbuild)  */
'use strict';
const fs = require('fs'), path = require('path');
const RADICE = path.join(__dirname, '..');
const CARTELLA = path.join(RADICE, 'assets', 'pacco');

let guai = 0;
const ok = (nome, cond, det) => {
  if (!cond) guai++;
  console.log('  ' + (cond ? 'ok  ' : 'KO  ') + nome + (det ? '  → ' + det : ''));
};

(async () => {
  let piano;
  try {
    ({ piano } = await import('file://' + path.join(RADICE, 'costruisci.mjs')));
  } catch (e) {
    console.log('  --  esbuild non è installato: `npm install` e si riprova');
    console.log('\n>>> PROVA SALTATA');
    process.exit(0);
  }

  console.log('IL PACCO SUL DISCO È QUELLO CHE USCIREBBE ADESSO DAL BUILD');
  const p = await piano();

  /* 1. ogni file del piano sta sul disco, con dentro la stessa roba.
        Il nome ha l'impronta del contenuto: se il nome combacia, il
        contenuto combacia. Ma si legge lo stesso, perché un file scritto a
        metà ha ancora il nome giusto. */
  const mancanti = [], diversi = [];
  p.file.forEach((f) => {
    const via = path.join(CARTELLA, f.nome);
    if (!fs.existsSync(via)) { mancanti.push(f.nome); return; }
    if (fs.readFileSync(via, 'utf8') !== f.testo) diversi.push(f.nome);
  });
  ok('ogni pezzo del pacco sta sul disco', mancanti.length === 0,
    mancanti.length ? 'manca ' + mancanti.join(', ') + ' — `node costruisci.mjs`' : p.file.length + ' file');
  ok('e ha dentro esattamente quello che uscirebbe adesso', diversi.length === 0,
    diversi.join(', ') || 'nessuno a metà');

  /* 2. index.html è quello generato da questi sorgenti */
  const suDisco = fs.readFileSync(path.join(RADICE, 'index.html'), 'utf8');
  ok('index.html è quello generato dai sorgenti di adesso', suDisco === p.html,
    suDisco === p.html ? 'combacia' : 'index.sorgente.html o gli script sono cambiati dopo l’ultimo build — `node costruisci.mjs`');

  /* 3. niente avanzi di build vecchi: pesano nel repository e non li serve
        nessuno, perché nessuna pagina li nomina più */
  const suoi = new Set(p.file.map((f) => f.nome));
  const orfani = fs.existsSync(CARTELLA) ? fs.readdirSync(CARTELLA).filter((f) => !suoi.has(f)) : [];
  ok('e nella cartella non restano pezzi di build vecchi', orfani.length === 0,
    orfani.join(', ') || 'nessuno');

  console.log('\nDENTRO IL PACCO CI SONO TUTTI, E NELL’ORDINE');
  /* Il pacco è un file solo: se un `<script>` sparisce dal sorgente HTML, il
     build non se ne lamenta — fa un pacco più piccolo e l’app si rompe in
     pagina. Qui si controlla che ci siano ancora tutti, e che forma.js stia
     prima di app.js: è lui che disegna la prima schermata. */
  const sorg = fs.readFileSync(path.join(RADICE, 'index.sorgente.html'), 'utf8');
  const attesi = [...sorg.matchAll(/<script\s+src="(assets\/[^"]+)"><\/script>/g)].map((m) => m[1]);
  const pacco = p.file.find((f) => /^pacco\./.test(f.nome));
  const dentro = attesi.filter((v) => pacco.testo.indexOf(v) >= 0);
  ok('tutti gli script del sorgente sono nel pacco', dentro.length === attesi.length,
    dentro.length + ' su ' + attesi.length + (dentro.length === attesi.length ? '' :
      ' — manca ' + attesi.filter((v) => dentro.indexOf(v) < 0).join(', ')));
  const iF = pacco.testo.indexOf('assets/forma.js'), iA = pacco.testo.indexOf('assets/app.js');
  ok('e forma.js viene prima di app.js', iF >= 0 && iA >= 0 && iF < iA,
    'se no la prima schermata nasce con gli angoli tondi normali');

  /* 4. il lab NON deve stare nel pacco: è la ragione per cui esiste il
        caricamento a richiesta, e ci si torna dentro con una riga sola */
  /* dentro al pacco `assets/lab.js` compare lo stesso: è la via di riserva
     del caricatore, per quando si aprono i sorgenti senza build. Quello che
     non deve esserci è il CODICE del lab, e si riconosce dal nome che
     pubblica. */
  ok('il Design lab resta fuori dal pacco', pacco.testo.indexOf('window.LM_LAB=') < 0 &&
    pacco.testo.indexOf('window.LM_LAB =') < 0,
    'quaranta kilobyte analizzati a ogni avvio per una pagina in cui non entra quasi nessuno');
  const mappa = /window\.LM_PACCO=\{[^}]*"lab":"assets\/pacco\/lab\.[0-9a-f]{10}\.js"/.test(p.html);
  ok('ma index.html sa dove trovarlo', mappa, 'window.LM_PACCO');

  console.log('\nIL SORGENTE E IL GENERATO NON SI CONFONDONO');
  ok('index.html dice di essere generato', /generato da costruisci\.mjs/.test(suDisco));
  ok('e index.sorgente.html non lo dice', !/generato da costruisci\.mjs/.test(sorg),
    'se lo dicesse vorrebbe dire che qualcuno ha costruito sopra il sorgente');

  console.log(guai ? '\n>>> ' + guai + (guai === 1 ? ' PROBLEMA' : ' PROBLEMI') : '\n>>> TUTTO A POSTO');
  process.exit(guai ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
