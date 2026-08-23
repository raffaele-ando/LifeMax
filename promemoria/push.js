/* WEB PUSH, CIFRATURA E FIRMA — RFC 8291 (aes128gcm) e RFC 8292 (VAPID).
   Scritto con la sola WebCrypto, quindi gira dentro un Cloudflare Worker:
   il pacchetto `web-push` di npm dipende da Node e là non funziona.

   Perché aes128gcm e non `aesgcm`: `aesgcm` è lo schema vecchio (bozza 04) e
   il servizio push di Apple — quello che serve Safari e le app aggiunte alla
   schermata Home dell'iPhone — accetta SOLO aes128gcm. Con lo schema vecchio
   le notifiche arriverebbero su Android e non sull'iPhone.

   La cifratura è verificata byte per byte contro `http_ece`, la libreria che
   usa `web-push`: vedi promemoria/prova.mjs. */

const B = {
  /* base64url senza riempimento, nei due sensi */
  da(s) {
    const b = atob(String(s).replace(/-/g, '+').replace(/_/g, '/'));
    const u = new Uint8Array(b.length);
    for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
    return u;
  },
  a(u) {
    let s = '';
    const v = new Uint8Array(u);
    for (let i = 0; i < v.length; i++) s += String.fromCharCode(v[i]);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
};

function unisci(pezzi) {
  let n = 0;
  for (const p of pezzi) n += p.length;
  const out = new Uint8Array(n);
  let i = 0;
  for (const p of pezzi) { out.set(p, i); i += p.length; }
  return out;
}
const testo = (s) => new TextEncoder().encode(s);

/* HKDF di WebCrypto fa estrazione ed espansione in un colpo, che è
   esattamente quello che chiede la specifica */
async function hkdf(sale, ikm, info, byte) {
  const k = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: sale, info: info }, k, byte * 8));
}

/* la chiave pubblica di una coppia P-256, nei 65 byte non compressi */
async function pubblicaGrezza(coppia) {
  return new Uint8Array(await crypto.subtle.exportKey('raw', coppia.publicKey));
}

/* IL CORPO CIFRATO
   salt(16) | rs(4) | lunghezza chiave(1) | chiave pubblica nostra(65) | AES-GCM */
export async function cifra(iscrizione, testoChiaro, opz = {}) {
  const uaPub = B.da(iscrizione.keys.p256dh);
  const auth = B.da(iscrizione.keys.auth);
  const sale = opz.sale || crypto.getRandomValues(new Uint8Array(16));
  const rs = opz.rs || 4096;

  const mia = opz.coppia || await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPub = await pubblicaGrezza(mia);

  const altrui = await crypto.subtle.importKey(
    'raw', uaPub, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const segreto = new Uint8Array(await crypto.subtle.deriveBits(
    { name: 'ECDH', public: altrui }, mia.privateKey, 256));

  /* «WebPush: info» lega la chiave alle DUE chiavi pubbliche: senza, lo stesso
     segreto potrebbe essere riusato altrove */
  const infoChiave = unisci([testo('WebPush: info'), new Uint8Array([0]), uaPub, asPub]);
  const ikm = await hkdf(auth, segreto, infoChiave, 32);

  const cek = await hkdf(sale, ikm, unisci([testo('Content-Encoding: aes128gcm'), new Uint8Array([0])]), 16);
  const nonce = await hkdf(sale, ikm, unisci([testo('Content-Encoding: nonce'), new Uint8Array([0])]), 12);

  const chiave = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  /* 0x02 chiude l'ultimo (e unico) record */
  const dentro = unisci([testoChiaro, new Uint8Array([2])]);
  const cifrato = new Uint8Array(await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce, tagLength: 128 }, chiave, dentro));

  const testa = new Uint8Array(21);
  testa.set(sale, 0);
  new DataView(testa.buffer).setUint32(16, rs, false);
  testa[20] = asPub.length;
  return unisci([testa, asPub, cifrato]);
}

/* LA FIRMA (VAPID): un JWT ES256 che dice «sono io che mando» */
export async function intestazioneVapid(endpoint, vapid) {
  const aud = new URL(endpoint).origin;
  const testaJwt = B.a(testo(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const corpo = B.a(testo(JSON.stringify({
    aud: aud,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: vapid.soggetto
  })));
  const daFirmare = testo(testaJwt + '.' + corpo);

  /* la privata VAPID sono 32 byte grezzi: WebCrypto vuole una JWK, e per
     costruirla serve anche la pubblica (che è quella che pubblichiamo) */
  const pub = B.da(vapid.pubblica);
  const jwk = {
    kty: 'EC', crv: 'P-256', ext: true,
    d: vapid.privata,
    x: B.a(pub.slice(1, 33)),
    y: B.a(pub.slice(33, 65))
  };
  const k = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const firma = new Uint8Array(await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' }, k, daFirmare));
  const jwt = testaJwt + '.' + corpo + '.' + B.a(firma);
  return { Authorization: 'vapid t=' + jwt + ', k=' + vapid.pubblica };
}

/* MANDA. Torna lo stato HTTP: 201 è consegnato al servizio push,
   404 e 410 vogliono dire «questa iscrizione non esiste più». */
export async function manda(iscrizione, dati, vapid, opz = {}) {
  const corpo = await cifra(iscrizione, testo(JSON.stringify(dati)), opz);
  const testa = await intestazioneVapid(iscrizione.endpoint, vapid);
  const r = await fetch(iscrizione.endpoint, {
    method: 'POST',
    headers: {
      ...testa,
      'Content-Encoding': 'aes128gcm',
      'Content-Type': 'application/octet-stream',
      TTL: String(opz.ttl || 3600),
      Urgency: opz.urgenza || 'normal'
    },
    body: corpo
  });
  /* Non basta il numero. Quando Apple o Google rifiutano, il perché lo
     scrivono nel corpo — «BadJwtToken», «UnauthorizedRegistration», «the key
     in the token pairs with a different application server key» — e senza
     quella riga un 401 e un 403 si somigliano troppo per sapere quale delle
     due chiavi rimettere. Si tronca perché è per un pannello, non per un log. */
  let detto = '';
  try { detto = (await r.text()).trim().slice(0, 300); } catch (e) { detto = ''; }
  return { stato: r.status, detto: detto };
}

export const base64url = B;
