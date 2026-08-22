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
    const p = window.ServiceWorkerRegistration && ServiceWorkerRegistration.prototype;
    if (p) { p.showNotification = function (t, o) { window.__notifiche.push({ titolo: t, opz: o }); return Promise.resolve(); }; }
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
