/* LE FORME SI SCRIVONO UNA VOLTA SOLA — e questa prova è un cricchetto.

   Nel vecchio `app.js` c'erano 566 punti in cui una forma che esiste già
   veniva riscritta a mano come stringa. Non è più lento scriverle a mano: è
   più FRAGILE. La differenza fra due righe di elenco scritte in due punti
   diversi non si vede finché qualcuno non cambia il CSS, e allora si rompe in
   una schermata sola. È così che sono nati quasi tutti i difetti dell'audit —
   tredici pesi tipografici, quattro tasti pieni insieme: nessuno aveva
   sbagliato, semplicemente ogni punto decideva da sé.

   Migrare 566 punti in un colpo non si fa: si sbaglia. Quindi questa prova
   non pretende zero. Pretende che il numero NON SALGA — e ogni volta che
   scende, si abbassa il tetto. Il debito si paga a rate, e nessuno può
   aggiungerne senza accorgersene.

   COSA È CAMBIATO CON I MODULI, e perché i numeri sono più alti.
   Il conto guardava `assets/app.js` e basta. Ma le stesse forme le
   scrivevano anche i componenti in `react/src/`, e quelle nessuno le
   contava: il cricchetto misurava mezzo codice. Adesso legge tutto `src/`,
   `class="btn"` e `className="btn"` insieme, e i tetti ripartono da quello
   che c'è davvero. Il numero è salito perché è salito il campo visivo, non
   il debito — e un cricchetto che non vede metà del codice non è un
   cricchetto, è un numero che rassicura.

   Si lancia con: node prove/pezzi.js   (solo Node, niente browser)  */
'use strict';
const fs = require('fs'), path = require('path');
const { RAMO, tuttoIlCodice } = require('./dove');

let guai = 0;
const ok = (nome, cond, det) => {
  if (!cond) guai++;
  console.log('  ' + (cond ? 'ok  ' : 'KO  ') + nome + (det ? '  → ' + det : ''));
};

/* IL TETTO. Si abbassa ogni volta che si migra qualcosa, mai si alza.
   Se questa prova diventa rossa perché hai scritto una forma a mano: non
   alzare il numero. Usa il pezzo. */
const TETTO = {
  btn: 84, card: 33, 'lista-riga': 25, campo: 30, 'q-chip': 5,
  segmenti: 13, stat: 6, vuoto: 11, 'lista-nota': 23
};

const sorgente = tuttoIlCodice();

/* si contano solo le forme scritte DENTRO una stringa di HTML o in un
   attributo di JSX: quelle nei commenti e nei selettori non c'entrano.
   `class` e `className` sono la stessa cosa scritta nei due posti. */
function quante(forma) {
  const re = new RegExp('<\\w+\\s+class(?:Name)?="' + forma.replace(/-/g, '\\-') + '(?=[\\s"])', 'g');
  return (sorgente.match(re) || []).length;
}

console.log('LE FORME SCRITTE A MANO NON AUMENTANO');
let totale = 0, tetto = 0;
Object.keys(TETTO).forEach((forma) => {
  const n = quante(forma), t = TETTO[forma];
  totale += n; tetto += t;
  ok('«' + forma + '» non è cresciuta', n <= t,
    n === t ? n + ' come prima' : (n < t ? n + ' invece di ' + t + ' — abbassa il tetto a ' + n
      : n + ' contro ' + t + ' — usa il pezzo invece di riscriverla'));
});
ok('e in tutto non sono aumentate', totale <= tetto, totale + ' su un tetto di ' + tetto);

/* ============================================================
   LE QUATTRO FUNZIONI DI STRINGA, ESEGUITE DAVVERO

   COS'ERA PRIMA. Qui si caricava `assets/pezzi.js` con `new Function` e si
   chiamava `PZ.tasto(…)`, `PZ.riga(…)`: quindici forme che uscivano come
   stringhe di HTML. Di quel file sono rimaste quattro funzioni — `esc`,
   `att`, `classi`, `riga` — in `src/pezzi/stringhe.ts`, e sono le sole che
   `app.ts` usa ancora, perché `app.ts` costruisce ancora HTML come stringa
   in una decina di punti. Le altre undici sono componenti, e un componente
   non si prova qui: si prova in pagina, ed è quello che fanno
   `prove/impronte.js` e `prove/clic.js`.

   LO SCAPPAMENTO SI PROVA ANCORA, E VALE PIÙ DI PRIMA. In JSX il testo che
   arriva da fuori è scappato per costruzione — è la ragione per cui JSX
   esiste. In una stringa di HTML no: `esc` è l'unica cosa fra il nome che
   uno scrive e un `<img onerror=…>` dentro alla pagina. Finché `app.ts`
   scrive stringhe, questa è la prova che conta.

   Il modulo è TypeScript, quindi si passa da esbuild — che c'è già fra le
   dipendenze — per farlo girare in Node. Un modulo che non si carica
   passerebbe il cricchetto qui sopra senza fare niente.
   ============================================================ */
console.log('\nLE FUNZIONI DI STRINGA CI SONO, E SCAPPANO');
let S = null;
try {
  const esbuild = require('esbuild');
  const via = path.join(RAMO, 'src', 'pezzi', 'stringhe.ts');
  const js = esbuild.buildSync({
    entryPoints: [via], bundle: true, write: false,
    format: 'cjs', platform: 'node', target: 'node18'
  }).outputFiles[0].text;
  const modulo = { exports: {} };
  new Function('module', 'exports', 'require', js)(modulo, modulo.exports, require);
  S = modulo.exports;
} catch (e) {
  ok('src/pezzi/stringhe.ts si compila e si carica', false, String(e.message || e).slice(0, 160));
}

if (S) {
  ok('src/pezzi/stringhe.ts si compila e si carica', true,
    Object.keys(S).sort().join(', '));

  /* il testo che arriva da fuori non entra crudo in una stringa di HTML */
  ok('il testo di fuori viene scappato',
    S.esc('<img src=x onerror=alert(1)>').indexOf('<img') < 0 &&
    S.esc('<img src=x>').indexOf('&lt;img') === 0, S.esc('<img src=x>'));
  ok('e le virgolette dentro a un attributo',
    S.att('id', 'a" onload="1').indexOf('" onload="') < 0, S.att('id', 'a" onload="1'));
  ok('e gli apici singoli: un attributo si può chiudere anche con quelli',
    S.esc("a'b").indexOf("'") < 0, S.esc("a'b"));

  /* un attributo senza valore non si scrive: se no il markup si riempie di
     `id=""` e i selettori cominciano a pescare a caso */
  ok('un attributo vuoto non viene scritto', S.att('id', '') === '' && S.att('id', null) === '',
    'niente id=""');
  ok('e uno pieno sì', S.att('id', 'x') === ' id="x"', S.att('id', 'x'));

  /* le classi: quelle spente non lasciano spazi in mezzo */
  ok('le classi spente non lasciano buchi', S.classi('a', false, null, 'b') === 'a b',
    '«' + S.classi('a', false, null, 'b') + '»');

  const segno = (n) => (n ? '<svg data-n="' + n + '"></svg>' : '');
  const r = S.riga({ mestiere: 'porta', eti: 'Promemoria', valore: '08:30', id: 'r' }, segno);
  ok('una riga che porta altrove ha la freccetta', /lista-chev/.test(r),
    'e la riga fitta dei pannelli: ' + /sc-riga/.test(r));
  ok('una riga che fa una cosa adesso NON ce l’ha',
    !/lista-chev/.test(S.riga({ mestiere: 'fa', eti: 'Esporta' }, segno)), 'non si va da nessuna parte');
  ok('una riga ferma non è un bottone',
    /^<div/.test(S.riga({ mestiere: 'ferma', eti: 'Versione', valore: '3' }, segno)), '<div>');
  ok('e il testo di una riga è scappato',
    S.riga({ mestiere: 'fa', eti: '<b>x</b>' }, segno).indexOf('<b>x</b>') < 0, 'niente tag crudi');
}

/* ============================================================
   I PEZZI CHE NESSUNO USA — il secondo cricchetto, e dice la stessa cosa
   del primo dall'altro lato.

   COS'ERA PRIMA: si confrontavano `assets/pezzi.js` e `react/src/pezzi.jsx`
   — «gli stessi pezzi con gli stessi nomi» — perché finché convivevano i due
   disegni della stessa schermata, uno che esisteva solo di là voleva dire
   che chi convertiva se lo riscriveva a mano, e siamo daccapo. Adesso c'è un
   set solo, e quel confronto non ha più due termini.

   LA DOMANDA CHE RESTA È L'ALTRA METÀ. Sopra si conta quante volte una forma
   è scritta a mano; qui quali pezzi esistono e non li chiama nessuno. Sono
   la stessa cosa vista da due parti: tredici pezzi fermi e duecentotrenta
   forme scritte a mano non sono due problemi, sono uno — le schermate
   scrivono il markup invece di chiedere il pezzo.

   E come sopra, non si pretende zero: si pretende che l'ELENCO NON CRESCA.
   L'elenco e non il numero, apposta: un numero che scende di uno non dice
   quale, e passare i quindici punti di «Da fare» a `Riga` è un lavoro con
   dentro una decisione di disegno per ognuno — la riga di React e quella
   scritta a mano non hanno lo stesso albero, e `prove/impronte.js` lo
   direbbe subito. Si fa un pezzo per volta, e questo elenco è la lista di
   quello che resta da fare.
   ============================================================ */
console.log('\nI PEZZI CHE NESSUNO USA (ANCORA)');
/* Da qui si TOLGONO nomi, mai se ne aggiungono. Se questa prova diventa
   rossa perché hai scritto un pezzo nuovo: usalo, o non scriverlo. */
const FERMI = [
  'Scheda', 'Campo', 'Pastiglie', 'Segmenti', 'Statistica', 'Niente',
  'Nota', 'Icona', 'Etichetta', 'Valore', 'Titolo', 'Fila', 'Barra'
];
{
  const via = path.join(RAMO, 'src', 'pezzi', 'pezzi.tsx');
  const testo = fs.readFileSync(via, 'utf8');
  const pezzi = [...testo.matchAll(/^export function ([A-Z]\w*)/gm)].map((m) => m[1]);
  /* si guarda tutto src TRANNE il file che li dichiara: là dentro un pezzo
     compare per forza, e un pezzo usato solo dai suoi fratelli non è usato */
  const fuori = (function raccogli(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const v = path.join(dir, e.name);
      if (e.isDirectory()) return raccogli(v);
      if (v === via) return [];
      return /\.(ts|tsx)$/.test(e.name) ? [fs.readFileSync(v, 'utf8')] : [];
    });
  })(path.join(RAMO, 'src')).join('\n');
  const inutili = pezzi.filter((n) => !new RegExp('<' + n + '[\\s/>]').test(fuori));
  const nuoviFermi = inutili.filter((n) => FERMI.indexOf(n) < 0);
  const partiti = FERMI.filter((n) => inutili.indexOf(n) < 0);
  ok('nessun pezzo nuovo resta fermo', nuoviFermi.length === 0,
    nuoviFermi.length ? nuoviFermi.join(', ') + ' — o si usa, o non si scrive'
      : (pezzi.length - inutili.length) + ' pezzi in uso su ' + pezzi.length);
  ok('e l’elenco dei fermi non è cresciuto', inutili.length <= FERMI.length,
    inutili.length === FERMI.length ? inutili.length + ' come prima'
      : inutili.length + ' invece di ' + FERMI.length);
  if (partiti.length) {
    console.log('  --  entrati in uso: ' + partiti.join(', ') + ' — togli quei nomi da FERMI');
  }
}

/* ============================================================
   LA PORTA PER LE PROVE RESTA UNA PORTA PER LE PROVE

   `main.tsx` mette in pagina `window.__PROVE__`, e ci sono venti righe là
   che spiegano perché: `prove/promemoria.js` guida i promemoria da dentro
   alla pagina, e da fuori un modulo non si raggiunge.

   Una porta del genere ha un solo modo di marcire: che l'app cominci a
   usarla. Il giorno che dentro a `src/` qualcuno scrive
   `window.__PROVE__.promemoria.qualcosa()` perché è più corto che
   importarlo, quella non è più una porta per le prove — è un globale, cioè
   esattamente la cosa da cui viene tutto questo lavoro. Si conta che sia
   nominata UNA volta sola, dove viene aperta.
   ============================================================ */
console.log('\nLA PORTA PER LE PROVE NON LA USA L’APP');
{
  /* i `.d.ts` non contano: dichiarare che una cosa esiste non è usarla, ed è
     anzi il modo di farla esistere per il compilatore. Quello che si conta
     sono gli USI, e devono essere uno: l'assegnazione in `main.tsx`. */
  const codice = (function raccogli(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const v = path.join(dir, e.name);
      if (e.isDirectory()) return raccogli(v);
      if (/\.d\.ts$/.test(e.name)) return [];
      return /\.(ts|tsx)$/.test(e.name) ? [fs.readFileSync(v, 'utf8')] : [];
    });
  })(path.join(RAMO, 'src')).join('\n');
  const usi = (codice.match(/__PROVE__/g) || []).length;
  ok('`window.__PROVE__` è nominata una volta sola, dove si apre',
    usi === 1, usi === 1 ? 'solo in main.tsx' : usi + ' volte in src/ — l’app la sta usando');
}

console.log(guai ? '\n>>> ' + guai + (guai === 1 ? ' PROBLEMA' : ' PROBLEMI') : '\n>>> TUTTO A POSTO');
process.exit(guai ? 1 : 0);
