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

/* Il dizionario: nome → disegno. I confini del taglio contano: sotto a PATHS
   c'è SENSO, e le sue righe hanno la stessa forma (`nome: 'testo',`). Tagliando
   troppo in basso questa prova finiva per confrontare i SIGNIFICATI invece dei
   disegni — e passava, perché i significati sono unici per costruzione. Una
   prova che passa per il motivo sbagliato è peggio di una che manca. */
const blocco = ico.slice(ico.indexOf('var PATHS'), ico.indexOf('var SENSO'));
const segni = new Map();
/* il commento in coda dice da quale segno del pacco arriva: fa parte della riga */
blocco.replace(/^\s{4}([A-Za-z0-9]+):\s*'(.*?)',?(?:\s*\/\*[^*]*\*\/)?\s*$/gm,
  (_, n, d) => { segni.set(n, d); return _; });

/* il registro dei significati, letto dal file e non copiato qui */
const bloccoSenso = ico.slice(ico.indexOf('var SENSO'), ico.indexOf('var GENERICI'));
const senso = new Map();
bloccoSenso.replace(/^\s{4}([A-Za-z0-9]+):\s*'(.*?)',?\s*$/gm, (_, n, d) => { senso.set(n, d); return _; });
const generici = new Set(((/var GENERICI = \[([^\]]*)\]/.exec(ico) || [, ''])[1].match(/'([A-Za-z0-9]+)'/g) || [])
  .map(x => x.slice(1, -1)));

console.log('UN SEGNO, UNA COSA  (' + segni.size + ' segni nel set)\n');
/* Che quello che è stato letto sia davvero un disegno. Senza questo controllo
   un taglio sbagliato faceva confrontare i significati fra loro, e la prova
   passava dicendo «nessun disegno sotto due nomi» — vero, e senza senso. */
const nonDisegni = [...segni.entries()].filter(e => e[1][0] !== '<').map(e => e[0]);
if (segni.size < 40 || nonDisegni.length) {
  console.log('  KO  il set non si legge: ' + segni.size + ' voci, ' + nonDisegni.length +
    ' senza tracciato' + (nonDisegni.length ? ' (' + nonDisegni.slice(0, 4).join(', ') + ')' : ''));
  process.exit(1);
}

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
agg(/orizz\('[a-z]+',\s*'([A-Za-z0-9]+)'/g);
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
/* «mai usato» si chiede in modo largo: un nome di segno passa anche come terzo
   argomento di `toast`, come primo di `chip`, `voce`, `modo`… e inseguire ogni
   helper significa che il giorno in cui ne nasce uno nuovo questa prova
   sbaglia. Qui basta sapere se un disegno è rimasto nel file senza che nessuno
   lo nomini: un nome citato da qualche parte non è codice morto. Al contrario,
   la prova di sopra — «invocato senza esistere» — resta strettissima, perché
   là un errore si vede a schermo. */
const citati = new Set(usati);
{
  let m; const re = /'([A-Za-z0-9]+)'/g;
  while ((m = re.exec(sorgenti))) if (segni.has(m[1])) citati.add(m[1]);
}
const inutili = [...segni.keys()].filter(n => !citati.has(n));
ok('nessun segno disegnato e mai citato', inutili.length === 0, inutili.join(', ') || 'nessuno');

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

/* 6. ogni segno dichiara che cosa vuol dire, e nessun significato è ripetuto */
const muti = [...segni.keys()].filter(n => !senso.has(n));
ok('ogni segno dice che cosa vuol dire', muti.length === 0, muti.join(', ') || 'nessuno');
const orfani = [...senso.keys()].filter(n => !segni.has(n));
ok('nessun significato resta senza segno', orfani.length === 0, orfani.join(', ') || 'nessuno');
const perSenso = new Map();
senso.forEach((d, n) => { const k = d.toLowerCase(); if (!perSenso.has(k)) perSenso.set(k, []); perSenso.get(k).push(n); });
const sinonimi = [...perSenso.values()].filter(v => v.length > 1);
ok('nessuna cosa ha due segni', sinonimi.length === 0,
  sinonimi.map(v => v.join('=')).join(', ') || 'nessuno');

/* 7. quante FRASI diverse porta ognuno.
      È la prova che nasce dal problema di partenza: `check` stava accanto a
      otto frasi diverse, `clock` a sette. Un segno preciso accanto a molte
      frasi ha ricominciato a voler dire più cose, e da lì per capire quale
      bisogna leggere l'etichetta — cioè il segno non serve più.

      Si contano solo le FRASI, non i posti. La prima versione contava anche la
      classe CSS del contenitore quando accanto non c'era testo, e si fermava
      su `star` e `clock`: cinque posti diversi, ma un significato solo. Un
      conto che scatta su un caso giusto non serve a niente, perché si impara
      a passargli sopra. I posti si stampano comunque: leggerli è utile.

      Quello che questo conto NON vede: i segni messi da soli, senza una
      parola accanto. La stella della priorità e la puntina del «tieni in
      cima» erano la stessa figura e nessuna delle due aveva un'etichetta:
      quel tipo di doppione lo trova il registro dei significati qui sopra,
      e la lettura. Le figure di GENERICI stanno fuori dal conto: la spunta
      sta accanto a tutto ciò che si spunta, e resta una cosa sola. */
const TETTO = 6;
function etichette(src) {
  const out = new Map();
  src.split('\n').forEach(function (l) {
    const re = /ICO\('([A-Za-z0-9]+)'\s*,\s*[0-9]+[^)]*\)/g;
    let m;
    while ((m = re.exec(l))) {
      if (!out.has(m[1])) out.set(m[1], { frasi: new Set(), posti: new Set() });
      const v = out.get(m[1]);
      const dopo = l.slice(m.index + m[0].length);
      const pulisci = (x) => x.replace(/<[^>]*>/g, ' ').replace(/[^a-zA-ZÀ-ÿ. -]/g, ' ')
        .replace(/\s+/g, ' ').trim().toLowerCase().split(' ').slice(0, 4).join(' ');
      /* una frase: il testo subito dopo il segno, o l'aria-label/title che
         quel comando porta — sono le due cose che l'utente legge */
      let t = /^\s*\+\s*'([^']{2,60})'/.exec(dopo) || /^([^'"+]{2,60})/.exec(dopo);
      let frase = t && /[a-zA-ZÀ-ÿ]{3}/.test(t[1]) ? pulisci(t[1]) : '';
      if (!frase) {
        const a = [...l.slice(0, m.index).matchAll(/(?:aria-label|title)="([^"'+]{2,60})/g)].pop();
        if (a) frase = pulisci(a[1]);
      }
      if (frase) v.frasi.add(frase);
      else {
        const c = [...l.slice(0, m.index).matchAll(/class="([a-z0-9 -]{2,40})/g)].pop();
        v.posti.add(c ? '.' + c[1].trim() : 'da solo');
      }
    }
  });
  return out;
}
const usi = etichette(sorgenti);
console.log('');
[...usi.entries()].sort((a, b) => b[1].frasi.size - a[1].frasi.size).slice(0, 6).forEach(function (e) {
  console.log('      ' + String(e[1].frasi.size).padStart(2) + ' frasi  ' + e[0].padEnd(12) + '  ' +
    ([...e[1].frasi].sort().join(' | ') || '—') +
    (e[1].posti.size ? '   (+' + e[1].posti.size + ' senza parole)' : ''));
});
const larghi = [...usi.entries()].filter(function (e) { return !generici.has(e[0]) && e[1].frasi.size >= TETTO; });
ok('nessun segno preciso accanto a ' + TETTO + ' frasi diverse', larghi.length === 0,
  larghi.map(function (e) { return e[0] + ' (' + e[1].frasi.size + ': ' + [...e[1].frasi].sort().join(', ') + ')'; }).join(' — ') || 'nessuno');

console.log(guai ? '\n>>> ' + guai + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
process.exit(guai ? 1 : 0);
