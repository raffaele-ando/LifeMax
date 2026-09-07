/* L'IMPRONTA DI OGNI SCHERMATA E DI OGNI PANNELLO — è ancora quella?

   COS'ERA PRIMA, e perché adesso è questo. Qui c'erano due prove gemelle:
   `gemelle.js` disegnava una schermata col codice di prima, si prendeva
   l'albero del DOM, la ridisegnava con React e confrontava; `fogli.js` faceva
   lo stesso un piano più sotto, per i pannelli. Sono state la misura che ha
   portato di qua sette schermate e quindici pannelli senza che chi guarda se
   ne accorgesse — quattro elementi in più nell'albero li ha trovati lei, non
   un'occhiata.

   Il codice di prima non c'è più, quindi quel confronto non ha più il secondo
   termine. Ma la macchina serve ancora, e serve per una domanda che vale da
   qui in avanti: l'albero è ancora quello di ieri? Le impronte stanno in
   `prove/impronte.json`, committate; questa prova le rifà e le confronta. Se
   una cambia, la prova non passa e va guardata: o è una modifica voluta — e
   allora si riscrive il file con `--aggiorna`, e la differenza si vede nel
   diff insieme al codice che l'ha causata — o è un elemento in più che
   nessuno voleva.

   Non è la stessa cosa di una fotografia. Non confronta gli stili calcolati:
   quelli vengono dalle classi, e se le classi combaciano vengono uguali per
   costruzione. Confronta, in ordine di quanto conta:
     1. l'albero: quali tag, annidati come, in che ordine
     2. le classi di ogni elemento
     3. il testo che si legge
     4. gli id e i data- da cui dipendono i comandi
     5. il valore dei campi

   node prove/impronte.js              tutto
   node prove/impronte.js inbox        una sola
   node prove/impronte.js --aggiorna   riscrive le impronte                */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const RADICE = require('./dove').SERVITO, PORTA = 8799;
const ALBO = path.join(__dirname, 'impronte.json');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.map': 'application/json' };

let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

const arg = process.argv[2] || '';
const AGGIORNA = arg === '--aggiorna';
const SOLO = AGGIORNA ? '' : arg;

/* le sette schermate, nell'ordine della navigazione */
const SCHERMATE = ['oggi', 'giornata', 'inbox', 'rituali', 'plancia', 'esperimenti', 'scienza'];

/* DA DOVE SI APRE OGNI PANNELLO.
   `vai` è la schermata, `tab` la linguetta (indice nella fila dei segmenti),
   `apri` il gesto che lo fa comparire. Il nome è quello con cui il pannello
   è registrato: se ne manca uno qui, la prova lo dice invece di saltarlo in
   silenzio — un pannello che nessuno guarda è un pannello che si rompe senza
   che nessuno lo sappia.
   Ci sono anche i due pannelli che React non disegna — «Impostazioni» e
   «Promemoria», che restano stringhe in `app.ts`: l'impronta è utile a
   quelli come agli altri. */
const APERTURE = {
  filtri: { titolo: 'Guarda solo', vai: 'inbox', tab: 1, apri: (p) => p.evaluate(() => {
    const b = document.querySelector('.att-filtro'); if (b) b.click();
  }) },
  /* «Altro» esiste solo con la barra a quattro pagine: con le tre porte
     accese quel pulsante non c'è, perché non ci sarebbe niente dentro. Per
     guardarlo bisogna quindi prima spegnere le tre porte. */
  menu: { titolo: 'Menu', vai: 'oggi',
    prima: (p) => p.evaluate(() => { const s = LM.load(); s.profilo.nav = 'tutte'; LM.save(); }),
    apri: (p) => p.evaluate(() => {
      const b = document.querySelector('#nav-tab [data-menu]'); if (b) b.click();
    }) },
  impostazioni: { titolo: 'Impostazioni', vai: 'plancia', apri: (p) => p.evaluate(() => {
    const b = document.getElementById('fondo-impostazioni') || document.querySelector('[data-imp]'); if (b) b.click();
  }) },
  aree: { titolo: 'Le tue aree', vai: 'plancia', apri: async (p) => {
    await p.evaluate(() => { const b = document.getElementById('fondo-impostazioni') || document.querySelector('[data-imp]'); if (b) b.click(); });
    await p.waitForTimeout(650);
    await p.evaluate(() => { const b = document.getElementById('imp-aree'); if (b) b.click(); });
  } },
  promemoria: { titolo: 'Promemoria', vai: 'plancia', apri: async (p) => {
    await p.evaluate(() => { const b = document.getElementById('fondo-impostazioni') || document.querySelector('[data-imp]'); if (b) b.click(); });
    await p.waitForTimeout(650);
    await p.evaluate(() => { const b = document.getElementById('imp-prom-come'); if (b) b.click(); });
  } },
  ritmo: { titolo: 'Sonno e pasti', vai: 'plancia', apri: async (p) => {
    await p.evaluate(() => { const b = document.getElementById('fondo-impostazioni') || document.querySelector('[data-imp]'); if (b) b.click(); });
    await p.waitForTimeout(650);
    await p.evaluate(() => { const b = document.getElementById('imp-ritmo'); if (b) b.click(); });
  } },
  /* con zero copie il pannello è tre righe di testo: si mette giù una copia
     prima, se no la parte che conta — l'elenco — non la guarda nessuno.
     QUELLO CHE QUI NON SI VEDE: la sezione «Nel cloud», con «Riprendi» e
     «Sostituisci», perché in questa prova il cloud non c'è e quella parte
     resta vuota. A guardarla è `prove/cloud.js`, che ha un Firebase finto e
     prova la cosa che conta davvero — che sostituire sostituisca — invece
     della forma dei due tasti. */
  backup: { titolo: 'Backup e ripristino', vai: 'plancia',
    /* UNA COPIA SOLA, e la stessa a ogni giro: senza svuotare il deposito il
       giro dopo ne trova una in più e l'impronta cambia per un motivo che è
       la prova stessa ad aver creato. L'orologio è fermo, quindi l'ora della
       copia è sempre quella. */
    prima: (p) => p.evaluate(() => {
      localStorage.removeItem('lifemax.backups.v1');
      LM.backup('prima-import');
    }),
    apri: async (p) => {
      await p.evaluate(() => { const b = document.getElementById('fondo-impostazioni') || document.querySelector('[data-imp]'); if (b) b.click(); });
      await p.waitForTimeout(650);
      await p.evaluate(() => { const b = document.getElementById('imp-backup'); if (b) b.click(); });
    } },
  /* si arriva da dentro alla scheda di un'attività: prima si apre quella, e
     poi il tasto del giorno accanto a un passo */
  'quando-passo': { vai: 'inbox', tab: 1, apri: async (p) => {
    await p.evaluate(() => {
      const st = LM.load().backlog.filter((b) => b.steps && b.steps.some((x) => !x.done))[0];
      const r = st && document.querySelector('[data-bkapri="' + st.id + '"]');
      if (r) r.click();
    });
    await p.waitForTimeout(700);
    await p.evaluate(() => { const b = document.querySelector('[data-stepquando]'); if (b) b.click(); });
  } },
  'da-abitudine': { vai: 'inbox', tab: 1, apri: async (p) => {
    await p.evaluate(() => { const r = document.querySelector('[data-bkapri]'); if (r) r.click(); });
    await p.waitForTimeout(700);
    await p.evaluate(() => { const b = document.getElementById('sc-abitudine'); if (b) b.click(); });
  } },
  /* «Non del tutto» si apre dalla scheda di un'attività non ancora mancata */
  mancata: { titolo: 'Non del tutto', vai: 'inbox', tab: 1, apri: async (p) => {
    await p.evaluate(() => {
      const st = LM.load().backlog.filter((b) => !b.mancata)[0];
      const r = st && document.querySelector('[data-bkapri="' + st.id + '"]');
      if (r) r.click();
    });
    await p.waitForTimeout(700);
    await p.evaluate(() => { const b = document.getElementById('sc-mancata'); if (b) b.click(); });
  } },
  /* la scelta del timer si apre da «Adesso», sulla cosa di adesso */
  timer: { titolo: 'Quanto ci stai', vai: 'oggi', apri: (p) => p.evaluate(() => {
    const b = document.getElementById('btn-timer');
    if (b) b.click();
  }) },
  /* del registro tecnico si guarda tutto tranne le righe che ci scorrono
     dentro: dicono cos'è successo in QUESTO giro, e la testa dice a che punto
     sta il salvataggio adesso. */
  diagnostica: { titolo: 'Registro tecnico', senza: '#diag-console, .diag-stato', vai: 'plancia', apri: async (p) => {
    await p.evaluate(() => { const b = document.getElementById('fondo-impostazioni') || document.querySelector('[data-imp]'); if (b) b.click(); });
    await p.waitForTimeout(650);
    /* IL REGISTRO SI SVUOTA UN ATTIMO PRIMA. Le righe si accumulano per tutta
       la prova, e il numero scritto sulla linguetta «Solo problemi (N)»
       cambierebbe a ogni giro per un motivo che non c'entra col pannello. */
    await p.evaluate(() => { if (window.LMLog) LMLog.svuota(); });
    await p.evaluate(() => { const b = document.getElementById('imp-diag'); if (b) b.click(); });
  } },
  lezione: { titolo: 'Una cosa che hai capito', vai: 'esperimenti', apri: (p) => p.evaluate(() => {
    const b = document.querySelector('[data-lezapri]'); if (b) b.click();
  }) },
  review: { titolo: 'Le review di prima', vai: 'plancia', apri: (p) => p.evaluate(() => {
    const b = document.getElementById('riep-review'); if (b) b.click();
  }) },
  guida: { titolo: 'Primi passi', vai: 'plancia', apri: async (p) => {
    await p.evaluate(() => { const b = document.getElementById('fondo-impostazioni') || document.querySelector('[data-imp]'); if (b) b.click(); });
    await p.waitForTimeout(650);
    await p.evaluate(() => { const b = document.getElementById('imp-guida'); if (b) b.click(); });
  } },
  /* DUE SCHEDE, NON UNA. Un'attività divisa in passi e una semplice sono due
     metà diverse dello stesso pannello — la scala dei passi, «Prossimo passo
     in Oggi» invece di «Portala in Oggi», la riga «Spalma i passi aperti» —
     e guardarne una sola vorrebbe dire lasciare l'altra fuori dalla misura. */
  scheda: [
    { come: 'divisa in passi', vai: 'inbox', tab: 1, apri: (p) => p.evaluate(() => {
      const st = LM.load().backlog.filter((b) => b.steps && b.steps.length)[0];
      const r = st && document.querySelector('[data-bkapri="' + st.id + '"]');
      if (r) r.click();
    }) },
    { come: 'semplice', vai: 'inbox', tab: 1, apri: (p) => p.evaluate(() => {
      const st = LM.load().backlog.filter((b) => !(b.steps && b.steps.length))[0];
      const r = st && document.querySelector('[data-bkapri="' + st.id + '"]');
      if (r) r.click();
    }) }
  ],
  abitudine: { vai: 'inbox', tab: 2, apri: (p) => p.evaluate(() => {
    const r = document.querySelector('[data-abdett]'); if (r) r.click();
  }) }
};

/* L'IMPRONTA DI UN ALBERO. Si scende in profondità e si scrive una riga per
   elemento: livello, tag, classi ordinate, id, i data-, il testo proprio
   (non quello dei figli, se no ogni testo comparirebbe a ogni livello) e il
   valore, se è un campo. */
const impronta = (radice, senza) => `(function (radice, senza) {
  function testoProprio(e) {
    var t = '';
    for (var i = 0; i < e.childNodes.length; i++) {
      var n = e.childNodes[i];
      if (n.nodeType === 3) t += n.nodeValue;
    }
    return t.replace(/\\s+/g, ' ').trim();
  }
  var out = [];
  function scendi(e, liv) {
    if (!e || e.nodeType !== 1) return;
    var tag = e.tagName.toLowerCase();
    /* Le classi che segnano un'ENTRATA sono appunti di runtime, non markup:
       animaIngresso le mette prima e le toglie quando l'animazione finisce,
       quindi ci sono o non ci sono a seconda dell'istante in cui guardi.
       (anim-a e anim-b poi si alternano APPOSTA a ogni disegno: sono due nomi
       per la stessa animazione, e servono a farla ripartire senza costringere
       il browser a impaginare.)
       Che l'entrata ci sia quando deve esserci lo tiene prove/sezioni.js, che
       guarda le animazioni vive invece delle classi. */
    var TRANSITORIE = /^(anim-a|anim-b|anim|vista-enter|sez-enter(-dx|-sx)?|sheet-entra)$/;
    var cl = (e.getAttribute('class') || '').trim().split(/\\s+/)
      .filter(function (c) { return c && !TRANSITORIE.test(c); })
      .sort().join('.');
    var dati = [];
    for (var i = 0; i < e.attributes.length; i++) {
      var a = e.attributes[i];
      /* i data-forma-* non sono markup: sono gli appunti che forma.ts si
         prende mentre lavora (misure, «questa l'ho gia fatta», «questa e
         secca»). Cambiano a seconda di QUANDO gira rispetto al disegno, non
         di che cosa e stato disegnato. I data- che contano sono quelli da cui
         dipendono i comandi.
         NIENTE APICI ROVESCI QUI DENTRO: questo pezzo vive dentro a un
         template literal, e un apice rovescio lo chiude. */
      if (a.name.indexOf('data-') === 0 && a.name.indexOf('data-forma') !== 0) dati.push(a.name + '=' + a.value);
    }
    /* il valore di un campo non sta negli attributi: due pannelli con lo
       stesso markup e dentro due valori diversi non sono lo stesso pannello */
    var val = (tag === 'input' || tag === 'select' || tag === 'textarea')
      ? ((e.type === 'checkbox' || e.type === 'radio') ? (e.checked ? '1' : '0') : (e.value || '')) : '';
    /* GLI ID GENERATI NON POSSONO ESSERE UGUALI, e non e' un difetto.
       LM.uid() e' 'id' piu' l'ora in base 36 piu' sei caratteri a caso:
       l'ora e' ferma (l'orologio e' bloccato), i sei caratteri no. Ogni
       giro semina dati nuovi con id nuovi, e senza questa riga l'impronta
       cambiava sempre — cioe' non diceva niente.
       Si tolgono i quattordici caratteri dell'id e si tiene quello che c'e'
       dopo: nei dati di esempio e' un suffisso scritto a mano ('550',
       'lez2') che dice QUALE cosa e', e quello e' segnale vero.
       NIENTE APICI ROVESCI QUI DENTRO: questo pezzo vive dentro a un
       template literal, e un apice rovescio lo chiude. E' la terza volta
       che ci casco in questo progetto. */
    const riga = (liv + '|' + tag + '|' + cl + '|' + (e.id || '') + '|' + dati.sort().join(',') + '|' + testoProprio(e) + '|' + val)
      /* DUE BARRE ROVESCE, NON UNA. Qui siamo dentro a un template
         literal: una barra rovescia con la b dietro e' il carattere
         backspace, non il confine di parola. Scritta con una sola, la
         regola si e' presa il backspace e non ha sostituito niente —
         zitta, e l'impronta continuava a cambiare a ogni giro. */
      .replace(/\\bid[0-9a-z]{14}/g, 'id~');
    out.push(riga);
    /* dentro a un <svg> non si guarda: i disegni li fa segni.ts, e i suoi
       nodi interni sono decine per icona */
    if (tag === 'svg') return;
    if (senza && e.matches(senza)) return;
    for (var j = 0; j < e.children.length; j++) scendi(e.children[j], liv + 1);
  }
  if (!radice) return ['NIENTE'];
  for (var k = 0; k < radice.children.length; k++) scendi(radice.children[k], 0);
  return out;
})(document.getElementById('${radice}'), ${senza ? "'" + senza + "'" : 'null'})`;

const TITOLO = `(function () {
  var t = document.getElementById('sheet-titolo');
  if (!t) return '';
  var c = t.querySelector('textarea, input');
  return (c ? c.value : t.textContent).replace(/\\s+/g, ' ').trim();
})()`;

/* DUE RICETTE CON LO STESSO NOME, E UNA SPARISCE SENZA DIRE NIENTE.
   `APERTURE` è un oggetto: se un nome compare due volte, la seconda vince e
   la prima non esiste più — comprese le sue righe (il titolo atteso, quello
   che c'è da preparare prima). È successo, e il pannello risultava guardato
   mentre la sua ricetta buona era stata coperta. Si legge il file e si conta. */
{
  const testo = fs.readFileSync(__filename, 'utf8');
  const dentro = testo.slice(testo.indexOf('const APERTURE = {'), testo.indexOf("/* L'IMPRONTA DI UN ALBERO"));
  const nomi = [...dentro.matchAll(/^  '?([a-z-]+)'?:\s*[[{]/gm)].map((m) => m[1]);
  const doppi = nomi.filter((n, i) => nomi.indexOf(n) !== i);
  if (doppi.length) {
    console.log('  KO  ogni pannello ha una ricetta sola  → ' + [...new Set(doppi)].join(', '));
    guai++;
  }
}

const vecchie = fs.existsSync(ALBO) ? JSON.parse(fs.readFileSync(ALBO, 'utf8')) : {};
const nuove = {};

/* la differenza si dice in righe, non in numeri: chi legge deve vedere COSA
   è cambiato senza aprire due file */
function confronta(nome, prima, adesso) {
  if (!prima) {
    ok(nome + ': impronta nuova, da mettere nell’albo', false,
      adesso.length + ' righe — rilancia con --aggiorna se è voluto');
    return;
  }
  if (prima.join('\n') === adesso.join('\n')) {
    ok(nome, true, adesso.length + ' elementi');
    return;
  }
  const n = Math.max(prima.length, adesso.length);
  const righe = [];
  for (let i = 0; i < n && righe.length < 6; i++) {
    if (prima[i] !== adesso[i]) {
      righe.push('    prima : ' + (prima[i] === undefined ? '(niente)' : prima[i]));
      righe.push('    adesso: ' + (adesso[i] === undefined ? '(niente)' : adesso[i]));
    }
  }
  ok(nome, false, prima.length + ' elementi → ' + adesso.length);
  righe.forEach((r) => console.log(r));
}

(async () => {
  const srv = http.createServer((q, r) => {
    let u = decodeURIComponent(q.url.split('?')[0]); if (u === '/') u = '/index.html';
    fs.readFile(path.join(RADICE, u), (e, d) => {
      if (e) { r.statusCode = 404; r.end('x'); return; }
      r.setHeader('Content-Type', T[path.extname(u)] || 'application/octet-stream'); r.end(d);
    });
  });
  await new Promise((r) => srv.listen(PORTA, r));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  const err = []; p.on('pageerror', (e) => err.push('' + e));
  /* l'orologio fermo: due giri a due ore diverse sono due giornate diverse,
     e la differenza non sarebbe del markup */
  await p.addInitScript((t) => {
    const D = Date;
    class F extends D { constructor(...a) { if (!a.length) super(t); else super(...a); } static now() { return t; } }
    window.Date = F;
  }, new Date('2026-08-18T10:30:00').getTime());

  await p.goto('http://localhost:' + PORTA + '/index.html'); await p.waitForTimeout(300);
  await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  await p.reload(); await p.waitForTimeout(1200);

  /* si aspetta che le animazioni finiscano: la schermata entra scorrendo, e
     fotografata a metà entrata non è ancora quella che sarà */
  const ferme = async (dove) => {
    for (let i = 0; i < 30; i++) {
      const quante = await p.evaluate(() =>
        document.getAnimations().filter((a) => a.playState === 'running' && a.effect &&
          (a.effect.getTiming().iterations || 1) !== Infinity).length);
      if (!quante) break;
      await p.waitForTimeout(100);
    }
    let prima = null;
    for (let i = 0; i < 25; i++) {
      const adesso = await p.evaluate((id) => {
        const e = document.getElementById(id);
        return e ? e.textContent : '';
      }, dove);
      if (adesso === prima) break;
      prima = adesso;
      await p.waitForTimeout(120);
    }
  };

  const pulisci = async () => {
    await p.evaluate(() => {
      const x = document.getElementById('sheet-chiudi');
      if (x) x.click();
      const s = LM.load(); s.profilo.nav = 'porte'; LM.save();
    });
    await p.waitForTimeout(400);
  };

  console.log('\nLE SETTE SCHERMATE');
  for (const v of SCHERMATE) {
    if (SOLO && SOLO !== v) continue;
    await p.evaluate((h) => { location.hash = '#/' + h; }, v);
    await p.waitForTimeout(350);
    await ferme('vista');
    const imp = await p.evaluate(impronta('vista', null));
    nuove[v] = imp;
    if (!AGGIORNA) confronta(v, vecchie[v], imp);
  }

  console.log('\nI PANNELLI');
  const nomi = Object.keys(APERTURE);
  for (const nome of nomi) {
    const ricette = Array.isArray(APERTURE[nome]) ? APERTURE[nome] : [APERTURE[nome]];
    for (const r of ricette) {
      const eti = nome + (r.come ? ' (' + r.come + ')' : '');
      if (SOLO && SOLO !== nome) continue;
      await pulisci();
      if (r.prima) await r.prima(p);
      await p.evaluate((h) => { location.hash = '#/' + h; }, r.vai);
      await p.waitForTimeout(400);
      if (r.tab != null) {
        await p.evaluate((i) => {
          const bb = document.querySelectorAll('#vista .segmenti.sez-nav button, .testa-porta .segmenti.sez-nav button');
          if (bb[i]) bb[i].click();
        }, r.tab);
        await p.waitForTimeout(450);
      }
      await r.apri(p);
      await p.waitForTimeout(500);
      await ferme('sheet-corpo');
      const imp = await p.evaluate(impronta('sheet-corpo', r.senza || null));
      const tit = await p.evaluate(TITOLO);
      const chiave = 'foglio:' + eti;
      nuove[chiave] = imp;
      nuove[chiave + ' [titolo]'] = [tit];
      if (!AGGIORNA) {
        if (imp.length === 1 && imp[0] === 'NIENTE') {
          ok(eti, false, 'il pannello non si e’ aperto: la ricetta non porta piu’ da nessuna parte');
        } else {
          confronta(eti, vecchie[chiave], imp);
          if (r.titolo) ok(eti + ': il titolo', tit === r.titolo, tit);
          else confronta(eti + ': il titolo', vecchie[chiave + ' [titolo]'], [tit]);
        }
      }
    }
  }

  if (AGGIORNA) {
    /* si tiene quello che non si è rifatto in questo giro: `--aggiorna` con
       un nome solo non deve buttare via le altre */
    const tutte = Object.assign({}, vecchie, nuove);
    fs.writeFileSync(ALBO, JSON.stringify(tutte, null, 1) + '\n');
    console.log('\n>>> ALBO RISCRITTO: ' + Object.keys(nuove).length + ' impronte in prove/impronte.json');
    console.log('    guardale nel diff: quello che è cambiato deve avere una ragione nel codice accanto.');
    await b.close(); srv.close(); process.exit(0);
  }

  ok('nessun errore JS', !err.length, err.slice(0, 3).join(' · '));
  console.log(guai ? '\n>>> ' + guai + ' IMPRONTE CAMBIATE' : '\n>>> TUTTO A POSTO');
  await b.close(); srv.close();
  process.exit(guai ? 1 : 0);
})();
