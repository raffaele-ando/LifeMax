/* ADESSO O DOPO: la domanda a cui la schermata «Adesso» deve rispondere.

   Nasce da «apro la home e voglio vedere cosa dovrei fare adesso — attività,
   cose programmate o abitudini — e mi sono confuso: l'attività che c'era mi
   sembrava quella dopo, per come era scritta».

   Erano due difetti insieme:
   · la scheda aveva lo STESSO aspetto per «questa è di adesso» e «questa è la
     prossima, fra cinque ore»: cambiava solo una frase piccola in mezzo alla
     didascalia, e il tasto pieno diceva «Fatto» in tutti e due i casi;
   · le abitudini non entravano proprio nel conto, quindi chi apriva la
     schermata alle sette non vedeva la corsa delle sette.

   Questa prova tiene fermi i quattro stati e come si distinguono: la parola
   della fascia, il suo colore, la nota che dice cosa succede adesso, e quale
   comando è quello pieno. E controlla che un'abitudine possa essere «la cosa
   di adesso», con i comandi che le competono — un'abitudine non si rimanda a
   domani, si salta per oggi.

   node prove/adesso.js        (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
let fail = 0;
const ok = (n, c, d) => { if (!c) fail++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

(async () => {
  const srv = http.createServer((q, r) => {
    let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
    fs.readFile(path.join(RADICE, p), (e, d) => {
      if (e) { r.statusCode = 404; r.end('x'); return; }
      r.setHeader('Content-Type', T[path.extname(p)] || 'application/octet-stream'); r.end(d);
    });
  });
  await new Promise(r => srv.listen(8762, r));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  const err = [];

  /* una giornata costruita a mano, con l'orologio fermo: è l'unico modo di
     provare i quattro stati senza aspettare le tre del pomeriggio */
  async function scena(oraIso, prepara) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    p.on('pageerror', e => err.push('' + e));
    await p.addInitScript(t => {
      const D = Date; const base = D.now();
      class F extends D {
        constructor(...a) { if (!a.length) super(t + (D.now() - base)); else super(...a); }
        static now() { return t + (D.now() - base); }
      }
      window.Date = F;
    }, new Date(oraIso).getTime());
    await p.goto('http://localhost:8762/index.html'); await p.waitForTimeout(350);
    await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
    /* si parte da una giornata PULITA: niente di quello che c'era, così ogni
       scena ha dentro solo quello che serve a lei */
    await p.evaluate(() => {
      const s = LM.load(), t = LM.todayKey();
      s.azioni.filter(a => a.data === t).forEach(a => { a.done = true; });
      s.abitudini.forEach(h => { h.fatti[t] = true; });
      LM.save();
    });
    if (prepara) await p.evaluate(prepara);
    await p.evaluate(() => { location.hash = '#/oggi'; });
    await p.reload(); await p.waitForTimeout(1000);
    return { ctx, p };
  }
  const scheda = (p) => p.evaluate(() => {
    const f = document.querySelector('.focus-stato');
    const prim = document.querySelector('.focus-primaria button');
    return {
      stato: LM.azioneAdesso().stato,
      tipo: (LM.azioneAdesso().azione || {}).tipo,
      parola: f ? (f.querySelector('.fs-parola') || {}).textContent : null,
      dett: f ? (f.querySelector('.fs-dett') || {}).textContent : null,
      classe: f ? f.className : null,
      titolo: (document.querySelector('.focus-azione') || {}).textContent,
      nota: (document.querySelector('.focus-nota-dopo') || {}).textContent || null,
      primario: prim ? prim.textContent.trim() : null,
      primarioId: prim ? prim.id : null,
      secondarie: [...document.querySelectorAll('.focus-secondarie button')].map(x => x.id),
      didascalia: (document.querySelector('.fd-perche') || {}).textContent || null
    };
  });

  console.log('QUATTRO SITUAZIONI, QUATTRO FACCE');
  {
    /* una cosa che sta succedendo ADESSO */
    const { ctx, p } = await scena('2026-08-25T15:10:00', () => {
      LM.aggiungiAzione('Confrontare piani telefonici', 'finanze', { ora: '15:00', durata: 60 });
    });
    const s = await scheda(p);
    ok('quella che sta succedendo dice ADESSO', s.stato === 'corso' && /Adesso/i.test(s.parola || ''), JSON.stringify(s.parola));
    ok('con l’ora di inizio e di fine', /15:00 → 16:00/.test(s.dett || ''), s.dett);
    ok('e la fascia ha il colore di «adesso»', /st-ora/.test(s.classe || ''), s.classe);
    ok('il tasto pieno è «Fatto»', s.primarioId === 'btn-fatto', s.primario);
    await ctx.close();
  }
  {
    /* la stessa cosa, guardata alle dieci del mattino: NON è di adesso */
    const { ctx, p } = await scena('2026-08-25T10:00:00', () => {
      LM.aggiungiAzione('Confrontare piani telefonici', 'finanze', { ora: '15:00', durata: 60 });
    });
    const s = await scheda(p);
    ok('la stessa cosa, cinque ore prima, dice PIÙ TARDI',
      s.stato === 'programmata' && /Più tardi/i.test(s.parola || ''), s.parola);
    ok('e dice anche quanto manca', /alle 15:00, fra 5 ore/.test(s.dett || ''), s.dett);
    ok('la fascia è quella spenta, non quella accesa', /st-dopo/.test(s.classe || ''), s.classe);
    /* il punto di tutto: la schermata deve rispondere «e adesso?» */
    ok('e dice a chiare lettere che adesso non c’è niente',
      /adesso non hai niente in programma/i.test(s.nota || ''), s.nota);
    /* e il tasto pieno non può dire «Fatto» su una cosa delle tre */
    ok('il tasto pieno diventa «Falla adesso»', s.primarioId === 'btn-adesso', s.primario);
    ok('e «Fatto» resta, ma smorzato', s.secondarie.indexOf('btn-fatto') >= 0, JSON.stringify(s.secondarie));
    /* premendolo, la cosa diventa quella di adesso, per scelta */
    await p.evaluate(() => { document.getElementById('btn-adesso').click(); });
    await p.waitForTimeout(500);
    const dopo = await scheda(p);
    ok('«falla adesso» la porta qui, e lo dice', /scelta da te/i.test(dopo.parola || ''), dopo.parola);
    ok('col tasto pieno che torna «Fatto»', dopo.primarioId === 'btn-fatto', dopo.primario);
    ok('e con la via del ritorno al piano',
      await p.evaluate(() => !!document.getElementById('btn-torna-piano')));
    await ctx.close();
  }
  {
    /* una cosa la cui ora è passata */
    const { ctx, p } = await scena('2026-08-25T22:30:00', () => {
      LM.aggiungiAzione('Confrontare piani telefonici', 'finanze', { ora: '15:00', durata: 60 });
    });
    const s = await scheda(p);
    ok('quella con l’ora passata dice IN RITARDO',
      s.stato === 'ritardo' && /in ritardo/i.test(s.parola || ''), s.parola);
    ok('e dice quando era', /era alle 15:00/.test(s.dett || ''), s.dett);
    ok('con il colore dell’avviso, non quello del pericolo', /st-ritardo/.test(s.classe || ''), s.classe);
    await ctx.close();
  }
  {
    /* una cosa senza ora: si fa quando si vuole, e va detto */
    const { ctx, p } = await scena('2026-08-25T10:00:00', () => {
      LM.aggiungiAzione('Scrivere il changelog', 'founder', {});
    });
    const s = await scheda(p);
    ok('quella senza ora dice QUANDO VUOI',
      s.stato === 'libera' && /quando vuoi/i.test(s.parola || ''), s.parola);
    /* e non ripete la stessa cosa a fianco. La fascia diceva «QUANDO VUOI ·
       nessun orario»: due modi di dire che un orario non c'è, uno accanto
       all'altro nella stessa riga. */
    ok('e non lo ripete nel dettaglio', !(s.dett || '').trim(), s.dett);
    await ctx.close();
  }
  {
    /* la priorità del giorno ha una faccia sua */
    const { ctx, p } = await scena('2026-08-25T10:00:00', () => {
      LM.aggiungiAzione('Spedire la landing', 'founder', { mit: true });
    });
    const s = await scheda(p);
    ok('la priorità del giorno lo dice in fascia', /più importante/i.test(s.parola || ''), s.parola);
    await ctx.close();
  }

  console.log('\nLE ABITUDINI SONO COSE DA FARE ADESSO ANCHE LORO');
  {
    /* il buco che il committente ha trovato: alle sette c'era la corsa delle
       sette, e la schermata non ne sapeva niente */
    const { ctx, p } = await scena('2026-08-25T07:10:00', () => {
      const h = LM.aggiungiAbitudine('Corsa 5 km', 'salute', [0, 1, 2, 3, 4, 5, 6], { ora: '07:00', durata: 45 });
      const s = LM.load(); s.abitudini.find(x => x.id === h.id).fatti = {}; LM.save();
    });
    const s = await scheda(p);
    ok('un’abitudine con l’ora diventa la cosa di adesso',
      s.tipo === 'abitudine' && /Corsa/.test(s.titolo || ''), JSON.stringify({ t: s.tipo, tit: s.titolo }));
    ok('e la fascia dice ADESSO', /Adesso/i.test(s.parola || ''), s.parola);
    /* si deve capire che è un'abitudine: i comandi non sono gli stessi */
    ok('la didascalia dice che è un’abitudine', /abitudine/i.test(s.didascalia || ''), s.didascalia);
    ok('e al posto di «Più tardi» c’è «Salta oggi»',
      s.secondarie.indexOf('btn-salta') >= 0 && s.secondarie.indexOf('btn-nonora') < 0, JSON.stringify(s.secondarie));
    /* «Fatto» spunta l'abitudine, non cerca un'azione che non esiste */
    await p.evaluate(() => { document.getElementById('btn-fatto').click(); });
    await p.waitForTimeout(600);
    const spuntata = await p.evaluate(() => {
      const h = LM.load().abitudini.find(x => /Corsa/.test(x.testo));
      return { fatta: !!(h && h.fatti[LM.todayKey()]), xp: LM.load().xpPerGiorno[LM.todayKey()] || 0 };
    });
    ok('«Fatto» la spunta davvero, con i suoi XP', spuntata.fatta && spuntata.xp > 0, JSON.stringify(spuntata));
    await ctx.close();
  }
  {
    /* il timer su un'abitudine registra i minuti nell'area giusta: cercando
       l'azione per id non la troverebbe, e i minuti sparirebbero */
    const { ctx, p } = await scena('2026-08-25T07:10:00', () => {
      const h = LM.aggiungiAbitudine('Corsa 5 km', 'salute', [0, 1, 2, 3, 4, 5, 6], { ora: '07:00', durata: 45 });
      const s = LM.load(); s.abitudini.find(x => x.id === h.id).fatti = {}; LM.save();
    });
    await p.evaluate(() => { document.getElementById('btn-timer').click(); });
    await p.waitForTimeout(400);
    /* si finge che il tempo sia passato: il timer registra i minuti trascorsi */
    await p.evaluate(() => { document.getElementById('btn-stop-timer').click(); });
    await p.waitForTimeout(500);
    const min = await p.evaluate(() => (LM.load().minuti[LM.todayKey()] || {}));
    ok('il timer non perde i minuti di un’abitudine (registrati o zero, mai altrove)',
      !Object.keys(min).some(k => k !== 'salute'), JSON.stringify(min));
    await ctx.close();
  }

  console.log('\nLA COSA DI ADESSO NON È QUELLA DI DOPO');
  {
    /* con una cosa senza ora e una alle 15, alle dieci quella di adesso è la
       prima: il piano non dice di cominciare quella delle tre */
    const { ctx, p } = await scena('2026-08-25T10:00:00', () => {
      LM.aggiungiAzione('Cena col gruppo', 'relazioni', { ora: '15:00', durata: 60 });
      LM.aggiungiAzione('Scrivere il changelog', 'founder', {});
    });
    const s = await scheda(p);
    ok('sceglie quella che si può fare adesso', /changelog/i.test(s.titolo || ''), s.titolo);
    ok('e la fascia non dice «adesso» a sproposito', /quando vuoi/i.test(s.parola || ''), s.parola);
    await ctx.close();
  }

  /* SI GUARDA, NON SI LEGGE.
     Nasce da «migliora la ux della card nella pagina adesso: non ci deve
     essere scritto cosa è, devo guardarlo e capirlo subito».
     Prima l'unica differenza fra «questa è per adesso» e «questa comincia fra
     cinque ore» era una parola in maiuscolo dentro una pastiglia — tutto il
     resto della scheda era identico, e il segnale più forte (il filo colorato
     in cima) diceva l'AREA, che è l'informazione meno urgente delle due.
     Questa prova toglie di mezzo le parole e guarda solo le FORME: il colore
     del filo in cima e quanto è piena la barra del tempo. Se due stati
     diversi danno la stessa coppia, la scheda non si distingue a occhio, e la
     prova non passa. */
  console.log('\nSI GUARDA, NON SI LEGGE');
  {
    const CASI = [
      ['in corso', '2026-08-25T15:20:00', () => { LM.aggiungiAzione('Confrontare piani telefonici', 'finanze', { ora: '15:00', durata: 60 }); }],
      ['in ritardo', '2026-08-25T17:30:00', () => { LM.aggiungiAzione('Confrontare piani telefonici', 'finanze', { ora: '15:00', durata: 60 }); }],
      ['più tardi', '2026-08-25T10:00:00', () => { LM.aggiungiAzione('Confrontare piani telefonici', 'finanze', { ora: '15:00', durata: 60 }); }],
      ['quando vuoi', '2026-08-25T11:00:00', () => { LM.aggiungiAzione('Sistemare la scrivania', 'altro', {}); }]
    ];
    const forme = [];
    for (const [nome, quando, prep] of CASI) {
      const { ctx, p } = await scena(quando, prep);
      const f = await p.evaluate(() => {
        const c = document.querySelector('.focus-cuore');
        if (!c) return null;
        const filo = getComputedStyle(c, '::before').backgroundColor;
        const barra = c.querySelector('.fs-barra');
        const i = barra && barra.querySelector('i');
        const quota = i && barra
          ? Math.round((i.getBoundingClientRect().width / barra.getBoundingClientRect().width) * 100)
          : -1;
        return { classe: c.className, filo: filo, quota: quota, fondo: getComputedStyle(c).backgroundColor };
      });
      forme.push([nome, f]);
      await ctx.close();
    }
    forme.forEach(([nome, f]) => {
      ok('«' + nome + '» ha una sua forma', !!f && /st-/.test(f.classe || ''),
        f ? f.filo + ' · barra ' + f.quota + '%' : 'niente scheda');
    });
    /* il cuore della prova: quattro stati, quattro aspetti diversi */
    const impronte = forme.map(([, f]) => (f ? f.filo + '|' + f.quota + '|' + f.fondo : 'x'));
    const uniche = new Set(impronte);
    ok('e nessuno stato ha lo stesso aspetto di un altro', uniche.size === forme.length,
      uniche.size + ' aspetti diversi su ' + forme.length);
    /* e la barra del tempo dice davvero il tempo */
    const q = (n) => (forme.find((x) => x[0] === n) || [, {}])[1].quota;
    ok('in corso la barra è piena a metà strada, non tutta', q('in corso') > 5 && q('in corso') < 95, q('in corso') + '%');
    ok('in ritardo è piena tutta', q('in ritardo') >= 99, q('in ritardo') + '%');
    ok('più tardi è un binario vuoto', q('più tardi') >= 0 && q('più tardi') <= 5, q('più tardi') + '%');
    ok('quando vuoi non ha barra: non c’è un tempo da mostrare', q('quando vuoi') === -1, '' + q('quando vuoi'));
  }

  console.log('');
  ok('nessun errore JS', err.length === 0, err.slice(0, 3).join(' | '));
  console.log(fail ? '\n>>> ' + fail + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();
