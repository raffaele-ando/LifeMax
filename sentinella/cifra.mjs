/* ============================================================
   I PERMESSI DI GOOGLE E MICROSOFT, CHIUSI A CHIAVE.

   Il «refresh token» è la cosa più preziosa che la sentinella tiene: con
   quello si legge e si scrive il calendario di una persona senza chiederle
   più niente. Per questo non si scrive MAI in chiaro: si cifra con AES-GCM
   (256 bit) e una chiave che sta solo nei segreti del Worker
   (`CHIAVE_CALENDARI`), non nel codice e non nel repository.

   I DATI AGGIUNTI («AAD»): ogni permesso cifrato porta incollati, senza
   che si vedano, l'utente e il fornitore a cui appartiene. Un permesso
   copiato nella riga di un altro utente, o da Google a Microsoft, non si
   decifra: AES-GCM se ne accorge e rifiuta.

   La chiave può essere 32 byte in base64 (quella che consigliano le
   istruzioni) oppure una frase lunga almeno 32 caratteri: in quel caso si
   usa la sua impronta SHA-256. In tutti e due i casi resta segreta.
   ============================================================ */

function b64(b) {
  let s = '';
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s);
}
function da64(s) {
  const b = atob(s);
  const out = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) out[i] = b.charCodeAt(i);
  return out;
}

const chiavi = new Map();
async function chiave(segreto) {
  if (chiavi.has(segreto)) return chiavi.get(segreto);
  let grezza = null;
  try { const d = da64(segreto.trim()); if (d.length === 32) grezza = d; } catch { /* non è base64 */ }
  if (!grezza) grezza = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(segreto)));
  const k = await crypto.subtle.importKey('raw', grezza, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
  chiavi.set(segreto, k);
  return k;
}

/* la chiave c'è ed è abbastanza lunga? senza, la sentinella non parte */
export function chiaveValida(segreto) {
  return typeof segreto === 'string' && segreto.trim().length >= 32;
}

export async function cifra(segreto, testo, aad) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv, additionalData: new TextEncoder().encode(aad) },
    await chiave(segreto), new TextEncoder().encode(testo)));
  return 'v1.' + b64(iv) + '.' + b64(ct);
}

export async function decifra(segreto, scatola, aad) {
  const p = String(scatola || '').split('.');
  if (p.length !== 3 || p[0] !== 'v1') throw new Error('scatola non valida');
  const chiaro = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: da64(p[1]), additionalData: new TextEncoder().encode(aad) },
    await chiave(segreto), da64(p[2]));
  return new TextDecoder().decode(chiaro);
}

/* una stringa a caso, buona per `state` e per la sfida PKCE */
export function caso(n) {
  const b = crypto.getRandomValues(new Uint8Array(n));
  return b64(b).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export async function sfidaPkce(verificatore) {
  const h = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verificatore)));
  return b64(h).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
