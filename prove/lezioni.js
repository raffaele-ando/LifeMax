/* COSA FUNZIONA PER ME: le righe che scrivi senza fare un esperimento.

   Nasce da «aggiungi una funzione dove senza aver fatto un esperimento posso
   dire cosa funziona e cosa no». Il pericolo di una cosa così è che diventi un
   cimitero: si scrivono dieci righe, non le rivede nessuno, e fra un mese non
   sono né dati né ricordi. Perciò questa prova non guarda solo che il campo
   salvi: guarda i tre punti in cui quelle righe devono ENTRARE e USCIRE.

   1. Si scrive in una riga sola, e finisce nel mucchio giusto.
   2. Si gira: una cosa che funzionava smette di funzionare, e la riga si
      sposta senza che si debba cancellare e riscrivere.
   3. Come fai a saperlo resta scritto accanto, e si cambia con un tocco.
   4. La review della sera e quella della settimana le sanno tenere: è là che
      l'insegnamento è fresco e già battuto a macchina.
   5. Un esperimento che finisce aggiorna LA SUA riga invece di scriverne una
      seconda uguale, e la riga dice che quella l'hai misurata.
   6. Dalla riga si parte per l'esperimento, col modulo già scritto.

   node prove/lezioni.js        (CHROMIUM=/percorso/di/chrome se serve)  */
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
  await new Promise(r => srv.listen(8757, r));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  const p = await b.newPage({ viewport: { width: 390, height: 900 }, hasTouch: true, isMobile: true });
  const err = []; p.on('pageerror', e => err.push('' + e));
  await p.goto('http://localhost:8757/index.html'); await p.waitForTimeout(400);
  await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  await p.reload(); await p.waitForTimeout(700);

  const allaPagina = async () => {
    await p.evaluate(() => { location.hash = '#/esperimenti'; });
    await p.waitForTimeout(700);
  };
  /* la pagina ha due sezioni e se ne vede una per volta: chi cerca il registro
     o gli esperimenti deve dire quale */
  const sezione = async (quale) => {
    await p.evaluate((q) => {
      const b = document.querySelector('#sez-scoperte [data-scop="' + q + '"]');
      if (b) b.click();
    }, quale);
    await p.waitForTimeout(500);
  };
  const conta = () => p.evaluate(() => ({
    si: LM.lezioni('si').length, no: LM.lezioni('no').length,
    righeSi: document.querySelectorAll('.lez-riga .lez-si').length,
    righeNo: document.querySelectorAll('.lez-riga .lez-no').length
  }));

  console.log('LA PAGINA: prima quello che hai capito, poi gli esperimenti');
  await allaPagina();
  const c0 = await conta();
  ok('le righe della demo si vedono, divise nei due mucchi', c0.righeSi > 0 && c0.righeNo > 0,
    JSON.stringify(c0));
  ok('e in pagina ce ne sono tante quante nei dati', c0.righeSi === c0.si && c0.righeNo === c0.no,
    JSON.stringify(c0));
  /* DUE SEZIONI, E SI VEDE UNA PER VOLTA.
     Prima stavano una sopra l'altra, il registro in cima perché è la cosa che
     si usa ogni giorno. Con sei righe andava bene; con quaranta, per arrivare
     agli esperimenti bisognava scorrere davanti a tutto quello che si sa già —
     e la strada si allungava proprio per chi usa il registro di più. Quindi
     quello che si controlla è che la lunghezza del registro NON sposti gli
     esperimenti: la linguetta sta dove sta, qualunque cosa ci sia dentro. */
  const dueSezioni = await p.evaluate(() => {
    const bar = document.getElementById('sez-scoperte');
    return bar ? {
      quante: bar.querySelectorAll('[data-scop]').length,
      aperta: (bar.querySelector('.attivo') || {}).getAttribute
        ? bar.querySelector('.attivo').getAttribute('data-scop') : null,
      registro: !!document.querySelector('.lez-card'),
      esperimenti: !!document.getElementById('lista-exp')
    } : null;
  });
  ok('la pagina ha due sezioni e si apre sul registro',
    !!dueSezioni && dueSezioni.quante === 2 && dueSezioni.aperta === 'registro' &&
    dueSezioni.registro && !dueSezioni.esperimenti, JSON.stringify(dueSezioni));
  const quantoLontano = async () => p.evaluate(() => {
    const b = document.querySelector('#sez-scoperte [data-scop="esperimenti"]');
    return b ? Math.round(b.getBoundingClientRect().top) : null;
  });
  const lontanoPrima = await quantoLontano();
  await p.evaluate(() => {
    /* venti righe in più nel registro: la porta degli esperimenti non si deve
       spostare di un pixel */
    for (let i = 0; i < 20; i++) LM.aggiungiLezione('Riga di prova numero ' + i, 'si', { forza: 'notato' });
  });
  await allaPagina();
  const lontanoDopo = await quantoLontano();
  ok('e venti righe nel registro non allontanano gli esperimenti',
    lontanoPrima !== null && lontanoPrima === lontanoDopo, lontanoPrima + ' → ' + lontanoDopo);
  await p.evaluate(() => {
    LM.load().lezioni.filter(l => /^Riga di prova numero /.test(l.testo)).forEach(l => LM.rimuoviLezione(l.id));
  });
  await allaPagina();
  await sezione('esperimenti');
  const soloExp = await p.evaluate(() => ({
    registro: !!document.querySelector('.lez-card'), esperimenti: !!document.getElementById('lista-exp')
  }));
  ok('e la linguetta «Esperimenti» mostra solo quelli',
    soloExp.esperimenti && !soloExp.registro, JSON.stringify(soloExp));
  await sezione('registro');

  console.log('\nSI SCRIVE IN UNA RIGA, E FINISCE NEL MUCCHIO GIUSTO');
  const scrivi = async (testo, verso) => {
    await p.evaluate(async (arg) => {
      const f = document.getElementById('agg-lez');
      const inp = f.querySelector('.agg-testo');
      inp.value = arg.testo;
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 50));
      if (arg.verso === 'no') {
        const b2 = f.querySelector('.lez-scelta-verso [data-verso="no"]');
        if (b2) b2.click();
      }
      f.querySelector('.agg-ok').click();
    }, { testo: testo, verso: verso });
    await p.waitForTimeout(500);
  };
  await scrivi('Prova: alzarmi e fare il letto subito', 'si');
  /* la lista è ordinata per quanto è solida una riga, non per data: la riga
     appena scritta non è la prima. Si cerca per testo. */
  const trovaPerTesto = (frase) => p.evaluate((f) => {
    const l = LM.load().lezioni.find(x => x.testo.indexOf(f) >= 0);
    return l ? { id: l.id, testo: l.testo, verso: l.verso, forza: l.forza } : null;
  }, frase);
  let st = await trovaPerTesto('fare il letto');
  ok('scritta una riga, sta fra quelle che funzionano', !!st && st.verso === 'si', JSON.stringify(st));
  /* la forza di partenza è la più debole: è quello che è, una cosa notata */
  ok('e parte da «notato una volta», non da un’affermazione', !!st && st.forza === 'notato', st && st.forza);
  const c1 = await conta();
  ok('la lista in pagina si è aggiornata da sé', c1.righeSi === c0.righeSi + 1, JSON.stringify(c1));

  await scrivi('Prova: rispondere ai messaggi appena arrivano', 'no');
  const cNo = await trovaPerTesto('rispondere ai messaggi');
  ok('la scelta «non mi funziona» manda la riga nell’altro mucchio',
    !!cNo && cNo.verso === 'no', JSON.stringify(cNo));

  console.log('\nSI GIRA: una cosa che funzionava smette di funzionare');
  const idGira = (await trovaPerTesto('fare il letto')).id;
  await p.evaluate((id) => { document.querySelector('[data-lezgira="' + id + '"]').click(); }, idGira);
  await p.waitForTimeout(500);
  const dopoGiro = await p.evaluate((id) => {
    const l = LM.trovaLezione(id);
    return { verso: l.verso, inPagina: !!document.querySelector('[data-lid="' + id + '"] .lez-no') };
  }, idGira);
  ok('il tasto a sinistra sposta la riga nell’altro mucchio', dopoGiro.verso === 'no', JSON.stringify(dopoGiro));
  ok('e la riga in pagina cambia segno', dopoGiro.inPagina === true, JSON.stringify(dopoGiro));
  /* girare non perde niente: il testo è lo stesso, non si è cancellato e
     riscritto */
  const testoDopo = await p.evaluate((id) => LM.trovaLezione(id).testo, idGira);
  ok('girando non si perde il testo', /fare il letto/.test(testoDopo), testoDopo);

  console.log('\nLA SCHEDA: come fai a saperlo, area, verso, e si toglie');
  await p.evaluate((id) => { document.querySelector('[data-lezapri="' + id + '"]').click(); }, idGira);
  await p.waitForTimeout(600);
  const schedaC = await p.evaluate(() => ({
    aperta: !document.getElementById('sheet-overlay').hidden,
    forze: document.querySelectorAll('#sheet-corpo [data-forza]').length,
    versi: document.querySelectorAll('#sheet-corpo [data-verso]').length,
    area: !!document.getElementById('lez-area'),
    testo: !!document.getElementById('lez-testo')
  }));
  ok('la scheda si apre con tutto quello che c’è da sistemare',
    schedaC.aperta && schedaC.forze === 3 && schedaC.versi === 2 && schedaC.area && schedaC.testo,
    JSON.stringify(schedaC));
  await p.evaluate(() => { document.querySelector('#sheet-corpo [data-forza="ripetuto"]').click(); });
  await p.waitForTimeout(400);
  const forzaDopo = await p.evaluate((id) => ({
    forza: LM.trovaLezione(id).forza,
    scelto: !!document.querySelector('#sheet-corpo [data-forza="ripetuto"].on')
  }), idGira);
  ok('«lo noto ogni volta» si sceglie con un tocco, e resta scelto',
    forzaDopo.forza === 'ripetuto' && forzaDopo.scelto, JSON.stringify(forzaDopo));
  const sottoRiga = await p.evaluate((id) => {
    const r = document.querySelector('[data-lid="' + id + '"] .lista-sub');
    return r ? r.textContent.trim() : null;
  }, idGira);
  ok('e la riga lo dice a chi scorre la lista', /ogni volta/.test(sottoRiga || ''), sottoRiga);

  await p.evaluate(() => { document.getElementById('lez-del').click(); });
  await p.waitForTimeout(500);
  const dopoTolta = await p.evaluate((id) => ({
    c: !!LM.trovaLezione(id),
    annulla: !!document.querySelector('.toast-azione')
  }), idGira);
  ok('la riga si toglie', dopoTolta.c === false, JSON.stringify(dopoTolta));
  ok('e si può rimettere: il messaggio porta l’annulla', dopoTolta.annulla === true, JSON.stringify(dopoTolta));
  await p.evaluate(() => { document.querySelector('.toast-azione').click(); });
  await p.waitForTimeout(500);
  ok('annullando torna dov’era', await p.evaluate((id) => !!LM.trovaLezione(id), idGira));

  console.log('\nLA REVIEW DELLA SERA LA SA TENERE');
  await p.evaluate(() => { location.hash = '#/rituali'; }); await p.waitForTimeout(700);
  /* i rituali sono blocchi che si aprono: la sera è uno di quelli */
  await p.evaluate(() => {
    const t = document.querySelector('.rit-blocco[data-rit="sera"] .rit-riga');
    const giaAperto = document.querySelector('.rit-blocco[data-rit="sera"].aperto');
    if (t && !giaAperto) t.click();
  });
  await p.waitForTimeout(800);
  const tastoNascosto = await p.evaluate(() => {
    const b2 = document.getElementById('sera-vitt-lez');
    return b2 ? b2.hidden : null;
  });
  ok('col campo vuoto il tasto non c’è', tastoNascosto === true, 'hidden: ' + tastoNascosto);
  await p.evaluate(() => {
    const i = document.getElementById('sera-vittoria');
    i.value = 'Prova: studiato col telefono in cucina';
    i.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await p.waitForTimeout(200);
  ok('appena scrivi, compare', await p.evaluate(() => !document.getElementById('sera-vitt-lez').hidden));
  await p.evaluate(() => { document.getElementById('sera-vitt-lez').click(); });
  await p.waitForTimeout(400);
  const tenuta = await p.evaluate(() => ({
    c: LM.lezioni('si').some(l => /telefono in cucina/.test(l.testo)),
    campo: document.getElementById('sera-vittoria').value,
    tastoVia: document.getElementById('sera-vitt-lez').hidden
  }));
  ok('la riga della sera diventa una cosa che ti funziona', tenuta.c === true, JSON.stringify(tenuta));
  /* il campo NON si svuota: la review racconta quel giorno, la riga è quello
     che ne hai imparato — sono due cose diverse */
  ok('e la review resta scritta com’era', /telefono in cucina/.test(tenuta.campo), tenuta.campo);
  ok('il tasto si spegne, così non promette due volte la stessa cosa', tenuta.tastoVia === true);

  console.log('\nUN ESPERIMENTO CHE FINISCE AGGIORNA LA SUA RIGA');
  await allaPagina();
  await sezione('esperimenti');
  const primoClic = await p.evaluate(() => {
    const b2 = document.querySelector('[data-expsalva]');
    if (!b2) return null;
    const prima = LM.load().lezioni.length;
    b2.click();
    return prima;
  });
  await p.waitForTimeout(600);
  const esito1 = await p.evaluate(() => {
    const mis = LM.load().lezioni.filter(l => l.forza === 'misurato' && l.espId);
    return { quante: LM.load().lezioni.length, misurate: mis.length, testo: mis[0] ? mis[0].testo : null };
  });
  ok('il verdetto diventa una riga, con scritto che l’hai misurata',
    primoClic !== null && esito1.quante === primoClic + 1 && esito1.misurate >= 1, JSON.stringify(esito1));
  await allaPagina();
  await sezione('esperimenti');
  const testoTasto = await p.evaluate(() => {
    const b2 = document.querySelector('[data-expsalva]');
    return b2 ? b2.textContent.trim() : null;
  });
  ok('la seconda volta il tasto dice «aggiorna», non «salva»',
    /[Aa]ggiorna/.test(testoTasto || ''), testoTasto);
  const prima2 = await p.evaluate(() => LM.load().lezioni.length);
  await p.evaluate(() => { document.querySelector('[data-expsalva]').click(); });
  await p.waitForTimeout(600);
  const dopo2 = await p.evaluate(() => LM.load().lezioni.length);
  ok('e non scrive una seconda riga uguale', dopo2 === prima2, prima2 + ' → ' + dopo2);

  console.log('\nDALLA RIGA SI PARTE PER L’ESPERIMENTO');
  await allaPagina();
  await sezione('registro');
  const idPer = (await trovaPerTesto('biblioteca')).id;
  await p.evaluate((id) => { document.querySelector('[data-lezapri="' + id + '"]').click(); }, idPer);
  await p.waitForTimeout(600);
  await p.evaluate(() => { document.getElementById('lez-esp').click(); });
  await p.waitForTimeout(800);
  const form = await p.evaluate(() => {
    const n = document.getElementById('exp-nome'), i = document.getElementById('exp-int');
    return { c: !!n, nome: n ? n.value : '', int: i ? i.value : '' };
  });
  const testoPer = await p.evaluate((id) => LM.trovaLezione(id).testo, idPer);
  ok('il modulo si apre già scritto con la riga di partenza',
    form.c && form.int === testoPer && form.nome.indexOf(testoPer) >= 0, JSON.stringify(form));
  await p.evaluate(() => { document.getElementById('exp-crea').click(); });
  await p.waitForTimeout(700);
  const legame = await p.evaluate((id) => {
    const e = LM.load().esperimenti.find(x => x.lezioneId === id);
    return e ? e.nome : null;
  }, idPer);
  ok('e l’esperimento si ricorda da quale riga è nato', !!legame, legame);

  console.log('\nIL MODULO NON SI PERDE SE LA PAGINA SI RIDISEGNA');
  /* e ci si apre da sé sulla sezione giusta: il modulo vive fra gli
     esperimenti, e chi stava scrivendo non deve ritrovarsi sul registro */
  /* La pagina si ridisegna da sé: quando arriva la risposta dell'account,
     quando il cloud porta un aggiornamento, quando la rete cade. Il modulo
     stava solo nel DOM, quindi chi aveva scritto mezza domanda se la vedeva
     sparire senza aver toccato niente — e lo stesso capitava al modulo aperto
     da una riga imparata. Qui si forza il ridisegno con l'evento vero. */
  await allaPagina();
  await sezione('esperimenti');
  await p.evaluate(() => { document.getElementById('btn-nuovo-exp').click(); });
  await p.waitForTimeout(400);
  await p.evaluate(() => {
    const n = document.getElementById('exp-nome');
    n.value = 'Prova: mezza domanda scritta';
    n.dispatchEvent(new Event('input', { bubbles: true }));
    const d = document.getElementById('exp-durata');
    d.value = '7-14';
    d.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await p.waitForTimeout(200);
  await p.evaluate(() => { window.dispatchEvent(new CustomEvent('lm:auth')); });
  await p.waitForTimeout(500);
  const dopoRidisegno = await p.evaluate(() => {
    const n = document.getElementById('exp-nome'), d = document.getElementById('exp-durata');
    return { c: !!n, nome: n ? n.value : null, durata: d ? d.value : null };
  });
  ok('quello che avevi scritto è ancora lì',
    dopoRidisegno.c && dopoRidisegno.nome === 'Prova: mezza domanda scritta', JSON.stringify(dopoRidisegno));
  ok('e anche le scelte fatte nei menù', dopoRidisegno.durata === '7-14', JSON.stringify(dopoRidisegno));
  await p.evaluate(() => { document.getElementById('exp-annulla').click(); });
  await p.waitForTimeout(300);
  await p.evaluate(() => { window.dispatchEvent(new CustomEvent('lm:auth')); });
  await p.waitForTimeout(500);
  ok('e chiudendolo resta chiuso', await p.evaluate(() => !document.getElementById('exp-nome')));

  console.log('\nI CONTI TORNANO');
  const salvate = await p.evaluate(() => {
    const raw = JSON.parse(localStorage.getItem('lifemax.v2') || '{}');
    return Array.isArray(raw.lezioni) ? raw.lezioni.length : -1;
  });
  const inMemoria = await p.evaluate(() => LM.load().lezioni.length);
  ok('le righe stanno nel salvataggio, non solo in pagina', salvate === inMemoria,
    salvate + ' salvate · ' + inMemoria + ' in memoria');
  const nelDiario = await p.evaluate(() => LM.load().registro.filter(r => /^lezione-/.test(r.cat)).length);
  ok('e ognuna lascia una riga nel diario', nelDiario > 0, nelDiario + ' righe');

  ok('nessun errore JS', err.length === 0, err.slice(0, 3).join(' | '));
  console.log(fail ? '\n>>> ' + fail + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();
