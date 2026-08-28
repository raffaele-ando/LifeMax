/* I CAMPI CHE SI APRONO COL TOCCO: ora e data.

   Nasce da «non funziona il pulsante "a un'altra ora" quando indico i pasti
   della giornata in Rituali».

   Il tasto c'era, si premeva, e non succedeva niente. Sotto ci stava un
   `input[type=time]` largo un pixel, trasparente, ritagliato via e con
   `pointer-events: none`: il dito non poteva raggiungerlo in nessun modo, e
   l'unica strada era chiedere al browser di aprire l'orologio di sistema su
   un elemento che non si vede. Quella richiesta a volte non fa niente, non
   solleva un errore e non lascia traccia: da fuori il tasto sembra rotto.
   In più il campo nasceva già pieno dell'ora solita, quindi anche a orologio
   aperto riscegliere quella stessa ora non faceva scattare nessun evento.

   Adesso il campo dell'ora si vede, e il campo della data è steso su tutta
   la sua riga: in tutti e due i casi il tocco arriva a un elemento vero.

   Questa prova tiene ferme le tre cose che erano rotte: che il campo sia
   RAGGIUNGIBILE dal punto in cui si tocca, che il tocco lasci un SEGNO
   (la pastiglia si accende, il campo compare), e che quello che si sceglie
   si SALVI davvero.

   node prove/campi.js        (CHROMIUM=/percorso/di/chrome se serve)  */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const RADICE = path.join(__dirname, '..');
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
  await new Promise(r => srv.listen(8767, r));
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

  /* l'orologio fermo alle nove di sera: la review della sera è quella
     dell'ora, quindi è già aperta, e i tre pasti sono tutti passati */
  async function apri(W, dove, prepara) {
    const ctx = await b.newContext({ viewport: { width: W, height: 900 }, hasTouch: W < 800, isMobile: W < 800 });
    const p = await ctx.newPage();
    const err = []; p.on('pageerror', e => err.push('' + e));
    await p.addInitScript(t => {
      const D = Date, base = D.now();
      class F extends D {
        constructor(...a) { if (!a.length) super(t + (D.now() - base)); else super(...a); }
        static now() { return t + (D.now() - base); }
      }
      window.Date = F;
    }, new Date('2026-08-25T21:10:00').getTime());
    await p.goto('http://localhost:8767/index.html'); await p.waitForTimeout(300);
    await p.evaluate((d) => { localStorage.clear(); LM.seedDemo(); location.hash = '#/' + d; }, dove);
    if (prepara) await p.evaluate(prepara);
    await p.reload(); await p.waitForTimeout(900);
    return { ctx, p, err };
  }

  /* chi riceve il tocco nel mezzo di un elemento: è la domanda che il tasto
     rotto sbagliava, e l'unica che conta davvero */
  const chiRiceve = (p, sel) => p.evaluate((s) => {
    const e = document.querySelector(s); if (!e) return null;
    const r = e.getBoundingClientRect();
    const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    /* «suo» anche se il tocco cade su un figlio (l'icona dentro il tasto):
       quello che conta è che non ci sia SOPRA qualcun altro */
    const suo = !!t && (t === e || e.contains(t));
    return { suo: suo, largo: Math.round(r.width), alto: Math.round(r.height), chi: t ? t.tagName + '.' + t.className : null };
  }, sel);

  console.log('L’ORA DI UN PASTO');
  for (const W of [320, 390, 1280]) {
    const { ctx, p, err } = await apri(W, 'rituali');
    await p.evaluate(() => {
      const s = document.querySelector('.rit-blocco[data-rit="sera"]');
      if (s && !s.classList.contains('aperto')) s.querySelector('.rit-riga').click();
    });
    await p.waitForTimeout(600);
    console.log('  — ' + W + 'px —');
    ok('ci sono le righe dei pasti', await p.evaluate(() => document.querySelectorAll('[data-pasto]').length) === 3);
    ok('il campo dell’ora non c’è finché non lo chiedi', await p.evaluate(() => !document.querySelector('[data-poraval]')));

    await p.locator('[data-pasto] [data-pora]').first().click();
    await p.waitForTimeout(400);
    const c = await chiRiceve(p, '[data-pasto] [data-poraval]');
    ok('il tocco fa comparire il campo, e il campo riceve il tocco', !!c && c.suo && c.largo > 60, JSON.stringify(c));
    const st = await p.evaluate(() => {
      const i = document.querySelector('[data-pasto] [data-poraval]');
      const cs = getComputedStyle(i), r = i.getBoundingClientRect();
      return {
        opacita: cs.opacity, puntatore: cs.pointerEvents, valore: i.value, fuoco: document.activeElement === i,
        accesa: document.querySelector('[data-pasto] [data-pora]').classList.contains('on'),
        dentro: r.right <= innerWidth + 1 && r.left >= -1
      };
    });
    ok('si vede e si tocca', st.opacita === '1' && st.puntatore !== 'none', JSON.stringify(st));
    /* pieno dell'ora solita, riscegliere quella stessa ora non fa scattare
       nessun evento: il tocco andrebbe perso */
    ok('parte vuoto', st.valore === '');
    ok('prende il fuoco da solo', st.fuoco === true);
    ok('e la pastiglia si accende: il tocco ha lasciato un segno', st.accesa === true);
    ok('sta dentro lo schermo', st.dentro === true);

    await p.evaluate(() => {
      const i = document.querySelector('[data-pasto] [data-poraval]');
      i.value = '08:45'; i.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await p.waitForTimeout(500);
    const s = await p.evaluate(() => {
      const pa = (LM.ritmoDi(LM.todayKey()).pasti || [])[0], riga = document.querySelector('[data-pasto]');
      return {
        fatto: pa.fatto, ora: pa.ora, prec: pa.prec,
        sotto: riga.querySelector('.rec-solito').textContent,
        campo: !!riga.querySelector('[data-poraval]'),
        altra: riga.querySelector('[data-pora]').classList.contains('on'),
        si: riga.querySelector('[data-pfatto="si"]').classList.contains('on')
      };
    });
    ok('l’ora scelta si salva, e come ora precisa', s.fatto === true && s.ora === '08:45' && s.prec === 'preciso', JSON.stringify(s));
    ok('la riga lo dice', /alle 08:45/.test(s.sotto), s.sotto);
    ok('il campo si richiude', s.campo === false);
    ok('e resta accesa «a un’altra ora», non «sì»', s.altra === true && s.si === false);

    await p.locator('[data-pasto] [data-pora]').first().click(); await p.waitForTimeout(300);
    ok('un altro tocco riapre il campo', await p.evaluate(() => !!document.querySelector('[data-pasto] [data-poraval]')));
    await p.locator('[data-pasto] [data-pora]').first().click(); await p.waitForTimeout(300);
    ok('e uno ancora lo richiude: si può cambiare idea', await p.evaluate(() => !document.querySelector('[data-pasto] [data-poraval]')));

    /* «sì» vuol dire all'ora solita, più o meno: non deve pretendere un'ora
       dal campo che non c'è */
    await p.locator('[data-pasto] [data-pfatto="si"]').first().click(); await p.waitForTimeout(400);
    const si = await p.evaluate(() => ({
      prec: (LM.ritmoDi(LM.todayKey()).pasti || [])[0].prec,
      ora: (LM.ritmoDi(LM.todayKey()).pasti || [])[0].ora,
      sotto: document.querySelector('[data-pasto] .rec-solito').textContent
    }));
    ok('«sì» tiene l’ora solita, più o meno', si.prec === 'circa' && !!si.ora && /verso le/.test(si.sotto), JSON.stringify(si));
    ok('nessun errore in pagina', err.length === 0, JSON.stringify(err));
    await ctx.close();
  }

  console.log('LA SCADENZA DI UN’ATTIVITÀ');
  for (const conScadenza of [false, true]) {
    const { ctx, p, err } = await apri(390, 'inbox', conScadenza
      ? () => { const s = LM.load(); s.backlog.forEach(x => { x.scadenza = LM.addDays(LM.todayKey(), 5); }); LM.save(); }
      : null);
    await p.evaluate(() => {
      const b = [...document.querySelectorAll('.segmenti button')].find(x => /da fare/i.test(x.textContent));
      if (b) b.click();
    });
    await p.waitForTimeout(500);
    await p.evaluate(() => { const x = document.querySelector('[data-bkapri]'); if (x) x.click(); });
    await p.waitForTimeout(700);
    await p.evaluate(() => { const i = document.querySelector('#sc-scad'); if (i) i.closest('.lista-riga').scrollIntoView({ block: 'center' }); });
    await p.waitForTimeout(400);
    console.log('  — ' + (conScadenza ? 'con una scadenza già messa' : 'senza scadenza') + ' —');
    const c = await chiRiceve(p, '#sc-scad');
    ok('il campo data copre la riga e riceve il tocco', !!c && c.suo && c.largo > 100, JSON.stringify(c));
    if (conScadenza) {
      const x = await chiRiceve(p, '#sc-scad-x');
      ok('la ✕ che toglie la scadenza resta sopra al campo', !!x && x.suo, JSON.stringify(x));
      const quale = await p.evaluate(() => document.querySelector('#sheet-corpo [data-bid], #sheet-corpo').getAttribute('data-bid'));
      const prima = await p.evaluate(() => document.querySelector('#sc-scad').value);
      await p.locator('#sc-scad-x').click(); await p.waitForTimeout(500);
      ok('e toglie la scadenza invece di aprire il calendario',
        await p.evaluate(() => !document.querySelector('#sc-scad').value) && !!prima, prima + ' → ' + (quale || ''));
    }
    ok('nessun errore in pagina', err.length === 0, JSON.stringify(err));
    await ctx.close();
  }

  await b.close(); srv.close();
  console.log(fail ? '\n>>> ' + fail + ' GUAI' : '\n>>> TUTTO A POSTO');
  process.exit(fail ? 1 : 0);
})();
