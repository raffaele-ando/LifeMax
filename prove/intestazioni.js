/* LE INTESTAZIONI DELLA CACHE, PRIMA CHE FACCIANO DANNI.

   `_headers` è un file che non si prova aprendo il sito: se è sbagliato, il
   danno si vede fra un mese, su un telefono che non è il tuo, e da lì non si
   ripara — perché il modo di riparare sarebbe proprio dire al browser di
   riscaricare, che è la cosa che quel file gli ha vietato.

   Le due trappole, tutte e due irreversibili:

   1. `immutable` su un file dal nome fisso. index.html tiene dentro i nomi
      degli altri: è l'unico che deve cambiare restando allo stesso indirizzo.
      Dirgli «tienitelo un anno» vuol dire che chi ha aperto il sito una volta
      resta su quella versione per un anno.
   2. Due regole che prendono lo stesso file. Cloudflare non sceglie la più
      precisa: unisce i valori con una virgola. Un `/assets/*` in fondo
      trasforma la regola buona in `…, immutable, no-cache`, che non vuol dire
      niente.

   E una cosa che non è una trappola ma un'incoerenza: se una regola promette
   `immutable` su una cartella, ogni file lì dentro deve avere l'impronta nel
   nome. Se no si sta promettendo che non cambierà mai un file che può
   cambiare.

   Si lancia con: node prove/intestazioni.js   (solo Node, niente browser)  */
'use strict';
const fs = require('fs'), path = require('path');
const RADICE = path.join(__dirname, '..');
const VIA = path.join(RADICE, '_headers');

let guai = 0;
const ok = (nome, cond, det) => {
  if (!cond) guai++;
  console.log('  ' + (cond ? 'ok  ' : 'KO  ') + nome + (det ? '  → ' + det : ''));
};

if (!fs.existsSync(VIA)) {
  console.log('  --  non c’è nessun _headers: niente da controllare');
  console.log('\n>>> PROVA SALTATA');
  process.exit(0);
}

/* il formato: una riga che comincia con «/» apre un blocco, le righe
   indentate sotto sono «Nome: valore». I commenti cominciano con «#». */
const blocchi = [];
let ora = null;
fs.readFileSync(VIA, 'utf8').split('\n').forEach((riga, n) => {
  const pulita = riga.replace(/#.*$/, '');
  if (!pulita.trim()) return;
  if (/^\S/.test(pulita)) { ora = { modello: pulita.trim(), riga: n + 1, teste: [] }; blocchi.push(ora); }
  else if (ora) {
    const m = /^\s+(!?\s*[A-Za-z0-9-]+)\s*:?\s*(.*)$/.exec(pulita);
    if (m) ora.teste.push({ nome: m[1].trim().toLowerCase(), valore: m[2].trim(), riga: n + 1 });
  }
});

console.log('IL FILE SI LEGGE');
ok('ci sono dei blocchi', blocchi.length > 0, blocchi.length + ' regole');
ok('ogni blocco comincia con una via', blocchi.every((b) => b.modello.startsWith('/')),
  blocchi.filter((b) => !b.modello.startsWith('/')).map((b) => 'riga ' + b.riga).join(', ') || 'tutte');
ok('e nessun blocco è vuoto', blocchi.every((b) => b.teste.length),
  blocchi.filter((b) => !b.teste.length).map((b) => b.modello).join(', ') || 'nessuno');
/* i limiti veri di Cloudflare: cento regole, duemila caratteri per riga */
ok('sotto le cento regole che Cloudflare accetta', blocchi.length <= 100, blocchi.length);

console.log('\nNIENTE «IMMUTABLE» SU QUELLO CHE PUÒ CAMBIARE');
/* trasforma il modello di Cloudflare in qualcosa che si può provare: `*` vale
   qualsiasi cosa, `:pezzo` un pezzo di via solo */
const aRegex = (m) => new RegExp('^' + m
  .replace(/[.+^${}()|[\]\\]/g, '\\$&')
  .replace(/\*/g, '.*')
  .replace(/:[A-Za-z_]+/g, '[^/]+') + '$');

const eterni = blocchi.filter((b) => b.teste.some((t) =>
  t.nome === 'cache-control' && /immutable|max-age\s*=\s*([1-9]\d{5,})/.test(t.valore)));

/* i file dal nome fisso: quelli che devono poter cambiare senza cambiare via */
const FISSI = ['/', '/index.html', '/sw.js', '/manifest.webmanifest', '/assets/app.js', '/assets/data.js'];
const presi = [];
eterni.forEach((b) => {
  const r = aRegex(b.modello);
  FISSI.forEach((f) => { if (r.test(f)) presi.push(b.modello + ' prende ' + f); });
});
ok('nessuna regola eterna prende un file dal nome fisso', presi.length === 0,
  presi.join(' | ') || 'nessuna');

console.log('\nCHI PROMETTE «PER SEMPRE» HA L’IMPRONTA NEL NOME');
/* se una cartella è dichiarata eterna, ogni file che c'è dentro deve avere
   l'impronta del contenuto nel nome: se no si sta promettendo che non
   cambierà mai una cosa che cambia */
const senzaImpronta = [];
eterni.forEach((b) => {
  const cartella = b.modello.replace(/\/?\*+$/, '');
  const suDisco = path.join(RADICE, cartella);
  if (!fs.existsSync(suDisco) || !fs.statSync(suDisco).isDirectory()) return;
  fs.readdirSync(suDisco).forEach((f) => {
    if (!/\.[0-9a-f]{8,}\./.test(f)) senzaImpronta.push(cartella + '/' + f);
  });
});
ok('ogni file sotto una regola eterna ha l’impronta nel nome', senzaImpronta.length === 0,
  senzaImpronta.join(', ') || 'tutti');

console.log('\nDUE REGOLE NON PRENDONO LO STESSO FILE');
/* Cloudflare, se due blocchi prendono lo stesso file, non sceglie il più
   preciso: UNISCE i valori con una virgola. Due regole sulla stessa
   intestazione fanno uscire una riga senza senso, e il caso peggiore è
   proprio quello che sembra prudente: una regola larga messa in fondo. */
const esempi = [];
fs.readdirSync(path.join(RADICE, 'assets', 'pacco')).forEach((f) => esempi.push('/assets/pacco/' + f));
FISSI.forEach((f) => esempi.push(f));
['/assets/icone/icona-192.png', '/assets/app.css', '/promemoria/chiavi.html'].forEach((f) => esempi.push(f));

const scontri = [];
esempi.forEach((f) => {
  const chi = blocchi.filter((b) => aRegex(b.modello).test(f));
  const teste = {};
  chi.forEach((b) => b.teste.forEach((t) => { (teste[t.nome] = teste[t.nome] || []).push(b.modello); }));
  Object.keys(teste).forEach((n) => {
    if (teste[n].length > 1) scontri.push(f + ': ' + n + ' da ' + teste[n].join(' e '));
  });
});
ok('nessun file riceve la stessa intestazione da due regole',
  scontri.length === 0, [...new Set(scontri)].slice(0, 4).join(' | ') || 'nessuno');

console.log('\nE QUELLO CHE SERVE C’È');
const copre = (f) => blocchi.some((b) => aRegex(b.modello).test(f) &&
  b.teste.some((t) => t.nome === 'cache-control' && /immutable/.test(t.valore)));
const pacco = fs.readdirSync(path.join(RADICE, 'assets', 'pacco'));
const scoperti = pacco.filter((f) => !copre('/assets/pacco/' + f));
ok('ogni pezzo del pacco è dichiarato eterno', scoperti.length === 0,
  scoperti.join(', ') || pacco.length + ' file');

console.log('\nE IL CONTROLLO SA VEDERE UN FILE SBAGLIATO');
/* Una prova che passa sempre non prova niente, e questa è di quelle che
   passano sempre: il file è corto e non lo tocca quasi nessuno. Allora si
   dànno in pasto le due trappole scritte a mano e si pretende che le veda. */
{
  const finto = (testo) => {
    const b = [];
    let o = null;
    testo.split('\n').forEach((r) => {
      const p = r.replace(/#.*$/, '');
      if (!p.trim()) return;
      if (/^\S/.test(p)) { o = { modello: p.trim(), teste: [] }; b.push(o); }
      else if (o) { const m = /^\s+(!?\s*[A-Za-z0-9-]+)\s*:?\s*(.*)$/.exec(p); if (m) o.teste.push({ nome: m[1].trim().toLowerCase(), valore: m[2].trim() }); }
    });
    return b;
  };
  const eterne = (b) => b.filter((x) => x.teste.some((t) =>
    t.nome === 'cache-control' && /immutable|max-age\s*=\s*([1-9]\d{5,})/.test(t.valore)));

  const uno = eterne(finto('/*\n  Cache-Control: public, max-age=31536000, immutable\n'))
    .some((b) => aRegex(b.modello).test('/index.html'));
  ok('vede un «immutable» che prende l’HTML', uno, uno ? '/* prende /index.html' : 'non l’ha visto');

  const due = finto('/assets/pacco/*\n  Cache-Control: immutable\n\n/assets/*\n  Cache-Control: no-cache\n')
    .filter((b) => aRegex(b.modello).test('/assets/pacco/pacco.0123456789.js')).length;
  ok('e due regole che prendono lo stesso file', due === 2, due + ' regole sullo stesso file');
}

console.log(guai ? '\n>>> ' + guai + (guai === 1 ? ' PROBLEMA' : ' PROBLEMI') : '\n>>> TUTTO A POSTO');
process.exit(guai ? 1 : 0);
