/* IL BUILD — un pacco solo, minificato, con l'impronta nel nome.

   Perché serve, misurato prima di scriverlo: all'apertura il browser scarica
   e analizza 1,1 MB di codice, e per 1,9 secondi lo schermo resta vuoto. Di
   quel megabyte, il 40% sono commenti e spazi — che in questo progetto sono
   una cosa preziosa nel sorgente e un peso morto nel browser. Un build li
   tiene dove servono e non li manda a nessuno.

   COSA FA, E NIENTE DI PIÙ:
     · unisce gli script in UN file nell'ordine in cui stanno nell'HTML, e lo
       minifica. L'ordine conta: forma.js disegna già la prima schermata, e
       caricato dopo si vedrebbe un lampo di angoli tondi normali;
     · tiene fuori il Design lab, che si carica solo quando lo apri: sono
       61 KB analizzati a ogni avvio per una pagina in cui non entra nessuno;
     · tiene `cloud.js` per conto suo, perché è un modulo e importa Firebase
       da fuori a runtime;
     · minifica il foglio di stile;
     · mette l'impronta del contenuto nel nome di ogni file, così il browser
       può tenerseli per sempre e prende quelli nuovi appena cambiano;
     · riscrive `index.html` a partire da `index.sorgente.html`.

   L'HTML SORGENTE È LA VERITÀ. `index.html` è roba generata: si tocca
   `index.sorgente.html` e si ricostruisce. Il file generato porta scritto in
   testa che è generato, perché un file che qualcuno modifica a mano e che al
   prossimo build sparisce è una trappola.

     node costruisci.mjs            costruisce
     node costruisci.mjs --pulisci  butta via il pacco di prima e ricostruisce

   `piano()` fa gli stessi conti SENZA SCRIVERE NIENTE e restituisce quello
   che verrebbe scritto. Serve a prove/pacco.js, che con quello si accorge se
   il pacco sul disco è più vecchio dei sorgenti — cioè se qualcuno ha
   cambiato il codice e ha dimenticato di ricostruire, che è l'unico modo in
   cui un build come questo può fare danni. */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync, statSync } from 'fs';
import { createHash } from 'crypto';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as esbuild from 'esbuild';

const RADICE = dirname(fileURLToPath(import.meta.url));
const PACCO = join(RADICE, 'assets', 'pacco');
const SORGENTE = join(RADICE, 'index.sorgente.html');
const USCITA = join(RADICE, 'index.html');

/* i file che NON entrano nel pacco unico, e perché */
const A_PARTE = {
  'assets/cloud.js': 'è un modulo e importa Firebase da fuori'
};
/* e questi non stanno nemmeno nell'HTML: se li va a prendere l'app quando
   servono. Il build deve conoscerli lo stesso, perché il nome che finisce in
   pagina è quello con l'impronta dentro. */
const A_RICHIESTA = ['assets/lab.js', 'assets/lab.css'];

function impronta(testo) {
  return createHash('sha256').update(testo).digest('hex').slice(0, 10);
}
function kb(s) { return Math.round(Buffer.byteLength(s) / 1024); }

async function minJs(codice, nome, modulo) {
  const r = await esbuild.transform(codice, {
    loader: 'js',
    minify: true,
    /* si resta su una sintassi che capiscono anche i telefoni di qualche anno
       fa: questo codice è già scritto così, e non c'è niente da guadagnare a
       farlo diventare più moderno di quanto sia */
    target: ['es2019'],
    format: modulo ? 'esm' : undefined,
    legalComments: 'none',
    sourcefile: nome
  });
  if (r.warnings.length) r.warnings.forEach((w) => console.log('   ! ' + w.text));
  return r.code;
}
async function minCss(codice, nome) {
  const r = await esbuild.transform(codice, { loader: 'css', minify: true, sourcefile: nome });
  return r.code;
}

/* ---------------------------------------------------------------- il piano
   Legge, minifica, calcola le impronte e monta l'HTML. Non tocca il disco:
   restituisce `{ file, html, conto }` e chi vuole scrive. */
export async function piano() {
  const html = readFileSync(SORGENTE, 'utf8');
  if (/generato da costruisci\.mjs/.test(html)) {
    throw new Error('index.sorgente.html sembra un file generato: non ci si costruisce sopra.');
  }

  const file = [];      /* { nome, testo, riga } — riga è quella da stampare */
  const dentro = {};    /* via sorgente → percorso finale */

  /* --- gli script, nell'ordine in cui li mette l'HTML --- */
  const script = [...html.matchAll(/<script(?:\s+type="module")?\s+src="([^"]+)"><\/script>/g)]
    .map((m) => ({ tag: m[0], via: m[1], modulo: /type="module"/.test(m[0]) }));
  if (!script.length) throw new Error('nessuno script trovato in index.sorgente.html');

  const insieme = script.filter((s) => !A_PARTE[s.via] && !s.modulo);
  const fuori = script.filter((s) => A_PARTE[s.via] || s.modulo);

  /* si minifica un file per volta e si rimette il nome DOPO: dentro un pacco
     solo, un errore in produzione deve poter dire da quale sorgente viene, e
     un commento messo prima la minificazione se lo mangia.
     Minificare separatamente non cambia il risultato: sono script normali,
     non moduli, e i nomi in cima restano globali — nessuno li può accorciare
     né qui né là. */
  let prima = 0;
  const minificati = [];
  for (const s of insieme) {
    const c = readFileSync(join(RADICE, s.via), 'utf8');
    prima += Buffer.byteLength(c);
    minificati.push('/* ' + s.via + ' */\n' + await minJs(c, s.via, false));
  }
  const unito = minificati.join('\n;\n');
  const nomeUnito = 'pacco.' + impronta(unito) + '.js';
  file.push({
    nome: nomeUnito, testo: unito,
    riga: '  pacco     ' + String(Math.round(prima / 1024)).padStart(4) + ' KB → ' +
      String(kb(unito)).padStart(4) + ' KB   (' + insieme.length + ' file: ' +
      insieme.map((s) => s.via.replace('assets/', '')).join(', ') + ')'
  });

  /* --- quelli a parte --- */
  for (const s of fuori) {
    const c = readFileSync(join(RADICE, s.via), 'utf8');
    const m = await minJs(c, s.via, s.modulo);
    const n = s.via.replace('assets/', '').replace('.js', '') + '.' + impronta(m) + '.js';
    dentro[s.via] = 'assets/pacco/' + n;
    file.push({
      nome: n, testo: m,
      riga: '  ' + s.via.replace('assets/', '').padEnd(10) + String(kb(c)).padStart(4) + ' KB → ' +
        String(kb(m)).padStart(4) + ' KB   (' + (A_PARTE[s.via] || 'modulo') + ')'
    });
  }

  /* --- i fogli di stile --- */
  const css = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map((m) => ({ tag: m[0], via: m[1] }));
  for (const c of css) {
    const t = readFileSync(join(RADICE, c.via), 'utf8');
    const m = await minCss(t, c.via);
    const n = c.via.replace('assets/', '').replace('.css', '') + '.' + impronta(m) + '.css';
    dentro[c.via] = 'assets/pacco/' + n;
    file.push({
      nome: n, testo: m,
      riga: '  ' + c.via.replace('assets/', '').padEnd(10) + String(kb(t)).padStart(4) + ' KB → ' +
        String(kb(m)).padStart(4) + ' KB'
    });
  }

  /* --- quelli che si caricano a richiesta --- */
  let pesoRichiesta = 0;
  for (const via of A_RICHIESTA) {
    const t = readFileSync(join(RADICE, via), 'utf8');
    pesoRichiesta += Buffer.byteLength(t);
    const m = via.endsWith('.css') ? await minCss(t, via) : await minJs(t, via, false);
    const est = via.endsWith('.css') ? '.css' : '.js';
    const n = via.replace('assets/', '').replace(est, '') + '.' + impronta(m) + est;
    dentro[via] = 'assets/pacco/' + n;
    file.push({
      nome: n, testo: m,
      riga: '  ' + via.replace('assets/', '').padEnd(10) + String(kb(t)).padStart(4) + ' KB → ' +
        String(kb(m)).padStart(4) + ' KB   (a richiesta: si carica solo aprendo il Design lab)'
    });
  }

  /* --- l'HTML --- */
  let out = html;
  css.forEach((c) => { out = out.replace(c.tag, '<link rel="stylesheet" href="' + dentro[c.via] + '">'); });
  /* il primo script del gruppo diventa il pacco, gli altri spariscono */
  out = out.replace(insieme[0].tag, '<script src="assets/pacco/' + nomeUnito + '"></script>');
  insieme.slice(1).forEach((s) => { out = out.replace(s.tag, ''); });
  fuori.forEach((s) => { out = out.replace(s.tag, '<script type="module" src="' + dentro[s.via] + '"></script>'); });
  /* la mappa dei file, per chi si carica da solo (il Design lab) */
  const mappa = '<script>window.LM_PACCO=' + JSON.stringify({
    lab: dentro['assets/lab.js'], labCss: dentro['assets/lab.css']
  }) + ';</script>\n';
  out = out.replace('<script src="assets/pacco/' + nomeUnito + '"></script>',
    mappa + '<script src="assets/pacco/' + nomeUnito + '"></script>');
  out = out.replace('<!DOCTYPE html>',
    '<!DOCTYPE html>\n<!-- generato da costruisci.mjs — non si tocca a mano.\n' +
    '     Il sorgente è index.sorgente.html: si cambia quello e si rifà il build. -->');

  /* --- il conto finale, che è il motivo per cui questo file esiste --- */
  const dopo = file.reduce((n, f) => n + Buffer.byteLength(f.testo), 0);
  let orig = 0;
  script.forEach((s) => { orig += statSync(join(RADICE, s.via)).size; });
  css.forEach((c) => { orig += statSync(join(RADICE, c.via)).size; });
  orig += pesoRichiesta;
  const primoSchermo = Buffer.byteLength(unito) +
    file.filter((f) => /^app\..*\.css$/.test(f.nome) || /^cloud\./.test(f.nome))
      .reduce((n, f) => n + Buffer.byteLength(f.testo), 0);
  const conto = [
    '\n  in tutto  ' + Math.round(orig / 1024) + ' KB → ' + Math.round(dopo / 1024) + ' KB' +
      '   (' + Math.round(100 - 100 * dopo / orig) + '% in meno)',
    '  al primo schermo servono ' + Math.round(primoSchermo / 1024) + ' KB' +
      ' (prima erano ' + Math.round((orig - pesoRichiesta) / 1024) + ')'
  ];

  return { file, html: out, conto };
}

/* ------------------------------------------------------------- e scrivilo */
async function main() {
  const p = await piano();
  if (process.argv.includes('--pulisci') && existsSync(PACCO)) rmSync(PACCO, { recursive: true });
  mkdirSync(PACCO, { recursive: true });
  /* i file di un build vecchio restano lì a occupare posto nel repository:
     via quelli che non servono più. Il nome ha l'impronta dentro, quindi
     «non serve più» vuol dire «non è in questo piano». */
  const buoni = new Set(p.file.map((f) => f.nome));
  readdirSync(PACCO).forEach((f) => { if (!buoni.has(f)) rmSync(join(PACCO, f)); });
  p.file.forEach((f) => { writeFileSync(join(PACCO, f.nome), f.testo); console.log(f.riga); });
  writeFileSync(USCITA, p.html);
  p.conto.forEach((r) => console.log(r));
}

/* si esegue solo se lanciato a mano: prove/pacco.js lo importa e basta */
if (process.argv[1] && process.argv[1].endsWith('costruisci.mjs')) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
