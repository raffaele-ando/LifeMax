/* IL BROWSER DELLE PROVE NON ESCE, NEMMENO PER SBAGLIO (verifica del 27
   novembre 2026, revisione/cloud3/RAPPORTO.md, «un incidente da
   dichiarare»). Le `route` di Playwright bloccano le richieste verso fuori,
   ma un rimando (302) restituito da una route non ripassa dalla route, e
   Chromium lo segue col proxy di sistema: così due richieste di una prova
   sono arrivate davvero al sito di produzione. Con queste due opzioni il
   browser non usa proxy e non risolve nessun nome che non sia la macchina
   stessa: anche un rimando sbagliato muore qui. */
'use strict';
module.exports = ['--no-proxy-server', '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1'];
