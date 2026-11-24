/* ============================================================
   CHI STA CHIEDENDO — il «gettone» di Firebase, controllato qui.

   L'app, quando parla con la sentinella, manda il gettone (ID token) che
   Firebase le ha dato all'accesso con Google. È un JWT firmato da Google con
   RS256: tre pezzi separati da un punto — intestazione, contenuto, firma.
   Dentro c'è `sub`, l'identificativo dell'utente (lo stesso `uid` del
   documento Firestore), e la sentinella lo usa per sapere DI CHI sono i
   calendari di cui si parla.

   Non serve nessun account di servizio di Firebase: basta controllare la
   firma con le chiavi PUBBLICHE di Google, che stanno a un indirizzo noto e
   cambiano ogni qualche giorno. Il resto sono regole scritte da Firebase:
     · `alg` deve essere RS256, e `kid` una delle chiavi pubblicate
     · `iss` = https://securetoken.google.com/<progetto>
     · `aud` = <progetto>
     · `exp` nel futuro, `iat` e `auth_time` non nel futuro
     · `sub` una stringa non vuota, al massimo 128 caratteri
   Un gettone che non passa anche una sola di queste è un estraneo.
   ============================================================ */

const CHIAVI = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const MARGINE = 300; /* secondi di tolleranza per gli orologi un po' avanti */

/* le chiavi si tengono in memoria per quanto dice Google (Cache-Control) */
const cache = { url: '', chiavi: null, scade: 0 };

function b64urlBytes(s) {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
  const out = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) out[i] = b.charCodeAt(i);
  return out;
}
function b64urlJson(s) {
  return JSON.parse(new TextDecoder().decode(b64urlBytes(s)));
}

async function chiavi(url, forza) {
  if (!forza && cache.chiavi && cache.url === url && cache.scade > Date.now()) return cache.chiavi;
  const r = await fetch(url);
  if (!r.ok) throw new Error('chiavi di Google non raggiungibili (' + r.status + ')');
  const j = await r.json();
  const m = /max-age=(\d+)/.exec(r.headers.get('cache-control') || '');
  const per = {};
  (j.keys || []).forEach(function (k) { if (k && k.kid) per[k.kid] = k; });
  cache.url = url;
  cache.chiavi = per;
  cache.scade = Date.now() + (m ? Math.min(+m[1], 86400) : 3600) * 1000;
  return per;
}

/* torna l'uid se il gettone è buono, `null` se no. Non lancia mai per un
   gettone sbagliato: lancia solo se non si riesce a sapere (rete). */
export async function verificaGettone(gettone, progetto, url) {
  if (typeof gettone !== 'string' || gettone.length > 4096) return null;
  const pezzi = gettone.split('.');
  if (pezzi.length !== 3) return null;
  let testa, corpo;
  try { testa = b64urlJson(pezzi[0]); corpo = b64urlJson(pezzi[1]); } catch { return null; }
  if (!testa || testa.alg !== 'RS256' || typeof testa.kid !== 'string') return null;
  const ora = Math.floor(Date.now() / 1000);
  if (!corpo || corpo.iss !== 'https://securetoken.google.com/' + progetto) return null;
  if (corpo.aud !== progetto) return null;
  if (typeof corpo.exp !== 'number' || corpo.exp <= ora) return null;
  if (typeof corpo.iat !== 'number' || corpo.iat > ora + MARGINE) return null;
  if (corpo.auth_time !== undefined && (typeof corpo.auth_time !== 'number' || corpo.auth_time > ora + MARGINE)) return null;
  if (typeof corpo.sub !== 'string' || !corpo.sub || corpo.sub.length > 128) return null;

  const dove = url || CHIAVI;
  let tutte = await chiavi(dove, false);
  /* una chiave nuova che non conosciamo ancora: si richiedono, una volta */
  if (!tutte[testa.kid]) tutte = await chiavi(dove, true);
  const jwk = tutte[testa.kid];
  if (!jwk) return null;
  let chiave;
  try {
    chiave = await crypto.subtle.importKey('jwk', { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  } catch { return null; }
  let firma;
  try { firma = b64urlBytes(pezzi[2]); } catch { return null; }
  const buono = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', chiave, firma,
    new TextEncoder().encode(pezzi[0] + '.' + pezzi[1]));
  return buono ? corpo.sub : null;
}

/* per le prove: dimentica le chiavi tenute in memoria */
export function dimenticaChiavi() { cache.url = ''; cache.chiavi = null; cache.scade = 0; }
