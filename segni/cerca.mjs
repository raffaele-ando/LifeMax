/* CERCA UN SEGNO nel pacco, per parola.
     node segni/cerca.mjs orologio
     node segni/cerca.mjs calendar --tutti

   Cerca nel nome e nelle parole chiave (che sono in inglese: il pacco è
   Lucide). Stampa i candidati e, per ognuno, se è già in uso nell'app e con
   che significato — così non si prende per la seconda volta un segno che sta
   già dicendo un'altra cosa da un'altra parte. */
import fs from 'fs';
import path from 'path';
const QUI = path.dirname(new URL(import.meta.url).pathname);

const pacco = JSON.parse(fs.readFileSync(path.join(QUI, 'pacco.json'), 'utf8'));
const parole = JSON.parse(fs.readFileSync(path.join(QUI, 'parole.json'), 'utf8'));
const icone = fs.readFileSync(path.join(QUI, '..', 'assets', 'icons.js'), 'utf8');

/* i segni già nostri: `prendi.mjs` lascia accanto a ognuno da dove viene e
   che cosa vuol dire, e questo serve proprio a dirlo qui */
const daLucide = new Map();
for (const m of icone.matchAll(/^\s{4}([a-zA-Z0-9_]+):.*\/\* *lucide:([a-z0-9-]+) *— *([^*]*?) *\*\//gm)) {
  daLucide.set(m[2], m[1] + '»: ' + m[3]);
}

const q = process.argv.slice(2).filter((a) => a[0] !== '-').map((s) => s.toLowerCase());
const tutti = process.argv.includes('--tutti');
if (!q.length) {
  console.log('  uso: node segni/cerca.mjs <parola> [...]      (' + Object.keys(pacco).length + ' segni nel pacco)');
  process.exit(1);
}

const punti = [];
for (const nome of Object.keys(pacco)) {
  const tag = (parole[nome] || []).join(' ');
  let p = 0;
  for (const w of q) {
    if (nome === w) p += 100;
    else if (nome.split('-').includes(w)) p += 40;
    else if (nome.includes(w)) p += 20;
    if ((parole[nome] || []).includes(w)) p += 15;
    else if (tag.includes(w)) p += 5;
  }
  if (p) punti.push([p, nome]);
}
punti.sort((a, b) => b[0] - a[0] || a[1].localeCompare(b[1]));

if (!punti.length) { console.log('  niente. Le parole del pacco sono in inglese.'); process.exit(0); }
const mostra = tutti ? punti : punti.slice(0, 40);
console.log('');
for (const [, nome] of mostra) {
  const preso = daLucide.get(nome);
  console.log('  ' + nome.padEnd(30) +
    (preso ? '← già preso come «' + preso : '') +
    '   ' + (parole[nome] || []).slice(0, 6).join(', '));
}
if (mostra.length < punti.length) console.log('\n  … e altri ' + (punti.length - mostra.length) + ' (--tutti per vederli)');
console.log('\n  per portarne uno nell’app:  node segni/prendi.mjs <nome-lucide> <nomeNostro> "che cosa vuol dire"\n');
