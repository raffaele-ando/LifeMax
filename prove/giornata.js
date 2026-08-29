/* IL RESOCONTO DELLA GIORNATA: la notte, i pasti, e le cose fatte senza
   scriverle.

   Nasce da «al primo accesso della giornata chiedi a che ora si è svegliato e
   a che ora è andato a dormire, stando attento che non sia rimasto sveglio la
   notte», e dalla richiesta gemella per la sera: le cose che uno ha fatto
   davvero e non ha avuto voglia di scrivere.

   Tre famiglie di cose che si possono sbagliare, e sono quelle che questa
   prova guarda:

   1. QUANDO SI CHIEDE. Al mattino la notte, dalle 19 la giornata, una volta
      sola, mai sopra un pannello già aperto, mai alla prima visita in assoluto
      e — la regola che conta — MAI a chi non è andato a dormire: se fra
      l'ultima volta che l'app ti ha visto e adesso non c'è un buco di almeno
      tre ore, la notte non ci sta, e non si chiede niente.
   2. LA PRECISIONE. Ogni orario porta con sé come è stato dato. «Come sempre»
      vale «più o meno»; toccare l'orologio e cambiare l'ora vale «preciso», e
      la scelta si vede spostarsi da sé. «Non me lo ricordo» non scrive
      nessun orario: meglio un dato che non c'è di un numero inventato.
   3. QUELLO CHE RESTA NEI DATI. Un pasto saltato è un dato (`fatto: false`),
      non un buco. Una cosa scritta dopo nasce già fatta, con i suoi XP e col
      segno `dopo` — così si può ancora distinguere quello che era pianificato
      da quello che è stato recuperato la sera.

   node prove/giornata.js        (CHROMIUM=/percorso/di/chrome se serve)  */
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
  await new Promise(r => srv.listen(8761, r));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  const err = [];

  /* una pagina con l'orologio fermo a un'ora scelta, e la possibilità di
     dire «l'ultima volta che mi hai visto è stata N ore fa» */
  async function apri(oraIso, oreDaUltimaVisita, extra) {
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
    await p.goto('http://localhost:8761/index.html'); await p.waitForTimeout(350);
    await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
    /* la demo arriva con la giornata già raccontata (se no le prove non
       sarebbero prevedibili): qui la si «srotola» per poter provare */
    await p.evaluate((ore) => {
      const s = LM.load();
      const t = LM.todayKey();
      s.visto = ore === null ? 0 : Date.now() - ore * 3600 * 1000;
      delete s.ritmoGiorno[t].chiestoNotte;
      delete s.ritmoGiorno[t].chiestoGiorno;
      LM.save();
    }, oreDaUltimaVisita === undefined ? 9 : oreDaUltimaVisita);
    if (extra) await p.evaluate(extra);
    await p.reload();
    await p.waitForTimeout(1900);          /* il pop-up arriva a 900ms */
    return { ctx, p };
  }
  const stato = (p) => p.evaluate(() => ({
    aperto: !document.getElementById('sheet-overlay').hidden,
    tit: (document.getElementById('sheet-titolo') || {}).textContent,
    notte: !!document.getElementById('blocco-notte'),
    recupero: !!document.getElementById('blocco-recupero')
  }));

  console.log('AL MATTINO CHIEDE COM’È ANDATA LA NOTTE');
  {
    const { ctx, p } = await apri('2026-08-25T08:00:00', 9);
    const st = await stato(p);
    ok('alle 8, dopo nove ore di assenza, la domanda arriva', st.aperto && st.notte, JSON.stringify(st));
    ok('e dice di cosa si tratta', /notte/i.test(st.tit || ''), st.tit);
    /* un tasto per il caso normale: se è andata come sempre, un tocco */
    const solito = await p.evaluate(() => {
      const b2 = document.getElementById('notte-solito');
      return b2 ? b2.textContent.replace(/\s+/g, ' ').trim() : null;
    });
    ok('c’è il tocco per «come sempre», con gli orari scritti dentro',
      !!solito && /come sempre/i.test(solito) && /\d\d:\d\d/.test(solito), solito);
    await p.evaluate(() => { document.getElementById('notte-solito').click(); });
    await p.waitForTimeout(600);
    const dati = await p.evaluate(() => {
      const g = LM.load().ritmoGiorno[LM.todayKey()];
      return { sonno: g.sonno, sveglia: g.sveglia, prec: g.prec, chiesto: !!g.chiestoNotte,
        aperto: !document.getElementById('sheet-overlay').hidden };
    });
    ok('un tocco salva tutti e due gli orari', !!dati.sonno && !!dati.sveglia, JSON.stringify(dati));
    /* «come sempre» è un ricordo, non una misura */
    ok('e li segna come «più o meno», perché è quello che sono', dati.prec === 'circa', dati.prec);
    ok('poi si chiude e non lo richiede', !dati.aperto && dati.chiesto, JSON.stringify(dati));
    await ctx.close();
  }

  console.log('\nCHI NON È ANDATO A DORMIRE NON SE LO SENTE CHIEDERE');
  {
    /* la regola che il committente ha chiesto per prima: sveglio tutta la
       notte, riapre l'app alle quattro e mezza. Fra l'ultima visita e adesso
       c'è mezz'ora: là dentro una notte non ci sta. */
    const { ctx, p } = await apri('2026-08-25T04:30:00', 0.5);
    const st = await stato(p);
    ok('alle 4:30, mezz’ora dopo l’ultima visita, nessuna domanda', !st.aperto, JSON.stringify(st));
    await ctx.close();
  }
  {
    /* e nemmeno all'ora giusta, se il buco non c'è: due ore di pausa non sono
       una notte */
    const { ctx, p } = await apri('2026-08-25T09:00:00', 2);
    const st = await stato(p);
    ok('alle 9, ma con due ore di buco, nessuna domanda', !st.aperto, JSON.stringify(st));
    await ctx.close();
  }
  {
    const { ctx, p } = await apri('2026-08-25T08:00:00', null);
    const st = await stato(p);
    ok('alla primissima visita non chiede niente', !st.aperto, JSON.stringify(st));
    await ctx.close();
  }

  console.log('\nLA PRECISIONE LA DECIDE COME L’HAI DETTA');
  {
    const { ctx, p } = await apri('2026-08-25T08:00:00', 9);
    const prima = await p.evaluate(() => (document.querySelector('#notte-prec .q-chip.on') || {}).textContent);
    ok('di partenza è «più o meno»', /più o meno/.test(prima || ''), prima);
    await p.evaluate(() => {
      const i = document.getElementById('notte-sveglia');
      i.value = '07:12'; i.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await p.waitForTimeout(200);
    const dopo = await p.evaluate(() => (document.querySelector('#notte-prec .q-chip.on') || {}).textContent);
    ok('cambiando l’ora si sposta su «precisi», e si vede', /precisi/.test(dopo || ''), dopo);
    /* e chi sceglie a mano vince: se scelgo «più o meno» e poi cambio l'ora,
       resta quello che ho detto io */
    await p.evaluate(() => { document.querySelector('#notte-prec [data-prec="circa"]').click(); });
    await p.evaluate(() => {
      const i = document.getElementById('notte-sonno');
      i.value = '01:20'; i.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await p.waitForTimeout(200);
    const scelto = await p.evaluate(() => (document.querySelector('#notte-prec .q-chip.on') || {}).textContent);
    ok('ma la scelta fatta a mano non viene sovrascritta', /più o meno/.test(scelto || ''), scelto);
    await p.evaluate(() => { document.getElementById('notte-salva').click(); });
    await p.waitForTimeout(600);
    const g = await p.evaluate(() => LM.load().ritmoGiorno[LM.todayKey()]);
    ok('gli orari salvati sono quelli messi a mano', g.sveglia === '07:12' && g.sonno === '01:20',
      JSON.stringify({ s: g.sonno, w: g.sveglia }));
    ok('con la precisione scelta', g.prec === 'circa', g.prec);
    /* a letto all'1:20 e sveglio alle 7:12: la notte scavalla la mezzanotte */
    const ore = await p.evaluate(() => LM.minutiSonno(LM.todayKey()));
    ok('e le ore di sonno tengono conto della mezzanotte', ore === 352, ore + ' minuti');
    await ctx.close();
  }
  {
    const { ctx, p } = await apri('2026-08-25T08:00:00', 9);
    await p.evaluate(() => { document.getElementById('notte-boh').click(); });
    await p.waitForTimeout(600);
    const g = await p.evaluate(() => ({ g: LM.load().ritmoGiorno[LM.todayKey()],
      aperto: !document.getElementById('sheet-overlay').hidden }));
    ok('«non me lo ricordo» non scrive nessun orario', g.g.sveglia === undefined && g.g.sonno === undefined,
      JSON.stringify(g.g));
    ok('ma non lo richiede oggi', g.g.chiestoNotte === true && !g.aperto, JSON.stringify(g.g));
    await ctx.close();
  }
  {
    /* chiuderlo è una risposta: chi lo scaccia non se lo ritrova davanti al
       prossimo ricaricamento */
    const { ctx, p } = await apri('2026-08-25T08:00:00', 9);
    await p.evaluate(() => { document.getElementById('sheet-chiudi').click(); });
    await p.waitForTimeout(500);
    const chiesto = await p.evaluate(() => LM.giaChiesto(LM.todayKey(), 'notte'));
    ok('chiudendolo vale «non adesso»', chiesto === true);
    await p.reload(); await p.waitForTimeout(1900);
    ok('e ricaricando non torna', !(await stato(p)).aperto);
    /* la domanda però non è sparita: sta nei rituali */
    await p.evaluate(() => { location.hash = '#/rituali'; }); await p.waitForTimeout(800);
    /* la domanda vive nel «Registro di oggi», che è la riga dei Rituali che
       porta il suo nome: prima stava in cima a «Le azioni di oggi», dove
       nessuno la cercava, e i pasti erano ancora più nascosti — dentro la
       review della sera. */
    await p.evaluate(() => {
      const t2 = document.querySelector('.rit-blocco[data-rit="registro"] .rit-riga');
      const giaAperto = document.querySelector('.rit-blocco[data-rit="registro"].aperto');
      if (t2 && !giaAperto) t2.click();
    });
    await p.waitForTimeout(700);
    ok('e nei Rituali la trovi comunque', await p.evaluate(() => !!document.getElementById('blocco-notte')));
    await ctx.close();
  }

  console.log('\nLA SERA: I PASTI E QUELLO CHE HAI FATTO SENZA SCRIVERLO');
  {
    const { ctx, p } = await apri('2026-08-25T20:30:00', 3);
    const st = await stato(p);
    ok('alle 20:30 la domanda della giornata arriva', st.aperto && st.recupero, JSON.stringify(st));
    const quali = await p.evaluate(() => [...document.querySelectorAll('[data-pasto]')].map(x => x.getAttribute('data-pasto')));
    ok('e chiede dei pasti del giorno', quali.length === 3, JSON.stringify(quali));
    await p.evaluate(() => { document.querySelector('[data-pasto="colazione"] [data-pfatto="si"]').click(); });
    await p.waitForTimeout(450);
    await p.evaluate(() => { document.querySelector('[data-pasto="pranzo"] [data-pfatto="no"]').click(); });
    await p.waitForTimeout(450);
    const pasti = await p.evaluate(() => (LM.load().ritmoGiorno[LM.todayKey()].pasti || [])
      .map(x => ({ id: x.id, f: x.fatto, ora: x.ora })));
    ok('«sì» registra il pasto all’ora prevista',
      pasti[0].f === true && pasti[0].ora === '08:00', JSON.stringify(pasti[0]));
    /* «no» è un dato, non un buco */
    ok('«no» lo registra come saltato', pasti[1].f === false, JSON.stringify(pasti[1]));
    ok('e quello a cui non hai risposto resta senza risposta', pasti[2].f === undefined, JSON.stringify(pasti[2]));
    /* la risposta si legge sotto il nome: i tre tasti non si muovono */
    const sotto = await p.evaluate(() => document.querySelector('[data-pasto="colazione"] .rec-solito').textContent);
    ok('la riga dice com’è andata', /verso le 08:00/.test(sotto), sotto);

    console.log('');
    await p.evaluate(async () => {
      const f = document.getElementById('agg-fatto');
      const i = f.querySelector('.agg-testo');
      i.value = 'Camminata di mezz’ora';
      i.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 60));
      f.querySelector('.agg-ok').click();
    });
    await p.waitForTimeout(700);
    const fatta = await p.evaluate(() => {
      const a = LM.load().azioni.filter(x => x.dopo);
      return a.length ? { testo: a[0].testo, done: a[0].done, dopo: a[0].dopo, area: a[0].areaId, data: a[0].data } : null;
    });
    ok('una cosa scritta dopo nasce già fatta', !!fatta && fatta.done === true, JSON.stringify(fatta));
    ok('e resta scritto che è stata recuperata dopo', !!fatta && fatta.dopo === true, JSON.stringify(fatta));
    /* l'area di partenza non è la prima della lista: è quella che vuol dire
       «non l'ho classificata» */
    ok('l’area di partenza è «Altro», non «Studio»', !!fatta && fatta.area === 'altro', fatta && fatta.area);
    const xp = await p.evaluate(() => LM.load().xpPerGiorno[LM.todayKey()] || 0);
    ok('gli XP li prende come una cosa fatta qualunque', xp > 0, xp + ' XP oggi');
    ok('e si vede nella lista di quello che hai recuperato',
      await p.evaluate(() => !!document.querySelector('[data-fid]')));
    /* e si toglie, con l'annulla */
    await p.evaluate(() => { document.querySelector('[data-ftogli]').click(); });
    await p.waitForTimeout(600);
    const dopoTolta = await p.evaluate(() => ({
      quante: LM.load().azioni.filter(x => x.dopo).length,
      annulla: !!document.querySelector('.toast-azione')
    }));
    ok('togliendola sparisce, e si può rimettere',
      dopoTolta.quante === 0 && dopoTolta.annulla, JSON.stringify(dopoTolta));

    await p.evaluate(() => { document.getElementById('rec-fine').click(); });
    await p.waitForTimeout(600);
    const fine = await p.evaluate(() => ({
      aperto: !document.getElementById('sheet-overlay').hidden,
      chiesto: LM.giaChiesto(LM.todayKey(), 'giorno')
    }));
    ok('«ho finito» chiude e non richiede', !fine.aperto && fine.chiesto, JSON.stringify(fine));
    await ctx.close();
  }
  {
    /* DUE POSTI, DUE REGOLE, e non è una svista.
       Il POP-UP arriva senza che nessuno l'abbia chiamato: chiede solo dei
       pasti di cui si può già parlare, perché sentirsi chiedere alle nove e
       mezza del mattino se hai cenato è la cosa più stupida che l'app possa
       fare.
       La SEZIONE nei Rituali invece è il posto dove uno VA a segnare un pasto:
       lì ci sono tutti. Una pagina che a colazione mostra una voce e a cena
       tre non è un posto, è un indovinello — e la cena di stasera la si può
       benissimo segnare a mezzogiorno, chi salta i pasti lo sa già. */
    const { ctx, p } = await apri('2026-08-25T09:30:00', 9, () => {
      const s = LM.load(); const t = LM.todayKey();
      s.ritmoGiorno[t].chiestoNotte = true;   /* la notte l'ho già raccontata */
      s.ritmoGiorno[t].chiestoGiorno = false;
      LM.save();
    });
    /* il pop-up delle nove e mezza non arriva (è roba di sera): lo si apre a
       mano, che è quello che fa il codice quando arriva la sua ora */
    await p.evaluate(() => { location.hash = '#/rituali'; }); await p.waitForTimeout(700);
    await p.evaluate(() => {
      const t2 = document.querySelector('.rit-blocco[data-rit="registro"] .rit-riga');
      const giaAperto = document.querySelector('.rit-blocco[data-rit="registro"].aperto');
      if (t2 && !giaAperto) t2.click();
    });
    await p.waitForTimeout(800);
    const nelRegistro = await p.evaluate(() => [...document.querySelectorAll('[data-pasto]')].map(x => x.getAttribute('data-pasto')));
    ok('nel registro ci sono tutti i pasti, a qualunque ora',
      nelRegistro.length === 3, JSON.stringify(nelRegistro));
    await ctx.close();
  }
  {
    /* e nel pop-up, alle nove e mezza, si parla solo della colazione */
    const { ctx, p } = await apri('2026-08-25T20:30:00', 3);
    /* il pop-up della sera è già aperto: si sposta l'orologio indietro e si
       riapre, che è l'unico modo di vedere la lista che avrebbe alle 9:30 */
    const quali = await p.evaluate(() => {
      const r = LM.ritmoDi(LM.todayKey());
      const ora = 9 * 60 + 30;
      return (r.pasti || []).filter((pa) => LM.minutiDaOra(pa.ora) <= ora + 30).map((pa) => pa.id);
    });
    ok('alle 9:30 il pop-up parla solo della colazione', JSON.stringify(quali) === '["colazione"]', JSON.stringify(quali));
    await ctx.close();
  }

  console.log('\nUN PASTO SALTATO SI VEDE NELLA GIORNATA');
  {
    const { ctx, p } = await apri('2026-08-25T20:30:00', 3);
    await p.evaluate(() => { document.getElementById('sheet-chiudi').click(); });
    await p.waitForTimeout(400);
    await p.evaluate(() => { LM.registraPasto(LM.todayKey(), 'pranzo', { fatto: false }); });
    await p.evaluate(() => { location.hash = '#/giornata'; });
    await p.waitForTimeout(900);
    const blk = await p.evaluate(() => {
      const e = [...document.querySelectorAll('.tl-blk-pasto')].find(x => /Pranzo/.test(x.textContent));
      if (!e) return null;
      const s = getComputedStyle(e);
      return { saltato: e.classList.contains('saltato'), opacita: s.opacity,
        barrato: getComputedStyle(e.querySelector('.tl-blk-t')).textDecorationLine };
    });
    ok('il blocco del pranzo resta al suo posto, sbiadito e barrato',
      !!blk && blk.saltato && +blk.opacita < 1 && /line-through/.test(blk.barrato), JSON.stringify(blk));
    await ctx.close();
  }

  console.log('');
  ok('nessun errore JS', err.length === 0, err.slice(0, 3).join(' | '));
  console.log(fail ? '\n>>> ' + fail + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();
