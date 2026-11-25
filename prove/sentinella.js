/* LA SENTINELLA DEI CALENDARI (sentinella/), PROVATA DA SOLA.

   È il pezzo che tiene i permessi di Google e Microsoft di tutti, quindi le
   domande sono quasi tutte di sicurezza, e poi di affidabilità. Niente
   browser: si importa il Worker com'è e gli si parla con delle Request,
   davanti a un Google, un Microsoft e un Firebase finti
   (comune/sentinella-finta.js).

   LE COSE CHE CERCA
    1. senza segreti risponde «non configurato» e non si rompe niente; il
       sito passa com'era
    2. il gettone di Firebase: rifiutati quello firmato da altri, scaduto,
       per un altro progetto, senza firma; accettato quello buono
    3. CORS solo per i due indirizzi dell'app
    4. il collegamento con Google: PKCE, accesso «offline», `state` legato
       all'utente e al browser, usabile una volta; il permesso salvato
       CIFRATO (nel database non c'è un token in chiaro)
    5. lo specchio: i calendari accesi, la forma neutra, e degli invitati
       solo «sei l'organizzatore» e «ci sono altri» — nessun indirizzo
    6. il permesso breve scaduto si rinnova da solo, senza dire niente
    7. la sveglia (app chiusa): legge solo i cambiamenti col syncToken, e
       l'app riceve solo quelli; un syncToken scaduto fa rileggere tutto
    8. la coda: una modifica che non passa si ritenta da sola, una volta
       sola, e la stessa modifica mandata due volte fa UNA scrittura; il
       conflitto (cambiato là nel frattempo) non sovrascrive
    9. una creazione mandata due volte fa un evento solo
   10. Microsoft: il collegamento e il refresh token che cambia a ogni giro
   11. il permesso ritirato da Google: lo dice, senza riprovare all'infinito
   12. scollegare: ritira il permesso presso Google e cancella tutto
   13. il cron risveglia le sentinelle senza sveglia

   node prove/sentinella.js  */
'use strict';
const { mondo } = require('./comune/sentinella-finta');

let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d !== undefined && d !== '' ? '  → ' + d : '')); };
const SITO = 'https://lifemax.theproject.world';
const GIORNO = 86400000;

(async () => {
  const W = await mondo();
  const { G, M, env, ns, worker, gettone } = W;
  const tok = gettone('utente-uno');

  async function chiedi(via, corpo, o) {
    o = o || {};
    const h = { Origin: o.origine === undefined ? SITO : o.origine };
    if (o.biscotto) h.Cookie = o.biscotto;
    const req = new Request(SITO + via, corpo === undefined ? { method: o.metodo || 'GET', headers: h }
      : { method: 'POST', headers: Object.assign(h, { 'Content-Type': 'text/plain;charset=UTF-8' }), body: JSON.stringify(Object.assign({ gettone: o.gettone === undefined ? tok : o.gettone }, corpo)) });
    const r = await worker.fetch(req, o.env || env, { waitUntil() {} });
    let j = null;
    const t = await r.text();
    try { j = JSON.parse(t); } catch { j = t; }
    return { r, j };
  }
  /* il giro del collegamento come lo fa un browser: inizia → /vai (biscotto) → Google → ritorno */
  async function collega(p, o) {
    o = o || {};
    const a = await chiedi('/api/calendari/' + p + '/inizia', { ritorno: SITO + '/' }, { gettone: o.gettone });
    const vai = await chiedi(new URL(a.j.url).pathname + new URL(a.j.url).search);
    const biscotto = (vai.r.headers.get('set-cookie') || '').split(';')[0];
    const c = W.consenso(vai.r.headers.get('location'), o.consenso);
    const rit = await chiedi(new URL(c.url).pathname + new URL(c.url).search, undefined, { biscotto: o.senzaBiscotto ? '' : biscotto });
    /* tornata all'app, l'app CONFERMA: col suo gettone e col biscotto che il
       ritorno ha lasciato in questo browser (vedi `conferma` in sentinella.mjs) */
    const okB = (rit.r.headers.getSetCookie ? rit.r.headers.getSetCookie() : []).map((x) => x.split(';')[0]).find((x) => /^lmcal_ok_/.test(x) && !/=$/.test(x)) || '';
    let conf = null;
    if (!o.senzaConferma && /esito=da-confermare/.test(rit.r.headers.get('location') || '')) {
      conf = await chiedi('/api/calendari/' + p + '/conferma', {}, { gettone: o.gettone, biscotto: okB });
    }
    const dove = (rit.r.headers.get('location') || '').replace('esito=da-confermare', conf && conf.j && conf.j.ok ? 'esito=ok' : 'esito=non-confermato');
    return { a, vai, biscotto, c, rit, okB, conf, dove: dove };
  }
  const dump = () => {
    let t = '';
    for (const [, s] of ns.istanze) for (const tab of ['conti', 'cal', 'ev', 'coda', 'attese', 'meta']) {
      try { t += JSON.stringify(s.db.prepare('SELECT * FROM ' + tab).all()); } catch { /* non c'è */ }
    }
    return t;
  };

  /* ============================================== 1 */
  console.log('\n1. SENZA SEGRETI: «NON CONFIGURATO», E IL SITO COME PRIMA');
  {
    const vuoto = Object.assign({}, env, { GOOGLE_CLIENT_SECRET: '', MICROSOFT_CLIENT_SECRET: '', CHIAVE_CALENDARI: '' });
    const s = await chiedi('/api/calendari/stato', undefined, { env: vuoto });
    ok('lo stato dice che il server non gestisce niente', s.r.status === 200 && s.j.servizio.google === false && s.j.servizio.microsoft === false, JSON.stringify(s.j));
    const i = await chiedi('/api/calendari/google/inizia', { ritorno: SITO + '/' }, { env: vuoto });
    ok('collegare risponde «non configurato», non un errore', i.r.status === 409 && i.j.errore === 'non-configurato', i.r.status + ' ' + JSON.stringify(i.j));
    const senzaDO = Object.assign({}, env); delete senzaDO.SENTINELLA;
    const c = await chiedi('/api/calendari/cambi', { dopo: 0 }, { env: senzaDO });
    ok('senza il posto per i dati: 503 «non configurato»', c.r.status === 503 && c.j.errore === 'non-configurato');
    const pag = await worker.fetch(new Request(SITO + '/privacy.html'), env);
    ok('tutto quello che non è /api/ va ai file del sito', pag.status === 200 && /<html/i.test(await pag.text()));
    const s2 = await chiedi('/api/calendari/stato');
    ok('con i segreti, i due servizi ci sono', s2.j.servizio.google === true && s2.j.servizio.microsoft === true);
  }

  /* ============================================== 2 */
  console.log('\n2. IL GETTONE DI FIREBASE');
  {
    const prova = async (t) => (await chiedi('/api/calendari/cambi', { dopo: 0 }, { gettone: t })).r.status;
    ok('firmato da un altro: rifiutato', await prova(gettone('x', { chiave: W.estranea.privateKey })) === 401);
    ok('scaduto: rifiutato', await prova(gettone('x', { corpo: { exp: Math.floor(Date.now() / 1000) - 5 } })) === 401);
    ok('per un altro progetto (aud): rifiutato', await prova(gettone('x', { corpo: { aud: 'altro-progetto' } })) === 401);
    ok('emesso da un altro (iss): rifiutato', await prova(gettone('x', { corpo: { iss: 'https://securetoken.google.com/altro' } })) === 401);
    ok('con una chiave che non esiste: rifiutato', await prova(gettone('x', { kid: 'boh' })) === 401);
    const senzaFirma = gettone('x').split('.').slice(0, 2).join('.') + '.';
    ok('senza firma: rifiutato', await prova(senzaFirma) === 401);
    const nessuno = gettone('x').split('.');
    nessuno[0] = Buffer.from(JSON.stringify({ alg: 'none', kid: 'kid-finto' })).toString('base64url');
    ok('con «alg: none»: rifiutato', await prova(nessuno.join('.')) === 401);
    ok('senza gettone: rifiutato', await prova('') === 401);
    ok('quello buono passa', await prova(tok) === 200);
  }

  /* ============================================== 3 */
  console.log('\n3. CORS SOLO PER L’APP');
  {
    const a = await chiedi('/api/calendari/stato', undefined, { origine: SITO });
    const b = await chiedi('/api/calendari/stato', undefined, { origine: 'https://raffaele-ando.github.io' });
    const c = await chiedi('/api/calendari/stato', undefined, { origine: 'https://cattivo.example' });
    ok('lifemax.theproject.world sì', a.r.headers.get('access-control-allow-origin') === SITO);
    ok('raffaele-ando.github.io sì', b.r.headers.get('access-control-allow-origin') === 'https://raffaele-ando.github.io');
    ok('un altro sito no', !c.r.headers.get('access-control-allow-origin'));
    ok('niente si tiene in cache', a.r.headers.get('cache-control') === 'no-store');
  }

  /* ============================================== 4 */
  console.log('\n4. COLLEGARE GOOGLE DAL SERVER');
  const giorni = (n, ora) => new Date(Date.now() + n * GIORNO).toISOString().slice(0, 10) + (ora ? 'T' + ora + ':00Z' : '');
  G.metti('lavoro@gruppo', { id: 'v1', summary: 'Solo mio', start: { dateTime: giorni(1, '09:00') }, end: { dateTime: giorni(1, '10:00') }, organizer: { self: true } });
  G.metti('lavoro@gruppo', { id: 'v2', summary: 'Riunione', start: { dateTime: giorni(2, '09:00') }, end: { dateTime: giorni(2, '10:00') }, organizer: { self: true },
    attendees: [{ self: true, responseStatus: 'accepted', email: 'io@esempio.it' }, { email: 'anna@altrove.it', responseStatus: 'needsAction' }, { email: 'sala@risorse', resource: true }] });
  G.metti('lavoro@gruppo', { id: 'v3', summary: 'Invito di Luca', start: { dateTime: giorni(3, '09:00') }, end: { dateTime: giorni(3, '10:00') }, organizer: { self: false, email: 'luca@altrove.it' } });
  G.metti('lavoro@gruppo', { id: 'lontano', summary: 'Matrimonio di Sara', start: { date: giorni(300) }, end: { date: giorni(301) }, organizer: { self: true } });
  G.metti('lavoro@gruppo', { id: 'troppo', summary: 'Fra due anni', start: { date: giorni(730) }, end: { date: giorni(731) } });
  let seq = 0;
  {
    const x = await collega('google');
    const q = x.c.q;
    ok('l’app riceve un indirizzo NOSTRO, non quello di Google', new URL(x.a.j.url).host === 'lifemax.theproject.world' && /\/vai\?s=/.test(x.a.j.url), x.a.j.url.slice(0, 70));
    ok('da /vai si va da Google con PKCE (S256)', q.code_challenge_method === 'S256' && (q.code_challenge || '').length >= 43);
    ok('chiedendo l’accesso «offline» (il refresh token)', q.access_type === 'offline' && q.prompt === 'consent');
    ok('con i due permessi stretti, non quello pieno', /calendar\.events/.test(q.scope) && /calendarlist\.readonly/.test(q.scope) && !/auth\/calendar(\s|$)/.test(q.scope), q.scope);
    ok('e il ritorno al Worker', q.redirect_uri === SITO + '/api/calendari/google/ritorno');
    ok('/vai lascia un biscotto HttpOnly, solo per /api/calendari/', /HttpOnly/.test(x.vai.r.headers.get('set-cookie')) && /Path=\/api\/calendari\//.test(x.vai.r.headers.get('set-cookie')));
    const scambio = G.scambi.find((s) => s.grant_type === 'authorization_code');
    ok('il codice si scambia col segreto e con la chiave PKCE', scambio && scambio.client_secret === 'segreto-google-finto' && !!scambio.code_verifier);
    ok('si torna all’app con «da confermare»: il permesso non è ancora di nessuno', /^https:\/\/lifemax\.theproject\.world\/\?lmcal=google&esito=da-confermare#\/profilo$/.test(x.rit.r.headers.get('location') || ''), x.rit.r.headers.get('location'));
    ok('il ritorno lascia il segreto della conferma in un biscotto HttpOnly, solo per /api/calendari/', /^lmcal_ok_google=[0-9a-f]+\.[A-Za-z0-9_-]+$/.test(x.okB) &&
      (x.rit.r.headers.getSetCookie() || []).some((c) => /^lmcal_ok_google=/.test(c) && /HttpOnly/.test(c) && /Path=\/api\/calendari\//.test(c)), x.okB);
    ok('e l’app, confermando col suo gettone dallo stesso browser, lo fa suo', !!(x.conf && x.conf.j && x.conf.j.ok), x.conf && x.conf.j);
    ok('e nell’indirizzo non c’è nessun permesso', !/grt-|gat-|code=/.test(x.dove));
    /* lo stesso `state` una seconda volta */
    const di = W.consenso(x.vai.r.headers.get('location'));
    const ancora = await chiedi(new URL(di.url).pathname + new URL(di.url).search, undefined, { biscotto: x.biscotto });
    ok('lo stesso `state` non vale due volte', /esito=scaduto/.test(ancora.r.headers.get('location') || ''), ancora.r.headers.get('location'));
    const vai2 = await chiedi(new URL(x.a.j.url).pathname + new URL(x.a.j.url).search);
    ok('e nemmeno lo stesso /vai', vai2.r.status === 400);
    /* un altro browser (senza il biscotto) che porta il codice */
    const y = await collega('google', { senzaBiscotto: true });
    ok('un ritorno da un altro browser (senza il biscotto) non collega niente', /esito=altro-browser/.test(y.dove), y.dove);
    const inventato = await chiedi('/api/calendari/google/ritorno?code=x&state=' + 'a'.repeat(64) + '.zzz');
    ok('uno `state` inventato non porta da nessuna parte', /esito=scaduto/.test(inventato.r.headers.get('location') || ''));
    const d = dump();
    ok('nel database il permesso è CIFRATO: nessun token in chiaro', !/grt-|gat-/.test(d) && /"rt":"v1\./.test(d));
    const altro = await chiedi('/api/calendari/cambi', { dopo: 0 }, { gettone: gettone('utente-due') });
    ok('un altro utente non vede il collegamento del primo', altro.j.conti.google.collegato === false);
    const st = await chiedi('/api/calendari/cambi', { dopo: 0 });
    ok('il primo sì, con l’email dell’account', st.j.conti.google.collegato === true && st.j.conti.google.email === 'io@esempio.it', JSON.stringify(st.j.conti.google).slice(0, 120));
    ok('e l’elenco dei calendari', st.j.conti.google.calendari.length === 2);
    ok('ma ancora nessun evento: nessun calendario è acceso', st.j.eventi.length === 0);
  }

  /* ============================================== 5 */
  console.log('\n5. LO SPECCHIO');
  {
    const r = await chiedi('/api/calendari/cambi', { dopo: 0, accesi: { google: ['lavoro@gruppo'] } });
    const per = (id) => r.j.eventi.find((e) => e.id === id) || {};
    ok('acceso un calendario, gli eventi arrivano subito', ['v1', 'v2', 'v3'].every((i) => per(i).id), r.j.eventi.map((e) => e.id).join(','));
    ok('anche quelli fra dieci mesi', per('lontano').id === 'lontano' && per('lontano').tg && per('lontano').di === giorni(300), JSON.stringify(per('lontano')));
    ok('quello fra due anni no (lo specchio guarda 400 giorni)', !per('troppo').id);
    ok('solo tuo: organizzatore, senza altri', per('v1').org === true && per('v1').altri === false);
    ok('riunione: organizzatore, con altri (la sala non conta)', per('v2').org === true && per('v2').altri === true);
    ok('invito di un altro: non organizzatore', per('v3').org === false);
    ok('degli invitati non si legge né si tiene nessun indirizzo', !/anna@altrove|luca@altrove/.test(JSON.stringify(r.j) + dump()));
    const chiesta = G.richieste.filter((x) => /\/events$/.test(x.via) && x.metodo === 'GET').pop();
    ok('a Google si chiedono solo «self» e «resource» degli invitati', /attendees\(self,resource,responseStatus\)/.test((chiesta.q || {}).fields || ''), (chiesta.q || {}).fields);
    seq = r.j.seq;
    const r2 = await chiedi('/api/calendari/cambi', { dopo: seq });
    ok('chiedendo di nuovo, niente di nuovo', r2.j.eventi.length === 0 && !r2.j.completo);
  }

  /* ============================================== 6 */
  console.log('\n6. IL PERMESSO BREVE SCADUTO SI RINNOVA DA SOLO');
  {
    G.scadiAccessi();
    const prima = G.scambi.filter((s) => s.grant_type === 'refresh_token').length;
    const r = await chiedi('/api/calendari/google/calendari', {});
    ok('l’elenco arriva lo stesso', r.r.status === 200 && r.j.calendari.length === 2, r.r.status);
    ok('perché la sentinella ha usato il refresh token', G.scambi.filter((s) => s.grant_type === 'refresh_token').length === prima + 1);
    ok('e nessun «ricollega»', r.j.errore === undefined);
  }

  /* ============================================== 7 */
  console.log('\n7. A APP CHIUSA: LA SVEGLIA');
  {
    const h = ns.idFromName('utente-uno').toString();
    ok('dopo il collegamento c’è una sveglia', ns.istanze.get(h).sveglia !== null);
    G.metti('lavoro@gruppo', Object.assign({}, G.eventi['lavoro@gruppo'].v1, { summary: 'Solo mio (spostato)', start: { dateTime: giorni(1, '11:00') }, end: { dateTime: giorni(1, '12:00') } }));
    G.togli('lavoro@gruppo', 'v3');
    const da = G.richieste.length;
    await ns.suona(true);
    const lette = G.richieste.slice(da).filter((x) => /\/events$/.test(x.via));
    ok('legge solo i cambiamenti (syncToken)', lette.length && lette.every((x) => x.q.syncToken), JSON.stringify(lette.map((x) => Object.keys(x.q))));
    ok('e si rimette la sveglia', ns.istanze.get(h).sveglia > Date.now());
    const r = await chiedi('/api/calendari/cambi', { dopo: seq });
    ok('l’app, riaprendo, riceve solo quello che è cambiato', r.j.eventi.length === 2, r.j.eventi.map((e) => e.id + (e.via ? '(via)' : '')).join(','));
    ok('lo spostato con l’ora nuova', (r.j.eventi.find((e) => e.id === 'v1') || {}).t === 'Solo mio (spostato)');
    ok('e il cancellato come cancellato', (r.j.eventi.find((e) => e.id === 'v3') || {}).via === true);
    seq = r.j.seq;
    /* un syncToken che Google non accetta più */
    ns.istanze.get(h).db.prepare("UPDATE cal SET token = 'scaduto' WHERE c = 'lavoro@gruppo'").run();
    const da2 = G.richieste.length;
    await ns.suona(true);
    const l2 = G.richieste.slice(da2).filter((x) => /\/events$/.test(x.via));
    ok('un syncToken scaduto (410): si rilegge tutta la finestra', l2.length === 2 && l2[0].q.syncToken === 'scaduto' && l2[1].q.timeMin, JSON.stringify(l2.map((x) => x.q.syncToken || 'pieno')));
    const r2 = await chiedi('/api/calendari/cambi', { dopo: seq });
    ok('e senza novità finte per l’app', r2.j.eventi.length === 0, r2.j.eventi.map((e) => e.id).join(','));
  }

  /* ============================================== 8 */
  console.log('\n8. LA CODA: RITENTA, UNA VOLTA SOLA, E NON SOVRASCRIVE');
  {
    const v1 = G.eventi['lavoro@gruppo'].v1;
    const nuovo = Date.parse(giorni(1, '15:00'));
    const op = { k: 'agg-v1-1', tipo: 'aggiorna', p: 'google', c: 'lavoro@gruppo', id: 'v1', w: { tempo: { tuttoIlGiorno: false, inizio: nuovo, fine: nuovo + 3600e3, dataInizio: '', dataFine: '' }, se: v1.etag } };
    G.giu = 1;
    const r = await chiedi('/api/calendari/scrivi', { ops: [op] });
    ok('Google giù: la risposta dice «riprovo»', r.j.esiti[op.k] && r.j.esiti[op.k].tipo === 'rete', JSON.stringify(r.j.esiti));
    const patchPrima = G.richieste.filter((x) => x.metodo === 'PATCH').length;
    ns.istanze.get(ns.idFromName('utente-uno').toString()).db.prepare('UPDATE coda SET prossimo = 0').run();
    await ns.suona(true);
    ok('la sveglia la ritenta da sola, e va', G.eventi['lavoro@gruppo'].v1.start.dateTime === new Date(nuovo).toISOString(), G.eventi['lavoro@gruppo'].v1.start.dateTime);
    const r2 = await chiedi('/api/calendari/scrivi', { ops: [op] });
    ok('mandata di nuovo (stessa chiave): risponde la prima volta, senza scrivere', r2.j.esiti[op.k].ok === true && G.richieste.filter((x) => x.metodo === 'PATCH').length === patchPrima + 1);
    /* due uguali insieme */
    const v2 = G.eventi['lavoro@gruppo'].v2;
    const op2 = { k: 'tit-v2', tipo: 'aggiorna', p: 'google', c: 'lavoro@gruppo', id: 'v2', w: { testo: 'Riunione (nuovo titolo)', se: v2.etag } };
    const [a, b] = await Promise.all([chiedi('/api/calendari/scrivi', { ops: [op2] }), chiedi('/api/calendari/scrivi', { ops: [op2] })]);
    ok('due uguali nello stesso istante: una PATCH sola', a.j.esiti[op2.k].ok && b.j.esiti[op2.k].ok && G.richieste.filter((x) => x.metodo === 'PATCH' && /v2$/.test(x.via)).length === 1);
    /* cambiato là nel frattempo */
    G.metti('lavoro@gruppo', Object.assign({}, G.eventi['lavoro@gruppo'].v2, { summary: 'Riunione spostata da Anna' }));
    const op3 = { k: 'tit-v2-b', tipo: 'aggiorna', p: 'google', c: 'lavoro@gruppo', id: 'v2', w: { testo: 'Il mio titolo', se: v2.etag } };
    const c = await chiedi('/api/calendari/scrivi', { ops: [op3] });
    ok('cambiato là nel frattempo: non si sovrascrive, si dice «conflitto»', c.j.esiti[op3.k].conflitto === true && G.eventi['lavoro@gruppo'].v2.summary === 'Riunione spostata da Anna');
    const t = { k: 'via-v1', tipo: 'togli', p: 'google', c: 'lavoro@gruppo', id: 'v1' };
    await chiedi('/api/calendari/scrivi', { ops: [t] });
    const t2 = await chiedi('/api/calendari/scrivi', { ops: [Object.assign({}, t, { k: 'via-v1-bis' })] });
    ok('cancellare due volte: la seconda non è un errore', G.eventi['lavoro@gruppo'].v1.status === 'cancelled' && t2.j.esiti['via-v1-bis'].ok === true);
  }

  /* ============================================== 9 */
  console.log('\n9. UNA CREAZIONE MANDATA DUE VOLTE');
  {
    const ini = Date.parse(giorni(4, '18:00'));
    const op = (k) => ({ k: k, tipo: 'crea', p: 'google', c: 'lavoro@gruppo', testo: 'Palestra', chiave: 'lm1234abcd', tempo: { tuttoIlGiorno: false, inizio: ini, fine: ini + 45 * 60000, dataInizio: '', dataFine: '' } });
    await chiedi('/api/calendari/scrivi', { ops: [op('crea-a')] });
    const r = await chiedi('/api/calendari/scrivi', { ops: [op('crea-b')] });
    ok('un evento solo, con l’id scelto da LifeMax', Object.values(G.eventi['lavoro@gruppo']).filter((e) => e.summary === 'Palestra').length === 1 && r.j.esiti['crea-b'].e.id === 'lm1234abcd');
  }

  /* ======================================== 9b: COLLEGAMENTO CSRF (C2) */
  console.log('\n9b. UN COLLEGAMENTO COMINCIATO DA UN ALTRO, MANDATO COME LINK (verifica 2, C2)');
  {
    /* Il calendario «della vittima» è quello che il Google finto dà a chi
       dice sì: qui `lavoro@gruppo`. L'attaccante comincia col SUO account e
       NON apre il link; la vittima lo apre nel suo browser e dice sì. */
    const tA = gettone('attaccante-c2'), tV = gettone('vittima-c2');
    const a = await chiedi('/api/calendari/google/inizia', { ritorno: SITO + '/' }, { gettone: tA });
    const vai = await chiedi(new URL(a.j.url).pathname + new URL(a.j.url).search);
    const bisV = (vai.r.headers.get('set-cookie') || '').split(';')[0];
    const c = W.consenso(vai.r.headers.get('location'));
    const rit = await chiedi(new URL(c.url).pathname + new URL(c.url).search, undefined, { biscotto: bisV });
    const okV = (rit.r.headers.getSetCookie ? rit.r.headers.getSetCookie() : []).map((x) => x.split(';')[0]).find((x) => /^lmcal_ok_/.test(x) && !/=$/.test(x)) || '';
    ok('il ritorno nel browser della vittima NON dice «fatto»', !/esito=ok/.test(rit.r.headers.get('location') || ''), rit.r.headers.get('location'));
    /* l'attaccante prova a confermare dal suo browser (senza il biscotto) */
    const cA = await chiedi('/api/calendari/google/conferma', {}, { gettone: tA });
    ok('l’attaccante, dal suo browser, non può confermare', !(cA.j && cA.j.ok), cA.j);
    /* e anche se avesse il biscotto della vittima, ma col suo gettone */
    const cA2 = await chiedi('/api/calendari/google/conferma', { biscotto: okV }, { gettone: tA });
    ok('un biscotto messo nel corpo non conta', !(cA2.j && cA2.j.ok), cA2.j);
    /* la vittima, nel suo LifeMax, conferma: va alla SUA sentinella, dove non c'è niente */
    const cV = await chiedi('/api/calendari/google/conferma', {}, { gettone: tV, biscotto: okV });
    ok('la conferma della vittima non collega il suo calendario all’attaccante', !(cV.j && cV.j.ok), cV.j);
    const cal = await chiedi('/api/calendari/cambi', { dopo: 0, accesi: { google: ['lavoro@gruppo'] } }, { gettone: tA });
    ok('l’attaccante NON legge il calendario della vittima', !(cal.j.eventi || []).length && !(cal.j.conti && cal.j.conti.google && cal.j.conti.google.collegato), { eventi: (cal.j.eventi || []).length, conto: cal.j.conti && cal.j.conti.google });
    const w = await chiedi('/api/calendari/scrivi', { ops: [{ k: 'csrf1', p: 'google', tipo: 'crea', c: 'lavoro@gruppo', testo: 'Piantato dall’attaccante', tempo: { tuttoIlGiorno: false, inizio: Date.now() + 86400000, fine: Date.now() + 90000000, dataInizio: giorni(1), dataFine: giorni(1) }, chiave: 'csrf1' }] }, { gettone: tA });
    ok('e non ci scrive', !Object.values(G.eventi['lavoro@gruppo']).some((e) => /attaccante/.test(e.summary || '')), w.j && w.j.esiti);
    const d = dump();
    ok('il permesso in sospeso resta cifrato nel database', !/grt-|gat-/.test(d));
  }

  /* ============================================== 10 */
  console.log('\n10. MICROSOFT');
  {
    M.metti({ id: 'm1', subject: 'Call', isAllDay: false, isOrganizer: false, start: { dateTime: giorni(1, '08:00').slice(0, 19), timeZone: 'UTC' }, end: { dateTime: giorni(1, '09:00').slice(0, 19), timeZone: 'UTC' },
      attendees: [{ type: 'required', emailAddress: { address: 'capo@contoso.com', name: 'Capo' } }] });
    const x = await collega('microsoft');
    ok('collegato, con il segreto e PKCE', /esito=ok/.test(x.dove) && M.scambi[0].client_secret === 'segreto-microsoft-finto' && !!M.scambi[0].code_verifier, x.dove);
    ok('chiedendo offline_access', /offline_access/.test(x.c.q.scope));
    const r = await chiedi('/api/calendari/cambi', { dopo: 0, accesi: { microsoft: ['AAMkCal1'] } });
    const m1 = r.j.eventi.find((e) => e.id === 'm1') || {};
    ok('gli eventi di Outlook nello specchio, in UTC', m1.i === Date.parse(giorni(1, '08:00')) && m1.org === false && m1.altri === true, JSON.stringify(m1));
    ok('e anche qui nessun indirizzo degli invitati', !/capo@contoso/.test(dump()));
    /* il permesso breve scade: Microsoft cambia anche quello lungo */
    M.accessi.clear();
    const rtPrima = [...M.rinnovi.keys()];
    await chiedi('/api/calendari/microsoft/calendari', {});
    const rtDopo = [...M.rinnovi.keys()];
    ok('scaduto, si rinnova da solo e il refresh token nuovo sostituisce il vecchio', rtPrima.length === 1 && rtDopo.length === 1 && rtPrima[0] !== rtDopo[0]);
    M.accessi.clear();
    const r2 = await chiedi('/api/calendari/microsoft/calendari', {});
    ok('e al giro dopo il nuovo funziona', r2.r.status === 200, r2.r.status + ' ' + JSON.stringify(r2.j).slice(0, 80));
  }

  /* ============================================== 11 */
  console.log('\n11. IL PERMESSO RITIRATO DALLA PAGINA DI GOOGLE');
  {
    const due = gettone('utente-tre');
    await collega('google', { gettone: due });
    G.rinnovi.clear(); G.scadiAccessi();
    const r = await chiedi('/api/calendari/google/calendari', {}, { gettone: due });
    ok('la sentinella non può più rinnovare: lo dice', r.r.status >= 400 && r.j.errore === 'revocato', r.r.status + ' ' + JSON.stringify(r.j));
    const s = await chiedi('/api/calendari/cambi', { dopo: 0 }, { gettone: due });
    ok('e lo stato dice «revocato» (l’app mostra Ricollega)', s.j.conti.google.revocato === true);
    const quante = G.scambi.length;
    await chiedi('/api/calendari/cambi', { dopo: 0 }, { gettone: due });
    ok('e non riprova all’infinito', G.scambi.length === quante);
  }

  /* ============================================== 12 */
  console.log('\n12. SCOLLEGARE');
  {
    const rt = [...G.rinnovi.keys()];
    void rt;
    const h = ns.idFromName('utente-uno').toString();
    const db = ns.istanze.get(h).db;
    const rtUno = 'grt-1';
    const r = await chiedi('/api/calendari/google/scollega', {});
    ok('risponde sì', r.r.status === 200 && r.j.ok === true);
    ok('il permesso è stato ritirato presso Google', G.revocati.indexOf(rtUno) >= 0, G.revocati.join(','));
    const resta = ['conti', 'cal', 'ev', 'coda'].map((t) => db.prepare('SELECT COUNT(*) AS n FROM ' + t + " WHERE p = 'google'").get().n);
    ok('e di Google non resta niente: permesso, calendari, specchio, coda', resta.every((n) => n === 0), resta.join(','));
    const ms = db.prepare("SELECT COUNT(*) AS n FROM conti WHERE p = 'microsoft'").get().n;
    ok('Microsoft resta collegato', ms === 1);
    await chiedi('/api/calendari/microsoft/scollega', {});
    ok('scollegato anche quello, la sveglia si spegne', ns.istanze.get(h).sveglia === null);
  }

  /* ============================================== 13 */
  console.log('\n13. IL CRON RIMETTE LE SVEGLIE PERSE');
  {
    const quattro = gettone('utente-quattro');
    await collega('google', { gettone: quattro });
    const h = ns.idFromName('utente-quattro').toString();
    ns.istanze.get(h).sveglia = null;
    await worker.scheduled({}, env, { waitUntil: (p) => p });
    await new Promise((r) => setTimeout(r, 50));
    ok('la sentinella senza sveglia ne ha di nuovo una', ns.istanze.get(h).sveglia !== null);
  }

  /* ============================================== 14 */
  console.log('\n14. VERIFICA 2: I MINORI (m2 cron a rotazione, m4 proxy di /__/auth, m5 due collegamenti insieme)');
  {
    /* m5: due schede collegano Google insieme; il browser ha i due biscotti */
    const a1 = await chiedi('/api/calendari/google/inizia', { ritorno: SITO + '/' });
    const a2 = await chiedi('/api/calendari/google/inizia', { ritorno: SITO + '/' });
    const v1 = await chiedi(new URL(a1.j.url).pathname + new URL(a1.j.url).search);
    const v2 = await chiedi(new URL(a2.j.url).pathname + new URL(a2.j.url).search);
    const b1 = (v1.r.headers.get('set-cookie') || '').split(';')[0], b2 = (v2.r.headers.get('set-cookie') || '').split(';')[0];
    const c1 = W.consenso(v1.r.headers.get('location'));
    /* come un browser: un biscotto con lo stesso nome sostituisce il primo */
    const barattolo = new Map();
    [b1, b2].forEach((b) => { const i = b.indexOf('='); barattolo.set(b.slice(0, i), b.slice(i + 1)); });
    const r1 = await chiedi(new URL(c1.url).pathname + new URL(c1.url).search, undefined, { biscotto: [...barattolo].map(([k, v]) => k + '=' + v).join('; ') });
    ok('m5 due collegamenti insieme: il primo non dice «altro browser»', !/altro-browser/.test(r1.r.headers.get('location') || ''), r1.r.headers.get('location'));

    /* m4: il proxy dell'accesso non porta fuori biscotti e credenziali, e
       non riporta l'HSTS di Google */
    const vero = globalThis.fetch;
    let uscite = null;
    globalThis.fetch = async (url, o) => {
      const u = typeof url === 'string' ? url : url.url;
      if (/firebaseapp\.com\/__\/auth\//.test(u)) {
        uscite = new Headers(o && o.headers);
        return new Response('<html>handler</html>', { status: 200, headers: { 'Content-Type': 'text/html', 'Set-Cookie': 'g=1; Path=/', 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload' } });
      }
      return vero(url, o);
    };
    const rh = await worker.fetch(new Request(SITO + '/__/auth/handler?x=1', { headers: { Cookie: 'lmcal_google=segreto; altro=1', Authorization: 'Bearer abc' } }), env, { waitUntil() {} });
    globalThis.fetch = vero;
    ok('m4 /__/auth risponde con la pagina di Firebase', rh.status === 200 && /handler/.test(await rh.text()));
    ok('m4 verso Firebase non escono i biscotti né l’Authorization del nostro dominio', !!uscite && !uscite.get('cookie') && !uscite.get('authorization'), uscite && JSON.stringify([...uscite]));
    ok('m4 indietro non tornano i biscotti di Firebase né l’HSTS «includeSubDomains; preload»', !rh.headers.get('set-cookie') && !rh.headers.get('strict-transport-security'));

    /* m2: 45 sentinelle con la sveglia persa: in due ore il cron le
       rimette tutte, non sempre le stesse quaranta */
    const hh = [];
    for (let i = 0; i < 45; i++) {
      const g = gettone('folla-' + i);
      await collega('google', { gettone: g });
      hh.push(ns.idFromName('folla-' + i).toString());
    }
    for (const [, s] of ns.istanze) s.sveglia = null;
    const veroAdesso = Date.now;
    const ora0 = Math.floor(veroAdesso() / 3600000) * 3600000;
    for (let k = 0; k < 2; k++) {
      Date.now = () => ora0 + k * 3600000 + 60000;
      await worker.scheduled({}, env, { waitUntil: (p) => p });
      await new Promise((r) => setTimeout(r, 50));
    }
    Date.now = veroAdesso;
    const senza = hh.filter((h) => !ns.istanze.get(h) || ns.istanze.get(h).sveglia === null).length;
    ok('m2 45 sveglie perse: in due giri del cron ripartono tutte', senza === 0, senza + ' ancora senza sveglia');

    /* m3: chi ha il permesso ritirato non fa svegliare la sua sentinella
       ogni dieci minuti per sempre */
    const g3 = gettone('ritirato-m3');
    await collega('google', { gettone: g3 });
    const h3 = ns.idFromName('ritirato-m3').toString();
    ns.istanze.get(h3).db.prepare("UPDATE conti SET stato = 'revocato'").run();
    ns.istanze.get(h3).sveglia = 1;
    await ns.suona(true);
    ok('m3 permesso ritirato: dopo il giro la sentinella non si rimette la sveglia', ns.istanze.get(h3).sveglia === null, ns.istanze.get(h3).sveglia);
  }

  console.log(guai ? '\n>>> ' + guai + (guai === 1 ? ' PROBLEMA' : ' PROBLEMI') : '\n>>> TUTTO A POSTO');
  process.exit(guai ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
