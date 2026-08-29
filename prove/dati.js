/* NIENTE VA PERSO. MAI.

   Questa prova esiste per un fatto: il registro delle Scoperte di un utente si
   è svuotato da solo, e i dati c'erano stati per giorni. La causa non era in
   quella schermata — le scoperte si tolgono solo a mano — era nella
   sincronizzazione: due dispositivi si scambiavano il documento INTERO e
   vinceva il più recente. L'unica protezione era «non adottare mai un
   documento vuoto», e non basta. Basta che una copia sia più povera in UN
   punto — un telefono con zero scoperte perché quelle scoperte sono nate
   mentre lui era offline — e alla prima cosa fatta su quel telefono il suo
   documento diventa il più recente, sale nel cloud, e le scoperte spariscono
   da tutte le parti. Il conto totale degli elementi restava alto, quindi la
   protezione contro il vuoto non scattava mai.

   LA PARTE CHE CONTA DI PIÙ NON È IL CONTROLLO: È CHE NON SI POSSA
   DIMENTICARE. Un campo nuovo dello stato, aggiunto fra sei mesi da chiunque,
   deve rompere questa prova finché non gli si dice come si unisce. Perciò
   quasi tutti i controlli qui sotto sono GENERICI sulla forma dei dati: non
   nominano «lezioni» o «abitudini», girano su `LM.statoVuoto()` e pretendono
   che ogni campo sia coperto.

   LE COSE CHE CERCA
   1. ogni campo dello stato ha una regola di fusione dichiarata
   2. quello che si salva si rilegge identico (andata e ritorno)
   3. unire due copie non perde NIENTE, campo per campo, generato in automatico
   4. il caso vero: un dispositivo con le scoperte e uno senza
   5. le spunte delle abitudini messe su due dispositivi si sommano
   6. una riga cancellata davvero non torna viva
   7. «Azzera tutto» funziona lo stesso (è l'unica cosa che può togliere)
   8. un salvataggio illeggibile non viene buttato via
   9. ogni cosa che si fa NELL'APP sopravvive a un ricaricamento
  10. ogni elenco dello stato è coperto da almeno una cosa fatta nell'app

   node prove/dati.js        (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const PORTA = 8829;
let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

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
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  const errori = [];
  p.on('pageerror', (e) => errori.push(String(e).split('\n')[0]));
  await p.goto('http://localhost:' + PORTA + '/index.html');
  await p.waitForTimeout(400);

  /* ============ 1. ogni campo ha una regola ============ */
  console.log('OGNI CAMPO DELLO STATO SA COME SI UNISCE');
  {
    const r = await p.evaluate(() => {
      const vuoto = LM.statoVuoto(), regole = LM.COME_UNIRE;
      const senza = Object.keys(vuoto).filter((k) => !regole[k]);
      const avanzo = Object.keys(regole).filter((k) => !(k in vuoto));
      return { senza, avanzo, quanti: Object.keys(vuoto).length };
    });
    ok('tutti i ' + r.quanti + ' campi sono nominati in COME_UNIRE', r.senza.length === 0,
      r.senza.length ? 'SENZA REGOLA: ' + r.senza.join(', ') + ' — aggiungila in assets/data.js' : 'nessuno scoperto');
    /* e il contrario: una regola per un campo che non esiste più è una regola
       che nessuno rilegge, e domani mente */
    ok('e nessuna regola parla di un campo che non c’è più', r.avanzo.length === 0,
      r.avanzo.length ? 'da togliere: ' + r.avanzo.join(', ') : 'nessuna');
  }

  /* ============ 2. andata e ritorno ============ */
  console.log('\nQUELLO CHE SI SALVA SI RILEGGE IDENTICO');
  {
    await p.evaluate(() => { localStorage.clear(); });
    await p.reload(); await p.waitForTimeout(500);
    await p.evaluate(() => { LM.seedDemo(); });
    const r = await p.evaluate(() => {
      const prima = JSON.stringify(LM.snapshot());
      const grezzo = localStorage.getItem('lifemax.v2');
      return { prima: prima, grezzo: grezzo };
    });
    await p.reload(); await p.waitForTimeout(600);
    const dopo = await p.evaluate(() => JSON.stringify(LM.snapshot()));
    /* `updatedAt` cambia a ogni salvataggio: si toglie da tutti e due */
    /* si confronta CAMPO PER CAMPO e si dice quale non torna: «due lunghezze
       diverse» costringe a indovinare, e indovinare su un difetto di
       salvataggio è il modo di non trovarlo mai */
    const diversi = await p.evaluate(([a, c]) => {
      const A = JSON.parse(a), C = JSON.parse(c), fuori = [];
      const chiavi = {};
      Object.keys(A).forEach((k) => { chiavi[k] = 1; });
      Object.keys(C).forEach((k) => { chiavi[k] = 1; });
      Object.keys(chiavi).forEach((k) => {
        /* due campi cambiano APPOSTA a ogni apertura, e non sono un
           salvataggio che perde: l'orologio dell'ultimo salvataggio, e
           «l'ultima volta che ti ho visto» — che serve a capire se fra ieri e
           oggi c'è stata una notte */
        if (k === 'updatedAt' || k === 'visto') return;
        const x = JSON.stringify(A[k]), y = JSON.stringify(C[k]);
        if (x !== y) fuori.push(k + ' (' + String(x).length + ' → ' + String(y).length + ')');
      });
      return fuori;
    }, [r.prima, dopo]);
    ok('dopo un ricaricamento lo stato è lo stesso, campo per campo', diversi.length === 0,
      diversi.length ? 'CAMBIATI: ' + diversi.join(' | ') : 'identico, ' + dopo.length + ' caratteri');
  }

  /* ============ 3. unire non perde niente, e il caso lo costruisce da sé ====
     Non si scrivono a mano due stati di prova: si prende lo stato vuoto e si
     mette una riga DIVERSA in ogni elenco e in ogni dizionario, una serie per
     il dispositivo A e una per il B. Un campo aggiunto domani entra da solo in
     questo controllo. */
  console.log('\nUNIRE DUE COPIE NON PERDE NIENTE');
  {
    const r = await p.evaluate(() => {
      const regole = LM.COME_UNIRE;
      const ora = Date.now();
      const finto = (segno) => {
        const s = LM.statoVuoto();
        s.updatedAt = segno === 'A' ? ora - 1000 : ora;
        Object.keys(regole).forEach((k) => {
          const modo = regole[k];
          if (modo === 'elenco') {
            if (!Array.isArray(s[k])) s[k] = [];
            const q = segno === 'A' ? ora - 1000 : ora;
            s[k].push({ id: 'prova-' + segno + '-' + k, testo: 'riga di ' + segno, creata: q, ts: q });
          } else if (modo === 'mappa') {
            if (!s[k] || typeof s[k] !== 'object') s[k] = {};
            s[k]['giorno-' + segno] = { v: segno };
          } else if (modo === 'insieme') {
            if (!Array.isArray(s[k])) s[k] = [];
            s[k].push('solo-di-' + segno);
          }
        });
        return s;
      };
      const A = finto('A'), B = finto('B');
      const u = LM.unisci(A, B);
      const persi = [];
      [['A', A], ['B', B]].forEach(([segno, src]) => {
        Object.keys(regole).forEach((k) => {
          const modo = regole[k];
          if (modo === 'elenco') {
            const cerco = 'prova-' + segno + '-' + k;
            if (!(u[k] || []).some((x) => x && x.id === cerco)) persi.push(k + ' (riga di ' + segno + ')');
          } else if (modo === 'mappa') {
            if (!u[k] || !u[k]['giorno-' + segno]) persi.push(k + ' (chiave di ' + segno + ')');
          } else if (modo === 'insieme') {
            if (!(u[k] || []).includes('solo-di-' + segno)) persi.push(k + ' (voce di ' + segno + ')');
          }
        });
      });
      /* e nessun doppione: unire due copie IDENTICHE non deve raddoppiare niente */
      const uu = LM.unisci(A, JSON.parse(JSON.stringify(A)));
      const doppi = Object.keys(regole).filter((k) => regole[k] === 'elenco' &&
        Array.isArray(uu[k]) && Array.isArray(A[k]) && uu[k].length !== A[k].length);
      return { persi, doppi, campi: Object.keys(regole).length };
    });
    ok('niente si perde, su tutti i ' + r.campi + ' campi', r.persi.length === 0,
      r.persi.length ? 'PERSI: ' + r.persi.join(' | ') : 'ogni riga e ogni chiave dei due lati è nel risultato');
    ok('e unire due copie uguali non raddoppia niente', r.doppi.length === 0,
      r.doppi.length ? 'raddoppiati: ' + r.doppi.join(', ') : 'nessun doppione');
  }

  /* ============ 4. il caso vero, quello che è successo ============ */
  console.log('\nIL CASO VERO: UN DISPOSITIVO CON LE SCOPERTE E UNO SENZA');
  {
    const r = await p.evaluate(() => {
      const iPad = LM.statoVuoto();
      iPad.updatedAt = 1000;
      iPad.lezioni = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: 'lez' + n, testo: 'scoperta ' + n, verso: 'si', creata: 900, aggiornata: 900 }));
      iPad.azioni = [{ id: 'a1', testo: 'una cosa', data: '2026-08-20', creata: 900 }];
      /* il telefono: nessuna scoperta, ma tante azioni e un salvataggio più
         recente — è esattamente la forma che aveva il documento che ha
         cancellato tutto */
      const tel = LM.statoVuoto();
      tel.updatedAt = 2000;
      tel.lezioni = [];
      tel.azioni = [];
      for (var i = 0; i < 40; i++) tel.azioni.push({ id: 'b' + i, testo: 'azione ' + i, data: '2026-08-27', creata: 1900 });
      const u = LM.unisci(iPad, tel);
      return { lezioni: u.lezioni.length, azioni: u.azioni.length, ricchezza: LM.ricchezza(u) };
    });
    ok('le otto scoperte sopravvivono al telefono che non le aveva', r.lezioni === 8,
      r.lezioni + ' scoperte dopo la fusione (prima del rimedio ne restavano 0)');
    ok('e le azioni dei due dispositivi si sommano', r.azioni === 41, r.azioni + ' azioni (1 + 40)');
  }

  /* ============ 5. le spunte di un’abitudine si sommano ============ */
  console.log('\nLE SPUNTE MESSE SU DUE DISPOSITIVI SI SOMMANO');
  {
    const r = await p.evaluate(() => {
      const A = LM.statoVuoto(); A.updatedAt = 1000;
      A.abitudini = [{ id: 'h1', testo: 'leggere', creata: 500, fatti: { '2026-08-01': true, '2026-08-02': true } }];
      const B = LM.statoVuoto(); B.updatedAt = 2000;
      B.abitudini = [{ id: 'h1', testo: 'leggere', creata: 500, fatti: { '2026-08-03': true } }];
      const u = LM.unisci(A, B);
      return Object.keys(u.abitudini[0].fatti).sort();
    });
    ok('tre giorni spuntati, non uno', r.length === 3, r.join(' · '));
  }

  /* ============ 6. una cancellazione vera resta cancellata ============ */
  console.log('\nUNA RIGA CANCELLATA DAVVERO NON TORNA VIVA');
  {
    await p.evaluate(() => { localStorage.clear(); });
    await p.reload(); await p.waitForTimeout(500);
    const r = await p.evaluate(async () => {
      LM.registraLezione ? 0 : 0;
      const l = LM.aggiungiLezione('una cosa che funziona', 'si', {});
      const copiaVecchia = JSON.parse(JSON.stringify(LM.snapshot()));   /* la copia che sta sull'altro dispositivo */
      LM.rimuoviLezione(l.id);
      const dopo = LM.snapshot();
      const lapidi = (dopo.cancellati || []).length;
      /* adesso arriva il vecchio dispositivo, che quella riga ce l'ha ancora */
      const u = LM.unisci(dopo, copiaVecchia);
      return { lapidi: lapidi, restano: (u.lezioni || []).length };
    });
    ok('la cancellazione ha lasciato la sua lapide', r.lapidi > 0, r.lapidi + ' lapidi');
    ok('e la riga non torna viva quando arriva la copia vecchia', r.restano === 0,
      r.restano + ' scoperte dopo la fusione');
  }

  /* ============ 7. azzerare funziona lo stesso ============ */
  console.log('\n«AZZERA TUTTO» FUNZIONA LO STESSO');
  {
    const r = await p.evaluate(() => {
      const pieno = LM.statoVuoto(); pieno.updatedAt = 1000;
      pieno.azioni = [{ id: 'x1', testo: 'vecchia', creata: 500 }];
      pieno.lezioni = [{ id: 'l1', testo: 'vecchia', creata: 500 }];
      const azzerato = LM.statoVuoto();
      azzerato.updatedAt = 2000; azzerato.azzerato = 1500;
      const u = LM.unisci(azzerato, pieno);
      /* e una cosa scritta DOPO l'azzeramento resta */
      const nuovo = LM.statoVuoto(); nuovo.updatedAt = 3000;
      nuovo.azioni = [{ id: 'x2', testo: 'nuova', creata: 2500 }];
      const u2 = LM.unisci(u, nuovo);
      return { dopoAzzeramento: u.azioni.length + u.lezioni.length, poi: u2.azioni.length };
    });
    ok('quello che c’era prima dell’azzeramento non torna', r.dopoAzzeramento === 0,
      r.dopoAzzeramento + ' righe vecchie rimaste');
    ok('e quello scritto dopo resta', r.poi === 1, r.poi + ' righe nuove');
  }

  /* ============ 8. un salvataggio illeggibile non si butta ============ */
  console.log('\nUN SALVATAGGIO ILLEGGIBILE NON SI BUTTA VIA');
  {
    await p.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('lifemax.v2', '{"azioni":[{"id":"a1"} ROTTO');
    });
    await p.reload(); await p.waitForTimeout(600);
    const r = await p.evaluate(() => {
      /* si fa fare un salvataggio, che è il momento in cui prima si perdeva tutto */
      LM.cattura('una cosa qualunque');
      const recuperi = LM.recuperi();
      return { quanti: recuperi.length, contiene: recuperi.some((x) => /ROTTO/.test(x.testo || '')) };
    });
    ok('il testo che non si legge è messo da parte, non buttato', r.quanti > 0 && r.contiene,
      r.quanti + ' pezzi messi da parte' + (r.contiene ? ', e c’è dentro quello rotto' : ', ma non è quello giusto'));
  }

  /* ============ 9. quello che si fa NELL’APP resta ============ */
  console.log('\nQUELLO CHE SI FA NELL’APP SOPRAVVIVE A UN RICARICAMENTO');
  await p.evaluate(() => { localStorage.clear(); });
  await p.reload(); await p.waitForTimeout(600);
  /* si passa dall'onboarding: la prova vuole misurare i salvataggi, non
     l'accoglienza */
  await p.evaluate(() => { LM.seedDemo(); });
  await p.reload(); await p.waitForTimeout(700);

  const COSE = [
    { nome: 'una cattura', dove: 'oggi', campo: 'inbox',
      fai: () => LM.cattura('PROVA cattura') },
    { nome: 'un’azione per oggi', dove: 'oggi', campo: 'azioni',
      fai: () => LM.aggiungiAzione('PROVA azione', null, {}) },
    { nome: 'una cosa da fare', dove: 'inbox', campo: 'backlog',
      fai: () => LM.aggiungiBacklog('PROVA backlog', null, {}) },
    { nome: 'un’abitudine', dove: 'inbox', campo: 'abitudini',
      fai: () => LM.aggiungiAbitudine('PROVA abitudine', null, [1, 2, 3], {}) },
    { nome: 'una scoperta', dove: 'scoperte', campo: 'lezioni',
      fai: () => LM.aggiungiLezione('PROVA scoperta', 'si', {}) },
    { nome: 'un check-in', dove: 'oggi', campo: 'checkins',
      fai: () => LM.registraCheckin(3, 3, 3, 'PROVA') },
    { nome: 'la review della sera', dove: 'rituali', campo: 'reviewSera',
      fai: () => LM.salvaReviewSera({ vittoria: 'PROVA sera', blocco: '', shutdown: true }) },
    { nome: 'il sonno di stanotte', dove: 'rituali', campo: 'ritmoGiorno',
      fai: () => LM.registraNotte(LM.todayKey(), { sonno: '23:10', sveglia: '07:20', prec: 'preciso' }) },
    { nome: 'un esperimento', dove: 'scoperte', campo: 'esperimenti',
      fai: () => LM.creaEsperimento({ nome: 'PROVA esperimento', metrica: 'energia',
        inizioBaseline: LM.todayKey(), inizioIntervento: LM.addDays(LM.todayKey(), 7), fine: LM.addDays(LM.todayKey(), 14) }) }
  ];
  for (const c of COSE) {
    const fatto = await p.evaluate(async (src) => {
      try {
        const prima = JSON.parse(JSON.stringify(LM.snapshot()[src.campo] || null));
        // eslint-disable-next-line no-new-func
        new Function('LM', 'return (' + src.fai + ')()')(window.LM);
        const dopo = LM.snapshot()[src.campo];
        const cresciuto = Array.isArray(dopo) ? dopo.length > (prima || []).length
          : Object.keys(dopo || {}).length >= Object.keys(prima || {}).length;
        return { cresciuto: cresciuto };
      } catch (e) { return { errore: String(e).slice(0, 80) }; }
    }, { campo: c.campo, fai: c.fai.toString() });
    if (fatto.saltato) { ok(c.nome + ' — non esiste una funzione per farlo', false, 'il controllo non copre «' + c.campo + '»'); continue; }
    if (fatto.errore) { ok(c.nome, false, fatto.errore); continue; }
  }
  await p.reload(); await p.waitForTimeout(700);
  {
    const r = await p.evaluate((campi) => {
      const s = LM.snapshot();
      const mancano = [];
      const testo = JSON.stringify(s);
      ['PROVA cattura', 'PROVA azione', 'PROVA backlog', 'PROVA abitudine', 'PROVA scoperta',
       'PROVA sera', 'PROVA esperimento'].forEach((t) => { if (testo.indexOf(t) < 0) mancano.push(t); });
      if (!(s.checkins || []).some((c) => c.contesto === 'PROVA')) mancano.push('il check-in');
      const rg = s.ritmoGiorno[LM.todayKey()] || {};
      if (rg.sonno !== '23:10') mancano.push('il sonno di stanotte');
      return { mancano: mancano, campi: campi };
    }, COSE.map((c) => c.campo));
    ok('tutte e nove le cose fatte sono ancora lì dopo il ricaricamento', r.mancano.length === 0,
      r.mancano.length ? 'PERSE: ' + r.mancano.join(', ') : 'nessuna persa');
  }

  /* ============ 10. nessun elenco resta senza copertura ============
     Se domani si aggiunge un elenco allo stato e nessuno lo riempie mai in
     questa prova, il controllo qui sopra non lo guarda — e il difetto tornerebbe
     a nascondersi. Qui si pretende che ogni elenco dello stato sia o coperto
     da una delle cose fatte, o dichiarato come «legittimamente vuoto», con il
     suo perché. */
  console.log('\nNESSUN ELENCO DELLO STATO RESTA SENZA COPERTURA');
  {
    const SCUSATI = {
      log: 'deprecato, non ci scrive più nessuno',
      cancellati: 'ci scrive save() da sé, ed è provato al punto 6',
      registro: 'si riempie da sé a ogni cosa fatta, ed è nel giro di sopra',
      aree: 'nasce piena dalle aree di partenza',
      areeAttive: 'nasce piena dalle aree di partenza',
      recuperati: 'si riempie solo quando arriva un campo storto, ed è provato al punto 8',
      minuti: 'i minuti si scrivono da un timer che qui non gira',
      valutazioni: 'le valutazioni della sera si danno dal rituale, coperto da reviewSera',
      pianoMattina: 'il piano della mattina è un rituale a parte',
      reviewSettimana: 'la review della settimana si fa una volta a settimana',
      xpPerGiorno: 'si riempie da sé quando si guadagnano punti'
    };
    const r = await p.evaluate((scusati) => {
      const s = LM.snapshot(), regole = LM.COME_UNIRE;
      const scoperti = [];
      Object.keys(LM.statoVuoto()).forEach((k) => {
        if (regole[k] !== 'elenco' && regole[k] !== 'mappa') return;
        if (scusati[k]) return;
        const v = s[k];
        const pieno = Array.isArray(v) ? v.length > 0 : (v && Object.keys(v).length > 0);
        if (!pieno) scoperti.push(k);
      });
      return scoperti;
    }, SCUSATI);
    ok('ogni elenco e ogni dizionario è stato riempito da qualcosa', r.length === 0,
      r.length ? 'MAI RIEMPITI da questa prova: ' + r.join(', ') +
        ' — o si aggiunge una cosa da fare al punto 9, o si scrive perché possono restare vuoti' : 'tutti coperti');
  }

  ok('nessun errore in pagina', errori.length === 0, errori.slice(0, 3).join(' | '));
  console.log(guai ? '\n>>> ' + guai + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(guai ? 1 : 0);
})();
