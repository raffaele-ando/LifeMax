/* LA CIFRATURA È GIUSTA? Si confronta byte per byte con `http_ece`, la
   libreria che usa `web-push` — quella che il mondo usa da anni. Stessi
   ingressi (chiavi, sale, coppia effimera): se un solo byte è diverso, il
   telefono non riuscirebbe a decifrare e la notifica non arriverebbe.
   Si controlla anche il JWT della firma: che si verifichi con la chiave
   pubblica e che dica le cose giuste.

   node promemoria/prova.mjs      (serve: npm i http_ece web-push)  */
import { cifra, intestazioneVapid, base64url as B } from './push.js';
import crypto32 from 'node:crypto';
import ece from 'http_ece';
import webpush from 'web-push';

let guai = 0;
const ok = (n, c, d) => { if (!c) guai++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

/* un'iscrizione finta ma con chiavi vere: è come quella che manda il telefono */
const cliente = crypto32.createECDH('prime256v1'); cliente.generateKeys();
const auth = crypto32.randomBytes(16);
const iscrizione = {
  endpoint: 'https://web.push.apple.com/finta',
  keys: { p256dh: cliente.getPublicKey().toString('base64url'), auth: auth.toString('base64url') }
};

/* la nostra coppia effimera e il sale, fissi, per poter confrontare */
const mioEcdh = crypto32.createECDH('prime256v1'); mioEcdh.generateKeys();
const sale = crypto32.randomBytes(16);
const testoChiaro = Buffer.from(JSON.stringify({ titolo: 'Check-in', corpo: 'Come va adesso?' }), 'utf8');

/* la stessa coppia, importata in WebCrypto: si passa dalla JWK */
const pub = mioEcdh.getPublicKey();
const jwk = {
  kty: 'EC', crv: 'P-256', ext: true,
  d: mioEcdh.getPrivateKey().toString('base64url'),
  x: pub.subarray(1, 33).toString('base64url'),
  y: pub.subarray(33, 65).toString('base64url')
};
const privWC = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
const pubWC = await crypto.subtle.importKey('jwk', { ...jwk, d: undefined }, { name: 'ECDH', namedCurve: 'P-256' }, true, []);

const mio = await cifra(iscrizione, new Uint8Array(testoChiaro), { sale: new Uint8Array(sale), coppia: { privateKey: privWC, publicKey: pubWC } });

/* lo stesso, con http_ece */
const atteso = ece.encrypt(testoChiaro, {
  version: 'aes128gcm',
  salt: sale.toString('base64url'),
  privateKey: mioEcdh,
  dh: cliente.getPublicKey().toString('base64url'),
  authSecret: auth.toString('base64url')
});

console.log('LA CIFRATURA (RFC 8291, aes128gcm)');
ok('stessa lunghezza', mio.length === atteso.length, mio.length + ' vs ' + atteso.length);
ok('stessi byte, tutti', Buffer.compare(Buffer.from(mio), atteso) === 0,
  Buffer.compare(Buffer.from(mio), atteso) === 0 ? mio.length + ' byte identici' :
    'primo byte diverso all’indice ' + [...mio].findIndex((b, i) => b !== atteso[i]));
/* e la testa è quella che il telefono si aspetta */
ok('il sale è in testa', Buffer.compare(Buffer.from(mio.slice(0, 16)), sale) === 0);
ok('la nostra chiave pubblica è dentro', mio[20] === 65 && Buffer.compare(Buffer.from(mio.slice(21, 86)), pub) === 0);

console.log('\nLA FIRMA (VAPID, RFC 8292)');
const chiavi = webpush.generateVAPIDKeys();
const h = await intestazioneVapid('https://web.push.apple.com/qualcosa/abc', {
  pubblica: chiavi.publicKey, privata: chiavi.privateKey, soggetto: 'mailto:io@esempio.it'
});
const [t, corpo, firma] = h.Authorization.replace(/^vapid t=/, '').split(', k=')[0].split('.');
const claims = JSON.parse(Buffer.from(corpo, 'base64url').toString());
ok('il destinatario è l’origine del servizio push', claims.aud === 'https://web.push.apple.com', claims.aud);
ok('scade entro 24 ore', claims.exp - Math.floor(Date.now() / 1000) <= 86400, String(claims.exp - Math.floor(Date.now() / 1000)) + 's');
ok('dice chi manda', /^mailto:/.test(claims.sub || ''), claims.sub);
ok('la chiave pubblica viaggia con la firma', h.Authorization.includes(', k=' + chiavi.publicKey));
/* la firma si verifica con la pubblica? */
const pubVapid = Buffer.from(chiavi.publicKey, 'base64url');
const kv = await crypto.subtle.importKey('jwk', {
  kty: 'EC', crv: 'P-256', ext: true,
  x: pubVapid.subarray(1, 33).toString('base64url'), y: pubVapid.subarray(33, 65).toString('base64url')
}, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
const buona = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, kv,
  Buffer.from(firma, 'base64url'), Buffer.from(t + '.' + corpo));
ok('la firma è valida', buona);

console.log(guai ? '\n>>> ' + guai + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
process.exit(guai ? 1 : 0);
