/* OGNI BORDO, IN OGNI SCHERMATA, A OGNI LARGHEZZA, IN TUTTI E DUE I TEMI.

   La forma degli angoli la misura prove/squircle.js. Questa prova guarda una
   cosa sola, e la guarda dappertutto: che il BORDO sia dove deve essere, di un
   colore solo, e dipinto una volta sola.

   Perché serve una prova a sé. La forma la fa un `clip-path`, che taglia anche
   il bordo del box: il bordo va ridisegnato come anello su uno pseudo-elemento.
   Sono tre pezzi che devono combaciare — il ritaglio, l'anello, e il colore che
   l'anello prende — e ogni volta che uno dei tre è mancato è venuto fuori un
   difetto diverso, tutti con lo stesso aspetto: «il bordo sembra tagliato».
   Li ha trovati l'occhio, uno per volta, su schermate diverse. Questa prova li
   cerca tutti insieme.

   LE NOVE COSE CHE CERCA
   1. angolo tondo senza ritaglio      → è rimasto un arco di cerchio
   2. bordo con lo spessore e nessuno che lo dipinge → bordo sparito
   3. bordo dipinto DUE volte           → fianchi scuri e angoli chiari
   4. anello che dipinge senza forma    → un rettangolo pieno di colore
   5. overflow che si mangia l'anello   → bordo sparito, e ne restano altri
   6. ritaglio che mangia quello che sporge → pezzi tagliati di netto
   7. angolo più grande di quanto ci sta  → forma strozzata
   8. anello sullo pseudo-elemento di qualcun altro → quel disegno esce a pezzi
   9. un blocco più largo della pagina → prima si vedeva «tagliato»

   node prove/bordi.js        (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const PORTA = 8825;
let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

/* LE SCENE stanno in segni/scene.json, una lista sola per tutti: le usa anche
   segni/misure.mjs, che da lì ricava le misure su cui il generatore taglia i
   raggi. Quando le due liste erano due, quella delle misure era rimasta a
   ventuno schermate e i pannelli che mancavano — «La scienza», «Backup»,
   «Come si usa» — sono esattamente quelli dove poi si sono trovate le
   pastiglie mai misurate, rimaste archi di cerchio. */
const SCENE = JSON.parse(fs.readFileSync(path.join(RADICE, 'segni/scene.json'), 'utf8'));

/* --- il controllo, dentro la pagina --- */
const CONTROLLA = `(function () {
  var nome = function (e) { return e.tagName.toLowerCase() +
    (e.className && e.className.toString ? '.' + e.className.toString().trim().split(/\\s+/).slice(0, 3).join('.') : ''); };
  var vuoto = function (c) { return !c || /^(transparent|rgba\\(0, 0, 0, 0\\))$/.test(c); };
  /* IL COLORE, NORMALIZZATO. La proprietà --sq-b è personalizzata: arriva come
     l'ha scritta il foglio di stile (#d5d5de, color-mix(...)), mentre lo
     pseudo-elemento lo dà già risolto (rgb(213, 213, 222)). Confrontare le due
     stringhe dava novantacinque falsi allarmi al primo giro. Si passa dal
     browser: lo stesso valore messo su una proprietà color esce normalizzato. */
  var provino = document.createElement('span');
  provino.style.position = 'fixed'; provino.style.left = '-9999px';
  document.body.appendChild(provino);
  var cache = {};
  var risolvi = function (v) {
    if (!v) return '';
    if (cache[v] !== undefined) return cache[v];
    provino.style.color = '';
    provino.style.color = v;
    cache[v] = getComputedStyle(provino).color;
    return cache[v];
  };
  var out = { ritagliati: 0, tondi: [], spariti: [], doppi: [], senzaForma: [], overflow: [], mangiati: [], strozzati: [], dueP: [], fuoriPagina: [] };
  document.querySelectorAll('body *').forEach(function (e) {
    var s = getComputedStyle(e), r = e.getBoundingClientRect();
    if (r.width < 4 || r.height < 4 || s.visibility === 'hidden' || s.display === 'none' || s.opacity === '0') return;
    var raggi = ['borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius']
      .map(function (k) { return parseFloat(s[k]) || 0; });
    var rmax = Math.max.apply(null, raggi);
    var clip = (s.clipPath && s.clipPath !== 'none') ? s.clipPath : null;
    var campo = /^(input|select|textarea|progress|meter)$/.test(e.tagName.toLowerCase());
    var bw = parseFloat(s.borderTopWidth) || 0;
    var sqb = (s.getPropertyValue('--sq-b') || '').trim();
    /* l'anello: uno pseudo-elemento col ritaglio a riempimento evenodd */
    var anello = null;
    ['::before', '::after'].forEach(function (ps) {
      var q = getComputedStyle(e, ps);
      if (/^polygon\\(evenodd/.test(q.clipPath || '')) {
        anello = q;
        /* 8. LO PSEUDO-ELEMENTO È DI DUE PADRONI. L'anello del bordo si
              disegna su ::before, e se quello pseudo-elemento serviva già a
              qualcos'altro (una barretta, un pallino, una freccia) le due
              regole finiscono sullo stesso elemento: l'anello gli mette
              addosso il proprio ritaglio e quel disegno esce a pezzi. È
              successo alla barretta dell'accento nella colonna di sinistra
              (.nav-item.attivo, il suo ::before) e non si vedeva perché allora il
              ritaglio portava via tutto quello che stava fuori dal riquadro.
              Se dipinge un colore che non è quello dell'anello, sopra quello
              pseudo-elemento non c'è solo l'anello. */
        if (!vuoto(q.backgroundColor) && risolvi(q.backgroundColor) !== risolvi(sqb))
          out.dueP.push(nome(e) + ps + ' dipinge ' + q.backgroundColor + ' e non ' + sqb);
      }
    });
    if (clip) out.ritagliati++;

    /* 9. QUALCOSA CHE ESCE DALLA PAGINA. Finché il ritaglio portava via tutto
          quello che stava fuori dal riquadro, un blocco troppo largo non si
          vedeva uscire: si vedeva TAGLIATO, e sembrava un difetto del bordo.
          Il calendario del mese era larghissimo per davvero — 1561 pixel in un
          riquadro da 955, perché repeat(7, 1fr) non fa scendere una colonna
          sotto il titolo più lungo che ha dentro — e le ultime due colonne
          stavano fuori dalla pagina. Adesso che il ritaglio non copre più
          niente, tanto vale cercarli tutti.
          Non conta chi ha un antenato che scorre (una fila di linguette che si
          trascina di lato è fatta per essere più larga). */
    if (r.right > innerWidth + 2 || r.left < -2) {
      var scorrevole = false, decoro = s.pointerEvents === 'none';
      for (var a = e.parentElement; a; a = a.parentElement) {
        var as = getComputedStyle(a);
        if (/auto|scroll|hidden|clip/.test(as.overflowX)) { scorrevole = true; break; }
        /* le macchie sfocate dello sfondo escono dallo schermo per mestiere: si
           riconoscono perché non si possono nemmeno toccare */
        if (as.pointerEvents === 'none') { decoro = true; break; }
      }
      if (!scorrevole && !decoro && s.position !== 'fixed')
        out.fuoriPagina.push(nome(e) + ' da ' + Math.round(r.left) + ' a ' +
          Math.round(r.right) + ' (pagina larga ' + innerWidth + ')');
    }

    /* 1. un angolo tondo senza ritaglio. I campi non possono averlo. */
    if (rmax >= 1 && !clip && !campo) out.tondi.push(nome(e) + ' r=' + Math.round(rmax));

    /* 2. il bordo c'è come spessore e nessuno lo dipinge */
    var loDipingeIlBox = bw > 0 && !vuoto(s.borderTopColor);
    var loDipingeAnello = anello && !vuoto(anello.backgroundColor);
    if (bw > 0 && !loDipingeIlBox && !loDipingeAnello && !vuoto(sqb))
      out.spariti.push(nome(e) + ' ' + bw + 'px, --sq-b=' + sqb.slice(0, 24));
    if (campo && bw > 0 && !loDipingeIlBox)
      out.spariti.push(nome(e) + ' CAMPO ' + bw + 'px col colore spento');

    /* 3. dipinto due volte: sui lati dritti viene doppio, sulla curva singolo */
    if (loDipingeIlBox && loDipingeAnello)
      out.doppi.push(nome(e) + ' box=' + s.borderTopColor + ' anello=' + anello.backgroundColor);

    /* 4. l'anello dipinge e la forma non c'è: è un rettangolo pieno */
    if (loDipingeAnello && !clip)
      out.senzaForma.push(nome(e) + ' dipinge ' + anello.backgroundColor + ' senza ritaglio');

    /* 5. overflow che si mangia l'anello: taglia al riquadro INTERNO, e
          l'anello con inset negativo sta fuori. Un overflow «clip» con un
          margine di ritaglio grande almeno quanto l'inset invece lo risparmia:
          è il modo giusto di tenere dentro i figli e fuori l'anello.
          (Con «hidden» il margine non ha nessun effetto: misurato.) */
    if (loDipingeAnello && !/^visible/.test(s.overflow)) {
      var ins = parseFloat(anello.top);
      var margine = /clip/.test(s.overflow) ? (parseFloat(s.overflowClipMargin) || 0) : 0;
      if (!isNaN(ins) && ins < -0.01 && margine < -ins - 0.01)
        out.overflow.push(nome(e) + ' overflow ' + s.overflow + ' (margine ' + margine +
          ') anello a ' + anello.top);
    }

    /* 6. il ritaglio mangia quello che sporge oltre il bordo esterno.
          Vale solo per un ritaglio che sta DENTRO il riquadro del bordo: quello
          a quattro morsi toglie soltanto le quattro zone d'angolo e lascia
          vivere tutto il resto, quindi non può mangiare niente che sporga —
          ed è per questo che la barretta dell'accento della colonna, che sta
          quattordici pixel FUORI dalla voce di menu, adesso si vede. */
    var dentroIlRiquadro = clip && !/-\\d\\d+(\\.\\d+)?px/.test(clip);
    if (dentroIlRiquadro && /^visible/.test(s.overflow) && /^visible/.test(s.overflowY)) {
      for (var i = 0; i < e.children.length; i++) {
        var c = e.children[i], cs = getComputedStyle(c);
        if (cs.position === 'fixed') continue;
        var q2 = c.getBoundingClientRect();
        if (q2.width < 1 || q2.height < 1) continue;
        var fuori = Math.max(r.left - q2.left, r.top - q2.top, q2.right - r.right, q2.bottom - r.bottom);
        if (fuori > 0.6) out.mangiati.push(nome(e) + ' ← ' + nome(c) + ' ' + Math.round(fuori) + 'px');
      }
      ['::before', '::after'].forEach(function (ps) {
        var q3 = getComputedStyle(e, ps);
        if (!q3.content || q3.content === 'none' || q3.content === 'normal') return;
        if (q3.position !== 'absolute' && q3.position !== 'fixed') return;
        var nn = function (k) { var v = parseFloat(q3[k]); return isNaN(v) ? 0 : v; };
        var lati = [nn('top'), nn('left'), nn('right'), nn('bottom')];
        if (Math.min.apply(null, lati) >= -bw - 0.01) return;
        if (/^polygon\\(/.test(q3.clipPath || '')) return;
        out.mangiati.push(nome(e) + ps + ' ' + q3.top + ' ' + q3.left);
      });
    }

    /* 7. l'angolo non ci sta: vuole 3.06 raggi di lato, se no si strozza */
    if (clip) {
      var m = clip.match(/min\\(([0-9.]+)px/);
      if (m) {
        var lung = +m[1];                       /* la lunghezza dell'angolo */
        var corto = Math.min(r.width, r.height);
        if (corto < 2 * lung - 0.6)
          out.strozzati.push(nome(e) + ' angolo ' + lung.toFixed(1) + 'px su un lato di ' + Math.round(corto));
      }
    }
  });
  return out;
})()`;

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

  const tot = { tondi: new Map(), spariti: new Map(), doppi: new Map(), senzaForma: new Map(),
    overflow: new Map(), mangiati: new Map(), strozzati: new Map(), dueP: new Map(), fuoriPagina: new Map() };
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
           sbaglia strada mostra un'altra schermata e la prova la promuove.
           È così che otto pannelli sono rimasti fuori dai controlli per un
           mese: la porta delle impostazioni si era spostata e il clic finiva
           nel vuoto. */
        if (prova) {
          const c = await p.evaluate((q) => document.querySelectorAll(q).length, prova);
          if (!c) throw new Error('la scena non è arrivata: manca «' + prova + '»');
        }
        const r = await p.evaluate(CONTROLLA);
        ritagliati += r.ritagliati; viste++;
        const dove = largh + 'px/' + tema + ' · ' + nome;
        Object.keys(tot).forEach((k) => r[k].forEach((x) => { if (!tot[k].has(x)) tot[k].set(x, dove); }));
      } catch (e) {
        rotte.set(nome + ' a ' + largh + 'px', String(e).split('\n')[0].replace(/^Error: /, '').slice(0, 80));
      } finally { await p.close(); }
    }
    await ctx.close();
    console.log('  ' + largh + 'px ' + tema + ': fatto');
  }
  console.log('\n' + viste + ' schermate guardate, ' + ritagliati + ' angoli ritagliati in totale\n');

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
  mostra('nessun anello dipinge senza la forma', tot.senzaForma);
  mostra('nessun overflow si mangia l’anello', tot.overflow);
  mostra('il ritaglio non mangia niente che sporge', tot.mangiati);
  mostra('nessun angolo è più grande di quanto ci sta', tot.strozzati);
  mostra('nessuno pseudo-elemento serve a due cose insieme', tot.dueP);
  mostra('niente esce dai lati della pagina', tot.fuoriPagina);
  mostra('nessuna scena ha sbagliato strada', rotte);

  console.log(guai ? '\n>>> ' + guai + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(guai ? 1 : 0);
})();
