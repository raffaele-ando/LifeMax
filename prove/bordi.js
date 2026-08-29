/* OGNI FORMA E OGNI BORDO, IN OGNI SCHERMATA, A OGNI LARGHEZZA, IN TUTTI E DUE I TEMI.

   La forma non è più un foglio di stile generato: la disegna `assets/forma.js`
   a runtime, in pixel, sulla misura vera di ogni elemento. Cambiando il
   sistema sono cambiate le cose che possono rompersi, e questa prova è stata
   riscritta sulle nuove.

   TRE DI QUELLE VECCHIE NON POSSONO PIÙ ESISTERE, e non perché siano state
   sistemate: perché non c'è più il pezzo che le produceva. Il bordo era un
   ANELLO su uno pseudo-elemento, e da lì venivano «l'anello finito sullo
   pseudo-elemento di qualcun altro», «l'anello mangiato dall'overflow» e
   «l'anello che scorre col contenuto». Adesso il bordo è un'immagine di
   sfondo dello stesso elemento. Al posto di tre controlli ne resta uno, che
   costa niente: che nessuno pseudo-elemento porti un ritaglio.

   QUELLE NUOVE nascono tutte dallo stesso posto — RILEGGERE QUELLO CHE
   ABBIAMO SCRITTO NOI. Il raggio lo riscriviamo al 99% (serve all'ombra): se
   alla passata dopo si rilegge quello, si riduce del 99% del 99% del 99%, e
   la barra in basso è arrivata a disegnarne 5.8 su 18 dichiarati. Il colore
   del bordo lo spegniamo: riletto, torna «trasparente», e il filo non viene
   più ridisegnato. Lo sfondo di sotto se lo riprende il filo, e se non gli si
   riportano dietro TUTTE le sue regole — ripetizione, misura, posizione — la
   freccina del menù a tendina finisce piastrellata a grandezza naturale sopra
   il nome dell'area. Sono difetti che si vedono uno per volta e su schermate
   diverse, e che a occhio sembrano tre cose scollegate.

   LE COSE CHE CERCA
   1. angolo tondo senza il ritaglio        → è rimasto un arco di cerchio
   2. bordo con lo spessore e nessuno che lo dipinge → bordo sparito
   3. bordo dipinto DUE volte                → fianchi scuri e angoli chiari
   4. il filo e il ritaglio non dicono la stessa curva → contorno fuori posto
   5. il filo disegnato su una misura vecchia → cornice più piccola dentro
   6. il raggio ristretto giro dopo giro     → forme di famiglie diverse
   7. le corsie dello sfondo scalate di un posto → freccine piastrellate
   8. un ritaglio che sta DENTRO il riquadro  → mangia quello che sporge
   9. un angolo più grande di quanto ci sta   → forma strozzata
  10. un ritaglio su uno pseudo-elemento      → non deve più esistercene
  11. un blocco più largo della pagina
  12. un'ombra DURA con lo spread al posto di un bordo → fessura negli angoli
      (anche col fuoco addosso: l'alone dei campi era proprio questo)

   node prove/bordi.js        (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const PORTA = 8825;
let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

/* LE SCENE stanno in segni/scene.json, una lista sola per tutti. */
const SCENE = JSON.parse(fs.readFileSync(path.join(RADICE, 'segni/scene.json'), 'utf8'));

/* --- il controllo, dentro la pagina --- */
const CONTROLLA = `(function (conFuoco) {
  var INIZIO = 1.528665;
  var nome = function (e) { return e.tagName.toLowerCase() +
    (e.className && e.className.toString ? '.' + e.className.toString().trim().split(/\\s+/).slice(0, 3).join('.') : ''); };
  var vuoto = function (c) {
    if (!c || c === 'transparent' || c === 'none') return true;
    var m = /^rgba?\\(([^)]*)\\)/.exec(c);
    if (!m) return false;
    var p = m[1].split(/[,/]/);
    return p.length > 3 && parseFloat(p[3]) < 0.004;
  };
  /* separa un elenco CSS sulle virgole di PRIMO livello: dentro un url() di
     un SVG in chiaro di virgole ce ne sono a decine */
  var corsie = function (v) {
    var out = [], liv = 0, cur = '';
    for (var i = 0; i < v.length; i++) {
      var c = v.charAt(i);
      if (c === '(') liv++; else if (c === ')') liv--;
      if (c === ',' && liv === 0) { out.push(cur.trim()); cur = ''; } else cur += c;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  };
  var numeri = function (s) {
    var m = s.match(/-?\\d+(\\.\\d+)?/g);
    return m ? m.map(Number) : [];
  };
  /* I QUATTRO RAGGI DEL RITAGLIO. Ogni morso comincia dal vertice e va al
     punto dove l'angolo attacca sul lato: quella distanza vale 1.528665
     raggi, sempre, per tutti e quattro. Si legge da lì e non dai punti di
     controllo, che sono nove numeri per angolo. */
  var raggiDelRitaglio = function (d, w, h) {
    var pezzi = d.split('M').slice(1);         /* il primo è il rettangolone */
    if (pezzi.length < 2) return null;
    /* OGNI MORSO SI RICONOSCE DAL SUO VERTICE, e non dall'ordine in cui sta
       scritto. Un elenco di angoli asimmetrici (0 8px 8px 0),
       che nell'app è la barra dei grafici e il riquadro «a cosa serve» della
       Scienza — fa emettere DUE morsi invece di quattro, perché per un angolo
       da zero non c'è niente da togliere. Leggendoli in fila si confrontava il
       morso in alto a destra con l'angolo in alto a sinistra, e la prova
       diceva «raggio ristretto» su una forma perfetta. Sei falsi allarmi. */
    var out = [0, 0, 0, 0];
    var dove = function (x, y) {
      var su = Math.abs(y) < Math.abs(y - h), sx = Math.abs(x) < Math.abs(x - w);
      return su ? (sx ? 0 : 1) : (sx ? 3 : 2);      /* tl, tr, br, bl */
    };
    for (var i = 1; i < pezzi.length; i++) {
      var n = numeri(pezzi[i].split('C')[0]);
      if (n.length < 4) return null;
      out[dove(n[0], n[1])] = Math.hypot(n[2] - n[0], n[3] - n[1]) / INIZIO;
    }
    return out;
  };
  /* I QUATTRO RAGGI DEL FILO, dal contorno pieno dentro l'SVG. Il tracciato è
     M(inizio del lato di sopra) L(attacco in alto a destra) CCC L(...) ...
     e ogni L dice dove finisce un lato dritto: da lì si risale al raggio. */
  var raggiDelFilo = function (d, w, h, dx) {
    var L = d.match(/L-?[\\d.]+ -?[\\d.]+/g);
    if (!L || L.length < 4) return null;
    var p = L.map(function (s) { return numeri(s); });
    return [
      (p[3][1] - dx) / INIZIO,                 /* tl: dall'ultimo, sul lato sinistro */
      (w - dx - p[0][0]) / INIZIO,             /* tr */
      (h - dx - p[1][1]) / INIZIO,             /* br */
      (p[2][0] - dx) / INIZIO                  /* bl */
    ];
  };

  var out = { ritagliati: 0, tondi: [], spariti: [], doppi: [], curveDiverse: [],
    filoVecchio: [], raggiRistretti: [], corsie: [], mangiati: [], strozzati: [],
    pseudoRitagliati: [], fuoriPagina: [], ombreBordo: [] };

  var guarda = function (e, colFuoco) {
    var s = getComputedStyle(e), r = e.getBoundingClientRect();
    if (r.width < 4 || r.height < 4 || s.visibility === 'hidden' || s.display === 'none' || s.opacity === '0') return;
    var w = e.offsetWidth, h = e.offsetHeight;
    var clip = (s.clipPath && s.clipPath !== 'none') ? s.clipPath : '';
    var suoRitaglio = /^path\\(/.test(clip) && clip.indexOf('-200') >= 0;
    var raggi = ['borderTopLeftRadius','borderTopRightRadius','borderBottomRightRadius','borderBottomLeftRadius']
      .map(function (k) { return parseFloat(s[k]) || 0; });
    var rmax = Math.max.apply(null, raggi);
    var bw = parseFloat(s.borderTopWidth) || 0;
    var sfondi = corsie(s.backgroundImage === 'none' ? '' : s.backgroundImage);
    var ilFilo = sfondi.length && /stroke%3D|stroke=/.test(sfondi[0]) ? sfondi[0] : '';

    if (suoRitaglio) out.ritagliati++;

    /* 12. UN'OMBRA DURA USATA COME BORDO — vale anche col fuoco addosso.
          Un box-shadow di 0 0 0 Npx non è un'ombra, è un contorno, e un
          contorno segue il border-radius, che è un ARCO. Quello che si vede
          dell'elemento lo decide il ritaglio, che è la curva di Apple: sui
          lati dritti combaciano, sui quarantacinque gradi l'arco sporge, e
          negli angoli resta una fessura. Un'ombra SFOCATA no: la fessura c'è
          lo stesso ma la sfocatura la copre. Quindi si guarda solo quelle a
          sfocatura zero. È il difetto dell'alone viola dei campi. */
    if (suoRitaglio) {
      var ombra = s.boxShadow || '';
      if (ombra && ombra !== 'none') {
        corsie(ombra).forEach(function (o) {
          if (/inset/.test(o)) return;
          var m4 = o.match(/(-?[0-9.]+)px +(-?[0-9.]+)px +(-?[0-9.]+)px +(-?[0-9.]+)px/);
          if (!m4) return;
          if (Math.abs(+m4[1]) > 0.6 || Math.abs(+m4[2]) > 0.6) return;   /* spostata: è un'ombra */
          if (+m4[3] > 0.6) return;                                       /* sfocata: non si vede */
          if (+m4[4] <= 0.4) return;                                      /* senza spread non è un contorno */
          /* sotto i sei pixel di morso lo scarto fra la curva e l'arco sta
             sotto il mezzo pixel, e lì il difetto non esiste */
          if (rmax * INIZIO < 6) return;
          out.ombreBordo.push(nome(e) + (colFuoco ? ' COL FUOCO' : '') + '  ' + o.trim().slice(0, 44));
        });
      }
    }
    if (colFuoco) return;   /* col fuoco si guarda solo l'alone: il resto è già stato guardato */

    /* 11. QUALCOSA CHE ESCE DALLA PAGINA. */
    if (r.right > innerWidth + 2 || r.left < -2) {
      var scorrevole = false, decoro = s.pointerEvents === 'none';
      for (var a = e.parentElement; a; a = a.parentElement) {
        var as = getComputedStyle(a);
        if (/auto|scroll|hidden|clip/.test(as.overflowX)) { scorrevole = true; break; }
        if (as.pointerEvents === 'none') { decoro = true; break; }
      }
      if (!scorrevole && !decoro && s.position !== 'fixed')
        out.fuoriPagina.push(nome(e) + ' da ' + Math.round(r.left) + ' a ' +
          Math.round(r.right) + ' (pagina larga ' + innerWidth + ')');
    }

    /* 10. UN RITAGLIO SU UNO PSEUDO-ELEMENTO. L'anello del bordo non esiste
          più: se qualcosa del genere ricompare, è un pezzo del sistema
          vecchio rimasto indietro. */
    ['::before', '::after'].forEach(function (ps) {
      var q = getComputedStyle(e, ps);
      var c = q.clipPath || '';
      if (/^(polygon|path)\\(/.test(c)) out.pseudoRitagliati.push(nome(e) + ps + ' ' + c.slice(0, 40));
    });

    /* 1. un angolo tondo senza la curva. Un TONDO vero non la vuole: un
          elemento quadrato che chiede mezzo lato di raggio sta chiedendo un
          cerchio, e un cerchio è quello che è. */
    var eCapsula = rmax >= Math.min(w, h) / 2 - 0.51;
    var eTondo = eCapsula && Math.abs(w - h) <= 2;
    if (rmax >= 1 && !suoRitaglio && !eTondo)
      out.tondi.push(nome(e) + ' r=' + rmax.toFixed(1) + ' ' + w + 'x' + h);

    /* 2. il bordo c'è come spessore e nessuno lo dipinge */
    var loDipingeIlBox = bw > 0 && !vuoto(s.borderTopColor);
    if (bw > 0 && !loDipingeIlBox && !ilFilo && e.dataset.formaBordo)
      out.spariti.push(nome(e) + ' ' + bw + 'px, doveva essere ' + e.dataset.formaBordo);

    /* 3. dipinto due volte: sui lati dritti viene doppio, sulla curva singolo */
    if (loDipingeIlBox && ilFilo)
      out.doppi.push(nome(e) + ' box=' + s.borderTopColor);

    if (!suoRitaglio) return;
    var rc = raggiDelRitaglio(clip.replace(/^path\\(["']?/, '').replace(/["']?\\)$/, ''), w, h);

    /* 9. l'angolo non ci sta: vuole 3.057 raggi di lato, se no si strozza */
    if (rc) {
      var piu = Math.max.apply(null, rc);
      if (Math.min(w, h) < 2 * INIZIO * piu - 0.6)
        out.strozzati.push(nome(e) + ' angolo ' + (INIZIO * piu).toFixed(1) + 'px su un lato di ' + Math.min(w, h));
    }

    /* 6. IL RAGGIO SI È RISTRETTO GIRO DOPO GIRO. Quello scritto vale il 99%
          di quello del ritaglio, sempre: se vale meno, qualcuno ha riletto
          quello che aveva scritto lui e il conto è ripartito da lì. */
    if (rc) {
      for (var k = 0; k < 4; k++) {
        if (rc[k] < 0.5) continue;
        var atteso = rc[k] * 0.99;
        if (Math.abs(raggi[k] - atteso) > 0.05)
          { out.raggiRistretti.push(nome(e) + ' scritto ' + raggi[k].toFixed(2) + ', doveva essere ' + atteso.toFixed(2) + '  ' + JSON.stringify(e.dataset)); break; }
      }
    }

    if (!ilFilo) return;
    var svg = decodeURIComponent(ilFilo);

    /* 5. IL FILO È DISEGNATO SULLA MISURA DI ADESSO. Se l'SVG è largo quanto
          l'elemento era prima, la cornice si vede più piccola dentro, e in
          mezzo restano due o tre pixel di fondo: era la seconda cornice nella
          barra in basso. */
    var wh = svg.match(/width="([\\d.]+)" height="([\\d.]+)"/);
    if (wh && (Math.abs(+wh[1] - w) > 0.6 || Math.abs(+wh[2] - h) > 0.6))
      out.filoVecchio.push(nome(e) + ' filo ' + wh[1] + 'x' + wh[2] + ', elemento ' + w + 'x' + h);

    /* 4. IL FILO E IL RITAGLIO DEVONO DIRE LA STESSA CURVA. Sono la stessa
          funzione con un rientro di mezzo spessore: se i raggi non tornano,
          il contorno passa dove la forma non passa. */
    var dd = svg.match(/ d="([^"]+)"/);
    var sp = (svg.match(/stroke-width="([\\d.]+)"/) || [0, 0])[1];
    if (dd && rc) {
      var rf = raggiDelFilo(dd[1], w, h, +sp / 2);
      /* il filo corre a mezzo spessore DENTRO il contorno, quindi il suo raggio
         vale un mezzo spessore in meno — ma non sotto zero: un angolo che non
         c'e' resta a zero anche rientrando. Senza il taglio a zero ogni forma
         con un angolo vivo (il pannello, che è tondo sopra e squadrato sotto)
         risultava «con due curve diverse» per mezzo pixel inventato. */
      if (rf) for (var j = 0; j < 4; j++) {
        var atteso2 = Math.max(0, rc[j] - (+sp) / 2);
        if (Math.abs(rf[j] - atteso2) > 0.08) {
          out.curveDiverse.push(nome(e) + ' angolo ' + j + ': filo ' + rf[j].toFixed(2) + ', atteso ' + atteso2.toFixed(2) + ' (ritaglio ' + rc[j].toFixed(2) + ')');
          break;
        }
      }
    }

    /* 7. LE CORSIE DELLO SFONDO SONO SCALATE DI UN POSTO.
          Un elenco di sfondi è a più corsie: ripetizione, misura, posizione,
          origine e ritaglio sono elenchi anche loro, letti in parallelo alle
          immagini. Mettendo il filo davanti senza riportare dietro le regole
          di quello che c'era, ogni regola scivola di un posto e finisce
          addosso all'immagine sbagliata. Si è visto sul selettore dell'area
          del Diario: la freccina, che è «no-repeat, 12px, a destra», ha preso
          quello che restava — ripetuta, a grandezza naturale — e nel riquadro
          comparivano cinque spuntoni grigi sopra il nome. */
    var quante = sfondi.length;
    if (quante > 1) {
      [['backgroundRepeat', s.backgroundRepeat], ['backgroundSize', s.backgroundSize],
       ['backgroundPositionX', s.backgroundPositionX], ['backgroundPositionY', s.backgroundPositionY],
       ['backgroundOrigin', s.backgroundOrigin], ['backgroundClip', s.backgroundClip]].forEach(function (p) {
        if (corsie(p[1]).length !== quante)
          out.corsie.push(nome(e) + ' ' + quante + ' sfondi ma ' + corsie(p[1]).length + ' ' + p[0] + ' (' + p[1].slice(0, 30) + ')');
      });
    }
  };

  document.querySelectorAll('body *').forEach(function (e) { guarda(e, false); });

  /* 8. UN RITAGLIO CHE STA DENTRO IL RIQUADRO mangia quello che sporge.
        Quello di forma.js comincia duecento pixel fuori da ogni lato e toglie
        solo le quattro zone d'angolo, quindi non può mangiare niente — ed è
        per questo che la barretta dell'accento della colonna, che sta
        quattordici pixel FUORI dalla voce di menu, si vede. Se ne compare uno
        che sta dentro, va guardato. */
  document.querySelectorAll('body *').forEach(function (e) {
    var s = getComputedStyle(e), c = s.clipPath || '';
    if (c === 'none' || c.indexOf('-200') >= 0) return;
    if (!/^(path|polygon|inset|circle|ellipse)\\(/.test(c)) return;
    if (!/^visible/.test(s.overflow)) return;
    var r = e.getBoundingClientRect();
    for (var i = 0; i < e.children.length; i++) {
      var q = e.children[i].getBoundingClientRect();
      if (q.width < 1 || q.height < 1) continue;
      if (getComputedStyle(e.children[i]).position === 'fixed') continue;
      var fuori = Math.max(r.left - q.left, r.top - q.top, q.right - r.right, q.bottom - r.bottom);
      if (fuori > 0.6) out.mangiati.push(nome(e) + ' ← ' + nome(e.children[i]) + ' ' + Math.round(fuori) + 'px');
    }
  });

  /* E ADESSO COL FUOCO ADDOSSO.
     Si fa su UNA vista sola. Toccare novanta campi uno per uno e rimisurare
     l'alone costa piu' di tutto il resto della prova messo insieme, e l'alone
     non dipende dalla larghezza ne' dal tema: e' la stessa regola di stile
     ovunque. Su cinque viste erano ventitremila messe a fuoco. L'alone del fuoco è un'ombra come le altre e
     obbedisce alla stessa regola, ma esiste solo mentre il campo è toccato:
     guardando la pagina ferma non si vede mai. Si toccano tutti, uno per uno,
     e si guarda l'alone che compare. È il difetto che si vede nella
     fotografia del campo «Cosa hai fatto». */
  if (!conFuoco) return out;
  var campi = document.querySelectorAll('input, select, textarea, button, a[href], [tabindex]');
  var primaAveva = document.activeElement;
  for (var i = 0; i < campi.length && i < 90; i++) {
    try { campi[i].focus({ preventScroll: true }); } catch (e2) { continue; }
    if (document.activeElement !== campi[i]) continue;
    guarda(campi[i], true);
  }
  try { if (primaAveva && primaAveva.focus) primaAveva.focus({ preventScroll: true }); else document.activeElement.blur(); } catch (e3) {}
  return out;
})`;

/* IL CODICE CHE VA IN PAGINA SI COMPILA PRIMA DI PARTIRE.
   `CONTROLLA` è una stringa fra apici inversi, e là dentro ogni barra rovescia
   va scritta DOPPIA: `/^path\\(/` nel sorgente diventa `/^path\(/` in pagina.
   Chi ne scrive una sola ottiene un'espressione regolare rotta, e il difetto
   non si vede qui: si vede come CENTOCINQUANTASEI scene che «hanno sbagliato
   strada», tutte con lo stesso messaggio, e zero angoli misurati. È già
   successo cinque volte, sempre con la stessa faccia. Questa riga lo
   trasforma in una riga sola, detta prima di aprire il browser. */
try { new Function('return ' + CONTROLLA); }
catch (e) {
  console.log('  KO  il codice da mandare in pagina non compila  → ' + e.message);
  console.log('      (dentro CONTROLLA le barre rovesce vanno doppie)');
  process.exit(1);
}

(async () => {
  const srv = http.createServer((q, r) => {
    let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
    fs.readFile(path.join(RADICE, p), (e, d) => {
      if (e) { r.statusCode = 404; r.end('x'); return; }
      r.setHeader('Content-Type', T[path.extname(p)] || 'application/octet-stream'); r.end(d);
    });
  });
  await new Promise(r => srv.listen(PORTA, r));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

  const CHIAVI = ['tondi', 'spariti', 'doppi', 'curveDiverse', 'filoVecchio', 'raggiRistretti',
    'corsie', 'mangiati', 'strozzati', 'pseudoRitagliati', 'fuoriPagina', 'ombreBordo'];
  const tot = {}; CHIAVI.forEach(k => { tot[k] = new Map(); });
  let ritagliati = 0, viste = 0;
  const rotte = new Map();
  const VIE = [[320, true, 'light'], [390, true, 'light'], [390, true, 'dark'], [1280, false, 'light'], [1280, false, 'dark']];
  for (const [largh, mob, tema] of VIE) {
    const ctx = await b.newContext({ viewport: { width: largh, height: 900 }, hasTouch: mob, isMobile: mob, colorScheme: tema });
    for (const { nome, via, tab, poi, prova } of SCENE) {
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
        /* la scena è arrivata dove doveva? Senza questa riga una scena che
           sbaglia strada mostra un'altra schermata e la prova la promuove. */
        if (prova) {
          const c = await p.evaluate((q) => document.querySelectorAll(q).length, prova);
          if (!c) throw new Error('la scena non è arrivata: manca «' + prova + '»');
        }
        /* PRIMA DI GUARDARE, LA PAGINA SI PORTA DAVANTI.
           Ogni scena è una scheda nuova, e le schede che stanno dietro il
           browser non le DISEGNA: `requestAnimationFrame` non arriva mai e i
           timer si diradano a uno al secondo. La forma si accoda al primo dei
           due, quindi in una scheda di sfondo può restare in coda per un
           secondo intero — e la prova, che aspettava un decimo, trovava dodici
           elementi «senza la curva» col loro attributo ancora VUOTO: non erano
           sbagliati, non erano ancora stati guardati. Capitava su una scena a
           caso, diversa a ogni giro, e solo sulla vista dove la prova fa anche
           il giro del fuoco — cioè quella che ci mette più tempo.
           Portarla davanti non è un trucco per far passare la prova: è
           misurare una pagina che il browser sta davvero disegnando, che è la
           sola condizione in cui la misura vuol dire qualcosa. */
        await p.bringToFront();
        /* SI ASPETTA CHE LA FORMA SI SIA FERMATA, e non un tempo fisso.
           `assets/forma.js` lavora a fotogrammi: una passata si accoda e si fa
           al primo fra il prossimo disegno e trentadue millisecondi. Misurando
           mentre una passata è ancora in coda si trovano elementi «senza la
           curva» che la curva ce l'hanno un decimo di secondo dopo — e infatti
           il loro attributo era ancora VUOTO: non erano sbagliati, non erano
           ancora stati guardati.
           Un'attesa a tempo non basta, e si è visto: due fotogrammi e centocinquanta
           millisecondi reggono benissimo su cinque scene e cedono su
           duecentosessanta, quando il browser ha aperto e chiuso cinquanta
           schede e il netturbino passa nel momento sbagliato. Il difetto
           usciva su UNA scena a caso, diversa a ogni giro: la faccia esatta di
           una prova che misura troppo presto.
           Quindi si aspetta un FATTO, non un orologio: che il numero di
           elementi già vestiti smetta di crescere. E si aspetta al massimo due
           secondi: se in due secondi non si è fermata, si misura lo stesso e
           quello che manca viene detto — un difetto vero non si nasconde
           dietro un'attesa più lunga. */
        await p.evaluate(() => new Promise((fine) => {
          var prima = -1, uguali = 0, scaduto = Date.now() + 2000;
          var guarda = function () {
            var ora = document.querySelectorAll('[data-forma]').length;
            uguali = (ora === prima) ? uguali + 1 : 0;
            prima = ora;
            if (uguali >= 2 || Date.now() > scaduto) { fine(); return; }
            setTimeout(guarda, 80);
          };
          setTimeout(guarda, 80);
        }));
        const r = await p.evaluate(CONTROLLA + '(' + (largh === 390 && tema === 'light') + ')');
        ritagliati += r.ritagliati; viste++;
        const dove = largh + 'px/' + tema + ' · ' + nome;
        CHIAVI.forEach((k) => r[k].forEach((x) => { if (!tot[k].has(x)) tot[k].set(x, dove); }));
      } catch (e) {
        rotte.set(nome + ' a ' + largh + 'px', String(e).split('\n')[0].replace(/^Error: /, '').slice(0, 80));
      } finally { await p.close(); }
    }
    await ctx.close();
    console.log('  ' + largh + 'px ' + tema + ': fatto');
  }
  console.log('\n' + viste + ' schermate guardate, ' + ritagliati + ' angoli ritagliati in totale\n');

  /* LA RETE CONTRO LA PROVA CHE NON PROVA NIENTE.
     Se il codice mandato in pagina si rompe, ogni scena finisce nel mucchio
     delle «rotte» e tutti gli altri elenchi restano VUOTI — cioè la prova
     stampa dodici righe verdi e una rossa, e le dodici verdi non vogliono
     dire niente. È già successo: `CONTROLLA` era una funzione già invocata e
     appendendole l'argomento si chiamava il suo risultato. Da qui in poi, zero
     angoli misurati è un fallimento a sé, detto per primo. */
  ok('le schermate sono state guardate davvero', viste >= SCENE.length && ritagliati > 500,
    viste + ' scene su ' + SCENE.length + ', ' + ritagliati + ' angoli — se sono zero, tutto il resto qui sotto è muto');

  /* si stampano TUTTI i casi, uno per riga: la prima volta che è girata
     questa prova ne ha trovati 70, e con l'elenco tagliato a sei si sarebbe
     lavorato tre volte sugli stessi e mai sugli altri */
  const mostra = (t, m) => {
    ok(t, m.size === 0, m.size ? m.size + ' casi:' : 'nessuno');
    [...m.entries()].forEach(([k, v]) => console.log('        ' + k + '   [' + v + ']'));
  };
  mostra('nessun angolo tondo è rimasto senza la curva', tot.tondi);
  mostra('nessun bordo è sparito', tot.spariti);
  mostra('nessun bordo è dipinto due volte', tot.doppi);
  mostra('il filo e il ritaglio dicono la stessa curva', tot.curveDiverse);
  mostra('nessun filo è disegnato su una misura vecchia', tot.filoVecchio);
  mostra('nessun raggio si è ristretto giro dopo giro', tot.raggiRistretti);
  mostra('le corsie dello sfondo sono al loro posto', tot.corsie);
  mostra('nessun ritaglio mangia quello che sporge', tot.mangiati);
  mostra('nessun angolo è più grande di quanto ci sta', tot.strozzati);
  mostra('nessuno pseudo-elemento porta un ritaglio', tot.pseudoRitagliati);
  mostra('niente esce dai lati della pagina', tot.fuoriPagina);
  mostra('nessun contorno è fatto con un’ombra dura', tot.ombreBordo);
  mostra('nessuna scena ha sbagliato strada', rotte);

  console.log(guai ? '\n>>> ' + guai + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(guai ? 1 : 0);
})();
