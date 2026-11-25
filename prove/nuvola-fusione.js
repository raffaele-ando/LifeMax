/* PIÙ DISPOSITIVI SULLO STESSO ACCOUNT: NIENTE SI PERDE, NIENTE RISORGE.

   Nata dalla verifica del cloud del 24 novembre 2026
   (revisione/cloud/RAPPORTO.md): sono i suoi riproduttori, diventati una
   prova che resta. Firebase vero (la libreria del sito) contro l'emulatore
   ufficiale, con le regole di `firestore.rules`; ogni dispositivo è un
   browser separato coi suoi dati (vedi prove/comune/emulatore.js).

   Quello che si pretende, e il problema del rapporto da cui viene:
     2  il PC sempre aperto riceve quello che il telefono ha scritto offline,
        e alla sua scrittura successiva quella cosa NON sparisce dal cloud;
     3  un dispositivo nuovo che entra non azzera il profilo degli altri;
     4  togliere una spunta (azione e abitudine, coi loro punti), spegnere
        un'area, rimettere gli orari di un giorno arriva agli altri, e alla
        loro scrittura successiva non torna indietro;
     6  due modifiche offline alla stessa cosa: vince quella fatta dopo, non
        quella del dispositivo che torna online per ultimo; una cancellazione
        offline arriva a tutti e non risorge;
     8  un orologio indietro di due minuti non fa risorgere una cancellazione,
        uno avanti di tre ore non vince su una modifica fatta dopo;
    10  i punti guadagnati in parallelo su due dispositivi si sommano;
    13  «Azzera tutto» con l'account toglie anche aree, nomi e diario dagli
        altri dispositivi, e tiene quello che è stato scritto DOPO;
     e i SOSPETTI: un dispositivo fermo più a lungo di quanto durano le
        lapidi, più di tremila righe azzerate, un check-in modificato.

   Si lancia con: node prove/nuvola-fusione.js
   (serve l'emulatore: vedi prove/comune/emulatore.js) */
'use strict';
const em = require('./comune/emulatore');
const { ok, guai } = em.conto();
const G = 86400000;

(async () => {
  const E = await em.accendi(9700);
  const srv = await em.servi(E.P.sito);
  const B = em.banco(E), N = em.nuvola(E);
  await B.avvia();
  const az = (p) => p.evaluate(() => LM.load().azioni.map((a) => a.testo + (a.done ? '[x]' : '')).sort().join(' | '));
  const azCloud = async (uid) => { const s = await N.stato(uid); return ((s && s.azioni) || []).map((a) => a.testo + (a.done ? '[x]' : '')).sort().join(' | '); };
  const chiudi = async (arr) => { for (const p of arr) await p.ctx.close().catch(() => {}); };
  async function gruppo(nomi, o) {
    await N.pulisci();
    const out = [];
    for (const n of nomi) out.push(await B.dispositivo(n, Object.assign({ tipo: n === 'telefono' ? 'iphone' : n === 'ipad' ? 'ipad' : 'pc' }, (o && o[n]) || {})));
    for (const p of out) await B.accedi(p, 'mario', 'mario@prova.it');
    out.uid = await B.uidDi(out[0]);
    return out;
  }
  try {
    /* ---------------------------------------------------------- 2. il PC sordo */
    {
      const [T, P] = await gruppo(['telefono', 'pc']);
      await T.ctx.setOffline(true);
      await T.evaluate(() => LM.aggiungiAzione('Scritta in metro (telefono)', null));
      await T.waitForTimeout(300); await T.close();
      await P.evaluate(() => LM.aggiungiAzione('Scritta in ufficio (pc)', null)); await B.calma(P, 1500);
      await T.ctx.setOffline(false);
      const T2 = await B.dispositivo('telefono', { ctx: T.ctx });
      await B.calmaTutti([T2, P], 5000);
      ok('2 il PC sempre aperto riceve la cosa scritta in metro', (await az(P)).includes('metro'), await az(P));
      await T2.close();
      await P.evaluate(() => LM.aggiungiAzione('Altra cosa dal pc, telefono in tasca', null)); await B.calma(P, 2500);
      const c = await azCloud((await B.uidDi(P)));
      ok('2 e alla scrittura successiva del PC la cosa della metro resta nel cloud', c.includes('metro'), c);
      const I = await B.dispositivo('ipad', { tipo: 'ipad' }); await B.accedi(I, 'mario', 'mario@prova.it');
      ok('2 un iPad che entra adesso la vede', (await az(I)).includes('metro'), await az(I));
      await chiudi([P, I]);
    }
    /* ----------------------------- 2/6. offline + online, e chi torna per ultimo */
    {
      const D = await gruppo(['telefono', 'pc', 'ipad']);
      const [A, Bp, C] = D;
      await A.ctx.setOffline(true);
      await A.evaluate(() => LM.aggiungiAzione('X offline telefono', null));
      await A.waitForTimeout(400);
      await Bp.evaluate(() => LM.aggiungiAzione('Y pc', null));
      await B.calmaTutti([Bp, C], 1500);
      await A.ctx.setOffline(false);
      await B.calmaTutti(D, 6000);
      const r = { telefono: await az(A), pc: await az(Bp), ipad: await az(C), cloud: await azCloud(D.uid) };
      ok('2 telefono offline aggiunge X, pc aggiunge Y, il telefono torna: tutti hanno X e Y', Object.values(r).every((v) => v.includes('X offline') && v.includes('Y pc')), r);
      /* 6: modifica contro modifica, offline: vince l'ultima FATTA */
      await A.evaluate(() => LM.aggiungiAzione('Telefonare al medico', null)); await B.calmaTutti(D, 2000);
      for (const ordine of [['telefono', 'pc'], ['pc', 'telefono']]) {
        /* testi diversi a ogni giro: rimettere lo stesso testo non è una modifica */
        const giro = ordine[0];
        await A.ctx.setOffline(true); await Bp.ctx.setOffline(true);
        await A.evaluate((g) => LM.modificaAzione(LM.load().azioni.find((a) => /medico/i.test(a.testo)).id, 'Medico (prima modifica, telefono, ' + g + ')'), giro);
        await A.waitForTimeout(1200);
        await Bp.evaluate((g) => LM.modificaAzione(LM.load().azioni.find((a) => /medico/i.test(a.testo)).id, 'Medico (ultima modifica, pc, ' + g + ')'), giro);
        const primo = ordine[0] === 'telefono' ? A : Bp, secondo = ordine[0] === 'telefono' ? Bp : A;
        await primo.ctx.setOffline(false); await B.calmaTutti([primo, C], 3000);
        await secondo.ctx.setOffline(false); await B.calmaTutti(D, 5000);
        const r2 = { telefono: await az(A), pc: await az(Bp), ipad: await az(C), cloud: await azCloud(D.uid) };
        ok('6 modifica contro modifica offline (torna prima il ' + ordine[0] + '): vince l’ultima fatta, ovunque', Object.values(r2).every((v) => v.includes('ultima modifica, pc, ' + giro) && !v.includes('prima modifica')), r2);
      }
      /* 6: cancella (telefono) contro modifica successiva (pc), offline */
      await A.ctx.setOffline(true); await Bp.ctx.setOffline(true);
      await A.evaluate(() => LM.rimuoviAzione(LM.load().azioni.find((a) => /Medico/.test(a.testo)).id));
      await A.waitForTimeout(1200);
      await Bp.evaluate(() => LM.modificaAzione(LM.load().azioni.find((a) => /Medico/.test(a.testo)).id, 'Medico, modificata dopo la cancellazione'));
      await A.ctx.setOffline(false); await B.calmaTutti([A, C], 3000); await Bp.ctx.setOffline(false); await B.calmaTutti(D, 5000);
      const r3 = { telefono: await az(A), pc: await az(Bp), ipad: await az(C), cloud: await azCloud(D.uid) };
      ok('6 cancella contro modifica fatta dopo, offline: tutti uguali (vince la modifica, che è dopo)', new Set(Object.values(r3)).size === 1 && r3.cloud.includes('modificata dopo'), r3);
      /* 6: cancellazione offline, aggiunta online altrove */
      await A.evaluate(() => { LM.aggiungiAzione('da cancellare', null); LM.aggiungiAzione('da tenere', null); }); await B.calmaTutti(D, 2000);
      await A.ctx.setOffline(true);
      await A.evaluate(() => LM.rimuoviAzione(LM.load().azioni.find((a) => a.testo === 'da cancellare').id));
      await Bp.evaluate(() => LM.aggiungiAzione('nuova dal pc', null)); await B.calmaTutti([Bp, C], 2000);
      await A.ctx.setOffline(false); await B.calmaTutti(D, 5000);
      await Bp.evaluate(() => LM.cattura('x')); await B.calmaTutti(D, 3000);
      const r4 = { telefono: await az(A), pc: await az(Bp), ipad: await az(C), cloud: await azCloud(D.uid) };
      ok('6 cancellazione offline: arriva a tutti, non risorge, e la cosa nuova dal pc resta', Object.values(r4).every((v) => !v.includes('da cancellare') && v.includes('nuova dal pc') && v.includes('da tenere')), r4);
      await chiudi(D);
    }
    /* ------------------ verifica 2, G1: due modifiche a campi diversi */
    {
      const D = await gruppo(['telefono', 'pc', 'ipad']);
      const [A, P, C] = D;
      await P.evaluate(() => LM.aggiungiAzione('X originale', null)); await B.calmaTutti(D, 2000);
      const riga = (p) => p.evaluate(() => { const a = LM.load().azioni.find((x) => /^X /.test(x.testo)) || {}; return { testo: a.testo, done: !!a.done }; });
      await A.ctx.setOffline(true); await C.ctx.setOffline(true);
      await A.evaluate(() => LM.modificaAzione(LM.load().azioni.find((x) => /^X /.test(x.testo)).id, 'X rinominata sul telefono'));
      await A.waitForTimeout(800);
      await C.evaluate(() => LM.modificaAzione(LM.load().azioni.find((x) => /^X /.test(x.testo)).id, 'X rinominata sull’iPad'));
      await C.waitForTimeout(800);
      await P.evaluate(() => LM.completaAzione(LM.load().azioni.find((x) => /^X /.test(x.testo)).id)); await B.calma(P, 1500);
      await C.ctx.setOffline(false); await B.calmaTutti([C, P], 3000);
      await A.ctx.setOffline(false); await B.calmaTutti(D, 5000);
      const r = { telefono: await riga(A), pc: await riga(P), ipad: await riga(C) };
      ok('G1 rinomina offline e spunta su un altro dispositivo: restano tutte e due (vince la rinomina più recente), ovunque',
        Object.values(r).every((v) => v.testo === 'X rinominata sull’iPad' && v.done === true), r);
      /* lo stesso nella forma del calendario: il titolo cambiato da una parte
         (come fa la sincronizzazione con Google), la spunta dall'altra */
      const cal = await A.evaluate(() => {
        const s0 = LM.statoVuoto(); s0.updatedAt = 1000;
        s0.azioni.push({ id: 'ev1', areaId: 'altro', testo: 'Impegno', ifThen: '', mit: false, done: false, data: LM.todayKey(), doneAt: null, creata: 500, ora: '10:00', durata: 60, passoDi: null, aggiornata: 900 });
        const tel = JSON.parse(JSON.stringify(s0)), pc = JSON.parse(JSON.stringify(s0));
        tel.azioni[0].done = true; tel.azioni[0].doneAt = 3000; tel.azioni[0].aggiornata = 3000; tel.orologi = { 'azioni/iev1/done': 3000, 'azioni/iev1/doneAt': 3000 }; tel.updatedAt = 3000;
        pc.azioni[0].testo = 'Colloquio (spostato sala B)'; pc.azioni[0].aggiornata = 2000; pc.orologi = { 'azioni/iev1/testo': 2000 }; pc.updatedAt = 2000;
        const a = LM.unisci(tel, pc).azioni[0], b = LM.unisci(pc, tel).azioni[0];
        return { a: [a.testo, a.done], b: [b.testo, b.done] };
      });
      ok('G1/M9 titolo cambiato nel calendario su un dispositivo e «fatta» sull’altro: tutte e due, da qualunque parte si unisca',
        JSON.stringify(cal.a) === JSON.stringify(['Colloquio (spostato sala B)', true]) && JSON.stringify(cal.b) === JSON.stringify(cal.a), cal);
      await chiudi(D);
    }
    /* ------------------------------------------- 4. annullare arriva e resta */
    {
      const [T, P] = await gruppo(['telefono', 'pc']);
      const stato = (p) => p.evaluate(() => { const s = LM.load(); const a = s.azioni[0], h = s.abitudini[0];
        return { azioneFatta: !!(a && a.done), xp: s.xp, abitudineSpuntata: !!(h && Object.keys(h.fatti).length), studio: s.areeAttive.includes('studio'), orari: !!(s.ritmoGiorno || {})[LM.todayKey()] }; });
      await P.evaluate(() => { const a = LM.aggiungiAzione('Bolletta', null); LM.completaAzione(a.id); const h = LM.aggiungiAbitudine('Leggere', null, [0, 1, 2, 3, 4, 5, 6]); LM.completaAbitudine(h.id); LM.setRitmoGiorno(LM.todayKey(), { sveglia: '06:30' }); });
      await B.calmaTutti([T, P], 2500);
      const prima = await stato(T);
      ok('4 (preparazione) il telefono vede azione fatta, abitudine spuntata, orari del giorno', prima.azioneFatta && prima.abitudineSpuntata && prima.orari && prima.xp > 0, prima);
      await T.evaluate(() => { const s = LM.load(); LM.completaAzione(s.azioni[0].id); LM.completaAbitudine(s.abitudini[0].id); LM.toggleArea('studio', false); LM.azzeraRitmoGiorno(LM.todayKey()); });
      await B.calmaTutti([T, P], 3000);
      const t1 = await stato(T), p1 = await stato(P);
      ok('4 quello annullato sul telefono arriva al pc (spunte, punti, area, orari)', JSON.stringify(t1) === JSON.stringify(p1) && !p1.azioneFatta && !p1.abitudineSpuntata && !p1.studio && !p1.orari && p1.xp === 0, { telefono: t1, pc: p1 });
      /* una nota catturata vale un punto: è l'unica cosa che deve cambiare */
      await P.evaluate(() => LM.cattura('nota qualunque dal pc')); await B.calmaTutti([T, P], 3000);
      const t2 = await stato(T);
      ok('4 e dopo una scrittura del pc non torna indietro sul telefono', JSON.stringify(Object.assign({}, t2, { xp: t1.xp + 1 })) === JSON.stringify(t2) && JSON.stringify(Object.assign({}, t2, { xp: t1.xp })) === JSON.stringify(t1), { prima: t1, dopo: t2 });
      /* l'annulla del diario (tornare a un punto) arriva anch'esso. Creare e
         spuntare a distanza: due gesti, due punti */
      await T.evaluate(() => LM.aggiungiAzione('Da spuntare e poi annullare', null));
      await T.waitForTimeout(400);
      await T.evaluate(() => LM.completaAzione(LM.load().azioni.find((a) => a.testo === 'Da spuntare e poi annullare').id));
      await B.calmaTutti([T, P], 2500);
      const tornato = await T.evaluate(() => { const ps = LM.puntiDiRitorno(); return ps.length ? LM.tornaAlPunto(ps[0].fino) : false; });
      await B.calmaTutti([T, P], 3000);
      const v = await P.evaluate(() => (LM.load().azioni.find((a) => a.testo === 'Da spuntare e poi annullare') || {}).done);
      ok('4 «annulla» dal diario (torna al punto prima della spunta) arriva al pc', tornato && v === false, { tornato, sulPc: v });
      await chiudi([T, P]);
    }
    /* ------------------------------------ 3. dispositivo nuovo e profilo */
    {
      await N.pulisci();
      const T = await B.dispositivo('telefono', { tipo: 'iphone' });
      await B.accedi(T, 'mario', 'mario@prova.it');
      await T.evaluate(() => { const s = LM.load(); s.onboarded = true; s.profilo.nome = 'Mario'; s.profilo.visione = 'Vivere con calma'; s.profilo.ritmo.sveglia = '06:00'; s.profilo.timer = { pomodoro: 50, pausa: 10 }; s.profilo.modo = 'dark'; LM.save(); });
      await B.calma(T, 2000);
      const prof = (p) => p.evaluate(() => { const s = LM.load(); return { nome: s.profilo.nome, visione: s.profilo.visione, sveglia: s.profilo.ritmo.sveglia, pomodoro: s.profilo.timer && s.profilo.timer.pomodoro, modo: s.profilo.modo }; });
      const atteso = await prof(T);
      /* un iPad nuovo apre l'app, ci gira un po' da ospite, e poi entra */
      const I = await B.dispositivo('ipad-nuovo', { tipo: 'ipad' });
      await I.waitForTimeout(1500);
      await I.evaluate(() => { const s = LM.load(); s.onboarded = true; s.profilo.nome = ''; LM.save(); });
      await B.accedi(I, 'mario', 'mario@prova.it'); await B.calmaTutti([T, I], 3000);
      ok('3 un iPad nuovo entra: il profilo resta quello del telefono, ovunque', JSON.stringify(await prof(T)) === JSON.stringify(atteso) && JSON.stringify(await prof(I)) === JSON.stringify(atteso), { atteso, telefono: await prof(T), ipad: await prof(I) });
      /* l'altro indirizzo del sito, nello stesso browser: un'origine nuova */
      const X = await B.dispositivo('altro-indirizzo', { ctx: T.ctx, host: 'localhost' });
      await B.accedi(X, 'mario', 'mario@prova.it'); await B.calmaTutti([T, X], 3000);
      ok('3 il primo accesso dall’altro indirizzo del sito non azzera il profilo', JSON.stringify(await prof(T)) === JSON.stringify(atteso) && JSON.stringify(await prof(X)) === JSON.stringify(atteso), { telefono: await prof(T), altro: await prof(X) });
      /* il browser che ha cancellato i dati (Safari dopo sette giorni) */
      await X.close();
      const T3 = await B.dispositivo('telefono-reinstallato', { tipo: 'iphone' });
      await B.accedi(T3, 'mario', 'mario@prova.it'); await B.calmaTutti([T, T3], 3000);
      ok('3 dati del browser cancellati, si rientra: il nome non si perde', (await prof(T3)).nome === 'Mario' && (await prof(T)).nome === 'Mario', { telefono: await prof(T), reinstallato: await prof(T3) });
      /* e una modifica vera al profilo fatta dal dispositivo nuovo, dopo, vince */
      await T3.evaluate(() => { const s = LM.load(); s.profilo.nome = 'Mario Rossi'; LM.save(); }); await B.calmaTutti([T, T3], 3000);
      ok('3 una modifica al profilo fatta dopo, dal dispositivo nuovo, arriva a tutti', (await prof(T)).nome === 'Mario Rossi', await prof(T));
      await chiudi([T, I, T3]);
    }
    /* --------------------------------------------------- 8. orologi sbagliati */
    {
      const D = await gruppo(['telefono', 'pc'], { pc: { skew: -120000 } });
      const [A, P] = D;
      await A.evaluate(() => LM.aggiungiAzione('creata sul telefono', null)); await B.calmaTutti(D, 2000);
      await P.evaluate(() => LM.rimuoviAzione(LM.load().azioni.find((a) => a.testo === 'creata sul telefono').id)); await B.calmaTutti(D, 3000);
      await A.evaluate(() => LM.cattura('scrive il telefono')); await B.calmaTutti(D, 3000);
      const r = { telefono: await az(A), pc: await az(P), cloud: await azCloud(D.uid) };
      ok('8 pc con l’orologio 2 minuti indietro cancella: sparisce dappertutto e non risorge', Object.values(r).every((v) => !v.includes('creata sul telefono')), r);
      await chiudi(D);
      const D2 = await gruppo(['telefono', 'pc'], { pc: { skew: 3 * 3600000 } });
      const [A2, P2] = D2;
      await P2.evaluate(() => { const s = LM.load(); s.profilo.modo = 'dark'; LM.save(); }); await B.calmaTutti(D2, 2000);
      await A2.evaluate(() => { const s = LM.load(); s.profilo.modo = 'light'; LM.save(); }); await B.calmaTutti(D2, 2000);
      await P2.evaluate(() => LM.cattura('pc scrive')); await B.calmaTutti(D2, 3000);
      const modi = [await A2.evaluate(() => LM.load().profilo.modo), await P2.evaluate(() => LM.load().profilo.modo)];
      ok('8 pc con l’orologio 3 ore avanti: il tema cambiato DOPO sul telefono resta, ovunque', modi.every((m) => m === 'light'), modi);
      await chiudi(D2);
    }
    /* ------------------------------------------------- 10. punti in parallelo */
    {
      const D = await gruppo(['telefono', 'pc']);
      const [A, P] = D;
      await A.ctx.setOffline(true); await P.ctx.setOffline(true);
      await A.evaluate(() => { const a = LM.aggiungiAzione('t', null); LM.completaAzione(a.id); });
      await P.evaluate(() => { const a = LM.aggiungiAzione('p', null); LM.completaAzione(a.id); const b = LM.aggiungiAzione('p2', null); LM.completaAzione(b.id); });
      const xa = await A.evaluate(() => LM.load().xp), xp = await P.evaluate(() => LM.load().xp);
      await A.ctx.setOffline(false); await P.ctx.setOffline(false); await B.calmaTutti(D, 6000);
      const xs = [await A.evaluate(() => LM.load().xp), await P.evaluate(() => LM.load().xp)];
      ok('10 i punti guadagnati offline su due dispositivi si sommano (' + xa + ' + ' + xp + ')', xs.every((x) => x === xa + xp), xs);
      await chiudi(D);
    }
    /* ------------------------------------------------------ 13. Azzera tutto */
    {
      const D = await gruppo(['telefono', 'pc', 'ipad']);
      const [A, P, C] = D;
      await A.evaluate(() => { for (let i = 0; i < 5; i++) LM.aggiungiAzione('cosa ' + i, null); LM.registraCheckin(3, 3, 3); LM.aggiungiArea('Musica', 'music'); LM.rinominaArea('studio', 'Università'); LM.toggleArea('lavoro', false); LM.valutaArea('studio', 4); });
      await B.calmaTutti(D, 2500);
      await C.ctx.setOffline(true);
      await A.evaluate(() => LM.reset(true)); await B.calmaTutti([A, P], 3000);
      await C.evaluate(() => LM.aggiungiAzione('scritta offline sull’iPad DOPO l’azzeramento', null));
      await C.ctx.setOffline(false); await B.calmaTutti(D, 5000);
      const conta = (p) => p.evaluate(() => { const s = LM.load(); return { azioni: s.azioni.map((a) => a.testo).join(','), checkins: s.checkins.length, aree: s.aree.map((a) => a.nome).sort().join(','), attive: s.areeAttive.slice().sort().join(','), voti: Object.keys(s.valutazioni).length, diario: s.registro.filter((r) => !/azzerat/i.test(r.testo)).length }; });
      const z = { telefono: await conta(A), pc: await conta(P), ipad: await conta(C) };
      ok('13 «Azzera tutto» con l’account: tutti uguali, senza le cose di prima, senza l’area Musica né la rinomina, aree riaccese, diario vuoto',
        [z.pc, z.ipad].every((x) => JSON.stringify(x) === JSON.stringify(z.telefono)) && !/cosa \d/.test(z.pc.azioni) && !z.pc.aree.split(',').some((n) => n === 'Musica' || n === 'Università') && /lavoro/.test(z.pc.attive) && z.pc.voti === 0 && z.pc.checkins === 0, z);
      ok('13 …e la cosa scritta offline DOPO l’azzeramento resta', /DOPO/.test(z.telefono.azioni), z.telefono.azioni);
      ok('13 …e il diario di prima non c’è più', z.pc.diario <= 2, z.pc.diario);
      await chiudi(D);
    }
    /* ------------------------------------------------- i SOSPETTI, provati */
    {
      await N.pulisci();
      const p = await B.dispositivo('banco', { tipo: 'pc' });
      /* più di tremila righe azzerate: nessuna torna */
      const r1 = await p.evaluate(() => {
        localStorage.clear(); LM.ricarica();
        const s = LM.load();
        for (let i = 0; i < 3500; i++) s.azioni.push({ id: 'r' + i, areaId: 'altro', testo: 'riga ' + i, ifThen: '', mit: false, done: false, data: LM.todayKey(), doneAt: null, creata: Date.now() - 1000 * i, ora: null, durata: null, passoDi: null });
        LM.save();
        const prima = JSON.parse(JSON.stringify(LM.snapshot()));
        LM.reset(true);
        const fuso = LM.unisci(prima, LM.snapshot());
        return { righeTornate: fuso.azioni.length, lapidi: LM.snapshot().cancellati.length };
      });
      ok('sospetto: «Azzera tutto» oltre 3000 righe, poi la fusione con una copia di prima: non torna nessuna riga', r1.righeTornate === 0, r1);
      /* un dispositivo fermo più a lungo di quanto durano le lapidi */
      const r2 = await p.evaluate(() => {
        localStorage.clear(); LM.ricarica();
        const anno = 365 * 86400000;
        const vecchio = LM.statoVuoto();
        vecchio.updatedAt = Date.now() - 3 * anno;
        vecchio.azioni.push({ id: 'vecchia', areaId: 'altro', testo: 'cancellata tre anni fa altrove', ifThen: '', mit: false, done: false, data: '2023-01-01', doneAt: null, creata: Date.now() - 3 * anno - 1000, ora: null, durata: null, passoDi: null });
        vecchio.valutazioni['2023-01-01'] = { studio: 3 };
        const cloud = LM.statoVuoto();
        cloud.updatedAt = Date.now();
        cloud.azioni.push({ id: 'nuova', areaId: 'altro', testo: 'scritta di recente', ifThen: '', mit: false, done: false, data: LM.todayKey(), doneAt: null, creata: Date.now() - 1000, ora: null, durata: null, passoDi: null });
        /* senza la regola dell'assenza lunga la riga vecchia tornerebbe (la lapide è scaduta) */
        const senza = LM.unisci(vecchio, cloud);
        const con = LM.unisci(vecchio, cloud, { assenzaLunga: { da: Date.now() - 3 * anno + 1000 } });
        return { senza: senza.azioni.map((a) => a.id).join(','), con: con.azioni.map((a) => a.id).join(','), votiCon: Object.keys(con.valutazioni).join(',') };
      });
      ok('sospetto: un dispositivo fermo da tre anni non fa risorgere quello che è stato cancellato nel frattempo', r2.con === 'nuova' && r2.votiCon === '', r2);
      /* l'app applica la regola da sé, quando l'ultima sincronizzazione è lontana */
      const legge = require('fs').readFileSync(require('path').join(__dirname, '..', 'src', 'nuvola', 'nuvola.ts'), 'utf8');
      ok('sospetto: e la nuvola la chiede quando l’ultima sincronizzazione di questo dispositivo è lontana', /assenzaLunga\s*=\s*\{\s*da:\s*ultima\s*\}/.test(legge));
      /* un check-in modificato non diventa un doppione */
      const r3 = await p.evaluate(() => {
        localStorage.clear(); LM.ricarica();
        LM.registraCheckin(2, 2, 2, 'stanco');
        const a = JSON.parse(JSON.stringify(LM.snapshot()));
        const s = LM.load(); s.checkins[0].energia = 4; s.checkins[0].contesto = 'meglio dopo pranzo'; LM.save();
        const b = JSON.parse(JSON.stringify(LM.snapshot()));
        const f1 = LM.unisci(a, b), f2 = LM.unisci(b, a);
        return { n1: f1.checkins.length, n2: f2.checkins.length, e1: f1.checkins[0].energia, e2: f2.checkins[0].energia };
      });
      ok('sospetto: un check-in modificato (energia, contesto) resta uno solo, con la modifica, da qualunque parte si unisca', r3.n1 === 1 && r3.n2 === 1 && r3.e1 === 4 && r3.e2 === 4, r3);
      /* una voce del diario non si modifica mai: si aggiunge. Due voci con la
         stessa ora e lo stesso testo sono la stessa voce. */
      const r4 = await p.evaluate(() => {
        localStorage.clear(); LM.ricarica();
        LM.registra('dati', 'una riga', true); LM.save();
        const a = JSON.parse(JSON.stringify(LM.snapshot()));
        const f = LM.unisci(a, JSON.parse(JSON.stringify(a)));
        return f.registro.filter((r) => r.testo === 'una riga').length;
      });
      ok('sospetto: il diario unito con sé stesso non raddoppia', r4 === 1, r4);
      await p.ctx.close();
    }
    for (const p of B.tutti) if (p.__err.length) ok('nessun errore in pagina su ' + p.__nome, false, p.__err.slice(0, 2));
  } catch (e) {
    ok('la prova è arrivata in fondo', false, String(e && e.stack || e));
  } finally {
    await B.chiudi(); srv.close(); await E.spegni();
  }
  console.log(guai() ? '\n' + guai() + ' problemi' : '\ntutto a posto');
  process.exit(guai() ? 1 : 0);
})();
