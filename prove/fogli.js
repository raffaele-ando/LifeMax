/* LE DUE GEMELLE, PER I PANNELLI — il foglio di React è identico a quello di prima?

   Stessa idea di `prove/gemelle.js`, spostata di un piano: là si confronta
   quello che sta dentro a #vista, qui quello che sta dentro a #sheet-corpo.
   Un pannello però non si vede andandoci: bisogna aprirlo, e ogni pannello si
   apre da un posto suo. Quel «da dove» sta scritto qui sotto, una riga per
   pannello, ed è l'unica parte che cresce quando se ne converte uno nuovo.

   Cosa confronta, in ordine di quanto conta:
     1. l'albero: quali tag, annidati come, in che ordine
     2. le classi di ogni elemento
     3. il testo che si legge
     4. gli id e i data- da cui dipendono i comandi
     5. il titolo scritto in cima al foglio

   node prove/fogli.js           tutti i pannelli convertiti
   node prove/fogli.js filtri    uno solo                                   */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..'), PORTA = 8801;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

/* DA DOVE SI APRE OGNI PANNELLO.
   `vai` è la schermata, `tab` la linguetta (indice nella fila dei segmenti),
   `apri` il gesto che lo fa comparire. Il nome è quello con cui il pannello
   è registrato nell'isola: se ne manca uno qui, la prova lo dice invece di
   saltarlo in silenzio — un pannello convertito e non guardato sarebbe la
   stessa cosa che non averlo convertito. */
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
  /* con zero copie il pannello è tre righe di testo: si mettono giù due
     copie prima, se no la parte che conta — l'elenco — non la guarda nessuno */
  backup: { titolo: 'Backup e ripristino', vai: 'plancia',
    /* UNA COPIA SOLA, E LA STESSA NEI DUE GIRI. `prima` gira due volte e i
       backup restano nel deposito: senza svuotarlo, il secondo giro ne trova
       uno in più del primo e il confronto trova una differenza che è la prova
       stessa ad aver creato. L'orologio è fermo, quindi l'ora della copia è
       identica di qua e di là. */
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
  /* il registro tecnico si apre dalla pastiglia del salvataggio, dentro alle
     impostazioni: chi legge «Salvataggio…» vuole sapere subito perché */
  /* del registro si confronta tutto tranne le righe che ci scorrono dentro:
     dicono cos'è successo in questo giro, e i due giri sono due giri diversi.
     Anche la testa dice a che punto sta il salvataggio adesso. */
  diagnostica: { titolo: 'Registro tecnico', senza: '#diag-console, .diag-stato', vai: 'plancia', apri: async (p) => {
    await p.evaluate(() => { const b = document.getElementById('fondo-impostazioni') || document.querySelector('[data-imp]'); if (b) b.click(); });
    await p.waitForTimeout(650);
    /* IL REGISTRO SI SVUOTA UN ATTIMO PRIMA. Le righe si accumulano per tutta
       la prova, e il secondo giro ne ha più del primo: il numero scritto sulla
       linguetta «Solo problemi (N)» sarebbe diverso di qua e di là per un
       motivo che non c'entra niente col pannello. */
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

/* L'IMPRONTA DI UN ALBERO — la stessa di prove/gemelle.js, con la radice che
   cambia. Le regole su cosa si guarda e cosa no stanno spiegate là. */
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
    var TRANSITORIE = /^(anim-a|anim-b|anim|vista-enter|sez-enter(-dx|-sx)?|sheet-entra)$/;
    var cl = (e.getAttribute('class') || '').trim().split(/\\s+/)
      .filter(function (c) { return c && !TRANSITORIE.test(c); })
      .sort().join('.');
    var dati = [];
    for (var i = 0; i < e.attributes.length; i++) {
      var a = e.attributes[i];
      /* NIENTE APICI ROVESCI QUI DENTRO: questo pezzo vive dentro a un
         template literal, e un apice rovescio lo chiude. */
      if (a.name.indexOf('data-') === 0 && a.name.indexOf('data-forma') !== 0) dati.push(a.name + '=' + a.value);
    }
    /* il valore di un campo non sta negli attributi: due pannelli con lo
       stesso markup e dentro due valori diversi non sono lo stesso pannello */
    var val = (tag === 'input' || tag === 'select' || tag === 'textarea')
      ? ((e.type === 'checkbox' || e.type === 'radio') ? (e.checked ? '1' : '0') : (e.value || '')) : '';
    out.push(liv + '|' + tag + '|' + cl + '|' + (e.id || '') + '|' + dati.sort().join(',') + '|' + testoProprio(e) + '|' + val);
    if (tag === 'svg') return;
    /* QUELLO CHE NON PUÒ ESSERE UGUALE, e non è un difetto.
       Il registro tecnico mostra il registro di QUESTO giro: i due giri sono
       due giri diversi (in uno l'isola di React si carica, nell'altro no), e
       le righe che scrivono non sono le stesse né lo possono essere. Del
       riquadro si confronta l'involucro, non quello che ci scorre dentro. */
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
  const dentro = testo.slice(testo.indexOf('const APERTURE = {'), testo.indexOf('/* L’IMPRONTA DI UN ALBERO'));
  const nomi = [...dentro.matchAll(/^  '?([a-z-]+)'?:\s*[[{]/gm)].map((m) => m[1]);
  const doppi = nomi.filter((n, i) => nomi.indexOf(n) !== i);
  if (doppi.length) {
    console.log('  KO  ogni pannello ha una ricetta sola  → ' + [...new Set(doppi)].join(', '));
    guai++;
  }
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
  /* stessa ora e stessi dati nei due giri */
  await p.addInitScript((t) => {
    const D = Date;
    class F extends D { constructor(...a) { if (!a.length) super(t); else super(...a); } static now() { return t; } }
    window.Date = F;
  }, new Date('2026-08-18T10:30:00').getTime());

  await p.goto('http://localhost:' + PORTA + '/index.html'); await p.waitForTimeout(300);
  await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  await p.evaluate(() => { const s = LM.load(); s.profilo.react = true; LM.save(); });
  await p.reload(); await p.waitForTimeout(1200);

  const quali = process.argv[2]
    ? [process.argv[2]]
    : await p.evaluate(() => (window.LM_REACT && window.LM_REACT.fogli) || []);

  if (!quali.length) {
    console.log('  --  nessun pannello convertito: niente da confrontare');
    console.log('\n>>> PROVA SALTATA');
    await b.close(); srv.close(); process.exit(0);
  }

  /* si aspetta che le animazioni finiscano: il foglio entra scorrendo, e
     fotografato a metà entrata non è ancora quello che sarà */
  const ferme = async () => {
    for (let i = 0; i < 30; i++) {
      const quante = await p.evaluate(() =>
        document.getAnimations().filter((a) => a.playState === 'running' && a.effect &&
          (a.effect.getTiming().iterations || 1) !== Infinity).length);
      if (!quante) break;
      await p.waitForTimeout(100);
    }
    let prima = null;
    for (let i = 0; i < 25; i++) {
      const ora = await p.evaluate(() => {
        const e = document.getElementById('sheet-corpo');
        return e ? e.textContent : '';
      });
      if (ora === prima) break;
      prima = ora;
      await p.waitForTimeout(120);
    }
  };

  const disegna = async (r, react) => {
    await p.evaluate((x) => { const s = LM.load(); s.profilo.react = x; LM.save(); }, react);
    /* qualche pannello ha bisogno che l'app sia in un certo stato per
       esistere: `prima` lo mette lì, e vale per tutt'e due i giri */
    if (r.prima) await r.prima(p);
    await p.evaluate((v) => { location.hash = '#/' + v; }, r.vai);
    await p.reload(); await p.waitForTimeout(react ? 1400 : 900);
    if (r.tab != null) {
      await p.evaluate((i) => { const t = document.querySelectorAll('#vista .segmenti button')[i]; if (t) t.click(); }, r.tab);
      await p.waitForTimeout(600);
    }
    await r.apri(p);
    await p.waitForTimeout(700);
    await ferme();
    const aperto = await p.evaluate(() => { const s = document.getElementById('sheet-overlay'); return !!s && !s.hidden; });
    return { aperto, titolo: await p.evaluate(TITOLO), albero: await p.evaluate(impronta('sheet-corpo', r.senza)) };
  };

  for (const nome of quali) {
    if (!APERTURE[nome]) {
      console.log('\nPANNELLO «' + nome + '»');
      ok('si sa da dove si apre', false, 'manca la riga in APERTURE: convertito ma mai guardato');
      continue;
    }
    /* un pannello può avere più di un modo di essere: la scheda di un'attività
       divisa in passi non è la stessa della scheda di un'attività semplice */
    for (const r of [].concat(APERTURE[nome])) {
    console.log('\nPANNELLO «' + nome + (r.come ? ' · ' + r.come : '') + '»');
    const vecchio = await disegna(r, false);
    const nuovo = await disegna(r, true);

    ok('il pannello si apre di qua e di là', vecchio.aperto && nuovo.aperto,
      (vecchio.aperto ? '' : 'non si è aperto col codice di prima') + (nuovo.aperto ? '' : ' non si è aperto con React'));
    if (!vecchio.aperto || !nuovo.aperto) continue;

    ok('il titolo è lo stesso', vecchio.titolo === nuovo.titolo,
      '«' + vecchio.titolo + '» prima, «' + nuovo.titolo + '» dopo');
    /* ED È QUELLO GIUSTO. Una ricetta che sbaglia bersaglio apre un altro
       pannello, e il confronto lo trova identico a se stesso: verde, e non ha
       guardato niente. È successo col registro tecnico, dove il tasto da
       premere esiste solo se hai fatto l'accesso — la prova restava sulle
       impostazioni e diceva che andava tutto bene. */
    if (r.titolo) ok('ed è il pannello che ci si aspettava', vecchio.titolo === r.titolo,
      vecchio.titolo === r.titolo ? '' : 'la ricetta ha aperto «' + vecchio.titolo + '», non «' + r.titolo + '»');
    ok('l’albero ha lo stesso numero di elementi', vecchio.albero.length === nuovo.albero.length,
      vecchio.albero.length + ' prima, ' + nuovo.albero.length + ' dopo');

    const quante = Math.min(vecchio.albero.length, nuovo.albero.length);
    const diverse = [];
    for (let i = 0; i < quante; i++) if (vecchio.albero[i] !== nuovo.albero[i]) diverse.push(i);
    ok('e ogni elemento combacia', diverse.length === 0,
      diverse.length ? diverse.length + ' righe diverse' : 'tutte uguali');
    if (diverse.length) {
      console.log('      le prime tre differenze, prima → dopo:');
      diverse.slice(0, 3).forEach((i) => {
        console.log('        prima: ' + vecchio.albero[i]);
        console.log('        dopo:  ' + nuovo.albero[i]);
      });
      if (vecchio.albero.length !== nuovo.albero.length) {
        const piu = vecchio.albero.length > nuovo.albero.length ? vecchio.albero : nuovo.albero;
        console.log('      e ' + (piu === vecchio.albero ? 'di là' : 'di qua') + ' ce ne sono altre, la prima è:');
        console.log('        ' + piu[quante]);
      }
    }
    }
  }
  ok('nessun errore in pagina', err.length === 0, [...new Set(err)].slice(0, 2).join(' · '));

  await b.close(); srv.close();
  console.log(guai ? '\n>>> ' + guai + (guai === 1 ? ' PROBLEMA' : ' PROBLEMI') : '\n>>> TUTTO A POSTO');
  process.exit(guai ? 1 : 0);
})();
