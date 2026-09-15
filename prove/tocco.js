/* L'APP NELLE MANI DI CHI LA USA: un pollice che deve prendere, e una
   persona che ha chiesto di non vedere movimento.

   Due cose che una checklist di buone pratiche elenca sempre, e che qui si
   MISURANO sull'app che gira invece di leggerle in un elenco. Sono anche le
   due che, se si rompono, non si vedono da nessuna parte: un bersaglio
   diventato piccolo non dà errore, dà un tocco che ogni tanto non prende; e
   una pagina che continua a muoversi per chi ha chiesto di no non lo dice a
   nessuno — meno che mai a chi ha fatto quella richiesta apposta per non
   doverlo chiedere ogni volta.

   IL BERSAGLIO. Le linee guida dicono 44px (Apple) o 48 (Material). Qui i
   più piccoli sono tre, tutti 40×40 e uguali fra loro: è una scelta, presa
   una volta, non una svista che si ripete. Quindi non si pretendono i 44 —
   sarebbe rifare un disegno che funziona — si pretende che NESSUNO SCENDA
   SOTTO quello che c'è oggi, e che i tre a 40 restino tre. È un cricchetto,
   come `FERMI` in `pezzi.js`: da qui si sale, non si scende.

   IL MOVIMENTO RIDOTTO è rispettato in due posti, e servono tutti e due: il
   foglio di stile azzera durate di transizione e animazione per tutto, e il
   codice salta le animazioni che disegna lui — il numero che sale, i punti
   che volano, i coriandoli. Provare solo il primo lascerebbe scoperto
   esattamente il pezzo più vistoso.

   Si lancia con: node prove/tocco.js   (CHROMIUM=… se serve) */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { SERVITO: RADICE } = require('./comune/dove');
const PORTA = 8847;
const T = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.map': 'application/json' };

/* IL PAVIMENTO DI OGGI, misurato. Si alza quando il disegno migliora; non
   si abbassa mai per far passare una prova. */
const PAVIMENTO = 40;
const AMMESSI_AL_PAVIMENTO = 3;

let guai = 0;
const ok = (nome, cond, det) => { if (!cond) guai++; console.log('  ' + (cond ? 'ok  ' : 'KO  ') + nome + (det ? '  → ' + det : '')); };

const VIE = ['oggi', 'giornata', 'rituali', 'attivita', 'plancia', 'scoperte'];

const MISURA = `(function () {
  const out = [];
  document.querySelectorAll('button, a[href], [role=button], input[type=checkbox]').forEach(function (e) {
    const b = e.getBoundingClientRect();
    if (b.width < 1 || b.height < 1) return;
    const s = getComputedStyle(e);
    if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity < 0.05) return;
    out.push({
      lato: Math.round(Math.min(b.width, b.height)),
      che: (e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 28) || String(e.className).slice(0, 28)
    });
  });
  return out;
})()`;

(async () => {
  const srv = http.createServer((q, r) => {
    let u = decodeURIComponent(q.url.split('?')[0]); if (u === '/') u = '/index.html';
    fs.readFile(path.join(RADICE, u), (e, d) => {
      if (e) { r.statusCode = 404; r.end('x'); return; }
      r.setHeader('Content-Type', T[path.extname(u)] || 'application/octet-stream'); r.end(d);
    });
  });
  await new Promise((r) => srv.listen(PORTA, r));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

  console.log('\nIL POLLICE PRENDE QUELLO CHE MIRA');
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    await p.goto('http://localhost:' + PORTA + '/index.html');
    await p.waitForFunction(() => !!window.LM);
    await p.evaluate(() => { localStorage.clear(); window.LM.seedDemo(); });
    const piccoli = [];
    let guardati = 0;
    for (const v of VIE) {
      await p.evaluate((x) => { location.hash = '#/' + x; }, v);
      await p.waitForTimeout(700);
      const r = await p.evaluate(MISURA);
      guardati += r.length;
      r.filter((x) => x.lato < PAVIMENTO + 4).forEach((x) => piccoli.push(v + ': «' + x.che + '» ' + x.lato + 'px'));
    }
    const sotto = piccoli.filter((s) => +(/(\d+)px$/.exec(s) || [])[1] < PAVIMENTO);
    const tipi = new Set(piccoli.map((s) => s.split(': ')[1]));
    ok('nessun bersaglio sotto i ' + PAVIMENTO + 'px', sotto.length === 0,
      sotto.length ? sotto.join('; ') : guardati + ' bersagli guardati su ' + VIE.length + ' schermate');
    ok('e quelli al pavimento restano ' + AMMESSI_AL_PAVIMENTO, tipi.size <= AMMESSI_AL_PAVIMENTO,
      tipi.size ? [...tipi].join(', ') : 'nessuno');
    /* se un giorno il selettore non trova più niente, questa prova direbbe
       «tutto a posto» per non aver guardato */
    ok('e ce n’è un numero sensato da guardare', guardati > 60, guardati + '');
    await ctx.close();
  }

  console.log('\nCHI HA CHIESTO DI NON VEDERE MOVIMENTO, NON NE VEDE');
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto('http://localhost:' + PORTA + '/index.html');
    await p.waitForFunction(() => !!window.LM);
    await p.evaluate(() => { localStorage.clear(); window.LM.seedDemo(); });
    await p.evaluate(() => { location.hash = '#/plancia'; });
    await p.waitForTimeout(900);

    ok('il browser lo sta davvero chiedendo',
      await p.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches));

    /* 1. il foglio di stile: nessuna durata vera addosso a niente */
    const lunghe = await p.evaluate(() => {
      const fuori = [];
      document.querySelectorAll('#vista *, .tabbar *').forEach((e) => {
        const s = getComputedStyle(e);
        /* NIENTE DOPPI BACKSLASH QUI: questo è codice vero, non una stringa
           passata al browser. Scritto `\\d` la regex cerca un backslash, non
           trova mai una durata, e la prova passa dicendo «tutte a zero»
           mentre le transizioni ci sono tutte — misurato togliendo la regola
           dal foglio: la prova restava verde. È la stessa trappola che qui
           dentro ha già colpito con `\\b`. */
        /* E NIENTE REGEX SUL NUMERO. `.01ms` il browser lo restituisce come
           `1e-05s`, e una regex che pesca cifre ci legge «05s» — cinque
           secondi invece di un centesimo di millisecondo, cioè il contrario.
           `parseFloat` la notazione scientifica la sa leggere; l'unità si
           guarda in coda. */
        const ms = (v) => Math.max(...String(v).split(',').map((x) => {
          const t = x.trim();
          const n = parseFloat(t);
          if (!isFinite(n)) return 0;
          return /ms$/.test(t) ? n : n * 1000;
        }));
        if (ms(s.transitionDuration) > 1 || ms(s.animationDuration) > 1) {
          fuori.push(e.tagName.toLowerCase() + '.' + String(e.className).trim().split(/\s+/)[0] +
            ' ' + s.transitionDuration + '/' + s.animationDuration);
        }
      });
      return fuori.slice(0, 5);
    });
    ok('il foglio di stile ha azzerato durate e animazioni', lunghe.length === 0, lunghe.join('; ') || 'tutte a zero');

    /* 2. IL NUMERO GRANDE CI ARRIVA SUBITO, NON CI SALE — e si guarda DAL
       PRIMO ISTANTE. Qui prima si aspettava che la schermata fosse a posto e
       poi si leggeva: a quel punto l'animazione, che dura nove decimi di
       secondo, era già finita, e il numero era giusto anche quando saliva.
       Misurato togliendo il salto dell'animazione dal codice: la prova
       restava verde. Si guarda mentre la schermata arriva, non dopo. */
    const salita = await p.evaluate(() => new Promise((r) => {
      location.hash = '#/oggi';
      setTimeout(() => {
        location.hash = '#/plancia';
        const letture = [];
        let n = 0;
        const t = setInterval(() => {
          const e = document.getElementById('som-pct');
          if (e) letture.push(e.textContent);
          if (++n === 40) { clearInterval(t); r({ letture: letture, manca: letture.length === 0 }); }
        }, 25);
      }, 250);
    }));
    const distinti = salita.manca ? [] : [...new Set(salita.letture)];
    ok('la percentuale non conta da zero, c’è già',
      !salita.manca && distinti.length === 1 && distinti[0] !== '0',
      salita.manca ? 'il numero non c’è mai stato' : distinti.length + ' valori diversi: ' + distinti.slice(0, 6).join(' → '));

    /* 3. i coriandoli e i punti che volano: non compaiono proprio */
    const festa = await p.evaluate(() => {
      const s = window.LM.load();
      const a = (s.azioni || []).find((x) => !x.done);
      if (!a) return { niente: 'nessuna azione da spuntare' };
      window.LM.completaAzione(a.id);
      return new Promise((r) => setTimeout(() => r({
        tela: !!document.querySelector('.tela-festa'),
        volanti: document.querySelectorAll('.vola-xp').length
      }), 400));
    });
    ok('niente tela dei coriandoli', festa.niente || festa.tela === false, festa.niente || String(festa.tela));
    ok('e nessun punto che vola', festa.niente || festa.volanti === 0, festa.niente || festa.volanti + '');
    await ctx.close();
  }

  await b.close(); srv.close();
  console.log(guai ? '\n>>> ' + guai + (guai > 1 ? ' PROBLEMI' : ' PROBLEMA') : '\n>>> TUTTO A POSTO');
  process.exit(guai ? 1 : 0);
})();
