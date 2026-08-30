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
      didascalia: (document.querySelector('.fd-perche') || {}).textContent || null,
      /* la specie non si legge più: si guarda. Qui si raccolgono i segni che
         la dicono, e la parola che resta per chi usa un lettore di schermo. */
      tessera: (document.querySelector('.fs-tipo') || {}).className || null,
      ripete: !!document.querySelector('.focus-ripete'),
      tipoNome: (document.querySelector('.fs-tipo-nome') || {}).textContent || null,
      parolaNascosta: !!document.querySelector('.fs-parola.solo-lettori')
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
    /* e dice l'ora, quanto dura e quanto manca: con una durata è un BLOCCO da
       incastrare in una giornata, e «alle 15:00» da solo non basta a
       deciderlo */
    ok('e dice anche quanto dura e quanto manca',
      /alle 15:00/.test(s.dett || '') && /60′/.test(s.dett || '') && /fra 5 ore/.test(s.dett || ''), s.dett);
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
    /* e non lo dice DUE VOLTE SULLO SCHERMO. La fascia mostrava «QUANDO VUOI ·
       nessun orario»: due modi di dire la stessa cosa uno accanto all'altro.
       Adesso la parola sta solo nel testo per il lettore di schermo — chi
       guarda vede il binario tratteggiato e il dato accanto, una volta sola. */
    ok('la parola resta solo per chi non vede la forma', s.parolaNascosta, '' + s.parolaNascosta);
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
    /* si deve capire che è un'abitudine: i comandi non sono gli stessi. E lo
       dicono due segni, non una parola scritta piccola in fondo a una riga —
       la tessera del tipo e la settimana disegnata sotto il titolo. La parola
       resta per chi usa un lettore di schermo. */
    ok('la tessera dice che è un’abitudine', /fs-tipo-abitudine/.test(s.tessera || ''), s.tessera);
    ok('e sotto il titolo c’è la sua settimana', s.ripete === true, '' + s.ripete);
    ok('la parola resta per chi non vede i segni', /abitudine/i.test(s.tipoNome || ''), s.tipoNome);
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
    /* il timer adesso chiede prima CHE TIPO: si sceglie il blocco, e si ferma
       dallo schermo della concentrazione, che è dove sta il comando */
    await p.evaluate(() => { document.getElementById('btn-timer').click(); });
    await p.waitForTimeout(500);
    await p.evaluate(() => { document.querySelector('[data-timer-tipo="blocco"]').click(); });
    await p.waitForTimeout(600);
    /* si finge che il tempo sia passato: il timer registra i minuti trascorsi */
    await p.evaluate(() => { document.getElementById('conc-ferma').click(); });
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
    /* SEI CASI, non quattro: al «quando» si è aggiunto il «che cos'è».
       La scheda deve distinguere due cose insieme — a che punto del tempo sta
       questa cosa, e di che specie è — perché i comandi che offre cambiano
       con la specie (un'abitudine si salta per oggi, una cosa di oggi si
       rimanda a domani) e il momento in cui cominciarla cambia col tempo.
       Qui si buttano via tutte le parole e si guardano solo le FORME: colore
       del filo in cima, quanto è piena la barra, com'è fatta la barra (piena,
       vuota, tratteggiata, un segno solo) e che tessera porta il tipo. Se due
       casi diversi danno la stessa impronta, a occhio sono la stessa scheda. */
    const CASI = [
      ['in corso, con durata', '2026-08-25T15:20:00', () => { LM.aggiungiAzione('Confrontare piani telefonici', 'finanze', { ora: '15:00', durata: 60 }); }],
      ['in ritardo', '2026-08-25T17:30:00', () => { LM.aggiungiAzione('Confrontare piani telefonici', 'finanze', { ora: '15:00', durata: 60 }); }],
      ['più tardi, con durata', '2026-08-25T10:00:00', () => { LM.aggiungiAzione('Confrontare piani telefonici', 'finanze', { ora: '15:00', durata: 60 }); }],
      ['più tardi, senza durata', '2026-08-25T10:00:00', () => { LM.aggiungiAzione('Chiamare la banca', 'finanze', { ora: '15:00' }); }],
      ['senza orario', '2026-08-25T11:00:00', () => { LM.aggiungiAzione('Sistemare la scrivania', 'altro', {}); }],
      ['senza orario, la più importante', '2026-08-25T11:00:00', () => { LM.aggiungiAzione('Spedire la landing', 'founder', { mit: true }); }],
      ['abitudine, in corso', '2026-08-25T07:20:00', () => {
        const h = LM.aggiungiAbitudine('Corsa 5 km', 'salute', [0, 1, 2, 3, 4, 5, 6], { ora: '07:00', durata: 45 });
        const s = LM.load(); s.abitudini.find(x => x.id === h.id).fatti = {}; LM.save();
      }]
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
        const bs = barra ? getComputedStyle(barra) : null;
        const ir = i ? i.getBoundingClientRect() : null;
        /* la quota è quanto della barra è pieno; per il «segno solo» la barra
           non è un binario e il pieno è un trattino verticale, quindi si
           guarda anche la forma del disegno */
        const quota = ir && barra && barra.getBoundingClientRect().width
          ? Math.round((ir.width / barra.getBoundingClientRect().width) * 100) : -1;
        const tess = c.querySelector('.fs-tipo');
        return {
          classe: c.className,
          filo: filo,
          quota: quota,
          fondo: getComputedStyle(c).backgroundColor,
          disegno: bs ? (bs.backgroundImage === 'none' ? 'pieno' : 'tratteggio') : 'niente',
          altoI: ir ? Math.round(ir.height) : -1,
          tessera: tess ? getComputedStyle(tess).backgroundColor : 'niente',
          ripete: !!c.querySelector('.focus-ripete')
        };
      });
      forme.push([nome, f]);
      await ctx.close();
    }
    forme.forEach(([nome, f]) => {
      ok('«' + nome + '» ha una sua forma', !!f && /st-/.test(f.classe || ''),
        f ? f.filo + ' · barra ' + f.quota + '% ' + f.disegno : 'niente scheda');
    });
    /* il cuore della prova: casi diversi, aspetti diversi */
    const impronte = forme.map(([, f]) => (f ? [f.filo, f.quota, f.fondo, f.disegno, f.altoI, f.tessera, f.ripete].join('|') : 'x'));
    const uniche = new Set(impronte);
    ok('e nessun caso ha lo stesso aspetto di un altro', uniche.size === forme.length,
      uniche.size + ' aspetti diversi su ' + forme.length);
    /* e la barra del tempo dice davvero il tempo */
    const F = (n) => (forme.find((x) => x[0] === n) || [, {}])[1] || {};
    ok('in corso la barra è piena a metà strada, non tutta', F('in corso, con durata').quota > 5 && F('in corso, con durata').quota < 95, F('in corso, con durata').quota + '%');
    ok('in ritardo è piena tutta', F('in ritardo').quota >= 99, F('in ritardo').quota + '%');
    ok('più tardi con una durata è un binario vuoto', F('più tardi, con durata').quota >= 0 && F('più tardi, con durata').quota <= 5, F('più tardi, con durata').quota + '%');
    /* un'ora senza durata è un ISTANTE: il segno è alto più della barra, e la
       barra non è un binario */
    ok('più tardi senza durata è un segno, non un binario',
      F('più tardi, senza durata').altoI > 6 && F('più tardi, senza durata').disegno === 'pieno',
      'segno alto ' + F('più tardi, senza durata').altoI + 'px');
    ok('senza orario la barra è tratteggiata: non ha confini',
      F('senza orario').disegno === 'tratteggio', F('senza orario').disegno);
    /* la specie si vede senza leggere */
    ok('un\u2019abitudine porta la sua settimana disegnata, una cosa di oggi no',
      F('abitudine, in corso').ripete === true && F('in corso, con durata').ripete === false,
      'abitudine ' + F('abitudine, in corso').ripete + ' · attività ' + F('in corso, con durata').ripete);
    ok('e la tessera del tipo non ha lo stesso colore nei due casi',
      F('abitudine, in corso').tessera !== F('in corso, con durata').tessera,
      F('abitudine, in corso').tessera + ' contro ' + F('in corso, con durata').tessera);
  }

  console.log('');
  ok('nessun errore JS', err.length === 0, err.slice(0, 3).join(' | '));
  console.log(fail ? '\n>>> ' + fail + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();
