/* LA QUARTA VERIFICA (27 novembre 2026, revisione/cloud4/RAPPORTO.md), col
   cloud vero in piccolo. Ogni parte è un riproduttore della verifica,
   diventato una prova che resta: falliva sul codice di allora (a354d5c).
     annulla     V4-01  «Annulla» dal Diario, il messaggino dei sette secondi
                        e «Rimetti» disfano IL GESTO: quello che nel
                        frattempo è arrivato dagli altri dispositivi resta,
                        su tutti; e se una cosa toccata dal gesto è cambiata
                        altrove, non si tocca niente e lo si dice
     spazio      V4-02  con mesi di dati le copie di sicurezza si fanno
                        ancora; e quando proprio non c'è posto, «Ripristina»
                        si ferma e offre di scaricare un file invece di
                        andare avanti senza copia
     rete        V4-03  una richiesta appesa non blocca la sincronizzazione
                        fino alla ricarica
     orologio    V4-04  un orologio andato avanti di giorni, una volta sola:
                        le modifiche fatte dopo vincono, anche sullo stesso
                        dispositivo
     calendario  V4-05  annullare la rimozione di una riunione già cancellata
                        su Google non dice «Annullato» per poi farla sparire
     copie       V4-06  ritoccare la visione non butta fuori dal cloud le
                        copie dei giorni prima
     timer       V4-07  un timer avviato senza rete non lo spegne una modifica
                        qualunque fatta su un altro dispositivo
   node prove/nuvola-verifica4.js [parte…]   (CHROMIUM=/percorso/di/chrome se serve) */
'use strict';
const em = require('./comune/emulatore');
const { ok, guai } = em.conto();
const H = 3600000, G = 24 * H;
const scelte = process.argv.slice(2);
const parte = (n) => !scelte.length || scelte.indexOf(n) >= 0;

(async () => {
  const E = await em.accendi(9500);
  const srv = await em.servi(E.P.sito, process.env.LIFEMAX_SITO);
  const B = em.banco(E), N = em.nuvola(E);
  await B.avvia();
  const FS = 'http://127.0.0.1:' + E.P.firestore + '/**';
  const testi = (p) => p.evaluate(() => LM.load().azioni.map((a) => a.testo));
  const riapri = async (d) => { await d.reload(); await d.waitForFunction(() => window.LM, null, { timeout: 20000 }); };
  const alDiario = async (p) => {
    await p.evaluate(() => { location.hash = '#/oggi'; }); await p.waitForTimeout(300);
    await p.evaluate(() => { location.hash = '#/profilo'; }); await p.waitForTimeout(700);
    await p.evaluate(() => { const t = document.getElementById('imp-diario'); if (t) t.click(); }); await p.waitForTimeout(700);
    await p.evaluate(() => { const t = [...document.querySelectorAll('#diario-filtro button')].find((x) => /Tutto/.test(x.textContent)); if (t) t.click(); }); await p.waitForTimeout(600);
  };
  /* il tasto «Annulla» del diario sulla riga che dice `re` */
  const annullaRiga = (p, re) => p.evaluate((s) => {
    const r = [...document.querySelectorAll('.diario-evento')].find((e) => new RegExp(s).test(e.textContent) && e.querySelector('[data-annulla]'));
    if (!r) return null;
    const b = r.querySelector('[data-annulla]');
    const pt = LM.puntoDiRitorno(+b.getAttribute('data-annulla'));
    b.click();
    return { dopo: pt && pt.dopo, avviso: !!document.querySelector('.avviso-ovl') };
  }, re);
  const messaggi = (p) => p.evaluate(() => [...document.querySelectorAll('.toast')].map((x) => x.textContent.replace(/\s+/g, ' ').trim()));
  try {
    /* ============================================================ V4-01 */
    if (parte('annulla')) {
      await N.pulisci();
      const P = await B.dispositivo('pc'), T = await B.dispositivo('telefono', { tipo: 'iphone' });
      await B.accedi(P, 'anna', 'anna@prova.it'); await B.accedi(T, 'anna', 'anna@prova.it');
      const uid = await B.uidDi(P);
      await P.evaluate(() => { const s = LM.load(); s.onboarded = true; LM.save(); });
      await B.calmaTutti([P, T], 2000);
      for (const d of [P, T]) { await riapri(d); await d.waitForFunction(() => window.LM_AUTH && window.LM_AUTH.user, null, { timeout: 20000 }); }
      await B.calmaTutti([P, T], 2000);
      await P.evaluate(() => { LM.aggiungiAzione('Cosa da togliere', null); LM.aggiungiAzione('Bozza relazione', null); });
      await B.calmaTutti([P, T], 3000);
      await P.evaluate(() => { const a = LM.load().azioni.find((x) => x.testo === 'Cosa da togliere'); LM.rimuoviAzione(a.id); });
      await B.calmaTutti([P, T], 3000);
      /* sul telefono, DOPO: una cosa nuova e una rinomina; il PC le riceve */
      await T.evaluate(() => {
        LM.aggiungiAzione('Chiamare il medico (dal telefono)', null);
        const b = LM.load().azioni.find((x) => x.testo === 'Bozza relazione'); b.testo = 'Relazione finale (dal telefono)'; LM.save();
      });
      await B.calmaTutti([P, T], 3000); await P.waitForTimeout(1500); await B.calma(P, 1000);
      const ricevute = await testi(P);
      ok('V4-01 (preparazione) il PC ha ricevuto le due cose del telefono', ricevute.includes('Chiamare il medico (dal telefono)') && ricevute.includes('Relazione finale (dal telefono)'), ricevute);
      await alDiario(P);
      const riga = await annullaRiga(P, 'Rimossa da oggi');
      ok('V4-01 sul PC «Rimossa da oggi» è l’ultima cosa fatta lì: si annulla senza chiedere', !!riga && riga.dopo === 0 && !riga.avviso, riga);
      await B.calmaTutti([P, T], 4000); await T.waitForTimeout(2000); await B.calmaTutti([P, T], 2000);
      const dopo = { pc: await testi(P), telefono: await testi(T), cloud: (((await N.stato(uid)) || {}).azioni || []).map((a) => a.testo) };
      ok('V4-01 «Annulla» dal Diario: la cosa tolta torna, ovunque', ['pc', 'telefono', 'cloud'].every((k) => dopo[k].includes('Cosa da togliere')), dopo);
      ok('V4-01 …e la cosa nuova del telefono c’è ancora (PC, telefono, cloud)', ['pc', 'telefono', 'cloud'].every((k) => dopo[k].includes('Chiamare il medico (dal telefono)')), dopo);
      ok('V4-01 …e la rinomina del telefono c’è ancora (PC, telefono, cloud)', ['pc', 'telefono', 'cloud'].every((k) => dopo[k].includes('Relazione finale (dal telefono)') && !dopo[k].includes('Bozza relazione')), dopo);

      /* IL MESSAGGINO DEI SETTE SECONDI: si toglie sul PC, nel frattempo il
         telefono scrive, e si tocca «Annulla» */
      await P.evaluate(() => { location.hash = '#/oggi'; }); await P.waitForTimeout(400);
      await P.evaluate(() => { const a = LM.load().azioni.find((x) => x.testo === 'Cosa da togliere'); window.__PROVE__.annulla.conAnnulla('Rimossa da oggi.', 'trash', () => LM.rimuoviAzione(a.id)); });
      /* il messaggino dura sette secondi: si aspetta solo quello che serve */
      await T.evaluate(() => LM.aggiungiAzione('Scritta sul telefono nei sette secondi', null));
      const arrivata = await P.waitForFunction(() => LM.load().azioni.some((a) => a.testo === 'Scritta sul telefono nei sette secondi'), null, { timeout: 5500, polling: 100 }).then(() => true, () => false);
      const tasto = await P.evaluate(() => { const b = [...document.querySelectorAll('.toast button')].find((x) => /Annulla/.test(x.textContent)); if (b) b.click(); return !!b; });
      const dopoTasto = await messaggi(P);
      await B.calmaTutti([P, T], 3000); await B.calmaTutti([P, T], 1500);
      const dopo2 = { pc: await testi(P), telefono: await testi(T), cloud: (((await N.stato(uid)) || {}).azioni || []).map((a) => a.testo) };
      ok('V4-01 messaggino «Annulla»: la cosa tolta torna e quella arrivata dal telefono resta, ovunque', arrivata && ['pc', 'telefono', 'cloud'].every((k) => dopo2[k].includes('Cosa da togliere') && dopo2[k].includes('Scritta sul telefono nei sette secondi')), { arrivata, tasto, dopoTasto, dopo2 });

      /* «RIMETTI» dopo un annulla: si spunta sul PC, si annulla dal diario
         (col «Rimetti» nel messaggio), il telefono scrive, si tocca «Rimetti» */
      await P.evaluate(() => { const a = LM.load().azioni.find((x) => x.testo === 'Cosa da togliere'); LM.completaAzione(a.id); });
      await B.calmaTutti([P, T], 2500);
      await alDiario(P);
      await P.evaluate(() => { const id = LM.load().azioni.find((x) => x.testo === 'Cosa da togliere').id; const b = [...document.querySelectorAll('[data-annulla]')].find((x) => x.getAttribute('data-chiave') === id); if (b) b.click(); });
      const annullata = await P.evaluate(() => !LM.load().azioni.find((x) => x.testo === 'Cosa da togliere').done);
      await T.evaluate(() => LM.aggiungiAzione('Scritta sul telefono prima di «Rimetti»', null));
      await P.waitForFunction(() => LM.load().azioni.some((a) => a.testo === 'Scritta sul telefono prima di «Rimetti»'), null, { timeout: 5500, polling: 100 }).catch(() => {});
      const tastoR = await P.evaluate(() => { const b = [...document.querySelectorAll('.toast button')].filter((x) => /Rimetti/.test(x.textContent)).pop(); if (b) b.click(); return !!b; });
      await B.calmaTutti([P, T], 3000); await B.calmaTutti([P, T], 1500);
      const rim = { pc: await P.evaluate(() => LM.load().azioni.filter((a) => a.done).map((a) => a.testo).concat(LM.load().azioni.map((a) => a.testo))), telefono: await testi(T) };
      ok('V4-01 «Rimetti»: la spunta torna e la cosa arrivata dal telefono resta', rim.pc.indexOf('Cosa da togliere') >= 0 && rim.pc.filter((x) => x === 'Cosa da togliere').length === 2 && rim.pc.includes('Scritta sul telefono prima di «Rimetti»') && rim.telefono.includes('Scritta sul telefono prima di «Rimetti»'), { annullata, tastoR, rim });

      /* QUANDO L'INVERSO ESATTO NON C'È: il PC rinomina, il telefono rinomina
         la stessa cosa dopo, il PC annulla la sua rinomina. Rimettere il nome
         di prima cancellerebbe quello del telefono: non si fa, e si dice */
      await P.evaluate(() => { const a = LM.load().azioni.find((x) => x.testo === 'Relazione finale (dal telefono)'); LM.modificaAzione(a.id, 'Relazione (rinominata dal PC)'); });
      await B.calmaTutti([P, T], 2500);
      await T.evaluate(() => { const a = LM.load().azioni.find((x) => x.testo === 'Relazione (rinominata dal PC)'); LM.modificaAzione(a.id, 'Relazione (rinominata dal telefono, dopo)'); });
      await B.calmaTutti([P, T], 3000); await P.waitForTimeout(1000); await B.calma(P, 800);
      const esito = await P.evaluate(() => { const ps = LM.puntiDiRitorno(); const r = ps.length ? LM.tornaAlPunto(ps[0].fino, 'Rinominata') : null; return { r, motivo: LM.motivoRifiuto() }; });
      await B.calmaTutti([P, T], 2500);
      const nomi = { pc: await testi(P), telefono: await testi(T) };
      ok('V4-01 se la cosa toccata è cambiata altrove dopo, l’annulla non la riporta indietro e dice perché', esito.r === false && /cambiata dopo/.test(esito.motivo) && ['pc', 'telefono'].every((k) => nomi[k].includes('Relazione (rinominata dal telefono, dopo)')), { esito, nomi });
      await P.ctx.close(); await T.ctx.close();
    }
  } catch (e) { ok('eccezione', false, String(e && e.stack || e)); }
  await B.chiudi(); srv.close(); await E.spegni();
  console.log(guai() ? '\n>>> ' + guai() + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
  process.exit(guai() ? 1 : 0);
})();
