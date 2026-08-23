/* RIFÀ L'ICONA DELL'APP E IL LOGO con la curva continua di Apple.
     node segni/icone.mjs

   Cosa tocca:
     assets/icone/icona.svg        il disegno, forma + gradiente + segno
     assets/icone/*.png            le PNG, rasterizzate dagli SVG
     assets/icons.js               il tracciato dentro LOGO()

   Il raggio non è una scelta di gusto: l'angolo di Apple si mangia 1.528665
   raggi lungo ogni lato, quindi il raggio più grande che ci sta in un quadrato
   è lato / 3.057 — e a quel raggio i due angoli si toccano esattamente a metà
   del lato. È il caso limite, ed è quello dell'icona di iOS: la forma piena,
   senza tratti dritti in mezzo. Per questo l'icona usa esattamente quel valore
   invece di un numero tondo scelto a occhio.

   Le icone che iOS e Android mascherano da sé (icona-ios.svg,
   icona-maskable.svg) restano QUADRE e piene fino al bordo: se le smussassimo
   noi, dentro la maschera del sistema resterebbe un anello di niente. */

import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import * as A from './apple.mjs';

const QUI = path.dirname(new URL(import.meta.url).pathname);
const RADICE = path.join(QUI, '..');
const leggi = (f) => fs.readFileSync(path.join(RADICE, f), 'utf8');
const scrivi = (f, t) => fs.writeFileSync(path.join(RADICE, f), t);

/* --- 1. il disegno dell'icona --- */
const LATO = 512;
const R = LATO / (2 * A.INIZIO);
const tracciato = A.tracciatoSvg(LATO, LATO, R);
{
  let svg = leggi('assets/icone/icona.svg');
  /* La forma è il tracciato LUNGO. Due trappole già prese: agganciarlo a «M0»
     funzionava una volta sola (il tracciato nuovo comincia con «M 256»), e
     controllare «il testo è cambiato» falliva alla seconda passata, quando il
     tracciato è GIÀ quello giusto. Si controlla che la regola abbia trovato
     qualcosa, non che abbia cambiato qualcosa. */
  const dove = /d="M ?[0-9][^"]{200,}"/;
  if (!dove.test(svg)) throw new Error('non ho trovato il tracciato della forma in icona.svg');
  svg = svg.replace(dove, 'd="' + tracciato + '"');
  scrivi('assets/icone/icona.svg', svg);
  console.log('  icona.svg: raggio ' + R.toFixed(1) + 'px su ' + LATO + ' (l\'angolo ne prende ' +
    (A.INIZIO * R).toFixed(0) + ', cioè metà lato)');
}

/* --- 2. il logo dentro l'app --- */
{
  const lato = 44, r = lato / (2 * A.INIZIO);
  const d = A.tracciatoSvg(lato, lato, r);
  let js = leggi('assets/icons.js');
  const doveJs = /'<path transform="translate\(2 2\)" d="M ?[0-9][^"]{200,}"/;
  if (!doveJs.test(js)) throw new Error('non ho trovato il tracciato dentro LOGO()');
  js = js.replace(doveJs, '\'<path transform="translate(2 2)" d="' + d + '"');
  /* e il commento sopra, che parlava di superellisse */
  js = js.replace(/\/\* Non un `rect` con `rx`[\s\S]*?Generato con: node segni\/[a-z.]+ [0-9 ]*\*\//,
    ['/* Non un `rect` con `rx`: quello è un rettangolo con quattro archi di',
      '         CERCHIO. Questo è il tracciato dell\'angolo CONTINUO di Apple — tre',
      '         Bézier per angolo, costanti in segni/apple.mjs — e siccome è un',
      '         tracciato è la forma vera su qualunque browser, anche dove',
      '         `corner-shape` non c\'è. Il raggio è lato / 3.057: il più grande che',
      '         ci sta, cioè il caso in cui i due angoli si toccano a metà del lato.',
      '         Generato con: node segni/icone.mjs */'].join('\n      '));
  scrivi('assets/icons.js', js);
  console.log('  icons.js: logo rifatto, raggio ' + r.toFixed(1) + 'px su ' + lato);
}

/* --- 3. le PNG --- */
const DA_FARE = [
  ['assets/icone/icona.svg', 'assets/icone/icona-512.png', 512, true],
  ['assets/icone/icona.svg', 'assets/icone/icona-192.png', 192, true],
  ['assets/icone/icona.svg', 'assets/icone/favicon-32.png', 32, true],
  ['assets/icone/icona-ios.svg', 'assets/icone/icona-180.png', 180, false],
  ['assets/icone/icona-ios.svg', 'assets/icone/icona-167.png', 167, false],
  ['assets/icone/icona-ios.svg', 'assets/icone/icona-152.png', 152, false],
  ['assets/icone/icona-maskable.svg', 'assets/icone/icona-maskable-192.png', 192, false],
  ['assets/icone/icona-maskable.svg', 'assets/icone/icona-maskable-512.png', 512, false]
];

const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const p = await b.newPage({ viewport: { width: 600, height: 600 } });
for (const [da, a, lato, trasparente] of DA_FARE) {
  const svg = leggi(da);
  await p.setContent('<body style="margin:0;background:' + (trasparente ? 'transparent' : '#fff') + '">' +
    '<div id="q" style="width:' + lato + 'px;height:' + lato + 'px;line-height:0">' +
    svg.replace(/<svg /, '<svg width="' + lato + '" height="' + lato + '" ') + '</div></body>');
  await p.waitForTimeout(60);
  const buf = await p.locator('#q').screenshot({ omitBackground: true });
  fs.writeFileSync(path.join(RADICE, a), buf);
  console.log('  ' + a.replace('assets/icone/', '') + ' ' + lato + 'px' +
    (trasparente ? ' (angolo trasparente)' : ' (piena fino al bordo)'));
}
await b.close();
