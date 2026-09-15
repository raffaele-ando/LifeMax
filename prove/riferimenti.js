/* CHI NOMINA UN FILE, NOMINA UN FILE CHE ESISTE.

   Due famiglie di guasto, la stessa faccia: niente. Nessun errore, nessuna
   riga rossa, e la cosa semplicemente non succede.

   LA PRIMA sta nel sito servito. Un'icona dichiarata nel manifest e non
   presente non fa fallire l'installazione: la fa riuscire con un quadrato
   grigio. Una pagina linkata dall'app e non pubblicata dà 404 dentro a un
   pannello, dove non c'è una barra degli indirizzi che lo dica. È già
   successo qui, con `chiavi.html`: linkata, non pubblicata, e ce ne siamo
   accorti aprendola a mano.

   LA SECONDA sta negli strumenti. `segni/`, `postino/` e `prove/` sono pieni
   di script che leggono e scrivono percorsi scritti a mano. Quando l'app è
   passata a TypeScript, tre strumenti su quattro di `segni/` hanno smesso di
   funzionare — puntavano ad `assets/`, sparita — e nessuno se n'è accorto
   per mesi, perché uno strumento rotto lo scopri il giorno che ti serve,
   cioè nel momento in cui hai fretta e la strada breve è fare a mano quello
   che lo strumento esisteva per evitare.

   Un percorso scritto dentro a un file è una promessa come un'altra.

   Niente browser: è tutta lettura di file. Si lancia con:
     node prove/riferimenti.js  */
'use strict';
const fs = require('fs'), path = require('path');
const { RAMO } = require('./comune/dove');

let guai = 0;
const ok = (nome, cond, det) => { if (!cond) guai++; console.log('  ' + (cond ? 'ok  ' : 'KO  ') + nome + (det ? '  → ' + det : '')); };
const c_e = (rel) => fs.existsSync(path.join(RAMO, rel));

/* ============================================================
   1. IL SITO SERVITO
   ============================================================ */
console.log('\nQUELLO CHE IL SITO NOMINA, IL SITO CE L’HA');
{
  const visti = new Map();
  const segna = (da, rif) => { if (!visti.has(rif)) visti.set(rif, new Set()); visti.get(rif).add(da); };

  const html = fs.readFileSync(path.join(RAMO, 'index.html'), 'utf8');
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) segna('index.html', m[1]);

  const man = JSON.parse(fs.readFileSync(path.join(RAMO, 'manifest.webmanifest'), 'utf8'));
  (man.icons || []).forEach((i) => segna('manifest', i.src));
  (man.shortcuts || []).forEach((s) => {
    segna('manifest', s.url);
    (s.icons || []).forEach((i) => segna('manifest', i.src));
  });
  if (man.start_url) segna('manifest', man.start_url);

  const pacco = path.join(RAMO, 'pacco');
  for (const f of fs.readdirSync(pacco).filter((x) => x.endsWith('.css'))) {
    const css = fs.readFileSync(path.join(pacco, f), 'utf8');
    for (const m of css.matchAll(/url\((['"]?)([^)'"]+)\1\)/g)) segna('pacco/' + f, m[2]);
  }
  /* i percorsi scritti nel codice: le icone che il service worker mette sulle
     notifiche, e quelle che l'app chiede al volo */
  const conCodice = ['sw.js'].concat(fs.readdirSync(pacco).filter((x) => x.endsWith('.js')).map((x) => 'pacco/' + x));
  for (const f of conCodice) {
    const js = fs.readFileSync(path.join(RAMO, f), 'utf8');
    for (const m of js.matchAll(/["'`](icone\/[A-Za-z0-9_.-]+)["'`]/g)) segna(f, m[1]);
  }

  const mancanti = [];
  let quanti = 0;
  for (const [rif, da] of [...visti].sort()) {
    if (/^(https?:|data:|mailto:|blob:|#)/.test(rif)) continue;
    const pulito = rif.split('#')[0].split('?')[0].replace(/^\.\//, '');
    if (!pulito) continue;
    quanti++;
    if (!c_e(pulito)) mancanti.push(pulito + ' (da ' + [...da].join(', ') + ')');
  }
  ok('ogni indirizzo nominato dal sito esiste', mancanti.length === 0,
    mancanti.length ? mancanti.join('; ') : quanti + ' riferimenti');
  /* se domani qualcuno cambia il modo di scrivere i link e qui non arriva più
     niente, la prova passerebbe per non aver guardato: questo lo impedisce */
  ok('e ce n’è un numero sensato da controllare', quanti >= 10, quanti + '');
}

/* ============================================================
   2. GLI STRUMENTI
   ============================================================ */
console.log('\nGLI STRUMENTI SANNO DOVE SONO LE COSE');
for (const cartella of ['segni', 'postino', 'prove']) {
  const dir = path.join(RAMO, cartella);
  const file = fs.readdirSync(dir).filter((f) => /\.(mjs|js)$/.test(f)).sort();
  const rotti = [];
  let guardati = 0;
  for (const f of file) {
    const testo = fs.readFileSync(path.join(dir, f), 'utf8');
    const voluti = new Set();
    /* un percorso costruito a pezzi, risalendo dalla cartella dello script */
    for (const m of testo.matchAll(/path\.join\((?:QUI|__dirname), '\.\.'((?:, '[^']+')+)\)/g)) {
      voluti.add(m[1].split(',').map((x) => x.trim().replace(/^'|'$/g, '')).filter(Boolean).join('/'));
    }
    /* la stessa cosa scritta a partire dalla radice del ramo */
    for (const m of testo.matchAll(/path\.join\(RAM[OE]?[A-Za-z]*, ((?:'[^']+'(?:, )?)+)\)/g)) {
      voluti.add(m[1].split(',').map((x) => x.trim().replace(/^'|'$/g, '')).filter(Boolean).join('/'));
    }
    /* e i letterali che sembrano percorsi del ramo */
    for (const m of testo.matchAll(/'((?:src|public|prove|postino|segni|icone)\/[A-Za-z0-9_./-]+)'/g)) voluti.add(m[1]);
    for (const r of voluti) {
      guardati++;
      if (!c_e(r)) rotti.push(cartella + '/' + f + ' → ' + r);
    }
  }
  ok(cartella + '/', rotti.length === 0, rotti.length ? rotti.join('; ') : guardati + ' percorsi, tutti veri');
}

console.log(guai ? '\n>>> ' + guai + (guai > 1 ? ' PROBLEMI' : ' PROBLEMA') : '\n>>> TUTTO A POSTO');
process.exit(guai ? 1 : 0);
