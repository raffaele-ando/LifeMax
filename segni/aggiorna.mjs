/* RIFÀ IL PACCO da una copia di lucide-static.
     npm pack lucide-static && tar xzf lucide-static-*.tgz
     node segni/aggiorna.mjs ./package

   Riscrive pacco.json (nome → frammento SVG) e parole.json (nome → parole
   per cercarlo). Non tocca assets/icons.js: i segni già presi restano quelli
   che sono, perché un tracciato che cambia a monte non deve cambiare l'app
   sotto i piedi. Se un giorno serve aggiornarne uno preso, si ripassa da
   prendi.mjs a mano. */
import fs from 'fs';
import path from 'path';
const QUI = path.dirname(new URL(import.meta.url).pathname);
const da = process.argv[2];
if (!da) { console.log('  uso: node segni/aggiorna.mjs <cartella di lucide-static>'); process.exit(1); }

const nodi = JSON.parse(fs.readFileSync(path.join(da, 'icon-nodes.json'), 'utf8'));
const parole = JSON.parse(fs.readFileSync(path.join(da, 'tags.json'), 'utf8'));
const attr = (o) => Object.keys(o).map((k) => ' ' + k + '="' + o[k] + '"').join('');

const fuori = {};
for (const [nome, ns] of Object.entries(nodi)) {
  fuori[nome] = ns.map(([tag, a]) => '<' + tag + attr(a) + '/>').join('');
}
fs.writeFileSync(path.join(QUI, 'pacco.json'), JSON.stringify(fuori));
fs.writeFileSync(path.join(QUI, 'parole.json'), JSON.stringify(parole));
fs.copyFileSync(path.join(da, 'LICENSE'), path.join(QUI, 'LICENZA-lucide.txt'));

/* i segni già dentro l'app: se uno è sparito a monte va detto adesso, non il
   giorno in cui qualcuno lo cerca e non lo trova */
const ico = fs.readFileSync(path.join(QUI, '..', 'assets', 'icons.js'), 'utf8');
const presi = [...ico.matchAll(/\/\* *lucide:([a-z0-9-]+) *—/g)].map((m) => m[1]);
const spariti = presi.filter((n) => !fuori[n]);
console.log('  ' + Object.keys(fuori).length + ' segni nel pacco, ' + presi.length + ' già presi nell’app');
if (spariti.length) console.log('  ATTENZIONE: non ci sono più a monte → ' + spariti.join(', '));
