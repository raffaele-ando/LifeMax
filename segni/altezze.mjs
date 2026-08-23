/* MISURA IN PAGINA quanto sono alte le PASTIGLIE.
     node segni/altezze.mjs        → scrive segni/altezze.json

   Perché serve. Una pastiglia ha `border-radius: 99px`, cioè «tondo quanto
   basta»: il browser lo taglia da sé a metà del lato corto. Un `clip-path`
   invece no — in un poligono le percentuali si risolvono per asse, quindi non
   si può dire «metà del lato CORTO», e su una pastiglia da 300×54 il ritaglio
   darebbe una foglia con la punta da 151px invece di un angolo da 27.

   L'unico modo di dare anche a loro l'angolo continuo di Apple è sapere quanto
   sono alte. E l'unico modo onesto di saperlo è APRIRE L'APP E MISURARLE, non
   indovinare dal foglio di stile: molte prendono l'altezza dal contenuto.

   Si misura il lato CORTO più piccolo che quel selettore assume in tutta
   l'app: se lo stesso chip a volte è alto 24 e a volte 32, l'angolo tarato su
   24 sta dentro tutti e due. Al contrario si strozzerebbe.

   Va rilanciato quando si cambia l'altezza di una pastiglia. Se un selettore
   non c'è nel file, il generatore lo lascia capsula e lo dice. */

import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import http from 'http';
import { capsule } from './squircle.mjs';

const QUI = path.dirname(new URL(import.meta.url).pathname);
const RADICE = path.join(QUI, '..');
const PORTA = 8823;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

/* le stesse scene di prove/doppioni.js: schermate E pannelli, perché metà
   delle pastiglie vive dentro i pannelli */
const SCENE = [
  ['oggi', null, null],
  ['oggi', null, () => { const b = document.getElementById('btn-altre'); if (b) b.click(); }],
  ['giornata', null, null],
  ['inbox', 0, null], ['inbox', 1, null], ['inbox', 2, null],
  ['rituali', null, null],
  ['plancia', 0, null], ['plancia', 1, null], ['plancia', 2, null], ['plancia', 3, null],
  ['esperimenti', null, null],
  ['inbox', 1, () => { const r = document.querySelector('[data-bkapri]'); if (r) r.click(); }],
  ['inbox', 2, () => { const r = document.querySelector('[data-abdett]'); if (r) r.click(); }],
  ['inbox', 1, () => { const b = document.querySelector('.att-filtro'); if (b) b.click(); }],
  ['oggi', null, () => { const b = document.querySelector('.tabbar [data-catt]'); if (b) b.click(); }],
  ['plancia', null, () => { const b = [...document.querySelectorAll('#vista button')].find((x) => /Impostazioni/.test(x.textContent)); if (b) b.click(); }],
  ['plancia', null, () => { const b = [...document.querySelectorAll('#vista button')].find((x) => /Impostazioni/.test(x.textContent)); if (b) b.click(); setTimeout(() => { const c = document.getElementById('imp-ritmo'); if (c) c.click(); }, 400); }],
  ['plancia', null, () => { const b = [...document.querySelectorAll('#vista button')].find((x) => /Impostazioni/.test(x.textContent)); if (b) b.click(); setTimeout(() => { const c = document.getElementById('imp-aree'); if (c) c.click(); }, 400); }],
  ['plancia', null, () => { const b = [...document.querySelectorAll('#vista button')].find((x) => /Impostazioni/.test(x.textContent)); if (b) b.click(); setTimeout(() => { const c = document.getElementById('imp-prom-come'); if (c) c.click(); }, 400); }],
  ['lab', null, null]
];

const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
  fs.readFile(path.join(RADICE, p), (e, d) => {
    if (e) { r.statusCode = 404; r.end('x'); return; }
    r.setHeader('Content-Type', T[path.extname(p)] || 'application/octet-stream'); r.end(d);
  });
});
await new Promise((r) => srv.listen(PORTA, r));

const quali = capsule();
console.log('  pastiglie da misurare: ' + quali.length);

const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const trovate = {};
/* due larghezze: alcune pastiglie cambiano altezza fra telefono e computer, e
   il lato più corto delle due è quello che deve stare dentro */
for (const [largh, mob] of [[390, true], [1280, false]]) {
  for (const [via, tab, poi] of SCENE) {
    const p = await b.newPage({ viewport: { width: largh, height: 900 }, hasTouch: mob, isMobile: mob });
    try {
      await p.goto('http://localhost:' + PORTA + '/index.html'); await p.waitForTimeout(300);
      await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
      await p.evaluate((v) => { location.hash = '#/' + v; }, via);
      await p.reload(); await p.waitForTimeout(via === 'lab' ? 1400 : 700);
      if (tab !== null) {
        await p.evaluate((i) => { const s = document.querySelectorAll('.segmenti button, .sez-nav button'); if (s[i]) s[i].click(); }, tab);
        await p.waitForTimeout(450);
      }
      if (poi) { await p.evaluate(poi); await p.waitForTimeout(850); }
      const r = await p.evaluate((lista) => {
        const out = {};
        lista.forEach((sel) => {
          let m = null;
          try {
            document.querySelectorAll(sel).forEach((e) => {
              const q = e.getBoundingClientRect();
              if (q.width < 4 || q.height < 4) return;
              const s = getComputedStyle(e);
              if (s.visibility === 'hidden' || s.display === 'none') return;
              const corto = Math.min(q.width, q.height);
              if (m === null || corto < m) m = corto;
            });
          } catch (e) { /* un selettore che il browser non digerisce: si salta */ }
          if (m !== null) out[sel] = m;
        });
        return out;
      }, quali);
      Object.keys(r).forEach((k) => {
        if (trovate[k] === undefined || r[k] < trovate[k]) trovate[k] = r[k];
      });
    } finally { await p.close(); }
  }
}
await b.close(); srv.close();

const ordinate = {};
Object.keys(trovate).sort().forEach((k) => { ordinate[k] = Math.round(trovate[k] * 10) / 10; });
fs.writeFileSync(path.join(RADICE, 'segni/altezze.json'),
  JSON.stringify(ordinate, null, 1) + '\n');
console.log('  misurate: ' + Object.keys(ordinate).length + ' · mai viste: ' +
  (quali.length - Object.keys(ordinate).length));
console.log('  scritto segni/altezze.json');
