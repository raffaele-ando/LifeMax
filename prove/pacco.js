/* IL SITO SUL DISCO È QUELLO DEI SORGENTI DI ADESSO.

   Un build ha un solo modo di fare danni: qualcuno cambia il codice, prova
   sul suo computer col server di sviluppo, non ricostruisce, e in rete resta
   la versione di ieri. Non se ne accorge nessuno finché non lo usa qualcuno.

   E QUI IL RISCHIO È VERO, non teorico: GitHub Pages serve il ramo così
   com'è, senza nessun passaggio di build. Quello che sta in `docs/` È il
   sito. Se `docs/` è vecchio, il sito è vecchio.

   Questa prova ricostruisce in una cartella temporanea e confronta con
   `docs/`. Il build di Vite è deterministico — il nome di ogni file porta
   dentro l'impronta del suo contenuto — quindi due giri sugli stessi
   sorgenti danno gli stessi byte: una differenza vuol dire che i sorgenti
   sono cambiati dopo l'ultimo build.

   COS'ERA PRIMA: la stessa prova sul pacco di `costruisci.mjs`, che chiamava
   `piano()` per rifare i conti in memoria. Vite non ha un `piano()` da
   chiamare: si costruisce per davvero in una cartella di passaggio, e si
   confronta. Costa due secondi.

   Si lancia con: node prove/pacco.js   (non serve Chromium; serve vite)  */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const { RAMO, SERVITO } = require('./dove');

let guai = 0;
const ok = (nome, cond, det) => {
  if (!cond) guai++;
  console.log('  ' + (cond ? 'ok  ' : 'KO  ') + nome + (det ? '  → ' + det : ''));
};

/* tutti i file di una cartella, in giù, col percorso relativo */
function elenca(dir, base) {
  base = base || dir;
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const v = path.join(dir, e.name);
    return e.isDirectory() ? elenca(v, base) : [path.relative(base, v)];
  });
}

const fresco = fs.mkdtempSync(path.join(os.tmpdir(), 'lifemax-pacco-'));

try {
  console.log('IL SITO IN docs/ È QUELLO CHE USCIREBBE ADESSO DAL BUILD');
  try {
    execFileSync('npx', ['vite', 'build', '--outDir', fresco, '--emptyOutDir'],
      { cwd: RAMO, stdio: 'pipe' });
  } catch (e) {
    console.log('  --  il build non gira: `npm install` e si riprova');
    console.log('      ' + String((e.stderr || e.message || '')).split('\n').slice(-4).join(' '));
    console.log('\n>>> PROVA SALTATA');
    process.exit(0);
  }

  const nuovi = elenca(fresco).sort();
  const vecchi = elenca(SERVITO).sort();

  /* 1. gli stessi file, con gli stessi nomi. Il nome porta dentro
        l'impronta del contenuto: un nome che combacia è un contenuto che
        combacia — ma si legge lo stesso, perché un file scritto a metà ha
        ancora il nome giusto. */
  const mancanti = nuovi.filter((f) => vecchi.indexOf(f) < 0);
  const avanzi = vecchi.filter((f) => nuovi.indexOf(f) < 0);
  ok('ogni file del build sta in docs/', mancanti.length === 0,
    mancanti.length ? 'manca ' + mancanti.slice(0, 5).join(', ') + ' — `npm run build:nuovo`'
      : nuovi.length + ' file');
  /* niente avanzi di build vecchi: pesano nel deposito e non li serve
     nessuno, perché nessuna pagina li nomina più */
  ok('e in docs/ non restano pezzi di build vecchi', avanzi.length === 0,
    avanzi.slice(0, 6).join(', ') || 'nessuno');

  /* LE MAPPE NON SI CONFRONTANO, e non è una scorciatoia: dentro a una
     `.js.map` i percorsi dei sorgenti sono RELATIVI alla cartella d'uscita,
     e questa prova costruisce in una cartella temporanea. Le mappe sono
     quindi diverse per costruzione, e dire «diverse» sarebbe dire una cosa
     falsa a ogni giro — cioè addestrare chi legge a passarci sopra.
     Quello che conta è nei file veri: se il codice è lo stesso, la mappa lo
     è pure, perché il nome del file porta dentro l'impronta del codice. */
  const daGuardare = nuovi.filter((f) => !/\.map$/.test(f));
  const diversi = daGuardare.filter((f) => {
    const a = path.join(fresco, f), b = path.join(SERVITO, f);
    if (!fs.existsSync(b)) return false;
    return !fs.readFileSync(a).equals(fs.readFileSync(b));
  });
  ok('e ha dentro esattamente quello che uscirebbe adesso', diversi.length === 0,
    diversi.length ? diversi.slice(0, 5).join(', ') + ' — `npm run build:nuovo`'
      : daGuardare.length + ' file, byte per byte');

  console.log('\nQUELLO CHE NON DEVE FINIRE NEL PEZZO PRINCIPALE');
  const pacco = path.join(fresco, 'pacco');
  const pezzi = fs.existsSync(pacco) ? fs.readdirSync(pacco) : [];
  const principale = pezzi.filter((f) => /^index-.*\.js$/.test(f))[0];
  ok('c’è un pezzo principale', !!principale, principale || 'nessuno');
  if (principale) {
    const testo = fs.readFileSync(path.join(pacco, principale), 'utf8');

    /* IL LABORATORIO SI CARICA QUANDO LO APRI, NON PRIMA: sessantun
       kilobyte di codice e settantacinque di stile per una schermata in cui
       non entra quasi nessuno. Il caricamento a richiesta è un `import()`
       dentro a `caricaLab`, e Vite lo riconosce e mette quel codice in un
       pezzo a parte — ma se qualcuno un giorno lo importa in cima al file,
       Vite lo mette dentro al principale senza lamentarsi.
       SI CERCA UN TESTO, NON UN NOME. Prima il segno era `window.LM_LAB=`,
       che c'era perché il laboratorio si pubblicava su `window`; adesso è un
       modulo e quel nome, minificato, non esiste più. I nomi dei dieci mock
       invece sono stringhe, e le stringhe il minificatore le tiene: se «Due
       colonne» è nel pezzo principale, c'è dentro tutto il laboratorio. */
    ok('il Design lab resta fuori dal pezzo principale',
      testo.indexOf('Due colonne') < 0,
      'sessantun kilobyte analizzati a ogni avvio per una pagina in cui non entra quasi nessuno');
    ok('ma c’è, in un pezzo suo', pezzi.some((f) => /^lab-.*\.js$/.test(f)),
      pezzi.filter((f) => /^lab-/.test(f)).join(', ') || 'nessuno');

    /* LA NUVOLA VA A PRENDERE L'SDK DI FIREBASE DALLA RETE, e l'app
       funziona lo stesso senza — solo su questo dispositivo. Nel pezzo
       principale vorrebbe dire farla aspettare a chi non ce l'ha. */
    ok('e la nuvola pure', pezzi.some((f) => /^nuvola-.*\.js$/.test(f)),
      pezzi.filter((f) => /^nuvola-/.test(f)).join(', ') || 'nessuno');

    /* LA CHIAVE PRIVATA VAPID NON STA NEL SITO, e non ci deve stare per
       nessuna ragione: vive in un segreto del Worker su Cloudflare. La
       pubblica sì — è pubblica per definizione, finisce nel browser di
       chiunque. Questa riga costa niente e guarda la cosa che non si
       ripara: un segreto pubblicato è pubblicato.
       SI CERCA UNA CHIAVE, NON IL NOME DEL SEGRETO. La prima versione
       cercava la stringa `VAPID_PRIVATA` e diventava rossa subito, per due
       messaggi che quel nome lo SCRIVONO a chi installa da sé: «sul
       pannello di Cloudflare mancano i segreti VAPID_PUBBLICA e
       VAPID_PRIVATA». Sono istruzioni, non chiavi — e una prova che si
       lamenta di un'istruzione è una prova che si impara a ignorare. */
    const chiave = /-----BEGIN [A-Z ]*PRIVATE KEY/.test(testo) ||
      /VAPID_PRIVATA\s*[:=]\s*["'`][A-Za-z0-9_-]{20,}/.test(testo);
    ok('e nessuna chiave privata è finita dentro', !chiave,
      'la privata sta in un segreto del Worker, e solo là');
  }

  console.log('\nIL SORGENTE E IL COSTRUITO NON SI CONFONDONO');
  const htmlFatto = fs.readFileSync(path.join(fresco, 'index.html'), 'utf8');
  const htmlSorg = fs.readFileSync(path.join(RAMO, 'src', 'index.html'), 'utf8');
  ok('src/index.html chiama il modulo di avvio', /src="\.\/main\.tsx"/.test(htmlSorg));
  /* si guarda il TAG, non la stringa: `main.tsx` è nominato anche in un
     commento della testa — «se lo stile lo carica main.tsx…» — e Vite i
     commenti se li tiene */
  ok('e docs/index.html chiama il pezzo costruito',
    !/<script[^>]+src="[^"]*main\.tsx"/.test(htmlFatto) && /\.\/pacco\/index-[\w-]+\.js/.test(htmlFatto),
    (htmlFatto.match(/\.\/pacco\/index-[\w-]+\.js/) || ['?'])[0]);
  /* lo stile lo scrive Vite, col nome che porta l'impronta: uno scritto a
     mano a un nome fisso non si potrebbe cachare per sempre */
  ok('e lo stile ce l’ha messo il build, con l’impronta nel nome',
    /\.\/pacco\/index-[\w-]+\.css/.test(htmlFatto),
    (htmlFatto.match(/\.\/pacco\/index-[\w-]+\.css/) || ['?'])[0]);
} finally {
  fs.rmSync(fresco, { recursive: true, force: true });
}

console.log(guai ? '\n>>> ' + guai + (guai === 1 ? ' PROBLEMA' : ' PROBLEMI') : '\n>>> TUTTO A POSTO');
process.exit(guai ? 1 : 0);
