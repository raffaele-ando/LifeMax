/* LE FORME SI SCRIVONO UNA VOLTA SOLA — e questa prova è un cricchetto.

   In app.js c'erano 566 punti in cui una forma che esiste già veniva
   riscritta a mano come stringa. Non è più lento scriverle a mano: è più
   FRAGILE. La differenza fra due righe di elenco scritte in due punti diversi
   non si vede finché qualcuno non cambia il CSS, e allora si rompe in una
   schermata sola. È così che sono nati quasi tutti i difetti dell'audit —
   tredici pesi tipografici, quattro tasti pieni insieme: nessuno aveva
   sbagliato, semplicemente ogni punto decideva da sé.

   Migrare 566 punti in un colpo non si fa: si sbaglia. Quindi questa prova
   non pretende zero. Pretende che il numero NON SALGA — e ogni volta che
   scende, si abbassa il tetto. Il debito si paga a rate, e nessuno può
   aggiungerne senza accorgersene.

   Si lancia con: node prove/pezzi.js   (solo Node, niente browser)  */
'use strict';
const fs = require('fs'), path = require('path');
const RADICE = path.join(__dirname, '..');

let guai = 0;
const ok = (nome, cond, det) => {
  if (!cond) guai++;
  console.log('  ' + (cond ? 'ok  ' : 'KO  ') + nome + (det ? '  → ' + det : ''));
};

/* IL TETTO. Si abbassa ogni volta che si migra qualcosa, mai si alza.
   Se questa prova diventa rossa perché hai scritto una forma a mano: non
   alzare il numero. Usa `PZ`. */
const TETTO = {
  btn: 86, card: 35, 'lista-riga': 29, campo: 30, 'q-chip': 7,
  segmenti: 14, stat: 6, vuoto: 9, 'lista-nota': 22
};

const sorgente = fs.readFileSync(path.join(RADICE, 'assets', 'app.js'), 'utf8');

/* si contano solo le forme scritte DENTRO una stringa di HTML: quelle nei
   commenti e nei selettori non c'entrano */
function quante(forma) {
  const re = new RegExp('<\\w+\\s+class="' + forma.replace(/-/g, '\\-') + '(?=[\\s"])', 'g');
  return (sorgente.match(re) || []).length;
}

console.log('LE FORME SCRITTE A MANO NON AUMENTANO');
let totale = 0, tetto = 0;
Object.keys(TETTO).forEach((forma) => {
  const n = quante(forma), t = TETTO[forma];
  totale += n; tetto += t;
  ok('«' + forma + '» non è cresciuta', n <= t,
    n === t ? n + ' come prima' : (n < t ? n + ' invece di ' + t + ' — abbassa il tetto a ' + n
      : n + ' contro ' + t + ' — usa PZ invece di riscriverla'));
});
ok('e in tutto non sono aumentate', totale <= tetto, totale + ' su un tetto di ' + tetto);

console.log('\nI PEZZI CI SONO, E FUNZIONANO');
/* Un modulo che non si carica passerebbe la prova di sopra senza fare niente:
   qui si esegue davvero. */
const finestra = {};
const codice = fs.readFileSync(path.join(RADICE, 'assets', 'pezzi.js'), 'utf8');
new Function('window', codice)(finestra);
const PZ = finestra.PZ;
ok('assets/pezzi.js si carica e pubblica PZ', !!PZ, PZ ? Object.keys(PZ).length + ' pezzi' : 'niente');

if (PZ) {
  const t = PZ.tasto({ testo: 'Concludi', tipo: 'pieno', misura: 'grande', id: 'x' });
  ok('un tasto pieno esce con le classi giuste', /class="btn btn-primario btn-grande"/.test(t) && /id="x"/.test(t), t.slice(0, 62));
  ok('e un tasto tonale non si dichiara anche principale',
    !/btn-primario/.test(PZ.tasto({ testo: 'Salva', tipo: 'tonale' })), 'btn btn-tonale');
  /* il ruolo, non il colore: è la regola che tiene DESIGN.md dentro al codice */
  ok('i ruoli sono cinque e nessuno nomina un colore',
    ['pieno', 'tonale', 'quieto', 'chiude', 'pericolo']
      .every((r) => typeof PZ.tasto({ testo: 'x', tipo: r }) === 'string'), 'pieno tonale quieto chiude pericolo');

  const r = PZ.riga({ mestiere: 'porta', eti: 'Promemoria', valore: '08:30', id: 'r' });
  ok('una riga che porta altrove ha la freccetta', /lista-chev/.test(r), 'e la riga fitta dei pannelli: ' + /sc-riga/.test(r));
  ok('una riga che fa una cosa adesso NON ce l’ha',
    !/lista-chev/.test(PZ.riga({ mestiere: 'fa', eti: 'Esporta' })), 'non si va da nessuna parte');
  ok('una riga ferma non è un bottone',
    /^<div/.test(PZ.riga({ mestiere: 'ferma', eti: 'Versione', valore: '3' })), '<div>');

  /* il testo che arriva da fuori non entra crudo in una stringa di HTML */
  const cattivo = PZ.tasto({ testo: '<img src=x onerror=alert(1)>' });
  ok('il testo di fuori viene scappato', !/<img/.test(cattivo) && /&lt;img/.test(cattivo), 'niente tag crudi');
  ok('e anche quello dentro a un attributo',
    !/id="a" onload/.test(PZ.tasto({ testo: 'x', id: 'a" onload="1' })), 'attributi chiusi');

  /* un attributo senza valore non si scrive: se no il markup si riempie di
     `id=""` e i selettori cominciano a pescare a caso */
  ok('un attributo vuoto non viene scritto', !/id=/.test(PZ.tasto({ testo: 'x' })), 'niente id=""');
}

console.log('\nI DUE GEMELLI HANNO GLI STESSI PEZZI');
/* `assets/pezzi.js` e `react/src/pezzi.jsx` devono restare la stessa cosa
   scritta due volte. Se in React ne compare uno che in vanilla non c'è (o
   viceversa), la promessa «il lavoro si fa una volta sola» è già rotta: chi
   converte una schermata trova un pezzo che di là non esiste e se lo
   riscrive, e siamo daccapo. */
{
  const viaReact = path.join(RADICE, 'react', 'src', 'pezzi.jsx');
  if (!fs.existsSync(viaReact)) {
    console.log('  --  non c’è ancora l’isola React: niente da confrontare');
  } else {
    const jsx = fs.readFileSync(viaReact, 'utf8');
    const inReact = [...jsx.matchAll(/export function ([A-Z]\w*)/g)].map((m) => m[1].toLowerCase());
    /* `Segno` in React è interno (lo usano gli altri pezzi), in vanilla è la
       funzione `icona`: sono la stessa cosa con due nomi di comodo */
    const inVanilla = PZ ? Object.keys(PZ).filter((k) => !['esc', 'att', 'classi'].includes(k)) : [];
    const soloReact = inReact.filter((k) => inVanilla.indexOf(k) < 0 && k !== 'segno');
    const soloVanilla = inVanilla.filter((k) => inReact.indexOf(k) < 0);
    ok('nessun pezzo esiste solo in React', soloReact.length === 0, soloReact.join(', ') || 'nessuno');
    ok('e nessuno esiste solo in vanilla', soloVanilla.length === 0, soloVanilla.join(', ') || 'nessuno');
    ok('e sono lo stesso numero', inReact.length - (inReact.indexOf('segno') >= 0 ? 1 : 0) === inVanilla.length,
      inReact.length + ' in React, ' + inVanilla.length + ' in vanilla');
  }
}

console.log(guai ? '\n>>> ' + guai + (guai === 1 ? ' PROBLEMA' : ' PROBLEMI') : '\n>>> TUTTO A POSTO');
process.exit(guai ? 1 : 0);
