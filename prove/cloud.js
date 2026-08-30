/* LA SINCRONIZZAZIONE, PROVATA SUL SERIO — CON UN FIREBASE FINTO.

   Nei registri dell'utente comparivano righe come:
     WebChannelConnection RPC 'Listen' stream 0x... transport errored
   Quel messaggio da solo è quasi sempre rumore — è Firestore che dice «il
   canale si è rotto» e se lo ripara da sé, cosa che succede a ogni cambio di
   cella e a ogni galleria. Ma guardando come l'app lo trattava è saltato fuori
   un guasto vero: la funzione degli errori di `onSnapshot` non è la notifica
   di un intoppo passeggero, è il certificato di morte dell'ascolto. Firestore
   non lo riattacca. Qui dentro faceva `console.warn` e basta, quindi al primo
   errore che arrivava fin lì il dispositivo diventava SORDO per tutta la
   sessione, in silenzio — e un dispositivo sordo si allontana dagli altri, che
   è la condizione da cui è nata la sparizione delle Scoperte.

   Come si prova una cosa così. Firebase qui non c'è e non deve esserci: una
   prova che dipende dalla rete non è una prova. Si mette in mezzo un Firebase
   FINTO — le tre librerie vengono intercettate e servite da noi — che sa fare
   tre cose: dire che c'è un utente, consegnare un documento, e ROMPERSI a
   comando. Da lì si guarda cosa fa l'app.

   E siccome il finto passa dalla stessa porta di quello vero, questa prova
   copre anche la cosa più importante: che un documento remoto più POVERO non
   cancelli quello che c'è qui. È il caso dell'utente, riprodotto per intero.

   LE COSE CHE CERCA
   1. all'accesso l'ascolto si attacca
   2. quando cade, l'app lo dice invece di tacere
   3. e si riattacca da sé, senza ricaricare la pagina
   4. l'attesa fra un tentativo e l'altro raddoppia (2, 4, 8) e riparte da
      capo solo quando arriva un dato davvero
   5. tornando sull'app (o tornando la rete) riprova subito
   6. un documento remoto più povero NON cancella niente
   7. e quello che arriva dall'altro dispositivo si aggiunge

   node prove/cloud.js        (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const PORTA = 8831;
let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

/* ---------- il Firebase finto ----------
   Tre moduli, gli stessi nomi di quelli veri, e una plancia di comando su
   `window.__fb` da cui la prova decide cosa succede. */
const FINTO_APP = `export function initializeApp() { return { finto: true }; }`;

const FINTO_AUTH = `
const B = (window.__fb = window.__fb || {});
B.utente = null; B.avvisa = null;
export function getAuth() { return { finto: true }; }
export function onAuthStateChanged(a, cb) { B.avvisa = cb; setTimeout(() => cb(B.utente), 0); return () => {}; }
export function GoogleAuthProvider() { this.setCustomParameters = () => {}; }
export const browserLocalPersistence = 'locale';
export function setPersistence() { return Promise.resolve(); }
export function signInWithPopup() { return Promise.resolve(); }
export function signInWithRedirect() { return Promise.resolve(); }
export function getRedirectResult() { return Promise.resolve(null); }
export function signOut() { B.utente = null; if (B.avvisa) B.avvisa(null); return Promise.resolve(); }
/* la prova usa questo per «accedere» */
B.entra = function (uid) { B.utente = { uid: uid || 'prova-uid', email: 'prova@esempio.it', displayName: 'Prova' }; if (B.avvisa) B.avvisa(B.utente); };
`;

const FINTO_FS = `
const B = (window.__fb = window.__fb || {});
B.doc = null;              /* il documento remoto: {data, updatedAt} */
B.scritture = [];          /* tutto quello che l'app ha mandato su */
B.attacchi = [];           /* quando l'ascolto è stato attaccato */
B.rompi = null;            /* chiamandola, l'ascolto cade */
B.consegna = null;         /* chiamandola, arriva un documento */
B.vivo = false;            /* c'è un ascolto attaccato in questo momento? */
export function getFirestore() { return { finto: true }; }
export function initializeFirestore(a, opz) { B.opzioni = opz; return { finto: true }; }
export function doc(db) { return { via: [].slice.call(arguments, 1).join('/') }; }
export function collection(db) { return { via: [].slice.call(arguments, 1).join('/') }; }
export function getDoc(ref) {
  const d = /backups/.test(ref.via) ? null : B.doc;
  return Promise.resolve({ exists: () => !!d, data: () => d, id: 'x' });
}
export function getDocs() { return Promise.resolve({ forEach: () => {} }); }
export function setDoc(ref, dati) {
  if (!/backups/.test(ref.via)) { B.doc = dati; B.scritture.push(dati); }
  return Promise.resolve();
}
export function onSnapshot(ref, suDati, suErrore) {
  B.attacchi.push(Date.now());
  B.vivo = true;
  B.rompi = function (codice) { if (!B.vivo) return false; B.vivo = false; suErrore({ code: codice || 'unavailable', message: 'canale rotto apposta' }); return true; };
  B.consegna = function (d) { if (!B.vivo) return false; B.doc = d; suDati({ exists: () => true, data: () => d }); return true; };
  return function () { B.vivo = false; };
}
`;

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
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 } });
  /* le tre librerie di Firebase non arrivano dalla rete: le serviamo noi */
  await ctx.route('https://www.gstatic.com/firebasejs/**', (route) => {
    const u = route.request().url();
    const corpo = /firebase-app/.test(u) ? FINTO_APP : /firebase-auth/.test(u) ? FINTO_AUTH : FINTO_FS;
    route.fulfill({ status: 200, contentType: 'text/javascript', body: corpo });
  });
  const p = await ctx.newPage();
  const errori = [];
  p.on('pageerror', (e) => errori.push(String(e).split('\n')[0]));
  await p.goto('http://localhost:' + PORTA + '/index.html');
  await p.bringToFront();
  await p.waitForTimeout(900);

  const vivo = await p.evaluate(() => !!(window.LMCloud && window.LMCloud.available));
  ok('il cloud finto è entrato al posto di quello vero', vivo,
    vivo ? 'LMCloud.available' : 'l’app non ha caricato nemmeno il finto');

  /* ============ 1. all’accesso l’ascolto si attacca ============ */
  console.log('\nALL’ACCESSO L’ASCOLTO SI ATTACCA');
  await p.evaluate(() => {
    LM.seedDemo();
    /* qualcosa che sta SOLO qui: è la roba che non deve sparire */
    LM.aggiungiLezione('scoperta che sta solo su questo dispositivo', 'si', {});
    window.__fb.entra('uid-prova');
  });
  await p.waitForTimeout(1200);
  {
    const r = await p.evaluate(() => ({
      attacchi: window.__fb.attacchi.length,
      ascolto: (window.LM_AUTH || {}).ascolto,
      opzioni: JSON.stringify(window.__fb.opzioni || null)
    }));
    ok('l’ascolto è attaccato una volta sola', r.attacchi === 1, r.attacchi + ' attacchi');
    ok('e l’app lo sa di essere in ascolto', r.ascolto === true, 'LM_AUTH.ascolto = ' + r.ascolto);
    ok('e Firestore è avviato col canale lungo dichiarato',
      /experimentalAutoDetectLongPolling/.test(r.opzioni), r.opzioni);
  }

  /* ============ 2-3. quando cade, lo dice e si riattacca ============ */
  console.log('\nQUANDO L’ASCOLTO CADE, LO DICE E SI RIATTACCA');
  await p.evaluate(() => { window.__fb.rompi('unavailable'); });
  await p.waitForTimeout(200);
  {
    const r = await p.evaluate(() => ({
      ascolto: (window.LM_AUTH || {}).ascolto,
      righe: (window.LMLog ? window.LMLog.righe() : []).filter((x) => /ascolto/.test(x.msg || '')).map((x) => x.liv + ': ' + x.msg)
    }));
    ok('l’app sa di essere diventata sorda', r.ascolto === false, 'LM_AUTH.ascolto = ' + r.ascolto);
    ok('e lo scrive nel Registro tecnico, non solo in una console',
      r.righe.some((x) => /^errore/.test(x)), r.righe.slice(-2).join(' | ') || 'niente nel registro');
  }
  /* la prima attesa è di due secondi */
  await p.waitForTimeout(2600);
  {
    const r = await p.evaluate(() => ({ attacchi: window.__fb.attacchi.length, ascolto: (window.LM_AUTH || {}).ascolto }));
    ok('si è riattaccato da sé, senza ricaricare la pagina', r.attacchi === 2,
      r.attacchi + ' attacchi in tutto');
    ok('e l’app lo sa di essere tornata a sentire', r.ascolto === true, 'LM_AUTH.ascolto = ' + r.ascolto);
  }

  /* ============ 4. l’attesa raddoppia ============ */
  console.log('\nL’ATTESA FRA UN TENTATIVO E L’ALTRO RADDOPPIA');
  {
    /* SI ROMPE TRE VOLTE DI FILA senza lasciargli ricevere niente in mezzo.
       È il punto: l'attesa deve ripartire da zero solo quando arriva un dato
       DAVVERO, non quando `onSnapshot` torna senza lamentarsi — quello vuol
       dire soltanto «ho registrato l'ascolto». Con la versione debole di
       questo controllo (che guardava solo la prima attesa) il difetto era
       verde: il giro restava attacco-errore-due-secondi per sempre, senza mai
       rallentare, che su dati mobili è un ottimo modo di finire la batteria.
       E si aspettano i FATTI, non l'orologio: la prima versione dormiva 2600
       millesimi sperando che in mezzo fosse successo qualcosa, e siccome le
       attese nel frattempo erano diventate più lunghe rompeva un ascolto già
       morto. Un no-op che sembrava un difetto dell'app. */
    const attese = await p.evaluate(() => {
      const B = window.__fb;
      const aspettaVivo = () => new Promise((fine) => {
        const t = setInterval(() => { if (B.vivo) { clearInterval(t); fine(true); } }, 80);
        setTimeout(() => { clearInterval(t); fine(false); }, 30000);
      });
      const leggiDa = (n) => (window.LMLog.righe() || []).slice(n)
        .map((x) => /riprovo a mettermi in ascolto fra (\d+)/.exec(x.msg || ''))
        .filter(Boolean).map((m) => +m[1]);
      return (async () => {
        await aspettaVivo();
        /* un dato ricevuto azzera il conto: si parte da una situazione pulita */
        B.consegna({ data: JSON.stringify(LM.snapshot()), updatedAt: Date.now() });
        await new Promise((r) => setTimeout(r, 100));
        const dalla = (window.LMLog.righe() || []).length;
        for (let i = 0; i < 3; i++) {
          await aspettaVivo();
          B.rompi('unavailable');
          await new Promise((r) => setTimeout(r, 120));
        }
        return leggiDa(dalla);
      })();
    });
    ok('le attese raddoppiano: 2, 4, 8 secondi',
      attese.length >= 3 && attese[0] === 2 && attese[1] === 4 && attese[2] === 8,
      JSON.stringify(attese));

    /* e appena arriva un dato vero, il conto riparte da capo */
    const dopoUnDato = await p.evaluate(() => {
      const B = window.__fb;
      const aspettaVivo = () => new Promise((fine) => {
        const t = setInterval(() => { if (B.vivo) { clearInterval(t); fine(true); } }, 80);
        setTimeout(() => { clearInterval(t); fine(false); }, 30000);
      });
      return (async () => {
        await aspettaVivo();
        B.consegna({ data: JSON.stringify(LM.snapshot()), updatedAt: Date.now() });
        await new Promise((r) => setTimeout(r, 100));
        const dalla = (window.LMLog.righe() || []).length;
        B.rompi('unavailable');
        await new Promise((r) => setTimeout(r, 200));
        return (window.LMLog.righe() || []).slice(dalla)
          .map((x) => /riprovo a mettermi in ascolto fra (\d+)/.exec(x.msg || ''))
          .filter(Boolean).map((m) => +m[1]);
      })();
    });
    ok('e dopo un dato ricevuto il conto riparte da due secondi',
      dopoUnDato.length === 1 && dopoUnDato[0] === 2, JSON.stringify(dopoUnDato));
  }

  /* ============ 5. tornando sull’app riprova subito ============ */
  console.log('\nTORNANDO SULL’APP RIPROVA SUBITO');
  {
    const r = await p.evaluate(() => {
      const B = window.__fb;
      const aspettaVivo = () => new Promise((fine) => {
        const t = setInterval(() => { if (B.vivo) { clearInterval(t); fine(true); } }, 80);
        setTimeout(() => { clearInterval(t); fine(false); }, 30000);
      });
      return (async () => {
        await aspettaVivo();
        B.rompi('unavailable');
        const quanti = B.attacchi.length;
        await new Promise((r2) => setTimeout(r2, 120));
        /* il ritorno sull'app: l'evento che il browser manda quando torni */
        document.dispatchEvent(new Event('visibilitychange'));
        await new Promise((r2) => setTimeout(r2, 250));
        return { prima: quanti, dopo: B.attacchi.length };
      })();
    });
    ok('un ritorno sull’app riattacca subito, senza aspettare il timer',
      r.dopo === r.prima + 1, 'attacchi ' + r.prima + ' → ' + r.dopo);
  }

  /* ============ 6-7. IL CASO VERO, per la strada vera ============ */
  console.log('\nUN DOCUMENTO REMOTO PIÙ POVERO NON CANCELLA NIENTE');
  {
    const r = await p.evaluate(async () => {
      const prima = LM.snapshot();
      const quante = prima.lezioni.length;
      /* l'altro dispositivo: nessuna scoperta, ma tante azioni e un
         salvataggio più recente. È la forma esatta del documento che ha
         cancellato le Scoperte dell'utente. */
      const altro = LM.statoVuoto();
      altro.updatedAt = Date.now() + 60000;
      altro.azioni = [];
      for (let i = 0; i < 30; i++) altro.azioni.push({ id: 'altro' + i, testo: 'azione dall’altro telefono ' + i, data: LM.todayKey(), creata: Date.now() });
      altro.lezioni = [];
      await new Promise((r2) => { const t = setInterval(() => { if (window.__fb.vivo) { clearInterval(t); r2(); } }, 80); setTimeout(() => { clearInterval(t); r2(); }, 30000); });
      window.__fb.consegna({ data: JSON.stringify(altro), updatedAt: altro.updatedAt });
      await new Promise((r2) => setTimeout(r2, 400));
      const dopo = LM.snapshot();
      return {
        lezioniPrima: quante,
        lezioniDopo: dopo.lezioni.length,
        arrivate: dopo.azioni.filter((a) => /altro telefono/.test(a.testo)).length
      };
    });
    ok('le scoperte che stavano solo qui ci sono ancora',
      r.lezioniDopo === r.lezioniPrima && r.lezioniPrima > 0,
      r.lezioniPrima + ' → ' + r.lezioniDopo);
    ok('e le trenta azioni dell’altro dispositivo sono arrivate', r.arrivate === 30,
      r.arrivate + ' azioni arrivate');
  }

  /* ============================================================
     IN TEMPO REALE VUOL DIRE SULLO SCHERMO, NON NEI DATI
     Un aggiornamento che arriva, entra nello stato e non compare non è
     arrivato: chi guarda vede la schermata di prima e ricarica la pagina,
     che è proprio la cosa che non deve servire.
     ============================================================ */
  console.log('\nQUELLO CHE ARRIVA SI VEDE, SENZA RICARICARE');
  {
    /* «Da fare» è un elenco vero, che mostra tutte le righe: «Da sistemare»
       ne fa vedere una per volta, e provarci misurava la schermata sbagliata */
    await p.evaluate(() => { location.hash = '#/inbox'; });
    await p.waitForTimeout(800);
    await p.evaluate(() => {
      const b = [...document.querySelectorAll('.segmenti button')].find((x) => /da fare/i.test(x.textContent));
      if (b) b.click();
    });
    await p.waitForTimeout(600);
    const prima = await p.evaluate(() => document.body.innerText.indexOf('venuta da un altro telefono') >= 0);
    const r = await p.evaluate(async () => {
      const mio = LM.snapshot();
      const altro = JSON.parse(JSON.stringify(mio));
      altro.updatedAt = Date.now() + 5000;
      altro.backlog = (altro.backlog || []).concat([{ id: 'remota-1', testo: 'venuta da un altro telefono', areaId: 'altro', creata: Date.now() }]);
      window.__fb.consegna({ data: JSON.stringify(altro), updatedAt: altro.updatedAt });
      await new Promise((r2) => setTimeout(r2, 700));
      return {
        neiDati: LM.snapshot().backlog.some((x) => x.id === 'remota-1'),
        sulloSchermo: document.body.innerText.indexOf('venuta da un altro telefono') >= 0
      };
    });
    ok('prima non c\u2019era (se no la prova \u00e8 muta)', prima === false, '');
    ok('la riga arrivata entra nei dati', r.neiDati);
    ok('e si vede sullo schermo senza ricaricare niente', r.sulloSchermo);
  }

  console.log('\nMENTRE SCRIVI NON SI RIDISEGNA, MA NON SI DIMENTICA');
  {
    const r = await p.evaluate(async () => {
      const campo = [...document.querySelectorAll('#vista input, #vista textarea')]
        .find((x) => !x.hidden && x.type !== 'checkbox' && x.type !== 'radio' && x.offsetWidth > 40);
      if (!campo) return { saltata: true };
      campo.focus();
      const mio = LM.snapshot();
      const altro = JSON.parse(JSON.stringify(mio));
      altro.updatedAt = Date.now() + 9000;
      altro.backlog = (altro.backlog || []).concat([{ id: 'remota-2', testo: 'arrivata mentre scrivevo', areaId: 'altro', creata: Date.now() }]);
      window.__fb.consegna({ data: JSON.stringify(altro), updatedAt: altro.updatedAt });
      await new Promise((r2) => setTimeout(r2, 500));
      const durante = document.body.innerText.indexOf('arrivata mentre scrivevo') >= 0;
      campo.blur();
      await new Promise((r2) => setTimeout(r2, 700));
      const dopo = document.body.innerText.indexOf('arrivata mentre scrivevo') >= 0;
      return { durante: durante, dopo: dopo, neiDati: LM.snapshot().backlog.some((x) => x.id === 'remota-2') };
    });
    if (r.saltata) ok('c\u2019\u00e8 un campo su cui provare', false, 'nessun campo in pagina');
    else {
      ok('l\u2019aggiornamento \u00e8 comunque entrato nei dati', r.neiDati);
      ok('mentre il campo ha il fuoco lo schermo non si rif\u00e0 sotto le dita', r.durante === false);
      ok('ma appena lo lasci, quello che era arrivato compare', r.dopo === true);
    }
  }

  console.log('\nUN GESTO ISOLATO PARTE SUBITO');
  {
    const r = await p.evaluate(async () => {
      const quante = () => window.__fb.scritture.length;
      await new Promise((r2) => setTimeout(r2, 2500));   /* niente scritture da un po' */
      const a = quante();
      LM.cattura('una cosa sola');
      await new Promise((r2) => setTimeout(r2, 250));    /* meno del vecchio ritardo di 700ms */
      const b2 = quante();
      /* e adesso una raffica: deve raccoglierla in poche scritture */
      const c = quante();
      for (let i = 0; i < 8; i++) { LM.cattura('raffica ' + i); await new Promise((r3) => setTimeout(r3, 40)); }
      await new Promise((r2) => setTimeout(r2, 1400));
      return { subito: b2 - a, raffica: quante() - c };
    });
    ok('un gesto solo è già partito dopo 250ms', r.subito >= 1, r.subito + ' scritture');
    ok('e otto gesti di fila non fanno otto scritture', r.raffica <= 4, r.raffica + ' scritture per 8 gesti');
  }

  ok('nessun errore in pagina', errori.length === 0, errori.slice(0, 3).join(' | '));
  console.log(guai ? '\n>>> ' + guai + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(guai ? 1 : 0);
})();
