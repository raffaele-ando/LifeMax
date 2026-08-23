/* Le chiavi fatte dalla pagina devono funzionare nel Worker.
   Non basta che la pagina stampi due stringhe: devono essere ESATTAMENTE la
   coppia che `intestazioneVapid` sa usare, altrimenti l'errore salta fuori
   solo a installazione finita, sotto forma di «401» in un registro.
   Questa prova apre la pagina in un browser vero, preme il pulsante, prende le
   due chiavi e ci firma un JWT — poi verifica la firma con la pubblica.

     node promemoria/prova-chiavi.mjs      (CHROMIUM=… se serve)  */
import path from 'path';
import { chromium } from 'playwright';
import { intestazioneVapid, base64url as B } from './push.js';

const QUI = path.dirname(new URL(import.meta.url).pathname);
let fail = 0;
const ok = (n, c, d) => { if (!c) fail++; console.log('  ' + (c ? 'ok  ' : 'KO  ') + n + (d ? '  → ' + d : '')); };

const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const p = await b.newPage();
const rete = [];
p.on('request', (r) => { if (!r.url().startsWith('file:')) rete.push(r.url()); });
const err = [];
p.on('pageerror', (e) => err.push('' + e));

await p.goto('file://' + path.join(QUI, 'chiavi.html'));

console.log('LA PAGINA');
ok('si apre senza errori', err.length === 0, err.join(' | '));
ok('all’inizio le chiavi non ci sono', await p.locator('#esito').isHidden());

await p.click('#vai');
await p.waitForSelector('#esito:visible', { timeout: 10000 });
const pub = await p.inputValue('#pub');
const priv = await p.inputValue('#priv');
console.log('  pubblica: ' + pub.slice(0, 24) + '…  (' + pub.length + ' caratteri)');
console.log('  privata:  ' + priv.slice(0, 6) + '…       (' + priv.length + ' caratteri)');

ok('la pubblica è lunga come deve (65 byte in base64url)', B.da(pub).length === 65, String(B.da(pub).length) + ' byte');
ok('e comincia con 0x04, cioè è un punto non compresso', B.da(pub)[0] === 4, '0x' + B.da(pub)[0].toString(16));
ok('la privata è di 32 byte', B.da(priv).length === 32, String(B.da(priv).length) + ' byte');
ok('sono in base64url, senza + / =', !/[+/=]/.test(pub + priv));

/* la cosa che conta davvero: la pagina NON parla con nessuno */
ok('la pagina non fa nessuna richiesta di rete', rete.length === 0, rete.join(' | ') || 'nessuna');

console.log('\nLE CHIAVI FUNZIONANO NEL WORKER');
const testa = await intestazioneVapid('https://web.push.apple.com/finta/abc', {
  pubblica: pub, privata: priv, soggetto: 'mailto:prova@lifemax.invalid'
});
const m = /^vapid t=([\w-]+)\.([\w-]+)\.([\w-]+), k=(.+)$/.exec(testa.Authorization);
ok('il Worker riesce a firmare con questa coppia', !!m, m ? '' : testa.Authorization.slice(0, 60));
ok('e allega la stessa pubblica', m && m[4] === pub);

const chiavePub = await crypto.subtle.importKey('raw', B.da(pub),
  { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
const valida = m && await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, chiavePub,
  B.da(m[3]), new TextEncoder().encode(m[1] + '.' + m[2]));
ok('la firma si verifica con la pubblica: sono una coppia', valida === true);

/* due volte non danno la stessa coppia: se le desse, ogni installazione al
   mondo avrebbe la stessa chiave privata */
await p.click('#vai');
await p.waitForTimeout(400);
ok('premendo di nuovo escono chiavi diverse', (await p.inputValue('#pub')) !== pub);

console.log(fail ? '\n>>> ' + fail + ' PROBLEMI' : '\n>>> TUTTO A POSTO');
await b.close();
process.exit(fail ? 1 : 0);
