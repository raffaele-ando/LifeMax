/* MISURA IN PAGINA quello che il generatore da solo non può sapere.
     node segni/misure.mjs        → scrive segni/misure.json

   Due cose, per ogni selettore che dichiara un angolo o un bordo:

   «corto»  il LATO CORTO più piccolo che quel selettore assume in tutta l'app.
            Serve perché l'angolo di Apple si mangia 1.528665 raggi lungo ogni
            lato: un elemento vuole un lato di almeno 3.057 raggi, se no i due
            angoli si scontrano. E siccome un `clip-path` risolve le
            percentuali PER ASSE, su una barretta alta 9 pixel con un raggio da
            8 il ritaglio non fa un angolo più piccolo: schiaccia la curva solo
            in verticale e l'estremità viene a punta, come una foglia. Il
            raggio va tagliato a corto/3.057, e per tagliarlo bisogna sapere
            quanto è alta la barretta. Dal foglio di stile non si vede: quasi
            tutto prende l'altezza dal contenuto.
            Vale anche per le PASTIGLIE (`border-radius: 99px`), che vogliono
            dire «tondo quanto basta»: il browser lo taglia da sé a metà del
            lato corto, un poligono no.

   «angolo» se quel selettore colpisce mai un elemento che ha ANCHE l'angolo.
            Serve per spegnere il colore del bordo del box: se lo dipingono sia
            il box sia l'anello, sui lati dritti viene doppio e sulla curva
            singolo — il difetto da cui è nato tutto questo. Chi ha l'angolo si
            capiva dal TESTO del selettore, e non si può: `.tl-blk` dichiara
            l'angolo e `.tl-blk-pasto`, un'altra classe SULLO STESSO elemento,
            dichiara il bordo. Nessuna regola scritta sui nomi lo vede. Aprire
            l'app e chiedere all'elemento sì.

   Si prende il MINIMO su tutte le scene e tutte le larghezze: un angolo tarato
   sul caso più stretto sta dentro anche in tutti gli altri.

   Va rilanciato quando si cambia l'altezza di qualcosa, e prima di
   node segni/squircle.mjs. Un selettore che non compare nel file resta come
   l'ha scritto il foglio di stile, e il generatore lo dice. */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium } from 'playwright';
import { daMisurare } from './squircle.mjs';

const QUI = path.dirname(new URL(import.meta.url).pathname);
const RADICE = path.join(QUI, '..');
const PORTA = 8823;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

/* la stessa lista che gira in prove/bordi.js: quando erano due liste, quella
   di qui era rimasta indietro di quattro pannelli */
const SCENE = JSON.parse(fs.readFileSync(path.join(RADICE, 'segni/scene.json'), 'utf8'));

const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
  fs.readFile(path.join(RADICE, p), (e, d) => {
    if (e) { r.statusCode = 404; r.end('x'); return; }
    r.setHeader('Content-Type', T[path.extname(p)] || 'application/octet-stream'); r.end(d);
  });
});
await new Promise((r) => srv.listen(PORTA, r));

const { raggi, bordi, forma } = daMisurare();
console.log('  da misurare: ' + raggi.length + ' selettori con un angolo, ' +
  bordi.length + ' con un colore di bordo');

const DENTRO = (dati) => {
  const { raggi, bordi, forma } = dati;
  const out = { corto: {}, angolo: {} };
  const visibile = (e) => {
    const q = e.getBoundingClientRect();
    if (q.width < 4 || q.height < 4) return null;
    const s = getComputedStyle(e);
    if (s.visibility === 'hidden' || s.display === 'none') return null;
    return q;
  };
  raggi.forEach((sel) => {
    let m = null;
    try {
      document.querySelectorAll(sel).forEach((e) => {
        const q = visibile(e); if (!q) return;
        const corto = Math.min(q.width, q.height);
        if (m === null || corto < m) m = corto;
      });
    } catch (e) { /* un selettore che il browser non digerisce: si salta */ }
    if (m !== null) out.corto[sel] = m;
  });
  /* «questo elemento ha l'angolo?» si chiede all'elemento, provando tutti i
     selettori della forma: è l'unico modo di vedere due classi diverse sullo
     stesso elemento */
  bordi.forEach((sel) => {
    try {
      document.querySelectorAll(sel).forEach((e) => {
        if (out.angolo[sel]) return;
        if (!visibile(e)) return;
        for (let i = 0; i < forma.length; i++) {
          try { if (e.matches(forma[i])) { out.angolo[sel] = true; return; } } catch (x) { /* selettore indigesto */ }
        }
      });
    } catch (e) { /* idem */ }
  });
  return out;
};

const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const corto = {}, angolo = {};
/* due larghezze e i due temi: il tema cambia i bordi, la larghezza le altezze */
for (const [largh, mob, tema] of [[320, true, 'light'], [390, true, 'light'], [1280, false, 'dark']]) {
  const ctx = await b.newContext({ viewport: { width: largh, height: 900 }, hasTouch: mob, isMobile: mob, colorScheme: tema });
  for (const { nome, via, tab, poi } of SCENE) {
    const p = await ctx.newPage();
    try {
      await p.goto('http://localhost:' + PORTA + '/index.html'); await p.waitForTimeout(300);
      await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
      await p.evaluate((v) => { location.hash = '#/' + v; }, via);
      await p.reload(); await p.waitForTimeout(via === 'lab' ? 1400 : 700);
      if (tab !== null) {
        await p.evaluate((i) => { const s = document.querySelectorAll('#vista .segmenti button, #vista .sez-nav button'); if (s[i]) s[i].click(); }, tab);
        await p.waitForTimeout(450);
      }
      if (poi) { await p.evaluate(poi); await p.waitForTimeout(800); }
      const r = await p.evaluate(DENTRO, { raggi, bordi, forma });
      Object.keys(r.corto).forEach((k) => {
        if (corto[k] === undefined || r.corto[k] < corto[k]) corto[k] = r.corto[k];
      });
      Object.keys(r.angolo).forEach((k) => { angolo[k] = true; });
    } catch (e) {
      console.log('  (' + nome + ' a ' + largh + 'px: ' + String(e).split('\n')[0].slice(0, 70) + ')');
    } finally { await p.close(); }
  }
  await ctx.close();
  console.log('  ' + largh + 'px ' + tema + ': fatto');
}
await b.close(); srv.close();

const fuori = {};
[...new Set([...Object.keys(corto), ...Object.keys(angolo)])].sort().forEach((k) => {
  const v = {};
  if (corto[k] !== undefined) v.corto = Math.round(corto[k] * 10) / 10;
  if (angolo[k]) v.angolo = true;
  fuori[k] = v;
});
fs.writeFileSync(path.join(RADICE, 'segni/misure.json'), JSON.stringify(fuori, null, 1) + '\n');
console.log('  misurati ' + Object.keys(corto).length + '/' + raggi.length + ' angoli · ' +
  Object.keys(angolo).length + ' selettori di bordo stanno su un elemento con l\'angolo');
console.log('  mai visti in pagina: ' + raggi.filter((x) => corto[x] === undefined).length +
  ' (restano come li ha scritti il foglio di stile)');
console.log('  scritto segni/misure.json');
