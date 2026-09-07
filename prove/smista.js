/* SMISTARE UNA CODA — nota per nota, fino a svuotarla.

   Questa prova nasce da un difetto trovato da chi usa l'app, e nessuna delle
   altre lo poteva vedere: guardano UNO SCHERMO, disegnato una volta. Qui
   invece conta la SEQUENZA. Smisti una nota, la coda avanza, e la domanda è
   se quello che vedi adesso è la nota di adesso.

   Cos'era andato storto. In React la casella del testo aveva `defaultValue`
   senza `key`: quel valore si applica solo al montaggio, e la coda che avanza
   riusa il nodo che sta nella stessa posizione. Dentro restava il testo della
   nota precedente. Poi il tasto «Oggi» legge il campo, lo trova diverso dal
   testo della nota, e lo salva: la nota nuova veniva RIBATTEZZATA col nome di
   quella appena smistata. Una coda di otto note diventava otto copie della
   prima, e i testi originali non tornavano più.

   Il codice di prima non ce l'aveva, perché rifà tutto `#vista` a ogni giro.
   Quindi la prova gira DI QUA E DI LÀ: è il modo di dire «React deve fare
   quello che faceva prima» anche quando ci sono di mezzo cinque gesti.

   node prove/smista.js                                                    */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const RADICE = require('./dove').SERVITO, PORTA = 8803;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

const NOTE = ['Prima nota da sistemare', 'Seconda, tutta diversa', 'Terza e distinta',
  'Quarta con un testo suo', 'Quinta e ultima'];

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

  for (const react of [false, true]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    const err = []; p.on('pageerror', (e) => err.push('' + e));
    await p.goto('http://localhost:' + PORTA + '/index.html'); await p.waitForTimeout(400);
    await p.evaluate((o) => {
      localStorage.clear();
      LM.seedDemo();
      const s = LM.load();
      s.onboarded = true; s.profilo.react = o.react;
      s.inbox = [];
      LM.save();
      /* cinque note con cinque testi diversi, e nessun testo che assomigli a
         un altro: se due si confondessero non si capirebbe quale è comparsa */
      o.note.forEach((t) => LM.cattura(t));
    }, { react: react, note: NOTE });
    await p.evaluate(() => { location.hash = '#/inbox'; });
    await p.reload(); await p.waitForTimeout(react ? 1500 : 900);
    /* la linguetta «Da sistemare» è la prima quando c'è una coda */
    await p.evaluate(() => {
      const t = document.querySelector('#vista [data-att="sistemare"]');
      if (t) t.click();
    });
    await p.waitForTimeout(700);

    console.log('\n' + (react ? 'CON REACT' : 'COL CODICE DI PRIMA'));

    /* La coda si svuota una nota per volta. A ogni giro tre domande:
         · quello che c'è scritto nel campo è il testo della nota di adesso?
         · e l'area proposta è la sua?
         · dopo aver smistato, i dati dicono ancora la verità? */
    let visti = [];
    let storte = 0;
    for (let giro = 0; giro < NOTE.length; giro++) {
      const stato = await p.evaluate(() => {
        const campo = document.getElementById('sm-testo');
        if (!campo) return null;
        const coda = LM.load().inbox.slice().sort((a, b) => (b.creata || 0) - (a.creata || 0));
        return {
          nelCampo: campo.value,
          nelDato: coda[0] ? coda[0].testo : null,
          quante: coda.length
        };
      });
      if (!stato) { ok('la coda si vede al giro ' + (giro + 1), false, 'niente campo #sm-testo'); break; }
      visti.push(stato.nelCampo);
      ok('giro ' + (giro + 1) + ': nel campo c’è la nota di adesso',
        stato.nelCampo === stato.nelDato,
        stato.nelCampo === stato.nelDato ? stato.quante + ' in coda' : 'campo «' + stato.nelCampo + '» · dato «' + stato.nelDato + '»');

      /* SI SMISTA IN «OGGI», e il danno vero si misura qui.
         Non è «si vede male»: è che il tasto legge il campo e SALVA quello che
         ci trova. La nota che esce dalla coda si porta dietro il testo
         sbagliato, e finisce in Oggi con il nome di un'altra. Quindi si guarda
         cosa DICEVANO I DATI un attimo prima, e si pretende di ritrovare
         quello — non quello che c'era scritto nella casella. */
      const suo = stato.nelDato;
      await p.evaluate(() => {
        const b2 = document.querySelector('[data-fai="azione"]');
        if (b2) b2.click();
      });
      await p.waitForTimeout(700);
      const r = await p.evaluate((testo) => {
        const s2 = LM.load();
        return {
          arrivata: s2.azioni.some((a) => a.testo === testo),
          restaInCoda: s2.inbox.some((x) => x.testo === testo)
        };
      }, suo);
      if (!r.arrivata) {
        storte++;
        ok('giro ' + (giro + 1) + ': la nota smistata arriva in Oggi col SUO testo', false,
          'ci si aspettava «' + suo + '», e in Oggi non c’è');
      }
    }

    ok('le cinque note si sono viste tutte e cinque, una per una',
      new Set(visti).size === NOTE.length && NOTE.every((t) => visti.indexOf(t) >= 0),
      visti.map((x) => '«' + x + '»').join(' · '));
    ok('e ognuna è arrivata in Oggi col suo testo, non con quello di un’altra',
      storte === 0, storte ? storte + ' finite in Oggi col nome sbagliato' : 'tutte giuste');

    /* e alla fine la coda è vuota, e le cinque cose stanno in Oggi coi loro
       nomi: smistare le SPOSTA, non le trasforma */
    const fine = await p.evaluate((note) => {
      const s = LM.load();
      return {
        inbox: s.inbox.length,
        arrivate: note.filter((t) => s.azioni.some((a) => a.testo === t)).length
      };
    }, NOTE);
    ok('la coda è vuota', fine.inbox === 0, fine.inbox + ' rimaste');
    ok('e tutte e cinque sono in Oggi col loro nome', fine.arrivate === NOTE.length,
      fine.arrivate + ' su ' + NOTE.length);
    ok('nessun errore in pagina', err.length === 0, [...new Set(err)].slice(0, 2).join(' · '));
    await ctx.close();
  }

  await b.close(); srv.close();
  console.log(guai ? '\n>>> ' + guai + (guai === 1 ? ' PROBLEMA' : ' PROBLEMI') : '\n>>> TUTTO A POSTO');
  process.exit(guai ? 1 : 0);
})();
