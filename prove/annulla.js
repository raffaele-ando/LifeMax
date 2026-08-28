/* Annullare dal diario.
   Nasce da «non posso annullare le cose che faccio per ogni cosa». Prima si
   poteva solo dentro i sette secondi di un messaggino, e su due azioni in
   croce. Adesso ogni cambiamento lascia un punto a cui tornare, e il diario
   — che è la lista di quello che hai fatto — ha il tasto per disfarlo.

   Vale anche per il passato: quasi ogni riga del diario è un dato salvato
   (una spunta, un check-in, una review, una nota) e si disfa togliendo quel
   dato, a qualunque distanza di tempo. Il punto di ritorno serve solo alle
   righe di registro, che un dato da togliere non l'hanno.

   Questa prova tiene ferme le cose che rendono l'annulla fidato: che una
   riga vecchia si annulli senza punto in memoria, che gli XP tornino sul
   giorno giusto e non su oggi, che una cosa fatta si disfaccia per intero,
   che l'annulla si possa a sua volta annullare, che un solo tasto compaia
   per ogni cambiamento, che annullare col punto avverta di quante altre
   cose rientrano, e che i punti restino dodici e fuori dal salvataggio.

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
/* orologio fermo sul giorno, ma che scorre: con un istante identico per tutto
   i cambiamenti si sovrappongono in un unico punto e la prova misurerebbe un
   artefatto suo, non l'app */
await p.addInitScript(t=>{const D=Date;const base=D.now();
  class F extends D{constructor(...a){if(!a.length)super(t+(D.now()-base));else super(...a);}
    static now(){return t+(D.now()-base);}}
  window.Date=F;}, new Date('2026-08-18T10:30:00').getTime());
await p.goto('http://localhost:8753/index.html');await p.waitForTimeout(400);
await p.evaluate(()=>{localStorage.clear();LM.seedDemo();});await p.reload();await p.waitForTimeout(800);

const alDiario = async () => { await p.evaluate(()=>{location.hash='#/plancia';});await p.waitForTimeout(700);
  await p.evaluate(()=>{const t=[...document.querySelectorAll('#sez-plancia button')].find(x=>/Diario/.test(x.textContent));if(t)t.click();});
  await p.waitForTimeout(700);
  await p.evaluate(()=>{const t=[...document.querySelectorAll('#diario-filtro button')].find(x=>/Tutto/.test(x.textContent));if(t)t.click();});
  await p.waitForTimeout(600); };

/* i punti creati dal seeding non c'entrano con quello che stiamo provando */
const pulisci = () => p.evaluate(()=>LM.scordaPunti());

console.log('ANCHE IL PASSATO: le righe di prima si annullano');
await pulisci();
await alDiario();
const vecchie=await p.evaluate(()=>[...document.querySelectorAll('[data-annulla]')].map(b=>({
  tipo:b.getAttribute('data-tipo'), chiave:b.getAttribute('data-chiave')})));
ok('senza nessun punto in memoria ci sono comunque righe annullabili', vecchie.length>0,
  vecchie.length+' righe, punti: '+await p.evaluate(()=>LM.puntiDiRitorno().length));
ok('e ognuna sa qual è il dato da togliere', vecchie.every(v=>v.tipo&&v.chiave),
  JSON.stringify(vecchie.slice(0,3)));
/* le righe di registro raccontano un cambiamento senza esserlo: senza punto
   di ritorno non c'è niente da togliere, e il tasto non deve comparire */
const logSenzaTasto=await p.evaluate(()=>[...document.querySelectorAll('.diario-evento')]
  .filter(r=>r.querySelector('.diario-log')).filter(r=>r.querySelector('[data-annulla]')).length);
ok('le righe di registro vecchie non promettono un annulla che non c’è', logSenzaTasto===0, String(logSenzaTasto));

console.log('\nANNULLO UNA SPUNTA DI UN GIORNO PASSATO');
/* una cosa fatta in un altro giorno, e che sia una riga davvero in pagina:
   il diario ne mostra un tot per volta */
const ieri=await p.evaluate(()=>{const s=LM.load();const t=LM.todayKey();
  const ids=[...document.querySelectorAll('[data-tipo="azione"]')].map(b=>b.getAttribute('data-chiave'));
  const a=s.azioni.find(x=>x.done&&x.data!==t&&ids.indexOf(x.id)>=0);
  return a?{id:a.id,data:a.data,testo:a.testo}:null;});
ok('nel diario c’è una cosa fatta in un altro giorno', !!ieri, JSON.stringify(ieri));
const xpG0=await p.evaluate(k=>LM.load().xpPerGiorno[k]||0, ieri.data);
const xpT0=await p.evaluate(()=>LM.load().xp);
await p.evaluate(id=>{const b=[...document.querySelectorAll('[data-annulla]')]
  .find(x=>x.getAttribute('data-chiave')===id);b.click();}, ieri.id);
await p.waitForTimeout(800);
const fin=await p.evaluate(id=>{const s=LM.load();const a=s.azioni.find(x=>x.id===id);
  return {done:a.done, xp:s.xp};}, ieri.id);
ok('la spunta è via', fin.done===false);
ok('gli XP scendono in totale', fin.xp<xpT0, xpT0+' → '+fin.xp);
ok('e scendono sul giorno giusto, non su oggi',
  (await p.evaluate(k=>LM.load().xpPerGiorno[k]||0, ieri.data))<xpG0, xpG0+' → '+await p.evaluate(k=>LM.load().xpPerGiorno[k]||0, ieri.data));
const tst=await p.evaluate(()=>[...document.querySelectorAll('.toast')].map(x=>x.textContent.replace(/\s+/g,' ').trim()));
ok('niente conferma da leggere, e si può rimettere', tst.some(x=>/Rimetti/.test(x)) && !(await p.evaluate(()=>!!document.querySelector('.avviso'))), JSON.stringify(tst));
await p.evaluate(()=>{const b=[...document.querySelectorAll('.toast button')].find(x=>/Rimetti/.test(x.textContent));if(b)b.click();});
await p.waitForTimeout(700);
ok('«Rimetti» rimette la spunta di quel giorno', (await p.evaluate(id=>LM.load().azioni.find(x=>x.id===id).done, ieri.id))===true);

console.log('\nUNA NOTA VECCHIA SI TOGLIE, GLI ALTRI GIORNI RESTANO');
await p.evaluate(()=>{localStorage.clear();LM.seedDemo();});await p.reload();await p.waitForTimeout(800);
await pulisci();
await alDiario();
const nota=await p.evaluate(()=>{const b=[...document.querySelectorAll('[data-annulla]')]
  .find(x=>x.getAttribute('data-tipo')==='cattura');return b?b.getAttribute('data-chiave'):null;});
ok('c’è una nota annotata da annullare', !!nota, String(nota));
const inbox0=await p.evaluate(()=>LM.load().inbox.length);
await p.evaluate(k=>{[...document.querySelectorAll('[data-annulla]')]
  .find(x=>x.getAttribute('data-chiave')===k).click();}, nota);
await p.waitForTimeout(800);
const inbox1=await p.evaluate(()=>LM.load().inbox.length);
ok('la nota non c’è più', inbox1===inbox0-1, inbox0+' → '+inbox1);
ok('e non ha portato via nient’altro', (await p.evaluate(()=>LM.load().inbox.some(x=>!x.testo)))===false);

console.log('\nFACCIO UNA COSA E LA ANNULLO DAL DIARIO');
await p.evaluate(()=>{location.hash='#/oggi';});await p.waitForTimeout(800);
await pulisci();
const titolo=await p.evaluate(()=>document.querySelector('.focus-azione').textContent);
const xp0=await p.evaluate(()=>LM.load().xp);
await p.evaluate(()=>{document.getElementById('btn-fatto').click();});await p.waitForTimeout(800);
const xp1=await p.evaluate(()=>LM.load().xp);
ok('la cosa è fatta e gli XP sono saliti', xp1>xp0, xp0+' → '+xp1);
ok('c’è un punto a cui tornare', (await p.evaluate(()=>LM.puntiDiRitorno().length))>=1, String(await p.evaluate(()=>LM.puntiDiRitorno().length)));
await alDiario();
/* la riga si cerca per TESTO, non per id di azione: da quando la schermata
   «Adesso» può mostrare anche un'abitudine, quello che si è appena spuntato
   non è per forza un'azione — e cercando fra le azioni si finiva ad annullare
   tutt'altra cosa (l'ultima azione fatta dalla demo), con gli XP che non
   tornavano. Si annulla quello che si è fatto. */
const rigaFatta=(t)=>p.evaluate(tit=>{
  const r=[...document.querySelectorAll('.diario-evento')]
    .filter(e=>e.textContent.indexOf(tit.trim())>=0 && e.querySelector('[data-annulla]'));
  return r.length;
}, t);
const n=await rigaFatta(titolo);
ok('un «Annulla» per quella cosa, non due', n===1, n+' tasti per la stessa cosa');
/* il punto di ritorno appena creato è quello di questa riga, che però si
   disfa da sola: nessuna riga deve offrire la strada del punto (che
   riporterebbe indietro anche il resto) */
const conPunto=await p.evaluate(()=>[...document.querySelectorAll('[data-annulla]')].filter(b=>!b.getAttribute('data-tipo')).length);
ok('e nessun’altra riga si prende il punto di ritorno', conPunto===0, String(conPunto));
await p.evaluate(tit=>{
  const r=[...document.querySelectorAll('.diario-evento')]
    .find(e=>e.textContent.indexOf(tit.trim())>=0 && e.querySelector('[data-annulla]'));
  if(r) r.querySelector('[data-annulla]').click();
}, titolo);
await p.waitForTimeout(900);
const dopo=await p.evaluate(()=>({xp:LM.load().xp}));
ok('gli XP tornano come prima', dopo.xp===xp0, xp0+' → '+dopo.xp);
/* «non è più fatta» vale per tutte e due le specie: un'azione torna da fare,
   un'abitudine torna senza spunta */
const fatte1=await p.evaluate(tit=>{
  const t=LM.todayKey();
  const az=LM.azioniDiOggi().filter(a=>a.done && a.testo.indexOf(tit.trim())>=0).length;
  const ab=LM.load().abitudini.filter(h=>h.fatti[t] && h.testo.indexOf(tit.trim())>=0).length;
  return az+ab;
}, titolo);
ok('la cosa non è più fatta', fatte1===0, fatte1+' ancora fatte (titolo: '+titolo.trim()+')');
const toast=await p.evaluate(()=>[...document.querySelectorAll('.toast')].map(x=>x.textContent.replace(/\s+/g,' ').trim()));
ok('e il messaggio offre di rimettere', toast.some(x=>/Rimetti/.test(x)), JSON.stringify(toast));

console.log('\nL’ANNULLA DELL’ANNULLA');
/* l'ultimo messaggio in pila: quello di questo annulla, non di quelli prima */
await p.evaluate(()=>{const b=[...document.querySelectorAll('.toast button')].filter(x=>/Rimetti/.test(x.textContent)).pop();if(b)b.click();});
await p.waitForTimeout(800);
ok('rimette com’era', (await p.evaluate(()=>LM.load().xp))===xp1, String(await p.evaluate(()=>LM.load().xp)));

console.log('\nUNA COSA VECCHIA: avvisa quante ne rientrano');
await p.evaluate(()=>{localStorage.clear();LM.seedDemo();});await p.reload();await p.waitForTimeout(800);
await pulisci();
/* «Zero» serve solo a chiudere il conto col passato: il primo punto dopo una
   pulizia si prende i cinque secondi precedenti, dove ci sono ancora le righe
   appena seminate */
/* una alla volta, con un attimo in mezzo: quattro salvataggi nello stesso
   millisecondo si confondono fra loro, e non è così che si usa l'app */
for (const t of ['Zero','Uno','Due','Tre']) { await p.evaluate(x=>LM.aggiungiAzione(x,'altro',{}), t); await p.waitForTimeout(120); }
await p.waitForTimeout(300);
ok('quattro cose fatte = quattro punti', (await p.evaluate(()=>LM.puntiDiRitorno().length))===4, String(await p.evaluate(()=>LM.puntiDiRitorno().length)));
await alDiario();
const righe=await p.evaluate(()=>[...document.querySelectorAll('[data-annulla]')].map(b=>b.closest('.diario-evento').textContent.replace(/\s+/g,' ').trim().slice(0,40)));
console.log('        righe annullabili: '+JSON.stringify(righe.slice(0,4)));
/* l'unico tasto che passa dal punto di ritorno: le tre righe appena create
   sono di registro, un dato da togliere non l'hanno, e il tasto sta su una
   sola delle tre perché il cambiamento è lo stesso punto */
/* la riga di «Uno»: è di registro, un dato da togliere non l'ha, e per
   annullarla si passa dal punto — che riporta indietro anche Due e Tre */
const rigaUno=await p.evaluate(()=>{const r=[...document.querySelectorAll('.diario-evento')]
  .find(x=>/«Uno»/.test(x.textContent));
  if(!r)return 'riga assente';
  const b=r.querySelector('[data-annulla]');
  if(!b)return 'riga senza tasto';
  if(b.getAttribute('data-tipo'))return 'tasto con un dato da togliere: '+b.getAttribute('data-tipo');
  b.click();return 'ok';});
ok('la riga di «Uno» si annulla dal punto di ritorno', rigaUno==='ok', rigaUno);
await p.waitForTimeout(700);
const avv=await p.evaluate(()=>{const a=document.querySelector('.avviso');return a?a.textContent.replace(/\s+/g,' ').trim():null;});
ok('chiede conferma e dice quante rientrano', avv && /anche quello che hai fatto dopo: 2/.test(avv), avv);
await p.evaluate(()=>{const b=document.querySelector('.avv-si');if(b)b.click();});await p.waitForTimeout(900);
const restano=await p.evaluate(()=>LM.load().azioni.filter(a=>['Uno','Due','Tre'].indexOf(a.testo)>=0).map(a=>a.testo));
ok('tornando indietro rientrano tutte e tre', restano.length===0, JSON.stringify(restano));
ok('e quello di prima resta dov’era', (await p.evaluate(()=>LM.load().azioni.some(a=>a.testo==='Zero')))===true);

console.log('\nOGNI TIPO DI RIGA HA IL SUO INVERSO');
await p.evaluate(()=>{localStorage.clear();LM.seedDemo();});await p.reload();await p.waitForTimeout(800);
const inversi=await p.evaluate(()=>{
  const s=LM.load(); const out={};
  const km=Object.keys(s.pianoMattina)[0], ks=Object.keys(s.reviewSera)[0], kw=Object.keys(s.reviewSettimana)[0];
  const c=s.checkins[0], nota=s.inbox[0], az=s.azioni.find(a=>a.done);
  out.mattina=LM.annullaRecord('mattina',km) && !LM.load().pianoMattina[km];
  out.sera=LM.annullaRecord('sera',ks) && !LM.load().reviewSera[ks];
  out.settimana=LM.annullaRecord('settimana',kw) && !LM.load().reviewSettimana[kw];
  out.checkin=LM.annullaRecord('checkin',String(c.ts)) && !LM.load().checkins.some(x=>x.ts===c.ts);
  out.cattura=LM.annullaRecord('cattura',nota.id) && !LM.load().inbox.some(x=>x.id===nota.id);
  out.azione=LM.annullaRecord('azione',az.id) && !LM.load().azioni.find(x=>x.id===az.id).done;
  /* una chiave che non esiste non deve inventarsi niente */
  /* la spunta di un'abitudine nel diario è una riga di registro, ma si porta
     dietro il suo inverso: e la chiave dice in che stato deve finire, così
     annullare due volte la stessa riga non la rispunta */
  const ab=s.abitudini[0], gg=LM.todayKey();
  LM.completaAbitudine(ab.id, gg);
  out.abitudine=LM.annullaRecord('abitudine',ab.id+'|'+gg+'|0') && !LM.load().abitudini.find(x=>x.id===ab.id).fatti[gg];
  out.abitudineDueVolte=LM.annullaRecord('abitudine',ab.id+'|'+gg+'|0')===false;
  out.rigaConDisfa=LM.diario(3,true).some(g=>g.eventi.some(e=>e.tipo==='registro'&&e.tipoDisfa==='abitudine'&&e.chiave));
  out.inventata=LM.annullaRecord('sera','2001-01-01')===false;
  out.tipoIgnoto=LM.annullaRecord('registro','qualunque')===false;
  return out;});
Object.keys(inversi).forEach(k=>ok('inverso di «'+k+'»', inversi[k]===true, String(inversi[k])));

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
