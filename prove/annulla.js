/* Annullare dal diario.
   Nasce da «non posso annullare le cose che faccio per ogni cosa». Prima si
   poteva solo dentro i sette secondi di un messaggino, e su due azioni in
   croce. Adesso ogni cambiamento lascia un punto a cui tornare, e il diario
   — che è la lista di quello che hai fatto — ha il tasto per disfarlo.

   Questa prova tiene ferme le cose che rendono l'annulla fidato: che
   compaia solo dove c'è davvero un punto, che una cosa fatta si disfaccia
   per intero (XP compresi), che l'annulla si possa a sua volta annullare,
   che annullare una cosa vecchia avverta di quante altre rientrano, e che i
   punti restino dodici e fuori dai dati sincronizzati.

   node prove/annulla.js        (CHROMIUM=/percorso/di/chrome se serve)  */
const http=require('http'),fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const RADICE=path.join(__dirname,'..');
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml'};
let fail=0;const ok=(n,c,d)=>{if(!c)fail++;console.log('  '+(c?'ok  ':'KO  ')+n+(d?'  → '+d:''));};
(async()=>{const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';fs.readFile(path.join(RADICE,p),(e,d)=>{if(e){r.statusCode=404;r.end('x');return;}r.setHeader('Content-Type',T[path.extname(p)]||'application/octet-stream');r.end(d);});});
await new Promise(r=>srv.listen(8753,r));
const b=await chromium.launch({executablePath: process.env.CHROMIUM || undefined});
const p=await b.newPage({viewport:{width:390,height:900},hasTouch:true,isMobile:true});
const err=[];p.on('pageerror',e=>err.push(''+e));
await p.addInitScript(t=>{const D=Date;class F extends D{constructor(...a){if(!a.length)super(t);else super(...a);}static now(){return t;}}window.Date=F;}, new Date('2026-08-18T10:30:00').getTime());
await p.goto('http://localhost:8753/index.html');await p.waitForTimeout(400);
await p.evaluate(()=>{localStorage.clear();LM.seedDemo();});await p.reload();await p.waitForTimeout(800);

const alDiario = async () => { await p.evaluate(()=>{location.hash='#/plancia';});await p.waitForTimeout(700);
  await p.evaluate(()=>{const t=[...document.querySelectorAll('#sez-plancia button')].find(x=>/Diario/.test(x.textContent));if(t)t.click();});
  await p.waitForTimeout(700);
  await p.evaluate(()=>{const t=[...document.querySelectorAll('#diario-filtro button')].find(x=>/Tutto/.test(x.textContent));if(t)t.click();});
  await p.waitForTimeout(600); };

/* i punti creati dal seeding non c'entrano con quello che stiamo provando */
const pulisci = () => p.evaluate(()=>LM.scordaPunti());

console.log('PRIMA: nessun punto, nessun tasto');
await pulisci();
await alDiario();
ok('nessun «Annulla» finché non fai niente', (await p.evaluate(()=>document.querySelectorAll('[data-annulla]').length))===0);
ok('nessuna riga vecchia si crede annullabile', (await p.evaluate(()=>document.querySelectorAll('[data-annulla]').length))===0,
  'punti in memoria: '+await p.evaluate(()=>LM.puntiDiRitorno().length));

console.log('\nFACCIO UNA COSA E LA ANNULLO DAL DIARIO');
await p.evaluate(()=>{location.hash='#/oggi';});await p.waitForTimeout(800);
await pulisci();
const titolo=await p.evaluate(()=>document.querySelector('.focus-azione').textContent);
const xp0=await p.evaluate(()=>LM.load().xp);
const fatte0=await p.evaluate(()=>LM.azioniDiOggi().filter(a=>a.done).length);
await p.evaluate(()=>{document.getElementById('btn-fatto').click();});await p.waitForTimeout(800);
const xp1=await p.evaluate(()=>LM.load().xp);
ok('la cosa è fatta e gli XP sono saliti', xp1>xp0, xp0+' → '+xp1);
ok('c’è un punto a cui tornare', (await p.evaluate(()=>LM.puntiDiRitorno().length))>=1, String(await p.evaluate(()=>LM.puntiDiRitorno().length)));
await alDiario();
const n=await p.evaluate(()=>document.querySelectorAll('[data-annulla]').length);
ok('il diario mostra l’«Annulla» su UNA riga', n===1, n+' righe annullabili');
await p.evaluate(()=>{document.querySelector('[data-annulla]').click();});await p.waitForTimeout(900);
const dopo=await p.evaluate(()=>({xp:LM.load().xp, fatta:LM.load().azioni.some(a=>a.done&&a.testo===document.title)}));
ok('gli XP tornano come prima', dopo.xp===xp0, xp0+' → '+dopo.xp);
const fatte1=await p.evaluate(()=>LM.azioniDiOggi().filter(a=>a.done).length);
ok('la cosa non è più fatta', fatte1===fatte0, fatte0+' fatte prima, '+fatte1+' dopo l’annulla (titolo: '+titolo.trim()+')');
const toast=await p.evaluate(()=>[...document.querySelectorAll('.toast')].map(x=>x.textContent.replace(/\s+/g,' ').trim()));
ok('e il messaggio offre di rimettere', toast.some(x=>/Rimetti/.test(x)), JSON.stringify(toast));

console.log('\nL’ANNULLA DELL’ANNULLA');
await p.evaluate(()=>{const b=[...document.querySelectorAll('.toast button')].find(x=>/Rimetti/.test(x.textContent));if(b)b.click();});
await p.waitForTimeout(800);
ok('rimette com’era', (await p.evaluate(()=>LM.load().xp))===xp1, String(await p.evaluate(()=>LM.load().xp)));

console.log('\nUNA COSA VECCHIA: avvisa quante ne rientrano');
await p.evaluate(()=>{localStorage.clear();LM.seedDemo();});await p.reload();await p.waitForTimeout(800);
await pulisci();
await p.evaluate(()=>{['Uno','Due','Tre'].forEach(t=>LM.aggiungiAzione(t,'altro',{}));});
await p.waitForTimeout(400);
ok('tre cose fatte = tre punti', (await p.evaluate(()=>LM.puntiDiRitorno().length))===3, String(await p.evaluate(()=>LM.puntiDiRitorno().length)));
await alDiario();
const righe=await p.evaluate(()=>[...document.querySelectorAll('[data-annulla]')].map(b=>b.closest('.diario-evento').textContent.replace(/\s+/g,' ').trim().slice(0,40)));
console.log('        righe annullabili: '+JSON.stringify(righe.slice(0,4)));
// la più vecchia delle tre (l'ultima nell'ordine del diario, che è dal più recente)
await p.evaluate(()=>{const l=[...document.querySelectorAll('[data-annulla]')];l[l.length-1].click();});
await p.waitForTimeout(700);
const avv=await p.evaluate(()=>{const a=document.querySelector('.avviso');return a?a.textContent.replace(/\s+/g,' ').trim():null;});
ok('chiede conferma e dice quante rientrano', avv && /anche quello che hai fatto dopo: 2/.test(avv), avv);
await p.evaluate(()=>{const b=document.querySelector('.avv-si');if(b)b.click();});await p.waitForTimeout(900);
const restano=await p.evaluate(()=>LM.load().azioni.filter(a=>['Uno','Due','Tre'].indexOf(a.testo)>=0).map(a=>a.testo));
ok('tornando indietro rientrano tutte e tre', restano.length===0, JSON.stringify(restano));

console.log('\nIL LIMITE');
await p.evaluate(()=>{localStorage.clear();LM.seedDemo();});await p.reload();await p.waitForTimeout(800);
await pulisci();
await p.evaluate(()=>{for(let i=0;i<20;i++)LM.aggiungiAzione('Cosa '+i,'altro',{});});
await p.waitForTimeout(600);
const q=await p.evaluate(()=>({punti:LM.puntiDiRitorno().length, byte:(localStorage.getItem('lifemax.annulla.v1')||'').length}));
ok('i punti sono al massimo dodici', q.punti<=12, JSON.stringify(q));
ok('e non sono nel salvataggio sincronizzato', (await p.evaluate(()=>JSON.stringify(LM.load()).indexOf('lifemax.annulla')))<0);
ok('nessun errore JS', err.length===0, [...new Set(err)].join(' | '));
console.log(fail?'\n>>> '+fail+' PROBLEMI':'\n>>> TUTTO A POSTO');
await b.close();srv.close();process.exit(fail?1:0);})();
