/* QUANTO COSTA STARE FERMI, e le scritte mozzate per il lungo.

   Nasce da «su android ci sono lag e bug continui rispetto all'iPad» e dalle
   foto con dei rettangoli grigi o neri a spigolo vivo in mezzo alle
   schermate e ai pannelli.

   Erano la stessa cosa. Il fondo dell'app — l'aurora, tre aloni colorati che
   si muovono piano — aveva `filter: blur(70px)` sul contenitore e le
   animazioni sui tre figli dentro. Un `filter` sul padre impedisce al
   browser di far correre sulla scheda grafica le animazioni di chi sta
   dentro: il risultato sfocato va rifatto da capo ogni volta che qualcosa si
   muove là sotto. E qualcosa si muoveva sempre, perché quelle animazioni
   sono `infinite`. Risultato: un rettangolo di 140vw x 140vh ridisegnato e
   risfocato dal thread principale sessanta volte al secondo, a schermo
   fermo, su ogni pagina, anche con un pannello aperto sopra.

   Misurato a 390x844 con la CPU rallentata sei volte: 18,7 fotogrammi al
   secondo con l'aurora accesa, 60,8 con l'aurora nascosta. Su un telefono
   che deve anche tenere in memoria gli strati sfocati dei pannelli, quando
   la memoria della scheda grafica finisce le tessere non disegnate restano
   del colore di riempimento: i rettangoli grigi delle foto.

   E il blur non si vedeva nemmeno. Sfocare di settanta pixel una sfumatura
   radiale che gia' svanisce nel nulla al 68% non la cambia: le due immagini
   a confronto, pixel per pixel, differiscono al massimo di 3 su 255 e non
   c'e' un solo pixel sopra 3, ne' a 390 ne' a 1280.

   Tre reti, qui:
     1. niente che si muove dentro un `filter` — la regola strutturale, che
        non dipende da quanto e' veloce la macchina che fa girare la prova;
     2. i fotogrammi a schermo fermo, con la CPU rallentata sei volte;
     3. nessuna scritta tagliata per il lungo nei blocchi della giornata.
        `justify-content: center` con dentro un testo piu' alto del blocco lo
        fa uscire da sopra E da sotto: si vedeva la meta' bassa delle lettere
        della prima riga e la meta' alta di quelle dell'ultima.

   node prove/disegno.js      (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
const PORTA = 8771;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const PAVIMENTO = 45;            /* fotogrammi al secondo, CPU rallentata 6x */
/* un terzo di pixel: sotto ci sono solo gli arrotondamenti dei rettangoli,
   sopra c'e' una riga di testo che il ritaglio mangia davvero */
const TOLL = 0.3;
let fail = 0;
const ok = (n, c, d) => { if (!c) fail++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

/* ---- 1. chi si muove dentro un filtro ------------------------------- */
function cercaMossiNeiFiltri() {
  const nome = (e) => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') +
    (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : '');
  const filtrati = [];
  document.querySelectorAll('*').forEach((e) => {
    const f = getComputedStyle(e).filter;
    if (f && f !== 'none') filtrati.push(e);
  });
  const guai = [];
  filtrati.forEach((e) => {
    e.querySelectorAll('*').forEach((d) => {
      d.getAnimations().forEach((a) => {
        if (a.playState !== 'running') return;
        const inf = a.effect && a.effect.getTiming && a.effect.getTiming().iterations;
        guai.push(nome(e) + ' [' + f2(e) + '] contiene ' + nome(d) +
          ' che anima ' + (a.animationName || a.transitionProperty || '?') +
          (inf === Infinity ? ' per sempre' : ''));
      });
    });
  });
  function f2(e) { return getComputedStyle(e).filter.slice(0, 40); }
  return { quantiFiltri: filtrati.length, guai: guai };
}

/* ---- 3. scritte che escono dal loro blocco --------------------------- */
function cercaScritteFuori(toll) {
  const fuori = [];
  let visti = 0, peggioSopra = 0, peggioSotto = 0;
  document.querySelectorAll('.tl-blk').forEach((blk) => {
    const t = blk.querySelector('.tl-blk-t');
    if (!t) return;
    const rb = blk.getBoundingClientRect(), rt = t.getBoundingClientRect();
    if (rb.height < 1 || rt.height < 1) return;
    visti++;
    const s = getComputedStyle(blk);
    const alto = rb.top + parseFloat(s.paddingTop) + parseFloat(s.borderTopWidth);
    const basso = rb.bottom - parseFloat(s.paddingBottom) - parseFloat(s.borderBottomWidth);
    const sopra = alto - rt.top, sotto = rt.bottom - basso;
    if (sopra > peggioSopra) peggioSopra = sopra;
    if (sotto > peggioSotto) peggioSotto = sotto;
    if (sopra > toll || sotto > toll) {
      fuori.push((t.textContent || '').trim().slice(0, 22) +
        ' esce di ' + sopra.toFixed(1) + ' sopra e ' + sotto.toFixed(1) + ' sotto' +
        ' (blocco ' + rb.height.toFixed(0) + 'px, righe=' + (blk.style.getPropertyValue('--righe') || 'non messe') + ')');
    }
  });
  return { visti: visti, fuori: fuori,
           peggioSopra: +peggioSopra.toFixed(2), peggioSotto: +peggioSotto.toFixed(2) };
}

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

  async function apri(via, dopo) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    await p.goto('http://localhost:' + PORTA + '/index.html'); await p.waitForTimeout(300);
    await p.evaluate((v) => { localStorage.clear(); LM.seedDemo(); location.hash = '#/' + v; }, via);
    await p.reload(); await p.waitForTimeout(1100);
    if (dopo) { await p.evaluate(dopo); await p.waitForTimeout(900); }
    await p.bringToFront();
    return { ctx, p };
  }

  const fps = (p) => p.evaluate(() => new Promise((fine) => {
    let n = 0; const t0 = performance.now();
    (function giro() {
      n++;
      if (performance.now() - t0 < 2500) requestAnimationFrame(giro);
      else fine(+(n / ((performance.now() - t0) / 1000)).toFixed(1));
    })();
  }));

  const SCENE = [
    ['Oggi', 'oggi', null],
    ['La giornata', 'giornata', null],
    ['La settimana', 'giornata', () => { const x = document.querySelector('[data-orizz="settimana"]'); if (x) x.click(); }],
    ['Andamento', 'andamento', null],
    ['Attività', 'inbox', null]
  ];

  /* ============ 1. NIENTE SI MUOVE DENTRO UN FILTRO ============ */
  console.log('\nNIENTE CHE SI MUOVE DENTRO UN «filter»');
  console.log('  (un filter sul padre toglie ai figli la scheda grafica: ogni');
  console.log('   loro fotogramma diventa un ridisegno del padre, sfocatura compresa)');
  let filtriVisti = 0;
  for (const [nome, via, dopo] of SCENE) {
    const { ctx, p } = await apri(via, dopo);
    const r = await p.evaluate(cercaMossiNeiFiltri);
    filtriVisti += r.quantiFiltri;
    ok(nome + ': niente si muove dentro un filtro', r.guai.length === 0, r.guai.join(' · '));
    await ctx.close();
  }

  /* la controprova: rimetto l'aurora com'era e pretendo il rosso */
  {
    const { ctx, p } = await apri('oggi', null);
    await p.evaluate(() => {
      const s = document.createElement('style');
      s.textContent = '.aurora { filter: blur(70px) saturate(1.15); }';
      document.head.appendChild(s);
    });
    await p.waitForTimeout(300);
    const r = await p.evaluate(cercaMossiNeiFiltri);
    ok('controprova: rimettendo il filtro sull’aurora, il controllo si accorge',
      r.guai.length >= 3, r.guai.length + ' segnalazioni');
    await ctx.close();
  }

  /* ============ 2. I FOTOGRAMMI A SCHERMO FERMO ============ */
  console.log('\nI FOTOGRAMMI A SCHERMO FERMO, CON LA CPU RALLENTATA SEI VOLTE');
  console.log('  (nessuno tocca niente: è quello che l’app consuma solo per esistere)');
  const misure = [];
  for (const [nome, via, dopo] of SCENE) {
    const { ctx, p } = await apri(via, dopo);
    const cdp = await ctx.newCDPSession(p);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
    await p.waitForTimeout(400);
    const f = await fps(p);
    misure.push(f);
    ok(nome + ': almeno ' + PAVIMENTO + ' fotogrammi al secondo', f >= PAVIMENTO, f + ' fps');
    await ctx.close();
  }

  {
    const { ctx, p } = await apri('oggi', null);
    const cdp = await ctx.newCDPSession(p);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
    await p.evaluate(() => {
      const s = document.createElement('style');
      s.textContent = '.aurora { filter: blur(70px) saturate(1.15); }';
      document.head.appendChild(s);
    });
    await p.waitForTimeout(600);
    const f = await fps(p);
    ok('controprova: col filtro rimesso, i fotogrammi crollano sotto il pavimento',
      f < PAVIMENTO, f + ' fps contro i ' + misure[0] + ' di adesso');
    await ctx.close();
  }

  /* ============ 3. NESSUNA SCRITTA MOZZATA PER IL LUNGO ============ */
  console.log('\nNESSUNA SCRITTA TAGLIATA PER IL LUNGO NEI BLOCCHI');
  console.log('  (il blocco è alto quanto DURA l’impegno: il titolo deve stare dentro,');
  console.log('   e quello che non ci sta deve sparire per righe intere, non a metà lettera)');
  let blocchiVisti = 0;
  for (const [nome, via, dopo] of SCENE.filter(s => s[1] === 'giornata')) {
    const { ctx, p } = await apri(via, dopo);
    const r = await p.evaluate(cercaScritteFuori, TOLL);
    blocchiVisti += r.visti;
    ok(nome + ': i titoli stanno dentro il loro blocco (' + r.visti + ' guardati, il peggiore sborda di '
      + Math.max(r.peggioSopra, r.peggioSotto) + 'px)',
      r.fuori.length === 0, r.fuori.slice(0, 4).join(' · '));
    await ctx.close();
  }

  /* Due controprove, una per difetto. Rimetterli tutti e due insieme sarebbe
     stato piu' comodo e avrebbe nascosto il secondo: `center` spartisce lo
     sbordo fra sopra e sotto, quindi con le tre righe fisse E il centro non
     protetto ogni lato sbordava di poco piu' di mezzo pixel — meno della
     tolleranza — e la prova passava verde su un'app rotta in due punti.
     E' successo davvero, scrivendola. */
  {
    const settimana = () => { const x = document.querySelector('[data-orizz="settimana"]'); if (x) x.click(); };
    const conStile = async (css) => {
      const { ctx, p } = await apri('giornata', settimana);
      await p.evaluate((c) => {
        const st = document.createElement('style'); st.textContent = c; document.head.appendChild(st);
      }, css);
      await p.waitForTimeout(400);
      const r = await p.evaluate(cercaScritteFuori, TOLL);
      await ctx.close();
      return r;
    };
    const TRE = '.tl-grid-mini .tl-blk-t { -webkit-line-clamp: 3 !important; line-clamp: 3 !important; }';
    const conSafe = await conStile(TRE);
    ok('controprova 1: rimettendo le tre righe fisse per tutti, il controllo si accorge',
      conSafe.fuori.length > 0 && conSafe.peggioSotto > TOLL,
      conSafe.visti + ' blocchi, ' + conSafe.fuori.length + ' titoli fuori, il peggiore di ' + conSafe.peggioSotto + 'px sotto');
    const senzaSafe = await conStile(TRE + ' .tl-blk { justify-content: center !important; }');
    ok('controprova 2: togliendo il «safe» al centro, lo sbordo passa anche di sopra',
      senzaSafe.peggioSopra > TOLL && conSafe.peggioSopra <= TOLL,
      'col safe ' + conSafe.peggioSopra + 'px sopra, senza safe ' + senzaSafe.peggioSopra + 'px sopra');
  }

  /* ============ LE RETI: se non ho guardato niente, non ho provato niente ==== */
  console.log('\nLE PROVE HANNO GUARDATO QUALCOSA DAVVERO');
  ok('ho trovato elementi con un filtro su cui misurarmi', filtriVisti > 0, filtriVisti + ' elementi');
  ok('ho trovato blocchi con un titolo dentro', blocchiVisti >= 10, blocchiVisti + ' blocchi');

  await b.close(); srv.close();
  console.log(fail ? '\n>>> ' + fail + ' GUAI' : '\n>>> TUTTO A POSTO');
  process.exit(fail ? 1 : 0);
})();
