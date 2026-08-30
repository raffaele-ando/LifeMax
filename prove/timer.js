/* IL TIMER: quattro tipi, e continua a girare quando non lo guardi.

   Nasce da «se io prendo e faccio partire un timer, allora se chiudo il
   telefono deve continuare ad andare e se apro qualsiasi dispositivo deve
   andare in tempo reale».

   Prima il timer viveva in una variabile della pagina: chiudevi il telefono
   e non era mai esistito, e su un altro dispositivo non c'era. Adesso sta nei
   dati come tutto il resto, e quello che si salva è l'ORA DI FINE, non i
   minuti che restano — un istante assoluto lo legge uguale qualunque
   dispositivo in qualunque momento, mentre un conto alla rovescia salvato
   invecchia appena lo scrivi. Da lì tutto il resto viene gratis: sopravvive
   a un ricaricamento, e arriva agli altri dispositivi per la strada che c'è
   già (la stessa che porta tutto il resto).

   L'altro dispositivo, qui, è una seconda scheda del browser: due pagine che
   condividono lo stesso `localStorage` sono la stessa cosa che due telefoni
   che condividono lo stesso documento nella nuvola — quello che si vuole
   sapere è se l'app RILEGGE quello stato invece di fidarsi della sua memoria.

   E la modalità concentrazione: che si apra, che dica la cosa giusta anche in
   pausa, che uscendo NON fermi il timer (uscire dallo schermo e smettere sono
   due cose diverse, e confonderle costa il lavoro fatto), e che si riapra da
   sola se il telefono si è chiuso mentre eri dentro.

   node prove/timer.js        (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
const PORTA = 8773;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
let fail = 0;
const ok = (n, c, d) => { if (!c) fail++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

(async () => {
  const srv = http.createServer((q, r) => {
    let u = decodeURIComponent(q.url.split('?')[0]); if (u === '/') u = '/index.html';
    fs.readFile(path.join(RADICE, u), (e, d) => {
      if (e) { r.statusCode = 404; r.end('x'); return; }
      r.setHeader('Content-Type', T[path.extname(u)] || 'application/octet-stream'); r.end(d);
    });
  });
  await new Promise(r => srv.listen(PORTA, r));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  const err = []; p.on('pageerror', (e) => err.push('' + e));
  const vai = async (pag) => { await pag.evaluate(() => { location.hash = '#/oggi'; }); await pag.reload(); await pag.waitForTimeout(1200); };

  await p.goto('http://localhost:' + PORTA + '/index.html'); await p.waitForTimeout(300);
  await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  await vai(p);

  console.log('\nQUATTRO TIPI, NON QUATTRO NUMERI');
  await p.evaluate(() => document.getElementById('btn-timer').click());
  await p.waitForTimeout(600);
  const scelte = await p.evaluate(() => [...document.querySelectorAll('[data-timer-tipo]')].map((x) => ({
    tipo: x.getAttribute('data-timer-tipo'), min: +x.getAttribute('data-min'),
    nome: (x.querySelector('.lista-tit') || {}).textContent,
    dice: (x.querySelector('.lista-sub') || {}).textContent
  })));
  ok('ce ne sono quattro', scelte.length === 4, scelte.map((x) => x.tipo).join(', '));
  ok('e ognuno dice a cosa serve, non solo quanto dura',
    scelte.every((x) => x.nome && x.dice && x.dice.length > 12),
    scelte.map((x) => x.nome + ' — ' + x.dice).join(' | '));
  ok('quello per partire è il più corto di tutti',
    scelte.find((x) => x.tipo === 'avvio').min <= 5 &&
    scelte.find((x) => x.tipo === 'avvio').min < scelte.find((x) => x.tipo === 'blocco').min,
    'avvio ' + scelte.find((x) => x.tipo === 'avvio').min + '′ contro blocco ' + scelte.find((x) => x.tipo === 'blocco').min + '′');

  console.log('\nPARTE, E VA AVANTI ANCHE QUANDO NON LO GUARDI');
  await p.evaluate(() => document.querySelector('[data-timer-tipo="blocco"]').click());
  await p.waitForTimeout(700);
  ok('la concentrazione si apre da sola', await p.evaluate(() => document.body.classList.contains('in-concentrazione')));
  const dati = await p.evaluate(() => { const t = LM.load().timer; return t && { tipo: t.tipo, haFine: !!t.fine, salvaResto: 'resta' in t }; });
  ok('il timer sta nei DATI, non in una variabile', !!dati && dati.tipo === 'blocco', JSON.stringify(dati));
  ok('e quello che salva è l’ora di fine, non i minuti che restano',
    dati.haFine && !dati.salvaResto, 'fine: sì, resto salvato: no');

  const primaRic = await p.evaluate(() => document.querySelector('[data-timer-cifre]').textContent);
  await p.waitForTimeout(2200);
  await p.reload(); await p.waitForTimeout(1400);
  const dopoRic = await p.evaluate(() => { const e = document.querySelector('[data-timer-cifre]'); return e ? e.textContent : ''; });
  ok('sopravvive a un ricaricamento', await p.evaluate(() => !!LM.timerVivo()));
  ok('e nel frattempo è andato avanti da solo', dopoRic && dopoRic < primaRic, primaRic + ' → ' + dopoRic);
  ok('se eri dentro alla concentrazione, ci torni',
    await p.evaluate(() => document.body.classList.contains('in-concentrazione')));

  console.log('\nUN ALTRO DISPOSITIVO LO VEDE UGUALE');
  {
    /* una seconda pagina sullo stesso stato: è la stessa situazione di due
       telefoni sullo stesso documento nella nuvola */
    const p2 = await ctx.newPage();
    await p2.goto('http://localhost:' + PORTA + '/index.html');
    await p2.waitForTimeout(1300);
    const q = await p2.evaluate(() => { const t = LM.timerVivo(); return t && { tipo: t.tipo, fine: t.fine }; });
    const q1 = await p.evaluate(() => { const t = LM.timerVivo(); return t && t.fine; });
    ok('la seconda pagina trova lo stesso timer', !!q && q.fine === q1, 'stessa ora di fine: ' + (q && q.fine === q1));
    const cifre2 = await p2.evaluate(() => { const e = document.querySelector('[data-timer-cifre]'); return e ? e.textContent : '(niente)'; });
    ok('e conta anche lei, senza che nessuno gliel’abbia detto', /^\d+:\d\d$/.test(cifre2), cifre2);
    await p2.close();
  }

  console.log('\nUSCIRE DALLO SCHERMO NON È FERMARE');
  await p.evaluate(() => document.getElementById('conc-esci').click());
  await p.waitForTimeout(400);
  ok('uscendo, il timer continua', await p.evaluate(() => !!LM.timerVivo()));
  ok('e la scheda offre di tornarci',
    await p.evaluate(() => { const x = document.getElementById('btn-concentra'); return !!x && /timer/i.test(x.textContent); }));
  await p.reload(); await p.waitForTimeout(1300);
  ok('e uscito resta uscito anche dopo un ricaricamento',
    await p.evaluate(() => !document.body.classList.contains('in-concentrazione')));

  console.log('\nIL POMODORO SA DI AVERE UNA PAUSA DENTRO');
  await p.evaluate(() => { LM.fermaTimerDati(); });
  await vai(p);
  await p.evaluate(() => document.getElementById('btn-timer').click());
  await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelector('[data-timer-tipo="pomodoro"]').click());
  await p.waitForTimeout(700);
  await p.evaluate(() => { const s = LM.load(); s.timer.fine = Date.now() + 250; LM.save(); });
  await p.waitForTimeout(1500);
  const inPausa = await p.evaluate(() => { const t = LM.timerVivo(); return t && { inPausa: t.inPausa, ciclo: t.ciclo }; });
  ok('finito il blocco, va in pausa da solo', !!inPausa && inPausa.inPausa === true, JSON.stringify(inPausa));
  ok('e lo schermo lo DICE (se no è una pausa che non sai di avere)',
    /pausa/i.test(await p.evaluate(() => { const e = document.querySelector('.conc-tipo'); return e ? e.textContent : ''; })),
    await p.evaluate(() => { const e = document.querySelector('.conc-tipo'); return e ? e.textContent.trim() : '(chiuso)'; }));
  await p.evaluate(() => { const s = LM.load(); s.timer.pausaFine = Date.now() + 250; LM.save(); });
  await p.waitForTimeout(1500);
  const ripreso = await p.evaluate(() => { const t = LM.timerVivo(); return t && { inPausa: t.inPausa, ciclo: t.ciclo }; });
  ok('finita la pausa riparte, e il blocco è il secondo',
    !!ripreso && ripreso.inPausa === false && ripreso.ciclo === 2, JSON.stringify(ripreso));

  console.log('\nA SCADENZA REGISTRA I MINUTI E SI CHIUDE');
  await p.evaluate(() => { LM.fermaTimerDati(); });
  await vai(p);
  const areaPrima = await p.evaluate(() => {
    const s = LM.load(); const k = LM.todayKey();
    return JSON.stringify(s.minuti[k] || {});
  });
  await p.evaluate(() => document.getElementById('btn-timer').click());
  await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelector('[data-timer-tipo="blocco"]').click());
  await p.waitForTimeout(600);
  /* lo faccio scadere dopo aver finto che sia partito venti minuti fa */
  await p.evaluate(() => {
    const s = LM.load();
    s.timer.inizio = Date.now() - 20 * 60000;
    s.timer.fine = Date.now() + 250;
    s.timer.durata = 20;
    LM.save();
  });
  await p.waitForTimeout(1600);
  ok('a scadenza il timer sparisce', await p.evaluate(() => !LM.timerVivo()));
  const areaDopo = await p.evaluate(() => {
    const s = LM.load(); const k = LM.todayKey();
    return JSON.stringify(s.minuti[k] || {});
  });
  ok('e i minuti finiscono nel conto dell’area', areaDopo !== areaPrima, areaPrima + ' → ' + areaDopo);
  ok('e la concentrazione si chiude da sé',
    await p.evaluate(() => !document.body.classList.contains('in-concentrazione')));

  console.log('\nI CINQUE MINUTI NON SI FERMANO: VANNO AVANTI DA SOLI');
  await p.evaluate(() => { LM.fermaTimerDati(); });
  await vai(p);
  await p.evaluate(() => document.getElementById('btn-timer').click());
  await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelector('[data-timer-tipo="avvio"]').click());
  await p.waitForTimeout(700);
  const cinque = await p.evaluate(() => { const t = LM.timerVivo(); return t && { tipo: t.tipo, durata: t.durata }; });
  ok('parte da cinque minuti', !!cinque && cinque.tipo === 'avvio' && cinque.durata === 5, JSON.stringify(cinque));
  await p.evaluate(() => { const s = LM.load(); s.timer.inizio = Date.now() - 5 * 60000; s.timer.fine = Date.now() + 250; LM.save(); });
  await p.waitForTimeout(1600);
  const dopo5 = await p.evaluate(() => { const t = LM.timerVivo(); return t && { tipo: t.tipo, durata: t.durata, daAvvio: !!t.daAvvio }; });
  ok('allo scadere NON si ferma', !!dopo5, dopo5 ? JSON.stringify(dopo5) : 'fermato');
  ok('riparte da solo con un blocco intero', !!dopo5 && dopo5.tipo === 'blocco' && dopo5.durata >= 20, JSON.stringify(dopo5));
  ok('e lo schermo dice che sta andando avanti',
    /vado avanti/i.test(await p.evaluate(() => { const e = document.querySelector('.conc-tipo'); return e ? e.textContent : ''; })),
    await p.evaluate(() => { const e = document.querySelector('.conc-tipo'); return e ? e.textContent.trim() : '(chiuso)'; }));
  ok('e il comando per smettere dice «basta così»',
    /basta/i.test(await p.evaluate(() => { const e = document.getElementById('conc-ferma'); return e ? e.textContent : ''; })),
    await p.evaluate(() => { const e = document.getElementById('conc-ferma'); return e ? e.textContent.trim() : '(niente)'; }));
  ok('e i cinque minuti fatti sono già stati contati',
    await p.evaluate(() => { const m = LM.load().minuti[LM.todayKey()] || {}; return Object.values(m).some((v) => v >= 5); }),
    JSON.stringify(await p.evaluate(() => LM.load().minuti[LM.todayKey()] || {})));

  console.log('\nQUANTO NE HAI FATTO DAVVERO');
  await p.evaluate(() => { LM.fermaTimerDati(); });
  /* una cosa di oggi, non un'abitudine: un'abitudine ha «Salta oggi», che è
     la stessa cosa detta nel modo giusto per una cosa che torna */
  await p.evaluate(() => {
    const s = LM.load();
    s.azioni.forEach((a) => { if (a.data === LM.todayKey()) a.done = true; });
    s.abitudini.forEach((h) => { h.fatti[LM.todayKey()] = true; });
    LM.save();
    LM.aggiungiAzione('Una cosa lasciata a metà', 'studio', {});
  });
  await vai(p);
  {
    const r = await p.evaluate(async () => {
      const xpPrima = LM.load().xp;
      const b = document.getElementById('btn-mancata');
      if (!b) return { saltata: true };
      b.click();
      await new Promise((r2) => setTimeout(r2, 700));
      const quanti = [...document.querySelectorAll('[data-quanto]')].map((x) => x.textContent.trim());
      const perche = [...document.querySelectorAll('[data-perche]')].map((x) => x.textContent.trim());
      const q = document.querySelector('[data-quanto="meta"]');
      if (q) q.click();
      const w = document.querySelector('[data-perche="tempo"]');
      if (w) w.click();
      document.getElementById('mancata-ok').click();
      await new Promise((r2) => setTimeout(r2, 700));
      const a = LM.load().azioni.find((x) => x.mancata);
      return { quanti: quanti, perche: perche, xpPrima: xpPrima, xpDopo: LM.load().xp,
        quanto: a && a.mancata.quanto, quota: a && a.mancata.quota, chiusa: !a.done };
    });
    if (r.saltata) ok('c’è il tasto per dirlo', false, 'nessun tasto');
    else {
      ok('la prima domanda è QUANTO, con quattro gradini', r.quanti.length === 4, r.quanti.join(' · '));
      ok('e poi il perché, facoltativo', r.perche.length >= 4, r.perche.join(' · '));
      ok('quello che hai fatto viene registrato', r.quanto === 'meta' && r.quota === 0.5,
        r.quanto + ' (' + r.quota + ')');
      ok('e il pezzo fatto vale i suoi punti', r.xpDopo > r.xpPrima, r.xpPrima + ' → ' + r.xpDopo);
      ok('ma la cosa non risulta finita', r.chiusa === true);
    }
  }

  console.log('\nUN TIMER DI IERI NON TI SALTA ADDOSSO STAMATTINA');
  await p.evaluate(() => {
    const s = LM.load();
    s.timer = { azioneId: 'x', tipo: 'blocco', inizio: Date.now() - 40 * 3600000,
      fine: Date.now() - 39 * 3600000, durata: 60, ciclo: 1, inPausa: false, concentrato: true };
    LM.save();
  });
  await p.reload(); await p.waitForTimeout(1300);
  ok('un timer finito da ore non riappare', await p.evaluate(() => !LM.timerVivo()));
  ok('e non riapre lo schermo pieno in faccia a nessuno',
    await p.evaluate(() => !document.body.classList.contains('in-concentrazione')));

  ok('nessun errore in pagina', err.length === 0, err.slice(0, 2).join(' · '));
  await b.close(); srv.close();
  console.log(fail ? '\n>>> ' + fail + ' GUAI' : '\n>>> TUTTO A POSTO');
  process.exit(fail ? 1 : 0);
})();
