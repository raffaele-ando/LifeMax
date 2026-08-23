/* IL POSTINO, PROVATO SENZA CLOUDFLARE.
   Un KV finto (una Map) e un servizio push finto (fetch intercettato): così
   si vede davvero il giro intero — l'app deposita il piano, passa il tempo,
   partono le notifiche, e non partono due volte.
     node promemoria/prova-worker.mjs   */
/* Si prova il Worker vero E il file unico da incollare in Cloudflare: quello
   è generato dai tre moduli, e senza girarci sopra le prove potrebbe restare
   verde mentre il file che finisce davvero online dice un'altra cosa.
     node promemoria/prova-worker.mjs            i moduli
     node promemoria/prova-worker.mjs --unico    il file da incollare */
const UNICO = process.argv.includes('--unico');
const worker = (await import(UNICO ? './worker-unico.js' : './worker.js')).default;
const { base64url: B } = await import('./push.js');

let fail = 0;
const ok = (n, c, d) => { if (!c) fail++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };
const T = (iso) => new Date(iso).getTime();

/* ---- il KV finto: quello vero ha proprio questi quattro metodi ---- */
function kvFinto() {
  const m = new Map();
  return {
    m,
    async get(k) { return m.has(k) ? m.get(k) : null; },
    async put(k, v) { m.set(k, v); },
    async delete(k) { m.delete(k); },
    async list({ prefix = '', cursor, limit = 1000 } = {}) {
      const tutte = [...m.keys()].filter((k) => k.startsWith(prefix)).sort();
      const da = cursor ? Number(cursor) : 0;
      const fetta = tutte.slice(da, da + limit);
      const fine = da + fetta.length >= tutte.length;
      return { keys: fetta.map((name) => ({ name })), list_complete: fine, cursor: fine ? null : String(da + fetta.length) };
    }
  };
}

/* ---- una coppia VAPID vera, generata qui: la firma deve poter partire ---- */
const coppia = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
const jwkPriv = await crypto.subtle.exportKey('jwk', coppia.privateKey);
const pubGrezza = new Uint8Array(await crypto.subtle.exportKey('raw', coppia.publicKey));

/* ---- una finta iscrizione: chiavi del "telefono" ---- */
const tel = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
const iscrizione = {
  endpoint: 'https://web.push.apple.com/finta/abc123',
  keys: {
    p256dh: B.a(new Uint8Array(await crypto.subtle.exportKey('raw', tel.publicKey))),
    auth: B.a(crypto.getRandomValues(new Uint8Array(16)))
  }
};

const env = () => ({
  PROMEMORIA: kvFinto(),
  VAPID_PUBBLICA: B.a(pubGrezza),
  VAPID_PRIVATA: jwkPriv.d,
  VAPID_SOGGETTO: 'mailto:prova@lifemax.invalid'
});

/* ---- il servizio push finto ---- */
let spedite = [];
let rispostaPush = 201;
const fetchVero = globalThis.fetch;
globalThis.fetch = async (url, opz) => {
  const u = String(url && url.url ? url.url : url);
  if (u.startsWith('https://web.push.apple.com/')) {
    spedite.push({ url: u, testa: opz.headers, byte: opz.body.length, corpo: opz.body });
    return new Response('', { status: rispostaPush });
  }
  return fetchVero(url, opz);
};

/* IL LATO CHE RICEVE (RFC 8291), per guardare dentro il pacchetto.
   Serve a una cosa sola: sapere che quello che l'app ha messo nel piano è
   arrivato fino in fondo. Guardare solo «è partita una richiesta» lascia
   passare un Worker che spedisce un pacchetto vuoto — o che perde per strada
   un campo aggiunto ieri. E di sponda è un giro completo: cifrato da noi,
   decifrato da noi, senza che le due metà si siano mai parlate. */
async function apri(corpoCifrato) {
  const b = new Uint8Array(corpoCifrato);
  const salt = b.slice(0, 16);
  const idlen = b[20];
  const asPub = b.slice(21, 21 + idlen);
  const cifrato = b.slice(21 + idlen);

  const asChiave = await crypto.subtle.importKey('raw', asPub, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const segreto = new Uint8Array(await crypto.subtle.deriveBits(
    { name: 'ECDH', public: asChiave }, tel.privateKey, 256));

  const T = (x) => new TextEncoder().encode(x);
  const unisci = (a) => { const n = a.reduce((t, x) => t + x.length, 0), o = new Uint8Array(n);
    let i = 0; for (const x of a) { o.set(x, i); i += x.length; } return o; };
  const hkdf = async (sale, ikm, info, len) => {
    const k = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
    return new Uint8Array(await crypto.subtle.deriveBits(
      { name: 'HKDF', hash: 'SHA-256', salt: sale, info: info }, k, len * 8));
  };
  const uaPub = B.da(iscrizione.keys.p256dh);
  const ikm = await hkdf(B.da(iscrizione.keys.auth), segreto,
    unisci([T('WebPush: info'), new Uint8Array([0]), uaPub, asPub]), 32);
  const cek = await hkdf(salt, ikm, unisci([T('Content-Encoding: aes128gcm'), new Uint8Array([0])]), 16);
  const nonce = await hkdf(salt, ikm, unisci([T('Content-Encoding: nonce'), new Uint8Array([0])]), 12);

  const kAes = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['decrypt']);
  const chiaro = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce }, kAes, cifrato));
  /* in coda c'è il delimitatore del record (0x02): si taglia */
  let fine = chiaro.length;
  while (fine > 0 && chiaro[fine - 1] === 0) fine--;
  if (fine > 0 && chiaro[fine - 1] === 2) fine--;
  return JSON.parse(new TextDecoder().decode(chiaro.slice(0, fine)));
}

const POST = (corpo) => new Request('https://x/piano', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo)
});
const VOCI = [
  { id: 'mattina', ora: '08:30', ripete: true, giorni: [], titolo: 'Cosa fai oggi', corpo: 'Scegli.', vai: '#/rituali' },
  { id: 'checkin', ora: '13:00', ripete: true, giorni: [], titolo: 'Check-in', corpo: 'Come stai?', vai: '#/rituali' }
];
const piano = (extra = {}) => Object.assign({
  id: 'dprova123', iscrizione, fuso: 'Europe/Rome', giorno: '2026-08-22', voci: VOCI
}, extra);
/* `scheduled` mette il lavoro in waitUntil: qui il contesto finto lo aspetta */
const cron = async (e, quando) => {
  const attese = [];
  await worker.scheduled({ scheduledTime: quando }, e, { waitUntil: (p) => attese.push(p) });
  await Promise.all(attese);
};

console.log('L’APP DEPOSITA IL PIANO');
let e = env();
let r = await worker.fetch(POST(piano()), e);
ok('risponde 200', r.status === 200, String(r.status));
ok('il record è in KV', e.PROMEMORIA.m.has('d:dprova123'), [...e.PROMEMORIA.m.keys()].join(','));
let rec = JSON.parse(e.PROMEMORIA.m.get('d:dprova123'));
ok('con le due voci', rec.voci.length === 2);
ok('e niente ancora mandato', rec.inviate.length === 0);
ok('c’è il permesso per l’altro dominio', r.headers.get('access-control-allow-origin') === '*');

console.log('\nIL GIRO DELLE 08:30');
spedite = [];
await cron(e, T('2026-08-22T06:30:00Z'));
ok('parte una notifica', spedite.length === 1, String(spedite.length));
ok('cifrata come vuole Apple', spedite[0] && spedite[0].testa['Content-Encoding'] === 'aes128gcm');
ok('firmata', /^vapid t=[\w-]+\.[\w-]+\.[\w-]+, k=/.test(spedite[0] && spedite[0].testa.Authorization || ''),
  (spedite[0] && spedite[0].testa.Authorization || '').slice(0, 30));
ok('e il segno è rimasto', JSON.parse(e.PROMEMORIA.m.get('d:dprova123')).inviate[0] === '2026-08-22|mattina',
  JSON.parse(e.PROMEMORIA.m.get('d:dprova123')).inviate.join(','));

console.log('\nCINQUE MINUTI DOPO NON SI RIPETE');
spedite = [];
await cron(e, T('2026-08-22T06:35:00Z'));
ok('niente', spedite.length === 0, String(spedite.length));
spedite = [];
await cron(e, T('2026-08-22T11:00:00Z'));
ok('ma alle 13:00 il check-in arriva', spedite.length === 1, String(spedite.length));

console.log('\nL’APP RISALVA: I SEGNI NON SI PERDONO');
/* prima era così: ogni tocco nell'app riscriveva il record da zero, e il
   promemoria delle 8:30 tornava a partire a ogni giro fino alle 10 */
await worker.fetch(POST(piano()), e);
ok('i segni sopravvivono al nuovo piano', JSON.parse(e.PROMEMORIA.m.get('d:dprova123')).inviate.length === 2,
  JSON.parse(e.PROMEMORIA.m.get('d:dprova123')).inviate.join(','));
spedite = [];
await cron(e, T('2026-08-22T11:05:00Z'));
ok('e non riparte niente', spedite.length === 0, String(spedite.length));

console.log('\nSE L’ISCRIZIONE NON ESISTE PIÙ, IL RECORD SPARISCE');
e = env(); await worker.fetch(POST(piano()), e);
rispostaPush = 410; spedite = [];
await cron(e, T('2026-08-22T06:30:00Z'));
ok('ha provato una volta', spedite.length === 1, String(spedite.length));
ok('e ha buttato il record', !e.PROMEMORIA.m.has('d:dprova123'), [...e.PROMEMORIA.m.keys()].join(','));
rispostaPush = 201;

console.log('\nSE IL SERVIZIO PUSH È GIÙ, SI RIPROVA');
e = env(); await worker.fetch(POST(piano()), e);
rispostaPush = 503; spedite = [];
await cron(e, T('2026-08-22T06:30:00Z'));
ok('nessun segno messo', JSON.parse(e.PROMEMORIA.m.get('d:dprova123')).inviate.length === 0);
rispostaPush = 201; spedite = [];
await cron(e, T('2026-08-22T06:35:00Z'));
ok('e la passata dopo ce la fa', spedite.length === 1, String(spedite.length));

console.log('\n«NON MANDARMI PIÙ NIENTE»');
r = await worker.fetch(new Request('https://x/piano/dprova123', { method: 'DELETE' }), e);
ok('risponde 200', r.status === 200);
ok('il record non c’è più', !e.PROMEMORIA.m.has('d:dprova123'));
spedite = [];
await cron(e, T('2026-08-22T11:00:00Z'));
ok('e non arriva più niente', spedite.length === 0);

console.log('\nQUELLO CHE ARRIVA DA FUORI VA CONTROLLATO');
e = env();
const rifiuta = async (nome, corpo) => {
  const rr = await worker.fetch(POST(corpo), e);
  ok(nome, rr.status === 400, String(rr.status));
};
await rifiuta('id storto', piano({ id: 'ma/../altro' }));
await rifiuta('id vuoto', piano({ id: '' }));
await rifiuta('senza iscrizione', piano({ iscrizione: null }));
await rifiuta('senza chiavi', piano({ iscrizione: { endpoint: iscrizione.endpoint } }));
await rifiuta('endpoint non di un servizio push', piano({ iscrizione: { endpoint: 'https://esempio.invalid/x', keys: iscrizione.keys } }));
await rifiuta('voci non è una lista', piano({ voci: 'ciao' }));
await rifiuta('troppe voci', piano({ voci: Array.from({ length: 41 }, (_, i) => ({ id: 'v' + i, ora: '09:00', titolo: 'x' })) }));
r = await worker.fetch(new Request('https://x/piano', { method: 'POST', body: 'non è json' }), e);
ok('corpo che non è json', r.status === 400, String(r.status));
ok('niente è finito in KV', e.PROMEMORIA.m.size === 0, String(e.PROMEMORIA.m.size));

console.log('\nUN TESTO LUNGHISSIMO NON PASSA INTERO');
e = env();
await worker.fetch(POST(piano({ voci: [{ id: 'mit', ora: '16:30', titolo: 'T'.repeat(500), corpo: 'C'.repeat(900), vai: '#/oggi' }] })), e);
rec = JSON.parse(e.PROMEMORIA.m.get('d:dprova123'));
ok('titolo tagliato', rec.voci[0].titolo.length === 80, String(rec.voci[0].titolo.length));
ok('corpo tagliato', rec.voci[0].corpo.length === 160, String(rec.voci[0].corpo.length));

console.log('\nLE ALTRE PORTE');
ok('/salute dice che è vivo', (await worker.fetch(new Request('https://x/salute'), e)).status === 200);
ok('una porta che non c’è dà 404', (await worker.fetch(new Request('https://x/altro'), e)).status === 404);
ok('OPTIONS passa (serve al browser)', (await worker.fetch(new Request('https://x/piano', { method: 'OPTIONS' }), e)).status === 204);

console.log('\nSENZA LA COPPIA VAPID NON PARTE NIENTE, MA NON CADE');
e = env(); e.VAPID_PRIVATA = '';
await worker.fetch(POST(piano()), e);
spedite = [];
await cron(e, T('2026-08-22T06:30:00Z'));
ok('nessuna notifica e nessun errore', spedite.length === 0);

console.log('\nLA NOTA FISSA E IL NUMERO SULL’ICONA');
e = env();
await worker.fetch(POST(piano({
  numero: 4,
  voci: [{ id: 'stato', ora: '07:30', ripete: true, giorni: [], tipo: 'stato',
    titolo: '3 cose aperte', corpo: 'Leggere · 1 abitudine', vai: '#/oggi' }]
})), e);
rec = JSON.parse(e.PROMEMORIA.m.get('d:dprova123'));
ok('il tipo «stato» arriva intero', rec.voci[0].tipo === 'stato', rec.voci[0].tipo);
ok('e il numero anche', rec.numero === 4, String(rec.numero));
spedite = [];
await cron(e, T('2026-08-22T05:30:00Z'));
ok('parte alle 07:30', spedite.length === 1, String(spedite.length));

/* il carico è cifrato, quindi per guardarci dentro si decifra: è l'unico modo
   di sapere che «tipo» e «numero» sono arrivati fino in fondo e non si sono
   persi a metà strada */
{
  const dentro = await apri(spedite[0].corpo);
  console.log('  dentro il pacchetto: ' + JSON.stringify(dentro));
  ok('il tipo è arrivato', dentro.tipo === 'stato', String(dentro.tipo));
  ok('il numero è arrivato', dentro.numero === 4, String(dentro.numero));
  ok('e il testo giusto', dentro.titolo === '3 cose aperte' && dentro.corpo === 'Leggere · 1 abitudine',
    dentro.titolo + ' / ' + dentro.corpo);
  ok('con dove andare', dentro.vai === '#/oggi', String(dentro.vai));
}

e = env();
await worker.fetch(POST(piano({ numero: 'tanti' })), e);
ok('un numero scritto male non passa', JSON.parse(e.PROMEMORIA.m.get('d:dprova123')).numero === null);
await worker.fetch(POST(piano({ voci: [{ id: 'x', ora: '09:00', titolo: 'x', tipo: 'inventato' }] })), e);
ok('un tipo inventato diventa un promemoria normale',
  JSON.parse(e.PROMEMORIA.m.get('d:dprova123')).voci[0].tipo === 'promemoria');

console.log('\n«MANDAMENE UNA ADESSO»');
/* La porta che serve a chi installa da solo: senza, l'unico modo di sapere se
   la catena funziona è aspettare le 08:30 di domani. */
e = env();
const prova = (corpo) => worker.fetch(new Request('https://x/prova', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo)
}), e);
r = await prova({ id: 'dprova123' });
ok('senza un piano non c’è nulla a cui mandarla', r.status === 404, String(r.status));
await worker.fetch(POST(piano({ numero: 2 })), e);
spedite = [];
r = await prova({ id: 'dprova123' });
ok('col piano, parte', r.status === 200 && spedite.length === 1, r.status + ' / ' + spedite.length);
{
  const dentro = await apri(spedite[0].corpo);
  ok('dice che è una prova', /prova/i.test(dentro.titolo), dentro.titolo);
  ok('e porta il numero da mettere sull’icona', dentro.numero === 2, String(dentro.numero));
}
ok('non lascia segni: non consuma il promemoria di domani',
  JSON.parse(e.PROMEMORIA.m.get('d:dprova123')).inviate.length === 0);
r = await prova({ id: 'ma/../altro' });
ok('un id storto no', r.status === 400, String(r.status));
/* il caso in cui «non arriva niente»: l'iscrizione non vale più */
rispostaPush = 410; spedite = [];
r = await prova({ id: 'dprova123' });
ok('se l’iscrizione è scaduta lo dice', r.status === 410, String(r.status));
ok('e butta il record, così riaccendendo se ne fa una nuova', !e.PROMEMORIA.m.has('d:dprova123'));
rispostaPush = 201;
e = env(); e.VAPID_PRIVATA = '';
await worker.fetch(POST(piano()), e);
r = await prova({ id: 'dprova123' });
ok('senza la coppia VAPID lo dice invece di fingere', r.status === 500, String(r.status));

console.log('\nLA FASCIA DI SILENZIO ARRIVA AL SERVER');
e = env();
await worker.fetch(POST(piano({ silenzio: { on: true, da: '23:00', a: '07:00' } })), e);
rec = JSON.parse(e.PROMEMORIA.m.get('d:dprova123'));
ok('la fascia è nel record', rec.silenzio && rec.silenzio.da === '23:00', JSON.stringify(rec.silenzio));
await worker.fetch(POST(piano({ silenzio: { on: true, da: 'boh', a: '07:00' } })), e);
ok('una fascia scritta male non passa',
  JSON.parse(e.PROMEMORIA.m.get('d:dprova123')).silenzio === null);

console.log('\nPIÙ DI UN DISPOSITIVO');
e = env();
for (const id of ['dtel1', 'dtel2', 'dtel3']) await worker.fetch(POST(piano({ id })), e);
spedite = [];
await cron(e, T('2026-08-22T06:30:00Z'));
ok('a tutti e tre', spedite.length === 3, String(spedite.length));

/* Il file da incollare è generato: se qualcuno modifica un modulo e si
   dimentica di rifarlo, online resta la versione di prima e nessuno se ne
   accorge — le prove sui moduli restano verdi. */
if (!UNICO) {
  console.log('\nIL FILE DA INCOLLARE È AGGIORNATO');
  const fs = await import('node:fs');
  const url = new URL('./worker-unico.js', import.meta.url);
  const prima = fs.readFileSync(url, 'utf8');
  const { execFileSync } = await import('node:child_process');
  execFileSync(process.execPath, [new URL('./impacchetta.mjs', import.meta.url).pathname], { stdio: 'ignore' });
  const dopo = fs.readFileSync(url, 'utf8');
  ok('rifacendolo viene identico', prima === dopo,
    prima === dopo ? '' : 'lancia: node promemoria/impacchetta.mjs');
}

console.log(fail ? '\n>>> ' + fail + ' PROBLEMI' : '\n>>> TUTTO A POSTO' + (UNICO ? ' (file unico)' : ' (moduli)'));
process.exit(fail ? 1 : 0);
