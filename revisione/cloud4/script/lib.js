/* Verifica 4 — banco comune dei riproduttori.
   Usa il banco del ramo (prove/comune/emulatore.js) dal worktree a354d5c:
   emulatore Firebase (Auth+Firestore, regole vere), Chromium senza proxy e
   senza DNS (prove/comune/chiuso.js), Google finto. Niente produzione. */
'use strict';
const path = require('path');
const fs = require('fs');
const S = '/tmp/claude-0/-home-user-LifeMax/99c3d469-10e9-545a-afc2-1ce7e01478d1/scratchpad';
process.env.LIFEMAX_EMULATORE = process.env.LIFEMAX_EMULATORE || path.join(S, 'audit-cloud', 'fbt');
process.env.CHROMIUM = process.env.CHROMIUM || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const WT = process.env.WT || path.join(S, 'audit4', 'wt');
const em = require(path.join(WT, 'prove', 'comune', 'emulatore.js'));
const RIS = path.join(S, 'audit4', 'ris');
fs.mkdirSync(RIS, { recursive: true });

function esiti(nome) {
  const righe = [];
  let ko = 0;
  return {
    ok(id, cond, dett) {
      if (!cond) ko++;
      const r = { id, esito: cond ? 'ok' : 'KO', dettaglio: dett };
      righe.push(r);
      console.log('  ' + (cond ? 'ok  ' : 'KO  ') + id + (dett !== undefined ? '  → ' + JSON.stringify(dett).slice(0, 700) : ''));
    },
    nota(id, dett) { righe.push({ id, esito: 'nota', dettaglio: dett }); console.log('  ..  ' + id + '  → ' + JSON.stringify(dett).slice(0, 700)); },
    fine() {
      fs.writeFileSync(path.join(RIS, nome + '.json'), JSON.stringify({ script: nome, commit: 'a354d5c', quando: new Date().toISOString(), ko, righe }, null, 2));
      console.log(ko ? '\n' + ko + ' KO' : '\ntutto ok');
      return ko;
    }
  };
}

async function banco(base) {
  const E = await em.accendi(base);
  const srv = await em.servi(E.P.sito, process.env.LIFEMAX_SITO);
  const B = em.banco(E), N = em.nuvola(E);
  await B.avvia();
  const chiudi = async () => { await B.chiudi(); srv.close(); await E.spegni(); };
  return { E, B, N, srv, chiudi };
}

module.exports = { em, banco, esiti, WT, RIS, S };
