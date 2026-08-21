/* Un segno, una cosa.
   Questa prova non guarda i pixel: legge il codice. Nasce da un problema
   vero — «vedo più icone usate per cose diverse» — e tiene ferme le cinque
   regole che lo evitavano, che a mano si perdono in un pomeriggio.
   Si lancia con: node prove/segni.js  (non serve né Chromium né npm) */
'use strict';
const fs = require('fs'), path = require('path');
const RADICE = path.join(__dirname, '..');
const leggi = f => fs.readFileSync(path.join(RADICE, f), 'utf8');
const ico = leggi('assets/icons.js');
const sorgenti = ['assets/app.js', 'assets/data.js', 'assets/lab.js', 'index.html']
  .filter(f => fs.existsSync(path.join(RADICE, f))).map(leggi).join('\n');

let guai = 0;
const ok = (nome, cond, det) => {
  if (!cond) guai++;
  console.log('  ' + (cond ? 'ok  ' : 'KO  ') + nome + (det ? '  → ' + det : ''));
};

/* il dizionario: nome → disegno */
const blocco = ico.slice(ico.indexOf('var PATHS'), ico.indexOf('---------- la scala'));
const segni = new Map();
blocco.replace(/^\s{4}([A-Za-z0-9]+):\s*'(.*?)',?\s*$/gm, (_, n, d) => { segni.set(n, d); return _; });

console.log('UN SEGNO, UNA COSA  (' + segni.size + ' segni nel set)\n');

/* 1. nessun disegno sotto due nomi */
const perDisegno = new Map();
segni.forEach((d, n) => { if (!perDisegno.has(d)) perDisegno.set(d, []); perDisegno.get(d).push(n); });
const gemelli = [...perDisegno.values()].filter(v => v.length > 1);
ok('nessun disegno esiste sotto due nomi', gemelli.length === 0,
  gemelli.map(v => v.join('=')).join(', ') || 'nessuno');

/* 2. tutti i nomi usati esistono, e tutti i segni servono a qualcosa */
const usati = new Set();
const agg = re => { let m; while ((m = re.exec(sorgenti))) { for (let i = 1; i < m.length; i++) if (m[i]) usati.add(m[i]); } };
agg(/ICO\('([A-Za-z0-9]+)'/g);
agg(/\bicona:\s*'([A-Za-z0-9]+)'/g);
agg(/\bico:\s*'([A-Za-z0-9]+)'/g);
/* i segni scelti al volo: ICO(condizione ? 'a' : 'b', …). La condizione può
   contenere espressioni regolari e parentesi, quindi non si prova a
   riconoscerla: si guarda un pezzo di testo dopo ogni «ICO(». */
{
  let i = -1;
  while ((i = sorgenti.indexOf('ICO(', i + 1)) >= 0) {
    /* si contano le parentesi per fermarsi esattamente in fondo agli
       argomenti: un ternario che capita dopo la chiamata non c'entra */
    let k = i + 4, liv = 1;
    while (k < sorgenti.length && liv > 0) {
      const c = sorgenti[k];
      if (c === '(') liv++; else if (c === ')') liv--;
      k++;
    }
    const t = /\?\s*'([A-Za-z0-9]+)'\s*:\s*'([A-Za-z0-9]+)'/.exec(sorgenti.slice(i, k));
    if (t) { usati.add(t[1]); usati.add(t[2]); }
  }
}
agg(/scala\('[a-z]+',\s*'([A-Za-z0-9]+)'/g);
agg(/segp\('[a-z]+',\s*'([A-Za-z0-9]+)'/g);
agg(/segM\('[a-z]+',\s*'([A-Za-z0-9]+)'/g);
agg(/tb\('[a-z]+',\s*'([A-Za-z0-9]+)'/g);
agg(/testaRituale\('([A-Za-z0-9]+)'/g);
const mA = /ICONE_AREA = \[([\s\S]*?)\];/.exec(sorgenti);
const aree = mA ? (mA[1].match(/'([A-Za-z0-9]+)'/g) || []).map(x => x.slice(1, -1)) : [];
aree.forEach(x => usati.add(x));
const mC = /var icoCat = \{([\s\S]*?)\};/.exec(sorgenti);
if (mC) (mC[1].match(/'([A-Za-z0-9]+)'/g) || []).forEach(x => usati.add(x.slice(1, -1)));

const fantasmi = [...usati].filter(n => !segni.has(n));
ok('nessun segno invocato senza esistere', fantasmi.length === 0, fantasmi.join(', ') || 'nessuno');
const inutili = [...segni.keys()].filter(n => !usati.has(n));
ok('nessun segno disegnato e mai usato', inutili.length === 0, inutili.join(', ') || 'nessuno');

/* 3. le due famiglie non si mescolano: un segno delle aree non può essere
      anche un segno di sistema, altrimenti la stessa figura compare come
      «la tua area» e due righe sopra come «priorità» o «cattura» */
const sistema = new Set((sorgenti.match(/ICO\('([A-Za-z0-9]+)'/g) || []).map(x => x.slice(5, -1)));
const doppi = aree.filter(n => sistema.has(n));
ok('nessun segno è sia area sia comando', doppi.length === 0, doppi.join(', ') || 'nessuno');
ok('la scelta delle aree ha almeno dieci segni', aree.length >= 10, aree.length + ' segni');

/* 4. tutte le misure stanno sulla scala */
const SCALA = (/var SCALA = \[([^\]]*)\]/.exec(ico) || [, ''])[1].split(',').map(x => +x.trim()).filter(Boolean);
const fuoriScala = new Set();
let m; const reSize = /ICO\((?:[^()]|\([^()]*\))*?,\s*(\d+)\s*[,)]/g;
while ((m = reSize.exec(sorgenti))) { const n = +m[1]; if (!SCALA.includes(n)) fuoriScala.add(n); }
ok('nessuna misura fuori dalla scala ' + SCALA.join('/'), fuoriScala.size === 0,
  [...fuoriScala].sort((a, b) => a - b).join(', ') || 'nessuna');

/* 5. il tratto arriva sempre alla stessa densità */
const tratto = s => Math.round(Math.min(2.5, Math.max(1.15, 30 / s)) * 100) / 100;
const resi = SCALA.map(s => +(tratto(s) * s / 24).toFixed(2));
const dentro = resi.every(r => r >= 1.1 && r <= 1.35);
ok('il tratto arriva sempre fra 1.1 e 1.35px', dentro,
  SCALA.map((s, i) => s + 'px→' + resi[i]).join('  '));

console.log(guai ? '\n>>> ' + guai + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
process.exit(guai ? 1 : 0);
