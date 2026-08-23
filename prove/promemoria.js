/* I PROMEMORIA, DAL LATO DELL'APP.
   Tre cose che si rompono in silenzio, e che nessuno si accorge fino al
   giorno in cui una notifica non arriva:
     1. il service worker non si registra (e allora niente esiste);
     2. il permesso viene chiesto all'apertura — il modo più sicuro di
        farselo negare per sempre, e senza appello: negato è negato;
     3. il piano contiene le cose sbagliate (le abitudini di un altro giorno,
        quelle già fatte, la priorità già spuntata).
   Più il pannello in Impostazioni, che deve dire il vero in ogni stato.

   node prove/promemoria.js        (CHROMIUM=/percorso/di/chrome se serve)  */
const http = require('http'), fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png' };
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
  const ctx = await b.newContext({ viewport: { width: 390, height: 900 }, hasTouch: true, isMobile: true });
  const err = [];
  /* le notifiche mostrate finiscono in una lista invece di apparire */
  await ctx.addInitScript(() => {
    window.__notifiche = [];
    window.__badge = null;
    const p = window.ServiceWorkerRegistration && ServiceWorkerRegistration.prototype;
    if (p) {
      p.showNotification = function (t, o) { window.__notifiche.push({ titolo: t, opz: o }); return Promise.resolve(); };
      /* le notifiche già a schermo: serve per «togliere la nota fissa» */
      p.getNotifications = function (f) {
        window.__chiuse = window.__chiuse || [];
        const tag = f && f.tag;
        return Promise.resolve(window.__notifiche
          .filter(function (n) { return !tag || (n.opz && n.opz.tag) === tag; })
          .map(function (n) { return { close: function () { window.__chiuse.push(n.opz.tag); } }; }));
      };
    }
    navigator.setAppBadge = function (n) { window.__badge = n; return Promise.resolve(); };
    navigator.clearAppBadge = function () { window.__badge = 0; return Promise.resolve(); };

    /* UN FINTO PUSHMANAGER.
       Un'iscrizione vera non si può fare qui: il browser di prova gira in un
       contesto incognito, dove Chrome non ha il Push API, e anche se l'avesse
       `subscribe()` andrebbe a chiedere un indirizzo al servizio push di
       Google — cioè servirebbe la rete e un progetto Firebase per provare del
       codice nostro. Quindi si finge il pezzo del browser e si prova il pezzo
       nostro: quando si iscrive, quando butta l'iscrizione di prima, e cosa
       dice quando la chiave non va.
       La finzione è fedele in un punto che conta: rifiuta una chiave che non è
       un punto sulla curva, esattamente come fa quello vero. È il caso in cui
       la chiave ha la lunghezza giusta e sembra buona. */
    if (window.PushManager) {
      window.__push = { iscrizioni: [], disiscritte: 0 };
      let corrente = null;
      const b64 = (u) => { let s = ''; new Uint8Array(u).forEach(x => { s += String.fromCharCode(x); });
        return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
      PushManager.prototype.getSubscription = function () { return Promise.resolve(corrente); };
      PushManager.prototype.subscribe = async function (o) {
        const k = new Uint8Array(o.applicationServerKey);
        try {
          await crypto.subtle.importKey('raw', k, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
        } catch (e) {
          throw new DOMException('The provided applicationServerKey is not valid.', 'InvalidAccessError');
        }
        const chiave = b64(k);
        window.__push.iscrizioni.push(chiave);
        corrente = {
          endpoint: 'https://fcm.googleapis.com/fcm/send/finta-' + window.__push.iscrizioni.length,
          toJSON: () => ({ endpoint: corrente.endpoint, keys: { p256dh: 'B'.repeat(87), auth: 'A'.repeat(22) } }),
          unsubscribe: () => { window.__push.disiscritte++; corrente = null; return Promise.resolve(true); }
        };
        return corrente;
      };
    }
    if (window.Notification) {
      const N = window.Notification;
      window.Notification = function (t, o) { window.__notifiche.push({ titolo: t, opz: o }); };
      window.Notification.permission = N.permission;
      window.Notification.requestPermission = N.requestPermission.bind(N);
    }
  });
  const p = await ctx.newPage();
  p.on('pageerror', e => err.push('' + e));
  await p.addInitScript(t => { const D = Date; class F extends D { constructor(...a) { if (!a.length) super(t); else super(...a); } static now() { return t; } } window.Date = F; },
    new Date('2026-08-22T10:30:00').getTime());
  await p.goto('http://localhost:8757/index.html');
  await p.waitForTimeout(500);
  await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  await p.reload();
  await p.waitForTimeout(900);

  console.log('IL SERVICE WORKER SI REGISTRA DA SOLO');
  const reg = await p.evaluate(() => navigator.serviceWorker.getRegistration().then(r => !!r && !!(r.active || r.installing || r.waiting)));
  ok('c’è', reg === true, String(reg));
  /* il campo d'azione deve contenere la pagina: se il service worker finisse
     in una sottocartella, non vedrebbe l'app che deve servire. Non si controlla
     che sia «/» perché su GitHub Pages il sito sta sotto il nome del
     repository, e là la radice è un'altra. */
  ok('e il suo campo d’azione contiene l’app',
    await p.evaluate(() => navigator.serviceWorker.getRegistration().then(r => !!r && location.href.startsWith(r.scope))));

  console.log('\nIL PERMESSO NON SI CHIEDE ALL’APERTURA');
  /* Un permesso negato non si può richiedere: il browser non lo mostra più.
     Chiederlo appena si apre l'app è il modo più sicuro di perderlo. */
  ok('all’avvio il permesso non è stato chiesto', await p.evaluate(() => Notification.permission) === 'default',
    await p.evaluate(() => Notification.permission));
  ok('e nessuna notifica è comparsa', (await p.evaluate(() => window.__notifiche.length)) === 0);

  console.log('\nIL PIANO DI OGGI');
  const piano = () => p.evaluate(() => LM_PROMEMORIA.piano());
  let pl = await piano();
  console.log('  ' + JSON.stringify(pl.map(v => v.ora + ' ' + v.id)));
  ok('è in ordine di ora', pl.every((v, i) => i === 0 || pl[i - 1].ora <= v.ora), JSON.stringify(pl.map(v => v.ora)));
  ok('ogni voce ha ora, titolo e dove andare',
    pl.every(v => /^\d{2}:\d{2}$/.test(v.ora) && v.titolo && /^#\//.test(v.vai)));
  ok('ogni voce dice se vale anche domani', pl.every(v => typeof v.ripete === 'boolean'));
  ok('c’è il piano del mattino', pl.some(v => v.id === 'mattina'));
  ok('c’è la chiusura della sera', pl.some(v => v.id === 'sera'));

  console.log('\nQUELLO CHE È FATTO NON SI RICORDA');
  await p.evaluate(() => LM.salvaPianoMattina('provo'));
  ok('fatto il mattino, sparisce dal piano', !(await piano()).some(v => v.id === 'mattina'),
    JSON.stringify((await piano()).map(v => v.id)));
  await p.evaluate(() => LM.salvaReviewSera({ vittoria: 'x', blocco: 'y' }));
  ok('fatta la sera, sparisce anche quella', !(await piano()).some(v => v.id === 'sera'));
  await p.evaluate(() => LM.registraCheckin(3, 3, 3, ''));
  ok('fatto il check-in, sparisce', !(await piano()).some(v => v.id === 'checkin'));

  console.log('\nLA PRIORITÀ DEL GIORNO');
  await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  await p.reload(); await p.waitForTimeout(700);
  await p.evaluate(() => { LM.aggiungiAzione('La cosa che conta', 'lavoro', { mit: true }); });
  let mit = (await piano()).filter(v => v.id === 'mit');
  ok('se è ancora lì, un colpetto nel pomeriggio', mit.length === 1, JSON.stringify((await piano()).map(v => v.id)));
  ok('e solo per oggi, non domani', mit[0] && mit[0].ripete === false);
  await p.evaluate(() => { const s = LM.load(); const a = s.azioni.find(x => x.testo === 'La cosa che conta'); LM.completaAzione(a.id); });
  /* l'app passa il testimone: spuntando la priorità un'altra azione diventa
     la priorità del giorno. Quella spuntata, però, non si ricorda più. */
  ok('spuntata, non si ricorda più quella',
    !(await piano()).some(v => v.corpo === 'La cosa che conta'),
    JSON.stringify((await piano()).filter(v => v.id === 'mit').map(v => v.corpo)));

  console.log('\nLE ABITUDINI: SOLO QUELLE CON UN’ORA');
  await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  await p.reload(); await p.waitForTimeout(700);
  await p.evaluate(() => {
    LM.aggiungiAbitudine('Senza orario', 'salute', []);
    LM.aggiungiAbitudine('Con orario', 'salute', [], { ora: '07:00' });
    LM.aggiungiAbitudine('Solo di lunedì', 'salute', [1], { ora: '07:30' });
  });
  pl = await piano();
  ok('quella con l’ora c’è', pl.some(v => v.titolo === 'Con orario'), JSON.stringify(pl.map(v => v.titolo)));
  ok('quella senza no', !pl.some(v => v.titolo === 'Senza orario'));
  /* il 22 agosto 2026 è un sabato */
  ok('quella di lunedì non suona di sabato', !pl.some(v => v.titolo === 'Solo di lunedì'));
  ok('e il giorno se lo porta dietro, per quando il piano invecchia',
    (pl.find(v => v.titolo === 'Con orario') || {}).giorni !== undefined);
  await p.evaluate(() => { const h = LM.load().abitudini.find(x => x.testo === 'Con orario'); LM.completaAbitudine(h.id); });
  ok('fatta, non si ricorda', !(await piano()).some(v => v.titolo === 'Con orario'));
  await p.evaluate(() => {
    const h = LM.load().abitudini.find(x => x.testo === 'Con orario');
    LM.completaAbitudine(h.id); LM.saltaGiornoAbitudine(h.id);
  });
  ok('saltata, nemmeno', !(await piano()).some(v => v.titolo === 'Con orario'),
    JSON.stringify((await piano()).map(v => v.titolo)));

  console.log('\nSENZA SERVER SI FA SOLO QUELLO CHE SI PUÒ');
  ok('il pannello lo sa', await p.evaluate(() => LM_PROMEMORIA.configurato()) === false);
  ok('e non prova a mandare niente', await p.evaluate(() => LM_PROMEMORIA.mandaPiano(true)) === false);

  console.log('\nIL PANNELLO IN IMPOSTAZIONI');
  const pannello = () => p.evaluate(() => {
    const s = [...document.querySelectorAll('#sheet-corpo .imp-sezione')]
      .find(e => /Promemoria/.test((e.querySelector('.imp-eti') || {}).textContent || ''));
    if (!s) return null;
    return {
      testo: s.textContent.replace(/\s+/g, ' ').trim(),
      on: !!s.querySelector('#imp-prom-on'), off: !!s.querySelector('#imp-prom-off'),
      icona: !!s.querySelector('svg.ico')
    };
  });
  await p.evaluate(() => { location.hash = '#/oggi'; }); await p.waitForTimeout(600);
  await p.evaluate(() => { const b = document.querySelector('[data-imp],#btn-impostazioni,[data-vai="impostazioni"]'); if (b) b.click(); });
  await p.waitForTimeout(300);
  let pan = await pannello();
  if (!pan) { await p.evaluate(() => { document.querySelectorAll('button').forEach(b => { if (/Impostazioni/i.test(b.textContent)) b.click(); }); }); await p.waitForTimeout(400); pan = await pannello(); }
  ok('c’è, dentro Impostazioni', !!pan, pan ? '' : 'non trovato');
  if (pan) {
    console.log('  «' + pan.testo.slice(0, 110) + '»');
    ok('spento, offre di accendere', pan.on && !pan.off, JSON.stringify({ on: pan.on, off: pan.off }));
    ok('col suo segno', pan.icona);
    ok('e dice il vero: senza server c’è solo il timer', /timer/.test(pan.testo), pan.testo.slice(0, 90));
  }

  console.log('\nCOL PERMESSO CONCESSO');
  await ctx.grantPermissions(['notifications'], { origin: 'http://localhost:8757' });
  await p.reload(); await p.waitForTimeout(900);
  ok('il permesso c’è', await p.evaluate(() => Notification.permission) === 'granted',
    await p.evaluate(() => Notification.permission));
  const mostrata = await p.evaluate(() => LM_PROMEMORIA.locale('Tempo scaduto', 'Venti minuti su «prova».', '#/oggi'));
  ok('una notifica locale parte', mostrata === true, String(mostrata));
  const n = await p.evaluate(() => window.__notifiche[window.__notifiche.length - 1] || null);
  ok('col titolo giusto', n && n.titolo === 'Tempo scaduto', n ? n.titolo : 'nessuna');
  ok('col testo', n && n.opz && n.opz.body === 'Venti minuti su «prova».');
  ok('e con dove andare', n && n.opz && n.opz.data && n.opz.data.vai === '#/oggi');
  ok('in italiano, per la lettura ad alta voce', n && n.opz && n.opz.lang === 'it');

  console.log('\nIL PIANO E IL CONTO NON SI CHIAMANO A VICENDA');
  /* Questa è la prova di un bug vero, trovato accendendo l'interruttore:
     `restano()` chiedeva i rituali aperti a `piano()`, e `piano()` chiedeva a
     `restano()` il testo della nota fissa. Con la nota spenta non si notava —
     con la nota accesa l'app si fermava con lo stack pieno, e la schermata
     restava a metà. Adesso il pezzo condiviso sta da solo e non ha versi. */
  const senzaEsplodere = () => p.evaluate(() => {
    try {
      LM_PROMEMORIA.fissa(true);
      const a = LM_PROMEMORIA.piano().length;
      const b = LM_PROMEMORIA.restano().n;
      const c = LM_PROMEMORIA.testoFissa();
      LM_PROMEMORIA.fissa(false);
      return { ok: true, piano: a, restano: b, titolo: c.titolo };
    } catch (e) { return { ok: false, err: '' + e }; }
  });
  let ric = await senzaEsplodere();
  ok('col piano acceso non va in ricorsione', ric.ok === true, ric.ok ? JSON.stringify(ric) : ric.err);
  ok('e il piano contiene la voce «stato»',
    await p.evaluate(() => { LM_PROMEMORIA.fissa(true); const v = LM_PROMEMORIA.piano().some(x => x.id === 'stato'); LM_PROMEMORIA.fissa(false); return v; }));
  ok('che è del tipo giusto e ripete ogni giorno',
    await p.evaluate(() => { LM_PROMEMORIA.fissa(true);
      const v = LM_PROMEMORIA.piano().find(x => x.id === 'stato') || {}; LM_PROMEMORIA.fissa(false);
      return v.tipo === 'stato' && v.ripete === true; }));

  console.log('\nIL NUMERO SULL’ICONA');
  await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  await p.reload(); await p.waitForTimeout(900);
  const badge = () => p.evaluate(() => window.__badge);
  const conto = () => p.evaluate(() => LM_PROMEMORIA.restano());
  let b1 = await badge(), r1 = await conto();
  console.log('  ' + JSON.stringify(r1));
  ok('è messo appena si apre l’app', typeof b1 === 'number' && b1 > 0, String(b1));
  ok('ed è il numero delle cose aperte', b1 === r1.n, b1 + ' vs ' + r1.n);
  /* spuntando una cosa il numero scende: se non scendesse, il pallino
     diventerebbe un numero fisso che non dice più niente */
  await p.evaluate(() => { const s = LM.load(); const a = s.azioni.find(x => x.data === LM.todayKey() && !x.done); if (a) LM.completaAzione(a.id); });
  await p.waitForTimeout(400);
  ok('spuntando una cosa scende', (await badge()) === b1 - 1, (await badge()) + ' (era ' + b1 + ')');
  /* e a zero si toglie: un'icona pulita è la ricompensa */
  await p.evaluate(() => {
    const s = LM.load(), k = LM.todayKey();
    s.azioni.filter(a => a.data === k && !a.done).forEach(a => LM.completaAzione(a.id));
    s.abitudini.filter(h => LM.abitudinePrevista(h, k) && !(h.fatti && h.fatti[k])).forEach(h => LM.completaAbitudine(h.id));
    LM.salvaPianoMattina('x'); LM.registraCheckin(3, 3, 3, ''); LM.salvaReviewSera({ vittoria: 'a', blocco: 'b' });
  });
  await p.waitForTimeout(500);
  ok('finito tutto, il numero va a zero', (await conto()).n === 0, JSON.stringify(await conto()));
  ok('e il pallino si toglie', (await badge()) === 0, String(await badge()));

  console.log('\nLA NOTA FISSA');
  await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  await p.reload(); await p.waitForTimeout(900);
  ok('parte spenta: una notifica che resta lì non si mette senza chiedere',
    (await p.evaluate(() => LM_PROMEMORIA.fissaAccesa())) === false);
  await p.evaluate(() => { window.__notifiche.length = 0; LM_PROMEMORIA.fissa(true); });
  await p.waitForTimeout(300);
  const nf = await p.evaluate(() => window.__notifiche[window.__notifiche.length - 1] || null);
  ok('accendendola compare', !!nf, nf ? nf.titolo : 'nessuna');
  if (nf) {
    console.log('  «' + nf.titolo + '» — ' + nf.opz.body);
    /* le quattro cose che la rendono «fissa» invece di una notifica qualsiasi */
    ok('ha un tag fisso, così si riscrive invece di accumularsi', nf.opz.tag === 'lifemax-stato', nf.opz.tag);
    ok('non fa rumore quando si aggiorna', nf.opz.silent === true);
    ok('e non rifà il suono di una nuova', nf.opz.renotify === false);
    ok('sul computer non sparisce dopo venti secondi', nf.opz.requireInteraction === true);
    ok('porta a Oggi', nf.opz.data && nf.opz.data.vai === '#/oggi');
  }
  /* si aggiorna da sé quando cambia qualcosa, senza server */
  const quante = () => p.evaluate(() => window.__notifiche.filter(n => n.opz.tag === 'lifemax-stato').length);
  const prima = await quante();
  await p.evaluate(() => LM.aggiungiAzione('Una cosa nuova di oggi', 'altro', {}));
  await p.waitForTimeout(400);
  ok('si riscrive quando cambiano i dati', (await quante()) > prima, (await quante()) + ' vs ' + prima);
  const ultima = await p.evaluate(() => { const l = window.__notifiche.filter(n => n.opz.tag === 'lifemax-stato'); return l[l.length - 1]; });
  ok('e tutte le volte con lo stesso tag: una sola notifica, non una pila',
    ultima.opz.tag === 'lifemax-stato');
  await p.evaluate(() => { window.__chiuse = []; LM_PROMEMORIA.fissa(false); });
  await p.waitForTimeout(300);
  ok('spegnendola la notifica viene chiusa',
    (await p.evaluate(() => (window.__chiuse || []).indexOf('lifemax-stato') >= 0)) === true);
  ok('e non ne compaiono di nuove', (await p.evaluate(() => LM_PROMEMORIA.fissaAccesa())) === false);
  await p.evaluate(() => { window.__badge = null; LM_PROMEMORIA.spegni(); });
  await p.waitForTimeout(300);
  ok('spegnendo tutto il pallino si toglie', (await badge()) === 0, String(await badge()));

  console.log('\nLE SCELTE SONO TUE, E STANNO COI TUOI DATI');
  await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  await p.reload(); await p.waitForTimeout(900);
  const cfg = () => p.evaluate(() => LM.promemoria());
  let c = await cfg();
  ok('la configurazione esiste già alla prima apertura', !!c && !!c.voci, JSON.stringify(c && c.voci && Object.keys(c.voci)));
  ok('tutte le voci partono accese', Object.keys(c.voci).every(k => c.voci[k].on === true));
  ok('la nota fissa parte spenta', c.fissa === false);
  ok('il silenzio parte acceso di notte', c.silenzio.on === true && c.silenzio.da === '23:00', JSON.stringify(c.silenzio));
  /* stanno nei dati, quindi finiscono nell'esportazione e nel cloud: un
     backup che non contiene com'era configurato non è un backup */
  ok('e stanno dentro i dati, non nel dispositivo',
    await p.evaluate(() => { const j = JSON.parse(LM.esportaJSON ? LM.esportaJSON() : JSON.stringify(LM.load()));
      return !!(j.profilo && j.profilo.promemoria); }));

  console.log('\nSPEGNERE UNA VOCE');
  const idPiano = () => p.evaluate(() => LM_PROMEMORIA.piano().map(v => v.id));
  ok('prima c’è la sera', (await idPiano()).includes('sera'), JSON.stringify(await idPiano()));
  const apertePrima = (await conto()).n;
  await p.evaluate(() => LM.impostaPromemoria({ voci: { sera: { on: false } } }));
  await p.waitForTimeout(300);
  ok('spenta, esce dal piano', !(await idPiano()).includes('sera'), JSON.stringify(await idPiano()));
  /* la distinzione che conta: spegnere il promemoria non cancella la cosa */
  ok('ma resta fra le cose aperte: non te l’ho cancellata', (await conto()).n === apertePrima, (await conto()).n + ' vs ' + apertePrima);
  await p.evaluate(() => LM.impostaPromemoria({ voci: { sera: { on: true } } }));

  console.log('\nCAMBIARE UN’ORA');
  await p.evaluate(() => LM.impostaPromemoria({ voci: { mattina: { ora: '06:45' } } }));
  await p.waitForTimeout(200);
  ok('il piano usa l’ora nuova',
    (await p.evaluate(() => (LM_PROMEMORIA.piano().find(v => v.id === 'mattina') || {}).ora)) === '06:45');
  await p.evaluate(() => LM.impostaPromemoria({ voci: { mattina: { ora: '25:99' } } }));
  ok('un’ora impossibile non passa', (await cfg()).voci.mattina.ora === '06:45', (await cfg()).voci.mattina.ora);
  await p.evaluate(() => LM.impostaPromemoria({ voci: { mattina: { ora: '' } } }));
  ok('e nemmeno una vuota', (await cfg()).voci.mattina.ora === '06:45');
  await p.evaluate(() => LM.impostaPromemoria({ voci: { abitudini: { ora: '09:00' } } }));
  ok('le abitudini non prendono un’ora comune: ognuna ha la sua',
    (await cfg()).voci.abitudini.ora === undefined);
  await p.evaluate(() => LM.impostaPromemoria({ voci: { inventata: { on: true } } }));
  ok('una voce inventata non entra', (await cfg()).voci.inventata === undefined);

  console.log('\nIL SILENZIO VIAGGIA COL PIANO');
  await p.evaluate(() => LM.impostaPromemoria({ silenzio: { on: true, da: '22:30', a: '08:15' } }));
  c = await cfg();
  ok('si salva', c.silenzio.da === '22:30' && c.silenzio.a === '08:15', JSON.stringify(c.silenzio));
  await p.evaluate(() => LM.impostaPromemoria({ silenzio: { da: 'boh' } }));
  ok('scritto male non passa', (await cfg()).silenzio.da === '22:30');

  console.log('\nIL POSTINO SI SCRIVE DALL’APP');
  /* una chiave vera, generata qui: `'B'.repeat(87)` ha la lunghezza giusta ma
     non è un punto sulla curva, e il browser la rifiuta — cioè proverebbe la
     strada sbagliata credendo di provare quella buona */
  const chiaveVera = await p.evaluate(async () => {
    const c = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
    const u = new Uint8Array(await crypto.subtle.exportKey('raw', c.publicKey));
    let s = ''; u.forEach(b => { s += String.fromCharCode(b); });
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  });
  await p.evaluate(k => LM.impostaPromemoria({ server: 'https://prova.workers.dev/', chiave: k }), chiaveVera);
  c = await cfg();
  ok('l’indirizzo perde la barra finale', c.server === 'https://prova.workers.dev', c.server);
  ok('e da lì lo legge il modulo', (await p.evaluate(() => LM_PROMEMORIA.cfg().server)) === 'https://prova.workers.dev');
  ok('ora si dice configurato', (await p.evaluate(() => LM_PROMEMORIA.configurato())) === true);
  await p.evaluate(() => LM.impostaPromemoria({ server: '', chiave: '' }));

  console.log('\nCAMBIANDO LA CHIAVE, L’ISCRIZIONE SI RIFÀ');
  /* Un'iscrizione vale per una chiave sola. Rigenerare le chiavi è la prima
     cosa che si fa quando qualcosa non torna: se l'iscrizione di prima
     restasse, il server firmerebbe con la nuova, il servizio push
     risponderebbe 403 e sul telefono non arriverebbe niente — senza che
     nessuno dica perché. */
  /* si riparte da una configurazione buona: la sezione qui sopra la azzera
     alla fine, e senza indirizzo `iscrivi()` non prova nemmeno */
  await p.evaluate(k => LM.impostaPromemoria({ server: 'https://prova.workers.dev', chiave: k }), chiaveVera);
  /* l'iscrizione si fa quando il piano parte, non quando si scrive la chiave */
  await p.evaluate(() => LM_PROMEMORIA.mandaPiano(true));
  await p.waitForTimeout(600);
  ok('si è iscritta con la chiave che le hai dato',
    (await p.evaluate(() => window.__push.iscrizioni[0])) === chiaveVera,
    (await p.evaluate(() => (window.__push.iscrizioni[0] || '').slice(0, 12))) + '…');
  ok('e si ricorda con quale',
    (await p.evaluate(() => LM_PROMEMORIA.chiaveIscritta())) === chiaveVera);
  const chiaveDue = await p.evaluate(async () => {
    const c = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
    const u = new Uint8Array(await crypto.subtle.exportKey('raw', c.publicKey));
    let s = ''; u.forEach(b => { s += String.fromCharCode(b); });
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  });
  await p.evaluate(k => LM.impostaPromemoria({ chiave: k }), chiaveDue);
  await p.evaluate(() => LM_PROMEMORIA.mandaPiano(true));
  await p.waitForTimeout(500);
  ok('la vecchia iscrizione viene buttata',
    (await p.evaluate(() => window.__push.disiscritte)) === 1, String(await p.evaluate(() => window.__push.disiscritte)));
  ok('e se ne fa una nuova con la chiave nuova',
    (await p.evaluate(() => window.__push.iscrizioni[1])) === chiaveDue,
    (await p.evaluate(() => (window.__push.iscrizioni[1] || '').slice(0, 12))) + '…');
  ok('l’app si ricorda quella nuova',
    (await p.evaluate(() => LM_PROMEMORIA.chiaveIscritta())) === chiaveDue);

  console.log('\nUNA CHIAVE CHE SEMBRA GIUSTA MA NON LO È');
  /* Il caso peggiore: la lunghezza è quella, quindi passa il controllo del
     campo, ma non è un punto sulla curva. Il browser rifiuta l'iscrizione, e
     senza catturarlo l'errore finiva in console mentre l'app diceva «accesi».
     Chi configura da solo non ha nessun modo di scoprirlo. */
  await p.evaluate(() => LM.impostaPromemoria({ server: 'https://prova.workers.dev', chiave: 'B'.repeat(87) }));
  const esitoFinto = await p.evaluate(() => LM_PROMEMORIA.accendi());
  ok('l’app dice che è la chiave, invece di dire «accesi»', esitoFinto === 'chiave', String(esitoFinto));
  ok('e non lascia un errore per terra', err.filter(e => /applicationServerKey/.test(e)).length === 0,
    err.join(' | ') || 'nessuno');
  await p.evaluate(() => LM.impostaPromemoria({ server: '', chiave: '' }));

  console.log('\nCHI AVEVA GIÀ CONFIGURATO NON RIFÀ NIENTE');
  /* le due chiavi stavano in localStorage: si travasano una volta e la vecchia
     riga si cancella, o il travaso si rifarebbe a ogni avvio sovrascrivendo */
  await p.evaluate(() => {
    localStorage.setItem('lifemax.promemoria.cfg', JSON.stringify({ server: 'https://vecchio.workers.dev', chiave: 'K'.repeat(87) }));
    localStorage.setItem('lifemax.promemoria.fissa', '1');
  });
  await p.reload(); await p.waitForTimeout(900);
  c = await cfg();
  ok('l’indirizzo di prima è arrivato nelle impostazioni', c.server === 'https://vecchio.workers.dev', c.server);
  ok('e la nota fissa era accesa, e resta accesa', c.fissa === true);
  ok('la vecchia riga è stata cancellata',
    (await p.evaluate(() => localStorage.getItem('lifemax.promemoria.cfg'))) === null);
  await p.evaluate(() => LM.impostaPromemoria({ server: 'https://nuovo.workers.dev' }));
  await p.reload(); await p.waitForTimeout(900);
  ok('e il travaso non si ripete sovrascrivendo quello nuovo',
    (await cfg()).server === 'https://nuovo.workers.dev', (await cfg()).server);

  console.log('\nDUE CAMPI SBAGLIATI NON SI SALVANO ZITTI');
  await p.evaluate(() => { localStorage.clear(); LM.seedDemo(); });
  await p.reload(); await p.waitForTimeout(900);
  await p.evaluate(() => { location.hash = '#/oggi'; }); await p.waitForTimeout(500);
  await p.evaluate(() => { document.querySelectorAll('button').forEach(b => { if (/Impostazioni/i.test(b.textContent)) b.click(); }); });
  await p.waitForTimeout(400);
  await p.evaluate(() => { const b = document.getElementById('imp-prom-come'); if (b) b.click(); });
  await p.waitForTimeout(500);
  ok('la schermata «Come ti avviso» si apre', await p.evaluate(() => !!document.getElementById('prom-collega')));
  const collega = async (srv, kk) => {
    await p.evaluate(x => {
      document.getElementById('prom-server').value = x.s;
      document.getElementById('prom-chiave').value = x.k;
      document.getElementById('prom-collega').click();
    }, { s: srv, k: kk });
    await p.waitForTimeout(300);
    return p.evaluate(() => (document.getElementById('prom-esito') || {}).textContent || '');
  };
  let m = await collega('lifemax.workers.dev', 'B'.repeat(87));
  ok('un indirizzo senza https viene rifiutato', /https/.test(m), m.slice(0, 70));
  ok('e non viene salvato', (await cfg()).server === '', (await cfg()).server);
  m = await collega('https://x.workers.dev', 'troppocorta');
  ok('una chiave corta viene rifiutata, e lo dice', /caratteri|privata/i.test(m), m.slice(0, 90));
  ok('e nemmeno quella viene salvata', (await cfg()).chiave === '');

  console.log('\nTOCCANDOLA, L’APP CI PORTA');
  await p.evaluate(() => { location.hash = '#/andamento'; }); await p.waitForTimeout(400);
  await p.evaluate(() => new Promise(r => {
    /* è il messaggio che manda il service worker quando tocchi la notifica */
    navigator.serviceWorker.dispatchEvent(new MessageEvent('message', { data: { lm: 'vai', vai: '#/rituali' } }));
    setTimeout(r, 300);
  }));
  ok('arriva ai rituali', /#\/rituali/.test(await p.evaluate(() => location.hash)), await p.evaluate(() => location.hash));

  console.log('\nIL TIMER CHE FINISCE AVVISA');
  ok('la fine del timer chiama la notifica',
    /LM_PROMEMORIA[\s\S]{0,80}locale\(/.test(fs.readFileSync(path.join(RADICE, 'assets/app.js'), 'utf8')
      .split('\n').filter(l => /LM_PROMEMORIA/.test(l)).join('\n')));

  ok('nessun errore JS', err.length === 0, [...new Set(err)].join(' | '));
  console.log(fail ? '\n>>> ' + fail + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  await b.close(); srv.close(); process.exit(fail ? 1 : 0);
})();
