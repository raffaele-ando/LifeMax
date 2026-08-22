/* Due comandi che fanno la stessa cosa, nella stessa schermata.
   Non guarda i nomi né le classi: clicca. Per ogni comando visibile parte da
   uno stato identico, lo preme, e registra COSA LASCIA — dove sei finito,
   com'è cambiato il salvataggio, che pannello si è aperto, che messaggio è
   comparso. Due comandi che lasciano lo stesso stato esatto sono due modi per
   la stessa cosa; N righe di un elenco toccano cose diverse e quindi lasciano
   salvataggi diversi, e non si confondono con i doppioni.

   Nasce da una domanda: «verifica se nella stessa schermata non ci sono
   elementi che fanno le stesse cose». La risposta va tenuta, non trovata una
   volta: ogni scheda nuova può riportare due tasti per un gesto.

   node prove/doppioni.js        (CHROMIUM=/percorso/di/chrome se serve)
   Ci mette qualche minuto: apre una pagina pulita per ogni comando. Dei
   comandi identici per costruzione (le righe di un elenco, l'«Annulla» su
   ogni riga del diario) ne prova sei per tipo e stampa quanti ne lascia
   fuori.                                                                   */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
const PORTA = 8749;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };

/* lo stato in cui ti trovi, ridotto a una stringa confrontabile: via gli id e
   i tempi, che cambiano a ogni giro senza voler dire niente */
const IMPRONTA = () => {
  const pulisci = o => {
    if (Array.isArray(o)) return o.map(pulisci);
    if (o && typeof o === 'object') {
      const r = {};
      Object.keys(o).sort().forEach(k => { if (/^(ts|creata|modificata|fine|inizio)$/.test(k)) return; r[k] = pulisci(o[k]); });
      return r;
    }
    return o;
  };
  const s = JSON.parse(JSON.stringify(LM.load()));
  delete s.log; delete s.registro; delete s.xpStorico;
  const ov = document.querySelector('.sheet-overlay:not([hidden]), .overlay:not([hidden]), .avviso-ovl:not([hidden])');
  /* Conta anche COSA VEDI, non solo cosa è salvato: un filtro cambia l'elenco
     davanti a te e non tocca il salvataggio, quindi otto filtri diversi
     sembravano otto modi per la stessa cosa. Il testo della schermata ridotto
     a un numero: due schermate identiche danno lo stesso numero, due diverse
     no. */
  /* textContent non legge il valore dei campi: nell'editor dei pasti tre
     righe con nomi diversi hanno gli stessi testi, e tre «Rimuovi» che
     togliévano tre pasti diversi sembravano tre modi per la stessa cosa. */
  const testo = el => {
    if (!el) return '';
    const campi = [...el.querySelectorAll('input, select, textarea')]
      .map(e => (e.type === 'checkbox' || e.type === 'radio') ? (e.checked ? '1' : '0') : (e.value || '')).join('\u0001');
    return (el.textContent || '').replace(/\s+/g, ' ').trim() + '\u0002' + campi;
  };
  const impronta = t => { let n = 0; for (let i = 0; i < t.length; i++) { n = (n * 31 + t.charCodeAt(i)) | 0; } return n; };
  const h = impronta(testo(document.getElementById('vista')));
  const hc = impronta(testo(document.getElementById('sheet-corpo')));
  return {
    hash: location.hash,
    stato: JSON.stringify(pulisci(s)),
    aperto: !!ov,
    schermo: h + '/' + hc,
    /* il titolo di una scheda è spesso una casella di testo: senza leggere il
       value, nove righe che aprono nove attività diverse sembrerebbero nove
       modi per la stessa cosa */
    titolo: ov ? ((document.querySelector('#sheet-titolo textarea, #sheet-titolo input') || {}).value
      || (document.getElementById('sheet-titolo') || {}).textContent
      || ov.id || '').toString().trim().slice(0, 60) : '',
    toast: [...document.querySelectorAll('.toast')].map(t => t.textContent.replace(/\s+/g, ' ').trim()).join(' | '),
    vista: (document.querySelector('#vista .topbar h1') || {}).textContent || ''
  };
};

/* i comandi della schermata davanti: se c'è un pannello aperto sono i suoi */
const RAGGIO = `(function () {
  return document.querySelector('.sheet-overlay:not([hidden]) .sheet-corpo, .overlay:not([hidden]) .pannello-cattura')
    || document.getElementById('vista');
})()`;
/* Al massimo sei per famiglia. Da quando il diario ha un «Annulla» su ogni
   riga, una schermata sola porta centotrenta comandi identici per
   costruzione, e provarli uno per uno (pagina pulita ciascuno) vuol dire
   mezz'ora per una scheda sola. Sei bastano: quello che questa prova cerca
   sono due comandi DIVERSI con lo stesso esito, e centotrenta copie dello
   stesso non aggiungono niente dopo le prime.
   Famiglia = stesso tag, stesse classi, stesso testo, stesso nome
   accessibile. Il testo ci sta dentro di proposito: «btn btn-mini» è una
   classe di stile, e senza leggere il testo «Importa da file», «Carica dati
   di esempio» e «Azzera tutto» sarebbero la stessa famiglia — tre comandi
   diversi buttati fuori dalla prova.
   Quanti se ne lasciano fuori lo dice la riga stampata sotto: un taglio muto
   si leggerebbe come «provato tutto». */
const TETTO = 6;
const FIRMA = `(e => e.tagName + '.' + [...e.classList].sort().join('.')
  + '\u0001' + (e.getAttribute('aria-label') || '')
  + '\u0001' + (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40))`;
const GREZZA = `(function () {
  const r = ${RAGGIO};
  if (!r) return [];
  const l = [...r.querySelectorAll('button, a[href], [role=button]')];
  const sc = document.querySelector('.sheet-overlay:not([hidden]) .sheet');
  if (sc) sc.querySelectorAll(':scope > button, :scope > .sheet-testa button').forEach(e => l.unshift(e));
  return l.filter(e => { const b = e.getBoundingClientRect(); return b.width > 2 && b.height > 2 && !e.closest('.lab-demo'); });
})()`;
const LISTA = `(function () {
  const l = ${GREZZA}; const conta = {}; const tenuti = []; const firmaDi = ${FIRMA};
  for (const e of l) {
    const firma = firmaDi(e);
    conta[firma] = (conta[firma] || 0) + 1;
    if (conta[firma] <= ${TETTO}) tenuti.push(e);
  }
  return tenuti;
})()`;
const SCARTATI = `(function () {
  const l = ${GREZZA}; const conta = {}; const fuori = {}; const firmaDi = ${FIRMA};
  for (const e of l) {
    const firma = firmaDi(e);
    conta[firma] = (conta[firma] || 0) + 1;
    if (conta[firma] > ${TETTO}) fuori[firma] = (fuori[firma] || 0) + 1;
  }
  return Object.keys(fuori).map(k => fuori[k] + '×' + k.split('\u0001')[0]
    + (k.split('\u0001')[2] ? ' «' + k.split('\u0001')[2] + '»' : ''));
})()`;

const SCENE = [
  { nome: 'Oggi', vai: 'oggi' },
  { nome: 'Oggi (con le altre aperte)', vai: 'oggi', poi: p => p.evaluate(() => { const b = document.getElementById('btn-altre'); if (b) b.click(); }) },
  { nome: 'La giornata', vai: 'giornata' },
  { nome: 'Attività · da sistemare', vai: 'inbox', tab: 0 },
  { nome: 'Attività · da fare', vai: 'inbox', tab: 1 },
  { nome: 'Attività · abitudini', vai: 'inbox', tab: 2 },
  { nome: 'Rituali', vai: 'rituali' },
  { nome: 'Andamento · riepilogo', vai: 'plancia', tab: 0 },
  { nome: 'Andamento · diario', vai: 'plancia', tab: 1 },
  { nome: 'Andamento · aree', vai: 'plancia', tab: 2 },
  { nome: 'Andamento · andamento', vai: 'plancia', tab: 3 },
  { nome: 'Esperimenti', vai: 'esperimenti' },
  { nome: 'Scheda di un’attività', vai: 'inbox', tab: 1, poi: async p => {
      await p.evaluate(() => { const r = document.querySelector('[data-bkapri]'); if (r) r.click(); }); } },
  { nome: 'Scheda di un’abitudine', vai: 'inbox', tab: 2, poi: async p => {
      await p.evaluate(() => { const r = document.querySelector('[data-abdett]'); if (r) r.click(); }); } },
  { nome: 'Filtri delle attività', vai: 'inbox', tab: 1, poi: async p => {
      await p.evaluate(() => { const b = document.querySelector('.att-filtro'); if (b) b.click(); }); } },
  { nome: 'Cattura rapida', vai: 'oggi', poi: async p => {
      await p.evaluate(() => { const b = document.querySelector('.tabbar [data-catt]'); if (b) b.click(); }); } },
  { nome: 'Impostazioni', vai: 'plancia', poi: async p => {
      await p.evaluate(() => { const b = [...document.querySelectorAll('#vista button')].find(x => /Impostazioni/.test(x.textContent)); if (b) b.click(); }); } },
  { nome: 'Sonno e pasti', vai: 'plancia', poi: async p => {
      await p.evaluate(() => { const b = [...document.querySelectorAll('#vista button')].find(x => /Impostazioni/.test(x.textContent)); if (b) b.click(); });
      await p.waitForTimeout(650);
      await p.evaluate(() => { const b = document.getElementById('imp-ritmo'); if (b) b.click(); }); } },
  { nome: 'Gestisci le aree', vai: 'plancia', poi: async p => {
      await p.evaluate(() => { const b = [...document.querySelectorAll('#vista button')].find(x => /Impostazioni/.test(x.textContent)); if (b) b.click(); });
      await p.waitForTimeout(650);
      await p.evaluate(() => { const b = document.getElementById('imp-aree'); if (b) b.click(); }); } }
];

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
  const err = [];

  const scena = async (s) => {
    const p = await b.newPage({ viewport: { width: 390, height: 900 }, hasTouch: true, isMobile: true });
    p.on('pageerror', e => err.push(s.nome + ': ' + e));
    /* orologio fermo: senza questo la stessa schermata cambia sotto i piedi */
    await p.addInitScript(t => {
      const D = Date;
      class F extends D { constructor(...a) { if (!a.length) super(t); else super(...a); } static now() { return t; } }
      window.Date = F;
    }, new Date('2026-08-18T10:30:00').getTime());
    await p.goto('http://localhost:' + PORTA + '/index.html'); await p.waitForTimeout(350);
    await p.evaluate(() => {
      localStorage.clear(); LM.seedDemo();
      ['Rispondere alla mail del prof', 'Prep pasti per domani', 'Chiamare la banca']
        .forEach(t => LM.aggiungiAzione(t, 'altro', {}));
    });
    await p.evaluate(v => { location.hash = '#/' + v; }, s.vai);
    await p.reload(); await p.waitForTimeout(750);
    if (s.tab != null) {
      await p.evaluate(i => { const t = document.querySelectorAll('#vista .segmenti button')[i]; if (t) t.click(); }, s.tab);
      await p.waitForTimeout(500);
    }
    if (s.poi) { await s.poi(p); await p.waitForTimeout(700); }
    return p;
  };

  const trovati = [];
  for (const s of SCENE) {
    const p0 = await scena(s);
    const quanti = await p0.evaluate(`${LISTA}.length`);
    const fuori = await p0.evaluate(SCARTATI);
    await p0.close();
    if (fuori.length) console.log('  ' + s.nome + ': oltre il tetto di ' + TETTO + ', non provati → ' + fuori.join(', '));
    if (!quanti) { console.log('  ' + s.nome + ': niente da provare'); continue; }
    const effetti = [];
    for (let i = 0; i < quanti; i++) {
      const p = await scena(s);
      const prima = await p.evaluate(IMPRONTA);
      const eti = await p.evaluate(`(function () { const l = ${LISTA}; const e = l[${i}];
        if (!e) return null;
        /* «era già scelto?»: la voce attiva di un gruppo a scelta singola non
           fa niente quando la ritocchi, ed è giusto così — non è un doppione
           della maniglia che chiude, è il posto in cui sei già. */
        const scelto = e.classList.contains('attivo') || e.classList.contains('sel')
          || e.getAttribute('aria-pressed') === 'true' || !!e.getAttribute('aria-current')
          || !!e.querySelector('.lista-vuoto svg, .lista-azione.piena');
        /* e la via d'uscita: chiudere è chiudere, non è un doppione di una
           voce che, essendo già scelta, non fa altro che chiudere */
        const chiude = e.classList.contains('sheet-maniglia') || e.classList.contains('sheet-chiudi')
          || e.classList.contains('cattura-chiudi');
        return { t: (e.textContent || e.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim().slice(0, 44),
          cls: (e.className || '').toString().split(' ').slice(0, 2).join('.'),
          scelto: scelto, chiude: chiude }; })()`);
      const ok = await p.evaluate(`(function () { const l = ${LISTA}; if (!l[${i}]) return false; l[${i}].click(); return true; })()`);
      await p.waitForTimeout(650);
      const dopo = ok ? await p.evaluate(IMPRONTA) : null;
      await p.close();
      if (!dopo || !eti) continue;
      effetti.push({ ...eti, eff: JSON.stringify({
        hash: dopo.hash !== prima.hash ? dopo.hash : '',
        stato: dopo.stato !== prima.stato ? dopo.stato : '',
        chiuso: prima.aperto && !dopo.aperto,
        titolo: dopo.titolo !== prima.titolo ? dopo.titolo : '',
        schermo: dopo.schermo !== prima.schermo ? dopo.schermo : '',
        toast: dopo.toast, vista: dopo.vista }) });
    }
    const m = new Map();
    effetti.forEach(x => { if (!m.has(x.eff)) m.set(x.eff, []); m.get(x.eff).push(x); });
    [...m.entries()].filter(([, v]) => v.length > 1).forEach(([k, v]) => {
      const o = JSON.parse(k);
      /* un gruppo che non cambia niente, non naviga, non apre e non dice
         niente è il gruppo che questa prova NON riesce a vedere (le linguette
         che spostano una variabile, il timer, la scelta del fuoco): è un buco
         della misura, non un doppione */
      const cieco = !o.hash && !o.stato && !o.chiuso && !o.titolo && !o.toast && !o.schermo;
      /* Un gruppo dove ognuno è o la scelta già attiva o la via d'uscita non
         è un gruppo di doppioni: ritoccare l'opzione accesa non deve fare
         niente, e chiudere è chiudere. Perché sia un doppione ci vuole almeno
         un comando che PROMETTE di fare qualcos'altro. */
      const tuttiGiaScelti = v.every(x => x.scelto || x.chiude);
      trovati.push({ scena: s.nome, cieco: cieco || tuttiGiaScelti,
        cosa: (o.chiuso ? 'chiudono il pannello ' : '') + (o.hash ? 'portano a ' + o.hash + ' ' : '') +
          (o.titolo ? 'aprono «' + o.titolo + '» ' : '') + (o.toast ? 'dicono «' + o.toast + '» ' : '') +
          (o.schermo ? 'e lasciano la stessa schermata ' : '') +
          (o.stato ? 'e salvano lo stesso stato' : ''),
        chi: v.map(x => '«' + x.t + '» [' + x.cls + ']') });
    });
    console.log('  ' + s.nome + ': ' + effetti.length + ' comandi provati');
  }

  /* Nessun doppione tenuto di proposito. Ce n'era uno — in Oggi la pastiglia
     che annunciava il rituale di adesso portava dove porta la linguetta
     «Rituali» — e alla fine è caduto anche quello: il segnale è passato su
     una pastiglia numerata sulla linguetta, cioè dove sta la destinazione. */
  const AMMESSI = [];
  const ammesso = t => AMMESSI.some(a => a.scena === t.scena && a.chi.length === t.chi.length &&
    a.chi.every(c => t.chi.includes(c)));

  const veri = trovati.filter(t => !t.cieco && !ammesso(t));
  const noti = trovati.filter(t => !t.cieco && ammesso(t));
  const ciechi = trovati.filter(t => t.cieco);

  console.log('\n=== DUE COMANDI, LO STESSO ESITO, NELLA STESSA SCHERMATA ===');
  if (!veri.length) console.log('  nessuno');
  veri.forEach(t => { console.log('\n  [' + t.scena + ']  ' + t.chi.length + ' comandi ' + t.cosa); t.chi.forEach(c => console.log('     ' + c)); });
  if (noti.length) {
    console.log('\n--- doppioni tenuti di proposito ---');
    noti.forEach(t => console.log('  [' + t.scena + ']  ' + t.chi.join('  ')));
  }
  if (ciechi.length) {
    console.log('\n--- fuori portata, o voci già scelte (ritoccarle non deve fare niente) ---');
    ciechi.forEach(t => console.log('  [' + t.scena + ']  ' + t.chi.join('  ')));
  }
  if (err.length) console.log('\nERRORI JS: ' + [...new Set(err)].slice(0, 5).join(' | '));
  console.log(veri.length || err.length ? '\n>>> ' + (veri.length + err.length) + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  await b.close(); srv.close();
  process.exit(veri.length || err.length ? 1 : 0);
})();
