/* La prova della sola decisione che prende il server: chi tocca adesso.
   Non serve rete né Cloudflare — è tutta aritmetica su dati finti.
     node promemoria/prova-piano.mjs   */
import { dovute, potaSegni, oraLocale, minutiDaOra, endpointValido, inSilenzio, RITARDO_MAX, MAX_PER_VOLTA } from './piano.js';

let fail = 0;
const ok = (n, c, d) => { if (!c) fail++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

/* un istante preciso, scritto in UTC così la prova non dipende da dove gira */
const T = (iso) => new Date(iso).getTime();

const VOCI = [
  { id: 'mattina', ora: '08:30', ripete: true, giorni: [], titolo: 'Cosa fai oggi', corpo: '', vai: '#/rituali' },
  { id: 'checkin', ora: '13:00', ripete: true, giorni: [], titolo: 'Check-in', corpo: '', vai: '#/rituali' },
  { id: 'mit', ora: '16:30', ripete: false, giorni: [], titolo: 'La cosa più importante', corpo: 'x', vai: '#/oggi' },
  { id: 'sera', ora: '21:30', ripete: true, giorni: [], titolo: 'Com’è andata', corpo: '', vai: '#/rituali' },
  { id: 'ab-1', ora: '07:00', ripete: true, giorni: [1, 2, 3, 4, 5], titolo: 'Palestra', corpo: '', vai: '#/rituali' }
];
/* sabato 22 agosto 2026 */
const rec = (extra = {}) => Object.assign({ fuso: 'Europe/Rome', giorno: '2026-08-22', voci: VOCI, inviate: [] }, extra);

console.log('L’ORA È QUELLA DI CHI RICEVE, NON DEL SERVER');
/* 06:30 UTC d’estate a Roma sono le 08:30; a Tokyo le 15:30 */
ok('Roma in estate è UTC+2', oraLocale(T('2026-08-22T06:30:00Z'), 'Europe/Rome').minuti === 8 * 60 + 30);
ok('Tokyo è UTC+9', oraLocale(T('2026-08-22T06:30:00Z'), 'Asia/Tokyo').minuti === 15 * 60 + 30);
/* in inverno l’ora legale non c’è più: stesso 06:30 UTC = 07:30 a Roma */
ok('e in inverno cambia da sé', oraLocale(T('2026-01-22T06:30:00Z'), 'Europe/Rome').minuti === 7 * 60 + 30);
ok('il giorno locale può essere un altro',
  oraLocale(T('2026-08-22T23:30:00Z'), 'Asia/Tokyo').giorno === '2026-08-23',
  oraLocale(T('2026-08-22T23:30:00Z'), 'Asia/Tokyo').giorno);
ok('sabato è 6', oraLocale(T('2026-08-22T10:00:00Z'), 'Europe/Rome').settimana === 6);
ok('mezzanotte è 0 minuti', oraLocale(T('2026-08-21T22:10:00Z'), 'Europe/Rome').minuti === 10);
ok('un fuso scritto male non blocca tutto', oraLocale(T('2026-08-22T06:30:00Z'), 'Non/Esiste').minuti === 8 * 60 + 30);
ok('un’ora scritta male vale null', minutiDaOra('99:99') === null && minutiDaOra('') === null && minutiDaOra('8:5') === null);
ok('un’ora scritta bene si converte', minutiDaOra('08:30') === 510 && minutiDaOra('7:00') === 420);

console.log('\nA CHE ORA, E NON PRIMA');
const alle = (iso, r = rec()) => dovute(r, T(iso)).dovute.map((v) => v.id);
ok('alle 08:00 non è ancora niente', alle('2026-08-22T06:00:00Z').length === 0, JSON.stringify(alle('2026-08-22T06:00:00Z')));
ok('alle 08:30 tocca al mattino', JSON.stringify(alle('2026-08-22T06:30:00Z')) === '["mattina"]', JSON.stringify(alle('2026-08-22T06:30:00Z')));
ok('alle 08:34 tocca ancora (il cron passa ogni 5 min)', JSON.stringify(alle('2026-08-22T06:34:00Z')) === '["mattina"]');
ok('alle 13:05 tocca il check-in', JSON.stringify(alle('2026-08-22T11:05:00Z')) === '["checkin"]');

console.log('\nUN PROMEMORIA IN RITARDO NON SI MANDA');
ok('a ' + RITARDO_MAX + ' minuti passa ancora', alle('2026-08-22T08:00:00Z').includes('mattina'));
ok('a ' + (RITARDO_MAX + 1) + ' minuti no', !alle('2026-08-22T08:01:00Z').includes('mattina'));
ok('a mezzogiorno il mattino è andato', alle('2026-08-22T10:00:00Z').length === 0);

console.log('\nUNA VOLTA SOLA');
const r1 = rec();
const g1 = dovute(r1, T('2026-08-22T06:30:00Z'));
r1.inviate = potaSegni(r1.inviate, g1.giornoLocale, g1.segni);
ok('il segno è giorno+voce', r1.inviate[0] === '2026-08-22|mattina', r1.inviate[0]);
ok('cinque minuti dopo non si ripete', dovute(r1, T('2026-08-22T06:35:00Z')).dovute.length === 0);
ok('ma il check-in arriva comunque', dovute(r1, T('2026-08-22T11:00:00Z')).dovute.map((v) => v.id)[0] === 'checkin');

console.log('\nSE L’APP RESTA CHIUSA (il piano è di ieri)');
const vecchio = rec({ giorno: '2026-08-21' });
ok('i tre momenti valgono anche domani', alle('2026-08-22T06:30:00Z', vecchio).includes('mattina'));
ok('l’abitudine no, se non è il suo giorno', !alle('2026-08-22T05:00:00Z', vecchio).includes('ab-1'),
  JSON.stringify(alle('2026-08-22T05:00:00Z', vecchio)));
/* lunedì 24 agosto: alle 07:00 la palestra c’è */
ok('l’abitudine sì, nel suo giorno', alle('2026-08-24T05:00:00Z', vecchio).includes('ab-1'),
  JSON.stringify(alle('2026-08-24T05:00:00Z', vecchio)));
ok('la priorità di ieri non si ricorda domani', !alle('2026-08-22T14:30:00Z', vecchio).includes('mit'),
  JSON.stringify(alle('2026-08-22T14:30:00Z', vecchio)));
ok('mentre oggi sì', alle('2026-08-22T14:30:00Z').includes('mit'));

console.log('\nGIORNI DELLA SETTIMANA');
ok('sabato la palestra non suona', !alle('2026-08-22T05:00:00Z').includes('ab-1'));
ok('lunedì sì', alle('2026-08-24T05:00:00Z', rec({ giorno: '2026-08-24' })).includes('ab-1'));

console.log('\nNIENTE RAFFICHE');
const tante = rec({ voci: Array.from({ length: 8 }, (_, i) => ({ id: 'v' + i, ora: '09:00', ripete: true, giorni: [], titolo: 'v' + i })) });
ok('al massimo ' + MAX_PER_VOLTA + ' in un colpo', dovute(tante, T('2026-08-22T07:00:00Z')).dovute.length === MAX_PER_VOLTA,
  String(dovute(tante, T('2026-08-22T07:00:00Z')).dovute.length));

console.log('\nI SEGNI NON CRESCONO PER SEMPRE');
const potati = potaSegni(['2026-08-20|mattina', '2026-08-21|sera', '2026-08-22|mattina'], '2026-08-22', ['2026-08-22|checkin']);
ok('resta solo oggi, più i nuovi', JSON.stringify(potati.sort()) === '["2026-08-22|checkin","2026-08-22|mattina"]', JSON.stringify(potati));
ok('lo stesso segno due volte resta uno', potaSegni(['2026-08-22|x'], '2026-08-22', ['2026-08-22|x']).length === 1);

console.log('\nROBA SCRITTA MALE NON FA CADERE NIENTE');
ok('senza record', dovute(null, T('2026-08-22T06:30:00Z')).dovute.length === 0);
ok('senza voci', dovute({ fuso: 'Europe/Rome', giorno: '2026-08-22' }, T('2026-08-22T06:30:00Z')).dovute.length === 0);
ok('voci sporche', dovute(rec({ voci: [null, {}, { id: 'x', ora: 'boh', titolo: 'x' }] }), T('2026-08-22T06:30:00Z')).dovute.length === 0);

console.log('\nLA FASCIA DI SILENZIO');
/* Quasi sempre scavalca la mezzanotte (23:00→07:00), e quello è il caso in
   cui un confronto scritto in fretta sbaglia: «fra 23:00 e 07:00» non è
   «maggiore di 23:00 e minore di 07:00», che non è vero mai. */
const notte = { on: true, da: '23:00', a: '07:00' };
ok('a mezzanotte è silenzio', inSilenzio(notte, 0));
ok('alle 23:00 comincia', inSilenzio(notte, 23 * 60));
ok('alle 22:59 no', !inSilenzio(notte, 22 * 60 + 59));
ok('alle 06:59 ancora sì', inSilenzio(notte, 6 * 60 + 59));
ok('alle 07:00 è finita', !inSilenzio(notte, 7 * 60));
ok('a mezzogiorno no', !inSilenzio(notte, 12 * 60));
/* e una fascia che NON scavalca */
const pome = { on: true, da: '14:00', a: '16:00' };
ok('una fascia dentro il giorno: alle 15:00 sì', inSilenzio(pome, 15 * 60));
ok('e alle 13:59 no', !inSilenzio(pome, 13 * 60 + 59));
ok('spenta non è mai silenzio', !inSilenzio({ on: false, da: '23:00', a: '07:00' }, 0));
ok('senza fascia non è mai silenzio', !inSilenzio(null, 0));
ok('una fascia scritta male non zittisce tutto', !inSilenzio({ on: true, da: 'boh', a: '07:00' }, 3 * 60));
ok('e una fascia lunga zero nemmeno', !inSilenzio({ on: true, da: '07:00', a: '07:00' }, 7 * 60));

/* dentro il giro: una voce che cadrebbe nella fascia non parte */
ok('nella fascia non parte niente',
  dovute(rec({ silenzio: notte, voci: [{ id: 'x', ora: '23:30', ripete: true, giorni: [], titolo: 'x' }] }),
    T('2026-08-22T21:35:00Z')).dovute.length === 0);
ok('fuori dalla fascia parte',
  dovute(rec({ silenzio: notte, voci: [{ id: 'x', ora: '22:00', ripete: true, giorni: [], titolo: 'x' }] }),
    T('2026-08-22T20:05:00Z')).dovute.length === 1);
/* il caso che conta: una voce delle 21:30 che, per la regola del ritardo,
   arriverebbe alle 23:00 — dentro la fascia */
ok('un ritardo non entra in punta di piedi nella fascia',
  dovute(rec({ silenzio: notte, voci: [{ id: 'sera', ora: '21:30', ripete: true, giorni: [], titolo: 'sera' }] }),
    T('2026-08-22T21:00:00Z')).dovute.length === 0);

console.log('\nSOLO I SERVIZI PUSH VERI');
ok('Apple', endpointValido('https://web.push.apple.com/abc'));
ok('Google', endpointValido('https://fcm.googleapis.com/fcm/send/abc'));
ok('Mozilla', endpointValido('https://updates.push.services.mozilla.com/wpush/v2/abc'));
ok('Microsoft', endpointValido('https://par02p.notify.windows.com/w/?token=abc'));
ok('un indirizzo qualsiasi no', !endpointValido('https://esempio.invalid/qualcosa'));
ok('un finto sottodominio no', !endpointValido('https://web.push.apple.com.esempio.invalid/x'));
ok('http no', !endpointValido('http://web.push.apple.com/abc'));
ok('spazzatura no', !endpointValido('ciao'));

console.log(fail ? '\n>>> ' + fail + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
process.exit(fail ? 1 : 0);
