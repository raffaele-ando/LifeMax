/* LE DUE CHIAVI (VAPID).
   Servono ai servizi push per sapere che quelle notifiche le manda sempre lo
   stesso mittente. Sono una coppia: la pubblica finisce nell'app e la vedono
   tutti, la privata resta un segreto del Worker.

     node promemoria/chiavi.mjs

   Non serve installare niente: usa la crittografia che Node ha già dentro.

   LA PRIVATA NON SI MANDA A NESSUNO — nemmeno a me, nemmeno in chat, e non
   va mai scritta in un file del repository. Va solo dentro `wrangler secret
   put VAPID_PRIVATA`, che la tiene su Cloudflare e non la stampa più.
   Chi ha la privata può mandare notifiche a nome tuo: è quello, il danno. */

const coppia = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
const pub = new Uint8Array(await crypto.subtle.exportKey('raw', coppia.publicKey));
const priv = await crypto.subtle.exportKey('jwk', coppia.privateKey);
const b64 = (u) => Buffer.from(u).toString('base64url');

console.log('');
console.log('  PUBBLICA   (va nell’app, e si può mostrare)');
console.log('  ' + b64(pub));
console.log('');
console.log('  PRIVATA    (solo dentro il Worker — non mandarla a nessuno)');
console.log('  ' + priv.d);
console.log('');
console.log('  Poi, dentro la cartella promemoria/:');
console.log('    npx wrangler secret put VAPID_PUBBLICA   → incolla la pubblica');
console.log('    npx wrangler secret put VAPID_PRIVATA    → incolla la privata');
console.log('    npx wrangler secret put VAPID_SOGGETTO   → mailto:la-tua@mail');
console.log('');
